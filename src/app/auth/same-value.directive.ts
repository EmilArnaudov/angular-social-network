import { Attribute, Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[appSameValue]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: SameValueDirective,
    multi: true,
  }]
})
export class SameValueDirective implements Validator{

 @Input() pass!: string;


  constructor() {

  }

  validate(control: AbstractControl): ValidationErrors | null {
    

    if (control.value !== this.pass) {
      return {'notMatching': true}
    }

    return null;
  }

}
