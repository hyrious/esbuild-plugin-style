# Changelog

## 0.3.5

- Use the esbuild instance from plugin args instead of global require.
- Make `style` also the default export.
- Simplify `onResolve`, `onLoad` usage.

## 0.3.4

- Invalidate the `injectStyle` function when there's no `document`, for SSR.

## 0.3.3

- Use `var` instead of `const` for better compatibility with ES5.

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
