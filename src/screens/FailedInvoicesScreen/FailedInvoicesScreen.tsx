import { Row, Text } from '@/components/atoms';
import { navigate } from '@/navigators/NavigationRef';
import { getFailedPayments } from '@/services/users';
import { config } from '@/theme/_config';
import layout from '@/theme/layout';
import { InvoicesType } from '@/types/schemas/payment';
import { Constant } from '@/utils';
import { useFocusEffect } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import moment from 'moment';
import { useCallback } from 'react';
import {
	ActivityIndicator,
	FlatList,
	StyleSheet,
	TouchableOpacity,
	View,
} from 'react-native';

const FailedInvoicesScreen = () => {
	const { data, isLoading, refetch } = useQuery({
		queryKey: ['getFailedInvoices'],
		queryFn: () => getFailedPayments(),
	});

	useFocusEffect(
		useCallback(() => {
			void refetch();
		}, [refetch]),
	);

	const failedInvoices = data;
	const charges = data?.insufficientFundsInvoices;

	const onPressPay = (item: InvoicesType) => {
		navigate('FailedInvoicesDetails', { charges, item });
	};

	const renderInvoices = ({ item }: { item: InvoicesType }) => {
		return (
			<TouchableOpacity
				style={styles.itemCon}
				key={item.id}
				onPress={() => onPressPay(item)}
			>
				<Row spacing="space-between">
					<View style={styles.textCon}>
						<Text numberOfLines={2}>{item.description}</Text>
						<Row align="flex-end">
							<Text>{`$${(item.amount / 100).toFixed(2)} `}</Text>
							<Text size="xs" style={styles.fees}>
								{item.apply_transaction_fees_to_member
									? '+fees'
									: ''}
							</Text>
						</Row>
						<Text size="sm">
							{moment(item.date).format(
								Constant.DEFAULT_DATE_FORMAT,
							)}
						</Text>
					</View>
					<View style={styles.buttonCon}>
						<View style={styles.payButton}>
							<Text color="light" bold>
								View
							</Text>
						</View>
					</View>
				</Row>
			</TouchableOpacity>
		);
	};

	if (isLoading) {
		return (
			<View style={[layout.flex_1, layout.justifyCenter]}>
				<ActivityIndicator size="large" color={config.colors.brand} />
			</View>
		);
	}

	if (failedInvoices?.invoices.length === 0) {
		return (
			<View
				style={[layout.flex_1, layout.justifyCenter, layout.selfCenter]}
			>
				<Text>No overdue invoices to show.</Text>
			</View>
		);
	}

	return (
		<View style={[layout.flex_1, { marginTop: config.metrics.lg }]}>
			<FlatList
				data={failedInvoices?.invoices}
				renderItem={renderInvoices}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginHorizontal: 18,
		marginTop: 20,
		marginBottom: 25,
	},
	itemCon: {
		minHeight: 73,
		maxHeight: 95,
		marginHorizontal: 18,
		padding: 15,
		...layout.shadowMedium,
		borderRadius: 4,
		marginBottom: 5,
	},
	textCon: {
		flex: 2,
	},
	buttonCon: {
		flex: 1,
		alignItems: 'flex-end',
		justifyContent: 'center',
	},
	payButton: {
		width: 92,
		height: 35,
		backgroundColor: config.colors.info,
		borderRadius: 6,
		alignItems: 'center',
		justifyContent: 'center',
	},
	fees: {
		bottom: 1.5,
	},
});

export default FailedInvoicesScreen;
