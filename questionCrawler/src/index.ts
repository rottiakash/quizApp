import * as a from "axios";
let axios = a.default;
const url: string = "";

axios
  .get(
    "https://opentdb.com/api.php?amount=10&category=18&difficulty=medium&type=multiple"
  )
  .then((data) => console.log(data.data));
