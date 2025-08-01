import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import {
  IProduct,
  Product as ProductService,
  ProductResponse,
} from './product';
import { environment } from '../../environments/environment';

describe('Product Service', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService],
    });

    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verify no unmatched requests
  });

  it('should fetch all products with no parameters', () => {
    const mockResponse: ProductResponse = {
      products: [
        {
          id: 1,
          title: 'Essence Mascara Lash Princess',
          description:
            'The Essence Mascara Lash Princess is a popular mascara known for its volumizing and lengthening effects. Achieve dramatic lashes with this long-lasting and cruelty-free formula.',
          category: 'beauty',
          price: 9.99,
          discountPercentage: 10.48,
          rating: 2.56,
          stock: 99,
          tags: ['beauty', 'mascara'],
          brand: 'Essence',
          sku: 'BEA-ESS-ESS-001',
          weight: 4,
          dimensions: {
            width: 15.14,
            height: 13.08,
            depth: 22.99,
          },
          warrantyInformation: '1 week warranty',
          shippingInformation: 'Ships in 3-5 business days',
          availabilityStatus: 'In Stock',
          reviews: [
            {
              rating: 3,
              comment: 'Would not recommend!',
              date: '2025-04-30T09:41:02.053Z' as unknown as Date,
              reviewerName: 'Eleanor Collins',
              reviewerEmail: 'eleanor.collins@x.dummyjson.com',
            },
            {
              rating: 4,
              comment: 'Very satisfied!',
              date: '2025-04-30T09:41:02.053Z' as unknown as Date,
              reviewerName: 'Lucas Gordon',
              reviewerEmail: 'lucas.gordon@x.dummyjson.com',
            },
            {
              rating: 5,
              comment: 'Highly impressed!',
              date: '2025-04-30T09:41:02.053Z' as unknown as Date,
              reviewerName: 'Eleanor Collins',
              reviewerEmail: 'eleanor.collins@x.dummyjson.com',
            },
          ],
          returnPolicy: 'No return policy',
          minimumOrderQuantity: 48,
          meta: {
            createdAt: '2025-04-30T09:41:02.053Z',
            updatedAt: '2025-04-30T09:41:02.053Z',
            barcode: '5784719087687',
            qrCode: 'https://cdn.dummyjson.com/public/qr-code.png',
          },
          images: [
            'https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/1.webp',
          ],
          thumbnail:
            'https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp',
        },
        {
          id: 2,
          title: 'Eyeshadow Palette with Mirror',
          description:
            "The Eyeshadow Palette with Mirror offers a versatile range of eyeshadow shades for creating stunning eye looks. With a built-in mirror, it's convenient for on-the-go makeup application.",
          category: 'beauty',
          price: 19.99,
          discountPercentage: 18.19,
          rating: 2.86,
          stock: 34,
          tags: ['beauty', 'eyeshadow'],
          brand: 'Glamour Beauty',
          sku: 'BEA-GLA-EYE-002',
          weight: 9,
          dimensions: {
            width: 9.26,
            height: 22.47,
            depth: 27.67,
          },
          warrantyInformation: '1 year warranty',
          shippingInformation: 'Ships in 2 weeks',
          availabilityStatus: 'In Stock',
          reviews: [
            {
              rating: 5,
              comment: 'Great product!',
              date: '2025-04-30T09:41:02.053Z' as unknown as Date,
              reviewerName: 'Savannah Gomez',
              reviewerEmail: 'savannah.gomez@x.dummyjson.com',
            },
            {
              rating: 4,
              comment: 'Awesome product!',
              date: '2025-04-30T09:41:02.053Z' as unknown as Date,
              reviewerName: 'Christian Perez',
              reviewerEmail: 'christian.perez@x.dummyjson.com',
            },
            {
              rating: 1,
              comment: 'Poor quality!',
              date: '2025-04-30T09:41:02.053Z' as unknown as Date,
              reviewerName: 'Nicholas Bailey',
              reviewerEmail: 'nicholas.bailey@x.dummyjson.com',
            },
          ],
          returnPolicy: '7 days return policy',
          minimumOrderQuantity: 20,
          meta: {
            createdAt: '2025-04-30T09:41:02.053Z',
            updatedAt: '2025-04-30T09:41:02.053Z',
            barcode: '9170275171413',
            qrCode: 'https://cdn.dummyjson.com/public/qr-code.png',
          },
          images: [
            'https://cdn.dummyjson.com/product-images/beauty/eyeshadow-palette-with-mirror/1.webp',
          ],
          thumbnail:
            'https://cdn.dummyjson.com/product-images/beauty/eyeshadow-palette-with-mirror/thumbnail.webp',
        },
      ],
      total: 194,
      skip: 0,
      limit: 2,
    };

    service.getAllProducts().subscribe((res) => {
      expect(res).toBeTruthy();
      expect(res.total).toBeGreaterThanOrEqual(1);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/products`);
    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);
  });

  it('should get product with id 1', () => {
    const mockResponse: IProduct = {
      id: 1,
      title: 'Essence Mascara Lash Princess',
      description:
        'The Essence Mascara Lash Princess is a popular mascara known for its volumizing and lengthening effects. Achieve dramatic lashes with this long-lasting and cruelty-free formula.',
      category: 'beauty',
      price: 9.99,
      discountPercentage: 10.48,
      rating: 2.56,
      stock: 99,
      tags: ['beauty', 'mascara'],
      brand: 'Essence',
      sku: 'BEA-ESS-ESS-001',
      weight: 4,
      dimensions: {
        width: 15.14,
        height: 13.08,
        depth: 22.99,
      },
      warrantyInformation: '1 week warranty',
      shippingInformation: 'Ships in 3-5 business days',
      availabilityStatus: 'In Stock',
      reviews: [
        {
          rating: 3,
          comment: 'Would not recommend!',
          date: '2025-04-30T09:41:02.053Z' as unknown as Date,
          reviewerName: 'Eleanor Collins',
          reviewerEmail: 'eleanor.collins@x.dummyjson.com',
        },
        {
          rating: 4,
          comment: 'Very satisfied!',
          date: '2025-04-30T09:41:02.053Z' as unknown as Date,
          reviewerName: 'Lucas Gordon',
          reviewerEmail: 'lucas.gordon@x.dummyjson.com',
        },
        {
          rating: 5,
          comment: 'Highly impressed!',
          date: '2025-04-30T09:41:02.053Z' as unknown as Date,
          reviewerName: 'Eleanor Collins',
          reviewerEmail: 'eleanor.collins@x.dummyjson.com',
        },
      ],
      returnPolicy: 'No return policy',
      minimumOrderQuantity: 48,
      meta: {
        createdAt: '2025-04-30T09:41:02.053Z',
        updatedAt: '2025-04-30T09:41:02.053Z',
        barcode: '5784719087687',
        qrCode: 'https://cdn.dummyjson.com/public/qr-code.png',
      },
      images: [
        'https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/1.webp',
      ],
      thumbnail:
        'https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp',
    };

    service.findProductById(1).subscribe((res) => {
      expect(res).toBeTruthy();
      expect(res.id).toBe(1);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/products/1`);
    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);
  });
});
