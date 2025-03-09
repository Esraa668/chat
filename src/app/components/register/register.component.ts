import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormControlOptions,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ChatsService } from '../../chats.service';
import { UserDATAService } from '../../user-data.service';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],

  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  constructor(
    private _ChatsService: ChatsService,
    private _Router: Router,
    private _userData: UserDATAService
  ) {}

  err: string = '';
  load: boolean = false;
  registerGroup: FormGroup = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[a-zA-z0-9_@]{6,}$/),
    ]),
  });
  Name: string = '';
  handle(): void {
    this.load = true;
    const userData = this.registerGroup.value; // Correct variable name

    if (this.registerGroup.valid) {
      this._ChatsService.register(userData).subscribe({
        next: (response) => {
          this._userData.setUsername(userData.username); // Store username in service
          this._Router.navigate(['/login']); // Redirect to chat
        },
        error: (err) => {
          this.load = false;
          this.err = err.error.message;
        },
      });
    }
  }
}
