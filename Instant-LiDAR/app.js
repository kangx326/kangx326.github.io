'use strict';
// Reported paper values; AP is displayed as a percentage, not an APH score.
const reconstruction = {
  Waymo: [
    ['Instant LiDAR',66,.276,.466],['NuRec',4802,.141,.641],
    ['LiDAR-GS',6315,.176,.581],['SplatAD',3318,.216,.417],['LiDAR-EVS',3547,.222,.431],
  ],
  PAI: [
    ['Instant LiDAR',127,.275,.495],['NuRec',5875,.229,.513],
    ['LiDAR-GS',5818,.258,.455],['SplatAD',4214,.336,.352],['LiDAR-EVS',4702,.356,.340],
  ],
};
const detection = {
  shifted: {label:'3 m left shift', count:314, rows:[['NuRec',.247,.053],['LiDAR-GS',.341,.120],['SplatAD',.258,.110],['LiDAR-EVS',.357,.212],['Instant LiDAR',.434,.266]], note:'The sensor is shifted 3 m left while timestamps, headings, actor states, and the detector remain fixed. Scores pool six Waymo sequences. There is no measured ground-truth scan at the shifted pose.'},
  heldout: {label:'Held-out frames',count:24,rows:[['NuRec',.445,.250],['LiDAR-GS',.439,.154],['SplatAD',.438,.225],['LiDAR-EVS',.419,.270],['Instant LiDAR',.524,.336]],note:'24 held-out queries on the recorded trajectory, disjoint from the conditioning frames, pooled across six Waymo sequences. The same frozen CenterPoint detector is used for every reconstruction.'},
  conditioning: {label:'Conditioning frames',count:290,rows:[['NuRec',.569,.443],['LiDAR-GS',.501,.249],['SplatAD',.430,.226],['LiDAR-EVS',.399,.264],['Instant LiDAR',.516,.458]],note:'290 input frames on the recorded trajectory, pooled across six Waymo sequences. These are conditioning views, not held-out or laterally shifted queries.'},
};
function select(group, selected){document.querySelectorAll(group).forEach(b=>{const active=b===selected;b.classList.toggle('selected',active);b.setAttribute('aria-pressed',String(active));});}
function showDataset(name){
 const rows=reconstruction[name],max=Math.max(...rows.map(r=>r[1]));
 document.querySelector('#timing-chart').innerHTML=rows.map(([method,time])=>`<div class="time-row ${method==='Instant LiDAR'?'ours':''}"><span>${method}</span><div class="bar-track" aria-hidden="true"><div class="bar" style="width:${time/max*100}%"></div></div><span class="time-value">${time.toLocaleString('en-US')} s</span></div>`).join('');
 document.querySelector('#time-dataset').textContent=(name==='PAI'?'Physical AI':'Waymo')+' average';document.querySelector('#time-seconds').textContent=rows[0][1];document.querySelector('#time-ratio').textContent=name==='PAI'?'~46×':'~70×';
 document.querySelector('#quality-table').innerHTML=rows.map(([m,t,cd,f])=>`<tr class="${m==='Instant LiDAR'?'ours':''}"><th scope="row">${m}</th><td>${t.toLocaleString('en-US')}</td><td>${cd.toFixed(3)}</td><td>${f.toFixed(3)}</td></tr>`).join('');document.querySelector('#quality-caption').textContent=`${name==='PAI'?'Physical AI (PAI)':name} · six-clip average · NVIDIA H20`;
}
function showQuery(name){
 const d=detection[name];document.querySelector('#detection-charts').innerHTML=['Vehicle','Pedestrian'].map((label,i)=>`<div class="detection-chart"><h3>${label} AP (%) <span aria-hidden="true">↑</span></h3>${d.rows.map(row=>`<div class="detection-row ${row[0]==='Instant LiDAR'?'ours':''}"><span>${row[0]}</span><div class="bar-track" aria-hidden="true"><div class="bar" style="width:${row[i+1]/.6*100}%"></div></div><span class="ap-value">${(row[i+1]*100).toFixed(1)}</span></div>`).join('')}<p class="chart-note">0–60% AP · same scale across settings</p></div>`).join('');
 document.querySelector('#detection-table').innerHTML=d.rows.map(([m,v,p])=>`<tr class="${m==='Instant LiDAR'?'ours':''}"><th scope="row">${m}</th><td>${(v*100).toFixed(1)}</td><td>${(p*100).toFixed(1)}</td></tr>`).join('');
 const context=`Waymo · ${d.label} · ${d.count} queries · LEVEL 1 AP (%)`;document.querySelector('#detection-caption').textContent=context;document.querySelector('#query-context').textContent=context;document.querySelector('#query-note').textContent=d.note;
 document.querySelector('#detection-takeaway').textContent={shifted:'Instant LiDAR leads both classes at the shifted viewpoint: +7.7 vehicle and +5.4 pedestrian AP points over LiDAR-EVS.',heldout:'On held-out frames, Instant LiDAR leads both classes: +7.9 vehicle and +8.6 pedestrian AP points over NuRec.',conditioning:'On input views, Instant LiDAR has the highest pedestrian AP. NuRec retains the highest vehicle AP.'}[name];
}
document.querySelectorAll('[data-dataset]').forEach(b=>b.addEventListener('click',()=>{select('[data-dataset]',b);showDataset(b.dataset.dataset);}));document.querySelectorAll('[data-query]').forEach(b=>b.addEventListener('click',()=>{select('[data-query]',b);showQuery(b.dataset.query);}));
const workflow=document.querySelector('#workflow-video');document.querySelectorAll('[data-time]').forEach(b=>b.addEventListener('click',()=>{const seek=()=>{workflow.currentTime=Number(b.dataset.time);workflow.play().catch(()=>workflow.focus());};if(workflow.readyState>=1)seek();else{workflow.addEventListener('loadedmetadata',seek,{once:true});workflow.load();}}));workflow.addEventListener('timeupdate',()=>{const chapters=[...document.querySelectorAll('[data-time]')];chapters.forEach((b,i)=>b.classList.toggle('active',workflow.currentTime>=+b.dataset.time&&(!chapters[i+1]||workflow.currentTime<+chapters[i+1].dataset.time)));});
document.querySelector('#copy-citation').addEventListener('click',async()=>{const code=document.querySelector('#citation'),status=document.querySelector('#copy-status');try{await navigator.clipboard.writeText(code.innerText);status.textContent='Citation copied.';}catch{const range=document.createRange();range.selectNodeContents(code);const selection=getSelection();selection.removeAllRanges();selection.addRange(range);status.textContent='Selected. Press Ctrl+C or ⌘C.';}});
// Stop off-screen video playback; the complete clips remain available on demand.
new IntersectionObserver(entries=>entries.forEach(e=>{if(!e.isIntersecting)e.target.pause();}),{threshold:0}).observe(document.querySelector('#comparison-video'));
showDataset('Waymo');showQuery('shifted');
