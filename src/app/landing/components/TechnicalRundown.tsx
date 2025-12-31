"use client";

import React, { useState, useEffect } from 'react';

// Sparkle/Star animated icon (simplified Lottie replacement)
const AnimatedSparkleIcon: React.FC = () => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 15) % 360);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="w-12 h-12 flex items-center justify-center"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M24 4L26.5 18.5L41 24L26.5 29.5L24 44L21.5 29.5L7 24L21.5 18.5L24 4Z"
          fill="#d97757"
          stroke="#d97757"
          strokeWidth="2"
        />
        <circle cx="24" cy="24" r="3" fill="#141413" />
      </svg>
    </div>
  );
};

// Decorative pictogram SVG for cards
const PictogramSvg: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    viewBox="0 0 1000 1000"
    fill="none"
    className={className}
  >
    <path
      d="M475.811 61.5993C487.174 68.4679 495.382 84.9634 494.846 98.2224C494.112 116.594 484.544 135.443 468.41 144.16C456.63 150.523 451.86 150.376 441.63 160.628C440.986 161.271 439.925 161.29 439.372 161.979C435.835 166.411 434.873 182.695 433.921 188.396C432.47 197.021 429.142 204.147 426.865 212.202C425.949 215.438 421.995 229.267 422.05 231.539C422.15 236.384 427.464 236.504 431.191 238.361C446.173 245.837 466.216 262.553 473.743 277.945C475.049 280.611 475.584 285.521 477.47 287.701C478.259 288.602 483.474 291.562 484.653 291.673C487.111 291.912 496.062 290.257 499.472 289.88C506.963 289.043 514.798 288.685 522.298 287.646C531.494 286.367 539.393 282.726 548.217 280.621C575.406 274.12 603.901 272.042 631.607 267.877C636.994 267.067 643.36 267.297 648.675 265.624C649.663 265.311 651.858 263.868 652.638 263.123C658.641 257.348 660.718 249.248 664.563 242.131C668.926 234.058 679.609 220.21 687.97 216.735C706.879 208.864 727.475 214.096 742.176 228.008C748.86 234.334 752.687 246.37 752.959 255.555C754.31 301.042 722.315 330.852 680.362 303.157C674.675 299.406 668.88 295.057 663.53 291.14C662.432 290.34 657.889 285.457 657.345 285.42C653.617 286.505 649.699 287.287 645.863 287.839C611.383 292.795 578 296.767 543.774 305.189C527.613 309.161 509.928 311.8 494.13 317.041C479.819 321.777 481.887 326.291 477.833 338.622C472.21 355.706 462.534 370.721 450.563 383.658C446.037 388.55 428.226 399.436 421.723 400.595C420.553 400.807 419.574 400.172 418.939 400.301C418.359 400.411 417.706 401.551 416.717 401.892C413.924 402.848 403.685 404.714 400.438 405.045C397.654 405.33 393.999 404.484 391.252 404.733C388.676 404.963 375.381 407.739 373.313 408.622C372.134 409.128 366.593 415.84 365.541 417.339C354.658 432.749 347.648 449.125 338.842 465.437C332.439 477.289 322.327 490.144 314.836 501.757C305.804 515.742 295.728 528.983 287.901 543.649C282.832 553.138 278.56 563.39 273.563 572.704C265.438 587.848 252.197 599.562 264.077 617.171C264.431 617.695 265.474 617.584 265.637 617.823C275.051 631.496 275.831 662.887 270.806 678.169C264.748 696.596 245.223 715.712 225.407 716.852C193.167 718.719 165.516 702.931 157.68 669.82C150.778 640.673 164.618 603.673 192.142 590.901C200.431 587.048 205.229 586.653 214.552 587.683C217 587.958 223.358 589.77 224.845 589.54C226.024 589.356 234.476 584.584 235.329 583.582C236.952 581.669 238.729 576.676 240.38 574.148C244.37 568.061 248.778 562.277 252.741 556.098C276.91 518.455 299.51 479.413 323.561 441.439C328.222 434.083 337.491 421.017 340.665 413.661C343.231 407.712 343.068 394.021 341.708 387.64C339.404 376.799 329.329 366.887 323.216 357.765C316.333 347.495 313.077 325.308 310.501 312.499C309.44 307.231 309.957 300.601 307.246 296.27C302.911 289.31 283.249 286.561 275.468 284.363C250.456 277.292 227.239 271.03 202.707 262.36C188.977 257.505 164.944 247.105 151.259 247.289C150.234 247.299 146.235 247.979 145.464 248.356C143.723 249.22 139.524 256.07 137.901 257.863C122.266 275.168 94.7141 273.485 75.3064 263.629C64.3783 258.084 54.8559 245.837 54.5476 233.037C54.4569 229.231 54.2573 226.757 54.0578 223.015C52.7972 199.752 72.2865 161.014 98.8042 162.145C107.837 162.531 127.299 165.621 134.781 170.172C135.66 170.705 143.505 179.477 143.922 180.323C148.121 188.764 152.175 197.867 153.889 207.577C154.968 213.682 154.152 219.475 159.095 224.606C164.554 230.279 169.27 229.552 176.126 231.658C184.733 234.288 193.448 237.653 202.073 240.458C233.714 250.747 267.786 261.707 300.281 268.759C301.741 269.072 312.17 270.718 312.832 270.617C313.812 270.46 317.829 268.051 318.881 267.316C327.252 261.44 329.864 256.549 336.103 249.183C343.948 239.924 359.438 230.72 371.527 229.442C376.841 228.881 383.688 230.187 388.585 229.185C391.161 228.661 395.46 223.751 398.398 222.086C399.613 221.397 401.472 221.801 402.225 220.45C404.529 209.434 409.417 198.529 411.956 187.707C412.863 183.863 412.981 179.496 413.915 175.661C416.155 166.513 421.433 160.122 419.365 150.109C417.298 140.096 405.109 138.992 400.321 130.331C394.29 119.435 391.487 106.231 393.011 93.8457C395.423 74.279 405.163 58.5926 424.444 52.5148C426.321 51.9263 433.522 50.1333 435.336 50.023C443.598 49.5265 468.474 57.1858 475.82 61.6269L475.811 61.5993Z"
      fill="var(--heroes-accent, #d97757)"
    />
    <path
      d="M369 321.219C371.041 320.033 369.027 317.735 369.753 315.997C370.597 313.957 373.209 312.146 374.607 310.822C374.861 310.583 374.688 309.664 375.115 309.287C375.423 309.02 381.111 308.009 381.864 308C389.467 307.963 412.519 320.787 420.067 324.822C453.026 342.416 485.795 362.263 518.817 379.903C556.993 400.292 596.185 418.566 635.122 436.951C666.14 451.585 696.604 467.001 726.805 482.904C739.606 489.642 751.989 500.581 765.198 504.929C775.849 508.431 780.657 510.168 790.764 515.325C818.57 529.509 846.149 545.302 874.209 559.044C889.877 566.72 908.103 571.932 923.68 579.58C926.619 581.023 937.197 586.989 938.993 589.085C939.783 590.004 939.211 591.061 939.728 591.677C940.908 593.084 945.326 593.792 946.732 597.055C947.431 598.673 946.56 600.741 948.728 601.44L949 606.44C947.077 606.247 948.637 608.453 947.948 609.547C947.657 609.998 946.587 609.943 946.378 610.246C945.906 610.945 944.546 614.796 943.929 615.191C943.784 615.283 941.869 615.026 940.481 615.605C937.397 616.892 933.369 620.486 930.838 621.663C929.812 622.141 928.942 621.507 928.606 621.709C928.424 621.819 928.452 622.83 927.762 623.088C922.446 625.055 916.504 626.011 911.224 627.132C888.498 631.968 875.488 639.423 855.067 648.882C840.27 655.739 824.621 661.971 809.471 668.526C805.025 670.447 799.264 673.388 793.73 674.685C788.196 675.981 782.372 675.448 777.509 679.005C781.274 681.487 783.57 686.193 786.509 689.54C793.848 697.895 802.394 705.387 809.552 713.909C826.372 733.92 841.559 755.467 858.387 775.553C871.751 791.492 902.66 817.305 903.975 838.438C904.138 841.113 901.144 848.448 899.003 850.011C895.311 852.723 889.251 855.352 884.787 858.413C877.076 863.699 865.055 870.4 858.206 875.833C852.327 880.493 845.968 886.817 840.116 891.763C839.009 892.701 837.213 892.958 836.061 894.272C834.591 895.936 834.528 896.653 832.559 898.694C819.649 912.069 799.219 928.376 782.454 936.502C774.878 940.17 766.668 942.689 759.365 946.724L754.421 947C750.756 944.343 748.079 942.634 745.349 938.938C729.291 917.18 717.869 891.91 702.065 869.986C694.554 859.562 685.318 850.379 677.571 840.331C665.387 824.53 655.58 807.414 644.094 791.106C643.305 791.152 634.877 801.475 633.535 802.918C624.344 812.828 614.601 823.142 606.563 834.108C588.836 858.266 579.392 891.423 553.645 908.355C548.991 913.981 542.378 924.148 533.877 922.098C532.843 921.85 524.623 917.658 523.58 916.748C516.459 910.543 516.649 903.354 514.581 895.063C501.381 842.216 486.085 789.553 474.908 736.007C473.965 731.475 473.947 726.714 473.021 722.2C464.865 682.397 451.393 644.166 441.06 604.868C429.865 562.317 421.718 518.855 409.453 476.515C402.576 452.799 395.509 431.353 390.102 407.057C384.332 381.135 375.895 355.718 370.824 329.547C370.579 328.26 369.944 326.357 369.227 325.245L369.009 321.246L369 321.219Z"
      fill="currentColor"
    />
  </svg>
);

// Arrow icon for card hover
const ArrowIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M3 8H13M13 8L8 3M13 8L8 13"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

interface ResourceCard {
  title: string;
  tag: 'Developer docs' | 'Blog' | 'Case study';
  href: string;
}

const resourceCards: ResourceCard[] = [
  {
    title: 'Claude Code documentation',
    tag: 'Developer docs',
    href: 'https://code.claude.com/docs/en/overview',
  },
  {
    title: 'Common workflows',
    tag: 'Developer docs',
    href: 'https://code.claude.com/docs/en/common-workflows',
  },
  {
    title: 'Using CLAUDE.md files: Customizing Claude Code for your codebase',
    tag: 'Blog',
    href: 'https://claude.com/blog/using-claude-md-files',
  },
  {
    title: 'Introduction to agentic coding',
    tag: 'Blog',
    href: 'https://claude.com/blog/introduction-to-agentic-coding',
  },
  {
    title: 'How Anthropic teams use Claude Code',
    tag: 'Case study',
    href: 'https://www.anthropic.com/news/how-anthropic-teams-use-claude-code',
  },
  {
    title: 'Fix software bugs faster with Claude',
    tag: 'Blog',
    href: 'https://claude.com/blog/fix-software-bugs-faster-with-claude',
  },
];

const ResourceCardComponent: React.FC<{ card: ResourceCard; index: number }> = ({ card, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href={card.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group block relative bg-white rounded-[24px] border border-[#f0eee6] p-8 transition-all duration-300 hover:shadow-[0px_4px_20px_rgba(0,0,0,0.04)]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        minHeight: '180px',
      }}
    >
      {/* Pictogram background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-[24px] pointer-events-none">
        <div
          className="absolute -top-4 -left-4 w-24 h-24 opacity-10 transition-opacity duration-300 group-hover:opacity-20"
          style={{ color: '#d97757' }}
        >
          <PictogramSvg />
        </div>
      </div>

      {/* Content */}
      <div className="relative flex flex-col h-full justify-between gap-4">
        {/* Title */}
        <h3
          className="text-[17px] leading-[27.2px] text-[#141413] transition-colors duration-200"
          style={{ fontFamily: '"Anthropic Serif", Georgia, sans-serif' }}
        >
          {card.title}
        </h3>

        {/* Tag and Arrow */}
        <div className="flex items-center justify-between mt-auto">
          <span
            className="text-[12px] text-[#5e5d59]"
            style={{ fontFamily: '"Anthropic Sans", Arial, sans-serif' }}
          >
            {card.tag}
          </span>

          <div
            className={`transition-all duration-200 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}
          >
            <ArrowIcon className="w-4 h-4 text-[#141413]" />
          </div>
        </div>
      </div>
    </a>
  );
};

const TechnicalRundown: React.FC = () => {
  return (
    <section
      className="w-full py-20 px-6"
      style={{
        backgroundColor: '#faf9f5',
        fontFamily: '"Anthropic Sans", Arial, sans-serif',
      }}
    >
      <div className="max-w-[960px] mx-auto">
        {/* Header with animated icon */}
        <div className="flex flex-col items-center justify-center mb-12">
          <AnimatedSparkleIcon />

          <h2
            className="text-center mt-4"
            style={{
              fontFamily: '"Anthropic Serif", Georgia, sans-serif',
              fontSize: '48px',
              fontWeight: 500,
              lineHeight: '57.77px',
              color: '#141413',
              maxWidth: '30ch',
            }}
          >
            Get the technical rundown
          </h2>
        </div>

        {/* Cards Grid */}
        <div
          className="grid gap-8"
          style={{
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          }}
        >
          {resourceCards.map((card, index) => (
            <ResourceCardComponent key={index} card={card} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechnicalRundown;
