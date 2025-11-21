import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      (click)="onBackdropClick()"
    >
      <div
        class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6"
        (click)="$event.stopPropagation()"
      >
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">{{ title }}</h2>
          <button
            (click)="close()"
            class="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>
        <div class="mb-4">
          <ng-content></ng-content>
        </div>
        <div class="flex justify-end gap-2" *ngIf="showFooter">
          <ng-content select="[footer]"></ng-content>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ModalComponent {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() showFooter = true;
  @Output() closeModal = new EventEmitter<void>();

  close(): void {
    this.isOpen = false;
    this.closeModal.emit();
  }

  onBackdropClick(): void {
    this.close();
  }
}

