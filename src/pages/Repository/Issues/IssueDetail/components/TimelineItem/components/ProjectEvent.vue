<template>
        <!-- added_to_project  -->
    <Other v-if="data.event === 'added_to_project'" :data="data">
        <template v-slot:icon>
            <svg class="octicon" viewBox="0 0 15 16" version="1.1" width="15" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M10 12h3V2h-3v10zm-4-2h3V2H6v8zm-4 4h3V2H2v12zm-1 1h13V1H1v14zM14 0H1a1 1 0 00-1 1v14a1 1 0 001 1h13a1 1 0 001-1V1a1 1 0 00-1-1z"></path></svg>
        </template>
        <template v-slot:action>
            added this to <strong>{{data.project_card.column_name}}</strong> 
            <span v-if="project.name">in <strong>{{project.name}}</strong></span>
            
        </template>
    </Other>
    <!-- removed_from_project  -->
    <Other v-else-if="data.event === 'removed_from_project'" :data="data">
        <template v-slot:icon>
            <svg class="octicon" viewBox="0 0 15 16" version="1.1" width="15" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M10 12h3V2h-3v10zm-4-2h3V2H6v8zm-4 4h3V2H2v12zm-1 1h13V1H1v14zM14 0H1a1 1 0 00-1 1v14a1 1 0 001 1h13a1 1 0 001-1V1a1 1 0 00-1-1z"></path></svg>
        </template>
        <template v-slot:action>
            removed this from <strong>{{data.project_card.column_name}}</strong>
            <span v-if="project.name">in <strong>{{project.name}}</strong></span>
        </template>
    </Other>
     <!-- moved_columns_in_project  -->
    <Other v-else-if="data.event === 'moved_columns_in_project'" :data="data">
        <template v-slot:icon>
            <svg class="octicon" :class="{'loading-animation':loading}" viewBox="0 0 15 16" version="1.1" width="15" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M10 12h3V2h-3v10zm-4-2h3V2H6v8zm-4 4h3V2H2v12zm-1 1h13V1H1v14zM14 0H1a1 1 0 00-1 1v14a1 1 0 001 1h13a1 1 0 001-1V1a1 1 0 00-1-1z"></path></svg>
        </template>
        <template v-slot:action>
            moved this from <strong>{{data.project_card.previous_column_name}}</strong> to <strong>{{data.project_card.column_name}}</strong> in {{project.name}}
        </template>
    </Other>
</template>

<script>
    import styled from 'vue-styled-components'
    import {util_markdownParse} from '@/util'
    import Other from './Other'
    import { authRequiredGet } from '@/network'
    import IssueStateBadge from '../../IssueStateBadge.vue'
    export default {
        props: {
            data: {
                type: Object,
                required: true,
            }
        },
        data() {
            return {
                loading: false,
                project: {},
            }
        },
        created() {
            this.getRelevantProject()
        },
        methods: {
             async getRelevantProject() {
                if(!this.data.project_card || !this.data.project_card.project_url ) return
                this.loading = true
                let res = await authRequiredGet(
                    this.data.project_card.project_url,
                    {
                        headers: {
                            "Accept": "application/vnd.github.inertia-preview+json"
                        }
                    }
                )
                this.project = res.data
                this.loading = false
            },
        },
        components: {
            Other,
        }
    }
</script>

<style scoped lang='scss'>
</style>