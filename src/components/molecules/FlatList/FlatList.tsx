/* eslint-disable @typescript-eslint/no-explicit-any */
import { config } from '@/theme/_config';
import {
	FlatListProps as FCProps,
	FlatList as List,
	RefreshControl,
} from 'react-native';

type FlatListProps = {
	data: any[];
	loading?: boolean;
	refreshing?: boolean;
	onRefresh?: () => void;
	placeholder?: JSX.Element;
	useRefresh?: boolean;
	extractor?: (item: any, index: number) => string;
} & FCProps<any>;

const FlatList = ({
	placeholder,
	refreshing = false,
	loading = false,
	data,
	onRefresh,
	extractor,
	...rest
}: FlatListProps) => {
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
			data={data}
		/>
	);
};

export default FlatList;
