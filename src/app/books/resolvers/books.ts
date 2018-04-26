import gql from 'graphql-tag';

import { bookFragment } from '../models/book';

export const defaults = {};

export const resolvers = {
  Mutation: {},
  Query: {
    book: (_, { id }, { cache }) => {
      const data = cache.readFragment({
        fragment: bookFragment,
        id: `Book:${id}`,
      });

      return data;
    },
  },
};
