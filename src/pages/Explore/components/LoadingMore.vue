<template>
    <button @click="getData" class="btn mt-4 mb-3 py-2 btn-outline border-gray-dark f6 width-full">{{loading ? 'Loadding more…' : 'Load more…'}}</button>
</template>

<script>
    import styled from 'vue-styled-components'
    export default {
        props: {
            dataGetter: {
                type: Function,
                default: () => {console.log('get data')}
            },
            loading: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            getData() {
                if(this.loading) return
                this.dataGetter()
            }
        }
    }
</script>

<style scoped>

</style>