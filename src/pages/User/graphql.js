export const GRAPHQL_USER_INFO = payload => `
{
    user(login: "${payload}") {
      id
      login
      name
      avatarUrl
      company
      location
      viewerCanFollow
      viewerIsFollowing
      bioHTML
      email
      websiteUrl
      status {
        emojiHTML
        message
        indicatesLimitedAvailability
      }
      sponsorshipsAsMaintainer(first: 13) {
        totalCount
        nodes {
          sponsor {
            login
            avatarUrl
          }
        }
      }
      sponsorshipsAsSponsor(first: 13) {
        totalCount
        nodes {
          maintainer {
            login
            avatarUrl
          }
        }
      }
    }
  }
  
`

export const GRAPHQL_USER_OVERVIEW = payload => `
{
  user(login: "${payload}") {
    id
    pinnedRepositories(first: 6) {
      nodes {
        name
        id
        owner {
          login
        }
        stargazers {
          totalCount
        }
        primaryLanguage {
          color
          name
        }
        forks {
          totalCount
        }
        description
      }
    }
  }
}
`

export const GRAPHQL_USER_CONTRIBUTION_STATISTIC = payload => `
{
  user(login: "${payload.login}") {
    id
    organizations(first: 3) {
      totalCount
      nodes {
        avatarUrl
        name
        login
      }
    }
    contributionsCollection${payload.organizationID ? '(organizationID: "' + payload.organizationID + '")' : ''} {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            color
            date
            weekday
          }
        }
      }
      issueContributions {
        totalCount
      }
      pullRequestContributions {
        totalCount
      }
      commitContributions:commitContributionsByRepository {
        contributions {
          totalCount
        }
      }
      pullRequestReviewContributions {
        totalCount
      }
      commitContributionsByRepository(maxRepositories: 10) {
        contributions {
          totalCount
        }
        repository {
          name
          nameWithOwner
        }
      }
      issueContributionsByRepository(maxRepositories: 10) {
        contributions {
          totalCount
        }
        repository {
          name
          nameWithOwner
        }
      }
      pullRequestContributionsByRepository(maxRepositories: 10) {
        contributions {
          totalCount
        }
        repository {
          name
          nameWithOwner
        }
      }
      pullRequestReviewContributionsByRepository(maxRepositories: 10) {
        contributions {
          totalCount
        }
        repository {
          name
          nameWithOwner
        }
      }
    }
  }
}
`

export const GRAPHQL_USER_PERIOD_CONTRIBUTION_STATISTIC = payload => {
  
  let arrStr = `(to:"${payload.to}",from:"${payload.from}"${payload.organizationID ? ',organizationID:"' + payload.organizationID + '"' : ''})`

  return`
{
  user(login: "${payload.login}") {
    contributionsCollection${arrStr} {
      issueContributions {
        totalCount
      }
      pullRequestContributions {
        totalCount
      }
      commitContributions:commitContributionsByRepository {
        contributions {
          totalCount
        }
      }
      pullRequestReviewContributions {
        totalCount
      }
      commitContributionsByRepository(maxRepositories: 10) {
        contributions {
          totalCount
        }
        repository {
          name
          nameWithOwner
        }
      }
      issueContributionsByRepository(maxRepositories: 10) {
        contributions {
          totalCount
        }
        repository {
          name
          nameWithOwner
        }
      }
      pullRequestContributionsByRepository(maxRepositories: 10) {
        contributions(first: 20) {
          totalCount
          nodes {
            pullRequest {
              id
              state
              merged
              title
              resourcePath
            }
            occurredAt
          }
        }
        repository {
          name
          nameWithOwner
        }
      }
      pullRequestReviewContributionsByRepository(maxRepositories: 10) {
        contributions(first:20) {
          totalCount
          nodes {
            occurredAt
            pullRequestReview {
              state
            }
            pullRequest {
              title
              resourcePath
            }
          }
        }
        repository {
          name
          nameWithOwner
        }
      }
      repositoryContributions(first: 10) {
        totalCount
        nodes {
          isRestricted
          repository {
            nameWithOwner
            isFork
            primaryLanguage {
              color
              name
            }
            createdAt
          }
        }
      }
      popularPullRequestContribution {
        pullRequest {
          additions
          deletions
          bodyText
          state
          merged
          title
          resourcePath
          comments {
            totalCount
          }
          repository {
            nameWithOwner
          }
        }
        occurredAt
      }
    }
  }
}
`
}
export const GRAPHQL_ORG = payload => `{
  organization(login: "${payload}") {
    id
  }
}`

export const GRAPHQL_ALL_ORGS = payload => `{
  user(login: "${payload}") {
    organizations(first: 30) {
      nodes {
        avatarUrl
        login
      }
    }
  }
}`
