(() => {
  const $ = id => document.getElementById(id);
  const grid=$('portfolioGrid'), count=$('worksCount'), search=$('worksSearch'), sort=$('worksSort');
  const dialog=$('imageViewer'), viewer=$('viewerImage'), stage=$('viewerStage'), status=$('viewerStatus');
  const zoom=$('viewerZoom'), previous=$('viewerPrevious'), next=$('viewerNext');
  if (!grid || !count || !search || !sort || !dialog || !viewer || !stage) return;

  let items=[], visible=[], current=0, opener=null, category='all', touchStart=null;
  const localImage = path => {
    const clean=String(path || '').replace(/^\/+/, '');
    return '/' + clean.split('/').map(encodeURIComponent).join('/');
  };
  const setZoom = enabled => {
    stage.classList.toggle('is-zoomed', enabled);
    zoom.setAttribute('aria-pressed', String(enabled));
    zoom.textContent=enabled ? '缩小' : '放大';
    stage.scrollTo(0,0);
  };
  const imageFailed = img => {
    img.classList.add('image-unavailable');
    img.alt=img.alt || '图片暂时无法显示';
    img.removeAttribute('src');
    const media=img.closest('.portfolio-media');
    if (media) {
      media.classList.add('image-unavailable');
      if (!media.querySelector('.image-fallback')) {
        const hint=document.createElement('span');
        hint.className='image-fallback';
        hint.textContent='图片暂时无法显示';
        media.append(hint);
      }
    }
  };
  const show = position => {
    if (!visible.length) return;
    current=(position+visible.length)%visible.length;
    const work=visible[current];
    setZoom(false);
    stage.setAttribute('aria-busy','true');
    status.textContent='图片载入中…';
    zoom.disabled=true;
    $('viewerTitle').textContent=work.title || '';
    $('viewerPosition').textContent=(current+1)+' / '+visible.length+' · '+(work.category || '')+' / '+(work.subcategory || '');
    $('viewerDate').textContent=work.date || '';
    $('viewerSource').href=work.url || '#';
    viewer.alt=work.title || '';
    viewer.onload=()=>{stage.setAttribute('aria-busy','false');status.textContent='';zoom.disabled=false;};
    viewer.onerror=()=>{stage.setAttribute('aria-busy','false');status.textContent='原图暂时无法载入';zoom.disabled=true;};
    viewer.src=localImage(work.image);
    previous.disabled=next.disabled=visible.length<2;
  };
  const makeCard = (work, position) => {
    const item=document.createElement('article');
    item.className='portfolio-item';
    item.dataset.category=work.category || '';
    const button=document.createElement('button');
    button.type='button';
    button.className='portfolio-card';
    button.setAttribute('aria-label','查看作品：'+(work.title || '未命名作品'));
    button.setAttribute('aria-haspopup','dialog');

    const media=document.createElement('span');
    media.className='portfolio-media';
    const img=document.createElement('img');
    img.className='portfolio-img';
    img.alt=work.title || '';
    img.width=800;
    img.height=600;
    img.loading=position<6 ? 'eager' : 'lazy';
    img.decoding='async';
    if (position<6) img.fetchPriority='high';
    img.addEventListener('error',()=>imageFailed(img),{once:true});
    img.src=localImage(work.image);
    media.append(img);

    const info=document.createElement('span');
    info.className='portfolio-info';
    const copy=document.createElement('span');
    const title=document.createElement('strong');
    const meta=document.createElement('small');
    const arrow=document.createElement('span');
    title.textContent=work.title || '';
    meta.textContent=[work.category,work.subcategory].filter(Boolean).join(' · ');
    arrow.className='portfolio-open';
    arrow.textContent='↗';
    copy.append(title,meta);
    info.append(copy,arrow);
    button.append(media,info);
    button.addEventListener('click',()=>{opener=button;show(visible.indexOf(work));dialog.showModal();});

    const source=document.createElement('a');
    source.className='portfolio-original';
    source.href=work.url || '#';
    source.target='_blank';
    source.rel='noopener noreferrer';
    source.textContent='打开站酷原作 ↗';
    item.append(button,source);
    return item;
  };
  const render = () => {
    const query=search.value.trim().toLowerCase();
    visible=items.filter(work=>
      (category==='all' || work.category===category) &&
      (!query || [work.title,work.category,work.subcategory].join(' ').toLowerCase().includes(query))
    );
    if (sort.value==='oldest') visible.reverse();
    const fragment=document.createDocumentFragment();
    visible.forEach((work,index)=>fragment.append(makeCard(work,index)));
    grid.replaceChildren(fragment);
    count.textContent='共 '+visible.length+' 件作品'+(query?' · 搜索结果':'');
    if (!visible.length) {
      const empty=document.createElement('p');
      empty.className='works-empty';
      empty.textContent='没有找到匹配的作品，试试其他关键词。';
      grid.append(empty);
    }
  };

  document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
    category=button.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
    render();
  }));
  search.addEventListener('input',render);
  sort.addEventListener('change',render);
  $('viewerClose').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',()=>{setZoom(false);opener?.focus({preventScroll:true});});
  previous.addEventListener('click',()=>show(current-1));
  next.addEventListener('click',()=>show(current+1));
  zoom.addEventListener('click',()=>setZoom(!stage.classList.contains('is-zoomed')));
  viewer.addEventListener('click',()=>{if(!zoom.disabled)zoom.click();});
  stage.addEventListener('click',event=>{if(event.target===stage)dialog.close();});
  dialog.addEventListener('keydown',event=>{
    if(stage.classList.contains('is-zoomed')) return;
    if(event.key==='ArrowLeft'||event.key==='ArrowRight'){
      event.preventDefault();
      show(current+(event.key==='ArrowLeft'?-1:1));
    }
  });
  stage.addEventListener('touchstart',event=>{
    touchStart=event.touches.length===1&&!stage.classList.contains('is-zoomed')
      ? {x:event.touches[0].clientX,y:event.touches[0].clientY} : null;
  },{passive:true});
  stage.addEventListener('touchend',event=>{
    if(!touchStart||!event.changedTouches.length) return;
    const dx=event.changedTouches[0].clientX-touchStart.x;
    const dy=event.changedTouches[0].clientY-touchStart.y;
    touchStart=null;
    if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.4) show(current+(dx<0?1:-1));
  },{passive:true});
  stage.addEventListener('touchcancel',()=>touchStart=null);

  Promise.resolve(window.WWZ_WORKS_READY)
    .then(data=>{
      items=Array.isArray(data)?data:[];
      if(!items.length) {
        count.textContent='作品数据载入失败，请刷新页面重试。';
        console.error('[WWZ Works] 未取得作品数据');
        return;
      }
      render();
    })
    .catch(error=>{
      count.textContent='作品数据载入失败，请稍后重试。';
      console.error('[WWZ Works] 页面初始化失败',error);
    });
})();
