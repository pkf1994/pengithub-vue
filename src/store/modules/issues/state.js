import {
    DEFAULT_REST_PAGINATIONAL_DATA_STATE
} from "../constant";

export default {
    home: {
        issue:{
            loadingCountOfIssueByState: false,
            ...DEFAULT_REST_PAGINATIONAL_DATA_STATE()
        },
        pr:{
            loadingCountOfIssueByState: false,
            ...DEFAULT_REST_PAGINATIONAL_DATA_STATE()
        }
    },
    repository: {
        issue:{
            loadingCountOfIssueByState: false,
            ...DEFAULT_REST_PAGINATIONAL_DATA_STATE()
        },
        pr:{
            loadingCountOfIssueByState: false,
            ...DEFAULT_REST_PAGINATIONAL_DATA_STATE()
        }
    }
}
