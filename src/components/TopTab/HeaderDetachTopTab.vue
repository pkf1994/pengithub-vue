<template>
    <Container class="bg-primary">
        <nav class="text-center reponav">   
            <transition-group name="list-complete" appear>
                <router-link :to="tabItem.routerLink"
                         :exact="tabItem.exact"
                         :class="{'router-link-active': tabItem.active}"
                         class="pt-1 px-2 pb-3 d-inline-block nav-item to-adjust list-complete-item"
                         v-for="tabItem in tabs.filter(i => !i.disabled)"
                         :key="tabItem.label" >
                        <span class="lh-15  no-wrap">
                            {{tabItem.label}}
                        </span>
                    <AnimatedWidthWrapper class="v-align-bottom">
                        <span class="Counter no-wrap"  
                        style="background-color: hsla(0,0%,100%,.15);color: inherit;" 
                        v-if="tabItem.meta">{{tabItem.meta}}</span>
                    </AnimatedWidthWrapper> 
                </router-link>
            </transition-group>
        </nav>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {AnimatedWidthWrapper} from '../AnimatedSizeWrapper'
    export default {
        props: {
            tabs: {
                type: Array,
                required: true
            },
        },
        computed: {
            currentPath() {
                return this.$route.path
            }
        },
        components: {
            AnimatedWidthWrapper,
            Container: styled.div``,
            Inner: styled.div``,
        }
    }
</script>

<style scoped lang="scss">
@import 'node_modules/@primer/css/labels/index.scss';
    .nav-item{
        color: hsla(0,0%,100%,.75);
    }
    .router-link-active{
        font-weight: 600;
        color: white;
    }
    .reponav {
    padding-right: 8px;
    padding-left: 8px;
    -webkit-overflow-scrolling: touch;
    overflow-x: auto;
    text-align: center;
    white-space: nowrap;
}

.list-complete-item {
  transition: all .6s;
  display: inline-block;
}
.list-complete-enter, .list-complete-leave-to
/* .list-complete-leave-active for below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
.list-complete-leave-active {
  position: absolute;
}
</style>