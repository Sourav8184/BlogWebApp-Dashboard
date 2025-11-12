export interface Category {
  id?: string;
  name: string;
  createdAt: Date;
}

export interface Post {
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
