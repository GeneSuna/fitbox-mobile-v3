import { Spacer } from '@/components/atoms';
import HeaderButtonGroup from '@/components/template/Header/HeaderButtonGroup';
import { Say } from '@/utils';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const CalendarHeaderRightComponent = () => {
	const toggleFilter = () => Say.ok('Coming soon!');

	return (
		<HeaderButtonGroup>
			<Icon
				name="filter-outline"
				size={20}
				color="white"
				onPress={toggleFilter}
			/>
			<Spacer horizontal />
		</HeaderButtonGroup>
	);
};

export default CalendarHeaderRightComponent;
