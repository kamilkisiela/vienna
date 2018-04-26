import { Routes } from '@angular/router';

import { NotFoundPageComponent } from './core/containers/not-found-page';

export const routes: Routes = [
  { path: '', redirectTo: '/books', pathMatch: 'full' },
  {
    path: 'books',
    loadChildren: './books/books.module#BooksModule',
  },
  {
    path: 'notes',
    loadChildren: './notes/notes.module#NotesModule',
  },
  { path: '**', component: NotFoundPageComponent },
];
