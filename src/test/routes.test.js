import { replaceRouteId, routes } from '../Routes';

describe('routes', () => {
  describe('replaceRouteId', () => {
    const id = '628782';

    it('does nothing', () => {
      expect(replaceRouteId(routes.sources.path, id)).toEqual(routes.sources.path);
    });

    it('replaces :id with id', () => {
      expect(replaceRouteId('/sources/:id', id)).toEqual(`/sources/${id}`);
    });

    it('replaces :id in edit path', () => {
      expect(replaceRouteId(routes.sourcesDetail.path, id)).toEqual(`/sources/detail/${id}`);
    });

    it('replaces :id in removal path', () => {
      expect(replaceRouteId(routes.sourcesRemove.path, id)).toEqual(`/sources/remove/${id}`);
    });

    it('replaces :id in detail/rename path', () => {
      expect(replaceRouteId(routes.sourcesDetailRename.path, id)).toEqual(`/sources/detail/${id}/rename`);
    });

    it('replaces :id in detail/remove path', () => {
      expect(replaceRouteId(routes.sourcesDetailRemove.path, id)).toEqual(`/sources/detail/${id}/remove`);
    });

    it('replaces :id in detail/addApp path', () => {
      expect(replaceRouteId(routes.sourcesDetailAddApp.path, id)).toEqual(`/sources/detail/${id}/add_app/:app_type_id`);
    });
  });
});
