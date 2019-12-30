<template>
    <Container class="px-2 pt-2 d-flex flex-items-center">
        <label for="codesearch_sort_repos" class="col-3 text-small px-2">{{label}}</label>
        <SelectWrapper class="col-9 mr-2 relative">
            <select id="codesearch_sort_repos"
                    :disable="disable"
                    v-model="selectedValue"
                    class="form-select width-full">
                <slot></slot>
            </select>
        </SelectWrapper>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    import {LoadingIcon} from '../../../../components'
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
            initialValue: {
                type: String,
                default: ""
            },
            disable: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                selectedValue: this.initialValue
            }
        },
        watch: {
            selectedValue(newOne) {
                this.syncSelectedValue(newOne)
            },
            initialValue(newOne) {
                this.selectedValue = newOne
            }
        },
        components: {
            LoadingIcon,
            Container: styled.div``,
            SelectWrapper: styled.div``,
            LoadingWrapper: styled.div``,
            Inner: styled.div``
        }
    }
</script>

<style scoped lang="scss">
.loading-wrapper{
    top: 0;
    right: 0;
    bottom: 0;
    left: 8px;
    .inner{
        height: 20px;
        width: 20px;
    }
}

</style>