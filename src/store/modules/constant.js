import axios from "axios";

export const DEFAULT_GRAPHQL_PAGINATIONAL_DATA_STATE = (payload) => {
    payload = {
        perPage: 8,
        ...payload
    }
    return {
        nodes: [],
        totalCount: 0,
        perPage: payload.perPage,
        currentPage: 1,
        loading: false,
        pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: undefined,
            endCursor: undefined
        }
    }
}

export const DEFAULT_REST_PAGINATIONAL_DATA_STATE = (payload) => {
    payload = {
        perPage: 8,
        ...payload
    }
    return {
        data: [],
        totalCount: 0,
        perPage: payload.perPage,
        currentPage: 0,
        loading: false,
        pageInfo: {
            next: undefined,
            last: undefined,
            first: undefined,
            prev: undefined
        }
    }
}

export const GRAPHQL_FRAGMENT_PAGEINFO = `
    pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
         }
`

