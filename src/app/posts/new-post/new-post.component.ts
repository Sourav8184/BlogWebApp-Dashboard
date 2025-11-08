import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.scss'],
})
export class NewPostComponent implements OnInit {
  constructor() {}
  permalink: string = '';

  ngOnInit(): void {}

  onTitleChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const title = inputElement.value;
    this.permalink = title.trim().toLowerCase().replace(/\s+/g, '-');
  }
}
