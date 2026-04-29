23.01.2026
======================

Node.js was reinstalled into the newest version v24.13.0 (see C:\Program Files\Node


In pom.xml

from
<nodeVersion>v12.16.1</nodeVersion>
<npmVersion>6.13.4</npmVersion>

to
<nodeVersion>v24.13.0</nodeVersion>
<npmVersion>11.6.2</npmVersion>

from
<!--arguments>install</arguments-->

to
<!-- added the force command to go through incorrect react dependencies, all the functions in the syfo web page seem to work correctly -->
<arguments>install --force</arguments>

In package.json

from 
"@navikt/fnrvalidator": "^1.1.0",
"@testing-library/jest-dom": "^4.2.4",
"@testing-library/react": "^9.4.0",
"@testing-library/user-event": "^7.2.1",
"@types/uuid": "^3.4.7",
"axios": "^1.2.6",
"base-64": "^1.0.0",
"classnames": "^2.2.6",
"date-fns": "^2.9.0",
"eslint-plugin-flowtype": "^4.6.0",
"fast-xml-parser": "^2.9.0",
"http-proxy-middleware": "^1.0.1",
"less-loader": "^5.0.0",
"lodash.throttle": "^4.1.1",
    
"nav-frontend-alertstriper": "^3.0.9",
"nav-frontend-alertstriper-style": "^2.0.7",
"nav-frontend-core": "^4.0.11",
"nav-frontend-etiketter": "^1.0.30",
"nav-frontend-etiketter-style": "^0.3.19",
"nav-frontend-grid": "^1.0.26",
"nav-frontend-grid-style": "^0.2.20",
"nav-frontend-hjelpetekst": "^2.0.21",
"nav-frontend-hjelpetekst-style": "^2.0.21",
"nav-frontend-ikoner-assets": "^1.0.3",
"nav-frontend-js-utils": "^1.0.8",
"nav-frontend-knapper": "^1.0.39",
"nav-frontend-knapper-style": "^0.3.34",
"nav-frontend-lenker": "^1.0.33",
"nav-frontend-lenker-style": "^0.2.24",
"nav-frontend-paneler": "^1.0.23",
"nav-frontend-paneler-style": "^0.3.17",
"nav-frontend-popover": "0.0.21",
"nav-frontend-popover-style": "0.0.2",
"nav-frontend-skjema": "^2.0.8",
"nav-frontend-skjema-style": "^2.0.2",
"nav-frontend-spinner": "^1.0.21",
"nav-frontend-spinner-style": "^0.2.5",
"nav-frontend-typografi": "^2.0.17",
"nav-frontend-typografi-style": "^1.0.18",
"node-import": "^0.9.2",
"prop-types": "^15.7.2",
"react": "^17.0.2",
"react-dom": "^17.0.2",
"react-app-rewire-less": "^2.1.3",
"react-app-rewired": "^2.1.5",
"react-scripts": "3.3.1",
"typescript": "^4.9.5",
"universal-cookie": "^7.2.2"

to
all nav-frontend libraries were updated to the newest versions.

added:
"@navikt/ds-react": "^8.1.0",
"@navikt/ds-css": "^8.1.0",

The react and react-dom went from 16.14.0 to 17.0.2

These two libraries were removed completely:
"react-app-rewire-less": "^2.1.3",
"react-app-rewired": "^2.1.5",

in the scripts part, the following has been added to the start and build:
cross-env NODE_OPTIONS='--openssl-legacy-provider'

tsconfig.json

from
"target": "es5",

to
"target": "es2022",


In NavEmpowerComponent.tsx

added:
import { InfoCard } from "@navikt/ds-react";

and Infocard object 


In LoginComponent.tsx and two others (none of them are currently in use)

From
import { Panel } from 'nav-frontend-paneler';

To
import Panel  from 'nav-frontend-paneler';
