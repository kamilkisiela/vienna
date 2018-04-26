import {
  Directive,
  Input,
  OnInit,
  OnDestroy,
  HostListener,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { DocumentNode } from 'graphql';

import { State } from './state';

@Directive({
  selector: '[apolloForm]',
})
export class ApolloFormDirective implements OnInit, OnDestroy {
  @Input('apolloForm') form: FormGroup = null;
  @Input() formName: string;
  @Input() formQuery: DocumentNode;
  state: State;

  ngDestroy = new Subject<void>();

  ngOnInit() {
    this.state = new State({
      name: this.formName,
      query: this.formQuery,
    });

    this.restore();

    this.form.valueChanges
      .pipe(takeUntil(this.ngDestroy), debounceTime(300))
      .subscribe(state => {
        this.state.write(state);
      });
  }

  restore() {
    setTimeout(() => {
      this.state.read().then(value => {
        if (value) {
          this.form.setValue(value);
        }
      });
    });
  }

  reset() {
    this.state.clear();
  }

  @HostListener('reset')
  private onReset() {
    this.reset();
  }

  ngOnDestroy() {
    this.ngDestroy.next();
    this.ngDestroy.complete();
  }
}
