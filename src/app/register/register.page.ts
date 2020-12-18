import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { AuthService } from '../services/auth.service';
import {LoadingController, ToastController} from '@ionic/angular';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  form: FormGroup;
  id: string;

  constructor(
      private toastCtrl: ToastController,
      private loadingCtrl: LoadingController,
      private firebaseAuthService: AuthService,
      private formBuilder: FormBuilder,
      private router: Router,
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      firstName: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      lastName: new FormControl(null, {
        updateOn: 'blur',
      }),
      email: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.email , Validators.required]
      }),
      password: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      confirmPassword: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      checkbox: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
    }, {validator: this.isMatching('password', 'confirmPassword')});
  }

  isMatching(pass1: string, pass2: string){
    return (group: FormGroup): {[key: string]: any} => {
      const password = group.controls[pass1];
      const password2 = group.controls[pass2];
      if (password.value !== password2.value) {
        return {
          missMatch: true
        };
      }
    };
  }

  goMaps(){
    console.log(this.form.value);

  }

  onRegister(){
    if (this.form.valid) {
      if (!this.form.value.lastName){
        this.form.value.lastName = ' ';
      }
      this.firebaseAuthService.signUp(this.form.value.firstName, this.form.value.lastName, this.form.value.email, this.form.value.password)
          .then(
            res => {
              console.log(res);
        }, (err) => {
          console.log(err.message);
          this.firebaseAuthService.presentToast(err.message, 'danger');
        });
    }
    this.form.reset();
  }
}
