import { useSelector } from 'react-redux';

export const useSource = (id) => {
    const source = useSelector(({ providers }) => providers.entities.find(source => source.id  === id));

    return source;
};
