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
            loadingAdditionalData: false,
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
            loadingCountOfEachLanguage: false,
            countOfEachLanguage: [],
            searchSuffix:{
                language: "Any",
                state: "",
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
            loadingAdditionalData: false,
            searchSuffix: {

            },
            source: axios.CancelToken.source(),
            query: undefined
        },
    }
}
