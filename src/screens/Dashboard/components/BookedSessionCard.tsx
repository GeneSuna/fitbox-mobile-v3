import { Row, Spacer, Text } from '@/components/atoms';
import { config } from '@/theme/_config';
import layout from '@/theme/layout';
import moment from 'moment';
import { memo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { metrics, fonts } = config;

export interface BookedSessionCardProps {
	startTime: string;
	endTime: string;
	title: string;
	venue?: string;
	isCoach: boolean;
	onPress?: () => void;
}

const BookedSessionCard = ({
	startTime,
	endTime,
	title,
	venue,
	isCoach,
	onPress,
}: BookedSessionCardProps) => {
	return (
		<TouchableOpacity style={styles.container} onPress={onPress}>
			<Row style={layout.flex_1}>
				<View style={layout.justifyCenter}>
					<Text bold size="sm" color="mute" center>
						{moment(startTime).format('DD MMM')}
					</Text>
					<Text size="sm" color="mute" center>
						{moment(startTime).format('ddd')}
					</Text>
				</View>

				<Spacer horizontal />

				<View style={layout.flex_1}>
					<Text bold size="md" numberOfLines={2}>
						{title}
					</Text>

					{venue ? (
						<Text bold color="info" size="rg">
							{venue}
						</Text>
					) : null}

					<Text size="sm">
						{moment(startTime).format('h:mmA')} -{' '}
						{moment(endTime).format('h:mmA')}
					</Text>
				</View>
			</Row>

			<Spacer horizontal size="xs" />

			<Icon
				name={isCoach ? 'account-arrow-right' : 'arrow-right'}
				color={isCoach ? fonts.colors.info : fonts.colors.gray200}
				size={fonts.metrics.lg}
				style={{ marginRight: metrics.sm }}
			/>
		</TouchableOpacity>
	);
};

export default memo(BookedSessionCard);

BookedSessionCard.defaultProps = {
	venue: undefined,
	onPress: undefined,
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: fonts.colors.light,
		flexDirection: 'row',
		paddingVertical: metrics.rg,
		paddingHorizontal: metrics.rg,
		alignItems: 'center',
	},
	warningTxt: {
		color: '#595959',
		textAlign: 'center',
		maxWidth: 100,
	},
	btnOutline: {
		borderColor: fonts.colors.darkgray,
		borderWidth: 1,
		width: 'auto',
	},
});
