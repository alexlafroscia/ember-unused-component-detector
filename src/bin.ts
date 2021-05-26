import { resolve } from 'path';
import { existsSync as exists } from 'fs';
import chalk from 'chalk';
import { findComponentDefinitions } from './definitions';
import { UsageLocator } from './UsageLocator';

const [_nodePath, _binPath, directoryArg = './'] = process.argv;

export default async function main(): Promise<void> {
  const directoryToSearch = resolve(process.cwd(), directoryArg, 'app');

  console.log(`Searching in $${directoryToSearch}`);

  if (!exists(resolve(directoryToSearch, 'app'))) {
    throw new Error('This does not appear to be an Ember app');
  }

  for await (const component of findComponentDefinitions(directoryToSearch)) {
    const locator = new UsageLocator(component);

    try {
      if (await locator.hasModernComponentInvocations(directoryToSearch)) {
        console.log(`${component.classicStyle} is invoked in the "Octane" style`);
      } else if (await locator.hasClassicComponentInvocation(directoryToSearch)) {
        console.log(`${component.classicStyle} is invoked in the "classic" style`);
      } else if (await locator.hasComponentHelperInvocations(directoryToSearch)) {
        console.log(`${component.classicStyle} is invoked using the \`component\` helper`);
      } else {
        console.log(chalk.red(`${component.classicStyle} does not appear to be used!`));
      }
    } catch (e) {
      console.log(chalk.yellow(`${component.classicStyle} generated an error: ${e.message}`));
    }
  }
}
