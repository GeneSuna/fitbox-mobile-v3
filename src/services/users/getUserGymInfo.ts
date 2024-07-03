import { ApiRoutes } from '@/constants';
import { GetUserGymInfoResponseSchema } from '@/types/schemas/response';
import { securedInstance } from '../instance';

export default async (id?: number) => {
	// append id to url if it exists
	const url = id ? `${ApiRoutes.getGymInfo}?id=${id}` : ApiRoutes.getGymInfo;

	const response = await securedInstance().get(url).json();

	return GetUserGymInfoResponseSchema.parse(response);
};
