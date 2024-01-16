import { useState } from 'react';
import {
	Alert,
	Dimensions,
	ImageSourcePropType,
	StyleSheet,
	View,
} from 'react-native';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import { Button, ImageVariant, Row, Spacer, Text } from '@/components/atoms';
import { Modal } from '@/components/molecules';
import { config } from '@/theme/_config';
import LogoImage from '@/theme/assets/images/logo_with_name.png';
import { ApplicationScreenProps } from '@/types/navigation';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

const LandingScreen = ({ navigation }: ApplicationScreenProps) => {
	const { t } = useTranslation(['landing']);

	const [optionsVisibility, setOptionsVisibility] = useState<boolean>(false);

	const toggleOptionVisibility = () =>
		setOptionsVisibility(!optionsVisibility);

	const navigateToPage = (page: string) => {
		setOptionsVisibility(false);

		Alert.alert('Navigate to', page);

		// eslint-disable-next-line no-console
		console.log(navigation);

		// TODO: Uncomment when screens are available
		// navigation.navigate(page as keyof ApplicationStackParamList);
	};

	return (
		<View style={styles.main}>
			<View style={styles.container}>
				<ImageVariant
					source={LogoImage as ImageSourcePropType}
					height={50}
					style={styles.logoImage}
					width={50}
				/>

				<View>
					<Button
						title={t('landing:login')}
						variant="darkgray"
						// style={styles.buttonStyle}
						// labelStyle={styles.buttonLabelStyle}
						onPress={() => console.log('test')}
					/>
					<Spacer size="rg" />
					<Button
						title={t('landing:register')}
						onPress={toggleOptionVisibility}
					/>
				</View>
			</View>

			{/* TODO: Think about making an atom component for this bit */}
			<Modal
				visible={optionsVisibility}
				onDismiss={toggleOptionVisibility}
			>
				<Row spacing="space-between">
					<Text size="lg">{t('landing:modal.title')}</Text>
					<MIcon
						name="close"
						size={25}
						onPress={toggleOptionVisibility}
					/>
				</Row>
				<Spacer size="rg" />
				<Button
					title={t('landing:modal.button.gym')}
					onPress={() => navigateToPage('SignUp')}
					labelStyle={styles.optionLabelStyle}
				/>
				<Spacer size="sm" />
				<Button
					title={t('landing:modal.button.invite')}
					mode="outlined"
					onPress={() => navigateToPage('Invite')}
					labelStyle={styles.optionLabelStyle}
				/>
			</Modal>
		</View>
	);
};

export default LandingScreen;

const styles = StyleSheet.create({
	main: {
		flex: 1,
		alignItems: 'center',
	},
	container: {
		flex: 1,
		justifyContent: 'space-between',
		paddingBottom: width * 0.3,
	},
	logoImage: {
		top: width * 0.25,
		resizeMode: 'contain',
		width: width * 0.6,
		height: width * 0.3,
	},
	mainContainer: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.3)',
		justifyContent: 'center',
	},
	modalBackground: {
		flex: 1,
		width: '100%',
		height: '100%',
		position: 'absolute',
	},
	card: {
		padding: config.metrics.md,
		width: '90%',
		alignSelf: 'center',
	},
	optionLabelStyle: {
		paddingVertical: config.metrics.md,
	},
});
