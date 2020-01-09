import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { addMessage } from '../redux/actions/sources';

class ErrorBoundary extends Component {
    state = {
        error: null
    }

    static getDerivedStateFromError(error, errorInfo) {
        return { error, errorInfo };
    }

    componentDidCatch(error, errorInfo) {
        this.props.dispatch(addMessage(
            error.toString(),
            'danger',
            errorInfo.componentStack
        ));
    }

    render() {
        const { error } = this.state;
        const { children } = this.props;

        if (error) {
            return (<Fragment>
                Error occurred
            </Fragment>);
        }

        return (<Fragment>
            {children}
        </Fragment>);
    }
};

ErrorBoundary.propTypes = {
    dispatch: PropTypes.func.isRequired,
    children: PropTypes.node
};

export default connect()(ErrorBoundary);
