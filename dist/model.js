export const defaults = { version:1, room:{width:3.5,depth:15/3.5,height:3.2,lockArea:true,doorWidth:.85,doorOffset:.18,windowWidth:.95,sill:.95,windowHeight:1.8,sinkWidth:1.8,sinkDepth:.6,sinkHeight:.9}, items:[] };
export const catalogue = {
 table:{label:'Table',w:100,d:60,h:75,color:'#bd8651',icon:'▱'},
 desk:{label:'Desk',w:140,d:70,h:75,color:'#ba8756',icon:'▤'},
 bookcase:{label:'Bookcase',w:80,d:30,h:180,color:'#c69d6d',icon:'▥'},
 chair:{label:'Chair',w:55,d:55,h:85,color:'#546e78',icon:'♧'},
 sofa:{label:'Sofa',w:160,d:85,h:80,color:'#8f9f96',icon:'▰'},
 cabinet:{label:'Cabinet',w:80,d:40,h:90,color:'#dfd8c9',icon:'▦'},
 rug:{label:'Rug',w:160,d:230,h:1,color:'#bd986a',icon:'▧'},
 plant:{label:'Plant',w:40,d:40,h:120,color:'#456a52',icon:'♧'}
};
export function copy(v){return structuredClone(v)}
export function validateState(v){
 if(!v||v.version!==1||!v.room||!Array.isArray(v.items)||v.items.length>100) throw Error('This is not a supported room layout.');
 const r=v.room; const out=copy(defaults);
 for(const [key,min,max] of [['width',2,10],['depth',2,10],['height',2,5],['doorWidth',.5,1.5],['doorOffset',0,8],['windowWidth',.4,1.8],['sill',.6,1.6],['windowHeight',.5,2.5],['sinkWidth',.6,2.5],['sinkDepth',.3,1],['sinkHeight',.5,1.2]]){
 const n=Number(r[key]); if(!Number.isFinite(n)||n<min||n>max) throw Error('A room measurement is outside the supported range.');out.room[key]=n;
 }
 out.room.lockArea=r.lockArea!==false;
 if(out.room.lockArea&&Math.abs(r.width*r.depth-15)>.02) throw Error('The locked floor area must be 15 m².');
 if(out.room.doorOffset+out.room.doorWidth>out.room.width-.05||out.room.sill+out.room.windowHeight>out.room.height-.1||out.room.sinkWidth>out.room.width-.1||out.room.windowWidth>out.room.width*.44-.08) throw Error('An opening or fixture does not fit the room.');
 const ids=new Set();
 out.items=v.items.map(a=>{
 if(!a||!catalogue[a.type]||typeof a.id!=='string'||a.id.length>80||ids.has(a.id)) throw Error('Invalid furniture item.');ids.add(a.id);
 const b={id:a.id,type:a.type,label:typeof a.label==='string'?a.label.slice(0,60):catalogue[a.type].label,color:/^#[0-9a-f]{6}$/i.test(a.color)?a.color:catalogue[a.type].color};
 for(const [k,min,max] of [['w',10,500],['d',10,500],['h',1,350],['x',-10,20],['z',-10,20],['rotation',-3600,3600]]){const n=Number(a[k]);if(!Number.isFinite(n)||n<min||n>max)throw Error('A furniture measurement is outside the supported range.');b[k]=n;}
 return b;
 });return out;
}
export function corners(a){const t=a.rotation*Math.PI/180,c=Math.cos(t),s=Math.sin(t);return [[-1,-1],[1,-1],[1,1],[-1,1]].map(([x,z])=>({x:a.x+x*a.w/200*c+z*a.d/200*s,z:a.z-x*a.w/200*s+z*a.d/200*c}));}
export function overlaps(a,b){const aa=corners(a),bb=corners(b);for(const points of [aa,bb])for(let i=0;i<4;i++){const p=points[i],q=points[(i+1)%4],axis={x:-(q.z-p.z),z:q.x-p.x};const va=aa.map(v=>v.x*axis.x+v.z*axis.z),vb=bb.map(v=>v.x*axis.x+v.z*axis.z);if(Math.max(...va)<=Math.min(...vb)+.0001||Math.max(...vb)<=Math.min(...va)+.0001)return false;}return true;}
export function warnings(state){const out=[],r=state.room;const sink={x:r.width-r.sinkWidth/2-.08,z:r.depth-r.sinkDepth/2,w:r.sinkWidth*100,d:r.sinkDepth*100,rotation:0};const door={x:r.width-r.doorOffset-r.doorWidth/2,z:r.doorWidth/2,w:r.doorWidth*100,d:r.doorWidth*100,rotation:0};
 for(const a of state.items){if(corners(a).some(p=>p.x<-.002||p.z<-.002||p.x>r.width+.002||p.z>r.depth+.002))out.push(`${a.label} extends beyond a wall.`);if(a.h/100>r.height)out.push(`${a.label} is taller than the ceiling.`);if(a.type!=='rug'&&overlaps(a,sink))out.push(`${a.label} overlaps the sink cabinet.`);if(a.type!=='rug'&&overlaps(a,door))out.push(`${a.label} enters the estimated door clearance.`);}
 for(let i=0;i<state.items.length;i++)for(let j=i+1;j<state.items.length;j++){const a=state.items[i],b=state.items[j];if(a.type!=='rug'&&b.type!=='rug'&&overlaps(a,b))out.push(`${a.label} and ${b.label} overlap.`);}
 return out;
}
export function makeItem(type,r){const p=catalogue[type];if(!p)throw Error('Unknown furniture type.');return {id:crypto.randomUUID(),type,label:p.label,w:p.w,d:p.d,h:p.h,color:p.color,x:r.width/2,z:r.depth/2,rotation:0};}
