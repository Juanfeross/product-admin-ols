import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <img
        [src]="product.image"
        [alt]="product.title"
        class="w-full h-48 object-cover"
      />
      <div class="p-4">
        <h3 class="text-lg font-semibold mb-2 line-clamp-2">{{ product.title }}</h3>
        <p class="text-gray-600 text-sm mb-2 line-clamp-2">{{ product.description }}</p>
        <div class="flex justify-between items-center mb-3">
          <span class="text-2xl font-bold text-blue-600">{{ product.price | currency:'USD':'symbol':'1.2-2' }}</span>
          <span class="text-sm text-gray-500">{{ product.category }}</span>
        </div>
        <div class="flex gap-2">
          <button
            (click)="onEdit.emit(product)"
            class="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Editar
          </button>
          <button
            (click)="onDelete.emit(product.id)"
            class="flex-1 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Output() onEdit = new EventEmitter<Product>();
  @Output() onDelete = new EventEmitter<number>();
}

