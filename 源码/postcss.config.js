import px2rem from './postcss-px2rem.cjs'
import autoprefixer from 'autoprefixer'

export default {
  plugins: [
    px2rem({
      rootValue: 16,
      unitPrecision: 5,
      propList: ['*'],
      selectorBlackList: ['.norem'],
      minPixelValue: 2
    }),
    autoprefixer()
  ]
}
