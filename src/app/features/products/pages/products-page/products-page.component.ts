import { Component, OnInit, OnDestroy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { ProductsService } from '../../services/products.service';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../../../core/services/toast/toast.service';
import { Product } from '../../models/product.model';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ProductCardSkeletonComponent } from '../../components/product-card-skeleton/product-card-skeleton.component';
import { ProductFormComponent } from '../../components/product-form/product-form.component';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { ConfirmModalComponent } from '../../../../shared/components/confirm-modal/confirm-modal.component';
import { CartSidebarComponent } from '../../components/cart-sidebar/cart-sidebar.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { CreateProductDto, UpdateProductDto } from '../../models/product.model';

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ProductCardComponent,
    ProductCardSkeletonComponent,
    ProductFormComponent,
    ModalComponent,
    ConfirmModalComponent,
    CartSidebarComponent,
    EmptyStateComponent
  ],
  templateUrl: './products-page.component.html',
  styleUrl: './products-page.component.css'
})
export class ProductsPageComponent implements OnInit, OnDestroy {
  products = signal<Product[]>([]);
  categories = signal<string[]>([]);
  loading = signal(true);
  searchQuery = signal('');
  debouncedSearchQuery = signal('');
  selectedCategory = signal<string>('all');
  sortBy = signal<'name' | 'price-asc' | 'price-desc' | 'rating' | 'none'>('none');
  isModalOpen = signal(false);
  editingProduct = signal<Product | null>(null);
  isCartOpen = signal(false);
  isConfirmModalOpen = signal(false);
  productToDelete = signal<number | null>(null);
  
  // Pagination
  itemsPerPage = 12;
  currentPage = signal(1);

  private productsService = inject(ProductsService);
  private cartService = inject(CartService);
  private toastService = inject(ToastService);
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  cartCount = this.cartService.cartCount;
  saving = signal(false);
  deleting = signal<number | null>(null);

  filteredProducts = computed(() => {
    const products = this.products();
    const query = this.debouncedSearchQuery().toLowerCase();
    const category = this.selectedCategory();
    const sort = this.sortBy();

    let filtered = products.filter(product => {
      const matchesSearch = product.title.toLowerCase().includes(query);
      const matchesCategory = category === 'all' || product.category === category;
      return matchesSearch && matchesCategory;
    });

    if (sort !== 'none') {
      filtered = [...filtered].sort((a, b) => {
        switch (sort) {
          case 'name':
            return a.title.localeCompare(b.title);
          case 'price-asc':
            return a.price - b.price;
          case 'price-desc':
            return b.price - a.price;
          case 'rating':
            const ratingA = a.rating?.rate || 0;
            const ratingB = b.rating?.rate || 0;
            return ratingB - ratingA;
          default:
            return 0;
        }
      });
    }

    return filtered;
  });

  getProductCartQuantity = computed(() => {
    const cartItems = this.cartService.cartItems();
    return (productId: number) => {
      const item = cartItems.find(item => item.id === productId);
      return item ? item.quantity : 0;
    };
  });

  totalPages = computed(() => {
    return Math.ceil(this.filteredProducts().length / this.itemsPerPage);
  });

  hasMoreProducts = computed(() => {
    return this.currentPage() < this.totalPages();
  });

  displayedProducts = computed(() => {
    const filtered = this.filteredProducts();
    const page = this.currentPage();
    const end = page * this.itemsPerPage;
    return filtered.slice(0, end);
  });

  ngOnInit(): void {
    this.initializeProducts();
    this.setupSearchDebounce();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSearchDebounce(): void {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(query => {
      this.debouncedSearchQuery.set(query);
    });
  }

  onSearchChange(query: string): void {
    this.searchQuery.set(query);
    this.searchSubject.next(query);
    this.resetPagination();
  }

  onCategoryChange(category: string): void {
    this.selectedCategory.set(category);
    this.resetPagination();
  }

  onSortChange(): void {
    this.resetPagination();
  }

  private initializeProducts(): void {
    this.loading.set(true);
    this.productsService.initializeProducts().subscribe({
      next: (products: Product[]) => {
        this.products.set(products);
        this.loadCategories();
        this.loading.set(false);
      },
      error: (error: any) => {
        console.error('Error initializing products:', error);
        this.toastService.error('Error al cargar los productos');
        this.loading.set(false);
      }
    });
  }

  loadProducts(): void {
    this.productsService.getAll().subscribe({
      next: (products: Product[]) => {
        this.products.set(products);
      },
      error: (error: any) => {
        console.error('Error loading products:', error);
        this.toastService.error('Error al cargar los productos');
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
    this.saving.set(true);
    if (this.editingProduct()) {
      const updateData: UpdateProductDto = {
        ...productData,
        id: this.editingProduct()!.id
      };
      this.productsService
        .update(this.editingProduct()!.id, updateData)
        .subscribe({
          next: () => {
            this.toastService.success('Producto actualizado correctamente');
            this.loadProducts();
            this.closeModal();
            this.saving.set(false);
          },
          error: (error: any) => {
            console.error('Error updating product:', error);
            this.toastService.error('Error al actualizar el producto');
            this.saving.set(false);
          }
        });
    } else {
      this.productsService.create(productData).subscribe({
        next: () => {
          this.toastService.success('Producto creado correctamente');
          this.loadProducts();
          this.closeModal();
          this.saving.set(false);
        },
        error: (error: any) => {
          console.error('Error creating product:', error);
          this.toastService.error('Error al crear el producto');
          this.saving.set(false);
        }
      });
    }
  }

  deleteProduct(id: number): void {
    this.productToDelete.set(id);
    this.isConfirmModalOpen.set(true);
  }

  confirmDelete(): void {
    const id = this.productToDelete();
    if (id) {
      this.deleting.set(id);
      this.productsService.delete(id).subscribe({
        next: () => {
          this.toastService.success('Producto eliminado correctamente');
          this.loadProducts();
          this.deleting.set(null);
          this.closeConfirmModal();
        },
        error: (error: any) => {
          console.error('Error deleting product:', error);
          this.toastService.error('Error al eliminar el producto');
          this.deleting.set(null);
          this.closeConfirmModal();
        }
      });
    }
  }

  closeConfirmModal(): void {
    this.isConfirmModalOpen.set(false);
    this.productToDelete.set(null);
  }

  addToCart(product: Product): void {
    const wasAlreadyInCart = this.cartService.addToCart(product);
    if (wasAlreadyInCart) {
      this.toastService.info(`Cantidad de "${product.title}" actualizada en el carrito`);
    } else {
      this.toastService.success(`"${product.title}" agregado al carrito`);
    }
  }

  updateProductQuantity(productId: number, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity);
  }

  loadMoreProducts(): void {
    if (this.hasMoreProducts()) {
      this.currentPage.set(this.currentPage() + 1);
    }
  }

  resetPagination(): void {
    this.currentPage.set(1);
  }

  openCart(): void {
    this.isCartOpen.set(true);
  }

  closeCart(): void {
    this.isCartOpen.set(false);
  }
}
