export type Book = {
  id: number;
  title: string;
  author: string;
  link: string;
  sendLink: string;
};

export type BookInfo = {
  id: number;
  title: string;
  author: string;
};

export interface BookFile {
  id: string;
  file: Buffer;
  fileName: string;
  filePath?: string;
}

export type BookFormat = 'mobi' | 'fb2' | 'pdf';
