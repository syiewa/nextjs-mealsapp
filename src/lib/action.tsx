"use server";

import { redirect } from "next/navigation";
import { saveMeal } from "./meals";
import { revalidatePath } from "next/cache";

function isInvalidText(text: string) {
  return !text || text.trim() === "";
}
export async function shareMeal(prevState: { message?: string }, formdata: FormData) {
  const meal = {
    title: formdata.get("title") as string,
    summary: formdata.get("summary") as string,
    instructions: formdata.get("instructions") as string,
    image: formdata.get("image") as File,
    creator: formdata.get("name") as string,
    creator_email: formdata.get("email") as string,
  };
  if (
    isInvalidText(meal.title) ||
    isInvalidText(meal.summary) ||
    isInvalidText(meal.instructions) ||
    isInvalidText(meal.creator) ||
    isInvalidText(meal.creator_email) || 
    !meal.creator_email.includes("@") ||
    !meal.image || meal.image.size === 0
  ) {
    return {
      message : 'Invalid Input.'
    };
  }
  await saveMeal(meal);
  revalidatePath('/meals');
  redirect("/meals");
}