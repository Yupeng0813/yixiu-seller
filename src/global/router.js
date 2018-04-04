import Vue from 'vue'
import Router from 'vue-router'
import businessRegister from '../views/businessRegister/router'
import SellerHome from '../views/sellerHome/router'
import App from '../App'

Vue.use(Router)
export default new Router({
  // mode: 'history',
  base: '/seller/',
  routes: [
    {
      path: '/',
      redirect:'/sellerHome'
    },
    {
      path: "/pay",
      redirect: '/orders'
    },
    ...businessRegister,
    ...SellerHome,
  ]
})
