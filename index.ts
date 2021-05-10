import type { Plugin } from "esbuild";
import fs from "fs";
import path from "path";

const styleMap = new Map<string, number>();
function styleId(path: string) {
  if (styleMap.has(path)) {
    return styleMap.get(path);
  } else {
    const id = styleMap.size;
    styleMap.set(path, id);
    return id;
  }
}

export const style: Plugin = {
  name: "style",
  setup(build) {
    build.onResolve({ filter: /\.css$/ }, (args) => {
      if (args.namespace === "style-stub") {
        return {
          path: args.path,
          namespace: "style-content",
        };
      }

      if (args.resolveDir === "") return;

      return {
        path: path.isAbsolute(args.path) ? args.path : path.join(args.resolveDir, args.path),
        namespace: "style-stub",
      };
    });

    build.onResolve({ filter: /^__style_helper__$/ }, (args) => ({
      path: args.path,
      namespace: 'style-helper',
    }))

    build.onLoad({ filter: /.*/, namespace: "style-helper" }, async () => ({
      contents: `const cache = new Set()
        export function updateStyle(id, text) {
          if (cache.has(id)) return; cache.add(id)
          const style = document.createElement('style')
          style.append(text)
          document.head.append(style)
        }`,
    }));

    build.onLoad({ filter: /.*/, namespace: "style-stub" }, async (args) => ({
      contents: `import { updateStyle } from "__style_helper__"
        import css from ${JSON.stringify(args.path)}
        updateStyle(${styleId(args.path)}, css)`,
    }));

    build.onLoad({ filter: /.*/, namespace: "style-content" }, async (args) => ({
      contents: await fs.promises.readFile(args.path, "utf8"),
      loader: "text",
    }));
  },
};
