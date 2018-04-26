import { DataProxy } from 'apollo-cache';
import gql from 'graphql-tag';

import { bookFragment } from '../models/book';

// const fragment = gql`
//   fragment bookWithCollection on Book {
//     id
//     inCollection
//   }
// `;

const fragment = bookFragment;

export const defaults = {};

const setBookInCollection = (cache, id, value) => {
  const bookId = `Book:${id}`;
  const book = cache.readFragment({ fragment, id: bookId });

  book.inCollection = value;

  cache.writeFragment({
    fragment,
    id: bookId,
    data: book,
  });

  console.log('updated', cache.readFragment({ fragment, id: bookId }));
};

export const resolvers = {
  Mutation: {
    addBookToCollection: (_, args, { cache }) => {
      console.log('add', args.id);

      setBookInCollection(cache, args.id, true);

      return true;
    },
    removeBookFromCollection: (_, args, { cache }) => {
      console.log('remove', args.id);

      setBookInCollection(cache, args.id, false);

      return true;
    },
  },
  Query: {
    isBookInCollection: (_, args, { cache }: { cache: DataProxy }) => {
      const id = `Book:${args.id}`;
      const book: any = cache.readFragment({
        fragment,
        id,
      });

      console.log('is', args.id, 'in collection?', !!book.inCollection);

      return !!book.inCollection;
    },
  },
};
