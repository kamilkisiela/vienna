import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ApolloModule, Apollo } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { persistCache } from 'apollo-cache-persist';
import { withClientState } from 'apollo-link-state';

function createApollo({ resolvers, schema, redirects, defaults = {} }) {
  // XXX: temporary thing
  let cache: InMemoryCache;

  cache = new InMemoryCache({
    dataIdFromObject: (obj: any) => {
      if (!obj) {
        return null;
      }

      const byType = ['Collection', 'Layout'];

      if (byType.indexOf(obj.__typename) !== -1) {
        return obj.__typename;
      }

      if (obj.id) {
        return obj.__typename ? `${obj.__typename}:${obj.id}` : obj.id;
      }

      return null;
    },
    cacheRedirects: redirects(cache),
  });

  persistCache({
    cache,
    storage: sessionStorage,
  });

  const state = withClientState({
    cache,
    resolvers,
    defaults,
    typeDefs: schema,
  });

  return (apollo: Apollo, httpLink: HttpLink) => {
    return () => {
      const http = httpLink.create({
        uri: 'https://j84jv1w95p.lp.gql.zone/graphql',
      });

      apollo.create({
        link: state.concat(http),
        cache,
      });
    };
  };
}

@NgModule({
  imports: [HttpClientModule, ApolloModule, HttpLinkModule],
})
export class ApiModule {
  static forRoot({ resolvers, schema, defaults, redirects }) {
    return {
      ngModule: ApiModule,
      providers: [
        {
          provide: APP_INITIALIZER,
          useFactory: createApollo({ resolvers, schema, defaults, redirects }),
          deps: [Apollo, HttpLink],
          multi: true,
        },
      ],
    };
  }
}
