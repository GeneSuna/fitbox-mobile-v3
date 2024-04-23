import { ApiRoutes } from '@/constants';
import { GetUserProfileResponseSchema } from '@/types/schemas/response';
import { securedInstance } from '../instance';

export default async (id?: number) => {
	const url = id
		? `${ApiRoutes.userProfile}?id=${id}`
		: ApiRoutes.userProfile;

	const response = await securedInstance().get(url).json();
	return GetUserProfileResponseSchema.parse(response);
};
