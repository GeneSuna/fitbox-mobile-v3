import useAuth from '@/auth/hooks/useAuth';
import { Row, Spacer, Text } from '@/components/atoms';
import { Modal } from '@/components/molecules';
import { goBack } from '@/navigators/NavigationRef';
import {
	checkPaymentIntentForInvoice,
	createPaymentIntentForInvoice,
} from '@/services/users';
import { config } from '@/theme/_config';
import layout from '@/theme/layout';
import {
	DashboardStackNavigatorProps,
	FailedInvoicesDetailsParams,
} from '@/types/navigation';
import { Constant, Say } from '@/utils';
import { ICatchError } from '@/utils/Say';
import useStore from '@/zustand/Store';
import { useStripe } from '@stripe/stripe-react-native';
import moment from 'moment';
import { useEffect, useState } from 'react';
import {
	ActivityIndicator,
	StyleSheet,
	TouchableOpacity,
	View,
} from 'react-native';

const RenderField = ({
	title,
	value,
	isBold,
}: {
	title: string;
	value: string;
	isBold?: boolean;
}) => (
	<>
		<Row>
			<View style={layout.flex_1}>
				<Text bold={isBold} numberOfLines={2}>
					{title}
				</Text>
			</View>
			<View style={styles.valueCon}>
				<Text bold={isBold} style={styles.value}>
					{value}
				</Text>
			</View>
		</Row>
		<Spacer size="xs" />
	</>
);
const FailedInvoicesDetailsScreen = ({
	route,
}: DashboardStackNavigatorProps) => {
	// stripe
	const { initPaymentSheet, presentPaymentSheet } = useStripe();
	const params = route.params as FailedInvoicesDetailsParams;
	const [paymentIntentId, setSetupPaymentId] = useState<string>();
	const [isPaying, setIsPaying] = useState<boolean>(false);
	const { countryCode } = useStore(state => ({
		countryCode: state.countryCode,
	}));
	const { getApiUrl } = useAuth();

	const currentApi = getApiUrl();

	const parsedAmount = `$${(params.item.amount / 100).toFixed(2)}`;
	const parsedFee = params.item.calculatedFee
		? `$${(params.item.calculatedFee / 100).toFixed(2)}`
		: '';
	const hasOverdueCharges = params.charges.length > 0;
	const totalOverdueCharge = hasOverdueCharges
		? params.charges.reduce((total, invoice) => total + invoice.amount, 0)
		: 0;
	const parsedOverdueCharges = hasOverdueCharges
		? `$${(totalOverdueCharge / 100).toFixed(2)}`
		: '';
	const parsedTotal = `$${((params.item.amount + (params.item.calculatedFee || 0) + (hasOverdueCharges ? totalOverdueCharge : 0)) / 100).toFixed(2)}`;

	useEffect(() => {
		void setUpPaymentIntent();
	}, []);

	const getCurrency = (country: string) => {
		switch (country) {
			case 'AU':
				return 'AUD';
			case 'NZ':
				return 'NZD';
			default:
				return 'AUD';
		}
	};

	const setUpPaymentIntent = async () => {
		try {
			const res = await createPaymentIntentForInvoice(params.item.id);

			const initResponse = await initPaymentSheet({
				merchantDisplayName: 'fitbox',
				customerId: res.stripeCustomerId,
				customerEphemeralKeySecret: res.customerEphemeralSecret,
				paymentIntentClientSecret: res.paymentIntentSecret,
				allowsDelayedPaymentMethods: true,
				applePay: {
					merchantCountryCode: countryCode,
				},
				googlePay: {
					merchantCountryCode: countryCode,
					currencyCode: getCurrency(countryCode),
					testEnv: currentApi !== Constant.API_BASE_URLS.PROD,
				},
			});

			if (res.paymentIntentId) {
				setSetupPaymentId(res.paymentIntentId);
			}

			if (initResponse.error) {
				Say.err('Something went wrong');
			}
		} catch (e) {
			Say.err(e as ICatchError);
		}
	};

	const handlePayClick = () => {
		void openPaymentSheet();
	};

	const openPaymentSheet = async () => {
		const { error } = await presentPaymentSheet();
		setIsPaying(true);

		if (error) {
			setIsPaying(false);
		} else {
			try {
				const res = await checkPaymentIntentForInvoice(
					params.item.id,
					paymentIntentId as string,
				);

				if (!res.error && res.amountCaptured) {
					setIsPaying(false);
					void Say.okThen(
						`${res.userPaymentDetailsUpdated ? 'Your payment has been successfully processed, and your payment details have been updated.' : 'Your payment has been successfully processed.'} Thank you for your payment!`,
						'Payment Successful!',
					).then(() => goBack());
				}
			} catch (e) {
				setIsPaying(false);
				void Say.okThen(
					'Unfortunately, your payment could not be processed. Please try again or contact support.',
					'Payment Failed',
				).then(() => goBack());
			}
		}
	};

	return (
		<View style={[layout.flex_1, { paddingHorizontal: config.metrics.lg }]}>
			<View style={styles.detailsCon}>
				<Text bold size="md">
					Invoice Details
				</Text>
				<Spacer />
				<RenderField
					title="Description"
					value={params.item.description}
				/>
				<RenderField
					title="Date Issued"
					value={moment(params.item.date).format(
						Constant.DEFAULT_DATE_FORMAT,
					)}
				/>
				<RenderField title="Amount Due" value={parsedAmount} />
				{params.item.calculatedFee ? (
					<RenderField title="Transaction Fees" value={parsedFee} />
				) : null}
				{hasOverdueCharges ? (
					<>
						<RenderField
							title={`Failure Fees ${hasOverdueCharges ? `(x${params.charges.length})` : ''}`}
							value={parsedOverdueCharges}
						/>
						<Text size="xs" style={styles.overdueNote}>
							Failure Fees cover all failed invoices currently on
							your account. This fee is only applied when the
							first failed invoice is cleared.
						</Text>
					</>
				) : null}
				<Spacer />
				<View style={styles.lineBreak} />
				<RenderField title="Total" value={parsedTotal} isBold />
			</View>
			<Spacer size="h1" />
			<TouchableOpacity
				style={styles.payButton}
				onPress={() => void handlePayClick()}
			>
				<Text color="light" bold>
					Pay
				</Text>
			</TouchableOpacity>
			<Modal visible={isPaying}>
				<View>
					<ActivityIndicator
						size="large"
						color={config.colors.brand}
					/>
				</View>
			</Modal>
		</View>
	);
};

const styles = StyleSheet.create({
	detailsCon: {
		marginTop: config.metrics.xl,
		minHeight: 234,
		padding: config.metrics.md,
		...layout.shadowMedium,
	},
	lineBreak: {
		height: 1,
		backgroundColor: 'black',
		marginBottom: 15,
	},
	value: {
		textAlign: 'right',
	},
	valueCon: {
		flex: 1.3,
	},
	payButton: {
		backgroundColor: config.colors.info,
		height: 35,
		borderRadius: 6,
		alignItems: 'center',
		justifyContent: 'center',
	},
	overdueNote: {
		textAlign: 'justify',
	},
});

export default FailedInvoicesDetailsScreen;
