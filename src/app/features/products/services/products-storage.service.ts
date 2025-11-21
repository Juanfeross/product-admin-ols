import { Injectable, inject } from '@angular/core';
import { StorageService } from '../../../core/services/storage/storage.service';
import { Product } from '../models/product.model';

const STORAGE_KEY = 'products';

@Injectable({
  providedIn: 'root'
})
export class ProductsStorageService {
  private storageService = inject(StorageService);

  saveProducts(products: Product[]): void {
    this.storageService.setItem(STORAGE_KEY, products);
  }

  getProducts(): Product[] {
    return this.storageService.getItem<Product[]>(STORAGE_KEY) || [];
  }

  clearProducts(): void {
    this.storageService.removeItem(STORAGE_KEY);
  }
}

