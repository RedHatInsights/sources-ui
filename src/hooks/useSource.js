import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

export const useSource = () => {
    const { id } = useParams();
    const source = useSelector(({ sources }) => sources.entities.find(source => source.id === id));

    return source;
};
