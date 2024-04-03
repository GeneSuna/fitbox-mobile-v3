/**
 * Store - merge all the slices and create a store
 */

import { create } from 'zustand';

import type ApplicationInterface from './interface/ApplicationInterface';
import createApplicationSlice from './slice/ApplicationSlice';

const useStore = create<ApplicationInterface>()((...a) => ({
	...createApplicationSlice(...a),
}));

export default useStore;
