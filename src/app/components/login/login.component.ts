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
    const loginData = this.loginGroup.value;

    if (this.loginGroup.valid) {
      this._ChatsService.login(loginData).subscribe({
        next: (response) => {
          console.log(response);
          this.load = false;

          // Store token & user ID
          localStorage.setItem('token', response.access_token);
          localStorage.setItem('user_id', response.user.pk);

          // Decode user data
          this._ChatsService.decodeDate();

          // Navigate to home and then create a new chat
          this._Router.navigate(['blank/chat']).then(() => {
            this._ChatsService.createNewChat().subscribe({
              next: (chatRes: any) => {
                localStorage.setItem('chatId', chatRes.id);
                console.log(chatRes.id);
                const id = chatRes.id;
                this._ChatsService.connectToWebSocket();
              },
              error: (chatErr) => {
                console.error('Failed to create new chat:', chatErr);
              },
            });
          });
        },
        error: (err) => {
          this.load = false;
          this.err = err.error.message;
          console.error('Login failed:', err);
        },
      });
    }
  }

  register(): void {
    this._Router.navigate(['auth/register']);
  }
}
