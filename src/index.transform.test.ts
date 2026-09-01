import { transform } from '@swc/core';
import { describe, expect, test } from 'vitest';

describe('версии стандартных декораторов', () => {
  test.each(['2022-03', '2023-11'] as const)(
    'SWC трансформирует accessor-декоратор по версии %s',
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
