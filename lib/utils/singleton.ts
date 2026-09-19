import type { Model } from "mongoose";

/**
 * Reads the single document of a "singleton" collection (SiteSettings,
 * HomePage, AboutPage). Returns null if it hasn't been seeded yet.
 */
export async function getSingleton<T>(model: Model<T>) {
  return model.findOne({}).lean<T>().exec();
}

/**
 * Creates or replaces the single document of a "singleton" collection.
 * findOneAndUpdate({}, ..., {upsert:true}) always targets the one document
 * a singleton collection is meant to hold, and creates it on first write.
 */
export async function upsertSingleton<T>(
  model: Model<T>,
  data: Partial<T>
) {
  return model
    .findOneAndUpdate({}, data, {
      upsert: true,
      returnDocument: 'after',
      setDefaultsOnInsert: true,
    })
    .lean<T>()
    .exec();
}
