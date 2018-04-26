import { toIdValue } from 'apollo-utilities';
import * as merge from 'lodash.merge';

import * as core from './core/resolvers';
import * as books from './books/resolvers';
import * as notes from './notes/resolvers';

export const resolvers = merge(
  {},
  core.resolvers,
  books.resolvers,
  notes.resolvers,
);

export const defaults = merge(
  {},
  core.defaults,
  books.defaults,
  notes.defaults,
);

export const redirects = (cache: any) => ({
  Query: {
    book: (_, { id }) => toIdValue(`Book:${id}`),
  },
});

export const schema = [core.schema, books.schema, notes.schema];
