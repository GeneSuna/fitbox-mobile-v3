import { config } from '@/theme/_config';
import { StyleProp, View, ViewStyle } from 'react-native';
import { FontSizeMetrics } from '../Text/Text';

interface SpacerProps {
	size?: FontSizeMetrics;
	horizontal?: boolean;
}

const Spacer = ({ size, horizontal }: SpacerProps) => {
	const useSize = size as FontSizeMetrics;
	const fontMetrics = config.fonts.metrics;

	const viewStyle: StyleProp<ViewStyle> = {
		height: !horizontal ? fontMetrics[useSize] : 0,
		width: !horizontal ? 0 : fontMetrics[useSize],
	};

	return <View style={viewStyle} />;
};

Spacer.defaultProps = {
	size: 'sm',
	horizontal: false,
};

export default Spacer;
