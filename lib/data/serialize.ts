/**
 * Turns a Mongoose .lean() result (ObjectIds, Dates) into a plain,
 * JSON-serializable object safe to pass from a Server Component into a
 * Client Component or return from a Server Action.
 */
export function serialize<T>(doc: unknown): T {
  return JSON.parse(JSON.stringify(doc)) as T;
}
