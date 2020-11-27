<template>
    <transition name="fade" appear>
        <StickyTop v-if="scrollTop > 300 && data.id" class="sticky-top px-3 py-2">
            <StickyTopContent class="d-flex flex-items-center flex-justify-between">
                <IssueStateBadge :data="data" class="mr-2"></IssueStateBadge>    

                <div class="min-width-0">
                    <h1 class="d-flex text-bold f5">
                        <router-link to="/" class="css-truncate css-truncate-target link-gray-dark width-fit">
                            {{data.title}}
                        </router-link>
                        <span class="text-gray-light pl-1 no-wrap text-normal">#{{data.number}}</span>
                    </h1>
                    <div class="meta text-gray-light css-truncate css-truncate-target d-block width-fit f6">
                        <router-link to="/" class="text-bold link-gray">{{data.user && data.user.login}}</router-link>  
                        <span v-if="data.merged">
                            merged {{data.commits}}
                            {{data.commits > 1 ? 'commits' : 'commit'}}
                            into 
                            <span class="commit-ref">
                                {{data.base.label}}
                            </span>
                            from
                            <span class="commit-ref">
                                {{data.head.label}}
                            </span>
                            <span class="no-wrap">{{data.created_at | dateFormat('dd zzz yyyy')}}</span>
                        </span>
                        <span v-else>
                            opened this issue
                            <span class="no-wrap">{{data.created_at | dateFormat('dd zzz yyyy')}}</span>
                            · {{data.comments}} {{data.comments > 1 ? 'comments' : 'comment'}}
                        </span>
                    </div>
                </div> 
            </StickyTopContent>
        </StickyTop>
    </transition> 
</template>
<script>
import styled from 'vue-styled-components'
  import {IssueIcon} from '@/components'
  import {ScrollTopListenerMixin} from '@/mixins'
  import IssueStateBadge from './IssueStateBadge'
export default {
    mixins: [ScrollTopListenerMixin],
    props: {
        data: {
            type: Object,
            default:() => ({})
        }
    },
    components: {
        IssueIcon,
        IssueStateBadge,
        StickyTop: styled.div``,
        StickyTopContent: styled.div``,
        State: styled.div``
    }
}
</script>
<style scoped lang="scss">
@import 'node_modules/@primer/css/labels/index.scss';
@import 'node_modules/@primer/css/truncate/index.scss';

.sticky-top{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 109;
    display: block;
    background-color: #fff;
    border-bottom: 1px solid rgba(0,0,0,.15);
}

.commit-ref {
    position: relative;
    display: inline-block;
    padding: 0 5px;
    font: .75em/2 SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace;
    color: rgb(3, 102, 214);
    white-space: nowrap;
    background-color: #eff7ff;
    border-radius: 6px;
}
</style>