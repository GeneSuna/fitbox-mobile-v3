import useAuth from '@/auth/hooks/useAuth';
import { Text } from '@/components/atoms';
import HeaderButtonGroup from '@/components/template/Header/HeaderButtonGroup';
import { ConversationParams, InboxScreenProps } from '@/types/navigation';
import { Say } from '@/utils';
import { sortBy } from 'lodash';
import { useLayoutEffect } from 'react';
import { View } from 'react-native';
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons';

const ConversationScreen = ({ route, navigation }: InboxScreenProps) => {
	const { conversation } = route.params as ConversationParams;
	const { user } = useAuth();

	const renderInfoButton = () => {
		return (
			<HeaderButtonGroup>
				<Ionicons
					name="information-outline"
					onPress={toggleViewUsers}
					size={24}
					color="white"
				/>
			</HeaderButtonGroup>
		);
	};

	const toggleViewUsers = () => {
		const usersList = conversation.user_list.map(
			userData => `${userData.firstname} ${userData.lastname}`,
		);
		const message = sortBy(usersList).join('\n');
		Say.ok(message, 'List of users');
	};

	useLayoutEffect(() => {
		let users = conversation.user_list;

		if (users.length > 1) {
			users = users.filter(
				userData => userData.id !== user?.user_data.user_id,
			);
		}

		let screenTitle = `${users[0]?.firstname as string} ${
			users[0]?.lastname as string
		}`;

		if (users.length > 1) {
			screenTitle += ` and ${users.length - 1} others `;
		}

		navigation.setOptions({
			title: screenTitle,
			headerRight: renderInfoButton,
		});
	}, []);

	return (
		<View>
			<Text>Conversation Screen</Text>
		</View>
	);
};

export default ConversationScreen;
