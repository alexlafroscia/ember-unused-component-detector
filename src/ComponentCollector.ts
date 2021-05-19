import { ComponentName } from './ComponentName';
import { join } from 'path';
import { readdir, stat as getStats } from 'fs/promises';

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

export class ComponentCollector {
  constructor(private path: string) {}

  async findComponents(): Promise<ComponentName[]> {
    const foundComponents = new Set<string>();
    const result: ComponentName[] = [];

    for await (const filePath of walk(this.path)) {
      const name = new ComponentName(filePath);

      if (!foundComponents.has(name.classicStyle)) {
        foundComponents.add(name.classicStyle);
        result.push(name);
      }
    }

    return result;
  }
}
