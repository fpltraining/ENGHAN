/* Toàn bộ trạng thái + nhật ký ôn được ghi nguyên tử trong một giao dịch IndexedDB. */
const MindStore=(()=>{
  let dbPromise=null,chain=Promise.resolve(),status='Chưa lưu';
  function open(){
    if(!dbPromise)dbPromise=new Promise((resolve,reject)=>{
      const r=indexedDB.open('inklish-mindflash',1);
      r.onupgradeneeded=()=>r.result.createObjectStore('state');
      r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);
      r.onblocked=()=>reject(new Error('Hãy đóng bản Inklish ở tab khác rồi thử lại'));
    });return dbPromise;
  }
  async function read(){const db=await open();return new Promise((resolve,reject)=>{const r=db.transaction('state').objectStore('state').get('main');r.onsuccess=()=>resolve(r.result||null);r.onerror=()=>reject(r.error);});}
  function write(state){
    const snapshot=structuredClone(state);
    const job=chain.catch(()=>{}).then(async()=>{const db=await open();await new Promise((resolve,reject)=>{const tx=db.transaction('state','readwrite');tx.objectStore('state').put(snapshot,'main');tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||new Error('Lưu dữ liệu bị hủy'));});status='Đã lưu trên thiết bị';return snapshot;});
    chain=job;return job.catch(e=>{status='Chưa lưu được';throw e;});
  }
  return {read,write,flush:()=>chain,get status(){return status;}};
})();
