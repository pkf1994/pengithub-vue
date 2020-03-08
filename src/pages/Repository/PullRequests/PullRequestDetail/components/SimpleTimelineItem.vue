<template>
    <Container class="p-3 relative container">
        <Inner class="flex relative pl-4">

            <div class="pr-simple-timeline-icon-wrapper">
                 <slot name="icon">
                    <svg class="octicon" viewBox="0 0 10 16" version="1.1" width="10" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M9 0H1C.27 0 0 .27 0 1v15l5-3.09L10 16V1c0-.73-.27-1-1-1zm-.78 4.25L6.36 5.61l.72 2.16c.06.22-.02.28-.2.17L5 6.6 3.12 7.94c-.19.11-.25.05-.2-.17l.72-2.16-1.86-1.36c-.17-.16-.14-.23.09-.23l2.3-.03.7-2.16h.25l.7 2.16 2.3.03c.23 0 .27.08.09.23h.01z"></path></svg>
                </slot>
            </div>
           
            <WhoDidWhat>
                
                <router-link v-if="showActor" to="/" class="text-bold link-gray-dark">
                    {{data.actor ? data.actor.login : (data.author && data.author.name)}}
                </router-link>
                <slot name="action"></slot>
                <span class="no-wrap">{{createdAt}}</span>
            </WhoDidWhat>
        </Inner>
        <slot name="additional">
        </slot>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {util_dateFormat} from '../../../../../util'
    export default {
        props: {
            data: {
                type: Object,
                required: true
            },
            badgeStyle: {
                type: Object,
                default: () => ({})
            },
            showActor: {
                type: Boolean,
                default: true
            },
            showActorAvatar: {
                type: Boolean,
                default: true
            },
            date: {
                type: String,
                required: false
            }
        },
    
        computed: {
            createdAt() {
                if(this.date) return util_dateFormat.getDateDiff(this.date)
                if(this.data.created_at) return util_dateFormat.getDateDiff(this.data.created_at)
            }
        },
        components: {
            Container: styled.div``,
            Inner: styled.div``,
            WhoDidWhat: styled.div``,
        }
    }
</script>

<style>
.pr-simple-timeline-icon-wrapper{
    position: absolute;
    top: 1px;
    left: 1px;
    margin-right: 10px;
    color: #959da5;
}
</style>

<style scoped lang="scss">
.container{
    padding: 15px;
    font-size: 13px;
    color: #586069;
}

.body {
    min-width: 0;
    max-width: 100%;
    margin-top: 4px;
    color: #444d56;
    flex: auto;
}
</style>