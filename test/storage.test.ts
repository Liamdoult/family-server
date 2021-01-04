import * as http from "http";

import chai from "chai";
import { expect } from "chai";
import ChaiAsPromised from "chai-as-promised";
// import fetch from 'node-fetch';

import api from "../src/api";
import { dbClient } from "../src/database";
import { Box } from "../src/lib/storage";
import { Item } from "../src/lib/storage";
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

async function initDB() {
  const database = dbClient.db("test");
  await database.collection("boxes").insertMany(data.database.box);
}

async function cleanDB() {
  const database = dbClient.db("test");
  await database.dropDatabase();
}

describe("Item", () => {
  describe("validation", () => {
    describe("Base", () => {
      describe("valid", () => {
        data.item.base.valid.forEach((item) => {
          it(`${item.name}`, () => {
            expect(Item.validateBase(item));
          });
        });
      });

      describe("invalid", () => {
        data.item.base.invalid.forEach((item) => {
          it(`${item.name}`, () => {
            expect(!Item.validateBase(Item));
          });
        });
      });
    });

    describe("Registered", () => {
      describe("valid", () => {
        data.item.registered.valid.forEach((item) => {
          it(`${item.name}`, () => {
            expect(Item.validateBase(item));
          });
        });
      });

      describe("invalid", () => {
        data.item.registered.invalid.forEach((item) => {
          it(`${item.name}`, () => {
            expect(!Item.validateBase(Item));
          });
        });
      });
    });
  });
});

describe("Box", () => {
  describe("Requires DB", () => {
    beforeEach(initDB);
    afterEach(cleanDB);

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

    describe("update", () => {
      it("relabel", async () => {
        let testBox = {
          ...data.database.box[0],
          _id: data.database.box[0]._id.toHexString(),
        };
        const box = new Box.Registered(testBox);
        await box.relabel("new label");
        expect(box.label).to.equal("new label");
        expect((await Box.get(testBox._id)).label).to.equal("new label");
      });

      it("move", async () => {
        let testBox = {
          ...data.database.box[0],
          _id: data.database.box[0]._id.toHexString(),
        };
        const box = new Box.Registered(testBox);
        await box.move("bathroom");
        expect(box.location).to.equal("bathroom");
        expect((await Box.get(testBox._id)).location).to.equal("bathroom");
      });

      it("updateDescription", async () => {
        let testBox = {
          ...data.database.box[0],
          _id: data.database.box[0]._id.toHexString(),
        };
        const box = new Box.Registered(testBox);
        await box.updateDescription("stores my shit");
        expect(box.description).to.equal("stores my shit");
        expect((await Box.get(testBox._id)).description).to.equal(
          "stores my shit"
        );
      });
    });
  });

  describe("validation", () => {
    describe("Partial", () => {
      describe("valid", () => {
        data.box.partial.valid.forEach((box) => {
          it(`${box.label || box.location || box.description}`, () => {
            expect(Box.validatePartial(box));
          });
        });
      });

      describe("invalid", () => {
        data.box.partial.invalid.forEach((box) => {
          it(`${Object.keys(box)}`, () => {
            expect(!Box.validatePartial(box));
          });
        });
      });
    });

    describe("Base", () => {
      describe("valid", () => {
        data.box.base.valid.forEach((box) => {
          it(`${box.label}`, () => {
            expect(Box.validateBase(box));
          });
        });
      });

      describe("invalid", () => {
        data.box.base.invalid.forEach((box) => {
          it(`${box.label}`, () => {
            expect(!Box.validateBase(box));
          });
        });
      });
    });
  });
});
