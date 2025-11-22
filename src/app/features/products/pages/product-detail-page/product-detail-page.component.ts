import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../../../core/services/toast/toast.service';
import { Product, CreateProductDto, UpdateProductDto } from '../../models/product.model';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { ProductFormComponent } from '../../components/product-form/product-form.component';

@Component({
  selector: 'app-product-detail-page',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, RouterModule, ModalComponent, ProductFormComponent],
  templateUrl: './product-detail-page.component.html',
  styleUrl: './product-detail-page.component.css'
})
export class ProductDetailPageComponent implements OnInit {
  product = signal<Product | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productsService = inject(ProductsService);
  private cartService = inject(CartService);
  private toastService = inject(ToastService);
  
  addingToCart = signal(false);
  imageError = signal(false);
  defaultImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2U1ZTdlYiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZW4gbm8gZGlzcG9uaWJsZTwvdGV4dD48L3N2Zz4=';
  isEditModalOpen = signal(false);
  categories = signal<string[]>([]);
  saving = signal(false);

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProduct(Number(productId));
      this.loadCategories();
    } else {
      this.error.set('ID de producto no válido');
      this.loading.set(false);
    }
  }

  private loadCategories(): void {
    this.productsService.getCategories().subscribe({
      next: (categories: string[]) => {
        this.categories.set(categories);
      },
      error: (error: any) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  private loadProduct(id: number): void {
    this.loading.set(true);
    this.imageError.set(false);
    this.productsService.getById(id).subscribe({
      next: (product: Product | undefined) => {
        if (product) {
          this.product.set(product);
        } else {
          this.error.set('Producto no encontrado');
          this.toastService.error('Producto no encontrado');
        }
        this.loading.set(false);
      },
      error: (error: any) => {
        console.error('Error loading product:', error);
        this.error.set('Error al cargar el producto');
        this.toastService.error('Error al cargar el producto');
        this.loading.set(false);
      }
    });
  }

  onImageError(): void {
    this.imageError.set(true);
  }

  addToCart(): void {
    const product = this.product();
    if (product) {
      this.addingToCart.set(true);
      const wasAlreadyInCart = this.cartService.addToCart(product);
      if (wasAlreadyInCart) {
        this.toastService.info(`Cantidad de "${product.title}" actualizada en el carrito`);
      } else {
        this.toastService.success(`"${product.title}" agregado al carrito`);
      }
      setTimeout(() => {
        this.addingToCart.set(false);
      }, 500);
    }
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }

  openEditModal(): void {
    this.isEditModalOpen.set(true);
  }

  closeEditModal(): void {
    this.isEditModalOpen.set(false);
  }

  handleSubmit(productData: CreateProductDto): void {
    const product = this.product();
    if (!product) return;

    this.saving.set(true);
    const updateData: UpdateProductDto = {
      ...productData,
      id: product.id
    };
    
    this.productsService.update(product.id, updateData).subscribe({
      next: (updatedProduct: Product) => {
        this.product.set(updatedProduct);
        this.toastService.success('Producto actualizado correctamente');
        this.closeEditModal();
        this.saving.set(false);
      },
      error: (error: any) => {
        console.error('Error updating product:', error);
        this.toastService.error('Error al actualizar el producto');
        this.saving.set(false);
      }
    });
  }
}

