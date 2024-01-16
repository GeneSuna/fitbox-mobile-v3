import { config } from '@/theme/_config';
import { ComponentProps } from 'react';
import { StyleProp, TextStyle, Text as Txt } from 'react-native';

type FontSizeMetrics = keyof typeof config.fonts.metrics;
type FontColors = keyof typeof config.fonts.colors;

interface TextProps extends ComponentProps<typeof Txt> {
	size?: FontSizeMetrics;
	color?: FontSizeMetrics;
	bold?: boolean;
	center?: boolean;
	children: string;
}

const Text = ({ size, color, bold, center, ...rest }: TextProps) => {
	const customStyle: StyleProp<TextStyle> = {
		// font size
		fontSize: config.fonts.metrics[size as FontSizeMetrics],

		// font color
		color: config.fonts.colors[color as FontColors],

		// font weight
		...(bold ? { fontWeight: 'bold' } : {}),

		// center text
		...(center ? { textAlign: 'center' } : {}),
	};

	return <Txt {...rest} style={customStyle} />;
};

Text.defaultProps = {
	size: 'rg',
	color: 'black',
	bold: false,
	center: false,
};

export type { FontColors, FontSizeMetrics };
export default Text;
