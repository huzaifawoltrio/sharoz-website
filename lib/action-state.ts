/** Common shape returned by Server Actions used with useActionState. */
export type ActionState = {
  error?: string;
  success?: boolean;
} | undefined;

/** Flattens a ZodError into a single readable message for ActionState. */
export function firstZodMessage(error: {
  issues: { message: string }[];
}): string {
  return error.issues[0]?.message ?? "Invalid input";
}
