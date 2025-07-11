import { Component, computed, inject, OnInit, Signal } from '@angular/core';
import { Cart, CartItem } from '../../../service/cart/cart';
import { ImageModule } from 'primeng/image';
import { DecimalPipe } from '@angular/common';
import {
  LucideAngularModule,
  ShoppingCart,
  Minus,
  Plus,
  PhilippinePeso,
} from 'lucide-angular';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart-summary',
  imports: [
    ImageModule,
    DecimalPipe,
    LucideAngularModule,
    DividerModule,
    InputTextModule,
    ButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './cart-summary.html',
  styleUrl: './cart-summary.css',
})
export class CartSummary implements OnInit {
  readonly ShoppingCart = ShoppingCart;
  readonly Minus = Minus;
  readonly Plus = Plus;
  readonly PhilippinePeso = PhilippinePeso;

  couponForm: FormGroup;

  cartService = inject(Cart);
  private fb = inject(FormBuilder);

  constructor() {
    this.couponForm = this.fb.group({
      code: [''],
    });
  }

  ngOnInit() {
    this.cartService.loadFromLocalStorage();
  }

  protected quantitySignals = new Map<number, Signal<number>>();

  protected cartItems = computed<CartItem[]>(() =>
    this.cartService.cartItems(),
  );

  protected grandTotal = computed<number>(() => this.cartService.grandTotal());

  getQuantitySignal(productId: number): Signal<number> {
    if (!this.quantitySignals.has(productId)) {
      this.quantitySignals.set(
        productId,
        this.cartService.getQuantitySignal(productId),
      );
    }
    return this.quantitySignals.get(productId)!;
  }

  updateQuantity(productId: number, newQty: number) {
    this.cartService.updateQuantity(productId, newQty < 1 ? 1 : newQty);
  }

  removeFromCart(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  isValidCoupon(code: string): boolean {
    return this.cartService.isCouponValid(code);
  }

  applyCoupon(code: string): void {
    return this.cartService.applyCoupon(code);
  }

  onApplyCoupon() {
    const code = this.couponForm.value.code!;

    if (this.isValidCoupon(code)) {
      this.applyCoupon(code);
      console.log(this.cartItems());
    } else {
      console.log('INVALID COUPON BOY');
    }
  }
}
