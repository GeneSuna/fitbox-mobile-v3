/**
 * Preset of navigation options
 */

import { config } from '@/theme/_config';
import layout from '@/theme/layout';
import {
	CardStyleInterpolators,
	StackNavigationOptions,
} from '@react-navigation/stack';

export const CommonHeaderOptions: StackNavigationOptions = {
	cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
	headerStyle: { backgroundColor: config.colors.brand },
	headerTitleAlign: 'center',
	headerTintColor: 'white',
	headerBackTitleVisible: false,
	headerTitleStyle: layout.fontMontserratRegular,
};

export const TabHeaderOptions: StackNavigationOptions = {
	cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
	headerShown: true,
	headerBackTitleVisible: false,
};
