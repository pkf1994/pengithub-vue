export default {
    thousands: function(number) {
        let reg=/\d{1,3}(?=(\d{3})+$)/g;
        return (number + '').replace(reg, '$&,');
    }
}