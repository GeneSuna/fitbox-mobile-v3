import { ApiRoutes } from '@/constants';
import { securedInstance } from '@/services/instance';
import { mmkvStorage } from '@/storage';
import { StripeGetCardDetails } from '@/types/schemas/response';

const getCardDetails = async (token: string, method: string) => {
	const type = method === 'card' ? 'tokens' : 'sources';
	const apiToken = () => mmkvStorage.getString('apiToken');

	// const testToken = 'tok_1ObuJzLaZd0oOKJFY0cHiTTf';
	const url = `${ApiRoutes.stripe}getDetails/${type}/${token}?api_key=${
		apiToken() as string
	}`;

	const response = await securedInstance().get(url).json();

	return StripeGetCardDetails.parse(response);
	// return response;
};

export default {
	getCardDetails,
};
