import { Avatar, Row, Spacer, Text } from '@/components/atoms';
import OneRMComponent from '@/components/molecules/WODPastPerformance/components/OneRMComponent';
import { getLeaderboardByWorkout } from '@/services/leaderboards';
import { config } from '@/theme/_config';
import layout from '@/theme/layout';
import { ApplicationScreenProps } from '@/types/navigation';
import { MovementEntryType, WorkoutType } from '@/types/schemas/leaderboards';
import {
	SessionDetailSchemaType,
	SessionSectionSchemaType,
} from '@/types/schemas/session';
import useStore from '@/zustand/Store';
import { useEffect, useState } from 'react';
import {
	ActivityIndicator,
	FlatList,
	StyleSheet,
	TouchableOpacity,
	View,
} from 'react-native';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';

type UserScores = {
	firstname: string;
	lastname: string;
	value: string;
	image: string | undefined;
	id: number;
};

const AttendancePastPerformance = ({ route }: ApplicationScreenProps) => {
	const { benchmarks, favorites } = useStore(s => ({
		benchmarks: s.benchmarks,
		favorites: s.favorites,
	}));

	const [workouts, setWorkouts] = useState<WorkoutType[]>([]);
	const [activeWorkout, setActiveWorkout] = useState<WorkoutType>();
	const [showWorkouts, setShowWorkouts] = useState(false);
	const [userScores, setUserScores] = useState<UserScores[]>([]);
	const [displayUserScores, setDisplayUserScores] = useState<UserScores[]>(
		[],
	);
	const [scoresLoading, setScoresLoading] = useState<boolean>(false);

	const [, setHasOneRm] = useState<boolean>(false);
	const [percent, setPercent] = useState<number>(100);

	const { params } = route;
	const session =
		params && 'session' in params
			? // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
				(params.session as SessionDetailSchemaType)
			: ({} as SessionDetailSchemaType);

	const sections: {
		movementId: number | null;
		name: string;
		sectionId: number | null;
		scoringTypeId: number;
		id: number | null;
	}[] = [];

	(session.sections as SessionSectionSchemaType[]).map(
		(item: SessionSectionSchemaType) => {
			const benchmarkData = benchmarks.find(
				bm => bm.id === item.fb_wod?.id,
			);

			const favoritesData = favorites.find(f => f.id === item.fb_wod?.id);

			if (
				((item.fb_wod?.is_benchmark && benchmarkData) ||
					(!item.fb_wod?.is_benchmark && favoritesData) ||
					(item.wod_movements && item.wod_movements?.length > 0)) &&
				item.scoring_type_id === 20
			) {
				if (item.wod_movements && item.wod_movements.length > 0) {
					item.wod_movements.map(movement => {
						return sections.push({
							movementId: movement.id,
							name: movement.movement.name,
							sectionId: item.id,
							scoringTypeId: item.scoring_type_id as number,
							id: movement.id,
						});
					});
				} else {
					const base = {
						movementId: null,
						sectionId: item.id,
						name: item.name,
						scoringTypeId: item.scoring_type_id as number,
						id: null,
					};
					return sections.push(base);
				}
			}
			return null;
		},
	);

	const users = session.member_attendance.map(item => item.user);

	useEffect(() => {
		setWorkouts(sections);
		setActiveWorkout(sections[0] || null);
		// fetchDetails();
	}, []);

	useEffect(() => {
		const scoresData = userScores;
		const results: {
			firstname: string;
			lastname: string;
			value: string;
			image: string | undefined;
			id: number;
		}[] = [];

		scoresData.forEach(score => {
			const newScore = Number.isNaN(Number(score.value))
				? '-'
				: `${(Number(score.value) * (percent / 100))
						.toFixed(2)
						.replace(/\.00$/, '')}`;
			results.push({
				...score,
				value: newScore,
			});
		});

		setDisplayUserScores(results);
	}, [percent]);

	// const fetchDetails = () => {
	// 	void getUserMovements(4)
	// 		.then(res => {
	// 			if (!res.error) {
	// 				if (res.data.one_rm) {
	// 					console.log('One RM:', res.data.one_rm);
	// 				}
	// 			} else {
	// 				Say.err('Something went wrong!');

	// 				// Go back
	// 			}
	// 		})
	// 		.catch(e => {
	// 			Say.err(e as ICatchError);
	// 		});
	// };

	const scoreFormat = (id: number, score: MovementEntryType) => {
		switch (id) {
			// case 8: // AMRP
			// 	return `${score.value} x ${score.reps}`;
			// case 9: // AMRep
			// 	return `${score.value} reps`;
			// case 34: // Calories
			// 	return `${score.value} cal`;
			// case 20: // For Load
			// 	return `${Number(score.value) * (percent / 100)} kg`;
			default:
				return score.value;
		}
	};

	const getScores = () => {
		setScoresLoading(true);
		getLeaderboardByWorkout((activeWorkout?.sectionId as number) || 0)
			.then(data => {
				const scores = data?.data;
				const results: {
					firstname: string;
					lastname: string;
					value: string;
					image: string | undefined;
					id: number;
				}[] = [];

				if (scores?.one_rm) setHasOneRm(true);

				// console.log('scoringtypeid: ', activeWorkout);
				// console.log('data@@@: ', scores.movements);

				Object.values(scores.movements).forEach(movementEntries => {
					movementEntries.forEach(entry => {
						const isMatch = activeWorkout?.movementId
							? entry.wod_movement_id === activeWorkout.movementId
							: entry.wod_section_id === activeWorkout?.sectionId;

						if (isMatch) {
							const user = users.find(
								u => u.id === entry.user_id,
							);

							const userScoreDetails = {
								firstname: entry.firstname,
								lastname: entry.lastname,
								value: scoreFormat(
									activeWorkout?.scoringTypeId || 0,
									entry as MovementEntryType,
								),
								image: user?.profile_image,
								id: entry.user_id,
							};

							results.push(userScoreDetails);
						}
					});
				});

				users.forEach(user => {
					const doesNotHaveScore = !results.some(
						result => result.id === user.id,
					);
					if (doesNotHaveScore) {
						results.push({
							firstname: user.firstname,
							lastname: user.lastname,
							value: '-',
							image: user.profile_image,
							id: user.id,
						});
					}
				});

				setUserScores(results);
				setDisplayUserScores(results);
			})
			.catch(() => {
				const results: {
					firstname: string;
					lastname: string;
					value: string;
					image: string | undefined;
					id: number;
				}[] = [];

				users.forEach(user => {
					const doesNotHaveScore = !results.some(
						result => result.id === user.id,
					);
					if (doesNotHaveScore) {
						results.push({
							firstname: user.firstname,
							lastname: user.lastname,
							value: '-',
							image: user.profile_image,
							id: user.id,
						});
					}
				});

				setUserScores(results);
				setDisplayUserScores(results);
			})
			.finally(() => setScoresLoading(false));
	};

	useEffect(() => {
		if (workouts.length > 0 && activeWorkout) {
			void getScores();
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
							const isMovement = workout?.movementId !== null;
							const isActive = isMovement
								? workout?.movementId !==
									activeWorkout?.movementId
								: workout.sectionId !==
									activeWorkout?.sectionId;

							return (
								<TouchableOpacity
									key={
										isMovement
											? workout?.movementId
											: workout.sectionId
									}
									onPress={() => {
										if (isMovement) {
											if (
												activeWorkout?.movementId !==
												workout?.movementId
											) {
												setActiveWorkout(workout);
											}
										} else if (
											activeWorkout?.sectionId !==
											workout.sectionId
										) {
											setActiveWorkout(workout);
										}
										setShowWorkouts(false);
									}}
								>
									<Row>
										<Text
											style={{
												paddingVertical:
													config.metrics.sm,
												...layout.flex_1,
											}}
										>
											{workout?.name}
										</Text>
										{!isActive && (
											<MIcon
												name="check"
												size={config.metrics.lg}
												color={
													config.backgrounds.darkgray
												}
											/>
										)}
									</Row>
								</TouchableOpacity>
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
		item: {
			firstname: string;
			lastname: string;
			value: string;
			image: string | undefined;
		};
	}) => {
		return (
			<Row style={styles.detailsContainer}>
				<View style={styles.avatarCon}>
					<Avatar
						source={item.image}
						style={styles.avatarStyle}
						size={43}
					/>
				</View>
				<Spacer horizontal size="xs" />
				<View style={styles.attendanceListNameCon}>
					<Text numberOfLines={1}>
						{/* {name + (id === loggedInUser?.id ? ' (You)' : '')} */}
						{item.firstname} {item.lastname}
					</Text>
				</View>
				<View style={styles.bestScoreContainer}>
					<Text bold numberOfLines={1}>
						{`${item.value} ${item.value === '-' ? '' : 'kg'} `}
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
			{scoresLoading ? (
				<View style={[layout.flex_1, layout.justifyCenter]}>
					<ActivityIndicator
						size="small"
						color={config.colors.brand}
					/>
				</View>
			) : (
				<>
					<Spacer size="lg" />
					<OneRMComponent
						weight={0}
						noHeader
						initialPercentage={100}
						setPercentage={setPercent}
					/>
					<FlatList
						renderItem={renderLeaderboard}
						data={displayUserScores}
					/>
				</>
			)}
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
		width: '55%',
	},
	detailsContainer: {
		paddingHorizontal: config.metrics.sm,
		paddingVertical: config.metrics.sm,
		alignItems: 'center',
	},
	bestScoreContainer: {
		flex: 1,
		alignItems: 'flex-end',
	},
});
