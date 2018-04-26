import { NgModule } from '@angular/core';

import { ApolloFormDirective } from './apollo-form';

export const DIRECTIVES = [ApolloFormDirective];

@NgModule({
  declarations: DIRECTIVES,
  exports: DIRECTIVES,
})
export class ApolloFormModule {}
