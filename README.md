


![REPO SIZE](https://img.shields.io/github/repo-size/scottbromander/the_marketplace.svg?style=flat-square)
![TOP_LANGUAGE](https://img.shields.io/github/languages/top/scottbromander/the_marketplace.svg?style=flat-square)
![FORKS](https://img.shields.io/github/forks/scottbromander/the_marketplace.svg?style=social)

# Nickle & Time

## Description

_Duration: 2 Week Sprint_

Nickle & Time lets users add locations, to a google map, that they would like to avoid or only visit a few times per week. Using the user's current location it will detect if they are close to one of those places, and send them a friendly text message based on how many times they have visisted. 

## Screen Shot

![Screenshot](public/nickletimeUI.jpeg)


## Installation


1. Go to https://github.com/tormodsletteboe/NickleAndTime
2. Fork that repo into your own github account.
3. Copy the ssh address
4. In your terminal navigate to a folder you want to clone into.
5. Run `git clone [ssh address]` in your terminal
6. cd into the cloned folder and run `code .` in your terminal to open the project in vscode.
7. Run 'npm install'. Npm will look at your dependecies and install needed libraries.
8. Install postgress database using include database.sql file
    -  in termial execute  'createdb prime_app' and 
    -  'psql -d prime_app -f database.sql'
9. To start, execute in 2 separate terminals, 'npm run server' and 'npm run client'.
10. If it started, terminal will display 'server is up on port 5000', and a website on localhost 3000 will open.
11. You can now enjoy Nickle & Time.

## Usage

 To Register, add
    - Username
    - Password
    - Phone Number 
        - only accepted format (XXXXXXXXXX), ex: 9998887777, no leading +1 or dashes, or spaces

1. To add a place to avoid
    - Search for an address
    - Select the place from the list of suggested places
    - Choose how many times per week to visit
    - Click Add button
    - The color circle added to the map is either
        - green (more than 1 visit left this week)
        - yellow (1 visit left this week)
        - red (no visits left this week)
2. To see current places user is avoiding
    - Click Places To Avoid (bottom left under map)
    - Each place has a name, visit count for the week (resets 7 days after being added), and visit limit per week
    - Each place can also be deactivated/activated (place will no longer be tracked, no text messages sent)
    - Each place can be deleted permanently.
3. Volvo Icon
    - Is meant as a simulation tool for demo purposes only.
        - Drag and drop the Volvo in a place to avoid. A message will be sent to the registered phone number. 
     

### Prerequisites

Link to software that is required to develop this website.

    "@emotion/react": "^11.10.5",
    "@emotion/styled": "^11.10.5",
    "@fontsource/roboto": "^4.5.8",
    "@googlemaps/react-wrapper": "^1.1.35",
    "@mui/icons-material": "^5.10.14",
    "@mui/material": "^5.10.14",
    "@reach/combobox": "^0.18.0",
    "@react-google-maps/api": "^2.17.0",
    "axios": "^0.21.1",
    "bcryptjs": "^2.4.3",
    "cookie-session": "^2.0.0",
    "dotenv": "^8.6.0",
    "express": "^4.17.1",
    "node-cron": "^3.0.2",
    "passport": "^0.4.1",
    "passport-local": "^1.0.0",
    "pg": "^8.5.1",
    "prop-types": "^15.7.2",
    "react": "^17.0.2",
    "react-dom": "^17.0.2",
    "react-redux": "^7.2.6",
    "react-router-dom": "^5.2.0",
    "react-scripts": "^5.0.1",
    "redux": "^4.1.2",
    "redux-logger": "^3.0.6",
    "redux-saga": "^1.1.3",
    "twilio": "^3.83.3",
    "use-places-autocomplete": "^4.0.0"
- [javascript](https://www.javascript.com/)
- [css]()
- [html]()
- [git](https://git-scm.com/)
- [github](https://github.com/)
- [body-parser](https://www.npmjs.com/package/body-parser)
- [pg](https://node-postgres.com/)
- [react](https://reactjs.org/)
- [redux](https://redux.js.org/)
- [axios](https://axios-http.com/)
- [express](https://expressjs.com/)
- [sql](https://www.mysql.com/)
- [sweetalerts2](https://sweetalert2.github.io/)
- [Sagas](https://redux-saga.js.org/)
- [Material UI](https://mui.com/)


## Acknowledgement
Thanks to [Prime Digital Academy](https://www.primeacademy.io/?utm_campaign=brand_search&utm_medium=cpc&utm_source=google&utm_medium=ppc&utm_campaign=Brand+Search&utm_term=prime%20digital%20academy&utm_source=adwords&hsa_mt=e&hsa_kw=prime%20digital%20academy&hsa_grp=34455376016&hsa_tgt=kwd-292678835500&hsa_ad=260264094213&hsa_ver=3&hsa_acc=5885076177&hsa_cam=670836869&hsa_src=g&hsa_net=adwords) who equipped and helped me to make this application a reality. (Edan Schwartz, Kris Szafranski)

## Support
If you have suggestions or issues, please email me at [tormod.slettebo@gmail.com] 

