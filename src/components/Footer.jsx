import React from 'react';

const Footer = () => {
  return (
        <footer style={styles.footer}>
            <div style={styles.leftContainer}>
                <div style={styles.info}>
                    <div style={styles.contactInfo}>
                        <p style={{color: "#E4D9C7"}}><strong>GSM1:</strong> 0887–467–527</p>
                        <p style={{color: "#E4D9C7"}}><strong>GSM2:</strong> 0888–877–056</p>
                        <p style={{color: "#E4D9C7"}}><strong>GSM3:</strong> 0899–014–423</p>
                        <a style={{margin: "0 4px", marginLeft: "0"}} href="https://www.facebook.com/groups/adgor/">
                            <svg
                                id="FacebookSVG"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                >
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M20 1C21.6569 1 23 2.34315 23 4V20C23 21.6569 21.6569 23 20 23H4C2.34315 23 1 21.6569 1 20V4C1 2.34315 2.34315 1 4 1H20ZM20 3C20.5523 3 21 3.44772 21 4V20C21 20.5523 20.5523 21 20 21H15V13.9999H17.0762C17.5066 13.9999 17.8887 13.7245 18.0249 13.3161L18.4679 11.9871C18.6298 11.5014 18.2683 10.9999 17.7564 10.9999H15V8.99992C15 8.49992 15.5 7.99992 16 7.99992H18C18.5523 7.99992 19 7.5522 19 6.99992V6.31393C19 5.99091 18.7937 5.7013 18.4813 5.61887C17.1705 5.27295 16 5.27295 16 5.27295C13.5 5.27295 12 6.99992 12 8.49992V10.9999H10C9.44772 10.9999 9 11.4476 9 11.9999V12.9999C9 13.5522 9.44771 13.9999 10 13.9999H12V21H4C3.44772 21 3 20.5523 3 20V4C3 3.44772 3.44772 3 4 3H20Z"
                                    fill="#E4D9C7"
                                />
                            </svg>
                        </a>
                        <a style={{margin: "0 4px"}} href="https://www.instagram.com/adgor.bg/">
                            <svg
                            id="InstagramSVG"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"
                                fill="#E4D9C7"
                            />
                            <path
                                d="M18 5C17.4477 5 17 5.44772 17 6C17 6.55228 17.4477 7 18 7C18.5523 7 19 6.55228 19 6C19 5.44772 18.5523 5 18 5Z"
                                fill="#E4D9C7"
                            />
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M1.65396 4.27606C1 5.55953 1 7.23969 1 10.6V13.4C1 16.7603 1 18.4405 1.65396 19.7239C2.2292 20.8529 3.14708 21.7708 4.27606 22.346C5.55953 23 7.23969 23 10.6 23H13.4C16.7603 23 18.4405 23 19.7239 22.346C20.8529 21.7708 21.7708 20.8529 22.346 19.7239C23 18.4405 23 16.7603 23 13.4V10.6C23 7.23969 23 5.55953 22.346 4.27606C21.7708 3.14708 20.8529 2.2292 19.7239 1.65396C18.4405 1 16.7603 1 13.4 1H10.6C7.23969 1 5.55953 1 4.27606 1.65396C3.14708 2.2292 2.2292 3.14708 1.65396 4.27606ZM13.4 3H10.6C8.88684 3 7.72225 3.00156 6.82208 3.0751C5.94524 3.14674 5.49684 3.27659 5.18404 3.43597C4.43139 3.81947 3.81947 4.43139 3.43597 5.18404C3.27659 5.49684 3.14674 5.94524 3.0751 6.82208C3.00156 7.72225 3 8.88684 3 10.6V13.4C3 15.1132 3.00156 16.2777 3.0751 17.1779C3.14674 18.0548 3.27659 18.5032 3.43597 18.816C3.81947 19.5686 4.43139 20.1805 5.18404 20.564C5.49684 20.7234 5.94524 20.8533 6.82208 20.9249C7.72225 20.9984 8.88684 21 10.6 21H13.4C15.1132 21 16.2777 20.9984 17.1779 20.9249C18.0548 20.8533 18.5032 20.7234 18.816 20.564C19.5686 20.1805 20.1805 19.5686 20.564 18.816C20.7234 18.5032 20.8533 18.0548 20.9249 17.1779C20.9984 16.2777 21 15.1132 21 13.4V10.6C21 8.88684 20.9984 7.72225 20.9249 6.82208C20.8533 5.94524 20.7234 5.49684 20.564 5.18404C20.1805 4.43139 19.5686 3.81947 18.816 3.43597C18.5032 3.27659 18.0548 3.14674 17.1779 3.0751C16.2777 3.00156 15.1132 3 13.4 3Z"
                                fill="#E4D9C7"
                            />
                            </svg>
                        </a>
                        <a style={{margin: "0 4px"}} href="/">
                            <svg
                            id="TikTokSVG"
                            viewBox="0 0 24 24"
                            fill="none"
                            >
                            <path
                                d="M16.8217 5.1344C16.0886 4.29394 15.6479 3.19805 15.6479 2H14.7293M16.8217 5.1344C17.4898 5.90063 18.3944 6.45788 19.4245 6.67608C19.7446 6.74574 20.0786 6.78293 20.4266 6.78293V10.2191C18.645 10.2191 16.9932 9.64801 15.6477 8.68211V15.6707C15.6477 19.1627 12.8082 22 9.32386 22C7.50043 22 5.85334 21.2198 4.69806 19.98C3.64486 18.847 2.99994 17.3331 2.99994 15.6707C2.99994 12.2298 5.75592 9.42509 9.17073 9.35079M16.8217 5.1344C16.8039 5.12276 16.7861 5.11101 16.7684 5.09914M6.9855 17.3517C6.64217 16.8781 6.43802 16.2977 6.43802 15.6661C6.43802 14.0734 7.73249 12.7778 9.32394 12.7778C9.62087 12.7778 9.9085 12.8288 10.1776 12.9124V9.40192C9.89921 9.36473 9.61622 9.34149 9.32394 9.34149C9.27287 9.34149 8.86177 9.36884 8.81073 9.36884M14.7244 2H12.2097L12.2051 15.7775C12.1494 17.3192 10.8781 18.5591 9.32386 18.5591C8.35878 18.5591 7.50971 18.0808 6.98079 17.3564"
                                stroke="#E4D9C7"
                                strokeLinejoin="round"
                            />
                            </svg>
                        </a>
                    </div>
                    <div style={styles.otherInfo}>
                        <p style={{color: "#E4D9C7"}}><strong>E-MAIL:</strong> adgor@abv.bg</p>
                        <p style={{color: "#E4D9C7"}}><strong>WORKING HOURS:</strong> Wed–Sun 10:00–18:00</p>
                    </div>
                </div>

                <div style={styles.copyright}>
                    <p style={{color: "#E4D9C7"}}>© 2018 Adgor Ltd. All Rights Reserved</p>
                </div>
            </div>
            <div style={styles.mapContainer}>
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d23540.524440304027!2d23.32283467347551!3d42.47952776161289!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14aad687c999481f%3A0x6b357c6fe10a2137!2sHorse+riding+%22Adgor%22!5e0!3m2!1sen!2sbg!4v1536885583999"
                    width="100%"
                    height="200"
                    style={styles.map}
                    allowFullScreen=""
                    loading="lazy"
                    title="Horse riding Adgor Location"
                ></iframe>
            </div>
        </footer>
    );
};

const styles = {
    footer: {
        display: 'flex',
        justifyContent: 'space-between',
        backgroundColor: '#29160f',
        color: '#f5f5f5',
        height: '300px',
    },
    leftContainer: {
        width: '50%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    info: {
        display: 'flex',
        justifyContent: 'space-between',
        flexGrow: '1',
    },
    contactInfo: {
        width: '50%',
        fontSize: '1.1em',
        // backgroundColor: '#664939',
        padding: '15px'
    },
    otherInfo: {
        width: '50%',
        fontSize: '1.1em',
        padding: '15px',
        backgroundColor: '#331C14',
    },
    copyright: {
        fontSize: '0.9em',
        fontStyle: 'italic',
        margin: '0',
        height: '40px',
        lineHeight: '40px',
        paddingLeft: '15px',
        backgroundColor: '#22120C'
    },
    mapContainer: {
        width: '50%',
    },
    map: {
        border: '0',
        height: '100%',
    },
};

export default Footer;