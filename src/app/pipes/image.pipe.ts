import { Pipe, PipeTransform } from '@angular/core';
import { EntityNameEnum } from '../models/api/entity-name-enum';
import { FileRequest } from '../models/api/file';
import { FilesService } from '../services/files.service';

@Pipe({
  name: 'imageUrl'
})
export class ImagePipe implements PipeTransform {

  constructor(private filesService: FilesService) {}

  transform(img: string, entity: EntityNameEnum): string {
    const request: FileRequest = {
      entity,
      imageName: img ? img : 'no-image'
    };
    return this.filesService.getImageEntity(request);
  }

}
