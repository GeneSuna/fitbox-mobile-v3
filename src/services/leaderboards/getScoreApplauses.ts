import { ApiRoutes } from '@/constants';
import { securedInstance } from '@/services/instance';
import { GetScoreApplausesSchema } from '@/types/schemas/response';

export default async (score_id: number) => {
	const response = await securedInstance()
		.get(ApiRoutes.getScoreApplauses, {
			searchParams: {
				score_id,
			},
		})
		.json();

	return GetScoreApplausesSchema.parse(response);
};
