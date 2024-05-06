import { ApiRoutes } from '@/constants';
import { securedInstance } from '@/services/instance';
import { GeyGymClassesResponseSchema } from '@/types/schemas/response';

export default async () => {
	const url = ApiRoutes.gymClasses;
	const response = await securedInstance().get(url).json();

	return GeyGymClassesResponseSchema.parse(response);
};
