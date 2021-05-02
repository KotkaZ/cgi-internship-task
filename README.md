# cgi-internship-task :v:

## _Karl Rapur_

This web application is purely made for the CGI internship program.
Calculator implements sunrise and sunset equations from NOAA:
[https://www.esrl.noaa.gov/gmd/grad/solcalc/solareqns.PDF](https://www.esrl.noaa.gov/gmd/grad/solcalc/solareqns.PDF)
These formulas use strong approximations, therefore calculations may be off a little.
Users can enter coordinates manually or select a location from the map.
In advanced view, there is the possibility to change Timezone and show daylight interval between dates.

## Tested compatability

Google Chrome - Version 90.0.4430.85 (Official Build) (64-bit) <br>
Firefox Browser - 88.0 (64-bit)<br>
Microsoft Edge - Version 90.0.818.46 (Official build) (64-bit)<br>
Brave Browser - Version 1.23.73 Chromium: 90.0.4430.85 (Official Build) (64-bit)

## :exclamation::exclamation::exclamation: Docker & Deployment

This project is very easy to install and deploy with Docker containers.
First, make sure your Docker engine is up and running.

```sh
cd goto-and-play
docker-compose up
```

This will take a couple of minutes on the initial start because Docker has to build images.
Once up, servers can be accessed on previously defined ports.
You can change port mappings in `docker-compose.yml`.

Another way to test out the application is via serving it. This is meant for development purposes.

```sh
npm install
npm run serve
```

By default, you can access the website [http://localhost:8080/](http://localhost:8080/)

## :blue_book: How did I approach this task?

For project setup, I used Docker for deployment and Vue as a framework.

At first, I was struggling with calculations. I didn't want to use libraries, because they made things too simple
and I thought this might a good oversight of how these calculations are really done. Finally, I found pdf file with
simplified equations, that was not too hard to implement in code.

Implemented views and components weren't difficult, as I have done many web apps in Vue.

There was a problem with Chart.js plugin, which was solved by using an older version. 3.0 or later versions
use a different approach, which is not yet supported in PrimeVue and needed custom component implementation.

Another problem was with the Leaftlet map plugin. Marker icons were not shown. The reason is still unknown.
It renders png images from the web, but not from its own CSS file or project assets folder.

Time consumption:

<ol>
    <li>Project setup - 15 min</li>
    <li>Looking at the time calcuation examples from the web - 90 min</li>
    <li>Implemented SolarEvent.ts model - 150 min</li>
    <li>Visual components - 60 min</li>
    <li>Map component - 120 min</li>
    <li>Chart component - 90 min</li>
    <li>Documentation, additional conent, visual improvments etc. - 120 min</li>
    <li>Writing README - 20 min</li>
</ol>
