/* If BASE_PATH ends with '/', append just the version. This is useful for local debugging:
 *
 * BASE_PATH=http://lucifer.usersys.redhat.com:4000/api/ npm run start
 *
 * Will correctly work with a local running Inventory API (bundle exec rails s -b 0.0.0.0 -p 4000).
 *
 *
 * Else append the microservice path and version. This behavior is compatible with Service Catalog.
 */
const calculateApiBase = b => (
    (b.endsWith('/') && `${b}v1.0`) || `${b}/sources/v1.0`
);

export const SOURCES_API_BASE = calculateApiBase(process.env.BASE_PATH || '');
