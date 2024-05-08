import useAuth from '@/auth/hooks/useAuth';
import { Button, HR, Text } from '@/components/atoms';
import { navigate } from '@/navigators/NavigationRef';
import setupPaymentIntent from '@/services/payment/setupPaymentIntent';
import { getSubscriptionInfo } from '@/services/subscription';
import getUserGymInfo from '@/services/users/getUserGymInfo';
import { config } from '@/theme/_config';
import layout from '@/theme/layout';
import { SubscriptionType } from '@/types/schemas/subscription';
import { UserSchemaType } from '@/types/schemas/user';
import { Say } from '@/utils';
import useStore from '@/zustand/Store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import SimpleToast from 'react-native-simple-toast';
import WebView from 'react-native-webview';

type StateProps = {
	isLoading: boolean;
	showOptions: boolean;
	paymentURL: string | null;
	paymentLoading: boolean;
	pageUrl: string;
	allowSkip: boolean;
};

type QueryParamsTypes = {
	cs: string;
	pmt: string;
	uid: number;
};

const CardInfoScreen = () => {
	const { user } = useAuth();
	const navigation = useNavigation();
	const skipPaymentGateways = ['cash', 'bank_transfer'];
	const { setAppState } = useStore(state => ({
		setAppState: state.setAppState,
	}));
	const [state, setState] = useState<StateProps>({
		isLoading: true,
		showOptions: true,
		paymentURL: null,
		paymentLoading: true,
		pageUrl: '',
		allowSkip: true,
	});
	const [paymentIsLoading, setPaymentIsLoading] = useState(true);
	useEffect(() => {
		void (async () => {
			await checkCountry();
			await checkSubscription();
			await setUpPaymentIntent();
		})();
	}, []);

	const checkCountry = async () => {
		try {
			const res = await getUserGymInfo();
			if (res.gym_info.country === 'NZ') {
				setState({ ...state, showOptions: false });
			}
		} catch (e) {
			console.log(e);
		}
	};

	const checkSubscription = async () => {
		try {
			const subInfoRes = await getSubscriptionInfo();

			if (subInfoRes.current.length) {
				const currentSubscription =
					subInfoRes.current.reverse()[0] as SubscriptionType;

				const { payment_gateway: paymentGateway } = currentSubscription;

				if (skipPaymentGateways.includes(paymentGateway as string)) {
					setState({ ...state, allowSkip: false });
				}
			}
		} catch (e) {
			console.log(e);
		}
	};

	const setUpPaymentIntent = async () => {
		try {
			const res = await setupPaymentIntent();

			const queryParams: QueryParamsTypes = {
				cs: res.clientSecret,
				pmt: JSON.stringify(res.paymentMethodType),
				uid: user?.user_data.user_id as number,
			};

			const paymentUrl = `${process.env.API_URL as string}?${Object.keys(
				queryParams,
			)
				.map(
					key =>
						`${key}=${queryParams[key as keyof QueryParamsTypes]}`,
				)
				.join('&')}`;

			setState({ ...state, paymentURL: paymentUrl });
		} catch (e) {
			console.log(e);
		}
	};

	const getUserInfo = async () => {
		const session = await AsyncStorage.getItem('session');

		if (session === null) {
			return null;
		}
		try {
			const sessionFromStorage = JSON.parse(session) as UserSchemaType;
			return sessionFromStorage;
		} catch (e) {
			console.log('error: ', e);
			return null;
		}
	};

	const handleskip = async () => {
		const userInStorage = (await getUserInfo()) as UserSchemaType;

		userInStorage.has_payment_details = 'skipped';

		await AsyncStorage.setItem('session', JSON.stringify(userInStorage));
		setAppState('user', userInStorage);

		// TODO: create and navigate to AuthLoading
		// navigate('AuthLoading')
	};

	const onSuccessCallback = async () => {
		setState({ ...state, isLoading: true });

		const session = await AsyncStorage.getItem('session');

		let sessionUser: UserSchemaType;

		try {
			if (session) {
				sessionUser = JSON.parse(session) as UserSchemaType;
				sessionUser.has_payment_details = 'skipped';
				await AsyncStorage.setItem(
					'session',
					JSON.stringify(sessionUser),
				);
				setAppState('user', sessionUser);
			}
		} catch (e) {
			console.log('error: ', e);
		}

		if (
			navigation.getState().routes[
				navigation.getState().routes.length - 1
			]?.name === 'PaymentUpdate'
		) {
			navigation.goBack();
			Say.ok('Successfully Updated');
		} else {
			SimpleToast.show('Success, please wait..', SimpleToast.SHORT);

			setTimeout(() => {
				navigate('StripeSuccess');
			});
		}
	};

	const setPaymentLoading = () => {
		setPaymentIsLoading(false);
	};

	const SCRIPT = `
	const meta = document.createElement('meta');
	meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0');
	meta.setAttribute('name', 'viewport');
	document.head.appendChild(meta);
	`;
	if (!state.isLoading)
		return (
			<View style={styles.loaderStyle}>
				<ActivityIndicator color={config.colors.brand} size="large" />
			</View>
		);

	const webViewStyle = {
		flex: 1,
		height: !paymentIsLoading ? '100%' : 0,
		alignSelf: 'stretch',
	};

	return (
		<>
			<View style={styles.cardInfoContainer}>
				<Text
					size="xl"
					center
					style={{ paddingHorizontal: config.metrics.md }}
				>
					{state.showOptions
						? 'Choose Your Payment Option'
						: 'Setup Payment Information'}
				</Text>
				<HR style={{ marginVertical: config.metrics.xl }} />

				{state.paymentURL && (
					<View style={layout.flex_1}>
						<WebView
							style={webViewStyle}
							scalesPageToFit
							source={{ uri: state.paymentURL }}
							injectedJavaScript={SCRIPT}
							onNavigationStateChange={({
								url,
							}: {
								url: string;
							}) => setState({ ...state, pageUrl: url })}
							onLoad={() => {
								setPaymentLoading();
								if (state.pageUrl.includes('/success')) {
									void onSuccessCallback();
								}
							}}
						/>
					</View>
				)}
				{paymentIsLoading && (
					<ActivityIndicator color={config.colors.brand} />
				)}
			</View>

			{navigation.getState().routes[
				navigation.getState().routes.length - 1
			]?.name !== 'PaymentUpdate' &&
				state.allowSkip && (
					<View style={styles.skipButtonContainer}>
						<Button
							title="Skip"
							labelStyle={styles.skipButtonStyle}
							dark
							onPress={void handleskip}
						/>
					</View>
				)}
		</>
	);
};

const styles = StyleSheet.create({
	skipButtonStyle: {
		lineHeight: 30,
	},
	skipButtonContainer: {
		justifyContent: 'flex-end',
		padding: config.metrics.lg,
	},
	cardInfoContainer: {
		paddingHorizontal: 0,
		paddingTop: config.metrics.xl,
		flex: 1,
	},
	loaderStyle: {
		flex: 1,
		justifyContent: 'center',
	},
});

export default CardInfoScreen;
