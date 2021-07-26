# Changelog

## 0.3.2

- Fixed import nested css package from nested file.\
  e.g. `inner/lib.js` imports `sanitize.css/forms.css` (a package)

## 0.3.1

- No more `clean-css` dependency, it uses the builtin css loader in esbuild now.
- Now it exports a function `style({ minify?: boolean, charset?: 'utf8' | 'ascii' })`.
- It can show relative path instead of absolute path in un-minified output.

## 0.2.1

- At most import clean-css once.
- Add [clean-css](https://github.com/jakubpawlowicz/clean-css) to minify css contents.
- Now it exports a function `style({ cleanCssOptions?: CleanCSS.Options })`.

## 0.1.1

- Basic support.
