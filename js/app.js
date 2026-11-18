const CLASSES=[["هفتم",["701","702","703","704"]],["هشتم",["801","802","803"]],["نهم",["901","902","903"]]];
const ALLC=CLASSES.flatMap(g=>g[1]);
const SCHOOL="شیخ فضل‌الله نوری ۸";
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const en=s=>String(s).replace(/[۰-۹]/g,d=>"۰۱۲۳۴۵۶۷۸۹".indexOf(d)).replace(/[٠-٩]/g,d=>"٠١٢٣٤٥٦٧٨٩".indexOf(d)).trim();
const nm=s=>String(s).replace(/ي/g,"ی").replace(/ك/g,"ک").replace(/\s+/g," ").trim();
let S={students:[],teachers:[],staff:[],pass:{"مدیر":"1234","معلم":"2345","ناظم":"3456"},msgs:{}};
let dbDoc=null,P={};
try{P=JSON.parse(localStorage.getItem("prefs")||"{}")}catch(e){}
try{const l=JSON.parse(localStorage.getItem("school")||"null");if(l)S=Object.assign(S,l)}catch(e){}
function savePrefs(){try{localStorage.setItem("prefs",JSON.stringify(P))}catch(e){}}
function save(){try{localStorage.setItem("school",JSON.stringify(S))}catch(e){}if(dbDoc)dbDoc.set(S).catch(()=>{})}
let onRemote=null;
(async()=>{try{const db=await claude.use("db");if(!db)return;dbDoc=db.doc("school/main");dbDoc.onSnapshot(s=>{const d=s&&(s.data?s.data():s);if(d&&d.students){S=Object.assign(S,d);try{localStorage.setItem("school",JSON.stringify(S))}catch(e){}if(onRemote)onRemote()}})}catch(e){}})();
function applyPrefs(){const r=document.documentElement;r.style.setProperty("--ac",P.ac||"#2f80ed");r.style.setProperty("--fs",(P.fs||15)+"px");r.style.setProperty("--br",(P.br||16)+"px");
if(P.theme)r.setAttribute("data-theme",P.theme);else r.removeAttribute("data-theme");
const w={b:"#fff3e0",c:"#e8f5e9",d:"#ede7f6"};
if(P.wall&&w[P.wall]&&P.theme!=="dark")r.style.setProperty("--wall",w[P.wall]);else r.style.removeProperty("--wall")}
applyPrefs();
function show(h){$("#app").innerHTML=h}
function route(){const h=location.hash.slice(1);if(h==="admin")adminLogin();else if(h==="student")studentForm();else home()}
addEventListener("hashchange",route);
function home(){onRemote=null;show(`<div class="wrap"><div class="logo">🏫</div><h1 style="text-align:center">مدرسه ${SCHOOL}</h1><p class="mut" style="text-align:center">سامانه کلاس‌های آنلاین</p>
<div class="card"><button class="btn" onclick="location.hash='student'">🎓 ورود دانش‌آموز</button><button class="btn ghost" onclick="location.hash='admin'">🔑 پنل مدیریت (مدیر / معلم / ناظم)</button></div></div>`)}
let pend=null;
function studentForm(){onRemote=null;
const opts=CLASSES.map(g=>`<optgroup label="پایه ${g[0]}">${g[1].map(c=>`<option>${c}</option>`).join("")}</optgroup>`).join("");
show(`<div class="wrap"><button class="btn sm ghost" onclick="location.hash=''">← بازگشت</button><div class="card"><h2>🎓 ورود دانش‌آموز – مدرسه ${SCHOOL}</h2>
<div class="grid2"><div><label>نام</label><input id="fn"></div><div><label>نام خانوادگی</label><input id="ln"></div></div>
<label>پایه / کلاس خود را وارد کنید</label><select id="cl"><option value="">انتخاب کنید…</option>${opts}</select>
<label>شماره تلفن همراه</label><input id="ph" inputmode="numeric" placeholder="09123456789" dir="ltr" style="text-align:right">
<div class="err" id="er"></div><button class="btn" onclick="sendCode()">دریافت کد تأیید</button></div></div>`)}
function er(m){const e=$("#er");e.textContent=m;e.style.display="block"}
function sendCode(){const fn=nm($("#fn").value),ln=nm($("#ln").value),cl=en($("#cl").value),ph=en($("#ph").value);
if(!fn||!ln||!cl||!ph)return er("همه موارد را تکمیل کنید.");
if(!/^09\d{9}$/.test(ph))return er("شماره تلفن معتبر نیست (مثال: 09123456789).");
if(!S.students.length)return er("هنوز اطلاعات دانش‌آموزان توسط مدرسه ثبت نشده است.");
const same=S.students.filter(s=>nm(s.fn)===fn&&nm(s.ln)===ln);
if(!same.length)return er("نام و نام خانوادگی شما در فهرست مدرسه یافت نشد.");
const s=same.find(x=>x.cl===cl&&en(x.ph)===ph);
if(!s){if(!same.some(x=>x.cl===cl))return er("پایه/کلاس واردشده با اطلاعات ثبت‌شده در مدرسه مطابقت ندارد.");return er("شماره تلفن با اطلاعات ثبت‌شده در مدرسه مطابقت ندارد.")}
pend={s,code:String(Math.floor(10000+Math.random()*90000))};codeStep()}
function codeStep(){show(`<div class="wrap"><div class="card"><h2>کد تأیید</h2><p class="mut">کد ۵ رقمی برای ${esc(pend.s.ph)} ارسال شد.</p>
<div class="demo">⚠️ نسخه نمایشی: پیامک واقعی ارسال نمی‌شود. کد شما: <b>${pend.code}</b></div>
<label>کد را وارد کنید</label><input id="cd" inputmode="numeric" maxlength="5" dir="ltr" style="text-align:center;letter-spacing:8px;font-size:1.4em">
<div class="err" id="er"></div><button class="btn" onclick="chk()">تأیید و ورود</button><button class="btn ghost" onclick="studentForm()">ویرایش اطلاعات</button></div></div>`)}
function chk(){if(en($("#cd").value)!==pend.code)return er("کد واردشده اشتباه است.");const s=pend.s;messenger({name:s.fn+" "+s.ln,role:"دانش‌آموز",cl:s.cl})}
function adminLogin(){onRemote=null;show(`<div class="wrap"><button class="btn sm ghost" onclick="location.hash=''">← بازگشت</button><div class="card"><h2>🔑 ورود به پنل مدیریت</h2>
<label>به عنوان چه کسی وارد می‌شوید؟</label><select id="role"><option>مدیر</option><option>معلم</option><option>ناظم</option></select>
<label>رمز عبور</label><input id="pw" type="password"><div class="err" id="er"></div><button class="btn" onclick="adminGo()">ورود</button>
<p class="mut">رمزهای پیش‌فرض: مدیر 1234 – معلم 2345 – ناظم 3456 (در پنل قابل تغییر است)</p></div></div>`)}
let me=null,tab="students";
function adminGo(){const r=$("#role").value;if(en($("#pw").value)!==S.pass[r])return er("رمز عبور اشتباه است.");me={name:r,role:r};panel()}
function panel(){onRemote=panel;
const T={students:"دانش‌آموزان",teachers:"معلمان",staff:"ناظم/مدیر",pw:"رمزها"};
const canEdit=me.role==="مدیر"||me.role==="ناظم";
let body="";
if(tab==="pw"){body=me.role==="مدیر"?["مدیر","معلم","ناظم"].map(r=>`<label>رمز ${r}</label><input id="p_${r}" value="${esc(S.pass[r])}">`).join("")+`<button class="btn" onclick="setPw()">ذخیره رمزها</button>`:`<p class="mut">فقط مدیر می‌تواند رمزها را تغییر دهد.</p>`}
else{const L=S[tab];
body=(canEdit?`<div class="grid2"><div><label>نام</label><input id="a_fn"></div><div><label>نام خانوادگی</label><input id="a_ln"></div></div>
<div class="grid2"><div><label>تلفن</label><input id="a_ph" inputmode="numeric" dir="ltr" style="text-align:right"></div><div><label>${tab==="students"?"کلاس":"سمت / درس"}</label>${tab==="students"?`<select id="a_cl">${ALLC.map(c=>`<option>${c}</option>`).join("")}</select>`:`<input id="a_cl">`}</div></div>
<div class="err" id="er"></div><button class="btn" onclick="addP()">افزودن</button>`:`<p class="mut">فقط مدیر و ناظم می‌توانند اطلاعات را ویرایش کنند.</p>`)+`<h2 style="margin-top:18px">فهرست (${L.length})</h2>`+(L.length?L.map((x,i)=>`<div class="row"><div>${esc(x.fn)} ${esc(x.ln)}<div class="mut">${esc(x.cl)} • ${esc(x.ph)}</div></div>${canEdit?`<button class="btn sm ghost" onclick="delP(${i})">حذف</button>`:""}</div>`).join(""):`<p class="mut">هنوز موردی ثبت نشده.</p>`)}
show(`<div class="wrap"><div style="display:flex;gap:8px;align-items:center"><b style="flex:1">پنل ${me.role}</b><button class="btn sm ghost" onclick="messenger({name:me.role,role:me.role})">💬 پیام‌رسان</button><button class="btn sm ghost" onclick="me=null;location.hash='';route()">خروج</button></div>
<div class="tabs">${Object.keys(T).map(k=>`<button class="${tab===k?"on":""}" onclick="tab='${k}';panel()">${T[k]}</button>`).join("")}</div><div class="card" style="margin-top:0">${body}</div></div>`)}
function addP(){const fn=nm($("#a_fn").value),ln=nm($("#a_ln").value),ph=en($("#a_ph").value),cl=en($("#a_cl").value);
if(!fn||!ln||!ph||!cl)return er("همه موارد را تکمیل کنید.");if(!/^09\d{9}$/.test(ph))return er("شماره تلفن معتبر نیست.");
S[tab].push({fn,ln,ph,cl});save();panel()}
function delP(i){if(confirm("حذف شود؟")){S[tab].splice(i,1);save();panel()}}
function setPw(){["مدیر","معلم","ناظم"].forEach(r=>{const v=en($("#p_"+r).value);if(v)S.pass[r]=v});save();alert("ذخیره شد.")}
let U=null,cur=null;
const ini=t=>t.replace(/[^\u0600-\u06FFA-Za-z0-9]/g,"").slice(0,1)||"؟";
function chats(){const ann={id:"ann",t:"📢 اطلاعیه‌های مدرسه"};
if(U.role==="دانش‌آموز")return[{id:"c"+U.cl,t:"کلاس "+U.cl},ann];
return[ann,{id:"tch",t:"👩‍🏫 اتاق معلمان"},...ALLC.map(c=>({id:"c"+c,t:"کلاس "+c}))]}
function messenger(u){U=u;cur=null;onRemote=()=>{drawList();drawMsgs()};drawM()}
function drawM(){show(`<div class="msgr" id="mg"><div class="side"><div class="top"><button class="ib" onclick="settings()">⚙️</button><b>${esc(U.name)}<div class="mut">${U.role}${U.cl?" • "+U.cl:""}</div></b><button class="ib" onclick="exitM()">🚪</button></div><div class="list" id="ls"></div></div>
<div class="main"><div class="top"><button class="ib back" onclick="$('#mg').classList.remove('open');cur=null;drawList()">→</button><div class="av" id="hv" style="width:38px;height:38px"></div><b id="ht">یک گفتگو را انتخاب کنید</b></div>
<div class="msgs" id="ms"><p class="mut" style="margin:auto">گفتگویی انتخاب نشده</p></div><div class="comp" id="cp" style="display:none"><input id="mi" placeholder="پیام…" onkeydown="if(event.key==='Enter')send()"><button onclick="send()">➤</button></div></div></div>`);drawList()}
function exitM(){const wasAdmin=U.role!=="دانش‌آموز";U=null;cur=null;onRemote=null;if(wasAdmin&&me)panel();else{location.hash="";route()}}
function drawList(){const el=$("#ls");if(!el)return;el.innerHTML=chats().map(c=>{const a=S.msgs[c.id]||[],l=a[a.length-1];return`<div class="chat ${cur===c.id?"on":""}" onclick="openC('${c.id}')"><div class="av">${esc(ini(c.t))}</div><div class="ci"><b>${esc(c.t)}</b><div class="mut">${l?esc(l.n+": "+l.t):"بدون پیام"}</div></div></div>`}).join("")}
function openC(id){cur=id;$("#mg").classList.add("open");const c=chats().find(x=>x.id===id);$("#ht").textContent=c.t;$("#hv").textContent=ini(c.t);
$("#cp").style.display=(id==="ann"&&U.role==="دانش‌آموز")?"none":"flex";drawMsgs();drawList()}
function drawMsgs(){const el=$("#ms");if(!el||!cur)return;const a=S.msgs[cur]||[];
el.innerHTML=a.length?a.map(m=>`<div class="m ${m.n===U.name&&m.r===U.role?"me":""}"><small>${esc(m.n)}${m.r!=="دانش‌آموز"?" ("+esc(m.r)+")":""}</small>${esc(m.t)}<time>${m.h}</time></div>`).join(""):`<p class="mut" style="margin:auto">اولین پیام را بفرستید 👋</p>`;el.scrollTop=el.scrollHeight}
function send(){const i=$("#mi"),t=i.value.trim();if(!t||!cur)return;const d=new Date();
(S.msgs[cur]=S.msgs[cur]||[]).push({n:U.name,r:U.role,t:t.slice(0,1000),h:d.toLocaleTimeString("fa-IR",{hour:"2-digit",minute:"2-digit"})});
S.msgs[cur]=S.msgs[cur].slice(-80);i.value="";save();drawMsgs();drawList()}
function settings(){const cols=["#2f80ed","#e91e63","#00a884","#ff9800","#7e57c2","#d32f2f","#455a64"];
const m=document.createElement("div");m.className="modal";m.onclick=e=>{if(e.target===m)m.remove()};
m.innerHTML=`<div class="sheet"><h2>⚙️ تنظیمات و شخصی‌سازی</h2>
<label>رنگ اصلی</label><div class="sw">${cols.map(c=>`<i data-c="${c}" style="background:${c}" class="${(P.ac||cols[0])===c?"on":""}"></i>`).join("")}</div>
<label>حالت نمایش</label><select id="s_t"><option value="">خودکار</option><option value="light">روشن</option><option value="dark">تیره</option></select>
<label>پس‌زمینه گفتگو</label><select id="s_w"><option value="a">پیش‌فرض</option><option value="b">کرمی</option><option value="c">سبز ملایم</option><option value="d">بنفش ملایم</option></select>
<label>اندازه متن: <span id="v1">${P.fs||15}</span></label><input type="range" id="s_f" min="12" max="22" value="${P.fs||15}">
<label>گردی حباب پیام: <span id="v2">${P.br||16}</span></label><input type="range" id="s_b" min="2" max="26" value="${P.br||16}">
<button class="btn" id="s_x">بستن</button></div>`;document.body.appendChild(m);
m.querySelector("#s_t").value=P.theme||"";m.querySelector("#s_w").value=P.wall||"a";
m.querySelectorAll(".sw i").forEach(i=>i.onclick=()=>{P.ac=i.dataset.c;m.querySelectorAll(".sw i").forEach(x=>x.classList.toggle("on",x===i));savePrefs();applyPrefs()});
m.querySelector("#s_t").onchange=e=>{P.theme=e.target.value;savePrefs();applyPrefs()};
m.querySelector("#s_w").onchange=e=>{P.wall=e.target.value;savePrefs();applyPrefs()};
m.querySelector("#s_f").oninput=e=>{P.fs=+e.target.value;m.querySelector("#v1").textContent=P.fs;savePrefs();applyPrefs()};
m.querySelector("#s_b").oninput=e=>{P.br=+e.target.value;m.querySelector("#v2").textContent=P.br;savePrefs();applyPrefs()};
m.querySelector("#s_x").onclick=()=>m.remove()}
route();
