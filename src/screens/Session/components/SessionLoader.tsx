import { Text } from '@/components/atoms';
import { Loader } from '@/components/molecules';
import layout from '@/theme/layout';
import { View } from 'react-native';

/**
 * TODO: Add skeleton loader for session details
 *
 */
const SessionLoader = () => {
	return (
		<View style={[layout.flex_1, layout.itemsCenter, layout.justifyCenter]}>
			<View>
				<Loader size="xxl" />
				<Text>Please wait..</Text>
			</View>
		</View>
	);
};

export default SessionLoader;
