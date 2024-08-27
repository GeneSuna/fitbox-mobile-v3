import { resetRoot } from '@/navigators/NavigationRef';
import { mmkvStorage } from '@/storage';
import { Constant, Say } from '@/utils';
import ky from 'ky';

/**
 * Get the API token from the storage
 */
const xAppVersion = `${process.env.APP_VERSION ? process.env.APP_VERSION : ''}`;

/**
 * Get the API token from the storage
 * @returns API Token
 */
const apiToken = () =>
	Constant.MASQUERADE_USER_API_TOKEN || mmkvStorage.getString('apiToken');

/**
 * Get the API URL from the storage
 * @returns API URL
 */
const apiUrl = () => mmkvStorage.getString('apiUrl');

/**
 * Create a new instance of ky
 * @returns KyInstance
 */
export const instance = () =>
	ky.extend({
		prefixUrl: apiUrl() || Constant.API_URL,
		headers: {
			Accept: 'application/json',
		},
		signal: undefined,
	});

/**
 * Create a new instance of ky with secured headers
 * @returns KyInstance
 */
export const securedInstance = () =>
	ky.extend({
		prefixUrl: apiUrl() || Constant.API_URL,
		searchParams: {
			api_key: apiToken() || '',
		},
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			'x-app-version': xAppVersion,
		},
		hooks: {
			beforeRequest: [
				request => {
					// eslint-disable-next-line no-console
					console.log('@request', request.url.toString());

					// TODO: additional headers
					// request.headers.set('X-Requested-With', 'ky');
				},
			],
			afterResponse: [
				(_, __, response) => {
					// if status code is 401, remove api token and logout
					if (response.status === 401) {
						// remove api token and user data
						mmkvStorage.clearAll();

						// Say error navigate to login
						Say.err('Unauthorized access, please login again!');

						// Go to startup
						resetRoot();
					}
				},
			],
		},
	});
