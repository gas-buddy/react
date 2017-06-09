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
    if (url && autoLoad && !('data' in this.state) && !this.state.loading) {
      this.fetch();
    }
  }

  shouldComponentUpdate({ body, url }, nextState) {
    return (
      url !== this.props.url ||
      body !== this.props.body ||
      nextState !== this.state
    );
  }

  componentDidUpdate({ body, url }) {
    const newBody = body ? JSON.stringify(body) : null;
    const exBody = this.props.body ? JSON.stringify(this.props.body) : null;
    if (this.props.autoLoad && (newBody !== exBody || url !== this.props.url)) {
      this.fetch();
    }
  }

  fetch = () => {
    const { url, method, body } = this.props;
    const baseState = { url, method, body };
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
};

WithData.defaultProps = {
  children: null,
  url: null,
  method: 'POST',
  body: null,
  autoLoad: true,
};
