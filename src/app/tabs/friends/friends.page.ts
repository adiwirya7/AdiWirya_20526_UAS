import { Component, OnInit } from '@angular/core';
import {AlertController, LoadingController, ToastController} from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import {AngularFireDatabase} from '@angular/fire/database';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.page.html',
  styleUrls: ['./friends.page.scss'],
})
export class FriendsPage implements OnInit {
  private searchValue: string;
  private id: string;
  private userData: any;
  private friendId: any [] = [];
  private friendFriend: any [] = [];
  refPath: any;
  private userFriendsData: any [] = [];
  private userFilter: any;
  private loading: any;

  constructor(
      private firebaseAuthService: AuthService,
      public firebaseDB: AngularFireDatabase,
      private alertCtrl: AlertController,
      private loadingCtrl: LoadingController,
      private toastCtrl: ToastController,
  ) { }

  ngOnInit() {

  }

  ionViewDidEnter(){
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

  findFriendsData(userId: string) {
    this.userFriendsData = [];
    this.friendId = [];
    this.firebaseDB.database.ref('Users/' + userId + '/friends').once('value', data => {
      data.forEach(i => {
        this.firebaseDB.object('Users/' + i.val()).query.once('value').then(
            res => {
              // console.log(res.val());
              this.userFriendsData.push(res.val());
              // console.log(this.userFriendsData);
            }
        );
        this.friendId.push(i.val());
      });
    });
    this.userFilter = this.userFriendsData;
  }

  getFriendsData(){
    this.findFriendsData(this.id);
  }

  getUserData(){
    this.firebaseDB.object(this.refPath).valueChanges().subscribe(data => {
      this.userData = data;
      this.userFriendsData = [];
      this.getFriendsData();
    });
  }

  searchFriends(){
    if (this.userFilter){
      if (this.searchValue === ''){
        this.userFilter = this.userFriendsData;
      }
      else{
        this.filterFriendList();
      }
    }
  }

  filterFriendList(){
    // console.log('masuk');
    this.userFilter = this.userFriendsData.filter(user => {
      return user.fullName.toLowerCase().includes(this.searchValue.toLowerCase());
    });
  }

  async presentAlert(idx, friendsFullName){
    const alert = await this.alertCtrl.create({
      header: 'Delete',
      message: 'Are you sure want to delete ' + friendsFullName + ' form Friend List?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Hapus',
          handler: () => this.deleteFriends(idx)
        }
      ]
    });
    await alert.present();
  }

  async presentLoading(){
    this.loading = await this.loadingCtrl.create({
      message: 'Deleting...',
    });
    await this.loading.present();
  }
  async presentToast(){
    const toast = await this.toastCtrl.create({
      message: 'Friend have been deleted...',
      duration: 2000,
      color: 'success'
    });
    await toast.present();
  }

  deleteFriends(idx){
    let index = 0;
    let indx: number;
    let x = 0;
    let y: number;
    if (idx > -1) {
      this.presentLoading().then(async () => {
        const fid = this.friendId[idx];
        this.userData.friends.forEach(j => {
          if (fid === j){
            indx = index;
          }
          index++;
        });
        this.friendFriend = this.userFriendsData[indx].friends;
        this.friendId.splice(idx, 1);

        this.userData.friends = this.friendId;
        const refPath = 'Users/' + this.id;
        await this.firebaseDB.database.ref(refPath).update({
          friends: this.userData.friends,
        });
        if (this.friendFriend.length > 1){
          this.friendFriend.forEach(p => {
            if (p === this.id){
              y = x;
            }
            x++;
          });
        }
        this.friendFriend.splice(y, 1);

        const refPath2 = 'Users/' + fid;
        await this.firebaseDB.database.ref(refPath2).update({
          friends: this.friendFriend,
        });

        this.getFriendsData();
        await this.presentToast();
        this.loading.dismiss();
        // location.reload();
      });
    }
  }

  onPress(idx, friendsFullName){
    this.presentAlert(idx, friendsFullName);
  }

  imageLoaded(event){
    const target = event.target || event.srcElement || event.currentTarget;
    const idAttr = target.attributes.id;
    const idValue = idAttr.nodeValue;
    const profileWidth = document.getElementById(idValue).offsetWidth;
    document.getElementById(idValue).style.height = profileWidth + 'px';
  }
}

