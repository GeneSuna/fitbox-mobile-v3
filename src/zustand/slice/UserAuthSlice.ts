import type { StateCreator } from 'zustand';

import type UserAuthSlice from '../interface/UserAuthInterface';

const creeateUserAuthSlice: StateCreator<
	UserAuthSlice,
	[],
	[],
	UserAuthSlice
> = setState => ({
	loggedInUser: null,

	setLoggedInUser: user => {
		setState({
			loggedInUser: user,
		});
	},
});

export default creeateUserAuthSlice;
