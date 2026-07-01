import { Link } from "react-router";

export const Landing = () => {
  return (
    <div className="">
      <div>
        <span className="">English → Japanese</span>

        <h1 className="">
          Learn Japanese with lessons, kana practice and flashcards.
        </h1>

        <p className="">
          NihonGo! helps English speakers study Japanese through JLPT modules,
          guided lessons, exercises, kanji training and review cards.
        </p>

        <div className="">
          <Link to="/register" className="">
            Start learning
          </Link>

          <Link to="/login" className="">
            Log in
          </Link>
        </div>
      </div>

      <div className="">
        <div className="">日本語</div>
      </div>
    </div>
  );
};
