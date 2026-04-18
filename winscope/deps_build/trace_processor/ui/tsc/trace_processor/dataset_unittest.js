"use strict";
// Copyright (C) 2024 The Android Open Source Project
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Object.defineProperty(exports, "__esModule", { value: true });
const dataset_1 = require("./dataset");
const query_result_1 = require("./query_result");
test('get query for simple dataset', () => {
    const dataset = new dataset_1.SourceDataset({
        src: 'slice',
        schema: { id: query_result_1.NUM },
    });
    expect(dataset.query()).toEqual('select id from (slice)');
});
test("get query for simple dataset with 'eq' filter", () => {
    const dataset = new dataset_1.SourceDataset({
        src: 'slice',
        schema: { id: query_result_1.NUM },
        filter: {
            col: 'id',
            eq: 123,
        },
    });
    expect(dataset.query()).toEqual('select id from (slice) where id = 123');
});
test("get query for simple dataset with an 'in' filter", () => {
    const dataset = new dataset_1.SourceDataset({
        src: 'slice',
        schema: { id: query_result_1.NUM },
        filter: {
            col: 'id',
            in: [123, 456],
        },
    });
    expect(dataset.query()).toEqual('select id from (slice) where id in (123,456)');
});
test('get query for union dataset', () => {
    const dataset = new dataset_1.UnionDataset([
        new dataset_1.SourceDataset({
            src: 'slice',
            schema: { id: query_result_1.NUM },
            filter: {
                col: 'id',
                eq: 123,
            },
        }),
        new dataset_1.SourceDataset({
            src: 'slice',
            schema: { id: query_result_1.NUM },
            filter: {
                col: 'id',
                eq: 456,
            },
        }),
    ]);
    expect(dataset.query()).toEqual('select id from (slice) where id = 123\nunion all\nselect id from (slice) where id = 456');
});
test('union dataset batches large numbers of unions', () => {
    const datasets = [];
    for (let i = 0; i < 800; i++) {
        datasets.push(new dataset_1.SourceDataset({
            src: 'foo',
            schema: { bar: query_result_1.NUM },
            filter: {
                col: 'some_id',
                eq: i,
            },
        }));
    }
    const query = new dataset_1.UnionDataset(datasets).query();
    // Verify query structure with CTE batching.
    expect(query).toContain('with');
    // Should have at least 2 CTE batches.
    expect(query).toContain('union_batch_0 as');
    expect(query).toContain('union_batch_1 as');
    // 798 union alls within batches (for 800 datasets) + 1 union alls between the
    // 2 CTEs.
    const batchMatches = query.match(/union all/g);
    expect(batchMatches?.length).toBe(799);
});
test('implements', () => {
    const dataset = new dataset_1.SourceDataset({
        src: 'slice',
        schema: { id: query_result_1.NUM, ts: query_result_1.LONG },
    });
    expect(dataset.implements({ id: query_result_1.NUM })).toBe(true);
    expect(dataset.implements({ id: query_result_1.NUM, ts: query_result_1.LONG })).toBe(true);
    expect(dataset.implements({ id: query_result_1.NUM, ts: query_result_1.LONG, name: query_result_1.STR })).toBe(false);
    expect(dataset.implements({ id: query_result_1.LONG })).toBe(false);
});
test('implements with relaxed compat checks on optional types', () => {
    expect(new dataset_1.SourceDataset({
        src: 'slice',
        schema: { foo: query_result_1.NUM_NULL, bar: query_result_1.LONG_NULL, baz: query_result_1.STR_NULL, qux: query_result_1.BLOB_NULL },
    }).implements({
        foo: query_result_1.NUM_NULL,
        bar: query_result_1.LONG_NULL,
        baz: query_result_1.STR_NULL,
        qux: query_result_1.BLOB_NULL,
    })).toBe(true);
    expect(new dataset_1.SourceDataset({
        src: 'slice',
        schema: { foo: query_result_1.NUM, bar: query_result_1.LONG, baz: query_result_1.STR, qux: query_result_1.BLOB },
    }).implements({
        foo: query_result_1.NUM_NULL,
        bar: query_result_1.LONG_NULL,
        baz: query_result_1.STR_NULL,
        qux: query_result_1.BLOB_NULL,
    })).toBe(true);
    expect(new dataset_1.SourceDataset({
        src: 'slice',
        schema: { foo: query_result_1.NUM_NULL, bar: query_result_1.LONG_NULL, baz: query_result_1.STR_NULL, qux: query_result_1.BLOB_NULL },
    }).implements({
        foo: query_result_1.NUM,
        bar: query_result_1.LONG,
        baz: query_result_1.STR,
        qux: query_result_1.BLOB,
    })).toBe(false);
});
test('find the schema of a simple dataset', () => {
    const dataset = new dataset_1.SourceDataset({
        src: 'slice',
        schema: { id: query_result_1.NUM, ts: query_result_1.LONG },
    });
    expect(dataset.schema).toMatchObject({ id: query_result_1.NUM, ts: query_result_1.LONG });
});
test('find the schema of a union where source sets differ in their names', () => {
    const dataset = new dataset_1.UnionDataset([
        new dataset_1.SourceDataset({
            src: 'slice',
            schema: { foo: query_result_1.NUM },
        }),
        new dataset_1.SourceDataset({
            src: 'slice',
            schema: { bar: query_result_1.NUM },
        }),
    ]);
    expect(dataset.schema).toMatchObject({});
});
test('find the schema of a union with differing source sets', () => {
    const dataset = new dataset_1.UnionDataset([
        new dataset_1.SourceDataset({
            src: 'slice',
            schema: { foo: query_result_1.NUM },
        }),
        new dataset_1.SourceDataset({
            src: 'slice',
            schema: { foo: query_result_1.LONG },
        }),
    ]);
    expect(dataset.schema).toMatchObject({});
});
test('find the schema of a union with one column in common', () => {
    const dataset = new dataset_1.UnionDataset([
        new dataset_1.SourceDataset({
            src: 'slice',
            schema: { foo: query_result_1.NUM, bar: query_result_1.NUM },
        }),
        new dataset_1.SourceDataset({
            src: 'slice',
            schema: { foo: query_result_1.NUM, baz: query_result_1.NUM },
        }),
    ]);
    expect(dataset.schema).toMatchObject({ foo: query_result_1.NUM });
});
test('optimize a union dataset', () => {
    const dataset = new dataset_1.UnionDataset([
        new dataset_1.SourceDataset({
            src: 'slice',
            schema: {},
            filter: {
                col: 'track_id',
                eq: 123,
            },
        }),
        new dataset_1.SourceDataset({
            src: 'slice',
            schema: {},
            filter: {
                col: 'track_id',
                eq: 456,
            },
        }),
    ]);
    expect(dataset.optimize()).toEqual({
        src: 'slice',
        schema: {},
        filter: {
            col: 'track_id',
            in: [123, 456],
        },
    });
});
test('optimize a union dataset with different types of filters', () => {
    const dataset = new dataset_1.UnionDataset([
        new dataset_1.SourceDataset({
            src: 'slice',
            schema: {},
            filter: {
                col: 'track_id',
                eq: 123,
            },
        }),
        new dataset_1.SourceDataset({
            src: 'slice',
            schema: {},
            filter: {
                col: 'track_id',
                in: [456, 789],
            },
        }),
    ]);
    expect(dataset.optimize()).toEqual({
        src: 'slice',
        schema: {},
        filter: {
            col: 'track_id',
            in: [123, 456, 789],
        },
    });
});
test('optimize a union dataset with different schemas', () => {
    const dataset = new dataset_1.UnionDataset([
        new dataset_1.SourceDataset({
            src: 'slice',
            schema: { foo: query_result_1.NUM },
        }),
        new dataset_1.SourceDataset({
            src: 'slice',
            schema: { bar: query_result_1.NUM },
        }),
    ]);
    expect(dataset.optimize()).toEqual({
        src: 'slice',
        // The resultant schema is the combination of the union's member's schemas,
        // as we know the source is the same as we know we can get all of the 'seen'
        // columns from the source.
        schema: {
            foo: query_result_1.NUM,
            bar: query_result_1.NUM,
        },
    });
});
test('union type widening', () => {
    const dataset = new dataset_1.UnionDataset([
        new dataset_1.SourceDataset({
            src: 'slice',
            schema: { foo: query_result_1.NUM, bar: query_result_1.STR_NULL, baz: query_result_1.BLOB, missing: query_result_1.UNKNOWN },
        }),
        new dataset_1.SourceDataset({
            src: 'slice',
            schema: { foo: query_result_1.NUM_NULL, bar: query_result_1.STR, baz: query_result_1.LONG },
        }),
    ]);
    expect(dataset.schema).toEqual({
        foo: query_result_1.NUM_NULL,
        bar: query_result_1.STR_NULL,
        baz: query_result_1.UNKNOWN,
    });
});
//# sourceMappingURL=dataset_unittest.js.map