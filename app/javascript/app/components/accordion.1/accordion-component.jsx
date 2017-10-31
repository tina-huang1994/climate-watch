import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Collapse } from 'react-collapse';
import Icon from 'components/icon';
import cx from 'classnames';

import dropdownArrow from 'assets/icons/dropdown-arrow.svg';
import layout from 'styles/layout.scss';
import styles from './accordion-styles.scss';

class Accordion extends PureComponent {
  render() {
    const { className, data, handleOnClick, openSlug, compare } = this.props;
    return (
      <div className={className}>
        {data.map((section, index) => {
          let isOpen = index === 0;
          if (openSlug) {
            if (openSlug !== 'none') {
              const isActiveInResults = data.some(d => d.slug === openSlug);
              isOpen =
                openSlug === section.slug ||
                (index === 0 && !isActiveInResults);
            } else {
              isOpen = false;
            }
          }
          return section.definitions.length ? (
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
                    <dl className={styles.definitionList}>
                      {section.definitions.map(def => (
                        <div
                          key={`${def.slug}-${section.slug}`}
                          className={cx(
                            compare
                              ? styles.definitionCompare
                              : styles.definition
                          )}
                        >
                          <dt className={styles.definitionTitle}>
                            {def.title}
                          </dt>
                          {def.descriptions.map(desc => (
                            <dd
                              key={`${def.slug}-${desc.iso}`}
                              className={styles.definitionDesc}
                            >
                              <div
                                dangerouslySetInnerHTML={{ __html: desc.value }} // eslint-disable-line
                              />
                            </dd>
                          ))}
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
              </Collapse>
            </section>
          ) : null;
        })}
      </div>
    );
  }
}

Accordion.propTypes = {
  className: PropTypes.string,
  openSlug: PropTypes.string,
  handleOnClick: PropTypes.func,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      slug: PropTypes.string,
      definitions: PropTypes.array.isRequired
    })
  ),
  compare: PropTypes.bool
};

Accordion.defaultProps = {
  data: []
};

export default Accordion;
