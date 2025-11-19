/* eslint-disable no-console */
import useAuth from '@/auth/hooks/useAuth';
import { SafeScreen } from '@/components/template';
import useStore from '@/zustand/Store';
import { useEffect, useMemo, useRef } from 'react';
import WebView from 'react-native-webview';

const Shop = () => {
	const ref = useRef<WebView>(null);
	const shopUrl = useStore(state => state.shopUrl);
	const { user } = useAuth();
	const { storeSignature, storeSignatureExpiry, teamId } = useStore(
		state => ({
			storeSignature: state.storeSignature,
			storeSignatureExpiry: state.storeSignatureExpiry,
			teamId: state.teamId,
		}),
	);

	const storeUrl = useMemo(() => {
		return `${shopUrl}?fb_email=${user?.user_data.email}&fb_first=${user?.user_data.first_name}&fb_last=${user?.user_data.last_name}&fb_sig=${storeSignature}&fb_expiry=${storeSignatureExpiry}&fb_gym=${teamId}`;
	}, [shopUrl, user, storeSignature, storeSignatureExpiry, teamId]);

	useEffect(() => {
		ref.current?.reload();
	}, [storeUrl]);

	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		startMobilePay();
	}, []);

	const startMobilePay = async () => {
		try {
			const baseUrl = shopUrl.replace(/\/shop\/?$/, '/');
			const mobilePayUrl = `${baseUrl}wp-json/fitbox/v1/mobile-pay/start`;

			console.log('Calling: ', mobilePayUrl);

			const response = await fetch(mobilePayUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					// Add auth header if your endpoint needs it:
					// "Authorization": `Bearer ${token}`,
				},
				body: JSON.stringify({
					order_key: 123,
				}),
			});

			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			const data = await response.json();
			console.log('mobile-pay/start result:', data);
		} catch (err) {
			console.error('Error calling mobile pay:', err);
		}
	};

	return (
		<SafeScreen>
			<WebView ref={ref} key={storeUrl} source={{ uri: storeUrl }} />
		</SafeScreen>
	);
};

export default Shop;
