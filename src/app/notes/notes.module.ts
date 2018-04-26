import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ComponentsModule } from './components';

import { NotesPageComponent } from './containers/notes-page';
import { MaterialModule } from '../material';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    ComponentsModule,
    RouterModule.forChild([{ path: '', component: NotesPageComponent }]),
  ],
  declarations: [NotesPageComponent],
})
export class NotesModule {}
