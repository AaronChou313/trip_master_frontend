import { createRouter, createWebHashHistory } from 'vue-router';
import PoisView from '../views/PoisView.vue';
import ItineraryView from '../views/ItineraryView.vue';
import BudgetView from '../views/BudgetView.vue';
import MemosView from '../views/MemosView.vue';
import DeployCheck from '../views/DeployCheck.vue';
import SimpleCheck from '../views/SimpleCheck.vue';

const routes = [
  {
    path: '/',
    redirect: '/simple-check'
  },
  {
    path: '/pois',
    name: 'Pois',
    component: PoisView
  },
  {
    path: '/itinerary',
    name: 'Itinerary',
    component: ItineraryView
  },
  {
    path: '/budget',
    name: 'Budget',
    component: BudgetView
  },
  {
    path: '/memos',
    name: 'Memos',
    component: MemosView
  },
  {
    path: '/deploy-check',
    name: 'DeployCheck',
    component: DeployCheck
  },
  {
    path: '/simple-check',
    name: 'SimpleCheck',
    component: SimpleCheck
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;