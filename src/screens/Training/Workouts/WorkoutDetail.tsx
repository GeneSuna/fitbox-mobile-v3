import { wsApi } from '@/services/workoutStudio/api';
import type { WorkoutDetail } from '@/services/workoutStudio/types';
import { useTheme } from '@/theme';
import type { TrainingStackParamList } from '@/types/navigation';
import type { StackScreenProps } from '@react-navigation/stack';
import { useQuery } from '@tanstack/react-query';
import {
	ActivityIndicator,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';

type Props = StackScreenProps<TrainingStackParamList, 'TrainingWorkoutDetail'>;

const WorkoutDetailScreen = ({ route, navigation }: Props) => {
	const { colors } = useTheme();
	const { workoutId, assignmentId } = route.params;

	const { data, isLoading } = useQuery({
		queryKey: ['ws-workout', workoutId],
		queryFn: () =>
			wsApi()
				.get('workouts', {
					searchParams: {
						select: '*,workout_sections(*,section_blocks(*,block_movements(*,movements(*))))',
						id: `eq.${workoutId}`,
					},
				})
				.json<WorkoutDetail[]>()
				.then(r => r[0]),
		staleTime: 300_000,
	});

	if (isLoading) {
		return (
			<View style={[styles.center, { backgroundColor: '#F9FAFB' }]}>
				<ActivityIndicator color={colors.brand} />
			</View>
		);
	}

	if (!data) {
		return (
			<View style={[styles.center, { backgroundColor: '#F9FAFB' }]}>
				<Text style={{ color: '#6B7280' }}>Workout not found</Text>
			</View>
		);
	}

	return (
		<View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
			<ScrollView contentContainerStyle={styles.container}>
				<Text style={[styles.title, { color: '#111827' }]}>
					{data.name}
				</Text>
				{data.estimated_duration_minutes && (
					<Text style={[styles.meta, { color: '#6B7280' }]}>
						~{data.estimated_duration_minutes} min
					</Text>
				)}

				{data.workout_sections
					?.sort((a, b) => a.position - b.position)
					.map(section => (
						<View key={section.id} style={styles.section}>
							<Text
								style={[
									styles.sectionName,
									{ color: '#3B82F6' },
								]}
							>
								{section.name}
							</Text>
							{section.section_blocks
								?.sort((a, b) => a.position - b.position)
								.map(block => (
									<View
										key={block.id}
										style={[
											styles.block,
											{ backgroundColor: '#FFFFFF' },
										]}
									>
										{block.label && (
											<Text
												style={[
													styles.blockName,
													{ color: '#6B7280' },
												]}
											>
												{block.label}
											</Text>
										)}
										{block.block_movements
											?.sort(
												(a, b) =>
													a.position - b.position,
											)
											.map(bm => (
												<View
													key={bm.id}
													style={styles.movement}
												>
													<Text
														style={[
															styles.movementName,
															{
																color: '#111827',
															},
														]}
													>
														{bm.movements.name}
													</Text>
													<Text
														style={[
															styles.movementPrescription,
															{
																color: '#6B7280',
															},
														]}
													>
														{[
															bm.sets &&
																`${bm.sets} sets`,
															bm.reps_scheme,
															bm.weight_kg &&
																`@ ${bm.weight_kg}kg`,
														]
															.filter(Boolean)
															.join(' · ')}
													</Text>
													{bm.notes && (
														<Text
															style={[
																styles.scalingNote,
																{
																	color: '#6B7280',
																},
															]}
														>
															{bm.notes}
														</Text>
													)}
												</View>
											))}
									</View>
								))}
						</View>
					))}
			</ScrollView>

			<View style={[styles.footer, { backgroundColor: '#F9FAFB' }]}>
				<TouchableOpacity
					style={[styles.startBtn, { backgroundColor: '#3B82F6' }]}
					onPress={() =>
						navigation.navigate('TrainingRunWorkout', {
							workoutId,
							assignmentId,
							workoutName: data.name,
						})
					}
				>
					<Text style={styles.startBtnText}>Start workout</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
	container: { padding: 16, paddingBottom: 100 },
	title: { fontSize: 24, fontWeight: '700' },
	meta: { fontSize: 14, marginTop: 4, marginBottom: 16 },
	section: { marginBottom: 20 },
	sectionName: { fontSize: 15, fontWeight: '700', marginBottom: 8 },
	block: { borderRadius: 12, padding: 14, marginBottom: 10 },
	blockName: {
		fontSize: 12,
		fontWeight: '600',
		textTransform: 'uppercase',
		marginBottom: 8,
	},
	movement: { marginBottom: 10 },
	movementName: { fontSize: 15, fontWeight: '600' },
	movementPrescription: { fontSize: 13, marginTop: 2 },
	scalingNote: { fontSize: 12, fontStyle: 'italic', marginTop: 2 },
	footer: {
		padding: 16,
		paddingBottom: 32,
		borderTopWidth: 1,
		borderTopColor: '#333',
	},
	startBtn: {
		padding: 16,
		borderRadius: 12,
		alignItems: 'center',
	},
	startBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});

export default WorkoutDetailScreen;
