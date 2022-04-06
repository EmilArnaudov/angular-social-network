import { Injectable } from '@angular/core';
import { doc, Firestore, getDoc } from '@angular/fire/firestore';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ProfileExistsGuard implements CanActivate {

  constructor(private firestore: Firestore, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean | UrlTree> {
    let profileToAccessUsername = route.params['username'];
    let docRef = doc(this.firestore, 'users', profileToAccessUsername);
    return getDoc(docRef).then((userData) => {
      let result = userData.data();

      if (result) {
        return true;
      } else {
        this.router.navigate(['/app'])
        return false;
      }
    })
    

  }
  
}
