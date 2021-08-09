const sortByTime = (arr) => {
  return arr.sort(function(a, b) {
    return new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime();
  });
}

export default sortByTime