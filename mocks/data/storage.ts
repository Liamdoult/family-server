import { ObjectId } from 'mongodb';

export const item = {
  base: {
    valid: [
      {
        name: 'Spare wheel',
      },
      {
        name: 'Spoke',
        description: 'replacement spoke for my bike',
      },
      {
        name: 'Spoke',
        description: '',
      },
      {
        name: 'new grips',
        owner: 'Liam',
      },
      {
        name: 'peddles',
        quantity: 2,
      },
      {
        name: 'Shoes',
        description: 'Scott',
        owner: 'liam',
        quantity: 1,
      },
    ],
    invalid: [
      {},
      {
        name: {},
      },
      {
        name: 'empty owner name',
        owner: 'owner',
      },
      {
        name: 'invalid owner name type',
        owner: {},
      },
      {
        name: 'string quantity',
        quantity: '2',
      },
    ],
  },
  registered: {
    valid: [
      {
        name: 'Spare wheel',
        _id: '5fb6924cc65ca0101736bbc4',
        created: new Date(1605800524626),
      },
      {
        name: 'Spoke',
        _id: '5fb6924cc65ca0101736bbc4',
        created: new Date(1605800524626),
        description: 'replacement spoke for my bike',
      },
      {
        name: 'Spoke',
        _id: '5fb6924cc65ca0101736bbc4',
        created: new Date(1605800524626),
        description: '',
      },
      {
        name: 'new grips',
        _id: '5fb6924cc65ca0101736bbc4',
        created: new Date(1605800524626),
        owner: 'Liam',
      },
      {
        name: 'peddles',
        _id: '5fb6924cc65ca0101736bbc4',
        created: new Date(1605800524626),
        quantity: 2,
      },
      {
        name: 'Shoes',
        _id: '5fb6924cc65ca0101736bbc4',
        created: new Date(1605800524626),
        description: 'Scott',
        owner: 'liam',
        quantity: 1,
      },
    ],
    invalid: [
      {},
      {
        name: {},
        _id: '5fb6924cc65ca0101736bbc4',
        created: new Date(1605800524626),
      },
      {
        name: 'empty owner name',
        owner: 'owner',
        _id: '5fb6924cc65ca0101736bbc4',
        created: new Date(1605800524626),
      },
      {
        name: 'invalid owner name type',
        owner: {},
        _id: '5fb6924cc65ca0101736bbc4',
        created: new Date(1605800524626),
      },
      {
        name: 'string quantity',
        quantity: '2',
        _id: '5fb6924cc65ca0101736bbc4',
        created: new Date(1605800524626),
      },
      {
        name: 'No ID',
        created: new Date(1605800524626),
      },
      {
        name: 'Invalid Id length',
        _id: '5fb69',
        created: new Date(1605800524626),
      },
      {
        name: 'Invalid id Type',
        _id: {},
        created: new Date(1605800524626),
      },
      {
        name: 'No Created timestamp',
        _id: '5fb6924cc65ca0101736bbc4',
      },
      {
        name: 'Invalid timestamp type',
        _id: '5fb6924cc65ca0101736bbc4',
        created: {},
      },
    ],
  },
};

export const box = {
  base: {
    valid: [
      {
        label: 'Bike Stuff',
        location: 'Store room',
        description: 'All my random bike shit',
      },
      {
        label: 'G1',
        location: 'Garage',
      },
    ],
    invalid: [
      {
        label: '',
        location: 'Store room',
        description: 'Other stuff',
      },
      {
        location: 'Garage',
        description: 'Other stuff',
      },
      {
        label: 'G2',
        location: '',
      },
      {
        label: 'G3',
      },
      {
        label: {},
        location: 'Store room',
        description: 'All my random bike shit',
      },
      {
        label: 'Car stuff',
        location: {},
        description: 'All my random bike shit',
      },
      {
        label: 'Helicopter Stuff',
        location: 'Store room',
        description: {},
      },
    ],
  },
  registered: {
    valid: [
      {
        _id: '5fb6924cc65ca0101736bbc4',
        created: new Date(1605800524626),
        updated: [new Date('2020-11-29T11:44:21.944Z')],
        label: 'A1',
        location: 'Home Storage',
        items: [] as string[],
      },
      {
        _id: '5fb6924cc65ca0101736bbc4',
        created: new Date(1605800524626),
        updated: [new Date('2020-11-29T11:44:21.944Z')],
        label: 'A2',
        location: 'Home Storage',
        description: 'All my random bike shit',
        items: [] as string[],
      },
      {
        _id: '5fb6924cc65ca0101736bbc4',
        created: new Date(1605800524626),
        updated: [],
        label: 'A3',
        location: 'Home Storage',
        description: 'All my random bike shit',
        items: [] as string[],
      },
    ],
    invalid: [
      {
        created: new Date(1605800524626),
        updated: [new Date('2020-11-29T11:44:21.944Z')],
        label: 'no id',
        location: 'Home Storage',
        items: [] as string[],
      },
      {
        _id: 'asdafs',
        created: new Date(1605800524626),
        updated: [new Date('2020-11-29T11:44:21.944Z')],
        label: 'invalid id',
        location: 'Home Storage',
        description: 'All my random bike shit',
        items: [] as string[],
      },
      {
        _id: {},
        created: new Date(1605800524626),
        updated: [new Date('2020-11-29T11:44:21.944Z')],
        label: 'id not string',
        location: 'Home Storage',
        description: 'All my random bike shit',
        items: [] as string[],
      },
      {
        _id: '5fb6924cc65ca0101736bbc4',
        updated: [new Date('2020-11-29T11:44:21.944Z')],
        label: 'no created',
        location: 'Home Storage',
        items: [] as string[],
      },
      {
        _id: '5fb6924cc65ca0101736bbc4',
        created: '',
        updated: [new Date('2020-11-29T11:44:21.944Z')],
        label: 'created not date',
        location: 'Home Storage',
        description: 'All my random bike shit',
        items: [] as string[],
      },
      {
        _id: '5fb6924cc65ca0101736bbc4',
        created: new Date(1605800524626),
        updated: new Date('2020-11-29T11:44:21.944Z'),
        label: 'updated not list',
        location: 'Home Storage',
        items: [] as string[],
      },
      {
        _id: '5fb6924cc65ca0101736bbc4',
        created: new Date(1605800524626),
        label: 'no updated',
        location: 'Home Storage',
        items: [] as string[],
      },
      {
        _id: '5fb6924cc65ca0101736bbc4',
        created: new Date(1605800524626),
        updated: [new Date('2020-11-29T11:44:21.944Z')],
        label: 'no items',
        location: 'Home Storage',
      },
      {
        _id: '5fb6924cc65ca0101736bbc4',
        created: new Date(1605800524626),
        updated: [new Date('2020-11-29T11:44:21.944Z')],
        label: 'items not list',
        location: 'Home Storage',
        items: '',
      },
      {
        label: '',
        location: 'Store room',
        description: 'Other stuff',
        _id: '5fb6924cc65ca0101736bbc4',
        created: new Date(1605800524626),
        updated: [new Date('2020-11-29T11:44:21.944Z')],
        items: [] as string[],
      },
      {
        location: 'Garage',
        description: 'Other stuff',
        _id: '5fb6924cc65ca0101736bbc4',
        created: new Date(1605800524626),
        updated: [new Date('2020-11-29T11:44:21.944Z')],
        items: [] as string[],
      },
      {
        label: 'no string location',
        location: '',
        _id: '5fb6924cc65ca0101736bbc4',
        created: new Date(1605800524626),
        updated: [new Date('2020-11-29T11:44:21.944Z')],
        items: [] as string[],
      },
      {
        label: 'no location',
        _id: '5fb6924cc65ca0101736bbc4',
        created: new Date(1605800524626),
        updated: [new Date('2020-11-29T11:44:21.944Z')],
        items: [] as string[],
      },
      {
        label: {},
        location: 'Store room',
        description: 'All my random bike shit',
        _id: '5fb6924cc65ca0101736bbc4',
        created: new Date(1605800524626),
        updated: [new Date('2020-11-29T11:44:21.944Z')],
        items: [] as string[],
      },
      {
        label: 'location not string',
        location: {},
        description: 'All my random bike shit',
        _id: '5fb6924cc65ca0101736bbc4',
        created: new Date(1605800524626),
        updated: [new Date('2020-11-29T11:44:21.944Z')],
        items: [] as string[],
      },
      {
        label: 'description not string',
        location: 'Store room',
        description: {},
        _id: '5fb6924cc65ca0101736bbc4',
        created: new Date(1605800524626),
        updated: [new Date('2020-11-29T11:44:21.944Z')],
        items: [] as string[],
      },
    ],
  },
  partial: {
    valid: [
      {
        label: 'updated label',
      },
      {
        description: 'updated description',
      },
      {
        location: 'updated location',
      },
      {
        items: [],
      },
      {
        items: [
          {
            name: 'spare tire',
            description: '29',
          },
        ],
      },
      {
        label: 'updated all',
        description: 'updated all',
        location: 'updated all',
      },
      {},
      {
        description: '',
      },
    ],
    invalid: [
      {
        label: {},
      },
      {
        description: {},
      },
      {
        location: {},
      },
      {
        label: '',
      },
      {
        location: '',
      },
      {
        items: {},
      },
    ],
  },
};

export const database = {
  item: [
    {
      _id: new ObjectId('5fe8957351d62da95dafd1ed'),
      name: 'washing machine warranty',
      description: '',
      quantity: 1,
      owner: '',
      created: new Date('2020-12-27T14:08:51.854Z'),
    },
  ],
  box: [
    {
      _id: new ObjectId('5fb6924cc65ca0101736bbc4'),
      created: new Date(1605800524626),
      updated: [new Date('2020-11-29T11:44:21.944Z')],
      label: 'A1',
      description: 'Random loot',
      location: 'Home Storage',
      items: ['5fe8957351d62da95dafd1ed'] as string[],
    },
  ],
};
