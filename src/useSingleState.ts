import { useState } from 'react';
import diffLogger from './utils/diffLogger';

/**
 * @type [State, updateState, resetState, replaceState]
 */
type UseSingleState<T> = [
	T,
	(updateState: Partial<T>) => void,
	() => void,
	(newState: T) => void
];

/**
 * Use a single state. Returns a tuple with `[state, update, reset, replace]`. Set `label` to log a diff of state changes, and force logging on or off with `enableLog`.
 * 
 * Basic usage:
 * 	
 * 	const [state, update, reset, replace] = useSingleState({note: '', value: 0} [, label, enableLog]);
 * 
 * - `state` is your current state object
 * - `update(object)` takes an update object, and creates your next state by merging it with your current state
 * - `reset()` resets your state to its initial value
 * - `replace(object)` takes a replacement object, which becomes your next state
 * 
 * Examples:
 * 
```typescript
const { note, value } = state;
update({
	note: 'New note'
});
// Update is now { text: '', value: 0, note: '' }

reset();
// State is now { text: '', value: 0, note: '' }

replace({
	value: 4
})
```
 * @param initialState Initialises the state
 * @param label (Optional) A label for the component
 * @param enableLog (Optional) Enable logging. Defaults to true.
 */
const useSingleState = <T extends object>(
	initialState: T,
	label: string = null,
	enableLog: boolean = true
): UseSingleState<T> => {
	const [state, set] = useState(initialState);

	const replace = (updateState: T) => {
		if (label && enableLog) {
			diffLogger(state, updateState, label);
		}
		set(updateState);
	};

	const update = (updateState: Partial<T>) =>
		replace({
			...state,
			...updateState
		});

	const reset = () => replace(initialState);

	return [state, update, reset, replace];
};

export default useSingleState;
