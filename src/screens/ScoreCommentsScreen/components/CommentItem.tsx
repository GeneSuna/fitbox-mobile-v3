import { Avatar, Row, Spacer, Text } from '@/components/atoms';
import { config } from '@/theme/_config';
import { Constant } from '@/utils';
import { isEmpty } from 'lodash';
import {
	Image,
	ImageSourcePropType,
	StyleProp,
	StyleSheet,
	View,
	ViewStyle,
} from 'react-native';

const CommentItem = ({
	comment,
	firstname,
	lastname,
	profile_image,
	right,
}: {
	comment: string;
	firstname: string;
	lastname: string;
	profile_image: string;
	right: boolean;
}) => {
	let tStyle: StyleProp<ViewStyle> = {
		...styles.triangleStyle,
	};

	if (right) {
		tStyle = {
			...styles.triangleStyle,
			right: Constant.DEVICEWIDTH / 40,
		};
	} else {
		tStyle = {
			...styles.triangleStyle,
			left: Constant.DEVICEWIDTH / 40,
		};
	}

	const alignSelf: StyleProp<ViewStyle> = {
		alignSelf: right ? 'flex-end' : 'flex-start',
	};

	const isGifUrl = (url: string) => {
		return /\.(gif)$/i.test(url);
	};

	const lines = comment.split('\n');
	const hasGIF = isGifUrl(lines[lines.length - 1] as string);
	const combinedString =
		lines.length > 1 && hasGIF
			? lines.slice(0, -1).join('\n')
			: lines.join('\n');

	return (
		<View style={{ marginBottom: config.metrics.rg }}>
			<View style={[styles.boxStyle, alignSelf]}>
				{!isEmpty(combinedString) && (
					<Text size="rg" color="darkgray">
						{combinedString}
					</Text>
				)}
				{hasGIF && (
					<Image
						source={{ uri: lines[lines.length - 1] }}
						style={styles.gifPreviewStyle}
					/>
				)}
				<View style={tStyle} />
			</View>
			<Spacer size="rg" />
			<Row style={alignSelf} align="center">
				<Avatar
					source={profile_image as ImageSourcePropType}
					style={{ marginRight: config.metrics.sm }}
					size={20}
				/>

				<Text color="darkgray" size="sm">
					{firstname} {lastname}
				</Text>
			</Row>
		</View>
	);
};

const styles = StyleSheet.create({
	boxStyle: {
		position: 'relative',
		backgroundColor: '#F4F4F3',
		paddingVertical: config.metrics.md,
		paddingHorizontal: config.metrics.lg,
		borderRadius: 10,
		maxWidth: '60%',
	},
	triangleStyle: {
		width: 0,
		height: 0,
		borderLeftWidth: Constant.DEVICEWIDTH / 40,
		borderRightWidth: Constant.DEVICEWIDTH / 40,
		borderTopWidth: Constant.DEVICEHEIGHT / 60,
		borderStyle: 'solid',
		backgroundColor: 'transparent',
		borderLeftColor: 'transparent',
		borderRightColor: 'transparent',
		borderTopColor: '#F4F4F3',
		position: 'absolute',
		bottom: -10,
	},
	gifPreviewStyle: {
		width: 170,
		height: 170,
	},
});

export default CommentItem;
