import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { addParamIfDefined } from '../../utils/url';

interface IDimensions {
  width: number;
  height: number;
  depth: number;
}

interface IReview {
  rating: number;
  comment: string;
  date: Date;
  reviewerName: string;
  reviewerEmail: string;
}

interface IMetadata {
  createdAt: string;
  updatedAt: string;
  barcode: string;
  qrCode: string;
}

export interface IProduct {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  sku: string;
  weight: number;
  dimensions: IDimensions;
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: IReview[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: IMetadata;
  images: string[];
  thumbnail: string;
}

export interface ProductResponse {
  products: IProduct[];
  total: number;
  skip: number;
  limit: number;
}

export interface ProductCategory {
  slug: string;
  name: string;
  url: string;
}

export type SortByProduct = 'title' | 'category' | 'rating';

export type Order = 'asc' | 'desc';

@Injectable({
  providedIn: 'root',
})
export class Product {
  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private http: HttpClient) {}

  getAllProducts(options?: {
    limit?: number;
    skip?: number;
    sortBy?: SortByProduct;
    order?: Order;
  }): Observable<ProductResponse> {
    let params = new HttpParams();

    params = addParamIfDefined(params, 'limit', options?.limit);
    params = addParamIfDefined(params, 'skip', options?.skip);
    params = addParamIfDefined(params, 'sortBy', options?.sortBy);
    params = addParamIfDefined(params, 'order', options?.order);

    return this.http
      .get<ProductResponse>('https://dummyjson.com/products', { params })
      .pipe(
        catchError((error) => {
          console.error('API error:', error);
          return throwError(() => new Error('Something went wrong'));
        }),
      );
  }

  findProductById(id: number): Observable<IProduct> {
    return this.http.get<IProduct>(`https://dummyjson.com/products/${id}`).pipe(
      catchError((error) => {
        console.error('API error: ', error);
        return throwError(() => new Error('Something went wrong'));
      }),
    );
  }

  searchProduct(q: string): Observable<ProductResponse> {
    let params = new HttpParams();

    params = addParamIfDefined(params, 'q', q);

    return this.http
      .get<ProductResponse>(`https://dummyjson.com/products/search?`, {
        params,
      })
      .pipe(
        catchError((error) => {
          console.error('API error:', error);
          return throwError(() => new Error('Something went wrong'));
        }),
      );
  }

  getAllProductCategories(): Observable<ProductCategory[]> {
    return this.http
      .get<ProductCategory[]>('https://dummyjson.com/products/categories')
      .pipe(
        catchError((error) => {
          console.error('API error:', error);
          return throwError(() => new Error('Something went wrong'));
        }),
      );
  }

  getProductsCategoryList(): Observable<string[]> {
    return this.http
      .get<string[]>('https://dummyjson.com/products/category-list')
      .pipe(
        catchError((error) => {
          console.error('API error:', error);
          return throwError(() => new Error('Something went wrong'));
        }),
      );
  }

  getProductByCategory(category: string | null): Observable<ProductResponse> {
    return this.http
      .get<ProductResponse>(
        `https://dummyjson.com/products/category/${category}`,
      )
      .pipe(
        catchError((error) => {
          console.error('API Error: ', error);
          return throwError(() => new Error('Something went wrong'));
        }),
      );
  }
}
