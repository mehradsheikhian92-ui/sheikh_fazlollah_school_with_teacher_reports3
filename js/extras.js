/* افزونه‌ها: صفحه ورود زیبا، ورود مدیر/ناظم/معلم، افزودن دانش‌آموز یا معلم، برنامه هفتگی کلاس‌ها */
const DAYS=["شنبه","یکشنبه","دوشنبه","سه‌شنبه","چهارشنبه","پنجشنبه"];
const DT=["8:00","8:50","9:40","10:40","11:30","12:20"];
function sch(){S.sched=S.sched||{};S.times=S.times||DT.slice()}
sch();
const heroize=()=>{const w=document.querySelector("#app>.wrap");if(w)w.className="hero"};
const _sf=studentForm;studentForm=function(){_sf();heroize()};
const _cs=codeStep;codeStep=function(){_cs();heroize()};

function home(){onRemote=null;show(`<div class="hero"><div class="crest">🏫</div><h1>مدرسه ${SCHOOL}</h1><p>سامانه کلاس‌های آنلاین</p>
<div class="opt" onclick="location.hash='student'"><div class="ic">🎓</div><div><b>ورود به عنوان دانش‌آموز</b><span>با نام، کلاس، شماره تلفن و کد تأیید</span></div></div>
<div class="opt" onclick="location.hash='admin'"><div class="ic">🔑</div><div><b>ورود مدیر / ناظم / معلم</b><span>با رمز عبور و مشخصات</span></div></div></div>`)}

function adminLogin(){onRemote=null;show(`<div class="hero"><button class="btn sm ghost" onclick="location.hash=''">← بازگشت</button><div class="card"><h2>🔑 ورود مدیر / ناظم / معلم</h2>
<label>به عنوان چه کسی وارد می‌شوید؟</label><select id="role" onchange="roleUI()"><option>مدیر</option><option>ناظم</option><option>معلم</option></select>
<div id="tf" style="display:none"><div class="grid2"><div><label>نام</label><input id="t_fn"></div><div><label>نام خانوادگی</label><input id="t_ln"></div></div>
<label>شماره تلفن</label><input id="t_ph" inputmode="numeric" dir="ltr" style="text-align:right"></div>
<label>رمز عبور</label><input id="pw" type="password"><div class="err" id="er"></div><button class="btn" onclick="adminGo()">ورود</button></div></div>`)}
function roleUI(){$("#tf").style.display=$("#role").value==="معلم"?"block":"none"}
function adminGo(){const r=$("#role").value;let who=r;
if(r==="معلم"){const fn=nm($("#t_fn").value),ln=nm($("#t_ln").value),ph=en($("#t_ph").value);
if(!fn||!ln||!ph)return er("نام، نام خانوادگی و شماره تلفن معلم را وارد کنید.");
if(!S.teachers.some(t=>nm(t.fn)===fn&&nm(t.ln)===ln&&en(t.ph)===ph))return er("مشخصات معلم با اطلاعات ثبت‌شده توسط مدیر مطابقت ندارد.");who=fn+" "+ln}
if(en($("#pw").value)!==S.pass[r])return er("رمز عبور اشتباه است.");
me={name:who,role:r};tab="people";panel()}

function setC(c,d,i,v){sch();const a=(S.sched[c]=S.sched[c]||{});(a[d]=a[d]||[])[i]=v.trim();save()}
function setT(i,v){sch();S.times[i]=v.trim();save()}
function schTable(c,edit){sch();const d=S.sched[c]||{};
return `<div style="overflow-x:auto"><table class="tb"><tr><th></th>${S.times.map((t,i)=>`<th>زنگ ${i+1}<br>${edit?`<input value="${esc(t)}" onchange="setT(${i},this.value)">`:esc(t)}</th>`).join("")}</tr>`+
DAYS.map((n,di)=>`<tr><th>${n}</th>${S.times.map((_,i)=>{const v=(d[di]||[])[i]||"";return `<td>${edit?`<input value="${esc(v)}" placeholder="درس" onchange="setC('${c}',${di},${i},this.value)">`:(esc(v)||"—")}</td>`}).join("")}</tr>`).join("")+`</table></div>`}

let sc="801";
const tIU=()=>{const t=$("#a_t").value==="s";$("#w_c").style.display=t?"block":"none";$("#w_s").style.display=t?"none":"block"};
function panel(){onRemote=panel;
const T={people:"👥 افراد",sched:"📅 برنامه هفتگی",pw:"🔒 رمزها"};
if(me.role!=="مدیر")delete T.pw;
const ed=me.role==="مدیر"||me.role==="ناظم";let body="";
if(tab==="pw"){body=me.role==="مدیر"?`<p class="mut">رمز جدید را فقط برای مواردی که می‌خواهید تغییر کند وارد کنید.</p>`+["مدیر","معلم","ناظم"].map(r=>`<label>رمز جدید ${r}</label><input id="p_${r}" type="password" autocomplete="new-password">`).join("")+`<label>رمز فعلی مدیر (برای تأیید)</label><input id="p_cur" type="password"><div class="err" id="er"></div><button class="btn" onclick="setPw()">ذخیره رمزها</button>`:`<p class="mut">فقط مدیر می‌تواند رمزها را تغییر دهد.</p>`}
else if(tab==="sched"){body=`<label>کلاس</label><select onchange="sc=this.value;panel()">${ALLC.map(c=>`<option ${c===sc?"selected":""}>${c}</option>`).join("")}</select><h2 style="margin-top:14px">برنامه هفتگی کلاس ${sc}</h2>${ed?"":`<p class="mut">فقط مشاهده</p>`}${schTable(sc,ed)}`}
else{const lst=(k,t)=>`<h2 style="margin-top:18px">${t} (${S[k].length})</h2>`+(S[k].length?S[k].map((x,i)=>`<div class="row"><div>${esc(x.fn)} ${esc(x.ln)}<div class="mut">${esc(x.cl)} • ${esc(x.ph)}</div></div>${ed?`<button class="btn sm ghost" onclick="delP('${k}',${i})">حذف</button>`:""}</div>`).join(""):`<p class="mut">موردی ثبت نشده.</p>`);
body=(ed?`<label>این فرد چه کسی است؟</label><select id="a_t" onchange="tIU()"><option value="s">دانش‌آموز</option><option value="t">معلم</option></select>
<div class="grid2"><div><label>نام</label><input id="a_fn"></div><div><label>نام خانوادگی</label><input id="a_ln"></div></div>
<div class="grid2"><div><label>تلفن</label><input id="a_ph" inputmode="numeric" dir="ltr" style="text-align:right"></div>
<div><div id="w_c"><label>کلاس</label><select id="a_cl">${ALLC.map(c=>`<option>${c}</option>`).join("")}</select></div><div id="w_s" style="display:none"><label>درس / سمت</label><input id="a_sb"></div></div></div>
<div class="err" id="er"></div><button class="btn" onclick="addP()">افزودن</button>`:`<p class="mut">فقط مدیر و ناظم می‌توانند افراد را ثبت کنند.</p>`)+lst("students","دانش‌آموزان")+lst("teachers","معلمان")}
show(`<div class="wrap"><div style="display:flex;gap:8px;align-items:center"><b style="flex:1">پنل ${me.role}${me.role==="معلم"?" – "+esc(me.name):""}</b><button class="btn sm ghost" onclick="messenger({name:me.name,role:me.role})">💬</button><button class="btn sm ghost" onclick="me=null;location.hash='';route()">خروج</button></div>
<div class="tabs">${Object.keys(T).map(k=>`<button class="${tab===k?"on":""}" onclick="tab='${k}';panel()">${T[k]}</button>`).join("")}</div><div class="card" style="margin-top:0">${body}</div></div>`)}
function addP(){const s=$("#a_t").value==="s",fn=nm($("#a_fn").value),ln=nm($("#a_ln").value),ph=en($("#a_ph").value),cl=s?$("#a_cl").value:nm($("#a_sb").value);
if(!fn||!ln||!ph||!cl)return er("همه موارد را تکمیل کنید.");if(!/^09\d{9}$/.test(ph))return er("شماره تلفن معتبر نیست.");
S[s?"students":"teachers"].push({fn,ln,ph,cl});save();panel()}
function delP(k,i){if(confirm("حذف شود؟")){S[k].splice(i,1);save();panel()}}

/* برنامه هفتگی داخل پیام‌رسان برای همه */
const _ch=chats;chats=function(){const a=_ch();a.splice(1,0,{id:"sched",t:"📅 برنامه هفتگی"});return a};
function schView(){const el=$("#ms");if(!el)return;const c=U.cl||sc;
el.innerHTML=`<div style="background:var(--card);border-radius:14px;padding:12px">${U.cl?"":`<select onchange="sc=this.value;schView()">${ALLC.map(x=>`<option ${x===sc?"selected":""}>${x}</option>`).join("")}</select>`}<h2 style="margin:10px 0">برنامه هفتگی کلاس ${c}</h2>${schTable(c,false)}</div>`}
const _dm=drawMsgs;drawMsgs=function(){if(cur==="sched")return schView();_dm()};
const _oc=openC;openC=function(id){_oc(id);if(id==="sched")$("#cp").style.display="none"};
route();

function setPw(){if(!me||me.role!=="مدیر")return er("فقط مدیر مجاز به تغییر رمز است.");
if(en($("#p_cur").value)!==S.pass["مدیر"])return er("رمز فعلی مدیر اشتباه است.");
let n=0;for(const r of ["مدیر","معلم","ناظم"]){const v=en($("#p_"+r).value);if(v){if(v.length<4)return er("رمز باید حداقل ۴ کاراکتر باشد.");S.pass[r]=v;n++}}
if(!n)return er("رمز جدیدی وارد نشده است.");save();panel();alert("رمزها ذخیره شد.")}
