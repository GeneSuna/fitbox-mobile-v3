import { ApiRoutes } from '@/constants';
import { AddScoreResponseSchema } from '@/types/schemas/response';
import { securedInstance } from '../instance';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AddScorePayload = { [key: string]: any };
export default async (payload: AddScorePayload) => {
	const response = await securedInstance(60000)
		.post(`${ApiRoutes.addScore}`, {
			body: JSON.stringify(payload),
			throwHttpErrors: false,
		})
		.json();

	return AddScoreResponseSchema.parse(response);
};
