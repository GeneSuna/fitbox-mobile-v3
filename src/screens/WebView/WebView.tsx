import { HTMLView, ScrollView } from '@/components/atoms';
import { config } from '@/theme/_config';
import { ApplicationScreenProps, WebViewParams } from '@/types/navigation';

const { metrics } = config;

const WebView = ({ route }: ApplicationScreenProps) => {
	const { content } = route.params as WebViewParams;

	return (
		<ScrollView style={{ padding: metrics.rg }}>
			<HTMLView content={content} />
		</ScrollView>
	);
};

export default WebView;
