import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { debounce } from 'lodash';
import { useCallback, useEffect } from 'react';

import { getResultTypes } from '@/services/users';
import { ResultType } from '@/types/schemas/leaderboards';
import { Func } from '@/utils';

export const useResultTypes = (searchQuery: string) => {
	const queryClient = useQueryClient();

	const {
		data,
		isFetching: refreshing,
		refetch,
		fetchNextPage,
		isFetchingNextPage,
	} = useInfiniteQuery({
		queryKey: ['getResultTypes', searchQuery],
		queryFn: ({ pageParam = 1 }) => getResultTypes(searchQuery, pageParam),
		initialPageParam: 1,
		getNextPageParam: (lastPage, allPages) =>
			Func.getNextPageParam(lastPage.end, allPages[0]?.totalResults),
		select: d => ({
			data: Array.from(
				new Map(
					d.pages
						.flatMap(page => page.data)
						.filter((item): item is ResultType => !!item.id)
						.map(item => [item.id, item]),
				).values(),
			),
			totalResults: d.pages[0]?.totalResults || 0,
		}),
	});

	const handleRefresh = useCallback(() => {
		queryClient.removeQueries({ queryKey: ['getPastPerformanceHistory'] });
		void refetch();
	}, [queryClient, refetch]);

	const debouncedRefresh = useCallback(debounce(handleRefresh, 500), [
		handleRefresh,
	]);

	useEffect(() => {
		debouncedRefresh();
		return () => debouncedRefresh.cancel();
	}, [searchQuery, debouncedRefresh]);

	const onEndReached = useCallback(() => {
		if (!isFetchingNextPage) {
			void fetchNextPage();
		}
	}, [isFetchingNextPage, fetchNextPage]);

	return {
		data,
		refreshing,
		isFetchingNextPage,
		onEndReached,
		handleRefresh,
	};
};
