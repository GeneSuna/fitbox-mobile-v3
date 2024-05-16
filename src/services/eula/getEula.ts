import { ApiRoutes } from '@/constants';
import { GetEulaSchema } from '@/types/schemas/response';
import { securedInstance } from '../instance';

export default async () => {
	const url = ApiRoutes.eula;

	const response = await securedInstance().get(url).json();
	return GetEulaSchema.parse(response);
};
