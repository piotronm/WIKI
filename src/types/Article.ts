export interface Article {
  id: string;
  platform: string;
  category: string;
  title: string;
  description: string;
  imageUrl1?: string;
  imageUrl2?: string;
  dateCreated: string;
  segment: string;
  solution: string;
  userId: string;
  tags?: string[]; // these come from CEW_KB_Tags via the join
}

