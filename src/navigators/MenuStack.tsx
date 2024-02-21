import { Menu, ProfileMenu } from '@/screens';
import { useTheme } from '@/theme';
import { config } from '@/theme/_config';
import { MenuStackParamList } from '@/types/navigation';
import {
	CardStyleInterpolators,
	createStackNavigator,
} from '@react-navigation/stack';

const Stack = createStackNavigator<MenuStackParamList>();
const MenuStackNavigator = () => {
	const { variant } = useTheme();

	return (
		<Stack.Navigator
			key={variant}
			screenOptions={{
				headerStyle: { backgroundColor: config.colors.brand },
				headerTitleAlign: 'center',
				cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
			}}
			initialRouteName="Menu"
		>
			<Stack.Screen name="Menu" component={Menu} />
			<Stack.Screen name="ProfileMenu" component={ProfileMenu} />
		</Stack.Navigator>
	);
};

export default MenuStackNavigator;
