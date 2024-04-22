import { Row, Spacer } from '@/components/atoms';
import useStore from '@/zustand/Store';
import moment from 'moment';
import { Linking, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';

const ShopRightComponent = () => {
	const { shopUrl, setState } = useStore(state => ({
		shopUrl: state.shopUrl,
		setState: state.setAppState,
	}));

	const onOpenLink = () => void Linking.openURL(shopUrl);
	const onRefresh = () =>
		setState('shopUrl', `${shopUrl}?v=${moment().unix()}`); // this is to force refresh

	return (
		<Row style={styles.container}>
			<Icon name="sync" size={20} color="white" onPress={onRefresh} />
			<Spacer horizontal />
			<Icon
				name="link-external"
				size={20}
				color="white"
				onPress={onOpenLink}
			/>
		</Row>
	);
};

// style
const styles = StyleSheet.create({
	container: {
		marginRight: 15,
	},
});

export default ShopRightComponent;
