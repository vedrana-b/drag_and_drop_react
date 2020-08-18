const axios = require('axios');

export function getRandomJokes() {
    return axios.get('https://api.icndb.com/jokes/random/3');
}

export function getJokeById(jokeId) {
    return axios.get('https://api.icndb.com/jokes/' + jokeId);
}