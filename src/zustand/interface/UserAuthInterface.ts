import { LoginResponseSchemaType } from '@/types/schemas/response';

type UserAuthStateInterface = {
	loggedInUser: LoginResponseSchemaType | null;
};

interface UserAuthInterface extends UserAuthStateInterface {
	setLoggedInUser: (u: LoginResponseSchemaType | null) => void;
}

export default UserAuthInterface;
