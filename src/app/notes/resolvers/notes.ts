import { toIdValue } from 'apollo-utilities';
import gql from 'graphql-tag';

import { noteFragment } from '../models/note';

const query = gql`
  {
    notes {
      ...noteFragment
    }
  }

  ${noteFragment}
`;

export const defaults = {
  notes: [],
};

export const resolvers = {
  Mutation: {
    addNote: (_, args, { cache }) => {
      const data = cache.readQuery({
        query,
      });

      console.log('notes', data);

      return {
        id: 'temp-1',
        title: args.title,
        text: args.text,
      };
    },
  },
  Query: {
    notes: (_, args, { cache }) => {
      const data = cache.readQuery({
        query,
      });

      console.log('notes', data);

      return data.notes || [];
    },
  },
};
