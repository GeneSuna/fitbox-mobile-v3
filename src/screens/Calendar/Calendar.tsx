/* eslint-disable no-console */
import { Loader } from '@/components/molecules';
import { SafeScreen } from '@/components/template';
import { getGymClasses, getGymVenues } from '@/services/gym';
import { config } from '@/theme/_config';
import { GymVenueType } from '@/types/schemas/gym';
import { FilterTypeEnum } from '@/utils/Enum';
import useStore from '@/zustand/Store';
import {
	ClassFilter,
	ClassItemData,
	VenueFilter,
} from '@/zustand/interface/SessionInterface';
import { useIsFocused } from '@react-navigation/native';
import { isArray } from 'lodash';
import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import {
	AgendaList,
	CalendarProvider,
	WeekCalendar,
} from 'react-native-calendars';
import AgendaItem from './components/AgendaItem';
import CalendarFilterPanel from './components/CalendarFilterPanel';
import CalendarFilterSelect from './components/CalendarFilterSelectPanel';

const { height } = Dimensions.get('window');
const { fonts } = config;

const Calendar = () => {
	const {
		classes,
		loggedInUser,
		classFilters,
		venueFilters,
		getClassesByDate,
		setActiveMonth,
		setVenueFilters,
		setClassFilters,
		setHeaderTitle,
		defaultClassFilter,
	} = useStore(state => ({
		classes: state.classes,
		loggedInUser: state.loggedInUser,
		classFilters: state.classFilters,
		venueFilters: state.venueFilters,
		getClassesByDate: state.getClassesByDate,
		setActiveMonth: state.setActiveMonth,
		setVenueFilters: state.setVenueFilters,
		setClassFilters: state.setClassFilters,
		setHeaderTitle: state.setHeaderTitle,
		defaultClassFilter: state.defaultClassFilter,
	}));

	const [initialLoading, setInitialLoading] = useState<boolean>(true);
	const [currentDate, setCurrentDate] = useState<string>(
		moment().format('YYYY-MM-DD'),
	);

	const loadClasses = () => {
		// loop through the whole week based on current date
		const week = Array.from({ length: 9 }, (_, i) => {
			return moment(currentDate)
				.startOf('week')
				.add(i, 'days')
				.format('YYYY-MM-DD');
		});

		week.forEach((date, i) => {
			if (moment(date).isSameOrAfter(moment(currentDate))) {
				if (initialLoading) setInitialLoading(false);

				setTimeout(() => {
					getClassesByDate(date, loggedInUser!.id);
				}, 50 * i);
			}
		});
	};

	const fetchFilterOptions = () => {
		const selectedVenueIds = venueFilters
			.filter(v => v.is_selected)
			.map(v => v.id);
		const selectedClassIds = classFilters
			.filter(c => c.is_selected)
			.map(c => c.id);

		// fetch venues
		getGymVenues()
			.then(res => {
				if (isArray(res)) {
					const venueFilterList: VenueFilter[] = res.map(
						(c: GymVenueType) => {
							return {
								...c,
								is_selected:
									selectedVenueIds.includes(c.id) || false,
							};
						},
					);

					// add "No location" filter
					venueFilterList.unshift({
						id: -1,
						name: 'No location',
						location: 'Show classes without a location',
						is_selected: false,
					});

					// set venue filters
					setVenueFilters(venueFilterList);
				}
			})
			.catch(err => {
				console.log(err);
			});

		getGymClasses()
			.then(res => {
				if (!res.error) {
					const classFilterList: ClassFilter[] = res.data.map(c => {
						return {
							...c,
							is_selected:
								selectedClassIds.includes(c.id) || false,
						};
					});

					// set class filters
					setClassFilters(classFilterList);
				} else {
					throw new Error(res.message);
				}
			})
			.catch(err => {
				console.log('getGymClasses', err);
			});
	};

	useEffect(() => {
		setActiveMonth(moment(currentDate).format('MMMM'));
		void loadClasses();
	}, [currentDate]);

	useEffect(() => {
		void fetchFilterOptions();
	}, []);

	const isFocused = useIsFocused();
	useEffect(() => {
		if (!isFocused && defaultClassFilter) {
			let defaultClass = [];
			let defaultVenue = [];

			const classIds = new Set(defaultClassFilter.classIds);
			const venueIds = new Set(defaultClassFilter.locationIds);

			defaultClass = classFilters.map(item => ({
				...item,
				is_selected: !!classIds.has(item.id as number),
			}));

			defaultVenue = venueFilters.map(item => ({
				...item,
				is_selected: !!venueIds.has(item.id as number),
			}));

			setClassFilters(defaultClass);
			setVenueFilters(defaultVenue);
			setHeaderTitle(defaultClassFilter.name);
		}
	}, [isFocused]);

	useEffect(() => {
		const clearClasses = classFilters.some(c => c.is_selected);
		const clearLocations = venueFilters.some(v => v.is_selected);

		if (!clearClasses && !clearLocations) {
			setHeaderTitle(moment(currentDate).format('MMMM'));
		}
	}, [classFilters, venueFilters]);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const renderItem = useCallback(({ item }: any) => {
		return <AgendaItem item={item as ClassItemData} />;
	}, []);

	const currentDateIsFetching = classes.find(
		item => item.title === currentDate && item.data[0]?.isLoading === true,
	);

	if (currentDateIsFetching && initialLoading) {
		return <Loader />;
	}

	return (
		<SafeScreen>
			<CalendarProvider
				date={moment().format('YYYY-MM-DD')}
				showTodayButton
				onDateChanged={date => setCurrentDate(date)}
				todayBottomMargin={16}
				theme={{
					todayButtonTextColor: fonts.colors.brand,
					todayButtonFontWeight: 'bold',
				}}
			>
				<WeekCalendar
					firstDay={1}
					allowShadow={false}
					theme={{
						selectedDayBackgroundColor: fonts.colors.brand,
						todayTextColor: fonts.colors.brand,
					}}
				/>
				{classes.length ? (
					<AgendaList
						sections={classes}
						renderItem={renderItem}
						sectionStyle={styles.section}
						viewOffset={-90}
						windowSize={100}
						removeClippedSubviews
						keyExtractor={(item: ClassItemData) =>
							String(item.eventId)
						}
						// infiniteListProps={{
						// 	visibleIndicesChangedDebounce: 250,
						// }}
					/>
				) : null}
			</CalendarProvider>

			{/* Modals */}
			<CalendarFilterPanel />
			<CalendarFilterSelect type={FilterTypeEnum.CLASS} />
			<CalendarFilterSelect type={FilterTypeEnum.VENUE} />
		</SafeScreen>
	);
};

const styles = StyleSheet.create({
	container: {
		height: height - 100,
	},
	section: {
		backgroundColor: '#FFF',
		color: 'grey',
		fontSize: fonts.metrics.rg,
	},
});

export default Calendar;
