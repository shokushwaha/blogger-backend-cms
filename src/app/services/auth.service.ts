import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoggedInGuard: boolean = false;

  constructor(private afAuth: AngularFireAuth, private toastr: ToastrService, private router: Router) {
  }


  register(email, password) {
    this.afAuth.createUserWithEmailAndPassword(email, password).then((ref) => {
      this.toastr.success("Registered successfully")
      this.router.navigate(['/login']);
    })
      .catch((err) => {
        this.toastr.warning(err);
      })
  }

  login(email, password) {
    this.afAuth.signInWithEmailAndPassword(email, password).then((logRef) => {
      this.toastr.success("Login successful");
      this.loadUser();
      this.loggedIn.next(true);
      this.isLoggedInGuard = true;
      this.router.navigate(['/']);
    })
      .catch((err) => {
        this.toastr.warning(err);
      })
  }


  loadUser() {
    this.afAuth.authState.subscribe(user => {
      localStorage.setItem('user', JSON.stringify(user));
    })
  }

  logOut() {
    this.afAuth.signOut().then(() => {
      this.toastr.success("Logged Out");
      localStorage.removeItem('user');
      this.loggedIn.next(false);
      this.isLoggedInGuard = false;
      this.router.navigate(['/login']);
    })
  }

  isLoggedIn() {
    return this.loggedIn.asObservable();
  }
}
