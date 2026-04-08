import { computed, Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl;

//Pipe para regresar imagena  bas e de un string o array de strings
@Pipe({
  name: 'productImage',
})
export class ProductImagePipe implements PipeTransform {
  transform(value: string | string[]): string {
    if (typeof value === 'string') {
      return `${baseUrl}/files/product/${value}`;
    }

    if (value.length > 0 && value[0]) {
      return `${baseUrl}/files/product/${value[0]}`;
    }

    return './assets/images/no-image.jpg';
  }
}
