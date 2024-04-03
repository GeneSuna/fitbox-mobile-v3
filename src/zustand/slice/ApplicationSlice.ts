import type { StateCreator } from 'zustand';

import type ApplicationSlice from '../interface/ApplicationInterface';

const createApplicationSlice: StateCreator<
	ApplicationSlice,
	[],
	[],
	ApplicationSlice
> = (setState, getState) => ({
	teamId: 0, // initial state

	setAppState: (key: string, value: unknown) => {
		const prevState = getState();

		setState({
			...prevState,
			[key]: value,
		});
	},
});

export default createApplicationSlice;
