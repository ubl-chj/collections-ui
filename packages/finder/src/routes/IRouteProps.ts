export interface IRouteProps {
  routeConfig: {
    indexName: string
    queryFields: []
    refinementListFilterDef1: {
      title: string
      field: string
      id: string,
    }
    refinementListFilterDef2: {
      title: string
      field: string
      id: string,
    }
    refinementListFilterDef3: {
      title: string
      field: string
      id: string,
    },
    listDefault: boolean
    sortingSelectorOptions: []
    highlightFields: []
    suggestionField: string
    hasRangeFilter: boolean
    rangeFilter: {
      field: string
      id: string
      min: number
      max: number,
    },
  },
  searchkit: any
}
