import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { productsRoutes } from './features/products/products.routes';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'products',
        children: productsRoutes
      },
      {
        path: '',
        redirectTo: '/products',
        pathMatch: 'full'
      }
    ]
  }
];
