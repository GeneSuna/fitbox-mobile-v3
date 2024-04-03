interface ApplicationStateInterface {
	teamId: number;
}

interface ApplicationInterface extends ApplicationStateInterface {
	setAppState: (key: keyof ApplicationStateInterface, value: unknown) => void;
}

export default ApplicationInterface;
