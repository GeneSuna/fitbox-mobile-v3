import { config } from '@/theme/_config';
import { ComponentProps } from 'react';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { Button as Btn } from 'react-native-paper';

type ButtonTypeWithoutChildren = Omit<ComponentProps<typeof Btn>, 'children'>;
type ButtonVariant = keyof typeof config.colors;

interface ButtonProps extends ButtonTypeWithoutChildren {
	title: string;
	sm?: boolean;
	rounded?: boolean;
	variant?: ButtonVariant;
}

const contrastColor = (color: string) => {
	const r = parseInt(color.substring(1, 3), 16);
	const g = parseInt(color.substring(3, 5), 16);
	const b = parseInt(color.substring(5, 7), 16);
	const yiq = (r * 299 + g * 587 + b * 114) / 1000;
	return yiq >= 140 ? 'black' : 'white';
};

const Button = ({ title, sm, rounded, variant, ...rest }: ButtonProps) => {
	const { colors } = config;

	const customStyle: StyleProp<ViewStyle> = {
		backgroundColor: colors[variant as ButtonVariant] || colors.brand, // default is brand
		...(!rounded ? { borderRadius: 6 } : {}),
	};

	const labelStyle: StyleProp<TextStyle> = {
		color: contrastColor(customStyle.backgroundColor as string), // default is white
		...(sm ? { fontSize: config.fonts.metrics.sm } : {}),
		...(rest.labelStyle as TextStyle),
	};

	return (
		<Btn {...rest} style={customStyle} labelStyle={labelStyle}>
			{title}
		</Btn>
	);
};

Button.defaultProps = {
	sm: false,
	rounded: false,
	variant: undefined,
};

export default Button;
