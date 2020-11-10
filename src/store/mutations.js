import * as types from './mutaions_types';

const mutaions = {
  [types.SET_BTNS] (state, btns){
    state.btns = btns;
  }
}

export default mutaions;
