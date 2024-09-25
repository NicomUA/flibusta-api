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
    mockedAxios.get.mockResolvedValue({
      data: `<a href="/b/77650">Испытание близнецов [<span style="background-color: #FFFCBB">Test</span> of the Twins - ru]</a> - <a href="/a/12744">Маргарет Уэйс</a>, <a href="/a/19857">Трейси Хикмэн</a>`,
    });
  
    const books = await searchBooks('test');
    expect(books).toMatchSnapshot([{
      id: 77650,
      title: 'Испытание близнецов [Test of the Twins - ru]',
      author: 'Маргарет Уэйс, Трейси Хикмэн',
      link: '/download_77650',
      sendLink: '/send_77650'
    }
    ]);
  });
})

