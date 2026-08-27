(function(){
  var props = { accent:'#10AF8B', accentDeep:'#0A6E58', scrollLength:5.6, startZoom:22 };
  var E={}, last={}, vw, vh, span, wmW, wmH, pw, bwEnd, t, prev, settled;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function q(s){ return document.querySelector(s); }
  function grab(){
    E.inf=q('[data-el="inf"]'); E.line=q('[data-el="line"]'); E.payoff=q('[data-el="payoff"]');
    E.payoffBig=q('[data-el="payoffBig"]'); E.wm=q('[data-el="wm"]');
    E.cue=q('[data-el="cue"]'); E.track=q('[data-el="track"]'); E.stage=q('[data-el="stage"]'); last={};
  }
  function apply(){
    var r=document.documentElement.style;
    r.setProperty('--green', props.accent); r.setProperty('--green-deep', props.accentDeep);
    E.track.style.height = (props.scrollLength*100) + 'svh';
  }
  function measure(){
    vw = E.stage.offsetWidth || innerWidth;
    vh = E.stage.offsetHeight || innerHeight;
    span = Math.max(1, E.track.offsetHeight - vh);
    wmW = E.wm.offsetWidth || vw*0.8;
    wmH = E.wm.offsetHeight || wmW*0.287;
    pw = E.payoffBig.scrollWidth || 1;
    bwEnd = Math.max(230, 220.9*vw/(0.86*Math.min(vw,vh)));
  }
  function cl(v,a,b){ return v<a?a:v>b?b:v; }
  function seg(t,a,b){ return cl((t-a)/(b-a),0,1); }
  function ease(x){ return x<0.5 ? 4*x*x*x : 1-Math.pow(-2*x+2,3)/2; }
  function out(x){ return 1-Math.pow(1-x,3); }
  function mix(a,b,t){ return a+(b-a)*t; }
  function set(el,prop,val){ var k=el.dataset.el+prop; if(last[k]===val) return; last[k]=val; el.style[prop]=val; }

  function write(t){
    if(!vw) return;
    var z=ease(seg(t,0.03,0.70)), drift=ease(seg(t,0.56,1));
    var bwe=bwEnd||500, k=bwe/620;
    var bw=mix(bwe/props.startZoom,bwe,z), bh=bw*(vh/vw);
    var cx=mix(46,110.4,z)+drift*40*k, cy=mix(176,98,z)-drift*44*k;
    var vb=(cx-bw/2).toFixed(2)+' '+(cy-bh/2).toFixed(2)+' '+bw.toFixed(2)+' '+bh.toFixed(2);
    if(last.vb!==vb){ last.vb=vb; E.inf.setAttribute('viewBox',vb); }
    set(E.inf,'opacity',(1-seg(t,0.85,0.99)).toFixed(3));

    var wp=ease(seg(t,0.05,0.42)), endW=Math.min(150,vw*0.4);
    var s=mix(1,endW/wmW,wp);
    var x=mix((vw-wmW)/2, Math.max(18,vw*0.06), wp);
    var y=mix((vh-wmH)/2, Math.max(16,vh*0.03), wp);
    set(E.wm,'transform','translate3d('+x.toFixed(1)+'px,'+y.toFixed(1)+'px,0) scale('+s.toFixed(4)+')');
    set(E.cue,'opacity',(1-seg(t,0,0.05)).toFixed(3));

    set(E.line,'opacity',(seg(t,0.26,0.38)*(1-seg(t,0.48,0.58))).toFixed(3));
    set(E.line,'transform','translate3d(0,'+mix(22,-16,seg(t,0.22,0.60)).toFixed(1)+'px,0)');

    var pin=out(seg(t,0.52,0.66)), grow=ease(seg(t,0.66,1));
    var scale=mix(0.72,1,grow), rise=mix(18,-6,grow);
    set(E.payoff,'transform','translate3d(0,'+rise.toFixed(1)+'px,0) scale('+scale.toFixed(4)+')');
    set(E.payoff,'opacity',pin.toFixed(3));
  }

  function loop(){
    requestAnimationFrame(loop);
    var top=E.track.getBoundingClientRect().top;
    var target=cl(-top/span,0,1);
    var now=performance.now(), dt=prev?Math.min(64,now-prev):16; prev=now;
    if(t===undefined||reduce) t=target;
    else t=mix(t,target,1-Math.pow(0.0001,dt/1000));
    if(Math.abs(target-t)<0.00015) t=target;
    if(settled===t) return;
    settled=t; write(t);
  }

  function boot(){
    grab(); apply(); measure(); write(0);
    addEventListener('resize', function(){ measure(); write(t||0); }, {passive:true});
    addEventListener('orientationchange', function(){ measure(); write(t||0); });
    if(document.fonts&&document.fonts.ready) document.fonts.ready.then(function(){ measure(); write(t||0); });
    loop();
  }
  if(document.readyState==='loading') addEventListener('DOMContentLoaded',boot); else boot();
})();