import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

export interface TodoItem {
  id: number;
  title: string;
  done: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private readonly http = inject(HttpClient);

  readonly baseUrl = 'http://localhost:3000/todos';

  getTodos() {
    return this.http.get<TodoItem[]>(this.baseUrl);
  }

  addItem(item: Omit<TodoItem, 'id'>) {
    return this.http.post<{ id: number }>(this.baseUrl, item);
  }

  updateItem(item: TodoItem) {
    return this.http.patch<TodoItem>(`${this.baseUrl}/${item.id}`, { ...item });
  }

  deleteItem(id: number) {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
