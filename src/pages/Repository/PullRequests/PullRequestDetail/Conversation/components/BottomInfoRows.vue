<template>
  <BottomInfoRows v-if="data" :data="data">
    <div class="info-bottom-item">
      <span
        v-if="viewerCanManageIssue()"
        @click="() => showModal('chooseReviewerModal')"
        class="float-right"
      >
        <svg
          class="octicon octicon-gear"
          viewBox="0 0 16 16"
          version="1.1"
          width="16"
          height="16"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M7.429 1.525a6.593 6.593 0 011.142 0c.036.003.108.036.137.146l.289 1.105c.147.56.55.967.997 1.189.174.086.341.183.501.29.417.278.97.423 1.53.27l1.102-.303c.11-.03.175.016.195.046.219.31.41.641.573.989.014.031.022.11-.059.19l-.815.806c-.411.406-.562.957-.53 1.456a4.588 4.588 0 010 .582c-.032.499.119 1.05.53 1.456l.815.806c.08.08.073.159.059.19a6.494 6.494 0 01-.573.99c-.02.029-.086.074-.195.045l-1.103-.303c-.559-.153-1.112-.008-1.529.27-.16.107-.327.204-.5.29-.449.222-.851.628-.998 1.189l-.289 1.105c-.029.11-.101.143-.137.146a6.613 6.613 0 01-1.142 0c-.036-.003-.108-.037-.137-.146l-.289-1.105c-.147-.56-.55-.967-.997-1.189a4.502 4.502 0 01-.501-.29c-.417-.278-.97-.423-1.53-.27l-1.102.303c-.11.03-.175-.016-.195-.046a6.492 6.492 0 01-.573-.989c-.014-.031-.022-.11.059-.19l.815-.806c.411-.406.562-.957.53-1.456a4.587 4.587 0 010-.582c.032-.499-.119-1.05-.53-1.456l-.815-.806c-.08-.08-.073-.159-.059-.19a6.44 6.44 0 01.573-.99c.02-.029.086-.075.195-.045l1.103.303c.559.153 1.112.008 1.529-.27.16-.107.327-.204.5-.29.449-.222.851-.628.998-1.189l.289-1.105c.029-.11.101-.143.137-.146zM8 0c-.236 0-.47.01-.701.03-.743.065-1.29.615-1.458 1.261l-.29 1.106c-.017.066-.078.158-.211.224a5.994 5.994 0 00-.668.386c-.123.082-.233.09-.3.071L3.27 2.776c-.644-.177-1.392.02-1.82.63a7.977 7.977 0 00-.704 1.217c-.315.675-.111 1.422.363 1.891l.815.806c.05.048.098.147.088.294a6.084 6.084 0 000 .772c.01.147-.038.246-.088.294l-.815.806c-.474.469-.678 1.216-.363 1.891.2.428.436.835.704 1.218.428.609 1.176.806 1.82.63l1.103-.303c.066-.019.176-.011.299.071.213.143.436.272.668.386.133.066.194.158.212.224l.289 1.106c.169.646.715 1.196 1.458 1.26a8.094 8.094 0 001.402 0c.743-.064 1.29-.614 1.458-1.26l.29-1.106c.017-.066.078-.158.211-.224a5.98 5.98 0 00.668-.386c.123-.082.233-.09.3-.071l1.102.302c.644.177 1.392-.02 1.82-.63.268-.382.505-.789.704-1.217.315-.675.111-1.422-.364-1.891l-.814-.806c-.05-.048-.098-.147-.088-.294a6.1 6.1 0 000-.772c-.01-.147.039-.246.088-.294l.814-.806c.475-.469.679-1.216.364-1.891a7.992 7.992 0 00-.704-1.218c-.428-.609-1.176-.806-1.82-.63l-1.103.303c-.066.019-.176.011-.299-.071a5.991 5.991 0 00-.668-.386c-.133-.066-.194-.158-.212-.224L10.16 1.29C9.99.645 9.444.095 8.701.031A8.094 8.094 0 008 0zm1.5 8a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM11 8a3 3 0 11-6 0 3 3 0 016 0z"
          ></path>
        </svg>
      </span>
      <div class="info-bottom-item-title">Reviewers</div>
      <!--    <div style="margin-bottom:10px" v-for="item in data.requested_reviewers.slice(0,21)" :key="item.id">
                <router-link to="/">
                    <ImgWrapper class="avatar avatar-user">
                        <img class="avatar avatar-user" :src="item.avatar_url" width="20" height="20" :alt="`@${item.login}`"> 
                    </ImgWrapper>
                    <span class="assignee-login">{{item.login}}</span>    
                </router-link> 
            </div> -->
      <div
        style="margin-bottom: 10px"
        v-for="item in relativeReviewers.slice(0, 21)"
        :key="item.id"
      >
        <router-link :to="`/${item.author.login}`">
          <ImgWrapper class="avatar avatar-user">
            <img
              class="avatar avatar-user"
              :src="item.author.avatarUrl"
              width="20"
              height="20"
              :alt="`@${item.login}`"
            />
          </ImgWrapper>
          <span class="assignee-login">{{ item.author.login }}</span>
        </router-link>
        <router-link
          class="float-right"
          :to="`/${owner}/${repo}/pulls/${number}/files/${item.commit.oid}`"
        >
          <svg
            v-if="item.state.toLowerCase() == 'commented'"
            class="octicon octicon-comment text-gray"
            viewBox="0 0 16 16"
            version="1.1"
            width="16"
            height="16"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M2.75 2.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h2a.75.75 0 01.75.75v2.19l2.72-2.72a.75.75 0 01.53-.22h4.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25H2.75zM1 2.75C1 1.784 1.784 1 2.75 1h10.5c.966 0 1.75.784 1.75 1.75v7.5A1.75 1.75 0 0113.25 12H9.06l-2.573 2.573A1.457 1.457 0 014 13.543V12H2.75A1.75 1.75 0 011 10.25v-7.5z"
            ></path>
          </svg>
          <svg
            v-if="item.state.toLowerCase() == 'changes_requested'"
            viewBox="0 0 16 16"
            version="1.1"
            width="16"
            height="16"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M2.75 1.5a.25.25 0 00-.25.25v12.5c0 .138.112.25.25.25h10.5a.25.25 0 00.25-.25V4.664a.25.25 0 00-.073-.177l-2.914-2.914a.25.25 0 00-.177-.073H2.75zM1 1.75C1 .784 1.784 0 2.75 0h7.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0113.25 16H2.75A1.75 1.75 0 011 14.25V1.75zm7 1.5a.75.75 0 01.75.75v1.5h1.5a.75.75 0 010 1.5h-1.5v1.5a.75.75 0 01-1.5 0V7h-1.5a.75.75 0 010-1.5h1.5V4A.75.75 0 018 3.25zm-3 8a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5h-4.5a.75.75 0 01-.75-.75z"
            ></path>
          </svg>
          <svg
            v-if="item.state.toLowerCase() == 'approved'"
            class="octicon octicon-check text-green"
            viewBox="0 0 16 16"
            version="1.1"
            width="16"
            height="16"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"
            ></path>
          </svg>
        </router-link>
      </div>
      <span v-if="!(relativeReviewers.length > 0)">No reviews</span>
      <span v-if="relativeReviewers.length > 21">and others</span>
    </div>
  </BottomInfoRows>
</template>
<script>
import styled from 'vue-styled-components'
import {ImgWrapper} from '@/components'
import {BottomInfoRows} from '../../../../Issues/IssueDetail/components'
import * as api from '@/network/api'
import * as graphql from './graphql'
import parse from 'parse-link-header'
import { authRequiredGet, authRequiredGitHubGraphqlApiQuery,cancelAndUpdateAxiosCancelTokenSource } from '@/network'
export default {
    inject: ['viewerCanManageIssue'],
    props: {
        data: {
            type: Object
        },
    },
    data() {
        return {
            reviews: [],
            suggestedReviewers: {
                data: [],
                loading: false
            },
            loading: false,
        }
    },
    computed: {
        number() {
            return this.$route.params.number
        },
        relativeReviewers() {
            let relativeReviewers = []
            this.reviews.forEach(i => {
                if(!relativeReviewers.some(i_ => i_.author.login == i.author.login)) {
                    relativeReviewers.push(i)
                }else{
                    relativeReviewers.filter(i__ => i__.author.login == i.author.login)[0].state = i.state
                }
            })
            if(this.data.requested_reviewers) relativeReviewers.forEach((i, index) => {
                if(this.data.requested_reviewers.some(i_ => i_.author.login == i.author.login)) {
                    relativeReviewers.splice(index,1)
                }
            })
            return relativeReviewers
        }
    },
    created() {
        this.network_getData()
    },
    methods: {
        async network_getData() {
            if(!this.accessToken) return 
            try {
                this.suggestedReviewers.loading = true
                let res = await authRequiredGitHubGraphqlApiQuery(
                    graphql.GRAPHQL_SUGGESTTED_REVIEWERS,
                    {
                        variables: {
                            id: this.data.node_id
                        },
                        cancelToken: cancelAndUpdateAxiosCancelTokenSource('pulls-suggested-reviewers').cancelToken
                    }
                )

                try {
                    this.suggestedReviewers.data = res.data.data.node.suggestedReviewers
                } catch (e) {
                    this.handleGraphqlError(res)
                }

            } catch (e) {
                this.handleError(e)
            } finally {
                this.suggestedReviewers.loading = false
            }
        },
        async network_getDataFromRest() {
            try {
                this.loading = true
                let reviews = []
                let pageInfo
                while(!pageInfo || pageInfo.next) {
                    let url 
                    if(!pageInfo) {
                        url = api.API_REVIEWS({
                            repo: this.repo,
                            owner: this.owner,
                            number: this.$route.params.number,
                            params: {
                                per_page: 100
                            }
                        })
                    } else {
                        url = pageInfo.next.url
                    }

                    let res = await authRequiredGet(url)
                    pageInfo = parse(res.headers.link) || {}
                    reviews = reviews.concat(res.data)
                }

                this.reviews = reviews
            } catch (e) {
                console.log(e)
            } finally {
                this.loading = false
            }
        },
        async network_getDataFromGraphql() {
            if(!this.data.node_id) return
            try {
                this.loading = true
                let pageInfo
                let reviews = []
                console.log(this.data.node_id)
                while(!pageInfo || pageInfo.hasNextPage) {
                    let res = await authRequiredGitHubGraphqlApiQuery(
                        graphql.GRAPHQL_PULL_REVIEWS,
                        {
                            variables: {
                                id: this.data.node_id,
                                after: pageInfo && pageInfo.endCursor
                            }
                        }
                    )
                    reviews = reviews.concat(res.data.data.node.reviews.nodes)
                    pageInfo = res.data.data.node.reviews.pageInfo || {}
                }

                this.reviews = reviews
            } catch (e) {
                console.log(e)
            } finally {
                this.loading = false
            }
        }
    },
    watch: {
        'data.node_id':function(newOne) {
            if(newOne) {
                this.network_getData()
            }
        }
    },
    components: {
        BottomInfoRows, 
        ImgWrapper,
    }
}
</script>
<style scoped lang="scss">
@import "node_modules/@primer/css/avatars/index.scss";
.info-bottom-item {
  padding-top: 16px;
  font-size: 12px;
  color: #586069;
  margin-top: 16px;
  border-top: 1px solid #e1e4e8;
  .info-bottom-item-title {
    margin-bottom: 8px;
    font-size: 12px;
    color: #586069;
    font-weight: 600 !important;
    svg {
      float: right;
      color: #959da5;
      margin-top: 2px;
    }
  }

  .assignee-login {
    max-width: 110px;
    display: inline-block;
    vertical-align: top;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 600;
    color: #24292e;
    font-size: 12px;
  }
}
</style>