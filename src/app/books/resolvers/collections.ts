import { toIdValue } from 'apollo-utilities';
import { DataProxy } from 'apollo-cache';
import gql from 'graphql-tag';

const collectionFragment = gql`
  fragment collectionFragment on Collection {
    books {
      id
    }
  }
`;

export const defaults = {
  collection: {
    books: [],
    __typename: 'Collection',
  },
};

const setBookInCollection = (cache, bookId, value) => {
  const id = 'Collection';
  const collection = cache.readFragment({
    fragment: collectionFragment,
    id,
  });

  if (value === false) {
    collection.books = collection.books.filter(book => book.id !== bookId);
  } else if (!collection.books.some(book => book.id === bookId)) {
    collection.books.push(toIdValue({ id: bookId, typename: 'Book' }, true));
  } else {
    return;
  }

  collection.books = collection.books.map(book => ({
    ...toIdValue({ id: book.id, typename: 'Book' }, true),
    __typename: 'Book',
  }));

  cache.writeFragment({
    fragment: collectionFragment,
    id,
    data: collection,
  });

  cache.writeQuery({
    query: gql`
      query isIt($id: String!) {
        isBookInCollection(id: $id)
      }
    `,
    variables: {
      id: bookId,
    },
    data: {
      isBookInCollection: value,
    },
  });
};

export const resolvers = {
  Mutation: {
    addBookToCollection: (_, args, { cache }) => {
      setBookInCollection(cache, args.id, true);

      return true;
    },
    removeBookFromCollection: (_, args, { cache }) => {
      setBookInCollection(cache, args.id, false);

      return true;
    },
  },
  Query: {
    isBookInCollection: (_, args, { cache }: { cache }) => {
      const id = 'Collection';
      const collection: any = cache.readFragment({
        fragment: collectionFragment,
        id,
      });

      return collection.books.some(book => book.id === args.id);
    },
  },
};
