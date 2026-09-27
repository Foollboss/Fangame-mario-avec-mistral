(()=>{var kd=0,Dh=1,Vd=2;var rs=1,Hd=2,js=3,Bn=0,Ye=1,ze=2,Ri=0,On=1,mi=2,Nh=3,Uh=4,Gd=5;var as=100,Wd=101,Xd=102,qd=103,Yd=104,$d=200,Jd=201,Zd=202,Kd=203,Fh=204,Bh=205,jd=206,Qd=207,tf=208,ef=209,nf=210,sf=211,rf=212,af=213,of=214,Oo=0,zo=1,ko=2,zs=3,Vo=4,Ho=5,Go=6,Wo=7,Oh=0,lf=1,cf=2,Hi=0,Ea=1,wa=2,Aa=3,os=4,Ra=5,Ca=6,Pa=7;var zh=300,zn=301,ls=302,Ml=303,bl=304,Ia=306,pn=1e3,Ji=1001,Xo=1002,Xe=1003,hf=1004;var La=1005;var Ke=1006,Sl=1007;var kn=1008;var gi=1009,kh=1010,Vh=1011,Qs=1012,Tl=1013,Gi=1014,Ci=1015,ke=1016,El=1017,wl=1018,tr=1020,Hh=35902,Gh=35899,Wh=1021,Xh=1022,Pi=1023,ji=1026,Vn=1027,Al=1028,Rl=1029,Hn=1030,Cl=1031;var Pl=1033,Da=33776,Na=33777,Ua=33778,Fa=33779,Il=35840,Ll=35841,Dl=35842,Nl=35843,Ul=36196,Fl=37492,Bl=37496,Ol=37488,zl=37489,Ba=37490,kl=37491,Vl=37808,Hl=37809,Gl=37810,Wl=37811,Xl=37812,ql=37813,Yl=37814,$l=37815,Jl=37816,Zl=37817,Kl=37818,jl=37819,Ql=37820,tc=37821,ec=36492,ic=36494,nc=36495,sc=36283,rc=36284,Oa=36285,ac=36286;var Vr=2300,qo=2301,Fo=2302,Mh=2303,bh=2400,Sh=2401,Th=2402;var uf=3200;var oc=0,df=1,_n="",We="srgb",Hr="srgb-linear",Gr="linear",ce="srgb";var Bo=7680;var ff=519,pf=512,mf=513,gf=514,lc=515,xf=516,_f=517,cc=518,vf=519,qh=35044,er=35048;var Yh="300 es",ki=2e3,ks=2001;function ym(s){for(let t=s.length-1;t>=0;--t)if(s[t]>=65535)return!0;return!1}function Mm(s){return ArrayBuffer.isView(s)&&!(s instanceof DataView)}function Wr(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function yf(){let s=Wr("canvas");return s.style.display="block",s}var ad={},Vs=null;function Xr(...s){let t="THREE."+s.shift();Vs?Vs("log",t,...s):console.log(t,...s)}function Mf(s){let t=s[0];if(typeof t=="string"&&t.startsWith("TSL:")){let e=s[1];e&&e.isStackTrace?s[0]+=" "+e.getLocation():s[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return s}function Gt(...s){s=Mf(s);let t="THREE."+s.shift();if(Vs)Vs("warn",t,...s);else{let e=s[0];e&&e.isStackTrace?console.warn(e.getError(t)):console.warn(t,...s)}}function Wt(...s){s=Mf(s);let t="THREE."+s.shift();if(Vs)Vs("error",t,...s);else{let e=s[0];e&&e.isStackTrace?console.error(e.getError(t)):console.error(t,...s)}}function ts(...s){let t=s.join(" ");t in ad||(ad[t]=!0,Gt(...s))}function bf(s,t,e){return new Promise(function(i,n){function r(){switch(s.clientWaitSync(t,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:n();break;case s.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:i()}}setTimeout(r,e)})}var Sf={[Oo]:zo,[ko]:Go,[Vo]:Wo,[zs]:Ho,[zo]:Oo,[Go]:ko,[Wo]:Vo,[Ho]:zs},Qi=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){let i=this._listeners;return i===void 0?!1:i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){let i=this._listeners;if(i===void 0)return;let n=i[t];if(n!==void 0){let r=n.indexOf(e);r!==-1&&n.splice(r,1)}}dispatchEvent(t){let e=this._listeners;if(e===void 0)return;let i=e[t.type];if(i!==void 0){t.target=this;let n=i.slice(0);for(let r=0,a=n.length;r<a;r++)n[r].call(this,t);t.target=null}}},ei=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],od=1234567,Br=Math.PI/180,Hs=180/Math.PI;function Ki(){let s=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(ei[s&255]+ei[s>>8&255]+ei[s>>16&255]+ei[s>>24&255]+"-"+ei[t&255]+ei[t>>8&255]+"-"+ei[t>>16&15|64]+ei[t>>24&255]+"-"+ei[e&63|128]+ei[e>>8&255]+"-"+ei[e>>16&255]+ei[e>>24&255]+ei[i&255]+ei[i>>8&255]+ei[i>>16&255]+ei[i>>24&255]).toLowerCase()}function Qt(s,t,e){return Math.max(t,Math.min(e,s))}function $h(s,t){return(s%t+t)%t}function bm(s,t,e,i,n){return i+(s-t)*(n-i)/(e-t)}function Sm(s,t,e){return s!==t?(e-s)/(t-s):0}function Or(s,t,e){return(1-e)*s+e*t}function Tm(s,t,e,i){return Or(s,t,1-Math.exp(-e*i))}function Em(s,t=1){return t-Math.abs($h(s,t*2)-t)}function wm(s,t,e){return s<=t?0:s>=e?1:(s=(s-t)/(e-t),s*s*(3-2*s))}function Am(s,t,e){return s<=t?0:s>=e?1:(s=(s-t)/(e-t),s*s*s*(s*(s*6-15)+10))}function Rm(s,t){return s+Math.floor(Math.random()*(t-s+1))}function Cm(s,t){return s+Math.random()*(t-s)}function Pm(s){return s*(.5-Math.random())}function Im(s){s!==void 0&&(od=s);let t=od+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Lm(s){return s*Br}function Dm(s){return s*Hs}function Nm(s){return s>0&&Number.isInteger(s)&&2**Math.round(Math.log2(s))===s}function Um(s){return Math.pow(2,Math.ceil(Math.log(s)/Math.LN2))}function Fm(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function Bm(s,t,e,i,n){let r=Math.cos,a=Math.sin,o=r(e/2),l=a(e/2),c=r((t+i)/2),h=a((t+i)/2),f=r((t-i)/2),u=a((t-i)/2),d=r((i-t)/2),m=a((i-t)/2);switch(n){case"XYX":s.set(o*h,l*f,l*u,o*c);break;case"YZY":s.set(l*u,o*h,l*f,o*c);break;case"ZXZ":s.set(l*f,l*u,o*h,o*c);break;case"XZX":s.set(o*h,l*m,l*d,o*c);break;case"YXY":s.set(l*d,o*h,l*m,o*c);break;case"ZYZ":s.set(l*m,l*d,o*h,o*c);break;default:Gt("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+n)}}function zi(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:case Uint8ClampedArray:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function ge(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}var ui={DEG2RAD:Br,RAD2DEG:Hs,generateUUID:Ki,clamp:Qt,euclideanModulo:$h,mapLinear:bm,inverseLerp:Sm,lerp:Or,damp:Tm,pingpong:Em,smoothstep:wm,smootherstep:Am,randInt:Rm,randFloat:Cm,randFloatSpread:Pm,seededRandom:Im,degToRad:Lm,radToDeg:Dm,isPowerOfTwo:Nm,ceilPowerOfTwo:Um,floorPowerOfTwo:Fm,setQuaternionFromProperEuler:Bm,normalize:ge,denormalize:zi},tu=class tu{constructor(t=0,e=0){this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("THREE.Vector2: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,i=this.y,n=t.elements;return this.x=n[0]*e+n[3]*i+n[6],this.y=n[1]*e+n[4]*i+n[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Qt(this.x,t.x,e.x),this.y=Qt(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=Qt(this.x,t,e),this.y=Qt(this.y,t,e),this}clampLength(t,e){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Qt(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let i=this.dot(t)/e;return Math.acos(Qt(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let i=Math.cos(e),n=Math.sin(e),r=this.x-t.x,a=this.y-t.y;return this.x=r*i-a*n+t.x,this.y=r*n+a*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};tu.prototype.isVector2=!0;var nt=tu,ae=class{constructor(t=0,e=0,i=0,n=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=n}static slerpFlat(t,e,i,n,r,a,o){let l=i[n+0],c=i[n+1],h=i[n+2],f=i[n+3],u=r[a+0],d=r[a+1],m=r[a+2],x=r[a+3];if(f!==x||l!==u||c!==d||h!==m){let g=l*u+c*d+h*m+f*x;g<0&&(u=-u,d=-d,m=-m,x=-x,g=-g);let p=1-o;if(g<.9995){let M=Math.acos(g),S=Math.sin(M);p=Math.sin(p*M)/S,o=Math.sin(o*M)/S,l=l*p+u*o,c=c*p+d*o,h=h*p+m*o,f=f*p+x*o}else{l=l*p+u*o,c=c*p+d*o,h=h*p+m*o,f=f*p+x*o;let M=1/Math.sqrt(l*l+c*c+h*h+f*f);l*=M,c*=M,h*=M,f*=M}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=f}static multiplyQuaternionsFlat(t,e,i,n,r,a){let o=i[n],l=i[n+1],c=i[n+2],h=i[n+3],f=r[a],u=r[a+1],d=r[a+2],m=r[a+3];return t[e]=o*m+h*f+l*d-c*u,t[e+1]=l*m+h*u+c*f-o*d,t[e+2]=c*m+h*d+o*u-l*f,t[e+3]=h*m-o*f-l*u-c*d,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,n){return this._x=t,this._y=e,this._z=i,this._w=n,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){let i=t._x,n=t._y,r=t._z,a=t._order,o=Math.cos,l=Math.sin,c=o(i/2),h=o(n/2),f=o(r/2),u=l(i/2),d=l(n/2),m=l(r/2);switch(a){case"XYZ":this._x=u*h*f+c*d*m,this._y=c*d*f-u*h*m,this._z=c*h*m+u*d*f,this._w=c*h*f-u*d*m;break;case"YXZ":this._x=u*h*f+c*d*m,this._y=c*d*f-u*h*m,this._z=c*h*m-u*d*f,this._w=c*h*f+u*d*m;break;case"ZXY":this._x=u*h*f-c*d*m,this._y=c*d*f+u*h*m,this._z=c*h*m+u*d*f,this._w=c*h*f-u*d*m;break;case"ZYX":this._x=u*h*f-c*d*m,this._y=c*d*f+u*h*m,this._z=c*h*m-u*d*f,this._w=c*h*f+u*d*m;break;case"YZX":this._x=u*h*f+c*d*m,this._y=c*d*f+u*h*m,this._z=c*h*m-u*d*f,this._w=c*h*f-u*d*m;break;case"XZY":this._x=u*h*f-c*d*m,this._y=c*d*f-u*h*m,this._z=c*h*m+u*d*f,this._w=c*h*f+u*d*m;break;default:Gt("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let i=e/2,n=Math.sin(i);return this._x=t.x*n,this._y=t.y*n,this._z=t.z*n,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,i=e[0],n=e[4],r=e[8],a=e[1],o=e[5],l=e[9],c=e[2],h=e[6],f=e[10],u=i+o+f;if(u>0){let d=.5/Math.sqrt(u+1);this._w=.25/d,this._x=(h-l)*d,this._y=(r-c)*d,this._z=(a-n)*d}else if(i>o&&i>f){let d=2*Math.sqrt(1+i-o-f);this._w=(h-l)/d,this._x=.25*d,this._y=(n+a)/d,this._z=(r+c)/d}else if(o>f){let d=2*Math.sqrt(1+o-i-f);this._w=(r-c)/d,this._x=(n+a)/d,this._y=.25*d,this._z=(l+h)/d}else{let d=2*Math.sqrt(1+f-i-o);this._w=(a-n)/d,this._x=(r+c)/d,this._y=(l+h)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<1e-8?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Qt(this.dot(t),-1,1)))}rotateTowards(t,e){let i=this.angleTo(t);if(i===0)return this;let n=Math.min(1,e/i);return this.slerp(t,n),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let i=t._x,n=t._y,r=t._z,a=t._w,o=e._x,l=e._y,c=e._z,h=e._w;return this._x=i*h+a*o+n*c-r*l,this._y=n*h+a*l+r*o-i*c,this._z=r*h+a*c+i*l-n*o,this._w=a*h-i*o-n*l-r*c,this._onChangeCallback(),this}slerp(t,e){let i=t._x,n=t._y,r=t._z,a=t._w,o=this.dot(t);o<0&&(i=-i,n=-n,r=-r,a=-a,o=-o);let l=1-e;if(o<.9995){let c=Math.acos(o),h=Math.sin(c);l=Math.sin(l*c)/h,e=Math.sin(e*c)/h,this._x=this._x*l+i*e,this._y=this._y*l+n*e,this._z=this._z*l+r*e,this._w=this._w*l+a*e,this._onChangeCallback()}else this._x=this._x*l+i*e,this._y=this._y*l+n*e,this._z=this._z*l+r*e,this._w=this._w*l+a*e,this.normalize();return this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){let t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),i=Math.random(),n=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(n*Math.sin(t),n*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},eu=class eu{constructor(t=0,e=0,i=0){this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("THREE.Vector3: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(ld.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(ld.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,i=this.y,n=this.z,r=t.elements;return this.x=r[0]*e+r[3]*i+r[6]*n,this.y=r[1]*e+r[4]*i+r[7]*n,this.z=r[2]*e+r[5]*i+r[8]*n,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,i=this.y,n=this.z,r=t.elements,a=1/(r[3]*e+r[7]*i+r[11]*n+r[15]);return this.x=(r[0]*e+r[4]*i+r[8]*n+r[12])*a,this.y=(r[1]*e+r[5]*i+r[9]*n+r[13])*a,this.z=(r[2]*e+r[6]*i+r[10]*n+r[14])*a,this}applyQuaternion(t){let e=this.x,i=this.y,n=this.z,r=t.x,a=t.y,o=t.z,l=t.w,c=2*(a*n-o*i),h=2*(o*e-r*n),f=2*(r*i-a*e);return this.x=e+l*c+a*f-o*h,this.y=i+l*h+o*c-r*f,this.z=n+l*f+r*h-a*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,i=this.y,n=this.z,r=t.elements;return this.x=r[0]*e+r[4]*i+r[8]*n,this.y=r[1]*e+r[5]*i+r[9]*n,this.z=r[2]*e+r[6]*i+r[10]*n,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Qt(this.x,t.x,e.x),this.y=Qt(this.y,t.y,e.y),this.z=Qt(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=Qt(this.x,t,e),this.y=Qt(this.y,t,e),this.z=Qt(this.z,t,e),this}clampLength(t,e){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Qt(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let i=t.x,n=t.y,r=t.z,a=e.x,o=e.y,l=e.z;return this.x=n*l-r*o,this.y=r*a-i*l,this.z=i*o-n*a,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return Zc.copy(this).projectOnVector(t),this.sub(Zc)}reflect(t){return this.sub(Zc.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let i=this.dot(t)/e;return Math.acos(Qt(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,i=this.y-t.y,n=this.z-t.z;return e*e+i*i+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){let n=Math.sin(e)*t;return this.x=n*Math.sin(i),this.y=Math.cos(e)*t,this.z=n*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),n=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=n,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=Math.random()*Math.PI*2,e=Math.random()*2-1,i=Math.sqrt(1-e*e);return this.x=i*Math.cos(t),this.y=e,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};eu.prototype.isVector3=!0;var w=eu,Zc=new w,ld=new ae,iu=class iu{constructor(t,e,i,n,r,a,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,n,r,a,o,l,c)}set(t,e,i,n,r,a,o,l,c){let h=this.elements;return h[0]=t,h[1]=n,h[2]=o,h[3]=e,h[4]=r,h[5]=l,h[6]=i,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let i=t.elements,n=e.elements,r=this.elements,a=i[0],o=i[3],l=i[6],c=i[1],h=i[4],f=i[7],u=i[2],d=i[5],m=i[8],x=n[0],g=n[3],p=n[6],M=n[1],S=n[4],v=n[7],T=n[2],E=n[5],C=n[8];return r[0]=a*x+o*M+l*T,r[3]=a*g+o*S+l*E,r[6]=a*p+o*v+l*C,r[1]=c*x+h*M+f*T,r[4]=c*g+h*S+f*E,r[7]=c*p+h*v+f*C,r[2]=u*x+d*M+m*T,r[5]=u*g+d*S+m*E,r[8]=u*p+d*v+m*C,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],i=t[1],n=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8];return e*a*h-e*o*c-i*r*h+i*o*l+n*r*c-n*a*l}invert(){let t=this.elements,e=t[0],i=t[1],n=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],f=h*a-o*c,u=o*l-h*r,d=c*r-a*l,m=e*f+i*u+n*d;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);let x=1/m;return t[0]=f*x,t[1]=(n*c-h*i)*x,t[2]=(o*i-n*a)*x,t[3]=u*x,t[4]=(h*e-n*l)*x,t[5]=(n*r-o*e)*x,t[6]=d*x,t[7]=(i*l-c*e)*x,t[8]=(a*e-i*r)*x,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,n,r,a,o){let l=Math.cos(r),c=Math.sin(r);return this.set(i*l,i*c,-i*(l*a+c*o)+a+t,-n*c,n*l,-n*(-c*a+l*o)+o+e,0,0,1),this}scale(t,e){return ts("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Kc.makeScale(t,e)),this}rotate(t){return ts("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Kc.makeRotation(-t)),this}translate(t,e){return ts("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Kc.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,i=t.elements;for(let n=0;n<9;n++)if(e[n]!==i[n])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){let i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}};iu.prototype.isMatrix3=!0;var $t=iu,Kc=new $t,cd=new $t().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),hd=new $t().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Om(){let s={enabled:!0,workingColorSpace:Hr,spaces:{},convert:function(n,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===ce&&(n.r=fn(n.r),n.g=fn(n.g),n.b=fn(n.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(n.applyMatrix3(this.spaces[r].toXYZ),n.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===ce&&(n.r=Os(n.r),n.g=Os(n.g),n.b=Os(n.b))),n},workingToColorSpace:function(n,r){return this.convert(n,this.workingColorSpace,r)},colorSpaceToWorking:function(n,r){return this.convert(n,r,this.workingColorSpace)},getPrimaries:function(n){return this.spaces[n].primaries},getTransfer:function(n){return n===_n?Gr:this.spaces[n].transfer},getToneMappingMode:function(n){return this.spaces[n].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(n,r=this.workingColorSpace){return n.fromArray(this.spaces[r].luminanceCoefficients)},define:function(n){Object.assign(this.spaces,n)},_getMatrix:function(n,r,a){return n.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(n){return this.spaces[n].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(n=this.workingColorSpace){return this.spaces[n].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(n,r){return ts("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),s.workingToColorSpace(n,r)},toWorkingColorSpace:function(n,r){return ts("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),s.colorSpaceToWorking(n,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],i=[.3127,.329];return s.define({[Hr]:{primaries:t,whitePoint:i,transfer:Gr,toXYZ:cd,fromXYZ:hd,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:We},outputColorSpaceConfig:{drawingBufferColorSpace:We}},[We]:{primaries:t,whitePoint:i,transfer:ce,toXYZ:cd,fromXYZ:hd,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:We}}}),s}var te=Om();function fn(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function Os(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}var ys,Yo=class{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let i;if(t instanceof HTMLCanvasElement)i=t;else{ys===void 0&&(ys=Wr("canvas")),ys.width=t.width,ys.height=t.height;let n=ys.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),i=ys}return i.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=Wr("canvas");e.width=t.width,e.height=t.height;let i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);let n=i.getImageData(0,0,t.width,t.height),r=n.data;for(let a=0;a<r.length;a++)r[a]=fn(r[a]/255)*255;return i.putImageData(n,0,0),e}else if(t.data){let e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(fn(e[i]/255)*255):e[i]=fn(e[i]);return{data:e,width:t.width,height:t.height}}else return Gt("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},zm=0,Gs=class{constructor(t=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:zm++}),this.uuid=Ki(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){let e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):typeof VideoFrame<"u"&&e instanceof VideoFrame?t.set(e.displayWidth,e.displayHeight,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let i={uuid:this.uuid,url:""},n=this.data;if(n!==null){let r;if(Array.isArray(n)){r=[];for(let a=0,o=n.length;a<o;a++)n[a].isDataTexture?r.push(jc(n[a].image)):r.push(jc(n[a]))}else r=jc(n);i.url=r}return e||(t.images[this.uuid]=i),i}};function jc(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?Yo.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(Gt("Texture: Unable to serialize Texture."),{})}var km=0,Qc=new w,hi=class s extends Qi{constructor(t=s.DEFAULT_IMAGE,e=s.DEFAULT_MAPPING,i=Ji,n=Ji,r=Ke,a=kn,o=Pi,l=gi,c=s.DEFAULT_ANISOTROPY,h=_n){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:km++}),this.uuid=Ki(),this.name="",this.source=new Gs(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=n,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new nt(0,0),this.repeat=new nt(1,1),this.center=new nt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new $t,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Qc).x}get height(){return this.source.getSize(Qc).y}get depth(){return this.source.getSize(Qc).z}get image(){return this.source.data}set image(t){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.normalized=t.normalized,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(let e in t){let i=t[e];if(i===void 0){Gt(`Texture.setValues(): parameter '${e}' has value of undefined.`);continue}let n=this[e];if(n===void 0){Gt(`Texture.setValues(): property '${e}' does not exist.`);continue}n&&i&&n.isVector2&&i.isVector2||n&&i&&n.isVector3&&i.isVector3||n&&i&&n.isMatrix3&&i.isMatrix3?n.copy(i):this[e]=i}}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==zh)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case pn:t.x=t.x-Math.floor(t.x);break;case Ji:t.x=t.x<0?0:1;break;case Xo:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case pn:t.y=t.y-Math.floor(t.y);break;case Ji:t.y=t.y<0?0:1;break;case Xo:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}};hi.DEFAULT_IMAGE=null;hi.DEFAULT_MAPPING=zh;hi.DEFAULT_ANISOTROPY=1;var nu=class nu{constructor(t=0,e=0,i=0,n=1){this.x=t,this.y=e,this.z=i,this.w=n}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,n){return this.x=t,this.y=e,this.z=i,this.w=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("THREE.Vector4: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,i=this.y,n=this.z,r=this.w,a=t.elements;return this.x=a[0]*e+a[4]*i+a[8]*n+a[12]*r,this.y=a[1]*e+a[5]*i+a[9]*n+a[13]*r,this.z=a[2]*e+a[6]*i+a[10]*n+a[14]*r,this.w=a[3]*e+a[7]*i+a[11]*n+a[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,n,r,l=t.elements,c=l[0],h=l[4],f=l[8],u=l[1],d=l[5],m=l[9],x=l[2],g=l[6],p=l[10];if(Math.abs(h-u)<.01&&Math.abs(f-x)<.01&&Math.abs(m-g)<.01){if(Math.abs(h+u)<.1&&Math.abs(f+x)<.1&&Math.abs(m+g)<.1&&Math.abs(c+d+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let S=(c+1)/2,v=(d+1)/2,T=(p+1)/2,E=(h+u)/4,C=(f+x)/4,y=(m+g)/4;return S>v&&S>T?S<.01?(i=0,n=.707106781,r=.707106781):(i=Math.sqrt(S),n=E/i,r=C/i):v>T?v<.01?(i=.707106781,n=0,r=.707106781):(n=Math.sqrt(v),i=E/n,r=y/n):T<.01?(i=.707106781,n=.707106781,r=0):(r=Math.sqrt(T),i=C/r,n=y/r),this.set(i,n,r,e),this}let M=Math.sqrt((g-m)*(g-m)+(f-x)*(f-x)+(u-h)*(u-h));return Math.abs(M)<.001&&(M=1),this.x=(g-m)/M,this.y=(f-x)/M,this.z=(u-h)/M,this.w=Math.acos((c+d+p-1)/2),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Qt(this.x,t.x,e.x),this.y=Qt(this.y,t.y,e.y),this.z=Qt(this.z,t.z,e.z),this.w=Qt(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=Qt(this.x,t,e),this.y=Qt(this.y,t,e),this.z=Qt(this.z,t,e),this.w=Qt(this.w,t,e),this}clampLength(t,e){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Qt(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};nu.prototype.isVector4=!0;var Re=nu,$o=class extends Qi{constructor(t=1,e=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ke,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},i),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=i.depth,this.scissor=new Re(0,0,t,e),this.scissorTest=!1,this.viewport=new Re(0,0,t,e),this.textures=[];let n={width:t,height:e,depth:i.depth},r=new hi(n),a=i.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveColorBuffer=i.resolveColorBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.storeMultisampledColorBuffer=i.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=i.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=i.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview,this.useArrayDepthTexture=i.useArrayDepthTexture}_setTextureOptions(t={}){let e={minFilter:Ke,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),t!==null&&t.renderTarget===null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,i=1){if(this.width!==t||this.height!==e||this.depth!==i){this.width=t,this.height=e,this.depth=i;for(let n=0,r=this.textures.length;n<r;n++)this.textures[n].image.width=t,this.textures[n].image.height=e,this.textures[n].image.depth=i,this.textures[n].isData3DTexture!==!0&&(this.textures[n].isArrayTexture=this.textures[n].image.depth>1);this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,i=t.textures.length;e<i;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;let n=Object.assign({},t.textures[e].image);this.textures[e].source=new Gs(n)}if(this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveColorBuffer=t.resolveColorBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,this.storeMultisampledColorBuffer=t.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=t.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=t.storeMultisampledStencilBuffer,t.depthTexture!==null)if(t.depthTexture.renderTarget===t){let e=t.depthTexture.clone();e.renderTarget=null,this.depthTexture=e}else this.depthTexture=t.depthTexture;return this.samples=t.samples,this.multiview=t.multiview,this.useArrayDepthTexture=t.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},Le=class extends $o{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0}},qr=class extends hi{constructor(t=null,e=1,i=1,n=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:n},this.magFilter=Xe,this.minFilter=Xe,this.wrapR=Ji,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}};var Jo=class extends hi{constructor(t=null,e=1,i=1,n=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:n},this.magFilter=Xe,this.minFilter=Xe,this.wrapR=Ji,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}};var yl=class yl{constructor(t,e,i,n,r,a,o,l,c,h,f,u,d,m,x,g){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,n,r,a,o,l,c,h,f,u,d,m,x,g)}set(t,e,i,n,r,a,o,l,c,h,f,u,d,m,x,g){let p=this.elements;return p[0]=t,p[4]=e,p[8]=i,p[12]=n,p[1]=r,p[5]=a,p[9]=o,p[13]=l,p[2]=c,p[6]=h,p[10]=f,p[14]=u,p[3]=d,p[7]=m,p[11]=x,p[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new yl().fromArray(this.elements)}copy(t){let e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){let e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return this.determinantAffine()===0?(t.set(1,0,0),e.set(0,1,0),i.set(0,0,1),this):(t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){if(t.determinantAffine()===0)return this.identity();let e=this.elements,i=t.elements,n=1/Ms.setFromMatrixColumn(t,0).length(),r=1/Ms.setFromMatrixColumn(t,1).length(),a=1/Ms.setFromMatrixColumn(t,2).length();return e[0]=i[0]*n,e[1]=i[1]*n,e[2]=i[2]*n,e[3]=0,e[4]=i[4]*r,e[5]=i[5]*r,e[6]=i[6]*r,e[7]=0,e[8]=i[8]*a,e[9]=i[9]*a,e[10]=i[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,i=t.x,n=t.y,r=t.z,a=Math.cos(i),o=Math.sin(i),l=Math.cos(n),c=Math.sin(n),h=Math.cos(r),f=Math.sin(r);if(t.order==="XYZ"){let u=a*h,d=a*f,m=o*h,x=o*f;e[0]=l*h,e[4]=-l*f,e[8]=c,e[1]=d+m*c,e[5]=u-x*c,e[9]=-o*l,e[2]=x-u*c,e[6]=m+d*c,e[10]=a*l}else if(t.order==="YXZ"){let u=l*h,d=l*f,m=c*h,x=c*f;e[0]=u+x*o,e[4]=m*o-d,e[8]=a*c,e[1]=a*f,e[5]=a*h,e[9]=-o,e[2]=d*o-m,e[6]=x+u*o,e[10]=a*l}else if(t.order==="ZXY"){let u=l*h,d=l*f,m=c*h,x=c*f;e[0]=u-x*o,e[4]=-a*f,e[8]=m+d*o,e[1]=d+m*o,e[5]=a*h,e[9]=x-u*o,e[2]=-a*c,e[6]=o,e[10]=a*l}else if(t.order==="ZYX"){let u=a*h,d=a*f,m=o*h,x=o*f;e[0]=l*h,e[4]=m*c-d,e[8]=u*c+x,e[1]=l*f,e[5]=x*c+u,e[9]=d*c-m,e[2]=-c,e[6]=o*l,e[10]=a*l}else if(t.order==="YZX"){let u=a*l,d=a*c,m=o*l,x=o*c;e[0]=l*h,e[4]=x-u*f,e[8]=m*f+d,e[1]=f,e[5]=a*h,e[9]=-o*h,e[2]=-c*h,e[6]=d*f+m,e[10]=u-x*f}else if(t.order==="XZY"){let u=a*l,d=a*c,m=o*l,x=o*c;e[0]=l*h,e[4]=-f,e[8]=c*h,e[1]=u*f+x,e[5]=a*h,e[9]=d*f-m,e[2]=m*f-d,e[6]=o*h,e[10]=x*f+u}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Vm,t,Hm)}lookAt(t,e,i){let n=this.elements;return _i.subVectors(t,e),_i.lengthSq()===0&&(_i.z=1),_i.normalize(),wn.crossVectors(i,_i),wn.lengthSq()===0&&(Math.abs(i.z)===1?_i.x+=1e-4:_i.z+=1e-4,_i.normalize(),wn.crossVectors(i,_i)),wn.normalize(),lo.crossVectors(_i,wn),n[0]=wn.x,n[4]=lo.x,n[8]=_i.x,n[1]=wn.y,n[5]=lo.y,n[9]=_i.y,n[2]=wn.z,n[6]=lo.z,n[10]=_i.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let i=t.elements,n=e.elements,r=this.elements,a=i[0],o=i[4],l=i[8],c=i[12],h=i[1],f=i[5],u=i[9],d=i[13],m=i[2],x=i[6],g=i[10],p=i[14],M=i[3],S=i[7],v=i[11],T=i[15],E=n[0],C=n[4],y=n[8],A=n[12],I=n[1],D=n[5],B=n[9],k=n[13],P=n[2],L=n[6],W=n[10],z=n[14],$=n[3],X=n[7],Q=n[11],tt=n[15];return r[0]=a*E+o*I+l*P+c*$,r[4]=a*C+o*D+l*L+c*X,r[8]=a*y+o*B+l*W+c*Q,r[12]=a*A+o*k+l*z+c*tt,r[1]=h*E+f*I+u*P+d*$,r[5]=h*C+f*D+u*L+d*X,r[9]=h*y+f*B+u*W+d*Q,r[13]=h*A+f*k+u*z+d*tt,r[2]=m*E+x*I+g*P+p*$,r[6]=m*C+x*D+g*L+p*X,r[10]=m*y+x*B+g*W+p*Q,r[14]=m*A+x*k+g*z+p*tt,r[3]=M*E+S*I+v*P+T*$,r[7]=M*C+S*D+v*L+T*X,r[11]=M*y+S*B+v*W+T*Q,r[15]=M*A+S*k+v*z+T*tt,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],i=t[4],n=t[8],r=t[12],a=t[1],o=t[5],l=t[9],c=t[13],h=t[2],f=t[6],u=t[10],d=t[14],m=t[3],x=t[7],g=t[11],p=t[15],M=l*d-c*u,S=o*d-c*f,v=o*u-l*f,T=a*d-c*h,E=a*u-l*h,C=a*f-o*h;return e*(x*M-g*S+p*v)-i*(m*M-g*T+p*E)+n*(m*S-x*T+p*C)-r*(m*v-x*E+g*C)}determinantAffine(){let t=this.elements,e=t[0],i=t[4],n=t[8],r=t[1],a=t[5],o=t[9],l=t[2],c=t[6],h=t[10];return e*(a*h-o*c)-i*(r*h-o*l)+n*(r*c-a*l)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){let n=this.elements;return t.isVector3?(n[12]=t.x,n[13]=t.y,n[14]=t.z):(n[12]=t,n[13]=e,n[14]=i),this}invert(){let t=this.elements,e=t[0],i=t[1],n=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],f=t[9],u=t[10],d=t[11],m=t[12],x=t[13],g=t[14],p=t[15],M=e*o-i*a,S=e*l-n*a,v=e*c-r*a,T=i*l-n*o,E=i*c-r*o,C=n*c-r*l,y=h*x-f*m,A=h*g-u*m,I=h*p-d*m,D=f*g-u*x,B=f*p-d*x,k=u*p-d*g,P=M*k-S*B+v*D+T*I-E*A+C*y;if(P===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let L=1/P;return t[0]=(o*k-l*B+c*D)*L,t[1]=(n*B-i*k-r*D)*L,t[2]=(x*C-g*E+p*T)*L,t[3]=(u*E-f*C-d*T)*L,t[4]=(l*I-a*k-c*A)*L,t[5]=(e*k-n*I+r*A)*L,t[6]=(g*v-m*C-p*S)*L,t[7]=(h*C-u*v+d*S)*L,t[8]=(a*B-o*I+c*y)*L,t[9]=(i*I-e*B-r*y)*L,t[10]=(m*E-x*v+p*M)*L,t[11]=(f*v-h*E-d*M)*L,t[12]=(o*A-a*D-l*y)*L,t[13]=(e*D-i*A+n*y)*L,t[14]=(x*S-m*T-g*M)*L,t[15]=(h*T-f*S+u*M)*L,this}scale(t){let e=this.elements,i=t.x,n=t.y,r=t.z;return e[0]*=i,e[4]*=n,e[8]*=r,e[1]*=i,e[5]*=n,e[9]*=r,e[2]*=i,e[6]*=n,e[10]*=r,e[3]*=i,e[7]*=n,e[11]*=r,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],n=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,n))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let i=Math.cos(e),n=Math.sin(e),r=1-i,a=t.x,o=t.y,l=t.z,c=r*a,h=r*o;return this.set(c*a+i,c*o-n*l,c*l+n*o,0,c*o+n*l,h*o+i,h*l-n*a,0,c*l-n*o,h*l+n*a,r*l*l+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,n,r,a){return this.set(1,i,r,0,t,1,a,0,e,n,1,0,0,0,0,1),this}compose(t,e,i){let n=this.elements,r=e._x,a=e._y,o=e._z,l=e._w,c=r+r,h=a+a,f=o+o,u=r*c,d=r*h,m=r*f,x=a*h,g=a*f,p=o*f,M=l*c,S=l*h,v=l*f,T=i.x,E=i.y,C=i.z;return n[0]=(1-(x+p))*T,n[1]=(d+v)*T,n[2]=(m-S)*T,n[3]=0,n[4]=(d-v)*E,n[5]=(1-(u+p))*E,n[6]=(g+M)*E,n[7]=0,n[8]=(m+S)*C,n[9]=(g-M)*C,n[10]=(1-(u+x))*C,n[11]=0,n[12]=t.x,n[13]=t.y,n[14]=t.z,n[15]=1,this}decompose(t,e,i){let n=this.elements;t.x=n[12],t.y=n[13],t.z=n[14];let r=this.determinantAffine();if(r===0)return i.set(1,1,1),e.identity(),this;let a=Ms.set(n[0],n[1],n[2]).length(),o=Ms.set(n[4],n[5],n[6]).length(),l=Ms.set(n[8],n[9],n[10]).length();r<0&&(a=-a),Ui.copy(this);let c=1/a,h=1/o,f=1/l;return Ui.elements[0]*=c,Ui.elements[1]*=c,Ui.elements[2]*=c,Ui.elements[4]*=h,Ui.elements[5]*=h,Ui.elements[6]*=h,Ui.elements[8]*=f,Ui.elements[9]*=f,Ui.elements[10]*=f,e.setFromRotationMatrix(Ui),i.x=a,i.y=o,i.z=l,this}makePerspective(t,e,i,n,r,a,o=ki,l=!1){let c=this.elements,h=2*r/(e-t),f=2*r/(i-n),u=(e+t)/(e-t),d=(i+n)/(i-n),m,x;if(l)m=r/(a-r),x=a*r/(a-r);else if(o===ki)m=-(a+r)/(a-r),x=-2*a*r/(a-r);else if(o===ks)m=-a/(a-r),x=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=f,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=m,c[14]=x,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,i,n,r,a,o=ki,l=!1){let c=this.elements,h=2/(e-t),f=2/(i-n),u=-(e+t)/(e-t),d=-(i+n)/(i-n),m,x;if(l)m=1/(a-r),x=a/(a-r);else if(o===ki)m=-2/(a-r),x=-(a+r)/(a-r);else if(o===ks)m=-1/(a-r),x=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=u,c[1]=0,c[5]=f,c[9]=0,c[13]=d,c[2]=0,c[6]=0,c[10]=m,c[14]=x,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){let e=this.elements,i=t.elements;for(let n=0;n<16;n++)if(e[n]!==i[n])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){let i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}};yl.prototype.isMatrix4=!0;var le=yl,Ms=new w,Ui=new le,Vm=new w(0,0,0),Hm=new w(1,1,1),wn=new w,lo=new w,_i=new w,ud=new le,dd=new ae,mn=class s{constructor(t=0,e=0,i=0,n=s.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=n}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,n=this._order){return this._x=t,this._y=e,this._z=i,this._order=n,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){let n=t.elements,r=n[0],a=n[4],o=n[8],l=n[1],c=n[5],h=n[9],f=n[2],u=n[6],d=n[10];switch(e){case"XYZ":this._y=Math.asin(Qt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,d),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Qt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,d),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,r),this._z=0);break;case"ZXY":this._x=Math.asin(Qt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-f,d),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Qt(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(u,d),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(Qt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-f,r)):(this._x=0,this._y=Math.atan2(o,d));break;case"XZY":this._z=Math.asin(-Qt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,d),this._y=0);break;default:Gt("Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return ud.makeRotationFromQuaternion(t),this.setFromRotationMatrix(ud,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return dd.setFromEuler(this),this.setFromQuaternion(dd,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};mn.DEFAULT_ORDER="XYZ";var Yr=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},Gm=0,fd=new w,bs=new ae,on=new le,co=new w,Ar=new w,Wm=new w,Xm=new ae,pd=new w(1,0,0),md=new w(0,1,0),gd=new w(0,0,1),xd={type:"added"},qm={type:"removed"},Ss={type:"childadded",child:null},th={type:"childremoved",child:null},qe=class s extends Qi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Gm++}),this.uuid=Ki(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=s.DEFAULT_UP.clone();let t=new w,e=new mn,i=new ae,n=new w(1,1,1);function r(){i.setFromEuler(e,!1)}function a(){e.setFromQuaternion(i,void 0,!1)}e._onChange(r),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:n},modelViewMatrix:{value:new le},normalMatrix:{value:new $t}}),this.matrix=new le,this.matrixWorld=new le,this.matrixAutoUpdate=s.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=s.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Yr,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return bs.setFromAxisAngle(t,e),this.quaternion.multiply(bs),this}rotateOnWorldAxis(t,e){return bs.setFromAxisAngle(t,e),this.quaternion.premultiply(bs),this}rotateX(t){return this.rotateOnAxis(pd,t)}rotateY(t){return this.rotateOnAxis(md,t)}rotateZ(t){return this.rotateOnAxis(gd,t)}translateOnAxis(t,e){return fd.copy(t).applyQuaternion(this.quaternion),this.position.add(fd.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(pd,t)}translateY(t){return this.translateOnAxis(md,t)}translateZ(t){return this.translateOnAxis(gd,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(on.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?co.copy(t):co.set(t,e,i);let n=this.parent;this.updateWorldMatrix(!0,!1),Ar.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?on.lookAt(Ar,co,this.up):on.lookAt(co,Ar,this.up),this.quaternion.setFromRotationMatrix(on),n&&(on.extractRotation(n.matrixWorld),bs.setFromRotationMatrix(on),this.quaternion.premultiply(bs.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(Wt("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(xd),Ss.child=t,this.dispatchEvent(Ss),Ss.child=null):Wt("Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(qm),th.child=t,this.dispatchEvent(th),th.child=null),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),on.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),on.multiply(t.parent.matrixWorld)),t.applyMatrix4(on),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(xd),Ss.child=t,this.dispatchEvent(Ss),Ss.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,n=this.children.length;i<n;i++){let a=this.children[i].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);let n=this.children;for(let r=0,a=n.length;r<a;r++)n[r].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ar,t,Wm),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ar,Xm,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(t){t(this);let e=this.children;for(let i=0,n=e.length;i<n;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let i=0,n=e.length;i<n;i++)e[i].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let t=this.pivot;if(t!==null){let e=t.x,i=t.y,n=t.z,r=this.matrix.elements;r[12]+=e-r[0]*e-r[4]*i-r[8]*n,r[13]+=i-r[1]*e-r[5]*i-r[9]*n,r[14]+=n-r[2]*e-r[6]*i-r[10]*n}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let i=0,n=e.length;i<n;i++)e[i].updateMatrixWorld(t)}updateWorldMatrix(t,e,i=!1){let n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||i)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,i=!0),e===!0){let r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0,i)}}toJSON(t){let e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let n={};n.uuid=this.uuid,n.type=this.type,n.name=this.name,n.castShadow=this.castShadow,n.receiveShadow=this.receiveShadow,n.visible=this.visible,n.frustumCulled=this.frustumCulled,n.renderOrder=this.renderOrder,n.static=this.static,n.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(n.userData=this.userData),n.layers=this.layers.mask,n.matrix=this.matrix.toArray(),n.up=this.up.toArray(),this.pivot!==null&&(n.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(n.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(n.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(n.type="InstancedMesh",n.count=this.count,n.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(n.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(n.type="BatchedMesh",n.perObjectFrustumCulled=this.perObjectFrustumCulled,n.sortObjects=this.sortObjects,n.drawRanges=this._drawRanges,n.reservedRanges=this._reservedRanges,n.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),n.instanceInfo=this._instanceInfo.map(o=>({...o})),n.availableInstanceIds=this._availableInstanceIds.slice(),n.availableGeometryIds=this._availableGeometryIds.slice(),n.nextIndexStart=this._nextIndexStart,n.nextVertexStart=this._nextVertexStart,n.geometryCount=this._geometryCount,n.maxInstanceCount=this._maxInstanceCount,n.maxVertexCount=this._maxVertexCount,n.maxIndexCount=this._maxIndexCount,n.geometryInitialized=this._geometryInitialized,n.matricesTexture=this._matricesTexture.toJSON(t),n.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(n.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(n.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(n.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?n.background=this.background.toJSON():this.background.isTexture&&(n.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(n.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){n.geometry=r(t.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let f=l[c];r(t.shapes,f)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(n.bindMode=this.bindMode,n.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),n.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(t.materials,this.material[l]));n.material=o}else n.material=r(t.materials,this.material);if(this.children.length>0){n.children=[];for(let o=0;o<this.children.length;o++)n.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){n.animations=[];for(let o=0;o<this.animations.length;o++){let l=this.animations[o];n.animations.push(r(t.animations,l))}}if(e){let o=a(t.geometries),l=a(t.materials),c=a(t.textures),h=a(t.images),f=a(t.shapes),u=a(t.skeletons),d=a(t.animations),m=a(t.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),h.length>0&&(i.images=h),f.length>0&&(i.shapes=f),u.length>0&&(i.skeletons=u),d.length>0&&(i.animations=d),m.length>0&&(i.nodes=m)}return i.object=n,i;function a(o){let l=[];for(let c in o){let h=o[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.pivot=t.pivot!==null?t.pivot.clone():null,this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.static=t.static,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){let n=t.children[i];this.add(n.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};qe.DEFAULT_UP=new w(0,1,0);qe.DEFAULT_MATRIX_AUTO_UPDATE=!0;qe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Ue=class extends qe{constructor(){super(),this.isGroup=!0,this.type="Group"}},Ym={type:"move"},Ws=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ue,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ue,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new w,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new w),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ue,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new w,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new w,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let i of t.hand.values())this._getHandJoint(e,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,i){let n=null,r=null,a=null,o=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){a=!0;for(let x of t.hand.values()){let g=e.getJointPose(x,i),p=this._getHandJoint(c,x);g!==null&&(p.matrix.fromArray(g.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=g.radius),p.visible=g!==null}let h=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],u=h.position.distanceTo(f.position),d=.02,m=.005;c.inputState.pinching&&u>d+m?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&u<=d-m&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,i),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:t,target:this})));o!==null&&(n=e.getPose(t.targetRaySpace,i),n===null&&r!==null&&(n=r),n!==null&&(o.matrix.fromArray(n.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,n.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(n.linearVelocity)):o.hasLinearVelocity=!1,n.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(n.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Ym)))}return o!==null&&(o.visible=n!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let i=new Ue;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i)}return t.joints[e.jointName]}},Tf={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},An={h:0,s:0,l:0},ho={h:0,s:0,l:0};function eh(s,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?s+(t-s)*6*e:e<1/2?t:e<2/3?s+(t-s)*6*(2/3-e):s}var ct=class{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){let n=t;n&&n.isColor?this.copy(n):typeof n=="number"?this.setHex(n):typeof n=="string"&&this.setStyle(n)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=We){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,te.colorSpaceToWorking(this,e),this}setRGB(t,e,i,n=te.workingColorSpace){return this.r=t,this.g=e,this.b=i,te.colorSpaceToWorking(this,n),this}setHSL(t,e,i,n=te.workingColorSpace){if(t=$h(t,1),e=Qt(e,0,1),i=Qt(i,0,1),e===0)this.r=this.g=this.b=i;else{let r=i<=.5?i*(1+e):i+e-i*e,a=2*i-r;this.r=eh(a,r,t+1/3),this.g=eh(a,r,t),this.b=eh(a,r,t-1/3)}return te.colorSpaceToWorking(this,n),this}setStyle(t,e=We){function i(r){r!==void 0&&parseFloat(r)<1&&Gt("Color: Alpha component of "+t+" will be ignored.")}let n;if(n=/^(\w+)\(([^\)]*)\)/.exec(t)){let r,a=n[1],o=n[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:Gt("Color: Unknown color model "+t)}}else if(n=/^\#([A-Fa-f\d]+)$/.exec(t)){let r=n[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(r,16),e);Gt("Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=We){let i=Tf[t.toLowerCase()];return i!==void 0?this.setHex(i,e):Gt("Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=fn(t.r),this.g=fn(t.g),this.b=fn(t.b),this}copyLinearToSRGB(t){return this.r=Os(t.r),this.g=Os(t.g),this.b=Os(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=We){return te.workingToColorSpace(ii.copy(this),t),Math.round(Qt(ii.r*255,0,255))*65536+Math.round(Qt(ii.g*255,0,255))*256+Math.round(Qt(ii.b*255,0,255))}getHexString(t=We){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=te.workingColorSpace){te.workingToColorSpace(ii.copy(this),e);let i=ii.r,n=ii.g,r=ii.b,a=Math.max(i,n,r),o=Math.min(i,n,r),l,c,h=(o+a)/2;if(o===a)l=0,c=0;else{let f=a-o;switch(c=h<=.5?f/(a+o):f/(2-a-o),a){case i:l=(n-r)/f+(n<r?6:0);break;case n:l=(r-i)/f+2;break;case r:l=(i-n)/f+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=te.workingColorSpace){return te.workingToColorSpace(ii.copy(this),e),t.r=ii.r,t.g=ii.g,t.b=ii.b,t}getStyle(t=We){te.workingToColorSpace(ii.copy(this),t);let e=ii.r,i=ii.g,n=ii.b;return t!==We?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${n.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(n*255)})`}offsetHSL(t,e,i){return this.getHSL(An),this.setHSL(An.h+t,An.s+e,An.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(An),t.getHSL(ho);let i=Or(An.h,ho.h,e),n=Or(An.s,ho.s,e),r=Or(An.l,ho.l,e);return this.setHSL(i,n,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,i=this.g,n=this.b,r=t.elements;return this.r=r[0]*e+r[3]*i+r[6]*n,this.g=r[1]*e+r[4]*i+r[7]*n,this.b=r[2]*e+r[5]*i+r[8]*n,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},ii=new ct;ct.NAMES=Tf;var $r=class s{constructor(t,e=1,i=1e3){this.isFog=!0,this.name="",this.color=new ct(t),this.near=e,this.far=i}clone(){return new s(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},es=class extends qe{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new mn,this.environmentIntensity=1,this.environmentRotation=new mn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),e.object.backgroundBlurriness=this.backgroundBlurriness,e.object.backgroundIntensity=this.backgroundIntensity,e.object.backgroundRotation=this.backgroundRotation.toArray(),e.object.environmentIntensity=this.environmentIntensity,e.object.environmentRotation=this.environmentRotation.toArray(),e}},Fi=new w,ln=new w,ih=new w,cn=new w,Ts=new w,Es=new w,_d=new w,nh=new w,sh=new w,rh=new w,ah=new Re,oh=new Re,lh=new Re,dn=class s{constructor(t=new w,e=new w,i=new w){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,n){n.subVectors(i,e),Fi.subVectors(t,e),n.cross(Fi);let r=n.lengthSq();return r>0?n.multiplyScalar(1/Math.sqrt(r)):n.set(0,0,0)}static getBarycoord(t,e,i,n,r){Fi.subVectors(n,e),ln.subVectors(i,e),ih.subVectors(t,e);let a=Fi.dot(Fi),o=Fi.dot(ln),l=Fi.dot(ih),c=ln.dot(ln),h=ln.dot(ih),f=a*c-o*o;if(f===0)return r.set(0,0,0),null;let u=1/f,d=(c*l-o*h)*u,m=(a*h-o*l)*u;return r.set(1-d-m,m,d)}static containsPoint(t,e,i,n){return this.getBarycoord(t,e,i,n,cn)===null?!1:cn.x>=0&&cn.y>=0&&cn.x+cn.y<=1}static getInterpolation(t,e,i,n,r,a,o,l){return this.getBarycoord(t,e,i,n,cn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,cn.x),l.addScaledVector(a,cn.y),l.addScaledVector(o,cn.z),l)}static getInterpolatedAttribute(t,e,i,n,r,a){return ah.setScalar(0),oh.setScalar(0),lh.setScalar(0),ah.fromBufferAttribute(t,e),oh.fromBufferAttribute(t,i),lh.fromBufferAttribute(t,n),a.setScalar(0),a.addScaledVector(ah,r.x),a.addScaledVector(oh,r.y),a.addScaledVector(lh,r.z),a}static isFrontFacing(t,e,i,n){return Fi.subVectors(i,e),ln.subVectors(t,e),Fi.cross(ln).dot(n)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,n){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[n]),this}setFromAttributeAndIndices(t,e,i,n){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,n),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Fi.subVectors(this.c,this.b),ln.subVectors(this.a,this.b),Fi.cross(ln).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return s.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return s.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,i,n,r){return s.getInterpolation(t,this.a,this.b,this.c,e,i,n,r)}containsPoint(t){return s.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return s.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let i=this.a,n=this.b,r=this.c,a,o;Ts.subVectors(n,i),Es.subVectors(r,i),nh.subVectors(t,i);let l=Ts.dot(nh),c=Es.dot(nh);if(l<=0&&c<=0)return e.copy(i);sh.subVectors(t,n);let h=Ts.dot(sh),f=Es.dot(sh);if(h>=0&&f<=h)return e.copy(n);let u=l*f-h*c;if(u<=0&&l>=0&&h<=0)return a=l/(l-h),e.copy(i).addScaledVector(Ts,a);rh.subVectors(t,r);let d=Ts.dot(rh),m=Es.dot(rh);if(m>=0&&d<=m)return e.copy(r);let x=d*c-l*m;if(x<=0&&c>=0&&m<=0)return o=c/(c-m),e.copy(i).addScaledVector(Es,o);let g=h*m-d*f;if(g<=0&&f-h>=0&&d-m>=0)return _d.subVectors(r,n),o=(f-h)/(f-h+(d-m)),e.copy(n).addScaledVector(_d,o);let p=1/(g+x+u);return a=x*p,o=u*p,e.copy(i).addScaledVector(Ts,a).addScaledVector(Es,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},tn=class{constructor(t=new w(1/0,1/0,1/0),e=new w(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(Bi.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(Bi.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let i=Bi.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);let i=t.geometry;if(i!==void 0){let r=i.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,Bi):Bi.fromBufferAttribute(r,a),Bi.applyMatrix4(t.matrixWorld),this.expandByPoint(Bi);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),uo.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),uo.copy(i.boundingBox)),uo.applyMatrix4(t.matrixWorld),this.union(uo)}let n=t.children;for(let r=0,a=n.length;r<a;r++)this.expandByObject(n[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Bi),Bi.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Rr),fo.subVectors(this.max,Rr),ws.subVectors(t.a,Rr),As.subVectors(t.b,Rr),Rs.subVectors(t.c,Rr),Rn.subVectors(As,ws),Cn.subVectors(Rs,As),Zn.subVectors(ws,Rs);let e=[0,-Rn.z,Rn.y,0,-Cn.z,Cn.y,0,-Zn.z,Zn.y,Rn.z,0,-Rn.x,Cn.z,0,-Cn.x,Zn.z,0,-Zn.x,-Rn.y,Rn.x,0,-Cn.y,Cn.x,0,-Zn.y,Zn.x,0];return!ch(e,ws,As,Rs,fo)||(e=[1,0,0,0,1,0,0,0,1],!ch(e,ws,As,Rs,fo))?!1:(po.crossVectors(Rn,Cn),e=[po.x,po.y,po.z],ch(e,ws,As,Rs,fo))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Bi).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Bi).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(hn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),hn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),hn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),hn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),hn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),hn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),hn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),hn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(hn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}},hn=[new w,new w,new w,new w,new w,new w,new w,new w],Bi=new w,uo=new tn,ws=new w,As=new w,Rs=new w,Rn=new w,Cn=new w,Zn=new w,Rr=new w,fo=new w,po=new w,Kn=new w;function ch(s,t,e,i,n){for(let r=0,a=s.length-3;r<=a;r+=3){Kn.fromArray(s,r);let o=n.x*Math.abs(Kn.x)+n.y*Math.abs(Kn.y)+n.z*Math.abs(Kn.z),l=t.dot(Kn),c=e.dot(Kn),h=i.dot(Kn);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}var Oe=new w,mo=new nt,$m=0,Fe=class extends Qi{constructor(t,e,i=!1){if(super(),Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:$m++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=qh,this.updateRanges=[],this.gpuType=Ci,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let n=0,r=this.itemSize;n<r;n++)this.array[t+n]=e.array[i+n];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)mo.fromBufferAttribute(this,e),mo.applyMatrix3(t),this.setXY(e,mo.x,mo.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)Oe.fromBufferAttribute(this,e),Oe.applyMatrix3(t),this.setXYZ(e,Oe.x,Oe.y,Oe.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)Oe.fromBufferAttribute(this,e),Oe.applyMatrix4(t),this.setXYZ(e,Oe.x,Oe.y,Oe.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)Oe.fromBufferAttribute(this,e),Oe.applyNormalMatrix(t),this.setXYZ(e,Oe.x,Oe.y,Oe.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)Oe.fromBufferAttribute(this,e),Oe.transformDirection(t),this.setXYZ(e,Oe.x,Oe.y,Oe.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=zi(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=ge(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=zi(e,this.array)),e}setX(t,e){return this.normalized&&(e=ge(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=zi(e,this.array)),e}setY(t,e){return this.normalized&&(e=ge(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=zi(e,this.array)),e}setZ(t,e){return this.normalized&&(e=ge(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=zi(e,this.array)),e}setW(t,e){return this.normalized&&(e=ge(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=ge(e,this.array),i=ge(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,n){return t*=this.itemSize,this.normalized&&(e=ge(e,this.array),i=ge(i,this.array),n=ge(n,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=n,this}setXYZW(t,e,i,n,r){return t*=this.itemSize,this.normalized&&(e=ge(e,this.array),i=ge(i,this.array),n=ge(n,this.array),r=ge(r,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=n,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return t.name=this.name,t.usage=this.usage,t.gpuType=this.gpuType,t}dispose(){this.dispatchEvent({type:"dispose"})}};var Jr=class extends Fe{constructor(t,e,i){super(new Uint16Array(t),e,i)}};var Zr=class extends Fe{constructor(t,e,i){super(new Uint32Array(t),e,i)}};var Yt=class extends Fe{constructor(t,e,i){super(new Float32Array(t),e,i)}},Jm=new tn,Cr=new w,hh=new w,Vi=class{constructor(t=new w,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let i=this.center;e!==void 0?i.copy(e):Jm.setFromPoints(t).getCenter(i);let n=0;for(let r=0,a=t.length;r<a;r++)n=Math.max(n,i.distanceToSquared(t[r]));return this.radius=Math.sqrt(n),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Cr.subVectors(t,this.center);let e=Cr.lengthSq();if(e>this.radius*this.radius){let i=Math.sqrt(e),n=(i-this.radius)*.5;this.center.addScaledVector(Cr,n/i),this.radius+=n}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(hh.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Cr.copy(t.center).add(hh)),this.expandByPoint(Cr.copy(t.center).sub(hh))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}},Zm=0,Ai=new le,uh=new qe,Cs=new w,vi=new tn,Pr=new tn,Ge=new w,xe=class s extends Qi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Zm++}),this.uuid=Ki(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(ym(t)?Zr:Jr)(t,1):this.index=t,this}setIndirect(t,e=0){return this.indirect=t,this.indirectOffset=e,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let i=this.attributes.normal;if(i!==void 0){let r=new $t().getNormalMatrix(t);i.applyNormalMatrix(r),i.needsUpdate=!0}let n=this.attributes.tangent;return n!==void 0&&(n.transformDirection(t),n.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(t){return Ai.makeRotationFromQuaternion(t),this.applyMatrix4(Ai),this}rotateX(t){return Ai.makeRotationX(t),this.applyMatrix4(Ai),this}rotateY(t){return Ai.makeRotationY(t),this.applyMatrix4(Ai),this}rotateZ(t){return Ai.makeRotationZ(t),this.applyMatrix4(Ai),this}translate(t,e,i){return Ai.makeTranslation(t,e,i),this.applyMatrix4(Ai),this}scale(t,e,i){return Ai.makeScale(t,e,i),this.applyMatrix4(Ai),this}lookAt(t){return uh.lookAt(t),uh.updateMatrix(),this.applyMatrix4(uh.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Cs).negate(),this.translate(Cs.x,Cs.y,Cs.z),this}setFromPoints(t){let e=this.getAttribute("position");if(e===void 0){let i=[];for(let n=0,r=t.length;n<r;n++){let a=t[n];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new Yt(i,3))}else{let i=Math.min(t.length,e.count);for(let n=0;n<i;n++){let r=t[n];e.setXYZ(n,r.x,r.y,r.z||0)}t.length>e.count&&Gt("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new tn);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Wt("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new w(-1/0,-1/0,-1/0),new w(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,n=e.length;i<n;i++){let r=e[i];vi.setFromBufferAttribute(r),this.morphTargetsRelative?(Ge.addVectors(this.boundingBox.min,vi.min),this.boundingBox.expandByPoint(Ge),Ge.addVectors(this.boundingBox.max,vi.max),this.boundingBox.expandByPoint(Ge)):(this.boundingBox.expandByPoint(vi.min),this.boundingBox.expandByPoint(vi.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Wt('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Vi);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Wt("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new w,1/0);return}if(t){let i=this.boundingSphere.center;if(vi.setFromBufferAttribute(t),e)for(let r=0,a=e.length;r<a;r++){let o=e[r];Pr.setFromBufferAttribute(o),this.morphTargetsRelative?(Ge.addVectors(vi.min,Pr.min),vi.expandByPoint(Ge),Ge.addVectors(vi.max,Pr.max),vi.expandByPoint(Ge)):(vi.expandByPoint(Pr.min),vi.expandByPoint(Pr.max))}vi.getCenter(i);let n=0;for(let r=0,a=t.count;r<a;r++)Ge.fromBufferAttribute(t,r),n=Math.max(n,i.distanceToSquared(Ge));if(e)for(let r=0,a=e.length;r<a;r++){let o=e[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)Ge.fromBufferAttribute(o,c),l&&(Cs.fromBufferAttribute(t,c),Ge.add(Cs)),n=Math.max(n,i.distanceToSquared(Ge))}this.boundingSphere.radius=Math.sqrt(n),isNaN(this.boundingSphere.radius)&&Wt('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){Wt("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let i=e.position,n=e.normal,r=e.uv,a=this.getAttribute("tangent");(a===void 0||a.count!==i.count)&&(a=new Fe(new Float32Array(4*i.count),4),this.setAttribute("tangent",a));let o=[],l=[];for(let y=0;y<i.count;y++)o[y]=new w,l[y]=new w;let c=new w,h=new w,f=new w,u=new nt,d=new nt,m=new nt,x=new w,g=new w;function p(y,A,I){c.fromBufferAttribute(i,y),h.fromBufferAttribute(i,A),f.fromBufferAttribute(i,I),u.fromBufferAttribute(r,y),d.fromBufferAttribute(r,A),m.fromBufferAttribute(r,I),h.sub(c),f.sub(c),d.sub(u),m.sub(u);let D=1/(d.x*m.y-m.x*d.y);isFinite(D)&&(x.copy(h).multiplyScalar(m.y).addScaledVector(f,-d.y).multiplyScalar(D),g.copy(f).multiplyScalar(d.x).addScaledVector(h,-m.x).multiplyScalar(D),o[y].add(x),o[A].add(x),o[I].add(x),l[y].add(g),l[A].add(g),l[I].add(g))}let M=this.groups;M.length===0&&(M=[{start:0,count:t.count}]);for(let y=0,A=M.length;y<A;++y){let I=M[y],D=I.start,B=I.count;for(let k=D,P=D+B;k<P;k+=3)p(t.getX(k+0),t.getX(k+1),t.getX(k+2))}let S=new w,v=new w,T=new w,E=new w;function C(y){T.fromBufferAttribute(n,y),E.copy(T);let A=o[y];S.copy(A),S.sub(T.multiplyScalar(T.dot(A))).normalize(),v.crossVectors(E,A);let D=v.dot(l[y])<0?-1:1;a.setXYZW(y,S.x,S.y,S.z,D)}for(let y=0,A=M.length;y<A;++y){let I=M[y],D=I.start,B=I.count;for(let k=D,P=D+B;k<P;k+=3)C(t.getX(k+0)),C(t.getX(k+1)),C(t.getX(k+2))}this._transformed=!0}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0||i.count!==e.count)i=new Fe(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let u=0,d=i.count;u<d;u++)i.setXYZ(u,0,0,0);let n=new w,r=new w,a=new w,o=new w,l=new w,c=new w,h=new w,f=new w;if(t)for(let u=0,d=t.count;u<d;u+=3){let m=t.getX(u+0),x=t.getX(u+1),g=t.getX(u+2);n.fromBufferAttribute(e,m),r.fromBufferAttribute(e,x),a.fromBufferAttribute(e,g),h.subVectors(a,r),f.subVectors(n,r),h.cross(f),o.fromBufferAttribute(i,m),l.fromBufferAttribute(i,x),c.fromBufferAttribute(i,g),o.add(h),l.add(h),c.add(h),i.setXYZ(m,o.x,o.y,o.z),i.setXYZ(x,l.x,l.y,l.z),i.setXYZ(g,c.x,c.y,c.z)}else for(let u=0,d=e.count;u<d;u+=3)n.fromBufferAttribute(e,u+0),r.fromBufferAttribute(e,u+1),a.fromBufferAttribute(e,u+2),h.subVectors(a,r),f.subVectors(n,r),h.cross(f),i.setXYZ(u+0,h.x,h.y,h.z),i.setXYZ(u+1,h.x,h.y,h.z),i.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)Ge.fromBufferAttribute(t,e),Ge.normalize(),t.setXYZ(e,Ge.x,Ge.y,Ge.z)}toNonIndexed(){function t(o,l){let c=o.array,h=o.itemSize,f=o.normalized,u=new c.constructor(l.length*h),d=0,m=0;for(let x=0,g=l.length;x<g;x++){o.isInterleavedBufferAttribute?d=l[x]*o.data.stride+o.offset:d=l[x]*h;for(let p=0;p<h;p++)u[m++]=c[d++]}return new Fe(u,h,f)}if(this.index===null)return Gt("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new s,i=this.index.array,n=this.attributes;for(let o in n){let l=n[o],c=t(l,i);e.setAttribute(o,c)}let r=this.morphAttributes;for(let o in r){let l=[],c=r[o];for(let h=0,f=c.length;h<f;h++){let u=c[h],d=t(u,i);l.push(d)}e.morphAttributes[o]=l}e.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,l=a.length;o<l;o++){let c=a[o];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){let t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,t.name=this.name,Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let i=this.attributes;for(let l in i){let c=i[l];t.data.attributes[l]=c.toJSON(t.data)}let n={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let f=0,u=c.length;f<u;f++){let d=c[f];h.push(d.toJSON(t.data))}h.length>0&&(n[l]=h,r=!0)}r&&(t.data.morphAttributes=n,t.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(t.data.boundingSphere=o.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let i=t.index;i!==null&&this.setIndex(i.clone());let n=t.attributes;for(let c in n){let h=n[c];this.setAttribute(c,h.clone(e))}let r=t.morphAttributes;for(let c in r){let h=[],f=r[c];for(let u=0,d=f.length;u<d;u++)h.push(f[u].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;let a=t.groups;for(let c=0,h=a.length;c<h;c++){let f=a[c];this.addGroup(f.start,f.count,f.materialIndex)}let o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());let l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this._transformed=t._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}},Zo=class{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=qh,this.updateRanges=[],this.version=0,this.uuid=Ki()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,i){t*=this.stride,i*=e.stride;for(let n=0,r=this.stride;n<r;n++)this.array[t+n]=e.array[i+n];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Ki()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(e,this.stride);return i.setUsage(this.usage),i}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Ki()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer)));let e={uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride};return e.usage=this.usage,e}},ci=new w,Kr=class s{constructor(t,e,i,n=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=i,this.normalized=n}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,i=this.data.count;e<i;e++)ci.fromBufferAttribute(this,e),ci.applyMatrix4(t),this.setXYZ(e,ci.x,ci.y,ci.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)ci.fromBufferAttribute(this,e),ci.applyNormalMatrix(t),this.setXYZ(e,ci.x,ci.y,ci.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)ci.fromBufferAttribute(this,e),ci.transformDirection(t),this.setXYZ(e,ci.x,ci.y,ci.z);return this}getComponent(t,e){let i=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(i=zi(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=ge(i,this.array)),this.data.array[t*this.data.stride+this.offset+e]=i,this}setX(t,e){return this.normalized&&(e=ge(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=ge(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=ge(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=ge(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=zi(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=zi(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=zi(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=zi(e,this.array)),e}setXY(t,e,i){return t=t*this.data.stride+this.offset,this.normalized&&(e=ge(e,this.array),i=ge(i,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this}setXYZ(t,e,i,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=ge(e,this.array),i=ge(i,this.array),n=ge(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=n,this}setXYZW(t,e,i,n,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=ge(e,this.array),i=ge(i,this.array),n=ge(n,this.array),r=ge(r,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=n,this.data.array[t+3]=r,this}clone(t){if(t===void 0){Xr("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let e=[];for(let i=0;i<this.count;i++){let n=i*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[n+r])}return new Fe(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new s(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){Xr("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let e=[];for(let i=0;i<this.count;i++){let n=i*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[n+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},dh=new w,Km=new w,jm=new $t,Oi=class{constructor(t=new w(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,i,n){return this.normal.set(t,e,i),this.constant=n,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,i){let n=dh.subVectors(i,e).cross(Km.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(n,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e,i=!0){let n=t.delta(dh),r=this.normal.dot(n);if(r===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let a=-(t.start.dot(this.normal)+this.constant)/r;return i===!0&&(a<0||a>1)?null:e.copy(t.start).addScaledVector(n,a)}intersectsLine(t){let e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let i=e||jm.getNormalMatrix(t),n=this.coplanarPoint(dh).applyMatrix4(t),r=this.normal.applyMatrix3(i).normalize();return this.constant=-n.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(t){return this.normal.fromArray(t.normal),this.constant=t.constant,this}},Qm=0,en=class extends Qi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Qm++}),this.uuid=Ki(),this.name="",this.type="Material",this.blending=On,this.side=Bn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Fh,this.blendDst=Bh,this.blendEquation=as,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ct(0,0,0),this.blendAlpha=0,this.depthFunc=zs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=ff,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Bo,this.stencilZFail=Bo,this.stencilZPass=Bo,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let i=t[e];if(i===void 0){Gt(`Material: parameter '${e}' has value of undefined.`);continue}let n=this[e];if(n===void 0){Gt(`Material: '${e}' is not a property of THREE.${this.type}.`);continue}n&&n.isColor?n.set(i):n&&n.isVector2&&i&&i.isVector2||n&&n.isEuler&&i&&i.isEuler||n&&n.isVector3&&i&&i.isVector3?n.copy(i):this[e]=i}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,i.blending=this.blending,i.side=this.side,i.shadowSide=this.shadowSide,i.vertexColors=this.vertexColors,i.opacity=this.opacity,i.transparent=this.transparent,i.blendSrc=this.blendSrc,i.blendDst=this.blendDst,i.blendEquation=this.blendEquation,i.blendSrcAlpha=this.blendSrcAlpha,i.blendDstAlpha=this.blendDstAlpha,i.blendEquationAlpha=this.blendEquationAlpha,i.blendColor=this.blendColor.getHex(),i.blendAlpha=this.blendAlpha,i.depthFunc=this.depthFunc,i.depthTest=this.depthTest,i.depthWrite=this.depthWrite,i.colorWrite=this.colorWrite,i.clipIntersection=this.clipIntersection,i.clipShadows=this.clipShadows,i.stencilWriteMask=this.stencilWriteMask,i.stencilFunc=this.stencilFunc,i.stencilRef=this.stencilRef,i.stencilFuncMask=this.stencilFuncMask,i.stencilFail=this.stencilFail,i.stencilZFail=this.stencilZFail,i.stencilZPass=this.stencilZPass,i.stencilWrite=this.stencilWrite,i.polygonOffset=this.polygonOffset,i.polygonOffsetFactor=this.polygonOffsetFactor,i.polygonOffsetUnits=this.polygonOffsetUnits,i.dithering=this.dithering,i.alphaTest=this.alphaTest,i.alphaHash=this.alphaHash,i.alphaToCoverage=this.alphaToCoverage,i.premultipliedAlpha=this.premultipliedAlpha,i.forceSinglePass=this.forceSinglePass,i.allowOverride=this.allowOverride,i.visible=this.visible,i.toneMapped=this.toneMapped,i.name=this.name,this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(i.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(i.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(i.rotation=this.rotation),this.depthPacking!==void 0&&(i.depthPacking=this.depthPacking),this.linewidth!==void 0&&(i.linewidth=this.linewidth),this.linecap!==void 0&&(i.linecap=this.linecap),this.linejoin!==void 0&&(i.linejoin=this.linejoin),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.wireframe!==void 0&&(i.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(i.flatShading=this.flatShading),this.fog!==void 0&&(i.fog=this.fog),Object.keys(this.userData).length>0&&(i.userData=this.userData);function n(r){let a=[];for(let o in r){let l=r[o];delete l.metadata,a.push(l)}return a}if(e){let r=n(t.textures),a=n(t.images);r.length>0&&(i.textures=r),a.length>0&&(i.images=a)}return i}fromJSON(t,e){if(t.uuid!==void 0&&(this.uuid=t.uuid),t.name!==void 0&&(this.name=t.name),t.color!==void 0&&this.color!==void 0&&this.color.setHex(t.color),t.roughness!==void 0&&(this.roughness=t.roughness),t.metalness!==void 0&&(this.metalness=t.metalness),t.sheen!==void 0&&(this.sheen=t.sheen),t.sheenColor!==void 0&&(this.sheenColor=new ct().setHex(t.sheenColor)),t.sheenRoughness!==void 0&&(this.sheenRoughness=t.sheenRoughness),t.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(t.emissive),t.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(t.specular),t.specularIntensity!==void 0&&(this.specularIntensity=t.specularIntensity),t.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(t.specularColor),t.shininess!==void 0&&(this.shininess=t.shininess),t.clearcoat!==void 0&&(this.clearcoat=t.clearcoat),t.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=t.clearcoatRoughness),t.dispersion!==void 0&&(this.dispersion=t.dispersion),t.retroreflectivity!==void 0&&(this.retroreflectivity=t.retroreflectivity),t.iridescence!==void 0&&(this.iridescence=t.iridescence),t.iridescenceIOR!==void 0&&(this.iridescenceIOR=t.iridescenceIOR),t.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=t.iridescenceThicknessRange),t.transmission!==void 0&&(this.transmission=t.transmission),t.thickness!==void 0&&(this.thickness=t.thickness),t.attenuationDistance!==void 0&&(this.attenuationDistance=t.attenuationDistance),t.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(t.attenuationColor),t.anisotropy!==void 0&&(this.anisotropy=t.anisotropy),t.anisotropyRotation!==void 0&&(this.anisotropyRotation=t.anisotropyRotation),t.fog!==void 0&&(this.fog=t.fog),t.flatShading!==void 0&&(this.flatShading=t.flatShading),t.blending!==void 0&&(this.blending=t.blending),t.combine!==void 0&&(this.combine=t.combine),t.side!==void 0&&(this.side=t.side),t.shadowSide!==void 0&&(this.shadowSide=t.shadowSide),t.opacity!==void 0&&(this.opacity=t.opacity),t.transparent!==void 0&&(this.transparent=t.transparent),t.alphaTest!==void 0&&(this.alphaTest=t.alphaTest),t.alphaHash!==void 0&&(this.alphaHash=t.alphaHash),t.depthFunc!==void 0&&(this.depthFunc=t.depthFunc),t.depthTest!==void 0&&(this.depthTest=t.depthTest),t.depthWrite!==void 0&&(this.depthWrite=t.depthWrite),t.colorWrite!==void 0&&(this.colorWrite=t.colorWrite),t.clippingPlanes!==void 0&&(this.clippingPlanes=t.clippingPlanes.map(i=>new Oi().fromJSON(i))),t.clipIntersection!==void 0&&(this.clipIntersection=t.clipIntersection),t.clipShadows!==void 0&&(this.clipShadows=t.clipShadows),t.depthPacking!==void 0&&(this.depthPacking=t.depthPacking),t.blendSrc!==void 0&&(this.blendSrc=t.blendSrc),t.blendDst!==void 0&&(this.blendDst=t.blendDst),t.blendEquation!==void 0&&(this.blendEquation=t.blendEquation),t.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=t.blendSrcAlpha),t.blendDstAlpha!==void 0&&(this.blendDstAlpha=t.blendDstAlpha),t.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=t.blendEquationAlpha),t.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(t.blendColor),t.blendAlpha!==void 0&&(this.blendAlpha=t.blendAlpha),t.stencilWriteMask!==void 0&&(this.stencilWriteMask=t.stencilWriteMask),t.stencilFunc!==void 0&&(this.stencilFunc=t.stencilFunc),t.stencilRef!==void 0&&(this.stencilRef=t.stencilRef),t.stencilFuncMask!==void 0&&(this.stencilFuncMask=t.stencilFuncMask),t.stencilFail!==void 0&&(this.stencilFail=t.stencilFail),t.stencilZFail!==void 0&&(this.stencilZFail=t.stencilZFail),t.stencilZPass!==void 0&&(this.stencilZPass=t.stencilZPass),t.stencilWrite!==void 0&&(this.stencilWrite=t.stencilWrite),t.wireframe!==void 0&&(this.wireframe=t.wireframe),t.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=t.wireframeLinewidth),t.wireframeLinecap!==void 0&&(this.wireframeLinecap=t.wireframeLinecap),t.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=t.wireframeLinejoin),t.rotation!==void 0&&(this.rotation=t.rotation),t.linewidth!==void 0&&(this.linewidth=t.linewidth),t.linecap!==void 0&&(this.linecap=t.linecap),t.linejoin!==void 0&&(this.linejoin=t.linejoin),t.dashSize!==void 0&&(this.dashSize=t.dashSize),t.gapSize!==void 0&&(this.gapSize=t.gapSize),t.scale!==void 0&&(this.scale=t.scale),t.polygonOffset!==void 0&&(this.polygonOffset=t.polygonOffset),t.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=t.polygonOffsetFactor),t.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=t.polygonOffsetUnits),t.dithering!==void 0&&(this.dithering=t.dithering),t.alphaToCoverage!==void 0&&(this.alphaToCoverage=t.alphaToCoverage),t.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=t.premultipliedAlpha),t.forceSinglePass!==void 0&&(this.forceSinglePass=t.forceSinglePass),t.allowOverride!==void 0&&(this.allowOverride=t.allowOverride),t.visible!==void 0&&(this.visible=t.visible),t.toneMapped!==void 0&&(this.toneMapped=t.toneMapped),t.userData!==void 0&&(this.userData=t.userData),t.vertexColors!==void 0&&(typeof t.vertexColors=="number"?this.vertexColors=t.vertexColors>0:this.vertexColors=t.vertexColors),t.size!==void 0&&(this.size=t.size),t.sizeAttenuation!==void 0&&(this.sizeAttenuation=t.sizeAttenuation),t.map!==void 0&&(this.map=e[t.map]||null),t.matcap!==void 0&&(this.matcap=e[t.matcap]||null),t.alphaMap!==void 0&&(this.alphaMap=e[t.alphaMap]||null),t.bumpMap!==void 0&&(this.bumpMap=e[t.bumpMap]||null),t.bumpScale!==void 0&&(this.bumpScale=t.bumpScale),t.normalMap!==void 0&&(this.normalMap=e[t.normalMap]||null),t.normalMapType!==void 0&&(this.normalMapType=t.normalMapType),t.normalScale!==void 0){let i=t.normalScale;Array.isArray(i)===!1&&(i=[i,i]),this.normalScale=new nt().fromArray(i)}return t.displacementMap!==void 0&&(this.displacementMap=e[t.displacementMap]||null),t.displacementScale!==void 0&&(this.displacementScale=t.displacementScale),t.displacementBias!==void 0&&(this.displacementBias=t.displacementBias),t.roughnessMap!==void 0&&(this.roughnessMap=e[t.roughnessMap]||null),t.metalnessMap!==void 0&&(this.metalnessMap=e[t.metalnessMap]||null),t.emissiveMap!==void 0&&(this.emissiveMap=e[t.emissiveMap]||null),t.emissiveIntensity!==void 0&&(this.emissiveIntensity=t.emissiveIntensity),t.specularMap!==void 0&&(this.specularMap=e[t.specularMap]||null),t.specularIntensityMap!==void 0&&(this.specularIntensityMap=e[t.specularIntensityMap]||null),t.specularColorMap!==void 0&&(this.specularColorMap=e[t.specularColorMap]||null),t.envMap!==void 0&&(this.envMap=e[t.envMap]||null),t.envMapRotation!==void 0&&this.envMapRotation.fromArray(t.envMapRotation),t.envMapIntensity!==void 0&&(this.envMapIntensity=t.envMapIntensity),t.reflectivity!==void 0&&(this.reflectivity=t.reflectivity),t.refractionRatio!==void 0&&(this.refractionRatio=t.refractionRatio),t.lightMap!==void 0&&(this.lightMap=e[t.lightMap]||null),t.lightMapIntensity!==void 0&&(this.lightMapIntensity=t.lightMapIntensity),t.aoMap!==void 0&&(this.aoMap=e[t.aoMap]||null),t.aoMapIntensity!==void 0&&(this.aoMapIntensity=t.aoMapIntensity),t.gradientMap!==void 0&&(this.gradientMap=e[t.gradientMap]||null),t.clearcoatMap!==void 0&&(this.clearcoatMap=e[t.clearcoatMap]||null),t.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=e[t.clearcoatRoughnessMap]||null),t.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=e[t.clearcoatNormalMap]||null),t.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new nt().fromArray(t.clearcoatNormalScale)),t.iridescenceMap!==void 0&&(this.iridescenceMap=e[t.iridescenceMap]||null),t.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=e[t.iridescenceThicknessMap]||null),t.transmissionMap!==void 0&&(this.transmissionMap=e[t.transmissionMap]||null),t.thicknessMap!==void 0&&(this.thicknessMap=e[t.thicknessMap]||null),t.anisotropyMap!==void 0&&(this.anisotropyMap=e[t.anisotropyMap]||null),t.sheenColorMap!==void 0&&(this.sheenColorMap=e[t.sheenColorMap]||null),t.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=e[t.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,i=null;if(e!==null){let n=e.length;i=new Array(n);for(let r=0;r!==n;++r)i[r]=e[r].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.allowOverride=t.allowOverride,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}},Xs=class extends en{constructor(t){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new ct(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}},Ps,Ir=new w,Is=new w,Ls=new w,Ds=new nt,Lr=new nt,Ef=new le,go=new w,Dr=new w,xo=new w,vd=new nt,fh=new nt,yd=new nt,jr=class extends qe{constructor(t=new Xs){if(super(),this.isSprite=!0,this.type="Sprite",Ps===void 0){Ps=new xe;let e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new Zo(e,5);Ps.setIndex([0,1,2,0,2,3]),Ps.setAttribute("position",new Kr(i,3,0,!1)),Ps.setAttribute("uv",new Kr(i,2,3,!1))}this.geometry=Ps,this.material=t,this.center=new nt(.5,.5),this.count=1}intersectsFrustum(t){return t.intersectsSprite(this)}raycast(t,e){t.camera===null&&Wt('Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Is.setFromMatrixScale(this.matrixWorld),Ef.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),Ls.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Is.multiplyScalar(-Ls.z);let i=this.material.rotation,n,r;i!==0&&(r=Math.cos(i),n=Math.sin(i));let a=this.center;_o(go.set(-.5,-.5,0),Ls,a,Is,n,r),_o(Dr.set(.5,-.5,0),Ls,a,Is,n,r),_o(xo.set(.5,.5,0),Ls,a,Is,n,r),vd.set(0,0),fh.set(1,0),yd.set(1,1);let o=t.ray.intersectTriangle(go,Dr,xo,!1,Ir);if(o===null&&(_o(Dr.set(-.5,.5,0),Ls,a,Is,n,r),fh.set(0,1),o=t.ray.intersectTriangle(go,xo,Dr,!1,Ir),o===null))return;let l=t.ray.origin.distanceTo(Ir);l<t.near||l>t.far||e.push({distance:l,point:Ir.clone(),uv:dn.getInterpolation(Ir,go,Dr,xo,vd,fh,yd,new nt),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}};function _o(s,t,e,i,n,r){Ds.subVectors(s,e).addScalar(.5).multiply(i),n!==void 0?(Lr.x=r*Ds.x-n*Ds.y,Lr.y=n*Ds.x+r*Ds.y):Lr.copy(Ds),s.copy(t),s.x+=Lr.x,s.y+=Lr.y,s.applyMatrix4(Ef)}var un=new w,ph=new w,vo=new w,yo=new w,Qr=class{constructor(t=new w,e=new w(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,un)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=un.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(un.copy(this.origin).addScaledVector(this.direction,e),un.distanceToSquared(t))}distanceSqToSegment(t,e,i,n){ph.copy(t).add(e).multiplyScalar(.5),vo.copy(e).sub(t).normalize(),yo.copy(this.origin).sub(ph);let r=t.distanceTo(e)*.5,a=-this.direction.dot(vo),o=yo.dot(this.direction),l=-yo.dot(vo),c=yo.lengthSq(),h=Math.abs(1-a*a),f,u,d,m;if(h>0)if(f=a*l-o,u=a*o-l,m=r*h,f>=0)if(u>=-m)if(u<=m){let x=1/h;f*=x,u*=x,d=f*(f+a*u+2*o)+u*(a*f+u+2*l)+c}else u=r,f=Math.max(0,-(a*u+o)),d=-f*f+u*(u+2*l)+c;else u=-r,f=Math.max(0,-(a*u+o)),d=-f*f+u*(u+2*l)+c;else u<=-m?(f=Math.max(0,-(-a*r+o)),u=f>0?-r:Math.min(Math.max(-r,-l),r),d=-f*f+u*(u+2*l)+c):u<=m?(f=0,u=Math.min(Math.max(-r,-l),r),d=u*(u+2*l)+c):(f=Math.max(0,-(a*r+o)),u=f>0?r:Math.min(Math.max(-r,-l),r),d=-f*f+u*(u+2*l)+c);else u=a>0?-r:r,f=Math.max(0,-(a*u+o)),d=-f*f+u*(u+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,f),n&&n.copy(ph).addScaledVector(vo,u),d}intersectSphere(t,e){if(t.radius<0)return null;un.subVectors(t.center,this.origin);let i=un.dot(this.direction),n=un.dot(un)-i*i,r=t.radius*t.radius;if(n>r)return null;let a=Math.sqrt(r-n),o=i-a,l=i+a;return l<0?null:o<0?this.at(l,e):this.at(o,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){let i=this.distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,n,r,a,o,l,c=1/this.direction.x,h=1/this.direction.y,f=1/this.direction.z,u=this.origin;return c>=0?(i=(t.min.x-u.x)*c,n=(t.max.x-u.x)*c):(i=(t.max.x-u.x)*c,n=(t.min.x-u.x)*c),h>=0?(r=(t.min.y-u.y)*h,a=(t.max.y-u.y)*h):(r=(t.max.y-u.y)*h,a=(t.min.y-u.y)*h),i>a||r>n||((r>i||isNaN(i))&&(i=r),(a<n||isNaN(n))&&(n=a),f>=0?(o=(t.min.z-u.z)*f,l=(t.max.z-u.z)*f):(o=(t.max.z-u.z)*f,l=(t.min.z-u.z)*f),i>l||o>n)||((o>i||i!==i)&&(i=o),(l<n||n!==n)&&(n=l),n<0)?null:this.at(i>=0?i:n,e)}intersectsBox(t){return this.intersectBox(t,un)!==null}intersectTriangle(t,e,i,n,r){let a=this.origin,o=this.direction,l=o.x,c=o.y,h=o.z,f=t.x-a.x,u=t.y-a.y,d=t.z-a.z,m=e.x-a.x,x=e.y-a.y,g=e.z-a.z,p=i.x-a.x,M=i.y-a.y,S=i.z-a.z,v=Math.abs(l),T=Math.abs(c),E=Math.abs(h),C,y,A,I,D,B,k,P,L,W,z,$;if(v>=T&&v>=E?(A=l,B=f,L=m,$=p,l>=0?(C=c,y=h,I=u,D=d,k=x,P=g,W=M,z=S):(C=h,y=c,I=d,D=u,k=g,P=x,W=S,z=M)):T>=E?(A=c,B=u,L=x,$=M,c>=0?(C=h,y=l,I=d,D=f,k=g,P=m,W=S,z=p):(C=l,y=h,I=f,D=d,k=m,P=g,W=p,z=S)):(A=h,B=d,L=g,$=S,h>=0?(C=l,y=c,I=f,D=u,k=m,P=x,W=p,z=M):(C=c,y=l,I=u,D=f,k=x,P=m,W=M,z=p)),A===0)return null;let X=C/A,Q=y/A,tt=1/A,ht=I-X*B,at=D-Q*B,Ct=k-X*L,Bt=P-Q*L,Xt=W-X*$,Y=z-Q*$,K=Xt*Bt-Y*Ct,pt=ht*Y-at*Xt,zt=Ct*at-Bt*ht;if(n){if(K<0||pt<0||zt<0)return null}else if((K<0||pt<0||zt<0)&&(K>0||pt>0||zt>0))return null;let Et=K+pt+zt;if(Et===0)return null;let kt=tt*(K*B+pt*L+zt*$);return(Et>0?kt<0:kt>0)?null:this.at(kt/Et,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},fe=class extends en{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new ct(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new mn,this.combine=Oh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}},Md=new le,jn=new Qr,Mo=new Vi,bd=new w,bo=new w,So=new w,To=new w,mh=new w,Eo=new w,Sd=new w,wo=new w,St=class extends qe{constructor(t=new xe,e=new fe){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){let n=e[i[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=n.length;r<a;r++){let o=n[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(t,e){let i=this.geometry,n=i.attributes.position,r=i.morphAttributes.position,a=i.morphTargetsRelative;e.fromBufferAttribute(n,t);let o=this.morphTargetInfluences;if(r&&o){Eo.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let h=o[l],f=r[l];h!==0&&(mh.fromBufferAttribute(f,t),a?Eo.addScaledVector(mh,h):Eo.addScaledVector(mh.sub(e),h))}e.add(Eo)}return e}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,e){let i=this.geometry,n=this.material,r=this.matrixWorld;n!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Mo.copy(i.boundingSphere),Mo.applyMatrix4(r),jn.copy(t.ray).recast(t.near),!(Mo.containsPoint(jn.origin)===!1&&(jn.intersectSphere(Mo,bd)===null||jn.origin.distanceToSquared(bd)>(t.far-t.near)**2))&&(Md.copy(r).invert(),jn.copy(t.ray).applyMatrix4(Md),!(i.boundingBox!==null&&jn.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,jn)))}_computeIntersections(t,e,i){let n,r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,f=r.attributes.normal,u=r.groups,d=r.drawRange;if(o!==null)if(Array.isArray(a))for(let m=0,x=u.length;m<x;m++){let g=u[m],p=a[g.materialIndex],M=Math.max(g.start,d.start),S=Math.min(o.count,Math.min(g.start+g.count,d.start+d.count));for(let v=M,T=S;v<T;v+=3){let E=o.getX(v),C=o.getX(v+1),y=o.getX(v+2);n=Ao(this,p,t,i,c,h,f,E,C,y),n&&(n.faceIndex=Math.floor(v/3),n.face.materialIndex=g.materialIndex,e.push(n))}}else{let m=Math.max(0,d.start),x=Math.min(o.count,d.start+d.count);for(let g=m,p=x;g<p;g+=3){let M=o.getX(g),S=o.getX(g+1),v=o.getX(g+2);n=Ao(this,a,t,i,c,h,f,M,S,v),n&&(n.faceIndex=Math.floor(g/3),e.push(n))}}else if(l!==void 0)if(Array.isArray(a))for(let m=0,x=u.length;m<x;m++){let g=u[m],p=a[g.materialIndex],M=Math.max(g.start,d.start),S=Math.min(l.count,Math.min(g.start+g.count,d.start+d.count));for(let v=M,T=S;v<T;v+=3){let E=v,C=v+1,y=v+2;n=Ao(this,p,t,i,c,h,f,E,C,y),n&&(n.faceIndex=Math.floor(v/3),n.face.materialIndex=g.materialIndex,e.push(n))}}else{let m=Math.max(0,d.start),x=Math.min(l.count,d.start+d.count);for(let g=m,p=x;g<p;g+=3){let M=g,S=g+1,v=g+2;n=Ao(this,a,t,i,c,h,f,M,S,v),n&&(n.faceIndex=Math.floor(g/3),e.push(n))}}}};function t0(s,t,e,i,n,r,a,o){let l;if(t.side===Ye?l=i.intersectTriangle(a,r,n,!0,o):l=i.intersectTriangle(n,r,a,t.side===Bn,o),l===null)return null;wo.copy(o),wo.applyMatrix4(s.matrixWorld);let c=e.ray.origin.distanceTo(wo);return c<e.near||c>e.far?null:{distance:c,point:wo.clone(),object:s}}function Ao(s,t,e,i,n,r,a,o,l,c){s.getVertexPosition(o,bo),s.getVertexPosition(l,So),s.getVertexPosition(c,To);let h=t0(s,t,e,i,bo,So,To,Sd);if(h){let f=new w;dn.getBarycoord(Sd,bo,So,To,f),n&&(h.uv=dn.getInterpolatedAttribute(n,o,l,c,f,new nt)),r&&(h.uv1=dn.getInterpolatedAttribute(r,o,l,c,f,new nt)),a&&(h.normal=dn.getInterpolatedAttribute(a,o,l,c,f,new w),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));let u={a:o,b:l,c,normal:new w,materialIndex:0};dn.getNormal(bo,So,To,u.normal),h.face=u,h.barycoord=f}return h}var ta=class extends hi{constructor(t=null,e=1,i=1,n,r,a,o,l,c=Xe,h=Xe,f,u){super(null,a,o,l,c,h,n,r,f,u),this.isDataTexture=!0,this.image={data:t,width:e,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var ea=class extends Fe{constructor(t,e,i,n=1){super(t,e,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=n}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){let t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}},Ns=new le,Td=new le,Ro=[],Ed=new tn,e0=new le,Nr=new St,Ur=new Vi,ia=class extends St{constructor(t,e,i){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new ea(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let n=0;n<i;n++)this.setMatrixAt(n,e0)}computeBoundingBox(){let t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new tn),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<e;i++)this.getMatrixAt(i,Ns),Ed.copy(t.boundingBox).applyMatrix4(Ns),this.boundingBox.union(Ed)}computeBoundingSphere(){let t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new Vi),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<e;i++)this.getMatrixAt(i,Ns),Ur.copy(t.boundingSphere).applyMatrix4(Ns),this.boundingSphere.union(Ur)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){return this.instanceColor===null?e.setRGB(1,1,1):e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){return e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){let i=e.morphTargetInfluences,n=this.morphTexture.source.data.data,r=i.length+1,a=t*r+1;for(let o=0;o<i.length;o++)i[o]=n[a+o]}raycast(t,e){let i=this.matrixWorld,n=this.count;if(Nr.geometry=this.geometry,Nr.material=this.material,Nr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Ur.copy(this.boundingSphere),Ur.applyMatrix4(i),t.ray.intersectsSphere(Ur)!==!1))for(let r=0;r<n;r++){this.getMatrixAt(r,Ns),Td.multiplyMatrices(i,Ns),Nr.matrixWorld=Td,Nr.raycast(t,Ro);for(let a=0,o=Ro.length;a<o;a++){let l=Ro[a];l.instanceId=r,l.object=this,e.push(l)}Ro.length=0}}setColorAt(t,e){return this.instanceColor===null&&(this.instanceColor=new ea(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3),this}setMatrixAt(t,e){return e.toArray(this.instanceMatrix.array,t*16),this}setMorphAt(t,e){let i=e.morphTargetInfluences,n=i.length+1;this.morphTexture===null&&(this.morphTexture=new ta(new Float32Array(n*this.count),n,this.count,Al,Ci));let r=this.morphTexture.source.data.data,a=0;for(let c=0;c<i.length;c++)a+=i[c];let o=this.geometry.morphTargetsRelative?1:1-a,l=n*t;return r[l]=o,r.set(i,l+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},Qn=new Vi,i0=new nt(.5,.5),Co=new w,qs=class{constructor(t=new Oi,e=new Oi,i=new Oi,n=new Oi,r=new Oi,a=new Oi){this.planes=[t,e,i,n,r,a]}set(t,e,i,n,r,a){let o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(i),o[3].copy(n),o[4].copy(r),o[5].copy(a),this}copy(t){let e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,e=ki,i=!1){let n=this.planes,r=t.elements,a=r[0],o=r[1],l=r[2],c=r[3],h=r[4],f=r[5],u=r[6],d=r[7],m=r[8],x=r[9],g=r[10],p=r[11],M=r[12],S=r[13],v=r[14],T=r[15];if(n[0].setComponents(c-a,d-h,p-m,T-M).normalize(),n[1].setComponents(c+a,d+h,p+m,T+M).normalize(),n[2].setComponents(c+o,d+f,p+x,T+S).normalize(),n[3].setComponents(c-o,d-f,p-x,T-S).normalize(),i)n[4].setComponents(l,u,g,v).normalize(),n[5].setComponents(c-l,d-u,p-g,T-v).normalize();else if(n[4].setComponents(c-l,d-u,p-g,T-v).normalize(),e===ki)n[5].setComponents(c+l,d+u,p+g,T+v).normalize();else if(e===ks)n[5].setComponents(l,u,g,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Qn.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Qn.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Qn)}intersectsSprite(t){Qn.center.set(0,0,0);let e=i0.distanceTo(t.center);return Qn.radius=.7071067811865476+e,Qn.applyMatrix4(t.matrixWorld),this.intersectsSphere(Qn)}intersectsSphere(t){let e=this.planes,i=t.center,n=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(i)<n)return!1;return!0}intersectsBox(t){let e=this.planes;for(let i=0;i<6;i++){let n=e[i];if(Co.x=n.normal.x>0?t.max.x:t.min.x,Co.y=n.normal.y>0?t.max.y:t.min.y,Co.z=n.normal.z>0?t.max.z:t.min.z,n.distanceToPoint(Co)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var Ys=class extends en{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new ct(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}},wd=new le,Eh=new Qr,Po=new Vi,Io=new w,is=class extends qe{constructor(t=new xe,e=new Ys){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,e){let i=this.geometry,n=this.matrixWorld,r=t.params.Points.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Po.copy(i.boundingSphere),Po.applyMatrix4(n),Po.radius+=r,t.ray.intersectsSphere(Po)===!1)return;wd.copy(n).invert(),Eh.copy(t.ray).applyMatrix4(wd);let o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=i.index,f=i.attributes.position;if(c!==null){let u=Math.max(0,a.start),d=Math.min(c.count,a.start+a.count);for(let m=u,x=d;m<x;m++){let g=c.getX(m);Io.fromBufferAttribute(f,g),Ad(Io,g,l,n,t,e,this)}}else{let u=Math.max(0,a.start),d=Math.min(f.count,a.start+a.count);for(let m=u,x=d;m<x;m++)Io.fromBufferAttribute(f,m),Ad(Io,m,l,n,t,e,this)}}updateMorphTargets(){let e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){let n=e[i[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=n.length;r<a;r++){let o=n[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}};function Ad(s,t,e,i,n,r,a){let o=Eh.distanceSqToPoint(s);if(o<e){let l=new w;Eh.closestPointToPoint(s,l),l.applyMatrix4(i);let c=n.ray.origin.distanceTo(l);if(c<n.near||c>n.far)return;r.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:t,face:null,faceIndex:null,barycoord:null,object:a})}}var na=class extends hi{constructor(t=[],e=zn,i,n,r,a,o,l,c,h){super(t,e,i,n,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}},gn=class extends hi{constructor(t,e,i,n,r,a,o,l,c){super(t,e,i,n,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}};var In=class extends hi{constructor(t,e,i=Gi,n,r,a,o=Xe,l=Xe,c,h=ji,f=1){if(h!==ji&&h!==Vn)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let u={width:t,height:e,depth:f};super(u,n,r,a,o,l,h,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new Gs(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);return e.compareFunction=this.compareFunction,e}},Ko=class extends In{constructor(t,e=Gi,i=zn,n,r,a=Xe,o=Xe,l,c=ji){let h={width:t,height:t,depth:1},f=[h,h,h,h,h,h];super(t,t,e,i,n,r,a,o,l,c),this.image=f,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(t){this.image=t}},sa=class extends hi{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}},ve=class s extends xe{constructor(t=1,e=1,i=1,n=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:n,heightSegments:r,depthSegments:a};let o=this;n=Math.floor(n),r=Math.floor(r),a=Math.floor(a);let l=[],c=[],h=[],f=[],u=0,d=0;m("z","y","x",-1,-1,i,e,t,a,r,0),m("z","y","x",1,-1,i,e,-t,a,r,1),m("x","z","y",1,1,t,i,e,n,a,2),m("x","z","y",1,-1,t,i,-e,n,a,3),m("x","y","z",1,-1,t,e,i,n,r,4),m("x","y","z",-1,-1,t,e,-i,n,r,5),this.setIndex(l),this.setAttribute("position",new Yt(c,3)),this.setAttribute("normal",new Yt(h,3)),this.setAttribute("uv",new Yt(f,2));function m(x,g,p,M,S,v,T,E,C,y,A){let I=v/C,D=T/y,B=v/2,k=T/2,P=E/2,L=C+1,W=y+1,z=0,$=0,X=new w;for(let Q=0;Q<W;Q++){let tt=Q*D-k;for(let ht=0;ht<L;ht++){let at=ht*I-B;X[x]=at*M,X[g]=tt*S,X[p]=P,c.push(X.x,X.y,X.z),X[x]=0,X[g]=0,X[p]=E>0?1:-1,h.push(X.x,X.y,X.z),f.push(ht/C),f.push(1-Q/y),z+=1}}for(let Q=0;Q<y;Q++)for(let tt=0;tt<C;tt++){let ht=u+tt+L*Q,at=u+tt+L*(Q+1),Ct=u+(tt+1)+L*(Q+1),Bt=u+(tt+1)+L*Q;l.push(ht,at,Bt),l.push(at,Ct,Bt),$+=6}o.addGroup(d,$,A),d+=$,u+=z}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};var ra=class s extends xe{constructor(t=1,e=32,i=0,n=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:i,thetaLength:n},e=Math.max(3,e);let r=[],a=[],o=[],l=[],c=new w,h=new nt;a.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let f=0,u=3;f<=e;f++,u+=3){let d=i+f/e*n;c.x=t*Math.cos(d),c.y=t*Math.sin(d),a.push(c.x,c.y,c.z),o.push(0,0,1),h.x=(a[u]/t+1)/2,h.y=(a[u+1]/t+1)/2,l.push(h.x,h.y)}for(let f=1;f<=e;f++)r.push(f,f+1,0);this.setIndex(r),this.setAttribute("position",new Yt(a,3)),this.setAttribute("normal",new Yt(o,3)),this.setAttribute("uv",new Yt(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.radius,t.segments,t.thetaStart,t.thetaLength)}},pi=class s extends xe{constructor(t=1,e=1,i=1,n=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:i,radialSegments:n,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};let c=this;n=Math.floor(n),r=Math.floor(r);let h=[],f=[],u=[],d=[],m=0,x=[],g=i/2,p=0;M(),a===!1&&(t>0&&S(!0),e>0&&S(!1)),this.setIndex(h),this.setAttribute("position",new Yt(f,3)),this.setAttribute("normal",new Yt(u,3)),this.setAttribute("uv",new Yt(d,2));function M(){let v=new w,T=new w,E=0,C=(e-t)/i;for(let y=0;y<=r;y++){let A=[],I=y/r,D=I*(e-t)+t;for(let B=0;B<=n;B++){let k=B/n,P=k*l+o,L=Math.sin(P),W=Math.cos(P);T.x=D*L,T.y=-I*i+g,T.z=D*W,f.push(T.x,T.y,T.z),v.set(L,C,W).normalize(),u.push(v.x,v.y,v.z),d.push(k,1-I),A.push(m++)}x.push(A)}for(let y=0;y<n;y++)for(let A=0;A<r;A++){let I=x[A][y],D=x[A+1][y],B=x[A+1][y+1],k=x[A][y+1];(t>0||A!==0)&&(h.push(I,D,k),E+=3),(e>0||A!==r-1)&&(h.push(D,B,k),E+=3)}c.addGroup(p,E,0),p+=E}function S(v){let T=m,E=new nt,C=new w,y=0,A=v===!0?t:e,I=v===!0?1:-1;for(let B=1;B<=n;B++)f.push(0,g*I,0),u.push(0,I,0),d.push(.5,.5),m++;let D=m;for(let B=0;B<=n;B++){let P=B/n*l+o,L=Math.cos(P),W=Math.sin(P);C.x=A*W,C.y=g*I,C.z=A*L,f.push(C.x,C.y,C.z),u.push(0,I,0),E.x=L*.5+.5,E.y=W*.5*I+.5,d.push(E.x,E.y),m++}for(let B=0;B<n;B++){let k=T+B,P=D+B;v===!0?h.push(P,P+1,k):h.push(P+1,P,k),y+=3}c.addGroup(p,y,v===!0?1:2),p+=y}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},$s=class s extends pi{constructor(t=1,e=1,i=32,n=1,r=!1,a=0,o=Math.PI*2){super(0,t,e,i,n,r,a,o),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:i,heightSegments:n,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(t){return new s(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},jo=class s extends xe{constructor(t=[],e=[],i=1,n=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:i,detail:n};let r=[],a=[];o(n),c(i),h(),this.setAttribute("position",new Yt(r,3)),this.setAttribute("normal",new Yt(r.slice(),3)),this.setAttribute("uv",new Yt(a,2)),n===0?this.computeVertexNormals():this.normalizeNormals();function o(M){let S=new w,v=new w,T=new w;for(let E=0;E<e.length;E+=3)d(e[E+0],S),d(e[E+1],v),d(e[E+2],T),l(S,v,T,M)}function l(M,S,v,T){let E=T+1,C=[];for(let y=0;y<=E;y++){C[y]=[];let A=M.clone().lerp(v,y/E),I=S.clone().lerp(v,y/E),D=E-y;for(let B=0;B<=D;B++)B===0&&y===E?C[y][B]=A:C[y][B]=A.clone().lerp(I,B/D)}for(let y=0;y<E;y++)for(let A=0;A<2*(E-y)-1;A++){let I=Math.floor(A/2);A%2===0?(u(C[y][I+1]),u(C[y+1][I]),u(C[y][I])):(u(C[y][I+1]),u(C[y+1][I+1]),u(C[y+1][I]))}}function c(M){let S=new w;for(let v=0;v<r.length;v+=3)S.x=r[v+0],S.y=r[v+1],S.z=r[v+2],S.normalize().multiplyScalar(M),r[v+0]=S.x,r[v+1]=S.y,r[v+2]=S.z}function h(){let M=new w;for(let S=0;S<r.length;S+=3){M.x=r[S+0],M.y=r[S+1],M.z=r[S+2];let v=g(M)/2/Math.PI+.5,T=p(M)/Math.PI+.5;a.push(v,1-T)}m(),f()}function f(){for(let M=0;M<a.length;M+=6){let S=a[M+0],v=a[M+2],T=a[M+4],E=Math.max(S,v,T),C=Math.min(S,v,T);E>.9&&C<.1&&(S<.2&&(a[M+0]+=1),v<.2&&(a[M+2]+=1),T<.2&&(a[M+4]+=1))}}function u(M){r.push(M.x,M.y,M.z)}function d(M,S){let v=M*3;S.x=t[v+0],S.y=t[v+1],S.z=t[v+2]}function m(){let M=new w,S=new w,v=new w,T=new w,E=new nt,C=new nt,y=new nt;for(let A=0,I=0;A<r.length;A+=9,I+=6){M.set(r[A+0],r[A+1],r[A+2]),S.set(r[A+3],r[A+4],r[A+5]),v.set(r[A+6],r[A+7],r[A+8]),E.set(a[I+0],a[I+1]),C.set(a[I+2],a[I+3]),y.set(a[I+4],a[I+5]),T.copy(M).add(S).add(v).divideScalar(3);let D=g(T);x(E,I+0,M,D),x(C,I+2,S,D),x(y,I+4,v,D)}}function x(M,S,v,T){T<0&&M.x===1&&(a[S]=M.x-1),v.x===0&&v.z===0&&(a[S]=T/2/Math.PI+.5)}function g(M){return Math.atan2(M.z,-M.x)}function p(M){return Math.atan2(-M.y,Math.sqrt(M.x*M.x+M.z*M.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.vertices,t.indices,t.radius,t.detail)}};var yi=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){Gt("Curve: .getPoint() not implemented.")}getPointAt(t,e){let i=this.getUtoTmapping(t);return this.getPoint(i,e)}getPoints(t=5){let e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return e}getSpacedPoints(t=5){let e=[];for(let i=0;i<=t;i++)e.push(this.getPointAt(i/t));return e}getLength(){let t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let e=[],i,n=this.getPoint(0),r=0;e.push(0);for(let a=1;a<=t;a++)i=this.getPoint(a/t),r+=i.distanceTo(n),e.push(r),n=i;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){let i=this.getLengths(),n=0,r=i.length,a;e?a=e:a=t*i[r-1];let o=0,l=r-1,c;for(;o<=l;)if(n=Math.floor(o+(l-o)/2),c=i[n]-a,c<0)o=n+1;else if(c>0)l=n-1;else{l=n;break}if(n=l,i[n]===a)return n/(r-1);let h=i[n],u=i[n+1]-h,d=(a-h)/u;return(n+d)/(r-1)}getTangent(t,e){let n=t-1e-4,r=t+1e-4;n<0&&(n=0),r>1&&(r=1);let a=this.getPoint(n),o=this.getPoint(r),l=e||(a.isVector2?new nt:new w);return l.copy(o).sub(a).normalize(),l}getTangentAt(t,e){let i=this.getUtoTmapping(t);return this.getTangent(i,e)}computeFrenetFrames(t,e=!1){let i=new w,n=[],r=[],a=[],o=new w,l=new le;for(let d=0;d<=t;d++){let m=d/t;n[d]=this.getTangentAt(m,new w)}r[0]=new w,a[0]=new w;let c=Number.MAX_VALUE,h=Math.abs(n[0].x),f=Math.abs(n[0].y),u=Math.abs(n[0].z);h<=c&&(c=h,i.set(1,0,0)),f<=c&&(c=f,i.set(0,1,0)),u<=c&&i.set(0,0,1),o.crossVectors(n[0],i).normalize(),r[0].crossVectors(n[0],o),a[0].crossVectors(n[0],r[0]);for(let d=1;d<=t;d++){if(r[d]=r[d-1].clone(),a[d]=a[d-1].clone(),o.crossVectors(n[d-1],n[d]),o.length()>Number.EPSILON){o.normalize();let m=Math.acos(Qt(n[d-1].dot(n[d]),-1,1));r[d].applyMatrix4(l.makeRotationAxis(o,m))}a[d].crossVectors(n[d],r[d])}if(e===!0){let d=Math.acos(Qt(r[0].dot(r[t]),-1,1));d/=t,n[0].dot(o.crossVectors(r[0],r[t]))>0&&(d=-d);for(let m=1;m<=t;m++)r[m].applyMatrix4(l.makeRotationAxis(n[m],d*m)),a[m].crossVectors(n[m],r[m])}return{tangents:n,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){let t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}},Js=class extends yi{constructor(t=0,e=0,i=1,n=1,r=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=i,this.yRadius=n,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(t,e=new nt){let i=e,n=Math.PI*2,r=this.aEndAngle-this.aStartAngle,a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=n;for(;r>n;)r-=n;r<Number.EPSILON&&(a?r=0:r=n),this.aClockwise===!0&&!a&&(r===n?r=-n:r=r-n);let o=this.aStartAngle+t*r,l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let h=Math.cos(this.aRotation),f=Math.sin(this.aRotation),u=l-this.aX,d=c-this.aY;l=u*h-d*f+this.aX,c=u*f+d*h+this.aY}return i.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){let t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}},Qo=class extends Js{constructor(t,e,i,n,r,a){super(t,e,i,i,n,r,a),this.isArcCurve=!0,this.type="ArcCurve"}};function Jh(){let s=0,t=0,e=0,i=0;function n(r,a,o,l){s=r,t=o,e=-3*r+3*a-2*o-l,i=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,c){n(a,o,c*(o-r),c*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,c,h,f){let u=(a-r)/c-(o-r)/(c+h)+(o-a)/h,d=(o-a)/h-(l-a)/(h+f)+(l-o)/f;u*=h,d*=h,n(a,o,u,d)},calc:function(r){let a=r*r,o=a*r;return s+t*r+e*a+i*o}}}var Rd=new w,Cd=new w,gh=new Jh,xh=new Jh,_h=new Jh,tl=class extends yi{constructor(t=[],e=!1,i="centripetal",n=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=i,this.tension=n}getPoint(t,e=new w){let i=e,n=this.points,r=n.length,a=(r-(this.closed?0:1))*t,o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let c,h;this.closed||o>0?c=n[(o-1)%r]:(Cd.subVectors(n[0],n[1]).add(n[0]),c=Cd);let f=n[o%r],u=n[(o+1)%r];if(this.closed||o+2<r?h=n[(o+2)%r]:(Rd.subVectors(n[r-1],n[r-2]).add(n[r-1]),h=Rd),this.curveType==="centripetal"||this.curveType==="chordal"){let d=this.curveType==="chordal"?.5:.25,m=Math.pow(c.distanceToSquared(f),d),x=Math.pow(f.distanceToSquared(u),d),g=Math.pow(u.distanceToSquared(h),d);x<1e-4&&(x=1),m<1e-4&&(m=x),g<1e-4&&(g=x),gh.initNonuniformCatmullRom(c.x,f.x,u.x,h.x,m,x,g),xh.initNonuniformCatmullRom(c.y,f.y,u.y,h.y,m,x,g),_h.initNonuniformCatmullRom(c.z,f.z,u.z,h.z,m,x,g)}else this.curveType==="catmullrom"&&(gh.initCatmullRom(c.x,f.x,u.x,h.x,this.tension),xh.initCatmullRom(c.y,f.y,u.y,h.y,this.tension),_h.initCatmullRom(c.z,f.z,u.z,h.z,this.tension));return i.set(gh.calc(l),xh.calc(l),_h.calc(l)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){let n=t.points[e];this.points.push(n.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){let n=this.points[e];t.points.push(n.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){let n=t.points[e];this.points.push(new w().fromArray(n))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}};function Pd(s,t,e,i,n){let r=(i-t)*.5,a=(n-e)*.5,o=s*s,l=s*o;return(2*e-2*i+r+a)*l+(-3*e+3*i-2*r-a)*o+r*s+e}function n0(s,t){let e=1-s;return e*e*t}function s0(s,t){return 2*(1-s)*s*t}function r0(s,t){return s*s*t}function zr(s,t,e,i){return n0(s,t)+s0(s,e)+r0(s,i)}function a0(s,t){let e=1-s;return e*e*e*t}function o0(s,t){let e=1-s;return 3*e*e*s*t}function l0(s,t){return 3*(1-s)*s*s*t}function c0(s,t){return s*s*s*t}function kr(s,t,e,i,n){return a0(s,t)+o0(s,e)+l0(s,i)+c0(s,n)}var aa=class extends yi{constructor(t=new nt,e=new nt,i=new nt,n=new nt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=i,this.v3=n}getPoint(t,e=new nt){let i=e,n=this.v0,r=this.v1,a=this.v2,o=this.v3;return i.set(kr(t,n.x,r.x,a.x,o.x),kr(t,n.y,r.y,a.y,o.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},el=class extends yi{constructor(t=new w,e=new w,i=new w,n=new w){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=i,this.v3=n}getPoint(t,e=new w){let i=e,n=this.v0,r=this.v1,a=this.v2,o=this.v3;return i.set(kr(t,n.x,r.x,a.x,o.x),kr(t,n.y,r.y,a.y,o.y),kr(t,n.z,r.z,a.z,o.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},oa=class extends yi{constructor(t=new nt,e=new nt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new nt){let i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new nt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},il=class extends yi{constructor(t=new w,e=new w){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new w){let i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new w){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},la=class extends yi{constructor(t=new nt,e=new nt,i=new nt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new nt){let i=e,n=this.v0,r=this.v1,a=this.v2;return i.set(zr(t,n.x,r.x,a.x),zr(t,n.y,r.y,a.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},nl=class extends yi{constructor(t=new w,e=new w,i=new w){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new w){let i=e,n=this.v0,r=this.v1,a=this.v2;return i.set(zr(t,n.x,r.x,a.x),zr(t,n.y,r.y,a.y),zr(t,n.z,r.z,a.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},ca=class extends yi{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new nt){let i=e,n=this.points,r=(n.length-1)*t,a=Math.floor(r),o=r-a,l=n[a===0?a:a-1],c=n[a],h=n[a>n.length-2?n.length-1:a+1],f=n[a>n.length-3?n.length-1:a+2];return i.set(Pd(o,l.x,c.x,h.x,f.x),Pd(o,l.y,c.y,h.y,f.y)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){let n=t.points[e];this.points.push(n.clone())}return this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){let n=this.points[e];t.points.push(n.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){let n=t.points[e];this.points.push(new nt().fromArray(n))}return this}},wh=Object.freeze({__proto__:null,ArcCurve:Qo,CatmullRomCurve3:tl,CubicBezierCurve:aa,CubicBezierCurve3:el,EllipseCurve:Js,LineCurve:oa,LineCurve3:il,QuadraticBezierCurve:la,QuadraticBezierCurve3:nl,SplineCurve:ca}),sl=class extends yi{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){let t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){let i=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new wh[i](e,t))}return this}getPoint(t,e){let i=t*this.getLength(),n=this.getCurveLengths(),r=0;for(;r<n.length;){if(n[r]>=i){let a=n[r]-i,o=this.curves[r],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,e)}r++}return null}getLength(){let t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let t=[],e=0;for(let i=0,n=this.curves.length;i<n;i++)e+=this.curves[i].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){let e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){let e=[],i;for(let n=0,r=this.curves;n<r.length;n++){let a=r[n],o=a.isEllipseCurve?t*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?t*a.points.length:t,l=a.getPoints(o);for(let c=0;c<l.length;c++){let h=l[c];i&&i.equals(h)||(e.push(h),i=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){let n=t.curves[e];this.curves.push(n.clone())}return this.autoClose=t.autoClose,this}toJSON(){let t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,i=this.curves.length;e<i;e++){let n=this.curves[e];t.curves.push(n.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){let n=t.curves[e];this.curves.push(new wh[n.type]().fromJSON(n))}return this}},ha=class extends sl{constructor(t){super(),this.type="Path",this.currentPoint=new nt,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,i=t.length;e<i;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){let i=new oa(this.currentPoint.clone(),new nt(t,e));return this.curves.push(i),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,i,n){let r=new la(this.currentPoint.clone(),new nt(t,e),new nt(i,n));return this.curves.push(r),this.currentPoint.set(i,n),this}bezierCurveTo(t,e,i,n,r,a){let o=new aa(this.currentPoint.clone(),new nt(t,e),new nt(i,n),new nt(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(t){let e=[this.currentPoint.clone()].concat(t),i=new ca(e);return this.curves.push(i),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,i,n,r,a){let o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+o,e+l,i,n,r,a),this}absarc(t,e,i,n,r,a){return this.absellipse(t,e,i,i,n,r,a),this}ellipse(t,e,i,n,r,a,o,l){let c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+c,e+h,i,n,r,a,o,l),this}absellipse(t,e,i,n,r,a,o,l){let c=new Js(t,e,i,n,r,a,o,l);if(this.curves.length>0){let f=c.getPoint(0);f.equals(this.currentPoint)||this.lineTo(f.x,f.y)}this.curves.push(c);let h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){let t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}},Ln=class extends ha{constructor(t){super(t),this.uuid=Ki(),this.type="Shape",this.holes=[]}getPointsHoles(t){let e=[];for(let i=0,n=this.holes.length;i<n;i++)e[i]=this.holes[i].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){let n=t.holes[e];this.holes.push(n.clone())}return this}toJSON(){let t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,i=this.holes.length;e<i;e++){let n=this.holes[e];t.holes.push(n.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){let n=t.holes[e];this.holes.push(new ha().fromJSON(n))}return this}};function h0(s,t,e=2){let i=t&&t.length,n=i?t[0]*e:s.length,r=wf(s,0,n,e,!0),a=[];if(!r||r.next===r.prev)return a;let o,l,c;if(i&&(r=m0(s,t,r,e)),s.length>80*e){o=s[0],l=s[1];let h=o,f=l;for(let u=e;u<n;u+=e){let d=s[u],m=s[u+1];d<o&&(o=d),m<l&&(l=m),d>h&&(h=d),m>f&&(f=m)}c=Math.max(h-o,f-l),c=c!==0?32767/c:0}return ua(r,a,e,o,l,c,0),a}function wf(s,t,e,i,n){let r;if(n===w0(s,t,e,i)>0)for(let a=t;a<e;a+=i)r=Id(a/i|0,s[a],s[a+1],r);else for(let a=e-i;a>=t;a-=i)r=Id(a/i|0,s[a],s[a+1],r);return r&&Zs(r,r.next)&&(fa(r),r=r.next),r}function ns(s,t){if(!s)return s;t||(t=s);let e=s,i;do if(i=!1,!e.steiner&&(Zs(e,e.next)||Pe(e.prev,e,e.next)===0)){if(fa(e),e=t=e.prev,e===e.next)break;i=!0}else e=e.next;while(i||e!==t);return t}function ua(s,t,e,i,n,r,a){if(!s)return;!a&&r&&y0(s,i,n,r);let o=s;for(;s.prev!==s.next;){let l=s.prev,c=s.next;if(r?d0(s,i,n,r):u0(s)){t.push(l.i,s.i,c.i),fa(s),s=c.next,o=c.next;continue}if(s=c,s===o){a?a===1?(s=f0(ns(s),t),ua(s,t,e,i,n,r,2)):a===2&&p0(s,t,e,i,n,r):ua(ns(s),t,e,i,n,r,1);break}}}function u0(s){let t=s.prev,e=s,i=s.next;if(Pe(t,e,i)>=0)return!1;let n=t.x,r=e.x,a=i.x,o=t.y,l=e.y,c=i.y,h=Math.min(n,r,a),f=Math.min(o,l,c),u=Math.max(n,r,a),d=Math.max(o,l,c),m=i.next;for(;m!==t;){if(m.x>=h&&m.x<=u&&m.y>=f&&m.y<=d&&Fr(n,o,r,l,a,c,m.x,m.y)&&Pe(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function d0(s,t,e,i){let n=s.prev,r=s,a=s.next;if(Pe(n,r,a)>=0)return!1;let o=n.x,l=r.x,c=a.x,h=n.y,f=r.y,u=a.y,d=Math.min(o,l,c),m=Math.min(h,f,u),x=Math.max(o,l,c),g=Math.max(h,f,u),p=Ah(d,m,t,e,i),M=Ah(x,g,t,e,i),S=s.prevZ,v=s.nextZ;for(;S&&S.z>=p&&v&&v.z<=M;){if(S.x>=d&&S.x<=x&&S.y>=m&&S.y<=g&&S!==n&&S!==a&&Fr(o,h,l,f,c,u,S.x,S.y)&&Pe(S.prev,S,S.next)>=0||(S=S.prevZ,v.x>=d&&v.x<=x&&v.y>=m&&v.y<=g&&v!==n&&v!==a&&Fr(o,h,l,f,c,u,v.x,v.y)&&Pe(v.prev,v,v.next)>=0))return!1;v=v.nextZ}for(;S&&S.z>=p;){if(S.x>=d&&S.x<=x&&S.y>=m&&S.y<=g&&S!==n&&S!==a&&Fr(o,h,l,f,c,u,S.x,S.y)&&Pe(S.prev,S,S.next)>=0)return!1;S=S.prevZ}for(;v&&v.z<=M;){if(v.x>=d&&v.x<=x&&v.y>=m&&v.y<=g&&v!==n&&v!==a&&Fr(o,h,l,f,c,u,v.x,v.y)&&Pe(v.prev,v,v.next)>=0)return!1;v=v.nextZ}return!0}function f0(s,t){let e=s;do{let i=e.prev,n=e.next.next;!Zs(i,n)&&Rf(i,e,e.next,n)&&da(i,n)&&da(n,i)&&(t.push(i.i,e.i,n.i),fa(e),fa(e.next),e=s=n),e=e.next}while(e!==s);return ns(e)}function p0(s,t,e,i,n,r){let a=s;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&S0(a,o)){let l=Cf(a,o);a=ns(a,a.next),l=ns(l,l.next),ua(a,t,e,i,n,r,0),ua(l,t,e,i,n,r,0);return}o=o.next}a=a.next}while(a!==s)}function m0(s,t,e,i){let n=[];for(let r=0,a=t.length;r<a;r++){let o=t[r]*i,l=r<a-1?t[r+1]*i:s.length,c=wf(s,o,l,i,!1);c===c.next&&(c.steiner=!0),n.push(b0(c))}n.sort(g0);for(let r=0;r<n.length;r++)e=x0(n[r],e);return e}function g0(s,t){let e=s.x-t.x;if(e===0&&(e=s.y-t.y,e===0)){let i=(s.next.y-s.y)/(s.next.x-s.x),n=(t.next.y-t.y)/(t.next.x-t.x);e=i-n}return e}function x0(s,t){let e=_0(s,t);if(!e)return t;let i=Cf(e,s);return ns(i,i.next),ns(e,e.next)}function _0(s,t){let e=t,i=s.x,n=s.y,r=-1/0,a;if(Zs(s,e))return e;do{if(Zs(s,e.next))return e.next;if(n<=e.y&&n>=e.next.y&&e.next.y!==e.y){let f=e.x+(n-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(f<=i&&f>r&&(r=f,a=e.x<e.next.x?e:e.next,f===i))return a}e=e.next}while(e!==t);if(!a)return null;let o=a,l=a.x,c=a.y,h=1/0;e=a;do{if(i>=e.x&&e.x>=l&&i!==e.x&&Af(n<c?i:r,n,l,c,n<c?r:i,n,e.x,e.y)){let f=Math.abs(n-e.y)/(i-e.x);da(e,s)&&(f<h||f===h&&(e.x>a.x||e.x===a.x&&v0(a,e)))&&(a=e,h=f)}e=e.next}while(e!==o);return a}function v0(s,t){return Pe(s.prev,s,t.prev)<0&&Pe(t.next,s,s.next)<0}function y0(s,t,e,i){let n=s;do n.z===0&&(n.z=Ah(n.x,n.y,t,e,i)),n.prevZ=n.prev,n.nextZ=n.next,n=n.next;while(n!==s);n.prevZ.nextZ=null,n.prevZ=null,M0(n)}function M0(s){let t,e=1;do{let i=s,n;s=null;let r=null;for(t=0;i;){t++;let a=i,o=0;for(let c=0;c<e&&(o++,a=a.nextZ,!!a);c++);let l=e;for(;o>0||l>0&&a;)o!==0&&(l===0||!a||i.z<=a.z)?(n=i,i=i.nextZ,o--):(n=a,a=a.nextZ,l--),r?r.nextZ=n:s=n,n.prevZ=r,r=n;i=a}r.nextZ=null,e*=2}while(t>1);return s}function Ah(s,t,e,i,n){return s=(s-e)*n|0,t=(t-i)*n|0,s=(s|s<<8)&16711935,s=(s|s<<4)&252645135,s=(s|s<<2)&858993459,s=(s|s<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,s|t<<1}function b0(s){let t=s,e=s;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==s);return e}function Af(s,t,e,i,n,r,a,o){return(n-a)*(t-o)>=(s-a)*(r-o)&&(s-a)*(i-o)>=(e-a)*(t-o)&&(e-a)*(r-o)>=(n-a)*(i-o)}function Fr(s,t,e,i,n,r,a,o){return!(s===a&&t===o)&&Af(s,t,e,i,n,r,a,o)}function S0(s,t){return s.next.i!==t.i&&s.prev.i!==t.i&&!T0(s,t)&&(da(s,t)&&da(t,s)&&E0(s,t)&&(Pe(s.prev,s,t.prev)||Pe(s,t.prev,t))||Zs(s,t)&&Pe(s.prev,s,s.next)>0&&Pe(t.prev,t,t.next)>0)}function Pe(s,t,e){return(t.y-s.y)*(e.x-t.x)-(t.x-s.x)*(e.y-t.y)}function Zs(s,t){return s.x===t.x&&s.y===t.y}function Rf(s,t,e,i){let n=Do(Pe(s,t,e)),r=Do(Pe(s,t,i)),a=Do(Pe(e,i,s)),o=Do(Pe(e,i,t));return!!(n!==r&&a!==o||n===0&&Lo(s,e,t)||r===0&&Lo(s,i,t)||a===0&&Lo(e,s,i)||o===0&&Lo(e,t,i))}function Lo(s,t,e){return t.x<=Math.max(s.x,e.x)&&t.x>=Math.min(s.x,e.x)&&t.y<=Math.max(s.y,e.y)&&t.y>=Math.min(s.y,e.y)}function Do(s){return s>0?1:s<0?-1:0}function T0(s,t){let e=s;do{if(e.i!==s.i&&e.next.i!==s.i&&e.i!==t.i&&e.next.i!==t.i&&Rf(e,e.next,s,t))return!0;e=e.next}while(e!==s);return!1}function da(s,t){return Pe(s.prev,s,s.next)<0?Pe(s,t,s.next)>=0&&Pe(s,s.prev,t)>=0:Pe(s,t,s.prev)<0||Pe(s,s.next,t)<0}function E0(s,t){let e=s,i=!1,n=(s.x+t.x)/2,r=(s.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&n<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(i=!i),e=e.next;while(e!==s);return i}function Cf(s,t){let e=Rh(s.i,s.x,s.y),i=Rh(t.i,t.x,t.y),n=s.next,r=t.prev;return s.next=t,t.prev=s,e.next=n,n.prev=e,i.next=e,e.prev=i,r.next=i,i.prev=r,i}function Id(s,t,e,i){let n=Rh(s,t,e);return i?(n.next=i.next,n.prev=i,i.next.prev=n,i.next=n):(n.prev=n,n.next=n),n}function fa(s){s.next.prev=s.prev,s.prev.next=s.next,s.prevZ&&(s.prevZ.nextZ=s.nextZ),s.nextZ&&(s.nextZ.prevZ=s.prevZ)}function Rh(s,t,e){return{i:s,x:t,y:e,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function w0(s,t,e,i){let n=0;for(let r=t,a=e-i;r<e;r+=i)n+=(s[a]-s[r])*(s[r+1]+s[a+1]),a=r;return n}var Ch=class{static triangulate(t,e,i=2){return h0(t,e,i)}},Zi=class s{static area(t){let e=t.length,i=0;for(let n=e-1,r=0;r<e;n=r++)i+=t[n].x*t[r].y-t[r].x*t[n].y;return i*.5}static isClockWise(t){return s.area(t)<0}static triangulateShape(t,e){let i=[],n=[],r=[];Ld(t),Dd(i,t);let a=t.length;e.forEach(Ld);for(let l=0;l<e.length;l++)n.push(a),a+=e[l].length,Dd(i,e[l]);let o=Ch.triangulate(i,n);for(let l=0;l<o.length;l+=3)r.push(o.slice(l,l+3));return r}};function Ld(s){let t=s.length;t>2&&s[t-1].equals(s[0])&&s.pop()}function Dd(s,t){for(let e=0;e<t.length;e++)s.push(t[e].x),s.push(t[e].y)}var pa=class s extends xe{constructor(t=new Ln([new nt(.5,.5),new nt(-.5,.5),new nt(-.5,-.5),new nt(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];let i=this,n=[],r=[];for(let o=0,l=t.length;o<l;o++){let c=t[o];a(c)}this.setAttribute("position",new Yt(n,3)),this.setAttribute("uv",new Yt(r,2)),this.computeVertexNormals();function a(o){let l=[],c=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,f=e.depth!==void 0?e.depth:1,u=e.bevelEnabled!==void 0?e.bevelEnabled:!0,d=e.bevelThickness!==void 0?e.bevelThickness:.2,m=e.bevelSize!==void 0?e.bevelSize:d-.1,x=e.bevelOffset!==void 0?e.bevelOffset:0,g=e.bevelSegments!==void 0?e.bevelSegments:3,p=e.extrudePath,M=e.UVGenerator!==void 0?e.UVGenerator:A0,S,v=!1,T,E,C,y;if(p){S=p.getSpacedPoints(h),v=!0,u=!1;let j=p.isCatmullRomCurve3?p.closed:!1;T=p.computeFrenetFrames(h,j),E=new w,C=new w,y=new w}u||(g=0,d=0,m=0,x=0);let A=o.extractPoints(c),I=A.shape,D=A.holes;if(!Zi.isClockWise(I)){I=I.reverse();for(let j=0,rt=D.length;j<rt;j++){let ot=D[j];Zi.isClockWise(ot)&&(D[j]=ot.reverse())}}function k(j){let ot=10000000000000001e-36,lt=j[0];for(let dt=1;dt<=j.length;dt++){let Vt=dt%j.length,Lt=j[Vt],qt=Lt.x-lt.x,Jt=Lt.y-lt.y,N=qt*qt+Jt*Jt,he=Math.max(Math.abs(Lt.x),Math.abs(Lt.y),Math.abs(lt.x),Math.abs(lt.y)),ie=ot*he*he;if(N<=ie){j.splice(Vt,1),dt--;continue}lt=Lt}}k(I),D.forEach(k);let P=D.length,L=I;for(let j=0;j<P;j++){let rt=D[j];I=I.concat(rt)}function W(j,rt,ot){return rt||Wt("ExtrudeGeometry: vec does not exist"),j.clone().addScaledVector(rt,ot)}let z=I.length;function $(j,rt,ot){let lt,dt,Vt,Lt=j.x-rt.x,qt=j.y-rt.y,Jt=ot.x-j.x,N=ot.y-j.y,he=Lt*Lt+qt*qt,ie=Lt*N-qt*Jt;if(Math.abs(ie)>Number.EPSILON){let R=Math.sqrt(he),_=Math.sqrt(Jt*Jt+N*N),O=rt.x-qt/R,G=rt.y+Lt/R,J=ot.x-N/_,ut=ot.y+Jt/_,mt=((J-O)*N-(ut-G)*Jt)/(Lt*N-qt*Jt);lt=O+Lt*mt-j.x,dt=G+qt*mt-j.y;let Z=lt*lt+dt*dt;if(Z<=2)return new nt(lt,dt);Vt=Math.sqrt(Z/2)}else{let R=!1;Lt>Number.EPSILON?Jt>Number.EPSILON&&(R=!0):Lt<-Number.EPSILON?Jt<-Number.EPSILON&&(R=!0):Math.sign(qt)===Math.sign(N)&&(R=!0),R?(lt=-qt,dt=Lt,Vt=Math.sqrt(he)):(lt=Lt,dt=qt,Vt=Math.sqrt(he/2))}return new nt(lt/Vt,dt/Vt)}let X=[];for(let j=0,rt=L.length,ot=rt-1,lt=j+1;j<rt;j++,ot++,lt++)ot===rt&&(ot=0),lt===rt&&(lt=0),X[j]=$(L[j],L[ot],L[lt]);let Q=[],tt,ht=X.concat();for(let j=0,rt=P;j<rt;j++){let ot=D[j];tt=[];for(let lt=0,dt=ot.length,Vt=dt-1,Lt=lt+1;lt<dt;lt++,Vt++,Lt++)Vt===dt&&(Vt=0),Lt===dt&&(Lt=0),tt[lt]=$(ot[lt],ot[Vt],ot[Lt]);Q.push(tt),ht=ht.concat(tt)}let at;if(g===0)at=Zi.triangulateShape(L,D);else{let j=[],rt=[];for(let ot=0;ot<g;ot++){let lt=ot/g,dt=d*Math.cos(lt*Math.PI/2),Vt=m*Math.sin(lt*Math.PI/2)+x;for(let Lt=0,qt=L.length;Lt<qt;Lt++){let Jt=W(L[Lt],X[Lt],Vt);pt(Jt.x,Jt.y,-dt),lt===0&&j.push(Jt)}for(let Lt=0,qt=P;Lt<qt;Lt++){let Jt=D[Lt];tt=Q[Lt];let N=[];for(let he=0,ie=Jt.length;he<ie;he++){let R=W(Jt[he],tt[he],Vt);pt(R.x,R.y,-dt),lt===0&&N.push(R)}lt===0&&rt.push(N)}}at=Zi.triangulateShape(j,rt)}let Ct=at.length,Bt=m+x;for(let j=0;j<z;j++){let rt=u?W(I[j],ht[j],Bt):I[j];v?(C.copy(T.normals[0]).multiplyScalar(rt.x),E.copy(T.binormals[0]).multiplyScalar(rt.y),y.copy(S[0]).add(C).add(E),pt(y.x,y.y,y.z)):pt(rt.x,rt.y,0)}for(let j=1;j<=h;j++)for(let rt=0;rt<z;rt++){let ot=u?W(I[rt],ht[rt],Bt):I[rt];v?(C.copy(T.normals[j]).multiplyScalar(ot.x),E.copy(T.binormals[j]).multiplyScalar(ot.y),y.copy(S[j]).add(C).add(E),pt(y.x,y.y,y.z)):pt(ot.x,ot.y,f/h*j)}for(let j=g-1;j>=0;j--){let rt=j/g,ot=d*Math.cos(rt*Math.PI/2),lt=m*Math.sin(rt*Math.PI/2)+x;for(let dt=0,Vt=L.length;dt<Vt;dt++){let Lt=W(L[dt],X[dt],lt);pt(Lt.x,Lt.y,f+ot)}for(let dt=0,Vt=D.length;dt<Vt;dt++){let Lt=D[dt];tt=Q[dt];for(let qt=0,Jt=Lt.length;qt<Jt;qt++){let N=W(Lt[qt],tt[qt],lt);v?pt(N.x,N.y+S[h-1].y,S[h-1].x+ot):pt(N.x,N.y,f+ot)}}}Xt(),Y();function Xt(){let j=n.length/3;if(u){let rt=0,ot=z*rt;for(let lt=0;lt<Ct;lt++){let dt=at[lt];zt(dt[2]+ot,dt[1]+ot,dt[0]+ot)}rt=h+g*2,ot=z*rt;for(let lt=0;lt<Ct;lt++){let dt=at[lt];zt(dt[0]+ot,dt[1]+ot,dt[2]+ot)}}else{for(let rt=0;rt<Ct;rt++){let ot=at[rt];zt(ot[2],ot[1],ot[0])}for(let rt=0;rt<Ct;rt++){let ot=at[rt];zt(ot[0]+z*h,ot[1]+z*h,ot[2]+z*h)}}i.addGroup(j,n.length/3-j,0)}function Y(){let j=n.length/3,rt=0;K(L,rt),rt+=L.length;for(let ot=0,lt=D.length;ot<lt;ot++){let dt=D[ot];K(dt,rt),rt+=dt.length}i.addGroup(j,n.length/3-j,1)}function K(j,rt){let ot=j.length;for(;--ot>=0;){let lt=ot,dt=ot-1;dt<0&&(dt=j.length-1);for(let Vt=0,Lt=h+g*2;Vt<Lt;Vt++){let qt=z*Vt,Jt=z*(Vt+1),N=rt+lt+qt,he=rt+dt+qt,ie=rt+dt+Jt,R=rt+lt+Jt;Et(N,he,ie,R)}}}function pt(j,rt,ot){l.push(j),l.push(rt),l.push(ot)}function zt(j,rt,ot){kt(j),kt(rt),kt(ot);let lt=n.length/3,dt=M.generateTopUV(i,n,lt-3,lt-2,lt-1);re(dt[0]),re(dt[1]),re(dt[2])}function Et(j,rt,ot,lt){kt(j),kt(rt),kt(lt),kt(rt),kt(ot),kt(lt);let dt=n.length/3,Vt=M.generateSideWallUV(i,n,dt-6,dt-3,dt-2,dt-1);re(Vt[0]),re(Vt[1]),re(Vt[3]),re(Vt[1]),re(Vt[2]),re(Vt[3])}function kt(j){n.push(l[j*3+0]),n.push(l[j*3+1]),n.push(l[j*3+2])}function re(j){r.push(j.x),r.push(j.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON(),e=this.parameters.shapes,i=this.parameters.options;return R0(e,i,t)}static fromJSON(t,e){let i=[];for(let r=0,a=t.shapes.length;r<a;r++){let o=e[t.shapes[r]];i.push(o)}let n=t.options.extrudePath;return n!==void 0&&(t.options.extrudePath=new wh[n.type]().fromJSON(n)),new s(i,t.options)}},A0={generateTopUV:function(s,t,e,i,n){let r=t[e*3],a=t[e*3+1],o=t[i*3],l=t[i*3+1],c=t[n*3],h=t[n*3+1];return[new nt(r,a),new nt(o,l),new nt(c,h)]},generateSideWallUV:function(s,t,e,i,n,r){let a=t[e*3],o=t[e*3+1],l=t[e*3+2],c=t[i*3],h=t[i*3+1],f=t[i*3+2],u=t[n*3],d=t[n*3+1],m=t[n*3+2],x=t[r*3],g=t[r*3+1],p=t[r*3+2];return Math.abs(o-h)<Math.abs(a-c)?[new nt(a,1-l),new nt(c,1-f),new nt(u,1-m),new nt(x,1-p)]:[new nt(o,1-l),new nt(h,1-f),new nt(d,1-m),new nt(g,1-p)]}};function R0(s,t,e){if(e.shapes=[],Array.isArray(s))for(let i=0,n=s.length;i<n;i++){let r=s[i];e.shapes.push(r.uuid)}else e.shapes.push(s.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}var ma=class s extends jo{constructor(t=1,e=0){let i=(1+Math.sqrt(5))/2,n=[-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(n,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new s(t.radius,t.detail)}};var je=class s extends xe{constructor(t=1,e=1,i=1,n=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:n};let r=t/2,a=e/2,o=Math.floor(i),l=Math.floor(n),c=o+1,h=l+1,f=t/o,u=e/l,d=[],m=[],x=[],g=[];for(let p=0;p<h;p++){let M=p*u-a;for(let S=0;S<c;S++){let v=S*f-r;m.push(v,-M,0),x.push(0,0,1),g.push(S/o),g.push(1-p/l)}}for(let p=0;p<l;p++)for(let M=0;M<o;M++){let S=M+c*p,v=M+c*(p+1),T=M+1+c*(p+1),E=M+1+c*p;d.push(S,v,E),d.push(v,T,E)}this.setIndex(d),this.setAttribute("position",new Yt(m,3)),this.setAttribute("normal",new Yt(x,3)),this.setAttribute("uv",new Yt(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.width,t.height,t.widthSegments,t.heightSegments)}},ga=class s extends xe{constructor(t=.5,e=1,i=32,n=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:i,phiSegments:n,thetaStart:r,thetaLength:a},i=Math.max(3,i),n=Math.max(1,n);let o=[],l=[],c=[],h=[],f=t,u=(e-t)/n,d=new w,m=new nt;for(let x=0;x<=n;x++){for(let g=0;g<=i;g++){let p=r+g/i*a;d.x=f*Math.cos(p),d.y=f*Math.sin(p),l.push(d.x,d.y,d.z),c.push(0,0,1),m.x=(d.x/e+1)/2,m.y=(d.y/e+1)/2,h.push(m.x,m.y)}f+=u}for(let x=0;x<n;x++){let g=x*(i+1);for(let p=0;p<i;p++){let M=p+g,S=M,v=M+i+1,T=M+i+2,E=M+1;o.push(S,v,E),o.push(v,T,E)}}this.setIndex(o),this.setAttribute("position",new Yt(l,3)),this.setAttribute("normal",new Yt(c,3)),this.setAttribute("uv",new Yt(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}},xa=class s extends xe{constructor(t=new Ln([new nt(0,.5),new nt(-.5,-.5),new nt(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};let i=[],n=[],r=[],a=[],o=0,l=0;if(Array.isArray(t)===!1)c(t);else for(let h=0;h<t.length;h++)c(t[h]),this.addGroup(o,l,h),o+=l,l=0;this.setIndex(i),this.setAttribute("position",new Yt(n,3)),this.setAttribute("normal",new Yt(r,3)),this.setAttribute("uv",new Yt(a,2));function c(h){let f=n.length/3,u=h.extractPoints(e),d=u.shape,m=u.holes;Zi.isClockWise(d)===!1&&(d=d.reverse());for(let g=0,p=m.length;g<p;g++){let M=m[g];Zi.isClockWise(M)===!0&&(m[g]=M.reverse())}let x=Zi.triangulateShape(d,m);for(let g=0,p=m.length;g<p;g++){let M=m[g];d=d.concat(M)}for(let g=0,p=d.length;g<p;g++){let M=d[g];n.push(M.x,M.y,0),r.push(0,0,1),a.push(M.x,M.y)}for(let g=0,p=x.length;g<p;g++){let M=x[g],S=M[0]+f,v=M[1]+f,T=M[2]+f;i.push(S,v,T),l+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON(),e=this.parameters.shapes;return C0(e,t)}static fromJSON(t,e){let i=[];for(let n=0,r=t.shapes.length;n<r;n++){let a=e[t.shapes[n]];i.push(a)}return new s(i,t.curveSegments)}};function C0(s,t){if(t.shapes=[],Array.isArray(s))for(let e=0,i=s.length;e<i;e++){let n=s[e];t.shapes.push(n.uuid)}else t.shapes.push(s.uuid);return t}var ss=class s extends xe{constructor(t=1,e=32,i=16,n=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:i,phiStart:n,phiLength:r,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),i=Math.max(2,Math.floor(i));let l=Math.min(a+o,Math.PI),c=0,h=[],f=new w,u=new w,d=[],m=[],x=[],g=[];for(let p=0;p<=i;p++){let M=[],S=p/i,v=a+S*o,T=t*Math.cos(v),E=Math.sqrt(t*t-T*T),C=0;p===0&&a===0?C=.5/e:p===i&&l===Math.PI&&(C=-.5/e);for(let y=0;y<=e;y++){let A=y/e,I=n+A*r;f.x=-E*Math.cos(I),f.y=T,f.z=E*Math.sin(I),m.push(f.x,f.y,f.z),u.copy(f).normalize(),x.push(u.x,u.y,u.z),g.push(A+C,1-S),M.push(c++)}h.push(M)}for(let p=0;p<i;p++)for(let M=0;M<e;M++){let S=h[p][M+1],v=h[p][M],T=h[p+1][M],E=h[p+1][M+1];(p!==0||a>0)&&d.push(S,v,E),(p!==i-1||l<Math.PI)&&d.push(v,T,E)}this.setIndex(d),this.setAttribute("position",new Yt(m,3)),this.setAttribute("normal",new Yt(x,3)),this.setAttribute("uv",new Yt(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}};var xn=class s extends xe{constructor(t=1,e=.4,i=12,n=48,r=Math.PI*2,a=0,o=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:i,tubularSegments:n,arc:r,thetaStart:a,thetaLength:o},i=Math.floor(i),n=Math.floor(n);let l=[],c=[],h=[],f=[],u=new w,d=new w,m=new w;for(let x=0;x<=i;x++){let g=a+x/i*o;for(let p=0;p<=n;p++){let M=p/n*r;d.x=(t+e*Math.cos(g))*Math.cos(M),d.y=(t+e*Math.cos(g))*Math.sin(M),d.z=e*Math.sin(g),c.push(d.x,d.y,d.z),u.x=t*Math.cos(M),u.y=t*Math.sin(M),m.subVectors(d,u).normalize(),h.push(m.x,m.y,m.z),f.push(p/n),f.push(x/i)}}for(let x=1;x<=i;x++)for(let g=1;g<=n;g++){let p=(n+1)*x+g-1,M=(n+1)*(x-1)+g-1,S=(n+1)*(x-1)+g,v=(n+1)*x+g;l.push(p,M,v),l.push(M,S,v)}this.setIndex(l),this.setAttribute("position",new Yt(c,3)),this.setAttribute("normal",new Yt(h,3)),this.setAttribute("uv",new Yt(f,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc,t.thetaStart,t.thetaLength)}};function cs(s){let t={};for(let e in s){t[e]={};for(let i in s[e]){let n=s[e][i];if(Nd(n))n.isRenderTargetTexture?(Gt("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=n.clone();else if(Array.isArray(n))if(Nd(n[0])){let r=[];for(let a=0,o=n.length;a<o;a++)r[a]=n[a].clone();t[e][i]=r}else t[e][i]=n.slice();else t[e][i]=n}}return t}function ni(s){let t={};for(let e=0;e<s.length;e++){let i=cs(s[e]);for(let n in i)t[n]=i[n]}return t}function Nd(s){return s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)}function P0(s){let t=[];for(let e=0;e<s.length;e++)t.push(s[e].clone());return t}function Zh(s){let t=s.getRenderTarget();return t===null?s.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:te.workingColorSpace}var vn={clone:cs,merge:ni},I0=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,L0=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,we=class extends en{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=I0,this.fragmentShader=L0,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=cs(t.uniforms),this.uniformsGroups=P0(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this.defaultAttributeValues=Object.assign({},t.defaultAttributeValues),this.index0AttributeName=t.index0AttributeName,this.uniformsNeedUpdate=t.uniformsNeedUpdate,this}toJSON(t){let e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(let n in this.uniforms){let a=this.uniforms[n].value;a&&a.isTexture?e.uniforms[n]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[n]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[n]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[n]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[n]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[n]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[n]={type:"m4",value:a.toArray()}:e.uniforms[n]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;let i={};for(let n in this.extensions)this.extensions[n]===!0&&(i[n]=!0);return Object.keys(i).length>0&&(e.extensions=i),e}fromJSON(t,e){if(super.fromJSON(t,e),t.uniforms!==void 0)for(let i in t.uniforms){let n=t.uniforms[i];switch(this.uniforms[i]={},n.type){case"t":this.uniforms[i].value=e[n.value]||null;break;case"c":this.uniforms[i].value=new ct().setHex(n.value);break;case"v2":this.uniforms[i].value=new nt().fromArray(n.value);break;case"v3":this.uniforms[i].value=new w().fromArray(n.value);break;case"v4":this.uniforms[i].value=new Re().fromArray(n.value);break;case"m3":this.uniforms[i].value=new $t().fromArray(n.value);break;case"m4":this.uniforms[i].value=new le().fromArray(n.value);break;default:this.uniforms[i].value=n.value}}if(t.defines!==void 0&&(this.defines=t.defines),t.vertexShader!==void 0&&(this.vertexShader=t.vertexShader),t.fragmentShader!==void 0&&(this.fragmentShader=t.fragmentShader),t.glslVersion!==void 0&&(this.glslVersion=t.glslVersion),t.extensions!==void 0)for(let i in t.extensions)this.extensions[i]=t.extensions[i];return t.lights!==void 0&&(this.lights=t.lights),t.clipping!==void 0&&(this.clipping=t.clipping),this}},Ks=class extends we{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},Ae=class extends en{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new ct(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ct(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=oc,this.normalScale=new nt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new mn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}},_a=class extends Ae{constructor(t){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new nt(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Qt(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new ct(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new ct(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new ct(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(t)}get anisotropy(){return this._anisotropy}set anisotropy(t){this._anisotropy>0!=t>0&&this.version++,this._anisotropy=t}get clearcoat(){return this._clearcoat}set clearcoat(t){this._clearcoat>0!=t>0&&this.version++,this._clearcoat=t}get iridescence(){return this._iridescence}set iridescence(t){this._iridescence>0!=t>0&&this.version++,this._iridescence=t}get dispersion(){return this._dispersion}set dispersion(t){this._dispersion>0!=t>0&&this.version++,this._dispersion=t}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(t){this._retroreflectivity>0!=t>0&&this.version++,this._retroreflectivity=t}get sheen(){return this._sheen}set sheen(t){this._sheen>0!=t>0&&this.version++,this._sheen=t}get transmission(){return this._transmission}set transmission(t){this._transmission>0!=t>0&&this.version++,this._transmission=t}copy(t){return super.copy(t),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=t.anisotropy,this.anisotropyRotation=t.anisotropyRotation,this.anisotropyMap=t.anisotropyMap,this.clearcoat=t.clearcoat,this.clearcoatMap=t.clearcoatMap,this.clearcoatRoughness=t.clearcoatRoughness,this.clearcoatRoughnessMap=t.clearcoatRoughnessMap,this.clearcoatNormalMap=t.clearcoatNormalMap,this.clearcoatNormalScale.copy(t.clearcoatNormalScale),this.dispersion=t.dispersion,this.ior=t.ior,this.iridescence=t.iridescence,this.iridescenceMap=t.iridescenceMap,this.iridescenceIOR=t.iridescenceIOR,this.iridescenceThicknessRange=[...t.iridescenceThicknessRange],this.iridescenceThicknessMap=t.iridescenceThicknessMap,this.retroreflectivity=t.retroreflectivity,this.sheen=t.sheen,this.sheenColor.copy(t.sheenColor),this.sheenColorMap=t.sheenColorMap,this.sheenRoughness=t.sheenRoughness,this.sheenRoughnessMap=t.sheenRoughnessMap,this.transmission=t.transmission,this.transmissionMap=t.transmissionMap,this.thickness=t.thickness,this.thicknessMap=t.thicknessMap,this.attenuationDistance=t.attenuationDistance,this.attenuationColor.copy(t.attenuationColor),this.specularIntensity=t.specularIntensity,this.specularIntensityMap=t.specularIntensityMap,this.specularColor.copy(t.specularColor),this.specularColorMap=t.specularColorMap,this}};var rl=class extends en{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=uf,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},al=class extends en{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}};function Us(s,t){return!s||s.constructor===t?s:typeof t.BYTES_PER_ELEMENT=="number"?new t(s):Array.prototype.slice.call(s)}function vh(s){return s!==void 0&&s.inTangents!==void 0&&s.outTangents!==void 0}var Dn=class{constructor(t,e,i,n){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=n!==void 0?n:new e.constructor(i),this.sampleValues=e,this.valueSize=i,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,i=this._cachedIndex,n=e[i],r=e[i-1];i:{t:{let a;e:{n:if(!(t<n)){for(let o=i+2;;){if(n===void 0){if(t<r)break n;return i=e.length,this._cachedIndex=i,this.copySampleValue_(i-1)}if(i===o)break;if(r=n,n=e[++i],t<n)break t}a=e.length;break e}if(!(t>=r)){let o=e[1];t<o&&(i=2,r=o);for(let l=i-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===l)break;if(n=r,r=e[--i-1],t>=r)break t}a=i,i=0;break e}break i}for(;i<a;){let o=i+a>>>1;t<e[o]?a=o:i=o+1}if(n=e[i],r=e[i-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===void 0)return i=e.length,this._cachedIndex=i,this.copySampleValue_(i-1)}this._cachedIndex=i,this.intervalChanged_(i,r,n)}return this.interpolate_(i,r,t,n)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,i=this.sampleValues,n=this.valueSize,r=t*n;for(let a=0;a!==n;++a)e[a]=i[r+a];return e}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},ol=class extends Dn{constructor(t,e,i,n){super(t,e,i,n),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:bh,endingEnd:bh}}intervalChanged_(t,e,i){let n=this.parameterPositions,r=t-2,a=t+1,o=n[r],l=n[a];if(o===void 0)switch(this.getSettings_().endingStart){case Sh:r=t,o=2*e-i;break;case Th:r=n.length-2,o=e+n[r]-n[r+1];break;default:r=t,o=i}if(l===void 0)switch(this.getSettings_().endingEnd){case Sh:a=t,l=2*i-e;break;case Th:a=1,l=i+n[1]-n[0];break;default:a=t-1,l=e}let c=(i-e)*.5,h=this.valueSize;this._weightPrev=c/(e-o),this._weightNext=c/(l-i),this._offsetPrev=r*h,this._offsetNext=a*h}interpolate_(t,e,i,n){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=t*o,c=l-o,h=this._offsetPrev,f=this._offsetNext,u=this._weightPrev,d=this._weightNext,m=(i-e)/(n-e),x=m*m,g=x*m,p=-u*g+2*u*x-u*m,M=(1+u)*g+(-1.5-2*u)*x+(-.5+u)*m+1,S=(-1-d)*g+(1.5+d)*x+.5*m,v=d*g-d*x;for(let T=0;T!==o;++T)r[T]=p*a[h+T]+M*a[c+T]+S*a[l+T]+v*a[f+T];return r}},ll=class extends Dn{constructor(t,e,i,n){super(t,e,i,n)}interpolate_(t,e,i,n){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=t*o,c=l-o,h=(i-e)/(n-e),f=1-h;for(let u=0;u!==o;++u)r[u]=a[c+u]*f+a[l+u]*h;return r}},cl=class extends Dn{constructor(t,e,i,n){super(t,e,i,n)}interpolate_(t){return this.copySampleValue_(t-1)}},hl=class extends Dn{interpolate_(t,e,i,n){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=t*o,c=l-o,h=this.inTangents,f=this.outTangents;if(!h||!f){let m=(i-e)/(n-e),x=1-m;for(let g=0;g!==o;++g)r[g]=a[c+g]*x+a[l+g]*m;return r}let u=o*2,d=t-1;for(let m=0;m!==o;++m){let x=a[c+m],g=a[l+m],p=d*u+m*2,M=f[p],S=f[p+1],v=t*u+m*2,T=h[v],E=h[v+1],C=N0(i,e,M,T,n);r[m]=Pf(C,x,S,E,g)}return r}};function Pf(s,t,e,i,n){let r=1-s;return r*r*r*t+3*r*r*s*e+3*r*s*s*i+s*s*s*n}function D0(s,t,e,i,n){let r=1-s;return 3*r*r*(e-t)+6*r*s*(i-e)+3*s*s*(n-i)}function N0(s,t,e,i,n){let r=(s-t)/(n-t);for(let a=0;a<8;a++){let o=Pf(r,t,e,i,n)-s;if(Math.abs(o)<1e-10)break;let l=D0(r,t,e,i,n);if(Math.abs(l)<1e-10)break;r=Math.max(0,Math.min(1,r-o/l))}return r}var Mi=class{constructor(t,e,i,n){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=Us(e,this.TimeBufferType),this.values=Us(i,this.ValueBufferType),this.setInterpolation(n||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,i;if(e.toJSON!==this.toJSON)i=e.toJSON(t);else{i={name:t.name,times:Us(t.times,Array),values:Us(t.values,Array)};let n=t.getInterpolation();n!==t.DefaultInterpolation&&(i.interpolation=n),vh(t.settings)&&(i.settings={inTangents:Us(t.settings.inTangents,Array),outTangents:Us(t.settings.outTangents,Array)})}return i.type=t.ValueTypeName,i}InterpolantFactoryMethodDiscrete(t){return new cl(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new ll(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new ol(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodBezier(t){let e=new hl(this.times,this.values,this.getValueSize(),t);return this.settings&&(e.inTangents=this.settings.inTangents,e.outTangents=this.settings.outTangents),e}setInterpolation(t){let e;switch(t){case Vr:e=this.InterpolantFactoryMethodDiscrete;break;case qo:e=this.InterpolantFactoryMethodLinear;break;case Fo:e=this.InterpolantFactoryMethodSmooth;break;case Mh:e=this.InterpolantFactoryMethodBezier;break}if(e===void 0){let i="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(i);return Gt("KeyframeTrack:",i),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Vr;case this.InterpolantFactoryMethodLinear:return qo;case this.InterpolantFactoryMethodSmooth:return Fo;case this.InterpolantFactoryMethodBezier:return Mh}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let i=0,n=e.length;i!==n;++i)e[i]+=t}return this}scale(t){if(t!==1){let e=this.times;for(let i=0,n=e.length;i!==n;++i)e[i]*=t;vh(this.settings)&&(Ud(this.settings.inTangents,t),Ud(this.settings.outTangents,t))}return this}trim(t,e){let i=this.times,n=i.length,r=0,a=n-1;for(;r!==n&&i[r]<t;)++r;for(;a!==-1&&i[a]>e;)--a;if(++a,r!==0||a!==n){r>=a&&(a=Math.max(a,1),r=a-1);let o=this.getValueSize();this.times=i.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(Wt("KeyframeTrack: Invalid value size in track.",this),t=!1);let i=this.times,n=this.values,r=i.length;r===0&&(Wt("KeyframeTrack: Track is empty.",this),t=!1);let a=null;for(let o=0;o!==r;o++){let l=i[o];if(typeof l=="number"&&isNaN(l)){Wt("KeyframeTrack: Time is not a valid number.",this,o,l),t=!1;break}if(a!==null&&a>l){Wt("KeyframeTrack: Out of order keys.",this,o,l,a),t=!1;break}a=l}if(n!==void 0&&Mm(n))for(let o=0,l=n.length;o!==l;++o){let c=n[o];if(isNaN(c)){Wt("KeyframeTrack: Value is not a valid number.",this,o,c),t=!1;break}}return t}optimize(){let t=this.times.slice(),e=this.values.slice(),i=this.getValueSize(),n=this.getInterpolation()===Fo,r=t.length-1,a=1;for(let o=1;o<r;++o){let l=!1,c=t[o],h=t[o+1];if(c!==h&&(o!==1||c!==t[0]))if(n)l=!0;else{let f=o*i,u=f-i,d=f+i;for(let m=0;m!==i;++m){let x=e[f+m];if(x!==e[u+m]||x!==e[d+m]){l=!0;break}}}if(l){if(o!==a){t[a]=t[o];let f=o*i,u=a*i;for(let d=0;d!==i;++d)e[u+d]=e[f+d]}++a}}if(r>0){t[a]=t[r];for(let o=r*i,l=a*i,c=0;c!==i;++c)e[l+c]=e[o+c];++a}return a!==t.length?(this.times=t.slice(0,a),this.values=e.slice(0,a*i)):(this.times=t,this.values=e),this}clone(){let t=this.times.slice(),e=this.values.slice(),i=this.constructor,n=new i(this.name,t,e);return n.createInterpolant=this.createInterpolant,vh(this.settings)&&(n.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),n}};function Ud(s,t){for(let e=0,i=s.length;e!==i;e+=2)s[e]*=t}Mi.prototype.ValueTypeName="";Mi.prototype.TimeBufferType=Float32Array;Mi.prototype.ValueBufferType=Float32Array;Mi.prototype.DefaultInterpolation=qo;var Nn=class extends Mi{constructor(t,e,i){super(t,e,i)}};Nn.prototype.ValueTypeName="bool";Nn.prototype.ValueBufferType=Array;Nn.prototype.DefaultInterpolation=Vr;Nn.prototype.InterpolantFactoryMethodLinear=void 0;Nn.prototype.InterpolantFactoryMethodSmooth=void 0;var ul=class extends Mi{constructor(t,e,i,n){super(t,e,i,n)}};ul.prototype.ValueTypeName="color";var dl=class extends Mi{constructor(t,e,i,n){super(t,e,i,n)}};dl.prototype.ValueTypeName="number";var fl=class extends Dn{constructor(t,e,i,n){super(t,e,i,n)}interpolate_(t,e,i,n){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(i-e)/(n-e),c=t*o;for(let h=c+o;c!==h;c+=4)ae.slerpFlat(r,0,a,c-o,a,c,l);return r}},va=class extends Mi{constructor(t,e,i,n){super(t,e,i,n)}InterpolantFactoryMethodLinear(t){return new fl(this.times,this.values,this.getValueSize(),t)}};va.prototype.ValueTypeName="quaternion";va.prototype.InterpolantFactoryMethodSmooth=void 0;var Un=class extends Mi{constructor(t,e,i){super(t,e,i)}};Un.prototype.ValueTypeName="string";Un.prototype.ValueBufferType=Array;Un.prototype.DefaultInterpolation=Vr;Un.prototype.InterpolantFactoryMethodLinear=void 0;Un.prototype.InterpolantFactoryMethodSmooth=void 0;var pl=class extends Mi{constructor(t,e,i,n){super(t,e,i,n)}};pl.prototype.ValueTypeName="vector";var ml=class{constructor(t,e,i){let n=this,r=!1,a=0,o=0,l,c=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=i,this._abortController=null,this.itemStart=function(h){o++,r===!1&&n.onStart!==void 0&&n.onStart(h,a,o),r=!0},this.itemEnd=function(h){a++,n.onProgress!==void 0&&n.onProgress(h,a,o),a===o&&(r=!1,n.onLoad!==void 0&&n.onLoad())},this.itemError=function(h){n.onError!==void 0&&n.onError(h)},this.resolveURL=function(h){return h=h.normalize("NFC"),l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,f){return c.push(h,f),this},this.removeHandler=function(h){let f=c.indexOf(h);return f!==-1&&c.splice(f,2),this},this.getHandler=function(h){for(let f=0,u=c.length;f<u;f+=2){let d=c[f],m=c[f+1];if(d.global&&(d.lastIndex=0),d.test(h))return m}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},If=new ml,gl=class{constructor(t){this.manager=t!==void 0?t:If,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(t,e){let i=this;return new Promise(function(n,r){i.load(t,n,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}abort(){return this}};gl.DEFAULT_MATERIAL_NAME="__DEFAULT";var ya=class extends qe{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new ct(t),this.intensity=e}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){let e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,e}},Ma=class extends ya{constructor(t,e,i){super(t,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(qe.DEFAULT_UP),this.updateMatrix(),this.groundColor=new ct(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}toJSON(t){let e=super.toJSON(t);return e.object.groundColor=this.groundColor.getHex(),e}},yh=new le,Fd=new w,Bd=new w,xl=class{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new nt(512,512),this.mapType=gi,this.map=null,this.mapPass=null,this.matrix=new le,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new qs,this._frameExtents=new nt(1,1),this._viewportCount=1,this._viewports=[new Re(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(t){let e=this.camera;Fd.setFromMatrixPosition(t.matrixWorld),e.position.copy(Fd),Bd.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Bd),e.updateMatrixWorld(),this._updateMatrix(e,this.matrix,this._frustum)}_updateMatrix(t,e,i,n){yh.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),i.setFromProjectionMatrix(yh,t.coordinateSystem,t.reversedDepth);let r=this._frameExtents,a=n?n.z/r.x:1,o=n?n.w/r.y:1,l=n?n.x/r.x:0,c=n?n.y/r.y:0;t.coordinateSystem===ks||t.reversedDepth?e.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):e.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),e.multiply(yh)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this.biasNode=t.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let t={};return t.intensity=this.intensity,t.bias=this.bias,t.normalBias=this.normalBias,t.radius=this.radius,t.blurSamples=this.blurSamples,t.mapSize=this.mapSize.toArray(),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}},No=new w,Uo=new ae,$i=new w,ba=class extends qe{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new le,this.projectionMatrix=new le,this.projectionMatrixInverse=new le,this.coordinateSystem=ki,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorld.decompose(No,Uo,$i),$i.x===1&&$i.y===1&&$i.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(No,Uo,$i.set(1,1,1)).invert()}updateWorldMatrix(t,e,i=!1){super.updateWorldMatrix(t,e,i),this.matrixWorld.decompose(No,Uo,$i),$i.x===1&&$i.y===1&&$i.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(No,Uo,$i.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},Pn=new w,Od=new nt,zd=new nt,Ze=class extends ba{constructor(t=50,e=1,i=.1,n=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=n,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=.5*this.getFilmHeight()/t;this.fov=Hs*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(Br*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Hs*2*Math.atan(Math.tan(Br*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,i){Pn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Pn.x,Pn.y).multiplyScalar(-t/Pn.z),Pn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Pn.x,Pn.y).multiplyScalar(-t/Pn.z)}getViewSize(t,e){return this.getViewBounds(t,Od,zd),e.subVectors(zd,Od)}setViewOffset(t,e,i,n,r,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=n,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan(Br*.5*this.fov)/this.zoom,i=2*e,n=this.aspect*i,r=-.5*n,a=this.view;if(this.view!==null&&this.view.enabled){let l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*n/l,e-=a.offsetY*i/c,n*=a.width/l,i*=a.height/c}let o=this.filmOffset;o!==0&&(r+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+n,e,e-i,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}};var Fn=class extends ba{constructor(t=-1,e=1,i=1,n=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=n,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,i,n,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=n,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,n=(this.top+this.bottom)/2,r=i-t,a=i+t,o=n+e,l=n-e;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}},Ph=class extends xl{constructor(){super(new Fn(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Sa=class extends ya{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(qe.DEFAULT_UP),this.updateMatrix(),this.target=new qe,this.shadow=new Ph}dispose(){super.dispose(),this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}toJSON(t){let e=super.toJSON(t);return e.object.shadow=this.shadow.toJSON(),e.object.target=this.target.uuid,e}};var Fs=-90,Bs=1,_l=class extends qe{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;let n=new Ze(Fs,Bs,t,e);n.layers=this.layers,this.add(n);let r=new Ze(Fs,Bs,t,e);r.layers=this.layers,this.add(r);let a=new Ze(Fs,Bs,t,e);a.layers=this.layers,this.add(a);let o=new Ze(Fs,Bs,t,e);o.layers=this.layers,this.add(o);let l=new Ze(Fs,Bs,t,e);l.layers=this.layers,this.add(l);let c=new Ze(Fs,Bs,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let t=this.coordinateSystem,e=this.children.concat(),[i,n,r,a,o,l]=e;for(let c of e)this.remove(c);if(t===ki)i.up.set(0,1,0),i.lookAt(1,0,0),n.up.set(0,1,0),n.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===ks)i.up.set(0,-1,0),i.lookAt(-1,0,0),n.up.set(0,-1,0),n.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();let{renderTarget:i,activeMipmapLevel:n}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[r,a,o,l,c,h]=this.children,f=t.getRenderTarget(),u=t.getActiveCubeFace(),d=t.getActiveMipmapLevel(),m=t.xr.enabled;t.xr.enabled=!1;let x=i.texture.generateMipmaps;i.texture.generateMipmaps=!1;let g=!1;t.isWebGLRenderer===!0?g=t.state.buffers.depth.getReversed():g=t.reversedDepthBuffer,t.setRenderTarget(i,0,n),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,r),t.setRenderTarget(i,1,n),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,a),t.setRenderTarget(i,2,n),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,o),t.setRenderTarget(i,3,n),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,l),t.setRenderTarget(i,4,n),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,c),i.texture.generateMipmaps=x,t.setRenderTarget(i,5,n),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,h),t.setRenderTarget(f,u,d),t.xr.enabled=m,i.texture.needsPMREMUpdate=!0}},vl=class extends Ze{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}},Ta=class{constructor(){this._previousTime=0,this._currentTime=0,this._startTime=performance.now(),this._delta=0,this._elapsed=0,this._timescale=1,this._document=null,this._pageVisibilityHandler=null}connect(t){this._document=t,t.hidden!==void 0&&(this._pageVisibilityHandler=U0.bind(this),t.addEventListener("visibilitychange",this._pageVisibilityHandler,!1))}disconnect(){this._pageVisibilityHandler!==null&&(this._document.removeEventListener("visibilitychange",this._pageVisibilityHandler),this._pageVisibilityHandler=null),this._document=null}getDelta(){return this._delta/1e3}getElapsed(){return this._elapsed/1e3}getTimescale(){return this._timescale}setTimescale(t){return this._timescale=t,this}reset(){return this._currentTime=performance.now()-this._startTime,this}dispose(){this.disconnect()}update(t){return this._pageVisibilityHandler!==null&&this._document.hidden===!0?this._delta=0:(this._previousTime=this._currentTime,this._currentTime=(t!==void 0?t:performance.now())-this._startTime,this._delta=(this._currentTime-this._previousTime)*this._timescale,this._elapsed+=this._delta),this}};function U0(){this._document.hidden===!1&&this.reset()}var Kh="\\[\\]\\.:\\/",F0=new RegExp("["+Kh+"]","g"),jh="[^"+Kh+"]",B0="[^"+Kh.replace("\\.","")+"]",O0=/((?:WC+[\/:])*)/.source.replace("WC",jh),z0=/(WCOD+)?/.source.replace("WCOD",B0),k0=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",jh),V0=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",jh),H0=new RegExp("^"+O0+z0+k0+V0+"$"),G0=["material","materials","bones","map"],Ih=class{constructor(t,e,i){let n=i||Ee.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,n)}getValue(t,e){this.bind();let i=this._targetGroup.nCachedObjects_,n=this._bindings[i];n!==void 0&&n.getValue(t,e)}setValue(t,e){let i=this._bindings;for(let n=this._targetGroup.nCachedObjects_,r=i.length;n!==r;++n)i[n].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,i=t.length;e!==i;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,i=t.length;e!==i;++e)t[e].unbind()}},Ee=class s{constructor(t,e,i){this.path=e,this.parsedPath=i||s.parseTrackName(e),this.node=s.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,i){return t&&t.isAnimationObjectGroup?new s.Composite(t,e,i):new s(t,e,i)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(F0,"")}static parseTrackName(t){let e=H0.exec(t);if(e===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+t);let i={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},n=i.nodeName&&i.nodeName.lastIndexOf(".");if(n!==void 0&&n!==-1){let r=i.nodeName.substring(n+1);G0.indexOf(r)!==-1&&(i.nodeName=i.nodeName.substring(0,n),i.objectName=r)}if(i.propertyName===null||i.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+t);return i}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let i=t.skeleton.getBoneByName(e);if(i!==void 0)return i}if(t.children){let i=function(r){for(let a=0;a<r.length;a++){let o=r[a];if(o.name===e||o.uuid===e)return o;let l=i(o.children);if(l)return l}return null},n=i(t.children);if(n)return n}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let i=this.resolvedProperty;for(let n=0,r=i.length;n!==r;++n)t[e++]=i[n]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let i=this.resolvedProperty;for(let n=0,r=i.length;n!==r;++n)i[n]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let i=this.resolvedProperty;for(let n=0,r=i.length;n!==r;++n)i[n]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let i=this.resolvedProperty;for(let n=0,r=i.length;n!==r;++n)i[n]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,i=e.objectName,n=e.propertyName,r=e.propertyIndex;if(t||(t=s.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){Gt("PropertyBinding: No target node found for track: "+this.path+".");return}if(i){let c=e.objectIndex;switch(i){case"materials":if(!t.material){Wt("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){Wt("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){Wt("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let h=0;h<t.length;h++)if(t[h].name===c){c=h;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){Wt("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){Wt("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[i]===void 0){Wt("PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[i]}if(c!==void 0){if(t[c]===void 0){Wt("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[c]}}let a=t[n];if(a===void 0){let c=e.nodeName;Wt("PropertyBinding: Trying to update property for track: "+c+"."+n+" but it wasn't found.",t);return}let o=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?o=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(n==="morphTargetInfluences"){if(!t.geometry){Wt("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){Wt("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=n;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Ee.Composite=Ih;Ee.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Ee.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Ee.prototype.GetterByBindingType=[Ee.prototype._getValue_direct,Ee.prototype._getValue_array,Ee.prototype._getValue_arrayElement,Ee.prototype._getValue_toArray];Ee.prototype.SetterByBindingTypeAndVersioning=[[Ee.prototype._setValue_direct,Ee.prototype._setValue_direct_setNeedsUpdate,Ee.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Ee.prototype._setValue_array,Ee.prototype._setValue_array_setNeedsUpdate,Ee.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Ee.prototype._setValue_arrayElement,Ee.prototype._setValue_arrayElement_setNeedsUpdate,Ee.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Ee.prototype._setValue_fromArray,Ee.prototype._setValue_fromArray_setNeedsUpdate,Ee.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var MM=new Float32Array(1);var su=class su{constructor(t,e,i,n){this.elements=[1,0,0,1],t!==void 0&&this.set(t,e,i,n)}identity(){return this.set(1,0,0,1),this}fromArray(t,e=0){for(let i=0;i<4;i++)this.elements[i]=t[i+e];return this}set(t,e,i,n){let r=this.elements;return r[0]=t,r[2]=e,r[1]=i,r[3]=n,this}};su.prototype.isMatrix2=!0;var Lh=su;function Qh(s,t,e,i){let n=W0(i);switch(e){case Wh:return s*t;case Al:return s*t/n.components*n.byteLength;case Rl:return s*t/n.components*n.byteLength;case Hn:return s*t*2/n.components*n.byteLength;case Cl:return s*t*2/n.components*n.byteLength;case Xh:return s*t*3/n.components*n.byteLength;case Pi:return s*t*4/n.components*n.byteLength;case Pl:return s*t*4/n.components*n.byteLength;case Da:case Na:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*8;case Ua:case Fa:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case Ll:case Nl:return Math.max(s,16)*Math.max(t,8)/4;case Il:case Dl:return Math.max(s,8)*Math.max(t,8)/2;case Ul:case Fl:case Ol:case zl:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*8;case Bl:case Ba:case kl:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case Vl:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case Hl:return Math.floor((s+4)/5)*Math.floor((t+3)/4)*16;case Gl:return Math.floor((s+4)/5)*Math.floor((t+4)/5)*16;case Wl:return Math.floor((s+5)/6)*Math.floor((t+4)/5)*16;case Xl:return Math.floor((s+5)/6)*Math.floor((t+5)/6)*16;case ql:return Math.floor((s+7)/8)*Math.floor((t+4)/5)*16;case Yl:return Math.floor((s+7)/8)*Math.floor((t+5)/6)*16;case $l:return Math.floor((s+7)/8)*Math.floor((t+7)/8)*16;case Jl:return Math.floor((s+9)/10)*Math.floor((t+4)/5)*16;case Zl:return Math.floor((s+9)/10)*Math.floor((t+5)/6)*16;case Kl:return Math.floor((s+9)/10)*Math.floor((t+7)/8)*16;case jl:return Math.floor((s+9)/10)*Math.floor((t+9)/10)*16;case Ql:return Math.floor((s+11)/12)*Math.floor((t+9)/10)*16;case tc:return Math.floor((s+11)/12)*Math.floor((t+11)/12)*16;case ec:case ic:case nc:return Math.ceil(s/4)*Math.ceil(t/4)*16;case sc:case rc:return Math.ceil(s/4)*Math.ceil(t/4)*8;case Oa:case ac:return Math.ceil(s/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function W0(s){switch(s){case gi:case kh:return{byteLength:1,components:1};case Qs:case Vh:case ke:return{byteLength:2,components:1};case El:case wl:return{byteLength:2,components:4};case Gi:case Tl:case Ci:return{byteLength:4,components:1};case Hh:case Gh:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${s}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"186"}}));typeof window<"u"&&(window.__THREE__?Gt("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="186");function Qf(){let s=null,t=!1,e=null,i=null;function n(r,a){i=s.requestAnimationFrame(n),e(r,a)}return{start:function(){t!==!0&&e!==null&&s!==null&&(i=s.requestAnimationFrame(n),t=!0)},stop:function(){s!==null&&s.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){s=r}}}function q0(s){let t=new WeakMap;function e(o,l){let c=o.array,h=o.usage,f=c.byteLength,u=s.createBuffer();s.bindBuffer(l,u),s.bufferData(l,c,h),o.onUploadCallback();let d;if(c instanceof Float32Array)d=s.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)d=s.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?d=s.HALF_FLOAT:d=s.UNSIGNED_SHORT;else if(c instanceof Int16Array)d=s.SHORT;else if(c instanceof Uint32Array)d=s.UNSIGNED_INT;else if(c instanceof Int32Array)d=s.INT;else if(c instanceof Int8Array)d=s.BYTE;else if(c instanceof Uint8Array)d=s.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)d=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:u,type:d,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:f}}function i(o,l,c){let h=l.array,f=l.updateRanges;if(s.bindBuffer(c,o),f.length===0)s.bufferSubData(c,0,h);else{f.sort((d,m)=>d.start-m.start);let u=0;for(let d=1;d<f.length;d++){let m=f[u],x=f[d];x.start<=m.start+m.count+1?m.count=Math.max(m.count,x.start+x.count-m.start):(++u,f[u]=x)}f.length=u+1;for(let d=0,m=f.length;d<m;d++){let x=f[d];s.bufferSubData(c,x.start*h.BYTES_PER_ELEMENT,h,x.start,x.count)}l.clearUpdateRanges()}l.onUploadCallback()}function n(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);let l=t.get(o);l&&(s.deleteBuffer(l.buffer),t.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){let h=t.get(o);(!h||h.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}let c=t.get(o);if(c===void 0)t.set(o,e(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,o,l),c.version=o.version}}return{get:n,remove:r,update:a}}var Y0=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,$0=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,J0=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Z0=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,K0=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,j0=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Q0=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,tg=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,eg=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,ig=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,ng=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,sg=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,rg=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,ag=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,og=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,lg=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,cg=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,hg=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,ug=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,dg=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,fg=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,pg=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,mg=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,gg=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,xg=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,_g=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,vg=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,yg=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Mg=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,bg=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Sg="gl_FragColor = linearToOutputTexel( gl_FragColor );",Tg=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Eg=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,wg=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,Ag=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Rg=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Cg=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Pg=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Ig=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Lg=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Dg=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Ng=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Ug=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Fg=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Bg=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Og=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,zg=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,kg=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Vg=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Hg=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Gg=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Wg=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Xg=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,qg=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Yg=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,$g=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Jg=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,Zg=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Kg=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,jg=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Qg=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,tx=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,ex=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,ix=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,nx=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,sx=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,rx=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,ax=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,ox=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,lx=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,cx=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,hx=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,ux=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,dx=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,fx=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,px=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,mx=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,gx=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,xx=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,_x=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,vx=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,yx=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Mx=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,bx=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,Sx=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Tx=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Ex=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,wx=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Ax=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Rx=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Cx=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,Px=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Ix=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Lx=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Dx=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Nx=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Ux=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Fx=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Bx=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Ox=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,zx=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,kx=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Vx=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Hx=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Gx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Wx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Xx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,qx=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,Yx=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,$x=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Jx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Zx=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Kx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,jx=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Qx=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,t_=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,e_=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,i_=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,n_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,s_=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,r_=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,a_=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,o_=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,l_=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,c_=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,h_=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,u_=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,d_=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,f_=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,p_=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,m_=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,g_=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,x_=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,__=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,v_=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,y_=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,M_=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,b_=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,S_=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,T_=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,E_=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,w_=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,jt={alphahash_fragment:Y0,alphahash_pars_fragment:$0,alphamap_fragment:J0,alphamap_pars_fragment:Z0,alphatest_fragment:K0,alphatest_pars_fragment:j0,aomap_fragment:Q0,aomap_pars_fragment:tg,batching_pars_vertex:eg,batching_vertex:ig,begin_vertex:ng,beginnormal_vertex:sg,bsdfs:rg,iridescence_fragment:ag,bumpmap_pars_fragment:og,clipping_planes_fragment:lg,clipping_planes_pars_fragment:cg,clipping_planes_pars_vertex:hg,clipping_planes_vertex:ug,color_fragment:dg,color_pars_fragment:fg,color_pars_vertex:pg,color_vertex:mg,common:gg,cube_uv_reflection_fragment:xg,defaultnormal_vertex:_g,displacementmap_pars_vertex:vg,displacementmap_vertex:yg,emissivemap_fragment:Mg,emissivemap_pars_fragment:bg,colorspace_fragment:Sg,colorspace_pars_fragment:Tg,envmap_fragment:Eg,envmap_common_pars_fragment:wg,envmap_pars_fragment:Ag,envmap_pars_vertex:Rg,envmap_physical_pars_fragment:zg,envmap_vertex:Cg,fog_vertex:Pg,fog_pars_vertex:Ig,fog_fragment:Lg,fog_pars_fragment:Dg,gradientmap_pars_fragment:Ng,lightmap_pars_fragment:Ug,lights_lambert_fragment:Fg,lights_lambert_pars_fragment:Bg,lights_pars_begin:Og,lights_toon_fragment:kg,lights_toon_pars_fragment:Vg,lights_phong_fragment:Hg,lights_phong_pars_fragment:Gg,lights_physical_fragment:Wg,lights_physical_pars_fragment:Xg,lights_fragment_begin:qg,lights_fragment_maps:Yg,lights_fragment_end:$g,lightprobes_pars_fragment:Jg,logdepthbuf_fragment:Zg,logdepthbuf_pars_fragment:Kg,logdepthbuf_pars_vertex:jg,logdepthbuf_vertex:Qg,map_fragment:tx,map_pars_fragment:ex,map_particle_fragment:ix,map_particle_pars_fragment:nx,metalnessmap_fragment:sx,metalnessmap_pars_fragment:rx,morphinstance_vertex:ax,morphcolor_vertex:ox,morphnormal_vertex:lx,morphtarget_pars_vertex:cx,morphtarget_vertex:hx,normal_fragment_begin:ux,normal_fragment_maps:dx,normal_pars_fragment:fx,normal_pars_vertex:px,normal_vertex:mx,normalmap_pars_fragment:gx,clearcoat_normal_fragment_begin:xx,clearcoat_normal_fragment_maps:_x,clearcoat_pars_fragment:vx,iridescence_pars_fragment:yx,opaque_fragment:Mx,packing:bx,premultiplied_alpha_fragment:Sx,project_vertex:Tx,dithering_fragment:Ex,dithering_pars_fragment:wx,roughnessmap_fragment:Ax,roughnessmap_pars_fragment:Rx,shadowmap_pars_fragment:Cx,shadowmap_pars_vertex:Px,shadowmap_vertex:Ix,shadowmask_pars_fragment:Lx,skinbase_vertex:Dx,skinning_pars_vertex:Nx,skinning_vertex:Ux,skinnormal_vertex:Fx,specularmap_fragment:Bx,specularmap_pars_fragment:Ox,tonemapping_fragment:zx,tonemapping_pars_fragment:kx,transmission_fragment:Vx,transmission_pars_fragment:Hx,uv_pars_fragment:Gx,uv_pars_vertex:Wx,uv_vertex:Xx,worldpos_vertex:qx,background_vert:Yx,background_frag:$x,backgroundCube_vert:Jx,backgroundCube_frag:Zx,cube_vert:Kx,cube_frag:jx,depth_vert:Qx,depth_frag:t_,distance_vert:e_,distance_frag:i_,equirect_vert:n_,equirect_frag:s_,linedashed_vert:r_,linedashed_frag:a_,meshbasic_vert:o_,meshbasic_frag:l_,meshlambert_vert:c_,meshlambert_frag:h_,meshmatcap_vert:u_,meshmatcap_frag:d_,meshnormal_vert:f_,meshnormal_frag:p_,meshphong_vert:m_,meshphong_frag:g_,meshphysical_vert:x_,meshphysical_frag:__,meshtoon_vert:v_,meshtoon_frag:y_,points_vert:M_,points_frag:b_,shadow_vert:S_,shadow_frag:T_,sprite_vert:E_,sprite_frag:w_},Mt={common:{diffuse:{value:new ct(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new $t},alphaMap:{value:null},alphaMapTransform:{value:new $t},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new $t}},envmap:{envMap:{value:null},envMapRotation:{value:new $t},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new $t}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new $t}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new $t},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new $t},normalScale:{value:new nt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new $t},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new $t}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new $t}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new $t}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ct(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new w},probesMax:{value:new w},probesResolution:{value:new w}},points:{diffuse:{value:new ct(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new $t},alphaTest:{value:0},uvTransform:{value:new $t}},sprite:{diffuse:{value:new ct(16777215)},opacity:{value:1},center:{value:new nt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new $t},alphaMap:{value:null},alphaMapTransform:{value:new $t},alphaTest:{value:0}}},sn={basic:{uniforms:ni([Mt.common,Mt.specularmap,Mt.envmap,Mt.aomap,Mt.lightmap,Mt.fog]),vertexShader:jt.meshbasic_vert,fragmentShader:jt.meshbasic_frag},lambert:{uniforms:ni([Mt.common,Mt.specularmap,Mt.envmap,Mt.aomap,Mt.lightmap,Mt.emissivemap,Mt.bumpmap,Mt.normalmap,Mt.displacementmap,Mt.fog,Mt.lights,{emissive:{value:new ct(0)},envMapIntensity:{value:1}}]),vertexShader:jt.meshlambert_vert,fragmentShader:jt.meshlambert_frag},phong:{uniforms:ni([Mt.common,Mt.specularmap,Mt.envmap,Mt.aomap,Mt.lightmap,Mt.emissivemap,Mt.bumpmap,Mt.normalmap,Mt.displacementmap,Mt.fog,Mt.lights,{emissive:{value:new ct(0)},specular:{value:new ct(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:jt.meshphong_vert,fragmentShader:jt.meshphong_frag},standard:{uniforms:ni([Mt.common,Mt.envmap,Mt.aomap,Mt.lightmap,Mt.emissivemap,Mt.bumpmap,Mt.normalmap,Mt.displacementmap,Mt.roughnessmap,Mt.metalnessmap,Mt.fog,Mt.lights,{emissive:{value:new ct(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:jt.meshphysical_vert,fragmentShader:jt.meshphysical_frag},toon:{uniforms:ni([Mt.common,Mt.aomap,Mt.lightmap,Mt.emissivemap,Mt.bumpmap,Mt.normalmap,Mt.displacementmap,Mt.gradientmap,Mt.fog,Mt.lights,{emissive:{value:new ct(0)}}]),vertexShader:jt.meshtoon_vert,fragmentShader:jt.meshtoon_frag},matcap:{uniforms:ni([Mt.common,Mt.bumpmap,Mt.normalmap,Mt.displacementmap,Mt.fog,{matcap:{value:null}}]),vertexShader:jt.meshmatcap_vert,fragmentShader:jt.meshmatcap_frag},points:{uniforms:ni([Mt.points,Mt.fog]),vertexShader:jt.points_vert,fragmentShader:jt.points_frag},dashed:{uniforms:ni([Mt.common,Mt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:jt.linedashed_vert,fragmentShader:jt.linedashed_frag},depth:{uniforms:ni([Mt.common,Mt.displacementmap]),vertexShader:jt.depth_vert,fragmentShader:jt.depth_frag},normal:{uniforms:ni([Mt.common,Mt.bumpmap,Mt.normalmap,Mt.displacementmap,{opacity:{value:1}}]),vertexShader:jt.meshnormal_vert,fragmentShader:jt.meshnormal_frag},sprite:{uniforms:ni([Mt.sprite,Mt.fog]),vertexShader:jt.sprite_vert,fragmentShader:jt.sprite_frag},background:{uniforms:{uvTransform:{value:new $t},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:jt.background_vert,fragmentShader:jt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new $t}},vertexShader:jt.backgroundCube_vert,fragmentShader:jt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:jt.cube_vert,fragmentShader:jt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:jt.equirect_vert,fragmentShader:jt.equirect_frag},distance:{uniforms:ni([Mt.common,Mt.displacementmap,{referencePosition:{value:new w},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:jt.distance_vert,fragmentShader:jt.distance_frag},shadow:{uniforms:ni([Mt.lights,Mt.fog,{color:{value:new ct(0)},opacity:{value:1}}]),vertexShader:jt.shadow_vert,fragmentShader:jt.shadow_frag}};sn.physical={uniforms:ni([sn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new $t},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new $t},clearcoatNormalScale:{value:new nt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new $t},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new $t},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new $t},sheen:{value:0},sheenColor:{value:new ct(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new $t},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new $t},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new $t},transmissionSamplerSize:{value:new nt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new $t},attenuationDistance:{value:0},attenuationColor:{value:new ct(0)},specularColor:{value:new ct(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new $t},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new $t},anisotropyVector:{value:new nt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new $t}}]),vertexShader:jt.meshphysical_vert,fragmentShader:jt.meshphysical_frag};var hc={r:0,b:0,g:0},A_=new le,tp=new $t;tp.set(-1,0,0,0,1,0,0,0,1);function R_(s,t,e,i,n,r){let a=new ct(0),o=n===!0?0:1,l,c,h=null,f=0,u=null;function d(M){let S=M.isScene===!0?M.background:null;if(S&&S.isTexture){let v=M.backgroundBlurriness>0;S=t.get(S,v)}return S}function m(M){let S=!1,v=d(M);v===null?g(a,o):v&&v.isColor&&(g(v,1),S=!0);let T=s.xr.getEnvironmentBlendMode();T==="additive"?e.buffers.color.setClear(0,0,0,1,r):T==="alpha-blend"&&e.buffers.color.setClear(0,0,0,0,r),(s.autoClear||S)&&(e.buffers.depth.setTest(!0),e.buffers.depth.setMask(!0),e.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function x(M,S){let v=d(S);v&&(v.isCubeTexture||v.mapping===Ia)?(c===void 0&&(c=new St(new ve(1,1,1),new we({name:"BackgroundCubeMaterial",uniforms:cs(sn.backgroundCube.uniforms),vertexShader:sn.backgroundCube.vertexShader,fragmentShader:sn.backgroundCube.fragmentShader,side:Ye,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(T,E,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(c)),c.material.uniforms.envMap.value=v,c.material.uniforms.backgroundBlurriness.value=S.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(A_.makeRotationFromEuler(S.backgroundRotation)).transpose(),v.isCubeTexture&&v.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(tp),c.material.toneMapped=te.getTransfer(v.colorSpace)!==ce,(h!==v||f!==v.version||u!==s.toneMapping)&&(c.material.needsUpdate=!0,h=v,f=v.version,u=s.toneMapping),c.layers.enableAll(),M.unshift(c,c.geometry,c.material,0,0,null)):v&&v.isTexture&&(l===void 0&&(l=new St(new je(2,2),new we({name:"BackgroundMaterial",uniforms:cs(sn.background.uniforms),vertexShader:sn.background.vertexShader,fragmentShader:sn.background.fragmentShader,side:Bn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=v,l.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,l.material.toneMapped=te.getTransfer(v.colorSpace)!==ce,v.matrixAutoUpdate===!0&&v.updateMatrix(),l.material.uniforms.uvTransform.value.copy(v.matrix),(h!==v||f!==v.version||u!==s.toneMapping)&&(l.material.needsUpdate=!0,h=v,f=v.version,u=s.toneMapping),l.layers.enableAll(),M.unshift(l,l.geometry,l.material,0,0,null))}function g(M,S){M.getRGB(hc,Zh(s)),e.buffers.color.setClear(hc.r,hc.g,hc.b,S,r)}function p(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(M,S=1){a.set(M),o=S,g(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(M){o=M,g(a,o)},render:m,addToRenderList:x,dispose:p}}function C_(s,t){let e=s.getParameter(s.MAX_VERTEX_ATTRIBS),i={},n=u(null),r=n,a=!1;function o(D,B,k,P,L){let W=!1,z=f(D,P,k,B);r!==z&&(r=z,c(r.object)),W=d(D,P,k,L),W&&m(D,P,k,L),L!==null&&t.update(L,s.ELEMENT_ARRAY_BUFFER),(W||a)&&(a=!1,v(D,B,k,P),L!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,t.get(L).buffer))}function l(){return s.createVertexArray()}function c(D){return s.bindVertexArray(D)}function h(D){return s.deleteVertexArray(D)}function f(D,B,k,P){let L=P.wireframe===!0,W=i[B.id];W===void 0&&(W={},i[B.id]=W);let z=D.isInstancedMesh===!0?D.id:0,$=W[z];$===void 0&&($={},W[z]=$);let X=$[k.id];X===void 0&&(X={},$[k.id]=X);let Q=X[L];return Q===void 0&&(Q=u(l()),X[L]=Q),Q}function u(D){let B=[],k=[],P=[];for(let L=0;L<e;L++)B[L]=0,k[L]=0,P[L]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:B,enabledAttributes:k,attributeDivisors:P,object:D,attributes:{},index:null}}function d(D,B,k,P){let L=r.attributes,W=B.attributes,z=0,$=k.getAttributes();for(let X in $)if($[X].location>=0){let tt=L[X],ht=W[X];if(ht===void 0&&(X==="instanceMatrix"&&D.instanceMatrix&&(ht=D.instanceMatrix),X==="instanceColor"&&D.instanceColor&&(ht=D.instanceColor)),tt===void 0||tt.attribute!==ht||ht&&tt.data!==ht.data)return!0;z++}return r.attributesNum!==z||r.index!==P}function m(D,B,k,P){let L={},W=B.attributes,z=0,$=k.getAttributes();for(let X in $)if($[X].location>=0){let tt=W[X];tt===void 0&&(X==="instanceMatrix"&&D.instanceMatrix&&(tt=D.instanceMatrix),X==="instanceColor"&&D.instanceColor&&(tt=D.instanceColor));let ht={};ht.attribute=tt,tt&&tt.data&&(ht.data=tt.data),L[X]=ht,z++}r.attributes=L,r.attributesNum=z,r.index=P}function x(){let D=r.newAttributes;for(let B=0,k=D.length;B<k;B++)D[B]=0}function g(D){p(D,0)}function p(D,B){let k=r.newAttributes,P=r.enabledAttributes,L=r.attributeDivisors;k[D]=1,P[D]===0&&(s.enableVertexAttribArray(D),P[D]=1),L[D]!==B&&(s.vertexAttribDivisor(D,B),L[D]=B)}function M(){let D=r.newAttributes,B=r.enabledAttributes;for(let k=0,P=B.length;k<P;k++)B[k]!==D[k]&&(s.disableVertexAttribArray(k),B[k]=0)}function S(D,B,k,P,L,W,z){z===!0?s.vertexAttribIPointer(D,B,k,L,W):s.vertexAttribPointer(D,B,k,P,L,W)}function v(D,B,k,P){x();let L=P.attributes,W=k.getAttributes(),z=B.defaultAttributeValues;for(let $ in W){let X=W[$];if(X.location>=0){let Q=L[$];if(Q===void 0&&($==="instanceMatrix"&&D.instanceMatrix&&(Q=D.instanceMatrix),$==="instanceColor"&&D.instanceColor&&(Q=D.instanceColor)),Q!==void 0){let tt=Q.normalized,ht=Q.itemSize,at=t.get(Q);if(at===void 0)continue;let Ct=at.buffer,Bt=at.type,Xt=at.bytesPerElement,Y=Bt===s.INT||Bt===s.UNSIGNED_INT||Q.gpuType===Tl;if(Q.isInterleavedBufferAttribute){let K=Q.data,pt=K.stride,zt=Q.offset;if(K.isInstancedInterleavedBuffer){for(let Et=0;Et<X.locationSize;Et++)p(X.location+Et,K.meshPerAttribute);D.isInstancedMesh!==!0&&P._maxInstanceCount===void 0&&(P._maxInstanceCount=K.meshPerAttribute*K.count)}else for(let Et=0;Et<X.locationSize;Et++)g(X.location+Et);s.bindBuffer(s.ARRAY_BUFFER,Ct);for(let Et=0;Et<X.locationSize;Et++)S(X.location+Et,ht/X.locationSize,Bt,tt,pt*Xt,(zt+ht/X.locationSize*Et)*Xt,Y)}else{if(Q.isInstancedBufferAttribute){for(let K=0;K<X.locationSize;K++)p(X.location+K,Q.meshPerAttribute);D.isInstancedMesh!==!0&&P._maxInstanceCount===void 0&&(P._maxInstanceCount=Q.meshPerAttribute*Q.count)}else for(let K=0;K<X.locationSize;K++)g(X.location+K);s.bindBuffer(s.ARRAY_BUFFER,Ct);for(let K=0;K<X.locationSize;K++)S(X.location+K,ht/X.locationSize,Bt,tt,ht*Xt,ht/X.locationSize*K*Xt,Y)}}else if(z!==void 0){let tt=z[$];if(tt!==void 0)switch(tt.length){case 2:s.vertexAttrib2fv(X.location,tt);break;case 3:s.vertexAttrib3fv(X.location,tt);break;case 4:s.vertexAttrib4fv(X.location,tt);break;default:s.vertexAttrib1fv(X.location,tt)}}}}M()}function T(){A();for(let D in i){let B=i[D];for(let k in B){let P=B[k];for(let L in P){let W=P[L];for(let z in W)h(W[z].object),delete W[z];delete P[L]}}delete i[D]}}function E(D){if(i[D.id]===void 0)return;let B=i[D.id];for(let k in B){let P=B[k];for(let L in P){let W=P[L];for(let z in W)h(W[z].object),delete W[z];delete P[L]}}delete i[D.id]}function C(D){for(let B in i){let k=i[B];for(let P in k){let L=k[P];if(L[D.id]===void 0)continue;let W=L[D.id];for(let z in W)h(W[z].object),delete W[z];delete L[D.id]}}}function y(D){for(let B in i){let k=i[B],P=D.isInstancedMesh===!0?D.id:0,L=k[P];if(L!==void 0){for(let W in L){let z=L[W];for(let $ in z)h(z[$].object),delete z[$];delete L[W]}delete k[P],Object.keys(k).length===0&&delete i[B]}}}function A(){I(),a=!0,r!==n&&(r=n,c(r.object))}function I(){n.geometry=null,n.program=null,n.wireframe=!1}return{setup:o,reset:A,resetDefaultState:I,dispose:T,releaseStatesOfGeometry:E,releaseStatesOfObject:y,releaseStatesOfProgram:C,initAttributes:x,enableAttribute:g,disableUnusedAttributes:M}}function P_(s,t,e){let i;function n(l){i=l}function r(l,c){s.drawArrays(i,l,c),e.update(c,i,1)}function a(l,c,h){h!==0&&(s.drawArraysInstanced(i,l,c,h),e.update(c,i,h))}function o(l,c,h){if(h===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,c,0,h);let u=0;for(let d=0;d<h;d++)u+=c[d];e.update(u,i,1)}this.setMode=n,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function I_(s,t,e,i){let n;function r(){if(n!==void 0)return n;if(t.has("EXT_texture_filter_anisotropic")===!0){let C=t.get("EXT_texture_filter_anisotropic");n=s.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function a(C){return!(C!==Pi&&i.convert(C)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(C){let y=C===ke&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(C!==gi&&C!==Ci&&!y&&i.convert(C)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE))}function l(C){if(C==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp",h=l(c);h!==c&&(Gt("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);let f=e.logarithmicDepthBuffer===!0,u=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control");e.reversedDepthBuffer===!0&&u===!1&&Gt("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");let d=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),m=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=s.getParameter(s.MAX_TEXTURE_SIZE),g=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),p=s.getParameter(s.MAX_VERTEX_ATTRIBS),M=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),S=s.getParameter(s.MAX_VARYING_VECTORS),v=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),T=s.getParameter(s.MAX_SAMPLES),E=s.getParameter(s.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:f,reversedDepthBuffer:u,maxTextures:d,maxVertexTextures:m,maxTextureSize:x,maxCubemapSize:g,maxAttributes:p,maxVertexUniforms:M,maxVaryings:S,maxFragmentUniforms:v,maxSamples:T,samples:E}}function L_(s){let t=this,e=null,i=0,n=!1,r=!1,a=new Oi,o=new $t,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,u){let d=f.length!==0||u||i!==0||n;return n=u,i=f.length,d},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(f,u){e=h(f,u,0)},this.setState=function(f,u,d){let m=f.clippingPlanes,x=f.clipIntersection,g=f.clipShadows,p=s.get(f);if(!n||m===null||m.length===0||r&&!g)r?h(null):c();else{let M=r?0:i,S=M*4,v=p.clippingState||null;l.value=v,v=h(m,u,S,d);for(let T=0;T!==S;++T)v[T]=e[T];p.clippingState=v,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=M}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function h(f,u,d,m){let x=f!==null?f.length:0,g=null;if(x!==0){if(g=l.value,m!==!0||g===null){let p=d+x*4,M=u.matrixWorldInverse;o.getNormalMatrix(M),(g===null||g.length<p)&&(g=new Float32Array(p));for(let S=0,v=d;S!==x;++S,v+=4)a.copy(f[S]).applyMatrix4(M,o),a.normal.toArray(g,v),g[v+3]=a.constant}l.value=g,l.needsUpdate=!0}return t.numPlanes=x,t.numIntersection=0,g}}var nr=4,D_=6,N_=20,U_=256,za=new Fn,Lf=new ct,ru=null,au=0,ou=0,lu=!1,F_=new w,hs=new w,rr=class{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(t,e=0,i=.1,n=100,r={}){let{size:a=256,position:o=F_}=r;ru=this._renderer.getRenderTarget(),au=this._renderer.getActiveCubeFace(),ou=this._renderer.getActiveMipmapLevel(),lu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(t,i,n,l,o),e>0&&this._blur(l,0,0,e),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Uf(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Nf(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodMeshes.length;t++)this._lodMeshes[t].geometry.dispose()}_cleanup(t){this._renderer.setRenderTarget(ru,au,ou),this._renderer.xr.enabled=lu,t.scissorTest=!1,ir(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===zn||t.mapping===ls?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),ru=this._renderer.getRenderTarget(),au=this._renderer.getActiveCubeFace(),ou=this._renderer.getActiveMipmapLevel(),lu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let i=e||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,i={magFilter:Ke,minFilter:Ke,generateMipmaps:!1,type:ke,format:Pi,colorSpace:Hr,depthBuffer:!1},n=Df(t,e,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Df(t,e,i);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=B_(r)),this._blurMaterial=z_(r,t,e),this._ggxMaterial=O_(r,t,e)}return n}_compileMaterial(t){let e=new St(new xe,t);this._renderer.compile(e,za)}_sceneToCubeUV(t,e,i,n,r){let l=new Ze(90,1,e,i),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],f=this._renderer,u=f.autoClear,d=f.toneMapping;f.getClearColor(Lf),f.toneMapping=Hi,f.autoClear=!1,f.state.buffers.depth.getReversed()&&(f.setRenderTarget(n),f.clearDepth(),f.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new St(new ve,new fe({name:"PMREM.Background",side:Ye,depthWrite:!1,depthTest:!1})));let x=this._backgroundBox,g=x.material,p=!1,M=t.background;M?M.isColor&&(g.color.copy(M),t.background=null,p=!0):(g.color.copy(Lf),p=!0);for(let S=0;S<6;S++){let v=S%3;v===0?(l.up.set(0,c[S],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[S],r.y,r.z)):v===1?(l.up.set(0,0,c[S]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[S],r.z)):(l.up.set(0,c[S],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[S]));let T=this._cubeSize;ir(n,v*T,S>2?T:0,T,T),f.setRenderTarget(n),p&&f.render(x,l),f.render(t,l)}f.toneMapping=d,f.autoClear=u,t.background=M}_textureToCubeUV(t,e){let i=this._renderer,n=t.mapping===zn||t.mapping===ls;n?(this._cubemapMaterial===null&&(this._cubemapMaterial=Uf()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Nf());let r=n?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;let o=r.uniforms;o.envMap.value=t;let l=this._cubeSize;ir(e,0,0,3*l,2*l),i.setRenderTarget(e),i.render(a,za)}_applyPMREM(t){let e=this._renderer,i=e.autoClear;e.autoClear=!1;let n=this._lodMeshes.length;for(let r=1;r<n;r++)this._applyGGXFilter(t,r-1,r);e.autoClear=i}_applyGGXFilter(t,e,i){let n=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[i];o.material=a;let l=a.uniforms,c=i/(this._lodMeshes.length-1),h=e/(this._lodMeshes.length-1),f=Math.sqrt(c*c-h*h),u=c*1.25,d=f*u,{_lodMax:m}=this,x=this._sizeLods[i],g=3*x*(i>m-nr?i-m+nr:0),p=4*(this._cubeSize-x);l.envMap.value=t.texture,l.roughness.value=d,l.mipInt.value=m-e,ir(r,g,p,3*x,2*x),n.setRenderTarget(r),n.render(o,za),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=m-i,ir(t,g,p,3*x,2*x),n.setRenderTarget(t),n.render(o,za)}_blur(t,e,i,n){let r=this._pingPongRenderTarget,a=Math.min(n,Math.PI)/Math.SQRT2;this._blurPass(t,r,e,i,a),this._blurPass(r,t,i,i,a)}_blurPass(t,e,i,n,r){let a=this._renderer,o=this._blurMaterial,l=this._lodMeshes[n];l.material=o;let c=o.uniforms;c.envMap.value=t.texture,c.sigma.value=r,c.mipInt.value=this._lodMax-i;let h=this._sizeLods[n],f=3*h*(n>this._lodMax-nr?n-this._lodMax+nr:0),u=4*(this._cubeSize-h);ir(e,f,u,3*h,2*h),a.setRenderTarget(e),a.render(l,za)}};function B_(s){let t=[],e=[],i=s,n=s-nr+1+D_;for(let r=0;r<n;r++){let a=Math.pow(2,i);t.push(a);let o=1/(a-2),l=-o,c=1+o,h=[l,l,c,l,c,c,l,l,c,c,l,c],f=6,u=6,d=3,m=new Float32Array(d*u*f),x=new Float32Array(d*u*f);for(let p=0;p<f;p++){let M=p%3*2/3-1,S=p>2?0:-1,v=[M,S,0,M+2/3,S,0,M+2/3,S+1,0,M,S,0,M+2/3,S+1,0,M,S+1,0];m.set(v,d*u*p);for(let T=0;T<u;T++){let E=h[T*2]*2-1,C=h[T*2+1]*2-1;p===0?hs.set(1,C,E):p===1?hs.set(-E,1,-C):p===2?hs.set(-E,C,1):p===3?hs.set(-1,C,-E):p===4?hs.set(-E,-1,C):hs.set(E,C,-1),hs.toArray(x,(p*u+T)*d)}}let g=new xe;g.setAttribute("position",new Fe(m,d)),g.setAttribute("outputDirection",new Fe(x,d)),e.push(new St(g,null)),i>nr&&i--}return{lodMeshes:e,sizeLods:t}}function Df(s,t,e){let i=new Le(s,t,e);return i.texture.mapping=Ia,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function ir(s,t,e,i,n){s.viewport.set(t,e,i,n),s.scissor.set(t,e,i,n)}function O_(s,t,e){return new we({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:U_,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:pc(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:Ri,depthTest:!1,depthWrite:!1})}function z_(s,t,e){return new we({name:"SphericalGaussianBlur",defines:{SAMPLES:N_,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:pc(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:Ri,depthTest:!1,depthWrite:!1})}function Nf(){return new we({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:pc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Ri,depthTest:!1,depthWrite:!1})}function Uf(){return new we({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:pc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Ri,depthTest:!1,depthWrite:!1})}function pc(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}var dc=class extends Le{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;let i={width:t,height:t,depth:1},n=[i,i,i,i,i,i];this.texture=new na(n),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;let i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},n=new ve(5,5,5),r=new we({name:"CubemapFromEquirect",uniforms:cs(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Ye,blending:Ri});r.uniforms.tEquirect.value=e;let a=new St(n,r),o=e.minFilter;return e.minFilter===kn&&(e.minFilter=Ke),new _l(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e=!0,i=!0,n=!0){let r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,i,n);t.setRenderTarget(r)}};function k_(s){let t=new WeakMap,e=new WeakMap,i=null;function n(u,d=!1){return u==null?null:d?a(u):r(u)}function r(u){if(u&&u.isTexture){let d=u.mapping;if(d===Ml||d===bl)if(t.has(u)){let m=t.get(u).texture;return o(m,u.mapping)}else{let m=u.image;if(m&&m.height>0){let x=new dc(m.height);return x.fromEquirectangularTexture(s,u),t.set(u,x),u.addEventListener("dispose",c),o(x.texture,u.mapping)}else return null}}return u}function a(u){if(u&&u.isTexture){let d=u.mapping,m=d===Ml||d===bl,x=d===zn||d===ls;if(m||x){let g=e.get(u),p=g!==void 0?g.texture.pmremVersion:0;if(u.isRenderTargetTexture&&u.pmremVersion!==p)return i===null&&(i=new rr(s)),g=m?i.fromEquirectangular(u,g):i.fromCubemap(u,g),g.texture.pmremVersion=u.pmremVersion,e.set(u,g),g.texture;if(g!==void 0)return g.texture;{let M=u.image;return m&&M&&M.height>0||x&&M&&l(M)?(i===null&&(i=new rr(s)),g=m?i.fromEquirectangular(u):i.fromCubemap(u),g.texture.pmremVersion=u.pmremVersion,e.set(u,g),u.addEventListener("dispose",h),g.texture):null}}}return u}function o(u,d){return d===Ml?u.mapping=zn:d===bl&&(u.mapping=ls),u}function l(u){let d=0,m=6;for(let x=0;x<m;x++)u[x]!==void 0&&d++;return d===m}function c(u){let d=u.target;d.removeEventListener("dispose",c);let m=t.get(d);m!==void 0&&(t.delete(d),m.dispose())}function h(u){let d=u.target;d.removeEventListener("dispose",h);let m=e.get(d);m!==void 0&&(e.delete(d),m.dispose())}function f(){t=new WeakMap,e=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:n,dispose:f}}function V_(s){let t={};function e(i){if(t[i]!==void 0)return t[i];let n=s.getExtension(i);return t[i]=n,n}return{has:function(i){return e(i)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(i){let n=e(i);return n===null&&ts("WebGLRenderer: "+i+" extension not supported."),n}}}function H_(s,t,e,i){let n={},r=new WeakMap;function a(f){let u=f.target;u.index!==null&&t.remove(u.index);for(let m in u.attributes)t.remove(u.attributes[m]);u.removeEventListener("dispose",a),delete n[u.id];let d=r.get(u);d&&(t.remove(d),r.delete(u)),i.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,e.memory.geometries--}function o(f,u){return n[u.id]===!0||(u.addEventListener("dispose",a),n[u.id]=!0,e.memory.geometries++),u}function l(f){let u=f.attributes;for(let d in u)t.update(u[d],s.ARRAY_BUFFER)}function c(f){let u=[],d=f.index,m=f.attributes.position,x=0;if(m===void 0)return;if(d!==null){let M=d.array;x=d.version;for(let S=0,v=M.length;S<v;S+=3){let T=M[S+0],E=M[S+1],C=M[S+2];u.push(T,E,E,C,C,T)}}else{let M=m.array;x=m.version;for(let S=0,v=M.length/3-1;S<v;S+=3){let T=S+0,E=S+1,C=S+2;u.push(T,E,E,C,C,T)}}let g=new(m.count>=65535?Zr:Jr)(u,1);g.version=x;let p=r.get(f);p&&t.remove(p),r.set(f,g)}function h(f){let u=r.get(f);if(u){let d=f.index;d!==null&&u.version<d.version&&c(f)}else c(f);return r.get(f)}return{get:o,update:l,getWireframeAttribute:h}}function G_(s,t,e){let i;function n(f){i=f}let r,a;function o(f){r=f.type,a=f.bytesPerElement}function l(f,u){s.drawElements(i,u,r,f*a),e.update(u,i,1)}function c(f,u,d){d!==0&&(s.drawElementsInstanced(i,u,r,f*a,d),e.update(u,i,d))}function h(f,u,d){if(d===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,u,0,r,f,0,d);let x=0;for(let g=0;g<d;g++)x+=u[g];e.update(x,i,1)}this.setMode=n,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function W_(s){let t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,a,o){switch(e.calls++,a){case s.TRIANGLES:e.triangles+=o*(r/3);break;case s.LINES:e.lines+=o*(r/2);break;case s.LINE_STRIP:e.lines+=o*(r-1);break;case s.LINE_LOOP:e.lines+=o*r;break;case s.POINTS:e.points+=o*r;break;default:Wt("WebGLInfo: Unknown draw mode:",a);break}}function n(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:n,update:i}}function X_(s,t,e){let i=new WeakMap,n=new Re;function r(a,o,l){let c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,f=h!==void 0?h.length:0,u=i.get(o);if(u===void 0||u.count!==f){let A=function(){C.dispose(),i.delete(o),o.removeEventListener("dispose",A)};u!==void 0&&u.texture.dispose();let d=o.morphAttributes.position!==void 0,m=o.morphAttributes.normal!==void 0,x=o.morphAttributes.color!==void 0,g=o.morphAttributes.position||[],p=o.morphAttributes.normal||[],M=o.morphAttributes.color||[],S=0;d===!0&&(S=1),m===!0&&(S=2),x===!0&&(S=3);let v=o.attributes.position.count*S,T=1;v>t.maxTextureSize&&(T=Math.ceil(v/t.maxTextureSize),v=t.maxTextureSize);let E=new Float32Array(v*T*4*f),C=new qr(E,v,T,f);C.type=Ci,C.needsUpdate=!0;let y=S*4;for(let I=0;I<f;I++){let D=g[I],B=p[I],k=M[I],P=v*T*4*I;for(let L=0;L<D.count;L++){let W=L*y;d===!0&&(n.fromBufferAttribute(D,L),E[P+W+0]=n.x,E[P+W+1]=n.y,E[P+W+2]=n.z,E[P+W+3]=0),m===!0&&(n.fromBufferAttribute(B,L),E[P+W+4]=n.x,E[P+W+5]=n.y,E[P+W+6]=n.z,E[P+W+7]=0),x===!0&&(n.fromBufferAttribute(k,L),E[P+W+8]=n.x,E[P+W+9]=n.y,E[P+W+10]=n.z,E[P+W+11]=k.itemSize===4?n.w:1)}}u={count:f,texture:C,size:new nt(v,T)},i.set(o,u),o.addEventListener("dispose",A)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(s,"morphTexture",a.morphTexture,e);else{let d=0;for(let x=0;x<c.length;x++)d+=c[x];let m=o.morphTargetsRelative?1:1-d;l.getUniforms().setValue(s,"morphTargetBaseInfluence",m),l.getUniforms().setValue(s,"morphTargetInfluences",c)}l.getUniforms().setValue(s,"morphTargetsTexture",u.texture,e),l.getUniforms().setValue(s,"morphTargetsTextureSize",u.size)}return{update:r}}function q_(s,t,e,i,n){let r=new WeakMap;function a(c){let h=n.render.frame,f=c.geometry,u=t.get(c,f);if(r.get(u)!==h&&(t.update(u),r.set(u,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==h&&(e.update(c.instanceMatrix,s.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,s.ARRAY_BUFFER),r.set(c,h))),c.isSkinnedMesh){let d=c.skeleton;r.get(d)!==h&&(d.update(),r.set(d,h))}return u}function o(){r=new WeakMap}function l(c){let h=c.target;h.removeEventListener("dispose",l),i.releaseStatesOfObject(h),e.remove(h.instanceMatrix),h.instanceColor!==null&&e.remove(h.instanceColor)}return{update:a,dispose:o}}var Y_={[Ea]:"LINEAR_TONE_MAPPING",[wa]:"REINHARD_TONE_MAPPING",[Aa]:"CINEON_TONE_MAPPING",[os]:"ACES_FILMIC_TONE_MAPPING",[Ca]:"AGX_TONE_MAPPING",[Pa]:"NEUTRAL_TONE_MAPPING",[Ra]:"CUSTOM_TONE_MAPPING"};function $_(s,t,e,i,n,r){let a=new Le(t,e,{type:s,depthBuffer:n,stencilBuffer:r,samples:i?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),o=null,l=null,c=new xe;c.setAttribute("position",new Yt([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new Yt([0,2,0,0,2,0],2));let h=new Ks({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),f=new St(c,h),u=new Fn(-1,1,1,-1,0,1),d=null,m=null,x=!1,g,p=null,M=[],S=!1;this.setSize=function(v,T){a.setSize(v,T),o!==null&&o.setSize(v,T),l!==null&&l.setSize(v,T);for(let E=0;E<M.length;E++){let C=M[E];C.setSize&&C.setSize(v,T)}},this.setEffects=function(v){M=v,S=M.length>0&&M[0].isRenderPass===!0;let T=a.width,E=a.height;M.length>0&&o===null&&(o=new Le(T,E,{type:ke,depthBuffer:!1,stencilBuffer:!1}),l=new Le(T,E,{type:ke,depthBuffer:!1,stencilBuffer:!1}));for(let C=0;C<M.length;C++){let y=M[C];y.setSize&&y.setSize(T,E)}},this.begin=function(v,T){if(x||v.toneMapping===Hi&&M.length===0)return!1;if(p=T,T!==null){let E=T.width,C=T.height;(a.width!==E||a.height!==C)&&this.setSize(E,C)}return S===!1&&v.setRenderTarget(a),g=v.toneMapping,v.toneMapping=Hi,!0},this.hasRenderPass=function(){return S},this.end=function(v,T){v.toneMapping=g,x=!0;let E=a,C=o;for(let y=0;y<M.length;y++){let A=M[y];A.enabled!==!1&&(A.render(v,C,E,T),A.needsSwap!==!1&&(E=C,C=C===o?l:o))}if(d!==v.outputColorSpace||m!==v.toneMapping){d=v.outputColorSpace,m=v.toneMapping,h.defines={},te.getTransfer(d)===ce&&(h.defines.SRGB_TRANSFER="");let y=Y_[m];y&&(h.defines[y]=""),h.needsUpdate=!0}h.uniforms.tDiffuse.value=E.texture,v.setRenderTarget(p),v.render(f,u),p=null,x=!1},this.isCompositing=function(){return x},this.dispose=function(){a.dispose(),o!==null&&o.dispose(),l!==null&&l.dispose(),c.dispose(),h.dispose()}}var ep=new hi,uu=new In(1,1),ip=new qr,np=new Jo,sp=new na,Ff=[],Bf=[],Of=new Float32Array(16),zf=new Float32Array(9),kf=new Float32Array(4);function ar(s,t,e){let i=s[0];if(i<=0||i>0)return s;let n=t*e,r=Ff[n];if(r===void 0&&(r=new Float32Array(n),Ff[n]=r),t!==0){i.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=e,s[a].toArray(r,o)}return r}function Ve(s,t){if(s.length!==t.length)return!1;for(let e=0,i=s.length;e<i;e++)if(s[e]!==t[e])return!1;return!0}function He(s,t){for(let e=0,i=t.length;e<i;e++)s[e]=t[e]}function mc(s,t){let e=Bf[t];e===void 0&&(e=new Int32Array(t),Bf[t]=e);for(let i=0;i!==t;++i)e[i]=s.allocateTextureUnit();return e}function J_(s,t){let e=this.cache;e[0]!==t&&(s.uniform1f(this.addr,t),e[0]=t)}function Z_(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ve(e,t))return;s.uniform2fv(this.addr,t),He(e,t)}}function K_(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(s.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Ve(e,t))return;s.uniform3fv(this.addr,t),He(e,t)}}function j_(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ve(e,t))return;s.uniform4fv(this.addr,t),He(e,t)}}function Q_(s,t){let e=this.cache,i=t.elements;if(i===void 0){if(Ve(e,t))return;s.uniformMatrix2fv(this.addr,!1,t),He(e,t)}else{if(Ve(e,i))return;kf.set(i),s.uniformMatrix2fv(this.addr,!1,kf),He(e,i)}}function tv(s,t){let e=this.cache,i=t.elements;if(i===void 0){if(Ve(e,t))return;s.uniformMatrix3fv(this.addr,!1,t),He(e,t)}else{if(Ve(e,i))return;zf.set(i),s.uniformMatrix3fv(this.addr,!1,zf),He(e,i)}}function ev(s,t){let e=this.cache,i=t.elements;if(i===void 0){if(Ve(e,t))return;s.uniformMatrix4fv(this.addr,!1,t),He(e,t)}else{if(Ve(e,i))return;Of.set(i),s.uniformMatrix4fv(this.addr,!1,Of),He(e,i)}}function iv(s,t){let e=this.cache;e[0]!==t&&(s.uniform1i(this.addr,t),e[0]=t)}function nv(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ve(e,t))return;s.uniform2iv(this.addr,t),He(e,t)}}function sv(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ve(e,t))return;s.uniform3iv(this.addr,t),He(e,t)}}function rv(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ve(e,t))return;s.uniform4iv(this.addr,t),He(e,t)}}function av(s,t){let e=this.cache;e[0]!==t&&(s.uniform1ui(this.addr,t),e[0]=t)}function ov(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ve(e,t))return;s.uniform2uiv(this.addr,t),He(e,t)}}function lv(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ve(e,t))return;s.uniform3uiv(this.addr,t),He(e,t)}}function cv(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ve(e,t))return;s.uniform4uiv(this.addr,t),He(e,t)}}function hv(s,t,e){let i=this.cache,n=e.allocateTextureUnit();i[0]!==n&&(s.uniform1i(this.addr,n),i[0]=n);let r;this.type===s.SAMPLER_2D_SHADOW?(uu.compareFunction=e.isReversedDepthBuffer()?cc:lc,r=uu):r=ep,e.setTexture2D(t||r,n)}function uv(s,t,e){let i=this.cache,n=e.allocateTextureUnit();i[0]!==n&&(s.uniform1i(this.addr,n),i[0]=n),e.setTexture3D(t||np,n)}function dv(s,t,e){let i=this.cache,n=e.allocateTextureUnit();i[0]!==n&&(s.uniform1i(this.addr,n),i[0]=n),e.setTextureCube(t||sp,n)}function fv(s,t,e){let i=this.cache,n=e.allocateTextureUnit();i[0]!==n&&(s.uniform1i(this.addr,n),i[0]=n),e.setTexture2DArray(t||ip,n)}function pv(s){switch(s){case 5126:return J_;case 35664:return Z_;case 35665:return K_;case 35666:return j_;case 35674:return Q_;case 35675:return tv;case 35676:return ev;case 5124:case 35670:return iv;case 35667:case 35671:return nv;case 35668:case 35672:return sv;case 35669:case 35673:return rv;case 5125:return av;case 36294:return ov;case 36295:return lv;case 36296:return cv;case 35678:case 36198:case 36298:case 36306:case 35682:return hv;case 35679:case 36299:case 36307:return uv;case 35680:case 36300:case 36308:case 36293:return dv;case 36289:case 36303:case 36311:case 36292:return fv}}function mv(s,t){s.uniform1fv(this.addr,t)}function gv(s,t){let e=ar(t,this.size,2);s.uniform2fv(this.addr,e)}function xv(s,t){let e=ar(t,this.size,3);s.uniform3fv(this.addr,e)}function _v(s,t){let e=ar(t,this.size,4);s.uniform4fv(this.addr,e)}function vv(s,t){let e=ar(t,this.size,4);s.uniformMatrix2fv(this.addr,!1,e)}function yv(s,t){let e=ar(t,this.size,9);s.uniformMatrix3fv(this.addr,!1,e)}function Mv(s,t){let e=ar(t,this.size,16);s.uniformMatrix4fv(this.addr,!1,e)}function bv(s,t){s.uniform1iv(this.addr,t)}function Sv(s,t){s.uniform2iv(this.addr,t)}function Tv(s,t){s.uniform3iv(this.addr,t)}function Ev(s,t){s.uniform4iv(this.addr,t)}function wv(s,t){s.uniform1uiv(this.addr,t)}function Av(s,t){s.uniform2uiv(this.addr,t)}function Rv(s,t){s.uniform3uiv(this.addr,t)}function Cv(s,t){s.uniform4uiv(this.addr,t)}function Pv(s,t,e){let i=this.cache,n=t.length,r=mc(e,n);Ve(i,r)||(s.uniform1iv(this.addr,r),He(i,r));let a;this.type===s.SAMPLER_2D_SHADOW?a=uu:a=ep;for(let o=0;o!==n;++o)e.setTexture2D(t[o]||a,r[o])}function Iv(s,t,e){let i=this.cache,n=t.length,r=mc(e,n);Ve(i,r)||(s.uniform1iv(this.addr,r),He(i,r));for(let a=0;a!==n;++a)e.setTexture3D(t[a]||np,r[a])}function Lv(s,t,e){let i=this.cache,n=t.length,r=mc(e,n);Ve(i,r)||(s.uniform1iv(this.addr,r),He(i,r));for(let a=0;a!==n;++a)e.setTextureCube(t[a]||sp,r[a])}function Dv(s,t,e){let i=this.cache,n=t.length,r=mc(e,n);Ve(i,r)||(s.uniform1iv(this.addr,r),He(i,r));for(let a=0;a!==n;++a)e.setTexture2DArray(t[a]||ip,r[a])}function Nv(s){switch(s){case 5126:return mv;case 35664:return gv;case 35665:return xv;case 35666:return _v;case 35674:return vv;case 35675:return yv;case 35676:return Mv;case 5124:case 35670:return bv;case 35667:case 35671:return Sv;case 35668:case 35672:return Tv;case 35669:case 35673:return Ev;case 5125:return wv;case 36294:return Av;case 36295:return Rv;case 36296:return Cv;case 35678:case 36198:case 36298:case 36306:case 35682:return Pv;case 35679:case 36299:case 36307:return Iv;case 35680:case 36300:case 36308:case 36293:return Lv;case 36289:case 36303:case 36311:case 36292:return Dv}}var du=class{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=pv(e.type)}},fu=class{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Nv(e.type)}},pu=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,i){let n=this.seq;for(let r=0,a=n.length;r!==a;++r){let o=n[r];o.setValue(t,e[o.id],i)}}},cu=/(\w+)(\])?(\[|\.)?/g;function Vf(s,t){s.seq.push(t),s.map[t.id]=t}function Uv(s,t,e){let i=s.name,n=i.length;for(cu.lastIndex=0;;){let r=cu.exec(i),a=cu.lastIndex,o=r[1],l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===n){Vf(e,c===void 0?new du(o,s,t):new fu(o,s,t));break}else{let f=e.map[o];f===void 0&&(f=new pu(o),Vf(e,f)),e=f}}}var sr=class{constructor(t,e){this.seq=[],this.map={};let i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let a=0;a<i;++a){let o=t.getActiveUniform(e,a),l=t.getUniformLocation(e,o.name);Uv(o,l,this)}let n=[],r=[];for(let a of this.seq)a.type===t.SAMPLER_2D_SHADOW||a.type===t.SAMPLER_CUBE_SHADOW||a.type===t.SAMPLER_2D_ARRAY_SHADOW?n.push(a):r.push(a);n.length>0&&(this.seq=n.concat(r))}setValue(t,e,i,n){let r=this.map[e];r!==void 0&&r.setValue(t,i,n)}setOptional(t,e,i){let n=e[i];n!==void 0&&this.setValue(t,i,n)}static upload(t,e,i,n){for(let r=0,a=e.length;r!==a;++r){let o=e[r],l=i[o.id];l.needsUpdate!==!1&&o.setValue(t,l.value,n)}}static seqWithValue(t,e){let i=[];for(let n=0,r=t.length;n!==r;++n){let a=t[n];a.id in e&&i.push(a)}return i}};function Hf(s,t,e){let i=s.createShader(t);return s.shaderSource(i,e),s.compileShader(i),i}var Fv=37297,Bv=0;function Ov(s,t){let e=s.split(`
`),i=[],n=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let a=n;a<r;a++){let o=a+1;i.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return i.join(`
`)}var Gf=new $t;function zv(s){te._getMatrix(Gf,te.workingColorSpace,s);let t=`mat3( ${Gf.elements.map(e=>e.toFixed(4))} )`;switch(te.getTransfer(s)){case Gr:return[t,"LinearTransferOETF"];case ce:return[t,"sRGBTransferOETF"];default:return Gt("WebGLProgram: Unsupported color space: ",s),[t,"LinearTransferOETF"]}}function Wf(s,t,e){let i=s.getShaderParameter(t,s.COMPILE_STATUS),r=(s.getShaderInfoLog(t)||"").trim();if(i&&r==="")return"";let a=/ERROR: 0:(\d+)/.exec(r);if(a){let o=parseInt(a[1]);return e.toUpperCase()+`

`+r+`

`+Ov(s.getShaderSource(t),o)}else return r}function kv(s,t){let e=zv(t);return[`vec4 ${s}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}var Vv={[Ea]:"Linear",[wa]:"Reinhard",[Aa]:"Cineon",[os]:"ACESFilmic",[Ca]:"AgX",[Pa]:"Neutral",[Ra]:"Custom"};function Hv(s,t){let e=Vv[t];return e===void 0?(Gt("WebGLProgram: Unsupported toneMapping:",t),"vec3 "+s+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+s+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}var uc=new w;function Gv(){te.getLuminanceCoefficients(uc);let s=uc.x.toFixed(4),t=uc.y.toFixed(4),e=uc.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Wv(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Va).join(`
`)}function Xv(s){let t=[];for(let e in s){let i=s[e];i!==!1&&t.push("#define "+e+" "+i)}return t.join(`
`)}function qv(s,t){let e={},i=s.getProgramParameter(t,s.ACTIVE_ATTRIBUTES);for(let n=0;n<i;n++){let r=s.getActiveAttrib(t,n),a=r.name,o=1;r.type===s.FLOAT_MAT2&&(o=2),r.type===s.FLOAT_MAT3&&(o=3),r.type===s.FLOAT_MAT4&&(o=4),e[a]={type:r.type,location:s.getAttribLocation(t,a),locationSize:o}}return e}function Va(s){return s!==""}function Xf(s,t){let e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return s.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function qf(s,t){return s.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var Yv=/^[ \t]*#include +<([\w\d./]+)>/gm;function mu(s){return s.replace(Yv,Jv)}var $v=new Map;function Jv(s,t){let e=jt[t];if(e===void 0){let i=$v.get(t);if(i!==void 0)e=jt[i],Gt('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+t+">")}return mu(e)}var Zv=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Yf(s){return s.replace(Zv,Kv)}function Kv(s,t,e,i){let n="";for(let r=parseInt(t);r<parseInt(e);r++)n+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return n}function $f(s){let t=`precision ${s.precision} float;
	precision ${s.precision} int;
	precision ${s.precision} sampler2D;
	precision ${s.precision} samplerCube;
	precision ${s.precision} sampler3D;
	precision ${s.precision} sampler2DArray;
	precision ${s.precision} sampler2DShadow;
	precision ${s.precision} samplerCubeShadow;
	precision ${s.precision} sampler2DArrayShadow;
	precision ${s.precision} isampler2D;
	precision ${s.precision} isampler3D;
	precision ${s.precision} isamplerCube;
	precision ${s.precision} isampler2DArray;
	precision ${s.precision} usampler2D;
	precision ${s.precision} usampler3D;
	precision ${s.precision} usamplerCube;
	precision ${s.precision} usampler2DArray;
	`;return s.precision==="highp"?t+=`
#define HIGH_PRECISION`:s.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}var jv={[rs]:"SHADOWMAP_TYPE_PCF",[js]:"SHADOWMAP_TYPE_VSM"};function Qv(s){return jv[s.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var ty={[zn]:"ENVMAP_TYPE_CUBE",[ls]:"ENVMAP_TYPE_CUBE",[Ia]:"ENVMAP_TYPE_CUBE_UV"};function ey(s){return s.envMap===!1?"ENVMAP_TYPE_CUBE":ty[s.envMapMode]||"ENVMAP_TYPE_CUBE"}var iy={[ls]:"ENVMAP_MODE_REFRACTION"};function ny(s){return s.envMap===!1?"ENVMAP_MODE_REFLECTION":iy[s.envMapMode]||"ENVMAP_MODE_REFLECTION"}var sy={[Oh]:"ENVMAP_BLENDING_MULTIPLY",[lf]:"ENVMAP_BLENDING_MIX",[cf]:"ENVMAP_BLENDING_ADD"};function ry(s){return s.envMap===!1?"ENVMAP_BLENDING_NONE":sy[s.combine]||"ENVMAP_BLENDING_NONE"}function ay(s){let t=s.envMapCubeUVHeight;if(t===null)return null;let e=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:i,maxMip:e}}function oy(s,t,e,i){let n=s.getContext(),r=e.defines,a=e.vertexShader,o=e.fragmentShader,l=Qv(e),c=ey(e),h=ny(e),f=ry(e),u=ay(e),d=Wv(e),m=Xv(r),x=n.createProgram(),g,p,M=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(Va).join(`
`),g.length>0&&(g+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(Va).join(`
`),p.length>0&&(p+=`
`)):(g=[$f(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexNormals?"#define HAS_NORMAL":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Va).join(`
`),p=[$f(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+f:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.retroreflection?"#define USE_RETROREFLECTION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas||e.batchingColor?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Hi?"#define TONE_MAPPING":"",e.toneMapping!==Hi?jt.tonemapping_pars_fragment:"",e.toneMapping!==Hi?Hv("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",jt.colorspace_pars_fragment,kv("linearToOutputTexel",e.outputColorSpace),Gv(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Va).join(`
`)),a=mu(a),a=Xf(a,e),a=qf(a,e),o=mu(o),o=Xf(o,e),o=qf(o,e),a=Yf(a),o=Yf(o),e.isRawShaderMaterial!==!0&&(M=`#version 300 es
`,g=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,p=["#define varying in",e.glslVersion===Yh?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Yh?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);let S=M+g+a,v=M+p+o,T=Hf(n,n.VERTEX_SHADER,S),E=Hf(n,n.FRAGMENT_SHADER,v);n.attachShader(x,T),n.attachShader(x,E),e.index0AttributeName!==void 0?n.bindAttribLocation(x,0,e.index0AttributeName):e.hasPositionAttribute===!0&&n.bindAttribLocation(x,0,"position"),n.linkProgram(x);function C(D){if(s.debug.checkShaderErrors){let B=n.getProgramInfoLog(x)||"",k=n.getShaderInfoLog(T)||"",P=n.getShaderInfoLog(E)||"",L=B.trim(),W=k.trim(),z=P.trim(),$=!0,X=!0;if(n.getProgramParameter(x,n.LINK_STATUS)===!1)if($=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(n,x,T,E);else{let Q=Wf(n,T,"vertex"),tt=Wf(n,E,"fragment");Wt("WebGLProgram: Shader Error "+n.getError()+" - VALIDATE_STATUS "+n.getProgramParameter(x,n.VALIDATE_STATUS)+`

Material Name: `+D.name+`
Material Type: `+D.type+`

Program Info Log: `+L+`
`+Q+`
`+tt)}else L!==""?Gt("WebGLProgram: Program Info Log:",L):(W===""||z==="")&&(X=!1);X&&(D.diagnostics={runnable:$,programLog:L,vertexShader:{log:W,prefix:g},fragmentShader:{log:z,prefix:p}})}n.deleteShader(T),n.deleteShader(E),y=new sr(n,x),A=qv(n,x)}let y;this.getUniforms=function(){return y===void 0&&C(this),y};let A;this.getAttributes=function(){return A===void 0&&C(this),A};let I=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return I===!1&&(I=n.getProgramParameter(x,Fv)),I},this.destroy=function(){i.releaseStatesOfProgram(this),n.deleteProgram(x),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Bv++,this.cacheKey=t,this.usedTimes=1,this.program=x,this.vertexShader=T,this.fragmentShader=E,this}var ly=0,gu=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t,e,i){let n=this._getShaderCacheForMaterial(t);return n.has(e)===!1&&(n.add(e),e.usedTimes++),n.has(i)===!1&&(n.add(i),i.usedTimes++),this}remove(t){let e=this.materialCache.get(t);for(let i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderStage(t){return this._getShaderStage(t.vertexShader)}getFragmentShaderStage(t){return this._getShaderStage(t.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,i=e.get(t);return i===void 0&&(i=new Set,e.set(t,i)),i}_getShaderStage(t){let e=this.shaderCache,i=e.get(t);return i===void 0&&(i=new xu(t),e.set(t,i)),i}},xu=class{constructor(t){this.id=ly++,this.code=t,this.usedTimes=0}};function cy(s){return s===Hn||s===Ba||s===Oa}function hy(s,t,e,i,n,r){let a=new Yr,o=new gu,l=new Set,c=[],h=new Map,f=i.logarithmicDepthBuffer,u=i.precision,d={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function m(y){return l.add(y),y===0?"uv":`uv${y}`}function x(y,A,I,D,B,k){let P=D.fog,L=B.geometry,W=y.isMeshStandardMaterial||y.isMeshLambertMaterial||y.isMeshPhongMaterial?D.environment:null,z=y.isMeshStandardMaterial||y.isMeshLambertMaterial&&!y.envMap||y.isMeshPhongMaterial&&!y.envMap,$=t.get(y.envMap||W,z),X=$&&$.mapping===Ia?$.image.height:null,Q=d[y.type];y.precision!==null&&(u=i.getMaxPrecision(y.precision),u!==y.precision&&Gt("WebGLProgram.getParameters:",y.precision,"not supported, using",u,"instead."));let tt=L.morphAttributes.position||L.morphAttributes.normal||L.morphAttributes.color,ht=tt!==void 0?tt.length:0,at=0;L.morphAttributes.position!==void 0&&(at=1),L.morphAttributes.normal!==void 0&&(at=2),L.morphAttributes.color!==void 0&&(at=3);let Ct,Bt,Xt,Y;if(Q){let Me=sn[Q];Ct=Me.vertexShader,Bt=Me.fragmentShader}else{Ct=y.vertexShader,Bt=y.fragmentShader;let Me=o.getVertexShaderStage(y),ue=o.getFragmentShaderStage(y);o.update(y,Me,ue),Xt=Me.id,Y=ue.id}let K=s.getRenderTarget(),pt=s.state.buffers.depth.getReversed(),zt=B.isInstancedMesh===!0,Et=B.isBatchedMesh===!0,kt=!!y.map,re=!!y.matcap,j=!!$,rt=!!y.aoMap,ot=!!y.lightMap,lt=!!y.bumpMap&&y.wireframe===!1,dt=!!y.normalMap,Vt=!!y.displacementMap,Lt=!!y.emissiveMap,qt=!!y.metalnessMap,Jt=!!y.roughnessMap,N=y.anisotropy>0,he=y.clearcoat>0,ie=y.dispersion>0,R=y.retroreflectivity>0,_=y.iridescence>0,O=y.sheen>0,G=y.transmission>0,J=N&&!!y.anisotropyMap,ut=he&&!!y.clearcoatMap,mt=he&&!!y.clearcoatNormalMap,Z=he&&!!y.clearcoatRoughnessMap,it=_&&!!y.iridescenceMap,gt=_&&!!y.iridescenceThicknessMap,Ut=O&&!!y.sheenColorMap,yt=O&&!!y.sheenRoughnessMap,xt=!!y.specularMap,Ft=!!y.specularColorMap,Ht=!!y.specularIntensityMap,Zt=G&&!!y.transmissionMap,F=G&&!!y.thicknessMap,_t=!!y.gradientMap,et=!!y.alphaMap,vt=y.alphaTest>0,wt=!!y.alphaHash,st=!!y.extensions,Ot=Hi;y.toneMapped&&(K===null||K.isXRRenderTarget===!0)&&(Ot=s.toneMapping);let Dt={shaderID:Q,shaderType:y.type,shaderName:y.name,vertexShader:Ct,fragmentShader:Bt,defines:y.defines,customVertexShaderID:Xt,customFragmentShaderID:Y,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:u,batching:Et,batchingColor:Et&&B._colorsTexture!==null,instancing:zt,instancingColor:zt&&B.instanceColor!==null,instancingMorph:zt&&B.morphTexture!==null,outputColorSpace:K===null?s.outputColorSpace:K.isXRRenderTarget===!0?K.texture.colorSpace:te.workingColorSpace,alphaToCoverage:!!y.alphaToCoverage,map:kt,matcap:re,envMap:j,envMapMode:j&&$.mapping,envMapCubeUVHeight:X,aoMap:rt,lightMap:ot,bumpMap:lt,normalMap:dt,displacementMap:Vt,emissiveMap:Lt,normalMapObjectSpace:dt&&y.normalMapType===df,normalMapTangentSpace:dt&&y.normalMapType===oc,packedNormalMap:dt&&y.normalMapType===oc&&cy(y.normalMap.format),metalnessMap:qt,roughnessMap:Jt,anisotropy:N,anisotropyMap:J,clearcoat:he,clearcoatMap:ut,clearcoatNormalMap:mt,clearcoatRoughnessMap:Z,dispersion:ie,retroreflection:R,iridescence:_,iridescenceMap:it,iridescenceThicknessMap:gt,sheen:O,sheenColorMap:Ut,sheenRoughnessMap:yt,specularMap:xt,specularColorMap:Ft,specularIntensityMap:Ht,transmission:G,transmissionMap:Zt,thicknessMap:F,gradientMap:_t,opaque:y.transparent===!1&&y.blending===On&&y.alphaToCoverage===!1,alphaMap:et,alphaTest:vt,alphaHash:wt,combine:y.combine,mapUv:kt&&m(y.map.channel),aoMapUv:rt&&m(y.aoMap.channel),lightMapUv:ot&&m(y.lightMap.channel),bumpMapUv:lt&&m(y.bumpMap.channel),normalMapUv:dt&&m(y.normalMap.channel),displacementMapUv:Vt&&m(y.displacementMap.channel),emissiveMapUv:Lt&&m(y.emissiveMap.channel),metalnessMapUv:qt&&m(y.metalnessMap.channel),roughnessMapUv:Jt&&m(y.roughnessMap.channel),anisotropyMapUv:J&&m(y.anisotropyMap.channel),clearcoatMapUv:ut&&m(y.clearcoatMap.channel),clearcoatNormalMapUv:mt&&m(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Z&&m(y.clearcoatRoughnessMap.channel),iridescenceMapUv:it&&m(y.iridescenceMap.channel),iridescenceThicknessMapUv:gt&&m(y.iridescenceThicknessMap.channel),sheenColorMapUv:Ut&&m(y.sheenColorMap.channel),sheenRoughnessMapUv:yt&&m(y.sheenRoughnessMap.channel),specularMapUv:xt&&m(y.specularMap.channel),specularColorMapUv:Ft&&m(y.specularColorMap.channel),specularIntensityMapUv:Ht&&m(y.specularIntensityMap.channel),transmissionMapUv:Zt&&m(y.transmissionMap.channel),thicknessMapUv:F&&m(y.thicknessMap.channel),alphaMapUv:et&&m(y.alphaMap.channel),vertexTangents:!!L.attributes.tangent&&(dt||N),vertexNormals:!!L.attributes.normal,vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!L.attributes.color&&L.attributes.color.itemSize===4,pointsUvs:B.isPoints===!0&&!!L.attributes.uv&&(kt||et),fog:!!P,useFog:y.fog===!0,fogExp2:!!P&&P.isFogExp2,flatShading:y.wireframe===!1&&(y.flatShading===!0||L.attributes.normal===void 0&&dt===!1&&(y.isMeshLambertMaterial||y.isMeshPhongMaterial||y.isMeshStandardMaterial||y.isMeshPhysicalMaterial)),sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:f,reversedDepthBuffer:pt,skinning:B.isSkinnedMesh===!0,hasPositionAttribute:L.attributes.position!==void 0,morphTargets:L.morphAttributes.position!==void 0,morphNormals:L.morphAttributes.normal!==void 0,morphColors:L.morphAttributes.color!==void 0,morphTargetsCount:ht,morphTextureStride:at,numSunLights:A.sun.length,numDirLights:A.directional.length,numPointLights:A.point.length,numSpotLights:A.spot.length,numSpotLightMaps:A.spotLightMap.length,numRectAreaLights:A.rectArea.length,numHemiLights:A.hemi.length,numSunLightShadows:A.sunShadowMap.length,numDirLightShadows:A.directionalShadowMap.length,numPointLightShadows:A.pointShadowMap.length,numSpotLightShadows:A.spotShadowMap.length,numSpotLightShadowsWithMaps:A.numSpotLightShadowsWithMaps,numLightProbes:A.numLightProbes,numLightProbeGrids:k.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:y.dithering,shadowMapEnabled:s.shadowMap.enabled&&I.length>0,shadowMapType:s.shadowMap.type,toneMapping:Ot,decodeVideoTexture:kt&&y.map.isVideoTexture===!0&&te.getTransfer(y.map.colorSpace)===ce,decodeVideoTextureEmissive:Lt&&y.emissiveMap.isVideoTexture===!0&&te.getTransfer(y.emissiveMap.colorSpace)===ce,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===ze,flipSided:y.side===Ye,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionClipCullDistance:st&&y.extensions.clipCullDistance===!0&&e.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(st&&y.extensions.multiDraw===!0||Et)&&e.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:e.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()};return Dt.vertexUv1s=l.has(1),Dt.vertexUv2s=l.has(2),Dt.vertexUv3s=l.has(3),l.clear(),Dt}function g(y){let A=[];if(y.shaderID?A.push(y.shaderID):(A.push(y.customVertexShaderID),A.push(y.customFragmentShaderID)),y.defines!==void 0)for(let I in y.defines)A.push(I),A.push(y.defines[I]);return y.isRawShaderMaterial===!1&&(p(A,y),M(A,y),A.push(s.outputColorSpace)),A.push(y.customProgramCacheKey),A.join()}function p(y,A){y.push(A.precision),y.push(A.outputColorSpace),y.push(A.envMapMode),y.push(A.envMapCubeUVHeight),y.push(A.mapUv),y.push(A.alphaMapUv),y.push(A.lightMapUv),y.push(A.aoMapUv),y.push(A.bumpMapUv),y.push(A.normalMapUv),y.push(A.displacementMapUv),y.push(A.emissiveMapUv),y.push(A.metalnessMapUv),y.push(A.roughnessMapUv),y.push(A.anisotropyMapUv),y.push(A.clearcoatMapUv),y.push(A.clearcoatNormalMapUv),y.push(A.clearcoatRoughnessMapUv),y.push(A.iridescenceMapUv),y.push(A.iridescenceThicknessMapUv),y.push(A.sheenColorMapUv),y.push(A.sheenRoughnessMapUv),y.push(A.specularMapUv),y.push(A.specularColorMapUv),y.push(A.specularIntensityMapUv),y.push(A.transmissionMapUv),y.push(A.thicknessMapUv),y.push(A.combine),y.push(A.fogExp2),y.push(A.sizeAttenuation),y.push(A.morphTargetsCount),y.push(A.morphAttributeCount),y.push(A.numSunLights),y.push(A.numDirLights),y.push(A.numPointLights),y.push(A.numSpotLights),y.push(A.numSpotLightMaps),y.push(A.numHemiLights),y.push(A.numRectAreaLights),y.push(A.numSunLightShadows),y.push(A.numDirLightShadows),y.push(A.numPointLightShadows),y.push(A.numSpotLightShadows),y.push(A.numSpotLightShadowsWithMaps),y.push(A.numLightProbes),y.push(A.shadowMapType),y.push(A.toneMapping),y.push(A.numClippingPlanes),y.push(A.numClipIntersection),y.push(A.depthPacking)}function M(y,A){a.disableAll(),A.instancing&&a.enable(0),A.instancingColor&&a.enable(1),A.instancingMorph&&a.enable(2),A.matcap&&a.enable(3),A.envMap&&a.enable(4),A.normalMapObjectSpace&&a.enable(5),A.normalMapTangentSpace&&a.enable(6),A.clearcoat&&a.enable(7),A.iridescence&&a.enable(8),A.alphaTest&&a.enable(9),A.vertexColors&&a.enable(10),A.vertexAlphas&&a.enable(11),A.vertexUv1s&&a.enable(12),A.vertexUv2s&&a.enable(13),A.vertexUv3s&&a.enable(14),A.vertexTangents&&a.enable(15),A.anisotropy&&a.enable(16),A.alphaHash&&a.enable(17),A.batching&&a.enable(18),A.dispersion&&a.enable(19),A.retroreflection&&a.enable(24),A.batchingColor&&a.enable(20),A.gradientMap&&a.enable(21),A.packedNormalMap&&a.enable(22),A.vertexNormals&&a.enable(23),y.push(a.mask),a.disableAll(),A.fog&&a.enable(0),A.useFog&&a.enable(1),A.flatShading&&a.enable(2),A.logarithmicDepthBuffer&&a.enable(3),A.reversedDepthBuffer&&a.enable(4),A.skinning&&a.enable(5),A.morphTargets&&a.enable(6),A.morphNormals&&a.enable(7),A.morphColors&&a.enable(8),A.premultipliedAlpha&&a.enable(9),A.shadowMapEnabled&&a.enable(10),A.doubleSided&&a.enable(11),A.flipSided&&a.enable(12),A.useDepthPacking&&a.enable(13),A.dithering&&a.enable(14),A.transmission&&a.enable(15),A.sheen&&a.enable(16),A.opaque&&a.enable(17),A.pointsUvs&&a.enable(18),A.decodeVideoTexture&&a.enable(19),A.decodeVideoTextureEmissive&&a.enable(20),A.alphaToCoverage&&a.enable(21),A.numLightProbeGrids>0&&a.enable(22),A.hasPositionAttribute&&a.enable(23),y.push(a.mask)}function S(y){let A=d[y.type],I;if(A){let D=sn[A];I=vn.clone(D.uniforms)}else I=y.uniforms;return I}function v(y,A){let I=h.get(A);return I!==void 0?++I.usedTimes:(I=new oy(s,A,y,n),c.push(I),h.set(A,I)),I}function T(y){if(--y.usedTimes===0){let A=c.indexOf(y);c[A]=c[c.length-1],c.pop(),h.delete(y.cacheKey),y.destroy()}}function E(y){o.remove(y)}function C(){o.dispose()}return{getParameters:x,getProgramCacheKey:g,getUniforms:S,acquireProgram:v,releaseProgram:T,releaseShaderCache:E,programs:c,dispose:C}}function uy(){let s=new WeakMap;function t(a){return s.has(a)}function e(a){let o=s.get(a);return o===void 0&&(o={},s.set(a,o)),o}function i(a){s.delete(a)}function n(a,o,l){s.get(a)[o]=l}function r(){s=new WeakMap}return{has:t,get:e,remove:i,update:n,dispose:r}}function dy(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.material.id!==t.material.id?s.material.id-t.material.id:s.materialVariant!==t.materialVariant?s.materialVariant-t.materialVariant:s.z!==t.z?s.z-t.z:s.id-t.id}function Jf(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.z!==t.z?t.z-s.z:s.id-t.id}function Zf(){let s=[],t=0,e=[],i=[],n=[];function r(){t=0,e.length=0,i.length=0,n.length=0}function a(u){let d=0;return u.isInstancedMesh&&(d+=2),u.isSkinnedMesh&&(d+=1),d}function o(u,d,m,x,g,p){let M=s[t];return M===void 0?(M={id:u.id,object:u,geometry:d,material:m,materialVariant:a(u),groupOrder:x,renderOrder:u.renderOrder,z:g,group:p},s[t]=M):(M.id=u.id,M.object=u,M.geometry=d,M.material=m,M.materialVariant=a(u),M.groupOrder=x,M.renderOrder=u.renderOrder,M.z=g,M.group=p),t++,M}function l(u,d,m,x,g,p,M){M.reversedDepth===!0&&(g=-g);let S=o(u,d,m,x,g,p);m.transmission>0?i.push(S):m.transparent===!0?n.push(S):e.push(S)}function c(u,d,m,x,g,p){let M=o(u,d,m,x,g,p);m.transmission>0?i.unshift(M):m.transparent===!0?n.unshift(M):e.unshift(M)}function h(u,d){e.length>1&&e.sort(u||dy),i.length>1&&i.sort(d||Jf),n.length>1&&n.sort(d||Jf)}function f(){for(let u=t,d=s.length;u<d;u++){let m=s[u];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:e,transmissive:i,transparent:n,init:r,push:l,unshift:c,finish:f,sort:h}}function fy(){let s=new WeakMap;function t(i,n){let r=s.get(i),a;return r===void 0?(a=new Zf,s.set(i,[a])):n>=r.length?(a=new Zf,r.push(a)):a=r[n],a}function e(){s=new WeakMap}return{get:t,dispose:e}}function py(){let s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={direction:new w,color:new ct};break;case"SpotLight":e={position:new w,direction:new w,color:new ct,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new w,color:new ct,distance:0,decay:0};break;case"HemisphereLight":e={direction:new w,skyColor:new ct,groundColor:new ct};break;case"RectAreaLight":e={color:new ct,position:new w,halfWidth:new w,halfHeight:new w};break}return s[t.id]=e,e}}}function my(){let s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new nt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new nt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new nt,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[t.id]=e,e}}}var gy=0;function xy(s,t){return(t.castShadow?2:0)-(s.castShadow?2:0)+(t.map?1:0)-(s.map?1:0)}function _y(s){let t=new py,e=my(),i={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new w);let n=new w,r=new le,a=new le;function o(c){let h=0,f=0,u=0;for(let B=0;B<9;B++)i.probe[B].set(0,0,0);let d=0,m=0,x=0,g=0,p=0,M=0,S=0,v=0,T=0,E=0,C=0,y=0,A=0,I=0;c.sort(xy);for(let B=0,k=c.length;B<k;B++){let P=c[B],L=P.color,W=P.intensity,z=P.distance,$=null;if(P.shadow&&P.shadow.map&&(P.shadow.map.texture.format===Hn?$=P.shadow.map.texture:$=P.shadow.map.depthTexture||P.shadow.map.texture),P.isAmbientLight)h+=L.r*W,f+=L.g*W,u+=L.b*W;else if(P.isLightProbe){for(let X=0;X<9;X++)i.probe[X].addScaledVector(P.sh.coefficients[X],W);I++}else if(P.isSunLight){let X=t.get(P);if(X.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){let Q=P.shadow,tt=e.get(P);tt.shadowIntensity=Q.intensity,tt.shadowBias=Q.bias,tt.shadowNormalBias=Q.normalBias,tt.shadowRadius=Q.radius,tt.shadowMapSize.copy(Q.mapSize).multiply(Q.getFrameExtents()),i.sunShadow[m]=tt,i.sunShadowMap[m]=$;let ht=Q.getViewportCount();for(let at=0;at<ht;at++)i.sunShadowMatrix[x+at]=Q.getMatrix(at),i.sunShadowCascade[x+at]=Q._cascadeData[at];x+=ht,m++}i.sun[d]=X,d++}else if(P.isDirectionalLight){let X=t.get(P);if(X.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){let Q=P.shadow,tt=e.get(P);tt.shadowIntensity=Q.intensity,tt.shadowBias=Q.bias,tt.shadowNormalBias=Q.normalBias,tt.shadowRadius=Q.radius,tt.shadowMapSize=Q.mapSize,i.directionalShadow[g]=tt,i.directionalShadowMap[g]=$,i.directionalShadowMatrix[g]=P.shadow.matrix,T++}i.directional[g]=X,g++}else if(P.isSpotLight){let X=t.get(P);X.position.setFromMatrixPosition(P.matrixWorld),X.color.copy(L).multiplyScalar(W),X.distance=z,X.coneCos=Math.cos(P.angle),X.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),X.decay=P.decay,i.spot[M]=X;let Q=P.shadow;if(P.map&&(i.spotLightMap[y]=P.map,y++,Q.updateMatrices(P),P.castShadow&&A++),i.spotLightMatrix[M]=Q.matrix,P.castShadow){let tt=e.get(P);tt.shadowIntensity=Q.intensity,tt.shadowBias=Q.bias,tt.shadowNormalBias=Q.normalBias,tt.shadowRadius=Q.radius,tt.shadowMapSize=Q.mapSize,i.spotShadow[M]=tt,i.spotShadowMap[M]=$,C++}M++}else if(P.isRectAreaLight){let X=t.get(P);X.color.copy(L).multiplyScalar(W),X.halfWidth.set(P.width*.5,0,0),X.halfHeight.set(0,P.height*.5,0),i.rectArea[S]=X,S++}else if(P.isPointLight){let X=t.get(P);if(X.color.copy(P.color).multiplyScalar(P.intensity),X.distance=P.distance,X.decay=P.decay,P.castShadow){let Q=P.shadow,tt=e.get(P);tt.shadowIntensity=Q.intensity,tt.shadowBias=Q.bias,tt.shadowNormalBias=Q.normalBias,tt.shadowRadius=Q.radius,tt.shadowMapSize=Q.mapSize,tt.shadowCameraNear=Q.camera.near,tt.shadowCameraFar=Q.camera.far,i.pointShadow[p]=tt,i.pointShadowMap[p]=$,i.pointShadowMatrix[p]=P.shadow.matrix,E++}i.point[p]=X,p++}else if(P.isHemisphereLight){let X=t.get(P);X.skyColor.copy(P.color).multiplyScalar(W),X.groundColor.copy(P.groundColor).multiplyScalar(W),i.hemi[v]=X,v++}}S>0&&(s.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=Mt.LTC_FLOAT_1,i.rectAreaLTC2=Mt.LTC_FLOAT_2):(i.rectAreaLTC1=Mt.LTC_HALF_1,i.rectAreaLTC2=Mt.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=f,i.ambient[2]=u;let D=i.hash;(D.sunLength!==d||D.directionalLength!==g||D.pointLength!==p||D.spotLength!==M||D.rectAreaLength!==S||D.hemiLength!==v||D.numSunShadows!==m||D.numDirectionalShadows!==T||D.numPointShadows!==E||D.numSpotShadows!==C||D.numSpotMaps!==y||D.numLightProbes!==I)&&(i.sun.length=d,i.directional.length=g,i.spot.length=M,i.rectArea.length=S,i.point.length=p,i.hemi.length=v,i.sunShadow.length=m,i.sunShadowMap.length=m,i.sunShadowMatrix.length=x,i.sunShadowCascade.length=x,i.directionalShadow.length=T,i.directionalShadowMap.length=T,i.directionalShadowMatrix.length=T,i.pointShadow.length=E,i.pointShadowMap.length=E,i.pointShadowMatrix.length=E,i.spotShadow.length=C,i.spotShadowMap.length=C,i.spotLightMatrix.length=C+y-A,i.spotLightMap.length=y,i.numSpotLightShadowsWithMaps=A,i.numLightProbes=I,D.sunLength=d,D.directionalLength=g,D.pointLength=p,D.spotLength=M,D.rectAreaLength=S,D.hemiLength=v,D.numSunShadows=m,D.numDirectionalShadows=T,D.numPointShadows=E,D.numSpotShadows=C,D.numSpotMaps=y,D.numLightProbes=I,i.version=gy++)}function l(c,h){let f=0,u=0,d=0,m=0,x=0,g=0,p=h.matrixWorldInverse;for(let M=0,S=c.length;M<S;M++){let v=c[M];if(v.isSunLight){let T=i.sun[f];T.direction.setFromMatrixPosition(v.matrixWorld),T.direction.transformDirection(p),f++}else if(v.isDirectionalLight){let T=i.directional[u];T.direction.setFromMatrixPosition(v.matrixWorld),n.setFromMatrixPosition(v.target.matrixWorld),T.direction.sub(n),T.direction.transformDirection(p),u++}else if(v.isSpotLight){let T=i.spot[m];T.position.setFromMatrixPosition(v.matrixWorld),T.position.applyMatrix4(p),T.direction.setFromMatrixPosition(v.matrixWorld),n.setFromMatrixPosition(v.target.matrixWorld),T.direction.sub(n),T.direction.transformDirection(p),m++}else if(v.isRectAreaLight){let T=i.rectArea[x];T.position.setFromMatrixPosition(v.matrixWorld),T.position.applyMatrix4(p),a.identity(),r.copy(v.matrixWorld),r.premultiply(p),a.extractRotation(r),T.halfWidth.set(v.width*.5,0,0),T.halfHeight.set(0,v.height*.5,0),T.halfWidth.applyMatrix4(a),T.halfHeight.applyMatrix4(a),x++}else if(v.isPointLight){let T=i.point[d];T.position.setFromMatrixPosition(v.matrixWorld),T.position.applyMatrix4(p),d++}else if(v.isHemisphereLight){let T=i.hemi[g];T.direction.setFromMatrixPosition(v.matrixWorld),T.direction.transformDirection(p),g++}}}return{setup:o,setupView:l,state:i}}function Kf(s){let t=new _y(s),e=[],i=[],n=[];function r(u){f.camera=u,e.length=0,i.length=0,n.length=0}function a(u){e.push(u)}function o(u){i.push(u)}function l(u){n.push(u)}function c(){t.setup(e)}function h(u){t.setupView(e,u)}let f={lightsArray:e,shadowsArray:i,lightProbeGridArray:n,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:f,setupLights:c,setupLightsView:h,pushLight:a,pushShadow:o,pushLightProbeGrid:l}}function vy(s){let t=new WeakMap;function e(n,r=0){let a=t.get(n),o;return a===void 0?(o=new Kf(s),t.set(n,[o])):r>=a.length?(o=new Kf(s),a.push(o)):o=a[r],o}function i(){t=new WeakMap}return{get:e,dispose:i}}var yy=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,My=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,by=[new w(1,0,0),new w(-1,0,0),new w(0,1,0),new w(0,-1,0),new w(0,0,1),new w(0,0,-1)],Sy=[new w(0,-1,0),new w(0,-1,0),new w(0,0,1),new w(0,0,-1),new w(0,-1,0),new w(0,-1,0)],jf=new le,ka=new w,hu=new w;function Ty(s,t,e){let i=new qs,n=new nt,r=new nt,a=new Re,o=new rl,l=new al,c={},h=e.maxTextureSize,f={[Bn]:Ye,[Ye]:Bn,[ze]:ze},u=new we({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new nt},radius:{value:4}},vertexShader:yy,fragmentShader:My}),d=u.clone();d.defines.HORIZONTAL_PASS=1;let m=new xe;m.setAttribute("position",new Fe(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let x=new St(m,u),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=rs;let p=this.type;this.render=function(E,C,y){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||E.length===0)return;this.type===Hd&&(Gt("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=rs);let A=s.getRenderTarget(),I=s.getActiveCubeFace(),D=s.getActiveMipmapLevel(),B=s.state;B.setBlending(Ri),B.buffers.depth.getReversed()===!0?B.buffers.color.setClear(0,0,0,0):B.buffers.color.setClear(1,1,1,1),B.buffers.depth.setTest(!0),B.setScissorTest(!1);let k=p!==this.type;k&&C.traverse(function(P){P.material&&(Array.isArray(P.material)?P.material.forEach(L=>L.needsUpdate=!0):P.material.needsUpdate=!0)});for(let P=0,L=E.length;P<L;P++){let W=E[P],z=W.shadow;if(z===void 0){Gt("WebGLShadowMap:",W,"has no shadow.");continue}if(z.autoUpdate===!1&&z.needsUpdate===!1)continue;n.copy(z.mapSize);let $=z.getFrameExtents();n.multiply($),r.copy(z.mapSize),(n.x>h||n.y>h)&&(n.x>h&&(r.x=Math.floor(h/$.x),n.x=r.x*$.x,z.mapSize.x=r.x),n.y>h&&(r.y=Math.floor(h/$.y),n.y=r.y*$.y,z.mapSize.y=r.y));let X=s.state.buffers.depth.getReversed();if(z.camera._reversedDepth=X,z.map===null||k===!0){if(z.map!==null&&(z.map.depthTexture!==null&&(z.map.depthTexture.dispose(),z.map.depthTexture=null),z.map.dispose()),this.type===js){if(W.isPointLight){Gt("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}z.map=new Le(n.x,n.y,{format:Hn,type:ke,minFilter:Ke,magFilter:Ke,generateMipmaps:!1}),z.map.texture.name=W.name+".shadowMap",z.map.depthTexture=new In(n.x,n.y,Ci),z.map.depthTexture.name=W.name+".shadowMapDepth",z.map.depthTexture.format=ji,z.map.depthTexture.compareFunction=null,z.map.depthTexture.minFilter=Xe,z.map.depthTexture.magFilter=Xe}else W.isPointLight?(z.map=new dc(n.x),z.map.depthTexture=new Ko(n.x,Gi)):(z.map=new Le(n.x,n.y),z.map.depthTexture=new In(n.x,n.y,Gi)),z.map.depthTexture.name=W.name+".shadowMap",z.map.depthTexture.format=ji,this.type===rs?(z.map.depthTexture.compareFunction=X?cc:lc,z.map.depthTexture.minFilter=Ke,z.map.depthTexture.magFilter=Ke):(z.map.depthTexture.compareFunction=null,z.map.depthTexture.minFilter=Xe,z.map.depthTexture.magFilter=Xe);z.camera.updateProjectionMatrix()}z.map.isWebGLCubeRenderTarget!==!0&&(z.map.width!==n.x||z.map.height!==n.y)&&z.map.setSize(n.x,n.y);let Q=z.map.isWebGLCubeRenderTarget?6:z.getViewportCount();W.isPointLight!==!0&&z.updateMatrices(W,y);for(let tt=0;tt<Q;tt++){let ht=z.getCamera(tt);if(W.isPointLight){let at=z.camera,Ct=z.matrix,Bt=W.distance||at.far;Bt!==at.far&&(at.far=Bt,at.updateProjectionMatrix()),ka.setFromMatrixPosition(W.matrixWorld),at.position.copy(ka),hu.copy(at.position),hu.add(by[tt]),at.up.copy(Sy[tt]),at.lookAt(hu),at.updateMatrixWorld(),Ct.makeTranslation(-ka.x,-ka.y,-ka.z),jf.multiplyMatrices(at.projectionMatrix,at.matrixWorldInverse),z._frustum.setFromProjectionMatrix(jf,at.coordinateSystem,at.reversedDepth)}if(z.map.isWebGLCubeRenderTarget)s.setRenderTarget(z.map,tt),s.clear();else{tt===0&&(s.setRenderTarget(z.map),s.clear());let at=z.getViewport(tt);a.set(r.x*at.x,r.y*at.y,r.x*at.z,r.y*at.w),B.viewport(a)}i=z.getFrustum(tt),v(C,y,ht,W,this.type)}z.isPointLightShadow!==!0&&this.type===js&&M(z,y),z.needsUpdate=!1}p=this.type,g.needsUpdate=!1,s.setRenderTarget(A,I,D)};function M(E,C){let y=t.update(x);u.defines.VSM_SAMPLES!==E.blurSamples&&(u.defines.VSM_SAMPLES=E.blurSamples,d.defines.VSM_SAMPLES=E.blurSamples,u.needsUpdate=!0,d.needsUpdate=!0),E.mapPass===null?E.mapPass=new Le(n.x,n.y,{format:Hn,type:ke}):(E.mapPass.width!==E.map.width||E.mapPass.height!==E.map.height)&&E.mapPass.setSize(E.map.width,E.map.height),u.uniforms.shadow_pass.value=E.map.depthTexture,u.uniforms.resolution.value.set(E.map.width,E.map.height),u.uniforms.radius.value=E.radius,s.setRenderTarget(E.mapPass),s.clear(),s.renderBufferDirect(C,null,y,u,x,null),d.uniforms.shadow_pass.value=E.mapPass.texture,d.uniforms.resolution.value.set(E.map.width,E.map.height),d.uniforms.radius.value=E.radius,s.setRenderTarget(E.map),s.clear(),s.renderBufferDirect(C,null,y,d,x,null)}function S(E,C,y,A){let I=null,D=y.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(D!==void 0)I=D;else if(I=y.isPointLight===!0?l:o,s.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0||C.alphaToCoverage===!0){let B=I.uuid,k=C.uuid,P=c[B];P===void 0&&(P={},c[B]=P);let L=P[k];L===void 0&&(L=I.clone(),P[k]=L,C.addEventListener("dispose",T)),I=L}if(I.visible=C.visible,I.wireframe=C.wireframe,A===js?I.side=C.shadowSide!==null?C.shadowSide:C.side:I.side=C.shadowSide!==null?C.shadowSide:f[C.side],I.alphaMap=C.alphaMap,I.alphaTest=C.alphaToCoverage===!0?.5:C.alphaTest,I.map=C.map,I.clipShadows=C.clipShadows,I.clippingPlanes=C.clippingPlanes,I.clipIntersection=C.clipIntersection,I.displacementMap=C.displacementMap,I.displacementScale=C.displacementScale,I.displacementBias=C.displacementBias,I.wireframeLinewidth=C.wireframeLinewidth,I.linewidth=C.linewidth,y.isPointLight===!0&&I.isMeshDistanceMaterial===!0){let B=s.properties.get(I);B.light=y}return I}function v(E,C,y,A,I){if(E.visible===!1)return;if(E.layers.test(C.layers)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&I===js)&&(!E.frustumCulled||E.intersectsFrustum(i))){E.modelViewMatrix.multiplyMatrices(y.matrixWorldInverse,E.matrixWorld);let k=t.update(E),P=E.material;if(Array.isArray(P)){let L=k.groups;for(let W=0,z=L.length;W<z;W++){let $=L[W],X=P[$.materialIndex];if(X&&X.visible){let Q=S(E,X,A,I);E.onBeforeShadow(s,E,C,y,k,Q,$),s.renderBufferDirect(y,null,k,Q,E,$),E.onAfterShadow(s,E,C,y,k,Q,$)}}}else if(P.visible){let L=S(E,P,A,I);E.onBeforeShadow(s,E,C,y,k,L,null),s.renderBufferDirect(y,null,k,L,E,null),E.onAfterShadow(s,E,C,y,k,L,null)}}let B=E.children;for(let k=0,P=B.length;k<P;k++)v(B[k],C,y,A,I)}function T(E){E.target.removeEventListener("dispose",T);for(let y in c){let A=c[y],I=E.target.uuid;I in A&&(A[I].dispose(),delete A[I])}}}function Ey(s,t){function e(){let F=!1,_t=new Re,et=null,vt=new Re(0,0,0,0);return{setMask:function(wt){et!==wt&&!F&&(s.colorMask(wt,wt,wt,wt),et=wt)},setLocked:function(wt){F=wt},setClear:function(wt,st,Ot,Dt,Me){Me===!0&&(wt*=Dt,st*=Dt,Ot*=Dt),_t.set(wt,st,Ot,Dt),vt.equals(_t)===!1&&(s.clearColor(wt,st,Ot,Dt),vt.copy(_t))},reset:function(){F=!1,et=null,vt.set(-1,0,0,0)}}}function i(){let F=!1,_t=!1,et=null,vt=null,wt=null;return{setReversed:function(st){if(_t!==st){let Ot=t.get("EXT_clip_control");st?Ot.clipControlEXT(Ot.LOWER_LEFT_EXT,Ot.ZERO_TO_ONE_EXT):Ot.clipControlEXT(Ot.LOWER_LEFT_EXT,Ot.NEGATIVE_ONE_TO_ONE_EXT),_t=st;let Dt=wt;wt=null,this.setClear(Dt)}},getReversed:function(){return _t},setTest:function(st){st?K(s.DEPTH_TEST):pt(s.DEPTH_TEST)},setMask:function(st){et!==st&&!F&&(s.depthMask(st),et=st)},setFunc:function(st){if(_t&&(st=Sf[st]),vt!==st){switch(st){case Oo:s.depthFunc(s.NEVER);break;case zo:s.depthFunc(s.ALWAYS);break;case ko:s.depthFunc(s.LESS);break;case zs:s.depthFunc(s.LEQUAL);break;case Vo:s.depthFunc(s.EQUAL);break;case Ho:s.depthFunc(s.GEQUAL);break;case Go:s.depthFunc(s.GREATER);break;case Wo:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}vt=st}},setLocked:function(st){F=st},setClear:function(st){wt!==st&&(wt=st,_t&&(st=1-st),s.clearDepth(st))},reset:function(){F=!1,et=null,vt=null,wt=null,_t=!1}}}function n(){let F=!1,_t=null,et=null,vt=null,wt=null,st=null,Ot=null,Dt=null,Me=null;return{setTest:function(ue){F||(ue?K(s.STENCIL_TEST):pt(s.STENCIL_TEST))},setMask:function(ue){_t!==ue&&!F&&(s.stencilMask(ue),_t=ue)},setFunc:function(ue,Ni,qi){(et!==ue||vt!==Ni||wt!==qi)&&(s.stencilFunc(ue,Ni,qi),et=ue,vt=Ni,wt=qi)},setOp:function(ue,Ni,qi){(st!==ue||Ot!==Ni||Dt!==qi)&&(s.stencilOp(ue,Ni,qi),st=ue,Ot=Ni,Dt=qi)},setLocked:function(ue){F=ue},setClear:function(ue){Me!==ue&&(s.clearStencil(ue),Me=ue)},reset:function(){F=!1,_t=null,et=null,vt=null,wt=null,st=null,Ot=null,Dt=null,Me=null}}}let r=new e,a=new i,o=new n,l=new WeakMap,c=new WeakMap,h={},f={},u={},d=new WeakMap,m=[],x=null,g=!1,p=null,M=null,S=null,v=null,T=null,E=null,C=null,y=new ct(0,0,0),A=0,I=!1,D=null,B=null,k=null,P=null,L=null,W=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS),z=!1,$=0,X=s.getParameter(s.VERSION);X.indexOf("WebGL")!==-1?($=parseFloat(/^WebGL (\d)/.exec(X)[1]),z=$>=1):X.indexOf("OpenGL ES")!==-1&&($=parseFloat(/^OpenGL ES (\d)/.exec(X)[1]),z=$>=2);let Q=null,tt={},ht=s.getParameter(s.SCISSOR_BOX),at=s.getParameter(s.VIEWPORT),Ct=new Re().fromArray(ht),Bt=new Re().fromArray(at);function Xt(F,_t,et,vt){let wt=new Uint8Array(4),st=s.createTexture();s.bindTexture(F,st),s.texParameteri(F,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(F,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let Ot=0;Ot<et;Ot++)F===s.TEXTURE_3D||F===s.TEXTURE_2D_ARRAY?s.texImage3D(_t,0,s.RGBA,1,1,vt,0,s.RGBA,s.UNSIGNED_BYTE,wt):s.texImage2D(_t+Ot,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,wt);return st}let Y={};Y[s.TEXTURE_2D]=Xt(s.TEXTURE_2D,s.TEXTURE_2D,1),Y[s.TEXTURE_CUBE_MAP]=Xt(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),Y[s.TEXTURE_2D_ARRAY]=Xt(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),Y[s.TEXTURE_3D]=Xt(s.TEXTURE_3D,s.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),K(s.DEPTH_TEST),a.setFunc(zs),lt(!1),dt(Dh),K(s.CULL_FACE),rt(Ri);function K(F){h[F]!==!0&&(s.enable(F),h[F]=!0)}function pt(F){h[F]!==!1&&(s.disable(F),h[F]=!1)}function zt(F,_t){return u[F]!==_t?(s.bindFramebuffer(F,_t),u[F]=_t,F===s.DRAW_FRAMEBUFFER&&(u[s.FRAMEBUFFER]=_t),F===s.FRAMEBUFFER&&(u[s.DRAW_FRAMEBUFFER]=_t),!0):!1}function Et(F,_t){let et=m,vt=!1;if(F){et=d.get(_t),et===void 0&&(et=[],d.set(_t,et));let wt=F.textures;if(et.length!==wt.length||et[0]!==s.COLOR_ATTACHMENT0){for(let st=0,Ot=wt.length;st<Ot;st++)et[st]=s.COLOR_ATTACHMENT0+st;et.length=wt.length,vt=!0}}else et[0]!==s.BACK&&(et[0]=s.BACK,vt=!0);vt&&s.drawBuffers(et)}function kt(F){return x!==F?(s.useProgram(F),x=F,!0):!1}let re={[as]:s.FUNC_ADD,[Wd]:s.FUNC_SUBTRACT,[Xd]:s.FUNC_REVERSE_SUBTRACT};re[qd]=s.MIN,re[Yd]=s.MAX;let j={[$d]:s.ZERO,[Jd]:s.ONE,[Zd]:s.SRC_COLOR,[Fh]:s.SRC_ALPHA,[nf]:s.SRC_ALPHA_SATURATE,[tf]:s.DST_COLOR,[jd]:s.DST_ALPHA,[Kd]:s.ONE_MINUS_SRC_COLOR,[Bh]:s.ONE_MINUS_SRC_ALPHA,[ef]:s.ONE_MINUS_DST_COLOR,[Qd]:s.ONE_MINUS_DST_ALPHA,[sf]:s.CONSTANT_COLOR,[rf]:s.ONE_MINUS_CONSTANT_COLOR,[af]:s.CONSTANT_ALPHA,[of]:s.ONE_MINUS_CONSTANT_ALPHA};function rt(F,_t,et,vt,wt,st,Ot,Dt,Me,ue){if(F===Ri){g===!0&&(pt(s.BLEND),g=!1);return}if(g===!1&&(K(s.BLEND),g=!0),F!==Gd){if(F!==p||ue!==I){if((M!==as||T!==as)&&(s.blendEquation(s.FUNC_ADD),M=as,T=as),ue)switch(F){case On:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case mi:s.blendFunc(s.ONE,s.ONE);break;case Nh:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case Uh:s.blendFuncSeparate(s.DST_COLOR,s.ONE_MINUS_SRC_ALPHA,s.ZERO,s.ONE);break;default:Wt("WebGLState: Invalid blending: ",F);break}else switch(F){case On:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case mi:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE,s.ONE,s.ONE);break;case Nh:Wt("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Uh:Wt("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Wt("WebGLState: Invalid blending: ",F);break}S=null,v=null,E=null,C=null,y.set(0,0,0),A=0,p=F,I=ue}return}wt=wt||_t,st=st||et,Ot=Ot||vt,(_t!==M||wt!==T)&&(s.blendEquationSeparate(re[_t],re[wt]),M=_t,T=wt),(et!==S||vt!==v||st!==E||Ot!==C)&&(s.blendFuncSeparate(j[et],j[vt],j[st],j[Ot]),S=et,v=vt,E=st,C=Ot),(Dt.equals(y)===!1||Me!==A)&&(s.blendColor(Dt.r,Dt.g,Dt.b,Me),y.copy(Dt),A=Me),p=F,I=!1}function ot(F,_t){F.side===ze?pt(s.CULL_FACE):K(s.CULL_FACE);let et=F.side===Ye;_t&&(et=!et),lt(et),F.blending===On&&F.transparent===!1?rt(Ri):rt(F.blending,F.blendEquation,F.blendSrc,F.blendDst,F.blendEquationAlpha,F.blendSrcAlpha,F.blendDstAlpha,F.blendColor,F.blendAlpha,F.premultipliedAlpha),a.setFunc(F.depthFunc),a.setTest(F.depthTest),a.setMask(F.depthWrite),r.setMask(F.colorWrite);let vt=F.stencilWrite;o.setTest(vt),vt&&(o.setMask(F.stencilWriteMask),o.setFunc(F.stencilFunc,F.stencilRef,F.stencilFuncMask),o.setOp(F.stencilFail,F.stencilZFail,F.stencilZPass)),Lt(F.polygonOffset,F.polygonOffsetFactor,F.polygonOffsetUnits),F.alphaToCoverage===!0?K(s.SAMPLE_ALPHA_TO_COVERAGE):pt(s.SAMPLE_ALPHA_TO_COVERAGE)}function lt(F){D!==F&&(F?s.frontFace(s.CW):s.frontFace(s.CCW),D=F)}function dt(F){F!==kd?(K(s.CULL_FACE),F!==B&&(F===Dh?s.cullFace(s.BACK):F===Vd?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):pt(s.CULL_FACE),B=F}function Vt(F){F!==k&&(z&&s.lineWidth(F),k=F)}function Lt(F,_t,et){F?(K(s.POLYGON_OFFSET_FILL),(P!==_t||L!==et)&&(P=_t,L=et,a.getReversed()&&(_t=-_t),s.polygonOffset(_t,et))):pt(s.POLYGON_OFFSET_FILL)}function qt(F){F?K(s.SCISSOR_TEST):pt(s.SCISSOR_TEST)}function Jt(F){F===void 0&&(F=s.TEXTURE0+W-1),Q!==F&&(s.activeTexture(F),Q=F)}function N(F,_t,et){et===void 0&&(Q===null?et=s.TEXTURE0+W-1:et=Q);let vt=tt[et];vt===void 0&&(vt={type:void 0,texture:void 0},tt[et]=vt),(vt.type!==F||vt.texture!==_t)&&(Q!==et&&(s.activeTexture(et),Q=et),s.bindTexture(F,_t||Y[F]),vt.type=F,vt.texture=_t)}function he(){let F=tt[Q];F!==void 0&&F.type!==void 0&&(s.bindTexture(F.type,null),F.type=void 0,F.texture=void 0)}function ie(){try{s.compressedTexImage2D(...arguments)}catch(F){Wt("WebGLState:",F)}}function R(){try{s.compressedTexImage3D(...arguments)}catch(F){Wt("WebGLState:",F)}}function _(){try{s.texSubImage2D(...arguments)}catch(F){Wt("WebGLState:",F)}}function O(){try{s.texSubImage3D(...arguments)}catch(F){Wt("WebGLState:",F)}}function G(){try{s.compressedTexSubImage2D(...arguments)}catch(F){Wt("WebGLState:",F)}}function J(){try{s.compressedTexSubImage3D(...arguments)}catch(F){Wt("WebGLState:",F)}}function ut(){try{s.texStorage2D(...arguments)}catch(F){Wt("WebGLState:",F)}}function mt(){try{s.texStorage3D(...arguments)}catch(F){Wt("WebGLState:",F)}}function Z(){try{s.texImage2D(...arguments)}catch(F){Wt("WebGLState:",F)}}function it(){try{s.texImage3D(...arguments)}catch(F){Wt("WebGLState:",F)}}function gt(F){return f[F]!==void 0?f[F]:s.getParameter(F)}function Ut(F,_t){f[F]!==_t&&(s.pixelStorei(F,_t),f[F]=_t)}function yt(F){Ct.equals(F)===!1&&(s.scissor(F.x,F.y,F.z,F.w),Ct.copy(F))}function xt(F){Bt.equals(F)===!1&&(s.viewport(F.x,F.y,F.z,F.w),Bt.copy(F))}function Ft(F,_t){let et=c.get(_t);et===void 0&&(et=new WeakMap,c.set(_t,et));let vt=et.get(F);vt===void 0&&(vt=s.getUniformBlockIndex(_t,F.name),et.set(F,vt))}function Ht(F,_t){let vt=c.get(_t).get(F);l.get(_t)!==vt&&(s.uniformBlockBinding(_t,vt,F.__bindingPointIndex),l.set(_t,vt))}function Zt(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),a.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),s.pixelStorei(s.PACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,!1),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,s.BROWSER_DEFAULT_WEBGL),s.pixelStorei(s.PACK_ROW_LENGTH,0),s.pixelStorei(s.PACK_SKIP_PIXELS,0),s.pixelStorei(s.PACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_ROW_LENGTH,0),s.pixelStorei(s.UNPACK_IMAGE_HEIGHT,0),s.pixelStorei(s.UNPACK_SKIP_PIXELS,0),s.pixelStorei(s.UNPACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_SKIP_IMAGES,0),h={},f={},Q=null,tt={},u={},d=new WeakMap,m=[],x=null,g=!1,p=null,M=null,S=null,v=null,T=null,E=null,C=null,y=new ct(0,0,0),A=0,I=!1,D=null,B=null,k=null,P=null,L=null,Ct.set(0,0,s.canvas.width,s.canvas.height),Bt.set(0,0,s.canvas.width,s.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:K,disable:pt,bindFramebuffer:zt,drawBuffers:Et,useProgram:kt,setBlending:rt,setMaterial:ot,setFlipSided:lt,setCullFace:dt,setLineWidth:Vt,setPolygonOffset:Lt,setScissorTest:qt,activeTexture:Jt,bindTexture:N,unbindTexture:he,compressedTexImage2D:ie,compressedTexImage3D:R,texImage2D:Z,texImage3D:it,pixelStorei:Ut,getParameter:gt,updateUBOMapping:Ft,uniformBlockBinding:Ht,texStorage2D:ut,texStorage3D:mt,texSubImage2D:_,texSubImage3D:O,compressedTexSubImage2D:G,compressedTexSubImage3D:J,scissor:yt,viewport:xt,reset:Zt}}function wy(s,t,e,i,n,r,a){let o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new nt,h=new WeakMap,f=new Set,u,d=new WeakMap,m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function x(R,_){return m?new OffscreenCanvas(R,_):Wr("canvas")}function g(R,_,O){let G=1,J=ie(R);if((J.width>O||J.height>O)&&(G=O/Math.max(J.width,J.height)),G<1)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap||typeof VideoFrame<"u"&&R instanceof VideoFrame){let ut=Math.floor(G*J.width),mt=Math.floor(G*J.height);u===void 0&&(u=x(ut,mt));let Z=_?x(ut,mt):u;return Z.width=ut,Z.height=mt,Z.getContext("2d").drawImage(R,0,0,ut,mt),Gt("WebGLRenderer: Texture has been resized from ("+J.width+"x"+J.height+") to ("+ut+"x"+mt+")."),Z}else return"data"in R&&Gt("WebGLRenderer: Image in DataTexture is too big ("+J.width+"x"+J.height+")."),R;return R}function p(R){return R.generateMipmaps}function M(R){s.generateMipmap(R)}function S(R){return R.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:R.isWebGL3DRenderTarget?s.TEXTURE_3D:R.isWebGLArrayRenderTarget||R.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function v(R,_,O,G,J,ut=!1){if(R!==null){if(s[R]!==void 0)return s[R];Gt("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let mt;G&&(mt=t.get("EXT_texture_norm16"),mt||Gt("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let Z=_;if(_===s.RED&&(O===s.FLOAT&&(Z=s.R32F),O===s.HALF_FLOAT&&(Z=s.R16F),O===s.UNSIGNED_BYTE&&(Z=s.R8),O===s.UNSIGNED_SHORT&&mt&&(Z=mt.R16_EXT),O===s.SHORT&&mt&&(Z=mt.R16_SNORM_EXT)),_===s.RED_INTEGER&&(O===s.UNSIGNED_BYTE&&(Z=s.R8UI),O===s.UNSIGNED_SHORT&&(Z=s.R16UI),O===s.UNSIGNED_INT&&(Z=s.R32UI),O===s.BYTE&&(Z=s.R8I),O===s.SHORT&&(Z=s.R16I),O===s.INT&&(Z=s.R32I)),_===s.RG&&(O===s.FLOAT&&(Z=s.RG32F),O===s.HALF_FLOAT&&(Z=s.RG16F),O===s.UNSIGNED_BYTE&&(Z=s.RG8),O===s.UNSIGNED_SHORT&&mt&&(Z=mt.RG16_EXT),O===s.SHORT&&mt&&(Z=mt.RG16_SNORM_EXT)),_===s.RG_INTEGER&&(O===s.UNSIGNED_BYTE&&(Z=s.RG8UI),O===s.UNSIGNED_SHORT&&(Z=s.RG16UI),O===s.UNSIGNED_INT&&(Z=s.RG32UI),O===s.BYTE&&(Z=s.RG8I),O===s.SHORT&&(Z=s.RG16I),O===s.INT&&(Z=s.RG32I)),_===s.RGB_INTEGER&&(O===s.UNSIGNED_BYTE&&(Z=s.RGB8UI),O===s.UNSIGNED_SHORT&&(Z=s.RGB16UI),O===s.UNSIGNED_INT&&(Z=s.RGB32UI),O===s.BYTE&&(Z=s.RGB8I),O===s.SHORT&&(Z=s.RGB16I),O===s.INT&&(Z=s.RGB32I)),_===s.RGBA_INTEGER&&(O===s.UNSIGNED_BYTE&&(Z=s.RGBA8UI),O===s.UNSIGNED_SHORT&&(Z=s.RGBA16UI),O===s.UNSIGNED_INT&&(Z=s.RGBA32UI),O===s.BYTE&&(Z=s.RGBA8I),O===s.SHORT&&(Z=s.RGBA16I),O===s.INT&&(Z=s.RGBA32I)),_===s.RGB&&(O===s.UNSIGNED_SHORT&&mt&&(Z=mt.RGB16_EXT),O===s.SHORT&&mt&&(Z=mt.RGB16_SNORM_EXT),O===s.UNSIGNED_INT_5_9_9_9_REV&&(Z=s.RGB9_E5),O===s.UNSIGNED_INT_10F_11F_11F_REV&&(Z=s.R11F_G11F_B10F)),_===s.RGBA){let it=ut?Gr:te.getTransfer(J);O===s.FLOAT&&(Z=s.RGBA32F),O===s.HALF_FLOAT&&(Z=s.RGBA16F),O===s.UNSIGNED_BYTE&&(Z=it===ce?s.SRGB8_ALPHA8:s.RGBA8),O===s.UNSIGNED_SHORT&&mt&&(Z=mt.RGBA16_EXT),O===s.SHORT&&mt&&(Z=mt.RGBA16_SNORM_EXT),O===s.UNSIGNED_SHORT_4_4_4_4&&(Z=s.RGBA4),O===s.UNSIGNED_SHORT_5_5_5_1&&(Z=s.RGB5_A1)}return(Z===s.R16F||Z===s.R32F||Z===s.RG16F||Z===s.RG32F||Z===s.RGBA16F||Z===s.RGBA32F)&&t.get("EXT_color_buffer_float"),Z}function T(R,_){let O;return R?_===null||_===Gi||_===tr?O=s.DEPTH24_STENCIL8:_===Ci?O=s.DEPTH32F_STENCIL8:_===Qs&&(O=s.DEPTH24_STENCIL8,Gt("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):_===null||_===Gi||_===tr?O=s.DEPTH_COMPONENT24:_===Ci?O=s.DEPTH_COMPONENT32F:_===Qs&&(O=s.DEPTH_COMPONENT16),O}function E(R,_){return p(R)===!0||R.isFramebufferTexture&&R.minFilter!==Xe&&R.minFilter!==Ke?Math.log2(Math.max(_.width,_.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?_.mipmaps.length:1}function C(R){let _=R.target;_.removeEventListener("dispose",C),A(_),_.isVideoTexture&&h.delete(_),_.isHTMLTexture&&f.delete(_)}function y(R){let _=R.target;_.removeEventListener("dispose",y),D(_)}function A(R){let _=i.get(R);if(_.__webglInit===void 0)return;let O=R.source,G=d.get(O);if(G){let J=G[_.__cacheKey];J.usedTimes--,J.usedTimes===0&&I(R),Object.keys(G).length===0&&d.delete(O)}i.remove(R)}function I(R){let _=i.get(R);s.deleteTexture(_.__webglTexture);let O=R.source,G=d.get(O);delete G[_.__cacheKey],a.memory.textures--}function D(R){let _=i.get(R);if(R.depthTexture&&(R.depthTexture.dispose(),i.remove(R.depthTexture)),R.isWebGLCubeRenderTarget)for(let G=0;G<6;G++){if(Array.isArray(_.__webglFramebuffer[G]))for(let J=0;J<_.__webglFramebuffer[G].length;J++)s.deleteFramebuffer(_.__webglFramebuffer[G][J]);else s.deleteFramebuffer(_.__webglFramebuffer[G]);_.__webglDepthbuffer&&s.deleteRenderbuffer(_.__webglDepthbuffer[G])}else{if(Array.isArray(_.__webglFramebuffer))for(let G=0;G<_.__webglFramebuffer.length;G++)s.deleteFramebuffer(_.__webglFramebuffer[G]);else s.deleteFramebuffer(_.__webglFramebuffer);if(_.__webglDepthbuffer&&s.deleteRenderbuffer(_.__webglDepthbuffer),_.__webglMultisampledFramebuffer&&s.deleteFramebuffer(_.__webglMultisampledFramebuffer),_.__webglColorRenderbuffer)for(let G=0;G<_.__webglColorRenderbuffer.length;G++)_.__webglColorRenderbuffer[G]&&s.deleteRenderbuffer(_.__webglColorRenderbuffer[G]);_.__webglDepthRenderbuffer&&s.deleteRenderbuffer(_.__webglDepthRenderbuffer)}let O=R.textures;for(let G=0,J=O.length;G<J;G++){let ut=i.get(O[G]);ut.__webglTexture&&(s.deleteTexture(ut.__webglTexture),a.memory.textures--),i.remove(O[G])}i.remove(R)}let B=0;function k(){B=0}function P(){return B}function L(R){B=R}function W(){let R=B;return R>=n.maxTextures&&Gt("WebGLTextures: Trying to use "+(R+1)+" texture units while this GPU supports only "+n.maxTextures),B+=1,R}function z(R){let _=[];return _.push(R.wrapS),_.push(R.wrapT),_.push(R.wrapR||0),_.push(R.magFilter),_.push(R.minFilter),_.push(R.anisotropy),_.push(R.internalFormat),_.push(R.format),_.push(R.type),_.push(R.generateMipmaps),_.push(R.premultiplyAlpha),_.push(R.flipY),_.push(R.unpackAlignment),_.push(R.colorSpace),_.join()}function $(R,_){let O=i.get(R);if(R.isVideoTexture&&N(R),R.isRenderTargetTexture===!1&&R.isExternalTexture!==!0&&R.version>0&&O.__version!==R.version){let G=R.image;if(G===null)Gt("WebGLRenderer: Texture marked for update but no image data found.");else if(G.complete===!1)Gt("WebGLRenderer: Texture marked for update but image is incomplete");else{pt(O,R,_);return}}else R.isExternalTexture&&(O.__webglTexture=R.sourceTexture?R.sourceTexture:null);e.bindTexture(s.TEXTURE_2D,O.__webglTexture,s.TEXTURE0+_)}function X(R,_){let O=i.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&O.__version!==R.version){pt(O,R,_);return}else R.isExternalTexture&&(O.__webglTexture=R.sourceTexture?R.sourceTexture:null);e.bindTexture(s.TEXTURE_2D_ARRAY,O.__webglTexture,s.TEXTURE0+_)}function Q(R,_){let O=i.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&O.__version!==R.version){pt(O,R,_);return}e.bindTexture(s.TEXTURE_3D,O.__webglTexture,s.TEXTURE0+_)}function tt(R,_){let O=i.get(R);if(R.isCubeDepthTexture!==!0&&R.version>0&&O.__version!==R.version){zt(O,R,_);return}e.bindTexture(s.TEXTURE_CUBE_MAP,O.__webglTexture,s.TEXTURE0+_)}let ht={[pn]:s.REPEAT,[Ji]:s.CLAMP_TO_EDGE,[Xo]:s.MIRRORED_REPEAT},at={[Xe]:s.NEAREST,[hf]:s.NEAREST_MIPMAP_NEAREST,[La]:s.NEAREST_MIPMAP_LINEAR,[Ke]:s.LINEAR,[Sl]:s.LINEAR_MIPMAP_NEAREST,[kn]:s.LINEAR_MIPMAP_LINEAR},Ct={[pf]:s.NEVER,[vf]:s.ALWAYS,[mf]:s.LESS,[lc]:s.LEQUAL,[gf]:s.EQUAL,[cc]:s.GEQUAL,[xf]:s.GREATER,[_f]:s.NOTEQUAL};function Bt(R,_){if(_.type===Ci&&t.has("OES_texture_float_linear")===!1&&(_.magFilter===Ke||_.magFilter===Sl||_.magFilter===La||_.magFilter===kn||_.minFilter===Ke||_.minFilter===Sl||_.minFilter===La||_.minFilter===kn)&&Gt("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(R,s.TEXTURE_WRAP_S,ht[_.wrapS]),s.texParameteri(R,s.TEXTURE_WRAP_T,ht[_.wrapT]),(R===s.TEXTURE_3D||R===s.TEXTURE_2D_ARRAY)&&s.texParameteri(R,s.TEXTURE_WRAP_R,ht[_.wrapR]),s.texParameteri(R,s.TEXTURE_MAG_FILTER,at[_.magFilter]),s.texParameteri(R,s.TEXTURE_MIN_FILTER,at[_.minFilter]),_.compareFunction&&(s.texParameteri(R,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(R,s.TEXTURE_COMPARE_FUNC,Ct[_.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(_.magFilter===Xe||_.minFilter!==La&&_.minFilter!==kn||_.type===Ci&&t.has("OES_texture_float_linear")===!1)return;if(_.anisotropy>1||i.get(_).__currentAnisotropy){let O=t.get("EXT_texture_filter_anisotropic");s.texParameterf(R,O.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(_.anisotropy,n.getMaxAnisotropy())),i.get(_).__currentAnisotropy=_.anisotropy}}}function Xt(R,_){let O=!1;R.__webglInit===void 0&&(R.__webglInit=!0,_.addEventListener("dispose",C));let G=_.source,J=d.get(G);J===void 0&&(J={},d.set(G,J));let ut=z(_);if(ut!==R.__cacheKey){J[ut]===void 0&&(J[ut]={texture:s.createTexture(),usedTimes:0},a.memory.textures++,O=!0),J[ut].usedTimes++;let mt=J[R.__cacheKey];mt!==void 0&&(J[R.__cacheKey].usedTimes--,mt.usedTimes===0&&I(_)),R.__cacheKey=ut,R.__webglTexture=J[ut].texture}return O}function Y(R,_,O){return Math.floor(Math.floor(R/O)/_)}function K(R,_,O,G){let ut=R.updateRanges;if(ut.length===0)e.texSubImage2D(s.TEXTURE_2D,0,0,0,_.width,_.height,O,G,_.data);else{ut.sort((Ut,yt)=>Ut.start-yt.start);let mt=0;for(let Ut=1;Ut<ut.length;Ut++){let yt=ut[mt],xt=ut[Ut],Ft=yt.start+yt.count,Ht=Y(xt.start,_.width,4),Zt=Y(yt.start,_.width,4);xt.start<=Ft+1&&Ht===Zt&&Y(xt.start+xt.count-1,_.width,4)===Ht?yt.count=Math.max(yt.count,xt.start+xt.count-yt.start):(++mt,ut[mt]=xt)}ut.length=mt+1;let Z=e.getParameter(s.UNPACK_ROW_LENGTH),it=e.getParameter(s.UNPACK_SKIP_PIXELS),gt=e.getParameter(s.UNPACK_SKIP_ROWS);e.pixelStorei(s.UNPACK_ROW_LENGTH,_.width);for(let Ut=0,yt=ut.length;Ut<yt;Ut++){let xt=ut[Ut],Ft=Math.floor(xt.start/4),Ht=Math.ceil(xt.count/4),Zt=Ft%_.width,F=Math.floor(Ft/_.width),_t=Ht,et=1;e.pixelStorei(s.UNPACK_SKIP_PIXELS,Zt),e.pixelStorei(s.UNPACK_SKIP_ROWS,F),e.texSubImage2D(s.TEXTURE_2D,0,Zt,F,_t,et,O,G,_.data)}R.clearUpdateRanges(),e.pixelStorei(s.UNPACK_ROW_LENGTH,Z),e.pixelStorei(s.UNPACK_SKIP_PIXELS,it),e.pixelStorei(s.UNPACK_SKIP_ROWS,gt)}}function pt(R,_,O){let G=s.TEXTURE_2D;(_.isDataArrayTexture||_.isCompressedArrayTexture)&&(G=s.TEXTURE_2D_ARRAY),_.isData3DTexture&&(G=s.TEXTURE_3D);let J=Xt(R,_),ut=_.source;e.bindTexture(G,R.__webglTexture,s.TEXTURE0+O);let mt=i.get(ut);if(ut.version!==mt.__version||J===!0){if(e.activeTexture(s.TEXTURE0+O),(typeof ImageBitmap<"u"&&_.image instanceof ImageBitmap)===!1){let et=te.getPrimaries(te.workingColorSpace),vt=_.colorSpace===_n?null:te.getPrimaries(_.colorSpace),wt=_.colorSpace===_n||et===vt?s.NONE:s.BROWSER_DEFAULT_WEBGL;e.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,_.flipY),e.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),e.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,wt)}e.pixelStorei(s.UNPACK_ALIGNMENT,_.unpackAlignment);let it=g(_.image,!1,n.maxTextureSize);it=he(_,it);let gt=r.convert(_.format,_.colorSpace),Ut=r.convert(_.type),yt=v(_.internalFormat,gt,Ut,_.normalized,_.colorSpace,_.isVideoTexture);Bt(G,_);let xt,Ft=_.mipmaps,Ht=_.isVideoTexture!==!0,Zt=mt.__version===void 0||J===!0,F=ut.dataReady,_t=E(_,it);if(_.isDepthTexture)yt=T(_.format===Vn,_.type),Zt&&(Ht?e.texStorage2D(s.TEXTURE_2D,1,yt,it.width,it.height):e.texImage2D(s.TEXTURE_2D,0,yt,it.width,it.height,0,gt,Ut,null));else if(_.isDataTexture)if(Ft.length>0){Ht&&Zt&&e.texStorage2D(s.TEXTURE_2D,_t,yt,Ft[0].width,Ft[0].height);for(let et=0,vt=Ft.length;et<vt;et++)xt=Ft[et],Ht?F&&e.texSubImage2D(s.TEXTURE_2D,et,0,0,xt.width,xt.height,gt,Ut,xt.data):e.texImage2D(s.TEXTURE_2D,et,yt,xt.width,xt.height,0,gt,Ut,xt.data);_.generateMipmaps=!1}else Ht?(Zt&&e.texStorage2D(s.TEXTURE_2D,_t,yt,it.width,it.height),F&&K(_,it,gt,Ut)):e.texImage2D(s.TEXTURE_2D,0,yt,it.width,it.height,0,gt,Ut,it.data);else if(_.isCompressedTexture)if(_.isCompressedArrayTexture){Ht&&Zt&&e.texStorage3D(s.TEXTURE_2D_ARRAY,_t,yt,Ft[0].width,Ft[0].height,it.depth);for(let et=0,vt=Ft.length;et<vt;et++)if(xt=Ft[et],_.format!==Pi)if(gt!==null)if(Ht){if(F)if(_.layerUpdates.size>0){let wt=Qh(xt.width,xt.height,_.format,_.type);for(let st of _.layerUpdates){let Ot=xt.data.subarray(st*wt/xt.data.BYTES_PER_ELEMENT,(st+1)*wt/xt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,et,0,0,st,xt.width,xt.height,1,gt,Ot)}}else e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,et,0,0,0,xt.width,xt.height,it.depth,gt,xt.data)}else e.compressedTexImage3D(s.TEXTURE_2D_ARRAY,et,yt,xt.width,xt.height,it.depth,0,xt.data,0,0);else Gt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ht?F&&e.texSubImage3D(s.TEXTURE_2D_ARRAY,et,0,0,0,xt.width,xt.height,it.depth,gt,Ut,xt.data):e.texImage3D(s.TEXTURE_2D_ARRAY,et,yt,xt.width,xt.height,it.depth,0,gt,Ut,xt.data);_.layerUpdates.size>0&&_.clearLayerUpdates()}else{Ht&&Zt&&e.texStorage2D(s.TEXTURE_2D,_t,yt,Ft[0].width,Ft[0].height);for(let et=0,vt=Ft.length;et<vt;et++)xt=Ft[et],_.format!==Pi?gt!==null?Ht?F&&e.compressedTexSubImage2D(s.TEXTURE_2D,et,0,0,xt.width,xt.height,gt,xt.data):e.compressedTexImage2D(s.TEXTURE_2D,et,yt,xt.width,xt.height,0,xt.data):Gt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ht?F&&e.texSubImage2D(s.TEXTURE_2D,et,0,0,xt.width,xt.height,gt,Ut,xt.data):e.texImage2D(s.TEXTURE_2D,et,yt,xt.width,xt.height,0,gt,Ut,xt.data)}else if(_.isDataArrayTexture)if(Ht){if(Zt&&e.texStorage3D(s.TEXTURE_2D_ARRAY,_t,yt,it.width,it.height,it.depth),F)if(_.layerUpdates.size>0){let et=Qh(it.width,it.height,_.format,_.type);for(let vt of _.layerUpdates){let wt=it.data.subarray(vt*et/it.data.BYTES_PER_ELEMENT,(vt+1)*et/it.data.BYTES_PER_ELEMENT);e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,vt,it.width,it.height,1,gt,Ut,wt)}_.clearLayerUpdates()}else e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,it.width,it.height,it.depth,gt,Ut,it.data)}else e.texImage3D(s.TEXTURE_2D_ARRAY,0,yt,it.width,it.height,it.depth,0,gt,Ut,it.data);else if(_.isData3DTexture)Ht?(Zt&&e.texStorage3D(s.TEXTURE_3D,_t,yt,it.width,it.height,it.depth),F&&e.texSubImage3D(s.TEXTURE_3D,0,0,0,0,it.width,it.height,it.depth,gt,Ut,it.data)):e.texImage3D(s.TEXTURE_3D,0,yt,it.width,it.height,it.depth,0,gt,Ut,it.data);else if(_.isFramebufferTexture){if(Zt)if(Ht)e.texStorage2D(s.TEXTURE_2D,_t,yt,it.width,it.height);else{let et=it.width,vt=it.height;for(let wt=0;wt<_t;wt++)e.texImage2D(s.TEXTURE_2D,wt,yt,et,vt,0,gt,Ut,null),et>>=1,vt>>=1}}else if(_.isHTMLTexture){if("texElementImage2D"in s){let et=s.canvas;if(et.hasAttribute("layoutsubtree")||et.setAttribute("layoutsubtree","true"),it.parentNode!==et){et.appendChild(it),f.add(_),et.onpaint=vt=>{let wt=vt.changedElements;for(let st of f)wt.includes(st.image)&&(st.needsUpdate=!0)},et.requestPaint();return}if(s.texElementImage2D.length===3)s.texElementImage2D(s.TEXTURE_2D,s.RGBA8,it);else{let wt=s.RGBA,st=s.RGBA,Ot=s.UNSIGNED_BYTE;s.texElementImage2D(s.TEXTURE_2D,0,wt,st,Ot,it)}s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MIN_FILTER,s.LINEAR),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE)}}else if(Ft.length>0){if(Ht&&Zt){let et=ie(Ft[0]);e.texStorage2D(s.TEXTURE_2D,_t,yt,et.width,et.height)}for(let et=0,vt=Ft.length;et<vt;et++)xt=Ft[et],Ht?F&&e.texSubImage2D(s.TEXTURE_2D,et,0,0,gt,Ut,xt):e.texImage2D(s.TEXTURE_2D,et,yt,gt,Ut,xt);_.generateMipmaps=!1}else if(Ht){if(Zt){let et=ie(it);e.texStorage2D(s.TEXTURE_2D,_t,yt,et.width,et.height)}F&&e.texSubImage2D(s.TEXTURE_2D,0,0,0,gt,Ut,it)}else e.texImage2D(s.TEXTURE_2D,0,yt,gt,Ut,it);p(_)&&M(G),mt.__version=ut.version,_.onUpdate&&_.onUpdate(_)}R.__version=_.version}function zt(R,_,O){if(_.image.length!==6)return;let G=Xt(R,_),J=_.source;e.bindTexture(s.TEXTURE_CUBE_MAP,R.__webglTexture,s.TEXTURE0+O);let ut=i.get(J);if(J.version!==ut.__version||G===!0){e.activeTexture(s.TEXTURE0+O);let mt=te.getPrimaries(te.workingColorSpace),Z=_.colorSpace===_n?null:te.getPrimaries(_.colorSpace),it=_.colorSpace===_n||mt===Z?s.NONE:s.BROWSER_DEFAULT_WEBGL;e.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,_.flipY),e.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),e.pixelStorei(s.UNPACK_ALIGNMENT,_.unpackAlignment),e.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,it);let gt=_.isCompressedTexture||_.image[0].isCompressedTexture,Ut=_.image[0]&&_.image[0].isDataTexture,yt=[];for(let st=0;st<6;st++)!gt&&!Ut?yt[st]=g(_.image[st],!0,n.maxCubemapSize):yt[st]=Ut?_.image[st].image:_.image[st],yt[st]=he(_,yt[st]);let xt=yt[0],Ft=r.convert(_.format,_.colorSpace),Ht=r.convert(_.type),Zt=v(_.internalFormat,Ft,Ht,_.normalized,_.colorSpace),F=_.isVideoTexture!==!0,_t=ut.__version===void 0||G===!0,et=J.dataReady,vt=E(_,xt);Bt(s.TEXTURE_CUBE_MAP,_);let wt;if(gt){F&&_t&&e.texStorage2D(s.TEXTURE_CUBE_MAP,vt,Zt,xt.width,xt.height);for(let st=0;st<6;st++){wt=yt[st].mipmaps;for(let Ot=0;Ot<wt.length;Ot++){let Dt=wt[Ot];_.format!==Pi?Ft!==null?F?et&&e.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+st,Ot,0,0,Dt.width,Dt.height,Ft,Dt.data):e.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+st,Ot,Zt,Dt.width,Dt.height,0,Dt.data):Gt("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):F?et&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+st,Ot,0,0,Dt.width,Dt.height,Ft,Ht,Dt.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+st,Ot,Zt,Dt.width,Dt.height,0,Ft,Ht,Dt.data)}}}else{if(wt=_.mipmaps,F&&_t){wt.length>0&&vt++;let st=ie(yt[0]);e.texStorage2D(s.TEXTURE_CUBE_MAP,vt,Zt,st.width,st.height)}for(let st=0;st<6;st++)if(Ut){F?et&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+st,0,0,0,yt[st].width,yt[st].height,Ft,Ht,yt[st].data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+st,0,Zt,yt[st].width,yt[st].height,0,Ft,Ht,yt[st].data);for(let Ot=0;Ot<wt.length;Ot++){let Me=wt[Ot].image[st].image;F?et&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+st,Ot+1,0,0,Me.width,Me.height,Ft,Ht,Me.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+st,Ot+1,Zt,Me.width,Me.height,0,Ft,Ht,Me.data)}}else{F?et&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+st,0,0,0,Ft,Ht,yt[st]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+st,0,Zt,Ft,Ht,yt[st]);for(let Ot=0;Ot<wt.length;Ot++){let Dt=wt[Ot];F?et&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+st,Ot+1,0,0,Ft,Ht,Dt.image[st]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+st,Ot+1,Zt,Ft,Ht,Dt.image[st])}}}p(_)&&M(s.TEXTURE_CUBE_MAP),ut.__version=J.version,_.onUpdate&&_.onUpdate(_)}R.__version=_.version}function Et(R,_,O,G,J,ut){let mt=r.convert(O.format,O.colorSpace),Z=r.convert(O.type),it=v(O.internalFormat,mt,Z,O.normalized,O.colorSpace),gt=i.get(_),Ut=i.get(O);if(Ut.__renderTarget=_,!gt.__hasExternalTextures){let yt=Math.max(1,_.width>>ut),xt=Math.max(1,_.height>>ut);J===s.TEXTURE_3D||J===s.TEXTURE_2D_ARRAY?e.texImage3D(J,ut,it,yt,xt,_.depth,0,mt,Z,null):e.texImage2D(J,ut,it,yt,xt,0,mt,Z,null)}e.bindFramebuffer(s.FRAMEBUFFER,R),Jt(_)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,G,J,Ut.__webglTexture,0,qt(_)):(J===s.TEXTURE_2D||J>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&J<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,G,J,Ut.__webglTexture,ut),e.bindFramebuffer(s.FRAMEBUFFER,null)}function kt(R,_,O){if(s.bindRenderbuffer(s.RENDERBUFFER,R),_.depthBuffer){let G=_.depthTexture,J=G&&G.isDepthTexture?G.type:null,ut=T(_.stencilBuffer,J),mt=_.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;Jt(_)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,qt(_),ut,_.width,_.height):O?s.renderbufferStorageMultisample(s.RENDERBUFFER,qt(_),ut,_.width,_.height):s.renderbufferStorage(s.RENDERBUFFER,ut,_.width,_.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,mt,s.RENDERBUFFER,R)}else{let G=_.textures;for(let J=0;J<G.length;J++){let ut=G[J],mt=r.convert(ut.format,ut.colorSpace),Z=r.convert(ut.type),it=v(ut.internalFormat,mt,Z,ut.normalized,ut.colorSpace);Jt(_)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,qt(_),it,_.width,_.height):O?s.renderbufferStorageMultisample(s.RENDERBUFFER,qt(_),it,_.width,_.height):s.renderbufferStorage(s.RENDERBUFFER,it,_.width,_.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function re(R,_,O){let G=_.isWebGLCubeRenderTarget===!0;if(e.bindFramebuffer(s.FRAMEBUFFER,R),!(_.depthTexture&&_.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let J=i.get(_.depthTexture);if(J.__renderTarget=_,(!J.__webglTexture||_.depthTexture.image.width!==_.width||_.depthTexture.image.height!==_.height)&&(_.depthTexture.image.width=_.width,_.depthTexture.image.height=_.height,_.depthTexture.needsUpdate=!0),G){if(J.__webglInit===void 0&&(J.__webglInit=!0,_.depthTexture.addEventListener("dispose",C)),J.__webglTexture===void 0){J.__webglTexture=s.createTexture(),e.bindTexture(s.TEXTURE_CUBE_MAP,J.__webglTexture),Bt(s.TEXTURE_CUBE_MAP,_.depthTexture);let gt=r.convert(_.depthTexture.format),Ut=r.convert(_.depthTexture.type),yt;_.depthTexture.format===ji?yt=s.DEPTH_COMPONENT24:_.depthTexture.format===Vn&&(yt=s.DEPTH24_STENCIL8);for(let xt=0;xt<6;xt++)s.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+xt,0,yt,_.width,_.height,0,gt,Ut,null)}}else $(_.depthTexture,0);let ut=J.__webglTexture,mt=qt(_),Z=G?s.TEXTURE_CUBE_MAP_POSITIVE_X+O:s.TEXTURE_2D,it=_.depthTexture.format===Vn?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;if(_.depthTexture.format===ji)Jt(_)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,it,Z,ut,0,mt):s.framebufferTexture2D(s.FRAMEBUFFER,it,Z,ut,0);else if(_.depthTexture.format===Vn)Jt(_)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,it,Z,ut,0,mt):s.framebufferTexture2D(s.FRAMEBUFFER,it,Z,ut,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function j(R){let _=i.get(R),O=R.isWebGLCubeRenderTarget===!0;if(_.__boundDepthTexture!==R.depthTexture){let G=R.depthTexture;if(_.__depthDisposeCallback&&_.__depthDisposeCallback(),G){let J=()=>{delete _.__boundDepthTexture,delete _.__depthDisposeCallback,G.removeEventListener("dispose",J)};G.addEventListener("dispose",J),_.__depthDisposeCallback=J}_.__boundDepthTexture=G}if(R.depthTexture&&!_.__autoAllocateDepthBuffer)if(O)for(let G=0;G<6;G++)re(_.__webglFramebuffer[G],R,G);else{let G=R.texture.mipmaps;G&&G.length>0?re(_.__webglFramebuffer[0],R,0):re(_.__webglFramebuffer,R,0)}else if(O){_.__webglDepthbuffer=[];for(let G=0;G<6;G++)if(e.bindFramebuffer(s.FRAMEBUFFER,_.__webglFramebuffer[G]),_.__webglDepthbuffer[G]===void 0)_.__webglDepthbuffer[G]=s.createRenderbuffer(),kt(_.__webglDepthbuffer[G],R,!1);else{let J=R.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,ut=_.__webglDepthbuffer[G];s.bindRenderbuffer(s.RENDERBUFFER,ut),s.framebufferRenderbuffer(s.FRAMEBUFFER,J,s.RENDERBUFFER,ut)}}else{let G=R.texture.mipmaps;if(G&&G.length>0?e.bindFramebuffer(s.FRAMEBUFFER,_.__webglFramebuffer[0]):e.bindFramebuffer(s.FRAMEBUFFER,_.__webglFramebuffer),_.__webglDepthbuffer===void 0)_.__webglDepthbuffer=s.createRenderbuffer(),kt(_.__webglDepthbuffer,R,!1);else{let J=R.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,ut=_.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,ut),s.framebufferRenderbuffer(s.FRAMEBUFFER,J,s.RENDERBUFFER,ut)}}e.bindFramebuffer(s.FRAMEBUFFER,null)}function rt(R,_,O){let G=i.get(R);_!==void 0&&Et(G.__webglFramebuffer,R,R.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),O!==void 0&&j(R)}function ot(R){let _=R.texture,O=i.get(R),G=i.get(_);R.addEventListener("dispose",y);let J=R.textures,ut=R.isWebGLCubeRenderTarget===!0,mt=J.length>1;if(mt||(G.__webglTexture===void 0&&(G.__webglTexture=s.createTexture()),G.__version=_.version,a.memory.textures++),ut){O.__webglFramebuffer=[];for(let Z=0;Z<6;Z++)if(_.mipmaps&&_.mipmaps.length>0){O.__webglFramebuffer[Z]=[];for(let it=0;it<_.mipmaps.length;it++)O.__webglFramebuffer[Z][it]=s.createFramebuffer()}else O.__webglFramebuffer[Z]=s.createFramebuffer()}else{if(_.mipmaps&&_.mipmaps.length>0){O.__webglFramebuffer=[];for(let Z=0;Z<_.mipmaps.length;Z++)O.__webglFramebuffer[Z]=s.createFramebuffer()}else O.__webglFramebuffer=s.createFramebuffer();if(mt)for(let Z=0,it=J.length;Z<it;Z++){let gt=i.get(J[Z]);gt.__webglTexture===void 0&&(gt.__webglTexture=s.createTexture(),a.memory.textures++)}if(R.samples>0&&Jt(R)===!1){O.__webglMultisampledFramebuffer=s.createFramebuffer(),O.__webglColorRenderbuffer=[],e.bindFramebuffer(s.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let Z=0;Z<J.length;Z++){let it=J[Z];O.__webglColorRenderbuffer[Z]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,O.__webglColorRenderbuffer[Z]);let gt=r.convert(it.format,it.colorSpace),Ut=r.convert(it.type),yt=v(it.internalFormat,gt,Ut,it.normalized,it.colorSpace,R.isXRRenderTarget===!0),xt=qt(R);s.renderbufferStorageMultisample(s.RENDERBUFFER,xt,yt,R.width,R.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Z,s.RENDERBUFFER,O.__webglColorRenderbuffer[Z])}s.bindRenderbuffer(s.RENDERBUFFER,null),R.depthBuffer&&(O.__webglDepthRenderbuffer=s.createRenderbuffer(),kt(O.__webglDepthRenderbuffer,R,!0)),e.bindFramebuffer(s.FRAMEBUFFER,null)}}if(ut){e.bindTexture(s.TEXTURE_CUBE_MAP,G.__webglTexture),Bt(s.TEXTURE_CUBE_MAP,_);for(let Z=0;Z<6;Z++)if(_.mipmaps&&_.mipmaps.length>0)for(let it=0;it<_.mipmaps.length;it++)Et(O.__webglFramebuffer[Z][it],R,_,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+Z,it);else Et(O.__webglFramebuffer[Z],R,_,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0);p(_)&&M(s.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(mt){for(let Z=0,it=J.length;Z<it;Z++){let gt=J[Z],Ut=i.get(gt),yt=s.TEXTURE_2D;(R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(yt=R.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),e.bindTexture(yt,Ut.__webglTexture),Bt(yt,gt),Et(O.__webglFramebuffer,R,gt,s.COLOR_ATTACHMENT0+Z,yt,0),p(gt)&&M(yt)}e.unbindTexture()}else{let Z=s.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(Z=R.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),e.bindTexture(Z,G.__webglTexture),Bt(Z,_),_.mipmaps&&_.mipmaps.length>0)for(let it=0;it<_.mipmaps.length;it++)Et(O.__webglFramebuffer[it],R,_,s.COLOR_ATTACHMENT0,Z,it);else Et(O.__webglFramebuffer,R,_,s.COLOR_ATTACHMENT0,Z,0);p(_)&&M(Z),e.unbindTexture()}R.depthBuffer&&j(R)}function lt(R){let _=R.textures;for(let O=0,G=_.length;O<G;O++){let J=_[O];if(p(J)){let ut=S(R),mt=i.get(J).__webglTexture;e.bindTexture(ut,mt),M(ut),e.unbindTexture()}}}let dt=[],Vt=[];function Lt(R){if(R.samples>0){if(Jt(R)===!1){let _=R.textures,O=R.width,G=R.height,J=s.COLOR_BUFFER_BIT,ut=R.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,mt=i.get(R),Z=_.length>1;if(Z)for(let gt=0;gt<_.length;gt++)e.bindFramebuffer(s.FRAMEBUFFER,mt.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+gt,s.RENDERBUFFER,null),e.bindFramebuffer(s.FRAMEBUFFER,mt.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+gt,s.TEXTURE_2D,null,0);e.bindFramebuffer(s.READ_FRAMEBUFFER,mt.__webglMultisampledFramebuffer);let it=R.texture.mipmaps;it&&it.length>0?e.bindFramebuffer(s.DRAW_FRAMEBUFFER,mt.__webglFramebuffer[0]):e.bindFramebuffer(s.DRAW_FRAMEBUFFER,mt.__webglFramebuffer);for(let gt=0;gt<_.length;gt++){if(R.resolveDepthBuffer&&(R.depthBuffer&&(J|=s.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&(J|=s.STENCIL_BUFFER_BIT)),Z){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,mt.__webglColorRenderbuffer[gt]);let Ut=i.get(_[gt]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,Ut,0)}s.blitFramebuffer(0,0,O,G,0,0,O,G,J,s.NEAREST),l===!0&&(dt.length=0,Vt.length=0,dt.push(s.COLOR_ATTACHMENT0+gt),R.depthBuffer&&R.storeMultisampledDepthBuffer===!1&&(dt.push(ut),Vt.push(ut),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,Vt)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,dt))}if(e.bindFramebuffer(s.READ_FRAMEBUFFER,null),e.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),Z)for(let gt=0;gt<_.length;gt++){e.bindFramebuffer(s.FRAMEBUFFER,mt.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+gt,s.RENDERBUFFER,mt.__webglColorRenderbuffer[gt]);let Ut=i.get(_[gt]).__webglTexture;e.bindFramebuffer(s.FRAMEBUFFER,mt.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+gt,s.TEXTURE_2D,Ut,0)}e.bindFramebuffer(s.DRAW_FRAMEBUFFER,mt.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.storeMultisampledDepthBuffer===!1&&l){let _=R.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[_])}}}function qt(R){return Math.min(n.maxSamples,R.samples)}function Jt(R){let _=i.get(R);return R.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&_.__useRenderToTexture!==!1}function N(R){let _=a.render.frame;h.get(R)!==_&&(h.set(R,_),R.update())}function he(R,_){let O=R.colorSpace,G=R.format,J=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||O!==Hr&&O!==_n&&(te.getTransfer(O)===ce?(G!==Pi||J!==gi)&&Gt("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Wt("WebGLTextures: Unsupported texture color space:",O)),_}function ie(R){return typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement?(c.width=R.naturalWidth||R.width,c.height=R.naturalHeight||R.height):typeof VideoFrame<"u"&&R instanceof VideoFrame?(c.width=R.displayWidth,c.height=R.displayHeight):(c.width=R.width,c.height=R.height),c}this.allocateTextureUnit=W,this.resetTextureUnits=k,this.getTextureUnits=P,this.setTextureUnits=L,this.setTexture2D=$,this.setTexture2DArray=X,this.setTexture3D=Q,this.setTextureCube=tt,this.rebindTextures=rt,this.setupRenderTarget=ot,this.updateRenderTargetMipmap=lt,this.updateMultisampleRenderTarget=Lt,this.setupDepthRenderbuffer=j,this.setupFrameBufferTexture=Et,this.useMultisampledRTT=Jt,this.isReversedDepthBuffer=function(){return e.buffers.depth.getReversed()}}function Ay(s,t){function e(i,n=_n){let r,a=te.getTransfer(n);if(i===gi)return s.UNSIGNED_BYTE;if(i===El)return s.UNSIGNED_SHORT_4_4_4_4;if(i===wl)return s.UNSIGNED_SHORT_5_5_5_1;if(i===Hh)return s.UNSIGNED_INT_5_9_9_9_REV;if(i===Gh)return s.UNSIGNED_INT_10F_11F_11F_REV;if(i===kh)return s.BYTE;if(i===Vh)return s.SHORT;if(i===Qs)return s.UNSIGNED_SHORT;if(i===Tl)return s.INT;if(i===Gi)return s.UNSIGNED_INT;if(i===Ci)return s.FLOAT;if(i===ke)return s.HALF_FLOAT;if(i===Wh)return s.ALPHA;if(i===Xh)return s.RGB;if(i===Pi)return s.RGBA;if(i===ji)return s.DEPTH_COMPONENT;if(i===Vn)return s.DEPTH_STENCIL;if(i===Al)return s.RED;if(i===Rl)return s.RED_INTEGER;if(i===Hn)return s.RG;if(i===Cl)return s.RG_INTEGER;if(i===Pl)return s.RGBA_INTEGER;if(i===Da||i===Na||i===Ua||i===Fa)if(a===ce)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===Da)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Na)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Ua)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Fa)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===Da)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Na)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Ua)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Fa)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Il||i===Ll||i===Dl||i===Nl)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===Il)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Ll)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Dl)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Nl)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Ul||i===Fl||i===Bl||i===Ol||i===zl||i===Ba||i===kl)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(i===Ul||i===Fl)return a===ce?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===Bl)return a===ce?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(i===Ol)return r.COMPRESSED_R11_EAC;if(i===zl)return r.COMPRESSED_SIGNED_R11_EAC;if(i===Ba)return r.COMPRESSED_RG11_EAC;if(i===kl)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===Vl||i===Hl||i===Gl||i===Wl||i===Xl||i===ql||i===Yl||i===$l||i===Jl||i===Zl||i===Kl||i===jl||i===Ql||i===tc)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(i===Vl)return a===ce?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Hl)return a===ce?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Gl)return a===ce?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Wl)return a===ce?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Xl)return a===ce?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===ql)return a===ce?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Yl)return a===ce?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===$l)return a===ce?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Jl)return a===ce?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Zl)return a===ce?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Kl)return a===ce?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===jl)return a===ce?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Ql)return a===ce?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===tc)return a===ce?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===ec||i===ic||i===nc)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(i===ec)return a===ce?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===ic)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===nc)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===sc||i===rc||i===Oa||i===ac)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(i===sc)return r.COMPRESSED_RED_RGTC1_EXT;if(i===rc)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Oa)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===ac)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===tr?s.UNSIGNED_INT_24_8:s[i]!==void 0?s[i]:null}return{convert:e}}var Ry=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Cy=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,_u=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){let i=new sa(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=i}}getMesh(t){if(this.texture!==null&&this.mesh===null){let e=t.cameras[0].viewport,i=new we({vertexShader:Ry,fragmentShader:Cy,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new St(new je(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},vu=class extends Qi{constructor(t,e){super();let i=this,n=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,f=null,u=null,d=null,m=null,x=typeof XRWebGLBinding<"u",g=new _u,p={},M=e.getContextAttributes(),S=null,v=null,T=[],E=[],C=new nt,y=null,A=null,I=new Ze;I.viewport=new Re;let D=new Ze;D.viewport=new Re;let B=[I,D],k=new vl,P=null,L=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let K=T[Y];return K===void 0&&(K=new Ws,T[Y]=K),K.getTargetRaySpace()},this.getControllerGrip=function(Y){let K=T[Y];return K===void 0&&(K=new Ws,T[Y]=K),K.getGripSpace()},this.getHand=function(Y){let K=T[Y];return K===void 0&&(K=new Ws,T[Y]=K),K.getHandSpace()};function W(Y){let K=E.indexOf(Y.inputSource);if(K===-1)return;let pt=T[K];pt!==void 0&&(pt.update(Y.inputSource,Y.frame,c||a),pt.dispatchEvent({type:Y.type,data:Y.inputSource}))}function z(){n.removeEventListener("select",W),n.removeEventListener("selectstart",W),n.removeEventListener("selectend",W),n.removeEventListener("squeeze",W),n.removeEventListener("squeezestart",W),n.removeEventListener("squeezeend",W),n.removeEventListener("end",z),n.removeEventListener("inputsourceschange",$);for(let Y=0;Y<T.length;Y++){let K=E[Y];K!==null&&(E[Y]=null,T[Y].disconnect(K))}P=null,L=null,g.reset();for(let Y in p)delete p[Y];if(t.setRenderTarget(S),d=null,u=null,f=null,n=null,v=null,Xt.stop(),i.isPresenting=!1,t.setPixelRatio(y),t.setSize(C.width,C.height,!1),A!==null){let Y=A.camera;Y.fov=A.fov,Y.zoom=A.zoom,Y.updateProjectionMatrix(),A=null}i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){r=Y,i.isPresenting===!0&&Gt("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){o=Y,i.isPresenting===!0&&Gt("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(Y){c=Y},this.getBaseLayer=function(){return u!==null?u:d},this.getBinding=function(){return f===null&&x&&(f=new XRWebGLBinding(n,e)),f},this.getFrame=function(){return m},this.getSession=function(){return n},this.setSession=async function(Y){if(n=Y,n!==null){if(S=t.getRenderTarget(),n.addEventListener("select",W),n.addEventListener("selectstart",W),n.addEventListener("selectend",W),n.addEventListener("squeeze",W),n.addEventListener("squeezestart",W),n.addEventListener("squeezeend",W),n.addEventListener("end",z),n.addEventListener("inputsourceschange",$),M.xrCompatible!==!0&&await e.makeXRCompatible(),y=t.getPixelRatio(),t.getSize(C),x&&"createProjectionLayer"in XRWebGLBinding.prototype){let pt=null,zt=null,Et=null;M.depth&&(Et=M.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,pt=M.stencil?Vn:ji,zt=M.stencil?tr:Gi);let kt={colorFormat:e.RGBA8,depthFormat:Et,scaleFactor:r};f=this.getBinding(),u=f.createProjectionLayer(kt),n.updateRenderState({layers:[u]}),t.setPixelRatio(1),t.setSize(u.textureWidth,u.textureHeight,!1),v=new Le(u.textureWidth,u.textureHeight,{format:Pi,type:gi,depthTexture:new In(u.textureWidth,u.textureHeight,zt,void 0,void 0,void 0,void 0,void 0,void 0,pt),stencilBuffer:M.stencil,colorSpace:t.outputColorSpace,samples:M.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1,storeMultisampledDepthBuffer:u.ignoreDepthValues===!1,storeMultisampledStencilBuffer:u.ignoreDepthValues===!1})}else{let pt={antialias:M.antialias,alpha:!0,depth:M.depth,stencil:M.stencil,framebufferScaleFactor:r};d=new XRWebGLLayer(n,e,pt),n.updateRenderState({baseLayer:d}),t.setPixelRatio(1),t.setSize(d.framebufferWidth,d.framebufferHeight,!1),v=new Le(d.framebufferWidth,d.framebufferHeight,{format:Pi,type:gi,colorSpace:t.outputColorSpace,stencilBuffer:M.stencil,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await n.requestReferenceSpace(o),Xt.setContext(n),Xt.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(n!==null)return n.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function $(Y){for(let K=0;K<Y.removed.length;K++){let pt=Y.removed[K],zt=E.indexOf(pt);zt>=0&&(E[zt]=null,T[zt].disconnect(pt))}for(let K=0;K<Y.added.length;K++){let pt=Y.added[K],zt=E.indexOf(pt);if(zt===-1){for(let kt=0;kt<T.length;kt++)if(kt>=E.length){E.push(pt),zt=kt;break}else if(E[kt]===null){E[kt]=pt,zt=kt;break}if(zt===-1)break}let Et=T[zt];Et&&Et.connect(pt)}}let X=new w,Q=new w;function tt(Y,K,pt){X.setFromMatrixPosition(K.matrixWorld),Q.setFromMatrixPosition(pt.matrixWorld);let zt=X.distanceTo(Q),Et=K.projectionMatrix.elements,kt=pt.projectionMatrix.elements,re=Et[14]/(Et[10]-1),j=Et[14]/(Et[10]+1),rt=(Et[9]+1)/Et[5],ot=(Et[9]-1)/Et[5],lt=(Et[8]-1)/Et[0],dt=(kt[8]+1)/kt[0],Vt=re*lt,Lt=re*dt,qt=zt/(-lt+dt),Jt=qt*-lt;if(K.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX(Jt),Y.translateZ(qt),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert(),Et[10]===-1)Y.projectionMatrix.copy(K.projectionMatrix),Y.projectionMatrixInverse.copy(K.projectionMatrixInverse);else{let N=re+qt,he=j+qt,ie=Vt-Jt,R=Lt+(zt-Jt),_=rt*j/he*N,O=ot*j/he*N;Y.projectionMatrix.makePerspective(ie,R,_,O,N,he),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}}function ht(Y,K){K===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices(K.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(n===null)return;let K=Y.near,pt=Y.far;g.texture!==null&&(g.depthNear>0&&(K=g.depthNear),g.depthFar>0&&(pt=g.depthFar)),k.near=D.near=I.near=K,k.far=D.far=I.far=pt,(P!==k.near||L!==k.far)&&(n.updateRenderState({depthNear:k.near,depthFar:k.far}),P=k.near,L=k.far),k.layers.mask=Y.layers.mask|6,I.layers.mask=k.layers.mask&-5,D.layers.mask=k.layers.mask&-3;let zt=Y.parent,Et=k.cameras;ht(k,zt);for(let kt=0;kt<Et.length;kt++)ht(Et[kt],zt);Et.length===2?tt(k,I,D):k.projectionMatrix.copy(I.projectionMatrix),A===null&&Y.isPerspectiveCamera&&(A={camera:Y,fov:Y.fov,zoom:Y.zoom}),at(Y,k,zt)};function at(Y,K,pt){pt===null?Y.matrix.copy(K.matrixWorld):(Y.matrix.copy(pt.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(K.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(K.projectionMatrix),Y.projectionMatrixInverse.copy(K.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=Hs*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return k},this.getFoveation=function(){if(!(u===null&&d===null))return l},this.setFoveation=function(Y){l=Y,u!==null&&(u.fixedFoveation=Y),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=Y)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(k)},this.getCameraTexture=function(Y){return p[Y]};let Ct=null;function Bt(Y,K){if(h=K.getViewerPose(c||a),m=K,h!==null){let pt=h.views;d!==null&&(t.setRenderTargetFramebuffer(v,d.framebuffer),t.setRenderTarget(v));let zt=!1;pt.length!==k.cameras.length&&(k.cameras.length=0,zt=!0);for(let j=0;j<pt.length;j++){let rt=pt[j],ot=null;if(d!==null)ot=d.getViewport(rt);else{let dt=f.getViewSubImage(u,rt);ot=dt.viewport,j===0&&(t.setRenderTargetTextures(v,dt.colorTexture,dt.depthStencilTexture),t.setRenderTarget(v))}let lt=B[j];lt===void 0&&(lt=new Ze,lt.layers.enable(j),lt.viewport=new Re,B[j]=lt),lt.matrix.fromArray(rt.transform.matrix),lt.matrix.decompose(lt.position,lt.quaternion,lt.scale),lt.projectionMatrix.fromArray(rt.projectionMatrix),lt.projectionMatrixInverse.copy(lt.projectionMatrix).invert(),lt.viewport.set(ot.x,ot.y,ot.width,ot.height),j===0&&(k.matrix.copy(lt.matrix),k.matrix.decompose(k.position,k.quaternion,k.scale)),zt===!0&&k.cameras.push(lt)}let Et=n.enabledFeatures;if(Et&&Et.includes("depth-sensing")&&n.depthUsage=="gpu-optimized"&&x){f=i.getBinding();let j=f.getDepthInformation(pt[0]);j&&j.isValid&&j.texture&&g.init(j,n.renderState)}if(Et&&Et.includes("camera-access")&&x){t.state.unbindTexture(),f=i.getBinding();for(let j=0;j<pt.length;j++){let rt=pt[j].camera;if(rt){let ot=p[rt];ot||(ot=new sa,p[rt]=ot);let lt=f.getCameraImage(rt);ot.sourceTexture=lt}}}}for(let pt=0;pt<T.length;pt++){let zt=E[pt],Et=T[pt];zt!==null&&Et!==void 0&&Et.update(zt,K,c||a)}Ct&&Ct(Y,K),K.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:K}),m=null}let Xt=new Qf;Xt.setAnimationLoop(Bt),this.setAnimationLoop=function(Y){Ct=Y},this.dispose=function(){}}},Py=new le,rp=new $t;rp.set(-1,0,0,0,1,0,0,0,1);function Iy(s,t){function e(g,p){g.matrixAutoUpdate===!0&&g.updateMatrix(),p.value.copy(g.matrix)}function i(g,p){p.color.getRGB(g.fogColor.value,Zh(s)),p.isFog?(g.fogNear.value=p.near,g.fogFar.value=p.far):p.isFogExp2&&(g.fogDensity.value=p.density)}function n(g,p,M,S,v){p.isNodeMaterial?p.uniformsNeedUpdate=!1:p.isMeshBasicMaterial?r(g,p):p.isMeshLambertMaterial?(r(g,p),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)):p.isMeshToonMaterial?(r(g,p),f(g,p)):p.isMeshPhongMaterial?(r(g,p),h(g,p),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)):p.isMeshStandardMaterial?(r(g,p),u(g,p),p.isMeshPhysicalMaterial&&d(g,p,v)):p.isMeshMatcapMaterial?(r(g,p),m(g,p)):p.isMeshDepthMaterial?r(g,p):p.isMeshDistanceMaterial?(r(g,p),x(g,p)):p.isMeshNormalMaterial?r(g,p):p.isLineBasicMaterial?(a(g,p),p.isLineDashedMaterial&&o(g,p)):p.isPointsMaterial?l(g,p,M,S):p.isSpriteMaterial?c(g,p):p.isShadowMaterial?(g.color.value.copy(p.color),g.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(g,p){g.opacity.value=p.opacity,p.color&&g.diffuse.value.copy(p.color),p.emissive&&g.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(g.map.value=p.map,e(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.bumpMap&&(g.bumpMap.value=p.bumpMap,e(p.bumpMap,g.bumpMapTransform),g.bumpScale.value=p.bumpScale,p.side===Ye&&(g.bumpScale.value*=-1)),p.normalMap&&(g.normalMap.value=p.normalMap,e(p.normalMap,g.normalMapTransform),g.normalScale.value.copy(p.normalScale),p.side===Ye&&g.normalScale.value.negate()),p.displacementMap&&(g.displacementMap.value=p.displacementMap,e(p.displacementMap,g.displacementMapTransform),g.displacementScale.value=p.displacementScale,g.displacementBias.value=p.displacementBias),p.emissiveMap&&(g.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,g.emissiveMapTransform)),p.specularMap&&(g.specularMap.value=p.specularMap,e(p.specularMap,g.specularMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest);let M=t.get(p),S=M.envMap,v=M.envMapRotation;S&&(g.envMap.value=S,g.envMapRotation.value.setFromMatrix4(Py.makeRotationFromEuler(v)).transpose(),S.isCubeTexture&&S.isRenderTargetTexture===!1&&g.envMapRotation.value.premultiply(rp),g.reflectivity.value=p.reflectivity,g.ior.value=p.ior,g.refractionRatio.value=p.refractionRatio),p.lightMap&&(g.lightMap.value=p.lightMap,g.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,g.lightMapTransform)),p.aoMap&&(g.aoMap.value=p.aoMap,g.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,g.aoMapTransform))}function a(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,p.map&&(g.map.value=p.map,e(p.map,g.mapTransform))}function o(g,p){g.dashSize.value=p.dashSize,g.totalSize.value=p.dashSize+p.gapSize,g.scale.value=p.scale}function l(g,p,M,S){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.size.value=p.size*M,g.scale.value=S*.5,p.map&&(g.map.value=p.map,e(p.map,g.uvTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function c(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.rotation.value=p.rotation,p.map&&(g.map.value=p.map,e(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function h(g,p){g.specular.value.copy(p.specular),g.shininess.value=Math.max(p.shininess,1e-4)}function f(g,p){p.gradientMap&&(g.gradientMap.value=p.gradientMap)}function u(g,p){g.metalness.value=p.metalness,p.metalnessMap&&(g.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,g.metalnessMapTransform)),g.roughness.value=p.roughness,p.roughnessMap&&(g.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,g.roughnessMapTransform)),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)}function d(g,p,M){g.ior.value=p.ior,p.sheen>0&&(g.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),g.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(g.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,g.sheenColorMapTransform)),p.sheenRoughnessMap&&(g.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,g.sheenRoughnessMapTransform))),p.clearcoat>0&&(g.clearcoat.value=p.clearcoat,g.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(g.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,g.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(g.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Ye&&g.clearcoatNormalScale.value.negate())),p.dispersion>0&&(g.dispersion.value=p.dispersion),p.retroreflectivity>0&&(g.retroreflectivity.value=p.retroreflectivity),p.iridescence>0&&(g.iridescence.value=p.iridescence,g.iridescenceIOR.value=p.iridescenceIOR,g.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(g.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,g.iridescenceMapTransform)),p.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),p.transmission>0&&(g.transmission.value=p.transmission,g.transmissionSamplerMap.value=M.texture,g.transmissionSamplerSize.value.set(M.width,M.height),p.transmissionMap&&(g.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,g.transmissionMapTransform)),g.thickness.value=p.thickness,p.thicknessMap&&(g.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=p.attenuationDistance,g.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(g.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(g.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=p.specularIntensity,g.specularColor.value.copy(p.specularColor),p.specularColorMap&&(g.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,g.specularColorMapTransform)),p.specularIntensityMap&&(g.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,g.specularIntensityMapTransform))}function m(g,p){p.matcap&&(g.matcap.value=p.matcap)}function x(g,p){let M=t.get(p).light;g.referencePosition.value.setFromMatrixPosition(M.matrixWorld),g.nearDistance.value=M.shadow.camera.near,g.farDistance.value=M.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:n}}function Ly(s,t,e,i){let n={},r={},a=[],o=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function l(v,T){let E=T.program;i.uniformBlockBinding(v,E)}function c(v,T){let E=n[v.id];E===void 0&&(g(v),E=h(v),n[v.id]=E,v.addEventListener("dispose",M));let C=T.program;i.updateUBOMapping(v,C);let y=t.render.frame;r[v.id]!==y&&(u(v),r[v.id]=y)}function h(v){let T=f();v.__bindingPointIndex=T;let E=s.createBuffer(),C=v.__size,y=v.usage;return s.bindBuffer(s.UNIFORM_BUFFER,E),s.bufferData(s.UNIFORM_BUFFER,C,y),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,T,E),E}function f(){for(let v=0;v<o;v++)if(a.indexOf(v)===-1)return a.push(v),v;return Wt("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(v){let T=n[v.id],E=v.uniforms,C=v.__cache;s.bindBuffer(s.UNIFORM_BUFFER,T);for(let y=0,A=E.length;y<A;y++){let I=E[y];if(Array.isArray(I))for(let D=0,B=I.length;D<B;D++)d(I[D],y,D,C);else d(I,y,0,C)}s.bindBuffer(s.UNIFORM_BUFFER,null)}function d(v,T,E,C){if(x(v,T,E,C)===!0){let y=v.__offset,A=v.value;if(Array.isArray(A)){let I=0;for(let D=0;D<A.length;D++){let B=A[D],k=p(B);m(B,v.__data,I),typeof B!="number"&&typeof B!="boolean"&&!B.isMatrix3&&!ArrayBuffer.isView(B)&&(I+=k.storage/Float32Array.BYTES_PER_ELEMENT)}}else m(A,v.__data,0);s.bufferSubData(s.UNIFORM_BUFFER,y,v.__data)}}function m(v,T,E){typeof v=="number"||typeof v=="boolean"?T[0]=v:v.isMatrix3?(T[0]=v.elements[0],T[1]=v.elements[1],T[2]=v.elements[2],T[3]=0,T[4]=v.elements[3],T[5]=v.elements[4],T[6]=v.elements[5],T[7]=0,T[8]=v.elements[6],T[9]=v.elements[7],T[10]=v.elements[8],T[11]=0):ArrayBuffer.isView(v)?T.set(new v.constructor(v.buffer,v.byteOffset,T.length)):v.toArray(T,E)}function x(v,T,E,C){let y=v.value,A=T+"_"+E;if(C[A]===void 0)return typeof y=="number"||typeof y=="boolean"?C[A]=y:ArrayBuffer.isView(y)?C[A]=y.slice():C[A]=y.clone(),!0;{let I=C[A];if(typeof y=="number"||typeof y=="boolean"){if(I!==y)return C[A]=y,!0}else{if(ArrayBuffer.isView(y))return!0;if(I.equals(y)===!1)return I.copy(y),!0}}return!1}function g(v){let T=v.uniforms,E=0,C=16;for(let A=0,I=T.length;A<I;A++){let D=Array.isArray(T[A])?T[A]:[T[A]];for(let B=0,k=D.length;B<k;B++){let P=D[B],L=Array.isArray(P.value)?P.value:[P.value];for(let W=0,z=L.length;W<z;W++){let $=L[W],X=p($),Q=E%C,tt=Q%X.boundary,ht=Q+tt;E+=tt,ht!==0&&C-ht<X.storage&&(E+=C-ht),P.__data=new Float32Array(X.storage/Float32Array.BYTES_PER_ELEMENT),P.__offset=E,E+=X.storage}}}let y=E%C;return y>0&&(E+=C-y),v.__size=E,v.__cache={},this}function p(v){let T={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(T.boundary=4,T.storage=4):v.isVector2?(T.boundary=8,T.storage=8):v.isVector3||v.isColor?(T.boundary=16,T.storage=12):v.isVector4?(T.boundary=16,T.storage=16):v.isMatrix3?(T.boundary=48,T.storage=48):v.isMatrix4?(T.boundary=64,T.storage=64):v.isTexture?Gt("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(v)?(T.boundary=16,T.storage=v.byteLength):Gt("WebGLRenderer: Unsupported uniform value type.",v),T}function M(v){let T=v.target;T.removeEventListener("dispose",M);let E=a.indexOf(T.__bindingPointIndex);a.splice(E,1),s.deleteBuffer(n[T.id]),delete n[T.id],delete r[T.id]}function S(){for(let v in n)s.deleteBuffer(n[v]);a=[],n={},r={}}return{bind:l,update:c,dispose:S}}var Dy=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),nn=null;function Ny(){return nn===null&&(nn=new ta(Dy,16,16,Hn,ke),nn.name="DFG_LUT",nn.minFilter=Ke,nn.magFilter=Ke,nn.wrapS=Ji,nn.wrapT=Ji,nn.generateMipmaps=!1,nn.needsUpdate=!0),nn}var fc=class{constructor(t={}){let{canvas:e=yf(),context:i=null,depth:n=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:f=!1,reversedDepthBuffer:u=!1,outputBufferType:d=gi}=t;this.isWebGLRenderer=!0;let m;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=i.getContextAttributes().alpha}else m=a;let x=d,g=new Set([Pl,Cl,Rl]),p=new Set([gi,Gi,Qs,tr,El,wl]),M=new Uint32Array(4),S=new Int32Array(4),v=new w,T=null,E=null,C=[],y=[],A=null;this.domElement=e,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Hi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let I=this,D=!1,B=null,k=null,P=null,L=null;this._outputColorSpace=We;let W=0,z=0,$=null,X=-1,Q=null,tt=new Re,ht=new Re,at=null,Ct=new ct(0),Bt=0,Xt=e.width,Y=e.height,K=1,pt=null,zt=null,Et=new Re(0,0,Xt,Y),kt=new Re(0,0,Xt,Y),re=!1,j=new qs,rt=!1,ot=!1,lt=new le,dt=new w,Vt=new Re,Lt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},qt=!1;function Jt(){return $===null?K:1}let N=i;function he(b,U){return e.getContext(b,U)}let ie,R,_,O,G,J,ut,mt,Z,it,gt,Ut,yt,xt,Ft,Ht,Zt,F,_t,et,vt,wt,st;try{let b={alpha:!0,depth:n,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:f};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${"186"}`),e.addEventListener("webglcontextlost",Me,!1),e.addEventListener("webglcontextrestored",ue,!1),e.addEventListener("webglcontextcreationerror",Ni,!1),N===null){let U="webgl2";if(N=he(U,b),N===null)throw he(U)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}Ot()}catch(b){throw e.removeEventListener("webglcontextlost",Me,!1),e.removeEventListener("webglcontextrestored",ue,!1),e.removeEventListener("webglcontextcreationerror",Ni,!1),Wt("WebGLRenderer: "+b.message),b}function Ot(){ie=new V_(N),ie.init(),vt=new Ay(N,ie),R=new I_(N,ie,t,vt),_=new Ey(N,ie),R.reversedDepthBuffer&&u&&_.buffers.depth.setReversed(!0),k=N.createFramebuffer(),P=N.createFramebuffer(),L=N.createFramebuffer(),O=new W_(N),G=new uy,J=new wy(N,ie,_,G,R,vt,O),ut=new k_(I),mt=new q0(N),wt=new C_(N,mt),Z=new H_(N,mt,O,wt),it=new q_(N,Z,mt,wt,O),F=new X_(N,R,J),Ft=new L_(G),gt=new hy(I,ut,ie,R,wt,Ft),Ut=new Iy(I,G),yt=new fy,xt=new vy(ie),Zt=new R_(I,ut,_,it,m,l),Ht=new Ty(I,it,R),st=new Ly(N,O,R,_),_t=new P_(N,ie,O),et=new G_(N,ie,O),O.programs=gt.programs,I.capabilities=R,I.extensions=ie,I.properties=G,I.renderLists=yt,I.shadowMap=Ht,I.state=_,I.info=O}x!==gi&&(A=new $_(x,e.width,e.height,o,n,r));let Dt=new vu(I,N);this.xr=Dt,this.getContext=function(){return N},this.getContextAttributes=function(){return N.getContextAttributes()},this.forceContextLoss=function(){let b=ie.get("WEBGL_lose_context");b&&b.loseContext()},this.forceContextRestore=function(){let b=ie.get("WEBGL_lose_context");b&&b.restoreContext()},this.getPixelRatio=function(){return K},this.setPixelRatio=function(b){b!==void 0&&(K=b,this.setSize(Xt,Y,!1))},this.getSize=function(b){return b.set(Xt,Y)},this.setSize=function(b,U,q=!0){if(Dt.isPresenting){Gt("WebGLRenderer: Can't change size while VR device is presenting.");return}Xt=b,Y=U,e.width=Math.floor(b*K),e.height=Math.floor(U*K),q===!0&&(e.style.width=b+"px",e.style.height=U+"px"),A!==null&&A.setSize(e.width,e.height),this.setViewport(0,0,b,U)},this.getDrawingBufferSize=function(b){return b.set(Xt*K,Y*K).floor()},this.setDrawingBufferSize=function(b,U,q){Xt=b,Y=U,K=q,e.width=Math.floor(b*q),e.height=Math.floor(U*q),this.setViewport(0,0,b,U)},this.setEffects=function(b){if(x===gi){Wt("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(b){for(let U=0;U<b.length;U++)if(b[U].isOutputPass===!0){Gt("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}A.setEffects(b||[])},this.getCurrentViewport=function(b){return b.copy(tt)},this.getViewport=function(b){return b.copy(Et)},this.setViewport=function(b,U,q,V){b.isVector4?Et.set(b.x,b.y,b.z,b.w):Et.set(b,U,q,V),_.viewport(tt.copy(Et).multiplyScalar(K).round())},this.getScissor=function(b){return b.copy(kt)},this.setScissor=function(b,U,q,V){b.isVector4?kt.set(b.x,b.y,b.z,b.w):kt.set(b,U,q,V),_.scissor(ht.copy(kt).multiplyScalar(K).round())},this.getScissorTest=function(){return re},this.setScissorTest=function(b){_.setScissorTest(re=b)},this.setOpaqueSort=function(b){pt=b},this.setTransparentSort=function(b){zt=b},this.getClearColor=function(b){return b.copy(Zt.getClearColor())},this.setClearColor=function(){Zt.setClearColor(...arguments)},this.getClearAlpha=function(){return Zt.getClearAlpha()},this.setClearAlpha=function(){Zt.setClearAlpha(...arguments)},this.clear=function(b=!0,U=!0,q=!0){let V=0;if(b){let H=!1;if($!==null){let Tt=$.texture.format;H=g.has(Tt)}if(H){let Tt=$.texture.type,Rt=p.has(Tt),bt=Zt.getClearColor(),Pt=Zt.getClearAlpha(),Nt=bt.r,Kt=bt.g,ne=bt.b;Rt?(M[0]=Nt,M[1]=Kt,M[2]=ne,M[3]=Pt,N.clearBufferuiv(N.COLOR,0,M)):(S[0]=Nt,S[1]=Kt,S[2]=ne,S[3]=Pt,N.clearBufferiv(N.COLOR,0,S))}else V|=N.COLOR_BUFFER_BIT}U&&(V|=N.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),q&&(V|=N.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),V!==0&&N.clear(V)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(b){b.setRenderer(this),B=b},this.dispose=function(){e.removeEventListener("webglcontextlost",Me,!1),e.removeEventListener("webglcontextrestored",ue,!1),e.removeEventListener("webglcontextcreationerror",Ni,!1),Zt.dispose(),yt.dispose(),xt.dispose(),G.dispose(),ut.dispose(),it.dispose(),wt.dispose(),st.dispose(),gt.dispose(),Dt.dispose(),Dt.removeEventListener("sessionstart",Ku),Dt.removeEventListener("sessionend",ju),Jn.stop()};function Me(b){b.preventDefault(),Xr("WebGLRenderer: Context Lost."),D=!0}function ue(){Xr("WebGLRenderer: Context Restored."),D=!1;let b=O.autoReset,U=Ht.enabled,q=Ht.autoUpdate,V=Ht.needsUpdate,H=Ht.type;Ot(),O.autoReset=b,Ht.enabled=U,Ht.autoUpdate=q,Ht.needsUpdate=V,Ht.type=H}function Ni(b){Wt("WebGLRenderer: A WebGL context could not be created. Reason: ",b.statusMessage)}function qi(b){let U=b.target;U.removeEventListener("dispose",qi),fm(U)}function fm(b){pm(b),G.remove(b)}function pm(b){let U=G.get(b).programs;U!==void 0&&(U.forEach(function(q){gt.releaseProgram(q)}),b.isShaderMaterial&&gt.releaseShaderCache(b))}this.renderBufferDirect=function(b,U,q,V,H,Tt){U===null&&(U=Lt);let Rt=H.isMesh&&H.matrixWorld.determinantAffine()<0,bt=xm(b,U,q,V,H);_.setMaterial(V,Rt);let Pt=q.index,Nt=1;if(V.wireframe===!0){if(Pt=Z.getWireframeAttribute(q),Pt===void 0)return;Nt=2}let Kt=q.drawRange,ne=q.attributes.position,It=Kt.start*Nt,de=(Kt.start+Kt.count)*Nt;Tt!==null&&(It=Math.max(It,Tt.start*Nt),de=Math.min(de,(Tt.start+Tt.count)*Nt)),Pt!==null?(It=Math.max(It,0),de=Math.min(de,Pt.count)):ne!=null&&(It=Math.max(It,0),de=Math.min(de,ne.count));let Be=de-It;if(Be<0||Be===1/0)return;wt.setup(H,V,bt,q,Pt);let Te,ye=_t;if(Pt!==null&&(Te=mt.get(Pt),ye=et,ye.setIndex(Te)),H.isMesh)V.wireframe===!0?(_.setLineWidth(V.wireframeLinewidth*Jt()),ye.setMode(N.LINES)):ye.setMode(N.TRIANGLES);else if(H.isLine){let ti=V.linewidth;ti===void 0&&(ti=1),_.setLineWidth(ti*Jt()),H.isLineSegments?ye.setMode(N.LINES):H.isLineLoop?ye.setMode(N.LINE_LOOP):ye.setMode(N.LINE_STRIP)}else H.isPoints?ye.setMode(N.POINTS):H.isSprite&&ye.setMode(N.TRIANGLES);if(H.isBatchedMesh)if(ie.get("WEBGL_multi_draw"))ye.renderMultiDraw(H._multiDrawStarts,H._multiDrawCounts,H._multiDrawCount);else{let ti=H._multiDrawStarts,At=H._multiDrawCounts,li=H._multiDrawCount,oe=Pt?mt.get(Pt).bytesPerElement:1,wi=G.get(V).currentProgram.getUniforms();for(let Yi=0;Yi<li;Yi++)wi.setValue(N,"_gl_DrawID",Yi),ye.render(ti[Yi]/oe,At[Yi])}else if(H.isInstancedMesh)ye.renderInstances(It,Be,H.count);else if(q.isInstancedBufferGeometry){let ti=q._maxInstanceCount!==void 0?q._maxInstanceCount:1/0,At=Math.min(q.instanceCount,ti);ye.renderInstances(It,Be,At)}else ye.render(It,Be)};function Zu(b,U,q,V){B!==null&&b.isNodeMaterial&&B.setObject(V,b),rt===!0&&Ft.setState(b,q,!1),b.transparent===!0&&b.side===ze&&b.forceSinglePass===!1?(b.side=Ye,b.needsUpdate=!0,oo(b,U,V),b.side=Bn,b.needsUpdate=!0,oo(b,U,V),b.side=ze):oo(b,U,V)}this.compile=function(b,U,q=null){q===null&&(q=b),B!==null&&B.renderStart(b,U,q),E=xt.get(q),E.init(U),y.push(E),q.traverseVisible(function(H){H.isLight&&H.layers.test(U.layers)&&(E.pushLight(H),H.castShadow&&E.pushShadow(H))}),b!==q&&b.traverseVisible(function(H){H.isLight&&H.layers.test(U.layers)&&(E.pushLight(H),H.castShadow&&E.pushShadow(H))}),E.setupLights(),B!==null&&B.updateLights(E.state.lightsArray),ot=this.localClippingEnabled,rt=Ft.init(this.clippingPlanes,ot),rt===!0&&Ft.setGlobalState(this.clippingPlanes,U),B!==null&&Ht.render(E.state.shadowsArray,q,U);let V=new Set;return b.traverse(function(H){if(!(H.isMesh||H.isPoints||H.isLine||H.isSprite))return;let Tt=H.material;if(Tt)if(Array.isArray(Tt))for(let Rt=0;Rt<Tt.length;Rt++){let bt=Tt[Rt];Zu(bt,q,U,H),V.add(bt)}else Zu(Tt,q,U,H),V.add(Tt)}),E=y.pop(),B!==null&&B.renderEnd(),V},this.compileAsync=function(b,U,q=null){let V=this.compile(b,U,q);return new Promise(H=>{function Tt(){if(V.forEach(function(Rt){let Pt=G.get(Rt).currentProgram;(Pt===void 0||Pt.isReady())&&V.delete(Rt)}),V.size===0){H(b);return}setTimeout(Tt,10)}ie.get("KHR_parallel_shader_compile")!==null?Tt():setTimeout(Tt,10)})};let $c=null;function mm(b){$c&&$c(b)}function Ku(){Jn.stop()}function ju(){Jn.start()}let Jn=new Qf;Jn.setAnimationLoop(mm),typeof self<"u"&&Jn.setContext(self),this.setAnimationLoop=function(b){$c=b,Dt.setAnimationLoop(b),b===null?Jn.stop():Jn.start()},Dt.addEventListener("sessionstart",Ku),Dt.addEventListener("sessionend",ju),this.render=function(b,U){if(U!==void 0&&U.isCamera!==!0){Wt("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(D===!0)return;B!==null&&B.renderStart(b,U);let q=Dt.enabled===!0&&Dt.isPresenting===!0,V=A!==null&&($===null||q)&&A.begin(I,$);if(b.matrixWorldAutoUpdate===!0&&b.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),Dt.enabled===!0&&Dt.isPresenting===!0&&(A===null||A.isCompositing()===!1)&&(Dt.cameraAutoUpdate===!0&&Dt.updateCamera(U),U=Dt.getCamera()),b.isScene===!0&&b.onBeforeRender(I,b,U,$),E=xt.get(b,y.length),E.init(U),E.state.textureUnits=J.getTextureUnits(),y.push(E),lt.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),j.setFromProjectionMatrix(lt,ki,U.reversedDepth),ot=this.localClippingEnabled,rt=Ft.init(this.clippingPlanes,ot),T=yt.get(b,C.length),T.init(),C.push(T),Dt.enabled===!0&&Dt.isPresenting===!0){let Rt=I.xr.getDepthSensingMesh();Rt!==null&&Jc(Rt,U,-1/0,I.sortObjects)}Jc(b,U,0,I.sortObjects),T.finish(),B!==null&&B.updateLights(E.state.lightsArray),I.sortObjects===!0&&T.sort(pt,zt),qt=Dt.enabled===!1||Dt.isPresenting===!1||Dt.hasDepthSensing()===!1,qt&&Zt.addToRenderList(T,b),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),rt===!0&&Ft.beginShadows();let H=E.state.shadowsArray;if(Ht.render(H,b,U),rt===!0&&Ft.endShadows(),(V&&A.hasRenderPass())===!1){let Rt=T.opaque,bt=T.transmissive;if(E.setupLights(),U.isArrayCamera){let Pt=U.cameras;if(bt.length>0)for(let Nt=0,Kt=Pt.length;Nt<Kt;Nt++){let ne=Pt[Nt];td(Rt,bt,b,ne)}qt&&Zt.render(b);for(let Nt=0,Kt=Pt.length;Nt<Kt;Nt++){let ne=Pt[Nt];Qu(T,b,ne,ne.viewport)}}else bt.length>0&&td(Rt,bt,b,U),qt&&Zt.render(b),Qu(T,b,U)}$!==null&&z===0&&(J.updateMultisampleRenderTarget($),J.updateRenderTargetMipmap($)),V&&A.end(I),b.isScene===!0&&b.onAfterRender(I,b,U),wt.resetDefaultState(),X=-1,Q=null,y.pop(),y.length>0?(E=y[y.length-1],J.setTextureUnits(E.state.textureUnits),rt===!0&&Ft.setGlobalState(I.clippingPlanes,E.state.camera)):E=null,C.pop(),C.length>0?T=C[C.length-1]:T=null,B!==null&&B.renderEnd()};function Jc(b,U,q,V){if(b.visible===!1)return;if(b.layers.test(U.layers)){if(b.isGroup)q=b.renderOrder;else if(b.isLOD)b.autoUpdate===!0&&b.update(U);else if(b.isLightProbeGrid)E.pushLightProbeGrid(b);else if(b.isLight)E.pushLight(b),b.castShadow&&E.pushShadow(b);else if(b.isSprite){if(!b.frustumCulled||b.intersectsFrustum(j)){V&&Vt.setFromMatrixPosition(b.matrixWorld).applyMatrix4(lt);let Rt=it.update(b),bt=b.material;bt.visible&&T.push(b,Rt,bt,q,Vt.z,null,U)}}else if((b.isMesh||b.isLine||b.isPoints)&&(!b.frustumCulled||b.intersectsFrustum(j))){let Rt=it.update(b),bt=b.material;if(V&&(b.boundingSphere!==void 0?(b.boundingSphere===null&&b.computeBoundingSphere(),Vt.copy(b.boundingSphere.center)):(Rt.boundingSphere===null&&Rt.computeBoundingSphere(),Vt.copy(Rt.boundingSphere.center)),Vt.applyMatrix4(b.matrixWorld).applyMatrix4(lt)),Array.isArray(bt)){let Pt=Rt.groups;for(let Nt=0,Kt=Pt.length;Nt<Kt;Nt++){let ne=Pt[Nt],It=bt[ne.materialIndex];It&&It.visible&&T.push(b,Rt,It,q,Vt.z,ne,U)}}else bt.visible&&T.push(b,Rt,bt,q,Vt.z,null,U)}}let Tt=b.children;for(let Rt=0,bt=Tt.length;Rt<bt;Rt++)Jc(Tt[Rt],U,q,V)}function Qu(b,U,q,V){let{opaque:H,transmissive:Tt,transparent:Rt}=b;E.setupLightsView(q),rt===!0&&Ft.setGlobalState(I.clippingPlanes,q),V&&_.viewport(tt.copy(V)),H.length>0&&ao(H,U,q),Tt.length>0&&ao(Tt,U,q),Rt.length>0&&ao(Rt,U,q),_.buffers.depth.setTest(!0),_.buffers.depth.setMask(!0),_.buffers.color.setMask(!0),_.setPolygonOffset(!1)}function td(b,U,q,V){if((q.isScene===!0?q.overrideMaterial:null)!==null)return;if(E.state.transmissionRenderTarget[V.id]===void 0){let It=ie.has("EXT_color_buffer_half_float")||ie.has("EXT_color_buffer_float");E.state.transmissionRenderTarget[V.id]=new Le(1,1,{generateMipmaps:!0,type:It?ke:gi,minFilter:kn,samples:Math.max(4,R.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:te.workingColorSpace})}let Tt=E.state.transmissionRenderTarget[V.id],Rt=V.viewport||tt;Tt.setSize(Rt.z*I.transmissionResolutionScale,Rt.w*I.transmissionResolutionScale);let bt=I.getRenderTarget(),Pt=I.getActiveCubeFace(),Nt=I.getActiveMipmapLevel();I.setRenderTarget(Tt),I.getClearColor(Ct),Bt=I.getClearAlpha(),Bt<1&&I.setClearColor(16777215,.5),I.clear(),qt&&Zt.render(q);let Kt=I.toneMapping;I.toneMapping=Hi;let ne=V.viewport;if(V.viewport!==void 0&&(V.viewport=void 0),E.setupLightsView(V),rt===!0&&Ft.setGlobalState(I.clippingPlanes,V),ao(b,q,V),J.updateMultisampleRenderTarget(Tt),J.updateRenderTargetMipmap(Tt),ie.has("WEBGL_multisampled_render_to_texture")===!1){let It=!1;for(let de=0,Be=U.length;de<Be;de++){let Te=U[de],{object:ye,geometry:ti,material:At,group:li}=Te;if(At.side===ze&&ye.layers.test(V.layers)){let oe=At.side;At.side=Ye,At.needsUpdate=!0,ed(ye,q,V,ti,At,li),At.side=oe,At.needsUpdate=!0,It=!0}}It===!0&&(J.updateMultisampleRenderTarget(Tt),J.updateRenderTargetMipmap(Tt))}I.setRenderTarget(bt,Pt,Nt),I.setClearColor(Ct,Bt),ne!==void 0&&(V.viewport=ne),I.toneMapping=Kt}function ao(b,U,q){let V=U.isScene===!0?U.overrideMaterial:null;for(let H=0,Tt=b.length;H<Tt;H++){let Rt=b[H],{object:bt,geometry:Pt,group:Nt}=Rt,Kt=Rt.material;Kt.allowOverride===!0&&V!==null&&(Kt=V),bt.layers.test(q.layers)&&ed(bt,U,q,Pt,Kt,Nt)}}function ed(b,U,q,V,H,Tt){B!==null&&H.isNodeMaterial&&B.setObject(b,H),b.onBeforeRender(I,U,q,V,H,Tt),b.modelViewMatrix.multiplyMatrices(q.matrixWorldInverse,b.matrixWorld),b.normalMatrix.getNormalMatrix(b.modelViewMatrix),H.onBeforeRender(I,U,q,V,b,Tt),H.transparent===!0&&H.side===ze&&H.forceSinglePass===!1?(H.side=Ye,H.needsUpdate=!0,I.renderBufferDirect(q,U,V,H,b,Tt),H.side=Bn,H.needsUpdate=!0,I.renderBufferDirect(q,U,V,H,b,Tt),H.side=ze):I.renderBufferDirect(q,U,V,H,b,Tt),b.onAfterRender(I,U,q,V,H,Tt)}function oo(b,U,q){U.isScene!==!0&&(U=Lt);let V=G.get(b),H=E.state.lights,Tt=E.state.shadowsArray,Rt=H.state.version,bt=gt.getParameters(b,H.state,Tt,U,q,E.state.lightProbeGridArray),Pt=gt.getProgramCacheKey(bt),Nt=V.programs;V.environment=b.isMeshStandardMaterial||b.isMeshLambertMaterial||b.isMeshPhongMaterial?U.environment:null,V.fog=U.fog;let Kt=b.isMeshStandardMaterial||b.isMeshLambertMaterial&&!b.envMap||b.isMeshPhongMaterial&&!b.envMap;V.envMap=ut.get(b.envMap||V.environment,Kt),V.envMapRotation=V.environment!==null&&b.envMap===null?U.environmentRotation:b.envMapRotation,Nt===void 0&&(b.addEventListener("dispose",qi),Nt=new Map,V.programs=Nt);let ne=Nt.get(Pt);if(ne!==void 0){if(V.currentProgram===ne&&V.lightsStateVersion===Rt)return nd(b,bt),ne}else bt.uniforms=gt.getUniforms(b),B!==null&&b.isNodeMaterial&&B.build(b,q,bt),b.onBeforeCompile(bt,I),ne=gt.acquireProgram(bt,Pt),Nt.set(Pt,ne),V.uniforms=bt.uniforms;let It=V.uniforms;return(!b.isShaderMaterial&&!b.isRawShaderMaterial||b.clipping===!0)&&(It.clippingPlanes=Ft.uniform),nd(b,bt),V.needsLights=vm(b),V.lightsStateVersion=Rt,V.needsLights&&(It.ambientLightColor.value=H.state.ambient,It.lightProbe.value=H.state.probe,It.sunLights.value=H.state.sun,It.sunLightShadows.value=H.state.sunShadow,It.directionalLights.value=H.state.directional,It.directionalLightShadows.value=H.state.directionalShadow,It.spotLights.value=H.state.spot,It.spotLightShadows.value=H.state.spotShadow,It.rectAreaLights.value=H.state.rectArea,It.ltc_1.value=H.state.rectAreaLTC1,It.ltc_2.value=H.state.rectAreaLTC2,It.pointLights.value=H.state.point,It.pointLightShadows.value=H.state.pointShadow,It.hemisphereLights.value=H.state.hemi,It.sunShadowMatrix.value=H.state.sunShadowMatrix,It.sunShadowCascade.value=H.state.sunShadowCascade,It.directionalShadowMatrix.value=H.state.directionalShadowMatrix,It.spotLightMatrix.value=H.state.spotLightMatrix,It.spotLightMap.value=H.state.spotLightMap,It.pointShadowMatrix.value=H.state.pointShadowMatrix),V.lightProbeGrid=E.state.lightProbeGridArray.length>0,V.currentProgram=ne,V.uniformsList=null,ne}function id(b){if(b.uniformsList===null){let U=b.currentProgram.getUniforms();b.uniformsList=sr.seqWithValue(U.seq,b.uniforms)}return b.uniformsList}function nd(b,U){let q=G.get(b);q.outputColorSpace=U.outputColorSpace,q.batching=U.batching,q.batchingColor=U.batchingColor,q.instancing=U.instancing,q.instancingColor=U.instancingColor,q.instancingMorph=U.instancingMorph,q.skinning=U.skinning,q.morphTargets=U.morphTargets,q.morphNormals=U.morphNormals,q.morphColors=U.morphColors,q.morphTargetsCount=U.morphTargetsCount,q.numClippingPlanes=U.numClippingPlanes,q.numIntersection=U.numClipIntersection,q.vertexAlphas=U.vertexAlphas,q.vertexTangents=U.vertexTangents,q.toneMapping=U.toneMapping}function gm(b,U){if(b.length===0)return null;if(b.length===1)return b[0].texture!==null?b[0]:null;v.setFromMatrixPosition(U.matrixWorld);for(let q=0,V=b.length;q<V;q++){let H=b[q];if(H.texture!==null&&H.boundingBox.containsPoint(v))return H}return null}function xm(b,U,q,V,H){U.isScene!==!0&&(U=Lt),J.resetTextureUnits();let Tt=U.fog,Rt=V.isMeshStandardMaterial||V.isMeshLambertMaterial||V.isMeshPhongMaterial?U.environment:null,bt=$===null?I.outputColorSpace:$.isXRRenderTarget===!0?$.texture.colorSpace:te.workingColorSpace,Pt=V.isMeshStandardMaterial||V.isMeshLambertMaterial&&!V.envMap||V.isMeshPhongMaterial&&!V.envMap,Nt=ut.get(V.envMap||Rt,Pt),Kt=V.vertexColors===!0&&!!q.attributes.color&&q.attributes.color.itemSize===4,ne=!!q.attributes.tangent&&(!!V.normalMap||V.anisotropy>0),It=!!q.morphAttributes.position,de=!!q.morphAttributes.normal,Be=!!q.morphAttributes.color,Te=Hi;V.toneMapped&&($===null||$.isXRRenderTarget===!0)&&(Te=I.toneMapping);let ye=q.morphAttributes.position||q.morphAttributes.normal||q.morphAttributes.color,ti=ye!==void 0?ye.length:0,At=G.get(V),li=E.state.lights;if(rt===!0&&(ot===!0||b!==Q)){let be=b===Q&&V.id===X;Ft.setState(V,b,be)}let oe=!1;V.version===At.__version?(At.needsLights&&At.lightsStateVersion!==li.state.version||At.outputColorSpace!==bt||H.isBatchedMesh&&At.batching===!1||!H.isBatchedMesh&&At.batching===!0||H.isBatchedMesh&&At.batchingColor===!0&&H._colorsTexture===null||H.isBatchedMesh&&At.batchingColor===!1&&H._colorsTexture!==null||H.isInstancedMesh&&At.instancing===!1||!H.isInstancedMesh&&At.instancing===!0||H.isSkinnedMesh&&At.skinning===!1||!H.isSkinnedMesh&&At.skinning===!0||H.isInstancedMesh&&At.instancingColor===!0&&H.instanceColor===null||H.isInstancedMesh&&At.instancingColor===!1&&H.instanceColor!==null||H.isInstancedMesh&&At.instancingMorph===!0&&H.morphTexture===null||H.isInstancedMesh&&At.instancingMorph===!1&&H.morphTexture!==null||At.envMap!==Nt||V.fog===!0&&At.fog!==Tt||At.numClippingPlanes!==void 0&&(At.numClippingPlanes!==Ft.numPlanes||At.numIntersection!==Ft.numIntersection)||At.vertexAlphas!==Kt||At.vertexTangents!==ne||At.morphTargets!==It||At.morphNormals!==de||At.morphColors!==Be||At.toneMapping!==Te||At.morphTargetsCount!==ti||!!At.lightProbeGrid!=E.state.lightProbeGridArray.length>0)&&(oe=!0):(oe=!0,At.__version=V.version);let wi=At.currentProgram;oe===!0&&(wi=oo(V,U,H),B&&V.isNodeMaterial&&B.onUpdateProgram(V,wi,At));let Yi=!1,Sn=!1,_s=!1,_e=wi.getUniforms(),Ne=At.uniforms;if(_.useProgram(wi.program)&&(Yi=!0,Sn=!0,_s=!0),V.id!==X&&(X=V.id,Sn=!0),At.needsLights){let be=gm(E.state.lightProbeGridArray,H);At.lightProbeGrid!==be&&(At.lightProbeGrid=be,Sn=!0)}if(Yi||Q!==b){_.buffers.depth.getReversed()&&b.reversedDepth!==!0&&(b._reversedDepth=!0,b.updateProjectionMatrix()),_e.setValue(N,"projectionMatrix",b.projectionMatrix),_e.setValue(N,"viewMatrix",b.matrixWorldInverse);let En=_e.map.cameraPosition;En!==void 0&&En.setValue(N,dt.setFromMatrixPosition(b.matrixWorld)),R.logarithmicDepthBuffer&&_e.setValue(N,"logDepthBufFC",2/(Math.log(b.far+1)/Math.LN2)),(V.isMeshPhongMaterial||V.isMeshToonMaterial||V.isMeshLambertMaterial||V.isMeshBasicMaterial||V.isMeshStandardMaterial||V.isShaderMaterial)&&_e.setValue(N,"isOrthographic",b.isOrthographicCamera===!0),Q!==b&&(Q=b,Sn=!0,_s=!0)}if(At.needsLights&&(li.state.sunShadowMap.length>0&&_e.setValue(N,"sunShadowMap",li.state.sunShadowMap,J),li.state.directionalShadowMap.length>0&&_e.setValue(N,"directionalShadowMap",li.state.directionalShadowMap,J),li.state.spotShadowMap.length>0&&_e.setValue(N,"spotShadowMap",li.state.spotShadowMap,J),li.state.pointShadowMap.length>0&&_e.setValue(N,"pointShadowMap",li.state.pointShadowMap,J)),H.isSkinnedMesh){_e.setOptional(N,H,"bindMatrix"),_e.setOptional(N,H,"bindMatrixInverse");let be=H.skeleton;be&&(be.boneTexture===null&&be.computeBoneTexture(),_e.setValue(N,"boneTexture",be.boneTexture,J))}H.isBatchedMesh&&(_e.setOptional(N,H,"batchingTexture"),_e.setValue(N,"batchingTexture",H._matricesTexture,J),_e.setOptional(N,H,"batchingIdTexture"),_e.setValue(N,"batchingIdTexture",H._indirectTexture,J),_e.setOptional(N,H,"batchingColorTexture"),H._colorsTexture!==null&&_e.setValue(N,"batchingColorTexture",H._colorsTexture,J));let Tn=q.morphAttributes;if((Tn.position!==void 0||Tn.normal!==void 0||Tn.color!==void 0)&&F.update(H,q,wi),(Sn||At.receiveShadow!==H.receiveShadow)&&(At.receiveShadow=H.receiveShadow,_e.setValue(N,"receiveShadow",H.receiveShadow)),(V.isMeshStandardMaterial||V.isMeshLambertMaterial||V.isMeshPhongMaterial)&&V.envMap===null&&U.environment!==null&&(Ne.envMapIntensity.value=U.environmentIntensity),Ne.dfgLUT!==void 0&&(Ne.dfgLUT.value=Ny()),Sn){if(_e.setValue(N,"toneMappingExposure",I.toneMappingExposure),At.needsLights&&_m(Ne,_s),Tt&&V.fog===!0&&Ut.refreshFogUniforms(Ne,Tt),Ut.refreshMaterialUniforms(Ne,V,K,Y,E.state.transmissionRenderTarget[b.id]),At.needsLights&&At.lightProbeGrid){let be=At.lightProbeGrid;Ne.probesSH.value=be.texture,Ne.probesMin.value.copy(be.boundingBox.min),Ne.probesMax.value.copy(be.boundingBox.max),Ne.probesResolution.value.copy(be.resolution)}sr.upload(N,id(At),Ne,J)}if(V.isShaderMaterial&&V.uniformsNeedUpdate===!0&&(sr.upload(N,id(At),Ne,J),V.uniformsNeedUpdate=!1),V.isSpriteMaterial&&_e.setValue(N,"center",H.center),_e.setValue(N,"modelViewMatrix",H.modelViewMatrix),_e.setValue(N,"normalMatrix",H.normalMatrix),_e.setValue(N,"modelMatrix",H.matrixWorld),V.uniformsGroups!==void 0){let be=V.uniformsGroups;for(let En=0,vs=be.length;En<vs;En++){let rd=be[En];st.update(rd,wi),st.bind(rd,wi)}}return wi}function _m(b,U){b.ambientLightColor.needsUpdate=U,b.lightProbe.needsUpdate=U,b.sunLights.needsUpdate=U,b.sunLightShadows.needsUpdate=U,b.directionalLights.needsUpdate=U,b.directionalLightShadows.needsUpdate=U,b.pointLights.needsUpdate=U,b.pointLightShadows.needsUpdate=U,b.spotLights.needsUpdate=U,b.spotLightShadows.needsUpdate=U,b.rectAreaLights.needsUpdate=U,b.hemisphereLights.needsUpdate=U}function vm(b){return b.isMeshLambertMaterial||b.isMeshToonMaterial||b.isMeshPhongMaterial||b.isMeshStandardMaterial||b.isShadowMaterial||b.isShaderMaterial&&b.lights===!0}this.getActiveCubeFace=function(){return W},this.getActiveMipmapLevel=function(){return z},this.getRenderTarget=function(){return $},this.setRenderTargetTextures=function(b,U,q){let V=G.get(b);V.__autoAllocateDepthBuffer=b.resolveDepthBuffer===!1,V.__autoAllocateDepthBuffer===!1&&(V.__useRenderToTexture=!1),G.get(b.texture).__webglTexture=U,G.get(b.depthTexture).__webglTexture=V.__autoAllocateDepthBuffer?void 0:q,V.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(b,U){let q=G.get(b);q.__webglFramebuffer=U,q.__useDefaultFramebuffer=U===void 0},this.setRenderTarget=function(b,U=0,q=0){$=b,W=U,z=q;let V=null,H=!1,Tt=!1;if(b){let bt=G.get(b);if(bt.__useDefaultFramebuffer!==void 0){_.bindFramebuffer(N.FRAMEBUFFER,bt.__webglFramebuffer),tt.copy(b.viewport),ht.copy(b.scissor),at=b.scissorTest,_.viewport(tt),_.scissor(ht),_.setScissorTest(at),X=-1;return}else if(bt.__webglFramebuffer===void 0)J.setupRenderTarget(b);else if(bt.__hasExternalTextures)J.rebindTextures(b,G.get(b.texture).__webglTexture,G.get(b.depthTexture).__webglTexture);else if(b.depthBuffer){let Kt=b.depthTexture;if(bt.__boundDepthTexture!==Kt){if(Kt!==null&&G.has(Kt)&&(b.width!==Kt.image.width||b.height!==Kt.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");J.setupDepthRenderbuffer(b)}}let Pt=b.texture;(Pt.isData3DTexture||Pt.isDataArrayTexture||Pt.isCompressedArrayTexture)&&(Tt=!0);let Nt=G.get(b).__webglFramebuffer;b.isWebGLCubeRenderTarget?(Array.isArray(Nt[U])?V=Nt[U][q]:V=Nt[U],H=!0):b.samples>0&&J.useMultisampledRTT(b)===!1?V=G.get(b).__webglMultisampledFramebuffer:Array.isArray(Nt)?V=Nt[q]:V=Nt,tt.copy(b.viewport),ht.copy(b.scissor),at=b.scissorTest}else tt.copy(Et).multiplyScalar(K).floor(),ht.copy(kt).multiplyScalar(K).floor(),at=re;if(q!==0&&(V=k),_.bindFramebuffer(N.FRAMEBUFFER,V)&&_.drawBuffers(b,V),_.viewport(tt),_.scissor(ht),_.setScissorTest(at),H){let bt=G.get(b.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_CUBE_MAP_POSITIVE_X+U,bt.__webglTexture,q)}else if(Tt){let bt=U;for(let Pt=0;Pt<b.textures.length;Pt++){let Nt=G.get(b.textures[Pt]);N.framebufferTextureLayer(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0+Pt,Nt.__webglTexture,q,bt)}}else if(b!==null&&q!==0){let bt=G.get(b.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,bt.__webglTexture,q)}X=-1};function sd(b){let U=G.get(b);return(U.__readFormat!==b.format||U.__readType!==b.type)&&(U.__readFormat=b.format,U.__readType=b.type,U.__formatReadable=R.textureFormatReadable(b.format),U.__typeReadable=R.textureTypeReadable(b.type)),U}this.readRenderTargetPixels=function(b,U,q,V,H,Tt,Rt,bt=0){if(!(b&&b.isWebGLRenderTarget)){Wt("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Pt=G.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&Rt!==void 0&&(Pt=Pt[Rt]),Pt){_.bindFramebuffer(N.FRAMEBUFFER,Pt);try{let Nt=b.textures[bt],Kt=Nt.format,ne=Nt.type;b.textures.length>1&&N.readBuffer(N.COLOR_ATTACHMENT0+bt);let It=sd(Nt);if(It.__formatReadable===!1){Wt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(It.__typeReadable===!1){Wt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=b.width-V&&q>=0&&q<=b.height-H&&N.readPixels(U,q,V,H,vt.convert(Kt),vt.convert(ne),Tt)}finally{let Nt=$!==null?G.get($).__webglFramebuffer:null;_.bindFramebuffer(N.FRAMEBUFFER,Nt)}}},this.readRenderTargetPixelsAsync=async function(b,U,q,V,H,Tt,Rt,bt=0){if(!(b&&b.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Pt=G.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&Rt!==void 0&&(Pt=Pt[Rt]),Pt)if(U>=0&&U<=b.width-V&&q>=0&&q<=b.height-H){_.bindFramebuffer(N.FRAMEBUFFER,Pt);let Nt=b.textures[bt],Kt=Nt.format,ne=Nt.type;b.textures.length>1&&N.readBuffer(N.COLOR_ATTACHMENT0+bt);let It=sd(Nt);if(It.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(It.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let de=N.createBuffer();N.bindBuffer(N.PIXEL_PACK_BUFFER,de),N.bufferData(N.PIXEL_PACK_BUFFER,Tt.byteLength,N.STREAM_READ),N.readPixels(U,q,V,H,vt.convert(Kt),vt.convert(ne),0),N.bindBuffer(N.PIXEL_PACK_BUFFER,null);let Be=$!==null?G.get($).__webglFramebuffer:null;_.bindFramebuffer(N.FRAMEBUFFER,Be);let Te=N.fenceSync(N.SYNC_GPU_COMMANDS_COMPLETE,0);return N.flush(),await bf(N,Te,4),N.bindBuffer(N.PIXEL_PACK_BUFFER,de),N.getBufferSubData(N.PIXEL_PACK_BUFFER,0,Tt),N.bindBuffer(N.PIXEL_PACK_BUFFER,null),N.deleteBuffer(de),N.deleteSync(Te),Tt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(b,U=null,q=0){let V=Math.pow(2,-q),H=Math.floor(b.image.width*V),Tt=Math.floor(b.image.height*V),Rt=U!==null?U.x:0,bt=U!==null?U.y:0;J.setTexture2D(b,0),N.copyTexSubImage2D(N.TEXTURE_2D,q,0,0,Rt,bt,H,Tt),_.unbindTexture()},this.copyTextureToTexture=function(b,U,q=null,V=null,H=0,Tt=0){let Rt,bt,Pt,Nt,Kt,ne,It,de,Be,Te=b.isCompressedTexture?b.mipmaps[Tt]:b.image;if(q!==null)Rt=q.max.x-q.min.x,bt=q.max.y-q.min.y,Pt=q.isBox3?q.max.z-q.min.z:1,Nt=q.min.x,Kt=q.min.y,ne=q.isBox3?q.min.z:0;else{let Ne=Math.pow(2,-H);Rt=Math.floor(Te.width*Ne),bt=Math.floor(Te.height*Ne),b.isDataArrayTexture?Pt=Te.depth:b.isData3DTexture?Pt=Math.floor(Te.depth*Ne):Pt=1,Nt=0,Kt=0,ne=0}V!==null?(It=V.x,de=V.y,Be=V.z):(It=0,de=0,Be=0);let ye=vt.convert(U.format),ti=vt.convert(U.type),At;U.isData3DTexture?(J.setTexture3D(U,0),At=N.TEXTURE_3D):U.isDataArrayTexture||U.isCompressedArrayTexture?(J.setTexture2DArray(U,0),At=N.TEXTURE_2D_ARRAY):(J.setTexture2D(U,0),At=N.TEXTURE_2D),_.activeTexture(N.TEXTURE0),_.pixelStorei(N.UNPACK_FLIP_Y_WEBGL,U.flipY),_.pixelStorei(N.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),_.pixelStorei(N.UNPACK_ALIGNMENT,U.unpackAlignment);let li=_.getParameter(N.UNPACK_ROW_LENGTH),oe=_.getParameter(N.UNPACK_IMAGE_HEIGHT),wi=_.getParameter(N.UNPACK_SKIP_PIXELS),Yi=_.getParameter(N.UNPACK_SKIP_ROWS),Sn=_.getParameter(N.UNPACK_SKIP_IMAGES);_.pixelStorei(N.UNPACK_ROW_LENGTH,Te.width),_.pixelStorei(N.UNPACK_IMAGE_HEIGHT,Te.height),_.pixelStorei(N.UNPACK_SKIP_PIXELS,Nt),_.pixelStorei(N.UNPACK_SKIP_ROWS,Kt),_.pixelStorei(N.UNPACK_SKIP_IMAGES,ne);let _s=b.isDataArrayTexture||b.isData3DTexture,_e=U.isDataArrayTexture||U.isData3DTexture;if(b.isDepthTexture){let Ne=G.get(b),Tn=G.get(U),be=G.get(Ne.__renderTarget),En=G.get(Tn.__renderTarget);_.bindFramebuffer(N.READ_FRAMEBUFFER,be.__webglFramebuffer),_.bindFramebuffer(N.DRAW_FRAMEBUFFER,En.__webglFramebuffer);for(let vs=0;vs<Pt;vs++)_s&&(N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,G.get(b).__webglTexture,H,ne+vs),N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,G.get(U).__webglTexture,Tt,Be+vs)),N.blitFramebuffer(Nt,Kt,Rt,bt,It,de,Rt,bt,N.DEPTH_BUFFER_BIT,N.NEAREST);_.bindFramebuffer(N.READ_FRAMEBUFFER,null),_.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else if(H!==0||b.isRenderTargetTexture||G.has(b)){let Ne=G.get(b),Tn=G.get(U);_.bindFramebuffer(N.READ_FRAMEBUFFER,P),_.bindFramebuffer(N.DRAW_FRAMEBUFFER,L);for(let be=0;be<Pt;be++)_s?N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,Ne.__webglTexture,H,ne+be):N.framebufferTexture2D(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,Ne.__webglTexture,H),_e?N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,Tn.__webglTexture,Tt,Be+be):N.framebufferTexture2D(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,Tn.__webglTexture,Tt),H!==0?N.blitFramebuffer(Nt,Kt,Rt,bt,It,de,Rt,bt,N.COLOR_BUFFER_BIT,N.NEAREST):_e?N.copyTexSubImage3D(At,Tt,It,de,Be+be,Nt,Kt,Rt,bt):N.copyTexSubImage2D(At,Tt,It,de,Nt,Kt,Rt,bt);_.bindFramebuffer(N.READ_FRAMEBUFFER,null),_.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else _e?b.isDataTexture||b.isData3DTexture?N.texSubImage3D(At,Tt,It,de,Be,Rt,bt,Pt,ye,ti,Te.data):U.isCompressedArrayTexture?N.compressedTexSubImage3D(At,Tt,It,de,Be,Rt,bt,Pt,ye,Te.data):N.texSubImage3D(At,Tt,It,de,Be,Rt,bt,Pt,ye,ti,Te):b.isDataTexture?N.texSubImage2D(N.TEXTURE_2D,Tt,It,de,Rt,bt,ye,ti,Te.data):b.isCompressedTexture?N.compressedTexSubImage2D(N.TEXTURE_2D,Tt,It,de,Te.width,Te.height,ye,Te.data):N.texSubImage2D(N.TEXTURE_2D,Tt,It,de,Rt,bt,ye,ti,Te);_.pixelStorei(N.UNPACK_ROW_LENGTH,li),_.pixelStorei(N.UNPACK_IMAGE_HEIGHT,oe),_.pixelStorei(N.UNPACK_SKIP_PIXELS,wi),_.pixelStorei(N.UNPACK_SKIP_ROWS,Yi),_.pixelStorei(N.UNPACK_SKIP_IMAGES,Sn),Tt===0&&U.generateMipmaps&&N.generateMipmap(At),_.unbindTexture()},this.initRenderTarget=function(b){G.get(b).__webglFramebuffer===void 0&&J.setupRenderTarget(b)},this.initTexture=function(b){b.isCubeTexture?J.setTextureCube(b,0):b.isData3DTexture?J.setTexture3D(b,0):b.isDataArrayTexture||b.isCompressedArrayTexture?J.setTexture2DArray(b,0):J.setTexture2D(b,0),_.unbindTexture()},this.resetState=function(){W=0,z=0,$=null,_.reset(),wt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return ki}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let e=this.getContext();e.drawingBufferColorSpace=te._getDrawingBufferColorSpace(t),e.unpackColorSpace=te._getUnpackColorSpace()}};var lr={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};var bi=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}},Uy=new Fn(-1,1,1,-1,0,1),yu=class extends xe{constructor(){super(),this.setAttribute("position",new Yt([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new Yt([0,2,0,0,2,0],2))}},Fy=new yu,Gn=class{constructor(t){this._mesh=new St(Fy,t)}dispose(){this._mesh.geometry.dispose()}render(t){t.render(this._mesh,Uy)}get material(){return this._mesh.material}set material(t){this._mesh.material=t}};var cr=class extends bi{constructor(t,e="tDiffuse"){super(),this.textureID=e,this.uniforms=null,this.material=null,t instanceof we?(this.uniforms=t.uniforms,this.material=t):t&&(this.uniforms=vn.clone(t.uniforms),this.material=new we({name:t.name!==void 0?t.name:"unspecified",defines:Object.assign({},t.defines),uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader})),this._fsQuad=new Gn(this.material)}render(t,e,i){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=i.texture),this._fsQuad.material=this.material,this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};var Ha=class extends bi{constructor(t,e){super(),this.scene=t,this.camera=e,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(t,e,i){let n=t.getContext(),r=t.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(n.REPLACE,n.REPLACE,n.REPLACE),r.buffers.stencil.setFunc(n.ALWAYS,a,4294967295),r.buffers.stencil.setClear(o),r.buffers.stencil.setLocked(!0),t.setRenderTarget(i),this.clear&&t.clear(),t.render(this.scene,this.camera),t.setRenderTarget(e),this.clear&&t.clear(),t.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(n.EQUAL,1,4294967295),r.buffers.stencil.setOp(n.KEEP,n.KEEP,n.KEEP),r.buffers.stencil.setLocked(!0)}},gc=class extends bi{constructor(){super(),this.needsSwap=!1}render(t){t.state.buffers.stencil.setLocked(!1),t.state.buffers.stencil.setTest(!1)}};var xc=class{constructor(t,e){if(this.renderer=t,this._pixelRatio=t.getPixelRatio(),e===void 0){let i=t.getSize(new nt);this._width=i.width,this._height=i.height,e=new Le(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:ke}),e.texture.name="EffectComposer.rt1"}else this._width=e.width,this._height=e.height;this.renderTarget1=e,this.renderTarget2=e.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new cr(lr),this.copyPass.material.blending=Ri,this.timer=new Ta}swapBuffers(){let t=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=t}addPass(t){this.passes.push(t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(t,e){this.passes.splice(e,0,t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(t){let e=this.passes.indexOf(t);e!==-1&&this.passes.splice(e,1)}isLastEnabledPass(t){for(let e=t+1;e<this.passes.length;e++)if(this.passes[e].enabled)return!1;return!0}render(t){this.timer.update(),t===void 0&&(t=this.timer.getDelta());let e=this.renderer.getRenderTarget(),i=!1;for(let n=0,r=this.passes.length;n<r;n++){let a=this.passes[n];if(a.enabled!==!1){if(a.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(n),a.render(this.renderer,this.writeBuffer,this.readBuffer,t,i),a.needsSwap){if(i){let o=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,t),l.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}Ha!==void 0&&(a instanceof Ha?i=!0:a instanceof gc&&(i=!1))}}this.renderer.setRenderTarget(e)}reset(t){if(t===void 0){let e=this.renderer.getSize(new nt);this._pixelRatio=this.renderer.getPixelRatio(),this._width=e.width,this._height=e.height,t=this.renderTarget1.clone(),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=t,this.renderTarget2=t.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(t,e){this._width=t,this._height=e;let i=this._width*this._pixelRatio,n=this._height*this._pixelRatio;this.renderTarget1.setSize(i,n),this.renderTarget2.setSize(i,n);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(i,n)}setPixelRatio(t){this._pixelRatio=t,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}};var _c=class extends bi{constructor(t,e,i=null,n=null,r=null){super(),this.scene=t,this.camera=e,this.overrideMaterial=i,this.clearColor=n,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new ct}render(t,e,i){let n=t.autoClear;t.autoClear=!1;let r,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(t.getClearColor(this._oldClearColor),t.setClearColor(this.clearColor,t.getClearAlpha())),this.clearAlpha!==null&&(r=t.getClearAlpha(),t.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&t.clearDepth(),t.setRenderTarget(this.renderToScreen?null:i),this.clear===!0&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),t.render(this.scene,this.camera),this.clearColor!==null&&t.setClearColor(this._oldClearColor),this.clearAlpha!==null&&t.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),t.autoClear=n}};var ap={name:"LuminosityHighPassShader",uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new ct(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};var hr=class s extends bi{constructor(t,e=1,i,n){super(),this.strength=e,this.radius=i,this.threshold=n,this.resolution=t!==void 0?new nt(t.x,t.y):new nt(256,256),this.clearColor=new ct(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new Le(r,a,{type:ke,depthBuffer:!1}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let h=0;h<this.nMips;h++){let f=new Le(r,a,{type:ke,depthBuffer:!1});f.texture.name="UnrealBloomPass.h"+h,f.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(f);let u=new Le(r,a,{type:ke,depthBuffer:!1});u.texture.name="UnrealBloomPass.v"+h,u.texture.generateMipmaps=!1,this.renderTargetsVertical.push(u),r=Math.round(r/2),a=Math.round(a/2)}let o=ap;this.highPassUniforms=vn.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=n,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new we({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];let l=[6,10,14,18,22];r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let h=0;h<this.nMips;h++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(l[h])),this.separableBlurMaterials[h].uniforms.invSize.value=new nt(1/r,1/a),r=Math.round(r/2),a=Math.round(a/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=e,this.compositeMaterial.uniforms.bloomRadius.value=.1;let c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new w(1,1,1),new w(1,1,1),new w(1,1,1),new w(1,1,1),new w(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=vn.clone(lr.uniforms),this.blendMaterial=new we({uniforms:this.copyUniforms,vertexShader:lr.vertexShader,fragmentShader:lr.fragmentShader,premultipliedAlpha:!0,blending:mi,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new ct,this._oldClearAlpha=1,this._basic=new fe,this._fsQuad=new Gn(null)}dispose(){for(let t=0;t<this.renderTargetsHorizontal.length;t++)this.renderTargetsHorizontal[t].dispose();for(let t=0;t<this.renderTargetsVertical.length;t++)this.renderTargetsVertical[t].dispose();this.renderTargetBright.dispose();for(let t=0;t<this.separableBlurMaterials.length;t++)this.separableBlurMaterials[t].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(t,e){let i=Math.round(t/2),n=Math.round(e/2);this.renderTargetBright.setSize(i,n);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(i,n),this.renderTargetsVertical[r].setSize(i,n),this.separableBlurMaterials[r].uniforms.invSize.value=new nt(1/i,1/n),i=Math.round(i/2),n=Math.round(n/2)}render(t,e,i,n,r){t.getClearColor(this._oldClearColor),this._oldClearAlpha=t.getClearAlpha();let a=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),r&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=i.texture,t.setRenderTarget(null),t.clear(),this._fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=i.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this._fsQuad.render(t);let o=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this._fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=o.texture,this.separableBlurMaterials[l].uniforms.direction.value=s.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[l]),t.clear(),this._fsQuad.render(t),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=s.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[l]),t.clear(),this._fsQuad.render(t),o=this.renderTargetsVertical[l];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this._fsQuad.render(t),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(i),this._fsQuad.render(t)),t.setClearColor(this._oldClearColor,this._oldClearAlpha),t.autoClear=a}_getSeparableBlurMaterial(t){let e=[],i=t/3;for(let a=0;a<t;a++)e.push(.39894*Math.exp(-.5*a*a/(i*i))/i);let n=[],r=[];for(let a=1;a<t;a+=2){let o=e[a],l=a+1<t?e[a+1]:0,c=o+l;n.push((a*o+(a+1)*l)/c),r.push(c)}return new we({defines:{KERNEL_PAIRS:n.length},uniforms:{colorTexture:{value:null},invSize:{value:new nt(.5,.5)},direction:{value:new nt(.5,.5)},centerWeight:{value:e[0]},gaussianOffsets:{value:n},gaussianWeights:{value:r}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				#include <common>

				varying vec2 vUv;

				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float centerWeight;
				uniform float gaussianOffsets[KERNEL_PAIRS];
				uniform float gaussianWeights[KERNEL_PAIRS];

				void main() {

					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * centerWeight;

					for ( int i = 0; i < KERNEL_PAIRS; i ++ ) {

						vec2 uvOffset = direction * invSize * gaussianOffsets[ i ];
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += ( sample1 + sample2 ) * gaussianWeights[ i ];

					}

					gl_FragColor = vec4( diffuseSum, 1.0 );

				}`})}_getCompositeMaterial(t){return new we({defines:{NUM_MIPS:t},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				varying vec2 vUv;

				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor( const in float factor ) {

					float mirrorFactor = 1.2 - factor;
					return mix( factor, mirrorFactor, bloomRadius );

				}

				void main() {

					// 3.0 for backwards compatibility with previous alpha-based intensity
					vec3 bloom = 3.0 * bloomStrength * (
						lerpBloomFactor( bloomFactors[ 0 ] ) * bloomTintColors[ 0 ] * texture2D( blurTexture1, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 1 ] ) * bloomTintColors[ 1 ] * texture2D( blurTexture2, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 2 ] ) * bloomTintColors[ 2 ] * texture2D( blurTexture3, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 3 ] ) * bloomTintColors[ 3 ] * texture2D( blurTexture4, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 4 ] ) * bloomTintColors[ 4 ] * texture2D( blurTexture5, vUv ).rgb
					);

					float bloomAlpha = max( bloom.r, max( bloom.g, bloom.b ) );
					gl_FragColor = vec4( bloom, bloomAlpha );

				}`})}};hr.BlurDirectionX=new nt(1,0);hr.BlurDirectionY=new nt(0,1);var Ga={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};var vc=class extends bi{constructor(){super(),this.isOutputPass=!0,this.uniforms=vn.clone(Ga.uniforms),this.material=new Ks({name:Ga.name,uniforms:this.uniforms,vertexShader:Ga.vertexShader,fragmentShader:Ga.fragmentShader}),this._fsQuad=new Gn(this.material),this._outputColorSpace=null,this._toneMapping=null}render(t,e,i){this.uniforms.tDiffuse.value=i.texture,this.uniforms.toneMappingExposure.value=t.toneMappingExposure,(this._outputColorSpace!==t.outputColorSpace||this._toneMapping!==t.toneMapping)&&(this._outputColorSpace=t.outputColorSpace,this._toneMapping=t.toneMapping,this.material.defines={},te.getTransfer(this._outputColorSpace)===ce&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===Ea?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===wa?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===Aa?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===os?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===Ca?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===Pa?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===Ra&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};var ft={dt:.008333333333333333,gravity:-6.5,ballRadius:.9125,ballMass:30,ballMaxSpeed:60,ballMaxAngVel:6,ballDrag:.0305,ballRestitution:.6,ballFriction:.35,carMass:180,carMaxSpeed:23,supersonic:22,throttleMaxSpeed:14.1,boostAccel:9.9167,boostPerSecond:33.33,brakeAccel:35,coastAccel:5.25,airThrottleAccel:.6667,jumpImpulse:2.9167,jumpHoldAccel:14.583,jumpHoldTime:.2,stickyAccel:3.25,doubleJumpWindow:1.25,dodgeImpulse:5,flipTime:.65,maxAngVel:5.5,rideHeight:.17,airPitchAccel:12.46,airYawAccel:9.11,airRollAccel:38.34,airPitchDamp:2.798,airYawDamp:1.886,airRollDamp:4.472,demoRespawnTime:3,startBoost:33.3},Si={octane:{name:"Octane",hx:.59,hy:.18,hz:.42},dominus:{name:"Dominus",hx:.64,hy:.155,hz:.42},breakout:{name:"Breakout",hx:.66,hy:.15,hz:.4},merc:{name:"Merc",hx:.6,hy:.22,hz:.43}},ur=[{name:"BLEU",main:2059263,light:5939455,dark:732538,css:"#2f7bff"},{name:"ORANGE",main:16742932,light:16756316,dark:8006661,css:"#ff8a1f"}],Wa={rookie:{label:"Recrue",reaction:.28,aim:.55,boostUse:.35,aerial:0,flips:.3,speed:.85},pro:{label:"Pro",reaction:.14,aim:.8,boostUse:.8,aerial:.5,flips:.8,speed:.95},allstar:{label:"All-Star",reaction:.05,aim:.95,boostUse:1,aerial:1,flips:1,speed:1}},Mu=["Viper","Hound","Sultan","Jester","Bandit","Gerwin","Poncho","Rainmaker","Merlin","Samara","Sundown","Tex","Casper","Foamer","Stinger","Shepard","Boomer","Raja","Squall","Myrtle"];var ee={W:40.96,L:51.2,H:20.44,RC:12,RV:3,GW:8.93,GH:6.43,GD:8.8,GEXT:6.5},{W:By,L:dr,H:Oy,RC:zy,RV:Xa,GW:ky,GH:op,GD:Vy,GEXT:cp}=ee,lp=Oy/2,hp=(Vy+cp)/2,Hy=dr-cp+hp;function di(s,t,e){let i=zy-Xa,n=Math.abs(s)-(By-Xa)+i,r=Math.abs(e)-(dr-Xa)+i,a=Math.hypot(Math.max(n,0),Math.max(r,0))+Math.min(Math.max(n,r),0)-i,o=Math.abs(t-lp)-(lp-Xa),l=Math.hypot(Math.max(a,0),Math.max(o,0))+Math.min(Math.max(a,o),0)-Xa,c=Math.abs(s)-ky,h=Math.abs(t-op/2)-op/2,f=Math.abs(Math.abs(e)-Hy)-hp,u=Math.hypot(Math.max(c,0),Math.max(h,0),Math.max(f,0))+Math.min(Math.max(c,h,f),0);return l<u?l:u}function yn(s,t,e,i){let r=di(s-.004,t,e)-di(s+.004,t,e),a=di(s,t-.004,e)-di(s,t+.004,e),o=di(s,t,e-.004)-di(s,t,e+.004),l=Math.hypot(r,a,o)||1;return i.set(r/l,a/l,o/l)}function bu(s,t){return s>dr+t?0:s<-dr-t?1:-1}function Su(s){return s===0?-dr:dr}var Gy=[[-3072,-4096],[3072,-4096],[-3584,0],[3584,0],[-3072,4096],[3072,4096]],Wy=[[0,-4240],[-1792,-4184],[1792,-4184],[-940,-3308],[940,-3308],[0,-2816],[-3584,-2484],[3584,-2484],[-1788,-2300],[1788,-2300],[-2048,-1036],[0,-1024],[2048,-1036],[-1024,0],[1024,0],[-2048,1036],[0,1024],[2048,1036],[-1788,2300],[1788,2300],[-3584,2484],[3584,2484],[0,2816],[-940,3310],[940,3308],[-1792,4184],[1792,4184],[0,4240]];function fr(){let s=[];for(let[t,e]of Gy)s.push({pos:new w(t/100,0,e/100),big:!0,active:!0,timer:0});for(let[t,e]of Wy)s.push({pos:new w(t/100,0,e/100),big:!1,active:!0,timer:0});return s}var up=[[-20.48,-25.6],[20.48,-25.6],[-2.56,-38.4],[2.56,-38.4],[0,-46.08]],dp={1:[[0],[1],[2],[3],[4]],2:[[0,1],[0,3],[2,1],[2,4],[3,4],[0,4],[1,4]],3:[[0,1,4],[0,3,4],[2,1,4],[0,1,2],[0,1,3]],4:[[0,1,2,4],[0,1,3,4]]},pr=[[-23.04,-46.08],[23.04,-46.08],[-26.88,-46.08],[26.88,-46.08]];var fs=ft.ballRadius,us=new w,Tu=new w,ds=new w,Mc=new w,fp=new ae;function wu(s,t,e){let i=t.length();i<1e-7||(Mc.copy(t).multiplyScalar(1/i),fp.setFromAxisAngle(Mc,i*e),s.premultiply(fp).normalize())}function pp(s,t){s.vel.y+=ft.gravity*t,s.vel.multiplyScalar(1-ft.ballDrag*t);let e=s.vel.length();e>ft.ballMaxSpeed&&s.vel.multiplyScalar(ft.ballMaxSpeed/e),s.pos.addScaledVector(s.vel,t);let i=0,r=di(s.pos.x,s.pos.y,s.pos.z)+fs;if(r>0){yn(s.pos.x,s.pos.y,s.pos.z,us),s.pos.addScaledVector(us,r);let o=s.vel.dot(us);if(o<0){i=-o;let c=-(1+(o>-.6?0:ft.ballRestitution))*o;s.vel.addScaledVector(us,c),Tu.copy(us).multiplyScalar(-fs),ds.crossVectors(s.angVel,Tu).add(s.vel),ds.addScaledVector(us,-ds.dot(us));let h=ds.length();if(h>1e-6){let f=Math.min(ft.ballFriction*c,h/3.5);ds.multiplyScalar(1/h),s.vel.addScaledVector(ds,-f),Mc.crossVectors(Tu,ds).multiplyScalar(-f*2.5/(fs*fs)),s.angVel.add(Mc)}}}let a=s.angVel.length();return a>ft.ballMaxAngVel&&s.angVel.multiplyScalar(ft.ballMaxAngVel/a),i}var bc=class{constructor(){this.pos=new w(0,fs,0),this.vel=new w,this.angVel=new w,this.quat=new ae,this.prevPos=this.pos.clone(),this.prevQuat=this.quat.clone(),this.radius=fs,this.hidden=!1,this.lastTouch=null,this.touches=[]}reset(t=0,e=fs,i=0){this.pos.set(t,e,i),this.vel.set(0,0,0),this.angVel.set(0,0,0),this.prevPos.copy(this.pos),this.prevQuat.copy(this.quat),this.hidden=!1,this.lastTouch=null,this.touches.length=0}step(t){if(this.prevPos.copy(this.pos),this.prevQuat.copy(this.quat),this.hidden)return 0;let e=pp(this,t);return wu(this.quat,this.angVel,t),e}},yc=new w,Eu=new w;function Au(s,t,e){let i=s.vel.length();if(i<.001)return;yc.copy(s.vel).multiplyScalar(1/i),Eu.set(t.x-s.pos.x,t.y-s.pos.y,t.z-s.pos.z).normalize();let n=Math.acos(Math.max(-1,Math.min(1,yc.dot(Eu)))),r=1.6*e;n>1e-4&&yc.lerp(Eu,Math.min(1,r/n)).normalize(),i<t.minSpeed&&(i+=(t.minSpeed-i)*Math.min(1,e*2.5)),s.vel.copy(yc).multiplyScalar(i)}function mp(s,t=4,e=1/60,i=null){let n={pos:s.pos.clone(),vel:s.vel.clone(),angVel:s.angVel.clone()},r=[],a=2,o=e/a;for(let l=e;l<=t+1e-6;l+=e){for(let c=0;c<a;c++)pp(n,o),i&&Au(n,i,o);r.push({t:l,pos:n.pos.clone(),vel:n.vel.clone()})}return r}function Xy(){return{throttle:0,steer:0,pitch:0,yaw:0,roll:0,jump:!1,boost:!1,handbrake:!1}}function qy(s){return s<14?16-14.4*(s/14):s<14.1?1.6*(14.1-s)/.1:0}var ps=[[0,.69],[5,.398],[10,.235],[15,.1375],[17.5,.11],[23,.088]];function Yy(s){if(s<=0)return ps[0][1];for(let t=1;t<ps.length;t++)if(s<=ps[t][0]){let[e,i]=ps[t-1],[n,r]=ps[t];return i+(r-i)*(s-e)/(n-e)}return ps[ps.length-1][1]}var Ru=(s,t,e)=>s<t?t:s>e?e:s,Cu=[];for(let s of[-1,0,1])for(let t of[-1,0,1])for(let e of[-1,0,1])(s||t||e)&&Cu.push([s,t,e]);var Ii=new w,rn=new w,oT=new w,pe=new w,mr=new w,Sc=new w,Ie=new w,gp=new w,gr=new w,Mn=new w,Ti=new w,xp=new w,Tc=new w,Ec=new ae,_p=new ae,wc=new ae,$y=new ae,Jy=0,Ac=class{constructor({team:t=0,name:e="Joueur",body:i="octane",isBot:n=!1,colors:r=null}={}){this.id=Jy++,this.team=t,this.name=e,this.isBot=n,this.bodyKey=Si[i]?i:"octane",this.body=Si[this.bodyKey],this.colors=r;let{hx:a,hy:o,hz:l}=this.body,c=1.4;this.invI=new w(12/(c*(4*o*o+4*l*l)),12/(c*(4*a*a+4*l*l)),12/(c*(4*a*a+4*o*o))),this.clearance=o+ft.rideHeight,this.pos=new w,this.vel=new w,this.quat=new ae,this.angVel=new w,this.prevPos=new w,this.prevQuat=new ae,this.groundNormal=new w(0,1,0),this.contactNormal=new w(0,1,0),this.rightingAxis=new w,this.controls=Xy(),this.stats={score:0,goals:0,assists:0,saves:0,shots:0,demos:0},this.resetState()}resetState(){this.boost=ft.startBoost,this.onGround=!1,this.jumping=!1,this.jumpTime=0,this.jumpLock=0,this.hasJumped=!1,this.hasDoubleJumped=!1,this.hasFlipped=!1,this.airTimeSinceJump=0,this.flipping=!1,this.flipTime=0,this.flipDir={x:0,y:0},this.prevJump=!1,this.demolished=!1,this.respawnTimer=0,this.boosting=!1,this.supersonic=!1,this.contactTimer=1,this.groundTime=0,this.airTime=0,this.lastExtraHit=-10,this.lastShotTime=-10,this.wheelSpin=0,this.steerVis=0,this.justJumped=!1,this.justDodged=!1,this.righting=0,this.wallGrip=this.wallGrip??!0}placeAt(t,e,i,n){this.resetState(),this.pos.set(t,this.clearance,e),this.vel.set(0,0,0),this.angVel.set(0,0,0),this.quat.setFromAxisAngle(Ie.set(0,1,0),Math.atan2(-n,i)),this.prevPos.copy(this.pos),this.prevQuat.copy(this.quat),this.onGround=!0,this.groundNormal.set(0,1,0)}forward(t){return t.set(1,0,0).applyQuaternion(this.quat)}up(t){return t.set(0,1,0).applyQuaternion(this.quat)}right(t){return t.set(0,0,1).applyQuaternion(this.quat)}applyInvInertia(t,e){return wc.copy(this.quat).invert(),e.copy(t).applyQuaternion(wc),e.x*=this.invI.x,e.y*=this.invI.y,e.z*=this.invI.z,e.applyQuaternion(this.quat)}demolish(){this.demolished=!0,this.respawnTimer=ft.demoRespawnTime,this.vel.set(0,0,0),this.angVel.set(0,0,0),this.boosting=!1}canDodge(){return!this.hasFlipped&&!this.hasDoubleJumped&&(!this.hasJumped||this.airTimeSinceJump<ft.doubleJumpWindow)}step(t){if(this.prevPos.copy(this.pos),this.prevQuat.copy(this.quat),this.justJumped=!1,this.justDodged=!1,this.demolished)return;let e=this.controls,i=e.jump&&!this.prevJump;this.prevJump=e.jump,this.up(rn);let n=-di(this.pos.x,this.pos.y,this.pos.z);yn(this.pos.x,this.pos.y,this.pos.z,pe),this.jumpLock=Math.max(0,this.jumpLock-t);let r=this.jumpLock<=0&&n<this.clearance+.12&&rn.dot(pe)>.55;this.contactTimer+=t,r?(this.onGround||(this.hasJumped=!1,this.hasDoubleJumped=!1,this.hasFlipped=!1,this.flipping=!1,this.jumping=!1,this.righting=0,this.airTimeSinceJump=0),this.onGround=!0,this.groundTime+=t,this.airTime=0,this.groundNormal.copy(pe),this.driveGround(t,e,i)):(this.onGround=!1,this.groundTime=0,this.airTime+=t,this.airControl(t,e,i)),this.jumping&&(this.jumpTime+=t,e.jump&&this.jumpTime<ft.jumpHoldTime?(this.up(Ie),this.vel.addScaledVector(Ie,ft.jumpHoldAccel*t)):this.jumping=!1),this.boosting=!1,e.boost&&this.boost>0?(this.boosting=!0,this.forward(Ii),this.vel.addScaledVector(Ii,ft.boostAccel*t),this.boost=Math.max(0,this.boost-ft.boostPerSecond*t)):!this.onGround&&e.throttle&&(this.forward(Ii),this.vel.addScaledVector(Ii,ft.airThrottleAccel*e.throttle*t)),this.vel.y+=ft.gravity*t;let a=this.vel.length();if(a>ft.carMaxSpeed&&this.vel.multiplyScalar(ft.carMaxSpeed/a),this.pos.addScaledVector(this.vel,t),r||wu(this.quat,this.angVel,t),r){let l=-di(this.pos.x,this.pos.y,this.pos.z);if(yn(this.pos.x,this.pos.y,this.pos.z,pe),l<this.clearance){this.pos.addScaledVector(pe,this.clearance-l);let c=this.vel.dot(pe);c<0&&this.vel.addScaledVector(pe,-c)}}this.collideArena();let o=this.vel.length();this.supersonic=o>=(this.supersonic?21:ft.supersonic),this.forward(Ii),this.wheelSpin+=this.vel.dot(Ii)*t/.17,this.steerVis+=(e.steer-this.steerVis)*Math.min(1,t*12)}driveGround(t,e,i){this.up(rn),rn.dot(pe)<.99999&&(_p.setFromUnitVectors(rn,pe),Ec.copy($y).slerp(_p,1-Math.exp(-t*28)),this.quat.premultiply(Ec).normalize()),this.forward(Ii),mr.copy(Ii).addScaledVector(pe,-Ii.dot(pe)).normalize(),Sc.crossVectors(mr,pe);let r=this.vel.dot(mr),a=-e.steer*Yy(Math.abs(r))*r*(e.handbrake?1.3:1),o=a*t;if(o!==0){Ec.setFromAxisAngle(pe,o),this.quat.premultiply(Ec).normalize();let u=this.vel.dot(pe);Ie.copy(this.vel).addScaledVector(pe,-u),Ie.applyAxisAngle(pe,o*(e.handbrake?.25:1)),this.vel.copy(Ie).addScaledVector(pe,u),mr.applyAxisAngle(pe,o),Sc.applyAxisAngle(pe,o)}r=this.vel.dot(mr);let l=this.vel.dot(Sc),c=e.boost&&this.boost>0?1:e.throttle,h=0;Math.abs(c)>.01?r*c>=-.05?h=c*qy(Math.abs(r)):h=Math.sign(c)*Math.min(ft.brakeAccel,Math.abs(r)/t):r!==0&&(h=-Math.sign(r)*Math.min(ft.coastAccel,Math.abs(r)/t)),this.vel.addScaledVector(mr,h*t);let f=e.handbrake?2.2:26;if(this.vel.addScaledVector(Sc,l*Math.exp(-f*t)-l),this.vel.addScaledVector(pe,-ft.stickyAccel*t),this.wallGrip&&pe.y<.7&&(Math.abs(r)>1.5||Math.abs(e.throttle)>.1||e.boost)){let u=ft.gravity*pe.y;u>0&&this.vel.addScaledVector(pe,-u*t),this.vel.addScaledVector(pe,-1.5*t)}this.angVel.copy(pe).multiplyScalar(a),i&&(this.vel.addScaledVector(pe,ft.jumpImpulse),this.jumping=!0,this.jumpTime=0,this.hasJumped=!0,this.hasDoubleJumped=!1,this.hasFlipped=!1,this.airTimeSinceJump=0,this.jumpLock=.1,this.onGround=!1,this.justJumped=!0)}airControl(t,e,i){if(this.hasJumped&&!this.jumping&&(this.airTimeSinceJump+=t),i&&!this.jumping){if(this.up(rn),this.contactTimer<.15&&rn.dot(this.contactNormal)<.55&&this.vel.length()<6){this.vel.addScaledVector(this.contactNormal,3.2),Ie.crossVectors(rn,this.contactNormal),Ie.lengthSq()<1e-4&&this.forward(Ie);let c=Math.acos(Ru(rn.dot(this.contactNormal),-1,1));this.rightingAxis.copy(Ie.normalize()).multiplyScalar(ft.maxAngVel),this.righting=c/ft.maxAngVel,this.angVel.copy(this.rightingAxis),this.hasJumped=!0,this.hasFlipped=!0,this.justJumped=!0}else if(this.canDodge()){let c=e.dodgeX??e.pitch,h=e.dodgeY??Ru(e.yaw+e.roll,-1,1);Math.abs(c)+Math.abs(h)>=.5?this.dodge(c,h):(this.vel.addScaledVector(rn,ft.jumpImpulse),this.hasDoubleJumped=!0,this.justJumped=!0)}}wc.copy(this.quat).invert();let n=gp.copy(this.angVel).applyQuaternion(wc),r=e.pitch,a=e.yaw,o=e.roll;if(this.righting>0){this.righting-=t,this.angVel.copy(this.rightingAxis);return}if(this.flipping&&(this.flipTime+=t,this.flipTime>=ft.flipTime+.5&&(this.flipping=!1)),this.flipping&&this.flipTime<ft.flipTime){let c=Ru(-r*Math.sign(this.flipDir.x),0,1);n.x=this.flipDir.y*ft.maxAngVel,n.z=-this.flipDir.x*ft.maxAngVel*(1-c),n.y+=(-a*ft.airYawAccel-ft.airYawDamp*n.y*(1-Math.abs(a)))*t,this.flipTime>=.15&&(this.vel.y<0||this.flipTime<.21)&&(this.vel.y*=Math.pow(.65,t*120))}else{let c=this.flipping?0:1;n.x+=(o*ft.airRollAccel-ft.airRollDamp*n.x*c)*t,n.z+=(-r*ft.airPitchAccel-ft.airPitchDamp*n.z*(1-Math.abs(r))*c)*t,n.y+=(-a*ft.airYawAccel-ft.airYawDamp*n.y*(1-Math.abs(a)))*t}let l=n.length();l>ft.maxAngVel&&n.multiplyScalar(ft.maxAngVel/l),this.angVel.copy(n).applyQuaternion(this.quat)}dodge(t,e){let i=Math.hypot(t,e);t/=i,e/=i,this.forward(Ii),Ie.set(Ii.x,0,Ii.z),Ie.lengthSq()<1e-4&&this.up(Ie).set(-Ie.x,0,-Ie.z),Ie.normalize(),gr.set(-Ie.z,0,Ie.x);let n=this.vel.dot(Ie),r=Math.abs(n)/ft.carMaxSpeed,a=Math.abs(n)<1?t<0:t>=0!=n>0,o=t*ft.dodgeImpulse,l=e*ft.dodgeImpulse;a&&(o*=(1.5*r+1)*(16/15)),l*=.9*r+1,this.vel.addScaledVector(Ie,o).addScaledVector(gr,l),this.flipping=!0,this.flipTime=0,this.flipDir.x=t,this.flipDir.y=e,this.hasFlipped=!0,this.justDodged=!0}collideArena(){let{hx:t,hy:e,hz:i}=this.body;for(let n=0;n<3;n++){let r=0,a=0;for(let l of Cu){Ti.set(l[0]*t,l[1]*e,l[2]*i).applyQuaternion(this.quat).add(this.pos);let c=di(Ti.x,Ti.y,Ti.z);c>0&&(a++,c>r&&(r=c,Mn.copy(Ti)))}if(a===0)break;yn(Mn.x,Mn.y,Mn.z,pe),this.pos.addScaledVector(pe,r),this.contactNormal.copy(pe),this.contactTimer=0,Mn.set(0,0,0),Tc.set(0,0,0);let o=0;for(let l of Cu)Ti.set(l[0]*t,l[1]*e,l[2]*i).applyQuaternion(this.quat).add(this.pos),di(Ti.x,Ti.y,Ti.z)>-.03&&(Mn.add(Ti),Tc.add(yn(Ti.x,Ti.y,Ti.z,pe)),o++);o!==0&&(xp.copy(Mn).multiplyScalar(1/o),Tc.normalize(),this.contactImpulse(xp,Tc,.15,.55))}this.contactTimer===0&&!this.onGround&&this.vel.lengthSq()<.5&&this.angVel.lengthSq()<.8&&Math.max(-this.up(Ie).dot(this.contactNormal),Math.abs(this.right(Ie).dot(this.contactNormal)))>.9&&(this.vel.multiplyScalar(.85),this.angVel.multiplyScalar(.8))}contactImpulse(t,e,i,n){let r=Ie.copy(t).sub(this.pos),a=gp.crossVectors(this.angVel,r).add(this.vel),o=a.dot(e);if(o>=0)return;let l=gr.crossVectors(r,e),c=this.applyInvInertia(l,gr),h=1+e.dot(Mn.crossVectors(c,r)),f=-(1+(o<-1.5?i:0))*o/h;this.vel.addScaledVector(e,f),this.angVel.addScaledVector(c,f),a.crossVectors(this.angVel,r).add(this.vel),a.addScaledVector(e,-a.dot(e));let u=a.length();if(u<1e-5)return;let d=a.multiplyScalar(1/u),m=gr.crossVectors(r,d),x=this.applyInvInertia(m,gr),g=1+d.dot(Mn.crossVectors(x,r)),p=Math.min(u/g,n*f);this.vel.addScaledVector(d,-p),this.angVel.addScaledVector(x,-p)}};var Wn=ft.ballMass,Xn=ft.carMass,Wi=ft.ballRadius,si=new w,se=new w,vp=new w,qa=new w,Rc=new w,Cc=new w,Pc=new w,Ic=new w,Xi=new w,Ja=new w,yp=new ae,xr=(s,t,e)=>s<t?t:s>e?e:s;function Zy(s){return s<=5?.65:s<=23?.65-.1*(s-5)/18:s<=46?.55-.25*(s-23)/23:.3}function Rp(s,t,e){if(s.demolished||t.hidden)return 0;let{hx:i,hy:n,hz:r}=s.body;if(yp.copy(s.quat).invert(),si.copy(t.pos).sub(s.pos).applyQuaternion(yp),Math.abs(si.x)>i+Wi||Math.abs(si.y)>n+Wi||Math.abs(si.z)>r+Wi)return 0;let a=xr(si.x,-i,i),o=xr(si.y,-n,n),l=xr(si.z,-r,r);se.set(si.x-a,si.y-o,si.z-l);let c=se.length();if(c>=Wi)return 0;let h;if(c>1e-6)se.multiplyScalar(1/c),h=Wi-c;else{let T=i-Math.abs(si.x),E=n-Math.abs(si.y),C=r-Math.abs(si.z);T<E&&T<C?(se.set(Math.sign(si.x)||1,0,0),h=T+Wi):E<C?(se.set(0,Math.sign(si.y)||1,0),h=E+Wi):(se.set(0,0,Math.sign(si.z)||1),h=C+Wi)}vp.set(a,o,l).applyQuaternion(s.quat).add(s.pos);let f=se.y<-.85;se.applyQuaternion(s.quat),t.pos.addScaledVector(se,h*Xn/(Wn+Xn)),s.pos.addScaledVector(se,-h*Wn/(Wn+Xn)),qa.copy(vp).sub(s.pos),Rc.copy(se).multiplyScalar(-Wi),Cc.crossVectors(s.angVel,qa).add(s.vel),Pc.crossVectors(t.angVel,Rc).add(t.vel);let u=Ic.copy(Pc).sub(Cc),d=u.dot(se);if(f&&!s.onGround&&(s.hasJumped||s.hasFlipped||s.hasDoubleJumped)&&(s.hasJumped=!1,s.hasDoubleJumped=!1,s.hasFlipped=!1,s.flipReset=!0),d>=0)return 0;let m=Math.min(Math.hypot(t.vel.x-s.vel.x,t.vel.y-s.vel.y,t.vel.z-s.vel.z),46),x=s.applyInvInertia(Xi.crossVectors(qa,se),Xi).multiplyScalar(1/Xn),g=1/Wn+1/Xn+se.dot(Ja.crossVectors(x,qa)),p=-d/g;t.vel.addScaledVector(se,p/Wn),s.vel.addScaledVector(se,-p/Xn),s.angVel.addScaledVector(x,-p),Cc.crossVectors(s.angVel,qa).add(s.vel),Pc.crossVectors(t.angVel,Rc).add(t.vel),u.copy(Pc).sub(Cc),u.addScaledVector(se,-u.dot(se));let M=u.length();if(M>1e-5){let T=u.multiplyScalar(1/M),E=Math.min(M/(3.5/Wn+1/Xn),2*p);t.vel.addScaledVector(T,-E/Wn),s.vel.addScaledVector(T,E/Xn),Xi.crossVectors(Rc,T).multiplyScalar(-E/(.4*Wn*Wi*Wi)),t.angVel.add(Xi)}let S=-d;S>.4&&e-s.lastExtraHit>.05&&(s.lastExtraHit=e,Xi.copy(t.pos).sub(s.pos),Xi.y*=.35,Xi.normalize(),s.forward(Ja),Xi.addScaledVector(Ja,-Xi.dot(Ja)*.35).normalize(),t.vel.addScaledVector(Xi,m*Zy(m)));let v=t.vel.length();return v>ft.ballMaxSpeed&&t.vel.multiplyScalar(ft.ballMaxSpeed/v),S}var Mp=.36,bp=new w,Sp=new w,Tp=new w,Ep=new w,wp=new w,Ap=new w,Ya=new w,$a=new w;function Ky(s,t,e,i,n,r){let a=Ic.copy(t).sub(s),o=Xi.copy(i).sub(e),l=Ja.copy(s).sub(e),c=a.dot(a),h=o.dot(o),f=o.dot(l),u=a.dot(l),d=a.dot(o),m=c*h-d*d,x=m>1e-8?xr((d*f-u*h)/m,0,1):0,g=(d*x+f)/h;g<0?(g=0,x=xr(-u/c,0,1)):g>1&&(g=1,x=xr((d-u)/c,0,1)),n.copy(s).addScaledVector(a,x),r.copy(e).addScaledVector(o,g)}function Cp(s,t){if(s.demolished||t.demolished||s.pos.distanceToSquared(t.pos)>4)return null;s.forward(Ya),t.forward($a);let e=s.body.hx-.28,i=t.body.hx-.28;bp.copy(s.pos).addScaledVector(Ya,-e),Sp.copy(s.pos).addScaledVector(Ya,e),Tp.copy(t.pos).addScaledVector($a,-i),Ep.copy(t.pos).addScaledVector($a,i),Ky(bp,Sp,Tp,Ep,wp,Ap),se.copy(Ap).sub(wp);let n=se.length();if(n>=Mp*2||n<1e-6)return null;se.multiplyScalar(1/n);let r=Mp*2-n;s.pos.addScaledVector(se,-r/2),t.pos.addScaledVector(se,r/2);let a=Ic.copy(t.vel).sub(s.vel).dot(se);if(a>=0)return null;if(s.team!==t.team){if(s.supersonic&&Ya.dot(se)>.55&&s.vel.dot(se)>12)return t.demolish(),{type:"demo",attacker:s,victim:t};if(t.supersonic&&-$a.dot(se)>.55&&-t.vel.dot(se)>12)return s.demolish(),{type:"demo",attacker:t,victim:s}}let o=-(1+.25)*a/2;s.vel.addScaledVector(se,-o),t.vel.addScaledVector(se,o);let l=null,c=null;if(Ya.dot(se)>.5&&s.vel.dot(se)>4?(l=s,c=t):-$a.dot(se)>.5&&-t.vel.dot(se)>4&&(l=t,c=s,se.negate()),l){let h=-a;return c.vel.addScaledVector(se,h*.45),c.vel.y+=h*(c.onGround?.3:.12),c.jumpLock=.1,c.angVel.add(Ic.set((Math.random()-.5)*3,(Math.random()-.5)*2,(Math.random()-.5)*3)),{type:"bump",attacker:l,victim:c,strength:h}}return{type:"touch",attacker:s,victim:t,strength:-a}}var jy=ft.gravity,_r={goal:100,assist:50,save:50,epicSave:75,shot:20,demo:25},Qy=2,tM=720;function eM(s){for(let t=s.length-1;t>0;t--){let e=Math.floor(Math.random()*(t+1));[s[t],s[e]]=[s[e],s[t]]}return s}function Lc(s,t=3.5){for(let e of s){if(e.t>t)break;let i=bu(e.pos.z,ft.ballRadius*.5);if(i>=0)return{team:i,t:e.t}}return null}var Za=class{constructor(t){this.opts={duration:300,freeplay:!1,mode:"classic",unlimitedBoost:!1,noBoost:!1,gravityScale:1,replays:!0,...t},this.ball=new bc,this.cars=this.opts.players.map(e=>new Ac(e));for(let e of this.cars)e.wallGrip=this.opts.wallGrip!=="real";this.pads=fr(),this.score=[0,0],this.timeLeft=this.opts.duration,this.overtime=!1,this.overtimeElapsed=0,this.time=0,this.tickCount=0,this.state="countdown",this.stateTime=0,this.clockRunning=!1,this.events=[],this.frames=[],this.prediction=[],this.goalInfo=null,this.skipRequested=!1,this.replay=null,this.winner=-1,this.heatTouches=0,this.lastCountdown=4,this.opts.freeplay?this.startFreeplay():this.resetKickoff()}emit(t){this.events.push(t)}teamCars(t){return this.cars.filter(e=>e.team===t)}startFreeplay(){this.ball.reset(0,ft.ballRadius,0);let t=pr;this.cars.forEach((e,i)=>{let[n,r]=t[i%t.length],a=e.team===0?1:-1;e.placeAt(n*a,r*a,0,a),e.boost=100}),this.state="playing",this.stateTime=0,this.refreshPrediction()}resetKickoff(){this.ball.reset(0,ft.ballRadius,0);for(let i of this.pads)i.active=!0,i.timer=0;for(let i=0;i<2;i++){let n=this.teamCars(i),r=Math.min(Math.max(n.length,1),4),a=dp[r],o=eM([...a[Math.floor(Math.random()*a.length)]]);n.forEach((l,c)=>{let h=i===0?1:-1,f,u;c<o.length?[f,u]=up[o[c]]:[f,u]=pr[c%pr.length],f*=h,u*=h,l.placeAt(f,u,-f,-u),l.boost=this.startBoost()})}let t=this.teamCars(0),e=this.teamCars(1);for(let i=0;i<Math.min(t.length,e.length);i++){let n=t[i];e[i].placeAt(-n.pos.x,-n.pos.z,n.pos.x,n.pos.z),e[i].boost=this.startBoost()}this.state="countdown",this.stateTime=0,this.clockRunning=!1,this.lastCountdown=4,this.kickoff=!0,this.heatTouches=0,this.refreshPrediction(),this.emit({type:"kickoff"})}startBoost(){return this.opts.unlimitedBoost?100:this.opts.noBoost?0:ft.startBoost}homing(){let t=this.ball.lastTouch;return this.opts.mode!=="heatseeker"||!t||this.ball.hidden?null:{x:0,y:ee.GH*.45,z:t.car.team===0?ee.L+2:-ee.L-2,minSpeed:Math.min(38,14+1.6*this.heatTouches)}}refreshPrediction(){this.prediction=mp(this.ball,4,1/60,this.homing())}requestSkip(){this.skipRequested=!0}tick(t){switch(ft.gravity=jy*this.opts.gravityScale,this.time+=t,this.stateTime+=t,this.tickCount++,this.state){case"countdown":{let e=Math.ceil(3-this.stateTime);e<this.lastCountdown&&e>0&&(this.lastCountdown=e,this.emit({type:"countdown",n:e}));for(let i of this.cars)i.prevPos.copy(i.pos),i.prevQuat.copy(i.quat),i.prevJump=i.controls.jump;this.ball.prevPos.copy(this.ball.pos),this.stateTime>=3&&(this.state="playing",this.stateTime=0,this.emit({type:"go"})),this.record();break}case"playing":this.simulate(t,!0),this.updateClock(t);break;case"goal":this.simulate(t,!1),this.stateTime>(this.opts.freeplay?2:3)&&(this.opts.freeplay?(this.ball.reset(0,ft.ballRadius,0),this.heatTouches=0,this.state="playing",this.stateTime=0,this.refreshPrediction()):this.opts.replays?this.startReplay():this.afterGoal());break;case"replay":this.replay.time+=t,!this.replay.goalShown&&this.replay.time>=this.replay.goalTime&&(this.replay.goalShown=!0,this.emit({type:"replayGoal",team:this.goalInfo.team,pos:this.goalInfo.pos.clone()})),(this.replay.time>=this.replay.end||this.skipRequested&&this.stateTime>.3)&&(this.replay=null,this.afterGoal());break;case"overtime":this.stateTime>2.5&&this.resetKickoff();break;default:break}this.skipRequested=!1}updateClock(t){if(this.opts.freeplay||!this.clockRunning)return;if(this.overtime){this.overtimeElapsed+=t;return}this.opts.duration<=0||(this.timeLeft=Math.max(0,this.timeLeft-t),this.timeLeft>0)||!(this.opts.mode==="heatseeker"||this.ball.pos.y-this.ball.radius<.08)||(this.score[0]!==this.score[1]?this.endMatch():(this.overtime=!0,this.state="overtime",this.stateTime=0,this.emit({type:"overtime"})))}endMatch(){this.state="ended",this.stateTime=0,this.winner=this.score[0]>this.score[1]?0:1,this.emit({type:"end",winner:this.winner})}afterGoal(){if(this.overtime)return this.endMatch();if(this.opts.duration>0&&this.timeLeft<=0){if(this.score[0]!==this.score[1])return this.endMatch();this.overtime=!0,this.state="overtime",this.stateTime=0,this.emit({type:"overtime"});return}this.resetKickoff()}simulate(t,e){let{cars:i,ball:n}=this;for(let o of i){if(o.demolished){o.respawnTimer-=t,o.respawnTimer<=0&&this.respawn(o),o.prevPos.copy(o.pos);continue}o.step(t),this.opts.unlimitedBoost?o.boost=100:this.opts.noBoost&&(o.boost=0),o.justJumped&&this.emit({type:"jump",car:o}),o.justDodged&&this.emit({type:"dodge",car:o})}let r=null;if(e&&!n.hidden){let o=n.step(t);o>2&&this.emit({type:"bounce",pos:n.pos.clone(),strength:o});let l=this.homing();l&&Au(n,l,t);let c=i.length;for(let h=0;h<c;h++){let f=i[(h+this.tickCount)%c],u=Rp(f,n,this.time);if(f.flipReset&&(f.flipReset=!1,this.emit({type:"flipReset",car:f})),u>0){if(u>1.2||!n.lastTouch||n.lastTouch.car!==f||this.time-n.lastTouch.time>.4){let d={car:f,time:this.time},m=n.touches[n.touches.length-1];(!m||this.time-m.time>.25)&&this.heatTouches++,n.touches.push(d),n.touches.length>20&&n.touches.shift(),u>1.2&&this.emit({type:"hit",car:f,pos:n.pos.clone(),strength:u}),r=r||[],r.push(f)}n.lastTouch={car:f,time:this.time},this.kickoff&&(this.kickoff=!1),this.clockRunning=!0}}}else n.prevPos.copy(n.pos),n.prevQuat.copy(n.quat);for(let o=0;o<i.length;o++)for(let l=o+1;l<i.length;l++){let c=Cp(i[o],i[l]);c&&(c.type==="demo"?(this.state==="playing"&&(c.attacker.stats.demos++,this.addPoints(c.attacker,_r.demo,"D\xC9MOLITION")),this.emit({type:"demo",attacker:c.attacker,victim:c.victim,pos:c.victim.pos.clone()})):c.type==="bump"&&this.emit({type:"bump",attacker:c.attacker,victim:c.victim,strength:c.strength,pos:c.victim.pos.clone()}))}this.updatePads(t);let a=this.prediction;if((r||this.tickCount%4===0)&&this.refreshPrediction(),r&&this.state==="playing"&&this.touchStats(r,a),e&&!n.hidden&&this.state==="playing"){let o=bu(n.pos.z,n.radius);o>=0&&this.onGoal(o)}this.record()}touchStats(t,e){let i=Lc(e,2.5),n=Lc(this.prediction,3.5);for(let r of t)if(n&&n.team===r.team&&this.time-r.lastShotTime>1.5&&(r.lastShotTime=this.time,r.stats.shots++,this.addPoints(r,_r.shot,"TIR CADR\xC9")),i&&i.team!==r.team&&(!n||n.team===r.team)){let a=i.t<.35;r.stats.saves++,this.addPoints(r,a?_r.epicSave:_r.save,a?"ARR\xCAT \xC9PIQUE":"ARR\xCAT")}}addPoints(t,e,i){t.stats.score+=e,this.emit({type:"stat",car:t,points:e,label:i})}respawn(t){let e=this.teamCars(t.team),i=Math.max(0,e.indexOf(t)),[n,r]=pr[i%pr.length],a=t.team===0?1:-1,o=t.stats;t.placeAt(n*a,r*a,0,a),t.boost=this.startBoost(),t.stats=o,this.emit({type:"respawn",car:t})}updatePads(t){for(let e of this.pads){if(!e.active){e.timer-=t,e.timer<=0&&(e.active=!0);continue}let i=e.big?2.08:1.44,n=e.big?1.68:1.65;for(let r of this.cars){if(r.demolished||r.boost>=100||this.opts.noBoost)continue;let a=r.pos.x-e.pos.x,o=r.pos.z-e.pos.z;if(a*a+o*o<i*i&&r.pos.y<n){r.boost=Math.min(100,r.boost+(e.big?100:12)),e.active=!1,e.timer=e.big?10:4,this.emit({type:"pad",car:r,big:e.big,pos:e.pos});break}}}}onGoal(t){let{ball:e}=this;this.score[t]++;let i=e.touches,n=null,r=null,a=-1;for(let c=i.length-1;c>=0;c--)if(i[c].car.team===t){n=i[c].car,a=c;break}if(n){for(let c=a-1;c>=0;c--){let h=i[c];if(h.car.team!==t)break;if(h.car!==n){i[a].time-h.time<5&&(r=h.car);break}}n.stats.goals++,this.addPoints(n,_r.goal,"BUT"),r&&(r.stats.assists++,this.addPoints(r,_r.assist,"PASSE D\xC9CISIVE"))}let o=Math.round(e.vel.length()*3.6),l=!n&&e.lastTouch&&e.lastTouch.car.team!==t?e.lastTouch.car:null;this.goalInfo={team:t,scorer:n,assist:r,ownGoal:l,pos:e.pos.clone(),speedKmh:o,time:this.time},this.emit({type:"goal",...this.goalInfo});for(let c of this.cars){if(c.demolished)continue;let h=c.pos.distanceTo(e.pos);if(h<14){let f=c.pos.clone().sub(e.pos).normalize();c.vel.addScaledVector(f,(14-h)*1.6),c.vel.y+=(14-h)*.5,c.jumpLock=.2}}e.hidden=!0,this.state="goal",this.stateTime=0}record(){if(this.tickCount%Qy!==0)return;let t=this.ball,e={t:this.time,ball:[t.pos.x,t.pos.y,t.pos.z,t.quat.x,t.quat.y,t.quat.z,t.quat.w,t.hidden?1:0],cars:this.cars.map(i=>[i.pos.x,i.pos.y,i.pos.z,i.quat.x,i.quat.y,i.quat.z,i.quat.w,i.boosting?1:0,i.demolished?1:0,i.steerVis,i.wheelSpin,i.supersonic?1:0])};this.frames.push(e),this.frames.length>tM&&this.frames.shift()}startReplay(){let t=this.goalInfo.time,e=this.frames.length?this.frames[0].t:t,i=Math.max(e,t-5.5);this.replay={time:i,start:i,end:t+1.2,goalTime:t,goalShown:!1,frames:this.frames.slice()},this.state="replay",this.stateTime=0,this.emit({type:"replayStart"})}replaySnapshot(t){let e=this.replay?this.replay.frames:this.frames;if(!e.length)return null;let i=0,n=e.length-1;if(t<=e[0].t)n=0;else if(t>=e[n].t)i=n;else for(;n-i>1;){let l=i+n>>1;e[l].t<=t?i=l:n=l}let r=e[i],a=e[n],o=n===i?0:(t-r.t)/(a.t-r.t);return{a:r,b:a,k:o}}};var xi=(s,t,e)=>s<t?t:s>e?e:s,bT=ft.ballRadius,Dc=new w(0,ft.gravity,0),Li=new w,Ka=new w,Mr=new w,qn=new w,vr=new ae,$e=new ae,Pp=new le;function iM(s){return s<14?16-14.4*(s/14):s<14.1?1.6*(14.1-s)/.1:0}function Ip(s){s.throttle=0,s.steer=0,s.pitch=0,s.yaw=0,s.roll=0,s.jump=!1,s.boost=!1,s.handbrake=!1}function Ei(s,t){return vr.copy(s.quat).invert(),qn.copy(t).sub(s.pos).applyQuaternion(vr),{angle:Math.atan2(qn.z,qn.x),dist:Math.hypot(qn.x,qn.z),lx:qn.x,ly:qn.y,lz:qn.z}}function Pu(s){return s.forward(Mr),s.vel.dot(Mr)}function Qa(s,t,e,i){let n=Li.copy(e).normalize(),r=Ka.crossVectors(n,i);r.lengthSq()<1e-4&&s.right(r),r.normalize();let a=Mr.crossVectors(r,n).normalize();Pp.makeBasis(n,a,r),$e.setFromRotationMatrix(Pp),vr.copy(s.quat).invert(),$e.multiply(vr),$e.w<0&&($e.x=-$e.x,$e.y=-$e.y,$e.z=-$e.z,$e.w=-$e.w);let o=Math.hypot($e.x,$e.y,$e.z),l=2*Math.atan2(o,$e.w),c=Li.set($e.x,$e.y,$e.z);o>1e-6&&c.multiplyScalar(l/o),c.applyQuaternion(vr);let h=Ka.copy(s.angVel).applyQuaternion(vr),f=5.5,u=9,d=(c.x*f*1.6-h.x)*u*1.6,m=(c.y*f-h.y)*u,x=(c.z*f-h.z)*u;return t.roll=xi(d/ft.airRollAccel,-1,1),t.yaw=xi(-m/ft.airYawAccel,-1,1),t.pitch=xi(-x/ft.airPitchAccel,-1,1),l}var yr=class{constructor(t,e,i=!1){this.dx=t,this.dy=e,this.t=0,this.boost=i}update(t,e,i){return this.t+=t,e.throttle=1,e.boost=this.boost&&this.t<.5,this.t<.07?e.jump=!0:this.t<.1?e.jump=!1:this.t<.14?(e.jump=!0,e.pitch=this.dx,e.yaw=this.dy):e.pitch=this.dx*.3,this.t>.35&&i.onGround?!0:this.t>1.3}},Iu=class{constructor(t,e,i){this.bot=t,this.target=e.clone(),this.arrival=i,this.t=0,this.dodged=!1}update(t,e,i,n){this.t+=t,e.throttle=1;let r=n.ball;if(this.t<.2)return e.jump=!0,!1;if(!this.dodged){let a=Ei(i,r.pos),o=i.pos.distanceTo(r.pos);return o<2.6||this.t>.9?(i.canDodge()&&o<3.2&&(e.jump=!0,e.pitch=Math.cos(a.angle),e.yaw=Math.sin(a.angle)),this.dodged=!0):(i.forward(Li),Qa(i,e,Li.set(r.pos.x-i.pos.x,0,r.pos.z-i.pos.z),new w(0,1,0))),!1}return i.onGround&&this.t>.4?!0:this.t>2}},Lu=class{constructor(t,e){this.target=t.clone(),this.arrival=e,this.t=0}update(t,e,i,n){this.t+=t;let r=this.arrival-n.time;if(r<-.25||this.t>4.5||i.onGround&&this.t>.3||n.ball.lastTouch&&n.ball.lastTouch.time>n.time-.05&&this.t>.3)return!0;let a=Math.max(r,.08);Dc.y=ft.gravity;let o=Li.copy(this.target).sub(i.pos).addScaledVector(i.vel,-a).multiplyScalar(2/(a*a)).sub(Dc),l=o.length(),c=o.clone().normalize();if(this.t<.2)e.jump=!0;else if(this.t<.24)e.jump=!1;else if(this.t<.28&&!i.hasDoubleJumped)return e.jump=!0,e.boost=!0,!1;let h=new w(0,1,0),f=Qa(i,e,c,h);return i.forward(Ka),e.boost=l>1.2&&Ka.dot(c)>.85&&i.boost>0,this.t<.2&&f>.6&&(e.boost=!1),!1}},ja=class{constructor(t,e="pro"){this.car=t,this.d=Wa[e]||Wa.pro,this.maneuver=null,this.plan=null,this.planTimer=0,this.aimOffset=0,this.stuckTime=0,this.reach=new Float32Array(260)}update(t,e){let i=this.car,n=i.controls,r=n.jump;if(Ip(n),i.demolished){this.maneuver=null;return}if(e.state==="countdown"){this.maneuver=null,this.plan=null;return}if(!(e.state!=="playing"&&e.state!=="goal")){if(this.maneuver){if(!this.maneuver.update(t,n,i,e,this))return;this.maneuver=null,Ip(n)}if(this.planTimer-=t,(this.planTimer<=0||!this.plan)&&(this.plan=this.makePlan(e),this.planTimer=this.d.reaction+Math.random()*.05),!i.onGround){this.recover(n,i),r&&i.jumping&&(n.jump=!0);return}this.execute(t,n,e),this.unstick(t,n,i)}}unstick(t,e,i){!(i.vel.length()>1.5)&&Math.abs(e.throttle)>.5?this.stuckTime+=t:this.stuckTime=0,this.stuckTime>1.2&&(this.stuckTime=0,this.maneuver=new yr(-1,0)),i.onGround&&i.groundNormal.y<.35&&i.groundTime>.8&&this.plan&&this.plan.target&&this.plan.target.y<3&&(this.maneuver=new yr(0,0),this.maneuver.update=function(a,o,l){return this.t+=a,o.jump=this.t<.12,o.throttle=1,this.t>.25&&(l.onGround||this.t>1.5)})}recover(t,e){e.vel.lengthSq();let i=Li.set(e.vel.x,0,e.vel.z);i.lengthSq()<1&&e.forward(i).setY(0),i.lengthSq()<1e-4&&i.set(1,0,0),Qa(e,t,i.clone(),new w(0,1,0)),t.throttle=1}computeReach(){let t=this.car,e=Math.max(0,Pu(t)),i=this.d.boostUse>.3?t.boost:0,n=0,r=1/60;for(let a=0;a<this.reach.length;a++){let o=iM(e);i>0&&(o+=ft.boostAccel,i-=ft.boostPerSecond*r),e=Math.min(ft.carMaxSpeed*this.d.speed,e+o*r),n+=e*r,this.reach[a]=n}}reachIn(t){let e=Math.floor(t*60);return e<0?0:this.reach[Math.min(e,this.reach.length-1)]}findIntercept(t,e){let i=this.car;Dc.y=ft.gravity,this.computeReach();let n=t.prediction,r=5+this.d.aerial*10;for(let a=0;a<n.length;a+=2){let o=n[a],l=o.pos.y,c=Ei(i,o.pos),h=Math.abs(c.angle)*.32,f=Math.max(0,c.dist-1.4);if(l<1.9){if(this.reachIn(o.t-h)>=f)return{slice:o,kind:"ground"}}else if(l<3.3&&this.d.flips>.5){if(this.reachIn(o.t-h-.15)>=f)return{slice:o,kind:"jump"}}else if(e&&l<r&&i.boost>25&&o.t>.6){let u=o.t,d=Li.copy(o.pos).sub(i.pos).addScaledVector(i.vel,-u);d.y-=3*u,d.multiplyScalar(2/(u*u)).sub(Dc);let m=i.boost/ft.boostPerSecond;if(d.length()<ft.boostAccel*.8&&m>u*.8&&Math.abs(c.angle)<.5)return{slice:o,kind:"aerial"}}}return null}makePlan(t){let e=this.car,i=t.ball,n=e.team,r=n===0?1:-1,a=Su(n);this.aimOffset=(Math.random()-.5)*(1-this.d.aim)*12;let o=t.cars.filter(d=>d.team===n&&!d.demolished);if(t.kickoff&&i.vel.lengthSq()<.01&&Math.abs(i.pos.x)+Math.abs(i.pos.z)<.1){let m=o.slice().sort((x,g)=>{let p=x.pos.length()-g.pos.length();return Math.abs(p)>.5?p:g.pos.x*r-x.pos.x*r}).indexOf(e);return m===0?{kind:"kickoff"}:m===1?this.boostPlan(t,!0)||{kind:"defend"}:{kind:"defend"}}let l=Lc(t.prediction,3),c=l&&l.team!==n,h=null,f=1/0;for(let d of o){let m=(i.pos.z-d.pos.z)*r>-1,x=d.pos.distanceTo(i.pos)+(m?0:18);d.isBot||(x-=4),d===e&&(x-=1),x<f&&(f=x,h=d)}if(h===e||c&&this.closestToGoal(o,a)===e){let d=this.findIntercept(t,this.d.aerial>0&&(!c||this.d.aerial>.7));if(!d)return{kind:"chase"};let m=d.slice.pos;if(!((m.z-e.pos.z)*r>.5)&&!c){let g=e.pos.x>m.x?1:-1,p=m.z-r*9;return{kind:"rotate",target:new w(xi(m.x+g*6,-ee.W+4,ee.W-4),0,xi(p,-ee.L+3,ee.L-3))}}return d.kind==="aerial"?{kind:"aerial",target:m.clone(),arrival:t.time+d.slice.t}:{kind:"attack",ball:m.clone(),arrival:t.time+d.slice.t,jump:d.kind==="jump",save:c,allowBoost:Math.random()<this.d.boostUse}}if(e.boost<40&&!c){let d=this.boostPlan(t,!1);if(d)return d}if(!c&&this.d.aerial>.7&&e.boost>45&&t.time-(this.lastDemoTry||-99)>12&&Math.random()<.05){this.lastDemoTry=t.time;let d=null,m=30;for(let x of t.cars){if(x.team===n||x.demolished)continue;let g=Ei(e,x.pos);Math.abs(g.angle)<.5&&g.dist<m&&(m=g.dist,d=x)}if(d)return{kind:"demo",prey:d,until:t.time+3}}if(o.filter(d=>d!==h).indexOf(e)===0&&o.length>2){let d=i.pos.clone().lerp(new w(0,0,a),.45);return d.x=xi(d.x-Math.sign(i.pos.x||1)*6,-ee.W+6,ee.W-6),d.y=0,{kind:"support",target:d}}return{kind:"defend"}}closestToGoal(t,e){let i=null,n=1/0;for(let r of t){let a=Math.abs(r.pos.z-e)+Math.abs(r.pos.x)*.5;a<n&&(n=a,i=r)}return i}boostPlan(t,e){let i=this.car,n=i.team===0?1:-1,r=null,a=1/0;for(let o of t.pads){if(!o.big||!o.active)continue;let l=o.pos.z*n<=.1,c=i.pos.distanceTo(o.pos)+(l?0:25)+(e&&Math.abs(o.pos.z)<1?50:0);c<a&&(a=c,r=o)}return!r||!e&&a>45?null:{kind:"boost",target:r.pos.clone()}}execute(t,e,i){let n=this.car,r=this.plan,a=i.ball,o=n.team,l=o===0?1:-1,c=Su(o),h=Pu(n);switch(r.kind){case"kickoff":{let f=Ei(n,a.pos),u=Li.copy(a.pos);if(u.z-=l*.9,this.driveTo(e,u,23,!0),f.dist<1.7+h*.17&&h>10){let d=f.angle;this.maneuver=new yr(Math.cos(d),xi(Math.sin(d)*1.5,-1,1),!0)}break}case"attack":{let f=r.ball,u=Math.max(r.arrival-i.time,.02);if(r.arrival<i.time-.3){this.planTimer=0;break}let d=-c,m=xi(f.x*.25+this.aimOffset,-ee.GW+1.8,ee.GW-1.8);r.save&&Math.abs(f.z-c)<25&&(m=f.x>0?ee.W:-ee.W);let x=Ka.set(m-f.x,0,d+l*3-f.z).normalize(),g=Ei(n,f),p=xi(g.dist*.4,1.3,7),M=new w(f.x-x.x*p,0,f.z-x.z*p);(Math.abs(M.x)>ee.W-1.5||Math.abs(M.z)>ee.L-1.5)&&M.set(f.x,0,f.z);let v=Ei(n,M).dist/u+2;g.dist>25&&(v=23),this.driveTo(e,M,v*this.d.speed,r.allowBoost),n.forward(Mr);let T=Mr.x*x.x+Mr.z*x.z;if(r.jump){let E=Math.hypot(f.x-n.pos.x,f.z-n.pos.z);u<.55&&E<h*u+2.2&&Math.abs(g.angle)<.5&&(this.maneuver=new Iu(this,f,r.arrival))}else if(n.pos.distanceTo(a.pos)<2.4+h*.13&&a.pos.y<2&&Math.abs(g.angle)<.35&&T>.55&&h>7&&Math.random()<this.d.flips*.25){let C=Ei(n,a.pos).angle;this.maneuver=new yr(Math.cos(C),xi(Math.sin(C)*1.6,-1,1))}break}case"aerial":{let f=Ei(n,r.target);Math.abs(f.angle)<.25||r.arrival-i.time<1.2?this.maneuver=new Lu(r.target,r.arrival):this.driveTo(e,Li.set(r.target.x,0,r.target.z),10,!1);break}case"rotate":case"support":case"boost":{let f=Ei(n,r.target),u=r.kind==="support"?xi(f.dist*1.2,4,23):23;this.driveTo(e,r.target,u,r.kind!=="support"&&this.d.boostUse>.5),f.dist<2&&(this.planTimer=0);break}case"demo":{let f=r.prey;if(f.demolished||i.time>r.until){this.planTimer=0;break}let u=Math.min(1.5,n.pos.distanceTo(f.pos)/Math.max(10,h)),d=Li.copy(f.pos).addScaledVector(f.vel,u);d.y=0,this.driveTo(e,d,23,!0),e.boost=n.boost>0&&Math.abs(Ei(n,d).angle)<.35,this.planTimer=Math.max(this.planTimer,.3);break}case"chase":{this.driveTo(e,Li.set(a.pos.x,0,a.pos.z-l*3),16,!1);break}default:{let f=a.pos.x>0?-1:1,u=Li.set(f*3.5,0,c+l*3.5),d=Ei(n,u);if(d.dist>4)this.driveTo(e,u,xi(d.dist*1.1,5,23),d.dist>25);else{let m=Ei(n,a.pos);e.steer=xi(m.angle*2.5,-1,1),e.throttle=Math.abs(m.angle)>.3?.35:h>.5?-.3:0,Math.abs(m.angle)>2.2&&(e.throttle=-.4),this.planTimer=Math.min(this.planTimer,.2)}break}}}driveTo(t,e,i,n){let r=this.car,a=Ei(r,e),o=Pu(r);t.steer=xi(a.angle*3.2,-1,1),t.handbrake=Math.abs(a.angle)>1.6&&o>7&&a.dist>2.5,i>o+.3?t.throttle=1:i<o-3?t.throttle=-1:t.throttle=.1,Math.abs(a.angle)>2.4&&a.dist<6&&o<4&&(t.throttle=-1,t.steer=-t.steer),t.boost=n&&r.boost>0&&Math.abs(a.angle)<.3&&i>o+1.5&&o<ft.carMaxSpeed-.3&&r.groundNormal.y>.7}};function Di(s,t){let e=document.createElement("canvas");return e.width=s,e.height=t,[e,e.getContext("2d")]}function Yn(s,t=!1){let e=new gn(s);return e.colorSpace=We,e.anisotropy=8,t&&(e.wrapS=e.wrapT=pn),e}function nM(s,t,e,i,n,r){s.beginPath(),s.moveTo(t+r,e),s.lineTo(t+i-r,e),s.arcTo(t+i,e,t+i,e+r,r),s.lineTo(t+i,e+n-r),s.arcTo(t+i,e+n,t+i-r,e+n,r),s.lineTo(t+r,e+n),s.arcTo(t,e+n,t,e+n-r,r),s.lineTo(t,e+r),s.arcTo(t,e,t+r,e,r),s.closePath()}function Lp(s){let{W:t,L:e,RC:i,GW:n}=ee,r=20,a=Math.round(t*2*r),o=Math.round(e*2*r),[l,c]=Di(a,o),h=g=>(g+t)*r,f=g=>(e-g)*r;c.fillStyle=s.grassA,c.fillRect(0,0,a,o);let u=16;for(let g=0;g<u;g++)g%2||(c.fillStyle=s.grassB,c.fillRect(0,o/u*g,a,o/u));let d=c.createLinearGradient(0,0,0,o);d.addColorStop(0,"rgba(255,120,20,0.20)"),d.addColorStop(.45,"rgba(255,120,20,0.0)"),d.addColorStop(.55,"rgba(40,110,255,0.0)"),d.addColorStop(1,"rgba(40,110,255,0.22)"),c.fillStyle=d,c.fillRect(0,0,a,o);for(let g=0;g<26e3;g++){let p=Math.random()*.06;c.fillStyle=Math.random()<.5?`rgba(0,0,0,${p})`:`rgba(255,255,255,${p})`,c.fillRect(Math.random()*a,Math.random()*o,2+Math.random()*3,2+Math.random()*3)}c.strokeStyle="rgba(255,255,255,0.85)",c.lineWidth=.28*r;let m=3.4;nM(c,h(-t+m),f(e-m),(t-m)*2*r,(e-m)*2*r,(i-2)*r),c.stroke(),c.beginPath(),c.moveTo(h(-t+m),f(0)),c.lineTo(h(t-m),f(0)),c.stroke(),c.beginPath(),c.arc(h(0),f(0),10*r,0,Math.PI*2),c.stroke(),c.beginPath(),c.arc(h(0),f(0),.9*r,0,Math.PI*2),c.fillStyle="rgba(255,255,255,0.85)",c.fill();for(let g of[1,-1]){let p=g*(e-m),M=n+6,S=11*g;c.beginPath(),c.moveTo(h(-M),f(p)),c.lineTo(h(-M+2),f(p-S)),c.lineTo(h(M-2),f(p-S)),c.lineTo(h(M),f(p)),c.stroke(),c.beginPath(),c.arc(h(0),f(p-S),5*r,g>0?0:Math.PI,g>0?Math.PI:Math.PI*2),c.stroke()}for(let g of fr())c.beginPath(),c.arc(h(g.pos.x),f(g.pos.z),(g.big?2.2:1.3)*r,0,Math.PI*2),c.fillStyle="rgba(20,20,20,0.35)",c.fill(),c.lineWidth=.12*r,c.strokeStyle="rgba(255,200,80,0.6)",c.stroke();c.save(),c.translate(h(0),f(0)),c.rotate(-Math.PI/2),c.font=`italic 900 ${3.2*r}px Arial Black, Arial, sans-serif`,c.textAlign="center",c.textBaseline="middle",c.fillStyle="rgba(255,255,255,0.22)",c.fillText("SUPERSONIC",0,-1.7*r),c.fillText("ARENA",0,1.9*r),c.restore();let x=Yn(l);return x.generateMipmaps=!0,x}function Dp(){let e=Math.round(Math.sqrt(3)*32),[i,n]=Di(192,e*2);n.clearRect(0,0,192,e*2),n.strokeStyle="rgba(255,255,255,1)",n.lineWidth=2.2;let r=(a,o)=>{n.beginPath();for(let l=0;l<=6;l++){let c=Math.PI/3*l,h=a+Math.cos(c)*(32-1.5),f=o+Math.sin(c)*(e/2-1.5);l===0?n.moveTo(h,f):n.lineTo(h,f)}n.stroke()};for(let a=-1;a<6;a++)for(let o=-1;o<4;o++)r(a*1.5*32,o*e+(a%2?e/2:0));return Yn(i,!0)}function Np(){let[s,t]=Di(128,128);t.clearRect(0,0,128,128),t.strokeStyle="rgba(255,255,255,0.9)",t.lineWidth=3;for(let e=0;e<=128;e+=32)t.beginPath(),t.moveTo(e,0),t.lineTo(e,128),t.stroke(),t.beginPath(),t.moveTo(0,e),t.lineTo(128,e),t.stroke();return Yn(s,!0)}function Up(){let[s,t]=Di(256,128);t.fillStyle="#9aa3b5",t.fillRect(0,0,256,128),t.strokeStyle="rgba(40,45,60,0.8)",t.lineWidth=3,t.strokeRect(2,2,252,124),t.fillStyle="rgba(255,255,255,0.08)";for(let e=0;e<6;e++)t.fillRect(12+e*40,20,24,88);return Yn(s,!0)}function Fp(){let[e,i]=Di(1024,512),[n,r]=Di(1024,512),a=(1+Math.sqrt(5))/2,o=[],l=u=>{let d=Math.hypot(...u);return u.map(m=>m/d)},c=[];for(let u of[-1,1])for(let d of[-1,1])c.push([0,u,d*a],[u,d*a,0],[d*a,0,u]);for(let u of c)o.push({d:l(u),pent:!0});for(let u of[-1,1])for(let d of[-1,1])for(let m of[-1,1])o.push({d:l([u,d,m]),pent:!1});for(let u of[-1,1])for(let d of[-1,1])o.push({d:l([0,u/a,d*a]),pent:!1}),o.push({d:l([u/a,d*a,0]),pent:!1}),o.push({d:l([d*a,0,u/a]),pent:!1});let h=i.createImageData(1024,512),f=r.createImageData(1024,512);for(let u=0;u<512;u++){let d=(u+.5)/512*Math.PI,m=Math.sin(d),x=Math.cos(d);for(let g=0;g<1024;g++){let p=(g+.5)/1024*Math.PI*2,M=-Math.cos(p)*m,S=x,v=Math.sin(p)*m,T=-2,E=-2,C=null;for(let L of o){let W=M*L.d[0]+S*L.d[1]+v*L.d[2];W>T?(E=T,T=W,C=L):W>E&&(E=W)}let y=T-E,A=(u*1024+g)*4,I,D,B;C.pent?(I=58,D=62,B=72):(I=214,D=219,B=226);let k=Math.min(1,y*18);I*=.55+.45*k,D*=.55+.45*k,B*=.55+.45*k,h.data[A]=I,h.data[A+1]=D,h.data[A+2]=B,h.data[A+3]=255;let P=y<.012?1:0;f.data[A]=P*90,f.data[A+1]=P*200,f.data[A+2]=P*255,f.data[A+3]=255}}return i.putImageData(h,0,0),r.putImageData(f,0,0),{map:Yn(e),emissiveMap:Yn(n)}}function Bp(){let[s,t]=Di(1024,512),e=64,i=["#2f7bff","#ff8a1f","#f2f2f2","#3a4152","#7fa8ff","#ffb56b","#c23b3b","#26282f","#f5d547","#2ea86b"],n=["#f1c9a5","#d9a47a","#a8744f","#6f4a33","#e8b894"];for(let a=0;a<8;a++){let o=a*e,l=t.createLinearGradient(0,o,0,o+e);l.addColorStop(0,"#2a2e38"),l.addColorStop(.7,"#1a1d24"),l.addColorStop(1,"#0e1014"),t.fillStyle=l,t.fillRect(0,o,1024,e),t.fillStyle="rgba(255,255,255,0.06)",t.fillRect(0,o+e-6,1024,2);for(let c=6+a%2*14;c<1024;c+=28){if(Math.random()<.12){t.fillStyle="#3b3f4a",t.fillRect(c,o+30,20,26);continue}let h=Math.random()<.15?-8:0;t.fillStyle=i[Math.random()*i.length|0],t.beginPath(),t.moveTo(c,o+58+h),t.quadraticCurveTo(c+11,o+18+h,c+22,o+58+h),t.fill(),t.fillStyle=n[Math.random()*n.length|0],t.beginPath(),t.arc(c+11,o+20+h,7,0,Math.PI*2),t.fill(),Math.random()<.2&&(t.strokeStyle=t.fillStyle,t.lineWidth=4,t.beginPath(),t.moveTo(c+4,o+34+h),t.lineTo(c-2,o+12+h),t.moveTo(c+18,o+34+h),t.lineTo(c+24,o+12+h),t.stroke())}}let r=Yn(s,!0);return r.anisotropy=16,r}function Op(){let t=new Float32Array(65536);for(let l=0;l<t.length;l++)t[l]=Math.random();let e=l=>{let c=new Float32Array(65536);for(let h=0;h<256;h++)for(let f=0;f<256;f++){let u=0;for(let d=-1;d<=1;d++)for(let m=-1;m<=1;m++)u+=l[(h+d+256)%256*256+(f+m+256)%256];c[h*256+f]=u/9}return c},i=e(e(t)),[n,r]=Di(256,256),a=r.createImageData(256,256);for(let l=0;l<256;l++)for(let c=0;c<256;c++){let h=i[l*256+(c+1)%256]-i[l*256+(c-1+256)%256],f=i[(l+1)%256*256+c]-i[(l-1+256)%256*256+c],u=-h*6,d=-f*6,m=Math.hypot(u,d,1),x=(l*256+c)*4;a.data[x]=(u/m*.5+.5)*255,a.data[x+1]=(d/m*.5+.5)*255,a.data[x+2]=(1/m*.5+.5)*255,a.data[x+3]=255}r.putImageData(a,0,0);let o=new gn(n);return o.wrapS=o.wrapT=pn,o.anisotropy=8,o}function zp(){let[s,t]=Di(128,64);t.save(),t.scale(1,.5);let e=t.createRadialGradient(64,64,4,64,64,62);return e.addColorStop(0,"rgba(0,0,0,0.85)"),e.addColorStop(.55,"rgba(0,0,0,0.5)"),e.addColorStop(1,"rgba(0,0,0,0)"),t.fillStyle=e,t.fillRect(0,0,128,128),t.restore(),new gn(s)}function kp(){let[s,t]=Di(64,64),e=t.createRadialGradient(32,32,0,32,32,32);return e.addColorStop(0,"rgba(0,0,0,0.75)"),e.addColorStop(.6,"rgba(0,0,0,0.45)"),e.addColorStop(1,"rgba(0,0,0,0)"),t.fillStyle=e,t.fillRect(0,0,64,64),new gn(s)}function Vp(s,t){let[e,i]=Di(256,64);i.font="bold 34px Segoe UI, Arial, sans-serif",i.textAlign="center",i.textBaseline="middle",i.lineWidth=6,i.strokeStyle="rgba(0,0,0,0.7)",i.strokeText(s,128,32),i.fillStyle=t,i.fillText(s,128,32);let n=new gn(e);n.colorSpace=We;let r=new Xs({map:n,depthTest:!1,transparent:!0,sizeAttenuation:!1}),a=new jr(r);return a.scale.set(.16,.04,1),a.renderOrder=10,a}function Hp(s){let[t,e]=Di(512,256),i=s===0?["#0b2d7a","#2f7bff"]:["#7a2c05","#ff8a1f"],n=e.createLinearGradient(0,0,512,256);return n.addColorStop(0,i[0]),n.addColorStop(1,i[1]),e.fillStyle=n,e.fillRect(0,0,512,256),e.font="italic 900 70px Arial Black, Arial, sans-serif",e.textAlign="center",e.textBaseline="middle",e.fillStyle="rgba(255,255,255,0.92)",e.fillText(s===0?"BLEU":"ORANGE",256,128),Yn(t)}var{W:ai,L:me,H:bn,RC:Du,RV:Se,GW:Qe,GH:ri,GD:fi}=ee,Gp=new ct(3111935),Wp=new ct(16747039),Xp=new ct(16777215),Nu=class{constructor(){this.pos=[],this.nor=[],this.uv=[],this.col=[],this.idx=[],this.groups=[],this.cur=null}vertex(t,e,i,n,r=Xp){return this.pos.push(t.x,t.y,t.z),this.nor.push(e.x,e.y,e.z),this.uv.push(i,n),this.col.push(r.r,r.g,r.b),this.pos.length/3-1}group(t){this.cur&&this.cur.mat===t||(this.cur={start:this.idx.length,count:0,mat:t},this.groups.push(this.cur))}tri(t,e,i){let n=this.pos,r=n[t*3],a=n[t*3+1],o=n[t*3+2],l=n[e*3]-r,c=n[e*3+1]-a,h=n[e*3+2]-o,f=n[i*3]-r,u=n[i*3+1]-a,d=n[i*3+2]-o,m=c*d-h*u,x=h*f-l*d,g=l*u-c*f,p=this.nor;m*(p[t*3]+p[e*3]+p[i*3])+x*(p[t*3+1]+p[e*3+1]+p[i*3+1])+g*(p[t*3+2]+p[e*3+2]+p[i*3+2])>=0?this.idx.push(t,e,i):this.idx.push(t,i,e),this.cur.count+=3}quad(t,e,i,n){this.tri(t,e,i),this.tri(t,i,n)}build(){let t=new xe;return t.setAttribute("position",new Yt(this.pos,3)),t.setAttribute("normal",new Yt(this.nor,3)),t.setAttribute("uv",new Yt(this.uv,2)),t.setAttribute("color",new Yt(this.col,3)),t.setIndex(this.idx),t}};function br(s,t=1){let e=ui.smoothstep(s,-12,12),i=Gp.clone().lerp(Wp,e);return Xp.clone().lerp(i,t)}function sM(){let s=ai-Se,t=me-Se,e=Du-Se,i=[],n=(l,c,h,f,u)=>i.push({x:l,z:c,nx:h,nz:f,back:u}),r=(l,c,h,f,u,d,m,x=[])=>{let g=Math.hypot(h-l,f-c),p=Math.ceil(g/2.5),M=new Set;for(let S=0;S<p;S++)M.add(S/p);for(let S of x)M.add((S-l)/(h-l));[...M].sort((S,v)=>S-v).forEach(S=>n(l+(h-l)*S,c+(f-c)*S,u,d,m))},a=(l,c,h,f)=>{for(let d=0;d<12;d++){let m=h+(f-h)*d/12;n(l+Math.cos(m)*e,c+Math.sin(m)*e,Math.cos(m),Math.sin(m),0)}};r(s,-(t-e),s,t-e,1,0,0),a(s-e,t-e,0,Math.PI/2),r(s-e,t,-(s-e),t,0,1,1,[Qe,-Qe]),a(-(s-e),t-e,Math.PI/2,Math.PI),r(-s,t-e,-s,-(t-e),-1,0,0),a(-(s-e),-(t-e),Math.PI,Math.PI*1.5),r(-(s-e),-t,s-e,-t,0,-1,-1,[-Qe,Qe]),a(s-e,-(t-e),Math.PI*1.5,Math.PI*2),i.push({...i[0]});let o=0;for(let l=0;l<i.length;l++)l>0&&(o+=Math.hypot(i[l].x-i[l-1].x,i[l].z-i[l-1].z)),i[l].s=o;return i}function rM(){let s=[];for(let n=0;n<=10;n++){let r=n/10*Math.PI/2;s.push({o:Se*Math.sin(r),y:Se*(1-Math.cos(r)),no:-Math.sin(r),ny:Math.cos(r)})}for(let n of[4.1,4.5,ri,9,12,15,bn-Se-.45,bn-Se])s.push({o:Se,y:n,no:-1,ny:0});let e=8;for(let n=1;n<=e;n++){let r=n/e*Math.PI/2;s.push({o:Se*Math.cos(r),y:bn-Se+Se*Math.sin(r),no:-Math.cos(r),ny:-Math.sin(r)})}let i=0;for(let n=0;n<s.length;n++)n>0&&(i+=Math.hypot(s[n].o-s[n-1].o,s[n].y-s[n-1].y)),s[n].v=i;return s}function aM(s,t,e){let i=new Ln;return i.moveTo(-s+e,-t),i.lineTo(s-e,-t),i.absarc(s-e,-t+e,e,-Math.PI/2,0,!1),i.lineTo(s,t-e),i.absarc(s-e,t-e,e,0,Math.PI/2,!1),i.lineTo(-s+e,t),i.absarc(-s+e,t-e,e,Math.PI/2,Math.PI,!1),i.lineTo(-s,-t+e),i.absarc(-s+e,-t+e,e,Math.PI,Math.PI*1.5,!1),i}function qp(s,t){let e=new Ue,i=Dp(),n={ramp:new Ae({color:16777215,vertexColors:!0,roughness:.55,metalness:.35,map:Up()}),stripe:new fe({vertexColors:!0,toneMapped:!1}),glass:new Ae({color:9419007,vertexColors:!0,transparent:!0,opacity:s.glassOpacity,roughness:.1,metalness:.6,depthWrite:!1,side:ze})};n.ramp.map.repeat.set(1/4,1/4),n.ramp.map.wrapS=n.ramp.map.wrapT=pn;let r=sM(),a=rM(),o=new Nu,l=[],c=new w,h=new w;for(let P=0;P<r.length;P++){let L=r[P],W=[];for(let z=0;z<a.length;z++){let $=a[z];c.set(L.x+L.nx*$.o,$.y,L.z+L.nz*$.o),h.set(L.nx*$.no,$.ny,L.nz*$.no);let X;$.y>4.05&&$.y<4.55?X=br(c.z,1).multiplyScalar(1.6):$.y>bn-Se-.5&&$.y<bn-Se+.05?X=br(c.z,.7).multiplyScalar(1.3):$.y<=4.1?X=br(c.z,.35):X=br(c.z,.8),W.push(o.vertex(c,h,L.s/4,$.v/4,X))}l.push(W)}let f=P=>r[P].back!==0&&Math.abs(r[P].x)<=Qe+1e-6,u=[{mat:0,test:(P,L)=>L.y<=4.1+1e-6},{mat:1,test:(P,L)=>P.y>=4.1-1e-6&&L.y<=4.5+1e-6},{mat:1,test:(P,L)=>P.y>=bn-Se-.45-1e-6&&L.y<=bn-Se+1e-6},{mat:2,test:(P,L)=>P.y>=4.5-1e-6&&!(P.y>=bn-Se-.45-1e-6&&L.y<=bn-Se+1e-6)}];for(let P of u){o.group(P.mat);for(let L=0;L<r.length-1;L++){let W=f(L)&&f(L+1)&&r[L].back===r[L+1].back;for(let z=0;z<a.length-1;z++)P.test(a[z],a[z+1])&&(W&&a[z+1].y<=ri+1e-6||o.quad(l[L][z],l[L+1][z],l[L+1][z+1],l[L][z+1]))}}o.group(0);for(let P of[1,-1])for(let L of[1,-1]){h.set(-L,0,0);let W=o.vertex(c.set(L*Qe,0,P*me),h,0,0,br(P*me,.35)),z=[];for(let $=0;$<=10;$++){let X=$/10*Math.PI/2;z.push(o.vertex(c.set(L*Qe,Se*(1-Math.cos(X)),P*(me-Se+Se*Math.sin(X))),h,0,0,br(P*me,.35)))}for(let $=0;$<10;$++)o.tri(W,z[$],z[$+1])}let d=o.build();for(let P of o.groups)d.addGroup(P.start,P.count,P.mat);let m=new St(d,[n.ramp,n.stripe,n.glass]);m.receiveShadow=t.shadows,e.add(m);let x=d.clone();x.clearGroups();let g=o.groups.filter(P=>P.mat===2);for(let P of g)x.addGroup(P.start,P.count,0);let p=x.getAttribute("uv");for(let P=0;P<p.count;P++)p.setXY(P,p.getX(P)*.5,p.getY(P)*.5);let M=new fe({map:i,vertexColors:!0,transparent:!0,opacity:s.hexOpacity,blending:mi,depthWrite:!1,side:ze,toneMapped:!1});e.add(new St(x,[M]));let S=Lp(s),v=aM(ai-Se,me-Se,Du-Se),T=new xa(v,24);T.rotateX(-Math.PI/2);let E=T.getAttribute("position"),C=T.getAttribute("uv");for(let P=0;P<E.count;P++)C.setXY(P,(E.getX(P)+ai)/(2*ai),(E.getZ(P)+me)/(2*me));T.computeVertexNormals();let y=Op();y.repeat.set(70,88);let A=new Ae({map:S,roughness:.86,metalness:0,normalMap:y,normalScale:new nt(.16,.16),envMapIntensity:.35}),I=new St(T,A);I.receiveShadow=t.shadows,e.add(I);let D=Np();for(let P of[0,1]){let L=P===0?-1:1,W=P===0?Gp:Wp,z=new Ue,$=new St(new je(Qe*2,Se+fi),new Ae({color:1711396,roughness:.9}));$.rotation.x=-Math.PI/2,$.position.set(0,.002,L*(me-Se+(Se+fi)/2)),$.receiveShadow=t.shadows,z.add($);let X=new Ae({color:W.clone().multiplyScalar(.12),roughness:.8,side:ze}),Q=new fe({map:D,color:W,transparent:!0,opacity:.8,blending:mi,depthWrite:!1,side:ze,toneMapped:!1}),tt=(zt,Et,kt,re,j,rt,ot)=>{let lt=new je(zt,Et),dt=new St(lt,X);dt.position.copy(kt),dt.rotation.set(j,re,0),z.add(dt);let Vt=D.clone();Vt.repeat.set(rt,ot),Vt.needsUpdate=!0;let Lt=new St(lt,Q.clone());Lt.material.map=Vt,Lt.position.copy(kt).multiplyScalar(1),Lt.rotation.copy(dt.rotation),Lt.translateZ(.06),z.add(Lt)};tt(Qe*2,ri,new w(0,ri/2,L*(me+fi)),L>0?Math.PI:0,0,Qe*2/1.6,ri/1.6),tt(fi,ri,new w(Qe,ri/2,L*(me+fi/2)),-Math.PI/2,0,fi/1.6,ri/1.6),tt(fi,ri,new w(-Qe,ri/2,L*(me+fi/2)),Math.PI/2,0,fi/1.6,ri/1.6);let ht=new St(new je(Qe*2,fi),X);ht.rotation.x=Math.PI/2,ht.position.set(0,ri,L*(me+fi/2)),z.add(ht);let at=new fe({color:W.clone().multiplyScalar(2.2),toneMapped:!1}),Ct=.22,Bt=new St(new ve(Ct,ri+Ct,Ct),at);Bt.position.set(Qe+Ct/2,ri/2,L*(me-.05));let Xt=Bt.clone();Xt.position.x=-Qe-Ct/2;let Y=new St(new ve(Qe*2+Ct*2,Ct,Ct),at);Y.position.set(0,ri+Ct/2,L*(me-.05)),z.add(Bt,Xt,Y);let K=new St(new ve((ai-Du)*2-2,.16,.08),at);K.position.set(0,ri+1.6,L*(me-.03)),z.add(K);let pt=new St(new je(Qe*2,.35),at);pt.rotation.x=-Math.PI/2,pt.position.set(0,.01,L*(me+.9)),z.add(pt),e.add(z)}let B=lM(s);e.add(B);let k=oM();return e.add(k.group),{group:e,updatePads:k.update}}function oM(){let s=new Ue,t=fr(),e=[],i=new pi(.62,.72,.08,24),n=new pi(1.25,1.45,.12,32),r=new ma(.5,2),a=new xn(1.1,.06,8,40);for(let h of t){let f=new fe({color:new ct(16758062).multiplyScalar(h.big?2.2:1.6),toneMapped:!1}),u=new Ae({color:3354666,roughness:.5,metalness:.6,emissive:16752922,emissiveIntensity:.5}),d={pad:null,base:null,orb:null,ring:null,on:f,baseMat:u,phase:Math.random()*6};h.big?(d.base=new St(n,u),d.base.position.set(h.pos.x,.06,h.pos.z),d.orb=new St(r,f),d.orb.position.set(h.pos.x,1,h.pos.z),d.ring=new St(a,f),d.ring.rotation.x=Math.PI/2,d.ring.position.set(h.pos.x,.18,h.pos.z),s.add(d.base,d.orb,d.ring)):(d.base=new St(i,f),d.base.position.set(h.pos.x,.04,h.pos.z),s.add(d.base)),e.push(d)}let o=new Ae({color:2763306,roughness:.7}),l=0;function c(h,f){l+=h,f.forEach((u,d)=>{let m=e[d];u.big?(m.orb.visible=u.active,m.ring.visible=u.active,m.orb.position.y=1+Math.sin(l*2+m.phase)*.15,m.orb.rotation.y+=h*1.5,m.baseMat.emissiveIntensity=u.active?.6:.05):m.base.material=u.active?m.on:o})}return{group:s,update:c}}function lM(s){let t=new Ue,e=new St(new je(900,900),new Ae({color:s.outside,roughness:1}));e.rotation.x=-Math.PI/2,e.position.y=-.05,t.add(e);let i=Bp(),n=new Ae({map:i,roughness:.9,color:s.crowdTint}),r=new Ae({color:s.structure,roughness:.8,metalness:.2}),a=(x,g,p)=>{let M=new Ln;M.moveTo(0,0),M.lineTo(g,p),M.lineTo(g+3,p),M.lineTo(g+3,0),M.closePath();let S=new pa(M,{depth:x,bevelEnabled:!1});S.translate(0,0,-x/2);let v=S.getAttribute("uv"),T=S.getAttribute("position");for(let C=0;C<v.count;C++)v.setXY(C,T.getZ(C)/14.4,(T.getX(C)+T.getY(C))/10);return new St(S,[r,n])},o=me*2+10;for(let x of[1,-1]){let g=a(o,26,24);g.rotation.y=x>0?0:Math.PI,g.position.set(x*(ai+6),2,0),t.add(g);let p=a(ai*2+6,22,20);p.rotation.y=x>0?-Math.PI/2:Math.PI/2,p.position.set(0,2,x*(me+fi+8)),t.add(p)}for(let x of[1,-1]){let g=new St(new ve(8,2.2,me*2+fi*2+20),r);g.position.set(x*(ai+3.5),1.1,0);let p=new St(new ve(ai*2+15,2.2,10),r);p.position.set(0,1.1,x*(me+fi+4.5)),t.add(g,p)}let l=new fe({color:new ct(s.lamp).multiplyScalar(2.5),toneMapped:!1});for(let x of[-1,1])for(let g of[-1,1]){let p=new St(new pi(.8,1.2,46,8),r);p.position.set(x*(ai+38),23,g*(me+30));let M=new St(new ve(10,5,1.5),l);M.position.set(x*(ai+36),47,g*(me+28)),M.lookAt(0,0,0),t.add(p,M)}for(let x of[0,1]){let g=x===0?-1:1,p=new St(new je(30,14),new fe({map:Hp(x),toneMapped:!1}));p.position.set(0,34,g*(me+36)),p.rotation.y=g>0?Math.PI:0,t.add(p);let M=new St(new ve(31,15,1),r);M.position.set(0,34,g*(me+36.6)),t.add(M)}let c=new fe({color:new ct(s.rim).multiplyScalar(1.5),toneMapped:!1}),h=new Ae({color:new ct(s.structure).multiplyScalar(.7),roughness:.5,metalness:.7});for(let x of[1,-1]){let g=new St(new ve(30,.8,o+6),h);g.position.set(x*(ai+24),33,0),g.rotation.z=x*.1,t.add(g);let p=new St(new ve(.5,.5,o+6),c);p.position.set(x*(ai+9.2),31.2,0),t.add(p);for(let S=-me;S<=me;S+=9){let v=new St(new ve(1.4,.4,2.2),l);v.position.set(x*(ai+10.5),31.6,S),t.add(v)}for(let S=-me;S<=me+1;S+=17){let v=new St(new pi(.5,.6,8,8),h);v.position.set(x*(ai+37),30,S),t.add(v)}let M=new St(new ve(ai*2+20,.6,.6),c);M.position.set(0,24,x*(me+fi+32)),t.add(M)}let f=(()=>{let x=12345;return()=>(x=x*16807%2147483647)/2147483647})(),u=140,d=new ia(new ve(1,1,1),new Ae({color:s.skyline??3818064,roughness:.9,metalness:.1}),u),m=new le;for(let x=0;x<u;x++){let g=x/u*Math.PI*2+f()*.03,p=280+f()*170,M=20+Math.pow(f(),2)*130,S=14+f()*26;m.compose(new w(Math.cos(g)*p,M/2-1,Math.sin(g)*p),new ae().setFromAxisAngle(new w(0,1,0),-g),new w(S,M,10+f()*20)),d.setMatrixAt(x,m)}return t.add(d),t}var cM=`uniform vec3 top; uniform vec3 horizon; uniform vec3 bottom; uniform vec3 sunDir; uniform vec3 sunColor;
uniform float coverage; uniform vec3 cloudColor; varying vec3 vDir;
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p); vec2 f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}
float fbm(vec2 p) { float v = 0.0; float a = 0.5; for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; } return v; }
void main() {
  vec3 d = normalize(vDir);
  float h = d.y;
  vec3 c = h > 0.0 ? mix(horizon, top, pow(h, 0.55)) : mix(horizon, bottom, pow(-h, 0.4));
  float s = max(dot(d, sunDir), 0.0);
  c += sunColor * (pow(s, 600.0) * 4.0 + pow(s, 12.0) * 0.35);
  if (h > 0.0 && coverage > 0.0) {
    vec2 uv = d.xz / (h + 0.15) * 1.3;
    float n = fbm(uv + vec2(3.1, 1.7));
    float cl = smoothstep(1.0 - coverage, 1.0 - coverage + 0.3, n) * smoothstep(0.0, 0.2, h);
    float lit = 0.72 + 0.28 * fbm(uv * 2.0 + 5.0) + pow(s, 6.0) * 0.6;
    c = mix(c, cloudColor * lit, cl * 0.9);
  }
  gl_FragColor = vec4(c, 1.0);
}`;function Yp(s){let t=new es,e=Uu(s);e.children[0].scale.setScalar(.3),t.add(e);let i=new St(new pi(160,110,70,32,1,!0),new fe({color:new ct(s.structure).multiplyScalar(.35),side:Ye}));i.position.y=20,t.add(i);let n=new St(new ra(160,32),new fe({color:new ct(s.grassA).multiplyScalar(.5)}));n.rotation.x=-Math.PI/2,n.position.y=-8,t.add(n);let r=new fe({color:new ct(s.lamp).multiplyScalar(3)});for(let l=0;l<8;l++){let c=l/8*Math.PI*2+.4,h=new St(new je(26,8),r);h.position.set(Math.cos(c)*95,60,Math.sin(c)*95),h.lookAt(0,0,0),t.add(h)}let a=new fe({color:new ct(s.rim).multiplyScalar(2)}),o=new St(new xn(120,1.2,6,64),a);return o.rotation.x=Math.PI/2,o.position.y=30,t.add(o),t}function Uu(s){let t=new ss(1200,32,16),e=new we({side:Ye,depthWrite:!1,uniforms:{top:{value:new ct(s.skyTop)},horizon:{value:new ct(s.skyHorizon)},bottom:{value:new ct(s.skyBottom)},sunDir:{value:new w(...s.sunDir).normalize()},sunColor:{value:new ct(s.sunGlow)},coverage:{value:s.clouds??.45},cloudColor:{value:new ct(s.cloudColor??16777215)}},vertexShader:"varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",fragmentShader:cM}),i=new St(t,e);i.renderOrder=-10;let n=new Ue;if(n.add(i),s.stars){let a=new Float32Array(4500);for(let l=0;l<1500;l++){let c=Math.random()*Math.PI*2,h=Math.random()*.9+.08,f=1100;a[l*3]=Math.cos(c)*Math.sqrt(1-h*h)*f,a[l*3+1]=h*f,a[l*3+2]=Math.sin(c)*Math.sqrt(1-h*h)*f}let o=new xe;o.setAttribute("position",new Fe(a,3)),n.add(new is(o,new Ys({color:16777215,size:2.2,sizeAttenuation:!1})))}return n}var ms={day:{label:"Stade (jour)",skyTop:3108816,skyHorizon:12574975,skyBottom:4872810,sunDir:[.35,.8,.25],sunGlow:16774096,sun:16774368,sunIntensity:1.9,hemiSky:13625087,hemiGround:3820080,hemiIntensity:.6,grassA:"#2f7d32",grassB:"#3a8f3c",outside:3885622,crowdTint:16777215,structure:10133674,lamp:16777215,rim:10406911,glassOpacity:.07,hexOpacity:.35,fog:12572912,exposure:1,clouds:.5,cloudColor:16777215,skyline:8885933},sunset:{label:"Coucher de soleil",skyTop:2366034,skyHorizon:16747594,skyBottom:2759210,sunDir:[-.6,.18,.5],sunGlow:16756848,sun:16761232,sunIntensity:1.7,hemiSky:16763296,hemiGround:2761792,hemiIntensity:.8,grassA:"#2c6e36",grassB:"#357d3d",outside:2762288,crowdTint:16767168,structure:5918816,lamp:16769200,rim:16751964,glassOpacity:.08,hexOpacity:.45,fog:8014416,exposure:1,clouds:.55,cloudColor:16753274,skyline:3812420},night:{label:"Nocturne",skyTop:132108,skyHorizon:1319498,skyBottom:329226,sunDir:[.2,.9,-.3],sunGlow:0,sun:14543103,sunIntensity:1.6,hemiSky:6981312,hemiGround:1054752,hemiIntensity:.45,grassA:"#1f5e2a",grassB:"#276b31",outside:856086,crowdTint:11581648,structure:3159103,lamp:15266047,rim:6987007,glassOpacity:.1,hexOpacity:.6,fog:659488,exposure:1.05,stars:!0,clouds:.35,cloudColor:1713216,skyline:790812}};var $p={octane:{body:[[-.66,-.07,.07,.33],[-.62,-.12,.14,.395],[-.45,-.12,.17,.41],[0,-.12,.165,.41],[.3,-.12,.14,.405],[.52,-.11,.09,.39],[.64,-.08,.035,.35],[.675,-.04,0,.3]],cabin:[[-.54,.1,.13,.26],[-.5,.1,.2,.29],[-.32,.1,.33,.3],[-.05,.1,.345,.3],[.12,.1,.28,.305],[.28,.1,.16,.31],[.33,.1,.12,.3]],n:3.2,wheelR:[.17,.19],wheelX:[.37,-.36],wheelZ:.41,spoiler:[-.6,.27]},dominus:{body:[[-.72,-.06,.06,.33],[-.68,-.1,.13,.4],[-.4,-.1,.15,.415],[.1,-.1,.13,.415],[.45,-.1,.09,.4],[.66,-.08,.04,.36],[.73,-.04,0,.3]],cabin:[[-.62,.08,.12,.25],[-.56,.08,.18,.28],[-.35,.08,.27,.29],[-.1,.08,.275,.29],[.05,.08,.22,.3],[.2,.08,.13,.3],[.24,.08,.1,.29]],n:3.4,wheelR:[.16,.17],wheelX:[.42,-.43],wheelZ:.42,spoiler:[-.66,.2]},breakout:{body:[[-.74,-.05,.08,.32],[-.7,-.1,.15,.39],[-.45,-.1,.155,.4],[0,-.1,.12,.4],[.4,-.1,.06,.39],[.68,-.08,.01,.34],[.76,-.05,-.02,.28]],cabin:[[-.58,.07,.12,.23],[-.52,.07,.18,.26],[-.32,.07,.26,.27],[-.1,.07,.25,.27],[.1,.07,.16,.28],[.27,.07,.07,.27]],n:3,wheelR:[.15,.18],wheelX:[.45,-.44],wheelZ:.4,spoiler:[-.68,.23]},merc:{body:[[-.66,-.1,.12,.36],[-.62,-.15,.2,.42],[-.3,-.15,.21,.43],[.3,-.15,.2,.43],[.58,-.14,.14,.42],[.66,-.1,.08,.38],[.68,-.06,.02,.33]],cabin:[[-.6,.15,.2,.31],[-.56,.15,.4,.33],[-.2,.15,.43,.34],[.2,.15,.42,.34],[.34,.15,.3,.345],[.42,.15,.18,.34]],n:5,wheelR:[.19,.19],wheelX:[.38,-.38],wheelZ:.43,spoiler:null}};function Ou(s,t){let e=t*(s.length-1),i=Math.min(s.length-2,Math.floor(e)),n=e-i,r=s[Math.max(0,i-1)],a=s[i],o=s[i+1],l=s[Math.min(s.length-1,i+2)],c=[];for(let h=0;h<a.length;h++){let f=r[h],u=a[h],d=o[h],m=l[h];c.push(.5*(2*u+(-f+d)*n+(2*f-5*u+4*d-m)*n*n+(-f+3*u-3*d+m)*n*n*n))}return c}function Jp(s,{n:t=3.2,nBottom:e=7,taper:i=.12,rows:n=30,cols:r=28,classify:a=()=>0,groups:o=1}){let l=[],c=[];for(let d=0;d<n;d++){let m=.5-.5*Math.cos(d/(n-1)*Math.PI),[x,g,p,M]=Ou(s,m);c.push({x,yb:g,yt:p,hw:M,u:m});let S=(g+p)/2,v=Math.max(.005,(p-g)/2);for(let T=0;T<r;T++){let E=T/r*Math.PI*2,C=Math.cos(E),y=Math.sin(E),A=y>=0?t:e,I=M*Math.sign(C)*Math.pow(Math.abs(C),2/A),D=S+v*Math.sign(y)*Math.pow(Math.abs(y),2/A);I*=1-i*Math.max(0,(D-S)/v),l.push(x,D,I)}}let h=Array.from({length:o},()=>[]);for(let d=0;d<n-1;d++)for(let m=0;m<r;m++){let x=d*r+m,g=d*r+(m+1)%r,p=(d+1)*r+m,M=(d+1)*r+(m+1)%r,S=a(c[d],c[d+1],(m+.5)/r*Math.PI*2);h[S].push(x,p,g,g,p,M)}for(let d of[0,n-1]){let m=l.length/3,x=c[d];l.push(x.x,(x.yb+x.yt)/2,0);for(let g=0;g<r;g++)l.push(l[(d*r+g)*3],l[(d*r+g)*3+1],l[(d*r+g)*3+2]);for(let g=0;g<r;g++){let p=m+1+g,M=m+1+(g+1)%r;d===0?h[0].push(m,p,M):h[0].push(m,M,p)}}let f=new xe;f.setAttribute("position",new Yt(l,3));let u=[];return h.forEach((d,m)=>{f.addGroup(u.length,d.length,m),u.push(...d)}),f.setIndex(u),f.computeVertexNormals(),f}var Zp=new xn(.78,.24,12,28),zu=new pi(.62,.62,.1,24);zu.rotateX(Math.PI/2);var ku=new pi(.16,.16,.14,12);ku.rotateX(Math.PI/2);var Vu=new ve(.12,.58,.12);Vu.translate(0,.3,0);var Nc=new $s(.1,.75,14,1,!0);Nc.rotateZ(Math.PI/2);Nc.translate(-.375,0,0);var Uc=new $s(.05,.38,10,1,!0);Uc.rotateZ(Math.PI/2);Uc.translate(-.19,0,0);var Hu=new pi(.038,.045,.12,12,1,!0);Hu.rotateZ(Math.PI/2);var Gu=new je(1.9,1.15);Gu.rotateX(-Math.PI/2);var Fu=null,hM=[Zp,zu,ku,Vu,Nc,Uc,Hu,Gu],Bu=new w,to=class{constructor(t,{teamColor:e,accent:i=2236962,boostColor:n=null,showName:r=!0,lite:a=!1}){this.car=t;let o=$p[t.bodyKey]?t.bodyKey:"octane",l=$p[o],c=Si[o];this.group=new Ue,this.root=new Ue,this.group.add(this.root);let h=a?Ae:_a,f=(ht,at)=>a?ht:{...ht,...at},u=new h(f({color:e,metalness:.5,roughness:.3},{roughness:.34,clearcoat:.7,clearcoatRoughness:.14})),d=new h(f({color:i,metalness:.6,roughness:.35},{clearcoat:.6})),m=new h(f({color:395796,metalness:.3,roughness:.06,envMapIntensity:1.6},{clearcoat:1,clearcoatRoughness:.02})),x=new Ae({color:1184793,roughness:.62,metalness:.3}),g=new Ae({color:1381655,roughness:.88}),p=new Ae({color:14870254,metalness:.75,roughness:.3}),M=new Ae({color:12107464,metalness:.8,roughness:.3}),S=new fe({color:new ct(15398143).multiplyScalar(2.2),toneMapped:!1});this.tailMat=new fe({color:new ct(16718362).multiplyScalar(1.4),toneMapped:!1});let v=Jp(l.body,{n:l.n,taper:.1,groups:2,classify:(ht,at,Ct)=>Math.sin(Ct)<-.35?1:0}),T=new St(v,[u,x]),E=Math.max(...l.cabin.map(ht=>ht[2])),C=Jp(l.cabin,{n:l.n+.6,taper:.28,groups:2,classify:(ht,at,Ct)=>Math.abs(Ct-Math.PI/2)<.62&&Math.min(ht.yt,at.yt)>E*.9?1:0}),y=new St(C,[m,u]);T.castShadow=!0,y.castShadow=!0,this.root.add(T,y);let A=l.body[l.body.length-1][0],I=l.body[0][0],D=ht=>{let at=l.body,Ct=0;for(let Bt=0;Bt<200;Bt++)if(Ou(at,Bt/199)[0]>=ht){Ct=Bt/199;break}return Ou(at,Ct)},B=A-.3,k=D(B),P=new St(new ve(.42,.012,.1),d);P.position.set(B,k[2]+.004,0),P.rotation.z=-.22,this.root.add(P);let L=D(A-.05);for(let ht of[1,-1]){let at=new St(new ve(.03,.028,.12),S);at.position.set(A-.035,(L[1]+L[2])/2+.01,ht*L[3]*.62),at.rotation.y=ht*.35,this.root.add(at)}let W=new St(new ve(.03,.04,L[3]*.8),x);W.position.set(A-.03,L[1]+.025,0),this.root.add(W);let z=D(I+.03),$=new St(new ve(.025,.03,z[3]*1.5),this.tailMat);$.position.set(I+.005,z[2]-.035,0),this.root.add($),this.flames=[],this.exhausts=[];let X=z[1]+.05;for(let ht of[1,-1]){let at=new St(Hu,M);at.position.set(I-.02,X,ht*.14),this.root.add(at)}if(l.spoiler){let[ht,at]=l.spoiler,Ct=D(ht)[3]*2+.04,Bt=new St(new ve(.15,.022,Ct),d);Bt.position.set(ht,at,0),Bt.rotation.z=.14,Bt.castShadow=!0,this.root.add(Bt);for(let Xt of[1,-1]){let Y=new St(new ve(.17,.07,.012),d);Y.position.set(ht,at-.015,Xt*Ct/2);let K=new St(new ve(.04,at-.1,.025),x);K.position.set(ht+.03,(at+.1)/2,Xt*Ct*.28),this.root.add(Y,K)}}let Q=-(c.hy+ft.rideHeight);this.wheels=[];for(let ht=0;ht<4;ht++){let at=ht<2,Ct=l.wheelR[at?0:1],Bt=ht%2?-1:1,Xt=new Ue;Xt.position.set(l.wheelX[at?0:1],Q+Ct,Bt*l.wheelZ);let Y=new Ue,K=new St(Zp,g);K.scale.set(Ct,Ct,Ct*1.1),K.castShadow=!0;let pt=new St(zu,p);pt.scale.set(Ct,Ct,1);let zt=new St(ku,d);zt.scale.set(Ct,Ct,1),zt.position.z=Bt*.02,Y.add(K,pt,zt);for(let re=0;re<5;re++){let j=new St(Vu,M);j.scale.set(Ct,Ct,1),j.rotation.z=re*Math.PI*2/5,j.position.z=Bt*.015,Y.add(j)}Xt.add(Y),this.root.add(Xt),this.wheels.push({pivot:Xt,spinner:Y,front:at});let Et=D(Xt.position.x),kt=new St(new xn(Ct+.04,.035,8,18,Math.PI),x);kt.position.set(Xt.position.x,Xt.position.y,Bt*(Et[3]+.005)),kt.scale.set(1,1,1.6),this.root.add(kt)}let tt=new ct(n??e);this.flameMat=new fe({color:tt.clone().multiplyScalar(2.5),transparent:!0,opacity:.85,blending:mi,depthWrite:!1,toneMapped:!1,side:ze}),this.coreMat=new fe({color:new ct(16773824).multiplyScalar(3),transparent:!0,opacity:.9,blending:mi,depthWrite:!1,toneMapped:!1});for(let ht of[1,-1]){let at=new Ue;at.position.set(I-.06,X,ht*.14),at.add(new St(Nc,this.flameMat),new St(Uc,this.coreMat)),at.visible=!1,this.root.add(at),this.flames.push(at),this.exhausts.push(new w(I-.08,X,ht*.14))}this.boostColor=tt,this.backX=I,this.halfWidth=l.wheelZ,this.wheelBaseY=Q,Fu||(Fu=new fe({map:zp(),transparent:!0,depthWrite:!1})),this.shadow=new St(Gu,Fu.clone()),this.shadow.renderOrder=2,this.group.add(this.shadow),r&&(this.nameTag=Vp(t.name,e===void 0?"#fff":`#${new ct(e).getHexString()}`),this.nameTag.position.set(0,1,0),this.group.add(this.nameTag))}update(t,e){if(this.group.visible=!t.demolished,t.demolished)return;this.group.position.copy(t.pos),this.root.quaternion.copy(t.quat);for(let n of this.wheels)n.front&&(n.pivot.rotation.y=-t.steer*.45),n.spinner.rotation.z=-t.spin;let i=t.pos.y-.35;if(this.shadow.visible=i<4&&Math.abs(t.pos.x)<38&&Math.abs(t.pos.z)<60,this.shadow.visible){Bu.set(1,0,0).applyQuaternion(t.quat),this.shadow.position.set(0,.02-t.pos.y,0),this.shadow.rotation.y=Math.atan2(-Bu.z,Bu.x),this.shadow.material.opacity=Math.max(0,.75*(1-i/4));let n=1+i*.15;this.shadow.scale.set(n,1,n)}this.tailMat.color.setRGB(t.braking?3.2:1.4,t.braking?.1:.03,t.braking?.1:.03);for(let n of this.flames)if(n.visible=t.boosting,t.boosting){let r=.85+Math.sin(e*60+n.position.z*10)*.12+Math.random()*.15;n.scale.set(r*(t.supersonic?1.4:1),1,1)}}exhaustWorld(t,e){return e.copy(this.exhausts[t]).applyQuaternion(this.root.quaternion).add(this.group.position)}dispose(){this.group.traverse(t=>{t.isMesh&&t.geometry&&!hM.includes(t.geometry)&&t.geometry.dispose(),t.material&&t.material.map&&t.isSprite&&t.material.map.dispose(),t===this.shadow&&t.material.dispose()})}};var uM=`
attribute float size;
attribute float alpha;
attribute vec3 pcolor;
varying float vAlpha;
varying vec3 vColor;
uniform float scale;
void main() {
  vAlpha = alpha;
  vColor = pcolor;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = size * scale / max(-mv.z, 0.1);
  gl_Position = projectionMatrix * mv;
}`,Kp=`
varying float vAlpha;
varying vec3 vColor;
void main() {
  vec2 d = gl_PointCoord - 0.5;
  float r = length(d) * 2.0;
  float a = smoothstep(1.0, 0.0, r);
  a *= a;
  gl_FragColor = vec4(vColor * a * vAlpha, a * vAlpha);
}`,Fc=class{constructor(t,e=!0){this.cap=t,this.n=0,this.pos=new Float32Array(t*3),this.col=new Float32Array(t*3),this.size=new Float32Array(t),this.alpha=new Float32Array(t),this.vel=new Float32Array(t*3),this.life=new Float32Array(t),this.maxLife=new Float32Array(t),this.s0=new Float32Array(t),this.s1=new Float32Array(t),this.a0=new Float32Array(t),this.drag=new Float32Array(t),this.grav=new Float32Array(t),this.c0=new Float32Array(t*3),this.c1=new Float32Array(t*3);let i=new xe;this.aPos=new Fe(this.pos,3).setUsage(er),this.aCol=new Fe(this.col,3).setUsage(er),this.aSize=new Fe(this.size,1).setUsage(er),this.aAlpha=new Fe(this.alpha,1).setUsage(er),i.setAttribute("position",this.aPos),i.setAttribute("pcolor",this.aCol),i.setAttribute("size",this.aSize),i.setAttribute("alpha",this.aAlpha),i.boundingSphere=new Vi(new w,1e5),this.material=new we({vertexShader:uM,fragmentShader:Kp,uniforms:{scale:{value:600}},transparent:!0,depthWrite:!1,blending:e?mi:On}),e||(this.material.fragmentShader=Kp.replace("gl_FragColor = vec4(vColor * a * vAlpha, a * vAlpha);","gl_FragColor = vec4(vColor, a * vAlpha);")),this.points=new is(i,this.material),this.points.frustumCulled=!1,this.points.renderOrder=5,this.geometry=i}setViewportHeight(t){this.material.uniforms.scale.value=t*.9}emit(t){if(this.n>=this.cap)return;let e=this.n++,i=e*3;this.pos[i]=t.x,this.pos[i+1]=t.y,this.pos[i+2]=t.z,this.vel[i]=t.vx||0,this.vel[i+1]=t.vy||0,this.vel[i+2]=t.vz||0,this.life[e]=0,this.maxLife[e]=t.life||.5,this.s0[e]=t.size||.5,this.s1[e]=t.size1??this.s0[e]*.2,this.a0[e]=t.alpha??1,this.drag[e]=t.drag||0,this.grav[e]=t.gravity||0;let n=t.color,r=t.color1||t.color;this.c0[i]=n.r,this.c0[i+1]=n.g,this.c0[i+2]=n.b,this.c1[i]=r.r,this.c1[i+1]=r.g,this.c1[i+2]=r.b}update(t){let e=0;for(;e<this.n;){if(this.life[e]+=t,this.life[e]>=this.maxLife[e]){this.copy(this.n-1,e),this.n--;continue}let i=this.life[e]/this.maxLife[e],n=e*3,r=Math.exp(-this.drag[e]*t);this.vel[n]*=r,this.vel[n+1]=this.vel[n+1]*r+this.grav[e]*t,this.vel[n+2]*=r,this.pos[n]+=this.vel[n]*t,this.pos[n+1]+=this.vel[n+1]*t,this.pos[n+2]+=this.vel[n+2]*t,this.size[e]=this.s0[e]+(this.s1[e]-this.s0[e])*i,this.alpha[e]=this.a0[e]*(1-i)*Math.min(1,i*12+.2),this.col[n]=this.c0[n]+(this.c1[n]-this.c0[n])*i,this.col[n+1]=this.c0[n+1]+(this.c1[n+1]-this.c0[n+1])*i,this.col[n+2]=this.c0[n+2]+(this.c1[n+2]-this.c0[n+2])*i,e++}this.geometry.setDrawRange(0,this.n),this.aPos.needsUpdate=!0,this.aCol.needsUpdate=!0,this.aSize.needsUpdate=!0,this.aAlpha.needsUpdate=!0}copy(t,e){if(t===e)return;let i=t*3,n=e*3;for(let r=0;r<3;r++)this.pos[n+r]=this.pos[i+r],this.vel[n+r]=this.vel[i+r],this.col[n+r]=this.col[i+r],this.c0[n+r]=this.c0[i+r],this.c1[n+r]=this.c1[i+r];this.life[e]=this.life[t],this.maxLife[e]=this.maxLife[t],this.s0[e]=this.s0[t],this.s1[e]=this.s1[t],this.a0[e]=this.a0[t],this.drag[e]=this.drag[t],this.grav[e]=this.grav[t],this.size[e]=this.size[t],this.alpha[e]=this.alpha[t]}clear(){this.n=0}},Ce=s=>(Math.random()*2-1)*s,jp=new ct(1,1,1),Qp=new ct(.18,.18,.2),dM=new ct(1.6,.7,.2),Bc=class{constructor(t){this.add=new Fc(6e3,!0),this.smoke=new Fc(1500,!1),t.add(this.add.points,this.smoke.points),this.rings=[],this.scene=t,this.ringGeo=new ga(.8,1,48)}setViewportHeight(t){this.add.setViewportHeight(t),this.smoke.setViewportHeight(t)}boost(t,e,i,n,r){let a=this.tmpHot||(this.tmpHot=new ct),o=this.tmpCool||(this.tmpCool=new ct);a.copy(n).multiplyScalar(1.6).lerp(jp,.25),o.copy(n).multiplyScalar(.45);for(let l=0;l<3;l++){let c=9+Math.random()*6,h=Math.random()*.15;this.add.emit({x:t.x-e.x*h+Ce(.04),y:t.y-e.y*h+Ce(.04),z:t.z-e.z*h+Ce(.04),vx:-e.x*c+i.x*.7+Ce(.8),vy:-e.y*c+i.y*.7+Ce(.8),vz:-e.z*c+i.z*.7+Ce(.8),life:.16+Math.random()*.16,size:r?.42:.34,size1:.04,color:a,color1:o,drag:4,alpha:.8})}}trail(t,e,i=.28){this.add.emit({x:t.x,y:t.y,z:t.z,life:.45,size:i,size1:i*.18,color:e,color1:e,alpha:.7})}sparks(t,e,i=dM){let n=Math.min(36,6+e*1.2);for(let r=0;r<n;r++){let a=3+Math.random()*e*.5;this.add.emit({x:t.x,y:t.y,z:t.z,vx:Ce(a),vy:Ce(a)+2,vz:Ce(a),life:.25+Math.random()*.25,size:.2,size1:.03,color:jp,color1:i,drag:2,gravity:-10})}}padPickup(t,e){let i=new ct(1.8,1.2,.3);for(let n=0;n<(e?28:10);n++)this.add.emit({x:t.x+Ce(1),y:.3,z:t.z+Ce(1),vx:Ce(1),vy:3+Math.random()*(e?6:3),vz:Ce(1),life:.55,size:e?.32:.22,size1:.05,color:i,drag:1})}explosion(t,e,i=!0){let n=i?650:220,r=new ct(e),a=r.clone().multiplyScalar(3),o=r.clone().multiplyScalar(1.2),l=new ct(2.2,1.9,1.2);for(let h=0;h<n;h++){let f=Math.random()*Math.PI*2,u=Math.random()*2-1,d=Math.sqrt(1-u*u),m=Math.random(),x=(i?12:7)+Math.random()*(i?32:12)*(m<.25?1.3:1);this.add.emit({x:t.x,y:t.y,z:t.z,vx:Math.cos(f)*d*x,vy:u*x+3,vz:Math.sin(f)*d*x,life:.7+Math.random()*(i?1.4:.6),size:m<.25?.45:i?1.3:.9,size1:.08,color:m<.25?l:a,color1:o,drag:m<.25?.8:1.8,gravity:m<.25?-9:-3})}for(let h=0;h<(i?90:40);h++)this.smoke.emit({x:t.x+Ce(1),y:t.y+Ce(1),z:t.z+Ce(1),vx:Ce(6),vy:Ce(4)+2,vz:Ce(6),life:1.5+Math.random()*1.5,size:2.5,size1:6,color:Qp,alpha:.55,drag:1.5,gravity:.5});let c=new St(this.ringGeo,new fe({color:a,transparent:!0,opacity:1,side:ze,blending:mi,depthWrite:!1,toneMapped:!1}));c.position.copy(t),c.lookAt(t.x,t.y+1,t.z),this.scene.add(c),this.rings.push({mesh:c,t:0,max:i?1.1:.6,size:i?30:10})}demolition(t,e){for(let i=0;i<160;i++){let n=4+Math.random()*12;this.add.emit({x:t.x,y:t.y,z:t.z,vx:Ce(n),vy:Ce(n)+4,vz:Ce(n),life:.5+Math.random()*.8,size:1.1,size1:.1,color:new ct(2,1.4,.5),color1:new ct(e).multiplyScalar(1.5),drag:2,gravity:-6})}for(let i=0;i<50;i++)this.smoke.emit({x:t.x,y:t.y,z:t.z,vx:Ce(3),vy:1+Math.random()*3,vz:Ce(3),life:1.5+Math.random(),size:1.5,size1:4,color:Qp,alpha:.7,drag:1})}update(t){this.add.update(t),this.smoke.update(t);for(let e=this.rings.length-1;e>=0;e--){let i=this.rings[e];i.t+=t;let n=i.t/i.max;if(n>=1){this.scene.remove(i.mesh),i.mesh.material.dispose(),this.rings.splice(e,1);continue}let r=1+n*i.size;i.mesh.scale.set(r,r,r),i.mesh.material.opacity=1-n}}clear(){this.add.clear(),this.smoke.clear()}};var eo=new w(0,1,0),Oc=new w,Sr=new w,gs=new w,tm=new w,an=new w,Tr=new w;function em(s,t){let e=ui.degToRad(s);return ui.radToDeg(2*Math.atan(Math.tan(e/2)/t))}function kc(s,t=.6){for(let e=0;e<3;e++){let i=di(s.x,s.y,s.z);if(i<=-t)return s;yn(s.x,s.y,s.z,tm),s.addScaledVector(tm,i+t)}return s}var zc=class{constructor(t){this.camera=t,this.pos=new w,this.look=new w,this.fwd=new w(0,0,1),this.up=new w(0,1,0),this.ready=!1,this.ballCam=!0,this.shake=0,this.swivel=0}reset(){this.ready=!1}addShake(t){this.shake=Math.max(this.shake,t)}follow(t,e,i,n){let r=n.camDistance,a=n.camHeight;Oc.set(1,0,0).applyQuaternion(e.quat);let o=e.onGround?e.groundNormal:eo;Sr.copy(Oc).addScaledVector(o,-Oc.dot(o)),Sr.lengthSq()<.09&&Sr.copy(this.fwd),Sr.normalize(),this.ready||(this.fwd.copy(Sr),this.up.copy(o));let l=1-Math.exp(-t*(e.onGround?9:5));this.fwd.lerp(Sr,l).normalize(),this.up.lerp(o,1-Math.exp(-t*5)).normalize();let c=this.up;if(this.ballCam&&i){gs.copy(e.pos).sub(i),gs.y=0,gs.lengthSq()<.25&&gs.copy(this.fwd).negate().setY(0),gs.normalize(),an.copy(e.pos).addScaledVector(gs,r),an.y+=a,c=eo;let h=gs.copy(i).sub(an).normalize(),f=Tr.copy(e.pos).sub(an).normalize(),u=Math.acos(ui.clamp(h.dot(f),-1,1)),d=ui.degToRad(this.camera.fov)*.36;if(u>d&&u>1e-4){let m=Oc.crossVectors(f,h).normalize();h.copy(f).applyAxisAngle(m,d)}Tr.copy(an).addScaledVector(h,12)}else an.copy(e.pos).addScaledVector(this.fwd,-r).addScaledVector(this.up,a),Tr.copy(e.pos).addScaledVector(this.up,a*.7).addScaledVector(this.fwd,2.2);if(this.swivel&&(an.sub(e.pos).applyAxisAngle(eo,this.swivel).add(e.pos),Tr.sub(e.pos).applyAxisAngle(eo,this.swivel).add(e.pos)),kc(an),!this.ready)this.pos.copy(an),this.look.copy(Tr),this.ready=!0;else{let h=1-Math.exp(-t*n.camStiffness);this.pos.lerp(an,h),this.look.lerp(Tr,1-Math.exp(-t*14))}this.apply(t,c)}setView(t,e,i,n=4){this.ready?(this.pos.lerp(e,1-Math.exp(-t*n)),this.look.lerp(i,1-Math.exp(-t*n*1.5))):(this.pos.copy(e),this.look.copy(i),this.ready=!0),this.apply(t,eo)}apply(t,e){let i=this.camera;if(i.position.copy(this.pos),this.shake>.001){let n=this.shake;i.position.x+=(Math.random()-.5)*n,i.position.y+=(Math.random()-.5)*n,i.position.z+=(Math.random()-.5)*n,this.shake*=Math.exp(-t*5)}i.up.copy(e),i.lookAt(this.look)}};var nm=[["throttle","Acc\xE9l\xE9rer / piquer du nez"],["reverse","Freiner / reculer / cabrer"],["left","Tourner \xE0 gauche"],["right","Tourner \xE0 droite"],["jump","Sauter"],["boost","Boost"],["handbrake","D\xE9rapage / air roll libre"],["rollLeft","Air roll gauche"],["rollRight","Air roll droite"],["ballCam","Cam\xE9ra balle"],["scoreboard","Tableau des scores"],["pause","Pause"],["resetBall","Entra\xEEnement : replacer la balle"],["shootBall","Entra\xEEnement : balle vers moi"]],io={throttle:["KeyW","ArrowUp"],reverse:["KeyS","ArrowDown"],left:["KeyA","ArrowLeft"],right:["KeyD","ArrowRight"],jump:["Space","Mouse2"],boost:["ShiftLeft","Mouse0"],handbrake:["KeyC","ShiftRight"],rollLeft:["KeyQ"],rollRight:["KeyE"],ballCam:["KeyV","Mouse1"],scoreboard:["Tab"],pause:["Escape","KeyP"],resetBall:["KeyR"],shootBall:["KeyT"]},Je={A:0,B:1,X:2,Y:3,LB:4,RB:5,LT:6,RT:7,BACK:8,START:9,LS:10,UP:12,DOWN:13,LEFT:14,RIGHT:15};function $n(s){if(!s)return"\u2014";let t={Mouse0:"Clic gauche",Mouse1:"Clic molette",Mouse2:"Clic droit",Space:"Espace",ShiftLeft:"Maj gauche",ShiftRight:"Maj droite",ControlLeft:"Ctrl gauche",ControlRight:"Ctrl droite",AltLeft:"Alt",Tab:"Tab",Escape:"\xC9chap",ArrowUp:"\u2191",ArrowDown:"\u2193",ArrowLeft:"\u2190",ArrowRight:"\u2192",Enter:"Entr\xE9e",Backspace:"Retour"};return t[s]?t[s]:s.startsWith("Key")?s.slice(3):s.startsWith("Digit")?s.slice(5):s}function im(s,t,e){let i=Math.hypot(s,t);if(i<e)return[0,0];let n=Math.min(1,(i-e)/(1-e))/i;return[s*n,t*n]}var Vc=class{constructor(t){this.settings=t,this.down=new Set,this.pressedQueue=new Set,this.capture=null,this.padPrev=new Map,this.padPressed=new Map,this.lastDevice="keyboard",this.virtualQueue=new Set,this.frameVirtual=new Set,this.touch=null,this.lastTouchTime=-1e9,window.addEventListener("touchstart",()=>{this.lastTouchTime=performance.now(),this.lastDevice="touch"},{passive:!0,capture:!0});let e=new Set(["Space","Tab","ArrowUp","ArrowDown","ArrowLeft","ArrowRight","ShiftLeft","AltLeft"]);window.addEventListener("keydown",i=>{if(this.capture){i.preventDefault();let n=this.capture;this.capture=null,n(i.code);return}i.target&&(i.target.tagName==="INPUT"||i.target.tagName==="SELECT")||(e.has(i.code)&&i.preventDefault(),this.down.has(i.code)||this.pressedQueue.add(i.code),this.down.add(i.code),this.lastDevice="keyboard")}),window.addEventListener("keyup",i=>this.down.delete(i.code)),window.addEventListener("blur",()=>this.down.clear()),window.addEventListener("mousedown",i=>{let n=`Mouse${i.button}`;if(this.capture){i.preventDefault();let r=this.capture;this.capture=null,r(n);return}i.target&&i.target.closest&&i.target.closest(".menu, .overlay-panel, button, input, select, #touch")||performance.now()-this.lastTouchTime<1500||(this.down.has(n)||this.pressedQueue.add(n),this.down.add(n),this.lastDevice="keyboard")}),window.addEventListener("mouseup",i=>this.down.delete(`Mouse${i.button}`)),window.addEventListener("contextmenu",i=>i.preventDefault())}captureNext(t){this.capture=t}keys(t){return this.settings.keys&&this.settings.keys[t]||io[t]||[]}kb(t){return this.keys(t).some(e=>this.down.has(e))?1:0}virtualPress(t){this.virtualQueue.add(t)}poll(){this.frameKeys=this.pressedQueue,this.pressedQueue=new Set,this.frameVirtual=this.virtualQueue,this.virtualQueue=new Set;let t=navigator.getGamepads?[...navigator.getGamepads()].filter(e=>e&&e.connected):[];this.pads=t,this.padPressed.clear();for(let e of t){let i=this.padPrev.get(e.index)||[],n=e.buttons.map(a=>a.pressed),r=n.map((a,o)=>a&&!i[o]);(r.some(a=>a)||Math.abs(e.axes[0]||0)>.5||Math.abs(e.axes[1]||0)>.5)&&(this.lastDevice="gamepad"),this.padPressed.set(e.index,r),this.padPrev.set(e.index,n)}}padFor(t,e){let i=this.pads||[];return e?t===1?i[0]?[i[0]]:[]:i[1]?[i[1]]:[]:t===0?i:[]}usesKeyboard(t){return t===0}pressed(t,e=0,i=!1){if(this.usesKeyboard(e)&&this.keys(t).some(r=>this.frameKeys&&this.frameKeys.has(r))||e===0&&this.frameVirtual.has(t))return!0;let n={jump:Je.A,ballCam:Je.Y,pause:Je.START,scoreboard:Je.BACK,resetBall:Je.UP,shootBall:Je.DOWN}[t];if(n===void 0)return!1;for(let r of this.padFor(e,i)){let a=this.padPressed.get(r.index);if(a&&a[n])return!0}return!1}quickChat(t,e){if(this.usesKeyboard(t)&&this.frameKeys){for(let i=1;i<=8;i++)if(this.frameKeys.has(`Digit${i}`)||this.frameKeys.has(`Numpad${i}`))return i-1}for(let i of this.padFor(t,e)){let n=this.padPressed.get(i.index);if(n){if(n[Je.LEFT])return 1;if(n[Je.RIGHT])return 2;if(n[Je.UP])return 0;if(n[Je.DOWN])return 3}}return-1}lookStick(t,e){for(let i of this.padFor(t,e)){let[n,r]=im(i.axes[2]||0,i.axes[3]||0,.25);if(n||r)return[n,r]}return[0,0]}held(t,e=0,i=!1){if(this.usesKeyboard(e)&&this.kb(t))return!0;let n={scoreboard:Je.BACK}[t];return n===void 0?!1:this.padFor(e,i).some(r=>r.buttons[n]&&r.buttons[n].pressed)}controls(t,e,i){let n=this.settings,r=0,a=0,o=0,l=0,c=0,h=!1,f=!1,u=!1;this.usesKeyboard(t)&&(r=this.kb("throttle")-this.kb("reverse"),a=this.kb("right")-this.kb("left"),o=r,l=r,c=this.kb("rollRight")-this.kb("rollLeft"),h=!!this.kb("jump")||this.keys("jump").some(d=>this.frameKeys&&this.frameKeys.has(d)),f=!!this.kb("boost"),u=!!this.kb("handbrake"));for(let d of this.padFor(t,e)){let m=S=>d.buttons[S]?d.buttons[S].value:0,[x,g]=im(d.axes[0]||0,d.axes[1]||0,n.deadzone),p=m(Je.RT)-m(Je.LT);Math.abs(p)>Math.abs(r)&&(r=p),Math.abs(x)>Math.abs(a)&&(a=x);let M=n.invertPitch?g:-g;Math.abs(M)>Math.abs(o)&&(o=M),Math.abs(g)>Math.abs(l)&&(l=-g),m(Je.LB)>.5&&(c=-1),h=h||m(Je.A)>.5,f=f||m(Je.B)>.5||m(Je.RB)>.5,u=u||m(Je.X)>.5}if(t===0&&this.touch&&this.touch.visible){let d=this.touch.state(),m=(d.gas?1:0)-(d.reverse?1:0);Math.abs(m)>Math.abs(r)&&(r=m),Math.abs(d.x)>Math.abs(a)&&(a=d.x),Math.abs(d.y)>Math.abs(o)&&(o=d.y),Math.abs(d.y)>Math.abs(l)&&(l=d.y),h=h||d.jump||this.frameVirtual.has("jump"),f=f||d.boost,u=u||d.handbrake}return i.throttle=Math.max(-1,Math.min(1,r)),i.steer=Math.max(-1,Math.min(1,a)),i.pitch=Math.max(-1,Math.min(1,o)),i.yaw=u?0:i.steer,i.roll=Math.max(-1,Math.min(1,c+(u?i.steer:0))),i.jump=h,i.boost=f,i.handbrake=u,i.up=Math.max(-1,Math.min(1,l)),i.dodgeX=void 0,i.dodgeY=void 0,i}};function sm(){return typeof window<"u"&&("ontouchstart"in window||navigator.maxTouchPoints>0)&&window.matchMedia&&window.matchMedia("(pointer: coarse)").matches}var Xu=[{id:"gas",label:"\u25B2<small>AVANCER</small>",cls:"tb-gas"},{id:"reverse",label:"\u25BC<small>RECULER</small>",cls:"tb-rev"},{id:"jump",label:"SAUT",cls:"tb-jump"},{id:"boost",label:"BOOST",cls:"tb-boost"},{id:"handbrake",label:"D\xC9RAPE",cls:"tb-slide"},{id:"ballCam",label:"CAM",cls:"tb-cam",tap:!0},{id:"pause",label:"II",cls:"tb-pause",tap:!0},{id:"resetBall",label:"BALLE",cls:"tb-reset",tap:!0},{id:"shootBall",label:"TIR",cls:"tb-shoot",tap:!0}],Wu=Xu.filter(s=>!s.tap),Hc=class{constructor(t){this.input=t,this.stick={x:0,y:0,id:null,ox:0,oy:0},this.held={gas:!1,reverse:!1,jump:!1,boost:!1,handbrake:!1},this.fingers=new Map,this.visible=!1;let e=document.createElement("div");e.id="touch",e.className="hidden",e.innerHTML=`<div class="t-zone"></div><div class="t-base hidden"><div class="t-knob"></div></div>
      ${Xu.map(a=>`<div class="tbtn ${a.cls}" data-id="${a.id}">${a.label}</div>`).join("")}`,document.body.appendChild(e),this.root=e,this.zone=e.querySelector(".t-zone"),this.base=e.querySelector(".t-base"),this.knob=e.querySelector(".t-knob"),this.els={},e.querySelectorAll(".tbtn").forEach(a=>{this.els[a.dataset.id]=a});let i=a=>{a.preventDefault(),a.stopPropagation()},n=(a,o)=>{try{a.setPointerCapture(o.pointerId)}catch{}};this.zone.addEventListener("pointerdown",a=>{i(a),this.stick.id===null&&(this.stick.id=a.pointerId,this.stick.ox=a.clientX,this.stick.oy=a.clientY,n(this.zone,a),this.base.style.left=`${a.clientX}px`,this.base.style.top=`${a.clientY}px`,this.base.classList.remove("hidden"),this.moveStick(a))}),this.zone.addEventListener("pointermove",a=>{a.pointerId===this.stick.id&&(i(a),this.moveStick(a))});let r=a=>{a.pointerId===this.stick.id&&(this.stick.id=null,this.stick.x=0,this.stick.y=0,this.base.classList.add("hidden"),this.knob.style.transform="translate(-50%, -50%)")};this.zone.addEventListener("pointerup",r),this.zone.addEventListener("pointercancel",r);for(let a of Xu){let o=this.els[a.id];o.addEventListener("contextmenu",i),o.addEventListener("pointerdown",c=>{if(i(c),n(o,c),a.tap){o.classList.add("on"),this.input.virtualPress(a.id),navigator.vibrate&&navigator.vibrate(10);return}this.fingers.set(c.pointerId,{x:c.clientX,y:c.clientY}),this.refreshHeld()}),o.addEventListener("pointermove",c=>{let h=this.fingers.get(c.pointerId);h&&(i(c),h.x=c.clientX,h.y=c.clientY,this.refreshHeld())});let l=c=>{i(c),a.tap&&o.classList.remove("on"),this.fingers.delete(c.pointerId)&&this.refreshHeld()};o.addEventListener("pointerup",l),o.addEventListener("pointercancel",l)}e.addEventListener("touchstart",a=>a.preventDefault(),{passive:!1}),e.addEventListener("touchmove",a=>a.preventDefault(),{passive:!1})}refreshHeld(){let t={};for(let i of Wu)t[i.id]=!1;let e=6;for(let i of this.fingers.values())for(let n of Wu){let r=this.els[n.id].getBoundingClientRect();i.x>=r.left-e&&i.x<=r.right+e&&i.y>=r.top-e&&i.y<=r.bottom+e&&(t[n.id]=!0)}t.jump&&!this.held.jump&&(this.input.virtualPress("jump"),navigator.vibrate&&navigator.vibrate(12));for(let i of Wu)this.held[i.id]=t[i.id],this.els[i.id].classList.toggle("on",t[i.id])}moveStick(t){let e=Math.min(window.innerWidth,window.innerHeight)*.14,i=t.clientX-this.stick.ox,n=t.clientY-this.stick.oy,r=Math.hypot(i,n);r>e&&(this.stick.ox+=i-i/r*e,this.stick.oy+=n-n/r*e,this.base.style.left=`${this.stick.ox}px`,this.base.style.top=`${this.stick.oy}px`,i=i/r*e,n=n/r*e),this.stick.x=i/e,this.stick.y=-n/e,this.knob.style.transform=`translate(calc(-50% + ${i}px), calc(-50% + ${n}px))`}show(t,e=!1){if(t!==this.visible&&(this.visible=t,this.root.classList.toggle("hidden",!t),!t)){this.stick.id=null,this.stick.x=0,this.stick.y=0,this.base.classList.add("hidden"),this.fingers.clear();for(let i of Object.keys(this.held))this.held[i]=!1;this.root.querySelectorAll(".tbtn.on").forEach(i=>i.classList.remove("on"))}this.root.classList.toggle("freeplay",e)}setBallCam(t){let e=this.els.ballCam;e&&(e.textContent=t?"CAM \u25CF":"CAM \u25CB")}state(){let e=i=>Math.abs(i)<.12?0:Math.sign(i)*(Math.abs(i)-.12)/.88;return{x:e(this.stick.x),y:e(this.stick.y),...this.held,active:this.visible}}};var fM=new w(0,1,0),Gc=new w,rm=new w,qu=(s,t,e)=>s<t?t:s>e?e:s,no=class{constructor(){this.active=!1,this.yaw=0,this.pitch=0}apply(t,e,i){if(t.onGround||t.demolished||t.flipping||t.righting>0||t.jumping||t.airTime<.08)return this.active=!1,!1;t.forward(Gc),this.active||(this.active=!0,this.yaw=Math.atan2(-Gc.z,Gc.x),this.pitch=Math.asin(qu(Gc.y,-1,1))),e.dodgeX=e.pitch,e.dodgeY=qu(e.yaw+e.roll,-1,1);let r=e.steer,a=e.up||0;this.yaw-=r*2.3*i,this.pitch=qu(this.pitch+a*1.7*i,-1.45,1.45),Math.abs(r)+Math.abs(a)<.1&&t.vel.y<-1&&t.pos.y<4&&!e.boost&&(this.pitch+=(0-this.pitch)*Math.min(1,i*4));let o=Math.cos(this.pitch);rm.set(o*Math.cos(this.yaw),Math.sin(this.pitch),-o*Math.sin(this.yaw));let l=e.roll;return Qa(t,e,rm,fM),Math.abs(l)>.2&&(e.roll=l),!0}};var Wc=class{constructor(t){this.settings=t,this.ctx=null,this.listener={x:0,y:0,z:0,rx:1,ry:0,rz:0},this.engines=[],this.musicTimer=null}init(){if(this.ctx){this.ctx.state==="suspended"&&this.ctx.resume();return}let t=window.AudioContext||window.webkitAudioContext;if(!t)return;let e=new t;this.ctx=e,this.comp=e.createDynamicsCompressor(),this.comp.threshold.value=-14,this.comp.ratio.value=4,this.master=e.createGain(),this.sfx=e.createGain(),this.music=e.createGain(),this.sfx.connect(this.master),this.music.connect(this.master),this.master.connect(this.comp),this.comp.connect(e.destination);let i=e.sampleRate*2;this.noise=e.createBuffer(1,i,e.sampleRate);let n=this.noise.getChannelData(0);for(let r=0;r<i;r++)n[r]=Math.random()*2-1;this.applyVolumes(),this.startCrowd()}applyVolumes(){if(!this.ctx)return;let t=this.settings;this.master.gain.value=t.volMaster,this.sfx.gain.value=t.volSfx,this.music.gain.value=t.volMusic*.5}setListener(t,e){let i=this.listener;i.x=t.x,i.y=t.y,i.z=t.z,i.rx=e.x,i.ry=e.y,i.rz=e.z}spatial(t,e=18){if(!t)return{gain:1,pan:0};let i=this.listener,n=t.x-i.x,r=t.y-i.y,a=t.z-i.z,o=Math.hypot(n,r,a),l=e/(e+Math.max(0,o-3)),c=o>.01?Math.max(-1,Math.min(1,(n*i.rx+r*i.ry+a*i.rz)/o))*.8:0;return{gain:l,pan:c}}out(t,e){let i=this.ctx,{gain:n,pan:r}=this.spatial(t),a=i.createGain();if(a.gain.value=e*n,i.createStereoPanner){let o=i.createStereoPanner();o.pan.value=r,a.connect(o),o.connect(this.sfx)}else a.connect(this.sfx);return a}noiseSrc(t){let e=this.ctx.createBufferSource();return e.buffer=this.noise,e.loop=t>1.9,e.start(this.ctx.currentTime,Math.random()*1.5),e.stop(this.ctx.currentTime+t),e}env(t,e,i,n=1){let r=this.ctx.currentTime;t.gain.cancelScheduledValues(r),t.gain.setValueAtTime(1e-4,r),t.gain.exponentialRampToValueAtTime(n,r+e),t.gain.exponentialRampToValueAtTime(1e-4,r+e+i)}tone(t,e,i,n,r,a){let o=this.ctx,l=o.createOscillator();l.type=t;let c=o.currentTime;l.frequency.setValueAtTime(e,c),l.frequency.exponentialRampToValueAtTime(Math.max(1,i),c+n);let h=o.createGain();l.connect(h),h.connect(a),this.env(h,.005,n,r),l.start(c),l.stop(c+n+.05)}hit(t,e){if(!this.ctx)return;let i=Math.min(1,.25+e/25),n=this.out(t,i);this.tone("sine",140+e*3,45,.25,.9,n);let r=this.noiseSrc(.2),a=this.ctx.createBiquadFilter();a.type="bandpass",a.frequency.value=900+e*40,a.Q.value=.8;let o=this.ctx.createGain();r.connect(a),a.connect(o),o.connect(n),this.env(o,.002,.16,.8)}bounce(t,e){if(!this.ctx)return;let i=this.out(t,Math.min(.6,e/30));this.tone("sine",90,40,.18,.8,i)}jump(t){if(!this.ctx)return;let e=this.out(t,.25),i=this.noiseSrc(.3),n=this.ctx.createBiquadFilter();n.type="bandpass",n.frequency.setValueAtTime(500,this.ctx.currentTime),n.frequency.exponentialRampToValueAtTime(2500,this.ctx.currentTime+.2);let r=this.ctx.createGain();i.connect(n),n.connect(r),r.connect(e),this.env(r,.01,.2,.8)}pad(t,e){if(!this.ctx)return;let i=this.out(t,e?.35:.2);this.tone("triangle",e?520:880,e?1560:1320,e?.35:.12,.7,i)}bump(t,e){if(!this.ctx)return;let i=this.out(t,Math.min(.8,e/15));this.tone("square",120,50,.15,.4,i),this.hit(t,e*.4)}explosion(t,e){if(!this.ctx)return;let i=this.ctx,n=this.out(t,e?1:.8),r=this.noiseSrc(e?2.5:1.4),a=i.createBiquadFilter();a.type="lowpass",a.frequency.setValueAtTime(e?3e3:2e3,i.currentTime),a.frequency.exponentialRampToValueAtTime(80,i.currentTime+(e?2.2:1.2));let o=i.createGain();r.connect(a),a.connect(o),o.connect(n),this.env(o,.005,e?2.2:1.2,1),this.tone("sine",110,28,e?1.4:.8,1,n)}horn(t){if(!this.ctx)return;let e=this.ctx,i=e.currentTime,n=e.createGain();n.connect(this.sfx),n.gain.setValueAtTime(1e-4,i),n.gain.exponentialRampToValueAtTime(.28,i+.05),n.gain.setValueAtTime(.28,i+1.6),n.gain.exponentialRampToValueAtTime(1e-4,i+2.4);let r=t?[220,277,330,440]:[196,233,294];for(let a of r){let o=e.createOscillator();o.type="sawtooth",o.frequency.value=a;let l=e.createOscillator();l.frequency.value=5;let c=e.createGain();c.gain.value=3,l.connect(c),c.connect(o.frequency);let h=e.createBiquadFilter();h.type="lowpass",h.frequency.value=1800,o.connect(h),h.connect(n),o.start(i),l.start(i),o.stop(i+2.5),l.stop(i+2.5)}this.cheer(3.5)}cheer(t=2.5){if(!this.ctx)return;let e=this.ctx,i=this.noiseSrc(t+.5),n=e.createBiquadFilter();n.type="bandpass",n.frequency.value=1200,n.Q.value=.5;let r=e.createGain(),a=e.currentTime;r.gain.setValueAtTime(1e-4,a),r.gain.exponentialRampToValueAtTime(.5,a+.3),r.gain.exponentialRampToValueAtTime(1e-4,a+t),i.connect(n),n.connect(r),r.connect(this.sfx)}beep(t){this.ctx&&this.tone("square",t?880:440,t?880:440,t?.5:.18,.18,this.sfx)}click(){this.ctx&&this.tone("triangle",1200,900,.05,.12,this.sfx)}startCrowd(){let t=this.ctx,e=t.createBufferSource();e.buffer=this.noise,e.loop=!0;let i=t.createBiquadFilter();i.type="bandpass",i.frequency.value=700,i.Q.value=.4,this.crowdGain=t.createGain(),this.crowdGain.gain.value=0,e.connect(i),i.connect(this.crowdGain),this.crowdGain.connect(this.sfx),e.start()}setCrowd(t){!this.ctx||!this.crowdGain||this.crowdGain.gain.setTargetAtTime(t*.12,this.ctx.currentTime,.4)}engine(t){if(!this.ctx)return null;if(this.engines[t])return this.engines[t];let e=this.ctx,i=e.createOscillator(),n=e.createOscillator();i.type="sawtooth",n.type="square";let r=e.createBiquadFilter();r.type="lowpass",r.frequency.value=600;let a=e.createGain();a.gain.value=0,i.connect(r),n.connect(r),r.connect(a),a.connect(this.sfx);let o=e.createBufferSource();o.buffer=this.noise,o.loop=!0;let l=e.createBiquadFilter();l.type="bandpass",l.frequency.value=600,l.Q.value=.7;let c=e.createGain();c.gain.value=0,o.connect(l),l.connect(c),c.connect(this.sfx),i.start(),n.start(),o.start();let h={o1:i,o2:n,f:r,g:a,bf:l,bg:c};return this.engines[t]=h,h}updateEngine(t,e,i,n,r,a,o){let l=this.engine(t);if(!l)return;let c=this.ctx.currentTime,h=Math.min(1,e/23),f=55+h*110+(r?0:20);l.o1.frequency.setTargetAtTime(f,c,.05),l.o2.frequency.setTargetAtTime(f*.5,c,.05),l.f.frequency.setTargetAtTime(400+h*1400+Math.abs(i)*300,c,.05);let u=a?(.05+Math.abs(i)*.05+h*.05)/Math.sqrt(o):0;l.g.gain.setTargetAtTime(u,c,.08),l.bg.gain.setTargetAtTime(a&&n?.35/Math.sqrt(o):0,c,.04),l.bf.frequency.setTargetAtTime(500+h*900,c,.1)}silenceEngines(){for(let t=0;t<this.engines.length;t++)this.engines[t]&&this.updateEngine(t,0,0,!1,!0,!1,1)}startMusic(){if(!this.ctx||this.musicTimer)return;let t=this.ctx,i=60/112/4,n=[[57,60,64],[53,57,60],[48,52,55],[55,59,62]],r=c=>440*Math.pow(2,(c-69)/12),a=t.currentTime+.1,o=0,l=()=>{for(;a<t.currentTime+.25;){let c=Math.floor(o/16)%4,h=n[c],f=o%16,u=a;if(f%4===0){let d=t.createOscillator(),m=t.createGain();d.frequency.setValueAtTime(120,u),d.frequency.exponentialRampToValueAtTime(40,u+.15),m.gain.setValueAtTime(.5,u),m.gain.exponentialRampToValueAtTime(.001,u+.2),d.connect(m),m.connect(this.music),d.start(u),d.stop(u+.25)}if(f%2===1){let d=t.createBufferSource();d.buffer=this.noise;let m=t.createBiquadFilter();m.type="highpass",m.frequency.value=7e3;let x=t.createGain();x.gain.setValueAtTime(.08,u),x.gain.exponentialRampToValueAtTime(.001,u+.05),d.connect(m),m.connect(x),x.connect(this.music),d.start(u,Math.random()),d.stop(u+.06)}if(f%2===0){let d=t.createOscillator();d.type="sawtooth",d.frequency.value=r(h[0]-24);let m=t.createBiquadFilter();m.type="lowpass",m.frequency.value=500;let x=t.createGain();x.gain.setValueAtTime(.12,u),x.gain.exponentialRampToValueAtTime(.001,u+i*1.8),d.connect(m),m.connect(x),x.connect(this.music),d.start(u),d.stop(u+i*2)}{let d=t.createOscillator();d.type="square",d.frequency.value=r(h[f%3]+(f%8<4?12:24));let m=t.createBiquadFilter();m.type="lowpass",m.frequency.value=2200;let x=t.createGain();x.gain.setValueAtTime(.035,u),x.gain.exponentialRampToValueAtTime(.001,u+i*.9),d.connect(m),m.connect(x),x.connect(this.music),d.start(u),d.stop(u+i)}a+=i,o++}};this.musicTimer=setInterval(l,60),l()}stopMusic(){this.musicTimer&&clearInterval(this.musicTimer),this.musicTimer=null}};var xs=s=>String(s).replace(/[&<>"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[t]),pM=s=>s===0?"b":"o";function mM(s){if(s.opts.freeplay)return"LIBRE";if(s.overtime){let e=Math.floor(s.overtimeElapsed);return`+${Math.floor(e/60)}:${String(e%60).padStart(2,"0")}`}if(s.opts.duration<=0)return"\u221E";let t=Math.ceil(s.timeLeft);return`${Math.floor(t/60)}:${String(t%60).padStart(2,"0")}`}var so=2*Math.PI*60,Xc=class{constructor(t){this.root=t,this.players=[],this.centerTimer=0,this.goalTimer=0}showHint(t,e=10){let i=document.createElement("div");i.className="hint-bar",i.innerHTML=t,this.root.appendChild(i),setTimeout(()=>i.classList.add("fade"),e*1e3),setTimeout(()=>i.remove(),e*1e3+1200)}setup(t,e,i){let n=this.root;if(n.innerHTML=`
      <div id="scorebar"><div class="team t0" id="s0">0</div><div id="clock">5:00</div><div class="team t1" id="s1">0</div></div>
      <div id="feed"></div>
      <div id="center-msg"></div>
      <div id="goal-banner"></div>
      <div id="replay-tag" class="hidden"><div class="r">REPLAY</div><div class="s">Appuyez sur SAUT pour passer</div></div>
      <div id="scoretable" class="hidden"></div>
      <div id="fps" class="hidden"></div>`,this.el={s0:n.querySelector("#s0"),s1:n.querySelector("#s1"),clock:n.querySelector("#clock"),feed:n.querySelector("#feed"),center:n.querySelector("#center-msg"),goal:n.querySelector("#goal-banner"),replay:n.querySelector("#replay-tag"),table:n.querySelector("#scoretable"),fps:n.querySelector("#fps")},this.players=e.map((r,a)=>{let o=document.createElement("div");o.className="phud";let l=i[a];return Object.assign(o.style,{left:`${l.x*100}%`,top:`${l.y*100}%`,width:`${l.w*100}%`,height:`${l.h*100}%`}),o.innerHTML=`
        <div class="boost">
          <svg viewBox="0 0 140 140"><circle cx="70" cy="70" r="60" fill="rgba(0,0,0,0.45)" stroke="rgba(255,255,255,0.12)" stroke-width="12" stroke-dasharray="${so*.75} ${so}"/>
          <circle class="arc" cx="70" cy="70" r="60" fill="none" stroke="url(#bg${a})" stroke-width="12" stroke-linecap="round" stroke-dasharray="0 ${so}"/>
          <defs><linearGradient id="bg${a}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffd24d"/><stop offset="1" stop-color="#ff6a00"/></linearGradient></defs></svg>
          <div class="num">33</div><div class="lbl">BOOST</div>
          <div class="speedo"><span class="sp">0</span> <small>km/h</small></div>
        </div>
        <div class="camtag"></div>
        <div class="popups"></div>
        <div class="demo-msg hidden">D\xC9TRUIT !</div>`,this.root.appendChild(o),o.dataset.split=l.h<.9?"1":"0",{el:o,car:r.car,arc:o.querySelector(".arc"),num:o.querySelector(".num"),sp:o.querySelector(".sp"),speedo:o.querySelector(".speedo"),cam:o.querySelector(".camtag"),popups:o.querySelector(".popups"),demo:o.querySelector(".demo-msg"),lastBoost:-1}}),i.length>1){let r=document.createElement("div");r.className="split-line",this.root.appendChild(r)}this.centerTimer=0,this.goalTimer=0,this.hudScale=0}showCenter(t,e=1,i="",n="#fff"){let r=this.el.center;r.textContent=t,r.style.color=n,r.className="",r.offsetWidth,r.className=`pop ${i}`,this.centerTimer=e}feed(t,e="#fff"){let i=document.createElement("div");for(i.className="feed-item",i.style.borderLeftColor=e,i.innerHTML=t,this.el.feed.prepend(i);this.el.feed.children.length>6;)this.el.feed.lastChild.remove();setTimeout(()=>i.remove(),6e3)}chat(t,e){this.feed(`${this.name(t)} : <span style="color:#fff">${xs(e)}</span>`,t.team===0?"#2f7bff":"#ff8a1f")}popup(t,e,i){let n=document.createElement("div");n.className="popup",n.innerHTML=`${xs(e)}${i?`<b>+${i}</b>`:""}`,t.popups.appendChild(n),setTimeout(()=>n.remove(),2300)}name(t){return`<span class="${pM(t.team)}">${xs(t.name)}</span>`}onEvent(t,e){switch(t.type){case"countdown":this.showCenter(String(t.n),.95);break;case"go":this.showCenter("GO !",.8,"","#ffe066");break;case"overtime":this.showCenter("PROLONGATION",2.4,"","#ffd34d");break;case"goal":{let i=t.team===0?"var(--blue)":"var(--orange)",n="";t.scorer?n=`${xs(t.scorer.name)} a marqu\xE9 !`:t.ownGoal&&(n=`Contre son camp de ${xs(t.ownGoal.name)}`),t.assist&&(n+=` <span style="color:#cfe0ff;font-size:20px">(passe de ${xs(t.assist.name)})</span>`),this.el.goal.innerHTML=`<div class="big" style="color:${i}">BUT !</div><div class="sub">${n}</div><div class="speed">${t.speedKmh} km/h</div>`,this.goalTimer=3,t.scorer?this.feed(`\u26BD ${this.name(t.scorer)} a marqu\xE9`,t.team===0?"#2f7bff":"#ff8a1f"):this.feed(`\u26BD But pour l'\xE9quipe ${t.team===0?"BLEUE":"ORANGE"}`,t.team===0?"#2f7bff":"#ff8a1f");break}case"demo":this.feed(`${this.name(t.attacker)} \u{1F4A5} ${this.name(t.victim)}`,"#ff5050");for(let i of this.players)i.car===t.victim&&i.demo.classList.remove("hidden");break;case"respawn":for(let i of this.players)i.car===t.car&&i.demo.classList.add("hidden");break;case"stat":for(let i of this.players)i.car===t.car&&this.popup(i,t.label,t.points);(t.label==="ARR\xCAT"||t.label==="ARR\xCAT \xC9PIQUE")&&this.feed(`\u{1F9E4} ${this.name(t.car)} \u2014 ${t.label.toLowerCase()}`,"#9fe0ff");break;case"flipReset":for(let i of this.players)i.car===t.car&&this.popup(i,"RESET DE FLIP !",0);break;case"replayStart":this.el.goal.innerHTML="";break;default:break}return e}update(t,e,i,n){let r=this.el;r.s0.textContent=e.score[0],r.s1.textContent=e.score[1],r.clock.textContent=mM(e),r.clock.className=e.overtime?"ot":!e.opts.freeplay&&e.opts.duration>0&&e.timeLeft<=30?"low":"",r.replay.classList.toggle("hidden",e.state!=="replay"),this.centerTimer>0&&(this.centerTimer-=t,this.centerTimer<=0&&(r.center.textContent="")),this.goalTimer>0&&(this.goalTimer-=t,this.goalTimer<=0&&(r.goal.innerHTML=""));let a=e.state==="replay",o=Math.max(.55,Math.min(1.6,window.innerHeight/1e3));if(o!==this.hudScale){this.hudScale=o;for(let c of this.players){let h=o*(c.el.dataset.split==="1"?.72:1);c.el.querySelector(".boost").style.transform=`scale(${h})`}}this.players.forEach((c,h)=>{let f=c.car;c.el.style.visibility=a?"hidden":"visible";let u=Math.round(f.boost);u!==c.lastBoost&&(c.lastBoost=u,c.num.textContent=u,c.arc.setAttribute("stroke-dasharray",`${so*.75*(u/100)} ${so}`),c.arc.style.opacity=u>0?1:0);let d=Math.round(f.vel.length()*3.6);c.sp.textContent=d,c.speedo.classList.toggle("ss",f.supersonic),c.cam.textContent=n.ballCam[h]?"CAM\xC9RA BALLE":"CAM\xC9RA VOITURE",f.demolished?c.demo.textContent=`D\xC9TRUIT ! Retour dans ${Math.max(1,Math.ceil(f.respawnTimer))}\u2026`:c.demo.classList.add("hidden")}),r.fps.classList.toggle("hidden",!n.showFps),n.showFps&&(r.fps.textContent=`${n.fps} FPS`);let l=n.scoreboard||e.state==="ended";return r.table.classList.toggle("hidden",!n.scoreboard),n.scoreboard&&(r.table.innerHTML=Yu(e)),l}clear(){this.root.innerHTML="",this.players=[]}};function Yu(s,t=!1){let e=null;if(t&&s.winner>=0)for(let n of s.cars)n.team===s.winner&&(!e||n.stats.score>e.stats.score)&&(e=n);let i="";for(let n of[0,1]){let r=s.cars.filter(a=>a.team===n).sort((a,o)=>o.stats.score-a.stats.score);if(r.length){i+=`<div class="st-team"><h4 style="color:${n===0?"var(--blue)":"var(--orange)"}">${n===0?"BLEU":"ORANGE"} \u2014 ${s.score[n]}</h4>
      <table class="st-table st-t${n}"><tr><th>JOUEUR</th><th>SCORE</th><th>BUTS</th><th>PASSES</th><th>ARR\xCATS</th><th>TIRS</th><th>D\xC9MOS</th></tr>`;for(let a of r){let o=a.stats;i+=`<tr><td>${xs(a.name)}${a.isBot?' <span style="color:#6f80a3;font-size:11px">IA</span>':""}${a===e?'<span class="mvp">\u2605 MVP</span>':""}</td>
        <td>${o.score}</td><td>${o.goals}</td><td>${o.assists}</td><td>${o.saves}</td><td>${o.shots}</td><td>${o.demos}</td></tr>`}i+="</table></div>"}}return i}var $u="supersonic-arena-settings-v1",qc={playerName:"Joueur",player2Name:"Joueur 2",body:"octane",accent:"#1b1d22",boostColor:"team",fov:110,camDistance:2.7,camHeight:1,camStiffness:11,ballCamDefault:!0,volMaster:.8,volSfx:.9,volMusic:.5,quality:"high",showFps:!1,deadzone:.15,invertPitch:!1,keys:null,teamSize:2,difficulty:"pro",duration:300,theme:"day",team:0,splitscreen:!1,p2Team:1,replays:!0,boostMode:"normal",gameMode:"classic",gravityScale:1,wallGrip:"arcade",airAssist:null};function am(){try{return!!localStorage.getItem($u)}catch{return!1}}function om(){let s={};try{s=JSON.parse(localStorage.getItem($u)||"{}")||{}}catch{s={}}let t={...qc,...s};return t.keys={...io,...s.keys||{}},t}function lm(s){try{localStorage.setItem($u,JSON.stringify(s))}catch{}}var ro={low:{label:"Basse",pixelRatio:.75,shadows:!1,bloom:!1,shadowSize:1024},medium:{label:"Moyenne",pixelRatio:1,shadows:!0,bloom:!1,shadowSize:1024},high:{label:"Haute",pixelRatio:1.5,shadows:!0,bloom:!0,shadowSize:2048},ultra:{label:"Ultra",pixelRatio:2,shadows:!0,bloom:!0,shadowSize:4096}};var cm=s=>String(s).replace(/[&<>"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[t]),gM=["#1b1d22","#e8e8e8","#d62828","#f7c948","#2ec27e","#8a4dff","#ff4fa3","#00c2d1","#6b4a2b"],xM=["team","#ffd24d","#ff3b3b","#39ff88","#b05cff","#4de1ff","#ffffff","#ff66cc"];function De(s,t,e,i=""){return`<div class="seg" data-seg="${s}">${t.map(([n,r])=>`<button data-v="${n}" class="${String(n)===String(e)?`on ${i}`:""}">${r}</button>`).join("")}</div>`}var Yc=class{constructor(t,e){this.root=t,this.app=e,this.screen=null,this.stack=[],this.focus=0,this.waitingKey=null}get s(){return this.app.settings}hide(){this.root.innerHTML="",this.screen=null}isOpen(){return!!this.screen}show(t,e=!0){e&&this.screen&&this.screen!==t&&this.stack.push(this.screen),this.screen=t,this.focus=0,this.render(),this.app.onMenuChange(t)}back(){let t=this.stack.pop();t?this.show(t,!1):this.app.inMatch()&&this.app.resume()}render(){let t=this[`html_${this.screen}`]();this.root.innerHTML=t,this.bind()}bind(){let t=this.root;t.querySelectorAll("[data-action]").forEach(e=>{e.addEventListener("click",()=>{this.app.sound.click(),this.action(e.dataset.action,e)})}),t.querySelectorAll("[data-seg]").forEach(e=>{e.querySelectorAll("button").forEach(i=>i.addEventListener("click",()=>{this.app.sound.click(),this.setOption(e.dataset.seg,i.dataset.v)}))}),t.querySelectorAll("input[type=range]").forEach(e=>{e.addEventListener("input",()=>{let i=parseFloat(e.value);this.s[e.dataset.key]=i;let n=e.parentElement.querySelector(".val");n&&(n.textContent=e.dataset.fmt==="pct"?`${Math.round(i*100)}%`:i),this.app.applySettings()})}),t.querySelectorAll("input[type=text]").forEach(e=>{e.addEventListener("input",()=>{this.s[e.dataset.key]=e.value.slice(0,16)||qc[e.dataset.key],this.app.saveSettings()})}),t.querySelectorAll(".swatch").forEach(e=>e.addEventListener("click",()=>{this.app.sound.click(),this.s[e.dataset.key]=e.dataset.v,this.app.applySettings(),this.render()})),t.querySelectorAll(".key[data-bind]").forEach(e=>{e.addEventListener("click",i=>{i.stopPropagation(),e.classList.add("wait"),e.textContent="\u2026";let[n,r]=e.dataset.bind.split(":");setTimeout(()=>this.app.input.captureNext(a=>{let o=[...this.s.keys[n]||[]];(a!=="Escape"||n==="pause")&&(o[+r]=a),this.s.keys[n]=o.filter(Boolean),this.app.saveSettings(),this.render()}),50)})})}setOption(t,e){let i=["teamSize","duration","team","p2Team","gravityScale"],n=e;i.includes(t)&&(n=Number(e)),(e==="true"||e==="false")&&(n=e==="true"),t==="freeUnlimited"?this.freeUnlimited=n:this.s[t]=n,this.app.applySettings(),this.render()}action(t){let e=this.app;switch(t){case"play":this.show("play");break;case"free":this.show("free");break;case"garage":this.show("garage");break;case"settings":this.show("settings");break;case"controls":this.show("controls");break;case"back":this.back();break;case"start":e.startMatch(this.matchConfig());break;case"startFree":e.startMatch({freeplay:!0,unlimitedBoost:this.freeUnlimited!==!1,wallGrip:this.s.wallGrip});break;case"resume":e.resume();break;case"restart":e.restart();break;case"quit":e.quitToMenu();break;case"resetSettings":{let i={keys:this.s.keys,playerName:this.s.playerName};Object.assign(this.s,qc,i),e.applySettings(),this.render();break}case"resetKeys":this.s.keys={...io},e.saveSettings(),this.render();break;case"quitGame":window.appQuit&&window.appQuit();break;case"fullscreen":window.appToggleFullscreen?window.appToggleFullscreen():document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen&&document.documentElement.requestFullscreen();break;default:break}}matchConfig(){let t=this.s;return{teamSize:t.teamSize,difficulty:t.difficulty,duration:t.duration,theme:t.theme,team:t.team,splitscreen:t.splitscreen,p2Team:t.p2Team,replays:t.replays,boostMode:t.boostMode,gravityScale:t.gravityScale,wallGrip:t.wallGrip,gameMode:t.gameMode}}html_main(){return`<div class="menu"><div class="col">
      <div class="title">Supersonic<br>Arena</div>
      <div class="subtitle">Football \xB7 voitures \xB7 fus\xE9es</div>
      <button class="btn primary" data-action="play">Jouer<small>Match contre l'IA, de 1c1 \xE0 4c4, seul ou en \xE9cran partag\xE9</small></button>
      <button class="btn" data-action="free">Entra\xEEnement libre<small>Toi, la balle et du boost illimit\xE9</small></button>
      <button class="btn" data-action="garage">Garage<small>Carrosserie, couleurs et tra\xEEn\xE9e de boost</small></button>
      <button class="btn" data-action="settings">Param\xE8tres<small>Graphismes, cam\xE9ra, audio, manette</small></button>
      <button class="btn" data-action="controls">Commandes<small>Clavier/souris et manette \u2014 touches personnalisables</small></button>
      ${this.app.isApp?"":`<button class="btn" data-action="fullscreen">Plein \xE9cran${this.app.isDesktop?"<small>F11 pour basculer fen\xEAtre / plein \xE9cran</small>":""}</button>`}
      ${this.app.isDesktop?'<button class="btn" data-action="quitGame">Quitter le jeu</button>':""}
      <div class="footer">Jeu de fan non officiel inspir\xE9 de Rocket League\xAE. Manette Xbox/PlayStation support\xE9e.<br>F11 ou \xAB Plein \xE9cran \xBB pour une immersion totale.</div>
    </div></div>`}html_play(){let t=this.s,e=Object.entries(Wa).map(([n,r])=>[n,r.label]),i=Object.entries(ms).map(([n,r])=>[n,r.label]);return`<div class="menu center dim"><div class="col">
      <h2>Partie rapide</h2>
      <div class="opt"><label>Mode</label>${De("gameMode",[["classic","Classique"],["heatseeker","Heatseeker"]],t.gameMode)}</div>
      ${t.gameMode==="heatseeker"?'<div class="hint">Heatseeker : apr\xE8s chaque touche, la balle fonce toute seule vers le but adverse, de plus en plus vite !</div>':""}
      <div class="opt"><label>Format</label>${De("teamSize",[[1,"1 c 1"],[2,"2 c 2"],[3,"3 c 3"],[4,"4 c 4"]],t.teamSize)}</div>
      <div class="opt"><label>Difficult\xE9 IA</label>${De("difficulty",e,t.difficulty)}</div>
      <div class="opt"><label>Dur\xE9e</label>${De("duration",[[120,"2 min"],[300,"5 min"],[600,"10 min"],[0,"Illimit\xE9e"]],t.duration)}</div>
      <div class="opt"><label>Ar\xE8ne</label>${De("theme",i,t.theme)}</div>
      <div class="opt"><label>Ton \xE9quipe</label>${De("team",[[0,"Bleue"],[1,"Orange"]],t.team,t.team===1?"orange":"")}</div>
      <div class="opt"><label>\xC9cran partag\xE9</label>${De("splitscreen",[[!1,"1 joueur"],[!0,"2 joueurs"]],t.splitscreen)}</div>
      ${t.splitscreen?`<div class="opt"><label>Joueur 2</label>${De("p2Team",[[t.team,"Avec moi"],[1-t.team,"Contre moi"]],t.p2Team)}</div>
      <div class="hint">Joueur 1 : clavier/souris (ou 2e manette). Joueur 2 : premi\xE8re manette branch\xE9e.</div>`:""}
      <div class="opt"><label>Replays des buts</label>${De("replays",[[!0,"Oui"],[!1,"Non"]],t.replays)}</div>
      <h3>Mutateurs</h3>
      <div class="opt"><label>Boost</label>${De("boostMode",[["normal","Normal"],["unlimited","Illimit\xE9"],["none","Aucun"]],t.boostMode)}</div>
      <div class="opt"><label>Gravit\xE9</label>${De("gravityScale",[[1,"Normale"],[.35,"Lunaire"],[1.6,"Forte"]],t.gravityScale)}</div>
      <div class="opt"><label>Murs &amp; plafond</label>${De("wallGrip",[["arcade","On colle partout"],["real","R\xE9aliste (RL)"]],t.wallGrip)}</div>
      <div class="btn-row"><button class="btn" data-action="back">Retour</button><button class="btn primary" data-action="start">Lancer le match</button></div>
    </div></div>`}html_free(){let t=this.s,e=Object.entries(ms).map(([i,n])=>[i,n.label]);return`<div class="menu center dim"><div class="col">
      <h2>Entra\xEEnement libre</h2>
      <div class="opt"><label>Ar\xE8ne</label>${De("theme",e,t.theme)}</div>
      <div class="opt"><label>Boost illimit\xE9</label>${De("freeUnlimited",[[!0,"Oui"],[!1,"Non"]],this.freeUnlimited!==!1)}</div>
      <div class="opt"><label>Murs &amp; plafond</label>${De("wallGrip",[["arcade","On colle partout"],["real","R\xE9aliste (RL)"]],t.wallGrip)}</div>
      <div class="opt"><label>Vol assist\xE9</label>${De("airAssist",[[!0,"Oui"],[!1,"Non"]],t.airAssist)}</div>
      ${this.app.isTouch?'<p class="hint">Bouton <b>BALLE</b> : replacer la balle devant toi \xB7 <b>TIR</b> : la balle est lanc\xE9e vers toi (parfait pour les a\xE9riennes).</p>':`<p class="hint">Touche <span class="key">${$n(t.keys.resetBall[0])}</span> : replacer la balle devant toi \xB7
      <span class="key">${$n(t.keys.shootBall[0])}</span> : la balle est lanc\xE9e vers toi (parfait pour s'entra\xEEner aux a\xE9riennes).</p>`}
      <div class="btn-row"><button class="btn" data-action="back">Retour</button><button class="btn primary" data-action="startFree">C'est parti</button></div>
    </div></div>`}html_garage(){let t=this.s,e=Object.entries(Si).map(([r,a])=>[r,a.name]),i=(r,a)=>`<div class="swatches">${a.map(o=>`<div class="swatch ${t[r]===o?"on":""}" data-key="${r}" data-v="${o}"
      style="background:${o==="team"?"linear-gradient(135deg,#2f7bff 50%,#ff8a1f 50%)":o}" title="${o==="team"?"Couleur d'\xE9quipe":o}"></div>`).join("")}</div>`,n=Si[t.body]||Si.octane;return`<div class="menu"><div class="col">
      <h2>Garage</h2>
      <div class="opt"><label>Pseudo</label><input type="text" data-key="playerName" maxlength="16" value="${cm(t.playerName)}"></div>
      <div class="opt"><label>Carrosserie</label>${De("body",e,t.body)}</div>
      <div class="hint">Hitbox : ${(n.hx*200).toFixed(0)} \xD7 ${(n.hz*200).toFixed(0)} \xD7 ${(n.hy*200).toFixed(0)} cm \u2014 ${{octane:"polyvalente et haute, id\xE9ale pour les dribbles",dominus:"longue et plate, parfaite pour les frappes puissantes",breakout:"la plus longue, pour les tirs pr\xE9cis",merc:"massive, un tank pour d\xE9fendre"}[t.body]||""}</div>
      <div class="opt"><label>Couleur secondaire</label>${i("accent",gM)}</div>
      <div class="opt"><label>Tra\xEEn\xE9e de boost</label>${i("boostColor",xM)}</div>
      <div class="opt"><label>Pseudo joueur 2</label><input type="text" data-key="player2Name" maxlength="16" value="${cm(t.player2Name)}"></div>
      <div class="btn-row"><button class="btn" data-action="back">Retour</button></div>
    </div></div>`}html_settings(){let t=this.s,e=(i,n,r,a,o)=>`<div><input type="range" data-key="${i}" data-fmt="${o||""}" min="${n}" max="${r}" step="${a}" value="${t[i]}">
      <span class="val">${o==="pct"?`${Math.round(t[i]*100)}%`:t[i]}</span></div>`;return`<div class="menu center dim"><div class="col">
      <h2>Param\xE8tres</h2>
      <h3>Graphismes</h3>
      <div class="opt"><label>Qualit\xE9</label>${De("quality",Object.entries(ro).map(([i,n])=>[i,n.label]),t.quality)}</div>
      <div class="opt"><label>Afficher les FPS</label>${De("showFps",[[!1,"Non"],[!0,"Oui"]],t.showFps)}</div>
      <h3>Cam\xE9ra</h3>
      <div class="opt"><label>Champ de vision</label>${e("fov",70,120,1)}</div>
      <div class="opt"><label>Distance</label>${e("camDistance",1.8,4.2,.1)}</div>
      <div class="opt"><label>Hauteur</label>${e("camHeight",.5,2,.05)}</div>
      <div class="opt"><label>Rigidit\xE9</label>${e("camStiffness",4,25,1)}</div>
      <div class="opt"><label>Cam\xE9ra balle au d\xE9part</label>${De("ballCamDefault",[[!0,"Oui"],[!1,"Non"]],t.ballCamDefault)}</div>
      <h3>Pilotage</h3>
      <div class="opt"><label>Vol assist\xE9 au boost</label>${De("airAssist",[[!0,"Oui"],[!1,"Non"]],t.airAssist)}</div>
      <p class="hint">Vol assist\xE9 : en l'air, le stick / joystick / ${$n(t.keys.throttle[0])}${$n(t.keys.reverse[0])} oriente directement la voiture
      (haut = monter) et elle garde son cap toute seule : maintiens le boost pour voler. Sans assistance, contr\xF4le a\xE9rien de Rocket League.</p>
      <h3>Audio</h3>
      <div class="opt"><label>Volume g\xE9n\xE9ral</label>${e("volMaster",0,1,.05,"pct")}</div>
      <div class="opt"><label>Effets</label>${e("volSfx",0,1,.05,"pct")}</div>
      <div class="opt"><label>Musique (menus)</label>${e("volMusic",0,1,.05,"pct")}</div>
      <p class="hint">Messages rapides : touches <span class="key">1</span> \xE0 <span class="key">8</span>
      (Je l'ai ! \xB7 Joli tir ! \xB7 Quel arr\xEAt ! \xB7 Merci ! \xB7 Calcul\xE9. \xB7 Oups\u2026 \xB7 D\xE9fends ! \xB7 Bien jou\xE9 !)</p>
      <h3>Manette</h3>
      <div class="opt"><label>Zone morte</label>${e("deadzone",.02,.4,.01)}</div>
      <div class="opt"><label>Inverser le tangage</label>${De("invertPitch",[[!1,"Non"],[!0,"Oui"]],t.invertPitch)}</div>
      <div class="btn-row"><button class="btn" data-action="resetSettings">Par d\xE9faut</button><button class="btn primary" data-action="back">Retour</button></div>
    </div></div>`}html_controls(){let t=this.s,e=nm.map(([n,r])=>{let a=t.keys[n]||[],o=[0,1].map(l=>`<span class="key" data-bind="${n}:${l}">${a[l]?$n(a[l]):"+"}</span>`).join("");return`<tr><td>${r}</td><td>${o}</td></tr>`}).join(""),i=[["Acc\xE9l\xE9rer / reculer","RT / LT"],["Diriger \xB7 tangage \xB7 lacet","Stick gauche"],["Sauter / double saut / flip","A (\u2715)"],["Boost","B (\u25CB) ou RB (R1)"],["D\xE9rapage / air roll libre","X (\u25A1)"],["Air roll gauche","LB (L1)"],["Cam\xE9ra balle","Y (\u25B3)"],["Tableau des scores","Back / Share"],["Pause","Start / Options"],["Messages rapides","Croix directionnelle"]].map(([n,r])=>`<tr><td>${n}</td><td><span class="key">${r}</span></td></tr>`).join("");return`<div class="menu center dim"><div class="col">
      <h2>Commandes</h2>
      ${this.app.isTouch?`<h3>\xC9cran tactile</h3>
      <p class="hint">\u2022 <b>\u25B2 AVANCER</b> (vert) et <b>\u25BC RECULER</b> (rouge) \xE0 droite : acc\xE9l\xE9rer, freiner et reculer.
      Tu peux glisser le pouce d'un bouton \xE0 l'autre (AVANCER \u2192 BOOST) sans le lever.<br>
      \u2022 Pose le pouce n'importe o\xF9 sur la <b>moiti\xE9 gauche</b> : le joystick appara\xEEt pour <b>tourner</b>.
      En l'air, il dirige le vol (haut = monter).<br>
      \u2022 <b>SAUT</b> (bleu) : appuie deux fois en tenant le joystick pour un flip. <b>BOOST</b> (orange) : maintiens pour foncer.<br>
      \u2022 <b>D\xC9RAPE</b> : d\xE9rapage au sol, air roll en l'air. <b>CAM</b> : cam\xE9ra balle / voiture. <b>II</b> : pause.<br>
      \u2022 Une manette Bluetooth fonctionne aussi.</p>`:""}
      <p class="hint">Clique sur une touche puis appuie sur la nouvelle touche (ou un bouton de souris) pour la r\xE9assigner.</p>
      <h3>Clavier / souris</h3>
      <table class="keys-table">${e}</table>
      <p class="hint">Messages rapides : touches <span class="key">1</span> \xE0 <span class="key">8</span>
      (Je l'ai ! \xB7 Joli tir ! \xB7 Quel arr\xEAt ! \xB7 Merci ! \xB7 Calcul\xE9. \xB7 Oups\u2026 \xB7 D\xE9fends ! \xB7 Bien jou\xE9 !)</p>
      <h3>Manette</h3>
      <table class="keys-table">${i}</table>
      <h3>Astuces de pilote</h3>
      <p class="hint">\u2022 <b>Flip</b> : saute puis appuie de nouveau sur saut en tenant une direction \u2014 gros gain de vitesse.<br>
      \u2022 <b>A\xE9rienne</b> : saute, cabre le nez vers le haut puis boost pour voler vers la balle.<br>
      \u2022 <b>D\xE9molition</b> : percute un adversaire en vitesse supersonique (tra\xEEn\xE9e blanche).<br>
      \u2022 <b>Murs et plafond</b> : les rampes courbes permettent de rouler sur les murs.<br>
      \u2022 Sur le toit ? Appuie sur saut pour te remettre sur les roues.</p>
      <div class="btn-row"><button class="btn" data-action="resetKeys">Touches par d\xE9faut</button><button class="btn primary" data-action="back">Retour</button></div>
    </div></div>`}html_pause(){return`<div class="menu center dim"><div class="col" style="width:min(420px,94vw)">
      <h2>Pause</h2>
      <button class="btn primary" data-action="resume">Reprendre</button>
      <button class="btn" data-action="restart">Recommencer</button>
      <button class="btn" data-action="settings">Param\xE8tres</button>
      <button class="btn" data-action="controls">Commandes</button>
      <button class="btn" data-action="quit">Quitter le match</button>
    </div></div>`}html_end(){let t=this.app.match,e=this.app.localTeam(),i;return this.s.splitscreen&&this.app.localTeams().size>1?i=`L'\xE9quipe ${t.winner===0?"bleue":"orange"} gagne !`:i=t.winner===e?"VICTOIRE !":"D\xC9FAITE",`<div class="menu center dim"><div class="col">
      <div class="end-title" style="color:${t.winner===0?"var(--blue)":"var(--orange)"}">${i}</div>
      <div class="end-score"><span class="b">${t.score[0]}</span> \u2014 <span class="o">${t.score[1]}</span></div>
      ${Yu(t,!0)}
      <div class="btn-row"><button class="btn" data-action="quit">Menu principal</button><button class="btn primary" data-action="restart">Rejouer</button></div>
    </div></div>`}navigate(t){let e=[...this.root.querySelectorAll("button")];e.length&&(this.focus=(this.focus+t+e.length)%e.length,e.forEach((i,n)=>i.classList.toggle("focus",n===this.focus)),e[this.focus].scrollIntoView({block:"nearest"}))}activate(){let t=[...this.root.querySelectorAll("button")];t[this.focus]&&t[this.focus].click()}};var Er=ft.dt,_M={uniforms:{tDiffuse:{value:null},vignette:{value:.5},saturation:{value:1.1}},vertexShader:"varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`uniform sampler2D tDiffuse; uniform float vignette; uniform float saturation; varying vec2 vUv;
    void main() {
      vec4 c = texture2D(tDiffuse, vUv);
      float l = dot(c.rgb, vec3(0.2126, 0.7152, 0.0722));
      c.rgb = mix(vec3(l), c.rgb, saturation);
      c.rgb = mix(c.rgb, c.rgb * c.rgb * (3.0 - 2.0 * c.rgb), 0.18);
      vec2 d = vUv - 0.5;
      c.rgb *= 1.0 - dot(d, d) * vignette;
      gl_FragColor = c;
    }`},vM=["Je l'ai !","Joli tir !","Quel arr\xEAt !","Merci !","Calcul\xE9.","Oups\u2026","D\xE9fends !","Bien jou\xE9 !"],yM=new ct(.75,.9,1.3),hm=[1776930,15263976,14034984,16238920,3064446,9063935,49873,4475479],oi=new w,wr=new w;function um(s){let t=s.slice();for(let e=t.length-1;e>0;e--){let i=Math.floor(Math.random()*(e+1));[t[e],t[i]]=[t[i],t[e]]}return t}var Ju=class{constructor(){this.settings=om();let t=new URLSearchParams(window.location.search);this.isApp=t.get("app")==="android",this.isDesktop=t.get("app")==="desktop",this.isDesktop&&window.addEventListener("keydown",n=>{n.code==="F11"&&window.appToggleFullscreen&&(n.preventDefault(),window.appToggleFullscreen())}),t.get("app")==="desktop-browser"&&setInterval(()=>{fetch("/alive",{cache:"no-store"}).catch(()=>{})},5e3),this.isTouch=this.isApp||t.has("touch")||sm(),document.body.classList.toggle("touch",this.isTouch),this.isTouch&&!am()&&(this.settings.quality="medium"),(this.settings.airAssist===null||this.settings.airAssist===void 0)&&(this.settings.airAssist=this.isTouch),this.assists=[new no,new no],this.canvas=document.getElementById("game"),this.renderer=new fc({canvas:this.canvas,antialias:!0,powerPreference:"high-performance"}),this.renderer.outputColorSpace=We,this.renderer.toneMapping=os,this.renderer.shadowMap.type=rs,this.scene=new es,this.pmrem=new rr(this.renderer),this.scene.environmentIntensity=.8,this.cameras=[new Ze(80,1,.1,3e3),new Ze(80,1,.1,3e3)],this.cameras[0].layers.enable(3),this.cameras[1].layers.enable(2),this.rigs=this.cameras.map(n=>new zc(n)),this.effects=new Bc(this.scene),this.input=new Vc(this.settings),this.isTouch&&(this.touch=new Hc(this.input),this.input.touch=this.touch),this.sound=new Wc(this.settings),this.hud=new Xc(document.getElementById("hud")),this.menus=new Yc(document.getElementById("ui"),this);let e=Fp();this.ballMesh=new St(new ss(ft.ballRadius,48,32),new Ae({map:e.map,emissiveMap:e.emissiveMap,emissive:16777215,emissiveIntensity:1.3,roughness:.38,metalness:.35})),this.ballMesh.castShadow=!0,this.scene.add(this.ballMesh),this.ballShadow=new St(new je(2.6,2.6),new fe({map:kp(),transparent:!0,depthWrite:!1})),this.ballShadow.rotation.x=-Math.PI/2,this.ballShadow.renderOrder=2,this.scene.add(this.ballShadow),this.world=null,this.themeKey=null,this.qualityKey=null,this.match=null,this.mode="menu",this.paused=!1,this.carViews=[],this.locals=[],this.bots=[],this.acc=0,this.last=performance.now(),this.fpsFrames=0,this.fpsTime=0,this.fps=0,this.attractTime=0,this.endTimer=-1,this.garage=null,this.frameEvents=[],this.applySettings(!1),this.buildWorld(this.settings.theme),window.addEventListener("resize",()=>this.resize()),this.resize();let i=()=>{this.sound.init(),this.mode==="menu"&&this.sound.startMusic()};window.addEventListener("pointerdown",i),window.addEventListener("keydown",i),this.startAttract(),this.menus.show("main",!1),document.getElementById("loading").remove(),requestAnimationFrame(n=>this.frame(n))}get quality(){return ro[this.settings.quality]||ro.high}saveSettings(){lm(this.settings)}applySettings(t=!0){let e=this.settings;(e.airAssist===null||e.airAssist===void 0)&&(e.airAssist=!!this.isTouch),this.sound.applyVolumes(),this.qualityKey&&this.qualityKey!==e.quality&&this.buildWorld(this.themeKey,!0),this.qualityKey=e.quality,this.resize(),this.garage&&this.refreshGarage(),this.mode==="menu"&&this.menus.screen==="play"&&e.theme!==this.themeKey&&this.buildWorld(e.theme),this.mode==="menu"&&this.menus.screen==="free"&&e.theme!==this.themeKey&&this.buildWorld(e.theme),t&&this.saveSettings()}resize(){let t=this.quality,e=window.innerWidth,i=window.innerHeight;this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,t.pixelRatio)),this.renderer.setSize(e,i,!1),this.composer&&(this.composer.setPixelRatio(this.renderer.getPixelRatio()),this.composer.setSize(e,i))}buildWorld(t,e=!1){if(t===this.themeKey&&!e)return;let i=ms[t]||ms.day;this.themeKey=ms[t]?t:"day";let n=this.quality;this.world&&(this.scene.remove(this.world.group),this.world.group.traverse(h=>{h.geometry&&h.geometry.dispose(),h.material&&(Array.isArray(h.material)?h.material:[h.material]).forEach(f=>{f.map&&f.map.dispose(),f.dispose()})}));let r=new Ue,a=qp(i,n);r.add(a.group),r.add(Uu(i));let o=new Ma(i.hemiSky,i.hemiGround,i.hemiIntensity);r.add(o);let l=new Sa(i.sun,i.sunIntensity);l.position.set(...i.sunDir).normalize().multiplyScalar(120),l.target.position.set(0,0,0),l.castShadow=n.shadows,l.shadow.mapSize.set(n.shadowSize,n.shadowSize);let c=l.shadow.camera;if(c.left=-62,c.right=62,c.top=72,c.bottom=-72,c.near=10,c.far=300,l.shadow.bias=-4e-4,l.shadow.normalBias=.03,r.add(l,l.target),this.scene.add(r),this.scene.fog=new $r(i.fog,220,1100),this.envTarget&&this.envTarget.dispose(),this.envTarget=this.pmrem.fromScene(Yp(i),.02,.1,1500),this.scene.environment=this.envTarget.texture,this.renderer.shadowMap.enabled=n.shadows,this.renderer.toneMappingExposure=i.exposure,this.world={group:r,updatePads:a.updatePads},this.composer=null,n.bloom){let h=new Le(1,1,{type:ke,samples:n.msaa||4}),f=new xc(this.renderer,h);this.renderPass=new _c(this.scene,this.cameras[0]),f.addPass(this.renderPass),this.bloom=new hr(new nt(512,512),.48,.4,1.05),f.addPass(this.bloom),f.addPass(new vc),f.addPass(new cr(_M)),this.composer=f}this.scene.traverse(h=>{h.material&&(Array.isArray(h.material)?h.material:[h.material]).forEach(f=>{f.needsUpdate=!0})}),this.resize()}makePlayers(t){let e=this.settings,i=um(Mu),n=Object.keys(Si),r=[],a=(c,h,f,u)=>({team:h,name:c,body:f,isBot:!1,local:u});if(t.freeplay)return[a(e.playerName,0,e.body,0)];let o=t.teamSize,l=[a(e.playerName,t.team,e.body,0)];t.splitscreen&&l.push(a(e.player2Name,t.p2Team,n[(n.indexOf(e.body)+1)%n.length],1));for(let c=0;c<2;c++){let h=l.filter(f=>f.team===c);r.push(...h);for(let f=h.length;f<o;f++)r.push({team:c,name:i.pop(),body:n[Math.floor(Math.random()*n.length)],isBot:!0})}return r}startMatch(t){this.clearMatch(),this.lastConfig=t;let e=this.settings;t.theme?this.buildWorld(t.theme):this.buildWorld(e.theme);let i=this.makePlayers(t);if(this.match=new Za({players:i,duration:t.freeplay?0:t.duration,freeplay:!!t.freeplay,unlimitedBoost:!!t.unlimitedBoost||t.boostMode==="unlimited",noBoost:t.boostMode==="none",gravityScale:t.gravityScale||1,mode:t.gameMode||"classic",wallGrip:t.wallGrip||this.settings.wallGrip||"arcade",replays:t.freeplay?!1:t.replays}),this.splitscreen=!!t.splitscreen&&!t.freeplay,this.locals=[],this.match.cars.forEach((n,r)=>{i[r].local!==void 0&&(this.locals[i[r].local]={car:n,index:i[r].local})}),this.locals=this.locals.filter(Boolean),this.bots=this.match.cars.filter(n=>n.isBot).map(n=>new ja(n,t.difficulty||"pro")),this.createCarViews(this.match),this.rigs.forEach(n=>{n.reset(),n.ballCam=e.ballCamDefault}),this.assists.forEach(n=>{n.active=!1}),this.mode="match",this.paused=!1,this.endTimer=-1,this.acc=0,this.effects.clear(),this.menus.hide(),this.menus.stack=[],this.hud.root.classList.remove("hidden"),this.hud.setup(this.match,this.locals,this.viewports()),this.isTouch)(!e.tutorialSeen||t.freeplay)&&(this.hud.showHint(`<b>\u25B2 AVANCER</b> / <b>\u25BC RECULER</b> \xE0 droite \xB7 joystick \xE0 gauche pour tourner \xB7 <b>SAUT</b> deux fois = flip \xB7 <b>BOOST</b> \xB7 <b>D\xC9RAPE</b><br>
          <b>Voler</b> : SAUT puis maintiens BOOST${e.airAssist?", le joystick dirige le vol (haut = monter)":", joystick vers le bas pour lever le nez"} \xB7
          <b>Murs et plafond</b> : fonce vers un mur, tu montes dessus !`,11),e.tutorialSeen=!0,this.saveSettings()),this.enterFullscreen();else if(!e.tutorialSeen||t.freeplay){let n=r=>`<span class="key">${$n(e.keys[r][0])}</span>`;this.hud.showHint(`${n("throttle")}${n("reverse")} rouler \xB7 ${n("left")}${n("right")} tourner \xB7 ${n("jump")} sauter (2\xD7 = flip) \xB7 ${n("boost")} boost \xB7 ${n("ballCam")} cam\xE9ra \xB7 ${n("pause")} pause${t.freeplay?` \xB7 ${n("resetBall")} balle \xB7 ${n("shootBall")} tir`:""}<br>
        <b>Voler</b> : ${n("jump")} puis maintiens ${n("boost")}${e.airAssist?` \u2014 ${n("throttle")} monte, ${n("reverse")} descend, ${n("left")}${n("right")} tournent`:` en levant le nez avec ${n("reverse")}`} \xB7 <b>Murs et plafond</b> : fonce vers un mur !`,13),e.tutorialSeen=!0,this.saveSettings()}this.sound.init(),this.sound.stopMusic(),document.body.style.cursor="none"}enterFullscreen(){if(!this.isApp)try{let t=document.documentElement;!document.fullscreenElement&&t.requestFullscreen&&t.requestFullscreen().then(()=>{screen.orientation&&screen.orientation.lock&&screen.orientation.lock("landscape").catch(()=>{})}).catch(()=>{})}catch{}}createCarViews(t){this.carViews.forEach(n=>{this.scene.remove(n.group),n.dispose()});let e=this.settings,i=new Set(this.locals.map(n=>n.car));this.carViews=t.cars.map((n,r)=>{let a=i.has(n),o=a?new ct(e.accent).getHex():hm[(r*3+1)%hm.length],l=a&&e.boostColor!=="team"?new ct(e.boostColor).getHex():null,c=new to(n,{teamColor:ur[n.team].main,accent:o,boostColor:l,showName:!a||this.splitscreen,lite:!this.quality.bloom}),h=this.locals.findIndex(f=>f.car===n);return c.nameTag&&h>=0&&c.nameTag.layers.set(2+h),this.scene.add(c.group),c})}clearMatch(){this.match=null,this.touch&&this.touch.show(!1),this.carViews.forEach(t=>{this.scene.remove(t.group),t.dispose()}),this.carViews=[],this.bots=[],this.locals=[],this.hud.clear(),this.hud.root.classList.add("hidden")}startAttract(){this.clearMatch(),this.mode="menu",this.splitscreen=!1;let t=um(Mu),e=Object.keys(Si),i=[];for(let n=0;n<2;n++)for(let r=0;r<2;r++)i.push({team:n,name:t.pop(),body:e[(n*2+r)%4],isBot:!0});this.match=new Za({players:i,duration:0,replays:!1}),this.bots=this.match.cars.map(n=>new ja(n,"allstar")),this.createCarViews(this.match),this.rigs[0].reset(),this.attractTime=0,document.body.style.cursor=""}restart(){this.lastConfig&&this.startMatch(this.lastConfig)}resume(){this.paused=!1,this.menus.hide(),this.menus.stack=[],document.body.style.cursor="none"}pause(){this.mode!=="match"||this.match.state==="ended"||(this.paused=!0,this.touch&&this.touch.show(!1),this.menus.stack=[],this.menus.show("pause",!1),this.sound.silenceEngines(),document.body.style.cursor="")}quitToMenu(){this.paused=!1,this.menus.stack=[],this.startAttract(),this.menus.show("main",!1),this.sound.startMusic()}inMatch(){return this.mode==="match"}localTeam(){return this.locals.length?this.locals[0].car.team:0}localTeams(){return new Set(this.locals.map(t=>t.car.team))}onMenuChange(t){t==="garage"?this.enterGarage():this.garage&&this.exitGarage(),(t==="play"||t==="free")&&this.mode==="menu"&&this.buildWorld(this.settings.theme)}enterGarage(){this.garage||(this.garage={t:0,view:null},this.rigs[0].reset(),this.refreshGarage())}refreshGarage(){if(!this.garage)return;let t=this.settings;this.garage.view&&(this.scene.remove(this.garage.view.group),this.garage.view.dispose());let e={bodyKey:t.body,name:t.playerName,team:0},i=new to(e,{teamColor:ur[0].main,accent:new ct(t.accent).getHex(),boostColor:t.boostColor!=="team"?new ct(t.boostColor).getHex():null,showName:!1,lite:!this.quality.bloom});this.scene.add(i.group),this.garage.view=i}exitGarage(){this.garage&&(this.garage.view&&(this.scene.remove(this.garage.view.group),this.garage.view.dispose()),this.garage=null,this.rigs[0].reset())}viewports(){return this.mode==="match"&&this.splitscreen&&this.locals.length>1?[{x:0,y:0,w:1,h:.5},{x:0,y:.5,w:1,h:.5}]:[{x:0,y:0,w:1,h:1}]}frame(t){requestAnimationFrame(n=>this.frame(n));let e=Math.min(.1,(t-this.last)/1e3);this.last=t,this.fpsFrames++,this.fpsTime+=e,this.fpsTime>.5&&(this.fps=Math.round(this.fpsFrames/this.fpsTime),this.fpsFrames=0,this.fpsTime=0),this.input.poll(),this.handleUiInput();let i=this.match&&!this.paused&&!this.garage;if(i){this.acc+=e;let n=0;for(;this.acc>=Er&&n<12;)this.step(),this.acc-=Er,n++;n===12&&(this.acc=0)}this.processEvents(),this.render(e,i)}handleUiInput(){let t=this.input,e=this.splitscreen;if(this.menus.isOpen()){for(let i=0;i<2;i++)for(let n of t.padFor(i,!1)){let r=t.padPressed.get(n.index)||[];r[12]&&this.menus.navigate(-1),r[13]&&this.menus.navigate(1),r[0]&&this.menus.activate(),r[1]&&this.menus.back()}this.mode==="match"&&t.pressed("pause",0,!1)&&this.menus.screen==="pause"?this.resume():t.frameKeys&&t.frameKeys.has("Escape")&&this.menus.screen!=="main"&&this.menus.screen!=="pause"&&this.menus.screen!=="end"&&this.menus.back();return}if(this.mode==="match"){for(let i=0;i<this.locals.length;i++){if(t.pressed("pause",i,e)){this.pause();return}t.pressed("ballCam",i,e)&&(this.rigs[i].ballCam=!this.rigs[i].ballCam),this.match.state==="replay"&&t.pressed("jump",i,e)&&this.match.requestSkip()}if(this.match.opts.freeplay&&this.locals[0])t.pressed("resetBall",0,e)&&this.freeplayBall(!1),t.pressed("shootBall",0,e)&&this.freeplayBall(!0);else for(let i=0;i<this.locals.length;i++){let n=t.quickChat(i,e);n>=0&&this.say(this.locals[i].car,vM[n])}}}say(t,e){if(this.mode!=="match"||!this.match||!this.match.cars.includes(t))return;let i=performance.now();t.chatLog=(t.chatLog||[]).filter(n=>i-n<4e3),!(t.chatLog.length>=3)&&(t.chatLog.push(i),this.hud.chat(t,e))}botChatter(t){if(this.mode!=="match"||this.match.opts.freeplay)return;let e=this.match.cars.filter(r=>r.isBot),i=r=>r[Math.floor(Math.random()*r.length)],n=(r,a)=>setTimeout(()=>this.say(r,a),700+Math.random()*1500);if(t.type==="goal"){let r=e.filter(o=>o.team===t.team),a=e.filter(o=>o.team!==t.team);r.length&&Math.random()<.5&&n(i(r),t.scorer&&t.scorer.isBot&&r.includes(t.scorer)?i(["Calcul\xE9.","Et c'est dedans !"]):i(["Joli tir !","Quel but !","Merci !"])),a.length&&Math.random()<.35&&n(i(a),i(["Oups\u2026","\xC7a arrive\u2026","Pas mal."]))}else if(t.type==="stat"&&t.label.startsWith("ARR\xCAT")&&Math.random()<.35){let r=e.filter(a=>a!==t.car);r.length&&n(i(r),"Quel arr\xEAt !")}else t.type==="end"&&e.forEach(r=>{Math.random()<.6&&n(r,i(["GG","Bien jou\xE9 !","Belle partie !"]))})}rumble(t,e,i,n){let r=this.locals.findIndex(a=>a.car===t);if(!(r<0))for(let a of this.input.padFor(r,this.splitscreen))try{a.vibrationActuator&&a.vibrationActuator.playEffect&&a.vibrationActuator.playEffect("dual-rumble",{duration:n,strongMagnitude:e,weakMagnitude:i})}catch{}}freeplayBall(t){let e=this.match,i=this.locals[0].car,n=e.ball;if(i.forward(oi),oi.y=0,oi.normalize(),t){let r=Math.random()*Math.PI*2,a=new w(i.pos.x+Math.cos(r)*22,2,i.pos.z+Math.sin(r)*22);a.x=ui.clamp(a.x,-ee.W+4,ee.W-4),a.z=ui.clamp(a.z,-ee.L+4,ee.L-4);let o=i.pos.clone().addScaledVector(oi,8);o.y=5+Math.random()*5;let l=2.2;n.reset(a.x,a.y,a.z),n.vel.copy(o).sub(a).multiplyScalar(1/l),n.vel.y-=.5*ft.gravity*l}else{let r=i.pos.clone().addScaledVector(oi,7);r.x=ui.clamp(r.x,-ee.W+3,ee.W-3),r.z=ui.clamp(r.z,-ee.L+3,ee.L-3),n.reset(r.x,1.5,r.z)}e.state="playing",e.refreshPrediction()}step(){let t=this.match;for(let e of this.locals)this.input.controls(e.index,this.splitscreen,e.car.controls),this.settings.airAssist&&this.assists[e.index].apply(e.car,e.car.controls,Er);for(let e of this.bots)e.update(Er,t);t.tick(Er),t.events.length&&(this.frameEvents.push(...t.events),t.events.length=0),this.mode==="menu"&&t.state==="playing"&&t.time>240&&t.kickoff===!1&&Math.random()<5e-4&&t.resetKickoff()}processEvents(){let t=this.match,e=this.mode==="match",i=new Set(this.locals.map(n=>n.car));for(let n of this.frameEvents)switch(e&&(this.hud.onEvent(n,t),this.botChatter(n)),n.type){case"hit":this.effects.sparks(n.pos,n.strength),e&&this.sound.hit(n.pos,n.strength),this.rumble(n.car,Math.min(1,n.strength/20),Math.min(1,n.strength/12),90),i.has(n.car)&&this.rigs[this.locals.findIndex(r=>r.car===n.car)].addShake(Math.min(.25,n.strength*.01));break;case"bounce":e&&this.sound.bounce(n.pos,n.strength);break;case"jump":case"dodge":i.has(n.car)&&this.sound.jump(n.car.pos);break;case"pad":this.effects.padPickup(n.pos,n.big),i.has(n.car)&&this.sound.pad(n.pos,n.big);break;case"bump":e&&this.sound.bump(n.pos,n.strength),this.rumble(n.victim,.7,.5,150),this.rumble(n.attacker,.4,.4,100);break;case"demo":this.effects.demolition(n.pos,ur[n.victim.team].main),e&&this.sound.explosion(n.pos,!1),this.locals.forEach((r,a)=>{(r.car===n.victim||r.car===n.attacker)&&this.rigs[a].addShake(.4)}),this.rumble(n.victim,1,1,400),this.rumble(n.attacker,.6,.8,200);break;case"goal":this.effects.explosion(n.pos,ur[n.team].main,!0),e&&this.sound.explosion(n.pos,!0),e&&this.sound.horn(this.localTeams().has(n.team)),this.rigs.forEach(r=>r.addShake(.7)),this.locals.forEach(r=>this.rumble(r.car,.8,.8,600));break;case"replayGoal":this.effects.explosion(n.pos,ur[n.team].main,!0),e&&this.sound.explosion(n.pos,!0);break;case"kickoff":case"replayStart":this.effects.clear(),this.rigs.forEach(r=>r.reset());break;case"countdown":e&&this.sound.beep(!1);break;case"go":e&&this.sound.beep(!0);break;case"overtime":e&&this.sound.beep(!0);break;case"end":e&&(this.endTimer=2.5,this.sound.cheer(4));break;default:break}this.frameEvents.length=0}visualStates(t){let e=this.match,i=[];if(e.state==="replay"&&e.replay){let r=e.replaySnapshot(e.replay.time),{a,b:o,k:l}=r,c=Math.max(.001,o.t-a.t);e.cars.forEach((u,d)=>{let m=a.cars[d],x=o.cars[d],g=new w(m[0]+(x[0]-m[0])*l,m[1]+(x[1]-m[1])*l,m[2]+(x[2]-m[2])*l),p=new ae(m[3],m[4],m[5],m[6]),M=new ae(x[3],x[4],x[5],x[6]),S=new w(x[0]-m[0],x[1]-m[1],x[2]-m[2]).multiplyScalar(1/c);S.lengthSq()>3e3&&S.set(0,0,0),i.push({pos:g,quat:p.slerp(M,l),boosting:!!m[7],demolished:!!m[8],steer:m[9],spin:m[10]+(x[10]-m[10])*l,supersonic:!!m[11],vel:S,onGround:!0,groundNormal:new w(0,1,0)})});let h=a.ball,f=o.ball;return{cars:i,ball:{pos:new w(h[0]+(f[0]-h[0])*l,h[1]+(f[1]-h[1])*l,h[2]+(f[2]-h[2])*l),quat:new ae(h[3],h[4],h[5],h[6]).slerp(new ae(f[3],f[4],f[5],f[6]),l),hidden:!!h[7]}}}for(let r of e.cars)i.push({pos:new w().lerpVectors(r.prevPos,r.pos,t),quat:new ae().slerpQuaternions(r.prevQuat,r.quat,t),boosting:r.boosting,demolished:r.demolished,steer:r.steerVis,spin:r.wheelSpin,supersonic:r.supersonic,vel:r.vel,onGround:r.onGround,groundNormal:r.groundNormal,braking:r.onGround&&(r.controls.handbrake||r.controls.throttle*r.vel.dot(r.forward(oi))<-.5)});let n=e.ball;return{cars:i,ball:{pos:new w().lerpVectors(n.prevPos,n.pos,t),quat:new ae().slerpQuaternions(n.prevQuat,n.quat,t),hidden:n.hidden}}}render(t,e){let i=this.match,n=performance.now()/1e3,r=e?this.acc/Er:1,a=this.visualStates(r);a.cars.forEach((p,M)=>{let S=this.carViews[M];if(S&&(S.update(p,n),this.garage&&(S.group.visible=!1),!(p.demolished||this.garage||!e))){if(p.boosting){wr.set(1,0,0).applyQuaternion(p.quat);for(let v=0;v<2;v++)S.exhaustWorld(v,oi),this.effects.boost(oi,wr,p.vel,S.boostColor,p.supersonic)}if(p.supersonic)for(let v of[1,-1])oi.set(S.backX,S.wheelBaseY+.05,v*S.halfWidth).applyQuaternion(p.quat).add(p.pos),this.effects.trail(oi,new ct(.8,.9,1.2))}});let o=a.ball;this.ballMesh.visible=!o.hidden&&!this.garage,this.ballMesh.position.copy(o.pos),this.ballMesh.quaternion.copy(o.quat);let l=i.state==="replay"?0:i.ball.vel.length();if(e&&this.ballMesh.visible&&l>19&&!this.garage){let p=Math.min(1,(l-19)/15);this.effects.trail(o.pos,yM.clone().multiplyScalar(.35+p*.5),1.1)}let c=o.pos.y-ft.ballRadius;this.ballShadow.visible=this.ballMesh.visible&&Math.abs(o.pos.x)<ee.W-2&&Math.abs(o.pos.z)<ee.L+ee.GD,this.ballShadow.position.set(o.pos.x,.03,o.pos.z);let h=1+c*.05;this.ballShadow.scale.set(h,h,h),this.ballShadow.material.opacity=Math.max(.15,.85-c*.035),this.world&&this.world.updatePads(t,i.pads),this.effects.update(e?t:0);let f=this.viewports(),u=window.innerWidth,d=window.innerHeight;f.forEach((p,M)=>{let S=this.cameras[M],v=p.w*u/(p.h*d);S.aspect=v,S.fov=em(this.mode==="match"?this.settings.fov:90,v),S.updateProjectionMatrix()}),this.updateCameras(t,a);let m=this.cameras[0];if(this.sound.setListener(m.position,oi.set(1,0,0).applyQuaternion(m.quaternion)),this.mode==="match"&&!this.paused&&i.state!=="replay"){this.locals.forEach((M,S)=>{let v=M.car;this.sound.updateEngine(S,v.vel.length(),v.controls.throttle,v.boosting,v.onGround,!v.demolished,this.locals.length)});let p=Math.abs(i.ball.pos.z);this.sound.setCrowd(.35+Math.max(0,1-(ee.L-p)/30)*.6)}else this.sound.silenceEngines(),this.sound.setCrowd(this.mode==="menu"?.15:.3);let x=this.renderer,g=x.getPixelRatio();if(f.length===1&&this.composer?(this.effects.setViewportHeight(d*g/(2*Math.tan(ui.degToRad(this.cameras[0].fov)/2))),this.renderPass.camera=this.cameras[0],this.composer.render(t)):(x.setScissorTest(!0),f.forEach((p,M)=>{let S=p.x*u,v=(1-p.y-p.h)*d;x.setViewport(S,v,p.w*u,p.h*d),x.setScissor(S,v,p.w*u,p.h*d),this.effects.setViewportHeight(p.h*d*g/(2*Math.tan(ui.degToRad(this.cameras[M].fov)/2))),x.render(this.scene,this.cameras[M])}),x.setScissorTest(!1),x.setViewport(0,0,u,d)),this.mode==="match"&&i){let p=this.locals.some((M,S)=>this.input.held("scoreboard",S,this.splitscreen));this.touch&&(this.touch.show(!this.paused&&!this.menus.isOpen()&&i.state!=="ended",i.opts.freeplay),this.touch.setBallCam(this.rigs[0].ballCam)),this.hud.update(t,i,this.locals,{ballCam:this.rigs.map(M=>M.ballCam),showFps:this.settings.showFps,fps:this.fps,scoreboard:p&&!this.paused}),this.endTimer>0&&(this.endTimer-=t,this.endTimer<=0&&(this.menus.stack=[],this.menus.show("end",!1),document.body.style.cursor=""))}}replayCamera(t,e){let i=this.match,n=e.ball.pos,r=i.goalInfo,o=(r?r.team:0)===0?ee.L:-ee.L,l=Math.sign(o),c=i.replay.time>i.replay.goalTime-1.3,h=new w,f=new w().copy(n),u=r&&r.scorer?i.cars.indexOf(r.scorer):-1,d=u>=0?e.cars[u]:null,m=6;if(c){let x=n.x>=0?1:-1;h.set(x*(ee.GW+3.5),4.2,o-l*12),m=this.replayShot==="finish"?3:1e3,this.replayShot="finish"}else if(d&&!d.demolished){let x=oi.copy(d.pos).sub(n);x.y=0,x.lengthSq()<.5&&x.set(0,0,-l),x.normalize(),h.copy(d.pos).addScaledVector(x,4.5),h.y+=1.8,f.lerp(d.pos,.25),this.replayShot="chase"}else{let x=oi.set(n.x*.3,0,n.z-o);x.lengthSq()<1&&x.set(0,0,-l),x.normalize(),h.copy(n).addScaledVector(x,11),h.y=Math.max(n.y+3.5,4),this.replayShot="ball"}kc(h,1),this.rigs.forEach((x,g)=>{g>=this.viewports().length||(m>100&&x.reset(),x.setView(t,h,f,Math.min(m,8)))})}updateCameras(t,e){let i=this.match,n=this.settings,r={camDistance:n.camDistance,camHeight:n.camHeight,camStiffness:n.camStiffness};if(this.garage){this.garage.t+=t;let a=this.garage;a.view.update({pos:new w(0,Si[n.body].hy+ft.rideHeight,0),quat:new ae().setFromAxisAngle(new w(0,1,0),a.t*.5),boosting:Math.sin(a.t*.8)>.6,demolished:!1,steer:Math.sin(a.t*.7)*.6,spin:a.t*3,supersonic:!1},performance.now()/1e3);let o=.75+Math.sin(a.t*.2)*.25,l=2.9;oi.set(Math.cos(o)*l,1,Math.sin(o)*l),wr.set(-Math.sin(o),0,Math.cos(o)).multiplyScalar(1.05),wr.y=.3,this.rigs[0].setView(t,oi,wr,3);return}if(i.state==="replay"){this.replayCamera(t,e);return}if(this.mode==="menu"){if(this.attractTime+=t,Math.floor(this.attractTime/11)%3===1&&e.cars[0]){let h=e.cars[Math.floor(this.attractTime/33)%e.cars.length];if(!h.demolished){this.rigs[0].ballCam=!0,this.rigs[0].follow(t,h,e.ball.pos,{camDistance:3.2,camHeight:1.3,camStiffness:6});return}}let o=this.attractTime*.06,l=e.ball.pos,c=oi.set(Math.sin(o)*34,13+Math.sin(o*.7)*4,Math.cos(o)*44);kc(c,1),this.rigs[0].setView(t,c,wr.copy(l).multiplyScalar(.7),2);return}this.locals.forEach((a,o)=>{let l=e.cars[this.match.cars.indexOf(a.car)];if(!l)return;let[c]=this.input.lookStick(o,this.splitscreen);if(this.rigs[o].swivel+=(c*Math.PI-this.rigs[o].swivel)*Math.min(1,t*10),l.demolished){this.rigs[o].setView(t,this.rigs[o].pos,e.ball.pos,2);return}this.rigs[o].follow(t,l,e.ball.hidden?null:e.ball.pos,r)})}};function dm(){try{let s=document.createElement("canvas");if(!(s.getContext("webgl2")||s.getContext("webgl")))throw new Error("WebGL indisponible")}catch{let t=document.createElement("div");t.id="webgl-error",t.innerHTML="<div><h2>WebGL est d\xE9sactiv\xE9</h2><p>Active l'acc\xE9l\xE9ration mat\xE9rielle de ton navigateur (Chrome, Edge ou Firefox) puis recharge la page.</p></div>",document.body.appendChild(t);return}window.app=new Ju,window.androidBack=()=>{let s=window.app;return s.menus.isOpen()?s.menus.screen==="main"?"exit":(s.menus.screen==="pause"?s.resume():s.menus.screen==="end"?s.quitToMenu():s.menus.back(),"ok"):s.mode==="match"?(s.pause(),"ok"):"exit"},window.androidPause=()=>{let s=window.app;s.mode==="match"&&!s.paused&&s.match&&s.match.state!=="ended"&&s.pause(),s.sound.ctx&&s.sound.ctx.suspend()}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",dm):dm();})();
/*! Bundled license information:

three/build/three.core.js:
three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2026 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
