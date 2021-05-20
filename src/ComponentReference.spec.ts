import { ComponentReference as Ref } from './ComponentReference';

test('classicStyle', () => {
  expect(new Ref('app/components/foo.js').classicStyle).toBe('foo');
  expect(new Ref('app/components/foo/index.js').classicStyle).toBe('foo');
  expect(new Ref('app/components/foo/bar.js').classicStyle).toBe('foo/bar');
  expect(new Ref('app/components/foo/bar/index.js').classicStyle).toBe('foo/bar');

  expect(new Ref('app/components/foo.hbs').classicStyle).toBe('foo');
  expect(new Ref('app/components/foo/index.hbs').classicStyle).toBe('foo');
  expect(new Ref('app/components/foo/bar.hbs').classicStyle).toBe('foo/bar');
  expect(new Ref('app/components/foo/bar/index.hbs').classicStyle).toBe('foo/bar');

  expect(new Ref('app/templates/components/foo.hbs').classicStyle).toBe('foo');
  expect(new Ref('app/templates/components/foo/index.hbs').classicStyle).toBe('foo');
  expect(new Ref('app/templates/components/foo/bar.hbs').classicStyle).toBe('foo/bar');

  expect(new Ref('app/components/foo-bar.hbs').classicStyle).toBe('foo-bar');
});

test('modernStyle', () => {
  expect(new Ref('app/components/foo.js').modernStyle).toBe('Foo');
  expect(new Ref('app/components/foo/index.js').modernStyle).toBe('Foo');
  expect(new Ref('app/components/foo/bar.js').modernStyle).toBe('Foo::Bar');
  expect(new Ref('app/components/foo/bar/index.js').modernStyle).toBe('Foo::Bar');

  expect(new Ref('app/components/foo.hbs').modernStyle).toBe('Foo');
  expect(new Ref('app/components/foo/index.hbs').modernStyle).toBe('Foo');
  expect(new Ref('app/components/foo/bar.hbs').modernStyle).toBe('Foo::Bar');
  expect(new Ref('app/components/foo/bar/index.hbs').modernStyle).toBe('Foo::Bar');

  expect(new Ref('app/components/foo-bar.hbs').modernStyle).toBe('FooBar');
});

test('pathIsComponent', () => {
  expect(Ref.pathIsComponent('app/components/foo.js')).toBe(true);
  expect(Ref.pathIsComponent('app/components/foo.hbs')).toBe(true);
  expect(Ref.pathIsComponent('app/templates/components/foo.hbs')).toBe(true);
  expect(Ref.pathIsComponent('app/lib/whatever.js')).toBe(false);
});
