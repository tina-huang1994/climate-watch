import { PureComponent, createElement } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import qs from 'query-string';
import { handleAnalytics } from 'utils/analytics';
import { isCountryIncluded } from 'app/utils';
import { getLocationParamUpdated } from 'utils/navigation';
import { IGNORED_COUNTRIES_ISOS } from 'data/ignored-countries';
import { getHoverIndex } from 'components/ndcs/shared/utils';
import { actions as modalActions } from 'components/modal-metadata';
import exploreMapActions from 'components/ndcs/shared/explore-map/explore-map-actions';
import { getIsShowEUCountriesChecked } from 'components/ndcs/shared/explore-map/explore-map-selectors';
import Component from './ndcs-explore-map-component';

import {
  getMapIndicator,
  getPathsWithStyles,
  getISOCountries,
  getLinkToDataExplorer,
  getEmissionsCardData,
  getLegend,
  getSummaryCardData,
  getCategories,
  getCategoryIndicators,
  getSelectedCategory,
  getTooltipCountryValues,
  getDonutActiveIndex
} from './ndcs-explore-map-selectors';

const actions = { ...modalActions, ...exploreMapActions };

const mapStateToProps = (state, { location }) => {
  const { data, loading } = state.ndcs;
  const { countries } = state;
  const search = qs.parse(location.search);

  const ndcsExploreWithSelection = {
    ...state,
    ...data,
    countries: countries.data,
    query: search.search,
    categorySelected: search.category,
    indicatorSelected: search.indicator,
    emissions: state.emissions,
    search
  };

  return {
    loading,
    query: ndcsExploreWithSelection.query,
    selectedCategory: getSelectedCategory(ndcsExploreWithSelection),
    paths: getPathsWithStyles(ndcsExploreWithSelection),
    isoCountries: getISOCountries(ndcsExploreWithSelection),
    selectedIndicator: getMapIndicator(ndcsExploreWithSelection),
    emissionsCardData: getEmissionsCardData(ndcsExploreWithSelection),
    tooltipCountryValues: getTooltipCountryValues(ndcsExploreWithSelection),
    legendData: getLegend(ndcsExploreWithSelection),
    summaryCardData: getSummaryCardData(ndcsExploreWithSelection),
    downloadLink: getLinkToDataExplorer(ndcsExploreWithSelection),
    categories: getCategories(ndcsExploreWithSelection),
    indicators: getCategoryIndicators(ndcsExploreWithSelection),
    donutActiveIndex: getDonutActiveIndex(ndcsExploreWithSelection),
    checked: getIsShowEUCountriesChecked(ndcsExploreWithSelection)
  };
};

class NDCSExploreMapContainer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      country: null,
      tooltipValues: {}
    };
  }

  handleSearchChange = query => {
    this.updateUrlParam({ name: 'search', value: query });
  };

  handleCountryClick = (geography, countryData) => {
    const { isoCountries } = this.props;
    const { id: iso, name } = countryData || {};
    const countryIso =
      iso || (geography && geography.properties && geography.properties.id);
    if (countryIso && isCountryIncluded(isoCountries, countryIso)) {
      this.props.history.push(`/ndcs/country/${countryIso}`);
      handleAnalytics(
        'NDCS Explore Map',
        'Use map to find country',
        name || geography.properties.name
      );
    }
  };
  handleCountryEnter = geography => {
    const {
      tooltipCountryValues,
      legendData,
      selectActiveDonutIndex,
      emissionsCardData
    } = this.props;
    const iso = geography.properties && geography.properties.id;

    if (IGNORED_COUNTRIES_ISOS.includes(iso)) {
      // We won't show Taiwan and Western Sahara as an independent country
      this.setState({ tooltipValues: null, country: null });
    } else {
      const tooltipValue = tooltipCountryValues && tooltipCountryValues[iso];
      if (tooltipValue && tooltipValue.labelId) {
        const hoveredlegendData = legendData.find(
          l => parseInt(l.id, 10) === tooltipValue.labelId
        );
        if (hoveredlegendData) {
          selectActiveDonutIndex(
            getHoverIndex(emissionsCardData, hoveredlegendData)
          );
        }
      } else if (legendData) {
        // This is the last legend item aggregating all the no data geographies
        selectActiveDonutIndex(
          getHoverIndex(emissionsCardData, legendData[legendData.length - 1])
        );
      }

      const tooltipValues = {
        value: (tooltipValue && tooltipValue.value) || 'Not Applicable',
        countryName: geography.properties && geography.properties.name
      };

      this.setState({ tooltipValues, country: geography.properties });
    }
  };

  handleSearchChange = query => {
    this.updateUrlParam({ name: 'search', value: query });
  };

  handleCategoryChange = category => {
    this.updateUrlParam(
      {
        name: 'category',
        value: category.value
      },
      true
    );
    handleAnalytics('NDCS Explore Map', 'Change category', category.label);
  };

  handleIndicatorChange = indicator => {
    this.updateUrlParam({ name: 'indicator', value: indicator.value });
    handleAnalytics('NDCS Explore Map', 'Change indicator', indicator.label);
  };

  handleInfoClick = () => {
    this.props.setModalMetadata({
      customTitle: 'Explore NDCs',
      category: 'NDCS Explore Map',
      slugs: ['ndc_cw', 'ndc_wb', 'ndc_die'],
      open: true
    });
  };

  handleOnChangeChecked = query => {
    this.updateUrlParam({ name: 'showEUCountries', value: query });
  };

  updateUrlParam(param, clear) {
    const { history, location } = this.props;
    history.replace(getLocationParamUpdated(location, param, clear));
  }

  render() {
    const {
      query,
      indicator,
      summaryData,
      selectedCategory,
      checked
    } = this.props;
    const { country: countryData, tooltipValues } = this.state;
    const noContentMsg = query
      ? 'No results found'
      : 'There is no data for this indicator';
    return createElement(Component, {
      ...this.props,
      handleCountryClick: this.handleCountryClick,
      handleCountryEnter: this.handleCountryEnter,
      handleInfoClick: this.handleInfoClick,
      noContentMsg,
      handleSearchChange: this.handleSearchChange,
      handleCategoryChange: this.handleCategoryChange,
      handleIndicatorChange: this.handleIndicatorChange,
      handleOnChangeChecked: this.handleOnChangeChecked,
      checked,
      indicator,
      summaryData,
      selectedCategory,
      countryData,
      tooltipValues
    });
  }
}

NDCSExploreMapContainer.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  isoCountries: PropTypes.array.isRequired,
  setModalMetadata: PropTypes.func.isRequired,
  query: PropTypes.object,
  summaryData: PropTypes.array,
  selectedCategory: PropTypes.array,
  emissionsCardData: PropTypes.array,
  indicator: PropTypes.object,
  selectActiveDonutIndex: PropTypes.func.isRequired,
  legendData: PropTypes.array,
  checked: PropTypes.bool,
  tooltipCountryValues: PropTypes.object
};

export default withRouter(
  connect(mapStateToProps, actions)(NDCSExploreMapContainer)
);
