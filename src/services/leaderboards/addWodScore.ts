/**
 * Add WOD Score
 *
 * Favorite/Benchmark
 */

import { ApiRoutes } from '@/constants';
import { AddScoreResponseSchema } from '@/types/schemas/response';
import { securedInstance } from '../instance';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AddWodScorePayload = { [key: string]: any };
export default async (payload: AddWodScorePayload) => {
	const response = await securedInstance()
		.post(`${ApiRoutes.addWodScore}`, {
			body: JSON.stringify(payload),
			throwHttpErrors: false,
		})
		.json();

	return AddScoreResponseSchema.parse(response);
};
