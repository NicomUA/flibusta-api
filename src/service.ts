import axios from 'axios';
import { Book, BookFile, BookFormat, BookInfo } from './dto';
import { logger } from './logger';

import htmlToText = require('html-to-text');
const ORIGIN = 'http://flibusta.is';

async function getPage(url: string) {
  try {
    const { data } = await axios.get(url);
    return data;
  } catch (error) {
    logger.log(error);
  }
}

export async function searchBooks(text: string, limit = 20): Promise<Book[]> {
  const page: string = await getPage(
    `${ORIGIN}/booksearch?ask=${encodeURIComponent(text)}&chb=on`,
  );

  const bookSearchString = /<a href="(\/b\/)(?<id>[0-9]*)">(?<title>.*)<\/a> - (?<author>.*)/gi;
  const results: Book[] = [];
  let match;

  while ((match = bookSearchString.exec(page))) {
    if (match && match.groups) {
      const { id, title, author } = match.groups;
      results.push({
        id: parseInt(id),
        title: htmlToText.fromString(title, { ignoreHref: true }),
        author: htmlToText.fromString(author, { ignoreHref: true }),
        link: `/download_${id}`,
        sendLink: `/send_${id}`,
      });
    }
  }

  return results.slice(0, limit);
}

export async function searchByAuthor(
  text: string,
  limit = 10,
): Promise<Book[]> {
  const SEARCH_URL = `${ORIGIN}/booksearch?ask=${encodeURIComponent(
    text,
  )}&cha=on`;
  const page = await getPage(SEARCH_URL);
  const re = /<li><a href="(\/a\/)(?<id>[0-9]*)">(?<name>.*)<\/a>/gi;
  const results: Book[] = [];
  const ids = [];
  let match;

  while ((match = re.exec(String(page)))) {
    if (match && match.groups) {
      const { id, name } = match.groups;
      ids.push({ id, name });
    }
  }
  if (ids.length === 0) return [];

  const [author] = ids;
  const authorPage = await getPage(`${ORIGIN}/a/${author.id}`);
  const reBook = /<a href="(\/b\/)(?<id>[0-9]*)">(?<title>[\s\S]*?)<\/a>/gi;
  while ((match = reBook.exec(String(authorPage)))) {
    if (match && match.groups) {
      const { id, title } = match.groups;
      results.push({
        id: parseInt(id),
        title: htmlToText.fromString(title, { ignoreHref: true }),
        author: htmlToText.fromString(author.name, { ignoreHref: true }),
        link: `/download_${id}`,
        sendLink: `/send_${id}`,
      });
    }
  }
  return limit ? results.slice(0, limit) : results;
}

export async function getBookInfo(id: number): Promise<BookInfo | undefined> {
  const page: string = await getPage(`${ORIGIN}/b/${id}`);
  const authorRegExp = /\/script><a href="\/a\/[0-9]+">(?<author>\W+)<\/a>/gi;
  const titleRegExp = /<title>(?<title>\W+).+<\/title>/gi;
  try {
    const bookInfo: BookInfo = { id, author: '', title: '' };

    const authorMatch = authorRegExp.exec(page);
    if (authorMatch && authorMatch.groups) {
      bookInfo.author = authorMatch.groups.author;
    }

    const titleMatch = titleRegExp.exec(page);
    if (titleMatch && titleMatch.groups) {
      bookInfo.title = titleMatch.groups.title;
    }

    return bookInfo;
  } catch (e) {
    logger.error(e);
  }
}

export async function downBook(id: string): Promise<BookFile> {
  const response = await axios({
    url: getUrl(id),
    method: 'GET',
    responseType: 'stream',
  });
  const fileName = response.headers['content-disposition'].slice(21);
  if (!fileName) throw new Error(`Book ${id} unavailable.`);

  return {
    id,
    file: response.data,
    fileName,
  };
}

export function getUrl(id: string, format: BookFormat = 'mobi'): string {
  return `${ORIGIN}/b/${id}/${format}`;
}
