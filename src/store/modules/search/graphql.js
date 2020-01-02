import {util_uniqueArray} from '../../../util'
import {LANGUAGE_LIST} from "../../../constant/fileType";



export const GRAPHQL_COUNT_OF_REPOSITORIES_GROUP_BY_LANGUAGE = (query,languageList = LANGUAGE_LIST) => {
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