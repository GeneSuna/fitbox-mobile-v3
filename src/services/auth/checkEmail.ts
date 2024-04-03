import { ApiRoutes } from '@/constants';
import { instance } from '@/services/instance';
import { CheckEmailResponseSchema } from '@/types/schemas/response';

export default async (email: string) => {
	const response = await instance()
		.get(`${ApiRoutes.checkEmail}?email=${email}`)
		.json();

	return CheckEmailResponseSchema.parse(response);
};
