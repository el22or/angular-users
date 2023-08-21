import { inject, Injectable } from '@angular/core';
import { createUser, User } from '../model/user.model';
import { UsersStore } from '../store/users.store';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private usersStore = inject(UsersStore);

  addUser({ name, active }: Partial<User>) {
    const user = createUser({ name, active });
    this.usersStore.add(user);
  }

  deleteUser(user: User): void {
    this.usersStore.remove(user.id);
  }

  updateUser(entityId: string, { name, active }: Partial<User>): void {
    this.usersStore.update(entityId, { name: name, active: active });
  }
}
