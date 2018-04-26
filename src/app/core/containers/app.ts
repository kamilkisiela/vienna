import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';

import gql from 'graphql-tag';

@Component({
  selector: 'bc-app',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <bc-layout>
      <bc-sidenav [open]="showSidenav$ | async">
        <bc-nav-item (navigate)="closeSidenav()" routerLink="/" icon="book" hint="View your book collection">
          My Collection
        </bc-nav-item>
        <bc-nav-item (navigate)="closeSidenav()" routerLink="/books/find" icon="search" hint="Find your next book!">
          Browse Books
        </bc-nav-item>
      </bc-sidenav>
      <bc-toolbar (openMenu)="openSidenav()">
        Book Collection
      </bc-toolbar>
      <router-outlet></router-outlet>
    </bc-layout>
  `,
})
export class AppComponent {
  showSidenav$: Observable<boolean>;
  loggedIn$: Observable<boolean>;

  constructor(private apollo: Apollo) {
    this.showSidenav$ = this.apollo
      .watchQuery({
        query: gql`
          {
            layout @client {
              showSidenav
            }
          }
        `,
      })
      .valueChanges.pipe(map((result: any) => result.data.layout.showSidenav));
  }

  closeSidenav() {
    // XXX: too much code to just open the sidenav
    // we should have possibilty to make it as a one liner
    // for example: this.apolloFlux.mutate(`
    //   mutation CloseSidenav {
    //     toggleSidenav(open: false) @client
    //   }
    // `)
    // or similar

    this.apollo
      .mutate({
        mutation: gql`
          mutation CloseSidenav {
            toggleSidenav(open: false) @client
          }
        `,
      })
      .subscribe();
    // this.store.dispatch(new LayoutActions.CloseSidenav());
  }

  openSidenav() {
    // TODO: call open sidenav mutation
    this.apollo
      .mutate({
        mutation: gql`
          mutation OpenSidenav {
            toggleSidenav(open: true) @client
          }
        `,
      })
      .subscribe();
    // this.store.dispatch(new LayoutActions.OpenSidenav());
  }
}
