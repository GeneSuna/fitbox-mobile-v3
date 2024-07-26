import { Image, StyleSheet, View } from 'react-native';
import Lightbox from 'react-native-lightbox-v2';

const ImagePop = ({ source }: { source: string }) => {
	const renderContent = () => (
		<Image
			style={styles.imageContentStyle}
			source={{ uri: source }}
			resizeMode="contain"
		/>
	);

	return (
		<View>
			<Lightbox renderContent={renderContent} renderHeaderCancelButton>
				<Image
					style={styles.imageStyle}
					source={{ uri: source }}
					resizeMode="contain"
				/>
			</Lightbox>
		</View>
	);
};
const styles = StyleSheet.create({
	imageStyle: {
		width: 200,
		height: 170,
	},
	imageContentStyle: { width: 'auto', height: '100%' },
});

export default ImagePop;
