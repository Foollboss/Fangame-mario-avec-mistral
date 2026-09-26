(()=>{var Td=0,Ph=1,wd=2;var is=1,Ed=2,Js=3,Ni=0,Be=1,ze=2,En=0,Ui=1,dn=2,Ih=3,Lh=4,Ad=5;var ss=100,Rd=101,Cd=102,Pd=103,Id=104,Ld=200,Dd=201,Nd=202,Ud=203,Dh=204,Nh=205,Fd=206,Od=207,Bd=208,zd=209,kd=210,Vd=211,Hd=212,Gd=213,Wd=214,Fo=0,Oo=1,Bo=2,Fs=3,zo=4,ko=5,Vo=6,Ho=7,_l=0,Xd=1,qd=2,Vn=0,Sa=1,ba=2,Ta=3,rs=4,wa=5,Ea=6,Aa=7;var Uh=300,Fi=301,as=302,vl=303,yl=304,Ra=306,Ri=1e3,Jn=1001,Go=1002,qe=1003,Yd=1004;var Ca=1005;var $e=1006,Ml=1007;var Oi=1008;var fn=1009,Fh=1010,Oh=1011,Ks=1012,Sl=1013,Hn=1014,An=1015,Ze=1016,bl=1017,Tl=1018,Qs=1020,Bh=35902,zh=35899,kh=1021,Vh=1022,Rn=1023,jn=1026,Bi=1027,wl=1028,El=1029,zi=1030,Al=1031;var Rl=1033,Pa=33776,Ia=33777,La=33778,Da=33779,Cl=35840,Pl=35841,Il=35842,Ll=35843,Dl=36196,Nl=37492,Ul=37496,Fl=37488,Ol=37489,Na=37490,Bl=37491,zl=37808,kl=37809,Vl=37810,Hl=37811,Gl=37812,Wl=37813,Xl=37814,ql=37815,Yl=37816,$l=37817,Zl=37818,Jl=37819,Kl=37820,Ql=37821,jl=36492,tc=36494,ec=36495,nc=36283,ic=36284,Ua=36285,sc=36286;var Or=2300,Wo=2301,No=2302,xh=2303,_h=2400,vh=2401,yh=2402;var $d=3200;var Fa=0,Zd=1,mi="",We="srgb",Br="srgb-linear",zr="linear",oe="srgb";var Uo=7680;var Jd=519,Kd=512,Qd=513,jd=514,rc=515,tf=516,ef=517,ac=518,nf=519,Hh=35044,js=35048;var Gh="300 es",On=2e3,Os=2001;function nm(s){for(let t=s.length-1;t>=0;--t)if(s[t]>=65535)return!0;return!1}function im(s){return ArrayBuffer.isView(s)&&!(s instanceof DataView)}function kr(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function sf(){let s=kr("canvas");return s.style.display="block",s}var Wu={},Bs=null;function Vr(...s){let t="THREE."+s.shift();Bs?Bs("log",t,...s):console.log(t,...s)}function rf(s){let t=s[0];if(typeof t=="string"&&t.startsWith("TSL:")){let e=s[1];e&&e.isStackTrace?s[0]+=" "+e.getLocation():s[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return s}function kt(...s){s=rf(s);let t="THREE."+s.shift();if(Bs)Bs("warn",t,...s);else{let e=s[0];e&&e.isStackTrace?console.warn(e.getError(t)):console.warn(t,...s)}}function Ht(...s){s=rf(s);let t="THREE."+s.shift();if(Bs)Bs("error",t,...s);else{let e=s[0];e&&e.isStackTrace?console.error(e.getError(t)):console.error(t,...s)}}function Ji(...s){let t=s.join(" ");t in Wu||(Wu[t]=!0,kt(...s))}function af(s,t,e){return new Promise(function(n,i){function r(){switch(s.clientWaitSync(t,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:i();break;case s.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}var of={[Fo]:Oo,[Bo]:Vo,[zo]:Ho,[Fs]:ko,[Oo]:Fo,[Vo]:Bo,[Ho]:zo,[ko]:Fs},ti=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){let n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){let n=this._listeners;if(n===void 0)return;let i=n[t];if(i!==void 0){let r=i.indexOf(e);r!==-1&&i.splice(r,1)}}dispatchEvent(t){let e=this._listeners;if(e===void 0)return;let n=e[t.type];if(n!==void 0){t.target=this;let i=n.slice(0);for(let r=0,a=i.length;r<a;r++)i[r].call(this,t);t.target=null}}},Qe=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Xu=1234567,Dr=Math.PI/180,zs=180/Math.PI;function Qn(){let s=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Qe[s&255]+Qe[s>>8&255]+Qe[s>>16&255]+Qe[s>>24&255]+"-"+Qe[t&255]+Qe[t>>8&255]+"-"+Qe[t>>16&15|64]+Qe[t>>24&255]+"-"+Qe[e&63|128]+Qe[e>>8&255]+"-"+Qe[e>>16&255]+Qe[e>>24&255]+Qe[n&255]+Qe[n>>8&255]+Qe[n>>16&255]+Qe[n>>24&255]).toLowerCase()}function Kt(s,t,e){return Math.max(t,Math.min(e,s))}function Wh(s,t){return(s%t+t)%t}function sm(s,t,e,n,i){return n+(s-t)*(i-n)/(e-t)}function rm(s,t,e){return s!==t?(e-s)/(t-s):0}function Nr(s,t,e){return(1-e)*s+e*t}function am(s,t,e,n){return Nr(s,t,1-Math.exp(-e*n))}function om(s,t=1){return t-Math.abs(Wh(s,t*2)-t)}function lm(s,t,e){return s<=t?0:s>=e?1:(s=(s-t)/(e-t),s*s*(3-2*s))}function cm(s,t,e){return s<=t?0:s>=e?1:(s=(s-t)/(e-t),s*s*s*(s*(s*6-15)+10))}function hm(s,t){return s+Math.floor(Math.random()*(t-s+1))}function um(s,t){return s+Math.random()*(t-s)}function dm(s){return s*(.5-Math.random())}function fm(s){s!==void 0&&(Xu=s);let t=Xu+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function pm(s){return s*Dr}function mm(s){return s*zs}function gm(s){return s>0&&Number.isInteger(s)&&2**Math.round(Math.log2(s))===s}function xm(s){return Math.pow(2,Math.ceil(Math.log(s)/Math.LN2))}function _m(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function vm(s,t,e,n,i){let r=Math.cos,a=Math.sin,o=r(e/2),l=a(e/2),c=r((t+n)/2),h=a((t+n)/2),d=r((t-n)/2),u=a((t-n)/2),f=r((n-t)/2),m=a((n-t)/2);switch(i){case"XYX":s.set(o*h,l*d,l*u,o*c);break;case"YZY":s.set(l*u,o*h,l*d,o*c);break;case"ZXZ":s.set(l*d,l*u,o*h,o*c);break;case"XZX":s.set(o*h,l*m,l*f,o*c);break;case"YXY":s.set(l*f,o*h,l*m,o*c);break;case"ZYZ":s.set(l*m,l*f,o*h,o*c);break;default:kt("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function Fn(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:case Uint8ClampedArray:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function fe(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}var an={DEG2RAD:Dr,RAD2DEG:zs,generateUUID:Qn,clamp:Kt,euclideanModulo:Wh,mapLinear:sm,inverseLerp:rm,lerp:Nr,damp:am,pingpong:om,smoothstep:lm,smootherstep:cm,randInt:hm,randFloat:um,randFloatSpread:dm,seededRandom:fm,degToRad:pm,radToDeg:mm,isPowerOfTwo:gm,ceilPowerOfTwo:xm,floorPowerOfTwo:_m,setQuaternionFromProperEuler:vm,normalize:fe,denormalize:Fn},Jh=class Jh{constructor(t=0,e=0){this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("THREE.Vector2: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,n=this.y,i=t.elements;return this.x=i[0]*e+i[3]*n+i[6],this.y=i[1]*e+i[4]*n+i[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Kt(this.x,t.x,e.x),this.y=Kt(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=Kt(this.x,t,e),this.y=Kt(this.y,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Kt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(Kt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let n=Math.cos(e),i=Math.sin(e),r=this.x-t.x,a=this.y-t.y;return this.x=r*n-a*i+t.x,this.y=r*i+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};Jh.prototype.isVector2=!0;var it=Jh,re=class{constructor(t=0,e=0,n=0,i=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=i}static slerpFlat(t,e,n,i,r,a,o){let l=n[i+0],c=n[i+1],h=n[i+2],d=n[i+3],u=r[a+0],f=r[a+1],m=r[a+2],v=r[a+3];if(d!==v||l!==u||c!==f||h!==m){let p=l*u+c*f+h*m+d*v;p<0&&(u=-u,f=-f,m=-m,v=-v,p=-p);let g=1-o;if(p<.9995){let M=Math.acos(p),w=Math.sin(M);g=Math.sin(g*M)/w,o=Math.sin(o*M)/w,l=l*g+u*o,c=c*g+f*o,h=h*g+m*o,d=d*g+v*o}else{l=l*g+u*o,c=c*g+f*o,h=h*g+m*o,d=d*g+v*o;let M=1/Math.sqrt(l*l+c*c+h*h+d*d);l*=M,c*=M,h*=M,d*=M}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=d}static multiplyQuaternionsFlat(t,e,n,i,r,a){let o=n[i],l=n[i+1],c=n[i+2],h=n[i+3],d=r[a],u=r[a+1],f=r[a+2],m=r[a+3];return t[e]=o*m+h*d+l*f-c*u,t[e+1]=l*m+h*u+c*d-o*f,t[e+2]=c*m+h*f+o*u-l*d,t[e+3]=h*m-o*d-l*u-c*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,i){return this._x=t,this._y=e,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){let n=t._x,i=t._y,r=t._z,a=t._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(i/2),d=o(r/2),u=l(n/2),f=l(i/2),m=l(r/2);switch(a){case"XYZ":this._x=u*h*d+c*f*m,this._y=c*f*d-u*h*m,this._z=c*h*m+u*f*d,this._w=c*h*d-u*f*m;break;case"YXZ":this._x=u*h*d+c*f*m,this._y=c*f*d-u*h*m,this._z=c*h*m-u*f*d,this._w=c*h*d+u*f*m;break;case"ZXY":this._x=u*h*d-c*f*m,this._y=c*f*d+u*h*m,this._z=c*h*m+u*f*d,this._w=c*h*d-u*f*m;break;case"ZYX":this._x=u*h*d-c*f*m,this._y=c*f*d+u*h*m,this._z=c*h*m-u*f*d,this._w=c*h*d+u*f*m;break;case"YZX":this._x=u*h*d+c*f*m,this._y=c*f*d+u*h*m,this._z=c*h*m-u*f*d,this._w=c*h*d-u*f*m;break;case"XZY":this._x=u*h*d-c*f*m,this._y=c*f*d-u*h*m,this._z=c*h*m+u*f*d,this._w=c*h*d+u*f*m;break;default:kt("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let n=e/2,i=Math.sin(n);return this._x=t.x*i,this._y=t.y*i,this._z=t.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,n=e[0],i=e[4],r=e[8],a=e[1],o=e[5],l=e[9],c=e[2],h=e[6],d=e[10],u=n+o+d;if(u>0){let f=.5/Math.sqrt(u+1);this._w=.25/f,this._x=(h-l)*f,this._y=(r-c)*f,this._z=(a-i)*f}else if(n>o&&n>d){let f=2*Math.sqrt(1+n-o-d);this._w=(h-l)/f,this._x=.25*f,this._y=(i+a)/f,this._z=(r+c)/f}else if(o>d){let f=2*Math.sqrt(1+o-n-d);this._w=(r-c)/f,this._x=(i+a)/f,this._y=.25*f,this._z=(l+h)/f}else{let f=2*Math.sqrt(1+d-n-o);this._w=(a-i)/f,this._x=(r+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Kt(this.dot(t),-1,1)))}rotateTowards(t,e){let n=this.angleTo(t);if(n===0)return this;let i=Math.min(1,e/n);return this.slerp(t,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let n=t._x,i=t._y,r=t._z,a=t._w,o=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+a*o+i*c-r*l,this._y=i*h+a*l+r*o-n*c,this._z=r*h+a*c+n*l-i*o,this._w=a*h-n*o-i*l-r*c,this._onChangeCallback(),this}slerp(t,e){let n=t._x,i=t._y,r=t._z,a=t._w,o=this.dot(t);o<0&&(n=-n,i=-i,r=-r,a=-a,o=-o);let l=1-e;if(o<.9995){let c=Math.acos(o),h=Math.sin(c);l=Math.sin(l*c)/h,e=Math.sin(e*c)/h,this._x=this._x*l+n*e,this._y=this._y*l+i*e,this._z=this._z*l+r*e,this._w=this._w*l+a*e,this._onChangeCallback()}else this._x=this._x*l+n*e,this._y=this._y*l+i*e,this._z=this._z*l+r*e,this._w=this._w*l+a*e,this.normalize();return this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){let t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(i*Math.sin(t),i*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},Kh=class Kh{constructor(t=0,e=0,n=0){this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("THREE.Vector3: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(qu.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(qu.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,n=this.y,i=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*i,this.y=r[1]*e+r[4]*n+r[7]*i,this.z=r[2]*e+r[5]*n+r[8]*i,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,n=this.y,i=this.z,r=t.elements,a=1/(r[3]*e+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*i+r[12])*a,this.y=(r[1]*e+r[5]*n+r[9]*i+r[13])*a,this.z=(r[2]*e+r[6]*n+r[10]*i+r[14])*a,this}applyQuaternion(t){let e=this.x,n=this.y,i=this.z,r=t.x,a=t.y,o=t.z,l=t.w,c=2*(a*i-o*n),h=2*(o*e-r*i),d=2*(r*n-a*e);return this.x=e+l*c+a*d-o*h,this.y=n+l*h+o*c-r*d,this.z=i+l*d+r*h-a*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,n=this.y,i=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*i,this.y=r[1]*e+r[5]*n+r[9]*i,this.z=r[2]*e+r[6]*n+r[10]*i,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Kt(this.x,t.x,e.x),this.y=Kt(this.y,t.y,e.y),this.z=Kt(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=Kt(this.x,t,e),this.y=Kt(this.y,t,e),this.z=Kt(this.z,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Kt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let n=t.x,i=t.y,r=t.z,a=e.x,o=e.y,l=e.z;return this.x=i*l-r*o,this.y=r*a-n*l,this.z=n*o-i*a,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return qc.copy(this).projectOnVector(t),this.sub(qc)}reflect(t){return this.sub(qc.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(Kt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y,i=this.z-t.z;return e*e+n*n+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){let i=Math.sin(e)*t;return this.x=i*Math.sin(n),this.y=Math.cos(e)*t,this.z=i*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),i=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=i,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};Kh.prototype.isVector3=!0;var E=Kh,qc=new E,qu=new re,Qh=class Qh{constructor(t,e,n,i,r,a,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,i,r,a,o,l,c)}set(t,e,n,i,r,a,o,l,c){let h=this.elements;return h[0]=t,h[1]=i,h[2]=o,h[3]=e,h[4]=r,h[5]=l,h[6]=n,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,i=e.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],h=n[4],d=n[7],u=n[2],f=n[5],m=n[8],v=i[0],p=i[3],g=i[6],M=i[1],w=i[4],y=i[7],b=i[2],T=i[5],P=i[8];return r[0]=a*v+o*M+l*b,r[3]=a*p+o*w+l*T,r[6]=a*g+o*y+l*P,r[1]=c*v+h*M+d*b,r[4]=c*p+h*w+d*T,r[7]=c*g+h*y+d*P,r[2]=u*v+f*M+m*b,r[5]=u*p+f*w+m*T,r[8]=u*g+f*y+m*P,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8];return e*a*h-e*o*c-n*r*h+n*o*l+i*r*c-i*a*l}invert(){let t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],d=h*a-o*c,u=o*l-h*r,f=c*r-a*l,m=e*d+n*u+i*f;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);let v=1/m;return t[0]=d*v,t[1]=(i*c-h*n)*v,t[2]=(o*n-i*a)*v,t[3]=u*v,t[4]=(h*e-i*l)*v,t[5]=(i*r-o*e)*v,t[6]=f*v,t[7]=(n*l-c*e)*v,t[8]=(a*e-n*r)*v,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,i,r,a,o){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+t,-i*c,i*l,-i*(-c*a+l*o)+o+e,0,0,1),this}scale(t,e){return Ji("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Yc.makeScale(t,e)),this}rotate(t){return Ji("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Yc.makeRotation(-t)),this}translate(t,e){return Ji("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Yc.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,n=t.elements;for(let i=0;i<9;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}};Qh.prototype.isMatrix3=!0;var Wt=Qh,Yc=new Wt,Yu=new Wt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),$u=new Wt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function ym(){let s={enabled:!0,workingColorSpace:Br,spaces:{},convert:function(i,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===oe&&(i.r=pi(i.r),i.g=pi(i.g),i.b=pi(i.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(i.applyMatrix3(this.spaces[r].toXYZ),i.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===oe&&(i.r=Us(i.r),i.g=Us(i.g),i.b=Us(i.b))),i},workingToColorSpace:function(i,r){return this.convert(i,this.workingColorSpace,r)},colorSpaceToWorking:function(i,r){return this.convert(i,r,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===mi?zr:this.spaces[i].transfer},getToneMappingMode:function(i){return this.spaces[i].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(i,r=this.workingColorSpace){return i.fromArray(this.spaces[r].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,r,a){return i.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(i,r){return Ji("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),s.workingToColorSpace(i,r)},toWorkingColorSpace:function(i,r){return Ji("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),s.colorSpaceToWorking(i,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return s.define({[Br]:{primaries:t,whitePoint:n,transfer:zr,toXYZ:Yu,fromXYZ:$u,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:We},outputColorSpaceConfig:{drawingBufferColorSpace:We}},[We]:{primaries:t,whitePoint:n,transfer:oe,toXYZ:Yu,fromXYZ:$u,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:We}}}),s}var Qt=ym();function pi(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function Us(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}var xs,Xo=class{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{xs===void 0&&(xs=kr("canvas")),xs.width=t.width,xs.height=t.height;let i=xs.getContext("2d");t instanceof ImageData?i.putImageData(t,0,0):i.drawImage(t,0,0,t.width,t.height),n=xs}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=kr("canvas");e.width=t.width,e.height=t.height;let n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);let i=n.getImageData(0,0,t.width,t.height),r=i.data;for(let a=0;a<r.length;a++)r[a]=pi(r[a]/255)*255;return n.putImageData(i,0,0),e}else if(t.data){let e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(pi(e[n]/255)*255):e[n]=pi(e[n]);return{data:e,width:t.width,height:t.height}}else return kt("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},Mm=0,ks=class{constructor(t=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:Mm++}),this.uuid=Qn(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){let e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):typeof VideoFrame<"u"&&e instanceof VideoFrame?t.set(e.displayWidth,e.displayHeight,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let a=0,o=i.length;a<o;a++)i[a].isDataTexture?r.push($c(i[a].image)):r.push($c(i[a]))}else r=$c(i);n.url=r}return e||(t.images[this.uuid]=n),n}};function $c(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?Xo.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(kt("Texture: Unable to serialize Texture."),{})}var Sm=0,Zc=new E,rn=class s extends ti{constructor(t=s.DEFAULT_IMAGE,e=s.DEFAULT_MAPPING,n=Jn,i=Jn,r=$e,a=Oi,o=Rn,l=fn,c=s.DEFAULT_ANISOTROPY,h=mi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Sm++}),this.uuid=Qn(),this.name="",this.source=new ks(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new it(0,0),this.repeat=new it(1,1),this.center=new it(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Wt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Zc).x}get height(){return this.source.getSize(Zc).y}get depth(){return this.source.getSize(Zc).z}get image(){return this.source.data}set image(t){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.normalized=t.normalized,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(let e in t){let n=t[e];if(n===void 0){kt(`Texture.setValues(): parameter '${e}' has value of undefined.`);continue}let i=this[e];if(i===void 0){kt(`Texture.setValues(): property '${e}' does not exist.`);continue}i&&n&&i.isVector2&&n.isVector2||i&&n&&i.isVector3&&n.isVector3||i&&n&&i.isMatrix3&&n.isMatrix3?i.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Uh)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Ri:t.x=t.x-Math.floor(t.x);break;case Jn:t.x=t.x<0?0:1;break;case Go:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Ri:t.y=t.y-Math.floor(t.y);break;case Jn:t.y=t.y<0?0:1;break;case Go:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}};rn.DEFAULT_IMAGE=null;rn.DEFAULT_MAPPING=Uh;rn.DEFAULT_ANISOTROPY=1;var jh=class jh{constructor(t=0,e=0,n=0,i=1){this.x=t,this.y=e,this.z=n,this.w=i}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,i){return this.x=t,this.y=e,this.z=n,this.w=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("THREE.Vector4: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,n=this.y,i=this.z,r=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*i+a[12]*r,this.y=a[1]*e+a[5]*n+a[9]*i+a[13]*r,this.z=a[2]*e+a[6]*n+a[10]*i+a[14]*r,this.w=a[3]*e+a[7]*n+a[11]*i+a[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,i,r,l=t.elements,c=l[0],h=l[4],d=l[8],u=l[1],f=l[5],m=l[9],v=l[2],p=l[6],g=l[10];if(Math.abs(h-u)<.01&&Math.abs(d-v)<.01&&Math.abs(m-p)<.01){if(Math.abs(h+u)<.1&&Math.abs(d+v)<.1&&Math.abs(m+p)<.1&&Math.abs(c+f+g-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let w=(c+1)/2,y=(f+1)/2,b=(g+1)/2,T=(h+u)/4,P=(d+v)/4,_=(m+p)/4;return w>y&&w>b?w<.01?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(w),i=T/n,r=P/n):y>b?y<.01?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(y),n=T/i,r=_/i):b<.01?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(b),n=P/r,i=_/r),this.set(n,i,r,e),this}let M=Math.sqrt((p-m)*(p-m)+(d-v)*(d-v)+(u-h)*(u-h));return Math.abs(M)<.001&&(M=1),this.x=(p-m)/M,this.y=(d-v)/M,this.z=(u-h)/M,this.w=Math.acos((c+f+g-1)/2),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Kt(this.x,t.x,e.x),this.y=Kt(this.y,t.y,e.y),this.z=Kt(this.z,t.z,e.z),this.w=Kt(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=Kt(this.x,t,e),this.y=Kt(this.y,t,e),this.z=Kt(this.z,t,e),this.w=Kt(this.w,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Kt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};jh.prototype.isVector4=!0;var Ae=jh,qo=class extends ti{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:$e,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new Ae(0,0,t,e),this.scissorTest=!1,this.viewport=new Ae(0,0,t,e),this.textures=[];let i={width:t,height:e,depth:n.depth},r=new rn(i),a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(t={}){let e={minFilter:$e,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),t!==null&&t.renderTarget===null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let i=0,r=this.textures.length;i<r;i++)this.textures[i].image.width=t,this.textures[i].image.height=e,this.textures[i].image.depth=n,this.textures[i].isData3DTexture!==!0&&(this.textures[i].isArrayTexture=this.textures[i].image.depth>1);this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;let i=Object.assign({},t.textures[e].image);this.textures[e].source=new ks(i)}if(this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveColorBuffer=t.resolveColorBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,this.storeMultisampledColorBuffer=t.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=t.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=t.storeMultisampledStencilBuffer,t.depthTexture!==null)if(t.depthTexture.renderTarget===t){let e=t.depthTexture.clone();e.renderTarget=null,this.depthTexture=e}else this.depthTexture=t.depthTexture;return this.samples=t.samples,this.multiview=t.multiview,this.useArrayDepthTexture=t.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},Fe=class extends qo{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}},Hr=class extends rn{constructor(t=null,e=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=qe,this.minFilter=qe,this.wrapR=Jn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}};var Yo=class extends rn{constructor(t=null,e=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=qe,this.minFilter=qe,this.wrapR=Jn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}};var xl=class xl{constructor(t,e,n,i,r,a,o,l,c,h,d,u,f,m,v,p){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,i,r,a,o,l,c,h,d,u,f,m,v,p)}set(t,e,n,i,r,a,o,l,c,h,d,u,f,m,v,p){let g=this.elements;return g[0]=t,g[4]=e,g[8]=n,g[12]=i,g[1]=r,g[5]=a,g[9]=o,g[13]=l,g[2]=c,g[6]=h,g[10]=d,g[14]=u,g[3]=f,g[7]=m,g[11]=v,g[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new xl().fromArray(this.elements)}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){let e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return this.determinantAffine()===0?(t.set(1,0,0),e.set(0,1,0),n.set(0,0,1),this):(t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){if(t.determinantAffine()===0)return this.identity();let e=this.elements,n=t.elements,i=1/_s.setFromMatrixColumn(t,0).length(),r=1/_s.setFromMatrixColumn(t,1).length(),a=1/_s.setFromMatrixColumn(t,2).length();return e[0]=n[0]*i,e[1]=n[1]*i,e[2]=n[2]*i,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,n=t.x,i=t.y,r=t.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(i),c=Math.sin(i),h=Math.cos(r),d=Math.sin(r);if(t.order==="XYZ"){let u=a*h,f=a*d,m=o*h,v=o*d;e[0]=l*h,e[4]=-l*d,e[8]=c,e[1]=f+m*c,e[5]=u-v*c,e[9]=-o*l,e[2]=v-u*c,e[6]=m+f*c,e[10]=a*l}else if(t.order==="YXZ"){let u=l*h,f=l*d,m=c*h,v=c*d;e[0]=u+v*o,e[4]=m*o-f,e[8]=a*c,e[1]=a*d,e[5]=a*h,e[9]=-o,e[2]=f*o-m,e[6]=v+u*o,e[10]=a*l}else if(t.order==="ZXY"){let u=l*h,f=l*d,m=c*h,v=c*d;e[0]=u-v*o,e[4]=-a*d,e[8]=m+f*o,e[1]=f+m*o,e[5]=a*h,e[9]=v-u*o,e[2]=-a*c,e[6]=o,e[10]=a*l}else if(t.order==="ZYX"){let u=a*h,f=a*d,m=o*h,v=o*d;e[0]=l*h,e[4]=m*c-f,e[8]=u*c+v,e[1]=l*d,e[5]=v*c+u,e[9]=f*c-m,e[2]=-c,e[6]=o*l,e[10]=a*l}else if(t.order==="YZX"){let u=a*l,f=a*c,m=o*l,v=o*c;e[0]=l*h,e[4]=v-u*d,e[8]=m*d+f,e[1]=d,e[5]=a*h,e[9]=-o*h,e[2]=-c*h,e[6]=f*d+m,e[10]=u-v*d}else if(t.order==="XZY"){let u=a*l,f=a*c,m=o*l,v=o*c;e[0]=l*h,e[4]=-d,e[8]=c*h,e[1]=u*d+v,e[5]=a*h,e[9]=f*d-m,e[2]=m*d-f,e[6]=o*h,e[10]=v*d+u}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(bm,t,Tm)}lookAt(t,e,n){let i=this.elements;return xn.subVectors(t,e),xn.lengthSq()===0&&(xn.z=1),xn.normalize(),bi.crossVectors(n,xn),bi.lengthSq()===0&&(Math.abs(n.z)===1?xn.x+=1e-4:xn.z+=1e-4,xn.normalize(),bi.crossVectors(n,xn)),bi.normalize(),ao.crossVectors(xn,bi),i[0]=bi.x,i[4]=ao.x,i[8]=xn.x,i[1]=bi.y,i[5]=ao.y,i[9]=xn.y,i[2]=bi.z,i[6]=ao.z,i[10]=xn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,i=e.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],h=n[1],d=n[5],u=n[9],f=n[13],m=n[2],v=n[6],p=n[10],g=n[14],M=n[3],w=n[7],y=n[11],b=n[15],T=i[0],P=i[4],_=i[8],A=i[12],I=i[1],L=i[5],U=i[9],D=i[13],C=i[2],B=i[6],k=i[10],V=i[14],Q=i[3],q=i[7],K=i[11],j=i[15];return r[0]=a*T+o*I+l*C+c*Q,r[4]=a*P+o*L+l*B+c*q,r[8]=a*_+o*U+l*k+c*K,r[12]=a*A+o*D+l*V+c*j,r[1]=h*T+d*I+u*C+f*Q,r[5]=h*P+d*L+u*B+f*q,r[9]=h*_+d*U+u*k+f*K,r[13]=h*A+d*D+u*V+f*j,r[2]=m*T+v*I+p*C+g*Q,r[6]=m*P+v*L+p*B+g*q,r[10]=m*_+v*U+p*k+g*K,r[14]=m*A+v*D+p*V+g*j,r[3]=M*T+w*I+y*C+b*Q,r[7]=M*P+w*L+y*B+b*q,r[11]=M*_+w*U+y*k+b*K,r[15]=M*A+w*D+y*V+b*j,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[4],i=t[8],r=t[12],a=t[1],o=t[5],l=t[9],c=t[13],h=t[2],d=t[6],u=t[10],f=t[14],m=t[3],v=t[7],p=t[11],g=t[15],M=l*f-c*u,w=o*f-c*d,y=o*u-l*d,b=a*f-c*h,T=a*u-l*h,P=a*d-o*h;return e*(v*M-p*w+g*y)-n*(m*M-p*b+g*T)+i*(m*w-v*b+g*P)-r*(m*y-v*T+p*P)}determinantAffine(){let t=this.elements,e=t[0],n=t[4],i=t[8],r=t[1],a=t[5],o=t[9],l=t[2],c=t[6],h=t[10];return e*(a*h-o*c)-n*(r*h-o*l)+i*(r*c-a*l)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){let i=this.elements;return t.isVector3?(i[12]=t.x,i[13]=t.y,i[14]=t.z):(i[12]=t,i[13]=e,i[14]=n),this}invert(){let t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],d=t[9],u=t[10],f=t[11],m=t[12],v=t[13],p=t[14],g=t[15],M=e*o-n*a,w=e*l-i*a,y=e*c-r*a,b=n*l-i*o,T=n*c-r*o,P=i*c-r*l,_=h*v-d*m,A=h*p-u*m,I=h*g-f*m,L=d*p-u*v,U=d*g-f*v,D=u*g-f*p,C=M*D-w*U+y*L+b*I-T*A+P*_;if(C===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let B=1/C;return t[0]=(o*D-l*U+c*L)*B,t[1]=(i*U-n*D-r*L)*B,t[2]=(v*P-p*T+g*b)*B,t[3]=(u*T-d*P-f*b)*B,t[4]=(l*I-a*D-c*A)*B,t[5]=(e*D-i*I+r*A)*B,t[6]=(p*y-m*P-g*w)*B,t[7]=(h*P-u*y+f*w)*B,t[8]=(a*U-o*I+c*_)*B,t[9]=(n*I-e*U-r*_)*B,t[10]=(m*T-v*y+g*M)*B,t[11]=(d*y-h*T-f*M)*B,t[12]=(o*A-a*L-l*_)*B,t[13]=(e*L-n*A+i*_)*B,t[14]=(v*w-m*b-p*M)*B,t[15]=(h*b-d*w+u*M)*B,this}scale(t){let e=this.elements,n=t.x,i=t.y,r=t.z;return e[0]*=n,e[4]*=i,e[8]*=r,e[1]*=n,e[5]*=i,e[9]*=r,e[2]*=n,e[6]*=i,e[10]*=r,e[3]*=n,e[7]*=i,e[11]*=r,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],i=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,i))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let n=Math.cos(e),i=Math.sin(e),r=1-n,a=t.x,o=t.y,l=t.z,c=r*a,h=r*o;return this.set(c*a+n,c*o-i*l,c*l+i*o,0,c*o+i*l,h*o+n,h*l-i*a,0,c*l-i*o,h*l+i*a,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,i,r,a){return this.set(1,n,r,0,t,1,a,0,e,i,1,0,0,0,0,1),this}compose(t,e,n){let i=this.elements,r=e._x,a=e._y,o=e._z,l=e._w,c=r+r,h=a+a,d=o+o,u=r*c,f=r*h,m=r*d,v=a*h,p=a*d,g=o*d,M=l*c,w=l*h,y=l*d,b=n.x,T=n.y,P=n.z;return i[0]=(1-(v+g))*b,i[1]=(f+y)*b,i[2]=(m-w)*b,i[3]=0,i[4]=(f-y)*T,i[5]=(1-(u+g))*T,i[6]=(p+M)*T,i[7]=0,i[8]=(m+w)*P,i[9]=(p-M)*P,i[10]=(1-(u+v))*P,i[11]=0,i[12]=t.x,i[13]=t.y,i[14]=t.z,i[15]=1,this}decompose(t,e,n){let i=this.elements;t.x=i[12],t.y=i[13],t.z=i[14];let r=this.determinantAffine();if(r===0)return n.set(1,1,1),e.identity(),this;let a=_s.set(i[0],i[1],i[2]).length(),o=_s.set(i[4],i[5],i[6]).length(),l=_s.set(i[8],i[9],i[10]).length();r<0&&(a=-a),Ln.copy(this);let c=1/a,h=1/o,d=1/l;return Ln.elements[0]*=c,Ln.elements[1]*=c,Ln.elements[2]*=c,Ln.elements[4]*=h,Ln.elements[5]*=h,Ln.elements[6]*=h,Ln.elements[8]*=d,Ln.elements[9]*=d,Ln.elements[10]*=d,e.setFromRotationMatrix(Ln),n.x=a,n.y=o,n.z=l,this}makePerspective(t,e,n,i,r,a,o=On,l=!1){let c=this.elements,h=2*r/(e-t),d=2*r/(n-i),u=(e+t)/(e-t),f=(n+i)/(n-i),m,v;if(l)m=r/(a-r),v=a*r/(a-r);else if(o===On)m=-(a+r)/(a-r),v=-2*a*r/(a-r);else if(o===Os)m=-a/(a-r),v=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=d,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=m,c[14]=v,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,i,r,a,o=On,l=!1){let c=this.elements,h=2/(e-t),d=2/(n-i),u=-(e+t)/(e-t),f=-(n+i)/(n-i),m,v;if(l)m=1/(a-r),v=a/(a-r);else if(o===On)m=-2/(a-r),v=-(a+r)/(a-r);else if(o===Os)m=-1/(a-r),v=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=u,c[1]=0,c[5]=d,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=m,c[14]=v,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){let e=this.elements,n=t.elements;for(let i=0;i<16;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}};xl.prototype.isMatrix4=!0;var ce=xl,_s=new E,Ln=new ce,bm=new E(0,0,0),Tm=new E(1,1,1),bi=new E,ao=new E,xn=new E,Zu=new ce,Ju=new re,ei=class s{constructor(t=0,e=0,n=0,i=s.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=i}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,i=this._order){return this._x=t,this._y=e,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){let i=t.elements,r=i[0],a=i[4],o=i[8],l=i[1],c=i[5],h=i[9],d=i[2],u=i[6],f=i[10];switch(e){case"XYZ":this._y=Math.asin(Kt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Kt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(Kt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-d,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Kt(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(u,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(Kt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-Kt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:kt("Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Zu.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Zu,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Ju.setFromEuler(this),this.setFromQuaternion(Ju,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};ei.DEFAULT_ORDER="XYZ";var Gr=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},wm=0,Ku=new E,vs=new re,li=new ce,oo=new E,br=new E,Em=new E,Am=new re,Qu=new E(1,0,0),ju=new E(0,1,0),td=new E(0,0,1),ed={type:"added"},Rm={type:"removed"},ys={type:"childadded",child:null},Jc={type:"childremoved",child:null},Oe=class s extends ti{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:wm++}),this.uuid=Qn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=s.DEFAULT_UP.clone();let t=new E,e=new ei,n=new re,i=new E(1,1,1);function r(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new ce},normalMatrix:{value:new Wt}}),this.matrix=new ce,this.matrixWorld=new ce,this.matrixAutoUpdate=s.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=s.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Gr,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return vs.setFromAxisAngle(t,e),this.quaternion.multiply(vs),this}rotateOnWorldAxis(t,e){return vs.setFromAxisAngle(t,e),this.quaternion.premultiply(vs),this}rotateX(t){return this.rotateOnAxis(Qu,t)}rotateY(t){return this.rotateOnAxis(ju,t)}rotateZ(t){return this.rotateOnAxis(td,t)}translateOnAxis(t,e){return Ku.copy(t).applyQuaternion(this.quaternion),this.position.add(Ku.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Qu,t)}translateY(t){return this.translateOnAxis(ju,t)}translateZ(t){return this.translateOnAxis(td,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(li.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?oo.copy(t):oo.set(t,e,n);let i=this.parent;this.updateWorldMatrix(!0,!1),br.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?li.lookAt(br,oo,this.up):li.lookAt(oo,br,this.up),this.quaternion.setFromRotationMatrix(li),i&&(li.extractRotation(i.matrixWorld),vs.setFromRotationMatrix(li),this.quaternion.premultiply(vs.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(Ht("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(ed),ys.child=t,this.dispatchEvent(ys),ys.child=null):Ht("Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Rm),Jc.child=t,this.dispatchEvent(Jc),Jc.child=null),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),li.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),li.multiply(t.parent.matrixWorld)),t.applyMatrix4(li),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(ed),ys.child=t,this.dispatchEvent(ys),ys.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,i=this.children.length;n<i;n++){let a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);let i=this.children;for(let r=0,a=i.length;r<a;r++)i[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(br,t,Em),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(br,Am,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(t){t(this);let e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let t=this.pivot;if(t!==null){let e=t.x,n=t.y,i=t.z,r=this.matrix.elements;r[12]+=e-r[0]*e-r[4]*n-r[8]*i,r[13]+=n-r[1]*e-r[5]*n-r[9]*i,r[14]+=i-r[2]*e-r[6]*n-r[10]*i}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e,n=!1){let i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),e===!0){let r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0,n)}}toJSON(t){let e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let i={};i.uuid=this.uuid,i.type=this.type,i.name=this.name,i.castShadow=this.castShadow,i.receiveShadow=this.receiveShadow,i.visible=this.visible,i.frustumCulled=this.frustumCulled,i.renderOrder=this.renderOrder,i.static=this.static,i.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.pivot!==null&&(i.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(i.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(i.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),i.instanceInfo=this._instanceInfo.map(o=>({...o})),i.availableInstanceIds=this._availableInstanceIds.slice(),i.availableGeometryIds=this._availableGeometryIds.slice(),i.nextIndexStart=this._nextIndexStart,i.nextVertexStart=this._nextVertexStart,i.geometryCount=this._geometryCount,i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.matricesTexture=this._matricesTexture.toJSON(t),i.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(i.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(i.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(t.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let d=l[c];r(t.shapes,d)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(t.materials,this.material[l]));i.material=o}else i.material=r(t.materials,this.material);if(this.children.length>0){i.children=[];for(let o=0;o<this.children.length;o++)i.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){i.animations=[];for(let o=0;o<this.animations.length;o++){let l=this.animations[o];i.animations.push(r(t.animations,l))}}if(e){let o=a(t.geometries),l=a(t.materials),c=a(t.textures),h=a(t.images),d=a(t.shapes),u=a(t.skeletons),f=a(t.animations),m=a(t.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),d.length>0&&(n.shapes=d),u.length>0&&(n.skeletons=u),f.length>0&&(n.animations=f),m.length>0&&(n.nodes=m)}return n.object=i,n;function a(o){let l=[];for(let c in o){let h=o[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.pivot=t.pivot!==null?t.pivot.clone():null,this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.static=t.static,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){let i=t.children[n];this.add(i.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};Oe.DEFAULT_UP=new E(0,1,0);Oe.DEFAULT_MATRIX_AUTO_UPDATE=!0;Oe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Le=class extends Oe{constructor(){super(),this.isGroup=!0,this.type="Group"}},Cm={type:"move"},Vs=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Le,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Le,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new E,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new E),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Le,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new E,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new E,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let i=null,r=null,a=null,o=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){a=!0;for(let v of t.hand.values()){let p=e.getJointPose(v,n),g=this._getHandJoint(c,v);p!==null&&(g.matrix.fromArray(p.transform.matrix),g.matrix.decompose(g.position,g.rotation,g.scale),g.matrixWorldNeedsUpdate=!0,g.jointRadius=p.radius),g.visible=p!==null}let h=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],u=h.position.distanceTo(d.position),f=.02,m=.005;c.inputState.pinching&&u>f+m?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&u<=f-m&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:t,target:this})));o!==null&&(i=e.getPose(t.targetRaySpace,n),i===null&&r!==null&&(i=r),i!==null&&(o.matrix.fromArray(i.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,i.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(i.linearVelocity)):o.hasLinearVelocity=!1,i.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(i.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Cm)))}return o!==null&&(o.visible=i!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let n=new Le;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}},lf={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Ti={h:0,s:0,l:0},lo={h:0,s:0,l:0};function Kc(s,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?s+(t-s)*6*e:e<1/2?t:e<2/3?s+(t-s)*6*(2/3-e):s}var ht=class{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){let i=t;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=We){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Qt.colorSpaceToWorking(this,e),this}setRGB(t,e,n,i=Qt.workingColorSpace){return this.r=t,this.g=e,this.b=n,Qt.colorSpaceToWorking(this,i),this}setHSL(t,e,n,i=Qt.workingColorSpace){if(t=Wh(t,1),e=Kt(e,0,1),n=Kt(n,0,1),e===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+e):n+e-n*e,a=2*n-r;this.r=Kc(a,r,t+1/3),this.g=Kc(a,r,t),this.b=Kc(a,r,t-1/3)}return Qt.colorSpaceToWorking(this,i),this}setStyle(t,e=We){function n(r){r!==void 0&&parseFloat(r)<1&&kt("Color: Alpha component of "+t+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(t)){let r,a=i[1],o=i[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:kt("Color: Unknown color model "+t)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(t)){let r=i[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(r,16),e);kt("Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=We){let n=lf[t.toLowerCase()];return n!==void 0?this.setHex(n,e):kt("Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=pi(t.r),this.g=pi(t.g),this.b=pi(t.b),this}copyLinearToSRGB(t){return this.r=Us(t.r),this.g=Us(t.g),this.b=Us(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=We){return Qt.workingToColorSpace(je.copy(this),t),Math.round(Kt(je.r*255,0,255))*65536+Math.round(Kt(je.g*255,0,255))*256+Math.round(Kt(je.b*255,0,255))}getHexString(t=We){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Qt.workingColorSpace){Qt.workingToColorSpace(je.copy(this),e);let n=je.r,i=je.g,r=je.b,a=Math.max(n,i,r),o=Math.min(n,i,r),l,c,h=(o+a)/2;if(o===a)l=0,c=0;else{let d=a-o;switch(c=h<=.5?d/(a+o):d/(2-a-o),a){case n:l=(i-r)/d+(i<r?6:0);break;case i:l=(r-n)/d+2;break;case r:l=(n-i)/d+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=Qt.workingColorSpace){return Qt.workingToColorSpace(je.copy(this),e),t.r=je.r,t.g=je.g,t.b=je.b,t}getStyle(t=We){Qt.workingToColorSpace(je.copy(this),t);let e=je.r,n=je.g,i=je.b;return t!==We?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(t,e,n){return this.getHSL(Ti),this.setHSL(Ti.h+t,Ti.s+e,Ti.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Ti),t.getHSL(lo);let n=Nr(Ti.h,lo.h,e),i=Nr(Ti.s,lo.s,e),r=Nr(Ti.l,lo.l,e);return this.setHSL(n,i,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,n=this.g,i=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*i,this.g=r[1]*e+r[4]*n+r[7]*i,this.b=r[2]*e+r[5]*n+r[8]*i,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},je=new ht;ht.NAMES=lf;var Wr=class s{constructor(t,e=1,n=1e3){this.isFog=!0,this.name="",this.color=new ht(t),this.near=e,this.far=n}clone(){return new s(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},Ki=class extends Oe{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new ei,this.environmentIntensity=1,this.environmentRotation=new ei,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),e.object.backgroundBlurriness=this.backgroundBlurriness,e.object.backgroundIntensity=this.backgroundIntensity,e.object.backgroundRotation=this.backgroundRotation.toArray(),e.object.environmentIntensity=this.environmentIntensity,e.object.environmentRotation=this.environmentRotation.toArray(),e}},Dn=new E,ci=new E,Qc=new E,hi=new E,Ms=new E,Ss=new E,nd=new E,jc=new E,th=new E,eh=new E,nh=new Ae,ih=new Ae,sh=new Ae,fi=class s{constructor(t=new E,e=new E,n=new E){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,i){i.subVectors(n,e),Dn.subVectors(t,e),i.cross(Dn);let r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(t,e,n,i,r){Dn.subVectors(i,e),ci.subVectors(n,e),Qc.subVectors(t,e);let a=Dn.dot(Dn),o=Dn.dot(ci),l=Dn.dot(Qc),c=ci.dot(ci),h=ci.dot(Qc),d=a*c-o*o;if(d===0)return r.set(0,0,0),null;let u=1/d,f=(c*l-o*h)*u,m=(a*h-o*l)*u;return r.set(1-f-m,m,f)}static containsPoint(t,e,n,i){return this.getBarycoord(t,e,n,i,hi)===null?!1:hi.x>=0&&hi.y>=0&&hi.x+hi.y<=1}static getInterpolation(t,e,n,i,r,a,o,l){return this.getBarycoord(t,e,n,i,hi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,hi.x),l.addScaledVector(a,hi.y),l.addScaledVector(o,hi.z),l)}static getInterpolatedAttribute(t,e,n,i,r,a){return nh.setScalar(0),ih.setScalar(0),sh.setScalar(0),nh.fromBufferAttribute(t,e),ih.fromBufferAttribute(t,n),sh.fromBufferAttribute(t,i),a.setScalar(0),a.addScaledVector(nh,r.x),a.addScaledVector(ih,r.y),a.addScaledVector(sh,r.z),a}static isFrontFacing(t,e,n,i){return Dn.subVectors(n,e),ci.subVectors(t,e),Dn.cross(ci).dot(i)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,i){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[i]),this}setFromAttributeAndIndices(t,e,n,i){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,i),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Dn.subVectors(this.c,this.b),ci.subVectors(this.a,this.b),Dn.cross(ci).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return s.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return s.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,i,r){return s.getInterpolation(t,this.a,this.b,this.c,e,n,i,r)}containsPoint(t){return s.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return s.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let n=this.a,i=this.b,r=this.c,a,o;Ms.subVectors(i,n),Ss.subVectors(r,n),jc.subVectors(t,n);let l=Ms.dot(jc),c=Ss.dot(jc);if(l<=0&&c<=0)return e.copy(n);th.subVectors(t,i);let h=Ms.dot(th),d=Ss.dot(th);if(h>=0&&d<=h)return e.copy(i);let u=l*d-h*c;if(u<=0&&l>=0&&h<=0)return a=l/(l-h),e.copy(n).addScaledVector(Ms,a);eh.subVectors(t,r);let f=Ms.dot(eh),m=Ss.dot(eh);if(m>=0&&f<=m)return e.copy(r);let v=f*c-l*m;if(v<=0&&c>=0&&m<=0)return o=c/(c-m),e.copy(n).addScaledVector(Ss,o);let p=h*m-f*d;if(p<=0&&d-h>=0&&f-m>=0)return nd.subVectors(r,i),o=(d-h)/(d-h+(f-m)),e.copy(i).addScaledVector(nd,o);let g=1/(p+v+u);return a=v*g,o=u*g,e.copy(n).addScaledVector(Ms,a).addScaledVector(Ss,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},ni=class{constructor(t=new E(1/0,1/0,1/0),e=new E(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(Nn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(Nn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let n=Nn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);let n=t.geometry;if(n!==void 0){let r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,Nn):Nn.fromBufferAttribute(r,a),Nn.applyMatrix4(t.matrixWorld),this.expandByPoint(Nn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),co.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),co.copy(n.boundingBox)),co.applyMatrix4(t.matrixWorld),this.union(co)}let i=t.children;for(let r=0,a=i.length;r<a;r++)this.expandByObject(i[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Nn),Nn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Tr),ho.subVectors(this.max,Tr),bs.subVectors(t.a,Tr),Ts.subVectors(t.b,Tr),ws.subVectors(t.c,Tr),wi.subVectors(Ts,bs),Ei.subVectors(ws,Ts),qi.subVectors(bs,ws);let e=[0,-wi.z,wi.y,0,-Ei.z,Ei.y,0,-qi.z,qi.y,wi.z,0,-wi.x,Ei.z,0,-Ei.x,qi.z,0,-qi.x,-wi.y,wi.x,0,-Ei.y,Ei.x,0,-qi.y,qi.x,0];return!rh(e,bs,Ts,ws,ho)||(e=[1,0,0,0,1,0,0,0,1],!rh(e,bs,Ts,ws,ho))?!1:(uo.crossVectors(wi,Ei),e=[uo.x,uo.y,uo.z],rh(e,bs,Ts,ws,ho))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Nn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Nn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(ui[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),ui[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),ui[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),ui[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),ui[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),ui[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),ui[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),ui[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(ui),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}},ui=[new E,new E,new E,new E,new E,new E,new E,new E],Nn=new E,co=new ni,bs=new E,Ts=new E,ws=new E,wi=new E,Ei=new E,qi=new E,Tr=new E,ho=new E,uo=new E,Yi=new E;function rh(s,t,e,n,i){for(let r=0,a=s.length-3;r<=a;r+=3){Yi.fromArray(s,r);let o=i.x*Math.abs(Yi.x)+i.y*Math.abs(Yi.y)+i.z*Math.abs(Yi.z),l=t.dot(Yi),c=e.dot(Yi),h=n.dot(Yi);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}var Ue=new E,fo=new it,Pm=0,De=class extends ti{constructor(t,e,n=!1){if(super(),Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Pm++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Hh,this.updateRanges=[],this.gpuType=An,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[t+i]=e.array[n+i];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)fo.fromBufferAttribute(this,e),fo.applyMatrix3(t),this.setXY(e,fo.x,fo.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Ue.fromBufferAttribute(this,e),Ue.applyMatrix3(t),this.setXYZ(e,Ue.x,Ue.y,Ue.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Ue.fromBufferAttribute(this,e),Ue.applyMatrix4(t),this.setXYZ(e,Ue.x,Ue.y,Ue.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Ue.fromBufferAttribute(this,e),Ue.applyNormalMatrix(t),this.setXYZ(e,Ue.x,Ue.y,Ue.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Ue.fromBufferAttribute(this,e),Ue.transformDirection(t),this.setXYZ(e,Ue.x,Ue.y,Ue.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Fn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=fe(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Fn(e,this.array)),e}setX(t,e){return this.normalized&&(e=fe(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Fn(e,this.array)),e}setY(t,e){return this.normalized&&(e=fe(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Fn(e,this.array)),e}setZ(t,e){return this.normalized&&(e=fe(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Fn(e,this.array)),e}setW(t,e){return this.normalized&&(e=fe(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=fe(e,this.array),n=fe(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,i){return t*=this.itemSize,this.normalized&&(e=fe(e,this.array),n=fe(n,this.array),i=fe(i,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this}setXYZW(t,e,n,i,r){return t*=this.itemSize,this.normalized&&(e=fe(e,this.array),n=fe(n,this.array),i=fe(i,this.array),r=fe(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return t.name=this.name,t.usage=this.usage,t.gpuType=this.gpuType,t}dispose(){this.dispatchEvent({type:"dispose"})}};var Xr=class extends De{constructor(t,e,n){super(new Uint16Array(t),e,n)}};var qr=class extends De{constructor(t,e,n){super(new Uint32Array(t),e,n)}};var Zt=class extends De{constructor(t,e,n){super(new Float32Array(t),e,n)}},Im=new ni,wr=new E,ah=new E,Bn=class{constructor(t=new E,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let n=this.center;e!==void 0?n.copy(e):Im.setFromPoints(t).getCenter(n);let i=0;for(let r=0,a=t.length;r<a;r++)i=Math.max(i,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(i),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;wr.subVectors(t,this.center);let e=wr.lengthSq();if(e>this.radius*this.radius){let n=Math.sqrt(e),i=(n-this.radius)*.5;this.center.addScaledVector(wr,i/n),this.radius+=i}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(ah.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(wr.copy(t.center).add(ah)),this.expandByPoint(wr.copy(t.center).sub(ah))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}},Lm=0,wn=new ce,oh=new Oe,Es=new E,_n=new ni,Er=new ni,Ge=new E,_e=class s extends ti{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Lm++}),this.uuid=Qn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(nm(t)?qr:Xr)(t,1):this.index=t,this}setIndirect(t,e=0){return this.indirect=t,this.indirectOffset=e,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new Wt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}let i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(t),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(t){return wn.makeRotationFromQuaternion(t),this.applyMatrix4(wn),this}rotateX(t){return wn.makeRotationX(t),this.applyMatrix4(wn),this}rotateY(t){return wn.makeRotationY(t),this.applyMatrix4(wn),this}rotateZ(t){return wn.makeRotationZ(t),this.applyMatrix4(wn),this}translate(t,e,n){return wn.makeTranslation(t,e,n),this.applyMatrix4(wn),this}scale(t,e,n){return wn.makeScale(t,e,n),this.applyMatrix4(wn),this}lookAt(t){return oh.lookAt(t),oh.updateMatrix(),this.applyMatrix4(oh.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Es).negate(),this.translate(Es.x,Es.y,Es.z),this}setFromPoints(t){let e=this.getAttribute("position");if(e===void 0){let n=[];for(let i=0,r=t.length;i<r;i++){let a=t[i];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new Zt(n,3))}else{let n=Math.min(t.length,e.count);for(let i=0;i<n;i++){let r=t[i];e.setXYZ(i,r.x,r.y,r.z||0)}t.length>e.count&&kt("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ni);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Ht("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new E(-1/0,-1/0,-1/0),new E(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,i=e.length;n<i;n++){let r=e[n];_n.setFromBufferAttribute(r),this.morphTargetsRelative?(Ge.addVectors(this.boundingBox.min,_n.min),this.boundingBox.expandByPoint(Ge),Ge.addVectors(this.boundingBox.max,_n.max),this.boundingBox.expandByPoint(Ge)):(this.boundingBox.expandByPoint(_n.min),this.boundingBox.expandByPoint(_n.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Ht('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Bn);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Ht("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new E,1/0);return}if(t){let n=this.boundingSphere.center;if(_n.setFromBufferAttribute(t),e)for(let r=0,a=e.length;r<a;r++){let o=e[r];Er.setFromBufferAttribute(o),this.morphTargetsRelative?(Ge.addVectors(_n.min,Er.min),_n.expandByPoint(Ge),Ge.addVectors(_n.max,Er.max),_n.expandByPoint(Ge)):(_n.expandByPoint(Er.min),_n.expandByPoint(Er.max))}_n.getCenter(n);let i=0;for(let r=0,a=t.count;r<a;r++)Ge.fromBufferAttribute(t,r),i=Math.max(i,n.distanceToSquared(Ge));if(e)for(let r=0,a=e.length;r<a;r++){let o=e[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)Ge.fromBufferAttribute(o,c),l&&(Es.fromBufferAttribute(t,c),Ge.add(Es)),i=Math.max(i,n.distanceToSquared(Ge))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&Ht('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){Ht("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=e.position,i=e.normal,r=e.uv,a=this.getAttribute("tangent");(a===void 0||a.count!==n.count)&&(a=new De(new Float32Array(4*n.count),4),this.setAttribute("tangent",a));let o=[],l=[];for(let _=0;_<n.count;_++)o[_]=new E,l[_]=new E;let c=new E,h=new E,d=new E,u=new it,f=new it,m=new it,v=new E,p=new E;function g(_,A,I){c.fromBufferAttribute(n,_),h.fromBufferAttribute(n,A),d.fromBufferAttribute(n,I),u.fromBufferAttribute(r,_),f.fromBufferAttribute(r,A),m.fromBufferAttribute(r,I),h.sub(c),d.sub(c),f.sub(u),m.sub(u);let L=1/(f.x*m.y-m.x*f.y);isFinite(L)&&(v.copy(h).multiplyScalar(m.y).addScaledVector(d,-f.y).multiplyScalar(L),p.copy(d).multiplyScalar(f.x).addScaledVector(h,-m.x).multiplyScalar(L),o[_].add(v),o[A].add(v),o[I].add(v),l[_].add(p),l[A].add(p),l[I].add(p))}let M=this.groups;M.length===0&&(M=[{start:0,count:t.count}]);for(let _=0,A=M.length;_<A;++_){let I=M[_],L=I.start,U=I.count;for(let D=L,C=L+U;D<C;D+=3)g(t.getX(D+0),t.getX(D+1),t.getX(D+2))}let w=new E,y=new E,b=new E,T=new E;function P(_){b.fromBufferAttribute(i,_),T.copy(b);let A=o[_];w.copy(A),w.sub(b.multiplyScalar(b.dot(A))).normalize(),y.crossVectors(T,A);let L=y.dot(l[_])<0?-1:1;a.setXYZW(_,w.x,w.y,w.z,L)}for(let _=0,A=M.length;_<A;++_){let I=M[_],L=I.start,U=I.count;for(let D=L,C=L+U;D<C;D+=3)P(t.getX(D+0)),P(t.getX(D+1)),P(t.getX(D+2))}this._transformed=!0}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==e.count)n=new De(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let u=0,f=n.count;u<f;u++)n.setXYZ(u,0,0,0);let i=new E,r=new E,a=new E,o=new E,l=new E,c=new E,h=new E,d=new E;if(t)for(let u=0,f=t.count;u<f;u+=3){let m=t.getX(u+0),v=t.getX(u+1),p=t.getX(u+2);i.fromBufferAttribute(e,m),r.fromBufferAttribute(e,v),a.fromBufferAttribute(e,p),h.subVectors(a,r),d.subVectors(i,r),h.cross(d),o.fromBufferAttribute(n,m),l.fromBufferAttribute(n,v),c.fromBufferAttribute(n,p),o.add(h),l.add(h),c.add(h),n.setXYZ(m,o.x,o.y,o.z),n.setXYZ(v,l.x,l.y,l.z),n.setXYZ(p,c.x,c.y,c.z)}else for(let u=0,f=e.count;u<f;u+=3)i.fromBufferAttribute(e,u+0),r.fromBufferAttribute(e,u+1),a.fromBufferAttribute(e,u+2),h.subVectors(a,r),d.subVectors(i,r),h.cross(d),n.setXYZ(u+0,h.x,h.y,h.z),n.setXYZ(u+1,h.x,h.y,h.z),n.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Ge.fromBufferAttribute(t,e),Ge.normalize(),t.setXYZ(e,Ge.x,Ge.y,Ge.z)}toNonIndexed(){function t(o,l){let c=o.array,h=o.itemSize,d=o.normalized,u=new c.constructor(l.length*h),f=0,m=0;for(let v=0,p=l.length;v<p;v++){o.isInterleavedBufferAttribute?f=l[v]*o.data.stride+o.offset:f=l[v]*h;for(let g=0;g<h;g++)u[m++]=c[f++]}return new De(u,h,d)}if(this.index===null)return kt("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new s,n=this.index.array,i=this.attributes;for(let o in i){let l=i[o],c=t(l,n);e.setAttribute(o,c)}let r=this.morphAttributes;for(let o in r){let l=[],c=r[o];for(let h=0,d=c.length;h<d;h++){let u=c[h],f=t(u,n);l.push(f)}e.morphAttributes[o]=l}e.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,l=a.length;o<l;o++){let c=a[o];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){let t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,t.name=this.name,Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let n=this.attributes;for(let l in n){let c=n[l];t.data.attributes[l]=c.toJSON(t.data)}let i={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let d=0,u=c.length;d<u;d++){let f=c[d];h.push(f.toJSON(t.data))}h.length>0&&(i[l]=h,r=!0)}r&&(t.data.morphAttributes=i,t.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(t.data.boundingSphere=o.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let n=t.index;n!==null&&this.setIndex(n.clone());let i=t.attributes;for(let c in i){let h=i[c];this.setAttribute(c,h.clone(e))}let r=t.morphAttributes;for(let c in r){let h=[],d=r[c];for(let u=0,f=d.length;u<f;u++)h.push(d[u].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;let a=t.groups;for(let c=0,h=a.length;c<h;c++){let d=a[c];this.addGroup(d.start,d.count,d.materialIndex)}let o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());let l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this._transformed=t._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}},$o=class{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=Hh,this.updateRanges=[],this.version=0,this.uuid=Qn()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let i=0,r=this.stride;i<r;i++)this.array[t+i]=e.array[n+i];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Qn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(e,this.stride);return n.setUsage(this.usage),n}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Qn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer)));let e={uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride};return e.usage=this.usage,e}},sn=new E,Yr=class s{constructor(t,e,n,i=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=i}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)sn.fromBufferAttribute(this,e),sn.applyMatrix4(t),this.setXYZ(e,sn.x,sn.y,sn.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)sn.fromBufferAttribute(this,e),sn.applyNormalMatrix(t),this.setXYZ(e,sn.x,sn.y,sn.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)sn.fromBufferAttribute(this,e),sn.transformDirection(t),this.setXYZ(e,sn.x,sn.y,sn.z);return this}getComponent(t,e){let n=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(n=Fn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=fe(n,this.array)),this.data.array[t*this.data.stride+this.offset+e]=n,this}setX(t,e){return this.normalized&&(e=fe(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=fe(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=fe(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=fe(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=Fn(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=Fn(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=Fn(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=Fn(e,this.array)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=fe(e,this.array),n=fe(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,i){return t=t*this.data.stride+this.offset,this.normalized&&(e=fe(e,this.array),n=fe(n,this.array),i=fe(i,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=i,this}setXYZW(t,e,n,i,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=fe(e,this.array),n=fe(n,this.array),i=fe(i,this.array),r=fe(r,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=i,this.data.array[t+3]=r,this}clone(t){if(t===void 0){Vr("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let e=[];for(let n=0;n<this.count;n++){let i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[i+r])}return new De(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new s(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){Vr("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let e=[];for(let n=0;n<this.count;n++){let i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[i+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},lh=new E,Dm=new E,Nm=new Wt,Un=class{constructor(t=new E(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,i){return this.normal.set(t,e,n),this.constant=i,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){let i=lh.subVectors(n,e).cross(Dm.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(i,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e,n=!0){let i=t.delta(lh),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let a=-(t.start.dot(this.normal)+this.constant)/r;return n===!0&&(a<0||a>1)?null:e.copy(t.start).addScaledVector(i,a)}intersectsLine(t){let e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let n=e||Nm.getNormalMatrix(t),i=this.coplanarPoint(lh).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(t){return this.normal.fromArray(t.normal),this.constant=t.constant,this}},Um=0,zn=class extends ti{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Um++}),this.uuid=Qn(),this.name="",this.type="Material",this.blending=Ui,this.side=Ni,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Dh,this.blendDst=Nh,this.blendEquation=ss,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ht(0,0,0),this.blendAlpha=0,this.depthFunc=Fs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Jd,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Uo,this.stencilZFail=Uo,this.stencilZPass=Uo,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let n=t[e];if(n===void 0){kt(`Material: parameter '${e}' has value of undefined.`);continue}let i=this[e];if(i===void 0){kt(`Material: '${e}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector2&&n&&n.isVector2||i&&i.isEuler&&n&&n.isEuler||i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(r){let a=[];for(let o in r){let l=r[o];delete l.metadata,a.push(l)}return a}if(e){let r=i(t.textures),a=i(t.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}fromJSON(t,e){if(t.uuid!==void 0&&(this.uuid=t.uuid),t.name!==void 0&&(this.name=t.name),t.color!==void 0&&this.color!==void 0&&this.color.setHex(t.color),t.roughness!==void 0&&(this.roughness=t.roughness),t.metalness!==void 0&&(this.metalness=t.metalness),t.sheen!==void 0&&(this.sheen=t.sheen),t.sheenColor!==void 0&&(this.sheenColor=new ht().setHex(t.sheenColor)),t.sheenRoughness!==void 0&&(this.sheenRoughness=t.sheenRoughness),t.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(t.emissive),t.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(t.specular),t.specularIntensity!==void 0&&(this.specularIntensity=t.specularIntensity),t.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(t.specularColor),t.shininess!==void 0&&(this.shininess=t.shininess),t.clearcoat!==void 0&&(this.clearcoat=t.clearcoat),t.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=t.clearcoatRoughness),t.dispersion!==void 0&&(this.dispersion=t.dispersion),t.retroreflectivity!==void 0&&(this.retroreflectivity=t.retroreflectivity),t.iridescence!==void 0&&(this.iridescence=t.iridescence),t.iridescenceIOR!==void 0&&(this.iridescenceIOR=t.iridescenceIOR),t.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=t.iridescenceThicknessRange),t.transmission!==void 0&&(this.transmission=t.transmission),t.thickness!==void 0&&(this.thickness=t.thickness),t.attenuationDistance!==void 0&&(this.attenuationDistance=t.attenuationDistance),t.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(t.attenuationColor),t.anisotropy!==void 0&&(this.anisotropy=t.anisotropy),t.anisotropyRotation!==void 0&&(this.anisotropyRotation=t.anisotropyRotation),t.fog!==void 0&&(this.fog=t.fog),t.flatShading!==void 0&&(this.flatShading=t.flatShading),t.blending!==void 0&&(this.blending=t.blending),t.combine!==void 0&&(this.combine=t.combine),t.side!==void 0&&(this.side=t.side),t.shadowSide!==void 0&&(this.shadowSide=t.shadowSide),t.opacity!==void 0&&(this.opacity=t.opacity),t.transparent!==void 0&&(this.transparent=t.transparent),t.alphaTest!==void 0&&(this.alphaTest=t.alphaTest),t.alphaHash!==void 0&&(this.alphaHash=t.alphaHash),t.depthFunc!==void 0&&(this.depthFunc=t.depthFunc),t.depthTest!==void 0&&(this.depthTest=t.depthTest),t.depthWrite!==void 0&&(this.depthWrite=t.depthWrite),t.colorWrite!==void 0&&(this.colorWrite=t.colorWrite),t.clippingPlanes!==void 0&&(this.clippingPlanes=t.clippingPlanes.map(n=>new Un().fromJSON(n))),t.clipIntersection!==void 0&&(this.clipIntersection=t.clipIntersection),t.clipShadows!==void 0&&(this.clipShadows=t.clipShadows),t.depthPacking!==void 0&&(this.depthPacking=t.depthPacking),t.blendSrc!==void 0&&(this.blendSrc=t.blendSrc),t.blendDst!==void 0&&(this.blendDst=t.blendDst),t.blendEquation!==void 0&&(this.blendEquation=t.blendEquation),t.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=t.blendSrcAlpha),t.blendDstAlpha!==void 0&&(this.blendDstAlpha=t.blendDstAlpha),t.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=t.blendEquationAlpha),t.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(t.blendColor),t.blendAlpha!==void 0&&(this.blendAlpha=t.blendAlpha),t.stencilWriteMask!==void 0&&(this.stencilWriteMask=t.stencilWriteMask),t.stencilFunc!==void 0&&(this.stencilFunc=t.stencilFunc),t.stencilRef!==void 0&&(this.stencilRef=t.stencilRef),t.stencilFuncMask!==void 0&&(this.stencilFuncMask=t.stencilFuncMask),t.stencilFail!==void 0&&(this.stencilFail=t.stencilFail),t.stencilZFail!==void 0&&(this.stencilZFail=t.stencilZFail),t.stencilZPass!==void 0&&(this.stencilZPass=t.stencilZPass),t.stencilWrite!==void 0&&(this.stencilWrite=t.stencilWrite),t.wireframe!==void 0&&(this.wireframe=t.wireframe),t.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=t.wireframeLinewidth),t.wireframeLinecap!==void 0&&(this.wireframeLinecap=t.wireframeLinecap),t.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=t.wireframeLinejoin),t.rotation!==void 0&&(this.rotation=t.rotation),t.linewidth!==void 0&&(this.linewidth=t.linewidth),t.linecap!==void 0&&(this.linecap=t.linecap),t.linejoin!==void 0&&(this.linejoin=t.linejoin),t.dashSize!==void 0&&(this.dashSize=t.dashSize),t.gapSize!==void 0&&(this.gapSize=t.gapSize),t.scale!==void 0&&(this.scale=t.scale),t.polygonOffset!==void 0&&(this.polygonOffset=t.polygonOffset),t.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=t.polygonOffsetFactor),t.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=t.polygonOffsetUnits),t.dithering!==void 0&&(this.dithering=t.dithering),t.alphaToCoverage!==void 0&&(this.alphaToCoverage=t.alphaToCoverage),t.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=t.premultipliedAlpha),t.forceSinglePass!==void 0&&(this.forceSinglePass=t.forceSinglePass),t.allowOverride!==void 0&&(this.allowOverride=t.allowOverride),t.visible!==void 0&&(this.visible=t.visible),t.toneMapped!==void 0&&(this.toneMapped=t.toneMapped),t.userData!==void 0&&(this.userData=t.userData),t.vertexColors!==void 0&&(typeof t.vertexColors=="number"?this.vertexColors=t.vertexColors>0:this.vertexColors=t.vertexColors),t.size!==void 0&&(this.size=t.size),t.sizeAttenuation!==void 0&&(this.sizeAttenuation=t.sizeAttenuation),t.map!==void 0&&(this.map=e[t.map]||null),t.matcap!==void 0&&(this.matcap=e[t.matcap]||null),t.alphaMap!==void 0&&(this.alphaMap=e[t.alphaMap]||null),t.bumpMap!==void 0&&(this.bumpMap=e[t.bumpMap]||null),t.bumpScale!==void 0&&(this.bumpScale=t.bumpScale),t.normalMap!==void 0&&(this.normalMap=e[t.normalMap]||null),t.normalMapType!==void 0&&(this.normalMapType=t.normalMapType),t.normalScale!==void 0){let n=t.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new it().fromArray(n)}return t.displacementMap!==void 0&&(this.displacementMap=e[t.displacementMap]||null),t.displacementScale!==void 0&&(this.displacementScale=t.displacementScale),t.displacementBias!==void 0&&(this.displacementBias=t.displacementBias),t.roughnessMap!==void 0&&(this.roughnessMap=e[t.roughnessMap]||null),t.metalnessMap!==void 0&&(this.metalnessMap=e[t.metalnessMap]||null),t.emissiveMap!==void 0&&(this.emissiveMap=e[t.emissiveMap]||null),t.emissiveIntensity!==void 0&&(this.emissiveIntensity=t.emissiveIntensity),t.specularMap!==void 0&&(this.specularMap=e[t.specularMap]||null),t.specularIntensityMap!==void 0&&(this.specularIntensityMap=e[t.specularIntensityMap]||null),t.specularColorMap!==void 0&&(this.specularColorMap=e[t.specularColorMap]||null),t.envMap!==void 0&&(this.envMap=e[t.envMap]||null),t.envMapRotation!==void 0&&this.envMapRotation.fromArray(t.envMapRotation),t.envMapIntensity!==void 0&&(this.envMapIntensity=t.envMapIntensity),t.reflectivity!==void 0&&(this.reflectivity=t.reflectivity),t.refractionRatio!==void 0&&(this.refractionRatio=t.refractionRatio),t.lightMap!==void 0&&(this.lightMap=e[t.lightMap]||null),t.lightMapIntensity!==void 0&&(this.lightMapIntensity=t.lightMapIntensity),t.aoMap!==void 0&&(this.aoMap=e[t.aoMap]||null),t.aoMapIntensity!==void 0&&(this.aoMapIntensity=t.aoMapIntensity),t.gradientMap!==void 0&&(this.gradientMap=e[t.gradientMap]||null),t.clearcoatMap!==void 0&&(this.clearcoatMap=e[t.clearcoatMap]||null),t.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=e[t.clearcoatRoughnessMap]||null),t.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=e[t.clearcoatNormalMap]||null),t.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new it().fromArray(t.clearcoatNormalScale)),t.iridescenceMap!==void 0&&(this.iridescenceMap=e[t.iridescenceMap]||null),t.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=e[t.iridescenceThicknessMap]||null),t.transmissionMap!==void 0&&(this.transmissionMap=e[t.transmissionMap]||null),t.thicknessMap!==void 0&&(this.thicknessMap=e[t.thicknessMap]||null),t.anisotropyMap!==void 0&&(this.anisotropyMap=e[t.anisotropyMap]||null),t.sheenColorMap!==void 0&&(this.sheenColorMap=e[t.sheenColorMap]||null),t.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=e[t.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,n=null;if(e!==null){let i=e.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.allowOverride=t.allowOverride,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}},Hs=class extends zn{constructor(t){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new ht(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}},As,Ar=new E,Rs=new E,Cs=new E,Ps=new it,Rr=new it,cf=new ce,po=new E,Cr=new E,mo=new E,id=new it,ch=new it,sd=new it,$r=class extends Oe{constructor(t=new Hs){if(super(),this.isSprite=!0,this.type="Sprite",As===void 0){As=new _e;let e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new $o(e,5);As.setIndex([0,1,2,0,2,3]),As.setAttribute("position",new Yr(n,3,0,!1)),As.setAttribute("uv",new Yr(n,2,3,!1))}this.geometry=As,this.material=t,this.center=new it(.5,.5),this.count=1}intersectsFrustum(t){return t.intersectsSprite(this)}raycast(t,e){t.camera===null&&Ht('Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Rs.setFromMatrixScale(this.matrixWorld),cf.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),Cs.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Rs.multiplyScalar(-Cs.z);let n=this.material.rotation,i,r;n!==0&&(r=Math.cos(n),i=Math.sin(n));let a=this.center;go(po.set(-.5,-.5,0),Cs,a,Rs,i,r),go(Cr.set(.5,-.5,0),Cs,a,Rs,i,r),go(mo.set(.5,.5,0),Cs,a,Rs,i,r),id.set(0,0),ch.set(1,0),sd.set(1,1);let o=t.ray.intersectTriangle(po,Cr,mo,!1,Ar);if(o===null&&(go(Cr.set(-.5,.5,0),Cs,a,Rs,i,r),ch.set(0,1),o=t.ray.intersectTriangle(po,mo,Cr,!1,Ar),o===null))return;let l=t.ray.origin.distanceTo(Ar);l<t.near||l>t.far||e.push({distance:l,point:Ar.clone(),uv:fi.getInterpolation(Ar,po,Cr,mo,id,ch,sd,new it),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}};function go(s,t,e,n,i,r){Ps.subVectors(s,e).addScalar(.5).multiply(n),i!==void 0?(Rr.x=r*Ps.x-i*Ps.y,Rr.y=i*Ps.x+r*Ps.y):Rr.copy(Ps),s.copy(t),s.x+=Rr.x,s.y+=Rr.y,s.applyMatrix4(cf)}var di=new E,hh=new E,xo=new E,_o=new E,Zr=class{constructor(t=new E,e=new E(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,di)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=di.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(di.copy(this.origin).addScaledVector(this.direction,e),di.distanceToSquared(t))}distanceSqToSegment(t,e,n,i){hh.copy(t).add(e).multiplyScalar(.5),xo.copy(e).sub(t).normalize(),_o.copy(this.origin).sub(hh);let r=t.distanceTo(e)*.5,a=-this.direction.dot(xo),o=_o.dot(this.direction),l=-_o.dot(xo),c=_o.lengthSq(),h=Math.abs(1-a*a),d,u,f,m;if(h>0)if(d=a*l-o,u=a*o-l,m=r*h,d>=0)if(u>=-m)if(u<=m){let v=1/h;d*=v,u*=v,f=d*(d+a*u+2*o)+u*(a*d+u+2*l)+c}else u=r,d=Math.max(0,-(a*u+o)),f=-d*d+u*(u+2*l)+c;else u=-r,d=Math.max(0,-(a*u+o)),f=-d*d+u*(u+2*l)+c;else u<=-m?(d=Math.max(0,-(-a*r+o)),u=d>0?-r:Math.min(Math.max(-r,-l),r),f=-d*d+u*(u+2*l)+c):u<=m?(d=0,u=Math.min(Math.max(-r,-l),r),f=u*(u+2*l)+c):(d=Math.max(0,-(a*r+o)),u=d>0?r:Math.min(Math.max(-r,-l),r),f=-d*d+u*(u+2*l)+c);else u=a>0?-r:r,d=Math.max(0,-(a*u+o)),f=-d*d+u*(u+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,d),i&&i.copy(hh).addScaledVector(xo,u),f}intersectSphere(t,e){if(t.radius<0)return null;di.subVectors(t.center,this.origin);let n=di.dot(this.direction),i=di.dot(di)-n*n,r=t.radius*t.radius;if(i>r)return null;let a=Math.sqrt(r-i),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,e):this.at(o,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){let n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,i,r,a,o,l,c=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,u=this.origin;return c>=0?(n=(t.min.x-u.x)*c,i=(t.max.x-u.x)*c):(n=(t.max.x-u.x)*c,i=(t.min.x-u.x)*c),h>=0?(r=(t.min.y-u.y)*h,a=(t.max.y-u.y)*h):(r=(t.max.y-u.y)*h,a=(t.min.y-u.y)*h),n>a||r>i||((r>n||isNaN(n))&&(n=r),(a<i||isNaN(i))&&(i=a),d>=0?(o=(t.min.z-u.z)*d,l=(t.max.z-u.z)*d):(o=(t.max.z-u.z)*d,l=(t.min.z-u.z)*d),n>l||o>i)||((o>n||n!==n)&&(n=o),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,e)}intersectsBox(t){return this.intersectBox(t,di)!==null}intersectTriangle(t,e,n,i,r){let a=this.origin,o=this.direction,l=o.x,c=o.y,h=o.z,d=t.x-a.x,u=t.y-a.y,f=t.z-a.z,m=e.x-a.x,v=e.y-a.y,p=e.z-a.z,g=n.x-a.x,M=n.y-a.y,w=n.z-a.z,y=Math.abs(l),b=Math.abs(c),T=Math.abs(h),P,_,A,I,L,U,D,C,B,k,V,Q;if(y>=b&&y>=T?(A=l,U=d,B=m,Q=g,l>=0?(P=c,_=h,I=u,L=f,D=v,C=p,k=M,V=w):(P=h,_=c,I=f,L=u,D=p,C=v,k=w,V=M)):b>=T?(A=c,U=u,B=v,Q=M,c>=0?(P=h,_=l,I=f,L=d,D=p,C=m,k=w,V=g):(P=l,_=h,I=d,L=f,D=m,C=p,k=g,V=w)):(A=h,U=f,B=p,Q=w,h>=0?(P=l,_=c,I=d,L=u,D=m,C=v,k=g,V=M):(P=c,_=l,I=u,L=d,D=v,C=m,k=M,V=g)),A===0)return null;let q=P/A,K=_/A,j=1/A,Rt=I-q*U,yt=L-K*U,ne=D-q*B,Yt=C-K*B,ee=k-q*Q,Y=V-K*Q,tt=ee*Yt-Y*ne,xt=Rt*Y-yt*ee,Ot=ne*yt-Yt*Rt;if(i){if(tt<0||xt<0||Ot<0)return null}else if((tt<0||xt<0||Ot<0)&&(tt>0||xt>0||Ot>0))return null;let Tt=tt+xt+Ot;if(Tt===0)return null;let Vt=j*(tt*U+xt*B+Ot*Q);return(Tt>0?Vt<0:Vt>0)?null:this.at(Vt/Tt,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},be=class extends zn{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new ht(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ei,this.combine=_l,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}},rd=new ce,$i=new Zr,vo=new Bn,ad=new E,yo=new E,Mo=new E,So=new E,uh=new E,bo=new E,od=new E,To=new E,wt=class extends Oe{constructor(t=new _e,e=new be){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){let o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(t,e){let n=this.geometry,i=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(i,t);let o=this.morphTargetInfluences;if(r&&o){bo.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let h=o[l],d=r[l];h!==0&&(uh.fromBufferAttribute(d,t),a?bo.addScaledVector(uh,h):bo.addScaledVector(uh.sub(e),h))}e.add(bo)}return e}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,e){let n=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),vo.copy(n.boundingSphere),vo.applyMatrix4(r),$i.copy(t.ray).recast(t.near),!(vo.containsPoint($i.origin)===!1&&($i.intersectSphere(vo,ad)===null||$i.origin.distanceToSquared(ad)>(t.far-t.near)**2))&&(rd.copy(r).invert(),$i.copy(t.ray).applyMatrix4(rd),!(n.boundingBox!==null&&$i.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,$i)))}_computeIntersections(t,e,n){let i,r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,d=r.attributes.normal,u=r.groups,f=r.drawRange;if(o!==null)if(Array.isArray(a))for(let m=0,v=u.length;m<v;m++){let p=u[m],g=a[p.materialIndex],M=Math.max(p.start,f.start),w=Math.min(o.count,Math.min(p.start+p.count,f.start+f.count));for(let y=M,b=w;y<b;y+=3){let T=o.getX(y),P=o.getX(y+1),_=o.getX(y+2);i=wo(this,g,t,n,c,h,d,T,P,_),i&&(i.faceIndex=Math.floor(y/3),i.face.materialIndex=p.materialIndex,e.push(i))}}else{let m=Math.max(0,f.start),v=Math.min(o.count,f.start+f.count);for(let p=m,g=v;p<g;p+=3){let M=o.getX(p),w=o.getX(p+1),y=o.getX(p+2);i=wo(this,a,t,n,c,h,d,M,w,y),i&&(i.faceIndex=Math.floor(p/3),e.push(i))}}else if(l!==void 0)if(Array.isArray(a))for(let m=0,v=u.length;m<v;m++){let p=u[m],g=a[p.materialIndex],M=Math.max(p.start,f.start),w=Math.min(l.count,Math.min(p.start+p.count,f.start+f.count));for(let y=M,b=w;y<b;y+=3){let T=y,P=y+1,_=y+2;i=wo(this,g,t,n,c,h,d,T,P,_),i&&(i.faceIndex=Math.floor(y/3),i.face.materialIndex=p.materialIndex,e.push(i))}}else{let m=Math.max(0,f.start),v=Math.min(l.count,f.start+f.count);for(let p=m,g=v;p<g;p+=3){let M=p,w=p+1,y=p+2;i=wo(this,a,t,n,c,h,d,M,w,y),i&&(i.faceIndex=Math.floor(p/3),e.push(i))}}}};function Fm(s,t,e,n,i,r,a,o){let l;if(t.side===Be?l=n.intersectTriangle(a,r,i,!0,o):l=n.intersectTriangle(i,r,a,t.side===Ni,o),l===null)return null;To.copy(o),To.applyMatrix4(s.matrixWorld);let c=e.ray.origin.distanceTo(To);return c<e.near||c>e.far?null:{distance:c,point:To.clone(),object:s}}function wo(s,t,e,n,i,r,a,o,l,c){s.getVertexPosition(o,yo),s.getVertexPosition(l,Mo),s.getVertexPosition(c,So);let h=Fm(s,t,e,n,yo,Mo,So,od);if(h){let d=new E;fi.getBarycoord(od,yo,Mo,So,d),i&&(h.uv=fi.getInterpolatedAttribute(i,o,l,c,d,new it)),r&&(h.uv1=fi.getInterpolatedAttribute(r,o,l,c,d,new it)),a&&(h.normal=fi.getInterpolatedAttribute(a,o,l,c,d,new E),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let u={a:o,b:l,c,normal:new E,materialIndex:0};fi.getNormal(yo,Mo,So,u.normal),h.face=u,h.barycoord=d}return h}var Jr=class extends rn{constructor(t=null,e=1,n=1,i,r,a,o,l,c=qe,h=qe,d,u){super(null,a,o,l,c,h,i,r,d,u),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Kr=class extends De{constructor(t,e,n,i=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){let t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}},Is=new ce,ld=new ce,Eo=[],cd=new ni,Om=new ce,Pr=new wt,Ir=new Bn,Qr=class extends wt{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new Kr(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,Om)}computeBoundingBox(){let t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new ni),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Is),cd.copy(t.boundingBox).applyMatrix4(Is),this.boundingBox.union(cd)}computeBoundingSphere(){let t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new Bn),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Is),Ir.copy(t.boundingSphere).applyMatrix4(Is),this.boundingSphere.union(Ir)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){return this.instanceColor===null?e.setRGB(1,1,1):e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){return e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){let n=e.morphTargetInfluences,i=this.morphTexture.source.data.data,r=n.length+1,a=t*r+1;for(let o=0;o<n.length;o++)n[o]=i[a+o]}raycast(t,e){let n=this.matrixWorld,i=this.count;if(Pr.geometry=this.geometry,Pr.material=this.material,Pr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Ir.copy(this.boundingSphere),Ir.applyMatrix4(n),t.ray.intersectsSphere(Ir)!==!1))for(let r=0;r<i;r++){this.getMatrixAt(r,Is),ld.multiplyMatrices(n,Is),Pr.matrixWorld=ld,Pr.raycast(t,Eo);for(let a=0,o=Eo.length;a<o;a++){let l=Eo[a];l.instanceId=r,l.object=this,e.push(l)}Eo.length=0}}setColorAt(t,e){return this.instanceColor===null&&(this.instanceColor=new Kr(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3),this}setMatrixAt(t,e){return e.toArray(this.instanceMatrix.array,t*16),this}setMorphAt(t,e){let n=e.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new Jr(new Float32Array(i*this.count),i,this.count,wl,An));let r=this.morphTexture.source.data.data,a=0;for(let c=0;c<n.length;c++)a+=n[c];let o=this.geometry.morphTargetsRelative?1:1-a,l=i*t;return r[l]=o,r.set(n,l+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},Zi=new Bn,Bm=new it(.5,.5),Ao=new E,Gs=class{constructor(t=new Un,e=new Un,n=new Un,i=new Un,r=new Un,a=new Un){this.planes=[t,e,n,i,r,a]}set(t,e,n,i,r,a){let o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(i),o[4].copy(r),o[5].copy(a),this}copy(t){let e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=On,n=!1){let i=this.planes,r=t.elements,a=r[0],o=r[1],l=r[2],c=r[3],h=r[4],d=r[5],u=r[6],f=r[7],m=r[8],v=r[9],p=r[10],g=r[11],M=r[12],w=r[13],y=r[14],b=r[15];if(i[0].setComponents(c-a,f-h,g-m,b-M).normalize(),i[1].setComponents(c+a,f+h,g+m,b+M).normalize(),i[2].setComponents(c+o,f+d,g+v,b+w).normalize(),i[3].setComponents(c-o,f-d,g-v,b-w).normalize(),n)i[4].setComponents(l,u,p,y).normalize(),i[5].setComponents(c-l,f-u,g-p,b-y).normalize();else if(i[4].setComponents(c-l,f-u,g-p,b-y).normalize(),e===On)i[5].setComponents(c+l,f+u,g+p,b+y).normalize();else if(e===Os)i[5].setComponents(l,u,p,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Zi.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Zi.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Zi)}intersectsSprite(t){Zi.center.set(0,0,0);let e=Bm.distanceTo(t.center);return Zi.radius=.7071067811865476+e,Zi.applyMatrix4(t.matrixWorld),this.intersectsSphere(Zi)}intersectsSphere(t){let e=this.planes,n=t.center,i=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(t){let e=this.planes;for(let n=0;n<6;n++){let i=e[n];if(Ao.x=i.normal.x>0?t.max.x:t.min.x,Ao.y=i.normal.y>0?t.max.y:t.min.y,Ao.z=i.normal.z>0?t.max.z:t.min.z,i.distanceToPoint(Ao)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var Ws=class extends zn{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new ht(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}},hd=new ce,Mh=new Zr,Ro=new Bn,Co=new E,Qi=class extends Oe{constructor(t=new _e,e=new Ws){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,e){let n=this.geometry,i=this.matrixWorld,r=t.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Ro.copy(n.boundingSphere),Ro.applyMatrix4(i),Ro.radius+=r,t.ray.intersectsSphere(Ro)===!1)return;hd.copy(i).invert(),Mh.copy(t.ray).applyMatrix4(hd);let o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=n.index,d=n.attributes.position;if(c!==null){let u=Math.max(0,a.start),f=Math.min(c.count,a.start+a.count);for(let m=u,v=f;m<v;m++){let p=c.getX(m);Co.fromBufferAttribute(d,p),ud(Co,p,l,i,t,e,this)}}else{let u=Math.max(0,a.start),f=Math.min(d.count,a.start+a.count);for(let m=u,v=f;m<v;m++)Co.fromBufferAttribute(d,m),ud(Co,m,l,i,t,e,this)}}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){let o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}};function ud(s,t,e,n,i,r,a){let o=Mh.distanceSqToPoint(s);if(o<e){let l=new E;Mh.closestPointToPoint(s,l),l.applyMatrix4(n);let c=i.ray.origin.distanceTo(l);if(c<i.near||c>i.far)return;r.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:t,face:null,faceIndex:null,barycoord:null,object:a})}}var jr=class extends rn{constructor(t=[],e=Fi,n,i,r,a,o,l,c,h){super(t,e,n,i,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}},ji=class extends rn{constructor(t,e,n,i,r,a,o,l,c){super(t,e,n,i,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}};var Ci=class extends rn{constructor(t,e,n=Hn,i,r,a,o=qe,l=qe,c,h=jn,d=1){if(h!==jn&&h!==Bi)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let u={width:t,height:e,depth:d};super(u,i,r,a,o,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new ks(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);return e.compareFunction=this.compareFunction,e}},Zo=class extends Ci{constructor(t,e=Hn,n=Fi,i,r,a=qe,o=qe,l,c=jn){let h={width:t,height:t,depth:1},d=[h,h,h,h,h,h];super(t,t,e,n,i,r,a,o,l,c),this.image=d,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(t){this.image=t}},ta=class extends rn{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}},Te=class s extends _e{constructor(t=1,e=1,n=1,i=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:i,heightSegments:r,depthSegments:a};let o=this;i=Math.floor(i),r=Math.floor(r),a=Math.floor(a);let l=[],c=[],h=[],d=[],u=0,f=0;m("z","y","x",-1,-1,n,e,t,a,r,0),m("z","y","x",1,-1,n,e,-t,a,r,1),m("x","z","y",1,1,t,n,e,i,a,2),m("x","z","y",1,-1,t,n,-e,i,a,3),m("x","y","z",1,-1,t,e,n,i,r,4),m("x","y","z",-1,-1,t,e,-n,i,r,5),this.setIndex(l),this.setAttribute("position",new Zt(c,3)),this.setAttribute("normal",new Zt(h,3)),this.setAttribute("uv",new Zt(d,2));function m(v,p,g,M,w,y,b,T,P,_,A){let I=y/P,L=b/_,U=y/2,D=b/2,C=T/2,B=P+1,k=_+1,V=0,Q=0,q=new E;for(let K=0;K<k;K++){let j=K*L-D;for(let Rt=0;Rt<B;Rt++){let yt=Rt*I-U;q[v]=yt*M,q[p]=j*w,q[g]=C,c.push(q.x,q.y,q.z),q[v]=0,q[p]=0,q[g]=T>0?1:-1,h.push(q.x,q.y,q.z),d.push(Rt/P),d.push(1-K/_),V+=1}}for(let K=0;K<_;K++)for(let j=0;j<P;j++){let Rt=u+j+B*K,yt=u+j+B*(K+1),ne=u+(j+1)+B*(K+1),Yt=u+(j+1)+B*K;l.push(Rt,yt,Yt),l.push(yt,ne,Yt),Q+=6}o.addGroup(f,Q,A),f+=Q,u+=V}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};var kn=class s extends _e{constructor(t=1,e=1,n=1,i=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:i,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};let c=this;i=Math.floor(i),r=Math.floor(r);let h=[],d=[],u=[],f=[],m=0,v=[],p=n/2,g=0;M(),a===!1&&(t>0&&w(!0),e>0&&w(!1)),this.setIndex(h),this.setAttribute("position",new Zt(d,3)),this.setAttribute("normal",new Zt(u,3)),this.setAttribute("uv",new Zt(f,2));function M(){let y=new E,b=new E,T=0,P=(e-t)/n;for(let _=0;_<=r;_++){let A=[],I=_/r,L=I*(e-t)+t;for(let U=0;U<=i;U++){let D=U/i,C=D*l+o,B=Math.sin(C),k=Math.cos(C);b.x=L*B,b.y=-I*n+p,b.z=L*k,d.push(b.x,b.y,b.z),y.set(B,P,k).normalize(),u.push(y.x,y.y,y.z),f.push(D,1-I),A.push(m++)}v.push(A)}for(let _=0;_<i;_++)for(let A=0;A<r;A++){let I=v[A][_],L=v[A+1][_],U=v[A+1][_+1],D=v[A][_+1];(t>0||A!==0)&&(h.push(I,L,D),T+=3),(e>0||A!==r-1)&&(h.push(L,U,D),T+=3)}c.addGroup(g,T,0),g+=T}function w(y){let b=m,T=new it,P=new E,_=0,A=y===!0?t:e,I=y===!0?1:-1;for(let U=1;U<=i;U++)d.push(0,p*I,0),u.push(0,I,0),f.push(.5,.5),m++;let L=m;for(let U=0;U<=i;U++){let C=U/i*l+o,B=Math.cos(C),k=Math.sin(C);P.x=A*k,P.y=p*I,P.z=A*B,d.push(P.x,P.y,P.z),u.push(0,I,0),T.x=B*.5+.5,T.y=k*.5*I+.5,f.push(T.x,T.y),m++}for(let U=0;U<i;U++){let D=b+U,C=L+U;y===!0?h.push(C,C+1,D):h.push(C+1,C,D),_+=3}c.addGroup(g,_,y===!0?1:2),g+=_}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},Xs=class s extends kn{constructor(t=1,e=1,n=32,i=1,r=!1,a=0,o=Math.PI*2){super(0,t,e,n,i,r,a,o),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:i,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(t){return new s(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},Jo=class s extends _e{constructor(t=[],e=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:i};let r=[],a=[];o(i),c(n),h(),this.setAttribute("position",new Zt(r,3)),this.setAttribute("normal",new Zt(r.slice(),3)),this.setAttribute("uv",new Zt(a,2)),i===0?this.computeVertexNormals():this.normalizeNormals();function o(M){let w=new E,y=new E,b=new E;for(let T=0;T<e.length;T+=3)f(e[T+0],w),f(e[T+1],y),f(e[T+2],b),l(w,y,b,M)}function l(M,w,y,b){let T=b+1,P=[];for(let _=0;_<=T;_++){P[_]=[];let A=M.clone().lerp(y,_/T),I=w.clone().lerp(y,_/T),L=T-_;for(let U=0;U<=L;U++)U===0&&_===T?P[_][U]=A:P[_][U]=A.clone().lerp(I,U/L)}for(let _=0;_<T;_++)for(let A=0;A<2*(T-_)-1;A++){let I=Math.floor(A/2);A%2===0?(u(P[_][I+1]),u(P[_+1][I]),u(P[_][I])):(u(P[_][I+1]),u(P[_+1][I+1]),u(P[_+1][I]))}}function c(M){let w=new E;for(let y=0;y<r.length;y+=3)w.x=r[y+0],w.y=r[y+1],w.z=r[y+2],w.normalize().multiplyScalar(M),r[y+0]=w.x,r[y+1]=w.y,r[y+2]=w.z}function h(){let M=new E;for(let w=0;w<r.length;w+=3){M.x=r[w+0],M.y=r[w+1],M.z=r[w+2];let y=p(M)/2/Math.PI+.5,b=g(M)/Math.PI+.5;a.push(y,1-b)}m(),d()}function d(){for(let M=0;M<a.length;M+=6){let w=a[M+0],y=a[M+2],b=a[M+4],T=Math.max(w,y,b),P=Math.min(w,y,b);T>.9&&P<.1&&(w<.2&&(a[M+0]+=1),y<.2&&(a[M+2]+=1),b<.2&&(a[M+4]+=1))}}function u(M){r.push(M.x,M.y,M.z)}function f(M,w){let y=M*3;w.x=t[y+0],w.y=t[y+1],w.z=t[y+2]}function m(){let M=new E,w=new E,y=new E,b=new E,T=new it,P=new it,_=new it;for(let A=0,I=0;A<r.length;A+=9,I+=6){M.set(r[A+0],r[A+1],r[A+2]),w.set(r[A+3],r[A+4],r[A+5]),y.set(r[A+6],r[A+7],r[A+8]),T.set(a[I+0],a[I+1]),P.set(a[I+2],a[I+3]),_.set(a[I+4],a[I+5]),b.copy(M).add(w).add(y).divideScalar(3);let L=p(b);v(T,I+0,M,L),v(P,I+2,w,L),v(_,I+4,y,L)}}function v(M,w,y,b){b<0&&M.x===1&&(a[w]=M.x-1),y.x===0&&y.z===0&&(a[w]=b/2/Math.PI+.5)}function p(M){return Math.atan2(M.z,-M.x)}function g(M){return Math.atan2(-M.y,Math.sqrt(M.x*M.x+M.z*M.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.vertices,t.indices,t.radius,t.detail)}};var vn=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){kt("Curve: .getPoint() not implemented.")}getPointAt(t,e){let n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){let t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let e=[],n,i=this.getPoint(0),r=0;e.push(0);for(let a=1;a<=t;a++)n=this.getPoint(a/t),r+=n.distanceTo(i),e.push(r),i=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){let n=this.getLengths(),i=0,r=n.length,a;e?a=e:a=t*n[r-1];let o=0,l=r-1,c;for(;o<=l;)if(i=Math.floor(o+(l-o)/2),c=n[i]-a,c<0)o=i+1;else if(c>0)l=i-1;else{l=i;break}if(i=l,n[i]===a)return i/(r-1);let h=n[i],u=n[i+1]-h,f=(a-h)/u;return(i+f)/(r-1)}getTangent(t,e){let i=t-1e-4,r=t+1e-4;i<0&&(i=0),r>1&&(r=1);let a=this.getPoint(i),o=this.getPoint(r),l=e||(a.isVector2?new it:new E);return l.copy(o).sub(a).normalize(),l}getTangentAt(t,e){let n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e=!1){let n=new E,i=[],r=[],a=[],o=new E,l=new ce;for(let f=0;f<=t;f++){let m=f/t;i[f]=this.getTangentAt(m,new E)}r[0]=new E,a[0]=new E;let c=Number.MAX_VALUE,h=Math.abs(i[0].x),d=Math.abs(i[0].y),u=Math.abs(i[0].z);h<=c&&(c=h,n.set(1,0,0)),d<=c&&(c=d,n.set(0,1,0)),u<=c&&n.set(0,0,1),o.crossVectors(i[0],n).normalize(),r[0].crossVectors(i[0],o),a[0].crossVectors(i[0],r[0]);for(let f=1;f<=t;f++){if(r[f]=r[f-1].clone(),a[f]=a[f-1].clone(),o.crossVectors(i[f-1],i[f]),o.length()>Number.EPSILON){o.normalize();let m=Math.acos(Kt(i[f-1].dot(i[f]),-1,1));r[f].applyMatrix4(l.makeRotationAxis(o,m))}a[f].crossVectors(i[f],r[f])}if(e===!0){let f=Math.acos(Kt(r[0].dot(r[t]),-1,1));f/=t,i[0].dot(o.crossVectors(r[0],r[t]))>0&&(f=-f);for(let m=1;m<=t;m++)r[m].applyMatrix4(l.makeRotationAxis(i[m],f*m)),a[m].crossVectors(i[m],r[m])}return{tangents:i,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){let t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}},qs=class extends vn{constructor(t=0,e=0,n=1,i=1,r=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=i,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(t,e=new it){let n=e,i=Math.PI*2,r=this.aEndAngle-this.aStartAngle,a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=i;for(;r>i;)r-=i;r<Number.EPSILON&&(a?r=0:r=i),this.aClockwise===!0&&!a&&(r===i?r=-i:r=r-i);let o=this.aStartAngle+t*r,l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let h=Math.cos(this.aRotation),d=Math.sin(this.aRotation),u=l-this.aX,f=c-this.aY;l=u*h-f*d+this.aX,c=u*d+f*h+this.aY}return n.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){let t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}},Ko=class extends qs{constructor(t,e,n,i,r,a){super(t,e,n,n,i,r,a),this.isArcCurve=!0,this.type="ArcCurve"}};function Xh(){let s=0,t=0,e=0,n=0;function i(r,a,o,l){s=r,t=o,e=-3*r+3*a-2*o-l,n=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,c){i(a,o,c*(o-r),c*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,c,h,d){let u=(a-r)/c-(o-r)/(c+h)+(o-a)/h,f=(o-a)/h-(l-a)/(h+d)+(l-o)/d;u*=h,f*=h,i(a,o,u,f)},calc:function(r){let a=r*r,o=a*r;return s+t*r+e*a+n*o}}}var dd=new E,fd=new E,dh=new Xh,fh=new Xh,ph=new Xh,Qo=class extends vn{constructor(t=[],e=!1,n="centripetal",i=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=i}getPoint(t,e=new E){let n=e,i=this.points,r=i.length,a=(r-(this.closed?0:1))*t,o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let c,h;this.closed||o>0?c=i[(o-1)%r]:(fd.subVectors(i[0],i[1]).add(i[0]),c=fd);let d=i[o%r],u=i[(o+1)%r];if(this.closed||o+2<r?h=i[(o+2)%r]:(dd.subVectors(i[r-1],i[r-2]).add(i[r-1]),h=dd),this.curveType==="centripetal"||this.curveType==="chordal"){let f=this.curveType==="chordal"?.5:.25,m=Math.pow(c.distanceToSquared(d),f),v=Math.pow(d.distanceToSquared(u),f),p=Math.pow(u.distanceToSquared(h),f);v<1e-4&&(v=1),m<1e-4&&(m=v),p<1e-4&&(p=v),dh.initNonuniformCatmullRom(c.x,d.x,u.x,h.x,m,v,p),fh.initNonuniformCatmullRom(c.y,d.y,u.y,h.y,m,v,p),ph.initNonuniformCatmullRom(c.z,d.z,u.z,h.z,m,v,p)}else this.curveType==="catmullrom"&&(dh.initCatmullRom(c.x,d.x,u.x,h.x,this.tension),fh.initCatmullRom(c.y,d.y,u.y,h.y,this.tension),ph.initCatmullRom(c.z,d.z,u.z,h.z,this.tension));return n.set(dh.calc(l),fh.calc(l),ph.calc(l)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let i=t.points[e];this.points.push(i.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let i=this.points[e];t.points.push(i.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let i=t.points[e];this.points.push(new E().fromArray(i))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}};function pd(s,t,e,n,i){let r=(n-t)*.5,a=(i-e)*.5,o=s*s,l=s*o;return(2*e-2*n+r+a)*l+(-3*e+3*n-2*r-a)*o+r*s+e}function zm(s,t){let e=1-s;return e*e*t}function km(s,t){return 2*(1-s)*s*t}function Vm(s,t){return s*s*t}function Ur(s,t,e,n){return zm(s,t)+km(s,e)+Vm(s,n)}function Hm(s,t){let e=1-s;return e*e*e*t}function Gm(s,t){let e=1-s;return 3*e*e*s*t}function Wm(s,t){return 3*(1-s)*s*s*t}function Xm(s,t){return s*s*s*t}function Fr(s,t,e,n,i){return Hm(s,t)+Gm(s,e)+Wm(s,n)+Xm(s,i)}var ea=class extends vn{constructor(t=new it,e=new it,n=new it,i=new it){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=i}getPoint(t,e=new it){let n=e,i=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Fr(t,i.x,r.x,a.x,o.x),Fr(t,i.y,r.y,a.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},jo=class extends vn{constructor(t=new E,e=new E,n=new E,i=new E){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=i}getPoint(t,e=new E){let n=e,i=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Fr(t,i.x,r.x,a.x,o.x),Fr(t,i.y,r.y,a.y,o.y),Fr(t,i.z,r.z,a.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},na=class extends vn{constructor(t=new it,e=new it){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new it){let n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new it){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},tl=class extends vn{constructor(t=new E,e=new E){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new E){let n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new E){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},ia=class extends vn{constructor(t=new it,e=new it,n=new it){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new it){let n=e,i=this.v0,r=this.v1,a=this.v2;return n.set(Ur(t,i.x,r.x,a.x),Ur(t,i.y,r.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},el=class extends vn{constructor(t=new E,e=new E,n=new E){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new E){let n=e,i=this.v0,r=this.v1,a=this.v2;return n.set(Ur(t,i.x,r.x,a.x),Ur(t,i.y,r.y,a.y),Ur(t,i.z,r.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},sa=class extends vn{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new it){let n=e,i=this.points,r=(i.length-1)*t,a=Math.floor(r),o=r-a,l=i[a===0?a:a-1],c=i[a],h=i[a>i.length-2?i.length-1:a+1],d=i[a>i.length-3?i.length-1:a+2];return n.set(pd(o,l.x,c.x,h.x,d.x),pd(o,l.y,c.y,h.y,d.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let i=t.points[e];this.points.push(i.clone())}return this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let i=this.points[e];t.points.push(i.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let i=t.points[e];this.points.push(new it().fromArray(i))}return this}},Sh=Object.freeze({__proto__:null,ArcCurve:Ko,CatmullRomCurve3:Qo,CubicBezierCurve:ea,CubicBezierCurve3:jo,EllipseCurve:qs,LineCurve:na,LineCurve3:tl,QuadraticBezierCurve:ia,QuadraticBezierCurve3:el,SplineCurve:sa}),nl=class extends vn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){let t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){let n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Sh[n](e,t))}return this}getPoint(t,e){let n=t*this.getLength(),i=this.getCurveLengths(),r=0;for(;r<i.length;){if(i[r]>=n){let a=i[r]-n,o=this.curves[r],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,e)}r++}return null}getLength(){let t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let t=[],e=0;for(let n=0,i=this.curves.length;n<i;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){let e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){let e=[],n;for(let i=0,r=this.curves;i<r.length;i++){let a=r[i],o=a.isEllipseCurve?t*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?t*a.points.length:t,l=a.getPoints(o);for(let c=0;c<l.length;c++){let h=l[c];n&&n.equals(h)||(e.push(h),n=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){let i=t.curves[e];this.curves.push(i.clone())}return this.autoClose=t.autoClose,this}toJSON(){let t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){let i=this.curves[e];t.curves.push(i.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){let i=t.curves[e];this.curves.push(new Sh[i.type]().fromJSON(i))}return this}},ra=class extends nl{constructor(t){super(),this.type="Path",this.currentPoint=new it,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){let n=new na(this.currentPoint.clone(),new it(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,i){let r=new ia(this.currentPoint.clone(),new it(t,e),new it(n,i));return this.curves.push(r),this.currentPoint.set(n,i),this}bezierCurveTo(t,e,n,i,r,a){let o=new ea(this.currentPoint.clone(),new it(t,e),new it(n,i),new it(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(t){let e=[this.currentPoint.clone()].concat(t),n=new sa(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,i,r,a){let o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+o,e+l,n,i,r,a),this}absarc(t,e,n,i,r,a){return this.absellipse(t,e,n,n,i,r,a),this}ellipse(t,e,n,i,r,a,o,l){let c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+c,e+h,n,i,r,a,o,l),this}absellipse(t,e,n,i,r,a,o,l){let c=new qs(t,e,n,i,r,a,o,l);if(this.curves.length>0){let d=c.getPoint(0);d.equals(this.currentPoint)||this.lineTo(d.x,d.y)}this.curves.push(c);let h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){let t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}},ii=class extends ra{constructor(t){super(t),this.uuid=Qn(),this.type="Shape",this.holes=[]}getPointsHoles(t){let e=[];for(let n=0,i=this.holes.length;n<i;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){let i=t.holes[e];this.holes.push(i.clone())}return this}toJSON(){let t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){let i=this.holes[e];t.holes.push(i.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){let i=t.holes[e];this.holes.push(new ra().fromJSON(i))}return this}};function qm(s,t,e=2){let n=t&&t.length,i=n?t[0]*e:s.length,r=hf(s,0,i,e,!0),a=[];if(!r||r.next===r.prev)return a;let o,l,c;if(n&&(r=Km(s,t,r,e)),s.length>80*e){o=s[0],l=s[1];let h=o,d=l;for(let u=e;u<i;u+=e){let f=s[u],m=s[u+1];f<o&&(o=f),m<l&&(l=m),f>h&&(h=f),m>d&&(d=m)}c=Math.max(h-o,d-l),c=c!==0?32767/c:0}return aa(r,a,e,o,l,c,0),a}function hf(s,t,e,n,i){let r;if(i===lg(s,t,e,n)>0)for(let a=t;a<e;a+=n)r=md(a/n|0,s[a],s[a+1],r);else for(let a=e-n;a>=t;a-=n)r=md(a/n|0,s[a],s[a+1],r);return r&&Ys(r,r.next)&&(la(r),r=r.next),r}function ts(s,t){if(!s)return s;t||(t=s);let e=s,n;do if(n=!1,!e.steiner&&(Ys(e,e.next)||Ce(e.prev,e,e.next)===0)){if(la(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function aa(s,t,e,n,i,r,a){if(!s)return;!a&&r&&ng(s,n,i,r);let o=s;for(;s.prev!==s.next;){let l=s.prev,c=s.next;if(r?$m(s,n,i,r):Ym(s)){t.push(l.i,s.i,c.i),la(s),s=c.next,o=c.next;continue}if(s=c,s===o){a?a===1?(s=Zm(ts(s),t),aa(s,t,e,n,i,r,2)):a===2&&Jm(s,t,e,n,i,r):aa(ts(s),t,e,n,i,r,1);break}}}function Ym(s){let t=s.prev,e=s,n=s.next;if(Ce(t,e,n)>=0)return!1;let i=t.x,r=e.x,a=n.x,o=t.y,l=e.y,c=n.y,h=Math.min(i,r,a),d=Math.min(o,l,c),u=Math.max(i,r,a),f=Math.max(o,l,c),m=n.next;for(;m!==t;){if(m.x>=h&&m.x<=u&&m.y>=d&&m.y<=f&&Lr(i,o,r,l,a,c,m.x,m.y)&&Ce(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function $m(s,t,e,n){let i=s.prev,r=s,a=s.next;if(Ce(i,r,a)>=0)return!1;let o=i.x,l=r.x,c=a.x,h=i.y,d=r.y,u=a.y,f=Math.min(o,l,c),m=Math.min(h,d,u),v=Math.max(o,l,c),p=Math.max(h,d,u),g=bh(f,m,t,e,n),M=bh(v,p,t,e,n),w=s.prevZ,y=s.nextZ;for(;w&&w.z>=g&&y&&y.z<=M;){if(w.x>=f&&w.x<=v&&w.y>=m&&w.y<=p&&w!==i&&w!==a&&Lr(o,h,l,d,c,u,w.x,w.y)&&Ce(w.prev,w,w.next)>=0||(w=w.prevZ,y.x>=f&&y.x<=v&&y.y>=m&&y.y<=p&&y!==i&&y!==a&&Lr(o,h,l,d,c,u,y.x,y.y)&&Ce(y.prev,y,y.next)>=0))return!1;y=y.nextZ}for(;w&&w.z>=g;){if(w.x>=f&&w.x<=v&&w.y>=m&&w.y<=p&&w!==i&&w!==a&&Lr(o,h,l,d,c,u,w.x,w.y)&&Ce(w.prev,w,w.next)>=0)return!1;w=w.prevZ}for(;y&&y.z<=M;){if(y.x>=f&&y.x<=v&&y.y>=m&&y.y<=p&&y!==i&&y!==a&&Lr(o,h,l,d,c,u,y.x,y.y)&&Ce(y.prev,y,y.next)>=0)return!1;y=y.nextZ}return!0}function Zm(s,t){let e=s;do{let n=e.prev,i=e.next.next;!Ys(n,i)&&df(n,e,e.next,i)&&oa(n,i)&&oa(i,n)&&(t.push(n.i,e.i,i.i),la(e),la(e.next),e=s=i),e=e.next}while(e!==s);return ts(e)}function Jm(s,t,e,n,i,r){let a=s;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&rg(a,o)){let l=ff(a,o);a=ts(a,a.next),l=ts(l,l.next),aa(a,t,e,n,i,r,0),aa(l,t,e,n,i,r,0);return}o=o.next}a=a.next}while(a!==s)}function Km(s,t,e,n){let i=[];for(let r=0,a=t.length;r<a;r++){let o=t[r]*n,l=r<a-1?t[r+1]*n:s.length,c=hf(s,o,l,n,!1);c===c.next&&(c.steiner=!0),i.push(sg(c))}i.sort(Qm);for(let r=0;r<i.length;r++)e=jm(i[r],e);return e}function Qm(s,t){let e=s.x-t.x;if(e===0&&(e=s.y-t.y,e===0)){let n=(s.next.y-s.y)/(s.next.x-s.x),i=(t.next.y-t.y)/(t.next.x-t.x);e=n-i}return e}function jm(s,t){let e=tg(s,t);if(!e)return t;let n=ff(e,s);return ts(n,n.next),ts(e,e.next)}function tg(s,t){let e=t,n=s.x,i=s.y,r=-1/0,a;if(Ys(s,e))return e;do{if(Ys(s,e.next))return e.next;if(i<=e.y&&i>=e.next.y&&e.next.y!==e.y){let d=e.x+(i-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(d<=n&&d>r&&(r=d,a=e.x<e.next.x?e:e.next,d===n))return a}e=e.next}while(e!==t);if(!a)return null;let o=a,l=a.x,c=a.y,h=1/0;e=a;do{if(n>=e.x&&e.x>=l&&n!==e.x&&uf(i<c?n:r,i,l,c,i<c?r:n,i,e.x,e.y)){let d=Math.abs(i-e.y)/(n-e.x);oa(e,s)&&(d<h||d===h&&(e.x>a.x||e.x===a.x&&eg(a,e)))&&(a=e,h=d)}e=e.next}while(e!==o);return a}function eg(s,t){return Ce(s.prev,s,t.prev)<0&&Ce(t.next,s,s.next)<0}function ng(s,t,e,n){let i=s;do i.z===0&&(i.z=bh(i.x,i.y,t,e,n)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==s);i.prevZ.nextZ=null,i.prevZ=null,ig(i)}function ig(s){let t,e=1;do{let n=s,i;s=null;let r=null;for(t=0;n;){t++;let a=n,o=0;for(let c=0;c<e&&(o++,a=a.nextZ,!!a);c++);let l=e;for(;o>0||l>0&&a;)o!==0&&(l===0||!a||n.z<=a.z)?(i=n,n=n.nextZ,o--):(i=a,a=a.nextZ,l--),r?r.nextZ=i:s=i,i.prevZ=r,r=i;n=a}r.nextZ=null,e*=2}while(t>1);return s}function bh(s,t,e,n,i){return s=(s-e)*i|0,t=(t-n)*i|0,s=(s|s<<8)&16711935,s=(s|s<<4)&252645135,s=(s|s<<2)&858993459,s=(s|s<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,s|t<<1}function sg(s){let t=s,e=s;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==s);return e}function uf(s,t,e,n,i,r,a,o){return(i-a)*(t-o)>=(s-a)*(r-o)&&(s-a)*(n-o)>=(e-a)*(t-o)&&(e-a)*(r-o)>=(i-a)*(n-o)}function Lr(s,t,e,n,i,r,a,o){return!(s===a&&t===o)&&uf(s,t,e,n,i,r,a,o)}function rg(s,t){return s.next.i!==t.i&&s.prev.i!==t.i&&!ag(s,t)&&(oa(s,t)&&oa(t,s)&&og(s,t)&&(Ce(s.prev,s,t.prev)||Ce(s,t.prev,t))||Ys(s,t)&&Ce(s.prev,s,s.next)>0&&Ce(t.prev,t,t.next)>0)}function Ce(s,t,e){return(t.y-s.y)*(e.x-t.x)-(t.x-s.x)*(e.y-t.y)}function Ys(s,t){return s.x===t.x&&s.y===t.y}function df(s,t,e,n){let i=Io(Ce(s,t,e)),r=Io(Ce(s,t,n)),a=Io(Ce(e,n,s)),o=Io(Ce(e,n,t));return!!(i!==r&&a!==o||i===0&&Po(s,e,t)||r===0&&Po(s,n,t)||a===0&&Po(e,s,n)||o===0&&Po(e,t,n))}function Po(s,t,e){return t.x<=Math.max(s.x,e.x)&&t.x>=Math.min(s.x,e.x)&&t.y<=Math.max(s.y,e.y)&&t.y>=Math.min(s.y,e.y)}function Io(s){return s>0?1:s<0?-1:0}function ag(s,t){let e=s;do{if(e.i!==s.i&&e.next.i!==s.i&&e.i!==t.i&&e.next.i!==t.i&&df(e,e.next,s,t))return!0;e=e.next}while(e!==s);return!1}function oa(s,t){return Ce(s.prev,s,s.next)<0?Ce(s,t,s.next)>=0&&Ce(s,s.prev,t)>=0:Ce(s,t,s.prev)<0||Ce(s,s.next,t)<0}function og(s,t){let e=s,n=!1,i=(s.x+t.x)/2,r=(s.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&i<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==s);return n}function ff(s,t){let e=Th(s.i,s.x,s.y),n=Th(t.i,t.x,t.y),i=s.next,r=t.prev;return s.next=t,t.prev=s,e.next=i,i.prev=e,n.next=e,e.prev=n,r.next=n,n.prev=r,n}function md(s,t,e,n){let i=Th(s,t,e);return n?(i.next=n.next,i.prev=n,n.next.prev=i,n.next=i):(i.prev=i,i.next=i),i}function la(s){s.next.prev=s.prev,s.prev.next=s.next,s.prevZ&&(s.prevZ.nextZ=s.nextZ),s.nextZ&&(s.nextZ.prevZ=s.prevZ)}function Th(s,t,e){return{i:s,x:t,y:e,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function lg(s,t,e,n){let i=0;for(let r=t,a=e-n;r<e;r+=n)i+=(s[a]-s[r])*(s[r+1]+s[a+1]),a=r;return i}var wh=class{static triangulate(t,e,n=2){return qm(t,e,n)}},Kn=class s{static area(t){let e=t.length,n=0;for(let i=e-1,r=0;r<e;i=r++)n+=t[i].x*t[r].y-t[r].x*t[i].y;return n*.5}static isClockWise(t){return s.area(t)<0}static triangulateShape(t,e){let n=[],i=[],r=[];gd(t),xd(n,t);let a=t.length;e.forEach(gd);for(let l=0;l<e.length;l++)i.push(a),a+=e[l].length,xd(n,e[l]);let o=wh.triangulate(n,i);for(let l=0;l<o.length;l+=3)r.push(o.slice(l,l+3));return r}};function gd(s){let t=s.length;t>2&&s[t-1].equals(s[0])&&s.pop()}function xd(s,t){for(let e=0;e<t.length;e++)s.push(t[e].x),s.push(t[e].y)}var es=class s extends _e{constructor(t=new ii([new it(.5,.5),new it(-.5,.5),new it(-.5,-.5),new it(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];let n=this,i=[],r=[];for(let o=0,l=t.length;o<l;o++){let c=t[o];a(c)}this.setAttribute("position",new Zt(i,3)),this.setAttribute("uv",new Zt(r,2)),this.computeVertexNormals();function a(o){let l=[],c=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,d=e.depth!==void 0?e.depth:1,u=e.bevelEnabled!==void 0?e.bevelEnabled:!0,f=e.bevelThickness!==void 0?e.bevelThickness:.2,m=e.bevelSize!==void 0?e.bevelSize:f-.1,v=e.bevelOffset!==void 0?e.bevelOffset:0,p=e.bevelSegments!==void 0?e.bevelSegments:3,g=e.extrudePath,M=e.UVGenerator!==void 0?e.UVGenerator:cg,w,y=!1,b,T,P,_;if(g){w=g.getSpacedPoints(h),y=!0,u=!1;let et=g.isCatmullRomCurve3?g.closed:!1;b=g.computeFrenetFrames(h,et),T=new E,P=new E,_=new E}u||(p=0,f=0,m=0,v=0);let A=o.extractPoints(c),I=A.shape,L=A.holes;if(!Kn.isClockWise(I)){I=I.reverse();for(let et=0,rt=L.length;et<rt;et++){let at=L[et];Kn.isClockWise(at)&&(L[et]=at.reverse())}}function D(et){let at=10000000000000001e-36,ot=et[0];for(let ct=1;ct<=et.length;ct++){let Bt=ct%et.length,Ft=et[Bt],Gt=Ft.x-ot.x,Xt=Ft.y-ot.y,N=Gt*Gt+Xt*Xt,he=Math.max(Math.abs(Ft.x),Math.abs(Ft.y),Math.abs(ot.x),Math.abs(ot.y)),jt=at*he*he;if(N<=jt){et.splice(Bt,1),ct--;continue}ot=Ft}}D(I),L.forEach(D);let C=L.length,B=I;for(let et=0;et<C;et++){let rt=L[et];I=I.concat(rt)}function k(et,rt,at){return rt||Ht("ExtrudeGeometry: vec does not exist"),et.clone().addScaledVector(rt,at)}let V=I.length;function Q(et,rt,at){let ot,ct,Bt,Ft=et.x-rt.x,Gt=et.y-rt.y,Xt=at.x-et.x,N=at.y-et.y,he=Ft*Ft+Gt*Gt,jt=Ft*N-Gt*Xt;if(Math.abs(jt)>Number.EPSILON){let R=Math.sqrt(he),x=Math.sqrt(Xt*Xt+N*N),z=rt.x-Gt/R,W=rt.y+Ft/R,$=at.x-N/x,lt=at.y+Xt/x,ut=(($-z)*N-(lt-W)*Xt)/(Ft*N-Gt*Xt);ot=z+Ft*ut-et.x,ct=W+Gt*ut-et.y;let Z=ot*ot+ct*ct;if(Z<=2)return new it(ot,ct);Bt=Math.sqrt(Z/2)}else{let R=!1;Ft>Number.EPSILON?Xt>Number.EPSILON&&(R=!0):Ft<-Number.EPSILON?Xt<-Number.EPSILON&&(R=!0):Math.sign(Gt)===Math.sign(N)&&(R=!0),R?(ot=-Gt,ct=Ft,Bt=Math.sqrt(he)):(ot=Ft,ct=Gt,Bt=Math.sqrt(he/2))}return new it(ot/Bt,ct/Bt)}let q=[];for(let et=0,rt=B.length,at=rt-1,ot=et+1;et<rt;et++,at++,ot++)at===rt&&(at=0),ot===rt&&(ot=0),q[et]=Q(B[et],B[at],B[ot]);let K=[],j,Rt=q.concat();for(let et=0,rt=C;et<rt;et++){let at=L[et];j=[];for(let ot=0,ct=at.length,Bt=ct-1,Ft=ot+1;ot<ct;ot++,Bt++,Ft++)Bt===ct&&(Bt=0),Ft===ct&&(Ft=0),j[ot]=Q(at[ot],at[Bt],at[Ft]);K.push(j),Rt=Rt.concat(j)}let yt;if(p===0)yt=Kn.triangulateShape(B,L);else{let et=[],rt=[];for(let at=0;at<p;at++){let ot=at/p,ct=f*Math.cos(ot*Math.PI/2),Bt=m*Math.sin(ot*Math.PI/2)+v;for(let Ft=0,Gt=B.length;Ft<Gt;Ft++){let Xt=k(B[Ft],q[Ft],Bt);xt(Xt.x,Xt.y,-ct),ot===0&&et.push(Xt)}for(let Ft=0,Gt=C;Ft<Gt;Ft++){let Xt=L[Ft];j=K[Ft];let N=[];for(let he=0,jt=Xt.length;he<jt;he++){let R=k(Xt[he],j[he],Bt);xt(R.x,R.y,-ct),ot===0&&N.push(R)}ot===0&&rt.push(N)}}yt=Kn.triangulateShape(et,rt)}let ne=yt.length,Yt=m+v;for(let et=0;et<V;et++){let rt=u?k(I[et],Rt[et],Yt):I[et];y?(P.copy(b.normals[0]).multiplyScalar(rt.x),T.copy(b.binormals[0]).multiplyScalar(rt.y),_.copy(w[0]).add(P).add(T),xt(_.x,_.y,_.z)):xt(rt.x,rt.y,0)}for(let et=1;et<=h;et++)for(let rt=0;rt<V;rt++){let at=u?k(I[rt],Rt[rt],Yt):I[rt];y?(P.copy(b.normals[et]).multiplyScalar(at.x),T.copy(b.binormals[et]).multiplyScalar(at.y),_.copy(w[et]).add(P).add(T),xt(_.x,_.y,_.z)):xt(at.x,at.y,d/h*et)}for(let et=p-1;et>=0;et--){let rt=et/p,at=f*Math.cos(rt*Math.PI/2),ot=m*Math.sin(rt*Math.PI/2)+v;for(let ct=0,Bt=B.length;ct<Bt;ct++){let Ft=k(B[ct],q[ct],ot);xt(Ft.x,Ft.y,d+at)}for(let ct=0,Bt=L.length;ct<Bt;ct++){let Ft=L[ct];j=K[ct];for(let Gt=0,Xt=Ft.length;Gt<Xt;Gt++){let N=k(Ft[Gt],j[Gt],ot);y?xt(N.x,N.y+w[h-1].y,w[h-1].x+at):xt(N.x,N.y,d+at)}}}ee(),Y();function ee(){let et=i.length/3;if(u){let rt=0,at=V*rt;for(let ot=0;ot<ne;ot++){let ct=yt[ot];Ot(ct[2]+at,ct[1]+at,ct[0]+at)}rt=h+p*2,at=V*rt;for(let ot=0;ot<ne;ot++){let ct=yt[ot];Ot(ct[0]+at,ct[1]+at,ct[2]+at)}}else{for(let rt=0;rt<ne;rt++){let at=yt[rt];Ot(at[2],at[1],at[0])}for(let rt=0;rt<ne;rt++){let at=yt[rt];Ot(at[0]+V*h,at[1]+V*h,at[2]+V*h)}}n.addGroup(et,i.length/3-et,0)}function Y(){let et=i.length/3,rt=0;tt(B,rt),rt+=B.length;for(let at=0,ot=L.length;at<ot;at++){let ct=L[at];tt(ct,rt),rt+=ct.length}n.addGroup(et,i.length/3-et,1)}function tt(et,rt){let at=et.length;for(;--at>=0;){let ot=at,ct=at-1;ct<0&&(ct=et.length-1);for(let Bt=0,Ft=h+p*2;Bt<Ft;Bt++){let Gt=V*Bt,Xt=V*(Bt+1),N=rt+ot+Gt,he=rt+ct+Gt,jt=rt+ct+Xt,R=rt+ot+Xt;Tt(N,he,jt,R)}}}function xt(et,rt,at){l.push(et),l.push(rt),l.push(at)}function Ot(et,rt,at){Vt(et),Vt(rt),Vt(at);let ot=i.length/3,ct=M.generateTopUV(n,i,ot-3,ot-2,ot-1);le(ct[0]),le(ct[1]),le(ct[2])}function Tt(et,rt,at,ot){Vt(et),Vt(rt),Vt(ot),Vt(rt),Vt(at),Vt(ot);let ct=i.length/3,Bt=M.generateSideWallUV(n,i,ct-6,ct-3,ct-2,ct-1);le(Bt[0]),le(Bt[1]),le(Bt[3]),le(Bt[1]),le(Bt[2]),le(Bt[3])}function Vt(et){i.push(l[et*3+0]),i.push(l[et*3+1]),i.push(l[et*3+2])}function le(et){r.push(et.x),r.push(et.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return hg(e,n,t)}static fromJSON(t,e){let n=[];for(let r=0,a=t.shapes.length;r<a;r++){let o=e[t.shapes[r]];n.push(o)}let i=t.options.extrudePath;return i!==void 0&&(t.options.extrudePath=new Sh[i.type]().fromJSON(i)),new s(n,t.options)}},cg={generateTopUV:function(s,t,e,n,i){let r=t[e*3],a=t[e*3+1],o=t[n*3],l=t[n*3+1],c=t[i*3],h=t[i*3+1];return[new it(r,a),new it(o,l),new it(c,h)]},generateSideWallUV:function(s,t,e,n,i,r){let a=t[e*3],o=t[e*3+1],l=t[e*3+2],c=t[n*3],h=t[n*3+1],d=t[n*3+2],u=t[i*3],f=t[i*3+1],m=t[i*3+2],v=t[r*3],p=t[r*3+1],g=t[r*3+2];return Math.abs(o-h)<Math.abs(a-c)?[new it(a,1-l),new it(c,1-d),new it(u,1-m),new it(v,1-g)]:[new it(o,1-l),new it(h,1-d),new it(f,1-m),new it(p,1-g)]}};function hg(s,t,e){if(e.shapes=[],Array.isArray(s))for(let n=0,i=s.length;n<i;n++){let r=s[n];e.shapes.push(r.uuid)}else e.shapes.push(s.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}var ca=class s extends Jo{constructor(t=1,e=0){let n=(1+Math.sqrt(5))/2,i=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(i,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new s(t.radius,t.detail)}};var un=class s extends _e{constructor(t=1,e=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:i};let r=t/2,a=e/2,o=Math.floor(n),l=Math.floor(i),c=o+1,h=l+1,d=t/o,u=e/l,f=[],m=[],v=[],p=[];for(let g=0;g<h;g++){let M=g*u-a;for(let w=0;w<c;w++){let y=w*d-r;m.push(y,-M,0),v.push(0,0,1),p.push(w/o),p.push(1-g/l)}}for(let g=0;g<l;g++)for(let M=0;M<o;M++){let w=M+c*g,y=M+c*(g+1),b=M+1+c*(g+1),T=M+1+c*g;f.push(w,y,T),f.push(y,b,T)}this.setIndex(f),this.setAttribute("position",new Zt(m,3)),this.setAttribute("normal",new Zt(v,3)),this.setAttribute("uv",new Zt(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.width,t.height,t.widthSegments,t.heightSegments)}},ha=class s extends _e{constructor(t=.5,e=1,n=32,i=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:n,phiSegments:i,thetaStart:r,thetaLength:a},n=Math.max(3,n),i=Math.max(1,i);let o=[],l=[],c=[],h=[],d=t,u=(e-t)/i,f=new E,m=new it;for(let v=0;v<=i;v++){for(let p=0;p<=n;p++){let g=r+p/n*a;f.x=d*Math.cos(g),f.y=d*Math.sin(g),l.push(f.x,f.y,f.z),c.push(0,0,1),m.x=(f.x/e+1)/2,m.y=(f.y/e+1)/2,h.push(m.x,m.y)}d+=u}for(let v=0;v<i;v++){let p=v*(n+1);for(let g=0;g<n;g++){let M=g+p,w=M,y=M+n+1,b=M+n+2,T=M+1;o.push(w,y,T),o.push(y,b,T)}}this.setIndex(o),this.setAttribute("position",new Zt(l,3)),this.setAttribute("normal",new Zt(c,3)),this.setAttribute("uv",new Zt(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}},ua=class s extends _e{constructor(t=new ii([new it(0,.5),new it(-.5,-.5),new it(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};let n=[],i=[],r=[],a=[],o=0,l=0;if(Array.isArray(t)===!1)c(t);else for(let h=0;h<t.length;h++)c(t[h]),this.addGroup(o,l,h),o+=l,l=0;this.setIndex(n),this.setAttribute("position",new Zt(i,3)),this.setAttribute("normal",new Zt(r,3)),this.setAttribute("uv",new Zt(a,2));function c(h){let d=i.length/3,u=h.extractPoints(e),f=u.shape,m=u.holes;Kn.isClockWise(f)===!1&&(f=f.reverse());for(let p=0,g=m.length;p<g;p++){let M=m[p];Kn.isClockWise(M)===!0&&(m[p]=M.reverse())}let v=Kn.triangulateShape(f,m);for(let p=0,g=m.length;p<g;p++){let M=m[p];f=f.concat(M)}for(let p=0,g=f.length;p<g;p++){let M=f[p];i.push(M.x,M.y,0),r.push(0,0,1),a.push(M.x,M.y)}for(let p=0,g=v.length;p<g;p++){let M=v[p],w=M[0]+d,y=M[1]+d,b=M[2]+d;n.push(w,y,b),l+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON(),e=this.parameters.shapes;return ug(e,t)}static fromJSON(t,e){let n=[];for(let i=0,r=t.shapes.length;i<r;i++){let a=e[t.shapes[i]];n.push(a)}return new s(n,t.curveSegments)}};function ug(s,t){if(t.shapes=[],Array.isArray(s))for(let e=0,n=s.length;e<n;e++){let i=s[e];t.shapes.push(i.uuid)}else t.shapes.push(s.uuid);return t}var ns=class s extends _e{constructor(t=1,e=32,n=16,i=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:i,phiLength:r,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));let l=Math.min(a+o,Math.PI),c=0,h=[],d=new E,u=new E,f=[],m=[],v=[],p=[];for(let g=0;g<=n;g++){let M=[],w=g/n,y=a+w*o,b=t*Math.cos(y),T=Math.sqrt(t*t-b*b),P=0;g===0&&a===0?P=.5/e:g===n&&l===Math.PI&&(P=-.5/e);for(let _=0;_<=e;_++){let A=_/e,I=i+A*r;d.x=-T*Math.cos(I),d.y=b,d.z=T*Math.sin(I),m.push(d.x,d.y,d.z),u.copy(d).normalize(),v.push(u.x,u.y,u.z),p.push(A+P,1-w),M.push(c++)}h.push(M)}for(let g=0;g<n;g++)for(let M=0;M<e;M++){let w=h[g][M+1],y=h[g][M],b=h[g+1][M],T=h[g+1][M+1];(g!==0||a>0)&&f.push(w,y,T),(g!==n-1||l<Math.PI)&&f.push(y,b,T)}this.setIndex(f),this.setAttribute("position",new Zt(m,3)),this.setAttribute("normal",new Zt(v,3)),this.setAttribute("uv",new Zt(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}};var da=class s extends _e{constructor(t=1,e=.4,n=12,i=48,r=Math.PI*2,a=0,o=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:i,arc:r,thetaStart:a,thetaLength:o},n=Math.floor(n),i=Math.floor(i);let l=[],c=[],h=[],d=[],u=new E,f=new E,m=new E;for(let v=0;v<=n;v++){let p=a+v/n*o;for(let g=0;g<=i;g++){let M=g/i*r;f.x=(t+e*Math.cos(p))*Math.cos(M),f.y=(t+e*Math.cos(p))*Math.sin(M),f.z=e*Math.sin(p),c.push(f.x,f.y,f.z),u.x=t*Math.cos(M),u.y=t*Math.sin(M),m.subVectors(f,u).normalize(),h.push(m.x,m.y,m.z),d.push(g/i),d.push(v/n)}}for(let v=1;v<=n;v++)for(let p=1;p<=i;p++){let g=(i+1)*v+p-1,M=(i+1)*(v-1)+p-1,w=(i+1)*(v-1)+p,y=(i+1)*v+p;l.push(g,M,y),l.push(M,w,y)}this.setIndex(l),this.setAttribute("position",new Zt(c,3)),this.setAttribute("normal",new Zt(h,3)),this.setAttribute("uv",new Zt(d,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc,t.thetaStart,t.thetaLength)}};function os(s){let t={};for(let e in s){t[e]={};for(let n in s[e]){let i=s[e][n];if(_d(i))i.isRenderTargetTexture?(kt("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=i.clone();else if(Array.isArray(i))if(_d(i[0])){let r=[];for(let a=0,o=i.length;a<o;a++)r[a]=i[a].clone();t[e][n]=r}else t[e][n]=i.slice();else t[e][n]=i}}return t}function tn(s){let t={};for(let e=0;e<s.length;e++){let n=os(s[e]);for(let i in n)t[i]=n[i]}return t}function _d(s){return s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)}function dg(s){let t=[];for(let e=0;e<s.length;e++)t.push(s[e].clone());return t}function qh(s){let t=s.getRenderTarget();return t===null?s.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Qt.workingColorSpace}var gi={clone:os,merge:tn},fg=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,pg=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,we=class extends zn{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=fg,this.fragmentShader=pg,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=os(t.uniforms),this.uniformsGroups=dg(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this.defaultAttributeValues=Object.assign({},t.defaultAttributeValues),this.index0AttributeName=t.index0AttributeName,this.uniformsNeedUpdate=t.uniformsNeedUpdate,this}toJSON(t){let e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(let i in this.uniforms){let a=this.uniforms[i].value;a&&a.isTexture?e.uniforms[i]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[i]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[i]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[i]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[i]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[i]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[i]={type:"m4",value:a.toArray()}:e.uniforms[i]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;let n={};for(let i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}fromJSON(t,e){if(super.fromJSON(t,e),t.uniforms!==void 0)for(let n in t.uniforms){let i=t.uniforms[n];switch(this.uniforms[n]={},i.type){case"t":this.uniforms[n].value=e[i.value]||null;break;case"c":this.uniforms[n].value=new ht().setHex(i.value);break;case"v2":this.uniforms[n].value=new it().fromArray(i.value);break;case"v3":this.uniforms[n].value=new E().fromArray(i.value);break;case"v4":this.uniforms[n].value=new Ae().fromArray(i.value);break;case"m3":this.uniforms[n].value=new Wt().fromArray(i.value);break;case"m4":this.uniforms[n].value=new ce().fromArray(i.value);break;default:this.uniforms[n].value=i.value}}if(t.defines!==void 0&&(this.defines=t.defines),t.vertexShader!==void 0&&(this.vertexShader=t.vertexShader),t.fragmentShader!==void 0&&(this.fragmentShader=t.fragmentShader),t.glslVersion!==void 0&&(this.glslVersion=t.glslVersion),t.extensions!==void 0)for(let n in t.extensions)this.extensions[n]=t.extensions[n];return t.lights!==void 0&&(this.lights=t.lights),t.clipping!==void 0&&(this.clipping=t.clipping),this}},$s=class extends we{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},Ee=class extends zn{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new ht(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ht(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Fa,this.normalScale=new it(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ei,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}},fa=class extends Ee{constructor(t){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new it(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Kt(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new ht(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new ht(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new ht(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(t)}get anisotropy(){return this._anisotropy}set anisotropy(t){this._anisotropy>0!=t>0&&this.version++,this._anisotropy=t}get clearcoat(){return this._clearcoat}set clearcoat(t){this._clearcoat>0!=t>0&&this.version++,this._clearcoat=t}get iridescence(){return this._iridescence}set iridescence(t){this._iridescence>0!=t>0&&this.version++,this._iridescence=t}get dispersion(){return this._dispersion}set dispersion(t){this._dispersion>0!=t>0&&this.version++,this._dispersion=t}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(t){this._retroreflectivity>0!=t>0&&this.version++,this._retroreflectivity=t}get sheen(){return this._sheen}set sheen(t){this._sheen>0!=t>0&&this.version++,this._sheen=t}get transmission(){return this._transmission}set transmission(t){this._transmission>0!=t>0&&this.version++,this._transmission=t}copy(t){return super.copy(t),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=t.anisotropy,this.anisotropyRotation=t.anisotropyRotation,this.anisotropyMap=t.anisotropyMap,this.clearcoat=t.clearcoat,this.clearcoatMap=t.clearcoatMap,this.clearcoatRoughness=t.clearcoatRoughness,this.clearcoatRoughnessMap=t.clearcoatRoughnessMap,this.clearcoatNormalMap=t.clearcoatNormalMap,this.clearcoatNormalScale.copy(t.clearcoatNormalScale),this.dispersion=t.dispersion,this.ior=t.ior,this.iridescence=t.iridescence,this.iridescenceMap=t.iridescenceMap,this.iridescenceIOR=t.iridescenceIOR,this.iridescenceThicknessRange=[...t.iridescenceThicknessRange],this.iridescenceThicknessMap=t.iridescenceThicknessMap,this.retroreflectivity=t.retroreflectivity,this.sheen=t.sheen,this.sheenColor.copy(t.sheenColor),this.sheenColorMap=t.sheenColorMap,this.sheenRoughness=t.sheenRoughness,this.sheenRoughnessMap=t.sheenRoughnessMap,this.transmission=t.transmission,this.transmissionMap=t.transmissionMap,this.thickness=t.thickness,this.thicknessMap=t.thicknessMap,this.attenuationDistance=t.attenuationDistance,this.attenuationColor.copy(t.attenuationColor),this.specularIntensity=t.specularIntensity,this.specularIntensityMap=t.specularIntensityMap,this.specularColor.copy(t.specularColor),this.specularColorMap=t.specularColorMap,this}};var pa=class extends zn{constructor(t){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new ht(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ht(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Fa,this.normalScale=new it(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ei,this.combine=_l,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.envMapIntensity=t.envMapIntensity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}},il=class extends zn{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=$d,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},sl=class extends zn{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}};function Ls(s,t){return!s||s.constructor===t?s:typeof t.BYTES_PER_ELEMENT=="number"?new t(s):Array.prototype.slice.call(s)}function mh(s){return s!==void 0&&s.inTangents!==void 0&&s.outTangents!==void 0}var Pi=class{constructor(t,e,n,i){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new e.constructor(n),this.sampleValues=e,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,n=this._cachedIndex,i=e[n],r=e[n-1];n:{t:{let a;e:{i:if(!(t<i)){for(let o=n+2;;){if(i===void 0){if(t<r)break i;return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(r=i,i=e[++n],t<i)break t}a=e.length;break e}if(!(t>=r)){let o=e[1];t<o&&(n=2,r=o);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(i=r,r=e[--n-1],t>=r)break t}a=n,n=0;break e}break n}for(;n<a;){let o=n+a>>>1;t<e[o]?a=o:n=o+1}if(i=e[n],r=e[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===void 0)return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,i)}return this.interpolate_(n,r,t,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,n=this.sampleValues,i=this.valueSize,r=t*i;for(let a=0;a!==i;++a)e[a]=n[r+a];return e}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},rl=class extends Pi{constructor(t,e,n,i){super(t,e,n,i),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:_h,endingEnd:_h}}intervalChanged_(t,e,n){let i=this.parameterPositions,r=t-2,a=t+1,o=i[r],l=i[a];if(o===void 0)switch(this.getSettings_().endingStart){case vh:r=t,o=2*e-n;break;case yh:r=i.length-2,o=e+i[r]-i[r+1];break;default:r=t,o=n}if(l===void 0)switch(this.getSettings_().endingEnd){case vh:a=t,l=2*n-e;break;case yh:a=1,l=n+i[1]-i[0];break;default:a=t-1,l=e}let c=(n-e)*.5,h=this.valueSize;this._weightPrev=c/(e-o),this._weightNext=c/(l-n),this._offsetPrev=r*h,this._offsetNext=a*h}interpolate_(t,e,n,i){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=t*o,c=l-o,h=this._offsetPrev,d=this._offsetNext,u=this._weightPrev,f=this._weightNext,m=(n-e)/(i-e),v=m*m,p=v*m,g=-u*p+2*u*v-u*m,M=(1+u)*p+(-1.5-2*u)*v+(-.5+u)*m+1,w=(-1-f)*p+(1.5+f)*v+.5*m,y=f*p-f*v;for(let b=0;b!==o;++b)r[b]=g*a[h+b]+M*a[c+b]+w*a[l+b]+y*a[d+b];return r}},al=class extends Pi{constructor(t,e,n,i){super(t,e,n,i)}interpolate_(t,e,n,i){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=t*o,c=l-o,h=(n-e)/(i-e),d=1-h;for(let u=0;u!==o;++u)r[u]=a[c+u]*d+a[l+u]*h;return r}},ol=class extends Pi{constructor(t,e,n,i){super(t,e,n,i)}interpolate_(t){return this.copySampleValue_(t-1)}},ll=class extends Pi{interpolate_(t,e,n,i){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=t*o,c=l-o,h=this.inTangents,d=this.outTangents;if(!h||!d){let m=(n-e)/(i-e),v=1-m;for(let p=0;p!==o;++p)r[p]=a[c+p]*v+a[l+p]*m;return r}let u=o*2,f=t-1;for(let m=0;m!==o;++m){let v=a[c+m],p=a[l+m],g=f*u+m*2,M=d[g],w=d[g+1],y=t*u+m*2,b=h[y],T=h[y+1],P=gg(n,e,M,b,i);r[m]=pf(P,v,w,T,p)}return r}};function pf(s,t,e,n,i){let r=1-s;return r*r*r*t+3*r*r*s*e+3*r*s*s*n+s*s*s*i}function mg(s,t,e,n,i){let r=1-s;return 3*r*r*(e-t)+6*r*s*(n-e)+3*s*s*(i-n)}function gg(s,t,e,n,i){let r=(s-t)/(i-t);for(let a=0;a<8;a++){let o=pf(r,t,e,n,i)-s;if(Math.abs(o)<1e-10)break;let l=mg(r,t,e,n,i);if(Math.abs(l)<1e-10)break;r=Math.max(0,Math.min(1,r-o/l))}return r}var yn=class{constructor(t,e,n,i){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=Ls(e,this.TimeBufferType),this.values=Ls(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,n;if(e.toJSON!==this.toJSON)n=e.toJSON(t);else{n={name:t.name,times:Ls(t.times,Array),values:Ls(t.values,Array)};let i=t.getInterpolation();i!==t.DefaultInterpolation&&(n.interpolation=i),mh(t.settings)&&(n.settings={inTangents:Ls(t.settings.inTangents,Array),outTangents:Ls(t.settings.outTangents,Array)})}return n.type=t.ValueTypeName,n}InterpolantFactoryMethodDiscrete(t){return new ol(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new al(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new rl(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodBezier(t){let e=new ll(this.times,this.values,this.getValueSize(),t);return this.settings&&(e.inTangents=this.settings.inTangents,e.outTangents=this.settings.outTangents),e}setInterpolation(t){let e;switch(t){case Or:e=this.InterpolantFactoryMethodDiscrete;break;case Wo:e=this.InterpolantFactoryMethodLinear;break;case No:e=this.InterpolantFactoryMethodSmooth;break;case xh:e=this.InterpolantFactoryMethodBezier;break}if(e===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return kt("KeyframeTrack:",n),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Or;case this.InterpolantFactoryMethodLinear:return Wo;case this.InterpolantFactoryMethodSmooth:return No;case this.InterpolantFactoryMethodBezier:return xh}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let n=0,i=e.length;n!==i;++n)e[n]+=t}return this}scale(t){if(t!==1){let e=this.times;for(let n=0,i=e.length;n!==i;++n)e[n]*=t;mh(this.settings)&&(vd(this.settings.inTangents,t),vd(this.settings.outTangents,t))}return this}trim(t,e){let n=this.times,i=n.length,r=0,a=i-1;for(;r!==i&&n[r]<t;)++r;for(;a!==-1&&n[a]>e;)--a;if(++a,r!==0||a!==i){r>=a&&(a=Math.max(a,1),r=a-1);let o=this.getValueSize();this.times=n.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(Ht("KeyframeTrack: Invalid value size in track.",this),t=!1);let n=this.times,i=this.values,r=n.length;r===0&&(Ht("KeyframeTrack: Track is empty.",this),t=!1);let a=null;for(let o=0;o!==r;o++){let l=n[o];if(typeof l=="number"&&isNaN(l)){Ht("KeyframeTrack: Time is not a valid number.",this,o,l),t=!1;break}if(a!==null&&a>l){Ht("KeyframeTrack: Out of order keys.",this,o,l,a),t=!1;break}a=l}if(i!==void 0&&im(i))for(let o=0,l=i.length;o!==l;++o){let c=i[o];if(isNaN(c)){Ht("KeyframeTrack: Value is not a valid number.",this,o,c),t=!1;break}}return t}optimize(){let t=this.times.slice(),e=this.values.slice(),n=this.getValueSize(),i=this.getInterpolation()===No,r=t.length-1,a=1;for(let o=1;o<r;++o){let l=!1,c=t[o],h=t[o+1];if(c!==h&&(o!==1||c!==t[0]))if(i)l=!0;else{let d=o*n,u=d-n,f=d+n;for(let m=0;m!==n;++m){let v=e[d+m];if(v!==e[u+m]||v!==e[f+m]){l=!0;break}}}if(l){if(o!==a){t[a]=t[o];let d=o*n,u=a*n;for(let f=0;f!==n;++f)e[u+f]=e[d+f]}++a}}if(r>0){t[a]=t[r];for(let o=r*n,l=a*n,c=0;c!==n;++c)e[l+c]=e[o+c];++a}return a!==t.length?(this.times=t.slice(0,a),this.values=e.slice(0,a*n)):(this.times=t,this.values=e),this}clone(){let t=this.times.slice(),e=this.values.slice(),n=this.constructor,i=new n(this.name,t,e);return i.createInterpolant=this.createInterpolant,mh(this.settings)&&(i.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),i}};function vd(s,t){for(let e=0,n=s.length;e!==n;e+=2)s[e]*=t}yn.prototype.ValueTypeName="";yn.prototype.TimeBufferType=Float32Array;yn.prototype.ValueBufferType=Float32Array;yn.prototype.DefaultInterpolation=Wo;var Ii=class extends yn{constructor(t,e,n){super(t,e,n)}};Ii.prototype.ValueTypeName="bool";Ii.prototype.ValueBufferType=Array;Ii.prototype.DefaultInterpolation=Or;Ii.prototype.InterpolantFactoryMethodLinear=void 0;Ii.prototype.InterpolantFactoryMethodSmooth=void 0;var cl=class extends yn{constructor(t,e,n,i){super(t,e,n,i)}};cl.prototype.ValueTypeName="color";var hl=class extends yn{constructor(t,e,n,i){super(t,e,n,i)}};hl.prototype.ValueTypeName="number";var ul=class extends Pi{constructor(t,e,n,i){super(t,e,n,i)}interpolate_(t,e,n,i){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(n-e)/(i-e),c=t*o;for(let h=c+o;c!==h;c+=4)re.slerpFlat(r,0,a,c-o,a,c,l);return r}},ma=class extends yn{constructor(t,e,n,i){super(t,e,n,i)}InterpolantFactoryMethodLinear(t){return new ul(this.times,this.values,this.getValueSize(),t)}};ma.prototype.ValueTypeName="quaternion";ma.prototype.InterpolantFactoryMethodSmooth=void 0;var Li=class extends yn{constructor(t,e,n){super(t,e,n)}};Li.prototype.ValueTypeName="string";Li.prototype.ValueBufferType=Array;Li.prototype.DefaultInterpolation=Or;Li.prototype.InterpolantFactoryMethodLinear=void 0;Li.prototype.InterpolantFactoryMethodSmooth=void 0;var dl=class extends yn{constructor(t,e,n,i){super(t,e,n,i)}};dl.prototype.ValueTypeName="vector";var fl=class{constructor(t,e,n){let i=this,r=!1,a=0,o=0,l,c=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this._abortController=null,this.itemStart=function(h){o++,r===!1&&i.onStart!==void 0&&i.onStart(h,a,o),r=!0},this.itemEnd=function(h){a++,i.onProgress!==void 0&&i.onProgress(h,a,o),a===o&&(r=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(h){i.onError!==void 0&&i.onError(h)},this.resolveURL=function(h){return h=h.normalize("NFC"),l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,d){return c.push(h,d),this},this.removeHandler=function(h){let d=c.indexOf(h);return d!==-1&&c.splice(d,2),this},this.getHandler=function(h){for(let d=0,u=c.length;d<u;d+=2){let f=c[d],m=c[d+1];if(f.global&&(f.lastIndex=0),f.test(h))return m}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},mf=new fl,pl=class{constructor(t){this.manager=t!==void 0?t:mf,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(t,e){let n=this;return new Promise(function(i,r){n.load(t,i,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}abort(){return this}};pl.DEFAULT_MATERIAL_NAME="__DEFAULT";var Zs=class extends Oe{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new ht(t),this.intensity=e}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){let e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,e}},ga=class extends Zs{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Oe.DEFAULT_UP),this.updateMatrix(),this.groundColor=new ht(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}toJSON(t){let e=super.toJSON(t);return e.object.groundColor=this.groundColor.getHex(),e}},gh=new ce,yd=new E,Md=new E,xa=class{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new it(512,512),this.mapType=fn,this.map=null,this.mapPass=null,this.matrix=new ce,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Gs,this._frameExtents=new it(1,1),this._viewportCount=1,this._viewports=[new Ae(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(t){let e=this.camera;yd.setFromMatrixPosition(t.matrixWorld),e.position.copy(yd),Md.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Md),e.updateMatrixWorld(),this._updateMatrix(e,this.matrix,this._frustum)}_updateMatrix(t,e,n,i){gh.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),n.setFromProjectionMatrix(gh,t.coordinateSystem,t.reversedDepth);let r=this._frameExtents,a=i?i.z/r.x:1,o=i?i.w/r.y:1,l=i?i.x/r.x:0,c=i?i.y/r.y:0;t.coordinateSystem===Os||t.reversedDepth?e.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):e.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),e.multiply(gh)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this.biasNode=t.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let t={};return t.intensity=this.intensity,t.bias=this.bias,t.normalBias=this.normalBias,t.radius=this.radius,t.blurSamples=this.blurSamples,t.mapSize=this.mapSize.toArray(),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}},Lo=new E,Do=new re,Zn=new E,_a=class extends Oe{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ce,this.projectionMatrix=new ce,this.projectionMatrixInverse=new ce,this.coordinateSystem=On,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorld.decompose(Lo,Do,Zn),Zn.x===1&&Zn.y===1&&Zn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Lo,Do,Zn.set(1,1,1)).invert()}updateWorldMatrix(t,e,n=!1){super.updateWorldMatrix(t,e,n),this.matrixWorld.decompose(Lo,Do,Zn),Zn.x===1&&Zn.y===1&&Zn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Lo,Do,Zn.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},Ai=new E,Sd=new it,bd=new it,Xe=class extends _a{constructor(t=50,e=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=.5*this.getFilmHeight()/t;this.fov=zs*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(Dr*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return zs*2*Math.atan(Math.tan(Dr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Ai.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Ai.x,Ai.y).multiplyScalar(-t/Ai.z),Ai.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Ai.x,Ai.y).multiplyScalar(-t/Ai.z)}getViewSize(t,e){return this.getViewBounds(t,Sd,bd),e.subVectors(bd,Sd)}setViewOffset(t,e,n,i,r,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan(Dr*.5*this.fov)/this.zoom,n=2*e,i=this.aspect*n,r=-.5*i,a=this.view;if(this.view!==null&&this.view.enabled){let l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*i/l,e-=a.offsetY*n/c,i*=a.width/l,n*=a.height/c}let o=this.filmOffset;o!==0&&(r+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}};var Eh=class extends xa{constructor(){super(new Xe(90,1,.5,500)),this.isPointLightShadow=!0}},va=class extends Zs{constructor(t,e,n=0,i=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new Eh}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}toJSON(t){let e=super.toJSON(t);return e.object.distance=this.distance,e.object.decay=this.decay,e.object.shadow=this.shadow.toJSON(),e}},Di=class extends _a{constructor(t=-1,e=1,n=1,i=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=i,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,i,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2,r=n-t,a=n+t,o=i+e,l=i-e;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}},Ah=class extends xa{constructor(){super(new Di(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},ya=class extends Zs{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Oe.DEFAULT_UP),this.updateMatrix(),this.target=new Oe,this.shadow=new Ah}dispose(){super.dispose(),this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}toJSON(t){let e=super.toJSON(t);return e.object.shadow=this.shadow.toJSON(),e.object.target=this.target.uuid,e}};var Ds=-90,Ns=1,ml=class extends Oe{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let i=new Xe(Ds,Ns,t,e);i.layers=this.layers,this.add(i);let r=new Xe(Ds,Ns,t,e);r.layers=this.layers,this.add(r);let a=new Xe(Ds,Ns,t,e);a.layers=this.layers,this.add(a);let o=new Xe(Ds,Ns,t,e);o.layers=this.layers,this.add(o);let l=new Xe(Ds,Ns,t,e);l.layers=this.layers,this.add(l);let c=new Xe(Ds,Ns,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let t=this.coordinateSystem,e=this.children.concat(),[n,i,r,a,o,l]=e;for(let c of e)this.remove(c);if(t===On)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===Os)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[r,a,o,l,c,h]=this.children,d=t.getRenderTarget(),u=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),m=t.xr.enabled;t.xr.enabled=!1;let v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let p=!1;t.isWebGLRenderer===!0?p=t.state.buffers.depth.getReversed():p=t.reversedDepthBuffer,t.setRenderTarget(n,0,i),p&&t.autoClear===!1&&t.clearDepth(),t.render(e,r),t.setRenderTarget(n,1,i),p&&t.autoClear===!1&&t.clearDepth(),t.render(e,a),t.setRenderTarget(n,2,i),p&&t.autoClear===!1&&t.clearDepth(),t.render(e,o),t.setRenderTarget(n,3,i),p&&t.autoClear===!1&&t.clearDepth(),t.render(e,l),t.setRenderTarget(n,4,i),p&&t.autoClear===!1&&t.clearDepth(),t.render(e,c),n.texture.generateMipmaps=v,t.setRenderTarget(n,5,i),p&&t.autoClear===!1&&t.clearDepth(),t.render(e,h),t.setRenderTarget(d,u,f),t.xr.enabled=m,n.texture.needsPMREMUpdate=!0}},gl=class extends Xe{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}},Ma=class{constructor(){this._previousTime=0,this._currentTime=0,this._startTime=performance.now(),this._delta=0,this._elapsed=0,this._timescale=1,this._document=null,this._pageVisibilityHandler=null}connect(t){this._document=t,t.hidden!==void 0&&(this._pageVisibilityHandler=xg.bind(this),t.addEventListener("visibilitychange",this._pageVisibilityHandler,!1))}disconnect(){this._pageVisibilityHandler!==null&&(this._document.removeEventListener("visibilitychange",this._pageVisibilityHandler),this._pageVisibilityHandler=null),this._document=null}getDelta(){return this._delta/1e3}getElapsed(){return this._elapsed/1e3}getTimescale(){return this._timescale}setTimescale(t){return this._timescale=t,this}reset(){return this._currentTime=performance.now()-this._startTime,this}dispose(){this.disconnect()}update(t){return this._pageVisibilityHandler!==null&&this._document.hidden===!0?this._delta=0:(this._previousTime=this._currentTime,this._currentTime=(t!==void 0?t:performance.now())-this._startTime,this._delta=(this._currentTime-this._previousTime)*this._timescale,this._elapsed+=this._delta),this}};function xg(){this._document.hidden===!1&&this.reset()}var Yh="\\[\\]\\.:\\/",_g=new RegExp("["+Yh+"]","g"),$h="[^"+Yh+"]",vg="[^"+Yh.replace("\\.","")+"]",yg=/((?:WC+[\/:])*)/.source.replace("WC",$h),Mg=/(WCOD+)?/.source.replace("WCOD",vg),Sg=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",$h),bg=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",$h),Tg=new RegExp("^"+yg+Mg+Sg+bg+"$"),wg=["material","materials","bones","map"],Rh=class{constructor(t,e,n){let i=n||Se.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,i)}getValue(t,e){this.bind();let n=this._targetGroup.nCachedObjects_,i=this._bindings[n];i!==void 0&&i.getValue(t,e)}setValue(t,e){let n=this._bindings;for(let i=this._targetGroup.nCachedObjects_,r=n.length;i!==r;++i)n[i].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].unbind()}},Se=class s{constructor(t,e,n){this.path=e,this.parsedPath=n||s.parseTrackName(e),this.node=s.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,n){return t&&t.isAnimationObjectGroup?new s.Composite(t,e,n):new s(t,e,n)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(_g,"")}static parseTrackName(t){let e=Tg.exec(t);if(e===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+t);let n={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){let r=n.nodeName.substring(i+1);wg.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,i),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+t);return n}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let n=t.skeleton.getBoneByName(e);if(n!==void 0)return n}if(t.children){let n=function(r){for(let a=0;a<r.length;a++){let o=r[a];if(o.name===e||o.uuid===e)return o;let l=n(o.children);if(l)return l}return null},i=n(t.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)t[e++]=n[i]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,n=e.objectName,i=e.propertyName,r=e.propertyIndex;if(t||(t=s.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){kt("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=e.objectIndex;switch(n){case"materials":if(!t.material){Ht("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){Ht("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){Ht("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let h=0;h<t.length;h++)if(t[h].name===c){c=h;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){Ht("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){Ht("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[n]===void 0){Ht("PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[n]}if(c!==void 0){if(t[c]===void 0){Ht("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[c]}}let a=t[i];if(a===void 0){let c=e.nodeName;Ht("PropertyBinding: Trying to update property for track: "+c+"."+i+" but it wasn't found.",t);return}let o=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?o=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(i==="morphTargetInfluences"){if(!t.geometry){Ht("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){Ht("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=i;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Se.Composite=Rh;Se.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Se.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Se.prototype.GetterByBindingType=[Se.prototype._getValue_direct,Se.prototype._getValue_array,Se.prototype._getValue_arrayElement,Se.prototype._getValue_toArray];Se.prototype.SetterByBindingTypeAndVersioning=[[Se.prototype._setValue_direct,Se.prototype._setValue_direct_setNeedsUpdate,Se.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Se.prototype._setValue_array,Se.prototype._setValue_array_setNeedsUpdate,Se.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Se.prototype._setValue_arrayElement,Se.prototype._setValue_arrayElement_setNeedsUpdate,Se.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Se.prototype._setValue_fromArray,Se.prototype._setValue_fromArray_setNeedsUpdate,Se.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var Ky=new Float32Array(1);var tu=class tu{constructor(t,e,n,i){this.elements=[1,0,0,1],t!==void 0&&this.set(t,e,n,i)}identity(){return this.set(1,0,0,1),this}fromArray(t,e=0){for(let n=0;n<4;n++)this.elements[n]=t[n+e];return this}set(t,e,n,i){let r=this.elements;return r[0]=t,r[2]=e,r[1]=n,r[3]=i,this}};tu.prototype.isMatrix2=!0;var Ch=tu;function Zh(s,t,e,n){let i=Eg(n);switch(e){case kh:return s*t;case wl:return s*t/i.components*i.byteLength;case El:return s*t/i.components*i.byteLength;case zi:return s*t*2/i.components*i.byteLength;case Al:return s*t*2/i.components*i.byteLength;case Vh:return s*t*3/i.components*i.byteLength;case Rn:return s*t*4/i.components*i.byteLength;case Rl:return s*t*4/i.components*i.byteLength;case Pa:case Ia:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*8;case La:case Da:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case Pl:case Ll:return Math.max(s,16)*Math.max(t,8)/4;case Cl:case Il:return Math.max(s,8)*Math.max(t,8)/2;case Dl:case Nl:case Fl:case Ol:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*8;case Ul:case Na:case Bl:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case zl:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case kl:return Math.floor((s+4)/5)*Math.floor((t+3)/4)*16;case Vl:return Math.floor((s+4)/5)*Math.floor((t+4)/5)*16;case Hl:return Math.floor((s+5)/6)*Math.floor((t+4)/5)*16;case Gl:return Math.floor((s+5)/6)*Math.floor((t+5)/6)*16;case Wl:return Math.floor((s+7)/8)*Math.floor((t+4)/5)*16;case Xl:return Math.floor((s+7)/8)*Math.floor((t+5)/6)*16;case ql:return Math.floor((s+7)/8)*Math.floor((t+7)/8)*16;case Yl:return Math.floor((s+9)/10)*Math.floor((t+4)/5)*16;case $l:return Math.floor((s+9)/10)*Math.floor((t+5)/6)*16;case Zl:return Math.floor((s+9)/10)*Math.floor((t+7)/8)*16;case Jl:return Math.floor((s+9)/10)*Math.floor((t+9)/10)*16;case Kl:return Math.floor((s+11)/12)*Math.floor((t+9)/10)*16;case Ql:return Math.floor((s+11)/12)*Math.floor((t+11)/12)*16;case jl:case tc:case ec:return Math.ceil(s/4)*Math.ceil(t/4)*16;case nc:case ic:return Math.ceil(s/4)*Math.ceil(t/4)*8;case Ua:case sc:return Math.ceil(s/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function Eg(s){switch(s){case fn:case Fh:return{byteLength:1,components:1};case Ks:case Oh:case Ze:return{byteLength:2,components:1};case bl:case Tl:return{byteLength:2,components:4};case Hn:case Sl:case An:return{byteLength:4,components:1};case Bh:case zh:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${s}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"186"}}));typeof window<"u"&&(window.__THREE__?kt("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="186");function Of(){let s=null,t=!1,e=null,n=null;function i(r,a){n=s.requestAnimationFrame(i),e(r,a)}return{start:function(){t!==!0&&e!==null&&s!==null&&(n=s.requestAnimationFrame(i),t=!0)},stop:function(){s!==null&&s.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){s=r}}}function Rg(s){let t=new WeakMap;function e(o,l){let c=o.array,h=o.usage,d=c.byteLength,u=s.createBuffer();s.bindBuffer(l,u),s.bufferData(l,c,h),o.onUploadCallback();let f;if(c instanceof Float32Array)f=s.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=s.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?f=s.HALF_FLOAT:f=s.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=s.SHORT;else if(c instanceof Uint32Array)f=s.UNSIGNED_INT;else if(c instanceof Int32Array)f=s.INT;else if(c instanceof Int8Array)f=s.BYTE;else if(c instanceof Uint8Array)f=s.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:u,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:d}}function n(o,l,c){let h=l.array,d=l.updateRanges;if(s.bindBuffer(c,o),d.length===0)s.bufferSubData(c,0,h);else{d.sort((f,m)=>f.start-m.start);let u=0;for(let f=1;f<d.length;f++){let m=d[u],v=d[f];v.start<=m.start+m.count+1?m.count=Math.max(m.count,v.start+v.count-m.start):(++u,d[u]=v)}d.length=u+1;for(let f=0,m=d.length;f<m;f++){let v=d[f];s.bufferSubData(c,v.start*h.BYTES_PER_ELEMENT,h,v.start,v.count)}l.clearUpdateRanges()}l.onUploadCallback()}function i(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);let l=t.get(o);l&&(s.deleteBuffer(l.buffer),t.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){let h=t.get(o);(!h||h.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}let c=t.get(o);if(c===void 0)t.set(o,e(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:i,remove:r,update:a}}var Cg=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Pg=`#ifdef USE_ALPHAHASH
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
#endif`,Ig=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Lg=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Dg=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Ng=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Ug=`#ifdef USE_AOMAP
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
#endif`,Fg=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Og=`#ifdef USE_BATCHING
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
#endif`,Bg=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,zg=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,kg=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Vg=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Hg=`#ifdef USE_IRIDESCENCE
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
#endif`,Gg=`#ifdef USE_BUMPMAP
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
#endif`,Wg=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Xg=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,qg=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Yg=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,$g=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Zg=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Jg=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Kg=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,Qg=`#define PI 3.141592653589793
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
} // validated`,jg=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,t0=`vec3 transformedNormal = objectNormal;
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
#endif`,e0=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,n0=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,i0=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,s0=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,r0="gl_FragColor = linearToOutputTexel( gl_FragColor );",a0=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,o0=`#ifdef USE_ENVMAP
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
#endif`,l0=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,c0=`#ifdef USE_ENVMAP
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
#endif`,h0=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,u0=`#ifdef USE_ENVMAP
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
#endif`,d0=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,f0=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,p0=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,m0=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,g0=`#ifdef USE_GRADIENTMAP
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
}`,x0=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,_0=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,v0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,y0=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,M0=`#ifdef USE_ENVMAP
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
#endif`,S0=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,b0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,T0=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,w0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,E0=`PhysicalMaterial material;
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
#endif`,A0=`uniform sampler2D dfgLUT;
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
}`,R0=`
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
#endif`,C0=`#if defined( RE_IndirectDiffuse )
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
#endif`,P0=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,I0=`#ifdef USE_LIGHT_PROBES_GRID
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
#endif`,L0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,D0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,N0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,U0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,F0=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,O0=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,B0=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,z0=`#if defined( USE_POINTS_UV )
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
#endif`,k0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,V0=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,H0=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,G0=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,W0=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,X0=`#ifdef USE_MORPHTARGETS
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
#endif`,q0=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Y0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,$0=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Z0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,J0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,K0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,Q0=`#ifdef USE_NORMALMAP
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
#endif`,j0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,tx=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,ex=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,nx=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,ix=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,sx=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,rx=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,ax=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,ox=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,lx=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,cx=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,hx=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,ux=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,dx=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,fx=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,px=`float getShadowMask() {
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
}`,mx=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,gx=`#ifdef USE_SKINNING
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
#endif`,xx=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,_x=`#ifdef USE_SKINNING
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
#endif`,vx=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,yx=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Mx=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Sx=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,bx=`#ifdef USE_TRANSMISSION
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
#endif`,Tx=`#ifdef USE_TRANSMISSION
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
#endif`,wx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Ex=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Ax=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Rx=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,Cx=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Px=`uniform sampler2D t2D;
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
}`,Ix=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Lx=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Dx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Nx=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Ux=`#include <common>
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
}`,Fx=`#if DEPTH_PACKING == 3200
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
}`,Ox=`#define DISTANCE
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
}`,Bx=`#define DISTANCE
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
}`,zx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,kx=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Vx=`uniform float scale;
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
}`,Hx=`uniform vec3 diffuse;
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
}`,Gx=`#include <common>
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
}`,Wx=`uniform vec3 diffuse;
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
}`,Xx=`#define LAMBERT
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
}`,qx=`#define LAMBERT
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
}`,Yx=`#define MATCAP
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
}`,$x=`#define MATCAP
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
}`,Zx=`#define NORMAL
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
}`,Jx=`#define NORMAL
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
}`,Kx=`#define PHONG
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
}`,Qx=`#define PHONG
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
}`,jx=`#define STANDARD
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
}`,t_=`#define STANDARD
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
}`,e_=`#define TOON
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
}`,n_=`#define TOON
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
}`,i_=`uniform float size;
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
}`,s_=`uniform vec3 diffuse;
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
}`,r_=`#include <common>
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
}`,a_=`uniform vec3 color;
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
}`,o_=`uniform float rotation;
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
}`,l_=`uniform vec3 diffuse;
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
}`,Jt={alphahash_fragment:Cg,alphahash_pars_fragment:Pg,alphamap_fragment:Ig,alphamap_pars_fragment:Lg,alphatest_fragment:Dg,alphatest_pars_fragment:Ng,aomap_fragment:Ug,aomap_pars_fragment:Fg,batching_pars_vertex:Og,batching_vertex:Bg,begin_vertex:zg,beginnormal_vertex:kg,bsdfs:Vg,iridescence_fragment:Hg,bumpmap_pars_fragment:Gg,clipping_planes_fragment:Wg,clipping_planes_pars_fragment:Xg,clipping_planes_pars_vertex:qg,clipping_planes_vertex:Yg,color_fragment:$g,color_pars_fragment:Zg,color_pars_vertex:Jg,color_vertex:Kg,common:Qg,cube_uv_reflection_fragment:jg,defaultnormal_vertex:t0,displacementmap_pars_vertex:e0,displacementmap_vertex:n0,emissivemap_fragment:i0,emissivemap_pars_fragment:s0,colorspace_fragment:r0,colorspace_pars_fragment:a0,envmap_fragment:o0,envmap_common_pars_fragment:l0,envmap_pars_fragment:c0,envmap_pars_vertex:h0,envmap_physical_pars_fragment:M0,envmap_vertex:u0,fog_vertex:d0,fog_pars_vertex:f0,fog_fragment:p0,fog_pars_fragment:m0,gradientmap_pars_fragment:g0,lightmap_pars_fragment:x0,lights_lambert_fragment:_0,lights_lambert_pars_fragment:v0,lights_pars_begin:y0,lights_toon_fragment:S0,lights_toon_pars_fragment:b0,lights_phong_fragment:T0,lights_phong_pars_fragment:w0,lights_physical_fragment:E0,lights_physical_pars_fragment:A0,lights_fragment_begin:R0,lights_fragment_maps:C0,lights_fragment_end:P0,lightprobes_pars_fragment:I0,logdepthbuf_fragment:L0,logdepthbuf_pars_fragment:D0,logdepthbuf_pars_vertex:N0,logdepthbuf_vertex:U0,map_fragment:F0,map_pars_fragment:O0,map_particle_fragment:B0,map_particle_pars_fragment:z0,metalnessmap_fragment:k0,metalnessmap_pars_fragment:V0,morphinstance_vertex:H0,morphcolor_vertex:G0,morphnormal_vertex:W0,morphtarget_pars_vertex:X0,morphtarget_vertex:q0,normal_fragment_begin:Y0,normal_fragment_maps:$0,normal_pars_fragment:Z0,normal_pars_vertex:J0,normal_vertex:K0,normalmap_pars_fragment:Q0,clearcoat_normal_fragment_begin:j0,clearcoat_normal_fragment_maps:tx,clearcoat_pars_fragment:ex,iridescence_pars_fragment:nx,opaque_fragment:ix,packing:sx,premultiplied_alpha_fragment:rx,project_vertex:ax,dithering_fragment:ox,dithering_pars_fragment:lx,roughnessmap_fragment:cx,roughnessmap_pars_fragment:hx,shadowmap_pars_fragment:ux,shadowmap_pars_vertex:dx,shadowmap_vertex:fx,shadowmask_pars_fragment:px,skinbase_vertex:mx,skinning_pars_vertex:gx,skinning_vertex:xx,skinnormal_vertex:_x,specularmap_fragment:vx,specularmap_pars_fragment:yx,tonemapping_fragment:Mx,tonemapping_pars_fragment:Sx,transmission_fragment:bx,transmission_pars_fragment:Tx,uv_pars_fragment:wx,uv_pars_vertex:Ex,uv_vertex:Ax,worldpos_vertex:Rx,background_vert:Cx,background_frag:Px,backgroundCube_vert:Ix,backgroundCube_frag:Lx,cube_vert:Dx,cube_frag:Nx,depth_vert:Ux,depth_frag:Fx,distance_vert:Ox,distance_frag:Bx,equirect_vert:zx,equirect_frag:kx,linedashed_vert:Vx,linedashed_frag:Hx,meshbasic_vert:Gx,meshbasic_frag:Wx,meshlambert_vert:Xx,meshlambert_frag:qx,meshmatcap_vert:Yx,meshmatcap_frag:$x,meshnormal_vert:Zx,meshnormal_frag:Jx,meshphong_vert:Kx,meshphong_frag:Qx,meshphysical_vert:jx,meshphysical_frag:t_,meshtoon_vert:e_,meshtoon_frag:n_,points_vert:i_,points_frag:s_,shadow_vert:r_,shadow_frag:a_,sprite_vert:o_,sprite_frag:l_},vt={common:{diffuse:{value:new ht(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Wt},alphaMap:{value:null},alphaMapTransform:{value:new Wt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Wt}},envmap:{envMap:{value:null},envMapRotation:{value:new Wt},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Wt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Wt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Wt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Wt},normalScale:{value:new it(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Wt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Wt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Wt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Wt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ht(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new E},probesMax:{value:new E},probesResolution:{value:new E}},points:{diffuse:{value:new ht(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Wt},alphaTest:{value:0},uvTransform:{value:new Wt}},sprite:{diffuse:{value:new ht(16777215)},opacity:{value:1},center:{value:new it(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Wt},alphaMap:{value:null},alphaMapTransform:{value:new Wt},alphaTest:{value:0}}},ri={basic:{uniforms:tn([vt.common,vt.specularmap,vt.envmap,vt.aomap,vt.lightmap,vt.fog]),vertexShader:Jt.meshbasic_vert,fragmentShader:Jt.meshbasic_frag},lambert:{uniforms:tn([vt.common,vt.specularmap,vt.envmap,vt.aomap,vt.lightmap,vt.emissivemap,vt.bumpmap,vt.normalmap,vt.displacementmap,vt.fog,vt.lights,{emissive:{value:new ht(0)},envMapIntensity:{value:1}}]),vertexShader:Jt.meshlambert_vert,fragmentShader:Jt.meshlambert_frag},phong:{uniforms:tn([vt.common,vt.specularmap,vt.envmap,vt.aomap,vt.lightmap,vt.emissivemap,vt.bumpmap,vt.normalmap,vt.displacementmap,vt.fog,vt.lights,{emissive:{value:new ht(0)},specular:{value:new ht(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Jt.meshphong_vert,fragmentShader:Jt.meshphong_frag},standard:{uniforms:tn([vt.common,vt.envmap,vt.aomap,vt.lightmap,vt.emissivemap,vt.bumpmap,vt.normalmap,vt.displacementmap,vt.roughnessmap,vt.metalnessmap,vt.fog,vt.lights,{emissive:{value:new ht(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Jt.meshphysical_vert,fragmentShader:Jt.meshphysical_frag},toon:{uniforms:tn([vt.common,vt.aomap,vt.lightmap,vt.emissivemap,vt.bumpmap,vt.normalmap,vt.displacementmap,vt.gradientmap,vt.fog,vt.lights,{emissive:{value:new ht(0)}}]),vertexShader:Jt.meshtoon_vert,fragmentShader:Jt.meshtoon_frag},matcap:{uniforms:tn([vt.common,vt.bumpmap,vt.normalmap,vt.displacementmap,vt.fog,{matcap:{value:null}}]),vertexShader:Jt.meshmatcap_vert,fragmentShader:Jt.meshmatcap_frag},points:{uniforms:tn([vt.points,vt.fog]),vertexShader:Jt.points_vert,fragmentShader:Jt.points_frag},dashed:{uniforms:tn([vt.common,vt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Jt.linedashed_vert,fragmentShader:Jt.linedashed_frag},depth:{uniforms:tn([vt.common,vt.displacementmap]),vertexShader:Jt.depth_vert,fragmentShader:Jt.depth_frag},normal:{uniforms:tn([vt.common,vt.bumpmap,vt.normalmap,vt.displacementmap,{opacity:{value:1}}]),vertexShader:Jt.meshnormal_vert,fragmentShader:Jt.meshnormal_frag},sprite:{uniforms:tn([vt.sprite,vt.fog]),vertexShader:Jt.sprite_vert,fragmentShader:Jt.sprite_frag},background:{uniforms:{uvTransform:{value:new Wt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Jt.background_vert,fragmentShader:Jt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Wt}},vertexShader:Jt.backgroundCube_vert,fragmentShader:Jt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Jt.cube_vert,fragmentShader:Jt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Jt.equirect_vert,fragmentShader:Jt.equirect_frag},distance:{uniforms:tn([vt.common,vt.displacementmap,{referencePosition:{value:new E},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Jt.distance_vert,fragmentShader:Jt.distance_frag},shadow:{uniforms:tn([vt.lights,vt.fog,{color:{value:new ht(0)},opacity:{value:1}}]),vertexShader:Jt.shadow_vert,fragmentShader:Jt.shadow_frag}};ri.physical={uniforms:tn([ri.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Wt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Wt},clearcoatNormalScale:{value:new it(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Wt},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Wt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Wt},sheen:{value:0},sheenColor:{value:new ht(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Wt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Wt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Wt},transmissionSamplerSize:{value:new it},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Wt},attenuationDistance:{value:0},attenuationColor:{value:new ht(0)},specularColor:{value:new ht(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Wt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Wt},anisotropyVector:{value:new it},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Wt}}]),vertexShader:Jt.meshphysical_vert,fragmentShader:Jt.meshphysical_frag};var oc={r:0,b:0,g:0},c_=new ce,Bf=new Wt;Bf.set(-1,0,0,0,1,0,0,0,1);function h_(s,t,e,n,i,r){let a=new ht(0),o=i===!0?0:1,l,c,h=null,d=0,u=null;function f(M){let w=M.isScene===!0?M.background:null;if(w&&w.isTexture){let y=M.backgroundBlurriness>0;w=t.get(w,y)}return w}function m(M){let w=!1,y=f(M);y===null?p(a,o):y&&y.isColor&&(p(y,1),w=!0);let b=s.xr.getEnvironmentBlendMode();b==="additive"?e.buffers.color.setClear(0,0,0,1,r):b==="alpha-blend"&&e.buffers.color.setClear(0,0,0,0,r),(s.autoClear||w)&&(e.buffers.depth.setTest(!0),e.buffers.depth.setMask(!0),e.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function v(M,w){let y=f(w);y&&(y.isCubeTexture||y.mapping===Ra)?(c===void 0&&(c=new wt(new Te(1,1,1),new we({name:"BackgroundCubeMaterial",uniforms:os(ri.backgroundCube.uniforms),vertexShader:ri.backgroundCube.vertexShader,fragmentShader:ri.backgroundCube.fragmentShader,side:Be,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(b,T,P){this.matrixWorld.copyPosition(P.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=y,c.material.uniforms.backgroundBlurriness.value=w.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(c_.makeRotationFromEuler(w.backgroundRotation)).transpose(),y.isCubeTexture&&y.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(Bf),c.material.toneMapped=Qt.getTransfer(y.colorSpace)!==oe,(h!==y||d!==y.version||u!==s.toneMapping)&&(c.material.needsUpdate=!0,h=y,d=y.version,u=s.toneMapping),c.layers.enableAll(),M.unshift(c,c.geometry,c.material,0,0,null)):y&&y.isTexture&&(l===void 0&&(l=new wt(new un(2,2),new we({name:"BackgroundMaterial",uniforms:os(ri.background.uniforms),vertexShader:ri.background.vertexShader,fragmentShader:ri.background.fragmentShader,side:Ni,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=y,l.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,l.material.toneMapped=Qt.getTransfer(y.colorSpace)!==oe,y.matrixAutoUpdate===!0&&y.updateMatrix(),l.material.uniforms.uvTransform.value.copy(y.matrix),(h!==y||d!==y.version||u!==s.toneMapping)&&(l.material.needsUpdate=!0,h=y,d=y.version,u=s.toneMapping),l.layers.enableAll(),M.unshift(l,l.geometry,l.material,0,0,null))}function p(M,w){M.getRGB(oc,qh(s)),e.buffers.color.setClear(oc.r,oc.g,oc.b,w,r)}function g(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(M,w=1){a.set(M),o=w,p(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(M){o=M,p(a,o)},render:m,addToRenderList:v,dispose:g}}function u_(s,t){let e=s.getParameter(s.MAX_VERTEX_ATTRIBS),n={},i=u(null),r=i,a=!1;function o(L,U,D,C,B){let k=!1,V=d(L,C,D,U);r!==V&&(r=V,c(r.object)),k=f(L,C,D,B),k&&m(L,C,D,B),B!==null&&t.update(B,s.ELEMENT_ARRAY_BUFFER),(k||a)&&(a=!1,y(L,U,D,C),B!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,t.get(B).buffer))}function l(){return s.createVertexArray()}function c(L){return s.bindVertexArray(L)}function h(L){return s.deleteVertexArray(L)}function d(L,U,D,C){let B=C.wireframe===!0,k=n[U.id];k===void 0&&(k={},n[U.id]=k);let V=L.isInstancedMesh===!0?L.id:0,Q=k[V];Q===void 0&&(Q={},k[V]=Q);let q=Q[D.id];q===void 0&&(q={},Q[D.id]=q);let K=q[B];return K===void 0&&(K=u(l()),q[B]=K),K}function u(L){let U=[],D=[],C=[];for(let B=0;B<e;B++)U[B]=0,D[B]=0,C[B]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:U,enabledAttributes:D,attributeDivisors:C,object:L,attributes:{},index:null}}function f(L,U,D,C){let B=r.attributes,k=U.attributes,V=0,Q=D.getAttributes();for(let q in Q)if(Q[q].location>=0){let j=B[q],Rt=k[q];if(Rt===void 0&&(q==="instanceMatrix"&&L.instanceMatrix&&(Rt=L.instanceMatrix),q==="instanceColor"&&L.instanceColor&&(Rt=L.instanceColor)),j===void 0||j.attribute!==Rt||Rt&&j.data!==Rt.data)return!0;V++}return r.attributesNum!==V||r.index!==C}function m(L,U,D,C){let B={},k=U.attributes,V=0,Q=D.getAttributes();for(let q in Q)if(Q[q].location>=0){let j=k[q];j===void 0&&(q==="instanceMatrix"&&L.instanceMatrix&&(j=L.instanceMatrix),q==="instanceColor"&&L.instanceColor&&(j=L.instanceColor));let Rt={};Rt.attribute=j,j&&j.data&&(Rt.data=j.data),B[q]=Rt,V++}r.attributes=B,r.attributesNum=V,r.index=C}function v(){let L=r.newAttributes;for(let U=0,D=L.length;U<D;U++)L[U]=0}function p(L){g(L,0)}function g(L,U){let D=r.newAttributes,C=r.enabledAttributes,B=r.attributeDivisors;D[L]=1,C[L]===0&&(s.enableVertexAttribArray(L),C[L]=1),B[L]!==U&&(s.vertexAttribDivisor(L,U),B[L]=U)}function M(){let L=r.newAttributes,U=r.enabledAttributes;for(let D=0,C=U.length;D<C;D++)U[D]!==L[D]&&(s.disableVertexAttribArray(D),U[D]=0)}function w(L,U,D,C,B,k,V){V===!0?s.vertexAttribIPointer(L,U,D,B,k):s.vertexAttribPointer(L,U,D,C,B,k)}function y(L,U,D,C){v();let B=C.attributes,k=D.getAttributes(),V=U.defaultAttributeValues;for(let Q in k){let q=k[Q];if(q.location>=0){let K=B[Q];if(K===void 0&&(Q==="instanceMatrix"&&L.instanceMatrix&&(K=L.instanceMatrix),Q==="instanceColor"&&L.instanceColor&&(K=L.instanceColor)),K!==void 0){let j=K.normalized,Rt=K.itemSize,yt=t.get(K);if(yt===void 0)continue;let ne=yt.buffer,Yt=yt.type,ee=yt.bytesPerElement,Y=Yt===s.INT||Yt===s.UNSIGNED_INT||K.gpuType===Sl;if(K.isInterleavedBufferAttribute){let tt=K.data,xt=tt.stride,Ot=K.offset;if(tt.isInstancedInterleavedBuffer){for(let Tt=0;Tt<q.locationSize;Tt++)g(q.location+Tt,tt.meshPerAttribute);L.isInstancedMesh!==!0&&C._maxInstanceCount===void 0&&(C._maxInstanceCount=tt.meshPerAttribute*tt.count)}else for(let Tt=0;Tt<q.locationSize;Tt++)p(q.location+Tt);s.bindBuffer(s.ARRAY_BUFFER,ne);for(let Tt=0;Tt<q.locationSize;Tt++)w(q.location+Tt,Rt/q.locationSize,Yt,j,xt*ee,(Ot+Rt/q.locationSize*Tt)*ee,Y)}else{if(K.isInstancedBufferAttribute){for(let tt=0;tt<q.locationSize;tt++)g(q.location+tt,K.meshPerAttribute);L.isInstancedMesh!==!0&&C._maxInstanceCount===void 0&&(C._maxInstanceCount=K.meshPerAttribute*K.count)}else for(let tt=0;tt<q.locationSize;tt++)p(q.location+tt);s.bindBuffer(s.ARRAY_BUFFER,ne);for(let tt=0;tt<q.locationSize;tt++)w(q.location+tt,Rt/q.locationSize,Yt,j,Rt*ee,Rt/q.locationSize*tt*ee,Y)}}else if(V!==void 0){let j=V[Q];if(j!==void 0)switch(j.length){case 2:s.vertexAttrib2fv(q.location,j);break;case 3:s.vertexAttrib3fv(q.location,j);break;case 4:s.vertexAttrib4fv(q.location,j);break;default:s.vertexAttrib1fv(q.location,j)}}}}M()}function b(){A();for(let L in n){let U=n[L];for(let D in U){let C=U[D];for(let B in C){let k=C[B];for(let V in k)h(k[V].object),delete k[V];delete C[B]}}delete n[L]}}function T(L){if(n[L.id]===void 0)return;let U=n[L.id];for(let D in U){let C=U[D];for(let B in C){let k=C[B];for(let V in k)h(k[V].object),delete k[V];delete C[B]}}delete n[L.id]}function P(L){for(let U in n){let D=n[U];for(let C in D){let B=D[C];if(B[L.id]===void 0)continue;let k=B[L.id];for(let V in k)h(k[V].object),delete k[V];delete B[L.id]}}}function _(L){for(let U in n){let D=n[U],C=L.isInstancedMesh===!0?L.id:0,B=D[C];if(B!==void 0){for(let k in B){let V=B[k];for(let Q in V)h(V[Q].object),delete V[Q];delete B[k]}delete D[C],Object.keys(D).length===0&&delete n[U]}}}function A(){I(),a=!0,r!==i&&(r=i,c(r.object))}function I(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:o,reset:A,resetDefaultState:I,dispose:b,releaseStatesOfGeometry:T,releaseStatesOfObject:_,releaseStatesOfProgram:P,initAttributes:v,enableAttribute:p,disableUnusedAttributes:M}}function d_(s,t,e){let n;function i(l){n=l}function r(l,c){s.drawArrays(n,l,c),e.update(c,n,1)}function a(l,c,h){h!==0&&(s.drawArraysInstanced(n,l,c,h),e.update(c,n,h))}function o(l,c,h){if(h===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,h);let u=0;for(let f=0;f<h;f++)u+=c[f];e.update(u,n,1)}this.setMode=i,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function f_(s,t,e,n){let i;function r(){if(i!==void 0)return i;if(t.has("EXT_texture_filter_anisotropic")===!0){let P=t.get("EXT_texture_filter_anisotropic");i=s.getParameter(P.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function a(P){return!(P!==Rn&&n.convert(P)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(P){let _=P===Ze&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(P!==fn&&P!==An&&!_&&n.convert(P)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE))}function l(P){if(P==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";P="mediump"}return P==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp",h=l(c);h!==c&&(kt("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);let d=e.logarithmicDepthBuffer===!0,u=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control");e.reversedDepthBuffer===!0&&u===!1&&kt("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");let f=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),m=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=s.getParameter(s.MAX_TEXTURE_SIZE),p=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),g=s.getParameter(s.MAX_VERTEX_ATTRIBS),M=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),w=s.getParameter(s.MAX_VARYING_VECTORS),y=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),b=s.getParameter(s.MAX_SAMPLES),T=s.getParameter(s.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:d,reversedDepthBuffer:u,maxTextures:f,maxVertexTextures:m,maxTextureSize:v,maxCubemapSize:p,maxAttributes:g,maxVertexUniforms:M,maxVaryings:w,maxFragmentUniforms:y,maxSamples:b,samples:T}}function p_(s){let t=this,e=null,n=0,i=!1,r=!1,a=new Un,o=new Wt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,u){let f=d.length!==0||u||n!==0||i;return i=u,n=d.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,u){e=h(d,u,0)},this.setState=function(d,u,f){let m=d.clippingPlanes,v=d.clipIntersection,p=d.clipShadows,g=s.get(d);if(!i||m===null||m.length===0||r&&!p)r?h(null):c();else{let M=r?0:n,w=M*4,y=g.clippingState||null;l.value=y,y=h(m,u,w,f);for(let b=0;b!==w;++b)y[b]=e[b];g.clippingState=y,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=M}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(d,u,f,m){let v=d!==null?d.length:0,p=null;if(v!==0){if(p=l.value,m!==!0||p===null){let g=f+v*4,M=u.matrixWorldInverse;o.getNormalMatrix(M),(p===null||p.length<g)&&(p=new Float32Array(g));for(let w=0,y=f;w!==v;++w,y+=4)a.copy(d[w]).applyMatrix4(M,o),a.normal.toArray(p,y),p[y+3]=a.constant}l.value=p,l.needsUpdate=!0}return t.numPlanes=v,t.numIntersection=0,p}}var er=4,m_=6,g_=20,x_=256,Oa=new Di,gf=new ht,eu=null,nu=0,iu=0,su=!1,__=new E,ls=new E,ir=class{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(t,e=0,n=.1,i=100,r={}){let{size:a=256,position:o=__}=r;eu=this._renderer.getRenderTarget(),nu=this._renderer.getActiveCubeFace(),iu=this._renderer.getActiveMipmapLevel(),su=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(t,n,i,l,o),e>0&&this._blur(l,0,0,e),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=vf(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=_f(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodMeshes.length;t++)this._lodMeshes[t].geometry.dispose()}_cleanup(t){this._renderer.setRenderTarget(eu,nu,iu),this._renderer.xr.enabled=su,t.scissorTest=!1,tr(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Fi||t.mapping===as?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),eu=this._renderer.getRenderTarget(),nu=this._renderer.getActiveCubeFace(),iu=this._renderer.getActiveMipmapLevel(),su=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:$e,minFilter:$e,generateMipmaps:!1,type:Ze,format:Rn,colorSpace:Br,depthBuffer:!1},i=xf(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=xf(t,e,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=v_(r)),this._blurMaterial=M_(r,t,e),this._ggxMaterial=y_(r,t,e)}return i}_compileMaterial(t){let e=new wt(new _e,t);this._renderer.compile(e,Oa)}_sceneToCubeUV(t,e,n,i,r){let l=new Xe(90,1,e,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],d=this._renderer,u=d.autoClear,f=d.toneMapping;d.getClearColor(gf),d.toneMapping=Vn,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(i),d.clearDepth(),d.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new wt(new Te,new be({name:"PMREM.Background",side:Be,depthWrite:!1,depthTest:!1})));let v=this._backgroundBox,p=v.material,g=!1,M=t.background;M?M.isColor&&(p.color.copy(M),t.background=null,g=!0):(p.color.copy(gf),g=!0);for(let w=0;w<6;w++){let y=w%3;y===0?(l.up.set(0,c[w],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[w],r.y,r.z)):y===1?(l.up.set(0,0,c[w]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[w],r.z)):(l.up.set(0,c[w],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[w]));let b=this._cubeSize;tr(i,y*b,w>2?b:0,b,b),d.setRenderTarget(i),g&&d.render(v,l),d.render(t,l)}d.toneMapping=f,d.autoClear=u,t.background=M}_textureToCubeUV(t,e){let n=this._renderer,i=t.mapping===Fi||t.mapping===as;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=vf()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=_f());let r=i?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;let o=r.uniforms;o.envMap.value=t;let l=this._cubeSize;tr(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(a,Oa)}_applyPMREM(t){let e=this._renderer,n=e.autoClear;e.autoClear=!1;let i=this._lodMeshes.length;for(let r=1;r<i;r++)this._applyGGXFilter(t,r-1,r);e.autoClear=n}_applyGGXFilter(t,e,n){let i=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;let l=a.uniforms,c=n/(this._lodMeshes.length-1),h=e/(this._lodMeshes.length-1),d=Math.sqrt(c*c-h*h),u=c*1.25,f=d*u,{_lodMax:m}=this,v=this._sizeLods[n],p=3*v*(n>m-er?n-m+er:0),g=4*(this._cubeSize-v);l.envMap.value=t.texture,l.roughness.value=f,l.mipInt.value=m-e,tr(r,p,g,3*v,2*v),i.setRenderTarget(r),i.render(o,Oa),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=m-n,tr(t,p,g,3*v,2*v),i.setRenderTarget(t),i.render(o,Oa)}_blur(t,e,n,i){let r=this._pingPongRenderTarget,a=Math.min(i,Math.PI)/Math.SQRT2;this._blurPass(t,r,e,n,a),this._blurPass(r,t,n,n,a)}_blurPass(t,e,n,i,r){let a=this._renderer,o=this._blurMaterial,l=this._lodMeshes[i];l.material=o;let c=o.uniforms;c.envMap.value=t.texture,c.sigma.value=r,c.mipInt.value=this._lodMax-n;let h=this._sizeLods[i],d=3*h*(i>this._lodMax-er?i-this._lodMax+er:0),u=4*(this._cubeSize-h);tr(e,d,u,3*h,2*h),a.setRenderTarget(e),a.render(l,Oa)}};function v_(s){let t=[],e=[],n=s,i=s-er+1+m_;for(let r=0;r<i;r++){let a=Math.pow(2,n);t.push(a);let o=1/(a-2),l=-o,c=1+o,h=[l,l,c,l,c,c,l,l,c,c,l,c],d=6,u=6,f=3,m=new Float32Array(f*u*d),v=new Float32Array(f*u*d);for(let g=0;g<d;g++){let M=g%3*2/3-1,w=g>2?0:-1,y=[M,w,0,M+2/3,w,0,M+2/3,w+1,0,M,w,0,M+2/3,w+1,0,M,w+1,0];m.set(y,f*u*g);for(let b=0;b<u;b++){let T=h[b*2]*2-1,P=h[b*2+1]*2-1;g===0?ls.set(1,P,T):g===1?ls.set(-T,1,-P):g===2?ls.set(-T,P,1):g===3?ls.set(-1,P,-T):g===4?ls.set(-T,-1,P):ls.set(T,P,-1),ls.toArray(v,(g*u+b)*f)}}let p=new _e;p.setAttribute("position",new De(m,f)),p.setAttribute("outputDirection",new De(v,f)),e.push(new wt(p,null)),n>er&&n--}return{lodMeshes:e,sizeLods:t}}function xf(s,t,e){let n=new Fe(s,t,e);return n.texture.mapping=Ra,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function tr(s,t,e,n,i){s.viewport.set(t,e,n,i),s.scissor.set(t,e,n,i)}function y_(s,t,e){return new we({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:x_,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:uc(),fragmentShader:`

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
		`,blending:En,depthTest:!1,depthWrite:!1})}function M_(s,t,e){return new we({name:"SphericalGaussianBlur",defines:{SAMPLES:g_,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:uc(),fragmentShader:`

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
		`,blending:En,depthTest:!1,depthWrite:!1})}function _f(){return new we({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:uc(),fragmentShader:`

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
		`,blending:En,depthTest:!1,depthWrite:!1})}function vf(){return new we({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:uc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:En,depthTest:!1,depthWrite:!1})}function uc(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}var cc=class extends Fe{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;let n={width:t,height:t,depth:1},i=[n,n,n,n,n,n];this.texture=new jr(i),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},i=new Te(5,5,5),r=new we({name:"CubemapFromEquirect",uniforms:os(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Be,blending:En});r.uniforms.tEquirect.value=e;let a=new wt(i,r),o=e.minFilter;return e.minFilter===Oi&&(e.minFilter=$e),new ml(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e=!0,n=!0,i=!0){let r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,i);t.setRenderTarget(r)}};function S_(s){let t=new WeakMap,e=new WeakMap,n=null;function i(u,f=!1){return u==null?null:f?a(u):r(u)}function r(u){if(u&&u.isTexture){let f=u.mapping;if(f===vl||f===yl)if(t.has(u)){let m=t.get(u).texture;return o(m,u.mapping)}else{let m=u.image;if(m&&m.height>0){let v=new cc(m.height);return v.fromEquirectangularTexture(s,u),t.set(u,v),u.addEventListener("dispose",c),o(v.texture,u.mapping)}else return null}}return u}function a(u){if(u&&u.isTexture){let f=u.mapping,m=f===vl||f===yl,v=f===Fi||f===as;if(m||v){let p=e.get(u),g=p!==void 0?p.texture.pmremVersion:0;if(u.isRenderTargetTexture&&u.pmremVersion!==g)return n===null&&(n=new ir(s)),p=m?n.fromEquirectangular(u,p):n.fromCubemap(u,p),p.texture.pmremVersion=u.pmremVersion,e.set(u,p),p.texture;if(p!==void 0)return p.texture;{let M=u.image;return m&&M&&M.height>0||v&&M&&l(M)?(n===null&&(n=new ir(s)),p=m?n.fromEquirectangular(u):n.fromCubemap(u),p.texture.pmremVersion=u.pmremVersion,e.set(u,p),u.addEventListener("dispose",h),p.texture):null}}}return u}function o(u,f){return f===vl?u.mapping=Fi:f===yl&&(u.mapping=as),u}function l(u){let f=0,m=6;for(let v=0;v<m;v++)u[v]!==void 0&&f++;return f===m}function c(u){let f=u.target;f.removeEventListener("dispose",c);let m=t.get(f);m!==void 0&&(t.delete(f),m.dispose())}function h(u){let f=u.target;f.removeEventListener("dispose",h);let m=e.get(f);m!==void 0&&(e.delete(f),m.dispose())}function d(){t=new WeakMap,e=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:i,dispose:d}}function b_(s){let t={};function e(n){if(t[n]!==void 0)return t[n];let i=s.getExtension(n);return t[n]=i,i}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){let i=e(n);return i===null&&Ji("WebGLRenderer: "+n+" extension not supported."),i}}}function T_(s,t,e,n){let i={},r=new WeakMap;function a(d){let u=d.target;u.index!==null&&t.remove(u.index);for(let m in u.attributes)t.remove(u.attributes[m]);u.removeEventListener("dispose",a),delete i[u.id];let f=r.get(u);f&&(t.remove(f),r.delete(u)),n.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,e.memory.geometries--}function o(d,u){return i[u.id]===!0||(u.addEventListener("dispose",a),i[u.id]=!0,e.memory.geometries++),u}function l(d){let u=d.attributes;for(let f in u)t.update(u[f],s.ARRAY_BUFFER)}function c(d){let u=[],f=d.index,m=d.attributes.position,v=0;if(m===void 0)return;if(f!==null){let M=f.array;v=f.version;for(let w=0,y=M.length;w<y;w+=3){let b=M[w+0],T=M[w+1],P=M[w+2];u.push(b,T,T,P,P,b)}}else{let M=m.array;v=m.version;for(let w=0,y=M.length/3-1;w<y;w+=3){let b=w+0,T=w+1,P=w+2;u.push(b,T,T,P,P,b)}}let p=new(m.count>=65535?qr:Xr)(u,1);p.version=v;let g=r.get(d);g&&t.remove(g),r.set(d,p)}function h(d){let u=r.get(d);if(u){let f=d.index;f!==null&&u.version<f.version&&c(d)}else c(d);return r.get(d)}return{get:o,update:l,getWireframeAttribute:h}}function w_(s,t,e){let n;function i(d){n=d}let r,a;function o(d){r=d.type,a=d.bytesPerElement}function l(d,u){s.drawElements(n,u,r,d*a),e.update(u,n,1)}function c(d,u,f){f!==0&&(s.drawElementsInstanced(n,u,r,d*a,f),e.update(u,n,f))}function h(d,u,f){if(f===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,u,0,r,d,0,f);let v=0;for(let p=0;p<f;p++)v+=u[p];e.update(v,n,1)}this.setMode=i,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function E_(s){let t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(e.calls++,a){case s.TRIANGLES:e.triangles+=o*(r/3);break;case s.LINES:e.lines+=o*(r/2);break;case s.LINE_STRIP:e.lines+=o*(r-1);break;case s.LINE_LOOP:e.lines+=o*r;break;case s.POINTS:e.points+=o*r;break;default:Ht("WebGLInfo: Unknown draw mode:",a);break}}function i(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:i,update:n}}function A_(s,t,e){let n=new WeakMap,i=new Ae;function r(a,o,l){let c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,d=h!==void 0?h.length:0,u=n.get(o);if(u===void 0||u.count!==d){let A=function(){P.dispose(),n.delete(o),o.removeEventListener("dispose",A)};u!==void 0&&u.texture.dispose();let f=o.morphAttributes.position!==void 0,m=o.morphAttributes.normal!==void 0,v=o.morphAttributes.color!==void 0,p=o.morphAttributes.position||[],g=o.morphAttributes.normal||[],M=o.morphAttributes.color||[],w=0;f===!0&&(w=1),m===!0&&(w=2),v===!0&&(w=3);let y=o.attributes.position.count*w,b=1;y>t.maxTextureSize&&(b=Math.ceil(y/t.maxTextureSize),y=t.maxTextureSize);let T=new Float32Array(y*b*4*d),P=new Hr(T,y,b,d);P.type=An,P.needsUpdate=!0;let _=w*4;for(let I=0;I<d;I++){let L=p[I],U=g[I],D=M[I],C=y*b*4*I;for(let B=0;B<L.count;B++){let k=B*_;f===!0&&(i.fromBufferAttribute(L,B),T[C+k+0]=i.x,T[C+k+1]=i.y,T[C+k+2]=i.z,T[C+k+3]=0),m===!0&&(i.fromBufferAttribute(U,B),T[C+k+4]=i.x,T[C+k+5]=i.y,T[C+k+6]=i.z,T[C+k+7]=0),v===!0&&(i.fromBufferAttribute(D,B),T[C+k+8]=i.x,T[C+k+9]=i.y,T[C+k+10]=i.z,T[C+k+11]=D.itemSize===4?i.w:1)}}u={count:d,texture:P,size:new it(y,b)},n.set(o,u),o.addEventListener("dispose",A)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(s,"morphTexture",a.morphTexture,e);else{let f=0;for(let v=0;v<c.length;v++)f+=c[v];let m=o.morphTargetsRelative?1:1-f;l.getUniforms().setValue(s,"morphTargetBaseInfluence",m),l.getUniforms().setValue(s,"morphTargetInfluences",c)}l.getUniforms().setValue(s,"morphTargetsTexture",u.texture,e),l.getUniforms().setValue(s,"morphTargetsTextureSize",u.size)}return{update:r}}function R_(s,t,e,n,i){let r=new WeakMap;function a(c){let h=i.render.frame,d=c.geometry,u=t.get(c,d);if(r.get(u)!==h&&(t.update(u),r.set(u,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==h&&(e.update(c.instanceMatrix,s.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,s.ARRAY_BUFFER),r.set(c,h))),c.isSkinnedMesh){let f=c.skeleton;r.get(f)!==h&&(f.update(),r.set(f,h))}return u}function o(){r=new WeakMap}function l(c){let h=c.target;h.removeEventListener("dispose",l),n.releaseStatesOfObject(h),e.remove(h.instanceMatrix),h.instanceColor!==null&&e.remove(h.instanceColor)}return{update:a,dispose:o}}var C_={[Sa]:"LINEAR_TONE_MAPPING",[ba]:"REINHARD_TONE_MAPPING",[Ta]:"CINEON_TONE_MAPPING",[rs]:"ACES_FILMIC_TONE_MAPPING",[Ea]:"AGX_TONE_MAPPING",[Aa]:"NEUTRAL_TONE_MAPPING",[wa]:"CUSTOM_TONE_MAPPING"};function P_(s,t,e,n,i,r){let a=new Fe(t,e,{type:s,depthBuffer:i,stencilBuffer:r,samples:n?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),o=null,l=null,c=new _e;c.setAttribute("position",new Zt([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new Zt([0,2,0,0,2,0],2));let h=new $s({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),d=new wt(c,h),u=new Di(-1,1,1,-1,0,1),f=null,m=null,v=!1,p,g=null,M=[],w=!1;this.setSize=function(y,b){a.setSize(y,b),o!==null&&o.setSize(y,b),l!==null&&l.setSize(y,b);for(let T=0;T<M.length;T++){let P=M[T];P.setSize&&P.setSize(y,b)}},this.setEffects=function(y){M=y,w=M.length>0&&M[0].isRenderPass===!0;let b=a.width,T=a.height;M.length>0&&o===null&&(o=new Fe(b,T,{type:Ze,depthBuffer:!1,stencilBuffer:!1}),l=new Fe(b,T,{type:Ze,depthBuffer:!1,stencilBuffer:!1}));for(let P=0;P<M.length;P++){let _=M[P];_.setSize&&_.setSize(b,T)}},this.begin=function(y,b){if(v||y.toneMapping===Vn&&M.length===0)return!1;if(g=b,b!==null){let T=b.width,P=b.height;(a.width!==T||a.height!==P)&&this.setSize(T,P)}return w===!1&&y.setRenderTarget(a),p=y.toneMapping,y.toneMapping=Vn,!0},this.hasRenderPass=function(){return w},this.end=function(y,b){y.toneMapping=p,v=!0;let T=a,P=o;for(let _=0;_<M.length;_++){let A=M[_];A.enabled!==!1&&(A.render(y,P,T,b),A.needsSwap!==!1&&(T=P,P=P===o?l:o))}if(f!==y.outputColorSpace||m!==y.toneMapping){f=y.outputColorSpace,m=y.toneMapping,h.defines={},Qt.getTransfer(f)===oe&&(h.defines.SRGB_TRANSFER="");let _=C_[m];_&&(h.defines[_]=""),h.needsUpdate=!0}h.uniforms.tDiffuse.value=T.texture,y.setRenderTarget(g),y.render(d,u),g=null,v=!1},this.isCompositing=function(){return v},this.dispose=function(){a.dispose(),o!==null&&o.dispose(),l!==null&&l.dispose(),c.dispose(),h.dispose()}}var zf=new rn,ou=new Ci(1,1),kf=new Hr,Vf=new Yo,Hf=new jr,yf=[],Mf=[],Sf=new Float32Array(16),bf=new Float32Array(9),Tf=new Float32Array(4);function sr(s,t,e){let n=s[0];if(n<=0||n>0)return s;let i=t*e,r=yf[i];if(r===void 0&&(r=new Float32Array(i),yf[i]=r),t!==0){n.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=e,s[a].toArray(r,o)}return r}function ke(s,t){if(s.length!==t.length)return!1;for(let e=0,n=s.length;e<n;e++)if(s[e]!==t[e])return!1;return!0}function Ve(s,t){for(let e=0,n=t.length;e<n;e++)s[e]=t[e]}function dc(s,t){let e=Mf[t];e===void 0&&(e=new Int32Array(t),Mf[t]=e);for(let n=0;n!==t;++n)e[n]=s.allocateTextureUnit();return e}function I_(s,t){let e=this.cache;e[0]!==t&&(s.uniform1f(this.addr,t),e[0]=t)}function L_(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(ke(e,t))return;s.uniform2fv(this.addr,t),Ve(e,t)}}function D_(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(s.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(ke(e,t))return;s.uniform3fv(this.addr,t),Ve(e,t)}}function N_(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(ke(e,t))return;s.uniform4fv(this.addr,t),Ve(e,t)}}function U_(s,t){let e=this.cache,n=t.elements;if(n===void 0){if(ke(e,t))return;s.uniformMatrix2fv(this.addr,!1,t),Ve(e,t)}else{if(ke(e,n))return;Tf.set(n),s.uniformMatrix2fv(this.addr,!1,Tf),Ve(e,n)}}function F_(s,t){let e=this.cache,n=t.elements;if(n===void 0){if(ke(e,t))return;s.uniformMatrix3fv(this.addr,!1,t),Ve(e,t)}else{if(ke(e,n))return;bf.set(n),s.uniformMatrix3fv(this.addr,!1,bf),Ve(e,n)}}function O_(s,t){let e=this.cache,n=t.elements;if(n===void 0){if(ke(e,t))return;s.uniformMatrix4fv(this.addr,!1,t),Ve(e,t)}else{if(ke(e,n))return;Sf.set(n),s.uniformMatrix4fv(this.addr,!1,Sf),Ve(e,n)}}function B_(s,t){let e=this.cache;e[0]!==t&&(s.uniform1i(this.addr,t),e[0]=t)}function z_(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(ke(e,t))return;s.uniform2iv(this.addr,t),Ve(e,t)}}function k_(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(ke(e,t))return;s.uniform3iv(this.addr,t),Ve(e,t)}}function V_(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(ke(e,t))return;s.uniform4iv(this.addr,t),Ve(e,t)}}function H_(s,t){let e=this.cache;e[0]!==t&&(s.uniform1ui(this.addr,t),e[0]=t)}function G_(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(ke(e,t))return;s.uniform2uiv(this.addr,t),Ve(e,t)}}function W_(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(ke(e,t))return;s.uniform3uiv(this.addr,t),Ve(e,t)}}function X_(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(ke(e,t))return;s.uniform4uiv(this.addr,t),Ve(e,t)}}function q_(s,t,e){let n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);let r;this.type===s.SAMPLER_2D_SHADOW?(ou.compareFunction=e.isReversedDepthBuffer()?ac:rc,r=ou):r=zf,e.setTexture2D(t||r,i)}function Y_(s,t,e){let n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture3D(t||Vf,i)}function $_(s,t,e){let n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTextureCube(t||Hf,i)}function Z_(s,t,e){let n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture2DArray(t||kf,i)}function J_(s){switch(s){case 5126:return I_;case 35664:return L_;case 35665:return D_;case 35666:return N_;case 35674:return U_;case 35675:return F_;case 35676:return O_;case 5124:case 35670:return B_;case 35667:case 35671:return z_;case 35668:case 35672:return k_;case 35669:case 35673:return V_;case 5125:return H_;case 36294:return G_;case 36295:return W_;case 36296:return X_;case 35678:case 36198:case 36298:case 36306:case 35682:return q_;case 35679:case 36299:case 36307:return Y_;case 35680:case 36300:case 36308:case 36293:return $_;case 36289:case 36303:case 36311:case 36292:return Z_}}function K_(s,t){s.uniform1fv(this.addr,t)}function Q_(s,t){let e=sr(t,this.size,2);s.uniform2fv(this.addr,e)}function j_(s,t){let e=sr(t,this.size,3);s.uniform3fv(this.addr,e)}function tv(s,t){let e=sr(t,this.size,4);s.uniform4fv(this.addr,e)}function ev(s,t){let e=sr(t,this.size,4);s.uniformMatrix2fv(this.addr,!1,e)}function nv(s,t){let e=sr(t,this.size,9);s.uniformMatrix3fv(this.addr,!1,e)}function iv(s,t){let e=sr(t,this.size,16);s.uniformMatrix4fv(this.addr,!1,e)}function sv(s,t){s.uniform1iv(this.addr,t)}function rv(s,t){s.uniform2iv(this.addr,t)}function av(s,t){s.uniform3iv(this.addr,t)}function ov(s,t){s.uniform4iv(this.addr,t)}function lv(s,t){s.uniform1uiv(this.addr,t)}function cv(s,t){s.uniform2uiv(this.addr,t)}function hv(s,t){s.uniform3uiv(this.addr,t)}function uv(s,t){s.uniform4uiv(this.addr,t)}function dv(s,t,e){let n=this.cache,i=t.length,r=dc(e,i);ke(n,r)||(s.uniform1iv(this.addr,r),Ve(n,r));let a;this.type===s.SAMPLER_2D_SHADOW?a=ou:a=zf;for(let o=0;o!==i;++o)e.setTexture2D(t[o]||a,r[o])}function fv(s,t,e){let n=this.cache,i=t.length,r=dc(e,i);ke(n,r)||(s.uniform1iv(this.addr,r),Ve(n,r));for(let a=0;a!==i;++a)e.setTexture3D(t[a]||Vf,r[a])}function pv(s,t,e){let n=this.cache,i=t.length,r=dc(e,i);ke(n,r)||(s.uniform1iv(this.addr,r),Ve(n,r));for(let a=0;a!==i;++a)e.setTextureCube(t[a]||Hf,r[a])}function mv(s,t,e){let n=this.cache,i=t.length,r=dc(e,i);ke(n,r)||(s.uniform1iv(this.addr,r),Ve(n,r));for(let a=0;a!==i;++a)e.setTexture2DArray(t[a]||kf,r[a])}function gv(s){switch(s){case 5126:return K_;case 35664:return Q_;case 35665:return j_;case 35666:return tv;case 35674:return ev;case 35675:return nv;case 35676:return iv;case 5124:case 35670:return sv;case 35667:case 35671:return rv;case 35668:case 35672:return av;case 35669:case 35673:return ov;case 5125:return lv;case 36294:return cv;case 36295:return hv;case 36296:return uv;case 35678:case 36198:case 36298:case 36306:case 35682:return dv;case 35679:case 36299:case 36307:return fv;case 35680:case 36300:case 36308:case 36293:return pv;case 36289:case 36303:case 36311:case 36292:return mv}}var lu=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=J_(e.type)}},cu=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=gv(e.type)}},hu=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){let i=this.seq;for(let r=0,a=i.length;r!==a;++r){let o=i[r];o.setValue(t,e[o.id],n)}}},ru=/(\w+)(\])?(\[|\.)?/g;function wf(s,t){s.seq.push(t),s.map[t.id]=t}function xv(s,t,e){let n=s.name,i=n.length;for(ru.lastIndex=0;;){let r=ru.exec(n),a=ru.lastIndex,o=r[1],l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===i){wf(e,c===void 0?new lu(o,s,t):new cu(o,s,t));break}else{let d=e.map[o];d===void 0&&(d=new hu(o),wf(e,d)),e=d}}}var nr=class{constructor(t,e){this.seq=[],this.map={};let n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){let o=t.getActiveUniform(e,a),l=t.getUniformLocation(e,o.name);xv(o,l,this)}let i=[],r=[];for(let a of this.seq)a.type===t.SAMPLER_2D_SHADOW||a.type===t.SAMPLER_CUBE_SHADOW||a.type===t.SAMPLER_2D_ARRAY_SHADOW?i.push(a):r.push(a);i.length>0&&(this.seq=i.concat(r))}setValue(t,e,n,i){let r=this.map[e];r!==void 0&&r.setValue(t,n,i)}setOptional(t,e,n){let i=e[n];i!==void 0&&this.setValue(t,n,i)}static upload(t,e,n,i){for(let r=0,a=e.length;r!==a;++r){let o=e[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(t,l.value,i)}}static seqWithValue(t,e){let n=[];for(let i=0,r=t.length;i!==r;++i){let a=t[i];a.id in e&&n.push(a)}return n}};function Ef(s,t,e){let n=s.createShader(t);return s.shaderSource(n,e),s.compileShader(n),n}var _v=37297,vv=0;function yv(s,t){let e=s.split(`
`),n=[],i=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let a=i;a<r;a++){let o=a+1;n.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return n.join(`
`)}var Af=new Wt;function Mv(s){Qt._getMatrix(Af,Qt.workingColorSpace,s);let t=`mat3( ${Af.elements.map(e=>e.toFixed(4))} )`;switch(Qt.getTransfer(s)){case zr:return[t,"LinearTransferOETF"];case oe:return[t,"sRGBTransferOETF"];default:return kt("WebGLProgram: Unsupported color space: ",s),[t,"LinearTransferOETF"]}}function Rf(s,t,e){let n=s.getShaderParameter(t,s.COMPILE_STATUS),r=(s.getShaderInfoLog(t)||"").trim();if(n&&r==="")return"";let a=/ERROR: 0:(\d+)/.exec(r);if(a){let o=parseInt(a[1]);return e.toUpperCase()+`

`+r+`

`+yv(s.getShaderSource(t),o)}else return r}function Sv(s,t){let e=Mv(t);return[`vec4 ${s}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}var bv={[Sa]:"Linear",[ba]:"Reinhard",[Ta]:"Cineon",[rs]:"ACESFilmic",[Ea]:"AgX",[Aa]:"Neutral",[wa]:"Custom"};function Tv(s,t){let e=bv[t];return e===void 0?(kt("WebGLProgram: Unsupported toneMapping:",t),"vec3 "+s+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+s+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}var lc=new E;function wv(){Qt.getLuminanceCoefficients(lc);let s=lc.x.toFixed(4),t=lc.y.toFixed(4),e=lc.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Ev(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(za).join(`
`)}function Av(s){let t=[];for(let e in s){let n=s[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function Rv(s,t){let e={},n=s.getProgramParameter(t,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){let r=s.getActiveAttrib(t,i),a=r.name,o=1;r.type===s.FLOAT_MAT2&&(o=2),r.type===s.FLOAT_MAT3&&(o=3),r.type===s.FLOAT_MAT4&&(o=4),e[a]={type:r.type,location:s.getAttribLocation(t,a),locationSize:o}}return e}function za(s){return s!==""}function Cf(s,t){let e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return s.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Pf(s,t){return s.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var Cv=/^[ \t]*#include +<([\w\d./]+)>/gm;function uu(s){return s.replace(Cv,Iv)}var Pv=new Map;function Iv(s,t){let e=Jt[t];if(e===void 0){let n=Pv.get(t);if(n!==void 0)e=Jt[n],kt('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+t+">")}return uu(e)}var Lv=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function If(s){return s.replace(Lv,Dv)}function Dv(s,t,e,n){let i="";for(let r=parseInt(t);r<parseInt(e);r++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function Lf(s){let t=`precision ${s.precision} float;
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
#define LOW_PRECISION`),t}var Nv={[is]:"SHADOWMAP_TYPE_PCF",[Js]:"SHADOWMAP_TYPE_VSM"};function Uv(s){return Nv[s.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var Fv={[Fi]:"ENVMAP_TYPE_CUBE",[as]:"ENVMAP_TYPE_CUBE",[Ra]:"ENVMAP_TYPE_CUBE_UV"};function Ov(s){return s.envMap===!1?"ENVMAP_TYPE_CUBE":Fv[s.envMapMode]||"ENVMAP_TYPE_CUBE"}var Bv={[as]:"ENVMAP_MODE_REFRACTION"};function zv(s){return s.envMap===!1?"ENVMAP_MODE_REFLECTION":Bv[s.envMapMode]||"ENVMAP_MODE_REFLECTION"}var kv={[_l]:"ENVMAP_BLENDING_MULTIPLY",[Xd]:"ENVMAP_BLENDING_MIX",[qd]:"ENVMAP_BLENDING_ADD"};function Vv(s){return s.envMap===!1?"ENVMAP_BLENDING_NONE":kv[s.combine]||"ENVMAP_BLENDING_NONE"}function Hv(s){let t=s.envMapCubeUVHeight;if(t===null)return null;let e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function Gv(s,t,e,n){let i=s.getContext(),r=e.defines,a=e.vertexShader,o=e.fragmentShader,l=Uv(e),c=Ov(e),h=zv(e),d=Vv(e),u=Hv(e),f=Ev(e),m=Av(r),v=i.createProgram(),p,g,M=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(za).join(`
`),p.length>0&&(p+=`
`),g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(za).join(`
`),g.length>0&&(g+=`
`)):(p=[Lf(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexNormals?"#define HAS_NORMAL":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(za).join(`
`),g=[Lf(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+d:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.retroreflection?"#define USE_RETROREFLECTION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas||e.batchingColor?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Vn?"#define TONE_MAPPING":"",e.toneMapping!==Vn?Jt.tonemapping_pars_fragment:"",e.toneMapping!==Vn?Tv("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Jt.colorspace_pars_fragment,Sv("linearToOutputTexel",e.outputColorSpace),wv(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(za).join(`
`)),a=uu(a),a=Cf(a,e),a=Pf(a,e),o=uu(o),o=Cf(o,e),o=Pf(o,e),a=If(a),o=If(o),e.isRawShaderMaterial!==!0&&(M=`#version 300 es
`,p=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,g=["#define varying in",e.glslVersion===Gh?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Gh?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+g);let w=M+p+a,y=M+g+o,b=Ef(i,i.VERTEX_SHADER,w),T=Ef(i,i.FRAGMENT_SHADER,y);i.attachShader(v,b),i.attachShader(v,T),e.index0AttributeName!==void 0?i.bindAttribLocation(v,0,e.index0AttributeName):e.hasPositionAttribute===!0&&i.bindAttribLocation(v,0,"position"),i.linkProgram(v);function P(L){if(s.debug.checkShaderErrors){let U=i.getProgramInfoLog(v)||"",D=i.getShaderInfoLog(b)||"",C=i.getShaderInfoLog(T)||"",B=U.trim(),k=D.trim(),V=C.trim(),Q=!0,q=!0;if(i.getProgramParameter(v,i.LINK_STATUS)===!1)if(Q=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,v,b,T);else{let K=Rf(i,b,"vertex"),j=Rf(i,T,"fragment");Ht("WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(v,i.VALIDATE_STATUS)+`

Material Name: `+L.name+`
Material Type: `+L.type+`

Program Info Log: `+B+`
`+K+`
`+j)}else B!==""?kt("WebGLProgram: Program Info Log:",B):(k===""||V==="")&&(q=!1);q&&(L.diagnostics={runnable:Q,programLog:B,vertexShader:{log:k,prefix:p},fragmentShader:{log:V,prefix:g}})}i.deleteShader(b),i.deleteShader(T),_=new nr(i,v),A=Rv(i,v)}let _;this.getUniforms=function(){return _===void 0&&P(this),_};let A;this.getAttributes=function(){return A===void 0&&P(this),A};let I=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return I===!1&&(I=i.getProgramParameter(v,_v)),I},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(v),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=vv++,this.cacheKey=t,this.usedTimes=1,this.program=v,this.vertexShader=b,this.fragmentShader=T,this}var Wv=0,du=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t,e,n){let i=this._getShaderCacheForMaterial(t);return i.has(e)===!1&&(i.add(e),e.usedTimes++),i.has(n)===!1&&(i.add(n),n.usedTimes++),this}remove(t){let e=this.materialCache.get(t);for(let n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderStage(t){return this._getShaderStage(t.vertexShader)}getFragmentShaderStage(t){return this._getShaderStage(t.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){let e=this.shaderCache,n=e.get(t);return n===void 0&&(n=new fu(t),e.set(t,n)),n}},fu=class{constructor(t){this.id=Wv++,this.code=t,this.usedTimes=0}};function Xv(s){return s===zi||s===Na||s===Ua}function qv(s,t,e,n,i,r){let a=new Gr,o=new du,l=new Set,c=[],h=new Map,d=n.logarithmicDepthBuffer,u=n.precision,f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function m(_){return l.add(_),_===0?"uv":`uv${_}`}function v(_,A,I,L,U,D){let C=L.fog,B=U.geometry,k=_.isMeshStandardMaterial||_.isMeshLambertMaterial||_.isMeshPhongMaterial?L.environment:null,V=_.isMeshStandardMaterial||_.isMeshLambertMaterial&&!_.envMap||_.isMeshPhongMaterial&&!_.envMap,Q=t.get(_.envMap||k,V),q=Q&&Q.mapping===Ra?Q.image.height:null,K=f[_.type];_.precision!==null&&(u=n.getMaxPrecision(_.precision),u!==_.precision&&kt("WebGLProgram.getParameters:",_.precision,"not supported, using",u,"instead."));let j=B.morphAttributes.position||B.morphAttributes.normal||B.morphAttributes.color,Rt=j!==void 0?j.length:0,yt=0;B.morphAttributes.position!==void 0&&(yt=1),B.morphAttributes.normal!==void 0&&(yt=2),B.morphAttributes.color!==void 0&&(yt=3);let ne,Yt,ee,Y;if(K){let ge=ri[K];ne=ge.vertexShader,Yt=ge.fragmentShader}else{ne=_.vertexShader,Yt=_.fragmentShader;let ge=o.getVertexShaderStage(_),ue=o.getFragmentShaderStage(_);o.update(_,ge,ue),ee=ge.id,Y=ue.id}let tt=s.getRenderTarget(),xt=s.state.buffers.depth.getReversed(),Ot=U.isInstancedMesh===!0,Tt=U.isBatchedMesh===!0,Vt=!!_.map,le=!!_.matcap,et=!!Q,rt=!!_.aoMap,at=!!_.lightMap,ot=!!_.bumpMap&&_.wireframe===!1,ct=!!_.normalMap,Bt=!!_.displacementMap,Ft=!!_.emissiveMap,Gt=!!_.metalnessMap,Xt=!!_.roughnessMap,N=_.anisotropy>0,he=_.clearcoat>0,jt=_.dispersion>0,R=_.retroreflectivity>0,x=_.iridescence>0,z=_.sheen>0,W=_.transmission>0,$=N&&!!_.anisotropyMap,lt=he&&!!_.clearcoatMap,ut=he&&!!_.clearcoatNormalMap,Z=he&&!!_.clearcoatRoughnessMap,nt=x&&!!_.iridescenceMap,ft=x&&!!_.iridescenceThicknessMap,Dt=z&&!!_.sheenColorMap,_t=z&&!!_.sheenRoughnessMap,pt=!!_.specularMap,Nt=!!_.specularColorMap,zt=!!_.specularIntensityMap,qt=W&&!!_.transmissionMap,O=W&&!!_.thicknessMap,mt=!!_.gradientMap,J=!!_.alphaMap,gt=_.alphaTest>0,bt=!!_.alphaHash,st=!!_.extensions,Ut=Vn;_.toneMapped&&(tt===null||tt.isXRRenderTarget===!0)&&(Ut=s.toneMapping);let It={shaderID:K,shaderType:_.type,shaderName:_.name,vertexShader:ne,fragmentShader:Yt,defines:_.defines,customVertexShaderID:ee,customFragmentShaderID:Y,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:u,batching:Tt,batchingColor:Tt&&U._colorsTexture!==null,instancing:Ot,instancingColor:Ot&&U.instanceColor!==null,instancingMorph:Ot&&U.morphTexture!==null,outputColorSpace:tt===null?s.outputColorSpace:tt.isXRRenderTarget===!0?tt.texture.colorSpace:Qt.workingColorSpace,alphaToCoverage:!!_.alphaToCoverage,map:Vt,matcap:le,envMap:et,envMapMode:et&&Q.mapping,envMapCubeUVHeight:q,aoMap:rt,lightMap:at,bumpMap:ot,normalMap:ct,displacementMap:Bt,emissiveMap:Ft,normalMapObjectSpace:ct&&_.normalMapType===Zd,normalMapTangentSpace:ct&&_.normalMapType===Fa,packedNormalMap:ct&&_.normalMapType===Fa&&Xv(_.normalMap.format),metalnessMap:Gt,roughnessMap:Xt,anisotropy:N,anisotropyMap:$,clearcoat:he,clearcoatMap:lt,clearcoatNormalMap:ut,clearcoatRoughnessMap:Z,dispersion:jt,retroreflection:R,iridescence:x,iridescenceMap:nt,iridescenceThicknessMap:ft,sheen:z,sheenColorMap:Dt,sheenRoughnessMap:_t,specularMap:pt,specularColorMap:Nt,specularIntensityMap:zt,transmission:W,transmissionMap:qt,thicknessMap:O,gradientMap:mt,opaque:_.transparent===!1&&_.blending===Ui&&_.alphaToCoverage===!1,alphaMap:J,alphaTest:gt,alphaHash:bt,combine:_.combine,mapUv:Vt&&m(_.map.channel),aoMapUv:rt&&m(_.aoMap.channel),lightMapUv:at&&m(_.lightMap.channel),bumpMapUv:ot&&m(_.bumpMap.channel),normalMapUv:ct&&m(_.normalMap.channel),displacementMapUv:Bt&&m(_.displacementMap.channel),emissiveMapUv:Ft&&m(_.emissiveMap.channel),metalnessMapUv:Gt&&m(_.metalnessMap.channel),roughnessMapUv:Xt&&m(_.roughnessMap.channel),anisotropyMapUv:$&&m(_.anisotropyMap.channel),clearcoatMapUv:lt&&m(_.clearcoatMap.channel),clearcoatNormalMapUv:ut&&m(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Z&&m(_.clearcoatRoughnessMap.channel),iridescenceMapUv:nt&&m(_.iridescenceMap.channel),iridescenceThicknessMapUv:ft&&m(_.iridescenceThicknessMap.channel),sheenColorMapUv:Dt&&m(_.sheenColorMap.channel),sheenRoughnessMapUv:_t&&m(_.sheenRoughnessMap.channel),specularMapUv:pt&&m(_.specularMap.channel),specularColorMapUv:Nt&&m(_.specularColorMap.channel),specularIntensityMapUv:zt&&m(_.specularIntensityMap.channel),transmissionMapUv:qt&&m(_.transmissionMap.channel),thicknessMapUv:O&&m(_.thicknessMap.channel),alphaMapUv:J&&m(_.alphaMap.channel),vertexTangents:!!B.attributes.tangent&&(ct||N),vertexNormals:!!B.attributes.normal,vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!B.attributes.color&&B.attributes.color.itemSize===4,pointsUvs:U.isPoints===!0&&!!B.attributes.uv&&(Vt||J),fog:!!C,useFog:_.fog===!0,fogExp2:!!C&&C.isFogExp2,flatShading:_.wireframe===!1&&(_.flatShading===!0||B.attributes.normal===void 0&&ct===!1&&(_.isMeshLambertMaterial||_.isMeshPhongMaterial||_.isMeshStandardMaterial||_.isMeshPhysicalMaterial)),sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:xt,skinning:U.isSkinnedMesh===!0,hasPositionAttribute:B.attributes.position!==void 0,morphTargets:B.morphAttributes.position!==void 0,morphNormals:B.morphAttributes.normal!==void 0,morphColors:B.morphAttributes.color!==void 0,morphTargetsCount:Rt,morphTextureStride:yt,numSunLights:A.sun.length,numDirLights:A.directional.length,numPointLights:A.point.length,numSpotLights:A.spot.length,numSpotLightMaps:A.spotLightMap.length,numRectAreaLights:A.rectArea.length,numHemiLights:A.hemi.length,numSunLightShadows:A.sunShadowMap.length,numDirLightShadows:A.directionalShadowMap.length,numPointLightShadows:A.pointShadowMap.length,numSpotLightShadows:A.spotShadowMap.length,numSpotLightShadowsWithMaps:A.numSpotLightShadowsWithMaps,numLightProbes:A.numLightProbes,numLightProbeGrids:D.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:_.dithering,shadowMapEnabled:s.shadowMap.enabled&&I.length>0,shadowMapType:s.shadowMap.type,toneMapping:Ut,decodeVideoTexture:Vt&&_.map.isVideoTexture===!0&&Qt.getTransfer(_.map.colorSpace)===oe,decodeVideoTextureEmissive:Ft&&_.emissiveMap.isVideoTexture===!0&&Qt.getTransfer(_.emissiveMap.colorSpace)===oe,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===ze,flipSided:_.side===Be,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionClipCullDistance:st&&_.extensions.clipCullDistance===!0&&e.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(st&&_.extensions.multiDraw===!0||Tt)&&e.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:e.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()};return It.vertexUv1s=l.has(1),It.vertexUv2s=l.has(2),It.vertexUv3s=l.has(3),l.clear(),It}function p(_){let A=[];if(_.shaderID?A.push(_.shaderID):(A.push(_.customVertexShaderID),A.push(_.customFragmentShaderID)),_.defines!==void 0)for(let I in _.defines)A.push(I),A.push(_.defines[I]);return _.isRawShaderMaterial===!1&&(g(A,_),M(A,_),A.push(s.outputColorSpace)),A.push(_.customProgramCacheKey),A.join()}function g(_,A){_.push(A.precision),_.push(A.outputColorSpace),_.push(A.envMapMode),_.push(A.envMapCubeUVHeight),_.push(A.mapUv),_.push(A.alphaMapUv),_.push(A.lightMapUv),_.push(A.aoMapUv),_.push(A.bumpMapUv),_.push(A.normalMapUv),_.push(A.displacementMapUv),_.push(A.emissiveMapUv),_.push(A.metalnessMapUv),_.push(A.roughnessMapUv),_.push(A.anisotropyMapUv),_.push(A.clearcoatMapUv),_.push(A.clearcoatNormalMapUv),_.push(A.clearcoatRoughnessMapUv),_.push(A.iridescenceMapUv),_.push(A.iridescenceThicknessMapUv),_.push(A.sheenColorMapUv),_.push(A.sheenRoughnessMapUv),_.push(A.specularMapUv),_.push(A.specularColorMapUv),_.push(A.specularIntensityMapUv),_.push(A.transmissionMapUv),_.push(A.thicknessMapUv),_.push(A.combine),_.push(A.fogExp2),_.push(A.sizeAttenuation),_.push(A.morphTargetsCount),_.push(A.morphAttributeCount),_.push(A.numSunLights),_.push(A.numDirLights),_.push(A.numPointLights),_.push(A.numSpotLights),_.push(A.numSpotLightMaps),_.push(A.numHemiLights),_.push(A.numRectAreaLights),_.push(A.numSunLightShadows),_.push(A.numDirLightShadows),_.push(A.numPointLightShadows),_.push(A.numSpotLightShadows),_.push(A.numSpotLightShadowsWithMaps),_.push(A.numLightProbes),_.push(A.shadowMapType),_.push(A.toneMapping),_.push(A.numClippingPlanes),_.push(A.numClipIntersection),_.push(A.depthPacking)}function M(_,A){a.disableAll(),A.instancing&&a.enable(0),A.instancingColor&&a.enable(1),A.instancingMorph&&a.enable(2),A.matcap&&a.enable(3),A.envMap&&a.enable(4),A.normalMapObjectSpace&&a.enable(5),A.normalMapTangentSpace&&a.enable(6),A.clearcoat&&a.enable(7),A.iridescence&&a.enable(8),A.alphaTest&&a.enable(9),A.vertexColors&&a.enable(10),A.vertexAlphas&&a.enable(11),A.vertexUv1s&&a.enable(12),A.vertexUv2s&&a.enable(13),A.vertexUv3s&&a.enable(14),A.vertexTangents&&a.enable(15),A.anisotropy&&a.enable(16),A.alphaHash&&a.enable(17),A.batching&&a.enable(18),A.dispersion&&a.enable(19),A.retroreflection&&a.enable(24),A.batchingColor&&a.enable(20),A.gradientMap&&a.enable(21),A.packedNormalMap&&a.enable(22),A.vertexNormals&&a.enable(23),_.push(a.mask),a.disableAll(),A.fog&&a.enable(0),A.useFog&&a.enable(1),A.flatShading&&a.enable(2),A.logarithmicDepthBuffer&&a.enable(3),A.reversedDepthBuffer&&a.enable(4),A.skinning&&a.enable(5),A.morphTargets&&a.enable(6),A.morphNormals&&a.enable(7),A.morphColors&&a.enable(8),A.premultipliedAlpha&&a.enable(9),A.shadowMapEnabled&&a.enable(10),A.doubleSided&&a.enable(11),A.flipSided&&a.enable(12),A.useDepthPacking&&a.enable(13),A.dithering&&a.enable(14),A.transmission&&a.enable(15),A.sheen&&a.enable(16),A.opaque&&a.enable(17),A.pointsUvs&&a.enable(18),A.decodeVideoTexture&&a.enable(19),A.decodeVideoTextureEmissive&&a.enable(20),A.alphaToCoverage&&a.enable(21),A.numLightProbeGrids>0&&a.enable(22),A.hasPositionAttribute&&a.enable(23),_.push(a.mask)}function w(_){let A=f[_.type],I;if(A){let L=ri[A];I=gi.clone(L.uniforms)}else I=_.uniforms;return I}function y(_,A){let I=h.get(A);return I!==void 0?++I.usedTimes:(I=new Gv(s,A,_,i),c.push(I),h.set(A,I)),I}function b(_){if(--_.usedTimes===0){let A=c.indexOf(_);c[A]=c[c.length-1],c.pop(),h.delete(_.cacheKey),_.destroy()}}function T(_){o.remove(_)}function P(){o.dispose()}return{getParameters:v,getProgramCacheKey:p,getUniforms:w,acquireProgram:y,releaseProgram:b,releaseShaderCache:T,programs:c,dispose:P}}function Yv(){let s=new WeakMap;function t(a){return s.has(a)}function e(a){let o=s.get(a);return o===void 0&&(o={},s.set(a,o)),o}function n(a){s.delete(a)}function i(a,o,l){s.get(a)[o]=l}function r(){s=new WeakMap}return{has:t,get:e,remove:n,update:i,dispose:r}}function $v(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.material.id!==t.material.id?s.material.id-t.material.id:s.materialVariant!==t.materialVariant?s.materialVariant-t.materialVariant:s.z!==t.z?s.z-t.z:s.id-t.id}function Df(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.z!==t.z?t.z-s.z:s.id-t.id}function Nf(){let s=[],t=0,e=[],n=[],i=[];function r(){t=0,e.length=0,n.length=0,i.length=0}function a(u){let f=0;return u.isInstancedMesh&&(f+=2),u.isSkinnedMesh&&(f+=1),f}function o(u,f,m,v,p,g){let M=s[t];return M===void 0?(M={id:u.id,object:u,geometry:f,material:m,materialVariant:a(u),groupOrder:v,renderOrder:u.renderOrder,z:p,group:g},s[t]=M):(M.id=u.id,M.object=u,M.geometry=f,M.material=m,M.materialVariant=a(u),M.groupOrder=v,M.renderOrder=u.renderOrder,M.z=p,M.group=g),t++,M}function l(u,f,m,v,p,g,M){M.reversedDepth===!0&&(p=-p);let w=o(u,f,m,v,p,g);m.transmission>0?n.push(w):m.transparent===!0?i.push(w):e.push(w)}function c(u,f,m,v,p,g){let M=o(u,f,m,v,p,g);m.transmission>0?n.unshift(M):m.transparent===!0?i.unshift(M):e.unshift(M)}function h(u,f){e.length>1&&e.sort(u||$v),n.length>1&&n.sort(f||Df),i.length>1&&i.sort(f||Df)}function d(){for(let u=t,f=s.length;u<f;u++){let m=s[u];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:e,transmissive:n,transparent:i,init:r,push:l,unshift:c,finish:d,sort:h}}function Zv(){let s=new WeakMap;function t(n,i){let r=s.get(n),a;return r===void 0?(a=new Nf,s.set(n,[a])):i>=r.length?(a=new Nf,r.push(a)):a=r[i],a}function e(){s=new WeakMap}return{get:t,dispose:e}}function Jv(){let s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={direction:new E,color:new ht};break;case"SpotLight":e={position:new E,direction:new E,color:new ht,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new E,color:new ht,distance:0,decay:0};break;case"HemisphereLight":e={direction:new E,skyColor:new ht,groundColor:new ht};break;case"RectAreaLight":e={color:new ht,position:new E,halfWidth:new E,halfHeight:new E};break}return s[t.id]=e,e}}}function Kv(){let s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new it};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new it};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new it,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[t.id]=e,e}}}var Qv=0;function jv(s,t){return(t.castShadow?2:0)-(s.castShadow?2:0)+(t.map?1:0)-(s.map?1:0)}function ty(s){let t=new Jv,e=Kv(),n={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new E);let i=new E,r=new ce,a=new ce;function o(c){let h=0,d=0,u=0;for(let U=0;U<9;U++)n.probe[U].set(0,0,0);let f=0,m=0,v=0,p=0,g=0,M=0,w=0,y=0,b=0,T=0,P=0,_=0,A=0,I=0;c.sort(jv);for(let U=0,D=c.length;U<D;U++){let C=c[U],B=C.color,k=C.intensity,V=C.distance,Q=null;if(C.shadow&&C.shadow.map&&(C.shadow.map.texture.format===zi?Q=C.shadow.map.texture:Q=C.shadow.map.depthTexture||C.shadow.map.texture),C.isAmbientLight)h+=B.r*k,d+=B.g*k,u+=B.b*k;else if(C.isLightProbe){for(let q=0;q<9;q++)n.probe[q].addScaledVector(C.sh.coefficients[q],k);I++}else if(C.isSunLight){let q=t.get(C);if(q.color.copy(C.color).multiplyScalar(C.intensity),C.castShadow){let K=C.shadow,j=e.get(C);j.shadowIntensity=K.intensity,j.shadowBias=K.bias,j.shadowNormalBias=K.normalBias,j.shadowRadius=K.radius,j.shadowMapSize.copy(K.mapSize).multiply(K.getFrameExtents()),n.sunShadow[m]=j,n.sunShadowMap[m]=Q;let Rt=K.getViewportCount();for(let yt=0;yt<Rt;yt++)n.sunShadowMatrix[v+yt]=K.getMatrix(yt),n.sunShadowCascade[v+yt]=K._cascadeData[yt];v+=Rt,m++}n.sun[f]=q,f++}else if(C.isDirectionalLight){let q=t.get(C);if(q.color.copy(C.color).multiplyScalar(C.intensity),C.castShadow){let K=C.shadow,j=e.get(C);j.shadowIntensity=K.intensity,j.shadowBias=K.bias,j.shadowNormalBias=K.normalBias,j.shadowRadius=K.radius,j.shadowMapSize=K.mapSize,n.directionalShadow[p]=j,n.directionalShadowMap[p]=Q,n.directionalShadowMatrix[p]=C.shadow.matrix,b++}n.directional[p]=q,p++}else if(C.isSpotLight){let q=t.get(C);q.position.setFromMatrixPosition(C.matrixWorld),q.color.copy(B).multiplyScalar(k),q.distance=V,q.coneCos=Math.cos(C.angle),q.penumbraCos=Math.cos(C.angle*(1-C.penumbra)),q.decay=C.decay,n.spot[M]=q;let K=C.shadow;if(C.map&&(n.spotLightMap[_]=C.map,_++,K.updateMatrices(C),C.castShadow&&A++),n.spotLightMatrix[M]=K.matrix,C.castShadow){let j=e.get(C);j.shadowIntensity=K.intensity,j.shadowBias=K.bias,j.shadowNormalBias=K.normalBias,j.shadowRadius=K.radius,j.shadowMapSize=K.mapSize,n.spotShadow[M]=j,n.spotShadowMap[M]=Q,P++}M++}else if(C.isRectAreaLight){let q=t.get(C);q.color.copy(B).multiplyScalar(k),q.halfWidth.set(C.width*.5,0,0),q.halfHeight.set(0,C.height*.5,0),n.rectArea[w]=q,w++}else if(C.isPointLight){let q=t.get(C);if(q.color.copy(C.color).multiplyScalar(C.intensity),q.distance=C.distance,q.decay=C.decay,C.castShadow){let K=C.shadow,j=e.get(C);j.shadowIntensity=K.intensity,j.shadowBias=K.bias,j.shadowNormalBias=K.normalBias,j.shadowRadius=K.radius,j.shadowMapSize=K.mapSize,j.shadowCameraNear=K.camera.near,j.shadowCameraFar=K.camera.far,n.pointShadow[g]=j,n.pointShadowMap[g]=Q,n.pointShadowMatrix[g]=C.shadow.matrix,T++}n.point[g]=q,g++}else if(C.isHemisphereLight){let q=t.get(C);q.skyColor.copy(C.color).multiplyScalar(k),q.groundColor.copy(C.groundColor).multiplyScalar(k),n.hemi[y]=q,y++}}w>0&&(s.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=vt.LTC_FLOAT_1,n.rectAreaLTC2=vt.LTC_FLOAT_2):(n.rectAreaLTC1=vt.LTC_HALF_1,n.rectAreaLTC2=vt.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=d,n.ambient[2]=u;let L=n.hash;(L.sunLength!==f||L.directionalLength!==p||L.pointLength!==g||L.spotLength!==M||L.rectAreaLength!==w||L.hemiLength!==y||L.numSunShadows!==m||L.numDirectionalShadows!==b||L.numPointShadows!==T||L.numSpotShadows!==P||L.numSpotMaps!==_||L.numLightProbes!==I)&&(n.sun.length=f,n.directional.length=p,n.spot.length=M,n.rectArea.length=w,n.point.length=g,n.hemi.length=y,n.sunShadow.length=m,n.sunShadowMap.length=m,n.sunShadowMatrix.length=v,n.sunShadowCascade.length=v,n.directionalShadow.length=b,n.directionalShadowMap.length=b,n.directionalShadowMatrix.length=b,n.pointShadow.length=T,n.pointShadowMap.length=T,n.pointShadowMatrix.length=T,n.spotShadow.length=P,n.spotShadowMap.length=P,n.spotLightMatrix.length=P+_-A,n.spotLightMap.length=_,n.numSpotLightShadowsWithMaps=A,n.numLightProbes=I,L.sunLength=f,L.directionalLength=p,L.pointLength=g,L.spotLength=M,L.rectAreaLength=w,L.hemiLength=y,L.numSunShadows=m,L.numDirectionalShadows=b,L.numPointShadows=T,L.numSpotShadows=P,L.numSpotMaps=_,L.numLightProbes=I,n.version=Qv++)}function l(c,h){let d=0,u=0,f=0,m=0,v=0,p=0,g=h.matrixWorldInverse;for(let M=0,w=c.length;M<w;M++){let y=c[M];if(y.isSunLight){let b=n.sun[d];b.direction.setFromMatrixPosition(y.matrixWorld),b.direction.transformDirection(g),d++}else if(y.isDirectionalLight){let b=n.directional[u];b.direction.setFromMatrixPosition(y.matrixWorld),i.setFromMatrixPosition(y.target.matrixWorld),b.direction.sub(i),b.direction.transformDirection(g),u++}else if(y.isSpotLight){let b=n.spot[m];b.position.setFromMatrixPosition(y.matrixWorld),b.position.applyMatrix4(g),b.direction.setFromMatrixPosition(y.matrixWorld),i.setFromMatrixPosition(y.target.matrixWorld),b.direction.sub(i),b.direction.transformDirection(g),m++}else if(y.isRectAreaLight){let b=n.rectArea[v];b.position.setFromMatrixPosition(y.matrixWorld),b.position.applyMatrix4(g),a.identity(),r.copy(y.matrixWorld),r.premultiply(g),a.extractRotation(r),b.halfWidth.set(y.width*.5,0,0),b.halfHeight.set(0,y.height*.5,0),b.halfWidth.applyMatrix4(a),b.halfHeight.applyMatrix4(a),v++}else if(y.isPointLight){let b=n.point[f];b.position.setFromMatrixPosition(y.matrixWorld),b.position.applyMatrix4(g),f++}else if(y.isHemisphereLight){let b=n.hemi[p];b.direction.setFromMatrixPosition(y.matrixWorld),b.direction.transformDirection(g),p++}}}return{setup:o,setupView:l,state:n}}function Uf(s){let t=new ty(s),e=[],n=[],i=[];function r(u){d.camera=u,e.length=0,n.length=0,i.length=0}function a(u){e.push(u)}function o(u){n.push(u)}function l(u){i.push(u)}function c(){t.setup(e)}function h(u){t.setupView(e,u)}let d={lightsArray:e,shadowsArray:n,lightProbeGridArray:i,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:d,setupLights:c,setupLightsView:h,pushLight:a,pushShadow:o,pushLightProbeGrid:l}}function ey(s){let t=new WeakMap;function e(i,r=0){let a=t.get(i),o;return a===void 0?(o=new Uf(s),t.set(i,[o])):r>=a.length?(o=new Uf(s),a.push(o)):o=a[r],o}function n(){t=new WeakMap}return{get:e,dispose:n}}var ny=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,iy=`uniform sampler2D shadow_pass;
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
}`,sy=[new E(1,0,0),new E(-1,0,0),new E(0,1,0),new E(0,-1,0),new E(0,0,1),new E(0,0,-1)],ry=[new E(0,-1,0),new E(0,-1,0),new E(0,0,1),new E(0,0,-1),new E(0,-1,0),new E(0,-1,0)],Ff=new ce,Ba=new E,au=new E;function ay(s,t,e){let n=new Gs,i=new it,r=new it,a=new Ae,o=new il,l=new sl,c={},h=e.maxTextureSize,d={[Ni]:Be,[Be]:Ni,[ze]:ze},u=new we({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new it},radius:{value:4}},vertexShader:ny,fragmentShader:iy}),f=u.clone();f.defines.HORIZONTAL_PASS=1;let m=new _e;m.setAttribute("position",new De(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let v=new wt(m,u),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=is;let g=this.type;this.render=function(T,P,_){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||T.length===0)return;this.type===Ed&&(kt("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=is);let A=s.getRenderTarget(),I=s.getActiveCubeFace(),L=s.getActiveMipmapLevel(),U=s.state;U.setBlending(En),U.buffers.depth.getReversed()===!0?U.buffers.color.setClear(0,0,0,0):U.buffers.color.setClear(1,1,1,1),U.buffers.depth.setTest(!0),U.setScissorTest(!1);let D=g!==this.type;D&&P.traverse(function(C){C.material&&(Array.isArray(C.material)?C.material.forEach(B=>B.needsUpdate=!0):C.material.needsUpdate=!0)});for(let C=0,B=T.length;C<B;C++){let k=T[C],V=k.shadow;if(V===void 0){kt("WebGLShadowMap:",k,"has no shadow.");continue}if(V.autoUpdate===!1&&V.needsUpdate===!1)continue;i.copy(V.mapSize);let Q=V.getFrameExtents();i.multiply(Q),r.copy(V.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(r.x=Math.floor(h/Q.x),i.x=r.x*Q.x,V.mapSize.x=r.x),i.y>h&&(r.y=Math.floor(h/Q.y),i.y=r.y*Q.y,V.mapSize.y=r.y));let q=s.state.buffers.depth.getReversed();if(V.camera._reversedDepth=q,V.map===null||D===!0){if(V.map!==null&&(V.map.depthTexture!==null&&(V.map.depthTexture.dispose(),V.map.depthTexture=null),V.map.dispose()),this.type===Js){if(k.isPointLight){kt("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}V.map=new Fe(i.x,i.y,{format:zi,type:Ze,minFilter:$e,magFilter:$e,generateMipmaps:!1}),V.map.texture.name=k.name+".shadowMap",V.map.depthTexture=new Ci(i.x,i.y,An),V.map.depthTexture.name=k.name+".shadowMapDepth",V.map.depthTexture.format=jn,V.map.depthTexture.compareFunction=null,V.map.depthTexture.minFilter=qe,V.map.depthTexture.magFilter=qe}else k.isPointLight?(V.map=new cc(i.x),V.map.depthTexture=new Zo(i.x,Hn)):(V.map=new Fe(i.x,i.y),V.map.depthTexture=new Ci(i.x,i.y,Hn)),V.map.depthTexture.name=k.name+".shadowMap",V.map.depthTexture.format=jn,this.type===is?(V.map.depthTexture.compareFunction=q?ac:rc,V.map.depthTexture.minFilter=$e,V.map.depthTexture.magFilter=$e):(V.map.depthTexture.compareFunction=null,V.map.depthTexture.minFilter=qe,V.map.depthTexture.magFilter=qe);V.camera.updateProjectionMatrix()}V.map.isWebGLCubeRenderTarget!==!0&&(V.map.width!==i.x||V.map.height!==i.y)&&V.map.setSize(i.x,i.y);let K=V.map.isWebGLCubeRenderTarget?6:V.getViewportCount();k.isPointLight!==!0&&V.updateMatrices(k,_);for(let j=0;j<K;j++){let Rt=V.getCamera(j);if(k.isPointLight){let yt=V.camera,ne=V.matrix,Yt=k.distance||yt.far;Yt!==yt.far&&(yt.far=Yt,yt.updateProjectionMatrix()),Ba.setFromMatrixPosition(k.matrixWorld),yt.position.copy(Ba),au.copy(yt.position),au.add(sy[j]),yt.up.copy(ry[j]),yt.lookAt(au),yt.updateMatrixWorld(),ne.makeTranslation(-Ba.x,-Ba.y,-Ba.z),Ff.multiplyMatrices(yt.projectionMatrix,yt.matrixWorldInverse),V._frustum.setFromProjectionMatrix(Ff,yt.coordinateSystem,yt.reversedDepth)}if(V.map.isWebGLCubeRenderTarget)s.setRenderTarget(V.map,j),s.clear();else{j===0&&(s.setRenderTarget(V.map),s.clear());let yt=V.getViewport(j);a.set(r.x*yt.x,r.y*yt.y,r.x*yt.z,r.y*yt.w),U.viewport(a)}n=V.getFrustum(j),y(P,_,Rt,k,this.type)}V.isPointLightShadow!==!0&&this.type===Js&&M(V,_),V.needsUpdate=!1}g=this.type,p.needsUpdate=!1,s.setRenderTarget(A,I,L)};function M(T,P){let _=t.update(v);u.defines.VSM_SAMPLES!==T.blurSamples&&(u.defines.VSM_SAMPLES=T.blurSamples,f.defines.VSM_SAMPLES=T.blurSamples,u.needsUpdate=!0,f.needsUpdate=!0),T.mapPass===null?T.mapPass=new Fe(i.x,i.y,{format:zi,type:Ze}):(T.mapPass.width!==T.map.width||T.mapPass.height!==T.map.height)&&T.mapPass.setSize(T.map.width,T.map.height),u.uniforms.shadow_pass.value=T.map.depthTexture,u.uniforms.resolution.value.set(T.map.width,T.map.height),u.uniforms.radius.value=T.radius,s.setRenderTarget(T.mapPass),s.clear(),s.renderBufferDirect(P,null,_,u,v,null),f.uniforms.shadow_pass.value=T.mapPass.texture,f.uniforms.resolution.value.set(T.map.width,T.map.height),f.uniforms.radius.value=T.radius,s.setRenderTarget(T.map),s.clear(),s.renderBufferDirect(P,null,_,f,v,null)}function w(T,P,_,A){let I=null,L=_.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(L!==void 0)I=L;else if(I=_.isPointLight===!0?l:o,s.localClippingEnabled&&P.clipShadows===!0&&Array.isArray(P.clippingPlanes)&&P.clippingPlanes.length!==0||P.displacementMap&&P.displacementScale!==0||P.alphaMap&&P.alphaTest>0||P.map&&P.alphaTest>0||P.alphaToCoverage===!0){let U=I.uuid,D=P.uuid,C=c[U];C===void 0&&(C={},c[U]=C);let B=C[D];B===void 0&&(B=I.clone(),C[D]=B,P.addEventListener("dispose",b)),I=B}if(I.visible=P.visible,I.wireframe=P.wireframe,A===Js?I.side=P.shadowSide!==null?P.shadowSide:P.side:I.side=P.shadowSide!==null?P.shadowSide:d[P.side],I.alphaMap=P.alphaMap,I.alphaTest=P.alphaToCoverage===!0?.5:P.alphaTest,I.map=P.map,I.clipShadows=P.clipShadows,I.clippingPlanes=P.clippingPlanes,I.clipIntersection=P.clipIntersection,I.displacementMap=P.displacementMap,I.displacementScale=P.displacementScale,I.displacementBias=P.displacementBias,I.wireframeLinewidth=P.wireframeLinewidth,I.linewidth=P.linewidth,_.isPointLight===!0&&I.isMeshDistanceMaterial===!0){let U=s.properties.get(I);U.light=_}return I}function y(T,P,_,A,I){if(T.visible===!1)return;if(T.layers.test(P.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&I===Js)&&(!T.frustumCulled||T.intersectsFrustum(n))){T.modelViewMatrix.multiplyMatrices(_.matrixWorldInverse,T.matrixWorld);let D=t.update(T),C=T.material;if(Array.isArray(C)){let B=D.groups;for(let k=0,V=B.length;k<V;k++){let Q=B[k],q=C[Q.materialIndex];if(q&&q.visible){let K=w(T,q,A,I);T.onBeforeShadow(s,T,P,_,D,K,Q),s.renderBufferDirect(_,null,D,K,T,Q),T.onAfterShadow(s,T,P,_,D,K,Q)}}}else if(C.visible){let B=w(T,C,A,I);T.onBeforeShadow(s,T,P,_,D,B,null),s.renderBufferDirect(_,null,D,B,T,null),T.onAfterShadow(s,T,P,_,D,B,null)}}let U=T.children;for(let D=0,C=U.length;D<C;D++)y(U[D],P,_,A,I)}function b(T){T.target.removeEventListener("dispose",b);for(let _ in c){let A=c[_],I=T.target.uuid;I in A&&(A[I].dispose(),delete A[I])}}}function oy(s,t){function e(){let O=!1,mt=new Ae,J=null,gt=new Ae(0,0,0,0);return{setMask:function(bt){J!==bt&&!O&&(s.colorMask(bt,bt,bt,bt),J=bt)},setLocked:function(bt){O=bt},setClear:function(bt,st,Ut,It,ge){ge===!0&&(bt*=It,st*=It,Ut*=It),mt.set(bt,st,Ut,It),gt.equals(mt)===!1&&(s.clearColor(bt,st,Ut,It),gt.copy(mt))},reset:function(){O=!1,J=null,gt.set(-1,0,0,0)}}}function n(){let O=!1,mt=!1,J=null,gt=null,bt=null;return{setReversed:function(st){if(mt!==st){let Ut=t.get("EXT_clip_control");st?Ut.clipControlEXT(Ut.LOWER_LEFT_EXT,Ut.ZERO_TO_ONE_EXT):Ut.clipControlEXT(Ut.LOWER_LEFT_EXT,Ut.NEGATIVE_ONE_TO_ONE_EXT),mt=st;let It=bt;bt=null,this.setClear(It)}},getReversed:function(){return mt},setTest:function(st){st?tt(s.DEPTH_TEST):xt(s.DEPTH_TEST)},setMask:function(st){J!==st&&!O&&(s.depthMask(st),J=st)},setFunc:function(st){if(mt&&(st=of[st]),gt!==st){switch(st){case Fo:s.depthFunc(s.NEVER);break;case Oo:s.depthFunc(s.ALWAYS);break;case Bo:s.depthFunc(s.LESS);break;case Fs:s.depthFunc(s.LEQUAL);break;case zo:s.depthFunc(s.EQUAL);break;case ko:s.depthFunc(s.GEQUAL);break;case Vo:s.depthFunc(s.GREATER);break;case Ho:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}gt=st}},setLocked:function(st){O=st},setClear:function(st){bt!==st&&(bt=st,mt&&(st=1-st),s.clearDepth(st))},reset:function(){O=!1,J=null,gt=null,bt=null,mt=!1}}}function i(){let O=!1,mt=null,J=null,gt=null,bt=null,st=null,Ut=null,It=null,ge=null;return{setTest:function(ue){O||(ue?tt(s.STENCIL_TEST):xt(s.STENCIL_TEST))},setMask:function(ue){mt!==ue&&!O&&(s.stencilMask(ue),mt=ue)},setFunc:function(ue,In,Yn){(J!==ue||gt!==In||bt!==Yn)&&(s.stencilFunc(ue,In,Yn),J=ue,gt=In,bt=Yn)},setOp:function(ue,In,Yn){(st!==ue||Ut!==In||It!==Yn)&&(s.stencilOp(ue,In,Yn),st=ue,Ut=In,It=Yn)},setLocked:function(ue){O=ue},setClear:function(ue){ge!==ue&&(s.clearStencil(ue),ge=ue)},reset:function(){O=!1,mt=null,J=null,gt=null,bt=null,st=null,Ut=null,It=null,ge=null}}}let r=new e,a=new n,o=new i,l=new WeakMap,c=new WeakMap,h={},d={},u={},f=new WeakMap,m=[],v=null,p=!1,g=null,M=null,w=null,y=null,b=null,T=null,P=null,_=new ht(0,0,0),A=0,I=!1,L=null,U=null,D=null,C=null,B=null,k=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS),V=!1,Q=0,q=s.getParameter(s.VERSION);q.indexOf("WebGL")!==-1?(Q=parseFloat(/^WebGL (\d)/.exec(q)[1]),V=Q>=1):q.indexOf("OpenGL ES")!==-1&&(Q=parseFloat(/^OpenGL ES (\d)/.exec(q)[1]),V=Q>=2);let K=null,j={},Rt=s.getParameter(s.SCISSOR_BOX),yt=s.getParameter(s.VIEWPORT),ne=new Ae().fromArray(Rt),Yt=new Ae().fromArray(yt);function ee(O,mt,J,gt){let bt=new Uint8Array(4),st=s.createTexture();s.bindTexture(O,st),s.texParameteri(O,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(O,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let Ut=0;Ut<J;Ut++)O===s.TEXTURE_3D||O===s.TEXTURE_2D_ARRAY?s.texImage3D(mt,0,s.RGBA,1,1,gt,0,s.RGBA,s.UNSIGNED_BYTE,bt):s.texImage2D(mt+Ut,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,bt);return st}let Y={};Y[s.TEXTURE_2D]=ee(s.TEXTURE_2D,s.TEXTURE_2D,1),Y[s.TEXTURE_CUBE_MAP]=ee(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),Y[s.TEXTURE_2D_ARRAY]=ee(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),Y[s.TEXTURE_3D]=ee(s.TEXTURE_3D,s.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),tt(s.DEPTH_TEST),a.setFunc(Fs),ot(!1),ct(Ph),tt(s.CULL_FACE),rt(En);function tt(O){h[O]!==!0&&(s.enable(O),h[O]=!0)}function xt(O){h[O]!==!1&&(s.disable(O),h[O]=!1)}function Ot(O,mt){return u[O]!==mt?(s.bindFramebuffer(O,mt),u[O]=mt,O===s.DRAW_FRAMEBUFFER&&(u[s.FRAMEBUFFER]=mt),O===s.FRAMEBUFFER&&(u[s.DRAW_FRAMEBUFFER]=mt),!0):!1}function Tt(O,mt){let J=m,gt=!1;if(O){J=f.get(mt),J===void 0&&(J=[],f.set(mt,J));let bt=O.textures;if(J.length!==bt.length||J[0]!==s.COLOR_ATTACHMENT0){for(let st=0,Ut=bt.length;st<Ut;st++)J[st]=s.COLOR_ATTACHMENT0+st;J.length=bt.length,gt=!0}}else J[0]!==s.BACK&&(J[0]=s.BACK,gt=!0);gt&&s.drawBuffers(J)}function Vt(O){return v!==O?(s.useProgram(O),v=O,!0):!1}let le={[ss]:s.FUNC_ADD,[Rd]:s.FUNC_SUBTRACT,[Cd]:s.FUNC_REVERSE_SUBTRACT};le[Pd]=s.MIN,le[Id]=s.MAX;let et={[Ld]:s.ZERO,[Dd]:s.ONE,[Nd]:s.SRC_COLOR,[Dh]:s.SRC_ALPHA,[kd]:s.SRC_ALPHA_SATURATE,[Bd]:s.DST_COLOR,[Fd]:s.DST_ALPHA,[Ud]:s.ONE_MINUS_SRC_COLOR,[Nh]:s.ONE_MINUS_SRC_ALPHA,[zd]:s.ONE_MINUS_DST_COLOR,[Od]:s.ONE_MINUS_DST_ALPHA,[Vd]:s.CONSTANT_COLOR,[Hd]:s.ONE_MINUS_CONSTANT_COLOR,[Gd]:s.CONSTANT_ALPHA,[Wd]:s.ONE_MINUS_CONSTANT_ALPHA};function rt(O,mt,J,gt,bt,st,Ut,It,ge,ue){if(O===En){p===!0&&(xt(s.BLEND),p=!1);return}if(p===!1&&(tt(s.BLEND),p=!0),O!==Ad){if(O!==g||ue!==I){if((M!==ss||b!==ss)&&(s.blendEquation(s.FUNC_ADD),M=ss,b=ss),ue)switch(O){case Ui:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case dn:s.blendFunc(s.ONE,s.ONE);break;case Ih:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case Lh:s.blendFuncSeparate(s.DST_COLOR,s.ONE_MINUS_SRC_ALPHA,s.ZERO,s.ONE);break;default:Ht("WebGLState: Invalid blending: ",O);break}else switch(O){case Ui:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case dn:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE,s.ONE,s.ONE);break;case Ih:Ht("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Lh:Ht("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Ht("WebGLState: Invalid blending: ",O);break}w=null,y=null,T=null,P=null,_.set(0,0,0),A=0,g=O,I=ue}return}bt=bt||mt,st=st||J,Ut=Ut||gt,(mt!==M||bt!==b)&&(s.blendEquationSeparate(le[mt],le[bt]),M=mt,b=bt),(J!==w||gt!==y||st!==T||Ut!==P)&&(s.blendFuncSeparate(et[J],et[gt],et[st],et[Ut]),w=J,y=gt,T=st,P=Ut),(It.equals(_)===!1||ge!==A)&&(s.blendColor(It.r,It.g,It.b,ge),_.copy(It),A=ge),g=O,I=!1}function at(O,mt){O.side===ze?xt(s.CULL_FACE):tt(s.CULL_FACE);let J=O.side===Be;mt&&(J=!J),ot(J),O.blending===Ui&&O.transparent===!1?rt(En):rt(O.blending,O.blendEquation,O.blendSrc,O.blendDst,O.blendEquationAlpha,O.blendSrcAlpha,O.blendDstAlpha,O.blendColor,O.blendAlpha,O.premultipliedAlpha),a.setFunc(O.depthFunc),a.setTest(O.depthTest),a.setMask(O.depthWrite),r.setMask(O.colorWrite);let gt=O.stencilWrite;o.setTest(gt),gt&&(o.setMask(O.stencilWriteMask),o.setFunc(O.stencilFunc,O.stencilRef,O.stencilFuncMask),o.setOp(O.stencilFail,O.stencilZFail,O.stencilZPass)),Ft(O.polygonOffset,O.polygonOffsetFactor,O.polygonOffsetUnits),O.alphaToCoverage===!0?tt(s.SAMPLE_ALPHA_TO_COVERAGE):xt(s.SAMPLE_ALPHA_TO_COVERAGE)}function ot(O){L!==O&&(O?s.frontFace(s.CW):s.frontFace(s.CCW),L=O)}function ct(O){O!==Td?(tt(s.CULL_FACE),O!==U&&(O===Ph?s.cullFace(s.BACK):O===wd?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):xt(s.CULL_FACE),U=O}function Bt(O){O!==D&&(V&&s.lineWidth(O),D=O)}function Ft(O,mt,J){O?(tt(s.POLYGON_OFFSET_FILL),(C!==mt||B!==J)&&(C=mt,B=J,a.getReversed()&&(mt=-mt),s.polygonOffset(mt,J))):xt(s.POLYGON_OFFSET_FILL)}function Gt(O){O?tt(s.SCISSOR_TEST):xt(s.SCISSOR_TEST)}function Xt(O){O===void 0&&(O=s.TEXTURE0+k-1),K!==O&&(s.activeTexture(O),K=O)}function N(O,mt,J){J===void 0&&(K===null?J=s.TEXTURE0+k-1:J=K);let gt=j[J];gt===void 0&&(gt={type:void 0,texture:void 0},j[J]=gt),(gt.type!==O||gt.texture!==mt)&&(K!==J&&(s.activeTexture(J),K=J),s.bindTexture(O,mt||Y[O]),gt.type=O,gt.texture=mt)}function he(){let O=j[K];O!==void 0&&O.type!==void 0&&(s.bindTexture(O.type,null),O.type=void 0,O.texture=void 0)}function jt(){try{s.compressedTexImage2D(...arguments)}catch(O){Ht("WebGLState:",O)}}function R(){try{s.compressedTexImage3D(...arguments)}catch(O){Ht("WebGLState:",O)}}function x(){try{s.texSubImage2D(...arguments)}catch(O){Ht("WebGLState:",O)}}function z(){try{s.texSubImage3D(...arguments)}catch(O){Ht("WebGLState:",O)}}function W(){try{s.compressedTexSubImage2D(...arguments)}catch(O){Ht("WebGLState:",O)}}function $(){try{s.compressedTexSubImage3D(...arguments)}catch(O){Ht("WebGLState:",O)}}function lt(){try{s.texStorage2D(...arguments)}catch(O){Ht("WebGLState:",O)}}function ut(){try{s.texStorage3D(...arguments)}catch(O){Ht("WebGLState:",O)}}function Z(){try{s.texImage2D(...arguments)}catch(O){Ht("WebGLState:",O)}}function nt(){try{s.texImage3D(...arguments)}catch(O){Ht("WebGLState:",O)}}function ft(O){return d[O]!==void 0?d[O]:s.getParameter(O)}function Dt(O,mt){d[O]!==mt&&(s.pixelStorei(O,mt),d[O]=mt)}function _t(O){ne.equals(O)===!1&&(s.scissor(O.x,O.y,O.z,O.w),ne.copy(O))}function pt(O){Yt.equals(O)===!1&&(s.viewport(O.x,O.y,O.z,O.w),Yt.copy(O))}function Nt(O,mt){let J=c.get(mt);J===void 0&&(J=new WeakMap,c.set(mt,J));let gt=J.get(O);gt===void 0&&(gt=s.getUniformBlockIndex(mt,O.name),J.set(O,gt))}function zt(O,mt){let gt=c.get(mt).get(O);l.get(mt)!==gt&&(s.uniformBlockBinding(mt,gt,O.__bindingPointIndex),l.set(mt,gt))}function qt(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),a.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),s.pixelStorei(s.PACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,!1),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,s.BROWSER_DEFAULT_WEBGL),s.pixelStorei(s.PACK_ROW_LENGTH,0),s.pixelStorei(s.PACK_SKIP_PIXELS,0),s.pixelStorei(s.PACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_ROW_LENGTH,0),s.pixelStorei(s.UNPACK_IMAGE_HEIGHT,0),s.pixelStorei(s.UNPACK_SKIP_PIXELS,0),s.pixelStorei(s.UNPACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_SKIP_IMAGES,0),h={},d={},K=null,j={},u={},f=new WeakMap,m=[],v=null,p=!1,g=null,M=null,w=null,y=null,b=null,T=null,P=null,_=new ht(0,0,0),A=0,I=!1,L=null,U=null,D=null,C=null,B=null,ne.set(0,0,s.canvas.width,s.canvas.height),Yt.set(0,0,s.canvas.width,s.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:tt,disable:xt,bindFramebuffer:Ot,drawBuffers:Tt,useProgram:Vt,setBlending:rt,setMaterial:at,setFlipSided:ot,setCullFace:ct,setLineWidth:Bt,setPolygonOffset:Ft,setScissorTest:Gt,activeTexture:Xt,bindTexture:N,unbindTexture:he,compressedTexImage2D:jt,compressedTexImage3D:R,texImage2D:Z,texImage3D:nt,pixelStorei:Dt,getParameter:ft,updateUBOMapping:Nt,uniformBlockBinding:zt,texStorage2D:lt,texStorage3D:ut,texSubImage2D:x,texSubImage3D:z,compressedTexSubImage2D:W,compressedTexSubImage3D:$,scissor:_t,viewport:pt,reset:qt}}function ly(s,t,e,n,i,r,a){let o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new it,h=new WeakMap,d=new Set,u,f=new WeakMap,m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function v(R,x){return m?new OffscreenCanvas(R,x):kr("canvas")}function p(R,x,z){let W=1,$=jt(R);if(($.width>z||$.height>z)&&(W=z/Math.max($.width,$.height)),W<1)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap||typeof VideoFrame<"u"&&R instanceof VideoFrame){let lt=Math.floor(W*$.width),ut=Math.floor(W*$.height);u===void 0&&(u=v(lt,ut));let Z=x?v(lt,ut):u;return Z.width=lt,Z.height=ut,Z.getContext("2d").drawImage(R,0,0,lt,ut),kt("WebGLRenderer: Texture has been resized from ("+$.width+"x"+$.height+") to ("+lt+"x"+ut+")."),Z}else return"data"in R&&kt("WebGLRenderer: Image in DataTexture is too big ("+$.width+"x"+$.height+")."),R;return R}function g(R){return R.generateMipmaps}function M(R){s.generateMipmap(R)}function w(R){return R.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:R.isWebGL3DRenderTarget?s.TEXTURE_3D:R.isWebGLArrayRenderTarget||R.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function y(R,x,z,W,$,lt=!1){if(R!==null){if(s[R]!==void 0)return s[R];kt("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let ut;W&&(ut=t.get("EXT_texture_norm16"),ut||kt("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let Z=x;if(x===s.RED&&(z===s.FLOAT&&(Z=s.R32F),z===s.HALF_FLOAT&&(Z=s.R16F),z===s.UNSIGNED_BYTE&&(Z=s.R8),z===s.UNSIGNED_SHORT&&ut&&(Z=ut.R16_EXT),z===s.SHORT&&ut&&(Z=ut.R16_SNORM_EXT)),x===s.RED_INTEGER&&(z===s.UNSIGNED_BYTE&&(Z=s.R8UI),z===s.UNSIGNED_SHORT&&(Z=s.R16UI),z===s.UNSIGNED_INT&&(Z=s.R32UI),z===s.BYTE&&(Z=s.R8I),z===s.SHORT&&(Z=s.R16I),z===s.INT&&(Z=s.R32I)),x===s.RG&&(z===s.FLOAT&&(Z=s.RG32F),z===s.HALF_FLOAT&&(Z=s.RG16F),z===s.UNSIGNED_BYTE&&(Z=s.RG8),z===s.UNSIGNED_SHORT&&ut&&(Z=ut.RG16_EXT),z===s.SHORT&&ut&&(Z=ut.RG16_SNORM_EXT)),x===s.RG_INTEGER&&(z===s.UNSIGNED_BYTE&&(Z=s.RG8UI),z===s.UNSIGNED_SHORT&&(Z=s.RG16UI),z===s.UNSIGNED_INT&&(Z=s.RG32UI),z===s.BYTE&&(Z=s.RG8I),z===s.SHORT&&(Z=s.RG16I),z===s.INT&&(Z=s.RG32I)),x===s.RGB_INTEGER&&(z===s.UNSIGNED_BYTE&&(Z=s.RGB8UI),z===s.UNSIGNED_SHORT&&(Z=s.RGB16UI),z===s.UNSIGNED_INT&&(Z=s.RGB32UI),z===s.BYTE&&(Z=s.RGB8I),z===s.SHORT&&(Z=s.RGB16I),z===s.INT&&(Z=s.RGB32I)),x===s.RGBA_INTEGER&&(z===s.UNSIGNED_BYTE&&(Z=s.RGBA8UI),z===s.UNSIGNED_SHORT&&(Z=s.RGBA16UI),z===s.UNSIGNED_INT&&(Z=s.RGBA32UI),z===s.BYTE&&(Z=s.RGBA8I),z===s.SHORT&&(Z=s.RGBA16I),z===s.INT&&(Z=s.RGBA32I)),x===s.RGB&&(z===s.UNSIGNED_SHORT&&ut&&(Z=ut.RGB16_EXT),z===s.SHORT&&ut&&(Z=ut.RGB16_SNORM_EXT),z===s.UNSIGNED_INT_5_9_9_9_REV&&(Z=s.RGB9_E5),z===s.UNSIGNED_INT_10F_11F_11F_REV&&(Z=s.R11F_G11F_B10F)),x===s.RGBA){let nt=lt?zr:Qt.getTransfer($);z===s.FLOAT&&(Z=s.RGBA32F),z===s.HALF_FLOAT&&(Z=s.RGBA16F),z===s.UNSIGNED_BYTE&&(Z=nt===oe?s.SRGB8_ALPHA8:s.RGBA8),z===s.UNSIGNED_SHORT&&ut&&(Z=ut.RGBA16_EXT),z===s.SHORT&&ut&&(Z=ut.RGBA16_SNORM_EXT),z===s.UNSIGNED_SHORT_4_4_4_4&&(Z=s.RGBA4),z===s.UNSIGNED_SHORT_5_5_5_1&&(Z=s.RGB5_A1)}return(Z===s.R16F||Z===s.R32F||Z===s.RG16F||Z===s.RG32F||Z===s.RGBA16F||Z===s.RGBA32F)&&t.get("EXT_color_buffer_float"),Z}function b(R,x){let z;return R?x===null||x===Hn||x===Qs?z=s.DEPTH24_STENCIL8:x===An?z=s.DEPTH32F_STENCIL8:x===Ks&&(z=s.DEPTH24_STENCIL8,kt("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):x===null||x===Hn||x===Qs?z=s.DEPTH_COMPONENT24:x===An?z=s.DEPTH_COMPONENT32F:x===Ks&&(z=s.DEPTH_COMPONENT16),z}function T(R,x){return g(R)===!0||R.isFramebufferTexture&&R.minFilter!==qe&&R.minFilter!==$e?Math.log2(Math.max(x.width,x.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?x.mipmaps.length:1}function P(R){let x=R.target;x.removeEventListener("dispose",P),A(x),x.isVideoTexture&&h.delete(x),x.isHTMLTexture&&d.delete(x)}function _(R){let x=R.target;x.removeEventListener("dispose",_),L(x)}function A(R){let x=n.get(R);if(x.__webglInit===void 0)return;let z=R.source,W=f.get(z);if(W){let $=W[x.__cacheKey];$.usedTimes--,$.usedTimes===0&&I(R),Object.keys(W).length===0&&f.delete(z)}n.remove(R)}function I(R){let x=n.get(R);s.deleteTexture(x.__webglTexture);let z=R.source,W=f.get(z);delete W[x.__cacheKey],a.memory.textures--}function L(R){let x=n.get(R);if(R.depthTexture&&(R.depthTexture.dispose(),n.remove(R.depthTexture)),R.isWebGLCubeRenderTarget)for(let W=0;W<6;W++){if(Array.isArray(x.__webglFramebuffer[W]))for(let $=0;$<x.__webglFramebuffer[W].length;$++)s.deleteFramebuffer(x.__webglFramebuffer[W][$]);else s.deleteFramebuffer(x.__webglFramebuffer[W]);x.__webglDepthbuffer&&s.deleteRenderbuffer(x.__webglDepthbuffer[W])}else{if(Array.isArray(x.__webglFramebuffer))for(let W=0;W<x.__webglFramebuffer.length;W++)s.deleteFramebuffer(x.__webglFramebuffer[W]);else s.deleteFramebuffer(x.__webglFramebuffer);if(x.__webglDepthbuffer&&s.deleteRenderbuffer(x.__webglDepthbuffer),x.__webglMultisampledFramebuffer&&s.deleteFramebuffer(x.__webglMultisampledFramebuffer),x.__webglColorRenderbuffer)for(let W=0;W<x.__webglColorRenderbuffer.length;W++)x.__webglColorRenderbuffer[W]&&s.deleteRenderbuffer(x.__webglColorRenderbuffer[W]);x.__webglDepthRenderbuffer&&s.deleteRenderbuffer(x.__webglDepthRenderbuffer)}let z=R.textures;for(let W=0,$=z.length;W<$;W++){let lt=n.get(z[W]);lt.__webglTexture&&(s.deleteTexture(lt.__webglTexture),a.memory.textures--),n.remove(z[W])}n.remove(R)}let U=0;function D(){U=0}function C(){return U}function B(R){U=R}function k(){let R=U;return R>=i.maxTextures&&kt("WebGLTextures: Trying to use "+(R+1)+" texture units while this GPU supports only "+i.maxTextures),U+=1,R}function V(R){let x=[];return x.push(R.wrapS),x.push(R.wrapT),x.push(R.wrapR||0),x.push(R.magFilter),x.push(R.minFilter),x.push(R.anisotropy),x.push(R.internalFormat),x.push(R.format),x.push(R.type),x.push(R.generateMipmaps),x.push(R.premultiplyAlpha),x.push(R.flipY),x.push(R.unpackAlignment),x.push(R.colorSpace),x.join()}function Q(R,x){let z=n.get(R);if(R.isVideoTexture&&N(R),R.isRenderTargetTexture===!1&&R.isExternalTexture!==!0&&R.version>0&&z.__version!==R.version){let W=R.image;if(W===null)kt("WebGLRenderer: Texture marked for update but no image data found.");else if(W.complete===!1)kt("WebGLRenderer: Texture marked for update but image is incomplete");else{xt(z,R,x);return}}else R.isExternalTexture&&(z.__webglTexture=R.sourceTexture?R.sourceTexture:null);e.bindTexture(s.TEXTURE_2D,z.__webglTexture,s.TEXTURE0+x)}function q(R,x){let z=n.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&z.__version!==R.version){xt(z,R,x);return}else R.isExternalTexture&&(z.__webglTexture=R.sourceTexture?R.sourceTexture:null);e.bindTexture(s.TEXTURE_2D_ARRAY,z.__webglTexture,s.TEXTURE0+x)}function K(R,x){let z=n.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&z.__version!==R.version){xt(z,R,x);return}e.bindTexture(s.TEXTURE_3D,z.__webglTexture,s.TEXTURE0+x)}function j(R,x){let z=n.get(R);if(R.isCubeDepthTexture!==!0&&R.version>0&&z.__version!==R.version){Ot(z,R,x);return}e.bindTexture(s.TEXTURE_CUBE_MAP,z.__webglTexture,s.TEXTURE0+x)}let Rt={[Ri]:s.REPEAT,[Jn]:s.CLAMP_TO_EDGE,[Go]:s.MIRRORED_REPEAT},yt={[qe]:s.NEAREST,[Yd]:s.NEAREST_MIPMAP_NEAREST,[Ca]:s.NEAREST_MIPMAP_LINEAR,[$e]:s.LINEAR,[Ml]:s.LINEAR_MIPMAP_NEAREST,[Oi]:s.LINEAR_MIPMAP_LINEAR},ne={[Kd]:s.NEVER,[nf]:s.ALWAYS,[Qd]:s.LESS,[rc]:s.LEQUAL,[jd]:s.EQUAL,[ac]:s.GEQUAL,[tf]:s.GREATER,[ef]:s.NOTEQUAL};function Yt(R,x){if(x.type===An&&t.has("OES_texture_float_linear")===!1&&(x.magFilter===$e||x.magFilter===Ml||x.magFilter===Ca||x.magFilter===Oi||x.minFilter===$e||x.minFilter===Ml||x.minFilter===Ca||x.minFilter===Oi)&&kt("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(R,s.TEXTURE_WRAP_S,Rt[x.wrapS]),s.texParameteri(R,s.TEXTURE_WRAP_T,Rt[x.wrapT]),(R===s.TEXTURE_3D||R===s.TEXTURE_2D_ARRAY)&&s.texParameteri(R,s.TEXTURE_WRAP_R,Rt[x.wrapR]),s.texParameteri(R,s.TEXTURE_MAG_FILTER,yt[x.magFilter]),s.texParameteri(R,s.TEXTURE_MIN_FILTER,yt[x.minFilter]),x.compareFunction&&(s.texParameteri(R,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(R,s.TEXTURE_COMPARE_FUNC,ne[x.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(x.magFilter===qe||x.minFilter!==Ca&&x.minFilter!==Oi||x.type===An&&t.has("OES_texture_float_linear")===!1)return;if(x.anisotropy>1||n.get(x).__currentAnisotropy){let z=t.get("EXT_texture_filter_anisotropic");s.texParameterf(R,z.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(x.anisotropy,i.getMaxAnisotropy())),n.get(x).__currentAnisotropy=x.anisotropy}}}function ee(R,x){let z=!1;R.__webglInit===void 0&&(R.__webglInit=!0,x.addEventListener("dispose",P));let W=x.source,$=f.get(W);$===void 0&&($={},f.set(W,$));let lt=V(x);if(lt!==R.__cacheKey){$[lt]===void 0&&($[lt]={texture:s.createTexture(),usedTimes:0},a.memory.textures++,z=!0),$[lt].usedTimes++;let ut=$[R.__cacheKey];ut!==void 0&&($[R.__cacheKey].usedTimes--,ut.usedTimes===0&&I(x)),R.__cacheKey=lt,R.__webglTexture=$[lt].texture}return z}function Y(R,x,z){return Math.floor(Math.floor(R/z)/x)}function tt(R,x,z,W){let lt=R.updateRanges;if(lt.length===0)e.texSubImage2D(s.TEXTURE_2D,0,0,0,x.width,x.height,z,W,x.data);else{lt.sort((Dt,_t)=>Dt.start-_t.start);let ut=0;for(let Dt=1;Dt<lt.length;Dt++){let _t=lt[ut],pt=lt[Dt],Nt=_t.start+_t.count,zt=Y(pt.start,x.width,4),qt=Y(_t.start,x.width,4);pt.start<=Nt+1&&zt===qt&&Y(pt.start+pt.count-1,x.width,4)===zt?_t.count=Math.max(_t.count,pt.start+pt.count-_t.start):(++ut,lt[ut]=pt)}lt.length=ut+1;let Z=e.getParameter(s.UNPACK_ROW_LENGTH),nt=e.getParameter(s.UNPACK_SKIP_PIXELS),ft=e.getParameter(s.UNPACK_SKIP_ROWS);e.pixelStorei(s.UNPACK_ROW_LENGTH,x.width);for(let Dt=0,_t=lt.length;Dt<_t;Dt++){let pt=lt[Dt],Nt=Math.floor(pt.start/4),zt=Math.ceil(pt.count/4),qt=Nt%x.width,O=Math.floor(Nt/x.width),mt=zt,J=1;e.pixelStorei(s.UNPACK_SKIP_PIXELS,qt),e.pixelStorei(s.UNPACK_SKIP_ROWS,O),e.texSubImage2D(s.TEXTURE_2D,0,qt,O,mt,J,z,W,x.data)}R.clearUpdateRanges(),e.pixelStorei(s.UNPACK_ROW_LENGTH,Z),e.pixelStorei(s.UNPACK_SKIP_PIXELS,nt),e.pixelStorei(s.UNPACK_SKIP_ROWS,ft)}}function xt(R,x,z){let W=s.TEXTURE_2D;(x.isDataArrayTexture||x.isCompressedArrayTexture)&&(W=s.TEXTURE_2D_ARRAY),x.isData3DTexture&&(W=s.TEXTURE_3D);let $=ee(R,x),lt=x.source;e.bindTexture(W,R.__webglTexture,s.TEXTURE0+z);let ut=n.get(lt);if(lt.version!==ut.__version||$===!0){if(e.activeTexture(s.TEXTURE0+z),(typeof ImageBitmap<"u"&&x.image instanceof ImageBitmap)===!1){let J=Qt.getPrimaries(Qt.workingColorSpace),gt=x.colorSpace===mi?null:Qt.getPrimaries(x.colorSpace),bt=x.colorSpace===mi||J===gt?s.NONE:s.BROWSER_DEFAULT_WEBGL;e.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,x.flipY),e.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),e.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,bt)}e.pixelStorei(s.UNPACK_ALIGNMENT,x.unpackAlignment);let nt=p(x.image,!1,i.maxTextureSize);nt=he(x,nt);let ft=r.convert(x.format,x.colorSpace),Dt=r.convert(x.type),_t=y(x.internalFormat,ft,Dt,x.normalized,x.colorSpace,x.isVideoTexture);Yt(W,x);let pt,Nt=x.mipmaps,zt=x.isVideoTexture!==!0,qt=ut.__version===void 0||$===!0,O=lt.dataReady,mt=T(x,nt);if(x.isDepthTexture)_t=b(x.format===Bi,x.type),qt&&(zt?e.texStorage2D(s.TEXTURE_2D,1,_t,nt.width,nt.height):e.texImage2D(s.TEXTURE_2D,0,_t,nt.width,nt.height,0,ft,Dt,null));else if(x.isDataTexture)if(Nt.length>0){zt&&qt&&e.texStorage2D(s.TEXTURE_2D,mt,_t,Nt[0].width,Nt[0].height);for(let J=0,gt=Nt.length;J<gt;J++)pt=Nt[J],zt?O&&e.texSubImage2D(s.TEXTURE_2D,J,0,0,pt.width,pt.height,ft,Dt,pt.data):e.texImage2D(s.TEXTURE_2D,J,_t,pt.width,pt.height,0,ft,Dt,pt.data);x.generateMipmaps=!1}else zt?(qt&&e.texStorage2D(s.TEXTURE_2D,mt,_t,nt.width,nt.height),O&&tt(x,nt,ft,Dt)):e.texImage2D(s.TEXTURE_2D,0,_t,nt.width,nt.height,0,ft,Dt,nt.data);else if(x.isCompressedTexture)if(x.isCompressedArrayTexture){zt&&qt&&e.texStorage3D(s.TEXTURE_2D_ARRAY,mt,_t,Nt[0].width,Nt[0].height,nt.depth);for(let J=0,gt=Nt.length;J<gt;J++)if(pt=Nt[J],x.format!==Rn)if(ft!==null)if(zt){if(O)if(x.layerUpdates.size>0){let bt=Zh(pt.width,pt.height,x.format,x.type);for(let st of x.layerUpdates){let Ut=pt.data.subarray(st*bt/pt.data.BYTES_PER_ELEMENT,(st+1)*bt/pt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,J,0,0,st,pt.width,pt.height,1,ft,Ut)}}else e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,J,0,0,0,pt.width,pt.height,nt.depth,ft,pt.data)}else e.compressedTexImage3D(s.TEXTURE_2D_ARRAY,J,_t,pt.width,pt.height,nt.depth,0,pt.data,0,0);else kt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else zt?O&&e.texSubImage3D(s.TEXTURE_2D_ARRAY,J,0,0,0,pt.width,pt.height,nt.depth,ft,Dt,pt.data):e.texImage3D(s.TEXTURE_2D_ARRAY,J,_t,pt.width,pt.height,nt.depth,0,ft,Dt,pt.data);x.layerUpdates.size>0&&x.clearLayerUpdates()}else{zt&&qt&&e.texStorage2D(s.TEXTURE_2D,mt,_t,Nt[0].width,Nt[0].height);for(let J=0,gt=Nt.length;J<gt;J++)pt=Nt[J],x.format!==Rn?ft!==null?zt?O&&e.compressedTexSubImage2D(s.TEXTURE_2D,J,0,0,pt.width,pt.height,ft,pt.data):e.compressedTexImage2D(s.TEXTURE_2D,J,_t,pt.width,pt.height,0,pt.data):kt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):zt?O&&e.texSubImage2D(s.TEXTURE_2D,J,0,0,pt.width,pt.height,ft,Dt,pt.data):e.texImage2D(s.TEXTURE_2D,J,_t,pt.width,pt.height,0,ft,Dt,pt.data)}else if(x.isDataArrayTexture)if(zt){if(qt&&e.texStorage3D(s.TEXTURE_2D_ARRAY,mt,_t,nt.width,nt.height,nt.depth),O)if(x.layerUpdates.size>0){let J=Zh(nt.width,nt.height,x.format,x.type);for(let gt of x.layerUpdates){let bt=nt.data.subarray(gt*J/nt.data.BYTES_PER_ELEMENT,(gt+1)*J/nt.data.BYTES_PER_ELEMENT);e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,gt,nt.width,nt.height,1,ft,Dt,bt)}x.clearLayerUpdates()}else e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,nt.width,nt.height,nt.depth,ft,Dt,nt.data)}else e.texImage3D(s.TEXTURE_2D_ARRAY,0,_t,nt.width,nt.height,nt.depth,0,ft,Dt,nt.data);else if(x.isData3DTexture)zt?(qt&&e.texStorage3D(s.TEXTURE_3D,mt,_t,nt.width,nt.height,nt.depth),O&&e.texSubImage3D(s.TEXTURE_3D,0,0,0,0,nt.width,nt.height,nt.depth,ft,Dt,nt.data)):e.texImage3D(s.TEXTURE_3D,0,_t,nt.width,nt.height,nt.depth,0,ft,Dt,nt.data);else if(x.isFramebufferTexture){if(qt)if(zt)e.texStorage2D(s.TEXTURE_2D,mt,_t,nt.width,nt.height);else{let J=nt.width,gt=nt.height;for(let bt=0;bt<mt;bt++)e.texImage2D(s.TEXTURE_2D,bt,_t,J,gt,0,ft,Dt,null),J>>=1,gt>>=1}}else if(x.isHTMLTexture){if("texElementImage2D"in s){let J=s.canvas;if(J.hasAttribute("layoutsubtree")||J.setAttribute("layoutsubtree","true"),nt.parentNode!==J){J.appendChild(nt),d.add(x),J.onpaint=gt=>{let bt=gt.changedElements;for(let st of d)bt.includes(st.image)&&(st.needsUpdate=!0)},J.requestPaint();return}if(s.texElementImage2D.length===3)s.texElementImage2D(s.TEXTURE_2D,s.RGBA8,nt);else{let bt=s.RGBA,st=s.RGBA,Ut=s.UNSIGNED_BYTE;s.texElementImage2D(s.TEXTURE_2D,0,bt,st,Ut,nt)}s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MIN_FILTER,s.LINEAR),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE)}}else if(Nt.length>0){if(zt&&qt){let J=jt(Nt[0]);e.texStorage2D(s.TEXTURE_2D,mt,_t,J.width,J.height)}for(let J=0,gt=Nt.length;J<gt;J++)pt=Nt[J],zt?O&&e.texSubImage2D(s.TEXTURE_2D,J,0,0,ft,Dt,pt):e.texImage2D(s.TEXTURE_2D,J,_t,ft,Dt,pt);x.generateMipmaps=!1}else if(zt){if(qt){let J=jt(nt);e.texStorage2D(s.TEXTURE_2D,mt,_t,J.width,J.height)}O&&e.texSubImage2D(s.TEXTURE_2D,0,0,0,ft,Dt,nt)}else e.texImage2D(s.TEXTURE_2D,0,_t,ft,Dt,nt);g(x)&&M(W),ut.__version=lt.version,x.onUpdate&&x.onUpdate(x)}R.__version=x.version}function Ot(R,x,z){if(x.image.length!==6)return;let W=ee(R,x),$=x.source;e.bindTexture(s.TEXTURE_CUBE_MAP,R.__webglTexture,s.TEXTURE0+z);let lt=n.get($);if($.version!==lt.__version||W===!0){e.activeTexture(s.TEXTURE0+z);let ut=Qt.getPrimaries(Qt.workingColorSpace),Z=x.colorSpace===mi?null:Qt.getPrimaries(x.colorSpace),nt=x.colorSpace===mi||ut===Z?s.NONE:s.BROWSER_DEFAULT_WEBGL;e.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,x.flipY),e.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),e.pixelStorei(s.UNPACK_ALIGNMENT,x.unpackAlignment),e.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,nt);let ft=x.isCompressedTexture||x.image[0].isCompressedTexture,Dt=x.image[0]&&x.image[0].isDataTexture,_t=[];for(let st=0;st<6;st++)!ft&&!Dt?_t[st]=p(x.image[st],!0,i.maxCubemapSize):_t[st]=Dt?x.image[st].image:x.image[st],_t[st]=he(x,_t[st]);let pt=_t[0],Nt=r.convert(x.format,x.colorSpace),zt=r.convert(x.type),qt=y(x.internalFormat,Nt,zt,x.normalized,x.colorSpace),O=x.isVideoTexture!==!0,mt=lt.__version===void 0||W===!0,J=$.dataReady,gt=T(x,pt);Yt(s.TEXTURE_CUBE_MAP,x);let bt;if(ft){O&&mt&&e.texStorage2D(s.TEXTURE_CUBE_MAP,gt,qt,pt.width,pt.height);for(let st=0;st<6;st++){bt=_t[st].mipmaps;for(let Ut=0;Ut<bt.length;Ut++){let It=bt[Ut];x.format!==Rn?Nt!==null?O?J&&e.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+st,Ut,0,0,It.width,It.height,Nt,It.data):e.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+st,Ut,qt,It.width,It.height,0,It.data):kt("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):O?J&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+st,Ut,0,0,It.width,It.height,Nt,zt,It.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+st,Ut,qt,It.width,It.height,0,Nt,zt,It.data)}}}else{if(bt=x.mipmaps,O&&mt){bt.length>0&&gt++;let st=jt(_t[0]);e.texStorage2D(s.TEXTURE_CUBE_MAP,gt,qt,st.width,st.height)}for(let st=0;st<6;st++)if(Dt){O?J&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+st,0,0,0,_t[st].width,_t[st].height,Nt,zt,_t[st].data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+st,0,qt,_t[st].width,_t[st].height,0,Nt,zt,_t[st].data);for(let Ut=0;Ut<bt.length;Ut++){let ge=bt[Ut].image[st].image;O?J&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+st,Ut+1,0,0,ge.width,ge.height,Nt,zt,ge.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+st,Ut+1,qt,ge.width,ge.height,0,Nt,zt,ge.data)}}else{O?J&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+st,0,0,0,Nt,zt,_t[st]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+st,0,qt,Nt,zt,_t[st]);for(let Ut=0;Ut<bt.length;Ut++){let It=bt[Ut];O?J&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+st,Ut+1,0,0,Nt,zt,It.image[st]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+st,Ut+1,qt,Nt,zt,It.image[st])}}}g(x)&&M(s.TEXTURE_CUBE_MAP),lt.__version=$.version,x.onUpdate&&x.onUpdate(x)}R.__version=x.version}function Tt(R,x,z,W,$,lt){let ut=r.convert(z.format,z.colorSpace),Z=r.convert(z.type),nt=y(z.internalFormat,ut,Z,z.normalized,z.colorSpace),ft=n.get(x),Dt=n.get(z);if(Dt.__renderTarget=x,!ft.__hasExternalTextures){let _t=Math.max(1,x.width>>lt),pt=Math.max(1,x.height>>lt);$===s.TEXTURE_3D||$===s.TEXTURE_2D_ARRAY?e.texImage3D($,lt,nt,_t,pt,x.depth,0,ut,Z,null):e.texImage2D($,lt,nt,_t,pt,0,ut,Z,null)}e.bindFramebuffer(s.FRAMEBUFFER,R),Xt(x)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,W,$,Dt.__webglTexture,0,Gt(x)):($===s.TEXTURE_2D||$>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&$<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,W,$,Dt.__webglTexture,lt),e.bindFramebuffer(s.FRAMEBUFFER,null)}function Vt(R,x,z){if(s.bindRenderbuffer(s.RENDERBUFFER,R),x.depthBuffer){let W=x.depthTexture,$=W&&W.isDepthTexture?W.type:null,lt=b(x.stencilBuffer,$),ut=x.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;Xt(x)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,Gt(x),lt,x.width,x.height):z?s.renderbufferStorageMultisample(s.RENDERBUFFER,Gt(x),lt,x.width,x.height):s.renderbufferStorage(s.RENDERBUFFER,lt,x.width,x.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,ut,s.RENDERBUFFER,R)}else{let W=x.textures;for(let $=0;$<W.length;$++){let lt=W[$],ut=r.convert(lt.format,lt.colorSpace),Z=r.convert(lt.type),nt=y(lt.internalFormat,ut,Z,lt.normalized,lt.colorSpace);Xt(x)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,Gt(x),nt,x.width,x.height):z?s.renderbufferStorageMultisample(s.RENDERBUFFER,Gt(x),nt,x.width,x.height):s.renderbufferStorage(s.RENDERBUFFER,nt,x.width,x.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function le(R,x,z){let W=x.isWebGLCubeRenderTarget===!0;if(e.bindFramebuffer(s.FRAMEBUFFER,R),!(x.depthTexture&&x.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let $=n.get(x.depthTexture);if($.__renderTarget=x,(!$.__webglTexture||x.depthTexture.image.width!==x.width||x.depthTexture.image.height!==x.height)&&(x.depthTexture.image.width=x.width,x.depthTexture.image.height=x.height,x.depthTexture.needsUpdate=!0),W){if($.__webglInit===void 0&&($.__webglInit=!0,x.depthTexture.addEventListener("dispose",P)),$.__webglTexture===void 0){$.__webglTexture=s.createTexture(),e.bindTexture(s.TEXTURE_CUBE_MAP,$.__webglTexture),Yt(s.TEXTURE_CUBE_MAP,x.depthTexture);let ft=r.convert(x.depthTexture.format),Dt=r.convert(x.depthTexture.type),_t;x.depthTexture.format===jn?_t=s.DEPTH_COMPONENT24:x.depthTexture.format===Bi&&(_t=s.DEPTH24_STENCIL8);for(let pt=0;pt<6;pt++)s.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+pt,0,_t,x.width,x.height,0,ft,Dt,null)}}else Q(x.depthTexture,0);let lt=$.__webglTexture,ut=Gt(x),Z=W?s.TEXTURE_CUBE_MAP_POSITIVE_X+z:s.TEXTURE_2D,nt=x.depthTexture.format===Bi?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;if(x.depthTexture.format===jn)Xt(x)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,nt,Z,lt,0,ut):s.framebufferTexture2D(s.FRAMEBUFFER,nt,Z,lt,0);else if(x.depthTexture.format===Bi)Xt(x)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,nt,Z,lt,0,ut):s.framebufferTexture2D(s.FRAMEBUFFER,nt,Z,lt,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function et(R){let x=n.get(R),z=R.isWebGLCubeRenderTarget===!0;if(x.__boundDepthTexture!==R.depthTexture){let W=R.depthTexture;if(x.__depthDisposeCallback&&x.__depthDisposeCallback(),W){let $=()=>{delete x.__boundDepthTexture,delete x.__depthDisposeCallback,W.removeEventListener("dispose",$)};W.addEventListener("dispose",$),x.__depthDisposeCallback=$}x.__boundDepthTexture=W}if(R.depthTexture&&!x.__autoAllocateDepthBuffer)if(z)for(let W=0;W<6;W++)le(x.__webglFramebuffer[W],R,W);else{let W=R.texture.mipmaps;W&&W.length>0?le(x.__webglFramebuffer[0],R,0):le(x.__webglFramebuffer,R,0)}else if(z){x.__webglDepthbuffer=[];for(let W=0;W<6;W++)if(e.bindFramebuffer(s.FRAMEBUFFER,x.__webglFramebuffer[W]),x.__webglDepthbuffer[W]===void 0)x.__webglDepthbuffer[W]=s.createRenderbuffer(),Vt(x.__webglDepthbuffer[W],R,!1);else{let $=R.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,lt=x.__webglDepthbuffer[W];s.bindRenderbuffer(s.RENDERBUFFER,lt),s.framebufferRenderbuffer(s.FRAMEBUFFER,$,s.RENDERBUFFER,lt)}}else{let W=R.texture.mipmaps;if(W&&W.length>0?e.bindFramebuffer(s.FRAMEBUFFER,x.__webglFramebuffer[0]):e.bindFramebuffer(s.FRAMEBUFFER,x.__webglFramebuffer),x.__webglDepthbuffer===void 0)x.__webglDepthbuffer=s.createRenderbuffer(),Vt(x.__webglDepthbuffer,R,!1);else{let $=R.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,lt=x.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,lt),s.framebufferRenderbuffer(s.FRAMEBUFFER,$,s.RENDERBUFFER,lt)}}e.bindFramebuffer(s.FRAMEBUFFER,null)}function rt(R,x,z){let W=n.get(R);x!==void 0&&Tt(W.__webglFramebuffer,R,R.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),z!==void 0&&et(R)}function at(R){let x=R.texture,z=n.get(R),W=n.get(x);R.addEventListener("dispose",_);let $=R.textures,lt=R.isWebGLCubeRenderTarget===!0,ut=$.length>1;if(ut||(W.__webglTexture===void 0&&(W.__webglTexture=s.createTexture()),W.__version=x.version,a.memory.textures++),lt){z.__webglFramebuffer=[];for(let Z=0;Z<6;Z++)if(x.mipmaps&&x.mipmaps.length>0){z.__webglFramebuffer[Z]=[];for(let nt=0;nt<x.mipmaps.length;nt++)z.__webglFramebuffer[Z][nt]=s.createFramebuffer()}else z.__webglFramebuffer[Z]=s.createFramebuffer()}else{if(x.mipmaps&&x.mipmaps.length>0){z.__webglFramebuffer=[];for(let Z=0;Z<x.mipmaps.length;Z++)z.__webglFramebuffer[Z]=s.createFramebuffer()}else z.__webglFramebuffer=s.createFramebuffer();if(ut)for(let Z=0,nt=$.length;Z<nt;Z++){let ft=n.get($[Z]);ft.__webglTexture===void 0&&(ft.__webglTexture=s.createTexture(),a.memory.textures++)}if(R.samples>0&&Xt(R)===!1){z.__webglMultisampledFramebuffer=s.createFramebuffer(),z.__webglColorRenderbuffer=[],e.bindFramebuffer(s.FRAMEBUFFER,z.__webglMultisampledFramebuffer);for(let Z=0;Z<$.length;Z++){let nt=$[Z];z.__webglColorRenderbuffer[Z]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,z.__webglColorRenderbuffer[Z]);let ft=r.convert(nt.format,nt.colorSpace),Dt=r.convert(nt.type),_t=y(nt.internalFormat,ft,Dt,nt.normalized,nt.colorSpace,R.isXRRenderTarget===!0),pt=Gt(R);s.renderbufferStorageMultisample(s.RENDERBUFFER,pt,_t,R.width,R.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Z,s.RENDERBUFFER,z.__webglColorRenderbuffer[Z])}s.bindRenderbuffer(s.RENDERBUFFER,null),R.depthBuffer&&(z.__webglDepthRenderbuffer=s.createRenderbuffer(),Vt(z.__webglDepthRenderbuffer,R,!0)),e.bindFramebuffer(s.FRAMEBUFFER,null)}}if(lt){e.bindTexture(s.TEXTURE_CUBE_MAP,W.__webglTexture),Yt(s.TEXTURE_CUBE_MAP,x);for(let Z=0;Z<6;Z++)if(x.mipmaps&&x.mipmaps.length>0)for(let nt=0;nt<x.mipmaps.length;nt++)Tt(z.__webglFramebuffer[Z][nt],R,x,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+Z,nt);else Tt(z.__webglFramebuffer[Z],R,x,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0);g(x)&&M(s.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(ut){for(let Z=0,nt=$.length;Z<nt;Z++){let ft=$[Z],Dt=n.get(ft),_t=s.TEXTURE_2D;(R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(_t=R.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),e.bindTexture(_t,Dt.__webglTexture),Yt(_t,ft),Tt(z.__webglFramebuffer,R,ft,s.COLOR_ATTACHMENT0+Z,_t,0),g(ft)&&M(_t)}e.unbindTexture()}else{let Z=s.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(Z=R.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),e.bindTexture(Z,W.__webglTexture),Yt(Z,x),x.mipmaps&&x.mipmaps.length>0)for(let nt=0;nt<x.mipmaps.length;nt++)Tt(z.__webglFramebuffer[nt],R,x,s.COLOR_ATTACHMENT0,Z,nt);else Tt(z.__webglFramebuffer,R,x,s.COLOR_ATTACHMENT0,Z,0);g(x)&&M(Z),e.unbindTexture()}R.depthBuffer&&et(R)}function ot(R){let x=R.textures;for(let z=0,W=x.length;z<W;z++){let $=x[z];if(g($)){let lt=w(R),ut=n.get($).__webglTexture;e.bindTexture(lt,ut),M(lt),e.unbindTexture()}}}let ct=[],Bt=[];function Ft(R){if(R.samples>0){if(Xt(R)===!1){let x=R.textures,z=R.width,W=R.height,$=s.COLOR_BUFFER_BIT,lt=R.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,ut=n.get(R),Z=x.length>1;if(Z)for(let ft=0;ft<x.length;ft++)e.bindFramebuffer(s.FRAMEBUFFER,ut.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+ft,s.RENDERBUFFER,null),e.bindFramebuffer(s.FRAMEBUFFER,ut.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+ft,s.TEXTURE_2D,null,0);e.bindFramebuffer(s.READ_FRAMEBUFFER,ut.__webglMultisampledFramebuffer);let nt=R.texture.mipmaps;nt&&nt.length>0?e.bindFramebuffer(s.DRAW_FRAMEBUFFER,ut.__webglFramebuffer[0]):e.bindFramebuffer(s.DRAW_FRAMEBUFFER,ut.__webglFramebuffer);for(let ft=0;ft<x.length;ft++){if(R.resolveDepthBuffer&&(R.depthBuffer&&($|=s.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&($|=s.STENCIL_BUFFER_BIT)),Z){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,ut.__webglColorRenderbuffer[ft]);let Dt=n.get(x[ft]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,Dt,0)}s.blitFramebuffer(0,0,z,W,0,0,z,W,$,s.NEAREST),l===!0&&(ct.length=0,Bt.length=0,ct.push(s.COLOR_ATTACHMENT0+ft),R.depthBuffer&&R.storeMultisampledDepthBuffer===!1&&(ct.push(lt),Bt.push(lt),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,Bt)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,ct))}if(e.bindFramebuffer(s.READ_FRAMEBUFFER,null),e.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),Z)for(let ft=0;ft<x.length;ft++){e.bindFramebuffer(s.FRAMEBUFFER,ut.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+ft,s.RENDERBUFFER,ut.__webglColorRenderbuffer[ft]);let Dt=n.get(x[ft]).__webglTexture;e.bindFramebuffer(s.FRAMEBUFFER,ut.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+ft,s.TEXTURE_2D,Dt,0)}e.bindFramebuffer(s.DRAW_FRAMEBUFFER,ut.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.storeMultisampledDepthBuffer===!1&&l){let x=R.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[x])}}}function Gt(R){return Math.min(i.maxSamples,R.samples)}function Xt(R){let x=n.get(R);return R.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&x.__useRenderToTexture!==!1}function N(R){let x=a.render.frame;h.get(R)!==x&&(h.set(R,x),R.update())}function he(R,x){let z=R.colorSpace,W=R.format,$=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||z!==Br&&z!==mi&&(Qt.getTransfer(z)===oe?(W!==Rn||$!==fn)&&kt("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Ht("WebGLTextures: Unsupported texture color space:",z)),x}function jt(R){return typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement?(c.width=R.naturalWidth||R.width,c.height=R.naturalHeight||R.height):typeof VideoFrame<"u"&&R instanceof VideoFrame?(c.width=R.displayWidth,c.height=R.displayHeight):(c.width=R.width,c.height=R.height),c}this.allocateTextureUnit=k,this.resetTextureUnits=D,this.getTextureUnits=C,this.setTextureUnits=B,this.setTexture2D=Q,this.setTexture2DArray=q,this.setTexture3D=K,this.setTextureCube=j,this.rebindTextures=rt,this.setupRenderTarget=at,this.updateRenderTargetMipmap=ot,this.updateMultisampleRenderTarget=Ft,this.setupDepthRenderbuffer=et,this.setupFrameBufferTexture=Tt,this.useMultisampledRTT=Xt,this.isReversedDepthBuffer=function(){return e.buffers.depth.getReversed()}}function cy(s,t){function e(n,i=mi){let r,a=Qt.getTransfer(i);if(n===fn)return s.UNSIGNED_BYTE;if(n===bl)return s.UNSIGNED_SHORT_4_4_4_4;if(n===Tl)return s.UNSIGNED_SHORT_5_5_5_1;if(n===Bh)return s.UNSIGNED_INT_5_9_9_9_REV;if(n===zh)return s.UNSIGNED_INT_10F_11F_11F_REV;if(n===Fh)return s.BYTE;if(n===Oh)return s.SHORT;if(n===Ks)return s.UNSIGNED_SHORT;if(n===Sl)return s.INT;if(n===Hn)return s.UNSIGNED_INT;if(n===An)return s.FLOAT;if(n===Ze)return s.HALF_FLOAT;if(n===kh)return s.ALPHA;if(n===Vh)return s.RGB;if(n===Rn)return s.RGBA;if(n===jn)return s.DEPTH_COMPONENT;if(n===Bi)return s.DEPTH_STENCIL;if(n===wl)return s.RED;if(n===El)return s.RED_INTEGER;if(n===zi)return s.RG;if(n===Al)return s.RG_INTEGER;if(n===Rl)return s.RGBA_INTEGER;if(n===Pa||n===Ia||n===La||n===Da)if(a===oe)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Pa)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Ia)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===La)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Da)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Pa)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Ia)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===La)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Da)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Cl||n===Pl||n===Il||n===Ll)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Cl)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Pl)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Il)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Ll)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Dl||n===Nl||n===Ul||n===Fl||n===Ol||n===Na||n===Bl)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Dl||n===Nl)return a===oe?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Ul)return a===oe?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===Fl)return r.COMPRESSED_R11_EAC;if(n===Ol)return r.COMPRESSED_SIGNED_R11_EAC;if(n===Na)return r.COMPRESSED_RG11_EAC;if(n===Bl)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===zl||n===kl||n===Vl||n===Hl||n===Gl||n===Wl||n===Xl||n===ql||n===Yl||n===$l||n===Zl||n===Jl||n===Kl||n===Ql)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===zl)return a===oe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===kl)return a===oe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Vl)return a===oe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Hl)return a===oe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Gl)return a===oe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Wl)return a===oe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Xl)return a===oe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===ql)return a===oe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Yl)return a===oe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===$l)return a===oe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Zl)return a===oe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Jl)return a===oe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Kl)return a===oe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Ql)return a===oe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===jl||n===tc||n===ec)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===jl)return a===oe?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===tc)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===ec)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===nc||n===ic||n===Ua||n===sc)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===nc)return r.COMPRESSED_RED_RGTC1_EXT;if(n===ic)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Ua)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===sc)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Qs?s.UNSIGNED_INT_24_8:s[n]!==void 0?s[n]:null}return{convert:e}}var hy=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,uy=`
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

}`,pu=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){let n=new ta(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){let e=t.cameras[0].viewport,n=new we({vertexShader:hy,fragmentShader:uy,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new wt(new un(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},mu=class extends ti{constructor(t,e){super();let n=this,i=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,d=null,u=null,f=null,m=null,v=typeof XRWebGLBinding<"u",p=new pu,g={},M=e.getContextAttributes(),w=null,y=null,b=[],T=[],P=new it,_=null,A=null,I=new Xe;I.viewport=new Ae;let L=new Xe;L.viewport=new Ae;let U=[I,L],D=new gl,C=null,B=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let tt=b[Y];return tt===void 0&&(tt=new Vs,b[Y]=tt),tt.getTargetRaySpace()},this.getControllerGrip=function(Y){let tt=b[Y];return tt===void 0&&(tt=new Vs,b[Y]=tt),tt.getGripSpace()},this.getHand=function(Y){let tt=b[Y];return tt===void 0&&(tt=new Vs,b[Y]=tt),tt.getHandSpace()};function k(Y){let tt=T.indexOf(Y.inputSource);if(tt===-1)return;let xt=b[tt];xt!==void 0&&(xt.update(Y.inputSource,Y.frame,c||a),xt.dispatchEvent({type:Y.type,data:Y.inputSource}))}function V(){i.removeEventListener("select",k),i.removeEventListener("selectstart",k),i.removeEventListener("selectend",k),i.removeEventListener("squeeze",k),i.removeEventListener("squeezestart",k),i.removeEventListener("squeezeend",k),i.removeEventListener("end",V),i.removeEventListener("inputsourceschange",Q);for(let Y=0;Y<b.length;Y++){let tt=T[Y];tt!==null&&(T[Y]=null,b[Y].disconnect(tt))}C=null,B=null,p.reset();for(let Y in g)delete g[Y];if(t.setRenderTarget(w),f=null,u=null,d=null,i=null,y=null,ee.stop(),n.isPresenting=!1,t.setPixelRatio(_),t.setSize(P.width,P.height,!1),A!==null){let Y=A.camera;Y.fov=A.fov,Y.zoom=A.zoom,Y.updateProjectionMatrix(),A=null}n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){r=Y,n.isPresenting===!0&&kt("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){o=Y,n.isPresenting===!0&&kt("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(Y){c=Y},this.getBaseLayer=function(){return u!==null?u:f},this.getBinding=function(){return d===null&&v&&(d=new XRWebGLBinding(i,e)),d},this.getFrame=function(){return m},this.getSession=function(){return i},this.setSession=async function(Y){if(i=Y,i!==null){if(w=t.getRenderTarget(),i.addEventListener("select",k),i.addEventListener("selectstart",k),i.addEventListener("selectend",k),i.addEventListener("squeeze",k),i.addEventListener("squeezestart",k),i.addEventListener("squeezeend",k),i.addEventListener("end",V),i.addEventListener("inputsourceschange",Q),M.xrCompatible!==!0&&await e.makeXRCompatible(),_=t.getPixelRatio(),t.getSize(P),v&&"createProjectionLayer"in XRWebGLBinding.prototype){let xt=null,Ot=null,Tt=null;M.depth&&(Tt=M.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,xt=M.stencil?Bi:jn,Ot=M.stencil?Qs:Hn);let Vt={colorFormat:e.RGBA8,depthFormat:Tt,scaleFactor:r};d=this.getBinding(),u=d.createProjectionLayer(Vt),i.updateRenderState({layers:[u]}),t.setPixelRatio(1),t.setSize(u.textureWidth,u.textureHeight,!1),y=new Fe(u.textureWidth,u.textureHeight,{format:Rn,type:fn,depthTexture:new Ci(u.textureWidth,u.textureHeight,Ot,void 0,void 0,void 0,void 0,void 0,void 0,xt),stencilBuffer:M.stencil,colorSpace:t.outputColorSpace,samples:M.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1,storeMultisampledDepthBuffer:u.ignoreDepthValues===!1,storeMultisampledStencilBuffer:u.ignoreDepthValues===!1})}else{let xt={antialias:M.antialias,alpha:!0,depth:M.depth,stencil:M.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(i,e,xt),i.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),y=new Fe(f.framebufferWidth,f.framebufferHeight,{format:Rn,type:fn,colorSpace:t.outputColorSpace,stencilBuffer:M.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await i.requestReferenceSpace(o),ee.setContext(i),ee.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return p.getDepthTexture()};function Q(Y){for(let tt=0;tt<Y.removed.length;tt++){let xt=Y.removed[tt],Ot=T.indexOf(xt);Ot>=0&&(T[Ot]=null,b[Ot].disconnect(xt))}for(let tt=0;tt<Y.added.length;tt++){let xt=Y.added[tt],Ot=T.indexOf(xt);if(Ot===-1){for(let Vt=0;Vt<b.length;Vt++)if(Vt>=T.length){T.push(xt),Ot=Vt;break}else if(T[Vt]===null){T[Vt]=xt,Ot=Vt;break}if(Ot===-1)break}let Tt=b[Ot];Tt&&Tt.connect(xt)}}let q=new E,K=new E;function j(Y,tt,xt){q.setFromMatrixPosition(tt.matrixWorld),K.setFromMatrixPosition(xt.matrixWorld);let Ot=q.distanceTo(K),Tt=tt.projectionMatrix.elements,Vt=xt.projectionMatrix.elements,le=Tt[14]/(Tt[10]-1),et=Tt[14]/(Tt[10]+1),rt=(Tt[9]+1)/Tt[5],at=(Tt[9]-1)/Tt[5],ot=(Tt[8]-1)/Tt[0],ct=(Vt[8]+1)/Vt[0],Bt=le*ot,Ft=le*ct,Gt=Ot/(-ot+ct),Xt=Gt*-ot;if(tt.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX(Xt),Y.translateZ(Gt),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert(),Tt[10]===-1)Y.projectionMatrix.copy(tt.projectionMatrix),Y.projectionMatrixInverse.copy(tt.projectionMatrixInverse);else{let N=le+Gt,he=et+Gt,jt=Bt-Xt,R=Ft+(Ot-Xt),x=rt*et/he*N,z=at*et/he*N;Y.projectionMatrix.makePerspective(jt,R,x,z,N,he),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}}function Rt(Y,tt){tt===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices(tt.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(i===null)return;let tt=Y.near,xt=Y.far;p.texture!==null&&(p.depthNear>0&&(tt=p.depthNear),p.depthFar>0&&(xt=p.depthFar)),D.near=L.near=I.near=tt,D.far=L.far=I.far=xt,(C!==D.near||B!==D.far)&&(i.updateRenderState({depthNear:D.near,depthFar:D.far}),C=D.near,B=D.far),D.layers.mask=Y.layers.mask|6,I.layers.mask=D.layers.mask&-5,L.layers.mask=D.layers.mask&-3;let Ot=Y.parent,Tt=D.cameras;Rt(D,Ot);for(let Vt=0;Vt<Tt.length;Vt++)Rt(Tt[Vt],Ot);Tt.length===2?j(D,I,L):D.projectionMatrix.copy(I.projectionMatrix),A===null&&Y.isPerspectiveCamera&&(A={camera:Y,fov:Y.fov,zoom:Y.zoom}),yt(Y,D,Ot)};function yt(Y,tt,xt){xt===null?Y.matrix.copy(tt.matrixWorld):(Y.matrix.copy(xt.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(tt.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(tt.projectionMatrix),Y.projectionMatrixInverse.copy(tt.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=zs*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return D},this.getFoveation=function(){if(!(u===null&&f===null))return l},this.setFoveation=function(Y){l=Y,u!==null&&(u.fixedFoveation=Y),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=Y)},this.hasDepthSensing=function(){return p.texture!==null},this.getDepthSensingMesh=function(){return p.getMesh(D)},this.getCameraTexture=function(Y){return g[Y]};let ne=null;function Yt(Y,tt){if(h=tt.getViewerPose(c||a),m=tt,h!==null){let xt=h.views;f!==null&&(t.setRenderTargetFramebuffer(y,f.framebuffer),t.setRenderTarget(y));let Ot=!1;xt.length!==D.cameras.length&&(D.cameras.length=0,Ot=!0);for(let et=0;et<xt.length;et++){let rt=xt[et],at=null;if(f!==null)at=f.getViewport(rt);else{let ct=d.getViewSubImage(u,rt);at=ct.viewport,et===0&&(t.setRenderTargetTextures(y,ct.colorTexture,ct.depthStencilTexture),t.setRenderTarget(y))}let ot=U[et];ot===void 0&&(ot=new Xe,ot.layers.enable(et),ot.viewport=new Ae,U[et]=ot),ot.matrix.fromArray(rt.transform.matrix),ot.matrix.decompose(ot.position,ot.quaternion,ot.scale),ot.projectionMatrix.fromArray(rt.projectionMatrix),ot.projectionMatrixInverse.copy(ot.projectionMatrix).invert(),ot.viewport.set(at.x,at.y,at.width,at.height),et===0&&(D.matrix.copy(ot.matrix),D.matrix.decompose(D.position,D.quaternion,D.scale)),Ot===!0&&D.cameras.push(ot)}let Tt=i.enabledFeatures;if(Tt&&Tt.includes("depth-sensing")&&i.depthUsage=="gpu-optimized"&&v){d=n.getBinding();let et=d.getDepthInformation(xt[0]);et&&et.isValid&&et.texture&&p.init(et,i.renderState)}if(Tt&&Tt.includes("camera-access")&&v){t.state.unbindTexture(),d=n.getBinding();for(let et=0;et<xt.length;et++){let rt=xt[et].camera;if(rt){let at=g[rt];at||(at=new ta,g[rt]=at);let ot=d.getCameraImage(rt);at.sourceTexture=ot}}}}for(let xt=0;xt<b.length;xt++){let Ot=T[xt],Tt=b[xt];Ot!==null&&Tt!==void 0&&Tt.update(Ot,tt,c||a)}ne&&ne(Y,tt),tt.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:tt}),m=null}let ee=new Of;ee.setAnimationLoop(Yt),this.setAnimationLoop=function(Y){ne=Y},this.dispose=function(){}}},dy=new ce,Gf=new Wt;Gf.set(-1,0,0,0,1,0,0,0,1);function fy(s,t){function e(p,g){p.matrixAutoUpdate===!0&&p.updateMatrix(),g.value.copy(p.matrix)}function n(p,g){g.color.getRGB(p.fogColor.value,qh(s)),g.isFog?(p.fogNear.value=g.near,p.fogFar.value=g.far):g.isFogExp2&&(p.fogDensity.value=g.density)}function i(p,g,M,w,y){g.isNodeMaterial?g.uniformsNeedUpdate=!1:g.isMeshBasicMaterial?r(p,g):g.isMeshLambertMaterial?(r(p,g),g.envMap&&(p.envMapIntensity.value=g.envMapIntensity)):g.isMeshToonMaterial?(r(p,g),d(p,g)):g.isMeshPhongMaterial?(r(p,g),h(p,g),g.envMap&&(p.envMapIntensity.value=g.envMapIntensity)):g.isMeshStandardMaterial?(r(p,g),u(p,g),g.isMeshPhysicalMaterial&&f(p,g,y)):g.isMeshMatcapMaterial?(r(p,g),m(p,g)):g.isMeshDepthMaterial?r(p,g):g.isMeshDistanceMaterial?(r(p,g),v(p,g)):g.isMeshNormalMaterial?r(p,g):g.isLineBasicMaterial?(a(p,g),g.isLineDashedMaterial&&o(p,g)):g.isPointsMaterial?l(p,g,M,w):g.isSpriteMaterial?c(p,g):g.isShadowMaterial?(p.color.value.copy(g.color),p.opacity.value=g.opacity):g.isShaderMaterial&&(g.uniformsNeedUpdate=!1)}function r(p,g){p.opacity.value=g.opacity,g.color&&p.diffuse.value.copy(g.color),g.emissive&&p.emissive.value.copy(g.emissive).multiplyScalar(g.emissiveIntensity),g.map&&(p.map.value=g.map,e(g.map,p.mapTransform)),g.alphaMap&&(p.alphaMap.value=g.alphaMap,e(g.alphaMap,p.alphaMapTransform)),g.bumpMap&&(p.bumpMap.value=g.bumpMap,e(g.bumpMap,p.bumpMapTransform),p.bumpScale.value=g.bumpScale,g.side===Be&&(p.bumpScale.value*=-1)),g.normalMap&&(p.normalMap.value=g.normalMap,e(g.normalMap,p.normalMapTransform),p.normalScale.value.copy(g.normalScale),g.side===Be&&p.normalScale.value.negate()),g.displacementMap&&(p.displacementMap.value=g.displacementMap,e(g.displacementMap,p.displacementMapTransform),p.displacementScale.value=g.displacementScale,p.displacementBias.value=g.displacementBias),g.emissiveMap&&(p.emissiveMap.value=g.emissiveMap,e(g.emissiveMap,p.emissiveMapTransform)),g.specularMap&&(p.specularMap.value=g.specularMap,e(g.specularMap,p.specularMapTransform)),g.alphaTest>0&&(p.alphaTest.value=g.alphaTest);let M=t.get(g),w=M.envMap,y=M.envMapRotation;w&&(p.envMap.value=w,p.envMapRotation.value.setFromMatrix4(dy.makeRotationFromEuler(y)).transpose(),w.isCubeTexture&&w.isRenderTargetTexture===!1&&p.envMapRotation.value.premultiply(Gf),p.reflectivity.value=g.reflectivity,p.ior.value=g.ior,p.refractionRatio.value=g.refractionRatio),g.lightMap&&(p.lightMap.value=g.lightMap,p.lightMapIntensity.value=g.lightMapIntensity,e(g.lightMap,p.lightMapTransform)),g.aoMap&&(p.aoMap.value=g.aoMap,p.aoMapIntensity.value=g.aoMapIntensity,e(g.aoMap,p.aoMapTransform))}function a(p,g){p.diffuse.value.copy(g.color),p.opacity.value=g.opacity,g.map&&(p.map.value=g.map,e(g.map,p.mapTransform))}function o(p,g){p.dashSize.value=g.dashSize,p.totalSize.value=g.dashSize+g.gapSize,p.scale.value=g.scale}function l(p,g,M,w){p.diffuse.value.copy(g.color),p.opacity.value=g.opacity,p.size.value=g.size*M,p.scale.value=w*.5,g.map&&(p.map.value=g.map,e(g.map,p.uvTransform)),g.alphaMap&&(p.alphaMap.value=g.alphaMap,e(g.alphaMap,p.alphaMapTransform)),g.alphaTest>0&&(p.alphaTest.value=g.alphaTest)}function c(p,g){p.diffuse.value.copy(g.color),p.opacity.value=g.opacity,p.rotation.value=g.rotation,g.map&&(p.map.value=g.map,e(g.map,p.mapTransform)),g.alphaMap&&(p.alphaMap.value=g.alphaMap,e(g.alphaMap,p.alphaMapTransform)),g.alphaTest>0&&(p.alphaTest.value=g.alphaTest)}function h(p,g){p.specular.value.copy(g.specular),p.shininess.value=Math.max(g.shininess,1e-4)}function d(p,g){g.gradientMap&&(p.gradientMap.value=g.gradientMap)}function u(p,g){p.metalness.value=g.metalness,g.metalnessMap&&(p.metalnessMap.value=g.metalnessMap,e(g.metalnessMap,p.metalnessMapTransform)),p.roughness.value=g.roughness,g.roughnessMap&&(p.roughnessMap.value=g.roughnessMap,e(g.roughnessMap,p.roughnessMapTransform)),g.envMap&&(p.envMapIntensity.value=g.envMapIntensity)}function f(p,g,M){p.ior.value=g.ior,g.sheen>0&&(p.sheenColor.value.copy(g.sheenColor).multiplyScalar(g.sheen),p.sheenRoughness.value=g.sheenRoughness,g.sheenColorMap&&(p.sheenColorMap.value=g.sheenColorMap,e(g.sheenColorMap,p.sheenColorMapTransform)),g.sheenRoughnessMap&&(p.sheenRoughnessMap.value=g.sheenRoughnessMap,e(g.sheenRoughnessMap,p.sheenRoughnessMapTransform))),g.clearcoat>0&&(p.clearcoat.value=g.clearcoat,p.clearcoatRoughness.value=g.clearcoatRoughness,g.clearcoatMap&&(p.clearcoatMap.value=g.clearcoatMap,e(g.clearcoatMap,p.clearcoatMapTransform)),g.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=g.clearcoatRoughnessMap,e(g.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),g.clearcoatNormalMap&&(p.clearcoatNormalMap.value=g.clearcoatNormalMap,e(g.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(g.clearcoatNormalScale),g.side===Be&&p.clearcoatNormalScale.value.negate())),g.dispersion>0&&(p.dispersion.value=g.dispersion),g.retroreflectivity>0&&(p.retroreflectivity.value=g.retroreflectivity),g.iridescence>0&&(p.iridescence.value=g.iridescence,p.iridescenceIOR.value=g.iridescenceIOR,p.iridescenceThicknessMinimum.value=g.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=g.iridescenceThicknessRange[1],g.iridescenceMap&&(p.iridescenceMap.value=g.iridescenceMap,e(g.iridescenceMap,p.iridescenceMapTransform)),g.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=g.iridescenceThicknessMap,e(g.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),g.transmission>0&&(p.transmission.value=g.transmission,p.transmissionSamplerMap.value=M.texture,p.transmissionSamplerSize.value.set(M.width,M.height),g.transmissionMap&&(p.transmissionMap.value=g.transmissionMap,e(g.transmissionMap,p.transmissionMapTransform)),p.thickness.value=g.thickness,g.thicknessMap&&(p.thicknessMap.value=g.thicknessMap,e(g.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=g.attenuationDistance,p.attenuationColor.value.copy(g.attenuationColor)),g.anisotropy>0&&(p.anisotropyVector.value.set(g.anisotropy*Math.cos(g.anisotropyRotation),g.anisotropy*Math.sin(g.anisotropyRotation)),g.anisotropyMap&&(p.anisotropyMap.value=g.anisotropyMap,e(g.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=g.specularIntensity,p.specularColor.value.copy(g.specularColor),g.specularColorMap&&(p.specularColorMap.value=g.specularColorMap,e(g.specularColorMap,p.specularColorMapTransform)),g.specularIntensityMap&&(p.specularIntensityMap.value=g.specularIntensityMap,e(g.specularIntensityMap,p.specularIntensityMapTransform))}function m(p,g){g.matcap&&(p.matcap.value=g.matcap)}function v(p,g){let M=t.get(g).light;p.referencePosition.value.setFromMatrixPosition(M.matrixWorld),p.nearDistance.value=M.shadow.camera.near,p.farDistance.value=M.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function py(s,t,e,n){let i={},r={},a=[],o=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function l(y,b){let T=b.program;n.uniformBlockBinding(y,T)}function c(y,b){let T=i[y.id];T===void 0&&(p(y),T=h(y),i[y.id]=T,y.addEventListener("dispose",M));let P=b.program;n.updateUBOMapping(y,P);let _=t.render.frame;r[y.id]!==_&&(u(y),r[y.id]=_)}function h(y){let b=d();y.__bindingPointIndex=b;let T=s.createBuffer(),P=y.__size,_=y.usage;return s.bindBuffer(s.UNIFORM_BUFFER,T),s.bufferData(s.UNIFORM_BUFFER,P,_),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,b,T),T}function d(){for(let y=0;y<o;y++)if(a.indexOf(y)===-1)return a.push(y),y;return Ht("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(y){let b=i[y.id],T=y.uniforms,P=y.__cache;s.bindBuffer(s.UNIFORM_BUFFER,b);for(let _=0,A=T.length;_<A;_++){let I=T[_];if(Array.isArray(I))for(let L=0,U=I.length;L<U;L++)f(I[L],_,L,P);else f(I,_,0,P)}s.bindBuffer(s.UNIFORM_BUFFER,null)}function f(y,b,T,P){if(v(y,b,T,P)===!0){let _=y.__offset,A=y.value;if(Array.isArray(A)){let I=0;for(let L=0;L<A.length;L++){let U=A[L],D=g(U);m(U,y.__data,I),typeof U!="number"&&typeof U!="boolean"&&!U.isMatrix3&&!ArrayBuffer.isView(U)&&(I+=D.storage/Float32Array.BYTES_PER_ELEMENT)}}else m(A,y.__data,0);s.bufferSubData(s.UNIFORM_BUFFER,_,y.__data)}}function m(y,b,T){typeof y=="number"||typeof y=="boolean"?b[0]=y:y.isMatrix3?(b[0]=y.elements[0],b[1]=y.elements[1],b[2]=y.elements[2],b[3]=0,b[4]=y.elements[3],b[5]=y.elements[4],b[6]=y.elements[5],b[7]=0,b[8]=y.elements[6],b[9]=y.elements[7],b[10]=y.elements[8],b[11]=0):ArrayBuffer.isView(y)?b.set(new y.constructor(y.buffer,y.byteOffset,b.length)):y.toArray(b,T)}function v(y,b,T,P){let _=y.value,A=b+"_"+T;if(P[A]===void 0)return typeof _=="number"||typeof _=="boolean"?P[A]=_:ArrayBuffer.isView(_)?P[A]=_.slice():P[A]=_.clone(),!0;{let I=P[A];if(typeof _=="number"||typeof _=="boolean"){if(I!==_)return P[A]=_,!0}else{if(ArrayBuffer.isView(_))return!0;if(I.equals(_)===!1)return I.copy(_),!0}}return!1}function p(y){let b=y.uniforms,T=0,P=16;for(let A=0,I=b.length;A<I;A++){let L=Array.isArray(b[A])?b[A]:[b[A]];for(let U=0,D=L.length;U<D;U++){let C=L[U],B=Array.isArray(C.value)?C.value:[C.value];for(let k=0,V=B.length;k<V;k++){let Q=B[k],q=g(Q),K=T%P,j=K%q.boundary,Rt=K+j;T+=j,Rt!==0&&P-Rt<q.storage&&(T+=P-Rt),C.__data=new Float32Array(q.storage/Float32Array.BYTES_PER_ELEMENT),C.__offset=T,T+=q.storage}}}let _=T%P;return _>0&&(T+=P-_),y.__size=T,y.__cache={},this}function g(y){let b={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(b.boundary=4,b.storage=4):y.isVector2?(b.boundary=8,b.storage=8):y.isVector3||y.isColor?(b.boundary=16,b.storage=12):y.isVector4?(b.boundary=16,b.storage=16):y.isMatrix3?(b.boundary=48,b.storage=48):y.isMatrix4?(b.boundary=64,b.storage=64):y.isTexture?kt("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(y)?(b.boundary=16,b.storage=y.byteLength):kt("WebGLRenderer: Unsupported uniform value type.",y),b}function M(y){let b=y.target;b.removeEventListener("dispose",M);let T=a.indexOf(b.__bindingPointIndex);a.splice(T,1),s.deleteBuffer(i[b.id]),delete i[b.id],delete r[b.id]}function w(){for(let y in i)s.deleteBuffer(i[y]);a=[],i={},r={}}return{bind:l,update:c,dispose:w}}var my=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),si=null;function gy(){return si===null&&(si=new Jr(my,16,16,zi,Ze),si.name="DFG_LUT",si.minFilter=$e,si.magFilter=$e,si.wrapS=Jn,si.wrapT=Jn,si.generateMipmaps=!1,si.needsUpdate=!0),si}var hc=class{constructor(t={}){let{canvas:e=sf(),context:n=null,depth:i=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:u=!1,outputBufferType:f=fn}=t;this.isWebGLRenderer=!0;let m;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=n.getContextAttributes().alpha}else m=a;let v=f,p=new Set([Rl,Al,El]),g=new Set([fn,Hn,Ks,Qs,bl,Tl]),M=new Uint32Array(4),w=new Int32Array(4),y=new E,b=null,T=null,P=[],_=[],A=null;this.domElement=e,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Vn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let I=this,L=!1,U=null,D=null,C=null,B=null;this._outputColorSpace=We;let k=0,V=0,Q=null,q=-1,K=null,j=new Ae,Rt=new Ae,yt=null,ne=new ht(0),Yt=0,ee=e.width,Y=e.height,tt=1,xt=null,Ot=null,Tt=new Ae(0,0,ee,Y),Vt=new Ae(0,0,ee,Y),le=!1,et=new Gs,rt=!1,at=!1,ot=new ce,ct=new E,Bt=new Ae,Ft={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Gt=!1;function Xt(){return Q===null?tt:1}let N=n;function he(S,F){return e.getContext(S,F)}let jt,R,x,z,W,$,lt,ut,Z,nt,ft,Dt,_t,pt,Nt,zt,qt,O,mt,J,gt,bt,st;try{let S={alpha:!0,depth:i,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${"186"}`),e.addEventListener("webglcontextlost",ge,!1),e.addEventListener("webglcontextrestored",ue,!1),e.addEventListener("webglcontextcreationerror",In,!1),N===null){let F="webgl2";if(N=he(F,S),N===null)throw he(F)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}Ut()}catch(S){throw e.removeEventListener("webglcontextlost",ge,!1),e.removeEventListener("webglcontextrestored",ue,!1),e.removeEventListener("webglcontextcreationerror",In,!1),Ht("WebGLRenderer: "+S.message),S}function Ut(){jt=new b_(N),jt.init(),gt=new cy(N,jt),R=new f_(N,jt,t,gt),x=new oy(N,jt),R.reversedDepthBuffer&&u&&x.buffers.depth.setReversed(!0),D=N.createFramebuffer(),C=N.createFramebuffer(),B=N.createFramebuffer(),z=new E_(N),W=new Yv,$=new ly(N,jt,x,W,R,gt,z),lt=new S_(I),ut=new Rg(N),bt=new u_(N,ut),Z=new T_(N,ut,z,bt),nt=new R_(N,Z,ut,bt,z),O=new A_(N,R,$),Nt=new p_(W),ft=new qv(I,lt,jt,R,bt,Nt),Dt=new fy(I,W),_t=new Zv,pt=new ey(jt),qt=new h_(I,lt,x,nt,m,l),zt=new ay(I,nt,R),st=new py(N,z,R,x),mt=new d_(N,jt,z),J=new w_(N,jt,z),z.programs=ft.programs,I.capabilities=R,I.extensions=jt,I.properties=W,I.renderLists=_t,I.shadowMap=zt,I.state=x,I.info=z}v!==fn&&(A=new P_(v,e.width,e.height,o,i,r));let It=new mu(I,N);this.xr=It,this.getContext=function(){return N},this.getContextAttributes=function(){return N.getContextAttributes()},this.forceContextLoss=function(){let S=jt.get("WEBGL_lose_context");S&&S.loseContext()},this.forceContextRestore=function(){let S=jt.get("WEBGL_lose_context");S&&S.restoreContext()},this.getPixelRatio=function(){return tt},this.setPixelRatio=function(S){S!==void 0&&(tt=S,this.setSize(ee,Y,!1))},this.getSize=function(S){return S.set(ee,Y)},this.setSize=function(S,F,X=!0){if(It.isPresenting){kt("WebGLRenderer: Can't change size while VR device is presenting.");return}ee=S,Y=F,e.width=Math.floor(S*tt),e.height=Math.floor(F*tt),X===!0&&(e.style.width=S+"px",e.style.height=F+"px"),A!==null&&A.setSize(e.width,e.height),this.setViewport(0,0,S,F)},this.getDrawingBufferSize=function(S){return S.set(ee*tt,Y*tt).floor()},this.setDrawingBufferSize=function(S,F,X){ee=S,Y=F,tt=X,e.width=Math.floor(S*X),e.height=Math.floor(F*X),this.setViewport(0,0,S,F)},this.setEffects=function(S){if(v===fn){Ht("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(S){for(let F=0;F<S.length;F++)if(S[F].isOutputPass===!0){kt("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}A.setEffects(S||[])},this.getCurrentViewport=function(S){return S.copy(j)},this.getViewport=function(S){return S.copy(Tt)},this.setViewport=function(S,F,X,H){S.isVector4?Tt.set(S.x,S.y,S.z,S.w):Tt.set(S,F,X,H),x.viewport(j.copy(Tt).multiplyScalar(tt).round())},this.getScissor=function(S){return S.copy(Vt)},this.setScissor=function(S,F,X,H){S.isVector4?Vt.set(S.x,S.y,S.z,S.w):Vt.set(S,F,X,H),x.scissor(Rt.copy(Vt).multiplyScalar(tt).round())},this.getScissorTest=function(){return le},this.setScissorTest=function(S){x.setScissorTest(le=S)},this.setOpaqueSort=function(S){xt=S},this.setTransparentSort=function(S){Ot=S},this.getClearColor=function(S){return S.copy(qt.getClearColor())},this.setClearColor=function(){qt.setClearColor(...arguments)},this.getClearAlpha=function(){return qt.getClearAlpha()},this.setClearAlpha=function(){qt.setClearAlpha(...arguments)},this.clear=function(S=!0,F=!0,X=!0){let H=0;if(S){let G=!1;if(Q!==null){let St=Q.texture.format;G=p.has(St)}if(G){let St=Q.texture.type,At=g.has(St),Mt=qt.getClearColor(),Ct=qt.getClearAlpha(),Lt=Mt.r,$t=Mt.g,te=Mt.b;At?(M[0]=Lt,M[1]=$t,M[2]=te,M[3]=Ct,N.clearBufferuiv(N.COLOR,0,M)):(w[0]=Lt,w[1]=$t,w[2]=te,w[3]=Ct,N.clearBufferiv(N.COLOR,0,w))}else H|=N.COLOR_BUFFER_BIT}F&&(H|=N.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),X&&(H|=N.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),H!==0&&N.clear(H)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(S){S.setRenderer(this),U=S},this.dispose=function(){e.removeEventListener("webglcontextlost",ge,!1),e.removeEventListener("webglcontextrestored",ue,!1),e.removeEventListener("webglcontextcreationerror",In,!1),qt.dispose(),_t.dispose(),pt.dispose(),W.dispose(),lt.dispose(),nt.dispose(),bt.dispose(),st.dispose(),ft.dispose(),It.dispose(),It.removeEventListener("sessionstart",Uu),It.removeEventListener("sessionend",Fu),Xi.stop()};function ge(S){S.preventDefault(),Vr("WebGLRenderer: Context Lost."),L=!0}function ue(){Vr("WebGLRenderer: Context Restored."),L=!1;let S=z.autoReset,F=zt.enabled,X=zt.autoUpdate,H=zt.needsUpdate,G=zt.type;Ut(),z.autoReset=S,zt.enabled=F,zt.autoUpdate=X,zt.needsUpdate=H,zt.type=G}function In(S){Ht("WebGLRenderer: A WebGL context could not be created. Reason: ",S.statusMessage)}function Yn(S){let F=S.target;F.removeEventListener("dispose",Yn),Zp(F)}function Zp(S){Jp(S),W.remove(S)}function Jp(S){let F=W.get(S).programs;F!==void 0&&(F.forEach(function(X){ft.releaseProgram(X)}),S.isShaderMaterial&&ft.releaseShaderCache(S))}this.renderBufferDirect=function(S,F,X,H,G,St){F===null&&(F=Ft);let At=G.isMesh&&G.matrixWorld.determinantAffine()<0,Mt=jp(S,F,X,H,G);x.setMaterial(H,At);let Ct=X.index,Lt=1;if(H.wireframe===!0){if(Ct=Z.getWireframeAttribute(X),Ct===void 0)return;Lt=2}let $t=X.drawRange,te=X.attributes.position,Pt=$t.start*Lt,de=($t.start+$t.count)*Lt;St!==null&&(Pt=Math.max(Pt,St.start*Lt),de=Math.min(de,(St.start+St.count)*Lt)),Ct!==null?(Pt=Math.max(Pt,0),de=Math.min(de,Ct.count)):te!=null&&(Pt=Math.max(Pt,0),de=Math.min(de,te.count));let Ne=de-Pt;if(Ne<0||Ne===1/0)return;bt.setup(G,H,Mt,X,Ct);let Me,me=mt;if(Ct!==null&&(Me=ut.get(Ct),me=J,me.setIndex(Me)),G.isMesh)H.wireframe===!0?(x.setLineWidth(H.wireframeLinewidth*Xt()),me.setMode(N.LINES)):me.setMode(N.TRIANGLES);else if(G.isLine){let Ke=H.linewidth;Ke===void 0&&(Ke=1),x.setLineWidth(Ke*Xt()),G.isLineSegments?me.setMode(N.LINES):G.isLineLoop?me.setMode(N.LINE_LOOP):me.setMode(N.LINE_STRIP)}else G.isPoints?me.setMode(N.POINTS):G.isSprite&&me.setMode(N.TRIANGLES);if(G.isBatchedMesh)if(jt.get("WEBGL_multi_draw"))me.renderMultiDraw(G._multiDrawStarts,G._multiDrawCounts,G._multiDrawCount);else{let Ke=G._multiDrawStarts,Et=G._multiDrawCounts,nn=G._multiDrawCount,se=Ct?ut.get(Ct).bytesPerElement:1,Tn=W.get(H).currentProgram.getUniforms();for(let $n=0;$n<nn;$n++)Tn.setValue(N,"_gl_DrawID",$n),me.render(Ke[$n]/se,Et[$n])}else if(G.isInstancedMesh)me.renderInstances(Pt,Ne,G.count);else if(X.isInstancedBufferGeometry){let Ke=X._maxInstanceCount!==void 0?X._maxInstanceCount:1/0,Et=Math.min(X.instanceCount,Ke);me.renderInstances(Pt,Ne,Et)}else me.render(Pt,Ne)};function Nu(S,F,X,H){U!==null&&S.isNodeMaterial&&U.setObject(H,S),rt===!0&&Nt.setState(S,X,!1),S.transparent===!0&&S.side===ze&&S.forceSinglePass===!1?(S.side=Be,S.needsUpdate=!0,ro(S,F,H),S.side=Ni,S.needsUpdate=!0,ro(S,F,H),S.side=ze):ro(S,F,H)}this.compile=function(S,F,X=null){X===null&&(X=S),U!==null&&U.renderStart(S,F,X),T=pt.get(X),T.init(F),_.push(T),X.traverseVisible(function(G){G.isLight&&G.layers.test(F.layers)&&(T.pushLight(G),G.castShadow&&T.pushShadow(G))}),S!==X&&S.traverseVisible(function(G){G.isLight&&G.layers.test(F.layers)&&(T.pushLight(G),G.castShadow&&T.pushShadow(G))}),T.setupLights(),U!==null&&U.updateLights(T.state.lightsArray),at=this.localClippingEnabled,rt=Nt.init(this.clippingPlanes,at),rt===!0&&Nt.setGlobalState(this.clippingPlanes,F),U!==null&&zt.render(T.state.shadowsArray,X,F);let H=new Set;return S.traverse(function(G){if(!(G.isMesh||G.isPoints||G.isLine||G.isSprite))return;let St=G.material;if(St)if(Array.isArray(St))for(let At=0;At<St.length;At++){let Mt=St[At];Nu(Mt,X,F,G),H.add(Mt)}else Nu(St,X,F,G),H.add(St)}),T=_.pop(),U!==null&&U.renderEnd(),H},this.compileAsync=function(S,F,X=null){let H=this.compile(S,F,X);return new Promise(G=>{function St(){if(H.forEach(function(At){let Ct=W.get(At).currentProgram;(Ct===void 0||Ct.isReady())&&H.delete(At)}),H.size===0){G(S);return}setTimeout(St,10)}jt.get("KHR_parallel_shader_compile")!==null?St():setTimeout(St,10)})};let Wc=null;function Kp(S){Wc&&Wc(S)}function Uu(){Xi.stop()}function Fu(){Xi.start()}let Xi=new Of;Xi.setAnimationLoop(Kp),typeof self<"u"&&Xi.setContext(self),this.setAnimationLoop=function(S){Wc=S,It.setAnimationLoop(S),S===null?Xi.stop():Xi.start()},It.addEventListener("sessionstart",Uu),It.addEventListener("sessionend",Fu),this.render=function(S,F){if(F!==void 0&&F.isCamera!==!0){Ht("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(L===!0)return;U!==null&&U.renderStart(S,F);let X=It.enabled===!0&&It.isPresenting===!0,H=A!==null&&(Q===null||X)&&A.begin(I,Q);if(S.matrixWorldAutoUpdate===!0&&S.updateMatrixWorld(),F.parent===null&&F.matrixWorldAutoUpdate===!0&&F.updateMatrixWorld(),It.enabled===!0&&It.isPresenting===!0&&(A===null||A.isCompositing()===!1)&&(It.cameraAutoUpdate===!0&&It.updateCamera(F),F=It.getCamera()),S.isScene===!0&&S.onBeforeRender(I,S,F,Q),T=pt.get(S,_.length),T.init(F),T.state.textureUnits=$.getTextureUnits(),_.push(T),ot.multiplyMatrices(F.projectionMatrix,F.matrixWorldInverse),et.setFromProjectionMatrix(ot,On,F.reversedDepth),at=this.localClippingEnabled,rt=Nt.init(this.clippingPlanes,at),b=_t.get(S,P.length),b.init(),P.push(b),It.enabled===!0&&It.isPresenting===!0){let At=I.xr.getDepthSensingMesh();At!==null&&Xc(At,F,-1/0,I.sortObjects)}Xc(S,F,0,I.sortObjects),b.finish(),U!==null&&U.updateLights(T.state.lightsArray),I.sortObjects===!0&&b.sort(xt,Ot),Gt=It.enabled===!1||It.isPresenting===!1||It.hasDepthSensing()===!1,Gt&&qt.addToRenderList(b,S),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),rt===!0&&Nt.beginShadows();let G=T.state.shadowsArray;if(zt.render(G,S,F),rt===!0&&Nt.endShadows(),(H&&A.hasRenderPass())===!1){let At=b.opaque,Mt=b.transmissive;if(T.setupLights(),F.isArrayCamera){let Ct=F.cameras;if(Mt.length>0)for(let Lt=0,$t=Ct.length;Lt<$t;Lt++){let te=Ct[Lt];Bu(At,Mt,S,te)}Gt&&qt.render(S);for(let Lt=0,$t=Ct.length;Lt<$t;Lt++){let te=Ct[Lt];Ou(b,S,te,te.viewport)}}else Mt.length>0&&Bu(At,Mt,S,F),Gt&&qt.render(S),Ou(b,S,F)}Q!==null&&V===0&&($.updateMultisampleRenderTarget(Q),$.updateRenderTargetMipmap(Q)),H&&A.end(I),S.isScene===!0&&S.onAfterRender(I,S,F),bt.resetDefaultState(),q=-1,K=null,_.pop(),_.length>0?(T=_[_.length-1],$.setTextureUnits(T.state.textureUnits),rt===!0&&Nt.setGlobalState(I.clippingPlanes,T.state.camera)):T=null,P.pop(),P.length>0?b=P[P.length-1]:b=null,U!==null&&U.renderEnd()};function Xc(S,F,X,H){if(S.visible===!1)return;if(S.layers.test(F.layers)){if(S.isGroup)X=S.renderOrder;else if(S.isLOD)S.autoUpdate===!0&&S.update(F);else if(S.isLightProbeGrid)T.pushLightProbeGrid(S);else if(S.isLight)T.pushLight(S),S.castShadow&&T.pushShadow(S);else if(S.isSprite){if(!S.frustumCulled||S.intersectsFrustum(et)){H&&Bt.setFromMatrixPosition(S.matrixWorld).applyMatrix4(ot);let At=nt.update(S),Mt=S.material;Mt.visible&&b.push(S,At,Mt,X,Bt.z,null,F)}}else if((S.isMesh||S.isLine||S.isPoints)&&(!S.frustumCulled||S.intersectsFrustum(et))){let At=nt.update(S),Mt=S.material;if(H&&(S.boundingSphere!==void 0?(S.boundingSphere===null&&S.computeBoundingSphere(),Bt.copy(S.boundingSphere.center)):(At.boundingSphere===null&&At.computeBoundingSphere(),Bt.copy(At.boundingSphere.center)),Bt.applyMatrix4(S.matrixWorld).applyMatrix4(ot)),Array.isArray(Mt)){let Ct=At.groups;for(let Lt=0,$t=Ct.length;Lt<$t;Lt++){let te=Ct[Lt],Pt=Mt[te.materialIndex];Pt&&Pt.visible&&b.push(S,At,Pt,X,Bt.z,te,F)}}else Mt.visible&&b.push(S,At,Mt,X,Bt.z,null,F)}}let St=S.children;for(let At=0,Mt=St.length;At<Mt;At++)Xc(St[At],F,X,H)}function Ou(S,F,X,H){let{opaque:G,transmissive:St,transparent:At}=S;T.setupLightsView(X),rt===!0&&Nt.setGlobalState(I.clippingPlanes,X),H&&x.viewport(j.copy(H)),G.length>0&&so(G,F,X),St.length>0&&so(St,F,X),At.length>0&&so(At,F,X),x.buffers.depth.setTest(!0),x.buffers.depth.setMask(!0),x.buffers.color.setMask(!0),x.setPolygonOffset(!1)}function Bu(S,F,X,H){if((X.isScene===!0?X.overrideMaterial:null)!==null)return;if(T.state.transmissionRenderTarget[H.id]===void 0){let Pt=jt.has("EXT_color_buffer_half_float")||jt.has("EXT_color_buffer_float");T.state.transmissionRenderTarget[H.id]=new Fe(1,1,{generateMipmaps:!0,type:Pt?Ze:fn,minFilter:Oi,samples:Math.max(4,R.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:Qt.workingColorSpace})}let St=T.state.transmissionRenderTarget[H.id],At=H.viewport||j;St.setSize(At.z*I.transmissionResolutionScale,At.w*I.transmissionResolutionScale);let Mt=I.getRenderTarget(),Ct=I.getActiveCubeFace(),Lt=I.getActiveMipmapLevel();I.setRenderTarget(St),I.getClearColor(ne),Yt=I.getClearAlpha(),Yt<1&&I.setClearColor(16777215,.5),I.clear(),Gt&&qt.render(X);let $t=I.toneMapping;I.toneMapping=Vn;let te=H.viewport;if(H.viewport!==void 0&&(H.viewport=void 0),T.setupLightsView(H),rt===!0&&Nt.setGlobalState(I.clippingPlanes,H),so(S,X,H),$.updateMultisampleRenderTarget(St),$.updateRenderTargetMipmap(St),jt.has("WEBGL_multisampled_render_to_texture")===!1){let Pt=!1;for(let de=0,Ne=F.length;de<Ne;de++){let Me=F[de],{object:me,geometry:Ke,material:Et,group:nn}=Me;if(Et.side===ze&&me.layers.test(H.layers)){let se=Et.side;Et.side=Be,Et.needsUpdate=!0,zu(me,X,H,Ke,Et,nn),Et.side=se,Et.needsUpdate=!0,Pt=!0}}Pt===!0&&($.updateMultisampleRenderTarget(St),$.updateRenderTargetMipmap(St))}I.setRenderTarget(Mt,Ct,Lt),I.setClearColor(ne,Yt),te!==void 0&&(H.viewport=te),I.toneMapping=$t}function so(S,F,X){let H=F.isScene===!0?F.overrideMaterial:null;for(let G=0,St=S.length;G<St;G++){let At=S[G],{object:Mt,geometry:Ct,group:Lt}=At,$t=At.material;$t.allowOverride===!0&&H!==null&&($t=H),Mt.layers.test(X.layers)&&zu(Mt,F,X,Ct,$t,Lt)}}function zu(S,F,X,H,G,St){U!==null&&G.isNodeMaterial&&U.setObject(S,G),S.onBeforeRender(I,F,X,H,G,St),S.modelViewMatrix.multiplyMatrices(X.matrixWorldInverse,S.matrixWorld),S.normalMatrix.getNormalMatrix(S.modelViewMatrix),G.onBeforeRender(I,F,X,H,S,St),G.transparent===!0&&G.side===ze&&G.forceSinglePass===!1?(G.side=Be,G.needsUpdate=!0,I.renderBufferDirect(X,F,H,G,S,St),G.side=Ni,G.needsUpdate=!0,I.renderBufferDirect(X,F,H,G,S,St),G.side=ze):I.renderBufferDirect(X,F,H,G,S,St),S.onAfterRender(I,F,X,H,G,St)}function ro(S,F,X){F.isScene!==!0&&(F=Ft);let H=W.get(S),G=T.state.lights,St=T.state.shadowsArray,At=G.state.version,Mt=ft.getParameters(S,G.state,St,F,X,T.state.lightProbeGridArray),Ct=ft.getProgramCacheKey(Mt),Lt=H.programs;H.environment=S.isMeshStandardMaterial||S.isMeshLambertMaterial||S.isMeshPhongMaterial?F.environment:null,H.fog=F.fog;let $t=S.isMeshStandardMaterial||S.isMeshLambertMaterial&&!S.envMap||S.isMeshPhongMaterial&&!S.envMap;H.envMap=lt.get(S.envMap||H.environment,$t),H.envMapRotation=H.environment!==null&&S.envMap===null?F.environmentRotation:S.envMapRotation,Lt===void 0&&(S.addEventListener("dispose",Yn),Lt=new Map,H.programs=Lt);let te=Lt.get(Ct);if(te!==void 0){if(H.currentProgram===te&&H.lightsStateVersion===At)return Vu(S,Mt),te}else Mt.uniforms=ft.getUniforms(S),U!==null&&S.isNodeMaterial&&U.build(S,X,Mt),S.onBeforeCompile(Mt,I),te=ft.acquireProgram(Mt,Ct),Lt.set(Ct,te),H.uniforms=Mt.uniforms;let Pt=H.uniforms;return(!S.isShaderMaterial&&!S.isRawShaderMaterial||S.clipping===!0)&&(Pt.clippingPlanes=Nt.uniform),Vu(S,Mt),H.needsLights=em(S),H.lightsStateVersion=At,H.needsLights&&(Pt.ambientLightColor.value=G.state.ambient,Pt.lightProbe.value=G.state.probe,Pt.sunLights.value=G.state.sun,Pt.sunLightShadows.value=G.state.sunShadow,Pt.directionalLights.value=G.state.directional,Pt.directionalLightShadows.value=G.state.directionalShadow,Pt.spotLights.value=G.state.spot,Pt.spotLightShadows.value=G.state.spotShadow,Pt.rectAreaLights.value=G.state.rectArea,Pt.ltc_1.value=G.state.rectAreaLTC1,Pt.ltc_2.value=G.state.rectAreaLTC2,Pt.pointLights.value=G.state.point,Pt.pointLightShadows.value=G.state.pointShadow,Pt.hemisphereLights.value=G.state.hemi,Pt.sunShadowMatrix.value=G.state.sunShadowMatrix,Pt.sunShadowCascade.value=G.state.sunShadowCascade,Pt.directionalShadowMatrix.value=G.state.directionalShadowMatrix,Pt.spotLightMatrix.value=G.state.spotLightMatrix,Pt.spotLightMap.value=G.state.spotLightMap,Pt.pointShadowMatrix.value=G.state.pointShadowMatrix),H.lightProbeGrid=T.state.lightProbeGridArray.length>0,H.currentProgram=te,H.uniformsList=null,te}function ku(S){if(S.uniformsList===null){let F=S.currentProgram.getUniforms();S.uniformsList=nr.seqWithValue(F.seq,S.uniforms)}return S.uniformsList}function Vu(S,F){let X=W.get(S);X.outputColorSpace=F.outputColorSpace,X.batching=F.batching,X.batchingColor=F.batchingColor,X.instancing=F.instancing,X.instancingColor=F.instancingColor,X.instancingMorph=F.instancingMorph,X.skinning=F.skinning,X.morphTargets=F.morphTargets,X.morphNormals=F.morphNormals,X.morphColors=F.morphColors,X.morphTargetsCount=F.morphTargetsCount,X.numClippingPlanes=F.numClippingPlanes,X.numIntersection=F.numClipIntersection,X.vertexAlphas=F.vertexAlphas,X.vertexTangents=F.vertexTangents,X.toneMapping=F.toneMapping}function Qp(S,F){if(S.length===0)return null;if(S.length===1)return S[0].texture!==null?S[0]:null;y.setFromMatrixPosition(F.matrixWorld);for(let X=0,H=S.length;X<H;X++){let G=S[X];if(G.texture!==null&&G.boundingBox.containsPoint(y))return G}return null}function jp(S,F,X,H,G){F.isScene!==!0&&(F=Ft),$.resetTextureUnits();let St=F.fog,At=H.isMeshStandardMaterial||H.isMeshLambertMaterial||H.isMeshPhongMaterial?F.environment:null,Mt=Q===null?I.outputColorSpace:Q.isXRRenderTarget===!0?Q.texture.colorSpace:Qt.workingColorSpace,Ct=H.isMeshStandardMaterial||H.isMeshLambertMaterial&&!H.envMap||H.isMeshPhongMaterial&&!H.envMap,Lt=lt.get(H.envMap||At,Ct),$t=H.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,te=!!X.attributes.tangent&&(!!H.normalMap||H.anisotropy>0),Pt=!!X.morphAttributes.position,de=!!X.morphAttributes.normal,Ne=!!X.morphAttributes.color,Me=Vn;H.toneMapped&&(Q===null||Q.isXRRenderTarget===!0)&&(Me=I.toneMapping);let me=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,Ke=me!==void 0?me.length:0,Et=W.get(H),nn=T.state.lights;if(rt===!0&&(at===!0||S!==K)){let xe=S===K&&H.id===q;Nt.setState(H,S,xe)}let se=!1;H.version===Et.__version?(Et.needsLights&&Et.lightsStateVersion!==nn.state.version||Et.outputColorSpace!==Mt||G.isBatchedMesh&&Et.batching===!1||!G.isBatchedMesh&&Et.batching===!0||G.isBatchedMesh&&Et.batchingColor===!0&&G._colorsTexture===null||G.isBatchedMesh&&Et.batchingColor===!1&&G._colorsTexture!==null||G.isInstancedMesh&&Et.instancing===!1||!G.isInstancedMesh&&Et.instancing===!0||G.isSkinnedMesh&&Et.skinning===!1||!G.isSkinnedMesh&&Et.skinning===!0||G.isInstancedMesh&&Et.instancingColor===!0&&G.instanceColor===null||G.isInstancedMesh&&Et.instancingColor===!1&&G.instanceColor!==null||G.isInstancedMesh&&Et.instancingMorph===!0&&G.morphTexture===null||G.isInstancedMesh&&Et.instancingMorph===!1&&G.morphTexture!==null||Et.envMap!==Lt||H.fog===!0&&Et.fog!==St||Et.numClippingPlanes!==void 0&&(Et.numClippingPlanes!==Nt.numPlanes||Et.numIntersection!==Nt.numIntersection)||Et.vertexAlphas!==$t||Et.vertexTangents!==te||Et.morphTargets!==Pt||Et.morphNormals!==de||Et.morphColors!==Ne||Et.toneMapping!==Me||Et.morphTargetsCount!==Ke||!!Et.lightProbeGrid!=T.state.lightProbeGridArray.length>0)&&(se=!0):(se=!0,Et.__version=H.version);let Tn=Et.currentProgram;se===!0&&(Tn=ro(H,F,G),U&&H.isNodeMaterial&&U.onUpdateProgram(H,Tn,Et));let $n=!1,yi=!1,ms=!1,pe=Tn.getUniforms(),Ie=Et.uniforms;if(x.useProgram(Tn.program)&&($n=!0,yi=!0,ms=!0),H.id!==q&&(q=H.id,yi=!0),Et.needsLights){let xe=Qp(T.state.lightProbeGridArray,G);Et.lightProbeGrid!==xe&&(Et.lightProbeGrid=xe,yi=!0)}if($n||K!==S){x.buffers.depth.getReversed()&&S.reversedDepth!==!0&&(S._reversedDepth=!0,S.updateProjectionMatrix()),pe.setValue(N,"projectionMatrix",S.projectionMatrix),pe.setValue(N,"viewMatrix",S.matrixWorldInverse);let Si=pe.map.cameraPosition;Si!==void 0&&Si.setValue(N,ct.setFromMatrixPosition(S.matrixWorld)),R.logarithmicDepthBuffer&&pe.setValue(N,"logDepthBufFC",2/(Math.log(S.far+1)/Math.LN2)),(H.isMeshPhongMaterial||H.isMeshToonMaterial||H.isMeshLambertMaterial||H.isMeshBasicMaterial||H.isMeshStandardMaterial||H.isShaderMaterial)&&pe.setValue(N,"isOrthographic",S.isOrthographicCamera===!0),K!==S&&(K=S,yi=!0,ms=!0)}if(Et.needsLights&&(nn.state.sunShadowMap.length>0&&pe.setValue(N,"sunShadowMap",nn.state.sunShadowMap,$),nn.state.directionalShadowMap.length>0&&pe.setValue(N,"directionalShadowMap",nn.state.directionalShadowMap,$),nn.state.spotShadowMap.length>0&&pe.setValue(N,"spotShadowMap",nn.state.spotShadowMap,$),nn.state.pointShadowMap.length>0&&pe.setValue(N,"pointShadowMap",nn.state.pointShadowMap,$)),G.isSkinnedMesh){pe.setOptional(N,G,"bindMatrix"),pe.setOptional(N,G,"bindMatrixInverse");let xe=G.skeleton;xe&&(xe.boneTexture===null&&xe.computeBoneTexture(),pe.setValue(N,"boneTexture",xe.boneTexture,$))}G.isBatchedMesh&&(pe.setOptional(N,G,"batchingTexture"),pe.setValue(N,"batchingTexture",G._matricesTexture,$),pe.setOptional(N,G,"batchingIdTexture"),pe.setValue(N,"batchingIdTexture",G._indirectTexture,$),pe.setOptional(N,G,"batchingColorTexture"),G._colorsTexture!==null&&pe.setValue(N,"batchingColorTexture",G._colorsTexture,$));let Mi=X.morphAttributes;if((Mi.position!==void 0||Mi.normal!==void 0||Mi.color!==void 0)&&O.update(G,X,Tn),(yi||Et.receiveShadow!==G.receiveShadow)&&(Et.receiveShadow=G.receiveShadow,pe.setValue(N,"receiveShadow",G.receiveShadow)),(H.isMeshStandardMaterial||H.isMeshLambertMaterial||H.isMeshPhongMaterial)&&H.envMap===null&&F.environment!==null&&(Ie.envMapIntensity.value=F.environmentIntensity),Ie.dfgLUT!==void 0&&(Ie.dfgLUT.value=gy()),yi){if(pe.setValue(N,"toneMappingExposure",I.toneMappingExposure),Et.needsLights&&tm(Ie,ms),St&&H.fog===!0&&Dt.refreshFogUniforms(Ie,St),Dt.refreshMaterialUniforms(Ie,H,tt,Y,T.state.transmissionRenderTarget[S.id]),Et.needsLights&&Et.lightProbeGrid){let xe=Et.lightProbeGrid;Ie.probesSH.value=xe.texture,Ie.probesMin.value.copy(xe.boundingBox.min),Ie.probesMax.value.copy(xe.boundingBox.max),Ie.probesResolution.value.copy(xe.resolution)}nr.upload(N,ku(Et),Ie,$)}if(H.isShaderMaterial&&H.uniformsNeedUpdate===!0&&(nr.upload(N,ku(Et),Ie,$),H.uniformsNeedUpdate=!1),H.isSpriteMaterial&&pe.setValue(N,"center",G.center),pe.setValue(N,"modelViewMatrix",G.modelViewMatrix),pe.setValue(N,"normalMatrix",G.normalMatrix),pe.setValue(N,"modelMatrix",G.matrixWorld),H.uniformsGroups!==void 0){let xe=H.uniformsGroups;for(let Si=0,gs=xe.length;Si<gs;Si++){let Gu=xe[Si];st.update(Gu,Tn),st.bind(Gu,Tn)}}return Tn}function tm(S,F){S.ambientLightColor.needsUpdate=F,S.lightProbe.needsUpdate=F,S.sunLights.needsUpdate=F,S.sunLightShadows.needsUpdate=F,S.directionalLights.needsUpdate=F,S.directionalLightShadows.needsUpdate=F,S.pointLights.needsUpdate=F,S.pointLightShadows.needsUpdate=F,S.spotLights.needsUpdate=F,S.spotLightShadows.needsUpdate=F,S.rectAreaLights.needsUpdate=F,S.hemisphereLights.needsUpdate=F}function em(S){return S.isMeshLambertMaterial||S.isMeshToonMaterial||S.isMeshPhongMaterial||S.isMeshStandardMaterial||S.isShadowMaterial||S.isShaderMaterial&&S.lights===!0}this.getActiveCubeFace=function(){return k},this.getActiveMipmapLevel=function(){return V},this.getRenderTarget=function(){return Q},this.setRenderTargetTextures=function(S,F,X){let H=W.get(S);H.__autoAllocateDepthBuffer=S.resolveDepthBuffer===!1,H.__autoAllocateDepthBuffer===!1&&(H.__useRenderToTexture=!1),W.get(S.texture).__webglTexture=F,W.get(S.depthTexture).__webglTexture=H.__autoAllocateDepthBuffer?void 0:X,H.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(S,F){let X=W.get(S);X.__webglFramebuffer=F,X.__useDefaultFramebuffer=F===void 0},this.setRenderTarget=function(S,F=0,X=0){Q=S,k=F,V=X;let H=null,G=!1,St=!1;if(S){let Mt=W.get(S);if(Mt.__useDefaultFramebuffer!==void 0){x.bindFramebuffer(N.FRAMEBUFFER,Mt.__webglFramebuffer),j.copy(S.viewport),Rt.copy(S.scissor),yt=S.scissorTest,x.viewport(j),x.scissor(Rt),x.setScissorTest(yt),q=-1;return}else if(Mt.__webglFramebuffer===void 0)$.setupRenderTarget(S);else if(Mt.__hasExternalTextures)$.rebindTextures(S,W.get(S.texture).__webglTexture,W.get(S.depthTexture).__webglTexture);else if(S.depthBuffer){let $t=S.depthTexture;if(Mt.__boundDepthTexture!==$t){if($t!==null&&W.has($t)&&(S.width!==$t.image.width||S.height!==$t.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");$.setupDepthRenderbuffer(S)}}let Ct=S.texture;(Ct.isData3DTexture||Ct.isDataArrayTexture||Ct.isCompressedArrayTexture)&&(St=!0);let Lt=W.get(S).__webglFramebuffer;S.isWebGLCubeRenderTarget?(Array.isArray(Lt[F])?H=Lt[F][X]:H=Lt[F],G=!0):S.samples>0&&$.useMultisampledRTT(S)===!1?H=W.get(S).__webglMultisampledFramebuffer:Array.isArray(Lt)?H=Lt[X]:H=Lt,j.copy(S.viewport),Rt.copy(S.scissor),yt=S.scissorTest}else j.copy(Tt).multiplyScalar(tt).floor(),Rt.copy(Vt).multiplyScalar(tt).floor(),yt=le;if(X!==0&&(H=D),x.bindFramebuffer(N.FRAMEBUFFER,H)&&x.drawBuffers(S,H),x.viewport(j),x.scissor(Rt),x.setScissorTest(yt),G){let Mt=W.get(S.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_CUBE_MAP_POSITIVE_X+F,Mt.__webglTexture,X)}else if(St){let Mt=F;for(let Ct=0;Ct<S.textures.length;Ct++){let Lt=W.get(S.textures[Ct]);N.framebufferTextureLayer(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0+Ct,Lt.__webglTexture,X,Mt)}}else if(S!==null&&X!==0){let Mt=W.get(S.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,Mt.__webglTexture,X)}q=-1};function Hu(S){let F=W.get(S);return(F.__readFormat!==S.format||F.__readType!==S.type)&&(F.__readFormat=S.format,F.__readType=S.type,F.__formatReadable=R.textureFormatReadable(S.format),F.__typeReadable=R.textureTypeReadable(S.type)),F}this.readRenderTargetPixels=function(S,F,X,H,G,St,At,Mt=0){if(!(S&&S.isWebGLRenderTarget)){Ht("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ct=W.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&At!==void 0&&(Ct=Ct[At]),Ct){x.bindFramebuffer(N.FRAMEBUFFER,Ct);try{let Lt=S.textures[Mt],$t=Lt.format,te=Lt.type;S.textures.length>1&&N.readBuffer(N.COLOR_ATTACHMENT0+Mt);let Pt=Hu(Lt);if(Pt.__formatReadable===!1){Ht("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Pt.__typeReadable===!1){Ht("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}F>=0&&F<=S.width-H&&X>=0&&X<=S.height-G&&N.readPixels(F,X,H,G,gt.convert($t),gt.convert(te),St)}finally{let Lt=Q!==null?W.get(Q).__webglFramebuffer:null;x.bindFramebuffer(N.FRAMEBUFFER,Lt)}}},this.readRenderTargetPixelsAsync=async function(S,F,X,H,G,St,At,Mt=0){if(!(S&&S.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ct=W.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&At!==void 0&&(Ct=Ct[At]),Ct)if(F>=0&&F<=S.width-H&&X>=0&&X<=S.height-G){x.bindFramebuffer(N.FRAMEBUFFER,Ct);let Lt=S.textures[Mt],$t=Lt.format,te=Lt.type;S.textures.length>1&&N.readBuffer(N.COLOR_ATTACHMENT0+Mt);let Pt=Hu(Lt);if(Pt.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Pt.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let de=N.createBuffer();N.bindBuffer(N.PIXEL_PACK_BUFFER,de),N.bufferData(N.PIXEL_PACK_BUFFER,St.byteLength,N.STREAM_READ),N.readPixels(F,X,H,G,gt.convert($t),gt.convert(te),0),N.bindBuffer(N.PIXEL_PACK_BUFFER,null);let Ne=Q!==null?W.get(Q).__webglFramebuffer:null;x.bindFramebuffer(N.FRAMEBUFFER,Ne);let Me=N.fenceSync(N.SYNC_GPU_COMMANDS_COMPLETE,0);return N.flush(),await af(N,Me,4),N.bindBuffer(N.PIXEL_PACK_BUFFER,de),N.getBufferSubData(N.PIXEL_PACK_BUFFER,0,St),N.bindBuffer(N.PIXEL_PACK_BUFFER,null),N.deleteBuffer(de),N.deleteSync(Me),St}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(S,F=null,X=0){let H=Math.pow(2,-X),G=Math.floor(S.image.width*H),St=Math.floor(S.image.height*H),At=F!==null?F.x:0,Mt=F!==null?F.y:0;$.setTexture2D(S,0),N.copyTexSubImage2D(N.TEXTURE_2D,X,0,0,At,Mt,G,St),x.unbindTexture()},this.copyTextureToTexture=function(S,F,X=null,H=null,G=0,St=0){let At,Mt,Ct,Lt,$t,te,Pt,de,Ne,Me=S.isCompressedTexture?S.mipmaps[St]:S.image;if(X!==null)At=X.max.x-X.min.x,Mt=X.max.y-X.min.y,Ct=X.isBox3?X.max.z-X.min.z:1,Lt=X.min.x,$t=X.min.y,te=X.isBox3?X.min.z:0;else{let Ie=Math.pow(2,-G);At=Math.floor(Me.width*Ie),Mt=Math.floor(Me.height*Ie),S.isDataArrayTexture?Ct=Me.depth:S.isData3DTexture?Ct=Math.floor(Me.depth*Ie):Ct=1,Lt=0,$t=0,te=0}H!==null?(Pt=H.x,de=H.y,Ne=H.z):(Pt=0,de=0,Ne=0);let me=gt.convert(F.format),Ke=gt.convert(F.type),Et;F.isData3DTexture?($.setTexture3D(F,0),Et=N.TEXTURE_3D):F.isDataArrayTexture||F.isCompressedArrayTexture?($.setTexture2DArray(F,0),Et=N.TEXTURE_2D_ARRAY):($.setTexture2D(F,0),Et=N.TEXTURE_2D),x.activeTexture(N.TEXTURE0),x.pixelStorei(N.UNPACK_FLIP_Y_WEBGL,F.flipY),x.pixelStorei(N.UNPACK_PREMULTIPLY_ALPHA_WEBGL,F.premultiplyAlpha),x.pixelStorei(N.UNPACK_ALIGNMENT,F.unpackAlignment);let nn=x.getParameter(N.UNPACK_ROW_LENGTH),se=x.getParameter(N.UNPACK_IMAGE_HEIGHT),Tn=x.getParameter(N.UNPACK_SKIP_PIXELS),$n=x.getParameter(N.UNPACK_SKIP_ROWS),yi=x.getParameter(N.UNPACK_SKIP_IMAGES);x.pixelStorei(N.UNPACK_ROW_LENGTH,Me.width),x.pixelStorei(N.UNPACK_IMAGE_HEIGHT,Me.height),x.pixelStorei(N.UNPACK_SKIP_PIXELS,Lt),x.pixelStorei(N.UNPACK_SKIP_ROWS,$t),x.pixelStorei(N.UNPACK_SKIP_IMAGES,te);let ms=S.isDataArrayTexture||S.isData3DTexture,pe=F.isDataArrayTexture||F.isData3DTexture;if(S.isDepthTexture){let Ie=W.get(S),Mi=W.get(F),xe=W.get(Ie.__renderTarget),Si=W.get(Mi.__renderTarget);x.bindFramebuffer(N.READ_FRAMEBUFFER,xe.__webglFramebuffer),x.bindFramebuffer(N.DRAW_FRAMEBUFFER,Si.__webglFramebuffer);for(let gs=0;gs<Ct;gs++)ms&&(N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,W.get(S).__webglTexture,G,te+gs),N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,W.get(F).__webglTexture,St,Ne+gs)),N.blitFramebuffer(Lt,$t,At,Mt,Pt,de,At,Mt,N.DEPTH_BUFFER_BIT,N.NEAREST);x.bindFramebuffer(N.READ_FRAMEBUFFER,null),x.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else if(G!==0||S.isRenderTargetTexture||W.has(S)){let Ie=W.get(S),Mi=W.get(F);x.bindFramebuffer(N.READ_FRAMEBUFFER,C),x.bindFramebuffer(N.DRAW_FRAMEBUFFER,B);for(let xe=0;xe<Ct;xe++)ms?N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,Ie.__webglTexture,G,te+xe):N.framebufferTexture2D(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,Ie.__webglTexture,G),pe?N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,Mi.__webglTexture,St,Ne+xe):N.framebufferTexture2D(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,Mi.__webglTexture,St),G!==0?N.blitFramebuffer(Lt,$t,At,Mt,Pt,de,At,Mt,N.COLOR_BUFFER_BIT,N.NEAREST):pe?N.copyTexSubImage3D(Et,St,Pt,de,Ne+xe,Lt,$t,At,Mt):N.copyTexSubImage2D(Et,St,Pt,de,Lt,$t,At,Mt);x.bindFramebuffer(N.READ_FRAMEBUFFER,null),x.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else pe?S.isDataTexture||S.isData3DTexture?N.texSubImage3D(Et,St,Pt,de,Ne,At,Mt,Ct,me,Ke,Me.data):F.isCompressedArrayTexture?N.compressedTexSubImage3D(Et,St,Pt,de,Ne,At,Mt,Ct,me,Me.data):N.texSubImage3D(Et,St,Pt,de,Ne,At,Mt,Ct,me,Ke,Me):S.isDataTexture?N.texSubImage2D(N.TEXTURE_2D,St,Pt,de,At,Mt,me,Ke,Me.data):S.isCompressedTexture?N.compressedTexSubImage2D(N.TEXTURE_2D,St,Pt,de,Me.width,Me.height,me,Me.data):N.texSubImage2D(N.TEXTURE_2D,St,Pt,de,At,Mt,me,Ke,Me);x.pixelStorei(N.UNPACK_ROW_LENGTH,nn),x.pixelStorei(N.UNPACK_IMAGE_HEIGHT,se),x.pixelStorei(N.UNPACK_SKIP_PIXELS,Tn),x.pixelStorei(N.UNPACK_SKIP_ROWS,$n),x.pixelStorei(N.UNPACK_SKIP_IMAGES,yi),St===0&&F.generateMipmaps&&N.generateMipmap(Et),x.unbindTexture()},this.initRenderTarget=function(S){W.get(S).__webglFramebuffer===void 0&&$.setupRenderTarget(S)},this.initTexture=function(S){S.isCubeTexture?$.setTextureCube(S,0):S.isData3DTexture?$.setTexture3D(S,0):S.isDataArrayTexture||S.isCompressedArrayTexture?$.setTexture2DArray(S,0):$.setTexture2D(S,0),x.unbindTexture()},this.resetState=function(){k=0,V=0,Q=null,x.reset(),bt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return On}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let e=this.getContext();e.drawingBufferColorSpace=Qt._getDrawingBufferColorSpace(t),e.unpackColorSpace=Qt._getUnpackColorSpace()}};var ar={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};var Mn=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}},xy=new Di(-1,1,1,-1,0,1),gu=class extends _e{constructor(){super(),this.setAttribute("position",new Zt([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new Zt([0,2,0,0,2,0],2))}},_y=new gu,ki=class{constructor(t){this._mesh=new wt(_y,t)}dispose(){this._mesh.geometry.dispose()}render(t){t.render(this._mesh,xy)}get material(){return this._mesh.material}set material(t){this._mesh.material=t}};var fc=class extends Mn{constructor(t,e="tDiffuse"){super(),this.textureID=e,this.uniforms=null,this.material=null,t instanceof we?(this.uniforms=t.uniforms,this.material=t):t&&(this.uniforms=gi.clone(t.uniforms),this.material=new we({name:t.name!==void 0?t.name:"unspecified",defines:Object.assign({},t.defines),uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader})),this._fsQuad=new ki(this.material)}render(t,e,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};var ka=class extends Mn{constructor(t,e){super(),this.scene=t,this.camera=e,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(t,e,n){let i=t.getContext(),r=t.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(i.REPLACE,i.REPLACE,i.REPLACE),r.buffers.stencil.setFunc(i.ALWAYS,a,4294967295),r.buffers.stencil.setClear(o),r.buffers.stencil.setLocked(!0),t.setRenderTarget(n),this.clear&&t.clear(),t.render(this.scene,this.camera),t.setRenderTarget(e),this.clear&&t.clear(),t.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(i.EQUAL,1,4294967295),r.buffers.stencil.setOp(i.KEEP,i.KEEP,i.KEEP),r.buffers.stencil.setLocked(!0)}},pc=class extends Mn{constructor(){super(),this.needsSwap=!1}render(t){t.state.buffers.stencil.setLocked(!1),t.state.buffers.stencil.setTest(!1)}};var mc=class{constructor(t,e){if(this.renderer=t,this._pixelRatio=t.getPixelRatio(),e===void 0){let n=t.getSize(new it);this._width=n.width,this._height=n.height,e=new Fe(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:Ze}),e.texture.name="EffectComposer.rt1"}else this._width=e.width,this._height=e.height;this.renderTarget1=e,this.renderTarget2=e.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new fc(ar),this.copyPass.material.blending=En,this.timer=new Ma}swapBuffers(){let t=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=t}addPass(t){this.passes.push(t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(t,e){this.passes.splice(e,0,t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(t){let e=this.passes.indexOf(t);e!==-1&&this.passes.splice(e,1)}isLastEnabledPass(t){for(let e=t+1;e<this.passes.length;e++)if(this.passes[e].enabled)return!1;return!0}render(t){this.timer.update(),t===void 0&&(t=this.timer.getDelta());let e=this.renderer.getRenderTarget(),n=!1;for(let i=0,r=this.passes.length;i<r;i++){let a=this.passes[i];if(a.enabled!==!1){if(a.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(i),a.render(this.renderer,this.writeBuffer,this.readBuffer,t,n),a.needsSwap){if(n){let o=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,t),l.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}ka!==void 0&&(a instanceof ka?n=!0:a instanceof pc&&(n=!1))}}this.renderer.setRenderTarget(e)}reset(t){if(t===void 0){let e=this.renderer.getSize(new it);this._pixelRatio=this.renderer.getPixelRatio(),this._width=e.width,this._height=e.height,t=this.renderTarget1.clone(),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=t,this.renderTarget2=t.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(t,e){this._width=t,this._height=e;let n=this._width*this._pixelRatio,i=this._height*this._pixelRatio;this.renderTarget1.setSize(n,i),this.renderTarget2.setSize(n,i);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,i)}setPixelRatio(t){this._pixelRatio=t,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}};var gc=class extends Mn{constructor(t,e,n=null,i=null,r=null){super(),this.scene=t,this.camera=e,this.overrideMaterial=n,this.clearColor=i,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new ht}render(t,e,n){let i=t.autoClear;t.autoClear=!1;let r,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(t.getClearColor(this._oldClearColor),t.setClearColor(this.clearColor,t.getClearAlpha())),this.clearAlpha!==null&&(r=t.getClearAlpha(),t.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&t.clearDepth(),t.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),t.render(this.scene,this.camera),this.clearColor!==null&&t.setClearColor(this._oldClearColor),this.clearAlpha!==null&&t.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),t.autoClear=i}};var Wf={name:"LuminosityHighPassShader",uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new ht(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`};var or=class s extends Mn{constructor(t,e=1,n,i){super(),this.strength=e,this.radius=n,this.threshold=i,this.resolution=t!==void 0?new it(t.x,t.y):new it(256,256),this.clearColor=new ht(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new Fe(r,a,{type:Ze,depthBuffer:!1}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let h=0;h<this.nMips;h++){let d=new Fe(r,a,{type:Ze,depthBuffer:!1});d.texture.name="UnrealBloomPass.h"+h,d.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(d);let u=new Fe(r,a,{type:Ze,depthBuffer:!1});u.texture.name="UnrealBloomPass.v"+h,u.texture.generateMipmaps=!1,this.renderTargetsVertical.push(u),r=Math.round(r/2),a=Math.round(a/2)}let o=Wf;this.highPassUniforms=gi.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=i,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new we({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];let l=[6,10,14,18,22];r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let h=0;h<this.nMips;h++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(l[h])),this.separableBlurMaterials[h].uniforms.invSize.value=new it(1/r,1/a),r=Math.round(r/2),a=Math.round(a/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=e,this.compositeMaterial.uniforms.bloomRadius.value=.1;let c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new E(1,1,1),new E(1,1,1),new E(1,1,1),new E(1,1,1),new E(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=gi.clone(ar.uniforms),this.blendMaterial=new we({uniforms:this.copyUniforms,vertexShader:ar.vertexShader,fragmentShader:ar.fragmentShader,premultipliedAlpha:!0,blending:dn,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new ht,this._oldClearAlpha=1,this._basic=new be,this._fsQuad=new ki(null)}dispose(){for(let t=0;t<this.renderTargetsHorizontal.length;t++)this.renderTargetsHorizontal[t].dispose();for(let t=0;t<this.renderTargetsVertical.length;t++)this.renderTargetsVertical[t].dispose();this.renderTargetBright.dispose();for(let t=0;t<this.separableBlurMaterials.length;t++)this.separableBlurMaterials[t].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(t,e){let n=Math.round(t/2),i=Math.round(e/2);this.renderTargetBright.setSize(n,i);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(n,i),this.renderTargetsVertical[r].setSize(n,i),this.separableBlurMaterials[r].uniforms.invSize.value=new it(1/n,1/i),n=Math.round(n/2),i=Math.round(i/2)}render(t,e,n,i,r){t.getClearColor(this._oldClearColor),this._oldClearAlpha=t.getClearAlpha();let a=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),r&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=n.texture,t.setRenderTarget(null),t.clear(),this._fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this._fsQuad.render(t);let o=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this._fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=o.texture,this.separableBlurMaterials[l].uniforms.direction.value=s.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[l]),t.clear(),this._fsQuad.render(t),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=s.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[l]),t.clear(),this._fsQuad.render(t),o=this.renderTargetsVertical[l];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this._fsQuad.render(t),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(n),this._fsQuad.render(t)),t.setClearColor(this._oldClearColor,this._oldClearAlpha),t.autoClear=a}_getSeparableBlurMaterial(t){let e=[],n=t/3;for(let a=0;a<t;a++)e.push(.39894*Math.exp(-.5*a*a/(n*n))/n);let i=[],r=[];for(let a=1;a<t;a+=2){let o=e[a],l=a+1<t?e[a+1]:0,c=o+l;i.push((a*o+(a+1)*l)/c),r.push(c)}return new we({defines:{KERNEL_PAIRS:i.length},uniforms:{colorTexture:{value:null},invSize:{value:new it(.5,.5)},direction:{value:new it(.5,.5)},centerWeight:{value:e[0]},gaussianOffsets:{value:i},gaussianWeights:{value:r}},vertexShader:`

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

				}`})}};or.BlurDirectionX=new it(1,0);or.BlurDirectionY=new it(0,1);var Va={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};var xc=class extends Mn{constructor(){super(),this.isOutputPass=!0,this.uniforms=gi.clone(Va.uniforms),this.material=new $s({name:Va.name,uniforms:this.uniforms,vertexShader:Va.vertexShader,fragmentShader:Va.fragmentShader}),this._fsQuad=new ki(this.material),this._outputColorSpace=null,this._toneMapping=null}render(t,e,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=t.toneMappingExposure,(this._outputColorSpace!==t.outputColorSpace||this._toneMapping!==t.toneMapping)&&(this._outputColorSpace=t.outputColorSpace,this._toneMapping=t.toneMapping,this.material.defines={},Qt.getTransfer(this._outputColorSpace)===oe&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===Sa?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===ba?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===Ta?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===rs?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===Ea?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===Aa?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===wa&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};var _c=class extends Ki{constructor(){super(),this.name="RoomEnvironment",this.position.y=-3.5;let t=new Te;t.deleteAttribute("uv");let e=new Ee({side:Be}),n=new Ee,i=new va(16777215,900,28,2);i.position.set(.418,16.199,.3),this.add(i);let r=new wt(t,e);r.position.set(-.757,13.219,.717),r.scale.set(31.713,28.305,28.591),this.add(r);let a=new Qr(t,n,6),o=new Oe;o.position.set(-10.906,2.009,1.846),o.rotation.set(0,-.195,0),o.scale.set(2.328,7.905,4.651),o.updateMatrix(),a.setMatrixAt(0,o.matrix),o.position.set(-5.607,-.754,-.758),o.rotation.set(0,.994,0),o.scale.set(1.97,1.534,3.955),o.updateMatrix(),a.setMatrixAt(1,o.matrix),o.position.set(6.167,.857,7.803),o.rotation.set(0,.561,0),o.scale.set(3.927,6.285,3.687),o.updateMatrix(),a.setMatrixAt(2,o.matrix),o.position.set(-2.017,.018,6.124),o.rotation.set(0,.333,0),o.scale.set(2.002,4.566,2.064),o.updateMatrix(),a.setMatrixAt(3,o.matrix),o.position.set(2.291,-.756,-2.621),o.rotation.set(0,-.286,0),o.scale.set(1.546,1.552,1.496),o.updateMatrix(),a.setMatrixAt(4,o.matrix),o.position.set(-2.193,-.369,-5.547),o.rotation.set(0,.516,0),o.scale.set(3.875,3.487,2.986),o.updateMatrix(),a.setMatrixAt(5,o.matrix),this.add(a);let l=new wt(t,lr(50));l.position.set(-16.116,14.37,8.208),l.scale.set(.1,2.428,2.739),this.add(l);let c=new wt(t,lr(50));c.position.set(-16.109,18.021,-8.207),c.scale.set(.1,2.425,2.751),this.add(c);let h=new wt(t,lr(17));h.position.set(14.904,12.198,-1.832),h.scale.set(.15,4.265,6.331),this.add(h);let d=new wt(t,lr(43));d.position.set(-.462,8.89,14.52),d.scale.set(4.38,5.441,.088),this.add(d);let u=new wt(t,lr(20));u.position.set(3.235,11.486,-12.541),u.scale.set(2.5,2,.1),this.add(u);let f=new wt(t,lr(100));f.position.set(0,20,0),f.scale.set(1,.1,1),this.add(f)}dispose(){let t=new Set;this.traverse(e=>{e.isMesh&&(t.add(e.geometry),t.add(e.material))});for(let e of t)e.dispose()}};function lr(s){return new pa({color:0,emissive:16777215,emissiveIntensity:s})}var dt={dt:.008333333333333333,gravity:-6.5,ballRadius:.9125,ballMass:30,ballMaxSpeed:60,ballMaxAngVel:6,ballDrag:.0305,ballRestitution:.6,ballFriction:.35,carMass:180,carMaxSpeed:23,supersonic:22,throttleMaxSpeed:14.1,boostAccel:9.9167,boostPerSecond:33.33,brakeAccel:35,coastAccel:5.25,airThrottleAccel:.6667,jumpImpulse:2.9167,jumpHoldAccel:14.583,jumpHoldTime:.2,stickyAccel:3.25,doubleJumpWindow:1.25,dodgeImpulse:5,flipTime:.65,maxAngVel:5.5,rideHeight:.17,airPitchAccel:12.46,airYawAccel:9.11,airRollAccel:38.34,airPitchDamp:2.798,airYawDamp:1.886,airRollDamp:4.472,demoRespawnTime:3,startBoost:33.3},Sn={octane:{name:"Octane",hx:.59,hy:.18,hz:.42},dominus:{name:"Dominus",hx:.64,hy:.155,hz:.42},breakout:{name:"Breakout",hx:.66,hy:.15,hz:.4},merc:{name:"Merc",hx:.6,hy:.22,hz:.43}},cr=[{name:"BLEU",main:2059263,light:5939455,dark:732538,css:"#2f7bff"},{name:"ORANGE",main:16742932,light:16756316,dark:8006661,css:"#ff8a1f"}],Ha={rookie:{label:"Recrue",reaction:.28,aim:.55,boostUse:.35,aerial:0,flips:.3,speed:.85},pro:{label:"Pro",reaction:.14,aim:.8,boostUse:.8,aerial:.5,flips:.8,speed:.95},allstar:{label:"All-Star",reaction:.05,aim:.95,boostUse:1,aerial:1,flips:1,speed:1}},xu=["Viper","Hound","Sultan","Jester","Bandit","Gerwin","Poncho","Rainmaker","Merlin","Samara","Sundown","Tex","Casper","Foamer","Stinger","Shepard","Boomer","Raja","Squall","Myrtle"];var ae={W:40.96,L:51.2,H:20.44,RC:12,RV:3,GW:8.93,GH:6.43,GD:8.8,GEXT:6.5},{W:vy,L:hr,H:yy,RC:My,RV:Ga,GW:Sy,GH:Xf,GD:by,GEXT:Yf}=ae,qf=yy/2,$f=(by+Yf)/2,Ty=hr-Yf+$f;function on(s,t,e){let n=My-Ga,i=Math.abs(s)-(vy-Ga)+n,r=Math.abs(e)-(hr-Ga)+n,a=Math.hypot(Math.max(i,0),Math.max(r,0))+Math.min(Math.max(i,r),0)-n,o=Math.abs(t-qf)-(qf-Ga),l=Math.hypot(Math.max(a,0),Math.max(o,0))+Math.min(Math.max(a,o),0)-Ga,c=Math.abs(s)-Sy,h=Math.abs(t-Xf/2)-Xf/2,d=Math.abs(Math.abs(e)-Ty)-$f,u=Math.hypot(Math.max(c,0),Math.max(h,0),Math.max(d,0))+Math.min(Math.max(c,h,d),0);return l<u?l:u}function xi(s,t,e,n){let r=on(s-.004,t,e)-on(s+.004,t,e),a=on(s,t-.004,e)-on(s,t+.004,e),o=on(s,t,e-.004)-on(s,t,e+.004),l=Math.hypot(r,a,o)||1;return n.set(r/l,a/l,o/l)}function _u(s,t){return s>hr+t?0:s<-hr-t?1:-1}function vu(s){return s===0?-hr:hr}var wy=[[-3072,-4096],[3072,-4096],[-3584,0],[3584,0],[-3072,4096],[3072,4096]],Ey=[[0,-4240],[-1792,-4184],[1792,-4184],[-940,-3308],[940,-3308],[0,-2816],[-3584,-2484],[3584,-2484],[-1788,-2300],[1788,-2300],[-2048,-1036],[0,-1024],[2048,-1036],[-1024,0],[1024,0],[-2048,1036],[0,1024],[2048,1036],[-1788,2300],[1788,2300],[-3584,2484],[3584,2484],[0,2816],[-940,3310],[940,3308],[-1792,4184],[1792,4184],[0,4240]];function ur(){let s=[];for(let[t,e]of wy)s.push({pos:new E(t/100,0,e/100),big:!0,active:!0,timer:0});for(let[t,e]of Ey)s.push({pos:new E(t/100,0,e/100),big:!1,active:!0,timer:0});return s}var Zf=[[-20.48,-25.6],[20.48,-25.6],[-2.56,-38.4],[2.56,-38.4],[0,-46.08]],Jf={1:[[0],[1],[2],[3],[4]],2:[[0,1],[0,3],[2,1],[2,4],[3,4],[0,4],[1,4]],3:[[0,1,4],[0,3,4],[2,1,4],[0,1,2],[0,1,3]],4:[[0,1,2,4],[0,1,3,4]]},dr=[[-23.04,-46.08],[23.04,-46.08],[-26.88,-46.08],[26.88,-46.08]];var us=dt.ballRadius,cs=new E,yu=new E,hs=new E,vc=new E,Kf=new re;function Mu(s,t,e){let n=t.length();n<1e-7||(vc.copy(t).multiplyScalar(1/n),Kf.setFromAxisAngle(vc,n*e),s.premultiply(Kf).normalize())}function Qf(s,t){s.vel.y+=dt.gravity*t,s.vel.multiplyScalar(1-dt.ballDrag*t);let e=s.vel.length();e>dt.ballMaxSpeed&&s.vel.multiplyScalar(dt.ballMaxSpeed/e),s.pos.addScaledVector(s.vel,t);let n=0,r=on(s.pos.x,s.pos.y,s.pos.z)+us;if(r>0){xi(s.pos.x,s.pos.y,s.pos.z,cs),s.pos.addScaledVector(cs,r);let o=s.vel.dot(cs);if(o<0){n=-o;let c=-(1+(o>-.6?0:dt.ballRestitution))*o;s.vel.addScaledVector(cs,c),yu.copy(cs).multiplyScalar(-us),hs.crossVectors(s.angVel,yu).add(s.vel),hs.addScaledVector(cs,-hs.dot(cs));let h=hs.length();if(h>1e-6){let d=Math.min(dt.ballFriction*c,h/3.5);hs.multiplyScalar(1/h),s.vel.addScaledVector(hs,-d),vc.crossVectors(yu,hs).multiplyScalar(-d*2.5/(us*us)),s.angVel.add(vc)}}}let a=s.angVel.length();return a>dt.ballMaxAngVel&&s.angVel.multiplyScalar(dt.ballMaxAngVel/a),n}var yc=class{constructor(){this.pos=new E(0,us,0),this.vel=new E,this.angVel=new E,this.quat=new re,this.prevPos=this.pos.clone(),this.prevQuat=this.quat.clone(),this.radius=us,this.hidden=!1,this.lastTouch=null,this.touches=[]}reset(t=0,e=us,n=0){this.pos.set(t,e,n),this.vel.set(0,0,0),this.angVel.set(0,0,0),this.prevPos.copy(this.pos),this.prevQuat.copy(this.quat),this.hidden=!1,this.lastTouch=null,this.touches.length=0}step(t){if(this.prevPos.copy(this.pos),this.prevQuat.copy(this.quat),this.hidden)return 0;let e=Qf(this,t);return Mu(this.quat,this.angVel,t),e}};function jf(s,t=4,e=1/60){let n={pos:s.pos.clone(),vel:s.vel.clone(),angVel:s.angVel.clone()},i=[],r=2,a=e/r;for(let o=e;o<=t+1e-6;o+=e){for(let l=0;l<r;l++)Qf(n,a);i.push({t:o,pos:n.pos.clone(),vel:n.vel.clone()})}return i}function Ay(){return{throttle:0,steer:0,pitch:0,yaw:0,roll:0,jump:!1,boost:!1,handbrake:!1}}function Ry(s){return s<14?16-14.4*(s/14):s<14.1?1.6*(14.1-s)/.1:0}var ds=[[0,.69],[5,.398],[10,.235],[15,.1375],[17.5,.11],[23,.088]];function Cy(s){if(s<=0)return ds[0][1];for(let t=1;t<ds.length;t++)if(s<=ds[t][0]){let[e,n]=ds[t-1],[i,r]=ds[t];return n+(r-n)*(s-e)/(i-e)}return ds[ds.length-1][1]}var Su=(s,t,e)=>s<t?t:s>e?e:s,bu=[];for(let s of[-1,0,1])for(let t of[-1,0,1])for(let e of[-1,0,1])(s||t||e)&&bu.push([s,t,e]);var Cn=new E,ai=new E,B1=new E,ve=new E,fr=new E,Mc=new E,Pe=new E,tp=new E,pr=new E,_i=new E,bn=new E,ep=new E,Sc=new E,bc=new re,np=new re,Tc=new re,Py=new re,Iy=0,wc=class{constructor({team:t=0,name:e="Joueur",body:n="octane",isBot:i=!1,colors:r=null}={}){this.id=Iy++,this.team=t,this.name=e,this.isBot=i,this.bodyKey=Sn[n]?n:"octane",this.body=Sn[this.bodyKey],this.colors=r;let{hx:a,hy:o,hz:l}=this.body,c=1.4;this.invI=new E(12/(c*(4*o*o+4*l*l)),12/(c*(4*a*a+4*l*l)),12/(c*(4*a*a+4*o*o))),this.clearance=o+dt.rideHeight,this.pos=new E,this.vel=new E,this.quat=new re,this.angVel=new E,this.prevPos=new E,this.prevQuat=new re,this.groundNormal=new E(0,1,0),this.contactNormal=new E(0,1,0),this.rightingAxis=new E,this.controls=Ay(),this.stats={score:0,goals:0,assists:0,saves:0,shots:0,demos:0},this.resetState()}resetState(){this.boost=dt.startBoost,this.onGround=!1,this.jumping=!1,this.jumpTime=0,this.jumpLock=0,this.hasJumped=!1,this.hasDoubleJumped=!1,this.hasFlipped=!1,this.airTimeSinceJump=0,this.flipping=!1,this.flipTime=0,this.flipDir={x:0,y:0},this.prevJump=!1,this.demolished=!1,this.respawnTimer=0,this.boosting=!1,this.supersonic=!1,this.contactTimer=1,this.groundTime=0,this.airTime=0,this.lastExtraHit=-10,this.lastShotTime=-10,this.wheelSpin=0,this.steerVis=0,this.justJumped=!1,this.justDodged=!1,this.righting=0}placeAt(t,e,n,i){this.resetState(),this.pos.set(t,this.clearance,e),this.vel.set(0,0,0),this.angVel.set(0,0,0),this.quat.setFromAxisAngle(Pe.set(0,1,0),Math.atan2(-i,n)),this.prevPos.copy(this.pos),this.prevQuat.copy(this.quat),this.onGround=!0,this.groundNormal.set(0,1,0)}forward(t){return t.set(1,0,0).applyQuaternion(this.quat)}up(t){return t.set(0,1,0).applyQuaternion(this.quat)}right(t){return t.set(0,0,1).applyQuaternion(this.quat)}applyInvInertia(t,e){return Tc.copy(this.quat).invert(),e.copy(t).applyQuaternion(Tc),e.x*=this.invI.x,e.y*=this.invI.y,e.z*=this.invI.z,e.applyQuaternion(this.quat)}demolish(){this.demolished=!0,this.respawnTimer=dt.demoRespawnTime,this.vel.set(0,0,0),this.angVel.set(0,0,0),this.boosting=!1}canDodge(){return!this.hasFlipped&&!this.hasDoubleJumped&&(!this.hasJumped||this.airTimeSinceJump<dt.doubleJumpWindow)}step(t){if(this.prevPos.copy(this.pos),this.prevQuat.copy(this.quat),this.justJumped=!1,this.justDodged=!1,this.demolished)return;let e=this.controls,n=e.jump&&!this.prevJump;this.prevJump=e.jump,this.up(ai);let i=-on(this.pos.x,this.pos.y,this.pos.z);xi(this.pos.x,this.pos.y,this.pos.z,ve),this.jumpLock=Math.max(0,this.jumpLock-t);let r=this.jumpLock<=0&&i<this.clearance+.12&&ai.dot(ve)>.55;this.contactTimer+=t,r?(this.onGround||(this.hasJumped=!1,this.hasDoubleJumped=!1,this.hasFlipped=!1,this.flipping=!1,this.jumping=!1,this.righting=0,this.airTimeSinceJump=0),this.onGround=!0,this.groundTime+=t,this.airTime=0,this.groundNormal.copy(ve),this.driveGround(t,e,n)):(this.onGround=!1,this.groundTime=0,this.airTime+=t,this.airControl(t,e,n)),this.jumping&&(this.jumpTime+=t,e.jump&&this.jumpTime<dt.jumpHoldTime?(this.up(Pe),this.vel.addScaledVector(Pe,dt.jumpHoldAccel*t)):this.jumping=!1),this.boosting=!1,e.boost&&this.boost>0?(this.boosting=!0,this.forward(Cn),this.vel.addScaledVector(Cn,dt.boostAccel*t),this.boost=Math.max(0,this.boost-dt.boostPerSecond*t)):!this.onGround&&e.throttle&&(this.forward(Cn),this.vel.addScaledVector(Cn,dt.airThrottleAccel*e.throttle*t)),this.vel.y+=dt.gravity*t;let a=this.vel.length();if(a>dt.carMaxSpeed&&this.vel.multiplyScalar(dt.carMaxSpeed/a),this.pos.addScaledVector(this.vel,t),r||Mu(this.quat,this.angVel,t),r){let l=-on(this.pos.x,this.pos.y,this.pos.z);if(xi(this.pos.x,this.pos.y,this.pos.z,ve),l<this.clearance){this.pos.addScaledVector(ve,this.clearance-l);let c=this.vel.dot(ve);c<0&&this.vel.addScaledVector(ve,-c)}}this.collideArena();let o=this.vel.length();this.supersonic=o>=(this.supersonic?21:dt.supersonic),this.forward(Cn),this.wheelSpin+=this.vel.dot(Cn)*t/.17,this.steerVis+=(e.steer-this.steerVis)*Math.min(1,t*12)}driveGround(t,e,n){this.up(ai),ai.dot(ve)<.99999&&(np.setFromUnitVectors(ai,ve),bc.copy(Py).slerp(np,1-Math.exp(-t*28)),this.quat.premultiply(bc).normalize()),this.forward(Cn),fr.copy(Cn).addScaledVector(ve,-Cn.dot(ve)).normalize(),Mc.crossVectors(fr,ve);let r=this.vel.dot(fr),a=-e.steer*Cy(Math.abs(r))*r*(e.handbrake?1.3:1),o=a*t;if(o!==0){bc.setFromAxisAngle(ve,o),this.quat.premultiply(bc).normalize();let u=this.vel.dot(ve);Pe.copy(this.vel).addScaledVector(ve,-u),Pe.applyAxisAngle(ve,o*(e.handbrake?.25:1)),this.vel.copy(Pe).addScaledVector(ve,u),fr.applyAxisAngle(ve,o),Mc.applyAxisAngle(ve,o)}r=this.vel.dot(fr);let l=this.vel.dot(Mc),c=e.boost&&this.boost>0?1:e.throttle,h=0;Math.abs(c)>.01?r*c>=-.05?h=c*Ry(Math.abs(r)):h=Math.sign(c)*Math.min(dt.brakeAccel,Math.abs(r)/t):r!==0&&(h=-Math.sign(r)*Math.min(dt.coastAccel,Math.abs(r)/t)),this.vel.addScaledVector(fr,h*t);let d=e.handbrake?2.2:26;this.vel.addScaledVector(Mc,l*Math.exp(-d*t)-l),this.vel.addScaledVector(ve,-dt.stickyAccel*t),this.angVel.copy(ve).multiplyScalar(a),n&&(this.vel.addScaledVector(ve,dt.jumpImpulse),this.jumping=!0,this.jumpTime=0,this.hasJumped=!0,this.hasDoubleJumped=!1,this.hasFlipped=!1,this.airTimeSinceJump=0,this.jumpLock=.1,this.onGround=!1,this.justJumped=!0)}airControl(t,e,n){if(this.hasJumped&&!this.jumping&&(this.airTimeSinceJump+=t),n&&!this.jumping){if(this.up(ai),this.contactTimer<.15&&ai.dot(this.contactNormal)<.55&&this.vel.length()<6){this.vel.addScaledVector(this.contactNormal,3.2),Pe.crossVectors(ai,this.contactNormal),Pe.lengthSq()<1e-4&&this.forward(Pe);let c=Math.acos(Su(ai.dot(this.contactNormal),-1,1));this.rightingAxis.copy(Pe.normalize()).multiplyScalar(dt.maxAngVel),this.righting=c/dt.maxAngVel,this.angVel.copy(this.rightingAxis),this.hasJumped=!0,this.hasFlipped=!0,this.justJumped=!0}else if(this.canDodge()){let c=e.pitch,h=Su(e.yaw+e.roll,-1,1);Math.abs(c)+Math.abs(h)>=.5?this.dodge(c,h):(this.vel.addScaledVector(ai,dt.jumpImpulse),this.hasDoubleJumped=!0,this.justJumped=!0)}}Tc.copy(this.quat).invert();let i=tp.copy(this.angVel).applyQuaternion(Tc),r=e.pitch,a=e.yaw,o=e.roll;if(this.righting>0){this.righting-=t,this.angVel.copy(this.rightingAxis);return}if(this.flipping&&(this.flipTime+=t,this.flipTime>=dt.flipTime+.5&&(this.flipping=!1)),this.flipping&&this.flipTime<dt.flipTime){let c=Su(-r*Math.sign(this.flipDir.x),0,1);i.x=this.flipDir.y*dt.maxAngVel,i.z=-this.flipDir.x*dt.maxAngVel*(1-c),i.y+=(-a*dt.airYawAccel-dt.airYawDamp*i.y*(1-Math.abs(a)))*t,this.flipTime>=.15&&(this.vel.y<0||this.flipTime<.21)&&(this.vel.y*=Math.pow(.65,t*120))}else{let c=this.flipping?0:1;i.x+=(o*dt.airRollAccel-dt.airRollDamp*i.x*c)*t,i.z+=(-r*dt.airPitchAccel-dt.airPitchDamp*i.z*(1-Math.abs(r))*c)*t,i.y+=(-a*dt.airYawAccel-dt.airYawDamp*i.y*(1-Math.abs(a)))*t}let l=i.length();l>dt.maxAngVel&&i.multiplyScalar(dt.maxAngVel/l),this.angVel.copy(i).applyQuaternion(this.quat)}dodge(t,e){let n=Math.hypot(t,e);t/=n,e/=n,this.forward(Cn),Pe.set(Cn.x,0,Cn.z),Pe.lengthSq()<1e-4&&this.up(Pe).set(-Pe.x,0,-Pe.z),Pe.normalize(),pr.set(-Pe.z,0,Pe.x);let i=this.vel.dot(Pe),r=Math.abs(i)/dt.carMaxSpeed,a=Math.abs(i)<1?t<0:t>=0!=i>0,o=t*dt.dodgeImpulse,l=e*dt.dodgeImpulse;a&&(o*=(1.5*r+1)*(16/15)),l*=.9*r+1,this.vel.addScaledVector(Pe,o).addScaledVector(pr,l),this.flipping=!0,this.flipTime=0,this.flipDir.x=t,this.flipDir.y=e,this.hasFlipped=!0,this.justDodged=!0}collideArena(){let{hx:t,hy:e,hz:n}=this.body;for(let i=0;i<3;i++){let r=0,a=0;for(let l of bu){bn.set(l[0]*t,l[1]*e,l[2]*n).applyQuaternion(this.quat).add(this.pos);let c=on(bn.x,bn.y,bn.z);c>0&&(a++,c>r&&(r=c,_i.copy(bn)))}if(a===0)break;xi(_i.x,_i.y,_i.z,ve),this.pos.addScaledVector(ve,r),this.contactNormal.copy(ve),this.contactTimer=0,_i.set(0,0,0),Sc.set(0,0,0);let o=0;for(let l of bu)bn.set(l[0]*t,l[1]*e,l[2]*n).applyQuaternion(this.quat).add(this.pos),on(bn.x,bn.y,bn.z)>-.03&&(_i.add(bn),Sc.add(xi(bn.x,bn.y,bn.z,ve)),o++);o!==0&&(ep.copy(_i).multiplyScalar(1/o),Sc.normalize(),this.contactImpulse(ep,Sc,.15,.55))}this.contactTimer===0&&!this.onGround&&this.vel.lengthSq()<.5&&this.angVel.lengthSq()<.8&&Math.max(-this.up(Pe).dot(this.contactNormal),Math.abs(this.right(Pe).dot(this.contactNormal)))>.9&&(this.vel.multiplyScalar(.85),this.angVel.multiplyScalar(.8))}contactImpulse(t,e,n,i){let r=Pe.copy(t).sub(this.pos),a=tp.crossVectors(this.angVel,r).add(this.vel),o=a.dot(e);if(o>=0)return;let l=pr.crossVectors(r,e),c=this.applyInvInertia(l,pr),h=1+e.dot(_i.crossVectors(c,r)),d=-(1+(o<-1.5?n:0))*o/h;this.vel.addScaledVector(e,d),this.angVel.addScaledVector(c,d),a.crossVectors(this.angVel,r).add(this.vel),a.addScaledVector(e,-a.dot(e));let u=a.length();if(u<1e-5)return;let f=a.multiplyScalar(1/u),m=pr.crossVectors(r,f),v=this.applyInvInertia(m,pr),p=1+f.dot(_i.crossVectors(v,r)),g=Math.min(u/p,i*d);this.vel.addScaledVector(f,-g),this.angVel.addScaledVector(v,-g)}};var Vi=dt.ballMass,Hi=dt.carMass,Gn=dt.ballRadius,en=new E,ie=new E,ip=new E,Wa=new E,Ec=new E,Ac=new E,Rc=new E,Cc=new E,Wn=new E,Ya=new E,sp=new re,mr=(s,t,e)=>s<t?t:s>e?e:s;function Ly(s){return s<=5?.65:s<=23?.65-.1*(s-5)/18:s<=46?.55-.25*(s-23)/23:.3}function dp(s,t,e){if(s.demolished||t.hidden)return 0;let{hx:n,hy:i,hz:r}=s.body;if(sp.copy(s.quat).invert(),en.copy(t.pos).sub(s.pos).applyQuaternion(sp),Math.abs(en.x)>n+Gn||Math.abs(en.y)>i+Gn||Math.abs(en.z)>r+Gn)return 0;let a=mr(en.x,-n,n),o=mr(en.y,-i,i),l=mr(en.z,-r,r);ie.set(en.x-a,en.y-o,en.z-l);let c=ie.length();if(c>=Gn)return 0;let h;if(c>1e-6)ie.multiplyScalar(1/c),h=Gn-c;else{let y=n-Math.abs(en.x),b=i-Math.abs(en.y),T=r-Math.abs(en.z);y<b&&y<T?(ie.set(Math.sign(en.x)||1,0,0),h=y+Gn):b<T?(ie.set(0,Math.sign(en.y)||1,0),h=b+Gn):(ie.set(0,0,Math.sign(en.z)||1),h=T+Gn)}ip.set(a,o,l).applyQuaternion(s.quat).add(s.pos),ie.applyQuaternion(s.quat),t.pos.addScaledVector(ie,h*Hi/(Vi+Hi)),s.pos.addScaledVector(ie,-h*Vi/(Vi+Hi)),Wa.copy(ip).sub(s.pos),Ec.copy(ie).multiplyScalar(-Gn),Ac.crossVectors(s.angVel,Wa).add(s.vel),Rc.crossVectors(t.angVel,Ec).add(t.vel);let d=Cc.copy(Rc).sub(Ac),u=d.dot(ie);if(u>=0)return 0;let f=Math.min(Math.hypot(t.vel.x-s.vel.x,t.vel.y-s.vel.y,t.vel.z-s.vel.z),46),m=s.applyInvInertia(Wn.crossVectors(Wa,ie),Wn).multiplyScalar(1/Hi),v=1/Vi+1/Hi+ie.dot(Ya.crossVectors(m,Wa)),p=-u/v;t.vel.addScaledVector(ie,p/Vi),s.vel.addScaledVector(ie,-p/Hi),s.angVel.addScaledVector(m,-p),Ac.crossVectors(s.angVel,Wa).add(s.vel),Rc.crossVectors(t.angVel,Ec).add(t.vel),d.copy(Rc).sub(Ac),d.addScaledVector(ie,-d.dot(ie));let g=d.length();if(g>1e-5){let y=d.multiplyScalar(1/g),b=Math.min(g/(3.5/Vi+1/Hi),2*p);t.vel.addScaledVector(y,-b/Vi),s.vel.addScaledVector(y,b/Hi),Wn.crossVectors(Ec,y).multiplyScalar(-b/(.4*Vi*Gn*Gn)),t.angVel.add(Wn)}let M=-u;M>.4&&e-s.lastExtraHit>.05&&(s.lastExtraHit=e,Wn.copy(t.pos).sub(s.pos),Wn.y*=.35,Wn.normalize(),s.forward(Ya),Wn.addScaledVector(Ya,-Wn.dot(Ya)*.35).normalize(),t.vel.addScaledVector(Wn,f*Ly(f)));let w=t.vel.length();return w>dt.ballMaxSpeed&&t.vel.multiplyScalar(dt.ballMaxSpeed/w),M}var rp=.36,ap=new E,op=new E,lp=new E,cp=new E,hp=new E,up=new E,Xa=new E,qa=new E;function Dy(s,t,e,n,i,r){let a=Cc.copy(t).sub(s),o=Wn.copy(n).sub(e),l=Ya.copy(s).sub(e),c=a.dot(a),h=o.dot(o),d=o.dot(l),u=a.dot(l),f=a.dot(o),m=c*h-f*f,v=m>1e-8?mr((f*d-u*h)/m,0,1):0,p=(f*v+d)/h;p<0?(p=0,v=mr(-u/c,0,1)):p>1&&(p=1,v=mr((f-u)/c,0,1)),i.copy(s).addScaledVector(a,v),r.copy(e).addScaledVector(o,p)}function fp(s,t){if(s.demolished||t.demolished||s.pos.distanceToSquared(t.pos)>4)return null;s.forward(Xa),t.forward(qa);let e=s.body.hx-.28,n=t.body.hx-.28;ap.copy(s.pos).addScaledVector(Xa,-e),op.copy(s.pos).addScaledVector(Xa,e),lp.copy(t.pos).addScaledVector(qa,-n),cp.copy(t.pos).addScaledVector(qa,n),Dy(ap,op,lp,cp,hp,up),ie.copy(up).sub(hp);let i=ie.length();if(i>=rp*2||i<1e-6)return null;ie.multiplyScalar(1/i);let r=rp*2-i;s.pos.addScaledVector(ie,-r/2),t.pos.addScaledVector(ie,r/2);let a=Cc.copy(t.vel).sub(s.vel).dot(ie);if(a>=0)return null;if(s.team!==t.team){if(s.supersonic&&Xa.dot(ie)>.55&&s.vel.dot(ie)>12)return t.demolish(),{type:"demo",attacker:s,victim:t};if(t.supersonic&&-qa.dot(ie)>.55&&-t.vel.dot(ie)>12)return s.demolish(),{type:"demo",attacker:t,victim:s}}let o=-(1+.25)*a/2;s.vel.addScaledVector(ie,-o),t.vel.addScaledVector(ie,o);let l=null,c=null;if(Xa.dot(ie)>.5&&s.vel.dot(ie)>4?(l=s,c=t):-qa.dot(ie)>.5&&-t.vel.dot(ie)>4&&(l=t,c=s,ie.negate()),l){let h=-a;return c.vel.addScaledVector(ie,h*.45),c.vel.y+=h*(c.onGround?.3:.12),c.jumpLock=.1,c.angVel.add(Cc.set((Math.random()-.5)*3,(Math.random()-.5)*2,(Math.random()-.5)*3)),{type:"bump",attacker:l,victim:c,strength:h}}return{type:"touch",attacker:s,victim:t,strength:-a}}var gr={goal:100,assist:50,save:50,epicSave:75,shot:20,demo:25},Ny=2,Uy=720;function Fy(s){for(let t=s.length-1;t>0;t--){let e=Math.floor(Math.random()*(t+1));[s[t],s[e]]=[s[e],s[t]]}return s}function Pc(s,t=3.5){for(let e of s){if(e.t>t)break;let n=_u(e.pos.z,dt.ballRadius*.5);if(n>=0)return{team:n,t:e.t}}return null}var $a=class{constructor(t){this.opts={duration:300,freeplay:!1,unlimitedBoost:!1,replays:!0,...t},this.ball=new yc,this.cars=this.opts.players.map(e=>new wc(e)),this.pads=ur(),this.score=[0,0],this.timeLeft=this.opts.duration,this.overtime=!1,this.overtimeElapsed=0,this.time=0,this.tickCount=0,this.state="countdown",this.stateTime=0,this.clockRunning=!1,this.events=[],this.frames=[],this.prediction=[],this.goalInfo=null,this.skipRequested=!1,this.replay=null,this.winner=-1,this.lastCountdown=4,this.opts.freeplay?this.startFreeplay():this.resetKickoff()}emit(t){this.events.push(t)}teamCars(t){return this.cars.filter(e=>e.team===t)}startFreeplay(){this.ball.reset(0,dt.ballRadius,0);let t=dr;this.cars.forEach((e,n)=>{let[i,r]=t[n%t.length],a=e.team===0?1:-1;e.placeAt(i*a,r*a,0,a),e.boost=100}),this.state="playing",this.stateTime=0,this.refreshPrediction()}resetKickoff(){this.ball.reset(0,dt.ballRadius,0);for(let n of this.pads)n.active=!0,n.timer=0;for(let n=0;n<2;n++){let i=this.teamCars(n),r=Math.min(Math.max(i.length,1),4),a=Jf[r],o=Fy([...a[Math.floor(Math.random()*a.length)]]);i.forEach((l,c)=>{let h=n===0?1:-1,d,u;c<o.length?[d,u]=Zf[o[c]]:[d,u]=dr[c%dr.length],d*=h,u*=h,l.placeAt(d,u,-d,-u),l.boost=dt.startBoost})}let t=this.teamCars(0),e=this.teamCars(1);for(let n=0;n<Math.min(t.length,e.length);n++){let i=t[n];e[n].placeAt(-i.pos.x,-i.pos.z,i.pos.x,i.pos.z),e[n].boost=dt.startBoost}this.state="countdown",this.stateTime=0,this.clockRunning=!1,this.lastCountdown=4,this.kickoff=!0,this.refreshPrediction(),this.emit({type:"kickoff"})}refreshPrediction(){this.prediction=jf(this.ball,4,1/60)}requestSkip(){this.skipRequested=!0}tick(t){switch(this.time+=t,this.stateTime+=t,this.tickCount++,this.state){case"countdown":{let e=Math.ceil(3-this.stateTime);e<this.lastCountdown&&e>0&&(this.lastCountdown=e,this.emit({type:"countdown",n:e}));for(let n of this.cars)n.prevPos.copy(n.pos),n.prevQuat.copy(n.quat),n.prevJump=n.controls.jump;this.ball.prevPos.copy(this.ball.pos),this.stateTime>=3&&(this.state="playing",this.stateTime=0,this.emit({type:"go"})),this.record();break}case"playing":this.simulate(t,!0),this.updateClock(t);break;case"goal":this.simulate(t,!1),this.stateTime>(this.opts.freeplay?2:3)&&(this.opts.freeplay?(this.ball.reset(0,dt.ballRadius,0),this.state="playing",this.stateTime=0,this.refreshPrediction()):this.opts.replays?this.startReplay():this.afterGoal());break;case"replay":this.replay.time+=t,!this.replay.goalShown&&this.replay.time>=this.replay.goalTime&&(this.replay.goalShown=!0,this.emit({type:"replayGoal",team:this.goalInfo.team,pos:this.goalInfo.pos.clone()})),(this.replay.time>=this.replay.end||this.skipRequested&&this.stateTime>.3)&&(this.replay=null,this.afterGoal());break;case"overtime":this.stateTime>2.5&&this.resetKickoff();break;default:break}this.skipRequested=!1}updateClock(t){if(this.opts.freeplay||!this.clockRunning)return;if(this.overtime){this.overtimeElapsed+=t;return}this.opts.duration<=0||(this.timeLeft=Math.max(0,this.timeLeft-t),this.timeLeft>0)||!(this.ball.pos.y-this.ball.radius<.08)||(this.score[0]!==this.score[1]?this.endMatch():(this.overtime=!0,this.state="overtime",this.stateTime=0,this.emit({type:"overtime"})))}endMatch(){this.state="ended",this.stateTime=0,this.winner=this.score[0]>this.score[1]?0:1,this.emit({type:"end",winner:this.winner})}afterGoal(){if(this.overtime)return this.endMatch();if(this.opts.duration>0&&this.timeLeft<=0){if(this.score[0]!==this.score[1])return this.endMatch();this.overtime=!0,this.state="overtime",this.stateTime=0,this.emit({type:"overtime"});return}this.resetKickoff()}simulate(t,e){let{cars:n,ball:i}=this;for(let o of n){if(o.demolished){o.respawnTimer-=t,o.respawnTimer<=0&&this.respawn(o),o.prevPos.copy(o.pos);continue}o.step(t),this.opts.unlimitedBoost&&(o.boost=100),o.justJumped&&this.emit({type:"jump",car:o}),o.justDodged&&this.emit({type:"dodge",car:o})}let r=null;if(e&&!i.hidden){let o=i.step(t);o>2&&this.emit({type:"bounce",pos:i.pos.clone(),strength:o});for(let l of n){let c=dp(l,i,this.time);if(c>0){if(c>1.2||!i.lastTouch||i.lastTouch.car!==l||this.time-i.lastTouch.time>.4){let h={car:l,time:this.time};i.touches.push(h),i.touches.length>20&&i.touches.shift(),c>1.2&&this.emit({type:"hit",car:l,pos:i.pos.clone(),strength:c}),r=r||[],r.push(l)}i.lastTouch={car:l,time:this.time},this.kickoff&&(this.kickoff=!1),this.clockRunning=!0}}}else i.prevPos.copy(i.pos),i.prevQuat.copy(i.quat);for(let o=0;o<n.length;o++)for(let l=o+1;l<n.length;l++){let c=fp(n[o],n[l]);c&&(c.type==="demo"?(this.state==="playing"&&(c.attacker.stats.demos++,this.addPoints(c.attacker,gr.demo,"D\xC9MOLITION")),this.emit({type:"demo",attacker:c.attacker,victim:c.victim,pos:c.victim.pos.clone()})):c.type==="bump"&&this.emit({type:"bump",attacker:c.attacker,victim:c.victim,strength:c.strength,pos:c.victim.pos.clone()}))}this.updatePads(t);let a=this.prediction;if((r||this.tickCount%4===0)&&this.refreshPrediction(),r&&this.state==="playing"&&this.touchStats(r,a),e&&!i.hidden&&this.state==="playing"){let o=_u(i.pos.z,i.radius);o>=0&&this.onGoal(o)}this.record()}touchStats(t,e){let n=Pc(e,2.5),i=Pc(this.prediction,3.5);for(let r of t)if(i&&i.team===r.team&&this.time-r.lastShotTime>1.5&&(r.lastShotTime=this.time,r.stats.shots++,this.addPoints(r,gr.shot,"TIR CADR\xC9")),n&&n.team!==r.team&&(!i||i.team===r.team)){let a=n.t<.35;r.stats.saves++,this.addPoints(r,a?gr.epicSave:gr.save,a?"ARR\xCAT \xC9PIQUE":"ARR\xCAT")}}addPoints(t,e,n){t.stats.score+=e,this.emit({type:"stat",car:t,points:e,label:n})}respawn(t){let e=this.teamCars(t.team),n=Math.max(0,e.indexOf(t)),[i,r]=dr[n%dr.length],a=t.team===0?1:-1,o=t.stats;t.placeAt(i*a,r*a,0,a),t.stats=o,this.emit({type:"respawn",car:t})}updatePads(t){for(let e of this.pads){if(!e.active){e.timer-=t,e.timer<=0&&(e.active=!0);continue}let n=e.big?2.08:1.44,i=e.big?1.68:1.65;for(let r of this.cars){if(r.demolished||r.boost>=100)continue;let a=r.pos.x-e.pos.x,o=r.pos.z-e.pos.z;if(a*a+o*o<n*n&&r.pos.y<i){r.boost=Math.min(100,r.boost+(e.big?100:12)),e.active=!1,e.timer=e.big?10:4,this.emit({type:"pad",car:r,big:e.big,pos:e.pos});break}}}}onGoal(t){let{ball:e}=this;this.score[t]++;let n=e.touches,i=null,r=null,a=-1;for(let c=n.length-1;c>=0;c--)if(n[c].car.team===t){i=n[c].car,a=c;break}if(i){for(let c=a-1;c>=0;c--){let h=n[c];if(h.car.team!==t)break;if(h.car!==i){n[a].time-h.time<5&&(r=h.car);break}}i.stats.goals++,this.addPoints(i,gr.goal,"BUT"),r&&(r.stats.assists++,this.addPoints(r,gr.assist,"PASSE D\xC9CISIVE"))}let o=Math.round(e.vel.length()*3.6),l=!i&&e.lastTouch&&e.lastTouch.car.team!==t?e.lastTouch.car:null;this.goalInfo={team:t,scorer:i,assist:r,ownGoal:l,pos:e.pos.clone(),speedKmh:o,time:this.time},this.emit({type:"goal",...this.goalInfo});for(let c of this.cars){if(c.demolished)continue;let h=c.pos.distanceTo(e.pos);if(h<14){let d=c.pos.clone().sub(e.pos).normalize();c.vel.addScaledVector(d,(14-h)*1.6),c.vel.y+=(14-h)*.5,c.jumpLock=.2}}e.hidden=!0,this.state="goal",this.stateTime=0}record(){if(this.tickCount%Ny!==0)return;let t=this.ball,e={t:this.time,ball:[t.pos.x,t.pos.y,t.pos.z,t.quat.x,t.quat.y,t.quat.z,t.quat.w,t.hidden?1:0],cars:this.cars.map(n=>[n.pos.x,n.pos.y,n.pos.z,n.quat.x,n.quat.y,n.quat.z,n.quat.w,n.boosting?1:0,n.demolished?1:0,n.steerVis,n.wheelSpin,n.supersonic?1:0])};this.frames.push(e),this.frames.length>Uy&&this.frames.shift()}startReplay(){let t=this.goalInfo.time,e=this.frames.length?this.frames[0].t:t,n=Math.max(e,t-5.5);this.replay={time:n,start:n,end:t+1.2,goalTime:t,goalShown:!1,frames:this.frames.slice()},this.state="replay",this.stateTime=0,this.emit({type:"replayStart"})}replaySnapshot(t){let e=this.replay?this.replay.frames:this.frames;if(!e.length)return null;let n=0,i=e.length-1;if(t<=e[0].t)i=0;else if(t>=e[i].t)n=i;else for(;i-n>1;){let l=n+i>>1;e[l].t<=t?n=l:i=l}let r=e[n],a=e[i],o=i===n?0:(t-r.t)/(a.t-r.t);return{a:r,b:a,k:o}}};var pn=(s,t,e)=>s<t?t:s>e?e:s,j1=dt.ballRadius,gp=new E(0,dt.gravity,0),qn=new E,Za=new E,vr=new E,Gi=new E,xr=new re,Ye=new re,pp=new ce;function Oy(s){return s<14?16-14.4*(s/14):s<14.1?1.6*(14.1-s)/.1:0}function mp(s){s.throttle=0,s.steer=0,s.pitch=0,s.yaw=0,s.roll=0,s.jump=!1,s.boost=!1,s.handbrake=!1}function Xn(s,t){return xr.copy(s.quat).invert(),Gi.copy(t).sub(s.pos).applyQuaternion(xr),{angle:Math.atan2(Gi.z,Gi.x),dist:Math.hypot(Gi.x,Gi.z),lx:Gi.x,ly:Gi.y,lz:Gi.z}}function Tu(s){return s.forward(vr),s.vel.dot(vr)}function Au(s,t,e,n){let i=qn.copy(e).normalize(),r=Za.crossVectors(i,n);r.lengthSq()<1e-4&&s.right(r),r.normalize();let a=vr.crossVectors(r,i).normalize();pp.makeBasis(i,a,r),Ye.setFromRotationMatrix(pp),xr.copy(s.quat).invert(),Ye.multiply(xr),Ye.w<0&&(Ye.x=-Ye.x,Ye.y=-Ye.y,Ye.z=-Ye.z,Ye.w=-Ye.w);let o=Math.hypot(Ye.x,Ye.y,Ye.z),l=2*Math.atan2(o,Ye.w),c=qn.set(Ye.x,Ye.y,Ye.z);o>1e-6&&c.multiplyScalar(l/o),c.applyQuaternion(xr);let h=Za.copy(s.angVel).applyQuaternion(xr),d=5.5,u=9,f=(c.x*d*1.6-h.x)*u*1.6,m=(c.y*d-h.y)*u,v=(c.z*d-h.z)*u;return t.roll=pn(f/dt.airRollAccel,-1,1),t.yaw=pn(-m/dt.airYawAccel,-1,1),t.pitch=pn(-v/dt.airPitchAccel,-1,1),l}var _r=class{constructor(t,e,n=!1){this.dx=t,this.dy=e,this.t=0,this.boost=n}update(t,e,n){return this.t+=t,e.throttle=1,e.boost=this.boost&&this.t<.5,this.t<.07?e.jump=!0:this.t<.1?e.jump=!1:this.t<.14?(e.jump=!0,e.pitch=this.dx,e.yaw=this.dy):e.pitch=this.dx*.3,this.t>.35&&n.onGround?!0:this.t>1.3}},wu=class{constructor(t,e,n){this.bot=t,this.target=e.clone(),this.arrival=n,this.t=0,this.dodged=!1}update(t,e,n,i){this.t+=t,e.throttle=1;let r=i.ball;if(this.t<.2)return e.jump=!0,!1;if(!this.dodged){let a=Xn(n,r.pos),o=n.pos.distanceTo(r.pos);return o<2.6||this.t>.9?(n.canDodge()&&o<3.2&&(e.jump=!0,e.pitch=Math.cos(a.angle),e.yaw=Math.sin(a.angle)),this.dodged=!0):(n.forward(qn),Au(n,e,qn.set(r.pos.x-n.pos.x,0,r.pos.z-n.pos.z),new E(0,1,0))),!1}return n.onGround&&this.t>.4?!0:this.t>2}},Eu=class{constructor(t,e){this.target=t.clone(),this.arrival=e,this.t=0}update(t,e,n,i){this.t+=t;let r=this.arrival-i.time;if(r<-.25||this.t>4.5||n.onGround&&this.t>.3||i.ball.lastTouch&&i.ball.lastTouch.time>i.time-.05&&this.t>.3)return!0;let a=Math.max(r,.08),o=qn.copy(this.target).sub(n.pos).addScaledVector(n.vel,-a).multiplyScalar(2/(a*a)).sub(gp),l=o.length(),c=o.clone().normalize();if(this.t<.2)e.jump=!0;else if(this.t<.24)e.jump=!1;else if(this.t<.28&&!n.hasDoubleJumped)return e.jump=!0,e.boost=!0,!1;let h=new E(0,1,0),d=Au(n,e,c,h);return n.forward(Za),e.boost=l>1.2&&Za.dot(c)>.85&&n.boost>0,this.t<.2&&d>.6&&(e.boost=!1),!1}},Ja=class{constructor(t,e="pro"){this.car=t,this.d=Ha[e]||Ha.pro,this.maneuver=null,this.plan=null,this.planTimer=0,this.aimOffset=0,this.stuckTime=0,this.reach=new Float32Array(260)}update(t,e){let n=this.car,i=n.controls,r=i.jump;if(mp(i),n.demolished){this.maneuver=null;return}if(e.state==="countdown"){this.maneuver=null,this.plan=null;return}if(!(e.state!=="playing"&&e.state!=="goal")){if(this.maneuver){if(!this.maneuver.update(t,i,n,e,this))return;this.maneuver=null,mp(i)}if(this.planTimer-=t,(this.planTimer<=0||!this.plan)&&(this.plan=this.makePlan(e),this.planTimer=this.d.reaction+Math.random()*.05),!n.onGround){this.recover(i,n),r&&n.jumping&&(i.jump=!0);return}this.execute(t,i,e),this.unstick(t,i,n)}}unstick(t,e,n){!(n.vel.length()>1.5)&&Math.abs(e.throttle)>.5?this.stuckTime+=t:this.stuckTime=0,this.stuckTime>1.2&&(this.stuckTime=0,this.maneuver=new _r(-1,0)),n.onGround&&n.groundNormal.y<.35&&n.groundTime>.8&&this.plan&&this.plan.target&&this.plan.target.y<3&&(this.maneuver=new _r(0,0),this.maneuver.update=function(a,o,l){return this.t+=a,o.jump=this.t<.12,o.throttle=1,this.t>.25&&(l.onGround||this.t>1.5)})}recover(t,e){e.vel.lengthSq();let n=qn.set(e.vel.x,0,e.vel.z);n.lengthSq()<1&&e.forward(n).setY(0),n.lengthSq()<1e-4&&n.set(1,0,0),Au(e,t,n.clone(),new E(0,1,0)),t.throttle=1}computeReach(){let t=this.car,e=Math.max(0,Tu(t)),n=this.d.boostUse>.3?t.boost:0,i=0,r=1/60;for(let a=0;a<this.reach.length;a++){let o=Oy(e);n>0&&(o+=dt.boostAccel,n-=dt.boostPerSecond*r),e=Math.min(dt.carMaxSpeed*this.d.speed,e+o*r),i+=e*r,this.reach[a]=i}}reachIn(t){let e=Math.floor(t*60);return e<0?0:this.reach[Math.min(e,this.reach.length-1)]}findIntercept(t,e){let n=this.car;this.computeReach();let i=t.prediction,r=5+this.d.aerial*10;for(let a=0;a<i.length;a+=2){let o=i[a],l=o.pos.y,c=Xn(n,o.pos),h=Math.abs(c.angle)*.32,d=Math.max(0,c.dist-1.4);if(l<1.9){if(this.reachIn(o.t-h)>=d)return{slice:o,kind:"ground"}}else if(l<3.3&&this.d.flips>.5){if(this.reachIn(o.t-h-.15)>=d)return{slice:o,kind:"jump"}}else if(e&&l<r&&n.boost>25&&o.t>.6){let u=o.t,f=qn.copy(o.pos).sub(n.pos).addScaledVector(n.vel,-u);f.y-=3*u,f.multiplyScalar(2/(u*u)).sub(gp);let m=n.boost/dt.boostPerSecond;if(f.length()<dt.boostAccel*.8&&m>u*.8&&Math.abs(c.angle)<.5)return{slice:o,kind:"aerial"}}}return null}makePlan(t){let e=this.car,n=t.ball,i=e.team,r=i===0?1:-1,a=vu(i);this.aimOffset=(Math.random()-.5)*(1-this.d.aim)*12;let o=t.cars.filter(f=>f.team===i&&!f.demolished);if(t.kickoff&&n.vel.lengthSq()<.01&&Math.abs(n.pos.x)+Math.abs(n.pos.z)<.1){let m=o.slice().sort((v,p)=>{let g=v.pos.length()-p.pos.length();return Math.abs(g)>.5?g:p.pos.x*r-v.pos.x*r}).indexOf(e);return m===0?{kind:"kickoff"}:m===1?this.boostPlan(t,!0)||{kind:"defend"}:{kind:"defend"}}let l=Pc(t.prediction,3),c=l&&l.team!==i,h=null,d=1/0;for(let f of o){let m=(n.pos.z-f.pos.z)*r>-1,v=f.pos.distanceTo(n.pos)+(m?0:18);f.isBot||(v-=4),f===e&&(v-=1),v<d&&(d=v,h=f)}if(h===e||c&&this.closestToGoal(o,a)===e){let f=this.findIntercept(t,this.d.aerial>0&&(!c||this.d.aerial>.7));if(!f)return{kind:"chase"};let m=f.slice.pos;if(!((m.z-e.pos.z)*r>.5)&&!c){let p=e.pos.x>m.x?1:-1,g=m.z-r*9;return{kind:"rotate",target:new E(pn(m.x+p*6,-ae.W+4,ae.W-4),0,pn(g,-ae.L+3,ae.L-3))}}return f.kind==="aerial"?{kind:"aerial",target:m.clone(),arrival:t.time+f.slice.t}:{kind:"attack",ball:m.clone(),arrival:t.time+f.slice.t,jump:f.kind==="jump",save:c,allowBoost:Math.random()<this.d.boostUse}}if(e.boost<40&&!c){let f=this.boostPlan(t,!1);if(f)return f}if(o.filter(f=>f!==h).indexOf(e)===0&&o.length>2){let f=n.pos.clone().lerp(new E(0,0,a),.45);return f.x=pn(f.x-Math.sign(n.pos.x||1)*6,-ae.W+6,ae.W-6),f.y=0,{kind:"support",target:f}}return{kind:"defend"}}closestToGoal(t,e){let n=null,i=1/0;for(let r of t){let a=Math.abs(r.pos.z-e)+Math.abs(r.pos.x)*.5;a<i&&(i=a,n=r)}return n}boostPlan(t,e){let n=this.car,i=n.team===0?1:-1,r=null,a=1/0;for(let o of t.pads){if(!o.big||!o.active)continue;let l=o.pos.z*i<=.1,c=n.pos.distanceTo(o.pos)+(l?0:25)+(e&&Math.abs(o.pos.z)<1?50:0);c<a&&(a=c,r=o)}return!r||!e&&a>45?null:{kind:"boost",target:r.pos.clone()}}execute(t,e,n){let i=this.car,r=this.plan,a=n.ball,o=i.team,l=o===0?1:-1,c=vu(o),h=Tu(i);switch(r.kind){case"kickoff":{let d=Xn(i,a.pos),u=qn.copy(a.pos);if(u.z-=l*.9,this.driveTo(e,u,23,!0),d.dist<1.7+h*.17&&h>10){let f=d.angle;this.maneuver=new _r(Math.cos(f),pn(Math.sin(f)*1.5,-1,1),!0)}break}case"attack":{let d=r.ball,u=Math.max(r.arrival-n.time,.02);if(r.arrival<n.time-.3){this.planTimer=0;break}let f=-c,m=pn(d.x*.25+this.aimOffset,-ae.GW+1.8,ae.GW-1.8);r.save&&Math.abs(d.z-c)<25&&(m=d.x>0?ae.W:-ae.W);let v=Za.set(m-d.x,0,f+l*3-d.z).normalize(),p=Xn(i,d),g=pn(p.dist*.4,1.3,7),M=new E(d.x-v.x*g,0,d.z-v.z*g);(Math.abs(M.x)>ae.W-1.5||Math.abs(M.z)>ae.L-1.5)&&M.set(d.x,0,d.z);let y=Xn(i,M).dist/u+2;p.dist>25&&(y=23),this.driveTo(e,M,y*this.d.speed,r.allowBoost),i.forward(vr);let b=vr.x*v.x+vr.z*v.z;if(r.jump){let T=Math.hypot(d.x-i.pos.x,d.z-i.pos.z);u<.55&&T<h*u+2.2&&Math.abs(p.angle)<.5&&(this.maneuver=new wu(this,d,r.arrival))}else if(i.pos.distanceTo(a.pos)<2.4+h*.13&&a.pos.y<2&&Math.abs(p.angle)<.35&&b>.55&&h>7&&Math.random()<this.d.flips*.25){let P=Xn(i,a.pos).angle;this.maneuver=new _r(Math.cos(P),pn(Math.sin(P)*1.6,-1,1))}break}case"aerial":{let d=Xn(i,r.target);Math.abs(d.angle)<.25||r.arrival-n.time<1.2?this.maneuver=new Eu(r.target,r.arrival):this.driveTo(e,qn.set(r.target.x,0,r.target.z),10,!1);break}case"rotate":case"support":case"boost":{let d=Xn(i,r.target),u=r.kind==="support"?pn(d.dist*1.2,4,23):23;this.driveTo(e,r.target,u,r.kind!=="support"&&this.d.boostUse>.5),d.dist<2&&(this.planTimer=0);break}case"chase":{this.driveTo(e,qn.set(a.pos.x,0,a.pos.z-l*3),16,!1);break}default:{let d=a.pos.x>0?-1:1,u=qn.set(d*3.5,0,c+l*3.5),f=Xn(i,u);if(f.dist>4)this.driveTo(e,u,pn(f.dist*1.1,5,23),f.dist>25);else{let m=Xn(i,a.pos);e.steer=pn(m.angle*2.5,-1,1),e.throttle=Math.abs(m.angle)>.3?.35:h>.5?-.3:0,Math.abs(m.angle)>2.2&&(e.throttle=-.4),this.planTimer=Math.min(this.planTimer,.2)}break}}}driveTo(t,e,n,i){let r=this.car,a=Xn(r,e),o=Tu(r);t.steer=pn(a.angle*3.2,-1,1),t.handbrake=Math.abs(a.angle)>1.6&&o>7&&a.dist>2.5,n>o+.3?t.throttle=1:n<o-3?t.throttle=-1:t.throttle=.1,Math.abs(a.angle)>2.4&&a.dist<6&&o<4&&(t.throttle=-1,t.steer=-t.steer),t.boost=i&&r.boost>0&&Math.abs(a.angle)<.3&&n>o+1.5&&o<dt.carMaxSpeed-.3&&r.groundNormal.y>.7}};function oi(s,t){let e=document.createElement("canvas");return e.width=s,e.height=t,[e,e.getContext("2d")]}function Wi(s,t=!1){let e=new ji(s);return e.colorSpace=We,e.anisotropy=8,t&&(e.wrapS=e.wrapT=Ri),e}function By(s,t,e,n,i,r){s.beginPath(),s.moveTo(t+r,e),s.lineTo(t+n-r,e),s.arcTo(t+n,e,t+n,e+r,r),s.lineTo(t+n,e+i-r),s.arcTo(t+n,e+i,t+n-r,e+i,r),s.lineTo(t+r,e+i),s.arcTo(t,e+i,t,e+i-r,r),s.lineTo(t,e+r),s.arcTo(t,e,t+r,e,r),s.closePath()}function xp(s){let{W:t,L:e,RC:n,GW:i}=ae,r=20,a=Math.round(t*2*r),o=Math.round(e*2*r),[l,c]=oi(a,o),h=p=>(p+t)*r,d=p=>(e-p)*r;c.fillStyle=s.grassA,c.fillRect(0,0,a,o);let u=16;for(let p=0;p<u;p++)p%2||(c.fillStyle=s.grassB,c.fillRect(0,o/u*p,a,o/u));let f=c.createLinearGradient(0,0,0,o);f.addColorStop(0,"rgba(255,120,20,0.20)"),f.addColorStop(.45,"rgba(255,120,20,0.0)"),f.addColorStop(.55,"rgba(40,110,255,0.0)"),f.addColorStop(1,"rgba(40,110,255,0.22)"),c.fillStyle=f,c.fillRect(0,0,a,o);for(let p=0;p<26e3;p++){let g=Math.random()*.06;c.fillStyle=Math.random()<.5?`rgba(0,0,0,${g})`:`rgba(255,255,255,${g})`,c.fillRect(Math.random()*a,Math.random()*o,2+Math.random()*3,2+Math.random()*3)}c.strokeStyle="rgba(255,255,255,0.85)",c.lineWidth=.28*r;let m=3.4;By(c,h(-t+m),d(e-m),(t-m)*2*r,(e-m)*2*r,(n-2)*r),c.stroke(),c.beginPath(),c.moveTo(h(-t+m),d(0)),c.lineTo(h(t-m),d(0)),c.stroke(),c.beginPath(),c.arc(h(0),d(0),10*r,0,Math.PI*2),c.stroke(),c.beginPath(),c.arc(h(0),d(0),.9*r,0,Math.PI*2),c.fillStyle="rgba(255,255,255,0.85)",c.fill();for(let p of[1,-1]){let g=p*(e-m),M=i+6,w=11*p;c.beginPath(),c.moveTo(h(-M),d(g)),c.lineTo(h(-M+2),d(g-w)),c.lineTo(h(M-2),d(g-w)),c.lineTo(h(M),d(g)),c.stroke(),c.beginPath(),c.arc(h(0),d(g-w),5*r,p>0?0:Math.PI,p>0?Math.PI:Math.PI*2),c.stroke()}for(let p of ur())c.beginPath(),c.arc(h(p.pos.x),d(p.pos.z),(p.big?2.2:1.3)*r,0,Math.PI*2),c.fillStyle="rgba(20,20,20,0.35)",c.fill(),c.lineWidth=.12*r,c.strokeStyle="rgba(255,200,80,0.6)",c.stroke();c.save(),c.translate(h(0),d(0)),c.rotate(-Math.PI/2),c.font=`italic 900 ${3.2*r}px Arial Black, Arial, sans-serif`,c.textAlign="center",c.textBaseline="middle",c.fillStyle="rgba(255,255,255,0.22)",c.fillText("SUPERSONIC",0,-1.7*r),c.fillText("ARENA",0,1.9*r),c.restore();let v=Wi(l);return v.generateMipmaps=!0,v}function _p(){let e=Math.round(Math.sqrt(3)*32),[n,i]=oi(192,e*2);i.clearRect(0,0,192,e*2),i.strokeStyle="rgba(255,255,255,1)",i.lineWidth=2.2;let r=(a,o)=>{i.beginPath();for(let l=0;l<=6;l++){let c=Math.PI/3*l,h=a+Math.cos(c)*(32-1.5),d=o+Math.sin(c)*(e/2-1.5);l===0?i.moveTo(h,d):i.lineTo(h,d)}i.stroke()};for(let a=-1;a<6;a++)for(let o=-1;o<4;o++)r(a*1.5*32,o*e+(a%2?e/2:0));return Wi(n,!0)}function vp(){let[s,t]=oi(128,128);t.clearRect(0,0,128,128),t.strokeStyle="rgba(255,255,255,0.9)",t.lineWidth=3;for(let e=0;e<=128;e+=32)t.beginPath(),t.moveTo(e,0),t.lineTo(e,128),t.stroke(),t.beginPath(),t.moveTo(0,e),t.lineTo(128,e),t.stroke();return Wi(s,!0)}function yp(){let[s,t]=oi(256,128);t.fillStyle="#9aa3b5",t.fillRect(0,0,256,128),t.strokeStyle="rgba(40,45,60,0.8)",t.lineWidth=3,t.strokeRect(2,2,252,124),t.fillStyle="rgba(255,255,255,0.08)";for(let e=0;e<6;e++)t.fillRect(12+e*40,20,24,88);return Wi(s,!0)}function Mp(){let[e,n]=oi(1024,512),[i,r]=oi(1024,512),a=(1+Math.sqrt(5))/2,o=[],l=u=>{let f=Math.hypot(...u);return u.map(m=>m/f)},c=[];for(let u of[-1,1])for(let f of[-1,1])c.push([0,u,f*a],[u,f*a,0],[f*a,0,u]);for(let u of c)o.push({d:l(u),pent:!0});for(let u of[-1,1])for(let f of[-1,1])for(let m of[-1,1])o.push({d:l([u,f,m]),pent:!1});for(let u of[-1,1])for(let f of[-1,1])o.push({d:l([0,u/a,f*a]),pent:!1}),o.push({d:l([u/a,f*a,0]),pent:!1}),o.push({d:l([f*a,0,u/a]),pent:!1});let h=n.createImageData(1024,512),d=r.createImageData(1024,512);for(let u=0;u<512;u++){let f=(u+.5)/512*Math.PI,m=Math.sin(f),v=Math.cos(f);for(let p=0;p<1024;p++){let g=(p+.5)/1024*Math.PI*2,M=-Math.cos(g)*m,w=v,y=Math.sin(g)*m,b=-2,T=-2,P=null;for(let B of o){let k=M*B.d[0]+w*B.d[1]+y*B.d[2];k>b?(T=b,b=k,P=B):k>T&&(T=k)}let _=b-T,A=(u*1024+p)*4,I,L,U;P.pent?(I=58,L=62,U=72):(I=214,L=219,U=226);let D=Math.min(1,_*18);I*=.55+.45*D,L*=.55+.45*D,U*=.55+.45*D,h.data[A]=I,h.data[A+1]=L,h.data[A+2]=U,h.data[A+3]=255;let C=_<.012?1:0;d.data[A]=C*90,d.data[A+1]=C*200,d.data[A+2]=C*255,d.data[A+3]=255}}return n.putImageData(h,0,0),r.putImageData(d,0,0),{map:Wi(e),emissiveMap:Wi(i)}}function Sp(){let[s,t]=oi(512,256);t.fillStyle="#15161c",t.fillRect(0,0,512,256);let e=["#2f7bff","#ff8a1f","#e8e8e8","#444a57","#8fb4ff","#ffc27a","#b03030","#2f2f36"];for(let n=4;n<256;n+=9)for(let i=n/9%2?3:7;i<512;i+=8)Math.random()<.15||(t.fillStyle=e[Math.random()*e.length|0],t.fillRect(i,n,5,6),t.fillStyle="rgba(230,200,170,0.8)",t.fillRect(i+1,n-3,3,3));return Wi(s,!0)}function bp(){let[s,t]=oi(64,64),e=t.createRadialGradient(32,32,0,32,32,32);return e.addColorStop(0,"rgba(0,0,0,0.75)"),e.addColorStop(.6,"rgba(0,0,0,0.45)"),e.addColorStop(1,"rgba(0,0,0,0)"),t.fillStyle=e,t.fillRect(0,0,64,64),new ji(s)}function Tp(s,t){let[e,n]=oi(256,64);n.font="bold 34px Segoe UI, Arial, sans-serif",n.textAlign="center",n.textBaseline="middle",n.lineWidth=6,n.strokeStyle="rgba(0,0,0,0.7)",n.strokeText(s,128,32),n.fillStyle=t,n.fillText(s,128,32);let i=new ji(e);i.colorSpace=We;let r=new Hs({map:i,depthTest:!1,transparent:!0,sizeAttenuation:!1}),a=new $r(r);return a.scale.set(.16,.04,1),a.renderOrder=10,a}function wp(s){let[t,e]=oi(512,256),n=s===0?["#0b2d7a","#2f7bff"]:["#7a2c05","#ff8a1f"],i=e.createLinearGradient(0,0,512,256);return i.addColorStop(0,n[0]),i.addColorStop(1,n[1]),e.fillStyle=i,e.fillRect(0,0,512,256),e.font="italic 900 70px Arial Black, Arial, sans-serif",e.textAlign="center",e.textBaseline="middle",e.fillStyle="rgba(255,255,255,0.92)",e.fillText(s===0?"BLEU":"ORANGE",256,128),Wi(t)}var{W:Pn,L:ye,H:Ep,RC:Ap,RV:He,GW:Je,GH:ln,GD:cn}=ae,Rp=new ht(3111935),Cp=new ht(16747039),Pp=new ht(16777215),Ru=class{constructor(){this.pos=[],this.nor=[],this.uv=[],this.col=[],this.idx=[],this.groups=[],this.cur=null}vertex(t,e,n,i,r=Pp){return this.pos.push(t.x,t.y,t.z),this.nor.push(e.x,e.y,e.z),this.uv.push(n,i),this.col.push(r.r,r.g,r.b),this.pos.length/3-1}group(t){this.cur&&this.cur.mat===t||(this.cur={start:this.idx.length,count:0,mat:t},this.groups.push(this.cur))}tri(t,e,n){let i=this.pos,r=i[t*3],a=i[t*3+1],o=i[t*3+2],l=i[e*3]-r,c=i[e*3+1]-a,h=i[e*3+2]-o,d=i[n*3]-r,u=i[n*3+1]-a,f=i[n*3+2]-o,m=c*f-h*u,v=h*d-l*f,p=l*u-c*d,g=this.nor;m*(g[t*3]+g[e*3]+g[n*3])+v*(g[t*3+1]+g[e*3+1]+g[n*3+1])+p*(g[t*3+2]+g[e*3+2]+g[n*3+2])>=0?this.idx.push(t,e,n):this.idx.push(t,n,e),this.cur.count+=3}quad(t,e,n,i){this.tri(t,e,n),this.tri(t,n,i)}build(){let t=new _e;return t.setAttribute("position",new Zt(this.pos,3)),t.setAttribute("normal",new Zt(this.nor,3)),t.setAttribute("uv",new Zt(this.uv,2)),t.setAttribute("color",new Zt(this.col,3)),t.setIndex(this.idx),t}};function Ka(s,t=1){let e=an.smoothstep(s,-12,12),n=Rp.clone().lerp(Cp,e);return Pp.clone().lerp(n,t)}function zy(){let s=Pn-He,t=ye-He,e=Ap-He,n=[],i=(l,c,h,d,u)=>n.push({x:l,z:c,nx:h,nz:d,back:u}),r=(l,c,h,d,u,f,m,v=[])=>{let p=Math.hypot(h-l,d-c),g=Math.ceil(p/2.5),M=new Set;for(let w=0;w<g;w++)M.add(w/g);for(let w of v)M.add((w-l)/(h-l));[...M].sort((w,y)=>w-y).forEach(w=>i(l+(h-l)*w,c+(d-c)*w,u,f,m))},a=(l,c,h,d)=>{for(let f=0;f<12;f++){let m=h+(d-h)*f/12;i(l+Math.cos(m)*e,c+Math.sin(m)*e,Math.cos(m),Math.sin(m),0)}};r(s,-(t-e),s,t-e,1,0,0),a(s-e,t-e,0,Math.PI/2),r(s-e,t,-(s-e),t,0,1,1,[Je,-Je]),a(-(s-e),t-e,Math.PI/2,Math.PI),r(-s,t-e,-s,-(t-e),-1,0,0),a(-(s-e),-(t-e),Math.PI,Math.PI*1.5),r(-(s-e),-t,s-e,-t,0,-1,-1,[-Je,Je]),a(s-e,-(t-e),Math.PI*1.5,Math.PI*2),n.push({...n[0]});let o=0;for(let l=0;l<n.length;l++)l>0&&(o+=Math.hypot(n[l].x-n[l-1].x,n[l].z-n[l-1].z)),n[l].s=o;return n}function ky(){let s=[];for(let i=0;i<=10;i++){let r=i/10*Math.PI/2;s.push({o:He*Math.sin(r),y:He*(1-Math.cos(r)),no:-Math.sin(r),ny:Math.cos(r)})}for(let i of[4.1,4.5,ln,9,12,15,Ep-He])s.push({o:He,y:i,no:-1,ny:0});let e=8;for(let i=1;i<=e;i++){let r=i/e*Math.PI/2;s.push({o:He*Math.cos(r),y:Ep-He+He*Math.sin(r),no:-Math.cos(r),ny:-Math.sin(r)})}let n=0;for(let i=0;i<s.length;i++)i>0&&(n+=Math.hypot(s[i].o-s[i-1].o,s[i].y-s[i-1].y)),s[i].v=n;return s}function Vy(s,t,e){let n=new ii;return n.moveTo(-s+e,-t),n.lineTo(s-e,-t),n.absarc(s-e,-t+e,e,-Math.PI/2,0,!1),n.lineTo(s,t-e),n.absarc(s-e,t-e,e,0,Math.PI/2,!1),n.lineTo(-s+e,t),n.absarc(-s+e,t-e,e,Math.PI/2,Math.PI,!1),n.lineTo(-s,-t+e),n.absarc(-s+e,-t+e,e,Math.PI,Math.PI*1.5,!1),n}function Ip(s,t){let e=new Le,n=_p(),i={ramp:new Ee({color:16777215,vertexColors:!0,roughness:.55,metalness:.35,map:yp()}),stripe:new be({vertexColors:!0,toneMapped:!1}),glass:new Ee({color:9419007,vertexColors:!0,transparent:!0,opacity:s.glassOpacity,roughness:.1,metalness:.6,depthWrite:!1,side:ze})};i.ramp.map.repeat.set(1/4,1/4),i.ramp.map.wrapS=i.ramp.map.wrapT=Ri;let r=zy(),a=ky(),o=new Ru,l=[],c=new E,h=new E;for(let D=0;D<r.length;D++){let C=r[D],B=[];for(let k=0;k<a.length;k++){let V=a[k];c.set(C.x+C.nx*V.o,V.y,C.z+C.nz*V.o),h.set(C.nx*V.no,V.ny,C.nz*V.no);let Q;V.y>4.05&&V.y<4.55?Q=Ka(c.z,1).multiplyScalar(1.6):V.y<=4.1?Q=Ka(c.z,.35):Q=Ka(c.z,.8),B.push(o.vertex(c,h,C.s/4,V.v/4,Q))}l.push(B)}let d=D=>r[D].back!==0&&Math.abs(r[D].x)<=Je+1e-6,u=[{mat:0,test:(D,C)=>C.y<=4.1+1e-6},{mat:1,test:(D,C)=>D.y>=4.1-1e-6&&C.y<=4.5+1e-6},{mat:2,test:D=>D.y>=4.5-1e-6}];for(let D of u){o.group(D.mat);for(let C=0;C<r.length-1;C++){let B=d(C)&&d(C+1)&&r[C].back===r[C+1].back;for(let k=0;k<a.length-1;k++)D.test(a[k],a[k+1])&&(B&&a[k+1].y<=ln+1e-6||o.quad(l[C][k],l[C+1][k],l[C+1][k+1],l[C][k+1]))}}o.group(0);for(let D of[1,-1])for(let C of[1,-1]){h.set(-C,0,0);let B=o.vertex(c.set(C*Je,0,D*ye),h,0,0,Ka(D*ye,.35)),k=[];for(let V=0;V<=10;V++){let Q=V/10*Math.PI/2;k.push(o.vertex(c.set(C*Je,He*(1-Math.cos(Q)),D*(ye-He+He*Math.sin(Q))),h,0,0,Ka(D*ye,.35)))}for(let V=0;V<10;V++)o.tri(B,k[V],k[V+1])}let f=o.build();for(let D of o.groups)f.addGroup(D.start,D.count,D.mat);let m=new wt(f,[i.ramp,i.stripe,i.glass]);m.receiveShadow=t.shadows,e.add(m);let v=f.clone();v.clearGroups();let p=o.groups.filter(D=>D.mat===2);for(let D of p)v.addGroup(D.start,D.count,0);let g=v.getAttribute("uv");for(let D=0;D<g.count;D++)g.setXY(D,g.getX(D)*.5,g.getY(D)*.5);let M=new be({map:n,vertexColors:!0,transparent:!0,opacity:s.hexOpacity,blending:dn,depthWrite:!1,side:ze,toneMapped:!1});e.add(new wt(v,[M]));let w=xp(s),y=Vy(Pn-He,ye-He,Ap-He),b=new ua(y,24);b.rotateX(-Math.PI/2);let T=b.getAttribute("position"),P=b.getAttribute("uv");for(let D=0;D<T.count;D++)P.setXY(D,(T.getX(D)+Pn)/(2*Pn),(T.getZ(D)+ye)/(2*ye));b.computeVertexNormals();let _=new Ee({map:w,roughness:.85,metalness:0}),A=new wt(b,_);A.receiveShadow=t.shadows,e.add(A);let I=vp();for(let D of[0,1]){let C=D===0?-1:1,B=D===0?Rp:Cp,k=new Le,V=new wt(new un(Je*2,He+cn),new Ee({color:1711396,roughness:.9}));V.rotation.x=-Math.PI/2,V.position.set(0,.002,C*(ye-He+(He+cn)/2)),V.receiveShadow=t.shadows,k.add(V);let Q=new Ee({color:B.clone().multiplyScalar(.12),roughness:.8,side:ze}),q=new be({map:I,color:B,transparent:!0,opacity:.8,blending:dn,depthWrite:!1,side:ze,toneMapped:!1}),K=(tt,xt,Ot,Tt,Vt,le,et)=>{let rt=new un(tt,xt),at=new wt(rt,Q);at.position.copy(Ot),at.rotation.set(Vt,Tt,0),k.add(at);let ot=I.clone();ot.repeat.set(le,et),ot.needsUpdate=!0;let ct=new wt(rt,q.clone());ct.material.map=ot,ct.position.copy(Ot).multiplyScalar(1),ct.rotation.copy(at.rotation),ct.translateZ(.06),k.add(ct)};K(Je*2,ln,new E(0,ln/2,C*(ye+cn)),C>0?Math.PI:0,0,Je*2/1.6,ln/1.6),K(cn,ln,new E(Je,ln/2,C*(ye+cn/2)),-Math.PI/2,0,cn/1.6,ln/1.6),K(cn,ln,new E(-Je,ln/2,C*(ye+cn/2)),Math.PI/2,0,cn/1.6,ln/1.6);let j=new wt(new un(Je*2,cn),Q);j.rotation.x=Math.PI/2,j.position.set(0,ln,C*(ye+cn/2)),k.add(j);let Rt=new be({color:B.clone().multiplyScalar(2.2),toneMapped:!1}),yt=.22,ne=new wt(new Te(yt,ln+yt,yt),Rt);ne.position.set(Je+yt/2,ln/2,C*(ye-.05));let Yt=ne.clone();Yt.position.x=-Je-yt/2;let ee=new wt(new Te(Je*2+yt*2,yt,yt),Rt);ee.position.set(0,ln+yt/2,C*(ye-.05)),k.add(ne,Yt,ee);let Y=new wt(new un(Je*2,.35),Rt);Y.rotation.x=-Math.PI/2,Y.position.set(0,.01,C*(ye+.9)),k.add(Y),e.add(k)}let L=Gy(s);e.add(L);let U=Hy();return e.add(U.group),{group:e,updatePads:U.update}}function Hy(){let s=new Le,t=ur(),e=[],n=new kn(.62,.72,.08,24),i=new kn(1.25,1.45,.12,32),r=new ca(.5,2),a=new da(1.1,.06,8,40);for(let h of t){let d=new be({color:new ht(16758062).multiplyScalar(h.big?2.2:1.6),toneMapped:!1}),u=new Ee({color:3354666,roughness:.5,metalness:.6,emissive:16752922,emissiveIntensity:.5}),f={pad:null,base:null,orb:null,ring:null,on:d,baseMat:u,phase:Math.random()*6};h.big?(f.base=new wt(i,u),f.base.position.set(h.pos.x,.06,h.pos.z),f.orb=new wt(r,d),f.orb.position.set(h.pos.x,1,h.pos.z),f.ring=new wt(a,d),f.ring.rotation.x=Math.PI/2,f.ring.position.set(h.pos.x,.18,h.pos.z),s.add(f.base,f.orb,f.ring)):(f.base=new wt(n,d),f.base.position.set(h.pos.x,.04,h.pos.z),s.add(f.base)),e.push(f)}let o=new Ee({color:2763306,roughness:.7}),l=0;function c(h,d){l+=h,d.forEach((u,f)=>{let m=e[f];u.big?(m.orb.visible=u.active,m.ring.visible=u.active,m.orb.position.y=1+Math.sin(l*2+m.phase)*.15,m.orb.rotation.y+=h*1.5,m.baseMat.emissiveIntensity=u.active?.6:.05):m.base.material=u.active?m.on:o})}return{group:s,update:c}}function Gy(s){let t=new Le,e=new wt(new un(900,900),new Ee({color:s.outside,roughness:1}));e.rotation.x=-Math.PI/2,e.position.y=-.05,t.add(e);let n=Sp(),i=new Ee({map:n,roughness:.9,color:s.crowdTint}),r=new Ee({color:s.structure,roughness:.8,metalness:.2}),a=(h,d,u)=>{let f=new ii;f.moveTo(0,0),f.lineTo(d,u),f.lineTo(d+3,u),f.lineTo(d+3,0),f.closePath();let m=new es(f,{depth:h,bevelEnabled:!1});m.translate(0,0,-h/2);let v=m.getAttribute("uv"),p=m.getAttribute("position");for(let M=0;M<v.count;M++)v.setXY(M,p.getZ(M)/20,(p.getX(M)+p.getY(M))/14);return new wt(m,[r,i])},o=ye*2+10;for(let h of[1,-1]){let d=a(o,26,24);d.rotation.y=h>0?0:Math.PI,d.position.set(h*(Pn+6),2,0),t.add(d);let u=a(Pn*2+6,22,20);u.rotation.y=h>0?-Math.PI/2:Math.PI/2,u.position.set(0,2,h*(ye+cn+8)),t.add(u)}for(let h of[1,-1]){let d=new wt(new Te(8,2.2,ye*2+cn*2+20),r);d.position.set(h*(Pn+3.5),1.1,0);let u=new wt(new Te(Pn*2+15,2.2,10),r);u.position.set(0,1.1,h*(ye+cn+4.5)),t.add(d,u)}let l=new be({color:new ht(s.lamp).multiplyScalar(2.5),toneMapped:!1});for(let h of[-1,1])for(let d of[-1,1]){let u=new wt(new kn(.8,1.2,46,8),r);u.position.set(h*(Pn+38),23,d*(ye+30));let f=new wt(new Te(10,5,1.5),l);f.position.set(h*(Pn+36),47,d*(ye+28)),f.lookAt(0,0,0),t.add(u,f)}for(let h of[0,1]){let d=h===0?-1:1,u=new wt(new un(30,14),new be({map:wp(h),toneMapped:!1}));u.position.set(0,34,d*(ye+36)),u.rotation.y=d>0?Math.PI:0,t.add(u);let f=new wt(new Te(31,15,1),r);f.position.set(0,34,d*(ye+36.6)),t.add(f)}let c=new be({color:new ht(s.rim).multiplyScalar(1.5),toneMapped:!1});for(let h of[1,-1]){let d=new wt(new Te(.6,.6,ye*2+20),c);d.position.set(h*(Pn+33),28,0),t.add(d);let u=new wt(new Te(Pn*2+20,.6,.6),c);u.position.set(0,24,h*(ye+cn+32)),t.add(u)}return t}function Lp(s){let t=new ns(1200,32,16),e=new we({side:Be,depthWrite:!1,uniforms:{top:{value:new ht(s.skyTop)},horizon:{value:new ht(s.skyHorizon)},bottom:{value:new ht(s.skyBottom)},sunDir:{value:new E(...s.sunDir).normalize()},sunColor:{value:new ht(s.sunGlow)}},vertexShader:"varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",fragmentShader:`uniform vec3 top; uniform vec3 horizon; uniform vec3 bottom; uniform vec3 sunDir; uniform vec3 sunColor; varying vec3 vDir;
      void main(){ float h = vDir.y; vec3 c = h > 0.0 ? mix(horizon, top, pow(h, 0.55)) : mix(horizon, bottom, pow(-h, 0.4));
      float s = max(dot(normalize(vDir), sunDir), 0.0); c += sunColor * (pow(s, 600.0) * 4.0 + pow(s, 12.0) * 0.35);
      gl_FragColor = vec4(c, 1.0); }`}),n=new wt(t,e);n.renderOrder=-10;let i=new Le;if(i.add(n),s.stars){let a=new Float32Array(4500);for(let l=0;l<1500;l++){let c=Math.random()*Math.PI*2,h=Math.random()*.9+.08,d=1100;a[l*3]=Math.cos(c)*Math.sqrt(1-h*h)*d,a[l*3+1]=h*d,a[l*3+2]=Math.sin(c)*Math.sqrt(1-h*h)*d}let o=new _e;o.setAttribute("position",new De(a,3)),i.add(new Qi(o,new Ws({color:16777215,size:2.2,sizeAttenuation:!1})))}return i}var fs={day:{label:"Stade (jour)",skyTop:3108816,skyHorizon:12574975,skyBottom:4872810,sunDir:[.35,.8,.25],sunGlow:16774096,sun:16774368,sunIntensity:1.9,hemiSky:13625087,hemiGround:3820080,hemiIntensity:.6,grassA:"#2f7d32",grassB:"#3a8f3c",outside:3885622,crowdTint:16777215,structure:10133674,lamp:16777215,rim:10406911,glassOpacity:.07,hexOpacity:.35,fog:12572912,exposure:1},sunset:{label:"Coucher de soleil",skyTop:2366034,skyHorizon:16747594,skyBottom:2759210,sunDir:[-.6,.18,.5],sunGlow:16756848,sun:16761232,sunIntensity:1.7,hemiSky:16763296,hemiGround:2761792,hemiIntensity:.55,grassA:"#2c6e36",grassB:"#357d3d",outside:2762288,crowdTint:16767168,structure:5918816,lamp:16769200,rim:16751964,glassOpacity:.08,hexOpacity:.45,fog:8014416,exposure:1},night:{label:"Nocturne",skyTop:132108,skyHorizon:1319498,skyBottom:329226,sunDir:[.2,.9,-.3],sunGlow:0,sun:14543103,sunIntensity:1.6,hemiSky:6981312,hemiGround:1054752,hemiIntensity:.45,grassA:"#1f5e2a",grassB:"#276b31",outside:856086,crowdTint:11581648,structure:3159103,lamp:15266047,rim:6987007,glassOpacity:.1,hexOpacity:.6,fog:659488,exposure:1.05,stars:!0}};var Dp={octane:{body:[[-.62,-.12],[.55,-.12],[.64,-.06],[.66,.04],[.62,.1],[.28,.16],[-.5,.18],[-.64,.14],[-.66,0]],cabin:[[.3,.12],[.3,.14],[.06,.33],[-.28,.34],[-.52,.17],[-.52,.12]],width:.72,cabinWidth:.54,wheelR:[.17,.19],wheelX:[.37,-.36],wheelZ:.4,spoiler:[-.6,.27]},dominus:{body:[[-.68,-.1],[.62,-.1],[.7,-.04],[.71,.04],[.6,.09],[.15,.13],[-.55,.15],[-.7,.13],[-.72,0]],cabin:[[.18,.1],[.18,.12],[-.02,.26],[-.34,.27],[-.6,.15],[-.6,.1]],width:.74,cabinWidth:.56,wheelR:[.16,.17],wheelX:[.42,-.43],wheelZ:.41,spoiler:[-.66,.21]},breakout:{body:[[-.7,-.1],[.66,-.1],[.74,-.06],[.72,0],[.3,.1],[-.55,.16],[-.72,.14],[-.73,0]],cabin:[[.25,.08],[.25,.09],[-.05,.25],[-.3,.26],[-.55,.15],[-.55,.1]],width:.7,cabinWidth:.5,wheelR:[.15,.18],wheelX:[.45,-.44],wheelZ:.39,spoiler:[-.68,.24]},merc:{body:[[-.62,-.15],[.58,-.15],[.64,-.08],[.65,.12],[.45,.18],[-.58,.2],[-.64,.16],[-.65,-.02]],cabin:[[.4,.15],[.4,.16],[.25,.42],[-.45,.43],[-.58,.2],[-.58,.15]],width:.76,cabinWidth:.62,wheelR:[.19,.19],wheelX:[.38,-.38],wheelZ:.41,spoiler:null}};function Np(s,t,e){let n=new ii;s.forEach(([r,a],o)=>o?n.lineTo(r,a):n.moveTo(r,a)),n.closePath();let i=new es(n,{depth:t,bevelEnabled:!0,bevelThickness:e,bevelSize:e,bevelSegments:3,curveSegments:4});return i.translate(0,0,-t/2),i.computeVertexNormals(),i}var Cu=new kn(1,1,.13,22);Cu.rotateX(Math.PI/2);var Pu=new kn(.62,.62,.14,16);Pu.rotateX(Math.PI/2);var Up=new Te(.14,1.1,.145),Ic=new Xs(.1,.7,12,1,!0);Ic.rotateZ(Math.PI/2);Ic.translate(-.35,0,0);var Lc=new Xs(.05,.35,10,1,!0);Lc.rotateZ(Math.PI/2);Lc.translate(-.175,0,0);var Qa=class{constructor(t,{teamColor:e,accent:n=2236962,boostColor:i=null,showName:r=!0}){this.car=t;let a=Dp[t.bodyKey]?t.bodyKey:"octane",o=Dp[a],l=Sn[a];this.group=new Le,this.root=new Le,this.group.add(this.root);let c=new fa({color:e,metalness:.3,roughness:.45,clearcoat:.35,clearcoatRoughness:.35}),h=new Ee({color:n,metalness:.5,roughness:.5}),d=new Ee({color:658968,metalness:.5,roughness:.22}),u=new Ee({color:1315860,roughness:.92}),f=new Ee({color:13159636,metalness:.9,roughness:.25}),m=new be({color:new ht(15398143).multiplyScalar(1.6),toneMapped:!1}),v=new be({color:new ht(16719904).multiplyScalar(1.5),toneMapped:!1}),p=new wt(Np(o.body,o.width,.04),c),g=new wt(Np(o.cabin,o.cabinWidth,.035),d);p.castShadow=!0,g.castShadow=!0,this.root.add(p,g);let M=o.cabin.slice(2,4),w=Math.abs(M[0][0]-M[1][0])*.8,y=new wt(new Te(w,.025,o.cabinWidth*.9),h);y.position.set((M[0][0]+M[1][0])/2,Math.max(M[0][1],M[1][1])+.03,0);let b=new wt(new Te(.5,.02,.12),h),T=o.body[5];b.position.set(T[0]+.12,T[1]+.035,0),b.rotation.z=-.12,this.root.add(y,b);let P=Math.max(...o.body.map(L=>L[0])),_=Math.min(...o.body.map(L=>L[0]));for(let L of[1,-1]){let U=new wt(new Te(.04,.05,.14),m);U.position.set(P+.02,.04,L*o.width*.36);let D=new wt(new Te(.04,.04,.16),v);D.position.set(_-.02,.08,L*o.width*.36),this.root.add(U,D)}if(o.spoiler){let[L,U]=o.spoiler,D=new wt(new Te(.16,.03,o.width+.06),h);D.position.set(L,U,0),D.rotation.z=.12,D.castShadow=!0,this.root.add(D);for(let C of[1,-1]){let B=new wt(new Te(.05,U-.12,.03),h);B.position.set(L+.02,(U+.12)/2,C*o.width*.3),this.root.add(B)}}let A=-(l.hy+dt.rideHeight);this.wheels=[];for(let L=0;L<4;L++){let U=L<2,D=o.wheelR[U?0:1],C=new Le;C.position.set(o.wheelX[U?0:1],A+D,(L%2?-1:1)*o.wheelZ);let B=new Le,k=new wt(Cu,u);k.scale.set(D,D,1),k.castShadow=!0;let V=new wt(Pu,f);V.scale.set(D,D,1),B.add(k,V);for(let Q=0;Q<3;Q++){let q=new wt(Up,h);q.scale.set(D,D,1),q.rotation.z=Q*Math.PI/3,B.add(q)}C.add(B),this.root.add(C),this.wheels.push({pivot:C,spinner:B,front:U})}let I=new ht(i??e);this.flameMat=new be({color:I.clone().multiplyScalar(2.5),transparent:!0,opacity:.85,blending:dn,depthWrite:!1,toneMapped:!1,side:ze}),this.coreMat=new be({color:new ht(16773824).multiplyScalar(3),transparent:!0,opacity:.9,blending:dn,depthWrite:!1,toneMapped:!1}),this.flames=[],this.exhausts=[];for(let L of[1,-1]){let U=new Le;U.position.set(_-.01,0,L*o.width*.2),U.add(new wt(Ic,this.flameMat),new wt(Lc,this.coreMat)),U.visible=!1,this.root.add(U),this.flames.push(U),this.exhausts.push(new E(_-.05,0,L*o.width*.2))}this.boostColor=I,this.backX=_,this.halfWidth=o.width/2,this.wheelBaseY=A,r&&(this.nameTag=Tp(t.name,e===void 0?"#fff":`#${new ht(e).getHexString()}`),this.nameTag.position.set(0,1,0),this.group.add(this.nameTag))}update(t,e){if(this.group.visible=!t.demolished,!t.demolished){this.group.position.copy(t.pos),this.root.quaternion.copy(t.quat);for(let n of this.wheels)n.front&&(n.pivot.rotation.y=-t.steer*.45),n.spinner.rotation.z=-t.spin;for(let n of this.flames)if(n.visible=t.boosting,t.boosting){let i=.85+Math.sin(e*60+n.position.z*10)*.12+Math.random()*.15;n.scale.set(i*(t.supersonic?1.4:1),1,1)}}}exhaustWorld(t,e){return e.copy(this.exhausts[t]).applyQuaternion(this.root.quaternion).add(this.group.position)}dispose(){this.group.traverse(t=>{t.isMesh&&t.geometry&&![Cu,Pu,Up,Ic,Lc].includes(t.geometry)&&t.geometry.dispose(),t.material&&t.material.map&&t.isSprite&&t.material.map.dispose()})}};var Wy=`
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
}`,Fp=`
varying float vAlpha;
varying vec3 vColor;
void main() {
  vec2 d = gl_PointCoord - 0.5;
  float r = length(d) * 2.0;
  float a = smoothstep(1.0, 0.0, r);
  a *= a;
  gl_FragColor = vec4(vColor * a * vAlpha, a * vAlpha);
}`,Dc=class{constructor(t,e=!0){this.cap=t,this.n=0,this.pos=new Float32Array(t*3),this.col=new Float32Array(t*3),this.size=new Float32Array(t),this.alpha=new Float32Array(t),this.vel=new Float32Array(t*3),this.life=new Float32Array(t),this.maxLife=new Float32Array(t),this.s0=new Float32Array(t),this.s1=new Float32Array(t),this.a0=new Float32Array(t),this.drag=new Float32Array(t),this.grav=new Float32Array(t),this.c0=new Float32Array(t*3),this.c1=new Float32Array(t*3);let n=new _e;this.aPos=new De(this.pos,3).setUsage(js),this.aCol=new De(this.col,3).setUsage(js),this.aSize=new De(this.size,1).setUsage(js),this.aAlpha=new De(this.alpha,1).setUsage(js),n.setAttribute("position",this.aPos),n.setAttribute("pcolor",this.aCol),n.setAttribute("size",this.aSize),n.setAttribute("alpha",this.aAlpha),n.boundingSphere=new Bn(new E,1e5),this.material=new we({vertexShader:Wy,fragmentShader:Fp,uniforms:{scale:{value:600}},transparent:!0,depthWrite:!1,blending:e?dn:Ui}),e||(this.material.fragmentShader=Fp.replace("gl_FragColor = vec4(vColor * a * vAlpha, a * vAlpha);","gl_FragColor = vec4(vColor, a * vAlpha);")),this.points=new Qi(n,this.material),this.points.frustumCulled=!1,this.points.renderOrder=5,this.geometry=n}setViewportHeight(t){this.material.uniforms.scale.value=t*.9}emit(t){if(this.n>=this.cap)return;let e=this.n++,n=e*3;this.pos[n]=t.x,this.pos[n+1]=t.y,this.pos[n+2]=t.z,this.vel[n]=t.vx||0,this.vel[n+1]=t.vy||0,this.vel[n+2]=t.vz||0,this.life[e]=0,this.maxLife[e]=t.life||.5,this.s0[e]=t.size||.5,this.s1[e]=t.size1??this.s0[e]*.2,this.a0[e]=t.alpha??1,this.drag[e]=t.drag||0,this.grav[e]=t.gravity||0;let i=t.color,r=t.color1||t.color;this.c0[n]=i.r,this.c0[n+1]=i.g,this.c0[n+2]=i.b,this.c1[n]=r.r,this.c1[n+1]=r.g,this.c1[n+2]=r.b}update(t){let e=0;for(;e<this.n;){if(this.life[e]+=t,this.life[e]>=this.maxLife[e]){this.copy(this.n-1,e),this.n--;continue}let n=this.life[e]/this.maxLife[e],i=e*3,r=Math.exp(-this.drag[e]*t);this.vel[i]*=r,this.vel[i+1]=this.vel[i+1]*r+this.grav[e]*t,this.vel[i+2]*=r,this.pos[i]+=this.vel[i]*t,this.pos[i+1]+=this.vel[i+1]*t,this.pos[i+2]+=this.vel[i+2]*t,this.size[e]=this.s0[e]+(this.s1[e]-this.s0[e])*n,this.alpha[e]=this.a0[e]*(1-n)*Math.min(1,n*12+.2),this.col[i]=this.c0[i]+(this.c1[i]-this.c0[i])*n,this.col[i+1]=this.c0[i+1]+(this.c1[i+1]-this.c0[i+1])*n,this.col[i+2]=this.c0[i+2]+(this.c1[i+2]-this.c0[i+2])*n,e++}this.geometry.setDrawRange(0,this.n),this.aPos.needsUpdate=!0,this.aCol.needsUpdate=!0,this.aSize.needsUpdate=!0,this.aAlpha.needsUpdate=!0}copy(t,e){if(t===e)return;let n=t*3,i=e*3;for(let r=0;r<3;r++)this.pos[i+r]=this.pos[n+r],this.vel[i+r]=this.vel[n+r],this.col[i+r]=this.col[n+r],this.c0[i+r]=this.c0[n+r],this.c1[i+r]=this.c1[n+r];this.life[e]=this.life[t],this.maxLife[e]=this.maxLife[t],this.s0[e]=this.s0[t],this.s1[e]=this.s1[t],this.a0[e]=this.a0[t],this.drag[e]=this.drag[t],this.grav[e]=this.grav[t],this.size[e]=this.size[t],this.alpha[e]=this.alpha[t]}clear(){this.n=0}},Re=s=>(Math.random()*2-1)*s,Op=new ht(1,1,1),Bp=new ht(.18,.18,.2),Xy=new ht(1.6,.7,.2),Nc=class{constructor(t){this.add=new Dc(6e3,!0),this.smoke=new Dc(1500,!1),t.add(this.add.points,this.smoke.points),this.rings=[],this.scene=t,this.ringGeo=new ha(.8,1,48)}setViewportHeight(t){this.add.setViewportHeight(t),this.smoke.setViewportHeight(t)}boost(t,e,n,i,r){for(let o=0;o<2;o++){let l=10+Math.random()*6;this.add.emit({x:t.x+Re(.05),y:t.y+Re(.05),z:t.z+Re(.05),vx:-e.x*l+n.x*.6+Re(1.2),vy:-e.y*l+n.y*.6+Re(1.2),vz:-e.z*l+n.z*.6+Re(1.2),life:.22+Math.random()*.18,size:r?.8:.6,size1:.12,color:Op,color1:i,drag:3})}}trail(t,e){this.add.emit({x:t.x,y:t.y,z:t.z,life:.45,size:.28,size1:.05,color:e,color1:e,alpha:.7})}sparks(t,e,n=Xy){let i=Math.min(36,6+e*1.2);for(let r=0;r<i;r++){let a=3+Math.random()*e*.5;this.add.emit({x:t.x,y:t.y,z:t.z,vx:Re(a),vy:Re(a)+2,vz:Re(a),life:.25+Math.random()*.25,size:.2,size1:.03,color:Op,color1:n,drag:2,gravity:-10})}}padPickup(t,e){let n=new ht(1.8,1.2,.3);for(let i=0;i<(e?40:12);i++)this.add.emit({x:t.x+Re(1),y:.3,z:t.z+Re(1),vx:Re(1),vy:3+Math.random()*(e?6:3),vz:Re(1),life:.6,size:e?.7:.45,size1:.05,color:n,drag:1})}explosion(t,e,n=!0){let i=n?650:220,r=new ht(e),a=r.clone().multiplyScalar(3),o=r.clone().multiplyScalar(1.2),l=new ht(2.2,1.9,1.2);for(let h=0;h<i;h++){let d=Math.random()*Math.PI*2,u=Math.random()*2-1,f=Math.sqrt(1-u*u),m=Math.random(),v=(n?12:7)+Math.random()*(n?32:12)*(m<.25?1.3:1);this.add.emit({x:t.x,y:t.y,z:t.z,vx:Math.cos(d)*f*v,vy:u*v+3,vz:Math.sin(d)*f*v,life:.7+Math.random()*(n?1.4:.6),size:m<.25?.45:n?1.3:.9,size1:.08,color:m<.25?l:a,color1:o,drag:m<.25?.8:1.8,gravity:m<.25?-9:-3})}for(let h=0;h<(n?90:40);h++)this.smoke.emit({x:t.x+Re(1),y:t.y+Re(1),z:t.z+Re(1),vx:Re(6),vy:Re(4)+2,vz:Re(6),life:1.5+Math.random()*1.5,size:2.5,size1:6,color:Bp,alpha:.55,drag:1.5,gravity:.5});let c=new wt(this.ringGeo,new be({color:a,transparent:!0,opacity:1,side:ze,blending:dn,depthWrite:!1,toneMapped:!1}));c.position.copy(t),c.lookAt(t.x,t.y+1,t.z),this.scene.add(c),this.rings.push({mesh:c,t:0,max:n?1.1:.6,size:n?30:10})}demolition(t,e){for(let n=0;n<160;n++){let i=4+Math.random()*12;this.add.emit({x:t.x,y:t.y,z:t.z,vx:Re(i),vy:Re(i)+4,vz:Re(i),life:.5+Math.random()*.8,size:1.1,size1:.1,color:new ht(2,1.4,.5),color1:new ht(e).multiplyScalar(1.5),drag:2,gravity:-6})}for(let n=0;n<50;n++)this.smoke.emit({x:t.x,y:t.y,z:t.z,vx:Re(3),vy:1+Math.random()*3,vz:Re(3),life:1.5+Math.random(),size:1.5,size1:4,color:Bp,alpha:.7,drag:1})}update(t){this.add.update(t),this.smoke.update(t);for(let e=this.rings.length-1;e>=0;e--){let n=this.rings[e];n.t+=t;let i=n.t/n.max;if(i>=1){this.scene.remove(n.mesh),n.mesh.material.dispose(),this.rings.splice(e,1);continue}let r=1+i*n.size;n.mesh.scale.set(r,r,r),n.mesh.material.opacity=1-i}}clear(){this.add.clear(),this.smoke.clear()}};var Iu=new E(0,1,0),Uc=new E,yr=new E,ps=new E,zp=new E,vi=new E,ja=new E;function kp(s,t){let e=an.degToRad(s);return an.radToDeg(2*Math.atan(Math.tan(e/2)/t))}function Oc(s,t=.6){for(let e=0;e<3;e++){let n=on(s.x,s.y,s.z);if(n<=-t)return s;xi(s.x,s.y,s.z,zp),s.addScaledVector(zp,n+t)}return s}var Fc=class{constructor(t){this.camera=t,this.pos=new E,this.look=new E,this.fwd=new E(0,0,1),this.up=new E(0,1,0),this.ready=!1,this.ballCam=!0,this.shake=0}reset(){this.ready=!1}addShake(t){this.shake=Math.max(this.shake,t)}follow(t,e,n,i){let r=i.camDistance,a=i.camHeight;Uc.set(1,0,0).applyQuaternion(e.quat);let o=e.onGround?e.groundNormal:Iu;yr.copy(Uc).addScaledVector(o,-Uc.dot(o)),yr.lengthSq()<.09&&yr.copy(this.fwd),yr.normalize(),this.ready||(this.fwd.copy(yr),this.up.copy(o));let l=1-Math.exp(-t*(e.onGround?9:5));this.fwd.lerp(yr,l).normalize(),this.up.lerp(o,1-Math.exp(-t*5)).normalize();let c=this.up;if(this.ballCam&&n){ps.copy(e.pos).sub(n),ps.y=0,ps.lengthSq()<.25&&ps.copy(this.fwd).negate().setY(0),ps.normalize(),vi.copy(e.pos).addScaledVector(ps,r),vi.y+=a,c=Iu;let h=ps.copy(n).sub(vi).normalize(),d=ja.copy(e.pos).sub(vi).normalize(),u=Math.acos(an.clamp(h.dot(d),-1,1)),f=an.degToRad(this.camera.fov)*.36;if(u>f&&u>1e-4){let m=Uc.crossVectors(d,h).normalize();h.copy(d).applyAxisAngle(m,f)}ja.copy(vi).addScaledVector(h,12)}else vi.copy(e.pos).addScaledVector(this.fwd,-r).addScaledVector(this.up,a),ja.copy(e.pos).addScaledVector(this.up,a*.7).addScaledVector(this.fwd,2.2);if(Oc(vi),!this.ready)this.pos.copy(vi),this.look.copy(ja),this.ready=!0;else{let h=1-Math.exp(-t*i.camStiffness);this.pos.lerp(vi,h),this.look.lerp(ja,1-Math.exp(-t*14))}this.apply(t,c)}setView(t,e,n,i=4){this.ready?(this.pos.lerp(e,1-Math.exp(-t*i)),this.look.lerp(n,1-Math.exp(-t*i*1.5))):(this.pos.copy(e),this.look.copy(n),this.ready=!0),this.apply(t,Iu)}apply(t,e){let n=this.camera;if(n.position.copy(this.pos),this.shake>.001){let i=this.shake;n.position.x+=(Math.random()-.5)*i,n.position.y+=(Math.random()-.5)*i,n.position.z+=(Math.random()-.5)*i,this.shake*=Math.exp(-t*5)}n.up.copy(e),n.lookAt(this.look)}};var Vp=[["throttle","Acc\xE9l\xE9rer / piquer du nez"],["reverse","Freiner / reculer / cabrer"],["left","Tourner \xE0 gauche"],["right","Tourner \xE0 droite"],["jump","Sauter"],["boost","Boost"],["handbrake","D\xE9rapage / air roll libre"],["rollLeft","Air roll gauche"],["rollRight","Air roll droite"],["ballCam","Cam\xE9ra balle"],["scoreboard","Tableau des scores"],["pause","Pause"],["resetBall","Entra\xEEnement : replacer la balle"],["shootBall","Entra\xEEnement : balle vers moi"]],to={throttle:["KeyW","ArrowUp"],reverse:["KeyS","ArrowDown"],left:["KeyA","ArrowLeft"],right:["KeyD","ArrowRight"],jump:["Space","Mouse2"],boost:["ShiftLeft","Mouse0"],handbrake:["KeyC","ShiftRight"],rollLeft:["KeyQ"],rollRight:["KeyE"],ballCam:["KeyV","Mouse1"],scoreboard:["Tab"],pause:["Escape","KeyP"],resetBall:["KeyR"],shootBall:["KeyT"]},mn={A:0,B:1,X:2,Y:3,LB:4,RB:5,LT:6,RT:7,BACK:8,START:9,LS:10,UP:12,DOWN:13,LEFT:14,RIGHT:15};function zc(s){if(!s)return"\u2014";let t={Mouse0:"Clic gauche",Mouse1:"Clic molette",Mouse2:"Clic droit",Space:"Espace",ShiftLeft:"Maj gauche",ShiftRight:"Maj droite",ControlLeft:"Ctrl gauche",ControlRight:"Ctrl droite",AltLeft:"Alt",Tab:"Tab",Escape:"\xC9chap",ArrowUp:"\u2191",ArrowDown:"\u2193",ArrowLeft:"\u2190",ArrowRight:"\u2192",Enter:"Entr\xE9e",Backspace:"Retour"};return t[s]?t[s]:s.startsWith("Key")?s.slice(3):s.startsWith("Digit")?s.slice(5):s}function qy(s,t,e){let n=Math.hypot(s,t);if(n<e)return[0,0];let i=Math.min(1,(n-e)/(1-e))/n;return[s*i,t*i]}var Bc=class{constructor(t){this.settings=t,this.down=new Set,this.pressedQueue=new Set,this.capture=null,this.padPrev=new Map,this.padPressed=new Map,this.lastDevice="keyboard";let e=new Set(["Space","Tab","ArrowUp","ArrowDown","ArrowLeft","ArrowRight","ShiftLeft","AltLeft"]);window.addEventListener("keydown",n=>{if(this.capture){n.preventDefault();let i=this.capture;this.capture=null,i(n.code);return}n.target&&(n.target.tagName==="INPUT"||n.target.tagName==="SELECT")||(e.has(n.code)&&n.preventDefault(),this.down.has(n.code)||this.pressedQueue.add(n.code),this.down.add(n.code),this.lastDevice="keyboard")}),window.addEventListener("keyup",n=>this.down.delete(n.code)),window.addEventListener("blur",()=>this.down.clear()),window.addEventListener("mousedown",n=>{let i=`Mouse${n.button}`;if(this.capture){n.preventDefault();let r=this.capture;this.capture=null,r(i);return}n.target&&n.target.closest&&n.target.closest(".menu, .overlay-panel, button, input, select")||(this.down.has(i)||this.pressedQueue.add(i),this.down.add(i),this.lastDevice="keyboard")}),window.addEventListener("mouseup",n=>this.down.delete(`Mouse${n.button}`)),window.addEventListener("contextmenu",n=>n.preventDefault())}captureNext(t){this.capture=t}keys(t){return this.settings.keys&&this.settings.keys[t]||to[t]||[]}kb(t){return this.keys(t).some(e=>this.down.has(e))?1:0}poll(){this.frameKeys=this.pressedQueue,this.pressedQueue=new Set;let t=navigator.getGamepads?[...navigator.getGamepads()].filter(e=>e&&e.connected):[];this.pads=t,this.padPressed.clear();for(let e of t){let n=this.padPrev.get(e.index)||[],i=e.buttons.map(a=>a.pressed),r=i.map((a,o)=>a&&!n[o]);(r.some(a=>a)||Math.abs(e.axes[0]||0)>.5||Math.abs(e.axes[1]||0)>.5)&&(this.lastDevice="gamepad"),this.padPressed.set(e.index,r),this.padPrev.set(e.index,i)}}padFor(t,e){let n=this.pads||[];return e?t===1?n[0]?[n[0]]:[]:n[1]?[n[1]]:[]:t===0?n:[]}usesKeyboard(t){return t===0}pressed(t,e=0,n=!1){if(this.usesKeyboard(e)&&this.keys(t).some(r=>this.frameKeys&&this.frameKeys.has(r)))return!0;let i={jump:mn.A,ballCam:mn.Y,pause:mn.START,scoreboard:mn.BACK,resetBall:mn.UP,shootBall:mn.DOWN}[t];if(i===void 0)return!1;for(let r of this.padFor(e,n)){let a=this.padPressed.get(r.index);if(a&&a[i])return!0}return!1}held(t,e=0,n=!1){if(this.usesKeyboard(e)&&this.kb(t))return!0;let i={scoreboard:mn.BACK}[t];return i===void 0?!1:this.padFor(e,n).some(r=>r.buttons[i]&&r.buttons[i].pressed)}controls(t,e,n){let i=this.settings,r=0,a=0,o=0,l=0,c=!1,h=!1,d=!1;this.usesKeyboard(t)&&(r=this.kb("throttle")-this.kb("reverse"),a=this.kb("right")-this.kb("left"),o=r,l=this.kb("rollRight")-this.kb("rollLeft"),c=!!this.kb("jump"),h=!!this.kb("boost"),d=!!this.kb("handbrake"));for(let u of this.padFor(t,e)){let f=M=>u.buttons[M]?u.buttons[M].value:0,[m,v]=qy(u.axes[0]||0,u.axes[1]||0,i.deadzone),p=f(mn.RT)-f(mn.LT);Math.abs(p)>Math.abs(r)&&(r=p),Math.abs(m)>Math.abs(a)&&(a=m);let g=i.invertPitch?v:-v;Math.abs(g)>Math.abs(o)&&(o=g),f(mn.LB)>.5&&(l=-1),c=c||f(mn.A)>.5,h=h||f(mn.B)>.5||f(mn.RB)>.5,d=d||f(mn.X)>.5}return n.throttle=Math.max(-1,Math.min(1,r)),n.steer=Math.max(-1,Math.min(1,a)),n.pitch=Math.max(-1,Math.min(1,o)),n.yaw=d?0:n.steer,n.roll=Math.max(-1,Math.min(1,l+(d?n.steer:0))),n.jump=c,n.boost=h,n.handbrake=d,n}};var kc=class{constructor(t){this.settings=t,this.ctx=null,this.listener={x:0,y:0,z:0,rx:1,ry:0,rz:0},this.engines=[],this.musicTimer=null}init(){if(this.ctx){this.ctx.state==="suspended"&&this.ctx.resume();return}let t=window.AudioContext||window.webkitAudioContext;if(!t)return;let e=new t;this.ctx=e,this.comp=e.createDynamicsCompressor(),this.comp.threshold.value=-14,this.comp.ratio.value=4,this.master=e.createGain(),this.sfx=e.createGain(),this.music=e.createGain(),this.sfx.connect(this.master),this.music.connect(this.master),this.master.connect(this.comp),this.comp.connect(e.destination);let n=e.sampleRate*2;this.noise=e.createBuffer(1,n,e.sampleRate);let i=this.noise.getChannelData(0);for(let r=0;r<n;r++)i[r]=Math.random()*2-1;this.applyVolumes(),this.startCrowd()}applyVolumes(){if(!this.ctx)return;let t=this.settings;this.master.gain.value=t.volMaster,this.sfx.gain.value=t.volSfx,this.music.gain.value=t.volMusic*.5}setListener(t,e){let n=this.listener;n.x=t.x,n.y=t.y,n.z=t.z,n.rx=e.x,n.ry=e.y,n.rz=e.z}spatial(t,e=18){if(!t)return{gain:1,pan:0};let n=this.listener,i=t.x-n.x,r=t.y-n.y,a=t.z-n.z,o=Math.hypot(i,r,a),l=e/(e+Math.max(0,o-3)),c=o>.01?Math.max(-1,Math.min(1,(i*n.rx+r*n.ry+a*n.rz)/o))*.8:0;return{gain:l,pan:c}}out(t,e){let n=this.ctx,{gain:i,pan:r}=this.spatial(t),a=n.createGain();if(a.gain.value=e*i,n.createStereoPanner){let o=n.createStereoPanner();o.pan.value=r,a.connect(o),o.connect(this.sfx)}else a.connect(this.sfx);return a}noiseSrc(t){let e=this.ctx.createBufferSource();return e.buffer=this.noise,e.loop=t>1.9,e.start(this.ctx.currentTime,Math.random()*1.5),e.stop(this.ctx.currentTime+t),e}env(t,e,n,i=1){let r=this.ctx.currentTime;t.gain.cancelScheduledValues(r),t.gain.setValueAtTime(1e-4,r),t.gain.exponentialRampToValueAtTime(i,r+e),t.gain.exponentialRampToValueAtTime(1e-4,r+e+n)}tone(t,e,n,i,r,a){let o=this.ctx,l=o.createOscillator();l.type=t;let c=o.currentTime;l.frequency.setValueAtTime(e,c),l.frequency.exponentialRampToValueAtTime(Math.max(1,n),c+i);let h=o.createGain();l.connect(h),h.connect(a),this.env(h,.005,i,r),l.start(c),l.stop(c+i+.05)}hit(t,e){if(!this.ctx)return;let n=Math.min(1,.25+e/25),i=this.out(t,n);this.tone("sine",140+e*3,45,.25,.9,i);let r=this.noiseSrc(.2),a=this.ctx.createBiquadFilter();a.type="bandpass",a.frequency.value=900+e*40,a.Q.value=.8;let o=this.ctx.createGain();r.connect(a),a.connect(o),o.connect(i),this.env(o,.002,.16,.8)}bounce(t,e){if(!this.ctx)return;let n=this.out(t,Math.min(.6,e/30));this.tone("sine",90,40,.18,.8,n)}jump(t){if(!this.ctx)return;let e=this.out(t,.25),n=this.noiseSrc(.3),i=this.ctx.createBiquadFilter();i.type="bandpass",i.frequency.setValueAtTime(500,this.ctx.currentTime),i.frequency.exponentialRampToValueAtTime(2500,this.ctx.currentTime+.2);let r=this.ctx.createGain();n.connect(i),i.connect(r),r.connect(e),this.env(r,.01,.2,.8)}pad(t,e){if(!this.ctx)return;let n=this.out(t,e?.35:.2);this.tone("triangle",e?520:880,e?1560:1320,e?.35:.12,.7,n)}bump(t,e){if(!this.ctx)return;let n=this.out(t,Math.min(.8,e/15));this.tone("square",120,50,.15,.4,n),this.hit(t,e*.4)}explosion(t,e){if(!this.ctx)return;let n=this.ctx,i=this.out(t,e?1:.8),r=this.noiseSrc(e?2.5:1.4),a=n.createBiquadFilter();a.type="lowpass",a.frequency.setValueAtTime(e?3e3:2e3,n.currentTime),a.frequency.exponentialRampToValueAtTime(80,n.currentTime+(e?2.2:1.2));let o=n.createGain();r.connect(a),a.connect(o),o.connect(i),this.env(o,.005,e?2.2:1.2,1),this.tone("sine",110,28,e?1.4:.8,1,i)}horn(t){if(!this.ctx)return;let e=this.ctx,n=e.currentTime,i=e.createGain();i.connect(this.sfx),i.gain.setValueAtTime(1e-4,n),i.gain.exponentialRampToValueAtTime(.28,n+.05),i.gain.setValueAtTime(.28,n+1.6),i.gain.exponentialRampToValueAtTime(1e-4,n+2.4);let r=t?[220,277,330,440]:[196,233,294];for(let a of r){let o=e.createOscillator();o.type="sawtooth",o.frequency.value=a;let l=e.createOscillator();l.frequency.value=5;let c=e.createGain();c.gain.value=3,l.connect(c),c.connect(o.frequency);let h=e.createBiquadFilter();h.type="lowpass",h.frequency.value=1800,o.connect(h),h.connect(i),o.start(n),l.start(n),o.stop(n+2.5),l.stop(n+2.5)}this.cheer(3.5)}cheer(t=2.5){if(!this.ctx)return;let e=this.ctx,n=this.noiseSrc(t+.5),i=e.createBiquadFilter();i.type="bandpass",i.frequency.value=1200,i.Q.value=.5;let r=e.createGain(),a=e.currentTime;r.gain.setValueAtTime(1e-4,a),r.gain.exponentialRampToValueAtTime(.5,a+.3),r.gain.exponentialRampToValueAtTime(1e-4,a+t),n.connect(i),i.connect(r),r.connect(this.sfx)}beep(t){this.ctx&&this.tone("square",t?880:440,t?880:440,t?.5:.18,.18,this.sfx)}click(){this.ctx&&this.tone("triangle",1200,900,.05,.12,this.sfx)}startCrowd(){let t=this.ctx,e=t.createBufferSource();e.buffer=this.noise,e.loop=!0;let n=t.createBiquadFilter();n.type="bandpass",n.frequency.value=700,n.Q.value=.4,this.crowdGain=t.createGain(),this.crowdGain.gain.value=0,e.connect(n),n.connect(this.crowdGain),this.crowdGain.connect(this.sfx),e.start()}setCrowd(t){!this.ctx||!this.crowdGain||this.crowdGain.gain.setTargetAtTime(t*.12,this.ctx.currentTime,.4)}engine(t){if(!this.ctx)return null;if(this.engines[t])return this.engines[t];let e=this.ctx,n=e.createOscillator(),i=e.createOscillator();n.type="sawtooth",i.type="square";let r=e.createBiquadFilter();r.type="lowpass",r.frequency.value=600;let a=e.createGain();a.gain.value=0,n.connect(r),i.connect(r),r.connect(a),a.connect(this.sfx);let o=e.createBufferSource();o.buffer=this.noise,o.loop=!0;let l=e.createBiquadFilter();l.type="bandpass",l.frequency.value=600,l.Q.value=.7;let c=e.createGain();c.gain.value=0,o.connect(l),l.connect(c),c.connect(this.sfx),n.start(),i.start(),o.start();let h={o1:n,o2:i,f:r,g:a,bf:l,bg:c};return this.engines[t]=h,h}updateEngine(t,e,n,i,r,a,o){let l=this.engine(t);if(!l)return;let c=this.ctx.currentTime,h=Math.min(1,e/23),d=55+h*110+(r?0:20);l.o1.frequency.setTargetAtTime(d,c,.05),l.o2.frequency.setTargetAtTime(d*.5,c,.05),l.f.frequency.setTargetAtTime(400+h*1400+Math.abs(n)*300,c,.05);let u=a?(.05+Math.abs(n)*.05+h*.05)/Math.sqrt(o):0;l.g.gain.setTargetAtTime(u,c,.08),l.bg.gain.setTargetAtTime(a&&i?.35/Math.sqrt(o):0,c,.04),l.bf.frequency.setTargetAtTime(500+h*900,c,.1)}silenceEngines(){for(let t=0;t<this.engines.length;t++)this.engines[t]&&this.updateEngine(t,0,0,!1,!0,!1,1)}startMusic(){if(!this.ctx||this.musicTimer)return;let t=this.ctx,n=60/112/4,i=[[57,60,64],[53,57,60],[48,52,55],[55,59,62]],r=c=>440*Math.pow(2,(c-69)/12),a=t.currentTime+.1,o=0,l=()=>{for(;a<t.currentTime+.25;){let c=Math.floor(o/16)%4,h=i[c],d=o%16,u=a;if(d%4===0){let f=t.createOscillator(),m=t.createGain();f.frequency.setValueAtTime(120,u),f.frequency.exponentialRampToValueAtTime(40,u+.15),m.gain.setValueAtTime(.5,u),m.gain.exponentialRampToValueAtTime(.001,u+.2),f.connect(m),m.connect(this.music),f.start(u),f.stop(u+.25)}if(d%2===1){let f=t.createBufferSource();f.buffer=this.noise;let m=t.createBiquadFilter();m.type="highpass",m.frequency.value=7e3;let v=t.createGain();v.gain.setValueAtTime(.08,u),v.gain.exponentialRampToValueAtTime(.001,u+.05),f.connect(m),m.connect(v),v.connect(this.music),f.start(u,Math.random()),f.stop(u+.06)}if(d%2===0){let f=t.createOscillator();f.type="sawtooth",f.frequency.value=r(h[0]-24);let m=t.createBiquadFilter();m.type="lowpass",m.frequency.value=500;let v=t.createGain();v.gain.setValueAtTime(.12,u),v.gain.exponentialRampToValueAtTime(.001,u+n*1.8),f.connect(m),m.connect(v),v.connect(this.music),f.start(u),f.stop(u+n*2)}{let f=t.createOscillator();f.type="square",f.frequency.value=r(h[d%3]+(d%8<4?12:24));let m=t.createBiquadFilter();m.type="lowpass",m.frequency.value=2200;let v=t.createGain();v.gain.setValueAtTime(.035,u),v.gain.exponentialRampToValueAtTime(.001,u+n*.9),f.connect(m),m.connect(v),v.connect(this.music),f.start(u),f.stop(u+n)}a+=n,o++}};this.musicTimer=setInterval(l,60),l()}stopMusic(){this.musicTimer&&clearInterval(this.musicTimer),this.musicTimer=null}};var Mr=s=>String(s).replace(/[&<>"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[t]),Yy=s=>s===0?"b":"o";function $y(s){if(s.opts.freeplay)return"LIBRE";if(s.overtime){let e=Math.floor(s.overtimeElapsed);return`+${Math.floor(e/60)}:${String(e%60).padStart(2,"0")}`}if(s.opts.duration<=0)return"\u221E";let t=Math.ceil(s.timeLeft);return`${Math.floor(t/60)}:${String(t%60).padStart(2,"0")}`}var eo=2*Math.PI*60,Vc=class{constructor(t){this.root=t,this.players=[],this.centerTimer=0,this.goalTimer=0}setup(t,e,n){let i=this.root;if(i.innerHTML=`
      <div id="scorebar"><div class="team t0" id="s0">0</div><div id="clock">5:00</div><div class="team t1" id="s1">0</div></div>
      <div id="feed"></div>
      <div id="center-msg"></div>
      <div id="goal-banner"></div>
      <div id="replay-tag" class="hidden"><div class="r">REPLAY</div><div class="s">Appuyez sur SAUT pour passer</div></div>
      <div id="scoretable" class="hidden"></div>
      <div id="fps" class="hidden"></div>`,this.el={s0:i.querySelector("#s0"),s1:i.querySelector("#s1"),clock:i.querySelector("#clock"),feed:i.querySelector("#feed"),center:i.querySelector("#center-msg"),goal:i.querySelector("#goal-banner"),replay:i.querySelector("#replay-tag"),table:i.querySelector("#scoretable"),fps:i.querySelector("#fps")},this.players=e.map((r,a)=>{let o=document.createElement("div");o.className="phud";let l=n[a];Object.assign(o.style,{left:`${l.x*100}%`,top:`${l.y*100}%`,width:`${l.w*100}%`,height:`${l.h*100}%`});let c=l.h<.9?.72:1;return o.innerHTML=`
        <div class="boost" style="transform: scale(${c}); transform-origin: bottom right">
          <svg viewBox="0 0 140 140"><circle cx="70" cy="70" r="60" fill="rgba(0,0,0,0.45)" stroke="rgba(255,255,255,0.12)" stroke-width="12" stroke-dasharray="${eo*.75} ${eo}"/>
          <circle class="arc" cx="70" cy="70" r="60" fill="none" stroke="url(#bg${a})" stroke-width="12" stroke-linecap="round" stroke-dasharray="0 ${eo}"/>
          <defs><linearGradient id="bg${a}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffd24d"/><stop offset="1" stop-color="#ff6a00"/></linearGradient></defs></svg>
          <div class="num">33</div><div class="lbl">BOOST</div>
        </div>
        <div class="speedo" style="transform: scale(${c}); transform-origin: bottom right"><span class="sp">0</span> <small>km/h</small></div>
        <div class="camtag"></div>
        <div class="popups"></div>
        <div class="demo-msg hidden">D\xC9TRUIT !</div>`,this.root.appendChild(o),{el:o,car:r.car,arc:o.querySelector(".arc"),num:o.querySelector(".num"),sp:o.querySelector(".sp"),speedo:o.querySelector(".speedo"),cam:o.querySelector(".camtag"),popups:o.querySelector(".popups"),demo:o.querySelector(".demo-msg"),lastBoost:-1}}),n.length>1){let r=document.createElement("div");r.className="split-line",this.root.appendChild(r)}this.centerTimer=0,this.goalTimer=0}showCenter(t,e=1,n="",i="#fff"){let r=this.el.center;r.textContent=t,r.style.color=i,r.className="",r.offsetWidth,r.className=`pop ${n}`,this.centerTimer=e}feed(t,e="#fff"){let n=document.createElement("div");for(n.className="feed-item",n.style.borderLeftColor=e,n.innerHTML=t,this.el.feed.prepend(n);this.el.feed.children.length>6;)this.el.feed.lastChild.remove();setTimeout(()=>n.remove(),6e3)}popup(t,e,n){let i=document.createElement("div");i.className="popup",i.innerHTML=`${Mr(e)}${n?`<b>+${n}</b>`:""}`,t.popups.appendChild(i),setTimeout(()=>i.remove(),2300)}name(t){return`<span class="${Yy(t.team)}">${Mr(t.name)}</span>`}onEvent(t,e){switch(t.type){case"countdown":this.showCenter(String(t.n),.95);break;case"go":this.showCenter("GO !",.8,"","#ffe066");break;case"overtime":this.showCenter("PROLONGATION",2.4,"","#ffd34d");break;case"goal":{let n=t.team===0?"var(--blue)":"var(--orange)",i="";t.scorer?i=`${Mr(t.scorer.name)} a marqu\xE9 !`:t.ownGoal&&(i=`Contre son camp de ${Mr(t.ownGoal.name)}`),t.assist&&(i+=` <span style="color:#cfe0ff;font-size:20px">(passe de ${Mr(t.assist.name)})</span>`),this.el.goal.innerHTML=`<div class="big" style="color:${n}">BUT !</div><div class="sub">${i}</div><div class="speed">${t.speedKmh} km/h</div>`,this.goalTimer=3,t.scorer?this.feed(`\u26BD ${this.name(t.scorer)} a marqu\xE9`,t.team===0?"#2f7bff":"#ff8a1f"):this.feed(`\u26BD But pour l'\xE9quipe ${t.team===0?"BLEUE":"ORANGE"}`,t.team===0?"#2f7bff":"#ff8a1f");break}case"demo":this.feed(`${this.name(t.attacker)} \u{1F4A5} ${this.name(t.victim)}`,"#ff5050");for(let n of this.players)n.car===t.victim&&n.demo.classList.remove("hidden");break;case"respawn":for(let n of this.players)n.car===t.car&&n.demo.classList.add("hidden");break;case"stat":for(let n of this.players)n.car===t.car&&this.popup(n,t.label,t.points);(t.label==="ARR\xCAT"||t.label==="ARR\xCAT \xC9PIQUE")&&this.feed(`\u{1F9E4} ${this.name(t.car)} \u2014 ${t.label.toLowerCase()}`,"#9fe0ff");break;case"replayStart":this.el.goal.innerHTML="";break;default:break}return e}update(t,e,n,i){let r=this.el;r.s0.textContent=e.score[0],r.s1.textContent=e.score[1],r.clock.textContent=$y(e),r.clock.className=e.overtime?"ot":!e.opts.freeplay&&e.opts.duration>0&&e.timeLeft<=30?"low":"",r.replay.classList.toggle("hidden",e.state!=="replay"),this.centerTimer>0&&(this.centerTimer-=t,this.centerTimer<=0&&(r.center.textContent="")),this.goalTimer>0&&(this.goalTimer-=t,this.goalTimer<=0&&(r.goal.innerHTML=""));let a=e.state==="replay";this.players.forEach((l,c)=>{let h=l.car;l.el.style.visibility=a?"hidden":"visible";let d=Math.round(h.boost);d!==l.lastBoost&&(l.lastBoost=d,l.num.textContent=d,l.arc.setAttribute("stroke-dasharray",`${eo*.75*(d/100)} ${eo}`),l.arc.style.opacity=d>0?1:0);let u=Math.round(h.vel.length()*3.6);l.sp.textContent=u,l.speedo.classList.toggle("ss",h.supersonic),l.cam.textContent=i.ballCam[c]?"CAM\xC9RA BALLE":"CAM\xC9RA VOITURE",h.demolished||l.demo.classList.add("hidden")}),r.fps.classList.toggle("hidden",!i.showFps),i.showFps&&(r.fps.textContent=`${i.fps} FPS`);let o=i.scoreboard||e.state==="ended";return r.table.classList.toggle("hidden",!i.scoreboard),i.scoreboard&&(r.table.innerHTML=Lu(e)),o}clear(){this.root.innerHTML="",this.players=[]}};function Lu(s,t=!1){let e=null;if(t&&s.winner>=0)for(let i of s.cars)i.team===s.winner&&(!e||i.stats.score>e.stats.score)&&(e=i);let n="";for(let i of[0,1]){let r=s.cars.filter(a=>a.team===i).sort((a,o)=>o.stats.score-a.stats.score);if(r.length){n+=`<div class="st-team"><h4 style="color:${i===0?"var(--blue)":"var(--orange)"}">${i===0?"BLEU":"ORANGE"} \u2014 ${s.score[i]}</h4>
      <table class="st-table st-t${i}"><tr><th>JOUEUR</th><th>SCORE</th><th>BUTS</th><th>PASSES</th><th>ARR\xCATS</th><th>TIRS</th><th>D\xC9MOS</th></tr>`;for(let a of r){let o=a.stats;n+=`<tr><td>${Mr(a.name)}${a.isBot?' <span style="color:#6f80a3;font-size:11px">IA</span>':""}${a===e?'<span class="mvp">\u2605 MVP</span>':""}</td>
        <td>${o.score}</td><td>${o.goals}</td><td>${o.assists}</td><td>${o.saves}</td><td>${o.shots}</td><td>${o.demos}</td></tr>`}n+="</table></div>"}}return n}var Hp="supersonic-arena-settings-v1",Hc={playerName:"Joueur",player2Name:"Joueur 2",body:"octane",accent:"#1b1d22",boostColor:"team",fov:110,camDistance:2.7,camHeight:1,camStiffness:11,ballCamDefault:!0,volMaster:.8,volSfx:.9,volMusic:.5,quality:"high",showFps:!1,deadzone:.15,invertPitch:!1,keys:null,teamSize:2,difficulty:"pro",duration:300,theme:"day",team:0,splitscreen:!1,p2Team:1,replays:!0};function Gp(){let s={};try{s=JSON.parse(localStorage.getItem(Hp)||"{}")||{}}catch{s={}}let t={...Hc,...s};return t.keys={...to,...s.keys||{}},t}function Wp(s){try{localStorage.setItem(Hp,JSON.stringify(s))}catch{}}var no={low:{label:"Basse",pixelRatio:.75,shadows:!1,bloom:!1,shadowSize:1024},medium:{label:"Moyenne",pixelRatio:1,shadows:!0,bloom:!1,shadowSize:1024},high:{label:"Haute",pixelRatio:1.5,shadows:!0,bloom:!0,shadowSize:2048},ultra:{label:"Ultra",pixelRatio:2,shadows:!0,bloom:!0,shadowSize:4096}};var Xp=s=>String(s).replace(/[&<>"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[t]),Zy=["#1b1d22","#e8e8e8","#d62828","#f7c948","#2ec27e","#8a4dff","#ff4fa3","#00c2d1","#6b4a2b"],Jy=["team","#ffd24d","#ff3b3b","#39ff88","#b05cff","#4de1ff","#ffffff","#ff66cc"];function hn(s,t,e,n=""){return`<div class="seg" data-seg="${s}">${t.map(([i,r])=>`<button data-v="${i}" class="${String(i)===String(e)?`on ${n}`:""}">${r}</button>`).join("")}</div>`}var Gc=class{constructor(t,e){this.root=t,this.app=e,this.screen=null,this.stack=[],this.focus=0,this.waitingKey=null}get s(){return this.app.settings}hide(){this.root.innerHTML="",this.screen=null}isOpen(){return!!this.screen}show(t,e=!0){e&&this.screen&&this.screen!==t&&this.stack.push(this.screen),this.screen=t,this.focus=0,this.render(),this.app.onMenuChange(t)}back(){let t=this.stack.pop();t?this.show(t,!1):this.app.inMatch()&&this.app.resume()}render(){let t=this[`html_${this.screen}`]();this.root.innerHTML=t,this.bind()}bind(){let t=this.root;t.querySelectorAll("[data-action]").forEach(e=>{e.addEventListener("click",()=>{this.app.sound.click(),this.action(e.dataset.action,e)})}),t.querySelectorAll("[data-seg]").forEach(e=>{e.querySelectorAll("button").forEach(n=>n.addEventListener("click",()=>{this.app.sound.click(),this.setOption(e.dataset.seg,n.dataset.v)}))}),t.querySelectorAll("input[type=range]").forEach(e=>{e.addEventListener("input",()=>{let n=parseFloat(e.value);this.s[e.dataset.key]=n;let i=e.parentElement.querySelector(".val");i&&(i.textContent=e.dataset.fmt==="pct"?`${Math.round(n*100)}%`:n),this.app.applySettings()})}),t.querySelectorAll("input[type=text]").forEach(e=>{e.addEventListener("input",()=>{this.s[e.dataset.key]=e.value.slice(0,16)||Hc[e.dataset.key],this.app.saveSettings()})}),t.querySelectorAll(".swatch").forEach(e=>e.addEventListener("click",()=>{this.app.sound.click(),this.s[e.dataset.key]=e.dataset.v,this.app.applySettings(),this.render()})),t.querySelectorAll(".key[data-bind]").forEach(e=>{e.addEventListener("click",n=>{n.stopPropagation(),e.classList.add("wait"),e.textContent="\u2026";let[i,r]=e.dataset.bind.split(":");setTimeout(()=>this.app.input.captureNext(a=>{let o=[...this.s.keys[i]||[]];(a!=="Escape"||i==="pause")&&(o[+r]=a),this.s.keys[i]=o.filter(Boolean),this.app.saveSettings(),this.render()}),50)})})}setOption(t,e){let n=["teamSize","duration","team","p2Team"],i=e;n.includes(t)&&(i=Number(e)),(e==="true"||e==="false")&&(i=e==="true"),t==="freeUnlimited"?this.freeUnlimited=i:this.s[t]=i,this.app.applySettings(),this.render()}action(t){let e=this.app;switch(t){case"play":this.show("play");break;case"free":this.show("free");break;case"garage":this.show("garage");break;case"settings":this.show("settings");break;case"controls":this.show("controls");break;case"back":this.back();break;case"start":e.startMatch(this.matchConfig());break;case"startFree":e.startMatch({freeplay:!0,unlimitedBoost:this.freeUnlimited!==!1});break;case"resume":e.resume();break;case"restart":e.restart();break;case"quit":e.quitToMenu();break;case"resetSettings":{let n={keys:this.s.keys,playerName:this.s.playerName};Object.assign(this.s,Hc,n),e.applySettings(),this.render();break}case"resetKeys":this.s.keys={...to},e.saveSettings(),this.render();break;case"fullscreen":document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen&&document.documentElement.requestFullscreen();break;default:break}}matchConfig(){let t=this.s;return{teamSize:t.teamSize,difficulty:t.difficulty,duration:t.duration,theme:t.theme,team:t.team,splitscreen:t.splitscreen,p2Team:t.p2Team,replays:t.replays}}html_main(){return`<div class="menu"><div class="col">
      <div class="title">Supersonic<br>Arena</div>
      <div class="subtitle">Football \xB7 voitures \xB7 fus\xE9es</div>
      <button class="btn primary" data-action="play">Jouer<small>Match contre l'IA, de 1c1 \xE0 4c4, seul ou en \xE9cran partag\xE9</small></button>
      <button class="btn" data-action="free">Entra\xEEnement libre<small>Toi, la balle et du boost illimit\xE9</small></button>
      <button class="btn" data-action="garage">Garage<small>Carrosserie, couleurs et tra\xEEn\xE9e de boost</small></button>
      <button class="btn" data-action="settings">Param\xE8tres<small>Graphismes, cam\xE9ra, audio, manette</small></button>
      <button class="btn" data-action="controls">Commandes<small>Clavier/souris et manette \u2014 touches personnalisables</small></button>
      <button class="btn" data-action="fullscreen">Plein \xE9cran</button>
      <div class="footer">Jeu de fan non officiel inspir\xE9 de Rocket League\xAE. Manette Xbox/PlayStation support\xE9e.<br>F11 ou \xAB Plein \xE9cran \xBB pour une immersion totale.</div>
    </div></div>`}html_play(){let t=this.s,e=Object.entries(Ha).map(([i,r])=>[i,r.label]),n=Object.entries(fs).map(([i,r])=>[i,r.label]);return`<div class="menu center dim"><div class="col">
      <h2>Partie rapide</h2>
      <div class="opt"><label>Format</label>${hn("teamSize",[[1,"1 c 1"],[2,"2 c 2"],[3,"3 c 3"],[4,"4 c 4"]],t.teamSize)}</div>
      <div class="opt"><label>Difficult\xE9 IA</label>${hn("difficulty",e,t.difficulty)}</div>
      <div class="opt"><label>Dur\xE9e</label>${hn("duration",[[120,"2 min"],[300,"5 min"],[600,"10 min"],[0,"Illimit\xE9e"]],t.duration)}</div>
      <div class="opt"><label>Ar\xE8ne</label>${hn("theme",n,t.theme)}</div>
      <div class="opt"><label>Ton \xE9quipe</label>${hn("team",[[0,"Bleue"],[1,"Orange"]],t.team,t.team===1?"orange":"")}</div>
      <div class="opt"><label>\xC9cran partag\xE9</label>${hn("splitscreen",[[!1,"1 joueur"],[!0,"2 joueurs"]],t.splitscreen)}</div>
      ${t.splitscreen?`<div class="opt"><label>Joueur 2</label>${hn("p2Team",[[t.team,"Avec moi"],[1-t.team,"Contre moi"]],t.p2Team)}</div>
      <div class="hint">Joueur 1 : clavier/souris (ou 2e manette). Joueur 2 : premi\xE8re manette branch\xE9e.</div>`:""}
      <div class="opt"><label>Replays des buts</label>${hn("replays",[[!0,"Oui"],[!1,"Non"]],t.replays)}</div>
      <div class="btn-row"><button class="btn" data-action="back">Retour</button><button class="btn primary" data-action="start">Lancer le match</button></div>
    </div></div>`}html_free(){let t=this.s,e=Object.entries(fs).map(([n,i])=>[n,i.label]);return`<div class="menu center dim"><div class="col">
      <h2>Entra\xEEnement libre</h2>
      <div class="opt"><label>Ar\xE8ne</label>${hn("theme",e,t.theme)}</div>
      <div class="opt"><label>Boost illimit\xE9</label>${hn("freeUnlimited",[[!0,"Oui"],[!1,"Non"]],this.freeUnlimited!==!1)}</div>
      <p class="hint">Touche <span class="key">${zc(t.keys.resetBall[0])}</span> : replacer la balle devant toi \xB7
      <span class="key">${zc(t.keys.shootBall[0])}</span> : la balle est lanc\xE9e vers toi (parfait pour s'entra\xEEner aux a\xE9riennes).</p>
      <div class="btn-row"><button class="btn" data-action="back">Retour</button><button class="btn primary" data-action="startFree">C'est parti</button></div>
    </div></div>`}html_garage(){let t=this.s,e=Object.entries(Sn).map(([r,a])=>[r,a.name]),n=(r,a)=>`<div class="swatches">${a.map(o=>`<div class="swatch ${t[r]===o?"on":""}" data-key="${r}" data-v="${o}"
      style="background:${o==="team"?"linear-gradient(135deg,#2f7bff 50%,#ff8a1f 50%)":o}" title="${o==="team"?"Couleur d'\xE9quipe":o}"></div>`).join("")}</div>`,i=Sn[t.body]||Sn.octane;return`<div class="menu"><div class="col">
      <h2>Garage</h2>
      <div class="opt"><label>Pseudo</label><input type="text" data-key="playerName" maxlength="16" value="${Xp(t.playerName)}"></div>
      <div class="opt"><label>Carrosserie</label>${hn("body",e,t.body)}</div>
      <div class="hint">Hitbox : ${(i.hx*200).toFixed(0)} \xD7 ${(i.hz*200).toFixed(0)} \xD7 ${(i.hy*200).toFixed(0)} cm \u2014 ${{octane:"polyvalente et haute, id\xE9ale pour les dribbles",dominus:"longue et plate, parfaite pour les frappes puissantes",breakout:"la plus longue, pour les tirs pr\xE9cis",merc:"massive, un tank pour d\xE9fendre"}[t.body]||""}</div>
      <div class="opt"><label>Couleur secondaire</label>${n("accent",Zy)}</div>
      <div class="opt"><label>Tra\xEEn\xE9e de boost</label>${n("boostColor",Jy)}</div>
      <div class="opt"><label>Pseudo joueur 2</label><input type="text" data-key="player2Name" maxlength="16" value="${Xp(t.player2Name)}"></div>
      <div class="btn-row"><button class="btn" data-action="back">Retour</button></div>
    </div></div>`}html_settings(){let t=this.s,e=(n,i,r,a,o)=>`<div><input type="range" data-key="${n}" data-fmt="${o||""}" min="${i}" max="${r}" step="${a}" value="${t[n]}">
      <span class="val">${o==="pct"?`${Math.round(t[n]*100)}%`:t[n]}</span></div>`;return`<div class="menu center dim"><div class="col">
      <h2>Param\xE8tres</h2>
      <h3>Graphismes</h3>
      <div class="opt"><label>Qualit\xE9</label>${hn("quality",Object.entries(no).map(([n,i])=>[n,i.label]),t.quality)}</div>
      <div class="opt"><label>Afficher les FPS</label>${hn("showFps",[[!1,"Non"],[!0,"Oui"]],t.showFps)}</div>
      <h3>Cam\xE9ra</h3>
      <div class="opt"><label>Champ de vision</label>${e("fov",70,120,1)}</div>
      <div class="opt"><label>Distance</label>${e("camDistance",1.8,4.2,.1)}</div>
      <div class="opt"><label>Hauteur</label>${e("camHeight",.5,2,.05)}</div>
      <div class="opt"><label>Rigidit\xE9</label>${e("camStiffness",4,25,1)}</div>
      <div class="opt"><label>Cam\xE9ra balle au d\xE9part</label>${hn("ballCamDefault",[[!0,"Oui"],[!1,"Non"]],t.ballCamDefault)}</div>
      <h3>Audio</h3>
      <div class="opt"><label>Volume g\xE9n\xE9ral</label>${e("volMaster",0,1,.05,"pct")}</div>
      <div class="opt"><label>Effets</label>${e("volSfx",0,1,.05,"pct")}</div>
      <div class="opt"><label>Musique (menus)</label>${e("volMusic",0,1,.05,"pct")}</div>
      <h3>Manette</h3>
      <div class="opt"><label>Zone morte</label>${e("deadzone",.02,.4,.01)}</div>
      <div class="opt"><label>Inverser le tangage</label>${hn("invertPitch",[[!1,"Non"],[!0,"Oui"]],t.invertPitch)}</div>
      <div class="btn-row"><button class="btn" data-action="resetSettings">Par d\xE9faut</button><button class="btn primary" data-action="back">Retour</button></div>
    </div></div>`}html_controls(){let t=this.s,e=Vp.map(([i,r])=>{let a=t.keys[i]||[],o=[0,1].map(l=>`<span class="key" data-bind="${i}:${l}">${a[l]?zc(a[l]):"+"}</span>`).join("");return`<tr><td>${r}</td><td>${o}</td></tr>`}).join(""),n=[["Acc\xE9l\xE9rer / reculer","RT / LT"],["Diriger \xB7 tangage \xB7 lacet","Stick gauche"],["Sauter / double saut / flip","A (\u2715)"],["Boost","B (\u25CB) ou RB (R1)"],["D\xE9rapage / air roll libre","X (\u25A1)"],["Air roll gauche","LB (L1)"],["Cam\xE9ra balle","Y (\u25B3)"],["Tableau des scores","Back / Share"],["Pause","Start / Options"]].map(([i,r])=>`<tr><td>${i}</td><td><span class="key">${r}</span></td></tr>`).join("");return`<div class="menu center dim"><div class="col">
      <h2>Commandes</h2>
      <p class="hint">Clique sur une touche puis appuie sur la nouvelle touche (ou un bouton de souris) pour la r\xE9assigner.</p>
      <h3>Clavier / souris</h3>
      <table class="keys-table">${e}</table>
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
      ${Lu(t,!0)}
      <div class="btn-row"><button class="btn" data-action="quit">Menu principal</button><button class="btn primary" data-action="restart">Rejouer</button></div>
    </div></div>`}navigate(t){let e=[...this.root.querySelectorAll("button")];e.length&&(this.focus=(this.focus+t+e.length)%e.length,e.forEach((n,i)=>n.classList.toggle("focus",i===this.focus)),e[this.focus].scrollIntoView({block:"nearest"}))}activate(){let t=[...this.root.querySelectorAll("button")];t[this.focus]&&t[this.focus].click()}};var io=dt.dt,qp=[1776930,15263976,14034984,16238920,3064446,9063935,49873,4475479],gn=new E,Sr=new E;function Yp(s){let t=s.slice();for(let e=t.length-1;e>0;e--){let n=Math.floor(Math.random()*(e+1));[t[e],t[n]]=[t[n],t[e]]}return t}var Du=class{constructor(){this.settings=Gp(),this.canvas=document.getElementById("game"),this.renderer=new hc({canvas:this.canvas,antialias:!0,powerPreference:"high-performance"}),this.renderer.outputColorSpace=We,this.renderer.toneMapping=rs,this.renderer.shadowMap.type=is,this.scene=new Ki;let t=new ir(this.renderer);this.scene.environment=t.fromScene(new _c,.04).texture,this.scene.environmentIntensity=.35,this.cameras=[new Xe(80,1,.1,3e3),new Xe(80,1,.1,3e3)],this.cameras[0].layers.enable(3),this.cameras[1].layers.enable(2),this.rigs=this.cameras.map(i=>new Fc(i)),this.effects=new Nc(this.scene),this.input=new Bc(this.settings),this.sound=new kc(this.settings),this.hud=new Vc(document.getElementById("hud")),this.menus=new Gc(document.getElementById("ui"),this);let e=Mp();this.ballMesh=new wt(new ns(dt.ballRadius,48,32),new Ee({map:e.map,emissiveMap:e.emissiveMap,emissive:16777215,emissiveIntensity:1.3,roughness:.38,metalness:.35})),this.ballMesh.castShadow=!0,this.scene.add(this.ballMesh),this.ballShadow=new wt(new un(2.6,2.6),new be({map:bp(),transparent:!0,depthWrite:!1})),this.ballShadow.rotation.x=-Math.PI/2,this.ballShadow.renderOrder=2,this.scene.add(this.ballShadow),this.world=null,this.themeKey=null,this.qualityKey=null,this.match=null,this.mode="menu",this.paused=!1,this.carViews=[],this.locals=[],this.bots=[],this.acc=0,this.last=performance.now(),this.fpsFrames=0,this.fpsTime=0,this.fps=0,this.attractTime=0,this.endTimer=-1,this.garage=null,this.frameEvents=[],this.applySettings(!1),this.buildWorld(this.settings.theme),window.addEventListener("resize",()=>this.resize()),this.resize();let n=()=>{this.sound.init(),this.mode==="menu"&&this.sound.startMusic()};window.addEventListener("pointerdown",n),window.addEventListener("keydown",n),this.startAttract(),this.menus.show("main",!1),document.getElementById("loading").remove(),requestAnimationFrame(i=>this.frame(i))}get quality(){return no[this.settings.quality]||no.high}saveSettings(){Wp(this.settings)}applySettings(t=!0){let e=this.settings;this.sound.applyVolumes(),this.qualityKey&&this.qualityKey!==e.quality&&this.buildWorld(this.themeKey,!0),this.qualityKey=e.quality,this.resize(),this.garage&&this.refreshGarage(),this.mode==="menu"&&this.menus.screen==="play"&&e.theme!==this.themeKey&&this.buildWorld(e.theme),this.mode==="menu"&&this.menus.screen==="free"&&e.theme!==this.themeKey&&this.buildWorld(e.theme),t&&this.saveSettings()}resize(){let t=this.quality,e=window.innerWidth,n=window.innerHeight;this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,t.pixelRatio)),this.renderer.setSize(e,n,!1),this.composer&&(this.composer.setPixelRatio(this.renderer.getPixelRatio()),this.composer.setSize(e,n))}buildWorld(t,e=!1){if(t===this.themeKey&&!e)return;let n=fs[t]||fs.day;this.themeKey=fs[t]?t:"day";let i=this.quality;this.world&&(this.scene.remove(this.world.group),this.world.group.traverse(h=>{h.geometry&&h.geometry.dispose(),h.material&&(Array.isArray(h.material)?h.material:[h.material]).forEach(d=>{d.map&&d.map.dispose(),d.dispose()})}));let r=new Le,a=Ip(n,i);r.add(a.group),r.add(Lp(n));let o=new ga(n.hemiSky,n.hemiGround,n.hemiIntensity);r.add(o);let l=new ya(n.sun,n.sunIntensity);l.position.set(...n.sunDir).normalize().multiplyScalar(120),l.target.position.set(0,0,0),l.castShadow=i.shadows,l.shadow.mapSize.set(i.shadowSize,i.shadowSize);let c=l.shadow.camera;if(c.left=-62,c.right=62,c.top=72,c.bottom=-72,c.near=10,c.far=300,l.shadow.bias=-4e-4,l.shadow.normalBias=.03,r.add(l,l.target),this.scene.add(r),this.scene.fog=new Wr(n.fog,220,1100),this.renderer.shadowMap.enabled=i.shadows,this.renderer.toneMappingExposure=n.exposure,this.world={group:r,updatePads:a.updatePads},this.composer=null,i.bloom){let h=new mc(this.renderer);this.renderPass=new gc(this.scene,this.cameras[0]),h.addPass(this.renderPass),this.bloom=new or(new it(512,512),.6,.4,1),h.addPass(this.bloom),h.addPass(new xc),this.composer=h}this.scene.traverse(h=>{h.material&&(Array.isArray(h.material)?h.material:[h.material]).forEach(d=>{d.needsUpdate=!0})}),this.resize()}makePlayers(t){let e=this.settings,n=Yp(xu),i=Object.keys(Sn),r=[],a=(c,h,d,u)=>({team:h,name:c,body:d,isBot:!1,local:u});if(t.freeplay)return[a(e.playerName,0,e.body,0)];let o=t.teamSize,l=[a(e.playerName,t.team,e.body,0)];t.splitscreen&&l.push(a(e.player2Name,t.p2Team,i[(i.indexOf(e.body)+1)%i.length],1));for(let c=0;c<2;c++){let h=l.filter(d=>d.team===c);r.push(...h.slice(0,o));for(let d=h.length;d<o;d++)r.push({team:c,name:n.pop(),body:i[Math.floor(Math.random()*i.length)],isBot:!0})}return r}startMatch(t){this.clearMatch(),this.lastConfig=t;let e=this.settings;t.theme?this.buildWorld(t.theme):this.buildWorld(e.theme);let n=this.makePlayers(t);this.match=new $a({players:n,duration:t.freeplay?0:t.duration,freeplay:!!t.freeplay,unlimitedBoost:!!t.unlimitedBoost,replays:t.freeplay?!1:t.replays}),this.splitscreen=!!t.splitscreen&&!t.freeplay,this.locals=[],this.match.cars.forEach((i,r)=>{n[r].local!==void 0&&(this.locals[n[r].local]={car:i,index:n[r].local})}),this.locals=this.locals.filter(Boolean),this.bots=this.match.cars.filter(i=>i.isBot).map(i=>new Ja(i,t.difficulty||"pro")),this.createCarViews(this.match),this.rigs.forEach(i=>{i.reset(),i.ballCam=e.ballCamDefault}),this.mode="match",this.paused=!1,this.endTimer=-1,this.acc=0,this.effects.clear(),this.menus.hide(),this.menus.stack=[],this.hud.root.classList.remove("hidden"),this.hud.setup(this.match,this.locals,this.viewports()),this.sound.init(),this.sound.stopMusic(),document.body.style.cursor="none"}createCarViews(t){this.carViews.forEach(i=>{this.scene.remove(i.group),i.dispose()});let e=this.settings,n=new Set(this.locals.map(i=>i.car));this.carViews=t.cars.map((i,r)=>{let a=n.has(i),o=a?new ht(e.accent).getHex():qp[(r*3+1)%qp.length],l=a&&e.boostColor!=="team"?new ht(e.boostColor).getHex():null,c=new Qa(i,{teamColor:cr[i.team].main,accent:o,boostColor:l,showName:!a||this.splitscreen}),h=this.locals.findIndex(d=>d.car===i);return c.nameTag&&h>=0&&c.nameTag.layers.set(2+h),this.scene.add(c.group),c})}clearMatch(){this.match=null,this.carViews.forEach(t=>{this.scene.remove(t.group),t.dispose()}),this.carViews=[],this.bots=[],this.locals=[],this.hud.clear(),this.hud.root.classList.add("hidden")}startAttract(){this.clearMatch(),this.mode="menu",this.splitscreen=!1;let t=Yp(xu),e=Object.keys(Sn),n=[];for(let i=0;i<2;i++)for(let r=0;r<2;r++)n.push({team:i,name:t.pop(),body:e[(i*2+r)%4],isBot:!0});this.match=new $a({players:n,duration:0,replays:!1}),this.bots=this.match.cars.map(i=>new Ja(i,"allstar")),this.createCarViews(this.match),this.rigs[0].reset(),this.attractTime=0,document.body.style.cursor=""}restart(){this.lastConfig&&this.startMatch(this.lastConfig)}resume(){this.paused=!1,this.menus.hide(),this.menus.stack=[],document.body.style.cursor="none"}pause(){this.mode!=="match"||this.match.state==="ended"||(this.paused=!0,this.menus.stack=[],this.menus.show("pause",!1),this.sound.silenceEngines(),document.body.style.cursor="")}quitToMenu(){this.paused=!1,this.menus.stack=[],this.startAttract(),this.menus.show("main",!1),this.sound.startMusic()}inMatch(){return this.mode==="match"}localTeam(){return this.locals.length?this.locals[0].car.team:0}localTeams(){return new Set(this.locals.map(t=>t.car.team))}onMenuChange(t){t==="garage"?this.enterGarage():this.garage&&this.exitGarage(),(t==="play"||t==="free")&&this.mode==="menu"&&this.buildWorld(this.settings.theme)}enterGarage(){this.garage||(this.garage={t:0,view:null},this.refreshGarage())}refreshGarage(){if(!this.garage)return;let t=this.settings;this.garage.view&&(this.scene.remove(this.garage.view.group),this.garage.view.dispose());let e={bodyKey:t.body,name:t.playerName,team:0},n=new Qa(e,{teamColor:cr[0].main,accent:new ht(t.accent).getHex(),boostColor:t.boostColor!=="team"?new ht(t.boostColor).getHex():null,showName:!1});this.scene.add(n.group),this.garage.view=n}exitGarage(){this.garage&&(this.garage.view&&(this.scene.remove(this.garage.view.group),this.garage.view.dispose()),this.garage=null,this.rigs[0].reset())}viewports(){return this.mode==="match"&&this.splitscreen&&this.locals.length>1?[{x:0,y:0,w:1,h:.5},{x:0,y:.5,w:1,h:.5}]:[{x:0,y:0,w:1,h:1}]}frame(t){requestAnimationFrame(i=>this.frame(i));let e=Math.min(.1,(t-this.last)/1e3);this.last=t,this.fpsFrames++,this.fpsTime+=e,this.fpsTime>.5&&(this.fps=Math.round(this.fpsFrames/this.fpsTime),this.fpsFrames=0,this.fpsTime=0),this.input.poll(),this.handleUiInput();let n=this.match&&!this.paused&&!this.garage;if(n){this.acc+=e;let i=0;for(;this.acc>=io&&i<12;)this.step(),this.acc-=io,i++;i===12&&(this.acc=0)}this.processEvents(),this.render(e,n)}handleUiInput(){let t=this.input,e=this.splitscreen;if(this.menus.isOpen()){for(let n=0;n<2;n++)for(let i of t.padFor(n,!1)){let r=t.padPressed.get(i.index)||[];r[12]&&this.menus.navigate(-1),r[13]&&this.menus.navigate(1),r[0]&&this.menus.activate(),r[1]&&this.menus.back()}this.mode==="match"&&t.pressed("pause",0,!1)&&this.menus.screen==="pause"?this.resume():t.frameKeys&&t.frameKeys.has("Escape")&&this.menus.screen!=="main"&&this.menus.screen!=="pause"&&this.menus.screen!=="end"&&this.menus.back();return}if(this.mode==="match"){for(let n=0;n<this.locals.length;n++){if(t.pressed("pause",n,e)){this.pause();return}t.pressed("ballCam",n,e)&&(this.rigs[n].ballCam=!this.rigs[n].ballCam),this.match.state==="replay"&&t.pressed("jump",n,e)&&this.match.requestSkip()}this.match.opts.freeplay&&this.locals[0]&&(t.pressed("resetBall",0,e)&&this.freeplayBall(!1),t.pressed("shootBall",0,e)&&this.freeplayBall(!0))}}freeplayBall(t){let e=this.match,n=this.locals[0].car,i=e.ball;if(n.forward(gn),gn.y=0,gn.normalize(),t){let r=Math.random()*Math.PI*2,a=new E(n.pos.x+Math.cos(r)*22,2,n.pos.z+Math.sin(r)*22);a.x=an.clamp(a.x,-ae.W+4,ae.W-4),a.z=an.clamp(a.z,-ae.L+4,ae.L-4);let o=n.pos.clone().addScaledVector(gn,8);o.y=5+Math.random()*5;let l=2.2;i.reset(a.x,a.y,a.z),i.vel.copy(o).sub(a).multiplyScalar(1/l),i.vel.y-=.5*dt.gravity*l}else{let r=n.pos.clone().addScaledVector(gn,7);r.x=an.clamp(r.x,-ae.W+3,ae.W-3),r.z=an.clamp(r.z,-ae.L+3,ae.L-3),i.reset(r.x,1.5,r.z)}e.state="playing",e.refreshPrediction()}step(){let t=this.match;for(let e of this.locals)this.input.controls(e.index,this.splitscreen,e.car.controls);for(let e of this.bots)e.update(io,t);t.tick(io),t.events.length&&(this.frameEvents.push(...t.events),t.events.length=0),this.mode==="menu"&&t.state==="playing"&&t.time>240&&t.kickoff===!1&&Math.random()<5e-4&&t.resetKickoff()}processEvents(){let t=this.match,e=this.mode==="match",n=new Set(this.locals.map(i=>i.car));for(let i of this.frameEvents)switch(e&&this.hud.onEvent(i,t),i.type){case"hit":this.effects.sparks(i.pos,i.strength),this.sound.hit(i.pos,i.strength),n.has(i.car)&&this.rigs[this.locals.findIndex(r=>r.car===i.car)].addShake(Math.min(.25,i.strength*.01));break;case"bounce":this.sound.bounce(i.pos,i.strength);break;case"jump":case"dodge":n.has(i.car)&&this.sound.jump(i.car.pos);break;case"pad":this.effects.padPickup(i.pos,i.big),n.has(i.car)&&this.sound.pad(i.pos,i.big);break;case"bump":this.sound.bump(i.pos,i.strength);break;case"demo":this.effects.demolition(i.pos,cr[i.victim.team].main),this.sound.explosion(i.pos,!1),this.locals.forEach((r,a)=>{(r.car===i.victim||r.car===i.attacker)&&this.rigs[a].addShake(.4)});break;case"goal":this.effects.explosion(i.pos,cr[i.team].main,!0),this.sound.explosion(i.pos,!0),e&&this.sound.horn(this.localTeams().has(i.team)),this.rigs.forEach(r=>r.addShake(.7));break;case"replayGoal":this.effects.explosion(i.pos,cr[i.team].main,!0),this.sound.explosion(i.pos,!0);break;case"kickoff":case"replayStart":this.effects.clear(),this.rigs.forEach(r=>r.reset());break;case"countdown":e&&this.sound.beep(!1);break;case"go":e&&this.sound.beep(!0);break;case"overtime":e&&this.sound.beep(!0);break;case"end":e&&(this.endTimer=2.5,this.sound.cheer(4));break;default:break}this.frameEvents.length=0}visualStates(t){let e=this.match,n=[];if(e.state==="replay"&&e.replay){let r=e.replaySnapshot(e.replay.time),{a,b:o,k:l}=r,c=Math.max(.001,o.t-a.t);e.cars.forEach((u,f)=>{let m=a.cars[f],v=o.cars[f],p=new E(m[0]+(v[0]-m[0])*l,m[1]+(v[1]-m[1])*l,m[2]+(v[2]-m[2])*l),g=new re(m[3],m[4],m[5],m[6]),M=new re(v[3],v[4],v[5],v[6]),w=new E(v[0]-m[0],v[1]-m[1],v[2]-m[2]).multiplyScalar(1/c);w.lengthSq()>3e3&&w.set(0,0,0),n.push({pos:p,quat:g.slerp(M,l),boosting:!!m[7],demolished:!!m[8],steer:m[9],spin:m[10]+(v[10]-m[10])*l,supersonic:!!m[11],vel:w,onGround:!0,groundNormal:new E(0,1,0)})});let h=a.ball,d=o.ball;return{cars:n,ball:{pos:new E(h[0]+(d[0]-h[0])*l,h[1]+(d[1]-h[1])*l,h[2]+(d[2]-h[2])*l),quat:new re(h[3],h[4],h[5],h[6]).slerp(new re(d[3],d[4],d[5],d[6]),l),hidden:!!h[7]}}}for(let r of e.cars)n.push({pos:new E().lerpVectors(r.prevPos,r.pos,t),quat:new re().slerpQuaternions(r.prevQuat,r.quat,t),boosting:r.boosting,demolished:r.demolished,steer:r.steerVis,spin:r.wheelSpin,supersonic:r.supersonic,vel:r.vel,onGround:r.onGround,groundNormal:r.groundNormal});let i=e.ball;return{cars:n,ball:{pos:new E().lerpVectors(i.prevPos,i.pos,t),quat:new re().slerpQuaternions(i.prevQuat,i.quat,t),hidden:i.hidden}}}render(t,e){let n=this.match,i=performance.now()/1e3,r=e?this.acc/io:1,a=this.visualStates(r);a.cars.forEach((p,g)=>{let M=this.carViews[g];if(M&&(M.update(p,i),this.garage&&(M.group.visible=!1),!(p.demolished||this.garage||!e))){if(p.boosting){Sr.set(1,0,0).applyQuaternion(p.quat);for(let w=0;w<2;w++)M.exhaustWorld(w,gn),this.effects.boost(gn,Sr,p.vel,M.boostColor,p.supersonic)}if(p.supersonic)for(let w of[1,-1])gn.set(M.backX,M.wheelBaseY+.05,w*M.halfWidth).applyQuaternion(p.quat).add(p.pos),this.effects.trail(gn,new ht(.8,.9,1.2))}});let o=a.ball;this.ballMesh.visible=!o.hidden&&!this.garage,this.ballMesh.position.copy(o.pos),this.ballMesh.quaternion.copy(o.quat);let l=o.pos.y-dt.ballRadius;this.ballShadow.visible=this.ballMesh.visible&&Math.abs(o.pos.x)<ae.W-2&&Math.abs(o.pos.z)<ae.L+ae.GD,this.ballShadow.position.set(o.pos.x,.03,o.pos.z);let c=1+l*.05;this.ballShadow.scale.set(c,c,c),this.ballShadow.material.opacity=Math.max(.15,.85-l*.035),this.world&&this.world.updatePads(t,n.pads),this.effects.update(e?t:0);let h=this.viewports(),d=window.innerWidth,u=window.innerHeight;h.forEach((p,g)=>{let M=this.cameras[g],w=p.w*d/(p.h*u);M.aspect=w,M.fov=kp(this.mode==="match"?this.settings.fov:90,w),M.updateProjectionMatrix()}),this.updateCameras(t,a);let f=this.cameras[0];if(this.sound.setListener(f.position,gn.set(1,0,0).applyQuaternion(f.quaternion)),this.mode==="match"&&!this.paused&&n.state!=="replay"){this.locals.forEach((g,M)=>{let w=g.car;this.sound.updateEngine(M,w.vel.length(),w.controls.throttle,w.boosting,w.onGround,!w.demolished,this.locals.length)});let p=Math.abs(n.ball.pos.z);this.sound.setCrowd(.35+Math.max(0,1-(ae.L-p)/30)*.6)}else this.sound.silenceEngines(),this.sound.setCrowd(this.mode==="menu"?.15:.3);let m=this.renderer,v=m.getPixelRatio();if(h.length===1&&this.composer?(this.effects.setViewportHeight(u*v/(2*Math.tan(an.degToRad(this.cameras[0].fov)/2))),this.renderPass.camera=this.cameras[0],this.composer.render(t)):(m.setScissorTest(!0),h.forEach((p,g)=>{let M=p.x*d,w=(1-p.y-p.h)*u;m.setViewport(M,w,p.w*d,p.h*u),m.setScissor(M,w,p.w*d,p.h*u),this.effects.setViewportHeight(p.h*u*v/(2*Math.tan(an.degToRad(this.cameras[g].fov)/2))),m.render(this.scene,this.cameras[g])}),m.setScissorTest(!1),m.setViewport(0,0,d,u)),this.mode==="match"&&n){let p=this.locals.some((g,M)=>this.input.held("scoreboard",M,this.splitscreen));this.hud.update(t,n,this.locals,{ballCam:this.rigs.map(g=>g.ballCam),showFps:this.settings.showFps,fps:this.fps,scoreboard:p&&!this.paused}),this.endTimer>0&&(this.endTimer-=t,this.endTimer<=0&&(this.menus.stack=[],this.menus.show("end",!1),document.body.style.cursor=""))}}updateCameras(t,e){let n=this.match,i=this.settings,r={camDistance:i.camDistance,camHeight:i.camHeight,camStiffness:i.camStiffness};if(this.garage){this.garage.t+=t;let a=this.garage;a.view.update({pos:new E(0,Sn[i.body].hy+dt.rideHeight,0),quat:new re().setFromAxisAngle(new E(0,1,0),a.t*.5),boosting:Math.sin(a.t*.8)>.6,demolished:!1,steer:Math.sin(a.t*.7)*.6,spin:a.t*3,supersonic:!1},performance.now()/1e3);let o=.75+Math.sin(a.t*.2)*.25,l=3.4;gn.set(Math.cos(o)*l,1,Math.sin(o)*l),Sr.set(-Math.sin(o),0,Math.cos(o)).multiplyScalar(1.25),Sr.y=.3,this.rigs[0].setView(t,gn,Sr,3);return}if(n.state==="replay"){let a=e.ball.pos,l=(n.goalInfo?n.goalInfo.team:0)===0?ae.L:-ae.L,c=gn.set(a.x*.3,0,a.z-l);c.lengthSq()<1&&c.set(0,0,-Math.sign(l)),c.normalize();let h=new E().copy(a).addScaledVector(c,11);h.y=Math.max(a.y+3.5,4),Oc(h,1),this.rigs.forEach((d,u)=>{u<this.viewports().length&&d.setView(t,h,a,5)});return}if(this.mode==="menu"){if(this.attractTime+=t,Math.floor(this.attractTime/11)%3===1&&e.cars[0]){let h=e.cars[Math.floor(this.attractTime/33)%e.cars.length];if(!h.demolished){this.rigs[0].ballCam=!0,this.rigs[0].follow(t,h,e.ball.pos,{camDistance:3.2,camHeight:1.3,camStiffness:6});return}}let o=this.attractTime*.06,l=e.ball.pos,c=gn.set(Math.sin(o)*34,13+Math.sin(o*.7)*4,Math.cos(o)*44);Oc(c,1),this.rigs[0].setView(t,c,Sr.copy(l).multiplyScalar(.7),2);return}this.locals.forEach((a,o)=>{let l=e.cars[this.match.cars.indexOf(a.car)];if(l){if(l.demolished){this.rigs[o].setView(t,this.rigs[o].pos,e.ball.pos,2);return}this.rigs[o].follow(t,l,e.ball.hidden?null:e.ball.pos,r)}})}};function $p(){try{let s=document.createElement("canvas");if(!(s.getContext("webgl2")||s.getContext("webgl")))throw new Error("WebGL indisponible")}catch{let t=document.createElement("div");t.id="webgl-error",t.innerHTML="<div><h2>WebGL est d\xE9sactiv\xE9</h2><p>Active l'acc\xE9l\xE9ration mat\xE9rielle de ton navigateur (Chrome, Edge ou Firefox) puis recharge la page.</p></div>",document.body.appendChild(t);return}window.app=new Du}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",$p):$p();})();
/*! Bundled license information:

three/build/three.core.js:
three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2026 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
