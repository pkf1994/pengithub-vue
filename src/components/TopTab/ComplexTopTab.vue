<template>
    <nav class="d-flex overflow-auto">
        <router-link class="px-2 py-3 mr-3 router-link flex-row-center flex-shrink-0" 
                        :style="tabStyle"
                        :exact="tabItem.exact"
                        :class="{'router-link-active':tabItem.active}"
                        v-for="tabItem in tabs.filter(i => !i.disabled)"
                        :key="tabItem.label"
                        :to="tabItem.to">
            <span>{{tabItem.label}}</span>
            <AnimatedWidthWrapper>
                <span class="ml-1 mt-1 no-wrap Counter" v-if="tabItem.meta">
                    {{tabItem.meta}}
                </span>
            </AnimatedWidthWrapper>
        </router-link>
    </nav>
</template>

<script>
    import {AnimatedWidthWrapper} from '../AnimatedSizeWrapper'
    export default {
        props: {
            tabs: {
                type: Array,
                required: true
            },
            tabStyle: {
                type: Object,
                required: false
            }
        },
        components: {
            AnimatedWidthWrapper
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/labels/index.scss';
    .router-link {
        padding: 16px 8px;
        margin-right: 16px;
        font-size: 14px;
        line-height: 1.5;
        color: #586069;
        text-align: center;
        border-bottom: 2px solid transparent;
    }
    .router-link-active {
        font-weight: 600;
        color: #24292e;
        border-bottom-color: #e36209
    }
    .meta {
        color: #fff;
        background-color: #6a737d;
        display: inline-block;
        padding: 2px 5px;
        font-size: 12px;
        font-weight: 600;
        text-align: center;
        line-height: 1;
        border-radius: 20px;
    }
</style>