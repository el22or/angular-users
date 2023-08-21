import { Component, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { combineLatest, map, Observable, switchMap, tap, timer } from 'rxjs';
import { User } from './model/user.model';
import { UsersService } from './service/users.service';
import { UsersQuery } from './store/users.query';

interface UserForm {
  name: FormControl<string | null>;
  active: FormControl<boolean | null>;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent {
  private usersService = inject(UsersService);
  private userQuery = inject(UsersQuery);

  isLoading$ = this.userQuery.selectLoading();
  users$ = this.userQuery.selectAll();
  userCount$ = this.userQuery.selectCount();
  dialogIsOpen = false;
  allUsersAreActive$= this.userQuery.selectAll()
    .pipe(map(users => users.every(user => user.active)));
  isAddUserDisabled$ = combineLatest([this.userCount$, this.allUsersAreActive$])
    .pipe(map( ([count, allActive]) => count >= 5 || !allActive ));
  form = new FormGroup<UserForm>({
    name: new FormControl('', Validators.required, this.uniqueNameValidator.bind(this)),
    active: new FormControl(false),
  });

  delete(user: User): void {
    this.usersService.deleteUser(user);
  }

  dialogOpen(): void {
    this.dialogIsOpen = true;
  }

  dialogClose(): void {
    this.dialogIsOpen = false;
  }

  onChangeActive(event: any, user: User): void {
    const isChecked = event.target.checked;
    this.usersService.updateUser(user.id, { name: user.name, active: isChecked });
  }

  isNameUnique(name: string): Observable<boolean> {
    // Simulate a backend check
    return timer(300).pipe(
      map(() => {
        const users = this.userQuery.getAll();
        return !users.some(user => user.name === name);
      })
    );
  }

  uniqueNameValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    return timer(300).pipe( // simulating backend check
      switchMap(() => this.isNameUnique(control.value)),
      map(isUnique => isUnique ? null : { nameTaken: true })
    );
  }

  save(): void {
    this.usersService.addUser(this.form.value as Partial<User>);
    this.form.reset();
    this.dialogClose();
  }

  cancel(): void {
    this.form.reset();
    this.dialogClose();
  }
}
