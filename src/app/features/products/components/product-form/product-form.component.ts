import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Product, CreateProductDto } from '../../models/product.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent implements OnInit, OnChanges {
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
    this.initializeForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['product'] && !changes['product'].firstChange) {
      this.initializeForm();
    }
  }

  private initializeForm(): void {
    if (this.product) {
      this.formData = {
        title: this.product.title,
        price: this.product.price,
        description: this.product.description,
        category: this.product.category,
        image: this.product.image
      };
    } else {
      this.resetForm();
    }
  }

  private resetForm(): void {
    this.formData = {
      title: '',
      price: 0,
      description: '',
      category: '',
      image: ''
    };
  }

  onSubmit(): void {
    if (this.isFormValid()) {
      this.submitForm.emit(this.formData);
    }
  }

  private isFormValid(): boolean {
    return !!(
      this.formData.title?.trim() &&
      this.formData.price >= 0 &&
      this.formData.description?.trim() &&
      this.formData.category?.trim() &&
      this.formData.image?.trim()
    );
  }
}

