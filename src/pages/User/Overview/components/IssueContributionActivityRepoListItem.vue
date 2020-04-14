<template>
    <Container class="py-2">
        <button @click="triggerStretch" class="flex-wrap btn-link muted-link no-underline lh-condensed text-left width-full">
            <Content class="d-inline-block col-8">
                <span class="css-truncate css-truncate-target  mb-1" style="max-width:100%;">
                    {{contribution.repository.nameWithOwner}}
                </span>
            </Content>

            <StateStatistic class="d-inline-block float-right f6 text-gray float-right text-right">
                <span v-if="mergedCount > 0">
                    <span class="text-white State--purple rounded-1 ml-2 px-1">{{mergedCount}}</span>
                    merged
                </span>
                <span v-if="openCount > 0">
                    <span class="text-white State--green rounded-1 ml-2 px-1">{{openCount}}</span>
                    open
                </span>
                <span v-if="closedCount > 0">
                    <span class="text-white State--red rounded-1 ml-2 px-1">{{closedCount}}</span>
                    closed
                </span>
            </StateStatistic>
        </button>

        <AnimatedHeightWrapper :stretch="stretch">
             <ul class="pt-1 list-style-none">
                <li class="py-1 ml-0" v-for="item in contribution.contributions.nodes" :key="item[meta].id">
                    <Content class="css-truncate css-truncate-target" style="max-width:85%;">
                        <span class="profile-rollup-icon">
                            <IssueIcon :issue="item[meta]" class=" v-align-text-bottom"></IssueIcon>
                        </span>
                        <router-link :to="item[meta].resourcePath" class="link-gray-dark">{{item[meta].title}}</router-link>
                    </Content>

                    <time class="float-right f6 text-gray-light pt-1">
                        {{item.occurredAt | dateFormat('zzz d')}}
                    </time>    
                </li>
            </ul>
        </AnimatedHeightWrapper>
       
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {IssueIcon, AnimatedHeightWrapper} from '@/components'
    import {util_numberFormat,util_dateFormat} from '@/util'
    export default {
        props: {
            contribution: {
                type: Object,
                required: true
            },
            meta: {
                type: String,
                default: 'issue'
            }
        },
        data() {
            return {
               stretch: false
            }
        },
        computed: {
            mergedCount() {
                return this.contribution.contributions.nodes.filter(i => {
                    return i[this.meta].state == 'MERGED'
                }).length
            },
            openCount() {
                return this.contribution.contributions.nodes.filter(i => {
                    return i[this.meta].state == 'OPEN'
                }).length
            },
            closedCount() {
                return this.contribution.contributions.nodes.filter(i => {
                    return i[this.meta].state == 'CLOSED'
                }).length
            },
        },
        methods: {
            triggerStretch() {
                this.stretch = !this.stretch
            }
        },
        components: {
            AnimatedHeightWrapper,
            IssueIcon,
            Container: styled.div``,
            Content: styled.div``,
            StateStatistic: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/layout/index.scss';
@import 'node_modules/@primer/css/truncate/index.scss';
@import 'node_modules/@primer/css/labels/index.scss';
.profile-rollup-icon {
    display: inline-block;
    width: 16px;
    text-align: center;
}
</style>