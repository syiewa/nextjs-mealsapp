import { getMeal,getImageS3 } from "@/lib/meals";
import classes from "./page.module.css";
import Image from "next/image";
import { notFound } from "next/navigation";

interface Meal {
  title?: string;
  summary?: string;
  instructions?: string;
  image?: string;
  creator?: string;
  creator_email?: string;
}
import type { Metadata } from "next";

export async function generateMetadata({params}: {params:Promise<{slug:string}>}): Promise<Metadata> {
  const url = await params;
  const mealData:unknown = await getMeal(url.slug);
  const meal = mealData as Meal;
  return {
    title: meal.title,
    description: meal.summary,
  };
}

export default async function MealsDetailsPage({params}: {params:Promise<{slug:string}>} ) {
  const url = await params;
  const mealData:unknown = await getMeal(url.slug);
  const meal = mealData as Meal;
  
  if (!meal) {
    notFound();
  }

  const instructions = meal.instructions?.replace(/\n/g, "<br>") || "";
  const imageUrl = await getImageS3(meal.image || '');
  return (
    <>
      <header className={classes.header}>
        <div className={classes.image}>
          <Image src={imageUrl.toString()} alt={meal.title || ''} fill />
        </div>
        <div className={classes.headerText}>
          <h1>{meal.title}</h1>
          <p className={classes.creator}>
            by <a href={`mailto:${meal.creator_email}`}>{meal.creator}</a>
          </p>
          <p className={classes.summary}>{meal.summary}</p>
        </div>
      </header>
      <main>
        <p 
          className={classes.instructions} 
          dangerouslySetInnerHTML={{
            __html: instructions
          }}
        />
      </main>
    </>
  );
}
