import { config } from '@/theme/_config';
import layout from '@/theme/layout';
import { Constant } from '@/utils';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import WebView from 'react-native-webview';

const HelpScreen = () => {
	const [isLoading, setIsLoading] = useState(true);

	return (
		<View style={layout.flex_1}>
			{isLoading && (
				<View style={styles.loaderStyle}>
					<ActivityIndicator
						color={config.colors.brand}
						size="large"
					/>
				</View>
			)}
			<WebView
				style={layout.flex_1}
				source={{ uri: Constant.HELP_URL }}
				onLoad={() => setIsLoading(false)}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	loaderStyle: {
		justifyContent: 'center',
		alignItems: 'center',
		height: '100%',
	},
});

export default HelpScreen;
