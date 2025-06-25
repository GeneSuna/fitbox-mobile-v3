import { Avatar, Row, Spacer, Text } from '@/components/atoms';
import OneRMComponent from '@/components/molecules/WODPastPerformance/components/OneRMComponent';
import {
	getLeaderboardByWorkout,
	getWorkoutsByClass,
} from '@/services/leaderboards';
import { config } from '@/theme/_config';
import layout from '@/theme/layout';
import { WorkoutType } from '@/types/schemas/leaderboards';
import { Say } from '@/utils';
import { ICatchError } from '@/utils/Say';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const mockData = [
	{
		name: 'Member 1 Member 1 Member 1 Member 1 Member 1',
		score: 25,
		unit: 'kg',
		photo: 'https://example.com/photo1.jpg',
	},
	{
		name: 'Member 2',
		score: 45,
		unit: 'kg',
		photo: 'https://example.com/photo1.jpg',
	},
	{
		name: 'Member 3',
		score: 4,
		unit: 'kg',
		photo: 'https://example.com/photo1.jpg',
	},
];

const AttendancePastPerformance = () => {
	const [workouts, setWorkouts] = useState<WorkoutType[]>([]);
	const [activeWorkout, setActiveWorkout] = useState<WorkoutType | null>(
		null,
	);
	const [showWorkouts, setShowWorkouts] = useState(false);

	useEffect(() => {
		getWorkoutsByClass(1054)
			.then(res => {
				if (!res.error) {
					setWorkouts(res.data);
					setActiveWorkout(res.data[0] || null);
				}
			})
			.catch(error =>
				Say.err((error as ICatchError) || 'Failed to fetch workouts'),
			);
	}, []);

	useEffect(() => {
		if (workouts.length > 0 && activeWorkout) {
			getLeaderboardByWorkout(activeWorkout.id)
				.then(res => {
					// eslint-disable-next-line no-console
					console.log('Leaderboard by workout:', res);
				})
				.catch(error => {
					Say.err(error as ICatchError);
				});
		}
	}, [activeWorkout]);

	const renderWorkoutDropDown = () => {
		return (
			<View>
				<TouchableOpacity
					style={styles.headerContainer}
					onPress={() => setShowWorkouts(!showWorkouts)}
				>
					<Row align="center">
						<Text bold numberOfLines={1} style={layout.flex_1}>
							{activeWorkout?.name}
						</Text>
						<MIcon
							name={showWorkouts ? 'chevron-up' : 'chevron-down'}
							size={config.metrics.xl}
							color={config.backgrounds.darkgray}
						/>
					</Row>
				</TouchableOpacity>
				{showWorkouts && (
					<View style={styles.headerOptionsContainer}>
						{workouts.map(workout => {
							return (
								workout.id !== activeWorkout?.id && (
									<TouchableOpacity
										key={workout.id}
										onPress={() => {
											if (
												activeWorkout?.id !== workout.id
											) {
												setActiveWorkout(workout);
											}
											setShowWorkouts(false);
										}}
									>
										<Text
											style={{
												paddingVertical:
													config.metrics.sm,
											}}
										>
											{workout.name}
										</Text>
									</TouchableOpacity>
								)
							);
						})}
					</View>
				)}
			</View>
		);
	};

	const renderLeaderboard = ({
		item,
	}: {
		item: { name: string; photo: string };
	}) => {
		return (
			<Row style={styles.detailsContainer}>
				<View style={styles.avatarCon}>
					<Avatar
						source={item.photo}
						style={styles.avatarStyle}
						size={43}
					/>
				</View>
				<Spacer horizontal size="xs" />
				<View style={styles.attendanceListNameCon}>
					<Text numberOfLines={1}>
						{/* {name + (id === loggedInUser?.id ? ' (You)' : '')} */}
						{item.name}
					</Text>
				</View>
				<View style={styles.bestScoreContainer}>
					<Text bold numberOfLines={1}>
						35 kg
					</Text>
				</View>
			</Row>
		);
	};

	return (
		<View
			style={{
				...layout.flex_1,
				marginTop: config.metrics.md,
				marginHorizontal: config.metrics.md,
			}}
		>
			{renderWorkoutDropDown()}
			<Spacer size="lg" />
			<OneRMComponent weight={150} noHeader />
			<FlatList renderItem={renderLeaderboard} data={mockData} />
		</View>
	);
};

export default AttendancePastPerformance;

const styles = StyleSheet.create({
	headerContainer: {
		paddingLeft: config.metrics.md,
		borderWidth: 1,
		borderColor: '#c4c4c4',
		height: 35,
	},
	headerOptionsContainer: {
		position: 'absolute',
		top: 35,
		paddingHorizontal: config.metrics.md,
		paddingVertical: config.metrics.sm,
		borderWidth: 1,
		borderColor: '#eee',
		zIndex: 10,
		backgroundColor: '#fff',
		width: '100%',
	},
	avatarStyle: {
		borderRadius: 35,
		overflow: 'hidden',
		borderWidth: StyleSheet.hairlineWidth,
		borderColor: config.fonts.colors.lightgrey,
	},
	avatarCon: {
		width: 36,
		alignItems: 'center',
	},
	attendanceListNameCon: {
		width: '70%',
	},
	detailsContainer: {
		paddingHorizontal: config.metrics.sm,
		paddingVertical: config.metrics.sm,
		alignItems: 'center',
	},
	bestScoreContainer: { flex: 1, alignItems: 'flex-end' },
});
