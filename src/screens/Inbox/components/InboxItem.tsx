import { Avatar, Row, Spacer, Text } from '@/components/atoms';
import { config } from '@/theme/_config';
import layout from '@/theme/layout';
import {
	MessageItemAttachmentType,
	MessageItemType,
	MessageItemUserType,
} from '@/types/schemas/message';
import { Func } from '@/utils';
import { isArray } from 'lodash';
import moment from 'moment';
import { memo } from 'react';
import {
	ImageSourcePropType,
	StyleSheet,
	TouchableOpacity,
	View,
} from 'react-native';
import { Badge } from 'react-native-paper';

const { fonts } = config;

type InboxItemProps = {
	index: number;
	data: MessageItemType;
	onPress: (item: MessageItemType, index: number) => void;
};

const InboxItem = ({ index, data, onPress }: InboxItemProps) => {
	// Prepare list of users in the conversation and filter userId
	let listOfUsers = data.user_list;

	// Prepare sender info
	let senderInfo =
		listOfUsers.find(user => user.id === data.sender_id) ||
		(listOfUsers[0] as MessageItemUserType);

	// If there are more than 1 user in the conversation, filter out the current user
	// This is to prevent from showing undefined in the display name if there is an issue with the users list
	if (listOfUsers && listOfUsers.length > 1) {
		listOfUsers = data.user_list.filter(user => user.id !== data.userId);
	}

	// if sender id is current user, use the other user in the list
	if (data.sender_id === data.userId) {
		senderInfo = listOfUsers[0] as MessageItemUserType;
	}

	// Prepare message
	let { message } = data;
	if (message === '') {
		const attachedFiles =
			data.attached_files as MessageItemAttachmentType[];

		let attachments:
			| MessageItemAttachmentType[]
			| MessageItemAttachmentType = attachedFiles;

		if (
			typeof attachedFiles.length === 'undefined' &&
			Object.keys(attachedFiles).length > 0
		) {
			attachments = Object.values(
				attachedFiles,
			)[0] as MessageItemAttachmentType;
		}

		if (isArray(attachments) && attachments.length > 0) {
			if (attachments[0]?.type === 'image') message = 'Sent an image';
			else if (attachments[0]?.type === 'video') message = 'Sent a video';
			else message = 'Sent a file';
		}
	}

	// Prepare display name
	const displayName = `${senderInfo?.firstname} ${senderInfo?.lastname}`;

	// Prepare others number
	const othersNumber =
		listOfUsers.length > 1 ? ` and ${listOfUsers.length - 1} others` : '';

	return (
		<View style={{ backgroundColor: fonts.colors.light }}>
			<TouchableOpacity onPress={() => onPress(data, index)}>
				<Row style={styles.itemStyle}>
					<View>
						<Avatar
							source={data.profile_image as ImageSourcePropType}
							size={60}
						/>
						{data.num_of_unread_messages > 0 && (
							<Badge
								size={fonts.metrics.md}
								style={styles.badgeStyle}
							/>
						)}
					</View>
					<Spacer horizontal size="sm" />
					<View style={layout.flex_1}>
						<Row spacing="space-between">
							<View style={styles.nameContainerStyle}>
								<Text size="md" numberOfLines={1}>
									{displayName + othersNumber}
								</Text>
							</View>
							<Text size="xs" color="mute">
								{moment(data.created_at).format('DD MMM')}
							</Text>
						</Row>
						<Text size="md" bold numberOfLines={1}>
							{data.subject}
						</Text>
						<Text color="mute" numberOfLines={2}>
							{Func.stripHtmlTags('testing')}
						</Text>
						<Spacer size="sm" />
					</View>
				</Row>
			</TouchableOpacity>
		</View>
	);
};

export default memo(InboxItem);

const styles = StyleSheet.create({
	itemStyle: {
		paddingHorizontal: fonts.metrics.md,
		paddingVertical: fonts.metrics.sm,
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderColor: fonts.colors.gray,
	},
	badgeStyle: {
		position: 'absolute',
		right: 2,
		top: 2,
		backgroundColor: fonts.colors.info,
	},
	nameContainerStyle: {
		flex: 1,
		marginRight: fonts.metrics.sm,
	},
});
