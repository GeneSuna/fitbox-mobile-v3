import { ApiRoutes } from '@/constants';
import { GetFitboxGallerySchema } from '@/types/schemas/response';
import { securedInstance } from '../instance';

export default async () => {
	const url = ApiRoutes.fitboxGallery;

	const response = await securedInstance().get(url).json();

	return GetFitboxGallerySchema.parse(response);
};
