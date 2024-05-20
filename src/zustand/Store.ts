import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { mmkvStorage } from '@/storage';

import type ApplicationInterface from './interface/ApplicationInterface';
import type ModalInterface from './interface/ModalInterface';
import type SessionInterface from './interface/SessionInterface';
import type UserAuthInterface from './interface/UserAuthInterface';

import createApplicationSlice from './slice/ApplicationSlice';
import createModalSlice from './slice/ModalSlice';
import createSessionSlice from './slice/SessionSlice';
import createUserAuthSlice from './slice/UserAuthSlice';

const zustandStorage = {
	setItem: (name: string, value: string) => {
		mmkvStorage.set(name, value);
	},
	getItem: (name: string) => {
		const value = mmkvStorage.getString(name);
		return value ?? null;
	},
	removeItem: (name: string) => {
		mmkvStorage.delete(name);
	},
};

// Create store with MMKV persistent storage middleware
const useStore = create<
	ApplicationInterface & ModalInterface & SessionInterface & UserAuthInterface
>()(
	persist(
		(...a) => ({
			...createUserAuthSlice(...a),
			...createApplicationSlice(...a),
			...createModalSlice(...a),
			...createSessionSlice(...a),
		}),
		{
			name: 'zustand-store', // Unique name for the store
			storage: createJSONStorage(() => zustandStorage),
		},
	),
);

export default useStore;
