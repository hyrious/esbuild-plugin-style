# @hyrious/esbuild-plugin-style

The missing style-loader for esbuild.

## Usage

```js
const { style } = require("@hyrious/esbuild-plugin-style")

require("esbuild").build({
  entryPoints: ["app.js"],
  bundle: true,
  outfile: "out.js",
  plugins: [style]
}).catch(() => process.exit(1))
```

Given such app.js and style.css:

```js
import "./style.css"
console.log(1)
```

```css
body { color: red }
```

Outputs (things like):

```js
let style = document.createElement("style")
style.append("body { color: red }")
document.head.append(style)
console.log(1)
```

## License

MIT @ [hyrious](https://github.com/hyrious)
