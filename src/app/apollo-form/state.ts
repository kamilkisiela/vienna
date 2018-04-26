import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
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

const toForm = (formName: string) => (result: any) => {
  const state = result.data && result.data[formName];

  if (state) {
    return omit(state, '__typename');
  }
};

export class State {
  private client: ApolloClient<any>;
  private cache: InMemoryCache;
  private link: ApolloLink;
  private persistor: CachePersistor<NormalizedCacheObject>;
  private storageKey: string;

  constructor(private options: Options) {
    this.storageKey = `[apollo-form] ${this.options.name}`;
    this.createCache();
    this.createLink();
    this.createPersistor();
    this.createClient();
  }

  public isStored(): boolean {
    return (
      !!sessionStorage.getItem(this.storageKey) &&
      sessionStorage.getItem(this.storageKey) !== '{}'
    );
  }

  public write(state) {
    this.client.mutate({
      mutation,
      variables: {
        state,
      },
    });
  }

  public read() {
    if (this.isStored()) {
      return this.client
        .query({
          query: this.options.query,
        })
        .then(toForm(this.options.name));
    } else {
      return Promise.resolve();
    }
  }

  public watch() {
    return this.client
      .watchQuery({
        query: this.options.query,
      })
      .map(toForm(this.options.name));
  }

  public clear() {
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

  private createPersistor() {
    this.persistor = new CachePersistor({
      cache: this.cache,
      storage: sessionStorage,
      key: this.storageKey,
    });
    this.persistor.restore();
  }

  private createCache() {
    this.cache = new InMemoryCache();
  }

  private createClient() {
    this.client = new ApolloClient({
      cache: this.cache,
      link: this.link,
    });
  }
}
