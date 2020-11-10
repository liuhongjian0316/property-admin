import * as types from './mutaions_types'

export const changeType = function ({commit},{type}) {
  commit(types.SET_BTNS,type)
}
export const changeDate = function ({commit},{btns}) {
  setTimeout(function () {
    console.log("延时几秒");
    commit(types.SET_BTNS,1000)
  })
}
