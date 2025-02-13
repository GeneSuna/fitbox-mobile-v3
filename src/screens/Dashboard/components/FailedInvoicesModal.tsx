import { Row, Text } from '@/components/atoms';
import { navigate } from '@/navigators/NavigationRef';
import { config } from '@/theme/_config';
import layout from '@/theme/layout';
import { FailedInvoicesType } from '@/types/schemas/payment';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const FailedInvoicesModal = ({
	failedInvoices,
	setShowFailedInvoicesModal,
}: {
	failedInvoices: FailedInvoicesType;
	setShowFailedInvoicesModal: (value: boolean) => void;
}) => {
	const onPressModal = () => {
		navigate('FailedInvoices', { failedInvoices });
	};

	const multipleInvoices = failedInvoices?.invoices?.length > 1;

	return (
		<TouchableOpacity style={styles.containerStyle} onPress={onPressModal}>
			<Row>
				<View style={styles.warningIconCon}>
					<MIcon
						name="alert-octagon"
						color={config.colors.danger}
						size={35}
					/>
				</View>

				<View style={styles.warningMessageCon}>
					<Text bold size="md">
						{`You have ${failedInvoices.invoices.length} overdue ${multipleInvoices ? 'invoices' : 'invoice'}.`}
					</Text>
					<Text
						size="xs"
						numberOfLines={2}
						style={{ marginTop: config.metrics.xs }}
					>
						Click to view
					</Text>
				</View>
				<View style={styles.closeIconCon}>
					<TouchableOpacity
						onPress={() => setShowFailedInvoicesModal(false)}
					>
						<MIcon
							name="close"
							size={15}
							color={config.backgrounds.darkgray}
						/>
					</TouchableOpacity>
				</View>
			</Row>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	containerStyle: {
		minHeight: 50,
		borderRadius: 4,
		position: 'absolute',
		bottom: 18,
		width: '91%',
		marginHorizontal: 18,
		alignSelf: 'center',
		...layout.shadowLight,
		paddingVertical: 4,
	},
	warningIconCon: {
		justifyContent: 'center',
		height: 50,
		paddingLeft: 10,
		paddingRight: 5,
	},
	warningMessageCon: {
		width: '80%',
		justifyContent: 'center',
	},
	closeIconCon: {
		// marginLeft: 2,
		// marginTop: 3,
	},
});

export default FailedInvoicesModal;
