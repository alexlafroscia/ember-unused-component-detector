import { parse } from 'path';

export class ComponentName {
  private path: string;

  constructor(path: string) {
    this.path = path;
  }

  private get pathWithoutComponentsFolder(): string {
    return this.path.replace('app/components/', '');
  }

  /**
   * The "Classic", kebab-style invocation pattern for a component
   */
  get classicStyle(): string {
    const parsedPath = parse(this.pathWithoutComponentsFolder);

    // Name the component being the `index` component
    if (parsedPath.name === 'index') {
      return parsedPath.dir;
    }

    // Handle components that live in the top-level `components` directory
    if (!parsedPath.dir) {
      return parsedPath.name;
    }

    // Otherwise, assume we need the directory and file names together
    return `${parsedPath.dir}/${parsedPath.name}`;
  }

  /**
   * The "Modern", angle-bracket-style invocation pattern for a component
   */
  get modernStyle(): string {
    return this.classicStyle
      .split('/')
      .map((part) => {
        const [first, ...rest] = part.split('');

        return first.toUpperCase() + rest.join('');
      })
      .join('::');
  }
}
