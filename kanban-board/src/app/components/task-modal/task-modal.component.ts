import { Component, Input, Output, OnInit, OnChanges, SimpleChanges, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-modal',
  templateUrl: './task-modal.component.html',
  styleUrls: ['./task-modal.component.css'],
})
export class TaskModalComponent implements OnInit, OnChanges {
  @Input() task: Task | null = null;
  @Input() mode: 'create' | 'edit' = 'create';

  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<any>();

  taskForm!: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.updateForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['task'] || changes['mode']) {
      this.updateForm();
    }
  }

  initializeForm(): void {
    this.taskForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.maxLength(3000)]],
      priority: ['medium', Validators.required],
    });
  }

  updateForm(): void {
    if (this.mode === 'edit' && this.task) {
      this.taskForm.patchValue({
        title: this.task.title,
        description: this.task.description,
        priority: this.task.priority,
      });
    } else {
      this.taskForm.reset({
        title: '',
        description: '',
        priority: 'medium',
      });
    }
  }

  onCancel(): void {
    this.close.emit();
  }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      return;
    }
    this.submit.emit(this.taskForm.value);
  }

  get title() {
    return this.taskForm.get('title');
  }

  get description() {
    return this.taskForm.get('description');
  }

  get priority() {
    return this.taskForm.get('priority');
  }
}
