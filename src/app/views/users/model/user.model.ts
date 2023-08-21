import { guid } from '@datorama/akita';

export interface User {
  id: string;
  name: string;
  active: boolean;
}

export function createUser({ name, active }: Partial<User>) {
  return {
    id: guid(),
    name,
    active,
  } as User;
}
