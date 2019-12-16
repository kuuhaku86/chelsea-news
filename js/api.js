const base_url = "https://api.football-data.org/v2/";
const api_token = '0efefcbdc5d349edb1464616a9f4048d';
const team_id = 61;
const league_id = 2021;
const standings = base_url + "competitions/" + league_id + "/standings";
const team_matches = base_url + "teams/" + team_id + "/matches?status=SCHEDULED";

// import { openDB, deleteDB, wrap, unwrap } from 'idb';

// const db = await openDB('mydatabase',1);

window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || {READ_WRITE: "readwrite"};
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

var db,objectStore;
var request = window.indexedDB.open("mydatabase");
request.onerror = function(event) {
    console.log("Error not allowed");
};

// const store = db.transaction('matches').objectStore('matches');

request.onupgradeneeded = function(event) { 
    db = event.target.result;
    objectStore = db.createObjectStore("matches", {autoincrement:true});
};

function fetchApi(url) {
    return fetch(url, {
        method: "get",
        mode: "cors",
        headers: {
            'X-Auth-Token': api_token,
        }
    });
}


function status(response) {
    if (response.status !== 200) {
        console.log("Error : " + response.status);
        return Promise.reject(new Error(response.statusText));
    } else {
        return Promise.resolve(response);
    }
}

function json(response) {
    return response.json();
}

function error(error) {
    console.log("Error : " + error);
}

function getMatches() {
    if ("caches" in window) {
        caches.match(team_matches).then(function(response) {
        if (response) {
            response.json().then(function(data) {
                makeMatches(data);
            });
        }
        });
    }

    fetchApi(team_matches)
        .then(status)
        .then(json)
        .then(function(data) {
            makeMatches(data);
        })
        .catch(error);
}

let i = 0;

function getStandings() {
    if ("caches" in window) {
        caches.match(standings).then(function(response) {
        if (response) {
            response.json().then(function(data) {
                makeStandings(data);
            });
        }
        });
    }

    fetchApi(standings)
        .then(status)
        .then(json)
        .then(function(data) {
            makeStandings(data);
    })
    .catch(error);
}

var addDB = e => {
    console.log(e.target.getAttribute('data-match'));
    objectStore.add(e.target.getAttribute('data-match'));
}

function makeMatches(data) {
    let matchesHTML = "";
    let i = 0;
    data.matches.forEach(function(match) {
        matchesHTML += `
        <div class="col s12 m6">
            <h2 class="header"></h2>
            <div class="card horizontal">
                <div class="card-stacked">
                    <div class="card-content">
                        <p id="home-team">${match.homeTeam.name}</p><p> vs </p><p id="away-team">${match.awayTeam.name}</p><br>
                        <p>Competition : </p><p id="competition">${match.competition.name}</p><br>
                        <p>Date : </p><p id="date">${match.utcDate}</p>
                    </div>
                    <div class="card-action">
                        <a href="#" >
                            <button type="button" 
                            class="btn btn-default" 
                            onclick="db.transaction(['matches'],'readwrite').objectStore('matches').add('${match.homeTeam.name},${match.awayTeam.name},${match.competition.name},${match.utcDate}',${i})" >Add to Favorites
                            </button>
                        </a>
                    </div>
                </div>
            </div>
        </div>
        `;
        i++;
    });
    document.getElementById("row-matches").innerHTML = matchesHTML;
}

function makeStandings(data) {
    let standingsHTML = "";
    data.standings[0].table.forEach(function(team) {
        standingsHTML += `
            <tr>
                <td>${team.position}</td>
                <td>${team.team.name}</td>
                <td>${team.playedGames}</td>
                <td>${team.won}</td>
                <td>${team.draw}</td>
                <td>${team.lost}</td>
                <td>${team.goalDifference}</td>
                <td>${team.points}</td>
            </tr>
        `;
    });

    document.getElementById("standings-body").innerHTML = standingsHTML;
}

function deleteData(key) {
    let db = window.indexedDB.open('mydatabase');
    var database;
    db.onsuccess = function(e) {
        database = e.target.result;
        var objectStore = database.transaction('matches','readwrite').objectStore("matches");
        objectStore.delete(key);
    }
}

function getFavorites() {

    let db = window.indexedDB.open('mydatabase');
    var database;
    db.onsuccess = function(e) {
        database = e.target.result;
        var objectStore = database.transaction('matches','readwrite').objectStore("matches");
        let matchesHTML = "";
        objectStore.openCursor().onsuccess = function(e) {
            var cursor = e.target.result;
            if(cursor) {
                var data = cursor.value.split(',');
                var key = cursor.key;
                console.log(key);
                cursor.continue();
                matchesHTML += `
                <div class="col s12 m6">
                    <h2 class="header"></h2>
                    <div class="card horizontal">
                        <div class="card-stacked">
                            <div class="card-content">
                                <p id="home-team">${data[0]}</p><p> vs </p><p id="away-team">${data[1]}</p><br>
                                <p>Competition : </p><p id="competition">${data[2]}</p><br>
                                <p>Date : </p><p id="date">${data[3]}</p>
                            </div>
                            <div class="card-action">
                                <a href="#" >
                                    <button type="button" 
                                    class="btn btn-default" 
                                    onclick="deleteData(${key});window.location.reload(false);" >Delete This
                                    </button>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                `;
            }else{
                document.getElementById("row-matches2").innerHTML = matchesHTML;
            }
        }
    }
    db.onupgradeneeded = function(e) {
        database = e.target.result.createObjectStore('matches',{autoincrement : true});
    }
    db.onerror = function(e) {
        console.log("error");
    }
}