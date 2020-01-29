import React from 'react';
import ContentLoader from 'react-content-loader';

const PaginationLoader = () => (
    <div className="ins-c-sources__pagination-loader-wrapper">
        <ContentLoader
            height={36}
            width={400}
            speed={2}
            primaryColor="#f3f3f3"
            secondaryColor="#ecebeb"
        >
            <rect x="0" y="0" rx="6" ry="6" width="400" height="36" />
        </ContentLoader>
    </div>
);

export default PaginationLoader;
