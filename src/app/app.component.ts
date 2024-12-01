import { Component } from '@angular/core';
import { QuizPage } from './quiz/quiz.page';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [QuizPage],
  template: '<app-quiz></app-quiz>'
})
export class AppComponent { }

