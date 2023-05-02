import computeSourcesUrl from '../../utilities/computeSourcesUrl';

describe('computeSourcesUrl', () => {
  let tmpInsights;

  beforeEach(() => {
    tmpInsights = insights;
  });

  afterEach(() => {
    insights = tmpInsights;
  });

  it('on preview', () => {
    insights = {
      ...insights,
      chrome: {
        ...insights.chrome,
        isBeta: () => true,
      },
    };

    expect(computeSourcesUrl()).toEqual('/preview/settings/sources');
  });

  it('on stable', () => {
    insights = {
      ...insights,
      chrome: {
        ...insights.chrome,
        isBeta: () => false,
      },
    };

    expect(computeSourcesUrl()).toEqual('/settings/sources');
  });
});
