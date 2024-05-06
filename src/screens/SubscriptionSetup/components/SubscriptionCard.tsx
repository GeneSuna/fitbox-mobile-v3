import { Row, Spacer, Text } from '@/components/atoms';
import { config } from '@/theme/_config';
import {
	SubscriptionType,
	UserSubscriptionProductsType,
} from '@/types/schemas/subscription';
import { isNull } from 'lodash';
import { StyleSheet, View } from 'react-native';

const SubscriptionCard = ({
	data,
}: {
	data: SubscriptionType | UserSubscriptionProductsType;
}) => {
	// Prepare fees
	const monthlyFee = data.price_in_cents / 100; // monthly fee
	const setupFee =
		data.set_up_price_in_cents / 100 + data.trial_price_in_cents / 100; // setup fee + trial fee

	// Prepare frequency
	const recurringInterval =
		data.recurring_interval > 1 ? ` ${data.recurring_interval} ` : ' ';
	const billingFrequency = `Every${recurringInterval}${
		data.recurring_interval_unit
	}${data.recurring_interval > 1 ? 's' : ''}`;

	return (
		<View style={styles.mainContainer}>
			<Text size="lg" center style={styles.headerStyle}>
				{data.name}
			</Text>
			{data.description ? (
				<Text
					size="sm"
					color="darkgray"
					center
					style={styles.headerStyle}
				>
					{data.description}
				</Text>
			) : null}

			<Spacer size="rg" />

			<View style={styles.detailsContainer}>
				<Row spacing="space-between">
					<Text size="rg" style={styles.fontAlata}>
						Initial:
					</Text>
					<Text size="rg" color="success" style={styles.fontAlata}>
						{setupFee > 0 ? `$${setupFee}` : 'Free'}
					</Text>
				</Row>

				{monthlyFee > 0 && (
					<Row
						spacing="space-between"
						style={styles.monthlyFeeContainer}
					>
						<Text size="rg" style={styles.fontAlata}>
							Ongoing:
						</Text>
						<Text
							size="rg"
							color="darkgray"
							style={styles.fontAlata}
						>
							${monthlyFee} ({billingFrequency})
						</Text>
					</Row>
				)}

				{!isNull(data.sessions_limit) &&
					!isNull(data.sessions_limit_frequency) && (
						<Row spacing="space-between">
							<Text size="rg" style={styles.fontAlata}>
								Session:
							</Text>
							<Text
								size="rg"
								color="darkgray"
								style={styles.fontAlata}
							>
								{data.sessions_limit} /{' '}
								{data.sessions_limit_frequency}
							</Text>
						</Row>
					)}
			</View>
		</View>
	);
};

export default SubscriptionCard;

const styles = StyleSheet.create({
	mainContainer: {
		borderBottomWidth: 2,
		paddingVertical: config.metrics.md,
		borderColor: config.borders.colors.darkgray,
		alignItems: 'center',
	},
	detailsContainer: {
		width: '70%',
	},
	headerStyle: {
		width: '70%',
		alignSelf: 'center',
		fontFamily: 'Alata-Regular',
	},
	monthlyFeeContainer: {
		alignItems: 'flex-start',
		marginBottom: config.metrics.lg,
	},
	fontAlata: {
		fontFamily: 'Alata-Regular',
	},
});
