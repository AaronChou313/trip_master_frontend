import { createRouter, createWebHashHistory } from 'vue-router';
import PoisView from '../views/PoisView.vue';
import ItineraryView from '../views/ItineraryView.vue';
import BudgetView from '../views/BudgetView.vue';
import MemosView from '../views/MemosView.vue';
import DeployCheck from '../views/DeployCheck.vue';

const routes = [
  {
    path: '/',
    redirect: '/pois'
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
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;