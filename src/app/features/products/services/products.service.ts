import { Injectable, inject } from '@angular/core';
import { Observable, of, map, tap } from 'rxjs';
import { ApiService } from '../../../core/services/api/api.service';
import { StorageService } from '../../../core/services/storage/storage.service';
import { Product, CreateProductDto, UpdateProductDto } from '../models/product.model';

const STORAGE_KEY = 'products';
const ORIGINAL_DATA_KEY = 'original-products';
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

  private getOriginalProducts(): Product[] {
    return this.storageService.getItem<Product[]>(ORIGINAL_DATA_KEY) || [];
  }

  private setOriginalProducts(products: Product[]): void {
    this.storageService.setItem(ORIGINAL_DATA_KEY, products);
  }

  getAll(): Observable<Product[]> {
    const stored = this.getStoredProducts();
    
    if (stored.length > 0) {
      return of(stored);
    }

    return this.apiService.get<Product[]>(API_URL).pipe(
      tap(products => {
        this.setOriginalProducts(products);
        this.setStoredProducts(products);
      })
    );
  }

  getCategories(): Observable<string[]> {
    return this.getAll().pipe(
      map(products => {
        const categories = new Set(products.map(p => p.category));
        return Array.from(categories);
      })
    );
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

  resetToOriginal(): Observable<Product[]> {
    const original = this.getOriginalProducts();
    if (original.length > 0) {
      this.setStoredProducts(original);
      return of(original);
    }
    return this.apiService.get<Product[]>(API_URL).pipe(
      tap(products => {
        this.setOriginalProducts(products);
        this.setStoredProducts(products);
      })
    );
  }
}

