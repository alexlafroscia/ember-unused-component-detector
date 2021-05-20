# Ember Unused Component Detector

[![CI](https://github.com/alexlafroscia/ember-unused-component-detector/actions/workflows/ci.yml/badge.svg)](https://github.com/alexlafroscia/ember-unused-component-detector/actions/workflows/ci.yml)

> A little script for finding unused components in your Ember application

In a large, long-standing codebase, it can be hard to keep track of whether all components are actually used. It's easy to stop using a component and forget to remove it, and because Ember does not do tree-shaking yet, those components will end up in your build output regardless of whether they're used or not.

This script can help suss out these unused components by

1. Looking into your `app` directory to find all your component names
2. Searching your app for their invocation, either in the Octane style, Classic style, or through the `component` helper

Each found component will be reported in the first found style, and a warning printed if the component cannot be found.

## Gotchas

- Dynamic component names provided to the `component` helper cannot be found
- Components are not removed; just reported on. Please double-check your app yourself before removing anything!
- The contents of files in the `app/components` and `app/templates/components` directories are not verified; if the file exists _at all_ it is assumed it is a component!
- Only the `app` directory of is searched, so avoid false-positives form your tests; if the test is the only place it's used, it should be removed!

## System Requirements

- Node 14+
- [RipGrep](https://github.com/BurntSushi/ripgrep)

## How do I use this?

This tool is best run through `npx`/`yarn dlx`

```bash
# It's assumed that the current directory is your Ember app if a path is not provided
yarn dlx @alexlafroscia/ember-unused-component-detector ./optional-path-to-project
```

## Debugging

If you want more information about what is going on under-the-hood, you can set the `DEBUG=eucd:*` environment variable before running the script.

## Contributing

Yarn 2 is used for this package; if you have _any_ `yarn` installation on your computer, you'll be good-to-go!

Run `husky install` after cloning for linting-on-commit!
