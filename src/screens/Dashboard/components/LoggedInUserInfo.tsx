import { Text } from '@/components/atoms';
import useSwitchableUsers from '@/hooks/useSwitchableUsers';
import { config } from '@/theme/_config';
import layout from '@/theme/layout';
import useStore from '@/zustand/Store';
import { StyleSheet, View } from 'react-native';

const LoggedInUserInfo = () => {
	const { fromParent } = useSwitchableUsers();
	const user = useStore(s => s.loggedInUser);

	if (!fromParent || !user) return null;

	return (
		<View style={styles.containerStyle}>
			<Text center style={{ padding: config.metrics.sm }}>
				Logged in as{' '}
				<Text color="brand" bold>
					{`${user?.user_data.first_name} ${user?.user_data.last_name}`}
				</Text>
			</Text>
		</View>
	);
};

export default LoggedInUserInfo;

const styles = StyleSheet.create({
	containerStyle: {
		borderTopWidth: StyleSheet.hairlineWidth,
		borderColor: config.fonts.colors.gray50,
		...layout.shadowLight,
	},
});
