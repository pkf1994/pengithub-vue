<template>
    <Container class="py-3">
        <Inner class="text-center">
            <p class="mb-1 title">
                <slot></slot>
            </p>
            <LoadMore class="text-center">
                 <button class="ajax-pagination-btn no-underline pb-1 pt-0 px-4 mt-0 mb-1 border-0"
                    :class="{'loading-animation':loading}"
                    @click="dataGetter">
                    {{loading ? 'Loading...' : 'Load more'}}
                </button>
            </LoadMore>    
        </Inner>
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
            Inner: styled.div``,
            LoadMore: styled.div``,
        }
    }
</script>

<style scoped>
.title {
    font-weight: 600;
    color: #586069;
}

button{
    color: #0366d6;
    padding: 0;
    margin: 0;
    background: none;
    border: 0;
}

.loading-animation{
    animation: kf-loading 2s infinite;
}

@keyframes kf-loading {
    0%{
        opacity: 0;
    }
    50%{
        opacity: 1;
    }
    100%{
        opacity: 0;
    }
}

</style>