import { transform } from '@swc/core';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';
import { swcDecoratorsPlugin } from './index.js';

const fixturesDirectory = resolve(
  fileURLToPath(new URL('../fixtures/', import.meta.url)),
);
const decoratorVersions = ['2021-12', '2022-03', '2023-11'] as const;

async function transformFixture(
  fixtureName: string,
  decoratorVersion: (typeof decoratorVersions)[number],
): Promise<void> {
  const fixtureDirectory = resolve(fixturesDirectory, fixtureName);
  const inputPath = resolve(fixtureDirectory, 'input.ts');
  const [input, expected] = await Promise.all([
    readFile(inputPath, 'utf8'),
    readFile(resolve(fixtureDirectory, `output-${decoratorVersion}.js`), 'utf8'),
  ]);
  const plugin = swcDecoratorsPlugin({ decoratorVersion });
  if (typeof plugin.transform !== 'function') {
    throw new Error('The plugin must expose a transform hook function');
  }
  const transformHook = plugin.transform as (
    code: string,
    id: string,
  ) => Promise<{ code: string } | null>;
  const result = await transformHook(input, inputPath);

  expect(result).not.toBeNull();
  expect(result?.code).toBe(expected);
}

describe('decorated file transformation', () => {
  test.each(decoratorVersions)(
    'transforms accessor decorators for version %s',
    async (decoratorVersion) => {
      await transformFixture('accessor', decoratorVersion);
    },
  );

  test.each(decoratorVersions)(
    'transforms class and method decorators for version %s',
    async (decoratorVersion) => {
      await transformFixture('class-and-method', decoratorVersion);
    },
  );
});

describe('standard decorator versions', () => {
  test.each(['2022-03', '2023-11'] as const)(
    'SWC transforms accessor decorators for version %s',
    async (decoratorVersion) => {
      const result = await transform(
        'class Store { @observable accessor value = 1; }',
        {
          filename: 'decorated.ts',
          jsc: {
            parser: {
              syntax: 'typescript',
              decorators: true,
            },
            transform: {
              decoratorVersion,
            },
          },
        },
      );

      expect(result.code).not.toContain('@observable');
      expect(result.code).toContain('observable');
    },
  );
});
