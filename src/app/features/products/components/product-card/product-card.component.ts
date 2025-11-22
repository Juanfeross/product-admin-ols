import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, RouterModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Input() deleting = false;
  @Input() cartQuantity = 0;
  @Output() onEdit = new EventEmitter<Product>();
  @Output() onDelete = new EventEmitter<number>();
  @Output() onAddToCart = new EventEmitter<Product>();
  @Output() onUpdateQuantity = new EventEmitter<{ productId: number; quantity: number }>();

  imageError = false;
  defaultImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2U1ZTdlYiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZW4gbm8gZGlzcG9uaWJsZTwvdGV4dD48L3N2Zz4=';

  onImageError(): void {
    this.imageError = true;
  }

  incrementQuantity(): void {
    this.onUpdateQuantity.emit({ productId: this.product.id, quantity: this.cartQuantity + 1 });
  }

  decrementQuantity(): void {
    if (this.cartQuantity > 0) {
      this.onUpdateQuantity.emit({ productId: this.product.id, quantity: this.cartQuantity - 1 });
    }
  }
}

