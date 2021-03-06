import { createSelector } from 'reselect';
import { deburrUpper, filterQuery } from 'app/utils';
import sortBy from 'lodash/sortBy';
import isEmpty from 'lodash/isEmpty';
import { getMapIndicator } from 'components/ndcs/net-zero-map/net-zero-map-selectors';

const getCountries = state => state.countries || null;
const getCategories = state => state.categories || null;
const getIndicatorsData = state => state.indicators || null;
export const getQuery = state => deburrUpper(state.query) || '';

export const getISOCountries = createSelector([getCountries], countries =>
  countries.map(country => country.iso_code3)
);

export const getIndicatorsParsed = createSelector(
  [getCategories, getIndicatorsData, getISOCountries],
  (categories, indicators) => {
    if (!categories || !indicators || !indicators.length) return null;
    const parsedIndicators = sortBy(
      indicators.map(i => ({
        label: i.name,
        value: i.slug,
        categoryIds: i.category_ids,
        locations: i.locations
      })),
      'label'
    );
    return parsedIndicators;
  }
);

export const tableGetSelectedData = createSelector(
  [getIndicatorsParsed, getCountries],
  (indicators, countries) => {
    if (!indicators || !indicators.length || !indicators[0].locations) {
      return [];
    }

    const refIndicator =
      indicators.find(i => i.value === 'nz_submission') || indicators[0];

    return Object.keys(refIndicator.locations).map(iso => {
      if (refIndicator.locations[iso].value === 'No Document Submitted') {
        return false;
      }
      const countryData =
        countries.find(country => country.iso_code3 === iso) || {};
      const row = {
        country: countryData.wri_standard_name || iso,
        iso
      };
      indicators.forEach(ind => {
        if (ind.locations[iso]) {
          row[ind.label] = ind.locations[iso].value;
        }
      });
      return row;
    });
  }
);

const headerChanges = {
  'Net Zero Target Source': 'Source',
  'Net Zero Target Status': 'Target Status',
  'Share of GHG Emissions': 'Share of global GHG emissions'
};

export const getSelectedIndicatorHeader = createSelector(
  [getMapIndicator],
  selectedIndicator => {
    if (!selectedIndicator) return null;
    return `${selectedIndicator.label} (Current selection)`;
  }
);

export const getDefaultColumns = createSelector(
  [getIndicatorsParsed, getSelectedIndicatorHeader],
  (indicators, selectedIndicatorHeader) => {
    if (!indicators || isEmpty(indicators)) return [];
    const columnIds = [
      'country',
      selectedIndicatorHeader,
      'nz_source',
      'nz_status',
      'ndce_ghg'
    ];

    const columns = columnIds.map(id => {
      const match = indicators.find(indicator => indicator.value === id);
      return match ? match.label : id;
    });
    return columns.map(c => headerChanges[c] || c);
  }
);

export const addIndicatorColumn = createSelector(
  [tableGetSelectedData, getMapIndicator, getSelectedIndicatorHeader],
  (data, selectedIndicator, selectedIndicatorHeader) => {
    if (!data || isEmpty(data)) return null;
    const updatedTableData = data;
    return updatedTableData.map(countryRow => {
      const updatedCountryRow = { ...countryRow };
      const countryIndicatorData = selectedIndicator.locations[countryRow.iso];
      updatedCountryRow[selectedIndicatorHeader] =
        countryIndicatorData && countryIndicatorData.value;
      return updatedCountryRow;
    });
  }
);

const getFilteredData = createSelector(
  [addIndicatorColumn, getDefaultColumns],
  (data, columnHeaders) => {
    if (!data || isEmpty(data)) return null;
    const filteredData = data.map(d => {
      const filteredAndChangedHeadersD = {};
      Object.keys(d).forEach(k => {
        const header = headerChanges[k] || k;
        if (columnHeaders.includes(header)) {
          filteredAndChangedHeadersD[header] = d[k];
        }
        // Leave iso and filter it later to get titleLink
        if (k === 'iso') {
          filteredAndChangedHeadersD.iso = d.iso;
        }
      });
      return filteredAndChangedHeadersD;
    });
    return sortBy(filteredData, ['country']);
  }
);

const getFilteredDataBySearch = createSelector(
  [getFilteredData, getQuery],
  (data, query) => {
    if (!data || isEmpty(data)) return null;
    return filterQuery(data, query, ['iso']);
  }
);

export const getTitleLinks = createSelector([getFilteredDataBySearch], data => {
  if (!data || isEmpty(data)) return null;
  return data.map(d => [
    {
      columnName: 'country',
      url: `/country/${d.iso}`
    },
    {
      columnName: 'Source link',
      url: 'self'
    }
  ]);
});

export const removeIsoFromData = createSelector(
  [getFilteredDataBySearch],
  data => {
    if (!data || isEmpty(data)) return null;
    return data.map(d => {
      const updatedD = {};
      Object.keys(d).forEach(key => {
        if (key !== 'iso') {
          updatedD[key] = d[key];
        }
      });
      return updatedD;
    });
  }
);
