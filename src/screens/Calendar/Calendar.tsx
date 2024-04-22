import { Text } from '@/components/atoms';
import { Loader } from '@/components/molecules';
import { getScheduleList } from '@/services/session';
import { config } from '@/theme/_config';
import { Func } from '@/utils';
import useStore from '@/zustand/Store';
import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import {
	AgendaList,
	CalendarProvider,
	WeekCalendar,
} from 'react-native-calendars';
import AgendaItem, { ClassItemData } from './components/AgendaItem';

const { height } = Dimensions.get('window');
const { metrics, fonts } = config;

const Calendar = () => {
	const { classes, setClasses } = useStore(state => ({
		classes: state.classes,
		setClasses: state.setClasses,
	}));

	const [initialLoading, setInitialLoading] = useState<boolean>(true);
	const [currentDate, setCurrentDate] = useState<string>(
		moment().format('YYYY-MM-DD'),
	);

	const loadClasses = () => {
		// loop through the whole week based on current date
		const week = Array.from({ length: 8 }, (_, i) => {
			return moment(currentDate)
				.startOf('week')
				.add(i, 'days')
				.format('YYYY-MM-DD');
		});

		week.forEach((date, i) => {
			if (moment(date).isSameOrAfter(moment(currentDate))) {
				setTimeout(() => {
					fetchList(date);
				}, 50 * i);
			}
		});
	};

	const fetchList = (date: string) => {
		if (initialLoading) setInitialLoading(false);

		// check if already loading
		const hasData = classes.find(item => item.title === date);
		if (hasData) {
			return;
		}

		// add loading state
		setClasses(date, [{ isLoading: true }]);

		getScheduleList(date, date)
			.then(res => {
				if (!res.error) {
					const classesData: ClassItemData[] = res.data.map(item => ({
						start: moment(item.local_start).format('H:mm A'),
						duration: `${Func.getDuration(
							item.local_start,
							item.local_end,
						)} min(s)`,
						title: item.title,
						location: item.venue_id ? item.venue : undefined,
					}));

					setClasses(date, classesData);
				}
			})
			.catch(err => {
				console.log('@err', err);
			});
	};

	useEffect(() => void loadClasses(), [currentDate]);

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
		<CalendarProvider
			date={moment().format('YYYY-MM-DD')}
			showTodayButton
			onDateChanged={date => setCurrentDate(date)}
			todayBottomMargin={16}
		>
			<Text
				center
				bold
				size="xxl"
				style={{ paddingTop: metrics.md, paddingBottom: metrics.sm }}
			>
				{moment(currentDate).format('MMMM')}
			</Text>
			<WeekCalendar firstDay={1} allowShadow={false} />
			<AgendaList
				sections={classes}
				renderItem={renderItem}
				sectionStyle={styles.section}
				viewOffset={-90}
			/>
		</CalendarProvider>
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
