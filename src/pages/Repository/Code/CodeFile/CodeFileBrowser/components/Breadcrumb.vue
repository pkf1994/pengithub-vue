<template>
    <Container>
        <router-link v-for="(item,index) in pathArr"
                :to="item.to" 
                :key="item + index">
                <span>{{item.fragment}}</span><span v-if="index < pathArr.length - 1">/</span>
        </router-link>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    export default {
        props: {
            path: {
                type: String,
                defaule: ''
            }
        },
        computed: {
            pathArr(){
                let pathArr = []
                let fragmentArr = this.$route.path.split('/')
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
                /* let fullPath = this.$route.path
                let path = fullPath.substring(fullPath.indexOf('file/') + 5)
                let basePath = this.$route.path.replace(path,'')
                console.log(fullPath)
                console.log(path)
                console.log(basePath)
                let 
                path.split('/').forEach((item,index) => {
                    let to = basePath
                    for(let i = 0; i++; i < index){
                        to = to 
                    }
                    pathArr.push({
                        to: fullPath.substring(0,fullPath.indexOf(item)) + item,
                        fragment: item
                    })
                }) */
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