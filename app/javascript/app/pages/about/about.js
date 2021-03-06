import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { getAnchorLinks } from './about-selectors';
import Component from './about-component';

const mapStateToProps = (state, { route, location }) => ({
  anchorLinks: getAnchorLinks(route),
  query: location.search
});

export default withRouter(connect(mapStateToProps, null)(Component));
