import * as core from './core/resolvers/schema';
import * as coreLayout from './core/resolvers/layout';
import * as books from './books/resolvers/schema';
import * as booksBooks from './books/resolvers/books';
import * as collectionsCollections from './books/resolvers/collections';

// this won't work later because it will overwrite the Mutation
export const resolvers = {
  ...coreLayout.resolvers,
  ...booksBooks.resolvers,
  ...collectionsCollections.resolvers,
  Mutation: {
    ...coreLayout.resolvers.Mutation,
    ...booksBooks.resolvers.Mutation,
    ...collectionsCollections.resolvers.Mutation,
  },
  Query: {
    ...booksBooks.resolvers.Query,
    ...collectionsCollections.resolvers.Query,
  },
};

export const defaults = {
  ...coreLayout.defaults,
  ...collectionsCollections.defaults,
};

export const schema = [core.schema, books.schema];
