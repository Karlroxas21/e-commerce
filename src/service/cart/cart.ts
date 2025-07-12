import { computed, Injectable, Signal, signal } from '@angular/core';
import { IProduct } from '../api/product';

export interface CartItem {
  productId: number;
  product: IProduct;
  quantity: number;
  subTotal: number;
}

export interface Coupons {
  name: string;
  rules: {
    minSubtotal: number;
    percentage: number;
    maxDiscountPerItem: number;
  };
}

export const COUPONS: Coupons[] = [
  {
    name: 'SAVE10',
    rules: { minSubtotal: 100, percentage: 0.1, maxDiscountPerItem: 50 },
  },
  {
    name: 'HIREME',
    rules: { minSubtotal: 0, percentage: 0.9, maxDiscountPerItem: 9999 },
  },
];

@Injectable({
  providedIn: 'root',
})
export class Cart {
  readonly cart = signal<
    Record<number, { product: IProduct; quantity: number }>
  >({});

  cartItems = computed<CartItem[]>(() =>
    Object.entries(this.cart()).map(([productId, entry]) => ({
      productId: +productId,
      product: entry.product,
      quantity: entry.quantity,
      subTotal: entry.product.price * entry.quantity,
    })),
  );

  readonly tempQuantities = signal<Record<number, number>>({});

  readonly selectedCoupon = signal<Coupons | null>(null);
  readonly couponError = signal<string | null>(null);

  readonly grandTotal = computed(() =>
    this.cartItems().reduce((sum, item) => sum + item.subTotal, 0),
  );

  readonly totalDiscount = computed(() => {
    const coupon = this.selectedCoupon();
    if (!coupon) return 0;

    return this.cartItems().reduce((acc, items) => {
      return acc + this.calculateDiscount(items, coupon.rules);
    }, 0);
  });

  //   readonly discountedCartItems = computed(() => {
  //     const coupon = this.selectedCoupon();
  //     return this.cartItems().map((item) => {
  //       const discount = coupon ? this.calculateDiscount(item, coupon.rules) : 0;
  //       return {
  //         ...item,
  //         discount,
  //         discountedPrice: item.subTotal - discount,
  //       };
  //     });
  //   });

  readonly discountedTotal = computed(
    () => this.grandTotal() - this.totalDiscount(),
  );

  readonly isCouponInvalid = signal<boolean>(false);

  addToCart(product: IProduct, quantity: number) {
    const current = this.cart();
    const existing = current[product.id];
    console.log(
      'ADD to cart service qty: ',
      quantity,
      'temp qty: ',
      this.tempQuantities()[product.id],
    );

    if (existing) {
      this.cart.set({
        ...current,
        [product.id]: {
          product,
          quantity: existing.quantity + quantity,
        },
      });
    } else {
      const temp = quantity ?? 1;
      this.cart.set({
        ...current,
        [product.id]: { product, quantity: temp },
      });

      const updatedTemp = { ...this.tempQuantities() };
      delete updatedTemp[product.id];
      this.tempQuantities.set(updatedTemp);
    }

    this.selectedCoupon.set(null);
    this.isCouponInvalid.set(false);
    this.saveToLocalStorage();
  }

  updateQuantity(productId: number, quantity: number) {
    const current = this.cart();
    const clamped = quantity < 1 ? 1 : quantity;

    if (current[productId]) {
      this.cart.set({
        ...current,
        [productId]: {
          ...current[productId],
          quantity: clamped,
        },
      });

      this.saveToLocalStorage();
    } else {
      this.tempQuantities.set({
        ...this.tempQuantities(),
        [productId]: clamped,
      });
    }
    console.log('UPDATED QUANTITY CLICKED: ', current[productId]);
  }

  getQuantitySignal(productId: number): Signal<number> {
    return computed(
      () =>
        this.cart()[productId]?.quantity ??
        this.tempQuantities()[productId] ??
        1,
    );
  }

  removeFromCart(productId: number) {
    const current = this.cart();

    const updated = { ...current };
    delete updated[productId];
    this.cart.set(updated);
    this.saveToLocalStorage();
  }

  loadFromLocalStorage() {
    const data = localStorage.getItem('cart');
    if (data) {
      this.cart.set(JSON.parse(data));
    }
  }

  saveToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(this.cart()));
  }

  isCouponValid(code: string): boolean {
    return COUPONS.some((c) => c.name === code);
  }

  applyCoupon(code: string) {
    const isCouponValid = COUPONS.find((c) => c.name == code);

    if (!isCouponValid) {
      this.selectedCoupon.set(null);
      this.isCouponInvalid.set(false);
      return;
    }

    const hasValidItem = this.cartItems().some(
      (item) => item.subTotal >= isCouponValid.rules.minSubtotal,
    );

    if (!hasValidItem) {
      this.selectedCoupon.set(null);
      this.couponError.set(
        `Coupon applies only to items with subtotal of at least $${isCouponValid.rules.minSubtotal}.`,
      );
      return;
    }

    this.selectedCoupon.set(isCouponValid);
    this.isCouponInvalid.set(true);
    this.couponError.set(null);
  }

  calculateDiscount(
    item: CartItem,
    rules: {
      minSubtotal: number;
      percentage: number;
      maxDiscountPerItem: number;
    },
  ): number {
    if (item.subTotal >= rules.minSubtotal) {
      return Math.min(
        item.subTotal * rules.percentage,
        rules!.maxDiscountPerItem,
      );
    }

    return 0;
  }
}
