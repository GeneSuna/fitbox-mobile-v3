import { Row, ScrollView, Text } from '@/components/atoms';
import { BottomPanel } from '@/components/molecules';
import { config } from '@/theme/_config';
import { ModalEnum } from '@/utils/Enum';
import useStore from '@/zustand/Store';
import { ClassFilter, VenueFilter } from '@/zustand/interface/SessionInterface';
import { produce } from 'immer';
import { memo } from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { FilterTypeEnum } from './CalendarFilterPanel';

const { fonts, metrics } = config;

interface CalendarFilterSelectProps {
	type: FilterTypeEnum;
}

const CalendarFilterSelect = ({ type }: CalendarFilterSelectProps) => {
	// prepare the title based on the type
	const title =
		type === FilterTypeEnum.CLASS
			? 'Select Class Filters'
			: 'Select Location Filters';

	// the modal is either CLASS_FILTER or VENUE_FILTER
	const modal =
		type === FilterTypeEnum.CLASS
			? ModalEnum.CLASS_FILTER
			: ModalEnum.VENUE_FILTER;

	// prepare filter state based on the type
	const stateFilter =
		type === FilterTypeEnum.CLASS ? 'classFilters' : 'venueFilters';

	const { visible, toggleModal, filters, setClassFilters, setVenueFilters } =
		useStore(state => {
			return {
				visible: !!state[modal],
				filters: state[stateFilter],
				toggleModal: state.toggleModal,
				setClassFilters: state.setClassFilters,
				setVenueFilters: state.setVenueFilters,
			};
		});

	const handleFilterPress = (index: number) => {
		// new filter data
		const newFilters = produce(filters, draft => {
			draft[index] = {
				...filters[index],
				is_selected: !filters[index]?.is_selected,
			} as ClassFilter | VenueFilter;
		});

		if (type === FilterTypeEnum.CLASS) {
			setClassFilters(newFilters as ClassFilter[]);
		} else {
			setVenueFilters(newFilters as VenueFilter[]);
		}
	};

	return (
		<BottomPanel
			title={title}
			visible={visible}
			onClose={() => toggleModal(modal, false)}
			rightTitle={
				<TouchableOpacity
					onPress={() => {
						toggleModal(modal, false);
						toggleModal(ModalEnum.CALENDAR_FILTER, true);
					}}
				>
					<Text color="info" size="md">
						Accept
					</Text>
				</TouchableOpacity>
			}
		>
			<ScrollView>
				{filters.map((data, key) => (
					<TouchableOpacity
						key={key}
						onPress={() => {
							handleFilterPress(key);
						}}
						style={{
							paddingVertical: metrics.md,
							paddingHorizontal: metrics.lg,
						}}
					>
						<Row spacing="space-between">
							<Text size="md">{data.name}</Text>

							{data?.is_selected && (
								<Icon
									name="check"
									size={fonts.metrics.md}
									color={fonts.colors.info}
								/>
							)}
						</Row>
					</TouchableOpacity>
				))}
			</ScrollView>
		</BottomPanel>
	);
};

export default memo(CalendarFilterSelect);
