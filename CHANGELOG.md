# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]

## [0.2.1] - 2021-06-11
### Fixed
- At most import clean-css once.

## [0.2.0] - 2021-06-11
### Added
- Add [clean-css](https://github.com/jakubpawlowicz/clean-css) to minify css contents.

### Changed
- Now it exports a function `style({ cleanCssOptions?: CleanCSS.Options })`.

## 0.1.1 - 2021-05-10
### Added
- Basic support.

[Unreleased]: https://github.com/hyrious/esbuild-plugin-style/compare/v0.2.1...HEAD
[0.2.1]: https://github.com/hyrious/esbuild-plugin-style/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/hyrious/esbuild-plugin-style/compare/v0.1.1...v0.2.0
