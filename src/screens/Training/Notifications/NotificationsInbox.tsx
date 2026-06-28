import { wsApi, wsRpc } from '@/services/workoutStudio/api';
import { getStoredWSSession } from '@/services/workoutStudio/auth';
import type { Notification } from '@/services/workoutStudio/types';
import { useTheme } from '@/theme';
import type { TrainingStackParamList } from '@/types/navigation';
import type { StackScreenProps } from '@react-navigation/stack';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import moment from 'moment';
import {
	FlatList,
	RefreshControl,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons';
import SkeletonCard from '../components/SkeletonCard';

type Props = StackScreenProps<TrainingStackParamList, 'TrainingNotifications'>;

const KIND_ICON: Record<string, string> = {
	assignment: 'dumbbell',
	coach_note: 'message-text-outline',
	reaction: 'heart-outline',
	wellness_followup: 'heart-pulse',
};

const NotificationsInbox = ({ navigation }: Props) => {
	const { colors } = useTheme();
	const qc = useQueryClient();
	const session = getStoredWSSession();
	const uid = session?.user.id;

	const { data, isLoading, isRefetching, refetch } = useQuery({
		queryKey: ['ws-notifications', uid],
		queryFn: () =>
			wsApi()
				.get('notifications', {
					searchParams: {
						select: '*',
						user_id: `eq.${uid}`,
						order: 'created_at.desc',
						limit: '50',
					},
				})
				.json<Notification[]>(),
		enabled: !!uid,
		staleTime: 60_000,
	});

	const markRead = useMutation({
		mutationFn: (id: string) =>
			wsRpc('mark_notification_read', { p_id: id }),
		onSuccess: () => {
			void qc.invalidateQueries({ queryKey: ['ws-notifications', uid] });
		},
	});

	const markAllRead = useMutation({
		mutationFn: () => wsRpc('mark_all_notifications_read'),
		onSuccess: () => {
			void qc.invalidateQueries({ queryKey: ['ws-notifications', uid] });
		},
	});

	const handleTap = (n: Notification) => {
		if (!n.read_at) markRead.mutate(n.id);
		if (n.kind === 'assignment' && n.entity_id) {
			navigation.navigate('TrainingWorkoutDetail', {
				workoutId: n.entity_id,
			});
		} else if (n.kind === 'coach_note') {
			navigation.navigate('TrainingCoachNotes');
		}
	};

	const unread = data?.filter(n => !n.read_at).length ?? 0;

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
			ListHeaderComponent={
				unread > 0 ? (
					<TouchableOpacity
						style={[
							styles.markAllBtn,
							{ backgroundColor: '#FFFFFF' },
						]}
						onPress={() => markAllRead.mutate()}
					>
						<Text
							style={[styles.markAllText, { color: '#3B82F6' }]}
						>
							Mark all {unread} read
						</Text>
					</TouchableOpacity>
				) : null
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
							No notifications
						</Text>
					</View>
				)
			}
			renderItem={({ item }) => (
				<TouchableOpacity
					style={[
						styles.card,
						{ backgroundColor: '#FFFFFF' },
						!item.read_at && {
							borderLeftWidth: 3,
							borderLeftColor: '#3B82F6',
						},
					]}
					onPress={() => handleTap(item)}
				>
					<Ionicons
						name={KIND_ICON[item.kind] ?? 'bell-outline'}
						size={22}
						color={item.read_at ? '#6B7280' : '#3B82F6'}
					/>
					<View style={styles.info}>
						<Text style={[styles.title, { color: '#111827' }]}>
							{item.title}
						</Text>
						<Text style={[styles.body, { color: '#6B7280' }]}>
							{item.body}
						</Text>
						<Text style={[styles.time, { color: '#6B7280' }]}>
							{moment(item.created_at).format('MMM D [·] h:mm A')}
						</Text>
					</View>
				</TouchableOpacity>
			)}
		/>
	);
};

const styles = StyleSheet.create({
	container: { padding: 16, paddingBottom: 40 },
	markAllBtn: {
		borderRadius: 10,
		padding: 12,
		alignItems: 'center',
		marginBottom: 12,
	},
	markAllText: { fontWeight: '600', fontSize: 14 },
	card: {
		borderRadius: 12,
		padding: 14,
		marginBottom: 10,
		flexDirection: 'row',
		gap: 12,
		alignItems: 'flex-start',
	},
	info: { flex: 1 },
	title: { fontSize: 15, fontWeight: '600' },
	body: { fontSize: 13, marginTop: 2, lineHeight: 18 },
	time: { fontSize: 12, marginTop: 4 },
	empty: { alignItems: 'center', padding: 40 },
	emptyText: { fontSize: 15 },
});

export default NotificationsInbox;
