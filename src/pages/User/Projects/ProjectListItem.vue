<template>
    <Container  class="pr-6 p-3 border-gray-light border-bottom" >
            <ProjectTitle class="mb-1">
                <router-link to="/" class="link-gray-dark mr-1">{{project.name}}</router-link>
            </ProjectTitle>
            <ProjectUpdateAt class="f6 b-2 mb-2 md-0 text-gray-light">
                <svg class=" v-align-text-bottom d-inline-block" fill="currentColor" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 8h3v2H7c-.55 0-1-.45-1-1V4h2v4zM7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 011.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7z"></path></svg>
                Updated on {{updatedAt}}
            </ProjectUpdateAt>
            <ProjectProgress v-if="showProgressBar" class="mt-1 pr-5 mb-2 mb-md-0">
                <ProjectProgressInner class="d-block position-relative overflow-hidden round-1 progress-bar" style="height: 10px">
                    <span class="bg-green height-full d-inline-block v-align-top" :style="{width:donePercent + '%'}"></span><span class="bg-purple height-full d-inline-block v-align-top" :style="{width:inProgressPercent + '%'}"></span>
                </ProjectProgressInner>    
            </ProjectProgress>
            <ProjectDescription class="text-gray-light markdown-body">
                {{description}}
            </ProjectDescription>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {AnimatedHeightWrapper,AnimatedWidthWrapper,LoadingAndCatchErrorTemplate,ComplexBubble} from '@/components'
    import { util_dateFormat } from '@/util'
    export default {
        props: {
            project: {
                type: Object,
                required: true
            }
        },
        computed: {
            updatedAt() {
                return util_dateFormat.dateFormat("dd zzz, yyyy",new Date(this.project.updatedAt))
            },
            description() {
                if(!this.project.body || this.project.body === "") return 'No description'
                return this.project.body
            },
            showProgressBar() {
                if(this.project.columns.nodes.length < 3) return false
                if(!this.project.columns.nodes.some(item => {
                    return item.name.toLowerCase() === "to do" || item.name.toLowerCase() === "idea"
                }))return false
                if(!this.project.columns.nodes.some(item => {
                    return item.name.toLowerCase() === "in progress" || item.name.toLowerCase() === "started"
                }))return false
                if(!this.project.columns.nodes.some(item => {
                    return item.name.toLowerCase() === "done" 
                }))return false

                return true
            },
            totalTaskCount() {
                let totalTask = 0
                this.project.columns.nodes.forEach(item => {
                    if(item.name.toLowerCase() === "to do" || item.name.toLowerCase() === "in progress" || item.name.toLowerCase() === "done") {
                        totalTask += item.cards.totalCount
                    }
                })
                return totalTask
            },
            donePercent() {
                let doneTask = 0
                this.project.columns.nodes.forEach(item => {
                    if(item.name.toLowerCase() === "done") {
                        doneTask = item.cards.totalCount
                    }
                })
                return parseInt((doneTask/this.totalTaskCount) * 100)
            },
            inProgressPercent() {
                let inProgressTask = 0
                this.project.columns.nodes.forEach(item => {
                    if(item.name.toLowerCase() === "in progress") {
                        inProgressTask = item.cards.totalCount
                    }
                })
                return parseInt((inProgressTask/this.totalTaskCount) * 100)
            }
        },
        components: {
            Container: styled.div``,
            ProjectTitle: styled.h4``,
            ProjectUpdateAt: styled.div``,
            ProjectProgress: styled.div``,
            ProjectProgressInner: styled.span``,
            ProjectDescription: styled.div``
        }
    }
</script>

<style scoped lang="scss">
.progress-bar {
    display: block;
    overflow: hidden;
    background-color: #eaecef;
    border-radius: 3px;
}
</style>