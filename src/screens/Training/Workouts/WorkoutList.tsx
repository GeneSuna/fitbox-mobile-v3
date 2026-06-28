import { wsApi } from '@/services/workoutStudio/api';
import { getStoredWSSession } from '@/services/workoutStudio/auth';
import type { WorkoutAssignment } from '@/services/workoutStudio/types';
import { useTheme } from '@/theme';
import type { TrainingStackParamList } from '@/types/navigation';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useQuery } from '@tanstack/react-query';
import moment from 'moment';
import { useMemo } from 'react';
import {
	RefreshControl,
	SectionList,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import SkeletonCard from '../components/SkeletonCard';

type Nav = StackNavigationProp<TrainingStackParamList>;

const WorkoutList = () => {
	const { colors } = useTheme();
	const nav = useNavigation<Nav>();
	const session = getStoredWSSession();
	const uid = session?.user.id;
	const tenantId = session?.user.active_tenant_id;

	const from = moment().format('YYYY-MM-DD');
	const to = moment().add(14, 'days').format('YYYY-MM-DD');

	const { data, isLoading, isRefetching, refetch } = useQuery({
		queryKey: ['ws-assignments', uid, tenantId, from],
		queryFn: () =>
			wsApi()
				.get('workout_assignments', {
					searchParams: {
						select: 'id,workout_id,due_date,status,workouts(name,est_duration_min)',
						athlete_id: `eq.${uid}`,
						tenant_id: `eq.${tenantId}`,
						due_date: `gte.${from}`,
						'due_date.lte': to,
						order: 'due_date.asc',
					},
				})
				.json<WorkoutAssignment[]>(),
		enabled: !!uid && !!tenantId,
		staleTime: 300_000,
	});

	const sections = useMemo(() => {
		if (!data) return [];
		const grouped: Record<string, WorkoutAssignment[]> = {};
		data.forEach(a => {
			const d = a.due_date;
			if (!grouped[d]) grouped[d] = [];
			grouped[d]!.push(a);
		});
		return Object.entries(grouped).map(([date, items]) => ({
			title: moment(date).format('dddd, MMM D'),
			data: items,
		}));
	}, [data]);

	return (
		<SectionList
			style={{ backgroundColor: '#F9FAFB' }}
			contentContainerStyle={styles.container}
			sections={sections}
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
							No workouts scheduled for the next 14 days
						</Text>
					</View>
				)
			}
			renderSectionHeader={({ section }) => (
				<Text style={[styles.sectionHeader, { color: '#6B7280' }]}>
					{section.title}
				</Text>
			)}
			renderItem={({ item }) => (
				<TouchableOpacity
					style={[styles.card, { backgroundColor: '#FFFFFF' }]}
					onPress={() =>
						nav.navigate('TrainingWorkoutDetail', {
							workoutId: item.workout_id,
							assignmentId: item.id,
						})
					}
				>
					<View style={styles.cardLeft}>
						<Text
							style={[styles.workoutName, { color: '#111827' }]}
						>
							{item.workouts.name}
						</Text>
						{item.workouts.est_duration_min && (
							<Text style={[styles.meta, { color: '#6B7280' }]}>
								~{item.workouts.est_duration_min} min
							</Text>
						)}
					</View>
					<View
						style={[
							styles.statusBadge,
							{
								backgroundColor:
									item.status === 'completed'
										? '#43A047'
										: '#F9FAFB',
							},
						]}
					>
						<Text style={styles.statusText}>
							{item.status === 'completed' ? 'Done' : 'Scheduled'}
						</Text>
					</View>
				</TouchableOpacity>
			)}
		/>
	);
};

const styles = StyleSheet.create({
	container: { padding: 16, paddingBottom: 40 },
	sectionHeader: {
		fontSize: 13,
		fontWeight: '600',
		textTransform: 'uppercase',
		letterSpacing: 0.5,
		marginTop: 16,
		marginBottom: 8,
	},
	card: {
		borderRadius: 12,
		padding: 14,
		marginBottom: 10,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	cardLeft: { flex: 1 },
	workoutName: { fontSize: 16, fontWeight: '600' },
	meta: { fontSize: 13, marginTop: 2 },
	statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
	statusText: { color: '#fff', fontSize: 12, fontWeight: '600' },
	empty: { alignItems: 'center', padding: 40 },
	emptyText: { fontSize: 15, textAlign: 'center' },
});

export default WorkoutList;
