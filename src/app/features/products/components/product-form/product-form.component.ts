import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Product, CreateProductDto } from '../../models/product.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent implements OnInit, OnChanges {
  @Input() product: Product | null = null;
  @Output() submitForm = new EventEmitter<CreateProductDto>();
  @Output() onCancel = new EventEmitter<void>();

  productForm: FormGroup;
  submitted = false;
  @Input() loading = false;

  constructor(private fb: FormBuilder) {
    this.productForm = this.createForm();
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['product'] && !changes['product'].firstChange) {
      this.initializeForm();
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
      price: [0, [Validators.required, Validators.min(0.01), this.positiveNumberValidator]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]],
      category: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      image: ['', [Validators.required, this.urlValidator]]
    });
  }

  private positiveNumberValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value === null || value === undefined || value === '') {
      return null;
    }
    const numValue = Number(value);
    if (isNaN(numValue) || numValue <= 0) {
      return { positiveNumber: true };
    }
    return null;
  }

  private urlValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }
    try {
      const url = new URL(control.value);
      return url.protocol === 'http:' || url.protocol === 'https:' ? null : { invalidUrl: true };
    } catch {
      return { invalidUrl: true };
    }
  }

  private initializeForm(): void {
    if (this.product) {
      this.productForm.patchValue({
        title: this.product.title,
        price: this.product.price,
        description: this.product.description,
        category: this.product.category,
        image: this.product.image
      });
    } else {
      this.resetForm();
    }
    this.submitted = false;
  }

  private resetForm(): void {
    this.productForm.reset({
      title: '',
      price: 0,
      description: '',
      category: '',
      image: ''
    });
    this.submitted = false;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.productForm.valid) {
      this.submitForm.emit(this.productForm.value);
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.productForm.get(fieldName);
    if (!field || (!field.errors && !this.submitted)) {
      return '';
    }

    if (field.errors?.['required']) {
      return `${this.getFieldLabel(fieldName)} es requerido`;
    }
    if (field.errors?.['minlength']) {
      return `${this.getFieldLabel(fieldName)} debe tener al menos ${field.errors['minlength'].requiredLength} caracteres`;
    }
    if (field.errors?.['maxlength']) {
      return `${this.getFieldLabel(fieldName)} no puede exceder ${field.errors['maxlength'].requiredLength} caracteres`;
    }
    if (field.errors?.['min']) {
      return `El precio debe ser mayor a ${field.errors['min'].min}`;
    }
    if (field.errors?.['positiveNumber']) {
      return 'El precio debe ser un número positivo';
    }
    if (field.errors?.['invalidUrl']) {
      return 'Debe ser una URL válida (ej: https://ejemplo.com/imagen.jpg)';
    }

    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      title: 'Título',
      price: 'Precio',
      description: 'Descripción',
      category: 'Categoría',
      image: 'URL de Imagen'
    };
    return labels[fieldName] || fieldName;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.productForm.get(fieldName);
    return !!(field && field.invalid && (field.touched || this.submitted));
  }
}
