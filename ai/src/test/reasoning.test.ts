import {strict as assert} from 'node:assert';
import {createServer, ServerResponse} from 'node:http';
import {test} from 'node:test';
import {OpenAICompatibleProvider} from '../providers';

async function withProvider(
  reply: (response: ServerResponse, request: Record<string, unknown>) => void,
  check: (provider: OpenAICompatibleProvider) => Promise<void>,
): Promise<void> {
  const server = createServer(async (request, response) => {
    const chunks: Buffer[] = [];
    for await (const chunk of request) chunks.push(Buffer.from(chunk));
    reply(response, JSON.parse(Buffer.concat(chunks).toString('utf8')));
  });
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  assert.ok(address && typeof address === 'object');
  try {
    await check(new OpenAICompatibleProvider({id: 'thinking', kind: 'openai-compatible', baseUrl: `http://127.0.0.1:${address.port}`, model: 'test'}));
  } finally {
    server.closeAllConnections();
    await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
}

for (const field of ['reasoning_content', 'reasoning', 'thinking']) {
  test(`JSON reasoning from ${field} stays separate and preserves exact answer text`, async () => {
    await withProvider((response) => {
      response.end(JSON.stringify({choices: [{message: {content: '  answer\n', [field]: 'thought'}}]}));
    }, async (provider) => {
      const result = await provider.run({prompt: 'test', onReasoning: () => {}});
      assert.equal(result.output, '  answer\n');
      assert.equal(result.reasoning, 'thought');
    });
  });
}

test('fragmented UTF-8 and CRLF reasoning streams preserve repeated deltas and finish without DONE', async () => {
  await withProvider((response, request) => {
    assert.equal(request.stream, true);
    response.setHeader('content-type', 'text/event-stream');
    const stream = Buffer.from([
      ': heartbeat',
      'data: ' + JSON.stringify({choices: [{delta: {reasoning_content: '\u601d'}}]}),
      'data: ' + JSON.stringify({choices: [{delta: {reasoning: '\u601d'}}]}),
      'data: ' + JSON.stringify({choices: [{delta: {content: 'answer'}, finish_reason: 'stop'}]}),
    ].join('\r\n\r\n') + '\r\n\r\n');
    const split = stream.indexOf(Buffer.from('\u601d')) + 1;
    response.write(stream.subarray(0, split));
    setImmediate(() => response.end(stream.subarray(split)));
  }, async (provider) => {
    const deltas: string[] = [];
    const result = await provider.run({prompt: 'test', onReasoning: (delta) => deltas.push(delta)});
    assert.equal(result.reasoning, '\u601d\u601d');
    assert.deepEqual(deltas, ['\u601d', '\u601d']);
    assert.equal(result.output, 'answer');
  });
});

test('DONE finalizes embedded think text without stripping literal tags elsewhere', async () => {
  await withProvider((response) => {
    response.setHeader('content-type', 'text/event-stream');
    response.end('data: ' + JSON.stringify({choices: [{delta: {content: '<think>thought</think>answer <think>literal</think>'}}]}) + '\n\ndata: [DONE]\n\n');
  }, async (provider) => {
    const deltas: string[] = [];
    const result = await provider.run({prompt: 'test', onReasoning: (delta) => deltas.push(delta)});
    assert.equal(result.output, 'answer <think>literal</think>');
    assert.equal(result.reasoning, 'thought');
    assert.deepEqual(deltas, ['thought']);
  });
});

for (const [name, data, error] of [
  ['truncated', 'data: {"choices":[{"delta":{"content":"partial"}}]}\n\n', /before completion/],
  ['invalid JSON', 'data: invalid\n\n', /invalid stream JSON/],
  ['provider error', 'data: {"error":{"message":"PRIVATE_DIAGNOSTIC"}}\n\n', /stream error/],
  ['oversized', 'data: ' + 'x'.repeat(1024 * 1024), /exceeded 1 MiB/],
] as const) {
  test(`reasoning stream rejects ${name} without success or diagnostic leaks`, async () => {
    await withProvider((response) => {
      response.setHeader('content-type', 'text/event-stream');
      response.end(data);
    }, async (provider) => {
      await assert.rejects(provider.run({prompt: 'test', onReasoning: () => {}}), (failure: Error) => {
        assert.match(failure.message, error);
        assert.doesNotMatch(failure.message, /PRIVATE_DIAGNOSTIC/);
        return true;
      });
    });
  });
}

test('cancelling a reasoning stream retains already delivered deltas and stops the request', async () => {
  await withProvider((response) => {
    response.setHeader('content-type', 'text/event-stream');
    response.write('data: {"choices":[{"delta":{"reasoning_content":"partial thought"}}]}\n\n');
  }, async (provider) => {
    const controller = new AbortController();
    const deltas: string[] = [];
    const result = await provider.run({prompt: 'test', signal: controller.signal, onReasoning: (delta) => {
      deltas.push(delta);
      controller.abort();
    }});
    assert.equal(result.cancelled, true);
    assert.deepEqual(deltas, ['partial thought']);
  });
});
