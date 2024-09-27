import { Text } from '@/components/atoms';
import { useTheme } from '@/theme';
import { config } from '@/theme/_config';
import { StyleSheet, View } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';

const { metrics } = config;

interface DashboardActionButtonProps {
	onPress: () => void;
	text: string;
	icon: string;
}

const DashboardActionButton = ({
	onPress,
	text,
	icon,
}: DashboardActionButtonProps) => {
	const { colors } = useTheme();

	const stringHasOneWord = text.split(' ').length === 1;
	return (
		<TouchableRipple onPress={onPress} style={styles.container}>
			<View style={styles.tileContainer}>
				<View style={styles.tileIconContainer}>
					<Icon name={icon} size={metrics.lg} color={colors.brand} />
				</View>

				<View style={styles.tileTextContainer}>
					<Text
						size="md"
						color="brand"
						bold
						numberOfLines={stringHasOneWord ? 1 : 2}
						style={styles.tileText}
					>
						{text}
					</Text>
				</View>
			</View>
		</TouchableRipple>
	);
};

export default DashboardActionButton;

const styles = StyleSheet.create({
	container: {
		width: '48%',
		borderWidth: 1,
		borderColor: config.colors.brand,
		flexWrap: 'wrap',
		paddingVertical: config.metrics.sm,
		paddingLeft: 10,
		paddingRight: config.metrics.sm,
		borderRadius: 4,
		justifyContent: 'center',
		minHeight: 55,
		marginBottom: metrics.md,
	},
	tileTextContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	tileIconContainer: {
		justifyContent: 'center',
		marginRight: metrics.sm,
	},
	tileContainer: {
		flexDirection: 'row',
	},
	tileText: {
		flex: 1,
		textAlign: 'center',
	},
});
