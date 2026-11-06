import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { constants } from 'node:fs';
import { dirname, join, extname } from 'node:path';
import { gunzipSync } from 'node:zlib';
const root=process.cwd(), dataDir=join(root,'data'), assetDir=join(root,'images','works'), jsonPath=join(dataDir,'works.json'), loaderPath=join(dataDir,'works.js');
const exists=async p=>{try{await access(p,constants.R_OK);return true}catch{return false}};
async function readOriginal(){
 const source=await readFile(loaderPath,'utf8'), match=source.match(/atob\('([A-Za-z0-9+/=]+)'\.slice\(0,-1\)/);
 if(!match) throw new Error('Could not find compressed Works payload.');
 const rows=JSON.parse(gunzipSync(Buffer.from(match[1].slice(0,-1),'base64')).toString('utf8'));
 if(!Array.isArray(rows)||!rows.length) throw new Error('Original Works data is empty.');
 return rows.map(([title,category,subcategory,image,date,url])=>({title,category,subcategory,sourceImage:image,image:null,date,url}));
}
function extension(type,url){const mime=(type||'').split(';')[0].trim().toLowerCase(), map={'image/jpeg':'.jpg','image/png':'.png','image/webp':'.webp','image/gif':'.gif','image/avif':'.avif'};if(map[mime])return map[mime];const ext=extname(new URL(url).pathname).toLowerCase();return ['.jpg','.jpeg','.png','.webp','.gif','.avif'].includes(ext)?(ext==='.jpeg'?'.jpg':ext):'.jpg';}
const items=await exists(jsonPath)?JSON.parse(await readFile(jsonPath,'utf8')):await readOriginal();
if(!Array.isArray(items)||!items.length)throw new Error('Works data is empty or invalid.');
await mkdir(assetDir,{recursive:true});const failures=[];
for(let i=0;i<items.length;i++){const item=items[i],source=item.sourceImage||(!String(item.image||'').startsWith('images/works/')?item.image:null);if(!source&&item.image&&await exists(join(root,item.image)))continue;if(!source){failures.push('Missing source URL: '+item.title);continue;}try{
 const response=await fetch(source,{headers:{'User-Agent':'Mozilla/5.0 (compatible; WWZPortfolioAssetMirror/1.0)','Referer':'https://www.zcool.com.cn/','Accept':'image/avif,image/webp,image/apng,image/*,*/*;q=0.8'},signal:AbortSignal.timeout(30000)});
 if(!response.ok)throw new Error('HTTP '+response.status);const type=response.headers.get('content-type')||'';if(!type.toLowerCase().startsWith('image/'))throw new Error('Not an image: '+type);
 const bytes=Buffer.from(await response.arrayBuffer());if(bytes.length<1024)throw new Error('Image response too small');const filename=String(i+1).padStart(3,'0')+extension(type,source),target=join(assetDir,filename);await mkdir(dirname(target),{recursive:true});await writeFile(target,bytes);item.sourceImage=source;item.image='images/works/'+filename;console.log('Mirrored '+(i+1)+'/'+items.length+': '+item.title);
}catch(error){failures.push('#'+(i+1)+' '+item.title+': '+error.message);console.error(failures.at(-1));}}
if(failures.length)throw new Error('Mirror incomplete ('+failures.length+'/'+items.length+'). Original loader was kept unchanged.');
await writeFile(jsonPath,JSON.stringify(items,null,2)+'\n');
await writeFile(loaderPath,["// Local repository-hosted Works gallery data.","window.WWZ_WORKS_READY = fetch('data/works.json', { cache: 'no-cache' }).then(response => {","  if (!response.ok) throw new Error('Works data request failed: ' + response.status);","  return response.json();","});",''].join('\n'));
console.log('Works assets ready: '+items.length+' local images.');