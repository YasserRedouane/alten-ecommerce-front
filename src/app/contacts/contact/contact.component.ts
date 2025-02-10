import {CommonModule} from '@angular/common';
import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ToastModule} from "primeng/toast";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ToastModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  private readonly messageService = inject(MessageService);
  contactForm: FormGroup;
  successMessage: string | null = null;
  maxMessageLength = 300;

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.maxLength(300)]],
    });
  }

  get messageLength(): number {
    return this.contactForm.get('message')?.value?.length || 0;
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      console.log(this.contactForm.value);
      this.successMessage = 'Demande de contact envoyée avec succès';
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Demande de contact envoyée avec succès',
        life: 3000
      });
      this.contactForm.reset();
    }
  }
}
