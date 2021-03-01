<template>
    <Container class="bg-white">
        <Tab class="mx-0 mt-0 no-wrap d-flex flex-auto p-2">
            <TabItem class="btn-link tabnav-tab px-3 flex-1"  @click="() => switchTab('Write')" :class="{'tab-selected':selectedTab === 'Write'}">Write</TabItem>
            <TabItem class="btn-link tabnav-tab px-3 flex-1" @click="() => switchTab('Preview')" :class="{'tab-selected':selectedTab === 'Preview'}">Preview</TabItem>
        </Tab>
        <div class="px-3 pt-2 pb-0">
            <div v-if="selectedTab === 'Write'">
                 <markdown-toolbar for="review-submitter-textarea" class="bg-white d-flex no-wrap flex-items-start flex-wrap px-2">

                    <MDGroup class="d-flex flex-wrap mr-0 mb-2 text-gray">
                        <md-header class="toolbar-item tooltipped p-2 mr-1">
                            <svg class="octicon octicon-heading" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M3.75 2a.75.75 0 01.75.75V7h7V2.75a.75.75 0 011.5 0v10.5a.75.75 0 01-1.5 0V8.5h-7v4.75a.75.75 0 01-1.5 0V2.75A.75.75 0 013.75 2z"></path></svg>
                        </md-header>
                        <md-bold class="toolbar-item tooltipped p-2 mr-1">
                            <svg class="octicon octicon-bold" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 2a1 1 0 00-1 1v10a1 1 0 001 1h5.5a3.5 3.5 0 001.852-6.47A3.5 3.5 0 008.5 2H4zm4.5 5a1.5 1.5 0 100-3H5v3h3.5zM5 9v3h4.5a1.5 1.5 0 000-3H5z"></path></svg>
                        </md-bold>
                        <md-italic class="toolbar-item tooltipped p-2 mr-1">
                            <svg class="octicon octicon-italic" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M6 2.75A.75.75 0 016.75 2h6.5a.75.75 0 010 1.5h-2.505l-3.858 9H9.25a.75.75 0 010 1.5h-6.5a.75.75 0 010-1.5h2.505l3.858-9H6.75A.75.75 0 016 2.75z"></path></svg>
                        </md-italic>

                        <md-quote class="toolbar-item tooltipped p-2 mx-1">
                            <svg class="octicon octicon-quote" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M1.75 2.5a.75.75 0 000 1.5h10.5a.75.75 0 000-1.5H1.75zm4 5a.75.75 0 000 1.5h8.5a.75.75 0 000-1.5h-8.5zm0 5a.75.75 0 000 1.5h8.5a.75.75 0 000-1.5h-8.5zM2.5 7.75a.75.75 0 00-1.5 0v6a.75.75 0 001.5 0v-6z"></path></svg>
                        </md-quote>
                        <md-code class="toolbar-item tooltipped p-2 mx-1">
                            <svg class="octicon octicon-code" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4.72 3.22a.75.75 0 011.06 1.06L2.06 8l3.72 3.72a.75.75 0 11-1.06 1.06L.47 8.53a.75.75 0 010-1.06l4.25-4.25zm6.56 0a.75.75 0 10-1.06 1.06L13.94 8l-3.72 3.72a.75.75 0 101.06 1.06l4.25-4.25a.75.75 0 000-1.06l-4.25-4.25z"></path></svg>
                        </md-code>
                        <md-link class="toolbar-item tooltipped p-2 mx-1">
                            <svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z"></path></svg>
                        </md-link>

                        <md-unordered-list class="toolbar-item tooltipped p-2 mr-1">
                            <svg class="octicon octicon-list-unordered" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M2 4a1 1 0 100-2 1 1 0 000 2zm3.75-1.5a.75.75 0 000 1.5h8.5a.75.75 0 000-1.5h-8.5zm0 5a.75.75 0 000 1.5h8.5a.75.75 0 000-1.5h-8.5zm0 5a.75.75 0 000 1.5h8.5a.75.75 0 000-1.5h-8.5zM3 8a1 1 0 11-2 0 1 1 0 012 0zm-1 6a1 1 0 100-2 1 1 0 000 2z"></path></svg>
                        </md-unordered-list>

                        <md-ordered-list class="toolbar-item tooltipped p-2 mr-1">
                            <svg class="octicon octicon-list-ordered" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M2.003 2.5a.5.5 0 00-.723-.447l-1.003.5a.5.5 0 00.446.895l.28-.14V6H.5a.5.5 0 000 1h2.006a.5.5 0 100-1h-.503V2.5zM5 3.25a.75.75 0 01.75-.75h8.5a.75.75 0 010 1.5h-8.5A.75.75 0 015 3.25zm0 5a.75.75 0 01.75-.75h8.5a.75.75 0 010 1.5h-8.5A.75.75 0 015 8.25zm0 5a.75.75 0 01.75-.75h8.5a.75.75 0 010 1.5h-8.5a.75.75 0 01-.75-.75zM.924 10.32l.003-.004a.851.851 0 01.144-.153A.66.66 0 011.5 10c.195 0 .306.068.374.146a.57.57 0 01.128.376c0 .453-.269.682-.8 1.078l-.035.025C.692 11.98 0 12.495 0 13.5a.5.5 0 00.5.5h2.003a.5.5 0 000-1H1.146c.132-.197.351-.372.654-.597l.047-.035c.47-.35 1.156-.858 1.156-1.845 0-.365-.118-.744-.377-1.038-.268-.303-.658-.484-1.126-.484-.48 0-.84.202-1.068.392a1.858 1.858 0 00-.348.384l-.007.011-.002.004-.001.002-.001.001a.5.5 0 00.851.525zM.5 10.055l-.427-.26.427.26z"></path></svg>
                        </md-ordered-list>

                        <md-task-list class="toolbar-item tooltipped p-2 mr-1">
                            <svg class="octicon octicon-tasklist" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M2.5 2.75a.25.25 0 01.25-.25h10.5a.25.25 0 01.25.25v10.5a.25.25 0 01-.25.25H2.75a.25.25 0 01-.25-.25V2.75zM2.75 1A1.75 1.75 0 001 2.75v10.5c0 .966.784 1.75 1.75 1.75h10.5A1.75 1.75 0 0015 13.25V2.75A1.75 1.75 0 0013.25 1H2.75zm9.03 5.28a.75.75 0 00-1.06-1.06L6.75 9.19 5.28 7.72a.75.75 0 00-1.06 1.06l2 2a.75.75 0 001.06 0l4.5-4.5z"></path></svg>
                        </md-task-list>

                        <md-mention class="toolbar-item tooltipped p-2 mx-1">
                            <svg class="octicon octicon-mention" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4.75 2.37a6.5 6.5 0 006.5 11.26.75.75 0 01.75 1.298 8 8 0 113.994-7.273.754.754 0 01.006.095v1.5a2.75 2.75 0 01-5.072 1.475A4 4 0 1112 8v1.25a1.25 1.25 0 002.5 0V7.867a6.5 6.5 0 00-9.75-5.496V2.37zM10.5 8a2.5 2.5 0 10-5 0 2.5 2.5 0 005 0z"></path></svg>
                        </md-mention>
                        <md-image class="toolbar-item tooltipped p-2 mx-1">
                            <svg class="octicon octicon-image" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M1.75 2.5a.25.25 0 00-.25.25v10.5c0 .138.112.25.25.25h.94a.76.76 0 01.03-.03l6.077-6.078a1.75 1.75 0 012.412-.06L14.5 10.31V2.75a.25.25 0 00-.25-.25H1.75zm12.5 11H4.81l5.048-5.047a.25.25 0 01.344-.009l4.298 3.889v.917a.25.25 0 01-.25.25zm1.75-.25V2.75A1.75 1.75 0 0014.25 1H1.75A1.75 1.75 0 000 2.75v10.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0016 13.25zM5.5 6a.5.5 0 11-1 0 .5.5 0 011 0zM7 6a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                        </md-image>
                        <md-ref class="toolbar-item tooltipped p-2 mx-1">
                            <svg class="octicon octicon-cross-reference" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M16 1.25v4.146a.25.25 0 01-.427.177L14.03 4.03l-3.75 3.75a.75.75 0 11-1.06-1.06l3.75-3.75-1.543-1.543A.25.25 0 0111.604 1h4.146a.25.25 0 01.25.25zM2.75 3.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h2a.75.75 0 01.75.75v2.19l2.72-2.72a.75.75 0 01.53-.22h4.5a.25.25 0 00.25-.25v-2.5a.75.75 0 111.5 0v2.5A1.75 1.75 0 0113.25 13H9.06l-2.573 2.573A1.457 1.457 0 014 14.543V13H2.75A1.75 1.75 0 011 11.25v-7.5C1 2.784 1.784 2 2.75 2h5.5a.75.75 0 010 1.5h-5.5z"></path></svg>
                        </md-ref>

                        <Reply class="toolbar-item tooltipped py-2 px-1 ml-1">
                            <svg class="octicon octicon-reply" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M6.78 1.97a.75.75 0 010 1.06L3.81 6h6.44A4.75 4.75 0 0115 10.75v2.5a.75.75 0 01-1.5 0v-2.5a3.25 3.25 0 00-3.25-3.25H3.81l2.97 2.97a.75.75 0 11-1.06 1.06L1.47 7.28a.75.75 0 010-1.06l4.25-4.25a.75.75 0 011.06 0z"></path></svg>
                        </Reply>
                    </MDGroup>
                </markdown-toolbar>

                <textarea id="review-submitter-textarea" :disabled="loading" ref="textarea" v-model="markdownRaw" class="form-control input-contrast" placeholder="Leave a comment" rows="5" style="width: 100%"></textarea>
            </div>

            <Preview  v-else class="preview-body markdown-body" v-html="commentPreviewHTML">

            </Preview>

            <EventSelectPane class="bubble mt-3" v-if="!viewerIsPullRequestOwner">
                <label for="review-comment" class="list-item">
                    <input v-model="event" type="radio" id="review-comment" class="merge-option-radio" value="COMMENT">
                    Comment
                    <small class="byline">Submit general feedback without explicit approval.</small>
                </label>
                <label for="review-approve" class="list-item">
                    <input v-model="event" type="radio" id="review-approve" class="merge-option-radio" value="APPROVE">
                    Approve
                    <small class="byline">
                        Submit feedback and approve merging these changes.
                    </small>
                </label>
                <label for="review-reject" class="list-item">
                    <input v-model="event" type="radio" id="review-reject" class="merge-option-radio" value="REQUEST_CHANGES">
                    Request changes
                    <small class="byline">
                        Submit feedback that must be addressed before merging.
                    </small>
                </label>
            </EventSelectPane>
        </div>
        
        <div class="border-top px-3 py-2" >
            <button class="btn btn-primary btn-block" @click.stop="network_submitReview" :disabled="loading || pendingReview().loading || ( !markdownRaw && !pendingReview().data.databaseId ) ">
                {{loading ? 'Trying...' : 'Submit review'}}
            </button>
        </div>
       
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {authRequiredPost} from '@/network'
    import * as api from '@/network/api'
    import {mapMutations} from 'vuex'
    import {MUTATION_PULL_REQUEST_DETAIL_PUSH_NEW_SUBMITTED_REVIEW} from '@/store/modules/pullRequestDetail/mutationTypes'
    import marked from 'marked'
    const createDOMPurify = require('dompurify');
    export default {
        inject: ['pendingReview','pullRequestProvided'],
        data() {
            return {
                event: 'COMMENT',
                loading: false,
                selectedTab: 'Write',
                stretch: false,
                markdownRaw: ''
            }
        },
        computed: {
            repo() {
                return this.$route.params.repo
            },
            owner() {
                return this.$route.params.owner
            },
            number() {
                return this.$route.params.number
            },
            viewerIsPullRequestOwner() {
                return this.viewer.login == (this.pullRequestProvided().data
                && this.pullRequestProvided().data.user && this.pullRequestProvided().data.user.login)
            },
            commentPreviewHTML() {
                const DOMPurify = createDOMPurify(window);
                return DOMPurify.sanitize((marked(this.markdownRaw,{breaks:true})))
            },
        },
        methods: {
            ...mapMutations({
                mutation_pushNewSubmittedReview: MUTATION_PULL_REQUEST_DETAIL_PUSH_NEW_SUBMITTED_REVIEW
            }),
            async network_submitReview() {
                try {
                    this.loading = true

                    let url 
                    if(this.pendingReview().data.databaseId) {
                        url = api.API_SUBMIT_REVIEW({
                            repo: this.repo,
                            owner: this.owner,
                            number: this.number,
                            reviewId: this.pendingReview().data.databaseId
                        })
                    }else {
                        url = api.API_CREATE_REVIEW({
                            repo: this.repo,
                            owner: this.owner,
                            number: this.number,
                        })
                    }
               
                    let res = await authRequiredPost(
                        url,
                        {
                            body: this.markdownRaw,
                            event: this.viewerIsPullRequestOwner ? 'COMMENT' : this.event
                        },
                        {
                            headers: {
                                "accept": "application/vnd.github.squirrel-girl-preview"
                            }
                        }
                    )

                    this.mutation_pushNewSubmittedReview({
                        ...res.data,
                        event: "reviewed"
                    })

                    //this.reviewSubmittedHook()(res.data)

                    this.$router.push(`/${this.owner}/${this.repo}/pull/${this.number}?new_created_timeline_item=${res.data.id}`)
                    
                } catch (e) {
                    this.handleError(e)
                } finally {
                    this.loading = false
                }
            },
            switchTab(payload) {
                this.selectedTab = payload
            },
            triggerStretch() {
                this.stretch = !this.stretch
            }, 
        },
        components: {
            Container: styled.div``,
            EventSelectPane: styled.div``,
            Tab: styled.div``,
            TabItem: styled.button``,
            MDGroup: styled.div``,
            Reply: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/forms/index.scss';
@import 'node_modules/@primer/css/navigation/index.scss';
.tabnav-tab{
    display: inline-block;
    padding: 8px 12px;
    font-size: 14px;
    line-height: 20px;
    text-decoration: none;
    background-color: #fafbfc;
    border: 1px solid #e1e4e8;
    border-left: 0;
    border-radius: 0;
}
.tabnav-tab:first-child{
    border-left: 1px solid #e1e4e8;
} 
.tab-selected{
    border-bottom: 0;
    background-color: #fff;
}
.bubble {
    padding: 0;
    margin: 0 15px 15px;
    margin-right: 0;
    margin-left: 0;
    color: #24292e;
    overflow: hidden;
    word-break: break-word;
    word-wrap: break-word;
    white-space: normal;
    background: #fff;
    border: 1px solid #d1d5da;
    border-radius: 6px;
}

.list-item{
    position: relative;
    display: block;
    width: 100%;
    padding: 14px 15px 14px 35px;
    padding-top: 10px;
    padding-bottom: 10px;
    overflow-wrap: break-word;
    line-height: inherit;
    text-align: left;
    .byline {
        display: block;
        margin: 0;
        font-size: 12px;
        color: #586069;
        font-weight: 400;
    }
}

.merge-option-radio {
    position: absolute;
    top: 12px;
    left: 12px;
    margin-right: 3px;
}

.preview-body {
    background-color: initial;
    width: 100%;
    overflow: visible;
    font-size: 14px;
    min-height: 150px;
    padding: 4px 4px 16px;
    border-bottom: 1px solid #e1e4e8;
}
</style>