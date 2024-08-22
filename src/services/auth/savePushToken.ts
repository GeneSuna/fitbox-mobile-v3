import { ApiRoutes } from '@/constants';
import ky from 'ky';

export default async (pushToken: string, userId: number, platform: string) => {
	const response = await ky.put(
		`${ApiRoutes.PushNotificationService}&token=${pushToken}&userId=${userId}&platform=${platform}`,
	);

	return response;
};
