import moment from 'moment'

const formatDate = (time) => {
  return moment(time).format('MMMM Do YYYY - h:mm:ss a')
}

export default formatDate