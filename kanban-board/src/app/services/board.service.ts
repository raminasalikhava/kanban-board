import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from '../models/task.model';
import { Column } from '../models/column.model';
import { ApiService } from './api.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  private columnsSubject = new BehaviorSubject<Column[]>([]);

  public tasks$: Observable<Task[]> = this.tasksSubject.asObservable();
  public columns$: Observable<Column[]> = this.columnsSubject.asObservable();

  constructor(private apiService: ApiService) {}

  loadColumns(): Observable<Column[]> {
    return this.apiService.getColumns().pipe(
      tap((columns: Column[]) => {
        this.columnsSubject.next(columns);
      }),
    );
  }

  loadTasks(): Observable<Task[]> {
    return this.apiService.getAllTasks().pipe(
      tap((tsks: Task[]) => {
        this.tasksSubject.next(tsks);
      }),
    );
  }

  getTasks(): Task[] {
    return this.tasksSubject.value;
  }

  getColumns(): any {
    return this.columnsSubject.value;
  }

  getTasksObservable(): Observable<Task[]> {
    return this.tasks$;
  }

  getColumnsObservable(): Observable<any> {
    return this.columns$;
  }

  getTasksByStatus(status: string): Task[] {
    return this.tasksSubject.value.filter((t) => t.status === status);
  }

  addTask(
    title: string,
    description: string,
    priority: 'low' | 'medium' | 'high',
  ): Observable<Task> {
    return this.apiService
      .createTask({
        title,
        description,
        priority,
        status: 'todo',
      })
      .pipe(
        tap((newTask) => {
          const currentTasks = this.tasksSubject.value;
          this.tasksSubject.next([...currentTasks, newTask]);
        }),
      );
  }

  removeTask(id: number): Observable<void> {
    return this.apiService.deleteTask(id).pipe(
      tap(() => {
        const currentTasks = this.tasksSubject.value;
        this.tasksSubject.next(currentTasks.filter((t) => t.id !== id));
      }),
    );
  }

  updateTask(id: number, taskData: Partial<Task>): Observable<Task> {
    const task = this.tasksSubject.value.find((t: Task) => t.id === id);
    if (!task) {
      throw new Error('Task not found');
    }

    const updatedTask: Task = {
      ...task,
      ...taskData,
    };

    return this.apiService.updateTask(id, updatedTask).pipe(
      tap((result) => {
        const currentTasks = this.tasksSubject.value;
        const index = currentTasks.findIndex((t: any) => t.id === id);
        if (index !== -1) {
          currentTasks[index] = result;
          this.tasksSubject.next([...currentTasks]);
        }
      }),
    );
  }

  updateTaskStatus(id: number, newStatus: string): Observable<any> {
    const task = this.tasksSubject.value.find((t: Task) => t.id === id);
    if (!task) {
      throw new Error('Task not found');
    }

    const updatedTask: Task= {
      ...task,
      status: newStatus,
    };

    return this.apiService.updateTask(id, updatedTask).pipe(
      tap((result) => {
        const currentTasks = this.tasksSubject.value;
        const index = currentTasks.findIndex((t: any) => t.id === id);
        if (index !== -1) {
          currentTasks[index] = result;
          this.tasksSubject.next([...currentTasks]);
        }
      }),
    );
  }
}
