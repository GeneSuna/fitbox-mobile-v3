import { ApiRoutes } from '@/constants';
import { securedInstance } from '@/services/instance';
import { GetGymVenuesResponseSchema } from '@/types/schemas/response';

export default async () => {
	const url = ApiRoutes.gymVenues;
	const response = await securedInstance().get(url).json();

	return GetGymVenuesResponseSchema.parse(response);
};
