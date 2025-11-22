import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '../../services/products.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ProductFormComponent } from '../../components/product-form/product-form.component';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { CartSidebarComponent } from '../../components/cart-sidebar/cart-sidebar.component';
import { CreateProductDto, UpdateProductDto } from '../../models/product.model';

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ProductCardComponent,
    ProductFormComponent,
    ModalComponent,
    CartSidebarComponent
  ],
  templateUrl: './products-page.component.html',
  styleUrl: './products-page.component.css'
})
export class ProductsPageComponent implements OnInit {
  products = signal<Product[]>([]);
  categories = signal<string[]>([]);
  loading = signal(true);
  searchQuery = signal('');
  selectedCategory = signal<string>('all');
  isModalOpen = signal(false);
  editingProduct = signal<Product | null>(null);
  isCartOpen = signal(false);

  private productsService = inject(ProductsService);
  private cartService = inject(CartService);

  cartCount = this.cartService.cartCount;

  filteredProducts = computed(() => {
    const products = this.products();
    const query = this.searchQuery().toLowerCase();
    const category = this.selectedCategory();

    return products.filter(product => {
      const matchesSearch = product.title.toLowerCase().includes(query);
      const matchesCategory = category === 'all' || product.category === category;
      return matchesSearch && matchesCategory;
    });
  });

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts(): void {
    this.loading.set(true);
    this.productsService.getAll().subscribe({
      next: (products: Product[]) => {
        this.products.set(products);
        this.loading.set(false);
      },
      error: (error: any) => {
        console.error('Error loading products:', error);
        this.loading.set(false);
      }
    });
  }

  loadCategories(): void {
    this.productsService.getCategories().subscribe({
      next: (categories: string[]) => {
        this.categories.set(categories);
      },
      error: (error: any) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  openCreateModal(): void {
    this.editingProduct.set(null);
    this.isModalOpen.set(true);
  }

  openEditModal(product: Product): void {
    this.editingProduct.set(product);
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.editingProduct.set(null);
  }

  handleSubmit(productData: CreateProductDto): void {
    if (this.editingProduct()) {
      const updateData: UpdateProductDto = {
        ...productData,
        id: this.editingProduct()!.id
      };
      this.productsService
        .update(this.editingProduct()!.id, updateData)
        .subscribe({
          next: () => {
            this.loadProducts();
            this.closeModal();
          },
          error: (error: any) => {
            console.error('Error updating product:', error);
          }
        });
    } else {
      this.productsService.create(productData).subscribe({
        next: () => {
          this.loadProducts();
          this.closeModal();
        },
        error: (error: any) => {
          console.error('Error creating product:', error);
        }
      });
    }
  }

  deleteProduct(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      this.productsService.delete(id).subscribe({
        next: () => {
          this.loadProducts();
        },
        error: (error: any) => {
          console.error('Error deleting product:', error);
        }
      });
    }
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
  }

  openCart(): void {
    this.isCartOpen.set(true);
  }

  closeCart(): void {
    this.isCartOpen.set(false);
  }
}
