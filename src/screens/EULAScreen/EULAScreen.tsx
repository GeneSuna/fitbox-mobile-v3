/* eslint-disable no-console */
import useAuth from '@/auth/hooks/useAuth';
import { Button, Row, ScrollView, Spacer } from '@/components/atoms';
import { getEula } from '@/services/eula';
import acceptEula from '@/services/eula/acceptEula';
import { config } from '@/theme/_config';
import layout from '@/theme/layout';
import { ApplicationScreenProps } from '@/types/navigation';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';
import HTMLView from 'react-native-htmlview';

type StateTypes = {
	eula: string;
	accepting: boolean;
	loading: boolean;
};

const EULAScreen = ({ navigation }: ApplicationScreenProps) => {
	const { user, updateUser, signOut } = useAuth();
	const [state, setState] = useState<StateTypes>({
		eula: '',
		accepting: false,
		loading: true,
	});

	useEffect(() => {
		void (async () => {
			try {
				const res = await getEula();
				setState({ ...state, eula: res.eula, loading: false });
			} catch (e) {
				console.log('e: ', e);
			}
		})();
	}, []);

	const handleDecline = () => {
		signOut();
		navigation.reset({
			index: 0,
			routes: [{ name: 'Landing' }],
		});
	};

	const handleAccept = async () => {
		try {
			if (state.accepting) return false;

			setState({ ...state, accepting: true });
			const res = await acceptEula();

			if (res.error) {
				Alert.alert(res.message);
				return false;
			}
			const userData = user?.user_data;
			if (userData) {
				userData.eula_accepted = true;
				updateUser(userData);
				navigation.navigate('Startup');
			}
			return true;
		} catch (e) {
			setState({ ...state, accepting: false });
			Alert.alert('Something went wrong');
			return false;
		}
	};

	return state.loading ? (
		<View style={styles.loaderStyle}>
			<ActivityIndicator color={config.colors.brand} size="large" />
		</View>
	) : (
		<View style={styles.eulaContainerStyle}>
			<ScrollView>
				<HTMLView value={state.eula} stylesheet={cssStyles} />
			</ScrollView>

			<Spacer />

			<Row spacing="center">
				<View style={layout.flex_1}>
					<Button
						title="Decline"
						style={{ backgroundColor: config.colors.danger }}
						onPress={handleDecline}
					/>
				</View>
				<Spacer horizontal size="xl" />
				<View style={layout.flex_1}>
					<Button
						title="Accept"
						style={{ backgroundColor: config.colors.success }}
						onPress={() => void handleAccept()}
						loading={state.accepting}
					/>
				</View>
			</Row>
		</View>
	);
};

const styles = StyleSheet.create({
	eulaContainerStyle: {
		flex: 1,
		padding: config.metrics.lg,
	},
	loaderStyle: {
		flex: 1,
		justifyContent: 'center',
	},
});

const cssStyles = StyleSheet.create({
	strong: {
		fontWeight: 'bold',
	},
});
export default EULAScreen;
