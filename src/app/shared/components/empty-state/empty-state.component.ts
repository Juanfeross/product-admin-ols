import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.css'
})
export class EmptyStateComponent {
  @Input() title = 'No hay resultados';
  @Input() message = 'No se encontraron elementos que coincidan con tu búsqueda.';
  @Input() icon: 'products' | 'search' | 'cart' = 'products';
}

