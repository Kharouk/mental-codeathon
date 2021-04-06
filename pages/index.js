import fs from 'fs'
import matter from 'gray-matter'
import Layout from '../components/Layout';

export default function Home({ posts }) {
  return (
    <Layout>
      <div>
        {posts.map(({ frontmatter: { title, description, date, readTime } }) => (
          <article key={title}>
            <header>
              <h3 className="mb-1 text-3xl font-bold text-red-600">{title}</h3>
              <span className="block mb-2 text-sm italic">{date}</span>

            </header>
            <section>
              <p className="mb-3">{description}</p>
              <span className="block italic mb-8">{readTime} min. read</span>
            </section>
          </article>
        ))}
      </div>
    </Layout>
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