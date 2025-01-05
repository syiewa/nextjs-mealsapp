/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import classes from "./page.module.css";
import MealsGrid from "@/components/meals/meals-grid";
import { getMeals } from "@/lib/meals";
import { Suspense } from "react";
import type { Metadata } from "next";
import { revalidatePath } from "next/cache";

export const metadata: Metadata = {
  title: "All Meals",
  description: "Browse all available meals",
};

async function Meals() {
  const meals:any = await getMeals();
  revalidatePath("/meals");
  return <MealsGrid meals={meals} />;
}

export default function MealsPage() {
  return (
    <>
      <header className={classes.header}>
        <h1>
          Delicious Meals, created{" "}
          <span className={classes.highlight}>by you</span>
        </h1>
        <p>
          Choose your favorite meal from our broad selection of available meals
        </p>
        <p className={classes.cta}>
          <Link href="/meals/share" className={classes.btn}>
            Share Your Favorite Recipe
          </Link>
        </p>
      </header>
      <main className={classes.main}>
        <Suspense fallback={<p>Loading...</p>}>
          <Meals />
        </Suspense>
      </main>
    </>
  );
}
