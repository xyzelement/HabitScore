

Meteor.utils = {
    dateToKey        : function dateToKey(date) { return date.format("YYYYMMDD"); },
    keyToDate        : function keyToDate(date) { return moment(date,"YYYYMMDD"); },
	maxDaysDisplayed : 10
};