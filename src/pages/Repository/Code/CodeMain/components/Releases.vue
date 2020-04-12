<template>
    <ComplexBubble :loading="!codeBasicInfo().id" 
                    v-if="codeBasicInfo().releases && codeBasicInfo().releases.totalCount > 0 || !codeBasicInfo().id"
                    :disableFlag="releases.totalCount === 0 && !loading"
                    :delay="1500">
        <template v-slot:title>
            <Title class="bubble-title" style="font-weight: 700">
                <svg class="v-align-text-bottom d-inline-block bubble-title-icon bubble-title-icon" fill="currentColor" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.73 1.73C7.26 1.26 6.62 1 5.96 1H3.5C2.13 1 1 2.13 1 3.5v2.47c0 .66.27 1.3.73 1.77l6.06 6.06c.39.39 1.02.39 1.41 0l4.59-4.59a.996.996 0 000-1.41L7.73 1.73zM2.38 7.09c-.31-.3-.47-.7-.47-1.13V3.5c0-.88.72-1.59 1.59-1.59h2.47c.42 0 .83.16 1.13.47l6.14 6.13-4.73 4.73-6.13-6.15zM3.01 3h2v2H3V3h.01z"></path></svg>  
                Releases
            </Title>   
        </template>

        <Content class="bubble-content">
            <svg class="v-align-text-bottom d-inline-block text-green mr-1" fill="currentColor" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.73 1.73C7.26 1.26 6.62 1 5.96 1H3.5C2.13 1 1 2.13 1 3.5v2.47c0 .66.27 1.3.73 1.77l6.06 6.06c.39.39 1.02.39 1.41 0l4.59-4.59a.996.996 0 000-1.41L7.73 1.73zM2.38 7.09c-.31-.3-.47-.7-.47-1.13V3.5c0-.88.72-1.59 1.59-1.59h2.47c.42 0 .83.16 1.13.47l6.14 6.13-4.73 4.73-6.13-6.15zM3.01 3h2v2H3V3h.01z"></path></svg>
            <router-link to="/">
                {{releases.nodes && releases.nodes[0] && releases.nodes[0].tagName}}
           </router-link>
           published {{publishedAt}}
        </Content>

        <template v-slot:footer v-if="releases.totalCount > 1">
            <router-link to="/" class="d-block footer text-center">
                View all of {{releases.totalCount}} releases 
            </router-link>
        </template>
    </ComplexBubble>
</template>

<script>
    import styled from 'vue-styled-components'
    import {ComplexBubble} from '../../../../../components'
    import {util_dateFormat} from '../../../../../util'
    export default {
        inject: ['codeBasicInfo'],
        computed: {
            releases() {
                return  this.codeBasicInfo().releases || {}
            },
            publishedAt: function() {
                if(this.codeBasicInfo().releases){
                    return this.codeBasicInfo().releases.nodes && this.codeBasicInfo().releases.nodes[0] && util_dateFormat.getDateDiff(new Date(this.codeBasicInfo().releases.nodes[0].publishedAt))
                }
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