import computeSourcesUrl from '../../utilities/computeSourcesUrl';

describe('computeSourcesUrl', () => {
  it('on preview', () => {
    expect(computeSourcesUrl(true)).toEqual('/preview/settings/sources');
  });

  it('on stable', () => {
    expect(computeSourcesUrl(false)).toEqual('/settings/sources');
  });
});
