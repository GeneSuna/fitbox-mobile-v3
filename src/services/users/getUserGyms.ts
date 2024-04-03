import { ApiRoutes } from '@/constants';
import { GetUserGymResponseSchema } from '@/types/schemas/response';
import { securedInstance } from '../instance';

export default async () => {
	const response = await securedInstance().get(ApiRoutes.getUserGyms).json();
	return GetUserGymResponseSchema.parse(response);
};
