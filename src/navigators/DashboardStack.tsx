import {
	BookingScreen,
	ClassResultsScreen,
	Dashboard,
	ScoreCommentsScreen,
} from '@/screens';
import { DashboardParamList } from '@/types/navigation';
import { createStackNavigator } from '@react-navigation/stack';
import { CommonHeaderOptions } from './utils/options';

const Stack = createStackNavigator<DashboardParamList>();

const DashboardStackNavigator = () => {
	return (
		<Stack.Navigator
			screenOptions={CommonHeaderOptions}
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
			<Stack.Screen
				name="Bookings"
				component={BookingScreen}
				options={{
					title: 'My Bookings',
				}}
			/>
		</Stack.Navigator>
	);
};

export default DashboardStackNavigator;
