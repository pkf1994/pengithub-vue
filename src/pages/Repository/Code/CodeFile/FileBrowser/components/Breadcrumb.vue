<template>
    <Container>
        <router-link v-for="(item,index) in pathArr"
                class="text-gray"
                :to="item.to" 
                :key="item + index">
                <span>{{item.fragment}}</span><span v-if="index < pathArr.length - 1">/</span>
        </router-link>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    export default {
        computed: {
            pathArr(){
                let pathArr = []
                let fragmentArr = this.$route.path.split('/')
                //console.log(this.$route.path)
                //console.log(fragmentArr)
                fragmentArr = fragmentArr.slice(1,fragmentArr.length)
                fragmentArr.forEach((item,index) => {
                    if(index > 3) {
                        let to = ''
                        for(let i=0; i<=index; i++){
                            to = to + '/' + fragmentArr[i] 
                        }
                        pathArr.push({
                            to: to,
                            fragment: item
                        })
                    } 
                })
                return pathArr
            }
        },
        components: {
            Container: styled.span``
        }
    }
</script>

<style scoped>

</style>