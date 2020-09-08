# About the project
PlayTube allows you to create easily and faster your custom playlists.
PlayTube suggests amazing features:
- Creating playlists from keywords.
- Creating playlists by category.
- Shuffling the playlist's videos.
- Statistical data about your playlists.
- And more...   
```diff
+ PlayTube includes only the server-side of the application
```
<h3>Build with</h3>
    
+ Node.js
+ TypeScript
+ MongoDB
+ YouTube API

**npm libraries:**
+ Express
+ Mongoose
+ Multer
+ Bcryptjs
+ Jsonwebtoken
+ Request
+ Validator
+ Sendgrid/mail

# User system
```diff
! PlayTube provides a login/register system using MongoDB for storing the user's data and JWT tokens for authorization.
```
Register example:   
```js
[POST] http://localhost:3000/users   
[Body]
{
	"name":"Ofek",
	"email":"ofekrozen209@gmail.com",
	"password": "3!4hfdk45d"
}
```
   
Login example:
```js
[POST] http://localhost:3000/users/login   
[Body]
{
	"email":"ofekrozen209@gmail.com",
	"password": "3!4hfdk45d"
}
```

Edit user's details:
```js
[PATCH] http://localhost:3000/users/me     
[Body]
{
  "name":"Ofek rozenkrantz",
	"email":"ofekrozen209@gmail.com",
	"password": "3!4hfdk45d"
}
```   
Set your avatar:
```diff
+ You can set an image to your user using [POST] /users/me/avatar. The image stored as a binary data (buffer) using multer.js
```
More information about user's system see [user.ts](https://github.com/Ofekroz10/MusicApplication/blob/master/srcTs/mongodb/models/user.ts) & [userRoute.ts](https://github.com/Ofekroz10/MusicApplication/blob/master/srcTs/routers/userRoute.ts)

# Playlists   
There are 2 types of playlists (maybe later will be added more):   
* PlayList- a simple playlist without any limitaion.    
* CategoryPlayList- all videos in this playlist must have the same category.

```diff
! All the requests must includes JWT token.
```

Create a playlist:
```js
[POST] http://localhost:3000/playList/new   
[Body]
{
	"name":"Dennis Lloyd playlist"
}
```
The name of the playlist must be unique (else you get an error).   
For creating categoryPlayList use [POST] http://localhost:3000/playList/newC   

<h4>Add videos to a playlist: </h4>      

You can add videos by 3 ways:    
* **Recommended** [PUT] http://localhost:3000/playList/:playlist_name/youtube/:keyword - for adding array of videos from youtube search results.   
Example:   
```diff
+ [POST] http://localhost:3000/playList/Dennis Lloyd playlist/youtube/dennis lloyd?limit=5  
```   
Results: 
```js
[
    {
        "_id": "5f556367b4d6af1ab0a03da1",
        "name": "Dennis Lloyd - Alien (Live at Mitzpe Ramon)",
        "channelName": "DennisLloydVEVO",
        "youtubeId": "tyHdtifvQz8",
        "categoryNum": 10
    },
    {
        "_id": "5f556367b4d6af1ab0a03da2",
        "name": "Dennis Lloyd - Alien (Official Audio)",
        "channelName": "DennisLloydVEVO",
        "youtubeId": "whbidPR4nVA",
        "categoryNum": 10
    },
    {
        "_id": "5f556367b4d6af1ab0a03da3",
        "name": "Dennis Lloyd – Alien (Official Video)",
        "channelName": "Dennis Lloyd",
        "youtubeId": "MOGKJdwVkIQ",
        "categoryNum": 10
    },
    {
        "_id": "5f556367b4d6af1ab0a03da4",
        "name": "Dennis Lloyd - GFY (Official Video)",
        "channelName": "DennisLloydVEVO",
        "youtubeId": "CIqiB9zSLmM",
        "categoryNum": 10
    },
    {
        "_id": "5f556367b4d6af1ab0a03da5",
        "name": "Dennis Lloyd - Unfaithful (Official Video)",
        "channelName": "DennisLloydVEVO",
        "youtubeId": "ehiNCZSvGzk",
        "categoryNum": 10
    }
]  
```   
* [PUT] http://localhost:3000/playList/:playlist_name/add - for adding a single video. 
* [PUT] http://localhost:3000/playList/:playlist_name/addSome - for adding an array of videos.

```diff
! You can add videos to a playlist only if they were not added before. Else you will get an error.
```
More information about add/delete videos/playlists see [playListRoute.ts](https://github.com/Ofekroz10/MusicApplication/blob/master/srcTs/routers/playListRoute.ts)   


```diff
! If you try to add a video from category X where the Category playlist defined with category Y you will fail.
```

Example:   

Create a category playlist where category = 20
```js
[POST] http://localhost:3000/playList/newC   
[Body]
{
	"name":"my movies",
	"category": 20
}
```
    
Add some songs ( category = 10 ) :
    
```js
[POST] http://localhost:3000/playList/my movies/youtube/Dennis Lloy    
```
   
Result:
```js
{
    "error": "cannot add video with category 10 to playlist with category 20"
}
```
   
<h4> Get your playlists: </h4>      
 
```js
[GET] http://localhost:3000/playList  
```   
Or get platlist by name:      
```js
[GET] http://localhost:3000/playList/:pName  
```   
Or get playlist by type [0=Playlist,1=CategoryPlaylist] :   
```js
[GET] http://localhost:3000/playList?type=0
```   

<h4> Statistics and additional information </h4>

If you want to get a summary about your playlists collection you can use:
```js
[GET] http://localhost:3000/playList/summary 
```  
Result:
```
{
    "PlayList": 3,
    "CategoryPlayList": 3
}
```
    
If you want more detailed summery use: (This request implemented by MapReduce function)
```js
[GET] http://localhost:3000/playList/extendedSummary 
```  
   
Results:
```js
{
    "results": [
        {
            "_id": "CategoryPlayList",
            "value": {
                "count": 2,
                "Playlists": [
                    {
                        "_id": "5f5568601e4a733f3c8cc4a4",
                        "itemtype": "CategoryPlayList",
                        "owner": "5f452451fc62181b80de92d3",
                        "videos": [],
                        "name": "my movies",
                        "category": 20,
                        "__v": 0
                    },
                    {
                        "_id": "5f54dc04e427cb398c54d68e",
                        "itemtype": "CategoryPlayList",
                        "owner": "5f452451fc62181b80de92d3",
                        "videos": [
                            {
                                "_id": "5f54dd1de427cb398c54d690",
                                "name": "my song",
                                "channelName": "my channelName",
                                "youtubeId": "123234df",
                                "categoryNum": 2
                            }
                        ],
                        "name": "1",
                        "category": 1,
                        "__v": 1
                    }
                ]
            }
        },
        {
            "_id": "PlayList",
            "value": {
                "count": 2,
                "Playlists": [
                    {
                        "_id": "5f55631fb4d6af1ab0a03da0",
                        "itemtype": "PlayList",
                        "owner": "5f452451fc62181b80de92d3",
                        "videos": [
                            {
                                "_id": "5f556367b4d6af1ab0a03da1",
                                "name": "Dennis Lloyd - Alien (Live at Mitzpe Ramon)",
                                "channelName": "DennisLloydVEVO",
                                "youtubeId": "tyHdtifvQz8",
                                "categoryNum": 10
                            },
                            {
                                "_id": "5f556367b4d6af1ab0a03da2",
                                "name": "Dennis Lloyd - Alien (Official Audio)",
                                "channelName": "DennisLloydVEVO",
                                "youtubeId": "whbidPR4nVA",
                                "categoryNum": 10
                            },
                            {
                                "_id": "5f556367b4d6af1ab0a03da3",
                                "name": "Dennis Lloyd – Alien (Official Video)",
                                "channelName": "Dennis Lloyd",
                                "youtubeId": "MOGKJdwVkIQ",
                                "categoryNum": 10
                            },
                            {
                                "_id": "5f556367b4d6af1ab0a03da4",
                                "name": "Dennis Lloyd - GFY (Official Video)",
                                "channelName": "DennisLloydVEVO",
                                "youtubeId": "CIqiB9zSLmM",
                                "categoryNum": 10
                            },
                            {
                                "_id": "5f556367b4d6af1ab0a03da5",
                                "name": "Dennis Lloyd - Unfaithful (Official Video)",
                                "channelName": "DennisLloydVEVO",
                                "youtubeId": "ehiNCZSvGzk",
                                "categoryNum": 10
                            }
                        ],
                        "name": "Dennis Lloyd list",
                        "__v": 1
                    },
                    {
                        "_id": "5f55575c7b7cf118ccfbe726",
                        "itemtype": "PlayList",
                        "owner": "5f452451fc62181b80de92d3",
                        "videos": [
                            {
                                "_id": "5f555a167b7cf118ccfbe727",
                                "name": "Undefined x Elegant Speech x Tip C  -  So Long prod KATO",
                                "channelName": "Undefined",
                                "youtubeId": "yp9Z9e6ZIs4",
                                "categoryNum": 10
                            },
                            {
                                "_id": "5f555a167b7cf118ccfbe728",
                                "name": "Undefined",
                                "channelName": "Jeremy Passion - Topic",
                                "youtubeId": "zRgfWSittxM",
                                "categoryNum": 10
                            },
                            {
                                "_id": "5f555a167b7cf118ccfbe729",
                                "name": "Undefined",
                                "channelName": "As I Lay Dying - Topic",
                                "youtubeId": "BqZbOcj7QxU",
                                "categoryNum": 10
                            },
                            {
                                "_id": "5f555a167b7cf118ccfbe72a",
                                "name": "Undefined",
                                "channelName": "Timotainment",
                                "youtubeId": "8FOrfPpnhFI",
                                "categoryNum": 23
                            },
                            {
                                "_id": "5f555a167b7cf118ccfbe72b",
                                "name": "Undefined - Episode 1",
                                "channelName": "WallStreet Entertainment",
                                "youtubeId": "jbnddQ9l0IA",
                                "categoryNum": 1
                            },
                            {
                                "_id": "5f555a167b7cf118ccfbe72c",
                                "name": "Strongman - Undefined",
                                "channelName": "Strongman Burner",
                                "youtubeId": "O0Xwl15bK10",
                                "categoryNum": 10
                            },
                            {
                                "_id": "5f5562d8b4d6af1ab0a03d9b",
                                "name": "Dennis Lloyd - Alien (Live at Mitzpe Ramon)",
                                "channelName": "DennisLloydVEVO",
                                "youtubeId": "tyHdtifvQz8",
                                "categoryNum": 10
                            },
                            {
                                "_id": "5f5562d8b4d6af1ab0a03d9c",
                                "name": "Dennis Lloyd - Alien (Official Audio)",
                                "channelName": "DennisLloydVEVO",
                                "youtubeId": "whbidPR4nVA",
                                "categoryNum": 10
                            },
                            {
                                "_id": "5f5562d8b4d6af1ab0a03d9d",
                                "name": "Dennis Lloyd – Alien (Official Video)",
                                "channelName": "Dennis Lloyd",
                                "youtubeId": "MOGKJdwVkIQ",
                                "categoryNum": 10
                            },
                            {
                                "_id": "5f5562d8b4d6af1ab0a03d9e",
                                "name": "Dennis Lloyd - GFY (Official Video)",
                                "channelName": "DennisLloydVEVO",
                                "youtubeId": "CIqiB9zSLmM",
                                "categoryNum": 10
                            },
                            {
                                "_id": "5f5562d8b4d6af1ab0a03d9f",
                                "name": "Dennis Lloyd - Unfaithful (Official Video)",
                                "channelName": "DennisLloydVEVO",
                                "youtubeId": "ehiNCZSvGzk",
                                "categoryNum": 10
                            }
                        ],
                        "name": "Dennis Lloyd playlist",
                        "__v": 2
                    }
                ]
            }
        }
    ],
    "stats": {}
}
```

# More Youtube Requests
List all the categories and there meaning:   
```js
[GET] http://localhost:3000/youtube/categories 
```  
Result:   
```
[
    [
        1,
        "Film & Animation"
    ],
    [
        2,
        "Autos & Vehicles"
    ],
    [
        10,
        "Music"
    ],
    [
        15,
        "Pets & Animals"
    ],
    [
        17,
        "Sports"
    ],
    [
        18,
        "Short Movies"
    ],
    [
        19,
        "Travel & Events"
    ],
    [
        20,
        "Gaming"
    ],
    [
        21,
        "Videoblogging"
    ],
    [
        22,
        "People & Blogs"
    ],
    [
        23,
        "Comedy"
    ],
    [
        24,
        "Entertainment"
    ],
    [
        25,
        "News & Politics"
    ],
    [
        26,
        "Howto & Style"
    ],
    [
        27,
        "Education"
    ],
    [
        28,
        "Science & Technology"
    ],
    [
        29,
        "Nonprofits & Activism"
    ],
    [
        30,
        "Movies"
    ],
    [
        31,
        "Anime/Animation"
    ],
    [
        32,
        "Action/Adventure"
    ],
    [
        33,
        "Classics"
    ],
    [
        34,
        "Comedy"
    ],
    [
        35,
        "Documentary"
    ],
    [
        36,
        "Drama"
    ],
    [
        37,
        "Family"
    ],
    [
        38,
        "Foreign"
    ],
    [
        39,
        "Horror"
    ],
    [
        40,
        "Sci-Fi/Fantasy"
    ],
    [
        41,
        "Thriller"
    ],
    [
        42,
        "Shorts"
    ],
    [
        43,
        "Shows"
    ],
    [
        44,
        "Trailers"
    ]
]
```

Get youtube search results as Video objects:   
```js
[GET] http://localhost:3000/youtube/search/Dennis Lloyd?limit=7
```

Results:
```
[
    {
        "name": "Dennis Lloyd - Alien (Live at Mitzpe Ramon)",
        "channelName": "DennisLloydVEVO",
        "youtubeId": "tyHdtifvQz8",
        "categoryNum": "10"
    },
    {
        "name": "Dennis Lloyd - Alien (Official Audio)",
        "channelName": "DennisLloydVEVO",
        "youtubeId": "whbidPR4nVA",
        "categoryNum": "10"
    },
    {
        "name": "Dennis Lloyd – Alien (Official Video)",
        "channelName": "Dennis Lloyd",
        "youtubeId": "MOGKJdwVkIQ",
        "categoryNum": "10"
    },
    {
        "name": "Dennis Lloyd - GFY (Official Video)",
        "channelName": "DennisLloydVEVO",
        "youtubeId": "CIqiB9zSLmM",
        "categoryNum": "10"
    },
    {
        "name": "Dennis Lloyd - Unfaithful (Official Video)",
        "channelName": "DennisLloydVEVO",
        "youtubeId": "ehiNCZSvGzk",
        "categoryNum": "10"
    },
    {
        "name": "Dennis Lloyd - Never Go Back (Official Video)",
        "channelName": "DennisLloydVEVO",
        "youtubeId": "lhGl9D514Bc",
        "categoryNum": "10"
    },
    {
        "name": "Dennis Lloyd - Leftovers (Official Video)",
        "channelName": "Dennis Lloyd",
        "youtubeId": "yNQr5A6voBg",
        "categoryNum": "10"
    }
]
```

# User's credits
Users can achieve credits. Every action: {create playlist, create category playlist, create a playlist from youtube search results ...} has a score, as much as more doing actions you achieve more credits.   
Action's score:   
```js
Create a playlist- 10
Add a video - 5
Add videos from youtube search results - 5 * videos.length + 2.5 * videos.length (bonus)

- If you undo an action you lose the action's credits.
```
   
Get the top 10 users according to there credits:   

```js
[GET] http://localhost:3000/users/credits
```
   
**When a user achieves 1000 credits, he is notified about this via email.**

```diff
- PlayTube can do more actions, explore more functions in the project ! 
```   

