import axios from 'axios';
import { getBookInfo, searchBooks } from '../service';
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;


describe('Service', () => {
  it('should get book info', async () => {
    const bookId = 1;
    const bookTitle = 'Test book';
    const bookAuthor = 'I am author';
  
    mockedAxios.get.mockResolvedValue({
      data: `<title>${bookTitle}</title> <script type="text/javascript">var bookId = ${bookId}</script><a href="/a/${bookId}">${bookAuthor}</a>`,
    });
  
    const book = await getBookInfo(bookId);
    expect(book).toMatchSnapshot({
      id: bookId,
      title: bookTitle,
      author: bookAuthor,
    });
  });

  it('should find books', async () => {
    const bookId = 1;
    const bookTitle = 'Test book';
    const bookAuthor = 'I am author';
  
    mockedAxios.get.mockResolvedValue({
      data: `<a href="/b/${bookId}">${bookTitle}</a> - ${bookAuthor}`,
    });
  
    const books = await searchBooks('test');
    expect(books).toMatchSnapshot([{
      id: 1,
      title: bookTitle
    }
    ]);
  });
})

