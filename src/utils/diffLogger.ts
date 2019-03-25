import differ from 'deep-diff';

type Kind = 'E' | 'N' | 'D' | 'A';

type Diff = {
	kind?: Kind;
	lhs?: number;
	rhs?: number;
	path?: string[];
	index?: number;
	item?: any;
};

// https://github.com/flitbit/diff#differences
const dictionary = {
	E: {
		color: '#2196F3',
		text: 'CHANGED:'
	},
	N: {
		color: '#4CAF50',
		text: 'ADDED:'
	},
	D: {
		color: '#F44336',
		text: 'DELETED:'
	},
	A: {
		color: '#2196F3',
		text: 'ARRAY:'
	}
};

function style(kind: Kind): string {
	return `color: ${dictionary[kind].color}; font-weight: bold`;
}
function styleSuccess(): string {
	return `color: mediumseagreen; font-weight: bold`;
}

function styleLight() {
	return 'background: gray; font-weight: bold; font-size: 0.8rem; padding: 2px;';
}

function render(diff: Diff): string[] {
	const { kind, path, lhs, rhs, index, item } = diff;

	switch (kind) {
		case 'E':
			return [path.join('.'), `${lhs}`, '→', `${rhs}`];
		case 'N':
			return [path.join('.'), `${rhs}`];
		case 'D':
			return [path.join('.')];
		case 'A':
			return [`${path.join('.')}[${index}]`, item];
		default:
			return [];
	}
}

export default function diffLogger<T>(
	prevState: Partial<T>,
	newState: Partial<T>,
	topic: string = null
): void {
	const diff: Diff[] = differ(prevState, newState);

	if (topic) console.group(`%cState changed: ${topic}`, styleLight());

	console.log('%c Previous State', style('D'), prevState);
	console.group('%c Update', style('E'));

	if (diff) {
		diff.forEach(elem => {
			const { kind } = elem;
			const output = render(elem);

			console.log(`%c ${dictionary[kind].text}`, style(kind), ...output);
		});
	} else {
		console.log('—— None ——');
	}

	console.groupEnd();

	console.log('%c Next State', styleSuccess(), newState);

	if (topic) console.groupEnd();
}
