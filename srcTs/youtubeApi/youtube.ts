/*
    For search by keyword use: 
    GET https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=dennis+lloyd&key=AIzaSyDEHVrShl-N08wj0l-FNqroQXgKsvsIhFk
    where q is the keyword
    Result: for extract the id of the video check if Result.id.videoId exists then take it.
    the link is: https://www.youtube.com/watch?v={{videoID}}

    For get details about a video use:
    GET https://www.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id={{videoID}}&key=AIzaSyDEHVrShl-N08wj0l-FNqroQXgKsvsIhFk

    For get all categories: https://www.googleapis.com/youtube/v3/videoCategories?part=snippet&regionCode=US&key=AIzaSyDEHVrShl-N08wj0l-FNqroQXgKsvsIhFk

*/

import request = require('request')
import { Video } from '../mongodb/models/video';

/*
    This method make request to support async & await
    by creating a promise for every request
*/

function doRequest(url:string):Promise<any>{
    return new Promise(function (resolve, reject) {
      request(url, function (error, res, body) {
        if (!error && res.statusCode == 200) {
          resolve(JSON.parse(body));
        } else {
          reject(error);
        }
      });
    });
  }
  

const getCategory = async (videoId:string)=>{
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=AIzaSyDEHVrShl-N08wj0l-FNqroQXgKsvsIhFk`
    const data:any = await doRequest(url);
    return data.items[0].snippet.categoryId;

}

const toSong = async (res:any):Promise<Video>=>{
    const obj:Video = new Video(res.snippet.title, res.snippet.channelTitle,res.id.videoId
        ,await getCategory(res.id.videoId))
    
    return obj;
}


export const serachByKeyword = async (keyword:string)=>{
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=${keyword}&key=AIzaSyDEHVrShl-N08wj0l-FNqroQXgKsvsIhFk`;
    let data:any =await doRequest(url)
    data = data.items.filter((x:any)=>x.id.videoId);
    let songs:Video[] = [];
    for(let song of data){
        const asSong:Video = await toSong(song);
        songs.push(asSong);
    }
    return songs;

}

export const getTupleCat = async():Promise<[number,string]>=>{
    const url = 'https://www.googleapis.com/youtube/v3/videoCategories?part=snippet&regionCode=US&key=AIzaSyDEHVrShl-N08wj0l-FNqroQXgKsvsIhFk'
    let data:any = await doRequest(url);
    data = data.items.map((x:any):[number,string]=>{
        return [+x.id,x.snippet.title]
    })
    return data;
}

export const getCat = async():Promise<number[]>=>{
    const url = 'https://www.googleapis.com/youtube/v3/videoCategories?part=snippet&regionCode=US&key=AIzaSyDEHVrShl-N08wj0l-FNqroQXgKsvsIhFk'
    let data:any = await doRequest(url);
    data = data.items.map((x:any):number=>{
        return (+x.id);
    })
    return data;
}