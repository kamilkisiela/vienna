import { DataProxy } from 'apollo-cache';
import gql from 'graphql-tag';

export const defaults = {
  layout: {
    showSidenav: false,
    __typename: 'Layout',
  },
};

export const resolvers = {
  Mutation: {
    toggleSidenav: (_, { open }, { cache }: { cache: DataProxy }) => {
      cache.writeFragment({
        fragment: gql`
          fragment layoutFragment on Layout {
            showSidenav
          }
        `,
        id: 'Layout',
        data: {
          __typename: 'Layout',
          showSidenav: open,
        },
      });

      return null;
    },
  },
};
