import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

const SkeletonCard = () => {
	const opacity = useRef(new Animated.Value(0.3)).current;

	useEffect(() => {
		Animated.loop(
			Animated.sequence([
				Animated.timing(opacity, {
					toValue: 1,
					duration: 800,
					useNativeDriver: true,
				}),
				Animated.timing(opacity, {
					toValue: 0.3,
					duration: 800,
					useNativeDriver: true,
				}),
			]),
		).start();
	}, [opacity]);

	return (
		<Animated.View style={[styles.card, { opacity }]}>
			<View style={styles.line} />
			<View style={[styles.line, styles.short]} />
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	card: {
		backgroundColor: '#F3F4F6',
		borderRadius: 12,
		padding: 16,
		marginBottom: 10,
		gap: 10,
	},
	line: {
		height: 14,
		backgroundColor: '#E5E7EB',
		borderRadius: 7,
	},
	short: {
		width: '60%',
	},
});

export default SkeletonCard;
