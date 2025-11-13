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

	return (
		<SafeScreen>
			<WebView ref={ref} key={storeUrl} source={{ uri: storeUrl }} />
		</SafeScreen>
	);
};

export default Shop;
