import { ApiRoutes } from '@/constants';
import { AddScoreResponseSchema } from '@/types/schemas/response';
import { securedInstance } from '../instance';
import { AddScorePayload } from './addScore';

export default async (payload: AddScorePayload) => {
	const response = await securedInstance()
		.post(`${ApiRoutes.addScoreMovement}`, {
			body: JSON.stringify(payload),
			throwHttpErrors: false,
		})
		.json();

	return AddScoreResponseSchema.parse(response);
};
