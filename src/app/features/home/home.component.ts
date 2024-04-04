import { Component, OnInit, inject } from '@angular/core';
import { Select, Store } from '@ngxs/store';

import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoItem } from '../../todo.service';
import {
  AddItem,
  DeleteItem,
  GetTodos,
  TodoState,
  TodoStateModel,
  UpdateItem,
} from '../../store';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AsyncPipe, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export default class HomeComponent implements OnInit {
  private readonly store = inject(Store);

  @Select(TodoState.vm) vm$!: Observable<TodoStateModel>;

  title = '';

  ngOnInit(): void {
    this.store.dispatch(new GetTodos());
  }

  addTodo() {
    this.store.dispatch(new AddItem({ title: this.title, done: false }));
    this.title = '';
  }

  updateItem(todo: TodoItem) {
    this.store.dispatch(new UpdateItem({ ...todo, done: !todo.done }));
  }

  deleteTodo(todo: TodoItem) {
    this.store.dispatch(new DeleteItem(todo.id));
  }
}
