import { ApiRoutes } from '@/constants';
import { GetConversationListResponseSchema } from '@/types/schemas/response';
import { securedInstance } from '../instance';

export default async (teamId: number, payload: { page: number }) => {
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
