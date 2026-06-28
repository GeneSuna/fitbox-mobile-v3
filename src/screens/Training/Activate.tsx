import type { TrainingStackParamList } from '@/types/navigation';
import type { StackScreenProps } from '@react-navigation/stack';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = StackScreenProps<TrainingStackParamList, 'TrainingActivate'>;

const MESSAGES: Record<string, { icon: string; title: string; body: string }> =
	{
		NOT_FOUND: {
			icon: 'dumbbell',
			title: 'Activate your training profile',
			body: "Your fitbox account isn't linked to Workout Studio yet. Ask your gym admin to add you, or sign up at studio.fitbox.iq.",
		},
		NO_MEMBERSHIP: {
			icon: 'account-off-outline',
			title: 'No active membership',
			body: 'Your account exists but has no active gym membership or solo subscription. Contact your gym or sign up at studio.fitbox.iq.',
		},
		UNKNOWN_GYM: {
			icon: 'office-building-remove-outline',
			title: "Your gym isn't on Workout Studio yet",
			body: 'Ask your gym admin to enable Workout Studio, or sign up as a solo athlete at studio.fitbox.iq.',
		},
		PROVISION_FAILED: {
			icon: 'account-sync-outline',
			title: 'Account setup failed',
			body: "We couldn't set up your Workout Studio account. Please try again — if this keeps happening, contact support.",
		},
		NETWORK_ERROR: {
			icon: 'wifi-off',
			title: 'Could not connect',
			body: "We couldn't reach the Workout Studio backend. Check your connection and try again.",
		},
		default: {
			icon: 'dumbbell',
			title: 'Activate your training profile',
			body: 'Connect your fitbox account to Workout Studio to see your workouts, results, and wellness data here.',
		},
	};

const Activate = ({ route, navigation }: Props) => {
	const errorCode = route.params?.errorCode ?? 'default';
	const { icon, title, body } = (MESSAGES[errorCode] ?? MESSAGES.default)!;

	return (
		<View style={[styles.container, { backgroundColor: '#F9FAFB' }]}>
			<Ionicons name={icon} size={64} color="#6B7280" />
			<Text style={[styles.title, { color: '#111827' }]}>{title}</Text>
			<Text style={[styles.body, { color: '#6B7280' }]}>{body}</Text>
			{(errorCode === 'NETWORK_ERROR' ||
				errorCode === 'PROVISION_FAILED') && (
				<TouchableOpacity
					style={[styles.button, { backgroundColor: '#3B82F6' }]}
					onPress={() => navigation.replace('TrainingRoot')}
				>
					<Text style={styles.buttonText}>Try again</Text>
				</TouchableOpacity>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 32,
		gap: 16,
	},
	title: {
		fontSize: 22,
		fontWeight: '700',
		textAlign: 'center',
	},
	body: {
		fontSize: 15,
		textAlign: 'center',
		lineHeight: 22,
	},
	button: {
		marginTop: 8,
		paddingHorizontal: 32,
		paddingVertical: 14,
		borderRadius: 10,
	},
	buttonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600',
	},
});

export default Activate;
