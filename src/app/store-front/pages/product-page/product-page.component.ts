import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductImagePipe } from '@products/pipes/product-image.pipe';
import { ProductsService } from '@products/services/products.service';
import { ProductCarouselComponent } from '@store-front/components/product-carousel/product-carousel.component';

@Component({
  selector: 'app-product-page',
  imports: [ProductCarouselComponent],
  templateUrl: './product-page.component.html',
  styleUrl: './product-page.component.css',
})
export class ProductPageComponent {
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  productService = inject(ProductsService);

  slugProduct = this.activatedRoute.snapshot.paramMap.get('IdSlug') ?? 'ddd';

  productResource = rxResource({
    request: () => ({ slug: this.slugProduct }),
    loader: ({ request }) => {
      return this.productService.getProductBySlug(request.slug);
    },
  });
}
