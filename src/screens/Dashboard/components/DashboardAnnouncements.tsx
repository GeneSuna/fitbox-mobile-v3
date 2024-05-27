/**
 * TODO: Temporary Announcements for Dashboard Screen
 */

import { ScrollView, Spacer, Text } from '@/components/atoms';
import { StyleSheet, View } from 'react-native';

const DashboardAnnouncements = () => {
	return (
		<ScrollView horizontal showsHorizontalScrollIndicator={false}>
			<View style={styles.announcement}>
				<Text size="md" bold>
					Johhny Deppy
				</Text>
				<Text size="rg">
					Lorem ipsum dolor sit amet consectetur, a laboriosam quidem
					voluptatum, culpa quae. Lorem ipsum dolor sit amet
					consectetur, a laboriosam quidem voluptatum, culpa quae.
				</Text>
				<Spacer size="xs" />
				<Text size="xs">July 12, 2021 at 12:00 PM</Text>
			</View>

			<View style={styles.announcement}>
				<Text size="md" bold>
					Johhny Deppy
				</Text>
				<Text size="rg">
					Lorem ipsum dolor sit amet consectetur, a laboriosam quidem
					voluptatum, culpa quae. Lorem ipsum dolor sit amet
					consectetur, a laboriosam quidem voluptatum, culpa quae.
				</Text>
				<Spacer size="xs" />
				<Text size="xs">July 11, 2021 at 12:00 PM</Text>
			</View>
			<View style={styles.announcement}>
				<Text size="md" bold>
					Johhny Deppy
				</Text>
				<Text size="rg">
					Lorem ipsum dolor sit amet consectetur, a laboriosam quidem
					voluppa quae.
				</Text>
				<Spacer size="xs" />
				<Text size="xs">July 11, 2021 at 12:00 PM</Text>
			</View>
		</ScrollView>
	);
};

export default DashboardAnnouncements;

const styles = StyleSheet.create({
	announcement: {},
});
