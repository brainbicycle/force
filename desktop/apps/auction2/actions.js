import metaphysics from '../../../lib/metaphysics.coffee'
import { filterQuery } from './filter_query'

// Action types
export const TOGGLE_FETCHING_ARTWORKS = 'TOGGLE_FETCHING_ARTWORKS'
export const TOGGLE_LIST_VIEW = 'TOGGLE_LIST_VIEW'
export const UPDATE_AGGREGATED_ARTISTS = 'UPDATE_AGGREGATED_ARTISTS'
export const UPDATE_AGGREGATED_MEDIUMS = 'UPDATE_AGGREGATED_MEDIUMS'
export const UPDATE_ALL_FETCHED = 'UPDATE_ALL_FETCHED'
export const UPDATE_ARTIST_ID = 'UPDATE_ARTIST_ID'
export const UPDATE_ARTWORKS = 'UPDATE_ARTWORKS'
export const UPDATE_ESTIMATE_DISPLAY = 'UPDATE_ESTIMATE_DISPLAY'
export const UPDATE_ESTIMATE_RANGE = 'UPDATE_ESTIMATE_RANGE'
export const UPDATE_MEDIUM_ID = 'UPDATE_MEDIUM_ID'
export const UPDATE_PAGE = 'UPDATE_PAGE'
export const UPDATE_SORT = 'UPDATE_SORT'
export const UPDATE_TOTAL = 'UPDATE_TOTAL'

// Action creators
export function fetchArtworks() {
  return async (dispatch, getState) => {
    const {
      auctionArtworks: {
        filterParams
      }
    } = getState()

    try {
      dispatch(toggleFetchingArtworks(true))
      const { filter_artworks } = await metaphysics({
        query: filterQuery,
        variables: filterParams,
        req: {
          user: sd.CURRENT_USER
        }
      })

      const aggregations = filter_artworks.aggregations
      const artistAggregation = aggregations.filter((agg) => agg.slice == 'ARTIST')
      const mediumAggregation = aggregations.filter((agg) => agg.slice == 'MEDIUM')

      dispatch(updateAggregatedArtists(artistAggregation[0].counts))
      dispatch(updateAggregatedMediums(mediumAggregation[0].counts))
      dispatch(updateTotal(filter_artworks.total))
      dispatch(updateArtworks(filter_artworks.hits))
      dispatch(updateAllFetched())
      dispatch(toggleFetchingArtworks(false))
    } catch(error) {
      dispatch(toggleFetchingArtworks(false))
      console.error('error!', error)
    }
  }
}

export function fetchMoreArtworks() {
  return async (dispatch, getState) => {
    const {
      auctionArtworks: {
        filterParams
      }
    } = getState()

    try {
      dispatch(toggleFetchingArtworks(true))
      const { filter_artworks } = await metaphysics({
        query: filterQuery,
        variables: filterParams,
        req: {
          user: sd.CURRENT_USER
        }
      })
      dispatch(updateArtworks(filter_artworks.hits))
      dispatch(updateAllFetched())
      dispatch(toggleFetchingArtworks(false))
    } catch(error) {
      dispatch(toggleFetchingArtworks(false))
      console.error('error!', error)
    }
  }
}

export function infiniteScroll() {
  return (dispatch, getState) => {
    const {
      auctionArtworks: {
        allFetched,
        isFetchingArtworks
      }
    } = getState()
    if (!isFetchingArtworks && !allFetched) {
      dispatch(updatePage(false))
      dispatch(fetchMoreArtworks())
    }
  }
}

export function resetArtworks() {
  return (dispatch, getState) => {
    const {
      auctionArtworks: {
        isFetchingArtworks
      }
    } = getState()
    if (!isFetchingArtworks) {
      dispatch(updatePage(true))
      dispatch(fetchArtworks())
    }
  }
}

export function toggleFetchingArtworks(isFetchingArtworks) {
  return {
    type: TOGGLE_FETCHING_ARTWORKS,
    payload: {
      isFetchingArtworks
    }
  }
}

export function toggleListView(isListView) {
  return {
    type: TOGGLE_LIST_VIEW,
    payload: {
      isListView
    }
  }
}

export function updateAggregatedArtists(aggregatedArtists) {
  return {
    type: UPDATE_AGGREGATED_ARTISTS,
    payload: {
      aggregatedArtists
    }
  }
}

export function updateAggregatedMediums(aggregatedMediums) {
  return {
    type: UPDATE_AGGREGATED_MEDIUMS,
    payload: {
      aggregatedMediums
    }
  }
}

export function updateAllFetched() {
  return {
    type: UPDATE_ALL_FETCHED
  }
}

export function updateArtistId(artistId) {
  return {
    type: UPDATE_ARTIST_ID,
    payload: {
      artistId
    }
  }
}

export function updateArtistParams(artistId) {
  return (dispatch) => {
    dispatch(updateArtistId(artistId))
    dispatch(resetArtworks())
  }
}

export function updateArtworks(artworks) {
  return {
    type: UPDATE_ARTWORKS,
    payload: {
      artworks
    }
  }
}

export function updateEstimateDisplay(min, max) {
  return {
    type: UPDATE_ESTIMATE_DISPLAY,
    payload: {
      min,
      max
    }
  }
}

export function updateEstimateRange(min, max) {
  return (dispatch) => {
    dispatch(updateEstimateRangeParams(min, max))
    dispatch(resetArtworks())
  }
}

export function updateEstimateRangeParams(min, max) {
  return {
    type: UPDATE_ESTIMATE_RANGE,
    payload: {
      min,
      max
    }
  }
}

export function updateMediumId(mediumId) {
  return {
    type: UPDATE_MEDIUM_ID,
    payload: {
      mediumId
    }
  }
}

export function updateMediumParams(mediumId) {
  return (dispatch) => {
    dispatch(updateMediumId(mediumId))
    dispatch(resetArtworks())
  }
}

export function updatePage(reset) {
  return {
    type: UPDATE_PAGE,
    payload: {
      reset
    }
  }
}

export function updateSort(sort) {
  return (dispatch) => {
    dispatch(updateSortParam(sort))
    dispatch(resetArtworks())
  }
}

export function updateSortParam(sort) {
  return {
    type: UPDATE_SORT,
    payload: {
      sort
    }
  }
}

export function updateTotal(total) {
  return {
    type: UPDATE_TOTAL,
    payload: {
      total
    }
  }
}