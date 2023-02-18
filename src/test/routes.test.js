import { replaceRouteId, routes } from '../Routing';

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
      expect(replaceRouteId(routes.sourcesDetail.path, id)).toEqual(`detail/${id}`);
    });

    it('replaces :id in removal path', () => {
      expect(replaceRouteId(routes.sourcesRemove.path, id)).toEqual(`remove/${id}`);
    });

    it('replaces :id in detail/rename path', () => {
      expect(replaceRouteId(routes.sourcesDetailRename.path, id)).toEqual(`detail/${id}/rename`);
    });

    it('replaces :id in detail/remove path', () => {
      expect(replaceRouteId(routes.sourcesDetailRemove.path, id)).toEqual(`detail/${id}/remove`);
    });

    it('replaces :id in detail/addApp path', () => {
      expect(replaceRouteId(routes.sourcesDetailAddApp.path, id)).toEqual(`detail/${id}/add_app/:app_type_id`);
    });

    it('replaces :id in detail/removeApp path', () => {
      expect(replaceRouteId(routes.sourcesDetailRemoveApp.path, id)).toEqual(`detail/${id}/remove_app/:app_id`);
    });
  });
});
