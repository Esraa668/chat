import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { chatMsg } from './models/chatMsg';
import { json } from 'stream/consumers';
import { io, Socket } from 'socket.io-client';
import { log } from 'console';

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

  createNewChat(): Observable<any> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `JWT ${token}`,
    });

    return this.http.post(
      'http://206.189.49.31/api/chat/rooms/',
      {},
      { headers }
    );
  }

  private socket: Socket | any;
  private messagesSubject = new Subject<string>();
  Date: any = '';

  msg: [] = [];
  msg01: [] = [];
  messages: { msg: string; msg01: string }[] = [];
  connectToWebSocket() {
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('chatId');
    console.log(id);

    if (!token) {
      console.error('❌ No token found!');
      return;
    }

    const encodedToken = encodeURIComponent(token);
    const wsUrl = `ws://206.189.49.31/ws/chat/${id}/?authorization=JWT ${token}`;
    this.socket = new WebSocket(wsUrl);
    this.socket.onopen = () => console.log('✅ WebSocket connected');
    this.socket.onmessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        // console.log('🟢 AI Response:', data);
        console.log(data.message.date);

        if (data.message.user == null) {
          const aiMessage = data.message.message;
          this.messagesSubject.next(aiMessage);
          this.Date = data.message.date;
          console.log(aiMessage, 'ai');
        } else {
          console.warn('⚠️ Unrecognized WebSocket message format:', data);
        }
      } catch (error) {
        console.error('❌ Error parsing WebSocket message:', error);
      }
    };

    this.socket.onerror = (error: any) =>
      console.error('🚨 WebSocket Error:', error);

    this.socket.onclose = () => console.log('❌ WebSocket disconnected');
  }

  sendMessage(userMessage: string) {
    if (this.socket.readyState === WebSocket.OPEN) {
      const messageData = {
        message: userMessage,
      };
      this.socket.send(JSON.stringify(messageData));
    } else {
      console.error('❌ WebSocket is not open. Cannot send message.');
    }
  }

  // ✅ Get AI messages as an observable
  getMessages(): Observable<string> {
    return this.messagesSubject.asObservable();
  }

  // ✅ Disconnect WebSocket
  disconnect() {
    if (this.socket) {
      this.socket.close();
      console.log('WebSocket manually disconnected');
    }
  }
}
