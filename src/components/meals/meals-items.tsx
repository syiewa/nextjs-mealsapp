import Link from 'next/link';
import Image from 'next/image';

import classes from './meals-items.module.css';
import { getImageS3 } from '@/lib/meals';

export default async function MealItem({ title, slug, image, summary, creator }: { title: string; slug: string; image: string; summary: string; creator: string }) {
   const imageUrl = await getImageS3(image || '')
  return (
    <article className={classes.meal}>
      <header>
        <div className={classes.image}>
          <Image src={imageUrl.toString()}  alt={title} fill />
        </div>
        <div className={classes.headerText}>
          <h2>{title}</h2>
          <p>by {creator}</p>
        </div>
      </header>
      <div className={classes.content}>
        <p className={classes.summary}>{summary}</p>
        <div className={classes.actions}>
          <Link href={`/meals/${slug}`}>View Details</Link>
        </div>
      </div>
    </article>
  );
}