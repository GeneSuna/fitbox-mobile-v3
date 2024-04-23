import { ClassItemData } from '@/screens/Calendar/components/AgendaItem';

type ClassItem = {
	title: string; // date
	data: ClassItemData[];
};

interface SessionStateInterface {
	classes: ClassItem[];
	activeMonth: string;
}

interface SessionInterface extends SessionStateInterface {
	setClasses: (date: string, data: ClassItemData[]) => void;
	setActiveMonth: (date: string) => void;
}

export type { ClassItem, SessionStateInterface };
export default SessionInterface;
