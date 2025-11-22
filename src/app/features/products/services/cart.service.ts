import { Injectable, inject, signal } from '@angular/core';
import { StorageService } from '../../../core/services/storage/storage.service';
import { CartItem } from '../models/cart-item.model';
import { Product } from '../models/product.model';

const CART_STORAGE_KEY = 'shopping-cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private storageService = inject(StorageService);
  
  cartItems = signal<CartItem[]>([]);
  cartCount = signal<number>(0);
  cartTotal = signal<number>(0);

  constructor() {
    this.loadCart();
  }

  private loadCart(): void {
    const stored = this.storageService.getItem<CartItem[]>(CART_STORAGE_KEY) || [];
    this.cartItems.set(stored);
    this.updateCartStats();
  }

  private saveCart(): void {
    this.storageService.setItem(CART_STORAGE_KEY, this.cartItems());
    this.updateCartStats();
  }

  private updateCartStats(): void {
    const items = this.cartItems();
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    this.cartCount.set(count);
    this.cartTotal.set(total);
  }

  addToCart(product: Product): void {
    const items = this.cartItems();
    const existingItem = items.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      items.push({ ...product, quantity: 1 });
    }

    this.cartItems.set([...items]);
    this.saveCart();
  }

  removeFromCart(productId: number): void {
    const items = this.cartItems().filter(item => item.id !== productId);
    this.cartItems.set(items);
    this.saveCart();
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const items = this.cartItems().map(item => 
      item.id === productId ? { ...item, quantity } : item
    );
    
    this.cartItems.set(items);
    this.saveCart();
  }

  clearCart(): void {
    this.cartItems.set([]);
    this.storageService.removeItem(CART_STORAGE_KEY);
    this.updateCartStats();
  }

  getCartItems(): CartItem[] {
    return this.cartItems();
  }

  getCartCount(): number {
    return this.cartCount();
  }

  getCartTotal(): number {
    return this.cartTotal();
  }
}

