import { ApolloClient } from 'apollo-client';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { withClientState } from 'apollo-link-state';
import { CachePersistor } from 'apollo-cache-persist';
import * as omit from 'lodash.omit';
import gql from 'graphql-tag';

const mutation = gql`
  mutation update($state: State!) {
    update(state: $state) @client
  }
`;

interface Options {
  name: string;
  query: any;
  defaults?: any;
}

export class State {
  private client: ApolloClient<any>;
  private cache: InMemoryCache;
  private persistor: CachePersistor<NormalizedCacheObject>;
  private storageKey: string;

  constructor(private options: Options) {
    this.cache = new InMemoryCache();
    const link = this.createLink();

    this.storageKey = `[apollo-form] ${this.options.name}`;

    this.persistor = new CachePersistor({
      cache: this.cache,
      storage: sessionStorage,
      key: this.storageKey,
    });
    this.persistor.restore();

    this.client = new ApolloClient({
      cache: this.cache,
      link,
    });

    if (!window['__STATE__']) {
      window['__STATE__'] = {};
    }

    window['__STATE__'][this.options.name] = this.client;
  }

  isStored(): boolean {
    return (
      !!sessionStorage.getItem(this.storageKey) &&
      sessionStorage.getItem(this.storageKey) !== '{}'
    );
  }

  write(state) {
    this.client.mutate({
      mutation,
      variables: {
        state,
      },
    });
  }

  read() {
    if (this.isStored()) {
      return this.client
        .query({
          query: this.options.query,
        })
        .then((result: any) => {
          const state = result.data && result.data[this.options.name];

          if (!!state) {
            return omit(state, '__typename');
          }
        });
    } else {
      return Promise.resolve();
    }
  }

  watch() {
    return this.client
      .watchQuery({
        query: this.options.query,
      })
      .map((result: any) => {
        const state = result.data && result.data[this.options.name];

        if (!!state) {
          return omit(state, '__typename');
        }
      });
  }

  clear() {
    this.client.resetStore();
    this.persistor.purge();
  }

  private createLink() {
    return withClientState({
      cache: this.cache,
      defaults: this.options.defaults,
      resolvers: {
        Query: {
          [this.options.name]: (_, args, { cache }) =>
            cache.readQuery({
              query: this.options.query,
            }),
        },
        Mutation: {
          update: (_, args, { cache }) => {
            cache.writeQuery({
              query: this.options.query,
              data: {
                [this.options.name]: {
                  ...args.state,
                  __typename: this.options.name,
                },
              },
            });
          },
        },
      },
    });
  }
}
