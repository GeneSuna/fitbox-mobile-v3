import { ApiRoutes } from '@/constants';
import { securedInstance } from '../instance';

export default async (id: string) => {
	const response = await securedInstance()
		.get(`${ApiRoutes.confirmSetupIntent}`, {
			searchParams: {
				intent_id: id,
			},
		})
		.json();

	return response;
};
