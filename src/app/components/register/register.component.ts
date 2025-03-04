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
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],

  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  constructor(private _ChatsService: ChatsService, private _Router: Router) {}

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

  handle(): void {
    this.load = true;
    const userDate = this.registerGroup.value;
    // if (this.registerGroup.valid === true)
    //   this._ChatsService.register(userDate).subscribe({
    //     next: (response) => {
    //       this._Router.navigate(['/login']);
    //     },
    //     error: (err) => {
    //       this.load = false;
    //       this.err = err.error.message;
    //     },
    //   });

    console.log(this.registerGroup);
  }
}
