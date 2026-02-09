import type {
  CollectionBeforeReadHook,
  CollectionAfterReadHook,
  CollectionBeforeChangeHook,
} from 'payload'

/**
 * Ensures meta object exists before SEO plugin accesses meta.title.
 * Prevents "Cannot read properties of undefined (reading 'title')" when meta was never set.
 */
export const ensureMetaExists: CollectionBeforeReadHook = ({ doc }) => {
  if (doc && typeof doc.meta !== 'object') {
    doc.meta = {}
  }
  return doc
}

/**
 * Ensures meta exists on save so documents always have meta for SEO fields.
 */
export const ensureMetaOnSave: CollectionBeforeChangeHook = ({ data }) => {
  if (data && typeof data.meta !== 'object') {
    data.meta = {}
  }
  return data
}

/**
 * Filters out invalid category references (undefined, null)
 * that can cause "Cannot read properties of undefined (reading 'title')" in admin.
 */
export const sanitizeCategories: CollectionAfterReadHook = ({ doc }) => {
  if (doc?.categories && Array.isArray(doc.categories)) {
    doc.categories = doc.categories.filter((cat) => cat != null)
  }
  return doc
}
