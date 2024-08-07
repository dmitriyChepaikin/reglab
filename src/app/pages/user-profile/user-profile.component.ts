import {Component} from '@angular/core';
import {Button} from "primeng/button";
import {RouterLink} from "@angular/router";
import {AvatarModule} from "primeng/avatar";
import {User} from "../../store/model/user.model";
import {LocalStorageService} from "../../services/localStorage.service";
import {PasswordChangeComponent} from "../../components/user-profile/password-change/password-change.component";

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    Button,
    RouterLink,
    AvatarModule,
    PasswordChangeComponent
  ],
  templateUrl: './user-profile.component.html',
})
export class UserProfileComponent {
  currentUser: User | null = null

  constructor(
    private localStorageService: LocalStorageService,
  ) {
    this.currentUser = this.localStorageService.getUser();
  }
}
