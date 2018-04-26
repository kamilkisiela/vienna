import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { pairwise } from 'rxjs/operators';

import { Note } from '../models/note';

@Component({
  selector: 'bc-notes-page',
  template: `
    <bc-note-form [title]="title" [text]="text" (submit)="add($event)"></bc-note-form>
    <bc-note-list [notes]="notes$ | async"></bc-note-list>
  `,
})
export class NotesPageComponent implements OnInit {
  notes$: Observable<Note[]>;
  title = '';
  text = '';

  ngOnInit() {
    this.notes$ = of([
      { title: 'foo', text: 'Foo text' },
      { title: 'bar', text: 'bar text' },
    ]);
  }

  add(note: Note): void {
    console.log('add note', note);
  }
}
