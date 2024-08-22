import { PastPerformance } from '@/screens';
import MovementHistory from '@/screens/PerformanceSummary/MovementHistory/MovementHistory';
import { PerformanceSummaryParamList } from '@/types/navigation';
import { createStackNavigator } from '@react-navigation/stack';
import { CommonHeaderOptions } from './utils/options';

const Stack = createStackNavigator<PerformanceSummaryParamList>();

const PerformanceSummaryStack = () => {
	return (
		<Stack.Navigator
			initialRouteName="PastPerformance"
			screenOptions={CommonHeaderOptions}
		>
			<Stack.Screen
				name="PastPerformance"
				component={PastPerformance}
				options={{ title: 'Past Performance' }}
			/>
			<Stack.Screen
				name="MovementHistory"
				component={MovementHistory}
				options={{ title: 'Performance' }}
			/>
		</Stack.Navigator>
	);
};

export default PerformanceSummaryStack;
