/* eslint-disable no-console */
import useAuth from '@/auth/hooks/useAuth';
import { SafeScreen } from '@/components/template';
import { config } from '@/theme/_config';
import { ApplicationScreenProps, ShopParams } from '@/types/navigation';
import { MobilePayStartSchema } from '@/types/schemas/payment';
import { Constant } from '@/utils';
import useStore from '@/zustand/Store';
import {
	initPaymentSheet,
	presentPaymentSheet,
} from '@stripe/stripe-react-native';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import WebView from 'react-native-webview';

const Shop = ({ navigation, route }: ApplicationScreenProps) => {
	const ref = useRef<WebView>(null);
	const shopUrl = useStore(state => state.shopUrl);
	const { user, getApiUrl } = useAuth();
	const {
		storeSignature,
		storeSignatureExpiry,
		teamId,
		customerId,
		countryCode,
	} = useStore(state => ({
		storeSignature: state.storeSignature,
		storeSignatureExpiry: state.storeSignatureExpiry,
		teamId: state.teamId,
		customerId: state.stripeCustomerId,
		countryCode: state.countryCode,
	}));
	const { orderKey } = (route.params as ShopParams) || {};
	const currentApi = getApiUrl();

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [hasTriggeredPay, setHasTriggeredPay] = useState(false);

	const storeUrl = useMemo(() => {
		return `${shopUrl}?fb_email=${user?.user_data.email}&fb_first=${user?.user_data.first_name}&fb_last=${user?.user_data.last_name}&fb_sig=${storeSignature}&fb_expiry=${storeSignatureExpiry}&fb_gym=${teamId}`;
	}, [shopUrl, user, storeSignature, storeSignatureExpiry, teamId]);

	useEffect(() => {
		ref.current?.reload();
	}, [storeUrl]);

	useEffect(() => {
		if (orderKey && !hasTriggeredPay) {
			setIsLoading(true);
			setHasTriggeredPay(true);
			void startMobilePay(orderKey);
		}
	}, [orderKey, hasTriggeredPay]);

	useEffect(() => {
		return () => {
			setHasTriggeredPay(false);
		};
	}, []);

	useEffect(() => {
		setHasTriggeredPay(false);
	}, [orderKey]);

	const startMobilePay = async (orderkey: string) => {
		try {
			const baseUrl = shopUrl.replace(/\/shop\/?$/, '/');
			const mobilePayUrl = `${baseUrl}wp-json/fitbox/v1/mobile-pay/start?order_key=${orderkey}&customer_id=${customerId}`;

			// console.log('Calling: ', mobilePayUrl);

			const response = await fetch(mobilePayUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
			});

			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			const data = await response.json();
			const parsedData = MobilePayStartSchema.parse(data);

			const initResponse = await initPaymentSheet({
				merchantDisplayName: 'fitbox',
				customerId: parsedData.customer_id,
				customerEphemeralKeySecret:
					parsedData.customer_ephemeral_key_secret,
				paymentIntentClientSecret:
					parsedData.payment_intent_client_secret,
				allowsDelayedPaymentMethods: true,
				applePay: {
					merchantCountryCode: countryCode,
				},
				googlePay: {
					merchantCountryCode: countryCode,
					currencyCode: parsedData.currency.toUpperCase(),
					testEnv: currentApi !== Constant.API_BASE_URLS.PROD,
				},
			});
			if (initResponse.error) {
				console.error(
					'Error initializing payment sheet:',
					initResponse.error,
				);
				setIsLoading(false);
				return;
			}
			console.log('Payment sheet initialized successfully');
			setIsLoading(false);
			const { error } = await presentPaymentSheet();

			navigation.setParams({ orderKey: undefined });

			if (error) {
				console.error('Error presenting payment sheet:', error);
				ref.current?.reload();
				setIsLoading(false);
			}

			console.log('mobile-pay/start result:', parsedData);
		} catch (err) {
			console.error('Error calling mobile pay:', err);
			setIsLoading(false);
		}
	};

	return (
		<SafeScreen>
			<WebView ref={ref} key={storeUrl} source={{ uri: storeUrl }} />

			{isLoading && (
				<View style={styles.loadingView}>
					<ActivityIndicator
						size="large"
						color={config.colors.brand}
					/>
				</View>
			)}
		</SafeScreen>
	);
};

const styles = StyleSheet.create({
	loadingView: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: 'rgba(0,0,0,0.5)',
		alignItems: 'center',
		justifyContent: 'center',
		zIndex: 999,
	},
});
export default Shop;
