import { useEffect, useState } from 'react';
import { Keyboard, KeyboardEvent, View } from 'react-native';

const KeyboardSpacer = ({
	heightDeduction = 70,
}: {
	heightDeduction?: number;
}) => {
	const [keyboardHeight, setKeyboardHeight] = useState<number>(0);

	const onKeyboardShow = (event: KeyboardEvent) => {
		setKeyboardHeight(event.endCoordinates.height - heightDeduction);
	};

	const onKeyboardHide = () => {
		setKeyboardHeight(0);
	};

	useEffect(() => {
		const onShow = Keyboard.addListener('keyboardDidShow', onKeyboardShow);
		const onHide = Keyboard.addListener('keyboardDidHide', onKeyboardHide);

		return () => {
			onShow.remove();
			onHide.remove();
		};
	}, []);
	return <View style={{ marginBottom: keyboardHeight }} />;
};

export default KeyboardSpacer;
