interface ApplicationStateInterface {
	appForceUpdate: boolean;
	allowLeaderboards: boolean;
	teamId: number;
	shopUrl: string;
	unreadMessages: number;
	allowComments: boolean;
	emptyRequiredFields: string[];
}

interface ApplicationInterface extends ApplicationStateInterface {
	setAppState: (key: keyof ApplicationStateInterface, value: unknown) => void;
}

export default ApplicationInterface;
