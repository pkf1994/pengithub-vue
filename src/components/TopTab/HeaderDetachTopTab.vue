<template>
    <Container class="bg-primary">
        <nav class="text-center reponav">
            <router-link :to="tabItem.routerLink"
                         :exact="tabItem.exact"
                         :class="{'router-link-active':tabItem.extraActiveRouterLinks && tabItem.extraActiveRouterLinks.indexOf(currentPath) !== -1}"
                         class="pt-1 px-2 pb-3 d-inline-block nav-item to-adjust"
                         v-for="tabItem in tabs.filter(i => !i.disabled)"
                         :key="tabItem.label" >
                     <AnimatedWidthWrapper class=" v-align-bottom">
                        <span class="lh-15  no-wrap">
                            {{tabItem.label}}
                        </span>
                        
                        <span class="Counter no-wrap"  
                        style="background-color: hsla(0,0%,100%,.15);color: inherit;" 
                        v-if="tabItem.meta">{{tabItem.meta}}</span>
                    </AnimatedWidthWrapper> 
            </router-link>
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
            activeTab: {
                type: String,
                required: true
            }
        },
        computed: {
            currentPath() {
                return this.$route.path
            }
        },
        mounted() {
            this.adjustStyle()
        },
        methods: {
            adjustStyle() {
                let tabItemElList = document.querySelectorAll("nav .to-adjust")
                let parent = undefined
                tabItemElList.forEach((item,index) => {
                    if(!parent)parent = item.parentNode
                    if(index !== (tabItemElList.length - 1)) {
                        parent.insertBefore(document.createTextNode(" "),item.nextSibling)
                    }
                })
            }
        },
        components: {
            AnimatedWidthWrapper,
            Container: styled.div``,
            Inner: styled.div``,
        }
    }
</script>

<style scoped>
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
</style>