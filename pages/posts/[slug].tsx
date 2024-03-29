import fs from 'fs'
import { join } from 'path'
const POSTS_PATH = join(process.cwd(), 'content/posts')
const PUBLIC_PATH = join(process.cwd(), 'public')
import Postcard from '../../components/postcard'
import Link from 'next/link'
import Meta from '../../components/meta'
import * as siteSettings from '../../content/settings.yaml'
import sizeOf from 'image-size'
import StampCta from '../../components/StampCta'

interface PageInfo {
  title: string
  slug: string
}
interface PostProps {
  attributes: any
  html: string
  current: PageInfo
  next: PageInfo
  prev: PageInfo
}
export default function Post(props: PostProps) {
  const { attributes, html, current, next, prev } = props
  const { title, description, date, author, collection, metaImage } = attributes

  return (
    <>
      <Meta
        title={title}
        description={description}
        image={metaImage}
        url={`${siteSettings.url}/posts/${current.slug}`}
      />
      <article className='container max-w-5xl px-3 md:px-6 my-10'>
        <header className='prose lg:prose-xl pb-5 mb-5 border-b border-gray-100 text-center mx-auto'>
          <h1 className='font-serif font-bold text-5xl'>{title}</h1>
          <p>{description}</p>
          <p className=' text-base leading-6 font-medium text-gray-500'>
            <time>
              {' '}
              {new Date(date).toDateString()} by <a>{author}</a>{' '}
            </time>
          </p>
          {!!collection && (
            <StampCta
              href={`/collections/${collection}`}
              className='flex-1 md:flex-initial'
            >
              Visit collection: {collection}
            </StampCta>
          )}
        </header>
        <Postcard className='md:mx-auto' {...attributes} />
        {html && (
          <div
            className='prose lg:prose-xl my-10'
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )}

        {!!(next || prev) && (
          <ul className='flex justify-between flex-wrap my-10'>
            {!!prev?.slug && (
              <li>
                <StampCta href={prev.slug}>&#8592; {prev.title}</StampCta>
              </li>
            )}
            {!!next?.slug && (
              <li className='ml-auto'>
                <StampCta href={next.slug}>{next.title} &#8594;</StampCta>
              </li>
            )}
          </ul>
        )}
      </article>
    </>
  )
}
export async function getStaticProps(context: any) {
  const { slug } = context.params

  // Get data for next/prev links
  const paths = fs
    .readdirSync(POSTS_PATH)
    // Remove file extensions for page paths
    .map((path) => path.replace(/\.mdx?$/, ''))
    // Map the path into the static paths object required by Next.js
    .map((slug) => ({ params: { slug } }))
  // Load post front matter attributes from paths
  const posts = paths.map(({ params }: { params: any }) => {
    const { slug } = params
    const markdown = require(`/content/posts/${slug}.md`)
    const { attributes } = markdown
    return { slug, attributes }
  })
  // Sort by most recent
  posts.sort((itemA: any, itemB: any) => {
    const dateA = new Date(itemA.attributes.date).getTime()
    const dateB = new Date(itemB.attributes.date).getTime()
    return dateB - dateA
  })
  const postIndex: any = posts.findIndex((post) => post.slug === slug)
  const current = {
    title: posts[postIndex]?.attributes.title || null,
    slug: posts[postIndex]?.slug || null,
  }
  const next = {
    title: posts[postIndex - 1]?.attributes.title || null,
    slug: posts[postIndex - 1]?.slug || null,
  }
  const prev = {
    title: posts[postIndex + 1]?.attributes.title || null,
    slug: posts[postIndex + 1]?.slug || null,
  }

  // Get post data and image dimensions
  const markdown = require(`/content/posts/${slug}.md`)
  const { attributes, html } = markdown
  const imagePath = `${PUBLIC_PATH}/${attributes.image}`
  const imageDimensions = sizeOf(imagePath)

  attributes.width = imageDimensions.width
  attributes.height = imageDimensions.height

  const stampDimensions = sizeOf(`${PUBLIC_PATH}/${attributes.stamp}`)
  attributes.stampWidth = stampDimensions.width
  attributes.stampHeight = stampDimensions.height

  if (!markdown) {
    return {
      notFound: true,
    }
  }
  return {
    props: { slug, attributes, html, current, next, prev }, // will be passed to the page component as props
  }
}
export async function getStaticPaths(args: any) {
  // Get paths
  const paths = fs
    .readdirSync(POSTS_PATH)
    // Remove file extensions for page paths
    .map((path) => path.replace(/\.mdx?$/, ''))
    // Map the path into the static paths object required by Next.js
    .map((slug) => ({ params: { slug } }))
  return {
    paths: paths,
    fallback: false,
  }
}
