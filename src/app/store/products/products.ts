import { Component, effect, inject, OnInit, signal } from '@angular/core';
import {
  IProduct,
  Order,
  Product,
  ProductResponse,
  SortByProduct,
} from '../../../service/api/product';
import { GalleriaModule } from 'primeng/galleria';
import { ImageModule } from 'primeng/image';
import {
  LucideAngularModule,
  ShoppingCart,
  PhilippinePeso,
  Minus,
  Plus,
} from 'lucide-angular';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { MultiSelectModule } from 'primeng/multiselect';
import { SkeletonModule } from 'primeng/skeleton';
import { CartSummary } from '../cart-summary/cart-summary';
import { Cart } from '../../../service/cart/cart';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-products',
  imports: [
    GalleriaModule,
    ImageModule,
    LucideAngularModule,
    RatingModule,
    FormsModule,
    PaginatorModule,
    MultiSelectModule,
    SkeletonModule,
    CartSummary,
  ],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit {
  // Lucide Icons
  readonly ShoppingCart = ShoppingCart;
  readonly PhilippinePeso = PhilippinePeso;
  readonly Minus = Minus;
  readonly Plus = Plus;

  MAX_PRODUCT_LENGTH = 194;

  isProductDetailModalVisible = signal(false);

  productService = inject(Product);
  cartService = inject(Cart);
  activatedRoute = inject(ActivatedRoute);

  ngOnInit() {
    this.loadAllProducts({ limit: this.MAX_PRODUCT_LENGTH });
  }

  constructor() {
    effect(() => {
      this.activatedRoute.queryParamMap.subscribe((params) => {
        this.selectedCategory = params.get('category');
        this.getProductByCategory(this.selectedCategory);
      });
    });
  }

  isLoadingAllProducts = true;
  products?: ProductResponse;
  selectedProduct?: IProduct;
  searchedProduct?: ProductResponse;

  addToCardButtonLoading = false;

  //   paginatedProducts?: IProduct[];
  paginatedProducts = signal<IProduct[]>([]);
  currentPage = 0;
  rowsPerPage = 9;

  selectedCategory: string | null = '';

  protected quantitySignals = signal<Record<number, number>>({});

  loadAllProducts(options?: {
    limit?: number;
    skip?: number;
    sortBy?: SortByProduct;
    order?: Order;
  }) {
    this.isLoadingAllProducts = true;

    this.productService.getAllProducts(options).subscribe({
      next: (data) => {
        this.products = data;
        this.updatePaginatedProducts();
        // console.log('All products: ', this.products);
      },
      error: (err) => {
        console.error('Error loading products: ', err);
      },
      complete: () => {
        this.isLoadingAllProducts = false;
      },
    });
  }

  findProductById(id: number) {
    this.productService.findProductById(id).subscribe({
      next: (data) => {
        console.log(`Product with id ${id}`, data);
        this.selectedProduct = data;
      },
      error: (err) => {
        console.error('Error finding products: ', err);
      },
    });
  }

  searchProduct(query: string) {
    this.productService.searchProduct(query).subscribe({
      next: (data) => {
        console.log(`Product with search`, data);
        this.searchedProduct = data;
      },
      error: (err) => {
        console.error('Error finding product with query: ', err);
      },
    });
  }

  getProductByCategory(category: string | null) {
    this.productService.getProductByCategory(category).subscribe({
      next: (data) => {
        console.log('Product Category List: ', data);
        // this.searchedProduct = data;
        this.paginatedProducts.set(data.products);
      },
      error: (err) => {
        console.error('Error finding product by category: ', err);
      },
    });
  }

  transformToGalleriaFormat(images: string[]) {
    return images.map((url) => ({
      itemImageSrc: url,
      thumbnailImageSrc: url,
    }));
  }

  responsiveOptions = [
    {
      breakpoint: '1300px',
      numVisible: 4,
    },
    {
      breakpoint: '575px',
      numVisible: 1,
    },
  ];

  private updatePaginatedProducts() {
    const start = this.currentPage * this.rowsPerPage;
    const end = start + this.rowsPerPage;
    // this.paginatedProducts = this.products?.products.slice(start, end);
    this.paginatedProducts.set(this.products!.products.slice(start, end));
  }

  protected onPageChange(event: PaginatorState) {
    this.currentPage = event.page ?? 0;
    this.rowsPerPage = event.rows ?? 10;
    this.updatePaginatedProducts();
  }

  getQuantitySignal(productId: number): number {
    if (!this.quantitySignals()[productId]) {
      this.quantitySignals.set([productId, 1]);
    }
    return this.quantitySignals()[productId];
  }

  updateQuantity(productId: number, newQty: number) {
    const current = this.quantitySignals();
    // this.cartService.updateQuantity(productId, newQty < 1 ? 1 : newQty);
    this.quantitySignals.set({
      ...current,
      [productId]: newQty,
    });
  }

  // add quantity
  protected addToCartProduct(product: IProduct, qty: number) {
    this.cartService.addToCart(product, qty);
    delete this.quantitySignals()[product.id];
  }
}
