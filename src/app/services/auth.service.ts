import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {LoadingController, ToastController} from '@ionic/angular';
import {AngularFireDatabase} from '@angular/fire/database';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loading = null;

  constructor(
    public fireAuth: AngularFireAuth,
    public firebaseDB: AngularFireDatabase,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private router: Router,
  ) { }

  async signUp(firstName, lastName: string, email: string, password: string) {
    await this.presentLoading().then(() => {
      return new Promise<any>((resolve, reject) => {
        this.fireAuth.createUserWithEmailAndPassword(email, password)
            .then(
                async res => {
                  const path = 'Users/' + res.user.uid;
                  await this.firebaseDB.object(path).set({
                      email,
                      firstName,
                      lastName,
                      fullName: firstName + ' ' + lastName,
                      imageUrl: 'https://firebasestorage.googleapis.com/v0/b/uas-mobile2-93a7a.appspot.com/o/profile.png?alt=media&token=616ab059-dfa9-4c02-aa85-97fc670f866a'
                  });
                  const msg = 'Register Successfully!';
                  const clr = 'success';
                  await this.presentToast(msg, clr);
                  this.loading.dismiss();
                  await this.signIn(email, password);
                },
                err => {
                  reject(err);
                  const msg = 'Register Failed!';
                  const clr = 'danger';
                  this.presentToast(msg, clr);
                  this.loading.dismiss();
                }
            );
      });
    });
  }

  public async presentToast(tmessage: string, tcolor: string) {
    const toast = await this.toastCtrl.create({
      message: tmessage,
      duration: 2000,
      color: tcolor,
    });
    await toast.present();
  }

  private async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      duration: 2000,
      message: 'Please wait...',
    });
    await this.loading.present();
  }

  async signIn(email, password) {
    await this.presentLoading().then(() => {
      return new Promise<any>((resolve, reject) => {
        this.fireAuth.signInWithEmailAndPassword(email, password)
            .then(
                res => {
                  resolve(res);
                  const msg = 'Logged In!';
                  const clr = 'success';
                  this.presentToast(msg, clr);
                  this.loading.dismiss();
                  this.router.navigate(['/tabs/maps']);
                },
                err => {
                  reject(err);
                  const msg = 'Wrong Email or Password!';
                  const clr = 'danger';
                  this.presentToast(msg, clr);
                  this.loading.dismiss();
                }
            );
      });
    });
  }

  async signOut() {
    await this.presentLoading().then(() => {
      return new Promise((resolve, reject) => {
        if (this.fireAuth.currentUser) {
          this.fireAuth.signOut()
          .then(() => {
            console.log('Log Out');
            resolve();
            const msg = 'Logged Out!';
            const clr = 'success';
            this.presentToast(msg, clr);
            this.loading.dismiss();
          })
          .catch((error) => {
              reject();
              const msg = 'Something went wrong. Please try again.';
              const color = 'danger';
              this.presentToast(msg, color);
          });
        }
      });
    });
  }

  userDetails() {
    return this.fireAuth.user;
  }
}
