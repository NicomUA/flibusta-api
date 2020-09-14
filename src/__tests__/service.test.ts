import axios from 'axios';
import { getBookInfo } from '../service';
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

it('Flibusta:getBookInfo', async () => {
  const bookId = 1;
  const bookTitle = 'Test book';
  const bookAuthor = 'I am author';

  mockedAxios.get.mockResolvedValue({
    data: `<title>${bookTitle}</title> <script type="text/javascript">var bookId = ${bookId}</script><a href="/a/${bookId}">${bookAuthor}</a>`,
  });

  const book = await getBookInfo(bookId);
  expect(book).toStrictEqual({
    id: bookId,
    title: bookTitle,
    author: bookAuthor,
  });
});
