import ajaxLib from '../../lib/ajax';
const ajax = ajaxLib.ajax;
const url = 'https://m.yixiutech.com';



//通过openid查询用户信息
export function getuserinforByopenId(openId){
  return new Promise((resolve, reject) => {
    ajax.get(url + '/user/openid/' + openId).then((res) => {
      resolve(res);
    }).then((err) => {
      reject(err);
    });
  });
}
//通过id查询用户信息
export function getuserinforById(id){
  return new Promise((resolve, reject) => {
    ajax.get(`${url}/user/${id}`).then((res) => {
      resolve(res);
    }).then((err) => {
      reject(err);
    });
  });
}

//根据微信信息注册用户
export function reguser(data){
  return new Promise((resolve, reject) => {
    ajax.post(url + '/user/reg/', data).then((res) => {
      resolve(res);
    }).then((err) => {
      reject(err);
    });
  });
}

//更新用户信息
export function updateuserinfo(data){
  return new Promise((resolve, reject) => {
    ajax.post(url + '/user/update', data).then((res) => {
      resolve(res);
    }).then((err) => {
      reject(err);
    });
  });
}

//  确认下单
export function sureOrder(data) {
  return new Promise((resolve, reject) => {
    ajax.post(`${url}/order/service`, data).then((res) => {
      resolve(res);
    }).then((err) => {
      reject(err);
    })
  })
}
// 获取地址列表
export function getaddressById(id){
  return new Promise((resolve, reject) => {
    ajax.get(`${url}/address/user/${id}`).then((res) => {
      resolve(res);
    }).then((err) => {
      reject(err);
    });
  });
}


// 添加地址
export function addAddress(data){
  return new Promise((resolve, reject) => {
    ajax.post(`${url}/address`, data).then((res) => {
      resolve(res);
    }).then((err) => {
      reject(err);
    });
  });
}


// 更新地址
export function editAddress(data){
  return new Promise((resolve, reject) => {
    ajax.post(`${url}/address/update`, data).then((res) => {
      resolve(res);
    }).then((err) => {
      reject(err);
    });
  });
}

// 删除地址
export function delAddress(id){
  return new Promise((resolve, reject) => {
    ajax.get(`${url}/address/delete/${id}`).then((res) => {
      resolve(res);
    }).then((err) => {
      reject(err);
    });
  });
}

// 发起问题
export function addNewQuestion(data){
  return new Promise((resolve, reject) => {
    ajax.post(`${url}/question`,data).then((res) => {
      resolve(res);
    }).then((err) => {
      reject(err);
    });
  });
}

// 根据筛选条件获取问题详情
export function getQuestionList(data){
  return new Promise((resolve, reject) => {
    ajax.post(`${url}/question/filter`,data).then((res) => {
      resolve(res);
    }).then((err) => {
      reject(err);
    });
  });
}

// 回复问题
export function replyQuestion(data){
  return new Promise((resolve, reject) => {
    ajax.post(`${url}/question/reply`,data).then((res) => {
      resolve(res);
    }).then((err) => {
      reject(err);
    });
  });
}

// 通过ID查询个人问题
export function getQuestionListById(id){
  return new Promise((resolve, reject) => {
    ajax.get(`${url}/question/user/${id}`).then((res) => {
      resolve(res);
    }).then((err) => {
      reject(err);
    });
  });
}

// 通过ID查询问题详情
export function getQuestionByQid(id){
  return new Promise((resolve, reject) => {
    ajax.get(`${url}/question/${id}`).then((res) => {
      resolve(res);
    }).then((err) => {
      reject(err);
    });
  });
}

// 通过id查询问题的回复列表
export function getQAListByQid(id){
  return new Promise((resolve, reject) => {
    ajax.get(`${url}/question/reply/${id}`).then((res) => {
      resolve(res);
    }).then((err) => {
      reject(err);
    });
  });
}

// 修改问题信息
export function updateQuestion(data){
  return new Promise((resolve, reject) => {
    ajax.post(`${url}/question/update`,data).then((res) => {
      resolve(res);
    }).then((err) => {
      reject(err);
    });
  });
}

// 给评论点赞
export function likethis(id){
  return new Promise((resolve, reject) => {
    ajax.get(`${url}/question/reply/like/${id}`).then((res) => {
      resolve(res);
    }).then((err) => {
      reject(err);
    });
  });
}


// 采纳答案
export function adoptThis(data){
  return new Promise((resolve, reject) => {
    ajax.post(`${url}/question/adopt/`,data).then((res) => {
      resolve(res);
    }).then((err) => {
      reject(err);
    });
  });
}

// 发生验证短信
export function sendmessage(data){
  return new Promise((resolve, reject) => {
    ajax.post(`${url}/sms/send`,data).then((res) => {
      resolve(res);
    }).then((err) => {
      reject(err);
    });
  });
}

// 验证手机号和验证码
export function validatemessage(data){
  return new Promise((resolve, reject) => {
    ajax.post(`${url}/sms/validate`,data).then((res) => {
      resolve(res);
    }).then((err) => {
      reject(err);
    });
  });
}

// 获取快递公司名称
export function gettracking(){
  return new Promise((resolve, reject) => {
    ajax.get(`${url}/tracking/com`).then((res) => {
      resolve(res);
    }).then((err) => {
      reject(err);
    });
  });
}

export function fadegettracking(){
  return new Promise((resolve, reject) => {
    ajax.get(`http://v.juhe.cn/exp/com?key=268ee42cfc7431abe5b06211e410c163`).then((res) => {
      resolve(res);
    }).then((err) => {
      reject(err);
    });
  });
}

// 获取快递信息
export function getemail(data){
  return new Promise((resolve, reject) => {
    ajax.post(`${url}/tracking`,data).then((res) => {
      resolve(res);
    }).then((err) => {
      reject(err);
    });
  });
}
