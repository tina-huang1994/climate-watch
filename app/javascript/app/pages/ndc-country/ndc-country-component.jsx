import React, { PureComponent } from 'react';
import Proptypes from 'prop-types';
import Header from 'components/header';
import Intro from 'components/intro';
import Accordion from 'components/accordion';
import Button from 'components/button';
import Icon from 'components/icon';
import Search from 'components/search';
import cx from 'classnames';

import backIcon from 'assets/icons/back.svg';
import lightSearch from 'styles/themes/search-light.scss';
import background from 'assets/backgrounds/home_bg_1';
import styles from './ndc-country-styles.scss';

class NDCCountry extends PureComponent {
  render() {
    const { country, match } = this.props;
    return (
      <div>
        <Header image={background}>
          <div className={cx(styles.doubleFold, styles.header)}>
            <div className={styles.title}>
              <Button
                className={styles.backButton}
                color="transparent"
                link="/ndcs"
                square
              >
                <Icon className={styles.backIcon} icon={backIcon} />
              </Button>
              <Intro title={country.label} />
            </div>
            <div className={styles.threeFold}>
              <Button color="yellow" link={`/ndcs/${match.params.iso}/full`}>
                View full NDC
              </Button>
              <Button
                color="yellow"
                link={`/ndcs/compare?countries=${match.params.iso}`}
              >
                Compare
              </Button>
              <Search theme={lightSearch} placeholder="Search" />
            </div>
          </div>
        </Header>
        <Accordion />
      </div>
    );
  }
}

NDCCountry.propTypes = {
  match: Proptypes.object.isRequired,
  country: Proptypes.object.isRequired
};

export default NDCCountry;