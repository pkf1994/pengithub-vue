<template>
    <Container  style="background-color: #eff1f3;">
        <Header>{{data.name}}</Header>
        <AnimatedHeightWrapper>
            <HeaderDetachTopTab :tabs="tabs">
            </HeaderDetachTopTab>
        </AnimatedHeightWrapper>
        
        <transition appear name="fade">
            <FilterInput v-if="firstLoadedFlag" class="pt-2 px-2">
                <IconSearchInput v-model="filterQuery" placeholder="Filter cards">
                </IconSearchInput>
            </FilterInput>
        </transition>
        

        <CardList class="p-2">
            <transition-group appear name="fade-group">
                <Card v-for="item in cards" :key="item.id" :card="item"></Card>
            </transition-group>
        </CardList>

        <transition name="fade" appear>
            <CommonLoading  v-if="loading"
                            :preventClickEvent="false"/>
        </transition>  
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {RouteUpdateAwareMixin} from '@/mixins'
    import {Header,Card} from './components'
    import {HeaderDetachTopTab,IconSearchInput,CommonLoading,AnimatedHeightWrapper} from '@/components'
    import * as graphql from './graphql'
    import {authRequiredGitHubGraphqlApiQuery} from '@/network'
    export default {
        name: 'repository_project_detail_page',
        mixins: [RouteUpdateAwareMixin],
        data() {
            return {
                data: {},
                filterQuery: '',
                loading: false,
                firstLoadedFlag: false
            }
        },
        computed: {
            tabs() {
                let tabs = []
                if(!this.data.columns) return tabs
                this.data.columns.nodes.forEach((i, index)=> {
                    tabs.push({
                        routerLink: index == 0 ? this.$route.path : `${this.$route.path}?column=${i.name}`,
                        label: i.name,
                        meta: i.cards.nodes.length,
                        exact: true
                    })
                })
                return tabs
            },
            column() {
                return this.$route.query.column || (this.data.columns && this.data.columns.nodes[0].name)
            },
            cards() {
                if(!this.data.columns) return []
                let cardsHolder = this.data.columns.nodes.filter(i => {
                    return i.name == this.column
                })
                if(!this.filterQuery || this.filterQuery.trim() == '') return cardsHolder[0] ? cardsHolder[0].cards.nodes : []
                return cardsHolder[0] ? cardsHolder[0].cards.nodes.filter(i => {
                    return (i.note && i.note.toLowerCase().indexOf(this.filterQuery.toLowerCase()) != -1) || 
                            (i.content && i.content.title.toLowerCase().indexOf(this.filterQuery.toLowerCase()) != -1)
                }) : []
            }
        },
        created() {
            console.log(this.$route)
            this.network_getData()
        },
        methods: {
            async network_getData() {
                try{
                    this.loading = true
                    let cancelToken = this.cancelAndUpdateAxiosCancelTokenSource(this.$options.name)
                    let graphql_ = graphql.GRAPHQL_PROJECT({
                        ...this.$route.params
                    })
                    let res = await authRequiredGitHubGraphqlApiQuery(graphql_,{cancelToken})
                    this.data = res.data.data.repository.project
                    this.firstLoadedFlag = true
                }catch(e) {
                    this.handleError(e)
                }finally{
                    this.loading = false
                }
            },
            generateRouterMeta() {
                return `${this.owner}-${this.repo}-${this.$route.number}`
            }
        },
        components: {
            Header,
            Card,
            HeaderDetachTopTab,
            IconSearchInput,
            CommonLoading,
            AnimatedHeightWrapper,
            Container: styled.div``,
            FilterInput: styled.div``,
            CardList: styled.div``,
        }
    }
</script>

<style scoped>

</style>