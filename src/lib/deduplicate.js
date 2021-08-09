const deduplicate = (arr) => {
  for(let i = 0; i < arr.length; i++) {
    for(let j = i + 1; j < arr.length; j++) {
      if(arr[i].uuid === arr[j].uuid && arr[i].content === arr[j].content) {
        arr.splice(i, 1)
      }
    }
  }
  return arr
}
export default deduplicate