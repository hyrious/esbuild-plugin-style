import esbuild, { BuildOptions, Charset, Plugin } from "esbuild";
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
  const options: BuildOptions = { logLevel: "silent", bundle: true, charset, minify };

  return {
    name: "style",
    setup({ onResolve, onLoad }) {
      onResolve({ filter: /\.css$/ }, args => {
        if (args.namespace === "style-stub") {
          return { path: args.path, namespace: "style-content" };
        }
        return { path: path.join(args.resolveDir, args.path), namespace: "style-stub" };
      });

      onResolve({ filter: /^__style_helper__$/ }, args => ({
        path: args.path,
        namespace: "style-helper",
        sideEffects: false,
      }));

      onLoad({ filter: /.*/, namespace: "style-helper" }, async () => ({
        contents: `
          export function injectStyle(text) {
            const style = document.createElement('style')
            const node = document.createTextNode(text)
            style.appendChild(node)
            document.head.appendChild(style)
          }
        `,
      }));

      onLoad({ filter: /.*/, namespace: "style-stub" }, async args => ({
        contents: `import { injectStyle } from "__style_helper__"
        import css from ${JSON.stringify(args.path)}
        injectStyle(css)`,
      }));

      onLoad({ filter: /.*/, namespace: "style-content" }, async args => {
        const result = await esbuild.build({ entryPoints: [args.path], ...options, write: false });
        return {
          errors: result.errors,
          warnings: result.warnings,
          contents: result.outputFiles[0].text,
          loader: "text",
        };
      });
    },
  };
}
