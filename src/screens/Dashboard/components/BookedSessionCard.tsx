import { Button, Row, Spacer, Text } from '@/components/atoms';
import { config } from '@/theme/_config';
import layout from '@/theme/layout';
import { ParsedSessionSchemaType } from '@/types/schemas/session';
import moment from 'moment';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

const { metrics, fonts } = config;

interface BookedSessionCardProps {
	data: ParsedSessionSchemaType;
	onPress: () => void;
}

const BookedSessionCard = ({ data, onPress }: BookedSessionCardProps) => {
	return (
		<TouchableOpacity style={styles.container} onPress={onPress}>
			<Row style={layout.flex_1}>
				<View style={layout.justifyCenter}>
					<Text bold size="sm" color="mute" center>
						{moment(data.start_time).format('DD MMM')}
					</Text>
					<Text size="sm" color="mute" center>
						{moment(data.start_time).format('ddd')}
					</Text>
				</View>

				<Spacer horizontal />

				<View style={layout.flex_1}>
					<Text bold size="md" numberOfLines={2}>
						{data.name}
					</Text>
					{data.event && (
						<Text size="sm">
							{moment(data.start_time).format('h:mmA')} -{' '}
							{moment(data.end_time).format('h:mmA')}
						</Text>
					)}
				</View>
			</Row>

			<Spacer horizontal size="xs" />

			{data.is_attend && (
				<Button
					sm
					title="View"
					style={styles.btnOutline}
					uppercase={false}
					onPress={onPress}
				/>
			)}
		</TouchableOpacity>
	);
};

export default BookedSessionCard;

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		borderColor: '#F2F2F2',
		borderWidth: 1,
		borderRadius: metrics.sm,
		paddingVertical: metrics.rg,
		paddingHorizontal: metrics.rg,
		marginBottom: metrics.md,
		alignItems: 'center',
		...layout.shadowLight,
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
