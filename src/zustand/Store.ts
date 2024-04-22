/**
 * Store - merge all the slices and create a store
 */

import { create } from 'zustand';

import type ApplicationInterface from './interface/ApplicationInterface';
import type SessionInterface from './interface/SessionInterface';

import createApplicationSlice from './slice/ApplicationSlice';
import createSessionSlice from './slice/SessionSlice';

const useStore = create<ApplicationInterface & SessionInterface>()((...a) => ({
	...createApplicationSlice(...a),
	...createSessionSlice(...a),
}));

export default useStore;
