import esbuild, { BuildOptions, Charset, Plugin } from "esbuild";
import fs from "fs";
import path from "path";

export interface StylePluginOptions {
  /**
   * whether to minify the css code.
   * @default true
   */
  minify?: boolean;

  /**
   * css charset.
   * @default 'utf8'
   */
  charset?: Charset;
}

// https://github.com/evanw/esbuild/issues/20#issuecomment-802269745
export function style({ minify = true, charset = "utf8" }: StylePluginOptions = {}): Plugin {
  return {
    name: "style",
    setup({ onResolve, onLoad }) {
      const cwd = process.cwd();
      const opt: BuildOptions = { logLevel: "silent", bundle: true, write: false, charset, minify };

      onResolve({ filter: /\.css$/, namespace: "file" }, args => {
        const absPath = path.join(args.resolveDir, args.path);
        const relPath = path.relative(cwd, absPath);
        const resolved = fs.existsSync(absPath) ? relPath : args.path;
        return { path: resolved, namespace: "style-stub" };
      });

      onResolve({ filter: /\.css$/, namespace: "style-stub" }, args => {
        return { path: args.path, namespace: "style-content" };
      });

      onResolve({ filter: /^__style_helper__$/, namespace: "style-stub" }, args => ({
        path: args.path,
        namespace: "style-helper",
        sideEffects: false,
      }));

      onLoad({ filter: /.*/, namespace: "style-helper" }, async () => ({
        contents: `
          export function injectStyle(text) {
            var style = document.createElement('style')
            var node = document.createTextNode(text)
            style.appendChild(node)
            document.head.appendChild(style)
          }
        `,
      }));

      onLoad({ filter: /.*/, namespace: "style-stub" }, async args => ({
        contents: `
          import { injectStyle } from "__style_helper__"
          import css from ${JSON.stringify(args.path)}
          injectStyle(css)
        `,
      }));

      onLoad({ filter: /.*/, namespace: "style-content" }, async args => {
        const options = { entryPoints: [args.path], ...opt };
        const { errors, warnings, outputFiles } = await esbuild.build(options);
        return { errors, warnings, contents: outputFiles![0].text, loader: "text" };
      });
    },
  };
}
