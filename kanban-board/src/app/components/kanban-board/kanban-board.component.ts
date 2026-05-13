import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Task } from '../../models/task.model';
import { Column } from '../../models/column.model';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { BoardService } from '../../services/board.service';
import { ModalService } from '../../services/modal.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-kanban-board',
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.css'],
})
export class KanbanBoardComponent implements OnInit {
  @Input() tasks: Task[] = [];
  @Input() columns: Column[] = [];
  @Output() taskDeleted = new EventEmitter<number>();
  @Output() taskMoved = new EventEmitter<{
    taskId: number;
    newStatus: string;
  }>();

  editModalState$ = this.modalService.modal$;

  constructor(
    private boardService: BoardService,
    private modalService: ModalService,
  ) {}

  ngOnInit() {
    console.log(
      'KanbanBoard init - Columns:',
      this.columns,
      'Tasks:',
      this.tasks,
    );
  }

  getTasksByStatus(status: string): Task[] {
    return this.tasks.filter((t) => t.status === status);
  }

  deleteTask(id: number): void {
    this.taskDeleted.emit(id);
  }

  onEditTask(task: Task): void {
    this.modalService.openEditModal(task);
  }

  getColumnTitle(columnId: string): string {
    const column = this.columns.find((c) => c.id === columnId);
    return column ? column.title : columnId;
  }

  getDropListId(status: string): string {
    return `drop-list-${status}`;
  }

  // returns IDs of all drop lists so they can exchange items
  getConnectedLists(): string[] {
    return this.columns.map((col) => this.getDropListId(col.id));
  }

  drop(event: CdkDragDrop<Task[]>, newStatus: string): void {
    const task = event.item.data as Task;

    if (event.previousContainer !== event.container) {
      this.taskMoved.emit({ taskId: task.id, newStatus });
    }
  }
}
