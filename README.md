# **GLLRST / gallerist**

Welcome to GLLRST, a fun art sharing app for friends! Search through the collections and archives of a museum to curate your own gallery of fine art. Check out our [Press Release](https://github.com/Par-For-Loops/gallerist/blob/main/_PRESS_RELEASE.md) for more details.

## **Features**

Once signed in with a Google account, our home page has a simple navbar to allow the user to access each of the following features:

### **Search**

The search page allows users to search art by a keyword and returns 10 randomized results related to that keyword. If the users likes an artwork, they can click on the heart emoji below to attempt to add it to their personal gallery. Some artworks remain out of bounds for GLLRST users (such is the harsh reality of the art market!), and artworks that have been previously acquired by other users will also not be available. However, successful acquisition of a piece will only cost $5 (deducted from the user's wallet), and will be added to the user's gallery.

### **Gallery**

The gallery page displays all the art in the gallery. You can filter the art by who owns it, and by the culture of the art. You can also use this page to add friends, based on the art pieces you're looking at. Each piece of art also links to another page where you can find a more in depth description of the piece.

### **Individual Artwork Info**

The Individual Artwork Info page gives a user a more in-depth explanation of a piece of artwork. It tells you things like the culture of the art and the time period it was made in. There is a direct link to the piece of art on the Harvard Museum's website in the info section as well. If you like a piece of art and would like to add the owner as a friend, you can do that too.

### **Profile**

The Profile page allows the user to manage their collected artworks and friends list, as well as check the funds in their wallet. Art can be listed for sale in the Auction section, or simply deleted from their gallery, where it might still be picked up by an enterprising art dealer.

### **Auction**

The Auction page lists all of the art that has been listed for sale by all of the users. It also reminds the user of the available funds in their wallet. Artwork can be perused and purchased for the list price with the simple click of a button. Don't spend too much time contemplating your purchase, or it might be bought out from under your nose. All sales are final.

## **Frameworks and Libraries**

The app was developed with **Node 20** on an **Express 4.18** framework that handles back-end requests. Our database is **MongoDb Community v5.0** using a **Mongoose v8** ODM.

Authentication is handled by **Passport** with a **Google Oauth 2.0** strategy. Environmental variables are handled by **Dotenv**.

The front-end was designed with **React v18**, with **Hooks**. Client-side routing is handled by **React Router v6.21**. Styling is **Bootstrap v5.3**, with several **React Bootstrap** components, as well as CSS preprocessing with **Sass**.

Several other devDependencies used by our team include linting by **Eslint extending AirBnB** rules, with JSX, React, and React Hooks plugins, as well as a few customizations. Our build was bundled by **Webpack**, with the JavaScript compiled by **Babel**. We used **Prettier** to help enforce code formatting.

Please refer to our [package.json](https://github.com/Par-For-Loops/gallerist/blob/main/package.json) for the full list of dependencies and versions.

## **Getting Started**

### **HUAM API**

We interact with the Harvard University Art Museum (HUAM) API to retrieve art. Check out the [documentation](https://github.com/harvardartmuseums/api-docs) for this API on Github and sign up for your own API key with Harvard at [this link to a Google form](https://docs.google.com/forms/d/e/1FAIpQLSfkmEBqH76HLMMiCC-GPPnhcvHC9aJS86E32dOd0Z8MpY2rvQ/viewform) in the "Access to the API section".

When we initially made this project in January 2024, this key was free, and the email response from Harvard was instantaneous and automatic. We hope the above details remain true for you, but be aware that this could possibly change.

Also, please note that we did not realize the API does not return the most standardized objects from each endpoint. The "This artwork is no longer available" modal was the band-aid we developed for this problem. Perhaps you can find a better fix for handling the API responses, or switch to a more uniform art museum API altogether...

### **EmailJS**

We interact with the EmailJS to send email notifications. Check out the [documentation](https://www.emailjs.com/).

### **Environmental Variables**

#### **Required Variables for App to Function**

Once you have an API key, this repo relies on a .env file (already listed in the .gitignore) that should have the following environmental variables defined:

- **APIKEY** : set to the key given to you by Harvard
- **GOOGLE_CLIENT_ID** : Necessary for Authentication. Create a project in your [Google Developer Console](http://console.cloud.google.com/) and create an OAuth client ID. For more details, we followed [this guide](https://www.passportjs.org/tutorials/google/register/) from the Passport docs.
- **GOOGLE_CLIENT_SECRET** : (see above)
- **EXPRESS_SECRET** : a random string of your liking, also used in the authentication set-up
- **NODE_ENV** : set to 'development' for local and 'production' for deployment
- **DB_URI** : the link to the database
- **SERVICE_ID** : create an account with emailjs and use the service id once the connection has been made to goggle
- **TEMPLATE_ID** : use the default template in emailjs, be sure to add {{email}} in the cc
- **USER_ID** : use the public key, after that make sure to go to the security tab an confirm that Allow EmailJS API for non-browser applications has been checked

#### **Optional Variable**s

The following variables are optional for setting the Webpack config to Development Mode and seeding the database with a fake dataset, which should no longer be necessary if you got an API Key, but are explained for full transparency:

- **GOOGLEID** : necessary for the 'seed' script to initialize the database with the fakeData found in /server/db/fakeData.js. You can find your google id and name in the mongosh shell with the command `db.users.find({})`.
- **GOOGLENAME** : (see above)

## **Terminal Scripts**

Fork the organization's [repo](https://github.com/Par-For-Loops/gallerist/) and make a clone to your development environment of choice. Once you have ensured that you have MongoDB installed and its service started, as well as created the .env file with the necessary variables defined above, you can install the project dependencies by running `npm install`.

You can then run the `npm run build` script to allow webpack and babel to create a transpiled bundle.js.

Run `npm start` to create a server and you should have a local instance of our site running at the 3000 port. Your server terminal should provide a link to open the application in your browser.

Run `npm run dev` to run the build and start the server concurrently.

## **Deployment**

Deploy to an AWS EC2 Ubuntu machine with the following steps:

### **1. Set up AWS root account**

[Here](https://aws.amazon.com/) if you do not already have an account...

### **2. Launch an Ubuntu instance**

Provide a project name, select the Ubuntu option in the 'Quick Start' menu, then select a free tier, and create a new key pair for SSH access (see Shortly Deploy instructions for clarity if needed), and save the key where you can find it. Create a new security group, then skip configuring ssh and IP access for now-we'll do it all in a sec. Lastly, click 'Launch instance' in the lower-right corner of the screen.

Beware: make sure you only have one running instance, or you will quickly deplenish the free-tier hours and incur overage charges.

### **3. Change firewall rules**

Navigate to the 'Instance summary' in AWS and click on the Security tab about halfway down the page. Then click the link to access the Security Group that contains the firewall rules for the instance ("sg-somethingSomethingSomething" or similar). Then click 'Edit inbound rules', and add the three rules below:

| TYPE       | PORT RANGE    | SOURCE          | WHY?                                 |
| ---------- | ------------- | --------------- | ------------------------------------ |
| SSH        | 22            | Local-Dev-IP/32 | SSH into instance from your computer |
| Custom TCP | 3000 (server) | 0.0.0.0/0       | User access from internet            |

Now that SSH access is enabled, we'll connect to the instance and set it up to host the app.

### **4. Connect to instance**

Instructions for connecting to the instance can be found by clicking Connect in the menu at the top of the AWS instance panel.

SSH into the instance by using either OpenSSH or Putty.

AWS suggests running `chmod 400 your-Key.pem` from the folder in which the key is located to ensure the key is private. A typical OpenSSH command to access the instance from that same directory location is below:

`ssh -i "your-Key.pem" ubuntu@public-DNS-Address`

The public DNS address typically ends with 'compute.amazonaws.com'.

### **5. Clone repo, download dependencies, configure db**

From the instance's root folder, clone down the app's repo from Github.

`git clone https://github.com/Group-Name/repo-Name`

Then cd into the project's folder and install its dependencies.

`npm install`

Lastly, you must recreate the .env file by running the following command:

`nano .env` (and paste in the variables outlined above)

You must then exit the text editor with `:wq` or `^x` depending on your editor and follow the prompts to save the file. Check your work by running `cat .env` to read the newly created .env file with the correct environmental variables.

### 7. Build the app, start the server, and access

Run the following commands to a build the app for deployment and start the server:

`npm run build`

`npm run start`

## **Contributing**

This project was created by a small team of 4 developers. Those interested in adding their own twist should check out our [Contributing Guide](https://github.com/Par-For-Loops/gallerist/blob/main/CONTRIBUTING.md). You'll find all the necessary information about forking the repo and getting started. Please check out our [Style Guide](https://github.com/Par-For-Loops/gallerist/blob/main/STYLE-GUIDE.md) too.

## **Thank you**

Lastly, we'd like to express our thanks to the instructors and fellow students at Operation Spark in New Orleans, Louisiana for their guidance and expertise, as well as our friends and family for their unconditional support.

## **Contact Info**

[Nathan Cassiani](https://github.com/nwcassiani)

[Ky Patton](https://github.com/kycodee)

[Raven Hughes](https://github.com/ravenhillh)

[Robert Frank](https://githbu.com/jrfiii)

############ **_ Team Misfits Updates _** ############

Our team sends Thanks to the original developers of this Project for creating such a fun project for us to work with!
We have added the following features:

### **Watchers**

Is there a fine piece of art you have your eye on that belongs to another User?
You can now keep an even closer eye on it by Watching the piece!
When the current owner puts the piece up for sale, you will receive an email notifying you of a chance to make it yours!

### **Meme Maker**

Perhaps you want to add a little whimsy to your gallery? A little silliness? A little nonsense?
Then you can use the Meme Maker to create fun pieces to display!
You can even view Memes created by Users across the site in the main Gallery.

### **Heist**

The Heist page allows a user to set a pass code for their art vault which stores all of the user's owned artworks. A user can then decide to attempt to steal artwork from other user's vault by guessing their pass code. A user has four attempts to guess a pass code with the aid of hints related to the accuracy of the user's guess. If the user is successful they can steal a single art piece and if they are unsuccessful they lose $50.

### **Quiz**

Low on ¢a$h from buying Art ( and failed Heist attempts )?
Replenish your savings by playing a few sessions of our Artwork Quiz!
Deduce which Title matches the displayed pieces and be rewarded!

### **AIC API Interaction**

We've introduced the Art Institute of Chicago's API to retrieve extra Art for our Quiz game.
Please give their [documentation](https://www.artic.edu/open-access/public-api) a look and be inspired to use it yourselves.
It's free to use and requires no authentication key as long as you stay within their listed call limit!

### **imgflip(memeMaker) API**

We've introduce the imgflip Api for the MemeMake component to give us random templates which the user can use to create their own uniq memes.
You don't have to make an account/key for the use of the api, this is link for the imgflip https://imgflip.com/api.
Only the get request is free to use

## **Contributing - Extended**

These additions were made by another small team of 4 developers!

[Cam’ron Calldwell](https://github.com/ccaldwell11)

[Gage Cantrelle](https://github.com/gagecantrelle)

[Josh Roberts](https://github.com/jrob112)

[Trelana Martin](https://github.com/TreMartin-OS)
