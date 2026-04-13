import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductTableComponent } from '@products/components/product-table/product-table.component';
import { ProductsService } from '@products/services/products.service';
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-products-admin-page',
  imports: [ProductTableComponent, PaginationComponent, RouterLink],
  templateUrl: './products-admin-page.component.html',
  styleUrl: './products-admin-page.component.css',
})
export class ProductsAdminPageComponent {
  productsService = inject(ProductsService);
  paginationServices = inject(PaginationService);

  productSelectedPage = signal(10);

  productsResources = rxResource({
    request: () => ({
      page: this.paginationServices.currentPage() - 1,
      limit: this.productSelectedPage(),
    }),
    loader: ({ request }) => {
      return this.productsService.getProducts({
        offset: request.page * this.productSelectedPage(),
        limit: request.limit,
      });
    },
  });
}
