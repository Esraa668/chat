import { RegisterComponent } from './../register/register.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';

import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ChatsService } from '../../chats.service';
import { Router } from '@angular/router';
import { chatMsg } from '../../models/chatMsg';
import { UserDATAService } from '../../user-data.service';

interface ChatMessage {
  text: string;
  displayedText?: string; // Holds gradually revealed text for typing effect
  sender: 'user' | 'bot';
  isLoading?: boolean;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, AfterViewInit {
  @ViewChild('carousel', { static: false }) carousel: ElementRef | null = null;
  @ViewChild('carouselInner', { static: false })
  carouselInner: ElementRef | null = null;
  @ViewChild('prevButton', { static: false }) prevButton: ElementRef | null =
    null;
  @ViewChild('nextButton', { static: false }) nextButton: ElementRef | null =
    null;

  // userInput: string = '';
  // messages: ChatMessage[] = [];
  showSlider: boolean = true;
  chatHistory: any[] = [];
  isBotTyping: boolean = false; // 🔴 Disable user input while bot is typing

  cards = [
    {
      title: 'What is my outstanding bill?',
      img: '../../assets/my_bills-en.png',
    },
    {
      title: 'How can I check my fiber orders?',
      img: '../../assets/fiber_orders-en.png',
    },
    {
      title: 'How much data have I used?',
      img: '../../assets/my_usage-en.png',
    },
    {
      title: 'How do I add a data package?',
      img: '../../assets/data_addon-en.png',
    },
    {
      title: 'How can I reconnect my line?',
      img: '../../assets/line_reconnection-en.png',
    },
    {
      title: 'Can I pay in installments?',
      img: '../../assets/device_installment-en.png',
    },
    { title: 'What are the available plans?', img: '../../assets/plan-en.png' },
    {
      title: 'How do I enable roaming?',
      img: '../../assets/roaming_addon-en.png',
    },
  ];
  // messages: any;

  constructor(
    public chatService: ChatsService,
    private _Router: Router,
    private _UserDATAService: UserDATAService
  ) {}

  ngAfterViewInit(): void {
    if (
      this.carousel &&
      this.carouselInner &&
      this.nextButton &&
      this.prevButton
    ) {
      const carouselElement = this.carousel.nativeElement;
      const carouselInner = this.carouselInner.nativeElement;
      const nextButton = this.nextButton.nativeElement;
      const prevButton = this.prevButton.nativeElement;

      const carouselItems = carouselElement.querySelectorAll('.carousel-item');
      const cardWidth = carouselItems[0].offsetWidth;
      const visibleItems = 1;
      let scrollPosition = 0;

      nextButton.addEventListener('click', () => {
        const maxScrollWidth =
          carouselInner.scrollWidth - carouselInner.offsetWidth;
        if (scrollPosition < maxScrollWidth) {
          scrollPosition += cardWidth * visibleItems;
          carouselInner.scrollTo({ left: scrollPosition, behavior: 'smooth' });
        }
      });

      prevButton.addEventListener('click', () => {
        if (scrollPosition > 0) {
          scrollPosition -= cardWidth * visibleItems;
          carouselInner.scrollTo({ left: scrollPosition, behavior: 'smooth' });
        }
      });
    }
  }

  /**
   * Function to animate AI's typing effect
   */
  addTypingEffect(fullText: string): void {
    let currentIndex = 0;
    const botMessage: ChatMessage = {
      text: fullText,
      displayedText: '',
      sender: 'bot',
    };
    this.messages.push(botMessage);

    const interval = setInterval(() => {
      if (currentIndex < fullText.length) {
        botMessage.displayedText += fullText[currentIndex];
        currentIndex++;
      } else {
        clearInterval(interval);
        this.isBotTyping = false; // Re-enable form after bot finishes typing
      }
    }, 50); // Adjust speed of typing effect (lower = faster)
  }
  clearChat(): void {
    Swal.fire({
      text: 'If you need any further assistance, simply start a new chat with me at any time. Bye and take care!',
      imageUrl: '../../assets/basma.svg',
      imageWidth: 100,
      imageHeight: 100,
      confirmButtonText: 'End This Chat',

      confirmButtonColor: '#af1b33', // Optional: Change button color
    }).then((result) => {
      if (result.isConfirmed) {
        this.messages = []; // Clear all chat messages
        this.showSlider = true; // Show the slider again after clearing
        this.userMessage = ''; // Reset input field
        this._Router.navigate(['auth/register']);
      }
    });
  }

  NewChat(): void {
    Swal.fire({
      text: 'Are you sure you want to start a new chat?',

      confirmButtonText: 'confirm',
      confirmButtonColor: '#af1b33', // Optional: Change button color
    }).then((result) => {
      if (result.isConfirmed) {
        this.chatService.createNewChat().subscribe({
          next: (chatRes: any) => {
            localStorage.setItem('chatId', chatRes.id);
            console.log(chatRes.id);
            const id = chatRes.id;
            // this.clearChat();
            this.messages = [];
            this.showSlider = true;

            this.chatService.connectToWebSocket();
          },
          error: (chatErr) => {
            console.error('Failed to create new chat:', chatErr);
          },
        });
      }
    });
  }
  userMessage = '';
  // input=this.chatService.ge
  messages: { text: string; sender: string }[] = []; // Stores chat history
  messages01: { text01: string }[] = [];

  username: string = '';
  ngOnInit() {
    this.chatService.connectToWebSocket();
    this.username = this._UserDATAService.getUsername();
    // Listen for AI responses
    this.chatService.getMessages().subscribe((message: any) => {
      // if (message && message.message) {
      //   if (message.message.user == null) {
      //     // Store only AI responses
      //     this.messages.push({ text: message, sender: 'ai' });
      //     console.log(message.message);
      //   }
      // }
      this.showSlider = false;
      this.messages.push({ text: message, sender: 'ai' });
      console.log();
    });
  }

  // showSlider:boolean=true
  sendMessage() {
    this.showSlider = false;

    if (this.userMessage.trim() !== '') {
      // Display user message
      this.messages.push({ text: this.userMessage, sender: 'user' });

      // Send message to WebSocket
      this.chatService.sendMessage(this.userMessage);
      console.log(this.userMessage);

      // Clear input field
      this.userMessage = '';
    }
  }

  disconnectChat() {
    this.chatService.disconnect();
  }
}
