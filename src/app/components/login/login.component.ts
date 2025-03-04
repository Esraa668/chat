import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Router, RouterLink } from '@angular/router';
import { ChatsService } from '../../chats.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(private _ChatsService: ChatsService, private _Router: Router) {}
  err: string = '';
  load: boolean = false;
  loginGroup: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[a-zA-z0-9_@]{6,}$/),
    ]),
  });

  handle(): void {
    this.load = true;
    const loginDate = this.loginGroup.value;
    if (this.loginGroup.valid === true)
      this._ChatsService.login(loginDate).subscribe({
        next: (response) => {
          console.log(response);

          this.load = false;
          localStorage.setItem('token', response.access_token);

          localStorage.setItem('user_id', response.user.pk); //
          this._ChatsService.decodeDate();
          //programing routing
          this._Router.navigate(['blank/chat']);
        },
        error: (err) => {
          this.load = false;
          this.err = err.error.message;
        },
      });
  }
}
