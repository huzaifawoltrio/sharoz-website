import type { Model } from "mongoose";

/**
 * Reads the single document of a "singleton" collection (SiteSettings,
 * HomePage, AboutPage). Returns null if it hasn't been seeded yet.
 */
export async function getSingleton<T>(model: Model<T>) {
  return model.findOne({}).lean<T>().exec();
}

/**
 * Creates or updates the single document of a "singleton" collection.
 * findOneAndUpdate({}, ...) always targets the one document a singleton
 * collection is meant to hold, and creates it on first write.
 *
 * Wrapped in $set so a caller can pass a *partial* update (e.g. just
 * `{ theme: {...} }`) without wiping sibling fields on the same
 * document — MongoDB treats a plain (non-operator) update object as a
 * full-document replacement, which would otherwise silently drop any
 * field the caller didn't include.
 */
export async function upsertSingleton<T>(
  model: Model<T>,
  data: Partial<T>
) {
  return model
    .findOneAndUpdate(
      {},
      { $set: data },
      {
        upsert: true,
        returnDocument: "after",
        setDefaultsOnInsert: true,
      }
    )
    .lean<T>()
    .exec();
}
