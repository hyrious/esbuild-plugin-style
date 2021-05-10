require("esbuild").build({
  entryPoints: ["./app.js"],
  bundle: true,
  outfile: "./out.js",
  plugins: [require("..").style]
}).catch(() => process.exit(1))
