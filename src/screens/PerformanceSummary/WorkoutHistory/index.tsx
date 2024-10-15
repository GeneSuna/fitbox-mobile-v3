import { Row, Text } from '@/components/atoms';
import { ScoreComponent } from '@/components/molecules';
import { config } from '@/theme/_config';
import layout from '@/theme/layout';
import { PerformanceSummaryParamList } from '@/types/navigation';
import { StackScreenProps } from '@react-navigation/stack';
import { StyleSheet, View } from 'react-native';

type WorkoutHistoryProps = StackScreenProps<
	PerformanceSummaryParamList,
	'WorkoutHistory'
>;

const WorkoutHistory = ({ route }: WorkoutHistoryProps) => {
	// const { isKeyboardVisible } = useKeyboardVisibility();

	const { data } = route.params;
	// const [sheetIndex, setSheetIndex] = useState<number>(addResult ? 0 : 1);

	// const sheetRef = useRef<BottomSheet>(null);

	return (
		<View style={layout.flex_1}>
			<Row
				spacing="space-between"
				align="center"
				style={styles.headerContainer}
			>
				<View style={layout.flex_1}>
					<Text size="md" bold>
						{data.name}
					</Text>
				</View>

				{/* <View style={layout.flex_1}>
						<Row
							onPress={toggleDatePicker}
							align="center"
							spacing="flex-end"
						>
							<Spacer size="sm" horizontal />
							<Text size="md" color="info">
								{!moment(dateInput).isSame(moment(), 'day')
									? moment(dateInput).format('MMMM DD, YYYY')
									: 'Today'}
							</Text>
							<Spacer size="sm" horizontal />
							<Icon
								name="calendar"
								size={config.fonts.metrics.md}
								color={config.fonts.colors.info}
							/>
						</Row>
					</View> */}
			</Row>
			<ScoreComponent
				// onSubmitCallback={() => void fetchDetails()}
				section={data.section_wod}
				independentScoring
				editMode={false}
				wod_id={data.id}
			/>

			{/* 
			{!isKeyboardVisible && (
				<WorkoutHistoryBS
					sheetRef={sheetRef}
					sheetIndex={sheetIndex}
					movements={movements}
					setSheetIndex={setSheetIndex}
					movementName={name}
					oneRm={oneRm || 0}
					bottomOffset={bottomSheetSpacing}
					isLoading={isLoading}
				/>
			)} */}
		</View>
	);
};

export default WorkoutHistory;

const styles = StyleSheet.create({
	headerContainer: {
		paddingHorizontal: config.metrics.lg,
		paddingVertical: config.metrics.md,
		borderBottomWidth: 0.5,
		borderColor: '#eee',
	},
});
