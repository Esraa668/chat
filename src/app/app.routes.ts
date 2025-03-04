import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'blank',
    loadComponent: () =>
      import('./layout/blank-layout/blank-layout.component').then(
        (c) => c.BlankLayoutComponent
      ),
    children: [
      { path: '', redirectTo: 'chat', pathMatch: 'full' },
      {
        path: 'chat',
        loadComponent: () =>
          import('./components/chat/chat.component').then(
            (c) => c.ChatComponent
          ),
        title: 'Chat',
      },
    ],
  },
  {
    path: 'auth',
    loadComponent: () =>
      import('./layout/auth-layout/auth-layout.component').then(
        (c) => c.AuthLayoutComponent
      ),
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      {
        path: 'register',
        loadComponent: () =>
          import('./components/register/register.component').then(
            (c) => c.RegisterComponent
          ),
        title: 'Register',
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./components/login/login.component').then(
            (c) => c.LoginComponent
          ),
        title: 'Login',
      },
    ],
  },
  { path: '**', redirectTo: 'auth/login' }, // Catch-all route
];
