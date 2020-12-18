import { NgModule } from '@angular/core';
import {BrowserModule, HAMMER_GESTURE_CONFIG} from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// Firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage'

// Environment
import { environment } from '../environments/environment';

import {DatePipe} from '@angular/common';
import {IonicGestureConfig} from './ionic-gesture-config';
import { defineCustomElements } from '@ionic/pwa-elements/loader';

// Call the element loader after the platform has been bootstrapped
defineCustomElements(window);

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
      BrowserModule,
      IonicModule.forRoot(),
      AppRoutingModule,
      AngularFireModule.initializeApp(environment.firebaseConfig),
      AngularFireDatabaseModule,
      AngularFireAuthModule,
      AngularFireStorageModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    DatePipe,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {provide: HAMMER_GESTURE_CONFIG, useClass: IonicGestureConfig}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
