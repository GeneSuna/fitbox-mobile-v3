import { Card, Row, Spacer, Text } from '@/components/atoms';
import { config } from '@/theme/_config';
import { ComposeScreenProps } from '@/types/navigation';
import useStore from '@/zustand/Store';
import { useState } from 'react';
import { Alert, Platform, StyleSheet, View } from 'react-native';
import ImageCropPicker, {
	Image,
	ImageOrVideo,
	Video,
} from 'react-native-image-crop-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';

type AttachedFilesType = {
	fileName: string;
	base64: string;
};

const BrowseMediaScreen = ({ navigation }: ComposeScreenProps) => {
	const [processing, setProcessing] = useState<boolean>(false);
	const { setAppState } = useStore(state => ({
		attachedFiles: state.attachedFiles,
		setAppState: state.setAppState,
	}));

	const filesizeLimit = 25;
	const ALLOWED_IMAGE_TYPES = ['jpg', 'jpeg', 'png', 'bmp'];
	const ALLOWED_VIDEO_TYPES = ['mp4'];

	const ALLOWED_FILE_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES];

	const handleOpenGallery = async () => {
		await ImageCropPicker.openPicker({
			includeBase64: true,
			multiple: true,
		}).then((images: ImageOrVideo[]) => {
			if (images.length) {
				void processFiles(images);
			}
		});
	};

	const handleOpenCamera = async () => {
		await ImageCropPicker.openCamera({
			includeBase64: true,
			cropping: true,
		}).then(image => {
			if (image.path) {
				void processFiles([image]);
			}
		});
	};

	const getFileName = (path: string) => {
		const split = path.split('/');
		return split.pop();
	};
	const getFileExt = (filename: string) => {
		const split = filename.split('.');
		return split.pop()?.toLowerCase();
	};

	const processFiles = async (images: ImageOrVideo[]) => {
		setProcessing(true);

		const attchFiles: AttachedFilesType[] = [];

		const loopImages = images.map(file => {
			if (file.size > filesizeLimit * 1000000) {
				Alert.alert('File is too big. Limit us 30mb');
				return false;
			}
			const filePath =
				Platform.OS === 'android'
					? file.path.replace('file:///', '')
					: file.path;

			if ((file as Video).duration) {
				Alert.alert('Duration too long. Limit is 15 seconds');
				return false;
			}
			const fileName =
				Platform.OS === 'android'
					? getFileName(filePath)
					: file.filename;
			const ext = getFileExt(fileName as string);

			if (ALLOWED_FILE_TYPES.indexOf(ext as string) >= 0) {
				const type =
					ALLOWED_IMAGE_TYPES.indexOf(ext as string) >= 0
						? 'image'
						: 'video';
				const data = `data:${type}/${ext};base64,${
					(file as Image).data
				}`;

				return attchFiles.push({
					fileName: fileName as string,
					base64: data,
				});
			}
			Alert.alert(`${fileName}: File not allowed`);
			return false;
		});

		await Promise.all(loopImages);
		setAppState('attachedFiles', attchFiles);
		return navigation.pop();
	};

	return (
		<View style={styles.container}>
			{processing && (
				<Card>
					<Text center>Processing</Text>
				</Card>
			)}

			<Card
				style={styles.cardContainer}
				onPress={() => void handleOpenGallery()}
			>
				<Row spacing="space-between">
					<Row align="center">
						<Ionicons
							name="images"
							color={config.backgrounds.dark}
							size={config.metrics.lg}
						/>
						<Spacer horizontal />
						<Text size="md">Photos</Text>
					</Row>
					<Ionicons
						name="chevron-forward"
						color={config.backgrounds.dark}
						size={config.metrics.lg}
						style={styles.alignSelfCenter}
					/>
				</Row>
			</Card>

			<Card
				style={styles.cardContainer}
				onPress={() => void handleOpenCamera()}
			>
				<Row spacing="space-between">
					<Row align="center">
						<Ionicons
							name="camera"
							color={config.backgrounds.dark}
							size={config.metrics.lg}
						/>
						<Spacer horizontal />
						<Text size="md">Camera</Text>
					</Row>
					<Ionicons
						name="chevron-forward"
						color={config.backgrounds.dark}
						size={config.metrics.lg}
						style={styles.alignSelfCenter}
					/>
				</Row>
			</Card>

			<Card
				style={styles.cardContainer}
				onPress={() => navigation.navigate('fitboxGallery')}
			>
				<Row spacing="space-between">
					<Row align="center">
						<Ionicons
							name="images"
							color={config.backgrounds.dark}
							size={config.metrics.lg}
						/>
						<Spacer horizontal />
						<Text size="md">fitbox Gallery</Text>
					</Row>
					<Ionicons
						name="chevron-forward"
						color={config.backgrounds.dark}
						size={config.metrics.lg}
						style={styles.alignSelfCenter}
					/>
				</Row>
			</Card>

			<Card
				style={styles.cardContainer}
				onPress={() => navigation.navigate('Camera')}
			>
				<Row spacing="space-between">
					<Row align="center">
						<Ionicons
							name="videocam"
							color={config.backgrounds.dark}
							size={config.metrics.lg}
						/>
						<Spacer horizontal />
						<View>
							<Text size="md">Record Video</Text>
							<Text size="sm" color="mute">
								Record a 15-second video
							</Text>
						</View>
					</Row>
					<Ionicons
						name="chevron-forward"
						color={config.backgrounds.dark}
						size={config.metrics.lg}
						style={styles.alignSelfCenter}
					/>
				</Row>
			</Card>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: config.metrics.md,
	},
	cardContainer: {
		shadowRadius: 0,
		shadowOpacity: 0,
		borderColor: config.borders.colors.lightgrey,
		borderWidth: StyleSheet.hairlineWidth,
		borderRadius: 2,
	},
	alignSelfCenter: {
		alignSelf: 'center',
	},
});

export default BrowseMediaScreen;
