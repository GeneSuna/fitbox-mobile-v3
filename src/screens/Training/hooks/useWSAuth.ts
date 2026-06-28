import useAuth from '@/auth/hooks/useAuth';
import {
	WSSession,
	clearWSSession,
	exchangeForWSSession,
	getStoredWSSession,
} from '@/services/workoutStudio/auth';
import { useEffect, useState } from 'react';

type State =
	| { status: 'loading' }
	| { status: 'authenticated'; session: WSSession }
	| { status: 'not_found' }
	| { status: 'no_membership' }
	| { status: 'unknown_gym' }
	| { status: 'provision_failed' }
	| { status: 'error' };

export const useWSAuth = () => {
	const { user } = useAuth();
	const [state, setState] = useState<State>({ status: 'loading' });

	const email = user?.user_data?.email;
	const memberId = user?.user_data?.user_id;
	const gymId = user?.user_data?.onboarding_gym_ids?.[0] ?? null;
	const fullName = user
		? `${user.user_data.first_name} ${user.user_data.last_name}`.trim()
		: '';

	const bootstrap = async () => {
		setState({ status: 'loading' });

		const stored = getStoredWSSession();
		if (stored) {
			setState({ status: 'authenticated', session: stored });
			return;
		}

		if (!email || !memberId) {
			setState({ status: 'error' });
			return;
		}

		const result = await exchangeForWSSession({
			email,
			fitbox_gym_id: gymId != null ? String(gymId) : null,
			fitbox_member_id: String(memberId),
			full_name: fullName,
		});
		if ('session' in result) {
			setState({ status: 'authenticated', session: result.session });
		} else if (result.error === 'NOT_FOUND') {
			setState({ status: 'not_found' });
		} else if (result.error === 'NO_MEMBERSHIP') {
			setState({ status: 'no_membership' });
		} else if (result.error === 'UNKNOWN_GYM') {
			setState({ status: 'unknown_gym' });
		} else if (result.error === 'PROVISION_FAILED') {
			setState({ status: 'provision_failed' });
		} else {
			setState({ status: 'error' });
		}
	};

	useEffect(() => {
		void bootstrap();
	}, [email]);

	const signOut = () => {
		clearWSSession();
		setState({ status: 'not_found' });
	};

	return { state, retry: bootstrap, signOut };
};
