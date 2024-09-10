import { z } from 'zod';

export const boolOrOneZero = z
	.union([
		z.literal(1),
		z.literal(0),
		z.boolean(),
		z.number(),
		z.string(),
		z.undefined(),
		z.null(),
	])
	.transform(value => {
		if (typeof value === 'boolean') {
			return value;
		}

		if (typeof value === 'string') {
			return value === '1';
		}

		if (typeof value === 'number') {
			return value === 1;
		}

		if (value === null || value === undefined) {
			return false;
		}

		return value === 1;
	});

export type GenderType = z.infer<typeof GenderSchema>;
export const GenderSchema = z.enum(['Male', 'Female', 'Other', '']).nullable();
