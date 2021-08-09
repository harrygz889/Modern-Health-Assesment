import React, { useState, useEffect } from 'react';
import rawData from './data.json'
import Message from './Message'
import deduplicate from './lib/deduplicate';
import sortByTime from './lib/sortByTime';

const List = () => {
  const [data, setData] = useState([])
  const [listItems, setListItems] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [page, setPage] = useState(1)
  const [allMessagesDisplayed, setAllMessagesDisplayed] = useState(false)
  const [oldestFirst, setOldestFirst] = useState(false)
  const [noItems, setNoItems] = useState(false)

  // check if infinite scrolling should be triggered
  function handleScroll() {
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return
    setIsFetching(true)
  }

  function deleteMessage(date) {
    let newData = data.filter((msg) => msg.sentAt !== date )
    setPage(1) // set page back to 1, so the infinite scrolling IF statement doesn't cut results short
    setData(newData)
  }

  function handleSort() {
    // create new array so original is not mutated
    let reversedData = data.slice().reverse();

    setOldestFirst(!oldestFirst)
    setPage(1)
    setAllMessagesDisplayed(false) // reset allMessagesDisplayed incase end of list was reached before reorder
    setData(reversedData)
  }

  function loadButtonHandler() {
    setIsFetching(true)
    fetchMoreListItems()
  }

 
  function fetchMoreListItems() {
    // create timeout to imitate fetching from API
    setTimeout(() => {
      // IF -- there are still results to show
        // set listItems to previous state + 5 new items or rest of list
      // ELSE -- We have reached the end, set allMessagesDisplayed to True
      if(data.length > page * 5) {
        setListItems(prevState => ([...prevState, ...data.slice(page * 5, (page * 5) + 5)]));
        setPage(page + 1)
      }
      else {
        setAllMessagesDisplayed(true)
      }
      setIsFetching(false);
    }, 2000);
  }


  useEffect(() => {
    // Deduplicate the data and sort it by newest initially
    setData(sortByTime(deduplicate(rawData.messages)))
  }, [])

    // this will be run anytime the state of data is changed (iniitial load, handleSort, deleteMessage)
  useEffect(() => {
    setListItems(data.slice(0, 5))
  }, [data])

  // infinite scroll will break if you delete the first five messages because you cant scroll down
  // here we simply check if we should be showing a "more results" button to bypass infinite scroll
  useEffect(() => {
    if(listItems.length === 0) {
      setNoItems(true)
    }
    else {
      setNoItems(false)
    }
  }, [listItems])

  // runs if allMessagesDisplayed changes. We dony want to show the checking status message if there is ...
  // nothing to check for. 
  useEffect(() => {
    if(allMessagesDisplayed) {
      window.removeEventListener('scroll', handleScroll);
    }
    else {
      window.addEventListener('scroll', handleScroll);
    }
    return () => window.removeEventListener('scroll', handleScroll);
  }, [allMessagesDisplayed]);

  useEffect(() => {
    if (!isFetching) return;
    fetchMoreListItems();
  }, [isFetching]);
  
  return (
    <>
      <button className="small-button" onClick={handleSort}>Sort by {oldestFirst ? 'newest' : 'oldest'}</button>
      <ul>
        {listItems.map(listItem => <Message 
                                      listItem={listItem} 
                                      key={listItem.sentAt} 
                                      deleteMessage={deleteMessage} 
                                      isFetching={isFetching} />)}
      </ul>
      {page === 1 || noItems ? <button className="small-button" onClick={loadButtonHandler} disabled={isFetching}>Load older messages</button> : ''}
      {isFetching && <p>Loading more messages...</p>}
      {allMessagesDisplayed && <p>End of message history ✉️</p>}
    </>
  );
};

export default List;