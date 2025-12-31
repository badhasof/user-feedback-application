"use client";

import React, { useState } from 'react';

// Pictogram SVG - Desktop/code window illustration
const PictogramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 500 500" fill="none">
    <path d="M441.32 147.072H58.3203V420.072H441.32V147.072Z" fill="#d97757" />
    <path d="M64.65 96.9438C64.65 106.474 63.7401 106.474 63.7401 115.994C63.7401 125.514 63.13 125.524 63.13 135.044C63.13 144.564 64.65 144.574 64.65 154.104C64.65 163.634 63.79 163.634 63.79 173.164C63.79 182.694 64.7201 182.694 64.7201 192.224C64.7201 201.754 63.5701 201.754 63.5701 211.284C63.5701 220.814 64.77 220.814 64.77 230.334C64.7567 236.687 64.7468 243.037 64.7401 249.384C64.7401 258.914 63.55 258.914 63.55 268.434C63.55 277.954 64.75 277.964 64.75 287.494C64.75 297.024 64.03 297.024 64.03 306.554C64.03 316.084 64.64 316.084 64.64 325.614C64.64 335.144 64.17 335.144 64.17 344.674C64.17 354.204 63.4701 354.204 63.4701 363.734C63.4701 373.264 63.25 373.264 63.25 382.794C63.25 392.324 63.7201 392.324 63.7201 401.854C63.7201 404.234 63.69 406.024 63.65 407.514C63.62 408.254 63.6001 408.924 63.5801 409.564C63.5701 409.884 63.55 410.184 63.54 410.494V410.774C63.54 410.774 63.52 410.864 63.51 410.914C63.5 411.274 63.55 411.644 63.79 412.064C64.02 412.474 64.5 412.934 65.26 413.094C65.36 413.094 65.45 413.134 65.54 413.124H65.6801C65.6801 413.124 65.92 413.134 66.02 413.134C66.55 413.134 67.04 413.134 67.5 413.134C68.43 413.124 69.2501 413.114 69.9901 413.104C71.4801 413.064 72.6701 413.034 73.8601 412.994C76.2401 412.914 78.63 412.834 83.39 412.864C92.92 412.914 92.9201 412.594 102.45 412.644C111.98 412.694 111.98 412.084 121.51 412.144C131.04 412.194 131.04 412.374 140.57 412.424C150.1 412.474 150.1 413.304 159.63 413.354C165.983 413.394 172.337 413.43 178.69 413.464C188.22 413.514 188.22 413.974 197.75 414.024C207.28 414.074 207.29 412.784 216.82 412.834C226.35 412.884 226.35 413.154 235.88 413.204C245.41 413.254 245.42 412.644 254.95 412.694C264.48 412.744 264.48 412.934 274.01 412.984C283.54 413.034 283.53 414.084 293.06 414.134C302.59 414.184 302.6 413.424 312.13 413.484C321.66 413.534 321.67 413.234 331.2 413.294C340.73 413.344 340.73 413.644 350.26 413.704C356.613 413.704 362.967 413.7 369.32 413.694C378.85 413.744 378.85 414.994 388.38 415.054C397.91 415.104 397.91 414.804 407.45 414.864C416.98 414.914 416.98 414.464 426.52 414.524C427.71 414.524 428.75 414.534 429.69 414.544C430.16 414.544 430.59 414.544 431.01 414.544H431.32C431.38 414.544 431.38 414.544 431.41 414.544C431.46 414.544 431.51 414.544 431.55 414.544C431.9 414.494 432.16 414.384 432.38 414.204C432.61 414.044 432.79 413.804 432.94 413.494C433.01 413.334 433.05 413.154 433.07 412.934V412.844C433.09 412.724 433.09 412.604 433.1 412.484C433.1 412.234 433.12 411.984 433.12 411.724C433.14 411.194 433.15 410.644 433.17 410.044L433.72 391.004C434.03 381.484 433.69 381.474 434 371.964C434.247 365.617 434.493 359.274 434.74 352.934C434.987 346.594 435.16 340.247 435.26 333.894C435.41 329.134 435.64 326.754 435.86 324.384C436.06 322.004 436.38 319.634 436.34 314.864C436.34 308.51 436.34 302.157 436.34 295.804C436.34 286.274 435.33 286.264 435.33 276.734C435.33 267.204 435.54 267.204 435.54 257.674C435.54 248.154 436.42 248.164 436.42 238.634C436.38 232.287 436.337 225.937 436.29 219.584C436.303 213.23 436.32 206.88 436.34 200.534C436.34 191.004 435.95 191.004 435.95 181.474C435.95 171.944 436.51 171.954 436.51 162.424C436.51 152.894 436.92 152.894 436.92 143.374C436.92 133.844 436.69 133.844 436.69 124.314C436.69 114.784 436.08 114.784 436.08 105.264C436.08 100.494 435.97 98.1138 435.86 95.7338C435.81 94.5438 435.77 93.3538 435.71 91.8638C435.69 91.2038 435.67 89.9738 435.64 90.1138C435.61 89.9538 435.55 89.8038 435.45 89.6338C435.24 89.2838 434.93 89.1438 434.71 89.1038C434.65 89.0838 434.59 89.0938 434.54 89.0838C434.51 89.0838 434.48 89.0838 434.45 89.0838C434.46 89.0838 434.38 89.0838 434.29 89.0838H434.05C433.42 89.0738 432.82 89.0637 432.23 89.0537C429.85 89.0237 427.47 88.9838 422.71 88.8338C413.19 88.5338 413.22 87.6937 403.7 87.3937C394.18 87.0937 394.18 87.2638 384.66 86.9638C378.313 86.7304 371.967 86.4938 365.62 86.2538C356.1 85.9538 356.11 85.5338 346.59 85.2338C337.07 84.9338 337.07 85.1738 327.54 84.8738C322.78 84.7038 320.4 84.6237 318.02 84.5337C316.83 84.4837 315.64 84.4438 314.15 84.3838C312.66 84.3338 310.87 84.4137 308.49 84.4337C298.96 84.5937 298.96 85.2437 289.43 85.4037C279.9 85.5637 279.9 84.5338 270.37 84.6938C260.84 84.8538 260.84 85.4238 251.31 85.5838C241.78 85.7438 241.78 85.1438 232.24 85.3138C225.887 85.4338 219.537 85.5537 213.19 85.6737C203.66 85.8337 203.66 87.4038 194.14 87.5738C184.61 87.7338 184.6 86.4738 175.07 86.6338C165.54 86.7938 165.54 87.4038 156.01 87.5638C146.48 87.7238 146.48 87.9038 136.95 88.0638C130.597 88.1371 124.243 88.2137 117.89 88.2937C108.35 88.4537 108.35 87.8338 98.8101 87.9938C89.2701 88.1538 89.2701 88.4937 79.7301 88.6637C74.9601 88.7437 72.5701 88.7537 70.1901 88.7737C69.0001 88.7737 67.8001 88.7937 66.3101 88.8037C66.1201 88.8037 65.9301 88.8037 65.7401 88.8037C65.6001 88.8037 65.61 88.8138 65.54 88.8138C65.43 88.8238 65.3201 88.8238 65.2101 88.8638C64.9801 88.9238 64.74 89.0338 64.5 89.2238C63.83 89.8338 63.29 90.1538 62.25 90.4438C61.25 90.7338 59.8701 90.7037 58.3101 90.6537C56.7501 90.6037 55.35 91.0037 54.4 89.9037C53.94 89.3437 53.6201 88.3438 53.8401 86.7238C54.0901 85.1438 54.96 82.8438 57.4 80.7538C59 79.4238 60.7 78.6338 62.26 78.1938C63.04 77.9638 63.81 77.8438 64.52 77.7638C64.87 77.7438 65.21 77.7138 65.53 77.6938C65.73 77.6938 65.9201 77.6837 66.1001 77.6737C67.5901 77.6137 68.7801 77.5637 69.9701 77.5237C72.3501 77.4237 74.73 77.3138 79.5 77.2338C89.03 77.0738 89.0301 76.7838 98.5601 76.6138C108.09 76.4538 108.09 76.1738 117.62 76.0038C127.16 75.8438 127.17 76.6438 136.7 76.4738C146.23 76.3138 146.24 76.4838 155.77 76.3238C162.123 76.1704 168.477 76.0138 174.83 75.8538C184.36 75.6938 184.36 75.2538 193.89 75.0938C203.42 74.9338 203.42 75.3137 212.95 75.1537L232.01 74.8538C241.54 74.6938 241.54 73.7538 251.08 73.5938C257.44 73.5204 263.797 73.4471 270.15 73.3738C279.69 73.2138 279.68 74.5038 289.22 74.3438C298.75 74.1838 298.76 73.2037 308.29 73.0437C310.67 73.0137 312.46 72.9737 313.95 73.0237C315.44 73.1137 316.63 73.1938 317.82 73.2638C320.2 73.4238 322.59 73.5838 327.35 73.7338C336.88 74.0338 336.89 73.5238 346.43 73.8238C355.97 74.1238 355.95 74.9438 365.49 75.2438C375.03 75.5438 375.04 75.1237 384.57 75.4237C394.11 75.7237 394.1 76.2938 403.63 76.5938C413.16 76.8938 413.17 76.6438 422.71 76.9438C427.48 77.0938 429.86 77.3137 432.24 77.5437C432.83 77.5937 433.43 77.6538 434.06 77.7138C434.43 77.7438 434.82 77.7838 435.22 77.8138C435.79 77.8638 436.37 77.9638 436.98 78.1038C439.37 78.6938 442.3 80.0538 444.58 83.3338C445.7 84.9738 446.27 86.6638 446.54 88.1938C446.68 88.9338 446.72 89.7338 446.74 90.3238C446.74 90.7338 446.76 91.1338 446.76 91.5038C446.81 92.9938 446.84 94.1838 446.88 95.3738C446.97 97.7538 447.06 100.144 447.06 104.904C447.06 114.444 447.55 114.444 447.55 123.974C447.55 133.504 448.25 133.514 448.25 143.054C448.25 152.594 446.94 152.584 446.94 162.114C446.94 171.644 447.35 171.654 447.35 181.184C447.35 190.714 447.57 190.724 447.57 200.254C447.57 209.784 447.15 209.784 447.15 219.324C447.15 228.864 447.95 228.864 447.95 238.404C447.95 247.934 447.67 247.934 447.67 257.474C447.67 267.014 447.9 267.014 447.9 276.544C447.9 286.074 447.57 286.074 447.57 295.614C447.57 305.154 448 305.154 448 314.694C448.04 319.464 447.82 321.844 447.69 324.224C447.54 326.604 447.39 328.994 447.24 333.754C447.027 340.114 446.813 346.47 446.6 352.824C446.29 362.364 446.81 362.374 446.5 371.914C446.19 381.454 445.85 381.444 445.54 390.974C445.313 397.334 445.083 403.69 444.85 410.044C444.82 411.234 444.79 412.284 444.77 413.214C444.72 414.894 444.38 416.374 443.91 417.654C442.95 420.214 441.53 421.974 439.89 423.414C438.21 424.804 436.2 425.944 433.44 426.424C432.75 426.554 432.03 426.604 431.26 426.624C430.84 426.624 430.4 426.634 429.93 426.644C429 426.644 427.96 426.644 426.76 426.644C417.23 426.594 417.23 425.974 407.7 425.924C401.347 425.884 394.99 425.84 388.63 425.794C379.1 425.744 379.1 425.144 369.57 425.094C360.04 425.044 360.03 425.774 350.5 425.724C344.147 425.697 337.79 425.674 331.43 425.654C321.9 425.604 321.89 426.014 312.36 425.964C302.82 425.914 302.83 425.054 293.29 424.994C283.76 424.944 283.76 425.724 274.23 425.674C264.7 425.624 264.71 425.314 255.18 425.254C245.65 425.204 245.65 424.654 236.12 424.604C226.59 424.554 226.59 424.114 217.06 424.054C210.707 424.054 204.353 424.054 198 424.054C188.47 424.004 188.47 424.514 178.94 424.464C169.41 424.414 169.41 423.654 159.88 423.604C150.35 423.554 150.35 423.834 140.82 423.784C131.29 423.734 131.28 424.274 121.75 424.214C112.22 424.164 112.22 424.624 102.68 424.574C93.1501 424.524 93.1501 424.224 83.6101 424.174C78.8401 424.144 76.4601 424.024 74.0801 423.914C72.8901 423.864 71.7001 423.814 70.2101 423.744C69.4701 423.724 68.6501 423.704 67.7201 423.684C67.2501 423.684 66.7601 423.674 66.2401 423.664C66.1101 423.664 65.9801 423.664 65.8401 423.664H65.63L65.29 423.644C64.8 423.614 64.3 423.604 63.79 423.504C61.72 423.194 60 422.434 58.65 421.534C57.3 420.634 56.29 419.594 55.53 418.554C54 416.464 53.3901 414.404 53.1901 412.384C53.1201 411.874 53.14 411.374 53.14 410.864C53.14 410.714 53.14 410.624 53.14 410.564L53.16 410.334C53.17 410.184 53.1801 410.024 53.1901 409.864C53.2201 409.234 53.26 408.564 53.3 407.814C53.36 406.324 53.4 404.534 53.4 402.154C53.4 392.624 52 392.624 52 383.084C52 373.544 52.5 373.544 52.5 364.014C52.5 354.484 53.41 354.474 53.41 344.934C53.41 335.394 52.16 335.394 52.16 325.864C52.16 316.334 52.53 316.324 52.53 306.794C52.51 300.434 52.4901 294.074 52.4701 287.714C52.4701 278.174 53.16 278.174 53.16 268.634C53.16 259.094 52.9301 259.104 52.9301 249.564C52.9101 243.204 52.8933 236.847 52.88 230.494C52.88 220.954 52.03 220.954 52.03 211.424C52.03 205.064 52.0267 198.707 52.02 192.354C52.0667 185.994 52.1134 179.634 52.16 173.274C52.16 163.744 53.4501 163.744 53.4501 154.204C53.4501 144.664 52.8301 144.664 52.8301 135.114C52.8301 125.564 53.4801 125.564 53.4801 116.014C53.4801 106.464 52.0601 106.464 52.0601 96.9137C52.0601 89.6137 55.16 90.7138 58.28 90.7138C61.4 90.7138 64.6101 89.6137 64.6101 96.9137L64.65 96.9438Z" fill="currentColor" />
    <path d="M435.182 152.194C427.133 152.194 427.133 152.614 419.083 152.614C411.033 152.614 411.033 153.034 402.993 153.034C394.953 153.034 394.942 153.044 386.892 153.044C378.842 153.044 378.842 152.354 370.792 152.354C362.742 152.354 362.742 153.634 354.693 153.634C346.643 153.634 346.643 152.554 338.593 152.554C330.543 152.554 330.543 153.444 322.493 153.444C314.443 153.444 314.442 152.684 306.392 152.684C298.342 152.684 298.342 152.334 290.292 152.334C282.242 152.334 282.242 153.614 274.182 153.614C266.122 153.614 266.133 153.234 258.083 153.234C250.033 153.234 250.033 152.724 241.983 152.724C233.933 152.724 233.933 152.404 225.873 152.404C217.813 152.404 217.822 153.234 209.762 153.234C201.702 153.234 201.712 153.424 193.662 153.424C185.612 153.424 185.612 152.844 177.552 152.844C169.492 152.844 169.503 152.954 161.443 152.954C153.383 152.954 153.393 152.384 145.333 152.384C137.273 152.384 137.283 153.654 129.223 153.654C121.163 153.654 121.173 153.694 113.123 153.694C105.073 153.694 105.062 152.994 97.0024 152.994C88.9424 152.994 88.9426 152.824 80.8726 152.824C72.8026 152.824 72.8126 152.524 64.7426 152.524C58.5226 152.524 58.3125 150.494 58.3125 147.374C58.3125 144.254 58.5226 141.254 64.7426 141.254C72.7926 141.254 72.7925 141.684 80.8425 141.684C88.8925 141.684 88.8925 142.464 96.9325 142.464C104.972 142.464 104.982 141.834 113.032 141.834C121.082 141.834 121.082 141.504 129.132 141.504C137.182 141.504 137.183 141.594 145.233 141.594C153.283 141.594 153.283 141.774 161.333 141.774C169.383 141.774 169.382 142.464 177.432 142.464C185.482 142.464 185.482 142.044 193.532 142.044C201.582 142.044 201.582 141.184 209.632 141.184C217.682 141.184 217.683 142.384 225.743 142.384C233.803 142.384 233.793 141.164 241.843 141.164C249.893 141.164 249.893 142.384 257.943 142.384C265.993 142.384 265.992 141.864 274.052 141.864C282.112 141.864 282.102 141.214 290.162 141.214C298.222 141.214 298.212 142.494 306.262 142.494C314.312 142.494 314.313 141.864 322.373 141.864C330.433 141.864 330.423 141.394 338.483 141.394C346.543 141.394 346.533 142.024 354.593 142.024C362.653 142.024 362.643 142.534 370.703 142.534C378.763 142.534 378.753 141.234 386.802 141.234C394.852 141.234 394.862 141.464 402.912 141.464C410.962 141.464 410.972 141.764 419.042 141.764C427.112 141.764 427.102 142.194 435.172 142.194C441.392 142.194 441.812 144.264 441.812 147.384C441.812 150.504 441.392 152.214 435.172 152.214L435.182 152.194Z" fill="currentColor" />
  </svg>
);

// External link icon
const ExternalLinkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none">
    <path d="M9.5 3C9.77614 3 10 3.22386 10 3.5C10 3.77614 9.77614 4 9.5 4H4.5C4.22386 4 4 4.22386 4 4.5V15.5C4 15.7761 4.22386 16 4.5 16H15.5C15.7761 16 16 15.7761 16 15.5V10.5C16 10.2239 16.2239 10 16.5 10C16.7761 10 17 10.2239 17 10.5V15.5C17 16.3284 16.3284 17 15.5 17H4.5C3.67157 17 3 16.3284 3 15.5V4.5C3 3.67157 3.67157 3 4.5 3H9.5ZM16.5 3C16.5374 3 16.5747 3.00436 16.6113 3.0127C16.6347 3.01803 16.6574 3.02559 16.6797 3.03418C16.687 3.03701 16.6939 3.04076 16.7012 3.04395C16.7213 3.05283 16.7409 3.06272 16.7598 3.07422C16.7675 3.07892 16.7757 3.08274 16.7832 3.08789C16.8082 3.10508 16.8317 3.12471 16.8535 3.14648L16.918 3.22461C16.9289 3.24116 16.9356 3.25988 16.9443 3.27734C16.95 3.28857 16.9572 3.29894 16.9619 3.31055C16.9789 3.35212 16.9888 3.39547 16.9941 3.43945C16.9966 3.45953 17 3.47957 17 3.5V7.5C17 7.77614 16.7761 8 16.5 8C16.2239 8 16 7.77614 16 7.5V4.70703L11.8535 8.85352C11.6583 9.04878 11.3417 9.04878 11.1465 8.85352C10.9512 8.65825 10.9512 8.34175 11.1465 8.14648L15.293 4H12.5C12.2239 4 12 3.77614 12 3.5C12 3.22386 12.2239 3 12.5 3H16.5Z" fill="currentColor" />
  </svg>
);

// Copy icon
const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 21" fill="none">
    <path d="M12.5 3.60938C13.3284 3.60938 14 4.28095 14 5.10938V6.60938H15.5C16.3284 6.60938 17 7.28095 17 8.10938V16.1094C17 16.9378 16.3284 17.6094 15.5 17.6094H7.5C6.67157 17.6094 6 16.9378 6 16.1094V14.6094H4.5C3.67157 14.6094 3 13.9378 3 13.1094V5.10938C3 4.28095 3.67157 3.60938 4.5 3.60938H12.5ZM14 13.1094C14 13.9378 13.3284 14.6094 12.5 14.6094H7V16.1094C7 16.3855 7.22386 16.6094 7.5 16.6094H15.5C15.7761 16.6094 16 16.3855 16 16.1094V8.10938C16 7.83323 15.7761 7.60938 15.5 7.60938H14V13.1094ZM4.5 4.60938C4.22386 4.60938 4 4.83323 4 5.10938V13.1094C4 13.3855 4.22386 13.6094 4.5 13.6094H12.5C12.7761 13.6094 13 13.3855 13 13.1094V5.10938C13 4.83323 12.7761 4.60938 12.5 4.60938H4.5Z" fill="currentColor" />
  </svg>
);

// Slack logo icon
const SlackIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" fill="currentColor"/>
  </svg>
);

interface SlackIntegrationProps {
  className?: string;
}

const SlackIntegration: React.FC<SlackIntegrationProps> = ({ className = '' }) => {
  const [copied, setCopied] = useState(false);

  const installCommand = 'curl -fsSL https://claude.ai/install.sh | bash';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(installCommand);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const accessCards = [
    {
      title: 'Start in your terminal',
      description: 'Super powerful terminal integration. Works with all your CLI tools alongside any IDE.',
      type: 'terminal',
    },
    {
      title: 'Integrate with your editor',
      description: 'Native extensions for VS Code (+ Cursor, Windsurf) and JetBrains IDEs.',
      type: 'ide',
    },
    {
      title: 'Access anywhere',
      description: 'Quick access from browser or mobile. Great for parallel work or on-the-go coding.',
      type: 'web',
    },
  ];

  return (
    <section className={`bg-[#faf9f5] py-20 ${className}`} style={{ fontFamily: '"Anthropic Sans", Arial, sans-serif' }}>
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col items-center mb-10">
          <div className="text-[#141413] mb-4">
            <PictogramIcon />
          </div>
          <h2
            className="text-[41px] font-medium text-[#141413] text-center"
            style={{ fontFamily: '"Anthropic Serif", Georgia, sans-serif' }}
          >
            Meets you where you code
          </h2>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Terminal Card */}
          <div className="bg-white rounded-[22px] p-6 border border-[#f0eee6]">
            <h3
              className="text-[18px] font-medium text-[#141413] mb-2"
              style={{ fontFamily: '"Anthropic Serif", Georgia, sans-serif' }}
            >
              Start in your terminal
            </h3>
            <p className="text-[15px] text-[#5e5d59] leading-6 mb-4">
              Super powerful terminal integration. Works with all your CLI tools alongside any IDE.
            </p>
            <div className="space-y-3">
              <button
                onClick={handleCopy}
                className="w-full flex items-center justify-between bg-[#f0eee6] rounded-lg px-3 py-2.5 text-left group hover:bg-[#e8e6de] transition-colors"
              >
                <code className="text-[13px] text-[#141413] font-mono truncate pr-2">
                  {installCommand}
                </code>
                <span className="flex-shrink-0 text-[#5e5d59] group-hover:text-[#141413]">
                  {copied ? (
                    <span className="text-xs text-green-600">Copied!</span>
                  ) : (
                    <CopyIcon />
                  )}
                </span>
              </button>
              <p className="text-[15px] text-[#5e5d59]">
                Or read the{' '}
                <a
                  href="https://code.claude.com/docs/en/overview"
                  className="underline hover:text-[#141413] transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  documentation
                </a>
              </p>
            </div>
          </div>

          {/* IDE Card */}
          <div className="bg-white rounded-[22px] p-6 border border-[#f0eee6]">
            <h3
              className="text-[18px] font-medium text-[#141413] mb-2"
              style={{ fontFamily: '"Anthropic Serif", Georgia, sans-serif' }}
            >
              Integrate with your editor
            </h3>
            <p className="text-[15px] text-[#5e5d59] leading-6 mb-4">
              Native extensions for VS Code (+ Cursor, Windsurf) and JetBrains IDEs.
            </p>
            <div className="flex gap-3">
              <a
                href="https://marketplace.visualstudio.com/items?itemName=anthropic.claude-code"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 bg-[#f0eee6] rounded-lg text-[15px] text-[#4d4c48] hover:bg-[#e8e6de] transition-colors"
              >
                <span>VS Code</span>
                <ExternalLinkIcon />
              </a>
              <a
                href="https://plugins.jetbrains.com/plugin/27310-claude-code-beta-"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 bg-[#f0eee6] rounded-lg text-[15px] text-[#4d4c48] hover:bg-[#e8e6de] transition-colors"
              >
                <span>JetBrains</span>
                <ExternalLinkIcon />
              </a>
            </div>
          </div>

          {/* Web/Mobile Card */}
          <div className="bg-white rounded-[22px] p-6 border border-[#f0eee6]">
            <h3
              className="text-[18px] font-medium text-[#141413] mb-2"
              style={{ fontFamily: '"Anthropic Serif", Georgia, sans-serif' }}
            >
              Access anywhere
            </h3>
            <p className="text-[15px] text-[#5e5d59] leading-6 mb-4">
              Quick access from browser or mobile. Great for parallel work or on-the-go coding.
            </p>
            <a
              href="https://claude.ai/code"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#f0eee6] rounded-lg text-[15px] text-[#4d4c48] hover:bg-[#e8e6de] transition-colors"
            >
              <span>Open in browser</span>
              <ExternalLinkIcon />
            </a>
          </div>

          {/* Slack Card */}
          <div className="bg-white rounded-[22px] p-6 border border-[#f0eee6]">
            <h3
              className="text-[18px] font-medium text-[#141413] mb-2"
              style={{ fontFamily: '"Anthropic Serif", Georgia, sans-serif' }}
            >
              Kick off coding tasks in Slack
            </h3>
            <p className="text-[15px] text-[#5e5d59] leading-6 mb-4">
              Start tasks right from Slack. Claude Code integrates directly with your team workspace.
            </p>
            <div className="flex flex-col gap-3">
              <a
                href="/claude-in-slack"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#f0eee6] rounded-lg text-[15px] text-[#4d4c48] hover:bg-[#e8e6de] transition-colors"
              >
                <span>Learn more</span>
                <ExternalLinkIcon />
              </a>
              <a
                href="https://slack.com/oauth/v2/authorize?client_id=1601185624273.8899143856786&scope=app_mentions:read,assistant:write,channels:history,channels:read,chat:write,files:read,files:write,groups:history,groups:read,im:history,im:read,im:write,mpim:history,reactions:write,users:read,users:read.email,commands,search:read.public&user_scope=bookmarks:read,channels:history,channels:read,chat:write,emoji:read,files:read,groups:history,groups:read,groups:write,im:history,im:read,im:write,links:read,mpim:history,mpim:read,mpim:write,mpim:write.topic,pins:read,reactions:read,reactions:write,remote_files:read,team:read,users:read,users:read.email,search:read.public,search:read.private,search:read.im,search:read.mpim,search:read.files,search:read.users,canvases:read,canvases:write"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#141413] rounded-lg text-[15px] text-[#faf9f5] hover:bg-[#2a2a29] transition-colors"
              >
                <SlackIcon />
                <span>Add to Slack</span>
              </a>
            </div>
          </div>
        </div>

        {/* Featured Slack Image Card - Optional larger display */}
        <div className="mt-8 bg-white rounded-[22px] p-8 border border-[#f0eee6]">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Image */}
            <div className="bg-[#1f1e1d] rounded-2xl overflow-hidden aspect-square flex items-center justify-center">
              <img
                src="https://cdn.prod.website-files.com/6889473510b50328dbb70ae6/691505c9bba2f78bec842d0c_claude-code_use-case_terminal_w-bg.webp"
                alt="Claude Code in terminal"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div>
              <h3
                className="text-[24px] font-medium text-[#141413] mb-4"
                style={{ fontFamily: '"Anthropic Serif", Georgia, sans-serif' }}
              >
                Kick off coding tasks in Slack
              </h3>
              <p className="text-[15px] text-[#5e5d59] leading-6 mb-6">
                Start tasks right from your team's Slack workspace. Claude Code integrates seamlessly with your existing workflow, allowing you to trigger coding tasks, review code, and collaborate with Claude directly in channels and DMs.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="/claude-in-slack"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-[#f0eee6] rounded-lg text-[15px] text-[#4d4c48] hover:bg-[#e8e6de] transition-colors"
                >
                  <span>Learn more</span>
                </a>
                <a
                  href="https://slack.com/oauth/v2/authorize?client_id=1601185624273.8899143856786&scope=app_mentions:read,assistant:write,channels:history,channels:read,chat:write,files:read,files:write,groups:history,groups:read,im:history,im:read,im:write,mpim:history,reactions:write,users:read,users:read.email,commands,search:read.public&user_scope=bookmarks:read,channels:history,channels:read,chat:write,emoji:read,files:read,groups:history,groups:read,groups:write,im:history,im:read,im:write,links:read,mpim:history,mpim:read,mpim:write,mpim:write.topic,pins:read,reactions:read,reactions:write,remote_files:read,team:read,users:read,users:read.email,search:read.public,search:read.private,search:read.im,search:read.mpim,search:read.files,search:read.users,canvases:read,canvases:write"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-[#141413] rounded-lg text-[15px] text-[#faf9f5] hover:bg-[#2a2a29] transition-colors"
                >
                  <SlackIcon />
                  <span>Add to Slack</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SlackIntegration;
