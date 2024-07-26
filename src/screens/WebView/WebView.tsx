import { HTMLView, ScrollView } from '@/components/atoms';
import { config } from '@/theme/_config';
import { ApplicationScreenProps, WebViewParams } from '@/types/navigation';
import { WebView as WV } from 'react-native-webview';

const { metrics } = config;

const WebView = ({ route }: ApplicationScreenProps) => {
	const { content, uri } = route.params as WebViewParams;

	if (content) {
		return (
			<ScrollView style={{ padding: metrics.rg }}>
				<HTMLView content={content} />
			</ScrollView>
		);
	}

	return <WV source={{ uri }} />;
};

export default WebView;
