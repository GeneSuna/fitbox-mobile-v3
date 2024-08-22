import { ApiRoutes } from '@/constants';
import { GetScoringTypesSchema } from '@/types/schemas/response';
import { securedInstance } from '../instance';

export default async () => {
	const response = await securedInstance()
		.get(ApiRoutes.getScoringTypes)
		.json();

	return GetScoringTypesSchema.parse(response);
};
