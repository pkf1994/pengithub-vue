import {DEFAULT_REST_PAGINATIONAL_DATA_STATE} from "../constant";
import axios from "axios";
export default {
    searchQuery: "",
    loadingCountOfEachSearchType: false,
    searchResult: {
        repositories: {
            ...DEFAULT_REST_PAGINATIONAL_DATA_STATE(),
            source: axios.CancelToken.source(),
            loadingCountOfEachLanguage: false,
            loadingTopicsLanguageColorHelpWantedIssuesCount: false,
            loadingFirstTopic: false,
            firstTopic: {},
            countOfEachLanguage: [],
            searchSuffix:{
                language: "Any",
            },
            query: undefined
        },
        code: {
            ...DEFAULT_REST_PAGINATIONAL_DATA_STATE(),
            source: axios.CancelToken.source(),
            searchSuffix:{
                language: "Any",
            },
            query: undefined
        },
        commits: {
            ...DEFAULT_REST_PAGINATIONAL_DATA_STATE(),
            source: axios.CancelToken.source(),
            query: undefined
        },
        issues: {
            ...DEFAULT_REST_PAGINATIONAL_DATA_STATE(),
            searchSuffix:{
                language: "Any",
                state: "Any",
            },
            source: axios.CancelToken.source(),
            query: undefined
        },
        users: {
            ...DEFAULT_REST_PAGINATIONAL_DATA_STATE(),
            searchSuffix:{
                language: "Any",
            },
            source: axios.CancelToken.source(),
            query: undefined
        },
        topics: {
            ...DEFAULT_REST_PAGINATIONAL_DATA_STATE(),
            searchSuffix: {

            },
            source: axios.CancelToken.source(),
            query: undefined
        },
    }
}
