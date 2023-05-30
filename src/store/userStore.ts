import { IUser } from '../models';
import { makeAutoObservable } from 'mobx';

class UserStore {
  user: IUser = null;

  constructor() {
    makeAutoObservable(this);
  }

  setUser(user: IUser) {
    this.user = user;
  }

  getUser() {
    return this.user;
  }

  canCreateReport(): boolean {
    return this.user && this.user.role == 'admin';
  }

  isAdmin(): boolean {
    return this.user && this.user.role == 'admin';
  }
}

export default new UserStore();
