import React from "react";
import styles from "./lightbulb.module.css";

type BlinkingEyesSVGProps = {
  isRedPlayer: boolean;
  OnMove: boolean;
};

const BlinkingEyesSVG: React.FC<BlinkingEyesSVGProps> = ({
  isRedPlayer,
  OnMove,
}) => {
  return (
    <div
      className={`${styles["blinking-eyes"]} ${
        !isRedPlayer ? `${styles.BluePlayer}` : `${styles.RedPlayer}`
      } }`}
    >
      <svg
        width="275"
        height="195"
        viewBox="0 0 120 130"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="zarovka" clipPath="url(#clip0_667_85)">
          <g id="cervenaZarovka 1" clipPath="url(#clip1_667_85)">
            <path
              id="Vector"
              d="M8.4677 76.9515L4.39789 78.769C1.67346 79.9806 0.462611 83.1781 1.67346 85.9043C2.5816 87.9237 4.53243 89.1017 6.61779 89.1017C7.35775 89.1017 8.09772 88.9671 8.80405 88.6305L12.8738 86.813C15.5983 85.6014 16.8091 82.4039 15.5983 79.6777C14.3874 76.9515 11.1921 75.7062 8.4677 76.9515Z"
            />
            <path
              id="Vector_2"
              d="M3.456 44.0686L7.62672 45.6504C8.26578 45.886 8.90485 46.0207 9.54391 46.0207C11.7302 46.0207 13.7483 44.708 14.5891 42.554C15.6655 39.7605 14.2528 36.6304 11.4947 35.587L7.32401 34.0051C4.56595 32.9617 1.43791 34.3417 0.361593 37.1016C-0.714723 39.8614 0.697941 43.0252 3.456 44.0686Z"
            />
            <path
              id="Vector_3"
              d="M33.021 12.8349C33.9291 14.8543 35.88 16.0323 37.9653 16.0323C38.7053 16.0323 39.4453 15.8977 40.1516 15.5611C42.876 14.3494 44.0869 11.152 42.876 8.4258L41.0597 4.3533C39.8489 1.62708 36.6536 0.415431 33.9291 1.62708C31.2047 2.83873 29.9939 6.03615 31.2047 8.76237L33.021 12.8349Z"
            />
            <path
              id="Vector_4"
              d="M77.2509 14.585C77.89 14.8206 78.5291 14.9553 79.1681 14.9553C81.3544 14.9553 83.3725 13.6427 84.2133 11.4886L85.7942 7.31513C86.8705 4.5216 85.4578 1.3915 82.6998 0.348129C79.9417 -0.695238 76.78 0.684699 75.7374 3.44457L74.1565 7.61804C73.0802 10.4116 74.4929 13.5417 77.2509 14.585Z"
            />
            <path
              id="Vector_5"
              d="M109.17 43.3281C109.91 43.3281 110.65 43.1935 111.357 42.8569L115.426 41.0395C118.151 39.8278 119.362 36.6304 118.151 33.9042C116.94 31.178 113.778 29.9326 111.02 31.178L106.95 32.9954C104.226 34.2071 103.015 37.4045 104.226 40.1307C105.101 42.1501 107.085 43.3281 109.17 43.3281Z"
            />
            <path
              id="Vector_6"
              d="M116.335 75.7735L112.164 74.1916C109.406 73.1146 106.244 74.5282 105.201 77.288C104.125 80.0816 105.538 83.2117 108.296 84.2551L112.467 85.8369C113.106 86.0725 113.745 86.2072 114.384 86.2072C116.57 86.2072 118.588 84.8945 119.429 82.7405C120.505 79.947 119.093 76.8169 116.335 75.7735Z"
            />
            <path
              id="Vector_7"
              d="M81.7244 93.9819H34.8711V110.07H81.7244V93.9819Z"
            />
            <path
              id="Vector_8"
              d="M58.3147 129.053C66.2525 129.053 72.6768 122.624 72.6768 114.681H43.9526C43.9526 122.624 50.3769 129.053 58.3147 129.053Z"
            />
            <path
              id="Union"
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M30.1286 87.0822C14.5893 71.5327 14.5893 46.2226 30.1286 30.6731C45.197 15.5947 71.4322 15.5947 86.5006 30.6731C94.0348 38.2122 98.1719 48.2084 98.1719 58.8777C98.1719 69.5469 94.0348 79.5431 86.5006 87.0822L84.9198 88.6641H31.7094L30.1286 87.0822Z"
            />
            <path
              className={`${styles.oko1} ${!OnMove ? `${styles.paused}` : ""}`}
              fillRule="evenodd"
              clipRule="evenodd"
              d="M62.0005 54.6101C62.0109 59.8812 62.0121 62.5842 62.0121 62.5842C61.9875 67.8767 63.0001 72.237 67.9913 72.237C73.0001 72.237 74.0113 67.8962 74.0009 62.6251C74.0009 62.6251 73.9893 59.972 73.9893 54.6511C73.9893 49.3302 73.0002 45 68.0105 45C63.0002 45 61.9902 49.3391 62.0005 54.6101Z"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              className={`${styles.oko2} ${!OnMove ? `${styles.paused}` : ""}`}
              d="M42 54.6101C42.0104 59.8812 42.0116 62.5842 42.0116 62.5842C41.987 67.8767 42.9996 72.237 47.9908 72.237C52.9996 72.237 54.0108 67.8962 54.0005 62.6251C54.0005 62.6251 53.9888 59.972 53.9888 54.6511C53.9888 49.3302 52.9997 45 48.01 45C42.9997 45 41.9897 49.3391 42 54.6101Z"
            />
          </g>
        </g>
        <defs>
          <clipPath id="clip0_667_85">
            <rect width="120" height="130" fill="white" />
          </clipPath>
          <clipPath id="clip1_667_85">
            <rect width="120" height="130" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
};

export default BlinkingEyesSVG;
