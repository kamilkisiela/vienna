import {
  Component,
  Input,
  Output,
  OnInit,
  OnChanges,
  EventEmitter,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import gql from 'graphql-tag';

import { Note } from '../models/note';

@Component({
  selector: 'bc-note-form',
  template: `
    <form [formGroup]="form" [apolloForm]="form" [formName]="formName" [formQuery]="formQuery" (ngSubmit)="onSubmit()">
      <mat-card>
        <mat-card-title>New note</mat-card-title>
        <mat-card-content>
          <mat-form-field>
            <input matInput placeholder="Title" formControlName="title">
          </mat-form-field>
          <mat-form-field>
            <textarea matInput placeholder="Your note" formControlName="text"></textarea>
          </mat-form-field>
        </mat-card-content>
        <mat-card-footer>
          <button mat-button color="primary" type="submit">Add</button>
        </mat-card-footer>
      </mat-card>
    </form>
  `,
  styles: [
    `
    mat-card-title,
    mat-card-content,
    mat-card-footer {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    mat-card-footer {
      color: #FF0000;
      padding: 5px 0;
    }
    .mat-form-field {
      min-width: 300px;
    }
  `,
  ],
})
export class NoteFormComponent implements OnChanges {
  title = '';
  text = '';
  @Output() add = new EventEmitter<Note>();

  form: FormGroup;
  formName = 'noteForm';
  formQuery = gql`
    {
      noteForm @client {
        title
        text
      }
    }
  `;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      title: '',
      text: '',
    });
  }

  ngOnChanges() {
    this.rebuildForm();
  }

  onSubmit() {
    this.add.emit(this.form.value);
  }

  private rebuildForm() {
    this.form.reset({
      title: this.title,
      text: this.text,
    });
  }
}
