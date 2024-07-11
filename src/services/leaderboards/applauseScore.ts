import { ApiRoutes } from '@/constants';
import { securedInstance } from '@/services/instance';
import { ErrorMessageResponse } from '@/types/schemas/response';

export default async (
	score_id: number,
	applause: boolean,
	applause_type: string,
) => {
	const response = await securedInstance()
		.get(ApiRoutes.applauseScore, {
			searchParams: {
				score_id,
				applause,
				applause_type,
			},
		})
		.json();

	return ErrorMessageResponse.parse(response);
};
