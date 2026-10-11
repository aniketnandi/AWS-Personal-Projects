import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { mockClient } from "aws-sdk-client-mock";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
  GetCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { handler } from "../lambda/index.mjs";

const ddb = mockClient(DynamoDBDocumentClient);

beforeEach(() => ddb.reset());

test("PUT /items writes the item", async () => {
  ddb.on(PutCommand).resolves({});
  const res = await handler({
    routeKey: "PUT /items",
    body: JSON.stringify({ id: "124", marks: 98, name: "suhas" }),
  });
  assert.equal(res.statusCode, 200);
  assert.equal(JSON.parse(res.body), "Put item 124");
  assert.deepEqual(ddb.commandCalls(PutCommand)[0].args[0].input.Item, {
    id: "124",
    marks: 98,
    name: "suhas",
  });
});

test("GET /items returns all items", async () => {
  const items = [{ id: "124", marks: 98, name: "suhas" }];
  ddb.on(ScanCommand).resolves({ Items: items });
  const res = await handler({ routeKey: "GET /items" });
  assert.equal(res.statusCode, 200);
  assert.deepEqual(JSON.parse(res.body), items);
});

test("GET /items/{id} returns one item", async () => {
  const item = { id: "125", marks: 85, name: "gandhi" };
  ddb.on(GetCommand, { Key: { id: "125" } }).resolves({ Item: item });
  const res = await handler({
    routeKey: "GET /items/{id}",
    pathParameters: { id: "125" },
  });
  assert.equal(res.statusCode, 200);
  assert.deepEqual(JSON.parse(res.body), item);
});

test("DELETE /items/{id} deletes the item", async () => {
  ddb.on(DeleteCommand).resolves({});
  const res = await handler({
    routeKey: "DELETE /items/{id}",
    pathParameters: { id: "124" },
  });
  assert.equal(res.statusCode, 200);
  assert.equal(JSON.parse(res.body), "Deleted item 124");
  assert.deepEqual(ddb.commandCalls(DeleteCommand)[0].args[0].input.Key, { id: "124" });
});

test("unknown route returns 400", async () => {
  const res = await handler({ routeKey: "POST /items" });
  assert.equal(res.statusCode, 400);
  assert.match(JSON.parse(res.body), /Unsupported route/);
});

test("invalid JSON body returns 400", async () => {
  const res = await handler({ routeKey: "PUT /items", body: "{not json" });
  assert.equal(res.statusCode, 400);
});
