import { Factory } from 'file-fixture-factory';
import { ComponentCollector as Collector } from './ComponentCollector';

const factory = new Factory('component-collector');

afterAll(async () => {
  await factory.disposeAll();
});

test('it finds components in an app', async () => {
  const tmpDir = await factory.createStructure({
    app: {
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
  const collector = new Collector(tmpDir.dir);
  const componentNames = await collector.findComponents();

  expect(componentNames.map((c) => c.classicStyle).sort()).toEqual(
    ['foo', 'bar', 'bar/foo', 'baz', 'bop'].sort()
  );
});
