import { Spacer } from '@/components/atoms';
import HeaderButtonGroup from '@/components/template/Header/HeaderButtonGroup';
import useStore from '@/zustand/Store';
import moment from 'moment';
import { Linking } from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';

const ShopHeaderRightComponent = () => {
	const { shopUrl, setState } = useStore(state => ({
		shopUrl: state.shopUrl,
		setState: state.setAppState,
	}));

	const onOpenLink = () => void Linking.openURL(shopUrl);
	const onRefresh = () =>
		setState('shopUrl', `${shopUrl}?v=${moment().unix()}`); // this is to force refresh

	return (
		<HeaderButtonGroup>
			<Icon name="sync" size={20} color="white" onPress={onRefresh} />
			<Spacer horizontal />
			<Icon
				name="link-external"
				size={20}
				color="white"
				onPress={onOpenLink}
			/>
		</HeaderButtonGroup>
	);
};

export default ShopHeaderRightComponent;
