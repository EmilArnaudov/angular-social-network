import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { HomeComponent } from './home/home.component';
import { MainComponent } from './main/main.component';
import { ProfileComponent } from './user/profile/profile.component';
import { AuthGuard } from './shared/auth.guard';
import { UserGuard } from './shared/user.guard';
import { ProfileEditComponent } from './user/profile-edit/profile-edit.component';
import { IsOwnerGuard } from './shared/is-owner.guard';
import { CreatePostComponent } from './posts/create-post/create-post.component';
import { ChatComponent } from './chat/chat.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ProfileExistsGuard } from './shared/profile-exists.guard';

const routes: Routes = [
  {path: '', component: HomeComponent, pathMatch: 'full', canActivate: [UserGuard]},
  {path: 'login', component: LoginComponent, canActivate: [UserGuard]},
  {path: 'register', component: RegisterComponent, canActivate: [UserGuard]},
  {path: 'app', component: MainComponent, canActivate: [AuthGuard]},
  {path: 'app/create-post', component: CreatePostComponent, canActivate: [AuthGuard]},
  {path: 'app/messages/:username', component: ChatComponent, canActivate: [AuthGuard, IsOwnerGuard]},
  {path: 'app/:username', component: ProfileComponent, canActivate: [AuthGuard, ProfileExistsGuard]},
  {path: 'app/:username/edit', component: ProfileEditComponent, canActivate: [AuthGuard, IsOwnerGuard],},
  {path: '**', component: NotFoundComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
