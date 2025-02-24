import { ApiRoutes } from '@/constants';
import { FailedInvoicesSchema } from '@/types/schemas/payment';
import { securedInstance } from '../instance';

export default async () => {
	const response = await securedInstance()
		.get(ApiRoutes.failedPayments)
		.json();

	return FailedInvoicesSchema.parse(response);
};
