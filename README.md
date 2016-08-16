#Welly

Welly is a Boot loader for loading javascript files and stylesheets on the Front End.

The name Welly is short for Wellington Boot. Hence Welly Boot.


###Motivation
I always wanted a clean JS boot loader that was based off of a config file.
Just one script tag in the html that took care of the loading.
A boot loader that could be used in all scenarios with just a change to the config.
Not a change to the html file, but a dedicated config file that can be edited as needed.

I also wanted it to be small,
load files once the previous dependency had loaded successfully,
and offered CDN redundancy.

Some JS projects use JS libraries. These libraries can be loaded from your server.
As the libraries have grown in popularity there are Content Delivery Networks (CDN)
which host these libraries. Certain CDN's could be blocked by firewalls.
So I wanted build in redundancy so that if the first CDN failed it could go
to the next one, with a local copy of the library on your server as fallback.

Loading a library from a CDN is much quicker, and may already be cached in the browser.

As the rise in 3rd party CDN hosting has grown, so has possible security risks.
What if the library on the CDN has been tampered with?
Well web browsers have added functionality
to include the file hash value as a Subresource Integrity.

If you wish to include 3rd party libraries with integrity this is an option in Welly.

###Example scenario
I use React.js a lot. However to use the library with the browser React.js requires ReactDOM.js.
You have to load 2 files to work and with ReactDOM.js being a smaller file it often loads before
React.js. This leads to an error on the console as ReactDOM cannot find React.
I could use a bundle from Webpack with React and ReactDOM bundled with my code,
but this leads to loading 1 large file. It also defeats the purpose of using CDN's.
So with Welly you can make ReactDom dependent upon React, so that when React loads it
requests ReactDOM. This allows both library files to be loaded from a CDN, in order.


###Too long did not read.
Welly consists of 3 files, an index.html that will load scripts, welly.js the loader script, and
welly.config.js which is the configuration file.

The index.html will load welly.js which in turn loads the welly.config.js file.
The only thing you need to edit is the config file.
Unless you plan to move the location of welly, then you need to edit both the index.html and welly.js

However if you are familiar with JS and HTML that should be straight forward, and dare I say obvious.

As loading of files requires as little as code as possible all the variables in the config file are 1 letter.
An explanation of this is at the top of the config file.

Once you are comfortable with it or in production you can remove the commentary from the config file.

Also I have included a minified version of welly.js as welly.min.js. This is smaller but less easy to edit.

###Browsers
I have tested welly on Firefox, Chrome, Safari and Edge on Mac OSx and Windows 10.
It is possibly not IE8 friendly, but should run on most browsers as it uses normal JavaScript to load.

###How it works
The initial thing to look at is the index.html file.
Note the location of welly.js. This should match the location you want to have welly.js.

On GitHub or the downloaded location the welly.js file
should be in the js directory.

Feel free to move it.
The location is your choice, can be in any directory
 - so long as this file is reachable by your web browser.

At the top of welly.js is the only line in welly.js you should need to change.
this is
```
var _wellyInit = {n:'_wellyInit',u:['js/welly.config.js']};
```

_wellyInit is a plain JS object. The only part you are interested in changing
is the content of the u: array.
The value is the location you intend to have the configuration file.

The config file can be renamed, so long as it is a valid name and reachable from welly.js


The only part to change is the location of welly.config.js.
That is if you move it from the js directory.
The location should match where the browser will find it.

The configuration of welly.config.js is entirely up to you.
Have fun playing around with it.

It works Asynchronously, and will not request dependent files until the script
depended upon is loaded. There is a loader action which calls
a basic publish/subscribe (pub/sub) system.

The dependency can be chained, so that a js file can be dependent upon
1 or more files to be loaded. The pub/sub system decrements the array.
so upon all scripts loaded and published the next in the chain requests.

It does not handle inline scripts,
as it anticipates all scripts are files to be loaded.


###Explanation of the config file.

Delete these notes once familiar/in production

Populate the variable _WellyPayload.
It is an array of plain js objects of name value pairs.

Only u:url and d:dependent are an Array. Minimum of 1 entry, no maximum,
but unlikely you will require more than triple redundancy

The bare minimum to load a script is that
name and url are populated. (n:,u:)

The bare minimum to load a stylesheet is that
name, url and rel are populated. (n:,u:,r:)

Dependency can be chained. In the example below
React-Dom requires React to be loaded.
React is not dependent so is requested immediately

n: name. required.
string. i.e. n: 'react'

u: url. required.
Array of strings. i.e. ['CDN1','CDN2','local']
This is an array or url(s) for the script location.
If it is a 3rd party library such as React or jQuery
use a CDN to enhance loading performance.
This offers redundancy in event location is unobtainable.
The reason for this is Facbook can be stopped by a
corporate firewall so fb.me for cdn may not work.
suggestion for libraries is use
['CDN1','CDN2','YourLocalServer']

d: dependent. optional
if a js file has to be loaded beforehand.
use d:['name'] - name is the n value of the required script.
i.e. 'React-DOM' requires 'React' to load.

w: where. optional
default location is script is attached to head(h).
use w:'b' to append to body.

t: type. optional.
default is assigned as "text/javascript".
Only populate if you want to have differnet type
i.e. t: "text/jsx"

i: integrity. optional.
add in the hash value of the CDN library.
see https://www.srihash.org/ and
https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity
https://frederik-braun.com/using-subresource-integrity.html
for more details.
i.e. i: 'sha384-R8v794QN9hrNjnivoQ3Mf7nMGVwFIHBkUmBanB40ZBIMttZbBEUatXNosjytvPUC'

r: rel. required for stylesheets. Not for scripts.
used for stylesheets.
i.e. r:'stylesheet'


```
examples
bare min script
```
{n:'nscript', u:['js/location.js']}
```

bare min stylesheet
```
{n:'ncss', u:['css/location.css'],r:'stylesheet'}
```

full script
```
{
	n:'React-Dom',
	u:[
		'https://npmcdn.com/react-dom@15.3.0/dist/react-dom.js',
		'https://cdnjs.cloudflare.com/ajax/libs/react/15.3.0/react-dom.js',
		'cdn_local/js/react-dom-15.3.0.js'
		],
	d:['React'],
	i: 'sha384-PKr8yTHUBD0chzmoJ6ZYtB1nB87GTEWPmuDlDV7iARDrYGki2fmVB0ae3vf3LX0O',
	t: 'text/javascript',
	w:'b'
}
```

full stylesheet
```
{
	n:'ionicons',
	u:['http://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css'],
	r:'stylesheet',
	i:'sha384-4r9SMzlCiUSd92w9v1wROFY7DlBc5sDYaEBhcCJR7Pm2nuzIIGKVRtYWlf6w+GG4'
}
```
