import { Row, Text } from '@/components/atoms';
import { config } from '@/theme/_config';
import layout from '@/theme/layout';
import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Switch } from 'react-native-paper';

interface ScoreHeaderProps {
	title: string;
	hideRxSwitch: boolean;
	isRx: boolean;
	onRxChange: (val: boolean) => void;
}

const ScoreHeader = ({
	title,
	hideRxSwitch,
	isRx,
	onRxChange,
}: ScoreHeaderProps) => {
	return (
		<View style={styles.titleContainer}>
			<Text size="xl" bold style={layout.flex_1}>
				{title}
			</Text>

			{!hideRxSwitch && (
				<Row style={[layout.itemsCenter]}>
					<Switch
						color={config.fonts.colors.brand}
						value={isRx}
						onValueChange={val => {
							onRxChange(val);
						}}
						style={styles.switch}
					/>
					<Text size="xl" bold color="darkgray">
						Rx
					</Text>
				</Row>
			)}
		</View>
	);
};

export default memo(ScoreHeader);

const styles = StyleSheet.create({
	titleContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: config.metrics.rg,
	},
	switch: {
		transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }],
	},
});
