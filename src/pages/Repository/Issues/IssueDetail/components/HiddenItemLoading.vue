<template>
    <Container class="text-center container my-4">
        <Main class="d-inline-flex flex-column Box">
            <button class="text-gray pt-2 px-4 bg-white border-0" @click="dataGetter">
                <slot></slot> hidden items
            </button>
            <button class="ajax-pagination-btn no-underline pb-1 pt-0 px-4 mt-0 mb-1 bg-white border-0" @click="dataGetter">
                {{loading ? 'Loading...' : 'Load more...'}}
            </button>
        </Main>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    export default {
        props: {
            loading: {
                type: Boolean,
                default: false
            },
            dataGetter: {
                type: Function,
                default: () => {console.log('getting data')}
            }
        },
        components: {
            Container: styled.div``,
            Main: styled.div``,
        }
    }
</script>

<style scoped>
.ajax-pagination-btn {
    width: 100%;
    padding: 6px;
    margin-top: 20px;
    font-weight: 600;
    color: #0366d6;
    background: #fff;
    border: 1px solid #e1e4e8;
    border-radius: 3px;
}
.container {
    background-color: #fff;
    background-image: url(https://github.githubassets.com/images/modules/pulls/progressive-disclosure-line@2x.png);
    background-repeat: repeat-x;
    background-position: 0;
    background-size: 32px;
}


</style>