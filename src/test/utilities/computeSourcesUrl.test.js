import computeSourcesUrl from '../../utilities/computeSourcesUrl';

describe('computeSourcesUrl', () => {
  it('on preview', () => {
    expect(computeSourcesUrl(true)).toEqual('/preview/settings/integrations');
  });

  it('on stable', () => {
    expect(computeSourcesUrl(false)).toEqual('/settings/integrations');
  });
});
