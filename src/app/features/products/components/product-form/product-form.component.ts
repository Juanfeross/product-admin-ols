import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, signal, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Product, CreateProductDto } from '../../models/product.model';
import { ToastService } from '../../../../core/services/toast/toast.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent implements OnInit, OnChanges {
  @Input() product: Product | null = null;
  @Input() categories: string[] = [];
  @Output() submitForm = new EventEmitter<CreateProductDto>();
  @Output() onCancel = new EventEmitter<void>();

  productForm: FormGroup;
  submitted = false;
  @Input() loading = false;
  imagePreview = signal<string | null>(null);
  uploadedFile: File | null = null;
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);

  constructor() {
    this.productForm = this.createForm();
  }

  ngOnInit(): void {
    this.initializeForm();
    this.setupImagePreview();
  }

  private setupImagePreview(): void {
    this.productForm.get('image')?.valueChanges.subscribe(value => {
      if (value && (this.isValidUrl(value) || value.startsWith('data:image/'))) {
        this.imagePreview.set(value);
        if (!value.startsWith('data:')) {
          this.uploadedFile = null;
        }
      } else if (!value || value.trim() === '') {
        this.imagePreview.set(null);
        this.uploadedFile = null;
        this.clearFileInput();
      }
    });
  }

  private isValidUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['product']) {
      this.initializeForm();
      this.clearFileInput();
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
      price: [0, [Validators.required, Validators.min(0.01), this.positiveNumberValidator]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]],
      category: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      image: ['', [this.urlValidator]]
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
    if (!control.value || control.value.trim() === '') {
      return null;
    }
    
    const value = control.value.trim();
    
    // Accept data URLs (base64 images)
    if (value.startsWith('data:image/')) {
      return null;
    }
    
    // Accept HTTP/HTTPS URLs
    try {
      const url = new URL(value);
      return url.protocol === 'http:' || url.protocol === 'https:' ? null : { invalidUrl: true };
    } catch {
      return { invalidUrl: true };
    }
  }

  private initializeForm(): void {
    this.imagePreview.set(null);
    this.uploadedFile = null;
    this.clearFileInput();
    
    if (this.product) {
      this.productForm.patchValue({
        title: this.product.title,
        price: this.product.price,
        description: this.product.description,
        category: this.product.category,
        image: this.product.image || ''
      });
      if (this.product.image) {
        this.imagePreview.set(this.product.image);
      }
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
    this.imagePreview.set(null);
    this.uploadedFile = null;
    this.clearFileInput();
  }

  private clearFileInput(): void {
    if (this.fileInputRef?.nativeElement) {
      this.fileInputRef.nativeElement.value = '';
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      if (!file.type.startsWith('image/')) {
        this.toastService.error('Por favor, selecciona un archivo de imagen válido');
        this.clearFileInput();
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        this.toastService.error('La imagen no puede ser mayor a 5MB');
        this.clearFileInput();
        return;
      }

      this.uploadedFile = file;
      const reader = new FileReader();
      
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const result = e.target?.result as string;
        this.imagePreview.set(result);
        this.productForm.patchValue({ image: result }, { emitEvent: false });
        this.productForm.get('image')?.updateValueAndValidity();
      };
      
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.imagePreview.set(null);
    this.uploadedFile = null;
    this.clearFileInput();
    this.productForm.patchValue({ image: '' }, { emitEvent: false });
    this.productForm.get('image')?.updateValueAndValidity();
  }

  triggerFileInput(): void {
    this.fileInputRef?.nativeElement.click();
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.productForm.valid) {
      this.submitForm.emit(this.productForm.value);
    } else {
      this.toastService.error('Por favor, corrige los errores del formulario.');
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
