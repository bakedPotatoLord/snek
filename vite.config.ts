import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import {resolve,dirname} from 'node:path'
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const outDir = resolve(__dirname,'dist')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base:'/snek/',
  build:{
    outDir,
  },
})
