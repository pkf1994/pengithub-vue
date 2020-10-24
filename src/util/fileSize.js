export default {
    getFileSize(fileByte) {
        var fileSizeByte = parseInt(fileByte);
        var fileSizeMsg = "";
        if (fileSizeByte < 1048576) return  (fileSizeByte / 1024).toFixed(0) + "KB";
        if (fileSizeByte < 1024)  return fileSizeByte + "Bytes" 
        else if (fileSizeByte == 1048576) fileSizeMsg = "1MB";
        else if (fileSizeByte > 1048576 && fileSizeByte < 1073741824) fileSizeMsg = (fileSizeByte / (1024 * 1024)).toFixed(2) + "MB";
        else if (fileSizeByte == 1073741824) fileSizeMsg = "1GB";
        else if (fileSizeByte > 1073741824 && fileSizeByte < 1099511627776) fileSizeMsg = (fileSizeByte / (1024 * 1024 * 1024)).toFixed(2) + "GB";
        else fileSizeMsg = "more than 1TB";
        return fileSizeMsg;
    },
    getFileSizeWithNumberAndUnit(fileByte) {
        var fileSizeByte = fileByte;
        var fileSizeMsg = "";
        if (fileSizeByte < 1024) {
            return {
                unit: 'Bytes',
                number: fileSizeByte
            }
        }
        if (fileSizeByte < 1048576) {
            return {
                unit: 'KB',
                number: (fileSizeByte / 1024).toFixed(0)
            }
        }
        if (fileSizeByte == 1048576) {
            return {
                unit: 'MB',
                number: 1
            }
        }
        if(fileSizeByte > 1048576 && fileSizeByte < 1073741824){
            return {
                unit: 'MB',
                number: (fileSizeByte / (1024 * 1024)).toFixed(2)
            }
        }
        if(fileSizeByte == 1073741824){
            return {
                unit: 'GB',
                number: 1
            }
        }
        if(fileSizeByte > 1073741824 && fileSizeByte < 1099511627776){
            return {
                unit: 'GB',
                number: (fileSizeByte / (1024 * 1024 * 1024)).toFixed(2)
            }
        }
        return {
            unit: 'more than 1TB',
            number: undefined
        }
    }
}