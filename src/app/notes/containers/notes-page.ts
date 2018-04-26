import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { pairwise, map } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';

import gql from 'graphql-tag';

import { Note, noteFragment } from '../models/note';

const query = gql`
  {
    notes {
      ...noteFragment
    }
  }

  ${noteFragment}
`;

@Component({
  selector: 'bc-notes-page',
  template: `
    <bc-note-form (add)="addNote($event)"></bc-note-form>
    <bc-note-list [notes]="notes$ | async"></bc-note-list>
  `,
})
export class NotesPageComponent implements OnInit {
  notes$: Observable<Note[]>;

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.notes$ = this.apollo
      .watchQuery({
        query,
      })
      .valueChanges.pipe(map((result: any) => result.data.notes));
  }

  addNote(note: Note): void {
    this.apollo
      .mutate({
        mutation: gql`
          mutation addNote($title: String!, $text: String) {
            addNote(text: $text, title: $title) {
              ...noteFragment
            }
          }

          ${noteFragment}
        `,
        variables: {
          title: note.title,
          text: note.text,
        },
        update: (proxy, result: any) => {
          const data: any = proxy.readQuery({ query });

          proxy.writeQuery({
            query,
            data: {
              ...data,
              notes: [result.data.addNote, ...data.notes],
            },
          });
        },
      })
      .subscribe();
  }
}
