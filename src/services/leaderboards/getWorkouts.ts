import { ApiRoutes } from '@/constants';
import { GetWorkoutResponseSchema } from '@/types/schemas/response';
import { securedInstance } from '../instance';

export default async () => {
	const response = await securedInstance().get(ApiRoutes.getWorkouts).json();
	return GetWorkoutResponseSchema.parse(response);
};
