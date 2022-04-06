import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { provideFirestore } from '@angular/fire/firestore';
import { getFirestore } from 'firebase/firestore';
import { provideFirebaseApp } from '@angular/fire/app';
import { initializeApp } from 'firebase/app';
import { provideAuth } from '@angular/fire/auth';
import { getAuth } from 'firebase/auth';
import { RouterModule } from '@angular/router';
import { CoreModule } from './core/core.module';
import { FormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { getStorage, provideStorage } from '@angular/fire/storage';

import { HomeComponent } from './home/home.component';
import { AuthModule } from './auth/auth.module';
import { MainComponent } from './main/main.component';
import { ProfileComponent } from './user/profile/profile.component';
import { ProfileEditComponent } from './user/profile-edit/profile-edit.component';
import { CreatePostComponent } from './posts/create-post/create-post.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ChatComponent } from './chat/chat.component';
import { NotFoundComponent } from './not-found/not-found.component';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MainComponent,
    ProfileComponent,
    ProfileEditComponent,
    CreatePostComponent,
    SidebarComponent,
    ChatComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    CoreModule,
    AuthModule,
    AppRoutingModule,
    RouterModule,
    FormsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
