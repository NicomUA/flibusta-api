import axios from 'axios';
import { getBookInfo, searchBooks } from '../service';
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;


describe('Service', () => {
  it('should get book info', async () => {
    const bookId = 557371;
    const bookTitle = 'Test book';
    const bookAuthor = 'I am author';
    const bookDescription = 'Испытание близнецов [Test of the Twins - ru]';
  
    mockedAxios.get.mockResolvedValue({
      data: `
      <div id="main">
        <h1 class="title">${bookTitle}</h1> 
        <div>
          <p class="genre">
            <a href="/g/4" class="genre" name="sf_heroic">Героическая фантастика</a>
            <a href="/g/11" class="genre" name="sf_fantasy">Фэнтези</a>
          </p>
        </div>
        <script type="text/javascript">var bookId = ${bookId}</script><a href="/a/${bookId}">${bookAuthor}</a>
        <h2>bla-bla</h2><p>${bookDescription}</p>
      </main>`,
    });
    
  
    const book = await getBookInfo(bookId);
    expect(book).toMatchObject({
      id: bookId,
      title: bookTitle,
      author: bookAuthor,
      description: bookDescription,
      genres: [
        { id: 'sf_heroic', title: 'Героическая фантастика' },
        { id: 'sf_fantasy', title: 'Фэнтези' }
      ]
    });
  });

  it('should find books', async () => { 
    mockedAxios.get.mockResolvedValue({
      data: `
      <div id="main">
        <ul>
          <li>
            <a href="/b/77650">Испытание близнецов [<span style="background-color: #FFFCBB">Test</span> of the Twins - ru]</a> - <a href="/a/12744">Маргарет Уэйс</a>, <a href="/a/19857">Трейси Хикмэн</a>
          </li>
        <>/ul
      </div>
      `,
    });
  
    const books = await searchBooks('test');
    expect(books).toMatchObject([{
      id: 77650,
      title: 'Испытание близнецов [Test of the Twins - ru]',
      author: 'Маргарет Уэйс, Трейси Хикмэн',
      link: '/download_77650',
      sendLink: '/send_77650'
    }
    ]);
  });
})

