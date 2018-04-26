import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable, Subject, asyncScheduler } from 'rxjs';
import { switchMap, tap, map, debounceTime } from 'rxjs/operators';

import { Books } from '../services/books';
import { Book } from '../models/book';

@Component({
  selector: 'bc-find-book-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <bc-book-search [query]="title$ | async" [searching]="loading" [error]="error" (search)="search($event)"></bc-book-search>
    <bc-book-preview-list [books]="books$ | async"></bc-book-preview-list>
  `,
})
export class FindBookPageComponent {
  books$: Observable<Book[]>;
  loading = false;
  error: string;
  title$ = new Subject<string>();

  constructor(private books: Books) {
    this.books$ = this.title$.asObservable().pipe(
      debounceTime(300, asyncScheduler),
      switchMap(title => this.books.searchBooks(title)),
      tap(({ loading, errors }) => {
        this.loading = loading;
        this.error = errors && errors.length > 0 ? errors[0].message : null;
      }),
      map((result: any) => result.data.searchBooks),
    );
  }

  search(query: string) {
    this.title$.next(query);
  }
}
