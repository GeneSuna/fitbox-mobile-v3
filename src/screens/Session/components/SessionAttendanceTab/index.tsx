import { Button } from '@/components/atoms';
import { FlatList } from '@/components/molecules';
import { config } from '@/theme/_config';
import { ApplicationStackParamList } from '@/types/navigation';
import {
	SessionDetailSchemaType,
	SessionMemberAttendanceSchemaType,
} from '@/types/schemas/session';
import useStore from '@/zustand/Store';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { sortBy } from 'lodash';
import { useCallback } from 'react';
import AttendanceItem from './components/AttendanceItem';

const { metrics } = config;

interface SessionAttendanceTabProps {
	session: SessionDetailSchemaType;
}
const SessionAttendanceTab = ({ session }: SessionAttendanceTabProps) => {
	const navigation =
		useNavigation<NavigationProp<ApplicationStackParamList>>();
	const loggedInUser = useStore(state => state.loggedInUser);
	const isStaff = loggedInUser?.user_data.is_staff;
	const bookedMembers = session?.member_attendance ?? [];
	const attendanceLimit = Number(session?.attendance_limit);

	// TODO: For adding/removing attendance (Staff only)
	// const [processingMembers, setProcessingMembers] = useState<number[]>([]);
	const toggleAttendanceModal = () =>
		navigation.navigate('AddAttendance', { session });

	// TODO: Check-in User
	// const handleCheckInUser = async userId => {
	// 	const { processingMembers, checkedInMembers, bookedMembers } =
	// 		this.state;

	// 	// check if user is already in processingMembers
	// 	if (processingMembers.length > 0) {
	// 		Say.warn('Please wait while we are processing your request');
	// 		return;
	// 	}

	// 	// add user to processingMembers
	// 	this.toggleProcessingMember(userId);

	// 	const findUser = bookedMembers.find(
	// 		member => member.user_id === userId,
	// 	);
	// 	const userStatus =
	// 		findUser.attendance?.status === 'checked-in' ||
	// 		isNil(findUser.attendance?.status)
	// 			? 'booked'
	// 			: 'checked-in';

	// 	// Prepare payload
	// 	const payload = {
	// 		user_id: userId,
	// 		event_id: this.state.event_id,
	// 		status: userStatus,
	// 	};

	// 	const res = await RestService.updateAttendance(payload);
	// 	if (!res.error) {
	// 		// if check in success

	// 		// find member in bookedMembers and update status
	// 		const newBookedMembers = bookedMembers.map(member => {
	// 			if (member.user_id === userId) {
	// 				// update status
	// 				member.attendance = {
	// 					...member.attendance,
	// 					status: userStatus,
	// 				};
	// 			}
	// 			return member;
	// 		});

	// 		// set state
	// 		this.setState({ bookedMembers: newBookedMembers });

	// 		const userCheckedIn = userStatus === 'checked-in';
	// 		Toast.show(
	// 			userCheckedIn
	// 				? `Successfully checked in user`
	// 				: `Moved user to 'booked'`,
	// 			Toast.SHORT,
	// 		);
	// 	} else {
	// 		// Show error message
	// 		Toast.show(
	// 			'Failed to check in user: ' + String(res?.message),
	// 			Toast.SHORT,
	// 		);
	// 	}

	// 	// remove user from processingMembers
	// 	this.toggleProcessingMember(userId);
	// };

	// Determine if the add button should be shown
	const showAddButton =
		(bookedMembers.length < attendanceLimit || attendanceLimit === null) &&
		isStaff;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const renderItem = useCallback(({ item }: any) => {
		const { user, user_id: userId } =
			item as SessionMemberAttendanceSchemaType;

		return (
			<AttendanceItem
				id={userId}
				avatar={user.profile_image}
				name={`${user.firstname} ${user.lastname}`}
			/>
		);
	}, []);

	const StickyHeaderComponent = (
		<Button
			variant="darkgray"
			mode="outlined"
			title="+ Add Attendance"
			onPress={toggleAttendanceModal}
			style={{
				marginBottom: metrics.md,
				marginHorizontal: metrics.lg,
			}}
		/>
	);

	// Extract the key for each item
	const keyExtractor = (item: SessionMemberAttendanceSchemaType) =>
		item.user_id.toString();

	return (
		<FlatList
			data={sortBy(bookedMembers, 'user_data.first_name')}
			renderItem={renderItem}
			extractor={keyExtractor}
			ListHeaderComponent={showAddButton ? StickyHeaderComponent : null}
		/>
	);
};

export default SessionAttendanceTab;
