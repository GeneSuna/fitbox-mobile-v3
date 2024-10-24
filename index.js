// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

/**
 * @format
 */

import { AppRegistry, Text } from 'react-native';
import { name as appName } from './app.json';
import App from './src/App';

if (Text.defaultProps == null) {
	Text.defaultProps = {};
	// @typescript-eslint/no-unsafe-member-access
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
	Text.defaultProps.allowFontScaling = false;
}
AppRegistry.registerComponent(appName, () => App);
