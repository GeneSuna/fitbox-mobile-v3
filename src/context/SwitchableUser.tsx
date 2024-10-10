import { getChildInfo, getParentInfo } from '@/services/users';
import { GetChildInfoType, GetParentInfoType } from '@/types/schemas/response';
import useStore from '@/zustand/Store';
import { createContext, useEffect, useMemo, useState } from 'react';
import { ViewProps } from 'react-native';

type Context = {
	hasSwitchableUsers: boolean;
	isParent: boolean;
	fromParent: boolean;
	getSwitchableUsers: () => void;
};

export const SwitchableUserContext = createContext<Context | undefined>(
	undefined,
);

const SwitchableUserProvider = ({ children }: ViewProps) => {
	const loggedInUser = useStore(s => s.loggedInUser);
	// const classes = useStore(s => s.classes);
	const [hasSwitchableUsers, setHasSwitchableUsers] =
		useState<boolean>(false);
	const [isParent, setIsParent] = useState<boolean>(false);
	const [fromParent, setFromParent] = useState<boolean>(false);

	const getSwitchableUsers = async () => {
		if (!loggedInUser?.user_data) return;
		const { is_parent: isUserParent, from_parent: isUserFromParent } =
			loggedInUser.user_data;

		setIsParent(isUserParent);
		setFromParent(!!isUserFromParent);

		const enableSwitch = isUserFromParent || isUserParent;
		let switchable = false;

		// if switch enabled fetch users
		if (enableSwitch) {
			const res: GetChildInfoType | GetParentInfoType = isUserParent
				? await getChildInfo() // get children
				: await getParentInfo(); // get parent info
			if (isUserParent) {
				const childRes = res as GetChildInfoType;
				if (
					childRes.child_data[0]?.children &&
					childRes.child_data[0]?.children.length > 0
				) {
					switchable = true;
				}
			} else {
				const parentRes = res as GetParentInfoType;
				if (parentRes.parent_data && parentRes.parent_data.length > 0) {
					switchable = true;
				}
			}
		}
		setHasSwitchableUsers(switchable);
	};

	useEffect(() => {
		void getSwitchableUsers();

		return () => {
			setHasSwitchableUsers(false);
			setIsParent(false);
			setFromParent(false);
		};
	}, [loggedInUser]);

	const value = useMemo(
		() => ({
			hasSwitchableUsers,
			isParent,
			fromParent,
			getSwitchableUsers,
		}),
		[hasSwitchableUsers, isParent, fromParent],
	);

	return (
		<SwitchableUserContext.Provider value={value}>
			{children}
		</SwitchableUserContext.Provider>
	);
};

export default SwitchableUserProvider;
