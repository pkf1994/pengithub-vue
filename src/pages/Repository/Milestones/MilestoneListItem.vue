<template>
    <Container class="p-3 container"> 
        <h2 class="mb-1 title">{{milestone.title}}</h2>
        <TheMeta>
            <span class="mr-2" v-if="milestone.state == 'closed'">
                <strong>{{milestone.state | capitalize}}</strong>
                on
                {{milestone.closed_at | dateFormat('d zzz yyyy')}}
            </span>
            <span  v-else-if="milestone.due_on">
                <strong>Due</strong>
                on
                {{milestone.due_on | dateFormat('d zzz yyyy')}}
            </span>
            <span v-else>
                No due date
            </span>

            <span class="no-wrap">
                <svg class="octicon octicon-clock" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 8h3v2H7c-.55 0-1-.45-1-1V4h2v4zM7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 011.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7z"></path></svg>
                Last updated {{milestone.updated_at | getDateDiff}}
            </span>
        </TheMeta>
        <ProgressWrapper class="pt-2 pb-1">
            <Progress :donePercent="donePercent"></Progress>
        </ProgressWrapper>
        <TheMeta>
            <span class="mr-2">
                <strong>{{donePercent}}%</strong>
                complete
            </span>
            <span class="mr-2">
                <strong>{{milestone.open_issues}}</strong>
                open
            </span>
            <span class="mr-2">
                <strong>{{milestone.closed_issues}}</strong>
                closed
            </span>
        </TheMeta>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {Progress} from '@/components'
    export default {
        props: {
            milestone: {
                type: Object,
                required: true
            }
        },
        computed: {
            donePercent() {
                let openIssuesCount = this.milestone.open_issues || 0
                let closedIssuesCount = this.milestone.closed_issues || 0
                let total = openIssuesCount + closedIssuesCount
                if(total == 0) return
                return parseInt(closedIssuesCount * 100 / total)
            }
        },
        components: {
            Progress,
            Container: styled.div``,
            Title: styled.div``,
            ProgressWrapper: styled.div``,
            TheMeta: styled.div``
        }
    }
</script>

<style scoped>
.title{
    font-weight: 400;
    line-height: 1.2;
    font-size: 20px;
}
.container{
    color: #6a737d;
}
</style>