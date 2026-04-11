import "./advice-details.css";
import { notFound } from "next/navigation";

import { blogPosts, getBlogPostBySlug } from "@/data/blog";
import Nav from "@/components/Nav/Nav";
import ConditionalFooter from "@/components/ConditionalFooter/ConditionalFooter";
import Copy from "@/components/Copy/Copy";

export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export const dynamicParams = false;

const AdviceDetailPage = async ({ params }) => {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <Nav />
      <div className="page advice-detail-page">
        <section className="advice-hero">
          <div className="container">
            <div className="advice-hero-meta">
              <p>{post.category}</p>
              <p>{post.readTime}</p>
              <p>{post.publishedAt}</p>
            </div>
            <Copy delay={1} animateOnScroll={false}>
              <h1>{post.title}</h1>
            </Copy>
            <Copy delay={1.05} animateOnScroll={false}>
              <p className="advice-excerpt">{post.excerpt}</p>
            </Copy>
          </div>
        </section>

        <section className="advice-content">
          <div className="container">
            <div className="advice-cover-image">
              <img src={post.thumbnail} alt={post.title} />
            </div>
            <article
              className="advice-article"
              dangerouslySetInnerHTML={{ __html: post.content }}
            ></article>
            <div className="advice-back-link">
              <a href="/advice">Back to Advice</a>
            </div>
          </div>
        </section>
      </div>
      <ConditionalFooter />
    </>
  );
};

export default AdviceDetailPage;
