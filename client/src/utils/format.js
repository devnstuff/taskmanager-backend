import moment from "moment";

export function formatDate(x) {
  let date = moment(x).format("ll");
  return date;
}

export function overdue(x) {

  if (moment(x).add(1, 'days').isBefore(moment())) {
    return true
  } else {
    return false
  }
}