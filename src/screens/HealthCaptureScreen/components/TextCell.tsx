import { Text } from '@/components/atoms';
import { config } from '@/theme/_config';
import { StyleProp, StyleSheet, TextStyle, View } from 'react-native';

const TextCell = ({
	title,
	required,
	centered,
	noborder,
}: {
	title: string | undefined;
	required: boolean | undefined;
	centered: boolean;
	noborder: boolean;
}) => {
	const textStyles: StyleProp<TextStyle> = {
		...styles.cellTextStyle,
		textAlign: centered ? 'center' : 'left',
	};

	return (
		<View style={noborder ? styles.cellStyleNoBorder : styles.cellStyle}>
			<Text style={textStyles}>{title}</Text>
			{required && (
				<Text color="danger" size="md" style={styles.textRequired}>
					*
				</Text>
			)}
		</View>
	);
};

export default TextCell;

const styles = StyleSheet.create({
	cellStyle: {
		paddingHorizontal: 5,
		paddingVertical: 12,
		borderWidth: 1,
		flex: 1,
		height: '100%',
		alignItems: 'center',
		justifyContent: 'center',
	},
	cellStyleNoBorder: {
		paddingHorizontal: 5,
		paddingVertical: 12,
		flex: 1,
		height: '100%',
		justifyContent: 'center',
	},
	cellTextStyle: {
		fontSize: config.fonts.metrics.md,
	},
	textRequired: {
		position: 'absolute',
		right: 5,
		top: 2,
	},
});
