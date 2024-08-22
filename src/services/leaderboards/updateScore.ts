import { ApiRoutes } from '@/constants';
import { AddScoreResponseSchema } from '@/types/schemas/response';
import { securedInstance } from '../instance';
import { AddScorePayload } from './addScore';

export default async (id: number, payload: AddScorePayload) => {
	const response = await securedInstance()
		.post(`${ApiRoutes.userUpdateScore}`, {
			body: JSON.stringify(payload),
			throwHttpErrors: false,
			searchParams: {
				id,
			},
		})
		.json();

	return AddScoreResponseSchema.parse(response);
};
