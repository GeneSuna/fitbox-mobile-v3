import { Row, Spacer, Text } from '@/components/atoms';
import { config } from '@/theme/_config';
import { Gym } from '@/types/schemas/gym';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

const { fonts } = config;

type GymItemProps = {
	gym: Gym;
	onPress: () => void;
	right: React.ReactNode;
};

const GymItem = ({ gym, onPress, right }: GymItemProps) => (
	<Row onPress={onPress} style={styles.container} spacing="space-between">
		<Row align="center">
			<View style={styles.iconSize}>
				{!!gym.logo && (
					<Image
						style={styles.iconSize}
						source={{
							uri: gym.logo,
							headers: {
								Pragma: 'no-cache',
							},
						}}
					/>
				)}
			</View>
			<Spacer size="sm" horizontal />
			<Text size="md" bold>
				{gym.name}
			</Text>
		</Row>

		{right}
	</Row>
);

const styles = StyleSheet.create({
	container: {
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderColor: fonts.colors.gray,
		paddingHorizontal: fonts.metrics.lg,
		paddingVertical: fonts.metrics.rg,
		alignItems: 'center',
	},
	iconSize: {
		width: 30,
		height: 30,
	},
});

export default GymItem;
