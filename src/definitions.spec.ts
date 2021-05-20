import { Factory } from 'file-fixture-factory';
import { findComponentDefinitions } from './definitions';

const factory = new Factory('component-collector');

async function gather<T>(iterable: AsyncIterableIterator<T>): Promise<T[]> {
  const result: T[] = [];

  for await (const thing of iterable) {
    result.push(thing);
  }

  return result;
}

afterAll(async () => {
  await factory.disposeAll();
});

test('it finds components in an app', async () => {
  const tmpDir = await factory.createStructure({
    app: {
      'some-other-thing.js': '',
      components: {
        'foo.js': '',
        bar: {
          'index.js': '',
          'index.hbs': '',
          'foo.js': '',
          'foo.hbs': '',
        },
        'baz.js': '',
      },
      templates: {
        components: {
          'foo.hbs': '',
          'bop.hbs': '',
        },
      },
    },
  });
  const componentNames = await gather(findComponentDefinitions(tmpDir.dir));

  expect(componentNames.map((c) => c.classicStyle).sort()).toEqual(
    ['foo', 'bar', 'bar/foo', 'baz', 'bop'].sort()
  );
});
