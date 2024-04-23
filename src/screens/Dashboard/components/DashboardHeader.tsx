import TeamAvatar from '@/components/atoms/TeamAvatar/TeamAvatar';
import { config } from '@/theme/_config';
import layout from '@/theme/layout';
import { Dimensions, ImageBackground, StyleSheet, View } from 'react-native';

const { width } = Dimensions.get('window');
const headerRatio = 380 / 1440;
const { fonts, colors } = config;

interface DashboardHeaderProps {
	banner?: string;
	logo?: string;
	onLogoPress?: () => void;
}

const DashboardHeader = ({
	banner,
	logo,
	onLogoPress,
}: DashboardHeaderProps) => {
	const children = (
		<View style={styles.headerImageContainer}>
			<TeamAvatar logo={logo} onPress={onLogoPress} />
		</View>
	);

	return banner ? (
		<ImageBackground
			source={{ uri: banner }}
			style={styles.container}
			resizeMode="stretch"
		>
			{children}
		</ImageBackground>
	) : (
		<View style={[styles.container, { backgroundColor: colors.brand }]}>
			{children}
		</View>
	);
};

DashboardHeader.defaultProps = {
	banner: '',
	logo: '',
	onLogoPress: () => {},
};

export default DashboardHeader;

const styles = StyleSheet.create({
	container: {
		height: headerRatio * width,
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection: 'row',
		padding: 12,
		position: 'relative',
		...layout.shadowLight,
	},
	headerImageContainer: {
		position: 'absolute',
		bottom: '-25%',
		left: 18,
		borderColor: fonts.colors.lightgrey,
		borderWidth: 1,
		...layout.shadowLight,
	},
	headerImageStyle: {
		width: 74,
		height: 74,
	},
});
