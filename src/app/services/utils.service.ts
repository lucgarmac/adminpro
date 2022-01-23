import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  nameValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return control.value && control.value.length && control.value.trim().length ? null : {invalidName : true};
    };
  }

  capitalizeStr(str: string) {
    if(!str && !str.trim().length)
      return null;
    str = str.trim();
    return `${str.charAt(0).toUpperCase()}${str.substring(1)}`;

  }
}
