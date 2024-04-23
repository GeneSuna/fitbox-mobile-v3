import { Button, Text } from '@/components/atoms';
import { config } from '@/theme/_config';
import { BookableSchemaType } from '@/types/schemas/session';
import { Func, Say } from '@/utils';
import { isEmpty } from 'lodash';
import { memo, useCallback } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export interface ClassItemData {
	title?: string;
	location?: string;
	start?: string;
	duration?: string;
	isLoading?: boolean;
	bookable?: BookableSchemaType;
}

const { metrics, fonts } = config;

const AgendaItem = (props: { item: ClassItemData }) => {
	const { item } = props;

	const buttonPressed = useCallback(() => {
		Say.ok('Show me more');
	}, []);

	const itemPressed = useCallback(() => {
		Say.ok(item.title || 'No title');
	}, []);

	if (isEmpty(item) || item.isLoading) {
		return null;
	}

	const isSubscribed = Func.checkSubscription(
		item.bookable as BookableSchemaType,
	);

	return (
		<TouchableOpacity onPress={itemPressed} style={styles.item}>
			<View style={{ width: '20%', justifyContent: 'center' }}>
				<Text size="rg" bold>
					{item.start}
				</Text>
				<Text size="xs">{item.duration}</Text>
			</View>
			<View
				style={{
					borderRadius: 8,
					backgroundColor: fonts.colors.brand,
					height: '100%',
					width: 5,
					marginRight: metrics.rg,
				}}
			/>
			<View style={{ justifyContent: 'center', flex: 1 }}>
				<Text bold size="md">
					{item.title}
				</Text>
				{item.location ? <Text size="sm">{item.location}</Text> : null}
			</View>

			{isSubscribed ? <Text>Yes</Text> : null}

			<View style={styles.itemButtonContainer}>
				<Button
					title="Book"
					onPress={buttonPressed}
					variant="brand"
					mode="outlined"
					sm
				/>
			</View>
		</TouchableOpacity>
	);
};

export default memo(AgendaItem);

const styles = StyleSheet.create({
	item: {
		padding: 20,
		backgroundColor: 'white',
		borderBottomWidth: 1,
		borderBottomColor: 'lightgrey',
		flexDirection: 'row',
	},
	itemHourText: {
		color: 'black',
	},

	itemTitleText: {
		color: 'black',
		fontWeight: 'bold',
		fontSize: 16,
	},
	itemButtonContainer: {
		alignItems: 'flex-end',
		width: '25%',
	},
	emptyItem: {
		paddingLeft: 20,
		height: 52,
		justifyContent: 'center',
		borderBottomWidth: 1,
		borderBottomColor: 'lightgrey',
	},
	emptyItemText: {
		color: 'lightgrey',
		fontSize: 14,
	},
});
