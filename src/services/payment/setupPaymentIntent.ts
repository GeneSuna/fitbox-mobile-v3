import { ApiRoutes } from '@/constants';
import { SetupPaymentIntent } from '@/types/schemas/response';
import { securedInstance } from '../instance';

export default async () => {
	const url = ApiRoutes.setupPaymentIntent;

	const response = await securedInstance().post(url).json();
	return SetupPaymentIntent.parse(response);
};
