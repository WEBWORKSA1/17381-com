/* 17381 Numbers Lab — site script (vanilla, no dependencies) */
(function(){
'use strict';
var $=function(s,c){return (c||document).querySelector(s)};
var $$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
function store(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}}
function sstore(k,v){try{if(v===undefined)return sessionStorage.getItem(k);sessionStorage.setItem(k,v)}catch(e){return null}}

/* ---------- Private inbox: assembled at runtime, never written in page source ---------- */
var _q=[122,120,116,57,123,126,118,122,112,87,38,118,100,124,101,120,96,117,114,96];
function inbox(){return _q.map(function(c){return String.fromCharCode(c^23)}).reverse().join('')}
function endpoint(){return 'https://formsubmit.co/ajax/'+inbox()}
$$('[data-mail]').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();location.href='mailto:'+inbox()+'?subject='+encodeURIComponent(a.getAttribute('data-mail')||'Inquiry from 17381.com')})});

/* ---------- Theme ---------- */
var root=document.documentElement,saved=store('nl-theme');if(saved)root.setAttribute('data-theme',saved);
var tb=$('#themeBtn');if(tb)tb.addEventListener('click',function(){var t=root.getAttribute('data-theme')==='light'?'dark':'light';root.setAttribute('data-theme',t);store('nl-theme',t)});

/* ---------- Nav ---------- */
var nb=$('#navBtn'),menu=$('#menu');if(nb)nb.addEventListener('click',function(){menu.classList.toggle('open');nb.setAttribute('aria-expanded',menu.classList.contains('open'))});
var here=location.pathname.replace(/index\.html$/,'');
$$('#menu a').forEach(function(a){var h=a.getAttribute('href').replace(/index\.html$/,'');if(h!=='/'&&here.indexOf(h.replace('.html',''))===0)a.classList.add('on')});

/* ---------- Cookie notice ---------- */
var ck=$('#cookie');if(ck&&!store('nl-cookie')){ck.classList.add('show');$('#cookieOk').addEventListener('click',function(){store('nl-cookie','1');ck.classList.remove('show')})}

/* ---------- Sticky CTA / back to top ---------- */
var sc=$('.sticky-cta'),tt=$('#toTop');
window.addEventListener('scroll',function(){var y=window.scrollY;if(sc&&!sstore('nl-lead'))sc.classList.toggle('show',y>700);if(tt)tt.style.display=y>900?'block':'none'},{passive:true});
if(tt)tt.addEventListener('click',function(){window.scrollTo({top:0})});

/* ---------- Click-to-load YouTube (privacy-enhanced) ---------- */
$$('.vid').forEach(function(v){
  var id=v.getAttribute('data-id');
  v.innerHTML='<img loading="lazy" src="https://i.ytimg.com/vi/'+id+'/hqdefault.jpg" alt="'+(v.getAttribute('data-title')||'Video')+'"><button aria-label="Play video">&#9654;</button>';
  v.addEventListener('click',function(){v.innerHTML='<iframe src="https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&rel=0" title="'+(v.getAttribute('data-title')||'Video')+'" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'},{once:true});
});

/* ---------- Copy buttons ---------- */
document.addEventListener('click',function(e){var b=e.target.closest('[data-copy]');if(!b)return;var t=b.getAttribute('data-copy');if(t==='#url')t=location.href;try{navigator.clipboard.writeText(t);var o=b.textContent;b.textContent='Copied';setTimeout(function(){b.textContent=o},1200)}catch(x){}});

/* ---------- Forms (AJAX to private inbox) ---------- */
$$('form.js-form').forEach(function(f){
  f.addEventListener('submit',function(e){
    e.preventDefault();
    var msg=$('.form-msg',f);
    if(f._honey&&f._honey.value)return;
    if(!f.checkValidity()){f.reportValidity();return}
    var rf=$('[name=result]',f),rs=$('[data-results]');if(rf&&rs)rf.value=rs.innerText.replace(/\n+/g,' | ');
    var btn=$('button[type=submit]',f),old=btn?btn.textContent:'';if(btn){btn.disabled=true;btn.textContent='Sending…'}
    var data={};new FormData(f).forEach(function(v,k){if(k!=='_honey')data[k]=data[k]?data[k]+', '+v:v});
    data._subject=(f.getAttribute('data-subject')||'17381.com form')+' — '+(data.name||data.email||'');
    data._template='table';data._captcha='false';data.page=location.href;
    fetch(endpoint(),{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(data)})
      .then(function(r){return r.json().catch(function(){return {}})})
      .then(function(){if(msg){msg.className='form-msg ok';msg.textContent=f.getAttribute('data-ok')||'Received — we reply within 1 business day.'}f.reset();resetSteps(f);sstore('nl-lead','1');if(sc)sc.classList.remove('show')})
      .catch(function(){if(msg){msg.className='form-msg err';msg.textContent='Network hiccup — please try again in a minute.'}})
      .then(function(){if(btn){btn.disabled=false;btn.textContent=old}});
  });
});
function resetSteps(f){var st=$$('.step',f);if(!st.length)return;st.forEach(function(s,i){s.classList.toggle('active',i===0)});$$('.steps-ind span',f).forEach(function(s,i){s.classList.toggle('on',i===0)})}
$$('form.multistep').forEach(function(f){
  var steps=$$('.step',f),ind=$$('.steps-ind span',f),i=0;
  function go(n){
    if(n>i){var bad=$$('input,select,textarea',steps[i]).filter(function(x){return !x.checkValidity()});if(bad.length){bad[0].reportValidity();return}}
    i=Math.max(0,Math.min(steps.length-1,n));
    steps.forEach(function(s,k){s.classList.toggle('active',k===i)});ind.forEach(function(s,k){s.classList.toggle('on',k<=i)});
  }
  $$('[data-next]',f).forEach(function(b){b.addEventListener('click',function(){go(i+1)})});
  $$('[data-prev]',f).forEach(function(b){b.addEventListener('click',function(){go(i-1)})});
});
/* preselect form fields from URL (?topic=, ?tier=, ?role=) */
var qs=new URLSearchParams(location.search);
['topic','tier','role','package'].forEach(function(k){var v=qs.get(k),el=$('[name='+k+']');if(v&&el){$$('option',el).forEach(function(o){if(o.value===v||o.textContent===v)el.value=o.value})}});

/* ---------- Tool search filter ---------- */
var ts=$('#toolSearch');
if(ts){var cards=$$('[data-tool-card]'),chips=$$('[data-cat]');
  function filt(){var q=ts.value.toLowerCase().trim(),cat=($('[data-cat].on')||{}).getAttribute?$('[data-cat].on').getAttribute('data-cat'):'all';
    cards.forEach(function(c){var ok=(c.textContent.toLowerCase().indexOf(q)>-1)&&(cat==='all'||c.getAttribute('data-tool-card')===cat);c.classList.toggle('hide',!ok)})}
  ts.addEventListener('input',filt);
  chips.forEach(function(ch){ch.addEventListener('click',function(){chips.forEach(function(x){x.classList.remove('on')});ch.classList.add('on');filt()})});
}

/* =================== NUMBER HELPERS =================== */
var ONES=['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
var TENS=['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
function w99(n){return n<20?ONES[n]:TENS[Math.floor(n/10)]+(n%10?'-'+ONES[n%10]:'')}
function w999(n){var h=Math.floor(n/100),r=n%100,s='';if(h)s=ONES[h]+' hundred';if(r)s+=(s?' and ':'')+w99(r);return s||'zero'}
function wordsIntl(n){n=Math.floor(Math.abs(n));if(n===0)return 'zero';var sc=['','thousand','million','billion','trillion','quadrillion'],out=[],i=0;
  while(n>0){var c=n%1000;if(c)out.unshift(w999(c)+(sc[i]?' '+sc[i]:''));n=Math.floor(n/1000);i++}return out.join(' ')}
function wordsIndian(n){n=Math.floor(Math.abs(n));if(n===0)return 'zero';var parts=[],cr=Math.floor(n/1e7);n%=1e7;
  if(cr)parts.push((cr>=1000?wordsIndian(cr):w999(cr))+' crore');var l=Math.floor(n/1e5);n%=1e5;if(l)parts.push(w99(l)+' lakh');
  var t=Math.floor(n/1000);n%=1000;if(t)parts.push(w99(t)+' thousand');if(n)parts.push(w999(n));return parts.join(' ')}
function cap(s){return s.charAt(0).toUpperCase()+s.slice(1)}
function isPrime(n){if(n<2)return false;if(n%2===0)return n===2;if(n%3===0)return n===3;for(var i=5;i*i<=n;i+=6){if(n%i===0||n%(i+2)===0)return false}return true}
function factor(n){var f=[],d=2;while(n%2===0){f.push(2);n/=2}d=3;while(d*d<=n){while(n%d===0){f.push(d);n/=d}d+=2}if(n>1)f.push(n);return f}
function divisors(n){var a=[],b=[];for(var i=1;i*i<=n;i++){if(n%i===0){a.push(i);if(i!==n/i)b.unshift(n/i)}}return a.concat(b)}
function roman(n){if(n<1||n>3999)return '—';var v=[1000,900,500,400,100,90,50,40,10,9,5,4,1],s=['M','CM','D','CD','C','XC','L','XL','X','IX','V','IV','I'],r='';v.forEach(function(x,i){while(n>=x){r+=s[i];n-=x}});return r}
function fmt(x,d){if(!isFinite(x))return '—';return x.toLocaleString('en-US',{maximumFractionDigits:d===undefined?2:d,minimumFractionDigits:d===undefined?0:Math.min(d,2)})}
function money(x){if(!isFinite(x))return '—';var neg=x<0;return (neg?'−':'')+'$'+Math.abs(x).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})}
function pct(x,d){return isFinite(x)?fmt(x,d===undefined?2:d)+'%':'—'}
function sup(f){var m={};f.forEach(function(p){m[p]=(m[p]||0)+1});return Object.keys(m).map(function(p){return m[p]>1?p+'<sup>'+m[p]+'</sup>':p}).join(' × ')}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}

/* =================== NUMBER ANALYZER =================== */
var MAXN=999999999999;
function analyze(n){
  var f=factor(n),dv=divisors(n),s=dv.reduce(function(a,b){return a+b},0),p=isPrime(n),uniq=f.filter(function(x,i){return f.indexOf(x)===i});
  var str=String(n),rev=Number(str.split('').reverse().join('')),ds=str.split('').reduce(function(a,b){return a+ +b},0);
  var pp=n-1;while(pp>1&&!isPrime(pp))pp--;var np=n+1;while(!isPrime(np))np++;
  var c=n,steps=0;while(c!==1&&steps<10000){c=c%2?3*c+1:c/2;steps++}
  var cls=[];if(p)cls.push('Prime');else if(n>1)cls.push('Composite');if(!p&&f.length===2)cls.push('Semiprime');if(f.length===3&&uniq.length===3)cls.push('Sphenic (3 distinct primes)');
  if(s-n===n)cls.push('Perfect');else if(s-n>n)cls.push('Abundant');else cls.push('Deficient');if(str===str.split('').reverse().join(''))cls.push('Palindrome');
  if(Math.round(Math.sqrt(n))**2===n)cls.push('Perfect square');if(Math.round(Math.cbrt(n))**3===n)cls.push('Perfect cube');if(n%ds===0)cls.push('Harshad');
  var fib=function(x){var t=5*x*x;return Math.round(Math.sqrt(t+4))**2===t+4||Math.round(Math.sqrt(t-4))**2===t-4};if(n<1e7&&fib(n))cls.push('Fibonacci');
  var dt=null;if(str.length===5||str.length===6){var dd=+str.slice(0,2),mm=+str.slice(2,str.length===5?3:4),yy=+str.slice(str.length===5?3:4);if(dd>=1&&dd<=31&&mm>=1&&mm<=12)dt=dd+' '+['January','February','March','April','May','June','July','August','September','October','November','December'][mm-1]+' '+(yy<30?2000+yy:1900+yy)}
  var unix=new Date(Date.UTC(1970,0,1)+n*864e5),excel=new Date(Date.UTC(1899,11,30)+n*864e5);
  return {n:n,p:p,f:f,uniq:uniq,dv:dv,s:s,cls:cls,rev:rev,revp:isPrime(rev),ds:ds,dr:1+((n-1)%9),pp:pp,np:np,steps:steps,dt:dt,
    unix:n<=2932896?unix.toISOString().slice(0,10):'—',excel:n<=2958465?excel.toISOString().slice(0,10):'—'};
}
var an=$('#analyzer');
if(an){
  var inp=$('#nInput',an),out=$('#nOut');
  function run(n,push){
    n=Math.floor(Number(String(n).replace(/[^0-9]/g,'')));
    if(!n||n<1||n>MAXN){out.innerHTML='<div class="card">Enter a whole number between 1 and '+fmt(MAXN)+'.</div>';return}
    inp.value=n;var a=analyze(n);document.title=n+' — prime factors, properties & meaning | 17381 Numbers Lab';
    var h1=$('#nTitle');if(h1)h1.textContent='The number '+fmt(n);
    if(push)history.replaceState(null,'','?n='+n);
    var row=function(k,v,copy){return '<tr><th>'+k+'</th><td class="mono">'+v+(copy?' <button class="copy" data-copy="'+esc(copy)+'">copy</button>':'')+'</td></tr>'};
    var html='<div class="grid g4" style="margin-bottom:22px">'+
      '<div class="res hi"><span>Prime?</span><b>'+(a.p?'Yes':'No')+'</b></div>'+
      '<div class="res"><span>Prime factorisation</span><b>'+(a.p?n:sup(a.f))+'</b></div>'+
      '<div class="res"><span>Divisors</span><b>'+a.dv.length+'</b></div>'+
      '<div class="res"><span>Digital root</span><b>'+a.dr+'</b></div></div>'+
      '<p>'+a.cls.map(function(c){return '<span class="pill yes" style="margin:0 6px 6px 0">'+c+'</span>'}).join('')+'</p>'+
      '<div class="grid g2"><div class="card"><h3>Number theory</h3><table>'+
      row('Divisors',a.dv.length<=64?a.dv.map(function(x){return fmt(x)}).join(', '):a.dv.slice(0,64).map(function(x){return fmt(x)}).join(', ')+' …')+
      row('Sum of divisors',fmt(a.s))+row('Sum of proper divisors',fmt(a.s-n))+
      row('Previous prime',fmt(a.pp))+row('Next prime',fmt(a.np))+
      row('Digit sum',a.ds)+row('Reversed',fmt(a.rev)+(a.revp?' (prime)':''))+
      row('Collatz steps to 1',a.steps)+row('Square',n<=94906265?fmt(n*n):'—')+row('Square root',fmt(Math.sqrt(n),6))+row('Cube root',fmt(Math.cbrt(n),6))+
      row('log₁₀ / ln',fmt(Math.log10(n),6)+' / '+fmt(Math.log(n),6))+'</table></div>'+
      '<div class="card"><h3>Representations</h3><table>'+
      row('Binary',n.toString(2),n.toString(2))+row('Octal',n.toString(8))+row('Hexadecimal',n.toString(16).toUpperCase(),n.toString(16).toUpperCase())+row('Base 36',n.toString(36).toUpperCase())+
      row('Roman numeral',roman(n))+row('Words (international)',cap(wordsIntl(n)))+row('Words (Indian system)',cap(wordsIndian(n)))+
      row('Scientific',n.toExponential(4))+row('Formatted',n.toLocaleString('en-US')+' / '+n.toLocaleString('en-IN'))+'</table></div>'+
      '<div class="card"><h3>As a date</h3><table>'+row('Read as DD/MM/YY',a.dt||'—')+row('Unix day #'+fmt(n),a.unix)+row('Excel serial date',a.excel)+'</table><p class="small" style="margin-top:10px">Dates are mechanical readings of the digits, useful for spotting typos in spreadsheets and imports.</p></div>'+
      '<div class="card"><h3>For developers</h3><table>'+row('JavaScript','const n = '+n+';')+row('Python','n = '+n)+row('SQL','DECLARE @n INT = '+n+';')+row('SHA-256','<span id="sha">computing…</span>')+'</table></div></div>'+
      '<p style="margin-top:18px"><a class="btn btn-ghost btn-sm" href="?n='+(n>1?n-1:1)+'">← '+fmt(n>1?n-1:1)+'</a> <a class="btn btn-ghost btn-sm" href="?n='+(n+1)+'">'+fmt(n+1)+' →</a> <button class="btn btn-ghost btn-sm" id="rnd">Random number</button> <button class="btn btn-ghost btn-sm" data-copy="#url">Copy link</button></p>';
    out.innerHTML=html;
    var r=$('#rnd');if(r)r.addEventListener('click',function(){run(Math.floor(Math.random()*999999)+1,true)});
    if(window.crypto&&crypto.subtle){crypto.subtle.digest('SHA-256',new TextEncoder().encode(String(n))).then(function(b){var hx=Array.prototype.map.call(new Uint8Array(b),function(x){return ('0'+x.toString(16)).slice(-2)}).join('');var e=$('#sha');if(e)e.innerHTML='<span style="word-break:break-all">'+hx+'</span>'})}
  }
  an.addEventListener('submit',function(e){e.preventDefault();run(inp.value,true)});
  $$('[data-n]').forEach(function(c){c.addEventListener('click',function(e){e.preventDefault();run(c.getAttribute('data-n'),true);window.scrollTo({top:an.getBoundingClientRect().top+scrollY-90})})});
  run(qs.get('n')||inp.value||17381,false);
}
/* homepage mini analyzer */
var ha=$('#homeAn');
if(ha){var hi=$('input',ha),ho=$('#homeOut');
  function mini(){var n=Math.floor(Number(String(hi.value).replace(/[^0-9]/g,'')));if(!n||n>MAXN){ho.innerHTML='';return}var a=analyze(n);
    ho.innerHTML='<div><span>Prime?</span><b>'+(a.p?'Yes':'No')+'</b></div><div><span>Factors</span><b>'+(a.p?n:sup(a.f))+'</b></div><div><span>Hex</span><b>'+n.toString(16).toUpperCase()+'</b></div><div><span>In words</span><b style="font-size:.82rem">'+cap(wordsIntl(n))+'</b></div>'}
  hi.addEventListener('input',mini);mini();
  ha.addEventListener('submit',function(e){e.preventDefault();location.href='/number.html?n='+encodeURIComponent(hi.value.replace(/[^0-9]/g,''))});
}

/* =================== CALCULATORS =================== */
function yearsTable(head,rows){return '<div class="tbl"><table><thead><tr>'+head.map(function(h,i){return '<th'+(i?' class="num"':'')+'>'+h+'</th>'}).join('')+'</tr></thead><tbody>'+rows.map(function(r){return '<tr>'+r.map(function(c,i){return '<td'+(i?' class="num"':'')+'>'+c+'</td>'}).join('')+'</tr>'}).join('')+'</tbody></table></div>'}
var CALC={
  margin:function(v){var p=v.price-v.cost,m=p/v.price*100,mk=p/v.cost*100,tp=v.cost/(1-v.target/100);
    return {rows:[['Gross profit per unit',money(p),1],['Gross margin',pct(m)],['Markup',pct(mk)],['Price for a '+v.target+'% margin',money(tp)]],
      work:'Profit = price − cost = '+money(v.price)+' − '+money(v.cost)+' = '+money(p)+'\nMargin = profit ÷ price = '+pct(m)+'\nMarkup = profit ÷ cost = '+pct(mk)+'\nTarget price = cost ÷ (1 − target margin) = '+money(v.cost)+' ÷ '+fmt(1-v.target/100,4)+' = '+money(tp)}},
  breakeven:function(v){var cm=v.price-v.vcost,r=cm/v.price,u=v.fixed/cm,rev=u*v.price,tu=(v.fixed+v.profit)/cm;
    if(cm<=0)return {rows:[['Contribution margin',money(cm),1]],work:'Price must be higher than variable cost per unit — every sale currently loses money.'};
    return {rows:[['Break-even units / month',fmt(Math.ceil(u),0),1],['Break-even revenue / month',money(rev)],['Contribution margin per unit',money(cm)+' ('+pct(r*100)+')'],['Units for '+money(v.profit)+' profit',fmt(Math.ceil(tu),0)]],
      work:'Contribution margin = '+money(v.price)+' − '+money(v.vcost)+' = '+money(cm)+'\nBreak-even units = fixed costs ÷ CM = '+money(v.fixed)+' ÷ '+money(cm)+' = '+fmt(u,2)+' → round up to '+Math.ceil(u)+'\nTarget units = (fixed + target profit) ÷ CM = '+fmt(tu,2)}},
  roi:function(v){var g=v.ret-v.inv,r=g/v.inv*100,a=(Math.pow(v.ret/v.inv,1/v.years)-1)*100;
    return {rows:[['Net gain',money(g),1],['Total ROI',pct(r)],['Annualised ROI',pct(a)],['Multiple on money',fmt(v.ret/v.inv,2)+'×']],
      work:'ROI = (return − investment) ÷ investment = '+money(g)+' ÷ '+money(v.inv)+' = '+pct(r)+'\nAnnualised = (return ÷ investment)^(1/years) − 1 = ('+fmt(v.ret/v.inv,4)+')^(1/'+v.years+') − 1 = '+pct(a)}},
  cagr:function(v){var c=Math.pow(v.end/v.start,1/v.years)-1,t=(v.end/v.start-1)*100,dbl=Math.log(2)/Math.log(1+c);
    return {rows:[['CAGR',pct(c*100),1],['Total growth',pct(t)],['Doubling time at this rate',fmt(dbl,1)+' years'],['Simple average (misleading)',pct(t/v.years)]],
      work:'CAGR = (end ÷ start)^(1/years) − 1 = ('+fmt(v.end)+' ÷ '+fmt(v.start)+')^(1/'+v.years+') − 1 = '+pct(c*100,3)+'\nRule of 72 check: 72 ÷ '+fmt(c*100,2)+' ≈ '+fmt(72/(c*100),1)+' years to double'}},
  compound:function(v){var n=v.freq,r=v.rate/100,bal=v.principal,rows=[],contrib=v.principal;
    for(var y=1;y<=v.years;y++){for(var m=0;m<12;m++){bal+=v.monthly;contrib+=v.monthly;}bal=bal*Math.pow(1+r/n,n);rows.push([y,money(contrib),money(bal-contrib),money(bal)])}
    return {rows:[['Future value',money(bal),1],['Total contributed',money(contrib)],['Growth earned',money(bal-contrib)],['Growth share of final balance',pct((bal-contrib)/bal*100,1)]],
      work:'Each year: add 12 × '+money(v.monthly)+' then grow by (1 + '+v.rate+'% ÷ '+n+')^'+n+'\n(Simplified: contributions earn interest from the end of the year they are added.)',
      table:yearsTable(['Year','Contributed','Growth','Balance'],rows)}},
  loan:function(v){var r=v.rate/100/12,n=v.years*12,pmt=r?v.amount*r/(1-Math.pow(1+r,-n)):v.amount/n,bal=v.amount,rows=[],yi=0,yp=0;
    for(var k=1;k<=n;k++){var i=bal*r,p=pmt-i;bal-=p;yi+=i;yp+=p;if(k%12===0||k===n){rows.push([Math.ceil(k/12),money(yp),money(yi),money(Math.max(bal,0))]);yi=0;yp=0}}
    return {rows:[['Monthly payment',money(pmt),1],['Total interest',money(pmt*n-v.amount)],['Total paid',money(pmt*n)],['Interest as % of loan',pct((pmt*n-v.amount)/v.amount*100,1)]],
      work:'Payment = P × r ÷ (1 − (1 + r)^−n)\nP = '+money(v.amount)+', r = '+v.rate+'% ÷ 12 = '+fmt(r*100,4)+'%, n = '+n+' months',
      table:yearsTable(['Year','Principal paid','Interest paid','Balance'],rows)}},
  runway:function(v){var cash=v.cash,rev=v.revenue,m=0,g=v.growth/100,pos=null;
    while(cash>0&&m<120){if(pos===null&&rev>=v.expenses)pos=m;cash+=rev-v.expenses;rev*=1+g;m++}
    var burn=v.expenses-v.revenue,end=new Date();end.setMonth(end.getMonth()+m);
    var txt=m>=120?'10+ years (profitable or near it)':m+' months';
    return {rows:[['Runway',txt,1],['Current net burn / month',money(burn)],['Cash runs out around',m>=120?'Not within 10 years':end.toLocaleDateString('en-US',{month:'long',year:'numeric'})],['Runway with zero growth',burn>0?fmt(v.cash/burn,1)+' months':'Cash-flow positive'],['Cash-flow positive',pos===null?(m>=120?'After 10+ years':'Not before cash runs out'):(pos===0?'Already':'In month '+pos)]],
      work:'Month by month: cash += revenue − expenses, revenue grows '+v.growth+'% per month.\nNet burn today = '+money(v.expenses)+' − '+money(v.revenue)+' = '+money(burn)}},
  unit:function(v){var gm=v.arpa*v.gm/100,life=1/(v.churn/100),ltv=gm*life,ratio=ltv/v.cac,pay=v.cac/gm;
    return {rows:[['Customer lifetime value (LTV)',money(ltv),1],['LTV : CAC',fmt(ratio,2)+' : 1'],['CAC payback',fmt(pay,1)+' months'],['Average customer lifetime',fmt(life,1)+' months']],
      work:'Gross profit / month = '+money(v.arpa)+' × '+v.gm+'% = '+money(gm)+'\nLifetime = 1 ÷ churn = 1 ÷ '+v.churn+'% = '+fmt(life,1)+' months\nLTV = '+money(gm)+' × '+fmt(life,1)+' = '+money(ltv)+'\nBenchmark: LTV:CAC ≥ 3 and payback ≤ 12 months is widely treated as healthy.'}},
  aicost:function(v){var per=(v.inTok*v.inPrice+v.outTok*v.outPrice)/1e6,day=per*v.reqs;
    return {rows:[['Cost per request','$'+per.toFixed(5)+' ('+fmt(per*100,3)+'¢)',1],['Cost per 1,000 requests',money(per*1000)],['Cost per day',money(day)],['Cost per month (30 days)',money(day*30)],['Cost per year',money(day*365)]],
      work:'Per request = (input tokens × input price + output tokens × output price) ÷ 1,000,000\n= ('+fmt(v.inTok)+' × $'+v.inPrice+' + '+fmt(v.outTok)+' × $'+v.outPrice+') ÷ 1,000,000 = $'+fmt(per,6)+'\nAlways confirm current per-token rates on your provider\'s pricing page.'}},
  airoi:function(v){var hrs=v.tasks*v.minutes/60,val=hrs*v.rate,net=val-v.tool,roi=net/(v.tool||1)*100,pay=net>0?v.setup/net:Infinity;
    return {rows:[['Hours saved / month',fmt(hrs,1),1],['Value of time saved / month',money(val)],['Net monthly benefit',money(net)],['Setup payback',isFinite(pay)?fmt(pay,1)+' months':'Never at these numbers'],['Annual net benefit',money(net*12-v.setup)]],
      work:'Hours = '+fmt(v.tasks)+' tasks × '+v.minutes+' min ÷ 60 = '+fmt(hrs,1)+'\nValue = hours × '+money(v.rate)+'/h = '+money(val)+'\nNet = value − tool cost = '+money(net)+'  (ROI on tool spend '+pct(roi,0)+')'}},
  percent:function(v){var a=v.p1/100*v.y1,b=v.x2/v.y2*100,c=(v.to-v.from)/Math.abs(v.from)*100;
    return {rows:[[v.p1+'% of '+fmt(v.y1),fmt(a,4),1],[fmt(v.x2)+' is what % of '+fmt(v.y2),pct(b,4)],['Change from '+fmt(v.from)+' to '+fmt(v.to),(c>0?'+':'')+pct(c,4)]],
      work:'A: '+v.p1+' ÷ 100 × '+v.y1+' = '+fmt(a,4)+'\nB: '+v.x2+' ÷ '+v.y2+' × 100 = '+fmt(b,4)+'%\nC: ('+v.to+' − '+v.from+') ÷ |'+v.from+'| × 100 = '+fmt(c,4)+'%'}},
  words:function(v){var n=Math.abs(v.amount),whole=Math.floor(n),cents=Math.round((n-whole)*100),cur=v.currency||'dollars';
    var sub={dollars:'cents',rupees:'paise',euros:'cents',pounds:'pence',dirhams:'fils'}[cur]||'cents';
    var chq=cap(wordsIntl(whole))+' '+cur+(cents?' and '+w99(cents)+' '+sub:'')+' only';
    return {rows:[['International words',cap(wordsIntl(whole)),1],['Indian system (lakh/crore)',cap(wordsIndian(whole))],['Cheque line',chq],['Figures',whole.toLocaleString('en-US')+(cents?'.'+('0'+cents).slice(-2):'.00')+' / '+whole.toLocaleString('en-IN')]],
      work:'Tip: on cheques, write the amount starting at the far left and end with "only" so nothing can be added.'}},
  base:function(v){var s=String(v.value).trim(),b=+v.from,n=parseInt(s,b);
    if(isNaN(n)||n.toString(b).toLowerCase()!==s.toLowerCase().replace(/^0+(?=.)/,''))return {rows:[['Input','Not a valid base-'+b+' number',1]],work:'Allowed digits for base '+b+': '+'0123456789abcdefghijklmnopqrstuvwxyz'.slice(0,b)};
    return {rows:[['Decimal',n.toLocaleString('en-US'),1],['Binary',n.toString(2)],['Octal',n.toString(8)],['Hexadecimal',n.toString(16).toUpperCase()],['Base 36',n.toString(36).toUpperCase()]],
      work:'Read "'+s+'" in base '+b+' → '+n+' in decimal, then repeatedly divide by the target base and read remainders bottom-up.'}}
};
$$('form[data-tool]').forEach(function(f){
  var id=f.getAttribute('data-tool'),out=$('[data-results]'),wk=$('[data-work]'),tb=$('[data-table]');
  function calc(){var v={},bad=false;$$('input,select',f).forEach(function(i){if(!i.name)return;if(i.type==='number'){var x=parseFloat(i.value);if(isNaN(x))bad=true;v[i.name]=x}else v[i.name]=i.value});
    if(bad){out.innerHTML='<div class="res"><span>Waiting for input</span><b>—</b></div>';return}
    var r;try{r=CALC[id](v)}catch(e){r={rows:[['Error','Check your inputs',1]],work:''}}
    out.innerHTML=r.rows.map(function(x){return '<div class="res'+(x[2]?' hi':'')+'"><span>'+esc(x[0])+'</span><b>'+x[1]+'</b></div>'}).join('');
    if(wk)wk.textContent=r.work||'';if(tb)tb.innerHTML=r.table||'';}
  f.addEventListener('input',calc);f.addEventListener('submit',function(e){e.preventDefault();calc()});calc();
});
var y=$('#year');if(y)y.textContent=new Date().getFullYear();
})();
