import { ComponentName } from './ComponentName';

test('classicStyle', () => {
  expect(new ComponentName('app/components/foo.js').classicStyle).toBe('foo');
  expect(new ComponentName('app/components/foo/index.js').classicStyle).toBe('foo');
  expect(new ComponentName('app/components/foo/bar.js').classicStyle).toBe('foo/bar');
  expect(new ComponentName('app/components/foo/bar/index.js').classicStyle).toBe('foo/bar');

  expect(new ComponentName('app/components/foo.hbs').classicStyle).toBe('foo');
  expect(new ComponentName('app/components/foo/index.hbs').classicStyle).toBe('foo');
  expect(new ComponentName('app/components/foo/bar.hbs').classicStyle).toBe('foo/bar');
  expect(new ComponentName('app/components/foo/bar/index.hbs').classicStyle).toBe('foo/bar');
});

test('modernStyle', () => {
  expect(new ComponentName('app/components/foo.js').modernStyle).toBe('Foo');
  expect(new ComponentName('app/components/foo/index.js').modernStyle).toBe('Foo');
  expect(new ComponentName('app/components/foo/bar.js').modernStyle).toBe('Foo::Bar');
  expect(new ComponentName('app/components/foo/bar/index.js').modernStyle).toBe('Foo::Bar');

  expect(new ComponentName('app/components/foo.hbs').modernStyle).toBe('Foo');
  expect(new ComponentName('app/components/foo/index.hbs').modernStyle).toBe('Foo');
  expect(new ComponentName('app/components/foo/bar.hbs').modernStyle).toBe('Foo::Bar');
  expect(new ComponentName('app/components/foo/bar/index.hbs').modernStyle).toBe('Foo::Bar');
});
