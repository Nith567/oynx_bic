'use client'
import React from 'react'
function Postings({params}) {
    console.log(params.postId);
  return (
    <div>Postings hello {params.postId}</div>
   
  )
}
   
export default Postings   