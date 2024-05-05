import { ModalEnum } from '@/utils/Enum';

type ModalStateInterface = {
	[key in ModalEnum]: boolean;
};

interface ModalInterface extends ModalStateInterface {
	toggleModal: (key: ModalEnum, value?: boolean) => void;
}

export { ModalEnum };
export default ModalInterface;
