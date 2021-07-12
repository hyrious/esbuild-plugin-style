# Changelog

## 0.3.0

- No more `clean-css` dependency, it uses the builtin css loader in esbuild now.
- Now it exports a function `style({ minify?: boolean, charset?: 'utf8' | 'ascii' })`.

## 0.2.1

- At most import clean-css once.
- Add [clean-css](https://github.com/jakubpawlowicz/clean-css) to minify css contents.
- Now it exports a function `style({ cleanCssOptions?: CleanCSS.Options })`.

## 0.1.1

- Basic support.
