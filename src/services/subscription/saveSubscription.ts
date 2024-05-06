import { ApiRoutes } from '@/constants';
import { SaveSubscriptionSchema } from '@/types/schemas/response';
import { SaveSubscriptionPayloadType } from '@/types/schemas/subscription';
import { securedInstance } from '../instance';

export default async (payload: SaveSubscriptionPayloadType) => {
	const url = ApiRoutes.subscriptionSave;

	const response = await securedInstance()
		.post(url, {
			body: JSON.stringify(payload),
		})
		.json();

	return SaveSubscriptionSchema.parse(response);
};
