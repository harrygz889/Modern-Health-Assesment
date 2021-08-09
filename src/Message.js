import React from 'react'
import formatDate from './lib/formatDate';

const Message = ({listItem, deleteMessage, isFetching}) => {

  return (
    <li className="list-group-item">
       <p>From: {listItem.senderUuid}</p>
       <p>Sent At: {formatDate(listItem.sentAt)}</p>
       <p>{listItem.content}</p>
       {/* Must disable button if we are fetching data to prevent race conditions */}
       <button disabled={isFetching} onClick={() => deleteMessage(listItem.sentAt)}>Delete Message</button>
    </li>
  )
}

export default Message