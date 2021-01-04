import * as http from "http";

import chai from "chai";
import { expect } from "chai";
import ChaiAsPromised from "chai-as-promised";
// import fetch from 'node-fetch';

import api from "../src/api";
import { dbClient } from "../src/database";
import { Box } from "../src/lib/storage";
import * as errors from "../src/lib/errors";

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

    ["5fb6924cc65ca0101736bbc3", "", "a"].forEach((_id) => {
      it(`NotFound "${_id}"`, async () => {
        await expect(Box.get(_id)).to.be.rejectedWith(errors.NotFoundError);
      });
    });
  });

  describe("validation", () => {
    describe("Partial", () => {
      describe("valid", () => {
        data.box.partial.valid.forEach((box) => {
          it(`${box.label || box.location || box.description}`, () => {
            const result = Box.validatePartial(box);
            if (box.label) expect(result.label).to.equal(box.label);
            if (box.description)
              expect(result.description).to.equal(box.description);
            if (box.location) expect(result.location).to.equal(box.location);
          });
        });
      });

      describe("invalid", () => {
        data.box.partial.invalid.forEach((box) => {
          it(`${Object.keys(box)}`, () => {
            expect(() => Box.validatePartial(box)).to.throw(errors.ValueError);
          });
        });
      });
    });

    describe("Base", () => {
      describe("valid", () => {
        data.box.base.valid.forEach((box) => {
          it(`${box.label}`, () => {
            const result = Box.validateBase(box);
            expect(result.label).to.equal(box.label);
          });
        });
      });

      describe("invalid", () => {
        data.box.base.invalid.forEach((box) => {
          it(`${box.label}`, () => {
            expect(() => Box.validateBase(box)).to.throw(errors.ValueError);
          });
        });
      });
    });

    describe("Registered", () => {
      describe("valid", () => {
        data.box.registered.valid.forEach((box) => {
          it(`${box.label}`, async () => {
            const result = Box.validateRegistered(box);
            expect(result.label).to.equal(box.label);
          });
        });
      });

      describe("invalid", () => {
        data.box.registered.invalid.forEach((box) => {
          it(`${box.label}`, () => {
            expect(() => Box.validateRegistered(box)).to.throw(
              errors.ValueError
            );
          });
        });
      });
    });
  });

  describe("register", () => {
    describe("valid", () => {
      data.box.base.valid.forEach((box) => {
        it(`${box.label}`, async () => {
          const result = await Box.register(box, []);
          expect(result.label).to.equal(box.label);
        });
      });
    });

    describe("invalid", () => {
      data.box.base.invalid.forEach((box) => {
        it(`${box.label}`, async () => {
          await expect(Box.register(box as Box.Base, [])).to.be.rejectedWith(
            errors.ValueError
          );
        });
      });
    });
  });
});
