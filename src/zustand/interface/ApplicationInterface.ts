interface ApplicationStateInterface {
	appForceUpdate: boolean;
	allowLeaderboards: boolean;
	teamId: number;
	shopUrl: string;
	logo: string;
	unreadMessages: number;
	allowComments: boolean;
	emptyRequiredFields: string[];
	fromAcceptInvite: boolean;
	setupSubscriptionId: null | number;
}

interface ApplicationInterface extends ApplicationStateInterface {
	setAppState: (key: keyof ApplicationStateInterface, value: unknown) => void;
}

export default ApplicationInterface;
