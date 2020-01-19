<template>
    <Container>
        <span v-for="(item,index) in pathArr"
                class="text-gray"
                :key="item + index">
                <router-link  v-if="index < pathArr.length - 1" class="text-gray" :to="item.to" >{{item.fragment}}</router-link><span v-if="index === pathArr.length - 1" class="text-gray">{{item.fragment}}</span><span v-if="index < pathArr.length - 1">/</span>
        </span>
    </Container>
</template>

<script>
    import styled from 'vue-styled-components'
    export default {
        props: {
            startIndex: {
                type: Number,
                default: 0
            },
            spaceArround: {
                type: Boolean,
                default: false
            },
            customFragment: {
                type: Array,
                default: () => []
            },
            disableLastFragment: {
                type: Boolean,
                default: true
            }
        },
        computed: {
            pathArr(){
                let pathArr = []
                let fragmentArr = this.$route.path.split('/')
                fragmentArr = fragmentArr.slice(1,fragmentArr.length)
                this.customFragment.forEach(item => {
                    fragmentArr[item.index] = item.fragment
                })
                fragmentArr.forEach((item,index) => {
                    if(index > this.startIndex - 1) {
                        let to = ''
                        for(let i=0; i<=index; i++){
                            to = to + '/' + fragmentArr[i] 
                        }
                        pathArr.push({
                            to: to,
                            fragment: this.spaceArround ? ` ${item} ` : item
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