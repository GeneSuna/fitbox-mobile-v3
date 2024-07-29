import { SessionSectionSchemaType } from '@/types/schemas/session';
import { TextInput } from 'react-native';

export type SessionSectionState = {
	movements: {
		[key: number]: {
			id: string | number;
			wod_movement_id?: string | number;
			movement_id: number;
			loads: string[];
			value: string;
			scored: boolean;
			comments: string;
			comment_leaderboard_visible: boolean;
			minutes: string[];
			seconds: string[];
			score_type: string;
			reps: string;
		};
	};
	loads: string[];
	value: string;
	comments: string;
	comment_leaderboard_visible: boolean;
	minutes: string[];
	seconds: string[];
	isRx: boolean;
} & SessionSectionSchemaType;

export type ScoreInputFieldHandlers = {
	loadEntered: (
		val: string,
		movementId: number | null,
		roundIndex: number | null,
	) => void;
	addToRefs: (
		el: TextInput | HTMLInputElement | null,
		name: number | string | null,
	) => void;
	focusToRef: (field: string | number) => void;
	minEntered: (
		val: string,
		movementId: number | null,
		roundIndex: number | null,
	) => void;
	secEntered: (
		val: string,
		movementId: number | null,
		roundIndex: number | null,
	) => void;
	roundsOrDistanceEntered: (val: string, movementId: number | null) => void;
	repsEntered: (val: string, movementId: number | null) => void;
	checkboxClicked: (movementId: number | null) => void;
};
