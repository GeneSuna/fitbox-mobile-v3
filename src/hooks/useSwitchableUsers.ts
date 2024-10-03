import { SwitchableUserContext } from '@/context/SwitchableUser';
import { useContext } from 'react';

const useSwitchableUsers = () => {
	const context = useContext(SwitchableUserContext);

	if (context === undefined) {
		throw new Error('useAuth must be used within a AuthProvider');
	}

	return context;
};

export default useSwitchableUsers;
