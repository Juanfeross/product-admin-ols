import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, effect } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() showFooter = true;
  @Output() closeModal = new EventEmitter<void>();
  @ViewChild('modalContent', { static: false }) modalContent!: ElementRef<HTMLElement>;
  @ViewChild('closeButton', { static: false }) closeButton!: ElementRef<HTMLButtonElement>;

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

  ngOnDestroy(): void {
    this.restoreFocus();
  }

  private focusModal(): void {
    if (this.closeButton?.nativeElement) {
      this.closeButton.nativeElement.focus();
    } else if (this.modalContent?.nativeElement) {
      this.modalContent.nativeElement.focus();
    }
  }

  private restoreFocus(): void {
    if (this.previousActiveElement) {
      this.previousActiveElement.focus();
      this.previousActiveElement = null;
    }
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

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.close();
    }
  }
}

