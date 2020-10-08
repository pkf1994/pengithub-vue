<template> 
    <Container v-if="!deleted" :class="{deleting:loadingDeleteThis}">
        <div class="bubble m-0 bg-white">
            <HideAndShowPane v-if="extraData.isMinimized" class="p-3 d-flex flex-justify-between p-3 text-gray text-small border-bottom">
                <span class="text-italic">
                    This comment was marked as {{extraData.minimizedReason}}.
                </span>

                <button class="btn-link text-gray" @click="triggerShowMinimized">
                    <svg class="octicon octicon-fold" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7 9l3 3H8v3H6v-3H4l3-3zm3-6H8V0H6v3H4l3 3 3-3zm4 2c0-.55-.45-1-1-1h-2.5l-1 1h3l-2 2h-7l-2-2h3l-1-1H1c-.55 0-1 .45-1 1l2.5 2.5L0 10c0 .55.45 1 1 1h2.5l1-1h-3l2-2h7l2 2h-3l1 1H13c.55 0 1-.45 1-1l-2.5-2.5L14 5z"></path></svg>
                        {{showMinimized ? 'Hide' : 'Show'}}
                </button>
            </HideAndShowPane>
            <div v-show="showMinimized || !extraData.isMinimized">
                <Header class="header" :style="headerStyle">
                    <!-- <Action class="float-right mt-2 ml-2">
                        <svg class="octicon octicon-kebab-horizontal" viewBox="0 0 13 16" version="1.1" width="13" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M1.5 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm5 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM13 7.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"></path></svg>
                    </Action> -->

                    <button class="ml-2 mt-2 float-right" :disabled="loadingUpdatingComment" @click="() => showModal('popover')" v-if="extraData.viewerCanUpdate || extraData.viewerCanDelete">
                        <svg class="octicon octicon-kebab-horizontal" viewBox="0 0 13 16" version="1.1" width="13" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M1.5 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm5 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM13 7.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"></path></svg>
                    </button>
                    
                    <Avatar class="float-left relative">
                        <ImgWrapper>
                            <img class="avatar" height="32" width="32" :alt="`@${propsData.user && propsData.user.login}`" :src="propsData.user && propsData.user.avatar_url">
                        </ImgWrapper>
                    </Avatar>

                
                    
                    <Meta class="meta">
                        <router-link :to="`/${propsData.user && propsData.user.login}`">
                            {{propsData.user.login}}
                        </router-link><br v-if="!withEditHistory">
                        commented {{createdAt}}
                        <span v-if="withEditHistory"> • edited {{editedAt}}</span>    
                    </Meta>

                    

                    <Popover ref="popover" :popoverStyle="{top: '100%',right: '8px',paddingTop: '4px',paddingBottom: '4px',width:'120px'}">
                        <div v-if="extraData.viewerCanUpdate" class="dropdown-item" @click="triggerShowCommentEditor">
                            <svg class="octicon octicon-pencil mr-1" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M11.013 1.427a1.75 1.75 0 012.474 0l1.086 1.086a1.75 1.75 0 010 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 01-.927-.928l.929-3.25a1.75 1.75 0 01.445-.758l8.61-8.61zm1.414 1.06a.25.25 0 00-.354 0L10.811 3.75l1.439 1.44 1.263-1.263a.25.25 0 000-.354l-1.086-1.086zM11.189 6.25L9.75 4.81l-6.286 6.287a.25.25 0 00-.064.108l-.558 1.953 1.953-.558a.249.249 0 00.108-.064l6.286-6.286z"></path></svg>
                            Edit
                        </div>
                        <div v-if="extraData.viewerCanUpdate" class="division border-top my-1"></div> 
                        <div v-if="extraData.viewerCanDelete" class="dropdown-item danger" @click="network_tryToDeleteThis">
                            <svg class="octicon octicon-x mr-1" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"></path></svg>
                            <span class="text-red">
                                Delete
                            </span>    
                        </div>
                    </Popover>

                </Header>

                <Body v-if="!showCommentEditor" class="px-3 pt-3 pb-2">
                    <BodyHTML v-html="bodyHTML" class="markdown-body f5 p-0">

                    </BodyHTML>

                    <Reactions   v-if="!extraData.isMinimized" 
                                :data="reactions.data" 
                                :commentId="propsData.id"
                                :disabled="!extraData.viewerCanReact"></Reactions>
                </Body>

                <PullRequestCommentEditor v-else :comment="{...propsData,body}" @update-comment-success="updateCommentPostHandler" @cancel="() => triggerShowCommentEditor(false)" class="p-3"></PullRequestCommentEditor>

            </div>
        </div>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {util_dateFormat,util_markdownParse} from '@/util'
    import {LoadingIconEx,Popover,ImgWrapper} from '@/components'
    import ClipboardJS from 'clipboard';
    import {Reactions} from '../../components'
    import PullRequestCommentEditor from './PullRequestCommentEditor'
    import {authRequiredGet,authRequiredDelete} from '@/network'
    import * as api from '@/network/api'
    export default {
        inject: ['timelineExtraDataProvided','timelineItemDeletedHook'],
        data() {
            return {
                deleted: false,
                showMinimized: false,
                reactions: {
                    data: {},
                    loading: false
                },
                showCommentEditor: false,
                loadingUpdatingComment: false,
                loadingDeleteThis: false,
                body: ''
            }
        },
        props: {
            propsData: {
                type: Object,
                default: () => ({})
            },
            headerStyle: {
                type: Object,
                required: false
            }
        },
        created() {
            this.body = this.propsData.body
            this.network_getReactions()
        },
        computed: {
             repo() {
                return this.$route.params.repo
            },
            owner() {
                return this.$route.params.owner
            },
            extraData() {
                let extraData = this.timelineExtraDataProvided().filter(item => {
                    return item.id === this.propsData.node_id
                })[0] || {}
                if(extraData.bodyHTML) {
                    let pattern = /href="https:\/\/github\.com\/(\S+)"/g
                    let execResult
                    while((execResult = pattern.exec(extraData.bodyHTML)) !== null) {
                        extraData.bodyHTML = extraData.bodyHTML.replace(execResult[0],`href="/${execResult[1]}"`)
                    }
                }
                return extraData
            },
            createdAt() {
                return util_dateFormat.getDateDiff(this.propsData.created_at)
            },
            editedAt() {
                if(!this.extraData.userContentEdits.nodes) return
                return util_dateFormat.getDateDiff(this.extraData.userContentEdits.nodes[0].editedAt)
            },
            withEditHistory() {
                return this.extraData.userContentEdits && this.extraData.userContentEdits.totalCount > 0
            },
            location() {
                return location
            },
            bodyHTML() {
                return util_markdownParse.markdownToHTML(this.body)
            }
        },
        methods: {
            triggerShowMinimized() {
                this.showMinimized = !this.showMinimized
            },
            async network_getReactions() {
                try{
                    this.reactions.loading = true
                    let url = this.propsData.url
                    if(url) {
                        let res = await authRequiredGet(
                            url,
                            {
                                headers: {
                                    "accept": "application/vnd.github.squirrel-girl-preview+json"
                                }
                            }
                        )
                        this.reactions.data = res.data.reactions
                    }

                }catch(e) {
                    console.log(e)
                }finally{
                    this.reactions.loading = false
                }
            },
             async network_tryToDeleteThis() {
                this.closeModal()
                if(!confirm("Are you sure you want to delete this comment?")) return
                try {
                    this.loadingDeleteThis = true
                    let url = api.API_ISSUE_COMMENT({
                        repo: this.repo,
                        owner: this.owner,
                        commentId: this.propsData.id
                    })
                    await authRequiredDelete(
                        url,
                        {
                            headers: {
                                "accept":"application/vnd.github.v3+json"
                            }
                        }
                    )

                    await this.timelineItemDeletedHook()()

                    this.deleted = true
                } catch (e) {
                    this.handleError(e)
                } finally {
                    this.loadingDeleteThis = false
                }
            },
            triggerShowCommentEditor(flag = true) {
                this.closeModal()
                this.showCommentEditor = flag
            },
            updateCommentPostHandler(payload) {
                this.showCommentEditor = false
                this.body = payload.body
            }
        },
        watch: {
            'propsData.body':function(newOne,oldOne) {
                this.body = newOne
            }
        },
        components: {
            LoadingIconEx,
            Popover,
            Reactions,
            ImgWrapper,
            PullRequestCommentEditor,
            Container: styled.div``,
            Inner: styled.div``,
            Header: styled.div``,
            Avatar: styled.div``,
            Meta: styled.div``,
            LoadingWrapper: styled.div``,
            HeaderInner: styled.div``,
            Main: styled.div``,
            Body: styled.div``,
            BodyHTML: styled.div``,
            Action: styled.div``,
            AuthorAssociation: styled.span``,
            StretchCommentBtn: styled.div``,
            HideAndShowPane: styled.div``
        }
    }
</script>

<style lang="scss">
.user-mention {
    font-weight: 600;
    color: #24292e;
}
</style>

<style scoped lang="scss">
@import 'node_modules/@primer/css/dropdown/index.scss';
.header{
    position: relative;
    padding: 10px 15px;
    font-size: 12px;
    line-height: 16px;
    color: #586069;
    background-color: #fff;
    border-bottom: 1px solid #e1e4e8;
    .meta{
        margin-left: 42px;
        a{
            font-weight: 600;
            color: #444d56;
        }
    }
}

.reaction-item{
    font-size: 12px!important;
    padding-top: 4px!important;
    padding-bottom: 4px!important;
    padding-right: 8px!important;
    padding-left: 8px!important;
    display: block;
    margin-top: 4px!important;
    margin-bottom: 4px!important;
    margin-right: 8px!important;
    border-radius: 3px!important;
    border: 1px solid #e1e4e8!important;
}


    .loading-wrapper{
        height: 120px;
    }

.deleting{
    opacity: .4;
}

.dropdown-item{
    font-size: 14px;
}
</style>