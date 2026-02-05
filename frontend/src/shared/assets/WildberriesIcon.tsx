import type { IIcon } from "./types";

function WildberriesIcon({ width, height, className }: IIcon) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 146 146"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect
        width="146"
        height="146"
        rx="24"
        fill="url(#paint0_linear_379_460)"
      />
      <path
        d="M106.385 58.8387C101.615 58.8387 97.298 60.268 93.6207 62.7296V40.3237H83.4414V81.6151C83.4414 94.1745 93.7273 104.286 106.318 104.286C118.909 104.286 129.315 94.2407 129.315 81.496C129.328 68.7645 119.149 58.8387 106.385 58.8387ZM60.1917 84.5399L50.8784 60.44H43.7503L34.3837 84.5399L25.0039 60.44H13.9053L30.2934 102.817H37.4215L47.2544 77.5786L57.1405 102.817H64.2687L80.6035 60.44H69.5582L60.1917 84.5399ZM106.331 94.1878C99.4298 94.1878 93.6207 88.7087 93.6207 81.5621C93.6207 74.4156 99.0834 69.0027 106.385 69.0027C113.686 69.0027 119.149 74.6538 119.149 81.5621C119.149 88.4837 113.34 94.1878 106.331 94.1878Z"
        fill="white"
      />
      <defs>
        <linearGradient
          id="paint0_linear_379_460"
          x1="3.94762e-07"
          y1="146"
          x2="146"
          y2="3.94762e-07"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#7504F9" />
          <stop offset="1" stop-color="#F845D8" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default WildberriesIcon;
