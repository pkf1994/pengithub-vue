<template>
    <Container>
        <InnerTopTab :tabs="tabs" />
        Pull Requests
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    export default {
        data() {
            return {
                tabs: [
                    {
                        label: 'Created',
                        to: '/pulls'
                    },
                    {
                        label: 'Assigned',
                        to: '/pulls/assigned'
                    },
                    {
                        label: 'Mentioned',
                        to: '/pulls/mentioned'
                    }
                ]
            }
        },
        components: {

            Container: styled.div``
        }
    }
</script>

<style scoped>

</style>