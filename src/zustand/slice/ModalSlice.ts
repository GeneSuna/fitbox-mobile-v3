import type { StateCreator } from 'zustand';

import type ModalSlice from '../interface/ModalInterface';

const createModalSlice: StateCreator<ModalSlice, [], [], ModalSlice> = (
	setState,
	getState,
) => ({
	calendarFilterModal: false,
	newModal: false,
	classFilterModal: false,
	locationFilterModal: false,
	venueFilterModal: false,

	toggleModal: (key, value) => {
		const prevState = getState();

		setState({
			...prevState,
			[key]: value ?? !prevState[key],
		});
	},
});

export default createModalSlice;
