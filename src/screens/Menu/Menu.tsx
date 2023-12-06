import { useTheme } from '@/theme';
import { Text, TouchableOpacity, View } from 'react-native';

// interface MenuProps { }

const Menu = () => {
	const { variant, changeTheme } = useTheme();

	const onChangeTheme = () => {
		changeTheme(variant === 'default' ? 'dark' : 'default');
	};

	return (
		<View>
			<Text>Menu Screen</Text>

			<TouchableOpacity onPress={onChangeTheme}>
				<Text>Change Theme</Text>
			</TouchableOpacity>
		</View>
	);
};

export default Menu;
