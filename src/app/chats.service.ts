import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class ChatsService {
  // key: any = 'AIzaSyAHZU07LVOndA7oWregMQvzBUdOMe7xlr0';
  key: any = 'AIzaSyDuHK5nqJWW5LugXV5KerE5IDctjmaY9I4';

  private apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.key}`;
  // private apiUrl =`AIzaSyDuHK5nqJWW5LugXV5KerE5IDctjmaY9I4`

  constructor(private http: HttpClient) {}

  generateResponse(chatHistory: any[]): Observable<any> {
    return this.http.post(this.apiUrl, { contents: chatHistory });
  }

  userInfo: any;
  userid: any;
  baseUrl: string = `http://206.189.49.31/api/authentication/`;

  // {{baseURL}}/api/authentication/
  register(userData: object): Observable<any> {
    return this.http.post(
      'http://206.189.49.31/api/authentication/registration/',
      userData
    );
  }
  login(loginDate: object): Observable<any> {
    return this.http.post(this.baseUrl + 'login/', loginDate);
  }

  decodeDate(): void {
    const encode = localStorage.getItem('token');
    const userId = localStorage.getItem('user_id');
    if (encode !== null) {
      const decode = jwtDecode(encode);
      this.userInfo = decode;
    }

    if (userId) {
      this.userid = userId; // No need to decode user_id
      console.log('id', this.userid);
    }
  }
}
