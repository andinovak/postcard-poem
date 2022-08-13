export default function Posts(props: any) {
  const { attributes, html } = props
  const { title } = attributes
  return (
    <>
      <div className='container max-w-3xl my-10 px-6'>
        <h1 className='font-serif font-bold text-5xl'>{title}</h1>
        {html && (
          <div
            className='prose lg:prose-xl my-10'
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )}
      </div>
    </>
  )
}

export async function getStaticProps() {
  // Get about data
  const markdown = require(`/content/about.md`)
  const { attributes, html } = markdown
  if (!markdown) {
    return {
      notFound: true,
    }
  }
  console.log(markdown)
  return {
    props: { attributes, html }, // will be passed to the page component as props
  }
}
