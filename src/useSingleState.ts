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
 * Use a single state. Returns a tuple with [state, update, reset, replace].
 * 
 * Set a topic to enable logging of state changes.
 * @param initialState Initialises the state
 * @param context (Optional) The component's context, required for logging. Pass the 'this' keyword. Defaults to empty.
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
