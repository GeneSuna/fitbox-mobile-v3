import { Constant } from '@/utils';
import ky from 'ky';

export default async () => {
	const response = await ky.get(Constant.BETA_ACTIVE);

	return response;
};
