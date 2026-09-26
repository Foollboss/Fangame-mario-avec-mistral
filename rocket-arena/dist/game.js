(()=>{var Ud=0,Ph=1,Fd=2;var rs=1,Bd=2,js=3,Bi=0,qe=1,Oe=2,Cn=0,Oi=1,gn=2,Ih=3,Lh=4,Od=5;var as=100,zd=101,kd=102,Vd=103,Hd=104,Gd=200,Wd=201,Xd=202,qd=203,Dh=204,Nh=205,Yd=206,$d=207,Jd=208,Zd=209,Kd=210,jd=211,Qd=212,tf=213,ef=214,Fo=0,Bo=1,Oo=2,zs=3,zo=4,ko=5,Vo=6,Ho=7,Uh=0,nf=1,sf=2,Gn=0,Ta=1,Ea=2,wa=3,os=4,Aa=5,Ra=6,Ca=7;var Fh=300,zi=301,ls=302,vl=303,yl=304,Pa=306,pi=1e3,Zn=1001,Go=1002,We=1003,rf=1004;var Ia=1005;var Ke=1006,Ml=1007;var ki=1008;var xn=1009,Bh=1010,Oh=1011,Qs=1012,bl=1013,Wn=1014,Pn=1015,ze=1016,Sl=1017,Tl=1018,tr=1020,zh=35902,kh=35899,Vh=1021,Hh=1022,In=1023,Qn=1026,Vi=1027,El=1028,wl=1029,Hi=1030,Al=1031;var Rl=1033,La=33776,Da=33777,Na=33778,Ua=33779,Cl=35840,Pl=35841,Il=35842,Ll=35843,Dl=36196,Nl=37492,Ul=37496,Fl=37488,Bl=37489,Fa=37490,Ol=37491,zl=37808,kl=37809,Vl=37810,Hl=37811,Gl=37812,Wl=37813,Xl=37814,ql=37815,Yl=37816,$l=37817,Jl=37818,Zl=37819,Kl=37820,jl=37821,Ql=36492,tc=36494,ec=36495,nc=36283,ic=36284,Ba=36285,sc=36286;var Vr=2300,Wo=2301,No=2302,_h=2303,vh=2400,yh=2401,Mh=2402;var af=3200;var rc=0,of=1,_i="",Ge="srgb",Hr="srgb-linear",Gr="linear",le="srgb";var Uo=7680;var lf=519,cf=512,hf=513,uf=514,ac=515,df=516,ff=517,oc=518,pf=519,Gh=35044,er=35048;var Wh="300 es",Vn=2e3,ks=2001;function mm(s){for(let t=s.length-1;t>=0;--t)if(s[t]>=65535)return!0;return!1}function gm(s){return ArrayBuffer.isView(s)&&!(s instanceof DataView)}function Wr(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function mf(){let s=Wr("canvas");return s.style.display="block",s}var ed={},Vs=null;function Xr(...s){let t="THREE."+s.shift();Vs?Vs("log",t,...s):console.log(t,...s)}function gf(s){let t=s[0];if(typeof t=="string"&&t.startsWith("TSL:")){let e=s[1];e&&e.isStackTrace?s[0]+=" "+e.getLocation():s[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return s}function Vt(...s){s=gf(s);let t="THREE."+s.shift();if(Vs)Vs("warn",t,...s);else{let e=s[0];e&&e.isStackTrace?console.warn(e.getError(t)):console.warn(t,...s)}}function Ht(...s){s=gf(s);let t="THREE."+s.shift();if(Vs)Vs("error",t,...s);else{let e=s[0];e&&e.isStackTrace?console.error(e.getError(t)):console.error(t,...s)}}function Qi(...s){let t=s.join(" ");t in ed||(ed[t]=!0,Vt(...s))}function xf(s,t,e){return new Promise(function(n,i){function r(){switch(s.clientWaitSync(t,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:i();break;case s.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}var _f={[Fo]:Bo,[Oo]:Vo,[zo]:Ho,[zs]:ko,[Bo]:Fo,[Vo]:Oo,[Ho]:zo,[ko]:zs},ti=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){let n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){let n=this._listeners;if(n===void 0)return;let i=n[t];if(i!==void 0){let r=i.indexOf(e);r!==-1&&i.splice(r,1)}}dispatchEvent(t){let e=this._listeners;if(e===void 0)return;let n=e[t.type];if(n!==void 0){t.target=this;let i=n.slice(0);for(let r=0,a=i.length;r<a;r++)i[r].call(this,t);t.target=null}}},en=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],nd=1234567,Br=Math.PI/180,Hs=180/Math.PI;function jn(){let s=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(en[s&255]+en[s>>8&255]+en[s>>16&255]+en[s>>24&255]+"-"+en[t&255]+en[t>>8&255]+"-"+en[t>>16&15|64]+en[t>>24&255]+"-"+en[e&63|128]+en[e>>8&255]+"-"+en[e>>16&255]+en[e>>24&255]+en[n&255]+en[n>>8&255]+en[n>>16&255]+en[n>>24&255]).toLowerCase()}function Qt(s,t,e){return Math.max(t,Math.min(e,s))}function Xh(s,t){return(s%t+t)%t}function xm(s,t,e,n,i){return n+(s-t)*(i-n)/(e-t)}function _m(s,t,e){return s!==t?(e-s)/(t-s):0}function Or(s,t,e){return(1-e)*s+e*t}function vm(s,t,e,n){return Or(s,t,1-Math.exp(-e*n))}function ym(s,t=1){return t-Math.abs(Xh(s,t*2)-t)}function Mm(s,t,e){return s<=t?0:s>=e?1:(s=(s-t)/(e-t),s*s*(3-2*s))}function bm(s,t,e){return s<=t?0:s>=e?1:(s=(s-t)/(e-t),s*s*s*(s*(s*6-15)+10))}function Sm(s,t){return s+Math.floor(Math.random()*(t-s+1))}function Tm(s,t){return s+Math.random()*(t-s)}function Em(s){return s*(.5-Math.random())}function wm(s){s!==void 0&&(nd=s);let t=nd+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Am(s){return s*Br}function Rm(s){return s*Hs}function Cm(s){return s>0&&Number.isInteger(s)&&2**Math.round(Math.log2(s))===s}function Pm(s){return Math.pow(2,Math.ceil(Math.log(s)/Math.LN2))}function Im(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function Lm(s,t,e,n,i){let r=Math.cos,a=Math.sin,o=r(e/2),c=a(e/2),l=r((t+n)/2),h=a((t+n)/2),d=r((t-n)/2),u=a((t-n)/2),f=r((n-t)/2),m=a((n-t)/2);switch(i){case"XYX":s.set(o*h,c*d,c*u,o*l);break;case"YZY":s.set(c*u,o*h,c*d,o*l);break;case"ZXZ":s.set(c*d,c*u,o*h,o*l);break;case"XZX":s.set(o*h,c*m,c*f,o*l);break;case"YXY":s.set(c*f,o*h,c*m,o*l);break;case"ZYZ":s.set(c*m,c*f,o*h,o*l);break;default:Vt("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function kn(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:case Uint8ClampedArray:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function me(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}var dn={DEG2RAD:Br,RAD2DEG:Hs,generateUUID:jn,clamp:Qt,euclideanModulo:Xh,mapLinear:xm,inverseLerp:_m,lerp:Or,damp:vm,pingpong:ym,smoothstep:Mm,smootherstep:bm,randInt:Sm,randFloat:Tm,randFloatSpread:Em,seededRandom:wm,degToRad:Am,radToDeg:Rm,isPowerOfTwo:Cm,ceilPowerOfTwo:Pm,floorPowerOfTwo:Im,setQuaternionFromProperEuler:Lm,normalize:me,denormalize:kn},Kh=class Kh{constructor(t=0,e=0){this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("THREE.Vector2: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,n=this.y,i=t.elements;return this.x=i[0]*e+i[3]*n+i[6],this.y=i[1]*e+i[4]*n+i[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Qt(this.x,t.x,e.x),this.y=Qt(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=Qt(this.x,t,e),this.y=Qt(this.y,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Qt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(Qt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let n=Math.cos(e),i=Math.sin(e),r=this.x-t.x,a=this.y-t.y;return this.x=r*n-a*i+t.x,this.y=r*i+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};Kh.prototype.isVector2=!0;var it=Kh,re=class{constructor(t=0,e=0,n=0,i=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=i}static slerpFlat(t,e,n,i,r,a,o){let c=n[i+0],l=n[i+1],h=n[i+2],d=n[i+3],u=r[a+0],f=r[a+1],m=r[a+2],x=r[a+3];if(d!==x||c!==u||l!==f||h!==m){let g=c*u+l*f+h*m+d*x;g<0&&(u=-u,f=-f,m=-m,x=-x,g=-g);let p=1-o;if(g<.9995){let M=Math.acos(g),S=Math.sin(M);p=Math.sin(p*M)/S,o=Math.sin(o*M)/S,c=c*p+u*o,l=l*p+f*o,h=h*p+m*o,d=d*p+x*o}else{c=c*p+u*o,l=l*p+f*o,h=h*p+m*o,d=d*p+x*o;let M=1/Math.sqrt(c*c+l*l+h*h+d*d);c*=M,l*=M,h*=M,d*=M}}t[e]=c,t[e+1]=l,t[e+2]=h,t[e+3]=d}static multiplyQuaternionsFlat(t,e,n,i,r,a){let o=n[i],c=n[i+1],l=n[i+2],h=n[i+3],d=r[a],u=r[a+1],f=r[a+2],m=r[a+3];return t[e]=o*m+h*d+c*f-l*u,t[e+1]=c*m+h*u+l*d-o*f,t[e+2]=l*m+h*f+o*u-c*d,t[e+3]=h*m-o*d-c*u-l*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,i){return this._x=t,this._y=e,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){let n=t._x,i=t._y,r=t._z,a=t._order,o=Math.cos,c=Math.sin,l=o(n/2),h=o(i/2),d=o(r/2),u=c(n/2),f=c(i/2),m=c(r/2);switch(a){case"XYZ":this._x=u*h*d+l*f*m,this._y=l*f*d-u*h*m,this._z=l*h*m+u*f*d,this._w=l*h*d-u*f*m;break;case"YXZ":this._x=u*h*d+l*f*m,this._y=l*f*d-u*h*m,this._z=l*h*m-u*f*d,this._w=l*h*d+u*f*m;break;case"ZXY":this._x=u*h*d-l*f*m,this._y=l*f*d+u*h*m,this._z=l*h*m+u*f*d,this._w=l*h*d-u*f*m;break;case"ZYX":this._x=u*h*d-l*f*m,this._y=l*f*d+u*h*m,this._z=l*h*m-u*f*d,this._w=l*h*d+u*f*m;break;case"YZX":this._x=u*h*d+l*f*m,this._y=l*f*d+u*h*m,this._z=l*h*m-u*f*d,this._w=l*h*d-u*f*m;break;case"XZY":this._x=u*h*d-l*f*m,this._y=l*f*d-u*h*m,this._z=l*h*m+u*f*d,this._w=l*h*d+u*f*m;break;default:Vt("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let n=e/2,i=Math.sin(n);return this._x=t.x*i,this._y=t.y*i,this._z=t.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,n=e[0],i=e[4],r=e[8],a=e[1],o=e[5],c=e[9],l=e[2],h=e[6],d=e[10],u=n+o+d;if(u>0){let f=.5/Math.sqrt(u+1);this._w=.25/f,this._x=(h-c)*f,this._y=(r-l)*f,this._z=(a-i)*f}else if(n>o&&n>d){let f=2*Math.sqrt(1+n-o-d);this._w=(h-c)/f,this._x=.25*f,this._y=(i+a)/f,this._z=(r+l)/f}else if(o>d){let f=2*Math.sqrt(1+o-n-d);this._w=(r-l)/f,this._x=(i+a)/f,this._y=.25*f,this._z=(c+h)/f}else{let f=2*Math.sqrt(1+d-n-o);this._w=(a-i)/f,this._x=(r+l)/f,this._y=(c+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Qt(this.dot(t),-1,1)))}rotateTowards(t,e){let n=this.angleTo(t);if(n===0)return this;let i=Math.min(1,e/n);return this.slerp(t,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let n=t._x,i=t._y,r=t._z,a=t._w,o=e._x,c=e._y,l=e._z,h=e._w;return this._x=n*h+a*o+i*l-r*c,this._y=i*h+a*c+r*o-n*l,this._z=r*h+a*l+n*c-i*o,this._w=a*h-n*o-i*c-r*l,this._onChangeCallback(),this}slerp(t,e){let n=t._x,i=t._y,r=t._z,a=t._w,o=this.dot(t);o<0&&(n=-n,i=-i,r=-r,a=-a,o=-o);let c=1-e;if(o<.9995){let l=Math.acos(o),h=Math.sin(l);c=Math.sin(c*l)/h,e=Math.sin(e*l)/h,this._x=this._x*c+n*e,this._y=this._y*c+i*e,this._z=this._z*c+r*e,this._w=this._w*c+a*e,this._onChangeCallback()}else this._x=this._x*c+n*e,this._y=this._y*c+i*e,this._z=this._z*c+r*e,this._w=this._w*c+a*e,this.normalize();return this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){let t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(i*Math.sin(t),i*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},jh=class jh{constructor(t=0,e=0,n=0){this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("THREE.Vector3: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(id.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(id.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,n=this.y,i=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*i,this.y=r[1]*e+r[4]*n+r[7]*i,this.z=r[2]*e+r[5]*n+r[8]*i,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,n=this.y,i=this.z,r=t.elements,a=1/(r[3]*e+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*i+r[12])*a,this.y=(r[1]*e+r[5]*n+r[9]*i+r[13])*a,this.z=(r[2]*e+r[6]*n+r[10]*i+r[14])*a,this}applyQuaternion(t){let e=this.x,n=this.y,i=this.z,r=t.x,a=t.y,o=t.z,c=t.w,l=2*(a*i-o*n),h=2*(o*e-r*i),d=2*(r*n-a*e);return this.x=e+c*l+a*d-o*h,this.y=n+c*h+o*l-r*d,this.z=i+c*d+r*h-a*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,n=this.y,i=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*i,this.y=r[1]*e+r[5]*n+r[9]*i,this.z=r[2]*e+r[6]*n+r[10]*i,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Qt(this.x,t.x,e.x),this.y=Qt(this.y,t.y,e.y),this.z=Qt(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=Qt(this.x,t,e),this.y=Qt(this.y,t,e),this.z=Qt(this.z,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Qt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let n=t.x,i=t.y,r=t.z,a=e.x,o=e.y,c=e.z;return this.x=i*c-r*o,this.y=r*a-n*c,this.z=n*o-i*a,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Yc.copy(this).projectOnVector(t),this.sub(Yc)}reflect(t){return this.sub(Yc.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(Qt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y,i=this.z-t.z;return e*e+n*n+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){let i=Math.sin(e)*t;return this.x=i*Math.sin(n),this.y=Math.cos(e)*t,this.z=i*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),i=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=i,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};jh.prototype.isVector3=!0;var w=jh,Yc=new w,id=new re,Qh=class Qh{constructor(t,e,n,i,r,a,o,c,l){this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,i,r,a,o,c,l)}set(t,e,n,i,r,a,o,c,l){let h=this.elements;return h[0]=t,h[1]=i,h[2]=o,h[3]=e,h[4]=r,h[5]=c,h[6]=n,h[7]=a,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,i=e.elements,r=this.elements,a=n[0],o=n[3],c=n[6],l=n[1],h=n[4],d=n[7],u=n[2],f=n[5],m=n[8],x=i[0],g=i[3],p=i[6],M=i[1],S=i[4],y=i[7],T=i[2],E=i[5],C=i[8];return r[0]=a*x+o*M+c*T,r[3]=a*g+o*S+c*E,r[6]=a*p+o*y+c*C,r[1]=l*x+h*M+d*T,r[4]=l*g+h*S+d*E,r[7]=l*p+h*y+d*C,r[2]=u*x+f*M+m*T,r[5]=u*g+f*S+m*E,r[8]=u*p+f*y+m*C,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],a=t[4],o=t[5],c=t[6],l=t[7],h=t[8];return e*a*h-e*o*l-n*r*h+n*o*c+i*r*l-i*a*c}invert(){let t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],a=t[4],o=t[5],c=t[6],l=t[7],h=t[8],d=h*a-o*l,u=o*c-h*r,f=l*r-a*c,m=e*d+n*u+i*f;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);let x=1/m;return t[0]=d*x,t[1]=(i*l-h*n)*x,t[2]=(o*n-i*a)*x,t[3]=u*x,t[4]=(h*e-i*c)*x,t[5]=(i*r-o*e)*x,t[6]=f*x,t[7]=(n*c-l*e)*x,t[8]=(a*e-n*r)*x,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,i,r,a,o){let c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*a+l*o)+a+t,-i*l,i*c,-i*(-l*a+c*o)+o+e,0,0,1),this}scale(t,e){return Qi("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply($c.makeScale(t,e)),this}rotate(t){return Qi("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply($c.makeRotation(-t)),this}translate(t,e){return Qi("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply($c.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,n=t.elements;for(let i=0;i<9;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}};Qh.prototype.isMatrix3=!0;var Yt=Qh,$c=new Yt,sd=new Yt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),rd=new Yt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Dm(){let s={enabled:!0,workingColorSpace:Hr,spaces:{},convert:function(i,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===le&&(i.r=fi(i.r),i.g=fi(i.g),i.b=fi(i.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(i.applyMatrix3(this.spaces[r].toXYZ),i.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===le&&(i.r=Os(i.r),i.g=Os(i.g),i.b=Os(i.b))),i},workingToColorSpace:function(i,r){return this.convert(i,this.workingColorSpace,r)},colorSpaceToWorking:function(i,r){return this.convert(i,r,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===_i?Gr:this.spaces[i].transfer},getToneMappingMode:function(i){return this.spaces[i].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(i,r=this.workingColorSpace){return i.fromArray(this.spaces[r].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,r,a){return i.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(i,r){return Qi("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),s.workingToColorSpace(i,r)},toWorkingColorSpace:function(i,r){return Qi("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),s.colorSpaceToWorking(i,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return s.define({[Hr]:{primaries:t,whitePoint:n,transfer:Gr,toXYZ:sd,fromXYZ:rd,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:Ge},outputColorSpaceConfig:{drawingBufferColorSpace:Ge}},[Ge]:{primaries:t,whitePoint:n,transfer:le,toXYZ:sd,fromXYZ:rd,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:Ge}}}),s}var te=Dm();function fi(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function Os(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}var ys,Xo=class{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{ys===void 0&&(ys=Wr("canvas")),ys.width=t.width,ys.height=t.height;let i=ys.getContext("2d");t instanceof ImageData?i.putImageData(t,0,0):i.drawImage(t,0,0,t.width,t.height),n=ys}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=Wr("canvas");e.width=t.width,e.height=t.height;let n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);let i=n.getImageData(0,0,t.width,t.height),r=i.data;for(let a=0;a<r.length;a++)r[a]=fi(r[a]/255)*255;return n.putImageData(i,0,0),e}else if(t.data){let e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(fi(e[n]/255)*255):e[n]=fi(e[n]);return{data:e,width:t.width,height:t.height}}else return Vt("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},Nm=0,Gs=class{constructor(t=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:Nm++}),this.uuid=jn(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){let e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):typeof VideoFrame<"u"&&e instanceof VideoFrame?t.set(e.displayWidth,e.displayHeight,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let a=0,o=i.length;a<o;a++)i[a].isDataTexture?r.push(Jc(i[a].image)):r.push(Jc(i[a]))}else r=Jc(i);n.url=r}return e||(t.images[this.uuid]=n),n}};function Jc(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?Xo.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(Vt("Texture: Unable to serialize Texture."),{})}var Um=0,Zc=new w,un=class s extends ti{constructor(t=s.DEFAULT_IMAGE,e=s.DEFAULT_MAPPING,n=Zn,i=Zn,r=Ke,a=ki,o=In,c=xn,l=s.DEFAULT_ANISOTROPY,h=_i){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Um++}),this.uuid=jn(),this.name="",this.source=new Gs(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new it(0,0),this.repeat=new it(1,1),this.center=new it(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Yt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Zc).x}get height(){return this.source.getSize(Zc).y}get depth(){return this.source.getSize(Zc).z}get image(){return this.source.data}set image(t){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.normalized=t.normalized,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(let e in t){let n=t[e];if(n===void 0){Vt(`Texture.setValues(): parameter '${e}' has value of undefined.`);continue}let i=this[e];if(i===void 0){Vt(`Texture.setValues(): property '${e}' does not exist.`);continue}i&&n&&i.isVector2&&n.isVector2||i&&n&&i.isVector3&&n.isVector3||i&&n&&i.isMatrix3&&n.isMatrix3?i.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Fh)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case pi:t.x=t.x-Math.floor(t.x);break;case Zn:t.x=t.x<0?0:1;break;case Go:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case pi:t.y=t.y-Math.floor(t.y);break;case Zn:t.y=t.y<0?0:1;break;case Go:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}};un.DEFAULT_IMAGE=null;un.DEFAULT_MAPPING=Fh;un.DEFAULT_ANISOTROPY=1;var tu=class tu{constructor(t=0,e=0,n=0,i=1){this.x=t,this.y=e,this.z=n,this.w=i}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,i){return this.x=t,this.y=e,this.z=n,this.w=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("THREE.Vector4: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,n=this.y,i=this.z,r=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*i+a[12]*r,this.y=a[1]*e+a[5]*n+a[9]*i+a[13]*r,this.z=a[2]*e+a[6]*n+a[10]*i+a[14]*r,this.w=a[3]*e+a[7]*n+a[11]*i+a[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,i,r,c=t.elements,l=c[0],h=c[4],d=c[8],u=c[1],f=c[5],m=c[9],x=c[2],g=c[6],p=c[10];if(Math.abs(h-u)<.01&&Math.abs(d-x)<.01&&Math.abs(m-g)<.01){if(Math.abs(h+u)<.1&&Math.abs(d+x)<.1&&Math.abs(m+g)<.1&&Math.abs(l+f+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let S=(l+1)/2,y=(f+1)/2,T=(p+1)/2,E=(h+u)/4,C=(d+x)/4,v=(m+g)/4;return S>y&&S>T?S<.01?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(S),i=E/n,r=C/n):y>T?y<.01?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(y),n=E/i,r=v/i):T<.01?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(T),n=C/r,i=v/r),this.set(n,i,r,e),this}let M=Math.sqrt((g-m)*(g-m)+(d-x)*(d-x)+(u-h)*(u-h));return Math.abs(M)<.001&&(M=1),this.x=(g-m)/M,this.y=(d-x)/M,this.z=(u-h)/M,this.w=Math.acos((l+f+p-1)/2),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Qt(this.x,t.x,e.x),this.y=Qt(this.y,t.y,e.y),this.z=Qt(this.z,t.z,e.z),this.w=Qt(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=Qt(this.x,t,e),this.y=Qt(this.y,t,e),this.z=Qt(this.z,t,e),this.w=Qt(this.w,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Qt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};tu.prototype.isVector4=!0;var Ae=tu,qo=class extends ti{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ke,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new Ae(0,0,t,e),this.scissorTest=!1,this.viewport=new Ae(0,0,t,e),this.textures=[];let i={width:t,height:e,depth:n.depth},r=new un(i),a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(t={}){let e={minFilter:Ke,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),t!==null&&t.renderTarget===null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let i=0,r=this.textures.length;i<r;i++)this.textures[i].image.width=t,this.textures[i].image.height=e,this.textures[i].image.depth=n,this.textures[i].isData3DTexture!==!0&&(this.textures[i].isArrayTexture=this.textures[i].image.depth>1);this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;let i=Object.assign({},t.textures[e].image);this.textures[e].source=new Gs(i)}if(this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveColorBuffer=t.resolveColorBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,this.storeMultisampledColorBuffer=t.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=t.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=t.storeMultisampledStencilBuffer,t.depthTexture!==null)if(t.depthTexture.renderTarget===t){let e=t.depthTexture.clone();e.renderTarget=null,this.depthTexture=e}else this.depthTexture=t.depthTexture;return this.samples=t.samples,this.multiview=t.multiview,this.useArrayDepthTexture=t.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},Le=class extends qo{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}},qr=class extends un{constructor(t=null,e=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=We,this.minFilter=We,this.wrapR=Zn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}};var Yo=class extends un{constructor(t=null,e=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=We,this.minFilter=We,this.wrapR=Zn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}};var _l=class _l{constructor(t,e,n,i,r,a,o,c,l,h,d,u,f,m,x,g){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,i,r,a,o,c,l,h,d,u,f,m,x,g)}set(t,e,n,i,r,a,o,c,l,h,d,u,f,m,x,g){let p=this.elements;return p[0]=t,p[4]=e,p[8]=n,p[12]=i,p[1]=r,p[5]=a,p[9]=o,p[13]=c,p[2]=l,p[6]=h,p[10]=d,p[14]=u,p[3]=f,p[7]=m,p[11]=x,p[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new _l().fromArray(this.elements)}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){let e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return this.determinantAffine()===0?(t.set(1,0,0),e.set(0,1,0),n.set(0,0,1),this):(t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){if(t.determinantAffine()===0)return this.identity();let e=this.elements,n=t.elements,i=1/Ms.setFromMatrixColumn(t,0).length(),r=1/Ms.setFromMatrixColumn(t,1).length(),a=1/Ms.setFromMatrixColumn(t,2).length();return e[0]=n[0]*i,e[1]=n[1]*i,e[2]=n[2]*i,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,n=t.x,i=t.y,r=t.z,a=Math.cos(n),o=Math.sin(n),c=Math.cos(i),l=Math.sin(i),h=Math.cos(r),d=Math.sin(r);if(t.order==="XYZ"){let u=a*h,f=a*d,m=o*h,x=o*d;e[0]=c*h,e[4]=-c*d,e[8]=l,e[1]=f+m*l,e[5]=u-x*l,e[9]=-o*c,e[2]=x-u*l,e[6]=m+f*l,e[10]=a*c}else if(t.order==="YXZ"){let u=c*h,f=c*d,m=l*h,x=l*d;e[0]=u+x*o,e[4]=m*o-f,e[8]=a*l,e[1]=a*d,e[5]=a*h,e[9]=-o,e[2]=f*o-m,e[6]=x+u*o,e[10]=a*c}else if(t.order==="ZXY"){let u=c*h,f=c*d,m=l*h,x=l*d;e[0]=u-x*o,e[4]=-a*d,e[8]=m+f*o,e[1]=f+m*o,e[5]=a*h,e[9]=x-u*o,e[2]=-a*l,e[6]=o,e[10]=a*c}else if(t.order==="ZYX"){let u=a*h,f=a*d,m=o*h,x=o*d;e[0]=c*h,e[4]=m*l-f,e[8]=u*l+x,e[1]=c*d,e[5]=x*l+u,e[9]=f*l-m,e[2]=-l,e[6]=o*c,e[10]=a*c}else if(t.order==="YZX"){let u=a*c,f=a*l,m=o*c,x=o*l;e[0]=c*h,e[4]=x-u*d,e[8]=m*d+f,e[1]=d,e[5]=a*h,e[9]=-o*h,e[2]=-l*h,e[6]=f*d+m,e[10]=u-x*d}else if(t.order==="XZY"){let u=a*c,f=a*l,m=o*c,x=o*l;e[0]=c*h,e[4]=-d,e[8]=l*h,e[1]=u*d+x,e[5]=a*h,e[9]=f*d-m,e[2]=m*d-f,e[6]=o*h,e[10]=x*d+u}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Fm,t,Bm)}lookAt(t,e,n){let i=this.elements;return vn.subVectors(t,e),vn.lengthSq()===0&&(vn.z=1),vn.normalize(),wi.crossVectors(n,vn),wi.lengthSq()===0&&(Math.abs(n.z)===1?vn.x+=1e-4:vn.z+=1e-4,vn.normalize(),wi.crossVectors(n,vn)),wi.normalize(),ao.crossVectors(vn,wi),i[0]=wi.x,i[4]=ao.x,i[8]=vn.x,i[1]=wi.y,i[5]=ao.y,i[9]=vn.y,i[2]=wi.z,i[6]=ao.z,i[10]=vn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,i=e.elements,r=this.elements,a=n[0],o=n[4],c=n[8],l=n[12],h=n[1],d=n[5],u=n[9],f=n[13],m=n[2],x=n[6],g=n[10],p=n[14],M=n[3],S=n[7],y=n[11],T=n[15],E=i[0],C=i[4],v=i[8],A=i[12],I=i[1],D=i[5],B=i[9],V=i[13],P=i[2],L=i[6],X=i[10],k=i[14],Z=i[3],z=i[7],q=i[11],$=i[15];return r[0]=a*E+o*I+c*P+l*Z,r[4]=a*C+o*D+c*L+l*z,r[8]=a*v+o*B+c*X+l*q,r[12]=a*A+o*V+c*k+l*$,r[1]=h*E+d*I+u*P+f*Z,r[5]=h*C+d*D+u*L+f*z,r[9]=h*v+d*B+u*X+f*q,r[13]=h*A+d*V+u*k+f*$,r[2]=m*E+x*I+g*P+p*Z,r[6]=m*C+x*D+g*L+p*z,r[10]=m*v+x*B+g*X+p*q,r[14]=m*A+x*V+g*k+p*$,r[3]=M*E+S*I+y*P+T*Z,r[7]=M*C+S*D+y*L+T*z,r[11]=M*v+S*B+y*X+T*q,r[15]=M*A+S*V+y*k+T*$,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[4],i=t[8],r=t[12],a=t[1],o=t[5],c=t[9],l=t[13],h=t[2],d=t[6],u=t[10],f=t[14],m=t[3],x=t[7],g=t[11],p=t[15],M=c*f-l*u,S=o*f-l*d,y=o*u-c*d,T=a*f-l*h,E=a*u-c*h,C=a*d-o*h;return e*(x*M-g*S+p*y)-n*(m*M-g*T+p*E)+i*(m*S-x*T+p*C)-r*(m*y-x*E+g*C)}determinantAffine(){let t=this.elements,e=t[0],n=t[4],i=t[8],r=t[1],a=t[5],o=t[9],c=t[2],l=t[6],h=t[10];return e*(a*h-o*l)-n*(r*h-o*c)+i*(r*l-a*c)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){let i=this.elements;return t.isVector3?(i[12]=t.x,i[13]=t.y,i[14]=t.z):(i[12]=t,i[13]=e,i[14]=n),this}invert(){let t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],a=t[4],o=t[5],c=t[6],l=t[7],h=t[8],d=t[9],u=t[10],f=t[11],m=t[12],x=t[13],g=t[14],p=t[15],M=e*o-n*a,S=e*c-i*a,y=e*l-r*a,T=n*c-i*o,E=n*l-r*o,C=i*l-r*c,v=h*x-d*m,A=h*g-u*m,I=h*p-f*m,D=d*g-u*x,B=d*p-f*x,V=u*p-f*g,P=M*V-S*B+y*D+T*I-E*A+C*v;if(P===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let L=1/P;return t[0]=(o*V-c*B+l*D)*L,t[1]=(i*B-n*V-r*D)*L,t[2]=(x*C-g*E+p*T)*L,t[3]=(u*E-d*C-f*T)*L,t[4]=(c*I-a*V-l*A)*L,t[5]=(e*V-i*I+r*A)*L,t[6]=(g*y-m*C-p*S)*L,t[7]=(h*C-u*y+f*S)*L,t[8]=(a*B-o*I+l*v)*L,t[9]=(n*I-e*B-r*v)*L,t[10]=(m*E-x*y+p*M)*L,t[11]=(d*y-h*E-f*M)*L,t[12]=(o*A-a*D-c*v)*L,t[13]=(e*D-n*A+i*v)*L,t[14]=(x*S-m*T-g*M)*L,t[15]=(h*T-d*S+u*M)*L,this}scale(t){let e=this.elements,n=t.x,i=t.y,r=t.z;return e[0]*=n,e[4]*=i,e[8]*=r,e[1]*=n,e[5]*=i,e[9]*=r,e[2]*=n,e[6]*=i,e[10]*=r,e[3]*=n,e[7]*=i,e[11]*=r,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],i=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,i))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let n=Math.cos(e),i=Math.sin(e),r=1-n,a=t.x,o=t.y,c=t.z,l=r*a,h=r*o;return this.set(l*a+n,l*o-i*c,l*c+i*o,0,l*o+i*c,h*o+n,h*c-i*a,0,l*c-i*o,h*c+i*a,r*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,i,r,a){return this.set(1,n,r,0,t,1,a,0,e,i,1,0,0,0,0,1),this}compose(t,e,n){let i=this.elements,r=e._x,a=e._y,o=e._z,c=e._w,l=r+r,h=a+a,d=o+o,u=r*l,f=r*h,m=r*d,x=a*h,g=a*d,p=o*d,M=c*l,S=c*h,y=c*d,T=n.x,E=n.y,C=n.z;return i[0]=(1-(x+p))*T,i[1]=(f+y)*T,i[2]=(m-S)*T,i[3]=0,i[4]=(f-y)*E,i[5]=(1-(u+p))*E,i[6]=(g+M)*E,i[7]=0,i[8]=(m+S)*C,i[9]=(g-M)*C,i[10]=(1-(u+x))*C,i[11]=0,i[12]=t.x,i[13]=t.y,i[14]=t.z,i[15]=1,this}decompose(t,e,n){let i=this.elements;t.x=i[12],t.y=i[13],t.z=i[14];let r=this.determinantAffine();if(r===0)return n.set(1,1,1),e.identity(),this;let a=Ms.set(i[0],i[1],i[2]).length(),o=Ms.set(i[4],i[5],i[6]).length(),c=Ms.set(i[8],i[9],i[10]).length();r<0&&(a=-a),Fn.copy(this);let l=1/a,h=1/o,d=1/c;return Fn.elements[0]*=l,Fn.elements[1]*=l,Fn.elements[2]*=l,Fn.elements[4]*=h,Fn.elements[5]*=h,Fn.elements[6]*=h,Fn.elements[8]*=d,Fn.elements[9]*=d,Fn.elements[10]*=d,e.setFromRotationMatrix(Fn),n.x=a,n.y=o,n.z=c,this}makePerspective(t,e,n,i,r,a,o=Vn,c=!1){let l=this.elements,h=2*r/(e-t),d=2*r/(n-i),u=(e+t)/(e-t),f=(n+i)/(n-i),m,x;if(c)m=r/(a-r),x=a*r/(a-r);else if(o===Vn)m=-(a+r)/(a-r),x=-2*a*r/(a-r);else if(o===ks)m=-a/(a-r),x=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=h,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=d,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=m,l[14]=x,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,i,r,a,o=Vn,c=!1){let l=this.elements,h=2/(e-t),d=2/(n-i),u=-(e+t)/(e-t),f=-(n+i)/(n-i),m,x;if(c)m=1/(a-r),x=a/(a-r);else if(o===Vn)m=-2/(a-r),x=-(a+r)/(a-r);else if(o===ks)m=-1/(a-r),x=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=h,l[4]=0,l[8]=0,l[12]=u,l[1]=0,l[5]=d,l[9]=0,l[13]=f,l[2]=0,l[6]=0,l[10]=m,l[14]=x,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){let e=this.elements,n=t.elements;for(let i=0;i<16;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}};_l.prototype.isMatrix4=!0;var oe=_l,Ms=new w,Fn=new oe,Fm=new w(0,0,0),Bm=new w(1,1,1),wi=new w,ao=new w,vn=new w,ad=new oe,od=new re,mi=class s{constructor(t=0,e=0,n=0,i=s.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=i}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,i=this._order){return this._x=t,this._y=e,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){let i=t.elements,r=i[0],a=i[4],o=i[8],c=i[1],l=i[5],h=i[9],d=i[2],u=i[6],f=i[10];switch(e){case"XYZ":this._y=Math.asin(Qt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(u,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Qt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(Qt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-d,f),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-Qt(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(u,f),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(Qt(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-Qt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(u,l),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:Vt("Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return ad.makeRotationFromQuaternion(t),this.setFromRotationMatrix(ad,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return od.setFromEuler(this),this.setFromQuaternion(od,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};mi.DEFAULT_ORDER="XYZ";var Yr=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},Om=0,ld=new w,bs=new re,oi=new oe,oo=new w,Ar=new w,zm=new w,km=new re,cd=new w(1,0,0),hd=new w(0,1,0),ud=new w(0,0,1),dd={type:"added"},Vm={type:"removed"},Ss={type:"childadded",child:null},Kc={type:"childremoved",child:null},Xe=class s extends ti{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Om++}),this.uuid=jn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=s.DEFAULT_UP.clone();let t=new w,e=new mi,n=new re,i=new w(1,1,1);function r(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new oe},normalMatrix:{value:new Yt}}),this.matrix=new oe,this.matrixWorld=new oe,this.matrixAutoUpdate=s.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=s.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Yr,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return bs.setFromAxisAngle(t,e),this.quaternion.multiply(bs),this}rotateOnWorldAxis(t,e){return bs.setFromAxisAngle(t,e),this.quaternion.premultiply(bs),this}rotateX(t){return this.rotateOnAxis(cd,t)}rotateY(t){return this.rotateOnAxis(hd,t)}rotateZ(t){return this.rotateOnAxis(ud,t)}translateOnAxis(t,e){return ld.copy(t).applyQuaternion(this.quaternion),this.position.add(ld.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(cd,t)}translateY(t){return this.translateOnAxis(hd,t)}translateZ(t){return this.translateOnAxis(ud,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(oi.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?oo.copy(t):oo.set(t,e,n);let i=this.parent;this.updateWorldMatrix(!0,!1),Ar.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?oi.lookAt(Ar,oo,this.up):oi.lookAt(oo,Ar,this.up),this.quaternion.setFromRotationMatrix(oi),i&&(oi.extractRotation(i.matrixWorld),bs.setFromRotationMatrix(oi),this.quaternion.premultiply(bs.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(Ht("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(dd),Ss.child=t,this.dispatchEvent(Ss),Ss.child=null):Ht("Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Vm),Kc.child=t,this.dispatchEvent(Kc),Kc.child=null),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),oi.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),oi.multiply(t.parent.matrixWorld)),t.applyMatrix4(oi),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(dd),Ss.child=t,this.dispatchEvent(Ss),Ss.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,i=this.children.length;n<i;n++){let a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);let i=this.children;for(let r=0,a=i.length;r<a;r++)i[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ar,t,zm),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ar,km,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(t){t(this);let e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let t=this.pivot;if(t!==null){let e=t.x,n=t.y,i=t.z,r=this.matrix.elements;r[12]+=e-r[0]*e-r[4]*n-r[8]*i,r[13]+=n-r[1]*e-r[5]*n-r[9]*i,r[14]+=i-r[2]*e-r[6]*n-r[10]*i}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e,n=!1){let i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),e===!0){let r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0,n)}}toJSON(t){let e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let i={};i.uuid=this.uuid,i.type=this.type,i.name=this.name,i.castShadow=this.castShadow,i.receiveShadow=this.receiveShadow,i.visible=this.visible,i.frustumCulled=this.frustumCulled,i.renderOrder=this.renderOrder,i.static=this.static,i.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.pivot!==null&&(i.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(i.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(i.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),i.instanceInfo=this._instanceInfo.map(o=>({...o})),i.availableInstanceIds=this._availableInstanceIds.slice(),i.availableGeometryIds=this._availableGeometryIds.slice(),i.nextIndexStart=this._nextIndexStart,i.nextVertexStart=this._nextVertexStart,i.geometryCount=this._geometryCount,i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.matricesTexture=this._matricesTexture.toJSON(t),i.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(i.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(i.boundingBox=this.boundingBox.toJSON()));function r(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(t.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let c=o.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){let d=c[l];r(t.shapes,d)}else r(t.shapes,c)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(r(t.materials,this.material[c]));i.material=o}else i.material=r(t.materials,this.material);if(this.children.length>0){i.children=[];for(let o=0;o<this.children.length;o++)i.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){i.animations=[];for(let o=0;o<this.animations.length;o++){let c=this.animations[o];i.animations.push(r(t.animations,c))}}if(e){let o=a(t.geometries),c=a(t.materials),l=a(t.textures),h=a(t.images),d=a(t.shapes),u=a(t.skeletons),f=a(t.animations),m=a(t.nodes);o.length>0&&(n.geometries=o),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),d.length>0&&(n.shapes=d),u.length>0&&(n.skeletons=u),f.length>0&&(n.animations=f),m.length>0&&(n.nodes=m)}return n.object=i,n;function a(o){let c=[];for(let l in o){let h=o[l];delete h.metadata,c.push(h)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.pivot=t.pivot!==null?t.pivot.clone():null,this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.static=t.static,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){let i=t.children[n];this.add(i.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};Xe.DEFAULT_UP=new w(0,1,0);Xe.DEFAULT_MATRIX_AUTO_UPDATE=!0;Xe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Ne=class extends Xe{constructor(){super(),this.isGroup=!0,this.type="Group"}},Hm={type:"move"},Ws=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ne,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ne,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new w,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new w),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ne,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new w,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new w,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let i=null,r=null,a=null,o=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){a=!0;for(let x of t.hand.values()){let g=e.getJointPose(x,n),p=this._getHandJoint(l,x);g!==null&&(p.matrix.fromArray(g.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=g.radius),p.visible=g!==null}let h=l.joints["index-finger-tip"],d=l.joints["thumb-tip"],u=h.position.distanceTo(d.position),f=.02,m=.005;l.inputState.pinching&&u>f+m?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&u<=f-m&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1,c.eventsEnabled&&c.dispatchEvent({type:"gripUpdated",data:t,target:this})));o!==null&&(i=e.getPose(t.targetRaySpace,n),i===null&&r!==null&&(i=r),i!==null&&(o.matrix.fromArray(i.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,i.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(i.linearVelocity)):o.hasLinearVelocity=!1,i.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(i.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Hm)))}return o!==null&&(o.visible=i!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let n=new Ne;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}},vf={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Ai={h:0,s:0,l:0},lo={h:0,s:0,l:0};function jc(s,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?s+(t-s)*6*e:e<1/2?t:e<2/3?s+(t-s)*6*(2/3-e):s}var lt=class{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){let i=t;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Ge){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,te.colorSpaceToWorking(this,e),this}setRGB(t,e,n,i=te.workingColorSpace){return this.r=t,this.g=e,this.b=n,te.colorSpaceToWorking(this,i),this}setHSL(t,e,n,i=te.workingColorSpace){if(t=Xh(t,1),e=Qt(e,0,1),n=Qt(n,0,1),e===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+e):n+e-n*e,a=2*n-r;this.r=jc(a,r,t+1/3),this.g=jc(a,r,t),this.b=jc(a,r,t-1/3)}return te.colorSpaceToWorking(this,i),this}setStyle(t,e=Ge){function n(r){r!==void 0&&parseFloat(r)<1&&Vt("Color: Alpha component of "+t+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(t)){let r,a=i[1],o=i[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:Vt("Color: Unknown color model "+t)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(t)){let r=i[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(r,16),e);Vt("Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Ge){let n=vf[t.toLowerCase()];return n!==void 0?this.setHex(n,e):Vt("Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=fi(t.r),this.g=fi(t.g),this.b=fi(t.b),this}copyLinearToSRGB(t){return this.r=Os(t.r),this.g=Os(t.g),this.b=Os(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Ge){return te.workingToColorSpace(nn.copy(this),t),Math.round(Qt(nn.r*255,0,255))*65536+Math.round(Qt(nn.g*255,0,255))*256+Math.round(Qt(nn.b*255,0,255))}getHexString(t=Ge){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=te.workingColorSpace){te.workingToColorSpace(nn.copy(this),e);let n=nn.r,i=nn.g,r=nn.b,a=Math.max(n,i,r),o=Math.min(n,i,r),c,l,h=(o+a)/2;if(o===a)c=0,l=0;else{let d=a-o;switch(l=h<=.5?d/(a+o):d/(2-a-o),a){case n:c=(i-r)/d+(i<r?6:0);break;case i:c=(r-n)/d+2;break;case r:c=(n-i)/d+4;break}c/=6}return t.h=c,t.s=l,t.l=h,t}getRGB(t,e=te.workingColorSpace){return te.workingToColorSpace(nn.copy(this),e),t.r=nn.r,t.g=nn.g,t.b=nn.b,t}getStyle(t=Ge){te.workingToColorSpace(nn.copy(this),t);let e=nn.r,n=nn.g,i=nn.b;return t!==Ge?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(t,e,n){return this.getHSL(Ai),this.setHSL(Ai.h+t,Ai.s+e,Ai.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Ai),t.getHSL(lo);let n=Or(Ai.h,lo.h,e),i=Or(Ai.s,lo.s,e),r=Or(Ai.l,lo.l,e);return this.setHSL(n,i,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,n=this.g,i=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*i,this.g=r[1]*e+r[4]*n+r[7]*i,this.b=r[2]*e+r[5]*n+r[8]*i,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},nn=new lt;lt.NAMES=vf;var $r=class s{constructor(t,e=1,n=1e3){this.isFog=!0,this.name="",this.color=new lt(t),this.near=e,this.far=n}clone(){return new s(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},ts=class extends Xe{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new mi,this.environmentIntensity=1,this.environmentRotation=new mi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),e.object.backgroundBlurriness=this.backgroundBlurriness,e.object.backgroundIntensity=this.backgroundIntensity,e.object.backgroundRotation=this.backgroundRotation.toArray(),e.object.environmentIntensity=this.environmentIntensity,e.object.environmentRotation=this.environmentRotation.toArray(),e}},Bn=new w,li=new w,Qc=new w,ci=new w,Ts=new w,Es=new w,fd=new w,th=new w,eh=new w,nh=new w,ih=new Ae,sh=new Ae,rh=new Ae,di=class s{constructor(t=new w,e=new w,n=new w){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,i){i.subVectors(n,e),Bn.subVectors(t,e),i.cross(Bn);let r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(t,e,n,i,r){Bn.subVectors(i,e),li.subVectors(n,e),Qc.subVectors(t,e);let a=Bn.dot(Bn),o=Bn.dot(li),c=Bn.dot(Qc),l=li.dot(li),h=li.dot(Qc),d=a*l-o*o;if(d===0)return r.set(0,0,0),null;let u=1/d,f=(l*c-o*h)*u,m=(a*h-o*c)*u;return r.set(1-f-m,m,f)}static containsPoint(t,e,n,i){return this.getBarycoord(t,e,n,i,ci)===null?!1:ci.x>=0&&ci.y>=0&&ci.x+ci.y<=1}static getInterpolation(t,e,n,i,r,a,o,c){return this.getBarycoord(t,e,n,i,ci)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,ci.x),c.addScaledVector(a,ci.y),c.addScaledVector(o,ci.z),c)}static getInterpolatedAttribute(t,e,n,i,r,a){return ih.setScalar(0),sh.setScalar(0),rh.setScalar(0),ih.fromBufferAttribute(t,e),sh.fromBufferAttribute(t,n),rh.fromBufferAttribute(t,i),a.setScalar(0),a.addScaledVector(ih,r.x),a.addScaledVector(sh,r.y),a.addScaledVector(rh,r.z),a}static isFrontFacing(t,e,n,i){return Bn.subVectors(n,e),li.subVectors(t,e),Bn.cross(li).dot(i)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,i){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[i]),this}setFromAttributeAndIndices(t,e,n,i){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,i),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Bn.subVectors(this.c,this.b),li.subVectors(this.a,this.b),Bn.cross(li).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return s.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return s.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,i,r){return s.getInterpolation(t,this.a,this.b,this.c,e,n,i,r)}containsPoint(t){return s.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return s.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let n=this.a,i=this.b,r=this.c,a,o;Ts.subVectors(i,n),Es.subVectors(r,n),th.subVectors(t,n);let c=Ts.dot(th),l=Es.dot(th);if(c<=0&&l<=0)return e.copy(n);eh.subVectors(t,i);let h=Ts.dot(eh),d=Es.dot(eh);if(h>=0&&d<=h)return e.copy(i);let u=c*d-h*l;if(u<=0&&c>=0&&h<=0)return a=c/(c-h),e.copy(n).addScaledVector(Ts,a);nh.subVectors(t,r);let f=Ts.dot(nh),m=Es.dot(nh);if(m>=0&&f<=m)return e.copy(r);let x=f*l-c*m;if(x<=0&&l>=0&&m<=0)return o=l/(l-m),e.copy(n).addScaledVector(Es,o);let g=h*m-f*d;if(g<=0&&d-h>=0&&f-m>=0)return fd.subVectors(r,i),o=(d-h)/(d-h+(f-m)),e.copy(i).addScaledVector(fd,o);let p=1/(g+x+u);return a=x*p,o=u*p,e.copy(n).addScaledVector(Ts,a).addScaledVector(Es,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},ei=class{constructor(t=new w(1/0,1/0,1/0),e=new w(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(On.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(On.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let n=On.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);let n=t.geometry;if(n!==void 0){let r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,On):On.fromBufferAttribute(r,a),On.applyMatrix4(t.matrixWorld),this.expandByPoint(On);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),co.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),co.copy(n.boundingBox)),co.applyMatrix4(t.matrixWorld),this.union(co)}let i=t.children;for(let r=0,a=i.length;r<a;r++)this.expandByObject(i[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,On),On.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Rr),ho.subVectors(this.max,Rr),ws.subVectors(t.a,Rr),As.subVectors(t.b,Rr),Rs.subVectors(t.c,Rr),Ri.subVectors(As,ws),Ci.subVectors(Rs,As),Ji.subVectors(ws,Rs);let e=[0,-Ri.z,Ri.y,0,-Ci.z,Ci.y,0,-Ji.z,Ji.y,Ri.z,0,-Ri.x,Ci.z,0,-Ci.x,Ji.z,0,-Ji.x,-Ri.y,Ri.x,0,-Ci.y,Ci.x,0,-Ji.y,Ji.x,0];return!ah(e,ws,As,Rs,ho)||(e=[1,0,0,0,1,0,0,0,1],!ah(e,ws,As,Rs,ho))?!1:(uo.crossVectors(Ri,Ci),e=[uo.x,uo.y,uo.z],ah(e,ws,As,Rs,ho))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,On).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(On).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(hi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),hi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),hi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),hi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),hi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),hi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),hi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),hi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(hi),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}},hi=[new w,new w,new w,new w,new w,new w,new w,new w],On=new w,co=new ei,ws=new w,As=new w,Rs=new w,Ri=new w,Ci=new w,Ji=new w,Rr=new w,ho=new w,uo=new w,Zi=new w;function ah(s,t,e,n,i){for(let r=0,a=s.length-3;r<=a;r+=3){Zi.fromArray(s,r);let o=i.x*Math.abs(Zi.x)+i.y*Math.abs(Zi.y)+i.z*Math.abs(Zi.z),c=t.dot(Zi),l=e.dot(Zi),h=n.dot(Zi);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>o)return!1}return!0}var Be=new w,fo=new it,Gm=0,Ue=class extends ti{constructor(t,e,n=!1){if(super(),Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Gm++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Gh,this.updateRanges=[],this.gpuType=Pn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[t+i]=e.array[n+i];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)fo.fromBufferAttribute(this,e),fo.applyMatrix3(t),this.setXY(e,fo.x,fo.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Be.fromBufferAttribute(this,e),Be.applyMatrix3(t),this.setXYZ(e,Be.x,Be.y,Be.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Be.fromBufferAttribute(this,e),Be.applyMatrix4(t),this.setXYZ(e,Be.x,Be.y,Be.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Be.fromBufferAttribute(this,e),Be.applyNormalMatrix(t),this.setXYZ(e,Be.x,Be.y,Be.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Be.fromBufferAttribute(this,e),Be.transformDirection(t),this.setXYZ(e,Be.x,Be.y,Be.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=kn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=me(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=kn(e,this.array)),e}setX(t,e){return this.normalized&&(e=me(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=kn(e,this.array)),e}setY(t,e){return this.normalized&&(e=me(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=kn(e,this.array)),e}setZ(t,e){return this.normalized&&(e=me(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=kn(e,this.array)),e}setW(t,e){return this.normalized&&(e=me(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=me(e,this.array),n=me(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,i){return t*=this.itemSize,this.normalized&&(e=me(e,this.array),n=me(n,this.array),i=me(i,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this}setXYZW(t,e,n,i,r){return t*=this.itemSize,this.normalized&&(e=me(e,this.array),n=me(n,this.array),i=me(i,this.array),r=me(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return t.name=this.name,t.usage=this.usage,t.gpuType=this.gpuType,t}dispose(){this.dispatchEvent({type:"dispose"})}};var Jr=class extends Ue{constructor(t,e,n){super(new Uint16Array(t),e,n)}};var Zr=class extends Ue{constructor(t,e,n){super(new Uint32Array(t),e,n)}};var qt=class extends Ue{constructor(t,e,n){super(new Float32Array(t),e,n)}},Wm=new ei,Cr=new w,oh=new w,Hn=class{constructor(t=new w,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let n=this.center;e!==void 0?n.copy(e):Wm.setFromPoints(t).getCenter(n);let i=0;for(let r=0,a=t.length;r<a;r++)i=Math.max(i,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(i),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Cr.subVectors(t,this.center);let e=Cr.lengthSq();if(e>this.radius*this.radius){let n=Math.sqrt(e),i=(n-this.radius)*.5;this.center.addScaledVector(Cr,i/n),this.radius+=i}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(oh.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Cr.copy(t.center).add(oh)),this.expandByPoint(Cr.copy(t.center).sub(oh))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}},Xm=0,Rn=new oe,lh=new Xe,Cs=new w,yn=new ei,Pr=new ei,He=new w,ge=class s extends ti{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Xm++}),this.uuid=jn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(mm(t)?Zr:Jr)(t,1):this.index=t,this}setIndirect(t,e=0){return this.indirect=t,this.indirectOffset=e,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new Yt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}let i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(t),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(t){return Rn.makeRotationFromQuaternion(t),this.applyMatrix4(Rn),this}rotateX(t){return Rn.makeRotationX(t),this.applyMatrix4(Rn),this}rotateY(t){return Rn.makeRotationY(t),this.applyMatrix4(Rn),this}rotateZ(t){return Rn.makeRotationZ(t),this.applyMatrix4(Rn),this}translate(t,e,n){return Rn.makeTranslation(t,e,n),this.applyMatrix4(Rn),this}scale(t,e,n){return Rn.makeScale(t,e,n),this.applyMatrix4(Rn),this}lookAt(t){return lh.lookAt(t),lh.updateMatrix(),this.applyMatrix4(lh.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Cs).negate(),this.translate(Cs.x,Cs.y,Cs.z),this}setFromPoints(t){let e=this.getAttribute("position");if(e===void 0){let n=[];for(let i=0,r=t.length;i<r;i++){let a=t[i];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new qt(n,3))}else{let n=Math.min(t.length,e.count);for(let i=0;i<n;i++){let r=t[i];e.setXYZ(i,r.x,r.y,r.z||0)}t.length>e.count&&Vt("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ei);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Ht("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new w(-1/0,-1/0,-1/0),new w(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,i=e.length;n<i;n++){let r=e[n];yn.setFromBufferAttribute(r),this.morphTargetsRelative?(He.addVectors(this.boundingBox.min,yn.min),this.boundingBox.expandByPoint(He),He.addVectors(this.boundingBox.max,yn.max),this.boundingBox.expandByPoint(He)):(this.boundingBox.expandByPoint(yn.min),this.boundingBox.expandByPoint(yn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Ht('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Hn);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Ht("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new w,1/0);return}if(t){let n=this.boundingSphere.center;if(yn.setFromBufferAttribute(t),e)for(let r=0,a=e.length;r<a;r++){let o=e[r];Pr.setFromBufferAttribute(o),this.morphTargetsRelative?(He.addVectors(yn.min,Pr.min),yn.expandByPoint(He),He.addVectors(yn.max,Pr.max),yn.expandByPoint(He)):(yn.expandByPoint(Pr.min),yn.expandByPoint(Pr.max))}yn.getCenter(n);let i=0;for(let r=0,a=t.count;r<a;r++)He.fromBufferAttribute(t,r),i=Math.max(i,n.distanceToSquared(He));if(e)for(let r=0,a=e.length;r<a;r++){let o=e[r],c=this.morphTargetsRelative;for(let l=0,h=o.count;l<h;l++)He.fromBufferAttribute(o,l),c&&(Cs.fromBufferAttribute(t,l),He.add(Cs)),i=Math.max(i,n.distanceToSquared(He))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&Ht('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){Ht("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=e.position,i=e.normal,r=e.uv,a=this.getAttribute("tangent");(a===void 0||a.count!==n.count)&&(a=new Ue(new Float32Array(4*n.count),4),this.setAttribute("tangent",a));let o=[],c=[];for(let v=0;v<n.count;v++)o[v]=new w,c[v]=new w;let l=new w,h=new w,d=new w,u=new it,f=new it,m=new it,x=new w,g=new w;function p(v,A,I){l.fromBufferAttribute(n,v),h.fromBufferAttribute(n,A),d.fromBufferAttribute(n,I),u.fromBufferAttribute(r,v),f.fromBufferAttribute(r,A),m.fromBufferAttribute(r,I),h.sub(l),d.sub(l),f.sub(u),m.sub(u);let D=1/(f.x*m.y-m.x*f.y);isFinite(D)&&(x.copy(h).multiplyScalar(m.y).addScaledVector(d,-f.y).multiplyScalar(D),g.copy(d).multiplyScalar(f.x).addScaledVector(h,-m.x).multiplyScalar(D),o[v].add(x),o[A].add(x),o[I].add(x),c[v].add(g),c[A].add(g),c[I].add(g))}let M=this.groups;M.length===0&&(M=[{start:0,count:t.count}]);for(let v=0,A=M.length;v<A;++v){let I=M[v],D=I.start,B=I.count;for(let V=D,P=D+B;V<P;V+=3)p(t.getX(V+0),t.getX(V+1),t.getX(V+2))}let S=new w,y=new w,T=new w,E=new w;function C(v){T.fromBufferAttribute(i,v),E.copy(T);let A=o[v];S.copy(A),S.sub(T.multiplyScalar(T.dot(A))).normalize(),y.crossVectors(E,A);let D=y.dot(c[v])<0?-1:1;a.setXYZW(v,S.x,S.y,S.z,D)}for(let v=0,A=M.length;v<A;++v){let I=M[v],D=I.start,B=I.count;for(let V=D,P=D+B;V<P;V+=3)C(t.getX(V+0)),C(t.getX(V+1)),C(t.getX(V+2))}this._transformed=!0}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==e.count)n=new Ue(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let u=0,f=n.count;u<f;u++)n.setXYZ(u,0,0,0);let i=new w,r=new w,a=new w,o=new w,c=new w,l=new w,h=new w,d=new w;if(t)for(let u=0,f=t.count;u<f;u+=3){let m=t.getX(u+0),x=t.getX(u+1),g=t.getX(u+2);i.fromBufferAttribute(e,m),r.fromBufferAttribute(e,x),a.fromBufferAttribute(e,g),h.subVectors(a,r),d.subVectors(i,r),h.cross(d),o.fromBufferAttribute(n,m),c.fromBufferAttribute(n,x),l.fromBufferAttribute(n,g),o.add(h),c.add(h),l.add(h),n.setXYZ(m,o.x,o.y,o.z),n.setXYZ(x,c.x,c.y,c.z),n.setXYZ(g,l.x,l.y,l.z)}else for(let u=0,f=e.count;u<f;u+=3)i.fromBufferAttribute(e,u+0),r.fromBufferAttribute(e,u+1),a.fromBufferAttribute(e,u+2),h.subVectors(a,r),d.subVectors(i,r),h.cross(d),n.setXYZ(u+0,h.x,h.y,h.z),n.setXYZ(u+1,h.x,h.y,h.z),n.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)He.fromBufferAttribute(t,e),He.normalize(),t.setXYZ(e,He.x,He.y,He.z)}toNonIndexed(){function t(o,c){let l=o.array,h=o.itemSize,d=o.normalized,u=new l.constructor(c.length*h),f=0,m=0;for(let x=0,g=c.length;x<g;x++){o.isInterleavedBufferAttribute?f=c[x]*o.data.stride+o.offset:f=c[x]*h;for(let p=0;p<h;p++)u[m++]=l[f++]}return new Ue(u,h,d)}if(this.index===null)return Vt("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new s,n=this.index.array,i=this.attributes;for(let o in i){let c=i[o],l=t(c,n);e.setAttribute(o,l)}let r=this.morphAttributes;for(let o in r){let c=[],l=r[o];for(let h=0,d=l.length;h<d;h++){let u=l[h],f=t(u,n);c.push(f)}e.morphAttributes[o]=c}e.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,c=a.length;o<c;o++){let l=a[o];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){let t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,t.name=this.name,Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let c=this.parameters;for(let l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let n=this.attributes;for(let c in n){let l=n[c];t.data.attributes[c]=l.toJSON(t.data)}let i={},r=!1;for(let c in this.morphAttributes){let l=this.morphAttributes[c],h=[];for(let d=0,u=l.length;d<u;d++){let f=l[d];h.push(f.toJSON(t.data))}h.length>0&&(i[c]=h,r=!0)}r&&(t.data.morphAttributes=i,t.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(t.data.boundingSphere=o.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let n=t.index;n!==null&&this.setIndex(n.clone());let i=t.attributes;for(let l in i){let h=i[l];this.setAttribute(l,h.clone(e))}let r=t.morphAttributes;for(let l in r){let h=[],d=r[l];for(let u=0,f=d.length;u<f;u++)h.push(d[u].clone(e));this.morphAttributes[l]=h}this.morphTargetsRelative=t.morphTargetsRelative;let a=t.groups;for(let l=0,h=a.length;l<h;l++){let d=a[l];this.addGroup(d.start,d.count,d.materialIndex)}let o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());let c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this._transformed=t._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}},$o=class{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=Gh,this.updateRanges=[],this.version=0,this.uuid=jn()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let i=0,r=this.stride;i<r;i++)this.array[t+i]=e.array[n+i];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=jn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(e,this.stride);return n.setUsage(this.usage),n}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=jn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer)));let e={uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride};return e.usage=this.usage,e}},hn=new w,Kr=class s{constructor(t,e,n,i=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=i}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)hn.fromBufferAttribute(this,e),hn.applyMatrix4(t),this.setXYZ(e,hn.x,hn.y,hn.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)hn.fromBufferAttribute(this,e),hn.applyNormalMatrix(t),this.setXYZ(e,hn.x,hn.y,hn.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)hn.fromBufferAttribute(this,e),hn.transformDirection(t),this.setXYZ(e,hn.x,hn.y,hn.z);return this}getComponent(t,e){let n=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(n=kn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=me(n,this.array)),this.data.array[t*this.data.stride+this.offset+e]=n,this}setX(t,e){return this.normalized&&(e=me(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=me(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=me(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=me(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=kn(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=kn(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=kn(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=kn(e,this.array)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=me(e,this.array),n=me(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,i){return t=t*this.data.stride+this.offset,this.normalized&&(e=me(e,this.array),n=me(n,this.array),i=me(i,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=i,this}setXYZW(t,e,n,i,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=me(e,this.array),n=me(n,this.array),i=me(i,this.array),r=me(r,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=i,this.data.array[t+3]=r,this}clone(t){if(t===void 0){Xr("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let e=[];for(let n=0;n<this.count;n++){let i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[i+r])}return new Ue(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new s(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){Xr("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let e=[];for(let n=0;n<this.count;n++){let i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[i+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},ch=new w,qm=new w,Ym=new Yt,zn=class{constructor(t=new w(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,i){return this.normal.set(t,e,n),this.constant=i,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){let i=ch.subVectors(n,e).cross(qm.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(i,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e,n=!0){let i=t.delta(ch),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let a=-(t.start.dot(this.normal)+this.constant)/r;return n===!0&&(a<0||a>1)?null:e.copy(t.start).addScaledVector(i,a)}intersectsLine(t){let e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let n=e||Ym.getNormalMatrix(t),i=this.coplanarPoint(ch).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(t){return this.normal.fromArray(t.normal),this.constant=t.constant,this}},$m=0,ni=class extends ti{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:$m++}),this.uuid=jn(),this.name="",this.type="Material",this.blending=Oi,this.side=Bi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Dh,this.blendDst=Nh,this.blendEquation=as,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new lt(0,0,0),this.blendAlpha=0,this.depthFunc=zs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=lf,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Uo,this.stencilZFail=Uo,this.stencilZPass=Uo,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let n=t[e];if(n===void 0){Vt(`Material: parameter '${e}' has value of undefined.`);continue}let i=this[e];if(i===void 0){Vt(`Material: '${e}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector2&&n&&n.isVector2||i&&i.isEuler&&n&&n.isEuler||i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(r){let a=[];for(let o in r){let c=r[o];delete c.metadata,a.push(c)}return a}if(e){let r=i(t.textures),a=i(t.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}fromJSON(t,e){if(t.uuid!==void 0&&(this.uuid=t.uuid),t.name!==void 0&&(this.name=t.name),t.color!==void 0&&this.color!==void 0&&this.color.setHex(t.color),t.roughness!==void 0&&(this.roughness=t.roughness),t.metalness!==void 0&&(this.metalness=t.metalness),t.sheen!==void 0&&(this.sheen=t.sheen),t.sheenColor!==void 0&&(this.sheenColor=new lt().setHex(t.sheenColor)),t.sheenRoughness!==void 0&&(this.sheenRoughness=t.sheenRoughness),t.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(t.emissive),t.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(t.specular),t.specularIntensity!==void 0&&(this.specularIntensity=t.specularIntensity),t.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(t.specularColor),t.shininess!==void 0&&(this.shininess=t.shininess),t.clearcoat!==void 0&&(this.clearcoat=t.clearcoat),t.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=t.clearcoatRoughness),t.dispersion!==void 0&&(this.dispersion=t.dispersion),t.retroreflectivity!==void 0&&(this.retroreflectivity=t.retroreflectivity),t.iridescence!==void 0&&(this.iridescence=t.iridescence),t.iridescenceIOR!==void 0&&(this.iridescenceIOR=t.iridescenceIOR),t.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=t.iridescenceThicknessRange),t.transmission!==void 0&&(this.transmission=t.transmission),t.thickness!==void 0&&(this.thickness=t.thickness),t.attenuationDistance!==void 0&&(this.attenuationDistance=t.attenuationDistance),t.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(t.attenuationColor),t.anisotropy!==void 0&&(this.anisotropy=t.anisotropy),t.anisotropyRotation!==void 0&&(this.anisotropyRotation=t.anisotropyRotation),t.fog!==void 0&&(this.fog=t.fog),t.flatShading!==void 0&&(this.flatShading=t.flatShading),t.blending!==void 0&&(this.blending=t.blending),t.combine!==void 0&&(this.combine=t.combine),t.side!==void 0&&(this.side=t.side),t.shadowSide!==void 0&&(this.shadowSide=t.shadowSide),t.opacity!==void 0&&(this.opacity=t.opacity),t.transparent!==void 0&&(this.transparent=t.transparent),t.alphaTest!==void 0&&(this.alphaTest=t.alphaTest),t.alphaHash!==void 0&&(this.alphaHash=t.alphaHash),t.depthFunc!==void 0&&(this.depthFunc=t.depthFunc),t.depthTest!==void 0&&(this.depthTest=t.depthTest),t.depthWrite!==void 0&&(this.depthWrite=t.depthWrite),t.colorWrite!==void 0&&(this.colorWrite=t.colorWrite),t.clippingPlanes!==void 0&&(this.clippingPlanes=t.clippingPlanes.map(n=>new zn().fromJSON(n))),t.clipIntersection!==void 0&&(this.clipIntersection=t.clipIntersection),t.clipShadows!==void 0&&(this.clipShadows=t.clipShadows),t.depthPacking!==void 0&&(this.depthPacking=t.depthPacking),t.blendSrc!==void 0&&(this.blendSrc=t.blendSrc),t.blendDst!==void 0&&(this.blendDst=t.blendDst),t.blendEquation!==void 0&&(this.blendEquation=t.blendEquation),t.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=t.blendSrcAlpha),t.blendDstAlpha!==void 0&&(this.blendDstAlpha=t.blendDstAlpha),t.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=t.blendEquationAlpha),t.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(t.blendColor),t.blendAlpha!==void 0&&(this.blendAlpha=t.blendAlpha),t.stencilWriteMask!==void 0&&(this.stencilWriteMask=t.stencilWriteMask),t.stencilFunc!==void 0&&(this.stencilFunc=t.stencilFunc),t.stencilRef!==void 0&&(this.stencilRef=t.stencilRef),t.stencilFuncMask!==void 0&&(this.stencilFuncMask=t.stencilFuncMask),t.stencilFail!==void 0&&(this.stencilFail=t.stencilFail),t.stencilZFail!==void 0&&(this.stencilZFail=t.stencilZFail),t.stencilZPass!==void 0&&(this.stencilZPass=t.stencilZPass),t.stencilWrite!==void 0&&(this.stencilWrite=t.stencilWrite),t.wireframe!==void 0&&(this.wireframe=t.wireframe),t.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=t.wireframeLinewidth),t.wireframeLinecap!==void 0&&(this.wireframeLinecap=t.wireframeLinecap),t.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=t.wireframeLinejoin),t.rotation!==void 0&&(this.rotation=t.rotation),t.linewidth!==void 0&&(this.linewidth=t.linewidth),t.linecap!==void 0&&(this.linecap=t.linecap),t.linejoin!==void 0&&(this.linejoin=t.linejoin),t.dashSize!==void 0&&(this.dashSize=t.dashSize),t.gapSize!==void 0&&(this.gapSize=t.gapSize),t.scale!==void 0&&(this.scale=t.scale),t.polygonOffset!==void 0&&(this.polygonOffset=t.polygonOffset),t.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=t.polygonOffsetFactor),t.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=t.polygonOffsetUnits),t.dithering!==void 0&&(this.dithering=t.dithering),t.alphaToCoverage!==void 0&&(this.alphaToCoverage=t.alphaToCoverage),t.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=t.premultipliedAlpha),t.forceSinglePass!==void 0&&(this.forceSinglePass=t.forceSinglePass),t.allowOverride!==void 0&&(this.allowOverride=t.allowOverride),t.visible!==void 0&&(this.visible=t.visible),t.toneMapped!==void 0&&(this.toneMapped=t.toneMapped),t.userData!==void 0&&(this.userData=t.userData),t.vertexColors!==void 0&&(typeof t.vertexColors=="number"?this.vertexColors=t.vertexColors>0:this.vertexColors=t.vertexColors),t.size!==void 0&&(this.size=t.size),t.sizeAttenuation!==void 0&&(this.sizeAttenuation=t.sizeAttenuation),t.map!==void 0&&(this.map=e[t.map]||null),t.matcap!==void 0&&(this.matcap=e[t.matcap]||null),t.alphaMap!==void 0&&(this.alphaMap=e[t.alphaMap]||null),t.bumpMap!==void 0&&(this.bumpMap=e[t.bumpMap]||null),t.bumpScale!==void 0&&(this.bumpScale=t.bumpScale),t.normalMap!==void 0&&(this.normalMap=e[t.normalMap]||null),t.normalMapType!==void 0&&(this.normalMapType=t.normalMapType),t.normalScale!==void 0){let n=t.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new it().fromArray(n)}return t.displacementMap!==void 0&&(this.displacementMap=e[t.displacementMap]||null),t.displacementScale!==void 0&&(this.displacementScale=t.displacementScale),t.displacementBias!==void 0&&(this.displacementBias=t.displacementBias),t.roughnessMap!==void 0&&(this.roughnessMap=e[t.roughnessMap]||null),t.metalnessMap!==void 0&&(this.metalnessMap=e[t.metalnessMap]||null),t.emissiveMap!==void 0&&(this.emissiveMap=e[t.emissiveMap]||null),t.emissiveIntensity!==void 0&&(this.emissiveIntensity=t.emissiveIntensity),t.specularMap!==void 0&&(this.specularMap=e[t.specularMap]||null),t.specularIntensityMap!==void 0&&(this.specularIntensityMap=e[t.specularIntensityMap]||null),t.specularColorMap!==void 0&&(this.specularColorMap=e[t.specularColorMap]||null),t.envMap!==void 0&&(this.envMap=e[t.envMap]||null),t.envMapRotation!==void 0&&this.envMapRotation.fromArray(t.envMapRotation),t.envMapIntensity!==void 0&&(this.envMapIntensity=t.envMapIntensity),t.reflectivity!==void 0&&(this.reflectivity=t.reflectivity),t.refractionRatio!==void 0&&(this.refractionRatio=t.refractionRatio),t.lightMap!==void 0&&(this.lightMap=e[t.lightMap]||null),t.lightMapIntensity!==void 0&&(this.lightMapIntensity=t.lightMapIntensity),t.aoMap!==void 0&&(this.aoMap=e[t.aoMap]||null),t.aoMapIntensity!==void 0&&(this.aoMapIntensity=t.aoMapIntensity),t.gradientMap!==void 0&&(this.gradientMap=e[t.gradientMap]||null),t.clearcoatMap!==void 0&&(this.clearcoatMap=e[t.clearcoatMap]||null),t.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=e[t.clearcoatRoughnessMap]||null),t.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=e[t.clearcoatNormalMap]||null),t.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new it().fromArray(t.clearcoatNormalScale)),t.iridescenceMap!==void 0&&(this.iridescenceMap=e[t.iridescenceMap]||null),t.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=e[t.iridescenceThicknessMap]||null),t.transmissionMap!==void 0&&(this.transmissionMap=e[t.transmissionMap]||null),t.thicknessMap!==void 0&&(this.thicknessMap=e[t.thicknessMap]||null),t.anisotropyMap!==void 0&&(this.anisotropyMap=e[t.anisotropyMap]||null),t.sheenColorMap!==void 0&&(this.sheenColorMap=e[t.sheenColorMap]||null),t.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=e[t.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,n=null;if(e!==null){let i=e.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.allowOverride=t.allowOverride,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}},Xs=class extends ni{constructor(t){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new lt(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}},Ps,Ir=new w,Is=new w,Ls=new w,Ds=new it,Lr=new it,yf=new oe,po=new w,Dr=new w,mo=new w,pd=new it,hh=new it,md=new it,jr=class extends Xe{constructor(t=new Xs){if(super(),this.isSprite=!0,this.type="Sprite",Ps===void 0){Ps=new ge;let e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new $o(e,5);Ps.setIndex([0,1,2,0,2,3]),Ps.setAttribute("position",new Kr(n,3,0,!1)),Ps.setAttribute("uv",new Kr(n,2,3,!1))}this.geometry=Ps,this.material=t,this.center=new it(.5,.5),this.count=1}intersectsFrustum(t){return t.intersectsSprite(this)}raycast(t,e){t.camera===null&&Ht('Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Is.setFromMatrixScale(this.matrixWorld),yf.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),Ls.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Is.multiplyScalar(-Ls.z);let n=this.material.rotation,i,r;n!==0&&(r=Math.cos(n),i=Math.sin(n));let a=this.center;go(po.set(-.5,-.5,0),Ls,a,Is,i,r),go(Dr.set(.5,-.5,0),Ls,a,Is,i,r),go(mo.set(.5,.5,0),Ls,a,Is,i,r),pd.set(0,0),hh.set(1,0),md.set(1,1);let o=t.ray.intersectTriangle(po,Dr,mo,!1,Ir);if(o===null&&(go(Dr.set(-.5,.5,0),Ls,a,Is,i,r),hh.set(0,1),o=t.ray.intersectTriangle(po,mo,Dr,!1,Ir),o===null))return;let c=t.ray.origin.distanceTo(Ir);c<t.near||c>t.far||e.push({distance:c,point:Ir.clone(),uv:di.getInterpolation(Ir,po,Dr,mo,pd,hh,md,new it),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}};function go(s,t,e,n,i,r){Ds.subVectors(s,e).addScalar(.5).multiply(n),i!==void 0?(Lr.x=r*Ds.x-i*Ds.y,Lr.y=i*Ds.x+r*Ds.y):Lr.copy(Ds),s.copy(t),s.x+=Lr.x,s.y+=Lr.y,s.applyMatrix4(yf)}var ui=new w,uh=new w,xo=new w,_o=new w,Qr=class{constructor(t=new w,e=new w(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,ui)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=ui.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(ui.copy(this.origin).addScaledVector(this.direction,e),ui.distanceToSquared(t))}distanceSqToSegment(t,e,n,i){uh.copy(t).add(e).multiplyScalar(.5),xo.copy(e).sub(t).normalize(),_o.copy(this.origin).sub(uh);let r=t.distanceTo(e)*.5,a=-this.direction.dot(xo),o=_o.dot(this.direction),c=-_o.dot(xo),l=_o.lengthSq(),h=Math.abs(1-a*a),d,u,f,m;if(h>0)if(d=a*c-o,u=a*o-c,m=r*h,d>=0)if(u>=-m)if(u<=m){let x=1/h;d*=x,u*=x,f=d*(d+a*u+2*o)+u*(a*d+u+2*c)+l}else u=r,d=Math.max(0,-(a*u+o)),f=-d*d+u*(u+2*c)+l;else u=-r,d=Math.max(0,-(a*u+o)),f=-d*d+u*(u+2*c)+l;else u<=-m?(d=Math.max(0,-(-a*r+o)),u=d>0?-r:Math.min(Math.max(-r,-c),r),f=-d*d+u*(u+2*c)+l):u<=m?(d=0,u=Math.min(Math.max(-r,-c),r),f=u*(u+2*c)+l):(d=Math.max(0,-(a*r+o)),u=d>0?r:Math.min(Math.max(-r,-c),r),f=-d*d+u*(u+2*c)+l);else u=a>0?-r:r,d=Math.max(0,-(a*u+o)),f=-d*d+u*(u+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,d),i&&i.copy(uh).addScaledVector(xo,u),f}intersectSphere(t,e){if(t.radius<0)return null;ui.subVectors(t.center,this.origin);let n=ui.dot(this.direction),i=ui.dot(ui)-n*n,r=t.radius*t.radius;if(i>r)return null;let a=Math.sqrt(r-i),o=n-a,c=n+a;return c<0?null:o<0?this.at(c,e):this.at(o,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){let n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,i,r,a,o,c,l=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,u=this.origin;return l>=0?(n=(t.min.x-u.x)*l,i=(t.max.x-u.x)*l):(n=(t.max.x-u.x)*l,i=(t.min.x-u.x)*l),h>=0?(r=(t.min.y-u.y)*h,a=(t.max.y-u.y)*h):(r=(t.max.y-u.y)*h,a=(t.min.y-u.y)*h),n>a||r>i||((r>n||isNaN(n))&&(n=r),(a<i||isNaN(i))&&(i=a),d>=0?(o=(t.min.z-u.z)*d,c=(t.max.z-u.z)*d):(o=(t.max.z-u.z)*d,c=(t.min.z-u.z)*d),n>c||o>i)||((o>n||n!==n)&&(n=o),(c<i||i!==i)&&(i=c),i<0)?null:this.at(n>=0?n:i,e)}intersectsBox(t){return this.intersectBox(t,ui)!==null}intersectTriangle(t,e,n,i,r){let a=this.origin,o=this.direction,c=o.x,l=o.y,h=o.z,d=t.x-a.x,u=t.y-a.y,f=t.z-a.z,m=e.x-a.x,x=e.y-a.y,g=e.z-a.z,p=n.x-a.x,M=n.y-a.y,S=n.z-a.z,y=Math.abs(c),T=Math.abs(l),E=Math.abs(h),C,v,A,I,D,B,V,P,L,X,k,Z;if(y>=T&&y>=E?(A=c,B=d,L=m,Z=p,c>=0?(C=l,v=h,I=u,D=f,V=x,P=g,X=M,k=S):(C=h,v=l,I=f,D=u,V=g,P=x,X=S,k=M)):T>=E?(A=l,B=u,L=x,Z=M,l>=0?(C=h,v=c,I=f,D=d,V=g,P=m,X=S,k=p):(C=c,v=h,I=d,D=f,V=m,P=g,X=p,k=S)):(A=h,B=f,L=g,Z=S,h>=0?(C=c,v=l,I=d,D=u,V=m,P=x,X=p,k=M):(C=l,v=c,I=u,D=d,V=x,P=m,X=M,k=p)),A===0)return null;let z=C/A,q=v/A,$=1/A,mt=I-z*B,ft=D-q*B,Gt=V-z*L,Wt=P-q*L,jt=X-z*Z,J=k-q*Z,Q=jt*Wt-J*Gt,dt=mt*J-ft*jt,Bt=Gt*ft-Wt*mt;if(i){if(Q<0||dt<0||Bt<0)return null}else if((Q<0||dt<0||Bt<0)&&(Q>0||dt>0||Bt>0))return null;let yt=Q+dt+Bt;if(yt===0)return null;let zt=$*(Q*B+dt*L+Bt*Z);return(yt>0?zt<0:zt>0)?null:this.at(zt/yt,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},fe=class extends ni{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new lt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new mi,this.combine=Uh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}},gd=new oe,Ki=new Qr,vo=new Hn,xd=new w,yo=new w,Mo=new w,bo=new w,dh=new w,So=new w,_d=new w,To=new w,Tt=class extends Xe{constructor(t=new ge,e=new fe){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){let o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(t,e){let n=this.geometry,i=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(i,t);let o=this.morphTargetInfluences;if(r&&o){So.set(0,0,0);for(let c=0,l=r.length;c<l;c++){let h=o[c],d=r[c];h!==0&&(dh.fromBufferAttribute(d,t),a?So.addScaledVector(dh,h):So.addScaledVector(dh.sub(e),h))}e.add(So)}return e}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,e){let n=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),vo.copy(n.boundingSphere),vo.applyMatrix4(r),Ki.copy(t.ray).recast(t.near),!(vo.containsPoint(Ki.origin)===!1&&(Ki.intersectSphere(vo,xd)===null||Ki.origin.distanceToSquared(xd)>(t.far-t.near)**2))&&(gd.copy(r).invert(),Ki.copy(t.ray).applyMatrix4(gd),!(n.boundingBox!==null&&Ki.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Ki)))}_computeIntersections(t,e,n){let i,r=this.geometry,a=this.material,o=r.index,c=r.attributes.position,l=r.attributes.uv,h=r.attributes.uv1,d=r.attributes.normal,u=r.groups,f=r.drawRange;if(o!==null)if(Array.isArray(a))for(let m=0,x=u.length;m<x;m++){let g=u[m],p=a[g.materialIndex],M=Math.max(g.start,f.start),S=Math.min(o.count,Math.min(g.start+g.count,f.start+f.count));for(let y=M,T=S;y<T;y+=3){let E=o.getX(y),C=o.getX(y+1),v=o.getX(y+2);i=Eo(this,p,t,n,l,h,d,E,C,v),i&&(i.faceIndex=Math.floor(y/3),i.face.materialIndex=g.materialIndex,e.push(i))}}else{let m=Math.max(0,f.start),x=Math.min(o.count,f.start+f.count);for(let g=m,p=x;g<p;g+=3){let M=o.getX(g),S=o.getX(g+1),y=o.getX(g+2);i=Eo(this,a,t,n,l,h,d,M,S,y),i&&(i.faceIndex=Math.floor(g/3),e.push(i))}}else if(c!==void 0)if(Array.isArray(a))for(let m=0,x=u.length;m<x;m++){let g=u[m],p=a[g.materialIndex],M=Math.max(g.start,f.start),S=Math.min(c.count,Math.min(g.start+g.count,f.start+f.count));for(let y=M,T=S;y<T;y+=3){let E=y,C=y+1,v=y+2;i=Eo(this,p,t,n,l,h,d,E,C,v),i&&(i.faceIndex=Math.floor(y/3),i.face.materialIndex=g.materialIndex,e.push(i))}}else{let m=Math.max(0,f.start),x=Math.min(c.count,f.start+f.count);for(let g=m,p=x;g<p;g+=3){let M=g,S=g+1,y=g+2;i=Eo(this,a,t,n,l,h,d,M,S,y),i&&(i.faceIndex=Math.floor(g/3),e.push(i))}}}};function Jm(s,t,e,n,i,r,a,o){let c;if(t.side===qe?c=n.intersectTriangle(a,r,i,!0,o):c=n.intersectTriangle(i,r,a,t.side===Bi,o),c===null)return null;To.copy(o),To.applyMatrix4(s.matrixWorld);let l=e.ray.origin.distanceTo(To);return l<e.near||l>e.far?null:{distance:l,point:To.clone(),object:s}}function Eo(s,t,e,n,i,r,a,o,c,l){s.getVertexPosition(o,yo),s.getVertexPosition(c,Mo),s.getVertexPosition(l,bo);let h=Jm(s,t,e,n,yo,Mo,bo,_d);if(h){let d=new w;di.getBarycoord(_d,yo,Mo,bo,d),i&&(h.uv=di.getInterpolatedAttribute(i,o,c,l,d,new it)),r&&(h.uv1=di.getInterpolatedAttribute(r,o,c,l,d,new it)),a&&(h.normal=di.getInterpolatedAttribute(a,o,c,l,d,new w),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let u={a:o,b:c,c:l,normal:new w,materialIndex:0};di.getNormal(yo,Mo,bo,u.normal),h.face=u,h.barycoord=d}return h}var ta=class extends un{constructor(t=null,e=1,n=1,i,r,a,o,c,l=We,h=We,d,u){super(null,a,o,c,l,h,i,r,d,u),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var ea=class extends Ue{constructor(t,e,n,i=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){let t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}},Ns=new oe,vd=new oe,wo=[],yd=new ei,Zm=new oe,Nr=new Tt,Ur=new Hn,na=class extends Tt{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new ea(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,Zm)}computeBoundingBox(){let t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new ei),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Ns),yd.copy(t.boundingBox).applyMatrix4(Ns),this.boundingBox.union(yd)}computeBoundingSphere(){let t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new Hn),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Ns),Ur.copy(t.boundingSphere).applyMatrix4(Ns),this.boundingSphere.union(Ur)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){return this.instanceColor===null?e.setRGB(1,1,1):e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){return e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){let n=e.morphTargetInfluences,i=this.morphTexture.source.data.data,r=n.length+1,a=t*r+1;for(let o=0;o<n.length;o++)n[o]=i[a+o]}raycast(t,e){let n=this.matrixWorld,i=this.count;if(Nr.geometry=this.geometry,Nr.material=this.material,Nr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Ur.copy(this.boundingSphere),Ur.applyMatrix4(n),t.ray.intersectsSphere(Ur)!==!1))for(let r=0;r<i;r++){this.getMatrixAt(r,Ns),vd.multiplyMatrices(n,Ns),Nr.matrixWorld=vd,Nr.raycast(t,wo);for(let a=0,o=wo.length;a<o;a++){let c=wo[a];c.instanceId=r,c.object=this,e.push(c)}wo.length=0}}setColorAt(t,e){return this.instanceColor===null&&(this.instanceColor=new ea(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3),this}setMatrixAt(t,e){return e.toArray(this.instanceMatrix.array,t*16),this}setMorphAt(t,e){let n=e.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new ta(new Float32Array(i*this.count),i,this.count,El,Pn));let r=this.morphTexture.source.data.data,a=0;for(let l=0;l<n.length;l++)a+=n[l];let o=this.geometry.morphTargetsRelative?1:1-a,c=i*t;return r[c]=o,r.set(n,c+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},ji=new Hn,Km=new it(.5,.5),Ao=new w,qs=class{constructor(t=new zn,e=new zn,n=new zn,i=new zn,r=new zn,a=new zn){this.planes=[t,e,n,i,r,a]}set(t,e,n,i,r,a){let o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(i),o[4].copy(r),o[5].copy(a),this}copy(t){let e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Vn,n=!1){let i=this.planes,r=t.elements,a=r[0],o=r[1],c=r[2],l=r[3],h=r[4],d=r[5],u=r[6],f=r[7],m=r[8],x=r[9],g=r[10],p=r[11],M=r[12],S=r[13],y=r[14],T=r[15];if(i[0].setComponents(l-a,f-h,p-m,T-M).normalize(),i[1].setComponents(l+a,f+h,p+m,T+M).normalize(),i[2].setComponents(l+o,f+d,p+x,T+S).normalize(),i[3].setComponents(l-o,f-d,p-x,T-S).normalize(),n)i[4].setComponents(c,u,g,y).normalize(),i[5].setComponents(l-c,f-u,p-g,T-y).normalize();else if(i[4].setComponents(l-c,f-u,p-g,T-y).normalize(),e===Vn)i[5].setComponents(l+c,f+u,p+g,T+y).normalize();else if(e===ks)i[5].setComponents(c,u,g,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),ji.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),ji.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(ji)}intersectsSprite(t){ji.center.set(0,0,0);let e=Km.distanceTo(t.center);return ji.radius=.7071067811865476+e,ji.applyMatrix4(t.matrixWorld),this.intersectsSphere(ji)}intersectsSphere(t){let e=this.planes,n=t.center,i=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(t){let e=this.planes;for(let n=0;n<6;n++){let i=e[n];if(Ao.x=i.normal.x>0?t.max.x:t.min.x,Ao.y=i.normal.y>0?t.max.y:t.min.y,Ao.z=i.normal.z>0?t.max.z:t.min.z,i.distanceToPoint(Ao)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var Ys=class extends ni{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new lt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}},Md=new oe,bh=new Qr,Ro=new Hn,Co=new w,es=class extends Xe{constructor(t=new ge,e=new Ys){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,e){let n=this.geometry,i=this.matrixWorld,r=t.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Ro.copy(n.boundingSphere),Ro.applyMatrix4(i),Ro.radius+=r,t.ray.intersectsSphere(Ro)===!1)return;Md.copy(i).invert(),bh.copy(t.ray).applyMatrix4(Md);let o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=n.index,d=n.attributes.position;if(l!==null){let u=Math.max(0,a.start),f=Math.min(l.count,a.start+a.count);for(let m=u,x=f;m<x;m++){let g=l.getX(m);Co.fromBufferAttribute(d,g),bd(Co,g,c,i,t,e,this)}}else{let u=Math.max(0,a.start),f=Math.min(d.count,a.start+a.count);for(let m=u,x=f;m<x;m++)Co.fromBufferAttribute(d,m),bd(Co,m,c,i,t,e,this)}}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){let o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}};function bd(s,t,e,n,i,r,a){let o=bh.distanceSqToPoint(s);if(o<e){let c=new w;bh.closestPointToPoint(s,c),c.applyMatrix4(n);let l=i.ray.origin.distanceTo(c);if(l<i.near||l>i.far)return;r.push({distance:l,distanceToRay:Math.sqrt(o),point:c,index:t,face:null,faceIndex:null,barycoord:null,object:a})}}var ia=class extends un{constructor(t=[],e=zi,n,i,r,a,o,c,l,h){super(t,e,n,i,r,a,o,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}},gi=class extends un{constructor(t,e,n,i,r,a,o,c,l){super(t,e,n,i,r,a,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}};var Ii=class extends un{constructor(t,e,n=Wn,i,r,a,o=We,c=We,l,h=Qn,d=1){if(h!==Qn&&h!==Vi)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let u={width:t,height:e,depth:d};super(u,i,r,a,o,c,h,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new Gs(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);return e.compareFunction=this.compareFunction,e}},Jo=class extends Ii{constructor(t,e=Wn,n=zi,i,r,a=We,o=We,c,l=Qn){let h={width:t,height:t,depth:1},d=[h,h,h,h,h,h];super(t,t,e,n,i,r,a,o,c,l),this.image=d,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(t){this.image=t}},sa=class extends un{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}},_e=class s extends ge{constructor(t=1,e=1,n=1,i=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:i,heightSegments:r,depthSegments:a};let o=this;i=Math.floor(i),r=Math.floor(r),a=Math.floor(a);let c=[],l=[],h=[],d=[],u=0,f=0;m("z","y","x",-1,-1,n,e,t,a,r,0),m("z","y","x",1,-1,n,e,-t,a,r,1),m("x","z","y",1,1,t,n,e,i,a,2),m("x","z","y",1,-1,t,n,-e,i,a,3),m("x","y","z",1,-1,t,e,n,i,r,4),m("x","y","z",-1,-1,t,e,-n,i,r,5),this.setIndex(c),this.setAttribute("position",new qt(l,3)),this.setAttribute("normal",new qt(h,3)),this.setAttribute("uv",new qt(d,2));function m(x,g,p,M,S,y,T,E,C,v,A){let I=y/C,D=T/v,B=y/2,V=T/2,P=E/2,L=C+1,X=v+1,k=0,Z=0,z=new w;for(let q=0;q<X;q++){let $=q*D-V;for(let mt=0;mt<L;mt++){let ft=mt*I-B;z[x]=ft*M,z[g]=$*S,z[p]=P,l.push(z.x,z.y,z.z),z[x]=0,z[g]=0,z[p]=E>0?1:-1,h.push(z.x,z.y,z.z),d.push(mt/C),d.push(1-q/v),k+=1}}for(let q=0;q<v;q++)for(let $=0;$<C;$++){let mt=u+$+L*q,ft=u+$+L*(q+1),Gt=u+($+1)+L*(q+1),Wt=u+($+1)+L*q;c.push(mt,ft,Wt),c.push(ft,Gt,Wt),Z+=6}o.addGroup(f,Z,A),f+=Z,u+=k}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};var ra=class s extends ge{constructor(t=1,e=32,n=0,i=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:i},e=Math.max(3,e);let r=[],a=[],o=[],c=[],l=new w,h=new it;a.push(0,0,0),o.push(0,0,1),c.push(.5,.5);for(let d=0,u=3;d<=e;d++,u+=3){let f=n+d/e*i;l.x=t*Math.cos(f),l.y=t*Math.sin(f),a.push(l.x,l.y,l.z),o.push(0,0,1),h.x=(a[u]/t+1)/2,h.y=(a[u+1]/t+1)/2,c.push(h.x,h.y)}for(let d=1;d<=e;d++)r.push(d,d+1,0);this.setIndex(r),this.setAttribute("position",new qt(a,3)),this.setAttribute("normal",new qt(o,3)),this.setAttribute("uv",new qt(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.radius,t.segments,t.thetaStart,t.thetaLength)}},mn=class s extends ge{constructor(t=1,e=1,n=1,i=32,r=1,a=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:i,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:c};let l=this;i=Math.floor(i),r=Math.floor(r);let h=[],d=[],u=[],f=[],m=0,x=[],g=n/2,p=0;M(),a===!1&&(t>0&&S(!0),e>0&&S(!1)),this.setIndex(h),this.setAttribute("position",new qt(d,3)),this.setAttribute("normal",new qt(u,3)),this.setAttribute("uv",new qt(f,2));function M(){let y=new w,T=new w,E=0,C=(e-t)/n;for(let v=0;v<=r;v++){let A=[],I=v/r,D=I*(e-t)+t;for(let B=0;B<=i;B++){let V=B/i,P=V*c+o,L=Math.sin(P),X=Math.cos(P);T.x=D*L,T.y=-I*n+g,T.z=D*X,d.push(T.x,T.y,T.z),y.set(L,C,X).normalize(),u.push(y.x,y.y,y.z),f.push(V,1-I),A.push(m++)}x.push(A)}for(let v=0;v<i;v++)for(let A=0;A<r;A++){let I=x[A][v],D=x[A+1][v],B=x[A+1][v+1],V=x[A][v+1];(t>0||A!==0)&&(h.push(I,D,V),E+=3),(e>0||A!==r-1)&&(h.push(D,B,V),E+=3)}l.addGroup(p,E,0),p+=E}function S(y){let T=m,E=new it,C=new w,v=0,A=y===!0?t:e,I=y===!0?1:-1;for(let B=1;B<=i;B++)d.push(0,g*I,0),u.push(0,I,0),f.push(.5,.5),m++;let D=m;for(let B=0;B<=i;B++){let P=B/i*c+o,L=Math.cos(P),X=Math.sin(P);C.x=A*X,C.y=g*I,C.z=A*L,d.push(C.x,C.y,C.z),u.push(0,I,0),E.x=L*.5+.5,E.y=X*.5*I+.5,f.push(E.x,E.y),m++}for(let B=0;B<i;B++){let V=T+B,P=D+B;y===!0?h.push(P,P+1,V):h.push(P+1,P,V),v+=3}l.addGroup(p,v,y===!0?1:2),p+=v}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},$s=class s extends mn{constructor(t=1,e=1,n=32,i=1,r=!1,a=0,o=Math.PI*2){super(0,t,e,n,i,r,a,o),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:i,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(t){return new s(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},Zo=class s extends ge{constructor(t=[],e=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:i};let r=[],a=[];o(i),l(n),h(),this.setAttribute("position",new qt(r,3)),this.setAttribute("normal",new qt(r.slice(),3)),this.setAttribute("uv",new qt(a,2)),i===0?this.computeVertexNormals():this.normalizeNormals();function o(M){let S=new w,y=new w,T=new w;for(let E=0;E<e.length;E+=3)f(e[E+0],S),f(e[E+1],y),f(e[E+2],T),c(S,y,T,M)}function c(M,S,y,T){let E=T+1,C=[];for(let v=0;v<=E;v++){C[v]=[];let A=M.clone().lerp(y,v/E),I=S.clone().lerp(y,v/E),D=E-v;for(let B=0;B<=D;B++)B===0&&v===E?C[v][B]=A:C[v][B]=A.clone().lerp(I,B/D)}for(let v=0;v<E;v++)for(let A=0;A<2*(E-v)-1;A++){let I=Math.floor(A/2);A%2===0?(u(C[v][I+1]),u(C[v+1][I]),u(C[v][I])):(u(C[v][I+1]),u(C[v+1][I+1]),u(C[v+1][I]))}}function l(M){let S=new w;for(let y=0;y<r.length;y+=3)S.x=r[y+0],S.y=r[y+1],S.z=r[y+2],S.normalize().multiplyScalar(M),r[y+0]=S.x,r[y+1]=S.y,r[y+2]=S.z}function h(){let M=new w;for(let S=0;S<r.length;S+=3){M.x=r[S+0],M.y=r[S+1],M.z=r[S+2];let y=g(M)/2/Math.PI+.5,T=p(M)/Math.PI+.5;a.push(y,1-T)}m(),d()}function d(){for(let M=0;M<a.length;M+=6){let S=a[M+0],y=a[M+2],T=a[M+4],E=Math.max(S,y,T),C=Math.min(S,y,T);E>.9&&C<.1&&(S<.2&&(a[M+0]+=1),y<.2&&(a[M+2]+=1),T<.2&&(a[M+4]+=1))}}function u(M){r.push(M.x,M.y,M.z)}function f(M,S){let y=M*3;S.x=t[y+0],S.y=t[y+1],S.z=t[y+2]}function m(){let M=new w,S=new w,y=new w,T=new w,E=new it,C=new it,v=new it;for(let A=0,I=0;A<r.length;A+=9,I+=6){M.set(r[A+0],r[A+1],r[A+2]),S.set(r[A+3],r[A+4],r[A+5]),y.set(r[A+6],r[A+7],r[A+8]),E.set(a[I+0],a[I+1]),C.set(a[I+2],a[I+3]),v.set(a[I+4],a[I+5]),T.copy(M).add(S).add(y).divideScalar(3);let D=g(T);x(E,I+0,M,D),x(C,I+2,S,D),x(v,I+4,y,D)}}function x(M,S,y,T){T<0&&M.x===1&&(a[S]=M.x-1),y.x===0&&y.z===0&&(a[S]=T/2/Math.PI+.5)}function g(M){return Math.atan2(M.z,-M.x)}function p(M){return Math.atan2(-M.y,Math.sqrt(M.x*M.x+M.z*M.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.vertices,t.indices,t.radius,t.detail)}};var Mn=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){Vt("Curve: .getPoint() not implemented.")}getPointAt(t,e){let n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){let t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let e=[],n,i=this.getPoint(0),r=0;e.push(0);for(let a=1;a<=t;a++)n=this.getPoint(a/t),r+=n.distanceTo(i),e.push(r),i=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){let n=this.getLengths(),i=0,r=n.length,a;e?a=e:a=t*n[r-1];let o=0,c=r-1,l;for(;o<=c;)if(i=Math.floor(o+(c-o)/2),l=n[i]-a,l<0)o=i+1;else if(l>0)c=i-1;else{c=i;break}if(i=c,n[i]===a)return i/(r-1);let h=n[i],u=n[i+1]-h,f=(a-h)/u;return(i+f)/(r-1)}getTangent(t,e){let i=t-1e-4,r=t+1e-4;i<0&&(i=0),r>1&&(r=1);let a=this.getPoint(i),o=this.getPoint(r),c=e||(a.isVector2?new it:new w);return c.copy(o).sub(a).normalize(),c}getTangentAt(t,e){let n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e=!1){let n=new w,i=[],r=[],a=[],o=new w,c=new oe;for(let f=0;f<=t;f++){let m=f/t;i[f]=this.getTangentAt(m,new w)}r[0]=new w,a[0]=new w;let l=Number.MAX_VALUE,h=Math.abs(i[0].x),d=Math.abs(i[0].y),u=Math.abs(i[0].z);h<=l&&(l=h,n.set(1,0,0)),d<=l&&(l=d,n.set(0,1,0)),u<=l&&n.set(0,0,1),o.crossVectors(i[0],n).normalize(),r[0].crossVectors(i[0],o),a[0].crossVectors(i[0],r[0]);for(let f=1;f<=t;f++){if(r[f]=r[f-1].clone(),a[f]=a[f-1].clone(),o.crossVectors(i[f-1],i[f]),o.length()>Number.EPSILON){o.normalize();let m=Math.acos(Qt(i[f-1].dot(i[f]),-1,1));r[f].applyMatrix4(c.makeRotationAxis(o,m))}a[f].crossVectors(i[f],r[f])}if(e===!0){let f=Math.acos(Qt(r[0].dot(r[t]),-1,1));f/=t,i[0].dot(o.crossVectors(r[0],r[t]))>0&&(f=-f);for(let m=1;m<=t;m++)r[m].applyMatrix4(c.makeRotationAxis(i[m],f*m)),a[m].crossVectors(i[m],r[m])}return{tangents:i,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){let t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}},Js=class extends Mn{constructor(t=0,e=0,n=1,i=1,r=0,a=Math.PI*2,o=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=i,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=c}getPoint(t,e=new it){let n=e,i=Math.PI*2,r=this.aEndAngle-this.aStartAngle,a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=i;for(;r>i;)r-=i;r<Number.EPSILON&&(a?r=0:r=i),this.aClockwise===!0&&!a&&(r===i?r=-i:r=r-i);let o=this.aStartAngle+t*r,c=this.aX+this.xRadius*Math.cos(o),l=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let h=Math.cos(this.aRotation),d=Math.sin(this.aRotation),u=c-this.aX,f=l-this.aY;c=u*h-f*d+this.aX,l=u*d+f*h+this.aY}return n.set(c,l)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){let t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}},Ko=class extends Js{constructor(t,e,n,i,r,a){super(t,e,n,n,i,r,a),this.isArcCurve=!0,this.type="ArcCurve"}};function qh(){let s=0,t=0,e=0,n=0;function i(r,a,o,c){s=r,t=o,e=-3*r+3*a-2*o-c,n=2*r-2*a+o+c}return{initCatmullRom:function(r,a,o,c,l){i(a,o,l*(o-r),l*(c-a))},initNonuniformCatmullRom:function(r,a,o,c,l,h,d){let u=(a-r)/l-(o-r)/(l+h)+(o-a)/h,f=(o-a)/h-(c-a)/(h+d)+(c-o)/d;u*=h,f*=h,i(a,o,u,f)},calc:function(r){let a=r*r,o=a*r;return s+t*r+e*a+n*o}}}var Sd=new w,Td=new w,fh=new qh,ph=new qh,mh=new qh,jo=class extends Mn{constructor(t=[],e=!1,n="centripetal",i=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=i}getPoint(t,e=new w){let n=e,i=this.points,r=i.length,a=(r-(this.closed?0:1))*t,o=Math.floor(a),c=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:c===0&&o===r-1&&(o=r-2,c=1);let l,h;this.closed||o>0?l=i[(o-1)%r]:(Td.subVectors(i[0],i[1]).add(i[0]),l=Td);let d=i[o%r],u=i[(o+1)%r];if(this.closed||o+2<r?h=i[(o+2)%r]:(Sd.subVectors(i[r-1],i[r-2]).add(i[r-1]),h=Sd),this.curveType==="centripetal"||this.curveType==="chordal"){let f=this.curveType==="chordal"?.5:.25,m=Math.pow(l.distanceToSquared(d),f),x=Math.pow(d.distanceToSquared(u),f),g=Math.pow(u.distanceToSquared(h),f);x<1e-4&&(x=1),m<1e-4&&(m=x),g<1e-4&&(g=x),fh.initNonuniformCatmullRom(l.x,d.x,u.x,h.x,m,x,g),ph.initNonuniformCatmullRom(l.y,d.y,u.y,h.y,m,x,g),mh.initNonuniformCatmullRom(l.z,d.z,u.z,h.z,m,x,g)}else this.curveType==="catmullrom"&&(fh.initCatmullRom(l.x,d.x,u.x,h.x,this.tension),ph.initCatmullRom(l.y,d.y,u.y,h.y,this.tension),mh.initCatmullRom(l.z,d.z,u.z,h.z,this.tension));return n.set(fh.calc(c),ph.calc(c),mh.calc(c)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let i=t.points[e];this.points.push(i.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let i=this.points[e];t.points.push(i.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let i=t.points[e];this.points.push(new w().fromArray(i))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}};function Ed(s,t,e,n,i){let r=(n-t)*.5,a=(i-e)*.5,o=s*s,c=s*o;return(2*e-2*n+r+a)*c+(-3*e+3*n-2*r-a)*o+r*s+e}function jm(s,t){let e=1-s;return e*e*t}function Qm(s,t){return 2*(1-s)*s*t}function t0(s,t){return s*s*t}function zr(s,t,e,n){return jm(s,t)+Qm(s,e)+t0(s,n)}function e0(s,t){let e=1-s;return e*e*e*t}function n0(s,t){let e=1-s;return 3*e*e*s*t}function i0(s,t){return 3*(1-s)*s*s*t}function s0(s,t){return s*s*s*t}function kr(s,t,e,n,i){return e0(s,t)+n0(s,e)+i0(s,n)+s0(s,i)}var aa=class extends Mn{constructor(t=new it,e=new it,n=new it,i=new it){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=i}getPoint(t,e=new it){let n=e,i=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(kr(t,i.x,r.x,a.x,o.x),kr(t,i.y,r.y,a.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},Qo=class extends Mn{constructor(t=new w,e=new w,n=new w,i=new w){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=i}getPoint(t,e=new w){let n=e,i=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(kr(t,i.x,r.x,a.x,o.x),kr(t,i.y,r.y,a.y,o.y),kr(t,i.z,r.z,a.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},oa=class extends Mn{constructor(t=new it,e=new it){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new it){let n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new it){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},tl=class extends Mn{constructor(t=new w,e=new w){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new w){let n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new w){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},la=class extends Mn{constructor(t=new it,e=new it,n=new it){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new it){let n=e,i=this.v0,r=this.v1,a=this.v2;return n.set(zr(t,i.x,r.x,a.x),zr(t,i.y,r.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},el=class extends Mn{constructor(t=new w,e=new w,n=new w){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new w){let n=e,i=this.v0,r=this.v1,a=this.v2;return n.set(zr(t,i.x,r.x,a.x),zr(t,i.y,r.y,a.y),zr(t,i.z,r.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},ca=class extends Mn{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new it){let n=e,i=this.points,r=(i.length-1)*t,a=Math.floor(r),o=r-a,c=i[a===0?a:a-1],l=i[a],h=i[a>i.length-2?i.length-1:a+1],d=i[a>i.length-3?i.length-1:a+2];return n.set(Ed(o,c.x,l.x,h.x,d.x),Ed(o,c.y,l.y,h.y,d.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let i=t.points[e];this.points.push(i.clone())}return this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let i=this.points[e];t.points.push(i.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let i=t.points[e];this.points.push(new it().fromArray(i))}return this}},Sh=Object.freeze({__proto__:null,ArcCurve:Ko,CatmullRomCurve3:jo,CubicBezierCurve:aa,CubicBezierCurve3:Qo,EllipseCurve:Js,LineCurve:oa,LineCurve3:tl,QuadraticBezierCurve:la,QuadraticBezierCurve3:el,SplineCurve:ca}),nl=class extends Mn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){let t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){let n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Sh[n](e,t))}return this}getPoint(t,e){let n=t*this.getLength(),i=this.getCurveLengths(),r=0;for(;r<i.length;){if(i[r]>=n){let a=i[r]-n,o=this.curves[r],c=o.getLength(),l=c===0?0:1-a/c;return o.getPointAt(l,e)}r++}return null}getLength(){let t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let t=[],e=0;for(let n=0,i=this.curves.length;n<i;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){let e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){let e=[],n;for(let i=0,r=this.curves;i<r.length;i++){let a=r[i],o=a.isEllipseCurve?t*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?t*a.points.length:t,c=a.getPoints(o);for(let l=0;l<c.length;l++){let h=c[l];n&&n.equals(h)||(e.push(h),n=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){let i=t.curves[e];this.curves.push(i.clone())}return this.autoClose=t.autoClose,this}toJSON(){let t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){let i=this.curves[e];t.curves.push(i.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){let i=t.curves[e];this.curves.push(new Sh[i.type]().fromJSON(i))}return this}},ha=class extends nl{constructor(t){super(),this.type="Path",this.currentPoint=new it,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){let n=new oa(this.currentPoint.clone(),new it(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,i){let r=new la(this.currentPoint.clone(),new it(t,e),new it(n,i));return this.curves.push(r),this.currentPoint.set(n,i),this}bezierCurveTo(t,e,n,i,r,a){let o=new aa(this.currentPoint.clone(),new it(t,e),new it(n,i),new it(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(t){let e=[this.currentPoint.clone()].concat(t),n=new ca(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,i,r,a){let o=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(t+o,e+c,n,i,r,a),this}absarc(t,e,n,i,r,a){return this.absellipse(t,e,n,n,i,r,a),this}ellipse(t,e,n,i,r,a,o,c){let l=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+l,e+h,n,i,r,a,o,c),this}absellipse(t,e,n,i,r,a,o,c){let l=new Js(t,e,n,i,r,a,o,c);if(this.curves.length>0){let d=l.getPoint(0);d.equals(this.currentPoint)||this.lineTo(d.x,d.y)}this.curves.push(l);let h=l.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){let t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}},Li=class extends ha{constructor(t){super(t),this.uuid=jn(),this.type="Shape",this.holes=[]}getPointsHoles(t){let e=[];for(let n=0,i=this.holes.length;n<i;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){let i=t.holes[e];this.holes.push(i.clone())}return this}toJSON(){let t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){let i=this.holes[e];t.holes.push(i.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){let i=t.holes[e];this.holes.push(new ha().fromJSON(i))}return this}};function r0(s,t,e=2){let n=t&&t.length,i=n?t[0]*e:s.length,r=Mf(s,0,i,e,!0),a=[];if(!r||r.next===r.prev)return a;let o,c,l;if(n&&(r=h0(s,t,r,e)),s.length>80*e){o=s[0],c=s[1];let h=o,d=c;for(let u=e;u<i;u+=e){let f=s[u],m=s[u+1];f<o&&(o=f),m<c&&(c=m),f>h&&(h=f),m>d&&(d=m)}l=Math.max(h-o,d-c),l=l!==0?32767/l:0}return ua(r,a,e,o,c,l,0),a}function Mf(s,t,e,n,i){let r;if(i===M0(s,t,e,n)>0)for(let a=t;a<e;a+=n)r=wd(a/n|0,s[a],s[a+1],r);else for(let a=e-n;a>=t;a-=n)r=wd(a/n|0,s[a],s[a+1],r);return r&&Zs(r,r.next)&&(fa(r),r=r.next),r}function ns(s,t){if(!s)return s;t||(t=s);let e=s,n;do if(n=!1,!e.steiner&&(Zs(e,e.next)||Pe(e.prev,e,e.next)===0)){if(fa(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function ua(s,t,e,n,i,r,a){if(!s)return;!a&&r&&m0(s,n,i,r);let o=s;for(;s.prev!==s.next;){let c=s.prev,l=s.next;if(r?o0(s,n,i,r):a0(s)){t.push(c.i,s.i,l.i),fa(s),s=l.next,o=l.next;continue}if(s=l,s===o){a?a===1?(s=l0(ns(s),t),ua(s,t,e,n,i,r,2)):a===2&&c0(s,t,e,n,i,r):ua(ns(s),t,e,n,i,r,1);break}}}function a0(s){let t=s.prev,e=s,n=s.next;if(Pe(t,e,n)>=0)return!1;let i=t.x,r=e.x,a=n.x,o=t.y,c=e.y,l=n.y,h=Math.min(i,r,a),d=Math.min(o,c,l),u=Math.max(i,r,a),f=Math.max(o,c,l),m=n.next;for(;m!==t;){if(m.x>=h&&m.x<=u&&m.y>=d&&m.y<=f&&Fr(i,o,r,c,a,l,m.x,m.y)&&Pe(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function o0(s,t,e,n){let i=s.prev,r=s,a=s.next;if(Pe(i,r,a)>=0)return!1;let o=i.x,c=r.x,l=a.x,h=i.y,d=r.y,u=a.y,f=Math.min(o,c,l),m=Math.min(h,d,u),x=Math.max(o,c,l),g=Math.max(h,d,u),p=Th(f,m,t,e,n),M=Th(x,g,t,e,n),S=s.prevZ,y=s.nextZ;for(;S&&S.z>=p&&y&&y.z<=M;){if(S.x>=f&&S.x<=x&&S.y>=m&&S.y<=g&&S!==i&&S!==a&&Fr(o,h,c,d,l,u,S.x,S.y)&&Pe(S.prev,S,S.next)>=0||(S=S.prevZ,y.x>=f&&y.x<=x&&y.y>=m&&y.y<=g&&y!==i&&y!==a&&Fr(o,h,c,d,l,u,y.x,y.y)&&Pe(y.prev,y,y.next)>=0))return!1;y=y.nextZ}for(;S&&S.z>=p;){if(S.x>=f&&S.x<=x&&S.y>=m&&S.y<=g&&S!==i&&S!==a&&Fr(o,h,c,d,l,u,S.x,S.y)&&Pe(S.prev,S,S.next)>=0)return!1;S=S.prevZ}for(;y&&y.z<=M;){if(y.x>=f&&y.x<=x&&y.y>=m&&y.y<=g&&y!==i&&y!==a&&Fr(o,h,c,d,l,u,y.x,y.y)&&Pe(y.prev,y,y.next)>=0)return!1;y=y.nextZ}return!0}function l0(s,t){let e=s;do{let n=e.prev,i=e.next.next;!Zs(n,i)&&Sf(n,e,e.next,i)&&da(n,i)&&da(i,n)&&(t.push(n.i,e.i,i.i),fa(e),fa(e.next),e=s=i),e=e.next}while(e!==s);return ns(e)}function c0(s,t,e,n,i,r){let a=s;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&_0(a,o)){let c=Tf(a,o);a=ns(a,a.next),c=ns(c,c.next),ua(a,t,e,n,i,r,0),ua(c,t,e,n,i,r,0);return}o=o.next}a=a.next}while(a!==s)}function h0(s,t,e,n){let i=[];for(let r=0,a=t.length;r<a;r++){let o=t[r]*n,c=r<a-1?t[r+1]*n:s.length,l=Mf(s,o,c,n,!1);l===l.next&&(l.steiner=!0),i.push(x0(l))}i.sort(u0);for(let r=0;r<i.length;r++)e=d0(i[r],e);return e}function u0(s,t){let e=s.x-t.x;if(e===0&&(e=s.y-t.y,e===0)){let n=(s.next.y-s.y)/(s.next.x-s.x),i=(t.next.y-t.y)/(t.next.x-t.x);e=n-i}return e}function d0(s,t){let e=f0(s,t);if(!e)return t;let n=Tf(e,s);return ns(n,n.next),ns(e,e.next)}function f0(s,t){let e=t,n=s.x,i=s.y,r=-1/0,a;if(Zs(s,e))return e;do{if(Zs(s,e.next))return e.next;if(i<=e.y&&i>=e.next.y&&e.next.y!==e.y){let d=e.x+(i-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(d<=n&&d>r&&(r=d,a=e.x<e.next.x?e:e.next,d===n))return a}e=e.next}while(e!==t);if(!a)return null;let o=a,c=a.x,l=a.y,h=1/0;e=a;do{if(n>=e.x&&e.x>=c&&n!==e.x&&bf(i<l?n:r,i,c,l,i<l?r:n,i,e.x,e.y)){let d=Math.abs(i-e.y)/(n-e.x);da(e,s)&&(d<h||d===h&&(e.x>a.x||e.x===a.x&&p0(a,e)))&&(a=e,h=d)}e=e.next}while(e!==o);return a}function p0(s,t){return Pe(s.prev,s,t.prev)<0&&Pe(t.next,s,s.next)<0}function m0(s,t,e,n){let i=s;do i.z===0&&(i.z=Th(i.x,i.y,t,e,n)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==s);i.prevZ.nextZ=null,i.prevZ=null,g0(i)}function g0(s){let t,e=1;do{let n=s,i;s=null;let r=null;for(t=0;n;){t++;let a=n,o=0;for(let l=0;l<e&&(o++,a=a.nextZ,!!a);l++);let c=e;for(;o>0||c>0&&a;)o!==0&&(c===0||!a||n.z<=a.z)?(i=n,n=n.nextZ,o--):(i=a,a=a.nextZ,c--),r?r.nextZ=i:s=i,i.prevZ=r,r=i;n=a}r.nextZ=null,e*=2}while(t>1);return s}function Th(s,t,e,n,i){return s=(s-e)*i|0,t=(t-n)*i|0,s=(s|s<<8)&16711935,s=(s|s<<4)&252645135,s=(s|s<<2)&858993459,s=(s|s<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,s|t<<1}function x0(s){let t=s,e=s;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==s);return e}function bf(s,t,e,n,i,r,a,o){return(i-a)*(t-o)>=(s-a)*(r-o)&&(s-a)*(n-o)>=(e-a)*(t-o)&&(e-a)*(r-o)>=(i-a)*(n-o)}function Fr(s,t,e,n,i,r,a,o){return!(s===a&&t===o)&&bf(s,t,e,n,i,r,a,o)}function _0(s,t){return s.next.i!==t.i&&s.prev.i!==t.i&&!v0(s,t)&&(da(s,t)&&da(t,s)&&y0(s,t)&&(Pe(s.prev,s,t.prev)||Pe(s,t.prev,t))||Zs(s,t)&&Pe(s.prev,s,s.next)>0&&Pe(t.prev,t,t.next)>0)}function Pe(s,t,e){return(t.y-s.y)*(e.x-t.x)-(t.x-s.x)*(e.y-t.y)}function Zs(s,t){return s.x===t.x&&s.y===t.y}function Sf(s,t,e,n){let i=Io(Pe(s,t,e)),r=Io(Pe(s,t,n)),a=Io(Pe(e,n,s)),o=Io(Pe(e,n,t));return!!(i!==r&&a!==o||i===0&&Po(s,e,t)||r===0&&Po(s,n,t)||a===0&&Po(e,s,n)||o===0&&Po(e,t,n))}function Po(s,t,e){return t.x<=Math.max(s.x,e.x)&&t.x>=Math.min(s.x,e.x)&&t.y<=Math.max(s.y,e.y)&&t.y>=Math.min(s.y,e.y)}function Io(s){return s>0?1:s<0?-1:0}function v0(s,t){let e=s;do{if(e.i!==s.i&&e.next.i!==s.i&&e.i!==t.i&&e.next.i!==t.i&&Sf(e,e.next,s,t))return!0;e=e.next}while(e!==s);return!1}function da(s,t){return Pe(s.prev,s,s.next)<0?Pe(s,t,s.next)>=0&&Pe(s,s.prev,t)>=0:Pe(s,t,s.prev)<0||Pe(s,s.next,t)<0}function y0(s,t){let e=s,n=!1,i=(s.x+t.x)/2,r=(s.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&i<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==s);return n}function Tf(s,t){let e=Eh(s.i,s.x,s.y),n=Eh(t.i,t.x,t.y),i=s.next,r=t.prev;return s.next=t,t.prev=s,e.next=i,i.prev=e,n.next=e,e.prev=n,r.next=n,n.prev=r,n}function wd(s,t,e,n){let i=Eh(s,t,e);return n?(i.next=n.next,i.prev=n,n.next.prev=i,n.next=i):(i.prev=i,i.next=i),i}function fa(s){s.next.prev=s.prev,s.prev.next=s.next,s.prevZ&&(s.prevZ.nextZ=s.nextZ),s.nextZ&&(s.nextZ.prevZ=s.prevZ)}function Eh(s,t,e){return{i:s,x:t,y:e,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function M0(s,t,e,n){let i=0;for(let r=t,a=e-n;r<e;r+=n)i+=(s[a]-s[r])*(s[r+1]+s[a+1]),a=r;return i}var wh=class{static triangulate(t,e,n=2){return r0(t,e,n)}},Kn=class s{static area(t){let e=t.length,n=0;for(let i=e-1,r=0;r<e;i=r++)n+=t[i].x*t[r].y-t[r].x*t[i].y;return n*.5}static isClockWise(t){return s.area(t)<0}static triangulateShape(t,e){let n=[],i=[],r=[];Ad(t),Rd(n,t);let a=t.length;e.forEach(Ad);for(let c=0;c<e.length;c++)i.push(a),a+=e[c].length,Rd(n,e[c]);let o=wh.triangulate(n,i);for(let c=0;c<o.length;c+=3)r.push(o.slice(c,c+3));return r}};function Ad(s){let t=s.length;t>2&&s[t-1].equals(s[0])&&s.pop()}function Rd(s,t){for(let e=0;e<t.length;e++)s.push(t[e].x),s.push(t[e].y)}var pa=class s extends ge{constructor(t=new Li([new it(.5,.5),new it(-.5,.5),new it(-.5,-.5),new it(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];let n=this,i=[],r=[];for(let o=0,c=t.length;o<c;o++){let l=t[o];a(l)}this.setAttribute("position",new qt(i,3)),this.setAttribute("uv",new qt(r,2)),this.computeVertexNormals();function a(o){let c=[],l=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,d=e.depth!==void 0?e.depth:1,u=e.bevelEnabled!==void 0?e.bevelEnabled:!0,f=e.bevelThickness!==void 0?e.bevelThickness:.2,m=e.bevelSize!==void 0?e.bevelSize:f-.1,x=e.bevelOffset!==void 0?e.bevelOffset:0,g=e.bevelSegments!==void 0?e.bevelSegments:3,p=e.extrudePath,M=e.UVGenerator!==void 0?e.UVGenerator:b0,S,y=!1,T,E,C,v;if(p){S=p.getSpacedPoints(h),y=!0,u=!1;let et=p.isCatmullRomCurve3?p.closed:!1;T=p.computeFrenetFrames(h,et),E=new w,C=new w,v=new w}u||(g=0,f=0,m=0,x=0);let A=o.extractPoints(l),I=A.shape,D=A.holes;if(!Kn.isClockWise(I)){I=I.reverse();for(let et=0,rt=D.length;et<rt;et++){let at=D[et];Kn.isClockWise(at)&&(D[et]=at.reverse())}}function V(et){let at=10000000000000001e-36,ot=et[0];for(let ht=1;ht<=et.length;ht++){let Ot=ht%et.length,It=et[Ot],Xt=It.x-ot.x,$t=It.y-ot.y,N=Xt*Xt+$t*$t,he=Math.max(Math.abs(It.x),Math.abs(It.y),Math.abs(ot.x),Math.abs(ot.y)),ne=at*he*he;if(N<=ne){et.splice(Ot,1),ht--;continue}ot=It}}V(I),D.forEach(V);let P=D.length,L=I;for(let et=0;et<P;et++){let rt=D[et];I=I.concat(rt)}function X(et,rt,at){return rt||Ht("ExtrudeGeometry: vec does not exist"),et.clone().addScaledVector(rt,at)}let k=I.length;function Z(et,rt,at){let ot,ht,Ot,It=et.x-rt.x,Xt=et.y-rt.y,$t=at.x-et.x,N=at.y-et.y,he=It*It+Xt*Xt,ne=It*N-Xt*$t;if(Math.abs(ne)>Number.EPSILON){let R=Math.sqrt(he),_=Math.sqrt($t*$t+N*N),O=rt.x-Xt/R,W=rt.y+It/R,K=at.x-N/_,ct=at.y+$t/_,pt=((K-O)*N-(ct-W)*$t)/(It*N-Xt*$t);ot=O+It*pt-et.x,ht=W+Xt*pt-et.y;let j=ot*ot+ht*ht;if(j<=2)return new it(ot,ht);Ot=Math.sqrt(j/2)}else{let R=!1;It>Number.EPSILON?$t>Number.EPSILON&&(R=!0):It<-Number.EPSILON?$t<-Number.EPSILON&&(R=!0):Math.sign(Xt)===Math.sign(N)&&(R=!0),R?(ot=-Xt,ht=It,Ot=Math.sqrt(he)):(ot=It,ht=Xt,Ot=Math.sqrt(he/2))}return new it(ot/Ot,ht/Ot)}let z=[];for(let et=0,rt=L.length,at=rt-1,ot=et+1;et<rt;et++,at++,ot++)at===rt&&(at=0),ot===rt&&(ot=0),z[et]=Z(L[et],L[at],L[ot]);let q=[],$,mt=z.concat();for(let et=0,rt=P;et<rt;et++){let at=D[et];$=[];for(let ot=0,ht=at.length,Ot=ht-1,It=ot+1;ot<ht;ot++,Ot++,It++)Ot===ht&&(Ot=0),It===ht&&(It=0),$[ot]=Z(at[ot],at[Ot],at[It]);q.push($),mt=mt.concat($)}let ft;if(g===0)ft=Kn.triangulateShape(L,D);else{let et=[],rt=[];for(let at=0;at<g;at++){let ot=at/g,ht=f*Math.cos(ot*Math.PI/2),Ot=m*Math.sin(ot*Math.PI/2)+x;for(let It=0,Xt=L.length;It<Xt;It++){let $t=X(L[It],z[It],Ot);dt($t.x,$t.y,-ht),ot===0&&et.push($t)}for(let It=0,Xt=P;It<Xt;It++){let $t=D[It];$=q[It];let N=[];for(let he=0,ne=$t.length;he<ne;he++){let R=X($t[he],$[he],Ot);dt(R.x,R.y,-ht),ot===0&&N.push(R)}ot===0&&rt.push(N)}}ft=Kn.triangulateShape(et,rt)}let Gt=ft.length,Wt=m+x;for(let et=0;et<k;et++){let rt=u?X(I[et],mt[et],Wt):I[et];y?(C.copy(T.normals[0]).multiplyScalar(rt.x),E.copy(T.binormals[0]).multiplyScalar(rt.y),v.copy(S[0]).add(C).add(E),dt(v.x,v.y,v.z)):dt(rt.x,rt.y,0)}for(let et=1;et<=h;et++)for(let rt=0;rt<k;rt++){let at=u?X(I[rt],mt[rt],Wt):I[rt];y?(C.copy(T.normals[et]).multiplyScalar(at.x),E.copy(T.binormals[et]).multiplyScalar(at.y),v.copy(S[et]).add(C).add(E),dt(v.x,v.y,v.z)):dt(at.x,at.y,d/h*et)}for(let et=g-1;et>=0;et--){let rt=et/g,at=f*Math.cos(rt*Math.PI/2),ot=m*Math.sin(rt*Math.PI/2)+x;for(let ht=0,Ot=L.length;ht<Ot;ht++){let It=X(L[ht],z[ht],ot);dt(It.x,It.y,d+at)}for(let ht=0,Ot=D.length;ht<Ot;ht++){let It=D[ht];$=q[ht];for(let Xt=0,$t=It.length;Xt<$t;Xt++){let N=X(It[Xt],$[Xt],ot);y?dt(N.x,N.y+S[h-1].y,S[h-1].x+at):dt(N.x,N.y,d+at)}}}jt(),J();function jt(){let et=i.length/3;if(u){let rt=0,at=k*rt;for(let ot=0;ot<Gt;ot++){let ht=ft[ot];Bt(ht[2]+at,ht[1]+at,ht[0]+at)}rt=h+g*2,at=k*rt;for(let ot=0;ot<Gt;ot++){let ht=ft[ot];Bt(ht[0]+at,ht[1]+at,ht[2]+at)}}else{for(let rt=0;rt<Gt;rt++){let at=ft[rt];Bt(at[2],at[1],at[0])}for(let rt=0;rt<Gt;rt++){let at=ft[rt];Bt(at[0]+k*h,at[1]+k*h,at[2]+k*h)}}n.addGroup(et,i.length/3-et,0)}function J(){let et=i.length/3,rt=0;Q(L,rt),rt+=L.length;for(let at=0,ot=D.length;at<ot;at++){let ht=D[at];Q(ht,rt),rt+=ht.length}n.addGroup(et,i.length/3-et,1)}function Q(et,rt){let at=et.length;for(;--at>=0;){let ot=at,ht=at-1;ht<0&&(ht=et.length-1);for(let Ot=0,It=h+g*2;Ot<It;Ot++){let Xt=k*Ot,$t=k*(Ot+1),N=rt+ot+Xt,he=rt+ht+Xt,ne=rt+ht+$t,R=rt+ot+$t;yt(N,he,ne,R)}}}function dt(et,rt,at){c.push(et),c.push(rt),c.push(at)}function Bt(et,rt,at){zt(et),zt(rt),zt(at);let ot=i.length/3,ht=M.generateTopUV(n,i,ot-3,ot-2,ot-1);ce(ht[0]),ce(ht[1]),ce(ht[2])}function yt(et,rt,at,ot){zt(et),zt(rt),zt(ot),zt(rt),zt(at),zt(ot);let ht=i.length/3,Ot=M.generateSideWallUV(n,i,ht-6,ht-3,ht-2,ht-1);ce(Ot[0]),ce(Ot[1]),ce(Ot[3]),ce(Ot[1]),ce(Ot[2]),ce(Ot[3])}function zt(et){i.push(c[et*3+0]),i.push(c[et*3+1]),i.push(c[et*3+2])}function ce(et){r.push(et.x),r.push(et.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return S0(e,n,t)}static fromJSON(t,e){let n=[];for(let r=0,a=t.shapes.length;r<a;r++){let o=e[t.shapes[r]];n.push(o)}let i=t.options.extrudePath;return i!==void 0&&(t.options.extrudePath=new Sh[i.type]().fromJSON(i)),new s(n,t.options)}},b0={generateTopUV:function(s,t,e,n,i){let r=t[e*3],a=t[e*3+1],o=t[n*3],c=t[n*3+1],l=t[i*3],h=t[i*3+1];return[new it(r,a),new it(o,c),new it(l,h)]},generateSideWallUV:function(s,t,e,n,i,r){let a=t[e*3],o=t[e*3+1],c=t[e*3+2],l=t[n*3],h=t[n*3+1],d=t[n*3+2],u=t[i*3],f=t[i*3+1],m=t[i*3+2],x=t[r*3],g=t[r*3+1],p=t[r*3+2];return Math.abs(o-h)<Math.abs(a-l)?[new it(a,1-c),new it(l,1-d),new it(u,1-m),new it(x,1-p)]:[new it(o,1-c),new it(h,1-d),new it(f,1-m),new it(g,1-p)]}};function S0(s,t,e){if(e.shapes=[],Array.isArray(s))for(let n=0,i=s.length;n<i;n++){let r=s[n];e.shapes.push(r.uuid)}else e.shapes.push(s.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}var ma=class s extends Zo{constructor(t=1,e=0){let n=(1+Math.sqrt(5))/2,i=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(i,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new s(t.radius,t.detail)}};var je=class s extends ge{constructor(t=1,e=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:i};let r=t/2,a=e/2,o=Math.floor(n),c=Math.floor(i),l=o+1,h=c+1,d=t/o,u=e/c,f=[],m=[],x=[],g=[];for(let p=0;p<h;p++){let M=p*u-a;for(let S=0;S<l;S++){let y=S*d-r;m.push(y,-M,0),x.push(0,0,1),g.push(S/o),g.push(1-p/c)}}for(let p=0;p<c;p++)for(let M=0;M<o;M++){let S=M+l*p,y=M+l*(p+1),T=M+1+l*(p+1),E=M+1+l*p;f.push(S,y,E),f.push(y,T,E)}this.setIndex(f),this.setAttribute("position",new qt(m,3)),this.setAttribute("normal",new qt(x,3)),this.setAttribute("uv",new qt(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.width,t.height,t.widthSegments,t.heightSegments)}},ga=class s extends ge{constructor(t=.5,e=1,n=32,i=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:n,phiSegments:i,thetaStart:r,thetaLength:a},n=Math.max(3,n),i=Math.max(1,i);let o=[],c=[],l=[],h=[],d=t,u=(e-t)/i,f=new w,m=new it;for(let x=0;x<=i;x++){for(let g=0;g<=n;g++){let p=r+g/n*a;f.x=d*Math.cos(p),f.y=d*Math.sin(p),c.push(f.x,f.y,f.z),l.push(0,0,1),m.x=(f.x/e+1)/2,m.y=(f.y/e+1)/2,h.push(m.x,m.y)}d+=u}for(let x=0;x<i;x++){let g=x*(n+1);for(let p=0;p<n;p++){let M=p+g,S=M,y=M+n+1,T=M+n+2,E=M+1;o.push(S,y,E),o.push(y,T,E)}}this.setIndex(o),this.setAttribute("position",new qt(c,3)),this.setAttribute("normal",new qt(l,3)),this.setAttribute("uv",new qt(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}},xa=class s extends ge{constructor(t=new Li([new it(0,.5),new it(-.5,-.5),new it(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};let n=[],i=[],r=[],a=[],o=0,c=0;if(Array.isArray(t)===!1)l(t);else for(let h=0;h<t.length;h++)l(t[h]),this.addGroup(o,c,h),o+=c,c=0;this.setIndex(n),this.setAttribute("position",new qt(i,3)),this.setAttribute("normal",new qt(r,3)),this.setAttribute("uv",new qt(a,2));function l(h){let d=i.length/3,u=h.extractPoints(e),f=u.shape,m=u.holes;Kn.isClockWise(f)===!1&&(f=f.reverse());for(let g=0,p=m.length;g<p;g++){let M=m[g];Kn.isClockWise(M)===!0&&(m[g]=M.reverse())}let x=Kn.triangulateShape(f,m);for(let g=0,p=m.length;g<p;g++){let M=m[g];f=f.concat(M)}for(let g=0,p=f.length;g<p;g++){let M=f[g];i.push(M.x,M.y,0),r.push(0,0,1),a.push(M.x,M.y)}for(let g=0,p=x.length;g<p;g++){let M=x[g],S=M[0]+d,y=M[1]+d,T=M[2]+d;n.push(S,y,T),c+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON(),e=this.parameters.shapes;return T0(e,t)}static fromJSON(t,e){let n=[];for(let i=0,r=t.shapes.length;i<r;i++){let a=e[t.shapes[i]];n.push(a)}return new s(n,t.curveSegments)}};function T0(s,t){if(t.shapes=[],Array.isArray(s))for(let e=0,n=s.length;e<n;e++){let i=s[e];t.shapes.push(i.uuid)}else t.shapes.push(s.uuid);return t}var is=class s extends ge{constructor(t=1,e=32,n=16,i=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:i,phiLength:r,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));let c=Math.min(a+o,Math.PI),l=0,h=[],d=new w,u=new w,f=[],m=[],x=[],g=[];for(let p=0;p<=n;p++){let M=[],S=p/n,y=a+S*o,T=t*Math.cos(y),E=Math.sqrt(t*t-T*T),C=0;p===0&&a===0?C=.5/e:p===n&&c===Math.PI&&(C=-.5/e);for(let v=0;v<=e;v++){let A=v/e,I=i+A*r;d.x=-E*Math.cos(I),d.y=T,d.z=E*Math.sin(I),m.push(d.x,d.y,d.z),u.copy(d).normalize(),x.push(u.x,u.y,u.z),g.push(A+C,1-S),M.push(l++)}h.push(M)}for(let p=0;p<n;p++)for(let M=0;M<e;M++){let S=h[p][M+1],y=h[p][M],T=h[p+1][M],E=h[p+1][M+1];(p!==0||a>0)&&f.push(S,y,E),(p!==n-1||c<Math.PI)&&f.push(y,T,E)}this.setIndex(f),this.setAttribute("position",new qt(m,3)),this.setAttribute("normal",new qt(x,3)),this.setAttribute("uv",new qt(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}};var xi=class s extends ge{constructor(t=1,e=.4,n=12,i=48,r=Math.PI*2,a=0,o=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:i,arc:r,thetaStart:a,thetaLength:o},n=Math.floor(n),i=Math.floor(i);let c=[],l=[],h=[],d=[],u=new w,f=new w,m=new w;for(let x=0;x<=n;x++){let g=a+x/n*o;for(let p=0;p<=i;p++){let M=p/i*r;f.x=(t+e*Math.cos(g))*Math.cos(M),f.y=(t+e*Math.cos(g))*Math.sin(M),f.z=e*Math.sin(g),l.push(f.x,f.y,f.z),u.x=t*Math.cos(M),u.y=t*Math.sin(M),m.subVectors(f,u).normalize(),h.push(m.x,m.y,m.z),d.push(p/i),d.push(x/n)}}for(let x=1;x<=n;x++)for(let g=1;g<=i;g++){let p=(i+1)*x+g-1,M=(i+1)*(x-1)+g-1,S=(i+1)*(x-1)+g,y=(i+1)*x+g;c.push(p,M,y),c.push(M,S,y)}this.setIndex(c),this.setAttribute("position",new qt(l,3)),this.setAttribute("normal",new qt(h,3)),this.setAttribute("uv",new qt(d,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc,t.thetaStart,t.thetaLength)}};function cs(s){let t={};for(let e in s){t[e]={};for(let n in s[e]){let i=s[e][n];if(Cd(i))i.isRenderTargetTexture?(Vt("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=i.clone();else if(Array.isArray(i))if(Cd(i[0])){let r=[];for(let a=0,o=i.length;a<o;a++)r[a]=i[a].clone();t[e][n]=r}else t[e][n]=i.slice();else t[e][n]=i}}return t}function sn(s){let t={};for(let e=0;e<s.length;e++){let n=cs(s[e]);for(let i in n)t[i]=n[i]}return t}function Cd(s){return s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)}function E0(s){let t=[];for(let e=0;e<s.length;e++)t.push(s[e].clone());return t}function Yh(s){let t=s.getRenderTarget();return t===null?s.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:te.workingColorSpace}var vi={clone:cs,merge:sn},w0=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,A0=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,we=class extends ni{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=w0,this.fragmentShader=A0,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=cs(t.uniforms),this.uniformsGroups=E0(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this.defaultAttributeValues=Object.assign({},t.defaultAttributeValues),this.index0AttributeName=t.index0AttributeName,this.uniformsNeedUpdate=t.uniformsNeedUpdate,this}toJSON(t){let e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(let i in this.uniforms){let a=this.uniforms[i].value;a&&a.isTexture?e.uniforms[i]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[i]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[i]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[i]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[i]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[i]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[i]={type:"m4",value:a.toArray()}:e.uniforms[i]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;let n={};for(let i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}fromJSON(t,e){if(super.fromJSON(t,e),t.uniforms!==void 0)for(let n in t.uniforms){let i=t.uniforms[n];switch(this.uniforms[n]={},i.type){case"t":this.uniforms[n].value=e[i.value]||null;break;case"c":this.uniforms[n].value=new lt().setHex(i.value);break;case"v2":this.uniforms[n].value=new it().fromArray(i.value);break;case"v3":this.uniforms[n].value=new w().fromArray(i.value);break;case"v4":this.uniforms[n].value=new Ae().fromArray(i.value);break;case"m3":this.uniforms[n].value=new Yt().fromArray(i.value);break;case"m4":this.uniforms[n].value=new oe().fromArray(i.value);break;default:this.uniforms[n].value=i.value}}if(t.defines!==void 0&&(this.defines=t.defines),t.vertexShader!==void 0&&(this.vertexShader=t.vertexShader),t.fragmentShader!==void 0&&(this.fragmentShader=t.fragmentShader),t.glslVersion!==void 0&&(this.glslVersion=t.glslVersion),t.extensions!==void 0)for(let n in t.extensions)this.extensions[n]=t.extensions[n];return t.lights!==void 0&&(this.lights=t.lights),t.clipping!==void 0&&(this.clipping=t.clipping),this}},Ks=class extends we{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},Re=class extends ni{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new lt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new lt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=rc,this.normalScale=new it(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new mi,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}},ss=class extends Re{constructor(t){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new it(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Qt(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new lt(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new lt(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new lt(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(t)}get anisotropy(){return this._anisotropy}set anisotropy(t){this._anisotropy>0!=t>0&&this.version++,this._anisotropy=t}get clearcoat(){return this._clearcoat}set clearcoat(t){this._clearcoat>0!=t>0&&this.version++,this._clearcoat=t}get iridescence(){return this._iridescence}set iridescence(t){this._iridescence>0!=t>0&&this.version++,this._iridescence=t}get dispersion(){return this._dispersion}set dispersion(t){this._dispersion>0!=t>0&&this.version++,this._dispersion=t}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(t){this._retroreflectivity>0!=t>0&&this.version++,this._retroreflectivity=t}get sheen(){return this._sheen}set sheen(t){this._sheen>0!=t>0&&this.version++,this._sheen=t}get transmission(){return this._transmission}set transmission(t){this._transmission>0!=t>0&&this.version++,this._transmission=t}copy(t){return super.copy(t),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=t.anisotropy,this.anisotropyRotation=t.anisotropyRotation,this.anisotropyMap=t.anisotropyMap,this.clearcoat=t.clearcoat,this.clearcoatMap=t.clearcoatMap,this.clearcoatRoughness=t.clearcoatRoughness,this.clearcoatRoughnessMap=t.clearcoatRoughnessMap,this.clearcoatNormalMap=t.clearcoatNormalMap,this.clearcoatNormalScale.copy(t.clearcoatNormalScale),this.dispersion=t.dispersion,this.ior=t.ior,this.iridescence=t.iridescence,this.iridescenceMap=t.iridescenceMap,this.iridescenceIOR=t.iridescenceIOR,this.iridescenceThicknessRange=[...t.iridescenceThicknessRange],this.iridescenceThicknessMap=t.iridescenceThicknessMap,this.retroreflectivity=t.retroreflectivity,this.sheen=t.sheen,this.sheenColor.copy(t.sheenColor),this.sheenColorMap=t.sheenColorMap,this.sheenRoughness=t.sheenRoughness,this.sheenRoughnessMap=t.sheenRoughnessMap,this.transmission=t.transmission,this.transmissionMap=t.transmissionMap,this.thickness=t.thickness,this.thicknessMap=t.thicknessMap,this.attenuationDistance=t.attenuationDistance,this.attenuationColor.copy(t.attenuationColor),this.specularIntensity=t.specularIntensity,this.specularIntensityMap=t.specularIntensityMap,this.specularColor.copy(t.specularColor),this.specularColorMap=t.specularColorMap,this}};var il=class extends ni{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=af,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},sl=class extends ni{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}};function Us(s,t){return!s||s.constructor===t?s:typeof t.BYTES_PER_ELEMENT=="number"?new t(s):Array.prototype.slice.call(s)}function gh(s){return s!==void 0&&s.inTangents!==void 0&&s.outTangents!==void 0}var Di=class{constructor(t,e,n,i){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new e.constructor(n),this.sampleValues=e,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,n=this._cachedIndex,i=e[n],r=e[n-1];n:{t:{let a;e:{i:if(!(t<i)){for(let o=n+2;;){if(i===void 0){if(t<r)break i;return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(r=i,i=e[++n],t<i)break t}a=e.length;break e}if(!(t>=r)){let o=e[1];t<o&&(n=2,r=o);for(let c=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===c)break;if(i=r,r=e[--n-1],t>=r)break t}a=n,n=0;break e}break n}for(;n<a;){let o=n+a>>>1;t<e[o]?a=o:n=o+1}if(i=e[n],r=e[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===void 0)return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,i)}return this.interpolate_(n,r,t,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,n=this.sampleValues,i=this.valueSize,r=t*i;for(let a=0;a!==i;++a)e[a]=n[r+a];return e}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},rl=class extends Di{constructor(t,e,n,i){super(t,e,n,i),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:vh,endingEnd:vh}}intervalChanged_(t,e,n){let i=this.parameterPositions,r=t-2,a=t+1,o=i[r],c=i[a];if(o===void 0)switch(this.getSettings_().endingStart){case yh:r=t,o=2*e-n;break;case Mh:r=i.length-2,o=e+i[r]-i[r+1];break;default:r=t,o=n}if(c===void 0)switch(this.getSettings_().endingEnd){case yh:a=t,c=2*n-e;break;case Mh:a=1,c=n+i[1]-i[0];break;default:a=t-1,c=e}let l=(n-e)*.5,h=this.valueSize;this._weightPrev=l/(e-o),this._weightNext=l/(c-n),this._offsetPrev=r*h,this._offsetNext=a*h}interpolate_(t,e,n,i){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=t*o,l=c-o,h=this._offsetPrev,d=this._offsetNext,u=this._weightPrev,f=this._weightNext,m=(n-e)/(i-e),x=m*m,g=x*m,p=-u*g+2*u*x-u*m,M=(1+u)*g+(-1.5-2*u)*x+(-.5+u)*m+1,S=(-1-f)*g+(1.5+f)*x+.5*m,y=f*g-f*x;for(let T=0;T!==o;++T)r[T]=p*a[h+T]+M*a[l+T]+S*a[c+T]+y*a[d+T];return r}},al=class extends Di{constructor(t,e,n,i){super(t,e,n,i)}interpolate_(t,e,n,i){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=t*o,l=c-o,h=(n-e)/(i-e),d=1-h;for(let u=0;u!==o;++u)r[u]=a[l+u]*d+a[c+u]*h;return r}},ol=class extends Di{constructor(t,e,n,i){super(t,e,n,i)}interpolate_(t){return this.copySampleValue_(t-1)}},ll=class extends Di{interpolate_(t,e,n,i){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=t*o,l=c-o,h=this.inTangents,d=this.outTangents;if(!h||!d){let m=(n-e)/(i-e),x=1-m;for(let g=0;g!==o;++g)r[g]=a[l+g]*x+a[c+g]*m;return r}let u=o*2,f=t-1;for(let m=0;m!==o;++m){let x=a[l+m],g=a[c+m],p=f*u+m*2,M=d[p],S=d[p+1],y=t*u+m*2,T=h[y],E=h[y+1],C=C0(n,e,M,T,i);r[m]=Ef(C,x,S,E,g)}return r}};function Ef(s,t,e,n,i){let r=1-s;return r*r*r*t+3*r*r*s*e+3*r*s*s*n+s*s*s*i}function R0(s,t,e,n,i){let r=1-s;return 3*r*r*(e-t)+6*r*s*(n-e)+3*s*s*(i-n)}function C0(s,t,e,n,i){let r=(s-t)/(i-t);for(let a=0;a<8;a++){let o=Ef(r,t,e,n,i)-s;if(Math.abs(o)<1e-10)break;let c=R0(r,t,e,n,i);if(Math.abs(c)<1e-10)break;r=Math.max(0,Math.min(1,r-o/c))}return r}var bn=class{constructor(t,e,n,i){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=Us(e,this.TimeBufferType),this.values=Us(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,n;if(e.toJSON!==this.toJSON)n=e.toJSON(t);else{n={name:t.name,times:Us(t.times,Array),values:Us(t.values,Array)};let i=t.getInterpolation();i!==t.DefaultInterpolation&&(n.interpolation=i),gh(t.settings)&&(n.settings={inTangents:Us(t.settings.inTangents,Array),outTangents:Us(t.settings.outTangents,Array)})}return n.type=t.ValueTypeName,n}InterpolantFactoryMethodDiscrete(t){return new ol(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new al(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new rl(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodBezier(t){let e=new ll(this.times,this.values,this.getValueSize(),t);return this.settings&&(e.inTangents=this.settings.inTangents,e.outTangents=this.settings.outTangents),e}setInterpolation(t){let e;switch(t){case Vr:e=this.InterpolantFactoryMethodDiscrete;break;case Wo:e=this.InterpolantFactoryMethodLinear;break;case No:e=this.InterpolantFactoryMethodSmooth;break;case _h:e=this.InterpolantFactoryMethodBezier;break}if(e===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return Vt("KeyframeTrack:",n),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Vr;case this.InterpolantFactoryMethodLinear:return Wo;case this.InterpolantFactoryMethodSmooth:return No;case this.InterpolantFactoryMethodBezier:return _h}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let n=0,i=e.length;n!==i;++n)e[n]+=t}return this}scale(t){if(t!==1){let e=this.times;for(let n=0,i=e.length;n!==i;++n)e[n]*=t;gh(this.settings)&&(Pd(this.settings.inTangents,t),Pd(this.settings.outTangents,t))}return this}trim(t,e){let n=this.times,i=n.length,r=0,a=i-1;for(;r!==i&&n[r]<t;)++r;for(;a!==-1&&n[a]>e;)--a;if(++a,r!==0||a!==i){r>=a&&(a=Math.max(a,1),r=a-1);let o=this.getValueSize();this.times=n.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(Ht("KeyframeTrack: Invalid value size in track.",this),t=!1);let n=this.times,i=this.values,r=n.length;r===0&&(Ht("KeyframeTrack: Track is empty.",this),t=!1);let a=null;for(let o=0;o!==r;o++){let c=n[o];if(typeof c=="number"&&isNaN(c)){Ht("KeyframeTrack: Time is not a valid number.",this,o,c),t=!1;break}if(a!==null&&a>c){Ht("KeyframeTrack: Out of order keys.",this,o,c,a),t=!1;break}a=c}if(i!==void 0&&gm(i))for(let o=0,c=i.length;o!==c;++o){let l=i[o];if(isNaN(l)){Ht("KeyframeTrack: Value is not a valid number.",this,o,l),t=!1;break}}return t}optimize(){let t=this.times.slice(),e=this.values.slice(),n=this.getValueSize(),i=this.getInterpolation()===No,r=t.length-1,a=1;for(let o=1;o<r;++o){let c=!1,l=t[o],h=t[o+1];if(l!==h&&(o!==1||l!==t[0]))if(i)c=!0;else{let d=o*n,u=d-n,f=d+n;for(let m=0;m!==n;++m){let x=e[d+m];if(x!==e[u+m]||x!==e[f+m]){c=!0;break}}}if(c){if(o!==a){t[a]=t[o];let d=o*n,u=a*n;for(let f=0;f!==n;++f)e[u+f]=e[d+f]}++a}}if(r>0){t[a]=t[r];for(let o=r*n,c=a*n,l=0;l!==n;++l)e[c+l]=e[o+l];++a}return a!==t.length?(this.times=t.slice(0,a),this.values=e.slice(0,a*n)):(this.times=t,this.values=e),this}clone(){let t=this.times.slice(),e=this.values.slice(),n=this.constructor,i=new n(this.name,t,e);return i.createInterpolant=this.createInterpolant,gh(this.settings)&&(i.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),i}};function Pd(s,t){for(let e=0,n=s.length;e!==n;e+=2)s[e]*=t}bn.prototype.ValueTypeName="";bn.prototype.TimeBufferType=Float32Array;bn.prototype.ValueBufferType=Float32Array;bn.prototype.DefaultInterpolation=Wo;var Ni=class extends bn{constructor(t,e,n){super(t,e,n)}};Ni.prototype.ValueTypeName="bool";Ni.prototype.ValueBufferType=Array;Ni.prototype.DefaultInterpolation=Vr;Ni.prototype.InterpolantFactoryMethodLinear=void 0;Ni.prototype.InterpolantFactoryMethodSmooth=void 0;var cl=class extends bn{constructor(t,e,n,i){super(t,e,n,i)}};cl.prototype.ValueTypeName="color";var hl=class extends bn{constructor(t,e,n,i){super(t,e,n,i)}};hl.prototype.ValueTypeName="number";var ul=class extends Di{constructor(t,e,n,i){super(t,e,n,i)}interpolate_(t,e,n,i){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=(n-e)/(i-e),l=t*o;for(let h=l+o;l!==h;l+=4)re.slerpFlat(r,0,a,l-o,a,l,c);return r}},_a=class extends bn{constructor(t,e,n,i){super(t,e,n,i)}InterpolantFactoryMethodLinear(t){return new ul(this.times,this.values,this.getValueSize(),t)}};_a.prototype.ValueTypeName="quaternion";_a.prototype.InterpolantFactoryMethodSmooth=void 0;var Ui=class extends bn{constructor(t,e,n){super(t,e,n)}};Ui.prototype.ValueTypeName="string";Ui.prototype.ValueBufferType=Array;Ui.prototype.DefaultInterpolation=Vr;Ui.prototype.InterpolantFactoryMethodLinear=void 0;Ui.prototype.InterpolantFactoryMethodSmooth=void 0;var dl=class extends bn{constructor(t,e,n,i){super(t,e,n,i)}};dl.prototype.ValueTypeName="vector";var fl=class{constructor(t,e,n){let i=this,r=!1,a=0,o=0,c,l=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this._abortController=null,this.itemStart=function(h){o++,r===!1&&i.onStart!==void 0&&i.onStart(h,a,o),r=!0},this.itemEnd=function(h){a++,i.onProgress!==void 0&&i.onProgress(h,a,o),a===o&&(r=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(h){i.onError!==void 0&&i.onError(h)},this.resolveURL=function(h){return h=h.normalize("NFC"),c?c(h):h},this.setURLModifier=function(h){return c=h,this},this.addHandler=function(h,d){return l.push(h,d),this},this.removeHandler=function(h){let d=l.indexOf(h);return d!==-1&&l.splice(d,2),this},this.getHandler=function(h){for(let d=0,u=l.length;d<u;d+=2){let f=l[d],m=l[d+1];if(f.global&&(f.lastIndex=0),f.test(h))return m}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},wf=new fl,pl=class{constructor(t){this.manager=t!==void 0?t:wf,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(t,e){let n=this;return new Promise(function(i,r){n.load(t,i,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}abort(){return this}};pl.DEFAULT_MATERIAL_NAME="__DEFAULT";var va=class extends Xe{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new lt(t),this.intensity=e}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){let e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,e}},ya=class extends va{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Xe.DEFAULT_UP),this.updateMatrix(),this.groundColor=new lt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}toJSON(t){let e=super.toJSON(t);return e.object.groundColor=this.groundColor.getHex(),e}},xh=new oe,Id=new w,Ld=new w,ml=class{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new it(512,512),this.mapType=xn,this.map=null,this.mapPass=null,this.matrix=new oe,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new qs,this._frameExtents=new it(1,1),this._viewportCount=1,this._viewports=[new Ae(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(t){let e=this.camera;Id.setFromMatrixPosition(t.matrixWorld),e.position.copy(Id),Ld.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Ld),e.updateMatrixWorld(),this._updateMatrix(e,this.matrix,this._frustum)}_updateMatrix(t,e,n,i){xh.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),n.setFromProjectionMatrix(xh,t.coordinateSystem,t.reversedDepth);let r=this._frameExtents,a=i?i.z/r.x:1,o=i?i.w/r.y:1,c=i?i.x/r.x:0,l=i?i.y/r.y:0;t.coordinateSystem===ks||t.reversedDepth?e.set(.5*a,0,0,.5*a+c,0,.5*o,0,.5*o+l,0,0,1,0,0,0,0,1):e.set(.5*a,0,0,.5*a+c,0,.5*o,0,.5*o+l,0,0,.5,.5,0,0,0,1),e.multiply(xh)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this.biasNode=t.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let t={};return t.intensity=this.intensity,t.bias=this.bias,t.normalBias=this.normalBias,t.radius=this.radius,t.blurSamples=this.blurSamples,t.mapSize=this.mapSize.toArray(),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}},Lo=new w,Do=new re,Jn=new w,Ma=class extends Xe{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new oe,this.projectionMatrix=new oe,this.projectionMatrixInverse=new oe,this.coordinateSystem=Vn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorld.decompose(Lo,Do,Jn),Jn.x===1&&Jn.y===1&&Jn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Lo,Do,Jn.set(1,1,1)).invert()}updateWorldMatrix(t,e,n=!1){super.updateWorldMatrix(t,e,n),this.matrixWorld.decompose(Lo,Do,Jn),Jn.x===1&&Jn.y===1&&Jn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Lo,Do,Jn.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},Pi=new w,Dd=new it,Nd=new it,Ze=class extends Ma{constructor(t=50,e=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=.5*this.getFilmHeight()/t;this.fov=Hs*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(Br*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Hs*2*Math.atan(Math.tan(Br*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Pi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Pi.x,Pi.y).multiplyScalar(-t/Pi.z),Pi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Pi.x,Pi.y).multiplyScalar(-t/Pi.z)}getViewSize(t,e){return this.getViewBounds(t,Dd,Nd),e.subVectors(Nd,Dd)}setViewOffset(t,e,n,i,r,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan(Br*.5*this.fov)/this.zoom,n=2*e,i=this.aspect*n,r=-.5*i,a=this.view;if(this.view!==null&&this.view.enabled){let c=a.fullWidth,l=a.fullHeight;r+=a.offsetX*i/c,e-=a.offsetY*n/l,i*=a.width/c,n*=a.height/l}let o=this.filmOffset;o!==0&&(r+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}};var Fi=class extends Ma{constructor(t=-1,e=1,n=1,i=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=i,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,i,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2,r=n-t,a=n+t,o=i+e,c=i-e;if(this.view!==null&&this.view.enabled){let l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,a=r+l*this.view.width,o-=h*this.view.offsetY,c=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}},Ah=class extends ml{constructor(){super(new Fi(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},ba=class extends va{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Xe.DEFAULT_UP),this.updateMatrix(),this.target=new Xe,this.shadow=new Ah}dispose(){super.dispose(),this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}toJSON(t){let e=super.toJSON(t);return e.object.shadow=this.shadow.toJSON(),e.object.target=this.target.uuid,e}};var Fs=-90,Bs=1,gl=class extends Xe{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let i=new Ze(Fs,Bs,t,e);i.layers=this.layers,this.add(i);let r=new Ze(Fs,Bs,t,e);r.layers=this.layers,this.add(r);let a=new Ze(Fs,Bs,t,e);a.layers=this.layers,this.add(a);let o=new Ze(Fs,Bs,t,e);o.layers=this.layers,this.add(o);let c=new Ze(Fs,Bs,t,e);c.layers=this.layers,this.add(c);let l=new Ze(Fs,Bs,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){let t=this.coordinateSystem,e=this.children.concat(),[n,i,r,a,o,c]=e;for(let l of e)this.remove(l);if(t===Vn)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===ks)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[r,a,o,c,l,h]=this.children,d=t.getRenderTarget(),u=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),m=t.xr.enabled;t.xr.enabled=!1;let x=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let g=!1;t.isWebGLRenderer===!0?g=t.state.buffers.depth.getReversed():g=t.reversedDepthBuffer,t.setRenderTarget(n,0,i),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,r),t.setRenderTarget(n,1,i),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,a),t.setRenderTarget(n,2,i),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,o),t.setRenderTarget(n,3,i),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,c),t.setRenderTarget(n,4,i),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,l),n.texture.generateMipmaps=x,t.setRenderTarget(n,5,i),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,h),t.setRenderTarget(d,u,f),t.xr.enabled=m,n.texture.needsPMREMUpdate=!0}},xl=class extends Ze{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}},Sa=class{constructor(){this._previousTime=0,this._currentTime=0,this._startTime=performance.now(),this._delta=0,this._elapsed=0,this._timescale=1,this._document=null,this._pageVisibilityHandler=null}connect(t){this._document=t,t.hidden!==void 0&&(this._pageVisibilityHandler=P0.bind(this),t.addEventListener("visibilitychange",this._pageVisibilityHandler,!1))}disconnect(){this._pageVisibilityHandler!==null&&(this._document.removeEventListener("visibilitychange",this._pageVisibilityHandler),this._pageVisibilityHandler=null),this._document=null}getDelta(){return this._delta/1e3}getElapsed(){return this._elapsed/1e3}getTimescale(){return this._timescale}setTimescale(t){return this._timescale=t,this}reset(){return this._currentTime=performance.now()-this._startTime,this}dispose(){this.disconnect()}update(t){return this._pageVisibilityHandler!==null&&this._document.hidden===!0?this._delta=0:(this._previousTime=this._currentTime,this._currentTime=(t!==void 0?t:performance.now())-this._startTime,this._delta=(this._currentTime-this._previousTime)*this._timescale,this._elapsed+=this._delta),this}};function P0(){this._document.hidden===!1&&this.reset()}var $h="\\[\\]\\.:\\/",I0=new RegExp("["+$h+"]","g"),Jh="[^"+$h+"]",L0="[^"+$h.replace("\\.","")+"]",D0=/((?:WC+[\/:])*)/.source.replace("WC",Jh),N0=/(WCOD+)?/.source.replace("WCOD",L0),U0=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Jh),F0=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Jh),B0=new RegExp("^"+D0+N0+U0+F0+"$"),O0=["material","materials","bones","map"],Rh=class{constructor(t,e,n){let i=n||Ee.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,i)}getValue(t,e){this.bind();let n=this._targetGroup.nCachedObjects_,i=this._bindings[n];i!==void 0&&i.getValue(t,e)}setValue(t,e){let n=this._bindings;for(let i=this._targetGroup.nCachedObjects_,r=n.length;i!==r;++i)n[i].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].unbind()}},Ee=class s{constructor(t,e,n){this.path=e,this.parsedPath=n||s.parseTrackName(e),this.node=s.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,n){return t&&t.isAnimationObjectGroup?new s.Composite(t,e,n):new s(t,e,n)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(I0,"")}static parseTrackName(t){let e=B0.exec(t);if(e===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+t);let n={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){let r=n.nodeName.substring(i+1);O0.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,i),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+t);return n}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let n=t.skeleton.getBoneByName(e);if(n!==void 0)return n}if(t.children){let n=function(r){for(let a=0;a<r.length;a++){let o=r[a];if(o.name===e||o.uuid===e)return o;let c=n(o.children);if(c)return c}return null},i=n(t.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)t[e++]=n[i]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,n=e.objectName,i=e.propertyName,r=e.propertyIndex;if(t||(t=s.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){Vt("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let l=e.objectIndex;switch(n){case"materials":if(!t.material){Ht("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){Ht("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){Ht("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let h=0;h<t.length;h++)if(t[h].name===l){l=h;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){Ht("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){Ht("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[n]===void 0){Ht("PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[n]}if(l!==void 0){if(t[l]===void 0){Ht("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[l]}}let a=t[i];if(a===void 0){let l=e.nodeName;Ht("PropertyBinding: Trying to update property for track: "+l+"."+i+" but it wasn't found.",t);return}let o=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?o=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(r!==void 0){if(i==="morphTargetInfluences"){if(!t.geometry){Ht("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){Ht("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}c=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(c=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=i;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Ee.Composite=Rh;Ee.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Ee.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Ee.prototype.GetterByBindingType=[Ee.prototype._getValue_direct,Ee.prototype._getValue_array,Ee.prototype._getValue_arrayElement,Ee.prototype._getValue_toArray];Ee.prototype.SetterByBindingTypeAndVersioning=[[Ee.prototype._setValue_direct,Ee.prototype._setValue_direct_setNeedsUpdate,Ee.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Ee.prototype._setValue_array,Ee.prototype._setValue_array_setNeedsUpdate,Ee.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Ee.prototype._setValue_arrayElement,Ee.prototype._setValue_arrayElement_setNeedsUpdate,Ee.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Ee.prototype._setValue_fromArray,Ee.prototype._setValue_fromArray_setNeedsUpdate,Ee.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var mM=new Float32Array(1);var eu=class eu{constructor(t,e,n,i){this.elements=[1,0,0,1],t!==void 0&&this.set(t,e,n,i)}identity(){return this.set(1,0,0,1),this}fromArray(t,e=0){for(let n=0;n<4;n++)this.elements[n]=t[n+e];return this}set(t,e,n,i){let r=this.elements;return r[0]=t,r[2]=e,r[1]=n,r[3]=i,this}};eu.prototype.isMatrix2=!0;var Ch=eu;function Zh(s,t,e,n){let i=z0(n);switch(e){case Vh:return s*t;case El:return s*t/i.components*i.byteLength;case wl:return s*t/i.components*i.byteLength;case Hi:return s*t*2/i.components*i.byteLength;case Al:return s*t*2/i.components*i.byteLength;case Hh:return s*t*3/i.components*i.byteLength;case In:return s*t*4/i.components*i.byteLength;case Rl:return s*t*4/i.components*i.byteLength;case La:case Da:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*8;case Na:case Ua:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case Pl:case Ll:return Math.max(s,16)*Math.max(t,8)/4;case Cl:case Il:return Math.max(s,8)*Math.max(t,8)/2;case Dl:case Nl:case Fl:case Bl:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*8;case Ul:case Fa:case Ol:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case zl:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case kl:return Math.floor((s+4)/5)*Math.floor((t+3)/4)*16;case Vl:return Math.floor((s+4)/5)*Math.floor((t+4)/5)*16;case Hl:return Math.floor((s+5)/6)*Math.floor((t+4)/5)*16;case Gl:return Math.floor((s+5)/6)*Math.floor((t+5)/6)*16;case Wl:return Math.floor((s+7)/8)*Math.floor((t+4)/5)*16;case Xl:return Math.floor((s+7)/8)*Math.floor((t+5)/6)*16;case ql:return Math.floor((s+7)/8)*Math.floor((t+7)/8)*16;case Yl:return Math.floor((s+9)/10)*Math.floor((t+4)/5)*16;case $l:return Math.floor((s+9)/10)*Math.floor((t+5)/6)*16;case Jl:return Math.floor((s+9)/10)*Math.floor((t+7)/8)*16;case Zl:return Math.floor((s+9)/10)*Math.floor((t+9)/10)*16;case Kl:return Math.floor((s+11)/12)*Math.floor((t+9)/10)*16;case jl:return Math.floor((s+11)/12)*Math.floor((t+11)/12)*16;case Ql:case tc:case ec:return Math.ceil(s/4)*Math.ceil(t/4)*16;case nc:case ic:return Math.ceil(s/4)*Math.ceil(t/4)*8;case Ba:case sc:return Math.ceil(s/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function z0(s){switch(s){case xn:case Bh:return{byteLength:1,components:1};case Qs:case Oh:case ze:return{byteLength:2,components:1};case Sl:case Tl:return{byteLength:2,components:4};case Wn:case bl:case Pn:return{byteLength:4,components:1};case zh:case kh:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${s}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"186"}}));typeof window<"u"&&(window.__THREE__?Vt("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="186");function $f(){let s=null,t=!1,e=null,n=null;function i(r,a){n=s.requestAnimationFrame(i),e(r,a)}return{start:function(){t!==!0&&e!==null&&s!==null&&(n=s.requestAnimationFrame(i),t=!0)},stop:function(){s!==null&&s.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){s=r}}}function V0(s){let t=new WeakMap;function e(o,c){let l=o.array,h=o.usage,d=l.byteLength,u=s.createBuffer();s.bindBuffer(c,u),s.bufferData(c,l,h),o.onUploadCallback();let f;if(l instanceof Float32Array)f=s.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)f=s.HALF_FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?f=s.HALF_FLOAT:f=s.UNSIGNED_SHORT;else if(l instanceof Int16Array)f=s.SHORT;else if(l instanceof Uint32Array)f=s.UNSIGNED_INT;else if(l instanceof Int32Array)f=s.INT;else if(l instanceof Int8Array)f=s.BYTE;else if(l instanceof Uint8Array)f=s.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)f=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:u,type:f,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:d}}function n(o,c,l){let h=c.array,d=c.updateRanges;if(s.bindBuffer(l,o),d.length===0)s.bufferSubData(l,0,h);else{d.sort((f,m)=>f.start-m.start);let u=0;for(let f=1;f<d.length;f++){let m=d[u],x=d[f];x.start<=m.start+m.count+1?m.count=Math.max(m.count,x.start+x.count-m.start):(++u,d[u]=x)}d.length=u+1;for(let f=0,m=d.length;f<m;f++){let x=d[f];s.bufferSubData(l,x.start*h.BYTES_PER_ELEMENT,h,x.start,x.count)}c.clearUpdateRanges()}c.onUploadCallback()}function i(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);let c=t.get(o);c&&(s.deleteBuffer(c.buffer),t.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){let h=t.get(o);(!h||h.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}let l=t.get(o);if(l===void 0)t.set(o,e(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,o,c),l.version=o.version}}return{get:i,remove:r,update:a}}var H0=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,G0=`#ifdef USE_ALPHAHASH
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
#endif`,W0=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,X0=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,q0=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Y0=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,$0=`#ifdef USE_AOMAP
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
#endif`,J0=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Z0=`#ifdef USE_BATCHING
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
#endif`,K0=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,j0=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Q0=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,tg=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,eg=`#ifdef USE_IRIDESCENCE
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
#endif`,ng=`#ifdef USE_BUMPMAP
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
#endif`,ig=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,sg=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,rg=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,ag=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,og=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,lg=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,cg=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,hg=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,ug=`#define PI 3.141592653589793
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
} // validated`,dg=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,fg=`vec3 transformedNormal = objectNormal;
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
#endif`,pg=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,mg=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,gg=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,xg=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,_g="gl_FragColor = linearToOutputTexel( gl_FragColor );",vg=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,yg=`#ifdef USE_ENVMAP
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
#endif`,Mg=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,bg=`#ifdef USE_ENVMAP
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
#endif`,Sg=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Tg=`#ifdef USE_ENVMAP
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
#endif`,Eg=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,wg=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Ag=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Rg=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Cg=`#ifdef USE_GRADIENTMAP
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
}`,Pg=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Ig=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Lg=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Dg=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,Ng=`#ifdef USE_ENVMAP
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
#endif`,Ug=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Fg=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Bg=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Og=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,zg=`PhysicalMaterial material;
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
#endif`,kg=`uniform sampler2D dfgLUT;
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
}`,Vg=`
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
#endif`,Hg=`#if defined( RE_IndirectDiffuse )
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
#endif`,Gg=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Wg=`#ifdef USE_LIGHT_PROBES_GRID
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
#endif`,Xg=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,qg=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Yg=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,$g=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Jg=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Zg=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Kg=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,jg=`#if defined( USE_POINTS_UV )
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
#endif`,Qg=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,tx=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,ex=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,nx=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,ix=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,sx=`#ifdef USE_MORPHTARGETS
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
#endif`,rx=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,ax=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,ox=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,lx=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,cx=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,hx=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,ux=`#ifdef USE_NORMALMAP
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
#endif`,dx=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,fx=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,px=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,mx=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,gx=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,xx=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,_x=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,vx=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,yx=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Mx=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,bx=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Sx=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Tx=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Ex=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,wx=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Ax=`float getShadowMask() {
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
}`,Rx=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Cx=`#ifdef USE_SKINNING
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
#endif`,Px=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Ix=`#ifdef USE_SKINNING
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
#endif`,Lx=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Dx=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Nx=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Ux=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Fx=`#ifdef USE_TRANSMISSION
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
#endif`,Bx=`#ifdef USE_TRANSMISSION
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
#endif`,Ox=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,zx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,kx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Vx=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,Hx=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Gx=`uniform sampler2D t2D;
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
}`,Wx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Xx=`#ifdef ENVMAP_TYPE_CUBE
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
}`,qx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Yx=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,$x=`#include <common>
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
}`,Jx=`#if DEPTH_PACKING == 3200
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
}`,Zx=`#define DISTANCE
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
}`,Kx=`#define DISTANCE
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
}`,jx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Qx=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,t_=`uniform float scale;
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
}`,e_=`uniform vec3 diffuse;
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
}`,n_=`#include <common>
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
}`,i_=`uniform vec3 diffuse;
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
}`,s_=`#define LAMBERT
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
}`,r_=`#define LAMBERT
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
}`,a_=`#define MATCAP
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
}`,o_=`#define MATCAP
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
}`,l_=`#define NORMAL
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
}`,c_=`#define NORMAL
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
}`,h_=`#define PHONG
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
}`,u_=`#define PHONG
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
}`,d_=`#define STANDARD
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
}`,f_=`#define STANDARD
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
}`,p_=`#define TOON
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
}`,m_=`#define TOON
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
}`,g_=`uniform float size;
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
}`,x_=`uniform vec3 diffuse;
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
}`,__=`#include <common>
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
}`,v_=`uniform vec3 color;
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
}`,y_=`uniform float rotation;
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
}`,M_=`uniform vec3 diffuse;
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
}`,Kt={alphahash_fragment:H0,alphahash_pars_fragment:G0,alphamap_fragment:W0,alphamap_pars_fragment:X0,alphatest_fragment:q0,alphatest_pars_fragment:Y0,aomap_fragment:$0,aomap_pars_fragment:J0,batching_pars_vertex:Z0,batching_vertex:K0,begin_vertex:j0,beginnormal_vertex:Q0,bsdfs:tg,iridescence_fragment:eg,bumpmap_pars_fragment:ng,clipping_planes_fragment:ig,clipping_planes_pars_fragment:sg,clipping_planes_pars_vertex:rg,clipping_planes_vertex:ag,color_fragment:og,color_pars_fragment:lg,color_pars_vertex:cg,color_vertex:hg,common:ug,cube_uv_reflection_fragment:dg,defaultnormal_vertex:fg,displacementmap_pars_vertex:pg,displacementmap_vertex:mg,emissivemap_fragment:gg,emissivemap_pars_fragment:xg,colorspace_fragment:_g,colorspace_pars_fragment:vg,envmap_fragment:yg,envmap_common_pars_fragment:Mg,envmap_pars_fragment:bg,envmap_pars_vertex:Sg,envmap_physical_pars_fragment:Ng,envmap_vertex:Tg,fog_vertex:Eg,fog_pars_vertex:wg,fog_fragment:Ag,fog_pars_fragment:Rg,gradientmap_pars_fragment:Cg,lightmap_pars_fragment:Pg,lights_lambert_fragment:Ig,lights_lambert_pars_fragment:Lg,lights_pars_begin:Dg,lights_toon_fragment:Ug,lights_toon_pars_fragment:Fg,lights_phong_fragment:Bg,lights_phong_pars_fragment:Og,lights_physical_fragment:zg,lights_physical_pars_fragment:kg,lights_fragment_begin:Vg,lights_fragment_maps:Hg,lights_fragment_end:Gg,lightprobes_pars_fragment:Wg,logdepthbuf_fragment:Xg,logdepthbuf_pars_fragment:qg,logdepthbuf_pars_vertex:Yg,logdepthbuf_vertex:$g,map_fragment:Jg,map_pars_fragment:Zg,map_particle_fragment:Kg,map_particle_pars_fragment:jg,metalnessmap_fragment:Qg,metalnessmap_pars_fragment:tx,morphinstance_vertex:ex,morphcolor_vertex:nx,morphnormal_vertex:ix,morphtarget_pars_vertex:sx,morphtarget_vertex:rx,normal_fragment_begin:ax,normal_fragment_maps:ox,normal_pars_fragment:lx,normal_pars_vertex:cx,normal_vertex:hx,normalmap_pars_fragment:ux,clearcoat_normal_fragment_begin:dx,clearcoat_normal_fragment_maps:fx,clearcoat_pars_fragment:px,iridescence_pars_fragment:mx,opaque_fragment:gx,packing:xx,premultiplied_alpha_fragment:_x,project_vertex:vx,dithering_fragment:yx,dithering_pars_fragment:Mx,roughnessmap_fragment:bx,roughnessmap_pars_fragment:Sx,shadowmap_pars_fragment:Tx,shadowmap_pars_vertex:Ex,shadowmap_vertex:wx,shadowmask_pars_fragment:Ax,skinbase_vertex:Rx,skinning_pars_vertex:Cx,skinning_vertex:Px,skinnormal_vertex:Ix,specularmap_fragment:Lx,specularmap_pars_fragment:Dx,tonemapping_fragment:Nx,tonemapping_pars_fragment:Ux,transmission_fragment:Fx,transmission_pars_fragment:Bx,uv_pars_fragment:Ox,uv_pars_vertex:zx,uv_vertex:kx,worldpos_vertex:Vx,background_vert:Hx,background_frag:Gx,backgroundCube_vert:Wx,backgroundCube_frag:Xx,cube_vert:qx,cube_frag:Yx,depth_vert:$x,depth_frag:Jx,distance_vert:Zx,distance_frag:Kx,equirect_vert:jx,equirect_frag:Qx,linedashed_vert:t_,linedashed_frag:e_,meshbasic_vert:n_,meshbasic_frag:i_,meshlambert_vert:s_,meshlambert_frag:r_,meshmatcap_vert:a_,meshmatcap_frag:o_,meshnormal_vert:l_,meshnormal_frag:c_,meshphong_vert:h_,meshphong_frag:u_,meshphysical_vert:d_,meshphysical_frag:f_,meshtoon_vert:p_,meshtoon_frag:m_,points_vert:g_,points_frag:x_,shadow_vert:__,shadow_frag:v_,sprite_vert:y_,sprite_frag:M_},bt={common:{diffuse:{value:new lt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Yt},alphaMap:{value:null},alphaMapTransform:{value:new Yt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Yt}},envmap:{envMap:{value:null},envMapRotation:{value:new Yt},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Yt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Yt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Yt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Yt},normalScale:{value:new it(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Yt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Yt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Yt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Yt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new lt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new w},probesMax:{value:new w},probesResolution:{value:new w}},points:{diffuse:{value:new lt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Yt},alphaTest:{value:0},uvTransform:{value:new Yt}},sprite:{diffuse:{value:new lt(16777215)},opacity:{value:1},center:{value:new it(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Yt},alphaMap:{value:null},alphaMapTransform:{value:new Yt},alphaTest:{value:0}}},si={basic:{uniforms:sn([bt.common,bt.specularmap,bt.envmap,bt.aomap,bt.lightmap,bt.fog]),vertexShader:Kt.meshbasic_vert,fragmentShader:Kt.meshbasic_frag},lambert:{uniforms:sn([bt.common,bt.specularmap,bt.envmap,bt.aomap,bt.lightmap,bt.emissivemap,bt.bumpmap,bt.normalmap,bt.displacementmap,bt.fog,bt.lights,{emissive:{value:new lt(0)},envMapIntensity:{value:1}}]),vertexShader:Kt.meshlambert_vert,fragmentShader:Kt.meshlambert_frag},phong:{uniforms:sn([bt.common,bt.specularmap,bt.envmap,bt.aomap,bt.lightmap,bt.emissivemap,bt.bumpmap,bt.normalmap,bt.displacementmap,bt.fog,bt.lights,{emissive:{value:new lt(0)},specular:{value:new lt(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Kt.meshphong_vert,fragmentShader:Kt.meshphong_frag},standard:{uniforms:sn([bt.common,bt.envmap,bt.aomap,bt.lightmap,bt.emissivemap,bt.bumpmap,bt.normalmap,bt.displacementmap,bt.roughnessmap,bt.metalnessmap,bt.fog,bt.lights,{emissive:{value:new lt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Kt.meshphysical_vert,fragmentShader:Kt.meshphysical_frag},toon:{uniforms:sn([bt.common,bt.aomap,bt.lightmap,bt.emissivemap,bt.bumpmap,bt.normalmap,bt.displacementmap,bt.gradientmap,bt.fog,bt.lights,{emissive:{value:new lt(0)}}]),vertexShader:Kt.meshtoon_vert,fragmentShader:Kt.meshtoon_frag},matcap:{uniforms:sn([bt.common,bt.bumpmap,bt.normalmap,bt.displacementmap,bt.fog,{matcap:{value:null}}]),vertexShader:Kt.meshmatcap_vert,fragmentShader:Kt.meshmatcap_frag},points:{uniforms:sn([bt.points,bt.fog]),vertexShader:Kt.points_vert,fragmentShader:Kt.points_frag},dashed:{uniforms:sn([bt.common,bt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Kt.linedashed_vert,fragmentShader:Kt.linedashed_frag},depth:{uniforms:sn([bt.common,bt.displacementmap]),vertexShader:Kt.depth_vert,fragmentShader:Kt.depth_frag},normal:{uniforms:sn([bt.common,bt.bumpmap,bt.normalmap,bt.displacementmap,{opacity:{value:1}}]),vertexShader:Kt.meshnormal_vert,fragmentShader:Kt.meshnormal_frag},sprite:{uniforms:sn([bt.sprite,bt.fog]),vertexShader:Kt.sprite_vert,fragmentShader:Kt.sprite_frag},background:{uniforms:{uvTransform:{value:new Yt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Kt.background_vert,fragmentShader:Kt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Yt}},vertexShader:Kt.backgroundCube_vert,fragmentShader:Kt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Kt.cube_vert,fragmentShader:Kt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Kt.equirect_vert,fragmentShader:Kt.equirect_frag},distance:{uniforms:sn([bt.common,bt.displacementmap,{referencePosition:{value:new w},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Kt.distance_vert,fragmentShader:Kt.distance_frag},shadow:{uniforms:sn([bt.lights,bt.fog,{color:{value:new lt(0)},opacity:{value:1}}]),vertexShader:Kt.shadow_vert,fragmentShader:Kt.shadow_frag}};si.physical={uniforms:sn([si.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Yt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Yt},clearcoatNormalScale:{value:new it(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Yt},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Yt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Yt},sheen:{value:0},sheenColor:{value:new lt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Yt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Yt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Yt},transmissionSamplerSize:{value:new it},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Yt},attenuationDistance:{value:0},attenuationColor:{value:new lt(0)},specularColor:{value:new lt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Yt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Yt},anisotropyVector:{value:new it},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Yt}}]),vertexShader:Kt.meshphysical_vert,fragmentShader:Kt.meshphysical_frag};var lc={r:0,b:0,g:0},b_=new oe,Jf=new Yt;Jf.set(-1,0,0,0,1,0,0,0,1);function S_(s,t,e,n,i,r){let a=new lt(0),o=i===!0?0:1,c,l,h=null,d=0,u=null;function f(M){let S=M.isScene===!0?M.background:null;if(S&&S.isTexture){let y=M.backgroundBlurriness>0;S=t.get(S,y)}return S}function m(M){let S=!1,y=f(M);y===null?g(a,o):y&&y.isColor&&(g(y,1),S=!0);let T=s.xr.getEnvironmentBlendMode();T==="additive"?e.buffers.color.setClear(0,0,0,1,r):T==="alpha-blend"&&e.buffers.color.setClear(0,0,0,0,r),(s.autoClear||S)&&(e.buffers.depth.setTest(!0),e.buffers.depth.setMask(!0),e.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function x(M,S){let y=f(S);y&&(y.isCubeTexture||y.mapping===Pa)?(l===void 0&&(l=new Tt(new _e(1,1,1),new we({name:"BackgroundCubeMaterial",uniforms:cs(si.backgroundCube.uniforms),vertexShader:si.backgroundCube.vertexShader,fragmentShader:si.backgroundCube.fragmentShader,side:qe,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),l.geometry.deleteAttribute("uv"),l.onBeforeRender=function(T,E,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(l)),l.material.uniforms.envMap.value=y,l.material.uniforms.backgroundBlurriness.value=S.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(b_.makeRotationFromEuler(S.backgroundRotation)).transpose(),y.isCubeTexture&&y.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(Jf),l.material.toneMapped=te.getTransfer(y.colorSpace)!==le,(h!==y||d!==y.version||u!==s.toneMapping)&&(l.material.needsUpdate=!0,h=y,d=y.version,u=s.toneMapping),l.layers.enableAll(),M.unshift(l,l.geometry,l.material,0,0,null)):y&&y.isTexture&&(c===void 0&&(c=new Tt(new je(2,2),new we({name:"BackgroundMaterial",uniforms:cs(si.background.uniforms),vertexShader:si.background.vertexShader,fragmentShader:si.background.fragmentShader,side:Bi,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(c)),c.material.uniforms.t2D.value=y,c.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,c.material.toneMapped=te.getTransfer(y.colorSpace)!==le,y.matrixAutoUpdate===!0&&y.updateMatrix(),c.material.uniforms.uvTransform.value.copy(y.matrix),(h!==y||d!==y.version||u!==s.toneMapping)&&(c.material.needsUpdate=!0,h=y,d=y.version,u=s.toneMapping),c.layers.enableAll(),M.unshift(c,c.geometry,c.material,0,0,null))}function g(M,S){M.getRGB(lc,Yh(s)),e.buffers.color.setClear(lc.r,lc.g,lc.b,S,r)}function p(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return a},setClearColor:function(M,S=1){a.set(M),o=S,g(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(M){o=M,g(a,o)},render:m,addToRenderList:x,dispose:p}}function T_(s,t){let e=s.getParameter(s.MAX_VERTEX_ATTRIBS),n={},i=u(null),r=i,a=!1;function o(D,B,V,P,L){let X=!1,k=d(D,P,V,B);r!==k&&(r=k,l(r.object)),X=f(D,P,V,L),X&&m(D,P,V,L),L!==null&&t.update(L,s.ELEMENT_ARRAY_BUFFER),(X||a)&&(a=!1,y(D,B,V,P),L!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,t.get(L).buffer))}function c(){return s.createVertexArray()}function l(D){return s.bindVertexArray(D)}function h(D){return s.deleteVertexArray(D)}function d(D,B,V,P){let L=P.wireframe===!0,X=n[B.id];X===void 0&&(X={},n[B.id]=X);let k=D.isInstancedMesh===!0?D.id:0,Z=X[k];Z===void 0&&(Z={},X[k]=Z);let z=Z[V.id];z===void 0&&(z={},Z[V.id]=z);let q=z[L];return q===void 0&&(q=u(c()),z[L]=q),q}function u(D){let B=[],V=[],P=[];for(let L=0;L<e;L++)B[L]=0,V[L]=0,P[L]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:B,enabledAttributes:V,attributeDivisors:P,object:D,attributes:{},index:null}}function f(D,B,V,P){let L=r.attributes,X=B.attributes,k=0,Z=V.getAttributes();for(let z in Z)if(Z[z].location>=0){let $=L[z],mt=X[z];if(mt===void 0&&(z==="instanceMatrix"&&D.instanceMatrix&&(mt=D.instanceMatrix),z==="instanceColor"&&D.instanceColor&&(mt=D.instanceColor)),$===void 0||$.attribute!==mt||mt&&$.data!==mt.data)return!0;k++}return r.attributesNum!==k||r.index!==P}function m(D,B,V,P){let L={},X=B.attributes,k=0,Z=V.getAttributes();for(let z in Z)if(Z[z].location>=0){let $=X[z];$===void 0&&(z==="instanceMatrix"&&D.instanceMatrix&&($=D.instanceMatrix),z==="instanceColor"&&D.instanceColor&&($=D.instanceColor));let mt={};mt.attribute=$,$&&$.data&&(mt.data=$.data),L[z]=mt,k++}r.attributes=L,r.attributesNum=k,r.index=P}function x(){let D=r.newAttributes;for(let B=0,V=D.length;B<V;B++)D[B]=0}function g(D){p(D,0)}function p(D,B){let V=r.newAttributes,P=r.enabledAttributes,L=r.attributeDivisors;V[D]=1,P[D]===0&&(s.enableVertexAttribArray(D),P[D]=1),L[D]!==B&&(s.vertexAttribDivisor(D,B),L[D]=B)}function M(){let D=r.newAttributes,B=r.enabledAttributes;for(let V=0,P=B.length;V<P;V++)B[V]!==D[V]&&(s.disableVertexAttribArray(V),B[V]=0)}function S(D,B,V,P,L,X,k){k===!0?s.vertexAttribIPointer(D,B,V,L,X):s.vertexAttribPointer(D,B,V,P,L,X)}function y(D,B,V,P){x();let L=P.attributes,X=V.getAttributes(),k=B.defaultAttributeValues;for(let Z in X){let z=X[Z];if(z.location>=0){let q=L[Z];if(q===void 0&&(Z==="instanceMatrix"&&D.instanceMatrix&&(q=D.instanceMatrix),Z==="instanceColor"&&D.instanceColor&&(q=D.instanceColor)),q!==void 0){let $=q.normalized,mt=q.itemSize,ft=t.get(q);if(ft===void 0)continue;let Gt=ft.buffer,Wt=ft.type,jt=ft.bytesPerElement,J=Wt===s.INT||Wt===s.UNSIGNED_INT||q.gpuType===bl;if(q.isInterleavedBufferAttribute){let Q=q.data,dt=Q.stride,Bt=q.offset;if(Q.isInstancedInterleavedBuffer){for(let yt=0;yt<z.locationSize;yt++)p(z.location+yt,Q.meshPerAttribute);D.isInstancedMesh!==!0&&P._maxInstanceCount===void 0&&(P._maxInstanceCount=Q.meshPerAttribute*Q.count)}else for(let yt=0;yt<z.locationSize;yt++)g(z.location+yt);s.bindBuffer(s.ARRAY_BUFFER,Gt);for(let yt=0;yt<z.locationSize;yt++)S(z.location+yt,mt/z.locationSize,Wt,$,dt*jt,(Bt+mt/z.locationSize*yt)*jt,J)}else{if(q.isInstancedBufferAttribute){for(let Q=0;Q<z.locationSize;Q++)p(z.location+Q,q.meshPerAttribute);D.isInstancedMesh!==!0&&P._maxInstanceCount===void 0&&(P._maxInstanceCount=q.meshPerAttribute*q.count)}else for(let Q=0;Q<z.locationSize;Q++)g(z.location+Q);s.bindBuffer(s.ARRAY_BUFFER,Gt);for(let Q=0;Q<z.locationSize;Q++)S(z.location+Q,mt/z.locationSize,Wt,$,mt*jt,mt/z.locationSize*Q*jt,J)}}else if(k!==void 0){let $=k[Z];if($!==void 0)switch($.length){case 2:s.vertexAttrib2fv(z.location,$);break;case 3:s.vertexAttrib3fv(z.location,$);break;case 4:s.vertexAttrib4fv(z.location,$);break;default:s.vertexAttrib1fv(z.location,$)}}}}M()}function T(){A();for(let D in n){let B=n[D];for(let V in B){let P=B[V];for(let L in P){let X=P[L];for(let k in X)h(X[k].object),delete X[k];delete P[L]}}delete n[D]}}function E(D){if(n[D.id]===void 0)return;let B=n[D.id];for(let V in B){let P=B[V];for(let L in P){let X=P[L];for(let k in X)h(X[k].object),delete X[k];delete P[L]}}delete n[D.id]}function C(D){for(let B in n){let V=n[B];for(let P in V){let L=V[P];if(L[D.id]===void 0)continue;let X=L[D.id];for(let k in X)h(X[k].object),delete X[k];delete L[D.id]}}}function v(D){for(let B in n){let V=n[B],P=D.isInstancedMesh===!0?D.id:0,L=V[P];if(L!==void 0){for(let X in L){let k=L[X];for(let Z in k)h(k[Z].object),delete k[Z];delete L[X]}delete V[P],Object.keys(V).length===0&&delete n[B]}}}function A(){I(),a=!0,r!==i&&(r=i,l(r.object))}function I(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:o,reset:A,resetDefaultState:I,dispose:T,releaseStatesOfGeometry:E,releaseStatesOfObject:v,releaseStatesOfProgram:C,initAttributes:x,enableAttribute:g,disableUnusedAttributes:M}}function E_(s,t,e){let n;function i(c){n=c}function r(c,l){s.drawArrays(n,c,l),e.update(l,n,1)}function a(c,l,h){h!==0&&(s.drawArraysInstanced(n,c,l,h),e.update(l,n,h))}function o(c,l,h){if(h===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,l,0,h);let u=0;for(let f=0;f<h;f++)u+=l[f];e.update(u,n,1)}this.setMode=i,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function w_(s,t,e,n){let i;function r(){if(i!==void 0)return i;if(t.has("EXT_texture_filter_anisotropic")===!0){let C=t.get("EXT_texture_filter_anisotropic");i=s.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function a(C){return!(C!==In&&n.convert(C)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(C){let v=C===ze&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(C!==xn&&C!==Pn&&!v&&n.convert(C)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE))}function c(C){if(C==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp",h=c(l);h!==l&&(Vt("WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);let d=e.logarithmicDepthBuffer===!0,u=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control");e.reversedDepthBuffer===!0&&u===!1&&Vt("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");let f=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),m=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=s.getParameter(s.MAX_TEXTURE_SIZE),g=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),p=s.getParameter(s.MAX_VERTEX_ATTRIBS),M=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),S=s.getParameter(s.MAX_VARYING_VECTORS),y=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),T=s.getParameter(s.MAX_SAMPLES),E=s.getParameter(s.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:d,reversedDepthBuffer:u,maxTextures:f,maxVertexTextures:m,maxTextureSize:x,maxCubemapSize:g,maxAttributes:p,maxVertexUniforms:M,maxVaryings:S,maxFragmentUniforms:y,maxSamples:T,samples:E}}function A_(s){let t=this,e=null,n=0,i=!1,r=!1,a=new zn,o=new Yt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(d,u){let f=d.length!==0||u||n!==0||i;return i=u,n=d.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,u){e=h(d,u,0)},this.setState=function(d,u,f){let m=d.clippingPlanes,x=d.clipIntersection,g=d.clipShadows,p=s.get(d);if(!i||m===null||m.length===0||r&&!g)r?h(null):l();else{let M=r?0:n,S=M*4,y=p.clippingState||null;c.value=y,y=h(m,u,S,f);for(let T=0;T!==S;++T)y[T]=e[T];p.clippingState=y,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=M}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(d,u,f,m){let x=d!==null?d.length:0,g=null;if(x!==0){if(g=c.value,m!==!0||g===null){let p=f+x*4,M=u.matrixWorldInverse;o.getNormalMatrix(M),(g===null||g.length<p)&&(g=new Float32Array(p));for(let S=0,y=f;S!==x;++S,y+=4)a.copy(d[S]).applyMatrix4(M,o),a.normal.toArray(g,y),g[y+3]=a.constant}c.value=g,c.needsUpdate=!0}return t.numPlanes=x,t.numIntersection=0,g}}var ir=4,R_=6,C_=20,P_=256,Oa=new Fi,Af=new lt,nu=null,iu=0,su=0,ru=!1,I_=new w,hs=new w,rr=class{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(t,e=0,n=.1,i=100,r={}){let{size:a=256,position:o=I_}=r;nu=this._renderer.getRenderTarget(),iu=this._renderer.getActiveCubeFace(),su=this._renderer.getActiveMipmapLevel(),ru=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(t,n,i,c,o),e>0&&this._blur(c,0,0,e),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Pf(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Cf(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodMeshes.length;t++)this._lodMeshes[t].geometry.dispose()}_cleanup(t){this._renderer.setRenderTarget(nu,iu,su),this._renderer.xr.enabled=ru,t.scissorTest=!1,nr(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===zi||t.mapping===ls?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),nu=this._renderer.getRenderTarget(),iu=this._renderer.getActiveCubeFace(),su=this._renderer.getActiveMipmapLevel(),ru=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:Ke,minFilter:Ke,generateMipmaps:!1,type:ze,format:In,colorSpace:Hr,depthBuffer:!1},i=Rf(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Rf(t,e,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=L_(r)),this._blurMaterial=N_(r,t,e),this._ggxMaterial=D_(r,t,e)}return i}_compileMaterial(t){let e=new Tt(new ge,t);this._renderer.compile(e,Oa)}_sceneToCubeUV(t,e,n,i,r){let c=new Ze(90,1,e,n),l=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],d=this._renderer,u=d.autoClear,f=d.toneMapping;d.getClearColor(Af),d.toneMapping=Gn,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(i),d.clearDepth(),d.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Tt(new _e,new fe({name:"PMREM.Background",side:qe,depthWrite:!1,depthTest:!1})));let x=this._backgroundBox,g=x.material,p=!1,M=t.background;M?M.isColor&&(g.color.copy(M),t.background=null,p=!0):(g.color.copy(Af),p=!0);for(let S=0;S<6;S++){let y=S%3;y===0?(c.up.set(0,l[S],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x+h[S],r.y,r.z)):y===1?(c.up.set(0,0,l[S]),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y+h[S],r.z)):(c.up.set(0,l[S],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y,r.z+h[S]));let T=this._cubeSize;nr(i,y*T,S>2?T:0,T,T),d.setRenderTarget(i),p&&d.render(x,c),d.render(t,c)}d.toneMapping=f,d.autoClear=u,t.background=M}_textureToCubeUV(t,e){let n=this._renderer,i=t.mapping===zi||t.mapping===ls;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=Pf()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Cf());let r=i?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;let o=r.uniforms;o.envMap.value=t;let c=this._cubeSize;nr(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(a,Oa)}_applyPMREM(t){let e=this._renderer,n=e.autoClear;e.autoClear=!1;let i=this._lodMeshes.length;for(let r=1;r<i;r++)this._applyGGXFilter(t,r-1,r);e.autoClear=n}_applyGGXFilter(t,e,n){let i=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;let c=a.uniforms,l=n/(this._lodMeshes.length-1),h=e/(this._lodMeshes.length-1),d=Math.sqrt(l*l-h*h),u=l*1.25,f=d*u,{_lodMax:m}=this,x=this._sizeLods[n],g=3*x*(n>m-ir?n-m+ir:0),p=4*(this._cubeSize-x);c.envMap.value=t.texture,c.roughness.value=f,c.mipInt.value=m-e,nr(r,g,p,3*x,2*x),i.setRenderTarget(r),i.render(o,Oa),c.envMap.value=r.texture,c.roughness.value=0,c.mipInt.value=m-n,nr(t,g,p,3*x,2*x),i.setRenderTarget(t),i.render(o,Oa)}_blur(t,e,n,i){let r=this._pingPongRenderTarget,a=Math.min(i,Math.PI)/Math.SQRT2;this._blurPass(t,r,e,n,a),this._blurPass(r,t,n,n,a)}_blurPass(t,e,n,i,r){let a=this._renderer,o=this._blurMaterial,c=this._lodMeshes[i];c.material=o;let l=o.uniforms;l.envMap.value=t.texture,l.sigma.value=r,l.mipInt.value=this._lodMax-n;let h=this._sizeLods[i],d=3*h*(i>this._lodMax-ir?i-this._lodMax+ir:0),u=4*(this._cubeSize-h);nr(e,d,u,3*h,2*h),a.setRenderTarget(e),a.render(c,Oa)}};function L_(s){let t=[],e=[],n=s,i=s-ir+1+R_;for(let r=0;r<i;r++){let a=Math.pow(2,n);t.push(a);let o=1/(a-2),c=-o,l=1+o,h=[c,c,l,c,l,l,c,c,l,l,c,l],d=6,u=6,f=3,m=new Float32Array(f*u*d),x=new Float32Array(f*u*d);for(let p=0;p<d;p++){let M=p%3*2/3-1,S=p>2?0:-1,y=[M,S,0,M+2/3,S,0,M+2/3,S+1,0,M,S,0,M+2/3,S+1,0,M,S+1,0];m.set(y,f*u*p);for(let T=0;T<u;T++){let E=h[T*2]*2-1,C=h[T*2+1]*2-1;p===0?hs.set(1,C,E):p===1?hs.set(-E,1,-C):p===2?hs.set(-E,C,1):p===3?hs.set(-1,C,-E):p===4?hs.set(-E,-1,C):hs.set(E,C,-1),hs.toArray(x,(p*u+T)*f)}}let g=new ge;g.setAttribute("position",new Ue(m,f)),g.setAttribute("outputDirection",new Ue(x,f)),e.push(new Tt(g,null)),n>ir&&n--}return{lodMeshes:e,sizeLods:t}}function Rf(s,t,e){let n=new Le(s,t,e);return n.texture.mapping=Pa,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function nr(s,t,e,n,i){s.viewport.set(t,e,n,i),s.scissor.set(t,e,n,i)}function D_(s,t,e){return new we({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:P_,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:dc(),fragmentShader:`

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
		`,blending:Cn,depthTest:!1,depthWrite:!1})}function N_(s,t,e){return new we({name:"SphericalGaussianBlur",defines:{SAMPLES:C_,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:dc(),fragmentShader:`

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
		`,blending:Cn,depthTest:!1,depthWrite:!1})}function Cf(){return new we({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:dc(),fragmentShader:`

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
		`,blending:Cn,depthTest:!1,depthWrite:!1})}function Pf(){return new we({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:dc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Cn,depthTest:!1,depthWrite:!1})}function dc(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}var hc=class extends Le{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;let n={width:t,height:t,depth:1},i=[n,n,n,n,n,n];this.texture=new ia(i),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},i=new _e(5,5,5),r=new we({name:"CubemapFromEquirect",uniforms:cs(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:qe,blending:Cn});r.uniforms.tEquirect.value=e;let a=new Tt(i,r),o=e.minFilter;return e.minFilter===ki&&(e.minFilter=Ke),new gl(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e=!0,n=!0,i=!0){let r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,i);t.setRenderTarget(r)}};function U_(s){let t=new WeakMap,e=new WeakMap,n=null;function i(u,f=!1){return u==null?null:f?a(u):r(u)}function r(u){if(u&&u.isTexture){let f=u.mapping;if(f===vl||f===yl)if(t.has(u)){let m=t.get(u).texture;return o(m,u.mapping)}else{let m=u.image;if(m&&m.height>0){let x=new hc(m.height);return x.fromEquirectangularTexture(s,u),t.set(u,x),u.addEventListener("dispose",l),o(x.texture,u.mapping)}else return null}}return u}function a(u){if(u&&u.isTexture){let f=u.mapping,m=f===vl||f===yl,x=f===zi||f===ls;if(m||x){let g=e.get(u),p=g!==void 0?g.texture.pmremVersion:0;if(u.isRenderTargetTexture&&u.pmremVersion!==p)return n===null&&(n=new rr(s)),g=m?n.fromEquirectangular(u,g):n.fromCubemap(u,g),g.texture.pmremVersion=u.pmremVersion,e.set(u,g),g.texture;if(g!==void 0)return g.texture;{let M=u.image;return m&&M&&M.height>0||x&&M&&c(M)?(n===null&&(n=new rr(s)),g=m?n.fromEquirectangular(u):n.fromCubemap(u),g.texture.pmremVersion=u.pmremVersion,e.set(u,g),u.addEventListener("dispose",h),g.texture):null}}}return u}function o(u,f){return f===vl?u.mapping=zi:f===yl&&(u.mapping=ls),u}function c(u){let f=0,m=6;for(let x=0;x<m;x++)u[x]!==void 0&&f++;return f===m}function l(u){let f=u.target;f.removeEventListener("dispose",l);let m=t.get(f);m!==void 0&&(t.delete(f),m.dispose())}function h(u){let f=u.target;f.removeEventListener("dispose",h);let m=e.get(f);m!==void 0&&(e.delete(f),m.dispose())}function d(){t=new WeakMap,e=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:i,dispose:d}}function F_(s){let t={};function e(n){if(t[n]!==void 0)return t[n];let i=s.getExtension(n);return t[n]=i,i}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){let i=e(n);return i===null&&Qi("WebGLRenderer: "+n+" extension not supported."),i}}}function B_(s,t,e,n){let i={},r=new WeakMap;function a(d){let u=d.target;u.index!==null&&t.remove(u.index);for(let m in u.attributes)t.remove(u.attributes[m]);u.removeEventListener("dispose",a),delete i[u.id];let f=r.get(u);f&&(t.remove(f),r.delete(u)),n.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,e.memory.geometries--}function o(d,u){return i[u.id]===!0||(u.addEventListener("dispose",a),i[u.id]=!0,e.memory.geometries++),u}function c(d){let u=d.attributes;for(let f in u)t.update(u[f],s.ARRAY_BUFFER)}function l(d){let u=[],f=d.index,m=d.attributes.position,x=0;if(m===void 0)return;if(f!==null){let M=f.array;x=f.version;for(let S=0,y=M.length;S<y;S+=3){let T=M[S+0],E=M[S+1],C=M[S+2];u.push(T,E,E,C,C,T)}}else{let M=m.array;x=m.version;for(let S=0,y=M.length/3-1;S<y;S+=3){let T=S+0,E=S+1,C=S+2;u.push(T,E,E,C,C,T)}}let g=new(m.count>=65535?Zr:Jr)(u,1);g.version=x;let p=r.get(d);p&&t.remove(p),r.set(d,g)}function h(d){let u=r.get(d);if(u){let f=d.index;f!==null&&u.version<f.version&&l(d)}else l(d);return r.get(d)}return{get:o,update:c,getWireframeAttribute:h}}function O_(s,t,e){let n;function i(d){n=d}let r,a;function o(d){r=d.type,a=d.bytesPerElement}function c(d,u){s.drawElements(n,u,r,d*a),e.update(u,n,1)}function l(d,u,f){f!==0&&(s.drawElementsInstanced(n,u,r,d*a,f),e.update(u,n,f))}function h(d,u,f){if(f===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,u,0,r,d,0,f);let x=0;for(let g=0;g<f;g++)x+=u[g];e.update(x,n,1)}this.setMode=i,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=h}function z_(s){let t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(e.calls++,a){case s.TRIANGLES:e.triangles+=o*(r/3);break;case s.LINES:e.lines+=o*(r/2);break;case s.LINE_STRIP:e.lines+=o*(r-1);break;case s.LINE_LOOP:e.lines+=o*r;break;case s.POINTS:e.points+=o*r;break;default:Ht("WebGLInfo: Unknown draw mode:",a);break}}function i(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:i,update:n}}function k_(s,t,e){let n=new WeakMap,i=new Ae;function r(a,o,c){let l=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,d=h!==void 0?h.length:0,u=n.get(o);if(u===void 0||u.count!==d){let A=function(){C.dispose(),n.delete(o),o.removeEventListener("dispose",A)};u!==void 0&&u.texture.dispose();let f=o.morphAttributes.position!==void 0,m=o.morphAttributes.normal!==void 0,x=o.morphAttributes.color!==void 0,g=o.morphAttributes.position||[],p=o.morphAttributes.normal||[],M=o.morphAttributes.color||[],S=0;f===!0&&(S=1),m===!0&&(S=2),x===!0&&(S=3);let y=o.attributes.position.count*S,T=1;y>t.maxTextureSize&&(T=Math.ceil(y/t.maxTextureSize),y=t.maxTextureSize);let E=new Float32Array(y*T*4*d),C=new qr(E,y,T,d);C.type=Pn,C.needsUpdate=!0;let v=S*4;for(let I=0;I<d;I++){let D=g[I],B=p[I],V=M[I],P=y*T*4*I;for(let L=0;L<D.count;L++){let X=L*v;f===!0&&(i.fromBufferAttribute(D,L),E[P+X+0]=i.x,E[P+X+1]=i.y,E[P+X+2]=i.z,E[P+X+3]=0),m===!0&&(i.fromBufferAttribute(B,L),E[P+X+4]=i.x,E[P+X+5]=i.y,E[P+X+6]=i.z,E[P+X+7]=0),x===!0&&(i.fromBufferAttribute(V,L),E[P+X+8]=i.x,E[P+X+9]=i.y,E[P+X+10]=i.z,E[P+X+11]=V.itemSize===4?i.w:1)}}u={count:d,texture:C,size:new it(y,T)},n.set(o,u),o.addEventListener("dispose",A)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(s,"morphTexture",a.morphTexture,e);else{let f=0;for(let x=0;x<l.length;x++)f+=l[x];let m=o.morphTargetsRelative?1:1-f;c.getUniforms().setValue(s,"morphTargetBaseInfluence",m),c.getUniforms().setValue(s,"morphTargetInfluences",l)}c.getUniforms().setValue(s,"morphTargetsTexture",u.texture,e),c.getUniforms().setValue(s,"morphTargetsTextureSize",u.size)}return{update:r}}function V_(s,t,e,n,i){let r=new WeakMap;function a(l){let h=i.render.frame,d=l.geometry,u=t.get(l,d);if(r.get(u)!==h&&(t.update(u),r.set(u,h)),l.isInstancedMesh&&(l.hasEventListener("dispose",c)===!1&&l.addEventListener("dispose",c),r.get(l)!==h&&(e.update(l.instanceMatrix,s.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,s.ARRAY_BUFFER),r.set(l,h))),l.isSkinnedMesh){let f=l.skeleton;r.get(f)!==h&&(f.update(),r.set(f,h))}return u}function o(){r=new WeakMap}function c(l){let h=l.target;h.removeEventListener("dispose",c),n.releaseStatesOfObject(h),e.remove(h.instanceMatrix),h.instanceColor!==null&&e.remove(h.instanceColor)}return{update:a,dispose:o}}var H_={[Ta]:"LINEAR_TONE_MAPPING",[Ea]:"REINHARD_TONE_MAPPING",[wa]:"CINEON_TONE_MAPPING",[os]:"ACES_FILMIC_TONE_MAPPING",[Ra]:"AGX_TONE_MAPPING",[Ca]:"NEUTRAL_TONE_MAPPING",[Aa]:"CUSTOM_TONE_MAPPING"};function G_(s,t,e,n,i,r){let a=new Le(t,e,{type:s,depthBuffer:i,stencilBuffer:r,samples:n?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),o=null,c=null,l=new ge;l.setAttribute("position",new qt([-1,3,0,-1,-1,0,3,-1,0],3)),l.setAttribute("uv",new qt([0,2,0,0,2,0],2));let h=new Ks({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),d=new Tt(l,h),u=new Fi(-1,1,1,-1,0,1),f=null,m=null,x=!1,g,p=null,M=[],S=!1;this.setSize=function(y,T){a.setSize(y,T),o!==null&&o.setSize(y,T),c!==null&&c.setSize(y,T);for(let E=0;E<M.length;E++){let C=M[E];C.setSize&&C.setSize(y,T)}},this.setEffects=function(y){M=y,S=M.length>0&&M[0].isRenderPass===!0;let T=a.width,E=a.height;M.length>0&&o===null&&(o=new Le(T,E,{type:ze,depthBuffer:!1,stencilBuffer:!1}),c=new Le(T,E,{type:ze,depthBuffer:!1,stencilBuffer:!1}));for(let C=0;C<M.length;C++){let v=M[C];v.setSize&&v.setSize(T,E)}},this.begin=function(y,T){if(x||y.toneMapping===Gn&&M.length===0)return!1;if(p=T,T!==null){let E=T.width,C=T.height;(a.width!==E||a.height!==C)&&this.setSize(E,C)}return S===!1&&y.setRenderTarget(a),g=y.toneMapping,y.toneMapping=Gn,!0},this.hasRenderPass=function(){return S},this.end=function(y,T){y.toneMapping=g,x=!0;let E=a,C=o;for(let v=0;v<M.length;v++){let A=M[v];A.enabled!==!1&&(A.render(y,C,E,T),A.needsSwap!==!1&&(E=C,C=C===o?c:o))}if(f!==y.outputColorSpace||m!==y.toneMapping){f=y.outputColorSpace,m=y.toneMapping,h.defines={},te.getTransfer(f)===le&&(h.defines.SRGB_TRANSFER="");let v=H_[m];v&&(h.defines[v]=""),h.needsUpdate=!0}h.uniforms.tDiffuse.value=E.texture,y.setRenderTarget(p),y.render(d,u),p=null,x=!1},this.isCompositing=function(){return x},this.dispose=function(){a.dispose(),o!==null&&o.dispose(),c!==null&&c.dispose(),l.dispose(),h.dispose()}}var Zf=new un,lu=new Ii(1,1),Kf=new qr,jf=new Yo,Qf=new ia,If=[],Lf=[],Df=new Float32Array(16),Nf=new Float32Array(9),Uf=new Float32Array(4);function ar(s,t,e){let n=s[0];if(n<=0||n>0)return s;let i=t*e,r=If[i];if(r===void 0&&(r=new Float32Array(i),If[i]=r),t!==0){n.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=e,s[a].toArray(r,o)}return r}function ke(s,t){if(s.length!==t.length)return!1;for(let e=0,n=s.length;e<n;e++)if(s[e]!==t[e])return!1;return!0}function Ve(s,t){for(let e=0,n=t.length;e<n;e++)s[e]=t[e]}function fc(s,t){let e=Lf[t];e===void 0&&(e=new Int32Array(t),Lf[t]=e);for(let n=0;n!==t;++n)e[n]=s.allocateTextureUnit();return e}function W_(s,t){let e=this.cache;e[0]!==t&&(s.uniform1f(this.addr,t),e[0]=t)}function X_(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(ke(e,t))return;s.uniform2fv(this.addr,t),Ve(e,t)}}function q_(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(s.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(ke(e,t))return;s.uniform3fv(this.addr,t),Ve(e,t)}}function Y_(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(ke(e,t))return;s.uniform4fv(this.addr,t),Ve(e,t)}}function $_(s,t){let e=this.cache,n=t.elements;if(n===void 0){if(ke(e,t))return;s.uniformMatrix2fv(this.addr,!1,t),Ve(e,t)}else{if(ke(e,n))return;Uf.set(n),s.uniformMatrix2fv(this.addr,!1,Uf),Ve(e,n)}}function J_(s,t){let e=this.cache,n=t.elements;if(n===void 0){if(ke(e,t))return;s.uniformMatrix3fv(this.addr,!1,t),Ve(e,t)}else{if(ke(e,n))return;Nf.set(n),s.uniformMatrix3fv(this.addr,!1,Nf),Ve(e,n)}}function Z_(s,t){let e=this.cache,n=t.elements;if(n===void 0){if(ke(e,t))return;s.uniformMatrix4fv(this.addr,!1,t),Ve(e,t)}else{if(ke(e,n))return;Df.set(n),s.uniformMatrix4fv(this.addr,!1,Df),Ve(e,n)}}function K_(s,t){let e=this.cache;e[0]!==t&&(s.uniform1i(this.addr,t),e[0]=t)}function j_(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(ke(e,t))return;s.uniform2iv(this.addr,t),Ve(e,t)}}function Q_(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(ke(e,t))return;s.uniform3iv(this.addr,t),Ve(e,t)}}function tv(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(ke(e,t))return;s.uniform4iv(this.addr,t),Ve(e,t)}}function ev(s,t){let e=this.cache;e[0]!==t&&(s.uniform1ui(this.addr,t),e[0]=t)}function nv(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(ke(e,t))return;s.uniform2uiv(this.addr,t),Ve(e,t)}}function iv(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(ke(e,t))return;s.uniform3uiv(this.addr,t),Ve(e,t)}}function sv(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(ke(e,t))return;s.uniform4uiv(this.addr,t),Ve(e,t)}}function rv(s,t,e){let n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);let r;this.type===s.SAMPLER_2D_SHADOW?(lu.compareFunction=e.isReversedDepthBuffer()?oc:ac,r=lu):r=Zf,e.setTexture2D(t||r,i)}function av(s,t,e){let n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture3D(t||jf,i)}function ov(s,t,e){let n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTextureCube(t||Qf,i)}function lv(s,t,e){let n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture2DArray(t||Kf,i)}function cv(s){switch(s){case 5126:return W_;case 35664:return X_;case 35665:return q_;case 35666:return Y_;case 35674:return $_;case 35675:return J_;case 35676:return Z_;case 5124:case 35670:return K_;case 35667:case 35671:return j_;case 35668:case 35672:return Q_;case 35669:case 35673:return tv;case 5125:return ev;case 36294:return nv;case 36295:return iv;case 36296:return sv;case 35678:case 36198:case 36298:case 36306:case 35682:return rv;case 35679:case 36299:case 36307:return av;case 35680:case 36300:case 36308:case 36293:return ov;case 36289:case 36303:case 36311:case 36292:return lv}}function hv(s,t){s.uniform1fv(this.addr,t)}function uv(s,t){let e=ar(t,this.size,2);s.uniform2fv(this.addr,e)}function dv(s,t){let e=ar(t,this.size,3);s.uniform3fv(this.addr,e)}function fv(s,t){let e=ar(t,this.size,4);s.uniform4fv(this.addr,e)}function pv(s,t){let e=ar(t,this.size,4);s.uniformMatrix2fv(this.addr,!1,e)}function mv(s,t){let e=ar(t,this.size,9);s.uniformMatrix3fv(this.addr,!1,e)}function gv(s,t){let e=ar(t,this.size,16);s.uniformMatrix4fv(this.addr,!1,e)}function xv(s,t){s.uniform1iv(this.addr,t)}function _v(s,t){s.uniform2iv(this.addr,t)}function vv(s,t){s.uniform3iv(this.addr,t)}function yv(s,t){s.uniform4iv(this.addr,t)}function Mv(s,t){s.uniform1uiv(this.addr,t)}function bv(s,t){s.uniform2uiv(this.addr,t)}function Sv(s,t){s.uniform3uiv(this.addr,t)}function Tv(s,t){s.uniform4uiv(this.addr,t)}function Ev(s,t,e){let n=this.cache,i=t.length,r=fc(e,i);ke(n,r)||(s.uniform1iv(this.addr,r),Ve(n,r));let a;this.type===s.SAMPLER_2D_SHADOW?a=lu:a=Zf;for(let o=0;o!==i;++o)e.setTexture2D(t[o]||a,r[o])}function wv(s,t,e){let n=this.cache,i=t.length,r=fc(e,i);ke(n,r)||(s.uniform1iv(this.addr,r),Ve(n,r));for(let a=0;a!==i;++a)e.setTexture3D(t[a]||jf,r[a])}function Av(s,t,e){let n=this.cache,i=t.length,r=fc(e,i);ke(n,r)||(s.uniform1iv(this.addr,r),Ve(n,r));for(let a=0;a!==i;++a)e.setTextureCube(t[a]||Qf,r[a])}function Rv(s,t,e){let n=this.cache,i=t.length,r=fc(e,i);ke(n,r)||(s.uniform1iv(this.addr,r),Ve(n,r));for(let a=0;a!==i;++a)e.setTexture2DArray(t[a]||Kf,r[a])}function Cv(s){switch(s){case 5126:return hv;case 35664:return uv;case 35665:return dv;case 35666:return fv;case 35674:return pv;case 35675:return mv;case 35676:return gv;case 5124:case 35670:return xv;case 35667:case 35671:return _v;case 35668:case 35672:return vv;case 35669:case 35673:return yv;case 5125:return Mv;case 36294:return bv;case 36295:return Sv;case 36296:return Tv;case 35678:case 36198:case 36298:case 36306:case 35682:return Ev;case 35679:case 36299:case 36307:return wv;case 35680:case 36300:case 36308:case 36293:return Av;case 36289:case 36303:case 36311:case 36292:return Rv}}var cu=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=cv(e.type)}},hu=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Cv(e.type)}},uu=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){let i=this.seq;for(let r=0,a=i.length;r!==a;++r){let o=i[r];o.setValue(t,e[o.id],n)}}},au=/(\w+)(\])?(\[|\.)?/g;function Ff(s,t){s.seq.push(t),s.map[t.id]=t}function Pv(s,t,e){let n=s.name,i=n.length;for(au.lastIndex=0;;){let r=au.exec(n),a=au.lastIndex,o=r[1],c=r[2]==="]",l=r[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===i){Ff(e,l===void 0?new cu(o,s,t):new hu(o,s,t));break}else{let d=e.map[o];d===void 0&&(d=new uu(o),Ff(e,d)),e=d}}}var sr=class{constructor(t,e){this.seq=[],this.map={};let n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){let o=t.getActiveUniform(e,a),c=t.getUniformLocation(e,o.name);Pv(o,c,this)}let i=[],r=[];for(let a of this.seq)a.type===t.SAMPLER_2D_SHADOW||a.type===t.SAMPLER_CUBE_SHADOW||a.type===t.SAMPLER_2D_ARRAY_SHADOW?i.push(a):r.push(a);i.length>0&&(this.seq=i.concat(r))}setValue(t,e,n,i){let r=this.map[e];r!==void 0&&r.setValue(t,n,i)}setOptional(t,e,n){let i=e[n];i!==void 0&&this.setValue(t,n,i)}static upload(t,e,n,i){for(let r=0,a=e.length;r!==a;++r){let o=e[r],c=n[o.id];c.needsUpdate!==!1&&o.setValue(t,c.value,i)}}static seqWithValue(t,e){let n=[];for(let i=0,r=t.length;i!==r;++i){let a=t[i];a.id in e&&n.push(a)}return n}};function Bf(s,t,e){let n=s.createShader(t);return s.shaderSource(n,e),s.compileShader(n),n}var Iv=37297,Lv=0;function Dv(s,t){let e=s.split(`
`),n=[],i=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let a=i;a<r;a++){let o=a+1;n.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return n.join(`
`)}var Of=new Yt;function Nv(s){te._getMatrix(Of,te.workingColorSpace,s);let t=`mat3( ${Of.elements.map(e=>e.toFixed(4))} )`;switch(te.getTransfer(s)){case Gr:return[t,"LinearTransferOETF"];case le:return[t,"sRGBTransferOETF"];default:return Vt("WebGLProgram: Unsupported color space: ",s),[t,"LinearTransferOETF"]}}function zf(s,t,e){let n=s.getShaderParameter(t,s.COMPILE_STATUS),r=(s.getShaderInfoLog(t)||"").trim();if(n&&r==="")return"";let a=/ERROR: 0:(\d+)/.exec(r);if(a){let o=parseInt(a[1]);return e.toUpperCase()+`

`+r+`

`+Dv(s.getShaderSource(t),o)}else return r}function Uv(s,t){let e=Nv(t);return[`vec4 ${s}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}var Fv={[Ta]:"Linear",[Ea]:"Reinhard",[wa]:"Cineon",[os]:"ACESFilmic",[Ra]:"AgX",[Ca]:"Neutral",[Aa]:"Custom"};function Bv(s,t){let e=Fv[t];return e===void 0?(Vt("WebGLProgram: Unsupported toneMapping:",t),"vec3 "+s+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+s+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}var cc=new w;function Ov(){te.getLuminanceCoefficients(cc);let s=cc.x.toFixed(4),t=cc.y.toFixed(4),e=cc.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function zv(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(ka).join(`
`)}function kv(s){let t=[];for(let e in s){let n=s[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function Vv(s,t){let e={},n=s.getProgramParameter(t,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){let r=s.getActiveAttrib(t,i),a=r.name,o=1;r.type===s.FLOAT_MAT2&&(o=2),r.type===s.FLOAT_MAT3&&(o=3),r.type===s.FLOAT_MAT4&&(o=4),e[a]={type:r.type,location:s.getAttribLocation(t,a),locationSize:o}}return e}function ka(s){return s!==""}function kf(s,t){let e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return s.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Vf(s,t){return s.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var Hv=/^[ \t]*#include +<([\w\d./]+)>/gm;function du(s){return s.replace(Hv,Wv)}var Gv=new Map;function Wv(s,t){let e=Kt[t];if(e===void 0){let n=Gv.get(t);if(n!==void 0)e=Kt[n],Vt('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+t+">")}return du(e)}var Xv=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Hf(s){return s.replace(Xv,qv)}function qv(s,t,e,n){let i="";for(let r=parseInt(t);r<parseInt(e);r++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function Gf(s){let t=`precision ${s.precision} float;
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
#define LOW_PRECISION`),t}var Yv={[rs]:"SHADOWMAP_TYPE_PCF",[js]:"SHADOWMAP_TYPE_VSM"};function $v(s){return Yv[s.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var Jv={[zi]:"ENVMAP_TYPE_CUBE",[ls]:"ENVMAP_TYPE_CUBE",[Pa]:"ENVMAP_TYPE_CUBE_UV"};function Zv(s){return s.envMap===!1?"ENVMAP_TYPE_CUBE":Jv[s.envMapMode]||"ENVMAP_TYPE_CUBE"}var Kv={[ls]:"ENVMAP_MODE_REFRACTION"};function jv(s){return s.envMap===!1?"ENVMAP_MODE_REFLECTION":Kv[s.envMapMode]||"ENVMAP_MODE_REFLECTION"}var Qv={[Uh]:"ENVMAP_BLENDING_MULTIPLY",[nf]:"ENVMAP_BLENDING_MIX",[sf]:"ENVMAP_BLENDING_ADD"};function ty(s){return s.envMap===!1?"ENVMAP_BLENDING_NONE":Qv[s.combine]||"ENVMAP_BLENDING_NONE"}function ey(s){let t=s.envMapCubeUVHeight;if(t===null)return null;let e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function ny(s,t,e,n){let i=s.getContext(),r=e.defines,a=e.vertexShader,o=e.fragmentShader,c=$v(e),l=Zv(e),h=jv(e),d=ty(e),u=ey(e),f=zv(e),m=kv(r),x=i.createProgram(),g,p,M=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(ka).join(`
`),g.length>0&&(g+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(ka).join(`
`),p.length>0&&(p+=`
`)):(g=[Gf(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexNormals?"#define HAS_NORMAL":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ka).join(`
`),p=[Gf(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+h:"",e.envMap?"#define "+d:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.retroreflection?"#define USE_RETROREFLECTION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas||e.batchingColor?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Gn?"#define TONE_MAPPING":"",e.toneMapping!==Gn?Kt.tonemapping_pars_fragment:"",e.toneMapping!==Gn?Bv("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Kt.colorspace_pars_fragment,Uv("linearToOutputTexel",e.outputColorSpace),Ov(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(ka).join(`
`)),a=du(a),a=kf(a,e),a=Vf(a,e),o=du(o),o=kf(o,e),o=Vf(o,e),a=Hf(a),o=Hf(o),e.isRawShaderMaterial!==!0&&(M=`#version 300 es
`,g=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,p=["#define varying in",e.glslVersion===Wh?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Wh?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);let S=M+g+a,y=M+p+o,T=Bf(i,i.VERTEX_SHADER,S),E=Bf(i,i.FRAGMENT_SHADER,y);i.attachShader(x,T),i.attachShader(x,E),e.index0AttributeName!==void 0?i.bindAttribLocation(x,0,e.index0AttributeName):e.hasPositionAttribute===!0&&i.bindAttribLocation(x,0,"position"),i.linkProgram(x);function C(D){if(s.debug.checkShaderErrors){let B=i.getProgramInfoLog(x)||"",V=i.getShaderInfoLog(T)||"",P=i.getShaderInfoLog(E)||"",L=B.trim(),X=V.trim(),k=P.trim(),Z=!0,z=!0;if(i.getProgramParameter(x,i.LINK_STATUS)===!1)if(Z=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,x,T,E);else{let q=zf(i,T,"vertex"),$=zf(i,E,"fragment");Ht("WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(x,i.VALIDATE_STATUS)+`

Material Name: `+D.name+`
Material Type: `+D.type+`

Program Info Log: `+L+`
`+q+`
`+$)}else L!==""?Vt("WebGLProgram: Program Info Log:",L):(X===""||k==="")&&(z=!1);z&&(D.diagnostics={runnable:Z,programLog:L,vertexShader:{log:X,prefix:g},fragmentShader:{log:k,prefix:p}})}i.deleteShader(T),i.deleteShader(E),v=new sr(i,x),A=Vv(i,x)}let v;this.getUniforms=function(){return v===void 0&&C(this),v};let A;this.getAttributes=function(){return A===void 0&&C(this),A};let I=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return I===!1&&(I=i.getProgramParameter(x,Iv)),I},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(x),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Lv++,this.cacheKey=t,this.usedTimes=1,this.program=x,this.vertexShader=T,this.fragmentShader=E,this}var iy=0,fu=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t,e,n){let i=this._getShaderCacheForMaterial(t);return i.has(e)===!1&&(i.add(e),e.usedTimes++),i.has(n)===!1&&(i.add(n),n.usedTimes++),this}remove(t){let e=this.materialCache.get(t);for(let n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderStage(t){return this._getShaderStage(t.vertexShader)}getFragmentShaderStage(t){return this._getShaderStage(t.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){let e=this.shaderCache,n=e.get(t);return n===void 0&&(n=new pu(t),e.set(t,n)),n}},pu=class{constructor(t){this.id=iy++,this.code=t,this.usedTimes=0}};function sy(s){return s===Hi||s===Fa||s===Ba}function ry(s,t,e,n,i,r){let a=new Yr,o=new fu,c=new Set,l=[],h=new Map,d=n.logarithmicDepthBuffer,u=n.precision,f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function m(v){return c.add(v),v===0?"uv":`uv${v}`}function x(v,A,I,D,B,V){let P=D.fog,L=B.geometry,X=v.isMeshStandardMaterial||v.isMeshLambertMaterial||v.isMeshPhongMaterial?D.environment:null,k=v.isMeshStandardMaterial||v.isMeshLambertMaterial&&!v.envMap||v.isMeshPhongMaterial&&!v.envMap,Z=t.get(v.envMap||X,k),z=Z&&Z.mapping===Pa?Z.image.height:null,q=f[v.type];v.precision!==null&&(u=n.getMaxPrecision(v.precision),u!==v.precision&&Vt("WebGLProgram.getParameters:",v.precision,"not supported, using",u,"instead."));let $=L.morphAttributes.position||L.morphAttributes.normal||L.morphAttributes.color,mt=$!==void 0?$.length:0,ft=0;L.morphAttributes.position!==void 0&&(ft=1),L.morphAttributes.normal!==void 0&&(ft=2),L.morphAttributes.color!==void 0&&(ft=3);let Gt,Wt,jt,J;if(q){let ye=si[q];Gt=ye.vertexShader,Wt=ye.fragmentShader}else{Gt=v.vertexShader,Wt=v.fragmentShader;let ye=o.getVertexShaderStage(v),ue=o.getFragmentShaderStage(v);o.update(v,ye,ue),jt=ye.id,J=ue.id}let Q=s.getRenderTarget(),dt=s.state.buffers.depth.getReversed(),Bt=B.isInstancedMesh===!0,yt=B.isBatchedMesh===!0,zt=!!v.map,ce=!!v.matcap,et=!!Z,rt=!!v.aoMap,at=!!v.lightMap,ot=!!v.bumpMap&&v.wireframe===!1,ht=!!v.normalMap,Ot=!!v.displacementMap,It=!!v.emissiveMap,Xt=!!v.metalnessMap,$t=!!v.roughnessMap,N=v.anisotropy>0,he=v.clearcoat>0,ne=v.dispersion>0,R=v.retroreflectivity>0,_=v.iridescence>0,O=v.sheen>0,W=v.transmission>0,K=N&&!!v.anisotropyMap,ct=he&&!!v.clearcoatMap,pt=he&&!!v.clearcoatNormalMap,j=he&&!!v.clearcoatRoughnessMap,nt=_&&!!v.iridescenceMap,gt=_&&!!v.iridescenceThicknessMap,Nt=O&&!!v.sheenColorMap,Mt=O&&!!v.sheenRoughnessMap,xt=!!v.specularMap,Ut=!!v.specularColorMap,kt=!!v.specularIntensityMap,Jt=W&&!!v.transmissionMap,F=W&&!!v.thicknessMap,_t=!!v.gradientMap,tt=!!v.alphaMap,vt=v.alphaTest>0,wt=!!v.alphaHash,st=!!v.extensions,Ft=Gn;v.toneMapped&&(Q===null||Q.isXRRenderTarget===!0)&&(Ft=s.toneMapping);let Lt={shaderID:q,shaderType:v.type,shaderName:v.name,vertexShader:Gt,fragmentShader:Wt,defines:v.defines,customVertexShaderID:jt,customFragmentShaderID:J,isRawShaderMaterial:v.isRawShaderMaterial===!0,glslVersion:v.glslVersion,precision:u,batching:yt,batchingColor:yt&&B._colorsTexture!==null,instancing:Bt,instancingColor:Bt&&B.instanceColor!==null,instancingMorph:Bt&&B.morphTexture!==null,outputColorSpace:Q===null?s.outputColorSpace:Q.isXRRenderTarget===!0?Q.texture.colorSpace:te.workingColorSpace,alphaToCoverage:!!v.alphaToCoverage,map:zt,matcap:ce,envMap:et,envMapMode:et&&Z.mapping,envMapCubeUVHeight:z,aoMap:rt,lightMap:at,bumpMap:ot,normalMap:ht,displacementMap:Ot,emissiveMap:It,normalMapObjectSpace:ht&&v.normalMapType===of,normalMapTangentSpace:ht&&v.normalMapType===rc,packedNormalMap:ht&&v.normalMapType===rc&&sy(v.normalMap.format),metalnessMap:Xt,roughnessMap:$t,anisotropy:N,anisotropyMap:K,clearcoat:he,clearcoatMap:ct,clearcoatNormalMap:pt,clearcoatRoughnessMap:j,dispersion:ne,retroreflection:R,iridescence:_,iridescenceMap:nt,iridescenceThicknessMap:gt,sheen:O,sheenColorMap:Nt,sheenRoughnessMap:Mt,specularMap:xt,specularColorMap:Ut,specularIntensityMap:kt,transmission:W,transmissionMap:Jt,thicknessMap:F,gradientMap:_t,opaque:v.transparent===!1&&v.blending===Oi&&v.alphaToCoverage===!1,alphaMap:tt,alphaTest:vt,alphaHash:wt,combine:v.combine,mapUv:zt&&m(v.map.channel),aoMapUv:rt&&m(v.aoMap.channel),lightMapUv:at&&m(v.lightMap.channel),bumpMapUv:ot&&m(v.bumpMap.channel),normalMapUv:ht&&m(v.normalMap.channel),displacementMapUv:Ot&&m(v.displacementMap.channel),emissiveMapUv:It&&m(v.emissiveMap.channel),metalnessMapUv:Xt&&m(v.metalnessMap.channel),roughnessMapUv:$t&&m(v.roughnessMap.channel),anisotropyMapUv:K&&m(v.anisotropyMap.channel),clearcoatMapUv:ct&&m(v.clearcoatMap.channel),clearcoatNormalMapUv:pt&&m(v.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:j&&m(v.clearcoatRoughnessMap.channel),iridescenceMapUv:nt&&m(v.iridescenceMap.channel),iridescenceThicknessMapUv:gt&&m(v.iridescenceThicknessMap.channel),sheenColorMapUv:Nt&&m(v.sheenColorMap.channel),sheenRoughnessMapUv:Mt&&m(v.sheenRoughnessMap.channel),specularMapUv:xt&&m(v.specularMap.channel),specularColorMapUv:Ut&&m(v.specularColorMap.channel),specularIntensityMapUv:kt&&m(v.specularIntensityMap.channel),transmissionMapUv:Jt&&m(v.transmissionMap.channel),thicknessMapUv:F&&m(v.thicknessMap.channel),alphaMapUv:tt&&m(v.alphaMap.channel),vertexTangents:!!L.attributes.tangent&&(ht||N),vertexNormals:!!L.attributes.normal,vertexColors:v.vertexColors,vertexAlphas:v.vertexColors===!0&&!!L.attributes.color&&L.attributes.color.itemSize===4,pointsUvs:B.isPoints===!0&&!!L.attributes.uv&&(zt||tt),fog:!!P,useFog:v.fog===!0,fogExp2:!!P&&P.isFogExp2,flatShading:v.wireframe===!1&&(v.flatShading===!0||L.attributes.normal===void 0&&ht===!1&&(v.isMeshLambertMaterial||v.isMeshPhongMaterial||v.isMeshStandardMaterial||v.isMeshPhysicalMaterial)),sizeAttenuation:v.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:dt,skinning:B.isSkinnedMesh===!0,hasPositionAttribute:L.attributes.position!==void 0,morphTargets:L.morphAttributes.position!==void 0,morphNormals:L.morphAttributes.normal!==void 0,morphColors:L.morphAttributes.color!==void 0,morphTargetsCount:mt,morphTextureStride:ft,numSunLights:A.sun.length,numDirLights:A.directional.length,numPointLights:A.point.length,numSpotLights:A.spot.length,numSpotLightMaps:A.spotLightMap.length,numRectAreaLights:A.rectArea.length,numHemiLights:A.hemi.length,numSunLightShadows:A.sunShadowMap.length,numDirLightShadows:A.directionalShadowMap.length,numPointLightShadows:A.pointShadowMap.length,numSpotLightShadows:A.spotShadowMap.length,numSpotLightShadowsWithMaps:A.numSpotLightShadowsWithMaps,numLightProbes:A.numLightProbes,numLightProbeGrids:V.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:v.dithering,shadowMapEnabled:s.shadowMap.enabled&&I.length>0,shadowMapType:s.shadowMap.type,toneMapping:Ft,decodeVideoTexture:zt&&v.map.isVideoTexture===!0&&te.getTransfer(v.map.colorSpace)===le,decodeVideoTextureEmissive:It&&v.emissiveMap.isVideoTexture===!0&&te.getTransfer(v.emissiveMap.colorSpace)===le,premultipliedAlpha:v.premultipliedAlpha,doubleSided:v.side===Oe,flipSided:v.side===qe,useDepthPacking:v.depthPacking>=0,depthPacking:v.depthPacking||0,index0AttributeName:v.index0AttributeName,extensionClipCullDistance:st&&v.extensions.clipCullDistance===!0&&e.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(st&&v.extensions.multiDraw===!0||yt)&&e.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:e.has("KHR_parallel_shader_compile"),customProgramCacheKey:v.customProgramCacheKey()};return Lt.vertexUv1s=c.has(1),Lt.vertexUv2s=c.has(2),Lt.vertexUv3s=c.has(3),c.clear(),Lt}function g(v){let A=[];if(v.shaderID?A.push(v.shaderID):(A.push(v.customVertexShaderID),A.push(v.customFragmentShaderID)),v.defines!==void 0)for(let I in v.defines)A.push(I),A.push(v.defines[I]);return v.isRawShaderMaterial===!1&&(p(A,v),M(A,v),A.push(s.outputColorSpace)),A.push(v.customProgramCacheKey),A.join()}function p(v,A){v.push(A.precision),v.push(A.outputColorSpace),v.push(A.envMapMode),v.push(A.envMapCubeUVHeight),v.push(A.mapUv),v.push(A.alphaMapUv),v.push(A.lightMapUv),v.push(A.aoMapUv),v.push(A.bumpMapUv),v.push(A.normalMapUv),v.push(A.displacementMapUv),v.push(A.emissiveMapUv),v.push(A.metalnessMapUv),v.push(A.roughnessMapUv),v.push(A.anisotropyMapUv),v.push(A.clearcoatMapUv),v.push(A.clearcoatNormalMapUv),v.push(A.clearcoatRoughnessMapUv),v.push(A.iridescenceMapUv),v.push(A.iridescenceThicknessMapUv),v.push(A.sheenColorMapUv),v.push(A.sheenRoughnessMapUv),v.push(A.specularMapUv),v.push(A.specularColorMapUv),v.push(A.specularIntensityMapUv),v.push(A.transmissionMapUv),v.push(A.thicknessMapUv),v.push(A.combine),v.push(A.fogExp2),v.push(A.sizeAttenuation),v.push(A.morphTargetsCount),v.push(A.morphAttributeCount),v.push(A.numSunLights),v.push(A.numDirLights),v.push(A.numPointLights),v.push(A.numSpotLights),v.push(A.numSpotLightMaps),v.push(A.numHemiLights),v.push(A.numRectAreaLights),v.push(A.numSunLightShadows),v.push(A.numDirLightShadows),v.push(A.numPointLightShadows),v.push(A.numSpotLightShadows),v.push(A.numSpotLightShadowsWithMaps),v.push(A.numLightProbes),v.push(A.shadowMapType),v.push(A.toneMapping),v.push(A.numClippingPlanes),v.push(A.numClipIntersection),v.push(A.depthPacking)}function M(v,A){a.disableAll(),A.instancing&&a.enable(0),A.instancingColor&&a.enable(1),A.instancingMorph&&a.enable(2),A.matcap&&a.enable(3),A.envMap&&a.enable(4),A.normalMapObjectSpace&&a.enable(5),A.normalMapTangentSpace&&a.enable(6),A.clearcoat&&a.enable(7),A.iridescence&&a.enable(8),A.alphaTest&&a.enable(9),A.vertexColors&&a.enable(10),A.vertexAlphas&&a.enable(11),A.vertexUv1s&&a.enable(12),A.vertexUv2s&&a.enable(13),A.vertexUv3s&&a.enable(14),A.vertexTangents&&a.enable(15),A.anisotropy&&a.enable(16),A.alphaHash&&a.enable(17),A.batching&&a.enable(18),A.dispersion&&a.enable(19),A.retroreflection&&a.enable(24),A.batchingColor&&a.enable(20),A.gradientMap&&a.enable(21),A.packedNormalMap&&a.enable(22),A.vertexNormals&&a.enable(23),v.push(a.mask),a.disableAll(),A.fog&&a.enable(0),A.useFog&&a.enable(1),A.flatShading&&a.enable(2),A.logarithmicDepthBuffer&&a.enable(3),A.reversedDepthBuffer&&a.enable(4),A.skinning&&a.enable(5),A.morphTargets&&a.enable(6),A.morphNormals&&a.enable(7),A.morphColors&&a.enable(8),A.premultipliedAlpha&&a.enable(9),A.shadowMapEnabled&&a.enable(10),A.doubleSided&&a.enable(11),A.flipSided&&a.enable(12),A.useDepthPacking&&a.enable(13),A.dithering&&a.enable(14),A.transmission&&a.enable(15),A.sheen&&a.enable(16),A.opaque&&a.enable(17),A.pointsUvs&&a.enable(18),A.decodeVideoTexture&&a.enable(19),A.decodeVideoTextureEmissive&&a.enable(20),A.alphaToCoverage&&a.enable(21),A.numLightProbeGrids>0&&a.enable(22),A.hasPositionAttribute&&a.enable(23),v.push(a.mask)}function S(v){let A=f[v.type],I;if(A){let D=si[A];I=vi.clone(D.uniforms)}else I=v.uniforms;return I}function y(v,A){let I=h.get(A);return I!==void 0?++I.usedTimes:(I=new ny(s,A,v,i),l.push(I),h.set(A,I)),I}function T(v){if(--v.usedTimes===0){let A=l.indexOf(v);l[A]=l[l.length-1],l.pop(),h.delete(v.cacheKey),v.destroy()}}function E(v){o.remove(v)}function C(){o.dispose()}return{getParameters:x,getProgramCacheKey:g,getUniforms:S,acquireProgram:y,releaseProgram:T,releaseShaderCache:E,programs:l,dispose:C}}function ay(){let s=new WeakMap;function t(a){return s.has(a)}function e(a){let o=s.get(a);return o===void 0&&(o={},s.set(a,o)),o}function n(a){s.delete(a)}function i(a,o,c){s.get(a)[o]=c}function r(){s=new WeakMap}return{has:t,get:e,remove:n,update:i,dispose:r}}function oy(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.material.id!==t.material.id?s.material.id-t.material.id:s.materialVariant!==t.materialVariant?s.materialVariant-t.materialVariant:s.z!==t.z?s.z-t.z:s.id-t.id}function Wf(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.z!==t.z?t.z-s.z:s.id-t.id}function Xf(){let s=[],t=0,e=[],n=[],i=[];function r(){t=0,e.length=0,n.length=0,i.length=0}function a(u){let f=0;return u.isInstancedMesh&&(f+=2),u.isSkinnedMesh&&(f+=1),f}function o(u,f,m,x,g,p){let M=s[t];return M===void 0?(M={id:u.id,object:u,geometry:f,material:m,materialVariant:a(u),groupOrder:x,renderOrder:u.renderOrder,z:g,group:p},s[t]=M):(M.id=u.id,M.object=u,M.geometry=f,M.material=m,M.materialVariant=a(u),M.groupOrder=x,M.renderOrder=u.renderOrder,M.z=g,M.group=p),t++,M}function c(u,f,m,x,g,p,M){M.reversedDepth===!0&&(g=-g);let S=o(u,f,m,x,g,p);m.transmission>0?n.push(S):m.transparent===!0?i.push(S):e.push(S)}function l(u,f,m,x,g,p){let M=o(u,f,m,x,g,p);m.transmission>0?n.unshift(M):m.transparent===!0?i.unshift(M):e.unshift(M)}function h(u,f){e.length>1&&e.sort(u||oy),n.length>1&&n.sort(f||Wf),i.length>1&&i.sort(f||Wf)}function d(){for(let u=t,f=s.length;u<f;u++){let m=s[u];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:e,transmissive:n,transparent:i,init:r,push:c,unshift:l,finish:d,sort:h}}function ly(){let s=new WeakMap;function t(n,i){let r=s.get(n),a;return r===void 0?(a=new Xf,s.set(n,[a])):i>=r.length?(a=new Xf,r.push(a)):a=r[i],a}function e(){s=new WeakMap}return{get:t,dispose:e}}function cy(){let s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={direction:new w,color:new lt};break;case"SpotLight":e={position:new w,direction:new w,color:new lt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new w,color:new lt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new w,skyColor:new lt,groundColor:new lt};break;case"RectAreaLight":e={color:new lt,position:new w,halfWidth:new w,halfHeight:new w};break}return s[t.id]=e,e}}}function hy(){let s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new it};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new it};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new it,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[t.id]=e,e}}}var uy=0;function dy(s,t){return(t.castShadow?2:0)-(s.castShadow?2:0)+(t.map?1:0)-(s.map?1:0)}function fy(s){let t=new cy,e=hy(),n={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new w);let i=new w,r=new oe,a=new oe;function o(l){let h=0,d=0,u=0;for(let B=0;B<9;B++)n.probe[B].set(0,0,0);let f=0,m=0,x=0,g=0,p=0,M=0,S=0,y=0,T=0,E=0,C=0,v=0,A=0,I=0;l.sort(dy);for(let B=0,V=l.length;B<V;B++){let P=l[B],L=P.color,X=P.intensity,k=P.distance,Z=null;if(P.shadow&&P.shadow.map&&(P.shadow.map.texture.format===Hi?Z=P.shadow.map.texture:Z=P.shadow.map.depthTexture||P.shadow.map.texture),P.isAmbientLight)h+=L.r*X,d+=L.g*X,u+=L.b*X;else if(P.isLightProbe){for(let z=0;z<9;z++)n.probe[z].addScaledVector(P.sh.coefficients[z],X);I++}else if(P.isSunLight){let z=t.get(P);if(z.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){let q=P.shadow,$=e.get(P);$.shadowIntensity=q.intensity,$.shadowBias=q.bias,$.shadowNormalBias=q.normalBias,$.shadowRadius=q.radius,$.shadowMapSize.copy(q.mapSize).multiply(q.getFrameExtents()),n.sunShadow[m]=$,n.sunShadowMap[m]=Z;let mt=q.getViewportCount();for(let ft=0;ft<mt;ft++)n.sunShadowMatrix[x+ft]=q.getMatrix(ft),n.sunShadowCascade[x+ft]=q._cascadeData[ft];x+=mt,m++}n.sun[f]=z,f++}else if(P.isDirectionalLight){let z=t.get(P);if(z.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){let q=P.shadow,$=e.get(P);$.shadowIntensity=q.intensity,$.shadowBias=q.bias,$.shadowNormalBias=q.normalBias,$.shadowRadius=q.radius,$.shadowMapSize=q.mapSize,n.directionalShadow[g]=$,n.directionalShadowMap[g]=Z,n.directionalShadowMatrix[g]=P.shadow.matrix,T++}n.directional[g]=z,g++}else if(P.isSpotLight){let z=t.get(P);z.position.setFromMatrixPosition(P.matrixWorld),z.color.copy(L).multiplyScalar(X),z.distance=k,z.coneCos=Math.cos(P.angle),z.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),z.decay=P.decay,n.spot[M]=z;let q=P.shadow;if(P.map&&(n.spotLightMap[v]=P.map,v++,q.updateMatrices(P),P.castShadow&&A++),n.spotLightMatrix[M]=q.matrix,P.castShadow){let $=e.get(P);$.shadowIntensity=q.intensity,$.shadowBias=q.bias,$.shadowNormalBias=q.normalBias,$.shadowRadius=q.radius,$.shadowMapSize=q.mapSize,n.spotShadow[M]=$,n.spotShadowMap[M]=Z,C++}M++}else if(P.isRectAreaLight){let z=t.get(P);z.color.copy(L).multiplyScalar(X),z.halfWidth.set(P.width*.5,0,0),z.halfHeight.set(0,P.height*.5,0),n.rectArea[S]=z,S++}else if(P.isPointLight){let z=t.get(P);if(z.color.copy(P.color).multiplyScalar(P.intensity),z.distance=P.distance,z.decay=P.decay,P.castShadow){let q=P.shadow,$=e.get(P);$.shadowIntensity=q.intensity,$.shadowBias=q.bias,$.shadowNormalBias=q.normalBias,$.shadowRadius=q.radius,$.shadowMapSize=q.mapSize,$.shadowCameraNear=q.camera.near,$.shadowCameraFar=q.camera.far,n.pointShadow[p]=$,n.pointShadowMap[p]=Z,n.pointShadowMatrix[p]=P.shadow.matrix,E++}n.point[p]=z,p++}else if(P.isHemisphereLight){let z=t.get(P);z.skyColor.copy(P.color).multiplyScalar(X),z.groundColor.copy(P.groundColor).multiplyScalar(X),n.hemi[y]=z,y++}}S>0&&(s.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=bt.LTC_FLOAT_1,n.rectAreaLTC2=bt.LTC_FLOAT_2):(n.rectAreaLTC1=bt.LTC_HALF_1,n.rectAreaLTC2=bt.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=d,n.ambient[2]=u;let D=n.hash;(D.sunLength!==f||D.directionalLength!==g||D.pointLength!==p||D.spotLength!==M||D.rectAreaLength!==S||D.hemiLength!==y||D.numSunShadows!==m||D.numDirectionalShadows!==T||D.numPointShadows!==E||D.numSpotShadows!==C||D.numSpotMaps!==v||D.numLightProbes!==I)&&(n.sun.length=f,n.directional.length=g,n.spot.length=M,n.rectArea.length=S,n.point.length=p,n.hemi.length=y,n.sunShadow.length=m,n.sunShadowMap.length=m,n.sunShadowMatrix.length=x,n.sunShadowCascade.length=x,n.directionalShadow.length=T,n.directionalShadowMap.length=T,n.directionalShadowMatrix.length=T,n.pointShadow.length=E,n.pointShadowMap.length=E,n.pointShadowMatrix.length=E,n.spotShadow.length=C,n.spotShadowMap.length=C,n.spotLightMatrix.length=C+v-A,n.spotLightMap.length=v,n.numSpotLightShadowsWithMaps=A,n.numLightProbes=I,D.sunLength=f,D.directionalLength=g,D.pointLength=p,D.spotLength=M,D.rectAreaLength=S,D.hemiLength=y,D.numSunShadows=m,D.numDirectionalShadows=T,D.numPointShadows=E,D.numSpotShadows=C,D.numSpotMaps=v,D.numLightProbes=I,n.version=uy++)}function c(l,h){let d=0,u=0,f=0,m=0,x=0,g=0,p=h.matrixWorldInverse;for(let M=0,S=l.length;M<S;M++){let y=l[M];if(y.isSunLight){let T=n.sun[d];T.direction.setFromMatrixPosition(y.matrixWorld),T.direction.transformDirection(p),d++}else if(y.isDirectionalLight){let T=n.directional[u];T.direction.setFromMatrixPosition(y.matrixWorld),i.setFromMatrixPosition(y.target.matrixWorld),T.direction.sub(i),T.direction.transformDirection(p),u++}else if(y.isSpotLight){let T=n.spot[m];T.position.setFromMatrixPosition(y.matrixWorld),T.position.applyMatrix4(p),T.direction.setFromMatrixPosition(y.matrixWorld),i.setFromMatrixPosition(y.target.matrixWorld),T.direction.sub(i),T.direction.transformDirection(p),m++}else if(y.isRectAreaLight){let T=n.rectArea[x];T.position.setFromMatrixPosition(y.matrixWorld),T.position.applyMatrix4(p),a.identity(),r.copy(y.matrixWorld),r.premultiply(p),a.extractRotation(r),T.halfWidth.set(y.width*.5,0,0),T.halfHeight.set(0,y.height*.5,0),T.halfWidth.applyMatrix4(a),T.halfHeight.applyMatrix4(a),x++}else if(y.isPointLight){let T=n.point[f];T.position.setFromMatrixPosition(y.matrixWorld),T.position.applyMatrix4(p),f++}else if(y.isHemisphereLight){let T=n.hemi[g];T.direction.setFromMatrixPosition(y.matrixWorld),T.direction.transformDirection(p),g++}}}return{setup:o,setupView:c,state:n}}function qf(s){let t=new fy(s),e=[],n=[],i=[];function r(u){d.camera=u,e.length=0,n.length=0,i.length=0}function a(u){e.push(u)}function o(u){n.push(u)}function c(u){i.push(u)}function l(){t.setup(e)}function h(u){t.setupView(e,u)}let d={lightsArray:e,shadowsArray:n,lightProbeGridArray:i,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:d,setupLights:l,setupLightsView:h,pushLight:a,pushShadow:o,pushLightProbeGrid:c}}function py(s){let t=new WeakMap;function e(i,r=0){let a=t.get(i),o;return a===void 0?(o=new qf(s),t.set(i,[o])):r>=a.length?(o=new qf(s),a.push(o)):o=a[r],o}function n(){t=new WeakMap}return{get:e,dispose:n}}var my=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,gy=`uniform sampler2D shadow_pass;
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
}`,xy=[new w(1,0,0),new w(-1,0,0),new w(0,1,0),new w(0,-1,0),new w(0,0,1),new w(0,0,-1)],_y=[new w(0,-1,0),new w(0,-1,0),new w(0,0,1),new w(0,0,-1),new w(0,-1,0),new w(0,-1,0)],Yf=new oe,za=new w,ou=new w;function vy(s,t,e){let n=new qs,i=new it,r=new it,a=new Ae,o=new il,c=new sl,l={},h=e.maxTextureSize,d={[Bi]:qe,[qe]:Bi,[Oe]:Oe},u=new we({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new it},radius:{value:4}},vertexShader:my,fragmentShader:gy}),f=u.clone();f.defines.HORIZONTAL_PASS=1;let m=new ge;m.setAttribute("position",new Ue(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let x=new Tt(m,u),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=rs;let p=this.type;this.render=function(E,C,v){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||E.length===0)return;this.type===Bd&&(Vt("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=rs);let A=s.getRenderTarget(),I=s.getActiveCubeFace(),D=s.getActiveMipmapLevel(),B=s.state;B.setBlending(Cn),B.buffers.depth.getReversed()===!0?B.buffers.color.setClear(0,0,0,0):B.buffers.color.setClear(1,1,1,1),B.buffers.depth.setTest(!0),B.setScissorTest(!1);let V=p!==this.type;V&&C.traverse(function(P){P.material&&(Array.isArray(P.material)?P.material.forEach(L=>L.needsUpdate=!0):P.material.needsUpdate=!0)});for(let P=0,L=E.length;P<L;P++){let X=E[P],k=X.shadow;if(k===void 0){Vt("WebGLShadowMap:",X,"has no shadow.");continue}if(k.autoUpdate===!1&&k.needsUpdate===!1)continue;i.copy(k.mapSize);let Z=k.getFrameExtents();i.multiply(Z),r.copy(k.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(r.x=Math.floor(h/Z.x),i.x=r.x*Z.x,k.mapSize.x=r.x),i.y>h&&(r.y=Math.floor(h/Z.y),i.y=r.y*Z.y,k.mapSize.y=r.y));let z=s.state.buffers.depth.getReversed();if(k.camera._reversedDepth=z,k.map===null||V===!0){if(k.map!==null&&(k.map.depthTexture!==null&&(k.map.depthTexture.dispose(),k.map.depthTexture=null),k.map.dispose()),this.type===js){if(X.isPointLight){Vt("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}k.map=new Le(i.x,i.y,{format:Hi,type:ze,minFilter:Ke,magFilter:Ke,generateMipmaps:!1}),k.map.texture.name=X.name+".shadowMap",k.map.depthTexture=new Ii(i.x,i.y,Pn),k.map.depthTexture.name=X.name+".shadowMapDepth",k.map.depthTexture.format=Qn,k.map.depthTexture.compareFunction=null,k.map.depthTexture.minFilter=We,k.map.depthTexture.magFilter=We}else X.isPointLight?(k.map=new hc(i.x),k.map.depthTexture=new Jo(i.x,Wn)):(k.map=new Le(i.x,i.y),k.map.depthTexture=new Ii(i.x,i.y,Wn)),k.map.depthTexture.name=X.name+".shadowMap",k.map.depthTexture.format=Qn,this.type===rs?(k.map.depthTexture.compareFunction=z?oc:ac,k.map.depthTexture.minFilter=Ke,k.map.depthTexture.magFilter=Ke):(k.map.depthTexture.compareFunction=null,k.map.depthTexture.minFilter=We,k.map.depthTexture.magFilter=We);k.camera.updateProjectionMatrix()}k.map.isWebGLCubeRenderTarget!==!0&&(k.map.width!==i.x||k.map.height!==i.y)&&k.map.setSize(i.x,i.y);let q=k.map.isWebGLCubeRenderTarget?6:k.getViewportCount();X.isPointLight!==!0&&k.updateMatrices(X,v);for(let $=0;$<q;$++){let mt=k.getCamera($);if(X.isPointLight){let ft=k.camera,Gt=k.matrix,Wt=X.distance||ft.far;Wt!==ft.far&&(ft.far=Wt,ft.updateProjectionMatrix()),za.setFromMatrixPosition(X.matrixWorld),ft.position.copy(za),ou.copy(ft.position),ou.add(xy[$]),ft.up.copy(_y[$]),ft.lookAt(ou),ft.updateMatrixWorld(),Gt.makeTranslation(-za.x,-za.y,-za.z),Yf.multiplyMatrices(ft.projectionMatrix,ft.matrixWorldInverse),k._frustum.setFromProjectionMatrix(Yf,ft.coordinateSystem,ft.reversedDepth)}if(k.map.isWebGLCubeRenderTarget)s.setRenderTarget(k.map,$),s.clear();else{$===0&&(s.setRenderTarget(k.map),s.clear());let ft=k.getViewport($);a.set(r.x*ft.x,r.y*ft.y,r.x*ft.z,r.y*ft.w),B.viewport(a)}n=k.getFrustum($),y(C,v,mt,X,this.type)}k.isPointLightShadow!==!0&&this.type===js&&M(k,v),k.needsUpdate=!1}p=this.type,g.needsUpdate=!1,s.setRenderTarget(A,I,D)};function M(E,C){let v=t.update(x);u.defines.VSM_SAMPLES!==E.blurSamples&&(u.defines.VSM_SAMPLES=E.blurSamples,f.defines.VSM_SAMPLES=E.blurSamples,u.needsUpdate=!0,f.needsUpdate=!0),E.mapPass===null?E.mapPass=new Le(i.x,i.y,{format:Hi,type:ze}):(E.mapPass.width!==E.map.width||E.mapPass.height!==E.map.height)&&E.mapPass.setSize(E.map.width,E.map.height),u.uniforms.shadow_pass.value=E.map.depthTexture,u.uniforms.resolution.value.set(E.map.width,E.map.height),u.uniforms.radius.value=E.radius,s.setRenderTarget(E.mapPass),s.clear(),s.renderBufferDirect(C,null,v,u,x,null),f.uniforms.shadow_pass.value=E.mapPass.texture,f.uniforms.resolution.value.set(E.map.width,E.map.height),f.uniforms.radius.value=E.radius,s.setRenderTarget(E.map),s.clear(),s.renderBufferDirect(C,null,v,f,x,null)}function S(E,C,v,A){let I=null,D=v.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(D!==void 0)I=D;else if(I=v.isPointLight===!0?c:o,s.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0||C.alphaToCoverage===!0){let B=I.uuid,V=C.uuid,P=l[B];P===void 0&&(P={},l[B]=P);let L=P[V];L===void 0&&(L=I.clone(),P[V]=L,C.addEventListener("dispose",T)),I=L}if(I.visible=C.visible,I.wireframe=C.wireframe,A===js?I.side=C.shadowSide!==null?C.shadowSide:C.side:I.side=C.shadowSide!==null?C.shadowSide:d[C.side],I.alphaMap=C.alphaMap,I.alphaTest=C.alphaToCoverage===!0?.5:C.alphaTest,I.map=C.map,I.clipShadows=C.clipShadows,I.clippingPlanes=C.clippingPlanes,I.clipIntersection=C.clipIntersection,I.displacementMap=C.displacementMap,I.displacementScale=C.displacementScale,I.displacementBias=C.displacementBias,I.wireframeLinewidth=C.wireframeLinewidth,I.linewidth=C.linewidth,v.isPointLight===!0&&I.isMeshDistanceMaterial===!0){let B=s.properties.get(I);B.light=v}return I}function y(E,C,v,A,I){if(E.visible===!1)return;if(E.layers.test(C.layers)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&I===js)&&(!E.frustumCulled||E.intersectsFrustum(n))){E.modelViewMatrix.multiplyMatrices(v.matrixWorldInverse,E.matrixWorld);let V=t.update(E),P=E.material;if(Array.isArray(P)){let L=V.groups;for(let X=0,k=L.length;X<k;X++){let Z=L[X],z=P[Z.materialIndex];if(z&&z.visible){let q=S(E,z,A,I);E.onBeforeShadow(s,E,C,v,V,q,Z),s.renderBufferDirect(v,null,V,q,E,Z),E.onAfterShadow(s,E,C,v,V,q,Z)}}}else if(P.visible){let L=S(E,P,A,I);E.onBeforeShadow(s,E,C,v,V,L,null),s.renderBufferDirect(v,null,V,L,E,null),E.onAfterShadow(s,E,C,v,V,L,null)}}let B=E.children;for(let V=0,P=B.length;V<P;V++)y(B[V],C,v,A,I)}function T(E){E.target.removeEventListener("dispose",T);for(let v in l){let A=l[v],I=E.target.uuid;I in A&&(A[I].dispose(),delete A[I])}}}function yy(s,t){function e(){let F=!1,_t=new Ae,tt=null,vt=new Ae(0,0,0,0);return{setMask:function(wt){tt!==wt&&!F&&(s.colorMask(wt,wt,wt,wt),tt=wt)},setLocked:function(wt){F=wt},setClear:function(wt,st,Ft,Lt,ye){ye===!0&&(wt*=Lt,st*=Lt,Ft*=Lt),_t.set(wt,st,Ft,Lt),vt.equals(_t)===!1&&(s.clearColor(wt,st,Ft,Lt),vt.copy(_t))},reset:function(){F=!1,tt=null,vt.set(-1,0,0,0)}}}function n(){let F=!1,_t=!1,tt=null,vt=null,wt=null;return{setReversed:function(st){if(_t!==st){let Ft=t.get("EXT_clip_control");st?Ft.clipControlEXT(Ft.LOWER_LEFT_EXT,Ft.ZERO_TO_ONE_EXT):Ft.clipControlEXT(Ft.LOWER_LEFT_EXT,Ft.NEGATIVE_ONE_TO_ONE_EXT),_t=st;let Lt=wt;wt=null,this.setClear(Lt)}},getReversed:function(){return _t},setTest:function(st){st?Q(s.DEPTH_TEST):dt(s.DEPTH_TEST)},setMask:function(st){tt!==st&&!F&&(s.depthMask(st),tt=st)},setFunc:function(st){if(_t&&(st=_f[st]),vt!==st){switch(st){case Fo:s.depthFunc(s.NEVER);break;case Bo:s.depthFunc(s.ALWAYS);break;case Oo:s.depthFunc(s.LESS);break;case zs:s.depthFunc(s.LEQUAL);break;case zo:s.depthFunc(s.EQUAL);break;case ko:s.depthFunc(s.GEQUAL);break;case Vo:s.depthFunc(s.GREATER);break;case Ho:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}vt=st}},setLocked:function(st){F=st},setClear:function(st){wt!==st&&(wt=st,_t&&(st=1-st),s.clearDepth(st))},reset:function(){F=!1,tt=null,vt=null,wt=null,_t=!1}}}function i(){let F=!1,_t=null,tt=null,vt=null,wt=null,st=null,Ft=null,Lt=null,ye=null;return{setTest:function(ue){F||(ue?Q(s.STENCIL_TEST):dt(s.STENCIL_TEST))},setMask:function(ue){_t!==ue&&!F&&(s.stencilMask(ue),_t=ue)},setFunc:function(ue,Un,Yn){(tt!==ue||vt!==Un||wt!==Yn)&&(s.stencilFunc(ue,Un,Yn),tt=ue,vt=Un,wt=Yn)},setOp:function(ue,Un,Yn){(st!==ue||Ft!==Un||Lt!==Yn)&&(s.stencilOp(ue,Un,Yn),st=ue,Ft=Un,Lt=Yn)},setLocked:function(ue){F=ue},setClear:function(ue){ye!==ue&&(s.clearStencil(ue),ye=ue)},reset:function(){F=!1,_t=null,tt=null,vt=null,wt=null,st=null,Ft=null,Lt=null,ye=null}}}let r=new e,a=new n,o=new i,c=new WeakMap,l=new WeakMap,h={},d={},u={},f=new WeakMap,m=[],x=null,g=!1,p=null,M=null,S=null,y=null,T=null,E=null,C=null,v=new lt(0,0,0),A=0,I=!1,D=null,B=null,V=null,P=null,L=null,X=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS),k=!1,Z=0,z=s.getParameter(s.VERSION);z.indexOf("WebGL")!==-1?(Z=parseFloat(/^WebGL (\d)/.exec(z)[1]),k=Z>=1):z.indexOf("OpenGL ES")!==-1&&(Z=parseFloat(/^OpenGL ES (\d)/.exec(z)[1]),k=Z>=2);let q=null,$={},mt=s.getParameter(s.SCISSOR_BOX),ft=s.getParameter(s.VIEWPORT),Gt=new Ae().fromArray(mt),Wt=new Ae().fromArray(ft);function jt(F,_t,tt,vt){let wt=new Uint8Array(4),st=s.createTexture();s.bindTexture(F,st),s.texParameteri(F,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(F,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let Ft=0;Ft<tt;Ft++)F===s.TEXTURE_3D||F===s.TEXTURE_2D_ARRAY?s.texImage3D(_t,0,s.RGBA,1,1,vt,0,s.RGBA,s.UNSIGNED_BYTE,wt):s.texImage2D(_t+Ft,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,wt);return st}let J={};J[s.TEXTURE_2D]=jt(s.TEXTURE_2D,s.TEXTURE_2D,1),J[s.TEXTURE_CUBE_MAP]=jt(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),J[s.TEXTURE_2D_ARRAY]=jt(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),J[s.TEXTURE_3D]=jt(s.TEXTURE_3D,s.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),Q(s.DEPTH_TEST),a.setFunc(zs),ot(!1),ht(Ph),Q(s.CULL_FACE),rt(Cn);function Q(F){h[F]!==!0&&(s.enable(F),h[F]=!0)}function dt(F){h[F]!==!1&&(s.disable(F),h[F]=!1)}function Bt(F,_t){return u[F]!==_t?(s.bindFramebuffer(F,_t),u[F]=_t,F===s.DRAW_FRAMEBUFFER&&(u[s.FRAMEBUFFER]=_t),F===s.FRAMEBUFFER&&(u[s.DRAW_FRAMEBUFFER]=_t),!0):!1}function yt(F,_t){let tt=m,vt=!1;if(F){tt=f.get(_t),tt===void 0&&(tt=[],f.set(_t,tt));let wt=F.textures;if(tt.length!==wt.length||tt[0]!==s.COLOR_ATTACHMENT0){for(let st=0,Ft=wt.length;st<Ft;st++)tt[st]=s.COLOR_ATTACHMENT0+st;tt.length=wt.length,vt=!0}}else tt[0]!==s.BACK&&(tt[0]=s.BACK,vt=!0);vt&&s.drawBuffers(tt)}function zt(F){return x!==F?(s.useProgram(F),x=F,!0):!1}let ce={[as]:s.FUNC_ADD,[zd]:s.FUNC_SUBTRACT,[kd]:s.FUNC_REVERSE_SUBTRACT};ce[Vd]=s.MIN,ce[Hd]=s.MAX;let et={[Gd]:s.ZERO,[Wd]:s.ONE,[Xd]:s.SRC_COLOR,[Dh]:s.SRC_ALPHA,[Kd]:s.SRC_ALPHA_SATURATE,[Jd]:s.DST_COLOR,[Yd]:s.DST_ALPHA,[qd]:s.ONE_MINUS_SRC_COLOR,[Nh]:s.ONE_MINUS_SRC_ALPHA,[Zd]:s.ONE_MINUS_DST_COLOR,[$d]:s.ONE_MINUS_DST_ALPHA,[jd]:s.CONSTANT_COLOR,[Qd]:s.ONE_MINUS_CONSTANT_COLOR,[tf]:s.CONSTANT_ALPHA,[ef]:s.ONE_MINUS_CONSTANT_ALPHA};function rt(F,_t,tt,vt,wt,st,Ft,Lt,ye,ue){if(F===Cn){g===!0&&(dt(s.BLEND),g=!1);return}if(g===!1&&(Q(s.BLEND),g=!0),F!==Od){if(F!==p||ue!==I){if((M!==as||T!==as)&&(s.blendEquation(s.FUNC_ADD),M=as,T=as),ue)switch(F){case Oi:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case gn:s.blendFunc(s.ONE,s.ONE);break;case Ih:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case Lh:s.blendFuncSeparate(s.DST_COLOR,s.ONE_MINUS_SRC_ALPHA,s.ZERO,s.ONE);break;default:Ht("WebGLState: Invalid blending: ",F);break}else switch(F){case Oi:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case gn:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE,s.ONE,s.ONE);break;case Ih:Ht("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Lh:Ht("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Ht("WebGLState: Invalid blending: ",F);break}S=null,y=null,E=null,C=null,v.set(0,0,0),A=0,p=F,I=ue}return}wt=wt||_t,st=st||tt,Ft=Ft||vt,(_t!==M||wt!==T)&&(s.blendEquationSeparate(ce[_t],ce[wt]),M=_t,T=wt),(tt!==S||vt!==y||st!==E||Ft!==C)&&(s.blendFuncSeparate(et[tt],et[vt],et[st],et[Ft]),S=tt,y=vt,E=st,C=Ft),(Lt.equals(v)===!1||ye!==A)&&(s.blendColor(Lt.r,Lt.g,Lt.b,ye),v.copy(Lt),A=ye),p=F,I=!1}function at(F,_t){F.side===Oe?dt(s.CULL_FACE):Q(s.CULL_FACE);let tt=F.side===qe;_t&&(tt=!tt),ot(tt),F.blending===Oi&&F.transparent===!1?rt(Cn):rt(F.blending,F.blendEquation,F.blendSrc,F.blendDst,F.blendEquationAlpha,F.blendSrcAlpha,F.blendDstAlpha,F.blendColor,F.blendAlpha,F.premultipliedAlpha),a.setFunc(F.depthFunc),a.setTest(F.depthTest),a.setMask(F.depthWrite),r.setMask(F.colorWrite);let vt=F.stencilWrite;o.setTest(vt),vt&&(o.setMask(F.stencilWriteMask),o.setFunc(F.stencilFunc,F.stencilRef,F.stencilFuncMask),o.setOp(F.stencilFail,F.stencilZFail,F.stencilZPass)),It(F.polygonOffset,F.polygonOffsetFactor,F.polygonOffsetUnits),F.alphaToCoverage===!0?Q(s.SAMPLE_ALPHA_TO_COVERAGE):dt(s.SAMPLE_ALPHA_TO_COVERAGE)}function ot(F){D!==F&&(F?s.frontFace(s.CW):s.frontFace(s.CCW),D=F)}function ht(F){F!==Ud?(Q(s.CULL_FACE),F!==B&&(F===Ph?s.cullFace(s.BACK):F===Fd?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):dt(s.CULL_FACE),B=F}function Ot(F){F!==V&&(k&&s.lineWidth(F),V=F)}function It(F,_t,tt){F?(Q(s.POLYGON_OFFSET_FILL),(P!==_t||L!==tt)&&(P=_t,L=tt,a.getReversed()&&(_t=-_t),s.polygonOffset(_t,tt))):dt(s.POLYGON_OFFSET_FILL)}function Xt(F){F?Q(s.SCISSOR_TEST):dt(s.SCISSOR_TEST)}function $t(F){F===void 0&&(F=s.TEXTURE0+X-1),q!==F&&(s.activeTexture(F),q=F)}function N(F,_t,tt){tt===void 0&&(q===null?tt=s.TEXTURE0+X-1:tt=q);let vt=$[tt];vt===void 0&&(vt={type:void 0,texture:void 0},$[tt]=vt),(vt.type!==F||vt.texture!==_t)&&(q!==tt&&(s.activeTexture(tt),q=tt),s.bindTexture(F,_t||J[F]),vt.type=F,vt.texture=_t)}function he(){let F=$[q];F!==void 0&&F.type!==void 0&&(s.bindTexture(F.type,null),F.type=void 0,F.texture=void 0)}function ne(){try{s.compressedTexImage2D(...arguments)}catch(F){Ht("WebGLState:",F)}}function R(){try{s.compressedTexImage3D(...arguments)}catch(F){Ht("WebGLState:",F)}}function _(){try{s.texSubImage2D(...arguments)}catch(F){Ht("WebGLState:",F)}}function O(){try{s.texSubImage3D(...arguments)}catch(F){Ht("WebGLState:",F)}}function W(){try{s.compressedTexSubImage2D(...arguments)}catch(F){Ht("WebGLState:",F)}}function K(){try{s.compressedTexSubImage3D(...arguments)}catch(F){Ht("WebGLState:",F)}}function ct(){try{s.texStorage2D(...arguments)}catch(F){Ht("WebGLState:",F)}}function pt(){try{s.texStorage3D(...arguments)}catch(F){Ht("WebGLState:",F)}}function j(){try{s.texImage2D(...arguments)}catch(F){Ht("WebGLState:",F)}}function nt(){try{s.texImage3D(...arguments)}catch(F){Ht("WebGLState:",F)}}function gt(F){return d[F]!==void 0?d[F]:s.getParameter(F)}function Nt(F,_t){d[F]!==_t&&(s.pixelStorei(F,_t),d[F]=_t)}function Mt(F){Gt.equals(F)===!1&&(s.scissor(F.x,F.y,F.z,F.w),Gt.copy(F))}function xt(F){Wt.equals(F)===!1&&(s.viewport(F.x,F.y,F.z,F.w),Wt.copy(F))}function Ut(F,_t){let tt=l.get(_t);tt===void 0&&(tt=new WeakMap,l.set(_t,tt));let vt=tt.get(F);vt===void 0&&(vt=s.getUniformBlockIndex(_t,F.name),tt.set(F,vt))}function kt(F,_t){let vt=l.get(_t).get(F);c.get(_t)!==vt&&(s.uniformBlockBinding(_t,vt,F.__bindingPointIndex),c.set(_t,vt))}function Jt(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),a.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),s.pixelStorei(s.PACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,!1),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,s.BROWSER_DEFAULT_WEBGL),s.pixelStorei(s.PACK_ROW_LENGTH,0),s.pixelStorei(s.PACK_SKIP_PIXELS,0),s.pixelStorei(s.PACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_ROW_LENGTH,0),s.pixelStorei(s.UNPACK_IMAGE_HEIGHT,0),s.pixelStorei(s.UNPACK_SKIP_PIXELS,0),s.pixelStorei(s.UNPACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_SKIP_IMAGES,0),h={},d={},q=null,$={},u={},f=new WeakMap,m=[],x=null,g=!1,p=null,M=null,S=null,y=null,T=null,E=null,C=null,v=new lt(0,0,0),A=0,I=!1,D=null,B=null,V=null,P=null,L=null,Gt.set(0,0,s.canvas.width,s.canvas.height),Wt.set(0,0,s.canvas.width,s.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:Q,disable:dt,bindFramebuffer:Bt,drawBuffers:yt,useProgram:zt,setBlending:rt,setMaterial:at,setFlipSided:ot,setCullFace:ht,setLineWidth:Ot,setPolygonOffset:It,setScissorTest:Xt,activeTexture:$t,bindTexture:N,unbindTexture:he,compressedTexImage2D:ne,compressedTexImage3D:R,texImage2D:j,texImage3D:nt,pixelStorei:Nt,getParameter:gt,updateUBOMapping:Ut,uniformBlockBinding:kt,texStorage2D:ct,texStorage3D:pt,texSubImage2D:_,texSubImage3D:O,compressedTexSubImage2D:W,compressedTexSubImage3D:K,scissor:Mt,viewport:xt,reset:Jt}}function My(s,t,e,n,i,r,a){let o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new it,h=new WeakMap,d=new Set,u,f=new WeakMap,m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function x(R,_){return m?new OffscreenCanvas(R,_):Wr("canvas")}function g(R,_,O){let W=1,K=ne(R);if((K.width>O||K.height>O)&&(W=O/Math.max(K.width,K.height)),W<1)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap||typeof VideoFrame<"u"&&R instanceof VideoFrame){let ct=Math.floor(W*K.width),pt=Math.floor(W*K.height);u===void 0&&(u=x(ct,pt));let j=_?x(ct,pt):u;return j.width=ct,j.height=pt,j.getContext("2d").drawImage(R,0,0,ct,pt),Vt("WebGLRenderer: Texture has been resized from ("+K.width+"x"+K.height+") to ("+ct+"x"+pt+")."),j}else return"data"in R&&Vt("WebGLRenderer: Image in DataTexture is too big ("+K.width+"x"+K.height+")."),R;return R}function p(R){return R.generateMipmaps}function M(R){s.generateMipmap(R)}function S(R){return R.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:R.isWebGL3DRenderTarget?s.TEXTURE_3D:R.isWebGLArrayRenderTarget||R.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function y(R,_,O,W,K,ct=!1){if(R!==null){if(s[R]!==void 0)return s[R];Vt("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let pt;W&&(pt=t.get("EXT_texture_norm16"),pt||Vt("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let j=_;if(_===s.RED&&(O===s.FLOAT&&(j=s.R32F),O===s.HALF_FLOAT&&(j=s.R16F),O===s.UNSIGNED_BYTE&&(j=s.R8),O===s.UNSIGNED_SHORT&&pt&&(j=pt.R16_EXT),O===s.SHORT&&pt&&(j=pt.R16_SNORM_EXT)),_===s.RED_INTEGER&&(O===s.UNSIGNED_BYTE&&(j=s.R8UI),O===s.UNSIGNED_SHORT&&(j=s.R16UI),O===s.UNSIGNED_INT&&(j=s.R32UI),O===s.BYTE&&(j=s.R8I),O===s.SHORT&&(j=s.R16I),O===s.INT&&(j=s.R32I)),_===s.RG&&(O===s.FLOAT&&(j=s.RG32F),O===s.HALF_FLOAT&&(j=s.RG16F),O===s.UNSIGNED_BYTE&&(j=s.RG8),O===s.UNSIGNED_SHORT&&pt&&(j=pt.RG16_EXT),O===s.SHORT&&pt&&(j=pt.RG16_SNORM_EXT)),_===s.RG_INTEGER&&(O===s.UNSIGNED_BYTE&&(j=s.RG8UI),O===s.UNSIGNED_SHORT&&(j=s.RG16UI),O===s.UNSIGNED_INT&&(j=s.RG32UI),O===s.BYTE&&(j=s.RG8I),O===s.SHORT&&(j=s.RG16I),O===s.INT&&(j=s.RG32I)),_===s.RGB_INTEGER&&(O===s.UNSIGNED_BYTE&&(j=s.RGB8UI),O===s.UNSIGNED_SHORT&&(j=s.RGB16UI),O===s.UNSIGNED_INT&&(j=s.RGB32UI),O===s.BYTE&&(j=s.RGB8I),O===s.SHORT&&(j=s.RGB16I),O===s.INT&&(j=s.RGB32I)),_===s.RGBA_INTEGER&&(O===s.UNSIGNED_BYTE&&(j=s.RGBA8UI),O===s.UNSIGNED_SHORT&&(j=s.RGBA16UI),O===s.UNSIGNED_INT&&(j=s.RGBA32UI),O===s.BYTE&&(j=s.RGBA8I),O===s.SHORT&&(j=s.RGBA16I),O===s.INT&&(j=s.RGBA32I)),_===s.RGB&&(O===s.UNSIGNED_SHORT&&pt&&(j=pt.RGB16_EXT),O===s.SHORT&&pt&&(j=pt.RGB16_SNORM_EXT),O===s.UNSIGNED_INT_5_9_9_9_REV&&(j=s.RGB9_E5),O===s.UNSIGNED_INT_10F_11F_11F_REV&&(j=s.R11F_G11F_B10F)),_===s.RGBA){let nt=ct?Gr:te.getTransfer(K);O===s.FLOAT&&(j=s.RGBA32F),O===s.HALF_FLOAT&&(j=s.RGBA16F),O===s.UNSIGNED_BYTE&&(j=nt===le?s.SRGB8_ALPHA8:s.RGBA8),O===s.UNSIGNED_SHORT&&pt&&(j=pt.RGBA16_EXT),O===s.SHORT&&pt&&(j=pt.RGBA16_SNORM_EXT),O===s.UNSIGNED_SHORT_4_4_4_4&&(j=s.RGBA4),O===s.UNSIGNED_SHORT_5_5_5_1&&(j=s.RGB5_A1)}return(j===s.R16F||j===s.R32F||j===s.RG16F||j===s.RG32F||j===s.RGBA16F||j===s.RGBA32F)&&t.get("EXT_color_buffer_float"),j}function T(R,_){let O;return R?_===null||_===Wn||_===tr?O=s.DEPTH24_STENCIL8:_===Pn?O=s.DEPTH32F_STENCIL8:_===Qs&&(O=s.DEPTH24_STENCIL8,Vt("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):_===null||_===Wn||_===tr?O=s.DEPTH_COMPONENT24:_===Pn?O=s.DEPTH_COMPONENT32F:_===Qs&&(O=s.DEPTH_COMPONENT16),O}function E(R,_){return p(R)===!0||R.isFramebufferTexture&&R.minFilter!==We&&R.minFilter!==Ke?Math.log2(Math.max(_.width,_.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?_.mipmaps.length:1}function C(R){let _=R.target;_.removeEventListener("dispose",C),A(_),_.isVideoTexture&&h.delete(_),_.isHTMLTexture&&d.delete(_)}function v(R){let _=R.target;_.removeEventListener("dispose",v),D(_)}function A(R){let _=n.get(R);if(_.__webglInit===void 0)return;let O=R.source,W=f.get(O);if(W){let K=W[_.__cacheKey];K.usedTimes--,K.usedTimes===0&&I(R),Object.keys(W).length===0&&f.delete(O)}n.remove(R)}function I(R){let _=n.get(R);s.deleteTexture(_.__webglTexture);let O=R.source,W=f.get(O);delete W[_.__cacheKey],a.memory.textures--}function D(R){let _=n.get(R);if(R.depthTexture&&(R.depthTexture.dispose(),n.remove(R.depthTexture)),R.isWebGLCubeRenderTarget)for(let W=0;W<6;W++){if(Array.isArray(_.__webglFramebuffer[W]))for(let K=0;K<_.__webglFramebuffer[W].length;K++)s.deleteFramebuffer(_.__webglFramebuffer[W][K]);else s.deleteFramebuffer(_.__webglFramebuffer[W]);_.__webglDepthbuffer&&s.deleteRenderbuffer(_.__webglDepthbuffer[W])}else{if(Array.isArray(_.__webglFramebuffer))for(let W=0;W<_.__webglFramebuffer.length;W++)s.deleteFramebuffer(_.__webglFramebuffer[W]);else s.deleteFramebuffer(_.__webglFramebuffer);if(_.__webglDepthbuffer&&s.deleteRenderbuffer(_.__webglDepthbuffer),_.__webglMultisampledFramebuffer&&s.deleteFramebuffer(_.__webglMultisampledFramebuffer),_.__webglColorRenderbuffer)for(let W=0;W<_.__webglColorRenderbuffer.length;W++)_.__webglColorRenderbuffer[W]&&s.deleteRenderbuffer(_.__webglColorRenderbuffer[W]);_.__webglDepthRenderbuffer&&s.deleteRenderbuffer(_.__webglDepthRenderbuffer)}let O=R.textures;for(let W=0,K=O.length;W<K;W++){let ct=n.get(O[W]);ct.__webglTexture&&(s.deleteTexture(ct.__webglTexture),a.memory.textures--),n.remove(O[W])}n.remove(R)}let B=0;function V(){B=0}function P(){return B}function L(R){B=R}function X(){let R=B;return R>=i.maxTextures&&Vt("WebGLTextures: Trying to use "+(R+1)+" texture units while this GPU supports only "+i.maxTextures),B+=1,R}function k(R){let _=[];return _.push(R.wrapS),_.push(R.wrapT),_.push(R.wrapR||0),_.push(R.magFilter),_.push(R.minFilter),_.push(R.anisotropy),_.push(R.internalFormat),_.push(R.format),_.push(R.type),_.push(R.generateMipmaps),_.push(R.premultiplyAlpha),_.push(R.flipY),_.push(R.unpackAlignment),_.push(R.colorSpace),_.join()}function Z(R,_){let O=n.get(R);if(R.isVideoTexture&&N(R),R.isRenderTargetTexture===!1&&R.isExternalTexture!==!0&&R.version>0&&O.__version!==R.version){let W=R.image;if(W===null)Vt("WebGLRenderer: Texture marked for update but no image data found.");else if(W.complete===!1)Vt("WebGLRenderer: Texture marked for update but image is incomplete");else{dt(O,R,_);return}}else R.isExternalTexture&&(O.__webglTexture=R.sourceTexture?R.sourceTexture:null);e.bindTexture(s.TEXTURE_2D,O.__webglTexture,s.TEXTURE0+_)}function z(R,_){let O=n.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&O.__version!==R.version){dt(O,R,_);return}else R.isExternalTexture&&(O.__webglTexture=R.sourceTexture?R.sourceTexture:null);e.bindTexture(s.TEXTURE_2D_ARRAY,O.__webglTexture,s.TEXTURE0+_)}function q(R,_){let O=n.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&O.__version!==R.version){dt(O,R,_);return}e.bindTexture(s.TEXTURE_3D,O.__webglTexture,s.TEXTURE0+_)}function $(R,_){let O=n.get(R);if(R.isCubeDepthTexture!==!0&&R.version>0&&O.__version!==R.version){Bt(O,R,_);return}e.bindTexture(s.TEXTURE_CUBE_MAP,O.__webglTexture,s.TEXTURE0+_)}let mt={[pi]:s.REPEAT,[Zn]:s.CLAMP_TO_EDGE,[Go]:s.MIRRORED_REPEAT},ft={[We]:s.NEAREST,[rf]:s.NEAREST_MIPMAP_NEAREST,[Ia]:s.NEAREST_MIPMAP_LINEAR,[Ke]:s.LINEAR,[Ml]:s.LINEAR_MIPMAP_NEAREST,[ki]:s.LINEAR_MIPMAP_LINEAR},Gt={[cf]:s.NEVER,[pf]:s.ALWAYS,[hf]:s.LESS,[ac]:s.LEQUAL,[uf]:s.EQUAL,[oc]:s.GEQUAL,[df]:s.GREATER,[ff]:s.NOTEQUAL};function Wt(R,_){if(_.type===Pn&&t.has("OES_texture_float_linear")===!1&&(_.magFilter===Ke||_.magFilter===Ml||_.magFilter===Ia||_.magFilter===ki||_.minFilter===Ke||_.minFilter===Ml||_.minFilter===Ia||_.minFilter===ki)&&Vt("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(R,s.TEXTURE_WRAP_S,mt[_.wrapS]),s.texParameteri(R,s.TEXTURE_WRAP_T,mt[_.wrapT]),(R===s.TEXTURE_3D||R===s.TEXTURE_2D_ARRAY)&&s.texParameteri(R,s.TEXTURE_WRAP_R,mt[_.wrapR]),s.texParameteri(R,s.TEXTURE_MAG_FILTER,ft[_.magFilter]),s.texParameteri(R,s.TEXTURE_MIN_FILTER,ft[_.minFilter]),_.compareFunction&&(s.texParameteri(R,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(R,s.TEXTURE_COMPARE_FUNC,Gt[_.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(_.magFilter===We||_.minFilter!==Ia&&_.minFilter!==ki||_.type===Pn&&t.has("OES_texture_float_linear")===!1)return;if(_.anisotropy>1||n.get(_).__currentAnisotropy){let O=t.get("EXT_texture_filter_anisotropic");s.texParameterf(R,O.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(_.anisotropy,i.getMaxAnisotropy())),n.get(_).__currentAnisotropy=_.anisotropy}}}function jt(R,_){let O=!1;R.__webglInit===void 0&&(R.__webglInit=!0,_.addEventListener("dispose",C));let W=_.source,K=f.get(W);K===void 0&&(K={},f.set(W,K));let ct=k(_);if(ct!==R.__cacheKey){K[ct]===void 0&&(K[ct]={texture:s.createTexture(),usedTimes:0},a.memory.textures++,O=!0),K[ct].usedTimes++;let pt=K[R.__cacheKey];pt!==void 0&&(K[R.__cacheKey].usedTimes--,pt.usedTimes===0&&I(_)),R.__cacheKey=ct,R.__webglTexture=K[ct].texture}return O}function J(R,_,O){return Math.floor(Math.floor(R/O)/_)}function Q(R,_,O,W){let ct=R.updateRanges;if(ct.length===0)e.texSubImage2D(s.TEXTURE_2D,0,0,0,_.width,_.height,O,W,_.data);else{ct.sort((Nt,Mt)=>Nt.start-Mt.start);let pt=0;for(let Nt=1;Nt<ct.length;Nt++){let Mt=ct[pt],xt=ct[Nt],Ut=Mt.start+Mt.count,kt=J(xt.start,_.width,4),Jt=J(Mt.start,_.width,4);xt.start<=Ut+1&&kt===Jt&&J(xt.start+xt.count-1,_.width,4)===kt?Mt.count=Math.max(Mt.count,xt.start+xt.count-Mt.start):(++pt,ct[pt]=xt)}ct.length=pt+1;let j=e.getParameter(s.UNPACK_ROW_LENGTH),nt=e.getParameter(s.UNPACK_SKIP_PIXELS),gt=e.getParameter(s.UNPACK_SKIP_ROWS);e.pixelStorei(s.UNPACK_ROW_LENGTH,_.width);for(let Nt=0,Mt=ct.length;Nt<Mt;Nt++){let xt=ct[Nt],Ut=Math.floor(xt.start/4),kt=Math.ceil(xt.count/4),Jt=Ut%_.width,F=Math.floor(Ut/_.width),_t=kt,tt=1;e.pixelStorei(s.UNPACK_SKIP_PIXELS,Jt),e.pixelStorei(s.UNPACK_SKIP_ROWS,F),e.texSubImage2D(s.TEXTURE_2D,0,Jt,F,_t,tt,O,W,_.data)}R.clearUpdateRanges(),e.pixelStorei(s.UNPACK_ROW_LENGTH,j),e.pixelStorei(s.UNPACK_SKIP_PIXELS,nt),e.pixelStorei(s.UNPACK_SKIP_ROWS,gt)}}function dt(R,_,O){let W=s.TEXTURE_2D;(_.isDataArrayTexture||_.isCompressedArrayTexture)&&(W=s.TEXTURE_2D_ARRAY),_.isData3DTexture&&(W=s.TEXTURE_3D);let K=jt(R,_),ct=_.source;e.bindTexture(W,R.__webglTexture,s.TEXTURE0+O);let pt=n.get(ct);if(ct.version!==pt.__version||K===!0){if(e.activeTexture(s.TEXTURE0+O),(typeof ImageBitmap<"u"&&_.image instanceof ImageBitmap)===!1){let tt=te.getPrimaries(te.workingColorSpace),vt=_.colorSpace===_i?null:te.getPrimaries(_.colorSpace),wt=_.colorSpace===_i||tt===vt?s.NONE:s.BROWSER_DEFAULT_WEBGL;e.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,_.flipY),e.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),e.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,wt)}e.pixelStorei(s.UNPACK_ALIGNMENT,_.unpackAlignment);let nt=g(_.image,!1,i.maxTextureSize);nt=he(_,nt);let gt=r.convert(_.format,_.colorSpace),Nt=r.convert(_.type),Mt=y(_.internalFormat,gt,Nt,_.normalized,_.colorSpace,_.isVideoTexture);Wt(W,_);let xt,Ut=_.mipmaps,kt=_.isVideoTexture!==!0,Jt=pt.__version===void 0||K===!0,F=ct.dataReady,_t=E(_,nt);if(_.isDepthTexture)Mt=T(_.format===Vi,_.type),Jt&&(kt?e.texStorage2D(s.TEXTURE_2D,1,Mt,nt.width,nt.height):e.texImage2D(s.TEXTURE_2D,0,Mt,nt.width,nt.height,0,gt,Nt,null));else if(_.isDataTexture)if(Ut.length>0){kt&&Jt&&e.texStorage2D(s.TEXTURE_2D,_t,Mt,Ut[0].width,Ut[0].height);for(let tt=0,vt=Ut.length;tt<vt;tt++)xt=Ut[tt],kt?F&&e.texSubImage2D(s.TEXTURE_2D,tt,0,0,xt.width,xt.height,gt,Nt,xt.data):e.texImage2D(s.TEXTURE_2D,tt,Mt,xt.width,xt.height,0,gt,Nt,xt.data);_.generateMipmaps=!1}else kt?(Jt&&e.texStorage2D(s.TEXTURE_2D,_t,Mt,nt.width,nt.height),F&&Q(_,nt,gt,Nt)):e.texImage2D(s.TEXTURE_2D,0,Mt,nt.width,nt.height,0,gt,Nt,nt.data);else if(_.isCompressedTexture)if(_.isCompressedArrayTexture){kt&&Jt&&e.texStorage3D(s.TEXTURE_2D_ARRAY,_t,Mt,Ut[0].width,Ut[0].height,nt.depth);for(let tt=0,vt=Ut.length;tt<vt;tt++)if(xt=Ut[tt],_.format!==In)if(gt!==null)if(kt){if(F)if(_.layerUpdates.size>0){let wt=Zh(xt.width,xt.height,_.format,_.type);for(let st of _.layerUpdates){let Ft=xt.data.subarray(st*wt/xt.data.BYTES_PER_ELEMENT,(st+1)*wt/xt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,tt,0,0,st,xt.width,xt.height,1,gt,Ft)}}else e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,tt,0,0,0,xt.width,xt.height,nt.depth,gt,xt.data)}else e.compressedTexImage3D(s.TEXTURE_2D_ARRAY,tt,Mt,xt.width,xt.height,nt.depth,0,xt.data,0,0);else Vt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else kt?F&&e.texSubImage3D(s.TEXTURE_2D_ARRAY,tt,0,0,0,xt.width,xt.height,nt.depth,gt,Nt,xt.data):e.texImage3D(s.TEXTURE_2D_ARRAY,tt,Mt,xt.width,xt.height,nt.depth,0,gt,Nt,xt.data);_.layerUpdates.size>0&&_.clearLayerUpdates()}else{kt&&Jt&&e.texStorage2D(s.TEXTURE_2D,_t,Mt,Ut[0].width,Ut[0].height);for(let tt=0,vt=Ut.length;tt<vt;tt++)xt=Ut[tt],_.format!==In?gt!==null?kt?F&&e.compressedTexSubImage2D(s.TEXTURE_2D,tt,0,0,xt.width,xt.height,gt,xt.data):e.compressedTexImage2D(s.TEXTURE_2D,tt,Mt,xt.width,xt.height,0,xt.data):Vt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):kt?F&&e.texSubImage2D(s.TEXTURE_2D,tt,0,0,xt.width,xt.height,gt,Nt,xt.data):e.texImage2D(s.TEXTURE_2D,tt,Mt,xt.width,xt.height,0,gt,Nt,xt.data)}else if(_.isDataArrayTexture)if(kt){if(Jt&&e.texStorage3D(s.TEXTURE_2D_ARRAY,_t,Mt,nt.width,nt.height,nt.depth),F)if(_.layerUpdates.size>0){let tt=Zh(nt.width,nt.height,_.format,_.type);for(let vt of _.layerUpdates){let wt=nt.data.subarray(vt*tt/nt.data.BYTES_PER_ELEMENT,(vt+1)*tt/nt.data.BYTES_PER_ELEMENT);e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,vt,nt.width,nt.height,1,gt,Nt,wt)}_.clearLayerUpdates()}else e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,nt.width,nt.height,nt.depth,gt,Nt,nt.data)}else e.texImage3D(s.TEXTURE_2D_ARRAY,0,Mt,nt.width,nt.height,nt.depth,0,gt,Nt,nt.data);else if(_.isData3DTexture)kt?(Jt&&e.texStorage3D(s.TEXTURE_3D,_t,Mt,nt.width,nt.height,nt.depth),F&&e.texSubImage3D(s.TEXTURE_3D,0,0,0,0,nt.width,nt.height,nt.depth,gt,Nt,nt.data)):e.texImage3D(s.TEXTURE_3D,0,Mt,nt.width,nt.height,nt.depth,0,gt,Nt,nt.data);else if(_.isFramebufferTexture){if(Jt)if(kt)e.texStorage2D(s.TEXTURE_2D,_t,Mt,nt.width,nt.height);else{let tt=nt.width,vt=nt.height;for(let wt=0;wt<_t;wt++)e.texImage2D(s.TEXTURE_2D,wt,Mt,tt,vt,0,gt,Nt,null),tt>>=1,vt>>=1}}else if(_.isHTMLTexture){if("texElementImage2D"in s){let tt=s.canvas;if(tt.hasAttribute("layoutsubtree")||tt.setAttribute("layoutsubtree","true"),nt.parentNode!==tt){tt.appendChild(nt),d.add(_),tt.onpaint=vt=>{let wt=vt.changedElements;for(let st of d)wt.includes(st.image)&&(st.needsUpdate=!0)},tt.requestPaint();return}if(s.texElementImage2D.length===3)s.texElementImage2D(s.TEXTURE_2D,s.RGBA8,nt);else{let wt=s.RGBA,st=s.RGBA,Ft=s.UNSIGNED_BYTE;s.texElementImage2D(s.TEXTURE_2D,0,wt,st,Ft,nt)}s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MIN_FILTER,s.LINEAR),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE)}}else if(Ut.length>0){if(kt&&Jt){let tt=ne(Ut[0]);e.texStorage2D(s.TEXTURE_2D,_t,Mt,tt.width,tt.height)}for(let tt=0,vt=Ut.length;tt<vt;tt++)xt=Ut[tt],kt?F&&e.texSubImage2D(s.TEXTURE_2D,tt,0,0,gt,Nt,xt):e.texImage2D(s.TEXTURE_2D,tt,Mt,gt,Nt,xt);_.generateMipmaps=!1}else if(kt){if(Jt){let tt=ne(nt);e.texStorage2D(s.TEXTURE_2D,_t,Mt,tt.width,tt.height)}F&&e.texSubImage2D(s.TEXTURE_2D,0,0,0,gt,Nt,nt)}else e.texImage2D(s.TEXTURE_2D,0,Mt,gt,Nt,nt);p(_)&&M(W),pt.__version=ct.version,_.onUpdate&&_.onUpdate(_)}R.__version=_.version}function Bt(R,_,O){if(_.image.length!==6)return;let W=jt(R,_),K=_.source;e.bindTexture(s.TEXTURE_CUBE_MAP,R.__webglTexture,s.TEXTURE0+O);let ct=n.get(K);if(K.version!==ct.__version||W===!0){e.activeTexture(s.TEXTURE0+O);let pt=te.getPrimaries(te.workingColorSpace),j=_.colorSpace===_i?null:te.getPrimaries(_.colorSpace),nt=_.colorSpace===_i||pt===j?s.NONE:s.BROWSER_DEFAULT_WEBGL;e.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,_.flipY),e.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),e.pixelStorei(s.UNPACK_ALIGNMENT,_.unpackAlignment),e.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,nt);let gt=_.isCompressedTexture||_.image[0].isCompressedTexture,Nt=_.image[0]&&_.image[0].isDataTexture,Mt=[];for(let st=0;st<6;st++)!gt&&!Nt?Mt[st]=g(_.image[st],!0,i.maxCubemapSize):Mt[st]=Nt?_.image[st].image:_.image[st],Mt[st]=he(_,Mt[st]);let xt=Mt[0],Ut=r.convert(_.format,_.colorSpace),kt=r.convert(_.type),Jt=y(_.internalFormat,Ut,kt,_.normalized,_.colorSpace),F=_.isVideoTexture!==!0,_t=ct.__version===void 0||W===!0,tt=K.dataReady,vt=E(_,xt);Wt(s.TEXTURE_CUBE_MAP,_);let wt;if(gt){F&&_t&&e.texStorage2D(s.TEXTURE_CUBE_MAP,vt,Jt,xt.width,xt.height);for(let st=0;st<6;st++){wt=Mt[st].mipmaps;for(let Ft=0;Ft<wt.length;Ft++){let Lt=wt[Ft];_.format!==In?Ut!==null?F?tt&&e.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+st,Ft,0,0,Lt.width,Lt.height,Ut,Lt.data):e.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+st,Ft,Jt,Lt.width,Lt.height,0,Lt.data):Vt("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):F?tt&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+st,Ft,0,0,Lt.width,Lt.height,Ut,kt,Lt.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+st,Ft,Jt,Lt.width,Lt.height,0,Ut,kt,Lt.data)}}}else{if(wt=_.mipmaps,F&&_t){wt.length>0&&vt++;let st=ne(Mt[0]);e.texStorage2D(s.TEXTURE_CUBE_MAP,vt,Jt,st.width,st.height)}for(let st=0;st<6;st++)if(Nt){F?tt&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+st,0,0,0,Mt[st].width,Mt[st].height,Ut,kt,Mt[st].data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+st,0,Jt,Mt[st].width,Mt[st].height,0,Ut,kt,Mt[st].data);for(let Ft=0;Ft<wt.length;Ft++){let ye=wt[Ft].image[st].image;F?tt&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+st,Ft+1,0,0,ye.width,ye.height,Ut,kt,ye.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+st,Ft+1,Jt,ye.width,ye.height,0,Ut,kt,ye.data)}}else{F?tt&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+st,0,0,0,Ut,kt,Mt[st]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+st,0,Jt,Ut,kt,Mt[st]);for(let Ft=0;Ft<wt.length;Ft++){let Lt=wt[Ft];F?tt&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+st,Ft+1,0,0,Ut,kt,Lt.image[st]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+st,Ft+1,Jt,Ut,kt,Lt.image[st])}}}p(_)&&M(s.TEXTURE_CUBE_MAP),ct.__version=K.version,_.onUpdate&&_.onUpdate(_)}R.__version=_.version}function yt(R,_,O,W,K,ct){let pt=r.convert(O.format,O.colorSpace),j=r.convert(O.type),nt=y(O.internalFormat,pt,j,O.normalized,O.colorSpace),gt=n.get(_),Nt=n.get(O);if(Nt.__renderTarget=_,!gt.__hasExternalTextures){let Mt=Math.max(1,_.width>>ct),xt=Math.max(1,_.height>>ct);K===s.TEXTURE_3D||K===s.TEXTURE_2D_ARRAY?e.texImage3D(K,ct,nt,Mt,xt,_.depth,0,pt,j,null):e.texImage2D(K,ct,nt,Mt,xt,0,pt,j,null)}e.bindFramebuffer(s.FRAMEBUFFER,R),$t(_)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,W,K,Nt.__webglTexture,0,Xt(_)):(K===s.TEXTURE_2D||K>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&K<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,W,K,Nt.__webglTexture,ct),e.bindFramebuffer(s.FRAMEBUFFER,null)}function zt(R,_,O){if(s.bindRenderbuffer(s.RENDERBUFFER,R),_.depthBuffer){let W=_.depthTexture,K=W&&W.isDepthTexture?W.type:null,ct=T(_.stencilBuffer,K),pt=_.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;$t(_)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,Xt(_),ct,_.width,_.height):O?s.renderbufferStorageMultisample(s.RENDERBUFFER,Xt(_),ct,_.width,_.height):s.renderbufferStorage(s.RENDERBUFFER,ct,_.width,_.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,pt,s.RENDERBUFFER,R)}else{let W=_.textures;for(let K=0;K<W.length;K++){let ct=W[K],pt=r.convert(ct.format,ct.colorSpace),j=r.convert(ct.type),nt=y(ct.internalFormat,pt,j,ct.normalized,ct.colorSpace);$t(_)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,Xt(_),nt,_.width,_.height):O?s.renderbufferStorageMultisample(s.RENDERBUFFER,Xt(_),nt,_.width,_.height):s.renderbufferStorage(s.RENDERBUFFER,nt,_.width,_.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function ce(R,_,O){let W=_.isWebGLCubeRenderTarget===!0;if(e.bindFramebuffer(s.FRAMEBUFFER,R),!(_.depthTexture&&_.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let K=n.get(_.depthTexture);if(K.__renderTarget=_,(!K.__webglTexture||_.depthTexture.image.width!==_.width||_.depthTexture.image.height!==_.height)&&(_.depthTexture.image.width=_.width,_.depthTexture.image.height=_.height,_.depthTexture.needsUpdate=!0),W){if(K.__webglInit===void 0&&(K.__webglInit=!0,_.depthTexture.addEventListener("dispose",C)),K.__webglTexture===void 0){K.__webglTexture=s.createTexture(),e.bindTexture(s.TEXTURE_CUBE_MAP,K.__webglTexture),Wt(s.TEXTURE_CUBE_MAP,_.depthTexture);let gt=r.convert(_.depthTexture.format),Nt=r.convert(_.depthTexture.type),Mt;_.depthTexture.format===Qn?Mt=s.DEPTH_COMPONENT24:_.depthTexture.format===Vi&&(Mt=s.DEPTH24_STENCIL8);for(let xt=0;xt<6;xt++)s.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+xt,0,Mt,_.width,_.height,0,gt,Nt,null)}}else Z(_.depthTexture,0);let ct=K.__webglTexture,pt=Xt(_),j=W?s.TEXTURE_CUBE_MAP_POSITIVE_X+O:s.TEXTURE_2D,nt=_.depthTexture.format===Vi?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;if(_.depthTexture.format===Qn)$t(_)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,nt,j,ct,0,pt):s.framebufferTexture2D(s.FRAMEBUFFER,nt,j,ct,0);else if(_.depthTexture.format===Vi)$t(_)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,nt,j,ct,0,pt):s.framebufferTexture2D(s.FRAMEBUFFER,nt,j,ct,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function et(R){let _=n.get(R),O=R.isWebGLCubeRenderTarget===!0;if(_.__boundDepthTexture!==R.depthTexture){let W=R.depthTexture;if(_.__depthDisposeCallback&&_.__depthDisposeCallback(),W){let K=()=>{delete _.__boundDepthTexture,delete _.__depthDisposeCallback,W.removeEventListener("dispose",K)};W.addEventListener("dispose",K),_.__depthDisposeCallback=K}_.__boundDepthTexture=W}if(R.depthTexture&&!_.__autoAllocateDepthBuffer)if(O)for(let W=0;W<6;W++)ce(_.__webglFramebuffer[W],R,W);else{let W=R.texture.mipmaps;W&&W.length>0?ce(_.__webglFramebuffer[0],R,0):ce(_.__webglFramebuffer,R,0)}else if(O){_.__webglDepthbuffer=[];for(let W=0;W<6;W++)if(e.bindFramebuffer(s.FRAMEBUFFER,_.__webglFramebuffer[W]),_.__webglDepthbuffer[W]===void 0)_.__webglDepthbuffer[W]=s.createRenderbuffer(),zt(_.__webglDepthbuffer[W],R,!1);else{let K=R.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,ct=_.__webglDepthbuffer[W];s.bindRenderbuffer(s.RENDERBUFFER,ct),s.framebufferRenderbuffer(s.FRAMEBUFFER,K,s.RENDERBUFFER,ct)}}else{let W=R.texture.mipmaps;if(W&&W.length>0?e.bindFramebuffer(s.FRAMEBUFFER,_.__webglFramebuffer[0]):e.bindFramebuffer(s.FRAMEBUFFER,_.__webglFramebuffer),_.__webglDepthbuffer===void 0)_.__webglDepthbuffer=s.createRenderbuffer(),zt(_.__webglDepthbuffer,R,!1);else{let K=R.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,ct=_.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,ct),s.framebufferRenderbuffer(s.FRAMEBUFFER,K,s.RENDERBUFFER,ct)}}e.bindFramebuffer(s.FRAMEBUFFER,null)}function rt(R,_,O){let W=n.get(R);_!==void 0&&yt(W.__webglFramebuffer,R,R.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),O!==void 0&&et(R)}function at(R){let _=R.texture,O=n.get(R),W=n.get(_);R.addEventListener("dispose",v);let K=R.textures,ct=R.isWebGLCubeRenderTarget===!0,pt=K.length>1;if(pt||(W.__webglTexture===void 0&&(W.__webglTexture=s.createTexture()),W.__version=_.version,a.memory.textures++),ct){O.__webglFramebuffer=[];for(let j=0;j<6;j++)if(_.mipmaps&&_.mipmaps.length>0){O.__webglFramebuffer[j]=[];for(let nt=0;nt<_.mipmaps.length;nt++)O.__webglFramebuffer[j][nt]=s.createFramebuffer()}else O.__webglFramebuffer[j]=s.createFramebuffer()}else{if(_.mipmaps&&_.mipmaps.length>0){O.__webglFramebuffer=[];for(let j=0;j<_.mipmaps.length;j++)O.__webglFramebuffer[j]=s.createFramebuffer()}else O.__webglFramebuffer=s.createFramebuffer();if(pt)for(let j=0,nt=K.length;j<nt;j++){let gt=n.get(K[j]);gt.__webglTexture===void 0&&(gt.__webglTexture=s.createTexture(),a.memory.textures++)}if(R.samples>0&&$t(R)===!1){O.__webglMultisampledFramebuffer=s.createFramebuffer(),O.__webglColorRenderbuffer=[],e.bindFramebuffer(s.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let j=0;j<K.length;j++){let nt=K[j];O.__webglColorRenderbuffer[j]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,O.__webglColorRenderbuffer[j]);let gt=r.convert(nt.format,nt.colorSpace),Nt=r.convert(nt.type),Mt=y(nt.internalFormat,gt,Nt,nt.normalized,nt.colorSpace,R.isXRRenderTarget===!0),xt=Xt(R);s.renderbufferStorageMultisample(s.RENDERBUFFER,xt,Mt,R.width,R.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+j,s.RENDERBUFFER,O.__webglColorRenderbuffer[j])}s.bindRenderbuffer(s.RENDERBUFFER,null),R.depthBuffer&&(O.__webglDepthRenderbuffer=s.createRenderbuffer(),zt(O.__webglDepthRenderbuffer,R,!0)),e.bindFramebuffer(s.FRAMEBUFFER,null)}}if(ct){e.bindTexture(s.TEXTURE_CUBE_MAP,W.__webglTexture),Wt(s.TEXTURE_CUBE_MAP,_);for(let j=0;j<6;j++)if(_.mipmaps&&_.mipmaps.length>0)for(let nt=0;nt<_.mipmaps.length;nt++)yt(O.__webglFramebuffer[j][nt],R,_,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+j,nt);else yt(O.__webglFramebuffer[j],R,_,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+j,0);p(_)&&M(s.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(pt){for(let j=0,nt=K.length;j<nt;j++){let gt=K[j],Nt=n.get(gt),Mt=s.TEXTURE_2D;(R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(Mt=R.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),e.bindTexture(Mt,Nt.__webglTexture),Wt(Mt,gt),yt(O.__webglFramebuffer,R,gt,s.COLOR_ATTACHMENT0+j,Mt,0),p(gt)&&M(Mt)}e.unbindTexture()}else{let j=s.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(j=R.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),e.bindTexture(j,W.__webglTexture),Wt(j,_),_.mipmaps&&_.mipmaps.length>0)for(let nt=0;nt<_.mipmaps.length;nt++)yt(O.__webglFramebuffer[nt],R,_,s.COLOR_ATTACHMENT0,j,nt);else yt(O.__webglFramebuffer,R,_,s.COLOR_ATTACHMENT0,j,0);p(_)&&M(j),e.unbindTexture()}R.depthBuffer&&et(R)}function ot(R){let _=R.textures;for(let O=0,W=_.length;O<W;O++){let K=_[O];if(p(K)){let ct=S(R),pt=n.get(K).__webglTexture;e.bindTexture(ct,pt),M(ct),e.unbindTexture()}}}let ht=[],Ot=[];function It(R){if(R.samples>0){if($t(R)===!1){let _=R.textures,O=R.width,W=R.height,K=s.COLOR_BUFFER_BIT,ct=R.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,pt=n.get(R),j=_.length>1;if(j)for(let gt=0;gt<_.length;gt++)e.bindFramebuffer(s.FRAMEBUFFER,pt.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+gt,s.RENDERBUFFER,null),e.bindFramebuffer(s.FRAMEBUFFER,pt.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+gt,s.TEXTURE_2D,null,0);e.bindFramebuffer(s.READ_FRAMEBUFFER,pt.__webglMultisampledFramebuffer);let nt=R.texture.mipmaps;nt&&nt.length>0?e.bindFramebuffer(s.DRAW_FRAMEBUFFER,pt.__webglFramebuffer[0]):e.bindFramebuffer(s.DRAW_FRAMEBUFFER,pt.__webglFramebuffer);for(let gt=0;gt<_.length;gt++){if(R.resolveDepthBuffer&&(R.depthBuffer&&(K|=s.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&(K|=s.STENCIL_BUFFER_BIT)),j){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,pt.__webglColorRenderbuffer[gt]);let Nt=n.get(_[gt]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,Nt,0)}s.blitFramebuffer(0,0,O,W,0,0,O,W,K,s.NEAREST),c===!0&&(ht.length=0,Ot.length=0,ht.push(s.COLOR_ATTACHMENT0+gt),R.depthBuffer&&R.storeMultisampledDepthBuffer===!1&&(ht.push(ct),Ot.push(ct),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,Ot)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,ht))}if(e.bindFramebuffer(s.READ_FRAMEBUFFER,null),e.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),j)for(let gt=0;gt<_.length;gt++){e.bindFramebuffer(s.FRAMEBUFFER,pt.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+gt,s.RENDERBUFFER,pt.__webglColorRenderbuffer[gt]);let Nt=n.get(_[gt]).__webglTexture;e.bindFramebuffer(s.FRAMEBUFFER,pt.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+gt,s.TEXTURE_2D,Nt,0)}e.bindFramebuffer(s.DRAW_FRAMEBUFFER,pt.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.storeMultisampledDepthBuffer===!1&&c){let _=R.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[_])}}}function Xt(R){return Math.min(i.maxSamples,R.samples)}function $t(R){let _=n.get(R);return R.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&_.__useRenderToTexture!==!1}function N(R){let _=a.render.frame;h.get(R)!==_&&(h.set(R,_),R.update())}function he(R,_){let O=R.colorSpace,W=R.format,K=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||O!==Hr&&O!==_i&&(te.getTransfer(O)===le?(W!==In||K!==xn)&&Vt("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Ht("WebGLTextures: Unsupported texture color space:",O)),_}function ne(R){return typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement?(l.width=R.naturalWidth||R.width,l.height=R.naturalHeight||R.height):typeof VideoFrame<"u"&&R instanceof VideoFrame?(l.width=R.displayWidth,l.height=R.displayHeight):(l.width=R.width,l.height=R.height),l}this.allocateTextureUnit=X,this.resetTextureUnits=V,this.getTextureUnits=P,this.setTextureUnits=L,this.setTexture2D=Z,this.setTexture2DArray=z,this.setTexture3D=q,this.setTextureCube=$,this.rebindTextures=rt,this.setupRenderTarget=at,this.updateRenderTargetMipmap=ot,this.updateMultisampleRenderTarget=It,this.setupDepthRenderbuffer=et,this.setupFrameBufferTexture=yt,this.useMultisampledRTT=$t,this.isReversedDepthBuffer=function(){return e.buffers.depth.getReversed()}}function by(s,t){function e(n,i=_i){let r,a=te.getTransfer(i);if(n===xn)return s.UNSIGNED_BYTE;if(n===Sl)return s.UNSIGNED_SHORT_4_4_4_4;if(n===Tl)return s.UNSIGNED_SHORT_5_5_5_1;if(n===zh)return s.UNSIGNED_INT_5_9_9_9_REV;if(n===kh)return s.UNSIGNED_INT_10F_11F_11F_REV;if(n===Bh)return s.BYTE;if(n===Oh)return s.SHORT;if(n===Qs)return s.UNSIGNED_SHORT;if(n===bl)return s.INT;if(n===Wn)return s.UNSIGNED_INT;if(n===Pn)return s.FLOAT;if(n===ze)return s.HALF_FLOAT;if(n===Vh)return s.ALPHA;if(n===Hh)return s.RGB;if(n===In)return s.RGBA;if(n===Qn)return s.DEPTH_COMPONENT;if(n===Vi)return s.DEPTH_STENCIL;if(n===El)return s.RED;if(n===wl)return s.RED_INTEGER;if(n===Hi)return s.RG;if(n===Al)return s.RG_INTEGER;if(n===Rl)return s.RGBA_INTEGER;if(n===La||n===Da||n===Na||n===Ua)if(a===le)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===La)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Da)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Na)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Ua)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===La)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Da)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Na)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Ua)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Cl||n===Pl||n===Il||n===Ll)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Cl)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Pl)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Il)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Ll)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Dl||n===Nl||n===Ul||n===Fl||n===Bl||n===Fa||n===Ol)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Dl||n===Nl)return a===le?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Ul)return a===le?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===Fl)return r.COMPRESSED_R11_EAC;if(n===Bl)return r.COMPRESSED_SIGNED_R11_EAC;if(n===Fa)return r.COMPRESSED_RG11_EAC;if(n===Ol)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===zl||n===kl||n===Vl||n===Hl||n===Gl||n===Wl||n===Xl||n===ql||n===Yl||n===$l||n===Jl||n===Zl||n===Kl||n===jl)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===zl)return a===le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===kl)return a===le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Vl)return a===le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Hl)return a===le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Gl)return a===le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Wl)return a===le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Xl)return a===le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===ql)return a===le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Yl)return a===le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===$l)return a===le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Jl)return a===le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Zl)return a===le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Kl)return a===le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===jl)return a===le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Ql||n===tc||n===ec)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===Ql)return a===le?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===tc)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===ec)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===nc||n===ic||n===Ba||n===sc)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===nc)return r.COMPRESSED_RED_RGTC1_EXT;if(n===ic)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Ba)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===sc)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===tr?s.UNSIGNED_INT_24_8:s[n]!==void 0?s[n]:null}return{convert:e}}var Sy=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Ty=`
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

}`,mu=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){let n=new sa(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){let e=t.cameras[0].viewport,n=new we({vertexShader:Sy,fragmentShader:Ty,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new Tt(new je(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},gu=class extends ti{constructor(t,e){super();let n=this,i=null,r=1,a=null,o="local-floor",c=1,l=null,h=null,d=null,u=null,f=null,m=null,x=typeof XRWebGLBinding<"u",g=new mu,p={},M=e.getContextAttributes(),S=null,y=null,T=[],E=[],C=new it,v=null,A=null,I=new Ze;I.viewport=new Ae;let D=new Ze;D.viewport=new Ae;let B=[I,D],V=new xl,P=null,L=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(J){let Q=T[J];return Q===void 0&&(Q=new Ws,T[J]=Q),Q.getTargetRaySpace()},this.getControllerGrip=function(J){let Q=T[J];return Q===void 0&&(Q=new Ws,T[J]=Q),Q.getGripSpace()},this.getHand=function(J){let Q=T[J];return Q===void 0&&(Q=new Ws,T[J]=Q),Q.getHandSpace()};function X(J){let Q=E.indexOf(J.inputSource);if(Q===-1)return;let dt=T[Q];dt!==void 0&&(dt.update(J.inputSource,J.frame,l||a),dt.dispatchEvent({type:J.type,data:J.inputSource}))}function k(){i.removeEventListener("select",X),i.removeEventListener("selectstart",X),i.removeEventListener("selectend",X),i.removeEventListener("squeeze",X),i.removeEventListener("squeezestart",X),i.removeEventListener("squeezeend",X),i.removeEventListener("end",k),i.removeEventListener("inputsourceschange",Z);for(let J=0;J<T.length;J++){let Q=E[J];Q!==null&&(E[J]=null,T[J].disconnect(Q))}P=null,L=null,g.reset();for(let J in p)delete p[J];if(t.setRenderTarget(S),f=null,u=null,d=null,i=null,y=null,jt.stop(),n.isPresenting=!1,t.setPixelRatio(v),t.setSize(C.width,C.height,!1),A!==null){let J=A.camera;J.fov=A.fov,J.zoom=A.zoom,J.updateProjectionMatrix(),A=null}n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(J){r=J,n.isPresenting===!0&&Vt("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(J){o=J,n.isPresenting===!0&&Vt("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(J){l=J},this.getBaseLayer=function(){return u!==null?u:f},this.getBinding=function(){return d===null&&x&&(d=new XRWebGLBinding(i,e)),d},this.getFrame=function(){return m},this.getSession=function(){return i},this.setSession=async function(J){if(i=J,i!==null){if(S=t.getRenderTarget(),i.addEventListener("select",X),i.addEventListener("selectstart",X),i.addEventListener("selectend",X),i.addEventListener("squeeze",X),i.addEventListener("squeezestart",X),i.addEventListener("squeezeend",X),i.addEventListener("end",k),i.addEventListener("inputsourceschange",Z),M.xrCompatible!==!0&&await e.makeXRCompatible(),v=t.getPixelRatio(),t.getSize(C),x&&"createProjectionLayer"in XRWebGLBinding.prototype){let dt=null,Bt=null,yt=null;M.depth&&(yt=M.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,dt=M.stencil?Vi:Qn,Bt=M.stencil?tr:Wn);let zt={colorFormat:e.RGBA8,depthFormat:yt,scaleFactor:r};d=this.getBinding(),u=d.createProjectionLayer(zt),i.updateRenderState({layers:[u]}),t.setPixelRatio(1),t.setSize(u.textureWidth,u.textureHeight,!1),y=new Le(u.textureWidth,u.textureHeight,{format:In,type:xn,depthTexture:new Ii(u.textureWidth,u.textureHeight,Bt,void 0,void 0,void 0,void 0,void 0,void 0,dt),stencilBuffer:M.stencil,colorSpace:t.outputColorSpace,samples:M.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1,storeMultisampledDepthBuffer:u.ignoreDepthValues===!1,storeMultisampledStencilBuffer:u.ignoreDepthValues===!1})}else{let dt={antialias:M.antialias,alpha:!0,depth:M.depth,stencil:M.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(i,e,dt),i.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),y=new Le(f.framebufferWidth,f.framebufferHeight,{format:In,type:xn,colorSpace:t.outputColorSpace,stencilBuffer:M.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await i.requestReferenceSpace(o),jt.setContext(i),jt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function Z(J){for(let Q=0;Q<J.removed.length;Q++){let dt=J.removed[Q],Bt=E.indexOf(dt);Bt>=0&&(E[Bt]=null,T[Bt].disconnect(dt))}for(let Q=0;Q<J.added.length;Q++){let dt=J.added[Q],Bt=E.indexOf(dt);if(Bt===-1){for(let zt=0;zt<T.length;zt++)if(zt>=E.length){E.push(dt),Bt=zt;break}else if(E[zt]===null){E[zt]=dt,Bt=zt;break}if(Bt===-1)break}let yt=T[Bt];yt&&yt.connect(dt)}}let z=new w,q=new w;function $(J,Q,dt){z.setFromMatrixPosition(Q.matrixWorld),q.setFromMatrixPosition(dt.matrixWorld);let Bt=z.distanceTo(q),yt=Q.projectionMatrix.elements,zt=dt.projectionMatrix.elements,ce=yt[14]/(yt[10]-1),et=yt[14]/(yt[10]+1),rt=(yt[9]+1)/yt[5],at=(yt[9]-1)/yt[5],ot=(yt[8]-1)/yt[0],ht=(zt[8]+1)/zt[0],Ot=ce*ot,It=ce*ht,Xt=Bt/(-ot+ht),$t=Xt*-ot;if(Q.matrixWorld.decompose(J.position,J.quaternion,J.scale),J.translateX($t),J.translateZ(Xt),J.matrixWorld.compose(J.position,J.quaternion,J.scale),J.matrixWorldInverse.copy(J.matrixWorld).invert(),yt[10]===-1)J.projectionMatrix.copy(Q.projectionMatrix),J.projectionMatrixInverse.copy(Q.projectionMatrixInverse);else{let N=ce+Xt,he=et+Xt,ne=Ot-$t,R=It+(Bt-$t),_=rt*et/he*N,O=at*et/he*N;J.projectionMatrix.makePerspective(ne,R,_,O,N,he),J.projectionMatrixInverse.copy(J.projectionMatrix).invert()}}function mt(J,Q){Q===null?J.matrixWorld.copy(J.matrix):J.matrixWorld.multiplyMatrices(Q.matrixWorld,J.matrix),J.matrixWorldInverse.copy(J.matrixWorld).invert()}this.updateCamera=function(J){if(i===null)return;let Q=J.near,dt=J.far;g.texture!==null&&(g.depthNear>0&&(Q=g.depthNear),g.depthFar>0&&(dt=g.depthFar)),V.near=D.near=I.near=Q,V.far=D.far=I.far=dt,(P!==V.near||L!==V.far)&&(i.updateRenderState({depthNear:V.near,depthFar:V.far}),P=V.near,L=V.far),V.layers.mask=J.layers.mask|6,I.layers.mask=V.layers.mask&-5,D.layers.mask=V.layers.mask&-3;let Bt=J.parent,yt=V.cameras;mt(V,Bt);for(let zt=0;zt<yt.length;zt++)mt(yt[zt],Bt);yt.length===2?$(V,I,D):V.projectionMatrix.copy(I.projectionMatrix),A===null&&J.isPerspectiveCamera&&(A={camera:J,fov:J.fov,zoom:J.zoom}),ft(J,V,Bt)};function ft(J,Q,dt){dt===null?J.matrix.copy(Q.matrixWorld):(J.matrix.copy(dt.matrixWorld),J.matrix.invert(),J.matrix.multiply(Q.matrixWorld)),J.matrix.decompose(J.position,J.quaternion,J.scale),J.updateMatrixWorld(!0),J.projectionMatrix.copy(Q.projectionMatrix),J.projectionMatrixInverse.copy(Q.projectionMatrixInverse),J.isPerspectiveCamera&&(J.fov=Hs*2*Math.atan(1/J.projectionMatrix.elements[5]),J.zoom=1)}this.getCamera=function(){return V},this.getFoveation=function(){if(!(u===null&&f===null))return c},this.setFoveation=function(J){c=J,u!==null&&(u.fixedFoveation=J),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=J)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(V)},this.getCameraTexture=function(J){return p[J]};let Gt=null;function Wt(J,Q){if(h=Q.getViewerPose(l||a),m=Q,h!==null){let dt=h.views;f!==null&&(t.setRenderTargetFramebuffer(y,f.framebuffer),t.setRenderTarget(y));let Bt=!1;dt.length!==V.cameras.length&&(V.cameras.length=0,Bt=!0);for(let et=0;et<dt.length;et++){let rt=dt[et],at=null;if(f!==null)at=f.getViewport(rt);else{let ht=d.getViewSubImage(u,rt);at=ht.viewport,et===0&&(t.setRenderTargetTextures(y,ht.colorTexture,ht.depthStencilTexture),t.setRenderTarget(y))}let ot=B[et];ot===void 0&&(ot=new Ze,ot.layers.enable(et),ot.viewport=new Ae,B[et]=ot),ot.matrix.fromArray(rt.transform.matrix),ot.matrix.decompose(ot.position,ot.quaternion,ot.scale),ot.projectionMatrix.fromArray(rt.projectionMatrix),ot.projectionMatrixInverse.copy(ot.projectionMatrix).invert(),ot.viewport.set(at.x,at.y,at.width,at.height),et===0&&(V.matrix.copy(ot.matrix),V.matrix.decompose(V.position,V.quaternion,V.scale)),Bt===!0&&V.cameras.push(ot)}let yt=i.enabledFeatures;if(yt&&yt.includes("depth-sensing")&&i.depthUsage=="gpu-optimized"&&x){d=n.getBinding();let et=d.getDepthInformation(dt[0]);et&&et.isValid&&et.texture&&g.init(et,i.renderState)}if(yt&&yt.includes("camera-access")&&x){t.state.unbindTexture(),d=n.getBinding();for(let et=0;et<dt.length;et++){let rt=dt[et].camera;if(rt){let at=p[rt];at||(at=new sa,p[rt]=at);let ot=d.getCameraImage(rt);at.sourceTexture=ot}}}}for(let dt=0;dt<T.length;dt++){let Bt=E[dt],yt=T[dt];Bt!==null&&yt!==void 0&&yt.update(Bt,Q,l||a)}Gt&&Gt(J,Q),Q.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:Q}),m=null}let jt=new $f;jt.setAnimationLoop(Wt),this.setAnimationLoop=function(J){Gt=J},this.dispose=function(){}}},Ey=new oe,tp=new Yt;tp.set(-1,0,0,0,1,0,0,0,1);function wy(s,t){function e(g,p){g.matrixAutoUpdate===!0&&g.updateMatrix(),p.value.copy(g.matrix)}function n(g,p){p.color.getRGB(g.fogColor.value,Yh(s)),p.isFog?(g.fogNear.value=p.near,g.fogFar.value=p.far):p.isFogExp2&&(g.fogDensity.value=p.density)}function i(g,p,M,S,y){p.isNodeMaterial?p.uniformsNeedUpdate=!1:p.isMeshBasicMaterial?r(g,p):p.isMeshLambertMaterial?(r(g,p),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)):p.isMeshToonMaterial?(r(g,p),d(g,p)):p.isMeshPhongMaterial?(r(g,p),h(g,p),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)):p.isMeshStandardMaterial?(r(g,p),u(g,p),p.isMeshPhysicalMaterial&&f(g,p,y)):p.isMeshMatcapMaterial?(r(g,p),m(g,p)):p.isMeshDepthMaterial?r(g,p):p.isMeshDistanceMaterial?(r(g,p),x(g,p)):p.isMeshNormalMaterial?r(g,p):p.isLineBasicMaterial?(a(g,p),p.isLineDashedMaterial&&o(g,p)):p.isPointsMaterial?c(g,p,M,S):p.isSpriteMaterial?l(g,p):p.isShadowMaterial?(g.color.value.copy(p.color),g.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(g,p){g.opacity.value=p.opacity,p.color&&g.diffuse.value.copy(p.color),p.emissive&&g.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(g.map.value=p.map,e(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.bumpMap&&(g.bumpMap.value=p.bumpMap,e(p.bumpMap,g.bumpMapTransform),g.bumpScale.value=p.bumpScale,p.side===qe&&(g.bumpScale.value*=-1)),p.normalMap&&(g.normalMap.value=p.normalMap,e(p.normalMap,g.normalMapTransform),g.normalScale.value.copy(p.normalScale),p.side===qe&&g.normalScale.value.negate()),p.displacementMap&&(g.displacementMap.value=p.displacementMap,e(p.displacementMap,g.displacementMapTransform),g.displacementScale.value=p.displacementScale,g.displacementBias.value=p.displacementBias),p.emissiveMap&&(g.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,g.emissiveMapTransform)),p.specularMap&&(g.specularMap.value=p.specularMap,e(p.specularMap,g.specularMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest);let M=t.get(p),S=M.envMap,y=M.envMapRotation;S&&(g.envMap.value=S,g.envMapRotation.value.setFromMatrix4(Ey.makeRotationFromEuler(y)).transpose(),S.isCubeTexture&&S.isRenderTargetTexture===!1&&g.envMapRotation.value.premultiply(tp),g.reflectivity.value=p.reflectivity,g.ior.value=p.ior,g.refractionRatio.value=p.refractionRatio),p.lightMap&&(g.lightMap.value=p.lightMap,g.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,g.lightMapTransform)),p.aoMap&&(g.aoMap.value=p.aoMap,g.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,g.aoMapTransform))}function a(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,p.map&&(g.map.value=p.map,e(p.map,g.mapTransform))}function o(g,p){g.dashSize.value=p.dashSize,g.totalSize.value=p.dashSize+p.gapSize,g.scale.value=p.scale}function c(g,p,M,S){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.size.value=p.size*M,g.scale.value=S*.5,p.map&&(g.map.value=p.map,e(p.map,g.uvTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function l(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.rotation.value=p.rotation,p.map&&(g.map.value=p.map,e(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function h(g,p){g.specular.value.copy(p.specular),g.shininess.value=Math.max(p.shininess,1e-4)}function d(g,p){p.gradientMap&&(g.gradientMap.value=p.gradientMap)}function u(g,p){g.metalness.value=p.metalness,p.metalnessMap&&(g.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,g.metalnessMapTransform)),g.roughness.value=p.roughness,p.roughnessMap&&(g.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,g.roughnessMapTransform)),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)}function f(g,p,M){g.ior.value=p.ior,p.sheen>0&&(g.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),g.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(g.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,g.sheenColorMapTransform)),p.sheenRoughnessMap&&(g.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,g.sheenRoughnessMapTransform))),p.clearcoat>0&&(g.clearcoat.value=p.clearcoat,g.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(g.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,g.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(g.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===qe&&g.clearcoatNormalScale.value.negate())),p.dispersion>0&&(g.dispersion.value=p.dispersion),p.retroreflectivity>0&&(g.retroreflectivity.value=p.retroreflectivity),p.iridescence>0&&(g.iridescence.value=p.iridescence,g.iridescenceIOR.value=p.iridescenceIOR,g.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(g.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,g.iridescenceMapTransform)),p.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),p.transmission>0&&(g.transmission.value=p.transmission,g.transmissionSamplerMap.value=M.texture,g.transmissionSamplerSize.value.set(M.width,M.height),p.transmissionMap&&(g.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,g.transmissionMapTransform)),g.thickness.value=p.thickness,p.thicknessMap&&(g.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=p.attenuationDistance,g.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(g.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(g.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=p.specularIntensity,g.specularColor.value.copy(p.specularColor),p.specularColorMap&&(g.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,g.specularColorMapTransform)),p.specularIntensityMap&&(g.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,g.specularIntensityMapTransform))}function m(g,p){p.matcap&&(g.matcap.value=p.matcap)}function x(g,p){let M=t.get(p).light;g.referencePosition.value.setFromMatrixPosition(M.matrixWorld),g.nearDistance.value=M.shadow.camera.near,g.farDistance.value=M.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function Ay(s,t,e,n){let i={},r={},a=[],o=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function c(y,T){let E=T.program;n.uniformBlockBinding(y,E)}function l(y,T){let E=i[y.id];E===void 0&&(g(y),E=h(y),i[y.id]=E,y.addEventListener("dispose",M));let C=T.program;n.updateUBOMapping(y,C);let v=t.render.frame;r[y.id]!==v&&(u(y),r[y.id]=v)}function h(y){let T=d();y.__bindingPointIndex=T;let E=s.createBuffer(),C=y.__size,v=y.usage;return s.bindBuffer(s.UNIFORM_BUFFER,E),s.bufferData(s.UNIFORM_BUFFER,C,v),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,T,E),E}function d(){for(let y=0;y<o;y++)if(a.indexOf(y)===-1)return a.push(y),y;return Ht("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(y){let T=i[y.id],E=y.uniforms,C=y.__cache;s.bindBuffer(s.UNIFORM_BUFFER,T);for(let v=0,A=E.length;v<A;v++){let I=E[v];if(Array.isArray(I))for(let D=0,B=I.length;D<B;D++)f(I[D],v,D,C);else f(I,v,0,C)}s.bindBuffer(s.UNIFORM_BUFFER,null)}function f(y,T,E,C){if(x(y,T,E,C)===!0){let v=y.__offset,A=y.value;if(Array.isArray(A)){let I=0;for(let D=0;D<A.length;D++){let B=A[D],V=p(B);m(B,y.__data,I),typeof B!="number"&&typeof B!="boolean"&&!B.isMatrix3&&!ArrayBuffer.isView(B)&&(I+=V.storage/Float32Array.BYTES_PER_ELEMENT)}}else m(A,y.__data,0);s.bufferSubData(s.UNIFORM_BUFFER,v,y.__data)}}function m(y,T,E){typeof y=="number"||typeof y=="boolean"?T[0]=y:y.isMatrix3?(T[0]=y.elements[0],T[1]=y.elements[1],T[2]=y.elements[2],T[3]=0,T[4]=y.elements[3],T[5]=y.elements[4],T[6]=y.elements[5],T[7]=0,T[8]=y.elements[6],T[9]=y.elements[7],T[10]=y.elements[8],T[11]=0):ArrayBuffer.isView(y)?T.set(new y.constructor(y.buffer,y.byteOffset,T.length)):y.toArray(T,E)}function x(y,T,E,C){let v=y.value,A=T+"_"+E;if(C[A]===void 0)return typeof v=="number"||typeof v=="boolean"?C[A]=v:ArrayBuffer.isView(v)?C[A]=v.slice():C[A]=v.clone(),!0;{let I=C[A];if(typeof v=="number"||typeof v=="boolean"){if(I!==v)return C[A]=v,!0}else{if(ArrayBuffer.isView(v))return!0;if(I.equals(v)===!1)return I.copy(v),!0}}return!1}function g(y){let T=y.uniforms,E=0,C=16;for(let A=0,I=T.length;A<I;A++){let D=Array.isArray(T[A])?T[A]:[T[A]];for(let B=0,V=D.length;B<V;B++){let P=D[B],L=Array.isArray(P.value)?P.value:[P.value];for(let X=0,k=L.length;X<k;X++){let Z=L[X],z=p(Z),q=E%C,$=q%z.boundary,mt=q+$;E+=$,mt!==0&&C-mt<z.storage&&(E+=C-mt),P.__data=new Float32Array(z.storage/Float32Array.BYTES_PER_ELEMENT),P.__offset=E,E+=z.storage}}}let v=E%C;return v>0&&(E+=C-v),y.__size=E,y.__cache={},this}function p(y){let T={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(T.boundary=4,T.storage=4):y.isVector2?(T.boundary=8,T.storage=8):y.isVector3||y.isColor?(T.boundary=16,T.storage=12):y.isVector4?(T.boundary=16,T.storage=16):y.isMatrix3?(T.boundary=48,T.storage=48):y.isMatrix4?(T.boundary=64,T.storage=64):y.isTexture?Vt("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(y)?(T.boundary=16,T.storage=y.byteLength):Vt("WebGLRenderer: Unsupported uniform value type.",y),T}function M(y){let T=y.target;T.removeEventListener("dispose",M);let E=a.indexOf(T.__bindingPointIndex);a.splice(E,1),s.deleteBuffer(i[T.id]),delete i[T.id],delete r[T.id]}function S(){for(let y in i)s.deleteBuffer(i[y]);a=[],i={},r={}}return{bind:c,update:l,dispose:S}}var Ry=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),ii=null;function Cy(){return ii===null&&(ii=new ta(Ry,16,16,Hi,ze),ii.name="DFG_LUT",ii.minFilter=Ke,ii.magFilter=Ke,ii.wrapS=Zn,ii.wrapT=Zn,ii.generateMipmaps=!1,ii.needsUpdate=!0),ii}var uc=class{constructor(t={}){let{canvas:e=mf(),context:n=null,depth:i=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:u=!1,outputBufferType:f=xn}=t;this.isWebGLRenderer=!0;let m;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=n.getContextAttributes().alpha}else m=a;let x=f,g=new Set([Rl,Al,wl]),p=new Set([xn,Wn,Qs,tr,Sl,Tl]),M=new Uint32Array(4),S=new Int32Array(4),y=new w,T=null,E=null,C=[],v=[],A=null;this.domElement=e,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Gn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let I=this,D=!1,B=null,V=null,P=null,L=null;this._outputColorSpace=Ge;let X=0,k=0,Z=null,z=-1,q=null,$=new Ae,mt=new Ae,ft=null,Gt=new lt(0),Wt=0,jt=e.width,J=e.height,Q=1,dt=null,Bt=null,yt=new Ae(0,0,jt,J),zt=new Ae(0,0,jt,J),ce=!1,et=new qs,rt=!1,at=!1,ot=new oe,ht=new w,Ot=new Ae,It={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Xt=!1;function $t(){return Z===null?Q:1}let N=n;function he(b,U){return e.getContext(b,U)}let ne,R,_,O,W,K,ct,pt,j,nt,gt,Nt,Mt,xt,Ut,kt,Jt,F,_t,tt,vt,wt,st;try{let b={alpha:!0,depth:i,stencil:r,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${"186"}`),e.addEventListener("webglcontextlost",ye,!1),e.addEventListener("webglcontextrestored",ue,!1),e.addEventListener("webglcontextcreationerror",Un,!1),N===null){let U="webgl2";if(N=he(U,b),N===null)throw he(U)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}Ft()}catch(b){throw e.removeEventListener("webglcontextlost",ye,!1),e.removeEventListener("webglcontextrestored",ue,!1),e.removeEventListener("webglcontextcreationerror",Un,!1),Ht("WebGLRenderer: "+b.message),b}function Ft(){ne=new F_(N),ne.init(),vt=new by(N,ne),R=new w_(N,ne,t,vt),_=new yy(N,ne),R.reversedDepthBuffer&&u&&_.buffers.depth.setReversed(!0),V=N.createFramebuffer(),P=N.createFramebuffer(),L=N.createFramebuffer(),O=new z_(N),W=new ay,K=new My(N,ne,_,W,R,vt,O),ct=new U_(I),pt=new V0(N),wt=new T_(N,pt),j=new B_(N,pt,O,wt),nt=new V_(N,j,pt,wt,O),F=new k_(N,R,K),Ut=new A_(W),gt=new ry(I,ct,ne,R,wt,Ut),Nt=new wy(I,W),Mt=new ly,xt=new py(ne),Jt=new S_(I,ct,_,nt,m,c),kt=new vy(I,nt,R),st=new Ay(N,O,R,_),_t=new E_(N,ne,O),tt=new O_(N,ne,O),O.programs=gt.programs,I.capabilities=R,I.extensions=ne,I.properties=W,I.renderLists=Mt,I.shadowMap=kt,I.state=_,I.info=O}x!==xn&&(A=new G_(x,e.width,e.height,o,i,r));let Lt=new gu(I,N);this.xr=Lt,this.getContext=function(){return N},this.getContextAttributes=function(){return N.getContextAttributes()},this.forceContextLoss=function(){let b=ne.get("WEBGL_lose_context");b&&b.loseContext()},this.forceContextRestore=function(){let b=ne.get("WEBGL_lose_context");b&&b.restoreContext()},this.getPixelRatio=function(){return Q},this.setPixelRatio=function(b){b!==void 0&&(Q=b,this.setSize(jt,J,!1))},this.getSize=function(b){return b.set(jt,J)},this.setSize=function(b,U,Y=!0){if(Lt.isPresenting){Vt("WebGLRenderer: Can't change size while VR device is presenting.");return}jt=b,J=U,e.width=Math.floor(b*Q),e.height=Math.floor(U*Q),Y===!0&&(e.style.width=b+"px",e.style.height=U+"px"),A!==null&&A.setSize(e.width,e.height),this.setViewport(0,0,b,U)},this.getDrawingBufferSize=function(b){return b.set(jt*Q,J*Q).floor()},this.setDrawingBufferSize=function(b,U,Y){jt=b,J=U,Q=Y,e.width=Math.floor(b*Y),e.height=Math.floor(U*Y),this.setViewport(0,0,b,U)},this.setEffects=function(b){if(x===xn){Ht("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(b){for(let U=0;U<b.length;U++)if(b[U].isOutputPass===!0){Vt("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}A.setEffects(b||[])},this.getCurrentViewport=function(b){return b.copy($)},this.getViewport=function(b){return b.copy(yt)},this.setViewport=function(b,U,Y,H){b.isVector4?yt.set(b.x,b.y,b.z,b.w):yt.set(b,U,Y,H),_.viewport($.copy(yt).multiplyScalar(Q).round())},this.getScissor=function(b){return b.copy(zt)},this.setScissor=function(b,U,Y,H){b.isVector4?zt.set(b.x,b.y,b.z,b.w):zt.set(b,U,Y,H),_.scissor(mt.copy(zt).multiplyScalar(Q).round())},this.getScissorTest=function(){return ce},this.setScissorTest=function(b){_.setScissorTest(ce=b)},this.setOpaqueSort=function(b){dt=b},this.setTransparentSort=function(b){Bt=b},this.getClearColor=function(b){return b.copy(Jt.getClearColor())},this.setClearColor=function(){Jt.setClearColor(...arguments)},this.getClearAlpha=function(){return Jt.getClearAlpha()},this.setClearAlpha=function(){Jt.setClearAlpha(...arguments)},this.clear=function(b=!0,U=!0,Y=!0){let H=0;if(b){let G=!1;if(Z!==null){let Et=Z.texture.format;G=g.has(Et)}if(G){let Et=Z.texture.type,Rt=p.has(Et),St=Jt.getClearColor(),Ct=Jt.getClearAlpha(),Dt=St.r,Zt=St.g,ie=St.b;Rt?(M[0]=Dt,M[1]=Zt,M[2]=ie,M[3]=Ct,N.clearBufferuiv(N.COLOR,0,M)):(S[0]=Dt,S[1]=Zt,S[2]=ie,S[3]=Ct,N.clearBufferiv(N.COLOR,0,S))}else H|=N.COLOR_BUFFER_BIT}U&&(H|=N.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),Y&&(H|=N.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),H!==0&&N.clear(H)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(b){b.setRenderer(this),B=b},this.dispose=function(){e.removeEventListener("webglcontextlost",ye,!1),e.removeEventListener("webglcontextrestored",ue,!1),e.removeEventListener("webglcontextcreationerror",Un,!1),Jt.dispose(),Mt.dispose(),xt.dispose(),W.dispose(),ct.dispose(),nt.dispose(),wt.dispose(),st.dispose(),gt.dispose(),Lt.dispose(),Lt.removeEventListener("sessionstart",qu),Lt.removeEventListener("sessionend",Yu),$i.stop()};function ye(b){b.preventDefault(),Xr("WebGLRenderer: Context Lost."),D=!0}function ue(){Xr("WebGLRenderer: Context Restored."),D=!1;let b=O.autoReset,U=kt.enabled,Y=kt.autoUpdate,H=kt.needsUpdate,G=kt.type;Ft(),O.autoReset=b,kt.enabled=U,kt.autoUpdate=Y,kt.needsUpdate=H,kt.type=G}function Un(b){Ht("WebGLRenderer: A WebGL context could not be created. Reason: ",b.statusMessage)}function Yn(b){let U=b.target;U.removeEventListener("dispose",Yn),lm(U)}function lm(b){cm(b),W.remove(b)}function cm(b){let U=W.get(b).programs;U!==void 0&&(U.forEach(function(Y){gt.releaseProgram(Y)}),b.isShaderMaterial&&gt.releaseShaderCache(b))}this.renderBufferDirect=function(b,U,Y,H,G,Et){U===null&&(U=It);let Rt=G.isMesh&&G.matrixWorld.determinantAffine()<0,St=dm(b,U,Y,H,G);_.setMaterial(H,Rt);let Ct=Y.index,Dt=1;if(H.wireframe===!0){if(Ct=j.getWireframeAttribute(Y),Ct===void 0)return;Dt=2}let Zt=Y.drawRange,ie=Y.attributes.position,Pt=Zt.start*Dt,de=(Zt.start+Zt.count)*Dt;Et!==null&&(Pt=Math.max(Pt,Et.start*Dt),de=Math.min(de,(Et.start+Et.count)*Dt)),Ct!==null?(Pt=Math.max(Pt,0),de=Math.min(de,Ct.count)):ie!=null&&(Pt=Math.max(Pt,0),de=Math.min(de,ie.count));let Fe=de-Pt;if(Fe<0||Fe===1/0)return;wt.setup(G,H,St,Y,Ct);let Te,ve=_t;if(Ct!==null&&(Te=pt.get(Ct),ve=tt,ve.setIndex(Te)),G.isMesh)H.wireframe===!0?(_.setLineWidth(H.wireframeLinewidth*$t()),ve.setMode(N.LINES)):ve.setMode(N.TRIANGLES);else if(G.isLine){let tn=H.linewidth;tn===void 0&&(tn=1),_.setLineWidth(tn*$t()),G.isLineSegments?ve.setMode(N.LINES):G.isLineLoop?ve.setMode(N.LINE_LOOP):ve.setMode(N.LINE_STRIP)}else G.isPoints?ve.setMode(N.POINTS):G.isSprite&&ve.setMode(N.TRIANGLES);if(G.isBatchedMesh)if(ne.get("WEBGL_multi_draw"))ve.renderMultiDraw(G._multiDrawStarts,G._multiDrawCounts,G._multiDrawCount);else{let tn=G._multiDrawStarts,At=G._multiDrawCounts,cn=G._multiDrawCount,ae=Ct?pt.get(Ct).bytesPerElement:1,An=W.get(H).currentProgram.getUniforms();for(let $n=0;$n<cn;$n++)An.setValue(N,"_gl_DrawID",$n),ve.render(tn[$n]/ae,At[$n])}else if(G.isInstancedMesh)ve.renderInstances(Pt,Fe,G.count);else if(Y.isInstancedBufferGeometry){let tn=Y._maxInstanceCount!==void 0?Y._maxInstanceCount:1/0,At=Math.min(Y.instanceCount,tn);ve.renderInstances(Pt,Fe,At)}else ve.render(Pt,Fe)};function Xu(b,U,Y,H){B!==null&&b.isNodeMaterial&&B.setObject(H,b),rt===!0&&Ut.setState(b,Y,!1),b.transparent===!0&&b.side===Oe&&b.forceSinglePass===!1?(b.side=qe,b.needsUpdate=!0,ro(b,U,H),b.side=Bi,b.needsUpdate=!0,ro(b,U,H),b.side=Oe):ro(b,U,H)}this.compile=function(b,U,Y=null){Y===null&&(Y=b),B!==null&&B.renderStart(b,U,Y),E=xt.get(Y),E.init(U),v.push(E),Y.traverseVisible(function(G){G.isLight&&G.layers.test(U.layers)&&(E.pushLight(G),G.castShadow&&E.pushShadow(G))}),b!==Y&&b.traverseVisible(function(G){G.isLight&&G.layers.test(U.layers)&&(E.pushLight(G),G.castShadow&&E.pushShadow(G))}),E.setupLights(),B!==null&&B.updateLights(E.state.lightsArray),at=this.localClippingEnabled,rt=Ut.init(this.clippingPlanes,at),rt===!0&&Ut.setGlobalState(this.clippingPlanes,U),B!==null&&kt.render(E.state.shadowsArray,Y,U);let H=new Set;return b.traverse(function(G){if(!(G.isMesh||G.isPoints||G.isLine||G.isSprite))return;let Et=G.material;if(Et)if(Array.isArray(Et))for(let Rt=0;Rt<Et.length;Rt++){let St=Et[Rt];Xu(St,Y,U,G),H.add(St)}else Xu(Et,Y,U,G),H.add(Et)}),E=v.pop(),B!==null&&B.renderEnd(),H},this.compileAsync=function(b,U,Y=null){let H=this.compile(b,U,Y);return new Promise(G=>{function Et(){if(H.forEach(function(Rt){let Ct=W.get(Rt).currentProgram;(Ct===void 0||Ct.isReady())&&H.delete(Rt)}),H.size===0){G(b);return}setTimeout(Et,10)}ne.get("KHR_parallel_shader_compile")!==null?Et():setTimeout(Et,10)})};let Xc=null;function hm(b){Xc&&Xc(b)}function qu(){$i.stop()}function Yu(){$i.start()}let $i=new $f;$i.setAnimationLoop(hm),typeof self<"u"&&$i.setContext(self),this.setAnimationLoop=function(b){Xc=b,Lt.setAnimationLoop(b),b===null?$i.stop():$i.start()},Lt.addEventListener("sessionstart",qu),Lt.addEventListener("sessionend",Yu),this.render=function(b,U){if(U!==void 0&&U.isCamera!==!0){Ht("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(D===!0)return;B!==null&&B.renderStart(b,U);let Y=Lt.enabled===!0&&Lt.isPresenting===!0,H=A!==null&&(Z===null||Y)&&A.begin(I,Z);if(b.matrixWorldAutoUpdate===!0&&b.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),Lt.enabled===!0&&Lt.isPresenting===!0&&(A===null||A.isCompositing()===!1)&&(Lt.cameraAutoUpdate===!0&&Lt.updateCamera(U),U=Lt.getCamera()),b.isScene===!0&&b.onBeforeRender(I,b,U,Z),E=xt.get(b,v.length),E.init(U),E.state.textureUnits=K.getTextureUnits(),v.push(E),ot.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),et.setFromProjectionMatrix(ot,Vn,U.reversedDepth),at=this.localClippingEnabled,rt=Ut.init(this.clippingPlanes,at),T=Mt.get(b,C.length),T.init(),C.push(T),Lt.enabled===!0&&Lt.isPresenting===!0){let Rt=I.xr.getDepthSensingMesh();Rt!==null&&qc(Rt,U,-1/0,I.sortObjects)}qc(b,U,0,I.sortObjects),T.finish(),B!==null&&B.updateLights(E.state.lightsArray),I.sortObjects===!0&&T.sort(dt,Bt),Xt=Lt.enabled===!1||Lt.isPresenting===!1||Lt.hasDepthSensing()===!1,Xt&&Jt.addToRenderList(T,b),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),rt===!0&&Ut.beginShadows();let G=E.state.shadowsArray;if(kt.render(G,b,U),rt===!0&&Ut.endShadows(),(H&&A.hasRenderPass())===!1){let Rt=T.opaque,St=T.transmissive;if(E.setupLights(),U.isArrayCamera){let Ct=U.cameras;if(St.length>0)for(let Dt=0,Zt=Ct.length;Dt<Zt;Dt++){let ie=Ct[Dt];Ju(Rt,St,b,ie)}Xt&&Jt.render(b);for(let Dt=0,Zt=Ct.length;Dt<Zt;Dt++){let ie=Ct[Dt];$u(T,b,ie,ie.viewport)}}else St.length>0&&Ju(Rt,St,b,U),Xt&&Jt.render(b),$u(T,b,U)}Z!==null&&k===0&&(K.updateMultisampleRenderTarget(Z),K.updateRenderTargetMipmap(Z)),H&&A.end(I),b.isScene===!0&&b.onAfterRender(I,b,U),wt.resetDefaultState(),z=-1,q=null,v.pop(),v.length>0?(E=v[v.length-1],K.setTextureUnits(E.state.textureUnits),rt===!0&&Ut.setGlobalState(I.clippingPlanes,E.state.camera)):E=null,C.pop(),C.length>0?T=C[C.length-1]:T=null,B!==null&&B.renderEnd()};function qc(b,U,Y,H){if(b.visible===!1)return;if(b.layers.test(U.layers)){if(b.isGroup)Y=b.renderOrder;else if(b.isLOD)b.autoUpdate===!0&&b.update(U);else if(b.isLightProbeGrid)E.pushLightProbeGrid(b);else if(b.isLight)E.pushLight(b),b.castShadow&&E.pushShadow(b);else if(b.isSprite){if(!b.frustumCulled||b.intersectsFrustum(et)){H&&Ot.setFromMatrixPosition(b.matrixWorld).applyMatrix4(ot);let Rt=nt.update(b),St=b.material;St.visible&&T.push(b,Rt,St,Y,Ot.z,null,U)}}else if((b.isMesh||b.isLine||b.isPoints)&&(!b.frustumCulled||b.intersectsFrustum(et))){let Rt=nt.update(b),St=b.material;if(H&&(b.boundingSphere!==void 0?(b.boundingSphere===null&&b.computeBoundingSphere(),Ot.copy(b.boundingSphere.center)):(Rt.boundingSphere===null&&Rt.computeBoundingSphere(),Ot.copy(Rt.boundingSphere.center)),Ot.applyMatrix4(b.matrixWorld).applyMatrix4(ot)),Array.isArray(St)){let Ct=Rt.groups;for(let Dt=0,Zt=Ct.length;Dt<Zt;Dt++){let ie=Ct[Dt],Pt=St[ie.materialIndex];Pt&&Pt.visible&&T.push(b,Rt,Pt,Y,Ot.z,ie,U)}}else St.visible&&T.push(b,Rt,St,Y,Ot.z,null,U)}}let Et=b.children;for(let Rt=0,St=Et.length;Rt<St;Rt++)qc(Et[Rt],U,Y,H)}function $u(b,U,Y,H){let{opaque:G,transmissive:Et,transparent:Rt}=b;E.setupLightsView(Y),rt===!0&&Ut.setGlobalState(I.clippingPlanes,Y),H&&_.viewport($.copy(H)),G.length>0&&so(G,U,Y),Et.length>0&&so(Et,U,Y),Rt.length>0&&so(Rt,U,Y),_.buffers.depth.setTest(!0),_.buffers.depth.setMask(!0),_.buffers.color.setMask(!0),_.setPolygonOffset(!1)}function Ju(b,U,Y,H){if((Y.isScene===!0?Y.overrideMaterial:null)!==null)return;if(E.state.transmissionRenderTarget[H.id]===void 0){let Pt=ne.has("EXT_color_buffer_half_float")||ne.has("EXT_color_buffer_float");E.state.transmissionRenderTarget[H.id]=new Le(1,1,{generateMipmaps:!0,type:Pt?ze:xn,minFilter:ki,samples:Math.max(4,R.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:te.workingColorSpace})}let Et=E.state.transmissionRenderTarget[H.id],Rt=H.viewport||$;Et.setSize(Rt.z*I.transmissionResolutionScale,Rt.w*I.transmissionResolutionScale);let St=I.getRenderTarget(),Ct=I.getActiveCubeFace(),Dt=I.getActiveMipmapLevel();I.setRenderTarget(Et),I.getClearColor(Gt),Wt=I.getClearAlpha(),Wt<1&&I.setClearColor(16777215,.5),I.clear(),Xt&&Jt.render(Y);let Zt=I.toneMapping;I.toneMapping=Gn;let ie=H.viewport;if(H.viewport!==void 0&&(H.viewport=void 0),E.setupLightsView(H),rt===!0&&Ut.setGlobalState(I.clippingPlanes,H),so(b,Y,H),K.updateMultisampleRenderTarget(Et),K.updateRenderTargetMipmap(Et),ne.has("WEBGL_multisampled_render_to_texture")===!1){let Pt=!1;for(let de=0,Fe=U.length;de<Fe;de++){let Te=U[de],{object:ve,geometry:tn,material:At,group:cn}=Te;if(At.side===Oe&&ve.layers.test(H.layers)){let ae=At.side;At.side=qe,At.needsUpdate=!0,Zu(ve,Y,H,tn,At,cn),At.side=ae,At.needsUpdate=!0,Pt=!0}}Pt===!0&&(K.updateMultisampleRenderTarget(Et),K.updateRenderTargetMipmap(Et))}I.setRenderTarget(St,Ct,Dt),I.setClearColor(Gt,Wt),ie!==void 0&&(H.viewport=ie),I.toneMapping=Zt}function so(b,U,Y){let H=U.isScene===!0?U.overrideMaterial:null;for(let G=0,Et=b.length;G<Et;G++){let Rt=b[G],{object:St,geometry:Ct,group:Dt}=Rt,Zt=Rt.material;Zt.allowOverride===!0&&H!==null&&(Zt=H),St.layers.test(Y.layers)&&Zu(St,U,Y,Ct,Zt,Dt)}}function Zu(b,U,Y,H,G,Et){B!==null&&G.isNodeMaterial&&B.setObject(b,G),b.onBeforeRender(I,U,Y,H,G,Et),b.modelViewMatrix.multiplyMatrices(Y.matrixWorldInverse,b.matrixWorld),b.normalMatrix.getNormalMatrix(b.modelViewMatrix),G.onBeforeRender(I,U,Y,H,b,Et),G.transparent===!0&&G.side===Oe&&G.forceSinglePass===!1?(G.side=qe,G.needsUpdate=!0,I.renderBufferDirect(Y,U,H,G,b,Et),G.side=Bi,G.needsUpdate=!0,I.renderBufferDirect(Y,U,H,G,b,Et),G.side=Oe):I.renderBufferDirect(Y,U,H,G,b,Et),b.onAfterRender(I,U,Y,H,G,Et)}function ro(b,U,Y){U.isScene!==!0&&(U=It);let H=W.get(b),G=E.state.lights,Et=E.state.shadowsArray,Rt=G.state.version,St=gt.getParameters(b,G.state,Et,U,Y,E.state.lightProbeGridArray),Ct=gt.getProgramCacheKey(St),Dt=H.programs;H.environment=b.isMeshStandardMaterial||b.isMeshLambertMaterial||b.isMeshPhongMaterial?U.environment:null,H.fog=U.fog;let Zt=b.isMeshStandardMaterial||b.isMeshLambertMaterial&&!b.envMap||b.isMeshPhongMaterial&&!b.envMap;H.envMap=ct.get(b.envMap||H.environment,Zt),H.envMapRotation=H.environment!==null&&b.envMap===null?U.environmentRotation:b.envMapRotation,Dt===void 0&&(b.addEventListener("dispose",Yn),Dt=new Map,H.programs=Dt);let ie=Dt.get(Ct);if(ie!==void 0){if(H.currentProgram===ie&&H.lightsStateVersion===Rt)return ju(b,St),ie}else St.uniforms=gt.getUniforms(b),B!==null&&b.isNodeMaterial&&B.build(b,Y,St),b.onBeforeCompile(St,I),ie=gt.acquireProgram(St,Ct),Dt.set(Ct,ie),H.uniforms=St.uniforms;let Pt=H.uniforms;return(!b.isShaderMaterial&&!b.isRawShaderMaterial||b.clipping===!0)&&(Pt.clippingPlanes=Ut.uniform),ju(b,St),H.needsLights=pm(b),H.lightsStateVersion=Rt,H.needsLights&&(Pt.ambientLightColor.value=G.state.ambient,Pt.lightProbe.value=G.state.probe,Pt.sunLights.value=G.state.sun,Pt.sunLightShadows.value=G.state.sunShadow,Pt.directionalLights.value=G.state.directional,Pt.directionalLightShadows.value=G.state.directionalShadow,Pt.spotLights.value=G.state.spot,Pt.spotLightShadows.value=G.state.spotShadow,Pt.rectAreaLights.value=G.state.rectArea,Pt.ltc_1.value=G.state.rectAreaLTC1,Pt.ltc_2.value=G.state.rectAreaLTC2,Pt.pointLights.value=G.state.point,Pt.pointLightShadows.value=G.state.pointShadow,Pt.hemisphereLights.value=G.state.hemi,Pt.sunShadowMatrix.value=G.state.sunShadowMatrix,Pt.sunShadowCascade.value=G.state.sunShadowCascade,Pt.directionalShadowMatrix.value=G.state.directionalShadowMatrix,Pt.spotLightMatrix.value=G.state.spotLightMatrix,Pt.spotLightMap.value=G.state.spotLightMap,Pt.pointShadowMatrix.value=G.state.pointShadowMatrix),H.lightProbeGrid=E.state.lightProbeGridArray.length>0,H.currentProgram=ie,H.uniformsList=null,ie}function Ku(b){if(b.uniformsList===null){let U=b.currentProgram.getUniforms();b.uniformsList=sr.seqWithValue(U.seq,b.uniforms)}return b.uniformsList}function ju(b,U){let Y=W.get(b);Y.outputColorSpace=U.outputColorSpace,Y.batching=U.batching,Y.batchingColor=U.batchingColor,Y.instancing=U.instancing,Y.instancingColor=U.instancingColor,Y.instancingMorph=U.instancingMorph,Y.skinning=U.skinning,Y.morphTargets=U.morphTargets,Y.morphNormals=U.morphNormals,Y.morphColors=U.morphColors,Y.morphTargetsCount=U.morphTargetsCount,Y.numClippingPlanes=U.numClippingPlanes,Y.numIntersection=U.numClipIntersection,Y.vertexAlphas=U.vertexAlphas,Y.vertexTangents=U.vertexTangents,Y.toneMapping=U.toneMapping}function um(b,U){if(b.length===0)return null;if(b.length===1)return b[0].texture!==null?b[0]:null;y.setFromMatrixPosition(U.matrixWorld);for(let Y=0,H=b.length;Y<H;Y++){let G=b[Y];if(G.texture!==null&&G.boundingBox.containsPoint(y))return G}return null}function dm(b,U,Y,H,G){U.isScene!==!0&&(U=It),K.resetTextureUnits();let Et=U.fog,Rt=H.isMeshStandardMaterial||H.isMeshLambertMaterial||H.isMeshPhongMaterial?U.environment:null,St=Z===null?I.outputColorSpace:Z.isXRRenderTarget===!0?Z.texture.colorSpace:te.workingColorSpace,Ct=H.isMeshStandardMaterial||H.isMeshLambertMaterial&&!H.envMap||H.isMeshPhongMaterial&&!H.envMap,Dt=ct.get(H.envMap||Rt,Ct),Zt=H.vertexColors===!0&&!!Y.attributes.color&&Y.attributes.color.itemSize===4,ie=!!Y.attributes.tangent&&(!!H.normalMap||H.anisotropy>0),Pt=!!Y.morphAttributes.position,de=!!Y.morphAttributes.normal,Fe=!!Y.morphAttributes.color,Te=Gn;H.toneMapped&&(Z===null||Z.isXRRenderTarget===!0)&&(Te=I.toneMapping);let ve=Y.morphAttributes.position||Y.morphAttributes.normal||Y.morphAttributes.color,tn=ve!==void 0?ve.length:0,At=W.get(H),cn=E.state.lights;if(rt===!0&&(at===!0||b!==q)){let Me=b===q&&H.id===z;Ut.setState(H,b,Me)}let ae=!1;H.version===At.__version?(At.needsLights&&At.lightsStateVersion!==cn.state.version||At.outputColorSpace!==St||G.isBatchedMesh&&At.batching===!1||!G.isBatchedMesh&&At.batching===!0||G.isBatchedMesh&&At.batchingColor===!0&&G._colorsTexture===null||G.isBatchedMesh&&At.batchingColor===!1&&G._colorsTexture!==null||G.isInstancedMesh&&At.instancing===!1||!G.isInstancedMesh&&At.instancing===!0||G.isSkinnedMesh&&At.skinning===!1||!G.isSkinnedMesh&&At.skinning===!0||G.isInstancedMesh&&At.instancingColor===!0&&G.instanceColor===null||G.isInstancedMesh&&At.instancingColor===!1&&G.instanceColor!==null||G.isInstancedMesh&&At.instancingMorph===!0&&G.morphTexture===null||G.isInstancedMesh&&At.instancingMorph===!1&&G.morphTexture!==null||At.envMap!==Dt||H.fog===!0&&At.fog!==Et||At.numClippingPlanes!==void 0&&(At.numClippingPlanes!==Ut.numPlanes||At.numIntersection!==Ut.numIntersection)||At.vertexAlphas!==Zt||At.vertexTangents!==ie||At.morphTargets!==Pt||At.morphNormals!==de||At.morphColors!==Fe||At.toneMapping!==Te||At.morphTargetsCount!==tn||!!At.lightProbeGrid!=E.state.lightProbeGridArray.length>0)&&(ae=!0):(ae=!0,At.__version=H.version);let An=At.currentProgram;ae===!0&&(An=ro(H,U,G),B&&H.isNodeMaterial&&B.onUpdateProgram(H,An,At));let $n=!1,Si=!1,_s=!1,xe=An.getUniforms(),De=At.uniforms;if(_.useProgram(An.program)&&($n=!0,Si=!0,_s=!0),H.id!==z&&(z=H.id,Si=!0),At.needsLights){let Me=um(E.state.lightProbeGridArray,G);At.lightProbeGrid!==Me&&(At.lightProbeGrid=Me,Si=!0)}if($n||q!==b){_.buffers.depth.getReversed()&&b.reversedDepth!==!0&&(b._reversedDepth=!0,b.updateProjectionMatrix()),xe.setValue(N,"projectionMatrix",b.projectionMatrix),xe.setValue(N,"viewMatrix",b.matrixWorldInverse);let Ei=xe.map.cameraPosition;Ei!==void 0&&Ei.setValue(N,ht.setFromMatrixPosition(b.matrixWorld)),R.logarithmicDepthBuffer&&xe.setValue(N,"logDepthBufFC",2/(Math.log(b.far+1)/Math.LN2)),(H.isMeshPhongMaterial||H.isMeshToonMaterial||H.isMeshLambertMaterial||H.isMeshBasicMaterial||H.isMeshStandardMaterial||H.isShaderMaterial)&&xe.setValue(N,"isOrthographic",b.isOrthographicCamera===!0),q!==b&&(q=b,Si=!0,_s=!0)}if(At.needsLights&&(cn.state.sunShadowMap.length>0&&xe.setValue(N,"sunShadowMap",cn.state.sunShadowMap,K),cn.state.directionalShadowMap.length>0&&xe.setValue(N,"directionalShadowMap",cn.state.directionalShadowMap,K),cn.state.spotShadowMap.length>0&&xe.setValue(N,"spotShadowMap",cn.state.spotShadowMap,K),cn.state.pointShadowMap.length>0&&xe.setValue(N,"pointShadowMap",cn.state.pointShadowMap,K)),G.isSkinnedMesh){xe.setOptional(N,G,"bindMatrix"),xe.setOptional(N,G,"bindMatrixInverse");let Me=G.skeleton;Me&&(Me.boneTexture===null&&Me.computeBoneTexture(),xe.setValue(N,"boneTexture",Me.boneTexture,K))}G.isBatchedMesh&&(xe.setOptional(N,G,"batchingTexture"),xe.setValue(N,"batchingTexture",G._matricesTexture,K),xe.setOptional(N,G,"batchingIdTexture"),xe.setValue(N,"batchingIdTexture",G._indirectTexture,K),xe.setOptional(N,G,"batchingColorTexture"),G._colorsTexture!==null&&xe.setValue(N,"batchingColorTexture",G._colorsTexture,K));let Ti=Y.morphAttributes;if((Ti.position!==void 0||Ti.normal!==void 0||Ti.color!==void 0)&&F.update(G,Y,An),(Si||At.receiveShadow!==G.receiveShadow)&&(At.receiveShadow=G.receiveShadow,xe.setValue(N,"receiveShadow",G.receiveShadow)),(H.isMeshStandardMaterial||H.isMeshLambertMaterial||H.isMeshPhongMaterial)&&H.envMap===null&&U.environment!==null&&(De.envMapIntensity.value=U.environmentIntensity),De.dfgLUT!==void 0&&(De.dfgLUT.value=Cy()),Si){if(xe.setValue(N,"toneMappingExposure",I.toneMappingExposure),At.needsLights&&fm(De,_s),Et&&H.fog===!0&&Nt.refreshFogUniforms(De,Et),Nt.refreshMaterialUniforms(De,H,Q,J,E.state.transmissionRenderTarget[b.id]),At.needsLights&&At.lightProbeGrid){let Me=At.lightProbeGrid;De.probesSH.value=Me.texture,De.probesMin.value.copy(Me.boundingBox.min),De.probesMax.value.copy(Me.boundingBox.max),De.probesResolution.value.copy(Me.resolution)}sr.upload(N,Ku(At),De,K)}if(H.isShaderMaterial&&H.uniformsNeedUpdate===!0&&(sr.upload(N,Ku(At),De,K),H.uniformsNeedUpdate=!1),H.isSpriteMaterial&&xe.setValue(N,"center",G.center),xe.setValue(N,"modelViewMatrix",G.modelViewMatrix),xe.setValue(N,"normalMatrix",G.normalMatrix),xe.setValue(N,"modelMatrix",G.matrixWorld),H.uniformsGroups!==void 0){let Me=H.uniformsGroups;for(let Ei=0,vs=Me.length;Ei<vs;Ei++){let td=Me[Ei];st.update(td,An),st.bind(td,An)}}return An}function fm(b,U){b.ambientLightColor.needsUpdate=U,b.lightProbe.needsUpdate=U,b.sunLights.needsUpdate=U,b.sunLightShadows.needsUpdate=U,b.directionalLights.needsUpdate=U,b.directionalLightShadows.needsUpdate=U,b.pointLights.needsUpdate=U,b.pointLightShadows.needsUpdate=U,b.spotLights.needsUpdate=U,b.spotLightShadows.needsUpdate=U,b.rectAreaLights.needsUpdate=U,b.hemisphereLights.needsUpdate=U}function pm(b){return b.isMeshLambertMaterial||b.isMeshToonMaterial||b.isMeshPhongMaterial||b.isMeshStandardMaterial||b.isShadowMaterial||b.isShaderMaterial&&b.lights===!0}this.getActiveCubeFace=function(){return X},this.getActiveMipmapLevel=function(){return k},this.getRenderTarget=function(){return Z},this.setRenderTargetTextures=function(b,U,Y){let H=W.get(b);H.__autoAllocateDepthBuffer=b.resolveDepthBuffer===!1,H.__autoAllocateDepthBuffer===!1&&(H.__useRenderToTexture=!1),W.get(b.texture).__webglTexture=U,W.get(b.depthTexture).__webglTexture=H.__autoAllocateDepthBuffer?void 0:Y,H.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(b,U){let Y=W.get(b);Y.__webglFramebuffer=U,Y.__useDefaultFramebuffer=U===void 0},this.setRenderTarget=function(b,U=0,Y=0){Z=b,X=U,k=Y;let H=null,G=!1,Et=!1;if(b){let St=W.get(b);if(St.__useDefaultFramebuffer!==void 0){_.bindFramebuffer(N.FRAMEBUFFER,St.__webglFramebuffer),$.copy(b.viewport),mt.copy(b.scissor),ft=b.scissorTest,_.viewport($),_.scissor(mt),_.setScissorTest(ft),z=-1;return}else if(St.__webglFramebuffer===void 0)K.setupRenderTarget(b);else if(St.__hasExternalTextures)K.rebindTextures(b,W.get(b.texture).__webglTexture,W.get(b.depthTexture).__webglTexture);else if(b.depthBuffer){let Zt=b.depthTexture;if(St.__boundDepthTexture!==Zt){if(Zt!==null&&W.has(Zt)&&(b.width!==Zt.image.width||b.height!==Zt.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");K.setupDepthRenderbuffer(b)}}let Ct=b.texture;(Ct.isData3DTexture||Ct.isDataArrayTexture||Ct.isCompressedArrayTexture)&&(Et=!0);let Dt=W.get(b).__webglFramebuffer;b.isWebGLCubeRenderTarget?(Array.isArray(Dt[U])?H=Dt[U][Y]:H=Dt[U],G=!0):b.samples>0&&K.useMultisampledRTT(b)===!1?H=W.get(b).__webglMultisampledFramebuffer:Array.isArray(Dt)?H=Dt[Y]:H=Dt,$.copy(b.viewport),mt.copy(b.scissor),ft=b.scissorTest}else $.copy(yt).multiplyScalar(Q).floor(),mt.copy(zt).multiplyScalar(Q).floor(),ft=ce;if(Y!==0&&(H=V),_.bindFramebuffer(N.FRAMEBUFFER,H)&&_.drawBuffers(b,H),_.viewport($),_.scissor(mt),_.setScissorTest(ft),G){let St=W.get(b.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_CUBE_MAP_POSITIVE_X+U,St.__webglTexture,Y)}else if(Et){let St=U;for(let Ct=0;Ct<b.textures.length;Ct++){let Dt=W.get(b.textures[Ct]);N.framebufferTextureLayer(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0+Ct,Dt.__webglTexture,Y,St)}}else if(b!==null&&Y!==0){let St=W.get(b.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,St.__webglTexture,Y)}z=-1};function Qu(b){let U=W.get(b);return(U.__readFormat!==b.format||U.__readType!==b.type)&&(U.__readFormat=b.format,U.__readType=b.type,U.__formatReadable=R.textureFormatReadable(b.format),U.__typeReadable=R.textureTypeReadable(b.type)),U}this.readRenderTargetPixels=function(b,U,Y,H,G,Et,Rt,St=0){if(!(b&&b.isWebGLRenderTarget)){Ht("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ct=W.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&Rt!==void 0&&(Ct=Ct[Rt]),Ct){_.bindFramebuffer(N.FRAMEBUFFER,Ct);try{let Dt=b.textures[St],Zt=Dt.format,ie=Dt.type;b.textures.length>1&&N.readBuffer(N.COLOR_ATTACHMENT0+St);let Pt=Qu(Dt);if(Pt.__formatReadable===!1){Ht("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Pt.__typeReadable===!1){Ht("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=b.width-H&&Y>=0&&Y<=b.height-G&&N.readPixels(U,Y,H,G,vt.convert(Zt),vt.convert(ie),Et)}finally{let Dt=Z!==null?W.get(Z).__webglFramebuffer:null;_.bindFramebuffer(N.FRAMEBUFFER,Dt)}}},this.readRenderTargetPixelsAsync=async function(b,U,Y,H,G,Et,Rt,St=0){if(!(b&&b.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ct=W.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&Rt!==void 0&&(Ct=Ct[Rt]),Ct)if(U>=0&&U<=b.width-H&&Y>=0&&Y<=b.height-G){_.bindFramebuffer(N.FRAMEBUFFER,Ct);let Dt=b.textures[St],Zt=Dt.format,ie=Dt.type;b.textures.length>1&&N.readBuffer(N.COLOR_ATTACHMENT0+St);let Pt=Qu(Dt);if(Pt.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Pt.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let de=N.createBuffer();N.bindBuffer(N.PIXEL_PACK_BUFFER,de),N.bufferData(N.PIXEL_PACK_BUFFER,Et.byteLength,N.STREAM_READ),N.readPixels(U,Y,H,G,vt.convert(Zt),vt.convert(ie),0),N.bindBuffer(N.PIXEL_PACK_BUFFER,null);let Fe=Z!==null?W.get(Z).__webglFramebuffer:null;_.bindFramebuffer(N.FRAMEBUFFER,Fe);let Te=N.fenceSync(N.SYNC_GPU_COMMANDS_COMPLETE,0);return N.flush(),await xf(N,Te,4),N.bindBuffer(N.PIXEL_PACK_BUFFER,de),N.getBufferSubData(N.PIXEL_PACK_BUFFER,0,Et),N.bindBuffer(N.PIXEL_PACK_BUFFER,null),N.deleteBuffer(de),N.deleteSync(Te),Et}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(b,U=null,Y=0){let H=Math.pow(2,-Y),G=Math.floor(b.image.width*H),Et=Math.floor(b.image.height*H),Rt=U!==null?U.x:0,St=U!==null?U.y:0;K.setTexture2D(b,0),N.copyTexSubImage2D(N.TEXTURE_2D,Y,0,0,Rt,St,G,Et),_.unbindTexture()},this.copyTextureToTexture=function(b,U,Y=null,H=null,G=0,Et=0){let Rt,St,Ct,Dt,Zt,ie,Pt,de,Fe,Te=b.isCompressedTexture?b.mipmaps[Et]:b.image;if(Y!==null)Rt=Y.max.x-Y.min.x,St=Y.max.y-Y.min.y,Ct=Y.isBox3?Y.max.z-Y.min.z:1,Dt=Y.min.x,Zt=Y.min.y,ie=Y.isBox3?Y.min.z:0;else{let De=Math.pow(2,-G);Rt=Math.floor(Te.width*De),St=Math.floor(Te.height*De),b.isDataArrayTexture?Ct=Te.depth:b.isData3DTexture?Ct=Math.floor(Te.depth*De):Ct=1,Dt=0,Zt=0,ie=0}H!==null?(Pt=H.x,de=H.y,Fe=H.z):(Pt=0,de=0,Fe=0);let ve=vt.convert(U.format),tn=vt.convert(U.type),At;U.isData3DTexture?(K.setTexture3D(U,0),At=N.TEXTURE_3D):U.isDataArrayTexture||U.isCompressedArrayTexture?(K.setTexture2DArray(U,0),At=N.TEXTURE_2D_ARRAY):(K.setTexture2D(U,0),At=N.TEXTURE_2D),_.activeTexture(N.TEXTURE0),_.pixelStorei(N.UNPACK_FLIP_Y_WEBGL,U.flipY),_.pixelStorei(N.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),_.pixelStorei(N.UNPACK_ALIGNMENT,U.unpackAlignment);let cn=_.getParameter(N.UNPACK_ROW_LENGTH),ae=_.getParameter(N.UNPACK_IMAGE_HEIGHT),An=_.getParameter(N.UNPACK_SKIP_PIXELS),$n=_.getParameter(N.UNPACK_SKIP_ROWS),Si=_.getParameter(N.UNPACK_SKIP_IMAGES);_.pixelStorei(N.UNPACK_ROW_LENGTH,Te.width),_.pixelStorei(N.UNPACK_IMAGE_HEIGHT,Te.height),_.pixelStorei(N.UNPACK_SKIP_PIXELS,Dt),_.pixelStorei(N.UNPACK_SKIP_ROWS,Zt),_.pixelStorei(N.UNPACK_SKIP_IMAGES,ie);let _s=b.isDataArrayTexture||b.isData3DTexture,xe=U.isDataArrayTexture||U.isData3DTexture;if(b.isDepthTexture){let De=W.get(b),Ti=W.get(U),Me=W.get(De.__renderTarget),Ei=W.get(Ti.__renderTarget);_.bindFramebuffer(N.READ_FRAMEBUFFER,Me.__webglFramebuffer),_.bindFramebuffer(N.DRAW_FRAMEBUFFER,Ei.__webglFramebuffer);for(let vs=0;vs<Ct;vs++)_s&&(N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,W.get(b).__webglTexture,G,ie+vs),N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,W.get(U).__webglTexture,Et,Fe+vs)),N.blitFramebuffer(Dt,Zt,Rt,St,Pt,de,Rt,St,N.DEPTH_BUFFER_BIT,N.NEAREST);_.bindFramebuffer(N.READ_FRAMEBUFFER,null),_.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else if(G!==0||b.isRenderTargetTexture||W.has(b)){let De=W.get(b),Ti=W.get(U);_.bindFramebuffer(N.READ_FRAMEBUFFER,P),_.bindFramebuffer(N.DRAW_FRAMEBUFFER,L);for(let Me=0;Me<Ct;Me++)_s?N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,De.__webglTexture,G,ie+Me):N.framebufferTexture2D(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,De.__webglTexture,G),xe?N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,Ti.__webglTexture,Et,Fe+Me):N.framebufferTexture2D(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,Ti.__webglTexture,Et),G!==0?N.blitFramebuffer(Dt,Zt,Rt,St,Pt,de,Rt,St,N.COLOR_BUFFER_BIT,N.NEAREST):xe?N.copyTexSubImage3D(At,Et,Pt,de,Fe+Me,Dt,Zt,Rt,St):N.copyTexSubImage2D(At,Et,Pt,de,Dt,Zt,Rt,St);_.bindFramebuffer(N.READ_FRAMEBUFFER,null),_.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else xe?b.isDataTexture||b.isData3DTexture?N.texSubImage3D(At,Et,Pt,de,Fe,Rt,St,Ct,ve,tn,Te.data):U.isCompressedArrayTexture?N.compressedTexSubImage3D(At,Et,Pt,de,Fe,Rt,St,Ct,ve,Te.data):N.texSubImage3D(At,Et,Pt,de,Fe,Rt,St,Ct,ve,tn,Te):b.isDataTexture?N.texSubImage2D(N.TEXTURE_2D,Et,Pt,de,Rt,St,ve,tn,Te.data):b.isCompressedTexture?N.compressedTexSubImage2D(N.TEXTURE_2D,Et,Pt,de,Te.width,Te.height,ve,Te.data):N.texSubImage2D(N.TEXTURE_2D,Et,Pt,de,Rt,St,ve,tn,Te);_.pixelStorei(N.UNPACK_ROW_LENGTH,cn),_.pixelStorei(N.UNPACK_IMAGE_HEIGHT,ae),_.pixelStorei(N.UNPACK_SKIP_PIXELS,An),_.pixelStorei(N.UNPACK_SKIP_ROWS,$n),_.pixelStorei(N.UNPACK_SKIP_IMAGES,Si),Et===0&&U.generateMipmaps&&N.generateMipmap(At),_.unbindTexture()},this.initRenderTarget=function(b){W.get(b).__webglFramebuffer===void 0&&K.setupRenderTarget(b)},this.initTexture=function(b){b.isCubeTexture?K.setTextureCube(b,0):b.isData3DTexture?K.setTexture3D(b,0):b.isDataArrayTexture||b.isCompressedArrayTexture?K.setTexture2DArray(b,0):K.setTexture2D(b,0),_.unbindTexture()},this.resetState=function(){X=0,k=0,Z=null,_.reset(),wt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Vn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let e=this.getContext();e.drawingBufferColorSpace=te._getDrawingBufferColorSpace(t),e.unpackColorSpace=te._getUnpackColorSpace()}};var lr={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};var Sn=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}},Py=new Fi(-1,1,1,-1,0,1),xu=class extends ge{constructor(){super(),this.setAttribute("position",new qt([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new qt([0,2,0,0,2,0],2))}},Iy=new xu,Gi=class{constructor(t){this._mesh=new Tt(Iy,t)}dispose(){this._mesh.geometry.dispose()}render(t){t.render(this._mesh,Py)}get material(){return this._mesh.material}set material(t){this._mesh.material=t}};var cr=class extends Sn{constructor(t,e="tDiffuse"){super(),this.textureID=e,this.uniforms=null,this.material=null,t instanceof we?(this.uniforms=t.uniforms,this.material=t):t&&(this.uniforms=vi.clone(t.uniforms),this.material=new we({name:t.name!==void 0?t.name:"unspecified",defines:Object.assign({},t.defines),uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader})),this._fsQuad=new Gi(this.material)}render(t,e,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};var Va=class extends Sn{constructor(t,e){super(),this.scene=t,this.camera=e,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(t,e,n){let i=t.getContext(),r=t.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(i.REPLACE,i.REPLACE,i.REPLACE),r.buffers.stencil.setFunc(i.ALWAYS,a,4294967295),r.buffers.stencil.setClear(o),r.buffers.stencil.setLocked(!0),t.setRenderTarget(n),this.clear&&t.clear(),t.render(this.scene,this.camera),t.setRenderTarget(e),this.clear&&t.clear(),t.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(i.EQUAL,1,4294967295),r.buffers.stencil.setOp(i.KEEP,i.KEEP,i.KEEP),r.buffers.stencil.setLocked(!0)}},pc=class extends Sn{constructor(){super(),this.needsSwap=!1}render(t){t.state.buffers.stencil.setLocked(!1),t.state.buffers.stencil.setTest(!1)}};var mc=class{constructor(t,e){if(this.renderer=t,this._pixelRatio=t.getPixelRatio(),e===void 0){let n=t.getSize(new it);this._width=n.width,this._height=n.height,e=new Le(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:ze}),e.texture.name="EffectComposer.rt1"}else this._width=e.width,this._height=e.height;this.renderTarget1=e,this.renderTarget2=e.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new cr(lr),this.copyPass.material.blending=Cn,this.timer=new Sa}swapBuffers(){let t=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=t}addPass(t){this.passes.push(t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(t,e){this.passes.splice(e,0,t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(t){let e=this.passes.indexOf(t);e!==-1&&this.passes.splice(e,1)}isLastEnabledPass(t){for(let e=t+1;e<this.passes.length;e++)if(this.passes[e].enabled)return!1;return!0}render(t){this.timer.update(),t===void 0&&(t=this.timer.getDelta());let e=this.renderer.getRenderTarget(),n=!1;for(let i=0,r=this.passes.length;i<r;i++){let a=this.passes[i];if(a.enabled!==!1){if(a.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(i),a.render(this.renderer,this.writeBuffer,this.readBuffer,t,n),a.needsSwap){if(n){let o=this.renderer.getContext(),c=this.renderer.state.buffers.stencil;c.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,t),c.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}Va!==void 0&&(a instanceof Va?n=!0:a instanceof pc&&(n=!1))}}this.renderer.setRenderTarget(e)}reset(t){if(t===void 0){let e=this.renderer.getSize(new it);this._pixelRatio=this.renderer.getPixelRatio(),this._width=e.width,this._height=e.height,t=this.renderTarget1.clone(),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=t,this.renderTarget2=t.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(t,e){this._width=t,this._height=e;let n=this._width*this._pixelRatio,i=this._height*this._pixelRatio;this.renderTarget1.setSize(n,i),this.renderTarget2.setSize(n,i);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,i)}setPixelRatio(t){this._pixelRatio=t,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}};var gc=class extends Sn{constructor(t,e,n=null,i=null,r=null){super(),this.scene=t,this.camera=e,this.overrideMaterial=n,this.clearColor=i,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new lt}render(t,e,n){let i=t.autoClear;t.autoClear=!1;let r,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(t.getClearColor(this._oldClearColor),t.setClearColor(this.clearColor,t.getClearAlpha())),this.clearAlpha!==null&&(r=t.getClearAlpha(),t.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&t.clearDepth(),t.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),t.render(this.scene,this.camera),this.clearColor!==null&&t.setClearColor(this._oldClearColor),this.clearAlpha!==null&&t.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),t.autoClear=i}};var ep={name:"LuminosityHighPassShader",uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new lt(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`};var hr=class s extends Sn{constructor(t,e=1,n,i){super(),this.strength=e,this.radius=n,this.threshold=i,this.resolution=t!==void 0?new it(t.x,t.y):new it(256,256),this.clearColor=new lt(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new Le(r,a,{type:ze,depthBuffer:!1}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let h=0;h<this.nMips;h++){let d=new Le(r,a,{type:ze,depthBuffer:!1});d.texture.name="UnrealBloomPass.h"+h,d.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(d);let u=new Le(r,a,{type:ze,depthBuffer:!1});u.texture.name="UnrealBloomPass.v"+h,u.texture.generateMipmaps=!1,this.renderTargetsVertical.push(u),r=Math.round(r/2),a=Math.round(a/2)}let o=ep;this.highPassUniforms=vi.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=i,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new we({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];let c=[6,10,14,18,22];r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let h=0;h<this.nMips;h++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(c[h])),this.separableBlurMaterials[h].uniforms.invSize.value=new it(1/r,1/a),r=Math.round(r/2),a=Math.round(a/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=e,this.compositeMaterial.uniforms.bloomRadius.value=.1;let l=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=l,this.bloomTintColors=[new w(1,1,1),new w(1,1,1),new w(1,1,1),new w(1,1,1),new w(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=vi.clone(lr.uniforms),this.blendMaterial=new we({uniforms:this.copyUniforms,vertexShader:lr.vertexShader,fragmentShader:lr.fragmentShader,premultipliedAlpha:!0,blending:gn,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new lt,this._oldClearAlpha=1,this._basic=new fe,this._fsQuad=new Gi(null)}dispose(){for(let t=0;t<this.renderTargetsHorizontal.length;t++)this.renderTargetsHorizontal[t].dispose();for(let t=0;t<this.renderTargetsVertical.length;t++)this.renderTargetsVertical[t].dispose();this.renderTargetBright.dispose();for(let t=0;t<this.separableBlurMaterials.length;t++)this.separableBlurMaterials[t].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(t,e){let n=Math.round(t/2),i=Math.round(e/2);this.renderTargetBright.setSize(n,i);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(n,i),this.renderTargetsVertical[r].setSize(n,i),this.separableBlurMaterials[r].uniforms.invSize.value=new it(1/n,1/i),n=Math.round(n/2),i=Math.round(i/2)}render(t,e,n,i,r){t.getClearColor(this._oldClearColor),this._oldClearAlpha=t.getClearAlpha();let a=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),r&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=n.texture,t.setRenderTarget(null),t.clear(),this._fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this._fsQuad.render(t);let o=this.renderTargetBright;for(let c=0;c<this.nMips;c++)this._fsQuad.material=this.separableBlurMaterials[c],this.separableBlurMaterials[c].uniforms.colorTexture.value=o.texture,this.separableBlurMaterials[c].uniforms.direction.value=s.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[c]),t.clear(),this._fsQuad.render(t),this.separableBlurMaterials[c].uniforms.colorTexture.value=this.renderTargetsHorizontal[c].texture,this.separableBlurMaterials[c].uniforms.direction.value=s.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[c]),t.clear(),this._fsQuad.render(t),o=this.renderTargetsVertical[c];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this._fsQuad.render(t),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(n),this._fsQuad.render(t)),t.setClearColor(this._oldClearColor,this._oldClearAlpha),t.autoClear=a}_getSeparableBlurMaterial(t){let e=[],n=t/3;for(let a=0;a<t;a++)e.push(.39894*Math.exp(-.5*a*a/(n*n))/n);let i=[],r=[];for(let a=1;a<t;a+=2){let o=e[a],c=a+1<t?e[a+1]:0,l=o+c;i.push((a*o+(a+1)*c)/l),r.push(l)}return new we({defines:{KERNEL_PAIRS:i.length},uniforms:{colorTexture:{value:null},invSize:{value:new it(.5,.5)},direction:{value:new it(.5,.5)},centerWeight:{value:e[0]},gaussianOffsets:{value:i},gaussianWeights:{value:r}},vertexShader:`

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

				}`})}};hr.BlurDirectionX=new it(1,0);hr.BlurDirectionY=new it(0,1);var Ha={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};var xc=class extends Sn{constructor(){super(),this.isOutputPass=!0,this.uniforms=vi.clone(Ha.uniforms),this.material=new Ks({name:Ha.name,uniforms:this.uniforms,vertexShader:Ha.vertexShader,fragmentShader:Ha.fragmentShader}),this._fsQuad=new Gi(this.material),this._outputColorSpace=null,this._toneMapping=null}render(t,e,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=t.toneMappingExposure,(this._outputColorSpace!==t.outputColorSpace||this._toneMapping!==t.toneMapping)&&(this._outputColorSpace=t.outputColorSpace,this._toneMapping=t.toneMapping,this.material.defines={},te.getTransfer(this._outputColorSpace)===le&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===Ta?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===Ea?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===wa?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===os?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===Ra?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===Ca?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===Aa&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};var ut={dt:.008333333333333333,gravity:-6.5,ballRadius:.9125,ballMass:30,ballMaxSpeed:60,ballMaxAngVel:6,ballDrag:.0305,ballRestitution:.6,ballFriction:.35,carMass:180,carMaxSpeed:23,supersonic:22,throttleMaxSpeed:14.1,boostAccel:9.9167,boostPerSecond:33.33,brakeAccel:35,coastAccel:5.25,airThrottleAccel:.6667,jumpImpulse:2.9167,jumpHoldAccel:14.583,jumpHoldTime:.2,stickyAccel:3.25,doubleJumpWindow:1.25,dodgeImpulse:5,flipTime:.65,maxAngVel:5.5,rideHeight:.17,airPitchAccel:12.46,airYawAccel:9.11,airRollAccel:38.34,airPitchDamp:2.798,airYawDamp:1.886,airRollDamp:4.472,demoRespawnTime:3,startBoost:33.3},Tn={octane:{name:"Octane",hx:.59,hy:.18,hz:.42},dominus:{name:"Dominus",hx:.64,hy:.155,hz:.42},breakout:{name:"Breakout",hx:.66,hy:.15,hz:.4},merc:{name:"Merc",hx:.6,hy:.22,hz:.43}},ur=[{name:"BLEU",main:2059263,light:5939455,dark:732538,css:"#2f7bff"},{name:"ORANGE",main:16742932,light:16756316,dark:8006661,css:"#ff8a1f"}],Ga={rookie:{label:"Recrue",reaction:.28,aim:.55,boostUse:.35,aerial:0,flips:.3,speed:.85},pro:{label:"Pro",reaction:.14,aim:.8,boostUse:.8,aerial:.5,flips:.8,speed:.95},allstar:{label:"All-Star",reaction:.05,aim:.95,boostUse:1,aerial:1,flips:1,speed:1}},_u=["Viper","Hound","Sultan","Jester","Bandit","Gerwin","Poncho","Rainmaker","Merlin","Samara","Sundown","Tex","Casper","Foamer","Stinger","Shepard","Boomer","Raja","Squall","Myrtle"];var ee={W:40.96,L:51.2,H:20.44,RC:12,RV:3,GW:8.93,GH:6.43,GD:8.8,GEXT:6.5},{W:Ly,L:dr,H:Dy,RC:Ny,RV:Wa,GW:Uy,GH:np,GD:Fy,GEXT:sp}=ee,ip=Dy/2,rp=(Fy+sp)/2,By=dr-sp+rp;function fn(s,t,e){let n=Ny-Wa,i=Math.abs(s)-(Ly-Wa)+n,r=Math.abs(e)-(dr-Wa)+n,a=Math.hypot(Math.max(i,0),Math.max(r,0))+Math.min(Math.max(i,r),0)-n,o=Math.abs(t-ip)-(ip-Wa),c=Math.hypot(Math.max(a,0),Math.max(o,0))+Math.min(Math.max(a,o),0)-Wa,l=Math.abs(s)-Uy,h=Math.abs(t-np/2)-np/2,d=Math.abs(Math.abs(e)-By)-rp,u=Math.hypot(Math.max(l,0),Math.max(h,0),Math.max(d,0))+Math.min(Math.max(l,h,d),0);return c<u?c:u}function yi(s,t,e,n){let r=fn(s-.004,t,e)-fn(s+.004,t,e),a=fn(s,t-.004,e)-fn(s,t+.004,e),o=fn(s,t,e-.004)-fn(s,t,e+.004),c=Math.hypot(r,a,o)||1;return n.set(r/c,a/c,o/c)}function vu(s,t){return s>dr+t?0:s<-dr-t?1:-1}function yu(s){return s===0?-dr:dr}var Oy=[[-3072,-4096],[3072,-4096],[-3584,0],[3584,0],[-3072,4096],[3072,4096]],zy=[[0,-4240],[-1792,-4184],[1792,-4184],[-940,-3308],[940,-3308],[0,-2816],[-3584,-2484],[3584,-2484],[-1788,-2300],[1788,-2300],[-2048,-1036],[0,-1024],[2048,-1036],[-1024,0],[1024,0],[-2048,1036],[0,1024],[2048,1036],[-1788,2300],[1788,2300],[-3584,2484],[3584,2484],[0,2816],[-940,3310],[940,3308],[-1792,4184],[1792,4184],[0,4240]];function fr(){let s=[];for(let[t,e]of Oy)s.push({pos:new w(t/100,0,e/100),big:!0,active:!0,timer:0});for(let[t,e]of zy)s.push({pos:new w(t/100,0,e/100),big:!1,active:!0,timer:0});return s}var ap=[[-20.48,-25.6],[20.48,-25.6],[-2.56,-38.4],[2.56,-38.4],[0,-46.08]],op={1:[[0],[1],[2],[3],[4]],2:[[0,1],[0,3],[2,1],[2,4],[3,4],[0,4],[1,4]],3:[[0,1,4],[0,3,4],[2,1,4],[0,1,2],[0,1,3]],4:[[0,1,2,4],[0,1,3,4]]},pr=[[-23.04,-46.08],[23.04,-46.08],[-26.88,-46.08],[26.88,-46.08]];var fs=ut.ballRadius,us=new w,Mu=new w,ds=new w,vc=new w,lp=new re;function Su(s,t,e){let n=t.length();n<1e-7||(vc.copy(t).multiplyScalar(1/n),lp.setFromAxisAngle(vc,n*e),s.premultiply(lp).normalize())}function cp(s,t){s.vel.y+=ut.gravity*t,s.vel.multiplyScalar(1-ut.ballDrag*t);let e=s.vel.length();e>ut.ballMaxSpeed&&s.vel.multiplyScalar(ut.ballMaxSpeed/e),s.pos.addScaledVector(s.vel,t);let n=0,r=fn(s.pos.x,s.pos.y,s.pos.z)+fs;if(r>0){yi(s.pos.x,s.pos.y,s.pos.z,us),s.pos.addScaledVector(us,r);let o=s.vel.dot(us);if(o<0){n=-o;let l=-(1+(o>-.6?0:ut.ballRestitution))*o;s.vel.addScaledVector(us,l),Mu.copy(us).multiplyScalar(-fs),ds.crossVectors(s.angVel,Mu).add(s.vel),ds.addScaledVector(us,-ds.dot(us));let h=ds.length();if(h>1e-6){let d=Math.min(ut.ballFriction*l,h/3.5);ds.multiplyScalar(1/h),s.vel.addScaledVector(ds,-d),vc.crossVectors(Mu,ds).multiplyScalar(-d*2.5/(fs*fs)),s.angVel.add(vc)}}}let a=s.angVel.length();return a>ut.ballMaxAngVel&&s.angVel.multiplyScalar(ut.ballMaxAngVel/a),n}var yc=class{constructor(){this.pos=new w(0,fs,0),this.vel=new w,this.angVel=new w,this.quat=new re,this.prevPos=this.pos.clone(),this.prevQuat=this.quat.clone(),this.radius=fs,this.hidden=!1,this.lastTouch=null,this.touches=[]}reset(t=0,e=fs,n=0){this.pos.set(t,e,n),this.vel.set(0,0,0),this.angVel.set(0,0,0),this.prevPos.copy(this.pos),this.prevQuat.copy(this.quat),this.hidden=!1,this.lastTouch=null,this.touches.length=0}step(t){if(this.prevPos.copy(this.pos),this.prevQuat.copy(this.quat),this.hidden)return 0;let e=cp(this,t);return Su(this.quat,this.angVel,t),e}},_c=new w,bu=new w;function Tu(s,t,e){let n=s.vel.length();if(n<.001)return;_c.copy(s.vel).multiplyScalar(1/n),bu.set(t.x-s.pos.x,t.y-s.pos.y,t.z-s.pos.z).normalize();let i=Math.acos(Math.max(-1,Math.min(1,_c.dot(bu)))),r=1.6*e;i>1e-4&&_c.lerp(bu,Math.min(1,r/i)).normalize(),n<t.minSpeed&&(n+=(t.minSpeed-n)*Math.min(1,e*2.5)),s.vel.copy(_c).multiplyScalar(n)}function hp(s,t=4,e=1/60,n=null){let i={pos:s.pos.clone(),vel:s.vel.clone(),angVel:s.angVel.clone()},r=[],a=2,o=e/a;for(let c=e;c<=t+1e-6;c+=e){for(let l=0;l<a;l++)cp(i,o),n&&Tu(i,n,o);r.push({t:c,pos:i.pos.clone(),vel:i.vel.clone()})}return r}function ky(){return{throttle:0,steer:0,pitch:0,yaw:0,roll:0,jump:!1,boost:!1,handbrake:!1}}function Vy(s){return s<14?16-14.4*(s/14):s<14.1?1.6*(14.1-s)/.1:0}var ps=[[0,.69],[5,.398],[10,.235],[15,.1375],[17.5,.11],[23,.088]];function Hy(s){if(s<=0)return ps[0][1];for(let t=1;t<ps.length;t++)if(s<=ps[t][0]){let[e,n]=ps[t-1],[i,r]=ps[t];return n+(r-n)*(s-e)/(i-e)}return ps[ps.length-1][1]}var Eu=(s,t,e)=>s<t?t:s>e?e:s,wu=[];for(let s of[-1,0,1])for(let t of[-1,0,1])for(let e of[-1,0,1])(s||t||e)&&wu.push([s,t,e]);var Ln=new w,ri=new w,eT=new w,be=new w,mr=new w,Mc=new w,Ie=new w,up=new w,gr=new w,Mi=new w,En=new w,dp=new w,bc=new w,Sc=new re,fp=new re,Tc=new re,Gy=new re,Wy=0,Ec=class{constructor({team:t=0,name:e="Joueur",body:n="octane",isBot:i=!1,colors:r=null}={}){this.id=Wy++,this.team=t,this.name=e,this.isBot=i,this.bodyKey=Tn[n]?n:"octane",this.body=Tn[this.bodyKey],this.colors=r;let{hx:a,hy:o,hz:c}=this.body,l=1.4;this.invI=new w(12/(l*(4*o*o+4*c*c)),12/(l*(4*a*a+4*c*c)),12/(l*(4*a*a+4*o*o))),this.clearance=o+ut.rideHeight,this.pos=new w,this.vel=new w,this.quat=new re,this.angVel=new w,this.prevPos=new w,this.prevQuat=new re,this.groundNormal=new w(0,1,0),this.contactNormal=new w(0,1,0),this.rightingAxis=new w,this.controls=ky(),this.stats={score:0,goals:0,assists:0,saves:0,shots:0,demos:0},this.resetState()}resetState(){this.boost=ut.startBoost,this.onGround=!1,this.jumping=!1,this.jumpTime=0,this.jumpLock=0,this.hasJumped=!1,this.hasDoubleJumped=!1,this.hasFlipped=!1,this.airTimeSinceJump=0,this.flipping=!1,this.flipTime=0,this.flipDir={x:0,y:0},this.prevJump=!1,this.demolished=!1,this.respawnTimer=0,this.boosting=!1,this.supersonic=!1,this.contactTimer=1,this.groundTime=0,this.airTime=0,this.lastExtraHit=-10,this.lastShotTime=-10,this.wheelSpin=0,this.steerVis=0,this.justJumped=!1,this.justDodged=!1,this.righting=0}placeAt(t,e,n,i){this.resetState(),this.pos.set(t,this.clearance,e),this.vel.set(0,0,0),this.angVel.set(0,0,0),this.quat.setFromAxisAngle(Ie.set(0,1,0),Math.atan2(-i,n)),this.prevPos.copy(this.pos),this.prevQuat.copy(this.quat),this.onGround=!0,this.groundNormal.set(0,1,0)}forward(t){return t.set(1,0,0).applyQuaternion(this.quat)}up(t){return t.set(0,1,0).applyQuaternion(this.quat)}right(t){return t.set(0,0,1).applyQuaternion(this.quat)}applyInvInertia(t,e){return Tc.copy(this.quat).invert(),e.copy(t).applyQuaternion(Tc),e.x*=this.invI.x,e.y*=this.invI.y,e.z*=this.invI.z,e.applyQuaternion(this.quat)}demolish(){this.demolished=!0,this.respawnTimer=ut.demoRespawnTime,this.vel.set(0,0,0),this.angVel.set(0,0,0),this.boosting=!1}canDodge(){return!this.hasFlipped&&!this.hasDoubleJumped&&(!this.hasJumped||this.airTimeSinceJump<ut.doubleJumpWindow)}step(t){if(this.prevPos.copy(this.pos),this.prevQuat.copy(this.quat),this.justJumped=!1,this.justDodged=!1,this.demolished)return;let e=this.controls,n=e.jump&&!this.prevJump;this.prevJump=e.jump,this.up(ri);let i=-fn(this.pos.x,this.pos.y,this.pos.z);yi(this.pos.x,this.pos.y,this.pos.z,be),this.jumpLock=Math.max(0,this.jumpLock-t);let r=this.jumpLock<=0&&i<this.clearance+.12&&ri.dot(be)>.55;this.contactTimer+=t,r?(this.onGround||(this.hasJumped=!1,this.hasDoubleJumped=!1,this.hasFlipped=!1,this.flipping=!1,this.jumping=!1,this.righting=0,this.airTimeSinceJump=0),this.onGround=!0,this.groundTime+=t,this.airTime=0,this.groundNormal.copy(be),this.driveGround(t,e,n)):(this.onGround=!1,this.groundTime=0,this.airTime+=t,this.airControl(t,e,n)),this.jumping&&(this.jumpTime+=t,e.jump&&this.jumpTime<ut.jumpHoldTime?(this.up(Ie),this.vel.addScaledVector(Ie,ut.jumpHoldAccel*t)):this.jumping=!1),this.boosting=!1,e.boost&&this.boost>0?(this.boosting=!0,this.forward(Ln),this.vel.addScaledVector(Ln,ut.boostAccel*t),this.boost=Math.max(0,this.boost-ut.boostPerSecond*t)):!this.onGround&&e.throttle&&(this.forward(Ln),this.vel.addScaledVector(Ln,ut.airThrottleAccel*e.throttle*t)),this.vel.y+=ut.gravity*t;let a=this.vel.length();if(a>ut.carMaxSpeed&&this.vel.multiplyScalar(ut.carMaxSpeed/a),this.pos.addScaledVector(this.vel,t),r||Su(this.quat,this.angVel,t),r){let c=-fn(this.pos.x,this.pos.y,this.pos.z);if(yi(this.pos.x,this.pos.y,this.pos.z,be),c<this.clearance){this.pos.addScaledVector(be,this.clearance-c);let l=this.vel.dot(be);l<0&&this.vel.addScaledVector(be,-l)}}this.collideArena();let o=this.vel.length();this.supersonic=o>=(this.supersonic?21:ut.supersonic),this.forward(Ln),this.wheelSpin+=this.vel.dot(Ln)*t/.17,this.steerVis+=(e.steer-this.steerVis)*Math.min(1,t*12)}driveGround(t,e,n){this.up(ri),ri.dot(be)<.99999&&(fp.setFromUnitVectors(ri,be),Sc.copy(Gy).slerp(fp,1-Math.exp(-t*28)),this.quat.premultiply(Sc).normalize()),this.forward(Ln),mr.copy(Ln).addScaledVector(be,-Ln.dot(be)).normalize(),Mc.crossVectors(mr,be);let r=this.vel.dot(mr),a=-e.steer*Hy(Math.abs(r))*r*(e.handbrake?1.3:1),o=a*t;if(o!==0){Sc.setFromAxisAngle(be,o),this.quat.premultiply(Sc).normalize();let u=this.vel.dot(be);Ie.copy(this.vel).addScaledVector(be,-u),Ie.applyAxisAngle(be,o*(e.handbrake?.25:1)),this.vel.copy(Ie).addScaledVector(be,u),mr.applyAxisAngle(be,o),Mc.applyAxisAngle(be,o)}r=this.vel.dot(mr);let c=this.vel.dot(Mc),l=e.boost&&this.boost>0?1:e.throttle,h=0;Math.abs(l)>.01?r*l>=-.05?h=l*Vy(Math.abs(r)):h=Math.sign(l)*Math.min(ut.brakeAccel,Math.abs(r)/t):r!==0&&(h=-Math.sign(r)*Math.min(ut.coastAccel,Math.abs(r)/t)),this.vel.addScaledVector(mr,h*t);let d=e.handbrake?2.2:26;this.vel.addScaledVector(Mc,c*Math.exp(-d*t)-c),this.vel.addScaledVector(be,-ut.stickyAccel*t),this.angVel.copy(be).multiplyScalar(a),n&&(this.vel.addScaledVector(be,ut.jumpImpulse),this.jumping=!0,this.jumpTime=0,this.hasJumped=!0,this.hasDoubleJumped=!1,this.hasFlipped=!1,this.airTimeSinceJump=0,this.jumpLock=.1,this.onGround=!1,this.justJumped=!0)}airControl(t,e,n){if(this.hasJumped&&!this.jumping&&(this.airTimeSinceJump+=t),n&&!this.jumping){if(this.up(ri),this.contactTimer<.15&&ri.dot(this.contactNormal)<.55&&this.vel.length()<6){this.vel.addScaledVector(this.contactNormal,3.2),Ie.crossVectors(ri,this.contactNormal),Ie.lengthSq()<1e-4&&this.forward(Ie);let l=Math.acos(Eu(ri.dot(this.contactNormal),-1,1));this.rightingAxis.copy(Ie.normalize()).multiplyScalar(ut.maxAngVel),this.righting=l/ut.maxAngVel,this.angVel.copy(this.rightingAxis),this.hasJumped=!0,this.hasFlipped=!0,this.justJumped=!0}else if(this.canDodge()){let l=e.pitch,h=Eu(e.yaw+e.roll,-1,1);Math.abs(l)+Math.abs(h)>=.5?this.dodge(l,h):(this.vel.addScaledVector(ri,ut.jumpImpulse),this.hasDoubleJumped=!0,this.justJumped=!0)}}Tc.copy(this.quat).invert();let i=up.copy(this.angVel).applyQuaternion(Tc),r=e.pitch,a=e.yaw,o=e.roll;if(this.righting>0){this.righting-=t,this.angVel.copy(this.rightingAxis);return}if(this.flipping&&(this.flipTime+=t,this.flipTime>=ut.flipTime+.5&&(this.flipping=!1)),this.flipping&&this.flipTime<ut.flipTime){let l=Eu(-r*Math.sign(this.flipDir.x),0,1);i.x=this.flipDir.y*ut.maxAngVel,i.z=-this.flipDir.x*ut.maxAngVel*(1-l),i.y+=(-a*ut.airYawAccel-ut.airYawDamp*i.y*(1-Math.abs(a)))*t,this.flipTime>=.15&&(this.vel.y<0||this.flipTime<.21)&&(this.vel.y*=Math.pow(.65,t*120))}else{let l=this.flipping?0:1;i.x+=(o*ut.airRollAccel-ut.airRollDamp*i.x*l)*t,i.z+=(-r*ut.airPitchAccel-ut.airPitchDamp*i.z*(1-Math.abs(r))*l)*t,i.y+=(-a*ut.airYawAccel-ut.airYawDamp*i.y*(1-Math.abs(a)))*t}let c=i.length();c>ut.maxAngVel&&i.multiplyScalar(ut.maxAngVel/c),this.angVel.copy(i).applyQuaternion(this.quat)}dodge(t,e){let n=Math.hypot(t,e);t/=n,e/=n,this.forward(Ln),Ie.set(Ln.x,0,Ln.z),Ie.lengthSq()<1e-4&&this.up(Ie).set(-Ie.x,0,-Ie.z),Ie.normalize(),gr.set(-Ie.z,0,Ie.x);let i=this.vel.dot(Ie),r=Math.abs(i)/ut.carMaxSpeed,a=Math.abs(i)<1?t<0:t>=0!=i>0,o=t*ut.dodgeImpulse,c=e*ut.dodgeImpulse;a&&(o*=(1.5*r+1)*(16/15)),c*=.9*r+1,this.vel.addScaledVector(Ie,o).addScaledVector(gr,c),this.flipping=!0,this.flipTime=0,this.flipDir.x=t,this.flipDir.y=e,this.hasFlipped=!0,this.justDodged=!0}collideArena(){let{hx:t,hy:e,hz:n}=this.body;for(let i=0;i<3;i++){let r=0,a=0;for(let c of wu){En.set(c[0]*t,c[1]*e,c[2]*n).applyQuaternion(this.quat).add(this.pos);let l=fn(En.x,En.y,En.z);l>0&&(a++,l>r&&(r=l,Mi.copy(En)))}if(a===0)break;yi(Mi.x,Mi.y,Mi.z,be),this.pos.addScaledVector(be,r),this.contactNormal.copy(be),this.contactTimer=0,Mi.set(0,0,0),bc.set(0,0,0);let o=0;for(let c of wu)En.set(c[0]*t,c[1]*e,c[2]*n).applyQuaternion(this.quat).add(this.pos),fn(En.x,En.y,En.z)>-.03&&(Mi.add(En),bc.add(yi(En.x,En.y,En.z,be)),o++);o!==0&&(dp.copy(Mi).multiplyScalar(1/o),bc.normalize(),this.contactImpulse(dp,bc,.15,.55))}this.contactTimer===0&&!this.onGround&&this.vel.lengthSq()<.5&&this.angVel.lengthSq()<.8&&Math.max(-this.up(Ie).dot(this.contactNormal),Math.abs(this.right(Ie).dot(this.contactNormal)))>.9&&(this.vel.multiplyScalar(.85),this.angVel.multiplyScalar(.8))}contactImpulse(t,e,n,i){let r=Ie.copy(t).sub(this.pos),a=up.crossVectors(this.angVel,r).add(this.vel),o=a.dot(e);if(o>=0)return;let c=gr.crossVectors(r,e),l=this.applyInvInertia(c,gr),h=1+e.dot(Mi.crossVectors(l,r)),d=-(1+(o<-1.5?n:0))*o/h;this.vel.addScaledVector(e,d),this.angVel.addScaledVector(l,d),a.crossVectors(this.angVel,r).add(this.vel),a.addScaledVector(e,-a.dot(e));let u=a.length();if(u<1e-5)return;let f=a.multiplyScalar(1/u),m=gr.crossVectors(r,f),x=this.applyInvInertia(m,gr),g=1+f.dot(Mi.crossVectors(x,r)),p=Math.min(u/g,i*d);this.vel.addScaledVector(f,-p),this.angVel.addScaledVector(x,-p)}};var Wi=ut.ballMass,Xi=ut.carMass,Xn=ut.ballRadius,rn=new w,se=new w,pp=new w,Xa=new w,wc=new w,Ac=new w,Rc=new w,Cc=new w,qn=new w,$a=new w,mp=new re,xr=(s,t,e)=>s<t?t:s>e?e:s;function Xy(s){return s<=5?.65:s<=23?.65-.1*(s-5)/18:s<=46?.55-.25*(s-23)/23:.3}function Sp(s,t,e){if(s.demolished||t.hidden)return 0;let{hx:n,hy:i,hz:r}=s.body;if(mp.copy(s.quat).invert(),rn.copy(t.pos).sub(s.pos).applyQuaternion(mp),Math.abs(rn.x)>n+Xn||Math.abs(rn.y)>i+Xn||Math.abs(rn.z)>r+Xn)return 0;let a=xr(rn.x,-n,n),o=xr(rn.y,-i,i),c=xr(rn.z,-r,r);se.set(rn.x-a,rn.y-o,rn.z-c);let l=se.length();if(l>=Xn)return 0;let h;if(l>1e-6)se.multiplyScalar(1/l),h=Xn-l;else{let T=n-Math.abs(rn.x),E=i-Math.abs(rn.y),C=r-Math.abs(rn.z);T<E&&T<C?(se.set(Math.sign(rn.x)||1,0,0),h=T+Xn):E<C?(se.set(0,Math.sign(rn.y)||1,0),h=E+Xn):(se.set(0,0,Math.sign(rn.z)||1),h=C+Xn)}pp.set(a,o,c).applyQuaternion(s.quat).add(s.pos);let d=se.y<-.85;se.applyQuaternion(s.quat),t.pos.addScaledVector(se,h*Xi/(Wi+Xi)),s.pos.addScaledVector(se,-h*Wi/(Wi+Xi)),Xa.copy(pp).sub(s.pos),wc.copy(se).multiplyScalar(-Xn),Ac.crossVectors(s.angVel,Xa).add(s.vel),Rc.crossVectors(t.angVel,wc).add(t.vel);let u=Cc.copy(Rc).sub(Ac),f=u.dot(se);if(d&&!s.onGround&&(s.hasJumped||s.hasFlipped||s.hasDoubleJumped)&&(s.hasJumped=!1,s.hasDoubleJumped=!1,s.hasFlipped=!1,s.flipReset=!0),f>=0)return 0;let m=Math.min(Math.hypot(t.vel.x-s.vel.x,t.vel.y-s.vel.y,t.vel.z-s.vel.z),46),x=s.applyInvInertia(qn.crossVectors(Xa,se),qn).multiplyScalar(1/Xi),g=1/Wi+1/Xi+se.dot($a.crossVectors(x,Xa)),p=-f/g;t.vel.addScaledVector(se,p/Wi),s.vel.addScaledVector(se,-p/Xi),s.angVel.addScaledVector(x,-p),Ac.crossVectors(s.angVel,Xa).add(s.vel),Rc.crossVectors(t.angVel,wc).add(t.vel),u.copy(Rc).sub(Ac),u.addScaledVector(se,-u.dot(se));let M=u.length();if(M>1e-5){let T=u.multiplyScalar(1/M),E=Math.min(M/(3.5/Wi+1/Xi),2*p);t.vel.addScaledVector(T,-E/Wi),s.vel.addScaledVector(T,E/Xi),qn.crossVectors(wc,T).multiplyScalar(-E/(.4*Wi*Xn*Xn)),t.angVel.add(qn)}let S=-f;S>.4&&e-s.lastExtraHit>.05&&(s.lastExtraHit=e,qn.copy(t.pos).sub(s.pos),qn.y*=.35,qn.normalize(),s.forward($a),qn.addScaledVector($a,-qn.dot($a)*.35).normalize(),t.vel.addScaledVector(qn,m*Xy(m)));let y=t.vel.length();return y>ut.ballMaxSpeed&&t.vel.multiplyScalar(ut.ballMaxSpeed/y),S}var gp=.36,xp=new w,_p=new w,vp=new w,yp=new w,Mp=new w,bp=new w,qa=new w,Ya=new w;function qy(s,t,e,n,i,r){let a=Cc.copy(t).sub(s),o=qn.copy(n).sub(e),c=$a.copy(s).sub(e),l=a.dot(a),h=o.dot(o),d=o.dot(c),u=a.dot(c),f=a.dot(o),m=l*h-f*f,x=m>1e-8?xr((f*d-u*h)/m,0,1):0,g=(f*x+d)/h;g<0?(g=0,x=xr(-u/l,0,1)):g>1&&(g=1,x=xr((f-u)/l,0,1)),i.copy(s).addScaledVector(a,x),r.copy(e).addScaledVector(o,g)}function Tp(s,t){if(s.demolished||t.demolished||s.pos.distanceToSquared(t.pos)>4)return null;s.forward(qa),t.forward(Ya);let e=s.body.hx-.28,n=t.body.hx-.28;xp.copy(s.pos).addScaledVector(qa,-e),_p.copy(s.pos).addScaledVector(qa,e),vp.copy(t.pos).addScaledVector(Ya,-n),yp.copy(t.pos).addScaledVector(Ya,n),qy(xp,_p,vp,yp,Mp,bp),se.copy(bp).sub(Mp);let i=se.length();if(i>=gp*2||i<1e-6)return null;se.multiplyScalar(1/i);let r=gp*2-i;s.pos.addScaledVector(se,-r/2),t.pos.addScaledVector(se,r/2);let a=Cc.copy(t.vel).sub(s.vel).dot(se);if(a>=0)return null;if(s.team!==t.team){if(s.supersonic&&qa.dot(se)>.55&&s.vel.dot(se)>12)return t.demolish(),{type:"demo",attacker:s,victim:t};if(t.supersonic&&-Ya.dot(se)>.55&&-t.vel.dot(se)>12)return s.demolish(),{type:"demo",attacker:t,victim:s}}let o=-(1+.25)*a/2;s.vel.addScaledVector(se,-o),t.vel.addScaledVector(se,o);let c=null,l=null;if(qa.dot(se)>.5&&s.vel.dot(se)>4?(c=s,l=t):-Ya.dot(se)>.5&&-t.vel.dot(se)>4&&(c=t,l=s,se.negate()),c){let h=-a;return l.vel.addScaledVector(se,h*.45),l.vel.y+=h*(l.onGround?.3:.12),l.jumpLock=.1,l.angVel.add(Cc.set((Math.random()-.5)*3,(Math.random()-.5)*2,(Math.random()-.5)*3)),{type:"bump",attacker:c,victim:l,strength:h}}return{type:"touch",attacker:s,victim:t,strength:-a}}var Yy=ut.gravity,_r={goal:100,assist:50,save:50,epicSave:75,shot:20,demo:25},$y=2,Jy=720;function Zy(s){for(let t=s.length-1;t>0;t--){let e=Math.floor(Math.random()*(t+1));[s[t],s[e]]=[s[e],s[t]]}return s}function Pc(s,t=3.5){for(let e of s){if(e.t>t)break;let n=vu(e.pos.z,ut.ballRadius*.5);if(n>=0)return{team:n,t:e.t}}return null}var Ja=class{constructor(t){this.opts={duration:300,freeplay:!1,mode:"classic",unlimitedBoost:!1,noBoost:!1,gravityScale:1,replays:!0,...t},this.ball=new yc,this.cars=this.opts.players.map(e=>new Ec(e)),this.pads=fr(),this.score=[0,0],this.timeLeft=this.opts.duration,this.overtime=!1,this.overtimeElapsed=0,this.time=0,this.tickCount=0,this.state="countdown",this.stateTime=0,this.clockRunning=!1,this.events=[],this.frames=[],this.prediction=[],this.goalInfo=null,this.skipRequested=!1,this.replay=null,this.winner=-1,this.heatTouches=0,this.lastCountdown=4,this.opts.freeplay?this.startFreeplay():this.resetKickoff()}emit(t){this.events.push(t)}teamCars(t){return this.cars.filter(e=>e.team===t)}startFreeplay(){this.ball.reset(0,ut.ballRadius,0);let t=pr;this.cars.forEach((e,n)=>{let[i,r]=t[n%t.length],a=e.team===0?1:-1;e.placeAt(i*a,r*a,0,a),e.boost=100}),this.state="playing",this.stateTime=0,this.refreshPrediction()}resetKickoff(){this.ball.reset(0,ut.ballRadius,0);for(let n of this.pads)n.active=!0,n.timer=0;for(let n=0;n<2;n++){let i=this.teamCars(n),r=Math.min(Math.max(i.length,1),4),a=op[r],o=Zy([...a[Math.floor(Math.random()*a.length)]]);i.forEach((c,l)=>{let h=n===0?1:-1,d,u;l<o.length?[d,u]=ap[o[l]]:[d,u]=pr[l%pr.length],d*=h,u*=h,c.placeAt(d,u,-d,-u),c.boost=this.startBoost()})}let t=this.teamCars(0),e=this.teamCars(1);for(let n=0;n<Math.min(t.length,e.length);n++){let i=t[n];e[n].placeAt(-i.pos.x,-i.pos.z,i.pos.x,i.pos.z),e[n].boost=this.startBoost()}this.state="countdown",this.stateTime=0,this.clockRunning=!1,this.lastCountdown=4,this.kickoff=!0,this.heatTouches=0,this.refreshPrediction(),this.emit({type:"kickoff"})}startBoost(){return this.opts.unlimitedBoost?100:this.opts.noBoost?0:ut.startBoost}homing(){let t=this.ball.lastTouch;return this.opts.mode!=="heatseeker"||!t||this.ball.hidden?null:{x:0,y:ee.GH*.45,z:t.car.team===0?ee.L+2:-ee.L-2,minSpeed:Math.min(38,14+1.6*this.heatTouches)}}refreshPrediction(){this.prediction=hp(this.ball,4,1/60,this.homing())}requestSkip(){this.skipRequested=!0}tick(t){switch(ut.gravity=Yy*this.opts.gravityScale,this.time+=t,this.stateTime+=t,this.tickCount++,this.state){case"countdown":{let e=Math.ceil(3-this.stateTime);e<this.lastCountdown&&e>0&&(this.lastCountdown=e,this.emit({type:"countdown",n:e}));for(let n of this.cars)n.prevPos.copy(n.pos),n.prevQuat.copy(n.quat),n.prevJump=n.controls.jump;this.ball.prevPos.copy(this.ball.pos),this.stateTime>=3&&(this.state="playing",this.stateTime=0,this.emit({type:"go"})),this.record();break}case"playing":this.simulate(t,!0),this.updateClock(t);break;case"goal":this.simulate(t,!1),this.stateTime>(this.opts.freeplay?2:3)&&(this.opts.freeplay?(this.ball.reset(0,ut.ballRadius,0),this.heatTouches=0,this.state="playing",this.stateTime=0,this.refreshPrediction()):this.opts.replays?this.startReplay():this.afterGoal());break;case"replay":this.replay.time+=t,!this.replay.goalShown&&this.replay.time>=this.replay.goalTime&&(this.replay.goalShown=!0,this.emit({type:"replayGoal",team:this.goalInfo.team,pos:this.goalInfo.pos.clone()})),(this.replay.time>=this.replay.end||this.skipRequested&&this.stateTime>.3)&&(this.replay=null,this.afterGoal());break;case"overtime":this.stateTime>2.5&&this.resetKickoff();break;default:break}this.skipRequested=!1}updateClock(t){if(this.opts.freeplay||!this.clockRunning)return;if(this.overtime){this.overtimeElapsed+=t;return}this.opts.duration<=0||(this.timeLeft=Math.max(0,this.timeLeft-t),this.timeLeft>0)||!(this.opts.mode==="heatseeker"||this.ball.pos.y-this.ball.radius<.08)||(this.score[0]!==this.score[1]?this.endMatch():(this.overtime=!0,this.state="overtime",this.stateTime=0,this.emit({type:"overtime"})))}endMatch(){this.state="ended",this.stateTime=0,this.winner=this.score[0]>this.score[1]?0:1,this.emit({type:"end",winner:this.winner})}afterGoal(){if(this.overtime)return this.endMatch();if(this.opts.duration>0&&this.timeLeft<=0){if(this.score[0]!==this.score[1])return this.endMatch();this.overtime=!0,this.state="overtime",this.stateTime=0,this.emit({type:"overtime"});return}this.resetKickoff()}simulate(t,e){let{cars:n,ball:i}=this;for(let o of n){if(o.demolished){o.respawnTimer-=t,o.respawnTimer<=0&&this.respawn(o),o.prevPos.copy(o.pos);continue}o.step(t),this.opts.unlimitedBoost?o.boost=100:this.opts.noBoost&&(o.boost=0),o.justJumped&&this.emit({type:"jump",car:o}),o.justDodged&&this.emit({type:"dodge",car:o})}let r=null;if(e&&!i.hidden){let o=i.step(t);o>2&&this.emit({type:"bounce",pos:i.pos.clone(),strength:o});let c=this.homing();c&&Tu(i,c,t);let l=n.length;for(let h=0;h<l;h++){let d=n[(h+this.tickCount)%l],u=Sp(d,i,this.time);if(d.flipReset&&(d.flipReset=!1,this.emit({type:"flipReset",car:d})),u>0){if(u>1.2||!i.lastTouch||i.lastTouch.car!==d||this.time-i.lastTouch.time>.4){let f={car:d,time:this.time},m=i.touches[i.touches.length-1];(!m||this.time-m.time>.25)&&this.heatTouches++,i.touches.push(f),i.touches.length>20&&i.touches.shift(),u>1.2&&this.emit({type:"hit",car:d,pos:i.pos.clone(),strength:u}),r=r||[],r.push(d)}i.lastTouch={car:d,time:this.time},this.kickoff&&(this.kickoff=!1),this.clockRunning=!0}}}else i.prevPos.copy(i.pos),i.prevQuat.copy(i.quat);for(let o=0;o<n.length;o++)for(let c=o+1;c<n.length;c++){let l=Tp(n[o],n[c]);l&&(l.type==="demo"?(this.state==="playing"&&(l.attacker.stats.demos++,this.addPoints(l.attacker,_r.demo,"D\xC9MOLITION")),this.emit({type:"demo",attacker:l.attacker,victim:l.victim,pos:l.victim.pos.clone()})):l.type==="bump"&&this.emit({type:"bump",attacker:l.attacker,victim:l.victim,strength:l.strength,pos:l.victim.pos.clone()}))}this.updatePads(t);let a=this.prediction;if((r||this.tickCount%4===0)&&this.refreshPrediction(),r&&this.state==="playing"&&this.touchStats(r,a),e&&!i.hidden&&this.state==="playing"){let o=vu(i.pos.z,i.radius);o>=0&&this.onGoal(o)}this.record()}touchStats(t,e){let n=Pc(e,2.5),i=Pc(this.prediction,3.5);for(let r of t)if(i&&i.team===r.team&&this.time-r.lastShotTime>1.5&&(r.lastShotTime=this.time,r.stats.shots++,this.addPoints(r,_r.shot,"TIR CADR\xC9")),n&&n.team!==r.team&&(!i||i.team===r.team)){let a=n.t<.35;r.stats.saves++,this.addPoints(r,a?_r.epicSave:_r.save,a?"ARR\xCAT \xC9PIQUE":"ARR\xCAT")}}addPoints(t,e,n){t.stats.score+=e,this.emit({type:"stat",car:t,points:e,label:n})}respawn(t){let e=this.teamCars(t.team),n=Math.max(0,e.indexOf(t)),[i,r]=pr[n%pr.length],a=t.team===0?1:-1,o=t.stats;t.placeAt(i*a,r*a,0,a),t.boost=this.startBoost(),t.stats=o,this.emit({type:"respawn",car:t})}updatePads(t){for(let e of this.pads){if(!e.active){e.timer-=t,e.timer<=0&&(e.active=!0);continue}let n=e.big?2.08:1.44,i=e.big?1.68:1.65;for(let r of this.cars){if(r.demolished||r.boost>=100||this.opts.noBoost)continue;let a=r.pos.x-e.pos.x,o=r.pos.z-e.pos.z;if(a*a+o*o<n*n&&r.pos.y<i){r.boost=Math.min(100,r.boost+(e.big?100:12)),e.active=!1,e.timer=e.big?10:4,this.emit({type:"pad",car:r,big:e.big,pos:e.pos});break}}}}onGoal(t){let{ball:e}=this;this.score[t]++;let n=e.touches,i=null,r=null,a=-1;for(let l=n.length-1;l>=0;l--)if(n[l].car.team===t){i=n[l].car,a=l;break}if(i){for(let l=a-1;l>=0;l--){let h=n[l];if(h.car.team!==t)break;if(h.car!==i){n[a].time-h.time<5&&(r=h.car);break}}i.stats.goals++,this.addPoints(i,_r.goal,"BUT"),r&&(r.stats.assists++,this.addPoints(r,_r.assist,"PASSE D\xC9CISIVE"))}let o=Math.round(e.vel.length()*3.6),c=!i&&e.lastTouch&&e.lastTouch.car.team!==t?e.lastTouch.car:null;this.goalInfo={team:t,scorer:i,assist:r,ownGoal:c,pos:e.pos.clone(),speedKmh:o,time:this.time},this.emit({type:"goal",...this.goalInfo});for(let l of this.cars){if(l.demolished)continue;let h=l.pos.distanceTo(e.pos);if(h<14){let d=l.pos.clone().sub(e.pos).normalize();l.vel.addScaledVector(d,(14-h)*1.6),l.vel.y+=(14-h)*.5,l.jumpLock=.2}}e.hidden=!0,this.state="goal",this.stateTime=0}record(){if(this.tickCount%$y!==0)return;let t=this.ball,e={t:this.time,ball:[t.pos.x,t.pos.y,t.pos.z,t.quat.x,t.quat.y,t.quat.z,t.quat.w,t.hidden?1:0],cars:this.cars.map(n=>[n.pos.x,n.pos.y,n.pos.z,n.quat.x,n.quat.y,n.quat.z,n.quat.w,n.boosting?1:0,n.demolished?1:0,n.steerVis,n.wheelSpin,n.supersonic?1:0])};this.frames.push(e),this.frames.length>Jy&&this.frames.shift()}startReplay(){let t=this.goalInfo.time,e=this.frames.length?this.frames[0].t:t,n=Math.max(e,t-5.5);this.replay={time:n,start:n,end:t+1.2,goalTime:t,goalShown:!1,frames:this.frames.slice()},this.state="replay",this.stateTime=0,this.emit({type:"replayStart"})}replaySnapshot(t){let e=this.replay?this.replay.frames:this.frames;if(!e.length)return null;let n=0,i=e.length-1;if(t<=e[0].t)i=0;else if(t>=e[i].t)n=i;else for(;i-n>1;){let c=n+i>>1;e[c].t<=t?n=c:i=c}let r=e[n],a=e[i],o=i===n?0:(t-r.t)/(a.t-r.t);return{a:r,b:a,k:o}}};var _n=(s,t,e)=>s<t?t:s>e?e:s,gT=ut.ballRadius,Ic=new w(0,ut.gravity,0),Dn=new w,Za=new w,Mr=new w,qi=new w,vr=new re,Ye=new re,Ep=new oe;function Ky(s){return s<14?16-14.4*(s/14):s<14.1?1.6*(14.1-s)/.1:0}function wp(s){s.throttle=0,s.steer=0,s.pitch=0,s.yaw=0,s.roll=0,s.jump=!1,s.boost=!1,s.handbrake=!1}function wn(s,t){return vr.copy(s.quat).invert(),qi.copy(t).sub(s.pos).applyQuaternion(vr),{angle:Math.atan2(qi.z,qi.x),dist:Math.hypot(qi.x,qi.z),lx:qi.x,ly:qi.y,lz:qi.z}}function Au(s){return s.forward(Mr),s.vel.dot(Mr)}function Pu(s,t,e,n){let i=Dn.copy(e).normalize(),r=Za.crossVectors(i,n);r.lengthSq()<1e-4&&s.right(r),r.normalize();let a=Mr.crossVectors(r,i).normalize();Ep.makeBasis(i,a,r),Ye.setFromRotationMatrix(Ep),vr.copy(s.quat).invert(),Ye.multiply(vr),Ye.w<0&&(Ye.x=-Ye.x,Ye.y=-Ye.y,Ye.z=-Ye.z,Ye.w=-Ye.w);let o=Math.hypot(Ye.x,Ye.y,Ye.z),c=2*Math.atan2(o,Ye.w),l=Dn.set(Ye.x,Ye.y,Ye.z);o>1e-6&&l.multiplyScalar(c/o),l.applyQuaternion(vr);let h=Za.copy(s.angVel).applyQuaternion(vr),d=5.5,u=9,f=(l.x*d*1.6-h.x)*u*1.6,m=(l.y*d-h.y)*u,x=(l.z*d-h.z)*u;return t.roll=_n(f/ut.airRollAccel,-1,1),t.yaw=_n(-m/ut.airYawAccel,-1,1),t.pitch=_n(-x/ut.airPitchAccel,-1,1),c}var yr=class{constructor(t,e,n=!1){this.dx=t,this.dy=e,this.t=0,this.boost=n}update(t,e,n){return this.t+=t,e.throttle=1,e.boost=this.boost&&this.t<.5,this.t<.07?e.jump=!0:this.t<.1?e.jump=!1:this.t<.14?(e.jump=!0,e.pitch=this.dx,e.yaw=this.dy):e.pitch=this.dx*.3,this.t>.35&&n.onGround?!0:this.t>1.3}},Ru=class{constructor(t,e,n){this.bot=t,this.target=e.clone(),this.arrival=n,this.t=0,this.dodged=!1}update(t,e,n,i){this.t+=t,e.throttle=1;let r=i.ball;if(this.t<.2)return e.jump=!0,!1;if(!this.dodged){let a=wn(n,r.pos),o=n.pos.distanceTo(r.pos);return o<2.6||this.t>.9?(n.canDodge()&&o<3.2&&(e.jump=!0,e.pitch=Math.cos(a.angle),e.yaw=Math.sin(a.angle)),this.dodged=!0):(n.forward(Dn),Pu(n,e,Dn.set(r.pos.x-n.pos.x,0,r.pos.z-n.pos.z),new w(0,1,0))),!1}return n.onGround&&this.t>.4?!0:this.t>2}},Cu=class{constructor(t,e){this.target=t.clone(),this.arrival=e,this.t=0}update(t,e,n,i){this.t+=t;let r=this.arrival-i.time;if(r<-.25||this.t>4.5||n.onGround&&this.t>.3||i.ball.lastTouch&&i.ball.lastTouch.time>i.time-.05&&this.t>.3)return!0;let a=Math.max(r,.08);Ic.y=ut.gravity;let o=Dn.copy(this.target).sub(n.pos).addScaledVector(n.vel,-a).multiplyScalar(2/(a*a)).sub(Ic),c=o.length(),l=o.clone().normalize();if(this.t<.2)e.jump=!0;else if(this.t<.24)e.jump=!1;else if(this.t<.28&&!n.hasDoubleJumped)return e.jump=!0,e.boost=!0,!1;let h=new w(0,1,0),d=Pu(n,e,l,h);return n.forward(Za),e.boost=c>1.2&&Za.dot(l)>.85&&n.boost>0,this.t<.2&&d>.6&&(e.boost=!1),!1}},Ka=class{constructor(t,e="pro"){this.car=t,this.d=Ga[e]||Ga.pro,this.maneuver=null,this.plan=null,this.planTimer=0,this.aimOffset=0,this.stuckTime=0,this.reach=new Float32Array(260)}update(t,e){let n=this.car,i=n.controls,r=i.jump;if(wp(i),n.demolished){this.maneuver=null;return}if(e.state==="countdown"){this.maneuver=null,this.plan=null;return}if(!(e.state!=="playing"&&e.state!=="goal")){if(this.maneuver){if(!this.maneuver.update(t,i,n,e,this))return;this.maneuver=null,wp(i)}if(this.planTimer-=t,(this.planTimer<=0||!this.plan)&&(this.plan=this.makePlan(e),this.planTimer=this.d.reaction+Math.random()*.05),!n.onGround){this.recover(i,n),r&&n.jumping&&(i.jump=!0);return}this.execute(t,i,e),this.unstick(t,i,n)}}unstick(t,e,n){!(n.vel.length()>1.5)&&Math.abs(e.throttle)>.5?this.stuckTime+=t:this.stuckTime=0,this.stuckTime>1.2&&(this.stuckTime=0,this.maneuver=new yr(-1,0)),n.onGround&&n.groundNormal.y<.35&&n.groundTime>.8&&this.plan&&this.plan.target&&this.plan.target.y<3&&(this.maneuver=new yr(0,0),this.maneuver.update=function(a,o,c){return this.t+=a,o.jump=this.t<.12,o.throttle=1,this.t>.25&&(c.onGround||this.t>1.5)})}recover(t,e){e.vel.lengthSq();let n=Dn.set(e.vel.x,0,e.vel.z);n.lengthSq()<1&&e.forward(n).setY(0),n.lengthSq()<1e-4&&n.set(1,0,0),Pu(e,t,n.clone(),new w(0,1,0)),t.throttle=1}computeReach(){let t=this.car,e=Math.max(0,Au(t)),n=this.d.boostUse>.3?t.boost:0,i=0,r=1/60;for(let a=0;a<this.reach.length;a++){let o=Ky(e);n>0&&(o+=ut.boostAccel,n-=ut.boostPerSecond*r),e=Math.min(ut.carMaxSpeed*this.d.speed,e+o*r),i+=e*r,this.reach[a]=i}}reachIn(t){let e=Math.floor(t*60);return e<0?0:this.reach[Math.min(e,this.reach.length-1)]}findIntercept(t,e){let n=this.car;Ic.y=ut.gravity,this.computeReach();let i=t.prediction,r=5+this.d.aerial*10;for(let a=0;a<i.length;a+=2){let o=i[a],c=o.pos.y,l=wn(n,o.pos),h=Math.abs(l.angle)*.32,d=Math.max(0,l.dist-1.4);if(c<1.9){if(this.reachIn(o.t-h)>=d)return{slice:o,kind:"ground"}}else if(c<3.3&&this.d.flips>.5){if(this.reachIn(o.t-h-.15)>=d)return{slice:o,kind:"jump"}}else if(e&&c<r&&n.boost>25&&o.t>.6){let u=o.t,f=Dn.copy(o.pos).sub(n.pos).addScaledVector(n.vel,-u);f.y-=3*u,f.multiplyScalar(2/(u*u)).sub(Ic);let m=n.boost/ut.boostPerSecond;if(f.length()<ut.boostAccel*.8&&m>u*.8&&Math.abs(l.angle)<.5)return{slice:o,kind:"aerial"}}}return null}makePlan(t){let e=this.car,n=t.ball,i=e.team,r=i===0?1:-1,a=yu(i);this.aimOffset=(Math.random()-.5)*(1-this.d.aim)*12;let o=t.cars.filter(f=>f.team===i&&!f.demolished);if(t.kickoff&&n.vel.lengthSq()<.01&&Math.abs(n.pos.x)+Math.abs(n.pos.z)<.1){let m=o.slice().sort((x,g)=>{let p=x.pos.length()-g.pos.length();return Math.abs(p)>.5?p:g.pos.x*r-x.pos.x*r}).indexOf(e);return m===0?{kind:"kickoff"}:m===1?this.boostPlan(t,!0)||{kind:"defend"}:{kind:"defend"}}let c=Pc(t.prediction,3),l=c&&c.team!==i,h=null,d=1/0;for(let f of o){let m=(n.pos.z-f.pos.z)*r>-1,x=f.pos.distanceTo(n.pos)+(m?0:18);f.isBot||(x-=4),f===e&&(x-=1),x<d&&(d=x,h=f)}if(h===e||l&&this.closestToGoal(o,a)===e){let f=this.findIntercept(t,this.d.aerial>0&&(!l||this.d.aerial>.7));if(!f)return{kind:"chase"};let m=f.slice.pos;if(!((m.z-e.pos.z)*r>.5)&&!l){let g=e.pos.x>m.x?1:-1,p=m.z-r*9;return{kind:"rotate",target:new w(_n(m.x+g*6,-ee.W+4,ee.W-4),0,_n(p,-ee.L+3,ee.L-3))}}return f.kind==="aerial"?{kind:"aerial",target:m.clone(),arrival:t.time+f.slice.t}:{kind:"attack",ball:m.clone(),arrival:t.time+f.slice.t,jump:f.kind==="jump",save:l,allowBoost:Math.random()<this.d.boostUse}}if(e.boost<40&&!l){let f=this.boostPlan(t,!1);if(f)return f}if(!l&&this.d.aerial>.7&&e.boost>45&&t.time-(this.lastDemoTry||-99)>12&&Math.random()<.05){this.lastDemoTry=t.time;let f=null,m=30;for(let x of t.cars){if(x.team===i||x.demolished)continue;let g=wn(e,x.pos);Math.abs(g.angle)<.5&&g.dist<m&&(m=g.dist,f=x)}if(f)return{kind:"demo",prey:f,until:t.time+3}}if(o.filter(f=>f!==h).indexOf(e)===0&&o.length>2){let f=n.pos.clone().lerp(new w(0,0,a),.45);return f.x=_n(f.x-Math.sign(n.pos.x||1)*6,-ee.W+6,ee.W-6),f.y=0,{kind:"support",target:f}}return{kind:"defend"}}closestToGoal(t,e){let n=null,i=1/0;for(let r of t){let a=Math.abs(r.pos.z-e)+Math.abs(r.pos.x)*.5;a<i&&(i=a,n=r)}return n}boostPlan(t,e){let n=this.car,i=n.team===0?1:-1,r=null,a=1/0;for(let o of t.pads){if(!o.big||!o.active)continue;let c=o.pos.z*i<=.1,l=n.pos.distanceTo(o.pos)+(c?0:25)+(e&&Math.abs(o.pos.z)<1?50:0);l<a&&(a=l,r=o)}return!r||!e&&a>45?null:{kind:"boost",target:r.pos.clone()}}execute(t,e,n){let i=this.car,r=this.plan,a=n.ball,o=i.team,c=o===0?1:-1,l=yu(o),h=Au(i);switch(r.kind){case"kickoff":{let d=wn(i,a.pos),u=Dn.copy(a.pos);if(u.z-=c*.9,this.driveTo(e,u,23,!0),d.dist<1.7+h*.17&&h>10){let f=d.angle;this.maneuver=new yr(Math.cos(f),_n(Math.sin(f)*1.5,-1,1),!0)}break}case"attack":{let d=r.ball,u=Math.max(r.arrival-n.time,.02);if(r.arrival<n.time-.3){this.planTimer=0;break}let f=-l,m=_n(d.x*.25+this.aimOffset,-ee.GW+1.8,ee.GW-1.8);r.save&&Math.abs(d.z-l)<25&&(m=d.x>0?ee.W:-ee.W);let x=Za.set(m-d.x,0,f+c*3-d.z).normalize(),g=wn(i,d),p=_n(g.dist*.4,1.3,7),M=new w(d.x-x.x*p,0,d.z-x.z*p);(Math.abs(M.x)>ee.W-1.5||Math.abs(M.z)>ee.L-1.5)&&M.set(d.x,0,d.z);let y=wn(i,M).dist/u+2;g.dist>25&&(y=23),this.driveTo(e,M,y*this.d.speed,r.allowBoost),i.forward(Mr);let T=Mr.x*x.x+Mr.z*x.z;if(r.jump){let E=Math.hypot(d.x-i.pos.x,d.z-i.pos.z);u<.55&&E<h*u+2.2&&Math.abs(g.angle)<.5&&(this.maneuver=new Ru(this,d,r.arrival))}else if(i.pos.distanceTo(a.pos)<2.4+h*.13&&a.pos.y<2&&Math.abs(g.angle)<.35&&T>.55&&h>7&&Math.random()<this.d.flips*.25){let C=wn(i,a.pos).angle;this.maneuver=new yr(Math.cos(C),_n(Math.sin(C)*1.6,-1,1))}break}case"aerial":{let d=wn(i,r.target);Math.abs(d.angle)<.25||r.arrival-n.time<1.2?this.maneuver=new Cu(r.target,r.arrival):this.driveTo(e,Dn.set(r.target.x,0,r.target.z),10,!1);break}case"rotate":case"support":case"boost":{let d=wn(i,r.target),u=r.kind==="support"?_n(d.dist*1.2,4,23):23;this.driveTo(e,r.target,u,r.kind!=="support"&&this.d.boostUse>.5),d.dist<2&&(this.planTimer=0);break}case"demo":{let d=r.prey;if(d.demolished||n.time>r.until){this.planTimer=0;break}let u=Math.min(1.5,i.pos.distanceTo(d.pos)/Math.max(10,h)),f=Dn.copy(d.pos).addScaledVector(d.vel,u);f.y=0,this.driveTo(e,f,23,!0),e.boost=i.boost>0&&Math.abs(wn(i,f).angle)<.35,this.planTimer=Math.max(this.planTimer,.3);break}case"chase":{this.driveTo(e,Dn.set(a.pos.x,0,a.pos.z-c*3),16,!1);break}default:{let d=a.pos.x>0?-1:1,u=Dn.set(d*3.5,0,l+c*3.5),f=wn(i,u);if(f.dist>4)this.driveTo(e,u,_n(f.dist*1.1,5,23),f.dist>25);else{let m=wn(i,a.pos);e.steer=_n(m.angle*2.5,-1,1),e.throttle=Math.abs(m.angle)>.3?.35:h>.5?-.3:0,Math.abs(m.angle)>2.2&&(e.throttle=-.4),this.planTimer=Math.min(this.planTimer,.2)}break}}}driveTo(t,e,n,i){let r=this.car,a=wn(r,e),o=Au(r);t.steer=_n(a.angle*3.2,-1,1),t.handbrake=Math.abs(a.angle)>1.6&&o>7&&a.dist>2.5,n>o+.3?t.throttle=1:n<o-3?t.throttle=-1:t.throttle=.1,Math.abs(a.angle)>2.4&&a.dist<6&&o<4&&(t.throttle=-1,t.steer=-t.steer),t.boost=i&&r.boost>0&&Math.abs(a.angle)<.3&&n>o+1.5&&o<ut.carMaxSpeed-.3&&r.groundNormal.y>.7}};function Nn(s,t){let e=document.createElement("canvas");return e.width=s,e.height=t,[e,e.getContext("2d")]}function Yi(s,t=!1){let e=new gi(s);return e.colorSpace=Ge,e.anisotropy=8,t&&(e.wrapS=e.wrapT=pi),e}function jy(s,t,e,n,i,r){s.beginPath(),s.moveTo(t+r,e),s.lineTo(t+n-r,e),s.arcTo(t+n,e,t+n,e+r,r),s.lineTo(t+n,e+i-r),s.arcTo(t+n,e+i,t+n-r,e+i,r),s.lineTo(t+r,e+i),s.arcTo(t,e+i,t,e+i-r,r),s.lineTo(t,e+r),s.arcTo(t,e,t+r,e,r),s.closePath()}function Ap(s){let{W:t,L:e,RC:n,GW:i}=ee,r=20,a=Math.round(t*2*r),o=Math.round(e*2*r),[c,l]=Nn(a,o),h=g=>(g+t)*r,d=g=>(e-g)*r;l.fillStyle=s.grassA,l.fillRect(0,0,a,o);let u=16;for(let g=0;g<u;g++)g%2||(l.fillStyle=s.grassB,l.fillRect(0,o/u*g,a,o/u));let f=l.createLinearGradient(0,0,0,o);f.addColorStop(0,"rgba(255,120,20,0.20)"),f.addColorStop(.45,"rgba(255,120,20,0.0)"),f.addColorStop(.55,"rgba(40,110,255,0.0)"),f.addColorStop(1,"rgba(40,110,255,0.22)"),l.fillStyle=f,l.fillRect(0,0,a,o);for(let g=0;g<26e3;g++){let p=Math.random()*.06;l.fillStyle=Math.random()<.5?`rgba(0,0,0,${p})`:`rgba(255,255,255,${p})`,l.fillRect(Math.random()*a,Math.random()*o,2+Math.random()*3,2+Math.random()*3)}l.strokeStyle="rgba(255,255,255,0.85)",l.lineWidth=.28*r;let m=3.4;jy(l,h(-t+m),d(e-m),(t-m)*2*r,(e-m)*2*r,(n-2)*r),l.stroke(),l.beginPath(),l.moveTo(h(-t+m),d(0)),l.lineTo(h(t-m),d(0)),l.stroke(),l.beginPath(),l.arc(h(0),d(0),10*r,0,Math.PI*2),l.stroke(),l.beginPath(),l.arc(h(0),d(0),.9*r,0,Math.PI*2),l.fillStyle="rgba(255,255,255,0.85)",l.fill();for(let g of[1,-1]){let p=g*(e-m),M=i+6,S=11*g;l.beginPath(),l.moveTo(h(-M),d(p)),l.lineTo(h(-M+2),d(p-S)),l.lineTo(h(M-2),d(p-S)),l.lineTo(h(M),d(p)),l.stroke(),l.beginPath(),l.arc(h(0),d(p-S),5*r,g>0?0:Math.PI,g>0?Math.PI:Math.PI*2),l.stroke()}for(let g of fr())l.beginPath(),l.arc(h(g.pos.x),d(g.pos.z),(g.big?2.2:1.3)*r,0,Math.PI*2),l.fillStyle="rgba(20,20,20,0.35)",l.fill(),l.lineWidth=.12*r,l.strokeStyle="rgba(255,200,80,0.6)",l.stroke();l.save(),l.translate(h(0),d(0)),l.rotate(-Math.PI/2),l.font=`italic 900 ${3.2*r}px Arial Black, Arial, sans-serif`,l.textAlign="center",l.textBaseline="middle",l.fillStyle="rgba(255,255,255,0.22)",l.fillText("SUPERSONIC",0,-1.7*r),l.fillText("ARENA",0,1.9*r),l.restore();let x=Yi(c);return x.generateMipmaps=!0,x}function Rp(){let e=Math.round(Math.sqrt(3)*32),[n,i]=Nn(192,e*2);i.clearRect(0,0,192,e*2),i.strokeStyle="rgba(255,255,255,1)",i.lineWidth=2.2;let r=(a,o)=>{i.beginPath();for(let c=0;c<=6;c++){let l=Math.PI/3*c,h=a+Math.cos(l)*(32-1.5),d=o+Math.sin(l)*(e/2-1.5);c===0?i.moveTo(h,d):i.lineTo(h,d)}i.stroke()};for(let a=-1;a<6;a++)for(let o=-1;o<4;o++)r(a*1.5*32,o*e+(a%2?e/2:0));return Yi(n,!0)}function Cp(){let[s,t]=Nn(128,128);t.clearRect(0,0,128,128),t.strokeStyle="rgba(255,255,255,0.9)",t.lineWidth=3;for(let e=0;e<=128;e+=32)t.beginPath(),t.moveTo(e,0),t.lineTo(e,128),t.stroke(),t.beginPath(),t.moveTo(0,e),t.lineTo(128,e),t.stroke();return Yi(s,!0)}function Pp(){let[s,t]=Nn(256,128);t.fillStyle="#9aa3b5",t.fillRect(0,0,256,128),t.strokeStyle="rgba(40,45,60,0.8)",t.lineWidth=3,t.strokeRect(2,2,252,124),t.fillStyle="rgba(255,255,255,0.08)";for(let e=0;e<6;e++)t.fillRect(12+e*40,20,24,88);return Yi(s,!0)}function Ip(){let[e,n]=Nn(1024,512),[i,r]=Nn(1024,512),a=(1+Math.sqrt(5))/2,o=[],c=u=>{let f=Math.hypot(...u);return u.map(m=>m/f)},l=[];for(let u of[-1,1])for(let f of[-1,1])l.push([0,u,f*a],[u,f*a,0],[f*a,0,u]);for(let u of l)o.push({d:c(u),pent:!0});for(let u of[-1,1])for(let f of[-1,1])for(let m of[-1,1])o.push({d:c([u,f,m]),pent:!1});for(let u of[-1,1])for(let f of[-1,1])o.push({d:c([0,u/a,f*a]),pent:!1}),o.push({d:c([u/a,f*a,0]),pent:!1}),o.push({d:c([f*a,0,u/a]),pent:!1});let h=n.createImageData(1024,512),d=r.createImageData(1024,512);for(let u=0;u<512;u++){let f=(u+.5)/512*Math.PI,m=Math.sin(f),x=Math.cos(f);for(let g=0;g<1024;g++){let p=(g+.5)/1024*Math.PI*2,M=-Math.cos(p)*m,S=x,y=Math.sin(p)*m,T=-2,E=-2,C=null;for(let L of o){let X=M*L.d[0]+S*L.d[1]+y*L.d[2];X>T?(E=T,T=X,C=L):X>E&&(E=X)}let v=T-E,A=(u*1024+g)*4,I,D,B;C.pent?(I=58,D=62,B=72):(I=214,D=219,B=226);let V=Math.min(1,v*18);I*=.55+.45*V,D*=.55+.45*V,B*=.55+.45*V,h.data[A]=I,h.data[A+1]=D,h.data[A+2]=B,h.data[A+3]=255;let P=v<.012?1:0;d.data[A]=P*90,d.data[A+1]=P*200,d.data[A+2]=P*255,d.data[A+3]=255}}return n.putImageData(h,0,0),r.putImageData(d,0,0),{map:Yi(e),emissiveMap:Yi(i)}}function Lp(){let[s,t]=Nn(1024,512),e=64,n=["#2f7bff","#ff8a1f","#f2f2f2","#3a4152","#7fa8ff","#ffb56b","#c23b3b","#26282f","#f5d547","#2ea86b"],i=["#f1c9a5","#d9a47a","#a8744f","#6f4a33","#e8b894"];for(let a=0;a<8;a++){let o=a*e,c=t.createLinearGradient(0,o,0,o+e);c.addColorStop(0,"#2a2e38"),c.addColorStop(.7,"#1a1d24"),c.addColorStop(1,"#0e1014"),t.fillStyle=c,t.fillRect(0,o,1024,e),t.fillStyle="rgba(255,255,255,0.06)",t.fillRect(0,o+e-6,1024,2);for(let l=6+a%2*14;l<1024;l+=28){if(Math.random()<.12){t.fillStyle="#3b3f4a",t.fillRect(l,o+30,20,26);continue}let h=Math.random()<.15?-8:0;t.fillStyle=n[Math.random()*n.length|0],t.beginPath(),t.moveTo(l,o+58+h),t.quadraticCurveTo(l+11,o+18+h,l+22,o+58+h),t.fill(),t.fillStyle=i[Math.random()*i.length|0],t.beginPath(),t.arc(l+11,o+20+h,7,0,Math.PI*2),t.fill(),Math.random()<.2&&(t.strokeStyle=t.fillStyle,t.lineWidth=4,t.beginPath(),t.moveTo(l+4,o+34+h),t.lineTo(l-2,o+12+h),t.moveTo(l+18,o+34+h),t.lineTo(l+24,o+12+h),t.stroke())}}let r=Yi(s,!0);return r.anisotropy=16,r}function Dp(){let t=new Float32Array(65536);for(let c=0;c<t.length;c++)t[c]=Math.random();let e=c=>{let l=new Float32Array(65536);for(let h=0;h<256;h++)for(let d=0;d<256;d++){let u=0;for(let f=-1;f<=1;f++)for(let m=-1;m<=1;m++)u+=c[(h+f+256)%256*256+(d+m+256)%256];l[h*256+d]=u/9}return l},n=e(e(t)),[i,r]=Nn(256,256),a=r.createImageData(256,256);for(let c=0;c<256;c++)for(let l=0;l<256;l++){let h=n[c*256+(l+1)%256]-n[c*256+(l-1+256)%256],d=n[(c+1)%256*256+l]-n[(c-1+256)%256*256+l],u=-h*6,f=-d*6,m=Math.hypot(u,f,1),x=(c*256+l)*4;a.data[x]=(u/m*.5+.5)*255,a.data[x+1]=(f/m*.5+.5)*255,a.data[x+2]=(1/m*.5+.5)*255,a.data[x+3]=255}r.putImageData(a,0,0);let o=new gi(i);return o.wrapS=o.wrapT=pi,o.anisotropy=8,o}function Np(){let[s,t]=Nn(128,64);t.save(),t.scale(1,.5);let e=t.createRadialGradient(64,64,4,64,64,62);return e.addColorStop(0,"rgba(0,0,0,0.85)"),e.addColorStop(.55,"rgba(0,0,0,0.5)"),e.addColorStop(1,"rgba(0,0,0,0)"),t.fillStyle=e,t.fillRect(0,0,128,128),t.restore(),new gi(s)}function Up(){let[s,t]=Nn(64,64),e=t.createRadialGradient(32,32,0,32,32,32);return e.addColorStop(0,"rgba(0,0,0,0.75)"),e.addColorStop(.6,"rgba(0,0,0,0.45)"),e.addColorStop(1,"rgba(0,0,0,0)"),t.fillStyle=e,t.fillRect(0,0,64,64),new gi(s)}function Fp(s,t){let[e,n]=Nn(256,64);n.font="bold 34px Segoe UI, Arial, sans-serif",n.textAlign="center",n.textBaseline="middle",n.lineWidth=6,n.strokeStyle="rgba(0,0,0,0.7)",n.strokeText(s,128,32),n.fillStyle=t,n.fillText(s,128,32);let i=new gi(e);i.colorSpace=Ge;let r=new Xs({map:i,depthTest:!1,transparent:!0,sizeAttenuation:!1}),a=new jr(r);return a.scale.set(.16,.04,1),a.renderOrder=10,a}function Bp(s){let[t,e]=Nn(512,256),n=s===0?["#0b2d7a","#2f7bff"]:["#7a2c05","#ff8a1f"],i=e.createLinearGradient(0,0,512,256);return i.addColorStop(0,n[0]),i.addColorStop(1,n[1]),e.fillStyle=i,e.fillRect(0,0,512,256),e.font="italic 900 70px Arial Black, Arial, sans-serif",e.textAlign="center",e.textBaseline="middle",e.fillStyle="rgba(255,255,255,0.92)",e.fillText(s===0?"BLEU":"ORANGE",256,128),Yi(t)}var{W:on,L:pe,H:bi,RC:Iu,RV:Se,GW:Qe,GH:an,GD:pn}=ee,Op=new lt(3111935),zp=new lt(16747039),kp=new lt(16777215),Lu=class{constructor(){this.pos=[],this.nor=[],this.uv=[],this.col=[],this.idx=[],this.groups=[],this.cur=null}vertex(t,e,n,i,r=kp){return this.pos.push(t.x,t.y,t.z),this.nor.push(e.x,e.y,e.z),this.uv.push(n,i),this.col.push(r.r,r.g,r.b),this.pos.length/3-1}group(t){this.cur&&this.cur.mat===t||(this.cur={start:this.idx.length,count:0,mat:t},this.groups.push(this.cur))}tri(t,e,n){let i=this.pos,r=i[t*3],a=i[t*3+1],o=i[t*3+2],c=i[e*3]-r,l=i[e*3+1]-a,h=i[e*3+2]-o,d=i[n*3]-r,u=i[n*3+1]-a,f=i[n*3+2]-o,m=l*f-h*u,x=h*d-c*f,g=c*u-l*d,p=this.nor;m*(p[t*3]+p[e*3]+p[n*3])+x*(p[t*3+1]+p[e*3+1]+p[n*3+1])+g*(p[t*3+2]+p[e*3+2]+p[n*3+2])>=0?this.idx.push(t,e,n):this.idx.push(t,n,e),this.cur.count+=3}quad(t,e,n,i){this.tri(t,e,n),this.tri(t,n,i)}build(){let t=new ge;return t.setAttribute("position",new qt(this.pos,3)),t.setAttribute("normal",new qt(this.nor,3)),t.setAttribute("uv",new qt(this.uv,2)),t.setAttribute("color",new qt(this.col,3)),t.setIndex(this.idx),t}};function br(s,t=1){let e=dn.smoothstep(s,-12,12),n=Op.clone().lerp(zp,e);return kp.clone().lerp(n,t)}function Qy(){let s=on-Se,t=pe-Se,e=Iu-Se,n=[],i=(c,l,h,d,u)=>n.push({x:c,z:l,nx:h,nz:d,back:u}),r=(c,l,h,d,u,f,m,x=[])=>{let g=Math.hypot(h-c,d-l),p=Math.ceil(g/2.5),M=new Set;for(let S=0;S<p;S++)M.add(S/p);for(let S of x)M.add((S-c)/(h-c));[...M].sort((S,y)=>S-y).forEach(S=>i(c+(h-c)*S,l+(d-l)*S,u,f,m))},a=(c,l,h,d)=>{for(let f=0;f<12;f++){let m=h+(d-h)*f/12;i(c+Math.cos(m)*e,l+Math.sin(m)*e,Math.cos(m),Math.sin(m),0)}};r(s,-(t-e),s,t-e,1,0,0),a(s-e,t-e,0,Math.PI/2),r(s-e,t,-(s-e),t,0,1,1,[Qe,-Qe]),a(-(s-e),t-e,Math.PI/2,Math.PI),r(-s,t-e,-s,-(t-e),-1,0,0),a(-(s-e),-(t-e),Math.PI,Math.PI*1.5),r(-(s-e),-t,s-e,-t,0,-1,-1,[-Qe,Qe]),a(s-e,-(t-e),Math.PI*1.5,Math.PI*2),n.push({...n[0]});let o=0;for(let c=0;c<n.length;c++)c>0&&(o+=Math.hypot(n[c].x-n[c-1].x,n[c].z-n[c-1].z)),n[c].s=o;return n}function tM(){let s=[];for(let i=0;i<=10;i++){let r=i/10*Math.PI/2;s.push({o:Se*Math.sin(r),y:Se*(1-Math.cos(r)),no:-Math.sin(r),ny:Math.cos(r)})}for(let i of[4.1,4.5,an,9,12,15,bi-Se-.45,bi-Se])s.push({o:Se,y:i,no:-1,ny:0});let e=8;for(let i=1;i<=e;i++){let r=i/e*Math.PI/2;s.push({o:Se*Math.cos(r),y:bi-Se+Se*Math.sin(r),no:-Math.cos(r),ny:-Math.sin(r)})}let n=0;for(let i=0;i<s.length;i++)i>0&&(n+=Math.hypot(s[i].o-s[i-1].o,s[i].y-s[i-1].y)),s[i].v=n;return s}function eM(s,t,e){let n=new Li;return n.moveTo(-s+e,-t),n.lineTo(s-e,-t),n.absarc(s-e,-t+e,e,-Math.PI/2,0,!1),n.lineTo(s,t-e),n.absarc(s-e,t-e,e,0,Math.PI/2,!1),n.lineTo(-s+e,t),n.absarc(-s+e,t-e,e,Math.PI/2,Math.PI,!1),n.lineTo(-s,-t+e),n.absarc(-s+e,-t+e,e,Math.PI,Math.PI*1.5,!1),n}function Vp(s,t){let e=new Ne,n=Rp(),i={ramp:new Re({color:16777215,vertexColors:!0,roughness:.55,metalness:.35,map:Pp()}),stripe:new fe({vertexColors:!0,toneMapped:!1}),glass:new Re({color:9419007,vertexColors:!0,transparent:!0,opacity:s.glassOpacity,roughness:.1,metalness:.6,depthWrite:!1,side:Oe})};i.ramp.map.repeat.set(1/4,1/4),i.ramp.map.wrapS=i.ramp.map.wrapT=pi;let r=Qy(),a=tM(),o=new Lu,c=[],l=new w,h=new w;for(let P=0;P<r.length;P++){let L=r[P],X=[];for(let k=0;k<a.length;k++){let Z=a[k];l.set(L.x+L.nx*Z.o,Z.y,L.z+L.nz*Z.o),h.set(L.nx*Z.no,Z.ny,L.nz*Z.no);let z;Z.y>4.05&&Z.y<4.55?z=br(l.z,1).multiplyScalar(1.6):Z.y>bi-Se-.5&&Z.y<bi-Se+.05?z=br(l.z,.7).multiplyScalar(1.3):Z.y<=4.1?z=br(l.z,.35):z=br(l.z,.8),X.push(o.vertex(l,h,L.s/4,Z.v/4,z))}c.push(X)}let d=P=>r[P].back!==0&&Math.abs(r[P].x)<=Qe+1e-6,u=[{mat:0,test:(P,L)=>L.y<=4.1+1e-6},{mat:1,test:(P,L)=>P.y>=4.1-1e-6&&L.y<=4.5+1e-6},{mat:1,test:(P,L)=>P.y>=bi-Se-.45-1e-6&&L.y<=bi-Se+1e-6},{mat:2,test:(P,L)=>P.y>=4.5-1e-6&&!(P.y>=bi-Se-.45-1e-6&&L.y<=bi-Se+1e-6)}];for(let P of u){o.group(P.mat);for(let L=0;L<r.length-1;L++){let X=d(L)&&d(L+1)&&r[L].back===r[L+1].back;for(let k=0;k<a.length-1;k++)P.test(a[k],a[k+1])&&(X&&a[k+1].y<=an+1e-6||o.quad(c[L][k],c[L+1][k],c[L+1][k+1],c[L][k+1]))}}o.group(0);for(let P of[1,-1])for(let L of[1,-1]){h.set(-L,0,0);let X=o.vertex(l.set(L*Qe,0,P*pe),h,0,0,br(P*pe,.35)),k=[];for(let Z=0;Z<=10;Z++){let z=Z/10*Math.PI/2;k.push(o.vertex(l.set(L*Qe,Se*(1-Math.cos(z)),P*(pe-Se+Se*Math.sin(z))),h,0,0,br(P*pe,.35)))}for(let Z=0;Z<10;Z++)o.tri(X,k[Z],k[Z+1])}let f=o.build();for(let P of o.groups)f.addGroup(P.start,P.count,P.mat);let m=new Tt(f,[i.ramp,i.stripe,i.glass]);m.receiveShadow=t.shadows,e.add(m);let x=f.clone();x.clearGroups();let g=o.groups.filter(P=>P.mat===2);for(let P of g)x.addGroup(P.start,P.count,0);let p=x.getAttribute("uv");for(let P=0;P<p.count;P++)p.setXY(P,p.getX(P)*.5,p.getY(P)*.5);let M=new fe({map:n,vertexColors:!0,transparent:!0,opacity:s.hexOpacity,blending:gn,depthWrite:!1,side:Oe,toneMapped:!1});e.add(new Tt(x,[M]));let S=Ap(s),y=eM(on-Se,pe-Se,Iu-Se),T=new xa(y,24);T.rotateX(-Math.PI/2);let E=T.getAttribute("position"),C=T.getAttribute("uv");for(let P=0;P<E.count;P++)C.setXY(P,(E.getX(P)+on)/(2*on),(E.getZ(P)+pe)/(2*pe));T.computeVertexNormals();let v=Dp();v.repeat.set(70,88);let A=new Re({map:S,roughness:.86,metalness:0,normalMap:v,normalScale:new it(.16,.16),envMapIntensity:.35}),I=new Tt(T,A);I.receiveShadow=t.shadows,e.add(I);let D=Cp();for(let P of[0,1]){let L=P===0?-1:1,X=P===0?Op:zp,k=new Ne,Z=new Tt(new je(Qe*2,Se+pn),new Re({color:1711396,roughness:.9}));Z.rotation.x=-Math.PI/2,Z.position.set(0,.002,L*(pe-Se+(Se+pn)/2)),Z.receiveShadow=t.shadows,k.add(Z);let z=new Re({color:X.clone().multiplyScalar(.12),roughness:.8,side:Oe}),q=new fe({map:D,color:X,transparent:!0,opacity:.8,blending:gn,depthWrite:!1,side:Oe,toneMapped:!1}),$=(Bt,yt,zt,ce,et,rt,at)=>{let ot=new je(Bt,yt),ht=new Tt(ot,z);ht.position.copy(zt),ht.rotation.set(et,ce,0),k.add(ht);let Ot=D.clone();Ot.repeat.set(rt,at),Ot.needsUpdate=!0;let It=new Tt(ot,q.clone());It.material.map=Ot,It.position.copy(zt).multiplyScalar(1),It.rotation.copy(ht.rotation),It.translateZ(.06),k.add(It)};$(Qe*2,an,new w(0,an/2,L*(pe+pn)),L>0?Math.PI:0,0,Qe*2/1.6,an/1.6),$(pn,an,new w(Qe,an/2,L*(pe+pn/2)),-Math.PI/2,0,pn/1.6,an/1.6),$(pn,an,new w(-Qe,an/2,L*(pe+pn/2)),Math.PI/2,0,pn/1.6,an/1.6);let mt=new Tt(new je(Qe*2,pn),z);mt.rotation.x=Math.PI/2,mt.position.set(0,an,L*(pe+pn/2)),k.add(mt);let ft=new fe({color:X.clone().multiplyScalar(2.2),toneMapped:!1}),Gt=.22,Wt=new Tt(new _e(Gt,an+Gt,Gt),ft);Wt.position.set(Qe+Gt/2,an/2,L*(pe-.05));let jt=Wt.clone();jt.position.x=-Qe-Gt/2;let J=new Tt(new _e(Qe*2+Gt*2,Gt,Gt),ft);J.position.set(0,an+Gt/2,L*(pe-.05)),k.add(Wt,jt,J);let Q=new Tt(new _e((on-Iu)*2-2,.16,.08),ft);Q.position.set(0,an+1.6,L*(pe-.03)),k.add(Q);let dt=new Tt(new je(Qe*2,.35),ft);dt.rotation.x=-Math.PI/2,dt.position.set(0,.01,L*(pe+.9)),k.add(dt),e.add(k)}let B=iM(s);e.add(B);let V=nM();return e.add(V.group),{group:e,updatePads:V.update}}function nM(){let s=new Ne,t=fr(),e=[],n=new mn(.62,.72,.08,24),i=new mn(1.25,1.45,.12,32),r=new ma(.5,2),a=new xi(1.1,.06,8,40);for(let h of t){let d=new fe({color:new lt(16758062).multiplyScalar(h.big?2.2:1.6),toneMapped:!1}),u=new Re({color:3354666,roughness:.5,metalness:.6,emissive:16752922,emissiveIntensity:.5}),f={pad:null,base:null,orb:null,ring:null,on:d,baseMat:u,phase:Math.random()*6};h.big?(f.base=new Tt(i,u),f.base.position.set(h.pos.x,.06,h.pos.z),f.orb=new Tt(r,d),f.orb.position.set(h.pos.x,1,h.pos.z),f.ring=new Tt(a,d),f.ring.rotation.x=Math.PI/2,f.ring.position.set(h.pos.x,.18,h.pos.z),s.add(f.base,f.orb,f.ring)):(f.base=new Tt(n,d),f.base.position.set(h.pos.x,.04,h.pos.z),s.add(f.base)),e.push(f)}let o=new Re({color:2763306,roughness:.7}),c=0;function l(h,d){c+=h,d.forEach((u,f)=>{let m=e[f];u.big?(m.orb.visible=u.active,m.ring.visible=u.active,m.orb.position.y=1+Math.sin(c*2+m.phase)*.15,m.orb.rotation.y+=h*1.5,m.baseMat.emissiveIntensity=u.active?.6:.05):m.base.material=u.active?m.on:o})}return{group:s,update:l}}function iM(s){let t=new Ne,e=new Tt(new je(900,900),new Re({color:s.outside,roughness:1}));e.rotation.x=-Math.PI/2,e.position.y=-.05,t.add(e);let n=Lp(),i=new Re({map:n,roughness:.9,color:s.crowdTint}),r=new Re({color:s.structure,roughness:.8,metalness:.2}),a=(x,g,p)=>{let M=new Li;M.moveTo(0,0),M.lineTo(g,p),M.lineTo(g+3,p),M.lineTo(g+3,0),M.closePath();let S=new pa(M,{depth:x,bevelEnabled:!1});S.translate(0,0,-x/2);let y=S.getAttribute("uv"),T=S.getAttribute("position");for(let C=0;C<y.count;C++)y.setXY(C,T.getZ(C)/14.4,(T.getX(C)+T.getY(C))/10);return new Tt(S,[r,i])},o=pe*2+10;for(let x of[1,-1]){let g=a(o,26,24);g.rotation.y=x>0?0:Math.PI,g.position.set(x*(on+6),2,0),t.add(g);let p=a(on*2+6,22,20);p.rotation.y=x>0?-Math.PI/2:Math.PI/2,p.position.set(0,2,x*(pe+pn+8)),t.add(p)}for(let x of[1,-1]){let g=new Tt(new _e(8,2.2,pe*2+pn*2+20),r);g.position.set(x*(on+3.5),1.1,0);let p=new Tt(new _e(on*2+15,2.2,10),r);p.position.set(0,1.1,x*(pe+pn+4.5)),t.add(g,p)}let c=new fe({color:new lt(s.lamp).multiplyScalar(2.5),toneMapped:!1});for(let x of[-1,1])for(let g of[-1,1]){let p=new Tt(new mn(.8,1.2,46,8),r);p.position.set(x*(on+38),23,g*(pe+30));let M=new Tt(new _e(10,5,1.5),c);M.position.set(x*(on+36),47,g*(pe+28)),M.lookAt(0,0,0),t.add(p,M)}for(let x of[0,1]){let g=x===0?-1:1,p=new Tt(new je(30,14),new fe({map:Bp(x),toneMapped:!1}));p.position.set(0,34,g*(pe+36)),p.rotation.y=g>0?Math.PI:0,t.add(p);let M=new Tt(new _e(31,15,1),r);M.position.set(0,34,g*(pe+36.6)),t.add(M)}let l=new fe({color:new lt(s.rim).multiplyScalar(1.5),toneMapped:!1}),h=new Re({color:new lt(s.structure).multiplyScalar(.7),roughness:.5,metalness:.7});for(let x of[1,-1]){let g=new Tt(new _e(30,.8,o+6),h);g.position.set(x*(on+24),33,0),g.rotation.z=x*.1,t.add(g);let p=new Tt(new _e(.5,.5,o+6),l);p.position.set(x*(on+9.2),31.2,0),t.add(p);for(let S=-pe;S<=pe;S+=9){let y=new Tt(new _e(1.4,.4,2.2),c);y.position.set(x*(on+10.5),31.6,S),t.add(y)}for(let S=-pe;S<=pe+1;S+=17){let y=new Tt(new mn(.5,.6,8,8),h);y.position.set(x*(on+37),30,S),t.add(y)}let M=new Tt(new _e(on*2+20,.6,.6),l);M.position.set(0,24,x*(pe+pn+32)),t.add(M)}let d=(()=>{let x=12345;return()=>(x=x*16807%2147483647)/2147483647})(),u=140,f=new na(new _e(1,1,1),new Re({color:s.skyline??3818064,roughness:.9,metalness:.1}),u),m=new oe;for(let x=0;x<u;x++){let g=x/u*Math.PI*2+d()*.03,p=280+d()*170,M=20+Math.pow(d(),2)*130,S=14+d()*26;m.compose(new w(Math.cos(g)*p,M/2-1,Math.sin(g)*p),new re().setFromAxisAngle(new w(0,1,0),-g),new w(S,M,10+d()*20)),f.setMatrixAt(x,m)}return t.add(f),t}var sM=`uniform vec3 top; uniform vec3 horizon; uniform vec3 bottom; uniform vec3 sunDir; uniform vec3 sunColor;
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
}`;function Hp(s){let t=new ts,e=Du(s);e.children[0].scale.setScalar(.3),t.add(e);let n=new Tt(new mn(160,110,70,32,1,!0),new fe({color:new lt(s.structure).multiplyScalar(.35),side:qe}));n.position.y=20,t.add(n);let i=new Tt(new ra(160,32),new fe({color:new lt(s.grassA).multiplyScalar(.5)}));i.rotation.x=-Math.PI/2,i.position.y=-8,t.add(i);let r=new fe({color:new lt(s.lamp).multiplyScalar(3)});for(let c=0;c<8;c++){let l=c/8*Math.PI*2+.4,h=new Tt(new je(26,8),r);h.position.set(Math.cos(l)*95,60,Math.sin(l)*95),h.lookAt(0,0,0),t.add(h)}let a=new fe({color:new lt(s.rim).multiplyScalar(2)}),o=new Tt(new xi(120,1.2,6,64),a);return o.rotation.x=Math.PI/2,o.position.y=30,t.add(o),t}function Du(s){let t=new is(1200,32,16),e=new we({side:qe,depthWrite:!1,uniforms:{top:{value:new lt(s.skyTop)},horizon:{value:new lt(s.skyHorizon)},bottom:{value:new lt(s.skyBottom)},sunDir:{value:new w(...s.sunDir).normalize()},sunColor:{value:new lt(s.sunGlow)},coverage:{value:s.clouds??.45},cloudColor:{value:new lt(s.cloudColor??16777215)}},vertexShader:"varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",fragmentShader:sM}),n=new Tt(t,e);n.renderOrder=-10;let i=new Ne;if(i.add(n),s.stars){let a=new Float32Array(4500);for(let c=0;c<1500;c++){let l=Math.random()*Math.PI*2,h=Math.random()*.9+.08,d=1100;a[c*3]=Math.cos(l)*Math.sqrt(1-h*h)*d,a[c*3+1]=h*d,a[c*3+2]=Math.sin(l)*Math.sqrt(1-h*h)*d}let o=new ge;o.setAttribute("position",new Ue(a,3)),i.add(new es(o,new Ys({color:16777215,size:2.2,sizeAttenuation:!1})))}return i}var ms={day:{label:"Stade (jour)",skyTop:3108816,skyHorizon:12574975,skyBottom:4872810,sunDir:[.35,.8,.25],sunGlow:16774096,sun:16774368,sunIntensity:1.9,hemiSky:13625087,hemiGround:3820080,hemiIntensity:.6,grassA:"#2f7d32",grassB:"#3a8f3c",outside:3885622,crowdTint:16777215,structure:10133674,lamp:16777215,rim:10406911,glassOpacity:.07,hexOpacity:.35,fog:12572912,exposure:1,clouds:.5,cloudColor:16777215,skyline:8885933},sunset:{label:"Coucher de soleil",skyTop:2366034,skyHorizon:16747594,skyBottom:2759210,sunDir:[-.6,.18,.5],sunGlow:16756848,sun:16761232,sunIntensity:1.7,hemiSky:16763296,hemiGround:2761792,hemiIntensity:.8,grassA:"#2c6e36",grassB:"#357d3d",outside:2762288,crowdTint:16767168,structure:5918816,lamp:16769200,rim:16751964,glassOpacity:.08,hexOpacity:.45,fog:8014416,exposure:1,clouds:.55,cloudColor:16753274,skyline:3812420},night:{label:"Nocturne",skyTop:132108,skyHorizon:1319498,skyBottom:329226,sunDir:[.2,.9,-.3],sunGlow:0,sun:14543103,sunIntensity:1.6,hemiSky:6981312,hemiGround:1054752,hemiIntensity:.45,grassA:"#1f5e2a",grassB:"#276b31",outside:856086,crowdTint:11581648,structure:3159103,lamp:15266047,rim:6987007,glassOpacity:.1,hexOpacity:.6,fog:659488,exposure:1.05,stars:!0,clouds:.35,cloudColor:1713216,skyline:790812}};var Gp={octane:{body:[[-.66,-.07,.07,.33],[-.62,-.12,.14,.395],[-.45,-.12,.17,.41],[0,-.12,.165,.41],[.3,-.12,.14,.405],[.52,-.11,.09,.39],[.64,-.08,.035,.35],[.675,-.04,0,.3]],cabin:[[-.54,.1,.13,.26],[-.5,.1,.2,.29],[-.32,.1,.33,.3],[-.05,.1,.345,.3],[.12,.1,.28,.305],[.28,.1,.16,.31],[.33,.1,.12,.3]],n:3.2,wheelR:[.17,.19],wheelX:[.37,-.36],wheelZ:.41,spoiler:[-.6,.27]},dominus:{body:[[-.72,-.06,.06,.33],[-.68,-.1,.13,.4],[-.4,-.1,.15,.415],[.1,-.1,.13,.415],[.45,-.1,.09,.4],[.66,-.08,.04,.36],[.73,-.04,0,.3]],cabin:[[-.62,.08,.12,.25],[-.56,.08,.18,.28],[-.35,.08,.27,.29],[-.1,.08,.275,.29],[.05,.08,.22,.3],[.2,.08,.13,.3],[.24,.08,.1,.29]],n:3.4,wheelR:[.16,.17],wheelX:[.42,-.43],wheelZ:.42,spoiler:[-.66,.2]},breakout:{body:[[-.74,-.05,.08,.32],[-.7,-.1,.15,.39],[-.45,-.1,.155,.4],[0,-.1,.12,.4],[.4,-.1,.06,.39],[.68,-.08,.01,.34],[.76,-.05,-.02,.28]],cabin:[[-.58,.07,.12,.23],[-.52,.07,.18,.26],[-.32,.07,.26,.27],[-.1,.07,.25,.27],[.1,.07,.16,.28],[.27,.07,.07,.27]],n:3,wheelR:[.15,.18],wheelX:[.45,-.44],wheelZ:.4,spoiler:[-.68,.23]},merc:{body:[[-.66,-.1,.12,.36],[-.62,-.15,.2,.42],[-.3,-.15,.21,.43],[.3,-.15,.2,.43],[.58,-.14,.14,.42],[.66,-.1,.08,.38],[.68,-.06,.02,.33]],cabin:[[-.6,.15,.2,.31],[-.56,.15,.4,.33],[-.2,.15,.43,.34],[.2,.15,.42,.34],[.34,.15,.3,.345],[.42,.15,.18,.34]],n:5,wheelR:[.19,.19],wheelX:[.38,-.38],wheelZ:.43,spoiler:null}};function Fu(s,t){let e=t*(s.length-1),n=Math.min(s.length-2,Math.floor(e)),i=e-n,r=s[Math.max(0,n-1)],a=s[n],o=s[n+1],c=s[Math.min(s.length-1,n+2)],l=[];for(let h=0;h<a.length;h++){let d=r[h],u=a[h],f=o[h],m=c[h];l.push(.5*(2*u+(-d+f)*i+(2*d-5*u+4*f-m)*i*i+(-d+3*u-3*f+m)*i*i*i))}return l}function Wp(s,{n:t=3.2,nBottom:e=7,taper:n=.12,rows:i=30,cols:r=28,classify:a=()=>0,groups:o=1}){let c=[],l=[];for(let f=0;f<i;f++){let m=.5-.5*Math.cos(f/(i-1)*Math.PI),[x,g,p,M]=Fu(s,m);l.push({x,yb:g,yt:p,hw:M,u:m});let S=(g+p)/2,y=Math.max(.005,(p-g)/2);for(let T=0;T<r;T++){let E=T/r*Math.PI*2,C=Math.cos(E),v=Math.sin(E),A=v>=0?t:e,I=M*Math.sign(C)*Math.pow(Math.abs(C),2/A),D=S+y*Math.sign(v)*Math.pow(Math.abs(v),2/A);I*=1-n*Math.max(0,(D-S)/y),c.push(x,D,I)}}let h=Array.from({length:o},()=>[]);for(let f=0;f<i-1;f++)for(let m=0;m<r;m++){let x=f*r+m,g=f*r+(m+1)%r,p=(f+1)*r+m,M=(f+1)*r+(m+1)%r,S=a(l[f],l[f+1],(m+.5)/r*Math.PI*2);h[S].push(x,p,g,g,p,M)}for(let f of[0,i-1]){let m=c.length/3,x=l[f];c.push(x.x,(x.yb+x.yt)/2,0);for(let g=0;g<r;g++)c.push(c[(f*r+g)*3],c[(f*r+g)*3+1],c[(f*r+g)*3+2]);for(let g=0;g<r;g++){let p=m+1+g,M=m+1+(g+1)%r;f===0?h[0].push(m,p,M):h[0].push(m,M,p)}}let d=new ge;d.setAttribute("position",new qt(c,3));let u=[];return h.forEach((f,m)=>{d.addGroup(u.length,f.length,m),u.push(...f)}),d.setIndex(u),d.computeVertexNormals(),d}var Xp=new xi(.78,.24,12,28),Bu=new mn(.62,.62,.1,24);Bu.rotateX(Math.PI/2);var Ou=new mn(.16,.16,.14,12);Ou.rotateX(Math.PI/2);var zu=new _e(.12,.58,.12);zu.translate(0,.3,0);var Lc=new $s(.1,.75,14,1,!0);Lc.rotateZ(Math.PI/2);Lc.translate(-.375,0,0);var Dc=new $s(.05,.38,10,1,!0);Dc.rotateZ(Math.PI/2);Dc.translate(-.19,0,0);var ku=new mn(.038,.045,.12,12,1,!0);ku.rotateZ(Math.PI/2);var Vu=new je(1.9,1.15);Vu.rotateX(-Math.PI/2);var Nu=null,rM=[Xp,Bu,Ou,zu,Lc,Dc,ku,Vu],Uu=new w,ja=class{constructor(t,{teamColor:e,accent:n=2236962,boostColor:i=null,showName:r=!0}){this.car=t;let a=Gp[t.bodyKey]?t.bodyKey:"octane",o=Gp[a],c=Tn[a];this.group=new Ne,this.root=new Ne,this.group.add(this.root);let l=new ss({color:e,metalness:.5,roughness:.34,clearcoat:.7,clearcoatRoughness:.14}),h=new ss({color:n,metalness:.6,roughness:.35,clearcoat:.6}),d=new ss({color:395796,metalness:.2,roughness:.04,clearcoat:1,clearcoatRoughness:.02,envMapIntensity:1.6}),u=new Re({color:1184793,roughness:.62,metalness:.3}),f=new Re({color:1381655,roughness:.88}),m=new Re({color:14870254,metalness:.75,roughness:.3}),x=new Re({color:12107464,metalness:.8,roughness:.3}),g=new fe({color:new lt(15398143).multiplyScalar(2.2),toneMapped:!1});this.tailMat=new fe({color:new lt(16718362).multiplyScalar(1.4),toneMapped:!1});let p=Wp(o.body,{n:o.n,taper:.1,groups:2,classify:(z,q,$)=>Math.sin($)<-.35?1:0}),M=new Tt(p,[l,u]),S=Math.max(...o.cabin.map(z=>z[2])),y=Wp(o.cabin,{n:o.n+.6,taper:.28,groups:2,classify:(z,q,$)=>Math.abs($-Math.PI/2)<.62&&Math.min(z.yt,q.yt)>S*.9?1:0}),T=new Tt(y,[d,l]);M.castShadow=!0,T.castShadow=!0,this.root.add(M,T);let E=o.body[o.body.length-1][0],C=o.body[0][0],v=z=>{let q=o.body,$=0;for(let mt=0;mt<200;mt++)if(Fu(q,mt/199)[0]>=z){$=mt/199;break}return Fu(q,$)},A=E-.3,I=v(A),D=new Tt(new _e(.42,.012,.1),h);D.position.set(A,I[2]+.004,0),D.rotation.z=-.22,this.root.add(D);let B=v(E-.05);for(let z of[1,-1]){let q=new Tt(new _e(.03,.028,.12),g);q.position.set(E-.035,(B[1]+B[2])/2+.01,z*B[3]*.62),q.rotation.y=z*.35,this.root.add(q)}let V=new Tt(new _e(.03,.04,B[3]*.8),u);V.position.set(E-.03,B[1]+.025,0),this.root.add(V);let P=v(C+.03),L=new Tt(new _e(.025,.03,P[3]*1.5),this.tailMat);L.position.set(C+.005,P[2]-.035,0),this.root.add(L),this.flames=[],this.exhausts=[];let X=P[1]+.05;for(let z of[1,-1]){let q=new Tt(ku,x);q.position.set(C-.02,X,z*.14),this.root.add(q)}if(o.spoiler){let[z,q]=o.spoiler,$=v(z)[3]*2+.04,mt=new Tt(new _e(.15,.022,$),h);mt.position.set(z,q,0),mt.rotation.z=.14,mt.castShadow=!0,this.root.add(mt);for(let ft of[1,-1]){let Gt=new Tt(new _e(.17,.07,.012),h);Gt.position.set(z,q-.015,ft*$/2);let Wt=new Tt(new _e(.04,q-.1,.025),u);Wt.position.set(z+.03,(q+.1)/2,ft*$*.28),this.root.add(Gt,Wt)}}let k=-(c.hy+ut.rideHeight);this.wheels=[];for(let z=0;z<4;z++){let q=z<2,$=o.wheelR[q?0:1],mt=z%2?-1:1,ft=new Ne;ft.position.set(o.wheelX[q?0:1],k+$,mt*o.wheelZ);let Gt=new Ne,Wt=new Tt(Xp,f);Wt.scale.set($,$,$*1.1),Wt.castShadow=!0;let jt=new Tt(Bu,m);jt.scale.set($,$,1);let J=new Tt(Ou,h);J.scale.set($,$,1),J.position.z=mt*.02,Gt.add(Wt,jt,J);for(let Bt=0;Bt<5;Bt++){let yt=new Tt(zu,x);yt.scale.set($,$,1),yt.rotation.z=Bt*Math.PI*2/5,yt.position.z=mt*.015,Gt.add(yt)}ft.add(Gt),this.root.add(ft),this.wheels.push({pivot:ft,spinner:Gt,front:q});let Q=v(ft.position.x),dt=new Tt(new xi($+.04,.035,8,18,Math.PI),u);dt.position.set(ft.position.x,ft.position.y,mt*(Q[3]+.005)),dt.scale.set(1,1,1.6),this.root.add(dt)}let Z=new lt(i??e);this.flameMat=new fe({color:Z.clone().multiplyScalar(2.5),transparent:!0,opacity:.85,blending:gn,depthWrite:!1,toneMapped:!1,side:Oe}),this.coreMat=new fe({color:new lt(16773824).multiplyScalar(3),transparent:!0,opacity:.9,blending:gn,depthWrite:!1,toneMapped:!1});for(let z of[1,-1]){let q=new Ne;q.position.set(C-.06,X,z*.14),q.add(new Tt(Lc,this.flameMat),new Tt(Dc,this.coreMat)),q.visible=!1,this.root.add(q),this.flames.push(q),this.exhausts.push(new w(C-.08,X,z*.14))}this.boostColor=Z,this.backX=C,this.halfWidth=o.wheelZ,this.wheelBaseY=k,Nu||(Nu=new fe({map:Np(),transparent:!0,depthWrite:!1})),this.shadow=new Tt(Vu,Nu.clone()),this.shadow.renderOrder=2,this.group.add(this.shadow),r&&(this.nameTag=Fp(t.name,e===void 0?"#fff":`#${new lt(e).getHexString()}`),this.nameTag.position.set(0,1,0),this.group.add(this.nameTag))}update(t,e){if(this.group.visible=!t.demolished,t.demolished)return;this.group.position.copy(t.pos),this.root.quaternion.copy(t.quat);for(let i of this.wheels)i.front&&(i.pivot.rotation.y=-t.steer*.45),i.spinner.rotation.z=-t.spin;let n=t.pos.y-.35;if(this.shadow.visible=n<4&&Math.abs(t.pos.x)<38&&Math.abs(t.pos.z)<60,this.shadow.visible){Uu.set(1,0,0).applyQuaternion(t.quat),this.shadow.position.set(0,.02-t.pos.y,0),this.shadow.rotation.y=Math.atan2(-Uu.z,Uu.x),this.shadow.material.opacity=Math.max(0,.75*(1-n/4));let i=1+n*.15;this.shadow.scale.set(i,1,i)}this.tailMat.color.setRGB(t.braking?3.2:1.4,t.braking?.1:.03,t.braking?.1:.03);for(let i of this.flames)if(i.visible=t.boosting,t.boosting){let r=.85+Math.sin(e*60+i.position.z*10)*.12+Math.random()*.15;i.scale.set(r*(t.supersonic?1.4:1),1,1)}}exhaustWorld(t,e){return e.copy(this.exhausts[t]).applyQuaternion(this.root.quaternion).add(this.group.position)}dispose(){this.group.traverse(t=>{t.isMesh&&t.geometry&&!rM.includes(t.geometry)&&t.geometry.dispose(),t.material&&t.material.map&&t.isSprite&&t.material.map.dispose(),t===this.shadow&&t.material.dispose()})}};var aM=`
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
}`,qp=`
varying float vAlpha;
varying vec3 vColor;
void main() {
  vec2 d = gl_PointCoord - 0.5;
  float r = length(d) * 2.0;
  float a = smoothstep(1.0, 0.0, r);
  a *= a;
  gl_FragColor = vec4(vColor * a * vAlpha, a * vAlpha);
}`,Nc=class{constructor(t,e=!0){this.cap=t,this.n=0,this.pos=new Float32Array(t*3),this.col=new Float32Array(t*3),this.size=new Float32Array(t),this.alpha=new Float32Array(t),this.vel=new Float32Array(t*3),this.life=new Float32Array(t),this.maxLife=new Float32Array(t),this.s0=new Float32Array(t),this.s1=new Float32Array(t),this.a0=new Float32Array(t),this.drag=new Float32Array(t),this.grav=new Float32Array(t),this.c0=new Float32Array(t*3),this.c1=new Float32Array(t*3);let n=new ge;this.aPos=new Ue(this.pos,3).setUsage(er),this.aCol=new Ue(this.col,3).setUsage(er),this.aSize=new Ue(this.size,1).setUsage(er),this.aAlpha=new Ue(this.alpha,1).setUsage(er),n.setAttribute("position",this.aPos),n.setAttribute("pcolor",this.aCol),n.setAttribute("size",this.aSize),n.setAttribute("alpha",this.aAlpha),n.boundingSphere=new Hn(new w,1e5),this.material=new we({vertexShader:aM,fragmentShader:qp,uniforms:{scale:{value:600}},transparent:!0,depthWrite:!1,blending:e?gn:Oi}),e||(this.material.fragmentShader=qp.replace("gl_FragColor = vec4(vColor * a * vAlpha, a * vAlpha);","gl_FragColor = vec4(vColor, a * vAlpha);")),this.points=new es(n,this.material),this.points.frustumCulled=!1,this.points.renderOrder=5,this.geometry=n}setViewportHeight(t){this.material.uniforms.scale.value=t*.9}emit(t){if(this.n>=this.cap)return;let e=this.n++,n=e*3;this.pos[n]=t.x,this.pos[n+1]=t.y,this.pos[n+2]=t.z,this.vel[n]=t.vx||0,this.vel[n+1]=t.vy||0,this.vel[n+2]=t.vz||0,this.life[e]=0,this.maxLife[e]=t.life||.5,this.s0[e]=t.size||.5,this.s1[e]=t.size1??this.s0[e]*.2,this.a0[e]=t.alpha??1,this.drag[e]=t.drag||0,this.grav[e]=t.gravity||0;let i=t.color,r=t.color1||t.color;this.c0[n]=i.r,this.c0[n+1]=i.g,this.c0[n+2]=i.b,this.c1[n]=r.r,this.c1[n+1]=r.g,this.c1[n+2]=r.b}update(t){let e=0;for(;e<this.n;){if(this.life[e]+=t,this.life[e]>=this.maxLife[e]){this.copy(this.n-1,e),this.n--;continue}let n=this.life[e]/this.maxLife[e],i=e*3,r=Math.exp(-this.drag[e]*t);this.vel[i]*=r,this.vel[i+1]=this.vel[i+1]*r+this.grav[e]*t,this.vel[i+2]*=r,this.pos[i]+=this.vel[i]*t,this.pos[i+1]+=this.vel[i+1]*t,this.pos[i+2]+=this.vel[i+2]*t,this.size[e]=this.s0[e]+(this.s1[e]-this.s0[e])*n,this.alpha[e]=this.a0[e]*(1-n)*Math.min(1,n*12+.2),this.col[i]=this.c0[i]+(this.c1[i]-this.c0[i])*n,this.col[i+1]=this.c0[i+1]+(this.c1[i+1]-this.c0[i+1])*n,this.col[i+2]=this.c0[i+2]+(this.c1[i+2]-this.c0[i+2])*n,e++}this.geometry.setDrawRange(0,this.n),this.aPos.needsUpdate=!0,this.aCol.needsUpdate=!0,this.aSize.needsUpdate=!0,this.aAlpha.needsUpdate=!0}copy(t,e){if(t===e)return;let n=t*3,i=e*3;for(let r=0;r<3;r++)this.pos[i+r]=this.pos[n+r],this.vel[i+r]=this.vel[n+r],this.col[i+r]=this.col[n+r],this.c0[i+r]=this.c0[n+r],this.c1[i+r]=this.c1[n+r];this.life[e]=this.life[t],this.maxLife[e]=this.maxLife[t],this.s0[e]=this.s0[t],this.s1[e]=this.s1[t],this.a0[e]=this.a0[t],this.drag[e]=this.drag[t],this.grav[e]=this.grav[t],this.size[e]=this.size[t],this.alpha[e]=this.alpha[t]}clear(){this.n=0}},Ce=s=>(Math.random()*2-1)*s,Yp=new lt(1,1,1),$p=new lt(.18,.18,.2),oM=new lt(1.6,.7,.2),Uc=class{constructor(t){this.add=new Nc(6e3,!0),this.smoke=new Nc(1500,!1),t.add(this.add.points,this.smoke.points),this.rings=[],this.scene=t,this.ringGeo=new ga(.8,1,48)}setViewportHeight(t){this.add.setViewportHeight(t),this.smoke.setViewportHeight(t)}boost(t,e,n,i,r){let a=this.tmpHot||(this.tmpHot=new lt),o=this.tmpCool||(this.tmpCool=new lt);a.copy(i).multiplyScalar(1.6).lerp(Yp,.25),o.copy(i).multiplyScalar(.45);for(let c=0;c<3;c++){let l=9+Math.random()*6,h=Math.random()*.15;this.add.emit({x:t.x-e.x*h+Ce(.04),y:t.y-e.y*h+Ce(.04),z:t.z-e.z*h+Ce(.04),vx:-e.x*l+n.x*.7+Ce(.8),vy:-e.y*l+n.y*.7+Ce(.8),vz:-e.z*l+n.z*.7+Ce(.8),life:.16+Math.random()*.16,size:r?.42:.34,size1:.04,color:a,color1:o,drag:4,alpha:.8})}}trail(t,e,n=.28){this.add.emit({x:t.x,y:t.y,z:t.z,life:.45,size:n,size1:n*.18,color:e,color1:e,alpha:.7})}sparks(t,e,n=oM){let i=Math.min(36,6+e*1.2);for(let r=0;r<i;r++){let a=3+Math.random()*e*.5;this.add.emit({x:t.x,y:t.y,z:t.z,vx:Ce(a),vy:Ce(a)+2,vz:Ce(a),life:.25+Math.random()*.25,size:.2,size1:.03,color:Yp,color1:n,drag:2,gravity:-10})}}padPickup(t,e){let n=new lt(1.8,1.2,.3);for(let i=0;i<(e?28:10);i++)this.add.emit({x:t.x+Ce(1),y:.3,z:t.z+Ce(1),vx:Ce(1),vy:3+Math.random()*(e?6:3),vz:Ce(1),life:.55,size:e?.32:.22,size1:.05,color:n,drag:1})}explosion(t,e,n=!0){let i=n?650:220,r=new lt(e),a=r.clone().multiplyScalar(3),o=r.clone().multiplyScalar(1.2),c=new lt(2.2,1.9,1.2);for(let h=0;h<i;h++){let d=Math.random()*Math.PI*2,u=Math.random()*2-1,f=Math.sqrt(1-u*u),m=Math.random(),x=(n?12:7)+Math.random()*(n?32:12)*(m<.25?1.3:1);this.add.emit({x:t.x,y:t.y,z:t.z,vx:Math.cos(d)*f*x,vy:u*x+3,vz:Math.sin(d)*f*x,life:.7+Math.random()*(n?1.4:.6),size:m<.25?.45:n?1.3:.9,size1:.08,color:m<.25?c:a,color1:o,drag:m<.25?.8:1.8,gravity:m<.25?-9:-3})}for(let h=0;h<(n?90:40);h++)this.smoke.emit({x:t.x+Ce(1),y:t.y+Ce(1),z:t.z+Ce(1),vx:Ce(6),vy:Ce(4)+2,vz:Ce(6),life:1.5+Math.random()*1.5,size:2.5,size1:6,color:$p,alpha:.55,drag:1.5,gravity:.5});let l=new Tt(this.ringGeo,new fe({color:a,transparent:!0,opacity:1,side:Oe,blending:gn,depthWrite:!1,toneMapped:!1}));l.position.copy(t),l.lookAt(t.x,t.y+1,t.z),this.scene.add(l),this.rings.push({mesh:l,t:0,max:n?1.1:.6,size:n?30:10})}demolition(t,e){for(let n=0;n<160;n++){let i=4+Math.random()*12;this.add.emit({x:t.x,y:t.y,z:t.z,vx:Ce(i),vy:Ce(i)+4,vz:Ce(i),life:.5+Math.random()*.8,size:1.1,size1:.1,color:new lt(2,1.4,.5),color1:new lt(e).multiplyScalar(1.5),drag:2,gravity:-6})}for(let n=0;n<50;n++)this.smoke.emit({x:t.x,y:t.y,z:t.z,vx:Ce(3),vy:1+Math.random()*3,vz:Ce(3),life:1.5+Math.random(),size:1.5,size1:4,color:$p,alpha:.7,drag:1})}update(t){this.add.update(t),this.smoke.update(t);for(let e=this.rings.length-1;e>=0;e--){let n=this.rings[e];n.t+=t;let i=n.t/n.max;if(i>=1){this.scene.remove(n.mesh),n.mesh.material.dispose(),this.rings.splice(e,1);continue}let r=1+i*n.size;n.mesh.scale.set(r,r,r),n.mesh.material.opacity=1-i}}clear(){this.add.clear(),this.smoke.clear()}};var Qa=new w(0,1,0),Fc=new w,Sr=new w,gs=new w,Jp=new w,ai=new w,Tr=new w;function Zp(s,t){let e=dn.degToRad(s);return dn.radToDeg(2*Math.atan(Math.tan(e/2)/t))}function Oc(s,t=.6){for(let e=0;e<3;e++){let n=fn(s.x,s.y,s.z);if(n<=-t)return s;yi(s.x,s.y,s.z,Jp),s.addScaledVector(Jp,n+t)}return s}var Bc=class{constructor(t){this.camera=t,this.pos=new w,this.look=new w,this.fwd=new w(0,0,1),this.up=new w(0,1,0),this.ready=!1,this.ballCam=!0,this.shake=0,this.swivel=0}reset(){this.ready=!1}addShake(t){this.shake=Math.max(this.shake,t)}follow(t,e,n,i){let r=i.camDistance,a=i.camHeight;Fc.set(1,0,0).applyQuaternion(e.quat);let o=e.onGround?e.groundNormal:Qa;Sr.copy(Fc).addScaledVector(o,-Fc.dot(o)),Sr.lengthSq()<.09&&Sr.copy(this.fwd),Sr.normalize(),this.ready||(this.fwd.copy(Sr),this.up.copy(o));let c=1-Math.exp(-t*(e.onGround?9:5));this.fwd.lerp(Sr,c).normalize(),this.up.lerp(o,1-Math.exp(-t*5)).normalize();let l=this.up;if(this.ballCam&&n){gs.copy(e.pos).sub(n),gs.y=0,gs.lengthSq()<.25&&gs.copy(this.fwd).negate().setY(0),gs.normalize(),ai.copy(e.pos).addScaledVector(gs,r),ai.y+=a,l=Qa;let h=gs.copy(n).sub(ai).normalize(),d=Tr.copy(e.pos).sub(ai).normalize(),u=Math.acos(dn.clamp(h.dot(d),-1,1)),f=dn.degToRad(this.camera.fov)*.36;if(u>f&&u>1e-4){let m=Fc.crossVectors(d,h).normalize();h.copy(d).applyAxisAngle(m,f)}Tr.copy(ai).addScaledVector(h,12)}else ai.copy(e.pos).addScaledVector(this.fwd,-r).addScaledVector(this.up,a),Tr.copy(e.pos).addScaledVector(this.up,a*.7).addScaledVector(this.fwd,2.2);if(this.swivel&&(ai.sub(e.pos).applyAxisAngle(Qa,this.swivel).add(e.pos),Tr.sub(e.pos).applyAxisAngle(Qa,this.swivel).add(e.pos)),Oc(ai),!this.ready)this.pos.copy(ai),this.look.copy(Tr),this.ready=!0;else{let h=1-Math.exp(-t*i.camStiffness);this.pos.lerp(ai,h),this.look.lerp(Tr,1-Math.exp(-t*14))}this.apply(t,l)}setView(t,e,n,i=4){this.ready?(this.pos.lerp(e,1-Math.exp(-t*i)),this.look.lerp(n,1-Math.exp(-t*i*1.5))):(this.pos.copy(e),this.look.copy(n),this.ready=!0),this.apply(t,Qa)}apply(t,e){let n=this.camera;if(n.position.copy(this.pos),this.shake>.001){let i=this.shake;n.position.x+=(Math.random()-.5)*i,n.position.y+=(Math.random()-.5)*i,n.position.z+=(Math.random()-.5)*i,this.shake*=Math.exp(-t*5)}n.up.copy(e),n.lookAt(this.look)}};var jp=[["throttle","Acc\xE9l\xE9rer / piquer du nez"],["reverse","Freiner / reculer / cabrer"],["left","Tourner \xE0 gauche"],["right","Tourner \xE0 droite"],["jump","Sauter"],["boost","Boost"],["handbrake","D\xE9rapage / air roll libre"],["rollLeft","Air roll gauche"],["rollRight","Air roll droite"],["ballCam","Cam\xE9ra balle"],["scoreboard","Tableau des scores"],["pause","Pause"],["resetBall","Entra\xEEnement : replacer la balle"],["shootBall","Entra\xEEnement : balle vers moi"]],to={throttle:["KeyW","ArrowUp"],reverse:["KeyS","ArrowDown"],left:["KeyA","ArrowLeft"],right:["KeyD","ArrowRight"],jump:["Space","Mouse2"],boost:["ShiftLeft","Mouse0"],handbrake:["KeyC","ShiftRight"],rollLeft:["KeyQ"],rollRight:["KeyE"],ballCam:["KeyV","Mouse1"],scoreboard:["Tab"],pause:["Escape","KeyP"],resetBall:["KeyR"],shootBall:["KeyT"]},$e={A:0,B:1,X:2,Y:3,LB:4,RB:5,LT:6,RT:7,BACK:8,START:9,LS:10,UP:12,DOWN:13,LEFT:14,RIGHT:15};function Er(s){if(!s)return"\u2014";let t={Mouse0:"Clic gauche",Mouse1:"Clic molette",Mouse2:"Clic droit",Space:"Espace",ShiftLeft:"Maj gauche",ShiftRight:"Maj droite",ControlLeft:"Ctrl gauche",ControlRight:"Ctrl droite",AltLeft:"Alt",Tab:"Tab",Escape:"\xC9chap",ArrowUp:"\u2191",ArrowDown:"\u2193",ArrowLeft:"\u2190",ArrowRight:"\u2192",Enter:"Entr\xE9e",Backspace:"Retour"};return t[s]?t[s]:s.startsWith("Key")?s.slice(3):s.startsWith("Digit")?s.slice(5):s}function Kp(s,t,e){let n=Math.hypot(s,t);if(n<e)return[0,0];let i=Math.min(1,(n-e)/(1-e))/n;return[s*i,t*i]}var zc=class{constructor(t){this.settings=t,this.down=new Set,this.pressedQueue=new Set,this.capture=null,this.padPrev=new Map,this.padPressed=new Map,this.lastDevice="keyboard",this.virtualQueue=new Set,this.frameVirtual=new Set,this.touch=null,this.lastTouchTime=-1e9,window.addEventListener("touchstart",()=>{this.lastTouchTime=performance.now(),this.lastDevice="touch"},{passive:!0,capture:!0});let e=new Set(["Space","Tab","ArrowUp","ArrowDown","ArrowLeft","ArrowRight","ShiftLeft","AltLeft"]);window.addEventListener("keydown",n=>{if(this.capture){n.preventDefault();let i=this.capture;this.capture=null,i(n.code);return}n.target&&(n.target.tagName==="INPUT"||n.target.tagName==="SELECT")||(e.has(n.code)&&n.preventDefault(),this.down.has(n.code)||this.pressedQueue.add(n.code),this.down.add(n.code),this.lastDevice="keyboard")}),window.addEventListener("keyup",n=>this.down.delete(n.code)),window.addEventListener("blur",()=>this.down.clear()),window.addEventListener("mousedown",n=>{let i=`Mouse${n.button}`;if(this.capture){n.preventDefault();let r=this.capture;this.capture=null,r(i);return}n.target&&n.target.closest&&n.target.closest(".menu, .overlay-panel, button, input, select, #touch")||performance.now()-this.lastTouchTime<1500||(this.down.has(i)||this.pressedQueue.add(i),this.down.add(i),this.lastDevice="keyboard")}),window.addEventListener("mouseup",n=>this.down.delete(`Mouse${n.button}`)),window.addEventListener("contextmenu",n=>n.preventDefault())}captureNext(t){this.capture=t}keys(t){return this.settings.keys&&this.settings.keys[t]||to[t]||[]}kb(t){return this.keys(t).some(e=>this.down.has(e))?1:0}virtualPress(t){this.virtualQueue.add(t)}poll(){this.frameKeys=this.pressedQueue,this.pressedQueue=new Set,this.frameVirtual=this.virtualQueue,this.virtualQueue=new Set;let t=navigator.getGamepads?[...navigator.getGamepads()].filter(e=>e&&e.connected):[];this.pads=t,this.padPressed.clear();for(let e of t){let n=this.padPrev.get(e.index)||[],i=e.buttons.map(a=>a.pressed),r=i.map((a,o)=>a&&!n[o]);(r.some(a=>a)||Math.abs(e.axes[0]||0)>.5||Math.abs(e.axes[1]||0)>.5)&&(this.lastDevice="gamepad"),this.padPressed.set(e.index,r),this.padPrev.set(e.index,i)}}padFor(t,e){let n=this.pads||[];return e?t===1?n[0]?[n[0]]:[]:n[1]?[n[1]]:[]:t===0?n:[]}usesKeyboard(t){return t===0}pressed(t,e=0,n=!1){if(this.usesKeyboard(e)&&this.keys(t).some(r=>this.frameKeys&&this.frameKeys.has(r))||e===0&&this.frameVirtual.has(t))return!0;let i={jump:$e.A,ballCam:$e.Y,pause:$e.START,scoreboard:$e.BACK,resetBall:$e.UP,shootBall:$e.DOWN}[t];if(i===void 0)return!1;for(let r of this.padFor(e,n)){let a=this.padPressed.get(r.index);if(a&&a[i])return!0}return!1}quickChat(t,e){if(this.usesKeyboard(t)&&this.frameKeys){for(let n=1;n<=8;n++)if(this.frameKeys.has(`Digit${n}`)||this.frameKeys.has(`Numpad${n}`))return n-1}for(let n of this.padFor(t,e)){let i=this.padPressed.get(n.index);if(i){if(i[$e.LEFT])return 1;if(i[$e.RIGHT])return 2;if(i[$e.UP])return 0;if(i[$e.DOWN])return 3}}return-1}lookStick(t,e){for(let n of this.padFor(t,e)){let[i,r]=Kp(n.axes[2]||0,n.axes[3]||0,.25);if(i||r)return[i,r]}return[0,0]}held(t,e=0,n=!1){if(this.usesKeyboard(e)&&this.kb(t))return!0;let i={scoreboard:$e.BACK}[t];return i===void 0?!1:this.padFor(e,n).some(r=>r.buttons[i]&&r.buttons[i].pressed)}controls(t,e,n){let i=this.settings,r=0,a=0,o=0,c=0,l=!1,h=!1,d=!1;this.usesKeyboard(t)&&(r=this.kb("throttle")-this.kb("reverse"),a=this.kb("right")-this.kb("left"),o=r,c=this.kb("rollRight")-this.kb("rollLeft"),l=!!this.kb("jump")||this.keys("jump").some(u=>this.frameKeys&&this.frameKeys.has(u)),h=!!this.kb("boost"),d=!!this.kb("handbrake"));for(let u of this.padFor(t,e)){let f=M=>u.buttons[M]?u.buttons[M].value:0,[m,x]=Kp(u.axes[0]||0,u.axes[1]||0,i.deadzone),g=f($e.RT)-f($e.LT);Math.abs(g)>Math.abs(r)&&(r=g),Math.abs(m)>Math.abs(a)&&(a=m);let p=i.invertPitch?x:-x;Math.abs(p)>Math.abs(o)&&(o=p),f($e.LB)>.5&&(c=-1),l=l||f($e.A)>.5,h=h||f($e.B)>.5||f($e.RB)>.5,d=d||f($e.X)>.5}if(t===0&&this.touch&&this.touch.visible){let u=this.touch.state();Math.abs(u.y)>Math.abs(r)&&(r=u.y),Math.abs(u.x)>Math.abs(a)&&(a=u.x),Math.abs(u.y)>Math.abs(o)&&(o=u.y),l=l||u.jump||this.frameVirtual.has("jump"),h=h||u.boost,d=d||u.handbrake}return n.throttle=Math.max(-1,Math.min(1,r)),n.steer=Math.max(-1,Math.min(1,a)),n.pitch=Math.max(-1,Math.min(1,o)),n.yaw=d?0:n.steer,n.roll=Math.max(-1,Math.min(1,c+(d?n.steer:0))),n.jump=l,n.boost=h,n.handbrake=d,n}};function tm(){return typeof window<"u"&&("ontouchstart"in window||navigator.maxTouchPoints>0)&&window.matchMedia&&window.matchMedia("(pointer: coarse)").matches}var Qp=[{id:"jump",label:"SAUT",cls:"tb-jump"},{id:"boost",label:"BOOST",cls:"tb-boost"},{id:"handbrake",label:"D\xC9RAPE",cls:"tb-slide"},{id:"ballCam",label:"CAM",cls:"tb-cam",tap:!0},{id:"pause",label:"II",cls:"tb-pause",tap:!0},{id:"resetBall",label:"BALLE",cls:"tb-reset",tap:!0,freeplay:!0},{id:"shootBall",label:"TIR",cls:"tb-shoot",tap:!0,freeplay:!0}],kc=class{constructor(t){this.input=t,this.stick={x:0,y:0,id:null,ox:0,oy:0},this.held={jump:!1,boost:!1,handbrake:!1},this.visible=!1;let e=document.createElement("div");e.id="touch",e.className="hidden",e.innerHTML=`<div class="t-zone"></div><div class="t-base hidden"><div class="t-knob"></div></div>
      ${Qp.map(r=>`<div class="tbtn ${r.cls}" data-id="${r.id}">${r.label}</div>`).join("")}`,document.body.appendChild(e),this.root=e,this.zone=e.querySelector(".t-zone"),this.base=e.querySelector(".t-base"),this.knob=e.querySelector(".t-knob");let n=r=>{r.preventDefault(),r.stopPropagation()};this.zone.addEventListener("pointerdown",r=>{if(n(r),this.stick.id===null){this.stick.id=r.pointerId,this.stick.ox=r.clientX,this.stick.oy=r.clientY;try{this.zone.setPointerCapture(r.pointerId)}catch{}this.base.style.left=`${r.clientX}px`,this.base.style.top=`${r.clientY}px`,this.base.classList.remove("hidden"),this.moveStick(r)}}),this.zone.addEventListener("pointermove",r=>{r.pointerId===this.stick.id&&(n(r),this.moveStick(r))});let i=r=>{r.pointerId===this.stick.id&&(this.stick.id=null,this.stick.x=0,this.stick.y=0,this.base.classList.add("hidden"),this.knob.style.transform="translate(-50%, -50%)")};this.zone.addEventListener("pointerup",i),this.zone.addEventListener("pointercancel",i),e.querySelectorAll(".tbtn").forEach(r=>{let a=Qp.find(c=>c.id===r.dataset.id);r.addEventListener("pointerdown",c=>{n(c);try{r.setPointerCapture(c.pointerId)}catch{}r.classList.add("on"),a.tap?this.input.virtualPress(a.id):(a.id==="jump"&&this.input.virtualPress("jump"),this.held[a.id]=!0),navigator.vibrate&&a.id==="jump"&&navigator.vibrate(12)});let o=c=>{n(c),r.classList.remove("on"),a.tap||(this.held[a.id]=!1)};r.addEventListener("pointerup",o),r.addEventListener("pointercancel",o),r.addEventListener("contextmenu",n)}),e.addEventListener("touchstart",r=>r.preventDefault(),{passive:!1}),e.addEventListener("touchmove",r=>r.preventDefault(),{passive:!1})}moveStick(t){let e=Math.min(window.innerWidth,window.innerHeight)*.14,n=t.clientX-this.stick.ox,i=t.clientY-this.stick.oy,r=Math.hypot(n,i);r>e&&(this.stick.ox+=n-n/r*e,this.stick.oy+=i-i/r*e,this.base.style.left=`${this.stick.ox}px`,this.base.style.top=`${this.stick.oy}px`,n=n/r*e,i=i/r*e),this.stick.x=n/e,this.stick.y=-i/e,this.knob.style.transform=`translate(calc(-50% + ${n}px), calc(-50% + ${i}px))`}show(t,e=!1){if(t!==this.visible&&(this.visible=t,this.root.classList.toggle("hidden",!t),!t)){this.stick.id=null,this.stick.x=0,this.stick.y=0,this.base.classList.add("hidden");for(let n of Object.keys(this.held))this.held[n]=!1;this.root.querySelectorAll(".tbtn.on").forEach(n=>n.classList.remove("on"))}this.root.classList.toggle("freeplay",e)}setBallCam(t){let e=this.root.querySelector(".tb-cam");e&&(e.textContent=t?"CAM \u25CF":"CAM \u25CB")}state(){let e=n=>Math.abs(n)<.12?0:Math.sign(n)*(Math.abs(n)-.12)/.88;return{x:e(this.stick.x),y:e(this.stick.y),...this.held,active:this.visible}}};var Vc=class{constructor(t){this.settings=t,this.ctx=null,this.listener={x:0,y:0,z:0,rx:1,ry:0,rz:0},this.engines=[],this.musicTimer=null}init(){if(this.ctx){this.ctx.state==="suspended"&&this.ctx.resume();return}let t=window.AudioContext||window.webkitAudioContext;if(!t)return;let e=new t;this.ctx=e,this.comp=e.createDynamicsCompressor(),this.comp.threshold.value=-14,this.comp.ratio.value=4,this.master=e.createGain(),this.sfx=e.createGain(),this.music=e.createGain(),this.sfx.connect(this.master),this.music.connect(this.master),this.master.connect(this.comp),this.comp.connect(e.destination);let n=e.sampleRate*2;this.noise=e.createBuffer(1,n,e.sampleRate);let i=this.noise.getChannelData(0);for(let r=0;r<n;r++)i[r]=Math.random()*2-1;this.applyVolumes(),this.startCrowd()}applyVolumes(){if(!this.ctx)return;let t=this.settings;this.master.gain.value=t.volMaster,this.sfx.gain.value=t.volSfx,this.music.gain.value=t.volMusic*.5}setListener(t,e){let n=this.listener;n.x=t.x,n.y=t.y,n.z=t.z,n.rx=e.x,n.ry=e.y,n.rz=e.z}spatial(t,e=18){if(!t)return{gain:1,pan:0};let n=this.listener,i=t.x-n.x,r=t.y-n.y,a=t.z-n.z,o=Math.hypot(i,r,a),c=e/(e+Math.max(0,o-3)),l=o>.01?Math.max(-1,Math.min(1,(i*n.rx+r*n.ry+a*n.rz)/o))*.8:0;return{gain:c,pan:l}}out(t,e){let n=this.ctx,{gain:i,pan:r}=this.spatial(t),a=n.createGain();if(a.gain.value=e*i,n.createStereoPanner){let o=n.createStereoPanner();o.pan.value=r,a.connect(o),o.connect(this.sfx)}else a.connect(this.sfx);return a}noiseSrc(t){let e=this.ctx.createBufferSource();return e.buffer=this.noise,e.loop=t>1.9,e.start(this.ctx.currentTime,Math.random()*1.5),e.stop(this.ctx.currentTime+t),e}env(t,e,n,i=1){let r=this.ctx.currentTime;t.gain.cancelScheduledValues(r),t.gain.setValueAtTime(1e-4,r),t.gain.exponentialRampToValueAtTime(i,r+e),t.gain.exponentialRampToValueAtTime(1e-4,r+e+n)}tone(t,e,n,i,r,a){let o=this.ctx,c=o.createOscillator();c.type=t;let l=o.currentTime;c.frequency.setValueAtTime(e,l),c.frequency.exponentialRampToValueAtTime(Math.max(1,n),l+i);let h=o.createGain();c.connect(h),h.connect(a),this.env(h,.005,i,r),c.start(l),c.stop(l+i+.05)}hit(t,e){if(!this.ctx)return;let n=Math.min(1,.25+e/25),i=this.out(t,n);this.tone("sine",140+e*3,45,.25,.9,i);let r=this.noiseSrc(.2),a=this.ctx.createBiquadFilter();a.type="bandpass",a.frequency.value=900+e*40,a.Q.value=.8;let o=this.ctx.createGain();r.connect(a),a.connect(o),o.connect(i),this.env(o,.002,.16,.8)}bounce(t,e){if(!this.ctx)return;let n=this.out(t,Math.min(.6,e/30));this.tone("sine",90,40,.18,.8,n)}jump(t){if(!this.ctx)return;let e=this.out(t,.25),n=this.noiseSrc(.3),i=this.ctx.createBiquadFilter();i.type="bandpass",i.frequency.setValueAtTime(500,this.ctx.currentTime),i.frequency.exponentialRampToValueAtTime(2500,this.ctx.currentTime+.2);let r=this.ctx.createGain();n.connect(i),i.connect(r),r.connect(e),this.env(r,.01,.2,.8)}pad(t,e){if(!this.ctx)return;let n=this.out(t,e?.35:.2);this.tone("triangle",e?520:880,e?1560:1320,e?.35:.12,.7,n)}bump(t,e){if(!this.ctx)return;let n=this.out(t,Math.min(.8,e/15));this.tone("square",120,50,.15,.4,n),this.hit(t,e*.4)}explosion(t,e){if(!this.ctx)return;let n=this.ctx,i=this.out(t,e?1:.8),r=this.noiseSrc(e?2.5:1.4),a=n.createBiquadFilter();a.type="lowpass",a.frequency.setValueAtTime(e?3e3:2e3,n.currentTime),a.frequency.exponentialRampToValueAtTime(80,n.currentTime+(e?2.2:1.2));let o=n.createGain();r.connect(a),a.connect(o),o.connect(i),this.env(o,.005,e?2.2:1.2,1),this.tone("sine",110,28,e?1.4:.8,1,i)}horn(t){if(!this.ctx)return;let e=this.ctx,n=e.currentTime,i=e.createGain();i.connect(this.sfx),i.gain.setValueAtTime(1e-4,n),i.gain.exponentialRampToValueAtTime(.28,n+.05),i.gain.setValueAtTime(.28,n+1.6),i.gain.exponentialRampToValueAtTime(1e-4,n+2.4);let r=t?[220,277,330,440]:[196,233,294];for(let a of r){let o=e.createOscillator();o.type="sawtooth",o.frequency.value=a;let c=e.createOscillator();c.frequency.value=5;let l=e.createGain();l.gain.value=3,c.connect(l),l.connect(o.frequency);let h=e.createBiquadFilter();h.type="lowpass",h.frequency.value=1800,o.connect(h),h.connect(i),o.start(n),c.start(n),o.stop(n+2.5),c.stop(n+2.5)}this.cheer(3.5)}cheer(t=2.5){if(!this.ctx)return;let e=this.ctx,n=this.noiseSrc(t+.5),i=e.createBiquadFilter();i.type="bandpass",i.frequency.value=1200,i.Q.value=.5;let r=e.createGain(),a=e.currentTime;r.gain.setValueAtTime(1e-4,a),r.gain.exponentialRampToValueAtTime(.5,a+.3),r.gain.exponentialRampToValueAtTime(1e-4,a+t),n.connect(i),i.connect(r),r.connect(this.sfx)}beep(t){this.ctx&&this.tone("square",t?880:440,t?880:440,t?.5:.18,.18,this.sfx)}click(){this.ctx&&this.tone("triangle",1200,900,.05,.12,this.sfx)}startCrowd(){let t=this.ctx,e=t.createBufferSource();e.buffer=this.noise,e.loop=!0;let n=t.createBiquadFilter();n.type="bandpass",n.frequency.value=700,n.Q.value=.4,this.crowdGain=t.createGain(),this.crowdGain.gain.value=0,e.connect(n),n.connect(this.crowdGain),this.crowdGain.connect(this.sfx),e.start()}setCrowd(t){!this.ctx||!this.crowdGain||this.crowdGain.gain.setTargetAtTime(t*.12,this.ctx.currentTime,.4)}engine(t){if(!this.ctx)return null;if(this.engines[t])return this.engines[t];let e=this.ctx,n=e.createOscillator(),i=e.createOscillator();n.type="sawtooth",i.type="square";let r=e.createBiquadFilter();r.type="lowpass",r.frequency.value=600;let a=e.createGain();a.gain.value=0,n.connect(r),i.connect(r),r.connect(a),a.connect(this.sfx);let o=e.createBufferSource();o.buffer=this.noise,o.loop=!0;let c=e.createBiquadFilter();c.type="bandpass",c.frequency.value=600,c.Q.value=.7;let l=e.createGain();l.gain.value=0,o.connect(c),c.connect(l),l.connect(this.sfx),n.start(),i.start(),o.start();let h={o1:n,o2:i,f:r,g:a,bf:c,bg:l};return this.engines[t]=h,h}updateEngine(t,e,n,i,r,a,o){let c=this.engine(t);if(!c)return;let l=this.ctx.currentTime,h=Math.min(1,e/23),d=55+h*110+(r?0:20);c.o1.frequency.setTargetAtTime(d,l,.05),c.o2.frequency.setTargetAtTime(d*.5,l,.05),c.f.frequency.setTargetAtTime(400+h*1400+Math.abs(n)*300,l,.05);let u=a?(.05+Math.abs(n)*.05+h*.05)/Math.sqrt(o):0;c.g.gain.setTargetAtTime(u,l,.08),c.bg.gain.setTargetAtTime(a&&i?.35/Math.sqrt(o):0,l,.04),c.bf.frequency.setTargetAtTime(500+h*900,l,.1)}silenceEngines(){for(let t=0;t<this.engines.length;t++)this.engines[t]&&this.updateEngine(t,0,0,!1,!0,!1,1)}startMusic(){if(!this.ctx||this.musicTimer)return;let t=this.ctx,n=60/112/4,i=[[57,60,64],[53,57,60],[48,52,55],[55,59,62]],r=l=>440*Math.pow(2,(l-69)/12),a=t.currentTime+.1,o=0,c=()=>{for(;a<t.currentTime+.25;){let l=Math.floor(o/16)%4,h=i[l],d=o%16,u=a;if(d%4===0){let f=t.createOscillator(),m=t.createGain();f.frequency.setValueAtTime(120,u),f.frequency.exponentialRampToValueAtTime(40,u+.15),m.gain.setValueAtTime(.5,u),m.gain.exponentialRampToValueAtTime(.001,u+.2),f.connect(m),m.connect(this.music),f.start(u),f.stop(u+.25)}if(d%2===1){let f=t.createBufferSource();f.buffer=this.noise;let m=t.createBiquadFilter();m.type="highpass",m.frequency.value=7e3;let x=t.createGain();x.gain.setValueAtTime(.08,u),x.gain.exponentialRampToValueAtTime(.001,u+.05),f.connect(m),m.connect(x),x.connect(this.music),f.start(u,Math.random()),f.stop(u+.06)}if(d%2===0){let f=t.createOscillator();f.type="sawtooth",f.frequency.value=r(h[0]-24);let m=t.createBiquadFilter();m.type="lowpass",m.frequency.value=500;let x=t.createGain();x.gain.setValueAtTime(.12,u),x.gain.exponentialRampToValueAtTime(.001,u+n*1.8),f.connect(m),m.connect(x),x.connect(this.music),f.start(u),f.stop(u+n*2)}{let f=t.createOscillator();f.type="square",f.frequency.value=r(h[d%3]+(d%8<4?12:24));let m=t.createBiquadFilter();m.type="lowpass",m.frequency.value=2200;let x=t.createGain();x.gain.setValueAtTime(.035,u),x.gain.exponentialRampToValueAtTime(.001,u+n*.9),f.connect(m),m.connect(x),x.connect(this.music),f.start(u),f.stop(u+n)}a+=n,o++}};this.musicTimer=setInterval(c,60),c()}stopMusic(){this.musicTimer&&clearInterval(this.musicTimer),this.musicTimer=null}};var xs=s=>String(s).replace(/[&<>"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[t]),lM=s=>s===0?"b":"o";function cM(s){if(s.opts.freeplay)return"LIBRE";if(s.overtime){let e=Math.floor(s.overtimeElapsed);return`+${Math.floor(e/60)}:${String(e%60).padStart(2,"0")}`}if(s.opts.duration<=0)return"\u221E";let t=Math.ceil(s.timeLeft);return`${Math.floor(t/60)}:${String(t%60).padStart(2,"0")}`}var eo=2*Math.PI*60,Hc=class{constructor(t){this.root=t,this.players=[],this.centerTimer=0,this.goalTimer=0}showHint(t,e=10){let n=document.createElement("div");n.className="hint-bar",n.innerHTML=t,this.root.appendChild(n),setTimeout(()=>n.classList.add("fade"),e*1e3),setTimeout(()=>n.remove(),e*1e3+1200)}setup(t,e,n){let i=this.root;if(i.innerHTML=`
      <div id="scorebar"><div class="team t0" id="s0">0</div><div id="clock">5:00</div><div class="team t1" id="s1">0</div></div>
      <div id="feed"></div>
      <div id="center-msg"></div>
      <div id="goal-banner"></div>
      <div id="replay-tag" class="hidden"><div class="r">REPLAY</div><div class="s">Appuyez sur SAUT pour passer</div></div>
      <div id="scoretable" class="hidden"></div>
      <div id="fps" class="hidden"></div>`,this.el={s0:i.querySelector("#s0"),s1:i.querySelector("#s1"),clock:i.querySelector("#clock"),feed:i.querySelector("#feed"),center:i.querySelector("#center-msg"),goal:i.querySelector("#goal-banner"),replay:i.querySelector("#replay-tag"),table:i.querySelector("#scoretable"),fps:i.querySelector("#fps")},this.players=e.map((r,a)=>{let o=document.createElement("div");o.className="phud";let c=n[a];return Object.assign(o.style,{left:`${c.x*100}%`,top:`${c.y*100}%`,width:`${c.w*100}%`,height:`${c.h*100}%`}),o.innerHTML=`
        <div class="boost">
          <svg viewBox="0 0 140 140"><circle cx="70" cy="70" r="60" fill="rgba(0,0,0,0.45)" stroke="rgba(255,255,255,0.12)" stroke-width="12" stroke-dasharray="${eo*.75} ${eo}"/>
          <circle class="arc" cx="70" cy="70" r="60" fill="none" stroke="url(#bg${a})" stroke-width="12" stroke-linecap="round" stroke-dasharray="0 ${eo}"/>
          <defs><linearGradient id="bg${a}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffd24d"/><stop offset="1" stop-color="#ff6a00"/></linearGradient></defs></svg>
          <div class="num">33</div><div class="lbl">BOOST</div>
          <div class="speedo"><span class="sp">0</span> <small>km/h</small></div>
        </div>
        <div class="camtag"></div>
        <div class="popups"></div>
        <div class="demo-msg hidden">D\xC9TRUIT !</div>`,this.root.appendChild(o),o.dataset.split=c.h<.9?"1":"0",{el:o,car:r.car,arc:o.querySelector(".arc"),num:o.querySelector(".num"),sp:o.querySelector(".sp"),speedo:o.querySelector(".speedo"),cam:o.querySelector(".camtag"),popups:o.querySelector(".popups"),demo:o.querySelector(".demo-msg"),lastBoost:-1}}),n.length>1){let r=document.createElement("div");r.className="split-line",this.root.appendChild(r)}this.centerTimer=0,this.goalTimer=0,this.hudScale=0}showCenter(t,e=1,n="",i="#fff"){let r=this.el.center;r.textContent=t,r.style.color=i,r.className="",r.offsetWidth,r.className=`pop ${n}`,this.centerTimer=e}feed(t,e="#fff"){let n=document.createElement("div");for(n.className="feed-item",n.style.borderLeftColor=e,n.innerHTML=t,this.el.feed.prepend(n);this.el.feed.children.length>6;)this.el.feed.lastChild.remove();setTimeout(()=>n.remove(),6e3)}chat(t,e){this.feed(`${this.name(t)} : <span style="color:#fff">${xs(e)}</span>`,t.team===0?"#2f7bff":"#ff8a1f")}popup(t,e,n){let i=document.createElement("div");i.className="popup",i.innerHTML=`${xs(e)}${n?`<b>+${n}</b>`:""}`,t.popups.appendChild(i),setTimeout(()=>i.remove(),2300)}name(t){return`<span class="${lM(t.team)}">${xs(t.name)}</span>`}onEvent(t,e){switch(t.type){case"countdown":this.showCenter(String(t.n),.95);break;case"go":this.showCenter("GO !",.8,"","#ffe066");break;case"overtime":this.showCenter("PROLONGATION",2.4,"","#ffd34d");break;case"goal":{let n=t.team===0?"var(--blue)":"var(--orange)",i="";t.scorer?i=`${xs(t.scorer.name)} a marqu\xE9 !`:t.ownGoal&&(i=`Contre son camp de ${xs(t.ownGoal.name)}`),t.assist&&(i+=` <span style="color:#cfe0ff;font-size:20px">(passe de ${xs(t.assist.name)})</span>`),this.el.goal.innerHTML=`<div class="big" style="color:${n}">BUT !</div><div class="sub">${i}</div><div class="speed">${t.speedKmh} km/h</div>`,this.goalTimer=3,t.scorer?this.feed(`\u26BD ${this.name(t.scorer)} a marqu\xE9`,t.team===0?"#2f7bff":"#ff8a1f"):this.feed(`\u26BD But pour l'\xE9quipe ${t.team===0?"BLEUE":"ORANGE"}`,t.team===0?"#2f7bff":"#ff8a1f");break}case"demo":this.feed(`${this.name(t.attacker)} \u{1F4A5} ${this.name(t.victim)}`,"#ff5050");for(let n of this.players)n.car===t.victim&&n.demo.classList.remove("hidden");break;case"respawn":for(let n of this.players)n.car===t.car&&n.demo.classList.add("hidden");break;case"stat":for(let n of this.players)n.car===t.car&&this.popup(n,t.label,t.points);(t.label==="ARR\xCAT"||t.label==="ARR\xCAT \xC9PIQUE")&&this.feed(`\u{1F9E4} ${this.name(t.car)} \u2014 ${t.label.toLowerCase()}`,"#9fe0ff");break;case"flipReset":for(let n of this.players)n.car===t.car&&this.popup(n,"RESET DE FLIP !",0);break;case"replayStart":this.el.goal.innerHTML="";break;default:break}return e}update(t,e,n,i){let r=this.el;r.s0.textContent=e.score[0],r.s1.textContent=e.score[1],r.clock.textContent=cM(e),r.clock.className=e.overtime?"ot":!e.opts.freeplay&&e.opts.duration>0&&e.timeLeft<=30?"low":"",r.replay.classList.toggle("hidden",e.state!=="replay"),this.centerTimer>0&&(this.centerTimer-=t,this.centerTimer<=0&&(r.center.textContent="")),this.goalTimer>0&&(this.goalTimer-=t,this.goalTimer<=0&&(r.goal.innerHTML=""));let a=e.state==="replay",o=Math.max(.55,Math.min(1.6,window.innerHeight/1e3));if(o!==this.hudScale){this.hudScale=o;for(let l of this.players){let h=o*(l.el.dataset.split==="1"?.72:1);l.el.querySelector(".boost").style.transform=`scale(${h})`}}this.players.forEach((l,h)=>{let d=l.car;l.el.style.visibility=a?"hidden":"visible";let u=Math.round(d.boost);u!==l.lastBoost&&(l.lastBoost=u,l.num.textContent=u,l.arc.setAttribute("stroke-dasharray",`${eo*.75*(u/100)} ${eo}`),l.arc.style.opacity=u>0?1:0);let f=Math.round(d.vel.length()*3.6);l.sp.textContent=f,l.speedo.classList.toggle("ss",d.supersonic),l.cam.textContent=i.ballCam[h]?"CAM\xC9RA BALLE":"CAM\xC9RA VOITURE",d.demolished?l.demo.textContent=`D\xC9TRUIT ! Retour dans ${Math.max(1,Math.ceil(d.respawnTimer))}\u2026`:l.demo.classList.add("hidden")}),r.fps.classList.toggle("hidden",!i.showFps),i.showFps&&(r.fps.textContent=`${i.fps} FPS`);let c=i.scoreboard||e.state==="ended";return r.table.classList.toggle("hidden",!i.scoreboard),i.scoreboard&&(r.table.innerHTML=Hu(e)),c}clear(){this.root.innerHTML="",this.players=[]}};function Hu(s,t=!1){let e=null;if(t&&s.winner>=0)for(let i of s.cars)i.team===s.winner&&(!e||i.stats.score>e.stats.score)&&(e=i);let n="";for(let i of[0,1]){let r=s.cars.filter(a=>a.team===i).sort((a,o)=>o.stats.score-a.stats.score);if(r.length){n+=`<div class="st-team"><h4 style="color:${i===0?"var(--blue)":"var(--orange)"}">${i===0?"BLEU":"ORANGE"} \u2014 ${s.score[i]}</h4>
      <table class="st-table st-t${i}"><tr><th>JOUEUR</th><th>SCORE</th><th>BUTS</th><th>PASSES</th><th>ARR\xCATS</th><th>TIRS</th><th>D\xC9MOS</th></tr>`;for(let a of r){let o=a.stats;n+=`<tr><td>${xs(a.name)}${a.isBot?' <span style="color:#6f80a3;font-size:11px">IA</span>':""}${a===e?'<span class="mvp">\u2605 MVP</span>':""}</td>
        <td>${o.score}</td><td>${o.goals}</td><td>${o.assists}</td><td>${o.saves}</td><td>${o.shots}</td><td>${o.demos}</td></tr>`}n+="</table></div>"}}return n}var Gu="supersonic-arena-settings-v1",Gc={playerName:"Joueur",player2Name:"Joueur 2",body:"octane",accent:"#1b1d22",boostColor:"team",fov:110,camDistance:2.7,camHeight:1,camStiffness:11,ballCamDefault:!0,volMaster:.8,volSfx:.9,volMusic:.5,quality:"high",showFps:!1,deadzone:.15,invertPitch:!1,keys:null,teamSize:2,difficulty:"pro",duration:300,theme:"day",team:0,splitscreen:!1,p2Team:1,replays:!0,boostMode:"normal",gameMode:"classic",gravityScale:1};function em(){try{return!!localStorage.getItem(Gu)}catch{return!1}}function nm(){let s={};try{s=JSON.parse(localStorage.getItem(Gu)||"{}")||{}}catch{s={}}let t={...Gc,...s};return t.keys={...to,...s.keys||{}},t}function im(s){try{localStorage.setItem(Gu,JSON.stringify(s))}catch{}}var no={low:{label:"Basse",pixelRatio:.75,shadows:!1,bloom:!1,shadowSize:1024},medium:{label:"Moyenne",pixelRatio:1,shadows:!0,bloom:!1,shadowSize:1024},high:{label:"Haute",pixelRatio:1.5,shadows:!0,bloom:!0,shadowSize:2048},ultra:{label:"Ultra",pixelRatio:2,shadows:!0,bloom:!0,shadowSize:4096}};var sm=s=>String(s).replace(/[&<>"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[t]),hM=["#1b1d22","#e8e8e8","#d62828","#f7c948","#2ec27e","#8a4dff","#ff4fa3","#00c2d1","#6b4a2b"],uM=["team","#ffd24d","#ff3b3b","#39ff88","#b05cff","#4de1ff","#ffffff","#ff66cc"];function Je(s,t,e,n=""){return`<div class="seg" data-seg="${s}">${t.map(([i,r])=>`<button data-v="${i}" class="${String(i)===String(e)?`on ${n}`:""}">${r}</button>`).join("")}</div>`}var Wc=class{constructor(t,e){this.root=t,this.app=e,this.screen=null,this.stack=[],this.focus=0,this.waitingKey=null}get s(){return this.app.settings}hide(){this.root.innerHTML="",this.screen=null}isOpen(){return!!this.screen}show(t,e=!0){e&&this.screen&&this.screen!==t&&this.stack.push(this.screen),this.screen=t,this.focus=0,this.render(),this.app.onMenuChange(t)}back(){let t=this.stack.pop();t?this.show(t,!1):this.app.inMatch()&&this.app.resume()}render(){let t=this[`html_${this.screen}`]();this.root.innerHTML=t,this.bind()}bind(){let t=this.root;t.querySelectorAll("[data-action]").forEach(e=>{e.addEventListener("click",()=>{this.app.sound.click(),this.action(e.dataset.action,e)})}),t.querySelectorAll("[data-seg]").forEach(e=>{e.querySelectorAll("button").forEach(n=>n.addEventListener("click",()=>{this.app.sound.click(),this.setOption(e.dataset.seg,n.dataset.v)}))}),t.querySelectorAll("input[type=range]").forEach(e=>{e.addEventListener("input",()=>{let n=parseFloat(e.value);this.s[e.dataset.key]=n;let i=e.parentElement.querySelector(".val");i&&(i.textContent=e.dataset.fmt==="pct"?`${Math.round(n*100)}%`:n),this.app.applySettings()})}),t.querySelectorAll("input[type=text]").forEach(e=>{e.addEventListener("input",()=>{this.s[e.dataset.key]=e.value.slice(0,16)||Gc[e.dataset.key],this.app.saveSettings()})}),t.querySelectorAll(".swatch").forEach(e=>e.addEventListener("click",()=>{this.app.sound.click(),this.s[e.dataset.key]=e.dataset.v,this.app.applySettings(),this.render()})),t.querySelectorAll(".key[data-bind]").forEach(e=>{e.addEventListener("click",n=>{n.stopPropagation(),e.classList.add("wait"),e.textContent="\u2026";let[i,r]=e.dataset.bind.split(":");setTimeout(()=>this.app.input.captureNext(a=>{let o=[...this.s.keys[i]||[]];(a!=="Escape"||i==="pause")&&(o[+r]=a),this.s.keys[i]=o.filter(Boolean),this.app.saveSettings(),this.render()}),50)})})}setOption(t,e){let n=["teamSize","duration","team","p2Team","gravityScale"],i=e;n.includes(t)&&(i=Number(e)),(e==="true"||e==="false")&&(i=e==="true"),t==="freeUnlimited"?this.freeUnlimited=i:this.s[t]=i,this.app.applySettings(),this.render()}action(t){let e=this.app;switch(t){case"play":this.show("play");break;case"free":this.show("free");break;case"garage":this.show("garage");break;case"settings":this.show("settings");break;case"controls":this.show("controls");break;case"back":this.back();break;case"start":e.startMatch(this.matchConfig());break;case"startFree":e.startMatch({freeplay:!0,unlimitedBoost:this.freeUnlimited!==!1});break;case"resume":e.resume();break;case"restart":e.restart();break;case"quit":e.quitToMenu();break;case"resetSettings":{let n={keys:this.s.keys,playerName:this.s.playerName};Object.assign(this.s,Gc,n),e.applySettings(),this.render();break}case"resetKeys":this.s.keys={...to},e.saveSettings(),this.render();break;case"fullscreen":document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen&&document.documentElement.requestFullscreen();break;default:break}}matchConfig(){let t=this.s;return{teamSize:t.teamSize,difficulty:t.difficulty,duration:t.duration,theme:t.theme,team:t.team,splitscreen:t.splitscreen,p2Team:t.p2Team,replays:t.replays,boostMode:t.boostMode,gravityScale:t.gravityScale,gameMode:t.gameMode}}html_main(){return`<div class="menu"><div class="col">
      <div class="title">Supersonic<br>Arena</div>
      <div class="subtitle">Football \xB7 voitures \xB7 fus\xE9es</div>
      <button class="btn primary" data-action="play">Jouer<small>Match contre l'IA, de 1c1 \xE0 4c4, seul ou en \xE9cran partag\xE9</small></button>
      <button class="btn" data-action="free">Entra\xEEnement libre<small>Toi, la balle et du boost illimit\xE9</small></button>
      <button class="btn" data-action="garage">Garage<small>Carrosserie, couleurs et tra\xEEn\xE9e de boost</small></button>
      <button class="btn" data-action="settings">Param\xE8tres<small>Graphismes, cam\xE9ra, audio, manette</small></button>
      <button class="btn" data-action="controls">Commandes<small>Clavier/souris et manette \u2014 touches personnalisables</small></button>
      <button class="btn" data-action="fullscreen">Plein \xE9cran</button>
      <div class="footer">Jeu de fan non officiel inspir\xE9 de Rocket League\xAE. Manette Xbox/PlayStation support\xE9e.<br>F11 ou \xAB Plein \xE9cran \xBB pour une immersion totale.</div>
    </div></div>`}html_play(){let t=this.s,e=Object.entries(Ga).map(([i,r])=>[i,r.label]),n=Object.entries(ms).map(([i,r])=>[i,r.label]);return`<div class="menu center dim"><div class="col">
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
    </div></div>`}html_free(){let t=this.s,e=Object.entries(ms).map(([n,i])=>[n,i.label]);return`<div class="menu center dim"><div class="col">
      <h2>Entra\xEEnement libre</h2>
      <div class="opt"><label>Ar\xE8ne</label>${Je("theme",e,t.theme)}</div>
      <div class="opt"><label>Boost illimit\xE9</label>${Je("freeUnlimited",[[!0,"Oui"],[!1,"Non"]],this.freeUnlimited!==!1)}</div>
      ${this.app.isTouch?'<p class="hint">Bouton <b>BALLE</b> : replacer la balle devant toi \xB7 <b>TIR</b> : la balle est lanc\xE9e vers toi (parfait pour les a\xE9riennes).</p>':`<p class="hint">Touche <span class="key">${Er(t.keys.resetBall[0])}</span> : replacer la balle devant toi \xB7
      <span class="key">${Er(t.keys.shootBall[0])}</span> : la balle est lanc\xE9e vers toi (parfait pour s'entra\xEEner aux a\xE9riennes).</p>`}
      <div class="btn-row"><button class="btn" data-action="back">Retour</button><button class="btn primary" data-action="startFree">C'est parti</button></div>
    </div></div>`}html_garage(){let t=this.s,e=Object.entries(Tn).map(([r,a])=>[r,a.name]),n=(r,a)=>`<div class="swatches">${a.map(o=>`<div class="swatch ${t[r]===o?"on":""}" data-key="${r}" data-v="${o}"
      style="background:${o==="team"?"linear-gradient(135deg,#2f7bff 50%,#ff8a1f 50%)":o}" title="${o==="team"?"Couleur d'\xE9quipe":o}"></div>`).join("")}</div>`,i=Tn[t.body]||Tn.octane;return`<div class="menu"><div class="col">
      <h2>Garage</h2>
      <div class="opt"><label>Pseudo</label><input type="text" data-key="playerName" maxlength="16" value="${sm(t.playerName)}"></div>
      <div class="opt"><label>Carrosserie</label>${Je("body",e,t.body)}</div>
      <div class="hint">Hitbox : ${(i.hx*200).toFixed(0)} \xD7 ${(i.hz*200).toFixed(0)} \xD7 ${(i.hy*200).toFixed(0)} cm \u2014 ${{octane:"polyvalente et haute, id\xE9ale pour les dribbles",dominus:"longue et plate, parfaite pour les frappes puissantes",breakout:"la plus longue, pour les tirs pr\xE9cis",merc:"massive, un tank pour d\xE9fendre"}[t.body]||""}</div>
      <div class="opt"><label>Couleur secondaire</label>${n("accent",hM)}</div>
      <div class="opt"><label>Tra\xEEn\xE9e de boost</label>${n("boostColor",uM)}</div>
      <div class="opt"><label>Pseudo joueur 2</label><input type="text" data-key="player2Name" maxlength="16" value="${sm(t.player2Name)}"></div>
      <div class="btn-row"><button class="btn" data-action="back">Retour</button></div>
    </div></div>`}html_settings(){let t=this.s,e=(n,i,r,a,o)=>`<div><input type="range" data-key="${n}" data-fmt="${o||""}" min="${i}" max="${r}" step="${a}" value="${t[n]}">
      <span class="val">${o==="pct"?`${Math.round(t[n]*100)}%`:t[n]}</span></div>`;return`<div class="menu center dim"><div class="col">
      <h2>Param\xE8tres</h2>
      <h3>Graphismes</h3>
      <div class="opt"><label>Qualit\xE9</label>${Je("quality",Object.entries(no).map(([n,i])=>[n,i.label]),t.quality)}</div>
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
    </div></div>`}html_controls(){let t=this.s,e=jp.map(([i,r])=>{let a=t.keys[i]||[],o=[0,1].map(c=>`<span class="key" data-bind="${i}:${c}">${a[c]?Er(a[c]):"+"}</span>`).join("");return`<tr><td>${r}</td><td>${o}</td></tr>`}).join(""),n=[["Acc\xE9l\xE9rer / reculer","RT / LT"],["Diriger \xB7 tangage \xB7 lacet","Stick gauche"],["Sauter / double saut / flip","A (\u2715)"],["Boost","B (\u25CB) ou RB (R1)"],["D\xE9rapage / air roll libre","X (\u25A1)"],["Air roll gauche","LB (L1)"],["Cam\xE9ra balle","Y (\u25B3)"],["Tableau des scores","Back / Share"],["Pause","Start / Options"],["Messages rapides","Croix directionnelle"]].map(([i,r])=>`<tr><td>${i}</td><td><span class="key">${r}</span></td></tr>`).join("");return`<div class="menu center dim"><div class="col">
      <h2>Commandes</h2>
      ${this.app.isTouch?`<h3>\xC9cran tactile</h3>
      <p class="hint">\u2022 Pose le pouce n'importe o\xF9 sur la <b>moiti\xE9 gauche</b> : le joystick appara\xEEt. Haut = acc\xE9l\xE9rer, bas = freiner / reculer,
      gauche/droite = tourner. En l'air, il fait pivoter la voiture.<br>
      \u2022 <b>SAUT</b> (bleu) : appuie deux fois en tenant le joystick pour un flip. <b>BOOST</b> (orange) : maintiens pour foncer.<br>
      \u2022 <b>D\xC9RAPE</b> : d\xE9rapage au sol, air roll en l'air. <b>CAM</b> : cam\xE9ra balle / voiture. <b>II</b> : pause.<br>
      \u2022 Une manette Bluetooth fonctionne aussi.</p>`:""}
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
      ${Hu(t,!0)}
      <div class="btn-row"><button class="btn" data-action="quit">Menu principal</button><button class="btn primary" data-action="restart">Rejouer</button></div>
    </div></div>`}navigate(t){let e=[...this.root.querySelectorAll("button")];e.length&&(this.focus=(this.focus+t+e.length)%e.length,e.forEach((n,i)=>n.classList.toggle("focus",i===this.focus)),e[this.focus].scrollIntoView({block:"nearest"}))}activate(){let t=[...this.root.querySelectorAll("button")];t[this.focus]&&t[this.focus].click()}};var io=ut.dt,dM={uniforms:{tDiffuse:{value:null},vignette:{value:.5},saturation:{value:1.1}},vertexShader:"varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`uniform sampler2D tDiffuse; uniform float vignette; uniform float saturation; varying vec2 vUv;
    void main() {
      vec4 c = texture2D(tDiffuse, vUv);
      float l = dot(c.rgb, vec3(0.2126, 0.7152, 0.0722));
      c.rgb = mix(vec3(l), c.rgb, saturation);
      c.rgb = mix(c.rgb, c.rgb * c.rgb * (3.0 - 2.0 * c.rgb), 0.18);
      vec2 d = vUv - 0.5;
      c.rgb *= 1.0 - dot(d, d) * vignette;
      gl_FragColor = c;
    }`},fM=["Je l'ai !","Joli tir !","Quel arr\xEAt !","Merci !","Calcul\xE9.","Oups\u2026","D\xE9fends !","Bien jou\xE9 !"],pM=new lt(.75,.9,1.3),rm=[1776930,15263976,14034984,16238920,3064446,9063935,49873,4475479],ln=new w,wr=new w;function am(s){let t=s.slice();for(let e=t.length-1;e>0;e--){let n=Math.floor(Math.random()*(e+1));[t[e],t[n]]=[t[n],t[e]]}return t}var Wu=class{constructor(){this.settings=nm();let t=new URLSearchParams(window.location.search);this.isApp=t.get("app")==="android",this.isTouch=this.isApp||t.has("touch")||tm(),document.body.classList.toggle("touch",this.isTouch),this.isTouch&&!em()&&(this.settings.quality="medium"),this.canvas=document.getElementById("game"),this.renderer=new uc({canvas:this.canvas,antialias:!0,powerPreference:"high-performance"}),this.renderer.outputColorSpace=Ge,this.renderer.toneMapping=os,this.renderer.shadowMap.type=rs,this.scene=new ts,this.pmrem=new rr(this.renderer),this.scene.environmentIntensity=.8,this.cameras=[new Ze(80,1,.1,3e3),new Ze(80,1,.1,3e3)],this.cameras[0].layers.enable(3),this.cameras[1].layers.enable(2),this.rigs=this.cameras.map(i=>new Bc(i)),this.effects=new Uc(this.scene),this.input=new zc(this.settings),this.isTouch&&(this.touch=new kc(this.input),this.input.touch=this.touch),this.sound=new Vc(this.settings),this.hud=new Hc(document.getElementById("hud")),this.menus=new Wc(document.getElementById("ui"),this);let e=Ip();this.ballMesh=new Tt(new is(ut.ballRadius,48,32),new Re({map:e.map,emissiveMap:e.emissiveMap,emissive:16777215,emissiveIntensity:1.3,roughness:.38,metalness:.35})),this.ballMesh.castShadow=!0,this.scene.add(this.ballMesh),this.ballShadow=new Tt(new je(2.6,2.6),new fe({map:Up(),transparent:!0,depthWrite:!1})),this.ballShadow.rotation.x=-Math.PI/2,this.ballShadow.renderOrder=2,this.scene.add(this.ballShadow),this.world=null,this.themeKey=null,this.qualityKey=null,this.match=null,this.mode="menu",this.paused=!1,this.carViews=[],this.locals=[],this.bots=[],this.acc=0,this.last=performance.now(),this.fpsFrames=0,this.fpsTime=0,this.fps=0,this.attractTime=0,this.endTimer=-1,this.garage=null,this.frameEvents=[],this.applySettings(!1),this.buildWorld(this.settings.theme),window.addEventListener("resize",()=>this.resize()),this.resize();let n=()=>{this.sound.init(),this.mode==="menu"&&this.sound.startMusic()};window.addEventListener("pointerdown",n),window.addEventListener("keydown",n),this.startAttract(),this.menus.show("main",!1),document.getElementById("loading").remove(),requestAnimationFrame(i=>this.frame(i))}get quality(){return no[this.settings.quality]||no.high}saveSettings(){im(this.settings)}applySettings(t=!0){let e=this.settings;this.sound.applyVolumes(),this.qualityKey&&this.qualityKey!==e.quality&&this.buildWorld(this.themeKey,!0),this.qualityKey=e.quality,this.resize(),this.garage&&this.refreshGarage(),this.mode==="menu"&&this.menus.screen==="play"&&e.theme!==this.themeKey&&this.buildWorld(e.theme),this.mode==="menu"&&this.menus.screen==="free"&&e.theme!==this.themeKey&&this.buildWorld(e.theme),t&&this.saveSettings()}resize(){let t=this.quality,e=window.innerWidth,n=window.innerHeight;this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,t.pixelRatio)),this.renderer.setSize(e,n,!1),this.composer&&(this.composer.setPixelRatio(this.renderer.getPixelRatio()),this.composer.setSize(e,n))}buildWorld(t,e=!1){if(t===this.themeKey&&!e)return;let n=ms[t]||ms.day;this.themeKey=ms[t]?t:"day";let i=this.quality;this.world&&(this.scene.remove(this.world.group),this.world.group.traverse(h=>{h.geometry&&h.geometry.dispose(),h.material&&(Array.isArray(h.material)?h.material:[h.material]).forEach(d=>{d.map&&d.map.dispose(),d.dispose()})}));let r=new Ne,a=Vp(n,i);r.add(a.group),r.add(Du(n));let o=new ya(n.hemiSky,n.hemiGround,n.hemiIntensity);r.add(o);let c=new ba(n.sun,n.sunIntensity);c.position.set(...n.sunDir).normalize().multiplyScalar(120),c.target.position.set(0,0,0),c.castShadow=i.shadows,c.shadow.mapSize.set(i.shadowSize,i.shadowSize);let l=c.shadow.camera;if(l.left=-62,l.right=62,l.top=72,l.bottom=-72,l.near=10,l.far=300,c.shadow.bias=-4e-4,c.shadow.normalBias=.03,r.add(c,c.target),this.scene.add(r),this.scene.fog=new $r(n.fog,220,1100),this.envTarget&&this.envTarget.dispose(),this.envTarget=this.pmrem.fromScene(Hp(n),.02,.1,1500),this.scene.environment=this.envTarget.texture,this.renderer.shadowMap.enabled=i.shadows,this.renderer.toneMappingExposure=n.exposure,this.world={group:r,updatePads:a.updatePads},this.composer=null,i.bloom){let h=new Le(1,1,{type:ze,samples:i.msaa||4}),d=new mc(this.renderer,h);this.renderPass=new gc(this.scene,this.cameras[0]),d.addPass(this.renderPass),this.bloom=new hr(new it(512,512),.48,.4,1.05),d.addPass(this.bloom),d.addPass(new xc),d.addPass(new cr(dM)),this.composer=d}this.scene.traverse(h=>{h.material&&(Array.isArray(h.material)?h.material:[h.material]).forEach(d=>{d.needsUpdate=!0})}),this.resize()}makePlayers(t){let e=this.settings,n=am(_u),i=Object.keys(Tn),r=[],a=(l,h,d,u)=>({team:h,name:l,body:d,isBot:!1,local:u});if(t.freeplay)return[a(e.playerName,0,e.body,0)];let o=t.teamSize,c=[a(e.playerName,t.team,e.body,0)];t.splitscreen&&c.push(a(e.player2Name,t.p2Team,i[(i.indexOf(e.body)+1)%i.length],1));for(let l=0;l<2;l++){let h=c.filter(d=>d.team===l);r.push(...h);for(let d=h.length;d<o;d++)r.push({team:l,name:n.pop(),body:i[Math.floor(Math.random()*i.length)],isBot:!0})}return r}startMatch(t){this.clearMatch(),this.lastConfig=t;let e=this.settings;t.theme?this.buildWorld(t.theme):this.buildWorld(e.theme);let n=this.makePlayers(t);if(this.match=new Ja({players:n,duration:t.freeplay?0:t.duration,freeplay:!!t.freeplay,unlimitedBoost:!!t.unlimitedBoost||t.boostMode==="unlimited",noBoost:t.boostMode==="none",gravityScale:t.gravityScale||1,mode:t.gameMode||"classic",replays:t.freeplay?!1:t.replays}),this.splitscreen=!!t.splitscreen&&!t.freeplay,this.locals=[],this.match.cars.forEach((i,r)=>{n[r].local!==void 0&&(this.locals[n[r].local]={car:i,index:n[r].local})}),this.locals=this.locals.filter(Boolean),this.bots=this.match.cars.filter(i=>i.isBot).map(i=>new Ka(i,t.difficulty||"pro")),this.createCarViews(this.match),this.rigs.forEach(i=>{i.reset(),i.ballCam=e.ballCamDefault}),this.mode="match",this.paused=!1,this.endTimer=-1,this.acc=0,this.effects.clear(),this.menus.hide(),this.menus.stack=[],this.hud.root.classList.remove("hidden"),this.hud.setup(this.match,this.locals,this.viewports()),this.isTouch)(!e.tutorialSeen||t.freeplay)&&(this.hud.showHint("Joystick \xE0 gauche : rouler et diriger (en l'air : pivoter) \xB7 <b>SAUT</b> deux fois = flip \xB7 <b>BOOST</b> \xB7 <b>D\xC9RAPE</b> = d\xE9rapage / air roll",9),e.tutorialSeen=!0,this.saveSettings()),this.enterFullscreen();else if(!e.tutorialSeen||t.freeplay){let i=r=>`<span class="key">${Er(e.keys[r][0])}</span>`;this.hud.showHint(`${i("throttle")}${i("reverse")} rouler \xB7 ${i("left")}${i("right")} tourner \xB7 ${i("jump")} sauter (2\xD7 = flip) \xB7 ${i("boost")} boost \xB7 ${i("ballCam")} cam\xE9ra \xB7 ${i("pause")} pause${t.freeplay?` \xB7 ${i("resetBall")} balle \xB7 ${i("shootBall")} tir`:""}`,12),e.tutorialSeen=!0,this.saveSettings()}this.sound.init(),this.sound.stopMusic(),document.body.style.cursor="none"}enterFullscreen(){if(!this.isApp)try{let t=document.documentElement;!document.fullscreenElement&&t.requestFullscreen&&t.requestFullscreen().then(()=>{screen.orientation&&screen.orientation.lock&&screen.orientation.lock("landscape").catch(()=>{})}).catch(()=>{})}catch{}}createCarViews(t){this.carViews.forEach(i=>{this.scene.remove(i.group),i.dispose()});let e=this.settings,n=new Set(this.locals.map(i=>i.car));this.carViews=t.cars.map((i,r)=>{let a=n.has(i),o=a?new lt(e.accent).getHex():rm[(r*3+1)%rm.length],c=a&&e.boostColor!=="team"?new lt(e.boostColor).getHex():null,l=new ja(i,{teamColor:ur[i.team].main,accent:o,boostColor:c,showName:!a||this.splitscreen}),h=this.locals.findIndex(d=>d.car===i);return l.nameTag&&h>=0&&l.nameTag.layers.set(2+h),this.scene.add(l.group),l})}clearMatch(){this.match=null,this.touch&&this.touch.show(!1),this.carViews.forEach(t=>{this.scene.remove(t.group),t.dispose()}),this.carViews=[],this.bots=[],this.locals=[],this.hud.clear(),this.hud.root.classList.add("hidden")}startAttract(){this.clearMatch(),this.mode="menu",this.splitscreen=!1;let t=am(_u),e=Object.keys(Tn),n=[];for(let i=0;i<2;i++)for(let r=0;r<2;r++)n.push({team:i,name:t.pop(),body:e[(i*2+r)%4],isBot:!0});this.match=new Ja({players:n,duration:0,replays:!1}),this.bots=this.match.cars.map(i=>new Ka(i,"allstar")),this.createCarViews(this.match),this.rigs[0].reset(),this.attractTime=0,document.body.style.cursor=""}restart(){this.lastConfig&&this.startMatch(this.lastConfig)}resume(){this.paused=!1,this.menus.hide(),this.menus.stack=[],document.body.style.cursor="none"}pause(){this.mode!=="match"||this.match.state==="ended"||(this.paused=!0,this.touch&&this.touch.show(!1),this.menus.stack=[],this.menus.show("pause",!1),this.sound.silenceEngines(),document.body.style.cursor="")}quitToMenu(){this.paused=!1,this.menus.stack=[],this.startAttract(),this.menus.show("main",!1),this.sound.startMusic()}inMatch(){return this.mode==="match"}localTeam(){return this.locals.length?this.locals[0].car.team:0}localTeams(){return new Set(this.locals.map(t=>t.car.team))}onMenuChange(t){t==="garage"?this.enterGarage():this.garage&&this.exitGarage(),(t==="play"||t==="free")&&this.mode==="menu"&&this.buildWorld(this.settings.theme)}enterGarage(){this.garage||(this.garage={t:0,view:null},this.rigs[0].reset(),this.refreshGarage())}refreshGarage(){if(!this.garage)return;let t=this.settings;this.garage.view&&(this.scene.remove(this.garage.view.group),this.garage.view.dispose());let e={bodyKey:t.body,name:t.playerName,team:0},n=new ja(e,{teamColor:ur[0].main,accent:new lt(t.accent).getHex(),boostColor:t.boostColor!=="team"?new lt(t.boostColor).getHex():null,showName:!1});this.scene.add(n.group),this.garage.view=n}exitGarage(){this.garage&&(this.garage.view&&(this.scene.remove(this.garage.view.group),this.garage.view.dispose()),this.garage=null,this.rigs[0].reset())}viewports(){return this.mode==="match"&&this.splitscreen&&this.locals.length>1?[{x:0,y:0,w:1,h:.5},{x:0,y:.5,w:1,h:.5}]:[{x:0,y:0,w:1,h:1}]}frame(t){requestAnimationFrame(i=>this.frame(i));let e=Math.min(.1,(t-this.last)/1e3);this.last=t,this.fpsFrames++,this.fpsTime+=e,this.fpsTime>.5&&(this.fps=Math.round(this.fpsFrames/this.fpsTime),this.fpsFrames=0,this.fpsTime=0),this.input.poll(),this.handleUiInput();let n=this.match&&!this.paused&&!this.garage;if(n){this.acc+=e;let i=0;for(;this.acc>=io&&i<12;)this.step(),this.acc-=io,i++;i===12&&(this.acc=0)}this.processEvents(),this.render(e,n)}handleUiInput(){let t=this.input,e=this.splitscreen;if(this.menus.isOpen()){for(let n=0;n<2;n++)for(let i of t.padFor(n,!1)){let r=t.padPressed.get(i.index)||[];r[12]&&this.menus.navigate(-1),r[13]&&this.menus.navigate(1),r[0]&&this.menus.activate(),r[1]&&this.menus.back()}this.mode==="match"&&t.pressed("pause",0,!1)&&this.menus.screen==="pause"?this.resume():t.frameKeys&&t.frameKeys.has("Escape")&&this.menus.screen!=="main"&&this.menus.screen!=="pause"&&this.menus.screen!=="end"&&this.menus.back();return}if(this.mode==="match"){for(let n=0;n<this.locals.length;n++){if(t.pressed("pause",n,e)){this.pause();return}t.pressed("ballCam",n,e)&&(this.rigs[n].ballCam=!this.rigs[n].ballCam),this.match.state==="replay"&&t.pressed("jump",n,e)&&this.match.requestSkip()}if(this.match.opts.freeplay&&this.locals[0])t.pressed("resetBall",0,e)&&this.freeplayBall(!1),t.pressed("shootBall",0,e)&&this.freeplayBall(!0);else for(let n=0;n<this.locals.length;n++){let i=t.quickChat(n,e);i>=0&&this.say(this.locals[n].car,fM[i])}}}say(t,e){if(this.mode!=="match"||!this.match||!this.match.cars.includes(t))return;let n=performance.now();t.chatLog=(t.chatLog||[]).filter(i=>n-i<4e3),!(t.chatLog.length>=3)&&(t.chatLog.push(n),this.hud.chat(t,e))}botChatter(t){if(this.mode!=="match"||this.match.opts.freeplay)return;let e=this.match.cars.filter(r=>r.isBot),n=r=>r[Math.floor(Math.random()*r.length)],i=(r,a)=>setTimeout(()=>this.say(r,a),700+Math.random()*1500);if(t.type==="goal"){let r=e.filter(o=>o.team===t.team),a=e.filter(o=>o.team!==t.team);r.length&&Math.random()<.5&&i(n(r),t.scorer&&t.scorer.isBot&&r.includes(t.scorer)?n(["Calcul\xE9.","Et c'est dedans !"]):n(["Joli tir !","Quel but !","Merci !"])),a.length&&Math.random()<.35&&i(n(a),n(["Oups\u2026","\xC7a arrive\u2026","Pas mal."]))}else if(t.type==="stat"&&t.label.startsWith("ARR\xCAT")&&Math.random()<.35){let r=e.filter(a=>a!==t.car);r.length&&i(n(r),"Quel arr\xEAt !")}else t.type==="end"&&e.forEach(r=>{Math.random()<.6&&i(r,n(["GG","Bien jou\xE9 !","Belle partie !"]))})}rumble(t,e,n,i){let r=this.locals.findIndex(a=>a.car===t);if(!(r<0))for(let a of this.input.padFor(r,this.splitscreen))try{a.vibrationActuator&&a.vibrationActuator.playEffect&&a.vibrationActuator.playEffect("dual-rumble",{duration:i,strongMagnitude:e,weakMagnitude:n})}catch{}}freeplayBall(t){let e=this.match,n=this.locals[0].car,i=e.ball;if(n.forward(ln),ln.y=0,ln.normalize(),t){let r=Math.random()*Math.PI*2,a=new w(n.pos.x+Math.cos(r)*22,2,n.pos.z+Math.sin(r)*22);a.x=dn.clamp(a.x,-ee.W+4,ee.W-4),a.z=dn.clamp(a.z,-ee.L+4,ee.L-4);let o=n.pos.clone().addScaledVector(ln,8);o.y=5+Math.random()*5;let c=2.2;i.reset(a.x,a.y,a.z),i.vel.copy(o).sub(a).multiplyScalar(1/c),i.vel.y-=.5*ut.gravity*c}else{let r=n.pos.clone().addScaledVector(ln,7);r.x=dn.clamp(r.x,-ee.W+3,ee.W-3),r.z=dn.clamp(r.z,-ee.L+3,ee.L-3),i.reset(r.x,1.5,r.z)}e.state="playing",e.refreshPrediction()}step(){let t=this.match;for(let e of this.locals)this.input.controls(e.index,this.splitscreen,e.car.controls);for(let e of this.bots)e.update(io,t);t.tick(io),t.events.length&&(this.frameEvents.push(...t.events),t.events.length=0),this.mode==="menu"&&t.state==="playing"&&t.time>240&&t.kickoff===!1&&Math.random()<5e-4&&t.resetKickoff()}processEvents(){let t=this.match,e=this.mode==="match",n=new Set(this.locals.map(i=>i.car));for(let i of this.frameEvents)switch(e&&(this.hud.onEvent(i,t),this.botChatter(i)),i.type){case"hit":this.effects.sparks(i.pos,i.strength),e&&this.sound.hit(i.pos,i.strength),this.rumble(i.car,Math.min(1,i.strength/20),Math.min(1,i.strength/12),90),n.has(i.car)&&this.rigs[this.locals.findIndex(r=>r.car===i.car)].addShake(Math.min(.25,i.strength*.01));break;case"bounce":e&&this.sound.bounce(i.pos,i.strength);break;case"jump":case"dodge":n.has(i.car)&&this.sound.jump(i.car.pos);break;case"pad":this.effects.padPickup(i.pos,i.big),n.has(i.car)&&this.sound.pad(i.pos,i.big);break;case"bump":e&&this.sound.bump(i.pos,i.strength),this.rumble(i.victim,.7,.5,150),this.rumble(i.attacker,.4,.4,100);break;case"demo":this.effects.demolition(i.pos,ur[i.victim.team].main),e&&this.sound.explosion(i.pos,!1),this.locals.forEach((r,a)=>{(r.car===i.victim||r.car===i.attacker)&&this.rigs[a].addShake(.4)}),this.rumble(i.victim,1,1,400),this.rumble(i.attacker,.6,.8,200);break;case"goal":this.effects.explosion(i.pos,ur[i.team].main,!0),e&&this.sound.explosion(i.pos,!0),e&&this.sound.horn(this.localTeams().has(i.team)),this.rigs.forEach(r=>r.addShake(.7)),this.locals.forEach(r=>this.rumble(r.car,.8,.8,600));break;case"replayGoal":this.effects.explosion(i.pos,ur[i.team].main,!0),e&&this.sound.explosion(i.pos,!0);break;case"kickoff":case"replayStart":this.effects.clear(),this.rigs.forEach(r=>r.reset());break;case"countdown":e&&this.sound.beep(!1);break;case"go":e&&this.sound.beep(!0);break;case"overtime":e&&this.sound.beep(!0);break;case"end":e&&(this.endTimer=2.5,this.sound.cheer(4));break;default:break}this.frameEvents.length=0}visualStates(t){let e=this.match,n=[];if(e.state==="replay"&&e.replay){let r=e.replaySnapshot(e.replay.time),{a,b:o,k:c}=r,l=Math.max(.001,o.t-a.t);e.cars.forEach((u,f)=>{let m=a.cars[f],x=o.cars[f],g=new w(m[0]+(x[0]-m[0])*c,m[1]+(x[1]-m[1])*c,m[2]+(x[2]-m[2])*c),p=new re(m[3],m[4],m[5],m[6]),M=new re(x[3],x[4],x[5],x[6]),S=new w(x[0]-m[0],x[1]-m[1],x[2]-m[2]).multiplyScalar(1/l);S.lengthSq()>3e3&&S.set(0,0,0),n.push({pos:g,quat:p.slerp(M,c),boosting:!!m[7],demolished:!!m[8],steer:m[9],spin:m[10]+(x[10]-m[10])*c,supersonic:!!m[11],vel:S,onGround:!0,groundNormal:new w(0,1,0)})});let h=a.ball,d=o.ball;return{cars:n,ball:{pos:new w(h[0]+(d[0]-h[0])*c,h[1]+(d[1]-h[1])*c,h[2]+(d[2]-h[2])*c),quat:new re(h[3],h[4],h[5],h[6]).slerp(new re(d[3],d[4],d[5],d[6]),c),hidden:!!h[7]}}}for(let r of e.cars)n.push({pos:new w().lerpVectors(r.prevPos,r.pos,t),quat:new re().slerpQuaternions(r.prevQuat,r.quat,t),boosting:r.boosting,demolished:r.demolished,steer:r.steerVis,spin:r.wheelSpin,supersonic:r.supersonic,vel:r.vel,onGround:r.onGround,groundNormal:r.groundNormal,braking:r.onGround&&(r.controls.handbrake||r.controls.throttle*r.vel.dot(r.forward(ln))<-.5)});let i=e.ball;return{cars:n,ball:{pos:new w().lerpVectors(i.prevPos,i.pos,t),quat:new re().slerpQuaternions(i.prevQuat,i.quat,t),hidden:i.hidden}}}render(t,e){let n=this.match,i=performance.now()/1e3,r=e?this.acc/io:1,a=this.visualStates(r);a.cars.forEach((p,M)=>{let S=this.carViews[M];if(S&&(S.update(p,i),this.garage&&(S.group.visible=!1),!(p.demolished||this.garage||!e))){if(p.boosting){wr.set(1,0,0).applyQuaternion(p.quat);for(let y=0;y<2;y++)S.exhaustWorld(y,ln),this.effects.boost(ln,wr,p.vel,S.boostColor,p.supersonic)}if(p.supersonic)for(let y of[1,-1])ln.set(S.backX,S.wheelBaseY+.05,y*S.halfWidth).applyQuaternion(p.quat).add(p.pos),this.effects.trail(ln,new lt(.8,.9,1.2))}});let o=a.ball;this.ballMesh.visible=!o.hidden&&!this.garage,this.ballMesh.position.copy(o.pos),this.ballMesh.quaternion.copy(o.quat);let c=n.state==="replay"?0:n.ball.vel.length();if(e&&this.ballMesh.visible&&c>19&&!this.garage){let p=Math.min(1,(c-19)/15);this.effects.trail(o.pos,pM.clone().multiplyScalar(.35+p*.5),1.1)}let l=o.pos.y-ut.ballRadius;this.ballShadow.visible=this.ballMesh.visible&&Math.abs(o.pos.x)<ee.W-2&&Math.abs(o.pos.z)<ee.L+ee.GD,this.ballShadow.position.set(o.pos.x,.03,o.pos.z);let h=1+l*.05;this.ballShadow.scale.set(h,h,h),this.ballShadow.material.opacity=Math.max(.15,.85-l*.035),this.world&&this.world.updatePads(t,n.pads),this.effects.update(e?t:0);let d=this.viewports(),u=window.innerWidth,f=window.innerHeight;d.forEach((p,M)=>{let S=this.cameras[M],y=p.w*u/(p.h*f);S.aspect=y,S.fov=Zp(this.mode==="match"?this.settings.fov:90,y),S.updateProjectionMatrix()}),this.updateCameras(t,a);let m=this.cameras[0];if(this.sound.setListener(m.position,ln.set(1,0,0).applyQuaternion(m.quaternion)),this.mode==="match"&&!this.paused&&n.state!=="replay"){this.locals.forEach((M,S)=>{let y=M.car;this.sound.updateEngine(S,y.vel.length(),y.controls.throttle,y.boosting,y.onGround,!y.demolished,this.locals.length)});let p=Math.abs(n.ball.pos.z);this.sound.setCrowd(.35+Math.max(0,1-(ee.L-p)/30)*.6)}else this.sound.silenceEngines(),this.sound.setCrowd(this.mode==="menu"?.15:.3);let x=this.renderer,g=x.getPixelRatio();if(d.length===1&&this.composer?(this.effects.setViewportHeight(f*g/(2*Math.tan(dn.degToRad(this.cameras[0].fov)/2))),this.renderPass.camera=this.cameras[0],this.composer.render(t)):(x.setScissorTest(!0),d.forEach((p,M)=>{let S=p.x*u,y=(1-p.y-p.h)*f;x.setViewport(S,y,p.w*u,p.h*f),x.setScissor(S,y,p.w*u,p.h*f),this.effects.setViewportHeight(p.h*f*g/(2*Math.tan(dn.degToRad(this.cameras[M].fov)/2))),x.render(this.scene,this.cameras[M])}),x.setScissorTest(!1),x.setViewport(0,0,u,f)),this.mode==="match"&&n){let p=this.locals.some((M,S)=>this.input.held("scoreboard",S,this.splitscreen));this.touch&&(this.touch.show(!this.paused&&!this.menus.isOpen()&&n.state!=="ended",n.opts.freeplay),this.touch.setBallCam(this.rigs[0].ballCam)),this.hud.update(t,n,this.locals,{ballCam:this.rigs.map(M=>M.ballCam),showFps:this.settings.showFps,fps:this.fps,scoreboard:p&&!this.paused}),this.endTimer>0&&(this.endTimer-=t,this.endTimer<=0&&(this.menus.stack=[],this.menus.show("end",!1),document.body.style.cursor=""))}}replayCamera(t,e){let n=this.match,i=e.ball.pos,r=n.goalInfo,o=(r?r.team:0)===0?ee.L:-ee.L,c=Math.sign(o),l=n.replay.time>n.replay.goalTime-1.3,h=new w,d=new w().copy(i),u=r&&r.scorer?n.cars.indexOf(r.scorer):-1,f=u>=0?e.cars[u]:null,m=6;if(l){let x=i.x>=0?1:-1;h.set(x*(ee.GW+3.5),4.2,o-c*12),m=this.replayShot==="finish"?3:1e3,this.replayShot="finish"}else if(f&&!f.demolished){let x=ln.copy(f.pos).sub(i);x.y=0,x.lengthSq()<.5&&x.set(0,0,-c),x.normalize(),h.copy(f.pos).addScaledVector(x,4.5),h.y+=1.8,d.lerp(f.pos,.25),this.replayShot="chase"}else{let x=ln.set(i.x*.3,0,i.z-o);x.lengthSq()<1&&x.set(0,0,-c),x.normalize(),h.copy(i).addScaledVector(x,11),h.y=Math.max(i.y+3.5,4),this.replayShot="ball"}Oc(h,1),this.rigs.forEach((x,g)=>{g>=this.viewports().length||(m>100&&x.reset(),x.setView(t,h,d,Math.min(m,8)))})}updateCameras(t,e){let n=this.match,i=this.settings,r={camDistance:i.camDistance,camHeight:i.camHeight,camStiffness:i.camStiffness};if(this.garage){this.garage.t+=t;let a=this.garage;a.view.update({pos:new w(0,Tn[i.body].hy+ut.rideHeight,0),quat:new re().setFromAxisAngle(new w(0,1,0),a.t*.5),boosting:Math.sin(a.t*.8)>.6,demolished:!1,steer:Math.sin(a.t*.7)*.6,spin:a.t*3,supersonic:!1},performance.now()/1e3);let o=.75+Math.sin(a.t*.2)*.25,c=2.9;ln.set(Math.cos(o)*c,1,Math.sin(o)*c),wr.set(-Math.sin(o),0,Math.cos(o)).multiplyScalar(1.05),wr.y=.3,this.rigs[0].setView(t,ln,wr,3);return}if(n.state==="replay"){this.replayCamera(t,e);return}if(this.mode==="menu"){if(this.attractTime+=t,Math.floor(this.attractTime/11)%3===1&&e.cars[0]){let h=e.cars[Math.floor(this.attractTime/33)%e.cars.length];if(!h.demolished){this.rigs[0].ballCam=!0,this.rigs[0].follow(t,h,e.ball.pos,{camDistance:3.2,camHeight:1.3,camStiffness:6});return}}let o=this.attractTime*.06,c=e.ball.pos,l=ln.set(Math.sin(o)*34,13+Math.sin(o*.7)*4,Math.cos(o)*44);Oc(l,1),this.rigs[0].setView(t,l,wr.copy(c).multiplyScalar(.7),2);return}this.locals.forEach((a,o)=>{let c=e.cars[this.match.cars.indexOf(a.car)];if(!c)return;let[l]=this.input.lookStick(o,this.splitscreen);if(this.rigs[o].swivel+=(l*Math.PI-this.rigs[o].swivel)*Math.min(1,t*10),c.demolished){this.rigs[o].setView(t,this.rigs[o].pos,e.ball.pos,2);return}this.rigs[o].follow(t,c,e.ball.hidden?null:e.ball.pos,r)})}};function om(){try{let s=document.createElement("canvas");if(!(s.getContext("webgl2")||s.getContext("webgl")))throw new Error("WebGL indisponible")}catch{let t=document.createElement("div");t.id="webgl-error",t.innerHTML="<div><h2>WebGL est d\xE9sactiv\xE9</h2><p>Active l'acc\xE9l\xE9ration mat\xE9rielle de ton navigateur (Chrome, Edge ou Firefox) puis recharge la page.</p></div>",document.body.appendChild(t);return}window.app=new Wu}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",om):om();})();
/*! Bundled license information:

three/build/three.core.js:
three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2026 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
