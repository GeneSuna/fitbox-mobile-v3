import { KeyboardVisibilityContext } from '@/context/KeyboardProvider';
import { useContext } from 'react';

const useKeyboardVisibility = () => {
	const context = useContext(KeyboardVisibilityContext);

	if (context === undefined) {
		throw new Error('useAuth must be used within a AuthProvider');
	}

	return context;
};

export default useKeyboardVisibility;
