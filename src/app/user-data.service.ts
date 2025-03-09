import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserDATAService {
  constructor() {}
  private username: string = '';

  setUsername(name: string) {
    this.username = name;
  }

  getUsername(): string {
    return this.username;
  }
}
