import { describe, expect, test } from 'vitest';
import { containsPotentialDecorator } from './index.js';

describe('containsPotentialDecorator', () => {
  test('находит inline-декораторы и декораторы class expression', () => {
    expect(containsPotentialDecorator('export default @dec class {}')).toBe(
      true,
    );
    expect(containsPotentialDecorator('const Store = @dec class {}')).toBe(
      true,
    );
  });

  test('находит parameter decorators', () => {
    expect(containsPotentialDecorator('constructor(@inject() service)')).toBe(
      true,
    );
  });

  test('игнорирует строки и комментарии', () => {
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

  test('консервативно обрабатывает template literal', () => {
    expect(containsPotentialDecorator('const value = `@media ${name}`;')).toBe(
      true,
    );
  });
});
