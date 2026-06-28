import { wsRpc } from '@/services/workoutStudio/api';
import { getStoredWSSession } from '@/services/workoutStudio/auth';
import { useQuery } from '@tanstack/react-query';

export const useCustomWorkouts = () => {
	const session = getStoredWSSession();
	const uid = session?.user.id;
	return useQuery({
		queryKey: ['ws-has-custom-workouts', uid],
		queryFn: () => wsRpc<boolean>('has_custom_workouts', { _user_id: uid }),
		enabled: !!uid,
		staleTime: 300_000,
	});
};
