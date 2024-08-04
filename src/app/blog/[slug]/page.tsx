import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { cx } from 'react-twc';

import { Icon } from '@/components/atoms/icon';
import { OutlinedLinkButton } from '@/components/atoms/link-button';
import { MDX } from '@/components/ui/blog/mdx';
import { ShareButton } from '@/components/ui/blog/share-button';
import {
  allReadableBlogs,
  allReadableBlogsWithContent,
  type PartialBlog,
} from '@/utils/blog';
import { getDate } from '@/utils/date';
import { createMetadata } from '@/utils/metadata';

import { Header } from './header';
import { Hero } from './hero';
import { Reactions } from './reactions';
import type { BlogPostPageContext } from './types';

const blogPostStructuredData = (post?: PartialBlog): string => {
  if (!post) return '';
  const date = getDate(post.date) || new Date(post.date);
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    datePublished: date.toISOString(),
    dateModified: date.toISOString(),
    description: post.summary,
    image: `https://jahir.dev/blog/${post.slug}/opengraph-image`,
    url: `https://jahir.dev/blog/${post.slug}`,
    author: {
      '@type': 'Person',
      name: 'Jahir Fiquitiva',
      url: 'https://jahir.dev/about',
    },
  });
};

// This seems to cause this error:
// Error: Invariant: PPR lambda isn't streaming
// export const dynamicParams = false;

export default function BlogPostPage(context: BlogPostPageContext) {
  const { slug } = context.params;
  const post = allReadableBlogsWithContent.find((b) => b.slug === slug);
  if (!slug || !post) return notFound();
  if (post.link) return redirect(post.link);
  return (
    <>
      <Hero
        title={post.title}
        hero={post.hero}
        source={post.heroSource}
        heroMeta={post.heroMeta}
      />
      <Header post={post} />
      <MDX code={post.code} />
      <hr
        className={cx(
          'm-0 border-none h-px w-full bg-divider',
          '-my-6',
          '-mx-3 w-[calc(100%_+_1.5rem)]',
          'tablet-md:mx-0 tablet-md:w-full',
        )}
      />
      <div
        className={cx(
          'flex flex-col-reverse gap-8',
          'tablet-md:flex-row tablet-md:items-center',
          'justify-between tablet-md:gap-4',
        )}
      >
        <div className={'flex flex-row items-center gap-2.5 tablet-md:gap-3'}>
          <ShareButton title={'Share blog post'} slug={slug || ''} />
          <OutlinedLinkButton
            title={'Edit blog post'}
            href={`https://github.com/jahirfiquitiva/jahir.dev/edit/main/content/${slug}.mdx`}
            className={'pr-3.5'}
          >
            <Icon
              className={'size-5'}
              path={
                // eslint-disable-next-line max-len
                'M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z'
              }
            />
            <span>Edit on GitHub</span>
          </OutlinedLinkButton>
        </div>
        <Reactions slug={slug} />
      </div>
      <script type={'application/ld+json'} suppressHydrationWarning>
        {blogPostStructuredData(post)}
      </script>
    </>
  );
}

export const generateStaticParams = () =>
  allReadableBlogs
    .filter((post) => !post.link)
    .map((post) => ({ slug: post.slug }));

export function generateMetadata(
  context: BlogPostPageContext,
): Metadata | undefined {
  const { slug } = context.params;
  if (!slug) return undefined;
  const post = allReadableBlogsWithContent.find((b) => b.slug === slug);
  if (!post) return undefined;

  const { title, date, summary } = post;
  const metadata = createMetadata({
    title: `${title} | Blog – Jahir Fiquitiva`,
    description: summary || 'Blog post by Jahir Fiquitiva',
    exactUrl: `https://jahir.dev/blog/${slug}`,
    keywords: post.keywords,
  });
  return {
    ...metadata,
    openGraph: { ...metadata.openGraph, type: 'article', publishedTime: date },
  };
}
