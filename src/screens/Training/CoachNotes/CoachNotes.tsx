import { wsApi, wsRpc } from '@/services/workoutStudio/api';
import { getStoredWSSession } from '@/services/workoutStudio/auth';
import type { CoachNote } from '@/services/workoutStudio/types';
import { useTheme } from '@/theme';
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
import SkeletonCard from '../components/SkeletonCard';

const CoachNotes = () => {
	const { colors } = useTheme();
	const qc = useQueryClient();
	const session = getStoredWSSession();
	const uid = session?.user.id;

	const { data, isLoading, isRefetching, refetch } = useQuery({
		queryKey: ['ws-coach-notes', uid],
		queryFn: () =>
			wsApi()
				.get('section_athlete_notes', {
					searchParams: {
						select: 'id,content,created_at,read_at',
						athlete_id: `eq.${uid}`,
						order: 'created_at.desc',
					},
				})
				.json<CoachNote[]>(),
		enabled: !!uid,
		staleTime: 60_000,
	});

	const markRead = useMutation({
		mutationFn: (noteId: string) =>
			wsRpc('mark_section_athlete_note_read', { p_note_id: noteId }),
		onSuccess: () => {
			void qc.invalidateQueries({ queryKey: ['ws-coach-notes', uid] });
			void qc.invalidateQueries({
				queryKey: ['ws-coach-notes-unread', uid],
			});
		},
	});

	const markAllRead = useMutation({
		mutationFn: () => wsRpc('mark_all_section_athlete_notes_read'),
		onSuccess: () => {
			void qc.invalidateQueries({ queryKey: ['ws-coach-notes', uid] });
			void qc.invalidateQueries({
				queryKey: ['ws-coach-notes-unread', uid],
			});
		},
	});

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
							No coach notes yet
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
					onPress={() => !item.read_at && markRead.mutate(item.id)}
				>
					<Text style={[styles.content, { color: '#111827' }]}>
						{item.content}
					</Text>
					<Text style={[styles.date, { color: '#6B7280' }]}>
						{moment(item.created_at).format(
							'MMM D, YYYY [·] h:mm A',
						)}
					</Text>
					{!item.read_at && (
						<View
							style={[
								styles.unreadDot,
								{ backgroundColor: '#3B82F6' },
							]}
						/>
					)}
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
		position: 'relative',
	},
	content: { fontSize: 15, lineHeight: 22 },
	date: { fontSize: 12, marginTop: 6 },
	unreadDot: {
		position: 'absolute',
		top: 14,
		right: 14,
		width: 8,
		height: 8,
		borderRadius: 4,
	},
	empty: { alignItems: 'center', padding: 40 },
	emptyText: { fontSize: 15 },
});

export default CoachNotes;
