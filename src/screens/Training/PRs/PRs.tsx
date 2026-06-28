import { wsApi } from '@/services/workoutStudio/api';
import { getStoredWSSession } from '@/services/workoutStudio/auth';
import type { AthleteRM } from '@/services/workoutStudio/types';
import { useTheme } from '@/theme';
import { useQuery } from '@tanstack/react-query';
import moment from 'moment';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons';
import SkeletonCard from '../components/SkeletonCard';

const PRs = () => {
	const { colors } = useTheme();
	const session = getStoredWSSession();
	const uid = session?.user.id;

	const { data, isLoading, isRefetching, refetch } = useQuery({
		queryKey: ['ws-prs', uid],
		queryFn: () =>
			wsApi()
				.get('athlete_rms', {
					searchParams: {
						select: 'id,rep_max,weight,achieved_on,movements(name)',
						user_id: `eq.${uid}`,
						order: 'achieved_on.desc',
					},
				})
				.json<AthleteRM[]>(),
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
					</View>
				) : (
					<View style={styles.empty}>
						<Text style={[styles.emptyText, { color: '#6B7280' }]}>
							No PRs yet — log a workout to get started
						</Text>
					</View>
				)
			}
			renderItem={({ item }) => (
				<View style={[styles.card, { backgroundColor: '#FFFFFF' }]}>
					<Ionicons name="trophy" size={22} color="#FFB300" />
					<View style={styles.info}>
						<Text
							style={[styles.movementName, { color: '#111827' }]}
						>
							{item.movements.name}
						</Text>
						<Text style={[styles.date, { color: '#6B7280' }]}>
							{moment(item.achieved_on).format('MMM D, YYYY')}
						</Text>
					</View>
					<Text style={[styles.weight, { color: '#3B82F6' }]}>
						{item.weight}kg x {item.rep_max}RM
					</Text>
				</View>
			)}
		/>
	);
};

const styles = StyleSheet.create({
	container: { padding: 16, paddingBottom: 40 },
	card: {
		borderRadius: 12,
		padding: 14,
		marginBottom: 10,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
	},
	info: { flex: 1 },
	movementName: { fontSize: 15, fontWeight: '600' },
	date: { fontSize: 12, marginTop: 2 },
	weight: { fontSize: 16, fontWeight: '700' },
	empty: { alignItems: 'center', padding: 40 },
	emptyText: { fontSize: 15, textAlign: 'center' },
});

export default PRs;
