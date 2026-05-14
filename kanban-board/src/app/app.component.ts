import { Component, OnDestroy, OnInit } from '@angular/core';
import { BoardService } from './services/board.service';
import { Task } from './models/task.model';
import { Column } from './models/column.model';
import { Subject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ModalService } from './services/modal.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  tasks: Task[] = [];
  columns: Column[] = [];
  loading: boolean = false;

  modalState$ = this.modalService.modal$;

  private destroy$ = new Subject<void>();

  constructor(
    private boardService: BoardService,
    private modalService: ModalService,
  ) {}

  ngOnInit(): void {
    this.loading = true;
    forkJoin([this.boardService.loadColumns(), this.boardService.loadTasks()])
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.boardService
            .getColumnsObservable()
            .pipe(takeUntil(this.destroy$))
            .subscribe((columns) => {
              this.columns = columns;
            });

          this.boardService
            .getTasksObservable()
            .pipe(takeUntil(this.destroy$))
            .subscribe((tasks) => {
              this.tasks = tasks;
              this.loading = false;
            });
        },
        error: (err) => {
          console.error('Error loading board:', err);
          this.loading = false;
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onCreateTaskClick(): void {
    this.modalService.openCreateModal();
  }

  closeModal(): void {
    this.modalService.closeModal();
  }

  onTaskSubmit(taskData: any): void {
    const mode = this.modalService.getModalState().mode;
    const task = this.modalService.getModalState().task;

    if (mode === 'create') {
      this.boardService
        .addTask(taskData.title, taskData.description, taskData.priority)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.modalService.closeModal();
          },
          error: (err) => console.error('Error creating task:', err),
        });
    } else if (mode === 'edit' && task) {
      this.boardService
        .updateTask(task.id, taskData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.modalService.closeModal();
          },
          error: (err) => console.error('Error updating task:', err),
        });
    }
  }

  deleteTask(id: number): void {
    this.boardService
      .removeTask(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        error: (err) => console.error('Error deleting task:', err),
      });
  }

  moveTask(data: { taskId: number; newStatus: string }): void {
    this.boardService
      .updateTaskStatus(data.taskId, data.newStatus)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        error: (err) => console.error('Error moving task:', err),
      });
  }

  getTasksCount(status: string): number {
    console.log("Tasks ", this.tasks)
    return this.tasks.filter((task) => task.status === status).length;
  }
}
