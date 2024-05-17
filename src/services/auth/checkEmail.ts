import { ApiRoutes } from '@/constants';
import { CheckEmailResponseSchema } from '@/types/schemas/response';
import { instance } from '../instance';

export default async (email: string) => {
	const response = await instance()
		.get(`${ApiRoutes.checkEmail}`, {
			searchParams: {
				email,
			},
		})
		.json();

	return CheckEmailResponseSchema.parse(response);
};
