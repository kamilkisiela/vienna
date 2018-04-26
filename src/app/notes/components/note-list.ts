import { Component, Input } from '@angular/core';

import { Note } from '../models/note';

@Component({
  selector: 'bc-note-list',
  template: `
    <bc-note-item *ngFor="let note of notes" [title]="note.title" [text]="note.text"></bc-note-item>
  `,
  styles: [
    `
    :host {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
    }
  `,
  ],
})
export class NoteListComponent {
  @Input() notes: Note[];
}
