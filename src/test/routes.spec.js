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
            expect(replaceRouteId(routes.sourcesEdit.path, id)).toEqual(`/sources/edit/${id}`);
        });

        it('replaces :id in removal path', () => {
            expect(replaceRouteId(routes.sourcesRemove.path, id)).toEqual(`/sources/remove/${id}`);
        });

        it('replaces :id in manageApps path', () => {
            expect(replaceRouteId(routes.sourceManageApps.path, id)).toEqual(`/sources/manage_apps/${id}`);
        });
    });
});
