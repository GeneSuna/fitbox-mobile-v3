import { wsApi } from '@/services/workoutStudio/api';
import { getStoredWSSession } from '@/services/workoutStudio/auth';
import type { WorkoutResult } from '@/services/workoutStudio/types';
import { useTheme } from '@/theme';
import { useQuery } from '@tanstack/react-query';
import moment from 'moment';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import SkeletonCard from '../components/SkeletonCard';

const Results = () => {
	const { colors } = useTheme();
	const session = getStoredWSSession();
	const uid = session?.user.id;

	const { data, isLoading, isRefetching, refetch } = useQuery({
		queryKey: ['ws-results', uid],
		queryFn: () =>
			wsApi()
				.get('workout_results', {
					searchParams: {
						select: 'id,workout_id,completed_at,total_volume_kg,duration_seconds,workouts(name)',
						athlete_id: `eq.${uid}`,
						order: 'completed_at.desc',
						limit: '25',
					},
				})
				.json<WorkoutResult[]>(),
		enabled: !!uid,
		staleTime: 300_000,
	});

	return (
		<FlatList
			style={{ backgroundColor: '#F9FAFB' }}
			contentContainerStyle={styles.container}
			data={data}
			keyExtractor={item => item.id}
			refreshControl={
				<RefreshControl
					refreshing={isRefetching}
					onRefresh={() => {
						void refetch();
					}}
					tintColor={colors.brand}
				/>
			}
			ListEmptyComponent={
				isLoading ? (
					<View style={{ padding: 16 }}>
						<SkeletonCard />
						<SkeletonCard />
						<SkeletonCard />
					</View>
				) : (
					<View style={styles.empty}>
						<Text style={[styles.emptyText, { color: '#6B7280' }]}>
							No workout results yet
						</Text>
					</View>
				)
			}
			renderItem={({ item }) => (
				<View style={[styles.card, { backgroundColor: '#FFFFFF' }]}>
					<Text style={[styles.workoutName, { color: '#111827' }]}>
						{item.workouts.name}
					</Text>
					<Text style={[styles.date, { color: '#6B7280' }]}>
						{moment(item.completed_at).format(
							'ddd, MMM D [·] h:mm A',
						)}
					</Text>
					<View style={styles.statsRow}>
						{item.duration_seconds != null && (
							<Text style={[styles.stat, { color: '#6B7280' }]}>
								{Math.round(item.duration_seconds / 60)} min
							</Text>
						)}
						{item.total_volume_kg != null && (
							<Text style={[styles.stat, { color: '#6B7280' }]}>
								{item.total_volume_kg.toLocaleString()} kg
								volume
							</Text>
						)}
					</View>
				</View>
			)}
		/>
	);
};

const styles = StyleSheet.create({
	container: { padding: 16, paddingBottom: 40 },
	card: { borderRadius: 12, padding: 14, marginBottom: 10 },
	workoutName: { fontSize: 16, fontWeight: '600' },
	date: { fontSize: 13, marginTop: 4 },
	statsRow: { flexDirection: 'row', gap: 12, marginTop: 6 },
	stat: { fontSize: 13 },
	empty: { alignItems: 'center', padding: 40 },
	emptyText: { fontSize: 15 },
});

export default Results;
