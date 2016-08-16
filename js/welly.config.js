/*
*
* Delete these notes once famliar/in production
*
*	Populate the variable _WellyPayload.
*	It is an array of plain js objects of name value pairs.
*
* Only url and dependent are an Array. Minimum of 1 entry, no maximum,
*	but unlikely you will require more than tripple redundancy
*
*	The bare minimum to load a script is that
*	name and url are populated.
*
*	The bare minimum to load a stylesheet is that
*	name, url and rel are populated.
*
* Dependency can be chained. In the example below
* bundle.js requires cruyff.js to be loaded.
*	cruyff.js requires React-Dom to be loaded.
* React-Dom requires React to be loaded.
* React is not dependent so is requested immediately
*
* n: name. required.
*	string. i.e. n: 'react'
*
* u: url. required.
*	Array of strings. i.e. ['CDN1','CDN2','local']
* 	This is an array or url(s) for the script location.
* 	If it is a 3rd party library such as React or jQuery
* 	use a CDN to enhance loading performance.
* 	This offers redundancy in event location is unobtainable.
* 	The reason for this is Facbook can be stopped by a
* 	corporate firewall so fb.me for cdn may not work.
* 	suggestion for libraries is use
* 	['CDN1','CDN2','YourLocalServer']
*
* d: dependent. optional
* 	if a js file has to be loaded beforehand.
* 	use d:['name'] - name is the n value of the required script.
* 	i.e. 'React-DOM' requires 'React' to load.
*
* w: where. optional
* 	default location is script is attached to head(h).
* 	use w:'b' to append to body.
*
* t: type. optional.
* 	default is assigned as "text/javascript".
* 	Only populate if you want to have differnet type
* 	i.e. t: "text/jsx"
*
* i: integrity. optional.
* 	add in the hash value of the CDN library.
* 	see https://www.srihash.org/ and
* 	https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity
* 	https://frederik-braun.com/using-subresource-integrity.html
* 	for more details.
*		i.e. i: 'sha384-R8v794QN9hrNjnivoQ3Mf7nMGVwFIHBkUmBanB40ZBIMttZbBEUatXNosjytvPUC'
*
* r: rel. required for stylesheets. Not for scripts.
*		used for stylesheets.
*		i.e. r:'stylesheet'
*
*
*/

/*
example
bare min script
{n:'nscript', u:['js/location.js']}

bare min stylesheet
{n:'ncss', u:['css/location.css'],r:'stylesheet'}

full script
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

full stylesheet
{
	n:'ionicons',
	u:['http://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css'],
	r:'stylesheet',
	i:'sha384-4r9SMzlCiUSd92w9v1wROFY7DlBc5sDYaEBhcCJR7Pm2nuzIIGKVRtYWlf6w+GG4'
}
*/

var _WellyPayload = [
	{
		n:'React',
		u:[
			'https://npmcdn.com/react@15.3.0/dist/react.js',
			'https://cdnjs.cloudflare.com/ajax/libs/react/15.3.0/react.js',
			'cdn_local/js/react-15.3.0.js',
		],
		i: 'sha384-R8v794QN9hrNjnivoQ3Mf7nMGVwFIHBkUmBanB40ZBIMttZbBEUatXNosjytvPUC'
	},
	{
		n:'React-Dom',
		u:[
			'https://npmcdn.com/react-dom@15.3.0/dist/react-dom.js',
			'https://cdnjs.cloudflare.com/ajax/libs/react/15.3.0/react-dom.js',
			'cdn_local/js/react-dom-15.3.0.js'
			],
		d:['React'],
		i: 'sha384-PKr8yTHUBD0chzmoJ6ZYtB1nB87GTEWPmuDlDV7iARDrYGki2fmVB0ae3vf3LX0O'
	},
	{
		n:'cruyff',
		u:['js/cruyff.js'],
		d:['React-Dom']
	},
	{
		n:'Bundle',
		u:['js/bundle.js'],
		d:['React-Dom','cruyff']
	},
	{
		n:'bootstrap',
		u:['https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css'],
		r:'stylesheet',
		i: 'sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u'
	},
	{
		n:'font-awesome',
		u:['https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.6.3/css/font-awesome.min.css'],
		r:'stylesheet',
		i: 'sha384-T8Gy5hrqNKT+hzMclPo118YTQO6cYprQmhrYwIiQ/3axmI1hQomh7Ud2hPOy8SP1'
	}
];

_Welly.boots(_WellyPayload);

/*
{
	n:'fontawesome',
	u:['https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css'],
	r:'stylesheet',
	i:'sha384-T8Gy5hrqNKT+hzMclPo118YTQO6cYprQmhrYwIiQ/3axmI1hQomh7Ud2hPOy8SP1'
},
{
	n:'bootstrap',
	u:['https://bootswatch.com/superhero/bootstrap.min.css'],
	r:'stylesheet'
}

*/
