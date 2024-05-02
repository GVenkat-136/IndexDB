import { openDB } from 'idb';

const DB_NAME = 'myDatabase';
const STORE_NAME = 'myStore';

export async function openDatabase(action) {
    const db =  await openDB(DB_NAME, 1, {
        upgrade(db) {
           db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
        }
    });
    const tx = db.transaction(STORE_NAME,action)
    const store = tx.objectStore(STORE_NAME)
    return store
}


export async function addItem(item) {
    const db = await openDatabase('readwrite');
    await db.add(item);
}

export async function getAllItems() {
    const db = await openDatabase('readonly')
    return await db.getAll();
}

export async function deleteItem(deleteIndex){
    const db = await openDatabase('readwrite')
    return await db.delete(deleteIndex)
}

export async function getItem(key){
    const db = await openDatabase('readonly')
   return await db.get(key)
}

export async function editItem(item,key){
    item.id = key
    const db = await openDatabase('readwrite')
    return await db.put(item)
}