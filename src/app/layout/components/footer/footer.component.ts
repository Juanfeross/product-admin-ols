import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="bg-gray-800 text-white mt-auto">
      <div class="container mx-auto px-4 py-6">
        <p class="text-center text-sm">
          © 2024 Product Admin. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  `,
  styles: []
})
export class FooterComponent {}

