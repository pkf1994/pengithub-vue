import {DEFAULT_GRAPHQL_PAGINATIONAL_DATA_STATE,
    DEFAULT_REST_PAGINATIONAL_DATA_STATE} from "../constant";

export default {
    basic: {
        data: {},
        loading: false
    },
    code: {
        loading: false,
        data: {},
        readme: {
            data: undefined,
            loading: false
        },
        codeFile: {
            loading: false,
            data: [],
            path: '',
            countOfCommits: {
                data: 0,
                loading: false
            },
            fileDetail: {
                data: '',
                html: '',
                raw: '',
                loading: false,
                lastCommit: {
                    data: {},
                    loading: false
                },
                contributors: {
                    data: [],
                    loading: false
                }
            }
        }
    },
    projects: {
        loadingMore: false,
        searchQuery: '',
        totalCountOpen: 0,
        totalCountClosed: 0,
        ...DEFAULT_GRAPHQL_PAGINATIONAL_DATA_STATE()
    },
    issue: {
        issueDetail: {
            data: {},
            loading: false,
            loadingAdditionalData: false,
            body: {
                data: '',
                loading: false
            },
            timeline: {
                commentBodyHTMLAndReactions: {
                    data: [],
                    loading: false
                },
                lastData: [],
                pageInfo: {},
                ...DEFAULT_REST_PAGINATIONAL_DATA_STATE()
            },
            projects: {
                data: [],
                loading: false
            }
        },
        associatedUsers: {
            author: {
                data: [],
                loading: false
            },
            assignee: {
                data: [],
                loading: false
            }
        }
    },
    pr: {
        associatedUsers: {
            author: {
                data: [],
                loading: false
            },
            assignee: {
                data: [],
                loading: false
            }
        }
    },
    pulse: {
        codeChanges: {
            data: [],
            loading: false,
            commitCount: {
                data: 0,
                loading: false
            },
        },
        pullsMerged: {
            issueCount: 0,
            loadingMore: false,
            ...DEFAULT_GRAPHQL_PAGINATIONAL_DATA_STATE()
        },
        pullsProposed: {
            loadingMore: false,
            ...DEFAULT_REST_PAGINATIONAL_DATA_STATE()
        },
        issuesClosed: {
            issueCount: 0,
            loadingMore: false,
            ...DEFAULT_GRAPHQL_PAGINATIONAL_DATA_STATE()
        },
        issuesOpened: {
            loadingMore: false,
            ...DEFAULT_REST_PAGINATIONAL_DATA_STATE()
        }
    },
    community: {
        data: {},
        loading: false
    },
    label: {
        data: [],
        loading: false
    }
}