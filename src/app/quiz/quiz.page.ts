import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
  selectedAnswer?: number;
  isMarkedForReview: boolean;
  isVisited: boolean;
}

interface QuizSummary {
  totalQuestions: number;
  attempted: number;
  notAttempted: number;
  markedForReview: number;
}

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quiz.page.html',
  styleUrls: ['./quiz.page.css'],
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
export class QuizPage {
  currentQuestion = 0;
  showSummary = false;
  summary: QuizSummary = {
    totalQuestions: 20,
    attempted: 0,
    notAttempted: 20,
    markedForReview: 0
  };

  // Base questions that are hardcoded
  private baseQuestions: Question[] = [
    {
      id: 1,
      text: 'What is the main building block of Angular applications?',
      options: ['Components', 'Modules', 'Services', 'Templates'],
      correctAnswer: 0,
      isMarkedForReview: false,
      isVisited: false
    },
    {
      id: 2,
      text: 'Which decorator is used to define a component in Angular?',
      options: ['@NgComponent', '@Component', '@AngularComponent', '@ComponentDecorator'],
      correctAnswer: 1,
      isMarkedForReview: false,
      isVisited: false
    },
    {
      id: 3,
      text: 'What is the purpose of NgModule?',
      options: ['To handle HTTP requests', 'To define routes', 'To organize components', 'To style components'],
      correctAnswer: 2,
      isMarkedForReview: false,
      isVisited: false
    }
  ];

  // Generated questions
  questions: Question[] = [...this.baseQuestions];

  constructor() {
    this.generateAdditionalQuestions();
  }

  private generateAdditionalQuestions() {
    const topics = ['Services', 'Routing', 'Forms', 'HTTP', 'Directives', 'Pipes', 'CLI'];
    const actions = ['implement', 'configure', 'use', 'define', 'create'];
    
    for (let i = this.baseQuestions.length; i < 20; i++) {
      const topic = topics[Math.floor(Math.random() * topics.length)];
      const action = actions[Math.floor(Math.random() * actions.length)];
      
      const question: Question = {
        id: i + 1,
        text: `How do you ${action} Angular ${topic}?`,
        options: [
          `Using the ${topic} module`,
          `Through ${topic} configuration`,
          `With ${topic} implementation`,
          `Via ${topic} service`
        ],
        correctAnswer: Math.floor(Math.random() * 4),
        isMarkedForReview: false,
        isVisited: false
      };
      
      this.questions.push(question);
    }
  }

  goToQuestion(index: number) {
    this.questions[this.currentQuestion].isVisited = true;
    this.currentQuestion = index;
    this.questions[index].isVisited = true;
    this.updateSummary();
  }

  nextQuestion() {
    if (this.currentQuestion < this.questions.length - 1) {
      this.questions[this.currentQuestion].isVisited = true;
      this.currentQuestion++;
      this.questions[this.currentQuestion].isVisited = true;
      this.updateSummary();
    }
  }

  previousQuestion() {
    if (this.currentQuestion > 0) {
      this.questions[this.currentQuestion].isVisited = true;
      this.currentQuestion--;
      this.questions[this.currentQuestion].isVisited = true;
      this.updateSummary();
    }
  }

  selectAnswer(questionIndex: number, optionIndex: number) {
    this.questions[questionIndex].selectedAnswer = optionIndex;
    this.updateSummary();
  }

  toggleReview(questionIndex: number) {
    this.questions[questionIndex].isMarkedForReview = !this.questions[questionIndex].isMarkedForReview;
    this.updateSummary();
  }

  updateSummary() {
    this.summary.attempted = this.questions.filter(q => q.selectedAnswer !== undefined).length;
    this.summary.markedForReview = this.questions.filter(q => q.isMarkedForReview).length;
    this.summary.notAttempted = this.questions.length - this.summary.attempted;
  }

  submitQuiz() {
    this.updateSummary();
    this.showSummary = true;
  }

  reviewMarkedQuestions() {
    const firstMarkedQuestion = this.questions.findIndex(q => q.isMarkedForReview);
    if (firstMarkedQuestion !== -1) {
      this.currentQuestion = firstMarkedQuestion;
    }
    this.showSummary = false;
  }

  get allQuestionsAnswered(): boolean {
    return this.questions.every(q => q.selectedAnswer !== undefined);
  }

  getQuestionStatus(index: number): string {
    const question = this.questions[index];
    if (index === this.currentQuestion) return 'current';
    if (question.isMarkedForReview) return 'review';
    if (question.selectedAnswer !== undefined) return 'answered';
    if (question.isVisited) return 'visited';
    return 'not-visited';
  }

  getPercentage(value: number): number {
    return (value / this.summary.totalQuestions) * 100;
  }
}

