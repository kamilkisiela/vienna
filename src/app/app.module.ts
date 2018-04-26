import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { CoreModule } from './core/core.module';
import { ApiModule } from './api/api.module';

import { routes } from './routes';
import { resolvers, defaults, schema } from './resolvers';

import { AppComponent } from './core/containers/app';
import { environment } from '../environments/environment';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot(routes, { useHash: true }),
    CoreModule.forRoot(),
    ApiModule.forRoot({ resolvers, defaults, schema }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
