import {
	Dimensions,
	ImageSourcePropType,
	StyleSheet,
	View,
} from 'react-native';

import { Button, ImageVariant, Spacer } from '@/components/atoms';
import LogoImage from '@/theme/assets/images/logo_with_name.png';

const { width } = Dimensions.get('window');

const LandingScreen = () => {
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
						title="Login"
						variant="darkgray"
						// style={styles.buttonStyle}
						// labelStyle={styles.buttonLabelStyle}
					/>
					<Spacer size="rg" />
					<Button
						title="Register"
						// style={styles.buttonStyle}
						// labelStyle={styles.buttonLabelStyle}
					/>
				</View>
			</View>
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
});
