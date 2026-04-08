import { Component, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductCardComponent } from '@products/components/product-card/product-card.component';
import { ProductsService } from '@products/services/products.service';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { map } from 'rxjs';
// import { ProductCardComponent } from '../../../products/components/product-card/product-card.component';

@Component({
  selector: 'app-home-page',
  imports: [ProductCardComponent, PaginationComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent {
  private productsService = inject(ProductsService);
  paginationServices = inject(PaginationService);

  // activatedRoute = inject(ActivatedRoute);

  // currentPage = toSignal(
  //   this.activatedRoute.queryParamMap.pipe(
  //     map((params) => {
  //       // console.log(params);
  //       return params.get('page') ? +params.get('page')! : 1;
  //     }),
  //     map((page) => {
  //       return isNaN(page) ? 1 : page;
  //     }),
  //   ),
  //   {
  //     initialValue: 1,
  //   },
  // );

  productsResources = rxResource({
    request: () => ({ page: this.paginationServices.currentPage() - 1 }),
    loader: ({ request }) => {
      return this.productsService.getProducts({
        offset: request.page * 9,
      });
    },
  });
}
