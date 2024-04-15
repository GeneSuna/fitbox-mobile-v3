import { config } from '@/theme/_config';
import { StyleSheet, View } from 'react-native';

type HRProps = {
	color?: string;
	thickness?: number;
	margin?: boolean;
};

const HR = (props: HRProps) => {
	const { color, thickness, margin } = props;

	return (
		<View
			style={{
				borderColor: color || config.borders.colors.gray,
				borderWidth: thickness || StyleSheet.hairlineWidth,
				marginVertical: margin ? config.metrics.rg : config.metrics.xs,
			}}
		/>
	);
};

HR.defaultProps = {
	color: config.borders.colors.gray,
	thickness: StyleSheet.hairlineWidth,
	margin: true,
};

export default HR;
