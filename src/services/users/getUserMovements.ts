import { ApiRoutes } from '@/constants';
import { GetUserMovementSchema } from '@/types/schemas/response';
import { securedInstance } from '../instance';

export default async (movement_id: number) => {
	const response = await securedInstance()
		.get(ApiRoutes.userMovements, {
			searchParams: {
				movement_id,
			},
		})
		.json();

	return GetUserMovementSchema.parse(response);
};
