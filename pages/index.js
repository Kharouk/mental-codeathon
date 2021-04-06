import fs from 'fs'
import matter from 'gray-matter'

export default function Home({ posts }) {
  return (
    <div>
      {posts.map(({ frontmatter: { title, description, date, readTime } }) => (
        <article key={title}>
          <header>
            <h3>{title}</h3>
            <span>{date}</span>
            <section>
              <p>{description}</p>
              <span>{readTime}</span>
            </section>
          </header>
        </article>
      ))}
    </div>
  )
}

export async function getStaticProps() {
  const files = fs.readdirSync(`${process.cwd()}/pages/blog`)

  const posts = files.map((filename) => {
    const markdownWithMetadata = fs.readFileSync(`pages/blog/${filename}`).toString();
    const { data } = matter(markdownWithMetadata)

    // Convert post date to format: Month day, Year
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = data.date.toLocaleDateString("en-US", options);

    const frontmatter = {
      ...data,
      date: formattedDate,
    };

    return {
      slug: filename.replace(".md", ""),
      frontmatter,
    };
  });

  return {
    props: {
      posts,
    },
  };
}