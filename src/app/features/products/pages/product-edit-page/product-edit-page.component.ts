import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-edit-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-6">Editar Producto</h1>
      <ng-content></ng-content>
    </div>
  `,
  styles: []
})
export class ProductEditPageComponent {}

