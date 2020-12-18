import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import {LoadingController, ToastController} from '@ionic/angular';
import {map} from 'rxjs/operators';
import {AngularFireDatabase} from '@angular/fire/database';

@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddPage implements OnInit {
  private searchValue: string;
  private id: string;
  private userData: any;
  private friendsData: any;
  refPath: any;
  private friendsId: any;
  private userFriends: any[] = [];
  private friendFriends: any[] = [];
  private searchedUserData: any = {};
  private userFound = false;
  private isFriend = false;
  private loading: any = null;

  constructor(
      private firebaseAuthService: AuthService,
      public firebaseDB: AngularFireDatabase,
      private toastCtrl: ToastController,
      private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    this.firebaseAuthService.userDetails().subscribe(res => {
      if (res !== null){
        this.id = res.uid;
        this.refPath = 'Users/' + this.id;
        this.getUserData();
      }
    }, err => {
      console.log(err);
    });
  }

  getUsersData(){
    if (this.userData.friends){
      this.userFriends = this.userData.friends;
    }else{
      this.userFriends = [];
    }
    // console.log(this.userFriends);
  }

  getUserData(){
    this.firebaseDB.object(this.refPath).valueChanges().subscribe(data => {
      this.userData = data;
      // console.log('data', this.userData);
      this.getUsersData();
    });
  }

  checkUserFriends(){
    this.userData.friends.forEach( i => {
      if (i === this.friendsId){
        this.isFriend = true;
      }
    });
  }

  async presentToast(tm: string, cm: string) {
    const toast = await this.toastCtrl.create({
      message: tm,
      duration: 3000,
      color: cm,
    });
    await toast.present();
  }

  async presentLoading(){
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...',
      duration: 3000
    });
    await loading.present();

    const {role, data} = await loading.onDidDismiss();
    console.log('Loading dismissed!');
  }

  getSearchedUser(searchEmail: string) {
     this.isFriend = false;
     this.firebaseDB.database.ref('Users').once('value', (data) => {
        // console.log('data', data.val());
        data.forEach(i => {
          if (i.val().email === searchEmail) {
            this.searchedUserData = i.val();
            this.friendsId = i.ref.key;
          }
        });
        if (this.searchedUserData.email !== searchEmail){
          this.searchedUserData = {};
          this.userFound = false;
          const msg = 'User not found!';
          const clr = 'danger';
          this.presentToast(msg, clr);
        }else {
          this.userFound = true;
          if (this.userData.friends) {
            this.checkUserFriends();
          }
        }
     });
  }

  async searchUser() {
    await this.presentLoading().then(() => {
      if (this.searchValue !== '') {
        this.getSearchedUser(this.searchValue);
      }
      this.loading.dismiss();
    });
  }

  async addFriend(){
    this.friendFriends = [];
    await this.presentLoading().then(async () => {
      this.firebaseDB.object('Users/' + this.friendsId + '/friends').query.once('value').then(async res => {
        res.forEach(i => {
          // console.log(i.val());
          this.friendFriends.push(i.val());
        });
        console.log('test', this.friendFriends);
        this.friendFriends.push(this.id);
        console.log('test2', this.friendFriends);
        this.firebaseDB.object('Users/' + this.friendsId).valueChanges().subscribe(async res2 => {
          this.friendsData = res2;
          console.log('data', this.friendsData);
          if (this.friendsData.friends){
            this.friendsData.friends = this.friendFriends;
            const refPath2 = 'Users/' + this.friendsId;
            await this.firebaseDB.database.ref(refPath2).update({
              friends: this.friendsData.friends,
            });
          }else{
            const refPath2 = 'Users/' + this.friendsId;
            await this.firebaseDB.database.ref(refPath2).update({
              friends: this.friendFriends,
            });
          }
          this.friendFriends = [];
        });
      });
      this.userFriends.push(this.friendsId);
      this.userData.friends = this.userFriends;
      const refPath = 'Users/' + this.id;
      await this.firebaseDB.database.ref(refPath).update({
        friends: this.userData.friends,
      });

      // console.log(this.friendFriends);
      this.isFriend = true;
      const msg = 'Have successfuly added';
      const clr = 'success';
      this.presentToast(msg, clr);
    });
  }

  imageLoaded(event){
    const target = event.target || event.srcElement || event.currentTarget;
    const idAttr = target.attributes.id;
    const idValue = idAttr.nodeValue;
    const profileWidth = document.getElementById(idValue).offsetWidth;
    document.getElementById(idValue).style.height = profileWidth + 'px';
  }

}
