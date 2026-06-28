import { wsApi } from '@/services/workoutStudio/api';
import { getStoredWSSession } from '@/services/workoutStudio/auth';
import type { FeedItem } from '@/services/workoutStudio/types';
import { useTheme } from '@/theme';
import { useQuery } from '@tanstack/react-query';
import moment from 'moment';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import SkeletonCard from '../components/SkeletonCard';

const REACTIONS = ['💪', '🔥', '🎉', '👏', '❤️'];

const GymFeed = () => {
	const { colors } = useTheme();
	const session = getStoredWSSession();
	const tenantId = session?.user.active_tenant_id;

	const since = moment().subtract(14, 'days').toISOString();

	const { data, isLoading, isRefetching, refetch } = useQuery({
		queryKey: ['ws-feed', tenantId],
		queryFn: () =>
			wsApi()
				.get('workout_results', {
					searchParams: {
						select: 'id,athlete_id,completed_at,workouts(name)',
						tenant_id: `eq.${tenantId}`,
						completed_at: `gte.${since}`,
						order: 'completed_at.desc',
					},
				})
				.json<FeedItem[]>(),
		enabled: !!tenantId,
		staleTime: 60_000,
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
					</View>
				) : (
					<View style={styles.empty}>
						<Text style={[styles.emptyText, { color: '#6B7280' }]}>
							No activity in the last 14 days
						</Text>
					</View>
				)
			}
			renderItem={({ item }) => (
				<View style={[styles.card, { backgroundColor: '#FFFFFF' }]}>
					<View style={styles.header}>
						<View
							style={[
								styles.avatar,
								{ backgroundColor: colors.brand },
							]}
						>
							<Text style={styles.avatarText}>
								{(item.profile?.full_name ?? 'A')
									.charAt(0)
									.toUpperCase()}
							</Text>
						</View>
						<View>
							<Text style={[styles.name, { color: '#111827' }]}>
								{item.profile?.full_name ?? 'Athlete'}
							</Text>
							<Text style={[styles.time, { color: '#6B7280' }]}>
								{moment(item.completed_at).format(
									'MMM D [·] h:mm A',
								)}
							</Text>
						</View>
					</View>
					<Text style={[styles.workoutName, { color: '#111827' }]}>
						Completed {item.workouts.name}
					</Text>
					<View style={styles.reactions}>
						{REACTIONS.map(r => (
							<Text key={r} style={styles.reactionEmoji}>
								{r}
							</Text>
						))}
					</View>
				</View>
			)}
		/>
	);
};

const styles = StyleSheet.create({
	container: { padding: 16, paddingBottom: 40 },
	card: { borderRadius: 12, padding: 14, marginBottom: 10, gap: 10 },
	header: { flexDirection: 'row', alignItems: 'center', gap: 10 },
	avatar: {
		width: 36,
		height: 36,
		borderRadius: 18,
		justifyContent: 'center',
		alignItems: 'center',
	},
	avatarText: { color: '#fff', fontWeight: '700', fontSize: 14 },
	name: { fontSize: 14, fontWeight: '600' },
	time: { fontSize: 12 },
	workoutName: { fontSize: 15, fontWeight: '500' },
	reactions: { flexDirection: 'row', gap: 8 },
	reactionEmoji: { fontSize: 22 },
	empty: { alignItems: 'center', padding: 40 },
	emptyText: { fontSize: 15 },
});

export default GymFeed;
