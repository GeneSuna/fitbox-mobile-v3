import { Button, Spacer, Text } from '@/components/atoms';
import { resetPassword } from '@/services/auth';
import { config } from '@/theme/_config';
import layout from '@/theme/layout';
import { Say } from '@/utils';
import { ICatchError } from '@/utils/Say';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { TextInput } from 'react-native-paper';

const ResetPassword = () => {
	const [email, setEmail] = useState<string>('');
	const [processing, setProcessing] = useState<boolean>(false);
	const navigation = useNavigation();

	const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
	const isValidEmail = (input: string) => emailRegex.test(input);

	const handleChangeEmail = (userEmail: string) => setEmail(userEmail);

	const handleSubmit = async () => {
		try {
			if (processing) return false;

			setProcessing(true);

			const userEmail = email.trim();
			if (!userEmail) {
				setProcessing(false);
				return Say.warn('Please enter your email adddress');
			}

			if (userEmail && !isValidEmail(userEmail)) {
				setProcessing(false);
				return Say.warn('Please enter a valid email adddress');
			}
			const res = await resetPassword(userEmail);
			setProcessing(false);
			return await Say.okThen(
				res.message,
				'Password Reset Requested',
			).then(() => navigation.goBack());
		} catch (e) {
			setProcessing(false);
			return Say.err(e as ICatchError);
		}
	};

	return (
		<SafeAreaView>
			<View style={{ padding: config.metrics.lg }}>
				<Text center color="darkgray">
					To reset your password, enter the email address you use to
					Log In
				</Text>
				<Spacer />
				<TextInput
					label="Email"
					mode="flat"
					value={email}
					onChangeText={handleChangeEmail}
					autoComplete="off"
					style={[styles.input, layout.fontMontserratRegular]}
					autoCapitalize="none"
					keyboardType="email-address"
					underlineColor="transparent"
					allowFontScaling={false}
				/>
				<Spacer size="lg" />
				<Button
					title="Submit"
					style={styles.submitButton}
					buttonColor={config.colors.brand}
					onPress={() => void handleSubmit()}
					loading={processing}
				/>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	input: {
		borderWidth: 1,
		borderRadius: 4,
		borderColor: '#f2f2f2',
		backgroundColor: 'transparent',
	},
	submitButton: {
		width: '47%',
		alignSelf: 'center',
	},
});

export default ResetPassword;
