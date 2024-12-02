import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

interface QuizSummary {
  totalQuestions: number;
  attempted: number;
  notAttempted: number;
  markedForReview: number;
}

@Component({
  selector: 'app-quiz-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz-summary.component.html',
  styleUrls: ['./quiz-summary.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('500ms ease-in', style({ opacity: 0, transform: 'translateY(20px)' }))
      ])
    ])
  ]
})
export class QuizSummaryComponent {
  @Input() summary!: QuizSummary;
  @Output() reviewQuestions = new EventEmitter<void>();
  @Output() submitQuiz = new EventEmitter<void>();

  getPercentage(value: number): number {
    return (value / this.summary.totalQuestions) * 100;
  }

  onReviewQuestions() {
    this.reviewQuestions.emit();
  }

  onSubmitQuiz() {
    this.submitQuiz.emit();
  }
}

