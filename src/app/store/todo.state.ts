import { Injectable, inject } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { TodoItem, TodoService } from '../todo.service';
import { AddItem, DeleteItem, GetTodos, UpdateItem } from './todo.actions';
import { EMPTY, catchError, tap } from 'rxjs';

export interface TodoStateModel {
  todos: TodoItem[];
  loading: boolean;
  error: string | null;
}

@State<TodoStateModel>({
  name: 'todo',
  defaults: {
    todos: [],
    loading: false,
    error: null,
  },
})
@Injectable()
export class TodoState {
  private readonly todoSerivce = inject(TodoService);

  @Selector()
  static vm(state: TodoStateModel) {
    return state;
  }

  @Action([GetTodos, AddItem, UpdateItem, DeleteItem]) triggerLoading(
    ctx: StateContext<TodoStateModel>,
  ) {
    ctx.patchState({ loading: true, error: null });
  }

  @Action(GetTodos) getTodos(ctx: StateContext<TodoStateModel>) {
    return this.todoSerivce.getTodos().pipe(
      tap((todos) => {
        ctx.patchState({ todos, loading: false });
      }),
      catchError((error) => {
        ctx.patchState({ error, loading: false });
        return EMPTY;
      }),
    );
  }

  @Action(AddItem) addItem(ctx: StateContext<TodoStateModel>, action: AddItem) {
    const isUnique = ctx
      .getState()
      .todos.find((todo) => todo.title === action.newItem.title);

    if (isUnique) {
      ctx.patchState({
        loading: false,
        error: 'Duplicated title',
      });
      return;
    }

    return this.todoSerivce.addItem(action.newItem).pipe(
      tap(({ id }) => {
        ctx.patchState({
          todos: ctx.getState().todos.concat({ ...action.newItem, id }),
          loading: false,
        });
      }),
      catchError((error) => {
        ctx.patchState({ error, loading: false });
        return EMPTY;
      }),
    );
  }

  @Action(UpdateItem) updateItem(
    ctx: StateContext<TodoStateModel>,
    action: UpdateItem,
  ) {
    return this.todoSerivce.updateItem(action.item).pipe(
      tap((item) => {
        ctx.patchState({
          loading: false,
          error: null,
          todos: ctx
            .getState()
            .todos.map((todo) => (todo.id === item.id ? item : todo)),
        });
      }),
      catchError((error) => {
        ctx.patchState({ error, loading: false });
        return EMPTY;
      }),
    );
  }

  @Action(DeleteItem) deleteItem(
    ctx: StateContext<TodoStateModel>,
    action: DeleteItem,
  ) {
    return this.todoSerivce.deleteItem(action.id).pipe(
      tap(() => {
        ctx.patchState({
          loading: false,
          error: null,
          todos: ctx.getState().todos.filter((item) => item.id !== action.id),
        });
      }),
      catchError((error) => {
        ctx.patchState({ error, loading: false });
        return EMPTY;
      }),
    );
  }
}
