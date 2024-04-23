import type { StateCreator } from 'zustand';

import type ApplicationSlice from '../interface/ApplicationInterface';

const createApplicationSlice: StateCreator<
	ApplicationSlice,
	[],
	[],
	ApplicationSlice
> = (setState, getState) => ({
	teamId: 0,
	shopUrl: '',
	logo: '',
	unreadMessages: 0,
	allowLeaderboards: false,
	allowComments: false,
	appForceUpdate: false,
	emptyRequiredFields: [],

	setAppState: (key: string, value: unknown) => {
		const prevState = getState();

		setState({
			...prevState,
			[key]: value,
		});
	},
});

export default createApplicationSlice;
