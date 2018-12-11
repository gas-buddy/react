import React from 'react';
import PT from 'prop-types';
import fetch from 'isomorphic-fetch';

/**
 * This component allows you to easily fetch a server side data payload
 * and pass it as a property to the child component, along with a loading
 * boolean
 */
export class WithData extends React.Component {
  state = {
    loading: false,
  }

  componentDidMount() {
    const { url, autoLoad } = this.props;
    const { loading } = this.state;
    if (url && autoLoad && !('data' in this.state) && !loading) {
      this.fetch();
    }
  }

  shouldComponentUpdate({ body, url }, nextState) {
    const { url: pUrl, body: pBody } = this.props;
    return (
      url !== pUrl
      || body !== pBody
      || nextState !== this.state
    );
  }

  componentDidUpdate({ body, url }) {
    const newBody = body ? JSON.stringify(body) : null;
    const { body: pBody, url: pUrl, autoLoad } = this.props;
    const exBody = pBody ? JSON.stringify(pBody) : null;
    if (autoLoad && (newBody !== exBody || url !== pUrl)) {
      this.fetch();
    }
  }

  fetch = () => {
    const { url, method, body, valuesForState, onData } = this.props;
    const baseState = { url, method, body };

    // If you want to cache results, use onData and valuesForState to
    // store it in redux or similar.
    if (valuesForState) {
      const rz = valuesForState(baseState);
      if (rz && rz.data) {
        this.setState({
          ...baseState,
          data: rz.data,
          status: rz.status || 200,
        });
        return;
      }
    }
    const headers = {
      'Request-Source': 'ajax',
    };

    if (body) {
      headers['Content-Type'] = 'application/json';
    }

    fetch(url, {
      credentials: 'include',
      method,
      body: body ? JSON.stringify(body) : undefined,
      headers,
    }).then(async (response) => {
      const data = await response.json();
      this.setState({
        ...baseState,
        data,
        status: response.status,
        loading: false,
      }, () => {
        if (onData) {
          onData(baseState, data);
        }
      });
    }).catch((error) => {
      this.setState({
        ...baseState,
        error,
        status: error.status,
        loading: false,
      });
    });
    this.setState({
      ...baseState,
      loading: true,
    });
  }

  render() {
    const { children } = this.props;
    return children && React.cloneElement(children, {
      ...this.state,
      fetch: this.fetch,
    });
  }
}

WithData.propTypes = {
  children: PT.node,
  url: PT.string,
  method: PT.string,
  // eslint-disable-next-line react/forbid-prop-types
  body: PT.object,
  autoLoad: PT.bool,
  onData: PT.func,
  valuesForState: PT.func,
};

WithData.defaultProps = {
  children: null,
  url: null,
  method: 'POST',
  body: null,
  autoLoad: true,
  onData: null,
  valuesForState: null,
};
