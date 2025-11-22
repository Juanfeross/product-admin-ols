import { Component, Input, Output, EventEmitter, OnInit, AfterViewInit, ViewChild, ElementRef, effect } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.css'
})
export class ConfirmModalComponent implements OnInit, AfterViewInit {
  @Input() isOpen = false;
  @Input() title = 'Confirmar acción';
  @Input() message = '¿Estás seguro de que deseas realizar esta acción?';
  @Input() confirmText = 'Confirmar';
  @Input() cancelText = 'Cancelar';
  @Input() type: 'danger' | 'warning' | 'info' = 'warning';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() closeModal = new EventEmitter<void>();
  @ViewChild('cancelButton', { static: false }) cancelButton!: ElementRef<HTMLButtonElement>;

  private mouseDownTarget: EventTarget | null = null;
  private previousActiveElement: HTMLElement | null = null;

  constructor() {
    effect(() => {
      if (this.isOpen) {
        setTimeout(() => this.focusModal(), 0);
      } else {
        this.restoreFocus();
      }
    });
  }

  ngOnInit(): void {
    if (this.isOpen) {
      this.previousActiveElement = document.activeElement as HTMLElement;
    }
  }

  ngAfterViewInit(): void {
    if (this.isOpen) {
      this.focusModal();
    }
  }

  private focusModal(): void {
    if (this.cancelButton?.nativeElement) {
      this.cancelButton.nativeElement.focus();
    }
  }

  private restoreFocus(): void {
    if (this.previousActiveElement) {
      this.previousActiveElement.focus();
      this.previousActiveElement = null;
    }
  }

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

