import { transform, type JscTarget } from '@swc/core';
import type { Plugin } from 'vite';

export type SwcDecoratorsPluginOptions = {
  /** Версия стандартных декораторов, которую понимает SWC. */
  decoratorVersion?: '2021-12' | '2022-03' | '2023-11';
  /** Целевой ECMAScript для результата SWC. */
  target?: JscTarget;
  /** Семантика инициализации class fields. */
  useDefineForClassFields?: boolean;
  /** Подключать общие SWC helpers вместо инлайна. */
  externalHelpers?: boolean;
};

const JS_FILE_RE = /\.m?[jt]sx?(\?.*)?$/;
const NODE_MODULES_RE = /(?:^|\/|\\)node_modules(?:\/|\\)/;

/**
 * Находит потенциальный декоратор, не ограничивая его началом строки.
 *
 * Декораторы могут быть inline, применяться к class expression или находиться
 * у параметра конструктора. Для гарантии не пропустить легальный синтаксис
 * пропускаются только строковые литералы и комментарии. Ложные срабатывания
 * внутри regex или template literal безопасны: SWC обработает файл повторно,
 * но не изменит его семантику.
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
