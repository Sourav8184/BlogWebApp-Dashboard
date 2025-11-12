import { Category } from './categories.interfact';

export interface Post {
  id?: string;
  title: string;
  permalink: string;
  excerpt: string;
  category: Category;
  content: string;
  imagePath: string;
  isFeatured: boolean;
  views: number;
  status: string;
  createdAt: Date;
}
