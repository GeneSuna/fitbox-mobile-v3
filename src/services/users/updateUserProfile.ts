import { ApiRoutes } from '@/constants';
import {
	UpdateUserProfileSchema,
	UpdateUserProfileTypes,
} from '@/types/schemas/response';
import { securedInstance } from '../instance';

export default async (payload: UpdateUserProfileTypes) => {
	const url = ApiRoutes.userProfileUpdate;

	const response = await securedInstance()
		.put(url, {
			body: JSON.stringify(payload),
		})
		.json();

	return UpdateUserProfileSchema.parse(response);
};
