import { ApiRoutes } from '@/constants';
import { GetAttendanceProfileResponseSchema } from '@/types/schemas/response';
import { securedInstance } from '../instance';

export default async (id: number) => {
	const url = `${ApiRoutes.attendanceProfile}/${id}`;

	const response = await securedInstance().get(url).json();
	return GetAttendanceProfileResponseSchema.parse(response);
};
