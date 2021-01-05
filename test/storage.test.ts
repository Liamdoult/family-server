import * as http from 'http';

import chai from 'chai';
import { expect } from 'chai';
import ChaiAsPromised from 'chai-as-promised';
// import fetch from 'node-fetch';

import api from '../src/api';
import { dbClient } from '../src/database';
import { Box } from '../src/lib/storage';
import { Item } from '../src/lib/storage';
import * as errors from '../src/lib/errors';

import * as data from '../mocks/data/storage';

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
  const database = dbClient.db('test');
  await database.collection('items').insertMany(data.database.item);
  await database.collection('boxes').insertMany(data.database.box);
}

async function cleanDB() {
  const database = dbClient.db('test');
  await database.dropDatabase();
}

describe('Item', () => {
  describe('validation', () => {
    describe('Base', () => {
      describe('valid', () => {
        data.item.base.valid.forEach((item) => {
          it(`${item.name}`, () => {
            expect(Item.validateBase(item));
          });
        });
      });

      describe('invalid', () => {
        data.item.base.invalid.forEach((item) => {
          it(`${item.name}`, () => {
            expect(!Item.validateBase(Item));
          });
        });
      });
    });

    describe('Registered', () => {
      describe('valid', () => {
        data.item.registered.valid.forEach((item) => {
          it(`${item.name}`, () => {
            expect(Item.validateBase(item));
          });
        });
      });

      describe('invalid', () => {
        data.item.registered.invalid.forEach((item) => {
          it(`${item.name}`, () => {
            expect(!Item.validateBase(Item));
          });
        });
      });
    });
  });

  describe('Requires DB', () => {
    beforeEach(initDB);
    afterEach(cleanDB);

    describe('get', () => {
      data.database.item.forEach((item) => {
        it(`${item.name}`, async () => {
          const result = await Item.get(item._id.toHexString());
          expect(result.name).to.equal(item.name);
        });
      });

      ['5fb6924cc65ca0101736bbc3', '', 'a'].forEach((_id) => {
        it(`NotFound "${_id}"`, async () => {
          await expect(Box.get(_id)).to.be.rejectedWith(errors.NotFoundError);
        });
      });
    });

    describe('update', () => {
      it('rename', async () => {
        let testItem = {
          ...data.database.item[0],
          _id: data.database.item[0]._id.toHexString(),
        };
        const item = new Item.Registered(testItem);
        await item.rename('new name');
        expect(item.description).to.equal(testItem.description);
        expect(item.name).to.equal('new name');
        expect((await Item.get(testItem._id)).name).to.equal('new name');
      });

      it('updateQuantity', async () => {
        let testItem = {
          ...data.database.item[0],
          _id: data.database.item[0]._id.toHexString(),
        };
        const item = new Item.Registered(testItem);
        expect(item.name).to.equal(testItem.name);
        await item.updateQuantity(4);
        expect(item.quantity).to.equal(4);
        expect((await Item.get(testItem._id)).quantity).to.equal(4);
      });

      it('updateDescription', async () => {
        let testItem = {
          ...data.database.item[0],
          _id: data.database.item[0]._id.toHexString(),
        };
        const item = new Item.Registered(testItem);
        await item.updateDescription('new description');
        expect(item.name).to.equal(testItem.name);
        expect(item.description).to.equal('new description');
        expect((await Item.get(testItem._id)).description).to.equal(
          'new description'
        );
      });

      it('updateOwner', async () => {
        let testItem = {
          ...data.database.item[0],
          _id: data.database.item[0]._id.toHexString(),
        };
        const item = new Item.Registered(testItem);
        await item.updateOwner('Martina');
        expect(item.name).to.equal(testItem.name);
        expect(item.owner).to.equal('Martina');
        expect((await Item.get(testItem._id)).owner).to.equal('Martina');
      });
    });
  });
});

describe('Box', () => {
  describe('Requires DB', () => {
    beforeEach(initDB);
    afterEach(cleanDB);

    describe('get', () => {
      data.database.box.forEach((box) => {
        it(`${box.label}`, async () => {
          const result = await Box.get(box._id.toHexString());
          expect(result.label).to.equal(box.label);
        });
      });

      ['5fb6924cc65ca0101736bbc3', '', 'a'].forEach((_id) => {
        it(`NotFound "${_id}"`, async () => {
          await expect(Box.get(_id)).to.be.rejectedWith(errors.NotFoundError);
        });
      });
    });

    describe('register', () => {
      describe('valid', () => {
        data.box.base.valid.forEach((box) => {
          it(`${box.label}`, async () => {
            const result = await Box.register(box, []);
            expect(result.label).to.equal(box.label);
          });
        });
      });

      describe('invalid', () => {
        data.box.base.invalid.forEach((box) => {
          it(`${box.label}`, async () => {
            await expect(Box.register(box as Box.Base, [])).to.be.rejectedWith(
              errors.ValueError
            );
          });
        });
      });
    });

    describe('update', () => {
      it('relabel', async () => {
        let testBox = {
          ...data.database.box[0],
          _id: data.database.box[0]._id.toHexString(),
        };
        const box = new Box.Registered(testBox);
        await box.relabel('new label');
        expect(box.description).to.equal(testBox.description);
        expect(box.label).to.equal('new label');
        expect((await Box.get(testBox._id)).label).to.equal('new label');
      });

      it('move', async () => {
        let testBox = {
          ...data.database.box[0],
          _id: data.database.box[0]._id.toHexString(),
        };
        const box = new Box.Registered(testBox);
        await box.move('bathroom');
        expect(box.label).to.equal(testBox.label);
        expect(box.location).to.equal('bathroom');
        expect((await Box.get(testBox._id)).location).to.equal('bathroom');
      });

      it('updateDescription', async () => {
        let testBox = {
          ...data.database.box[0],
          _id: data.database.box[0]._id.toHexString(),
        };
        const box = new Box.Registered(testBox);
        await box.updateDescription('stores my shit');
        expect(box.label).to.equal(testBox.label);
        expect(box.description).to.equal('stores my shit');
        expect((await Box.get(testBox._id)).description).to.equal(
          'stores my shit'
        );
      });

      it('addItem', async () => {
        let testBox = {
          ...data.database.box[0],
          _id: data.database.box[0]._id.toHexString(),
        };
        const box = new Box.Registered(testBox);
        await box.addItem({ name: 'new item' });
        expect(box.label).to.equal(testBox.label);
        expect(box.items[box.items.length - 1].name).to.equal('new item');

        const fetchedBox = await Box.get(testBox._id);
        expect(fetchedBox.items[fetchedBox.items.length - 1].name).to.equal(
          'new item'
        );
      });

      it('addItems', async () => {
        let testBox = {
          ...data.database.box[0],
          _id: data.database.box[0]._id.toHexString(),
        };
        const box = new Box.Registered(testBox);
        await box.addItems([{ name: 'new item' }]);
        expect(box.label).to.equal(testBox.label);
        expect(box.items[box.items.length - 1].name).to.equal('new item');

        const fetchedBox = await Box.get(testBox._id);
        expect(fetchedBox.items[fetchedBox.items.length - 1].name).to.equal(
          'new item'
        );
      });
    });
  });

  describe('validation', () => {
    describe('Partial', () => {
      describe('valid', () => {
        data.box.partial.valid.forEach((box) => {
          it(`${box.label || box.location || box.description}`, () => {
            expect(Box.validatePartial(box));
          });
        });
      });

      describe('invalid', () => {
        data.box.partial.invalid.forEach((box) => {
          it(`${Object.keys(box)}`, () => {
            expect(!Box.validatePartial(box));
          });
        });
      });
    });

    describe('Base', () => {
      describe('valid', () => {
        data.box.base.valid.forEach((box) => {
          it(`${box.label}`, () => {
            expect(Box.validateBase(box));
          });
        });
      });

      describe('invalid', () => {
        data.box.base.invalid.forEach((box) => {
          it(`${box.label}`, () => {
            expect(!Box.validateBase(box));
          });
        });
      });
    });
  });
});
