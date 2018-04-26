import {
  Component,
  Input,
  ChangeDetectionStrategy,
  OnChanges,
} from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';

import gql from 'graphql-tag';

import { Book } from '../models/book';

@Component({
  selector: 'bc-selected-book-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <bc-book-detail
      [book]="book"
      [inCollection]="isSelectedBookInCollection$ | async"
      (add)="addToCollection($event)"
      (remove)="removeFromCollection($event)">
    </bc-book-detail>
  `,
})
export class SelectedBookPageComponent implements OnChanges {
  @Input() book: Book;
  isSelectedBookInCollection$: Observable<boolean>;

  constructor(private apollo: Apollo) {}

  ngOnChanges() {
    // TODO: refactor it
    if (this.book && this.book.id && !this.isSelectedBookInCollection$) {
      this.isSelectedBookInCollection$ = this.apollo
        .watchQuery({
          query: gql`
            query isBookInCollection($id: String!) {
              isBookInCollection(id: $id) @client
            }
          `,
          variables: {
            id: this.book && this.book.id,
          },
        })
        .valueChanges.pipe(
          map((result: any) => {
            console.log('result', result.data);
            return result.data.isBookInCollection;
          }),
        );
    }
  }

  addToCollection(book: Book) {
    this.apollo
      .mutate({
        mutation: gql`
          mutation addBookToCollection($id: String!) {
            addBookToCollection(id: $id) @client
          }
        `,
        variables: {
          id: book.id,
        },
      })
      .subscribe();
  }

  removeFromCollection(book: Book) {
    this.apollo
      .mutate({
        mutation: gql`
          mutation removeBookFromCollection($id: String!) {
            removeBookFromCollection(id: $id) @client
          }
        `,
        variables: {
          id: book.id,
        },
      })
      .subscribe();
  }
}
