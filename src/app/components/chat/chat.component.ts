import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';

import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatsService } from '../../chats.service';
import { Router } from '@angular/router';

interface ChatMessage {
  text: string;
  displayedText?: string; // Holds gradually revealed text for typing effect
  sender: 'user' | 'bot';
  isLoading?: boolean;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
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

  userInput: string = '';
  messages: ChatMessage[] = [];
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

  constructor(private chatService: ChatsService, private _Router: Router) {}

  ngOnInit(): void {}

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

  onSubmit(): void {
    if (this.userInput.trim() && !this.isBotTyping) {
      this.isBotTyping = true; // Disable form while bot is typing

      this.messages.push({ text: this.userInput, sender: 'user' });
      this.showSlider = false;
      this.messages.push({
        text: 'Just a second...',
        sender: 'bot',
        isLoading: true,
      });

      this.chatHistory.push({
        role: 'user',
        parts: [{ text: this.userInput }],
      });

      this.userInput = '';

      this.chatService.generateResponse(this.chatHistory).subscribe(
        (data) => {
          console.log(data);

          this.messages.pop(); // Remove loading message
          const botResponse =
            data?.candidates?.[0]?.content?.parts?.[0]?.text ||
            'Sorry, I didn’t understand.';
          this.addTypingEffect(botResponse);
        },
        (error) => {
          console.error(error);
          this.messages.pop();
          this.messages.push({
            text: 'Error fetching response.',
            sender: 'bot',
          });
          this.isBotTyping = false; // Re-enable form after error
        }
      );
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
        this.userInput = ''; // Reset input field
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
        this.messages = []; // Clear all chat messages
        this.showSlider = true; // Show the slider again after clearing
        this.userInput = ''; // Reset input field
        this._Router.navigate(['blank/chat']);
      }
    });
  }
}
