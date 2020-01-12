<template>
 
</template>

<script>
    import styled from 'vue-styled-components'
    import {LoadingAndCatchErrorTemplate} from '../../../components'
    export default {
        data() {
            return {
                errorData: {
                    errorOccurred: false,
                    errorMessage: ""
                },
                emptyData: {
                    emptyResult: false,
                    emptyMessage: ''
                }
            }
        },
        created() {
            this.getData()
        },
        methods: {
            async getData() {
                try{
                    await this.action_getData({owner:this.owner,repo: this.repo})
                }catch(e) {
                    this.errorData = {
                        errorMessage: e.message,
                        errorOccurred: true
                    }
                }
            }
        },
        components: {
            LoadingAndCatchErrorTemplate,
        }
    }
</script>

<style scoped>

</style>