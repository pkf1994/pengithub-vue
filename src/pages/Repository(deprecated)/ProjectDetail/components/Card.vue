<template>
    <Container class="mb-2 ws-normal bg-white box-shadow rounded-2 border">
        <div class="position-relative pl-5 p-2">
            <svg v-if="card.state == 'NOTE_ONLY' && card.note" class="octicon octicon-note text-gray-light position-absolute card-icon" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M3 10h4V9H3v1zm0-2h6V7H3v1zm0-2h8V5H3v1zm10 6H1V3h12v9zM1 2c-.55 0-1 .45-1 1v9c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1H1z"></path></svg>
            <IssueIcon v-else-if="card.state == 'CONTENT_ONLY' && card.content" :issue="card.content" class="position-absolute card-icon"></IssueIcon>
            <svg v-if="verified == 'SUCCESS'" class="octicon octicon-check position-absolute pull-verified-status text-green" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5L12 5z"></path></svg>
            <svg v-else-if="verified == 'FAILURE'" class="octicon octicon-x position-absolute pull-verified-status text-red" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48L7.48 8z"></path></svg>


            <Action class="mr-3 mt-2 right-0 top-0 position-absolute text-gray-light btn-octicon">
                <svg class="octicon octicon-kebab-horizontal" viewBox="0 0 13 16" version="1.1" width="13" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M1.5 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm5 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM13 7.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"></path></svg>
            </Action>

            <Main class="mr-5">
                <Note v-if="card.state == 'NOTE_ONLY' && card.note" v-html="noteHTML">
                </Note>

                <Content v-else-if="card.state == 'CONTENT_ONLY' &&  card.content">
                    <router-link :to="card.content.resourcePath" class="h5 d-block lh-condensed mb-1 mr-5">{{card.content.title}}</router-link>
                    <TaskProgress class="task-progress" v-if="issueTaskProgress">
                            <svg class="octicon octicon-checklist" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M16 8.5l-6 6-3-3L8.5 10l1.5 1.5L14.5 7 16 8.5zM5.7 12.2l.8.8H2c-.55 0-1-.45-1-1V3c0-.55.45-1 1-1h7c.55 0 1 .45 1 1v6.5l-.8-.8c-.39-.39-1.03-.39-1.42 0L5.7 10.8a.996.996 0 000 1.41v-.01zM4 4h5V3H4v1zm0 2h5V5H4v1zm0 2h3V7H4v1zM3 9H2v1h1V9zm0-2H2v1h1V7zm0-2H2v1h1V5zm0-2H2v1h1V3z"></path></svg>
                            <span class="task-progress-counts">{{issueTaskProgress.checked}} of {{issueTaskProgress.all}}</span>
                            <ProgressBar class="progress-bar v-align-middle">
                                <span class="progress" :style="{width: parseInt(issueTaskProgress.checked * 100 / issueTaskProgress.all) + '%'}"></span>
                            </ProgressBar>
                    </TaskProgress>
                    <small class="text-gray d-block">
                        <span class="js-issue-number">#{{card.content.number}}</span>
                        opened by {{card.content.author.login}}
                    </small>

                    <span v-if="card.content.labels.nodes.length > 0" class="labels d-block pb-1">
                        <Label v-for="item in card.content.labels.nodes" :key="item.name" :name="item.name" :color="`#${item.color}`" class="mr-1"></Label>
                    </span> 
                </Content>
    
                <small class="text-gray-light" v-if="card.state == 'NOTE_ONLY'">
                    Added by
                    <router-link class="text-gray-dark" :to="`/${card.creator.login}`">{{card.creator.login}}</router-link>
                </small>
            </Main>
        </div>
       

        <Footer>
            <ReviewDecision v-if="reviewDecision" class="review-decision border-top position-relative pl-5 p-2 text-gray-light text-small">
                <svg class="octicon octicon-eye card-octicon position-absolute" height="15" style="top: 9px" viewBox="0 0 16 16" version="1.1" width="15" aria-hidden="true"><path fill-rule="evenodd" d="M8.06 2C3 2 0 8 0 8s3 6 8.06 6C13 14 16 8 16 8s-3-6-7.94-6zM8 12c-2.2 0-4-1.78-4-4 0-2.2 1.8-4 4-4 2.22 0 4 1.8 4 4 0 2.22-1.78 4-4 4zm2-4c0 1.11-.89 2-2 2-1.11 0-2-.89-2-2 0-1.11.89-2 2-2 1.11 0 2 .89 2 2z"></path></svg>
                <span>{{reviewDecision}}</span>
            </ReviewDecision>
        </Footer>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {util_markdownParse} from '@/util'
    import {IssueIcon,Label,ProgressBar} from '@/components'
    export default {
        props: {
            card: {
                type: Object,
                required: true
            }
        },
        computed: {
            noteHTML() {
                if(!this.card.note) return
                return util_markdownParse.markdownToHTML(this.card.note)
            },
            issueTaskProgress() {
                if(!this.card.content) return
                let bodyHTML = this.card.content.bodyHTML
                if(!bodyHTML) return
                let reg_allCheckboxInput = /<input type="checkbox" [\s\S]*?>/g
                let reg_checkedCheckboxInput = /<input type="checkbox" [\s\S]*?checked[\s\S]*?>/g
                let checkboxMatches = bodyHTML.match(reg_allCheckboxInput)
                let checkedCheckboxMatches =bodyHTML.match(reg_checkedCheckboxInput)
                if((!checkedCheckboxMatches) && (!checkboxMatches)) return undefined
                return {
                    checked: checkedCheckboxMatches ? checkedCheckboxMatches.length : 0,
                    all: checkboxMatches ? checkboxMatches.length : 0,
                }
            },
            verified() {
                if(!this.card.content) return
                if(!this.card.content.commits) return
                if(!this.card.content.commits.nodes) return
                if(!this.card.content.commits.nodes[0]) return
                if(!this.card.content.commits.nodes[0].commit) return
                if(!this.card.content.commits.nodes[0].commit.status) return
                return this.card.content.commits.nodes[0].commit.status.state
            },
            reviewDecision() {
                if(!this.card.content) return 
                switch(this.card.content.reviewDecision){
                    case 'CHANGES_REQUESTED':
                        return 'Changes requested'
                    case 'APPROVED':
                        return 'Changes approved'
                    case 'REVIEW_REQUIRED':
                        return 'review required'
                        break
                    default: 
                     return 
                }
            }
        },
        components: {
            IssueIcon,
            Label,
            Container: styled.div``,
            Action: styled.div``,
            Main: styled.div``,
            Note: styled.p``,
            Content: styled.div``,
            TaskProgress: styled.div``,
            ProgressBar: styled.span``,
            Footer: styled.div``,
            ReviewDecision: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/labels/index.scss';
.card-icon{
    top: 12px;
    left: 10px;
}

.pull-verified-status{
    top: 32px;
    left: 10px;
}

.task-progress{
    color: #586069;
    text-decoration: none;
    vertical-align: top;
    .task-progress-counts{
        display: inline-block;
        margin-right: 6px;
        margin-left: -2px;
        font-size: 12px;
    }
    svg{
        color: #ccc;
        vertical-align: bottom;
        margin-right: 5px;
    }
}

.progress-bar {
    display: inline-block;
    overflow: hidden;
    border-radius: 3px;
    width: 80px;
    height: 5px;
    vertical-align: 2px;
    background-color: #eee;
    .progress {
        display: block;
        height: 100%;
        background-color: #ccc;
    }
}

.review-decision{
    svg{
        top: 9px;
        left: 10px;
    }
   
}
</style>