import { transform, type JscTarget } from '@swc/core';
import type { Plugin } from 'vite';

export type SwcDecoratorsPluginOptions = {
  /** Standard decorators version supported by SWC. */
  decoratorVersion?: '2021-12' | '2022-03' | '2023-11';
  /** Target ECMAScript version for the SWC output. */
  target?: JscTarget;
  /** Class fields initialization semantics. */
  useDefineForClassFields?: boolean;
  /** Use shared SWC helpers instead of inlining them. */
  externalHelpers?: boolean;
};

const JS_FILE_RE = /\.m?[jt]sx?(\?.*)?$/;
const NODE_MODULES_RE = /(?:^|\/|\\)node_modules(?:\/|\\)/;

/**
 * Finds a potential decorator without requiring it to start a line.
 *
 * Decorators can be inline, applied to a class expression, or placed on a
 * constructor parameter. To avoid missing valid syntax, only string literals
 * and comments are skipped. False positives inside regexes or template
 * literals are safe: SWC will process the file again without changing its
 * semantics.
 */
export function containsPotentialDecorator(source: string): boolean {
  let index = 0;

  while (index < source.length) {
    const character = source[index];
    const nextCharacter = source[index + 1];

    if (character === '@') return true;

    if (character === '/' && nextCharacter === '/') {
      index += 2;
      while (index < source.length && source[index] !== '\n') index += 1;
      continue;
    }

    if (character === '/' && nextCharacter === '*') {
      const commentEnd = source.indexOf('*/', index + 2);
      index = commentEnd === -1 ? source.length : commentEnd + 2;
      continue;
    }

    if (character === '"' || character === "'") {
      const quote = character;
      index += 1;

      while (index < source.length) {
        if (source[index] === '\\') {
          index += 2;
          continue;
        }

        if (source[index] === quote) {
          index += 1;
          break;
        }

        index += 1;
      }

      continue;
    }

    index += 1;
  }

  return false;
}

export function swcDecoratorsPlugin(
  options: SwcDecoratorsPluginOptions = {},
): Plugin {
  const {
    decoratorVersion = '2022-03',
    target = 'es2022',
    useDefineForClassFields = true,
    externalHelpers = true,
  } = options;

  return {
    name: 'swc-decorators',
    async transform(code, id) {
      if (!JS_FILE_RE.test(id) || NODE_MODULES_RE.test(id)) return null;
      if (!code.includes('@') || !containsPotentialDecorator(code)) return null;

      const [filePath] = id.split('?', 1);
      const isTypeScript = /\.m?tsx?$/.test(filePath);
      const isTsx = filePath.endsWith('.tsx');

      const result = await transform(code, {
        filename: filePath,
        sourceMaps: true,
        jsc: {
          parser: {
            syntax: isTypeScript ? 'typescript' : 'ecmascript',
            decorators: true,
            ...(isTsx ? { tsx: true } : {}),
          },
          transform: {
            decoratorVersion,
            useDefineForClassFields,
          },
          externalHelpers,
          target,
        },
      });

      return {
        code: result.code,
        map: result.map ? JSON.parse(result.map) : undefined,
      };
    },
  };
}
