import { ApiRoutes } from '@/constants';
import { GetUserSubscriptionProductsSchema } from '@/types/schemas/response';
import { securedInstance } from '../instance';

export default async (id?: number) => {
	const response = await securedInstance()
		.get(ApiRoutes.userSubscriptionProducts, {
			searchParams: id ? { event_id: id } : {},
		})
		.json();
	return GetUserSubscriptionProductsSchema.parse(response);
};
