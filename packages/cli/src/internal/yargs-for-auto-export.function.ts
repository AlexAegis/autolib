import {
	AutoExportOptions,
	DEFAULT_PACKAGE_EXPORTS,
	DEFAULT_PACKAGE_EXPORT_BASEDIR,
	DEFAULT_PACKAGE_EXPORT_IGNORES,
} from '@autolib/core';
import type { Argv } from 'yargs';

export const yargsForAutoExport = <T>(yargs: Argv<T>): Argv<T & AutoExportOptions> => {
	return yargs
		.group(['exports', 'exportsIgnore', 'defaultExportsIgnore', 'exportBaseDir'], 'auto-export')
		.option('exports', {
			description:
				'The files to treat as entry points to be exported from relative from ' +
				'the `srcDir + exportBaseDir` directory. ' +
				"It's usually `*` meaning all files directly here are considered the " +
				'entry points of the library.',
			string: true,
			array: true,
			default: DEFAULT_PACKAGE_EXPORTS,
		})
		.option('exportsIgnore', {
			description:
				'What paths to ignore when collecting exports in addition to ' +
				"`defaultExportsIgnore` so you're not dropping the defaults when you just " +
				' want to add additional ignore entries.',
			string: true,
			array: true,
			default: [],
		})
		.option('defaultExportsIgnore', {
			description:
				'By default test files are excluded. ' +
				'This option is here if you deliberately want to drop the default ignores. ' +
				'Otherwise use `exportsIgnore`.',
			string: true,
			array: true,
			default: DEFAULT_PACKAGE_EXPORT_IGNORES,
		})
		.option('exportBaseDir', {
			description:
				'Relative path to `srcDir` if you want your exports to start from a ' +
				'different directory.',
			string: true,
			default: DEFAULT_PACKAGE_EXPORT_BASEDIR,
		});
};
