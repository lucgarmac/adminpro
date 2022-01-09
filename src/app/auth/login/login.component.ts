import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TokenRequest, LoginRequest } from 'src/app/models/api/auth';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

declare const gapi:any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private auth2: any;
  
  formGroup: FormGroup;

  @ViewChild('googleBtn') googleButton: ElementRef;

  constructor(private router: Router,
              private builder: FormBuilder,
              private authService: AuthService,
              private ngZone: NgZone) { }

  ngOnInit(): void {
    this.formGroup = this.builder.group({
      email: [''],
      password: [''],
      remember: [false]
    });
    
    const rememberEmailValue = localStorage.getItem('email');
    if(rememberEmailValue) {
      this.formGroup.get('email')?.setValue(rememberEmailValue);
    }

    this.initGoogleApi();
    
  }

  login() {
    
    const request: LoginRequest = {
      email: this.formGroup.get('email')?.value,
      password: this.formGroup.get('password')?.value
    };
    this.authService.login(request).subscribe({
      next: response => {
        
        this.formGroup.get('remember')?.value 
          ? localStorage.setItem('email', this.formGroup.get('email')?.value)
          : localStorage.removeItem('email');
        
        localStorage.setItem('token', response.token);
        this.router.navigate(['/dashboard']);
      }, 
      error: err =>  {
          let errMsg: string = err.error.msg
          if(!err.error.msg) {
            errMsg = '<ul class="list-group">';
            Object.keys(err.error.errors).forEach(key => {
              errMsg = errMsg.concat(`<li class="list-group-item">${err.error.errors[key].msg}</li>`);
            });

            errMsg = errMsg.concat('</ul>');
          }
          Swal.fire({
            title: 'Login',
            html: errMsg,
            icon: 'error'
          });
      }
    });
  }

  
  loginGoogle() {
     this.auth2.attachClickHandler(this.googleButton.nativeElement, {}, (googleUser: any) => {
      const request: TokenRequest = {
        token: googleUser.getAuthResponse().id_token
      };
      this.authService.loginWithGoogle(request)
        .subscribe(response => {
          localStorage.setItem('token', response.token);
          this.ngZone.run(() => {
            this.router.navigate(['/dashboard']);
          });
          
      });
    }, (error: any) => console.error(error)); 
  }
 
  private initGoogleApi() {
    // Render button
    gapi.signin2.render('google-sign-in', {
      'scope': 'profile email',
      'width': 240,
      'height': 50,
      'longtitle': true,
      'theme': 'dark'
    });

    // Load api
    this.authService.loadAuthGoogle()
      .then((auth: any) => {
        this.auth2 = auth;
        this.loginGoogle();
      });
  }
}
