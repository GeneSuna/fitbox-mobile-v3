import { ApiRoutes } from '@/constants';
import { UpdateUserProfileSchema } from '@/types/schemas/response';
import { securedInstance } from '../instance';

type PayloadProps = {
	id: number;
	firstname: string;
	lastname: string;
	dob: Date | string;
	gender: string;
	email: string;
	contact_phone: string;
	height: number;
	current_weight: number;
	weight_unit: string;
	emergency_contact_name: string;
	emergency_contact_number: string;
};

export default async (payload: PayloadProps) => {
	const url = ApiRoutes.userProfileUpdate;

	const response = await securedInstance()
		.put(url, {
			body: JSON.stringify(payload),
		})
		.json();

	return UpdateUserProfileSchema.parse(response);
};
