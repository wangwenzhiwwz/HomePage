import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { constants } from 'node:fs';
import { dirname, join } from 'node:path';
import { runInNewContext } from 'node:vm';
import sharp from 'sharp';

const root=process.cwd();
const dataDir=join(root,'data');
const assetDir=join(root,'images','works');
const jsonPath=join(dataDir,'works.json');
const loaderPath=join(dataDir,'works.js');
const exists=async p=>{try{await access(p,constants.R_OK);return true}catch{return false}};

async function readOriginal(){
  const source=await readFile(loaderPath,'utf8');
  const context={window:{},atob,Blob,DecompressionStream,Response};
  runInNewContext(source,context);
  const rows=await context.window.WWZ_WORKS_READY;
  if(!Array.isArray(rows)||!rows.length)throw new Error('Could not decode the original Works data.');
  return rows.map((w,i)=>({
    ...w,
    sourceImage:w.sourceImage||w.image,
    image:w.image?.startsWith('images/works/')?w.image:`images/works/${String(i+1).padStart(3,'0')}.webp`
  }));
}

async function downloadImage(item,index){
  const target=join(root,item.image);
  if(await exists(target))return false;
  if(!item.sourceImage)throw new Error(`Missing source URL for work #${index+1}: ${item.title}`);
  const response=await fetch(item.sourceImage,{
    headers:{
      'User-Agent':'Mozilla/5.0 (compatible; WWZPortfolioAssetMirror/1.0)',
      'Referer':'https://www.zcool.com.cn/',
      'Accept':'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
    },
    signal:AbortSignal.timeout(30000)
  });
  if(!response.ok)throw new Error(`Image request failed (${response.status}) for #${index+1}: ${item.title}`);
  const type=response.headers.get('content-type')||'';
  if(!type.startsWith('image/'))throw new Error(`Non-image response for #${index+1}: ${type}`);
  const input=Buffer.from(await response.arrayBuffer());
  if(input.length<1024)throw new Error(`Image response is suspiciously small for #${index+1}`);
  const output=await sharp(input,{failOn:'error'})
    .rotate()
    .resize({width:1800,height:1800,fit:'inside',withoutEnlargement:true})
    .webp({quality:86,effort:5})
    .toBuffer();
  await mkdir(dirname(target),{recursive:true});
  await writeFile(target,output);
  console.log(`Mirrored ${index+1}/${items.length}: ${item.title} (${Math.round(output.length/1024)} KB)`);
  return true;
}

let items;
if(await exists(jsonPath)){
  items=JSON.parse(await readFile(jsonPath,'utf8'));
  if(!Array.isArray(items)||!items.length)throw new Error('data/works.json is empty or invalid.');
}else{
  items=await readOriginal();
}
await mkdir(assetDir,{recursive:true});
let downloaded=0;
const failures=[];
for(let i=0;i<items.length;i++){
  try{if(await downloadImage(items[i],i))downloaded++}
  catch(error){failures.push(error.message);console.error(error.message)}
}
if(failures.length){
  throw new Error(`Asset mirror incomplete: ${failures.length}/${items.length} images unavailable. Existing website data was not switched to local-only assets.`);
}
await writeFile(jsonPath,JSON.stringify(items,null,2)+'\n');
await writeFile(loaderPath,`// Local, repository-hosted Works gallery data.\nwindow.WWZ_WORKS_READY = fetch('data/works.json', { cache: 'no-cache' }).then(response => {\n  if (!response.ok) throw new Error('Works data request failed: ' + response.status);\n  return response.json();\n});\n`);
console.log(`Works assets ready: ${items.length} local images; ${downloaded} newly mirrored.`);
