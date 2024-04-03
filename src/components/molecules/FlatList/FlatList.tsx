/* eslint-disable @typescript-eslint/no-explicit-any */
import { config } from '@/theme/_config';
import { FlatList as List, ListRenderItem, RefreshControl } from 'react-native';

type FlatListProps = {
	data: any[];
	renderItem: ListRenderItem<unknown>;
	loading?: boolean;
	refreshing?: boolean;
	onRefresh?: () => void;
	placeholder?: JSX.Element;
	useRefresh?: boolean;
	extractor?: (item: any, index: number) => string;
};

const FlatList = ({
	data,
	renderItem,
	loading,
	refreshing,
	onRefresh,
	placeholder,
	useRefresh,
	extractor,
	...rest
}: FlatListProps & React.ComponentProps<typeof List>) => {
	return (
		<List
			{...rest}
			showsVerticalScrollIndicator={false}
			keyExtractor={extractor}
			refreshControl={
				onRefresh ? (
					<RefreshControl
						colors={[config.fonts.colors.brand]}
						refreshing={refreshing || !!loading}
						onRefresh={onRefresh}
					/>
				) : undefined
			}
			ListEmptyComponent={placeholder}
			renderItem={renderItem}
			data={data}
		/>
	);
};

FlatList.defaultProps = {
	useRefresh: false,
	extractor: undefined,
	placeholder: null,
	onRefresh: undefined,
	refreshing: false,
	loading: false,
};

export default FlatList;
