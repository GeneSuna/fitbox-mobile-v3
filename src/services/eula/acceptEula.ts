import { ApiRoutes } from '@/constants';
import { AcceptEulaSchema } from '@/types/schemas/response';
import { securedInstance } from '../instance';

export default async () => {
	const url = ApiRoutes.acceptEula;

	const response = await securedInstance().get(url).json();
	return AcceptEulaSchema.parse(response);
};
