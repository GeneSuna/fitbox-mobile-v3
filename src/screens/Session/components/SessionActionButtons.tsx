import { Button, Row } from '@/components/atoms';
import layout from '@/theme/layout';
import { Say } from '@/utils';
import useStore from '@/zustand/Store';
import moment from 'moment';
import { memo, useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface SessionActionButtonsProps {
	eventId: number;
	subscribed: boolean;
	isAttending: boolean;
	spotsLeft: number;
	isWaitlist: boolean;
	islocked: boolean;
	startTime: moment.Moment;
	waitlistEnabled: boolean;
	waitlistTime: number;
	isBookingLocked: boolean;
}

const SessionActionButtons = ({
	eventId,
	subscribed,
	isAttending: propsIsAttending,
	spotsLeft,
	isWaitlist,
	islocked,
	startTime,
	waitlistEnabled,
	waitlistTime,
	isBookingLocked,
}: SessionActionButtonsProps) => {
	const loggedInUser = useStore(state => state.loggedInUser);

	const [isWaitlisting, setWaitlisting] = useState<boolean>(false);
	const [isBooking, setBooking] = useState<boolean>(false);
	const [isAttending, setAttending] = useState<boolean>(propsIsAttending);

	const currentTime = moment();

	// TODO: Temporary console.log, remove when done
	// eslint-disable-next-line no-console
	console.log('currentTime', {
		loggedInUser,
		setAttending,
		setWaitlisting,
		currentTime,
		eventId,
		startTime,
		waitlistTime,
		isBookingLocked,
	});

	const handleBook = () => {
		setBooking(true);

		// TODO: for booking modal this.toggleProcessingMember(currentUserId);

		if (!isBooking) {
			Say.ok('Coming soon!');
			// try {
			// 	const payload = {
			// 		event_id: eventId,
			// 		is_attend: !isAttending,
			// 	};

			// 	const res = await RestService.attendSession(payload);
			// 	const data = await res.json();
			// 	if (data.error) {
			// 		if (data?.error_code === 'AB001') {
			// 			// Show alert if user is already booked for this
			// 			Toast.show('You are already booked for this ');

			// 			// refresh calendar to update booked s on calendar
			// 			this.props.refreshCalendar(true);

			// 			// trigger refresh for this screen
			// 			this.onRefresh();
			// 		} else {
			// 			Say.warn(data.message.replace('box', 'gym'));
			// 			this.props.navigation.pop();
			// 		}
			// 	} else {
			// 		isAttending = !isAttending;

			// 		const userDetails = {
			// 			user: {
			// 				id: currentUserId,
			// 				firstname: this.state.userFirstname,
			// 				lastname: this.state.userLastname,
			// 				profile_image: this.state.userImage,
			// 			},
			// 			user_id: currentUserId,
			// 		};

			// 		if (isAttending) {
			// 			// add user to booked members
			// 			bookedMembers.push({
			// 				...userDetails,
			// 				attendance: {
			// 					// add attendance status
			// 					status: 'booked',
			// 				},
			// 			});

			// 			// remove user from not booked members
			// 			notBookedMembers = notBookedMembers.filter(
			// 				member => member.user_id !== currentUserId,
			// 			);

			// 			// show toast
			// 			Toast.show('You have successfully booked this session');
			// 		} else {
			// 			// remove user from booked members
			// 			bookedMembers = bookedMembers.filter(
			// 				member => member.user_id !== currentUserId,
			// 			);

			// 			// add user to not booked members
			// 			notBookedMembers.push(userDetails);

			// 			// show toast
			// 			Toast.show(
			// 				'You have successfully unbooked this session',
			// 			);
			// 		}

			// 		this.handleRefreshCalendar();
			// 	}
			// } catch (err) {
			// 	Say.err(err);
			// } finally {
			// 	this.setState({
			// 		isBooking: false,
			// 		bookedMembers,
			// 		notBookedMembers,
			// 	});

			// 	this.toggleProcessingMember(currentUserId);
			// }
		}
	};

	const handleWaitlist = () => {
		// handle waitlist
	};

	const renderLeftButton = useCallback(() => {
		if (isAttending) {
			return <Button sm mode="outlined" title="Session Booked" />;
		}

		if (isWaitlist) {
			return <Button sm mode="outlined" title="Waitlisted" />;
		}

		if (spotsLeft === 0) {
			return <Button sm mode="outlined" title="Session Full" />;
		}

		if (spotsLeft <= 3 && spotsLeft > 0) {
			return (
				<Button
					sm
					mode="outlined"
					title={`${spotsLeft} ${
						spotsLeft > 1 ? 'spots' : 'spot'
					} left`}
				/>
			);
		}

		return null;
	}, [isAttending, isWaitlist, spotsLeft]);

	const renderRightButton = useCallback(() => {
		if (islocked) {
			return (
				<Button sm mode="outlined" title="Booking Locked" disabled />
			);
		}

		if (isAttending) {
			return (
				<Button
					sm
					title="Unbook"
					onPress={handleBook}
					loading={isBooking}
				/>
			);
		}

		if (isWaitlist) {
			return (
				<Button
					sm
					title="Cancel"
					onPress={handleWaitlist}
					loading={isWaitlisting}
				/>
			);
		}

		if (spotsLeft === 0 && waitlistEnabled) {
			return (
				<Button
					sm
					title="Join Waitlist"
					onPress={handleWaitlist}
					loading={isWaitlisting}
				/>
			);
		}

		if (spotsLeft > 0) {
			return (
				<Button
					sm
					title="Book"
					onPress={handleBook}
					loading={isBooking}
				/>
			);
		}

		return null;
	}, [islocked, isAttending, isWaitlist, spotsLeft, waitlistEnabled]);

	return !subscribed ? (
		<Text style={[styles.warningTxt, styles.container]}>
			This class is not included in your Subscription, talk to your Gym
			about upgrading to Book.
		</Text>
	) : (
		<Row spacing="space-around" style={styles.container}>
			<View style={layout.flex_1}>{renderLeftButton()}</View>
			<View style={layout.flex_1}>{renderRightButton()}</View>
		</Row>
	);
};

export default memo(SessionActionButtons);

const styles = StyleSheet.create({
	container: {
		borderBottomWidth: 0.5,
		borderColor: '#ccc',
		paddingHorizontal: 15,
		paddingVertical: 12,
		gap: 10,
	},
	warningTxt: {
		color: '#595959',
		textAlign: 'center',
		fontSize: 16,
	},
});
