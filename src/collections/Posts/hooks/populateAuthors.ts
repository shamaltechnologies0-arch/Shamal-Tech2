import type { CollectionAfterReadHook } from 'payload'
import { User } from '../../../payload-types'

// The `user` collection has access control locked so that users are not publicly accessible
// This means that we need to populate the authors manually here to protect user privacy
// GraphQL will not return mutated user data that differs from the underlying schema
// So we use an alternative `populatedAuthors` field to populate the user data, hidden from the admin UI
export const populateAuthors: CollectionAfterReadHook = async ({ doc, req: { payload } }) => {
  if (!doc?.authors || !Array.isArray(doc.authors) || doc.authors.length === 0) {
    return doc
  }

  const authorDocs: User[] = []

  for (const author of doc.authors) {
    if (author == null) continue

    try {
      const authorId = typeof author === 'object' ? (author as { id?: string })?.id : author
      if (authorId == null || authorId === '') continue

      const authorDoc = await payload.findByID({
        id: authorId,
        collection: 'users',
        depth: 0,
      })

      if (authorDoc) {
        authorDocs.push(authorDoc)
      }
    } catch {
      // swallow error
    }
  }

  if (authorDocs.length > 0) {
    doc.populatedAuthors = authorDocs.map((authorDoc) => ({
      id: authorDoc.id,
      name: authorDoc.name ?? '',
    }))
  }

  return doc
}
