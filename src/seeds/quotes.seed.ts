import quotes from './data/quotes.data';
import QuotesService from '../features/quotes/quotes.service';
import { QuoteDTO } from '../features/quotes';

const seedQuotes = async (): Promise<void> => {
  try {
    const quotesData: QuoteDTO[] = await quotes();
    // eslint-disable-next-line no-restricted-syntax
    for (const quote of quotesData) {
      // eslint-disable-next-line no-await-in-loop
      await QuotesService.createQuote(quote);
    }
  } catch (error) {
    console.log('%c⧭', 'color: #7f7700', `Error quotes seeds ${error}`);
  }
};

export default seedQuotes;
