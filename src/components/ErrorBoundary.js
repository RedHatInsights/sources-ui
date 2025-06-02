import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as Sentry from '@sentry/browser';
import notificationsStore from '../utilities/notificationsStore';

class ErrorBoundary extends Component {
  state = {
    error: null,
  };

  static getDerivedStateFromError(error, errorInfo) {
    return { error, errorInfo };
  }

  componentDidCatch(error) {
    const sentryId = Sentry.captureException(error);
    notificationsStore.addNotification({
      title: `${error.toString()} (Sentry ID: ${sentryId})`,
      variant: 'danger',
      description: error.stack,
    });
  }

  render() {
    const { error } = this.state;
    const { children } = this.props;

    if (error) {
      return <Fragment>Error occurred</Fragment>;
    }

    return <Fragment>{children}</Fragment>;
  }
}

ErrorBoundary.propTypes = {
  dispatch: PropTypes.func.isRequired,
  children: PropTypes.node,
};

export default connect()(ErrorBoundary);
