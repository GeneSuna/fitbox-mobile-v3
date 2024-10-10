import { Constant } from '@/utils';
import ky from 'ky';

type ENV = 'DEV' | 'STG' | 'PROD';

export default async (pushToken: string, userId: number, env: ENV) => {
	const response = await ky
		.delete(
			`${Constant.NOTIFICATION_SERVICE_URL[env]}&token=${pushToken}&userId=${userId}`,
		)
		.json();

	return response;
};
