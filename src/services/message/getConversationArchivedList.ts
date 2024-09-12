import { ApiRoutes } from '@/constants';
import { GetConversationArchivedListSchema } from '@/types/schemas/response';
import { securedInstance } from '../instance';

export default async () => {
	const url = ApiRoutes.conversationArchivedList;

	const response = await securedInstance().get(url).json();

	return GetConversationArchivedListSchema.parse(response);
};
