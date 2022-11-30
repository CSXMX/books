import {
    terser
} from 'rollup-plugin-terser'
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import alias from './plugin/alias'
import path from 'path';

const options = {
    input: ["src/index.js"],
    output: [{
            dir: path.resolve(__dirname, "dist/es"),
            entryFileNames: `[name].js`,
            name: 'hello1',
            chunkFileNames: `chunk-[hash].js`,
            assetFileNames: 'assets/[name]-[hash][extname]',
            format: "esm"
        },
        {
            dir: path.resolve(__dirname, "dist/cjs"),
            entryFileNames: `[name].js`,
            name: 'hello2',
            assetFileNames: 'assets/[name]-[hash][extname]',
            chunkFileNames: `chunk-[hash].js`,
            format: "cjs",
            sourcemap: true,
            globals: {
                jquery: '$'
            }
        },
    ],
    plugins: [resolve(), commonjs(), terser(), alias({
        entries: {
            '@': "./src", // 页面的 ../a 用 a 替换
        },
    })],
    external: ['loadsh']
}
export default options;