export const getBaseName = (pathname, level = 2) => {
    let release = '/';
    const pathName = pathname.replace(/(#|\?).*/, '').split('/');

    pathName.shift();

    if (pathName[0] === 'beta') {
        pathName.shift();
        release = `/beta/`;
    }

    return [...new Array(level)].reduce((acc, _curr, key) => {
        return `${acc}${pathName[key] || ''}${key < (level - 1) ? '/' : ''}`;
    }, release);
};
