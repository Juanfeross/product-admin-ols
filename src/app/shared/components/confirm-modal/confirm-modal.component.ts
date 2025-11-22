import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.css'
})
export class ConfirmModalComponent {
  @Input() isOpen = false;
  @Input() title = 'Confirmar acción';
  @Input() message = '¿Estás seguro de que deseas realizar esta acción?';
  @Input() confirmText = 'Confirmar';
  @Input() cancelText = 'Cancelar';
  @Input() type: 'danger' | 'warning' | 'info' = 'warning';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() closeModal = new EventEmitter<void>();

  private mouseDownTarget: EventTarget | null = null;

  onConfirm(): void {
    this.confirm.emit();
    this.close();
  }

  onCancel(): void {
    this.cancel.emit();
    this.close();
  }

  close(): void {
    this.isOpen = false;
    this.closeModal.emit();
  }

  onBackdropMouseDown(event: MouseEvent): void {
    this.mouseDownTarget = event.target;
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === this.mouseDownTarget && event.target === event.currentTarget) {
      this.close();
    }
    this.mouseDownTarget = null;
  }
}

