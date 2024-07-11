import { ApiRoutes } from '@/constants';
import { ErrorMessageResponse } from '@/types/schemas/response';
import { securedInstance } from '../instance';

export default async (payload: { score_id: number; comment: string }) => {
	const url = ApiRoutes.commentScore;

	const response = await securedInstance()
		.post(url, {
			body: JSON.stringify(payload),
		})
		.json();

	return ErrorMessageResponse.parse(response);
};
