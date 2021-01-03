import * as http from "http";

import chai from "chai";
import { expect } from "chai";
import ChaiAsPromised from "chai-as-promised";
// import fetch from 'node-fetch';

import api from "../src/api";
import { dbClient } from "../src/database";
import { Box } from "../src/lib/storage";

import * as data from "../mocks/data/storage";

chai.use(ChaiAsPromised);

let listener: http.Server;

before(async () => {
  listener = api.listen(8080);
  await dbClient.connect();
});

after(async () => {
  listener.close();
  await dbClient.close();
});

beforeEach(async () => {
  const database = dbClient.db("test");

  await database.collection("boxes").insertMany(data.database.box);
});

afterEach(async () => {
  const database = dbClient.db("test");
  await database.dropDatabase();
});

describe("Box", () => {
  describe("get", () => {
    data.database.box.forEach((box) => {
      it(`${box.label}`, async () => {
        const result = await Box.get(box._id.toHexString());
        expect(result.label).to.equal(box.label);
      });
    });
  });
});
