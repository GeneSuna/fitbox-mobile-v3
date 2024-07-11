import { ApiRoutes } from '@/constants';
import { securedInstance } from '@/services/instance';
import { GetScoreCommentsSchema } from '@/types/schemas/response';

export default async (score_id: number) => {
	const response = await securedInstance()
		.get(ApiRoutes.getScoreComments, {
			searchParams: {
				score_id,
			},
		})
		.json();

	return GetScoreCommentsSchema.parse(response);
};
