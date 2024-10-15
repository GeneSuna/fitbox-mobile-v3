import { Row, Spacer, Text } from '@/components/atoms';
import { Loader } from '@/components/molecules';
import OneRMComponent from '@/components/molecules/WODPastPerformance/components/OneRMComponent';
import ScoreDisplayFormat from '@/components/molecules/WODPastPerformance/components/ScoreDisplayFormat';
import { config } from '@/theme/_config';
import layout from '@/theme/layout';
import { PastPerformanceResultType } from '@/types/schemas/leaderboards';
import BottomSheet, {
	BottomSheetScrollView,
	BottomSheetView,
	TouchableOpacity,
} from '@gorhom/bottom-sheet';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import moment from 'moment';
import { Dispatch, RefObject, SetStateAction } from 'react';
import { StyleSheet, View } from 'react-native';
import SimpleToast from 'react-native-simple-toast';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface WorkoutHistoryBSProps {
	movements: PastPerformanceResultType[];
	sheetRef: RefObject<BottomSheetMethods>;
	sheetIndex: number;
	setSheetIndex: Dispatch<SetStateAction<number>>;
	movementName: string;
	oneRm: number;
	bottomOffset: number;
	isLoading: boolean;
}

const WorkoutHistoryBS = ({
	sheetRef,
	sheetIndex,
	setSheetIndex,
	movements,
	movementName,
	oneRm,
	bottomOffset,
	isLoading,
}: WorkoutHistoryBSProps) => {
	const renderMovements = () => {
		return movements.length ? (
			movements.map((data, i) => {
				return (
					<TouchableOpacity
						key={i}
						onPress={() =>
							SimpleToast.show(
								'Edit Score Coming Soon!',
								SimpleToast.SHORT,
							)
						}
						activeOpacity={0.9}
					>
						<Row
							spacing="space-between"
							style={{
								...styles.movementInfo,
								...(data.wod_score_id == null
									? layout.shadowMedium
									: null),
							}}
						>
							<View style={layout.flex_1}>
								<ScoreDisplayFormat data={data} />

								{data.notes !== '' && (
									<Text
										size="rg"
										color="darkgray"
										style={{
											marginTop: config.metrics.sm,
										}}
									>
										{data.notes}
									</Text>
								)}
							</View>

							<Spacer horizontal size="sm" />

							<Text size="rg" color="darkgray">
								{moment(data.date_input).format('DD MMM YYYY')}
							</Text>
						</Row>
					</TouchableOpacity>
				);
			})
		) : (
			<Text size="md" color="mute" center>
				No movement record yet
			</Text>
		);
	};

	const isSheetOpened = sheetIndex === 1;
	return (
		<BottomSheet
			ref={sheetRef}
			index={sheetIndex}
			snapPoints={[bottomOffset, '100%']}
			onChange={setSheetIndex}
			handleComponent={null}
			backgroundStyle={styles.bottomSheetContainer}
			enableContentPanningGesture={!isSheetOpened}
			enableDynamicSizing={false}
		>
			<BottomSheetView style={layout.flex_1}>
				<Row
					align="center"
					spacing="space-between"
					style={{ paddingHorizontal: config.metrics.md }}
				>
					<Text
						size="md"
						bold
						style={{ marginVertical: config.fonts.metrics.md }}
					>
						{isSheetOpened ? movementName : 'History'}
					</Text>

					<Row
						align="center"
						onPress={() =>
							sheetRef.current?.snapToIndex(isSheetOpened ? 0 : 1)
						}
					>
						{isSheetOpened ? (
							<Icon
								name="plus"
								size={20}
								color={config.fonts.colors.info}
							/>
						) : (
							<Icon
								name="chevron-up"
								size={20}
								color={config.fonts.colors.info}
							/>
						)}
						<Text size="md" color="info">
							{isSheetOpened ? 'Add' : 'View Scores'}
						</Text>
					</Row>
				</Row>

				<BottomSheetScrollView>
					{oneRm ? <OneRMComponent weight={oneRm} /> : null}
					{renderMovements()}
				</BottomSheetScrollView>

				{isLoading ? (
					<View style={styles.loaderContainer}>
						<Loader size={config.metrics.xl} />
					</View>
				) : null}
			</BottomSheetView>
		</BottomSheet>
	);
};

export default WorkoutHistoryBS;

const styles = StyleSheet.create({
	movementInfo: {
		marginTop: config.metrics.sm,
		marginBottom: config.metrics.md,
		marginHorizontal: 5,
		borderRadius: 4,
		paddingHorizontal: 8,
		paddingVertical: 5,
	},
	bottomSheetContainer: {
		borderRadius: 0,
		borderTopWidth: 1,
		borderColor: config.fonts.colors.gray200,
	},
	loaderContainer: {
		position: 'absolute',
		bottom: config.metrics.lg,
		left: 0,
		right: 0,
		top: 0,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
