import {readFileSync,readdirSync,existsSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {Script} from 'node:vm';
import {spawnSync} from 'node:child_process';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const errors=[];let pages=0,scripts=0;
function walk(dir){for(const e of readdirSync(dir,{withFileTypes:true})){
  if(e.name.startsWith('.')||e.name==='node_modules')continue;
  const p=resolve(dir,e.name);
  if(e.isDirectory()){walk(p);continue;}
  if(!/\.(html|js)$/.test(p))continue;
  const s=readFileSync(p,'utf8');
  if(p.endsWith('.js')){
    const result=spawnSync(process.execPath,['--input-type=module','--check'],{input:s,encoding:'utf8'});
    if(result.status!==0)errors.push(p+': '+result.stderr);else scripts++;
    continue;
  }
  pages++;
  for(const m of s.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)){
    if(/type=["'](?:module|application\/ld\+json)/.test(m[1]))continue;
    try{new Script(m[2]);}catch(e){errors.push(p+': '+e.message);}
  }
  const html=s.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'');
  for(const m of html.matchAll(/(?:src|href)=["']([^"']+)["']/g)){
    const v=m[1];if(/^(?:[a-z]+:|\/\/|#)/i.test(v)||v.includes('${'))continue;
    const target=resolve(dirname(p),decodeURIComponent(v.split(/[?#]/)[0]));
    if(!existsSync(target))errors.push(p+': missing '+v);
  }
  if(/user-scalable=no/.test(s))errors.push(p+': zoom disabled');
}}
walk(root);
if(errors.length){console.error(errors.join('\n'));process.exit(1);}
console.log(`Passed: ${pages} pages, ${scripts} scripts, inline syntax and local asset links.`);
