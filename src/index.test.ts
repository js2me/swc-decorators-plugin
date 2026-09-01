import { describe, expect, test } from 'vitest';
import { containsPotentialDecorator } from './index.js';

describe('containsPotentialDecorator', () => {
  test('finds inline decorators and class expression decorators', () => {
    expect(containsPotentialDecorator('export default @dec class {}')).toBe(
      true,
    );
    expect(containsPotentialDecorator('const Store = @dec class {}')).toBe(
      true,
    );
  });

  test('finds parameter decorators', () => {
    expect(containsPotentialDecorator('constructor(@inject() service)')).toBe(
      true,
    );
  });

  test('ignores strings and comments', () => {
    expect(containsPotentialDecorator("const email = 'user@example.com';")).toBe(
      false,
    );
    expect(containsPotentialDecorator('// @decorator\nconst value = 1;')).toBe(
      false,
    );
    expect(
      containsPotentialDecorator('/* @decorator */\nconst value = 1;'),
    ).toBe(false);
  });

  test('conservatively handles template literals', () => {
    expect(containsPotentialDecorator('const value = `@media ${name}`;')).toBe(
      true,
    );
  });
});
