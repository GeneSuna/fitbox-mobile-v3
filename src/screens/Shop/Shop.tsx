import layout from '@/theme/layout';
import useStore from '@/zustand/Store';
import { View } from 'react-native';
import WebView from 'react-native-webview';

const Shop = () => {
	const shopUrl = useStore(state => state.shopUrl);

	return (
		<View style={layout.flex_1}>
			<WebView source={{ uri: shopUrl }} />
		</View>
	);
};

export default Shop;
