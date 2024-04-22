import { ApiRoutes } from '@/constants';
import { BookedSessionResponseSchema } from '@/types/schemas/response';
import { securedInstance } from '../instance';

export default async () => {
	const response = await securedInstance()
		.get(ApiRoutes.bookedSessions)
		.json();

	return BookedSessionResponseSchema.parse(response);
};
