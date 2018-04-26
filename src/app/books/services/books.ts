import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, asyncScheduler } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import gql from 'graphql-tag';

import { Book, bookFragment } from '../models/book';

@Injectable()
export class Books {
  constructor(private apollo: Apollo) {}

  searchBooks(title: string) {
    return this.apollo.query({
      query: gql`
        query searchBooks($title: String!) {
          searchBooks(title: $title) {
            ...bookFragment
          }
        }

        ${bookFragment}
      `,
      variables: { title },
      fetchPolicy: 'cache-first',
    });
  }
}
