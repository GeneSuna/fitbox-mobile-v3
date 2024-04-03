import { z } from 'zod';

export type MessageItemUserType = z.infer<typeof MessageItemUserSchema>;
export const MessageItemUserSchema = z.object({
	id: z.number(),
	firstname: z.string(),
	lastname: z.string(),
	profile_image: z.string(),
});

export type MessageItemAttachmentType = z.infer<
	typeof MessageItemAttachmentSchema
>;
export const MessageItemAttachmentSchema = z.object({
	type: z.string(),
});

export type MessageItemType = z.infer<typeof MessageItemSchema>;
export const MessageItemSchema = z.object({
	id: z.number(),
	userId: z.optional(z.number()),
	sender_id: z.number(),
	message: z.string(),
	profile_image: z.string(),
	num_of_unread_messages: z.number(),
	created_at: z.string(),
	subject: z.string(),
	status: z.number(),
	group: z.array(z.string()),
	convo_id: z.number(),
	firstname: z.string(),
	lastname: z.string(),
	user_list: z.array(MessageItemUserSchema),
	attached_files: z.array(MessageItemAttachmentSchema).or(z.any()),
});
