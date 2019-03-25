# useSingleState

## A React hook for using a unified state, with optional state diff logging

#### Using a single state object with React hooks allows you to update multiple state values in one call in functional components, similar to how `setState` updates state in class components.

#### We can also reset the state to its initial value, replace it altogether, and log state diffs to the console.

### Installation

```
npm install use-single-state
```

or

```
yarn add use-single-state
```

### Basic usage

```typescript
import useSingleState from 'use-single-state';

const [{ text, value }, update] = useSingleState({
	text: '',
	value: 0,
	note: ''
});

update({
	note: 'New note'
});
```

## Resetting state

- You can reset the whole state back to its initial value with the `reset` function.

```typescript
const [{ text, value }, update, reset] = useSingleState(
	{
		text: '',
		value: 0
	},
	'My component'
);

update({
	text: 'New text',
	value: 5
});

// State is now { text: 'New text', value: 5 }

reset();

// State is now { text: '', value: 0 }
```

## Diff logging

- `useSingleState` can optionally log diffs to your state to your console. The format of the diff output is modelled after [redux-logger](https://github.com/LogRocket/redux-logger).
- This is turned off by default. To enable this, set a label for your hook with the `label` parameter. You can override this with the last parameter `enableLog`, which defaults to true.

### Example code:

```typescript
const [{ text, value }, update] = useSingleState(
	{
		text: '',
		value: 0
	},
	'My component'
);

update({
	text: 'New text'
});
```

## Replacing state

- You can set the entire state with the `replace` function. Unlike `update`, the state is replaced and not merged.

```typescript
const [{ text, value }, update, reset, replace] = useSingleState(
	{
		text: '',
		value: 0
	},
	'My component'
);

replace({
	text: 'New text'
});

// State is now { text: 'New text' }. 'value' has been discarded.
```

## Comparison to `useState` and `useReducer`

- `useSingleState` will often be less verbose than having multiple uses of `useState`.
- `useSingleState` will only ever result in a single state update being sent to React's batcher when you need to update multiple state values at a time, likely saving your component from unnecessary re-renders.

```typescript
// With useState
const [text, setText] = useState('');
const [value, setValue] = useState(0);
const [note, setNote] = useState('');

setNote('New note');
setText('Updated text');
setValue(9);

// With useSingleState
const [{ text, value, note }, update] = useSingleState({
	text: '',
	value: 0,
	note: ''
});

update({
	note: 'New note',
	text: 'Updated text',
	value: 9
});
```

- `useSingleState` works well in situations where your component isn't complex enough to warrant managing your state with `useReducer`, but you still want to update multiple state values at once.

```typescript
/// With useReducer
const reducer = (state, action) => {
	switch (action.type) {
		case 'fail':
			return {
				loading: false,
				error: action.error,
				data: null
			};
		case 'loading': {
			return {
				loading: true,
				error: null,
				data: null
			};
		}
		case 'success': {
			return {
				loading: false,
				error: null,
				data: action.data
			};
		}
		default:
			throw new Error();
	}
};

const [{ data, loading, error }, dispatch] = useReducer(reducer, {
	loading: false,
	data: null,
	error: null
});

dispatch({
	type: 'loading'
});

dispatch({
	type: 'success',
	data
});

// With useSingleState
const [{ loading, data, error }, update] = useSingleState({
	loading: false,
	data: null,
	error: null
});

update({
	loading: true
});

update({
	loading: false,
	data
});
```
