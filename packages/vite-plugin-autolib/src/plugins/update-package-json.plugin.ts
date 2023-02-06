import { getPrettierFormatter, readJson, toAbsolute } from '@alexaegis/fs';
import { PackageJson, PACKAGE_JSON_NAME } from '@alexaegis/workspace-tools';
import { writeFile } from 'node:fs/promises';
import type { Plugin } from 'vite';

export interface UpdatePackageJsonPluginOptions {
	filename?: string;
	updater: (packageJson: PackageJson) => PackageJson;
	cwd?: string;
	autoPrettier?: boolean;
}

export const updatePackageJsonPlugin = (options: UpdatePackageJsonPluginOptions): Plugin => ({
	name: 'update-package-json',
	apply: 'build',
	buildEnd: async (error) => {
		if (!error) {
			const cwd = options.cwd ?? process.cwd();
			const packageJsonLocation = toAbsolute(options.filename ?? PACKAGE_JSON_NAME, { cwd });

			const packageJson = await readJson<PackageJson>(packageJsonLocation);
			if (!packageJson) {
				console.warn(
					`updatePackageJsonPlugin didn't find packageJson at ${packageJsonLocation}!`
				);
				return;
			}
			const augmentedPackageJson = options.updater(packageJson);
			let rawAugmentedPackageJson = JSON.stringify(augmentedPackageJson);

			if (options.autoPrettier ?? true) {
				const formatter = await getPrettierFormatter({ parser: 'json-stringify', cwd });
				rawAugmentedPackageJson = formatter(rawAugmentedPackageJson);
			}

			await writeFile(packageJsonLocation, rawAugmentedPackageJson);
		}
	},
});
