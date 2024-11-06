import { Text } from '@/components/atoms';
import { ScoreComponent } from '@/components/molecules';
import WODPastPerformance from '@/components/molecules/WODPastPerformance/WODPastPerformance';
import useKeyboardVisibility from '@/hooks/useKeyboardVisibility';
import { goBack } from '@/navigators/NavigationRef';
import { getPastPerformance } from '@/services/users';
import { config } from '@/theme/_config';
import layout from '@/theme/layout';
import { ApplicationScreenProps, ScoringParams } from '@/types/navigation';
import BottomSheet, {
	BottomSheetBackdrop,
	BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';
import { useFocusEffect } from '@react-navigation/native';
import { JSX, useCallback, useEffect, useMemo, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import SimpleToast from 'react-native-simple-toast';

const { fonts } = config;

const bottomSheetSpacing = Dimensions.get('window').height * 0.3;

const SessionScoringScreen = ({ route }: ApplicationScreenProps) => {
	const { section, sessionId } = route.params as ScoringParams;
	const { isKeyboardVisible } = useKeyboardVisibility();

	// Prepare state variables
	const [isLoadingHistory, setLoadingHistory] = useState(true);
	const [results, setResults] = useState<{
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		section_scores?: any[];
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		user_movement?: any[];
	}>({});

	const fetchDetails = () =>
		getPastPerformance(section.id)
			.then(res => {
				if (!res.error) {
					setResults(res.data);
				} else {
					SimpleToast.show(res.message, SimpleToast.SHORT);
					goBack();
				}

				setLoadingHistory(false);
			})
			.catch(() => {
				SimpleToast.show(
					'Failed to fetch workout history',
					SimpleToast.SHORT,
				);
			});

	useEffect(() => {
		// trigger fetch details
		void fetchDetails();

		return () => {
			// clear workout state
			setResults({});
		};
	}, []);

	useFocusEffect(
		useCallback(() => {
			void fetchDetails();
		}, []),
	);

	const renderBackdrop = useCallback(
		(props: JSX.IntrinsicAttributes & BottomSheetDefaultBackdropProps) => (
			<BottomSheetBackdrop {...props} pressBehavior="collapse" />
		),
		[],
	);

	const renderScoreComponent = useMemo(
		() => (
			<View style={layout.flex_1}>
				<View style={[styles.workoutScoreContainer]}>
					<ScoreComponent
						sessionId={sessionId}
						section={section}
						onSubmitCallback={() => void fetchDetails()}
						editMode={false}
					/>
				</View>
			</View>
		),
		[sessionId, section],
	);

	const renderBottomSheet = useMemo(
		() => (
			<BottomSheet
				snapPoints={
					isKeyboardVisible ? ['1%'] : [bottomSheetSpacing, '90%']
				}
				backgroundStyle={styles.pastPerformanceContainer}
				animateOnMount={false}
				backdropComponent={renderBackdrop}
				enableDynamicSizing={false}
			>
				<BottomSheetScrollView>
					<WODPastPerformance
						isLoading={isLoadingHistory}
						section={section}
						results={results}
					/>
				</BottomSheetScrollView>
			</BottomSheet>
		),
		[isKeyboardVisible, isLoadingHistory, section, results],
	);

	const scoringBy = section.scoring_by;
	if (scoringBy === 'section' || scoringBy === 'movement') {
		return (
			<>
				{renderScoreComponent}
				{renderBottomSheet}
			</>
		);
	}

	return (
		<Text
			color="darkgray"
			size="lg"
			center
			style={{ marginTop: fonts.metrics.xl }}
		>
			Invalid workout
		</Text>
	);
};

export default SessionScoringScreen;

const styles = StyleSheet.create({
	workoutScoreContainer: {
		flex: 1,
	},
	workoutScoreContainerExpanded: {
		marginBottom: bottomSheetSpacing,
	},
	backdropBackground: {
		backgroundColor: 'rgba(0,0,0,0.5)',
		height: '100%',
		width: '100%',
		position: 'absolute',
	},
	pastPerformanceContainer: {
		borderRadius: 0,
		borderTopWidth: 1,
		borderColor: config.fonts.colors.gray200,
	},
});
