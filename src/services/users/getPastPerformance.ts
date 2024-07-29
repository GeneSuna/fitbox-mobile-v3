import { ApiRoutes } from '@/constants';
import { GetPastPerformanceResponseSchema } from '@/types/schemas/response';
import { securedInstance } from '../instance';

export default async (classId: number) => {
	const url = `${ApiRoutes.getPastPerformance}/${classId}`;
	const response = await securedInstance().get(url).json();
	return GetPastPerformanceResponseSchema.parse(response);
};
