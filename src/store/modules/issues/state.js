import {
    DEFAULT_REST_PAGINATIONAL_DATA_STATE
} from "../constant";

export default {
    home: {
        issue:{
            loadingCountOfIssueByState: false,
            ...DEFAULT_REST_PAGINATIONAL_DATA_STATE()
        },
        pullRequest:{
            loadingCountOfIssueByState: false,
            ...DEFAULT_REST_PAGINATIONAL_DATA_STATE()
        }
    }
}
