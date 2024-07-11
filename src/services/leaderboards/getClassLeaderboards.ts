import { ApiRoutes } from '@/constants';
import { securedInstance } from '@/services/instance';
import { GetClassLeaderboardsSchema } from '@/types/schemas/response';

export default async (class_id: number, date: string) => {
	const response = await securedInstance()
		.get(ApiRoutes.getClassLeaderboard, {
			searchParams: {
				class_id,
				date,
			},
		})
		.json();

	return GetClassLeaderboardsSchema.parse(response);
};
