import cx from "classix";

interface ILoader {
  size?: number;
  className?: string;
}

function Loader({ size = 7, className = "" }: ILoader) {
  const cls = cx(
    `border-3 border-font-secondary border-t-font-primary animate-spin rounded-full`,
    className,
  );

  return (
    <div
      className={cls}
      style={{
        width: `${size * 0.25}rem`,
        height: `${size * 0.25}rem`,
      }}
    ></div>
  );
}

export default Loader;
