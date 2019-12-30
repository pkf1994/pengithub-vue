import {util_uniqueArray} from '../../../util'
export const LANGUAGE_LIST_MORE = [
    "ActionScript",
    "C",
    "C#",
    "C++",
    "Clojure",
    "CoffeeScript",
    "CSS",
    "Go",
    "Haskell",
    "HTML",
    "Java",
    "JavaScript",
    "Lua",
    "MATLAB",
    "Objective-C",
    "Perl",
    "PHP",
    "Python",
    "R",
    "Ruby",
    "Scala",
    "Shell",
    "Swift",
    "TeX",
    "Vim script",
    "Assembly",
    "COBOL",
    "Cool",
    "Crystal",
    "Visual Basic",
    "ABAP",
    "Erlang",
    "Brainfuck",
    "Groovy",
    "Pascal",
    "Kotlin",
    "D",
    "Forth",
    "Elixir",
    "Dart",
    "Rust",
    "AutoIt",
    "Batchfile",
    "OCaml",
    "TypeScript",
    "Fortran",
    "PostScript",
    "PowerShell",
    "QMake",
    "Standard ML",
    "Julia",
    "NewLisp",
    "Tcl",
    "Perl 6",
    "Nim",
    "Jupyter Notebook",
    "Vue"
]

export const LANGUAGE_LIST = [
    "ActionScript",
    "C",
    "C#",
    "C++",
    "Clojure",
    "CoffeeScript",
    "CSS",
    "Go",
    "Haskell",
    "HTML",
    "Java",
    "JavaScript",
    "Lua",
    "MATLAB",
    "Objective-C",
    "Perl",
    "PHP",
    "Python",
    "R",
    "Ruby",
    "Scala",
    "Shell",
    "Swift",
    "TeX",
    "Vim script",
    "Vue"
]


export const GRAPHQL_COUNT_OF_REPOSITORIES_GROUP_BY_LANGUAGE = (query,languageList = util_uniqueArray(LANGUAGE_LIST)) => {
    let ql = ""
    languageList.forEach((item,index) => {
        ql = `
            ${ql}
            language${index}: search(type: REPOSITORY, query: "${query} in:name,description language:${item}",first:1) {
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
               languages(first: 1) {
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
