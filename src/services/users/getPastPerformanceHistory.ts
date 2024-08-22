import { ApiRoutes } from '@/constants';
import { GetPastPerformanceHistorySchema } from '@/types/schemas/response';
import { Constant } from '@/utils';
import { securedInstance } from '../instance';

export default async (query: string, page: number) => {
	const response = await securedInstance()
		.get(ApiRoutes.userPerformanceHistory, {
			searchParams: {
				query,
				page,
				limit: Constant.PAGINATE_FETCH_LIMIT,
			},
		})
		.json();

	return GetPastPerformanceHistorySchema.parse(response);
};
