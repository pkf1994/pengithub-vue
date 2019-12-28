<template>
    <Container class="px-2 pt-2 d-flex flex-items-center">
        <label for="codesearch_sort_repos" class="col-3 text-small px-2">{{label}}</label>
        <select id="codesearch_sort_repos" v-model="selectedValue" class="col-9 form-select mr-2">
            <slot></slot>
        </select>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    export default {
        props: {
            label: {
                type:String,
                required: true
            },
            syncSelectedValue: {
                type: Function,
                required: true
            },
            options: {
                type: Array,
                default: () => []
            }
        },
        data() {
            return {
                selectedValue: ""
            }
        },
        watch: {
            selectedValue(newOne) {
                this.syncSelectedValue(newOne)
            },
            options(newOne) {
                this.selectedValue = newOne[0].language
            }
        },
        components: {
            Container: styled.div``
        }
    }
</script>

<style scoped>

</style>