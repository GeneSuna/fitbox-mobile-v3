import { ApiRoutes } from '@/constants';
import { PaymentIntentForInvoiceSchema } from '@/types/schemas/payment';
import { securedInstance } from '../instance';

export default async (id: number) => {
	const url = `${ApiRoutes.paymentIntentForInvoice}/${id}`;
	const response = await securedInstance()
		.post(url, {
			throwHttpErrors: false,
		})
		.json();

	return PaymentIntentForInvoiceSchema.parse(response);
};
