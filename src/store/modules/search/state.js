import {REST_DEFAULT_PAGINATIONAL_DATA_STATE} from "../constant";
export default {
    searchQuery: "",
    searchResult: {
        repositories: {
            ...REST_DEFAULT_PAGINATIONAL_DATA_STATE(),
            loadingCount: false,
            loadingTopicsLanguageColorHelpWantedIssuesCount: false,
            loadingFirstTopic: false,
            firstTopic: {},
            counts: [],
            searchSuffix:{
                language: "Any",
            },
            query: undefined
        },
        code: {
            ...REST_DEFAULT_PAGINATIONAL_DATA_STATE(),
            searchSuffix:{
                language: "Any",
            },
            query: undefined
        },
        commits: {
            ...REST_DEFAULT_PAGINATIONAL_DATA_STATE(),

            query: undefined
        },
        issues: {
            ...REST_DEFAULT_PAGINATIONAL_DATA_STATE(),
            searchSuffix:{
                language: "Any",
                state: "Any",
            },
            query: undefined
        },
        users: {
            ...REST_DEFAULT_PAGINATIONAL_DATA_STATE(),
            searchSuffix:{
                language: "Any",
            },
            query: undefined
        },
        topics: {
            ...REST_DEFAULT_PAGINATIONAL_DATA_STATE(),
            searchSuffix: {

            },
            query: undefined
        },
    }
}
