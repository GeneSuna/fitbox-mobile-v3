import { ComponentProps } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { TouchableRipple } from 'react-native-paper';

interface RowProps extends ComponentProps<typeof View> {
	spacing?:
		| 'flex-start'
		| 'flex-end'
		| 'center'
		| 'space-between'
		| 'space-around'
		| 'space-evenly';
	onPress?: () => void;
}

const Row = ({ spacing, children, onPress, style }: RowProps) => {
	const viewStyle: StyleProp<ViewStyle> = {
		flexDirection: 'row',
		justifyContent: spacing,
	};

	const component = <View style={[viewStyle, style]}>{children}</View>;

	if (onPress) {
		return <TouchableRipple onPress={onPress}>{component}</TouchableRipple>;
	}

	return component;
};

Row.defaultProps = {
	spacing: undefined,
	onPress: undefined,
};

export default Row;
