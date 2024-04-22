import { SafeScreen } from '@/components/template';
import useStore from '@/zustand/Store';
import { useEffect, useRef } from 'react';
import WebView from 'react-native-webview';

const Shop = () => {
	const ref = useRef<WebView>(null);
	const shopUrl = useStore(state => state.shopUrl);

	useEffect(() => {
		ref.current?.reload();
	}, [shopUrl]);

	return (
		<SafeScreen>
			<WebView ref={ref} source={{ uri: shopUrl }} />
		</SafeScreen>
	);
};

export default Shop;
