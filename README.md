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

Add the plugin to your Vite configuration, usually in `vite.config.ts` at the
project root:

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import { swcDecoratorsPlugin } from 'swc-decorators-plugin';

export default defineConfig({
  plugins: [
    swcDecoratorsPlugin({
      decoratorVersion: '2022-03',
      target: 'es2024',
      useDefineForClassFields: true,
      externalHelpers: true,
    }),
  ],
});
```

Then run Vite as usual:

```bash
pnpm dev
```

For a JavaScript project, use `vite.config.js` or `vite.config.mjs`; the import
and configuration remain the same. If your configuration already includes other
Vite plugins, add `swcDecoratorsPlugin()` to the same `plugins` array.

For example, with React:

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { swcDecoratorsPlugin } from 'swc-decorators-plugin';

export default defineConfig({
  plugins: [
    react(),
    swcDecoratorsPlugin({
      decoratorVersion: '2022-03',
      target: 'es2024',
      useDefineForClassFields: true,
      externalHelpers: true,
    }),
  ],
});
```

## License

MIT
