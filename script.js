(function(){
  /* ===== Контакты барбершопа. Заполни значения, и они появятся везде на сайте. ===== */
  var CONFIG = {
    instagram: 'obraz_barbershop_',
    tiktok:    'obraz_barbershop_',
    whatsapp:  '+373 779 300-02',
    telegram:  '',
    phone:     '+373 779 300-02',
    address:   'ул. Луначарского, 24а',                    // например 'ул. Мира, 12' (город добавится сам)
    city:      'Тирасполь',
    mapUrl:    '',                    // ссылка «Поделиться» из Google Maps на карточку барбершопа (если есть), откроется ровно она
    hours:     '',                    // например 'Пн-Вс 9:00 - 21:00'
    nativeLinks: false,               // true только на настоящем сайте: тогда номер звонит через tel:
    /* отзывы: впиши настоящие, и пометка «пример» пропадёт: {name:'Имя', master:'Артём', text:'Текст'} */
    reviews:   [],
    /* ОТЗЫВЫ С ВХОДОМ ЧЕРЕЗ GOOGLE (Firebase, бесплатно). Вставь сюда данные из Firebase Console:
       Project settings, Your apps, Web app, firebaseConfig. Пока поля пустые, форма отзывов в режиме показа. */
    firebase:  {apiKey:'AIzaSyCPuKmjhdOPHwSDYTa8ANv2b7kMJTgsHUY', authDomain:'obraz-72c64.firebaseapp.com', projectId:'obraz-72c64', appId:'1:790694544534:web:1dde67a01e40cb911b6eb7'},
    masters:   {}                     // личные номера: {'Ярослав':{whatsapp:'+373...', phone:'+373...'}}
  };

  var CUR = '₽';
  var masters = [
    {name:'Ярослав', groups:[
      {t:'Стрижки', items:[['Мужская стрижка',210],['Комплекс (мужская стрижка + оформление бороды)',330],['Детская стрижка (до 10 лет)',190],['Бритьё головы (триммер + шейвер)',110],['Укладка',70]]},
      {t:'Борода', items:[['Оформление бороды',140],['Бритьё лица (триммер + шейвер)',75]]},
      {t:'Камуфлирование', items:[['Камуфляж головы',190],['Камуфляж бороды',140]]},
      {t:'Дополнительные услуги', items:[['Удаление волос из носа',30],['Удаление волос из ушей',30]]}
    ]},
    {name:'Артём', groups:[
      {t:'Стрижки', items:[['Мужская стрижка',200],['Комплекс (мужская стрижка + оформление бороды)',320],['Детская стрижка (до 10 лет)',180],['Бритьё головы (триммер + шейвер)',100],['Укладка',60]]},
      {t:'Борода', items:[['Оформление бороды',130],['Бритьё лица (триммер + шейвер)',75]]},
      {t:'Камуфлирование', items:[['Камуфляж головы',190],['Камуфляж бороды',140]]},
      {t:'Дополнительные услуги', items:[['Удаление волос из носа',30],['Удаление волос из ушей',30]]}
    ]},
    {name:'Дмитрий', groups:[
      {t:'Стрижки', items:[['Мужская стрижка',200,'1 ч'],['Удлинённая стрижка ножницами',220,'1 ч'],['Детская стрижка',180,'1 ч'],['Комплекс (мужская стрижка + оформление бороды)',320,'1 ч 30 мин'],['Бритьё головы (триммер + шейвер)',100,'30 мин'],['Укладка',60,'15 мин']]},
      {t:'Борода', items:[['Оформление бороды',130,'30 мин'],['Бритьё лица (триммер + шейвер)',75,'15 мин']]},
      {t:'Камуфлирование', items:[['Камуфляж головы',190,'30 мин'],['Камуфляж бороды',140,'30 мин']]},
      {t:'Дополнительные услуги', items:[['Удаление волос из ушей',30,'5 мин'],['Удаление волос из носа',30,'5 мин']]}
    ]},
    {name:'Даниил', groups:[
      {t:'Стрижки', items:[['Мужская стрижка',200,'1 ч'],['Удлинённая стрижка ножницами',220,'1 ч'],['Детская стрижка',180,'1 ч'],['Комплекс (мужская стрижка + оформление бороды)',320,'1 ч 30 мин'],['Бритьё головы (триммер + шейвер)',100,'30 мин'],['Укладка',60,'15 мин']]},
      {t:'Борода', items:[['Оформление бороды',130,'30 мин'],['Бритьё лица (триммер + шейвер)',75,'30 мин']]},
      {t:'Камуфлирование', items:[['Камуфляж головы',190,'30 мин'],['Камуфляж бороды',140,'30 мин']]},
      {t:'Дополнительные услуги', items:[['Удаление волос из ушей',30,'5 мин'],['Удаление волос из носа',30,'5 мин']]}
    ]}
  ];

  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
  function icon(id,cls){return '<svg class="'+(cls||'ico')+'" viewBox="0 0 24 24" aria-hidden="true"><use href="#'+id+'"/></svg>';}
  function digits(v){return String(v).replace(/[^\d]/g,'');}
  function handle(v){return String(v).replace(/^@/,'');}
  function telHref(v){return 'tel:'+String(v).replace(/[^+\d]/g,'');}
  var IG = 'https://www.instagram.com/'+handle(CONFIG.instagram)+'/';
  var TT = CONFIG.tiktok ? 'https://www.tiktok.com/@'+handle(CONFIG.tiktok) : '';
  var WA = CONFIG.whatsapp ? 'https://wa.me/'+digits(CONFIG.whatsapp) : '';

  /* соцсети и телефон в шапке, меню, доке */
  var socHtml = '<a href="'+IG+'" target="_blank" rel="noopener" aria-label="Instagram">'+icon('i-ig')+'</a>';
  if (TT) socHtml += '<a href="'+TT+'" target="_blank" rel="noopener" aria-label="TikTok">'+icon('i-tt')+'</a>';
  if (WA) socHtml += '<a href="'+WA+'" target="_blank" rel="noopener" aria-label="WhatsApp">'+icon('i-wa')+'</a>';
  Array.prototype.forEach.call(document.querySelectorAll('[data-soc]'),function(n){n.innerHTML = socHtml;});
  Array.prototype.forEach.call(document.querySelectorAll('[data-wa-round]'),function(n){if(WA){n.innerHTML=icon('i-wa');n.href=WA;n.target='_blank';n.rel='noopener';}else n.hidden=true;});
  var phones = document.querySelectorAll('[data-phone]');
  Array.prototype.forEach.call(phones,function(n){
    if (!CONFIG.phone){ n.hidden = true; return; }
    var m = n.getAttribute('data-phone');
    n.innerHTML = m==='icon' ? icon('i-ph') : (m==='btn' ? icon('i-ph')+esc(CONFIG.phone) : esc(CONFIG.phone));
  });

  function toast(t){
    var e = document.getElementById('toast');
    e.textContent = t; e.classList.add('show');
    clearTimeout(toast.t); toast.t = setTimeout(function(){e.classList.remove('show');},2800);
  }
  function phoneAction(){
    var ph = CONFIG.phone;
    /* В окне просмотра ссылка tel: даёт белый экран, поэтому номер копируется.
       На обычном сайте поставь CONFIG.nativeLinks = true, и кнопка начнёт звонить. */
    if (CONFIG.nativeLinks){ window.location.href = telHref(ph); return; }
    var ok = function(){toast('Номер скопирован: '+ph);}, no = function(){toast('Наш номер: '+ph);};
    try{ navigator.clipboard.writeText(ph).then(ok,no); }catch(err){ no(); }
  }

  /* контакты */
  var cards = [];
  if (CONFIG.phone) cards.push({ic:'i-ph',l:'Телефон',v:CONFIG.phone,phone:true});
  if (WA) cards.push({ic:'i-wa',l:'WhatsApp',v:CONFIG.whatsapp,h:WA});
  if (CONFIG.telegram) cards.push({ic:'i-tg',l:'Telegram',v:'@'+handle(CONFIG.telegram),h:'https://t.me/'+handle(CONFIG.telegram)});
  cards.push({ic:'i-ig',l:'Instagram',v:'@'+handle(CONFIG.instagram),h:IG});
  if (TT) cards.push({ic:'i-tt',l:'TikTok',v:'@'+handle(CONFIG.tiktok),h:TT});
  document.getElementById('ccards').innerHTML = cards.map(function(c){
    if (c.phone) return '<button class="cc" type="button" data-phone="card"><span class="ci">'+icon(c.ic)+'</span><span><small>'+c.l+'</small><b>'+esc(c.v)+'</b></span><span class="cpi">'+icon('i-cp')+'</span></button>';
    var ext = ' target="_blank" rel="noopener"';
    return '<a class="cc'+(c.wide?' wide':'')+'" href="'+c.h+'"'+ext+'><span class="ci">'+icon(c.ic)+'</span><span><small>'+c.l+'</small><b>'+esc(c.v)+'</b></span></a>';
  }).join('');
  var info = [];
  info.push(['Адрес', CONFIG.address ? esc(CONFIG.address)+'<small>'+esc(CONFIG.city)+', Приднестровье</small>' : esc(CONFIG.city)+'<small>Приднестровье. Точный адрес пришлём в WhatsApp при записи</small>']);
  if (CONFIG.hours) info.push(['Часы работы', esc(CONFIG.hours)]);
  document.getElementById('info').innerHTML = info.map(function(r){return '<li><span>'+r[0]+'</span><b>'+r[1]+'</b></li>';}).join('');

  if (CONFIG.address) document.getElementById('fcopy').textContent = '© OBRAZ Барбершоп · '+CONFIG.city+', '+CONFIG.address;
  /* карта: ссылки на маршрут */
  var q = encodeURIComponent('OBRAZ barbershop, ' + CONFIG.city + ', ' + (CONFIG.address || ''));
  var gmap = CONFIG.mapUrl || ('https://www.google.com/maps/search/?api=1&query='+q);
  document.getElementById('mapbar').innerHTML =
    '<a class="btn sm solid" href="'+gmap+'" target="_blank" rel="noopener">Google Maps '+icon('i-go')+'</a>'+
    '<a class="btn sm" href="https://yandex.com/maps/?text='+q+'" target="_blank" rel="noopener">Яндекс Карты '+icon('i-go')+'</a>';

  /* вкладки мастеров и прайс */
  var tabs = document.getElementById('tabs');
  var menu = document.getElementById('menu');
  function render(i){
    var m = masters[i];
    Array.prototype.forEach.call(tabs.children,function(b,j){b.setAttribute('aria-selected', j===i ? 'true':'false');});
    var html = '<div class="menu-logo"><svg viewBox="0 0 120 120" aria-hidden="true"><use href="#mark"/></svg><b>OBRAZ</b><div class="rule"><i></i></div><span>Барбершоп</span></div>'+
      '<div class="who"><h3>'+esc(m.name)+'</h3></div><div class="cols">';
    m.groups.forEach(function(g){
      html += '<div class="grp"><h4>'+esc(g.t)+'</h4>';
      g.items.forEach(function(it){
        html += '<div class="row"><span class="nm">'+esc(it[0])+(it[2]?'<small>'+esc(it[2])+'</small>':'')+'</span><span class="dots"></span><span class="pr">'+it[1]+' '+CUR+'</span></div>';
      });
      html += '</div>';
    });
    html += '</div><div class="menu-cta"><button class="btn red" type="button" data-book="'+i+'">Записаться к мастеру '+esc(m.name)+'</button></div>';
    menu.innerHTML = html;
  }
  masters.forEach(function(m,i){
    var b = document.createElement('button');
    b.className='tab'; b.type='button'; b.setAttribute('role','tab');
    b.innerHTML = '<span class="ini" aria-hidden="true">'+esc(m.name.charAt(0))+'</span><em>Барбер</em><b>'+esc(m.name)+'</b><small>Стрижка '+m.groups[0].items[0][1]+' '+CUR+'</small>';
    b.addEventListener('click',function(){render(i);});
    tabs.appendChild(b);
  });
  render(0);

  /* отзывы */
  var SAMPLE = [
    {name:'Клиент', master:'Ярослав', rating:5, text:'Пришёл на стрижку с бородой. Сделали аккуратно, форма держится уже третью неделю.', sample:true},
    {name:'Клиент', master:'Артём', rating:5, text:'Приятная атмосфера, мастер сразу уточнил, что нужно, и подобрал форму под лицо.', sample:true},
    {name:'Клиент', master:'Даниил', rating:5, text:'Записался в WhatsApp, приняли без ожидания. Прайс честный, всё как на сайте.', sample:true}
  ];
  var starSvg = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5l2.9 6 6.6.8-4.9 4.5 1.3 6.5L12 17l-5.9 3.3 1.3-6.5L2.5 9.3l6.6-.8z"/></svg>';
  var $ = function(id){return document.getElementById(id);};
  var fbOn = !!(CONFIG.firebase && CONFIG.firebase.apiKey && CONFIG.firebase.projectId);
  function renderRevs(list, isDemo){
    var LIM = 3;
    $('rvtrack').classList.remove('open');
    $('rvtrack').innerHTML = list.map(function(r,idx){
      var n = Math.max(1,Math.min(5,+r.rating||5)), st='';
      for (var i=0;i<n;i++) st += starSvg;
      var av = r.photo ? '<img class="avp" src="'+esc(r.photo)+'" alt="" referrerpolicy="no-referrer">' : '<span class="av" aria-hidden="true">'+esc((r.name||'К').charAt(0))+'</span>';
      return '<figure class="rv'+(idx>=LIM?' more':'')+'" style="margin:0">'+(r.sample?'<span class="tagx">Пример отзыва</span>':'')+'<span class="q" aria-hidden="true">&ldquo;</span><div class="stars" role="img" aria-label="'+n+' из 5">'+st+'</div><p>'+esc(r.text)+'</p><footer>'+av+'<div><b>'+esc(r.name)+'</b><small>'+(r.master?'Мастер '+esc(r.master):'Клиент OBRAZ')+'</small></div></footer></figure>';
    }).join('');
    var mb = $('rvmore');
    if (list.length > LIM) {
      mb.hidden = false; mb.setAttribute('aria-expanded','false');
      mb.textContent = 'Показать все отзывы (' + list.length + ')';
      mb.onclick = function(){
        var op = $('rvtrack').classList.toggle('open');
        mb.setAttribute('aria-expanded', op ? 'true':'false');
        mb.textContent = op ? 'Свернуть' : 'Показать все отзывы (' + list.length + ')';
        if (!op) $('reviews').scrollIntoView({behavior:'smooth', block:'start'});
      };
    } else { mb.hidden = true; }
    $('rvnote').textContent = isDemo ? 'Здесь появятся настоящие отзывы клиентов. Сейчас показаны примеры оформления.' : '';
  }
  var manual = (CONFIG.reviews && CONFIG.reviews.length) ? CONFIG.reviews : null;
  if (manual) renderRevs(manual,false); else if (fbOn) { $('rvtrack').innerHTML=''; $('rvnote').textContent='Загружаем отзывы…'; } else renderRevs(SAMPLE,true);

  /* форма отзыва */
  var gIcon = '<svg viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.5l6.7-6.7C35.7 2.4 30.2 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.8 6C12.3 13.6 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.6 5.9c4.4-4.1 7-10.1 7-17.6z"/><path fill="#FBBC05" d="M10.4 28.8a14.5 14.5 0 0 1 0-9.6l-7.8-6a24 24 0 0 0 0 21.6l7.8-6z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.6-5.9c-2.1 1.4-4.9 2.3-8.3 2.3-6.3 0-11.7-4.1-13.6-9.8l-7.8 6C6.5 42.6 14.6 48 24 48z"/></svg>';
  var rating = 0, user = null, FB = null;
  var rate = $('rate'), msg = $('rvmsg');
  for (var k=1;k<=5;k++){
    (function(k){
      var b = document.createElement('button'); b.type='button'; b.setAttribute('role','radio'); b.setAttribute('aria-checked','false'); b.setAttribute('aria-label',k+' из 5'); b.innerHTML=starSvg;
      b.addEventListener('click',function(){rating=k;paintRate();});
      rate.appendChild(b);
    })(k);
  }
  function paintRate(){Array.prototype.forEach.call(rate.children,function(b,i){b.classList.toggle('on',i<rating);b.setAttribute('aria-checked',i+1===rating?'true':'false');});}
  $('rvmaster').innerHTML = '<option value="">Не важно</option>'+masters.map(function(m){return '<option>'+esc(m.name)+'</option>';}).join('');
  $('rvtext').addEventListener('input',function(){$('rvcnt').textContent = this.value.length+' / 400';});
  function say(t,cls){msg.textContent=t;msg.className='rvmsg'+(cls?' '+cls:'');}
  function drawAuth(){
    var box = $('rvauth');
    if (user){
      var ph = user.photoURL ? '<img src="'+esc(user.photoURL)+'" alt="" referrerpolicy="no-referrer">' : '<span class="av2">'+esc((user.displayName||'К').charAt(0))+'</span>';
      box.innerHTML = '<div class="me">'+ph+'<div><b>'+esc(user.displayName||'Клиент')+'</b><button type="button" id="rvout">Выйти</button></div></div>';
      $('rvform').hidden = false;
      $('rvout').addEventListener('click',function(){ if(FB) FB.A.signOut(FB.auth); });
    } else {
      box.innerHTML = '<button class="gbtn" type="button" id="rvin">'+gIcon+'Войти через Google</button>';
      $('rvform').hidden = true;
      $('rvin').addEventListener('click',signIn);
    }
  }
  function inApp(){return /Telegram|Instagram|FBAN|FBAV|FB_IAB|Line\/|TikTok|musical_ly|Snapchat|; wv\)|WebView/i.test(navigator.userAgent||'');}
  function signIn(){
    if (!fbOn){ toast('Отзывы пока настраиваются. Напишите нам в WhatsApp'); return; }
    if (!FB){ say('Подождите секунду и попробуйте ещё раз.','err'); return; }
    if (inApp()){ say('Google не пускает во встроенном браузере (Telegram, Instagram). Откройте сайт в Safari или Chrome: меню «⋯» → «Открыть в браузере».','err'); return; }
    var prov = new FB.A.GoogleAuthProvider();
    FB.A.signInWithPopup(FB.auth,prov).catch(function(e){
      if (e && (e.code==='auth/popup-blocked' || e.code==='auth/operation-not-supported-in-this-environment')) return FB.A.signInWithRedirect(FB.auth,prov);
      if (e && (e.code==='auth/popup-closed-by-user' || e.code==='auth/cancelled-popup-request')) return;
      if (e && e.code==='auth/unauthorized-domain'){ say('Этот адрес сайта не добавлен в Firebase (Authentication, Settings, Authorized domains).','err'); return; }
      say('Не удалось войти через Google. Попробуйте ещё раз.','err');
    });
  }
  /* фильтр: мат, ссылки, телефоны. Те же правила продублированы на сервере в правилах Firestore, обойти их из браузера нельзя */
  function badText(t){
    var x = (' '+t+' ').toLowerCase().replace(/ё/g,'е');
    var map = {a:'а',b:'в',c:'с',e:'е',h:'н',k:'к',m:'м',o:'о',p:'р',t:'т',x:'х',y:'у','0':'о','3':'з','4':'ч','6':'б','@':'а','$':'с'};
    var norm = x.replace(/[a-z0-9@$]/g,function(c){return map[c]||c;}).replace(/[^а-я\s]/g,'').replace(/\s+/g,' ');
    var thin = norm.replace(/(.)\1+/g,'$1');
    var roots = /(х[уy]й|х[уy][еёяию]|пизд|п[ие]д[ао]р|еб[ауеилыо]н|еба[лтн]|ебл[оа]|[зпнв]аеб|уеб|ёб|бля[дт]|блят|сучк|сука|сучар|мудак|мудил|мудо|гандон|гондон|залуп|долбо[её]б|дрочи|шлюх|говн|дерьм|жопа|(^| )чмо( |$)|пох[уy]й|нах[уy]й|(^| )бля( |$)|(^| )ху[йи]( |$))/;
    if (roots.test(norm) || roots.test(thin)) return 'мат';
    if (/(https?:|www\.|\.(ru|com|md|net|org|me|io|xyz|ly|su)\b|t\.me|@[a-z0-9_]{3,})/i.test(t)) return 'ссылки';
    if (/(.)\1{5,}/.test(t)) return 'повтор';
    if (/\d[\d\s()-]{8,}\d/.test(t)) return 'номер';
    return '';
  }
  $('rvform').addEventListener('submit',function(e){
    e.preventDefault();
    var text = $('rvtext').value.trim();
    if (!user || !FB) return;
    if (!rating){ say('Поставьте оценку звёздами.','err'); return; }
    if (text.length < 10){ say('Напишите хотя бы пару слов (от 10 символов).','err'); return; }
    if (badText(text)){ say('Отзыв не отправлен: уберите нецензурные слова, ссылки и номера телефонов и попробуйте снова.','err'); return; }
    var btn = $('rvsend'); btn.disabled = true; say('Отправляем…');
    var F = FB.F;
    F.setDoc(F.doc(FB.db,'reviews',user.uid),{
      uid:user.uid, name:(user.displayName||'Клиент').slice(0,60), photo:user.photoURL||'', rating:rating,
      master:$('rvmaster').value, text:text, approved:true, created:F.serverTimestamp()
    }).then(function(){
      $('rvform').hidden = true; say('Спасибо! Ваш отзыв опубликован.','ok'); loadPublic().catch(function(){});
    }).catch(function(err){
      btn.disabled = false;
      say(err && err.code==='permission-denied' ? 'Вы уже оставляли отзыв с этого аккаунта.' : 'Не получилось отправить. Попробуйте позже.','err');
    });
  });
  drawAuth();

  function loadPublic(){
    return FB.F.getDocs(FB.F.query(FB.F.collection(FB.db,'reviews'),FB.F.where('approved','==',true),FB.F.limit(60))).then(function(snap){
      var list = [];
      snap.forEach(function(d){var v=d.data(); list.push({name:v.name,photo:v.photo,rating:v.rating,master:v.master,text:v.text,t:(v.created&&v.created.seconds)||0});});
      list.sort(function(a,b){return b.t-a.t;});
      var all = (manual||[]).concat(list);
      if (all.length) renderRevs(all,false);
      else { $('rvtrack').innerHTML=''; $('rvmore').hidden=true; $('rvnote').textContent='Отзывов пока нет. Станьте первым.'; }
    });
  }
  if (fbOn){
    var base = 'https://www.gstatic.com/firebasejs/10.12.2/';
    Promise.all([import(base+'firebase-app.js'),import(base+'firebase-auth.js'),import(base+'firebase-firestore.js')]).then(function(m){
      var app = m[0].initializeApp(CONFIG.firebase);
      FB = {A:m[1], F:m[2], auth:m[1].getAuth(app), db:m[2].getFirestore(app)};
      FB.A.onAuthStateChanged(FB.auth,function(u){user=u; if(u) say(''); drawAuth();});
      return loadPublic();
    }).catch(function(){
      if (manual) renderRevs(manual,false); else { $('rvtrack').innerHTML=''; $('rvmore').hidden=true; $('rvnote').textContent='Не удалось загрузить отзывы. Обновите страницу.'; }
    });
  }

  /* меню на телефоне */
  var burger = document.getElementById('burger');
  function setNav(open){
    document.body.classList.toggle('navopen',open);
    burger.setAttribute('aria-expanded',open?'true':'false');
  }
  burger.addEventListener('click',function(){setNav(!document.body.classList.contains('navopen'));});
  document.getElementById('panel').addEventListener('click',function(e){
    if (e.target.closest('nav a') || e.target.closest('[data-book]')) setNav(false);
  });

  /* окно записи */
  var modal = document.getElementById('modal');
  var sheet = document.getElementById('sheet');
  var lastFocus = null;
  function channels(mi){
    var o = (mi!=null && CONFIG.masters[masters[mi].name]) || {};
    var wa = o.whatsapp || CONFIG.whatsapp, tg = o.telegram || CONFIG.telegram, ph = o.phone || CONFIG.phone;
    var list = [];
    if (wa) list.push({ic:'i-wa',label:'WhatsApp',val:wa,href:'https://wa.me/'+digits(wa),go:'Написать'});
    if (ph) list.push({ic:'i-ph',label:'Телефон',val:ph,phone:true});
    if (tg) list.push({ic:'i-tg',label:'Telegram',val:'@'+handle(tg),href:'https://t.me/'+handle(tg),go:'Написать'});
    list.push({ic:'i-ig',label:'Instagram',val:'@'+handle(CONFIG.instagram),href:IG,go:'Открыть'});
    if (TT) list.push({ic:'i-tt',label:'TikTok',val:'@'+handle(CONFIG.tiktok),href:TT,go:'Открыть'});
    return list;
  }
  function openModal(mi){
    lastFocus = document.activeElement;
    var m = (mi!=null && masters[mi]) ? masters[mi] : null;
    var html = '<button class="x" type="button" id="mx" aria-label="Закрыть">'+icon('i-x')+'</button>'+
      '<p class="tag">OBRAZ ◆ Барбершоп</p><h3 id="mt">'+(m?'Запись к мастеру '+esc(m.name):'Запись в барбершоп')+'</h3>'+
      '<p class="sub">Выбери удобный способ связи, назови мастера и время.</p>';
    channels(mi).forEach(function(c){
      var act = c.phone
        ? '<button class="btn sm ink" type="button" data-phone="card">Скопировать номер</button>'
        : '<a class="btn sm ink" href="'+c.href+'" target="_blank" rel="noopener">'+c.go+'</a><button class="cp" type="button" data-copy="'+esc(c.val)+'" aria-label="Скопировать '+esc(c.label)+'">'+icon('i-cp')+'</button>';
      html += '<div class="ch"><span class="ci">'+icon(c.ic)+'</span><div><small>'+c.label+'</small><b>'+esc(c.val)+'</b></div><div class="ac">'+act+'</div></div>';
    });
    sheet.innerHTML = html;
    modal.classList.add('open'); modal.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
    document.getElementById('mx').focus();
  }
  function closeModal(){
    modal.classList.remove('open'); modal.setAttribute('aria-hidden','true');
    document.body.style.overflow = document.body.classList.contains('navopen') ? 'hidden' : '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  document.addEventListener('click',function(e){
    var pb = e.target.closest('[data-phone]');
    if (pb){ phoneAction(); return; }
    var t = e.target.closest('[data-book]');
    if (t){ var v = t.getAttribute('data-book'); openModal(v!=='' && v!==null && !isNaN(+v) ? +v : null); return; }
    if (e.target === modal || e.target.closest('#mx')){ closeModal(); return; }
    var c = e.target.closest('[data-copy]');
    if (c){
      var done = function(){c.classList.add('done');setTimeout(function(){c.classList.remove('done');},1400);};
      try{ navigator.clipboard.writeText(c.getAttribute('data-copy')).then(done,function(){}); }catch(err){}
    }
  });
  document.addEventListener('keydown',function(e){
    if (e.key!=='Escape') return;
    if (modal.classList.contains('open')) closeModal(); else setNav(false);
  });

  /* шапка и нижняя панель на скролле */
  var topbar = document.querySelector('.top'), dock = document.querySelector('.dock');
  function onScroll(){
    var y = window.scrollY || document.documentElement.scrollTop || 0;
    topbar.classList.toggle('solid', y > 24);
    dock.classList.toggle('on', y > window.innerHeight * .55);
  }
  window.addEventListener('scroll', onScroll, {passive:true}); onScroll();

  /* hero */
  var stage = document.getElementById('stage');
  var rig = document.getElementById('rig');
  stage.addEventListener('click',function(){stage.classList.toggle('is-open');});
  var hero = document.querySelector('.hero');
  hero.addEventListener('pointermove',function(e){
    if (e.pointerType==='touch') return;
    var r = hero.getBoundingClientRect();
    rig.style.setProperty('--mx', ((e.clientX-r.left)/r.width-.5)*2);
    rig.style.setProperty('--my', ((e.clientY-r.top)/r.height-.5)*2);
  });
  hero.addEventListener('pointerleave',function(){rig.style.setProperty('--mx',0);rig.style.setProperty('--my',0);});
})();
