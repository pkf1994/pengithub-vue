export default {
    handleDoubleBackslash(str){
        let reg = /\/\//g
        return str.replace(reg,'/')
    }   
}