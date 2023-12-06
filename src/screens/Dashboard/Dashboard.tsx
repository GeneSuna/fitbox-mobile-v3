import { useTheme } from '@/theme';
import { Text, View } from 'react-native';

// interface DashboardProps { }

const Dashboard = () => {
	const { fonts } = useTheme();

	return (
		<View>
			<Text style={fonts.gray400}>Dashboard Screen</Text>
		</View>
	);
};

export default Dashboard;
