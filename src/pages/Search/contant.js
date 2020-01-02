

export const SEARCH_PAGE_MODAL_CONTENT = `
    <p>GitHub’s search supports a variety of different operations. Here’s a quick cheat sheet for some of the common searches.</p>
    <p>For more information, visit our <a href="https://help.github.com/articles/about-searching-on-github/">search help section</a>.</p>

    <h2>Basic search</h2>
    <table>
      <thead>
        <tr>
          <th>This search</th>
          <th>Finds repositories with…</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>cat stars:&gt;100</td>
          <td>Find cat repositories with greater than 100 stars.</td>
        </tr>
        <tr>
          <td>user:defunkt</td>
          <td>Get all repositories from the user defunkt.</td>
        </tr>
        <tr>
          <td>tom location:"San Francisco, CA"</td>
          <td>Find all tom users in "San Francisco, CA".</td>
        </tr>
        <tr>
          <td>join extension:coffee</td>
          <td>Find all instances of join in code with coffee extension.</td>
        </tr>
        <tr>
          <td>NOT cat</td>
          <td>Excludes all results containing cat.</td>
        </tr>
      </tbody>
    </table>

    <hr>

    <h2>Repository search
      <a href="https://help.github.com/articles/searching-repositories"><svg aria-label="Help" class="octicon octicon-link-external" viewBox="0 0 12 16" version="1.1" width="12" height="16" role="img"><path fill-rule="evenodd" d="M11 10h1v3c0 .55-.45 1-1 1H1c-.55 0-1-.45-1-1V3c0-.55.45-1 1-1h3v1H1v10h10v-3zM6 2l2.25 2.25L5 7.5 6.5 9l3.25-3.25L12 8V2H6z"></path></svg></a>
    </h2>
    <p>Repository search looks through the projects you have access to on GitHub. You can also filter the results:</p>
    <table>
      <thead>
        <tr>
          <th>This search</th>
          <th>Finds repositories with…</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>cat stars:&gt;100</td>
          <td>Find cat repositories with greater than 100 stars.</td>
        </tr>
        <tr>
          <td>user:defunkt</td>
          <td>Get all repositories from the user defunkt.</td>
        </tr>
        <tr>
          <td>pugs pushed:&gt;2013-01-28</td>
          <td>Pugs repositories pushed to since Jan 28, 2013.</td>
        </tr>
        <tr>
          <td>node.js forks:&lt;200</td>
          <td>Find all node.js repositories with less than 200 forks.</td>
        </tr>
        <tr>
          <td>jquery size:1024..4089</td>
          <td>Find jquery repositories between the sizes 1024 and 4089 kB.</td>
        </tr>
        <tr>
          <td>gitx fork:true</td>
          <td>Repository search includes forks of gitx.</td>
        </tr>
        <tr>
          <td>gitx fork:only</td>
          <td>Repository search returns only forks of gitx.</td>
        </tr>
      </tbody>
    </table>

    <hr>

    <h2>Code search
      <a href="https://help.github.com/articles/searching-code"><svg aria-label="Help" class="octicon octicon-link-external" viewBox="0 0 12 16" version="1.1" width="12" height="16" role="img"><path fill-rule="evenodd" d="M11 10h1v3c0 .55-.45 1-1 1H1c-.55 0-1-.45-1-1V3c0-.55.45-1 1-1h3v1H1v10h10v-3zM6 2l2.25 2.25L5 7.5 6.5 9l3.25-3.25L12 8V2H6z"></path></svg></a>
    </h2>
    <p>Code search looks through the files hosted on GitHub. You can also filter the results:</p>
    <table>
      <thead>
        <tr>
          <th>This search</th>
          <th>Finds repositories with…</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>install repo:charles/privaterepo</td>
          <td>Find all instances of install in code from the repository charles/privaterepo.</td>
        </tr>
        <tr>
          <td>shogun user:heroku</td>
          <td>Find references to shogun from all public heroku repositories.</td>
        </tr>
        <tr>
          <td>join extension:coffee</td>
          <td>Find all instances of join in code with coffee extension.</td>
        </tr>
        <tr>
          <td>system size:&gt;1000</td>
          <td>Find all instances of system in code of file size greater than 1000kbs.</td>
        </tr>
        <tr>
          <td>examples path:/docs/</td>
          <td>Find all examples in the path /docs/.</td>
        </tr>
        <tr>
          <td>replace fork:true</td>
          <td>Search replace in the source code of forks.</td>
        </tr>
      </tbody>
    </table>

    <hr>

    <h2>Issue search
      <a href="https://help.github.com/articles/searching-issues"><svg aria-label="Help" class="octicon octicon-link-external" viewBox="0 0 12 16" version="1.1" width="12" height="16" role="img"><path fill-rule="evenodd" d="M11 10h1v3c0 .55-.45 1-1 1H1c-.55 0-1-.45-1-1V3c0-.55.45-1 1-1h3v1H1v10h10v-3zM6 2l2.25 2.25L5 7.5 6.5 9l3.25-3.25L12 8V2H6z"></path></svg></a>
    </h2>
    <p>Issue search looks through issues and pull requests on GitHub. You can also filter the results:</p>
    <table>
      <thead>
        <tr>
          <th>This search</th>
          <th>Finds issues…</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>encoding user:heroku</td>
          <td>Encoding issues across the Heroku organization.</td>
        </tr>
        <tr>
          <td>cat is:open</td>
          <td>Find cat issues that are open.</td>
        </tr>
        <tr>
          <td>strange comments:&gt;42</td>
          <td>Issues with more than 42 comments.</td>
        </tr>
        <tr>
          <td>hard label:bug</td>
          <td>Hard issues labeled as a bug.</td>
        </tr>
        <tr>
          <td>author:mojombo</td>
          <td>All issues authored by mojombo.</td>
        </tr>
        <tr>
          <td>mentions:tpope</td>
          <td>All issues mentioning tpope.</td>
        </tr>
        <tr>
          <td>assignee:rtomayko</td>
          <td>All issues assigned to rtomayko.</td>
        </tr>
        <tr>
          <td>exception created:&gt;2012-12-31</td>
          <td>Created since the beginning of 2013.</td>
        </tr>
        <tr>
          <td>exception updated:&lt;2013-01-01</td>
          <td>Last updated before 2013.</td>
        </tr>
      </tbody>
    </table>

    <hr>

    <h2>User search
      <a href="https://help.github.com/articles/searching-users"><svg aria-label="Help" class="octicon octicon-link-external" viewBox="0 0 12 16" version="1.1" width="12" height="16" role="img"><path fill-rule="evenodd" d="M11 10h1v3c0 .55-.45 1-1 1H1c-.55 0-1-.45-1-1V3c0-.55.45-1 1-1h3v1H1v10h10v-3zM6 2l2.25 2.25L5 7.5 6.5 9l3.25-3.25L12 8V2H6z"></path></svg></a>
    </h2>
    <p>User search finds users with an account on GitHub. You can also filter the results:</p>
    <table>
      <thead>
        <tr>
          <th>This search</th>
          <th>Finds repositories with…</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>fullname:"Linus Torvalds"</td>
          <td>Find users with the full name "Linus Torvalds".</td>
        </tr>
        <tr>
          <td>tom location:"San Francisco, CA"</td>
          <td>Find all tom users in "San Francisco, CA".</td>
        </tr>
        <tr>
          <td>chris followers:100..200</td>
          <td>Find all chris users with followers between 100 and 200.</td>
        </tr>
        <tr>
          <td>ryan repos:&gt;10</td>
          <td>Find all ryan users with more than 10 repositories.</td>
        </tr>
      </tbody>
    </table>
`