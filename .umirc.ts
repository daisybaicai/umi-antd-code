import { defineConfig } from "umi";

export default defineConfig({
  npmClient: 'npm',
  headScripts: ['https://unpkg.com/vconsole@latest/dist/vconsole.min.js', 'var vConsole = new window.VConsole();']
});
