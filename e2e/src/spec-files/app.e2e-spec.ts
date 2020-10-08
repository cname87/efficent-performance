/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { browser, ElementFinder } from 'protractor';

import { getDashboardPage } from '../pages/dashboard.page';
import { getHelpers } from '../helpers/e2e-helpers';

describe('Efficient-Performance', () => {
  const {
    loadRootPage,
    originalTimeout,
    setTimeout,
    resetTimeout,
  } = getHelpers();

  /* run before each 'it' function to supply local variables e.g. expected values for tests */
  const createExpected = () => {
    const expected = {
      /* expected values */
      title: 'Project Perform',
      header: 'Team Members',
      linkNames: ['MEMBERS DASHBOARD', 'MEMBERS LIST', 'MEMBER DETAIL'],
      numTopMembers: 4,
      selectedMemberIndex: 2,
      selectedMember: { id: 0, name: '' },
      foundMember: { id: 9, name: 'test118' },
      nameSuffix: 'X',
      newName: '',
      numMessages1: 1,
      messageFetchedAll: 'MembersService: Fetched all members',
      numMessages2: 2,
      messageFetchedId: 'MembersService: Fetched member with id = ',
      numMessages3: 4,
      messageDeletedId: 'MembersService: Deleted member with id = ',
      messageUpdatedId: 'MembersService: Updated member with id = ',
      messageNotFound: 'PAGE NOT FOUND',
      messageClickAbove: 'Click on a tab link above',
      addedMemberName: 'Added',
      searchTest1: 8,
      searchTest11: 4,
      searchTest18: 1,
    };
    return {
      expected,
    };
  };

  beforeAll(async () => {
    setTimeout(1200000);
  });

  afterAll(() => {
    resetTimeout(originalTimeout);
  });

  describe('has', () => {
    beforeAll(async () => {
      /* Load root page but not logged in */
      await loadRootPage(false);
    });

    it('a web page with the expected title', async () => {
      const { expected } = createExpected();
      expect(await browser.getTitle()).toEqual(
        expected.title,
        'browser tab title',
      );
    });

    it('a dashboard page with the expected header', async () => {
      const { expected } = createExpected();
      const dashboardPage = getDashboardPage();
      expect(await dashboardPage.rootElements.bannerHeader.getText()).toEqual(
        expected.header,
        'banner header',
      );
    });

    it('a nav element with the expected links', async () => {
      const { expected } = createExpected();
      const dashboardPage = getDashboardPage();
      const linkNames = await dashboardPage.rootElements.navElements.map(
        (el?: ElementFinder) => el!.getText(),
      );
      expect(linkNames).toEqual(expected.linkNames as any, 'root links');
    });
  });
});
