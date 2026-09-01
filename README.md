# swc-decorators-plugin

Vite plugin that runs SWC only for modules containing decorators.

It is useful with Rolldown/Vite projects where the native Oxc transform handles
regular TypeScript, while SWC is still required for standard decorators such as
`@observable accessor`.

## Installation

```bash
pnpm add -D swc-decorators-plugin
```

## Usage

```ts
import { swcDecoratorsPlugin } from 'swc-decorators-plugin';

export default {
  plugins: [
    swcDecoratorsPlugin({
      decoratorVersion: '2022-03',
      target: 'es2024',
      useDefineForClassFields: true,
      externalHelpers: true,
    }),
  ],
};
```

The detector scans source text without building an AST. It ignores comments and
quoted strings, and conservatively sends possible decorator-containing modules
to SWC. Modules without a potential decorator are left to Vite/Oxc.

## License

MIT
