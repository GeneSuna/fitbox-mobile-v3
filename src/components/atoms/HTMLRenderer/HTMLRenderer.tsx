import { config } from '@/theme/_config';
import { Constant } from '@/utils';
import { Alert, Linking } from 'react-native';
import RenderHTML, { defaultSystemFonts } from 'react-native-render-html';

interface HTMLViewProps {
	content: string;
	index?: number | null;
}

const HTMLRenderer = ({ content, index = null }: HTMLViewProps) => {
	const backgroundColor =
		index !== null && index % 2 === 0 ? '#F5F5F5' : '#FFFFFF';

	const renderContent = `
        <html>
		<head>
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		</head>
		<body>
		${content}
		</body>
        </html>`;
	const systemFonts = [
		...defaultSystemFonts,
		'Montserrat-Regular',
		'Montserrat-Bold',
	];

	const tagsStyles = {
		body: {
			fontFamily: 'Montserrat-Regular',
			fontSize: config.metrics.lg,
			margin: 0,
			paddingBottom: 10,
			backgroundColor,
			lineHeight: config.metrics.lg * 1.2,
		},
		ul: {
			listStyleType: 'disc',
			marginLeft: -10,
		},
		li: {
			fontFamily: 'Montserrat-Regular',
			fontSize: config.metrics.lg,
			lineHeight: config.metrics.lg * 1.2,
		},
		blockquote: {
			padding: 10,
			marginBottom: 20,
			fontSize: 17.5,
			borderLeftWidth: 5,
			borderLeftColor: '#eeeeee',
		},
	};

	const onLinkPress = (url: string) => {
		Alert.alert(
			'Open Link',
			'You are about to open a link in a different browser. Do you want to continue?',
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'OK',
					onPress: () => {
						void Linking.openURL(url);
					},
				},
			],
		);
	};

	return (
		<RenderHTML
			source={{ html: renderContent }}
			contentWidth={Constant.DEVICEWIDTH}
			tagsStyles={tagsStyles}
			systemFonts={systemFonts}
			renderersProps={{
				a: {
					onPress: (_event, href) => {
						if (href) {
							onLinkPress(href);
						}
					},
				},
			}}
		/>
	);
};

export default HTMLRenderer;
