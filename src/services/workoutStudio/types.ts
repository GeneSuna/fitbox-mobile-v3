export type WorkoutAssignment = {
	id: string;
	workout_id: string;
	due_date: string;
	notes: string | null;
	workouts: {
		name: string;
		estimated_duration_minutes: number | null;
	};
};

export type WorkoutDetail = {
	id: string;
	name: string;
	est_duration_min: number | null;
	workout_sections: WorkoutSection[];
};

export type WorkoutSection = {
	id: string;
	name: string;
	order_index: number;
	section_blocks: SectionBlock[];
};

export type SectionBlock = {
	id: string;
	name: string | null;
	block_type: string;
	order_index: number;
	block_movements: BlockMovement[];
};

export type BlockMovement = {
	id: string;
	order_index: number;
	prescribed_sets: number | null;
	prescribed_reps: number | null;
	prescribed_weight: number | null;
	rest_seconds: number | null;
	scaling_notes: string | null;
	movements: {
		id: string;
		name: string;
	};
};

export type AthleteRM = {
	id: string;
	movement_id: string;
	rep_max: number;
	weight_kg: number;
	achieved_on: string;
	source: string;
	notes: string | null;
	movements: {
		name: string;
	};
};

export type WellnessResponse = {
	id: string;
	recorded_for: string;
	user_id: string;
};

export type CoachNote = {
	id: string;
	content: string;
	created_at: string;
	read_at: string | null;
	section_id: string | null;
};

export type WorkoutResult = {
	id: string;
	workout_id: string;
	completed_at: string;
	total_volume_kg: number | null;
	duration_seconds: number | null;
	subjective_rating: string | null;
	workouts: {
		name: string;
	};
};

export type FeedItem = {
	id: string;
	athlete_id: string;
	completed_at: string;
	workouts: {
		name: string;
	};
	profile?: {
		full_name: string;
		avatar_url: string | null;
	};
};

export type Notification = {
	id: string;
	title: string;
	body: string;
	kind: 'assignment' | 'coach_note' | 'reaction' | 'wellness_followup';
	entity_id: string | null;
	link: string | null;
	read_at: string | null;
	created_at: string;
};

export type SetResult = {
	id: string;
	movement_result_id: string;
	set_number: number;
	reps: number | null;
	weight: number | null;
	rpe: number | null;
	notes: string | null;
	completed: boolean;
	idempotency_key: string;
};

export type WellnessDimension = {
	id: string;
	slug: string;
	label: string;
	higher_is_better: boolean;
	position: number;
};

export type PersonalWorkout = {
	id: string;
	name: string;
	description: string | null;
	est_duration_min: number | null;
	created_at: string;
};

export type WellnessTrend = {
	dimension: string;
	label: string;
	recent_avg: number | null;
	baseline_avg: number | null;
	higher_is_better: boolean;
};
