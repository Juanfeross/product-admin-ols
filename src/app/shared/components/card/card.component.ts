import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html'
})
export class CardComponent {
  @Input() title = '';
  @Input() padding: 'sm' | 'md' | 'lg' = 'md';

  get cardClasses(): string {
    const baseClasses = 'bg-white rounded-lg shadow-md';
    const paddingClasses = {
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6'
    };

    return `${baseClasses} ${paddingClasses[this.padding]}`;
  }
}

