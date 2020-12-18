import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  form: FormGroup;

  constructor(
      private formBuilder: FormBuilder,
      private toastCtrl: ToastController,
      private firebaseAuthService: AuthService,
      private router: Router,
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.email, Validators.required]
      }),
      password: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
    });
  }

  onLogin(){
    if (this.form.valid) {
      this.firebaseAuthService.signIn(this.form.value.email, this.form.value.password).then(
          (res) => {
            console.log(res);
          },
          (err) => {
            console.log(err);
          }
      );
      this.form.reset();
    }
  }

}
