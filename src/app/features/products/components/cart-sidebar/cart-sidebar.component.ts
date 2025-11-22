import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CartItem } from '../../models/cart-item.model';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../../../core/services/toast/toast.service';

@Component({
  selector: 'app-cart-sidebar',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './cart-sidebar.component.html',
  styleUrl: './cart-sidebar.component.css'
})
export class CartSidebarComponent {
  @Input() isOpen = false;
  @Output() closeCart = new EventEmitter<void>();

  private cartService = inject(CartService);
  private toastService = inject(ToastService);
  private mouseDownTarget: EventTarget | null = null;

  cartItems = this.cartService.cartItems;
  cartTotal = this.cartService.cartTotal;
  imageErrors = new Set<number>();
  defaultImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjZTVlN2ViIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMCIgZmlsbD0iIzljYTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbjwvdGV4dD48L3N2Zz4=';

  onClose(): void {
    this.closeCart.emit();
  }

  onBackdropMouseDown(event: MouseEvent): void {
    this.mouseDownTarget = event.target;
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === this.mouseDownTarget && event.target === event.currentTarget) {
      this.onClose();
    }
    this.mouseDownTarget = null;
  }

  updateQuantity(productId: number, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity);
  }

  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  getTotal(): number {
    return this.cartService.getCartTotal();
  }

  getItemSubtotal(item: CartItem): number {
    return item.price * item.quantity;
  }

  onCheckout(): void {
    this.toastService.info('Funcionalidad de checkout próximamente');
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.toastService.success('Carrito vaciado correctamente');
  }

  onImageError(itemId: number): void {
    this.imageErrors.add(itemId);
  }

  isImageError(itemId: number): boolean {
    return this.imageErrors.has(itemId);
  }
}

