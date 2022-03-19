import type { BuildOptions, Charset, Plugin } from "esbuild";
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
  let esbuild_shim: typeof import("esbuild") | undefined;

  return {
    name: "style",
    setup({ onResolve, onLoad, esbuild }) {
      const opt: BuildOptions = { logLevel: "silent", bundle: true, write: false, charset, minify };
      const require_esbuild = () => esbuild || (esbuild_shim ||= require("esbuild"));

      onLoad({ filter: /\.css$/ }, async args => {
        const { errors, warnings, outputFiles } = await require_esbuild().build({
          entryPoints: [args.path],
          ...opt,
        });
        const css = outputFiles![0].text.trimEnd();
        return {
          errors,
          warnings,
          contents: `
            import { inject_style } from "__style_helper__"
            inject_style(${JSON.stringify(css)})
          `,
        };
      });

      onResolve({ filter: /^__style_helper__$/ }, () => {
        return { path: "index.js", namespace: "style-helper" };
      });

      onLoad({ filter: /.*/, namespace: "style-helper" }, () => ({
        contents: `
          export function inject_style(text) {
            if (typeof document !== 'undefined') {
              var style = document.createElement('style')
              var node = document.createTextNode(text)
              style.appendChild(node)
              document.head.appendChild(style)
            }
          }
        `,
      }));
    },
  };
}

export default style;
