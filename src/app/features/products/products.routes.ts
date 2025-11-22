import { Routes } from '@angular/router';

export const productsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/products-page/products-page.component').then(
        m => m.ProductsPageComponent
      )
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./pages/product-edit-page/product-edit-page.component').then(
        m => m.ProductEditPageComponent
      )
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/product-detail-page/product-detail-page.component').then(
        m => m.ProductDetailPageComponent
      )
  }
];

