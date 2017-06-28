import { ClientappPage } from './app.po';

describe('clientapp App', () => {
  let page: ClientappPage;

  beforeEach(() => {
    page = new ClientappPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
