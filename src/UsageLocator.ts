import { ComponentReference } from './ComponentReference';
import { ripGrep as rg } from 'ripgrep-js';
import debug from 'debug';

const log = debug('eucd:usage-locator');

/**
 * Rust-style Regex pattern to match either a space
 *
 * ```
 * <Foo />
 *     ^
 * ```
 *
 * or end-of-line
 *
 * ```
 * <Foo
 *     ^
 * />
 * ```
 *
 * Note: `\b` is **not** used because it will match all word boundaries, including `:`, which for our purposes should
 * be considered to be part of the word itself.
 */
const SPACE_OR_END_OF_LINE_MATCH = '(\\s|\\z)';

/**
 * Rust-style Regex pattern to match either a single _or_ a double quote
 *
 * Escapes the double-quote, as the entire regex string this is embedded within is itself wrapped in double quotes,
 * meaning the double-quote _within_ the string must be escaped.
 */
const EITHER_QUOTE_MATCH = `('|\\")`;

function performSearch(path: string, regex: string): ReturnType<typeof rg> {
  return rg(path, {
    globs: ['app/**/*'],
    regex,
  });
}

export class UsageLocator {
  private name: ComponentReference;

  constructor(name: ComponentReference) {
    this.name = name;
  }

  async hasModernComponentInvocations(packageRoot: string): Promise<boolean> {
    const regex = `"<${this.name.modernStyle}${SPACE_OR_END_OF_LINE_MATCH}"`;
    log('Searching for %s', regex);
    const matches = await performSearch(packageRoot, regex);

    return matches.length > 0;
  }

  async hasClassicComponentInvocation(packageRoot: string): Promise<boolean> {
    const regex = `"\\{\\{${this.name.classicStyle}(${SPACE_OR_END_OF_LINE_MATCH}|}})"`;
    log('Searching for %s', regex);
    const matches = await performSearch(packageRoot, regex);

    return matches.length > 0;
  }

  async hasComponentHelperInvocations(packageRoot: string): Promise<boolean> {
    const regex = `"component ${EITHER_QUOTE_MATCH}${this.name.classicStyle}${EITHER_QUOTE_MATCH}"`;
    log('Searching for %s', regex);
    const matches = await performSearch(packageRoot, regex);

    return matches.length > 0;
  }
}
