<template>
    <Container class="bg-primary">
            <nav class="text-center">
                <router-link :to="tabItem.routerLink"
                             exact
                             class="pt-1 px-2 pb-3 d-inline-block nav-item"
                             v-for="tabItem in tabs"
                             :key="tabItem.label" >
                    <span class="lh-15 ">
                        {{tabItem.label}}
                    </span>
                </router-link>
            </nav>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
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
        mounted() {
            this.adjustStyle()
        },
        methods: {
            adjustStyle() {
                let tabItemElList = document.querySelectorAll("nav .nav-item")
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
</style>