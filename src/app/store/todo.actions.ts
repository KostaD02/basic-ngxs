import { TodoItem } from '../todo.service';

export class GetTodos {
  static readonly type = '[Todo] Get Todos';
}

export class AddItem {
  static readonly type = '[Todo] Add item';

  constructor(public newItem: Omit<TodoItem, 'id'>) {}
}

export class UpdateItem {
  static readonly type = '[Todo] Update item';

  constructor(public item: TodoItem) {}
}

export class DeleteItem {
  static readonly type = '[Todo] Delete item';

  constructor(public id: number) {}
}
