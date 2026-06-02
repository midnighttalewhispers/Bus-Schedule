import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs/operators';
import { PopupService, PopupMessage } from '../../services/popup.service';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent {
  popups$ = this.popupService.popups$;

  toasts$ = this.popups$.pipe(map(popups => popups.filter(p => p.type !== 'confirm')));
  confirms$ = this.popups$.pipe(map(popups => popups.filter(p => p.type === 'confirm')));

  constructor(private popupService: PopupService) {}

  remove(id: string) {
    this.popupService.remove(id);
  }

  confirmAction(popup: PopupMessage) {
    if (popup.onConfirm) popup.onConfirm();
    this.remove(popup.id);
  }

  cancelAction(popup: PopupMessage) {
    if (popup.onCancel) popup.onCancel();
    this.remove(popup.id);
  }

  getIcon(type: string): string {
    switch(type) {
      case 'success': return 'fa-solid fa-circle-check';
      case 'error': return 'fa-solid fa-circle-xmark';
      case 'info': return 'fa-solid fa-circle-info';
      case 'warning': return 'fa-solid fa-triangle-exclamation';
      case 'confirm': return 'fa-solid fa-circle-question';
      default: return 'fa-solid fa-bell';
    }
  }
}
