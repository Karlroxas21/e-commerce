import { Cart } from './cart';
import { IProduct } from '../api/product';

const product: IProduct = {
  id: 2,
  title: 'Eyeshadow Palette with Mirror',
  description:
    "The Eyeshadow Palette with Mirror offers a versatile range of eyeshadow shades for creating stunning eye looks. With a built-in mirror, it's convenient for on-the-go makeup application.",
  category: 'beauty',
  price: 200,
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
};

describe('Cart Service', () => {
  let service: Cart;

  const mockItem = {
    productId: 2,
    product: product, // $200 price
    quantity: 1,
    subTotal: 200,
  };
  const rules = {
    minSubtotal: 100,
    percentage: 0.1,
    maxDiscountPerItem: 50,
  };

  beforeEach(() => {
    service = new Cart();
  });

  it('SAVE10: should apply 10% discount if subtotal >= 100 and cap at 50 per item', () => {
    expect(service.calculateDiscount(mockItem, rules)).toBe(20);

    const cappedItem = {
      ...mockItem,
      subTotal: 1000,
    };
    expect(service.calculateDiscount(cappedItem, rules)).toBe(50); // Capped
  });

  it('SAVE10: should return 0 if subtotal < $100', () => {
    const mockItem = {
      productId: 2,
      product: product, // $200 price
      quantity: 1,
      subTotal: 50,
    };
    expect(service.calculateDiscount(mockItem, rules)).toBe(0);
  });
});
