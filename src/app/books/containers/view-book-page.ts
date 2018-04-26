import { Component, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';

import gql from 'graphql-tag';

import { Book, bookFragment } from '../models/book';

@Component({
  selector: 'bc-view-book-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <bc-selected-book-page [book]="book$ | async"></bc-selected-book-page>
  `,
})
export class ViewBookPageComponent {
  book$: Observable<Book>;
  actionsSubscription: Subscription;

  constructor(route: ActivatedRoute, apollo: Apollo) {
    this.book$ = route.paramMap.pipe(
      switchMap(params =>
        apollo
          .query({
            query: gql`
              query book($id: String!) {
                collection @client {
                  books {
                    id
                    volumeInfo {
                      title
                    }
                  }
                }

                book(id: $id) @client {
                  ...bookFragment
                }
              }

              ${bookFragment}
            `,
            variables: {
              id: params.get('id'),
            },
          })
          .pipe(map((result: any) => result.data.book)),
      ),
    );
  }
}
