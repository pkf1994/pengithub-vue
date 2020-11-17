<template>
    <Other :data="data" :badgeStyle="{color:'#fff',backgroundColor:'#d73a49'}">
        <template v-slot:icon>
            <svg class="octicon octicon-circle-slash" :class="{'loading-animation':loading}" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm0 1.3c1.3 0 2.5.44 3.47 1.17l-8 8A5.755 5.755 0 011.3 8c0-3.14 2.56-5.7 5.7-5.7zm0 11.41c-1.3 0-2.5-.44-3.47-1.17l8-8c.73.97 1.17 2.17 1.17 3.47 0 3.14-2.56 5.7-5.7 5.7z"></path></svg>
        </template>
        <template v-slot:action>
            closed this
            <router-link to="/" v-if="data.commit_id">in {{`${owner()}/${repo()}@${commit.sha && commit.sha.substring(0,7)}`}}</router-link>
            <span class="no-wrap">on {{data.created_at | dateFormat('dd zzz yyyy')}}</span>
        </template>
    </Other>
</template>

<script>
    import styled from 'vue-styled-components'
    import Other from './Other'
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
                commit: {},
            }
        },
        computed: {
            owner() {
                return this.$route.params.owner
            },
            repo() {
                return this.$route.params.repo
            },
        },
        created() {
            this.getRelevantCommit()
        },
        methods: {
            async getRelevantCommit() {
                if(!this.data.commit_url || this.data.commit_url === null ) return
                this.loading = true
                let res = await authRequiredGet(
                    this.data.commit_url
                )
                this.commit = res.data
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