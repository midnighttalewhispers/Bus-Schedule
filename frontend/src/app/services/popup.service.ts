import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type PopupType = 'success' | 'error' | 'info' | 'warning' | 'confirm';

export interface PopupMessage {
  id: string;
  type: PopupType;
  title: string;
  message: string;
  duration?: number;
  onConfirm?: () => void;
  onCancel?: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class PopupService {
  private popupsSubject = new BehaviorSubject<PopupMessage[]>([]);
  public popups$: Observable<PopupMessage[]> = this.popupsSubject.asObservable();

  constructor() {}

  show(type: PopupType, title: string, message: string, duration = 4000) {
    const id = Math.random().toString(36).substring(2, 9);
    const popup: PopupMessage = { id, type, title, message, duration };
    
    this.popupsSubject.next([...this.popupsSubject.value, popup]);

    if (duration > 0) {
      setTimeout(() => this.remove(id), duration);
    }
  }

  success(title: string, message: string, duration?: number) {
    this.show('success', title, message, duration);
  }

  error(title: string, message: string, duration?: number) {
    this.show('error', title, message, duration);
  }

  confirm(title: string, message: string, onConfirm: () => void, onCancel?: () => void) {
    const id = Math.random().toString(36).substring(2, 9);
    const popup: PopupMessage = { id, type: 'confirm', title, message, duration: 0, onConfirm, onCancel };
    this.popupsSubject.next([...this.popupsSubject.value, popup]);
  }

  remove(id: string) {
    this.popupsSubject.next(this.popupsSubject.value.filter(p => p.id !== id));
  }
}
