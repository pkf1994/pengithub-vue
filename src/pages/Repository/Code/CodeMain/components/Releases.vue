<template>
    <ComplexBubble  v-if="data.id && repoBasicInfo().node_id"
                    :delay="1500">
        <template v-slot:title>
            <Title class="bubble-title" style="font-weight: 700">
                <svg class="v-align-text-bottom d-inline-block bubble-title-icon bubble-title-icon" fill="currentColor" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.73 1.73C7.26 1.26 6.62 1 5.96 1H3.5C2.13 1 1 2.13 1 3.5v2.47c0 .66.27 1.3.73 1.77l6.06 6.06c.39.39 1.02.39 1.41 0l4.59-4.59a.996.996 0 000-1.41L7.73 1.73zM2.38 7.09c-.31-.3-.47-.7-.47-1.13V3.5c0-.88.72-1.59 1.59-1.59h2.47c.42 0 .83.16 1.13.47l6.14 6.13-4.73 4.73-6.13-6.15zM3.01 3h2v2H3V3h.01z"></path></svg>  
                Releases
            </Title>   
        </template>

        <Content class="bubble-content">
            <svg class="v-align-text-bottom d-inline-block text-green mr-1" fill="currentColor" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.73 1.73C7.26 1.26 6.62 1 5.96 1H3.5C2.13 1 1 2.13 1 3.5v2.47c0 .66.27 1.3.73 1.77l6.06 6.06c.39.39 1.02.39 1.41 0l4.59-4.59a.996.996 0 000-1.41L7.73 1.73zM2.38 7.09c-.31-.3-.47-.7-.47-1.13V3.5c0-.88.72-1.59 1.59-1.59h2.47c.42 0 .83.16 1.13.47l6.14 6.13-4.73 4.73-6.13-6.15zM3.01 3h2v2H3V3h.01z"></path></svg>
            <router-link :to="`/${owner()}/${repo()}/releases/tag/${data.tag_name}`">
                {{data.tag_name}}
           </router-link>
           published {{data.published_at | getDateDiff}}
        </Content>

        <template v-slot:footer v-if="releasesCount > 1">
            <router-link :to="`/${owner()}/${repo()}/releases`" class="d-block footer text-center">
                View all of {{releasesCount}} releases 
            </router-link>
        </template>
    </ComplexBubble>
</template>

<script>
    import styled from 'vue-styled-components'
    import {ComplexBubble} from '@/components'
    import * as api from '@/network/api'
    import {authRequiredGet,cancelAndUpdateAxiosCancelTokenSource} from '@/network'
    import {util_dateFormat} from '@/util'
    let parse = require('parse-link-header')
    export default {
        name: 'repository_code_main_releases',
        inject: ['owner','repo','repoBasicInfo'],
        data() {
            return {
                data: {},
                releasesCount: 0,
                loading: true
            }
        },
        computed: {
            updateFlag() {
                return `${this.owner()}/${this.repo()}`
            }
        },
        created() {
            this.network_getData()
        },
        methods: {
            async network_getData() {
                try{
                    this.loading = true
                    let sourceAndCancelToken = cancelAndUpdateAxiosCancelTokenSource(this.$options.name)
                    let url = api.API_REPOSITORY_RELEASES(this.owner(),this.repo(),{per_page:1})
                    let res = await authRequiredGet(url,{cancelToken:sourceAndCancelToken.cancelToken})
                    this.data = res.data[0]
                    let releasesCountHolder = parse(res.headers.link) || {}
                    this.releasesCount = releasesCountHolder.last ? releasesCountHolder.last.page : res.data.length 
                }catch(e) {
                    console.log(e)
                }finally{
                    this.loading = false
                }
            }
        },
        watch: {
            updateFlag() {
                this.network_getData()
            }
        },
        components: {
            ComplexBubble,
            Title: styled.div``,
            Content: styled.div``,
        }
    }
</script>

<style scoped>
.footer{
    padding: 10px 15px;
    font-weight: 500;
    line-height: 1.5;
    color: #0366d6;
}

</style>