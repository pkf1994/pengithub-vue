export default {
    thousands: function(number) {
        let reg=/\d{1,3}(?=(\d{3})+$)/g;
        return (number + '').replace(reg, '$&,');
    },
    thousands2K2M: function (number,reservedDecimal = 2) {
        if(number >= 1000000) {
            let numberString = (number/1000000).toString()
            let formattedString = numberString.substring(0,numberString.indexOf('.') + reservedDecimal + 1) + 'M'
            if(formattedString.endsWith('0M') && reservedDecimal + 1 > 0){
                formattedString = formattedString.substring(0,formattedString.length - 3) + 'M'
            }
            return formattedString
        }
        if(number >= 1000) {
            let numberString = (number/1000).toString()
            let formattedString = numberString.substring(0,numberString.indexOf('.') + reservedDecimal + 1) + 'K'
            if(formattedString.endsWith('0K') && reservedDecimal + 1 > 0){
                formattedString = formattedString.substring(0,formattedString.length - 3) + 'K'
            }
            return formattedString
        }
        return number
    }
}