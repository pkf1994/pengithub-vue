import {util_uniqueArray} from '../../../util'
import {LANGUAGE_LIST} from "../../../constant/fileType";



export const GRAPHQL_COUNT_OF_REPOSITORY_GROUP_BY_LANGUAGE = (query, languageList = LANGUAGE_LIST) => {
    let ql = ""
    languageList.forEach((item,index) => {
        ql = `
            ${ql}
            language${index}: search(type: REPOSITORY, query: "${query} in:name,description language:${item.language}",first:1) {
                repositoryCount
                 nodes {
                  ... on Repository {
                    languages(first: 1) {
                      nodes {
                        name
                      }
                    }
                  }
                }
            }
        `
    })
    return `{${ql}}`
}

export const GRAPHQL_COUNT_OF_USER_GROUP_BY_LANGUAGE = (query, languageList = LANGUAGE_LIST) => {
  let ql = ""
  languageList.forEach((item,index) => {
      ql = `
          ${ql}
          language${index}: search(type: USER, query: "${query} language:${item.language}",first:1) {
              userCount
          }
      `
  })
  return `{${ql}}`
}

export const GRAPHQL_COUNT_OF_ISSUE_GROUP_BY_LANGUAGE = (query,languageList = LANGUAGE_LIST) => {
    let ql = ""
    languageList.forEach((item,index) => {
        ql = `
            ${ql}
            language${index}: search(type: ISSUE, query: "${query} language:${item.language}",first:1) {
               issueCount
            }
        `
    })
    return `{${ql}}`
}

export const GRAPHQL_TOPICS_AND_LANGUAGE_COLOR_AND_HELP_WANTED_ISSUES_COUNT_OF_REPOSITORIES = repositories => {
    let ql = ""
    repositories.forEach((item,index) => {
        ql = `
            ${ql}
            repository${index}: repository(name:"${item.name}", owner: "${item.owner.login}") {
               nameWithOwner
               languages(first: 3) {
                  nodes {
                    name
                    color
                         }
                    }
                     issues(labels: ["help wanted"], states: OPEN) {
                        totalCount
                    }
                  repositoryTopics(first: 10) {
                  nodes {
                    topic {
                      name
                    }
                   
                  }
                }
              }
        `
    })
    return `{${ql}}`
}

export const GRAPHQL_RELATIVE_TOPICS_OF_TOPICS = topics => {
    let ql = ""
    topics.forEach((item,index) => {
        ql = `
            ${ql}
            topic${index}: topic(name:"${item.name}") {
                name
                viewerHasStarred
                relatedTopics(first: 4) {
                  name
                }
              }
        `
    })
    return `{${ql}}`
}

export const GRAPHQL_COUNT_OF_REPOSITORY_BY_TOPICS = topics => {
    let ql = ""
    topics.forEach((item,index) => {
        let query = item.name
        let regExp = new RegExp("\\.",'g')
        ql = `
            ${ql}
            topic${index}:search(query: "topic:${query.replace(regExp,"")}", type: REPOSITORY) {
                repositoryCount
              }
        `
    })
    return `{${ql}}`
}

export const GRAPHQL_AVATAR_OF_TOPICS = topics => {
  let ql = ""
  topics.forEach((item,index) => {
      let query = item.name
      let regExp = new RegExp("\\.",'g')
      ql = `
          ${ql}
          topic${index}:search(query: "topic:${query.replace(regExp,"")}", type: REPOSITORY) {
              repositoryCount
            }
      `
  })
  return `{${ql}}`
}

export const GRAPHQL_COUNT_GROUP_BY_SEARCH_TYPE = (query) => {
    let searchTypeList = [
        'REPOSITORY',
        'USER',
        'ISSUE'
    ]
    let ql = ''
    searchTypeList.forEach(item => {
        ql = `
            ${ql}
            ${item}:search(type: ${item}, query: "${query}") {
                ${item.toLowerCase()}Count
              }
        `
    })
    return `{${ql}}`
}

export const GRAPHQL_NAME_BIO_LOCATION_EMAIL_FOLLOWSHIP_OF_USERS = users => {
  let ql = ""
  users.forEach((item,index) => {
      if(item.type === "User") {
        ql = `
            ${ql}
            user${index}:user(login: "${item.login}") {
              email
              login
              bio
              name
              viewerIsFollowing
              viewerCanFollow
              location
            }
        `
      }
  })
  return `{${ql}}`

}