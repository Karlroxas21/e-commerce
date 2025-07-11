import { Routes } from '@angular/router';
import { Products } from './store/products/products';
import { Home } from './home/home';
import { NotFound } from './not-found/not-found';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'products', component: Products },
  { path: '**', component: NotFound },
];
