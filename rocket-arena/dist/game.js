(()=>{var Rd=0,Dh=1,Cd=2;var ss=1,Pd=2,Qs=3,Ni=0,Oe=1,ze=2,An=0,Ui=1,pn=2,Nh=3,Uh=4,Id=5;var rs=100,Ld=101,Dd=102,Nd=103,Ud=104,Fd=200,Bd=201,Od=202,zd=203,Fh=204,Bh=205,kd=206,Vd=207,Hd=208,Gd=209,Wd=210,Xd=211,qd=212,Yd=213,$d=214,Oo=0,zo=1,ko=2,Os=3,Vo=4,Ho=5,Go=6,Wo=7,yl=0,Jd=1,Zd=2,Gn=0,Ta=1,wa=2,Ea=3,as=4,Aa=5,Ra=6,Ca=7;var Oh=300,Fi=301,os=302,Ml=303,Sl=304,Pa=306,Ri=1e3,Zn=1001,Xo=1002,qe=1003,Kd=1004;var Ia=1005;var Ze=1006,bl=1007;var Bi=1008;var mn=1009,zh=1010,kh=1011,js=1012,Tl=1013,Wn=1014,Rn=1015,Ke=1016,wl=1017,El=1018,tr=1020,Vh=35902,Hh=35899,Gh=1021,Wh=1022,Cn=1023,jn=1026,Oi=1027,Al=1028,Rl=1029,zi=1030,Cl=1031;var Pl=1033,La=33776,Da=33777,Na=33778,Ua=33779,Il=35840,Ll=35841,Dl=35842,Nl=35843,Ul=36196,Fl=37492,Bl=37496,Ol=37488,zl=37489,Fa=37490,kl=37491,Vl=37808,Hl=37809,Gl=37810,Wl=37811,Xl=37812,ql=37813,Yl=37814,$l=37815,Jl=37816,Zl=37817,Kl=37818,Ql=37819,jl=37820,tc=37821,ec=36492,nc=36494,ic=36495,sc=36283,rc=36284,Ba=36285,ac=36286;var kr=2300,qo=2301,Fo=2302,yh=2303,Mh=2400,Sh=2401,bh=2402;var Qd=3200;var Oa=0,jd=1,gi="",We="srgb",Vr="srgb-linear",Hr="linear",oe="srgb";var Bo=7680;var tf=519,ef=512,nf=513,sf=514,oc=515,rf=516,af=517,lc=518,of=519,Xh=35044,er=35048;var qh="300 es",zn=2e3,zs=2001;function am(s){for(let t=s.length-1;t>=0;--t)if(s[t]>=65535)return!0;return!1}function om(s){return ArrayBuffer.isView(s)&&!(s instanceof DataView)}function Gr(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function lf(){let s=Gr("canvas");return s.style.display="block",s}var $u={},ks=null;function Wr(...s){let t="THREE."+s.shift();ks?ks("log",t,...s):console.log(t,...s)}function cf(s){let t=s[0];if(typeof t=="string"&&t.startsWith("TSL:")){let e=s[1];e&&e.isStackTrace?s[0]+=" "+e.getLocation():s[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return s}function kt(...s){s=cf(s);let t="THREE."+s.shift();if(ks)ks("warn",t,...s);else{let e=s[0];e&&e.isStackTrace?console.warn(e.getError(t)):console.warn(t,...s)}}function Ht(...s){s=cf(s);let t="THREE."+s.shift();if(ks)ks("error",t,...s);else{let e=s[0];e&&e.isStackTrace?console.error(e.getError(t)):console.error(t,...s)}}function Zi(...s){let t=s.join(" ");t in $u||($u[t]=!0,kt(...s))}function hf(s,t,e){return new Promise(function(n,i){function r(){switch(s.clientWaitSync(t,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:i();break;case s.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}var uf={[Oo]:zo,[ko]:Go,[Vo]:Wo,[Os]:Ho,[zo]:Oo,[Go]:ko,[Wo]:Vo,[Ho]:Os},ti=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){let n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){let n=this._listeners;if(n===void 0)return;let i=n[t];if(i!==void 0){let r=i.indexOf(e);r!==-1&&i.splice(r,1)}}dispatchEvent(t){let e=this._listeners;if(e===void 0)return;let n=e[t.type];if(n!==void 0){t.target=this;let i=n.slice(0);for(let r=0,a=i.length;r<a;r++)i[r].call(this,t);t.target=null}}},tn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Ju=1234567,Fr=Math.PI/180,Vs=180/Math.PI;function Qn(){let s=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(tn[s&255]+tn[s>>8&255]+tn[s>>16&255]+tn[s>>24&255]+"-"+tn[t&255]+tn[t>>8&255]+"-"+tn[t>>16&15|64]+tn[t>>24&255]+"-"+tn[e&63|128]+tn[e>>8&255]+"-"+tn[e>>16&255]+tn[e>>24&255]+tn[n&255]+tn[n>>8&255]+tn[n>>16&255]+tn[n>>24&255]).toLowerCase()}function Kt(s,t,e){return Math.max(t,Math.min(e,s))}function Yh(s,t){return(s%t+t)%t}function lm(s,t,e,n,i){return n+(s-t)*(i-n)/(e-t)}function cm(s,t,e){return s!==t?(e-s)/(t-s):0}function Br(s,t,e){return(1-e)*s+e*t}function hm(s,t,e,n){return Br(s,t,1-Math.exp(-e*n))}function um(s,t=1){return t-Math.abs(Yh(s,t*2)-t)}function dm(s,t,e){return s<=t?0:s>=e?1:(s=(s-t)/(e-t),s*s*(3-2*s))}function fm(s,t,e){return s<=t?0:s>=e?1:(s=(s-t)/(e-t),s*s*s*(s*(s*6-15)+10))}function pm(s,t){return s+Math.floor(Math.random()*(t-s+1))}function mm(s,t){return s+Math.random()*(t-s)}function gm(s){return s*(.5-Math.random())}function xm(s){s!==void 0&&(Ju=s);let t=Ju+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function _m(s){return s*Fr}function vm(s){return s*Vs}function ym(s){return s>0&&Number.isInteger(s)&&2**Math.round(Math.log2(s))===s}function Mm(s){return Math.pow(2,Math.ceil(Math.log(s)/Math.LN2))}function Sm(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function bm(s,t,e,n,i){let r=Math.cos,a=Math.sin,o=r(e/2),c=a(e/2),l=r((t+n)/2),h=a((t+n)/2),d=r((t-n)/2),u=a((t-n)/2),f=r((n-t)/2),p=a((n-t)/2);switch(i){case"XYX":s.set(o*h,c*d,c*u,o*l);break;case"YZY":s.set(c*u,o*h,c*d,o*l);break;case"ZXZ":s.set(c*d,c*u,o*h,o*l);break;case"XZX":s.set(o*h,c*p,c*f,o*l);break;case"YXY":s.set(c*f,o*h,c*p,o*l);break;case"ZYZ":s.set(c*p,c*f,o*h,o*l);break;default:kt("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function On(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:case Uint8ClampedArray:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function fe(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}var ln={DEG2RAD:Fr,RAD2DEG:Vs,generateUUID:Qn,clamp:Kt,euclideanModulo:Yh,mapLinear:lm,inverseLerp:cm,lerp:Br,damp:hm,pingpong:um,smoothstep:dm,smootherstep:fm,randInt:pm,randFloat:mm,randFloatSpread:gm,seededRandom:xm,degToRad:_m,radToDeg:vm,isPowerOfTwo:ym,ceilPowerOfTwo:Mm,floorPowerOfTwo:Sm,setQuaternionFromProperEuler:bm,normalize:fe,denormalize:On},jh=class jh{constructor(t=0,e=0){this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("THREE.Vector2: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,n=this.y,i=t.elements;return this.x=i[0]*e+i[3]*n+i[6],this.y=i[1]*e+i[4]*n+i[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Kt(this.x,t.x,e.x),this.y=Kt(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=Kt(this.x,t,e),this.y=Kt(this.y,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Kt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(Kt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let n=Math.cos(e),i=Math.sin(e),r=this.x-t.x,a=this.y-t.y;return this.x=r*n-a*i+t.x,this.y=r*i+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};jh.prototype.isVector2=!0;var it=jh,ae=class{constructor(t=0,e=0,n=0,i=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=i}static slerpFlat(t,e,n,i,r,a,o){let c=n[i+0],l=n[i+1],h=n[i+2],d=n[i+3],u=r[a+0],f=r[a+1],p=r[a+2],_=r[a+3];if(d!==_||c!==u||l!==f||h!==p){let m=c*u+l*f+h*p+d*_;m<0&&(u=-u,f=-f,p=-p,_=-_,m=-m);let g=1-o;if(m<.9995){let M=Math.acos(m),w=Math.sin(M);g=Math.sin(g*M)/w,o=Math.sin(o*M)/w,c=c*g+u*o,l=l*g+f*o,h=h*g+p*o,d=d*g+_*o}else{c=c*g+u*o,l=l*g+f*o,h=h*g+p*o,d=d*g+_*o;let M=1/Math.sqrt(c*c+l*l+h*h+d*d);c*=M,l*=M,h*=M,d*=M}}t[e]=c,t[e+1]=l,t[e+2]=h,t[e+3]=d}static multiplyQuaternionsFlat(t,e,n,i,r,a){let o=n[i],c=n[i+1],l=n[i+2],h=n[i+3],d=r[a],u=r[a+1],f=r[a+2],p=r[a+3];return t[e]=o*p+h*d+c*f-l*u,t[e+1]=c*p+h*u+l*d-o*f,t[e+2]=l*p+h*f+o*u-c*d,t[e+3]=h*p-o*d-c*u-l*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,i){return this._x=t,this._y=e,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){let n=t._x,i=t._y,r=t._z,a=t._order,o=Math.cos,c=Math.sin,l=o(n/2),h=o(i/2),d=o(r/2),u=c(n/2),f=c(i/2),p=c(r/2);switch(a){case"XYZ":this._x=u*h*d+l*f*p,this._y=l*f*d-u*h*p,this._z=l*h*p+u*f*d,this._w=l*h*d-u*f*p;break;case"YXZ":this._x=u*h*d+l*f*p,this._y=l*f*d-u*h*p,this._z=l*h*p-u*f*d,this._w=l*h*d+u*f*p;break;case"ZXY":this._x=u*h*d-l*f*p,this._y=l*f*d+u*h*p,this._z=l*h*p+u*f*d,this._w=l*h*d-u*f*p;break;case"ZYX":this._x=u*h*d-l*f*p,this._y=l*f*d+u*h*p,this._z=l*h*p-u*f*d,this._w=l*h*d+u*f*p;break;case"YZX":this._x=u*h*d+l*f*p,this._y=l*f*d+u*h*p,this._z=l*h*p-u*f*d,this._w=l*h*d-u*f*p;break;case"XZY":this._x=u*h*d-l*f*p,this._y=l*f*d-u*h*p,this._z=l*h*p+u*f*d,this._w=l*h*d+u*f*p;break;default:kt("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let n=e/2,i=Math.sin(n);return this._x=t.x*i,this._y=t.y*i,this._z=t.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,n=e[0],i=e[4],r=e[8],a=e[1],o=e[5],c=e[9],l=e[2],h=e[6],d=e[10],u=n+o+d;if(u>0){let f=.5/Math.sqrt(u+1);this._w=.25/f,this._x=(h-c)*f,this._y=(r-l)*f,this._z=(a-i)*f}else if(n>o&&n>d){let f=2*Math.sqrt(1+n-o-d);this._w=(h-c)/f,this._x=.25*f,this._y=(i+a)/f,this._z=(r+l)/f}else if(o>d){let f=2*Math.sqrt(1+o-n-d);this._w=(r-l)/f,this._x=(i+a)/f,this._y=.25*f,this._z=(c+h)/f}else{let f=2*Math.sqrt(1+d-n-o);this._w=(a-i)/f,this._x=(r+l)/f,this._y=(c+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Kt(this.dot(t),-1,1)))}rotateTowards(t,e){let n=this.angleTo(t);if(n===0)return this;let i=Math.min(1,e/n);return this.slerp(t,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let n=t._x,i=t._y,r=t._z,a=t._w,o=e._x,c=e._y,l=e._z,h=e._w;return this._x=n*h+a*o+i*l-r*c,this._y=i*h+a*c+r*o-n*l,this._z=r*h+a*l+n*c-i*o,this._w=a*h-n*o-i*c-r*l,this._onChangeCallback(),this}slerp(t,e){let n=t._x,i=t._y,r=t._z,a=t._w,o=this.dot(t);o<0&&(n=-n,i=-i,r=-r,a=-a,o=-o);let c=1-e;if(o<.9995){let l=Math.acos(o),h=Math.sin(l);c=Math.sin(c*l)/h,e=Math.sin(e*l)/h,this._x=this._x*c+n*e,this._y=this._y*c+i*e,this._z=this._z*c+r*e,this._w=this._w*c+a*e,this._onChangeCallback()}else this._x=this._x*c+n*e,this._y=this._y*c+i*e,this._z=this._z*c+r*e,this._w=this._w*c+a*e,this.normalize();return this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){let t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(i*Math.sin(t),i*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},tu=class tu{constructor(t=0,e=0,n=0){this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("THREE.Vector3: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Zu.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Zu.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,n=this.y,i=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*i,this.y=r[1]*e+r[4]*n+r[7]*i,this.z=r[2]*e+r[5]*n+r[8]*i,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,n=this.y,i=this.z,r=t.elements,a=1/(r[3]*e+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*i+r[12])*a,this.y=(r[1]*e+r[5]*n+r[9]*i+r[13])*a,this.z=(r[2]*e+r[6]*n+r[10]*i+r[14])*a,this}applyQuaternion(t){let e=this.x,n=this.y,i=this.z,r=t.x,a=t.y,o=t.z,c=t.w,l=2*(a*i-o*n),h=2*(o*e-r*i),d=2*(r*n-a*e);return this.x=e+c*l+a*d-o*h,this.y=n+c*h+o*l-r*d,this.z=i+c*d+r*h-a*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,n=this.y,i=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*i,this.y=r[1]*e+r[5]*n+r[9]*i,this.z=r[2]*e+r[6]*n+r[10]*i,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Kt(this.x,t.x,e.x),this.y=Kt(this.y,t.y,e.y),this.z=Kt(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=Kt(this.x,t,e),this.y=Kt(this.y,t,e),this.z=Kt(this.z,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Kt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let n=t.x,i=t.y,r=t.z,a=e.x,o=e.y,c=e.z;return this.x=i*c-r*o,this.y=r*a-n*c,this.z=n*o-i*a,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Jc.copy(this).projectOnVector(t),this.sub(Jc)}reflect(t){return this.sub(Jc.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(Kt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y,i=this.z-t.z;return e*e+n*n+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){let i=Math.sin(e)*t;return this.x=i*Math.sin(n),this.y=Math.cos(e)*t,this.z=i*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),i=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=i,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};tu.prototype.isVector3=!0;var E=tu,Jc=new E,Zu=new ae,eu=class eu{constructor(t,e,n,i,r,a,o,c,l){this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,i,r,a,o,c,l)}set(t,e,n,i,r,a,o,c,l){let h=this.elements;return h[0]=t,h[1]=i,h[2]=o,h[3]=e,h[4]=r,h[5]=c,h[6]=n,h[7]=a,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,i=e.elements,r=this.elements,a=n[0],o=n[3],c=n[6],l=n[1],h=n[4],d=n[7],u=n[2],f=n[5],p=n[8],_=i[0],m=i[3],g=i[6],M=i[1],w=i[4],y=i[7],T=i[2],b=i[5],P=i[8];return r[0]=a*_+o*M+c*T,r[3]=a*m+o*w+c*b,r[6]=a*g+o*y+c*P,r[1]=l*_+h*M+d*T,r[4]=l*m+h*w+d*b,r[7]=l*g+h*y+d*P,r[2]=u*_+f*M+p*T,r[5]=u*m+f*w+p*b,r[8]=u*g+f*y+p*P,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],a=t[4],o=t[5],c=t[6],l=t[7],h=t[8];return e*a*h-e*o*l-n*r*h+n*o*c+i*r*l-i*a*c}invert(){let t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],a=t[4],o=t[5],c=t[6],l=t[7],h=t[8],d=h*a-o*l,u=o*c-h*r,f=l*r-a*c,p=e*d+n*u+i*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let _=1/p;return t[0]=d*_,t[1]=(i*l-h*n)*_,t[2]=(o*n-i*a)*_,t[3]=u*_,t[4]=(h*e-i*c)*_,t[5]=(i*r-o*e)*_,t[6]=f*_,t[7]=(n*c-l*e)*_,t[8]=(a*e-n*r)*_,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,i,r,a,o){let c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*a+l*o)+a+t,-i*l,i*c,-i*(-l*a+c*o)+o+e,0,0,1),this}scale(t,e){return Zi("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Zc.makeScale(t,e)),this}rotate(t){return Zi("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Zc.makeRotation(-t)),this}translate(t,e){return Zi("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Zc.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,n=t.elements;for(let i=0;i<9;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}};eu.prototype.isMatrix3=!0;var Wt=eu,Zc=new Wt,Ku=new Wt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Qu=new Wt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Tm(){let s={enabled:!0,workingColorSpace:Vr,spaces:{},convert:function(i,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===oe&&(i.r=mi(i.r),i.g=mi(i.g),i.b=mi(i.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(i.applyMatrix3(this.spaces[r].toXYZ),i.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===oe&&(i.r=Bs(i.r),i.g=Bs(i.g),i.b=Bs(i.b))),i},workingToColorSpace:function(i,r){return this.convert(i,this.workingColorSpace,r)},colorSpaceToWorking:function(i,r){return this.convert(i,r,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===gi?Hr:this.spaces[i].transfer},getToneMappingMode:function(i){return this.spaces[i].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(i,r=this.workingColorSpace){return i.fromArray(this.spaces[r].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,r,a){return i.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(i,r){return Zi("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),s.workingToColorSpace(i,r)},toWorkingColorSpace:function(i,r){return Zi("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),s.colorSpaceToWorking(i,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return s.define({[Vr]:{primaries:t,whitePoint:n,transfer:Hr,toXYZ:Ku,fromXYZ:Qu,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:We},outputColorSpaceConfig:{drawingBufferColorSpace:We}},[We]:{primaries:t,whitePoint:n,transfer:oe,toXYZ:Ku,fromXYZ:Qu,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:We}}}),s}var Qt=Tm();function mi(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function Bs(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}var vs,Yo=class{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{vs===void 0&&(vs=Gr("canvas")),vs.width=t.width,vs.height=t.height;let i=vs.getContext("2d");t instanceof ImageData?i.putImageData(t,0,0):i.drawImage(t,0,0,t.width,t.height),n=vs}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=Gr("canvas");e.width=t.width,e.height=t.height;let n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);let i=n.getImageData(0,0,t.width,t.height),r=i.data;for(let a=0;a<r.length;a++)r[a]=mi(r[a]/255)*255;return n.putImageData(i,0,0),e}else if(t.data){let e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(mi(e[n]/255)*255):e[n]=mi(e[n]);return{data:e,width:t.width,height:t.height}}else return kt("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},wm=0,Hs=class{constructor(t=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:wm++}),this.uuid=Qn(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){let e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):typeof VideoFrame<"u"&&e instanceof VideoFrame?t.set(e.displayWidth,e.displayHeight,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let a=0,o=i.length;a<o;a++)i[a].isDataTexture?r.push(Kc(i[a].image)):r.push(Kc(i[a]))}else r=Kc(i);n.url=r}return e||(t.images[this.uuid]=n),n}};function Kc(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?Yo.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(kt("Texture: Unable to serialize Texture."),{})}var Em=0,Qc=new E,on=class s extends ti{constructor(t=s.DEFAULT_IMAGE,e=s.DEFAULT_MAPPING,n=Zn,i=Zn,r=Ze,a=Bi,o=Cn,c=mn,l=s.DEFAULT_ANISOTROPY,h=gi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Em++}),this.uuid=Qn(),this.name="",this.source=new Hs(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new it(0,0),this.repeat=new it(1,1),this.center=new it(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Wt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Qc).x}get height(){return this.source.getSize(Qc).y}get depth(){return this.source.getSize(Qc).z}get image(){return this.source.data}set image(t){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.normalized=t.normalized,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(let e in t){let n=t[e];if(n===void 0){kt(`Texture.setValues(): parameter '${e}' has value of undefined.`);continue}let i=this[e];if(i===void 0){kt(`Texture.setValues(): property '${e}' does not exist.`);continue}i&&n&&i.isVector2&&n.isVector2||i&&n&&i.isVector3&&n.isVector3||i&&n&&i.isMatrix3&&n.isMatrix3?i.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Oh)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Ri:t.x=t.x-Math.floor(t.x);break;case Zn:t.x=t.x<0?0:1;break;case Xo:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Ri:t.y=t.y-Math.floor(t.y);break;case Zn:t.y=t.y<0?0:1;break;case Xo:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}};on.DEFAULT_IMAGE=null;on.DEFAULT_MAPPING=Oh;on.DEFAULT_ANISOTROPY=1;var nu=class nu{constructor(t=0,e=0,n=0,i=1){this.x=t,this.y=e,this.z=n,this.w=i}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,i){return this.x=t,this.y=e,this.z=n,this.w=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("THREE.Vector4: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,n=this.y,i=this.z,r=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*i+a[12]*r,this.y=a[1]*e+a[5]*n+a[9]*i+a[13]*r,this.z=a[2]*e+a[6]*n+a[10]*i+a[14]*r,this.w=a[3]*e+a[7]*n+a[11]*i+a[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,i,r,c=t.elements,l=c[0],h=c[4],d=c[8],u=c[1],f=c[5],p=c[9],_=c[2],m=c[6],g=c[10];if(Math.abs(h-u)<.01&&Math.abs(d-_)<.01&&Math.abs(p-m)<.01){if(Math.abs(h+u)<.1&&Math.abs(d+_)<.1&&Math.abs(p+m)<.1&&Math.abs(l+f+g-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let w=(l+1)/2,y=(f+1)/2,T=(g+1)/2,b=(h+u)/4,P=(d+_)/4,v=(p+m)/4;return w>y&&w>T?w<.01?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(w),i=b/n,r=P/n):y>T?y<.01?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(y),n=b/i,r=v/i):T<.01?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(T),n=P/r,i=v/r),this.set(n,i,r,e),this}let M=Math.sqrt((m-p)*(m-p)+(d-_)*(d-_)+(u-h)*(u-h));return Math.abs(M)<.001&&(M=1),this.x=(m-p)/M,this.y=(d-_)/M,this.z=(u-h)/M,this.w=Math.acos((l+f+g-1)/2),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Kt(this.x,t.x,e.x),this.y=Kt(this.y,t.y,e.y),this.z=Kt(this.z,t.z,e.z),this.w=Kt(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=Kt(this.x,t,e),this.y=Kt(this.y,t,e),this.z=Kt(this.z,t,e),this.w=Kt(this.w,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Kt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};nu.prototype.isVector4=!0;var Ae=nu,$o=class extends ti{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ze,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new Ae(0,0,t,e),this.scissorTest=!1,this.viewport=new Ae(0,0,t,e),this.textures=[];let i={width:t,height:e,depth:n.depth},r=new on(i),a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(t={}){let e={minFilter:Ze,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),t!==null&&t.renderTarget===null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let i=0,r=this.textures.length;i<r;i++)this.textures[i].image.width=t,this.textures[i].image.height=e,this.textures[i].image.depth=n,this.textures[i].isData3DTexture!==!0&&(this.textures[i].isArrayTexture=this.textures[i].image.depth>1);this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;let i=Object.assign({},t.textures[e].image);this.textures[e].source=new Hs(i)}if(this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveColorBuffer=t.resolveColorBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,this.storeMultisampledColorBuffer=t.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=t.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=t.storeMultisampledStencilBuffer,t.depthTexture!==null)if(t.depthTexture.renderTarget===t){let e=t.depthTexture.clone();e.renderTarget=null,this.depthTexture=e}else this.depthTexture=t.depthTexture;return this.samples=t.samples,this.multiview=t.multiview,this.useArrayDepthTexture=t.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},Fe=class extends $o{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}},Xr=class extends on{constructor(t=null,e=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=qe,this.minFilter=qe,this.wrapR=Zn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}};var Jo=class extends on{constructor(t=null,e=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=qe,this.minFilter=qe,this.wrapR=Zn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}};var vl=class vl{constructor(t,e,n,i,r,a,o,c,l,h,d,u,f,p,_,m){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,i,r,a,o,c,l,h,d,u,f,p,_,m)}set(t,e,n,i,r,a,o,c,l,h,d,u,f,p,_,m){let g=this.elements;return g[0]=t,g[4]=e,g[8]=n,g[12]=i,g[1]=r,g[5]=a,g[9]=o,g[13]=c,g[2]=l,g[6]=h,g[10]=d,g[14]=u,g[3]=f,g[7]=p,g[11]=_,g[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new vl().fromArray(this.elements)}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){let e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return this.determinantAffine()===0?(t.set(1,0,0),e.set(0,1,0),n.set(0,0,1),this):(t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){if(t.determinantAffine()===0)return this.identity();let e=this.elements,n=t.elements,i=1/ys.setFromMatrixColumn(t,0).length(),r=1/ys.setFromMatrixColumn(t,1).length(),a=1/ys.setFromMatrixColumn(t,2).length();return e[0]=n[0]*i,e[1]=n[1]*i,e[2]=n[2]*i,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,n=t.x,i=t.y,r=t.z,a=Math.cos(n),o=Math.sin(n),c=Math.cos(i),l=Math.sin(i),h=Math.cos(r),d=Math.sin(r);if(t.order==="XYZ"){let u=a*h,f=a*d,p=o*h,_=o*d;e[0]=c*h,e[4]=-c*d,e[8]=l,e[1]=f+p*l,e[5]=u-_*l,e[9]=-o*c,e[2]=_-u*l,e[6]=p+f*l,e[10]=a*c}else if(t.order==="YXZ"){let u=c*h,f=c*d,p=l*h,_=l*d;e[0]=u+_*o,e[4]=p*o-f,e[8]=a*l,e[1]=a*d,e[5]=a*h,e[9]=-o,e[2]=f*o-p,e[6]=_+u*o,e[10]=a*c}else if(t.order==="ZXY"){let u=c*h,f=c*d,p=l*h,_=l*d;e[0]=u-_*o,e[4]=-a*d,e[8]=p+f*o,e[1]=f+p*o,e[5]=a*h,e[9]=_-u*o,e[2]=-a*l,e[6]=o,e[10]=a*c}else if(t.order==="ZYX"){let u=a*h,f=a*d,p=o*h,_=o*d;e[0]=c*h,e[4]=p*l-f,e[8]=u*l+_,e[1]=c*d,e[5]=_*l+u,e[9]=f*l-p,e[2]=-l,e[6]=o*c,e[10]=a*c}else if(t.order==="YZX"){let u=a*c,f=a*l,p=o*c,_=o*l;e[0]=c*h,e[4]=_-u*d,e[8]=p*d+f,e[1]=d,e[5]=a*h,e[9]=-o*h,e[2]=-l*h,e[6]=f*d+p,e[10]=u-_*d}else if(t.order==="XZY"){let u=a*c,f=a*l,p=o*c,_=o*l;e[0]=c*h,e[4]=-d,e[8]=l*h,e[1]=u*d+_,e[5]=a*h,e[9]=f*d-p,e[2]=p*d-f,e[6]=o*h,e[10]=_*d+u}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Am,t,Rm)}lookAt(t,e,n){let i=this.elements;return xn.subVectors(t,e),xn.lengthSq()===0&&(xn.z=1),xn.normalize(),bi.crossVectors(n,xn),bi.lengthSq()===0&&(Math.abs(n.z)===1?xn.x+=1e-4:xn.z+=1e-4,xn.normalize(),bi.crossVectors(n,xn)),bi.normalize(),lo.crossVectors(xn,bi),i[0]=bi.x,i[4]=lo.x,i[8]=xn.x,i[1]=bi.y,i[5]=lo.y,i[9]=xn.y,i[2]=bi.z,i[6]=lo.z,i[10]=xn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,i=e.elements,r=this.elements,a=n[0],o=n[4],c=n[8],l=n[12],h=n[1],d=n[5],u=n[9],f=n[13],p=n[2],_=n[6],m=n[10],g=n[14],M=n[3],w=n[7],y=n[11],T=n[15],b=i[0],P=i[4],v=i[8],A=i[12],I=i[1],N=i[5],O=i[9],L=i[13],C=i[2],F=i[6],k=i[10],V=i[14],j=i[3],q=i[7],Z=i[11],K=i[15];return r[0]=a*b+o*I+c*C+l*j,r[4]=a*P+o*N+c*F+l*q,r[8]=a*v+o*O+c*k+l*Z,r[12]=a*A+o*L+c*V+l*K,r[1]=h*b+d*I+u*C+f*j,r[5]=h*P+d*N+u*F+f*q,r[9]=h*v+d*O+u*k+f*Z,r[13]=h*A+d*L+u*V+f*K,r[2]=p*b+_*I+m*C+g*j,r[6]=p*P+_*N+m*F+g*q,r[10]=p*v+_*O+m*k+g*Z,r[14]=p*A+_*L+m*V+g*K,r[3]=M*b+w*I+y*C+T*j,r[7]=M*P+w*N+y*F+T*q,r[11]=M*v+w*O+y*k+T*Z,r[15]=M*A+w*L+y*V+T*K,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[4],i=t[8],r=t[12],a=t[1],o=t[5],c=t[9],l=t[13],h=t[2],d=t[6],u=t[10],f=t[14],p=t[3],_=t[7],m=t[11],g=t[15],M=c*f-l*u,w=o*f-l*d,y=o*u-c*d,T=a*f-l*h,b=a*u-c*h,P=a*d-o*h;return e*(_*M-m*w+g*y)-n*(p*M-m*T+g*b)+i*(p*w-_*T+g*P)-r*(p*y-_*b+m*P)}determinantAffine(){let t=this.elements,e=t[0],n=t[4],i=t[8],r=t[1],a=t[5],o=t[9],c=t[2],l=t[6],h=t[10];return e*(a*h-o*l)-n*(r*h-o*c)+i*(r*l-a*c)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){let i=this.elements;return t.isVector3?(i[12]=t.x,i[13]=t.y,i[14]=t.z):(i[12]=t,i[13]=e,i[14]=n),this}invert(){let t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],a=t[4],o=t[5],c=t[6],l=t[7],h=t[8],d=t[9],u=t[10],f=t[11],p=t[12],_=t[13],m=t[14],g=t[15],M=e*o-n*a,w=e*c-i*a,y=e*l-r*a,T=n*c-i*o,b=n*l-r*o,P=i*l-r*c,v=h*_-d*p,A=h*m-u*p,I=h*g-f*p,N=d*m-u*_,O=d*g-f*_,L=u*g-f*m,C=M*L-w*O+y*N+T*I-b*A+P*v;if(C===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let F=1/C;return t[0]=(o*L-c*O+l*N)*F,t[1]=(i*O-n*L-r*N)*F,t[2]=(_*P-m*b+g*T)*F,t[3]=(u*b-d*P-f*T)*F,t[4]=(c*I-a*L-l*A)*F,t[5]=(e*L-i*I+r*A)*F,t[6]=(m*y-p*P-g*w)*F,t[7]=(h*P-u*y+f*w)*F,t[8]=(a*O-o*I+l*v)*F,t[9]=(n*I-e*O-r*v)*F,t[10]=(p*b-_*y+g*M)*F,t[11]=(d*y-h*b-f*M)*F,t[12]=(o*A-a*N-c*v)*F,t[13]=(e*N-n*A+i*v)*F,t[14]=(_*w-p*T-m*M)*F,t[15]=(h*T-d*w+u*M)*F,this}scale(t){let e=this.elements,n=t.x,i=t.y,r=t.z;return e[0]*=n,e[4]*=i,e[8]*=r,e[1]*=n,e[5]*=i,e[9]*=r,e[2]*=n,e[6]*=i,e[10]*=r,e[3]*=n,e[7]*=i,e[11]*=r,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],i=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,i))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let n=Math.cos(e),i=Math.sin(e),r=1-n,a=t.x,o=t.y,c=t.z,l=r*a,h=r*o;return this.set(l*a+n,l*o-i*c,l*c+i*o,0,l*o+i*c,h*o+n,h*c-i*a,0,l*c-i*o,h*c+i*a,r*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,i,r,a){return this.set(1,n,r,0,t,1,a,0,e,i,1,0,0,0,0,1),this}compose(t,e,n){let i=this.elements,r=e._x,a=e._y,o=e._z,c=e._w,l=r+r,h=a+a,d=o+o,u=r*l,f=r*h,p=r*d,_=a*h,m=a*d,g=o*d,M=c*l,w=c*h,y=c*d,T=n.x,b=n.y,P=n.z;return i[0]=(1-(_+g))*T,i[1]=(f+y)*T,i[2]=(p-w)*T,i[3]=0,i[4]=(f-y)*b,i[5]=(1-(u+g))*b,i[6]=(m+M)*b,i[7]=0,i[8]=(p+w)*P,i[9]=(m-M)*P,i[10]=(1-(u+_))*P,i[11]=0,i[12]=t.x,i[13]=t.y,i[14]=t.z,i[15]=1,this}decompose(t,e,n){let i=this.elements;t.x=i[12],t.y=i[13],t.z=i[14];let r=this.determinantAffine();if(r===0)return n.set(1,1,1),e.identity(),this;let a=ys.set(i[0],i[1],i[2]).length(),o=ys.set(i[4],i[5],i[6]).length(),c=ys.set(i[8],i[9],i[10]).length();r<0&&(a=-a),Nn.copy(this);let l=1/a,h=1/o,d=1/c;return Nn.elements[0]*=l,Nn.elements[1]*=l,Nn.elements[2]*=l,Nn.elements[4]*=h,Nn.elements[5]*=h,Nn.elements[6]*=h,Nn.elements[8]*=d,Nn.elements[9]*=d,Nn.elements[10]*=d,e.setFromRotationMatrix(Nn),n.x=a,n.y=o,n.z=c,this}makePerspective(t,e,n,i,r,a,o=zn,c=!1){let l=this.elements,h=2*r/(e-t),d=2*r/(n-i),u=(e+t)/(e-t),f=(n+i)/(n-i),p,_;if(c)p=r/(a-r),_=a*r/(a-r);else if(o===zn)p=-(a+r)/(a-r),_=-2*a*r/(a-r);else if(o===zs)p=-a/(a-r),_=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=h,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=d,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=p,l[14]=_,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,i,r,a,o=zn,c=!1){let l=this.elements,h=2/(e-t),d=2/(n-i),u=-(e+t)/(e-t),f=-(n+i)/(n-i),p,_;if(c)p=1/(a-r),_=a/(a-r);else if(o===zn)p=-2/(a-r),_=-(a+r)/(a-r);else if(o===zs)p=-1/(a-r),_=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=h,l[4]=0,l[8]=0,l[12]=u,l[1]=0,l[5]=d,l[9]=0,l[13]=f,l[2]=0,l[6]=0,l[10]=p,l[14]=_,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){let e=this.elements,n=t.elements;for(let i=0;i<16;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}};vl.prototype.isMatrix4=!0;var ce=vl,ys=new E,Nn=new ce,Am=new E(0,0,0),Rm=new E(1,1,1),bi=new E,lo=new E,xn=new E,ju=new ce,td=new ae,ei=class s{constructor(t=0,e=0,n=0,i=s.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=i}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,i=this._order){return this._x=t,this._y=e,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){let i=t.elements,r=i[0],a=i[4],o=i[8],c=i[1],l=i[5],h=i[9],d=i[2],u=i[6],f=i[10];switch(e){case"XYZ":this._y=Math.asin(Kt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(u,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Kt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(Kt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-d,f),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-Kt(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(u,f),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(Kt(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-Kt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(u,l),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:kt("Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return ju.makeRotationFromQuaternion(t),this.setFromRotationMatrix(ju,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return td.setFromEuler(this),this.setFromQuaternion(td,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};ei.DEFAULT_ORDER="XYZ";var qr=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},Cm=0,ed=new E,Ms=new ae,ci=new ce,co=new E,Er=new E,Pm=new E,Im=new ae,nd=new E(1,0,0),id=new E(0,1,0),sd=new E(0,0,1),rd={type:"added"},Lm={type:"removed"},Ss={type:"childadded",child:null},jc={type:"childremoved",child:null},Be=class s extends ti{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Cm++}),this.uuid=Qn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=s.DEFAULT_UP.clone();let t=new E,e=new ei,n=new ae,i=new E(1,1,1);function r(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new ce},normalMatrix:{value:new Wt}}),this.matrix=new ce,this.matrixWorld=new ce,this.matrixAutoUpdate=s.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=s.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new qr,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Ms.setFromAxisAngle(t,e),this.quaternion.multiply(Ms),this}rotateOnWorldAxis(t,e){return Ms.setFromAxisAngle(t,e),this.quaternion.premultiply(Ms),this}rotateX(t){return this.rotateOnAxis(nd,t)}rotateY(t){return this.rotateOnAxis(id,t)}rotateZ(t){return this.rotateOnAxis(sd,t)}translateOnAxis(t,e){return ed.copy(t).applyQuaternion(this.quaternion),this.position.add(ed.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(nd,t)}translateY(t){return this.translateOnAxis(id,t)}translateZ(t){return this.translateOnAxis(sd,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(ci.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?co.copy(t):co.set(t,e,n);let i=this.parent;this.updateWorldMatrix(!0,!1),Er.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ci.lookAt(Er,co,this.up):ci.lookAt(co,Er,this.up),this.quaternion.setFromRotationMatrix(ci),i&&(ci.extractRotation(i.matrixWorld),Ms.setFromRotationMatrix(ci),this.quaternion.premultiply(Ms.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(Ht("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(rd),Ss.child=t,this.dispatchEvent(Ss),Ss.child=null):Ht("Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Lm),jc.child=t,this.dispatchEvent(jc),jc.child=null),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),ci.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),ci.multiply(t.parent.matrixWorld)),t.applyMatrix4(ci),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(rd),Ss.child=t,this.dispatchEvent(Ss),Ss.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,i=this.children.length;n<i;n++){let a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);let i=this.children;for(let r=0,a=i.length;r<a;r++)i[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Er,t,Pm),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Er,Im,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(t){t(this);let e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let t=this.pivot;if(t!==null){let e=t.x,n=t.y,i=t.z,r=this.matrix.elements;r[12]+=e-r[0]*e-r[4]*n-r[8]*i,r[13]+=n-r[1]*e-r[5]*n-r[9]*i,r[14]+=i-r[2]*e-r[6]*n-r[10]*i}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e,n=!1){let i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),e===!0){let r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0,n)}}toJSON(t){let e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let i={};i.uuid=this.uuid,i.type=this.type,i.name=this.name,i.castShadow=this.castShadow,i.receiveShadow=this.receiveShadow,i.visible=this.visible,i.frustumCulled=this.frustumCulled,i.renderOrder=this.renderOrder,i.static=this.static,i.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.pivot!==null&&(i.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(i.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(i.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),i.instanceInfo=this._instanceInfo.map(o=>({...o})),i.availableInstanceIds=this._availableInstanceIds.slice(),i.availableGeometryIds=this._availableGeometryIds.slice(),i.nextIndexStart=this._nextIndexStart,i.nextVertexStart=this._nextVertexStart,i.geometryCount=this._geometryCount,i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.matricesTexture=this._matricesTexture.toJSON(t),i.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(i.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(i.boundingBox=this.boundingBox.toJSON()));function r(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(t.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let c=o.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){let d=c[l];r(t.shapes,d)}else r(t.shapes,c)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(r(t.materials,this.material[c]));i.material=o}else i.material=r(t.materials,this.material);if(this.children.length>0){i.children=[];for(let o=0;o<this.children.length;o++)i.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){i.animations=[];for(let o=0;o<this.animations.length;o++){let c=this.animations[o];i.animations.push(r(t.animations,c))}}if(e){let o=a(t.geometries),c=a(t.materials),l=a(t.textures),h=a(t.images),d=a(t.shapes),u=a(t.skeletons),f=a(t.animations),p=a(t.nodes);o.length>0&&(n.geometries=o),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),d.length>0&&(n.shapes=d),u.length>0&&(n.skeletons=u),f.length>0&&(n.animations=f),p.length>0&&(n.nodes=p)}return n.object=i,n;function a(o){let c=[];for(let l in o){let h=o[l];delete h.metadata,c.push(h)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.pivot=t.pivot!==null?t.pivot.clone():null,this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.static=t.static,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){let i=t.children[n];this.add(i.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};Be.DEFAULT_UP=new E(0,1,0);Be.DEFAULT_MATRIX_AUTO_UPDATE=!0;Be.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Le=class extends Be{constructor(){super(),this.isGroup=!0,this.type="Group"}},Dm={type:"move"},Gs=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Le,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Le,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new E,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new E),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Le,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new E,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new E,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let i=null,r=null,a=null,o=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){a=!0;for(let _ of t.hand.values()){let m=e.getJointPose(_,n),g=this._getHandJoint(l,_);m!==null&&(g.matrix.fromArray(m.transform.matrix),g.matrix.decompose(g.position,g.rotation,g.scale),g.matrixWorldNeedsUpdate=!0,g.jointRadius=m.radius),g.visible=m!==null}let h=l.joints["index-finger-tip"],d=l.joints["thumb-tip"],u=h.position.distanceTo(d.position),f=.02,p=.005;l.inputState.pinching&&u>f+p?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&u<=f-p&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1,c.eventsEnabled&&c.dispatchEvent({type:"gripUpdated",data:t,target:this})));o!==null&&(i=e.getPose(t.targetRaySpace,n),i===null&&r!==null&&(i=r),i!==null&&(o.matrix.fromArray(i.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,i.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(i.linearVelocity)):o.hasLinearVelocity=!1,i.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(i.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Dm)))}return o!==null&&(o.visible=i!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let n=new Le;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}},df={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Ti={h:0,s:0,l:0},ho={h:0,s:0,l:0};function th(s,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?s+(t-s)*6*e:e<1/2?t:e<2/3?s+(t-s)*6*(2/3-e):s}var ht=class{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){let i=t;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=We){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Qt.colorSpaceToWorking(this,e),this}setRGB(t,e,n,i=Qt.workingColorSpace){return this.r=t,this.g=e,this.b=n,Qt.colorSpaceToWorking(this,i),this}setHSL(t,e,n,i=Qt.workingColorSpace){if(t=Yh(t,1),e=Kt(e,0,1),n=Kt(n,0,1),e===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+e):n+e-n*e,a=2*n-r;this.r=th(a,r,t+1/3),this.g=th(a,r,t),this.b=th(a,r,t-1/3)}return Qt.colorSpaceToWorking(this,i),this}setStyle(t,e=We){function n(r){r!==void 0&&parseFloat(r)<1&&kt("Color: Alpha component of "+t+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(t)){let r,a=i[1],o=i[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:kt("Color: Unknown color model "+t)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(t)){let r=i[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(r,16),e);kt("Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=We){let n=df[t.toLowerCase()];return n!==void 0?this.setHex(n,e):kt("Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=mi(t.r),this.g=mi(t.g),this.b=mi(t.b),this}copyLinearToSRGB(t){return this.r=Bs(t.r),this.g=Bs(t.g),this.b=Bs(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=We){return Qt.workingToColorSpace(en.copy(this),t),Math.round(Kt(en.r*255,0,255))*65536+Math.round(Kt(en.g*255,0,255))*256+Math.round(Kt(en.b*255,0,255))}getHexString(t=We){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Qt.workingColorSpace){Qt.workingToColorSpace(en.copy(this),e);let n=en.r,i=en.g,r=en.b,a=Math.max(n,i,r),o=Math.min(n,i,r),c,l,h=(o+a)/2;if(o===a)c=0,l=0;else{let d=a-o;switch(l=h<=.5?d/(a+o):d/(2-a-o),a){case n:c=(i-r)/d+(i<r?6:0);break;case i:c=(r-n)/d+2;break;case r:c=(n-i)/d+4;break}c/=6}return t.h=c,t.s=l,t.l=h,t}getRGB(t,e=Qt.workingColorSpace){return Qt.workingToColorSpace(en.copy(this),e),t.r=en.r,t.g=en.g,t.b=en.b,t}getStyle(t=We){Qt.workingToColorSpace(en.copy(this),t);let e=en.r,n=en.g,i=en.b;return t!==We?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(t,e,n){return this.getHSL(Ti),this.setHSL(Ti.h+t,Ti.s+e,Ti.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Ti),t.getHSL(ho);let n=Br(Ti.h,ho.h,e),i=Br(Ti.s,ho.s,e),r=Br(Ti.l,ho.l,e);return this.setHSL(n,i,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,n=this.g,i=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*i,this.g=r[1]*e+r[4]*n+r[7]*i,this.b=r[2]*e+r[5]*n+r[8]*i,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},en=new ht;ht.NAMES=df;var Yr=class s{constructor(t,e=1,n=1e3){this.isFog=!0,this.name="",this.color=new ht(t),this.near=e,this.far=n}clone(){return new s(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},Ki=class extends Be{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new ei,this.environmentIntensity=1,this.environmentRotation=new ei,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),e.object.backgroundBlurriness=this.backgroundBlurriness,e.object.backgroundIntensity=this.backgroundIntensity,e.object.backgroundRotation=this.backgroundRotation.toArray(),e.object.environmentIntensity=this.environmentIntensity,e.object.environmentRotation=this.environmentRotation.toArray(),e}},Un=new E,hi=new E,eh=new E,ui=new E,bs=new E,Ts=new E,ad=new E,nh=new E,ih=new E,sh=new E,rh=new Ae,ah=new Ae,oh=new Ae,pi=class s{constructor(t=new E,e=new E,n=new E){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,i){i.subVectors(n,e),Un.subVectors(t,e),i.cross(Un);let r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(t,e,n,i,r){Un.subVectors(i,e),hi.subVectors(n,e),eh.subVectors(t,e);let a=Un.dot(Un),o=Un.dot(hi),c=Un.dot(eh),l=hi.dot(hi),h=hi.dot(eh),d=a*l-o*o;if(d===0)return r.set(0,0,0),null;let u=1/d,f=(l*c-o*h)*u,p=(a*h-o*c)*u;return r.set(1-f-p,p,f)}static containsPoint(t,e,n,i){return this.getBarycoord(t,e,n,i,ui)===null?!1:ui.x>=0&&ui.y>=0&&ui.x+ui.y<=1}static getInterpolation(t,e,n,i,r,a,o,c){return this.getBarycoord(t,e,n,i,ui)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,ui.x),c.addScaledVector(a,ui.y),c.addScaledVector(o,ui.z),c)}static getInterpolatedAttribute(t,e,n,i,r,a){return rh.setScalar(0),ah.setScalar(0),oh.setScalar(0),rh.fromBufferAttribute(t,e),ah.fromBufferAttribute(t,n),oh.fromBufferAttribute(t,i),a.setScalar(0),a.addScaledVector(rh,r.x),a.addScaledVector(ah,r.y),a.addScaledVector(oh,r.z),a}static isFrontFacing(t,e,n,i){return Un.subVectors(n,e),hi.subVectors(t,e),Un.cross(hi).dot(i)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,i){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[i]),this}setFromAttributeAndIndices(t,e,n,i){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,i),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Un.subVectors(this.c,this.b),hi.subVectors(this.a,this.b),Un.cross(hi).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return s.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return s.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,i,r){return s.getInterpolation(t,this.a,this.b,this.c,e,n,i,r)}containsPoint(t){return s.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return s.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let n=this.a,i=this.b,r=this.c,a,o;bs.subVectors(i,n),Ts.subVectors(r,n),nh.subVectors(t,n);let c=bs.dot(nh),l=Ts.dot(nh);if(c<=0&&l<=0)return e.copy(n);ih.subVectors(t,i);let h=bs.dot(ih),d=Ts.dot(ih);if(h>=0&&d<=h)return e.copy(i);let u=c*d-h*l;if(u<=0&&c>=0&&h<=0)return a=c/(c-h),e.copy(n).addScaledVector(bs,a);sh.subVectors(t,r);let f=bs.dot(sh),p=Ts.dot(sh);if(p>=0&&f<=p)return e.copy(r);let _=f*l-c*p;if(_<=0&&l>=0&&p<=0)return o=l/(l-p),e.copy(n).addScaledVector(Ts,o);let m=h*p-f*d;if(m<=0&&d-h>=0&&f-p>=0)return ad.subVectors(r,i),o=(d-h)/(d-h+(f-p)),e.copy(i).addScaledVector(ad,o);let g=1/(m+_+u);return a=_*g,o=u*g,e.copy(n).addScaledVector(bs,a).addScaledVector(Ts,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},ni=class{constructor(t=new E(1/0,1/0,1/0),e=new E(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(Fn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(Fn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let n=Fn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);let n=t.geometry;if(n!==void 0){let r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,Fn):Fn.fromBufferAttribute(r,a),Fn.applyMatrix4(t.matrixWorld),this.expandByPoint(Fn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),uo.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),uo.copy(n.boundingBox)),uo.applyMatrix4(t.matrixWorld),this.union(uo)}let i=t.children;for(let r=0,a=i.length;r<a;r++)this.expandByObject(i[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Fn),Fn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Ar),fo.subVectors(this.max,Ar),ws.subVectors(t.a,Ar),Es.subVectors(t.b,Ar),As.subVectors(t.c,Ar),wi.subVectors(Es,ws),Ei.subVectors(As,Es),qi.subVectors(ws,As);let e=[0,-wi.z,wi.y,0,-Ei.z,Ei.y,0,-qi.z,qi.y,wi.z,0,-wi.x,Ei.z,0,-Ei.x,qi.z,0,-qi.x,-wi.y,wi.x,0,-Ei.y,Ei.x,0,-qi.y,qi.x,0];return!lh(e,ws,Es,As,fo)||(e=[1,0,0,0,1,0,0,0,1],!lh(e,ws,Es,As,fo))?!1:(po.crossVectors(wi,Ei),e=[po.x,po.y,po.z],lh(e,ws,Es,As,fo))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Fn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Fn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(di[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),di[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),di[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),di[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),di[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),di[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),di[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),di[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(di),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}},di=[new E,new E,new E,new E,new E,new E,new E,new E],Fn=new E,uo=new ni,ws=new E,Es=new E,As=new E,wi=new E,Ei=new E,qi=new E,Ar=new E,fo=new E,po=new E,Yi=new E;function lh(s,t,e,n,i){for(let r=0,a=s.length-3;r<=a;r+=3){Yi.fromArray(s,r);let o=i.x*Math.abs(Yi.x)+i.y*Math.abs(Yi.y)+i.z*Math.abs(Yi.z),c=t.dot(Yi),l=e.dot(Yi),h=n.dot(Yi);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>o)return!1}return!0}var Ue=new E,mo=new it,Nm=0,De=class extends ti{constructor(t,e,n=!1){if(super(),Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Nm++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Xh,this.updateRanges=[],this.gpuType=Rn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[t+i]=e.array[n+i];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)mo.fromBufferAttribute(this,e),mo.applyMatrix3(t),this.setXY(e,mo.x,mo.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Ue.fromBufferAttribute(this,e),Ue.applyMatrix3(t),this.setXYZ(e,Ue.x,Ue.y,Ue.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Ue.fromBufferAttribute(this,e),Ue.applyMatrix4(t),this.setXYZ(e,Ue.x,Ue.y,Ue.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Ue.fromBufferAttribute(this,e),Ue.applyNormalMatrix(t),this.setXYZ(e,Ue.x,Ue.y,Ue.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Ue.fromBufferAttribute(this,e),Ue.transformDirection(t),this.setXYZ(e,Ue.x,Ue.y,Ue.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=On(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=fe(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=On(e,this.array)),e}setX(t,e){return this.normalized&&(e=fe(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=On(e,this.array)),e}setY(t,e){return this.normalized&&(e=fe(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=On(e,this.array)),e}setZ(t,e){return this.normalized&&(e=fe(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=On(e,this.array)),e}setW(t,e){return this.normalized&&(e=fe(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=fe(e,this.array),n=fe(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,i){return t*=this.itemSize,this.normalized&&(e=fe(e,this.array),n=fe(n,this.array),i=fe(i,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this}setXYZW(t,e,n,i,r){return t*=this.itemSize,this.normalized&&(e=fe(e,this.array),n=fe(n,this.array),i=fe(i,this.array),r=fe(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return t.name=this.name,t.usage=this.usage,t.gpuType=this.gpuType,t}dispose(){this.dispatchEvent({type:"dispose"})}};var $r=class extends De{constructor(t,e,n){super(new Uint16Array(t),e,n)}};var Jr=class extends De{constructor(t,e,n){super(new Uint32Array(t),e,n)}};var Jt=class extends De{constructor(t,e,n){super(new Float32Array(t),e,n)}},Um=new ni,Rr=new E,ch=new E,kn=class{constructor(t=new E,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let n=this.center;e!==void 0?n.copy(e):Um.setFromPoints(t).getCenter(n);let i=0;for(let r=0,a=t.length;r<a;r++)i=Math.max(i,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(i),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Rr.subVectors(t,this.center);let e=Rr.lengthSq();if(e>this.radius*this.radius){let n=Math.sqrt(e),i=(n-this.radius)*.5;this.center.addScaledVector(Rr,i/n),this.radius+=i}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(ch.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Rr.copy(t.center).add(ch)),this.expandByPoint(Rr.copy(t.center).sub(ch))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}},Fm=0,En=new ce,hh=new Be,Rs=new E,_n=new ni,Cr=new ni,Ge=new E,_e=class s extends ti{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Fm++}),this.uuid=Qn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(am(t)?Jr:$r)(t,1):this.index=t,this}setIndirect(t,e=0){return this.indirect=t,this.indirectOffset=e,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new Wt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}let i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(t),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(t){return En.makeRotationFromQuaternion(t),this.applyMatrix4(En),this}rotateX(t){return En.makeRotationX(t),this.applyMatrix4(En),this}rotateY(t){return En.makeRotationY(t),this.applyMatrix4(En),this}rotateZ(t){return En.makeRotationZ(t),this.applyMatrix4(En),this}translate(t,e,n){return En.makeTranslation(t,e,n),this.applyMatrix4(En),this}scale(t,e,n){return En.makeScale(t,e,n),this.applyMatrix4(En),this}lookAt(t){return hh.lookAt(t),hh.updateMatrix(),this.applyMatrix4(hh.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Rs).negate(),this.translate(Rs.x,Rs.y,Rs.z),this}setFromPoints(t){let e=this.getAttribute("position");if(e===void 0){let n=[];for(let i=0,r=t.length;i<r;i++){let a=t[i];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new Jt(n,3))}else{let n=Math.min(t.length,e.count);for(let i=0;i<n;i++){let r=t[i];e.setXYZ(i,r.x,r.y,r.z||0)}t.length>e.count&&kt("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ni);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Ht("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new E(-1/0,-1/0,-1/0),new E(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,i=e.length;n<i;n++){let r=e[n];_n.setFromBufferAttribute(r),this.morphTargetsRelative?(Ge.addVectors(this.boundingBox.min,_n.min),this.boundingBox.expandByPoint(Ge),Ge.addVectors(this.boundingBox.max,_n.max),this.boundingBox.expandByPoint(Ge)):(this.boundingBox.expandByPoint(_n.min),this.boundingBox.expandByPoint(_n.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Ht('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new kn);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Ht("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new E,1/0);return}if(t){let n=this.boundingSphere.center;if(_n.setFromBufferAttribute(t),e)for(let r=0,a=e.length;r<a;r++){let o=e[r];Cr.setFromBufferAttribute(o),this.morphTargetsRelative?(Ge.addVectors(_n.min,Cr.min),_n.expandByPoint(Ge),Ge.addVectors(_n.max,Cr.max),_n.expandByPoint(Ge)):(_n.expandByPoint(Cr.min),_n.expandByPoint(Cr.max))}_n.getCenter(n);let i=0;for(let r=0,a=t.count;r<a;r++)Ge.fromBufferAttribute(t,r),i=Math.max(i,n.distanceToSquared(Ge));if(e)for(let r=0,a=e.length;r<a;r++){let o=e[r],c=this.morphTargetsRelative;for(let l=0,h=o.count;l<h;l++)Ge.fromBufferAttribute(o,l),c&&(Rs.fromBufferAttribute(t,l),Ge.add(Rs)),i=Math.max(i,n.distanceToSquared(Ge))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&Ht('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){Ht("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=e.position,i=e.normal,r=e.uv,a=this.getAttribute("tangent");(a===void 0||a.count!==n.count)&&(a=new De(new Float32Array(4*n.count),4),this.setAttribute("tangent",a));let o=[],c=[];for(let v=0;v<n.count;v++)o[v]=new E,c[v]=new E;let l=new E,h=new E,d=new E,u=new it,f=new it,p=new it,_=new E,m=new E;function g(v,A,I){l.fromBufferAttribute(n,v),h.fromBufferAttribute(n,A),d.fromBufferAttribute(n,I),u.fromBufferAttribute(r,v),f.fromBufferAttribute(r,A),p.fromBufferAttribute(r,I),h.sub(l),d.sub(l),f.sub(u),p.sub(u);let N=1/(f.x*p.y-p.x*f.y);isFinite(N)&&(_.copy(h).multiplyScalar(p.y).addScaledVector(d,-f.y).multiplyScalar(N),m.copy(d).multiplyScalar(f.x).addScaledVector(h,-p.x).multiplyScalar(N),o[v].add(_),o[A].add(_),o[I].add(_),c[v].add(m),c[A].add(m),c[I].add(m))}let M=this.groups;M.length===0&&(M=[{start:0,count:t.count}]);for(let v=0,A=M.length;v<A;++v){let I=M[v],N=I.start,O=I.count;for(let L=N,C=N+O;L<C;L+=3)g(t.getX(L+0),t.getX(L+1),t.getX(L+2))}let w=new E,y=new E,T=new E,b=new E;function P(v){T.fromBufferAttribute(i,v),b.copy(T);let A=o[v];w.copy(A),w.sub(T.multiplyScalar(T.dot(A))).normalize(),y.crossVectors(b,A);let N=y.dot(c[v])<0?-1:1;a.setXYZW(v,w.x,w.y,w.z,N)}for(let v=0,A=M.length;v<A;++v){let I=M[v],N=I.start,O=I.count;for(let L=N,C=N+O;L<C;L+=3)P(t.getX(L+0)),P(t.getX(L+1)),P(t.getX(L+2))}this._transformed=!0}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==e.count)n=new De(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let u=0,f=n.count;u<f;u++)n.setXYZ(u,0,0,0);let i=new E,r=new E,a=new E,o=new E,c=new E,l=new E,h=new E,d=new E;if(t)for(let u=0,f=t.count;u<f;u+=3){let p=t.getX(u+0),_=t.getX(u+1),m=t.getX(u+2);i.fromBufferAttribute(e,p),r.fromBufferAttribute(e,_),a.fromBufferAttribute(e,m),h.subVectors(a,r),d.subVectors(i,r),h.cross(d),o.fromBufferAttribute(n,p),c.fromBufferAttribute(n,_),l.fromBufferAttribute(n,m),o.add(h),c.add(h),l.add(h),n.setXYZ(p,o.x,o.y,o.z),n.setXYZ(_,c.x,c.y,c.z),n.setXYZ(m,l.x,l.y,l.z)}else for(let u=0,f=e.count;u<f;u+=3)i.fromBufferAttribute(e,u+0),r.fromBufferAttribute(e,u+1),a.fromBufferAttribute(e,u+2),h.subVectors(a,r),d.subVectors(i,r),h.cross(d),n.setXYZ(u+0,h.x,h.y,h.z),n.setXYZ(u+1,h.x,h.y,h.z),n.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Ge.fromBufferAttribute(t,e),Ge.normalize(),t.setXYZ(e,Ge.x,Ge.y,Ge.z)}toNonIndexed(){function t(o,c){let l=o.array,h=o.itemSize,d=o.normalized,u=new l.constructor(c.length*h),f=0,p=0;for(let _=0,m=c.length;_<m;_++){o.isInterleavedBufferAttribute?f=c[_]*o.data.stride+o.offset:f=c[_]*h;for(let g=0;g<h;g++)u[p++]=l[f++]}return new De(u,h,d)}if(this.index===null)return kt("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new s,n=this.index.array,i=this.attributes;for(let o in i){let c=i[o],l=t(c,n);e.setAttribute(o,l)}let r=this.morphAttributes;for(let o in r){let c=[],l=r[o];for(let h=0,d=l.length;h<d;h++){let u=l[h],f=t(u,n);c.push(f)}e.morphAttributes[o]=c}e.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,c=a.length;o<c;o++){let l=a[o];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){let t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,t.name=this.name,Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let c=this.parameters;for(let l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let n=this.attributes;for(let c in n){let l=n[c];t.data.attributes[c]=l.toJSON(t.data)}let i={},r=!1;for(let c in this.morphAttributes){let l=this.morphAttributes[c],h=[];for(let d=0,u=l.length;d<u;d++){let f=l[d];h.push(f.toJSON(t.data))}h.length>0&&(i[c]=h,r=!0)}r&&(t.data.morphAttributes=i,t.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(t.data.boundingSphere=o.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let n=t.index;n!==null&&this.setIndex(n.clone());let i=t.attributes;for(let l in i){let h=i[l];this.setAttribute(l,h.clone(e))}let r=t.morphAttributes;for(let l in r){let h=[],d=r[l];for(let u=0,f=d.length;u<f;u++)h.push(d[u].clone(e));this.morphAttributes[l]=h}this.morphTargetsRelative=t.morphTargetsRelative;let a=t.groups;for(let l=0,h=a.length;l<h;l++){let d=a[l];this.addGroup(d.start,d.count,d.materialIndex)}let o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());let c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this._transformed=t._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}},Zo=class{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=Xh,this.updateRanges=[],this.version=0,this.uuid=Qn()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let i=0,r=this.stride;i<r;i++)this.array[t+i]=e.array[n+i];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Qn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(e,this.stride);return n.setUsage(this.usage),n}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Qn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer)));let e={uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride};return e.usage=this.usage,e}},an=new E,Zr=class s{constructor(t,e,n,i=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=i}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)an.fromBufferAttribute(this,e),an.applyMatrix4(t),this.setXYZ(e,an.x,an.y,an.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)an.fromBufferAttribute(this,e),an.applyNormalMatrix(t),this.setXYZ(e,an.x,an.y,an.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)an.fromBufferAttribute(this,e),an.transformDirection(t),this.setXYZ(e,an.x,an.y,an.z);return this}getComponent(t,e){let n=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(n=On(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=fe(n,this.array)),this.data.array[t*this.data.stride+this.offset+e]=n,this}setX(t,e){return this.normalized&&(e=fe(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=fe(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=fe(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=fe(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=On(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=On(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=On(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=On(e,this.array)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=fe(e,this.array),n=fe(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,i){return t=t*this.data.stride+this.offset,this.normalized&&(e=fe(e,this.array),n=fe(n,this.array),i=fe(i,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=i,this}setXYZW(t,e,n,i,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=fe(e,this.array),n=fe(n,this.array),i=fe(i,this.array),r=fe(r,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=i,this.data.array[t+3]=r,this}clone(t){if(t===void 0){Wr("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let e=[];for(let n=0;n<this.count;n++){let i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[i+r])}return new De(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new s(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){Wr("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let e=[];for(let n=0;n<this.count;n++){let i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[i+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},uh=new E,Bm=new E,Om=new Wt,Bn=class{constructor(t=new E(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,i){return this.normal.set(t,e,n),this.constant=i,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){let i=uh.subVectors(n,e).cross(Bm.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(i,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e,n=!0){let i=t.delta(uh),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let a=-(t.start.dot(this.normal)+this.constant)/r;return n===!0&&(a<0||a>1)?null:e.copy(t.start).addScaledVector(i,a)}intersectsLine(t){let e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let n=e||Om.getNormalMatrix(t),i=this.coplanarPoint(uh).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(t){return this.normal.fromArray(t.normal),this.constant=t.constant,this}},zm=0,Vn=class extends ti{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:zm++}),this.uuid=Qn(),this.name="",this.type="Material",this.blending=Ui,this.side=Ni,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Fh,this.blendDst=Bh,this.blendEquation=rs,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ht(0,0,0),this.blendAlpha=0,this.depthFunc=Os,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=tf,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Bo,this.stencilZFail=Bo,this.stencilZPass=Bo,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let n=t[e];if(n===void 0){kt(`Material: parameter '${e}' has value of undefined.`);continue}let i=this[e];if(i===void 0){kt(`Material: '${e}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector2&&n&&n.isVector2||i&&i.isEuler&&n&&n.isEuler||i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(r){let a=[];for(let o in r){let c=r[o];delete c.metadata,a.push(c)}return a}if(e){let r=i(t.textures),a=i(t.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}fromJSON(t,e){if(t.uuid!==void 0&&(this.uuid=t.uuid),t.name!==void 0&&(this.name=t.name),t.color!==void 0&&this.color!==void 0&&this.color.setHex(t.color),t.roughness!==void 0&&(this.roughness=t.roughness),t.metalness!==void 0&&(this.metalness=t.metalness),t.sheen!==void 0&&(this.sheen=t.sheen),t.sheenColor!==void 0&&(this.sheenColor=new ht().setHex(t.sheenColor)),t.sheenRoughness!==void 0&&(this.sheenRoughness=t.sheenRoughness),t.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(t.emissive),t.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(t.specular),t.specularIntensity!==void 0&&(this.specularIntensity=t.specularIntensity),t.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(t.specularColor),t.shininess!==void 0&&(this.shininess=t.shininess),t.clearcoat!==void 0&&(this.clearcoat=t.clearcoat),t.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=t.clearcoatRoughness),t.dispersion!==void 0&&(this.dispersion=t.dispersion),t.retroreflectivity!==void 0&&(this.retroreflectivity=t.retroreflectivity),t.iridescence!==void 0&&(this.iridescence=t.iridescence),t.iridescenceIOR!==void 0&&(this.iridescenceIOR=t.iridescenceIOR),t.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=t.iridescenceThicknessRange),t.transmission!==void 0&&(this.transmission=t.transmission),t.thickness!==void 0&&(this.thickness=t.thickness),t.attenuationDistance!==void 0&&(this.attenuationDistance=t.attenuationDistance),t.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(t.attenuationColor),t.anisotropy!==void 0&&(this.anisotropy=t.anisotropy),t.anisotropyRotation!==void 0&&(this.anisotropyRotation=t.anisotropyRotation),t.fog!==void 0&&(this.fog=t.fog),t.flatShading!==void 0&&(this.flatShading=t.flatShading),t.blending!==void 0&&(this.blending=t.blending),t.combine!==void 0&&(this.combine=t.combine),t.side!==void 0&&(this.side=t.side),t.shadowSide!==void 0&&(this.shadowSide=t.shadowSide),t.opacity!==void 0&&(this.opacity=t.opacity),t.transparent!==void 0&&(this.transparent=t.transparent),t.alphaTest!==void 0&&(this.alphaTest=t.alphaTest),t.alphaHash!==void 0&&(this.alphaHash=t.alphaHash),t.depthFunc!==void 0&&(this.depthFunc=t.depthFunc),t.depthTest!==void 0&&(this.depthTest=t.depthTest),t.depthWrite!==void 0&&(this.depthWrite=t.depthWrite),t.colorWrite!==void 0&&(this.colorWrite=t.colorWrite),t.clippingPlanes!==void 0&&(this.clippingPlanes=t.clippingPlanes.map(n=>new Bn().fromJSON(n))),t.clipIntersection!==void 0&&(this.clipIntersection=t.clipIntersection),t.clipShadows!==void 0&&(this.clipShadows=t.clipShadows),t.depthPacking!==void 0&&(this.depthPacking=t.depthPacking),t.blendSrc!==void 0&&(this.blendSrc=t.blendSrc),t.blendDst!==void 0&&(this.blendDst=t.blendDst),t.blendEquation!==void 0&&(this.blendEquation=t.blendEquation),t.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=t.blendSrcAlpha),t.blendDstAlpha!==void 0&&(this.blendDstAlpha=t.blendDstAlpha),t.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=t.blendEquationAlpha),t.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(t.blendColor),t.blendAlpha!==void 0&&(this.blendAlpha=t.blendAlpha),t.stencilWriteMask!==void 0&&(this.stencilWriteMask=t.stencilWriteMask),t.stencilFunc!==void 0&&(this.stencilFunc=t.stencilFunc),t.stencilRef!==void 0&&(this.stencilRef=t.stencilRef),t.stencilFuncMask!==void 0&&(this.stencilFuncMask=t.stencilFuncMask),t.stencilFail!==void 0&&(this.stencilFail=t.stencilFail),t.stencilZFail!==void 0&&(this.stencilZFail=t.stencilZFail),t.stencilZPass!==void 0&&(this.stencilZPass=t.stencilZPass),t.stencilWrite!==void 0&&(this.stencilWrite=t.stencilWrite),t.wireframe!==void 0&&(this.wireframe=t.wireframe),t.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=t.wireframeLinewidth),t.wireframeLinecap!==void 0&&(this.wireframeLinecap=t.wireframeLinecap),t.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=t.wireframeLinejoin),t.rotation!==void 0&&(this.rotation=t.rotation),t.linewidth!==void 0&&(this.linewidth=t.linewidth),t.linecap!==void 0&&(this.linecap=t.linecap),t.linejoin!==void 0&&(this.linejoin=t.linejoin),t.dashSize!==void 0&&(this.dashSize=t.dashSize),t.gapSize!==void 0&&(this.gapSize=t.gapSize),t.scale!==void 0&&(this.scale=t.scale),t.polygonOffset!==void 0&&(this.polygonOffset=t.polygonOffset),t.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=t.polygonOffsetFactor),t.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=t.polygonOffsetUnits),t.dithering!==void 0&&(this.dithering=t.dithering),t.alphaToCoverage!==void 0&&(this.alphaToCoverage=t.alphaToCoverage),t.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=t.premultipliedAlpha),t.forceSinglePass!==void 0&&(this.forceSinglePass=t.forceSinglePass),t.allowOverride!==void 0&&(this.allowOverride=t.allowOverride),t.visible!==void 0&&(this.visible=t.visible),t.toneMapped!==void 0&&(this.toneMapped=t.toneMapped),t.userData!==void 0&&(this.userData=t.userData),t.vertexColors!==void 0&&(typeof t.vertexColors=="number"?this.vertexColors=t.vertexColors>0:this.vertexColors=t.vertexColors),t.size!==void 0&&(this.size=t.size),t.sizeAttenuation!==void 0&&(this.sizeAttenuation=t.sizeAttenuation),t.map!==void 0&&(this.map=e[t.map]||null),t.matcap!==void 0&&(this.matcap=e[t.matcap]||null),t.alphaMap!==void 0&&(this.alphaMap=e[t.alphaMap]||null),t.bumpMap!==void 0&&(this.bumpMap=e[t.bumpMap]||null),t.bumpScale!==void 0&&(this.bumpScale=t.bumpScale),t.normalMap!==void 0&&(this.normalMap=e[t.normalMap]||null),t.normalMapType!==void 0&&(this.normalMapType=t.normalMapType),t.normalScale!==void 0){let n=t.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new it().fromArray(n)}return t.displacementMap!==void 0&&(this.displacementMap=e[t.displacementMap]||null),t.displacementScale!==void 0&&(this.displacementScale=t.displacementScale),t.displacementBias!==void 0&&(this.displacementBias=t.displacementBias),t.roughnessMap!==void 0&&(this.roughnessMap=e[t.roughnessMap]||null),t.metalnessMap!==void 0&&(this.metalnessMap=e[t.metalnessMap]||null),t.emissiveMap!==void 0&&(this.emissiveMap=e[t.emissiveMap]||null),t.emissiveIntensity!==void 0&&(this.emissiveIntensity=t.emissiveIntensity),t.specularMap!==void 0&&(this.specularMap=e[t.specularMap]||null),t.specularIntensityMap!==void 0&&(this.specularIntensityMap=e[t.specularIntensityMap]||null),t.specularColorMap!==void 0&&(this.specularColorMap=e[t.specularColorMap]||null),t.envMap!==void 0&&(this.envMap=e[t.envMap]||null),t.envMapRotation!==void 0&&this.envMapRotation.fromArray(t.envMapRotation),t.envMapIntensity!==void 0&&(this.envMapIntensity=t.envMapIntensity),t.reflectivity!==void 0&&(this.reflectivity=t.reflectivity),t.refractionRatio!==void 0&&(this.refractionRatio=t.refractionRatio),t.lightMap!==void 0&&(this.lightMap=e[t.lightMap]||null),t.lightMapIntensity!==void 0&&(this.lightMapIntensity=t.lightMapIntensity),t.aoMap!==void 0&&(this.aoMap=e[t.aoMap]||null),t.aoMapIntensity!==void 0&&(this.aoMapIntensity=t.aoMapIntensity),t.gradientMap!==void 0&&(this.gradientMap=e[t.gradientMap]||null),t.clearcoatMap!==void 0&&(this.clearcoatMap=e[t.clearcoatMap]||null),t.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=e[t.clearcoatRoughnessMap]||null),t.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=e[t.clearcoatNormalMap]||null),t.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new it().fromArray(t.clearcoatNormalScale)),t.iridescenceMap!==void 0&&(this.iridescenceMap=e[t.iridescenceMap]||null),t.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=e[t.iridescenceThicknessMap]||null),t.transmissionMap!==void 0&&(this.transmissionMap=e[t.transmissionMap]||null),t.thicknessMap!==void 0&&(this.thicknessMap=e[t.thicknessMap]||null),t.anisotropyMap!==void 0&&(this.anisotropyMap=e[t.anisotropyMap]||null),t.sheenColorMap!==void 0&&(this.sheenColorMap=e[t.sheenColorMap]||null),t.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=e[t.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,n=null;if(e!==null){let i=e.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.allowOverride=t.allowOverride,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}},Ws=class extends Vn{constructor(t){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new ht(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}},Cs,Pr=new E,Ps=new E,Is=new E,Ls=new it,Ir=new it,ff=new ce,go=new E,Lr=new E,xo=new E,od=new it,dh=new it,ld=new it,Kr=class extends Be{constructor(t=new Ws){if(super(),this.isSprite=!0,this.type="Sprite",Cs===void 0){Cs=new _e;let e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new Zo(e,5);Cs.setIndex([0,1,2,0,2,3]),Cs.setAttribute("position",new Zr(n,3,0,!1)),Cs.setAttribute("uv",new Zr(n,2,3,!1))}this.geometry=Cs,this.material=t,this.center=new it(.5,.5),this.count=1}intersectsFrustum(t){return t.intersectsSprite(this)}raycast(t,e){t.camera===null&&Ht('Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Ps.setFromMatrixScale(this.matrixWorld),ff.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),Is.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Ps.multiplyScalar(-Is.z);let n=this.material.rotation,i,r;n!==0&&(r=Math.cos(n),i=Math.sin(n));let a=this.center;_o(go.set(-.5,-.5,0),Is,a,Ps,i,r),_o(Lr.set(.5,-.5,0),Is,a,Ps,i,r),_o(xo.set(.5,.5,0),Is,a,Ps,i,r),od.set(0,0),dh.set(1,0),ld.set(1,1);let o=t.ray.intersectTriangle(go,Lr,xo,!1,Pr);if(o===null&&(_o(Lr.set(-.5,.5,0),Is,a,Ps,i,r),dh.set(0,1),o=t.ray.intersectTriangle(go,xo,Lr,!1,Pr),o===null))return;let c=t.ray.origin.distanceTo(Pr);c<t.near||c>t.far||e.push({distance:c,point:Pr.clone(),uv:pi.getInterpolation(Pr,go,Lr,xo,od,dh,ld,new it),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}};function _o(s,t,e,n,i,r){Ls.subVectors(s,e).addScalar(.5).multiply(n),i!==void 0?(Ir.x=r*Ls.x-i*Ls.y,Ir.y=i*Ls.x+r*Ls.y):Ir.copy(Ls),s.copy(t),s.x+=Ir.x,s.y+=Ir.y,s.applyMatrix4(ff)}var fi=new E,fh=new E,vo=new E,yo=new E,Qr=class{constructor(t=new E,e=new E(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,fi)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=fi.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(fi.copy(this.origin).addScaledVector(this.direction,e),fi.distanceToSquared(t))}distanceSqToSegment(t,e,n,i){fh.copy(t).add(e).multiplyScalar(.5),vo.copy(e).sub(t).normalize(),yo.copy(this.origin).sub(fh);let r=t.distanceTo(e)*.5,a=-this.direction.dot(vo),o=yo.dot(this.direction),c=-yo.dot(vo),l=yo.lengthSq(),h=Math.abs(1-a*a),d,u,f,p;if(h>0)if(d=a*c-o,u=a*o-c,p=r*h,d>=0)if(u>=-p)if(u<=p){let _=1/h;d*=_,u*=_,f=d*(d+a*u+2*o)+u*(a*d+u+2*c)+l}else u=r,d=Math.max(0,-(a*u+o)),f=-d*d+u*(u+2*c)+l;else u=-r,d=Math.max(0,-(a*u+o)),f=-d*d+u*(u+2*c)+l;else u<=-p?(d=Math.max(0,-(-a*r+o)),u=d>0?-r:Math.min(Math.max(-r,-c),r),f=-d*d+u*(u+2*c)+l):u<=p?(d=0,u=Math.min(Math.max(-r,-c),r),f=u*(u+2*c)+l):(d=Math.max(0,-(a*r+o)),u=d>0?r:Math.min(Math.max(-r,-c),r),f=-d*d+u*(u+2*c)+l);else u=a>0?-r:r,d=Math.max(0,-(a*u+o)),f=-d*d+u*(u+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,d),i&&i.copy(fh).addScaledVector(vo,u),f}intersectSphere(t,e){if(t.radius<0)return null;fi.subVectors(t.center,this.origin);let n=fi.dot(this.direction),i=fi.dot(fi)-n*n,r=t.radius*t.radius;if(i>r)return null;let a=Math.sqrt(r-i),o=n-a,c=n+a;return c<0?null:o<0?this.at(c,e):this.at(o,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){let n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,i,r,a,o,c,l=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,u=this.origin;return l>=0?(n=(t.min.x-u.x)*l,i=(t.max.x-u.x)*l):(n=(t.max.x-u.x)*l,i=(t.min.x-u.x)*l),h>=0?(r=(t.min.y-u.y)*h,a=(t.max.y-u.y)*h):(r=(t.max.y-u.y)*h,a=(t.min.y-u.y)*h),n>a||r>i||((r>n||isNaN(n))&&(n=r),(a<i||isNaN(i))&&(i=a),d>=0?(o=(t.min.z-u.z)*d,c=(t.max.z-u.z)*d):(o=(t.max.z-u.z)*d,c=(t.min.z-u.z)*d),n>c||o>i)||((o>n||n!==n)&&(n=o),(c<i||i!==i)&&(i=c),i<0)?null:this.at(n>=0?n:i,e)}intersectsBox(t){return this.intersectBox(t,fi)!==null}intersectTriangle(t,e,n,i,r){let a=this.origin,o=this.direction,c=o.x,l=o.y,h=o.z,d=t.x-a.x,u=t.y-a.y,f=t.z-a.z,p=e.x-a.x,_=e.y-a.y,m=e.z-a.z,g=n.x-a.x,M=n.y-a.y,w=n.z-a.z,y=Math.abs(c),T=Math.abs(l),b=Math.abs(h),P,v,A,I,N,O,L,C,F,k,V,j;if(y>=T&&y>=b?(A=c,O=d,F=p,j=g,c>=0?(P=l,v=h,I=u,N=f,L=_,C=m,k=M,V=w):(P=h,v=l,I=f,N=u,L=m,C=_,k=w,V=M)):T>=b?(A=l,O=u,F=_,j=M,l>=0?(P=h,v=c,I=f,N=d,L=m,C=p,k=w,V=g):(P=c,v=h,I=d,N=f,L=p,C=m,k=g,V=w)):(A=h,O=f,F=m,j=w,h>=0?(P=c,v=l,I=d,N=u,L=p,C=_,k=g,V=M):(P=l,v=c,I=u,N=d,L=_,C=p,k=M,V=g)),A===0)return null;let q=P/A,Z=v/A,K=1/A,At=I-q*O,yt=N-Z*O,se=L-q*F,Yt=C-Z*F,ne=k-q*j,Y=V-Z*j,tt=ne*Yt-Y*se,xt=At*Y-yt*ne,Bt=se*yt-Yt*At;if(i){if(tt<0||xt<0||Bt<0)return null}else if((tt<0||xt<0||Bt<0)&&(tt>0||xt>0||Bt>0))return null;let wt=tt+xt+Bt;if(wt===0)return null;let Vt=K*(tt*O+xt*F+Bt*j);return(wt>0?Vt<0:Vt>0)?null:this.at(Vt/wt,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},we=class extends Vn{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new ht(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ei,this.combine=yl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}},cd=new ce,$i=new Qr,Mo=new kn,hd=new E,So=new E,bo=new E,To=new E,ph=new E,wo=new E,ud=new E,Eo=new E,Tt=class extends Be{constructor(t=new _e,e=new we){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){let o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(t,e){let n=this.geometry,i=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(i,t);let o=this.morphTargetInfluences;if(r&&o){wo.set(0,0,0);for(let c=0,l=r.length;c<l;c++){let h=o[c],d=r[c];h!==0&&(ph.fromBufferAttribute(d,t),a?wo.addScaledVector(ph,h):wo.addScaledVector(ph.sub(e),h))}e.add(wo)}return e}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,e){let n=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Mo.copy(n.boundingSphere),Mo.applyMatrix4(r),$i.copy(t.ray).recast(t.near),!(Mo.containsPoint($i.origin)===!1&&($i.intersectSphere(Mo,hd)===null||$i.origin.distanceToSquared(hd)>(t.far-t.near)**2))&&(cd.copy(r).invert(),$i.copy(t.ray).applyMatrix4(cd),!(n.boundingBox!==null&&$i.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,$i)))}_computeIntersections(t,e,n){let i,r=this.geometry,a=this.material,o=r.index,c=r.attributes.position,l=r.attributes.uv,h=r.attributes.uv1,d=r.attributes.normal,u=r.groups,f=r.drawRange;if(o!==null)if(Array.isArray(a))for(let p=0,_=u.length;p<_;p++){let m=u[p],g=a[m.materialIndex],M=Math.max(m.start,f.start),w=Math.min(o.count,Math.min(m.start+m.count,f.start+f.count));for(let y=M,T=w;y<T;y+=3){let b=o.getX(y),P=o.getX(y+1),v=o.getX(y+2);i=Ao(this,g,t,n,l,h,d,b,P,v),i&&(i.faceIndex=Math.floor(y/3),i.face.materialIndex=m.materialIndex,e.push(i))}}else{let p=Math.max(0,f.start),_=Math.min(o.count,f.start+f.count);for(let m=p,g=_;m<g;m+=3){let M=o.getX(m),w=o.getX(m+1),y=o.getX(m+2);i=Ao(this,a,t,n,l,h,d,M,w,y),i&&(i.faceIndex=Math.floor(m/3),e.push(i))}}else if(c!==void 0)if(Array.isArray(a))for(let p=0,_=u.length;p<_;p++){let m=u[p],g=a[m.materialIndex],M=Math.max(m.start,f.start),w=Math.min(c.count,Math.min(m.start+m.count,f.start+f.count));for(let y=M,T=w;y<T;y+=3){let b=y,P=y+1,v=y+2;i=Ao(this,g,t,n,l,h,d,b,P,v),i&&(i.faceIndex=Math.floor(y/3),i.face.materialIndex=m.materialIndex,e.push(i))}}else{let p=Math.max(0,f.start),_=Math.min(c.count,f.start+f.count);for(let m=p,g=_;m<g;m+=3){let M=m,w=m+1,y=m+2;i=Ao(this,a,t,n,l,h,d,M,w,y),i&&(i.faceIndex=Math.floor(m/3),e.push(i))}}}};function km(s,t,e,n,i,r,a,o){let c;if(t.side===Oe?c=n.intersectTriangle(a,r,i,!0,o):c=n.intersectTriangle(i,r,a,t.side===Ni,o),c===null)return null;Eo.copy(o),Eo.applyMatrix4(s.matrixWorld);let l=e.ray.origin.distanceTo(Eo);return l<e.near||l>e.far?null:{distance:l,point:Eo.clone(),object:s}}function Ao(s,t,e,n,i,r,a,o,c,l){s.getVertexPosition(o,So),s.getVertexPosition(c,bo),s.getVertexPosition(l,To);let h=km(s,t,e,n,So,bo,To,ud);if(h){let d=new E;pi.getBarycoord(ud,So,bo,To,d),i&&(h.uv=pi.getInterpolatedAttribute(i,o,c,l,d,new it)),r&&(h.uv1=pi.getInterpolatedAttribute(r,o,c,l,d,new it)),a&&(h.normal=pi.getInterpolatedAttribute(a,o,c,l,d,new E),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let u={a:o,b:c,c:l,normal:new E,materialIndex:0};pi.getNormal(So,bo,To,u.normal),h.face=u,h.barycoord=d}return h}var jr=class extends on{constructor(t=null,e=1,n=1,i,r,a,o,c,l=qe,h=qe,d,u){super(null,a,o,c,l,h,i,r,d,u),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var ta=class extends De{constructor(t,e,n,i=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){let t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}},Ds=new ce,dd=new ce,Ro=[],fd=new ni,Vm=new ce,Dr=new Tt,Nr=new kn,ea=class extends Tt{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new ta(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,Vm)}computeBoundingBox(){let t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new ni),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Ds),fd.copy(t.boundingBox).applyMatrix4(Ds),this.boundingBox.union(fd)}computeBoundingSphere(){let t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new kn),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Ds),Nr.copy(t.boundingSphere).applyMatrix4(Ds),this.boundingSphere.union(Nr)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){return this.instanceColor===null?e.setRGB(1,1,1):e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){return e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){let n=e.morphTargetInfluences,i=this.morphTexture.source.data.data,r=n.length+1,a=t*r+1;for(let o=0;o<n.length;o++)n[o]=i[a+o]}raycast(t,e){let n=this.matrixWorld,i=this.count;if(Dr.geometry=this.geometry,Dr.material=this.material,Dr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Nr.copy(this.boundingSphere),Nr.applyMatrix4(n),t.ray.intersectsSphere(Nr)!==!1))for(let r=0;r<i;r++){this.getMatrixAt(r,Ds),dd.multiplyMatrices(n,Ds),Dr.matrixWorld=dd,Dr.raycast(t,Ro);for(let a=0,o=Ro.length;a<o;a++){let c=Ro[a];c.instanceId=r,c.object=this,e.push(c)}Ro.length=0}}setColorAt(t,e){return this.instanceColor===null&&(this.instanceColor=new ta(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3),this}setMatrixAt(t,e){return e.toArray(this.instanceMatrix.array,t*16),this}setMorphAt(t,e){let n=e.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new jr(new Float32Array(i*this.count),i,this.count,Al,Rn));let r=this.morphTexture.source.data.data,a=0;for(let l=0;l<n.length;l++)a+=n[l];let o=this.geometry.morphTargetsRelative?1:1-a,c=i*t;return r[c]=o,r.set(n,c+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},Ji=new kn,Hm=new it(.5,.5),Co=new E,Xs=class{constructor(t=new Bn,e=new Bn,n=new Bn,i=new Bn,r=new Bn,a=new Bn){this.planes=[t,e,n,i,r,a]}set(t,e,n,i,r,a){let o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(i),o[4].copy(r),o[5].copy(a),this}copy(t){let e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=zn,n=!1){let i=this.planes,r=t.elements,a=r[0],o=r[1],c=r[2],l=r[3],h=r[4],d=r[5],u=r[6],f=r[7],p=r[8],_=r[9],m=r[10],g=r[11],M=r[12],w=r[13],y=r[14],T=r[15];if(i[0].setComponents(l-a,f-h,g-p,T-M).normalize(),i[1].setComponents(l+a,f+h,g+p,T+M).normalize(),i[2].setComponents(l+o,f+d,g+_,T+w).normalize(),i[3].setComponents(l-o,f-d,g-_,T-w).normalize(),n)i[4].setComponents(c,u,m,y).normalize(),i[5].setComponents(l-c,f-u,g-m,T-y).normalize();else if(i[4].setComponents(l-c,f-u,g-m,T-y).normalize(),e===zn)i[5].setComponents(l+c,f+u,g+m,T+y).normalize();else if(e===zs)i[5].setComponents(c,u,m,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Ji.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Ji.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Ji)}intersectsSprite(t){Ji.center.set(0,0,0);let e=Hm.distanceTo(t.center);return Ji.radius=.7071067811865476+e,Ji.applyMatrix4(t.matrixWorld),this.intersectsSphere(Ji)}intersectsSphere(t){let e=this.planes,n=t.center,i=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(t){let e=this.planes;for(let n=0;n<6;n++){let i=e[n];if(Co.x=i.normal.x>0?t.max.x:t.min.x,Co.y=i.normal.y>0?t.max.y:t.min.y,Co.z=i.normal.z>0?t.max.z:t.min.z,i.distanceToPoint(Co)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var qs=class extends Vn{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new ht(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}},pd=new ce,Th=new Qr,Po=new kn,Io=new E,Qi=class extends Be{constructor(t=new _e,e=new qs){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,e){let n=this.geometry,i=this.matrixWorld,r=t.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Po.copy(n.boundingSphere),Po.applyMatrix4(i),Po.radius+=r,t.ray.intersectsSphere(Po)===!1)return;pd.copy(i).invert(),Th.copy(t.ray).applyMatrix4(pd);let o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=n.index,d=n.attributes.position;if(l!==null){let u=Math.max(0,a.start),f=Math.min(l.count,a.start+a.count);for(let p=u,_=f;p<_;p++){let m=l.getX(p);Io.fromBufferAttribute(d,m),md(Io,m,c,i,t,e,this)}}else{let u=Math.max(0,a.start),f=Math.min(d.count,a.start+a.count);for(let p=u,_=f;p<_;p++)Io.fromBufferAttribute(d,p),md(Io,p,c,i,t,e,this)}}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){let o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}};function md(s,t,e,n,i,r,a){let o=Th.distanceSqToPoint(s);if(o<e){let c=new E;Th.closestPointToPoint(s,c),c.applyMatrix4(n);let l=i.ray.origin.distanceTo(c);if(l<i.near||l>i.far)return;r.push({distance:l,distanceToRay:Math.sqrt(o),point:c,index:t,face:null,faceIndex:null,barycoord:null,object:a})}}var na=class extends on{constructor(t=[],e=Fi,n,i,r,a,o,c,l,h){super(t,e,n,i,r,a,o,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}},ji=class extends on{constructor(t,e,n,i,r,a,o,c,l){super(t,e,n,i,r,a,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}};var Ci=class extends on{constructor(t,e,n=Wn,i,r,a,o=qe,c=qe,l,h=jn,d=1){if(h!==jn&&h!==Oi)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let u={width:t,height:e,depth:d};super(u,i,r,a,o,c,h,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new Hs(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);return e.compareFunction=this.compareFunction,e}},Ko=class extends Ci{constructor(t,e=Wn,n=Fi,i,r,a=qe,o=qe,c,l=jn){let h={width:t,height:t,depth:1},d=[h,h,h,h,h,h];super(t,t,e,n,i,r,a,o,c,l),this.image=d,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(t){this.image=t}},ia=class extends on{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}},ve=class s extends _e{constructor(t=1,e=1,n=1,i=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:i,heightSegments:r,depthSegments:a};let o=this;i=Math.floor(i),r=Math.floor(r),a=Math.floor(a);let c=[],l=[],h=[],d=[],u=0,f=0;p("z","y","x",-1,-1,n,e,t,a,r,0),p("z","y","x",1,-1,n,e,-t,a,r,1),p("x","z","y",1,1,t,n,e,i,a,2),p("x","z","y",1,-1,t,n,-e,i,a,3),p("x","y","z",1,-1,t,e,n,i,r,4),p("x","y","z",-1,-1,t,e,-n,i,r,5),this.setIndex(c),this.setAttribute("position",new Jt(l,3)),this.setAttribute("normal",new Jt(h,3)),this.setAttribute("uv",new Jt(d,2));function p(_,m,g,M,w,y,T,b,P,v,A){let I=y/P,N=T/v,O=y/2,L=T/2,C=b/2,F=P+1,k=v+1,V=0,j=0,q=new E;for(let Z=0;Z<k;Z++){let K=Z*N-L;for(let At=0;At<F;At++){let yt=At*I-O;q[_]=yt*M,q[m]=K*w,q[g]=C,l.push(q.x,q.y,q.z),q[_]=0,q[m]=0,q[g]=b>0?1:-1,h.push(q.x,q.y,q.z),d.push(At/P),d.push(1-Z/v),V+=1}}for(let Z=0;Z<v;Z++)for(let K=0;K<P;K++){let At=u+K+F*Z,yt=u+K+F*(Z+1),se=u+(K+1)+F*(Z+1),Yt=u+(K+1)+F*Z;c.push(At,yt,Yt),c.push(yt,se,Yt),j+=6}o.addGroup(f,j,A),f+=j,u+=V}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};var Hn=class s extends _e{constructor(t=1,e=1,n=1,i=32,r=1,a=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:i,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:c};let l=this;i=Math.floor(i),r=Math.floor(r);let h=[],d=[],u=[],f=[],p=0,_=[],m=n/2,g=0;M(),a===!1&&(t>0&&w(!0),e>0&&w(!1)),this.setIndex(h),this.setAttribute("position",new Jt(d,3)),this.setAttribute("normal",new Jt(u,3)),this.setAttribute("uv",new Jt(f,2));function M(){let y=new E,T=new E,b=0,P=(e-t)/n;for(let v=0;v<=r;v++){let A=[],I=v/r,N=I*(e-t)+t;for(let O=0;O<=i;O++){let L=O/i,C=L*c+o,F=Math.sin(C),k=Math.cos(C);T.x=N*F,T.y=-I*n+m,T.z=N*k,d.push(T.x,T.y,T.z),y.set(F,P,k).normalize(),u.push(y.x,y.y,y.z),f.push(L,1-I),A.push(p++)}_.push(A)}for(let v=0;v<i;v++)for(let A=0;A<r;A++){let I=_[A][v],N=_[A+1][v],O=_[A+1][v+1],L=_[A][v+1];(t>0||A!==0)&&(h.push(I,N,L),b+=3),(e>0||A!==r-1)&&(h.push(N,O,L),b+=3)}l.addGroup(g,b,0),g+=b}function w(y){let T=p,b=new it,P=new E,v=0,A=y===!0?t:e,I=y===!0?1:-1;for(let O=1;O<=i;O++)d.push(0,m*I,0),u.push(0,I,0),f.push(.5,.5),p++;let N=p;for(let O=0;O<=i;O++){let C=O/i*c+o,F=Math.cos(C),k=Math.sin(C);P.x=A*k,P.y=m*I,P.z=A*F,d.push(P.x,P.y,P.z),u.push(0,I,0),b.x=F*.5+.5,b.y=k*.5*I+.5,f.push(b.x,b.y),p++}for(let O=0;O<i;O++){let L=T+O,C=N+O;y===!0?h.push(C,C+1,L):h.push(C+1,C,L),v+=3}l.addGroup(g,v,y===!0?1:2),g+=v}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},Ys=class s extends Hn{constructor(t=1,e=1,n=32,i=1,r=!1,a=0,o=Math.PI*2){super(0,t,e,n,i,r,a,o),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:i,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(t){return new s(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},Qo=class s extends _e{constructor(t=[],e=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:i};let r=[],a=[];o(i),l(n),h(),this.setAttribute("position",new Jt(r,3)),this.setAttribute("normal",new Jt(r.slice(),3)),this.setAttribute("uv",new Jt(a,2)),i===0?this.computeVertexNormals():this.normalizeNormals();function o(M){let w=new E,y=new E,T=new E;for(let b=0;b<e.length;b+=3)f(e[b+0],w),f(e[b+1],y),f(e[b+2],T),c(w,y,T,M)}function c(M,w,y,T){let b=T+1,P=[];for(let v=0;v<=b;v++){P[v]=[];let A=M.clone().lerp(y,v/b),I=w.clone().lerp(y,v/b),N=b-v;for(let O=0;O<=N;O++)O===0&&v===b?P[v][O]=A:P[v][O]=A.clone().lerp(I,O/N)}for(let v=0;v<b;v++)for(let A=0;A<2*(b-v)-1;A++){let I=Math.floor(A/2);A%2===0?(u(P[v][I+1]),u(P[v+1][I]),u(P[v][I])):(u(P[v][I+1]),u(P[v+1][I+1]),u(P[v+1][I]))}}function l(M){let w=new E;for(let y=0;y<r.length;y+=3)w.x=r[y+0],w.y=r[y+1],w.z=r[y+2],w.normalize().multiplyScalar(M),r[y+0]=w.x,r[y+1]=w.y,r[y+2]=w.z}function h(){let M=new E;for(let w=0;w<r.length;w+=3){M.x=r[w+0],M.y=r[w+1],M.z=r[w+2];let y=m(M)/2/Math.PI+.5,T=g(M)/Math.PI+.5;a.push(y,1-T)}p(),d()}function d(){for(let M=0;M<a.length;M+=6){let w=a[M+0],y=a[M+2],T=a[M+4],b=Math.max(w,y,T),P=Math.min(w,y,T);b>.9&&P<.1&&(w<.2&&(a[M+0]+=1),y<.2&&(a[M+2]+=1),T<.2&&(a[M+4]+=1))}}function u(M){r.push(M.x,M.y,M.z)}function f(M,w){let y=M*3;w.x=t[y+0],w.y=t[y+1],w.z=t[y+2]}function p(){let M=new E,w=new E,y=new E,T=new E,b=new it,P=new it,v=new it;for(let A=0,I=0;A<r.length;A+=9,I+=6){M.set(r[A+0],r[A+1],r[A+2]),w.set(r[A+3],r[A+4],r[A+5]),y.set(r[A+6],r[A+7],r[A+8]),b.set(a[I+0],a[I+1]),P.set(a[I+2],a[I+3]),v.set(a[I+4],a[I+5]),T.copy(M).add(w).add(y).divideScalar(3);let N=m(T);_(b,I+0,M,N),_(P,I+2,w,N),_(v,I+4,y,N)}}function _(M,w,y,T){T<0&&M.x===1&&(a[w]=M.x-1),y.x===0&&y.z===0&&(a[w]=T/2/Math.PI+.5)}function m(M){return Math.atan2(M.z,-M.x)}function g(M){return Math.atan2(-M.y,Math.sqrt(M.x*M.x+M.z*M.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.vertices,t.indices,t.radius,t.detail)}};var vn=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){kt("Curve: .getPoint() not implemented.")}getPointAt(t,e){let n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){let t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let e=[],n,i=this.getPoint(0),r=0;e.push(0);for(let a=1;a<=t;a++)n=this.getPoint(a/t),r+=n.distanceTo(i),e.push(r),i=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){let n=this.getLengths(),i=0,r=n.length,a;e?a=e:a=t*n[r-1];let o=0,c=r-1,l;for(;o<=c;)if(i=Math.floor(o+(c-o)/2),l=n[i]-a,l<0)o=i+1;else if(l>0)c=i-1;else{c=i;break}if(i=c,n[i]===a)return i/(r-1);let h=n[i],u=n[i+1]-h,f=(a-h)/u;return(i+f)/(r-1)}getTangent(t,e){let i=t-1e-4,r=t+1e-4;i<0&&(i=0),r>1&&(r=1);let a=this.getPoint(i),o=this.getPoint(r),c=e||(a.isVector2?new it:new E);return c.copy(o).sub(a).normalize(),c}getTangentAt(t,e){let n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e=!1){let n=new E,i=[],r=[],a=[],o=new E,c=new ce;for(let f=0;f<=t;f++){let p=f/t;i[f]=this.getTangentAt(p,new E)}r[0]=new E,a[0]=new E;let l=Number.MAX_VALUE,h=Math.abs(i[0].x),d=Math.abs(i[0].y),u=Math.abs(i[0].z);h<=l&&(l=h,n.set(1,0,0)),d<=l&&(l=d,n.set(0,1,0)),u<=l&&n.set(0,0,1),o.crossVectors(i[0],n).normalize(),r[0].crossVectors(i[0],o),a[0].crossVectors(i[0],r[0]);for(let f=1;f<=t;f++){if(r[f]=r[f-1].clone(),a[f]=a[f-1].clone(),o.crossVectors(i[f-1],i[f]),o.length()>Number.EPSILON){o.normalize();let p=Math.acos(Kt(i[f-1].dot(i[f]),-1,1));r[f].applyMatrix4(c.makeRotationAxis(o,p))}a[f].crossVectors(i[f],r[f])}if(e===!0){let f=Math.acos(Kt(r[0].dot(r[t]),-1,1));f/=t,i[0].dot(o.crossVectors(r[0],r[t]))>0&&(f=-f);for(let p=1;p<=t;p++)r[p].applyMatrix4(c.makeRotationAxis(i[p],f*p)),a[p].crossVectors(i[p],r[p])}return{tangents:i,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){let t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}},$s=class extends vn{constructor(t=0,e=0,n=1,i=1,r=0,a=Math.PI*2,o=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=i,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=c}getPoint(t,e=new it){let n=e,i=Math.PI*2,r=this.aEndAngle-this.aStartAngle,a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=i;for(;r>i;)r-=i;r<Number.EPSILON&&(a?r=0:r=i),this.aClockwise===!0&&!a&&(r===i?r=-i:r=r-i);let o=this.aStartAngle+t*r,c=this.aX+this.xRadius*Math.cos(o),l=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let h=Math.cos(this.aRotation),d=Math.sin(this.aRotation),u=c-this.aX,f=l-this.aY;c=u*h-f*d+this.aX,l=u*d+f*h+this.aY}return n.set(c,l)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){let t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}},jo=class extends $s{constructor(t,e,n,i,r,a){super(t,e,n,n,i,r,a),this.isArcCurve=!0,this.type="ArcCurve"}};function $h(){let s=0,t=0,e=0,n=0;function i(r,a,o,c){s=r,t=o,e=-3*r+3*a-2*o-c,n=2*r-2*a+o+c}return{initCatmullRom:function(r,a,o,c,l){i(a,o,l*(o-r),l*(c-a))},initNonuniformCatmullRom:function(r,a,o,c,l,h,d){let u=(a-r)/l-(o-r)/(l+h)+(o-a)/h,f=(o-a)/h-(c-a)/(h+d)+(c-o)/d;u*=h,f*=h,i(a,o,u,f)},calc:function(r){let a=r*r,o=a*r;return s+t*r+e*a+n*o}}}var gd=new E,xd=new E,mh=new $h,gh=new $h,xh=new $h,tl=class extends vn{constructor(t=[],e=!1,n="centripetal",i=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=i}getPoint(t,e=new E){let n=e,i=this.points,r=i.length,a=(r-(this.closed?0:1))*t,o=Math.floor(a),c=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:c===0&&o===r-1&&(o=r-2,c=1);let l,h;this.closed||o>0?l=i[(o-1)%r]:(xd.subVectors(i[0],i[1]).add(i[0]),l=xd);let d=i[o%r],u=i[(o+1)%r];if(this.closed||o+2<r?h=i[(o+2)%r]:(gd.subVectors(i[r-1],i[r-2]).add(i[r-1]),h=gd),this.curveType==="centripetal"||this.curveType==="chordal"){let f=this.curveType==="chordal"?.5:.25,p=Math.pow(l.distanceToSquared(d),f),_=Math.pow(d.distanceToSquared(u),f),m=Math.pow(u.distanceToSquared(h),f);_<1e-4&&(_=1),p<1e-4&&(p=_),m<1e-4&&(m=_),mh.initNonuniformCatmullRom(l.x,d.x,u.x,h.x,p,_,m),gh.initNonuniformCatmullRom(l.y,d.y,u.y,h.y,p,_,m),xh.initNonuniformCatmullRom(l.z,d.z,u.z,h.z,p,_,m)}else this.curveType==="catmullrom"&&(mh.initCatmullRom(l.x,d.x,u.x,h.x,this.tension),gh.initCatmullRom(l.y,d.y,u.y,h.y,this.tension),xh.initCatmullRom(l.z,d.z,u.z,h.z,this.tension));return n.set(mh.calc(c),gh.calc(c),xh.calc(c)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let i=t.points[e];this.points.push(i.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let i=this.points[e];t.points.push(i.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let i=t.points[e];this.points.push(new E().fromArray(i))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}};function _d(s,t,e,n,i){let r=(n-t)*.5,a=(i-e)*.5,o=s*s,c=s*o;return(2*e-2*n+r+a)*c+(-3*e+3*n-2*r-a)*o+r*s+e}function Gm(s,t){let e=1-s;return e*e*t}function Wm(s,t){return 2*(1-s)*s*t}function Xm(s,t){return s*s*t}function Or(s,t,e,n){return Gm(s,t)+Wm(s,e)+Xm(s,n)}function qm(s,t){let e=1-s;return e*e*e*t}function Ym(s,t){let e=1-s;return 3*e*e*s*t}function $m(s,t){return 3*(1-s)*s*s*t}function Jm(s,t){return s*s*s*t}function zr(s,t,e,n,i){return qm(s,t)+Ym(s,e)+$m(s,n)+Jm(s,i)}var sa=class extends vn{constructor(t=new it,e=new it,n=new it,i=new it){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=i}getPoint(t,e=new it){let n=e,i=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(zr(t,i.x,r.x,a.x,o.x),zr(t,i.y,r.y,a.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},el=class extends vn{constructor(t=new E,e=new E,n=new E,i=new E){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=i}getPoint(t,e=new E){let n=e,i=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(zr(t,i.x,r.x,a.x,o.x),zr(t,i.y,r.y,a.y,o.y),zr(t,i.z,r.z,a.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},ra=class extends vn{constructor(t=new it,e=new it){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new it){let n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new it){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},nl=class extends vn{constructor(t=new E,e=new E){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new E){let n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new E){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},aa=class extends vn{constructor(t=new it,e=new it,n=new it){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new it){let n=e,i=this.v0,r=this.v1,a=this.v2;return n.set(Or(t,i.x,r.x,a.x),Or(t,i.y,r.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},il=class extends vn{constructor(t=new E,e=new E,n=new E){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new E){let n=e,i=this.v0,r=this.v1,a=this.v2;return n.set(Or(t,i.x,r.x,a.x),Or(t,i.y,r.y,a.y),Or(t,i.z,r.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},oa=class extends vn{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new it){let n=e,i=this.points,r=(i.length-1)*t,a=Math.floor(r),o=r-a,c=i[a===0?a:a-1],l=i[a],h=i[a>i.length-2?i.length-1:a+1],d=i[a>i.length-3?i.length-1:a+2];return n.set(_d(o,c.x,l.x,h.x,d.x),_d(o,c.y,l.y,h.y,d.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let i=t.points[e];this.points.push(i.clone())}return this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let i=this.points[e];t.points.push(i.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let i=t.points[e];this.points.push(new it().fromArray(i))}return this}},wh=Object.freeze({__proto__:null,ArcCurve:jo,CatmullRomCurve3:tl,CubicBezierCurve:sa,CubicBezierCurve3:el,EllipseCurve:$s,LineCurve:ra,LineCurve3:nl,QuadraticBezierCurve:aa,QuadraticBezierCurve3:il,SplineCurve:oa}),sl=class extends vn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){let t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){let n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new wh[n](e,t))}return this}getPoint(t,e){let n=t*this.getLength(),i=this.getCurveLengths(),r=0;for(;r<i.length;){if(i[r]>=n){let a=i[r]-n,o=this.curves[r],c=o.getLength(),l=c===0?0:1-a/c;return o.getPointAt(l,e)}r++}return null}getLength(){let t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let t=[],e=0;for(let n=0,i=this.curves.length;n<i;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){let e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){let e=[],n;for(let i=0,r=this.curves;i<r.length;i++){let a=r[i],o=a.isEllipseCurve?t*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?t*a.points.length:t,c=a.getPoints(o);for(let l=0;l<c.length;l++){let h=c[l];n&&n.equals(h)||(e.push(h),n=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){let i=t.curves[e];this.curves.push(i.clone())}return this.autoClose=t.autoClose,this}toJSON(){let t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){let i=this.curves[e];t.curves.push(i.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){let i=t.curves[e];this.curves.push(new wh[i.type]().fromJSON(i))}return this}},la=class extends sl{constructor(t){super(),this.type="Path",this.currentPoint=new it,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){let n=new ra(this.currentPoint.clone(),new it(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,i){let r=new aa(this.currentPoint.clone(),new it(t,e),new it(n,i));return this.curves.push(r),this.currentPoint.set(n,i),this}bezierCurveTo(t,e,n,i,r,a){let o=new sa(this.currentPoint.clone(),new it(t,e),new it(n,i),new it(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(t){let e=[this.currentPoint.clone()].concat(t),n=new oa(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,i,r,a){let o=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(t+o,e+c,n,i,r,a),this}absarc(t,e,n,i,r,a){return this.absellipse(t,e,n,n,i,r,a),this}ellipse(t,e,n,i,r,a,o,c){let l=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+l,e+h,n,i,r,a,o,c),this}absellipse(t,e,n,i,r,a,o,c){let l=new $s(t,e,n,i,r,a,o,c);if(this.curves.length>0){let d=l.getPoint(0);d.equals(this.currentPoint)||this.lineTo(d.x,d.y)}this.curves.push(l);let h=l.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){let t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}},ii=class extends la{constructor(t){super(t),this.uuid=Qn(),this.type="Shape",this.holes=[]}getPointsHoles(t){let e=[];for(let n=0,i=this.holes.length;n<i;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){let i=t.holes[e];this.holes.push(i.clone())}return this}toJSON(){let t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){let i=this.holes[e];t.holes.push(i.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){let i=t.holes[e];this.holes.push(new la().fromJSON(i))}return this}};function Zm(s,t,e=2){let n=t&&t.length,i=n?t[0]*e:s.length,r=pf(s,0,i,e,!0),a=[];if(!r||r.next===r.prev)return a;let o,c,l;if(n&&(r=e0(s,t,r,e)),s.length>80*e){o=s[0],c=s[1];let h=o,d=c;for(let u=e;u<i;u+=e){let f=s[u],p=s[u+1];f<o&&(o=f),p<c&&(c=p),f>h&&(h=f),p>d&&(d=p)}l=Math.max(h-o,d-c),l=l!==0?32767/l:0}return ca(r,a,e,o,c,l,0),a}function pf(s,t,e,n,i){let r;if(i===d0(s,t,e,n)>0)for(let a=t;a<e;a+=n)r=vd(a/n|0,s[a],s[a+1],r);else for(let a=e-n;a>=t;a-=n)r=vd(a/n|0,s[a],s[a+1],r);return r&&Js(r,r.next)&&(ua(r),r=r.next),r}function ts(s,t){if(!s)return s;t||(t=s);let e=s,n;do if(n=!1,!e.steiner&&(Js(e,e.next)||Ce(e.prev,e,e.next)===0)){if(ua(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function ca(s,t,e,n,i,r,a){if(!s)return;!a&&r&&a0(s,n,i,r);let o=s;for(;s.prev!==s.next;){let c=s.prev,l=s.next;if(r?Qm(s,n,i,r):Km(s)){t.push(c.i,s.i,l.i),ua(s),s=l.next,o=l.next;continue}if(s=l,s===o){a?a===1?(s=jm(ts(s),t),ca(s,t,e,n,i,r,2)):a===2&&t0(s,t,e,n,i,r):ca(ts(s),t,e,n,i,r,1);break}}}function Km(s){let t=s.prev,e=s,n=s.next;if(Ce(t,e,n)>=0)return!1;let i=t.x,r=e.x,a=n.x,o=t.y,c=e.y,l=n.y,h=Math.min(i,r,a),d=Math.min(o,c,l),u=Math.max(i,r,a),f=Math.max(o,c,l),p=n.next;for(;p!==t;){if(p.x>=h&&p.x<=u&&p.y>=d&&p.y<=f&&Ur(i,o,r,c,a,l,p.x,p.y)&&Ce(p.prev,p,p.next)>=0)return!1;p=p.next}return!0}function Qm(s,t,e,n){let i=s.prev,r=s,a=s.next;if(Ce(i,r,a)>=0)return!1;let o=i.x,c=r.x,l=a.x,h=i.y,d=r.y,u=a.y,f=Math.min(o,c,l),p=Math.min(h,d,u),_=Math.max(o,c,l),m=Math.max(h,d,u),g=Eh(f,p,t,e,n),M=Eh(_,m,t,e,n),w=s.prevZ,y=s.nextZ;for(;w&&w.z>=g&&y&&y.z<=M;){if(w.x>=f&&w.x<=_&&w.y>=p&&w.y<=m&&w!==i&&w!==a&&Ur(o,h,c,d,l,u,w.x,w.y)&&Ce(w.prev,w,w.next)>=0||(w=w.prevZ,y.x>=f&&y.x<=_&&y.y>=p&&y.y<=m&&y!==i&&y!==a&&Ur(o,h,c,d,l,u,y.x,y.y)&&Ce(y.prev,y,y.next)>=0))return!1;y=y.nextZ}for(;w&&w.z>=g;){if(w.x>=f&&w.x<=_&&w.y>=p&&w.y<=m&&w!==i&&w!==a&&Ur(o,h,c,d,l,u,w.x,w.y)&&Ce(w.prev,w,w.next)>=0)return!1;w=w.prevZ}for(;y&&y.z<=M;){if(y.x>=f&&y.x<=_&&y.y>=p&&y.y<=m&&y!==i&&y!==a&&Ur(o,h,c,d,l,u,y.x,y.y)&&Ce(y.prev,y,y.next)>=0)return!1;y=y.nextZ}return!0}function jm(s,t){let e=s;do{let n=e.prev,i=e.next.next;!Js(n,i)&&gf(n,e,e.next,i)&&ha(n,i)&&ha(i,n)&&(t.push(n.i,e.i,i.i),ua(e),ua(e.next),e=s=i),e=e.next}while(e!==s);return ts(e)}function t0(s,t,e,n,i,r){let a=s;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&c0(a,o)){let c=xf(a,o);a=ts(a,a.next),c=ts(c,c.next),ca(a,t,e,n,i,r,0),ca(c,t,e,n,i,r,0);return}o=o.next}a=a.next}while(a!==s)}function e0(s,t,e,n){let i=[];for(let r=0,a=t.length;r<a;r++){let o=t[r]*n,c=r<a-1?t[r+1]*n:s.length,l=pf(s,o,c,n,!1);l===l.next&&(l.steiner=!0),i.push(l0(l))}i.sort(n0);for(let r=0;r<i.length;r++)e=i0(i[r],e);return e}function n0(s,t){let e=s.x-t.x;if(e===0&&(e=s.y-t.y,e===0)){let n=(s.next.y-s.y)/(s.next.x-s.x),i=(t.next.y-t.y)/(t.next.x-t.x);e=n-i}return e}function i0(s,t){let e=s0(s,t);if(!e)return t;let n=xf(e,s);return ts(n,n.next),ts(e,e.next)}function s0(s,t){let e=t,n=s.x,i=s.y,r=-1/0,a;if(Js(s,e))return e;do{if(Js(s,e.next))return e.next;if(i<=e.y&&i>=e.next.y&&e.next.y!==e.y){let d=e.x+(i-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(d<=n&&d>r&&(r=d,a=e.x<e.next.x?e:e.next,d===n))return a}e=e.next}while(e!==t);if(!a)return null;let o=a,c=a.x,l=a.y,h=1/0;e=a;do{if(n>=e.x&&e.x>=c&&n!==e.x&&mf(i<l?n:r,i,c,l,i<l?r:n,i,e.x,e.y)){let d=Math.abs(i-e.y)/(n-e.x);ha(e,s)&&(d<h||d===h&&(e.x>a.x||e.x===a.x&&r0(a,e)))&&(a=e,h=d)}e=e.next}while(e!==o);return a}function r0(s,t){return Ce(s.prev,s,t.prev)<0&&Ce(t.next,s,s.next)<0}function a0(s,t,e,n){let i=s;do i.z===0&&(i.z=Eh(i.x,i.y,t,e,n)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==s);i.prevZ.nextZ=null,i.prevZ=null,o0(i)}function o0(s){let t,e=1;do{let n=s,i;s=null;let r=null;for(t=0;n;){t++;let a=n,o=0;for(let l=0;l<e&&(o++,a=a.nextZ,!!a);l++);let c=e;for(;o>0||c>0&&a;)o!==0&&(c===0||!a||n.z<=a.z)?(i=n,n=n.nextZ,o--):(i=a,a=a.nextZ,c--),r?r.nextZ=i:s=i,i.prevZ=r,r=i;n=a}r.nextZ=null,e*=2}while(t>1);return s}function Eh(s,t,e,n,i){return s=(s-e)*i|0,t=(t-n)*i|0,s=(s|s<<8)&16711935,s=(s|s<<4)&252645135,s=(s|s<<2)&858993459,s=(s|s<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,s|t<<1}function l0(s){let t=s,e=s;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==s);return e}function mf(s,t,e,n,i,r,a,o){return(i-a)*(t-o)>=(s-a)*(r-o)&&(s-a)*(n-o)>=(e-a)*(t-o)&&(e-a)*(r-o)>=(i-a)*(n-o)}function Ur(s,t,e,n,i,r,a,o){return!(s===a&&t===o)&&mf(s,t,e,n,i,r,a,o)}function c0(s,t){return s.next.i!==t.i&&s.prev.i!==t.i&&!h0(s,t)&&(ha(s,t)&&ha(t,s)&&u0(s,t)&&(Ce(s.prev,s,t.prev)||Ce(s,t.prev,t))||Js(s,t)&&Ce(s.prev,s,s.next)>0&&Ce(t.prev,t,t.next)>0)}function Ce(s,t,e){return(t.y-s.y)*(e.x-t.x)-(t.x-s.x)*(e.y-t.y)}function Js(s,t){return s.x===t.x&&s.y===t.y}function gf(s,t,e,n){let i=Do(Ce(s,t,e)),r=Do(Ce(s,t,n)),a=Do(Ce(e,n,s)),o=Do(Ce(e,n,t));return!!(i!==r&&a!==o||i===0&&Lo(s,e,t)||r===0&&Lo(s,n,t)||a===0&&Lo(e,s,n)||o===0&&Lo(e,t,n))}function Lo(s,t,e){return t.x<=Math.max(s.x,e.x)&&t.x>=Math.min(s.x,e.x)&&t.y<=Math.max(s.y,e.y)&&t.y>=Math.min(s.y,e.y)}function Do(s){return s>0?1:s<0?-1:0}function h0(s,t){let e=s;do{if(e.i!==s.i&&e.next.i!==s.i&&e.i!==t.i&&e.next.i!==t.i&&gf(e,e.next,s,t))return!0;e=e.next}while(e!==s);return!1}function ha(s,t){return Ce(s.prev,s,s.next)<0?Ce(s,t,s.next)>=0&&Ce(s,s.prev,t)>=0:Ce(s,t,s.prev)<0||Ce(s,s.next,t)<0}function u0(s,t){let e=s,n=!1,i=(s.x+t.x)/2,r=(s.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&i<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==s);return n}function xf(s,t){let e=Ah(s.i,s.x,s.y),n=Ah(t.i,t.x,t.y),i=s.next,r=t.prev;return s.next=t,t.prev=s,e.next=i,i.prev=e,n.next=e,e.prev=n,r.next=n,n.prev=r,n}function vd(s,t,e,n){let i=Ah(s,t,e);return n?(i.next=n.next,i.prev=n,n.next.prev=i,n.next=i):(i.prev=i,i.next=i),i}function ua(s){s.next.prev=s.prev,s.prev.next=s.next,s.prevZ&&(s.prevZ.nextZ=s.nextZ),s.nextZ&&(s.nextZ.prevZ=s.prevZ)}function Ah(s,t,e){return{i:s,x:t,y:e,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function d0(s,t,e,n){let i=0;for(let r=t,a=e-n;r<e;r+=n)i+=(s[a]-s[r])*(s[r+1]+s[a+1]),a=r;return i}var Rh=class{static triangulate(t,e,n=2){return Zm(t,e,n)}},Kn=class s{static area(t){let e=t.length,n=0;for(let i=e-1,r=0;r<e;i=r++)n+=t[i].x*t[r].y-t[r].x*t[i].y;return n*.5}static isClockWise(t){return s.area(t)<0}static triangulateShape(t,e){let n=[],i=[],r=[];yd(t),Md(n,t);let a=t.length;e.forEach(yd);for(let c=0;c<e.length;c++)i.push(a),a+=e[c].length,Md(n,e[c]);let o=Rh.triangulate(n,i);for(let c=0;c<o.length;c+=3)r.push(o.slice(c,c+3));return r}};function yd(s){let t=s.length;t>2&&s[t-1].equals(s[0])&&s.pop()}function Md(s,t){for(let e=0;e<t.length;e++)s.push(t[e].x),s.push(t[e].y)}var es=class s extends _e{constructor(t=new ii([new it(.5,.5),new it(-.5,.5),new it(-.5,-.5),new it(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];let n=this,i=[],r=[];for(let o=0,c=t.length;o<c;o++){let l=t[o];a(l)}this.setAttribute("position",new Jt(i,3)),this.setAttribute("uv",new Jt(r,2)),this.computeVertexNormals();function a(o){let c=[],l=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,d=e.depth!==void 0?e.depth:1,u=e.bevelEnabled!==void 0?e.bevelEnabled:!0,f=e.bevelThickness!==void 0?e.bevelThickness:.2,p=e.bevelSize!==void 0?e.bevelSize:f-.1,_=e.bevelOffset!==void 0?e.bevelOffset:0,m=e.bevelSegments!==void 0?e.bevelSegments:3,g=e.extrudePath,M=e.UVGenerator!==void 0?e.UVGenerator:f0,w,y=!1,T,b,P,v;if(g){w=g.getSpacedPoints(h),y=!0,u=!1;let et=g.isCatmullRomCurve3?g.closed:!1;T=g.computeFrenetFrames(h,et),b=new E,P=new E,v=new E}u||(m=0,f=0,p=0,_=0);let A=o.extractPoints(l),I=A.shape,N=A.holes;if(!Kn.isClockWise(I)){I=I.reverse();for(let et=0,rt=N.length;et<rt;et++){let at=N[et];Kn.isClockWise(at)&&(N[et]=at.reverse())}}function L(et){let at=10000000000000001e-36,ot=et[0];for(let ct=1;ct<=et.length;ct++){let Ot=ct%et.length,Ft=et[Ot],Gt=Ft.x-ot.x,Xt=Ft.y-ot.y,D=Gt*Gt+Xt*Xt,he=Math.max(Math.abs(Ft.x),Math.abs(Ft.y),Math.abs(ot.x),Math.abs(ot.y)),te=at*he*he;if(D<=te){et.splice(Ot,1),ct--;continue}ot=Ft}}L(I),N.forEach(L);let C=N.length,F=I;for(let et=0;et<C;et++){let rt=N[et];I=I.concat(rt)}function k(et,rt,at){return rt||Ht("ExtrudeGeometry: vec does not exist"),et.clone().addScaledVector(rt,at)}let V=I.length;function j(et,rt,at){let ot,ct,Ot,Ft=et.x-rt.x,Gt=et.y-rt.y,Xt=at.x-et.x,D=at.y-et.y,he=Ft*Ft+Gt*Gt,te=Ft*D-Gt*Xt;if(Math.abs(te)>Number.EPSILON){let R=Math.sqrt(he),x=Math.sqrt(Xt*Xt+D*D),z=rt.x-Gt/R,W=rt.y+Ft/R,$=at.x-D/x,lt=at.y+Xt/x,dt=(($-z)*D-(lt-W)*Xt)/(Ft*D-Gt*Xt);ot=z+Ft*dt-et.x,ct=W+Gt*dt-et.y;let J=ot*ot+ct*ct;if(J<=2)return new it(ot,ct);Ot=Math.sqrt(J/2)}else{let R=!1;Ft>Number.EPSILON?Xt>Number.EPSILON&&(R=!0):Ft<-Number.EPSILON?Xt<-Number.EPSILON&&(R=!0):Math.sign(Gt)===Math.sign(D)&&(R=!0),R?(ot=-Gt,ct=Ft,Ot=Math.sqrt(he)):(ot=Ft,ct=Gt,Ot=Math.sqrt(he/2))}return new it(ot/Ot,ct/Ot)}let q=[];for(let et=0,rt=F.length,at=rt-1,ot=et+1;et<rt;et++,at++,ot++)at===rt&&(at=0),ot===rt&&(ot=0),q[et]=j(F[et],F[at],F[ot]);let Z=[],K,At=q.concat();for(let et=0,rt=C;et<rt;et++){let at=N[et];K=[];for(let ot=0,ct=at.length,Ot=ct-1,Ft=ot+1;ot<ct;ot++,Ot++,Ft++)Ot===ct&&(Ot=0),Ft===ct&&(Ft=0),K[ot]=j(at[ot],at[Ot],at[Ft]);Z.push(K),At=At.concat(K)}let yt;if(m===0)yt=Kn.triangulateShape(F,N);else{let et=[],rt=[];for(let at=0;at<m;at++){let ot=at/m,ct=f*Math.cos(ot*Math.PI/2),Ot=p*Math.sin(ot*Math.PI/2)+_;for(let Ft=0,Gt=F.length;Ft<Gt;Ft++){let Xt=k(F[Ft],q[Ft],Ot);xt(Xt.x,Xt.y,-ct),ot===0&&et.push(Xt)}for(let Ft=0,Gt=C;Ft<Gt;Ft++){let Xt=N[Ft];K=Z[Ft];let D=[];for(let he=0,te=Xt.length;he<te;he++){let R=k(Xt[he],K[he],Ot);xt(R.x,R.y,-ct),ot===0&&D.push(R)}ot===0&&rt.push(D)}}yt=Kn.triangulateShape(et,rt)}let se=yt.length,Yt=p+_;for(let et=0;et<V;et++){let rt=u?k(I[et],At[et],Yt):I[et];y?(P.copy(T.normals[0]).multiplyScalar(rt.x),b.copy(T.binormals[0]).multiplyScalar(rt.y),v.copy(w[0]).add(P).add(b),xt(v.x,v.y,v.z)):xt(rt.x,rt.y,0)}for(let et=1;et<=h;et++)for(let rt=0;rt<V;rt++){let at=u?k(I[rt],At[rt],Yt):I[rt];y?(P.copy(T.normals[et]).multiplyScalar(at.x),b.copy(T.binormals[et]).multiplyScalar(at.y),v.copy(w[et]).add(P).add(b),xt(v.x,v.y,v.z)):xt(at.x,at.y,d/h*et)}for(let et=m-1;et>=0;et--){let rt=et/m,at=f*Math.cos(rt*Math.PI/2),ot=p*Math.sin(rt*Math.PI/2)+_;for(let ct=0,Ot=F.length;ct<Ot;ct++){let Ft=k(F[ct],q[ct],ot);xt(Ft.x,Ft.y,d+at)}for(let ct=0,Ot=N.length;ct<Ot;ct++){let Ft=N[ct];K=Z[ct];for(let Gt=0,Xt=Ft.length;Gt<Xt;Gt++){let D=k(Ft[Gt],K[Gt],ot);y?xt(D.x,D.y+w[h-1].y,w[h-1].x+at):xt(D.x,D.y,d+at)}}}ne(),Y();function ne(){let et=i.length/3;if(u){let rt=0,at=V*rt;for(let ot=0;ot<se;ot++){let ct=yt[ot];Bt(ct[2]+at,ct[1]+at,ct[0]+at)}rt=h+m*2,at=V*rt;for(let ot=0;ot<se;ot++){let ct=yt[ot];Bt(ct[0]+at,ct[1]+at,ct[2]+at)}}else{for(let rt=0;rt<se;rt++){let at=yt[rt];Bt(at[2],at[1],at[0])}for(let rt=0;rt<se;rt++){let at=yt[rt];Bt(at[0]+V*h,at[1]+V*h,at[2]+V*h)}}n.addGroup(et,i.length/3-et,0)}function Y(){let et=i.length/3,rt=0;tt(F,rt),rt+=F.length;for(let at=0,ot=N.length;at<ot;at++){let ct=N[at];tt(ct,rt),rt+=ct.length}n.addGroup(et,i.length/3-et,1)}function tt(et,rt){let at=et.length;for(;--at>=0;){let ot=at,ct=at-1;ct<0&&(ct=et.length-1);for(let Ot=0,Ft=h+m*2;Ot<Ft;Ot++){let Gt=V*Ot,Xt=V*(Ot+1),D=rt+ot+Gt,he=rt+ct+Gt,te=rt+ct+Xt,R=rt+ot+Xt;wt(D,he,te,R)}}}function xt(et,rt,at){c.push(et),c.push(rt),c.push(at)}function Bt(et,rt,at){Vt(et),Vt(rt),Vt(at);let ot=i.length/3,ct=M.generateTopUV(n,i,ot-3,ot-2,ot-1);le(ct[0]),le(ct[1]),le(ct[2])}function wt(et,rt,at,ot){Vt(et),Vt(rt),Vt(ot),Vt(rt),Vt(at),Vt(ot);let ct=i.length/3,Ot=M.generateSideWallUV(n,i,ct-6,ct-3,ct-2,ct-1);le(Ot[0]),le(Ot[1]),le(Ot[3]),le(Ot[1]),le(Ot[2]),le(Ot[3])}function Vt(et){i.push(c[et*3+0]),i.push(c[et*3+1]),i.push(c[et*3+2])}function le(et){r.push(et.x),r.push(et.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return p0(e,n,t)}static fromJSON(t,e){let n=[];for(let r=0,a=t.shapes.length;r<a;r++){let o=e[t.shapes[r]];n.push(o)}let i=t.options.extrudePath;return i!==void 0&&(t.options.extrudePath=new wh[i.type]().fromJSON(i)),new s(n,t.options)}},f0={generateTopUV:function(s,t,e,n,i){let r=t[e*3],a=t[e*3+1],o=t[n*3],c=t[n*3+1],l=t[i*3],h=t[i*3+1];return[new it(r,a),new it(o,c),new it(l,h)]},generateSideWallUV:function(s,t,e,n,i,r){let a=t[e*3],o=t[e*3+1],c=t[e*3+2],l=t[n*3],h=t[n*3+1],d=t[n*3+2],u=t[i*3],f=t[i*3+1],p=t[i*3+2],_=t[r*3],m=t[r*3+1],g=t[r*3+2];return Math.abs(o-h)<Math.abs(a-l)?[new it(a,1-c),new it(l,1-d),new it(u,1-p),new it(_,1-g)]:[new it(o,1-c),new it(h,1-d),new it(f,1-p),new it(m,1-g)]}};function p0(s,t,e){if(e.shapes=[],Array.isArray(s))for(let n=0,i=s.length;n<i;n++){let r=s[n];e.shapes.push(r.uuid)}else e.shapes.push(s.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}var da=class s extends Qo{constructor(t=1,e=0){let n=(1+Math.sqrt(5))/2,i=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(i,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new s(t.radius,t.detail)}};var fn=class s extends _e{constructor(t=1,e=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:i};let r=t/2,a=e/2,o=Math.floor(n),c=Math.floor(i),l=o+1,h=c+1,d=t/o,u=e/c,f=[],p=[],_=[],m=[];for(let g=0;g<h;g++){let M=g*u-a;for(let w=0;w<l;w++){let y=w*d-r;p.push(y,-M,0),_.push(0,0,1),m.push(w/o),m.push(1-g/c)}}for(let g=0;g<c;g++)for(let M=0;M<o;M++){let w=M+l*g,y=M+l*(g+1),T=M+1+l*(g+1),b=M+1+l*g;f.push(w,y,b),f.push(y,T,b)}this.setIndex(f),this.setAttribute("position",new Jt(p,3)),this.setAttribute("normal",new Jt(_,3)),this.setAttribute("uv",new Jt(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.width,t.height,t.widthSegments,t.heightSegments)}},fa=class s extends _e{constructor(t=.5,e=1,n=32,i=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:n,phiSegments:i,thetaStart:r,thetaLength:a},n=Math.max(3,n),i=Math.max(1,i);let o=[],c=[],l=[],h=[],d=t,u=(e-t)/i,f=new E,p=new it;for(let _=0;_<=i;_++){for(let m=0;m<=n;m++){let g=r+m/n*a;f.x=d*Math.cos(g),f.y=d*Math.sin(g),c.push(f.x,f.y,f.z),l.push(0,0,1),p.x=(f.x/e+1)/2,p.y=(f.y/e+1)/2,h.push(p.x,p.y)}d+=u}for(let _=0;_<i;_++){let m=_*(n+1);for(let g=0;g<n;g++){let M=g+m,w=M,y=M+n+1,T=M+n+2,b=M+1;o.push(w,y,b),o.push(y,T,b)}}this.setIndex(o),this.setAttribute("position",new Jt(c,3)),this.setAttribute("normal",new Jt(l,3)),this.setAttribute("uv",new Jt(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}},pa=class s extends _e{constructor(t=new ii([new it(0,.5),new it(-.5,-.5),new it(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};let n=[],i=[],r=[],a=[],o=0,c=0;if(Array.isArray(t)===!1)l(t);else for(let h=0;h<t.length;h++)l(t[h]),this.addGroup(o,c,h),o+=c,c=0;this.setIndex(n),this.setAttribute("position",new Jt(i,3)),this.setAttribute("normal",new Jt(r,3)),this.setAttribute("uv",new Jt(a,2));function l(h){let d=i.length/3,u=h.extractPoints(e),f=u.shape,p=u.holes;Kn.isClockWise(f)===!1&&(f=f.reverse());for(let m=0,g=p.length;m<g;m++){let M=p[m];Kn.isClockWise(M)===!0&&(p[m]=M.reverse())}let _=Kn.triangulateShape(f,p);for(let m=0,g=p.length;m<g;m++){let M=p[m];f=f.concat(M)}for(let m=0,g=f.length;m<g;m++){let M=f[m];i.push(M.x,M.y,0),r.push(0,0,1),a.push(M.x,M.y)}for(let m=0,g=_.length;m<g;m++){let M=_[m],w=M[0]+d,y=M[1]+d,T=M[2]+d;n.push(w,y,T),c+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON(),e=this.parameters.shapes;return m0(e,t)}static fromJSON(t,e){let n=[];for(let i=0,r=t.shapes.length;i<r;i++){let a=e[t.shapes[i]];n.push(a)}return new s(n,t.curveSegments)}};function m0(s,t){if(t.shapes=[],Array.isArray(s))for(let e=0,n=s.length;e<n;e++){let i=s[e];t.shapes.push(i.uuid)}else t.shapes.push(s.uuid);return t}var ns=class s extends _e{constructor(t=1,e=32,n=16,i=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:i,phiLength:r,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));let c=Math.min(a+o,Math.PI),l=0,h=[],d=new E,u=new E,f=[],p=[],_=[],m=[];for(let g=0;g<=n;g++){let M=[],w=g/n,y=a+w*o,T=t*Math.cos(y),b=Math.sqrt(t*t-T*T),P=0;g===0&&a===0?P=.5/e:g===n&&c===Math.PI&&(P=-.5/e);for(let v=0;v<=e;v++){let A=v/e,I=i+A*r;d.x=-b*Math.cos(I),d.y=T,d.z=b*Math.sin(I),p.push(d.x,d.y,d.z),u.copy(d).normalize(),_.push(u.x,u.y,u.z),m.push(A+P,1-w),M.push(l++)}h.push(M)}for(let g=0;g<n;g++)for(let M=0;M<e;M++){let w=h[g][M+1],y=h[g][M],T=h[g+1][M],b=h[g+1][M+1];(g!==0||a>0)&&f.push(w,y,b),(g!==n-1||c<Math.PI)&&f.push(y,T,b)}this.setIndex(f),this.setAttribute("position",new Jt(p,3)),this.setAttribute("normal",new Jt(_,3)),this.setAttribute("uv",new Jt(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}};var is=class s extends _e{constructor(t=1,e=.4,n=12,i=48,r=Math.PI*2,a=0,o=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:i,arc:r,thetaStart:a,thetaLength:o},n=Math.floor(n),i=Math.floor(i);let c=[],l=[],h=[],d=[],u=new E,f=new E,p=new E;for(let _=0;_<=n;_++){let m=a+_/n*o;for(let g=0;g<=i;g++){let M=g/i*r;f.x=(t+e*Math.cos(m))*Math.cos(M),f.y=(t+e*Math.cos(m))*Math.sin(M),f.z=e*Math.sin(m),l.push(f.x,f.y,f.z),u.x=t*Math.cos(M),u.y=t*Math.sin(M),p.subVectors(f,u).normalize(),h.push(p.x,p.y,p.z),d.push(g/i),d.push(_/n)}}for(let _=1;_<=n;_++)for(let m=1;m<=i;m++){let g=(i+1)*_+m-1,M=(i+1)*(_-1)+m-1,w=(i+1)*(_-1)+m,y=(i+1)*_+m;c.push(g,M,y),c.push(M,w,y)}this.setIndex(c),this.setAttribute("position",new Jt(l,3)),this.setAttribute("normal",new Jt(h,3)),this.setAttribute("uv",new Jt(d,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc,t.thetaStart,t.thetaLength)}};function ls(s){let t={};for(let e in s){t[e]={};for(let n in s[e]){let i=s[e][n];if(Sd(i))i.isRenderTargetTexture?(kt("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=i.clone();else if(Array.isArray(i))if(Sd(i[0])){let r=[];for(let a=0,o=i.length;a<o;a++)r[a]=i[a].clone();t[e][n]=r}else t[e][n]=i.slice();else t[e][n]=i}}return t}function nn(s){let t={};for(let e=0;e<s.length;e++){let n=ls(s[e]);for(let i in n)t[i]=n[i]}return t}function Sd(s){return s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)}function g0(s){let t=[];for(let e=0;e<s.length;e++)t.push(s[e].clone());return t}function Jh(s){let t=s.getRenderTarget();return t===null?s.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Qt.workingColorSpace}var xi={clone:ls,merge:nn},x0=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,_0=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Ee=class extends Vn{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=x0,this.fragmentShader=_0,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=ls(t.uniforms),this.uniformsGroups=g0(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this.defaultAttributeValues=Object.assign({},t.defaultAttributeValues),this.index0AttributeName=t.index0AttributeName,this.uniformsNeedUpdate=t.uniformsNeedUpdate,this}toJSON(t){let e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(let i in this.uniforms){let a=this.uniforms[i].value;a&&a.isTexture?e.uniforms[i]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[i]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[i]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[i]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[i]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[i]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[i]={type:"m4",value:a.toArray()}:e.uniforms[i]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;let n={};for(let i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}fromJSON(t,e){if(super.fromJSON(t,e),t.uniforms!==void 0)for(let n in t.uniforms){let i=t.uniforms[n];switch(this.uniforms[n]={},i.type){case"t":this.uniforms[n].value=e[i.value]||null;break;case"c":this.uniforms[n].value=new ht().setHex(i.value);break;case"v2":this.uniforms[n].value=new it().fromArray(i.value);break;case"v3":this.uniforms[n].value=new E().fromArray(i.value);break;case"v4":this.uniforms[n].value=new Ae().fromArray(i.value);break;case"m3":this.uniforms[n].value=new Wt().fromArray(i.value);break;case"m4":this.uniforms[n].value=new ce().fromArray(i.value);break;default:this.uniforms[n].value=i.value}}if(t.defines!==void 0&&(this.defines=t.defines),t.vertexShader!==void 0&&(this.vertexShader=t.vertexShader),t.fragmentShader!==void 0&&(this.fragmentShader=t.fragmentShader),t.glslVersion!==void 0&&(this.glslVersion=t.glslVersion),t.extensions!==void 0)for(let n in t.extensions)this.extensions[n]=t.extensions[n];return t.lights!==void 0&&(this.lights=t.lights),t.clipping!==void 0&&(this.clipping=t.clipping),this}},Zs=class extends Ee{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},ye=class extends Vn{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new ht(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ht(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Oa,this.normalScale=new it(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ei,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}},ma=class extends ye{constructor(t){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new it(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Kt(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new ht(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new ht(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new ht(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(t)}get anisotropy(){return this._anisotropy}set anisotropy(t){this._anisotropy>0!=t>0&&this.version++,this._anisotropy=t}get clearcoat(){return this._clearcoat}set clearcoat(t){this._clearcoat>0!=t>0&&this.version++,this._clearcoat=t}get iridescence(){return this._iridescence}set iridescence(t){this._iridescence>0!=t>0&&this.version++,this._iridescence=t}get dispersion(){return this._dispersion}set dispersion(t){this._dispersion>0!=t>0&&this.version++,this._dispersion=t}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(t){this._retroreflectivity>0!=t>0&&this.version++,this._retroreflectivity=t}get sheen(){return this._sheen}set sheen(t){this._sheen>0!=t>0&&this.version++,this._sheen=t}get transmission(){return this._transmission}set transmission(t){this._transmission>0!=t>0&&this.version++,this._transmission=t}copy(t){return super.copy(t),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=t.anisotropy,this.anisotropyRotation=t.anisotropyRotation,this.anisotropyMap=t.anisotropyMap,this.clearcoat=t.clearcoat,this.clearcoatMap=t.clearcoatMap,this.clearcoatRoughness=t.clearcoatRoughness,this.clearcoatRoughnessMap=t.clearcoatRoughnessMap,this.clearcoatNormalMap=t.clearcoatNormalMap,this.clearcoatNormalScale.copy(t.clearcoatNormalScale),this.dispersion=t.dispersion,this.ior=t.ior,this.iridescence=t.iridescence,this.iridescenceMap=t.iridescenceMap,this.iridescenceIOR=t.iridescenceIOR,this.iridescenceThicknessRange=[...t.iridescenceThicknessRange],this.iridescenceThicknessMap=t.iridescenceThicknessMap,this.retroreflectivity=t.retroreflectivity,this.sheen=t.sheen,this.sheenColor.copy(t.sheenColor),this.sheenColorMap=t.sheenColorMap,this.sheenRoughness=t.sheenRoughness,this.sheenRoughnessMap=t.sheenRoughnessMap,this.transmission=t.transmission,this.transmissionMap=t.transmissionMap,this.thickness=t.thickness,this.thicknessMap=t.thicknessMap,this.attenuationDistance=t.attenuationDistance,this.attenuationColor.copy(t.attenuationColor),this.specularIntensity=t.specularIntensity,this.specularIntensityMap=t.specularIntensityMap,this.specularColor.copy(t.specularColor),this.specularColorMap=t.specularColorMap,this}};var ga=class extends Vn{constructor(t){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new ht(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ht(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Oa,this.normalScale=new it(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ei,this.combine=yl,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.envMapIntensity=t.envMapIntensity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}},rl=class extends Vn{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Qd,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},al=class extends Vn{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}};function Ns(s,t){return!s||s.constructor===t?s:typeof t.BYTES_PER_ELEMENT=="number"?new t(s):Array.prototype.slice.call(s)}function _h(s){return s!==void 0&&s.inTangents!==void 0&&s.outTangents!==void 0}var Pi=class{constructor(t,e,n,i){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new e.constructor(n),this.sampleValues=e,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,n=this._cachedIndex,i=e[n],r=e[n-1];n:{t:{let a;e:{i:if(!(t<i)){for(let o=n+2;;){if(i===void 0){if(t<r)break i;return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(r=i,i=e[++n],t<i)break t}a=e.length;break e}if(!(t>=r)){let o=e[1];t<o&&(n=2,r=o);for(let c=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===c)break;if(i=r,r=e[--n-1],t>=r)break t}a=n,n=0;break e}break n}for(;n<a;){let o=n+a>>>1;t<e[o]?a=o:n=o+1}if(i=e[n],r=e[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===void 0)return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,i)}return this.interpolate_(n,r,t,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,n=this.sampleValues,i=this.valueSize,r=t*i;for(let a=0;a!==i;++a)e[a]=n[r+a];return e}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},ol=class extends Pi{constructor(t,e,n,i){super(t,e,n,i),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Mh,endingEnd:Mh}}intervalChanged_(t,e,n){let i=this.parameterPositions,r=t-2,a=t+1,o=i[r],c=i[a];if(o===void 0)switch(this.getSettings_().endingStart){case Sh:r=t,o=2*e-n;break;case bh:r=i.length-2,o=e+i[r]-i[r+1];break;default:r=t,o=n}if(c===void 0)switch(this.getSettings_().endingEnd){case Sh:a=t,c=2*n-e;break;case bh:a=1,c=n+i[1]-i[0];break;default:a=t-1,c=e}let l=(n-e)*.5,h=this.valueSize;this._weightPrev=l/(e-o),this._weightNext=l/(c-n),this._offsetPrev=r*h,this._offsetNext=a*h}interpolate_(t,e,n,i){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=t*o,l=c-o,h=this._offsetPrev,d=this._offsetNext,u=this._weightPrev,f=this._weightNext,p=(n-e)/(i-e),_=p*p,m=_*p,g=-u*m+2*u*_-u*p,M=(1+u)*m+(-1.5-2*u)*_+(-.5+u)*p+1,w=(-1-f)*m+(1.5+f)*_+.5*p,y=f*m-f*_;for(let T=0;T!==o;++T)r[T]=g*a[h+T]+M*a[l+T]+w*a[c+T]+y*a[d+T];return r}},ll=class extends Pi{constructor(t,e,n,i){super(t,e,n,i)}interpolate_(t,e,n,i){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=t*o,l=c-o,h=(n-e)/(i-e),d=1-h;for(let u=0;u!==o;++u)r[u]=a[l+u]*d+a[c+u]*h;return r}},cl=class extends Pi{constructor(t,e,n,i){super(t,e,n,i)}interpolate_(t){return this.copySampleValue_(t-1)}},hl=class extends Pi{interpolate_(t,e,n,i){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=t*o,l=c-o,h=this.inTangents,d=this.outTangents;if(!h||!d){let p=(n-e)/(i-e),_=1-p;for(let m=0;m!==o;++m)r[m]=a[l+m]*_+a[c+m]*p;return r}let u=o*2,f=t-1;for(let p=0;p!==o;++p){let _=a[l+p],m=a[c+p],g=f*u+p*2,M=d[g],w=d[g+1],y=t*u+p*2,T=h[y],b=h[y+1],P=y0(n,e,M,T,i);r[p]=_f(P,_,w,b,m)}return r}};function _f(s,t,e,n,i){let r=1-s;return r*r*r*t+3*r*r*s*e+3*r*s*s*n+s*s*s*i}function v0(s,t,e,n,i){let r=1-s;return 3*r*r*(e-t)+6*r*s*(n-e)+3*s*s*(i-n)}function y0(s,t,e,n,i){let r=(s-t)/(i-t);for(let a=0;a<8;a++){let o=_f(r,t,e,n,i)-s;if(Math.abs(o)<1e-10)break;let c=v0(r,t,e,n,i);if(Math.abs(c)<1e-10)break;r=Math.max(0,Math.min(1,r-o/c))}return r}var yn=class{constructor(t,e,n,i){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=Ns(e,this.TimeBufferType),this.values=Ns(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,n;if(e.toJSON!==this.toJSON)n=e.toJSON(t);else{n={name:t.name,times:Ns(t.times,Array),values:Ns(t.values,Array)};let i=t.getInterpolation();i!==t.DefaultInterpolation&&(n.interpolation=i),_h(t.settings)&&(n.settings={inTangents:Ns(t.settings.inTangents,Array),outTangents:Ns(t.settings.outTangents,Array)})}return n.type=t.ValueTypeName,n}InterpolantFactoryMethodDiscrete(t){return new cl(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new ll(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new ol(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodBezier(t){let e=new hl(this.times,this.values,this.getValueSize(),t);return this.settings&&(e.inTangents=this.settings.inTangents,e.outTangents=this.settings.outTangents),e}setInterpolation(t){let e;switch(t){case kr:e=this.InterpolantFactoryMethodDiscrete;break;case qo:e=this.InterpolantFactoryMethodLinear;break;case Fo:e=this.InterpolantFactoryMethodSmooth;break;case yh:e=this.InterpolantFactoryMethodBezier;break}if(e===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return kt("KeyframeTrack:",n),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return kr;case this.InterpolantFactoryMethodLinear:return qo;case this.InterpolantFactoryMethodSmooth:return Fo;case this.InterpolantFactoryMethodBezier:return yh}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let n=0,i=e.length;n!==i;++n)e[n]+=t}return this}scale(t){if(t!==1){let e=this.times;for(let n=0,i=e.length;n!==i;++n)e[n]*=t;_h(this.settings)&&(bd(this.settings.inTangents,t),bd(this.settings.outTangents,t))}return this}trim(t,e){let n=this.times,i=n.length,r=0,a=i-1;for(;r!==i&&n[r]<t;)++r;for(;a!==-1&&n[a]>e;)--a;if(++a,r!==0||a!==i){r>=a&&(a=Math.max(a,1),r=a-1);let o=this.getValueSize();this.times=n.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(Ht("KeyframeTrack: Invalid value size in track.",this),t=!1);let n=this.times,i=this.values,r=n.length;r===0&&(Ht("KeyframeTrack: Track is empty.",this),t=!1);let a=null;for(let o=0;o!==r;o++){let c=n[o];if(typeof c=="number"&&isNaN(c)){Ht("KeyframeTrack: Time is not a valid number.",this,o,c),t=!1;break}if(a!==null&&a>c){Ht("KeyframeTrack: Out of order keys.",this,o,c,a),t=!1;break}a=c}if(i!==void 0&&om(i))for(let o=0,c=i.length;o!==c;++o){let l=i[o];if(isNaN(l)){Ht("KeyframeTrack: Value is not a valid number.",this,o,l),t=!1;break}}return t}optimize(){let t=this.times.slice(),e=this.values.slice(),n=this.getValueSize(),i=this.getInterpolation()===Fo,r=t.length-1,a=1;for(let o=1;o<r;++o){let c=!1,l=t[o],h=t[o+1];if(l!==h&&(o!==1||l!==t[0]))if(i)c=!0;else{let d=o*n,u=d-n,f=d+n;for(let p=0;p!==n;++p){let _=e[d+p];if(_!==e[u+p]||_!==e[f+p]){c=!0;break}}}if(c){if(o!==a){t[a]=t[o];let d=o*n,u=a*n;for(let f=0;f!==n;++f)e[u+f]=e[d+f]}++a}}if(r>0){t[a]=t[r];for(let o=r*n,c=a*n,l=0;l!==n;++l)e[c+l]=e[o+l];++a}return a!==t.length?(this.times=t.slice(0,a),this.values=e.slice(0,a*n)):(this.times=t,this.values=e),this}clone(){let t=this.times.slice(),e=this.values.slice(),n=this.constructor,i=new n(this.name,t,e);return i.createInterpolant=this.createInterpolant,_h(this.settings)&&(i.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),i}};function bd(s,t){for(let e=0,n=s.length;e!==n;e+=2)s[e]*=t}yn.prototype.ValueTypeName="";yn.prototype.TimeBufferType=Float32Array;yn.prototype.ValueBufferType=Float32Array;yn.prototype.DefaultInterpolation=qo;var Ii=class extends yn{constructor(t,e,n){super(t,e,n)}};Ii.prototype.ValueTypeName="bool";Ii.prototype.ValueBufferType=Array;Ii.prototype.DefaultInterpolation=kr;Ii.prototype.InterpolantFactoryMethodLinear=void 0;Ii.prototype.InterpolantFactoryMethodSmooth=void 0;var ul=class extends yn{constructor(t,e,n,i){super(t,e,n,i)}};ul.prototype.ValueTypeName="color";var dl=class extends yn{constructor(t,e,n,i){super(t,e,n,i)}};dl.prototype.ValueTypeName="number";var fl=class extends Pi{constructor(t,e,n,i){super(t,e,n,i)}interpolate_(t,e,n,i){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=(n-e)/(i-e),l=t*o;for(let h=l+o;l!==h;l+=4)ae.slerpFlat(r,0,a,l-o,a,l,c);return r}},xa=class extends yn{constructor(t,e,n,i){super(t,e,n,i)}InterpolantFactoryMethodLinear(t){return new fl(this.times,this.values,this.getValueSize(),t)}};xa.prototype.ValueTypeName="quaternion";xa.prototype.InterpolantFactoryMethodSmooth=void 0;var Li=class extends yn{constructor(t,e,n){super(t,e,n)}};Li.prototype.ValueTypeName="string";Li.prototype.ValueBufferType=Array;Li.prototype.DefaultInterpolation=kr;Li.prototype.InterpolantFactoryMethodLinear=void 0;Li.prototype.InterpolantFactoryMethodSmooth=void 0;var pl=class extends yn{constructor(t,e,n,i){super(t,e,n,i)}};pl.prototype.ValueTypeName="vector";var ml=class{constructor(t,e,n){let i=this,r=!1,a=0,o=0,c,l=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this._abortController=null,this.itemStart=function(h){o++,r===!1&&i.onStart!==void 0&&i.onStart(h,a,o),r=!0},this.itemEnd=function(h){a++,i.onProgress!==void 0&&i.onProgress(h,a,o),a===o&&(r=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(h){i.onError!==void 0&&i.onError(h)},this.resolveURL=function(h){return h=h.normalize("NFC"),c?c(h):h},this.setURLModifier=function(h){return c=h,this},this.addHandler=function(h,d){return l.push(h,d),this},this.removeHandler=function(h){let d=l.indexOf(h);return d!==-1&&l.splice(d,2),this},this.getHandler=function(h){for(let d=0,u=l.length;d<u;d+=2){let f=l[d],p=l[d+1];if(f.global&&(f.lastIndex=0),f.test(h))return p}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},vf=new ml,gl=class{constructor(t){this.manager=t!==void 0?t:vf,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(t,e){let n=this;return new Promise(function(i,r){n.load(t,i,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}abort(){return this}};gl.DEFAULT_MATERIAL_NAME="__DEFAULT";var Ks=class extends Be{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new ht(t),this.intensity=e}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){let e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,e}},_a=class extends Ks{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Be.DEFAULT_UP),this.updateMatrix(),this.groundColor=new ht(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}toJSON(t){let e=super.toJSON(t);return e.object.groundColor=this.groundColor.getHex(),e}},vh=new ce,Td=new E,wd=new E,va=class{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new it(512,512),this.mapType=mn,this.map=null,this.mapPass=null,this.matrix=new ce,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Xs,this._frameExtents=new it(1,1),this._viewportCount=1,this._viewports=[new Ae(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(t){let e=this.camera;Td.setFromMatrixPosition(t.matrixWorld),e.position.copy(Td),wd.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(wd),e.updateMatrixWorld(),this._updateMatrix(e,this.matrix,this._frustum)}_updateMatrix(t,e,n,i){vh.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),n.setFromProjectionMatrix(vh,t.coordinateSystem,t.reversedDepth);let r=this._frameExtents,a=i?i.z/r.x:1,o=i?i.w/r.y:1,c=i?i.x/r.x:0,l=i?i.y/r.y:0;t.coordinateSystem===zs||t.reversedDepth?e.set(.5*a,0,0,.5*a+c,0,.5*o,0,.5*o+l,0,0,1,0,0,0,0,1):e.set(.5*a,0,0,.5*a+c,0,.5*o,0,.5*o+l,0,0,.5,.5,0,0,0,1),e.multiply(vh)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this.biasNode=t.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let t={};return t.intensity=this.intensity,t.bias=this.bias,t.normalBias=this.normalBias,t.radius=this.radius,t.blurSamples=this.blurSamples,t.mapSize=this.mapSize.toArray(),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}},No=new E,Uo=new ae,Jn=new E,ya=class extends Be{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ce,this.projectionMatrix=new ce,this.projectionMatrixInverse=new ce,this.coordinateSystem=zn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorld.decompose(No,Uo,Jn),Jn.x===1&&Jn.y===1&&Jn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(No,Uo,Jn.set(1,1,1)).invert()}updateWorldMatrix(t,e,n=!1){super.updateWorldMatrix(t,e,n),this.matrixWorld.decompose(No,Uo,Jn),Jn.x===1&&Jn.y===1&&Jn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(No,Uo,Jn.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},Ai=new E,Ed=new it,Ad=new it,Xe=class extends ya{constructor(t=50,e=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=.5*this.getFilmHeight()/t;this.fov=Vs*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(Fr*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Vs*2*Math.atan(Math.tan(Fr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Ai.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Ai.x,Ai.y).multiplyScalar(-t/Ai.z),Ai.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Ai.x,Ai.y).multiplyScalar(-t/Ai.z)}getViewSize(t,e){return this.getViewBounds(t,Ed,Ad),e.subVectors(Ad,Ed)}setViewOffset(t,e,n,i,r,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan(Fr*.5*this.fov)/this.zoom,n=2*e,i=this.aspect*n,r=-.5*i,a=this.view;if(this.view!==null&&this.view.enabled){let c=a.fullWidth,l=a.fullHeight;r+=a.offsetX*i/c,e-=a.offsetY*n/l,i*=a.width/c,n*=a.height/l}let o=this.filmOffset;o!==0&&(r+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}};var Ch=class extends va{constructor(){super(new Xe(90,1,.5,500)),this.isPointLightShadow=!0}},Ma=class extends Ks{constructor(t,e,n=0,i=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new Ch}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}toJSON(t){let e=super.toJSON(t);return e.object.distance=this.distance,e.object.decay=this.decay,e.object.shadow=this.shadow.toJSON(),e}},Di=class extends ya{constructor(t=-1,e=1,n=1,i=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=i,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,i,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2,r=n-t,a=n+t,o=i+e,c=i-e;if(this.view!==null&&this.view.enabled){let l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,a=r+l*this.view.width,o-=h*this.view.offsetY,c=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}},Ph=class extends va{constructor(){super(new Di(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Sa=class extends Ks{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Be.DEFAULT_UP),this.updateMatrix(),this.target=new Be,this.shadow=new Ph}dispose(){super.dispose(),this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}toJSON(t){let e=super.toJSON(t);return e.object.shadow=this.shadow.toJSON(),e.object.target=this.target.uuid,e}};var Us=-90,Fs=1,xl=class extends Be{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let i=new Xe(Us,Fs,t,e);i.layers=this.layers,this.add(i);let r=new Xe(Us,Fs,t,e);r.layers=this.layers,this.add(r);let a=new Xe(Us,Fs,t,e);a.layers=this.layers,this.add(a);let o=new Xe(Us,Fs,t,e);o.layers=this.layers,this.add(o);let c=new Xe(Us,Fs,t,e);c.layers=this.layers,this.add(c);let l=new Xe(Us,Fs,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){let t=this.coordinateSystem,e=this.children.concat(),[n,i,r,a,o,c]=e;for(let l of e)this.remove(l);if(t===zn)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===zs)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[r,a,o,c,l,h]=this.children,d=t.getRenderTarget(),u=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),p=t.xr.enabled;t.xr.enabled=!1;let _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let m=!1;t.isWebGLRenderer===!0?m=t.state.buffers.depth.getReversed():m=t.reversedDepthBuffer,t.setRenderTarget(n,0,i),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,r),t.setRenderTarget(n,1,i),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,a),t.setRenderTarget(n,2,i),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,o),t.setRenderTarget(n,3,i),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,c),t.setRenderTarget(n,4,i),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,l),n.texture.generateMipmaps=_,t.setRenderTarget(n,5,i),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,h),t.setRenderTarget(d,u,f),t.xr.enabled=p,n.texture.needsPMREMUpdate=!0}},_l=class extends Xe{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}},ba=class{constructor(){this._previousTime=0,this._currentTime=0,this._startTime=performance.now(),this._delta=0,this._elapsed=0,this._timescale=1,this._document=null,this._pageVisibilityHandler=null}connect(t){this._document=t,t.hidden!==void 0&&(this._pageVisibilityHandler=M0.bind(this),t.addEventListener("visibilitychange",this._pageVisibilityHandler,!1))}disconnect(){this._pageVisibilityHandler!==null&&(this._document.removeEventListener("visibilitychange",this._pageVisibilityHandler),this._pageVisibilityHandler=null),this._document=null}getDelta(){return this._delta/1e3}getElapsed(){return this._elapsed/1e3}getTimescale(){return this._timescale}setTimescale(t){return this._timescale=t,this}reset(){return this._currentTime=performance.now()-this._startTime,this}dispose(){this.disconnect()}update(t){return this._pageVisibilityHandler!==null&&this._document.hidden===!0?this._delta=0:(this._previousTime=this._currentTime,this._currentTime=(t!==void 0?t:performance.now())-this._startTime,this._delta=(this._currentTime-this._previousTime)*this._timescale,this._elapsed+=this._delta),this}};function M0(){this._document.hidden===!1&&this.reset()}var Zh="\\[\\]\\.:\\/",S0=new RegExp("["+Zh+"]","g"),Kh="[^"+Zh+"]",b0="[^"+Zh.replace("\\.","")+"]",T0=/((?:WC+[\/:])*)/.source.replace("WC",Kh),w0=/(WCOD+)?/.source.replace("WCOD",b0),E0=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Kh),A0=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Kh),R0=new RegExp("^"+T0+w0+E0+A0+"$"),C0=["material","materials","bones","map"],Ih=class{constructor(t,e,n){let i=n||Te.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,i)}getValue(t,e){this.bind();let n=this._targetGroup.nCachedObjects_,i=this._bindings[n];i!==void 0&&i.getValue(t,e)}setValue(t,e){let n=this._bindings;for(let i=this._targetGroup.nCachedObjects_,r=n.length;i!==r;++i)n[i].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].unbind()}},Te=class s{constructor(t,e,n){this.path=e,this.parsedPath=n||s.parseTrackName(e),this.node=s.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,n){return t&&t.isAnimationObjectGroup?new s.Composite(t,e,n):new s(t,e,n)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(S0,"")}static parseTrackName(t){let e=R0.exec(t);if(e===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+t);let n={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){let r=n.nodeName.substring(i+1);C0.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,i),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+t);return n}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let n=t.skeleton.getBoneByName(e);if(n!==void 0)return n}if(t.children){let n=function(r){for(let a=0;a<r.length;a++){let o=r[a];if(o.name===e||o.uuid===e)return o;let c=n(o.children);if(c)return c}return null},i=n(t.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)t[e++]=n[i]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,n=e.objectName,i=e.propertyName,r=e.propertyIndex;if(t||(t=s.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){kt("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let l=e.objectIndex;switch(n){case"materials":if(!t.material){Ht("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){Ht("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){Ht("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let h=0;h<t.length;h++)if(t[h].name===l){l=h;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){Ht("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){Ht("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[n]===void 0){Ht("PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[n]}if(l!==void 0){if(t[l]===void 0){Ht("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[l]}}let a=t[i];if(a===void 0){let l=e.nodeName;Ht("PropertyBinding: Trying to update property for track: "+l+"."+i+" but it wasn't found.",t);return}let o=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?o=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(r!==void 0){if(i==="morphTargetInfluences"){if(!t.geometry){Ht("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){Ht("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}c=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(c=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=i;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Te.Composite=Ih;Te.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Te.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Te.prototype.GetterByBindingType=[Te.prototype._getValue_direct,Te.prototype._getValue_array,Te.prototype._getValue_arrayElement,Te.prototype._getValue_toArray];Te.prototype.SetterByBindingTypeAndVersioning=[[Te.prototype._setValue_direct,Te.prototype._setValue_direct_setNeedsUpdate,Te.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Te.prototype._setValue_array,Te.prototype._setValue_array_setNeedsUpdate,Te.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Te.prototype._setValue_arrayElement,Te.prototype._setValue_arrayElement_setNeedsUpdate,Te.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Te.prototype._setValue_fromArray,Te.prototype._setValue_fromArray_setNeedsUpdate,Te.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var nM=new Float32Array(1);var iu=class iu{constructor(t,e,n,i){this.elements=[1,0,0,1],t!==void 0&&this.set(t,e,n,i)}identity(){return this.set(1,0,0,1),this}fromArray(t,e=0){for(let n=0;n<4;n++)this.elements[n]=t[n+e];return this}set(t,e,n,i){let r=this.elements;return r[0]=t,r[2]=e,r[1]=n,r[3]=i,this}};iu.prototype.isMatrix2=!0;var Lh=iu;function Qh(s,t,e,n){let i=P0(n);switch(e){case Gh:return s*t;case Al:return s*t/i.components*i.byteLength;case Rl:return s*t/i.components*i.byteLength;case zi:return s*t*2/i.components*i.byteLength;case Cl:return s*t*2/i.components*i.byteLength;case Wh:return s*t*3/i.components*i.byteLength;case Cn:return s*t*4/i.components*i.byteLength;case Pl:return s*t*4/i.components*i.byteLength;case La:case Da:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*8;case Na:case Ua:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case Ll:case Nl:return Math.max(s,16)*Math.max(t,8)/4;case Il:case Dl:return Math.max(s,8)*Math.max(t,8)/2;case Ul:case Fl:case Ol:case zl:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*8;case Bl:case Fa:case kl:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case Vl:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case Hl:return Math.floor((s+4)/5)*Math.floor((t+3)/4)*16;case Gl:return Math.floor((s+4)/5)*Math.floor((t+4)/5)*16;case Wl:return Math.floor((s+5)/6)*Math.floor((t+4)/5)*16;case Xl:return Math.floor((s+5)/6)*Math.floor((t+5)/6)*16;case ql:return Math.floor((s+7)/8)*Math.floor((t+4)/5)*16;case Yl:return Math.floor((s+7)/8)*Math.floor((t+5)/6)*16;case $l:return Math.floor((s+7)/8)*Math.floor((t+7)/8)*16;case Jl:return Math.floor((s+9)/10)*Math.floor((t+4)/5)*16;case Zl:return Math.floor((s+9)/10)*Math.floor((t+5)/6)*16;case Kl:return Math.floor((s+9)/10)*Math.floor((t+7)/8)*16;case Ql:return Math.floor((s+9)/10)*Math.floor((t+9)/10)*16;case jl:return Math.floor((s+11)/12)*Math.floor((t+9)/10)*16;case tc:return Math.floor((s+11)/12)*Math.floor((t+11)/12)*16;case ec:case nc:case ic:return Math.ceil(s/4)*Math.ceil(t/4)*16;case sc:case rc:return Math.ceil(s/4)*Math.ceil(t/4)*8;case Ba:case ac:return Math.ceil(s/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function P0(s){switch(s){case mn:case zh:return{byteLength:1,components:1};case js:case kh:case Ke:return{byteLength:2,components:1};case wl:case El:return{byteLength:2,components:4};case Wn:case Tl:case Rn:return{byteLength:4,components:1};case Vh:case Hh:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${s}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"186"}}));typeof window<"u"&&(window.__THREE__?kt("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="186");function Vf(){let s=null,t=!1,e=null,n=null;function i(r,a){n=s.requestAnimationFrame(i),e(r,a)}return{start:function(){t!==!0&&e!==null&&s!==null&&(n=s.requestAnimationFrame(i),t=!0)},stop:function(){s!==null&&s.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){s=r}}}function L0(s){let t=new WeakMap;function e(o,c){let l=o.array,h=o.usage,d=l.byteLength,u=s.createBuffer();s.bindBuffer(c,u),s.bufferData(c,l,h),o.onUploadCallback();let f;if(l instanceof Float32Array)f=s.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)f=s.HALF_FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?f=s.HALF_FLOAT:f=s.UNSIGNED_SHORT;else if(l instanceof Int16Array)f=s.SHORT;else if(l instanceof Uint32Array)f=s.UNSIGNED_INT;else if(l instanceof Int32Array)f=s.INT;else if(l instanceof Int8Array)f=s.BYTE;else if(l instanceof Uint8Array)f=s.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)f=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:u,type:f,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:d}}function n(o,c,l){let h=c.array,d=c.updateRanges;if(s.bindBuffer(l,o),d.length===0)s.bufferSubData(l,0,h);else{d.sort((f,p)=>f.start-p.start);let u=0;for(let f=1;f<d.length;f++){let p=d[u],_=d[f];_.start<=p.start+p.count+1?p.count=Math.max(p.count,_.start+_.count-p.start):(++u,d[u]=_)}d.length=u+1;for(let f=0,p=d.length;f<p;f++){let _=d[f];s.bufferSubData(l,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}c.clearUpdateRanges()}c.onUploadCallback()}function i(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);let c=t.get(o);c&&(s.deleteBuffer(c.buffer),t.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){let h=t.get(o);(!h||h.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}let l=t.get(o);if(l===void 0)t.set(o,e(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,o,c),l.version=o.version}}return{get:i,remove:r,update:a}}var D0=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,N0=`#ifdef USE_ALPHAHASH
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
#endif`,U0=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,F0=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,B0=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,O0=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,z0=`#ifdef USE_AOMAP
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
#endif`,k0=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,V0=`#ifdef USE_BATCHING
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
#endif`,H0=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,G0=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,W0=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,X0=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,q0=`#ifdef USE_IRIDESCENCE
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
#endif`,Y0=`#ifdef USE_BUMPMAP
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
#endif`,$0=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,J0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Z0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,K0=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Q0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,j0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,tg=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,eg=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,ng=`#define PI 3.141592653589793
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
} // validated`,ig=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,sg=`vec3 transformedNormal = objectNormal;
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
#endif`,rg=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,ag=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,og=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,lg=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,cg="gl_FragColor = linearToOutputTexel( gl_FragColor );",hg=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,ug=`#ifdef USE_ENVMAP
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
#endif`,dg=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,fg=`#ifdef USE_ENVMAP
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
#endif`,pg=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,mg=`#ifdef USE_ENVMAP
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
#endif`,gg=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,xg=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,_g=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,vg=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,yg=`#ifdef USE_GRADIENTMAP
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
}`,Mg=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Sg=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,bg=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Tg=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,wg=`#ifdef USE_ENVMAP
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
#endif`,Eg=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Ag=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Rg=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Cg=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Pg=`PhysicalMaterial material;
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
#endif`,Ig=`uniform sampler2D dfgLUT;
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
}`,Lg=`
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
#endif`,Dg=`#if defined( RE_IndirectDiffuse )
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
#endif`,Ng=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Ug=`#ifdef USE_LIGHT_PROBES_GRID
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
#endif`,Fg=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Bg=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Og=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,zg=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,kg=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Vg=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Hg=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Gg=`#if defined( USE_POINTS_UV )
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
#endif`,Wg=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Xg=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,qg=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Yg=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,$g=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Jg=`#ifdef USE_MORPHTARGETS
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
#endif`,Zg=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Kg=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Qg=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,jg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,tx=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,ex=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,nx=`#ifdef USE_NORMALMAP
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
#endif`,ix=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,sx=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,rx=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,ax=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,ox=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,lx=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,cx=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,hx=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,ux=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,dx=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,fx=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,px=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,mx=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,gx=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,xx=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,_x=`float getShadowMask() {
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
}`,vx=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,yx=`#ifdef USE_SKINNING
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
#endif`,Mx=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Sx=`#ifdef USE_SKINNING
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
#endif`,bx=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Tx=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,wx=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Ex=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Ax=`#ifdef USE_TRANSMISSION
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
#endif`,Rx=`#ifdef USE_TRANSMISSION
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
#endif`,Cx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Px=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Ix=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Lx=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,Dx=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Nx=`uniform sampler2D t2D;
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
}`,Ux=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Fx=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Bx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Ox=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,zx=`#include <common>
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
}`,kx=`#if DEPTH_PACKING == 3200
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
}`,Vx=`#define DISTANCE
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
}`,Hx=`#define DISTANCE
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
}`,Gx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Wx=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Xx=`uniform float scale;
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
}`,qx=`uniform vec3 diffuse;
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
}`,Yx=`#include <common>
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
}`,$x=`uniform vec3 diffuse;
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
}`,Jx=`#define LAMBERT
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
}`,Zx=`#define LAMBERT
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
}`,Kx=`#define MATCAP
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
}`,Qx=`#define MATCAP
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
}`,jx=`#define NORMAL
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
}`,t_=`#define NORMAL
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
}`,e_=`#define PHONG
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
}`,n_=`#define PHONG
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
}`,i_=`#define STANDARD
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
}`,s_=`#define STANDARD
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
}`,r_=`#define TOON
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
}`,a_=`#define TOON
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
}`,o_=`uniform float size;
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
}`,l_=`uniform vec3 diffuse;
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
}`,c_=`#include <common>
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
}`,h_=`uniform vec3 color;
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
}`,u_=`uniform float rotation;
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
}`,d_=`uniform vec3 diffuse;
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
}`,Zt={alphahash_fragment:D0,alphahash_pars_fragment:N0,alphamap_fragment:U0,alphamap_pars_fragment:F0,alphatest_fragment:B0,alphatest_pars_fragment:O0,aomap_fragment:z0,aomap_pars_fragment:k0,batching_pars_vertex:V0,batching_vertex:H0,begin_vertex:G0,beginnormal_vertex:W0,bsdfs:X0,iridescence_fragment:q0,bumpmap_pars_fragment:Y0,clipping_planes_fragment:$0,clipping_planes_pars_fragment:J0,clipping_planes_pars_vertex:Z0,clipping_planes_vertex:K0,color_fragment:Q0,color_pars_fragment:j0,color_pars_vertex:tg,color_vertex:eg,common:ng,cube_uv_reflection_fragment:ig,defaultnormal_vertex:sg,displacementmap_pars_vertex:rg,displacementmap_vertex:ag,emissivemap_fragment:og,emissivemap_pars_fragment:lg,colorspace_fragment:cg,colorspace_pars_fragment:hg,envmap_fragment:ug,envmap_common_pars_fragment:dg,envmap_pars_fragment:fg,envmap_pars_vertex:pg,envmap_physical_pars_fragment:wg,envmap_vertex:mg,fog_vertex:gg,fog_pars_vertex:xg,fog_fragment:_g,fog_pars_fragment:vg,gradientmap_pars_fragment:yg,lightmap_pars_fragment:Mg,lights_lambert_fragment:Sg,lights_lambert_pars_fragment:bg,lights_pars_begin:Tg,lights_toon_fragment:Eg,lights_toon_pars_fragment:Ag,lights_phong_fragment:Rg,lights_phong_pars_fragment:Cg,lights_physical_fragment:Pg,lights_physical_pars_fragment:Ig,lights_fragment_begin:Lg,lights_fragment_maps:Dg,lights_fragment_end:Ng,lightprobes_pars_fragment:Ug,logdepthbuf_fragment:Fg,logdepthbuf_pars_fragment:Bg,logdepthbuf_pars_vertex:Og,logdepthbuf_vertex:zg,map_fragment:kg,map_pars_fragment:Vg,map_particle_fragment:Hg,map_particle_pars_fragment:Gg,metalnessmap_fragment:Wg,metalnessmap_pars_fragment:Xg,morphinstance_vertex:qg,morphcolor_vertex:Yg,morphnormal_vertex:$g,morphtarget_pars_vertex:Jg,morphtarget_vertex:Zg,normal_fragment_begin:Kg,normal_fragment_maps:Qg,normal_pars_fragment:jg,normal_pars_vertex:tx,normal_vertex:ex,normalmap_pars_fragment:nx,clearcoat_normal_fragment_begin:ix,clearcoat_normal_fragment_maps:sx,clearcoat_pars_fragment:rx,iridescence_pars_fragment:ax,opaque_fragment:ox,packing:lx,premultiplied_alpha_fragment:cx,project_vertex:hx,dithering_fragment:ux,dithering_pars_fragment:dx,roughnessmap_fragment:fx,roughnessmap_pars_fragment:px,shadowmap_pars_fragment:mx,shadowmap_pars_vertex:gx,shadowmap_vertex:xx,shadowmask_pars_fragment:_x,skinbase_vertex:vx,skinning_pars_vertex:yx,skinning_vertex:Mx,skinnormal_vertex:Sx,specularmap_fragment:bx,specularmap_pars_fragment:Tx,tonemapping_fragment:wx,tonemapping_pars_fragment:Ex,transmission_fragment:Ax,transmission_pars_fragment:Rx,uv_pars_fragment:Cx,uv_pars_vertex:Px,uv_vertex:Ix,worldpos_vertex:Lx,background_vert:Dx,background_frag:Nx,backgroundCube_vert:Ux,backgroundCube_frag:Fx,cube_vert:Bx,cube_frag:Ox,depth_vert:zx,depth_frag:kx,distance_vert:Vx,distance_frag:Hx,equirect_vert:Gx,equirect_frag:Wx,linedashed_vert:Xx,linedashed_frag:qx,meshbasic_vert:Yx,meshbasic_frag:$x,meshlambert_vert:Jx,meshlambert_frag:Zx,meshmatcap_vert:Kx,meshmatcap_frag:Qx,meshnormal_vert:jx,meshnormal_frag:t_,meshphong_vert:e_,meshphong_frag:n_,meshphysical_vert:i_,meshphysical_frag:s_,meshtoon_vert:r_,meshtoon_frag:a_,points_vert:o_,points_frag:l_,shadow_vert:c_,shadow_frag:h_,sprite_vert:u_,sprite_frag:d_},vt={common:{diffuse:{value:new ht(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Wt},alphaMap:{value:null},alphaMapTransform:{value:new Wt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Wt}},envmap:{envMap:{value:null},envMapRotation:{value:new Wt},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Wt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Wt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Wt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Wt},normalScale:{value:new it(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Wt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Wt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Wt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Wt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ht(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new E},probesMax:{value:new E},probesResolution:{value:new E}},points:{diffuse:{value:new ht(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Wt},alphaTest:{value:0},uvTransform:{value:new Wt}},sprite:{diffuse:{value:new ht(16777215)},opacity:{value:1},center:{value:new it(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Wt},alphaMap:{value:null},alphaMapTransform:{value:new Wt},alphaTest:{value:0}}},ri={basic:{uniforms:nn([vt.common,vt.specularmap,vt.envmap,vt.aomap,vt.lightmap,vt.fog]),vertexShader:Zt.meshbasic_vert,fragmentShader:Zt.meshbasic_frag},lambert:{uniforms:nn([vt.common,vt.specularmap,vt.envmap,vt.aomap,vt.lightmap,vt.emissivemap,vt.bumpmap,vt.normalmap,vt.displacementmap,vt.fog,vt.lights,{emissive:{value:new ht(0)},envMapIntensity:{value:1}}]),vertexShader:Zt.meshlambert_vert,fragmentShader:Zt.meshlambert_frag},phong:{uniforms:nn([vt.common,vt.specularmap,vt.envmap,vt.aomap,vt.lightmap,vt.emissivemap,vt.bumpmap,vt.normalmap,vt.displacementmap,vt.fog,vt.lights,{emissive:{value:new ht(0)},specular:{value:new ht(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Zt.meshphong_vert,fragmentShader:Zt.meshphong_frag},standard:{uniforms:nn([vt.common,vt.envmap,vt.aomap,vt.lightmap,vt.emissivemap,vt.bumpmap,vt.normalmap,vt.displacementmap,vt.roughnessmap,vt.metalnessmap,vt.fog,vt.lights,{emissive:{value:new ht(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Zt.meshphysical_vert,fragmentShader:Zt.meshphysical_frag},toon:{uniforms:nn([vt.common,vt.aomap,vt.lightmap,vt.emissivemap,vt.bumpmap,vt.normalmap,vt.displacementmap,vt.gradientmap,vt.fog,vt.lights,{emissive:{value:new ht(0)}}]),vertexShader:Zt.meshtoon_vert,fragmentShader:Zt.meshtoon_frag},matcap:{uniforms:nn([vt.common,vt.bumpmap,vt.normalmap,vt.displacementmap,vt.fog,{matcap:{value:null}}]),vertexShader:Zt.meshmatcap_vert,fragmentShader:Zt.meshmatcap_frag},points:{uniforms:nn([vt.points,vt.fog]),vertexShader:Zt.points_vert,fragmentShader:Zt.points_frag},dashed:{uniforms:nn([vt.common,vt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Zt.linedashed_vert,fragmentShader:Zt.linedashed_frag},depth:{uniforms:nn([vt.common,vt.displacementmap]),vertexShader:Zt.depth_vert,fragmentShader:Zt.depth_frag},normal:{uniforms:nn([vt.common,vt.bumpmap,vt.normalmap,vt.displacementmap,{opacity:{value:1}}]),vertexShader:Zt.meshnormal_vert,fragmentShader:Zt.meshnormal_frag},sprite:{uniforms:nn([vt.sprite,vt.fog]),vertexShader:Zt.sprite_vert,fragmentShader:Zt.sprite_frag},background:{uniforms:{uvTransform:{value:new Wt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Zt.background_vert,fragmentShader:Zt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Wt}},vertexShader:Zt.backgroundCube_vert,fragmentShader:Zt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Zt.cube_vert,fragmentShader:Zt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Zt.equirect_vert,fragmentShader:Zt.equirect_frag},distance:{uniforms:nn([vt.common,vt.displacementmap,{referencePosition:{value:new E},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Zt.distance_vert,fragmentShader:Zt.distance_frag},shadow:{uniforms:nn([vt.lights,vt.fog,{color:{value:new ht(0)},opacity:{value:1}}]),vertexShader:Zt.shadow_vert,fragmentShader:Zt.shadow_frag}};ri.physical={uniforms:nn([ri.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Wt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Wt},clearcoatNormalScale:{value:new it(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Wt},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Wt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Wt},sheen:{value:0},sheenColor:{value:new ht(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Wt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Wt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Wt},transmissionSamplerSize:{value:new it},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Wt},attenuationDistance:{value:0},attenuationColor:{value:new ht(0)},specularColor:{value:new ht(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Wt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Wt},anisotropyVector:{value:new it},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Wt}}]),vertexShader:Zt.meshphysical_vert,fragmentShader:Zt.meshphysical_frag};var cc={r:0,b:0,g:0},f_=new ce,Hf=new Wt;Hf.set(-1,0,0,0,1,0,0,0,1);function p_(s,t,e,n,i,r){let a=new ht(0),o=i===!0?0:1,c,l,h=null,d=0,u=null;function f(M){let w=M.isScene===!0?M.background:null;if(w&&w.isTexture){let y=M.backgroundBlurriness>0;w=t.get(w,y)}return w}function p(M){let w=!1,y=f(M);y===null?m(a,o):y&&y.isColor&&(m(y,1),w=!0);let T=s.xr.getEnvironmentBlendMode();T==="additive"?e.buffers.color.setClear(0,0,0,1,r):T==="alpha-blend"&&e.buffers.color.setClear(0,0,0,0,r),(s.autoClear||w)&&(e.buffers.depth.setTest(!0),e.buffers.depth.setMask(!0),e.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function _(M,w){let y=f(w);y&&(y.isCubeTexture||y.mapping===Pa)?(l===void 0&&(l=new Tt(new ve(1,1,1),new Ee({name:"BackgroundCubeMaterial",uniforms:ls(ri.backgroundCube.uniforms),vertexShader:ri.backgroundCube.vertexShader,fragmentShader:ri.backgroundCube.fragmentShader,side:Oe,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),l.geometry.deleteAttribute("uv"),l.onBeforeRender=function(T,b,P){this.matrixWorld.copyPosition(P.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(l)),l.material.uniforms.envMap.value=y,l.material.uniforms.backgroundBlurriness.value=w.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(f_.makeRotationFromEuler(w.backgroundRotation)).transpose(),y.isCubeTexture&&y.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(Hf),l.material.toneMapped=Qt.getTransfer(y.colorSpace)!==oe,(h!==y||d!==y.version||u!==s.toneMapping)&&(l.material.needsUpdate=!0,h=y,d=y.version,u=s.toneMapping),l.layers.enableAll(),M.unshift(l,l.geometry,l.material,0,0,null)):y&&y.isTexture&&(c===void 0&&(c=new Tt(new fn(2,2),new Ee({name:"BackgroundMaterial",uniforms:ls(ri.background.uniforms),vertexShader:ri.background.vertexShader,fragmentShader:ri.background.fragmentShader,side:Ni,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(c)),c.material.uniforms.t2D.value=y,c.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,c.material.toneMapped=Qt.getTransfer(y.colorSpace)!==oe,y.matrixAutoUpdate===!0&&y.updateMatrix(),c.material.uniforms.uvTransform.value.copy(y.matrix),(h!==y||d!==y.version||u!==s.toneMapping)&&(c.material.needsUpdate=!0,h=y,d=y.version,u=s.toneMapping),c.layers.enableAll(),M.unshift(c,c.geometry,c.material,0,0,null))}function m(M,w){M.getRGB(cc,Jh(s)),e.buffers.color.setClear(cc.r,cc.g,cc.b,w,r)}function g(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return a},setClearColor:function(M,w=1){a.set(M),o=w,m(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(M){o=M,m(a,o)},render:p,addToRenderList:_,dispose:g}}function m_(s,t){let e=s.getParameter(s.MAX_VERTEX_ATTRIBS),n={},i=u(null),r=i,a=!1;function o(N,O,L,C,F){let k=!1,V=d(N,C,L,O);r!==V&&(r=V,l(r.object)),k=f(N,C,L,F),k&&p(N,C,L,F),F!==null&&t.update(F,s.ELEMENT_ARRAY_BUFFER),(k||a)&&(a=!1,y(N,O,L,C),F!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,t.get(F).buffer))}function c(){return s.createVertexArray()}function l(N){return s.bindVertexArray(N)}function h(N){return s.deleteVertexArray(N)}function d(N,O,L,C){let F=C.wireframe===!0,k=n[O.id];k===void 0&&(k={},n[O.id]=k);let V=N.isInstancedMesh===!0?N.id:0,j=k[V];j===void 0&&(j={},k[V]=j);let q=j[L.id];q===void 0&&(q={},j[L.id]=q);let Z=q[F];return Z===void 0&&(Z=u(c()),q[F]=Z),Z}function u(N){let O=[],L=[],C=[];for(let F=0;F<e;F++)O[F]=0,L[F]=0,C[F]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:O,enabledAttributes:L,attributeDivisors:C,object:N,attributes:{},index:null}}function f(N,O,L,C){let F=r.attributes,k=O.attributes,V=0,j=L.getAttributes();for(let q in j)if(j[q].location>=0){let K=F[q],At=k[q];if(At===void 0&&(q==="instanceMatrix"&&N.instanceMatrix&&(At=N.instanceMatrix),q==="instanceColor"&&N.instanceColor&&(At=N.instanceColor)),K===void 0||K.attribute!==At||At&&K.data!==At.data)return!0;V++}return r.attributesNum!==V||r.index!==C}function p(N,O,L,C){let F={},k=O.attributes,V=0,j=L.getAttributes();for(let q in j)if(j[q].location>=0){let K=k[q];K===void 0&&(q==="instanceMatrix"&&N.instanceMatrix&&(K=N.instanceMatrix),q==="instanceColor"&&N.instanceColor&&(K=N.instanceColor));let At={};At.attribute=K,K&&K.data&&(At.data=K.data),F[q]=At,V++}r.attributes=F,r.attributesNum=V,r.index=C}function _(){let N=r.newAttributes;for(let O=0,L=N.length;O<L;O++)N[O]=0}function m(N){g(N,0)}function g(N,O){let L=r.newAttributes,C=r.enabledAttributes,F=r.attributeDivisors;L[N]=1,C[N]===0&&(s.enableVertexAttribArray(N),C[N]=1),F[N]!==O&&(s.vertexAttribDivisor(N,O),F[N]=O)}function M(){let N=r.newAttributes,O=r.enabledAttributes;for(let L=0,C=O.length;L<C;L++)O[L]!==N[L]&&(s.disableVertexAttribArray(L),O[L]=0)}function w(N,O,L,C,F,k,V){V===!0?s.vertexAttribIPointer(N,O,L,F,k):s.vertexAttribPointer(N,O,L,C,F,k)}function y(N,O,L,C){_();let F=C.attributes,k=L.getAttributes(),V=O.defaultAttributeValues;for(let j in k){let q=k[j];if(q.location>=0){let Z=F[j];if(Z===void 0&&(j==="instanceMatrix"&&N.instanceMatrix&&(Z=N.instanceMatrix),j==="instanceColor"&&N.instanceColor&&(Z=N.instanceColor)),Z!==void 0){let K=Z.normalized,At=Z.itemSize,yt=t.get(Z);if(yt===void 0)continue;let se=yt.buffer,Yt=yt.type,ne=yt.bytesPerElement,Y=Yt===s.INT||Yt===s.UNSIGNED_INT||Z.gpuType===Tl;if(Z.isInterleavedBufferAttribute){let tt=Z.data,xt=tt.stride,Bt=Z.offset;if(tt.isInstancedInterleavedBuffer){for(let wt=0;wt<q.locationSize;wt++)g(q.location+wt,tt.meshPerAttribute);N.isInstancedMesh!==!0&&C._maxInstanceCount===void 0&&(C._maxInstanceCount=tt.meshPerAttribute*tt.count)}else for(let wt=0;wt<q.locationSize;wt++)m(q.location+wt);s.bindBuffer(s.ARRAY_BUFFER,se);for(let wt=0;wt<q.locationSize;wt++)w(q.location+wt,At/q.locationSize,Yt,K,xt*ne,(Bt+At/q.locationSize*wt)*ne,Y)}else{if(Z.isInstancedBufferAttribute){for(let tt=0;tt<q.locationSize;tt++)g(q.location+tt,Z.meshPerAttribute);N.isInstancedMesh!==!0&&C._maxInstanceCount===void 0&&(C._maxInstanceCount=Z.meshPerAttribute*Z.count)}else for(let tt=0;tt<q.locationSize;tt++)m(q.location+tt);s.bindBuffer(s.ARRAY_BUFFER,se);for(let tt=0;tt<q.locationSize;tt++)w(q.location+tt,At/q.locationSize,Yt,K,At*ne,At/q.locationSize*tt*ne,Y)}}else if(V!==void 0){let K=V[j];if(K!==void 0)switch(K.length){case 2:s.vertexAttrib2fv(q.location,K);break;case 3:s.vertexAttrib3fv(q.location,K);break;case 4:s.vertexAttrib4fv(q.location,K);break;default:s.vertexAttrib1fv(q.location,K)}}}}M()}function T(){A();for(let N in n){let O=n[N];for(let L in O){let C=O[L];for(let F in C){let k=C[F];for(let V in k)h(k[V].object),delete k[V];delete C[F]}}delete n[N]}}function b(N){if(n[N.id]===void 0)return;let O=n[N.id];for(let L in O){let C=O[L];for(let F in C){let k=C[F];for(let V in k)h(k[V].object),delete k[V];delete C[F]}}delete n[N.id]}function P(N){for(let O in n){let L=n[O];for(let C in L){let F=L[C];if(F[N.id]===void 0)continue;let k=F[N.id];for(let V in k)h(k[V].object),delete k[V];delete F[N.id]}}}function v(N){for(let O in n){let L=n[O],C=N.isInstancedMesh===!0?N.id:0,F=L[C];if(F!==void 0){for(let k in F){let V=F[k];for(let j in V)h(V[j].object),delete V[j];delete F[k]}delete L[C],Object.keys(L).length===0&&delete n[O]}}}function A(){I(),a=!0,r!==i&&(r=i,l(r.object))}function I(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:o,reset:A,resetDefaultState:I,dispose:T,releaseStatesOfGeometry:b,releaseStatesOfObject:v,releaseStatesOfProgram:P,initAttributes:_,enableAttribute:m,disableUnusedAttributes:M}}function g_(s,t,e){let n;function i(c){n=c}function r(c,l){s.drawArrays(n,c,l),e.update(l,n,1)}function a(c,l,h){h!==0&&(s.drawArraysInstanced(n,c,l,h),e.update(l,n,h))}function o(c,l,h){if(h===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,l,0,h);let u=0;for(let f=0;f<h;f++)u+=l[f];e.update(u,n,1)}this.setMode=i,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function x_(s,t,e,n){let i;function r(){if(i!==void 0)return i;if(t.has("EXT_texture_filter_anisotropic")===!0){let P=t.get("EXT_texture_filter_anisotropic");i=s.getParameter(P.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function a(P){return!(P!==Cn&&n.convert(P)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(P){let v=P===Ke&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(P!==mn&&P!==Rn&&!v&&n.convert(P)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE))}function c(P){if(P==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";P="mediump"}return P==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp",h=c(l);h!==l&&(kt("WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);let d=e.logarithmicDepthBuffer===!0,u=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control");e.reversedDepthBuffer===!0&&u===!1&&kt("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");let f=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),p=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=s.getParameter(s.MAX_TEXTURE_SIZE),m=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),g=s.getParameter(s.MAX_VERTEX_ATTRIBS),M=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),w=s.getParameter(s.MAX_VARYING_VECTORS),y=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),T=s.getParameter(s.MAX_SAMPLES),b=s.getParameter(s.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:d,reversedDepthBuffer:u,maxTextures:f,maxVertexTextures:p,maxTextureSize:_,maxCubemapSize:m,maxAttributes:g,maxVertexUniforms:M,maxVaryings:w,maxFragmentUniforms:y,maxSamples:T,samples:b}}function __(s){let t=this,e=null,n=0,i=!1,r=!1,a=new Bn,o=new Wt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(d,u){let f=d.length!==0||u||n!==0||i;return i=u,n=d.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,u){e=h(d,u,0)},this.setState=function(d,u,f){let p=d.clippingPlanes,_=d.clipIntersection,m=d.clipShadows,g=s.get(d);if(!i||p===null||p.length===0||r&&!m)r?h(null):l();else{let M=r?0:n,w=M*4,y=g.clippingState||null;c.value=y,y=h(p,u,w,f);for(let T=0;T!==w;++T)y[T]=e[T];g.clippingState=y,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=M}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(d,u,f,p){let _=d!==null?d.length:0,m=null;if(_!==0){if(m=c.value,p!==!0||m===null){let g=f+_*4,M=u.matrixWorldInverse;o.getNormalMatrix(M),(m===null||m.length<g)&&(m=new Float32Array(g));for(let w=0,y=f;w!==_;++w,y+=4)a.copy(d[w]).applyMatrix4(M,o),a.normal.toArray(m,y),m[y+3]=a.constant}c.value=m,c.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,m}}var ir=4,v_=6,y_=20,M_=256,za=new Di,yf=new ht,su=null,ru=0,au=0,ou=!1,S_=new E,cs=new E,rr=class{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(t,e=0,n=.1,i=100,r={}){let{size:a=256,position:o=S_}=r;su=this._renderer.getRenderTarget(),ru=this._renderer.getActiveCubeFace(),au=this._renderer.getActiveMipmapLevel(),ou=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(t,n,i,c,o),e>0&&this._blur(c,0,0,e),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=bf(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Sf(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodMeshes.length;t++)this._lodMeshes[t].geometry.dispose()}_cleanup(t){this._renderer.setRenderTarget(su,ru,au),this._renderer.xr.enabled=ou,t.scissorTest=!1,nr(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Fi||t.mapping===os?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),su=this._renderer.getRenderTarget(),ru=this._renderer.getActiveCubeFace(),au=this._renderer.getActiveMipmapLevel(),ou=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:Ze,minFilter:Ze,generateMipmaps:!1,type:Ke,format:Cn,colorSpace:Vr,depthBuffer:!1},i=Mf(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Mf(t,e,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=b_(r)),this._blurMaterial=w_(r,t,e),this._ggxMaterial=T_(r,t,e)}return i}_compileMaterial(t){let e=new Tt(new _e,t);this._renderer.compile(e,za)}_sceneToCubeUV(t,e,n,i,r){let c=new Xe(90,1,e,n),l=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],d=this._renderer,u=d.autoClear,f=d.toneMapping;d.getClearColor(yf),d.toneMapping=Gn,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(i),d.clearDepth(),d.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Tt(new ve,new we({name:"PMREM.Background",side:Oe,depthWrite:!1,depthTest:!1})));let _=this._backgroundBox,m=_.material,g=!1,M=t.background;M?M.isColor&&(m.color.copy(M),t.background=null,g=!0):(m.color.copy(yf),g=!0);for(let w=0;w<6;w++){let y=w%3;y===0?(c.up.set(0,l[w],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x+h[w],r.y,r.z)):y===1?(c.up.set(0,0,l[w]),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y+h[w],r.z)):(c.up.set(0,l[w],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y,r.z+h[w]));let T=this._cubeSize;nr(i,y*T,w>2?T:0,T,T),d.setRenderTarget(i),g&&d.render(_,c),d.render(t,c)}d.toneMapping=f,d.autoClear=u,t.background=M}_textureToCubeUV(t,e){let n=this._renderer,i=t.mapping===Fi||t.mapping===os;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=bf()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Sf());let r=i?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;let o=r.uniforms;o.envMap.value=t;let c=this._cubeSize;nr(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(a,za)}_applyPMREM(t){let e=this._renderer,n=e.autoClear;e.autoClear=!1;let i=this._lodMeshes.length;for(let r=1;r<i;r++)this._applyGGXFilter(t,r-1,r);e.autoClear=n}_applyGGXFilter(t,e,n){let i=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;let c=a.uniforms,l=n/(this._lodMeshes.length-1),h=e/(this._lodMeshes.length-1),d=Math.sqrt(l*l-h*h),u=l*1.25,f=d*u,{_lodMax:p}=this,_=this._sizeLods[n],m=3*_*(n>p-ir?n-p+ir:0),g=4*(this._cubeSize-_);c.envMap.value=t.texture,c.roughness.value=f,c.mipInt.value=p-e,nr(r,m,g,3*_,2*_),i.setRenderTarget(r),i.render(o,za),c.envMap.value=r.texture,c.roughness.value=0,c.mipInt.value=p-n,nr(t,m,g,3*_,2*_),i.setRenderTarget(t),i.render(o,za)}_blur(t,e,n,i){let r=this._pingPongRenderTarget,a=Math.min(i,Math.PI)/Math.SQRT2;this._blurPass(t,r,e,n,a),this._blurPass(r,t,n,n,a)}_blurPass(t,e,n,i,r){let a=this._renderer,o=this._blurMaterial,c=this._lodMeshes[i];c.material=o;let l=o.uniforms;l.envMap.value=t.texture,l.sigma.value=r,l.mipInt.value=this._lodMax-n;let h=this._sizeLods[i],d=3*h*(i>this._lodMax-ir?i-this._lodMax+ir:0),u=4*(this._cubeSize-h);nr(e,d,u,3*h,2*h),a.setRenderTarget(e),a.render(c,za)}};function b_(s){let t=[],e=[],n=s,i=s-ir+1+v_;for(let r=0;r<i;r++){let a=Math.pow(2,n);t.push(a);let o=1/(a-2),c=-o,l=1+o,h=[c,c,l,c,l,l,c,c,l,l,c,l],d=6,u=6,f=3,p=new Float32Array(f*u*d),_=new Float32Array(f*u*d);for(let g=0;g<d;g++){let M=g%3*2/3-1,w=g>2?0:-1,y=[M,w,0,M+2/3,w,0,M+2/3,w+1,0,M,w,0,M+2/3,w+1,0,M,w+1,0];p.set(y,f*u*g);for(let T=0;T<u;T++){let b=h[T*2]*2-1,P=h[T*2+1]*2-1;g===0?cs.set(1,P,b):g===1?cs.set(-b,1,-P):g===2?cs.set(-b,P,1):g===3?cs.set(-1,P,-b):g===4?cs.set(-b,-1,P):cs.set(b,P,-1),cs.toArray(_,(g*u+T)*f)}}let m=new _e;m.setAttribute("position",new De(p,f)),m.setAttribute("outputDirection",new De(_,f)),e.push(new Tt(m,null)),n>ir&&n--}return{lodMeshes:e,sizeLods:t}}function Mf(s,t,e){let n=new Fe(s,t,e);return n.texture.mapping=Pa,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function nr(s,t,e,n,i){s.viewport.set(t,e,n,i),s.scissor.set(t,e,n,i)}function T_(s,t,e){return new Ee({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:M_,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:fc(),fragmentShader:`

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
		`,blending:An,depthTest:!1,depthWrite:!1})}function w_(s,t,e){return new Ee({name:"SphericalGaussianBlur",defines:{SAMPLES:y_,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:fc(),fragmentShader:`

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
		`,blending:An,depthTest:!1,depthWrite:!1})}function Sf(){return new Ee({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:fc(),fragmentShader:`

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
		`,blending:An,depthTest:!1,depthWrite:!1})}function bf(){return new Ee({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:fc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:An,depthTest:!1,depthWrite:!1})}function fc(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}var uc=class extends Fe{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;let n={width:t,height:t,depth:1},i=[n,n,n,n,n,n];this.texture=new na(i),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},i=new ve(5,5,5),r=new Ee({name:"CubemapFromEquirect",uniforms:ls(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Oe,blending:An});r.uniforms.tEquirect.value=e;let a=new Tt(i,r),o=e.minFilter;return e.minFilter===Bi&&(e.minFilter=Ze),new xl(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e=!0,n=!0,i=!0){let r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,i);t.setRenderTarget(r)}};function E_(s){let t=new WeakMap,e=new WeakMap,n=null;function i(u,f=!1){return u==null?null:f?a(u):r(u)}function r(u){if(u&&u.isTexture){let f=u.mapping;if(f===Ml||f===Sl)if(t.has(u)){let p=t.get(u).texture;return o(p,u.mapping)}else{let p=u.image;if(p&&p.height>0){let _=new uc(p.height);return _.fromEquirectangularTexture(s,u),t.set(u,_),u.addEventListener("dispose",l),o(_.texture,u.mapping)}else return null}}return u}function a(u){if(u&&u.isTexture){let f=u.mapping,p=f===Ml||f===Sl,_=f===Fi||f===os;if(p||_){let m=e.get(u),g=m!==void 0?m.texture.pmremVersion:0;if(u.isRenderTargetTexture&&u.pmremVersion!==g)return n===null&&(n=new rr(s)),m=p?n.fromEquirectangular(u,m):n.fromCubemap(u,m),m.texture.pmremVersion=u.pmremVersion,e.set(u,m),m.texture;if(m!==void 0)return m.texture;{let M=u.image;return p&&M&&M.height>0||_&&M&&c(M)?(n===null&&(n=new rr(s)),m=p?n.fromEquirectangular(u):n.fromCubemap(u),m.texture.pmremVersion=u.pmremVersion,e.set(u,m),u.addEventListener("dispose",h),m.texture):null}}}return u}function o(u,f){return f===Ml?u.mapping=Fi:f===Sl&&(u.mapping=os),u}function c(u){let f=0,p=6;for(let _=0;_<p;_++)u[_]!==void 0&&f++;return f===p}function l(u){let f=u.target;f.removeEventListener("dispose",l);let p=t.get(f);p!==void 0&&(t.delete(f),p.dispose())}function h(u){let f=u.target;f.removeEventListener("dispose",h);let p=e.get(f);p!==void 0&&(e.delete(f),p.dispose())}function d(){t=new WeakMap,e=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:i,dispose:d}}function A_(s){let t={};function e(n){if(t[n]!==void 0)return t[n];let i=s.getExtension(n);return t[n]=i,i}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){let i=e(n);return i===null&&Zi("WebGLRenderer: "+n+" extension not supported."),i}}}function R_(s,t,e,n){let i={},r=new WeakMap;function a(d){let u=d.target;u.index!==null&&t.remove(u.index);for(let p in u.attributes)t.remove(u.attributes[p]);u.removeEventListener("dispose",a),delete i[u.id];let f=r.get(u);f&&(t.remove(f),r.delete(u)),n.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,e.memory.geometries--}function o(d,u){return i[u.id]===!0||(u.addEventListener("dispose",a),i[u.id]=!0,e.memory.geometries++),u}function c(d){let u=d.attributes;for(let f in u)t.update(u[f],s.ARRAY_BUFFER)}function l(d){let u=[],f=d.index,p=d.attributes.position,_=0;if(p===void 0)return;if(f!==null){let M=f.array;_=f.version;for(let w=0,y=M.length;w<y;w+=3){let T=M[w+0],b=M[w+1],P=M[w+2];u.push(T,b,b,P,P,T)}}else{let M=p.array;_=p.version;for(let w=0,y=M.length/3-1;w<y;w+=3){let T=w+0,b=w+1,P=w+2;u.push(T,b,b,P,P,T)}}let m=new(p.count>=65535?Jr:$r)(u,1);m.version=_;let g=r.get(d);g&&t.remove(g),r.set(d,m)}function h(d){let u=r.get(d);if(u){let f=d.index;f!==null&&u.version<f.version&&l(d)}else l(d);return r.get(d)}return{get:o,update:c,getWireframeAttribute:h}}function C_(s,t,e){let n;function i(d){n=d}let r,a;function o(d){r=d.type,a=d.bytesPerElement}function c(d,u){s.drawElements(n,u,r,d*a),e.update(u,n,1)}function l(d,u,f){f!==0&&(s.drawElementsInstanced(n,u,r,d*a,f),e.update(u,n,f))}function h(d,u,f){if(f===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,u,0,r,d,0,f);let _=0;for(let m=0;m<f;m++)_+=u[m];e.update(_,n,1)}this.setMode=i,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=h}function P_(s){let t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(e.calls++,a){case s.TRIANGLES:e.triangles+=o*(r/3);break;case s.LINES:e.lines+=o*(r/2);break;case s.LINE_STRIP:e.lines+=o*(r-1);break;case s.LINE_LOOP:e.lines+=o*r;break;case s.POINTS:e.points+=o*r;break;default:Ht("WebGLInfo: Unknown draw mode:",a);break}}function i(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:i,update:n}}function I_(s,t,e){let n=new WeakMap,i=new Ae;function r(a,o,c){let l=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,d=h!==void 0?h.length:0,u=n.get(o);if(u===void 0||u.count!==d){let A=function(){P.dispose(),n.delete(o),o.removeEventListener("dispose",A)};u!==void 0&&u.texture.dispose();let f=o.morphAttributes.position!==void 0,p=o.morphAttributes.normal!==void 0,_=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],g=o.morphAttributes.normal||[],M=o.morphAttributes.color||[],w=0;f===!0&&(w=1),p===!0&&(w=2),_===!0&&(w=3);let y=o.attributes.position.count*w,T=1;y>t.maxTextureSize&&(T=Math.ceil(y/t.maxTextureSize),y=t.maxTextureSize);let b=new Float32Array(y*T*4*d),P=new Xr(b,y,T,d);P.type=Rn,P.needsUpdate=!0;let v=w*4;for(let I=0;I<d;I++){let N=m[I],O=g[I],L=M[I],C=y*T*4*I;for(let F=0;F<N.count;F++){let k=F*v;f===!0&&(i.fromBufferAttribute(N,F),b[C+k+0]=i.x,b[C+k+1]=i.y,b[C+k+2]=i.z,b[C+k+3]=0),p===!0&&(i.fromBufferAttribute(O,F),b[C+k+4]=i.x,b[C+k+5]=i.y,b[C+k+6]=i.z,b[C+k+7]=0),_===!0&&(i.fromBufferAttribute(L,F),b[C+k+8]=i.x,b[C+k+9]=i.y,b[C+k+10]=i.z,b[C+k+11]=L.itemSize===4?i.w:1)}}u={count:d,texture:P,size:new it(y,T)},n.set(o,u),o.addEventListener("dispose",A)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(s,"morphTexture",a.morphTexture,e);else{let f=0;for(let _=0;_<l.length;_++)f+=l[_];let p=o.morphTargetsRelative?1:1-f;c.getUniforms().setValue(s,"morphTargetBaseInfluence",p),c.getUniforms().setValue(s,"morphTargetInfluences",l)}c.getUniforms().setValue(s,"morphTargetsTexture",u.texture,e),c.getUniforms().setValue(s,"morphTargetsTextureSize",u.size)}return{update:r}}function L_(s,t,e,n,i){let r=new WeakMap;function a(l){let h=i.render.frame,d=l.geometry,u=t.get(l,d);if(r.get(u)!==h&&(t.update(u),r.set(u,h)),l.isInstancedMesh&&(l.hasEventListener("dispose",c)===!1&&l.addEventListener("dispose",c),r.get(l)!==h&&(e.update(l.instanceMatrix,s.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,s.ARRAY_BUFFER),r.set(l,h))),l.isSkinnedMesh){let f=l.skeleton;r.get(f)!==h&&(f.update(),r.set(f,h))}return u}function o(){r=new WeakMap}function c(l){let h=l.target;h.removeEventListener("dispose",c),n.releaseStatesOfObject(h),e.remove(h.instanceMatrix),h.instanceColor!==null&&e.remove(h.instanceColor)}return{update:a,dispose:o}}var D_={[Ta]:"LINEAR_TONE_MAPPING",[wa]:"REINHARD_TONE_MAPPING",[Ea]:"CINEON_TONE_MAPPING",[as]:"ACES_FILMIC_TONE_MAPPING",[Ra]:"AGX_TONE_MAPPING",[Ca]:"NEUTRAL_TONE_MAPPING",[Aa]:"CUSTOM_TONE_MAPPING"};function N_(s,t,e,n,i,r){let a=new Fe(t,e,{type:s,depthBuffer:i,stencilBuffer:r,samples:n?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),o=null,c=null,l=new _e;l.setAttribute("position",new Jt([-1,3,0,-1,-1,0,3,-1,0],3)),l.setAttribute("uv",new Jt([0,2,0,0,2,0],2));let h=new Zs({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),d=new Tt(l,h),u=new Di(-1,1,1,-1,0,1),f=null,p=null,_=!1,m,g=null,M=[],w=!1;this.setSize=function(y,T){a.setSize(y,T),o!==null&&o.setSize(y,T),c!==null&&c.setSize(y,T);for(let b=0;b<M.length;b++){let P=M[b];P.setSize&&P.setSize(y,T)}},this.setEffects=function(y){M=y,w=M.length>0&&M[0].isRenderPass===!0;let T=a.width,b=a.height;M.length>0&&o===null&&(o=new Fe(T,b,{type:Ke,depthBuffer:!1,stencilBuffer:!1}),c=new Fe(T,b,{type:Ke,depthBuffer:!1,stencilBuffer:!1}));for(let P=0;P<M.length;P++){let v=M[P];v.setSize&&v.setSize(T,b)}},this.begin=function(y,T){if(_||y.toneMapping===Gn&&M.length===0)return!1;if(g=T,T!==null){let b=T.width,P=T.height;(a.width!==b||a.height!==P)&&this.setSize(b,P)}return w===!1&&y.setRenderTarget(a),m=y.toneMapping,y.toneMapping=Gn,!0},this.hasRenderPass=function(){return w},this.end=function(y,T){y.toneMapping=m,_=!0;let b=a,P=o;for(let v=0;v<M.length;v++){let A=M[v];A.enabled!==!1&&(A.render(y,P,b,T),A.needsSwap!==!1&&(b=P,P=P===o?c:o))}if(f!==y.outputColorSpace||p!==y.toneMapping){f=y.outputColorSpace,p=y.toneMapping,h.defines={},Qt.getTransfer(f)===oe&&(h.defines.SRGB_TRANSFER="");let v=D_[p];v&&(h.defines[v]=""),h.needsUpdate=!0}h.uniforms.tDiffuse.value=b.texture,y.setRenderTarget(g),y.render(d,u),g=null,_=!1},this.isCompositing=function(){return _},this.dispose=function(){a.dispose(),o!==null&&o.dispose(),c!==null&&c.dispose(),l.dispose(),h.dispose()}}var Gf=new on,hu=new Ci(1,1),Wf=new Xr,Xf=new Jo,qf=new na,Tf=[],wf=[],Ef=new Float32Array(16),Af=new Float32Array(9),Rf=new Float32Array(4);function ar(s,t,e){let n=s[0];if(n<=0||n>0)return s;let i=t*e,r=Tf[i];if(r===void 0&&(r=new Float32Array(i),Tf[i]=r),t!==0){n.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=e,s[a].toArray(r,o)}return r}function ke(s,t){if(s.length!==t.length)return!1;for(let e=0,n=s.length;e<n;e++)if(s[e]!==t[e])return!1;return!0}function Ve(s,t){for(let e=0,n=t.length;e<n;e++)s[e]=t[e]}function pc(s,t){let e=wf[t];e===void 0&&(e=new Int32Array(t),wf[t]=e);for(let n=0;n!==t;++n)e[n]=s.allocateTextureUnit();return e}function U_(s,t){let e=this.cache;e[0]!==t&&(s.uniform1f(this.addr,t),e[0]=t)}function F_(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(ke(e,t))return;s.uniform2fv(this.addr,t),Ve(e,t)}}function B_(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(s.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(ke(e,t))return;s.uniform3fv(this.addr,t),Ve(e,t)}}function O_(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(ke(e,t))return;s.uniform4fv(this.addr,t),Ve(e,t)}}function z_(s,t){let e=this.cache,n=t.elements;if(n===void 0){if(ke(e,t))return;s.uniformMatrix2fv(this.addr,!1,t),Ve(e,t)}else{if(ke(e,n))return;Rf.set(n),s.uniformMatrix2fv(this.addr,!1,Rf),Ve(e,n)}}function k_(s,t){let e=this.cache,n=t.elements;if(n===void 0){if(ke(e,t))return;s.uniformMatrix3fv(this.addr,!1,t),Ve(e,t)}else{if(ke(e,n))return;Af.set(n),s.uniformMatrix3fv(this.addr,!1,Af),Ve(e,n)}}function V_(s,t){let e=this.cache,n=t.elements;if(n===void 0){if(ke(e,t))return;s.uniformMatrix4fv(this.addr,!1,t),Ve(e,t)}else{if(ke(e,n))return;Ef.set(n),s.uniformMatrix4fv(this.addr,!1,Ef),Ve(e,n)}}function H_(s,t){let e=this.cache;e[0]!==t&&(s.uniform1i(this.addr,t),e[0]=t)}function G_(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(ke(e,t))return;s.uniform2iv(this.addr,t),Ve(e,t)}}function W_(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(ke(e,t))return;s.uniform3iv(this.addr,t),Ve(e,t)}}function X_(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(ke(e,t))return;s.uniform4iv(this.addr,t),Ve(e,t)}}function q_(s,t){let e=this.cache;e[0]!==t&&(s.uniform1ui(this.addr,t),e[0]=t)}function Y_(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(ke(e,t))return;s.uniform2uiv(this.addr,t),Ve(e,t)}}function $_(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(ke(e,t))return;s.uniform3uiv(this.addr,t),Ve(e,t)}}function J_(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(ke(e,t))return;s.uniform4uiv(this.addr,t),Ve(e,t)}}function Z_(s,t,e){let n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);let r;this.type===s.SAMPLER_2D_SHADOW?(hu.compareFunction=e.isReversedDepthBuffer()?lc:oc,r=hu):r=Gf,e.setTexture2D(t||r,i)}function K_(s,t,e){let n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture3D(t||Xf,i)}function Q_(s,t,e){let n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTextureCube(t||qf,i)}function j_(s,t,e){let n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture2DArray(t||Wf,i)}function tv(s){switch(s){case 5126:return U_;case 35664:return F_;case 35665:return B_;case 35666:return O_;case 35674:return z_;case 35675:return k_;case 35676:return V_;case 5124:case 35670:return H_;case 35667:case 35671:return G_;case 35668:case 35672:return W_;case 35669:case 35673:return X_;case 5125:return q_;case 36294:return Y_;case 36295:return $_;case 36296:return J_;case 35678:case 36198:case 36298:case 36306:case 35682:return Z_;case 35679:case 36299:case 36307:return K_;case 35680:case 36300:case 36308:case 36293:return Q_;case 36289:case 36303:case 36311:case 36292:return j_}}function ev(s,t){s.uniform1fv(this.addr,t)}function nv(s,t){let e=ar(t,this.size,2);s.uniform2fv(this.addr,e)}function iv(s,t){let e=ar(t,this.size,3);s.uniform3fv(this.addr,e)}function sv(s,t){let e=ar(t,this.size,4);s.uniform4fv(this.addr,e)}function rv(s,t){let e=ar(t,this.size,4);s.uniformMatrix2fv(this.addr,!1,e)}function av(s,t){let e=ar(t,this.size,9);s.uniformMatrix3fv(this.addr,!1,e)}function ov(s,t){let e=ar(t,this.size,16);s.uniformMatrix4fv(this.addr,!1,e)}function lv(s,t){s.uniform1iv(this.addr,t)}function cv(s,t){s.uniform2iv(this.addr,t)}function hv(s,t){s.uniform3iv(this.addr,t)}function uv(s,t){s.uniform4iv(this.addr,t)}function dv(s,t){s.uniform1uiv(this.addr,t)}function fv(s,t){s.uniform2uiv(this.addr,t)}function pv(s,t){s.uniform3uiv(this.addr,t)}function mv(s,t){s.uniform4uiv(this.addr,t)}function gv(s,t,e){let n=this.cache,i=t.length,r=pc(e,i);ke(n,r)||(s.uniform1iv(this.addr,r),Ve(n,r));let a;this.type===s.SAMPLER_2D_SHADOW?a=hu:a=Gf;for(let o=0;o!==i;++o)e.setTexture2D(t[o]||a,r[o])}function xv(s,t,e){let n=this.cache,i=t.length,r=pc(e,i);ke(n,r)||(s.uniform1iv(this.addr,r),Ve(n,r));for(let a=0;a!==i;++a)e.setTexture3D(t[a]||Xf,r[a])}function _v(s,t,e){let n=this.cache,i=t.length,r=pc(e,i);ke(n,r)||(s.uniform1iv(this.addr,r),Ve(n,r));for(let a=0;a!==i;++a)e.setTextureCube(t[a]||qf,r[a])}function vv(s,t,e){let n=this.cache,i=t.length,r=pc(e,i);ke(n,r)||(s.uniform1iv(this.addr,r),Ve(n,r));for(let a=0;a!==i;++a)e.setTexture2DArray(t[a]||Wf,r[a])}function yv(s){switch(s){case 5126:return ev;case 35664:return nv;case 35665:return iv;case 35666:return sv;case 35674:return rv;case 35675:return av;case 35676:return ov;case 5124:case 35670:return lv;case 35667:case 35671:return cv;case 35668:case 35672:return hv;case 35669:case 35673:return uv;case 5125:return dv;case 36294:return fv;case 36295:return pv;case 36296:return mv;case 35678:case 36198:case 36298:case 36306:case 35682:return gv;case 35679:case 36299:case 36307:return xv;case 35680:case 36300:case 36308:case 36293:return _v;case 36289:case 36303:case 36311:case 36292:return vv}}var uu=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=tv(e.type)}},du=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=yv(e.type)}},fu=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){let i=this.seq;for(let r=0,a=i.length;r!==a;++r){let o=i[r];o.setValue(t,e[o.id],n)}}},lu=/(\w+)(\])?(\[|\.)?/g;function Cf(s,t){s.seq.push(t),s.map[t.id]=t}function Mv(s,t,e){let n=s.name,i=n.length;for(lu.lastIndex=0;;){let r=lu.exec(n),a=lu.lastIndex,o=r[1],c=r[2]==="]",l=r[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===i){Cf(e,l===void 0?new uu(o,s,t):new du(o,s,t));break}else{let d=e.map[o];d===void 0&&(d=new fu(o),Cf(e,d)),e=d}}}var sr=class{constructor(t,e){this.seq=[],this.map={};let n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){let o=t.getActiveUniform(e,a),c=t.getUniformLocation(e,o.name);Mv(o,c,this)}let i=[],r=[];for(let a of this.seq)a.type===t.SAMPLER_2D_SHADOW||a.type===t.SAMPLER_CUBE_SHADOW||a.type===t.SAMPLER_2D_ARRAY_SHADOW?i.push(a):r.push(a);i.length>0&&(this.seq=i.concat(r))}setValue(t,e,n,i){let r=this.map[e];r!==void 0&&r.setValue(t,n,i)}setOptional(t,e,n){let i=e[n];i!==void 0&&this.setValue(t,n,i)}static upload(t,e,n,i){for(let r=0,a=e.length;r!==a;++r){let o=e[r],c=n[o.id];c.needsUpdate!==!1&&o.setValue(t,c.value,i)}}static seqWithValue(t,e){let n=[];for(let i=0,r=t.length;i!==r;++i){let a=t[i];a.id in e&&n.push(a)}return n}};function Pf(s,t,e){let n=s.createShader(t);return s.shaderSource(n,e),s.compileShader(n),n}var Sv=37297,bv=0;function Tv(s,t){let e=s.split(`
`),n=[],i=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let a=i;a<r;a++){let o=a+1;n.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return n.join(`
`)}var If=new Wt;function wv(s){Qt._getMatrix(If,Qt.workingColorSpace,s);let t=`mat3( ${If.elements.map(e=>e.toFixed(4))} )`;switch(Qt.getTransfer(s)){case Hr:return[t,"LinearTransferOETF"];case oe:return[t,"sRGBTransferOETF"];default:return kt("WebGLProgram: Unsupported color space: ",s),[t,"LinearTransferOETF"]}}function Lf(s,t,e){let n=s.getShaderParameter(t,s.COMPILE_STATUS),r=(s.getShaderInfoLog(t)||"").trim();if(n&&r==="")return"";let a=/ERROR: 0:(\d+)/.exec(r);if(a){let o=parseInt(a[1]);return e.toUpperCase()+`

`+r+`

`+Tv(s.getShaderSource(t),o)}else return r}function Ev(s,t){let e=wv(t);return[`vec4 ${s}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}var Av={[Ta]:"Linear",[wa]:"Reinhard",[Ea]:"Cineon",[as]:"ACESFilmic",[Ra]:"AgX",[Ca]:"Neutral",[Aa]:"Custom"};function Rv(s,t){let e=Av[t];return e===void 0?(kt("WebGLProgram: Unsupported toneMapping:",t),"vec3 "+s+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+s+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}var hc=new E;function Cv(){Qt.getLuminanceCoefficients(hc);let s=hc.x.toFixed(4),t=hc.y.toFixed(4),e=hc.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Pv(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Va).join(`
`)}function Iv(s){let t=[];for(let e in s){let n=s[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function Lv(s,t){let e={},n=s.getProgramParameter(t,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){let r=s.getActiveAttrib(t,i),a=r.name,o=1;r.type===s.FLOAT_MAT2&&(o=2),r.type===s.FLOAT_MAT3&&(o=3),r.type===s.FLOAT_MAT4&&(o=4),e[a]={type:r.type,location:s.getAttribLocation(t,a),locationSize:o}}return e}function Va(s){return s!==""}function Df(s,t){let e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return s.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Nf(s,t){return s.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var Dv=/^[ \t]*#include +<([\w\d./]+)>/gm;function pu(s){return s.replace(Dv,Uv)}var Nv=new Map;function Uv(s,t){let e=Zt[t];if(e===void 0){let n=Nv.get(t);if(n!==void 0)e=Zt[n],kt('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+t+">")}return pu(e)}var Fv=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Uf(s){return s.replace(Fv,Bv)}function Bv(s,t,e,n){let i="";for(let r=parseInt(t);r<parseInt(e);r++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function Ff(s){let t=`precision ${s.precision} float;
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
#define LOW_PRECISION`),t}var Ov={[ss]:"SHADOWMAP_TYPE_PCF",[Qs]:"SHADOWMAP_TYPE_VSM"};function zv(s){return Ov[s.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var kv={[Fi]:"ENVMAP_TYPE_CUBE",[os]:"ENVMAP_TYPE_CUBE",[Pa]:"ENVMAP_TYPE_CUBE_UV"};function Vv(s){return s.envMap===!1?"ENVMAP_TYPE_CUBE":kv[s.envMapMode]||"ENVMAP_TYPE_CUBE"}var Hv={[os]:"ENVMAP_MODE_REFRACTION"};function Gv(s){return s.envMap===!1?"ENVMAP_MODE_REFLECTION":Hv[s.envMapMode]||"ENVMAP_MODE_REFLECTION"}var Wv={[yl]:"ENVMAP_BLENDING_MULTIPLY",[Jd]:"ENVMAP_BLENDING_MIX",[Zd]:"ENVMAP_BLENDING_ADD"};function Xv(s){return s.envMap===!1?"ENVMAP_BLENDING_NONE":Wv[s.combine]||"ENVMAP_BLENDING_NONE"}function qv(s){let t=s.envMapCubeUVHeight;if(t===null)return null;let e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function Yv(s,t,e,n){let i=s.getContext(),r=e.defines,a=e.vertexShader,o=e.fragmentShader,c=zv(e),l=Vv(e),h=Gv(e),d=Xv(e),u=qv(e),f=Pv(e),p=Iv(r),_=i.createProgram(),m,g,M=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p].filter(Va).join(`
`),m.length>0&&(m+=`
`),g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p].filter(Va).join(`
`),g.length>0&&(g+=`
`)):(m=[Ff(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexNormals?"#define HAS_NORMAL":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Va).join(`
`),g=[Ff(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+h:"",e.envMap?"#define "+d:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.retroreflection?"#define USE_RETROREFLECTION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas||e.batchingColor?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Gn?"#define TONE_MAPPING":"",e.toneMapping!==Gn?Zt.tonemapping_pars_fragment:"",e.toneMapping!==Gn?Rv("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Zt.colorspace_pars_fragment,Ev("linearToOutputTexel",e.outputColorSpace),Cv(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Va).join(`
`)),a=pu(a),a=Df(a,e),a=Nf(a,e),o=pu(o),o=Df(o,e),o=Nf(o,e),a=Uf(a),o=Uf(o),e.isRawShaderMaterial!==!0&&(M=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,g=["#define varying in",e.glslVersion===qh?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===qh?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+g);let w=M+m+a,y=M+g+o,T=Pf(i,i.VERTEX_SHADER,w),b=Pf(i,i.FRAGMENT_SHADER,y);i.attachShader(_,T),i.attachShader(_,b),e.index0AttributeName!==void 0?i.bindAttribLocation(_,0,e.index0AttributeName):e.hasPositionAttribute===!0&&i.bindAttribLocation(_,0,"position"),i.linkProgram(_);function P(N){if(s.debug.checkShaderErrors){let O=i.getProgramInfoLog(_)||"",L=i.getShaderInfoLog(T)||"",C=i.getShaderInfoLog(b)||"",F=O.trim(),k=L.trim(),V=C.trim(),j=!0,q=!0;if(i.getProgramParameter(_,i.LINK_STATUS)===!1)if(j=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,_,T,b);else{let Z=Lf(i,T,"vertex"),K=Lf(i,b,"fragment");Ht("WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(_,i.VALIDATE_STATUS)+`

Material Name: `+N.name+`
Material Type: `+N.type+`

Program Info Log: `+F+`
`+Z+`
`+K)}else F!==""?kt("WebGLProgram: Program Info Log:",F):(k===""||V==="")&&(q=!1);q&&(N.diagnostics={runnable:j,programLog:F,vertexShader:{log:k,prefix:m},fragmentShader:{log:V,prefix:g}})}i.deleteShader(T),i.deleteShader(b),v=new sr(i,_),A=Lv(i,_)}let v;this.getUniforms=function(){return v===void 0&&P(this),v};let A;this.getAttributes=function(){return A===void 0&&P(this),A};let I=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return I===!1&&(I=i.getProgramParameter(_,Sv)),I},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(_),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=bv++,this.cacheKey=t,this.usedTimes=1,this.program=_,this.vertexShader=T,this.fragmentShader=b,this}var $v=0,mu=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t,e,n){let i=this._getShaderCacheForMaterial(t);return i.has(e)===!1&&(i.add(e),e.usedTimes++),i.has(n)===!1&&(i.add(n),n.usedTimes++),this}remove(t){let e=this.materialCache.get(t);for(let n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderStage(t){return this._getShaderStage(t.vertexShader)}getFragmentShaderStage(t){return this._getShaderStage(t.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){let e=this.shaderCache,n=e.get(t);return n===void 0&&(n=new gu(t),e.set(t,n)),n}},gu=class{constructor(t){this.id=$v++,this.code=t,this.usedTimes=0}};function Jv(s){return s===zi||s===Fa||s===Ba}function Zv(s,t,e,n,i,r){let a=new qr,o=new mu,c=new Set,l=[],h=new Map,d=n.logarithmicDepthBuffer,u=n.precision,f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function p(v){return c.add(v),v===0?"uv":`uv${v}`}function _(v,A,I,N,O,L){let C=N.fog,F=O.geometry,k=v.isMeshStandardMaterial||v.isMeshLambertMaterial||v.isMeshPhongMaterial?N.environment:null,V=v.isMeshStandardMaterial||v.isMeshLambertMaterial&&!v.envMap||v.isMeshPhongMaterial&&!v.envMap,j=t.get(v.envMap||k,V),q=j&&j.mapping===Pa?j.image.height:null,Z=f[v.type];v.precision!==null&&(u=n.getMaxPrecision(v.precision),u!==v.precision&&kt("WebGLProgram.getParameters:",v.precision,"not supported, using",u,"instead."));let K=F.morphAttributes.position||F.morphAttributes.normal||F.morphAttributes.color,At=K!==void 0?K.length:0,yt=0;F.morphAttributes.position!==void 0&&(yt=1),F.morphAttributes.normal!==void 0&&(yt=2),F.morphAttributes.color!==void 0&&(yt=3);let se,Yt,ne,Y;if(Z){let ge=ri[Z];se=ge.vertexShader,Yt=ge.fragmentShader}else{se=v.vertexShader,Yt=v.fragmentShader;let ge=o.getVertexShaderStage(v),ue=o.getFragmentShaderStage(v);o.update(v,ge,ue),ne=ge.id,Y=ue.id}let tt=s.getRenderTarget(),xt=s.state.buffers.depth.getReversed(),Bt=O.isInstancedMesh===!0,wt=O.isBatchedMesh===!0,Vt=!!v.map,le=!!v.matcap,et=!!j,rt=!!v.aoMap,at=!!v.lightMap,ot=!!v.bumpMap&&v.wireframe===!1,ct=!!v.normalMap,Ot=!!v.displacementMap,Ft=!!v.emissiveMap,Gt=!!v.metalnessMap,Xt=!!v.roughnessMap,D=v.anisotropy>0,he=v.clearcoat>0,te=v.dispersion>0,R=v.retroreflectivity>0,x=v.iridescence>0,z=v.sheen>0,W=v.transmission>0,$=D&&!!v.anisotropyMap,lt=he&&!!v.clearcoatMap,dt=he&&!!v.clearcoatNormalMap,J=he&&!!v.clearcoatRoughnessMap,nt=x&&!!v.iridescenceMap,ft=x&&!!v.iridescenceThicknessMap,Dt=z&&!!v.sheenColorMap,_t=z&&!!v.sheenRoughnessMap,pt=!!v.specularMap,Nt=!!v.specularColorMap,zt=!!v.specularIntensityMap,qt=W&&!!v.transmissionMap,B=W&&!!v.thicknessMap,mt=!!v.gradientMap,Q=!!v.alphaMap,gt=v.alphaTest>0,bt=!!v.alphaHash,st=!!v.extensions,Ut=Gn;v.toneMapped&&(tt===null||tt.isXRRenderTarget===!0)&&(Ut=s.toneMapping);let It={shaderID:Z,shaderType:v.type,shaderName:v.name,vertexShader:se,fragmentShader:Yt,defines:v.defines,customVertexShaderID:ne,customFragmentShaderID:Y,isRawShaderMaterial:v.isRawShaderMaterial===!0,glslVersion:v.glslVersion,precision:u,batching:wt,batchingColor:wt&&O._colorsTexture!==null,instancing:Bt,instancingColor:Bt&&O.instanceColor!==null,instancingMorph:Bt&&O.morphTexture!==null,outputColorSpace:tt===null?s.outputColorSpace:tt.isXRRenderTarget===!0?tt.texture.colorSpace:Qt.workingColorSpace,alphaToCoverage:!!v.alphaToCoverage,map:Vt,matcap:le,envMap:et,envMapMode:et&&j.mapping,envMapCubeUVHeight:q,aoMap:rt,lightMap:at,bumpMap:ot,normalMap:ct,displacementMap:Ot,emissiveMap:Ft,normalMapObjectSpace:ct&&v.normalMapType===jd,normalMapTangentSpace:ct&&v.normalMapType===Oa,packedNormalMap:ct&&v.normalMapType===Oa&&Jv(v.normalMap.format),metalnessMap:Gt,roughnessMap:Xt,anisotropy:D,anisotropyMap:$,clearcoat:he,clearcoatMap:lt,clearcoatNormalMap:dt,clearcoatRoughnessMap:J,dispersion:te,retroreflection:R,iridescence:x,iridescenceMap:nt,iridescenceThicknessMap:ft,sheen:z,sheenColorMap:Dt,sheenRoughnessMap:_t,specularMap:pt,specularColorMap:Nt,specularIntensityMap:zt,transmission:W,transmissionMap:qt,thicknessMap:B,gradientMap:mt,opaque:v.transparent===!1&&v.blending===Ui&&v.alphaToCoverage===!1,alphaMap:Q,alphaTest:gt,alphaHash:bt,combine:v.combine,mapUv:Vt&&p(v.map.channel),aoMapUv:rt&&p(v.aoMap.channel),lightMapUv:at&&p(v.lightMap.channel),bumpMapUv:ot&&p(v.bumpMap.channel),normalMapUv:ct&&p(v.normalMap.channel),displacementMapUv:Ot&&p(v.displacementMap.channel),emissiveMapUv:Ft&&p(v.emissiveMap.channel),metalnessMapUv:Gt&&p(v.metalnessMap.channel),roughnessMapUv:Xt&&p(v.roughnessMap.channel),anisotropyMapUv:$&&p(v.anisotropyMap.channel),clearcoatMapUv:lt&&p(v.clearcoatMap.channel),clearcoatNormalMapUv:dt&&p(v.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:J&&p(v.clearcoatRoughnessMap.channel),iridescenceMapUv:nt&&p(v.iridescenceMap.channel),iridescenceThicknessMapUv:ft&&p(v.iridescenceThicknessMap.channel),sheenColorMapUv:Dt&&p(v.sheenColorMap.channel),sheenRoughnessMapUv:_t&&p(v.sheenRoughnessMap.channel),specularMapUv:pt&&p(v.specularMap.channel),specularColorMapUv:Nt&&p(v.specularColorMap.channel),specularIntensityMapUv:zt&&p(v.specularIntensityMap.channel),transmissionMapUv:qt&&p(v.transmissionMap.channel),thicknessMapUv:B&&p(v.thicknessMap.channel),alphaMapUv:Q&&p(v.alphaMap.channel),vertexTangents:!!F.attributes.tangent&&(ct||D),vertexNormals:!!F.attributes.normal,vertexColors:v.vertexColors,vertexAlphas:v.vertexColors===!0&&!!F.attributes.color&&F.attributes.color.itemSize===4,pointsUvs:O.isPoints===!0&&!!F.attributes.uv&&(Vt||Q),fog:!!C,useFog:v.fog===!0,fogExp2:!!C&&C.isFogExp2,flatShading:v.wireframe===!1&&(v.flatShading===!0||F.attributes.normal===void 0&&ct===!1&&(v.isMeshLambertMaterial||v.isMeshPhongMaterial||v.isMeshStandardMaterial||v.isMeshPhysicalMaterial)),sizeAttenuation:v.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:xt,skinning:O.isSkinnedMesh===!0,hasPositionAttribute:F.attributes.position!==void 0,morphTargets:F.morphAttributes.position!==void 0,morphNormals:F.morphAttributes.normal!==void 0,morphColors:F.morphAttributes.color!==void 0,morphTargetsCount:At,morphTextureStride:yt,numSunLights:A.sun.length,numDirLights:A.directional.length,numPointLights:A.point.length,numSpotLights:A.spot.length,numSpotLightMaps:A.spotLightMap.length,numRectAreaLights:A.rectArea.length,numHemiLights:A.hemi.length,numSunLightShadows:A.sunShadowMap.length,numDirLightShadows:A.directionalShadowMap.length,numPointLightShadows:A.pointShadowMap.length,numSpotLightShadows:A.spotShadowMap.length,numSpotLightShadowsWithMaps:A.numSpotLightShadowsWithMaps,numLightProbes:A.numLightProbes,numLightProbeGrids:L.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:v.dithering,shadowMapEnabled:s.shadowMap.enabled&&I.length>0,shadowMapType:s.shadowMap.type,toneMapping:Ut,decodeVideoTexture:Vt&&v.map.isVideoTexture===!0&&Qt.getTransfer(v.map.colorSpace)===oe,decodeVideoTextureEmissive:Ft&&v.emissiveMap.isVideoTexture===!0&&Qt.getTransfer(v.emissiveMap.colorSpace)===oe,premultipliedAlpha:v.premultipliedAlpha,doubleSided:v.side===ze,flipSided:v.side===Oe,useDepthPacking:v.depthPacking>=0,depthPacking:v.depthPacking||0,index0AttributeName:v.index0AttributeName,extensionClipCullDistance:st&&v.extensions.clipCullDistance===!0&&e.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(st&&v.extensions.multiDraw===!0||wt)&&e.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:e.has("KHR_parallel_shader_compile"),customProgramCacheKey:v.customProgramCacheKey()};return It.vertexUv1s=c.has(1),It.vertexUv2s=c.has(2),It.vertexUv3s=c.has(3),c.clear(),It}function m(v){let A=[];if(v.shaderID?A.push(v.shaderID):(A.push(v.customVertexShaderID),A.push(v.customFragmentShaderID)),v.defines!==void 0)for(let I in v.defines)A.push(I),A.push(v.defines[I]);return v.isRawShaderMaterial===!1&&(g(A,v),M(A,v),A.push(s.outputColorSpace)),A.push(v.customProgramCacheKey),A.join()}function g(v,A){v.push(A.precision),v.push(A.outputColorSpace),v.push(A.envMapMode),v.push(A.envMapCubeUVHeight),v.push(A.mapUv),v.push(A.alphaMapUv),v.push(A.lightMapUv),v.push(A.aoMapUv),v.push(A.bumpMapUv),v.push(A.normalMapUv),v.push(A.displacementMapUv),v.push(A.emissiveMapUv),v.push(A.metalnessMapUv),v.push(A.roughnessMapUv),v.push(A.anisotropyMapUv),v.push(A.clearcoatMapUv),v.push(A.clearcoatNormalMapUv),v.push(A.clearcoatRoughnessMapUv),v.push(A.iridescenceMapUv),v.push(A.iridescenceThicknessMapUv),v.push(A.sheenColorMapUv),v.push(A.sheenRoughnessMapUv),v.push(A.specularMapUv),v.push(A.specularColorMapUv),v.push(A.specularIntensityMapUv),v.push(A.transmissionMapUv),v.push(A.thicknessMapUv),v.push(A.combine),v.push(A.fogExp2),v.push(A.sizeAttenuation),v.push(A.morphTargetsCount),v.push(A.morphAttributeCount),v.push(A.numSunLights),v.push(A.numDirLights),v.push(A.numPointLights),v.push(A.numSpotLights),v.push(A.numSpotLightMaps),v.push(A.numHemiLights),v.push(A.numRectAreaLights),v.push(A.numSunLightShadows),v.push(A.numDirLightShadows),v.push(A.numPointLightShadows),v.push(A.numSpotLightShadows),v.push(A.numSpotLightShadowsWithMaps),v.push(A.numLightProbes),v.push(A.shadowMapType),v.push(A.toneMapping),v.push(A.numClippingPlanes),v.push(A.numClipIntersection),v.push(A.depthPacking)}function M(v,A){a.disableAll(),A.instancing&&a.enable(0),A.instancingColor&&a.enable(1),A.instancingMorph&&a.enable(2),A.matcap&&a.enable(3),A.envMap&&a.enable(4),A.normalMapObjectSpace&&a.enable(5),A.normalMapTangentSpace&&a.enable(6),A.clearcoat&&a.enable(7),A.iridescence&&a.enable(8),A.alphaTest&&a.enable(9),A.vertexColors&&a.enable(10),A.vertexAlphas&&a.enable(11),A.vertexUv1s&&a.enable(12),A.vertexUv2s&&a.enable(13),A.vertexUv3s&&a.enable(14),A.vertexTangents&&a.enable(15),A.anisotropy&&a.enable(16),A.alphaHash&&a.enable(17),A.batching&&a.enable(18),A.dispersion&&a.enable(19),A.retroreflection&&a.enable(24),A.batchingColor&&a.enable(20),A.gradientMap&&a.enable(21),A.packedNormalMap&&a.enable(22),A.vertexNormals&&a.enable(23),v.push(a.mask),a.disableAll(),A.fog&&a.enable(0),A.useFog&&a.enable(1),A.flatShading&&a.enable(2),A.logarithmicDepthBuffer&&a.enable(3),A.reversedDepthBuffer&&a.enable(4),A.skinning&&a.enable(5),A.morphTargets&&a.enable(6),A.morphNormals&&a.enable(7),A.morphColors&&a.enable(8),A.premultipliedAlpha&&a.enable(9),A.shadowMapEnabled&&a.enable(10),A.doubleSided&&a.enable(11),A.flipSided&&a.enable(12),A.useDepthPacking&&a.enable(13),A.dithering&&a.enable(14),A.transmission&&a.enable(15),A.sheen&&a.enable(16),A.opaque&&a.enable(17),A.pointsUvs&&a.enable(18),A.decodeVideoTexture&&a.enable(19),A.decodeVideoTextureEmissive&&a.enable(20),A.alphaToCoverage&&a.enable(21),A.numLightProbeGrids>0&&a.enable(22),A.hasPositionAttribute&&a.enable(23),v.push(a.mask)}function w(v){let A=f[v.type],I;if(A){let N=ri[A];I=xi.clone(N.uniforms)}else I=v.uniforms;return I}function y(v,A){let I=h.get(A);return I!==void 0?++I.usedTimes:(I=new Yv(s,A,v,i),l.push(I),h.set(A,I)),I}function T(v){if(--v.usedTimes===0){let A=l.indexOf(v);l[A]=l[l.length-1],l.pop(),h.delete(v.cacheKey),v.destroy()}}function b(v){o.remove(v)}function P(){o.dispose()}return{getParameters:_,getProgramCacheKey:m,getUniforms:w,acquireProgram:y,releaseProgram:T,releaseShaderCache:b,programs:l,dispose:P}}function Kv(){let s=new WeakMap;function t(a){return s.has(a)}function e(a){let o=s.get(a);return o===void 0&&(o={},s.set(a,o)),o}function n(a){s.delete(a)}function i(a,o,c){s.get(a)[o]=c}function r(){s=new WeakMap}return{has:t,get:e,remove:n,update:i,dispose:r}}function Qv(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.material.id!==t.material.id?s.material.id-t.material.id:s.materialVariant!==t.materialVariant?s.materialVariant-t.materialVariant:s.z!==t.z?s.z-t.z:s.id-t.id}function Bf(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.z!==t.z?t.z-s.z:s.id-t.id}function Of(){let s=[],t=0,e=[],n=[],i=[];function r(){t=0,e.length=0,n.length=0,i.length=0}function a(u){let f=0;return u.isInstancedMesh&&(f+=2),u.isSkinnedMesh&&(f+=1),f}function o(u,f,p,_,m,g){let M=s[t];return M===void 0?(M={id:u.id,object:u,geometry:f,material:p,materialVariant:a(u),groupOrder:_,renderOrder:u.renderOrder,z:m,group:g},s[t]=M):(M.id=u.id,M.object=u,M.geometry=f,M.material=p,M.materialVariant=a(u),M.groupOrder=_,M.renderOrder=u.renderOrder,M.z=m,M.group=g),t++,M}function c(u,f,p,_,m,g,M){M.reversedDepth===!0&&(m=-m);let w=o(u,f,p,_,m,g);p.transmission>0?n.push(w):p.transparent===!0?i.push(w):e.push(w)}function l(u,f,p,_,m,g){let M=o(u,f,p,_,m,g);p.transmission>0?n.unshift(M):p.transparent===!0?i.unshift(M):e.unshift(M)}function h(u,f){e.length>1&&e.sort(u||Qv),n.length>1&&n.sort(f||Bf),i.length>1&&i.sort(f||Bf)}function d(){for(let u=t,f=s.length;u<f;u++){let p=s[u];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:e,transmissive:n,transparent:i,init:r,push:c,unshift:l,finish:d,sort:h}}function jv(){let s=new WeakMap;function t(n,i){let r=s.get(n),a;return r===void 0?(a=new Of,s.set(n,[a])):i>=r.length?(a=new Of,r.push(a)):a=r[i],a}function e(){s=new WeakMap}return{get:t,dispose:e}}function ty(){let s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={direction:new E,color:new ht};break;case"SpotLight":e={position:new E,direction:new E,color:new ht,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new E,color:new ht,distance:0,decay:0};break;case"HemisphereLight":e={direction:new E,skyColor:new ht,groundColor:new ht};break;case"RectAreaLight":e={color:new ht,position:new E,halfWidth:new E,halfHeight:new E};break}return s[t.id]=e,e}}}function ey(){let s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new it};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new it};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new it,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[t.id]=e,e}}}var ny=0;function iy(s,t){return(t.castShadow?2:0)-(s.castShadow?2:0)+(t.map?1:0)-(s.map?1:0)}function sy(s){let t=new ty,e=ey(),n={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new E);let i=new E,r=new ce,a=new ce;function o(l){let h=0,d=0,u=0;for(let O=0;O<9;O++)n.probe[O].set(0,0,0);let f=0,p=0,_=0,m=0,g=0,M=0,w=0,y=0,T=0,b=0,P=0,v=0,A=0,I=0;l.sort(iy);for(let O=0,L=l.length;O<L;O++){let C=l[O],F=C.color,k=C.intensity,V=C.distance,j=null;if(C.shadow&&C.shadow.map&&(C.shadow.map.texture.format===zi?j=C.shadow.map.texture:j=C.shadow.map.depthTexture||C.shadow.map.texture),C.isAmbientLight)h+=F.r*k,d+=F.g*k,u+=F.b*k;else if(C.isLightProbe){for(let q=0;q<9;q++)n.probe[q].addScaledVector(C.sh.coefficients[q],k);I++}else if(C.isSunLight){let q=t.get(C);if(q.color.copy(C.color).multiplyScalar(C.intensity),C.castShadow){let Z=C.shadow,K=e.get(C);K.shadowIntensity=Z.intensity,K.shadowBias=Z.bias,K.shadowNormalBias=Z.normalBias,K.shadowRadius=Z.radius,K.shadowMapSize.copy(Z.mapSize).multiply(Z.getFrameExtents()),n.sunShadow[p]=K,n.sunShadowMap[p]=j;let At=Z.getViewportCount();for(let yt=0;yt<At;yt++)n.sunShadowMatrix[_+yt]=Z.getMatrix(yt),n.sunShadowCascade[_+yt]=Z._cascadeData[yt];_+=At,p++}n.sun[f]=q,f++}else if(C.isDirectionalLight){let q=t.get(C);if(q.color.copy(C.color).multiplyScalar(C.intensity),C.castShadow){let Z=C.shadow,K=e.get(C);K.shadowIntensity=Z.intensity,K.shadowBias=Z.bias,K.shadowNormalBias=Z.normalBias,K.shadowRadius=Z.radius,K.shadowMapSize=Z.mapSize,n.directionalShadow[m]=K,n.directionalShadowMap[m]=j,n.directionalShadowMatrix[m]=C.shadow.matrix,T++}n.directional[m]=q,m++}else if(C.isSpotLight){let q=t.get(C);q.position.setFromMatrixPosition(C.matrixWorld),q.color.copy(F).multiplyScalar(k),q.distance=V,q.coneCos=Math.cos(C.angle),q.penumbraCos=Math.cos(C.angle*(1-C.penumbra)),q.decay=C.decay,n.spot[M]=q;let Z=C.shadow;if(C.map&&(n.spotLightMap[v]=C.map,v++,Z.updateMatrices(C),C.castShadow&&A++),n.spotLightMatrix[M]=Z.matrix,C.castShadow){let K=e.get(C);K.shadowIntensity=Z.intensity,K.shadowBias=Z.bias,K.shadowNormalBias=Z.normalBias,K.shadowRadius=Z.radius,K.shadowMapSize=Z.mapSize,n.spotShadow[M]=K,n.spotShadowMap[M]=j,P++}M++}else if(C.isRectAreaLight){let q=t.get(C);q.color.copy(F).multiplyScalar(k),q.halfWidth.set(C.width*.5,0,0),q.halfHeight.set(0,C.height*.5,0),n.rectArea[w]=q,w++}else if(C.isPointLight){let q=t.get(C);if(q.color.copy(C.color).multiplyScalar(C.intensity),q.distance=C.distance,q.decay=C.decay,C.castShadow){let Z=C.shadow,K=e.get(C);K.shadowIntensity=Z.intensity,K.shadowBias=Z.bias,K.shadowNormalBias=Z.normalBias,K.shadowRadius=Z.radius,K.shadowMapSize=Z.mapSize,K.shadowCameraNear=Z.camera.near,K.shadowCameraFar=Z.camera.far,n.pointShadow[g]=K,n.pointShadowMap[g]=j,n.pointShadowMatrix[g]=C.shadow.matrix,b++}n.point[g]=q,g++}else if(C.isHemisphereLight){let q=t.get(C);q.skyColor.copy(C.color).multiplyScalar(k),q.groundColor.copy(C.groundColor).multiplyScalar(k),n.hemi[y]=q,y++}}w>0&&(s.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=vt.LTC_FLOAT_1,n.rectAreaLTC2=vt.LTC_FLOAT_2):(n.rectAreaLTC1=vt.LTC_HALF_1,n.rectAreaLTC2=vt.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=d,n.ambient[2]=u;let N=n.hash;(N.sunLength!==f||N.directionalLength!==m||N.pointLength!==g||N.spotLength!==M||N.rectAreaLength!==w||N.hemiLength!==y||N.numSunShadows!==p||N.numDirectionalShadows!==T||N.numPointShadows!==b||N.numSpotShadows!==P||N.numSpotMaps!==v||N.numLightProbes!==I)&&(n.sun.length=f,n.directional.length=m,n.spot.length=M,n.rectArea.length=w,n.point.length=g,n.hemi.length=y,n.sunShadow.length=p,n.sunShadowMap.length=p,n.sunShadowMatrix.length=_,n.sunShadowCascade.length=_,n.directionalShadow.length=T,n.directionalShadowMap.length=T,n.directionalShadowMatrix.length=T,n.pointShadow.length=b,n.pointShadowMap.length=b,n.pointShadowMatrix.length=b,n.spotShadow.length=P,n.spotShadowMap.length=P,n.spotLightMatrix.length=P+v-A,n.spotLightMap.length=v,n.numSpotLightShadowsWithMaps=A,n.numLightProbes=I,N.sunLength=f,N.directionalLength=m,N.pointLength=g,N.spotLength=M,N.rectAreaLength=w,N.hemiLength=y,N.numSunShadows=p,N.numDirectionalShadows=T,N.numPointShadows=b,N.numSpotShadows=P,N.numSpotMaps=v,N.numLightProbes=I,n.version=ny++)}function c(l,h){let d=0,u=0,f=0,p=0,_=0,m=0,g=h.matrixWorldInverse;for(let M=0,w=l.length;M<w;M++){let y=l[M];if(y.isSunLight){let T=n.sun[d];T.direction.setFromMatrixPosition(y.matrixWorld),T.direction.transformDirection(g),d++}else if(y.isDirectionalLight){let T=n.directional[u];T.direction.setFromMatrixPosition(y.matrixWorld),i.setFromMatrixPosition(y.target.matrixWorld),T.direction.sub(i),T.direction.transformDirection(g),u++}else if(y.isSpotLight){let T=n.spot[p];T.position.setFromMatrixPosition(y.matrixWorld),T.position.applyMatrix4(g),T.direction.setFromMatrixPosition(y.matrixWorld),i.setFromMatrixPosition(y.target.matrixWorld),T.direction.sub(i),T.direction.transformDirection(g),p++}else if(y.isRectAreaLight){let T=n.rectArea[_];T.position.setFromMatrixPosition(y.matrixWorld),T.position.applyMatrix4(g),a.identity(),r.copy(y.matrixWorld),r.premultiply(g),a.extractRotation(r),T.halfWidth.set(y.width*.5,0,0),T.halfHeight.set(0,y.height*.5,0),T.halfWidth.applyMatrix4(a),T.halfHeight.applyMatrix4(a),_++}else if(y.isPointLight){let T=n.point[f];T.position.setFromMatrixPosition(y.matrixWorld),T.position.applyMatrix4(g),f++}else if(y.isHemisphereLight){let T=n.hemi[m];T.direction.setFromMatrixPosition(y.matrixWorld),T.direction.transformDirection(g),m++}}}return{setup:o,setupView:c,state:n}}function zf(s){let t=new sy(s),e=[],n=[],i=[];function r(u){d.camera=u,e.length=0,n.length=0,i.length=0}function a(u){e.push(u)}function o(u){n.push(u)}function c(u){i.push(u)}function l(){t.setup(e)}function h(u){t.setupView(e,u)}let d={lightsArray:e,shadowsArray:n,lightProbeGridArray:i,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:d,setupLights:l,setupLightsView:h,pushLight:a,pushShadow:o,pushLightProbeGrid:c}}function ry(s){let t=new WeakMap;function e(i,r=0){let a=t.get(i),o;return a===void 0?(o=new zf(s),t.set(i,[o])):r>=a.length?(o=new zf(s),a.push(o)):o=a[r],o}function n(){t=new WeakMap}return{get:e,dispose:n}}var ay=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,oy=`uniform sampler2D shadow_pass;
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
}`,ly=[new E(1,0,0),new E(-1,0,0),new E(0,1,0),new E(0,-1,0),new E(0,0,1),new E(0,0,-1)],cy=[new E(0,-1,0),new E(0,-1,0),new E(0,0,1),new E(0,0,-1),new E(0,-1,0),new E(0,-1,0)],kf=new ce,ka=new E,cu=new E;function hy(s,t,e){let n=new Xs,i=new it,r=new it,a=new Ae,o=new rl,c=new al,l={},h=e.maxTextureSize,d={[Ni]:Oe,[Oe]:Ni,[ze]:ze},u=new Ee({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new it},radius:{value:4}},vertexShader:ay,fragmentShader:oy}),f=u.clone();f.defines.HORIZONTAL_PASS=1;let p=new _e;p.setAttribute("position",new De(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let _=new Tt(p,u),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=ss;let g=this.type;this.render=function(b,P,v){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||b.length===0)return;this.type===Pd&&(kt("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=ss);let A=s.getRenderTarget(),I=s.getActiveCubeFace(),N=s.getActiveMipmapLevel(),O=s.state;O.setBlending(An),O.buffers.depth.getReversed()===!0?O.buffers.color.setClear(0,0,0,0):O.buffers.color.setClear(1,1,1,1),O.buffers.depth.setTest(!0),O.setScissorTest(!1);let L=g!==this.type;L&&P.traverse(function(C){C.material&&(Array.isArray(C.material)?C.material.forEach(F=>F.needsUpdate=!0):C.material.needsUpdate=!0)});for(let C=0,F=b.length;C<F;C++){let k=b[C],V=k.shadow;if(V===void 0){kt("WebGLShadowMap:",k,"has no shadow.");continue}if(V.autoUpdate===!1&&V.needsUpdate===!1)continue;i.copy(V.mapSize);let j=V.getFrameExtents();i.multiply(j),r.copy(V.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(r.x=Math.floor(h/j.x),i.x=r.x*j.x,V.mapSize.x=r.x),i.y>h&&(r.y=Math.floor(h/j.y),i.y=r.y*j.y,V.mapSize.y=r.y));let q=s.state.buffers.depth.getReversed();if(V.camera._reversedDepth=q,V.map===null||L===!0){if(V.map!==null&&(V.map.depthTexture!==null&&(V.map.depthTexture.dispose(),V.map.depthTexture=null),V.map.dispose()),this.type===Qs){if(k.isPointLight){kt("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}V.map=new Fe(i.x,i.y,{format:zi,type:Ke,minFilter:Ze,magFilter:Ze,generateMipmaps:!1}),V.map.texture.name=k.name+".shadowMap",V.map.depthTexture=new Ci(i.x,i.y,Rn),V.map.depthTexture.name=k.name+".shadowMapDepth",V.map.depthTexture.format=jn,V.map.depthTexture.compareFunction=null,V.map.depthTexture.minFilter=qe,V.map.depthTexture.magFilter=qe}else k.isPointLight?(V.map=new uc(i.x),V.map.depthTexture=new Ko(i.x,Wn)):(V.map=new Fe(i.x,i.y),V.map.depthTexture=new Ci(i.x,i.y,Wn)),V.map.depthTexture.name=k.name+".shadowMap",V.map.depthTexture.format=jn,this.type===ss?(V.map.depthTexture.compareFunction=q?lc:oc,V.map.depthTexture.minFilter=Ze,V.map.depthTexture.magFilter=Ze):(V.map.depthTexture.compareFunction=null,V.map.depthTexture.minFilter=qe,V.map.depthTexture.magFilter=qe);V.camera.updateProjectionMatrix()}V.map.isWebGLCubeRenderTarget!==!0&&(V.map.width!==i.x||V.map.height!==i.y)&&V.map.setSize(i.x,i.y);let Z=V.map.isWebGLCubeRenderTarget?6:V.getViewportCount();k.isPointLight!==!0&&V.updateMatrices(k,v);for(let K=0;K<Z;K++){let At=V.getCamera(K);if(k.isPointLight){let yt=V.camera,se=V.matrix,Yt=k.distance||yt.far;Yt!==yt.far&&(yt.far=Yt,yt.updateProjectionMatrix()),ka.setFromMatrixPosition(k.matrixWorld),yt.position.copy(ka),cu.copy(yt.position),cu.add(ly[K]),yt.up.copy(cy[K]),yt.lookAt(cu),yt.updateMatrixWorld(),se.makeTranslation(-ka.x,-ka.y,-ka.z),kf.multiplyMatrices(yt.projectionMatrix,yt.matrixWorldInverse),V._frustum.setFromProjectionMatrix(kf,yt.coordinateSystem,yt.reversedDepth)}if(V.map.isWebGLCubeRenderTarget)s.setRenderTarget(V.map,K),s.clear();else{K===0&&(s.setRenderTarget(V.map),s.clear());let yt=V.getViewport(K);a.set(r.x*yt.x,r.y*yt.y,r.x*yt.z,r.y*yt.w),O.viewport(a)}n=V.getFrustum(K),y(P,v,At,k,this.type)}V.isPointLightShadow!==!0&&this.type===Qs&&M(V,v),V.needsUpdate=!1}g=this.type,m.needsUpdate=!1,s.setRenderTarget(A,I,N)};function M(b,P){let v=t.update(_);u.defines.VSM_SAMPLES!==b.blurSamples&&(u.defines.VSM_SAMPLES=b.blurSamples,f.defines.VSM_SAMPLES=b.blurSamples,u.needsUpdate=!0,f.needsUpdate=!0),b.mapPass===null?b.mapPass=new Fe(i.x,i.y,{format:zi,type:Ke}):(b.mapPass.width!==b.map.width||b.mapPass.height!==b.map.height)&&b.mapPass.setSize(b.map.width,b.map.height),u.uniforms.shadow_pass.value=b.map.depthTexture,u.uniforms.resolution.value.set(b.map.width,b.map.height),u.uniforms.radius.value=b.radius,s.setRenderTarget(b.mapPass),s.clear(),s.renderBufferDirect(P,null,v,u,_,null),f.uniforms.shadow_pass.value=b.mapPass.texture,f.uniforms.resolution.value.set(b.map.width,b.map.height),f.uniforms.radius.value=b.radius,s.setRenderTarget(b.map),s.clear(),s.renderBufferDirect(P,null,v,f,_,null)}function w(b,P,v,A){let I=null,N=v.isPointLight===!0?b.customDistanceMaterial:b.customDepthMaterial;if(N!==void 0)I=N;else if(I=v.isPointLight===!0?c:o,s.localClippingEnabled&&P.clipShadows===!0&&Array.isArray(P.clippingPlanes)&&P.clippingPlanes.length!==0||P.displacementMap&&P.displacementScale!==0||P.alphaMap&&P.alphaTest>0||P.map&&P.alphaTest>0||P.alphaToCoverage===!0){let O=I.uuid,L=P.uuid,C=l[O];C===void 0&&(C={},l[O]=C);let F=C[L];F===void 0&&(F=I.clone(),C[L]=F,P.addEventListener("dispose",T)),I=F}if(I.visible=P.visible,I.wireframe=P.wireframe,A===Qs?I.side=P.shadowSide!==null?P.shadowSide:P.side:I.side=P.shadowSide!==null?P.shadowSide:d[P.side],I.alphaMap=P.alphaMap,I.alphaTest=P.alphaToCoverage===!0?.5:P.alphaTest,I.map=P.map,I.clipShadows=P.clipShadows,I.clippingPlanes=P.clippingPlanes,I.clipIntersection=P.clipIntersection,I.displacementMap=P.displacementMap,I.displacementScale=P.displacementScale,I.displacementBias=P.displacementBias,I.wireframeLinewidth=P.wireframeLinewidth,I.linewidth=P.linewidth,v.isPointLight===!0&&I.isMeshDistanceMaterial===!0){let O=s.properties.get(I);O.light=v}return I}function y(b,P,v,A,I){if(b.visible===!1)return;if(b.layers.test(P.layers)&&(b.isMesh||b.isLine||b.isPoints)&&(b.castShadow||b.receiveShadow&&I===Qs)&&(!b.frustumCulled||b.intersectsFrustum(n))){b.modelViewMatrix.multiplyMatrices(v.matrixWorldInverse,b.matrixWorld);let L=t.update(b),C=b.material;if(Array.isArray(C)){let F=L.groups;for(let k=0,V=F.length;k<V;k++){let j=F[k],q=C[j.materialIndex];if(q&&q.visible){let Z=w(b,q,A,I);b.onBeforeShadow(s,b,P,v,L,Z,j),s.renderBufferDirect(v,null,L,Z,b,j),b.onAfterShadow(s,b,P,v,L,Z,j)}}}else if(C.visible){let F=w(b,C,A,I);b.onBeforeShadow(s,b,P,v,L,F,null),s.renderBufferDirect(v,null,L,F,b,null),b.onAfterShadow(s,b,P,v,L,F,null)}}let O=b.children;for(let L=0,C=O.length;L<C;L++)y(O[L],P,v,A,I)}function T(b){b.target.removeEventListener("dispose",T);for(let v in l){let A=l[v],I=b.target.uuid;I in A&&(A[I].dispose(),delete A[I])}}}function uy(s,t){function e(){let B=!1,mt=new Ae,Q=null,gt=new Ae(0,0,0,0);return{setMask:function(bt){Q!==bt&&!B&&(s.colorMask(bt,bt,bt,bt),Q=bt)},setLocked:function(bt){B=bt},setClear:function(bt,st,Ut,It,ge){ge===!0&&(bt*=It,st*=It,Ut*=It),mt.set(bt,st,Ut,It),gt.equals(mt)===!1&&(s.clearColor(bt,st,Ut,It),gt.copy(mt))},reset:function(){B=!1,Q=null,gt.set(-1,0,0,0)}}}function n(){let B=!1,mt=!1,Q=null,gt=null,bt=null;return{setReversed:function(st){if(mt!==st){let Ut=t.get("EXT_clip_control");st?Ut.clipControlEXT(Ut.LOWER_LEFT_EXT,Ut.ZERO_TO_ONE_EXT):Ut.clipControlEXT(Ut.LOWER_LEFT_EXT,Ut.NEGATIVE_ONE_TO_ONE_EXT),mt=st;let It=bt;bt=null,this.setClear(It)}},getReversed:function(){return mt},setTest:function(st){st?tt(s.DEPTH_TEST):xt(s.DEPTH_TEST)},setMask:function(st){Q!==st&&!B&&(s.depthMask(st),Q=st)},setFunc:function(st){if(mt&&(st=uf[st]),gt!==st){switch(st){case Oo:s.depthFunc(s.NEVER);break;case zo:s.depthFunc(s.ALWAYS);break;case ko:s.depthFunc(s.LESS);break;case Os:s.depthFunc(s.LEQUAL);break;case Vo:s.depthFunc(s.EQUAL);break;case Ho:s.depthFunc(s.GEQUAL);break;case Go:s.depthFunc(s.GREATER);break;case Wo:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}gt=st}},setLocked:function(st){B=st},setClear:function(st){bt!==st&&(bt=st,mt&&(st=1-st),s.clearDepth(st))},reset:function(){B=!1,Q=null,gt=null,bt=null,mt=!1}}}function i(){let B=!1,mt=null,Q=null,gt=null,bt=null,st=null,Ut=null,It=null,ge=null;return{setTest:function(ue){B||(ue?tt(s.STENCIL_TEST):xt(s.STENCIL_TEST))},setMask:function(ue){mt!==ue&&!B&&(s.stencilMask(ue),mt=ue)},setFunc:function(ue,Dn,Yn){(Q!==ue||gt!==Dn||bt!==Yn)&&(s.stencilFunc(ue,Dn,Yn),Q=ue,gt=Dn,bt=Yn)},setOp:function(ue,Dn,Yn){(st!==ue||Ut!==Dn||It!==Yn)&&(s.stencilOp(ue,Dn,Yn),st=ue,Ut=Dn,It=Yn)},setLocked:function(ue){B=ue},setClear:function(ue){ge!==ue&&(s.clearStencil(ue),ge=ue)},reset:function(){B=!1,mt=null,Q=null,gt=null,bt=null,st=null,Ut=null,It=null,ge=null}}}let r=new e,a=new n,o=new i,c=new WeakMap,l=new WeakMap,h={},d={},u={},f=new WeakMap,p=[],_=null,m=!1,g=null,M=null,w=null,y=null,T=null,b=null,P=null,v=new ht(0,0,0),A=0,I=!1,N=null,O=null,L=null,C=null,F=null,k=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS),V=!1,j=0,q=s.getParameter(s.VERSION);q.indexOf("WebGL")!==-1?(j=parseFloat(/^WebGL (\d)/.exec(q)[1]),V=j>=1):q.indexOf("OpenGL ES")!==-1&&(j=parseFloat(/^OpenGL ES (\d)/.exec(q)[1]),V=j>=2);let Z=null,K={},At=s.getParameter(s.SCISSOR_BOX),yt=s.getParameter(s.VIEWPORT),se=new Ae().fromArray(At),Yt=new Ae().fromArray(yt);function ne(B,mt,Q,gt){let bt=new Uint8Array(4),st=s.createTexture();s.bindTexture(B,st),s.texParameteri(B,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(B,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let Ut=0;Ut<Q;Ut++)B===s.TEXTURE_3D||B===s.TEXTURE_2D_ARRAY?s.texImage3D(mt,0,s.RGBA,1,1,gt,0,s.RGBA,s.UNSIGNED_BYTE,bt):s.texImage2D(mt+Ut,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,bt);return st}let Y={};Y[s.TEXTURE_2D]=ne(s.TEXTURE_2D,s.TEXTURE_2D,1),Y[s.TEXTURE_CUBE_MAP]=ne(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),Y[s.TEXTURE_2D_ARRAY]=ne(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),Y[s.TEXTURE_3D]=ne(s.TEXTURE_3D,s.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),tt(s.DEPTH_TEST),a.setFunc(Os),ot(!1),ct(Dh),tt(s.CULL_FACE),rt(An);function tt(B){h[B]!==!0&&(s.enable(B),h[B]=!0)}function xt(B){h[B]!==!1&&(s.disable(B),h[B]=!1)}function Bt(B,mt){return u[B]!==mt?(s.bindFramebuffer(B,mt),u[B]=mt,B===s.DRAW_FRAMEBUFFER&&(u[s.FRAMEBUFFER]=mt),B===s.FRAMEBUFFER&&(u[s.DRAW_FRAMEBUFFER]=mt),!0):!1}function wt(B,mt){let Q=p,gt=!1;if(B){Q=f.get(mt),Q===void 0&&(Q=[],f.set(mt,Q));let bt=B.textures;if(Q.length!==bt.length||Q[0]!==s.COLOR_ATTACHMENT0){for(let st=0,Ut=bt.length;st<Ut;st++)Q[st]=s.COLOR_ATTACHMENT0+st;Q.length=bt.length,gt=!0}}else Q[0]!==s.BACK&&(Q[0]=s.BACK,gt=!0);gt&&s.drawBuffers(Q)}function Vt(B){return _!==B?(s.useProgram(B),_=B,!0):!1}let le={[rs]:s.FUNC_ADD,[Ld]:s.FUNC_SUBTRACT,[Dd]:s.FUNC_REVERSE_SUBTRACT};le[Nd]=s.MIN,le[Ud]=s.MAX;let et={[Fd]:s.ZERO,[Bd]:s.ONE,[Od]:s.SRC_COLOR,[Fh]:s.SRC_ALPHA,[Wd]:s.SRC_ALPHA_SATURATE,[Hd]:s.DST_COLOR,[kd]:s.DST_ALPHA,[zd]:s.ONE_MINUS_SRC_COLOR,[Bh]:s.ONE_MINUS_SRC_ALPHA,[Gd]:s.ONE_MINUS_DST_COLOR,[Vd]:s.ONE_MINUS_DST_ALPHA,[Xd]:s.CONSTANT_COLOR,[qd]:s.ONE_MINUS_CONSTANT_COLOR,[Yd]:s.CONSTANT_ALPHA,[$d]:s.ONE_MINUS_CONSTANT_ALPHA};function rt(B,mt,Q,gt,bt,st,Ut,It,ge,ue){if(B===An){m===!0&&(xt(s.BLEND),m=!1);return}if(m===!1&&(tt(s.BLEND),m=!0),B!==Id){if(B!==g||ue!==I){if((M!==rs||T!==rs)&&(s.blendEquation(s.FUNC_ADD),M=rs,T=rs),ue)switch(B){case Ui:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case pn:s.blendFunc(s.ONE,s.ONE);break;case Nh:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case Uh:s.blendFuncSeparate(s.DST_COLOR,s.ONE_MINUS_SRC_ALPHA,s.ZERO,s.ONE);break;default:Ht("WebGLState: Invalid blending: ",B);break}else switch(B){case Ui:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case pn:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE,s.ONE,s.ONE);break;case Nh:Ht("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Uh:Ht("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Ht("WebGLState: Invalid blending: ",B);break}w=null,y=null,b=null,P=null,v.set(0,0,0),A=0,g=B,I=ue}return}bt=bt||mt,st=st||Q,Ut=Ut||gt,(mt!==M||bt!==T)&&(s.blendEquationSeparate(le[mt],le[bt]),M=mt,T=bt),(Q!==w||gt!==y||st!==b||Ut!==P)&&(s.blendFuncSeparate(et[Q],et[gt],et[st],et[Ut]),w=Q,y=gt,b=st,P=Ut),(It.equals(v)===!1||ge!==A)&&(s.blendColor(It.r,It.g,It.b,ge),v.copy(It),A=ge),g=B,I=!1}function at(B,mt){B.side===ze?xt(s.CULL_FACE):tt(s.CULL_FACE);let Q=B.side===Oe;mt&&(Q=!Q),ot(Q),B.blending===Ui&&B.transparent===!1?rt(An):rt(B.blending,B.blendEquation,B.blendSrc,B.blendDst,B.blendEquationAlpha,B.blendSrcAlpha,B.blendDstAlpha,B.blendColor,B.blendAlpha,B.premultipliedAlpha),a.setFunc(B.depthFunc),a.setTest(B.depthTest),a.setMask(B.depthWrite),r.setMask(B.colorWrite);let gt=B.stencilWrite;o.setTest(gt),gt&&(o.setMask(B.stencilWriteMask),o.setFunc(B.stencilFunc,B.stencilRef,B.stencilFuncMask),o.setOp(B.stencilFail,B.stencilZFail,B.stencilZPass)),Ft(B.polygonOffset,B.polygonOffsetFactor,B.polygonOffsetUnits),B.alphaToCoverage===!0?tt(s.SAMPLE_ALPHA_TO_COVERAGE):xt(s.SAMPLE_ALPHA_TO_COVERAGE)}function ot(B){N!==B&&(B?s.frontFace(s.CW):s.frontFace(s.CCW),N=B)}function ct(B){B!==Rd?(tt(s.CULL_FACE),B!==O&&(B===Dh?s.cullFace(s.BACK):B===Cd?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):xt(s.CULL_FACE),O=B}function Ot(B){B!==L&&(V&&s.lineWidth(B),L=B)}function Ft(B,mt,Q){B?(tt(s.POLYGON_OFFSET_FILL),(C!==mt||F!==Q)&&(C=mt,F=Q,a.getReversed()&&(mt=-mt),s.polygonOffset(mt,Q))):xt(s.POLYGON_OFFSET_FILL)}function Gt(B){B?tt(s.SCISSOR_TEST):xt(s.SCISSOR_TEST)}function Xt(B){B===void 0&&(B=s.TEXTURE0+k-1),Z!==B&&(s.activeTexture(B),Z=B)}function D(B,mt,Q){Q===void 0&&(Z===null?Q=s.TEXTURE0+k-1:Q=Z);let gt=K[Q];gt===void 0&&(gt={type:void 0,texture:void 0},K[Q]=gt),(gt.type!==B||gt.texture!==mt)&&(Z!==Q&&(s.activeTexture(Q),Z=Q),s.bindTexture(B,mt||Y[B]),gt.type=B,gt.texture=mt)}function he(){let B=K[Z];B!==void 0&&B.type!==void 0&&(s.bindTexture(B.type,null),B.type=void 0,B.texture=void 0)}function te(){try{s.compressedTexImage2D(...arguments)}catch(B){Ht("WebGLState:",B)}}function R(){try{s.compressedTexImage3D(...arguments)}catch(B){Ht("WebGLState:",B)}}function x(){try{s.texSubImage2D(...arguments)}catch(B){Ht("WebGLState:",B)}}function z(){try{s.texSubImage3D(...arguments)}catch(B){Ht("WebGLState:",B)}}function W(){try{s.compressedTexSubImage2D(...arguments)}catch(B){Ht("WebGLState:",B)}}function $(){try{s.compressedTexSubImage3D(...arguments)}catch(B){Ht("WebGLState:",B)}}function lt(){try{s.texStorage2D(...arguments)}catch(B){Ht("WebGLState:",B)}}function dt(){try{s.texStorage3D(...arguments)}catch(B){Ht("WebGLState:",B)}}function J(){try{s.texImage2D(...arguments)}catch(B){Ht("WebGLState:",B)}}function nt(){try{s.texImage3D(...arguments)}catch(B){Ht("WebGLState:",B)}}function ft(B){return d[B]!==void 0?d[B]:s.getParameter(B)}function Dt(B,mt){d[B]!==mt&&(s.pixelStorei(B,mt),d[B]=mt)}function _t(B){se.equals(B)===!1&&(s.scissor(B.x,B.y,B.z,B.w),se.copy(B))}function pt(B){Yt.equals(B)===!1&&(s.viewport(B.x,B.y,B.z,B.w),Yt.copy(B))}function Nt(B,mt){let Q=l.get(mt);Q===void 0&&(Q=new WeakMap,l.set(mt,Q));let gt=Q.get(B);gt===void 0&&(gt=s.getUniformBlockIndex(mt,B.name),Q.set(B,gt))}function zt(B,mt){let gt=l.get(mt).get(B);c.get(mt)!==gt&&(s.uniformBlockBinding(mt,gt,B.__bindingPointIndex),c.set(mt,gt))}function qt(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),a.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),s.pixelStorei(s.PACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,!1),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,s.BROWSER_DEFAULT_WEBGL),s.pixelStorei(s.PACK_ROW_LENGTH,0),s.pixelStorei(s.PACK_SKIP_PIXELS,0),s.pixelStorei(s.PACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_ROW_LENGTH,0),s.pixelStorei(s.UNPACK_IMAGE_HEIGHT,0),s.pixelStorei(s.UNPACK_SKIP_PIXELS,0),s.pixelStorei(s.UNPACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_SKIP_IMAGES,0),h={},d={},Z=null,K={},u={},f=new WeakMap,p=[],_=null,m=!1,g=null,M=null,w=null,y=null,T=null,b=null,P=null,v=new ht(0,0,0),A=0,I=!1,N=null,O=null,L=null,C=null,F=null,se.set(0,0,s.canvas.width,s.canvas.height),Yt.set(0,0,s.canvas.width,s.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:tt,disable:xt,bindFramebuffer:Bt,drawBuffers:wt,useProgram:Vt,setBlending:rt,setMaterial:at,setFlipSided:ot,setCullFace:ct,setLineWidth:Ot,setPolygonOffset:Ft,setScissorTest:Gt,activeTexture:Xt,bindTexture:D,unbindTexture:he,compressedTexImage2D:te,compressedTexImage3D:R,texImage2D:J,texImage3D:nt,pixelStorei:Dt,getParameter:ft,updateUBOMapping:Nt,uniformBlockBinding:zt,texStorage2D:lt,texStorage3D:dt,texSubImage2D:x,texSubImage3D:z,compressedTexSubImage2D:W,compressedTexSubImage3D:$,scissor:_t,viewport:pt,reset:qt}}function dy(s,t,e,n,i,r,a){let o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new it,h=new WeakMap,d=new Set,u,f=new WeakMap,p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function _(R,x){return p?new OffscreenCanvas(R,x):Gr("canvas")}function m(R,x,z){let W=1,$=te(R);if(($.width>z||$.height>z)&&(W=z/Math.max($.width,$.height)),W<1)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap||typeof VideoFrame<"u"&&R instanceof VideoFrame){let lt=Math.floor(W*$.width),dt=Math.floor(W*$.height);u===void 0&&(u=_(lt,dt));let J=x?_(lt,dt):u;return J.width=lt,J.height=dt,J.getContext("2d").drawImage(R,0,0,lt,dt),kt("WebGLRenderer: Texture has been resized from ("+$.width+"x"+$.height+") to ("+lt+"x"+dt+")."),J}else return"data"in R&&kt("WebGLRenderer: Image in DataTexture is too big ("+$.width+"x"+$.height+")."),R;return R}function g(R){return R.generateMipmaps}function M(R){s.generateMipmap(R)}function w(R){return R.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:R.isWebGL3DRenderTarget?s.TEXTURE_3D:R.isWebGLArrayRenderTarget||R.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function y(R,x,z,W,$,lt=!1){if(R!==null){if(s[R]!==void 0)return s[R];kt("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let dt;W&&(dt=t.get("EXT_texture_norm16"),dt||kt("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let J=x;if(x===s.RED&&(z===s.FLOAT&&(J=s.R32F),z===s.HALF_FLOAT&&(J=s.R16F),z===s.UNSIGNED_BYTE&&(J=s.R8),z===s.UNSIGNED_SHORT&&dt&&(J=dt.R16_EXT),z===s.SHORT&&dt&&(J=dt.R16_SNORM_EXT)),x===s.RED_INTEGER&&(z===s.UNSIGNED_BYTE&&(J=s.R8UI),z===s.UNSIGNED_SHORT&&(J=s.R16UI),z===s.UNSIGNED_INT&&(J=s.R32UI),z===s.BYTE&&(J=s.R8I),z===s.SHORT&&(J=s.R16I),z===s.INT&&(J=s.R32I)),x===s.RG&&(z===s.FLOAT&&(J=s.RG32F),z===s.HALF_FLOAT&&(J=s.RG16F),z===s.UNSIGNED_BYTE&&(J=s.RG8),z===s.UNSIGNED_SHORT&&dt&&(J=dt.RG16_EXT),z===s.SHORT&&dt&&(J=dt.RG16_SNORM_EXT)),x===s.RG_INTEGER&&(z===s.UNSIGNED_BYTE&&(J=s.RG8UI),z===s.UNSIGNED_SHORT&&(J=s.RG16UI),z===s.UNSIGNED_INT&&(J=s.RG32UI),z===s.BYTE&&(J=s.RG8I),z===s.SHORT&&(J=s.RG16I),z===s.INT&&(J=s.RG32I)),x===s.RGB_INTEGER&&(z===s.UNSIGNED_BYTE&&(J=s.RGB8UI),z===s.UNSIGNED_SHORT&&(J=s.RGB16UI),z===s.UNSIGNED_INT&&(J=s.RGB32UI),z===s.BYTE&&(J=s.RGB8I),z===s.SHORT&&(J=s.RGB16I),z===s.INT&&(J=s.RGB32I)),x===s.RGBA_INTEGER&&(z===s.UNSIGNED_BYTE&&(J=s.RGBA8UI),z===s.UNSIGNED_SHORT&&(J=s.RGBA16UI),z===s.UNSIGNED_INT&&(J=s.RGBA32UI),z===s.BYTE&&(J=s.RGBA8I),z===s.SHORT&&(J=s.RGBA16I),z===s.INT&&(J=s.RGBA32I)),x===s.RGB&&(z===s.UNSIGNED_SHORT&&dt&&(J=dt.RGB16_EXT),z===s.SHORT&&dt&&(J=dt.RGB16_SNORM_EXT),z===s.UNSIGNED_INT_5_9_9_9_REV&&(J=s.RGB9_E5),z===s.UNSIGNED_INT_10F_11F_11F_REV&&(J=s.R11F_G11F_B10F)),x===s.RGBA){let nt=lt?Hr:Qt.getTransfer($);z===s.FLOAT&&(J=s.RGBA32F),z===s.HALF_FLOAT&&(J=s.RGBA16F),z===s.UNSIGNED_BYTE&&(J=nt===oe?s.SRGB8_ALPHA8:s.RGBA8),z===s.UNSIGNED_SHORT&&dt&&(J=dt.RGBA16_EXT),z===s.SHORT&&dt&&(J=dt.RGBA16_SNORM_EXT),z===s.UNSIGNED_SHORT_4_4_4_4&&(J=s.RGBA4),z===s.UNSIGNED_SHORT_5_5_5_1&&(J=s.RGB5_A1)}return(J===s.R16F||J===s.R32F||J===s.RG16F||J===s.RG32F||J===s.RGBA16F||J===s.RGBA32F)&&t.get("EXT_color_buffer_float"),J}function T(R,x){let z;return R?x===null||x===Wn||x===tr?z=s.DEPTH24_STENCIL8:x===Rn?z=s.DEPTH32F_STENCIL8:x===js&&(z=s.DEPTH24_STENCIL8,kt("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):x===null||x===Wn||x===tr?z=s.DEPTH_COMPONENT24:x===Rn?z=s.DEPTH_COMPONENT32F:x===js&&(z=s.DEPTH_COMPONENT16),z}function b(R,x){return g(R)===!0||R.isFramebufferTexture&&R.minFilter!==qe&&R.minFilter!==Ze?Math.log2(Math.max(x.width,x.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?x.mipmaps.length:1}function P(R){let x=R.target;x.removeEventListener("dispose",P),A(x),x.isVideoTexture&&h.delete(x),x.isHTMLTexture&&d.delete(x)}function v(R){let x=R.target;x.removeEventListener("dispose",v),N(x)}function A(R){let x=n.get(R);if(x.__webglInit===void 0)return;let z=R.source,W=f.get(z);if(W){let $=W[x.__cacheKey];$.usedTimes--,$.usedTimes===0&&I(R),Object.keys(W).length===0&&f.delete(z)}n.remove(R)}function I(R){let x=n.get(R);s.deleteTexture(x.__webglTexture);let z=R.source,W=f.get(z);delete W[x.__cacheKey],a.memory.textures--}function N(R){let x=n.get(R);if(R.depthTexture&&(R.depthTexture.dispose(),n.remove(R.depthTexture)),R.isWebGLCubeRenderTarget)for(let W=0;W<6;W++){if(Array.isArray(x.__webglFramebuffer[W]))for(let $=0;$<x.__webglFramebuffer[W].length;$++)s.deleteFramebuffer(x.__webglFramebuffer[W][$]);else s.deleteFramebuffer(x.__webglFramebuffer[W]);x.__webglDepthbuffer&&s.deleteRenderbuffer(x.__webglDepthbuffer[W])}else{if(Array.isArray(x.__webglFramebuffer))for(let W=0;W<x.__webglFramebuffer.length;W++)s.deleteFramebuffer(x.__webglFramebuffer[W]);else s.deleteFramebuffer(x.__webglFramebuffer);if(x.__webglDepthbuffer&&s.deleteRenderbuffer(x.__webglDepthbuffer),x.__webglMultisampledFramebuffer&&s.deleteFramebuffer(x.__webglMultisampledFramebuffer),x.__webglColorRenderbuffer)for(let W=0;W<x.__webglColorRenderbuffer.length;W++)x.__webglColorRenderbuffer[W]&&s.deleteRenderbuffer(x.__webglColorRenderbuffer[W]);x.__webglDepthRenderbuffer&&s.deleteRenderbuffer(x.__webglDepthRenderbuffer)}let z=R.textures;for(let W=0,$=z.length;W<$;W++){let lt=n.get(z[W]);lt.__webglTexture&&(s.deleteTexture(lt.__webglTexture),a.memory.textures--),n.remove(z[W])}n.remove(R)}let O=0;function L(){O=0}function C(){return O}function F(R){O=R}function k(){let R=O;return R>=i.maxTextures&&kt("WebGLTextures: Trying to use "+(R+1)+" texture units while this GPU supports only "+i.maxTextures),O+=1,R}function V(R){let x=[];return x.push(R.wrapS),x.push(R.wrapT),x.push(R.wrapR||0),x.push(R.magFilter),x.push(R.minFilter),x.push(R.anisotropy),x.push(R.internalFormat),x.push(R.format),x.push(R.type),x.push(R.generateMipmaps),x.push(R.premultiplyAlpha),x.push(R.flipY),x.push(R.unpackAlignment),x.push(R.colorSpace),x.join()}function j(R,x){let z=n.get(R);if(R.isVideoTexture&&D(R),R.isRenderTargetTexture===!1&&R.isExternalTexture!==!0&&R.version>0&&z.__version!==R.version){let W=R.image;if(W===null)kt("WebGLRenderer: Texture marked for update but no image data found.");else if(W.complete===!1)kt("WebGLRenderer: Texture marked for update but image is incomplete");else{xt(z,R,x);return}}else R.isExternalTexture&&(z.__webglTexture=R.sourceTexture?R.sourceTexture:null);e.bindTexture(s.TEXTURE_2D,z.__webglTexture,s.TEXTURE0+x)}function q(R,x){let z=n.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&z.__version!==R.version){xt(z,R,x);return}else R.isExternalTexture&&(z.__webglTexture=R.sourceTexture?R.sourceTexture:null);e.bindTexture(s.TEXTURE_2D_ARRAY,z.__webglTexture,s.TEXTURE0+x)}function Z(R,x){let z=n.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&z.__version!==R.version){xt(z,R,x);return}e.bindTexture(s.TEXTURE_3D,z.__webglTexture,s.TEXTURE0+x)}function K(R,x){let z=n.get(R);if(R.isCubeDepthTexture!==!0&&R.version>0&&z.__version!==R.version){Bt(z,R,x);return}e.bindTexture(s.TEXTURE_CUBE_MAP,z.__webglTexture,s.TEXTURE0+x)}let At={[Ri]:s.REPEAT,[Zn]:s.CLAMP_TO_EDGE,[Xo]:s.MIRRORED_REPEAT},yt={[qe]:s.NEAREST,[Kd]:s.NEAREST_MIPMAP_NEAREST,[Ia]:s.NEAREST_MIPMAP_LINEAR,[Ze]:s.LINEAR,[bl]:s.LINEAR_MIPMAP_NEAREST,[Bi]:s.LINEAR_MIPMAP_LINEAR},se={[ef]:s.NEVER,[of]:s.ALWAYS,[nf]:s.LESS,[oc]:s.LEQUAL,[sf]:s.EQUAL,[lc]:s.GEQUAL,[rf]:s.GREATER,[af]:s.NOTEQUAL};function Yt(R,x){if(x.type===Rn&&t.has("OES_texture_float_linear")===!1&&(x.magFilter===Ze||x.magFilter===bl||x.magFilter===Ia||x.magFilter===Bi||x.minFilter===Ze||x.minFilter===bl||x.minFilter===Ia||x.minFilter===Bi)&&kt("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(R,s.TEXTURE_WRAP_S,At[x.wrapS]),s.texParameteri(R,s.TEXTURE_WRAP_T,At[x.wrapT]),(R===s.TEXTURE_3D||R===s.TEXTURE_2D_ARRAY)&&s.texParameteri(R,s.TEXTURE_WRAP_R,At[x.wrapR]),s.texParameteri(R,s.TEXTURE_MAG_FILTER,yt[x.magFilter]),s.texParameteri(R,s.TEXTURE_MIN_FILTER,yt[x.minFilter]),x.compareFunction&&(s.texParameteri(R,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(R,s.TEXTURE_COMPARE_FUNC,se[x.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(x.magFilter===qe||x.minFilter!==Ia&&x.minFilter!==Bi||x.type===Rn&&t.has("OES_texture_float_linear")===!1)return;if(x.anisotropy>1||n.get(x).__currentAnisotropy){let z=t.get("EXT_texture_filter_anisotropic");s.texParameterf(R,z.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(x.anisotropy,i.getMaxAnisotropy())),n.get(x).__currentAnisotropy=x.anisotropy}}}function ne(R,x){let z=!1;R.__webglInit===void 0&&(R.__webglInit=!0,x.addEventListener("dispose",P));let W=x.source,$=f.get(W);$===void 0&&($={},f.set(W,$));let lt=V(x);if(lt!==R.__cacheKey){$[lt]===void 0&&($[lt]={texture:s.createTexture(),usedTimes:0},a.memory.textures++,z=!0),$[lt].usedTimes++;let dt=$[R.__cacheKey];dt!==void 0&&($[R.__cacheKey].usedTimes--,dt.usedTimes===0&&I(x)),R.__cacheKey=lt,R.__webglTexture=$[lt].texture}return z}function Y(R,x,z){return Math.floor(Math.floor(R/z)/x)}function tt(R,x,z,W){let lt=R.updateRanges;if(lt.length===0)e.texSubImage2D(s.TEXTURE_2D,0,0,0,x.width,x.height,z,W,x.data);else{lt.sort((Dt,_t)=>Dt.start-_t.start);let dt=0;for(let Dt=1;Dt<lt.length;Dt++){let _t=lt[dt],pt=lt[Dt],Nt=_t.start+_t.count,zt=Y(pt.start,x.width,4),qt=Y(_t.start,x.width,4);pt.start<=Nt+1&&zt===qt&&Y(pt.start+pt.count-1,x.width,4)===zt?_t.count=Math.max(_t.count,pt.start+pt.count-_t.start):(++dt,lt[dt]=pt)}lt.length=dt+1;let J=e.getParameter(s.UNPACK_ROW_LENGTH),nt=e.getParameter(s.UNPACK_SKIP_PIXELS),ft=e.getParameter(s.UNPACK_SKIP_ROWS);e.pixelStorei(s.UNPACK_ROW_LENGTH,x.width);for(let Dt=0,_t=lt.length;Dt<_t;Dt++){let pt=lt[Dt],Nt=Math.floor(pt.start/4),zt=Math.ceil(pt.count/4),qt=Nt%x.width,B=Math.floor(Nt/x.width),mt=zt,Q=1;e.pixelStorei(s.UNPACK_SKIP_PIXELS,qt),e.pixelStorei(s.UNPACK_SKIP_ROWS,B),e.texSubImage2D(s.TEXTURE_2D,0,qt,B,mt,Q,z,W,x.data)}R.clearUpdateRanges(),e.pixelStorei(s.UNPACK_ROW_LENGTH,J),e.pixelStorei(s.UNPACK_SKIP_PIXELS,nt),e.pixelStorei(s.UNPACK_SKIP_ROWS,ft)}}function xt(R,x,z){let W=s.TEXTURE_2D;(x.isDataArrayTexture||x.isCompressedArrayTexture)&&(W=s.TEXTURE_2D_ARRAY),x.isData3DTexture&&(W=s.TEXTURE_3D);let $=ne(R,x),lt=x.source;e.bindTexture(W,R.__webglTexture,s.TEXTURE0+z);let dt=n.get(lt);if(lt.version!==dt.__version||$===!0){if(e.activeTexture(s.TEXTURE0+z),(typeof ImageBitmap<"u"&&x.image instanceof ImageBitmap)===!1){let Q=Qt.getPrimaries(Qt.workingColorSpace),gt=x.colorSpace===gi?null:Qt.getPrimaries(x.colorSpace),bt=x.colorSpace===gi||Q===gt?s.NONE:s.BROWSER_DEFAULT_WEBGL;e.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,x.flipY),e.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),e.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,bt)}e.pixelStorei(s.UNPACK_ALIGNMENT,x.unpackAlignment);let nt=m(x.image,!1,i.maxTextureSize);nt=he(x,nt);let ft=r.convert(x.format,x.colorSpace),Dt=r.convert(x.type),_t=y(x.internalFormat,ft,Dt,x.normalized,x.colorSpace,x.isVideoTexture);Yt(W,x);let pt,Nt=x.mipmaps,zt=x.isVideoTexture!==!0,qt=dt.__version===void 0||$===!0,B=lt.dataReady,mt=b(x,nt);if(x.isDepthTexture)_t=T(x.format===Oi,x.type),qt&&(zt?e.texStorage2D(s.TEXTURE_2D,1,_t,nt.width,nt.height):e.texImage2D(s.TEXTURE_2D,0,_t,nt.width,nt.height,0,ft,Dt,null));else if(x.isDataTexture)if(Nt.length>0){zt&&qt&&e.texStorage2D(s.TEXTURE_2D,mt,_t,Nt[0].width,Nt[0].height);for(let Q=0,gt=Nt.length;Q<gt;Q++)pt=Nt[Q],zt?B&&e.texSubImage2D(s.TEXTURE_2D,Q,0,0,pt.width,pt.height,ft,Dt,pt.data):e.texImage2D(s.TEXTURE_2D,Q,_t,pt.width,pt.height,0,ft,Dt,pt.data);x.generateMipmaps=!1}else zt?(qt&&e.texStorage2D(s.TEXTURE_2D,mt,_t,nt.width,nt.height),B&&tt(x,nt,ft,Dt)):e.texImage2D(s.TEXTURE_2D,0,_t,nt.width,nt.height,0,ft,Dt,nt.data);else if(x.isCompressedTexture)if(x.isCompressedArrayTexture){zt&&qt&&e.texStorage3D(s.TEXTURE_2D_ARRAY,mt,_t,Nt[0].width,Nt[0].height,nt.depth);for(let Q=0,gt=Nt.length;Q<gt;Q++)if(pt=Nt[Q],x.format!==Cn)if(ft!==null)if(zt){if(B)if(x.layerUpdates.size>0){let bt=Qh(pt.width,pt.height,x.format,x.type);for(let st of x.layerUpdates){let Ut=pt.data.subarray(st*bt/pt.data.BYTES_PER_ELEMENT,(st+1)*bt/pt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,Q,0,0,st,pt.width,pt.height,1,ft,Ut)}}else e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,Q,0,0,0,pt.width,pt.height,nt.depth,ft,pt.data)}else e.compressedTexImage3D(s.TEXTURE_2D_ARRAY,Q,_t,pt.width,pt.height,nt.depth,0,pt.data,0,0);else kt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else zt?B&&e.texSubImage3D(s.TEXTURE_2D_ARRAY,Q,0,0,0,pt.width,pt.height,nt.depth,ft,Dt,pt.data):e.texImage3D(s.TEXTURE_2D_ARRAY,Q,_t,pt.width,pt.height,nt.depth,0,ft,Dt,pt.data);x.layerUpdates.size>0&&x.clearLayerUpdates()}else{zt&&qt&&e.texStorage2D(s.TEXTURE_2D,mt,_t,Nt[0].width,Nt[0].height);for(let Q=0,gt=Nt.length;Q<gt;Q++)pt=Nt[Q],x.format!==Cn?ft!==null?zt?B&&e.compressedTexSubImage2D(s.TEXTURE_2D,Q,0,0,pt.width,pt.height,ft,pt.data):e.compressedTexImage2D(s.TEXTURE_2D,Q,_t,pt.width,pt.height,0,pt.data):kt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):zt?B&&e.texSubImage2D(s.TEXTURE_2D,Q,0,0,pt.width,pt.height,ft,Dt,pt.data):e.texImage2D(s.TEXTURE_2D,Q,_t,pt.width,pt.height,0,ft,Dt,pt.data)}else if(x.isDataArrayTexture)if(zt){if(qt&&e.texStorage3D(s.TEXTURE_2D_ARRAY,mt,_t,nt.width,nt.height,nt.depth),B)if(x.layerUpdates.size>0){let Q=Qh(nt.width,nt.height,x.format,x.type);for(let gt of x.layerUpdates){let bt=nt.data.subarray(gt*Q/nt.data.BYTES_PER_ELEMENT,(gt+1)*Q/nt.data.BYTES_PER_ELEMENT);e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,gt,nt.width,nt.height,1,ft,Dt,bt)}x.clearLayerUpdates()}else e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,nt.width,nt.height,nt.depth,ft,Dt,nt.data)}else e.texImage3D(s.TEXTURE_2D_ARRAY,0,_t,nt.width,nt.height,nt.depth,0,ft,Dt,nt.data);else if(x.isData3DTexture)zt?(qt&&e.texStorage3D(s.TEXTURE_3D,mt,_t,nt.width,nt.height,nt.depth),B&&e.texSubImage3D(s.TEXTURE_3D,0,0,0,0,nt.width,nt.height,nt.depth,ft,Dt,nt.data)):e.texImage3D(s.TEXTURE_3D,0,_t,nt.width,nt.height,nt.depth,0,ft,Dt,nt.data);else if(x.isFramebufferTexture){if(qt)if(zt)e.texStorage2D(s.TEXTURE_2D,mt,_t,nt.width,nt.height);else{let Q=nt.width,gt=nt.height;for(let bt=0;bt<mt;bt++)e.texImage2D(s.TEXTURE_2D,bt,_t,Q,gt,0,ft,Dt,null),Q>>=1,gt>>=1}}else if(x.isHTMLTexture){if("texElementImage2D"in s){let Q=s.canvas;if(Q.hasAttribute("layoutsubtree")||Q.setAttribute("layoutsubtree","true"),nt.parentNode!==Q){Q.appendChild(nt),d.add(x),Q.onpaint=gt=>{let bt=gt.changedElements;for(let st of d)bt.includes(st.image)&&(st.needsUpdate=!0)},Q.requestPaint();return}if(s.texElementImage2D.length===3)s.texElementImage2D(s.TEXTURE_2D,s.RGBA8,nt);else{let bt=s.RGBA,st=s.RGBA,Ut=s.UNSIGNED_BYTE;s.texElementImage2D(s.TEXTURE_2D,0,bt,st,Ut,nt)}s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MIN_FILTER,s.LINEAR),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE)}}else if(Nt.length>0){if(zt&&qt){let Q=te(Nt[0]);e.texStorage2D(s.TEXTURE_2D,mt,_t,Q.width,Q.height)}for(let Q=0,gt=Nt.length;Q<gt;Q++)pt=Nt[Q],zt?B&&e.texSubImage2D(s.TEXTURE_2D,Q,0,0,ft,Dt,pt):e.texImage2D(s.TEXTURE_2D,Q,_t,ft,Dt,pt);x.generateMipmaps=!1}else if(zt){if(qt){let Q=te(nt);e.texStorage2D(s.TEXTURE_2D,mt,_t,Q.width,Q.height)}B&&e.texSubImage2D(s.TEXTURE_2D,0,0,0,ft,Dt,nt)}else e.texImage2D(s.TEXTURE_2D,0,_t,ft,Dt,nt);g(x)&&M(W),dt.__version=lt.version,x.onUpdate&&x.onUpdate(x)}R.__version=x.version}function Bt(R,x,z){if(x.image.length!==6)return;let W=ne(R,x),$=x.source;e.bindTexture(s.TEXTURE_CUBE_MAP,R.__webglTexture,s.TEXTURE0+z);let lt=n.get($);if($.version!==lt.__version||W===!0){e.activeTexture(s.TEXTURE0+z);let dt=Qt.getPrimaries(Qt.workingColorSpace),J=x.colorSpace===gi?null:Qt.getPrimaries(x.colorSpace),nt=x.colorSpace===gi||dt===J?s.NONE:s.BROWSER_DEFAULT_WEBGL;e.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,x.flipY),e.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),e.pixelStorei(s.UNPACK_ALIGNMENT,x.unpackAlignment),e.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,nt);let ft=x.isCompressedTexture||x.image[0].isCompressedTexture,Dt=x.image[0]&&x.image[0].isDataTexture,_t=[];for(let st=0;st<6;st++)!ft&&!Dt?_t[st]=m(x.image[st],!0,i.maxCubemapSize):_t[st]=Dt?x.image[st].image:x.image[st],_t[st]=he(x,_t[st]);let pt=_t[0],Nt=r.convert(x.format,x.colorSpace),zt=r.convert(x.type),qt=y(x.internalFormat,Nt,zt,x.normalized,x.colorSpace),B=x.isVideoTexture!==!0,mt=lt.__version===void 0||W===!0,Q=$.dataReady,gt=b(x,pt);Yt(s.TEXTURE_CUBE_MAP,x);let bt;if(ft){B&&mt&&e.texStorage2D(s.TEXTURE_CUBE_MAP,gt,qt,pt.width,pt.height);for(let st=0;st<6;st++){bt=_t[st].mipmaps;for(let Ut=0;Ut<bt.length;Ut++){let It=bt[Ut];x.format!==Cn?Nt!==null?B?Q&&e.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+st,Ut,0,0,It.width,It.height,Nt,It.data):e.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+st,Ut,qt,It.width,It.height,0,It.data):kt("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):B?Q&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+st,Ut,0,0,It.width,It.height,Nt,zt,It.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+st,Ut,qt,It.width,It.height,0,Nt,zt,It.data)}}}else{if(bt=x.mipmaps,B&&mt){bt.length>0&&gt++;let st=te(_t[0]);e.texStorage2D(s.TEXTURE_CUBE_MAP,gt,qt,st.width,st.height)}for(let st=0;st<6;st++)if(Dt){B?Q&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+st,0,0,0,_t[st].width,_t[st].height,Nt,zt,_t[st].data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+st,0,qt,_t[st].width,_t[st].height,0,Nt,zt,_t[st].data);for(let Ut=0;Ut<bt.length;Ut++){let ge=bt[Ut].image[st].image;B?Q&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+st,Ut+1,0,0,ge.width,ge.height,Nt,zt,ge.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+st,Ut+1,qt,ge.width,ge.height,0,Nt,zt,ge.data)}}else{B?Q&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+st,0,0,0,Nt,zt,_t[st]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+st,0,qt,Nt,zt,_t[st]);for(let Ut=0;Ut<bt.length;Ut++){let It=bt[Ut];B?Q&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+st,Ut+1,0,0,Nt,zt,It.image[st]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+st,Ut+1,qt,Nt,zt,It.image[st])}}}g(x)&&M(s.TEXTURE_CUBE_MAP),lt.__version=$.version,x.onUpdate&&x.onUpdate(x)}R.__version=x.version}function wt(R,x,z,W,$,lt){let dt=r.convert(z.format,z.colorSpace),J=r.convert(z.type),nt=y(z.internalFormat,dt,J,z.normalized,z.colorSpace),ft=n.get(x),Dt=n.get(z);if(Dt.__renderTarget=x,!ft.__hasExternalTextures){let _t=Math.max(1,x.width>>lt),pt=Math.max(1,x.height>>lt);$===s.TEXTURE_3D||$===s.TEXTURE_2D_ARRAY?e.texImage3D($,lt,nt,_t,pt,x.depth,0,dt,J,null):e.texImage2D($,lt,nt,_t,pt,0,dt,J,null)}e.bindFramebuffer(s.FRAMEBUFFER,R),Xt(x)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,W,$,Dt.__webglTexture,0,Gt(x)):($===s.TEXTURE_2D||$>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&$<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,W,$,Dt.__webglTexture,lt),e.bindFramebuffer(s.FRAMEBUFFER,null)}function Vt(R,x,z){if(s.bindRenderbuffer(s.RENDERBUFFER,R),x.depthBuffer){let W=x.depthTexture,$=W&&W.isDepthTexture?W.type:null,lt=T(x.stencilBuffer,$),dt=x.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;Xt(x)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,Gt(x),lt,x.width,x.height):z?s.renderbufferStorageMultisample(s.RENDERBUFFER,Gt(x),lt,x.width,x.height):s.renderbufferStorage(s.RENDERBUFFER,lt,x.width,x.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,dt,s.RENDERBUFFER,R)}else{let W=x.textures;for(let $=0;$<W.length;$++){let lt=W[$],dt=r.convert(lt.format,lt.colorSpace),J=r.convert(lt.type),nt=y(lt.internalFormat,dt,J,lt.normalized,lt.colorSpace);Xt(x)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,Gt(x),nt,x.width,x.height):z?s.renderbufferStorageMultisample(s.RENDERBUFFER,Gt(x),nt,x.width,x.height):s.renderbufferStorage(s.RENDERBUFFER,nt,x.width,x.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function le(R,x,z){let W=x.isWebGLCubeRenderTarget===!0;if(e.bindFramebuffer(s.FRAMEBUFFER,R),!(x.depthTexture&&x.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let $=n.get(x.depthTexture);if($.__renderTarget=x,(!$.__webglTexture||x.depthTexture.image.width!==x.width||x.depthTexture.image.height!==x.height)&&(x.depthTexture.image.width=x.width,x.depthTexture.image.height=x.height,x.depthTexture.needsUpdate=!0),W){if($.__webglInit===void 0&&($.__webglInit=!0,x.depthTexture.addEventListener("dispose",P)),$.__webglTexture===void 0){$.__webglTexture=s.createTexture(),e.bindTexture(s.TEXTURE_CUBE_MAP,$.__webglTexture),Yt(s.TEXTURE_CUBE_MAP,x.depthTexture);let ft=r.convert(x.depthTexture.format),Dt=r.convert(x.depthTexture.type),_t;x.depthTexture.format===jn?_t=s.DEPTH_COMPONENT24:x.depthTexture.format===Oi&&(_t=s.DEPTH24_STENCIL8);for(let pt=0;pt<6;pt++)s.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+pt,0,_t,x.width,x.height,0,ft,Dt,null)}}else j(x.depthTexture,0);let lt=$.__webglTexture,dt=Gt(x),J=W?s.TEXTURE_CUBE_MAP_POSITIVE_X+z:s.TEXTURE_2D,nt=x.depthTexture.format===Oi?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;if(x.depthTexture.format===jn)Xt(x)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,nt,J,lt,0,dt):s.framebufferTexture2D(s.FRAMEBUFFER,nt,J,lt,0);else if(x.depthTexture.format===Oi)Xt(x)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,nt,J,lt,0,dt):s.framebufferTexture2D(s.FRAMEBUFFER,nt,J,lt,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function et(R){let x=n.get(R),z=R.isWebGLCubeRenderTarget===!0;if(x.__boundDepthTexture!==R.depthTexture){let W=R.depthTexture;if(x.__depthDisposeCallback&&x.__depthDisposeCallback(),W){let $=()=>{delete x.__boundDepthTexture,delete x.__depthDisposeCallback,W.removeEventListener("dispose",$)};W.addEventListener("dispose",$),x.__depthDisposeCallback=$}x.__boundDepthTexture=W}if(R.depthTexture&&!x.__autoAllocateDepthBuffer)if(z)for(let W=0;W<6;W++)le(x.__webglFramebuffer[W],R,W);else{let W=R.texture.mipmaps;W&&W.length>0?le(x.__webglFramebuffer[0],R,0):le(x.__webglFramebuffer,R,0)}else if(z){x.__webglDepthbuffer=[];for(let W=0;W<6;W++)if(e.bindFramebuffer(s.FRAMEBUFFER,x.__webglFramebuffer[W]),x.__webglDepthbuffer[W]===void 0)x.__webglDepthbuffer[W]=s.createRenderbuffer(),Vt(x.__webglDepthbuffer[W],R,!1);else{let $=R.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,lt=x.__webglDepthbuffer[W];s.bindRenderbuffer(s.RENDERBUFFER,lt),s.framebufferRenderbuffer(s.FRAMEBUFFER,$,s.RENDERBUFFER,lt)}}else{let W=R.texture.mipmaps;if(W&&W.length>0?e.bindFramebuffer(s.FRAMEBUFFER,x.__webglFramebuffer[0]):e.bindFramebuffer(s.FRAMEBUFFER,x.__webglFramebuffer),x.__webglDepthbuffer===void 0)x.__webglDepthbuffer=s.createRenderbuffer(),Vt(x.__webglDepthbuffer,R,!1);else{let $=R.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,lt=x.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,lt),s.framebufferRenderbuffer(s.FRAMEBUFFER,$,s.RENDERBUFFER,lt)}}e.bindFramebuffer(s.FRAMEBUFFER,null)}function rt(R,x,z){let W=n.get(R);x!==void 0&&wt(W.__webglFramebuffer,R,R.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),z!==void 0&&et(R)}function at(R){let x=R.texture,z=n.get(R),W=n.get(x);R.addEventListener("dispose",v);let $=R.textures,lt=R.isWebGLCubeRenderTarget===!0,dt=$.length>1;if(dt||(W.__webglTexture===void 0&&(W.__webglTexture=s.createTexture()),W.__version=x.version,a.memory.textures++),lt){z.__webglFramebuffer=[];for(let J=0;J<6;J++)if(x.mipmaps&&x.mipmaps.length>0){z.__webglFramebuffer[J]=[];for(let nt=0;nt<x.mipmaps.length;nt++)z.__webglFramebuffer[J][nt]=s.createFramebuffer()}else z.__webglFramebuffer[J]=s.createFramebuffer()}else{if(x.mipmaps&&x.mipmaps.length>0){z.__webglFramebuffer=[];for(let J=0;J<x.mipmaps.length;J++)z.__webglFramebuffer[J]=s.createFramebuffer()}else z.__webglFramebuffer=s.createFramebuffer();if(dt)for(let J=0,nt=$.length;J<nt;J++){let ft=n.get($[J]);ft.__webglTexture===void 0&&(ft.__webglTexture=s.createTexture(),a.memory.textures++)}if(R.samples>0&&Xt(R)===!1){z.__webglMultisampledFramebuffer=s.createFramebuffer(),z.__webglColorRenderbuffer=[],e.bindFramebuffer(s.FRAMEBUFFER,z.__webglMultisampledFramebuffer);for(let J=0;J<$.length;J++){let nt=$[J];z.__webglColorRenderbuffer[J]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,z.__webglColorRenderbuffer[J]);let ft=r.convert(nt.format,nt.colorSpace),Dt=r.convert(nt.type),_t=y(nt.internalFormat,ft,Dt,nt.normalized,nt.colorSpace,R.isXRRenderTarget===!0),pt=Gt(R);s.renderbufferStorageMultisample(s.RENDERBUFFER,pt,_t,R.width,R.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+J,s.RENDERBUFFER,z.__webglColorRenderbuffer[J])}s.bindRenderbuffer(s.RENDERBUFFER,null),R.depthBuffer&&(z.__webglDepthRenderbuffer=s.createRenderbuffer(),Vt(z.__webglDepthRenderbuffer,R,!0)),e.bindFramebuffer(s.FRAMEBUFFER,null)}}if(lt){e.bindTexture(s.TEXTURE_CUBE_MAP,W.__webglTexture),Yt(s.TEXTURE_CUBE_MAP,x);for(let J=0;J<6;J++)if(x.mipmaps&&x.mipmaps.length>0)for(let nt=0;nt<x.mipmaps.length;nt++)wt(z.__webglFramebuffer[J][nt],R,x,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+J,nt);else wt(z.__webglFramebuffer[J],R,x,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+J,0);g(x)&&M(s.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(dt){for(let J=0,nt=$.length;J<nt;J++){let ft=$[J],Dt=n.get(ft),_t=s.TEXTURE_2D;(R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(_t=R.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),e.bindTexture(_t,Dt.__webglTexture),Yt(_t,ft),wt(z.__webglFramebuffer,R,ft,s.COLOR_ATTACHMENT0+J,_t,0),g(ft)&&M(_t)}e.unbindTexture()}else{let J=s.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(J=R.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),e.bindTexture(J,W.__webglTexture),Yt(J,x),x.mipmaps&&x.mipmaps.length>0)for(let nt=0;nt<x.mipmaps.length;nt++)wt(z.__webglFramebuffer[nt],R,x,s.COLOR_ATTACHMENT0,J,nt);else wt(z.__webglFramebuffer,R,x,s.COLOR_ATTACHMENT0,J,0);g(x)&&M(J),e.unbindTexture()}R.depthBuffer&&et(R)}function ot(R){let x=R.textures;for(let z=0,W=x.length;z<W;z++){let $=x[z];if(g($)){let lt=w(R),dt=n.get($).__webglTexture;e.bindTexture(lt,dt),M(lt),e.unbindTexture()}}}let ct=[],Ot=[];function Ft(R){if(R.samples>0){if(Xt(R)===!1){let x=R.textures,z=R.width,W=R.height,$=s.COLOR_BUFFER_BIT,lt=R.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,dt=n.get(R),J=x.length>1;if(J)for(let ft=0;ft<x.length;ft++)e.bindFramebuffer(s.FRAMEBUFFER,dt.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+ft,s.RENDERBUFFER,null),e.bindFramebuffer(s.FRAMEBUFFER,dt.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+ft,s.TEXTURE_2D,null,0);e.bindFramebuffer(s.READ_FRAMEBUFFER,dt.__webglMultisampledFramebuffer);let nt=R.texture.mipmaps;nt&&nt.length>0?e.bindFramebuffer(s.DRAW_FRAMEBUFFER,dt.__webglFramebuffer[0]):e.bindFramebuffer(s.DRAW_FRAMEBUFFER,dt.__webglFramebuffer);for(let ft=0;ft<x.length;ft++){if(R.resolveDepthBuffer&&(R.depthBuffer&&($|=s.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&($|=s.STENCIL_BUFFER_BIT)),J){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,dt.__webglColorRenderbuffer[ft]);let Dt=n.get(x[ft]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,Dt,0)}s.blitFramebuffer(0,0,z,W,0,0,z,W,$,s.NEAREST),c===!0&&(ct.length=0,Ot.length=0,ct.push(s.COLOR_ATTACHMENT0+ft),R.depthBuffer&&R.storeMultisampledDepthBuffer===!1&&(ct.push(lt),Ot.push(lt),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,Ot)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,ct))}if(e.bindFramebuffer(s.READ_FRAMEBUFFER,null),e.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),J)for(let ft=0;ft<x.length;ft++){e.bindFramebuffer(s.FRAMEBUFFER,dt.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+ft,s.RENDERBUFFER,dt.__webglColorRenderbuffer[ft]);let Dt=n.get(x[ft]).__webglTexture;e.bindFramebuffer(s.FRAMEBUFFER,dt.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+ft,s.TEXTURE_2D,Dt,0)}e.bindFramebuffer(s.DRAW_FRAMEBUFFER,dt.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.storeMultisampledDepthBuffer===!1&&c){let x=R.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[x])}}}function Gt(R){return Math.min(i.maxSamples,R.samples)}function Xt(R){let x=n.get(R);return R.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&x.__useRenderToTexture!==!1}function D(R){let x=a.render.frame;h.get(R)!==x&&(h.set(R,x),R.update())}function he(R,x){let z=R.colorSpace,W=R.format,$=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||z!==Vr&&z!==gi&&(Qt.getTransfer(z)===oe?(W!==Cn||$!==mn)&&kt("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Ht("WebGLTextures: Unsupported texture color space:",z)),x}function te(R){return typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement?(l.width=R.naturalWidth||R.width,l.height=R.naturalHeight||R.height):typeof VideoFrame<"u"&&R instanceof VideoFrame?(l.width=R.displayWidth,l.height=R.displayHeight):(l.width=R.width,l.height=R.height),l}this.allocateTextureUnit=k,this.resetTextureUnits=L,this.getTextureUnits=C,this.setTextureUnits=F,this.setTexture2D=j,this.setTexture2DArray=q,this.setTexture3D=Z,this.setTextureCube=K,this.rebindTextures=rt,this.setupRenderTarget=at,this.updateRenderTargetMipmap=ot,this.updateMultisampleRenderTarget=Ft,this.setupDepthRenderbuffer=et,this.setupFrameBufferTexture=wt,this.useMultisampledRTT=Xt,this.isReversedDepthBuffer=function(){return e.buffers.depth.getReversed()}}function fy(s,t){function e(n,i=gi){let r,a=Qt.getTransfer(i);if(n===mn)return s.UNSIGNED_BYTE;if(n===wl)return s.UNSIGNED_SHORT_4_4_4_4;if(n===El)return s.UNSIGNED_SHORT_5_5_5_1;if(n===Vh)return s.UNSIGNED_INT_5_9_9_9_REV;if(n===Hh)return s.UNSIGNED_INT_10F_11F_11F_REV;if(n===zh)return s.BYTE;if(n===kh)return s.SHORT;if(n===js)return s.UNSIGNED_SHORT;if(n===Tl)return s.INT;if(n===Wn)return s.UNSIGNED_INT;if(n===Rn)return s.FLOAT;if(n===Ke)return s.HALF_FLOAT;if(n===Gh)return s.ALPHA;if(n===Wh)return s.RGB;if(n===Cn)return s.RGBA;if(n===jn)return s.DEPTH_COMPONENT;if(n===Oi)return s.DEPTH_STENCIL;if(n===Al)return s.RED;if(n===Rl)return s.RED_INTEGER;if(n===zi)return s.RG;if(n===Cl)return s.RG_INTEGER;if(n===Pl)return s.RGBA_INTEGER;if(n===La||n===Da||n===Na||n===Ua)if(a===oe)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===La)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Da)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Na)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Ua)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===La)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Da)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Na)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Ua)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Il||n===Ll||n===Dl||n===Nl)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Il)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Ll)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Dl)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Nl)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Ul||n===Fl||n===Bl||n===Ol||n===zl||n===Fa||n===kl)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Ul||n===Fl)return a===oe?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Bl)return a===oe?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===Ol)return r.COMPRESSED_R11_EAC;if(n===zl)return r.COMPRESSED_SIGNED_R11_EAC;if(n===Fa)return r.COMPRESSED_RG11_EAC;if(n===kl)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===Vl||n===Hl||n===Gl||n===Wl||n===Xl||n===ql||n===Yl||n===$l||n===Jl||n===Zl||n===Kl||n===Ql||n===jl||n===tc)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Vl)return a===oe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Hl)return a===oe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Gl)return a===oe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Wl)return a===oe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Xl)return a===oe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===ql)return a===oe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Yl)return a===oe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===$l)return a===oe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Jl)return a===oe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Zl)return a===oe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Kl)return a===oe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Ql)return a===oe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===jl)return a===oe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===tc)return a===oe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===ec||n===nc||n===ic)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===ec)return a===oe?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===nc)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===ic)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===sc||n===rc||n===Ba||n===ac)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===sc)return r.COMPRESSED_RED_RGTC1_EXT;if(n===rc)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Ba)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===ac)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===tr?s.UNSIGNED_INT_24_8:s[n]!==void 0?s[n]:null}return{convert:e}}var py=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,my=`
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

}`,xu=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){let n=new ia(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){let e=t.cameras[0].viewport,n=new Ee({vertexShader:py,fragmentShader:my,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new Tt(new fn(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},_u=class extends ti{constructor(t,e){super();let n=this,i=null,r=1,a=null,o="local-floor",c=1,l=null,h=null,d=null,u=null,f=null,p=null,_=typeof XRWebGLBinding<"u",m=new xu,g={},M=e.getContextAttributes(),w=null,y=null,T=[],b=[],P=new it,v=null,A=null,I=new Xe;I.viewport=new Ae;let N=new Xe;N.viewport=new Ae;let O=[I,N],L=new _l,C=null,F=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let tt=T[Y];return tt===void 0&&(tt=new Gs,T[Y]=tt),tt.getTargetRaySpace()},this.getControllerGrip=function(Y){let tt=T[Y];return tt===void 0&&(tt=new Gs,T[Y]=tt),tt.getGripSpace()},this.getHand=function(Y){let tt=T[Y];return tt===void 0&&(tt=new Gs,T[Y]=tt),tt.getHandSpace()};function k(Y){let tt=b.indexOf(Y.inputSource);if(tt===-1)return;let xt=T[tt];xt!==void 0&&(xt.update(Y.inputSource,Y.frame,l||a),xt.dispatchEvent({type:Y.type,data:Y.inputSource}))}function V(){i.removeEventListener("select",k),i.removeEventListener("selectstart",k),i.removeEventListener("selectend",k),i.removeEventListener("squeeze",k),i.removeEventListener("squeezestart",k),i.removeEventListener("squeezeend",k),i.removeEventListener("end",V),i.removeEventListener("inputsourceschange",j);for(let Y=0;Y<T.length;Y++){let tt=b[Y];tt!==null&&(b[Y]=null,T[Y].disconnect(tt))}C=null,F=null,m.reset();for(let Y in g)delete g[Y];if(t.setRenderTarget(w),f=null,u=null,d=null,i=null,y=null,ne.stop(),n.isPresenting=!1,t.setPixelRatio(v),t.setSize(P.width,P.height,!1),A!==null){let Y=A.camera;Y.fov=A.fov,Y.zoom=A.zoom,Y.updateProjectionMatrix(),A=null}n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){r=Y,n.isPresenting===!0&&kt("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){o=Y,n.isPresenting===!0&&kt("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(Y){l=Y},this.getBaseLayer=function(){return u!==null?u:f},this.getBinding=function(){return d===null&&_&&(d=new XRWebGLBinding(i,e)),d},this.getFrame=function(){return p},this.getSession=function(){return i},this.setSession=async function(Y){if(i=Y,i!==null){if(w=t.getRenderTarget(),i.addEventListener("select",k),i.addEventListener("selectstart",k),i.addEventListener("selectend",k),i.addEventListener("squeeze",k),i.addEventListener("squeezestart",k),i.addEventListener("squeezeend",k),i.addEventListener("end",V),i.addEventListener("inputsourceschange",j),M.xrCompatible!==!0&&await e.makeXRCompatible(),v=t.getPixelRatio(),t.getSize(P),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let xt=null,Bt=null,wt=null;M.depth&&(wt=M.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,xt=M.stencil?Oi:jn,Bt=M.stencil?tr:Wn);let Vt={colorFormat:e.RGBA8,depthFormat:wt,scaleFactor:r};d=this.getBinding(),u=d.createProjectionLayer(Vt),i.updateRenderState({layers:[u]}),t.setPixelRatio(1),t.setSize(u.textureWidth,u.textureHeight,!1),y=new Fe(u.textureWidth,u.textureHeight,{format:Cn,type:mn,depthTexture:new Ci(u.textureWidth,u.textureHeight,Bt,void 0,void 0,void 0,void 0,void 0,void 0,xt),stencilBuffer:M.stencil,colorSpace:t.outputColorSpace,samples:M.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1,storeMultisampledDepthBuffer:u.ignoreDepthValues===!1,storeMultisampledStencilBuffer:u.ignoreDepthValues===!1})}else{let xt={antialias:M.antialias,alpha:!0,depth:M.depth,stencil:M.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(i,e,xt),i.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),y=new Fe(f.framebufferWidth,f.framebufferHeight,{format:Cn,type:mn,colorSpace:t.outputColorSpace,stencilBuffer:M.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await i.requestReferenceSpace(o),ne.setContext(i),ne.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function j(Y){for(let tt=0;tt<Y.removed.length;tt++){let xt=Y.removed[tt],Bt=b.indexOf(xt);Bt>=0&&(b[Bt]=null,T[Bt].disconnect(xt))}for(let tt=0;tt<Y.added.length;tt++){let xt=Y.added[tt],Bt=b.indexOf(xt);if(Bt===-1){for(let Vt=0;Vt<T.length;Vt++)if(Vt>=b.length){b.push(xt),Bt=Vt;break}else if(b[Vt]===null){b[Vt]=xt,Bt=Vt;break}if(Bt===-1)break}let wt=T[Bt];wt&&wt.connect(xt)}}let q=new E,Z=new E;function K(Y,tt,xt){q.setFromMatrixPosition(tt.matrixWorld),Z.setFromMatrixPosition(xt.matrixWorld);let Bt=q.distanceTo(Z),wt=tt.projectionMatrix.elements,Vt=xt.projectionMatrix.elements,le=wt[14]/(wt[10]-1),et=wt[14]/(wt[10]+1),rt=(wt[9]+1)/wt[5],at=(wt[9]-1)/wt[5],ot=(wt[8]-1)/wt[0],ct=(Vt[8]+1)/Vt[0],Ot=le*ot,Ft=le*ct,Gt=Bt/(-ot+ct),Xt=Gt*-ot;if(tt.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX(Xt),Y.translateZ(Gt),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert(),wt[10]===-1)Y.projectionMatrix.copy(tt.projectionMatrix),Y.projectionMatrixInverse.copy(tt.projectionMatrixInverse);else{let D=le+Gt,he=et+Gt,te=Ot-Xt,R=Ft+(Bt-Xt),x=rt*et/he*D,z=at*et/he*D;Y.projectionMatrix.makePerspective(te,R,x,z,D,he),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}}function At(Y,tt){tt===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices(tt.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(i===null)return;let tt=Y.near,xt=Y.far;m.texture!==null&&(m.depthNear>0&&(tt=m.depthNear),m.depthFar>0&&(xt=m.depthFar)),L.near=N.near=I.near=tt,L.far=N.far=I.far=xt,(C!==L.near||F!==L.far)&&(i.updateRenderState({depthNear:L.near,depthFar:L.far}),C=L.near,F=L.far),L.layers.mask=Y.layers.mask|6,I.layers.mask=L.layers.mask&-5,N.layers.mask=L.layers.mask&-3;let Bt=Y.parent,wt=L.cameras;At(L,Bt);for(let Vt=0;Vt<wt.length;Vt++)At(wt[Vt],Bt);wt.length===2?K(L,I,N):L.projectionMatrix.copy(I.projectionMatrix),A===null&&Y.isPerspectiveCamera&&(A={camera:Y,fov:Y.fov,zoom:Y.zoom}),yt(Y,L,Bt)};function yt(Y,tt,xt){xt===null?Y.matrix.copy(tt.matrixWorld):(Y.matrix.copy(xt.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(tt.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(tt.projectionMatrix),Y.projectionMatrixInverse.copy(tt.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=Vs*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return L},this.getFoveation=function(){if(!(u===null&&f===null))return c},this.setFoveation=function(Y){c=Y,u!==null&&(u.fixedFoveation=Y),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=Y)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(L)},this.getCameraTexture=function(Y){return g[Y]};let se=null;function Yt(Y,tt){if(h=tt.getViewerPose(l||a),p=tt,h!==null){let xt=h.views;f!==null&&(t.setRenderTargetFramebuffer(y,f.framebuffer),t.setRenderTarget(y));let Bt=!1;xt.length!==L.cameras.length&&(L.cameras.length=0,Bt=!0);for(let et=0;et<xt.length;et++){let rt=xt[et],at=null;if(f!==null)at=f.getViewport(rt);else{let ct=d.getViewSubImage(u,rt);at=ct.viewport,et===0&&(t.setRenderTargetTextures(y,ct.colorTexture,ct.depthStencilTexture),t.setRenderTarget(y))}let ot=O[et];ot===void 0&&(ot=new Xe,ot.layers.enable(et),ot.viewport=new Ae,O[et]=ot),ot.matrix.fromArray(rt.transform.matrix),ot.matrix.decompose(ot.position,ot.quaternion,ot.scale),ot.projectionMatrix.fromArray(rt.projectionMatrix),ot.projectionMatrixInverse.copy(ot.projectionMatrix).invert(),ot.viewport.set(at.x,at.y,at.width,at.height),et===0&&(L.matrix.copy(ot.matrix),L.matrix.decompose(L.position,L.quaternion,L.scale)),Bt===!0&&L.cameras.push(ot)}let wt=i.enabledFeatures;if(wt&&wt.includes("depth-sensing")&&i.depthUsage=="gpu-optimized"&&_){d=n.getBinding();let et=d.getDepthInformation(xt[0]);et&&et.isValid&&et.texture&&m.init(et,i.renderState)}if(wt&&wt.includes("camera-access")&&_){t.state.unbindTexture(),d=n.getBinding();for(let et=0;et<xt.length;et++){let rt=xt[et].camera;if(rt){let at=g[rt];at||(at=new ia,g[rt]=at);let ot=d.getCameraImage(rt);at.sourceTexture=ot}}}}for(let xt=0;xt<T.length;xt++){let Bt=b[xt],wt=T[xt];Bt!==null&&wt!==void 0&&wt.update(Bt,tt,l||a)}se&&se(Y,tt),tt.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:tt}),p=null}let ne=new Vf;ne.setAnimationLoop(Yt),this.setAnimationLoop=function(Y){se=Y},this.dispose=function(){}}},gy=new ce,Yf=new Wt;Yf.set(-1,0,0,0,1,0,0,0,1);function xy(s,t){function e(m,g){m.matrixAutoUpdate===!0&&m.updateMatrix(),g.value.copy(m.matrix)}function n(m,g){g.color.getRGB(m.fogColor.value,Jh(s)),g.isFog?(m.fogNear.value=g.near,m.fogFar.value=g.far):g.isFogExp2&&(m.fogDensity.value=g.density)}function i(m,g,M,w,y){g.isNodeMaterial?g.uniformsNeedUpdate=!1:g.isMeshBasicMaterial?r(m,g):g.isMeshLambertMaterial?(r(m,g),g.envMap&&(m.envMapIntensity.value=g.envMapIntensity)):g.isMeshToonMaterial?(r(m,g),d(m,g)):g.isMeshPhongMaterial?(r(m,g),h(m,g),g.envMap&&(m.envMapIntensity.value=g.envMapIntensity)):g.isMeshStandardMaterial?(r(m,g),u(m,g),g.isMeshPhysicalMaterial&&f(m,g,y)):g.isMeshMatcapMaterial?(r(m,g),p(m,g)):g.isMeshDepthMaterial?r(m,g):g.isMeshDistanceMaterial?(r(m,g),_(m,g)):g.isMeshNormalMaterial?r(m,g):g.isLineBasicMaterial?(a(m,g),g.isLineDashedMaterial&&o(m,g)):g.isPointsMaterial?c(m,g,M,w):g.isSpriteMaterial?l(m,g):g.isShadowMaterial?(m.color.value.copy(g.color),m.opacity.value=g.opacity):g.isShaderMaterial&&(g.uniformsNeedUpdate=!1)}function r(m,g){m.opacity.value=g.opacity,g.color&&m.diffuse.value.copy(g.color),g.emissive&&m.emissive.value.copy(g.emissive).multiplyScalar(g.emissiveIntensity),g.map&&(m.map.value=g.map,e(g.map,m.mapTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,e(g.alphaMap,m.alphaMapTransform)),g.bumpMap&&(m.bumpMap.value=g.bumpMap,e(g.bumpMap,m.bumpMapTransform),m.bumpScale.value=g.bumpScale,g.side===Oe&&(m.bumpScale.value*=-1)),g.normalMap&&(m.normalMap.value=g.normalMap,e(g.normalMap,m.normalMapTransform),m.normalScale.value.copy(g.normalScale),g.side===Oe&&m.normalScale.value.negate()),g.displacementMap&&(m.displacementMap.value=g.displacementMap,e(g.displacementMap,m.displacementMapTransform),m.displacementScale.value=g.displacementScale,m.displacementBias.value=g.displacementBias),g.emissiveMap&&(m.emissiveMap.value=g.emissiveMap,e(g.emissiveMap,m.emissiveMapTransform)),g.specularMap&&(m.specularMap.value=g.specularMap,e(g.specularMap,m.specularMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest);let M=t.get(g),w=M.envMap,y=M.envMapRotation;w&&(m.envMap.value=w,m.envMapRotation.value.setFromMatrix4(gy.makeRotationFromEuler(y)).transpose(),w.isCubeTexture&&w.isRenderTargetTexture===!1&&m.envMapRotation.value.premultiply(Yf),m.reflectivity.value=g.reflectivity,m.ior.value=g.ior,m.refractionRatio.value=g.refractionRatio),g.lightMap&&(m.lightMap.value=g.lightMap,m.lightMapIntensity.value=g.lightMapIntensity,e(g.lightMap,m.lightMapTransform)),g.aoMap&&(m.aoMap.value=g.aoMap,m.aoMapIntensity.value=g.aoMapIntensity,e(g.aoMap,m.aoMapTransform))}function a(m,g){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,g.map&&(m.map.value=g.map,e(g.map,m.mapTransform))}function o(m,g){m.dashSize.value=g.dashSize,m.totalSize.value=g.dashSize+g.gapSize,m.scale.value=g.scale}function c(m,g,M,w){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,m.size.value=g.size*M,m.scale.value=w*.5,g.map&&(m.map.value=g.map,e(g.map,m.uvTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,e(g.alphaMap,m.alphaMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest)}function l(m,g){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,m.rotation.value=g.rotation,g.map&&(m.map.value=g.map,e(g.map,m.mapTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,e(g.alphaMap,m.alphaMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest)}function h(m,g){m.specular.value.copy(g.specular),m.shininess.value=Math.max(g.shininess,1e-4)}function d(m,g){g.gradientMap&&(m.gradientMap.value=g.gradientMap)}function u(m,g){m.metalness.value=g.metalness,g.metalnessMap&&(m.metalnessMap.value=g.metalnessMap,e(g.metalnessMap,m.metalnessMapTransform)),m.roughness.value=g.roughness,g.roughnessMap&&(m.roughnessMap.value=g.roughnessMap,e(g.roughnessMap,m.roughnessMapTransform)),g.envMap&&(m.envMapIntensity.value=g.envMapIntensity)}function f(m,g,M){m.ior.value=g.ior,g.sheen>0&&(m.sheenColor.value.copy(g.sheenColor).multiplyScalar(g.sheen),m.sheenRoughness.value=g.sheenRoughness,g.sheenColorMap&&(m.sheenColorMap.value=g.sheenColorMap,e(g.sheenColorMap,m.sheenColorMapTransform)),g.sheenRoughnessMap&&(m.sheenRoughnessMap.value=g.sheenRoughnessMap,e(g.sheenRoughnessMap,m.sheenRoughnessMapTransform))),g.clearcoat>0&&(m.clearcoat.value=g.clearcoat,m.clearcoatRoughness.value=g.clearcoatRoughness,g.clearcoatMap&&(m.clearcoatMap.value=g.clearcoatMap,e(g.clearcoatMap,m.clearcoatMapTransform)),g.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=g.clearcoatRoughnessMap,e(g.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),g.clearcoatNormalMap&&(m.clearcoatNormalMap.value=g.clearcoatNormalMap,e(g.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(g.clearcoatNormalScale),g.side===Oe&&m.clearcoatNormalScale.value.negate())),g.dispersion>0&&(m.dispersion.value=g.dispersion),g.retroreflectivity>0&&(m.retroreflectivity.value=g.retroreflectivity),g.iridescence>0&&(m.iridescence.value=g.iridescence,m.iridescenceIOR.value=g.iridescenceIOR,m.iridescenceThicknessMinimum.value=g.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=g.iridescenceThicknessRange[1],g.iridescenceMap&&(m.iridescenceMap.value=g.iridescenceMap,e(g.iridescenceMap,m.iridescenceMapTransform)),g.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=g.iridescenceThicknessMap,e(g.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),g.transmission>0&&(m.transmission.value=g.transmission,m.transmissionSamplerMap.value=M.texture,m.transmissionSamplerSize.value.set(M.width,M.height),g.transmissionMap&&(m.transmissionMap.value=g.transmissionMap,e(g.transmissionMap,m.transmissionMapTransform)),m.thickness.value=g.thickness,g.thicknessMap&&(m.thicknessMap.value=g.thicknessMap,e(g.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=g.attenuationDistance,m.attenuationColor.value.copy(g.attenuationColor)),g.anisotropy>0&&(m.anisotropyVector.value.set(g.anisotropy*Math.cos(g.anisotropyRotation),g.anisotropy*Math.sin(g.anisotropyRotation)),g.anisotropyMap&&(m.anisotropyMap.value=g.anisotropyMap,e(g.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=g.specularIntensity,m.specularColor.value.copy(g.specularColor),g.specularColorMap&&(m.specularColorMap.value=g.specularColorMap,e(g.specularColorMap,m.specularColorMapTransform)),g.specularIntensityMap&&(m.specularIntensityMap.value=g.specularIntensityMap,e(g.specularIntensityMap,m.specularIntensityMapTransform))}function p(m,g){g.matcap&&(m.matcap.value=g.matcap)}function _(m,g){let M=t.get(g).light;m.referencePosition.value.setFromMatrixPosition(M.matrixWorld),m.nearDistance.value=M.shadow.camera.near,m.farDistance.value=M.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function _y(s,t,e,n){let i={},r={},a=[],o=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function c(y,T){let b=T.program;n.uniformBlockBinding(y,b)}function l(y,T){let b=i[y.id];b===void 0&&(m(y),b=h(y),i[y.id]=b,y.addEventListener("dispose",M));let P=T.program;n.updateUBOMapping(y,P);let v=t.render.frame;r[y.id]!==v&&(u(y),r[y.id]=v)}function h(y){let T=d();y.__bindingPointIndex=T;let b=s.createBuffer(),P=y.__size,v=y.usage;return s.bindBuffer(s.UNIFORM_BUFFER,b),s.bufferData(s.UNIFORM_BUFFER,P,v),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,T,b),b}function d(){for(let y=0;y<o;y++)if(a.indexOf(y)===-1)return a.push(y),y;return Ht("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(y){let T=i[y.id],b=y.uniforms,P=y.__cache;s.bindBuffer(s.UNIFORM_BUFFER,T);for(let v=0,A=b.length;v<A;v++){let I=b[v];if(Array.isArray(I))for(let N=0,O=I.length;N<O;N++)f(I[N],v,N,P);else f(I,v,0,P)}s.bindBuffer(s.UNIFORM_BUFFER,null)}function f(y,T,b,P){if(_(y,T,b,P)===!0){let v=y.__offset,A=y.value;if(Array.isArray(A)){let I=0;for(let N=0;N<A.length;N++){let O=A[N],L=g(O);p(O,y.__data,I),typeof O!="number"&&typeof O!="boolean"&&!O.isMatrix3&&!ArrayBuffer.isView(O)&&(I+=L.storage/Float32Array.BYTES_PER_ELEMENT)}}else p(A,y.__data,0);s.bufferSubData(s.UNIFORM_BUFFER,v,y.__data)}}function p(y,T,b){typeof y=="number"||typeof y=="boolean"?T[0]=y:y.isMatrix3?(T[0]=y.elements[0],T[1]=y.elements[1],T[2]=y.elements[2],T[3]=0,T[4]=y.elements[3],T[5]=y.elements[4],T[6]=y.elements[5],T[7]=0,T[8]=y.elements[6],T[9]=y.elements[7],T[10]=y.elements[8],T[11]=0):ArrayBuffer.isView(y)?T.set(new y.constructor(y.buffer,y.byteOffset,T.length)):y.toArray(T,b)}function _(y,T,b,P){let v=y.value,A=T+"_"+b;if(P[A]===void 0)return typeof v=="number"||typeof v=="boolean"?P[A]=v:ArrayBuffer.isView(v)?P[A]=v.slice():P[A]=v.clone(),!0;{let I=P[A];if(typeof v=="number"||typeof v=="boolean"){if(I!==v)return P[A]=v,!0}else{if(ArrayBuffer.isView(v))return!0;if(I.equals(v)===!1)return I.copy(v),!0}}return!1}function m(y){let T=y.uniforms,b=0,P=16;for(let A=0,I=T.length;A<I;A++){let N=Array.isArray(T[A])?T[A]:[T[A]];for(let O=0,L=N.length;O<L;O++){let C=N[O],F=Array.isArray(C.value)?C.value:[C.value];for(let k=0,V=F.length;k<V;k++){let j=F[k],q=g(j),Z=b%P,K=Z%q.boundary,At=Z+K;b+=K,At!==0&&P-At<q.storage&&(b+=P-At),C.__data=new Float32Array(q.storage/Float32Array.BYTES_PER_ELEMENT),C.__offset=b,b+=q.storage}}}let v=b%P;return v>0&&(b+=P-v),y.__size=b,y.__cache={},this}function g(y){let T={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(T.boundary=4,T.storage=4):y.isVector2?(T.boundary=8,T.storage=8):y.isVector3||y.isColor?(T.boundary=16,T.storage=12):y.isVector4?(T.boundary=16,T.storage=16):y.isMatrix3?(T.boundary=48,T.storage=48):y.isMatrix4?(T.boundary=64,T.storage=64):y.isTexture?kt("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(y)?(T.boundary=16,T.storage=y.byteLength):kt("WebGLRenderer: Unsupported uniform value type.",y),T}function M(y){let T=y.target;T.removeEventListener("dispose",M);let b=a.indexOf(T.__bindingPointIndex);a.splice(b,1),s.deleteBuffer(i[T.id]),delete i[T.id],delete r[T.id]}function w(){for(let y in i)s.deleteBuffer(i[y]);a=[],i={},r={}}return{bind:c,update:l,dispose:w}}var vy=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),si=null;function yy(){return si===null&&(si=new jr(vy,16,16,zi,Ke),si.name="DFG_LUT",si.minFilter=Ze,si.magFilter=Ze,si.wrapS=Zn,si.wrapT=Zn,si.generateMipmaps=!1,si.needsUpdate=!0),si}var dc=class{constructor(t={}){let{canvas:e=lf(),context:n=null,depth:i=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:u=!1,outputBufferType:f=mn}=t;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=a;let _=f,m=new Set([Pl,Cl,Rl]),g=new Set([mn,Wn,js,tr,wl,El]),M=new Uint32Array(4),w=new Int32Array(4),y=new E,T=null,b=null,P=[],v=[],A=null;this.domElement=e,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Gn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let I=this,N=!1,O=null,L=null,C=null,F=null;this._outputColorSpace=We;let k=0,V=0,j=null,q=-1,Z=null,K=new Ae,At=new Ae,yt=null,se=new ht(0),Yt=0,ne=e.width,Y=e.height,tt=1,xt=null,Bt=null,wt=new Ae(0,0,ne,Y),Vt=new Ae(0,0,ne,Y),le=!1,et=new Xs,rt=!1,at=!1,ot=new ce,ct=new E,Ot=new Ae,Ft={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Gt=!1;function Xt(){return j===null?tt:1}let D=n;function he(S,U){return e.getContext(S,U)}let te,R,x,z,W,$,lt,dt,J,nt,ft,Dt,_t,pt,Nt,zt,qt,B,mt,Q,gt,bt,st;try{let S={alpha:!0,depth:i,stencil:r,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${"186"}`),e.addEventListener("webglcontextlost",ge,!1),e.addEventListener("webglcontextrestored",ue,!1),e.addEventListener("webglcontextcreationerror",Dn,!1),D===null){let U="webgl2";if(D=he(U,S),D===null)throw he(U)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}Ut()}catch(S){throw e.removeEventListener("webglcontextlost",ge,!1),e.removeEventListener("webglcontextrestored",ue,!1),e.removeEventListener("webglcontextcreationerror",Dn,!1),Ht("WebGLRenderer: "+S.message),S}function Ut(){te=new A_(D),te.init(),gt=new fy(D,te),R=new x_(D,te,t,gt),x=new uy(D,te),R.reversedDepthBuffer&&u&&x.buffers.depth.setReversed(!0),L=D.createFramebuffer(),C=D.createFramebuffer(),F=D.createFramebuffer(),z=new P_(D),W=new Kv,$=new dy(D,te,x,W,R,gt,z),lt=new E_(I),dt=new L0(D),bt=new m_(D,dt),J=new R_(D,dt,z,bt),nt=new L_(D,J,dt,bt,z),B=new I_(D,R,$),Nt=new __(W),ft=new Zv(I,lt,te,R,bt,Nt),Dt=new xy(I,W),_t=new jv,pt=new ry(te),qt=new p_(I,lt,x,nt,p,c),zt=new hy(I,nt,R),st=new _y(D,z,R,x),mt=new g_(D,te,z),Q=new C_(D,te,z),z.programs=ft.programs,I.capabilities=R,I.extensions=te,I.properties=W,I.renderLists=_t,I.shadowMap=zt,I.state=x,I.info=z}_!==mn&&(A=new N_(_,e.width,e.height,o,i,r));let It=new _u(I,D);this.xr=It,this.getContext=function(){return D},this.getContextAttributes=function(){return D.getContextAttributes()},this.forceContextLoss=function(){let S=te.get("WEBGL_lose_context");S&&S.loseContext()},this.forceContextRestore=function(){let S=te.get("WEBGL_lose_context");S&&S.restoreContext()},this.getPixelRatio=function(){return tt},this.setPixelRatio=function(S){S!==void 0&&(tt=S,this.setSize(ne,Y,!1))},this.getSize=function(S){return S.set(ne,Y)},this.setSize=function(S,U,X=!0){if(It.isPresenting){kt("WebGLRenderer: Can't change size while VR device is presenting.");return}ne=S,Y=U,e.width=Math.floor(S*tt),e.height=Math.floor(U*tt),X===!0&&(e.style.width=S+"px",e.style.height=U+"px"),A!==null&&A.setSize(e.width,e.height),this.setViewport(0,0,S,U)},this.getDrawingBufferSize=function(S){return S.set(ne*tt,Y*tt).floor()},this.setDrawingBufferSize=function(S,U,X){ne=S,Y=U,tt=X,e.width=Math.floor(S*X),e.height=Math.floor(U*X),this.setViewport(0,0,S,U)},this.setEffects=function(S){if(_===mn){Ht("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(S){for(let U=0;U<S.length;U++)if(S[U].isOutputPass===!0){kt("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}A.setEffects(S||[])},this.getCurrentViewport=function(S){return S.copy(K)},this.getViewport=function(S){return S.copy(wt)},this.setViewport=function(S,U,X,H){S.isVector4?wt.set(S.x,S.y,S.z,S.w):wt.set(S,U,X,H),x.viewport(K.copy(wt).multiplyScalar(tt).round())},this.getScissor=function(S){return S.copy(Vt)},this.setScissor=function(S,U,X,H){S.isVector4?Vt.set(S.x,S.y,S.z,S.w):Vt.set(S,U,X,H),x.scissor(At.copy(Vt).multiplyScalar(tt).round())},this.getScissorTest=function(){return le},this.setScissorTest=function(S){x.setScissorTest(le=S)},this.setOpaqueSort=function(S){xt=S},this.setTransparentSort=function(S){Bt=S},this.getClearColor=function(S){return S.copy(qt.getClearColor())},this.setClearColor=function(){qt.setClearColor(...arguments)},this.getClearAlpha=function(){return qt.getClearAlpha()},this.setClearAlpha=function(){qt.setClearAlpha(...arguments)},this.clear=function(S=!0,U=!0,X=!0){let H=0;if(S){let G=!1;if(j!==null){let St=j.texture.format;G=m.has(St)}if(G){let St=j.texture.type,Rt=g.has(St),Mt=qt.getClearColor(),Ct=qt.getClearAlpha(),Lt=Mt.r,$t=Mt.g,ee=Mt.b;Rt?(M[0]=Lt,M[1]=$t,M[2]=ee,M[3]=Ct,D.clearBufferuiv(D.COLOR,0,M)):(w[0]=Lt,w[1]=$t,w[2]=ee,w[3]=Ct,D.clearBufferiv(D.COLOR,0,w))}else H|=D.COLOR_BUFFER_BIT}U&&(H|=D.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),X&&(H|=D.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),H!==0&&D.clear(H)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(S){S.setRenderer(this),O=S},this.dispose=function(){e.removeEventListener("webglcontextlost",ge,!1),e.removeEventListener("webglcontextrestored",ue,!1),e.removeEventListener("webglcontextcreationerror",Dn,!1),qt.dispose(),_t.dispose(),pt.dispose(),W.dispose(),lt.dispose(),nt.dispose(),bt.dispose(),st.dispose(),ft.dispose(),It.dispose(),It.removeEventListener("sessionstart",zu),It.removeEventListener("sessionend",ku),Xi.stop()};function ge(S){S.preventDefault(),Wr("WebGLRenderer: Context Lost."),N=!0}function ue(){Wr("WebGLRenderer: Context Restored."),N=!1;let S=z.autoReset,U=zt.enabled,X=zt.autoUpdate,H=zt.needsUpdate,G=zt.type;Ut(),z.autoReset=S,zt.enabled=U,zt.autoUpdate=X,zt.needsUpdate=H,zt.type=G}function Dn(S){Ht("WebGLRenderer: A WebGL context could not be created. Reason: ",S.statusMessage)}function Yn(S){let U=S.target;U.removeEventListener("dispose",Yn),jp(U)}function jp(S){tm(S),W.remove(S)}function tm(S){let U=W.get(S).programs;U!==void 0&&(U.forEach(function(X){ft.releaseProgram(X)}),S.isShaderMaterial&&ft.releaseShaderCache(S))}this.renderBufferDirect=function(S,U,X,H,G,St){U===null&&(U=Ft);let Rt=G.isMesh&&G.matrixWorld.determinantAffine()<0,Mt=im(S,U,X,H,G);x.setMaterial(H,Rt);let Ct=X.index,Lt=1;if(H.wireframe===!0){if(Ct=J.getWireframeAttribute(X),Ct===void 0)return;Lt=2}let $t=X.drawRange,ee=X.attributes.position,Pt=$t.start*Lt,de=($t.start+$t.count)*Lt;St!==null&&(Pt=Math.max(Pt,St.start*Lt),de=Math.min(de,(St.start+St.count)*Lt)),Ct!==null?(Pt=Math.max(Pt,0),de=Math.min(de,Ct.count)):ee!=null&&(Pt=Math.max(Pt,0),de=Math.min(de,ee.count));let Ne=de-Pt;if(Ne<0||Ne===1/0)return;bt.setup(G,H,Mt,X,Ct);let be,me=mt;if(Ct!==null&&(be=dt.get(Ct),me=Q,me.setIndex(be)),G.isMesh)H.wireframe===!0?(x.setLineWidth(H.wireframeLinewidth*Xt()),me.setMode(D.LINES)):me.setMode(D.TRIANGLES);else if(G.isLine){let je=H.linewidth;je===void 0&&(je=1),x.setLineWidth(je*Xt()),G.isLineSegments?me.setMode(D.LINES):G.isLineLoop?me.setMode(D.LINE_LOOP):me.setMode(D.LINE_STRIP)}else G.isPoints?me.setMode(D.POINTS):G.isSprite&&me.setMode(D.TRIANGLES);if(G.isBatchedMesh)if(te.get("WEBGL_multi_draw"))me.renderMultiDraw(G._multiDrawStarts,G._multiDrawCounts,G._multiDrawCount);else{let je=G._multiDrawStarts,Et=G._multiDrawCounts,rn=G._multiDrawCount,re=Ct?dt.get(Ct).bytesPerElement:1,wn=W.get(H).currentProgram.getUniforms();for(let $n=0;$n<rn;$n++)wn.setValue(D,"_gl_DrawID",$n),me.render(je[$n]/re,Et[$n])}else if(G.isInstancedMesh)me.renderInstances(Pt,Ne,G.count);else if(X.isInstancedBufferGeometry){let je=X._maxInstanceCount!==void 0?X._maxInstanceCount:1/0,Et=Math.min(X.instanceCount,je);me.renderInstances(Pt,Ne,Et)}else me.render(Pt,Ne)};function Ou(S,U,X,H){O!==null&&S.isNodeMaterial&&O.setObject(H,S),rt===!0&&Nt.setState(S,X,!1),S.transparent===!0&&S.side===ze&&S.forceSinglePass===!1?(S.side=Oe,S.needsUpdate=!0,oo(S,U,H),S.side=Ni,S.needsUpdate=!0,oo(S,U,H),S.side=ze):oo(S,U,H)}this.compile=function(S,U,X=null){X===null&&(X=S),O!==null&&O.renderStart(S,U,X),b=pt.get(X),b.init(U),v.push(b),X.traverseVisible(function(G){G.isLight&&G.layers.test(U.layers)&&(b.pushLight(G),G.castShadow&&b.pushShadow(G))}),S!==X&&S.traverseVisible(function(G){G.isLight&&G.layers.test(U.layers)&&(b.pushLight(G),G.castShadow&&b.pushShadow(G))}),b.setupLights(),O!==null&&O.updateLights(b.state.lightsArray),at=this.localClippingEnabled,rt=Nt.init(this.clippingPlanes,at),rt===!0&&Nt.setGlobalState(this.clippingPlanes,U),O!==null&&zt.render(b.state.shadowsArray,X,U);let H=new Set;return S.traverse(function(G){if(!(G.isMesh||G.isPoints||G.isLine||G.isSprite))return;let St=G.material;if(St)if(Array.isArray(St))for(let Rt=0;Rt<St.length;Rt++){let Mt=St[Rt];Ou(Mt,X,U,G),H.add(Mt)}else Ou(St,X,U,G),H.add(St)}),b=v.pop(),O!==null&&O.renderEnd(),H},this.compileAsync=function(S,U,X=null){let H=this.compile(S,U,X);return new Promise(G=>{function St(){if(H.forEach(function(Rt){let Ct=W.get(Rt).currentProgram;(Ct===void 0||Ct.isReady())&&H.delete(Rt)}),H.size===0){G(S);return}setTimeout(St,10)}te.get("KHR_parallel_shader_compile")!==null?St():setTimeout(St,10)})};let Yc=null;function em(S){Yc&&Yc(S)}function zu(){Xi.stop()}function ku(){Xi.start()}let Xi=new Vf;Xi.setAnimationLoop(em),typeof self<"u"&&Xi.setContext(self),this.setAnimationLoop=function(S){Yc=S,It.setAnimationLoop(S),S===null?Xi.stop():Xi.start()},It.addEventListener("sessionstart",zu),It.addEventListener("sessionend",ku),this.render=function(S,U){if(U!==void 0&&U.isCamera!==!0){Ht("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(N===!0)return;O!==null&&O.renderStart(S,U);let X=It.enabled===!0&&It.isPresenting===!0,H=A!==null&&(j===null||X)&&A.begin(I,j);if(S.matrixWorldAutoUpdate===!0&&S.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),It.enabled===!0&&It.isPresenting===!0&&(A===null||A.isCompositing()===!1)&&(It.cameraAutoUpdate===!0&&It.updateCamera(U),U=It.getCamera()),S.isScene===!0&&S.onBeforeRender(I,S,U,j),b=pt.get(S,v.length),b.init(U),b.state.textureUnits=$.getTextureUnits(),v.push(b),ot.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),et.setFromProjectionMatrix(ot,zn,U.reversedDepth),at=this.localClippingEnabled,rt=Nt.init(this.clippingPlanes,at),T=_t.get(S,P.length),T.init(),P.push(T),It.enabled===!0&&It.isPresenting===!0){let Rt=I.xr.getDepthSensingMesh();Rt!==null&&$c(Rt,U,-1/0,I.sortObjects)}$c(S,U,0,I.sortObjects),T.finish(),O!==null&&O.updateLights(b.state.lightsArray),I.sortObjects===!0&&T.sort(xt,Bt),Gt=It.enabled===!1||It.isPresenting===!1||It.hasDepthSensing()===!1,Gt&&qt.addToRenderList(T,S),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),rt===!0&&Nt.beginShadows();let G=b.state.shadowsArray;if(zt.render(G,S,U),rt===!0&&Nt.endShadows(),(H&&A.hasRenderPass())===!1){let Rt=T.opaque,Mt=T.transmissive;if(b.setupLights(),U.isArrayCamera){let Ct=U.cameras;if(Mt.length>0)for(let Lt=0,$t=Ct.length;Lt<$t;Lt++){let ee=Ct[Lt];Hu(Rt,Mt,S,ee)}Gt&&qt.render(S);for(let Lt=0,$t=Ct.length;Lt<$t;Lt++){let ee=Ct[Lt];Vu(T,S,ee,ee.viewport)}}else Mt.length>0&&Hu(Rt,Mt,S,U),Gt&&qt.render(S),Vu(T,S,U)}j!==null&&V===0&&($.updateMultisampleRenderTarget(j),$.updateRenderTargetMipmap(j)),H&&A.end(I),S.isScene===!0&&S.onAfterRender(I,S,U),bt.resetDefaultState(),q=-1,Z=null,v.pop(),v.length>0?(b=v[v.length-1],$.setTextureUnits(b.state.textureUnits),rt===!0&&Nt.setGlobalState(I.clippingPlanes,b.state.camera)):b=null,P.pop(),P.length>0?T=P[P.length-1]:T=null,O!==null&&O.renderEnd()};function $c(S,U,X,H){if(S.visible===!1)return;if(S.layers.test(U.layers)){if(S.isGroup)X=S.renderOrder;else if(S.isLOD)S.autoUpdate===!0&&S.update(U);else if(S.isLightProbeGrid)b.pushLightProbeGrid(S);else if(S.isLight)b.pushLight(S),S.castShadow&&b.pushShadow(S);else if(S.isSprite){if(!S.frustumCulled||S.intersectsFrustum(et)){H&&Ot.setFromMatrixPosition(S.matrixWorld).applyMatrix4(ot);let Rt=nt.update(S),Mt=S.material;Mt.visible&&T.push(S,Rt,Mt,X,Ot.z,null,U)}}else if((S.isMesh||S.isLine||S.isPoints)&&(!S.frustumCulled||S.intersectsFrustum(et))){let Rt=nt.update(S),Mt=S.material;if(H&&(S.boundingSphere!==void 0?(S.boundingSphere===null&&S.computeBoundingSphere(),Ot.copy(S.boundingSphere.center)):(Rt.boundingSphere===null&&Rt.computeBoundingSphere(),Ot.copy(Rt.boundingSphere.center)),Ot.applyMatrix4(S.matrixWorld).applyMatrix4(ot)),Array.isArray(Mt)){let Ct=Rt.groups;for(let Lt=0,$t=Ct.length;Lt<$t;Lt++){let ee=Ct[Lt],Pt=Mt[ee.materialIndex];Pt&&Pt.visible&&T.push(S,Rt,Pt,X,Ot.z,ee,U)}}else Mt.visible&&T.push(S,Rt,Mt,X,Ot.z,null,U)}}let St=S.children;for(let Rt=0,Mt=St.length;Rt<Mt;Rt++)$c(St[Rt],U,X,H)}function Vu(S,U,X,H){let{opaque:G,transmissive:St,transparent:Rt}=S;b.setupLightsView(X),rt===!0&&Nt.setGlobalState(I.clippingPlanes,X),H&&x.viewport(K.copy(H)),G.length>0&&ao(G,U,X),St.length>0&&ao(St,U,X),Rt.length>0&&ao(Rt,U,X),x.buffers.depth.setTest(!0),x.buffers.depth.setMask(!0),x.buffers.color.setMask(!0),x.setPolygonOffset(!1)}function Hu(S,U,X,H){if((X.isScene===!0?X.overrideMaterial:null)!==null)return;if(b.state.transmissionRenderTarget[H.id]===void 0){let Pt=te.has("EXT_color_buffer_half_float")||te.has("EXT_color_buffer_float");b.state.transmissionRenderTarget[H.id]=new Fe(1,1,{generateMipmaps:!0,type:Pt?Ke:mn,minFilter:Bi,samples:Math.max(4,R.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:Qt.workingColorSpace})}let St=b.state.transmissionRenderTarget[H.id],Rt=H.viewport||K;St.setSize(Rt.z*I.transmissionResolutionScale,Rt.w*I.transmissionResolutionScale);let Mt=I.getRenderTarget(),Ct=I.getActiveCubeFace(),Lt=I.getActiveMipmapLevel();I.setRenderTarget(St),I.getClearColor(se),Yt=I.getClearAlpha(),Yt<1&&I.setClearColor(16777215,.5),I.clear(),Gt&&qt.render(X);let $t=I.toneMapping;I.toneMapping=Gn;let ee=H.viewport;if(H.viewport!==void 0&&(H.viewport=void 0),b.setupLightsView(H),rt===!0&&Nt.setGlobalState(I.clippingPlanes,H),ao(S,X,H),$.updateMultisampleRenderTarget(St),$.updateRenderTargetMipmap(St),te.has("WEBGL_multisampled_render_to_texture")===!1){let Pt=!1;for(let de=0,Ne=U.length;de<Ne;de++){let be=U[de],{object:me,geometry:je,material:Et,group:rn}=be;if(Et.side===ze&&me.layers.test(H.layers)){let re=Et.side;Et.side=Oe,Et.needsUpdate=!0,Gu(me,X,H,je,Et,rn),Et.side=re,Et.needsUpdate=!0,Pt=!0}}Pt===!0&&($.updateMultisampleRenderTarget(St),$.updateRenderTargetMipmap(St))}I.setRenderTarget(Mt,Ct,Lt),I.setClearColor(se,Yt),ee!==void 0&&(H.viewport=ee),I.toneMapping=$t}function ao(S,U,X){let H=U.isScene===!0?U.overrideMaterial:null;for(let G=0,St=S.length;G<St;G++){let Rt=S[G],{object:Mt,geometry:Ct,group:Lt}=Rt,$t=Rt.material;$t.allowOverride===!0&&H!==null&&($t=H),Mt.layers.test(X.layers)&&Gu(Mt,U,X,Ct,$t,Lt)}}function Gu(S,U,X,H,G,St){O!==null&&G.isNodeMaterial&&O.setObject(S,G),S.onBeforeRender(I,U,X,H,G,St),S.modelViewMatrix.multiplyMatrices(X.matrixWorldInverse,S.matrixWorld),S.normalMatrix.getNormalMatrix(S.modelViewMatrix),G.onBeforeRender(I,U,X,H,S,St),G.transparent===!0&&G.side===ze&&G.forceSinglePass===!1?(G.side=Oe,G.needsUpdate=!0,I.renderBufferDirect(X,U,H,G,S,St),G.side=Ni,G.needsUpdate=!0,I.renderBufferDirect(X,U,H,G,S,St),G.side=ze):I.renderBufferDirect(X,U,H,G,S,St),S.onAfterRender(I,U,X,H,G,St)}function oo(S,U,X){U.isScene!==!0&&(U=Ft);let H=W.get(S),G=b.state.lights,St=b.state.shadowsArray,Rt=G.state.version,Mt=ft.getParameters(S,G.state,St,U,X,b.state.lightProbeGridArray),Ct=ft.getProgramCacheKey(Mt),Lt=H.programs;H.environment=S.isMeshStandardMaterial||S.isMeshLambertMaterial||S.isMeshPhongMaterial?U.environment:null,H.fog=U.fog;let $t=S.isMeshStandardMaterial||S.isMeshLambertMaterial&&!S.envMap||S.isMeshPhongMaterial&&!S.envMap;H.envMap=lt.get(S.envMap||H.environment,$t),H.envMapRotation=H.environment!==null&&S.envMap===null?U.environmentRotation:S.envMapRotation,Lt===void 0&&(S.addEventListener("dispose",Yn),Lt=new Map,H.programs=Lt);let ee=Lt.get(Ct);if(ee!==void 0){if(H.currentProgram===ee&&H.lightsStateVersion===Rt)return Xu(S,Mt),ee}else Mt.uniforms=ft.getUniforms(S),O!==null&&S.isNodeMaterial&&O.build(S,X,Mt),S.onBeforeCompile(Mt,I),ee=ft.acquireProgram(Mt,Ct),Lt.set(Ct,ee),H.uniforms=Mt.uniforms;let Pt=H.uniforms;return(!S.isShaderMaterial&&!S.isRawShaderMaterial||S.clipping===!0)&&(Pt.clippingPlanes=Nt.uniform),Xu(S,Mt),H.needsLights=rm(S),H.lightsStateVersion=Rt,H.needsLights&&(Pt.ambientLightColor.value=G.state.ambient,Pt.lightProbe.value=G.state.probe,Pt.sunLights.value=G.state.sun,Pt.sunLightShadows.value=G.state.sunShadow,Pt.directionalLights.value=G.state.directional,Pt.directionalLightShadows.value=G.state.directionalShadow,Pt.spotLights.value=G.state.spot,Pt.spotLightShadows.value=G.state.spotShadow,Pt.rectAreaLights.value=G.state.rectArea,Pt.ltc_1.value=G.state.rectAreaLTC1,Pt.ltc_2.value=G.state.rectAreaLTC2,Pt.pointLights.value=G.state.point,Pt.pointLightShadows.value=G.state.pointShadow,Pt.hemisphereLights.value=G.state.hemi,Pt.sunShadowMatrix.value=G.state.sunShadowMatrix,Pt.sunShadowCascade.value=G.state.sunShadowCascade,Pt.directionalShadowMatrix.value=G.state.directionalShadowMatrix,Pt.spotLightMatrix.value=G.state.spotLightMatrix,Pt.spotLightMap.value=G.state.spotLightMap,Pt.pointShadowMatrix.value=G.state.pointShadowMatrix),H.lightProbeGrid=b.state.lightProbeGridArray.length>0,H.currentProgram=ee,H.uniformsList=null,ee}function Wu(S){if(S.uniformsList===null){let U=S.currentProgram.getUniforms();S.uniformsList=sr.seqWithValue(U.seq,S.uniforms)}return S.uniformsList}function Xu(S,U){let X=W.get(S);X.outputColorSpace=U.outputColorSpace,X.batching=U.batching,X.batchingColor=U.batchingColor,X.instancing=U.instancing,X.instancingColor=U.instancingColor,X.instancingMorph=U.instancingMorph,X.skinning=U.skinning,X.morphTargets=U.morphTargets,X.morphNormals=U.morphNormals,X.morphColors=U.morphColors,X.morphTargetsCount=U.morphTargetsCount,X.numClippingPlanes=U.numClippingPlanes,X.numIntersection=U.numClipIntersection,X.vertexAlphas=U.vertexAlphas,X.vertexTangents=U.vertexTangents,X.toneMapping=U.toneMapping}function nm(S,U){if(S.length===0)return null;if(S.length===1)return S[0].texture!==null?S[0]:null;y.setFromMatrixPosition(U.matrixWorld);for(let X=0,H=S.length;X<H;X++){let G=S[X];if(G.texture!==null&&G.boundingBox.containsPoint(y))return G}return null}function im(S,U,X,H,G){U.isScene!==!0&&(U=Ft),$.resetTextureUnits();let St=U.fog,Rt=H.isMeshStandardMaterial||H.isMeshLambertMaterial||H.isMeshPhongMaterial?U.environment:null,Mt=j===null?I.outputColorSpace:j.isXRRenderTarget===!0?j.texture.colorSpace:Qt.workingColorSpace,Ct=H.isMeshStandardMaterial||H.isMeshLambertMaterial&&!H.envMap||H.isMeshPhongMaterial&&!H.envMap,Lt=lt.get(H.envMap||Rt,Ct),$t=H.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,ee=!!X.attributes.tangent&&(!!H.normalMap||H.anisotropy>0),Pt=!!X.morphAttributes.position,de=!!X.morphAttributes.normal,Ne=!!X.morphAttributes.color,be=Gn;H.toneMapped&&(j===null||j.isXRRenderTarget===!0)&&(be=I.toneMapping);let me=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,je=me!==void 0?me.length:0,Et=W.get(H),rn=b.state.lights;if(rt===!0&&(at===!0||S!==Z)){let xe=S===Z&&H.id===q;Nt.setState(H,S,xe)}let re=!1;H.version===Et.__version?(Et.needsLights&&Et.lightsStateVersion!==rn.state.version||Et.outputColorSpace!==Mt||G.isBatchedMesh&&Et.batching===!1||!G.isBatchedMesh&&Et.batching===!0||G.isBatchedMesh&&Et.batchingColor===!0&&G._colorsTexture===null||G.isBatchedMesh&&Et.batchingColor===!1&&G._colorsTexture!==null||G.isInstancedMesh&&Et.instancing===!1||!G.isInstancedMesh&&Et.instancing===!0||G.isSkinnedMesh&&Et.skinning===!1||!G.isSkinnedMesh&&Et.skinning===!0||G.isInstancedMesh&&Et.instancingColor===!0&&G.instanceColor===null||G.isInstancedMesh&&Et.instancingColor===!1&&G.instanceColor!==null||G.isInstancedMesh&&Et.instancingMorph===!0&&G.morphTexture===null||G.isInstancedMesh&&Et.instancingMorph===!1&&G.morphTexture!==null||Et.envMap!==Lt||H.fog===!0&&Et.fog!==St||Et.numClippingPlanes!==void 0&&(Et.numClippingPlanes!==Nt.numPlanes||Et.numIntersection!==Nt.numIntersection)||Et.vertexAlphas!==$t||Et.vertexTangents!==ee||Et.morphTargets!==Pt||Et.morphNormals!==de||Et.morphColors!==Ne||Et.toneMapping!==be||Et.morphTargetsCount!==je||!!Et.lightProbeGrid!=b.state.lightProbeGridArray.length>0)&&(re=!0):(re=!0,Et.__version=H.version);let wn=Et.currentProgram;re===!0&&(wn=oo(H,U,G),O&&H.isNodeMaterial&&O.onUpdateProgram(H,wn,Et));let $n=!1,yi=!1,xs=!1,pe=wn.getUniforms(),Ie=Et.uniforms;if(x.useProgram(wn.program)&&($n=!0,yi=!0,xs=!0),H.id!==q&&(q=H.id,yi=!0),Et.needsLights){let xe=nm(b.state.lightProbeGridArray,G);Et.lightProbeGrid!==xe&&(Et.lightProbeGrid=xe,yi=!0)}if($n||Z!==S){x.buffers.depth.getReversed()&&S.reversedDepth!==!0&&(S._reversedDepth=!0,S.updateProjectionMatrix()),pe.setValue(D,"projectionMatrix",S.projectionMatrix),pe.setValue(D,"viewMatrix",S.matrixWorldInverse);let Si=pe.map.cameraPosition;Si!==void 0&&Si.setValue(D,ct.setFromMatrixPosition(S.matrixWorld)),R.logarithmicDepthBuffer&&pe.setValue(D,"logDepthBufFC",2/(Math.log(S.far+1)/Math.LN2)),(H.isMeshPhongMaterial||H.isMeshToonMaterial||H.isMeshLambertMaterial||H.isMeshBasicMaterial||H.isMeshStandardMaterial||H.isShaderMaterial)&&pe.setValue(D,"isOrthographic",S.isOrthographicCamera===!0),Z!==S&&(Z=S,yi=!0,xs=!0)}if(Et.needsLights&&(rn.state.sunShadowMap.length>0&&pe.setValue(D,"sunShadowMap",rn.state.sunShadowMap,$),rn.state.directionalShadowMap.length>0&&pe.setValue(D,"directionalShadowMap",rn.state.directionalShadowMap,$),rn.state.spotShadowMap.length>0&&pe.setValue(D,"spotShadowMap",rn.state.spotShadowMap,$),rn.state.pointShadowMap.length>0&&pe.setValue(D,"pointShadowMap",rn.state.pointShadowMap,$)),G.isSkinnedMesh){pe.setOptional(D,G,"bindMatrix"),pe.setOptional(D,G,"bindMatrixInverse");let xe=G.skeleton;xe&&(xe.boneTexture===null&&xe.computeBoneTexture(),pe.setValue(D,"boneTexture",xe.boneTexture,$))}G.isBatchedMesh&&(pe.setOptional(D,G,"batchingTexture"),pe.setValue(D,"batchingTexture",G._matricesTexture,$),pe.setOptional(D,G,"batchingIdTexture"),pe.setValue(D,"batchingIdTexture",G._indirectTexture,$),pe.setOptional(D,G,"batchingColorTexture"),G._colorsTexture!==null&&pe.setValue(D,"batchingColorTexture",G._colorsTexture,$));let Mi=X.morphAttributes;if((Mi.position!==void 0||Mi.normal!==void 0||Mi.color!==void 0)&&B.update(G,X,wn),(yi||Et.receiveShadow!==G.receiveShadow)&&(Et.receiveShadow=G.receiveShadow,pe.setValue(D,"receiveShadow",G.receiveShadow)),(H.isMeshStandardMaterial||H.isMeshLambertMaterial||H.isMeshPhongMaterial)&&H.envMap===null&&U.environment!==null&&(Ie.envMapIntensity.value=U.environmentIntensity),Ie.dfgLUT!==void 0&&(Ie.dfgLUT.value=yy()),yi){if(pe.setValue(D,"toneMappingExposure",I.toneMappingExposure),Et.needsLights&&sm(Ie,xs),St&&H.fog===!0&&Dt.refreshFogUniforms(Ie,St),Dt.refreshMaterialUniforms(Ie,H,tt,Y,b.state.transmissionRenderTarget[S.id]),Et.needsLights&&Et.lightProbeGrid){let xe=Et.lightProbeGrid;Ie.probesSH.value=xe.texture,Ie.probesMin.value.copy(xe.boundingBox.min),Ie.probesMax.value.copy(xe.boundingBox.max),Ie.probesResolution.value.copy(xe.resolution)}sr.upload(D,Wu(Et),Ie,$)}if(H.isShaderMaterial&&H.uniformsNeedUpdate===!0&&(sr.upload(D,Wu(Et),Ie,$),H.uniformsNeedUpdate=!1),H.isSpriteMaterial&&pe.setValue(D,"center",G.center),pe.setValue(D,"modelViewMatrix",G.modelViewMatrix),pe.setValue(D,"normalMatrix",G.normalMatrix),pe.setValue(D,"modelMatrix",G.matrixWorld),H.uniformsGroups!==void 0){let xe=H.uniformsGroups;for(let Si=0,_s=xe.length;Si<_s;Si++){let Yu=xe[Si];st.update(Yu,wn),st.bind(Yu,wn)}}return wn}function sm(S,U){S.ambientLightColor.needsUpdate=U,S.lightProbe.needsUpdate=U,S.sunLights.needsUpdate=U,S.sunLightShadows.needsUpdate=U,S.directionalLights.needsUpdate=U,S.directionalLightShadows.needsUpdate=U,S.pointLights.needsUpdate=U,S.pointLightShadows.needsUpdate=U,S.spotLights.needsUpdate=U,S.spotLightShadows.needsUpdate=U,S.rectAreaLights.needsUpdate=U,S.hemisphereLights.needsUpdate=U}function rm(S){return S.isMeshLambertMaterial||S.isMeshToonMaterial||S.isMeshPhongMaterial||S.isMeshStandardMaterial||S.isShadowMaterial||S.isShaderMaterial&&S.lights===!0}this.getActiveCubeFace=function(){return k},this.getActiveMipmapLevel=function(){return V},this.getRenderTarget=function(){return j},this.setRenderTargetTextures=function(S,U,X){let H=W.get(S);H.__autoAllocateDepthBuffer=S.resolveDepthBuffer===!1,H.__autoAllocateDepthBuffer===!1&&(H.__useRenderToTexture=!1),W.get(S.texture).__webglTexture=U,W.get(S.depthTexture).__webglTexture=H.__autoAllocateDepthBuffer?void 0:X,H.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(S,U){let X=W.get(S);X.__webglFramebuffer=U,X.__useDefaultFramebuffer=U===void 0},this.setRenderTarget=function(S,U=0,X=0){j=S,k=U,V=X;let H=null,G=!1,St=!1;if(S){let Mt=W.get(S);if(Mt.__useDefaultFramebuffer!==void 0){x.bindFramebuffer(D.FRAMEBUFFER,Mt.__webglFramebuffer),K.copy(S.viewport),At.copy(S.scissor),yt=S.scissorTest,x.viewport(K),x.scissor(At),x.setScissorTest(yt),q=-1;return}else if(Mt.__webglFramebuffer===void 0)$.setupRenderTarget(S);else if(Mt.__hasExternalTextures)$.rebindTextures(S,W.get(S.texture).__webglTexture,W.get(S.depthTexture).__webglTexture);else if(S.depthBuffer){let $t=S.depthTexture;if(Mt.__boundDepthTexture!==$t){if($t!==null&&W.has($t)&&(S.width!==$t.image.width||S.height!==$t.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");$.setupDepthRenderbuffer(S)}}let Ct=S.texture;(Ct.isData3DTexture||Ct.isDataArrayTexture||Ct.isCompressedArrayTexture)&&(St=!0);let Lt=W.get(S).__webglFramebuffer;S.isWebGLCubeRenderTarget?(Array.isArray(Lt[U])?H=Lt[U][X]:H=Lt[U],G=!0):S.samples>0&&$.useMultisampledRTT(S)===!1?H=W.get(S).__webglMultisampledFramebuffer:Array.isArray(Lt)?H=Lt[X]:H=Lt,K.copy(S.viewport),At.copy(S.scissor),yt=S.scissorTest}else K.copy(wt).multiplyScalar(tt).floor(),At.copy(Vt).multiplyScalar(tt).floor(),yt=le;if(X!==0&&(H=L),x.bindFramebuffer(D.FRAMEBUFFER,H)&&x.drawBuffers(S,H),x.viewport(K),x.scissor(At),x.setScissorTest(yt),G){let Mt=W.get(S.texture);D.framebufferTexture2D(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_CUBE_MAP_POSITIVE_X+U,Mt.__webglTexture,X)}else if(St){let Mt=U;for(let Ct=0;Ct<S.textures.length;Ct++){let Lt=W.get(S.textures[Ct]);D.framebufferTextureLayer(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0+Ct,Lt.__webglTexture,X,Mt)}}else if(S!==null&&X!==0){let Mt=W.get(S.texture);D.framebufferTexture2D(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,Mt.__webglTexture,X)}q=-1};function qu(S){let U=W.get(S);return(U.__readFormat!==S.format||U.__readType!==S.type)&&(U.__readFormat=S.format,U.__readType=S.type,U.__formatReadable=R.textureFormatReadable(S.format),U.__typeReadable=R.textureTypeReadable(S.type)),U}this.readRenderTargetPixels=function(S,U,X,H,G,St,Rt,Mt=0){if(!(S&&S.isWebGLRenderTarget)){Ht("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ct=W.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&Rt!==void 0&&(Ct=Ct[Rt]),Ct){x.bindFramebuffer(D.FRAMEBUFFER,Ct);try{let Lt=S.textures[Mt],$t=Lt.format,ee=Lt.type;S.textures.length>1&&D.readBuffer(D.COLOR_ATTACHMENT0+Mt);let Pt=qu(Lt);if(Pt.__formatReadable===!1){Ht("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Pt.__typeReadable===!1){Ht("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=S.width-H&&X>=0&&X<=S.height-G&&D.readPixels(U,X,H,G,gt.convert($t),gt.convert(ee),St)}finally{let Lt=j!==null?W.get(j).__webglFramebuffer:null;x.bindFramebuffer(D.FRAMEBUFFER,Lt)}}},this.readRenderTargetPixelsAsync=async function(S,U,X,H,G,St,Rt,Mt=0){if(!(S&&S.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ct=W.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&Rt!==void 0&&(Ct=Ct[Rt]),Ct)if(U>=0&&U<=S.width-H&&X>=0&&X<=S.height-G){x.bindFramebuffer(D.FRAMEBUFFER,Ct);let Lt=S.textures[Mt],$t=Lt.format,ee=Lt.type;S.textures.length>1&&D.readBuffer(D.COLOR_ATTACHMENT0+Mt);let Pt=qu(Lt);if(Pt.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Pt.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let de=D.createBuffer();D.bindBuffer(D.PIXEL_PACK_BUFFER,de),D.bufferData(D.PIXEL_PACK_BUFFER,St.byteLength,D.STREAM_READ),D.readPixels(U,X,H,G,gt.convert($t),gt.convert(ee),0),D.bindBuffer(D.PIXEL_PACK_BUFFER,null);let Ne=j!==null?W.get(j).__webglFramebuffer:null;x.bindFramebuffer(D.FRAMEBUFFER,Ne);let be=D.fenceSync(D.SYNC_GPU_COMMANDS_COMPLETE,0);return D.flush(),await hf(D,be,4),D.bindBuffer(D.PIXEL_PACK_BUFFER,de),D.getBufferSubData(D.PIXEL_PACK_BUFFER,0,St),D.bindBuffer(D.PIXEL_PACK_BUFFER,null),D.deleteBuffer(de),D.deleteSync(be),St}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(S,U=null,X=0){let H=Math.pow(2,-X),G=Math.floor(S.image.width*H),St=Math.floor(S.image.height*H),Rt=U!==null?U.x:0,Mt=U!==null?U.y:0;$.setTexture2D(S,0),D.copyTexSubImage2D(D.TEXTURE_2D,X,0,0,Rt,Mt,G,St),x.unbindTexture()},this.copyTextureToTexture=function(S,U,X=null,H=null,G=0,St=0){let Rt,Mt,Ct,Lt,$t,ee,Pt,de,Ne,be=S.isCompressedTexture?S.mipmaps[St]:S.image;if(X!==null)Rt=X.max.x-X.min.x,Mt=X.max.y-X.min.y,Ct=X.isBox3?X.max.z-X.min.z:1,Lt=X.min.x,$t=X.min.y,ee=X.isBox3?X.min.z:0;else{let Ie=Math.pow(2,-G);Rt=Math.floor(be.width*Ie),Mt=Math.floor(be.height*Ie),S.isDataArrayTexture?Ct=be.depth:S.isData3DTexture?Ct=Math.floor(be.depth*Ie):Ct=1,Lt=0,$t=0,ee=0}H!==null?(Pt=H.x,de=H.y,Ne=H.z):(Pt=0,de=0,Ne=0);let me=gt.convert(U.format),je=gt.convert(U.type),Et;U.isData3DTexture?($.setTexture3D(U,0),Et=D.TEXTURE_3D):U.isDataArrayTexture||U.isCompressedArrayTexture?($.setTexture2DArray(U,0),Et=D.TEXTURE_2D_ARRAY):($.setTexture2D(U,0),Et=D.TEXTURE_2D),x.activeTexture(D.TEXTURE0),x.pixelStorei(D.UNPACK_FLIP_Y_WEBGL,U.flipY),x.pixelStorei(D.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),x.pixelStorei(D.UNPACK_ALIGNMENT,U.unpackAlignment);let rn=x.getParameter(D.UNPACK_ROW_LENGTH),re=x.getParameter(D.UNPACK_IMAGE_HEIGHT),wn=x.getParameter(D.UNPACK_SKIP_PIXELS),$n=x.getParameter(D.UNPACK_SKIP_ROWS),yi=x.getParameter(D.UNPACK_SKIP_IMAGES);x.pixelStorei(D.UNPACK_ROW_LENGTH,be.width),x.pixelStorei(D.UNPACK_IMAGE_HEIGHT,be.height),x.pixelStorei(D.UNPACK_SKIP_PIXELS,Lt),x.pixelStorei(D.UNPACK_SKIP_ROWS,$t),x.pixelStorei(D.UNPACK_SKIP_IMAGES,ee);let xs=S.isDataArrayTexture||S.isData3DTexture,pe=U.isDataArrayTexture||U.isData3DTexture;if(S.isDepthTexture){let Ie=W.get(S),Mi=W.get(U),xe=W.get(Ie.__renderTarget),Si=W.get(Mi.__renderTarget);x.bindFramebuffer(D.READ_FRAMEBUFFER,xe.__webglFramebuffer),x.bindFramebuffer(D.DRAW_FRAMEBUFFER,Si.__webglFramebuffer);for(let _s=0;_s<Ct;_s++)xs&&(D.framebufferTextureLayer(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,W.get(S).__webglTexture,G,ee+_s),D.framebufferTextureLayer(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,W.get(U).__webglTexture,St,Ne+_s)),D.blitFramebuffer(Lt,$t,Rt,Mt,Pt,de,Rt,Mt,D.DEPTH_BUFFER_BIT,D.NEAREST);x.bindFramebuffer(D.READ_FRAMEBUFFER,null),x.bindFramebuffer(D.DRAW_FRAMEBUFFER,null)}else if(G!==0||S.isRenderTargetTexture||W.has(S)){let Ie=W.get(S),Mi=W.get(U);x.bindFramebuffer(D.READ_FRAMEBUFFER,C),x.bindFramebuffer(D.DRAW_FRAMEBUFFER,F);for(let xe=0;xe<Ct;xe++)xs?D.framebufferTextureLayer(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,Ie.__webglTexture,G,ee+xe):D.framebufferTexture2D(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,Ie.__webglTexture,G),pe?D.framebufferTextureLayer(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,Mi.__webglTexture,St,Ne+xe):D.framebufferTexture2D(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,Mi.__webglTexture,St),G!==0?D.blitFramebuffer(Lt,$t,Rt,Mt,Pt,de,Rt,Mt,D.COLOR_BUFFER_BIT,D.NEAREST):pe?D.copyTexSubImage3D(Et,St,Pt,de,Ne+xe,Lt,$t,Rt,Mt):D.copyTexSubImage2D(Et,St,Pt,de,Lt,$t,Rt,Mt);x.bindFramebuffer(D.READ_FRAMEBUFFER,null),x.bindFramebuffer(D.DRAW_FRAMEBUFFER,null)}else pe?S.isDataTexture||S.isData3DTexture?D.texSubImage3D(Et,St,Pt,de,Ne,Rt,Mt,Ct,me,je,be.data):U.isCompressedArrayTexture?D.compressedTexSubImage3D(Et,St,Pt,de,Ne,Rt,Mt,Ct,me,be.data):D.texSubImage3D(Et,St,Pt,de,Ne,Rt,Mt,Ct,me,je,be):S.isDataTexture?D.texSubImage2D(D.TEXTURE_2D,St,Pt,de,Rt,Mt,me,je,be.data):S.isCompressedTexture?D.compressedTexSubImage2D(D.TEXTURE_2D,St,Pt,de,be.width,be.height,me,be.data):D.texSubImage2D(D.TEXTURE_2D,St,Pt,de,Rt,Mt,me,je,be);x.pixelStorei(D.UNPACK_ROW_LENGTH,rn),x.pixelStorei(D.UNPACK_IMAGE_HEIGHT,re),x.pixelStorei(D.UNPACK_SKIP_PIXELS,wn),x.pixelStorei(D.UNPACK_SKIP_ROWS,$n),x.pixelStorei(D.UNPACK_SKIP_IMAGES,yi),St===0&&U.generateMipmaps&&D.generateMipmap(Et),x.unbindTexture()},this.initRenderTarget=function(S){W.get(S).__webglFramebuffer===void 0&&$.setupRenderTarget(S)},this.initTexture=function(S){S.isCubeTexture?$.setTextureCube(S,0):S.isData3DTexture?$.setTexture3D(S,0):S.isDataArrayTexture||S.isCompressedArrayTexture?$.setTexture2DArray(S,0):$.setTexture2D(S,0),x.unbindTexture()},this.resetState=function(){k=0,V=0,j=null,x.reset(),bt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return zn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let e=this.getContext();e.drawingBufferColorSpace=Qt._getDrawingBufferColorSpace(t),e.unpackColorSpace=Qt._getUnpackColorSpace()}};var lr={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};var Mn=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}},My=new Di(-1,1,1,-1,0,1),vu=class extends _e{constructor(){super(),this.setAttribute("position",new Jt([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new Jt([0,2,0,0,2,0],2))}},Sy=new vu,ki=class{constructor(t){this._mesh=new Tt(Sy,t)}dispose(){this._mesh.geometry.dispose()}render(t){t.render(this._mesh,My)}get material(){return this._mesh.material}set material(t){this._mesh.material=t}};var mc=class extends Mn{constructor(t,e="tDiffuse"){super(),this.textureID=e,this.uniforms=null,this.material=null,t instanceof Ee?(this.uniforms=t.uniforms,this.material=t):t&&(this.uniforms=xi.clone(t.uniforms),this.material=new Ee({name:t.name!==void 0?t.name:"unspecified",defines:Object.assign({},t.defines),uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader})),this._fsQuad=new ki(this.material)}render(t,e,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};var Ha=class extends Mn{constructor(t,e){super(),this.scene=t,this.camera=e,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(t,e,n){let i=t.getContext(),r=t.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(i.REPLACE,i.REPLACE,i.REPLACE),r.buffers.stencil.setFunc(i.ALWAYS,a,4294967295),r.buffers.stencil.setClear(o),r.buffers.stencil.setLocked(!0),t.setRenderTarget(n),this.clear&&t.clear(),t.render(this.scene,this.camera),t.setRenderTarget(e),this.clear&&t.clear(),t.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(i.EQUAL,1,4294967295),r.buffers.stencil.setOp(i.KEEP,i.KEEP,i.KEEP),r.buffers.stencil.setLocked(!0)}},gc=class extends Mn{constructor(){super(),this.needsSwap=!1}render(t){t.state.buffers.stencil.setLocked(!1),t.state.buffers.stencil.setTest(!1)}};var xc=class{constructor(t,e){if(this.renderer=t,this._pixelRatio=t.getPixelRatio(),e===void 0){let n=t.getSize(new it);this._width=n.width,this._height=n.height,e=new Fe(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:Ke}),e.texture.name="EffectComposer.rt1"}else this._width=e.width,this._height=e.height;this.renderTarget1=e,this.renderTarget2=e.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new mc(lr),this.copyPass.material.blending=An,this.timer=new ba}swapBuffers(){let t=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=t}addPass(t){this.passes.push(t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(t,e){this.passes.splice(e,0,t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(t){let e=this.passes.indexOf(t);e!==-1&&this.passes.splice(e,1)}isLastEnabledPass(t){for(let e=t+1;e<this.passes.length;e++)if(this.passes[e].enabled)return!1;return!0}render(t){this.timer.update(),t===void 0&&(t=this.timer.getDelta());let e=this.renderer.getRenderTarget(),n=!1;for(let i=0,r=this.passes.length;i<r;i++){let a=this.passes[i];if(a.enabled!==!1){if(a.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(i),a.render(this.renderer,this.writeBuffer,this.readBuffer,t,n),a.needsSwap){if(n){let o=this.renderer.getContext(),c=this.renderer.state.buffers.stencil;c.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,t),c.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}Ha!==void 0&&(a instanceof Ha?n=!0:a instanceof gc&&(n=!1))}}this.renderer.setRenderTarget(e)}reset(t){if(t===void 0){let e=this.renderer.getSize(new it);this._pixelRatio=this.renderer.getPixelRatio(),this._width=e.width,this._height=e.height,t=this.renderTarget1.clone(),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=t,this.renderTarget2=t.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(t,e){this._width=t,this._height=e;let n=this._width*this._pixelRatio,i=this._height*this._pixelRatio;this.renderTarget1.setSize(n,i),this.renderTarget2.setSize(n,i);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,i)}setPixelRatio(t){this._pixelRatio=t,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}};var _c=class extends Mn{constructor(t,e,n=null,i=null,r=null){super(),this.scene=t,this.camera=e,this.overrideMaterial=n,this.clearColor=i,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new ht}render(t,e,n){let i=t.autoClear;t.autoClear=!1;let r,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(t.getClearColor(this._oldClearColor),t.setClearColor(this.clearColor,t.getClearAlpha())),this.clearAlpha!==null&&(r=t.getClearAlpha(),t.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&t.clearDepth(),t.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),t.render(this.scene,this.camera),this.clearColor!==null&&t.setClearColor(this._oldClearColor),this.clearAlpha!==null&&t.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),t.autoClear=i}};var $f={name:"LuminosityHighPassShader",uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new ht(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`};var cr=class s extends Mn{constructor(t,e=1,n,i){super(),this.strength=e,this.radius=n,this.threshold=i,this.resolution=t!==void 0?new it(t.x,t.y):new it(256,256),this.clearColor=new ht(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new Fe(r,a,{type:Ke,depthBuffer:!1}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let h=0;h<this.nMips;h++){let d=new Fe(r,a,{type:Ke,depthBuffer:!1});d.texture.name="UnrealBloomPass.h"+h,d.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(d);let u=new Fe(r,a,{type:Ke,depthBuffer:!1});u.texture.name="UnrealBloomPass.v"+h,u.texture.generateMipmaps=!1,this.renderTargetsVertical.push(u),r=Math.round(r/2),a=Math.round(a/2)}let o=$f;this.highPassUniforms=xi.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=i,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new Ee({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];let c=[6,10,14,18,22];r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let h=0;h<this.nMips;h++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(c[h])),this.separableBlurMaterials[h].uniforms.invSize.value=new it(1/r,1/a),r=Math.round(r/2),a=Math.round(a/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=e,this.compositeMaterial.uniforms.bloomRadius.value=.1;let l=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=l,this.bloomTintColors=[new E(1,1,1),new E(1,1,1),new E(1,1,1),new E(1,1,1),new E(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=xi.clone(lr.uniforms),this.blendMaterial=new Ee({uniforms:this.copyUniforms,vertexShader:lr.vertexShader,fragmentShader:lr.fragmentShader,premultipliedAlpha:!0,blending:pn,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new ht,this._oldClearAlpha=1,this._basic=new we,this._fsQuad=new ki(null)}dispose(){for(let t=0;t<this.renderTargetsHorizontal.length;t++)this.renderTargetsHorizontal[t].dispose();for(let t=0;t<this.renderTargetsVertical.length;t++)this.renderTargetsVertical[t].dispose();this.renderTargetBright.dispose();for(let t=0;t<this.separableBlurMaterials.length;t++)this.separableBlurMaterials[t].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(t,e){let n=Math.round(t/2),i=Math.round(e/2);this.renderTargetBright.setSize(n,i);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(n,i),this.renderTargetsVertical[r].setSize(n,i),this.separableBlurMaterials[r].uniforms.invSize.value=new it(1/n,1/i),n=Math.round(n/2),i=Math.round(i/2)}render(t,e,n,i,r){t.getClearColor(this._oldClearColor),this._oldClearAlpha=t.getClearAlpha();let a=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),r&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=n.texture,t.setRenderTarget(null),t.clear(),this._fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this._fsQuad.render(t);let o=this.renderTargetBright;for(let c=0;c<this.nMips;c++)this._fsQuad.material=this.separableBlurMaterials[c],this.separableBlurMaterials[c].uniforms.colorTexture.value=o.texture,this.separableBlurMaterials[c].uniforms.direction.value=s.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[c]),t.clear(),this._fsQuad.render(t),this.separableBlurMaterials[c].uniforms.colorTexture.value=this.renderTargetsHorizontal[c].texture,this.separableBlurMaterials[c].uniforms.direction.value=s.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[c]),t.clear(),this._fsQuad.render(t),o=this.renderTargetsVertical[c];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this._fsQuad.render(t),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(n),this._fsQuad.render(t)),t.setClearColor(this._oldClearColor,this._oldClearAlpha),t.autoClear=a}_getSeparableBlurMaterial(t){let e=[],n=t/3;for(let a=0;a<t;a++)e.push(.39894*Math.exp(-.5*a*a/(n*n))/n);let i=[],r=[];for(let a=1;a<t;a+=2){let o=e[a],c=a+1<t?e[a+1]:0,l=o+c;i.push((a*o+(a+1)*c)/l),r.push(l)}return new Ee({defines:{KERNEL_PAIRS:i.length},uniforms:{colorTexture:{value:null},invSize:{value:new it(.5,.5)},direction:{value:new it(.5,.5)},centerWeight:{value:e[0]},gaussianOffsets:{value:i},gaussianWeights:{value:r}},vertexShader:`

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

				}`})}_getCompositeMaterial(t){return new Ee({defines:{NUM_MIPS:t},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

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

				}`})}};cr.BlurDirectionX=new it(1,0);cr.BlurDirectionY=new it(0,1);var Ga={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};var vc=class extends Mn{constructor(){super(),this.isOutputPass=!0,this.uniforms=xi.clone(Ga.uniforms),this.material=new Zs({name:Ga.name,uniforms:this.uniforms,vertexShader:Ga.vertexShader,fragmentShader:Ga.fragmentShader}),this._fsQuad=new ki(this.material),this._outputColorSpace=null,this._toneMapping=null}render(t,e,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=t.toneMappingExposure,(this._outputColorSpace!==t.outputColorSpace||this._toneMapping!==t.toneMapping)&&(this._outputColorSpace=t.outputColorSpace,this._toneMapping=t.toneMapping,this.material.defines={},Qt.getTransfer(this._outputColorSpace)===oe&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===Ta?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===wa?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===Ea?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===as?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===Ra?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===Ca?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===Aa&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};var yc=class extends Ki{constructor(){super(),this.name="RoomEnvironment",this.position.y=-3.5;let t=new ve;t.deleteAttribute("uv");let e=new ye({side:Oe}),n=new ye,i=new Ma(16777215,900,28,2);i.position.set(.418,16.199,.3),this.add(i);let r=new Tt(t,e);r.position.set(-.757,13.219,.717),r.scale.set(31.713,28.305,28.591),this.add(r);let a=new ea(t,n,6),o=new Be;o.position.set(-10.906,2.009,1.846),o.rotation.set(0,-.195,0),o.scale.set(2.328,7.905,4.651),o.updateMatrix(),a.setMatrixAt(0,o.matrix),o.position.set(-5.607,-.754,-.758),o.rotation.set(0,.994,0),o.scale.set(1.97,1.534,3.955),o.updateMatrix(),a.setMatrixAt(1,o.matrix),o.position.set(6.167,.857,7.803),o.rotation.set(0,.561,0),o.scale.set(3.927,6.285,3.687),o.updateMatrix(),a.setMatrixAt(2,o.matrix),o.position.set(-2.017,.018,6.124),o.rotation.set(0,.333,0),o.scale.set(2.002,4.566,2.064),o.updateMatrix(),a.setMatrixAt(3,o.matrix),o.position.set(2.291,-.756,-2.621),o.rotation.set(0,-.286,0),o.scale.set(1.546,1.552,1.496),o.updateMatrix(),a.setMatrixAt(4,o.matrix),o.position.set(-2.193,-.369,-5.547),o.rotation.set(0,.516,0),o.scale.set(3.875,3.487,2.986),o.updateMatrix(),a.setMatrixAt(5,o.matrix),this.add(a);let c=new Tt(t,hr(50));c.position.set(-16.116,14.37,8.208),c.scale.set(.1,2.428,2.739),this.add(c);let l=new Tt(t,hr(50));l.position.set(-16.109,18.021,-8.207),l.scale.set(.1,2.425,2.751),this.add(l);let h=new Tt(t,hr(17));h.position.set(14.904,12.198,-1.832),h.scale.set(.15,4.265,6.331),this.add(h);let d=new Tt(t,hr(43));d.position.set(-.462,8.89,14.52),d.scale.set(4.38,5.441,.088),this.add(d);let u=new Tt(t,hr(20));u.position.set(3.235,11.486,-12.541),u.scale.set(2.5,2,.1),this.add(u);let f=new Tt(t,hr(100));f.position.set(0,20,0),f.scale.set(1,.1,1),this.add(f)}dispose(){let t=new Set;this.traverse(e=>{e.isMesh&&(t.add(e.geometry),t.add(e.material))});for(let e of t)e.dispose()}};function hr(s){return new ga({color:0,emissive:16777215,emissiveIntensity:s})}var ut={dt:.008333333333333333,gravity:-6.5,ballRadius:.9125,ballMass:30,ballMaxSpeed:60,ballMaxAngVel:6,ballDrag:.0305,ballRestitution:.6,ballFriction:.35,carMass:180,carMaxSpeed:23,supersonic:22,throttleMaxSpeed:14.1,boostAccel:9.9167,boostPerSecond:33.33,brakeAccel:35,coastAccel:5.25,airThrottleAccel:.6667,jumpImpulse:2.9167,jumpHoldAccel:14.583,jumpHoldTime:.2,stickyAccel:3.25,doubleJumpWindow:1.25,dodgeImpulse:5,flipTime:.65,maxAngVel:5.5,rideHeight:.17,airPitchAccel:12.46,airYawAccel:9.11,airRollAccel:38.34,airPitchDamp:2.798,airYawDamp:1.886,airRollDamp:4.472,demoRespawnTime:3,startBoost:33.3},Sn={octane:{name:"Octane",hx:.59,hy:.18,hz:.42},dominus:{name:"Dominus",hx:.64,hy:.155,hz:.42},breakout:{name:"Breakout",hx:.66,hy:.15,hz:.4},merc:{name:"Merc",hx:.6,hy:.22,hz:.43}},ur=[{name:"BLEU",main:2059263,light:5939455,dark:732538,css:"#2f7bff"},{name:"ORANGE",main:16742932,light:16756316,dark:8006661,css:"#ff8a1f"}],Wa={rookie:{label:"Recrue",reaction:.28,aim:.55,boostUse:.35,aerial:0,flips:.3,speed:.85},pro:{label:"Pro",reaction:.14,aim:.8,boostUse:.8,aerial:.5,flips:.8,speed:.95},allstar:{label:"All-Star",reaction:.05,aim:.95,boostUse:1,aerial:1,flips:1,speed:1}},yu=["Viper","Hound","Sultan","Jester","Bandit","Gerwin","Poncho","Rainmaker","Merlin","Samara","Sundown","Tex","Casper","Foamer","Stinger","Shepard","Boomer","Raja","Squall","Myrtle"];var jt={W:40.96,L:51.2,H:20.44,RC:12,RV:3,GW:8.93,GH:6.43,GD:8.8,GEXT:6.5},{W:by,L:dr,H:Ty,RC:wy,RV:Xa,GW:Ey,GH:Jf,GD:Ay,GEXT:Kf}=jt,Zf=Ty/2,Qf=(Ay+Kf)/2,Ry=dr-Kf+Qf;function cn(s,t,e){let n=wy-Xa,i=Math.abs(s)-(by-Xa)+n,r=Math.abs(e)-(dr-Xa)+n,a=Math.hypot(Math.max(i,0),Math.max(r,0))+Math.min(Math.max(i,r),0)-n,o=Math.abs(t-Zf)-(Zf-Xa),c=Math.hypot(Math.max(a,0),Math.max(o,0))+Math.min(Math.max(a,o),0)-Xa,l=Math.abs(s)-Ey,h=Math.abs(t-Jf/2)-Jf/2,d=Math.abs(Math.abs(e)-Ry)-Qf,u=Math.hypot(Math.max(l,0),Math.max(h,0),Math.max(d,0))+Math.min(Math.max(l,h,d),0);return c<u?c:u}function _i(s,t,e,n){let r=cn(s-.004,t,e)-cn(s+.004,t,e),a=cn(s,t-.004,e)-cn(s,t+.004,e),o=cn(s,t,e-.004)-cn(s,t,e+.004),c=Math.hypot(r,a,o)||1;return n.set(r/c,a/c,o/c)}function Mu(s,t){return s>dr+t?0:s<-dr-t?1:-1}function Su(s){return s===0?-dr:dr}var Cy=[[-3072,-4096],[3072,-4096],[-3584,0],[3584,0],[-3072,4096],[3072,4096]],Py=[[0,-4240],[-1792,-4184],[1792,-4184],[-940,-3308],[940,-3308],[0,-2816],[-3584,-2484],[3584,-2484],[-1788,-2300],[1788,-2300],[-2048,-1036],[0,-1024],[2048,-1036],[-1024,0],[1024,0],[-2048,1036],[0,1024],[2048,1036],[-1788,2300],[1788,2300],[-3584,2484],[3584,2484],[0,2816],[-940,3310],[940,3308],[-1792,4184],[1792,4184],[0,4240]];function fr(){let s=[];for(let[t,e]of Cy)s.push({pos:new E(t/100,0,e/100),big:!0,active:!0,timer:0});for(let[t,e]of Py)s.push({pos:new E(t/100,0,e/100),big:!1,active:!0,timer:0});return s}var jf=[[-20.48,-25.6],[20.48,-25.6],[-2.56,-38.4],[2.56,-38.4],[0,-46.08]],tp={1:[[0],[1],[2],[3],[4]],2:[[0,1],[0,3],[2,1],[2,4],[3,4],[0,4],[1,4]],3:[[0,1,4],[0,3,4],[2,1,4],[0,1,2],[0,1,3]],4:[[0,1,2,4],[0,1,3,4]]},pr=[[-23.04,-46.08],[23.04,-46.08],[-26.88,-46.08],[26.88,-46.08]];var ds=ut.ballRadius,hs=new E,bu=new E,us=new E,Sc=new E,ep=new ae;function wu(s,t,e){let n=t.length();n<1e-7||(Sc.copy(t).multiplyScalar(1/n),ep.setFromAxisAngle(Sc,n*e),s.premultiply(ep).normalize())}function np(s,t){s.vel.y+=ut.gravity*t,s.vel.multiplyScalar(1-ut.ballDrag*t);let e=s.vel.length();e>ut.ballMaxSpeed&&s.vel.multiplyScalar(ut.ballMaxSpeed/e),s.pos.addScaledVector(s.vel,t);let n=0,r=cn(s.pos.x,s.pos.y,s.pos.z)+ds;if(r>0){_i(s.pos.x,s.pos.y,s.pos.z,hs),s.pos.addScaledVector(hs,r);let o=s.vel.dot(hs);if(o<0){n=-o;let l=-(1+(o>-.6?0:ut.ballRestitution))*o;s.vel.addScaledVector(hs,l),bu.copy(hs).multiplyScalar(-ds),us.crossVectors(s.angVel,bu).add(s.vel),us.addScaledVector(hs,-us.dot(hs));let h=us.length();if(h>1e-6){let d=Math.min(ut.ballFriction*l,h/3.5);us.multiplyScalar(1/h),s.vel.addScaledVector(us,-d),Sc.crossVectors(bu,us).multiplyScalar(-d*2.5/(ds*ds)),s.angVel.add(Sc)}}}let a=s.angVel.length();return a>ut.ballMaxAngVel&&s.angVel.multiplyScalar(ut.ballMaxAngVel/a),n}var bc=class{constructor(){this.pos=new E(0,ds,0),this.vel=new E,this.angVel=new E,this.quat=new ae,this.prevPos=this.pos.clone(),this.prevQuat=this.quat.clone(),this.radius=ds,this.hidden=!1,this.lastTouch=null,this.touches=[]}reset(t=0,e=ds,n=0){this.pos.set(t,e,n),this.vel.set(0,0,0),this.angVel.set(0,0,0),this.prevPos.copy(this.pos),this.prevQuat.copy(this.quat),this.hidden=!1,this.lastTouch=null,this.touches.length=0}step(t){if(this.prevPos.copy(this.pos),this.prevQuat.copy(this.quat),this.hidden)return 0;let e=np(this,t);return wu(this.quat,this.angVel,t),e}},Mc=new E,Tu=new E;function Eu(s,t,e){let n=s.vel.length();if(n<.001)return;Mc.copy(s.vel).multiplyScalar(1/n),Tu.set(t.x-s.pos.x,t.y-s.pos.y,t.z-s.pos.z).normalize();let i=Math.acos(Math.max(-1,Math.min(1,Mc.dot(Tu)))),r=1.6*e;i>1e-4&&Mc.lerp(Tu,Math.min(1,r/i)).normalize(),n<t.minSpeed&&(n+=(t.minSpeed-n)*Math.min(1,e*2.5)),s.vel.copy(Mc).multiplyScalar(n)}function ip(s,t=4,e=1/60,n=null){let i={pos:s.pos.clone(),vel:s.vel.clone(),angVel:s.angVel.clone()},r=[],a=2,o=e/a;for(let c=e;c<=t+1e-6;c+=e){for(let l=0;l<a;l++)np(i,o),n&&Eu(i,n,o);r.push({t:c,pos:i.pos.clone(),vel:i.vel.clone()})}return r}function Iy(){return{throttle:0,steer:0,pitch:0,yaw:0,roll:0,jump:!1,boost:!1,handbrake:!1}}function Ly(s){return s<14?16-14.4*(s/14):s<14.1?1.6*(14.1-s)/.1:0}var fs=[[0,.69],[5,.398],[10,.235],[15,.1375],[17.5,.11],[23,.088]];function Dy(s){if(s<=0)return fs[0][1];for(let t=1;t<fs.length;t++)if(s<=fs[t][0]){let[e,n]=fs[t-1],[i,r]=fs[t];return n+(r-n)*(s-e)/(i-e)}return fs[fs.length-1][1]}var Au=(s,t,e)=>s<t?t:s>e?e:s,Ru=[];for(let s of[-1,0,1])for(let t of[-1,0,1])for(let e of[-1,0,1])(s||t||e)&&Ru.push([s,t,e]);var Pn=new E,ai=new E,G1=new E,Me=new E,mr=new E,Tc=new E,Pe=new E,sp=new E,gr=new E,vi=new E,bn=new E,rp=new E,wc=new E,Ec=new ae,ap=new ae,Ac=new ae,Ny=new ae,Uy=0,Rc=class{constructor({team:t=0,name:e="Joueur",body:n="octane",isBot:i=!1,colors:r=null}={}){this.id=Uy++,this.team=t,this.name=e,this.isBot=i,this.bodyKey=Sn[n]?n:"octane",this.body=Sn[this.bodyKey],this.colors=r;let{hx:a,hy:o,hz:c}=this.body,l=1.4;this.invI=new E(12/(l*(4*o*o+4*c*c)),12/(l*(4*a*a+4*c*c)),12/(l*(4*a*a+4*o*o))),this.clearance=o+ut.rideHeight,this.pos=new E,this.vel=new E,this.quat=new ae,this.angVel=new E,this.prevPos=new E,this.prevQuat=new ae,this.groundNormal=new E(0,1,0),this.contactNormal=new E(0,1,0),this.rightingAxis=new E,this.controls=Iy(),this.stats={score:0,goals:0,assists:0,saves:0,shots:0,demos:0},this.resetState()}resetState(){this.boost=ut.startBoost,this.onGround=!1,this.jumping=!1,this.jumpTime=0,this.jumpLock=0,this.hasJumped=!1,this.hasDoubleJumped=!1,this.hasFlipped=!1,this.airTimeSinceJump=0,this.flipping=!1,this.flipTime=0,this.flipDir={x:0,y:0},this.prevJump=!1,this.demolished=!1,this.respawnTimer=0,this.boosting=!1,this.supersonic=!1,this.contactTimer=1,this.groundTime=0,this.airTime=0,this.lastExtraHit=-10,this.lastShotTime=-10,this.wheelSpin=0,this.steerVis=0,this.justJumped=!1,this.justDodged=!1,this.righting=0}placeAt(t,e,n,i){this.resetState(),this.pos.set(t,this.clearance,e),this.vel.set(0,0,0),this.angVel.set(0,0,0),this.quat.setFromAxisAngle(Pe.set(0,1,0),Math.atan2(-i,n)),this.prevPos.copy(this.pos),this.prevQuat.copy(this.quat),this.onGround=!0,this.groundNormal.set(0,1,0)}forward(t){return t.set(1,0,0).applyQuaternion(this.quat)}up(t){return t.set(0,1,0).applyQuaternion(this.quat)}right(t){return t.set(0,0,1).applyQuaternion(this.quat)}applyInvInertia(t,e){return Ac.copy(this.quat).invert(),e.copy(t).applyQuaternion(Ac),e.x*=this.invI.x,e.y*=this.invI.y,e.z*=this.invI.z,e.applyQuaternion(this.quat)}demolish(){this.demolished=!0,this.respawnTimer=ut.demoRespawnTime,this.vel.set(0,0,0),this.angVel.set(0,0,0),this.boosting=!1}canDodge(){return!this.hasFlipped&&!this.hasDoubleJumped&&(!this.hasJumped||this.airTimeSinceJump<ut.doubleJumpWindow)}step(t){if(this.prevPos.copy(this.pos),this.prevQuat.copy(this.quat),this.justJumped=!1,this.justDodged=!1,this.demolished)return;let e=this.controls,n=e.jump&&!this.prevJump;this.prevJump=e.jump,this.up(ai);let i=-cn(this.pos.x,this.pos.y,this.pos.z);_i(this.pos.x,this.pos.y,this.pos.z,Me),this.jumpLock=Math.max(0,this.jumpLock-t);let r=this.jumpLock<=0&&i<this.clearance+.12&&ai.dot(Me)>.55;this.contactTimer+=t,r?(this.onGround||(this.hasJumped=!1,this.hasDoubleJumped=!1,this.hasFlipped=!1,this.flipping=!1,this.jumping=!1,this.righting=0,this.airTimeSinceJump=0),this.onGround=!0,this.groundTime+=t,this.airTime=0,this.groundNormal.copy(Me),this.driveGround(t,e,n)):(this.onGround=!1,this.groundTime=0,this.airTime+=t,this.airControl(t,e,n)),this.jumping&&(this.jumpTime+=t,e.jump&&this.jumpTime<ut.jumpHoldTime?(this.up(Pe),this.vel.addScaledVector(Pe,ut.jumpHoldAccel*t)):this.jumping=!1),this.boosting=!1,e.boost&&this.boost>0?(this.boosting=!0,this.forward(Pn),this.vel.addScaledVector(Pn,ut.boostAccel*t),this.boost=Math.max(0,this.boost-ut.boostPerSecond*t)):!this.onGround&&e.throttle&&(this.forward(Pn),this.vel.addScaledVector(Pn,ut.airThrottleAccel*e.throttle*t)),this.vel.y+=ut.gravity*t;let a=this.vel.length();if(a>ut.carMaxSpeed&&this.vel.multiplyScalar(ut.carMaxSpeed/a),this.pos.addScaledVector(this.vel,t),r||wu(this.quat,this.angVel,t),r){let c=-cn(this.pos.x,this.pos.y,this.pos.z);if(_i(this.pos.x,this.pos.y,this.pos.z,Me),c<this.clearance){this.pos.addScaledVector(Me,this.clearance-c);let l=this.vel.dot(Me);l<0&&this.vel.addScaledVector(Me,-l)}}this.collideArena();let o=this.vel.length();this.supersonic=o>=(this.supersonic?21:ut.supersonic),this.forward(Pn),this.wheelSpin+=this.vel.dot(Pn)*t/.17,this.steerVis+=(e.steer-this.steerVis)*Math.min(1,t*12)}driveGround(t,e,n){this.up(ai),ai.dot(Me)<.99999&&(ap.setFromUnitVectors(ai,Me),Ec.copy(Ny).slerp(ap,1-Math.exp(-t*28)),this.quat.premultiply(Ec).normalize()),this.forward(Pn),mr.copy(Pn).addScaledVector(Me,-Pn.dot(Me)).normalize(),Tc.crossVectors(mr,Me);let r=this.vel.dot(mr),a=-e.steer*Dy(Math.abs(r))*r*(e.handbrake?1.3:1),o=a*t;if(o!==0){Ec.setFromAxisAngle(Me,o),this.quat.premultiply(Ec).normalize();let u=this.vel.dot(Me);Pe.copy(this.vel).addScaledVector(Me,-u),Pe.applyAxisAngle(Me,o*(e.handbrake?.25:1)),this.vel.copy(Pe).addScaledVector(Me,u),mr.applyAxisAngle(Me,o),Tc.applyAxisAngle(Me,o)}r=this.vel.dot(mr);let c=this.vel.dot(Tc),l=e.boost&&this.boost>0?1:e.throttle,h=0;Math.abs(l)>.01?r*l>=-.05?h=l*Ly(Math.abs(r)):h=Math.sign(l)*Math.min(ut.brakeAccel,Math.abs(r)/t):r!==0&&(h=-Math.sign(r)*Math.min(ut.coastAccel,Math.abs(r)/t)),this.vel.addScaledVector(mr,h*t);let d=e.handbrake?2.2:26;this.vel.addScaledVector(Tc,c*Math.exp(-d*t)-c),this.vel.addScaledVector(Me,-ut.stickyAccel*t),this.angVel.copy(Me).multiplyScalar(a),n&&(this.vel.addScaledVector(Me,ut.jumpImpulse),this.jumping=!0,this.jumpTime=0,this.hasJumped=!0,this.hasDoubleJumped=!1,this.hasFlipped=!1,this.airTimeSinceJump=0,this.jumpLock=.1,this.onGround=!1,this.justJumped=!0)}airControl(t,e,n){if(this.hasJumped&&!this.jumping&&(this.airTimeSinceJump+=t),n&&!this.jumping){if(this.up(ai),this.contactTimer<.15&&ai.dot(this.contactNormal)<.55&&this.vel.length()<6){this.vel.addScaledVector(this.contactNormal,3.2),Pe.crossVectors(ai,this.contactNormal),Pe.lengthSq()<1e-4&&this.forward(Pe);let l=Math.acos(Au(ai.dot(this.contactNormal),-1,1));this.rightingAxis.copy(Pe.normalize()).multiplyScalar(ut.maxAngVel),this.righting=l/ut.maxAngVel,this.angVel.copy(this.rightingAxis),this.hasJumped=!0,this.hasFlipped=!0,this.justJumped=!0}else if(this.canDodge()){let l=e.pitch,h=Au(e.yaw+e.roll,-1,1);Math.abs(l)+Math.abs(h)>=.5?this.dodge(l,h):(this.vel.addScaledVector(ai,ut.jumpImpulse),this.hasDoubleJumped=!0,this.justJumped=!0)}}Ac.copy(this.quat).invert();let i=sp.copy(this.angVel).applyQuaternion(Ac),r=e.pitch,a=e.yaw,o=e.roll;if(this.righting>0){this.righting-=t,this.angVel.copy(this.rightingAxis);return}if(this.flipping&&(this.flipTime+=t,this.flipTime>=ut.flipTime+.5&&(this.flipping=!1)),this.flipping&&this.flipTime<ut.flipTime){let l=Au(-r*Math.sign(this.flipDir.x),0,1);i.x=this.flipDir.y*ut.maxAngVel,i.z=-this.flipDir.x*ut.maxAngVel*(1-l),i.y+=(-a*ut.airYawAccel-ut.airYawDamp*i.y*(1-Math.abs(a)))*t,this.flipTime>=.15&&(this.vel.y<0||this.flipTime<.21)&&(this.vel.y*=Math.pow(.65,t*120))}else{let l=this.flipping?0:1;i.x+=(o*ut.airRollAccel-ut.airRollDamp*i.x*l)*t,i.z+=(-r*ut.airPitchAccel-ut.airPitchDamp*i.z*(1-Math.abs(r))*l)*t,i.y+=(-a*ut.airYawAccel-ut.airYawDamp*i.y*(1-Math.abs(a)))*t}let c=i.length();c>ut.maxAngVel&&i.multiplyScalar(ut.maxAngVel/c),this.angVel.copy(i).applyQuaternion(this.quat)}dodge(t,e){let n=Math.hypot(t,e);t/=n,e/=n,this.forward(Pn),Pe.set(Pn.x,0,Pn.z),Pe.lengthSq()<1e-4&&this.up(Pe).set(-Pe.x,0,-Pe.z),Pe.normalize(),gr.set(-Pe.z,0,Pe.x);let i=this.vel.dot(Pe),r=Math.abs(i)/ut.carMaxSpeed,a=Math.abs(i)<1?t<0:t>=0!=i>0,o=t*ut.dodgeImpulse,c=e*ut.dodgeImpulse;a&&(o*=(1.5*r+1)*(16/15)),c*=.9*r+1,this.vel.addScaledVector(Pe,o).addScaledVector(gr,c),this.flipping=!0,this.flipTime=0,this.flipDir.x=t,this.flipDir.y=e,this.hasFlipped=!0,this.justDodged=!0}collideArena(){let{hx:t,hy:e,hz:n}=this.body;for(let i=0;i<3;i++){let r=0,a=0;for(let c of Ru){bn.set(c[0]*t,c[1]*e,c[2]*n).applyQuaternion(this.quat).add(this.pos);let l=cn(bn.x,bn.y,bn.z);l>0&&(a++,l>r&&(r=l,vi.copy(bn)))}if(a===0)break;_i(vi.x,vi.y,vi.z,Me),this.pos.addScaledVector(Me,r),this.contactNormal.copy(Me),this.contactTimer=0,vi.set(0,0,0),wc.set(0,0,0);let o=0;for(let c of Ru)bn.set(c[0]*t,c[1]*e,c[2]*n).applyQuaternion(this.quat).add(this.pos),cn(bn.x,bn.y,bn.z)>-.03&&(vi.add(bn),wc.add(_i(bn.x,bn.y,bn.z,Me)),o++);o!==0&&(rp.copy(vi).multiplyScalar(1/o),wc.normalize(),this.contactImpulse(rp,wc,.15,.55))}this.contactTimer===0&&!this.onGround&&this.vel.lengthSq()<.5&&this.angVel.lengthSq()<.8&&Math.max(-this.up(Pe).dot(this.contactNormal),Math.abs(this.right(Pe).dot(this.contactNormal)))>.9&&(this.vel.multiplyScalar(.85),this.angVel.multiplyScalar(.8))}contactImpulse(t,e,n,i){let r=Pe.copy(t).sub(this.pos),a=sp.crossVectors(this.angVel,r).add(this.vel),o=a.dot(e);if(o>=0)return;let c=gr.crossVectors(r,e),l=this.applyInvInertia(c,gr),h=1+e.dot(vi.crossVectors(l,r)),d=-(1+(o<-1.5?n:0))*o/h;this.vel.addScaledVector(e,d),this.angVel.addScaledVector(l,d),a.crossVectors(this.angVel,r).add(this.vel),a.addScaledVector(e,-a.dot(e));let u=a.length();if(u<1e-5)return;let f=a.multiplyScalar(1/u),p=gr.crossVectors(r,f),_=this.applyInvInertia(p,gr),m=1+f.dot(vi.crossVectors(_,r)),g=Math.min(u/m,i*d);this.vel.addScaledVector(f,-g),this.angVel.addScaledVector(_,-g)}};var Vi=ut.ballMass,Hi=ut.carMass,Xn=ut.ballRadius,sn=new E,ie=new E,op=new E,qa=new E,Cc=new E,Pc=new E,Ic=new E,Lc=new E,qn=new E,Ja=new E,lp=new ae,xr=(s,t,e)=>s<t?t:s>e?e:s;function Fy(s){return s<=5?.65:s<=23?.65-.1*(s-5)/18:s<=46?.55-.25*(s-23)/23:.3}function gp(s,t,e){if(s.demolished||t.hidden)return 0;let{hx:n,hy:i,hz:r}=s.body;if(lp.copy(s.quat).invert(),sn.copy(t.pos).sub(s.pos).applyQuaternion(lp),Math.abs(sn.x)>n+Xn||Math.abs(sn.y)>i+Xn||Math.abs(sn.z)>r+Xn)return 0;let a=xr(sn.x,-n,n),o=xr(sn.y,-i,i),c=xr(sn.z,-r,r);ie.set(sn.x-a,sn.y-o,sn.z-c);let l=ie.length();if(l>=Xn)return 0;let h;if(l>1e-6)ie.multiplyScalar(1/l),h=Xn-l;else{let T=n-Math.abs(sn.x),b=i-Math.abs(sn.y),P=r-Math.abs(sn.z);T<b&&T<P?(ie.set(Math.sign(sn.x)||1,0,0),h=T+Xn):b<P?(ie.set(0,Math.sign(sn.y)||1,0),h=b+Xn):(ie.set(0,0,Math.sign(sn.z)||1),h=P+Xn)}op.set(a,o,c).applyQuaternion(s.quat).add(s.pos);let d=ie.y<-.85;ie.applyQuaternion(s.quat),t.pos.addScaledVector(ie,h*Hi/(Vi+Hi)),s.pos.addScaledVector(ie,-h*Vi/(Vi+Hi)),qa.copy(op).sub(s.pos),Cc.copy(ie).multiplyScalar(-Xn),Pc.crossVectors(s.angVel,qa).add(s.vel),Ic.crossVectors(t.angVel,Cc).add(t.vel);let u=Lc.copy(Ic).sub(Pc),f=u.dot(ie);if(d&&!s.onGround&&(s.hasJumped||s.hasFlipped||s.hasDoubleJumped)&&(s.hasJumped=!1,s.hasDoubleJumped=!1,s.hasFlipped=!1,s.flipReset=!0),f>=0)return 0;let p=Math.min(Math.hypot(t.vel.x-s.vel.x,t.vel.y-s.vel.y,t.vel.z-s.vel.z),46),_=s.applyInvInertia(qn.crossVectors(qa,ie),qn).multiplyScalar(1/Hi),m=1/Vi+1/Hi+ie.dot(Ja.crossVectors(_,qa)),g=-f/m;t.vel.addScaledVector(ie,g/Vi),s.vel.addScaledVector(ie,-g/Hi),s.angVel.addScaledVector(_,-g),Pc.crossVectors(s.angVel,qa).add(s.vel),Ic.crossVectors(t.angVel,Cc).add(t.vel),u.copy(Ic).sub(Pc),u.addScaledVector(ie,-u.dot(ie));let M=u.length();if(M>1e-5){let T=u.multiplyScalar(1/M),b=Math.min(M/(3.5/Vi+1/Hi),2*g);t.vel.addScaledVector(T,-b/Vi),s.vel.addScaledVector(T,b/Hi),qn.crossVectors(Cc,T).multiplyScalar(-b/(.4*Vi*Xn*Xn)),t.angVel.add(qn)}let w=-f;w>.4&&e-s.lastExtraHit>.05&&(s.lastExtraHit=e,qn.copy(t.pos).sub(s.pos),qn.y*=.35,qn.normalize(),s.forward(Ja),qn.addScaledVector(Ja,-qn.dot(Ja)*.35).normalize(),t.vel.addScaledVector(qn,p*Fy(p)));let y=t.vel.length();return y>ut.ballMaxSpeed&&t.vel.multiplyScalar(ut.ballMaxSpeed/y),w}var cp=.36,hp=new E,up=new E,dp=new E,fp=new E,pp=new E,mp=new E,Ya=new E,$a=new E;function By(s,t,e,n,i,r){let a=Lc.copy(t).sub(s),o=qn.copy(n).sub(e),c=Ja.copy(s).sub(e),l=a.dot(a),h=o.dot(o),d=o.dot(c),u=a.dot(c),f=a.dot(o),p=l*h-f*f,_=p>1e-8?xr((f*d-u*h)/p,0,1):0,m=(f*_+d)/h;m<0?(m=0,_=xr(-u/l,0,1)):m>1&&(m=1,_=xr((f-u)/l,0,1)),i.copy(s).addScaledVector(a,_),r.copy(e).addScaledVector(o,m)}function xp(s,t){if(s.demolished||t.demolished||s.pos.distanceToSquared(t.pos)>4)return null;s.forward(Ya),t.forward($a);let e=s.body.hx-.28,n=t.body.hx-.28;hp.copy(s.pos).addScaledVector(Ya,-e),up.copy(s.pos).addScaledVector(Ya,e),dp.copy(t.pos).addScaledVector($a,-n),fp.copy(t.pos).addScaledVector($a,n),By(hp,up,dp,fp,pp,mp),ie.copy(mp).sub(pp);let i=ie.length();if(i>=cp*2||i<1e-6)return null;ie.multiplyScalar(1/i);let r=cp*2-i;s.pos.addScaledVector(ie,-r/2),t.pos.addScaledVector(ie,r/2);let a=Lc.copy(t.vel).sub(s.vel).dot(ie);if(a>=0)return null;if(s.team!==t.team){if(s.supersonic&&Ya.dot(ie)>.55&&s.vel.dot(ie)>12)return t.demolish(),{type:"demo",attacker:s,victim:t};if(t.supersonic&&-$a.dot(ie)>.55&&-t.vel.dot(ie)>12)return s.demolish(),{type:"demo",attacker:t,victim:s}}let o=-(1+.25)*a/2;s.vel.addScaledVector(ie,-o),t.vel.addScaledVector(ie,o);let c=null,l=null;if(Ya.dot(ie)>.5&&s.vel.dot(ie)>4?(c=s,l=t):-$a.dot(ie)>.5&&-t.vel.dot(ie)>4&&(c=t,l=s,ie.negate()),c){let h=-a;return l.vel.addScaledVector(ie,h*.45),l.vel.y+=h*(l.onGround?.3:.12),l.jumpLock=.1,l.angVel.add(Lc.set((Math.random()-.5)*3,(Math.random()-.5)*2,(Math.random()-.5)*3)),{type:"bump",attacker:c,victim:l,strength:h}}return{type:"touch",attacker:s,victim:t,strength:-a}}var Oy=ut.gravity,_r={goal:100,assist:50,save:50,epicSave:75,shot:20,demo:25},zy=2,ky=720;function Vy(s){for(let t=s.length-1;t>0;t--){let e=Math.floor(Math.random()*(t+1));[s[t],s[e]]=[s[e],s[t]]}return s}function Dc(s,t=3.5){for(let e of s){if(e.t>t)break;let n=Mu(e.pos.z,ut.ballRadius*.5);if(n>=0)return{team:n,t:e.t}}return null}var Za=class{constructor(t){this.opts={duration:300,freeplay:!1,mode:"classic",unlimitedBoost:!1,noBoost:!1,gravityScale:1,replays:!0,...t},this.ball=new bc,this.cars=this.opts.players.map(e=>new Rc(e)),this.pads=fr(),this.score=[0,0],this.timeLeft=this.opts.duration,this.overtime=!1,this.overtimeElapsed=0,this.time=0,this.tickCount=0,this.state="countdown",this.stateTime=0,this.clockRunning=!1,this.events=[],this.frames=[],this.prediction=[],this.goalInfo=null,this.skipRequested=!1,this.replay=null,this.winner=-1,this.heatTouches=0,this.lastCountdown=4,this.opts.freeplay?this.startFreeplay():this.resetKickoff()}emit(t){this.events.push(t)}teamCars(t){return this.cars.filter(e=>e.team===t)}startFreeplay(){this.ball.reset(0,ut.ballRadius,0);let t=pr;this.cars.forEach((e,n)=>{let[i,r]=t[n%t.length],a=e.team===0?1:-1;e.placeAt(i*a,r*a,0,a),e.boost=100}),this.state="playing",this.stateTime=0,this.refreshPrediction()}resetKickoff(){this.ball.reset(0,ut.ballRadius,0);for(let n of this.pads)n.active=!0,n.timer=0;for(let n=0;n<2;n++){let i=this.teamCars(n),r=Math.min(Math.max(i.length,1),4),a=tp[r],o=Vy([...a[Math.floor(Math.random()*a.length)]]);i.forEach((c,l)=>{let h=n===0?1:-1,d,u;l<o.length?[d,u]=jf[o[l]]:[d,u]=pr[l%pr.length],d*=h,u*=h,c.placeAt(d,u,-d,-u),c.boost=this.startBoost()})}let t=this.teamCars(0),e=this.teamCars(1);for(let n=0;n<Math.min(t.length,e.length);n++){let i=t[n];e[n].placeAt(-i.pos.x,-i.pos.z,i.pos.x,i.pos.z),e[n].boost=this.startBoost()}this.state="countdown",this.stateTime=0,this.clockRunning=!1,this.lastCountdown=4,this.kickoff=!0,this.heatTouches=0,this.refreshPrediction(),this.emit({type:"kickoff"})}startBoost(){return this.opts.unlimitedBoost?100:this.opts.noBoost?0:ut.startBoost}homing(){let t=this.ball.lastTouch;return this.opts.mode!=="heatseeker"||!t||this.ball.hidden?null:{x:0,y:jt.GH*.45,z:t.car.team===0?jt.L+2:-jt.L-2,minSpeed:Math.min(38,14+1.6*this.heatTouches)}}refreshPrediction(){this.prediction=ip(this.ball,4,1/60,this.homing())}requestSkip(){this.skipRequested=!0}tick(t){switch(ut.gravity=Oy*this.opts.gravityScale,this.time+=t,this.stateTime+=t,this.tickCount++,this.state){case"countdown":{let e=Math.ceil(3-this.stateTime);e<this.lastCountdown&&e>0&&(this.lastCountdown=e,this.emit({type:"countdown",n:e}));for(let n of this.cars)n.prevPos.copy(n.pos),n.prevQuat.copy(n.quat),n.prevJump=n.controls.jump;this.ball.prevPos.copy(this.ball.pos),this.stateTime>=3&&(this.state="playing",this.stateTime=0,this.emit({type:"go"})),this.record();break}case"playing":this.simulate(t,!0),this.updateClock(t);break;case"goal":this.simulate(t,!1),this.stateTime>(this.opts.freeplay?2:3)&&(this.opts.freeplay?(this.ball.reset(0,ut.ballRadius,0),this.heatTouches=0,this.state="playing",this.stateTime=0,this.refreshPrediction()):this.opts.replays?this.startReplay():this.afterGoal());break;case"replay":this.replay.time+=t,!this.replay.goalShown&&this.replay.time>=this.replay.goalTime&&(this.replay.goalShown=!0,this.emit({type:"replayGoal",team:this.goalInfo.team,pos:this.goalInfo.pos.clone()})),(this.replay.time>=this.replay.end||this.skipRequested&&this.stateTime>.3)&&(this.replay=null,this.afterGoal());break;case"overtime":this.stateTime>2.5&&this.resetKickoff();break;default:break}this.skipRequested=!1}updateClock(t){if(this.opts.freeplay||!this.clockRunning)return;if(this.overtime){this.overtimeElapsed+=t;return}this.opts.duration<=0||(this.timeLeft=Math.max(0,this.timeLeft-t),this.timeLeft>0)||!(this.opts.mode==="heatseeker"||this.ball.pos.y-this.ball.radius<.08)||(this.score[0]!==this.score[1]?this.endMatch():(this.overtime=!0,this.state="overtime",this.stateTime=0,this.emit({type:"overtime"})))}endMatch(){this.state="ended",this.stateTime=0,this.winner=this.score[0]>this.score[1]?0:1,this.emit({type:"end",winner:this.winner})}afterGoal(){if(this.overtime)return this.endMatch();if(this.opts.duration>0&&this.timeLeft<=0){if(this.score[0]!==this.score[1])return this.endMatch();this.overtime=!0,this.state="overtime",this.stateTime=0,this.emit({type:"overtime"});return}this.resetKickoff()}simulate(t,e){let{cars:n,ball:i}=this;for(let o of n){if(o.demolished){o.respawnTimer-=t,o.respawnTimer<=0&&this.respawn(o),o.prevPos.copy(o.pos);continue}o.step(t),this.opts.unlimitedBoost?o.boost=100:this.opts.noBoost&&(o.boost=0),o.justJumped&&this.emit({type:"jump",car:o}),o.justDodged&&this.emit({type:"dodge",car:o})}let r=null;if(e&&!i.hidden){let o=i.step(t);o>2&&this.emit({type:"bounce",pos:i.pos.clone(),strength:o});let c=this.homing();c&&Eu(i,c,t);let l=n.length;for(let h=0;h<l;h++){let d=n[(h+this.tickCount)%l],u=gp(d,i,this.time);if(d.flipReset&&(d.flipReset=!1,this.emit({type:"flipReset",car:d})),u>0){if(u>1.2||!i.lastTouch||i.lastTouch.car!==d||this.time-i.lastTouch.time>.4){let f={car:d,time:this.time},p=i.touches[i.touches.length-1];(!p||this.time-p.time>.25)&&this.heatTouches++,i.touches.push(f),i.touches.length>20&&i.touches.shift(),u>1.2&&this.emit({type:"hit",car:d,pos:i.pos.clone(),strength:u}),r=r||[],r.push(d)}i.lastTouch={car:d,time:this.time},this.kickoff&&(this.kickoff=!1),this.clockRunning=!0}}}else i.prevPos.copy(i.pos),i.prevQuat.copy(i.quat);for(let o=0;o<n.length;o++)for(let c=o+1;c<n.length;c++){let l=xp(n[o],n[c]);l&&(l.type==="demo"?(this.state==="playing"&&(l.attacker.stats.demos++,this.addPoints(l.attacker,_r.demo,"D\xC9MOLITION")),this.emit({type:"demo",attacker:l.attacker,victim:l.victim,pos:l.victim.pos.clone()})):l.type==="bump"&&this.emit({type:"bump",attacker:l.attacker,victim:l.victim,strength:l.strength,pos:l.victim.pos.clone()}))}this.updatePads(t);let a=this.prediction;if((r||this.tickCount%4===0)&&this.refreshPrediction(),r&&this.state==="playing"&&this.touchStats(r,a),e&&!i.hidden&&this.state==="playing"){let o=Mu(i.pos.z,i.radius);o>=0&&this.onGoal(o)}this.record()}touchStats(t,e){let n=Dc(e,2.5),i=Dc(this.prediction,3.5);for(let r of t)if(i&&i.team===r.team&&this.time-r.lastShotTime>1.5&&(r.lastShotTime=this.time,r.stats.shots++,this.addPoints(r,_r.shot,"TIR CADR\xC9")),n&&n.team!==r.team&&(!i||i.team===r.team)){let a=n.t<.35;r.stats.saves++,this.addPoints(r,a?_r.epicSave:_r.save,a?"ARR\xCAT \xC9PIQUE":"ARR\xCAT")}}addPoints(t,e,n){t.stats.score+=e,this.emit({type:"stat",car:t,points:e,label:n})}respawn(t){let e=this.teamCars(t.team),n=Math.max(0,e.indexOf(t)),[i,r]=pr[n%pr.length],a=t.team===0?1:-1,o=t.stats;t.placeAt(i*a,r*a,0,a),t.boost=this.startBoost(),t.stats=o,this.emit({type:"respawn",car:t})}updatePads(t){for(let e of this.pads){if(!e.active){e.timer-=t,e.timer<=0&&(e.active=!0);continue}let n=e.big?2.08:1.44,i=e.big?1.68:1.65;for(let r of this.cars){if(r.demolished||r.boost>=100||this.opts.noBoost)continue;let a=r.pos.x-e.pos.x,o=r.pos.z-e.pos.z;if(a*a+o*o<n*n&&r.pos.y<i){r.boost=Math.min(100,r.boost+(e.big?100:12)),e.active=!1,e.timer=e.big?10:4,this.emit({type:"pad",car:r,big:e.big,pos:e.pos});break}}}}onGoal(t){let{ball:e}=this;this.score[t]++;let n=e.touches,i=null,r=null,a=-1;for(let l=n.length-1;l>=0;l--)if(n[l].car.team===t){i=n[l].car,a=l;break}if(i){for(let l=a-1;l>=0;l--){let h=n[l];if(h.car.team!==t)break;if(h.car!==i){n[a].time-h.time<5&&(r=h.car);break}}i.stats.goals++,this.addPoints(i,_r.goal,"BUT"),r&&(r.stats.assists++,this.addPoints(r,_r.assist,"PASSE D\xC9CISIVE"))}let o=Math.round(e.vel.length()*3.6),c=!i&&e.lastTouch&&e.lastTouch.car.team!==t?e.lastTouch.car:null;this.goalInfo={team:t,scorer:i,assist:r,ownGoal:c,pos:e.pos.clone(),speedKmh:o,time:this.time},this.emit({type:"goal",...this.goalInfo});for(let l of this.cars){if(l.demolished)continue;let h=l.pos.distanceTo(e.pos);if(h<14){let d=l.pos.clone().sub(e.pos).normalize();l.vel.addScaledVector(d,(14-h)*1.6),l.vel.y+=(14-h)*.5,l.jumpLock=.2}}e.hidden=!0,this.state="goal",this.stateTime=0}record(){if(this.tickCount%zy!==0)return;let t=this.ball,e={t:this.time,ball:[t.pos.x,t.pos.y,t.pos.z,t.quat.x,t.quat.y,t.quat.z,t.quat.w,t.hidden?1:0],cars:this.cars.map(n=>[n.pos.x,n.pos.y,n.pos.z,n.quat.x,n.quat.y,n.quat.z,n.quat.w,n.boosting?1:0,n.demolished?1:0,n.steerVis,n.wheelSpin,n.supersonic?1:0])};this.frames.push(e),this.frames.length>ky&&this.frames.shift()}startReplay(){let t=this.goalInfo.time,e=this.frames.length?this.frames[0].t:t,n=Math.max(e,t-5.5);this.replay={time:n,start:n,end:t+1.2,goalTime:t,goalShown:!1,frames:this.frames.slice()},this.state="replay",this.stateTime=0,this.emit({type:"replayStart"})}replaySnapshot(t){let e=this.replay?this.replay.frames:this.frames;if(!e.length)return null;let n=0,i=e.length-1;if(t<=e[0].t)i=0;else if(t>=e[i].t)n=i;else for(;i-n>1;){let c=n+i>>1;e[c].t<=t?n=c:i=c}let r=e[n],a=e[i],o=i===n?0:(t-r.t)/(a.t-r.t);return{a:r,b:a,k:o}}};var gn=(s,t,e)=>s<t?t:s>e?e:s,sT=ut.ballRadius,Nc=new E(0,ut.gravity,0),In=new E,Ka=new E,Mr=new E,Gi=new E,vr=new ae,Ye=new ae,_p=new ce;function Hy(s){return s<14?16-14.4*(s/14):s<14.1?1.6*(14.1-s)/.1:0}function vp(s){s.throttle=0,s.steer=0,s.pitch=0,s.yaw=0,s.roll=0,s.jump=!1,s.boost=!1,s.handbrake=!1}function Tn(s,t){return vr.copy(s.quat).invert(),Gi.copy(t).sub(s.pos).applyQuaternion(vr),{angle:Math.atan2(Gi.z,Gi.x),dist:Math.hypot(Gi.x,Gi.z),lx:Gi.x,ly:Gi.y,lz:Gi.z}}function Cu(s){return s.forward(Mr),s.vel.dot(Mr)}function Lu(s,t,e,n){let i=In.copy(e).normalize(),r=Ka.crossVectors(i,n);r.lengthSq()<1e-4&&s.right(r),r.normalize();let a=Mr.crossVectors(r,i).normalize();_p.makeBasis(i,a,r),Ye.setFromRotationMatrix(_p),vr.copy(s.quat).invert(),Ye.multiply(vr),Ye.w<0&&(Ye.x=-Ye.x,Ye.y=-Ye.y,Ye.z=-Ye.z,Ye.w=-Ye.w);let o=Math.hypot(Ye.x,Ye.y,Ye.z),c=2*Math.atan2(o,Ye.w),l=In.set(Ye.x,Ye.y,Ye.z);o>1e-6&&l.multiplyScalar(c/o),l.applyQuaternion(vr);let h=Ka.copy(s.angVel).applyQuaternion(vr),d=5.5,u=9,f=(l.x*d*1.6-h.x)*u*1.6,p=(l.y*d-h.y)*u,_=(l.z*d-h.z)*u;return t.roll=gn(f/ut.airRollAccel,-1,1),t.yaw=gn(-p/ut.airYawAccel,-1,1),t.pitch=gn(-_/ut.airPitchAccel,-1,1),c}var yr=class{constructor(t,e,n=!1){this.dx=t,this.dy=e,this.t=0,this.boost=n}update(t,e,n){return this.t+=t,e.throttle=1,e.boost=this.boost&&this.t<.5,this.t<.07?e.jump=!0:this.t<.1?e.jump=!1:this.t<.14?(e.jump=!0,e.pitch=this.dx,e.yaw=this.dy):e.pitch=this.dx*.3,this.t>.35&&n.onGround?!0:this.t>1.3}},Pu=class{constructor(t,e,n){this.bot=t,this.target=e.clone(),this.arrival=n,this.t=0,this.dodged=!1}update(t,e,n,i){this.t+=t,e.throttle=1;let r=i.ball;if(this.t<.2)return e.jump=!0,!1;if(!this.dodged){let a=Tn(n,r.pos),o=n.pos.distanceTo(r.pos);return o<2.6||this.t>.9?(n.canDodge()&&o<3.2&&(e.jump=!0,e.pitch=Math.cos(a.angle),e.yaw=Math.sin(a.angle)),this.dodged=!0):(n.forward(In),Lu(n,e,In.set(r.pos.x-n.pos.x,0,r.pos.z-n.pos.z),new E(0,1,0))),!1}return n.onGround&&this.t>.4?!0:this.t>2}},Iu=class{constructor(t,e){this.target=t.clone(),this.arrival=e,this.t=0}update(t,e,n,i){this.t+=t;let r=this.arrival-i.time;if(r<-.25||this.t>4.5||n.onGround&&this.t>.3||i.ball.lastTouch&&i.ball.lastTouch.time>i.time-.05&&this.t>.3)return!0;let a=Math.max(r,.08);Nc.y=ut.gravity;let o=In.copy(this.target).sub(n.pos).addScaledVector(n.vel,-a).multiplyScalar(2/(a*a)).sub(Nc),c=o.length(),l=o.clone().normalize();if(this.t<.2)e.jump=!0;else if(this.t<.24)e.jump=!1;else if(this.t<.28&&!n.hasDoubleJumped)return e.jump=!0,e.boost=!0,!1;let h=new E(0,1,0),d=Lu(n,e,l,h);return n.forward(Ka),e.boost=c>1.2&&Ka.dot(l)>.85&&n.boost>0,this.t<.2&&d>.6&&(e.boost=!1),!1}},Qa=class{constructor(t,e="pro"){this.car=t,this.d=Wa[e]||Wa.pro,this.maneuver=null,this.plan=null,this.planTimer=0,this.aimOffset=0,this.stuckTime=0,this.reach=new Float32Array(260)}update(t,e){let n=this.car,i=n.controls,r=i.jump;if(vp(i),n.demolished){this.maneuver=null;return}if(e.state==="countdown"){this.maneuver=null,this.plan=null;return}if(!(e.state!=="playing"&&e.state!=="goal")){if(this.maneuver){if(!this.maneuver.update(t,i,n,e,this))return;this.maneuver=null,vp(i)}if(this.planTimer-=t,(this.planTimer<=0||!this.plan)&&(this.plan=this.makePlan(e),this.planTimer=this.d.reaction+Math.random()*.05),!n.onGround){this.recover(i,n),r&&n.jumping&&(i.jump=!0);return}this.execute(t,i,e),this.unstick(t,i,n)}}unstick(t,e,n){!(n.vel.length()>1.5)&&Math.abs(e.throttle)>.5?this.stuckTime+=t:this.stuckTime=0,this.stuckTime>1.2&&(this.stuckTime=0,this.maneuver=new yr(-1,0)),n.onGround&&n.groundNormal.y<.35&&n.groundTime>.8&&this.plan&&this.plan.target&&this.plan.target.y<3&&(this.maneuver=new yr(0,0),this.maneuver.update=function(a,o,c){return this.t+=a,o.jump=this.t<.12,o.throttle=1,this.t>.25&&(c.onGround||this.t>1.5)})}recover(t,e){e.vel.lengthSq();let n=In.set(e.vel.x,0,e.vel.z);n.lengthSq()<1&&e.forward(n).setY(0),n.lengthSq()<1e-4&&n.set(1,0,0),Lu(e,t,n.clone(),new E(0,1,0)),t.throttle=1}computeReach(){let t=this.car,e=Math.max(0,Cu(t)),n=this.d.boostUse>.3?t.boost:0,i=0,r=1/60;for(let a=0;a<this.reach.length;a++){let o=Hy(e);n>0&&(o+=ut.boostAccel,n-=ut.boostPerSecond*r),e=Math.min(ut.carMaxSpeed*this.d.speed,e+o*r),i+=e*r,this.reach[a]=i}}reachIn(t){let e=Math.floor(t*60);return e<0?0:this.reach[Math.min(e,this.reach.length-1)]}findIntercept(t,e){let n=this.car;Nc.y=ut.gravity,this.computeReach();let i=t.prediction,r=5+this.d.aerial*10;for(let a=0;a<i.length;a+=2){let o=i[a],c=o.pos.y,l=Tn(n,o.pos),h=Math.abs(l.angle)*.32,d=Math.max(0,l.dist-1.4);if(c<1.9){if(this.reachIn(o.t-h)>=d)return{slice:o,kind:"ground"}}else if(c<3.3&&this.d.flips>.5){if(this.reachIn(o.t-h-.15)>=d)return{slice:o,kind:"jump"}}else if(e&&c<r&&n.boost>25&&o.t>.6){let u=o.t,f=In.copy(o.pos).sub(n.pos).addScaledVector(n.vel,-u);f.y-=3*u,f.multiplyScalar(2/(u*u)).sub(Nc);let p=n.boost/ut.boostPerSecond;if(f.length()<ut.boostAccel*.8&&p>u*.8&&Math.abs(l.angle)<.5)return{slice:o,kind:"aerial"}}}return null}makePlan(t){let e=this.car,n=t.ball,i=e.team,r=i===0?1:-1,a=Su(i);this.aimOffset=(Math.random()-.5)*(1-this.d.aim)*12;let o=t.cars.filter(f=>f.team===i&&!f.demolished);if(t.kickoff&&n.vel.lengthSq()<.01&&Math.abs(n.pos.x)+Math.abs(n.pos.z)<.1){let p=o.slice().sort((_,m)=>{let g=_.pos.length()-m.pos.length();return Math.abs(g)>.5?g:m.pos.x*r-_.pos.x*r}).indexOf(e);return p===0?{kind:"kickoff"}:p===1?this.boostPlan(t,!0)||{kind:"defend"}:{kind:"defend"}}let c=Dc(t.prediction,3),l=c&&c.team!==i,h=null,d=1/0;for(let f of o){let p=(n.pos.z-f.pos.z)*r>-1,_=f.pos.distanceTo(n.pos)+(p?0:18);f.isBot||(_-=4),f===e&&(_-=1),_<d&&(d=_,h=f)}if(h===e||l&&this.closestToGoal(o,a)===e){let f=this.findIntercept(t,this.d.aerial>0&&(!l||this.d.aerial>.7));if(!f)return{kind:"chase"};let p=f.slice.pos;if(!((p.z-e.pos.z)*r>.5)&&!l){let m=e.pos.x>p.x?1:-1,g=p.z-r*9;return{kind:"rotate",target:new E(gn(p.x+m*6,-jt.W+4,jt.W-4),0,gn(g,-jt.L+3,jt.L-3))}}return f.kind==="aerial"?{kind:"aerial",target:p.clone(),arrival:t.time+f.slice.t}:{kind:"attack",ball:p.clone(),arrival:t.time+f.slice.t,jump:f.kind==="jump",save:l,allowBoost:Math.random()<this.d.boostUse}}if(e.boost<40&&!l){let f=this.boostPlan(t,!1);if(f)return f}if(!l&&this.d.aerial>.7&&e.boost>45&&t.time-(this.lastDemoTry||-99)>12&&Math.random()<.05){this.lastDemoTry=t.time;let f=null,p=30;for(let _ of t.cars){if(_.team===i||_.demolished)continue;let m=Tn(e,_.pos);Math.abs(m.angle)<.5&&m.dist<p&&(p=m.dist,f=_)}if(f)return{kind:"demo",prey:f,until:t.time+3}}if(o.filter(f=>f!==h).indexOf(e)===0&&o.length>2){let f=n.pos.clone().lerp(new E(0,0,a),.45);return f.x=gn(f.x-Math.sign(n.pos.x||1)*6,-jt.W+6,jt.W-6),f.y=0,{kind:"support",target:f}}return{kind:"defend"}}closestToGoal(t,e){let n=null,i=1/0;for(let r of t){let a=Math.abs(r.pos.z-e)+Math.abs(r.pos.x)*.5;a<i&&(i=a,n=r)}return n}boostPlan(t,e){let n=this.car,i=n.team===0?1:-1,r=null,a=1/0;for(let o of t.pads){if(!o.big||!o.active)continue;let c=o.pos.z*i<=.1,l=n.pos.distanceTo(o.pos)+(c?0:25)+(e&&Math.abs(o.pos.z)<1?50:0);l<a&&(a=l,r=o)}return!r||!e&&a>45?null:{kind:"boost",target:r.pos.clone()}}execute(t,e,n){let i=this.car,r=this.plan,a=n.ball,o=i.team,c=o===0?1:-1,l=Su(o),h=Cu(i);switch(r.kind){case"kickoff":{let d=Tn(i,a.pos),u=In.copy(a.pos);if(u.z-=c*.9,this.driveTo(e,u,23,!0),d.dist<1.7+h*.17&&h>10){let f=d.angle;this.maneuver=new yr(Math.cos(f),gn(Math.sin(f)*1.5,-1,1),!0)}break}case"attack":{let d=r.ball,u=Math.max(r.arrival-n.time,.02);if(r.arrival<n.time-.3){this.planTimer=0;break}let f=-l,p=gn(d.x*.25+this.aimOffset,-jt.GW+1.8,jt.GW-1.8);r.save&&Math.abs(d.z-l)<25&&(p=d.x>0?jt.W:-jt.W);let _=Ka.set(p-d.x,0,f+c*3-d.z).normalize(),m=Tn(i,d),g=gn(m.dist*.4,1.3,7),M=new E(d.x-_.x*g,0,d.z-_.z*g);(Math.abs(M.x)>jt.W-1.5||Math.abs(M.z)>jt.L-1.5)&&M.set(d.x,0,d.z);let y=Tn(i,M).dist/u+2;m.dist>25&&(y=23),this.driveTo(e,M,y*this.d.speed,r.allowBoost),i.forward(Mr);let T=Mr.x*_.x+Mr.z*_.z;if(r.jump){let b=Math.hypot(d.x-i.pos.x,d.z-i.pos.z);u<.55&&b<h*u+2.2&&Math.abs(m.angle)<.5&&(this.maneuver=new Pu(this,d,r.arrival))}else if(i.pos.distanceTo(a.pos)<2.4+h*.13&&a.pos.y<2&&Math.abs(m.angle)<.35&&T>.55&&h>7&&Math.random()<this.d.flips*.25){let P=Tn(i,a.pos).angle;this.maneuver=new yr(Math.cos(P),gn(Math.sin(P)*1.6,-1,1))}break}case"aerial":{let d=Tn(i,r.target);Math.abs(d.angle)<.25||r.arrival-n.time<1.2?this.maneuver=new Iu(r.target,r.arrival):this.driveTo(e,In.set(r.target.x,0,r.target.z),10,!1);break}case"rotate":case"support":case"boost":{let d=Tn(i,r.target),u=r.kind==="support"?gn(d.dist*1.2,4,23):23;this.driveTo(e,r.target,u,r.kind!=="support"&&this.d.boostUse>.5),d.dist<2&&(this.planTimer=0);break}case"demo":{let d=r.prey;if(d.demolished||n.time>r.until){this.planTimer=0;break}let u=Math.min(1.5,i.pos.distanceTo(d.pos)/Math.max(10,h)),f=In.copy(d.pos).addScaledVector(d.vel,u);f.y=0,this.driveTo(e,f,23,!0),e.boost=i.boost>0&&Math.abs(Tn(i,f).angle)<.35,this.planTimer=Math.max(this.planTimer,.3);break}case"chase":{this.driveTo(e,In.set(a.pos.x,0,a.pos.z-c*3),16,!1);break}default:{let d=a.pos.x>0?-1:1,u=In.set(d*3.5,0,l+c*3.5),f=Tn(i,u);if(f.dist>4)this.driveTo(e,u,gn(f.dist*1.1,5,23),f.dist>25);else{let p=Tn(i,a.pos);e.steer=gn(p.angle*2.5,-1,1),e.throttle=Math.abs(p.angle)>.3?.35:h>.5?-.3:0,Math.abs(p.angle)>2.2&&(e.throttle=-.4),this.planTimer=Math.min(this.planTimer,.2)}break}}}driveTo(t,e,n,i){let r=this.car,a=Tn(r,e),o=Cu(r);t.steer=gn(a.angle*3.2,-1,1),t.handbrake=Math.abs(a.angle)>1.6&&o>7&&a.dist>2.5,n>o+.3?t.throttle=1:n<o-3?t.throttle=-1:t.throttle=.1,Math.abs(a.angle)>2.4&&a.dist<6&&o<4&&(t.throttle=-1,t.steer=-t.steer),t.boost=i&&r.boost>0&&Math.abs(a.angle)<.3&&n>o+1.5&&o<ut.carMaxSpeed-.3&&r.groundNormal.y>.7}};function oi(s,t){let e=document.createElement("canvas");return e.width=s,e.height=t,[e,e.getContext("2d")]}function Wi(s,t=!1){let e=new ji(s);return e.colorSpace=We,e.anisotropy=8,t&&(e.wrapS=e.wrapT=Ri),e}function Gy(s,t,e,n,i,r){s.beginPath(),s.moveTo(t+r,e),s.lineTo(t+n-r,e),s.arcTo(t+n,e,t+n,e+r,r),s.lineTo(t+n,e+i-r),s.arcTo(t+n,e+i,t+n-r,e+i,r),s.lineTo(t+r,e+i),s.arcTo(t,e+i,t,e+i-r,r),s.lineTo(t,e+r),s.arcTo(t,e,t+r,e,r),s.closePath()}function yp(s){let{W:t,L:e,RC:n,GW:i}=jt,r=20,a=Math.round(t*2*r),o=Math.round(e*2*r),[c,l]=oi(a,o),h=m=>(m+t)*r,d=m=>(e-m)*r;l.fillStyle=s.grassA,l.fillRect(0,0,a,o);let u=16;for(let m=0;m<u;m++)m%2||(l.fillStyle=s.grassB,l.fillRect(0,o/u*m,a,o/u));let f=l.createLinearGradient(0,0,0,o);f.addColorStop(0,"rgba(255,120,20,0.20)"),f.addColorStop(.45,"rgba(255,120,20,0.0)"),f.addColorStop(.55,"rgba(40,110,255,0.0)"),f.addColorStop(1,"rgba(40,110,255,0.22)"),l.fillStyle=f,l.fillRect(0,0,a,o);for(let m=0;m<26e3;m++){let g=Math.random()*.06;l.fillStyle=Math.random()<.5?`rgba(0,0,0,${g})`:`rgba(255,255,255,${g})`,l.fillRect(Math.random()*a,Math.random()*o,2+Math.random()*3,2+Math.random()*3)}l.strokeStyle="rgba(255,255,255,0.85)",l.lineWidth=.28*r;let p=3.4;Gy(l,h(-t+p),d(e-p),(t-p)*2*r,(e-p)*2*r,(n-2)*r),l.stroke(),l.beginPath(),l.moveTo(h(-t+p),d(0)),l.lineTo(h(t-p),d(0)),l.stroke(),l.beginPath(),l.arc(h(0),d(0),10*r,0,Math.PI*2),l.stroke(),l.beginPath(),l.arc(h(0),d(0),.9*r,0,Math.PI*2),l.fillStyle="rgba(255,255,255,0.85)",l.fill();for(let m of[1,-1]){let g=m*(e-p),M=i+6,w=11*m;l.beginPath(),l.moveTo(h(-M),d(g)),l.lineTo(h(-M+2),d(g-w)),l.lineTo(h(M-2),d(g-w)),l.lineTo(h(M),d(g)),l.stroke(),l.beginPath(),l.arc(h(0),d(g-w),5*r,m>0?0:Math.PI,m>0?Math.PI:Math.PI*2),l.stroke()}for(let m of fr())l.beginPath(),l.arc(h(m.pos.x),d(m.pos.z),(m.big?2.2:1.3)*r,0,Math.PI*2),l.fillStyle="rgba(20,20,20,0.35)",l.fill(),l.lineWidth=.12*r,l.strokeStyle="rgba(255,200,80,0.6)",l.stroke();l.save(),l.translate(h(0),d(0)),l.rotate(-Math.PI/2),l.font=`italic 900 ${3.2*r}px Arial Black, Arial, sans-serif`,l.textAlign="center",l.textBaseline="middle",l.fillStyle="rgba(255,255,255,0.22)",l.fillText("SUPERSONIC",0,-1.7*r),l.fillText("ARENA",0,1.9*r),l.restore();let _=Wi(c);return _.generateMipmaps=!0,_}function Mp(){let e=Math.round(Math.sqrt(3)*32),[n,i]=oi(192,e*2);i.clearRect(0,0,192,e*2),i.strokeStyle="rgba(255,255,255,1)",i.lineWidth=2.2;let r=(a,o)=>{i.beginPath();for(let c=0;c<=6;c++){let l=Math.PI/3*c,h=a+Math.cos(l)*(32-1.5),d=o+Math.sin(l)*(e/2-1.5);c===0?i.moveTo(h,d):i.lineTo(h,d)}i.stroke()};for(let a=-1;a<6;a++)for(let o=-1;o<4;o++)r(a*1.5*32,o*e+(a%2?e/2:0));return Wi(n,!0)}function Sp(){let[s,t]=oi(128,128);t.clearRect(0,0,128,128),t.strokeStyle="rgba(255,255,255,0.9)",t.lineWidth=3;for(let e=0;e<=128;e+=32)t.beginPath(),t.moveTo(e,0),t.lineTo(e,128),t.stroke(),t.beginPath(),t.moveTo(0,e),t.lineTo(128,e),t.stroke();return Wi(s,!0)}function bp(){let[s,t]=oi(256,128);t.fillStyle="#9aa3b5",t.fillRect(0,0,256,128),t.strokeStyle="rgba(40,45,60,0.8)",t.lineWidth=3,t.strokeRect(2,2,252,124),t.fillStyle="rgba(255,255,255,0.08)";for(let e=0;e<6;e++)t.fillRect(12+e*40,20,24,88);return Wi(s,!0)}function Tp(){let[e,n]=oi(1024,512),[i,r]=oi(1024,512),a=(1+Math.sqrt(5))/2,o=[],c=u=>{let f=Math.hypot(...u);return u.map(p=>p/f)},l=[];for(let u of[-1,1])for(let f of[-1,1])l.push([0,u,f*a],[u,f*a,0],[f*a,0,u]);for(let u of l)o.push({d:c(u),pent:!0});for(let u of[-1,1])for(let f of[-1,1])for(let p of[-1,1])o.push({d:c([u,f,p]),pent:!1});for(let u of[-1,1])for(let f of[-1,1])o.push({d:c([0,u/a,f*a]),pent:!1}),o.push({d:c([u/a,f*a,0]),pent:!1}),o.push({d:c([f*a,0,u/a]),pent:!1});let h=n.createImageData(1024,512),d=r.createImageData(1024,512);for(let u=0;u<512;u++){let f=(u+.5)/512*Math.PI,p=Math.sin(f),_=Math.cos(f);for(let m=0;m<1024;m++){let g=(m+.5)/1024*Math.PI*2,M=-Math.cos(g)*p,w=_,y=Math.sin(g)*p,T=-2,b=-2,P=null;for(let F of o){let k=M*F.d[0]+w*F.d[1]+y*F.d[2];k>T?(b=T,T=k,P=F):k>b&&(b=k)}let v=T-b,A=(u*1024+m)*4,I,N,O;P.pent?(I=58,N=62,O=72):(I=214,N=219,O=226);let L=Math.min(1,v*18);I*=.55+.45*L,N*=.55+.45*L,O*=.55+.45*L,h.data[A]=I,h.data[A+1]=N,h.data[A+2]=O,h.data[A+3]=255;let C=v<.012?1:0;d.data[A]=C*90,d.data[A+1]=C*200,d.data[A+2]=C*255,d.data[A+3]=255}}return n.putImageData(h,0,0),r.putImageData(d,0,0),{map:Wi(e),emissiveMap:Wi(i)}}function wp(){let[s,t]=oi(512,256);t.fillStyle="#15161c",t.fillRect(0,0,512,256);let e=["#2f7bff","#ff8a1f","#e8e8e8","#444a57","#8fb4ff","#ffc27a","#b03030","#2f2f36"];for(let n=4;n<256;n+=9)for(let i=n/9%2?3:7;i<512;i+=8)Math.random()<.15||(t.fillStyle=e[Math.random()*e.length|0],t.fillRect(i,n,5,6),t.fillStyle="rgba(230,200,170,0.8)",t.fillRect(i+1,n-3,3,3));return Wi(s,!0)}function Ep(){let[s,t]=oi(64,64),e=t.createRadialGradient(32,32,0,32,32,32);return e.addColorStop(0,"rgba(0,0,0,0.75)"),e.addColorStop(.6,"rgba(0,0,0,0.45)"),e.addColorStop(1,"rgba(0,0,0,0)"),t.fillStyle=e,t.fillRect(0,0,64,64),new ji(s)}function Ap(s,t){let[e,n]=oi(256,64);n.font="bold 34px Segoe UI, Arial, sans-serif",n.textAlign="center",n.textBaseline="middle",n.lineWidth=6,n.strokeStyle="rgba(0,0,0,0.7)",n.strokeText(s,128,32),n.fillStyle=t,n.fillText(s,128,32);let i=new ji(e);i.colorSpace=We;let r=new Ws({map:i,depthTest:!1,transparent:!0,sizeAttenuation:!1}),a=new Kr(r);return a.scale.set(.16,.04,1),a.renderOrder=10,a}function Rp(s){let[t,e]=oi(512,256),n=s===0?["#0b2d7a","#2f7bff"]:["#7a2c05","#ff8a1f"],i=e.createLinearGradient(0,0,512,256);return i.addColorStop(0,n[0]),i.addColorStop(1,n[1]),e.fillStyle=i,e.fillRect(0,0,512,256),e.font="italic 900 70px Arial Black, Arial, sans-serif",e.textAlign="center",e.textBaseline="middle",e.fillStyle="rgba(255,255,255,0.92)",e.fillText(s===0?"BLEU":"ORANGE",256,128),Wi(t)}var{W:Ln,L:Se,H:Cp,RC:Pp,RV:He,GW:Qe,GH:hn,GD:un}=jt,Ip=new ht(3111935),Lp=new ht(16747039),Dp=new ht(16777215),Du=class{constructor(){this.pos=[],this.nor=[],this.uv=[],this.col=[],this.idx=[],this.groups=[],this.cur=null}vertex(t,e,n,i,r=Dp){return this.pos.push(t.x,t.y,t.z),this.nor.push(e.x,e.y,e.z),this.uv.push(n,i),this.col.push(r.r,r.g,r.b),this.pos.length/3-1}group(t){this.cur&&this.cur.mat===t||(this.cur={start:this.idx.length,count:0,mat:t},this.groups.push(this.cur))}tri(t,e,n){let i=this.pos,r=i[t*3],a=i[t*3+1],o=i[t*3+2],c=i[e*3]-r,l=i[e*3+1]-a,h=i[e*3+2]-o,d=i[n*3]-r,u=i[n*3+1]-a,f=i[n*3+2]-o,p=l*f-h*u,_=h*d-c*f,m=c*u-l*d,g=this.nor;p*(g[t*3]+g[e*3]+g[n*3])+_*(g[t*3+1]+g[e*3+1]+g[n*3+1])+m*(g[t*3+2]+g[e*3+2]+g[n*3+2])>=0?this.idx.push(t,e,n):this.idx.push(t,n,e),this.cur.count+=3}quad(t,e,n,i){this.tri(t,e,n),this.tri(t,n,i)}build(){let t=new _e;return t.setAttribute("position",new Jt(this.pos,3)),t.setAttribute("normal",new Jt(this.nor,3)),t.setAttribute("uv",new Jt(this.uv,2)),t.setAttribute("color",new Jt(this.col,3)),t.setIndex(this.idx),t}};function ja(s,t=1){let e=ln.smoothstep(s,-12,12),n=Ip.clone().lerp(Lp,e);return Dp.clone().lerp(n,t)}function Wy(){let s=Ln-He,t=Se-He,e=Pp-He,n=[],i=(c,l,h,d,u)=>n.push({x:c,z:l,nx:h,nz:d,back:u}),r=(c,l,h,d,u,f,p,_=[])=>{let m=Math.hypot(h-c,d-l),g=Math.ceil(m/2.5),M=new Set;for(let w=0;w<g;w++)M.add(w/g);for(let w of _)M.add((w-c)/(h-c));[...M].sort((w,y)=>w-y).forEach(w=>i(c+(h-c)*w,l+(d-l)*w,u,f,p))},a=(c,l,h,d)=>{for(let f=0;f<12;f++){let p=h+(d-h)*f/12;i(c+Math.cos(p)*e,l+Math.sin(p)*e,Math.cos(p),Math.sin(p),0)}};r(s,-(t-e),s,t-e,1,0,0),a(s-e,t-e,0,Math.PI/2),r(s-e,t,-(s-e),t,0,1,1,[Qe,-Qe]),a(-(s-e),t-e,Math.PI/2,Math.PI),r(-s,t-e,-s,-(t-e),-1,0,0),a(-(s-e),-(t-e),Math.PI,Math.PI*1.5),r(-(s-e),-t,s-e,-t,0,-1,-1,[-Qe,Qe]),a(s-e,-(t-e),Math.PI*1.5,Math.PI*2),n.push({...n[0]});let o=0;for(let c=0;c<n.length;c++)c>0&&(o+=Math.hypot(n[c].x-n[c-1].x,n[c].z-n[c-1].z)),n[c].s=o;return n}function Xy(){let s=[];for(let i=0;i<=10;i++){let r=i/10*Math.PI/2;s.push({o:He*Math.sin(r),y:He*(1-Math.cos(r)),no:-Math.sin(r),ny:Math.cos(r)})}for(let i of[4.1,4.5,hn,9,12,15,Cp-He])s.push({o:He,y:i,no:-1,ny:0});let e=8;for(let i=1;i<=e;i++){let r=i/e*Math.PI/2;s.push({o:He*Math.cos(r),y:Cp-He+He*Math.sin(r),no:-Math.cos(r),ny:-Math.sin(r)})}let n=0;for(let i=0;i<s.length;i++)i>0&&(n+=Math.hypot(s[i].o-s[i-1].o,s[i].y-s[i-1].y)),s[i].v=n;return s}function qy(s,t,e){let n=new ii;return n.moveTo(-s+e,-t),n.lineTo(s-e,-t),n.absarc(s-e,-t+e,e,-Math.PI/2,0,!1),n.lineTo(s,t-e),n.absarc(s-e,t-e,e,0,Math.PI/2,!1),n.lineTo(-s+e,t),n.absarc(-s+e,t-e,e,Math.PI/2,Math.PI,!1),n.lineTo(-s,-t+e),n.absarc(-s+e,-t+e,e,Math.PI,Math.PI*1.5,!1),n}function Np(s,t){let e=new Le,n=Mp(),i={ramp:new ye({color:16777215,vertexColors:!0,roughness:.55,metalness:.35,map:bp()}),stripe:new we({vertexColors:!0,toneMapped:!1}),glass:new ye({color:9419007,vertexColors:!0,transparent:!0,opacity:s.glassOpacity,roughness:.1,metalness:.6,depthWrite:!1,side:ze})};i.ramp.map.repeat.set(1/4,1/4),i.ramp.map.wrapS=i.ramp.map.wrapT=Ri;let r=Wy(),a=Xy(),o=new Du,c=[],l=new E,h=new E;for(let L=0;L<r.length;L++){let C=r[L],F=[];for(let k=0;k<a.length;k++){let V=a[k];l.set(C.x+C.nx*V.o,V.y,C.z+C.nz*V.o),h.set(C.nx*V.no,V.ny,C.nz*V.no);let j;V.y>4.05&&V.y<4.55?j=ja(l.z,1).multiplyScalar(1.6):V.y<=4.1?j=ja(l.z,.35):j=ja(l.z,.8),F.push(o.vertex(l,h,C.s/4,V.v/4,j))}c.push(F)}let d=L=>r[L].back!==0&&Math.abs(r[L].x)<=Qe+1e-6,u=[{mat:0,test:(L,C)=>C.y<=4.1+1e-6},{mat:1,test:(L,C)=>L.y>=4.1-1e-6&&C.y<=4.5+1e-6},{mat:2,test:L=>L.y>=4.5-1e-6}];for(let L of u){o.group(L.mat);for(let C=0;C<r.length-1;C++){let F=d(C)&&d(C+1)&&r[C].back===r[C+1].back;for(let k=0;k<a.length-1;k++)L.test(a[k],a[k+1])&&(F&&a[k+1].y<=hn+1e-6||o.quad(c[C][k],c[C+1][k],c[C+1][k+1],c[C][k+1]))}}o.group(0);for(let L of[1,-1])for(let C of[1,-1]){h.set(-C,0,0);let F=o.vertex(l.set(C*Qe,0,L*Se),h,0,0,ja(L*Se,.35)),k=[];for(let V=0;V<=10;V++){let j=V/10*Math.PI/2;k.push(o.vertex(l.set(C*Qe,He*(1-Math.cos(j)),L*(Se-He+He*Math.sin(j))),h,0,0,ja(L*Se,.35)))}for(let V=0;V<10;V++)o.tri(F,k[V],k[V+1])}let f=o.build();for(let L of o.groups)f.addGroup(L.start,L.count,L.mat);let p=new Tt(f,[i.ramp,i.stripe,i.glass]);p.receiveShadow=t.shadows,e.add(p);let _=f.clone();_.clearGroups();let m=o.groups.filter(L=>L.mat===2);for(let L of m)_.addGroup(L.start,L.count,0);let g=_.getAttribute("uv");for(let L=0;L<g.count;L++)g.setXY(L,g.getX(L)*.5,g.getY(L)*.5);let M=new we({map:n,vertexColors:!0,transparent:!0,opacity:s.hexOpacity,blending:pn,depthWrite:!1,side:ze,toneMapped:!1});e.add(new Tt(_,[M]));let w=yp(s),y=qy(Ln-He,Se-He,Pp-He),T=new pa(y,24);T.rotateX(-Math.PI/2);let b=T.getAttribute("position"),P=T.getAttribute("uv");for(let L=0;L<b.count;L++)P.setXY(L,(b.getX(L)+Ln)/(2*Ln),(b.getZ(L)+Se)/(2*Se));T.computeVertexNormals();let v=new ye({map:w,roughness:.85,metalness:0}),A=new Tt(T,v);A.receiveShadow=t.shadows,e.add(A);let I=Sp();for(let L of[0,1]){let C=L===0?-1:1,F=L===0?Ip:Lp,k=new Le,V=new Tt(new fn(Qe*2,He+un),new ye({color:1711396,roughness:.9}));V.rotation.x=-Math.PI/2,V.position.set(0,.002,C*(Se-He+(He+un)/2)),V.receiveShadow=t.shadows,k.add(V);let j=new ye({color:F.clone().multiplyScalar(.12),roughness:.8,side:ze}),q=new we({map:I,color:F,transparent:!0,opacity:.8,blending:pn,depthWrite:!1,side:ze,toneMapped:!1}),Z=(tt,xt,Bt,wt,Vt,le,et)=>{let rt=new fn(tt,xt),at=new Tt(rt,j);at.position.copy(Bt),at.rotation.set(Vt,wt,0),k.add(at);let ot=I.clone();ot.repeat.set(le,et),ot.needsUpdate=!0;let ct=new Tt(rt,q.clone());ct.material.map=ot,ct.position.copy(Bt).multiplyScalar(1),ct.rotation.copy(at.rotation),ct.translateZ(.06),k.add(ct)};Z(Qe*2,hn,new E(0,hn/2,C*(Se+un)),C>0?Math.PI:0,0,Qe*2/1.6,hn/1.6),Z(un,hn,new E(Qe,hn/2,C*(Se+un/2)),-Math.PI/2,0,un/1.6,hn/1.6),Z(un,hn,new E(-Qe,hn/2,C*(Se+un/2)),Math.PI/2,0,un/1.6,hn/1.6);let K=new Tt(new fn(Qe*2,un),j);K.rotation.x=Math.PI/2,K.position.set(0,hn,C*(Se+un/2)),k.add(K);let At=new we({color:F.clone().multiplyScalar(2.2),toneMapped:!1}),yt=.22,se=new Tt(new ve(yt,hn+yt,yt),At);se.position.set(Qe+yt/2,hn/2,C*(Se-.05));let Yt=se.clone();Yt.position.x=-Qe-yt/2;let ne=new Tt(new ve(Qe*2+yt*2,yt,yt),At);ne.position.set(0,hn+yt/2,C*(Se-.05)),k.add(se,Yt,ne);let Y=new Tt(new fn(Qe*2,.35),At);Y.rotation.x=-Math.PI/2,Y.position.set(0,.01,C*(Se+.9)),k.add(Y),e.add(k)}let N=$y(s);e.add(N);let O=Yy();return e.add(O.group),{group:e,updatePads:O.update}}function Yy(){let s=new Le,t=fr(),e=[],n=new Hn(.62,.72,.08,24),i=new Hn(1.25,1.45,.12,32),r=new da(.5,2),a=new is(1.1,.06,8,40);for(let h of t){let d=new we({color:new ht(16758062).multiplyScalar(h.big?2.2:1.6),toneMapped:!1}),u=new ye({color:3354666,roughness:.5,metalness:.6,emissive:16752922,emissiveIntensity:.5}),f={pad:null,base:null,orb:null,ring:null,on:d,baseMat:u,phase:Math.random()*6};h.big?(f.base=new Tt(i,u),f.base.position.set(h.pos.x,.06,h.pos.z),f.orb=new Tt(r,d),f.orb.position.set(h.pos.x,1,h.pos.z),f.ring=new Tt(a,d),f.ring.rotation.x=Math.PI/2,f.ring.position.set(h.pos.x,.18,h.pos.z),s.add(f.base,f.orb,f.ring)):(f.base=new Tt(n,d),f.base.position.set(h.pos.x,.04,h.pos.z),s.add(f.base)),e.push(f)}let o=new ye({color:2763306,roughness:.7}),c=0;function l(h,d){c+=h,d.forEach((u,f)=>{let p=e[f];u.big?(p.orb.visible=u.active,p.ring.visible=u.active,p.orb.position.y=1+Math.sin(c*2+p.phase)*.15,p.orb.rotation.y+=h*1.5,p.baseMat.emissiveIntensity=u.active?.6:.05):p.base.material=u.active?p.on:o})}return{group:s,update:l}}function $y(s){let t=new Le,e=new Tt(new fn(900,900),new ye({color:s.outside,roughness:1}));e.rotation.x=-Math.PI/2,e.position.y=-.05,t.add(e);let n=wp(),i=new ye({map:n,roughness:.9,color:s.crowdTint}),r=new ye({color:s.structure,roughness:.8,metalness:.2}),a=(h,d,u)=>{let f=new ii;f.moveTo(0,0),f.lineTo(d,u),f.lineTo(d+3,u),f.lineTo(d+3,0),f.closePath();let p=new es(f,{depth:h,bevelEnabled:!1});p.translate(0,0,-h/2);let _=p.getAttribute("uv"),m=p.getAttribute("position");for(let M=0;M<_.count;M++)_.setXY(M,m.getZ(M)/20,(m.getX(M)+m.getY(M))/14);return new Tt(p,[r,i])},o=Se*2+10;for(let h of[1,-1]){let d=a(o,26,24);d.rotation.y=h>0?0:Math.PI,d.position.set(h*(Ln+6),2,0),t.add(d);let u=a(Ln*2+6,22,20);u.rotation.y=h>0?-Math.PI/2:Math.PI/2,u.position.set(0,2,h*(Se+un+8)),t.add(u)}for(let h of[1,-1]){let d=new Tt(new ve(8,2.2,Se*2+un*2+20),r);d.position.set(h*(Ln+3.5),1.1,0);let u=new Tt(new ve(Ln*2+15,2.2,10),r);u.position.set(0,1.1,h*(Se+un+4.5)),t.add(d,u)}let c=new we({color:new ht(s.lamp).multiplyScalar(2.5),toneMapped:!1});for(let h of[-1,1])for(let d of[-1,1]){let u=new Tt(new Hn(.8,1.2,46,8),r);u.position.set(h*(Ln+38),23,d*(Se+30));let f=new Tt(new ve(10,5,1.5),c);f.position.set(h*(Ln+36),47,d*(Se+28)),f.lookAt(0,0,0),t.add(u,f)}for(let h of[0,1]){let d=h===0?-1:1,u=new Tt(new fn(30,14),new we({map:Rp(h),toneMapped:!1}));u.position.set(0,34,d*(Se+36)),u.rotation.y=d>0?Math.PI:0,t.add(u);let f=new Tt(new ve(31,15,1),r);f.position.set(0,34,d*(Se+36.6)),t.add(f)}let l=new we({color:new ht(s.rim).multiplyScalar(1.5),toneMapped:!1});for(let h of[1,-1]){let d=new Tt(new ve(.6,.6,Se*2+20),l);d.position.set(h*(Ln+33),28,0),t.add(d);let u=new Tt(new ve(Ln*2+20,.6,.6),l);u.position.set(0,24,h*(Se+un+32)),t.add(u)}return t}function Up(s){let t=new ns(1200,32,16),e=new Ee({side:Oe,depthWrite:!1,uniforms:{top:{value:new ht(s.skyTop)},horizon:{value:new ht(s.skyHorizon)},bottom:{value:new ht(s.skyBottom)},sunDir:{value:new E(...s.sunDir).normalize()},sunColor:{value:new ht(s.sunGlow)}},vertexShader:"varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",fragmentShader:`uniform vec3 top; uniform vec3 horizon; uniform vec3 bottom; uniform vec3 sunDir; uniform vec3 sunColor; varying vec3 vDir;
      void main(){ float h = vDir.y; vec3 c = h > 0.0 ? mix(horizon, top, pow(h, 0.55)) : mix(horizon, bottom, pow(-h, 0.4));
      float s = max(dot(normalize(vDir), sunDir), 0.0); c += sunColor * (pow(s, 600.0) * 4.0 + pow(s, 12.0) * 0.35);
      gl_FragColor = vec4(c, 1.0); }`}),n=new Tt(t,e);n.renderOrder=-10;let i=new Le;if(i.add(n),s.stars){let a=new Float32Array(4500);for(let c=0;c<1500;c++){let l=Math.random()*Math.PI*2,h=Math.random()*.9+.08,d=1100;a[c*3]=Math.cos(l)*Math.sqrt(1-h*h)*d,a[c*3+1]=h*d,a[c*3+2]=Math.sin(l)*Math.sqrt(1-h*h)*d}let o=new _e;o.setAttribute("position",new De(a,3)),i.add(new Qi(o,new qs({color:16777215,size:2.2,sizeAttenuation:!1})))}return i}var ps={day:{label:"Stade (jour)",skyTop:3108816,skyHorizon:12574975,skyBottom:4872810,sunDir:[.35,.8,.25],sunGlow:16774096,sun:16774368,sunIntensity:1.9,hemiSky:13625087,hemiGround:3820080,hemiIntensity:.6,grassA:"#2f7d32",grassB:"#3a8f3c",outside:3885622,crowdTint:16777215,structure:10133674,lamp:16777215,rim:10406911,glassOpacity:.07,hexOpacity:.35,fog:12572912,exposure:1},sunset:{label:"Coucher de soleil",skyTop:2366034,skyHorizon:16747594,skyBottom:2759210,sunDir:[-.6,.18,.5],sunGlow:16756848,sun:16761232,sunIntensity:1.7,hemiSky:16763296,hemiGround:2761792,hemiIntensity:.8,grassA:"#2c6e36",grassB:"#357d3d",outside:2762288,crowdTint:16767168,structure:5918816,lamp:16769200,rim:16751964,glassOpacity:.08,hexOpacity:.45,fog:8014416,exposure:1},night:{label:"Nocturne",skyTop:132108,skyHorizon:1319498,skyBottom:329226,sunDir:[.2,.9,-.3],sunGlow:0,sun:14543103,sunIntensity:1.6,hemiSky:6981312,hemiGround:1054752,hemiIntensity:.45,grassA:"#1f5e2a",grassB:"#276b31",outside:856086,crowdTint:11581648,structure:3159103,lamp:15266047,rim:6987007,glassOpacity:.1,hexOpacity:.6,fog:659488,exposure:1.05,stars:!0}};var Fp={octane:{body:[[-.62,-.12],[.55,-.12],[.64,-.06],[.66,.04],[.62,.1],[.28,.16],[-.5,.18],[-.64,.14],[-.66,0]],cabin:[[.3,.12],[.3,.14],[.06,.33],[-.28,.34],[-.52,.17],[-.52,.12]],width:.72,cabinWidth:.54,wheelR:[.17,.19],wheelX:[.37,-.36],wheelZ:.4,spoiler:[-.6,.27]},dominus:{body:[[-.68,-.1],[.62,-.1],[.7,-.04],[.71,.04],[.6,.09],[.15,.13],[-.55,.15],[-.7,.13],[-.72,0]],cabin:[[.18,.1],[.18,.12],[-.02,.26],[-.34,.27],[-.6,.15],[-.6,.1]],width:.74,cabinWidth:.56,wheelR:[.16,.17],wheelX:[.42,-.43],wheelZ:.41,spoiler:[-.66,.21]},breakout:{body:[[-.7,-.1],[.66,-.1],[.74,-.06],[.72,0],[.3,.1],[-.55,.16],[-.72,.14],[-.73,0]],cabin:[[.25,.08],[.25,.09],[-.05,.25],[-.3,.26],[-.55,.15],[-.55,.1]],width:.7,cabinWidth:.5,wheelR:[.15,.18],wheelX:[.45,-.44],wheelZ:.39,spoiler:[-.68,.24]},merc:{body:[[-.62,-.15],[.58,-.15],[.64,-.08],[.65,.12],[.45,.18],[-.58,.2],[-.64,.16],[-.65,-.02]],cabin:[[.4,.15],[.4,.16],[.25,.42],[-.45,.43],[-.58,.2],[-.58,.15]],width:.76,cabinWidth:.62,wheelR:[.19,.19],wheelX:[.38,-.38],wheelZ:.41,spoiler:null}};function Bp(s,t,e){let n=new ii;s.forEach(([r,a],o)=>o?n.lineTo(r,a):n.moveTo(r,a)),n.closePath();let i=new es(n,{depth:t,bevelEnabled:!0,bevelThickness:e,bevelSize:e,bevelSegments:3,curveSegments:4});return i.translate(0,0,-t/2),i.computeVertexNormals(),i}var Nu=new Hn(1,1,.13,22);Nu.rotateX(Math.PI/2);var Uu=new Hn(.62,.62,.14,16);Uu.rotateX(Math.PI/2);var Op=new ve(.14,1.1,.145),Uc=new Ys(.1,.7,12,1,!0);Uc.rotateZ(Math.PI/2);Uc.translate(-.35,0,0);var Fc=new Ys(.05,.35,10,1,!0);Fc.rotateZ(Math.PI/2);Fc.translate(-.175,0,0);var to=class{constructor(t,{teamColor:e,accent:n=2236962,boostColor:i=null,showName:r=!0}){this.car=t;let a=Fp[t.bodyKey]?t.bodyKey:"octane",o=Fp[a],c=Sn[a];this.group=new Le,this.root=new Le,this.group.add(this.root);let l=new ma({color:e,metalness:.3,roughness:.45,clearcoat:.35,clearcoatRoughness:.35}),h=new ye({color:n,metalness:.5,roughness:.5}),d=new ye({color:658968,metalness:.5,roughness:.22}),u=new ye({color:1315860,roughness:.92}),f=new ye({color:13159636,metalness:.9,roughness:.25}),p=new we({color:new ht(15398143).multiplyScalar(1.6),toneMapped:!1}),_=new we({color:new ht(16719904).multiplyScalar(1.5),toneMapped:!1}),m=new ye({color:1382172,roughness:.7,metalness:.2}),g=new Tt(Bp(o.body,o.width,.04),l),M=new Tt(Bp(o.cabin,o.cabinWidth,.035),d);g.castShadow=!0,M.castShadow=!0,this.root.add(g,M);let w=o.cabin.slice(2,4),y=Math.abs(w[0][0]-w[1][0])*.8,T=new Tt(new ve(y,.025,o.cabinWidth*.9),h);T.position.set((w[0][0]+w[1][0])/2,Math.max(w[0][1],w[1][1])+.03,0);let b=new Tt(new ve(.5,.02,.12),h),P=o.body[5];b.position.set(P[0]+.12,P[1]+.035,0),b.rotation.z=-.12,this.root.add(T,b);let v=Math.max(...o.body.map(L=>L[0])),A=Math.min(...o.body.map(L=>L[0]));for(let L of[1,-1]){let C=new Tt(new ve(.04,.05,.14),p);C.position.set(v+.02,.04,L*o.width*.36);let F=new Tt(new ve(.04,.04,.16),_);F.position.set(A-.02,.08,L*o.width*.36),this.root.add(C,F)}if(o.spoiler){let[L,C]=o.spoiler,F=new Tt(new ve(.16,.03,o.width+.06),h);F.position.set(L,C,0),F.rotation.z=.12,F.castShadow=!0,this.root.add(F);for(let k of[1,-1]){let V=new Tt(new ve(.05,C-.12,.03),h);V.position.set(L+.02,(C+.12)/2,k*o.width*.3),this.root.add(V)}}let I=-(c.hy+ut.rideHeight);this.wheels=[];for(let L=0;L<4;L++){let C=L<2,F=o.wheelR[C?0:1],k=new Le;k.position.set(o.wheelX[C?0:1],I+F,(L%2?-1:1)*o.wheelZ);let V=new Le,j=new Tt(Nu,u);j.scale.set(F,F,1),j.castShadow=!0;let q=new Tt(Uu,f);q.scale.set(F,F,1),V.add(j,q);for(let K=0;K<3;K++){let At=new Tt(Op,h);At.scale.set(F,F,1),At.rotation.z=K*Math.PI/3,V.add(At)}k.add(V),this.root.add(k),this.wheels.push({pivot:k,spinner:V,front:C});let Z=new Tt(new is(F+.035,.03,6,14,Math.PI),m);Z.position.set(k.position.x,k.position.y,(L%2?-1:1)*(o.width/2+.045)),this.root.add(Z)}let N=o.wheelX[0]-o.wheelX[1]-o.wheelR[0]-o.wheelR[1]-.06;for(let L of[1,-1]){let C=new Tt(new ve(N,.05,.03),m);C.position.set((o.wheelX[0]+o.wheelX[1])/2+(o.wheelR[1]-o.wheelR[0])/2,I+.13,L*(o.width/2+.04)),this.root.add(C)}let O=new ht(i??e);this.flameMat=new we({color:O.clone().multiplyScalar(2.5),transparent:!0,opacity:.85,blending:pn,depthWrite:!1,toneMapped:!1,side:ze}),this.coreMat=new we({color:new ht(16773824).multiplyScalar(3),transparent:!0,opacity:.9,blending:pn,depthWrite:!1,toneMapped:!1}),this.flames=[],this.exhausts=[];for(let L of[1,-1]){let C=new Le;C.position.set(A-.01,0,L*o.width*.2),C.add(new Tt(Uc,this.flameMat),new Tt(Fc,this.coreMat)),C.visible=!1,this.root.add(C),this.flames.push(C),this.exhausts.push(new E(A-.05,0,L*o.width*.2))}this.boostColor=O,this.backX=A,this.halfWidth=o.width/2,this.wheelBaseY=I,r&&(this.nameTag=Ap(t.name,e===void 0?"#fff":`#${new ht(e).getHexString()}`),this.nameTag.position.set(0,1,0),this.group.add(this.nameTag))}update(t,e){if(this.group.visible=!t.demolished,!t.demolished){this.group.position.copy(t.pos),this.root.quaternion.copy(t.quat);for(let n of this.wheels)n.front&&(n.pivot.rotation.y=-t.steer*.45),n.spinner.rotation.z=-t.spin;for(let n of this.flames)if(n.visible=t.boosting,t.boosting){let i=.85+Math.sin(e*60+n.position.z*10)*.12+Math.random()*.15;n.scale.set(i*(t.supersonic?1.4:1),1,1)}}}exhaustWorld(t,e){return e.copy(this.exhausts[t]).applyQuaternion(this.root.quaternion).add(this.group.position)}dispose(){this.group.traverse(t=>{t.isMesh&&t.geometry&&![Nu,Uu,Op,Uc,Fc].includes(t.geometry)&&t.geometry.dispose(),t.material&&t.material.map&&t.isSprite&&t.material.map.dispose()})}};var Jy=`
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
}`,zp=`
varying float vAlpha;
varying vec3 vColor;
void main() {
  vec2 d = gl_PointCoord - 0.5;
  float r = length(d) * 2.0;
  float a = smoothstep(1.0, 0.0, r);
  a *= a;
  gl_FragColor = vec4(vColor * a * vAlpha, a * vAlpha);
}`,Bc=class{constructor(t,e=!0){this.cap=t,this.n=0,this.pos=new Float32Array(t*3),this.col=new Float32Array(t*3),this.size=new Float32Array(t),this.alpha=new Float32Array(t),this.vel=new Float32Array(t*3),this.life=new Float32Array(t),this.maxLife=new Float32Array(t),this.s0=new Float32Array(t),this.s1=new Float32Array(t),this.a0=new Float32Array(t),this.drag=new Float32Array(t),this.grav=new Float32Array(t),this.c0=new Float32Array(t*3),this.c1=new Float32Array(t*3);let n=new _e;this.aPos=new De(this.pos,3).setUsage(er),this.aCol=new De(this.col,3).setUsage(er),this.aSize=new De(this.size,1).setUsage(er),this.aAlpha=new De(this.alpha,1).setUsage(er),n.setAttribute("position",this.aPos),n.setAttribute("pcolor",this.aCol),n.setAttribute("size",this.aSize),n.setAttribute("alpha",this.aAlpha),n.boundingSphere=new kn(new E,1e5),this.material=new Ee({vertexShader:Jy,fragmentShader:zp,uniforms:{scale:{value:600}},transparent:!0,depthWrite:!1,blending:e?pn:Ui}),e||(this.material.fragmentShader=zp.replace("gl_FragColor = vec4(vColor * a * vAlpha, a * vAlpha);","gl_FragColor = vec4(vColor, a * vAlpha);")),this.points=new Qi(n,this.material),this.points.frustumCulled=!1,this.points.renderOrder=5,this.geometry=n}setViewportHeight(t){this.material.uniforms.scale.value=t*.9}emit(t){if(this.n>=this.cap)return;let e=this.n++,n=e*3;this.pos[n]=t.x,this.pos[n+1]=t.y,this.pos[n+2]=t.z,this.vel[n]=t.vx||0,this.vel[n+1]=t.vy||0,this.vel[n+2]=t.vz||0,this.life[e]=0,this.maxLife[e]=t.life||.5,this.s0[e]=t.size||.5,this.s1[e]=t.size1??this.s0[e]*.2,this.a0[e]=t.alpha??1,this.drag[e]=t.drag||0,this.grav[e]=t.gravity||0;let i=t.color,r=t.color1||t.color;this.c0[n]=i.r,this.c0[n+1]=i.g,this.c0[n+2]=i.b,this.c1[n]=r.r,this.c1[n+1]=r.g,this.c1[n+2]=r.b}update(t){let e=0;for(;e<this.n;){if(this.life[e]+=t,this.life[e]>=this.maxLife[e]){this.copy(this.n-1,e),this.n--;continue}let n=this.life[e]/this.maxLife[e],i=e*3,r=Math.exp(-this.drag[e]*t);this.vel[i]*=r,this.vel[i+1]=this.vel[i+1]*r+this.grav[e]*t,this.vel[i+2]*=r,this.pos[i]+=this.vel[i]*t,this.pos[i+1]+=this.vel[i+1]*t,this.pos[i+2]+=this.vel[i+2]*t,this.size[e]=this.s0[e]+(this.s1[e]-this.s0[e])*n,this.alpha[e]=this.a0[e]*(1-n)*Math.min(1,n*12+.2),this.col[i]=this.c0[i]+(this.c1[i]-this.c0[i])*n,this.col[i+1]=this.c0[i+1]+(this.c1[i+1]-this.c0[i+1])*n,this.col[i+2]=this.c0[i+2]+(this.c1[i+2]-this.c0[i+2])*n,e++}this.geometry.setDrawRange(0,this.n),this.aPos.needsUpdate=!0,this.aCol.needsUpdate=!0,this.aSize.needsUpdate=!0,this.aAlpha.needsUpdate=!0}copy(t,e){if(t===e)return;let n=t*3,i=e*3;for(let r=0;r<3;r++)this.pos[i+r]=this.pos[n+r],this.vel[i+r]=this.vel[n+r],this.col[i+r]=this.col[n+r],this.c0[i+r]=this.c0[n+r],this.c1[i+r]=this.c1[n+r];this.life[e]=this.life[t],this.maxLife[e]=this.maxLife[t],this.s0[e]=this.s0[t],this.s1[e]=this.s1[t],this.a0[e]=this.a0[t],this.drag[e]=this.drag[t],this.grav[e]=this.grav[t],this.size[e]=this.size[t],this.alpha[e]=this.alpha[t]}clear(){this.n=0}},Re=s=>(Math.random()*2-1)*s,kp=new ht(1,1,1),Vp=new ht(.18,.18,.2),Zy=new ht(1.6,.7,.2),Oc=class{constructor(t){this.add=new Bc(6e3,!0),this.smoke=new Bc(1500,!1),t.add(this.add.points,this.smoke.points),this.rings=[],this.scene=t,this.ringGeo=new fa(.8,1,48)}setViewportHeight(t){this.add.setViewportHeight(t),this.smoke.setViewportHeight(t)}boost(t,e,n,i,r){let a=this.tmpHot||(this.tmpHot=new ht),o=this.tmpCool||(this.tmpCool=new ht);a.copy(i).multiplyScalar(1.6).lerp(kp,.25),o.copy(i).multiplyScalar(.45);for(let c=0;c<3;c++){let l=9+Math.random()*6,h=Math.random()*.15;this.add.emit({x:t.x-e.x*h+Re(.04),y:t.y-e.y*h+Re(.04),z:t.z-e.z*h+Re(.04),vx:-e.x*l+n.x*.7+Re(.8),vy:-e.y*l+n.y*.7+Re(.8),vz:-e.z*l+n.z*.7+Re(.8),life:.16+Math.random()*.16,size:r?.42:.34,size1:.04,color:a,color1:o,drag:4,alpha:.8})}}trail(t,e){this.add.emit({x:t.x,y:t.y,z:t.z,life:.45,size:.28,size1:.05,color:e,color1:e,alpha:.7})}sparks(t,e,n=Zy){let i=Math.min(36,6+e*1.2);for(let r=0;r<i;r++){let a=3+Math.random()*e*.5;this.add.emit({x:t.x,y:t.y,z:t.z,vx:Re(a),vy:Re(a)+2,vz:Re(a),life:.25+Math.random()*.25,size:.2,size1:.03,color:kp,color1:n,drag:2,gravity:-10})}}padPickup(t,e){let n=new ht(1.8,1.2,.3);for(let i=0;i<(e?40:12);i++)this.add.emit({x:t.x+Re(1),y:.3,z:t.z+Re(1),vx:Re(1),vy:3+Math.random()*(e?6:3),vz:Re(1),life:.6,size:e?.7:.45,size1:.05,color:n,drag:1})}explosion(t,e,n=!0){let i=n?650:220,r=new ht(e),a=r.clone().multiplyScalar(3),o=r.clone().multiplyScalar(1.2),c=new ht(2.2,1.9,1.2);for(let h=0;h<i;h++){let d=Math.random()*Math.PI*2,u=Math.random()*2-1,f=Math.sqrt(1-u*u),p=Math.random(),_=(n?12:7)+Math.random()*(n?32:12)*(p<.25?1.3:1);this.add.emit({x:t.x,y:t.y,z:t.z,vx:Math.cos(d)*f*_,vy:u*_+3,vz:Math.sin(d)*f*_,life:.7+Math.random()*(n?1.4:.6),size:p<.25?.45:n?1.3:.9,size1:.08,color:p<.25?c:a,color1:o,drag:p<.25?.8:1.8,gravity:p<.25?-9:-3})}for(let h=0;h<(n?90:40);h++)this.smoke.emit({x:t.x+Re(1),y:t.y+Re(1),z:t.z+Re(1),vx:Re(6),vy:Re(4)+2,vz:Re(6),life:1.5+Math.random()*1.5,size:2.5,size1:6,color:Vp,alpha:.55,drag:1.5,gravity:.5});let l=new Tt(this.ringGeo,new we({color:a,transparent:!0,opacity:1,side:ze,blending:pn,depthWrite:!1,toneMapped:!1}));l.position.copy(t),l.lookAt(t.x,t.y+1,t.z),this.scene.add(l),this.rings.push({mesh:l,t:0,max:n?1.1:.6,size:n?30:10})}demolition(t,e){for(let n=0;n<160;n++){let i=4+Math.random()*12;this.add.emit({x:t.x,y:t.y,z:t.z,vx:Re(i),vy:Re(i)+4,vz:Re(i),life:.5+Math.random()*.8,size:1.1,size1:.1,color:new ht(2,1.4,.5),color1:new ht(e).multiplyScalar(1.5),drag:2,gravity:-6})}for(let n=0;n<50;n++)this.smoke.emit({x:t.x,y:t.y,z:t.z,vx:Re(3),vy:1+Math.random()*3,vz:Re(3),life:1.5+Math.random(),size:1.5,size1:4,color:Vp,alpha:.7,drag:1})}update(t){this.add.update(t),this.smoke.update(t);for(let e=this.rings.length-1;e>=0;e--){let n=this.rings[e];n.t+=t;let i=n.t/n.max;if(i>=1){this.scene.remove(n.mesh),n.mesh.material.dispose(),this.rings.splice(e,1);continue}let r=1+i*n.size;n.mesh.scale.set(r,r,r),n.mesh.material.opacity=1-i}}clear(){this.add.clear(),this.smoke.clear()}};var eo=new E(0,1,0),zc=new E,Sr=new E,ms=new E,Hp=new E,li=new E,br=new E;function Gp(s,t){let e=ln.degToRad(s);return ln.radToDeg(2*Math.atan(Math.tan(e/2)/t))}function Vc(s,t=.6){for(let e=0;e<3;e++){let n=cn(s.x,s.y,s.z);if(n<=-t)return s;_i(s.x,s.y,s.z,Hp),s.addScaledVector(Hp,n+t)}return s}var kc=class{constructor(t){this.camera=t,this.pos=new E,this.look=new E,this.fwd=new E(0,0,1),this.up=new E(0,1,0),this.ready=!1,this.ballCam=!0,this.shake=0,this.swivel=0}reset(){this.ready=!1}addShake(t){this.shake=Math.max(this.shake,t)}follow(t,e,n,i){let r=i.camDistance,a=i.camHeight;zc.set(1,0,0).applyQuaternion(e.quat);let o=e.onGround?e.groundNormal:eo;Sr.copy(zc).addScaledVector(o,-zc.dot(o)),Sr.lengthSq()<.09&&Sr.copy(this.fwd),Sr.normalize(),this.ready||(this.fwd.copy(Sr),this.up.copy(o));let c=1-Math.exp(-t*(e.onGround?9:5));this.fwd.lerp(Sr,c).normalize(),this.up.lerp(o,1-Math.exp(-t*5)).normalize();let l=this.up;if(this.ballCam&&n){ms.copy(e.pos).sub(n),ms.y=0,ms.lengthSq()<.25&&ms.copy(this.fwd).negate().setY(0),ms.normalize(),li.copy(e.pos).addScaledVector(ms,r),li.y+=a,l=eo;let h=ms.copy(n).sub(li).normalize(),d=br.copy(e.pos).sub(li).normalize(),u=Math.acos(ln.clamp(h.dot(d),-1,1)),f=ln.degToRad(this.camera.fov)*.36;if(u>f&&u>1e-4){let p=zc.crossVectors(d,h).normalize();h.copy(d).applyAxisAngle(p,f)}br.copy(li).addScaledVector(h,12)}else li.copy(e.pos).addScaledVector(this.fwd,-r).addScaledVector(this.up,a),br.copy(e.pos).addScaledVector(this.up,a*.7).addScaledVector(this.fwd,2.2);if(this.swivel&&(li.sub(e.pos).applyAxisAngle(eo,this.swivel).add(e.pos),br.sub(e.pos).applyAxisAngle(eo,this.swivel).add(e.pos)),Vc(li),!this.ready)this.pos.copy(li),this.look.copy(br),this.ready=!0;else{let h=1-Math.exp(-t*i.camStiffness);this.pos.lerp(li,h),this.look.lerp(br,1-Math.exp(-t*14))}this.apply(t,l)}setView(t,e,n,i=4){this.ready?(this.pos.lerp(e,1-Math.exp(-t*i)),this.look.lerp(n,1-Math.exp(-t*i*1.5))):(this.pos.copy(e),this.look.copy(n),this.ready=!0),this.apply(t,eo)}apply(t,e){let n=this.camera;if(n.position.copy(this.pos),this.shake>.001){let i=this.shake;n.position.x+=(Math.random()-.5)*i,n.position.y+=(Math.random()-.5)*i,n.position.z+=(Math.random()-.5)*i,this.shake*=Math.exp(-t*5)}n.up.copy(e),n.lookAt(this.look)}};var Xp=[["throttle","Acc\xE9l\xE9rer / piquer du nez"],["reverse","Freiner / reculer / cabrer"],["left","Tourner \xE0 gauche"],["right","Tourner \xE0 droite"],["jump","Sauter"],["boost","Boost"],["handbrake","D\xE9rapage / air roll libre"],["rollLeft","Air roll gauche"],["rollRight","Air roll droite"],["ballCam","Cam\xE9ra balle"],["scoreboard","Tableau des scores"],["pause","Pause"],["resetBall","Entra\xEEnement : replacer la balle"],["shootBall","Entra\xEEnement : balle vers moi"]],no={throttle:["KeyW","ArrowUp"],reverse:["KeyS","ArrowDown"],left:["KeyA","ArrowLeft"],right:["KeyD","ArrowRight"],jump:["Space","Mouse2"],boost:["ShiftLeft","Mouse0"],handbrake:["KeyC","ShiftRight"],rollLeft:["KeyQ"],rollRight:["KeyE"],ballCam:["KeyV","Mouse1"],scoreboard:["Tab"],pause:["Escape","KeyP"],resetBall:["KeyR"],shootBall:["KeyT"]},$e={A:0,B:1,X:2,Y:3,LB:4,RB:5,LT:6,RT:7,BACK:8,START:9,LS:10,UP:12,DOWN:13,LEFT:14,RIGHT:15};function Tr(s){if(!s)return"\u2014";let t={Mouse0:"Clic gauche",Mouse1:"Clic molette",Mouse2:"Clic droit",Space:"Espace",ShiftLeft:"Maj gauche",ShiftRight:"Maj droite",ControlLeft:"Ctrl gauche",ControlRight:"Ctrl droite",AltLeft:"Alt",Tab:"Tab",Escape:"\xC9chap",ArrowUp:"\u2191",ArrowDown:"\u2193",ArrowLeft:"\u2190",ArrowRight:"\u2192",Enter:"Entr\xE9e",Backspace:"Retour"};return t[s]?t[s]:s.startsWith("Key")?s.slice(3):s.startsWith("Digit")?s.slice(5):s}function Wp(s,t,e){let n=Math.hypot(s,t);if(n<e)return[0,0];let i=Math.min(1,(n-e)/(1-e))/n;return[s*i,t*i]}var Hc=class{constructor(t){this.settings=t,this.down=new Set,this.pressedQueue=new Set,this.capture=null,this.padPrev=new Map,this.padPressed=new Map,this.lastDevice="keyboard";let e=new Set(["Space","Tab","ArrowUp","ArrowDown","ArrowLeft","ArrowRight","ShiftLeft","AltLeft"]);window.addEventListener("keydown",n=>{if(this.capture){n.preventDefault();let i=this.capture;this.capture=null,i(n.code);return}n.target&&(n.target.tagName==="INPUT"||n.target.tagName==="SELECT")||(e.has(n.code)&&n.preventDefault(),this.down.has(n.code)||this.pressedQueue.add(n.code),this.down.add(n.code),this.lastDevice="keyboard")}),window.addEventListener("keyup",n=>this.down.delete(n.code)),window.addEventListener("blur",()=>this.down.clear()),window.addEventListener("mousedown",n=>{let i=`Mouse${n.button}`;if(this.capture){n.preventDefault();let r=this.capture;this.capture=null,r(i);return}n.target&&n.target.closest&&n.target.closest(".menu, .overlay-panel, button, input, select")||(this.down.has(i)||this.pressedQueue.add(i),this.down.add(i),this.lastDevice="keyboard")}),window.addEventListener("mouseup",n=>this.down.delete(`Mouse${n.button}`)),window.addEventListener("contextmenu",n=>n.preventDefault())}captureNext(t){this.capture=t}keys(t){return this.settings.keys&&this.settings.keys[t]||no[t]||[]}kb(t){return this.keys(t).some(e=>this.down.has(e))?1:0}poll(){this.frameKeys=this.pressedQueue,this.pressedQueue=new Set;let t=navigator.getGamepads?[...navigator.getGamepads()].filter(e=>e&&e.connected):[];this.pads=t,this.padPressed.clear();for(let e of t){let n=this.padPrev.get(e.index)||[],i=e.buttons.map(a=>a.pressed),r=i.map((a,o)=>a&&!n[o]);(r.some(a=>a)||Math.abs(e.axes[0]||0)>.5||Math.abs(e.axes[1]||0)>.5)&&(this.lastDevice="gamepad"),this.padPressed.set(e.index,r),this.padPrev.set(e.index,i)}}padFor(t,e){let n=this.pads||[];return e?t===1?n[0]?[n[0]]:[]:n[1]?[n[1]]:[]:t===0?n:[]}usesKeyboard(t){return t===0}pressed(t,e=0,n=!1){if(this.usesKeyboard(e)&&this.keys(t).some(r=>this.frameKeys&&this.frameKeys.has(r)))return!0;let i={jump:$e.A,ballCam:$e.Y,pause:$e.START,scoreboard:$e.BACK,resetBall:$e.UP,shootBall:$e.DOWN}[t];if(i===void 0)return!1;for(let r of this.padFor(e,n)){let a=this.padPressed.get(r.index);if(a&&a[i])return!0}return!1}quickChat(t,e){if(this.usesKeyboard(t)&&this.frameKeys){for(let n=1;n<=8;n++)if(this.frameKeys.has(`Digit${n}`)||this.frameKeys.has(`Numpad${n}`))return n-1}for(let n of this.padFor(t,e)){let i=this.padPressed.get(n.index);if(i){if(i[$e.LEFT])return 1;if(i[$e.RIGHT])return 2;if(i[$e.UP])return 0;if(i[$e.DOWN])return 3}}return-1}lookStick(t,e){for(let n of this.padFor(t,e)){let[i,r]=Wp(n.axes[2]||0,n.axes[3]||0,.25);if(i||r)return[i,r]}return[0,0]}held(t,e=0,n=!1){if(this.usesKeyboard(e)&&this.kb(t))return!0;let i={scoreboard:$e.BACK}[t];return i===void 0?!1:this.padFor(e,n).some(r=>r.buttons[i]&&r.buttons[i].pressed)}controls(t,e,n){let i=this.settings,r=0,a=0,o=0,c=0,l=!1,h=!1,d=!1;this.usesKeyboard(t)&&(r=this.kb("throttle")-this.kb("reverse"),a=this.kb("right")-this.kb("left"),o=r,c=this.kb("rollRight")-this.kb("rollLeft"),l=!!this.kb("jump")||this.keys("jump").some(u=>this.frameKeys&&this.frameKeys.has(u)),h=!!this.kb("boost"),d=!!this.kb("handbrake"));for(let u of this.padFor(t,e)){let f=M=>u.buttons[M]?u.buttons[M].value:0,[p,_]=Wp(u.axes[0]||0,u.axes[1]||0,i.deadzone),m=f($e.RT)-f($e.LT);Math.abs(m)>Math.abs(r)&&(r=m),Math.abs(p)>Math.abs(a)&&(a=p);let g=i.invertPitch?_:-_;Math.abs(g)>Math.abs(o)&&(o=g),f($e.LB)>.5&&(c=-1),l=l||f($e.A)>.5,h=h||f($e.B)>.5||f($e.RB)>.5,d=d||f($e.X)>.5}return n.throttle=Math.max(-1,Math.min(1,r)),n.steer=Math.max(-1,Math.min(1,a)),n.pitch=Math.max(-1,Math.min(1,o)),n.yaw=d?0:n.steer,n.roll=Math.max(-1,Math.min(1,c+(d?n.steer:0))),n.jump=l,n.boost=h,n.handbrake=d,n}};var Gc=class{constructor(t){this.settings=t,this.ctx=null,this.listener={x:0,y:0,z:0,rx:1,ry:0,rz:0},this.engines=[],this.musicTimer=null}init(){if(this.ctx){this.ctx.state==="suspended"&&this.ctx.resume();return}let t=window.AudioContext||window.webkitAudioContext;if(!t)return;let e=new t;this.ctx=e,this.comp=e.createDynamicsCompressor(),this.comp.threshold.value=-14,this.comp.ratio.value=4,this.master=e.createGain(),this.sfx=e.createGain(),this.music=e.createGain(),this.sfx.connect(this.master),this.music.connect(this.master),this.master.connect(this.comp),this.comp.connect(e.destination);let n=e.sampleRate*2;this.noise=e.createBuffer(1,n,e.sampleRate);let i=this.noise.getChannelData(0);for(let r=0;r<n;r++)i[r]=Math.random()*2-1;this.applyVolumes(),this.startCrowd()}applyVolumes(){if(!this.ctx)return;let t=this.settings;this.master.gain.value=t.volMaster,this.sfx.gain.value=t.volSfx,this.music.gain.value=t.volMusic*.5}setListener(t,e){let n=this.listener;n.x=t.x,n.y=t.y,n.z=t.z,n.rx=e.x,n.ry=e.y,n.rz=e.z}spatial(t,e=18){if(!t)return{gain:1,pan:0};let n=this.listener,i=t.x-n.x,r=t.y-n.y,a=t.z-n.z,o=Math.hypot(i,r,a),c=e/(e+Math.max(0,o-3)),l=o>.01?Math.max(-1,Math.min(1,(i*n.rx+r*n.ry+a*n.rz)/o))*.8:0;return{gain:c,pan:l}}out(t,e){let n=this.ctx,{gain:i,pan:r}=this.spatial(t),a=n.createGain();if(a.gain.value=e*i,n.createStereoPanner){let o=n.createStereoPanner();o.pan.value=r,a.connect(o),o.connect(this.sfx)}else a.connect(this.sfx);return a}noiseSrc(t){let e=this.ctx.createBufferSource();return e.buffer=this.noise,e.loop=t>1.9,e.start(this.ctx.currentTime,Math.random()*1.5),e.stop(this.ctx.currentTime+t),e}env(t,e,n,i=1){let r=this.ctx.currentTime;t.gain.cancelScheduledValues(r),t.gain.setValueAtTime(1e-4,r),t.gain.exponentialRampToValueAtTime(i,r+e),t.gain.exponentialRampToValueAtTime(1e-4,r+e+n)}tone(t,e,n,i,r,a){let o=this.ctx,c=o.createOscillator();c.type=t;let l=o.currentTime;c.frequency.setValueAtTime(e,l),c.frequency.exponentialRampToValueAtTime(Math.max(1,n),l+i);let h=o.createGain();c.connect(h),h.connect(a),this.env(h,.005,i,r),c.start(l),c.stop(l+i+.05)}hit(t,e){if(!this.ctx)return;let n=Math.min(1,.25+e/25),i=this.out(t,n);this.tone("sine",140+e*3,45,.25,.9,i);let r=this.noiseSrc(.2),a=this.ctx.createBiquadFilter();a.type="bandpass",a.frequency.value=900+e*40,a.Q.value=.8;let o=this.ctx.createGain();r.connect(a),a.connect(o),o.connect(i),this.env(o,.002,.16,.8)}bounce(t,e){if(!this.ctx)return;let n=this.out(t,Math.min(.6,e/30));this.tone("sine",90,40,.18,.8,n)}jump(t){if(!this.ctx)return;let e=this.out(t,.25),n=this.noiseSrc(.3),i=this.ctx.createBiquadFilter();i.type="bandpass",i.frequency.setValueAtTime(500,this.ctx.currentTime),i.frequency.exponentialRampToValueAtTime(2500,this.ctx.currentTime+.2);let r=this.ctx.createGain();n.connect(i),i.connect(r),r.connect(e),this.env(r,.01,.2,.8)}pad(t,e){if(!this.ctx)return;let n=this.out(t,e?.35:.2);this.tone("triangle",e?520:880,e?1560:1320,e?.35:.12,.7,n)}bump(t,e){if(!this.ctx)return;let n=this.out(t,Math.min(.8,e/15));this.tone("square",120,50,.15,.4,n),this.hit(t,e*.4)}explosion(t,e){if(!this.ctx)return;let n=this.ctx,i=this.out(t,e?1:.8),r=this.noiseSrc(e?2.5:1.4),a=n.createBiquadFilter();a.type="lowpass",a.frequency.setValueAtTime(e?3e3:2e3,n.currentTime),a.frequency.exponentialRampToValueAtTime(80,n.currentTime+(e?2.2:1.2));let o=n.createGain();r.connect(a),a.connect(o),o.connect(i),this.env(o,.005,e?2.2:1.2,1),this.tone("sine",110,28,e?1.4:.8,1,i)}horn(t){if(!this.ctx)return;let e=this.ctx,n=e.currentTime,i=e.createGain();i.connect(this.sfx),i.gain.setValueAtTime(1e-4,n),i.gain.exponentialRampToValueAtTime(.28,n+.05),i.gain.setValueAtTime(.28,n+1.6),i.gain.exponentialRampToValueAtTime(1e-4,n+2.4);let r=t?[220,277,330,440]:[196,233,294];for(let a of r){let o=e.createOscillator();o.type="sawtooth",o.frequency.value=a;let c=e.createOscillator();c.frequency.value=5;let l=e.createGain();l.gain.value=3,c.connect(l),l.connect(o.frequency);let h=e.createBiquadFilter();h.type="lowpass",h.frequency.value=1800,o.connect(h),h.connect(i),o.start(n),c.start(n),o.stop(n+2.5),c.stop(n+2.5)}this.cheer(3.5)}cheer(t=2.5){if(!this.ctx)return;let e=this.ctx,n=this.noiseSrc(t+.5),i=e.createBiquadFilter();i.type="bandpass",i.frequency.value=1200,i.Q.value=.5;let r=e.createGain(),a=e.currentTime;r.gain.setValueAtTime(1e-4,a),r.gain.exponentialRampToValueAtTime(.5,a+.3),r.gain.exponentialRampToValueAtTime(1e-4,a+t),n.connect(i),i.connect(r),r.connect(this.sfx)}beep(t){this.ctx&&this.tone("square",t?880:440,t?880:440,t?.5:.18,.18,this.sfx)}click(){this.ctx&&this.tone("triangle",1200,900,.05,.12,this.sfx)}startCrowd(){let t=this.ctx,e=t.createBufferSource();e.buffer=this.noise,e.loop=!0;let n=t.createBiquadFilter();n.type="bandpass",n.frequency.value=700,n.Q.value=.4,this.crowdGain=t.createGain(),this.crowdGain.gain.value=0,e.connect(n),n.connect(this.crowdGain),this.crowdGain.connect(this.sfx),e.start()}setCrowd(t){!this.ctx||!this.crowdGain||this.crowdGain.gain.setTargetAtTime(t*.12,this.ctx.currentTime,.4)}engine(t){if(!this.ctx)return null;if(this.engines[t])return this.engines[t];let e=this.ctx,n=e.createOscillator(),i=e.createOscillator();n.type="sawtooth",i.type="square";let r=e.createBiquadFilter();r.type="lowpass",r.frequency.value=600;let a=e.createGain();a.gain.value=0,n.connect(r),i.connect(r),r.connect(a),a.connect(this.sfx);let o=e.createBufferSource();o.buffer=this.noise,o.loop=!0;let c=e.createBiquadFilter();c.type="bandpass",c.frequency.value=600,c.Q.value=.7;let l=e.createGain();l.gain.value=0,o.connect(c),c.connect(l),l.connect(this.sfx),n.start(),i.start(),o.start();let h={o1:n,o2:i,f:r,g:a,bf:c,bg:l};return this.engines[t]=h,h}updateEngine(t,e,n,i,r,a,o){let c=this.engine(t);if(!c)return;let l=this.ctx.currentTime,h=Math.min(1,e/23),d=55+h*110+(r?0:20);c.o1.frequency.setTargetAtTime(d,l,.05),c.o2.frequency.setTargetAtTime(d*.5,l,.05),c.f.frequency.setTargetAtTime(400+h*1400+Math.abs(n)*300,l,.05);let u=a?(.05+Math.abs(n)*.05+h*.05)/Math.sqrt(o):0;c.g.gain.setTargetAtTime(u,l,.08),c.bg.gain.setTargetAtTime(a&&i?.35/Math.sqrt(o):0,l,.04),c.bf.frequency.setTargetAtTime(500+h*900,l,.1)}silenceEngines(){for(let t=0;t<this.engines.length;t++)this.engines[t]&&this.updateEngine(t,0,0,!1,!0,!1,1)}startMusic(){if(!this.ctx||this.musicTimer)return;let t=this.ctx,n=60/112/4,i=[[57,60,64],[53,57,60],[48,52,55],[55,59,62]],r=l=>440*Math.pow(2,(l-69)/12),a=t.currentTime+.1,o=0,c=()=>{for(;a<t.currentTime+.25;){let l=Math.floor(o/16)%4,h=i[l],d=o%16,u=a;if(d%4===0){let f=t.createOscillator(),p=t.createGain();f.frequency.setValueAtTime(120,u),f.frequency.exponentialRampToValueAtTime(40,u+.15),p.gain.setValueAtTime(.5,u),p.gain.exponentialRampToValueAtTime(.001,u+.2),f.connect(p),p.connect(this.music),f.start(u),f.stop(u+.25)}if(d%2===1){let f=t.createBufferSource();f.buffer=this.noise;let p=t.createBiquadFilter();p.type="highpass",p.frequency.value=7e3;let _=t.createGain();_.gain.setValueAtTime(.08,u),_.gain.exponentialRampToValueAtTime(.001,u+.05),f.connect(p),p.connect(_),_.connect(this.music),f.start(u,Math.random()),f.stop(u+.06)}if(d%2===0){let f=t.createOscillator();f.type="sawtooth",f.frequency.value=r(h[0]-24);let p=t.createBiquadFilter();p.type="lowpass",p.frequency.value=500;let _=t.createGain();_.gain.setValueAtTime(.12,u),_.gain.exponentialRampToValueAtTime(.001,u+n*1.8),f.connect(p),p.connect(_),_.connect(this.music),f.start(u),f.stop(u+n*2)}{let f=t.createOscillator();f.type="square",f.frequency.value=r(h[d%3]+(d%8<4?12:24));let p=t.createBiquadFilter();p.type="lowpass",p.frequency.value=2200;let _=t.createGain();_.gain.setValueAtTime(.035,u),_.gain.exponentialRampToValueAtTime(.001,u+n*.9),f.connect(p),p.connect(_),_.connect(this.music),f.start(u),f.stop(u+n)}a+=n,o++}};this.musicTimer=setInterval(c,60),c()}stopMusic(){this.musicTimer&&clearInterval(this.musicTimer),this.musicTimer=null}};var gs=s=>String(s).replace(/[&<>"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[t]),Ky=s=>s===0?"b":"o";function Qy(s){if(s.opts.freeplay)return"LIBRE";if(s.overtime){let e=Math.floor(s.overtimeElapsed);return`+${Math.floor(e/60)}:${String(e%60).padStart(2,"0")}`}if(s.opts.duration<=0)return"\u221E";let t=Math.ceil(s.timeLeft);return`${Math.floor(t/60)}:${String(t%60).padStart(2,"0")}`}var io=2*Math.PI*60,Wc=class{constructor(t){this.root=t,this.players=[],this.centerTimer=0,this.goalTimer=0}showHint(t,e=10){let n=document.createElement("div");n.className="hint-bar",n.innerHTML=t,this.root.appendChild(n),setTimeout(()=>n.classList.add("fade"),e*1e3),setTimeout(()=>n.remove(),e*1e3+1200)}setup(t,e,n){let i=this.root;if(i.innerHTML=`
      <div id="scorebar"><div class="team t0" id="s0">0</div><div id="clock">5:00</div><div class="team t1" id="s1">0</div></div>
      <div id="feed"></div>
      <div id="center-msg"></div>
      <div id="goal-banner"></div>
      <div id="replay-tag" class="hidden"><div class="r">REPLAY</div><div class="s">Appuyez sur SAUT pour passer</div></div>
      <div id="scoretable" class="hidden"></div>
      <div id="fps" class="hidden"></div>`,this.el={s0:i.querySelector("#s0"),s1:i.querySelector("#s1"),clock:i.querySelector("#clock"),feed:i.querySelector("#feed"),center:i.querySelector("#center-msg"),goal:i.querySelector("#goal-banner"),replay:i.querySelector("#replay-tag"),table:i.querySelector("#scoretable"),fps:i.querySelector("#fps")},this.players=e.map((r,a)=>{let o=document.createElement("div");o.className="phud";let c=n[a];return Object.assign(o.style,{left:`${c.x*100}%`,top:`${c.y*100}%`,width:`${c.w*100}%`,height:`${c.h*100}%`}),o.innerHTML=`
        <div class="boost">
          <svg viewBox="0 0 140 140"><circle cx="70" cy="70" r="60" fill="rgba(0,0,0,0.45)" stroke="rgba(255,255,255,0.12)" stroke-width="12" stroke-dasharray="${io*.75} ${io}"/>
          <circle class="arc" cx="70" cy="70" r="60" fill="none" stroke="url(#bg${a})" stroke-width="12" stroke-linecap="round" stroke-dasharray="0 ${io}"/>
          <defs><linearGradient id="bg${a}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffd24d"/><stop offset="1" stop-color="#ff6a00"/></linearGradient></defs></svg>
          <div class="num">33</div><div class="lbl">BOOST</div>
          <div class="speedo"><span class="sp">0</span> <small>km/h</small></div>
        </div>
        <div class="camtag"></div>
        <div class="popups"></div>
        <div class="demo-msg hidden">D\xC9TRUIT !</div>`,this.root.appendChild(o),o.dataset.split=c.h<.9?"1":"0",{el:o,car:r.car,arc:o.querySelector(".arc"),num:o.querySelector(".num"),sp:o.querySelector(".sp"),speedo:o.querySelector(".speedo"),cam:o.querySelector(".camtag"),popups:o.querySelector(".popups"),demo:o.querySelector(".demo-msg"),lastBoost:-1}}),n.length>1){let r=document.createElement("div");r.className="split-line",this.root.appendChild(r)}this.centerTimer=0,this.goalTimer=0,this.hudScale=0}showCenter(t,e=1,n="",i="#fff"){let r=this.el.center;r.textContent=t,r.style.color=i,r.className="",r.offsetWidth,r.className=`pop ${n}`,this.centerTimer=e}feed(t,e="#fff"){let n=document.createElement("div");for(n.className="feed-item",n.style.borderLeftColor=e,n.innerHTML=t,this.el.feed.prepend(n);this.el.feed.children.length>6;)this.el.feed.lastChild.remove();setTimeout(()=>n.remove(),6e3)}chat(t,e){this.feed(`${this.name(t)} : <span style="color:#fff">${gs(e)}</span>`,t.team===0?"#2f7bff":"#ff8a1f")}popup(t,e,n){let i=document.createElement("div");i.className="popup",i.innerHTML=`${gs(e)}${n?`<b>+${n}</b>`:""}`,t.popups.appendChild(i),setTimeout(()=>i.remove(),2300)}name(t){return`<span class="${Ky(t.team)}">${gs(t.name)}</span>`}onEvent(t,e){switch(t.type){case"countdown":this.showCenter(String(t.n),.95);break;case"go":this.showCenter("GO !",.8,"","#ffe066");break;case"overtime":this.showCenter("PROLONGATION",2.4,"","#ffd34d");break;case"goal":{let n=t.team===0?"var(--blue)":"var(--orange)",i="";t.scorer?i=`${gs(t.scorer.name)} a marqu\xE9 !`:t.ownGoal&&(i=`Contre son camp de ${gs(t.ownGoal.name)}`),t.assist&&(i+=` <span style="color:#cfe0ff;font-size:20px">(passe de ${gs(t.assist.name)})</span>`),this.el.goal.innerHTML=`<div class="big" style="color:${n}">BUT !</div><div class="sub">${i}</div><div class="speed">${t.speedKmh} km/h</div>`,this.goalTimer=3,t.scorer?this.feed(`\u26BD ${this.name(t.scorer)} a marqu\xE9`,t.team===0?"#2f7bff":"#ff8a1f"):this.feed(`\u26BD But pour l'\xE9quipe ${t.team===0?"BLEUE":"ORANGE"}`,t.team===0?"#2f7bff":"#ff8a1f");break}case"demo":this.feed(`${this.name(t.attacker)} \u{1F4A5} ${this.name(t.victim)}`,"#ff5050");for(let n of this.players)n.car===t.victim&&n.demo.classList.remove("hidden");break;case"respawn":for(let n of this.players)n.car===t.car&&n.demo.classList.add("hidden");break;case"stat":for(let n of this.players)n.car===t.car&&this.popup(n,t.label,t.points);(t.label==="ARR\xCAT"||t.label==="ARR\xCAT \xC9PIQUE")&&this.feed(`\u{1F9E4} ${this.name(t.car)} \u2014 ${t.label.toLowerCase()}`,"#9fe0ff");break;case"flipReset":for(let n of this.players)n.car===t.car&&this.popup(n,"RESET DE FLIP !",0);break;case"replayStart":this.el.goal.innerHTML="";break;default:break}return e}update(t,e,n,i){let r=this.el;r.s0.textContent=e.score[0],r.s1.textContent=e.score[1],r.clock.textContent=Qy(e),r.clock.className=e.overtime?"ot":!e.opts.freeplay&&e.opts.duration>0&&e.timeLeft<=30?"low":"",r.replay.classList.toggle("hidden",e.state!=="replay"),this.centerTimer>0&&(this.centerTimer-=t,this.centerTimer<=0&&(r.center.textContent="")),this.goalTimer>0&&(this.goalTimer-=t,this.goalTimer<=0&&(r.goal.innerHTML=""));let a=e.state==="replay",o=Math.max(.55,Math.min(1.6,window.innerHeight/1e3));if(o!==this.hudScale){this.hudScale=o;for(let l of this.players){let h=o*(l.el.dataset.split==="1"?.72:1);l.el.querySelector(".boost").style.transform=`scale(${h})`}}this.players.forEach((l,h)=>{let d=l.car;l.el.style.visibility=a?"hidden":"visible";let u=Math.round(d.boost);u!==l.lastBoost&&(l.lastBoost=u,l.num.textContent=u,l.arc.setAttribute("stroke-dasharray",`${io*.75*(u/100)} ${io}`),l.arc.style.opacity=u>0?1:0);let f=Math.round(d.vel.length()*3.6);l.sp.textContent=f,l.speedo.classList.toggle("ss",d.supersonic),l.cam.textContent=i.ballCam[h]?"CAM\xC9RA BALLE":"CAM\xC9RA VOITURE",d.demolished?l.demo.textContent=`D\xC9TRUIT ! Retour dans ${Math.max(1,Math.ceil(d.respawnTimer))}\u2026`:l.demo.classList.add("hidden")}),r.fps.classList.toggle("hidden",!i.showFps),i.showFps&&(r.fps.textContent=`${i.fps} FPS`);let c=i.scoreboard||e.state==="ended";return r.table.classList.toggle("hidden",!i.scoreboard),i.scoreboard&&(r.table.innerHTML=Fu(e)),c}clear(){this.root.innerHTML="",this.players=[]}};function Fu(s,t=!1){let e=null;if(t&&s.winner>=0)for(let i of s.cars)i.team===s.winner&&(!e||i.stats.score>e.stats.score)&&(e=i);let n="";for(let i of[0,1]){let r=s.cars.filter(a=>a.team===i).sort((a,o)=>o.stats.score-a.stats.score);if(r.length){n+=`<div class="st-team"><h4 style="color:${i===0?"var(--blue)":"var(--orange)"}">${i===0?"BLEU":"ORANGE"} \u2014 ${s.score[i]}</h4>
      <table class="st-table st-t${i}"><tr><th>JOUEUR</th><th>SCORE</th><th>BUTS</th><th>PASSES</th><th>ARR\xCATS</th><th>TIRS</th><th>D\xC9MOS</th></tr>`;for(let a of r){let o=a.stats;n+=`<tr><td>${gs(a.name)}${a.isBot?' <span style="color:#6f80a3;font-size:11px">IA</span>':""}${a===e?'<span class="mvp">\u2605 MVP</span>':""}</td>
        <td>${o.score}</td><td>${o.goals}</td><td>${o.assists}</td><td>${o.saves}</td><td>${o.shots}</td><td>${o.demos}</td></tr>`}n+="</table></div>"}}return n}var qp="supersonic-arena-settings-v1",Xc={playerName:"Joueur",player2Name:"Joueur 2",body:"octane",accent:"#1b1d22",boostColor:"team",fov:110,camDistance:2.7,camHeight:1,camStiffness:11,ballCamDefault:!0,volMaster:.8,volSfx:.9,volMusic:.5,quality:"high",showFps:!1,deadzone:.15,invertPitch:!1,keys:null,teamSize:2,difficulty:"pro",duration:300,theme:"day",team:0,splitscreen:!1,p2Team:1,replays:!0,boostMode:"normal",gameMode:"classic",gravityScale:1};function Yp(){let s={};try{s=JSON.parse(localStorage.getItem(qp)||"{}")||{}}catch{s={}}let t={...Xc,...s};return t.keys={...no,...s.keys||{}},t}function $p(s){try{localStorage.setItem(qp,JSON.stringify(s))}catch{}}var so={low:{label:"Basse",pixelRatio:.75,shadows:!1,bloom:!1,shadowSize:1024},medium:{label:"Moyenne",pixelRatio:1,shadows:!0,bloom:!1,shadowSize:1024},high:{label:"Haute",pixelRatio:1.5,shadows:!0,bloom:!0,shadowSize:2048},ultra:{label:"Ultra",pixelRatio:2,shadows:!0,bloom:!0,shadowSize:4096}};var Jp=s=>String(s).replace(/[&<>"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[t]),jy=["#1b1d22","#e8e8e8","#d62828","#f7c948","#2ec27e","#8a4dff","#ff4fa3","#00c2d1","#6b4a2b"],tM=["team","#ffd24d","#ff3b3b","#39ff88","#b05cff","#4de1ff","#ffffff","#ff66cc"];function Je(s,t,e,n=""){return`<div class="seg" data-seg="${s}">${t.map(([i,r])=>`<button data-v="${i}" class="${String(i)===String(e)?`on ${n}`:""}">${r}</button>`).join("")}</div>`}var qc=class{constructor(t,e){this.root=t,this.app=e,this.screen=null,this.stack=[],this.focus=0,this.waitingKey=null}get s(){return this.app.settings}hide(){this.root.innerHTML="",this.screen=null}isOpen(){return!!this.screen}show(t,e=!0){e&&this.screen&&this.screen!==t&&this.stack.push(this.screen),this.screen=t,this.focus=0,this.render(),this.app.onMenuChange(t)}back(){let t=this.stack.pop();t?this.show(t,!1):this.app.inMatch()&&this.app.resume()}render(){let t=this[`html_${this.screen}`]();this.root.innerHTML=t,this.bind()}bind(){let t=this.root;t.querySelectorAll("[data-action]").forEach(e=>{e.addEventListener("click",()=>{this.app.sound.click(),this.action(e.dataset.action,e)})}),t.querySelectorAll("[data-seg]").forEach(e=>{e.querySelectorAll("button").forEach(n=>n.addEventListener("click",()=>{this.app.sound.click(),this.setOption(e.dataset.seg,n.dataset.v)}))}),t.querySelectorAll("input[type=range]").forEach(e=>{e.addEventListener("input",()=>{let n=parseFloat(e.value);this.s[e.dataset.key]=n;let i=e.parentElement.querySelector(".val");i&&(i.textContent=e.dataset.fmt==="pct"?`${Math.round(n*100)}%`:n),this.app.applySettings()})}),t.querySelectorAll("input[type=text]").forEach(e=>{e.addEventListener("input",()=>{this.s[e.dataset.key]=e.value.slice(0,16)||Xc[e.dataset.key],this.app.saveSettings()})}),t.querySelectorAll(".swatch").forEach(e=>e.addEventListener("click",()=>{this.app.sound.click(),this.s[e.dataset.key]=e.dataset.v,this.app.applySettings(),this.render()})),t.querySelectorAll(".key[data-bind]").forEach(e=>{e.addEventListener("click",n=>{n.stopPropagation(),e.classList.add("wait"),e.textContent="\u2026";let[i,r]=e.dataset.bind.split(":");setTimeout(()=>this.app.input.captureNext(a=>{let o=[...this.s.keys[i]||[]];(a!=="Escape"||i==="pause")&&(o[+r]=a),this.s.keys[i]=o.filter(Boolean),this.app.saveSettings(),this.render()}),50)})})}setOption(t,e){let n=["teamSize","duration","team","p2Team","gravityScale"],i=e;n.includes(t)&&(i=Number(e)),(e==="true"||e==="false")&&(i=e==="true"),t==="freeUnlimited"?this.freeUnlimited=i:this.s[t]=i,this.app.applySettings(),this.render()}action(t){let e=this.app;switch(t){case"play":this.show("play");break;case"free":this.show("free");break;case"garage":this.show("garage");break;case"settings":this.show("settings");break;case"controls":this.show("controls");break;case"back":this.back();break;case"start":e.startMatch(this.matchConfig());break;case"startFree":e.startMatch({freeplay:!0,unlimitedBoost:this.freeUnlimited!==!1});break;case"resume":e.resume();break;case"restart":e.restart();break;case"quit":e.quitToMenu();break;case"resetSettings":{let n={keys:this.s.keys,playerName:this.s.playerName};Object.assign(this.s,Xc,n),e.applySettings(),this.render();break}case"resetKeys":this.s.keys={...no},e.saveSettings(),this.render();break;case"fullscreen":document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen&&document.documentElement.requestFullscreen();break;default:break}}matchConfig(){let t=this.s;return{teamSize:t.teamSize,difficulty:t.difficulty,duration:t.duration,theme:t.theme,team:t.team,splitscreen:t.splitscreen,p2Team:t.p2Team,replays:t.replays,boostMode:t.boostMode,gravityScale:t.gravityScale,gameMode:t.gameMode}}html_main(){return`<div class="menu"><div class="col">
      <div class="title">Supersonic<br>Arena</div>
      <div class="subtitle">Football \xB7 voitures \xB7 fus\xE9es</div>
      <button class="btn primary" data-action="play">Jouer<small>Match contre l'IA, de 1c1 \xE0 4c4, seul ou en \xE9cran partag\xE9</small></button>
      <button class="btn" data-action="free">Entra\xEEnement libre<small>Toi, la balle et du boost illimit\xE9</small></button>
      <button class="btn" data-action="garage">Garage<small>Carrosserie, couleurs et tra\xEEn\xE9e de boost</small></button>
      <button class="btn" data-action="settings">Param\xE8tres<small>Graphismes, cam\xE9ra, audio, manette</small></button>
      <button class="btn" data-action="controls">Commandes<small>Clavier/souris et manette \u2014 touches personnalisables</small></button>
      <button class="btn" data-action="fullscreen">Plein \xE9cran</button>
      <div class="footer">Jeu de fan non officiel inspir\xE9 de Rocket League\xAE. Manette Xbox/PlayStation support\xE9e.<br>F11 ou \xAB Plein \xE9cran \xBB pour une immersion totale.</div>
    </div></div>`}html_play(){let t=this.s,e=Object.entries(Wa).map(([i,r])=>[i,r.label]),n=Object.entries(ps).map(([i,r])=>[i,r.label]);return`<div class="menu center dim"><div class="col">
      <h2>Partie rapide</h2>
      <div class="opt"><label>Mode</label>${Je("gameMode",[["classic","Classique"],["heatseeker","Heatseeker"]],t.gameMode)}</div>
      ${t.gameMode==="heatseeker"?'<div class="hint">Heatseeker : apr\xE8s chaque touche, la balle fonce toute seule vers le but adverse, de plus en plus vite !</div>':""}
      <div class="opt"><label>Format</label>${Je("teamSize",[[1,"1 c 1"],[2,"2 c 2"],[3,"3 c 3"],[4,"4 c 4"]],t.teamSize)}</div>
      <div class="opt"><label>Difficult\xE9 IA</label>${Je("difficulty",e,t.difficulty)}</div>
      <div class="opt"><label>Dur\xE9e</label>${Je("duration",[[120,"2 min"],[300,"5 min"],[600,"10 min"],[0,"Illimit\xE9e"]],t.duration)}</div>
      <div class="opt"><label>Ar\xE8ne</label>${Je("theme",n,t.theme)}</div>
      <div class="opt"><label>Ton \xE9quipe</label>${Je("team",[[0,"Bleue"],[1,"Orange"]],t.team,t.team===1?"orange":"")}</div>
      <div class="opt"><label>\xC9cran partag\xE9</label>${Je("splitscreen",[[!1,"1 joueur"],[!0,"2 joueurs"]],t.splitscreen)}</div>
      ${t.splitscreen?`<div class="opt"><label>Joueur 2</label>${Je("p2Team",[[t.team,"Avec moi"],[1-t.team,"Contre moi"]],t.p2Team)}</div>
      <div class="hint">Joueur 1 : clavier/souris (ou 2e manette). Joueur 2 : premi\xE8re manette branch\xE9e.</div>`:""}
      <div class="opt"><label>Replays des buts</label>${Je("replays",[[!0,"Oui"],[!1,"Non"]],t.replays)}</div>
      <h3>Mutateurs</h3>
      <div class="opt"><label>Boost</label>${Je("boostMode",[["normal","Normal"],["unlimited","Illimit\xE9"],["none","Aucun"]],t.boostMode)}</div>
      <div class="opt"><label>Gravit\xE9</label>${Je("gravityScale",[[1,"Normale"],[.35,"Lunaire"],[1.6,"Forte"]],t.gravityScale)}</div>
      <div class="btn-row"><button class="btn" data-action="back">Retour</button><button class="btn primary" data-action="start">Lancer le match</button></div>
    </div></div>`}html_free(){let t=this.s,e=Object.entries(ps).map(([n,i])=>[n,i.label]);return`<div class="menu center dim"><div class="col">
      <h2>Entra\xEEnement libre</h2>
      <div class="opt"><label>Ar\xE8ne</label>${Je("theme",e,t.theme)}</div>
      <div class="opt"><label>Boost illimit\xE9</label>${Je("freeUnlimited",[[!0,"Oui"],[!1,"Non"]],this.freeUnlimited!==!1)}</div>
      <p class="hint">Touche <span class="key">${Tr(t.keys.resetBall[0])}</span> : replacer la balle devant toi \xB7
      <span class="key">${Tr(t.keys.shootBall[0])}</span> : la balle est lanc\xE9e vers toi (parfait pour s'entra\xEEner aux a\xE9riennes).</p>
      <div class="btn-row"><button class="btn" data-action="back">Retour</button><button class="btn primary" data-action="startFree">C'est parti</button></div>
    </div></div>`}html_garage(){let t=this.s,e=Object.entries(Sn).map(([r,a])=>[r,a.name]),n=(r,a)=>`<div class="swatches">${a.map(o=>`<div class="swatch ${t[r]===o?"on":""}" data-key="${r}" data-v="${o}"
      style="background:${o==="team"?"linear-gradient(135deg,#2f7bff 50%,#ff8a1f 50%)":o}" title="${o==="team"?"Couleur d'\xE9quipe":o}"></div>`).join("")}</div>`,i=Sn[t.body]||Sn.octane;return`<div class="menu"><div class="col">
      <h2>Garage</h2>
      <div class="opt"><label>Pseudo</label><input type="text" data-key="playerName" maxlength="16" value="${Jp(t.playerName)}"></div>
      <div class="opt"><label>Carrosserie</label>${Je("body",e,t.body)}</div>
      <div class="hint">Hitbox : ${(i.hx*200).toFixed(0)} \xD7 ${(i.hz*200).toFixed(0)} \xD7 ${(i.hy*200).toFixed(0)} cm \u2014 ${{octane:"polyvalente et haute, id\xE9ale pour les dribbles",dominus:"longue et plate, parfaite pour les frappes puissantes",breakout:"la plus longue, pour les tirs pr\xE9cis",merc:"massive, un tank pour d\xE9fendre"}[t.body]||""}</div>
      <div class="opt"><label>Couleur secondaire</label>${n("accent",jy)}</div>
      <div class="opt"><label>Tra\xEEn\xE9e de boost</label>${n("boostColor",tM)}</div>
      <div class="opt"><label>Pseudo joueur 2</label><input type="text" data-key="player2Name" maxlength="16" value="${Jp(t.player2Name)}"></div>
      <div class="btn-row"><button class="btn" data-action="back">Retour</button></div>
    </div></div>`}html_settings(){let t=this.s,e=(n,i,r,a,o)=>`<div><input type="range" data-key="${n}" data-fmt="${o||""}" min="${i}" max="${r}" step="${a}" value="${t[n]}">
      <span class="val">${o==="pct"?`${Math.round(t[n]*100)}%`:t[n]}</span></div>`;return`<div class="menu center dim"><div class="col">
      <h2>Param\xE8tres</h2>
      <h3>Graphismes</h3>
      <div class="opt"><label>Qualit\xE9</label>${Je("quality",Object.entries(so).map(([n,i])=>[n,i.label]),t.quality)}</div>
      <div class="opt"><label>Afficher les FPS</label>${Je("showFps",[[!1,"Non"],[!0,"Oui"]],t.showFps)}</div>
      <h3>Cam\xE9ra</h3>
      <div class="opt"><label>Champ de vision</label>${e("fov",70,120,1)}</div>
      <div class="opt"><label>Distance</label>${e("camDistance",1.8,4.2,.1)}</div>
      <div class="opt"><label>Hauteur</label>${e("camHeight",.5,2,.05)}</div>
      <div class="opt"><label>Rigidit\xE9</label>${e("camStiffness",4,25,1)}</div>
      <div class="opt"><label>Cam\xE9ra balle au d\xE9part</label>${Je("ballCamDefault",[[!0,"Oui"],[!1,"Non"]],t.ballCamDefault)}</div>
      <h3>Audio</h3>
      <div class="opt"><label>Volume g\xE9n\xE9ral</label>${e("volMaster",0,1,.05,"pct")}</div>
      <div class="opt"><label>Effets</label>${e("volSfx",0,1,.05,"pct")}</div>
      <div class="opt"><label>Musique (menus)</label>${e("volMusic",0,1,.05,"pct")}</div>
      <p class="hint">Messages rapides : touches <span class="key">1</span> \xE0 <span class="key">8</span>
      (Je l'ai ! \xB7 Joli tir ! \xB7 Quel arr\xEAt ! \xB7 Merci ! \xB7 Calcul\xE9. \xB7 Oups\u2026 \xB7 D\xE9fends ! \xB7 Bien jou\xE9 !)</p>
      <h3>Manette</h3>
      <div class="opt"><label>Zone morte</label>${e("deadzone",.02,.4,.01)}</div>
      <div class="opt"><label>Inverser le tangage</label>${Je("invertPitch",[[!1,"Non"],[!0,"Oui"]],t.invertPitch)}</div>
      <div class="btn-row"><button class="btn" data-action="resetSettings">Par d\xE9faut</button><button class="btn primary" data-action="back">Retour</button></div>
    </div></div>`}html_controls(){let t=this.s,e=Xp.map(([i,r])=>{let a=t.keys[i]||[],o=[0,1].map(c=>`<span class="key" data-bind="${i}:${c}">${a[c]?Tr(a[c]):"+"}</span>`).join("");return`<tr><td>${r}</td><td>${o}</td></tr>`}).join(""),n=[["Acc\xE9l\xE9rer / reculer","RT / LT"],["Diriger \xB7 tangage \xB7 lacet","Stick gauche"],["Sauter / double saut / flip","A (\u2715)"],["Boost","B (\u25CB) ou RB (R1)"],["D\xE9rapage / air roll libre","X (\u25A1)"],["Air roll gauche","LB (L1)"],["Cam\xE9ra balle","Y (\u25B3)"],["Tableau des scores","Back / Share"],["Pause","Start / Options"],["Messages rapides","Croix directionnelle"]].map(([i,r])=>`<tr><td>${i}</td><td><span class="key">${r}</span></td></tr>`).join("");return`<div class="menu center dim"><div class="col">
      <h2>Commandes</h2>
      <p class="hint">Clique sur une touche puis appuie sur la nouvelle touche (ou un bouton de souris) pour la r\xE9assigner.</p>
      <h3>Clavier / souris</h3>
      <table class="keys-table">${e}</table>
      <p class="hint">Messages rapides : touches <span class="key">1</span> \xE0 <span class="key">8</span>
      (Je l'ai ! \xB7 Joli tir ! \xB7 Quel arr\xEAt ! \xB7 Merci ! \xB7 Calcul\xE9. \xB7 Oups\u2026 \xB7 D\xE9fends ! \xB7 Bien jou\xE9 !)</p>
      <h3>Manette</h3>
      <table class="keys-table">${n}</table>
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
    </div></div>`}html_end(){let t=this.app.match,e=this.app.localTeam(),n;return this.s.splitscreen&&this.app.localTeams().size>1?n=`L'\xE9quipe ${t.winner===0?"bleue":"orange"} gagne !`:n=t.winner===e?"VICTOIRE !":"D\xC9FAITE",`<div class="menu center dim"><div class="col">
      <div class="end-title" style="color:${t.winner===0?"var(--blue)":"var(--orange)"}">${n}</div>
      <div class="end-score"><span class="b">${t.score[0]}</span> \u2014 <span class="o">${t.score[1]}</span></div>
      ${Fu(t,!0)}
      <div class="btn-row"><button class="btn" data-action="quit">Menu principal</button><button class="btn primary" data-action="restart">Rejouer</button></div>
    </div></div>`}navigate(t){let e=[...this.root.querySelectorAll("button")];e.length&&(this.focus=(this.focus+t+e.length)%e.length,e.forEach((n,i)=>n.classList.toggle("focus",i===this.focus)),e[this.focus].scrollIntoView({block:"nearest"}))}activate(){let t=[...this.root.querySelectorAll("button")];t[this.focus]&&t[this.focus].click()}};var ro=ut.dt,eM=["Je l'ai !","Joli tir !","Quel arr\xEAt !","Merci !","Calcul\xE9.","Oups\u2026","D\xE9fends !","Bien jou\xE9 !"],Zp=[1776930,15263976,14034984,16238920,3064446,9063935,49873,4475479],dn=new E,wr=new E;function Kp(s){let t=s.slice();for(let e=t.length-1;e>0;e--){let n=Math.floor(Math.random()*(e+1));[t[e],t[n]]=[t[n],t[e]]}return t}var Bu=class{constructor(){this.settings=Yp(),this.canvas=document.getElementById("game"),this.renderer=new dc({canvas:this.canvas,antialias:!0,powerPreference:"high-performance"}),this.renderer.outputColorSpace=We,this.renderer.toneMapping=as,this.renderer.shadowMap.type=ss,this.scene=new Ki;let t=new rr(this.renderer);this.scene.environment=t.fromScene(new yc,.04).texture,this.scene.environmentIntensity=.35,this.cameras=[new Xe(80,1,.1,3e3),new Xe(80,1,.1,3e3)],this.cameras[0].layers.enable(3),this.cameras[1].layers.enable(2),this.rigs=this.cameras.map(i=>new kc(i)),this.effects=new Oc(this.scene),this.input=new Hc(this.settings),this.sound=new Gc(this.settings),this.hud=new Wc(document.getElementById("hud")),this.menus=new qc(document.getElementById("ui"),this);let e=Tp();this.ballMesh=new Tt(new ns(ut.ballRadius,48,32),new ye({map:e.map,emissiveMap:e.emissiveMap,emissive:16777215,emissiveIntensity:1.3,roughness:.38,metalness:.35})),this.ballMesh.castShadow=!0,this.scene.add(this.ballMesh),this.ballShadow=new Tt(new fn(2.6,2.6),new we({map:Ep(),transparent:!0,depthWrite:!1})),this.ballShadow.rotation.x=-Math.PI/2,this.ballShadow.renderOrder=2,this.scene.add(this.ballShadow),this.world=null,this.themeKey=null,this.qualityKey=null,this.match=null,this.mode="menu",this.paused=!1,this.carViews=[],this.locals=[],this.bots=[],this.acc=0,this.last=performance.now(),this.fpsFrames=0,this.fpsTime=0,this.fps=0,this.attractTime=0,this.endTimer=-1,this.garage=null,this.frameEvents=[],this.applySettings(!1),this.buildWorld(this.settings.theme),window.addEventListener("resize",()=>this.resize()),this.resize();let n=()=>{this.sound.init(),this.mode==="menu"&&this.sound.startMusic()};window.addEventListener("pointerdown",n),window.addEventListener("keydown",n),this.startAttract(),this.menus.show("main",!1),document.getElementById("loading").remove(),requestAnimationFrame(i=>this.frame(i))}get quality(){return so[this.settings.quality]||so.high}saveSettings(){$p(this.settings)}applySettings(t=!0){let e=this.settings;this.sound.applyVolumes(),this.qualityKey&&this.qualityKey!==e.quality&&this.buildWorld(this.themeKey,!0),this.qualityKey=e.quality,this.resize(),this.garage&&this.refreshGarage(),this.mode==="menu"&&this.menus.screen==="play"&&e.theme!==this.themeKey&&this.buildWorld(e.theme),this.mode==="menu"&&this.menus.screen==="free"&&e.theme!==this.themeKey&&this.buildWorld(e.theme),t&&this.saveSettings()}resize(){let t=this.quality,e=window.innerWidth,n=window.innerHeight;this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,t.pixelRatio)),this.renderer.setSize(e,n,!1),this.composer&&(this.composer.setPixelRatio(this.renderer.getPixelRatio()),this.composer.setSize(e,n))}buildWorld(t,e=!1){if(t===this.themeKey&&!e)return;let n=ps[t]||ps.day;this.themeKey=ps[t]?t:"day";let i=this.quality;this.world&&(this.scene.remove(this.world.group),this.world.group.traverse(h=>{h.geometry&&h.geometry.dispose(),h.material&&(Array.isArray(h.material)?h.material:[h.material]).forEach(d=>{d.map&&d.map.dispose(),d.dispose()})}));let r=new Le,a=Np(n,i);r.add(a.group),r.add(Up(n));let o=new _a(n.hemiSky,n.hemiGround,n.hemiIntensity);r.add(o);let c=new Sa(n.sun,n.sunIntensity);c.position.set(...n.sunDir).normalize().multiplyScalar(120),c.target.position.set(0,0,0),c.castShadow=i.shadows,c.shadow.mapSize.set(i.shadowSize,i.shadowSize);let l=c.shadow.camera;if(l.left=-62,l.right=62,l.top=72,l.bottom=-72,l.near=10,l.far=300,c.shadow.bias=-4e-4,c.shadow.normalBias=.03,r.add(c,c.target),this.scene.add(r),this.scene.fog=new Yr(n.fog,220,1100),this.renderer.shadowMap.enabled=i.shadows,this.renderer.toneMappingExposure=n.exposure,this.world={group:r,updatePads:a.updatePads},this.composer=null,i.bloom){let h=new xc(this.renderer);this.renderPass=new _c(this.scene,this.cameras[0]),h.addPass(this.renderPass),this.bloom=new cr(new it(512,512),.6,.4,1),h.addPass(this.bloom),h.addPass(new vc),this.composer=h}this.scene.traverse(h=>{h.material&&(Array.isArray(h.material)?h.material:[h.material]).forEach(d=>{d.needsUpdate=!0})}),this.resize()}makePlayers(t){let e=this.settings,n=Kp(yu),i=Object.keys(Sn),r=[],a=(l,h,d,u)=>({team:h,name:l,body:d,isBot:!1,local:u});if(t.freeplay)return[a(e.playerName,0,e.body,0)];let o=t.teamSize,c=[a(e.playerName,t.team,e.body,0)];t.splitscreen&&c.push(a(e.player2Name,t.p2Team,i[(i.indexOf(e.body)+1)%i.length],1));for(let l=0;l<2;l++){let h=c.filter(d=>d.team===l);r.push(...h);for(let d=h.length;d<o;d++)r.push({team:l,name:n.pop(),body:i[Math.floor(Math.random()*i.length)],isBot:!0})}return r}startMatch(t){this.clearMatch(),this.lastConfig=t;let e=this.settings;t.theme?this.buildWorld(t.theme):this.buildWorld(e.theme);let n=this.makePlayers(t);if(this.match=new Za({players:n,duration:t.freeplay?0:t.duration,freeplay:!!t.freeplay,unlimitedBoost:!!t.unlimitedBoost||t.boostMode==="unlimited",noBoost:t.boostMode==="none",gravityScale:t.gravityScale||1,mode:t.gameMode||"classic",replays:t.freeplay?!1:t.replays}),this.splitscreen=!!t.splitscreen&&!t.freeplay,this.locals=[],this.match.cars.forEach((i,r)=>{n[r].local!==void 0&&(this.locals[n[r].local]={car:i,index:n[r].local})}),this.locals=this.locals.filter(Boolean),this.bots=this.match.cars.filter(i=>i.isBot).map(i=>new Qa(i,t.difficulty||"pro")),this.createCarViews(this.match),this.rigs.forEach(i=>{i.reset(),i.ballCam=e.ballCamDefault}),this.mode="match",this.paused=!1,this.endTimer=-1,this.acc=0,this.effects.clear(),this.menus.hide(),this.menus.stack=[],this.hud.root.classList.remove("hidden"),this.hud.setup(this.match,this.locals,this.viewports()),!e.tutorialSeen||t.freeplay){let i=r=>`<span class="key">${Tr(e.keys[r][0])}</span>`;this.hud.showHint(`${i("throttle")}${i("reverse")} rouler \xB7 ${i("left")}${i("right")} tourner \xB7 ${i("jump")} sauter (2\xD7 = flip) \xB7 ${i("boost")} boost \xB7 ${i("ballCam")} cam\xE9ra \xB7 ${i("pause")} pause${t.freeplay?` \xB7 ${i("resetBall")} balle \xB7 ${i("shootBall")} tir`:""}`,12),e.tutorialSeen=!0,this.saveSettings()}this.sound.init(),this.sound.stopMusic(),document.body.style.cursor="none"}createCarViews(t){this.carViews.forEach(i=>{this.scene.remove(i.group),i.dispose()});let e=this.settings,n=new Set(this.locals.map(i=>i.car));this.carViews=t.cars.map((i,r)=>{let a=n.has(i),o=a?new ht(e.accent).getHex():Zp[(r*3+1)%Zp.length],c=a&&e.boostColor!=="team"?new ht(e.boostColor).getHex():null,l=new to(i,{teamColor:ur[i.team].main,accent:o,boostColor:c,showName:!a||this.splitscreen}),h=this.locals.findIndex(d=>d.car===i);return l.nameTag&&h>=0&&l.nameTag.layers.set(2+h),this.scene.add(l.group),l})}clearMatch(){this.match=null,this.carViews.forEach(t=>{this.scene.remove(t.group),t.dispose()}),this.carViews=[],this.bots=[],this.locals=[],this.hud.clear(),this.hud.root.classList.add("hidden")}startAttract(){this.clearMatch(),this.mode="menu",this.splitscreen=!1;let t=Kp(yu),e=Object.keys(Sn),n=[];for(let i=0;i<2;i++)for(let r=0;r<2;r++)n.push({team:i,name:t.pop(),body:e[(i*2+r)%4],isBot:!0});this.match=new Za({players:n,duration:0,replays:!1}),this.bots=this.match.cars.map(i=>new Qa(i,"allstar")),this.createCarViews(this.match),this.rigs[0].reset(),this.attractTime=0,document.body.style.cursor=""}restart(){this.lastConfig&&this.startMatch(this.lastConfig)}resume(){this.paused=!1,this.menus.hide(),this.menus.stack=[],document.body.style.cursor="none"}pause(){this.mode!=="match"||this.match.state==="ended"||(this.paused=!0,this.menus.stack=[],this.menus.show("pause",!1),this.sound.silenceEngines(),document.body.style.cursor="")}quitToMenu(){this.paused=!1,this.menus.stack=[],this.startAttract(),this.menus.show("main",!1),this.sound.startMusic()}inMatch(){return this.mode==="match"}localTeam(){return this.locals.length?this.locals[0].car.team:0}localTeams(){return new Set(this.locals.map(t=>t.car.team))}onMenuChange(t){t==="garage"?this.enterGarage():this.garage&&this.exitGarage(),(t==="play"||t==="free")&&this.mode==="menu"&&this.buildWorld(this.settings.theme)}enterGarage(){this.garage||(this.garage={t:0,view:null},this.rigs[0].reset(),this.refreshGarage())}refreshGarage(){if(!this.garage)return;let t=this.settings;this.garage.view&&(this.scene.remove(this.garage.view.group),this.garage.view.dispose());let e={bodyKey:t.body,name:t.playerName,team:0},n=new to(e,{teamColor:ur[0].main,accent:new ht(t.accent).getHex(),boostColor:t.boostColor!=="team"?new ht(t.boostColor).getHex():null,showName:!1});this.scene.add(n.group),this.garage.view=n}exitGarage(){this.garage&&(this.garage.view&&(this.scene.remove(this.garage.view.group),this.garage.view.dispose()),this.garage=null,this.rigs[0].reset())}viewports(){return this.mode==="match"&&this.splitscreen&&this.locals.length>1?[{x:0,y:0,w:1,h:.5},{x:0,y:.5,w:1,h:.5}]:[{x:0,y:0,w:1,h:1}]}frame(t){requestAnimationFrame(i=>this.frame(i));let e=Math.min(.1,(t-this.last)/1e3);this.last=t,this.fpsFrames++,this.fpsTime+=e,this.fpsTime>.5&&(this.fps=Math.round(this.fpsFrames/this.fpsTime),this.fpsFrames=0,this.fpsTime=0),this.input.poll(),this.handleUiInput();let n=this.match&&!this.paused&&!this.garage;if(n){this.acc+=e;let i=0;for(;this.acc>=ro&&i<12;)this.step(),this.acc-=ro,i++;i===12&&(this.acc=0)}this.processEvents(),this.render(e,n)}handleUiInput(){let t=this.input,e=this.splitscreen;if(this.menus.isOpen()){for(let n=0;n<2;n++)for(let i of t.padFor(n,!1)){let r=t.padPressed.get(i.index)||[];r[12]&&this.menus.navigate(-1),r[13]&&this.menus.navigate(1),r[0]&&this.menus.activate(),r[1]&&this.menus.back()}this.mode==="match"&&t.pressed("pause",0,!1)&&this.menus.screen==="pause"?this.resume():t.frameKeys&&t.frameKeys.has("Escape")&&this.menus.screen!=="main"&&this.menus.screen!=="pause"&&this.menus.screen!=="end"&&this.menus.back();return}if(this.mode==="match"){for(let n=0;n<this.locals.length;n++){if(t.pressed("pause",n,e)){this.pause();return}t.pressed("ballCam",n,e)&&(this.rigs[n].ballCam=!this.rigs[n].ballCam),this.match.state==="replay"&&t.pressed("jump",n,e)&&this.match.requestSkip()}if(this.match.opts.freeplay&&this.locals[0])t.pressed("resetBall",0,e)&&this.freeplayBall(!1),t.pressed("shootBall",0,e)&&this.freeplayBall(!0);else for(let n=0;n<this.locals.length;n++){let i=t.quickChat(n,e);i>=0&&this.say(this.locals[n].car,eM[i])}}}say(t,e){if(this.mode!=="match"||!this.match||!this.match.cars.includes(t))return;let n=performance.now();t.chatLog=(t.chatLog||[]).filter(i=>n-i<4e3),!(t.chatLog.length>=3)&&(t.chatLog.push(n),this.hud.chat(t,e))}botChatter(t){if(this.mode!=="match"||this.match.opts.freeplay)return;let e=this.match.cars.filter(r=>r.isBot),n=r=>r[Math.floor(Math.random()*r.length)],i=(r,a)=>setTimeout(()=>this.say(r,a),700+Math.random()*1500);if(t.type==="goal"){let r=e.filter(o=>o.team===t.team),a=e.filter(o=>o.team!==t.team);r.length&&Math.random()<.5&&i(n(r),t.scorer&&t.scorer.isBot&&r.includes(t.scorer)?n(["Calcul\xE9.","Et c'est dedans !"]):n(["Joli tir !","Quel but !","Merci !"])),a.length&&Math.random()<.35&&i(n(a),n(["Oups\u2026","\xC7a arrive\u2026","Pas mal."]))}else if(t.type==="stat"&&t.label.startsWith("ARR\xCAT")&&Math.random()<.35){let r=e.filter(a=>a!==t.car);r.length&&i(n(r),"Quel arr\xEAt !")}else t.type==="end"&&e.forEach(r=>{Math.random()<.6&&i(r,n(["GG","Bien jou\xE9 !","Belle partie !"]))})}rumble(t,e,n,i){let r=this.locals.findIndex(a=>a.car===t);if(!(r<0))for(let a of this.input.padFor(r,this.splitscreen))try{a.vibrationActuator&&a.vibrationActuator.playEffect&&a.vibrationActuator.playEffect("dual-rumble",{duration:i,strongMagnitude:e,weakMagnitude:n})}catch{}}freeplayBall(t){let e=this.match,n=this.locals[0].car,i=e.ball;if(n.forward(dn),dn.y=0,dn.normalize(),t){let r=Math.random()*Math.PI*2,a=new E(n.pos.x+Math.cos(r)*22,2,n.pos.z+Math.sin(r)*22);a.x=ln.clamp(a.x,-jt.W+4,jt.W-4),a.z=ln.clamp(a.z,-jt.L+4,jt.L-4);let o=n.pos.clone().addScaledVector(dn,8);o.y=5+Math.random()*5;let c=2.2;i.reset(a.x,a.y,a.z),i.vel.copy(o).sub(a).multiplyScalar(1/c),i.vel.y-=.5*ut.gravity*c}else{let r=n.pos.clone().addScaledVector(dn,7);r.x=ln.clamp(r.x,-jt.W+3,jt.W-3),r.z=ln.clamp(r.z,-jt.L+3,jt.L-3),i.reset(r.x,1.5,r.z)}e.state="playing",e.refreshPrediction()}step(){let t=this.match;for(let e of this.locals)this.input.controls(e.index,this.splitscreen,e.car.controls);for(let e of this.bots)e.update(ro,t);t.tick(ro),t.events.length&&(this.frameEvents.push(...t.events),t.events.length=0),this.mode==="menu"&&t.state==="playing"&&t.time>240&&t.kickoff===!1&&Math.random()<5e-4&&t.resetKickoff()}processEvents(){let t=this.match,e=this.mode==="match",n=new Set(this.locals.map(i=>i.car));for(let i of this.frameEvents)switch(e&&(this.hud.onEvent(i,t),this.botChatter(i)),i.type){case"hit":this.effects.sparks(i.pos,i.strength),e&&this.sound.hit(i.pos,i.strength),this.rumble(i.car,Math.min(1,i.strength/20),Math.min(1,i.strength/12),90),n.has(i.car)&&this.rigs[this.locals.findIndex(r=>r.car===i.car)].addShake(Math.min(.25,i.strength*.01));break;case"bounce":e&&this.sound.bounce(i.pos,i.strength);break;case"jump":case"dodge":n.has(i.car)&&this.sound.jump(i.car.pos);break;case"pad":this.effects.padPickup(i.pos,i.big),n.has(i.car)&&this.sound.pad(i.pos,i.big);break;case"bump":e&&this.sound.bump(i.pos,i.strength),this.rumble(i.victim,.7,.5,150),this.rumble(i.attacker,.4,.4,100);break;case"demo":this.effects.demolition(i.pos,ur[i.victim.team].main),e&&this.sound.explosion(i.pos,!1),this.locals.forEach((r,a)=>{(r.car===i.victim||r.car===i.attacker)&&this.rigs[a].addShake(.4)}),this.rumble(i.victim,1,1,400),this.rumble(i.attacker,.6,.8,200);break;case"goal":this.effects.explosion(i.pos,ur[i.team].main,!0),e&&this.sound.explosion(i.pos,!0),e&&this.sound.horn(this.localTeams().has(i.team)),this.rigs.forEach(r=>r.addShake(.7)),this.locals.forEach(r=>this.rumble(r.car,.8,.8,600));break;case"replayGoal":this.effects.explosion(i.pos,ur[i.team].main,!0),e&&this.sound.explosion(i.pos,!0);break;case"kickoff":case"replayStart":this.effects.clear(),this.rigs.forEach(r=>r.reset());break;case"countdown":e&&this.sound.beep(!1);break;case"go":e&&this.sound.beep(!0);break;case"overtime":e&&this.sound.beep(!0);break;case"end":e&&(this.endTimer=2.5,this.sound.cheer(4));break;default:break}this.frameEvents.length=0}visualStates(t){let e=this.match,n=[];if(e.state==="replay"&&e.replay){let r=e.replaySnapshot(e.replay.time),{a,b:o,k:c}=r,l=Math.max(.001,o.t-a.t);e.cars.forEach((u,f)=>{let p=a.cars[f],_=o.cars[f],m=new E(p[0]+(_[0]-p[0])*c,p[1]+(_[1]-p[1])*c,p[2]+(_[2]-p[2])*c),g=new ae(p[3],p[4],p[5],p[6]),M=new ae(_[3],_[4],_[5],_[6]),w=new E(_[0]-p[0],_[1]-p[1],_[2]-p[2]).multiplyScalar(1/l);w.lengthSq()>3e3&&w.set(0,0,0),n.push({pos:m,quat:g.slerp(M,c),boosting:!!p[7],demolished:!!p[8],steer:p[9],spin:p[10]+(_[10]-p[10])*c,supersonic:!!p[11],vel:w,onGround:!0,groundNormal:new E(0,1,0)})});let h=a.ball,d=o.ball;return{cars:n,ball:{pos:new E(h[0]+(d[0]-h[0])*c,h[1]+(d[1]-h[1])*c,h[2]+(d[2]-h[2])*c),quat:new ae(h[3],h[4],h[5],h[6]).slerp(new ae(d[3],d[4],d[5],d[6]),c),hidden:!!h[7]}}}for(let r of e.cars)n.push({pos:new E().lerpVectors(r.prevPos,r.pos,t),quat:new ae().slerpQuaternions(r.prevQuat,r.quat,t),boosting:r.boosting,demolished:r.demolished,steer:r.steerVis,spin:r.wheelSpin,supersonic:r.supersonic,vel:r.vel,onGround:r.onGround,groundNormal:r.groundNormal});let i=e.ball;return{cars:n,ball:{pos:new E().lerpVectors(i.prevPos,i.pos,t),quat:new ae().slerpQuaternions(i.prevQuat,i.quat,t),hidden:i.hidden}}}render(t,e){let n=this.match,i=performance.now()/1e3,r=e?this.acc/ro:1,a=this.visualStates(r);a.cars.forEach((m,g)=>{let M=this.carViews[g];if(M&&(M.update(m,i),this.garage&&(M.group.visible=!1),!(m.demolished||this.garage||!e))){if(m.boosting){wr.set(1,0,0).applyQuaternion(m.quat);for(let w=0;w<2;w++)M.exhaustWorld(w,dn),this.effects.boost(dn,wr,m.vel,M.boostColor,m.supersonic)}if(m.supersonic)for(let w of[1,-1])dn.set(M.backX,M.wheelBaseY+.05,w*M.halfWidth).applyQuaternion(m.quat).add(m.pos),this.effects.trail(dn,new ht(.8,.9,1.2))}});let o=a.ball;this.ballMesh.visible=!o.hidden&&!this.garage,this.ballMesh.position.copy(o.pos),this.ballMesh.quaternion.copy(o.quat);let c=o.pos.y-ut.ballRadius;this.ballShadow.visible=this.ballMesh.visible&&Math.abs(o.pos.x)<jt.W-2&&Math.abs(o.pos.z)<jt.L+jt.GD,this.ballShadow.position.set(o.pos.x,.03,o.pos.z);let l=1+c*.05;this.ballShadow.scale.set(l,l,l),this.ballShadow.material.opacity=Math.max(.15,.85-c*.035),this.world&&this.world.updatePads(t,n.pads),this.effects.update(e?t:0);let h=this.viewports(),d=window.innerWidth,u=window.innerHeight;h.forEach((m,g)=>{let M=this.cameras[g],w=m.w*d/(m.h*u);M.aspect=w,M.fov=Gp(this.mode==="match"?this.settings.fov:90,w),M.updateProjectionMatrix()}),this.updateCameras(t,a);let f=this.cameras[0];if(this.sound.setListener(f.position,dn.set(1,0,0).applyQuaternion(f.quaternion)),this.mode==="match"&&!this.paused&&n.state!=="replay"){this.locals.forEach((g,M)=>{let w=g.car;this.sound.updateEngine(M,w.vel.length(),w.controls.throttle,w.boosting,w.onGround,!w.demolished,this.locals.length)});let m=Math.abs(n.ball.pos.z);this.sound.setCrowd(.35+Math.max(0,1-(jt.L-m)/30)*.6)}else this.sound.silenceEngines(),this.sound.setCrowd(this.mode==="menu"?.15:.3);let p=this.renderer,_=p.getPixelRatio();if(h.length===1&&this.composer?(this.effects.setViewportHeight(u*_/(2*Math.tan(ln.degToRad(this.cameras[0].fov)/2))),this.renderPass.camera=this.cameras[0],this.composer.render(t)):(p.setScissorTest(!0),h.forEach((m,g)=>{let M=m.x*d,w=(1-m.y-m.h)*u;p.setViewport(M,w,m.w*d,m.h*u),p.setScissor(M,w,m.w*d,m.h*u),this.effects.setViewportHeight(m.h*u*_/(2*Math.tan(ln.degToRad(this.cameras[g].fov)/2))),p.render(this.scene,this.cameras[g])}),p.setScissorTest(!1),p.setViewport(0,0,d,u)),this.mode==="match"&&n){let m=this.locals.some((g,M)=>this.input.held("scoreboard",M,this.splitscreen));this.hud.update(t,n,this.locals,{ballCam:this.rigs.map(g=>g.ballCam),showFps:this.settings.showFps,fps:this.fps,scoreboard:m&&!this.paused}),this.endTimer>0&&(this.endTimer-=t,this.endTimer<=0&&(this.menus.stack=[],this.menus.show("end",!1),document.body.style.cursor=""))}}replayCamera(t,e){let n=this.match,i=e.ball.pos,r=n.goalInfo,o=(r?r.team:0)===0?jt.L:-jt.L,c=Math.sign(o),l=n.replay.time>n.replay.goalTime-1.3,h=new E,d=new E().copy(i),u=r&&r.scorer?n.cars.indexOf(r.scorer):-1,f=u>=0?e.cars[u]:null,p=6;if(l){let _=i.x>=0?1:-1;h.set(_*(jt.GW+3.5),4.2,o-c*12),p=this.replayShot==="finish"?3:1e3,this.replayShot="finish"}else if(f&&!f.demolished){let _=dn.copy(f.pos).sub(i);_.y=0,_.lengthSq()<.5&&_.set(0,0,-c),_.normalize(),h.copy(f.pos).addScaledVector(_,4.5),h.y+=1.8,d.lerp(f.pos,.25),this.replayShot="chase"}else{let _=dn.set(i.x*.3,0,i.z-o);_.lengthSq()<1&&_.set(0,0,-c),_.normalize(),h.copy(i).addScaledVector(_,11),h.y=Math.max(i.y+3.5,4),this.replayShot="ball"}Vc(h,1),this.rigs.forEach((_,m)=>{m>=this.viewports().length||(p>100&&_.reset(),_.setView(t,h,d,Math.min(p,8)))})}updateCameras(t,e){let n=this.match,i=this.settings,r={camDistance:i.camDistance,camHeight:i.camHeight,camStiffness:i.camStiffness};if(this.garage){this.garage.t+=t;let a=this.garage;a.view.update({pos:new E(0,Sn[i.body].hy+ut.rideHeight,0),quat:new ae().setFromAxisAngle(new E(0,1,0),a.t*.5),boosting:Math.sin(a.t*.8)>.6,demolished:!1,steer:Math.sin(a.t*.7)*.6,spin:a.t*3,supersonic:!1},performance.now()/1e3);let o=.75+Math.sin(a.t*.2)*.25,c=2.9;dn.set(Math.cos(o)*c,1,Math.sin(o)*c),wr.set(-Math.sin(o),0,Math.cos(o)).multiplyScalar(1.05),wr.y=.3,this.rigs[0].setView(t,dn,wr,3);return}if(n.state==="replay"){this.replayCamera(t,e);return}if(this.mode==="menu"){if(this.attractTime+=t,Math.floor(this.attractTime/11)%3===1&&e.cars[0]){let h=e.cars[Math.floor(this.attractTime/33)%e.cars.length];if(!h.demolished){this.rigs[0].ballCam=!0,this.rigs[0].follow(t,h,e.ball.pos,{camDistance:3.2,camHeight:1.3,camStiffness:6});return}}let o=this.attractTime*.06,c=e.ball.pos,l=dn.set(Math.sin(o)*34,13+Math.sin(o*.7)*4,Math.cos(o)*44);Vc(l,1),this.rigs[0].setView(t,l,wr.copy(c).multiplyScalar(.7),2);return}this.locals.forEach((a,o)=>{let c=e.cars[this.match.cars.indexOf(a.car)];if(!c)return;let[l]=this.input.lookStick(o,this.splitscreen);if(this.rigs[o].swivel+=(l*Math.PI-this.rigs[o].swivel)*Math.min(1,t*10),c.demolished){this.rigs[o].setView(t,this.rigs[o].pos,e.ball.pos,2);return}this.rigs[o].follow(t,c,e.ball.hidden?null:e.ball.pos,r)})}};function Qp(){try{let s=document.createElement("canvas");if(!(s.getContext("webgl2")||s.getContext("webgl")))throw new Error("WebGL indisponible")}catch{let t=document.createElement("div");t.id="webgl-error",t.innerHTML="<div><h2>WebGL est d\xE9sactiv\xE9</h2><p>Active l'acc\xE9l\xE9ration mat\xE9rielle de ton navigateur (Chrome, Edge ou Firefox) puis recharge la page.</p></div>",document.body.appendChild(t);return}window.app=new Bu}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Qp):Qp();})();
/*! Bundled license information:

three/build/three.core.js:
three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2026 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
