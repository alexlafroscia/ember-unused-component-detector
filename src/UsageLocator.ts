import { ComponentReference } from './ComponentReference';
import { ripGrep as rg, Options as BaseRipGrepOptions } from 'ripgrep-js';
import debug from 'debug';

const log = debug('eucd:usage-locator');

type RipGrepOptions = Omit<BaseRipGrepOptions, 'string' | 'regex'>;

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
 * Rust-style Regex pattern to match either a space
 *
 * ```
 * {{component 'foo'}}
 *            ^
 * ```
 *
 * or a new-line followed by some amount of whitespace
 *
 * ```
 * {{component
 *   'foo'}}
 * ^
 * ```
 *
 */
const SPACE_OR_NEWLINE_WITH_WHITESPACE = '(\\s|\\n(\\s*))';

/**
 * Rust-style Regex pattern to match either a single _or_ a double quote
 *
 * Escapes the double-quote, as the entire regex string this is embedded within is itself wrapped in double quotes,
 * meaning the double-quote _within_ the string must be escaped.
 */
const EITHER_QUOTE_MATCH = `('|\\")`;

function performSearch(
  path: string,
  regex: string,
  options: RipGrepOptions = {}
): ReturnType<typeof rg> {
  return rg(path, {
    globs: ['app/**/*'],
    regex,
    ...options,
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
    const regex = `"component${SPACE_OR_NEWLINE_WITH_WHITESPACE}${EITHER_QUOTE_MATCH}${this.name.classicStyle}${EITHER_QUOTE_MATCH}"`;
    log('Searching for %s', regex);
    const matches = await performSearch(packageRoot, regex, { multiline: true });

    return matches.length > 0;
  }
}
