export default {
    isJSON:(str) => {
        if (typeof str == 'string') {
            try {
                var obj=JSON.parse(str);
                if(typeof obj == 'object' && obj ){
                    return true;
                }
                return false;
    
            } catch(e) {
                return false;
            }
        }
        return false;
    }
}