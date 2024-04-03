import { ApplicationStackParamList } from '@/types/navigation';
import {
	CommonActions,
	createNavigationContainerRef,
} from '@react-navigation/native';

export const navigationRef =
	createNavigationContainerRef<ApplicationStackParamList>();

export function navigate(routeName: string, params?: object) {
	if (navigationRef.isReady()) {
		navigationRef.dispatch(CommonActions.navigate(routeName, params));
	}
}

export function goBack() {
	if (navigationRef.isReady()) {
		navigationRef.dispatch(CommonActions.goBack());
	}
}

export function resetRoot() {
	if (navigationRef.isReady()) {
		navigationRef.dispatch(
			CommonActions.reset({
				index: 0,
				routes: [{ name: 'Startup' }],
			}),
		);
	}
}
