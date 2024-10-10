import { Constant } from '@/utils';
import ky from 'ky';

type ENV = 'DEV' | 'STG' | 'PROD';

export default async (
	pushToken: string,
	userId: number,
	platform: string,
	env: ENV,
) => {
	const response = await ky.put(
		`${Constant.NOTIFICATION_SERVICE_URL[env]}&token=${pushToken}&userId=${userId}&platform=${platform}`,
	);

	return response;
};
