/* [ EPOHOTO360 PLUGINS ]
* Jika kurang banyak tambahkan sendiri
* Ch :  https://whatsapp.com/channel/0029Vafqv9YCnA7wYTSDOI3F
* WM : skyzxu - [ share all code ]
*/

const axios = require('axios')
const FormData = require('form-data')
const cheerio = require("cheerio")
const util = require("util")

module.exports = (handler) => {
  handler.add({
    cmd: [
      'glitchtext', 'writetext', 'advancedglow', 'typographytext', 'pixelglitch',
      'neonglitch', 'flagtext', 'flag3dtext', 'deletingtext', 'blackpinkstyle',
      'glowingtext', 'underwatertext', 'logomaker', 'cartoonstyle', 'papercutstyle',
      'watercolortext', 'effectclouds', 'blackpinklogo', 'gradienttext', 'summerbeach',
      'luxurygold', 'multicoloredneon', 'sandsummer', 'galaxywallpaper', '1917style',
      'makingneon', 'royaltext', 'freecreate', 'galaxystyle', 'amongustext', 'rainytext', 'graffititext', 'colorfulltext', 'equalizertext', 'narutotext', 'angeltext', 'starsnight'
    ],
    cats: "Tools",
    // cmd yang diterima akan berurutan sesuai pada cmd di atas, contoh:
    // iterasi pertama - glitchtext
    // iterasi kedua   - writetext
    // iterasi ketiga  - advancedglow
    // Semua value - cmd, fcmd, cats
    alias: ({ cmd }) => toUpper(cmd), // cmd disini mengacu pada command di atas ^ jadi kita ambil lagi value cmdnya dan proses datanya
    desc: "Membuat foto text",
    owner: true,

    run: async ({ m, cmd, text, ditz }) => {
      if (!text) return m.reply("Mana teksnya?");

      const model = getModel(cmd);
      const image = await ephoto(model, text);

      await ditz.sendImage(m.chat, image, "Ini fotonya", m.fq);
    }
  })
}

// Jadikan huruf pertama sebagai kapital untuk alias
// Kenapa gak langsung aja bang tulis aliasnya? ya itu juga bisa, tapi masa iya harus satu satu masangin alias untuk masing masing commandnya?
// contoh kalo manual:
// cmd: ["glitchtext"],
// alias: "Glitchtext"

// cmd: ["writetext"],
// alias: "Writetext"

// cmd: ["advancedglow"],
// alias: "Advancedglow"
// dan seterusnya. Otomatis harus buat file plugin yang banyak atau numpukin semua plugin dalam satu file kan?

// Kalo semisal kamu ngalamin hal yang serupa kayak plugin ephoto ini yang harus di satuin semua cmdnya, yaudah pake fungsi aja di alias atau di descnya
function toUpper(cmd) {
  return cmd.charAt(0).toUpperCase() + cmd.slice(1);
}

async function ephoto(url, textInput) {
  let formData = new FormData()

  let initialResponse = await axios.get(url, {
    headers: {
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0 Win64 x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36'
    }
  })

  let $ = cheerio.load(initialResponse.data)

  let token = $('input[name=token]').val()
  let buildServer = $('input[name=build_server]').val()
  let buildServerId = $('input[name=build_server_id]').val()
  formData.append('text[]', textInput)
  formData.append('token', token)
  formData.append('build_server', buildServer)
  formData.append('build_server_id', buildServerId)
  let postResponse = await axios({
    url: url,
    method: 'POST',
    data: formData,
    headers: {
      'Accept': '/',
      'Accept-Language': 'en-US,enq=0.9',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0 Win64 x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
      'cookie': initialResponse.headers['set-cookie']?.join(' '),
      ...formData.getHeaders()
    }
  })
  let $$ = cheerio.load(postResponse.data)
  let formValueInput = JSON.parse($$('input[name=form_value_input]').val())
  formValueInput['text[]'] = formValueInput.text
  delete formValueInput.text
  let { data: finalResponseData } = await axios.post('https://en.ephoto360.com/effect/create-image', new URLSearchParams(formValueInput), {
    headers: {
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0 Win64 x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
      'cookie': initialResponse.headers['set-cookie'].join(' ')
    }
  })

  return buildServer + finalResponseData.image
}

function getModel(command) {
  let model;

  if (/glitchtext/.test(command)) model = 'https://en.ephoto360.com/create-digital-glitch-text-effects-online-767.html'
  if (/writetext/.test(command)) model = 'https://en.ephoto360.com/write-text-on-wet-glass-online-589.html'
  if (/advancedglow/.test(command)) model = 'https://en.ephoto360.com/advanced-glow-effects-74.html'
  if (/typographytext/.test(command)) model = 'https://en.ephoto360.com/create-typography-text-effect-on-pavement-online-774.html'
  if (/pixelglitch/.test(command)) model = 'https://en.ephoto360.com/create-pixel-glitch-text-effect-online-769.html'
  if (/neonglitch/.test(command)) model = 'https://en.ephoto360.com/create-impressive-neon-glitch-text-effects-online-768.html'
  if (/flagtext/.test(command)) model = 'https://en.ephoto360.com/nigeria-3d-flag-text-effect-online-free-753.html'
  if (/flag3dtext/.test(command)) model = 'https://en.ephoto360.com/free-online-american-flag-3d-text-effect-generator-725.html'
  if (/deletingtext/.test(command)) model = 'https://en.ephoto360.com/create-eraser-deleting-text-effect-online-717.html'
  if (/blackpinkstyle/.test(command)) model = 'https://en.ephoto360.com/online-blackpink-style-logo-maker-effect-711.html'
  if (/glowingtext/.test(command)) model = 'https://en.ephoto360.com/create-glowing-text-effects-online-706.html'
  if (/underwatertext/.test(command)) model = 'https://en.ephoto360.com/3d-underwater-text-effect-online-682.html'
  if (/logomaker/.test(command)) model = 'https://en.ephoto360.com/free-bear-logo-maker-online-673.html'
  if (/cartoonstyle/.test(command)) model = 'https://en.ephoto360.com/create-a-cartoon-style-graffiti-text-effect-online-668.html'
  if (/papercutstyle/.test(command)) model = 'https://en.ephoto360.com/multicolor-3d-paper-cut-style-text-effect-658.html'
  if (/watercolortext/.test(command)) model = 'https://en.ephoto360.com/create-a-watercolor-text-effect-online-655.html'
  if (/effectclouds/.test(command)) model = 'https://en.ephoto360.com/write-text-effect-clouds-in-the-sky-online-619.html'
  if (/blackpinklogo/.test(command)) model = 'https://en.ephoto360.com/create-blackpink-logo-online-free-607.html'
  if (/gradienttext/.test(command)) model = 'https://en.ephoto360.com/create-3d-gradient-text-effect-online-600.html'
  if (/summerbeach/.test(command)) model = 'https://en.ephoto360.com/write-in-sand-summer-beach-online-free-595.html'
  if (/luxurygold/.test(command)) model = 'https://en.ephoto360.com/create-a-luxury-gold-text-effect-online-594.html'
  if (/multicoloredneon/.test(command)) model = 'https://en.ephoto360.com/create-multicolored-neon-light-signatures-591.html'
  if (/sandsummer/.test(command)) model = 'https://en.ephoto360.com/write-in-sand-summer-beach-online-576.html'
  if (/galaxywallpaper/.test(command)) model = 'https://en.ephoto360.com/create-galaxy-wallpaper-mobile-online-528.html'
  if (/1917style/.test(command)) model = 'https://en.ephoto360.com/1917-style-text-effect-523.html'
  if (/makingneon/.test(command)) model = 'https://en.ephoto360.com/making-neon-light-text-effect-with-galaxy-style-521.html'
  if (/royaltext/.test(command)) model = 'https://en.ephoto360.com/royal-text-effect-online-free-471.html'
  if (/freecreate/.test(command)) model = 'https://en.ephoto360.com/free-create-a-3d-hologram-text-effect-441.html'
  if (/galaxystyle/.test(command)) model = 'https://en.ephoto360.com/create-galaxy-style-free-name-logo-438.html'
  if (/amongustext/.test(command)) model = 'https://en.ephoto360.com/create-a-cover-image-for-the-game-among-us-online-762.html'
  if (/rainytext/.test(command)) model = 'https://en.ephoto360.com/foggy-rainy-text-effect-75.html'
  if (/graffititext/.test(command)) model = 'https://en.ephoto360.com/graffiti-color-199.html'
  if (/colorfulltext/.test(command)) model = 'https://en.ephoto360.com/create-colorful-neon-light-text-effects-online-797.html#google_vignette'
  if (/equalizertext/.test(command)) model = 'https://en.ephoto360.com/music-equalizer-text-effect-259.html'
  if (/narutotext/.test(command)) model = 'https://en.ephoto360.com/naruto-shippuden-logo-style-text-effect-online-808.html'
  if (/angeltext/.test(command)) model = 'https://en.ephoto360.com/angel-wing-effect-329.html'
  if (/starsnight/.test(command)) model = 'https://en.ephoto360.com/stars-night-online-1-85.html'

  return model;
}