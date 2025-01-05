import classes from './loading.module.css';

export default function Loading() {
  return (
    <p className={classes.loading}>Fetching Meals..</p>
  );
}