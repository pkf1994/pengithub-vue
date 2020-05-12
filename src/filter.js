import Vue from 'vue'
import {util_numberFormat,util_dateFormat,util_fileSize} from '@/util'
Vue.filter('capitalize', function (value) {
    if (!value) return ''
    value = value.toString()
    return value.charAt(0).toUpperCase() + value.slice(1)
})

Vue.filter('thousands', function (number) {
    return util_numberFormat.thousands(number)
})

Vue.filter('thousands2K2M', function(number,reservedDecimal = 2) {
    return util_numberFormat.thousands2K2M(number,reservedDecimal)
})

Vue.filter('dateFormat', function (dateStr,fmt) {
    return util_dateFormat.dateFormat(dateStr,fmt)
})

Vue.filter('getDateDiff', function (standardDateString) {
    return util_dateFormat.getDateDiff(standardDateString)
})

Vue.filter('fileSize', function(size) {
    return util_fileSize.getFileSize(size)
})