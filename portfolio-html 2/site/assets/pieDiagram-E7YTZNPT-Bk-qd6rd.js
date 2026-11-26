import{p as nt}from"./chunk-JWPE2WC7-C6Y3izjT.js";import{Y as T,O as P,b8 as it,E as st,t as ot,u as lt,s as ct,g as ut,d as gt,c as dt,_ as d,l as B,v as pt,i as ht,G as ft,K as mt,a9 as vt,m as xt}from"./index-0cewY4fG.js";import{p as St}from"./cynefin-OW5HDTMX-Dvg9MvvM.js";import{d as Z}from"./arc-Qt_KXwO_.js";import{o as yt}from"./ordinal-Cboi1Yqb.js";import"./init-Gi6I4Gst.js";function wt(t,n){return n<t?-1:n>t?1:n>=t?0:NaN}function At(t){return t}function Ct(){var t=At,n=wt,y=null,b=T(0),l=T(P),p=T(0);function i(e){var r,o=(e=it(e)).length,h,w,$=0,f=new Array(o),s=new Array(o),D=+b.apply(this,arguments),z=Math.min(P,Math.max(-P,l.apply(this,arguments)-D)),k,L=Math.min(Math.abs(z)/o,p.apply(this,arguments)),u=L*(z<0?-1:1),A;for(r=0;r<o;++r)(A=s[f[r]=r]=+t(e[r],r,e))>0&&($+=A);for(n!=null?f.sort(function(M,m){return n(s[M],s[m])}):y!=null&&f.sort(function(M,m){return y(e[M],e[m])}),r=0,w=$?(z-o*u)/$:0;r<o;++r,D=k)h=f[r],A=s[h],k=D+(A>0?A*w:0)+u,s[h]={data:e[h],index:r,value:A,startAngle:D,endAngle:k,padAngle:L};return s}return i.value=function(e){return arguments.length?(t=typeof e=="function"?e:T(+e),i):t},i.sortValues=function(e){return arguments.length?(n=e,y=null,i):n},i.sort=function(e){return arguments.length?(y=e,n=null,i):y},i.startAngle=function(e){return arguments.length?(b=typeof e=="function"?e:T(+e),i):b},i.endAngle=function(e){return arguments.length?(l=typeof e=="function"?e:T(+e),i):l},i.padAngle=function(e){return arguments.length?(p=typeof e=="function"?e:T(+e),i):p},i}var q=st.pie,I={sections:new Map,showData:!1,config:q},_=I.sections,V=I.showData,$t=structuredClone(q),Dt=d(()=>structuredClone($t),"getConfig"),Tt=d(()=>{_=new Map,V=I.showData,pt()},"clear"),bt=d(({label:t,value:n})=>{if(n<0)throw new Error(`"${t}" has invalid value: ${n}. Negative values are not allowed in pie charts. All slice values must be >= 0.`);_.has(t)||(_.set(t,n),B.debug(`added new section: ${t}, with value: ${n}`))},"addSection"),kt=d(()=>_,"getSections"),Et=d(t=>{V=t},"setShowData"),zt=d(()=>V,"getShowData"),J={getConfig:Dt,clear:Tt,setDiagramTitle:ot,getDiagramTitle:lt,setAccTitle:ct,getAccTitle:ut,setAccDescription:gt,getAccDescription:dt,addSection:bt,getSections:kt,setShowData:Et,getShowData:zt},Mt=d((t,n)=>{nt(t,n),n.setShowData(t.showData),t.sections.map(n.addSection)},"populateDb"),Rt={parse:d(async t=>{const n=await St("pie",t);B.debug(n),Mt(n,J)},"parse")},Lt=d(t=>`
  .pieCircle{
    stroke: ${t.pieStrokeColor};
    stroke-width : ${t.pieStrokeWidth};
    opacity : ${t.pieOpacity};
  }
  .pieCircle.highlighted{
    scale: 1.05;
    opacity: 1;
  }
  .pieCircle.highlightedOnHover:hover{
    transition-duration: 250ms;
    scale: 1.05;
    opacity: 1;
  }
  .pieOuterCircle{
    stroke: ${t.pieOuterStrokeColor};
    stroke-width: ${t.pieOuterStrokeWidth};
    fill: none;
  }
  .pieTitleText {
    text-anchor: middle;
    font-size: ${t.pieTitleTextSize};
    fill: ${t.pieTitleTextColor};
    font-family: ${t.fontFamily};
  }
  .slice {
    font-family: ${t.fontFamily};
    fill: ${t.pieSectionTextColor};
    font-size:${t.pieSectionTextSize};
    // fill: white;
  }
  .legend text {
    fill: ${t.pieLegendTextColor};
    font-family: ${t.fontFamily};
    font-size: ${t.pieLegendTextSize};
  }
`,"getStyles"),Ot=Lt,Wt=d(t=>{const n=[...t.values()].reduce((l,p)=>l+p,0),y=[...t.entries()].map(([l,p])=>({label:l,value:p})).filter(l=>l.value/n*100>=1);return Ct().value(l=>l.value).sort(null)(y)},"createPieArcs"),_t=d((t,n,y,b)=>{var Y;B.debug(`rendering pie chart
`+t);const l=b.db,p=ht(),i=ft(l.getConfig(),p.pie),e=40,r=18,o=4,h=450,w=h,$=mt(n),f=$.append("g");f.attr("transform","translate("+w/2+","+h/2+")");const{themeVariables:s}=p;let[D]=vt(s.pieOuterStrokeWidth);D??(D=2);const z=i.legendPosition,k=i.textPosition,L=i.donutHole>0&&i.donutHole<=.9?i.donutHole:0,u=Math.min(w,h)/2-e,A=Z().innerRadius(L*u).outerRadius(u),M=Z().innerRadius(u*k).outerRadius(u*k),m=f.append("g");m.append("circle").attr("cx",0).attr("cy",0).attr("r",u+D/2).attr("class","pieOuterCircle");const O=l.getSections(),Q=Wt(O),tt=[s.pie1,s.pie2,s.pie3,s.pie4,s.pie5,s.pie6,s.pie7,s.pie8,s.pie9,s.pie10,s.pie11,s.pie12];let F=0;O.forEach(a=>{F+=a});const U=Q.filter(a=>(a.data.value/F*100).toFixed(0)!=="0"),G=yt(tt).domain([...O.keys()]);m.selectAll("mySlices").data(U).enter().append("path").attr("d",A).attr("fill",a=>G(a.data.label)).attr("class",a=>{let c="pieCircle";return i.highlightSlice==="hover"?c+=" highlightedOnHover":i.highlightSlice===a.data.label&&(c+=" highlighted"),c}),m.selectAll("mySlices").data(U).enter().append("text").text(a=>(a.data.value/F*100).toFixed(0)+"%").attr("transform",a=>"translate("+M.centroid(a)+")").style("text-anchor","middle").attr("class","slice");const et=f.append("text").text(l.getDiagramTitle()).attr("x",0).attr("y",-(h-50)/2).attr("class","pieTitleText"),R=[...O.entries()].map(([a,c])=>({label:a,value:c})),C=f.selectAll(".legend").data(R).enter().append("g").attr("class","legend");C.append("rect").attr("width",r).attr("height",r).style("fill",a=>G(a.label)).style("stroke",a=>G(a.label)),C.append("text").attr("x",r+o).attr("y",r-o).text(a=>l.getShowData()?`${a.label} [${a.value}]`:a.label);const E=Math.max(...C.selectAll("text").nodes().map(a=>(a==null?void 0:a.getBoundingClientRect().width)??0));let W=h,H=w+e;const g=r+o,N=R.length*g;switch(z){case"center":C.attr("transform",(a,c)=>{const v=g*R.length/2,x=-E/2-(r+o),S=c*g-v;return"translate("+x+","+S+")"});break;case"top":W+=N,C.attr("transform",(a,c)=>{const v=u,x=-E/2-(r+o),S=c*g-v;return`translate(${x}, ${S})`}),m.attr("transform",()=>`translate(0, ${N+g})`);break;case"bottom":W+=N,C.attr("transform",(a,c)=>{const v=-u-g,x=-E/2-(r+o),S=c*g-v;return"translate("+x+","+S+")"});break;case"left":H+=r+o+E,C.attr("transform",(a,c)=>{const v=g*R.length/2,x=-u-(r+o),S=c*g-v;return"translate("+x+","+S+")"}),m.attr("transform",()=>`translate(${E+r+o}, 0)`);break;case"right":default:H+=r+o+E,C.attr("transform",(a,c)=>{const v=g*R.length/2,x=12*r,S=c*g-v;return"translate("+x+","+S+")"});break}const j=((Y=et.node())==null?void 0:Y.getBoundingClientRect().width)??0,at=w/2-j/2,rt=w/2+j/2,K=Math.min(0,at),X=Math.max(H,rt)-K;$.attr("viewBox",`${K} 0 ${X} ${W}`),xt($,W,X,i.useMaxWidth)},"draw"),Ft={draw:_t},Ut={parser:Rt,db:J,renderer:Ft,styles:Ot};export{Ut as diagram};
