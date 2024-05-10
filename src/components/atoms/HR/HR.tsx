import { config } from '@/theme/_config';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

type HRProps = {
	color?: string;
	thickness?: number;
	margin?: boolean;
	style?: StyleProp<ViewStyle>;
};

const HR = (props: HRProps) => {
	const { color, thickness, margin, style } = props;

	return (
		<View
			style={[
				{
					borderColor: color || config.borders.colors.gray,
					borderWidth: thickness || StyleSheet.hairlineWidth,
					marginVertical: margin
						? config.metrics.rg
						: config.metrics.xs,
				},
				style,
			]}
		/>
	);
};

HR.defaultProps = {
	color: config.borders.colors.gray,
	thickness: StyleSheet.hairlineWidth,
	margin: true,
	style: undefined,
};

export default HR;
