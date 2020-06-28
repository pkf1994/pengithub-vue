<template>
    <Container class="d-flex mb-2 border rounded-1 p-2">
        <IconColumn class="d-flex flex-items-start mt-1 mr-2">
             <svg class="octicon octicon-project text-gray p-0" width="16" viewBox="0 0 15 16" version="1.1" height="17" aria-hidden="true"><path fill-rule="evenodd" d="M10 12h3V2h-3v10zm-4-2h3V2H6v8zm-4 4h3V2H2v12zm-1 1h13V1H1v14zM14 0H1a1 1 0 00-1 1v14a1 1 0 001 1h13a1 1 0 001-1V1a1 1 0 00-1-1z"></path></svg>
             
        </IconColumn>
        
        <Main class="d-flex flex-column flex-auto min-width-0">
            <router-link to="/" class="f6 text-bold link-gray-dark no-underline">
            {{data.project.name}}
            </router-link>

            <Progress v-if="totalTaskCount > 0" class="mt-1" style="margin-bottom:2px" :donePercent="donePercent" :inProgressPercent="inProgressPercent"></Progress>

        <AwaitingTriage class="mt-1" v-if="data.column !== null">
            <span class="dropdown-menu f6 text-gray d-inline-block" style="max-width: 152px;">
                {{data.column.name}}
            </span>
            </AwaitingTriage>

            <AwaitingTriage class="mt-1" v-else>
            <span class="dropdown-menu f6 text-gray d-inline-block text-italic" style="max-width: 152px;">
                Awaiting triage
            </span>
            </AwaitingTriage>
        </Main>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {Progress} from '@/components'
    export default {
        props: {
            data: {
                type: Object,
                required: true
            }
        },
        computed: {
            totalTaskCount() {
                let totalTask = 0
                this.data.project.columns.nodes.forEach(item => {
                    if(item.name.toLowerCase() === "to do" || item.name.toLowerCase() === "in progress" || item.name.toLowerCase() === "done") {
                        totalTask += item.cards.totalCount
                    }
                })
                return totalTask
            },
            donePercent() {
                let doneTask = 0
                this.data.project.columns.nodes.forEach(item => {
                    if(item.name.toLowerCase() === "done") {
                        doneTask = item.cards.totalCount
                    }
                })
                return parseInt((doneTask/this.totalTaskCount) * 100)
            },
            inProgressPercent() {
                let inProgressTask = 0
                this.data.project.columns.nodes.forEach(item => {
                    if(item.name.toLowerCase() === "in progress") {
                        inProgressTask = item.cards.totalCount
                    }
                })
                return parseInt((inProgressTask/this.totalTaskCount) * 100)
            }
        },
        components: {
            Progress,
            Container: styled.div``,
            IconColumn: styled.div``,
            Main: styled.div``,
            AwaitingTriage: styled.div``,
            Column: styled.div``,
        }
    }
</script>

<style scoped>

</style>