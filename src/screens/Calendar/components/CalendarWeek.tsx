/* eslint-disable react-native/no-inline-styles */
import { Text } from '@/components/atoms';
import { config } from '@/theme/_config';
import layout from '@/theme/layout';
import { Constant } from '@/utils';
import useStore from '@/zustand/Store';
import moment from 'moment';
import { useEffect, useMemo, useRef } from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import SwiperFlatList from 'react-native-swiper-flatlist';

interface CalendarWeekProps {
	currentDate: string;
	setCurrentDate: (currentDate: string) => void;
	onMomentumScrollBegin: () => void;
	onMomentumScrollEnd: () => void;
}
const CalendarWeek = ({
	currentDate,
	setCurrentDate,
	onMomentumScrollBegin,
	onMomentumScrollEnd,
}: CalendarWeekProps) => {
	const { setActiveMonth } = useStore(state => ({
		setActiveMonth: state.setActiveMonth,
	}));

	const swiper = useRef<SwiperFlatList>(null);

	const weeks = useMemo(() => {
		const start = moment(currentDate).startOf('isoWeek');
		return [-2, -1, 0, 1, 2, 3].map(adj => {
			return Array.from({ length: 7 }).map((_, index) => {
				const date = moment(start).add(adj, 'week').add(index, 'day');
				return {
					weekday: date.format('ddd'),
					date: date.format(Constant.DEFAULT_DATE_FORMAT),
					display: date.format('DD'),
				};
			});
		});
	}, [currentDate]);

	// listen if swiped to left or right on date is prev and forward
	useEffect(() => {
		// scroll to index of current date
		const index = weeks.findIndex(w =>
			w.some(day => day.date === currentDate),
		);

		if (index !== -1) {
			swiper.current?.scrollToIndex({
				index,
				animated: false,
			});
		}

		setActiveMonth(moment(currentDate).format('MMMM'));
	}, [currentDate]);

	return (
		<View style={styles.container}>
			<SwiperFlatList
				ref={swiper}
				autoplayLoop={false}
				showPagination={false}
				onMomentumScrollBegin={onMomentumScrollBegin}
				onMomentumScrollEnd={onMomentumScrollEnd}
			>
				{weeks.map((dates, index) => (
					<View style={styles.itemRow} key={index}>
						{dates.map((item, dateIndex) => {
							const isActive = currentDate === item.date;
							const isToday =
								item.date ===
								moment().format(Constant.DEFAULT_DATE_FORMAT);
							return (
								<TouchableWithoutFeedback
									key={dateIndex}
									onPress={() => setCurrentDate(item.date)}
								>
									<View
										style={[
											// styles.item,
											layout.flex_1,
											{
												justifyContent: 'center',
												alignItems: 'center',
											},
											// isActive && {
											// 	backgroundColor:
											// 		config.fonts.colors.brand,
											// 	borderColor:
											// 		config.fonts.colors.brand,
											// },
										]}
									>
										<Text color="gray100" bold size="xs">
											{item.weekday}
										</Text>
										<View
											style={[
												styles.itemDay,
												isActive &&
													styles.itemDayActive,
											]}
										>
											<Text
												center
												color={
													// eslint-disable-next-line no-nested-ternary
													isActive
														? 'light'
														: isToday
														? 'brand'
														: 'gray800'
												}
												size="rg"
											>
												{item.display}
											</Text>
										</View>
									</View>
								</TouchableWithoutFeedback>
							);
						})}
					</View>
				))}
			</SwiperFlatList>
		</View>
	);
};

export default CalendarWeek;

const styles = StyleSheet.create({
	container: {},
	item: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	itemDay: {
		borderRadius: 100,
		padding: 5,
		height: config.fonts.metrics.md * 2,
		width: config.fonts.metrics.md * 2,
		marginTop: config.metrics.sm,
		justifyContent: 'center',
		display: 'flex',
		alignItems: 'center',
	},
	itemDayActive: {
		backgroundColor: config.fonts.colors.brand,
	},
	itemRow: {
		width: Constant.DEVICEWIDTH,
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: 4,
		paddingVertical: 10,
		gap: 4,
	},
});
