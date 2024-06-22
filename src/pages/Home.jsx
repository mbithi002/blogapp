import React, { useEffect, useState } from 'react'
import appwriteServices from '../appwrite/config'
import PostCard from '../components/PostCard'
import Container from '../components/container'

function Home() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    appwriteServices.getPosts([]).then((posts) => {
      if (posts) {
        setPosts(posts.documents)
      }
    })
  },[])
  if(posts.length === 0) {
    return (
      <div className="w-full py-8">
      <Container>
        <div className="flex flex-wrap">
          <h1 className="text-center text-color-blue animate-bounce">Login to read posts</h1>
        </div>
      </Container>
    </div>
    )
  }
  return (
    <div className="w-full py-8">
    <Container>
      <div className="flex flex-wrap">
        {
          posts.map((post) => (
            <div className="p-2 w-1/4" key={ post.$id }>
              <PostCard {...post} />
            </div>
          ))
        }
      </div>
    </Container>
  </div>
  )
}

export default Home