import { ApiRoutes } from '@/constants';
import { RegisterUserSchema } from '@/types/schemas/response';
import { securedInstance } from '../instance';

type PayloadType = {
	email: string;
	firstname: string;
	lastname: string;
	password: string;
	password_confirmation: string;
	team_id: number;
	role: number | null;
};

export default async (payload: PayloadType) => {
	const url = ApiRoutes.register;

	const response = await securedInstance()
		.post(url, {
			body: JSON.stringify(payload),
		})
		.json();

	return RegisterUserSchema.parse(response);
};
