import React, { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from "react-redux"
import { useNavigate } from 'react-router-dom'
import appwriteService from '../../appwrite/config'
import Button from '../Button'
import Input from '../Input'
import RTE from '../RTE'
import Select from '../Select'

export default function PostForm() {
  const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
    defaultValues: {
      title: post?.title || '',
      slug: post?.slug || '',
      content: post?.content || '',
      status: post?.status || "active"
    }
  })

  const navigate = useNavigate()
  const useData = useSelector((state) => state.auth.useData)

  const submit = async (data) => {
    if (post) {
      const file = data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null;

      if (file) {
        await appwriteService.deleteFile(post.featuredImage)
      }

      const dbPost = await appwriteService.updatePost(post.$id, {
        ...data,
        featuredImage: file ? file.$id : undefined
      })

      if (dbPost) {
        navigate(`/post/${dbPost.$id}`)
      }
    } else {
      const file = await appwriteService.uploadFile(data.image[0])
      if (file) {
        const fileId = file.$id
        data.featuredImage = fileId
        const dbPost = await appwriteService.createPost({ ...data, userId: userData.$id })

        if (dbPost) {
          navigate(`/post/${dbPost.$id}`)
        }
      }
    }
  }

  const slugTransform = useCallback((value) => {
    // const slug = value.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase
    if (value && typeof value === 'string') {
      return value.trim().toLowerCase().replace(/[^a-zA-Z\d\s]+/g, '-').replace(/\s/g, "-")
    }
  }, [])

  React, useEffect(() => {
    watch((value, { name }) => {
      if (name === 'title') {
        setValue("slug", slugTransform(value.title), { shouldValidate: true })
      }
    })
  }, [watch, slugTransform, setValue])

  return (
    <form onSubmit={handleSubmit(submit)}
      className='flex flex-wrap'
    >
      <div className="w-2/3 px-2">
        <Input
          label="Title"
          placeholder="Title"
          className="mb-4"
          {...register("title", { required: true })}
        />
        <Input
          label="slug: "
          placeholder="slug"
          className="mb-4"
          {...register("slug", { required: true })}
          onInput={() => {
            setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true })
          }}
        />
        <RTE
          label="Content: "
          name='content'
          control={control}
          defaultValue={getValues("content")}
        />
      </div>
      <div className="1/3 px-2">
        <input
          label="Featured Image"
          type='file'
          className='mb-4'
          accept='image/png, image/jpg, image/jpeg'
          {...register("image", { required: { post } })}
        />
        {post && (
          <div className="w-full mb-4">
            <img src={appwriteService.getFilePreview(post.featuredImage)} alt={post.title}
              className='rounded-lg'
            />
          </div>
        )}
        <Select
          options={["active", "inactive"]}
          label="Status"
          className="mb-4"
          {...register("status", { required: true })}
        />
        <Button
          type='submit'
          bgColor={post ? "bg-green-500" : "bg-gray-200"}
          className='w-full'
        >
          {post ? "Update" : "Submit"}
        </Button>
      </div>
    </form>
  )
}