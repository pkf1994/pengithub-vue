<template>
    <Container class="Box-row">
        <StarBtn class="float-right">
            <button class="btn btn-sm" :disabled="viewerHasStarred === undefined">
                <svg height="16" class="octicon octicon-star v-align-text-bottom" vertical_align="text_bottom" viewBox="0 0 14 16" version="1.1" width="14" aria-hidden="true"><path fill-rule="evenodd" d="M14 6l-4.9-.64L7 1 4.9 5.36 0 6l3.6 3.26L2.67 14 7 11.67 11.33 14l-.93-4.74L14 6z"></path></svg>
               {{viewerHasStarred ? 'Unstar' : 'Star'}}
            </button>
        </StarBtn>

        <h1 class="h3 text-gray text-normal lh-condensed">
            <span>
                <svg height="16" class="octicon octicon-repo mr-1 text-gray" color="gray" viewBox="0 0 12 16" version="1.1" width="12" aria-hidden="true"><path fill-rule="evenodd" d="M4 9H3V8h1v1zm0-3H3v1h1V6zm0-2H3v1h1V4zm0-2H3v1h1V2zm8-1v12c0 .55-.45 1-1 1H6v2l-1.5-1.5L3 16v-2H1c-.55 0-1-.45-1-1V1c0-.55.45-1 1-1h10c.55 0 1 .45 1 1zm-1 10H1v2h2v-1h3v1h5v-2zm0-10H2v9h9V1z"></path></svg>
            </span>
            <router-link :to="`/${repository.author}`">{{repository.author}}</router-link> /
            <router-link :to="`/${repository.author}/${repository.name}`" class="text-bold">{{repository.name}}</router-link>
        </h1>

        <p class="text-gray my-1">
            {{repository.description}}
        </p>    

        <Meta class="f6 text-gray mt-2 meta">
            <span class="d-inline-block ml-0 mr-3" v-if="repository.language">
                <span class="repo-language-color" :style="{'backgroundColor': repository.languageColor}"></span>
                <span>{{repository.language}}</span>
            </span>

            <span class="muted-link d-inline-block mr-3">
                <svg height="16" class="octicon octicon-star" aria-label="star" viewBox="0 0 14 16" version="1.1" width="14" aria-hidden="true"><path fill-rule="evenodd" d="M14 6l-4.9-.64L7 1 4.9 5.36 0 6l3.6 3.26L2.67 14 7 11.67 11.33 14l-.93-4.74L14 6z"></path></svg>
                {{formatStarNumber}}
            </span>

            <span class="muted-link d-inline-block mr-3">
                <svg height="16" class="octicon octicon-repo-forked" aria-label="fork" viewBox="0 0 10 16" version="1.1" width="10" aria-hidden="true"><path fill-rule="evenodd" d="M8 1a1.993 1.993 0 00-1 3.72V6L5 8 3 6V4.72A1.993 1.993 0 002 1a1.993 1.993 0 00-1 3.72V6.5l3 3v1.78A1.993 1.993 0 005 15a1.993 1.993 0 001-3.72V9.5l3-3V4.72A1.993 1.993 0 008 1zM2 4.2C1.34 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm3 10c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm3-10c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z"></path></svg>
                {{formatForksNumber}}
            </span>

            <span class="d-inline-block mr-3">
                Built by
                <router-link v-for="item in repository.builtBy.slice(0,5)" :to="`/${item.username}`" :key="item.username">
                    <img :src="item.avatar" :alt="`@${item.username}`" class="avatar mr-1" height="20" width="20">
                </router-link>
            </span>

              <span class="muted-link d-inline-block mr-3">
                <svg height="16" class="octicon octicon-star" viewBox="0 0 14 16" version="1.1" width="14" aria-hidden="true"><path fill-rule="evenodd" d="M14 6l-4.9-.64L7 1 4.9 5.36 0 6l3.6 3.26L2.67 14 7 11.67 11.33 14l-.93-4.74L14 6z"></path></svg>
                {{formatCurrentPeriodStars}} stars {{period}}
            </span>
        </Meta>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {util_numberFormat} from '@/util'
    export default {
        inject: ['viewerHasStarredProvided'],
        props: {
            repository: {
                type: Object,
                required: true
            }
        },
        computed: {
            formatStarNumber() {
                return util_numberFormat.thousands(this.repository.stars)
            },
            formatCurrentPeriodStars() {
                return util_numberFormat.thousands(this.repository.currentPeriodStars)
            },
            formatForksNumber() {
                return util_numberFormat.thousands(this.repository.forks)
            },
            period() {
                let since = this.$route.query.since
                switch(since) {
                    case "weekly":
                        return 'this week'
                    case 'monthly':
                        return 'this month'
                    default:
                        return 'today'
                }
            },
            viewerHasStarred() {
                let viewerHasStarredHolder = this.viewerHasStarredProvided().filter(i => i.url == this.repository.url)[0]
                return viewerHasStarredHolder ? viewerHasStarredHolder.viewerHasStarred : undefined
            }
        },
        components: {
            Container: styled.div``,
            StarBtn: styled.span``,
            FullName: styled.div``,
            Meta: styled.div``
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/avatars/index.scss';

.repo-language-color{
    position: relative;
    top: 1px;
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
}
.meta{
    span{
        margin-top:2px;
        margin-bottom:1px;
    }
}
</style>