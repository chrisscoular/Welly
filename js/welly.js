var _wellyInit = {n:'_wellyInit',u:['js/welly.config.js']};
/*
* Only thing to change is the location of welly.config.js on line 1.
* Do not change anything below this point. There be dragons!
*/
function _ApiMod(n,f){
	var self=this;
	var name=n;
	var data={};

	function _DataExists(n){
		return typeof data[n]!='undefined';
	}

	function _GetVal(n){
		if(!_DataExists(n)){
			console.log(name+'.Get; Value "' +n+ '" not defined');
			return '';
		}
		return data[n].val;
	}

	function _SetVal(n,v){
		if(!_DataExists(n)){
			console.log(name+'.Set; Value "' +n+ '" not defined');
			return '';
		}
		if(data[n].def && typeof v !== data[n].type){
			console.log(name+'.Set; Value "' +n+ '" new value is diff type to defined type');
			return '';
		}
		if(typeof v !== typeof data[n].val){
			console.log(name+'.Set; Value "' +n+ '" warning new value is diff type ');
		}
		data[n].val=v;
		return data[n].val;
	}

	function _GetObjType(p){
		switch (p.toLowerCase()) {
			case 'string':
				t = 'string';
				break;
			case 'number':
				t = 'number';
				break;
			case 'func':
			case 'function':
				t = 'function';
				break;
			case 'bool':
			case 'boolean':
				t = 'boolean';
				break;
			case 'symbol':
				t = 'symbol';
				break;
			default:
				t = 'object';
		}
		return t;
	}

	function _Data(n,v,d){
		if(_DataExists(n)){
			console.log(name+'.Data; Value "' +n+ '" already defined');
			return '';
		}

		var t,z;
		if(typeof d !=='string'){
			d ='notDefined';
		}
		if(d ==='notDefined'){
			z=false;
		}else{
			z=true;
		}

		t = _GetObjType(d);
		data[n]={val: v, type: t, def: z};
		return data[n].val;
	}

	function _ExposeFns(d){
		var i;
		for(i in d){
			if(typeof self[i]=='undefined'){
				self[i]=d[i];
			}else{
				console.log(name+'.ExposeFns; identifier "' +name+ '.' +i+ '" already exists.');
			}
		}
	}

	f(_GetVal, _SetVal, _Data, _DataExists, _ExposeFns);
}

// _Welly (Wellington Boot) : Boot Loader. Loads JS for site/app
//
var _Welly = new _ApiMod('_Welly',function(Get, Set, Data, DataExists, ExposeFns){
	Data('pubsub',{});
	Data('seq',[]);
	Data('loaded',false);

	var idName='Welly_';

	function dE(e){return document.getElementById(e);}
	function cE(n){return document.createElement(n);}
	function bAc(e){document.body.appendChild(e);}

	function wScript(p){
		var s = cE("script");
		if(p.t === undefined){
			s.type = "text/javascript";
		}else{
			s.type = p.t;
		}
		s.src = p.u[0];
		s.setAttribute("async", "");
		return s;
	}

	function wCSS(p){
		var s = cE("link");
		s.setAttribute("rel", p.r);
		s.type = "text/css";
		s.setAttribute("href", p.u[0]);
		return s;
	}

	function boot(p,i) {
		try {
			var s;
			if(p.r ===undefined){
				s=wScript(p);
			}else{
				s=wCSS(p);
			}

			switch (p.w) {
				case 'h':
				case 'b':
					break;
				default:
					p.w = 'h';
			}
			s.id = idName+i;
			if(p.i !== undefined){
				s.setAttribute("integrity", p.i);
				s.setAttribute("crossorigin", "anonymous");
			}
			s.onload = _Welly.sLoaded;
			s.onreadystatechange = _Welly.sChange;
			s.onerror = _Welly.sError;
			if(p.w === 'h'){
				document.getElementsByTagName("head")[0].appendChild(s);
			}else{
				bAc(s);
			}
		} catch( err ) {
			console.log( "boot error " +err.message );
		}
	}

	function boots(p){
		var i,l=p.length;
		for(i=0; i<l; i++){
			p[i].l=false;
			if(p[i].d ===undefined || p[i].d.length===0){
				boot(p[i],i);
			}else{
				sub(p[i].d,i);
			}
		}
		Set('seq',p);
	}

	function sLoaded(event) {
		var p = Get('seq');
		var i = getID(event.target.id);
		if (i!=='init' && !p[i].l){
			p[i].l=true;
			Set('seq', p);
			pub(p[i].n);
		}
	}

	function sChange(event){
		var p = Get('seq');
		var i = getID(event.target.id);
		var el=dE(event.target.id);
		if (!p[i].l){
			if(el.readyState === "complete" || el.readyState == "loaded"){
				sLoaded(event);
			}
		}
	}

	function sError(event){
		var p = Get('seq');
		var i = getID(event.target.id);
		var l = p[i].u.length;
		var msg;
		console.log( "sError ID: " +i);
		if (!p[i].l && l>1){
				msg = p[i].u[0];
				p[i].u.shift();
				delScript(event.target.id);
				boot(p[i],i);
				Set('seq', p);
		}
		console.log( "sError. Failed to load n: " +p[i].n +" u: " +msg );
	}

	function getID(p){
		return p.substring(idName.length, p.length);
	}

	function pub(t){
		var p = Get('pubsub');
		if(!p[t]||p[t].length<1){return;}
		var o = Get('seq');
		var i,r, s=p[t],l=s.length;
		for(i=0;i<l;i++){
			switch (o[s[i]].d.length) {
				case 1:
					boot(o[s[i]],s[i]);
					break;
				default:
					r = o[s[i]].d.indexOf(t);
					o[s[i]].d.splice(r, 1);
			}
		}
		Set('seq', o);
	}

	function sub(a,i){
		var s = Get('pubsub');
		var x, l=a.length;
		for(x=0;x<l;x++){
			t=a[x];
			if(!s[t]){s[t]=[];}
			s[t].push(i);
		}
		Set('pubsub',s);
	}

	function isComplete(){
		var c=Get('loaded');
		if(c){return true;}
		var s=Get('seq');
		var i,l=s.length;
		for(i=0;i<l;i++){
			if(s[i].l===false){return false;}
		}
		Set('loaded',true);
		return true;
	}

	function delScript(p){
		var el = dE(p);
		el.parentElement.removeChild(el);
	}

  ExposeFns({
    boot:boot,
		boots:boots,
		sLoaded:sLoaded,
		sChange:sChange,
		sError:sError,
		isComplete:isComplete
  });

});

_Welly.boot(_wellyInit, 'init');
