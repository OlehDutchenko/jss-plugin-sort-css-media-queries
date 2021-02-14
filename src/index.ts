import { Plugin, Rule, RuleList, StyleSheet, ToCssOptions } from 'jss';
import sortCSSmq from 'sort-css-media-queries';

export interface PluginOptions {
	combineMediaQueries?: boolean;
	desktopFirst?: boolean;
}

interface RuleListSample {
	index: Rule[];
	options: {
		sheet?: {
			options: {
				link?: boolean;
			};
		};
	};
}

interface Queries {
	groups: PlainObject<number[]>;
	groupsSortNames: string[];
}

interface PlainObject<Value = any> {
	[key: string]: Value;
}

function isPlainObject(sample: any): sample is PlainObject {
	return (
		sample !== null && typeof sample === 'object' && Array.isArray(sample) === false
	);
}

const UN_QUERIED = '__UN_QUERIED';

function recursiveInnerAndGetQueries(
	pluginOptions: PluginOptions,
	rules: Rule[]
): Queries {
	const queries: Queries = {
		groups: {},
		groupsSortNames: []
	};

	for (let index = 0; index < rules.length; index++) {
		const rule = rules[index] as PlainObject;
		const query =
			rule.type === 'conditional' && typeof rule.query === 'string'
				? rule.query
				: UN_QUERIED;
		if (!queries.groups.hasOwnProperty(query)) {
			queries.groupsSortNames.push(query);
			queries.groups[query] = [];
		}
		queries.groups[query].push(index);
		// eslint-disable-next-line @typescript-eslint/no-use-before-define
		recursive(pluginOptions, rule);
	}

	queries.groupsSortNames.sort((a, b): number => {
		const aWeight = a === UN_QUERIED ? 0 : a.length;
		const bWeight = b === UN_QUERIED ? 0 : b.length;
		if (aWeight > 0 && bWeight > 0) {
			if (pluginOptions.desktopFirst) {
				console.log('xxxxxxx');
				return sortCSSmq.desktopFirst(a, b);
			} else {
				return sortCSSmq(a, b);
			}
		} else {
			return aWeight - bWeight;
		}
	});

	return queries;
}

function recursive(pluginOptions: PluginOptions, data?: any): void {
	if (isPlainObject(data) && data.rules instanceof RuleList) {
		data.rules.toString = function (
			this: RuleListSample,
			options: ToCssOptions = {}
		): string {
			let str = '';
			const { sheet } = this.options;
			const link = sheet ? sheet.options.link : false;

			const { groups, groupsSortNames } = recursiveInnerAndGetQueries(
				pluginOptions,
				this.index
			);

			for (let i = 0; i < groupsSortNames.length; i++) {
				const groupName = groupsSortNames[i];
				const group = groups[groupsSortNames[i]];
				if (groupName !== UN_QUERIED && pluginOptions.combineMediaQueries) {
					str += `\n${groupName} {`;
					for (let i = 0; i < group.length; i++) {
						const rule = this.index[group[i]] as { rules: RuleList };
						const css = rule.rules.toString({
							...options,
							indent: (options.indent || 0) + 1
						});
						if (!css && !link) continue;
						if (str) str += '\n';
						str += css;
					}
					str += '\n}\n';
				} else {
					for (let i = 0; i < group.length; i++) {
						const rule = this.index[group[i]];
						const css = rule.toString(options);
						if (!css && !link) continue;
						if (str) str += '\n';
						str += css;
					}
				}
			}

			return str;
		};
	}
}

export default function jssCombineAndSortMQ(options: PluginOptions = {}): Plugin {
	return {
		onProcessSheet(sheet?: StyleSheet): void {
			recursive(options, sheet);
		}
	};
}
