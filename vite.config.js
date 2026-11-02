import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { cpSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('.', import.meta.url));
const hasCustomDomain = existsSync(join(root, 'CNAME'));

const copyStaticProjectFiles = {
  name: 'copy-static-project-files',
  apply: 'build',
  closeBundle() {
    const output = join(root, 'dist');
    ['sawah-pagi.svg', 'lahan-padi.svg', 'ruang-ide.svg'].forEach((filename) => {
      const source = join(root, 'assets', filename);
      if (existsSync(source)) cpSync(source, join(output, 'assets', filename));
    });
    const filesSource = join(root, 'files');
    if (existsSync(filesSource)) cpSync(filesSource, join(output, 'files'), { recursive: true });
    if (hasCustomDomain) cpSync(join(root, 'CNAME'), join(output, 'CNAME'));
  },
};

export default defineConfig({
  base: '/',
  server: {
    proxy: {
      '/api': 'http://127.0.0.1:3000',
    },
  },
  plugins: [react(), copyStaticProjectFiles],
});
