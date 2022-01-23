import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EntityNameEnum } from 'src/app/models/api/entity-name-enum';
import { FileRequest, FileUploadRequest } from 'src/app/models/api/file';
import { User, UserRequest } from 'src/app/models/api/user';
import { PagesService } from 'src/app/pages/pages.service';
import { FilesService } from 'src/app/services/files.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  
  private token: string;
  
  user: User;
  formGroup: FormGroup;
  areDefaultValues: boolean;
  errorMsg: string;
  imgUserUrl: string;
  imgLoaded: {
    file: File, 
    path: string | ArrayBuffer,
    name: string
  };

  @ViewChild('inputFile', {static: false}) inpuFileElement: ElementRef;
  

  constructor(private builder: FormBuilder,
              private userService: UserService,
              private filesService: FilesService,
              private pagesService: PagesService) { }

  ngOnInit(): void {
    this.getUser();
    this.formGroup = this.builder.group({
      name: [this.user.name, Validators.required],
      email: [
        { value: this.user.email, disabled: this.user.google}, 
        [Validators.required, Validators.email]]
    });    
    this.areDefaultValues = true;
    this.formGroup.valueChanges.subscribe(_ => 
      this.areDefaultValues = this.user.name === this.formGroup.get('name')?.value.trim() 
          && this.user.email === this.formGroup.get('email')?.value.trim()
    );

    this.pagesService.user$.subscribe(_ => {
      this.getUser();
    });
  }

  loadImage(event: any) {
    const files = event.srcElement.files;
    this.errorMsg = '';
    if(files && files.length) {
      const tempFile = files[0];
      const fileExtensionsAllowed = ['png', 'jpeg', 'jpg', 'gif'];   
      const tempFileExt = tempFile.name.substring(tempFile.name.lastIndexOf('.') + 1);
   
      if(fileExtensionsAllowed.includes(tempFileExt)) {
        const reader = new FileReader();
        reader.readAsDataURL(tempFile);
        reader.onload = () => this.imgLoaded = {
          file: tempFile,
          path: reader.result,
          name: tempFile.name
        };
      } else {
        this.errorMsg = 'Invalid image!! Extensions admits: png, jpeg, jpg, gif';
      }
    } else {
      this.errorMsg = 'You must select a image';
    }
  }

  removeTempImage() {
    this.imgLoaded = null;
    this.inpuFileElement.nativeElement.files = null;
  }

  updateProfile() {
    if(this.formGroup.valid && !this.areDefaultValues) {
      const request: UserRequest = {
        name: this.formGroup.get('name')?.value.trim(),
        email: this.formGroup.get('email')?.value.trim(),
        role: this.user.role
      };
  
      this.userService.updateUser(this.token, this.user.uid, request)
        .subscribe({
          next: response => {
            localStorage.setItem('user', JSON.stringify(response));
            this.updateFormValues(response);
            this.pagesService.setUser(response);
            Swal.fire({
              title: 'Update user',
              text: 'The user has been update successfully',
              icon: 'success',
              showConfirmButton: false,
              timer: 1500
            });
          },
          error: err => Swal.fire({
            title: 'Update user',
            text: err.error.msg,
            icon: 'error',
            showConfirmButton: true
          })
        });
    }
  }

  updateImageUser() {
    if(this.imgLoaded) {
      const request: FileUploadRequest = {
        id: this.user.uid,
        entity: EntityNameEnum.Users,
        img: this.imgLoaded.file
      };
      this.filesService.uploadImage(this.token, request)
        .subscribe( { next: response => {
          localStorage.setItem('user', JSON.stringify(response));
          this.inpuFileElement.nativeElement.files = null;
          this.pagesService.setUser(<User>response);
          this.getUser();
          Swal.fire({
            title: 'Update user',
            text: 'The user has been update successfully',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500
          }) 
        },
        error: err => Swal.fire({
          title: 'Update user',
          text: err.error.msg,
          icon: 'error',
          showConfirmButton: true
        })
        });
    }
    
  }

  private getUser() {
    const lsUser = localStorage.getItem('user');
    this.user = lsUser ? JSON.parse(lsUser) : null;
    this.token = localStorage.getItem('token') || '';
    this.imgLoaded = null;

    const request: FileRequest = {
      entity: EntityNameEnum.Users,
      imageName: this.user && this.user.img ? this.user.img : 'no-image'
    };
    this.imgUserUrl = this.filesService.getImageEntity(request);
  }

  private updateFormValues(user: User) {
    this.formGroup.get('name')?.setValue(user.name);
    this.formGroup.get('email')?.setValue(user.email);

    Object.keys(this.formGroup.controls).forEach(key => {
      this.formGroup.get(key)?.updateValueAndValidity();
    });
    this.areDefaultValues = true;
  }
  
}
