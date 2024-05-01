import { ApiRoutes } from '@/constants';
import { GetUserSubscriptionProductsSchema } from '@/types/schemas/response';
import { securedInstance } from '../instance';

export default async () => {
	const url = ApiRoutes.userSubscriptionProducts;

	const response = await securedInstance().get(url).json();
	return GetUserSubscriptionProductsSchema.parse(response);
};
