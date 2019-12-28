import {REST_DEFAULT_PAGINATIONAL_DATA_STATE} from "../constant";

export default {
    searchQuery: "",
    searchResult: {
        repositories: {
            ...REST_DEFAULT_PAGINATIONAL_DATA_STATE(),
            counts: [],
            searchSuffix:{
                language: "Any",
            },
            query: {
                sort: undefined
            }
        },
        code: {
            ...REST_DEFAULT_PAGINATIONAL_DATA_STATE(),
            searchSuffix:{
                language: "Any",
            },
            query: {
                sort: undefined
            }
        },
        commits: {
            ...REST_DEFAULT_PAGINATIONAL_DATA_STATE(),

            query: {
                sort: undefined
            }
        },
        issues: {
            ...REST_DEFAULT_PAGINATIONAL_DATA_STATE(),
            searchSuffix:{
                language: "Any",
                state: "Any",
            },
            query: {
                sort: undefined
            }
        },
        users: {
            ...REST_DEFAULT_PAGINATIONAL_DATA_STATE(),
            searchSuffix:{
                language: "Any",
            },
            query: {
                sort: undefined
            }
        },
        topics: {
            ...REST_DEFAULT_PAGINATIONAL_DATA_STATE(),
            searchSuffix: {

            },
            query: {
                sort: undefined
            }
        },
    }
}
