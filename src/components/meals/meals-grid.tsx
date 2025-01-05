import classes from "./meals-grid.module.css";
import MealItem from "./meals-items";

const MealsGrid = ({meals}: {meals: Array<{ id: string; title: string; image: string; summary: string;creator:string ;slug: string }>}) => {
  return (
    <ul className={classes.meals}>
      {meals.map((meal) => (
        <li key={meal.id}>
          <MealItem {...meal} />
        </li>
      ))}
    </ul>
  );
}

export default MealsGrid;