import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Collapse } from 'react-collapse';
import Icon from 'components/icon';
import NoContent from 'components/no-content';
import cx from 'classnames';

import dropdownArrow from 'assets/icons/dropdown-arrow.svg';
import layout from 'styles/layout.scss';
import styles from './accordion-styles.scss';

class Accordion extends PureComponent {
  render() {
    const { data, handleOnClick, activeSection } = this.props;
    return (
      <div>
        {data.map((section, index) => {
          const isOpen = activeSection
            ? activeSection === section.slug
            : index === 0;
          return (
            <section key={section.slug} className={styles.accordion}>
              <button
                className={styles.header}
                onClick={() => handleOnClick(section.slug)}
              >
                <div className={layout.content}>
                  <div className={styles.title}>
                    {section.title}
                    <Icon
                      icon={dropdownArrow}
                      className={cx(styles.iconArrow, {
                        [styles.isOpen]: isOpen
                      })}
                    />
                  </div>
                </div>
              </button>
              <Collapse isOpened={isOpen}>
                <div className={styles.accordionContent}>
                  <div className={layout.content}>
                    {section.definitions.length === 0 &&
                      <NoContent message="Nothing here" />}
                    <dl className={styles.definitionList}>
                      {section.definitions.map(def =>
                        (<div className={styles.definition} key={def.title}>
                          <dt className={styles.definitionTitle}>
                            {def.title}
                          </dt>
                          <dd className={styles.definitionDesc}>
                            {def.description}
                          </dd>
                        </div>)
                      )}
                    </dl>
                  </div>
                </div>
              </Collapse>
            </section>
          );
        })}
      </div>
    );
  }
}

Accordion.propTypes = {
  activeSection: PropTypes.string,
  handleOnClick: PropTypes.func,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      slug: PropTypes.string,
      definitions: PropTypes.array.isRequired
    })
  )
};

Accordion.defaultProps = {
  data: []
};

export default Accordion;
