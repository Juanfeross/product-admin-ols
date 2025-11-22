import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../../../core/services/toast/toast.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-detail-page',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, RouterModule],
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

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProduct(Number(productId));
    } else {
      this.error.set('ID de producto no válido');
      this.loading.set(false);
    }
  }

  private loadProduct(id: number): void {
    this.loading.set(true);
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

  addToCart(): void {
    const product = this.product();
    if (product) {
      this.addingToCart.set(true);
      this.cartService.addToCart(product);
      this.toastService.success(`${product.title} agregado al carrito`);
      setTimeout(() => {
        this.addingToCart.set(false);
      }, 500);
    }
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }
}

