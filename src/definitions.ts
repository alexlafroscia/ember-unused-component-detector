import { join } from 'path';
import { readdir, stat as getStats } from 'fs/promises';
import debug from 'debug';
import { ComponentReference } from './ComponentReference';

const log = debug('eucd:definitions');

async function* walk(path: string): AsyncIterableIterator<string> {
  const files = await readdir(path);

  for (const f of files) {
    const fullPath = join(path, f);
    const stat = await getStats(fullPath);

    if (stat.isDirectory()) {
      yield* walk(fullPath);
    } else {
      yield fullPath;
    }
  }
}

export async function* findComponentDefinitions(
  path: string
): AsyncIterableIterator<ComponentReference> {
  const foundComponents = new Set<string>();

  log('Looking for components in %s', path);

  for await (const filePath of walk(path)) {
    if (!ComponentReference.pathIsComponent(filePath)) {
      log('%s is not a valid component path; skipping', filePath);
      continue;
    }

    const name = new ComponentReference(filePath);

    if (!foundComponents.has(name.classicStyle)) {
      log('%s is newly detected as %s', filePath, name.classicStyle);
      foundComponents.add(name.classicStyle);
      yield name;
    } else {
      log('%s has already been detected as %s', filePath, name.classicStyle);
    }
  }
}
