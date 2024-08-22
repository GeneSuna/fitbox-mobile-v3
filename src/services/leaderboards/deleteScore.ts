import { ApiRoutes } from '@/constants';
import { DeleteScoreResponseSchema } from '@/types/schemas/response';
import { securedInstance } from '../instance';

export default async (scoreId: number) => {
	const response = await securedInstance()
		.post(ApiRoutes.userDeleteScore, {
			body: JSON.stringify({ id: scoreId }),
		})
		.json();

	return DeleteScoreResponseSchema.parse(response);
};
