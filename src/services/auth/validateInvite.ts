import { ApiRoutes } from '@/constants';
import { ValidateInviteCodeResponseSchema } from '@/types/schemas/response';
import { instance } from '../instance';

export default async (code: string) => {
	const response = await instance()
		.get(`${ApiRoutes.validateInvite}`, {
			searchParams: {
				code,
			},
		})
		.json();

	return ValidateInviteCodeResponseSchema.parse(response);
};
