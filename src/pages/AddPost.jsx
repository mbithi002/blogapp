import React from 'react'
import Container from '../components/container'
import PostForm from '../components/post-form'

function addpost() {
  return (
    <div className="py-6">
      <Container>
        <PostForm />
      </Container>
    </div>
  )
}

export default addpost