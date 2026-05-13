import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from '../models/task.model';

export interface ModalState {
  isOpen: boolean;
  task: Task | null;
  mode: 'create' | 'edit';
}

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private modalState$ = new BehaviorSubject<ModalState>({
    isOpen: false,
    task: null,
    mode: 'create',
  });

  public modal$: Observable<ModalState> = this.modalState$.asObservable();

  constructor() {}

  openCreateModal() {
    this.modalState$.next({
      isOpen: true,
      task: null,
      mode: 'create',
    });
  }

  openEditModal(task: Task): void {
    this.modalState$.next({
      isOpen: true,
      task: task,
      mode: 'edit',
    });
  }

  closeModal(): void {
    this.modalState$.next({
      ...this.modalState$.value,
      isOpen: false,
      task: null,
    });
  }

  getModalState(): ModalState {
    return this.modalState$.value;
  }
}
