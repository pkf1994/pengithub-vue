<template>
    <Container :theme="theme">
        <Header alwaysShowLogo/>
        <Main>
            <ButtonArea>
                <Button @click.native="routeToTrending" title="Go To Trending"/>
            </ButtonArea>
        </Main>
    </Container>
</template>

<script>

    import {
        Header,
        Button,
        SearchInput
    } from '../../components'

    import {
        Container,
        Main,
        Hola,
        SubDesc,
        ButtonArea
    } from './style'

    import {mapState} from "vuex";
    import {ROUTE_TRENDING} from "../../router/routeRule";
    export default {
        computed: {
            ...mapState({
                theme: state => state.ui.theme
            })
        },
        methods: {
            routeToTrending() {
                console.log('routeToTrending')
                this.$router.push({name:ROUTE_TRENDING})
            }
        },
        components:{
            Header,
            Container,
            Main,
            Button,
            Hola,
            SearchInput,
            SubDesc,
            ButtonArea
        }
    }
</script>

<style scoped>

</style>