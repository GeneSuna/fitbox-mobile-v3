/* eslint-disable no-console */
/**
 * TODO: Temporary Tab Buttons for Session Screen
 * Continue to implement this tabs
 */

import { Row, Spacer, Text } from '@/components/atoms';
import { config } from '@/theme/_config';
import layout from '@/theme/layout';
import { memo, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import Icon1 from 'react-native-vector-icons/FontAwesome5';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const { metrics } = config;

const SessionTabButtons = () => {
	const [activeTab, setActiveTab] = useState<number>(0);
	const subscribed = true;
	const isLimited = false;
	const hasLeaderboard = true;
	const allowLeaderboards = true;
	const isStaff = true;
	const attendanceView = true;
	const bookedMembers = [];
	const session = {
		attendance_limit: 10,
	};

	const onChangeTab = (tab: number) => {
		console.log('onChangeTab', tab);
	};

	const showLeaderBoardButton = (s: unknown) => {
		setActiveTab(0);

		console.log('showLeaderBoardButton', s);
	};

	return (
		<View style={styles.container}>
			<TouchableOpacity
				onPress={() => {
					onChangeTab(0);
				}}
				style={[layout.flex_1, layout.itemsCenter]}
			>
				<Icon
					name="info-circle"
					color={activeTab === 0 ? '#595959' : '#C4C4C4'}
					size={25}
				/>
			</TouchableOpacity>
			{subscribed && !isLimited ? (
				<TouchableOpacity
					onPress={() => {
						onChangeTab(1);
					}}
					style={[layout.flex_1, layout.itemsCenter]}
				>
					<Icon1
						name="dumbbell"
						color={activeTab === 1 ? '#595959' : '#C4C4C4'}
						size={25}
					/>
				</TouchableOpacity>
			) : null}
			{hasLeaderboard && (allowLeaderboards || isStaff) ? (
				<TouchableOpacity
					onPress={() => showLeaderBoardButton(session)}
					style={[layout.flex_1, layout.itemsCenter]}
				>
					<MIcon name="trophy" size={25} color="#C4C4C4" />
				</TouchableOpacity>
			) : null}
			{(attendanceView && !isLimited) || isStaff ? (
				<TouchableOpacity
					onPress={() => {
						onChangeTab(2);
					}}
					style={[layout.flex_1, layout.itemsCenter]}
				>
					<Icon
						name="user-circle"
						color={activeTab === 2 ? '#595959' : '#C4C4C4'}
						size={25}
					/>

					<Row style={{ marginTop: metrics.sm }}>
						<Text color="darkgray" size="lg" bold>
							{bookedMembers.length}
						</Text>
						<Spacer size="xs" horizontal />
						<Text color="darkgray" size="lg" bold>
							/
						</Text>
						<Spacer size="xs" horizontal />
						{session.attendance_limit != null ? (
							<Text color="darkgray" size="lg" bold>
								{session.attendance_limit}
							</Text>
						) : (
							<Text color="darkgray" size="lg" bold>
								&#8734;
							</Text>
						)}
					</Row>
				</TouchableOpacity>
			) : null}
		</View>
	);
};

export default memo(SessionTabButtons);

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		paddingHorizontal: 20,
		paddingVertical: 15,
	},
});
