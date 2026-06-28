import { Constant } from '@/utils';
import ky from 'ky';
import { getValidWSToken } from './auth';

export const wsApi = () =>
	ky.extend({
		prefixUrl: `${Constant.WS_SUPABASE_URL}/rest/v1/`,
		hooks: {
			beforeRequest: [
				async request => {
					const token = await getValidWSToken();
					if (token) {
						request.headers.set('Authorization', `Bearer ${token}`);
					}
					request.headers.set(
						'apikey',
						Constant.WS_SUPABASE_ANON_KEY,
					);
					request.headers.set('Content-Type', 'application/json');
				},
			],
		},
	});

export const wsRpc = async <T>(
	fn: string,
	params: Record<string, unknown> = {},
): Promise<T> => {
	const token = await getValidWSToken();
	return ky
		.post(`${Constant.WS_SUPABASE_URL}/rest/v1/rpc/${fn}`, {
			headers: {
				Authorization: token ? `Bearer ${token}` : '',
				apikey: Constant.WS_SUPABASE_ANON_KEY,
				'Content-Type': 'application/json',
			},
			json: params,
		})
		.json<T>();
};
