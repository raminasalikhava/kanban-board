import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.css'],
})
export class TaskCardComponent {
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() priority: 'low' | 'medium' | 'high' = 'medium';
  @Input() taskId: number = 0;

  @Output() delete = new EventEmitter<number>();
  @Output() edit = new EventEmitter<void>();

  onDelete(): void {
    this.delete.emit(this.taskId);
  }

  onEdit(): void {
    this.edit.emit();
  }
}
