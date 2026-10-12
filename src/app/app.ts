import { JsonPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { ModelDrivenFormComponent } from 'model-driven-form';
import { DeveloperProfileForm } from './developer-profile-form.model';

@Component({
  imports: [JsonPipe, ModelDrivenFormComponent],
  selector: 'demo-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly formModel = DeveloperProfileForm;
  protected readonly liveValue = signal<Partial<DeveloperProfileForm>>(new DeveloperProfileForm());
  protected readonly submittedValue = signal<DeveloperProfileForm | null>(null);

  protected updateLiveValue(value: Partial<DeveloperProfileForm>): void {
    this.liveValue.set(value);
  }

  protected showSubmittedValue(value: DeveloperProfileForm): void {
    this.submittedValue.set(value);
  }
}
