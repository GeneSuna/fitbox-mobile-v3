import { ApiRoutes } from '@/constants';
import { GetPaymentMethodSchema } from '@/types/schemas/response';
import { securedInstance } from '../instance';

export default async (id: string) => {
	const url = id
		? `${ApiRoutes.getPaymentMethod}/${id}`
		: `${ApiRoutes.getPaymentMethod}`;
	const response = await securedInstance().get(url).json();
	return GetPaymentMethodSchema.parse(response);
};
