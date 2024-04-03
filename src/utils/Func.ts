/* eslint-disable quotes */

const decodeHtml = (str: string): string => {
	const entityMap: Record<string, string> = {
		amp: '&',
		apos: "'",
		'#x27': "'",
		'#x2F': '/',
		'#39': "'",
		'#47': '/',
		lt: '<',
		gt: '>',
		nbsp: ' ',
		quot: '"',
		rsquo: "'",
		hellip: '...',
		ldquo: '“',
		rdquo: '”',
		ndash: '-',
		mdash: '–',
	};

	// Create a single regex pattern to match all entities.
	const entityRegex = new RegExp(
		`&(${Object.keys(entityMap).join('|')});`,
		'g',
	);

	// Use the regex to replace all entities in one pass with their corresponding values.
	return str.replace(
		entityRegex,
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		(match, entity) => entityMap[entity] || match,
	);
};

const stripHtmlTags = (str: string) => {
	return decodeHtml(str)
		.replace(/(<([^>]+)>)/gi, '')
		.replace(/&nbsp;/g, ' ');
};

export default {
	decodeHtml,
	stripHtmlTags,
};
