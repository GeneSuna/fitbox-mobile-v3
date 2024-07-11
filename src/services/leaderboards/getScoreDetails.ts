import { ApiRoutes } from '@/constants';
import { securedInstance } from '@/services/instance';
import { GetScoreDetailsSchema } from '@/types/schemas/response';

export default async (score_id: number) => {
	const response = await securedInstance()
		.get(ApiRoutes.getScoreDetails, {
			searchParams: {
				score_id,
			},
		})
		.json();

	return GetScoreDetailsSchema.parse(response);
};
