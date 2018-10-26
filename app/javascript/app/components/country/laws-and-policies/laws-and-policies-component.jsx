import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import isEmpty from 'lodash/isEmpty';
import layout from 'styles/layout.scss';
import SlideCards from 'components/slide-cards';
import ModalMetadata from 'components/modal-metadata';
import Dropdown from 'components/dropdown';
import ButtonGroup from 'components/button-group';
import Card from 'components/card';
import CardRow from 'components/card/card-row';
import LawsAndPoliciesProvider from 'providers/laws-and-policies-provider';
import cx from 'classnames';

import styles from './laws-and-policies-styles.scss';

class LawsAndPolicies extends PureComponent {
  handleSourceChange = sector => {
    const { updateUrlParam } = this.props;
    updateUrlParam(
      {
        name: 'sector',
        value: sector.value
      },
      true
    );
  };

  handleInfoOnClick = () => {
    // TODO: Change the slugs when laws and policies metadata is ready
    this.props.setModalMetadata({
      category: 'Country',
      slugs: 'laws-and-policies',
      customTitle: 'Laws and Policies',
      open: true
    });
  };

  render() {
    const {
      cardsInRow,
      ndcContent,
      sectors,
      lawsTargets,
      countryProfileLink,
      currentSector,
      country
    } = this.props;

    const countryName = country && `${country.wri_standard_name}`;
    const ndcContentPresent = !isEmpty(ndcContent);

    return (
      <div className={layout.content}>
        <h3 className={styles.title}>Laws and Policies</h3>
        <div className={styles.descriptionContainer}>
          <div className="grid-column-item">
            This table compares quantified targets in countries’ NDCs with those
            in their national laws and policies. The purpose is to indicate the
            level of alignment.
          </div>
          <div className={styles.logoContainer}>
            {
              // eslint-disable-next-line jsx-a11y/anchor-has-content
            }
            <a
              href={countryProfileLink}
              className={styles.logo}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span
                className={styles.logoText}
              >{`See all ${lawsTargets.length} ${countryName} national policies on Climate Change Laws of the World.`}</span>
            </a>
          </div>
        </div>
        <div className={styles.actions}>
          <Dropdown
            className={styles.dropdown}
            label="Filter by sector"
            options={sectors}
            onValueChange={this.handleSourceChange}
            value={currentSector}
            disclaimer={`${lawsTargets.length} National Policies available for ${countryName} for the selected sector`}
            hideResetButton
          />
          <div className={styles.buttonContainer}>
            <ButtonGroup
              className={styles.buttonGroup}
              buttonsConfig={[
                {
                  type: 'info',
                  onClick: this.handleInfoOnClick
                }
              ]}
            />
          </div>
        </div>
        <div className={styles.cardsContainer}>
          {ndcContentPresent ? (
            <Card
              contentFirst
              theme={{
                card: styles.fixedCard,
                contentContainer: styles.fixedCardContentContainer,
                title: styles.fixedCardTitle,
                data: styles.fixedCardData
              }}
              title={{
                title: 'Submitted NDC',
                link: ndcContent.sources[0].link
              }}
            >
              <CardRow
                title="Targets type"
                description={ndcContent.type || 'Target type not defined'}
              />
              <CardRow
                title="Targets"
                subtitle="Economy-wide targets"
                description={ndcContent.description}
              />
            </Card>
          ) : (
            <div className={cx(styles.fixedCard, styles.noContent)}>
              {currentSector &&
                currentSector.value &&
                `No ${currentSector.value} targets found in the NDC`}
            </div>
          )}
          {lawsTargets && lawsTargets.length ? (
            <SlideCards cards={lawsTargets} cardsInRow={cardsInRow} />
          ) : (
            <div className={styles.noContent}>
              There are no targets found in law and policies
            </div>
          )}
        </div>
        <ModalMetadata />
        <LawsAndPoliciesProvider />
      </div>
    );
  }
}

LawsAndPolicies.propTypes = {
  setModalMetadata: PropTypes.func.isRequired,
  sectors: PropTypes.array,
  ndcContent: PropTypes.object,
  lawsTargets: PropTypes.array.isRequired,
  cardsInRow: PropTypes.number,
  currentSector: PropTypes.object,
  country: PropTypes.object,
  updateUrlParam: PropTypes.func.isRequired,
  countryProfileLink: PropTypes.string
};

export default LawsAndPolicies;