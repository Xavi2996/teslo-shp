import { Component, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '@products/services/products.service';
import { map } from 'rxjs';
import { ProductCardComponent } from '@products/components/product-card/product-card.component';
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';

@Component({
  selector: 'app-gender-page',
  imports: [ProductCardComponent, PaginationComponent],
  templateUrl: './gender-page.component.html',
  styleUrl: './gender-page.component.css',
})
export class GenderPageComponent {
  routerActive = inject(ActivatedRoute);
  productsService = inject(ProductsService);
  paginationServices = inject(PaginationService);

  gender = toSignal(
    this.routerActive.params.pipe(
      map((params) => {
        return params['gender'];
      }),
    ),
  );

  productsResources = rxResource({
    request: () => ({
      gender: this.gender(),
      page: this.paginationServices.currentPage() - 1,
    }),
    loader: ({ request }) => {
      return this.productsService.getProducts({
        gender: request.gender,
        offset: request.page,
      });
    },
  });
}
