import React from 'react';
import { Link, LinkProps } from 'react-router-dom';
import { linkBasename, mergeToBasename } from '../../utilities/utils';

const AppLink = React.forwardRef((props: LinkProps, ref: React.Ref<HTMLAnchorElement>) => <Link {...props} ref={ref} to={mergeToBasename(props.to, linkBasename)} />);
AppLink.displayName = 'AppLink';

export default AppLink;
