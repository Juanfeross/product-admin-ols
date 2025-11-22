import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-product-card-skeleton',
  standalone: true,
  imports: [CommonModule, SkeletonComponent],
  templateUrl: './product-card-skeleton.component.html',
  styleUrl: './product-card-skeleton.component.css'
})
export class ProductCardSkeletonComponent {}

