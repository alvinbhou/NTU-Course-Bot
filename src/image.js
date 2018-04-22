const randomImg = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)];
}
const icons = {
    bank: 'https://i.imgur.com/cwywVgY.png',
    yellow_search: 'https://i.imgur.com/cRlJ4XB.png',
    red_search: 'https://i.imgur.com/G9ZuDVY.png',
    book: 'https://i.imgur.com/DsgXeak.png',
    github: 'https://i.imgur.com/XiNg4rj.png'

}
const gakki = [ 
    'https://i.imgur.com/parFegj.jpg',
    'https://i.imgur.com/SM3CKNW.png', 
    'https://i.imgur.com/bPJy43V.jpg', 
    'https://i.imgur.com/tQZ5sZL.jpg',
    'https://i.imgur.com/VzNZdTZ.jpg',
    'https://i.imgur.com/Im8A4Tk.jpg',
    'https://i.imgur.com/tWwIuol.jpg',
    'https://i.imgur.com/Q8o2POI.jpg',
    'https://i.imgur.com/2SUHpSl.jpg',
    'https://i.imgur.com/0nPgsUQ.jpg',
    'https://i.imgur.com/CM73BPh.jpg',
    'https://i.imgur.com/yTnFnp8.jpg',
    'https://i.imgur.com/dGhcTr1.jpg',
    'https://i.imgur.com/dKxO2Aj.jpg',
    'https://i.imgur.com/F6B1vwK.jpg',
    'https://i.imgur.com/seRYeUw.jpg',
    'https://i.imgur.com/xHe3Xl6.jpg',
    'https://i.imgur.com/40jR5XN.jpg',
    'https://i.imgur.com/EVyff9x.jpg',
    'https://i.imgur.com/oQ29dOF.jpg',
    'https://i.imgur.com/KSeNTo9.jpg',
    'https://i.imgur.com/A18se3j.jpg',
    'https://i.imgur.com/5chHngn.jpg',
    'https://i.imgur.com/wuzMAqL.jpg',
    'https://i.imgur.com/wuzMAqL.jpg',
    'https://i.imgur.com/j084DVZ.jpg',
    'https://i.imgur.com/VrPQnea.jpg',
    'https://i.imgur.com/CndHEtq.jpg',
    'https://i.imgur.com/QGPnHpM.jpg',
    'https://i.imgur.com/ZNuvu0q.jpg',
    'https://i.imgur.com/e2ej5Yn.jpg',
    'https://i.imgur.com/BjCojQX.jpg',
    'https://i.imgur.com/ickU6Sc.jpg',
    'https://i.imgur.com/39IOVkP.jpg',
    'https://i.imgur.com/1H0lwbp.jpg',
    'https://i.imgur.com/mN2Xnvs.jpg'
];

module.exports = {
    randomImg: randomImg,
    icons: icons,
    gakki: gakki
}