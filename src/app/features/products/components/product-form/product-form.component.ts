import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Product, CreateProductDto } from '../../models/product.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <form (ngSubmit)="onSubmit()" class="space-y-4">
      <div>
        <label class="block text-sm font-medium mb-1">Título</label>
        <input
          type="text"
          [(ngModel)]="formData.title"
          name="title"
          required
          class="w-full px-4 py-2 border rounded-lg"
        />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Precio</label>
        <input
          type="number"
          [(ngModel)]="formData.price"
          name="price"
          required
          min="0"
          step="0.01"
          class="w-full px-4 py-2 border rounded-lg"
        />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Descripción</label>
        <textarea
          [(ngModel)]="formData.description"
          name="description"
          required
          rows="4"
          class="w-full px-4 py-2 border rounded-lg"
        ></textarea>
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Categoría</label>
        <input
          type="text"
          [(ngModel)]="formData.category"
          name="category"
          required
          class="w-full px-4 py-2 border rounded-lg"
        />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">URL de Imagen</label>
        <input
          type="url"
          [(ngModel)]="formData.image"
          name="image"
          required
          class="w-full px-4 py-2 border rounded-lg"
        />
      </div>
      <div class="flex gap-2">
        <button
          type="submit"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {{ product ? 'Actualizar' : 'Crear' }}
        </button>
        <button
          type="button"
          (click)="onCancel.emit()"
          class="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          Cancelar
        </button>
      </div>
    </form>
  `,
  styles: []
})
export class ProductFormComponent implements OnInit {
  @Input() product: Product | null = null;
  @Output() submitForm = new EventEmitter<CreateProductDto>();
  @Output() onCancel = new EventEmitter<void>();

  formData: CreateProductDto = {
    title: '',
    price: 0,
    description: '',
    category: '',
    image: ''
  };

  ngOnInit(): void {
    if (this.product) {
      this.formData = {
        title: this.product.title,
        price: this.product.price,
        description: this.product.description,
        category: this.product.category,
        image: this.product.image
      };
    }
  }

  onSubmit(): void {
    this.submitForm.emit(this.formData);
  }
}

