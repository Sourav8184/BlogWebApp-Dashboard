import { Component, OnInit } from '@angular/core';
import { DEFAULT_POST_IMAGE } from 'src/app/constants/image-paths';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.scss'],
})
export class NewPostComponent implements OnInit {
  constructor() {}
  permalink: string = '';
  imgSrc: string = DEFAULT_POST_IMAGE;

  ngOnInit(): void {}

  onTitleChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const title = inputElement.value;
    this.permalink = title.trim().toLowerCase().replace(/\s+/g, '-');
  }

  showPreview(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.imgSrc = e.target?.result as string;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }
}
