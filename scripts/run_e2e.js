const { spawn, execSync } = require('child_process');
const net = require('net');
const fs = require('fs');

const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const RESET = '\x1b[0m';

function log(msg) {
  console.log(`${GREEN}[E2E Runner] ${msg}${RESET}`);
}

function error(msg) {
  console.error(`${RED}[E2E Runner] ${msg}${RESET}`);
}

async function checkPort(port, timeout = 120000) {
  log(`Checking port ${port}...`);
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      await new Promise((resolve, reject) => {
        const socket = new net.Socket();
        socket.setTimeout(200);
        socket.on('connect', () => {
          socket.destroy();
          resolve();
        });
        socket.on('timeout', () => {
          socket.destroy();
          reject(new Error('timeout'));
        });
        socket.on('error', (err) => {
          socket.destroy();
          reject(err);
        });
        socket.connect(port, 'localhost');
      });
      log(`Port ${port} is ready!`);
      return true;
    } catch (e) {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
  throw new Error(`Timeout waiting for port ${port}`);
}

async function checkUrl(url, timeout = 120000) {
  log(`Checking URL ${url}...`);
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      execSync(`curl -s -f -o /dev/null --max-time 1 ${url}`);
      log(`URL ${url} is ready!`);
      return true;
    } catch (e) {
      await new Promise(r => setTimeout(r, 1000));
    }
  }
  throw new Error(`Timeout waiting for URL ${url}`);
}

async function run() {
  const production = process.argv.includes('--production');
  const processes = [];

  const cleanup = () => {
    log('Stopping all processes...');
    processes.forEach((p) => {
      if (!p.killed) p.kill();
    });
  };

  process.on('SIGINT', () => {
    cleanup();
    process.exit(1);
  });

  process.on('exit', cleanup);

  try {
    if (production) {
      process.env.AOSP_WINSCOPE_E2E_PRODUCTION = '1';
      process.env.AOSP_WINSCOPE_E2E_WINSCOPE_URL = 'http://127.0.0.1:8080';
    }
    // 1. Install chromedriver for the development runner; production validation
    // intentionally uses the already-prepared offline driver.
    if (!production) {
      log('Installing chromedriver...');
      execSync('npm run install:chromedriver', { stdio: 'inherit' });
    }

    // 2. Build E2E tests (sync)
    log('Cleaning up E2E test output directories...');
    execSync('rm -rf dist/e2e_test && npx tsc -p ./src/test/e2e', { stdio: 'inherit' });

    // 3. Start the application under test. Production validation serves the
    // already-built dist/prod tree and omits the remote-tool mock.
    const app = production
      ? spawn('python3', ['-m', 'http.server', '8080', '--bind', '127.0.0.1', '--directory', 'dist/prod'], {
          stdio: 'inherit',
          env: { ...process.env, AOSP_WINSCOPE_E2E_PRODUCTION: '1', AOSP_WINSCOPE_E2E_WINSCOPE_URL: 'http://127.0.0.1:8080' },
        })
      : spawn('ng', ['serve', 'winscope'], { stdio: 'inherit', shell: true });
    processes.push(app);
    if (!production) {
      log('Starting Remote Tool Mock (port 8081)...');
      const mock = spawn('ng', ['serve', 'remote-tool-mock'], { stdio: 'inherit', shell: true });
      processes.push(mock);
    }

    // 5. Wait for ports
    log('Waiting for services to be ready...');
    await Promise.all([
      checkPort(8080),
      ...(production ? [] : [
        checkPort(8081),
        checkUrl('http://localhost:8081/index.html'),
        checkUrl('http://localhost:8080/mock/index.html'),
      ]),
      checkUrl('http://localhost:8080/index.html'),
    ]);
    log('Services are ready!');

    // 6. Build tests
    log('building tests...');
    execSync('npx tsc -p src/test/e2e/tsconfig.json', { stdio: 'inherit' });

    // 7. Run the Selenium/Jasmine browser suite.
    log('Running browser E2E tests...');
    try {
      const specs = production
        ? fs.readdirSync('dist/e2e_test')
            .filter((name) => name.endsWith('_test.js') && name !== 'cross_tool_protocol_test.js')
            .map((name) => `dist/e2e_test/${name}`)
            .join(' ')
        : '';
      execSync(`npx jasmine --config=e2e.jasmine.json ${specs}`, { stdio: 'inherit' });
      log('E2E Tests Passed! 🎉');
      cleanup();
    } catch (e) {
      error('E2E Tests Failed! 💥');
      process.exit(1);
    }

  } catch (e) {
    error(`Error: ${e.message}`);
    process.exit(1);
  }
}

run();
