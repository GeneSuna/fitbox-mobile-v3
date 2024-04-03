import { ApiRoutes } from '@/constants';
import { GetConversationListResponseSchema } from '@/types/schemas/response';
import { securedInstance } from '../instance';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async (teamId: number, ...payload: any) => {
	const response = await securedInstance()
		.post(`${ApiRoutes.conversationList}`, {
			body: JSON.stringify(payload),
			searchParams: {
				team_id: teamId,
			},
		})
		.json();

	return GetConversationListResponseSchema.parse(response);
};
