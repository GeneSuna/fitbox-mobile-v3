/**
 * Store - merge all the slices and create a store
 */

import { create } from 'zustand';

import type ApplicationInterface from './interface/ApplicationInterface';
import type ModalInterface from './interface/ModalInterface';
import type SessionInterface from './interface/SessionInterface';

import createApplicationSlice from './slice/ApplicationSlice';
import createModalSlice from './slice/ModalSlice';
import createSessionSlice from './slice/SessionSlice';

const useStore = create<
	ApplicationInterface & ModalInterface & SessionInterface
>()((...a) => ({
	...createApplicationSlice(...a),
	...createModalSlice(...a),
	...createSessionSlice(...a),
}));

export default useStore;
