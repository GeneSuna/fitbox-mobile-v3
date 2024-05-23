import useAuth from '@/auth/hooks/useAuth';
import { Button, Row, Spacer, Text } from '@/components/atoms';
import { acceptWaiver, getWaiver } from '@/services/waivers';
import { config } from '@/theme/_config';
import layout from '@/theme/layout';
import { ApplicationScreenProps } from '@/types/navigation';
import { UserSchemaType } from '@/types/schemas/user';
import { useEffect, useState } from 'react';
import {
	ActivityIndicator,
	Alert,
	Permission,
	PermissionsAndroid,
	Platform,
	StyleSheet,
	View,
} from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';
import SimpleToast from 'react-native-simple-toast';
import Icon from 'react-native-vector-icons/FontAwesome5';

type StateTypes = {
	waiver: string;
	loading: boolean;
	accepting: boolean;
	downloading: boolean;
};

const GymWaiverScreen = ({ navigation }: ApplicationScreenProps) => {
	const { signOut, user, updateUser } = useAuth();
	const [state, setState] = useState<StateTypes>({
		waiver: '',
		accepting: false,
		loading: true,
		downloading: false,
	});

	useEffect(() => {
		void (async () => {
			try {
				const res = await getWaiver();
				if (!res.error && res.url && res.url !== '')
					setState({ ...state, loading: false, waiver: res.url });
			} catch (e) {
				Alert.alert(e as string);
				setState({ ...state, loading: false });
			}
		})();
	}, []);

	const handleDownload = async () => {
		if (!state.waiver || state.waiver === '') {
			Alert.alert('No waiver to download');
			return false;
		}

		navigation.navigate('PDFViewer', {
			title: 'Gym Waiver',
			waiverUrl: state.waiver,
		});

		if (Platform.OS === 'android') {
			const granted = await PermissionsAndroid.check(
				PermissionsAndroid.PERMISSIONS
					.WRITE_EXTERNAL_STORAGE as Permission,
			);
			if (!granted) {
				await PermissionsAndroid.request(
					PermissionsAndroid.PERMISSIONS
						.WRITE_EXTERNAL_STORAGE as Permission,
				);
			}

			const { fs } = ReactNativeBlobUtil;
			const configFunction =
				ReactNativeBlobUtil.config.bind(ReactNativeBlobUtil);
			const PictureDir =
				Platform.OS !== 'android'
					? fs.dirs.DocumentDir
					: fs.dirs.PictureDir;

			const pathPieces = state.waiver.split('.');

			const ext = pathPieces[pathPieces.length - 1];

			const options = {
				fileCache: true,
				addAndroidDownloads: {
					useDownloadManager: true,
					notification: true,
					path: `${PictureDir}/fitbox-waiver.${ext as string}`,
				},
			};

			configFunction(options)
				.fetch('GET', state.waiver)
				.then(() => {
					SimpleToast.show(
						'Waiver downloaded successfully',
						SimpleToast.SHORT,
					);
				})
				.catch(() => {
					SimpleToast.show(
						'There was an issue downloading the waiver',
						SimpleToast.SHORT,
					);
				});
		}

		return true;
	};

	const handleDecline = () => {
		signOut();
		navigation.reset({
			index: 0,
			routes: [{ name: 'Landing' }],
		});
	};

	const handleAccept = async () => {
		try {
			if (state.accepting) return false;

			setState({ ...state, accepting: true });

			await acceptWaiver();
			const session = user?.user_data as UserSchemaType;

			session.waiver_accepted = true;
			updateUser(session);
			navigation.navigate('Startup');

			return setState({ ...state, accepting: false });
		} catch (e) {
			setState({ ...state, accepting: false });
			return Alert.alert('Something went wrong');
		}
	};

	return state.loading ? (
		<View style={styles.loader}>
			<ActivityIndicator size="large" color={config.colors.brand} />
		</View>
	) : (
		<View style={styles.container}>
			<View style={styles.headline}>
				<Icon
					name="file-alt"
					size={150}
					color={config.backgrounds.mute}
				/>
				<Text size="h3" bold center color="brand">
					Gym Waiver
				</Text>
				<Text size="md" center color="mute">
					Tap the &quot;Accept&quot; button to proceed
				</Text>
				<Spacer size="lg" />
				<Button
					title="Read Waiver"
					onPress={() => void handleDownload()}
				/>
				<Spacer />
				<Text center color="mute">
					Please read the waiver carefully
				</Text>
			</View>
			<Spacer size="lg" />

			<View style={styles.footer}>
				<Row spacing="center">
					<View style={layout.flex_1}>
						<Button
							title="Decline"
							style={{ backgroundColor: config.colors.danger }}
							onPress={handleDecline}
						/>
					</View>
					<Spacer horizontal />
					<View style={layout.flex_1}>
						<Button
							title="Accept"
							style={{ backgroundColor: config.colors.success }}
							onPress={() => void handleAccept()}
							loading={state.accepting}
						/>
					</View>
				</Row>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		paddingVertical: config.metrics.xl,
		paddingHorizontal: config.metrics.lg,
	},
	headline: {
		justifyContent: 'center',
		alignItems: 'center',
		flex: 1,
	},
	footer: {
		justifyContent: 'flex-end',
	},
	loader: {
		flex: 1,
		justifyContent: 'center',
	},
});

export default GymWaiverScreen;
