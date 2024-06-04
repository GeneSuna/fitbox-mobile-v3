import { ApiRoutes } from '@/constants';
import { GetContacts } from '@/types/schemas/response';
import { securedInstance } from '../instance';

export default async () => {
	const url = ApiRoutes.contacts;

	const response = await securedInstance().get(url).json();

	return GetContacts.parse(response);
};
