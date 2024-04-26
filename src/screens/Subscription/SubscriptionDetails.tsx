import { HR, Row, ScrollView, Spacer, Text } from '@/components/atoms';
import { goBack } from '@/navigators/NavigationRef';
import { getSubscriptionDetails } from '@/services/subscription';
import { config } from '@/theme/_config';
import layout from '@/theme/layout';
import { MenuStackNavigatorProps } from '@/types/navigation';
import { SubscriptionDetailsType } from '@/types/schemas/subscription';
import moment from 'moment';
import { useEffect, useLayoutEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, TextStyle, View } from 'react-native';

type RowDetailTypes = {
	title: string;
	value: string | number;
	lowercase?: boolean;
};

const RowDetail = ({ title, value, lowercase }: RowDetailTypes) => {
	const valueStyles = {
		flex: 1.5,
		textTransform: lowercase ? 'lowercase' : 'capitalize',
		marginLeft: 15,
	};

	return (
		<Row
			spacing="space-between"
			style={{ marginVertical: config.metrics.rg }}
		>
			<Text size="md" color="darkgray" style={layout.flex_1}>
				{title}:
			</Text>
			<Text size="md" color="darkgray" style={valueStyles as TextStyle}>
				{value}
			</Text>
		</Row>
	);
};

RowDetail.defaultProps = {
	lowercase: false,
};

const SubscriptionDetails = ({
	route,
	navigation,
}: MenuStackNavigatorProps) => {
	useLayoutEffect(() => {
		navigation.setOptions({
			title: 'Subscription Information',
		});
	}, []);

	// states
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [data, setData] = useState<SubscriptionDetailsType>();

	const { id, type }: { id?: number; type?: string } = route.params ?? {};

	useEffect(() => {
		void (async () => {
			setIsLoading(true);
			try {
				const res = await getSubscriptionDetails(id);

				if (res) {
					setData(res[0]);
					setIsLoading(false);
				} else {
					goBack();
				}
			} catch (e) {
				console.log('error, ', e);
				setIsLoading(false);
			}
		})();
	}, []);

	let subscriptionExpiresValue;
	if (type === 'past') {
		subscriptionExpiresValue = moment(data?.cancellation_date).format(
			'DD/MM/YY',
		);
	} else if (data?.expiration_interval_unit === 'never') {
		subscriptionExpiresValue = 'Never';
	} else {
		subscriptionExpiresValue = `${data?.expiration_interval ?? ''}minimum`;
	}

	let billingFrequencyValue;
	if (data?.recurring_interval_unit === 'per-billing-cycle') {
		billingFrequencyValue = 'Per Billing Cycle';
	} else if (data?.recurring_interval_unit.toLowerCase() === 'day') {
		billingFrequencyValue = 'Daily';
	} else {
		billingFrequencyValue = `${data?.recurring_interval_unit ?? ''}ly`;
	}

	return isLoading ? (
		<View style={styles.loaderStyle}>
			<ActivityIndicator size="large" color={config.colors.brand} />
		</View>
	) : (
		<ScrollView contentContainerStyle={{ padding: config.metrics.md }}>
			<Spacer size="sm" />
			<Text size="md" center bold color="darkgray">
				Subscription Details:
			</Text>
			<HR thickness={1} color="#F2F2F2" />

			<View style={styles.mainDetailsStyle}>
				<RowDetail title="Name" value={data?.name || ''} />
				<RowDetail
					title="Price"
					value={`$${(Number(data?.price_in_cents) / 100).toFixed(
						2,
					)}`}
				/>
				<RowDetail
					title="1st Billing Date"
					value={moment(data?.first_billing_date).format('DD/MM/YY')}
				/>
				<RowDetail
					title="Subscription Expires"
					value={subscriptionExpiresValue}
				/>
				{data?.recurring_interval_unit !== '' && (
					<RowDetail
						title="Billing Frequency"
						value={billingFrequencyValue}
					/>
				)}

				{data?.apply_transaction_fees_to_member === 1 && (
					<RowDetail
						title="Transaction fees"
						value="Added to invoice (in Stripe)"
					/>
				)}
				{data?.sessions_count !== null && (
					<RowDetail
						title="Sessions Remaining"
						value={data?.sessions_count as number}
					/>
				)}
				{data?.sessions_limit_frequency !== null && (
					<RowDetail
						title="Resets"
						value={data?.sessions_limit_frequency as string}
					/>
				)}
			</View>
			{type === 'suspended' && (
				<View style={{ marginTop: config.metrics.lg }}>
					<Text size="md" center bold color="darkgray">
						Hold Details:{' '}
					</Text>

					<View style={styles.suspendedDetailsStyle}>
						<RowDetail
							title="Hold Start"
							value={moment(data?.suspended_begin_date).format(
								'DD/MM/YY',
							)}
						/>
						<RowDetail
							title="Hold End"
							value={moment(data?.suspended_until_date).format(
								'DD/MM/YY',
							)}
						/>
						<RowDetail
							title="Next Billing Date"
							value={moment(data?.next_payment_date).format(
								'DD/MM/YY',
							)}
						/>
					</View>
				</View>
			)}
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	loaderStyle: {
		flex: 1,
		justifyContent: 'center',
	},
	mainDetailsStyle: {
		paddingHorizontal: 15,
		paddingVertical: 8,
	},
	suspendedDetailsStyle: {
		paddingHorizontal: 15,
		paddingVertical: 8,
	},
});

export default SubscriptionDetails;
