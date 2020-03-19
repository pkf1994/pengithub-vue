<template>
    <Container class="px-2 pt-2 d-flex flex-items-center">
        <label for="codesearch_sort_repos" class="col-3 text-small px-2" :class="{disabled:disabled}">{{label}}</label>
        <SelectWrapper class="col-9 mr-2 relative">
            <select id="codesearch_sort_repos"
                    @change="$emit('change',$event.target.value)"
                    :disabled="disabled"
                    :class="{disabled:disabled}"
                    class="form-select width-full">
                <slot></slot>
            </select>
        </SelectWrapper>
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
            disabled: {
                type: Boolean,
                default: false
            },
        },
        components: {
            Container: styled.div``,
            SelectWrapper: styled.div``,
            LoadingWrapper: styled.div``,
            Inner: styled.div``
        }
    }
</script>

<style lang="scss">
.disabled{
    color: #DDDDDD;
}
</style>