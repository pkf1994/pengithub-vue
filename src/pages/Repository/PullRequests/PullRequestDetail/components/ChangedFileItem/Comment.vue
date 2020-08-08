<template> 
    <Container v-if="!deleted" class="p-3" :class="{deleting: loadingDeleteThis}">
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
                <Header class="header " :style="headerStyle">
                    <Action v-if="extraData.viewerCanUpdate || extraData.viewerCanDelete" class="float-right mt-2 ml-2" @click="() => showModal('popover')">
                        <svg class="octicon octicon-kebab-horizontal" viewBox="0 0 13 16" version="1.1" width="13" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M1.5 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm5 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM13 7.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"></path></svg>
                    </Action>
                    
                    <Avatar class="float-left relative">
                        <ImgWrapper>
                            <img class="avatar" height="32" width="32" :alt="`@${propsData.user.login}`" :src="propsData.user.avatar_url">
                        </ImgWrapper>
                    </Avatar>
                    
                    <Meta class="meta">
                        <router-link :to="`/${propsData.user.login}`">
                            {{propsData.user.login}}
                        </router-link><br>
                        commented 
                        {{propsData.created_at | getDateDiff}}
                    </Meta>

                    <Popover ref="popover" :popoverStyle="{top: 'calc(100% - 4px)',right: '4px',paddingTop: '4px',paddingBottom: '4px',width:'120px'}">
                        <div v-if="extraData.viewerCanUpdate" class="dropdown-item">
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

                <Body class="pb-2 p-3" >
                    <BodyHTML v-html="bodyHTML"  class="markdown-body f5 p-0">

                    </BodyHTML>

                    <Reaction   :data="propsData.reactions" 
                                :commentId="propsData.id"
                                commentType="reviewComment"
                                :disabled="!extraData.viewerCanReact"></Reaction>
                </Body>

                <LoadingWrapper v-if="!propsData.id" class="loading-wrapper flex flex-justify-center flex-items-center">
                    <LoadingIconEx/>
                </LoadingWrapper>
                
            </div>
        </div>
       
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {util_dateFormat,util_markdownParse} from '@/util'
    import {LoadingIconEx,Popover,ImgWrapper} from '@/components'
    import ClipboardJS from 'clipboard';
    import Reaction from '../Reaction'
    import ReviewCommentEditor from '../ReviewCommentEditor'
    export default {
        inject: ['reviewCommentsExtraData'],
        data() {
            return {
                showMinimized: false,
                loadingDeleteThis: false,
                deleted: false
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
        computed: {
            repo() {
                return this.$route.params.repo
            },
            owner() {
                return this.$route.params.owner
            },
            extraData() {
                return this.reviewCommentsExtraData().filter(i => i.id == this.propsData.node_id)[0] || {}
            },
            bodyHTML() {
                return util_markdownParse.markdownToHTML(this.propsData.body)
            }
        },
        methods: {
            async network_tryToDeleteThis() {
                this.closeModal()
                if(!confirm("Are you sure you want to delete this comment?")) return
                try {
                    this.loadingDeleteThis = true
                    let url = api.API_REVIEW_COMMENT_OF_PULL_REQUEST({
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

                    this.deleted = true
                } catch (e) {
                    this.handleError(e)
                } finally {
                    this.loadingDeleteThis = false
                }
            },
            triggerShowMinimized() {
                this.showMinimized = !this.showMinimized
            }
        },
        components: {
            LoadingIconEx,
            Popover,
            ImgWrapper,
            Reaction,
            ReviewCommentEditor,
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

.deleting{
    opacity: .4s;
    pointer-events: none;
}
</style>