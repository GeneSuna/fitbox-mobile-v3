import { ApiRoutes } from '@/constants';
import { GetWaiverSchema } from '@/types/schemas/response';
import { securedInstance } from '../instance';

export default async () => {
	const url = ApiRoutes.waiver;

	const response = await securedInstance().get(url).json();

	return GetWaiverSchema.parse(response);
};
