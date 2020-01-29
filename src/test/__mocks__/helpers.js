import { createElement } from 'react';

export const MockFieldProvider = ({ input, render, meta, component, children, ...rest }) => {
    const fieldInput = {
        onChange: jest.fn(),
        ...input
    };
    const fieldMeta = {
        ...meta
    };

    if (typeof children === 'function') {
        return children({ ...rest, input: fieldInput, meta: fieldMeta });
    }

    if (typeof component === 'object') {
        return createElement(component, { ...rest, input: fieldInput, meta: fieldMeta, children });
    }

    return render({ ...rest, input: fieldInput, meta: fieldMeta, children });
};
