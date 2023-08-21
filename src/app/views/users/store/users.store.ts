import { Injectable } from '@angular/core';
import { EntityState, EntityStore, guid, StoreConfig } from '@datorama/akita';
import { User } from '../model/user.model';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface UsersState extends EntityState<User> {
}

@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'users' })
export class UsersStore extends EntityStore<UsersState, User> {
  constructor() {
    super();

    of(this.initialUsers()).pipe(
      delay(2000) // simulate API call
    ).subscribe(users => {
      this.add(users);
    });
  }

  initialUsers(): User[] {
    return [
      { id: guid(), name: 'John Doe', active: true },
      { id: guid(), name: 'Jane Doe', active: true },
      { id: guid(), name: 'Jackie Doe', active: false },
      { id: guid(), name: 'Jimmy Doe', active: true },
    ];
  }
}
