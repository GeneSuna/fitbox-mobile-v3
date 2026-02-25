import { useTheme } from '@/theme';
import { config } from '@/theme/_config';
import layout from '@/theme/layout';
import { ComponentProps } from 'react';
import {
	StyleProp,
	StyleSheet,
	Text,
	TextStyle,
	View,
	ViewStyle,
} from 'react-native';
import { Button as Btn, TouchableRipple } from 'react-native-paper';
import { FontColors } from '../Text/Text';

type ButtonTypeWithoutChildren = Omit<ComponentProps<typeof Btn>, 'children'>;
type ButtonVariant = FontColors;

interface ButtonProps extends ButtonTypeWithoutChildren {
	title: string;
	sm?: boolean;
	rounded?: boolean;
	variant?: ButtonVariant;
	fullWidth?: boolean;
	bold?: boolean;
	flex1?: boolean;
	xs?: boolean;
}

const contrastColor = (color: string) => {
	if (!color) return 'black';

	const r = parseInt(color.substring(1, 3), 16);
	const g = parseInt(color.substring(3, 5), 16);
	const b = parseInt(color.substring(5, 7), 16);
	const yiq = (r * 299 + g * 587 + b * 114) / 1000;
	return yiq >= 140 ? 'black' : 'white';
};

const Button = ({
	sm = false,
	xs = false,
	rounded = false,
	variant = 'brand',
	fullWidth = false,
	title,
	mode,
	style,
	bold,
	flex1 = false,
	...rest
}: ButtonProps) => {
	const { fonts: colors } = useTheme();

	// is outlined
	const isOutlined = mode === 'outlined';

	const customStyle: StyleProp<ViewStyle> = {
		// default border width
		borderWidth: 1,

		// outlined
		...(!isOutlined
			? {
					backgroundColor: colors[variant].color,
				}
			: { borderColor: colors[variant].color }),

		...(!rounded ? { borderRadius: 6 } : {}),

		// fullWidth
		...(fullWidth ? { width: '100%' } : {}),

		...(style as ViewStyle),
	} as ViewStyle;

	const labelStyle: StyleProp<TextStyle> = {
		color: isOutlined
			? colors[variant].color
			: contrastColor(customStyle.backgroundColor as string), // default is white
		...(sm ? { fontSize: config.fonts.metrics.sm } : {}),
		...(xs ? { fontSize: config.fonts.metrics.xs } : {}),
		...(rest.labelStyle as TextStyle),
		...(bold ? layout.fontMontserratBold : layout.fontMontserratRegular),
		...(flex1 ? { flex: 1, textAlign: 'center' } : {}),
	};

	// xs: use custom touchable so label can wrap to 2 lines (Paper Button hardcodes numberOfLines={1})
	if (xs) {
		return (
			<TouchableRipple
				{...rest}
				style={[customStyle, !isOutlined && styles.xsBorder]}
				onPress={rest.onPress}
				disabled={rest.disabled}
			>
				<View style={styles.xsContent}>
					<Text
						numberOfLines={2}
						style={[labelStyle, styles.xsLabel]}
					>
						{title}
					</Text>
				</View>
			</TouchableRipple>
		);
	}

	return (
		<Btn
			// Force the button to re-render, this is a bad approach, keep an eye of react-native-paper updates
			// Workaround from: https://github.com/callstack/react-native-paper/issues/4520#issuecomment-2442647417
			key={Math.random()}
			{...rest}
			style={customStyle}
			labelStyle={labelStyle}
			mode={mode}
		>
			{title}
		</Btn>
	);
};

const styles = StyleSheet.create({
	xsBorder: {
		borderWidth: 0,
	},
	xsContent: {
		paddingVertical: 8,
		paddingHorizontal: 16,
		alignItems: 'center',
		justifyContent: 'center',
	},
	xsLabel: {
		textAlign: 'center',
	},
});

export default Button;
