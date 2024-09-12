import { Button } from '@/components/atoms';
import { ApplicationStackParamList } from '@/types/navigation';
import { Func } from '@/utils';
import useStore from '@/zustand/Store';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { isNumber } from 'lodash';
import moment from 'moment';
import { memo } from 'react';
import { Alert } from 'react-native';

interface BookButtonProps {
	isSubscribed?: boolean;
	isCoach: boolean;
	isAttending: boolean;
	spotsLeft: number;
	isWaitlisted: boolean;
	startDate: string;
	isBookingLocked: boolean;
	waitlistBtn: boolean;
	isBooking: boolean;
	eventId: number;
	handleBook: () => void;
	handleWaitlist: () => void;
	handleViewSession: () => void;
}

const BookButton = ({
	isSubscribed,
	isCoach,
	isAttending,
	spotsLeft,
	isWaitlisted,
	startDate,
	isBookingLocked,
	waitlistBtn,
	isBooking,
	eventId,
	handleBook,
	handleWaitlist,
	handleViewSession,
}: BookButtonProps) => {
	const navigation =
		useNavigation<NavigationProp<ApplicationStackParamList>>();

	const { getClassesByDate, loggedInUser } = useStore(state => ({
		getClassesByDate: state.getClassesByDate,
		loggedInUser: state.loggedInUser,
	}));

	const handleBuyNow = () => {
		const redirectToBuyNow = () => {
			const sessionDate = moment(startDate).format('YYYY-MM-DD');

			navigation.navigate('BuyNow', {
				sessionId: eventId,
				sessionDate,
				onSuccessPurchase: () => {
					handleBook();
					getClassesByDate(sessionDate, loggedInUser!.id, true);
				},
			});
		};

		const hasPaymentDetails = loggedInUser?.user_data.has_payment_details;
		if (hasPaymentDetails !== 'skipped' && !hasPaymentDetails) {
			Alert.alert(
				'Oops!',
				'You need to have payment details to book this class. Do you want to add payment details now?',
				[
					{
						text: 'Yes',
						onPress: () => {
							navigation.navigate('PaymentInformationModal', {
								onSuccessCallback: redirectToBuyNow,
							});
						},
					},
					{ text: 'No', style: 'destructive' },
				],
				{ cancelable: true },
			);
		} else {
			redirectToBuyNow();
		}
	};

	const isAllowed = Func.isSessionWithin72Hours(startDate);

	if (!isSubscribed && !isCoach && !isAttending && isAllowed) {
		const isFull = spotsLeft === 0;
		return (
			<Button
				sm
				compact
				fullWidth
				mode="outlined"
				variant="info"
				title={isFull ? 'Full' : 'Buy'}
				onPress={() => (!isFull ? handleBuyNow() : {})}
			/>
		);
	}

	if (isCoach) {
		return (
			<Button
				sm
				compact
				fullWidth
				title="Coach"
				onPress={handleViewSession}
				mode="contained"
			/>
		);
	}

	if (isAttending) {
		return (
			<Button
				title="Booked"
				onPress={handleViewSession}
				variant="brand"
				sm
				compact
				fullWidth
				mode="contained"
			/>
		);
	}

	if (spotsLeft === null || !isNumber(spotsLeft)) {
		return null;
	}

	if (!isAttending && isWaitlisted) {
		return (
			<Button
				title="Waitlisted"
				variant="brand"
				fullWidth
				compact
				sm
				mode="contained"
			/>
		);
	}

	if (isAttending && !isWaitlisted && spotsLeft > 0 && spotsLeft <= 3) {
		return (
			<Button
				sm
				compact
				fullWidth
				mode="outlined"
				title={`${spotsLeft} ${spotsLeft > 1 ? 'spots' : 'spot'} left`}
				onPress={handleBook}
			/>
		);
	}

	if (!isAttending && !isWaitlisted && spotsLeft === 0) {
		if (waitlistBtn) {
			return (
				<Button
					sm
					compact
					fullWidth
					mode="outlined"
					title="Waitlist"
					onPress={handleWaitlist}
					loading={isBooking}
				/>
			);
		}

		return <Button sm mode="outlined" title="Full" compact fullWidth />;
	}

	if (
		!isBookingLocked &&
		!isAttending &&
		!isWaitlisted &&
		spotsLeft > 0 &&
		isAllowed
	) {
		return (
			<Button
				sm
				compact
				fullWidth
				title="Book"
				mode="outlined"
				onPress={handleBook}
				loading={isBooking}
			/>
		);
	}

	return null;
};

export default memo(BookButton);
