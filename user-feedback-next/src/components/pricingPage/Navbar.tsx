import styles from './Navbar.module.css';

export function Navbar() {
  return (
    <div className={styles.wrapper}>
      <a className={styles.logoContainer} href="/">
        <img
          alt="Browserbase"
          loading="lazy"
          width={127.36}
          height={32}
          src="https://www.browserbase.com/assets/browserbase_logo_text.svg"
        />
      </a>

      <nav className={styles.itemsWrapper}>
        <div className={styles.dropdownsContainer}>
          <div className={styles.dropdownWrapper}>
            <div className={styles.dropdownLabelsWrapper}>
              <div>
                <span className={styles.dropdownLabel}>
                  Products
                  <svg
                    className={styles.arrowIcon}
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.6799 5.75L7.17993 9.25L3.67993 5.75"
                      stroke="#100D0D"
                      strokeLinecap="square"
                    />
                  </svg>
                </span>
              </div>
            </div>

            <div className={styles.dropdownContainer} style={{ width: 560, height: 264 }}>
              <div className={styles.dropdownContentInner} style={{ transform: 'translateX(0px)' }}>
                <div className={styles.dropdownSection} style={{ width: 560 }}>
                  <div className={styles.columnsWrapper}>
                    <div className={styles.column}>
                      <div className={styles.columnHeader}>Products</div>
                      <ul>
                        <li className={styles.item}>
                          <a className={styles.itemLink} href="https://browserbase.com">
                            <div className={`${styles.iconContainer} ${styles.productsIconContainer}`}>
                              <img
                                alt=""
                                loading="lazy"
                                width={24}
                                height={27.3}
                                className={styles.icon}
                                src="https://www.browserbase.com/assets/navbar/icons/red-cube.png"
                              />
                              <img
                                alt=""
                                loading="lazy"
                                width={26}
                                height={13.25}
                                className={styles.productIconShadow}
                                src="https://www.browserbase.com/assets/navbar/icons/shadow.svg"
                              />
                            </div>
                            <div className={styles.itemContent}>
                              <span className={styles.itemName}>Browserbase</span>
                              <span className={styles.itemDescription}>Serverless browser infrastructure</span>
                            </div>
                          </a>
                        </li>
                        <li className={styles.item}>
                          <a className={styles.itemLink} target="_blank" href="https://stagehand.dev" rel="noreferrer">
                            <div className={`${styles.iconContainer} ${styles.productsIconContainer}`}>
                              <img
                                alt=""
                                loading="lazy"
                                width={24}
                                height={27.3}
                                className={styles.icon}
                                src="https://www.browserbase.com/assets/navbar/icons/yellow-cube.png"
                              />
                              <img
                                alt=""
                                loading="lazy"
                                width={26}
                                height={13.25}
                                className={styles.productIconShadow}
                                src="https://www.browserbase.com/assets/navbar/icons/shadow.svg"
                              />
                            </div>
                            <div className={styles.itemContent}>
                              <span className={styles.itemName}>Stagehand</span>
                              <span className={styles.itemDescription}>Browser automation SDK</span>
                            </div>
                          </a>
                        </li>
                        <li className={styles.item}>
                          <a className={styles.itemLink} target="_blank" href="https://director.ai" rel="noreferrer">
                            <div className={`${styles.iconContainer} ${styles.productsIconContainer}`}>
                              <img
                                alt=""
                                loading="lazy"
                                width={24}
                                height={27.3}
                                className={styles.icon}
                                src="https://www.browserbase.com/assets/navbar/icons/blue-cube.png"
                              />
                              <img
                                alt=""
                                loading="lazy"
                                width={26}
                                height={13.25}
                                className={styles.productIconShadow}
                                src="https://www.browserbase.com/assets/navbar/icons/shadow.svg"
                              />
                            </div>
                            <div className={styles.itemContent}>
                              <span className={styles.itemName}>Director</span>
                              <span className={styles.itemDescription}>Browser workflow builder</span>
                            </div>
                          </a>
                        </li>
                      </ul>
                    </div>
                    <div className={styles.column}>
                      <div className={styles.columnHeader}>Features</div>
                      <ul>
                        <li className={styles.item}>
                          <a className={styles.itemLink} target="_blank" href="https://www.browserbase.com/mcp" rel="noreferrer">
                            <div className={`${styles.iconContainer} ${styles.productsIconContainer}`}>
                              <img
                                alt=""
                                loading="lazy"
                                width={24}
                                height={27.3}
                                className={styles.icon}
                                src="https://www.browserbase.com/assets/navbar/icons/green-cube.png"
                              />
                              <img
                                alt=""
                                loading="lazy"
                                width={26}
                                height={13.25}
                                className={styles.productIconShadow}
                                src="https://www.browserbase.com/assets/navbar/icons/shadow.svg"
                              />
                            </div>
                            <div className={styles.itemContent}>
                              <span className={styles.itemName}>MCP</span>
                              <span className={styles.itemDescription}>The browser tool MCP</span>
                            </div>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <a className={styles.navLink} href="#">Solutions</a>
          <a className={styles.navLink} href="#">Resources</a>
        </div>

        <a className={styles.navLink} href="/pricing">Pricing</a>
        <a className={styles.navLink} href="https://docs.browserbase.com/" target="_blank" rel="noopener noreferrer">
          Docs
          <span className={styles.iconWrapper}>
            <span className={styles.arrowIconContainer}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_13380_9742)">
                  <path d="M10.6688 6.27614L4.93109 12.0139L3.98828 11.0711L9.72601 5.33333H4.66883V4H12.0021V11.3333H10.6688V6.27614Z" fill="#100D0D" />
                </g>
                <defs>
                  <clipPath id="clip0_13380_9742">
                    <rect width="16" height="16" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </span>
            <span className={styles.cloneArrowIconContainer}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_13380_9743)">
                  <path d="M10.6688 6.27614L4.93109 12.0139L3.98828 11.0711L9.72601 5.33333H4.66883V4H12.0021V11.3333H10.6688V6.27614Z" fill="#100D0D" />
                </g>
                <defs>
                  <clipPath id="clip0_13380_9743">
                    <rect width="16" height="16" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </span>
          </span>
        </a>
      </nav>

      <div className={styles.buttonsContainer}>
        <a className={styles.loginLink} href="https://www.browserbase.com/sign-in">Log in</a>
        <div className={styles.buttonsWrapper}>
          <button className={`${styles.button} ${styles.signup}`}>
            <a href="https://www.browserbase.com/sign-up">Sign Up</a>
          </button>
          <button className={`${styles.button} ${styles.demo}`}>
            <a href="/contact">Get a Demo</a>
          </button>
        </div>
        <div className={styles.mobileMenuButtonContainer}>
          <button aria-label="Open menu">
            <svg width="24" height="24" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line y1="1" x2="18" y2="1" stroke="#100D0D" strokeWidth="1" />
              <line y1="7" x2="18" y2="7" stroke="#100D0D" strokeWidth="1" />
              <line y1="13" x2="18" y2="13" stroke="#100D0D" strokeWidth="1" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
