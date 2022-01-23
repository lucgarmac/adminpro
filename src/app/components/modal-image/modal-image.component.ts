import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { EntityNameEnum } from 'src/app/models/api/entity-name-enum';
import { FileRequest, FileUploadRequest } from 'src/app/models/api/file';
import { ModalImageService } from 'src/app/services/components/modal-image.service';
import { FilesService } from 'src/app/services/files.service';
import Swal from 'sweetalert2';
import { ImageFile } from '../../models/components/image-file';

@Component({
  selector: 'app-modal-image',
  templateUrl: './modal-image.component.html',
  styleUrls: ['./modal-image.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalImageComponent implements OnInit {

  private id: string;
  private token: string;

  showModal: boolean = false;
  errorMsg: string;
  imgLoaded: ImageFile;
  entity: EntityNameEnum;
  singularEntity: string;
  defaultImageUrl: string;
  usePipeImage: boolean = false;

  @ViewChild('inputFile', { static: false }) inpuFileElement: ElementRef;

  constructor(private filesService: FilesService,
    private modalImageService: ModalImageService,
    private cd: ChangeDetectorRef) { }

  ngOnInit(): void {

    this.modalImageService.dataModel$.subscribe((data) => {
      this.showModal = !data.hide;
      this.entity = data.entityDataModal ? data.entityDataModal.entity : null;
      this.defaultImageUrl = data.entityDataModal ? data.entityDataModal.defaultImageUrl : null;
      this.id = data.entityDataModal ? data.entityDataModal.id : null;
      this.token = data.entityDataModal ? data.entityDataModal.token : null;
      this.usePipeImage = this.defaultImageUrl && !(this.defaultImageUrl.includes('http') || this.defaultImageUrl.includes('https'));

      if (!this.defaultImageUrl) {
        this.loadDefaultImage();
      }
      this.cd.detectChanges();
    });

  }

  private loadDefaultImage() {
    const request: FileRequest = {
      entity: EntityNameEnum.Users,
      imageName: 'no-image'
    };
    this.defaultImageUrl = this.filesService.getImageEntity(request)
  }

  loadImage(event: any) {
    const files = event.srcElement.files;
    this.errorMsg = '';
    if (files && files.length) {
      const tempFile = files[0];
      const fileExtensionsAllowed = ['png', 'jpeg', 'jpg', 'gif'];
      const tempFileExt = tempFile.name.substring(tempFile.name.lastIndexOf('.') + 1);

      if (fileExtensionsAllowed.includes(tempFileExt)) {
        const reader = new FileReader();
        reader.readAsDataURL(tempFile);
        reader.onload = () => {
          this.imgLoaded = {
            file: tempFile,
            path: reader.result,
            name: tempFile.name
          };
          this.cd.detectChanges();
        }

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

  updateImage() {
    if (this.imgLoaded && this.token && this.id) {
      const request: FileUploadRequest = {
        id: this.id,
        entity: this.entity,
        img: this.imgLoaded.file
      };
      this.filesService.uploadImage(this.token, request)
        .subscribe({
          next: response => {
            Swal.fire({
              title: 'Update image',
              text: 'The image has been update successfully',
              icon: 'success',
              showConfirmButton: false,
              timer: 1500
            });
            this.showModal = false;
            this.modalImageService.updateImageSuccess.emit(response);
            this.cd.detectChanges();
          },
          error: err => Swal.fire({
            title: 'Update image',
            text: err.error.msg,
            icon: 'error',
            showConfirmButton: true
          })
        });
    }
  }

  closeModal() {
    this.cleanValues();
    this.removeTempImage();
    this.cd.detectChanges();
  }

  private cleanValues() {
    this.showModal = false;
    this.entity = null;
    this.defaultImageUrl = null;
    this.id = null;
    this.token = null;
    this.usePipeImage = false;
  }
}
