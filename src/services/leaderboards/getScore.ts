import { ApiRoutes } from '@/constants';
import { GetScoreResultResponseSchema } from '@/types/schemas/response';
import { securedInstance } from '../instance';

export default async (sessionId: number) => {
	const response = await securedInstance()
		.get(`${ApiRoutes.getScore}`, {
			searchParams: {
				session_id: sessionId,
			},
		})
		.json();

	return GetScoreResultResponseSchema.parse(response);
};
