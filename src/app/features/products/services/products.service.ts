import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from '../../../core/services/api/api.service';
import { StorageService } from '../../../core/services/storage/storage.service';
import { Product, CreateProductDto, UpdateProductDto } from '../models/product.model';

const STORAGE_KEY = 'products';
const API_URL = 'https://fakestoreapi.com/products';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private apiService = inject(ApiService);
  private storageService = inject(StorageService);

  private getStoredProducts(): Product[] {
    return this.storageService.getItem<Product[]>(STORAGE_KEY) || [];
  }

  private setStoredProducts(products: Product[]): void {
    this.storageService.setItem(STORAGE_KEY, products);
  }

  getAll(): Observable<Product[]> {
    const stored = this.getStoredProducts();
    if (stored.length > 0) {
      return of(stored);
    }
    return this.apiService.get<Product[]>(API_URL);
  }

  getById(id: number): Observable<Product | undefined> {
    const stored = this.getStoredProducts();
    const product = stored.find(p => p.id === id);
    if (product) {
      return of(product);
    }
    return this.apiService.get<Product>(`${API_URL}/${id}`);
  }

  create(product: CreateProductDto): Observable<Product> {
    const stored = this.getStoredProducts();
    const newProduct: Product = {
      ...product,
      id: Date.now(),
      rating: { rate: 0, count: 0 }
    };
    stored.push(newProduct);
    this.setStoredProducts(stored);
    return of(newProduct);
  }

  update(id: number, product: UpdateProductDto): Observable<Product> {
    const stored = this.getStoredProducts();
    const index = stored.findIndex(p => p.id === id);
    if (index !== -1) {
      stored[index] = { ...stored[index], ...product };
      this.setStoredProducts(stored);
      return of(stored[index]);
    }
    return this.apiService.put<Product>(`${API_URL}/${id}`, product);
  }

  delete(id: number): Observable<boolean> {
    const stored = this.getStoredProducts();
    const filtered = stored.filter(p => p.id !== id);
    this.setStoredProducts(filtered);
    return of(true);
  }
}

