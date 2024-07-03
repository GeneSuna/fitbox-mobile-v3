import { ApiRoutes } from '@/constants';
import { GetUserGymInfoV2ResponseSchema } from '@/types/schemas/response';
import { instance } from '../instance';

export default async (id?: string) => {
	const url = id
		? `${ApiRoutes.getGymInfoV2}?id=${id}`
		: ApiRoutes.getGymInfoV2;

	const response = await instance().get(url).json();

	return GetUserGymInfoV2ResponseSchema.parse(response);
};
