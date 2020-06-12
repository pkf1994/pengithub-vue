import {mapState,mapMutations} from 'vuex'
import {MUTATION_APPOINT_TOP_NOTICE} from '@/store/modules/topNotice/mutationTypes'
export default {
    install: (Vue) => {
        Vue.mixin({
            computed: {
                ...mapState({
                    topNotice: state => state.topNotice
                })
            },
            methods: {
                ...mapMutations({
                    mutation_appointTopNotice: MUTATION_APPOINT_TOP_NOTICE 
                }),
               topNoticeShow(theKey,notice,type = 'normal') {
                   this.mutation_appointTopNotice({
                        theKey,
                        notice,
                        type
                   })
               }
            },
           
        })
    }
}