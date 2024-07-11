import { ClassResultsScreen, Dashboard, ScoreCommentsScreen } from '@/screens';
import { config } from '@/theme/_config';
import layout from '@/theme/layout';
import { DashboardParamList } from '@/types/navigation';
import {
	CardStyleInterpolators,
	createStackNavigator,
} from '@react-navigation/stack';

const Stack = createStackNavigator<DashboardParamList>();

const DashboardStackNavigator = () => {
	return (
		<Stack.Navigator
			screenOptions={{
				headerStyle: { backgroundColor: config.colors.brand },
				cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
				headerTitleStyle: layout.fontMontserratRegular,
				headerTitleAlign: 'center',
				headerTintColor: 'white',
				headerBackTitleVisible: false,
			}}
			initialRouteName="Dashboard"
		>
			<Stack.Screen
				name="Dashboard"
				component={Dashboard}
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="ClassResults"
				component={ClassResultsScreen}
				options={{
					title: 'Class Results',
				}}
			/>
			<Stack.Screen
				name="ScoreComments"
				component={ScoreCommentsScreen}
				options={{
					title: 'Class Results',
				}}
			/>
		</Stack.Navigator>
	);
};

export default DashboardStackNavigator;
