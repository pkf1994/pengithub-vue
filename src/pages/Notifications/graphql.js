export const GRAPHQL_NOTIFICATION_SUBJECTS = payload => {
    let graphql = ''
    payload.forEach((item,index) => {
        if(item.subject.type == 'Issue') {
            graphql = `
                ${graphql}
                issue${index}:  resource(url: "${item.subject.url.replace('api.','').replace('/repos','')}") {
                    ... on Issue {
                        id
                        state
                        url
                    }
                }
            `
        }else if(item.subject.type == 'PullRequest') {
            graphql = `
                ${graphql}
                pullRequest${index}:  resource(url: "${item.subject.url.replace('api.','').replace('/repos','').replace('pulls','pull')}") {
                    ... on PullRequest {
                        id
                        state
                        merged
                        url
                    }
                }
            `
        }
    })
    return `
        {
            ${graphql}
        }
    `
}