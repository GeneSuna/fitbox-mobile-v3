import useAuth from '@/auth/hooks/useAuth';
import { SafeScreen } from '@/components/template';
import useStore from '@/zustand/Store';
import { useEffect, useRef } from 'react';
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

	const storeUrl = `${shopUrl}?fb_email=${user?.user_data.email}&fb_first=${user?.user_data.first_name}&fb_last=${user?.user_data.last_name}&fb_sig=${storeSignature}&fb_expiry=${storeSignatureExpiry}&fb_gym=${teamId}`;
	useEffect(() => {
		ref.current?.reload();
	}, [shopUrl]);

	return (
		<SafeScreen>
			<WebView ref={ref} source={{ uri: storeUrl }} />
		</SafeScreen>
	);
};

export default Shop;
