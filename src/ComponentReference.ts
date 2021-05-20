import { parse, sep as osPathSeperator } from 'path';

const COMPONENT_PATH_REGEX = /app\/(templates\/)?components/;

export class ComponentReference {
  private shortName: string;

  static pathIsComponent(path: string): boolean {
    return COMPONENT_PATH_REGEX.test(path);
  }

  constructor(componentPath: string) {
    const parsedPath = parse(componentPath);

    // Create an array of strings that represents the path to the file, starting with the file's parent directory and
    // working upward to the root
    let pathParts = parsedPath.dir.split(osPathSeperator).reverse();

    // Include the file name, if it is not `index`
    if (parsedPath.name !== 'index') {
      pathParts.unshift(parsedPath.name);
    }

    // Strip any path parts after (and including) `app`
    const appIndex = pathParts.indexOf('app');
    pathParts = pathParts.slice(0, appIndex);

    // Remove `templates` directory
    if (pathParts[pathParts.length - 1] === 'templates') {
      pathParts.pop();
    }

    // Remove `components` directory
    if (pathParts[pathParts.length - 1] === 'components') {
      pathParts.pop();
    }

    // Put the component name back together
    this.shortName = pathParts.reverse().join('/');
  }

  /**
   * The "Classic", kebab-style invocation pattern for a component
   */
  get classicStyle(): string {
    return this.shortName;
  }

  /**
   * The "Modern", angle-bracket-style invocation pattern for a component
   */
  get modernStyle(): string {
    return this.classicStyle
      .split('/')
      .map((part) =>
        part
          .split('-')
          .map((segment) => {
            const [first, ...rest] = segment.split('');

            return first.toUpperCase() + rest.join('');
          })
          .join('')
      )
      .join('::');
  }
}
