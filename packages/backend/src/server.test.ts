import request from 'supertest';
import { Server } from 'http';
import { constants } from 'http2';

import realAxios from 'axios';
jest.mock('axios');
const axios = realAxios as jest.Mocked<typeof realAxios>;

import server from './server';

describe('Can get characters', () => {
  let serverInstance: Server;
  beforeEach(() => {
    axios.get.mockResolvedValueOnce({
      status: 200,
      data: {
        count: 3,
        next: 'http://unknown.universe.com?page=2',
        results: [
          {
            name: 'Joatin Granlund',
            height: '172',
            mass: '77',
            created: '2020-12-20T13:50:51.644000Z',
            edited: '2020-12-20T21:17:56.891000Z',
            url: 'http://unknown.universe.com/api/people/1/',
          },
          {
            name: 'Kami Gerami',
            height: '167',
            mass: '75',
            created: '2020-12-20T15:10:51.357000Z',
            edited: '2020-12-20T21:17:56.891000Z',
            url: 'http://unknown.universe.com/api/people/2',
          },
        ],
      },
    });
    axios.get.mockResolvedValueOnce({
      status: 200,
      data: {
        count: 3,
        next: null,
        results: [
          {
            name: 'Tommy Malmqvist',
            height: '96',
            mass: '32',
            created: '2020-12-10T15:11:50.376000Z',
            edited: '2020-12-20T21:17:56.891000Z',
            url: 'http://unknown.universe.com/api/people/3/',
          },
        ],
      },
    });
  });

  beforeEach(async () => {
    serverInstance = await server(12345);
  });
  afterEach(() => {
    serverInstance.close();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Characters are retrieved from remote', async () => {
    const response = await request(serverInstance).get('/top-fat-characters');

    expect(response.status).toBe(constants.HTTP_STATUS_OK);
    expect(response.body).toEqual(
      expect.arrayContaining([
        {
          id: 1,
          name: 'Joatin Granlund',
          bmi: 26.027582477014604,
          height: '172',
          mass: '77',
          created: '2020-12-20T13:50:51.644000Z',
          edited: '2020-12-20T21:17:56.891000Z',
          url: 'http://unknown.universe.com/api/people/1/',
        },
        {
          id: 2,
          name: 'Kami Gerami',
          bmi: 26.89232313815483,
          height: '167',
          mass: '75',
          created: '2020-12-20T15:10:51.357000Z',
          edited: '2020-12-20T21:17:56.891000Z',
          url: 'http://unknown.universe.com/api/people/2',
        },
        {
          id: 3,
          name: 'Tommy Malmqvist',
          bmi: 34.72222222222222,
          height: '96',
          mass: '32',
          created: '2020-12-10T15:11:50.376000Z',
          edited: '2020-12-20T21:17:56.891000Z',
          url: 'http://unknown.universe.com/api/people/3/',
        },
      ])
    );
  });
});
