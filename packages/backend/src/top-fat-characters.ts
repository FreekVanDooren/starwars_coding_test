import { Context, Next } from 'koa';
import axios from 'axios';
import { constants } from 'http2';

type SwapiCharacter = {
  height: string;
  mass: string;
};

function calculateBmi({ height, mass }: SwapiCharacter): number {
  const heightInMeters = parseInt(height) / 100;
  return parseInt(mass.replace(/,/g, '')) / heightInMeters ** 2;
}

async function fetchCharacters(
  url = 'https://swapi.dev/api/people/?page=1',
  characters: SwapiCharacter[] = []
): Promise<SwapiCharacter[]> {
  const response = await axios.get(url);
  const { status, data } = response;
  if (status === constants.HTTP_STATUS_OK) {
    const enhancedCharacters = [...characters, ...data.results];
    if (!data.next) {
      return enhancedCharacters;
    }
    return fetchCharacters(data.next, enhancedCharacters);
  } else {
    throw new Error(`Unable to read characters, from ${response}`);
  }
}

export default async function initializeTopFatCharacters(): Promise<
  (ctx: Context, next: Next) => Promise<void>
> {
  const characters = (await fetchCharacters()).map((character) => ({
    ...character,
    bmi: calculateBmi(character),
  }));
  return async function topFatCharacters(ctx, next): Promise<void> {
    ctx.status = constants.HTTP_STATUS_OK;
    ctx.body = {
      count: characters.length,
      characters: characters,
    };
    // Lets not forget to call the next middleware
    await next();
  };
}
