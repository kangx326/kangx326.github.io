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
function select(group, selected){document.querySelectorAll(group).forEach(button=>{const active=button===selected;button.classList.toggle('selected',active);button.setAttribute('aria-pressed',String(active));});}
function showDataset(name){
  const rows=reconstruction[name], max=Math.max(...rows.map(row=>row[1]));
  document.querySelector('#timing-chart').innerHTML=rows.map(([method,time])=>`<div class="time-row ${method==='Instant LiDAR'?'ours':''}"><span>${method}</span><div class="bar-track" aria-hidden="true"><div class="bar" style="width:${time/max*100}%"></div></div><span class="time-value">${time.toLocaleString('en-US')} s <small>(${(time/60).toFixed(1)} min)</small></span></div>`).join('');
  document.querySelector('#quality-table').innerHTML=rows.map(([method,time,cd,f])=>`<tr class="${method==='Instant LiDAR'?'ours':''}"><th scope="row">${method}</th><td>${time.toLocaleString('en-US')}</td><td>${cd.toFixed(3)}</td><td>${f.toFixed(3)}</td></tr>`).join('');
  document.querySelector('#quality-caption').textContent=`${name==='PAI'?'Physical AI (PAI)':name} · six-clip average · NVIDIA H20`;
}
function showQuery(name){
  const data=detection[name];
  document.querySelector('#detection-table').innerHTML=data.rows.map(([method,vehicle,pedestrian])=>`<tr class="${method==='Instant LiDAR'?'ours':''}"><th scope="row">${method}</th><td>${(vehicle*100).toFixed(1)}</td><td>${(pedestrian*100).toFixed(1)}</td></tr>`).join('');
  document.querySelector('#detection-caption').textContent=`Waymo · ${data.label} · ${data.count} queries · LEVEL 1 AP (%)`;
  document.querySelector('#query-note').textContent=data.note;
}
document.querySelectorAll('[data-dataset]').forEach(button=>button.addEventListener('click',()=>{select('[data-dataset]',button);showDataset(button.dataset.dataset);}));
document.querySelectorAll('[data-query]').forEach(button=>button.addEventListener('click',()=>{select('[data-query]',button);showQuery(button.dataset.query);}));
document.querySelectorAll('[data-time]').forEach(button=>button.addEventListener('click',()=>{
  const video=document.querySelector('#workflow-video');
  const seek=()=>{video.currentTime=Number(button.dataset.time);video.play().catch(()=>{video.focus();});};
  if(video.readyState>=1)seek();
  else{video.addEventListener('loadedmetadata',seek,{once:true});video.load();}
}));
document.querySelector('#copy-citation').addEventListener('click',async()=>{
  const code=document.querySelector('#citation'),status=document.querySelector('#copy-status');
  try{await navigator.clipboard.writeText(code.innerText);status.textContent='Citation copied.';}
  catch{const range=document.createRange();range.selectNodeContents(code);const selection=getSelection();selection.removeAllRanges();selection.addRange(range);status.textContent='Citation selected. Press Ctrl+C or ⌘C to copy.';}
});
showDataset('Waymo');showQuery('shifted');
