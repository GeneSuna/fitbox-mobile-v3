import { ApiRoutes } from '@/constants';
import { GetPaymentInfoSchema } from '@/types/schemas/response';
import { securedInstance } from '../instance';

export default async () => {
	const url = ApiRoutes.getPaymentInfo;

	const response = await securedInstance().get(url).json();

	return GetPaymentInfoSchema.parse(response);
};
