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
  }
];

