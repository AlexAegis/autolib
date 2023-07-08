import { sortObject } from '@alexaegis/common';
import type { PackageJson, RegularWorkspacePackage } from '@alexaegis/workspace-tools';
import { createJsonSortingPreferenceNormalizer } from '@alexaegis/workspace-tools/sort';
import { NormalizedPakkContext } from '../../internal/pakk.class.options.js';
import type { PackageExaminationResult, PakkFeature } from '../pakk-feature.type.js';
import {
	NormalizedAutoSortPackageJsonOptions,
	normalizeAutoSortPackageJsonOptions,
	type AutoSortPackageJsonOptions,
} from './auto-sort-package-json.class.options.js';

export class AutoSort implements PakkFeature {
	private readonly context: NormalizedPakkContext;
	private readonly options: NormalizedAutoSortPackageJsonOptions;
	private sortingNormalizer!: Awaited<ReturnType<typeof createJsonSortingPreferenceNormalizer>>;

	constructor(context: NormalizedPakkContext, options?: AutoSortPackageJsonOptions) {
		this.context = context;
		this.options = normalizeAutoSortPackageJsonOptions(options);
	}

	async examinePackage(): Promise<Partial<PackageExaminationResult>> {
		this.sortingNormalizer = await createJsonSortingPreferenceNormalizer(
			'package.json',
			this.options,
		);

		return {};
	}

	postprocess(workspacePackage: RegularWorkspacePackage): PackageJson {
		this.context.logger.info('sorting packageJson...');
		return sortObject(
			workspacePackage.packageJson,
			this.sortingNormalizer(this.options.sortingPreference),
		);
	}
}
