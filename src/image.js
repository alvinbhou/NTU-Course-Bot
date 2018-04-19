const randomImg = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)];
}
const icons = {
    bank: 'https://i.imgur.com/cwywVgY.png',
    yellow_search: 'https://i.imgur.com/cRlJ4XB.png',
    red_search: 'https://i.imgur.com/G9ZuDVY.png',
    book: 'https://i.imgur.com/DsgXeak.png'

}
const gakki = ['https://i.imgur.com/ryrS1Aw.jpg', 'https://i.imgur.com/parFegj.jpg', 'https://i.imgur.com/SM3CKNW.png', 'https://i.imgur.com/bPJy43V.jpg', 'https://i.imgur.com/tQZ5sZL.jpg'];

module.exports = {
    randomImg: randomImg,
    icons: icons,
    gakki: gakki
}