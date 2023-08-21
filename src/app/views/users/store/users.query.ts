import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { User } from '../model/user.model';
import { UsersState, UsersStore } from './users.store';

@Injectable({
  providedIn: 'root',
})
export class UsersQuery extends QueryEntity<UsersState, User> {
  constructor(protected usersStore: UsersStore) {
    super(usersStore);
  }
}
