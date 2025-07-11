import { Component, OnInit } from '@angular/core';
import { Product, ProductCategory } from '../../../service/api/product';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-categories',
  imports: [RouterModule],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories implements OnInit {
  productCategories!: ProductCategory[];
  productCategoryList!: string[];

  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private productService: Product) {}

  ngOnInit() {
    this.getAllProductCategories();
  }

  getAllProductCategories() {
    this.productService.getAllProductCategories().subscribe({
      next: (data) => {
        console.log('Product categories: ', data);
        this.productCategories = data;
      },
      error: (err) => {
        console.error('Error finding product categories: ', err);
      },
    });
  }

  getProductsCategoryList() {
    this.productService.getProductsCategoryList().subscribe({
      next: (data) => {
        console.log('Product Category List: ', data);
        this.productCategoryList = data;
      },
      error: (err) => {
        console.error('Error finding product category list: ', err);
      },
    });
  }
}
