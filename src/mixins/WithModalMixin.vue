<template>
</template>

<script>
    import {Modal} from '@/components'
    export default {
        methods: {
            openModal(ref) {
                this.$refs[ref].show = true
            },
            closeModal() {
                for(let key in this.$refs){
                    if(this.$refs[key].show) this.$refs[key].show = false
                }
            },
        },
        components: {
            Modal
        }
    }
</script>

<style scoped lang="scss">

</style>