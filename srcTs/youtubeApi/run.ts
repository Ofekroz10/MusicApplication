import {serachByKeyword, getTupleCat} from './youtube'
import {Video} from '../mongodb/models/video'

getTupleCat().then((data:any)=>console.log(data))

serachByKeyword('dennis+loyd').then((data:Video[])=>{
    console.log(data);
}).catch((e)=>{
    console.log(e)
})




