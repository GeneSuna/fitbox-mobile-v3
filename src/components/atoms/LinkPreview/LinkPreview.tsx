import { navigate } from '@/navigators/NavigationRef';
import { config } from '@/theme/_config';
import { getLinkPreview } from 'link-preview-js';
import { useEffect, useState } from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import Text from '../Text/Text';

type Props = {
	link: string;
	preview: PreviewTypes | null;
};

type PreviewTypes = {
	charset: string;
	contentType: string;
	description: string;
	favicons: string[];
	images: string[];
	mediaType: string;
	siteName: string | undefined;
	title: string;
	url: string;
	videos: unknown[];
};

const LinkPreview = ({
	link,
	filename,
}: {
	link: string;
	filename?: string;
}) => {
	const [state, setState] = useState<Props>({
		link,
		preview: null,
	});

	useEffect(() => {
		void getLinkPreview(link).then(prev => {
			setState(prevState => ({
				...prevState,
				preview: prev as PreviewTypes,
			}));
		});
	}, []);

	if (!state.preview)
		return (
			<View style={styles.textContainer}>
				<Text bold center numberOfLines={1}>
					Failed to load preview.
				</Text>
			</View>
		);

	return (
		<TouchableWithoutFeedback
			onPress={() =>
				navigate('Webview', {
					title:
						filename ||
						(state.preview as PreviewTypes).title ||
						state.link,
					uri: link || state.preview?.url,
				})
			}
		>
			<View style={styles.textContainer}>
				<Text bold center numberOfLines={1}>
					{filename ||
						state.preview.title ||
						state.preview.url ||
						link}
				</Text>
				{state.preview.description !== '' &&
					state.preview.description && (
						<Text size="sm" center numberOfLines={1}>
							{state.preview.description}
						</Text>
					)}
			</View>
		</TouchableWithoutFeedback>
	);
};

const styles = StyleSheet.create({
	textContainer: {
		backgroundColor: '#eee',
		padding: config.metrics.rg,
	},
});

export default LinkPreview;
