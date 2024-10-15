import getWorkouts from '@/services/leaderboards/getWorkouts';
import { useQuery } from '@tanstack/react-query';

export const useWorkouts = () => {
	return useQuery({
		queryKey: ['getWorkouts'],
		queryFn: () => getWorkouts(),
		staleTime: Infinity,
	});
};
