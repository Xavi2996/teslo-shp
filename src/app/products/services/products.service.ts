import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '@auth/interfaces/user.interface';
import {
  Gender,
  Product,
  ProductsResponse,
} from '@products/interfaces/product.interface';
import { Observable, of, pipe, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl;

interface Options {
  limit?: number;
  offset?: number;
  gender?: string;
}

const emptyProduct: Product = {
  id: 'new',
  title: '',
  price: 0,
  description: '',
  slug: '',
  stock: 0,
  sizes: [],
  gender: Gender.Kid,
  tags: [],
  images: [],
  user: {} as User,
};

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  http = inject(HttpClient);

  productsCache = new Map<string, ProductsResponse>();
  productCache = new Map<string, Product>();

  getProducts(options: Options): Observable<ProductsResponse> {
    const { limit = 10, offset = 0, gender = '' } = options;

    const key = `${limit}-${offset}-${gender}`;
    if (this.productsCache.has(key)) {
      return of(this.productsCache.get(key)!);
    }

    return this.http
      .get<ProductsResponse>(`${baseUrl}/products`, {
        params: {
          limit: limit,
          offset: offset,
          gender: gender,
        },
      })
      .pipe(
        tap((response) => {
          console.log('ProductsResponse:', response);
          return response;
        }),
        tap((response) => {
          this.productsCache.set(key, response);
        }),
      );
  }

  getProductBySlug(slug: string): Observable<Product> {
    if (this.productCache.has(slug)) {
      return of(this.productCache.get(slug)!);
    }
    return this.http.get<Product>(`${baseUrl}/products/${slug}`).pipe(
      tap((response) => {
        console.log('respuesta getProductBySlug:', response);

        this.productCache.set(slug, response);
        return response;
      }),
    );
  }

  getProductById(id: string): Observable<Product> {
    if (id === 'new') {
      return of(emptyProduct);
    }

    if (this.productCache.has(id)) {
      return of(this.productCache.get(id)!);
    }
    return this.http.get<Product>(`${baseUrl}/products/${id}`).pipe(
      tap((response) => {
        console.log('respuesta getProductById:', response);

        this.productCache.set(id, response);
        return response;
      }),
    );
  }

  updateProduct(
    id: string,
    productLike: Partial<Product>,
  ): Observable<Product> {
    return this.http
      .patch<Product>(`${baseUrl}/products/${id}`, productLike)
      .pipe(
        tap((response) => {
          this.updateProductCache(response);
        }),
      );
  }

  updateProductCache(product: Product) {
    const producId = product.id;
    this.productCache.set(producId, product);

    this.productsCache.forEach((producRespones) => {
      producRespones.products = producRespones.products.map(
        (currentProduct) => {
          if (currentProduct.id === producId) {
            return product;
          }
          return currentProduct;
        },
      );
    });
    console.log('Caché actualizado');
  }

  createProduct(productLike: Partial<Product>): Observable<Product> {
    console.log(productLike);

    return this.http.post<Product>(`${baseUrl}/products`, productLike).pipe(
      tap((product) => {
        console.log('Producto creado:', product);
        this.updateProductCache(product);
      }),
    );
  }
}
