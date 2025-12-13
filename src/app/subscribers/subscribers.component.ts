import { Component, OnInit } from '@angular/core';
import { User } from '../interfaces/user.interface';
import { UserService } from '../service/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-subscribers',
  templateUrl: './subscribers.component.html',
  styleUrls: ['./subscribers.component.scss'],
})
export class SubscribersComponent implements OnInit {
  users: User[] = [];

  constructor(
    private readonly userService: UserService,
    private readonly toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe((data) => {
      this.users = data;
    });
  }

  onDeleteUser(userId: string) {
    this.userService
      .deleteUser(userId)
      .then(() => {
        this.toastr.success('User deleted successfully');
      })
      .catch(() => {
        this.toastr.error('Error deleting user');
      });
  }
}
