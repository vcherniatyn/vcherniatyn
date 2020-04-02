import moment from 'moment';

export default (date: Date) => {
    if (date) {
        return moment(date).format('YYYY-MM-DD HH:mm');
    }
    return date;
};
