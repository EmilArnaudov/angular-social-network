import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { HomeComponent } from './home/home.component';
import { MainComponent } from './main/main.component';
import { ProfileComponent } from './user/profile/profile.component';
import { AuthGuard } from './shared/auth.guard';
import { UserGuard } from './shared/user.guard';

const routes: Routes = [
  {path: '', component: HomeComponent, pathMatch: 'full', canActivate: [UserGuard]},
  {path: 'login', component: LoginComponent, canActivate: [UserGuard]},
  {path: 'register', component: RegisterComponent, canActivate: [UserGuard]},
  {path: 'app', component: MainComponent, canActivate: [AuthGuard]},
  {path: 'app/:username', component: ProfileComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
