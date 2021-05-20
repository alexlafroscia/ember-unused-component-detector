import { Factory } from 'file-fixture-factory';

import { UsageLocator } from './UsageLocator';
import { ComponentReference } from './ComponentReference';

const factory = new Factory('component-locator');

afterAll(async function () {
  await factory.disposeAll();
});

describe('locating modern components', () => {
  test('it can find a modern component invocation', async () => {
    const tmp = await factory.createStructure({
      'index.hbs': `
        <Foo />
        <Foo::Bar />
      `,
    });

    const fooLocator = new UsageLocator(new ComponentReference('app/components/foo.js'));
    const fooBarLocator = new UsageLocator(new ComponentReference('app/components/foo/bar.js'));
    const unusedLocator = new UsageLocator(new ComponentReference('app/components/unused.js'));

    expect(await fooLocator.hasModernComponentInvocations(tmp.dir)).toBe(true);
    expect(await fooBarLocator.hasModernComponentInvocations(tmp.dir)).toBe(true);
    expect(await unusedLocator.hasModernComponentInvocations(tmp.dir)).toBe(false);
  });

  test('false positive with parent component', async () => {
    const oneLineTmpDir = await factory.createStructure({
      'index.hbs': '<Foo::Bar />',
    });
    const multiLineTmpDir = await factory.createStructure({
      'index.hs': `
        <Foo::Bar
        />
      `,
    });

    const fooLocator = new UsageLocator(new ComponentReference('app/components/foo.js'));
    const fooBarLocator = new UsageLocator(new ComponentReference('app/components/foo/bar'));

    expect(await fooLocator.hasModernComponentInvocations(oneLineTmpDir.dir)).toBe(false);
    expect(await fooBarLocator.hasModernComponentInvocations(oneLineTmpDir.dir)).toBe(true);
    expect(await fooLocator.hasModernComponentInvocations(multiLineTmpDir.dir)).toBe(false);
    expect(await fooBarLocator.hasModernComponentInvocations(multiLineTmpDir.dir)).toBe(true);
  });
});

describe('locating classic components', () => {
  test('it can find usage of the `component` helper', async () => {
    const fooTmp = await factory.createStructure({
      'index.hbs': `{{component 'foo'}}`,
    });
    const fooBarTmp = await factory.createStructure({
      'index.hbs': `{{component 'foo/bar'}}`,
    });

    const fooLocator = new UsageLocator(new ComponentReference('app/components/foo.js'));
    const fooBarLocator = new UsageLocator(new ComponentReference('app/components/foo/bar.js'));
    const unknownLocator = new UsageLocator(new ComponentReference('app/components/unknown.js'));

    expect(await fooLocator.hasComponentHelperInvocations(fooTmp.dir)).toBe(true);
    expect(await fooLocator.hasComponentHelperInvocations(fooBarTmp.dir)).toBe(false);

    expect(await fooBarLocator.hasComponentHelperInvocations(fooTmp.dir)).toBe(false);
    expect(await fooBarLocator.hasComponentHelperInvocations(fooBarTmp.dir)).toBe(true);

    expect(await unknownLocator.hasComponentHelperInvocations(fooTmp.dir)).toBe(false);
    expect(await unknownLocator.hasComponentHelperInvocations(fooBarTmp.dir)).toBe(false);
  });
});