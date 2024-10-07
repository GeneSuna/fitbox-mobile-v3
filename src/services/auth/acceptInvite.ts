import { ApiRoutes } from '@/constants';
import { AcceptInviteResponseSchema } from '@/types/schemas/response';
import { securedInstance } from '../instance';

export default async (payload: unknown) => {
	const url = ApiRoutes.acceptInvite;

	const response = await securedInstance()
		.post(url, {
			body: JSON.stringify(payload),
		})
		.json();

	return AcceptInviteResponseSchema.parse(response);
};
