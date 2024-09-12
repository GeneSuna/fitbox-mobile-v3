import { SkeletonView } from '@/components/atoms';
import layout from '@/theme/layout';
import { View } from 'react-native';

const SessionLoader = () => {
	return (
		<View style={[layout.flex_1, layout.itemsCenter, layout.justifyCenter]}>
			<View>
				<SkeletonView width={50} height={10} />
			</View>
		</View>
	);
};

export default SessionLoader;
