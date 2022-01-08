import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserRequest } from 'src/app/models/api/user';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  formGroup: FormGroup;
  thereAreErrors: boolean;

  constructor(private builder: FormBuilder, 
              private userService: UserService,
              private router: Router) { }

  ngOnInit(): void {
    this.formGroup = this.builder.group({
      name: ['User 24', Validators.required],
      email: ['user24@test.com', [Validators.required, Validators.email]],
      password: ['123456', [Validators.required, Validators.minLength(6)]],
      password2: ['123456'],
      terms: [null, Validators.required]
    }, {validators: this.somePasswords('password', 'password2') });

    this.formGroup.get('terms')?.valueChanges.subscribe(value => {
      if(!value) {
        this.formGroup.get('terms')?.setValue(null, {
          onlySelf: true,
          emitEvent: false
        });
      }
    });
    
    this.formGroup.valueChanges.subscribe(val => {
      this.thereAreErrors = false;
      Object.keys(this.formGroup.controls).forEach(key => {
        if(!this.thereAreErrors && this.formGroup.get(key)?.dirty && this.formGroup.get(key)?.invalid) {
          this.thereAreErrors = true;
        }
      });
      if(!this.thereAreErrors && this.formGroup.errors) {
        this.thereAreErrors = true;
      }
    });
  }

  createUser() {
    if(this.formGroup.valid) {
      const request: UserRequest = {
        name: this.formGroup.get('name')?.value,
        email: this.formGroup.get('email')?.value,
        password: this.formGroup.get('password')?.value
      };
      this.userService.createUser(request)
        .subscribe({
          next: (response) => {
            Swal.fire({
              title: 'Register user',
              text: 'The user has been create successfully!',
              icon: 'success'
            });
            this.router.navigate(['/login']);
          },
          error: err => Swal.fire({
            title: 'Register user',
            text: err.error.msg,
            icon: 'error'
          })
        });
    }
    
  }

  somePasswords(key1: string, key2: string): ValidatorFn {
    return <ValidatorFn> ((formGroup: FormGroup): ValidationErrors | null => {

      if(formGroup.get(key1)?.pristine || formGroup.get(key2)?.pristine) {
        return null;
      }
      const passwordValue1 = formGroup.get(key1)?.value;
      const passwordValue2 = formGroup.get(key2)?.value;
  
      return passwordValue1 === passwordValue2 ? null : {noEqualsPassword: true};
    });
  }


}
